"use client";

import { useState } from "react";
import { AGENCY_NAME, CONTACT_EMAIL } from "@/lib/brand";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Campi = { nome: string; email: string; sito: string; messaggio: string };
type Errori = Partial<Record<keyof Campi | "consenso", string>>;

const VUOTO: Campi = { nome: "", email: "", sito: "", messaggio: "" };

const input =
  "w-full border bg-bg-0 px-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/50";
const etichetta = "mb-1.5 block font-mono text-[10px] font-medium tracking-[1px] text-text-1";

/** Fallback contact form while Calendly is not configured. Posts to /api/contact. */
export default function ModuloContatti() {
  const [campi, setCampi] = useState<Campi>(VUOTO);
  const [consenso, setConsenso] = useState(false);
  // Honeypot: hidden from people and screen readers, bots fill it.
  const [sitoWeb, setSitoWeb] = useState("");
  const [errori, setErrori] = useState<Errori>({});
  const [stato, setStato] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const valida = (): Errori => {
    const e: Errori = {};
    if (campi.nome.trim().length < 2) e.nome = "Il nome deve avere almeno 2 caratteri";
    if (!EMAIL_REGEX.test(campi.email.trim())) e.email = "Inserisci un'email valida";
    if (!consenso) e.consenso = "Serve il consenso per risponderti";
    return e;
  };

  const set = (k: keyof Campi) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCampi((c) => ({ ...c, [k]: ev.target.value }));
    if (errori[k]) setErrori((e) => ({ ...e, [k]: undefined }));
  };

  const invia = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = valida();
    setErrori(e);
    if (Object.keys(e).length > 0) return;
    setStato("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...campi, consenso: true, sito_web: sitoWeb }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStato("sent");
      setCampi(VUOTO);
      setConsenso(false);
    } catch {
      setStato("error");
    }
  };

  if (stato === "sent") {
    return (
      <p className="border border-accent-border bg-bg-1 p-8 text-[15px] text-accent" role="status">
        Ricevuto. Ti rispondiamo via email per fissare i 30 minuti.
      </p>
    );
  }

  return (
    <form onSubmit={invia} noValidate className="space-y-5 border border-border bg-bg-1 p-8">
      <div>
        <label htmlFor="c-nome" className={etichetta}>NOME *</label>
        <input id="c-nome" autoComplete="name" value={campi.nome} onChange={set("nome")} placeholder="Il tuo nome" className={`${input} h-11 ${errori.nome ? "border-red" : "border-border"}`} aria-invalid={!!errori.nome} />
        {errori.nome && <p className="mt-1 text-xs text-red">{errori.nome}</p>}
      </div>
      <div>
        <label htmlFor="c-email" className={etichetta}>EMAIL *</label>
        <input id="c-email" type="email" autoComplete="email" value={campi.email} onChange={set("email")} placeholder="email@azienda.it" className={`${input} h-11 ${errori.email ? "border-red" : "border-border"}`} aria-invalid={!!errori.email} />
        {errori.email && <p className="mt-1 text-xs text-red">{errori.email}</p>}
      </div>
      <div>
        <label htmlFor="c-sito" className={etichetta}>IL TUO SITO</label>
        <input id="c-sito" type="url" inputMode="url" autoComplete="url" value={campi.sito} onChange={set("sito")} placeholder="https://" className={`${input} h-11 border-border`} />
      </div>
      <div>
        <label htmlFor="c-messaggio" className={etichetta}>MESSAGGIO</label>
        <textarea id="c-messaggio" rows={4} value={campi.messaggio} onChange={set("messaggio")} placeholder="Cosa vorresti che facesse il tuo sito?" className={`${input} border-border py-3`} />
      </div>

      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="c-sito-web">Lascia vuoto questo campo</label>
        <input id="c-sito-web" name="sito_web" tabIndex={-1} autoComplete="off" value={sitoWeb} onChange={(e) => setSitoWeb(e.target.value)} />
      </div>

      <div>
        <label htmlFor="c-consenso" className="flex items-start gap-2 text-xs text-text-1">
          <input id="c-consenso" type="checkbox" checked={consenso} onChange={(e) => { setConsenso(e.target.checked); if (errori.consenso) setErrori((x) => ({ ...x, consenso: undefined })); }} className="mt-0.5 accent-[#BFFF00]" />
          <span>
            Acconsento al trattamento dei miei dati da parte di {AGENCY_NAME} per rispondere a questa richiesta. Leggi la{" "}
            <a href="/privacy" className="underline hover:text-text-0">privacy</a>.
          </span>
        </label>
        {errori.consenso && <p className="mt-1 text-xs text-red">{errori.consenso}</p>}
      </div>

      <button
        type="submit"
        disabled={stato === "sending"}
        className="w-full bg-accent py-4 font-mono text-xs font-bold tracking-[1px] text-bg-0 disabled:opacity-50"
      >
        {stato === "sending" ? "INVIO IN CORSO…" : "INVIA LA RICHIESTA →"}
      </button>

      {stato === "error" && (
        <p className="text-sm text-red" role="alert">Non siamo riusciti a inviare. Scrivici a {CONTACT_EMAIL}.</p>
      )}
    </form>
  );
}
