import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/brand";
import { configBrevo, creaContattoDoi } from "@/lib/brevo";
import { AGENTI_OFFERTA, RISPOSTE_WORKSPACE, offertaAperta, validaCandidatura } from "@/lib/offerta";
import { controllaLimite, creaLimitatore, intestazioniLimite } from "@/lib/ratelimit";

// POST /api/candidatura: application to the 5-client launch offer (docs/lancio/01-piano-sprint.md, A.4).
// The application reaches the agency inbox through Resend. Brevo (double opt-in, FONTE=offerta) only when
// the visitor ticked the separate, optional "aggiornamenti" consent.

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
const RESEND_FROM = process.env.RESEND_FROM || "aiframe <noreply@aiframe.it>";

const limitatore = creaLimitatore("candidatura", 5, "60 s");

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const limite = await controllaLimite(limitatore, request);
  if (!limite.ok) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprovate tra un minuto." },
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

  // Honeypot: real visitors never see this field. Bots that fill it get a silent 200.
  if (typeof body.sito_web === "string" && body.sito_web.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!offertaAperta()) {
    return NextResponse.json({ error: "Le candidature sono chiuse." }, { status: 410 });
  }

  const esito = validaCandidatura(body);
  if (!esito.ok) {
    return NextResponse.json({ error: "Controllate i campi segnati.", errori: esito.errori }, { status: 400 });
  }
  const c = esito.dati;

  // Never a fake success: without Resend nobody would read the application.
  if (!process.env.RESEND_API_KEY) {
    console.warn("candidatura: RESEND_API_KEY non configurata, candidatura non inviata");
    return NextResponse.json({ error: "Candidature non ancora attive." }, { status: 503 });
  }

  const agente = AGENTI_OFFERTA.find((a) => a.valore === c.agente)?.etichetta ?? c.agente;
  const workspace = RISPOSTE_WORKSPACE.find((r) => r.valore === c.workspace)?.etichetta ?? c.workspace;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO_EMAIL,
      replyTo: c.email,
      subject: `Candidatura all'offerta: ${c.azienda}`,
      html: `
        <h2>Candidatura all'offerta per 5 clienti</h2>
        <p><strong>Nome:</strong> ${escapeHtml(c.nome)}</p>
        <p><strong>Azienda:</strong> ${escapeHtml(c.azienda)}</p>
        <p><strong>Email:</strong> ${escapeHtml(c.email)}</p>
        <p><strong>Sito:</strong> ${escapeHtml(c.sito) || "Non indicato"}</p>
        <p><strong>Agente:</strong> ${escapeHtml(agente)}</p>
        <p><strong>Google Workspace:</strong> ${escapeHtml(workspace)}</p>
        <p><strong>Richieste al mese:</strong> ${escapeHtml(c.volume) || "Non indicato"}</p>
        <p><strong>Come le gestiscono oggi:</strong><br>${escapeHtml(c.processo).replace(/\n/g, "<br>")}</p>
        <p><strong>Aggiornamenti via email:</strong> ${c.aggiornamenti ? "sì (doppia conferma in Brevo)" : "no"}</p>
      `,
    });
    if (error) {
      // Log the provider error name only: the payload contains personal data.
      console.error("candidatura: errore Resend", error.name);
      return NextResponse.json({ error: "Non siamo riusciti a inviare la candidatura." }, { status: 502 });
    }
  } catch (err) {
    console.error("candidatura: errore interno", err instanceof Error ? err.name : err);
    return NextResponse.json({ error: "Non siamo riusciti a inviare la candidatura." }, { status: 502 });
  }

  // The application is already delivered: a Brevo fault must not turn it into an error for the visitor.
  if (c.aggiornamenti) {
    const config = configBrevo();
    if (!config) {
      console.warn("candidatura: Brevo non configurato, iscrizione agli aggiornamenti saltata");
    } else {
      try {
        const brevo = await creaContattoDoi(config, c.email, { FONTE: "offerta" });
        if (!brevo.ok) console.error("candidatura: errore Brevo", brevo.status, brevo.codice ?? "", brevo.messaggio ?? "");
      } catch (err) {
        console.error("candidatura: Brevo non raggiungibile", err instanceof Error ? err.name : err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
