"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante l'iscrizione.");
        return;
      }

      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-y border-border bg-bg-1 py-16 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-14 text-center">
        <span className="font-mono text-xs font-medium tracking-[3px] text-accent">NEWSLETTER</span>
        <h3 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-1px] text-text-0" style={{ lineHeight: 1.2 }}>
          Ricevi risorse esclusive<br />ogni settimana.
        </h3>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
          Guide, template e insight su AI e automazione. Zero spam, solo valore.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm text-accent">Iscritto! Grazie per esserti registrato.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-80 border border-border bg-bg-0 px-5 py-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-accent px-7 py-3.5 font-mono text-[11px] font-bold tracking-wider text-bg-0 disabled:opacity-50"
              style={{ letterSpacing: "1px" }}
            >
              {loading ? "..." : "ISCRIVITI \u2192"}
            </button>
          </form>
        )}
        {error && (
          <p className="mt-3 text-sm text-red">{error}</p>
        )}

        <p className="mt-4 font-mono text-[11px] tracking-[0.5px] text-text-1">
          Unisciti a 2.000+ professionisti. Cancellati quando vuoi.
        </p>
      </div>
    </section>
  );
}
