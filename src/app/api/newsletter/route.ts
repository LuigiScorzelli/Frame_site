import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@aiframe.it";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

export async function POST(request: Request) {
  try {
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
    const { email } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Inserisci un'email valida." }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    console.log("Newsletter subscription:", sanitizedEmail);

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "FR>ME Newsletter <noreply@aiframe.it>",
        to: CONTACT_TO_EMAIL,
        subject: `Nuova iscrizione newsletter: ${sanitizedEmail}`,
        html: `<p>Nuova iscrizione alla newsletter: <strong>${sanitizedEmail}</strong></p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
