// Cloudflare Turnstile, server side: checks the token the form got from the widget.
// Off until TURNSTILE_SECRET_KEY is set (local development, previews without keys): the forms then work as
// before, protected by the honeypot and the rate limits only.

const VERIFICA_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** Cloudflare's own limit for a token. */
const MAX_TOKEN = 2048;

export const ERRORE_TURNSTILE = "Verifica anti-bot non riuscita. Ricarica la pagina e riprova.";

export type EsitoTurnstile = { ok: true } | { ok: false; motivo: string };

let avvisoMostrato = false;

export function turnstileAttivo(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/** What the browser says went wrong with the widget (see useTurnstile): a short code, never free text. */
function esitoBrowser(v: unknown): string {
  return typeof v === "string" && /^[a-z0-9-]{1,40}$/i.test(v) ? v.toLowerCase() : "non-dichiarato";
}

/**
 * Checks the token. A missing, malformed, expired or already used token is refused, and the reason is
 * logged as a short code (no personal data): "senza-token:<what the browser reported>" or Cloudflare's own
 * error codes. If Cloudflare itself does not answer, the request passes and the fault is logged: an outage
 * on their side must not close every form, and the rate limits still apply.
 */
export async function verificaTurnstile(token: unknown, esitoDalBrowser?: unknown): Promise<EsitoTurnstile> {
  const segreta = process.env.TURNSTILE_SECRET_KEY;
  if (!segreta) {
    if (!avvisoMostrato) {
      console.warn("turnstile: TURNSTILE_SECRET_KEY non configurata, verifica anti-bot disattivata");
      avvisoMostrato = true;
    }
    return { ok: true };
  }
  const rifiuta = (motivo: string): EsitoTurnstile => {
    console.warn("turnstile: richiesta rifiutata", motivo);
    return { ok: false, motivo };
  };
  if (typeof token !== "string" || token.length === 0) return rifiuta(`senza-token:${esitoBrowser(esitoDalBrowser)}`);
  if (token.length > MAX_TOKEN) return rifiuta("token-troppo-lungo");

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
      return { ok: true };
    }
    const esito = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (esito.success === true) return { ok: true };
    const codici = (esito["error-codes"] ?? []).filter((c) => /^[a-z-]{1,40}$/.test(c));
    if (codici.includes("internal-error")) {
      console.error("turnstile: internal-error di Cloudflare, richiesta lasciata passare");
      return { ok: true };
    }
    // A wrong secret would refuse every visitor: make it visible in the logs.
    if (codici.includes("invalid-input-secret") || codici.includes("missing-input-secret")) {
      console.error("turnstile: chiave segreta non valida, tutti i moduli rispondono 403");
    }
    return rifiuta(`cloudflare:${codici.join("+") || "senza-codice"}`);
  } catch (err) {
    console.error("turnstile: Cloudflare non raggiungibile, richiesta lasciata passare", err instanceof Error ? err.name : err);
    return { ok: true };
  }
}

/**
 * For the routes: null when the request may go on, otherwise the message for the visitor. The message ends
 * with the reason code, so a visitor who writes to us can tell us which step failed.
 */
export async function controllaTurnstile(body: Record<string, unknown>): Promise<string | null> {
  const esito = await verificaTurnstile(body.turnstile, body.turnstile_esito);
  return esito.ok ? null : `${ERRORE_TURNSTILE} Codice: ${esito.motivo}`;
}
