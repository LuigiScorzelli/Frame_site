"use client";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsenso } from "@/lib/consenso";
import { FINALITA_STATISTICHE } from "@/lib/iubenda";

/**
 * Cookieless statistics, mounted only after "Misurazione" consent (see FINALITA_STATISTICHE).
 * Events sent with traccia() before consent are dropped: nothing is queued.
 */
export default function Statistiche({ umamiWebsiteId }: { umamiWebsiteId?: string }) {
  const consenso = useConsenso(FINALITA_STATISTICHE);
  if (!consenso) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
      {umamiWebsiteId && (
        <Script src="https://cloud.umami.is/script.js" data-website-id={umamiWebsiteId} strategy="afterInteractive" />
      )}
    </>
  );
}
