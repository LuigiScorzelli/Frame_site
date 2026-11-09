"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import TrackedLink from "@/components/ui/TrackedLink";
import type { Evento } from "@/lib/analytics";
import { BOOKING_URL, CONTACT_EMAIL, INSTALL_PATH, PLUGIN_NAME } from "@/lib/brand";

type Opzione = {
  key: "prenota" | "installa" | "checkup" | "email";
  href: string;
  testo: string;
  evento?: Evento;
};

const OPZIONI: Opzione[] = [
  { key: "prenota", href: BOOKING_URL, testo: "Prenota 30 minuti", evento: "click_prenota" },
  { key: "installa", href: INSTALL_PATH, testo: `Installa ${PLUGIN_NAME}, è gratis`, evento: "click_installa" },
  { key: "checkup", href: "/check-up", testo: "Controlla il tuo sito con il check-up" },
  { key: "email", href: `mailto:${CONTACT_EMAIL}`, testo: `Scrivici a ${CONTACT_EMAIL}` },
];

/** Path of an internal page link; null for external links and in-page anchors ("/plugin#installa" stays useful on /plugin). */
function percorso(href: string): string | null {
  if (!href.startsWith("/") || href.includes("#")) return null;
  return href.split("?")[0];
}

/** Options for the current page: no link to the page itself; the plugin page puts install first. */
function opzioniPer(pathname: string): Opzione[] {
  const visibili = OPZIONI.filter((o) => percorso(o.href) !== pathname);
  if (pathname === "/plugin") {
    return [...visibili.filter((o) => o.key === "installa"), ...visibili.filter((o) => o.key !== "installa")];
  }
  return visibili;
}

function IconaChat() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
    </svg>
  );
}

function IconaChiudi({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Floating shortcut menu (not a real chat): booking, plugin, check-up, email. */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const pagina = pathname === "/" ? "home" : pathname.split("/")[1];
  const opzioni = opzioniPer(pathname);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Panel */}
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-labelledby={titleId}
        inert={!open}
        className={cn(
          "absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-80 origin-bottom-right overflow-hidden border border-border bg-bg-1 shadow-2xl shadow-black/40 transition-all duration-300 motion-reduce:transition-none sm:bottom-[4.5rem]",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="font-mono text-[11px] font-medium uppercase text-accent" style={{ letterSpacing: "1px" }}>
            Come possiamo aiutarti
          </h2>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            className="text-text-1 transition-colors hover:text-text-0"
            aria-label="Chiudi"
          >
            <IconaChiudi className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          <p className="mb-3 text-sm text-text-1" style={{ lineHeight: 1.5 }}>
            Scegli da dove partire, ti rispondiamo noi.
          </p>
          <ul className="space-y-2">
            {opzioni.map((opt, i) => (
              <li key={opt.key} onClick={() => setOpen(false)}>
                <TrackedLink
                  href={opt.href}
                  evento={opt.evento}
                  props={opt.evento ? { pagina, posizione: "widget" } : undefined}
                  className={cn(
                    "block w-full px-3.5 py-2.5 text-left font-mono text-[11px] tracking-[0.5px] transition-all duration-200",
                    i === 0
                      ? "bg-[linear-gradient(135deg,#BFFF00,#00E5FF)] font-medium text-bg-0 hover:brightness-110"
                      : "border border-border text-text-1 hover:border-accent/40 hover:text-text-0"
                  )}
                >
                  {opt.testo}
                  <span aria-hidden="true"> →</span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pulse ring: three pulses on load, none with reduced motion */}
      {!open && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent opacity-50 animate-ping motion-reduce:hidden"
          style={{ animationIterationCount: 3 }}
        />
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full text-bg-0 shadow-lg sm:h-14 sm:w-14"
        style={{ background: "linear-gradient(135deg, #BFFF00, #00E5FF)" }}
        aria-label={open ? "Chiudi il menu di aiuto" : "Apri il menu di aiuto"}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
      >
        {open ? <IconaChiudi className="h-6 w-6" /> : <IconaChat />}
      </button>
    </div>
  );
}
