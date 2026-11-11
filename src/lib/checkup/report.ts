import { AGENCY_NAME, BOOKING_URL, CONTACT_EMAIL, INSTALL_PATH, SITE_URL } from "@/lib/brand";
import type { RisultatoCheckup } from "./index";

// HTML email with the check-up report (docs/lancio/02-specifiche.md, section 5): total score,
// the 3 lowest items with the remedy. Inline styles only. The visitor's site appears as escaped
// text, never as a link: our emails must not carry links chosen by someone else.

function escapa(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/** Host without www, as shown to the visitor ("esempio.it"). */
export function nomeSito(sito: string): string {
  try {
    return new URL(sito).hostname.replace(/^www\./, "");
  } catch {
    return sito;
  }
}

export function oggettoReport(r: RisultatoCheckup): string {
  return `Il check-up di ${nomeSito(r.sito)}: ${r.punteggio}/100`;
}

/** The 3 items with the fewest points (ties keep the page order). */
export function vociDaSistemare(r: RisultatoCheckup) {
  return [...r.voci].sort((a, b) => a.punti / a.max - b.punti / b.max).slice(0, 3);
}

export function htmlReport(r: RisultatoCheckup): string {
  const sito = escapa(nomeSito(r.sito));
  const installa = `${SITE_URL}${INSTALL_PATH}`;
  const prenota = BOOKING_URL.startsWith("http") ? BOOKING_URL : `${SITE_URL}${BOOKING_URL}`;
  const voci = vociDaSistemare(r)
    .map(
      (v) => `
      <tr><td style="padding:16px 0;border-top:1px solid #E2E8F0;">
        <p style="margin:0;font-size:16px;font-weight:bold;color:#0B1120;">${escapa(v.nome)} · ${v.punti}/${v.max}</p>
        <p style="margin:6px 0 0;font-size:15px;line-height:1.5;color:#334155;">${escapa(v.spiegazione)}</p>
        <p style="margin:8px 0 0;font-size:15px;line-height:1.5;color:#0B1120;"><strong>Cosa fare:</strong> ${escapa(v.rimedio)}</p>
      </td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="it"><body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;padding:32px;">
  <tr><td>
    <p style="margin:0;font-size:13px;letter-spacing:2px;color:#64748B;">CHECK-UP DI ${AGENCY_NAME.toUpperCase()}</p>
    <h1 style="margin:12px 0 0;font-size:24px;line-height:1.3;color:#0B1120;">${sito}: ${r.punteggio}/100</h1>
    <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:#334155;">
      Ecco le tre cose da sistemare per prime, in ordine di punteggio. Sito WordPress: ${r.wordpress ? "sì" : "no"}.
    </p>
  </td></tr>
  ${voci}
  <tr><td style="padding-top:24px;border-top:1px solid #E2E8F0;">
    <p style="margin:0;font-size:15px;line-height:1.5;color:#334155;">La voce "fuori orario" si sistema in 5 minuti con il nostro plugin gratuito per WordPress.</p>
    <p style="margin:16px 0 0;">
      <a href="${installa}" style="display:inline-block;background:#BFFF00;color:#0B1120;padding:12px 20px;font-weight:bold;text-decoration:none;">Installa gratis</a>
      &nbsp;
      <a href="${prenota}" style="display:inline-block;border:1px solid #0B1120;color:#0B1120;padding:11px 20px;font-weight:bold;text-decoration:none;">Prenota 30 minuti</a>
    </p>
  </td></tr>
  <tr><td style="padding-top:24px;">
    <p style="margin:0;font-size:12px;line-height:1.5;color:#64748B;">
      Controllo automatico dell'HTML della home e della pagina contatti, senza eseguire JavaScript: alcune chat o moduli
      caricati dopo possono sfuggire. Hai ricevuto questa email perché l'hai chiesta dal check-up di ${AGENCY_NAME}.
      Per domande rispondi a questa email o scrivi a ${CONTACT_EMAIL}.
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

/** Plain-text version for clients that do not show HTML. */
export function testoReport(r: RisultatoCheckup): string {
  const voci = vociDaSistemare(r)
    .map((v) => `${v.nome} (${v.punti}/${v.max})\n${v.spiegazione}\nCosa fare: ${v.rimedio}`)
    .join("\n\n");
  return `Check-up di ${nomeSito(r.sito)}: ${r.punteggio}/100\n\nLe tre cose da sistemare per prime:\n\n${voci}\n\nInstalla gratis: ${SITE_URL}${INSTALL_PATH}\n`;
}
