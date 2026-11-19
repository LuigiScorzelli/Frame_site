import Script from "next/script";
import { IUBENDA_ATTIVO, IUBENDA_POLICY_ID, IUBENDA_SITE_ID } from "@/lib/iubenda";

/**
 * iubenda Privacy Controls and Cookie Solution. Texts, colours and the list of services are set in the iubenda
 * panel; here only the IDs and the callbacks that tell React which purposes are accepted. Gated scripts are
 * mounted by React after consent (useConsenso in src/lib/consenso.ts), not by iubenda's prior blocking.
 *
 * The configuration is a plain inline script, so it exists before iubenda_cs.js runs. Callbacks store the latest
 * preference on window and fire an event: React may hydrate before or after iubenda reads the consent cookie.
 */
export default function Iubenda() {
  if (!IUBENDA_ATTIVO) return null;

  const configurazione = `
var _iub = _iub || [];
(function () {
  function invia(p) {
    try { if (!p && _iub.cs && _iub.cs.api && _iub.cs.api.getPreferences) p = _iub.cs.api.getPreferences(); } catch (e) {}
    window.__consensoIubenda = p || window.__consensoIubenda || null;
    window.dispatchEvent(new CustomEvent("iubenda:consenso", { detail: window.__consensoIubenda }));
  }
  _iub.csConfiguration = {
    siteId: ${Number(IUBENDA_SITE_ID)},
    cookiePolicyId: ${Number(IUBENDA_POLICY_ID)},
    lang: "it",
    perPurposeConsent: true,
    storage: { useSiteId: true },
    callback: {
      onConsentRead: function () { invia(); },
      onConsentGiven: function () { invia(); },
      onConsentRejected: function () { invia(); },
      onPreferenceExpressed: function (p) { invia(p); }
    }
  };
})();`;

  return (
    <>
      <script id="iubenda-config" dangerouslySetInnerHTML={{ __html: configurazione }} />
      <Script id="iubenda-cs" strategy="afterInteractive" src="https://cdn.iubenda.com/cs/iubenda_cs.js" />
    </>
  );
}
