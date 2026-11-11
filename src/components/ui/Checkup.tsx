"use client";

import { useState } from "react";
import { traccia } from "@/lib/analytics";
import { AGENCY_NAME, CONTACT_EMAIL } from "@/lib/brand";

// Check-up v1 (sprint 1.1): URL form, optional email, result on the page. Posts to /api/checkup.
// Events carry only pagina and fonte: never the visitor's URL or email.

interface Voce {
  id: string;
  nome: string;
  punti: number;
  max: number;
  spiegazione: string;
  rimedio: string;
}

interface Risultato {
  punteggio: number;
  sito: string;
  wordpress: boolean;
  paginaContatti: string | null;
  voci: Voce[];
  email?: { report: "inviato" | "non_inviato"; iscrizione: "ok" | "non_attiva" | "errore" };
}

const PROPS = { pagina: "check-up", fonte: "checkup" } as const;

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function coloreBarra(punti: number, max: number) {
  const q = punti / max;
  return q >= 0.75 ? "bg-accent" : q >= 0.4 ? "bg-amber" : "bg-red";
}

async function chiama(body: Record<string, unknown>): Promise<{ ok: true; dati: Risultato } | { ok: false; errore: string }> {
  try {
    const res = await fetch("/api/checkup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const dati = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, errore: dati.error || `Non siamo riusciti a fare il check-up. Scrivici a ${CONTACT_EMAIL}.` };
    return { ok: true, dati };
  } catch {
    return { ok: false, errore: `Non siamo riusciti a fare il check-up. Scrivici a ${CONTACT_EMAIL}.` };
  }
}

function MessaggioEmail({ esito }: { esito: NonNullable<Risultato["email"]> }) {
  if (esito.report === "inviato") {
    return (
      <p className="text-sm text-accent" role="status">
        Report inviato. {esito.iscrizione === "ok" ? "Controlla la posta: c'è anche l'email per confermare l'iscrizione." : ""}
      </p>
    );
  }
  return (
    <p className="text-sm text-amber" role="status">
      Non siamo riusciti a mandare il report adesso. Riprova più tardi o scrivici a {CONTACT_EMAIL}.
    </p>
  );
}

function CampiEmail({
  id,
  email,
  setEmail,
  consenso,
  setConsenso,
  obbligatoria,
}: {
  id: string;
  email: string;
  setEmail: (v: string) => void;
  consenso: boolean;
  setConsenso: (v: boolean) => void;
  obbligatoria: boolean;
}) {
  return (
    <>
      <label htmlFor={`${id}-email`} className="block text-[15px] font-semibold text-text-0">
        La tua email {!obbligatoria && <span className="font-normal text-text-1">(facoltativa, per ricevere il report)</span>}
      </label>
      <input
        id={`${id}-email`}
        type="email"
        required={obbligatoria}
        autoComplete="email"
        placeholder="nome@azienda.it"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full border border-border bg-bg-0 px-5 py-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/60"
      />
      <label htmlFor={`${id}-consenso`} className="mt-3 flex items-start gap-2 text-[13px] text-text-1">
        <input
          id={`${id}-consenso`}
          type="checkbox"
          checked={consenso}
          onChange={(e) => setConsenso(e.target.checked)}
          className="mt-0.5 accent-[#BFFF00]"
        />
        <span>
          Mandatemi il report e le email di {AGENCY_NAME}. Leggi la{" "}
          <a href="/privacy" className="underline hover:text-text-0">privacy</a>.
        </span>
      </label>
    </>
  );
}

export default function Checkup() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [consenso, setConsenso] = useState(false);
  const [stato, setStato] = useState<"idle" | "loading" | "error">("idle");
  const [errore, setErrore] = useState("");
  const [risultato, setRisultato] = useState<Risultato | null>(null);
  const [urlAnalizzato, setUrlAnalizzato] = useState("");

  // Second form, under the result, for visitors who did not give the email at first.
  const [email2, setEmail2] = useState("");
  const [consenso2, setConsenso2] = useState(false);
  const [stato2, setStato2] = useState<"idle" | "loading" | "error">("idle");
  const [errore2, setErrore2] = useState("");
  const [esitoEmail, setEsitoEmail] = useState<Risultato["email"]>(undefined);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !consenso) {
      setStato("error");
      setErrore("Per mandarti il report serve il consenso. Oppure lascia vuota l'email.");
      return;
    }
    setStato("loading");
    setErrore("");
    setRisultato(null);
    setEsitoEmail(undefined);
    traccia("checkup_start", PROPS);
    const conEmail = email.trim() !== "";
    const r = await chiama({ url, ...(conEmail ? { email, consenso: true } : {}) });
    if (!r.ok) {
      setStato("error");
      setErrore(r.errore);
      return;
    }
    setStato("idle");
    setRisultato(r.dati);
    setUrlAnalizzato(url);
    setEsitoEmail(r.dati.email);
    traccia("checkup_done", PROPS);
    if (r.dati.email?.report === "inviato") traccia("checkup_email", PROPS);
  };

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consenso2) {
      setStato2("error");
      setErrore2("Serve il consenso per mandarti il report.");
      return;
    }
    setStato2("loading");
    setErrore2("");
    // Same URL: the server answers from its 1-hour cache, the site is not downloaded again.
    const r = await chiama({ url: urlAnalizzato, email: email2, consenso: true });
    if (!r.ok) {
      setStato2("error");
      setErrore2(r.errore);
      return;
    }
    setStato2("idle");
    setEsitoEmail(r.dati.email);
    if (r.dati.email?.report === "inviato") traccia("checkup_email", PROPS);
  };

  return (
    <div className="space-y-10">
      <form onSubmit={onSubmit} className="max-w-3xl space-y-6 border border-border bg-bg-1 p-8">
        <div>
          <label htmlFor="checkup-url" className="block text-[15px] font-semibold text-text-0">
            Indirizzo del tuo sito
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="checkup-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              required
              placeholder="esempio.it"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border border-border bg-bg-0 px-5 py-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/60"
            />
            <button
              type="submit"
              disabled={stato === "loading"}
              className="bg-accent px-6 py-3.5 font-label text-sm font-bold text-bg-0 disabled:opacity-50"
              style={{ letterSpacing: "1px" }}
            >
              {stato === "loading" ? "Analisi in corso…" : "Fai il check-up"}
            </button>
          </div>
        </div>
        <div>
          <CampiEmail id="checkup" email={email} setEmail={setEmail} consenso={consenso} setConsenso={setConsenso} obbligatoria={false} />
        </div>
        {stato === "loading" && (
          <p className="text-sm text-text-1" role="status">
            Scarichiamo la home e la pagina contatti: di solito servono pochi secondi, al massimo una ventina.
          </p>
        )}
        {stato === "error" && errore && <p className="text-sm text-red" role="alert">{errore}</p>}
      </form>

      {risultato && (
        <div className="border border-accent-border bg-bg-1 p-8" aria-live="polite">
          <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-label text-[13px] font-bold tracking-[2px] text-accent">RISULTATO</span>
              <p className="mt-3 break-all text-lg text-text-1">{host(risultato.sito)}</p>
              <p className="mt-1 text-5xl font-display font-extrabold text-text-0">
                {risultato.punteggio}
                <span className="text-2xl text-text-1">/100</span>
              </p>
            </div>
            <p className="font-label text-[13px] tracking-[1px] text-text-1">
              SITO WORDPRESS: <span className="text-text-0">{risultato.wordpress ? "SÌ" : "NO"}</span>
              <br />
              PAGINA CONTATTI: <span className="text-text-0">{risultato.paginaContatti ? "TROVATA" : "NON TROVATA"}</span>
            </p>
          </div>

          <ol className="divide-y divide-border">
            {risultato.voci.map((v) => (
              <li key={v.id} className="py-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-bold text-text-0">{v.nome}</h3>
                  <span className="font-label text-sm text-text-0">
                    {v.punti}/{v.max}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-bg-2" aria-hidden="true">
                  <div className={`h-full ${coloreBarra(v.punti, v.max)}`} style={{ width: `${(v.punti / v.max) * 100}%` }} />
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-text-1">{v.spiegazione}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-text-0">
                  <strong>Cosa fare:</strong> {v.rimedio}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-2 border-t border-border pt-6 font-label text-[12px] leading-relaxed text-text-2">
            Controllo automatico dell&apos;HTML della home e della pagina contatti, senza eseguire JavaScript: chat o moduli
            caricati dopo possono sfuggire. Ogni voce vale 20 punti; non salviamo le pagine del tuo sito.
          </p>

          <div className="mt-8 border-t border-border pt-8">
            {esitoEmail ? (
              <MessaggioEmail esito={esitoEmail} />
            ) : (
              <form onSubmit={onEmail} className="max-w-xl">
                <p className="mb-4 text-[15px] text-text-0">
                  Vuoi il report con le 3 cose da sistemare per prime? Te lo mandiamo via email.
                </p>
                <CampiEmail id="checkup-report" email={email2} setEmail={setEmail2} consenso={consenso2} setConsenso={setConsenso2} obbligatoria />
                <button
                  type="submit"
                  disabled={stato2 === "loading"}
                  className="mt-4 bg-accent px-6 py-3.5 font-label text-sm font-bold text-bg-0 disabled:opacity-50"
                  style={{ letterSpacing: "1px" }}
                >
                  {stato2 === "loading" ? "Invio…" : "Mandami il report"}
                </button>
                {stato2 === "error" && errore2 && <p className="mt-3 text-sm text-red" role="alert">{errore2}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
