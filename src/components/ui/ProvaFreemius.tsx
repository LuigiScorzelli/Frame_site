"use client";

import { useState } from "react";
import { traccia } from "@/lib/analytics";
import { FREEMIUS_PLAN_ID, FREEMIUS_PRODUCT_ID, FREEMIUS_PUBLIC_KEY } from "@/lib/freemius";

/**
 * "Prova 30 giorni" with the Freemius overlay checkout in SANDBOX mode. Rendered only where
 * checkoutSandboxAttivo() is true (previews and local dev), never on production.
 */
export default function ProvaFreemius({ pagina }: { pagina: string }) {
  const [stato, setStato] = useState<"pronto" | "apertura" | "errore">("pronto");

  async function apri() {
    traccia("click_prova", { pagina, posizione: "pagina" });
    setStato("apertura");
    try {
      const risposta = await fetch("/api/freemius/sandbox", { cache: "no-store" });
      if (!risposta.ok) throw new Error(`sandbox ${risposta.status}`);
      const sandbox = (await risposta.json()) as { ctx: string; token: string };
      const { Checkout } = await import("@freemius/checkout");
      const checkout = new Checkout({
        product_id: FREEMIUS_PRODUCT_ID,
        public_key: FREEMIUS_PUBLIC_KEY,
        plan_id: FREEMIUS_PLAN_ID,
        sandbox,
      });
      await checkout.open({ trial: true, afterClose: () => setStato("pronto") });
      setStato("pronto");
    } catch {
      setStato("errore");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={apri}
        disabled={stato === "apertura"}
        className="bg-accent px-7 py-3.5 font-label text-sm font-bold tracking-wide text-bg-0 hover:brightness-110 disabled:opacity-60"
      >
        {stato === "apertura" ? "Apertura…" : "Prova 30 giorni"}
      </button>
      <p className="font-label text-[12px] tracking-[1px] text-text-2">CHECKOUT DI PROVA (SANDBOX): NESSUN ADDEBITO REALE</p>
      {stato === "errore" && <p className="text-sm text-text-1">Il checkout non si è aperto. Riprova tra poco.</p>}
    </div>
  );
}
