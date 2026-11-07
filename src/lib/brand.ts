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
// Empty → "Prenota 30 minuti" falls back to the contact form.
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";
// Empty → install buttons point to the beta download.
export const WPORG_URL = process.env.NEXT_PUBLIC_WPORG_URL ?? "";
// Freemius customer portal (sprint 2). Empty → link hidden.
export const ACCOUNT_URL = process.env.NEXT_PUBLIC_ACCOUNT_URL ?? "";
export const BETA_DOWNLOAD_PATH = "/api/wpla/download";
/** "Installa gratis" target: /plugin decides between WordPress.org and the beta download. */
export const INSTALL_PATH = "/plugin#installa";

/** Where "Prenota 30 minuti" goes: Calendly if configured, otherwise the contact page. */
export const BOOKING_URL = CALENDLY_URL || "/contatti";
