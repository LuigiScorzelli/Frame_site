"use client";

import { useSyncExternalStore } from "react";
import { offertaAperta } from "@/lib/offerta";

const nessunAggiornamento = () => () => {};

/**
 * Whether the 5-client offer is open, for the menu and the footer.
 * Static pages are built once: the server snapshot is always "open" so the HTML and the first client render
 * match, then the browser's clock decides. After the last day a page built earlier drops the link on its own.
 */
export function useOffertaAperta(): boolean {
  return useSyncExternalStore(nessunAggiornamento, () => offertaAperta(), () => true);
}
