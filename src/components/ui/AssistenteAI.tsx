"use client";

import Script from "next/script";
import { ASSISTANT } from "@/lib/brand";

declare global {
  interface Window {
    WPLA_CONFIG?: Record<string, unknown>;
  }
}

// The widget reads window.WPLA_CONFIG when it runs, so set it as soon as this module loads on the client.
if (typeof window !== "undefined") {
  window.WPLA_CONFIG = {
    endpoint: ASSISTANT.endpoint,
    siteKey: ASSISTANT.siteKey,
    mode: ASSISTANT.mode,
    title: ASSISTANT.title,
    company: ASSISTANT.company,
    color: ASSISTANT.color,
    privacyUrl: ASSISTANT.privacyUrl,
    fallbackEmail: ASSISTANT.fallbackEmail,
    launcherLabel: ASSISTANT.launcherLabel,
    suggestions: ASSISTANT.suggestions.join("|"),
  };
}

/**
 * Real AI assistant (plugin widget in Shadow DOM). Mounted once in the root layout: client-side
 * navigation keeps it alive and the conversation survives reloads via sessionStorage.
 * Loaded after the page is idle so it does not weigh on the first render.
 */
export default function AssistenteAI() {
  return <Script src={ASSISTANT.scriptPath} strategy="lazyOnload" />;
}
