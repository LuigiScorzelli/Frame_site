// Shared cleaning and validation of visitor input for the public API routes.
// Every free-text field goes through riga() or testo() before it reaches an email, a log or Redis.

export const MAX_EMAIL = 200;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// C0/C1 control characters, zero-width and bidirectional-override characters: invisible in an email
// subject or body, useful only to forge headers or disguise text.
const INVISIBILI = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u2069\uFEFF]/g;

/**
 * Email check. The length is tested first on purpose: the regex takes quadratic time on long
 * crafted strings, so it must never run on unbounded input.
 */
export function emailValida(email: string): boolean {
  return email.length <= MAX_EMAIL && EMAIL_REGEX.test(email);
}

/**
 * Email field as typed, trimmed. Never cut to a maximum: a cut could turn an over-long hostile string
 * into a valid-looking address. emailValida() refuses anything too long instead.
 */
export function campoEmail(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Single-line field (name, company, subject): no line breaks, no invisible characters. */
export function riga(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.slice(0, max * 4).replace(INVISIBILI, "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

/** Multi-line field (message): line breaks are kept, invisible characters removed. */
export function testo(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.slice(0, max * 4).replace(INVISIBILI, "").replace(/\r\n?/g, "\n").trim().slice(0, max);
}
