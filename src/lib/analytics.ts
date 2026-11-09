import { track } from "@vercel/analytics";

export type Evento =
  | "click_installa"
  | "download_beta"
  | "checkup_start"
  | "checkup_done"
  | "checkup_email"
  | "newsletter_ok"
  | "click_prova"
  | "click_prenota"
  | "click_account"
  | "download_checklist";

/** Allowed properties only. Never put emails or visitor URLs here. */
export type ProprietaEvento = {
  pagina?: string;
  posizione?: "hero" | "chiusura" | "menu" | "footer" | "pagina" | "widget";
  fonte?: "newsletter" | "checkup" | "beta";
};

export function traccia(evento: Evento, props?: ProprietaEvento) {
  track(evento, props);
}
