// iubenda: privacy and cookie policy plus the consent banner. Both IDs are public (they end up in the page HTML),
// so they live in NEXT_PUBLIC_* variables. Without them the banner is not loaded and every script loads as before.

export const IUBENDA_SITE_ID = process.env.NEXT_PUBLIC_IUBENDA_SITE_ID ?? "";
/** The same ID serves the privacy policy and the cookie policy. */
export const IUBENDA_POLICY_ID = process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID ?? "";
export const IUBENDA_ATTIVO = Boolean(IUBENDA_SITE_ID && IUBENDA_POLICY_ID);

export const PRIVACY_POLICY_URL = IUBENDA_ATTIVO ? `https://www.iubenda.com/privacy-policy/${IUBENDA_POLICY_ID}` : "";
export const COOKIE_POLICY_URL = IUBENDA_ATTIVO
  ? `https://www.iubenda.com/privacy-policy/${IUBENDA_POLICY_ID}/cookie-policy`
  : "";

/** iubenda purposes (per-purpose consent). */
export const FINALITA = {
  necessari: 1,
  funzionalita: 2,
  esperienza: 3,
  misurazione: 4,
  marketing: 5,
} as const;
export type Finalita = (typeof FINALITA)[keyof typeof FINALITA];

// Which purpose gates what (Luigi, 19/11/2026):
// - Umami, Vercel Analytics and Speed Insights: cookieless, but loaded only after "Misurazione" consent while
//   par. 7.2 of the Garante cookie guidelines stays open for cookieless tools.
// - Calendly: the embed sets third-party cookies (_calendly_session, __cf_bm, _cfuvid; checked 19/11/2026).
export const FINALITA_STATISTICHE: Finalita = FINALITA.misurazione;
export const FINALITA_CALENDLY: Finalita = FINALITA.esperienza;
