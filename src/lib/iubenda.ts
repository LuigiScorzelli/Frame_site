// iubenda: consent banner (Privacy Controls and Cookie Solution) and privacy/cookie policy.
// Both IDs are public (they end up in the page HTML), so they live in NEXT_PUBLIC_* variables.
// - NEXT_PUBLIC_IUBENDA_WIDGET_ID: the id in the panel's embed code, embeds.iubenda.com/widgets/<id>.js.
//   Empty: no banner, statistics and Calendly load as before.
// - NEXT_PUBLIC_IUBENDA_POLICY_ID: the policy id (cookiePolicyId). Set it only once the policy is published
//   on iubenda (paid licence): before that the iubenda policy URLs answer 404.

export const IUBENDA_WIDGET_ID = process.env.NEXT_PUBLIC_IUBENDA_WIDGET_ID ?? "";
export const IUBENDA_POLICY_ID = process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID ?? "";
export const IUBENDA_ATTIVO = /^[0-9a-f-]{36}$/i.test(IUBENDA_WIDGET_ID);
export const POLICY_ATTIVA = /^\d+$/.test(IUBENDA_POLICY_ID);

export const PRIVACY_POLICY_URL = POLICY_ATTIVA ? `https://www.iubenda.com/privacy-policy/${IUBENDA_POLICY_ID}` : "";
export const COOKIE_POLICY_URL = POLICY_ATTIVA ? `${PRIVACY_POLICY_URL}/cookie-policy` : "";

/** iubenda purposes (per-purpose consent is on in the panel). */
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
//   iubenda's own vendor list puts Calendly (vendor 1857) under purpose 3 too.
export const FINALITA_STATISTICHE: Finalita = FINALITA.misurazione;
export const FINALITA_CALENDLY: Finalita = FINALITA.esperienza;
