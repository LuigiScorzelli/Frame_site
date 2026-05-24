"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const values = [
  { icon: "⚡", label: "OPERATIVITA", desc: "Soluzioni pensate per il lavoro quotidiano." },
  { icon: "◆", label: "CONTROLLO", desc: "Setup proprietari e accessi definiti." },
  { icon: "◎", label: "SICUREZZA", desc: "Attenzione a dati, permessi e integrazioni." },
  { icon: "◈", label: "KNOW-HOW", desc: "Protezione delle procedure aziendali interne." },
];

const timeline = [
  { year: "2026", title: "Nasce FR>ME", desc: "Uno studio operativo nato dall'esigenza di usare AI e automazioni senza disperdere dati, procedure e know-how aziendale." },
  { year: "OGGI", title: "Setup proprietari e processi reali", desc: "Lavoriamo su automazioni, agenti AI e software custom costruiti intorno agli strumenti e ai dati interni dell'azienda." },
  { year: "FOCUS", title: "Sicurezza prima della complessita", desc: "Ogni soluzione viene progettata considerando accessi, permessi, integrazioni e controllo delle informazioni sensibili." },
];

export default function BrandHistory() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border bg-bg-0 py-24 lg:py-[100px]">
      {/* Big background text */}
      <div className="pointer-events-none absolute right-0 top-0 overflow-hidden">
        <span className="block text-right text-[300px] font-extrabold leading-none tracking-[-15px] text-accent/[0.035]">FR&gt;ME</span>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-14">
        <div className="mb-12">
          <span className="font-mono text-xs font-medium tracking-[2px] text-accent">03 / PERCHE FR&gt;ME</span>
          <h2 className="mt-4 text-[48px] font-extrabold tracking-[-2px] text-text-0">Controllo del dato, utilita operativa.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
            FR&gt;ME nasce per aiutare le aziende a usare AI, automazioni e software mantenendo il controllo su dati e know-how.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: Intro + Values */}
          <div className={cn("transition-all duration-500", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
            <p className="mb-6 text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
              FR&gt;ME nasce dall&apos;esigenza sempre piu concreta delle aziende di analizzare dati internamente, automatizzare processi e usare agenti AI senza affidare informazioni sensibili a strumenti esterni non governati.
            </p>
            <p className="mb-10 text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
              Lavoriamo come partner tecnico operativo: partiamo dai processi reali, definiamo il perimetro dei dati e costruiamo soluzioni su misura con attenzione a sicurezza, accessi, integrazioni e continuita del lavoro quotidiano.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.label} className="border border-border bg-bg-1 p-6">
                  <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-bg-2 text-base">{v.icon}</div>
                  <span className="block font-mono text-[11px] font-bold tracking-wider text-accent" style={{ letterSpacing: "1px" }}>{v.label}</span>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timeline */}
          <div className={cn("transition-all duration-500 delay-150", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
            <div className="border-l-2 pl-8" style={{ borderImage: "linear-gradient(180deg, #BFFF00, #00E5FF) 1" }}>
              {timeline.map((item, i) => (
                <div key={item.year} className={cn("pb-8", i < timeline.length - 1 && "border-b border-border")}>
                  <div className="pt-6">
                    <span className="font-mono text-[11px] font-bold tracking-[2px] text-accent">{item.year}</span>
                    <h4 className="mt-1.5 text-base font-bold text-text-0">{item.title}</h4>
                    <p className="mt-1 text-[13px] leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
