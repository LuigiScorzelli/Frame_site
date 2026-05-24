"use client";

import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CalendarPicker from "@/components/ui/CalendarPicker";
import ChatWidget from "@/components/ui/ChatWidget";

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"];

const steps = [
  { num: "01", title: "Analisi", desc: "Analizziamo esigenze, processi attuali e dati coinvolti." },
  { num: "02", title: "Perimetro", desc: "Definiamo accessi, strumenti, sicurezza e livello di controllo necessario." },
  { num: "03", title: "Proposta", desc: "Valutiamo automazione, agente AI o software piu adatto al caso reale." },
];

type FormErrors = {
  nome?: string;
  email?: string;
  azienda?: string;
  data?: string;
  ora?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContattiPage() {
  const [form, setForm] = useState({ nome: "", email: "", azienda: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (form.nome.trim().length < 2) errs.nome = "Il nome deve avere almeno 2 caratteri";
    if (!EMAIL_REGEX.test(form.email.trim())) errs.email = "Inserisci un'email valida";
    if (form.azienda.trim().length > 0 && form.azienda.trim().length < 2) errs.azienda = "Il nome azienda deve avere almeno 2 caratteri";
    if (!selectedDate) errs.data = "Seleziona una data";
    if (!selectedTime) errs.ora = "Seleziona un orario";
    return errs;
  };

  const isFormValid = form.nome.trim().length >= 2 && EMAIL_REGEX.test(form.email.trim()) && (form.azienda.trim().length === 0 || form.azienda.trim().length >= 2) && !!selectedDate && !!selectedTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, messaggio: `Call prenotata: ${selectedDate} alle ${selectedTime}`, data_preferita: selectedDate, orario: selectedTime }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ nome: "", email: "", azienda: "" });
      setSelectedDate("");
      setSelectedTime("");
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section className="bg-bg-0 pb-0 pt-24 lg:pt-28">
          <div className="mx-auto max-w-[1440px] px-14 py-20 text-center">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">CONTATTI</span>
            <h1 className="mt-3 text-[56px] font-extrabold tracking-[-3px] text-text-0">PARLIAMO DEL TUO PROGETTO.</h1>
            <p className="mt-3 text-lg text-text-1">Prenota una call di 30 minuti per analizzare processi, dati e possibili automazioni.</p>
          </div>
        </section>

        {/* Main content */}
        <section className="bg-bg-0 pb-20">
          <div className="mx-auto flex max-w-[1440px] gap-8 px-14 flex-col lg:flex-row">
            {/* Left: Calendar + Time + Form */}
            <div className="flex-1 border border-border bg-bg-1 p-8">
              {/* Calendar title */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-lg">🕐</span>
                <span className="font-mono text-sm font-bold tracking-wider text-text-0" style={{ letterSpacing: "1px" }}>SCEGLI DATA E ORA</span>
                <span className="ml-2 border border-[#BFFF002E] bg-accent-dim px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider text-accent" style={{ letterSpacing: "1px" }}>30 MIN</span>
              </div>

              <CalendarPicker onSelect={setSelectedDate} selected={selectedDate} />

              {/* Time slots */}
              {selectedDate && (
                <div className="mt-8">
                  <span className="font-mono text-[11px] font-medium tracking-wider text-text-0" style={{ letterSpacing: "1px" }}>ORARI DISPONIBILI</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`border px-4 py-2.5 font-mono text-xs transition-all ${selectedTime === t ? "border-accent bg-accent-dim font-bold text-accent" : "border-border text-text-0 hover:border-accent/40"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-medium tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>NOME *</label>
                  <input required minLength={2} value={form.nome} onChange={(e) => { setForm({ ...form, nome: e.target.value }); if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined })); }} placeholder="Il tuo nome" className={`h-11 w-full border bg-bg-0 px-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/50 ${errors.nome ? "border-red" : "border-border"}`} />
                  {errors.nome && <p className="mt-1 text-xs text-red">{errors.nome}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-medium tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>EMAIL *</label>
                  <input required type="email" pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors((prev) => ({ ...prev, email: undefined })); }} placeholder="email@azienda.it" className={`h-11 w-full border bg-bg-0 px-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/50 ${errors.email ? "border-red" : "border-border"}`} />
                  {errors.email && <p className="mt-1 text-xs text-red">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-medium tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>AZIENDA</label>
                  <input minLength={2} value={form.azienda} onChange={(e) => { setForm({ ...form, azienda: e.target.value }); if (errors.azienda) setErrors((prev) => ({ ...prev, azienda: undefined })); }} placeholder="Nome azienda (opzionale)" className={`h-11 w-full border bg-bg-0 px-3.5 text-sm text-text-0 outline-none placeholder:text-text-2 focus:border-accent/50 ${errors.azienda ? "border-red" : "border-border"}`} />
                  {errors.azienda && <p className="mt-1 text-xs text-red">{errors.azienda}</p>}
                </div>
                {errors.data && <p className="text-xs text-red">{errors.data}</p>}
                {errors.ora && <p className="text-xs text-red">{errors.ora}</p>}

                <button
                  type="submit"
                  disabled={status === "sending" || !isFormValid}
                  className="mt-4 w-full py-4 font-mono text-xs font-bold tracking-wider text-bg-0 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #BFFF00, #00E5FF)", letterSpacing: "1px" }}
                >
                  {status === "sending" ? "INVIO IN CORSO..." : "CONFERMA LA TUA CALL \u2192"}
                </button>

                {status === "sent" && <p className="text-sm text-accent">Call prenotata! Ti ricontatteremo presto.</p>}
                {status === "error" && <p className="text-sm text-red">Errore nell&apos;invio. Riprova.</p>}

                <p className="text-[11px] leading-relaxed text-text-2" style={{ lineHeight: 1.5 }}>
                  Inviando questo form acconsenti al trattamento dei dati secondo la nostra Privacy Policy (GDPR).
                </p>
              </form>
            </div>

            {/* Right sidebar */}
            <div className="w-full space-y-6 lg:w-[500px]">
              {/* Summary card */}
              <div className="border border-border bg-bg-1 p-7">
                <span className="font-mono text-[11px] font-bold tracking-[2px] text-accent">LA TUA CALL</span>
                <div className="my-5 h-px bg-border" />
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="font-mono text-xs text-text-1">Data</span><span className="text-sm font-semibold text-text-0">{selectedDate || "—"}</span></div>
                  <div className="flex justify-between"><span className="font-mono text-xs text-text-1">Ora</span><span className="text-sm font-semibold text-text-0">{selectedTime || "—"}</span></div>
                  <div className="flex justify-between"><span className="font-mono text-xs text-text-1">Durata</span><span className="text-sm font-semibold text-text-0">30 minuti</span></div>
                </div>
              </div>

              {/* Contact direct */}
              <div className="border border-border bg-bg-1 p-7">
                <span className="font-mono text-[11px] font-bold tracking-[2px] text-text-0">CONTATTO DIRETTO</span>
                <p className="mt-4 font-mono text-sm font-semibold text-accent">info@aiframe.it</p>
                <p className="mt-2 text-[13px] text-text-1">Rispondiamo entro 24h</p>
              </div>

              {/* What to expect */}
              <div className="border border-border bg-bg-1 p-7">
                <span className="font-mono text-[11px] font-bold tracking-[2px] text-text-0">COSA ASPETTARTI</span>
                <div className="mt-6 space-y-5">
                  {steps.map((s) => (
                    <div key={s.num} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#00E5FF33] bg-[#00E5FF14] font-mono text-[10px] font-bold text-cyan">{s.num}</div>
                      <div>
                        <p className="text-[15px] font-bold text-text-0">{s.title}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-text-1" style={{ lineHeight: 1.5 }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { v: "DATI", l: "interni" },
                  { v: "SEC", l: "accessi" },
                  { v: "OPS", l: "processi" },
                ].map((b) => (
                  <div key={b.l} className="border border-border bg-bg-1 p-4 text-center">
                    <div className="text-2xl font-extrabold text-accent">{b.v}</div>
                    <div className="mt-1 font-mono text-[9px] tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>{b.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
