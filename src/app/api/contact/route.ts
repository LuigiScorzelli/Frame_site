import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/brand";
import { controllaLimite, creaLimitatore, intestazioniLimite } from "@/lib/ratelimit";

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;
const RESEND_FROM = process.env.RESEND_FROM || "aiframe <noreply@aiframe.it>";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 10 requests per minute per IP: the 11th gets 429 (docs/lancio/01-piano-sprint.md, 0.8).
const limitatore = creaLimitatore("contact", 10, "60 s");

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function testo(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const limite = await controllaLimite(limitatore, request);
  if (!limite.ok) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra poco." },
      { status: 429, headers: intestazioniLimite(limite) },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
  } catch {
    return NextResponse.json({ errors: ["Richiesta non valida"] }, { status: 400 });
  }

  // Honeypot: real visitors never see this field. Bots that fill it get a silent 200.
  if (testo(body.sito_web, 500).length > 0) {
    return NextResponse.json({ success: true });
  }

  const nome = testo(body.nome, 120);
  const email = testo(body.email, 200);
  const sito = testo(body.sito, 300);
  const messaggio = testo(body.messaggio, 5000);
  const dataPreferita = testo(body.data_preferita, 60);
  const orario = testo(body.orario, 20);

  const errors: string[] = [];
  if (nome.length < 2) errors.push("Il nome deve avere almeno 2 caratteri");
  if (!EMAIL_REGEX.test(email)) errors.push("Inserisci un'email valida");
  if (body.consenso !== true) errors.push("Serve il consenso al trattamento dei dati");
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const s = {
    nome: escapeHtml(nome),
    email: escapeHtml(email),
    sito: escapeHtml(sito),
    messaggio: escapeHtml(messaggio),
    dataPreferita: escapeHtml(dataPreferita),
    orario: escapeHtml(orario),
  };

  if (!process.env.RESEND_API_KEY) {
    console.warn("contact: RESEND_API_KEY non configurata, email non inviata");
    return NextResponse.json({ success: true });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Nuova richiesta da ${nome}`,
      html: `
        <h2>Nuova richiesta di contatto</h2>
        <p><strong>Nome:</strong> ${s.nome}</p>
        <p><strong>Email:</strong> ${s.email}</p>
        <p><strong>Sito:</strong> ${s.sito || "Non indicato"}</p>
        ${s.dataPreferita ? `<p><strong>Preferenza per la call:</strong> ${s.dataPreferita} ${s.orario}</p>` : ""}
        <p><strong>Messaggio:</strong> ${s.messaggio || "Nessun messaggio"}</p>
      `,
    });
    if (error) {
      // Log the provider error name only: the payload contains personal data.
      console.error("contact: errore Resend", error.name);
      return NextResponse.json({ error: "Errore nell'invio dell'email" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("contact: errore interno", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
