"use client";

import { useSyncExternalStore } from "react";
import { IUBENDA_ATTIVO, type Finalita } from "@/lib/iubenda";

/** Per-purpose consent as iubenda reports it: keys "1".."5". null = not expressed yet (banner still open). */
type StatoConsenso = Record<string, boolean> | null;
type PreferenzaIubenda = { consent?: boolean; purposes?: Record<string, boolean> } | null | undefined;

declare global {
  interface Window {
    /** Latest preference, written by the inline iubenda configuration (src/components/consenso/Iubenda.tsx). */
    __consensoIubenda?: PreferenzaIubenda;
    _iub?: { cs?: { api?: { openPreferences?: () => void } } };
  }
}

function daPreferenza(p: PreferenzaIubenda): StatoConsenso {
  if (!p) return null;
  if (p.purposes && Object.keys(p.purposes).length > 0) return { ...p.purposes };
  if (typeof p.consent === "boolean") {
    const tutte = p.consent;
    return { "1": true, "2": tutte, "3": tutte, "4": tutte, "5": tutte };
  }
  return null;
}

function leggi(): StatoConsenso {
  return typeof window === "undefined" ? null : daPreferenza(window.__consensoIubenda);
}

function iscrivi(f: () => void) {
  window.addEventListener("iubenda:consenso", f);
  return () => window.removeEventListener("iubenda:consenso", f);
}

/**
 * True when the visitor accepted the purpose. Without iubenda configured everything is allowed, as before the
 * banner existed. On the server and before the choice: false.
 */
export function useConsenso(finalita: Finalita): boolean {
  return useSyncExternalStore(
    iscrivi,
    () => !IUBENDA_ATTIVO || leggi()?.[String(finalita)] === true,
    () => !IUBENDA_ATTIVO,
  );
}

/** Opens the iubenda preferences panel (second layer). */
export function apriPreferenze() {
  window._iub?.cs?.api?.openPreferences?.();
}
