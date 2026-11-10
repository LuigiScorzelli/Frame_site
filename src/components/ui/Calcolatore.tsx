"use client";

import { useEffect, useRef, useState } from "react";
import { traccia } from "@/lib/analytics";

// "Quanto costa una richiesta persa" (docs/lancio/02-specifiche.md, section 9).
// Pure client-side: no network calls, every coefficient visible and editable.
// TODO:dato: the default share out of hours should come from the 30-site test; until then 40, labelled "stima".

interface Valori {
  richiesteSettimana: number;
  fuoriOrario: number; // %
  valoreCliente: number; // €
  tassoChiusura: number; // %
  settimaneMese: number;
  quotaPersa: number; // share of unanswered requests that go elsewhere, 0-1
}

const PREDEFINITI: Valori = {
  richiesteSettimana: 10,
  fuoriOrario: 40,
  valoreCliente: 150,
  tassoChiusura: 30,
  settimaneMese: 4.33,
  quotaPersa: 0.5,
};

function calcola(v: Valori) {
  const perseMese = v.richiesteSettimana * v.settimaneMese * (v.fuoriOrario / 100) * v.quotaPersa;
  const euroMese = perseMese * (v.tassoChiusura / 100) * v.valoreCliente;
  return { perseMese, euroMese };
}

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const numero = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 2 });

interface CampoProps {
  id: keyof Valori;
  etichetta: string;
  nota?: string;
  valore: number;
  min: number;
  max: number;
  step: number;
  unita?: string;
  onChange: (id: keyof Valori, v: number) => void;
}

function Campo({ id, etichetta, nota, valore, min, max, step, unita, onChange }: CampoProps) {
  const htmlId = `calc-${id}`;
  return (
    <div>
      <label htmlFor={htmlId} className="block text-[15px] font-semibold text-text-0">
        {etichetta}
        {nota && <span className="ml-2 font-label text-[12px] font-normal tracking-[1px] text-amber">{nota}</span>}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <input
          id={htmlId}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(valore) ? valore : ""}
          onChange={(e) => onChange(id, e.target.valueAsNumber)}
          className="h-11 w-full max-w-[180px] border border-border bg-bg-0 px-3.5 text-sm text-text-0 outline-none focus:border-accent/60"
        />
        {unita && <span className="font-label text-sm text-text-1">{unita}</span>}
      </div>
    </div>
  );
}

function limita(v: number, min: number, max: number) {
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : 0;
}

export default function Calcolatore() {
  const [v, setV] = useState<Valori>(PREDEFINITI);
  const avviato = useRef(false);
  const concluso = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const aggiorna = (id: keyof Valori, valore: number) => {
    setV((prev) => ({ ...prev, [id]: valore }));
    if (!avviato.current) {
      avviato.current = true;
      traccia("checkup_start", { pagina: "check-up" });
    }
    // "done" = the visitor stopped editing for a moment after changing at least one value. Sent once.
    if (!concluso.current) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        concluso.current = true;
        traccia("checkup_done", { pagina: "check-up" });
      }, 2000);
    }
  };

  const sicuri: Valori = {
    richiesteSettimana: limita(v.richiesteSettimana, 0, 100000),
    fuoriOrario: limita(v.fuoriOrario, 0, 100),
    valoreCliente: limita(v.valoreCliente, 0, 10000000),
    tassoChiusura: limita(v.tassoChiusura, 0, 100),
    settimaneMese: limita(v.settimaneMese, 0, 5),
    quotaPersa: limita(v.quotaPersa, 0, 1),
  };
  const { perseMese, euroMese } = calcola(sicuri);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6 border border-border bg-bg-1 p-8">
        <Campo id="richiesteSettimana" etichetta="Richieste a settimana" valore={v.richiesteSettimana} min={0} max={100000} step={1} onChange={aggiorna} />
        <Campo id="fuoriOrario" etichetta="Quante arrivano fuori orario" nota="STIMA" valore={v.fuoriOrario} min={0} max={100} step={1} unita="%" onChange={aggiorna} />
        <Campo id="valoreCliente" etichetta="Quanto vale in media un cliente" valore={v.valoreCliente} min={0} max={10000000} step={10} unita="€" onChange={aggiorna} />

        <details className="border-t border-border pt-6">
          <summary className="cursor-pointer font-label text-[13px] font-bold tracking-[1px] text-text-1 hover:text-text-0">
            AVANZATE
          </summary>
          <div className="mt-6 space-y-6">
            <Campo id="tassoChiusura" etichetta="Quante richieste diventano clienti" valore={v.tassoChiusura} min={0} max={100} step={1} unita="%" onChange={aggiorna} />
            <Campo id="settimaneMese" etichetta="Settimane in un mese" valore={v.settimaneMese} min={0} max={5} step={0.01} onChange={aggiorna} />
            <Campo id="quotaPersa" etichetta="Quota di richieste senza risposta entro il mattino dopo che va altrove" valore={v.quotaPersa} min={0} max={1} step={0.05} onChange={aggiorna} />
          </div>
        </details>
      </div>

      <div className="flex flex-col justify-between border border-accent-border bg-bg-1 p-8" aria-live="polite">
        <div>
          <span className="font-label text-[13px] font-bold tracking-[2px] text-accent">RISULTATO</span>
          <p className="mt-4 text-2xl font-bold leading-snug text-text-0">
            Ogni mese circa <span className="text-accent">{euro.format(euroMese)}</span> di richieste senza risposta in tempo.
          </p>
          <p className="mt-3 text-[15px] text-text-1">
            Sono circa {numero.format(Math.round(perseMese * 10) / 10)} richieste al mese che finiscono a qualcun altro.
          </p>
        </div>
        <div className="mt-8 border-t border-border pt-6 font-label text-[13px] leading-relaxed text-text-1">
          <p className="font-bold text-text-0">COME LO CALCOLIAMO</p>
          <p className="mt-2">
            richieste perse al mese = {numero.format(sicuri.richiesteSettimana)} × {numero.format(sicuri.settimaneMese)} × {numero.format(sicuri.fuoriOrario)}% × {numero.format(sicuri.quotaPersa)}
          </p>
          <p className="mt-1">
            € al mese = richieste perse × {numero.format(sicuri.tassoChiusura)}% × {euro.format(sicuri.valoreCliente)}
          </p>
          <p className="mt-3">
            Ipotesi: metà delle richieste che non ricevono risposta entro il mattino dopo va altrove. La quota fuori
            orario è una stima. Tutti i valori si cambiano in &quot;Avanzate&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}
