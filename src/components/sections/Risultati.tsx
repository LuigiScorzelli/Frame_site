"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const badges = [
  "AUTOMAZIONI", "AGENTI AI", "SOFTWARE CUSTOM",
  "SETUP PROPRIETARI", "SICUREZZA DATI", "AMAZON SELLER",
];

const caseStudies = [
  { cliente: "Seller Amazon", metrica: "-40%", label: "tempo su controlli operativi", desc: "Ottimizzazione listing, flussi di controllo e gestione delle attivita operative." },
  { cliente: "E-commerce", metrica: "30h/mese", label: "risparmiate su ordini e update", desc: "Automazione ordini, email, fogli e aggiornamenti interni tra strumenti gia in uso." },
  { cliente: "Team operativo", metrica: "+55%", label: "risposte interne piu rapide", desc: "Agente AI per recuperare informazioni da procedure e documenti interni con accessi definiti." },
  { cliente: "PMI", metrica: "1 tool", label: "processo gestito end-to-end", desc: "Software custom per gestire un processo non coperto da strumenti standard, con attenzione a dati e permessi." },
];

export default function Risultati() {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <section id="risultati" ref={ref} className="border-t border-border bg-bg-0 py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1440px] px-14">
        <span className="font-mono text-xs font-medium tracking-[2px] text-accent">04 / RISULTATI</span>
        <h2 className="mt-4 text-[48px] font-extrabold tracking-[-2px] text-text-0">I numeri parlano.</h2>
        <p className="mt-4 text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
          Ecco cosa otteniamo per i nostri clienti, ogni giorno.
        </p>

        <div className="mt-8" />

        <p
          className={cn(
            "max-w-[900px] text-[64px] font-extrabold leading-[1.05] tracking-[-3px] text-text-0 transition-all duration-500",
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          RISULTATI CONCRETI,<br />NON PROMESSE.
        </p>

        <div className="mt-8" />

        <div
          className={cn(
            "flex flex-wrap gap-3 transition-all duration-500 delay-150",
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {badges.map((b) => (
            <span key={b} className="border border-[#BFFF0040] bg-accent-dim px-3.5 py-1.5 font-mono text-[10px] font-medium tracking-wider text-accent" style={{ letterSpacing: "1px" }}>
              {b}
            </span>
          ))}
        </div>

        {/* Case Study Cards */}
        <div
          className={cn(
            "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500 delay-200",
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {caseStudies.map((cs) => (
            <div key={cs.cliente} className="border border-border bg-bg-1 p-6">
              <span className="font-mono text-[10px] font-medium tracking-wider text-text-2" style={{ letterSpacing: "1px" }}>
                {cs.cliente.toUpperCase()}
              </span>
              <div className="mt-3 font-mono text-3xl font-bold text-accent">{cs.metrica}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-widest text-text-1">{cs.label}</div>
              <p className="mt-3 text-sm text-text-1" style={{ lineHeight: 1.5 }}>{cs.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10" />

        <div
          className={cn(
            "transition-all duration-500 delay-300",
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <a
            href="/contatti"
            className="inline-flex items-center justify-center px-7 py-3.5 font-mono text-[11px] font-bold tracking-wider text-bg-0"
            style={{ background: "linear-gradient(135deg, #BFFF00, #00E5FF)", letterSpacing: "1px" }}
          >
            PARLIAMO DEL TUO PROGETTO &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
