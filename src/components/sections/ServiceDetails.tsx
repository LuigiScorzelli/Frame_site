"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const processes = [
  { number: "01", icon: "🔍", title: "Analisi dei processi e dei dati", description: "Capire dove si perde tempo, quali dati servono davvero e quali informazioni devono restare sotto controllo.", bullets: ["Processi ripetitivi", "Dati interni", "Know-how aziendale"] },
  { number: "02", icon: "🛡️", title: "Sicurezza e perimetro", description: "Definire accessi, permessi, strumenti e limiti di esposizione prima di progettare automazioni, agenti AI o software.", bullets: ["Accessi e permessi", "Ambienti controllati", "Riduzione esposizione dati"] },
  { number: "03", icon: "⚙️", title: "Progettazione della soluzione", description: "Definire la soluzione piu adatta al problema reale, senza complessita inutile e con attenzione alla gestione del dato.", bullets: ["Flussi chiari", "Setup proprietario", "Roadmap essenziale"] },
  { number: "04", icon: "🔗", title: "Sviluppo e integrazione", description: "Costruire la soluzione e collegarla agli strumenti gia presenti nel flusso di lavoro.", bullets: ["CRM, fogli ed email", "Gestionali ed e-commerce", "Piattaforme interne"] },
  { number: "05", icon: "🧪", title: "Test operativo", description: "Verificare che il sistema funzioni nei casi reali, con dati, utenti, permessi e processi concreti.", bullets: ["Casi reali", "Controllo errori", "Feedback del team"] },
  { number: "06", icon: "📈", title: "Ottimizzazione", description: "Migliorare il flusso dopo il rilascio, riducendo attriti, errori e passaggi superflui.", bullets: ["Iterazioni rapide", "Meno passaggi manuali", "Processo piu stabile"] },
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
            Un approccio strutturato per trasformare complessita, dati interni e processi sensibili in sistemi operativi controllati.
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
