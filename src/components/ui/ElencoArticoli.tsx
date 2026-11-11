"use client";

import Link from "next/link";
import { useState } from "react";
import FilterTabs from "@/components/ui/FilterTabs";

// Article list of /risorse with category filters (sprint 1.2). Filters appear only when the
// visible articles span at least two categories: one tab per category would filter nothing.

export interface SchedaArticolo {
  slug: string;
  titolo: string;
  descrizione: string;
  data: string;
  /** Formatted on the server, so the client does not depend on the browser locale. */
  dataLeggibile: string;
  tempoLettura: number;
  categoria: string;
  nomeCategoria: string;
  bozza: boolean;
}

const TUTTI = "Tutti";

export default function ElencoArticoli({ articoli }: { articoli: SchedaArticolo[] }) {
  const categorie = [...new Map(articoli.map((a) => [a.categoria, a.nomeCategoria])).values()];
  const [attiva, setAttiva] = useState(TUTTI);
  const visibili = attiva === TUTTI ? articoli : articoli.filter((a) => a.nomeCategoria === attiva);

  return (
    <div>
      {categorie.length > 1 && (
        <div className="mb-8" role="group" aria-label="Filtra per categoria">
          <FilterTabs tabs={[TUTTI, ...categorie]} active={attiva} onChange={setAttiva} />
        </div>
      )}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visibili.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/risorse/${a.slug}`}
              className="group flex h-full flex-col border border-border bg-bg-1 p-8 transition-colors hover:border-accent-border"
            >
              <div className="flex flex-wrap items-center gap-3 font-label text-[13px] tracking-[1px] text-text-1">
                <span className="text-accent">{a.nomeCategoria.toUpperCase()}</span>
                <time dateTime={a.data}>{a.dataLeggibile}</time>
                <span>{a.tempoLettura} min</span>
                {a.bozza && <span className="border border-amber px-2 py-0.5 text-amber">BOZZA</span>}
              </div>
              <h3 className="mt-4 text-lg font-bold text-text-0 group-hover:text-accent">{a.titolo}</h3>
              <p className="mt-1 max-w-3xl text-[15px] text-text-1">{a.descrizione}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
