"use client";

import Script from "next/script";

/** Calendly inline widget. The script is loaded only on pages that render this component. */
export default function CalendlyEmbed({ url }: { url: string }) {
  const src = new URL(url);
  // Match the site's dark theme; Calendly reads these query parameters.
  src.searchParams.set("hide_gdpr_banner", "1");
  src.searchParams.set("background_color", "111b2e");
  src.searchParams.set("text_color", "e8ecf4");
  src.searchParams.set("primary_color", "bfff00");

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
