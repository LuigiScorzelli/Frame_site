"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const passi = [
  { numero: "01", icona: "🔍", titolo: "Analisi", testo: "Partiamo da 30 minuti di chiamata: ci raccontate dove si perde tempo e quali dati usate ogni giorno.", punti: ["Processi ripetitivi", "Dati che usate"] },
  { numero: "02", icona: "🛡️", titolo: "Dati e accessi", testo: "Prima di costruire decidiamo chi può vedere cosa, dove restano i dati e quali strumenti tocchiamo.", punti: ["Accessi e permessi", "Dove restano i dati"] },
  { numero: "03", icona: "⚙️", titolo: "Costruzione", testo: "Realizziamo la soluzione e la colleghiamo agli strumenti che usate già, senza cambiare il vostro modo di lavorare più del necessario.", punti: ["Strumenti esistenti", "Niente complessità inutile"] },
  { numero: "04", icona: "🧪", titolo: "Prova e ritocchi", testo: "La proviamo su casi reali con il vostro team, correggiamo quello che non va e la miglioriamo dopo il rilascio.", punti: ["Casi reali", "Ritocchi dopo il rilascio"] },
];

export default function ComeLavoriamo() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <section ref={ref} className="border-t border-border bg-bg-0 py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        <div className="mb-12">
          <span className="font-label text-[13px] font-medium tracking-[2px] text-accent">02 / COME LAVORIAMO</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold tracking-[-1px] text-text-0 lg:text-[48px]">Quattro passi, nessuna sorpresa.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1">Dopo la chiamata ricevete una proposta scritta di una pagina.</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {passi.map((p, i) => (
            <li
              key={p.numero}
              className={cn("border border-border bg-bg-1 p-8 pt-10 transition-all duration-500", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="font-label text-[13px] tracking-[2px] text-accent">{p.numero}</span>
              <div aria-hidden className="my-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-2xl">{p.icona}</div>
              <h3 className="mb-3 text-lg font-bold tracking-[-0.5px] text-text-0">{p.titolo}</h3>
              <p className="mb-5 text-sm leading-relaxed text-text-1">{p.testo}</p>
              <ul className="space-y-2">
                {p.punti.map((b) => <li key={b} className="font-label text-[13px] tracking-[0.5px] text-text-1">&gt; {b}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
