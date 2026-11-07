// Minimal Brevo client: only double opt-in contact creation (docs/lancio/02-specifiche.md, section 5).

export type Fonte = "newsletter" | "checkup" | "beta";

interface ConfigBrevo {
  apiKey: string;
  listId: number;
  templateId: number;
  redirectUrl: string;
}

/** Null when any required variable is missing: callers answer 503, never a fake success. */
export function configBrevo(): ConfigBrevo | null {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const redirectUrl = process.env.BREVO_REDIRECT_URL;
  if (!apiKey || !Number.isInteger(listId) || listId <= 0 || !Number.isInteger(templateId) || templateId <= 0 || !redirectUrl) {
    return null;
  }
  return { apiKey, listId, templateId, redirectUrl };
}

export type EsitoBrevo = { ok: true } | { ok: false; status: number; codice?: string; messaggio?: string };

/**
 * Sends the double opt-in email. Brevo answers 201 for a new contact and 204 for an existing one:
 * both are a success for the visitor.
 */
export async function creaContattoDoi(
  config: ConfigBrevo,
  email: string,
  attributi: Record<string, string>,
): Promise<EsitoBrevo> {
  const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: { "api-key": config.apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      attributes: attributi,
      includeListIds: [config.listId],
      templateId: config.templateId,
      redirectionUrl: config.redirectUrl,
    }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (res.ok) return { ok: true };
  const corpo = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
  // Brevo's message says which parameter failed; mask the email in case it is echoed back.
  const messaggio = (corpo.message ?? "").split(email).join("<email>").slice(0, 300);
  return { ok: false, status: res.status, codice: corpo.code, messaggio };
}
