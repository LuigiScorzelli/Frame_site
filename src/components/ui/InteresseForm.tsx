"use client";

import { useState } from "react";
import { traccia } from "@/lib/analytics";
import { AGENCY_NAME, CONTACT_EMAIL } from "@/lib/brand";

interface InteresseFormProps {
  fonte?: "newsletter" | "checkup" | "beta";
  interesse?: string;
  pagina: string;
  bottone?: string;
  /** When set, the browser starts this download right after a successful sign-up (beta gate). */
  download?: string;
  /** Replaces the default consent text, e.g. to say what the beta emails are about. */
  testoConsenso?: string;
}

/**
 * Email capture with explicit consent. Posts to /api/newsletter (Brevo double opt-in);
 * the route answers 503 while Brevo is not configured. With `download`, the file starts
 * right after the sign-up, without waiting for the confirmation email.
 */
export default function InteresseForm({
  fonte = "newsletter",
  interesse,
  pagina,
  bottone = "Avvisami quando è disponibile",
  download,
  testoConsenso,
}: InteresseFormProps) {
  const [email, setEmail] = useState("");
  const [consenso, setConsenso] = useState(false);
  const [stato, setStato] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errore, setErrore] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consenso) {
      setErrore("Serve il consenso per mandarti le email.");
      return;
    }
    setStato("loading");
    setErrore("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fonte, consenso: true, ...(interesse ? { interesse } : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStato("error");
        setErrore(data.error || `Non siamo riusciti a inviare. Scrivici a ${CONTACT_EMAIL}.`);
        return;
      }
      setStato("ok");
      // The check-up email has its own funnel event; every other source counts as newsletter.
      traccia(fonte === "checkup" ? "checkup_email" : "newsletter_ok", { pagina, fonte });
      if (download) {
        traccia("download_beta", { pagina, posizione: "pagina", fonte });
        window.location.assign(download);
      }
    } catch {
      setStato("error");
      setErrore(`Non siamo riusciti a inviare. Scrivici a ${CONTACT_EMAIL}.`);
    }
  };

  if (stato === "ok") {
    if (download) {
      return (
        <p className="text-sm text-accent" role="status">
          Download avviato. Se non parte,{" "}
          <a href={download} className="underline hover:text-text-0">scarica da qui</a>. Controlla la posta per
          confermare l&apos;iscrizione.
        </p>
      );
    }
    return <p className="text-sm text-accent">Fatto. Controlla la posta per confermare.</p>;
  }

  const idEmail = `email-${pagina}-${fonte}`;
  const idConsenso = `consenso-${pagina}-${fonte}`;

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={idEmail} className="sr-only">La tua email</label>
        <input
          id={idEmail}
          type="email"
          required
          placeholder="La tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-border bg-bg-0 px-5 py-3.5 text-sm text-text-0 outline-none placeholder:text-text-1 focus:border-accent/60"
        />
        <button
          type="submit"
          disabled={stato === "loading"}
          className="bg-accent px-6 py-3.5 font-mono text-[11px] font-bold tracking-wider text-bg-0 disabled:opacity-50"
          style={{ letterSpacing: "1px" }}
        >
          {stato === "loading" ? "Invio…" : bottone}
        </button>
      </div>
      <label htmlFor={idConsenso} className="flex items-start gap-2 text-xs text-text-1">
        <input
          id={idConsenso}
          type="checkbox"
          checked={consenso}
          onChange={(e) => setConsenso(e.target.checked)}
          className="mt-0.5 accent-[#BFFF00]"
        />
        <span>
          {testoConsenso ?? `Acconsento a ricevere email da ${AGENCY_NAME}.`} Leggi la <a href="/privacy" className="underline hover:text-text-0">privacy</a>.
        </span>
      </label>
      {errore && <p className="text-sm text-red" role="alert">{errore}</p>}
    </form>
  );
}
