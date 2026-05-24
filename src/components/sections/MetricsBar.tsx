"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const metrics = [
  { value: "DATI", label: "ANALISI INTERNA E SETUP CONTROLLATI" },
  { value: "AI", label: "AGENTI SU PROCESSI E PROCEDURE AZIENDALI" },
  { value: "SEC", label: "ACCESSI, PERMESSI E INTEGRAZIONI GOVERNATE" },
  { value: "OPS", label: "AUTOMAZIONI PER IL LAVORO QUOTIDIANO" },
];

export default function MetricsBar() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="border-y border-border bg-bg-1">
      <div className="mx-auto flex max-w-[1440px] flex-wrap px-14">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={cn(
              "flex-1 min-w-[50%] md:min-w-0 py-6 px-6 transition-all duration-500",
              i > 0 && "md:border-l-2 md:border-accent",
              inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="text-[48px] font-extrabold leading-none tracking-[-2px] text-text-0">{m.value}</div>
            <div className="mt-2 font-mono text-[10px] font-medium tracking-[2px] text-text-1">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
