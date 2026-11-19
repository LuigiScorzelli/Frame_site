import Script from "next/script";
import { IUBENDA_ATTIVO, IUBENDA_WIDGET_ID } from "@/lib/iubenda";

/**
 * iubenda Privacy Controls and Cookie Solution, with the embed code from the panel (one widget script).
 * Site ID, policy ID, texts, per-purpose consent and the autoblocking list come from the panel (remote
 * configuration). Here we only add callbacks: the widget keeps an existing _iub.csConfiguration and merges the
 * panel settings into it. Gated scripts are mounted by React after consent (useConsenso in src/lib/consenso.ts).
 *
 * The configuration is a plain inline script in <head>, so it exists before the widget runs. The widget is NOT
 * loaded in <head> as iubenda suggests: its autoblocking rewrites script and link tags (data-cmp-* attributes)
 * before React hydrates, which breaks hydration (React error #418, whole page re-rendered on the client; seen
 * 19/11/2026). Loaded after hydration, the autoblocking is not needed: gated scripts are mounted by React.
 * Callbacks store the latest preference on window and fire an event: React may hydrate before or after
 * iubenda reads the consent cookie.
 */
export default function Iubenda() {
  if (!IUBENDA_ATTIVO) return null;

  const configurazione = `
window._iub = window._iub || [];
(function () {
  function invia(p) {
    try { if (!p && _iub.cs && _iub.cs.api && _iub.cs.api.getPreferences) p = _iub.cs.api.getPreferences(); } catch (e) {}
    window.__consensoIubenda = p || window.__consensoIubenda || null;
    window.dispatchEvent(new CustomEvent("iubenda:consenso", { detail: window.__consensoIubenda }));
  }
  _iub.csConfiguration = _iub.csConfiguration || {};
  // Host-only consent cookie. Otherwise iubenda writes it on the registrable domain, which on Vercel previews
  // is .vercel.app, a public suffix the browser rejects: consent was lost on every page (seen 19/11/2026).
  // In production the site lives only on www.aiframe.it (aiframe.it redirects there).
  _iub.csConfiguration.localConsentDomainExact = true;
  _iub.csConfiguration.callback = {
    onConsentRead: function () { invia(); },
    onConsentGiven: function () { invia(); },
    onConsentRejected: function () { invia(); },
    onPreferenceExpressed: function (p) { invia(p); }
  };
})();`;

  return (
    <>
      <script id="iubenda-config" dangerouslySetInnerHTML={{ __html: configurazione }} />
      <Script id="iubenda-widget" strategy="afterInteractive" src={`https://embeds.iubenda.com/widgets/${IUBENDA_WIDGET_ID}.js`} />
    </>
  );
}
