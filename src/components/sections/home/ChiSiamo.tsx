"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";
import { AGENCY_NAME, CITY, FOUNDER_URL, LOGO_TEXT, PLUGIN_NAME } from "@/lib/brand";

const valori = [
  { icona: "⚡", etichetta: "OPERATIVITÀ", testo: "Soluzioni pensate per il lavoro di ogni giorno." },
  { icona: "◆", etichetta: "CONTROLLO", testo: "Accessi definiti, dati dove devono stare." },
  { icona: "◎", etichetta: "SICUREZZA", testo: "Attenzione a permessi e integrazioni." },
  { icona: "◈", etichetta: "KNOW-HOW", testo: "Le vostre procedure restano vostre." },
];

/** "Chi siamo" in the production "Perché FR>ME" style (big background logo, values with icons). */
export default function ChiSiamo() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <section id="chi-siamo" ref={ref} className="relative scroll-mt-20 overflow-hidden border-t border-border bg-bg-0 py-24 lg:py-[100px]">
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 overflow-hidden">
        <span className="block text-right text-[160px] font-display font-extrabold leading-none tracking-[-8px] text-accent/[0.035] lg:text-[300px] lg:tracking-[-15px]">
          {LOGO_TEXT}
        </span>
      </div>
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-14">
        <div className="mb-12">
          <span className="font-label text-[13px] font-medium tracking-[2px] text-accent">03 / CHI C&apos;È DIETRO</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold tracking-[-1px] text-text-0 lg:text-[48px]">Chi siamo.</h2>
        </div>
        <div className="grid gap-16 lg:grid-cols-2">
          <div className={cn("transition-all duration-500", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
            <p className="text-lg leading-relaxed text-text-1">
              {AGENCY_NAME} è lo studio di Luigi Scorzelli, a {CITY}. Costruiamo automazioni per piccole aziende senza
              reparto tecnico. {PLUGIN_NAME} nasce da una cosa vista in ogni azienda per cui abbiamo lavorato: le
              richieste arrivano alle 22 e qualcuno le legge alle 9.
            </p>
            <a href={FOUNDER_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-label text-sm text-accent hover:underline">
              {FOUNDER_URL.replace(/^https?:\/\//, "")} &rarr;
            </a>
          </div>
          <div className={cn("grid grid-cols-2 gap-4 transition-all delay-150 duration-500", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
            {valori.map((v) => (
              <div key={v.etichetta} className="border border-border bg-bg-1 p-6">
                <div aria-hidden className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-bg-2 text-base text-accent">{v.icona}</div>
                <h3 className="font-label text-[13px] font-bold tracking-wider text-accent">{v.etichetta}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-1">{v.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
