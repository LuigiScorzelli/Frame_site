// Cloudflare Turnstile, server side: checks the token the form got from the widget.
// Off until TURNSTILE_SECRET_KEY is set (local development, previews without keys): the forms then work as
// before, protected by the honeypot and the rate limits only.

const VERIFICA_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** Cloudflare's own limit for a token. */
const MAX_TOKEN = 2048;

export const ERRORE_TURNSTILE = "Verifica anti-bot non riuscita. Ricarica la pagina e riprova.";

let avvisoMostrato = false;

export function turnstileAttivo(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/**
 * True when the request may go on. A missing, malformed, expired or already used token is refused.
 * If Cloudflare itself does not answer, the request passes and the fault is logged: an outage on their
 * side must not close every form, and the rate limits still apply.
 */
export async function verificaTurnstile(token: unknown): Promise<boolean> {
  const segreta = process.env.TURNSTILE_SECRET_KEY;
  if (!segreta) {
    if (!avvisoMostrato) {
      console.warn("turnstile: TURNSTILE_SECRET_KEY non configurata, verifica anti-bot disattivata");
      avvisoMostrato = true;
    }
    return true;
  }
  if (typeof token !== "string" || token.length === 0 || token.length > MAX_TOKEN) return false;

  try {
    const res = await fetch(VERIFICA_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: segreta, response: token }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (res.status >= 500) {
      console.error("turnstile: Cloudflare ha risposto", res.status, "richiesta lasciata passare");
      return true;
    }
    const esito = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (esito.success === true) return true;
    const codici = esito["error-codes"] ?? [];
    if (codici.includes("internal-error")) {
      console.error("turnstile: internal-error di Cloudflare, richiesta lasciata passare");
      return true;
    }
    // A wrong secret would refuse every visitor: make it visible in the logs.
    if (codici.includes("invalid-input-secret") || codici.includes("missing-input-secret")) {
      console.error("turnstile: chiave segreta non valida, tutti i moduli rispondono 403");
    }
    return false;
  } catch (err) {
    console.error("turnstile: Cloudflare non raggiungibile, richiesta lasciata passare", err instanceof Error ? err.name : err);
    return true;
  }
}
