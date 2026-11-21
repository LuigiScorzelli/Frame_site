"use client";

import { useCallback, useEffect, useId, useRef } from "react";

// Cloudflare Turnstile, browser side. The widget runs only when a form is sent (execution: "execute") and
// shows itself only if Cloudflare asks the visitor to do something (appearance: "interaction-only").
// Without NEXT_PUBLIC_TURNSTILE_SITE_KEY nothing is loaded and the forms send no token.

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
/** Long enough for an interactive challenge, short enough not to leave the button stuck. */
const ATTESA_MS = 60_000;

interface TurnstileApi {
  render(contenitore: string, opzioni: Record<string, unknown>): string;
  execute(contenitore: string): void;
  reset(id: string): void;
  remove(id: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let caricamento: Promise<TurnstileApi> | null = null;

/** Loads Cloudflare's script once per page, on first use. */
function caricaTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!caricamento) {
    caricamento = new Promise<TurnstileApi>((risolvi, rifiuta) => {
      const script = document.createElement("script");
      script.src = SCRIPT;
      script.async = true;
      script.onload = () => (window.turnstile ? risolvi(window.turnstile) : rifiuta(new Error("turnstile assente")));
      script.onerror = () => rifiuta(new Error("script non caricato"));
      document.head.appendChild(script);
    }).catch((err) => {
      // Let a later submit try again (e.g. after a network hiccup).
      caricamento = null;
      throw err;
    });
  }
  return caricamento;
}

/**
 * `widget` goes inside the form, where the challenge may appear. `campi()` is called on submit and gives the
 * fields to add to the request body: `turnstile` with a fresh single-use token, or `turnstile_esito` with a
 * short code saying why there is none (the server refuses the request and logs the code). Empty when
 * Turnstile is off.
 *
 * Codes: "script" (Cloudflare's script did not load), "render" (the widget threw), "attesa" (no answer in
 * 60 s), "sostituito" (a newer submit took over), "cf-<code>" (Cloudflare's own error code), "cf-timeout"
 * (the interactive challenge expired).
 */
export type CampiTurnstile = { turnstile?: string; turnstile_esito?: string };

export function useTurnstile(): { widget: React.ReactNode; campi: () => Promise<CampiTurnstile> } {
  const id = `ts-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const widgetId = useRef<string | null>(null);
  const inAttesa = useRef<((esito: CampiTurnstile) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  const campi = useCallback(async (): Promise<CampiTurnstile> => {
    if (!SITE_KEY) return {};
    const fallito = (codice: string): CampiTurnstile => {
      console.warn("turnstile: nessun token,", codice);
      return { turnstile_esito: codice };
    };
    let api: TurnstileApi;
    try {
      api = await caricaTurnstile();
    } catch {
      return fallito("script");
    }
    return new Promise<CampiTurnstile>((risolvi) => {
      const scadenza = window.setTimeout(() => chiudi(fallito("attesa")), ATTESA_MS);
      const chiudi = (esito: CampiTurnstile) => {
        window.clearTimeout(scadenza);
        if (inAttesa.current === chiudi) inAttesa.current = null;
        risolvi(esito);
      };
      // A second submit while the first is still waiting replaces it.
      inAttesa.current?.({ turnstile_esito: "sostituito" });
      inAttesa.current = chiudi;
      try {
        if (widgetId.current === null) {
          widgetId.current = api.render(`#${id}`, {
            sitekey: SITE_KEY,
            execution: "execute",
            appearance: "interaction-only",
            size: "flexible",
            theme: "dark",
            language: "it",
            "response-field": false,
            "refresh-expired": "manual",
            callback: (t: string) => inAttesa.current?.({ turnstile: t }),
            "error-callback": (codice: unknown) => {
              inAttesa.current?.(fallito(`cf-${String(codice).replace(/[^a-zA-Z0-9-]/g, "").slice(0, 30)}`));
              return true;
            },
            "timeout-callback": () => inAttesa.current?.(fallito("cf-timeout")),
          });
        } else {
          // Tokens are single use: every submit starts from a clean widget.
          api.reset(widgetId.current);
        }
        api.execute(`#${id}`);
      } catch {
        chiudi(fallito("render"));
      }
    });
  }, [id]);

  return { widget: SITE_KEY ? <div id={id} /> : null, campi };
}
