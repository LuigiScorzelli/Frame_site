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
 * `widget` goes inside the form, where the challenge may appear. `token()` is called on submit and gives a
 * fresh single-use token, or undefined when Turnstile is off or could not run (the server then decides).
 */
export function useTurnstile(): { widget: React.ReactNode; token: () => Promise<string | undefined> } {
  const id = `ts-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const widgetId = useRef<string | null>(null);
  const inAttesa = useRef<((token: string | undefined) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  const token = useCallback(async (): Promise<string | undefined> => {
    if (!SITE_KEY) return undefined;
    let api: TurnstileApi;
    try {
      api = await caricaTurnstile();
    } catch {
      return undefined;
    }
    return new Promise<string | undefined>((risolvi) => {
      const scadenza = window.setTimeout(() => chiudi(undefined), ATTESA_MS);
      const chiudi = (t: string | undefined) => {
        window.clearTimeout(scadenza);
        if (inAttesa.current === chiudi) inAttesa.current = null;
        risolvi(t);
      };
      // A second submit while the first is still waiting replaces it.
      inAttesa.current?.(undefined);
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
            callback: (t: string) => inAttesa.current?.(t),
            "error-callback": () => {
              inAttesa.current?.(undefined);
              return true;
            },
            "timeout-callback": () => inAttesa.current?.(undefined),
          });
        } else {
          // Tokens are single use: every submit starts from a clean widget.
          api.reset(widgetId.current);
        }
        api.execute(`#${id}`);
      } catch {
        chiudi(undefined);
      }
    });
  }, [id]);

  return { widget: SITE_KEY ? <div id={id} /> : null, token };
}
