import { NextResponse } from "next/server";
import { configBrevo, creaContattoDoi, type Fonte } from "@/lib/brevo";
import { controllaLimite, creaLimitatore, intestazioniLimite } from "@/lib/ratelimit";

// POST /api/newsletter: Brevo contact with double opt-in and FONTE attribute (0.7).
// Body: { email, fonte: "newsletter" | "checkup" | "beta", consenso: true, interesse? }.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FONTI: readonly Fonte[] = ["newsletter", "checkup", "beta"];
const INTERESSE_REGEX = /^[a-z0-9-]{1,32}$/;

const limitatore = creaLimitatore("newsletter", 5, "60 s");

export async function POST(request: Request) {
  const limite = await controllaLimite(limitatore, request);
  if (!limite.ok) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra un minuto." },
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

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_REGEX.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Inserisci un'email valida." }, { status: 400 });
  }
  if (body.consenso !== true) {
    return NextResponse.json({ error: "Serve il consenso per mandarti le email." }, { status: 400 });
  }
  const fonte = body.fonte;
  if (typeof fonte !== "string" || !FONTI.includes(fonte as Fonte)) {
    return NextResponse.json({ error: "Fonte non valida." }, { status: 400 });
  }
  let interesse: string | undefined;
  if (body.interesse !== undefined) {
    if (typeof body.interesse !== "string" || !INTERESSE_REGEX.test(body.interesse)) {
      return NextResponse.json({ error: "Interesse non valido." }, { status: 400 });
    }
    interesse = body.interesse;
  }

  const config = configBrevo();
  if (!config) {
    console.warn("newsletter: Brevo non configurato (BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID, BREVO_REDIRECT_URL)");
    return NextResponse.json({ error: "Iscrizioni non ancora attive" }, { status: 503 });
  }

  try {
    const esito = await creaContattoDoi(config, email, {
      FONTE: fonte,
      ...(interesse ? { INTERESSE: interesse } : {}),
    });
    if (esito.ok) return NextResponse.json({ ok: true });

    // Never log the email: only status and Brevo's error code.
    console.error("newsletter: errore Brevo", esito.status, esito.codice ?? "", esito.messaggio ?? "");
    // invalid_parameter also covers configuration faults (e.g. "An active DOI template does not exist"):
    // blame the visitor's email only when Brevo's message is about the email.
    if (esito.status === 400 && esito.codice === "invalid_parameter" && /email/i.test(esito.messaggio ?? "")) {
      return NextResponse.json({ error: "Inserisci un'email valida." }, { status: 400 });
    }
    return NextResponse.json({ error: "Non siamo riusciti a iscriverti. Riprova più tardi." }, { status: 502 });
  } catch (err) {
    console.error("newsletter: Brevo non raggiungibile", err instanceof Error ? err.name : err);
    return NextResponse.json({ error: "Non siamo riusciti a iscriverti. Riprova più tardi." }, { status: 502 });
  }
}
