"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const processes = [
  { number: "01", icon: "🔍", title: "Analisi & Discovery", description: "Mappiamo i tuoi processi attuali per identificare colli di bottiglia e opportunita di automazione.", bullets: ["Audit dei processi aziendali", "Gap analysis tecnologica", "Roadmap di implementazione"] },
  { number: "02", icon: "⚙️", title: "Progettazione & Build", description: "Progettiamo e sviluppiamo soluzioni custom con le tecnologie piu adatte al tuo caso.", bullets: ["Architettura scalabile", "Sviluppo agile", "Testing e QA integrato"] },
  { number: "03", icon: "🚀", title: "Deploy & Ottimizzazione", description: "Lanciamo in produzione e monitoriamo le performance per un miglioramento continuo.", bullets: ["Deploy zero-downtime", "Monitoring in tempo reale", "Supporto e manutenzione"] },
  { number: "04", icon: "🤖", title: "Integrazione AI", description: "Implementiamo modelli di intelligenza artificiale per automatizzare decisioni e previsioni.", bullets: ["Modelli predittivi custom", "Chatbot intelligenti", "Computer vision"] },
  { number: "05", icon: "📊", title: "Data Analytics", description: "Trasformiamo i tuoi dati in insight azionabili con dashboard e report avanzati.", bullets: ["Business intelligence", "Dashboard interattive", "Data pipeline automatiche"] },
  { number: "06", icon: "🛡️", title: "Sicurezza & Compliance", description: "Garantiamo che ogni soluzione rispetti gli standard di sicurezza e le normative vigenti.", bullets: ["GDPR compliance", "Penetration testing", "Encryption end-to-end"] },
];

export default function ServiceDetails() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="border-t border-border bg-bg-0 py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1440px] px-14">
        <div className="mb-12">
          <span className="font-mono text-xs font-medium tracking-[2px] text-accent">02 / LE NOSTRE SOLUZIONI</span>
          <h2 className="mt-4 text-[48px] font-extrabold tracking-[-2px] text-text-0">Come lavoriamo.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
            Un approccio strutturato per trasformare la complessita in semplicita operativa.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {processes.map((p, i) => (
            <div
              key={p.number}
              className={cn(
                "border border-border bg-bg-1 p-8 pt-10 transition-all duration-500",
                inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="font-mono text-[11px] tracking-[2px] text-cyan">{p.number}</span>
              <div className="my-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-2xl">{p.icon}</div>
              <h3 className="mb-3 text-lg font-bold tracking-[-0.5px] text-text-0">{p.title}</h3>
              <p className="mb-5 text-sm text-text-1" style={{ lineHeight: 1.7 }}>{p.description}</p>
              <div className="space-y-2">
                {p.bullets.map((b) => (
                  <p key={b} className="font-mono text-[11px] tracking-[0.5px] text-text-1">&gt; {b}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
