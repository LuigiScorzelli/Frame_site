import { track } from "@vercel/analytics";

// Event names go to Umami as they are: keep them under 50 characters.
export type Evento =
  | "click_installa"
  | "download_beta"
  | "checkup_start"
  | "checkup_done"
  | "checkup_email"
  | "newsletter_ok"
  | "click_prova"
  | "click_prenota"
  | "click_checkup"
  | "click_account"
  | "download_checklist";

/** Allowed properties only. Never put emails or visitor URLs here. */
export type ProprietaEvento = {
  pagina?: string;
  posizione?: "hero" | "chiusura" | "menu" | "footer" | "pagina" | "widget";
  fonte?: "newsletter" | "checkup" | "beta";
};

declare global {
  interface Window {
    /** Set by the Umami script, loaded in production only (src/app/layout.tsx). */
    umami?: { track: (evento: string, dati?: Record<string, unknown>) => void };
  }
}

/** Sends the event to Vercel Analytics and, when its script is loaded, to Umami. */
export function traccia(evento: Evento, props?: ProprietaEvento) {
  track(evento, props);
  if (typeof window !== "undefined") window.umami?.track(evento, props);
}
