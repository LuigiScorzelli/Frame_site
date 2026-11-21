import { NextResponse } from "next/server";
import { Resend } from "resend";
import { AGENCY_NAME, CONTACT_EMAIL } from "@/lib/brand";
import { configBrevo, creaContattoDoi } from "@/lib/brevo";
import { archivioCandidatureAttivo, salvaCandidatura, segnaEmailAgenzia } from "@/lib/candidature";
import { AGENTI_OFFERTA, CAMPO_TRAPPOLA, RISPOSTE_WORKSPACE, offertaAperta, validaCandidatura } from "@/lib/offerta";
import {
  controllaLimite,
  controllaLimiteChiave,
  creaLimitatore,
  hashSalato,
  intestazioniLimite,
} from "@/lib/ratelimit";

// POST /api/candidatura: application to the 5-client launch offer (docs/lancio/01-piano-sprint.md, A.4).
// Order: 1) copy in Upstash (src/lib/candidature.ts), 2) email to the agency inbox through Resend.
// The visitor sees success only when both worked. Then, best effort: a receipt to the applicant and Brevo
// (double opt-in, FONTE=offerta) only when the visitor ticked the separate, optional "aggiornamenti" consent.

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
const RESEND_FROM = process.env.RESEND_FROM || "aiframe <noreply@aiframe.it>";

const limitatore = creaLimitatore("candidatura", 5, "60 s");
// Per recipient: the receipt and the Brevo confirmation go to an address nobody verified yet.
const limitatoreEmail = creaLimitatore("candidatura-email", 3, "24 h");

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
  // "sito_web" is the old name, still accepted from pages cached before the rename.
  const trappola = [body[CAMPO_TRAPPOLA], body.sito_web].some((v) => typeof v === "string" && v.trim().length > 0);
  if (trappola) {
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

  // Never a fake success: without Resend nobody would read the application, without Upstash it has no copy.
  if (!process.env.RESEND_API_KEY || !archivioCandidatureAttivo()) {
    console.warn(
      "candidatura: servizio non configurato, candidatura non inviata",
      !process.env.RESEND_API_KEY ? "RESEND_API_KEY" : "Upstash",
    );
    return NextResponse.json({ error: "Candidature non ancora attive." }, { status: 503 });
  }

  let chiave: string;
  try {
    chiave = await salvaCandidatura(c);
  } catch (err) {
    console.error("candidatura: salvataggio non riuscito", err instanceof Error ? err.name : err);
    return NextResponse.json({ error: "Non siamo riusciti a inviare la candidatura." }, { status: 502 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const agente = AGENTI_OFFERTA.find((a) => a.valore === c.agente)?.etichetta ?? c.agente;
  const workspace = RISPOSTE_WORKSPACE.find((r) => r.valore === c.workspace)?.etichetta ?? c.workspace;

  try {
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
        <p style="color:#666"><small>Copia salvata: ${escapeHtml(chiave)}</small></p>
      `,
    });
    if (error) {
      // Log the provider error name only: the payload contains personal data.
      console.error("candidatura: errore Resend", error.name);
      await segnaEmailAgenzia(chiave, "non_inviata");
      return NextResponse.json({ error: "Non siamo riusciti a inviare la candidatura." }, { status: 502 });
    }
  } catch (err) {
    console.error("candidatura: errore interno", err instanceof Error ? err.name : err);
    await segnaEmailAgenzia(chiave, "non_inviata");
    return NextResponse.json({ error: "Non siamo riusciti a inviare la candidatura." }, { status: 502 });
  }

  await segnaEmailAgenzia(chiave, "inviata");

  // The application is already saved and delivered: from here on a fault is logged, never shown as an error.
  // The address is not verified, so at most 3 messages a day reach it and the receipt carries no text
  // typed by the visitor: the form cannot be used to deliver someone else's words or links from our sender.
  const limiteEmail = await controllaLimiteChiave(limitatoreEmail, hashSalato(`email:${c.email}`));
  if (!limiteEmail.ok) return NextResponse.json({ ok: true });

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: c.email,
      replyTo: CONTACT_TO_EMAIL,
      subject: "Abbiamo ricevuto la vostra candidatura",
      html: `
        <p>Buongiorno,</p>
        <p>abbiamo ricevuto la vostra candidatura all'offerta per i primi 5 clienti (agente: ${escapeHtml(agente)}).</p>
        <p>Vi rispondiamo per email, di solito entro due giorni lavorativi. Se volete aggiungere qualcosa, rispondete a questo messaggio.</p>
        <p>Il team di ${AGENCY_NAME}</p>
      `,
    });
    if (error) console.error("candidatura: ricevuta al candidato non inviata", error.name);
  } catch (err) {
    console.error("candidatura: ricevuta al candidato non inviata", err instanceof Error ? err.name : err);
  }

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
