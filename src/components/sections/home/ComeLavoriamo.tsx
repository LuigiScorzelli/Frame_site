"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const passi = [
  { numero: "01", icona: "🔍", titolo: "Stima scritta", testo: "Ci raccontate il processo, vi mandiamo una stima che si legge da sola. La chiamata di 30 minuti c'è sempre, per chi la vuole.", punti: ["Stima per iscritto", "Chiamata se la volete"] },
  { numero: "02", icona: "🛡️", titolo: "Demo prima della firma", testo: "Vedete un agente funzionante con dati di esempio della vostra azienda. Se non vi convince, non dovete nulla.", punti: ["Dati di esempio vostri", "Nessun impegno"] },
  { numero: "03", icona: "⚙️", titolo: "Costruzione", testo: "Un agente alla volta, collegato agli strumenti che usate già, con i punti di controllo scritti.", punti: ["Strumenti esistenti", "Controlli scritti"] },
  { numero: "04", icona: "🧪", titolo: "Prova e ritocchi", testo: "Casi reali con il vostro team, correzioni, rapporto ogni mese.", punti: ["Casi reali", "Rapporto mensile"] },
];

export default function ComeLavoriamo() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <section ref={ref} className="border-t border-border bg-bg-0 py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        <div className="mb-12">
          <span className="font-label text-[13px] font-medium tracking-[2px] text-accent">03 / COME LAVORIAMO</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold tracking-[-1px] text-text-0 lg:text-[48px]">Quattro passi, nessuna sorpresa.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1">Nessun vincolo di durata: disdetta con 30 giorni di preavviso.</p>
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
