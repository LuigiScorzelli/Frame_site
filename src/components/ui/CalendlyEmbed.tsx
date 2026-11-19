"use client";

import Script from "next/script";
import { apriPreferenze, useConsenso } from "@/lib/consenso";
import { FINALITA_CALENDLY } from "@/lib/iubenda";
import { CONTACT_EMAIL } from "@/lib/brand";

/**
 * Calendly inline widget. The script is loaded only on pages that render this component, and only after the
 * visitor accepts the purpose Calendly needs: the embed sets third-party cookies (see FINALITA_CALENDLY).
 */
export default function CalendlyEmbed({ url }: { url: string }) {
  const consenso = useConsenso(FINALITA_CALENDLY);
  const src = new URL(url);
  // Match the site's dark theme; Calendly reads these query parameters.
  src.searchParams.set("hide_gdpr_banner", "1");
  src.searchParams.set("background_color", "111b2e");
  src.searchParams.set("text_color", "e8ecf4");
  src.searchParams.set("primary_color", "bfff00");

  if (!consenso) {
    return (
      <div className="flex w-full flex-col items-start gap-5 border border-border bg-bg-1 p-8" style={{ minHeight: 320 }}>
        <p className="max-w-xl text-[15px] leading-relaxed text-text-1">
          Il calendario è di Calendly, che usa cookie propri. Lo mostriamo solo se accetti i cookie di
          &quot;Esperienza&quot; nelle preferenze. In alternativa apri Calendly in una nuova scheda o scrivici a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">{CONTACT_EMAIL}</a>.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={apriPreferenze}
            className="bg-accent px-6 py-3 font-label text-sm font-bold tracking-wide text-bg-0 hover:brightness-110"
          >
            Gestisci le preferenze
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-text-0 px-6 py-3 font-label text-sm font-bold tracking-wide text-text-0 hover:border-accent hover:text-accent"
          >
            Apri Calendly in una nuova scheda
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="calendly-inline-widget w-full border border-border bg-bg-1"
        data-url={src.toString()}
        style={{ minWidth: 320, height: 720 }}
      />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
    </>
  );
}
