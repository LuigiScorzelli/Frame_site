// Single source of truth for brand names and external links.
// No component may hard-code the plugin name or an external URL.

export const AGENCY_NAME = "aiframe";
// Visual logo only (Luigi, 7/11): the name in copy stays AGENCY_NAME.
export const LOGO_TEXT = "FR>ME";
// Provisional name until the final one is chosen (see docs/lancio/00-LEGGIMI.md).
export const PLUGIN_NAME = process.env.NEXT_PUBLIC_PLUGIN_NAME ?? "Lead Assistant";
export const CONTACT_EMAIL = "info@aiframe.it";
export const SITE_URL = "https://aiframe.it";
export const FOUNDER_URL = "https://luigiscorzelli.com";
export const CITY = "Salerno";
// Public booking link, rendered in the HTML: plain config, not an env var (Luigi, 9/11).
// Empty → "Prenota 30 minuti" falls back to the contact form.
export const CALENDLY_URL = "https://calendly.com/luigi-scorzelli/30min";
// Empty → install buttons point to the beta download.
export const WPORG_URL = process.env.NEXT_PUBLIC_WPORG_URL ?? "";
// Freemius customer portal (sprint 2). Empty → link hidden.
export const ACCOUNT_URL = process.env.NEXT_PUBLIC_ACCOUNT_URL ?? "";
export const BETA_DOWNLOAD_PATH = "/api/wpla/download";
/** "Installa gratis" target: /plugin decides between WordPress.org and the beta download. */
export const INSTALL_PATH = "/plugin#installa";

/**
 * AI assistant on this site: the plugin's standalone widget (public/assistente/, copied unchanged from
 * assisteAI_CRM/widget/src/wpla-widget.js; the commit is in the file name) talking to the n8n workflow
 * "WP Lead Assistant - Servizi" on our VPS. New origins go in wpla_tenants.allowed_origins, not here.
 */
export const ASSISTANT = {
  scriptPath: "/assistente/wpla-widget-b4d6338.js",
  endpoint: "https://n8n.aiframe.it/webhook/wpla-chat",
  siteKey: "aiframe",
  mode: "servizi",
  title: `Assistente di ${AGENCY_NAME}`,
  company: AGENCY_NAME,
  // Text on top of it is white, so it must be dark; bg-2, because bg-0 hides the launcher on the page background.
  color: "#1E2D4A",
  // Relative: the widget accepts same-site paths, so previews link their own /privacy.
  privacyUrl: "/privacy",
  fallbackEmail: CONTACT_EMAIL,
  launcherLabel: "Hai domande? Chiedi all'assistente",
  suggestions: [
    "Cosa fate per le piccole aziende?",
    "Come funziona il plugin WordPress?",
    "Come si inizia a lavorare con voi?",
  ],
} as const;

/** Where "Prenota 30 minuti" goes: Calendly if configured, otherwise the contact page. */
export const BOOKING_URL = CALENDLY_URL || "/contatti";
