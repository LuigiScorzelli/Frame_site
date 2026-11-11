import { NextResponse } from "next/server";
import { Resend } from "resend";
import { configBrevo, creaContattoDoi } from "@/lib/brevo";
import { CONTACT_EMAIL } from "@/lib/brand";
import { ErroreCheckup, eseguiCheckup, normalizzaUrl, type RisultatoCheckup } from "@/lib/checkup";
import { htmlReport, nomeSito, oggettoReport, testoReport } from "@/lib/checkup/report";
import {
  controllaLimite,
  controllaLimiteChiave,
  creaLimitatore,
  hashSalato,
  intestazioniLimite,
} from "@/lib/ratelimit";

// POST /api/checkup (sprint 1.1, docs/lancio/02-specifiche.md section 5).
// Body: { url, email?, consenso? }. Answers the 5 scored items; with email + consent it also sends the
// HTML report via Resend and creates the Brevo contact (double opt-in, FONTE=checkup, SITO=host).

export const runtime = "nodejs";
export const maxDuration = 30;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_FROM = process.env.RESEND_FROM || "aiframe <noreply@aiframe.it>";

const limitatore = creaLimitatore("checkup", 10, "1 h");
// Per recipient: the check-up must not become a way to flood someone else's inbox.
const limitatoreEmail = creaLimitatore("checkup-email", 3, "24 h");

const MESSAGGI: Record<ErroreCheckup["codice"], { status: number; error: string }> = {
  url_non_valido: { status: 400, error: "Indirizzo non valido. Scrivi l'indirizzo del sito, ad esempio esempio.it." },
  indirizzo_vietato: { status: 400, error: "Questo indirizzo non si può analizzare." },
  irraggiungibile: { status: 422, error: "Non riusciamo a raggiungere il sito. Controlla l'indirizzo e riprova." },
  timeout: { status: 422, error: "Il sito non ha risposto entro 8 secondi. Riprova tra poco." },
  non_html: { status: 422, error: "L'indirizzo non porta a una pagina web." },
  troppi_redirect: { status: 422, error: "Il sito rimanda ad altri indirizzi troppe volte." },
  errore_http: {
    status: 422,
    error: "Il sito ha rifiutato il nostro controllo (succede con alcuni sistemi anti-bot). Puoi chiederci un controllo a mano.",
  },
};

type EsitoEmail = { report: "inviato" | "non_inviato"; iscrizione: "ok" | "non_attiva" | "errore" };

async function inviaReport(email: string, risultato: RisultatoCheckup): Promise<EsitoEmail["report"]> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("checkup: RESEND_API_KEY non configurata, report non inviato");
    return "non_inviato";
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: email,
      replyTo: CONTACT_EMAIL,
      subject: oggettoReport(risultato),
      html: htmlReport(risultato),
      text: testoReport(risultato),
    });
    if (error) {
      console.error("checkup: errore Resend", error.name);
      return "non_inviato";
    }
    return "inviato";
  } catch (err) {
    console.error("checkup: Resend non raggiungibile", err instanceof Error ? err.name : err);
    return "non_inviato";
  }
}

async function iscrivi(email: string, sito: string): Promise<EsitoEmail["iscrizione"]> {
  const config = configBrevo();
  if (!config) return "non_attiva";
  try {
    let esito = await creaContattoDoi(config, email, { FONTE: "checkup", SITO: sito });
    // Until the SITO attribute exists in Brevo the request is refused: keep the sign-up, drop SITO.
    if (!esito.ok && esito.status === 400 && !/email/i.test(esito.messaggio ?? "")) {
      console.warn("checkup: Brevo ha rifiutato SITO, riprovo senza", esito.codice ?? "", esito.messaggio ?? "");
      esito = await creaContattoDoi(config, email, { FONTE: "checkup" });
    }
    if (esito.ok) return "ok";
    console.error("checkup: errore Brevo", esito.status, esito.codice ?? "", esito.messaggio ?? "");
    return "errore";
  } catch (err) {
    console.error("checkup: Brevo non raggiungibile", err instanceof Error ? err.name : err);
    return "errore";
  }
}

export async function POST(request: Request) {
  const limite = await controllaLimite(limitatore, request);
  if (!limite.ok) {
    return NextResponse.json(
      { error: "Hai fatto molti check-up nell'ultima ora. Riprova più tardi." },
      { status: 429, headers: intestazioniLimite(limite) },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  if (typeof body.url !== "string") {
    return NextResponse.json({ error: MESSAGGI.url_non_valido.error }, { status: 400 });
  }
  let email: string | null = null;
  if (body.email !== undefined && body.email !== null && body.email !== "") {
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_REGEX.test(email) || email.length > 200) {
      return NextResponse.json({ error: "Inserisci un'email valida." }, { status: 400 });
    }
    if (body.consenso !== true) {
      return NextResponse.json({ error: "Serve il consenso per mandarti il report." }, { status: 400 });
    }
  }

  let risultato: RisultatoCheckup & { daCache: boolean };
  try {
    risultato = await eseguiCheckup(normalizzaUrl(body.url));
  } catch (err) {
    if (err instanceof ErroreCheckup) {
      const m = MESSAGGI[err.codice];
      // No URL and no email in the logs: only the outcome.
      console.info("checkup: sito non analizzabile", err.codice, err.codice === "errore_http" ? err.message : "");
      return NextResponse.json({ error: m.error }, { status: m.status });
    }
    console.error("checkup: errore interno", err instanceof Error ? err.name : err);
    return NextResponse.json({ error: "Errore interno. Riprova tra poco." }, { status: 500 });
  }

  const { daCache, ...pubblico } = risultato;
  console.info("checkup: ok", { punteggio: pubblico.punteggio, wordpress: pubblico.wordpress, daCache, email: email !== null });

  if (!email) return NextResponse.json(pubblico);

  const limiteEmail = await controllaLimiteChiave(limitatoreEmail, hashSalato(`email:${email}`));
  if (!limiteEmail.ok) {
    return NextResponse.json({ ...pubblico, email: { report: "non_inviato", iscrizione: "errore" } satisfies EsitoEmail });
  }
  const [report, iscrizione] = await Promise.all([inviaReport(email, pubblico), iscrivi(email, nomeSito(pubblico.sito))]);
  return NextResponse.json({ ...pubblico, email: { report, iscrizione } satisfies EsitoEmail });
}
