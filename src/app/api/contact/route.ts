import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@aiframe.it";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Simple in-memory rate limiting (per IP, resets on server restart)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (entry && now < entry.resetAt) {
      entry.count++;
      if (entry.count > RATE_LIMIT) {
        return NextResponse.json({ error: "Troppe richieste. Riprova tra poco." }, { status: 429 });
      }
    } else {
      rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    }

    const body = await request.json();
    const { nome, email, azienda, messaggio, data_preferita, orario } = body;

    // Validation
    const errors: string[] = [];

    if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
      errors.push("Il nome deve avere almeno 2 caratteri");
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      errors.push("Inserisci un'email valida");
    }
    if (azienda && typeof azienda === "string" && azienda.trim().length > 0 && azienda.trim().length < 2) {
      errors.push("Il nome azienda deve avere almeno 2 caratteri");
    }
    if (!data_preferita || typeof data_preferita !== "string" || data_preferita.trim().length === 0) {
      errors.push("Seleziona una data");
    }
    if (!orario || typeof orario !== "string" || orario.trim().length === 0) {
      errors.push("Seleziona un orario");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Sanitize
    const sanitized = {
      nome: escapeHtml(nome.trim()),
      email: escapeHtml(email.trim()),
      azienda: azienda ? escapeHtml(azienda.trim()) : "",
      messaggio: messaggio ? escapeHtml(String(messaggio).trim()) : "",
      data_preferita: escapeHtml(data_preferita.trim()),
      orario: escapeHtml(orario.trim()),
    };

    // Audit log
    console.log("New contact request:", sanitized);

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "FR>ME Contatti <noreply@aiframe.it>",
        to: CONTACT_TO_EMAIL,
        subject: `Nuova richiesta da ${sanitized.nome}`,
        html: `
          <h2>Nuova richiesta di contatto</h2>
          <p><strong>Nome:</strong> ${sanitized.nome}</p>
          <p><strong>Email:</strong> ${sanitized.email}</p>
          <p><strong>Azienda:</strong> ${sanitized.azienda || "Non specificata"}</p>
          <p><strong>Data preferita:</strong> ${sanitized.data_preferita}</p>
          <p><strong>Orario:</strong> ${sanitized.orario}</p>
          <p><strong>Messaggio:</strong> ${sanitized.messaggio || "Nessun messaggio"}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
