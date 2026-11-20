"use client";

import { useState } from "react";
import { traccia } from "@/lib/analytics";
import { AGENCY_NAME, CONTACT_EMAIL } from "@/lib/brand";
import { AGENTI_OFFERTA, RISPOSTE_WORKSPACE, validaCandidatura, type ErroriCandidatura } from "@/lib/offerta";

type Campi = {
  nome: string;
  azienda: string;
  email: string;
  sito: string;
  agente: string;
  processo: string;
  volume: string;
  workspace: string;
};

const VUOTO: Campi = { nome: "", azienda: "", email: "", sito: "", agente: "", processo: "", volume: "", workspace: "" };

const input =
  "w-full border bg-bg-0 px-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/50";
const etichetta = "mb-1.5 block font-label text-[12px] font-medium tracking-[1px] text-text-1";
const bordo = (errore?: string) => (errore ? "border-red" : "border-border");

/** Application form for the 5-client offer. Posts to /api/candidatura. Copy: docs/lancio/03-contenuti.md. */
export default function ModuloCandidatura() {
  const [campi, setCampi] = useState<Campi>(VUOTO);
  const [consenso, setConsenso] = useState(false);
  const [aggiornamenti, setAggiornamenti] = useState(false);
  // Honeypot: hidden from people and screen readers, bots fill it.
  const [sitoWeb, setSitoWeb] = useState("");
  const [errori, setErrori] = useState<ErroriCandidatura>({});
  const [stato, setStato] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [messaggio, setMessaggio] = useState("");

  const set =
    (k: keyof Campi) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setCampi((c) => ({ ...c, [k]: ev.target.value }));
      if (k in errori) setErrori((e) => ({ ...e, [k]: undefined }));
    };

  const invia = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const corpo = { ...campi, consenso, aggiornamenti };
    const esito = validaCandidatura(corpo);
    if (!esito.ok) {
      setErrori(esito.errori);
      setStato("idle");
      return;
    }
    setErrori({});
    setStato("sending");
    try {
      const res = await fetch("/api/candidatura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...corpo, sito_web: sitoWeb }),
      });
      if (!res.ok) {
        const dati = (await res.json().catch(() => ({}))) as { error?: string; errori?: ErroriCandidatura };
        if (dati.errori) setErrori(dati.errori);
        setMessaggio(res.status === 410 || res.status === 429 ? (dati.error ?? "") : "");
        setStato("error");
        return;
      }
      traccia("candidatura_ok", { pagina: "offerta" });
      setStato("sent");
      setCampi(VUOTO);
      setConsenso(false);
      setAggiornamenti(false);
    } catch {
      setMessaggio("");
      setStato("error");
    }
  };

  if (stato === "sent") {
    return (
      <p className="border border-accent-border bg-bg-1 p-8 text-[15px] leading-relaxed text-accent" role="status">
        Candidatura ricevuta. Vi rispondiamo per email, di solito entro due giorni lavorativi.
      </p>
    );
  }

  const errore = (k: keyof ErroriCandidatura) =>
    errori[k] ? <p id={`cand-${k}-errore`} className="mt-1 text-[13px] text-red">{errori[k]}</p> : null;
  const aria = (k: keyof ErroriCandidatura) =>
    errori[k] ? { "aria-invalid": true as const, "aria-describedby": `cand-${k}-errore` } : {};

  return (
    <form onSubmit={invia} noValidate className="space-y-5 border border-border bg-bg-1 p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cand-nome" className={etichetta}>NOME E COGNOME *</label>
          <input id="cand-nome" autoComplete="name" value={campi.nome} onChange={set("nome")} className={`${input} h-11 ${bordo(errori.nome)}`} {...aria("nome")} />
          {errore("nome")}
        </div>
        <div>
          <label htmlFor="cand-azienda" className={etichetta}>AZIENDA *</label>
          <input id="cand-azienda" autoComplete="organization" value={campi.azienda} onChange={set("azienda")} className={`${input} h-11 ${bordo(errori.azienda)}`} {...aria("azienda")} />
          {errore("azienda")}
        </div>
        <div>
          <label htmlFor="cand-email" className={etichetta}>EMAIL DI LAVORO *</label>
          <input id="cand-email" type="email" autoComplete="email" value={campi.email} onChange={set("email")} placeholder="nome@azienda.it" className={`${input} h-11 ${bordo(errori.email)}`} {...aria("email")} />
          {errore("email")}
        </div>
        <div>
          <label htmlFor="cand-sito" className={etichetta}>SITO WEB</label>
          <input id="cand-sito" type="url" inputMode="url" autoComplete="url" value={campi.sito} onChange={set("sito")} placeholder="https://" className={`${input} h-11 border-border`} />
        </div>
        <div>
          <label htmlFor="cand-agente" className={etichetta}>QUALE AGENTE VI INTERESSA *</label>
          <select id="cand-agente" value={campi.agente} onChange={set("agente")} className={`${input} h-11 ${bordo(errori.agente)}`} {...aria("agente")}>
            <option value="">Scegliete</option>
            {AGENTI_OFFERTA.map((a) => <option key={a.valore} value={a.valore}>{a.etichetta}</option>)}
          </select>
          {errore("agente")}
        </div>
        <div>
          <label htmlFor="cand-workspace" className={etichetta}>USATE GOOGLE WORKSPACE? *</label>
          <select id="cand-workspace" value={campi.workspace} onChange={set("workspace")} className={`${input} h-11 ${bordo(errori.workspace)}`} {...aria("workspace")}>
            <option value="">Scegliete</option>
            {RISPOSTE_WORKSPACE.map((r) => <option key={r.valore} value={r.valore}>{r.etichetta}</option>)}
          </select>
          {errore("workspace")}
        </div>
      </div>

      <div>
        <label htmlFor="cand-processo" className={etichetta}>COME GESTITE OGGI QUESTE RICHIESTE? *</label>
        <textarea id="cand-processo" rows={5} value={campi.processo} onChange={set("processo")} placeholder="Da dove arrivano, chi le legge, quanto passa prima della risposta." className={`${input} py-3 ${bordo(errori.processo)}`} {...aria("processo")} />
        {errore("processo")}
      </div>

      <div>
        <label htmlFor="cand-volume" className={etichetta}>QUANTE NE RICEVETE IN UN MESE, PIÙ O MENO?</label>
        <input id="cand-volume" value={campi.volume} onChange={set("volume")} placeholder="Facoltativo" className={`${input} h-11 border-border`} />
      </div>

      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="cand-sito-web">Lascia vuoto questo campo</label>
        <input id="cand-sito-web" name="sito_web" tabIndex={-1} autoComplete="off" value={sitoWeb} onChange={(e) => setSitoWeb(e.target.value)} />
      </div>

      <div>
        <label htmlFor="cand-consenso" className="flex items-start gap-2 text-[13px] text-text-1">
          <input id="cand-consenso" type="checkbox" checked={consenso} onChange={(e) => { setConsenso(e.target.checked); if (errori.consenso) setErrori((x) => ({ ...x, consenso: undefined })); }} className="mt-0.5 accent-[#BFFF00]" {...aria("consenso")} />
          <span>
            Ho letto l&apos;<a href="/privacy" className="underline hover:text-text-0">informativa privacy</a> e acconsento
            a essere ricontattato da {AGENCY_NAME} su questa candidatura. *
          </span>
        </label>
        {errore("consenso")}
      </div>
      <label htmlFor="cand-aggiornamenti" className="flex items-start gap-2 text-[13px] text-text-1">
        <input id="cand-aggiornamenti" type="checkbox" checked={aggiornamenti} onChange={(e) => setAggiornamenti(e.target.checked)} className="mt-0.5 accent-[#BFFF00]" />
        <span>Voglio ricevere anche le email di {AGENCY_NAME} su agenti AI e automazioni (facoltativo, con doppia conferma).</span>
      </label>

      <button
        type="submit"
        disabled={stato === "sending"}
        className="w-full bg-accent py-4 font-label text-sm font-bold tracking-wide text-bg-0 disabled:opacity-50"
      >
        {stato === "sending" ? "INVIO IN CORSO…" : "INVIA LA CANDIDATURA →"}
      </button>

      {Object.values(errori).some(Boolean) && (
        <p className="text-sm text-red" role="alert">Controllate i campi segnati.</p>
      )}
      {stato === "error" && !Object.values(errori).some(Boolean) && (
        <p className="text-sm text-red" role="alert">
          {messaggio || `Non siamo riusciti a inviare la candidatura. Riprovate tra poco o scriveteci a ${CONTACT_EMAIL}.`}
        </p>
      )}
    </form>
  );
}
