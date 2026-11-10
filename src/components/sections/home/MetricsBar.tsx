"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

// Labels, not figures: no number without a source.
const voci = [
  { valore: "DATI", etichetta: "ACCESSI SOLO DOVE SERVONO" },
  { valore: "AI", etichetta: "ASSISTENTI SUI VOSTRI DOCUMENTI" },
  { valore: "SEC", etichetta: "PERMESSI E INTEGRAZIONI CONTROLLATI" },
  { valore: "OPS", etichetta: "AUTOMAZIONI PER IL LAVORO DI OGNI GIORNO" },
];

export default function MetricsBar() {
  const { ref, inView } = useInView({ threshold: 0.2 });
  return (
    <section ref={ref} className="border-y border-border bg-bg-1">
      <div className="mx-auto flex max-w-[1440px] flex-wrap px-6 lg:px-14">
        {voci.map((m, i) => (
          <div
            key={m.valore}
            className={cn(
              "min-w-[50%] flex-1 px-6 py-6 transition-all duration-500 md:min-w-0",
              i > 0 && "md:border-l-2 md:border-accent",
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="text-[40px] font-display font-extrabold leading-none tracking-[-1px] text-text-0 lg:text-[48px]">{m.valore}</div>
            <div className="mt-2 font-label text-[12px] font-medium tracking-[2px] text-text-1">{m.etichetta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
