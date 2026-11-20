"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";
import Link from "next/link";
import { IconaAssistente, IconaCollegamento, IconaFulmine } from "@/components/ui/Icone";

const Tag = ({ children }: { children: string }) => (
  <span className="border border-[#2A3F66] bg-accent-dim px-2.5 py-0.5 font-label text-[12px] font-medium tracking-wider text-accent" style={{ letterSpacing: "1px" }}>
    {children}
  </span>
);

interface Scheda {
  titolo: string;
  testo: string;
  immagine: string;
  velo: string;
  icona: React.ReactNode;
  tag: string[];
}

const grande: Scheda = {
  titolo: "PREVENTIVI E RICHIESTE",
  testo: "Legge le richieste che arrivano da email e modulo del sito, chiede i dati che mancano e prepara il preventivo dal vostro tariffario. Lo approvate voi prima che parta.",
  immagine: "/images/servizi/sviluppo.jpg",
  velo: "bg-bg-0/90",
  icona: <IconaFulmine />,
  tag: ["EMAIL", "MODULO DEL SITO", "CRM"],
};

const laterali: Scheda[] = [
  {
    titolo: "ASSISTENTE WHATSAPP",
    testo: "Risponde alle domande frequenti con i vostri documenti, fissa gli appuntamenti in agenda e manda il promemoria. Quando non sa, passa la conversazione a una persona.",
    immagine: "/images/servizi/agenti-ai.jpg",
    velo: "bg-bg-0/85",
    icona: <IconaAssistente />,
    tag: ["WHATSAPP", "AGENDA", "DOCUMENTI"],
  },
  {
    titolo: "SMISTAMENTO EMAIL",
    testo: "Mette ordine nella casella generica: inoltra ogni messaggio alla persona giusta e prepara le bozze per le domande che tornano sempre.",
    immagine: "/images/servizi/automazione.jpg",
    velo: "bg-bg-0/85",
    icona: <IconaCollegamento />,
    tag: ["CASELLA INFO@", "BOZZE"],
  },
];

function Card({ s, grandeFormato }: { s: Scheda; grandeFormato?: boolean }) {
  return (
    <div
      className={cn("relative flex-1 overflow-hidden border border-border bg-cover bg-center p-8", grandeFormato && "lg:min-h-[400px] lg:p-12")}
      style={{ backgroundImage: `url('${s.immagine}')` }}
    >
      <div className={cn("absolute inset-0", s.velo)} />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-accent", grandeFormato && "lg:mb-8 lg:h-14 lg:w-14")}>
            {s.icona}
          </div>
          {/* The big card needs bigger type, or the text floats in a mostly empty box. */}
          <h3 className={cn("mb-3 text-lg font-semibold text-text-0", grandeFormato && "lg:mb-5 lg:text-[28px] lg:leading-tight lg:tracking-[-0.5px]")}>
            {s.titolo}
          </h3>
          <p className={cn("max-w-[420px] text-sm leading-relaxed text-text-1", grandeFormato && "lg:max-w-[560px] lg:text-lg")}>{s.testo}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">{s.tag.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      </div>
    </div>
  );
}

export default function CosaCostruiamo() {
  const { ref, inView } = useInView({ threshold: 0.15 });
  return (
    <section id="servizi" ref={ref} className="relative bg-bg-0 py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        <div className="mb-12">
          <span className="font-label text-[13px] font-medium tracking-[2px] text-accent">01 / COSA COSTRUIAMO</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold tracking-[-1px] text-text-0 lg:text-[48px]">Tre agenti per il lavoro di ogni giorno.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1">
            L&apos;AI legge e prepara. Preventivi, risposte e casi dubbi passano sempre da una persona.
          </p>
        </div>
        <div className={cn("flex flex-col gap-6 transition-all duration-500 lg:flex-row", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
          <Card s={grande} grandeFormato />
          <div className="flex w-full flex-col gap-6 lg:w-[500px]">
            {laterali.map((s) => <Card key={s.titolo} s={s} />)}
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-text-1">
          <Link href="/servizi" className="text-accent underline underline-offset-4">Come funzionano i tre agenti</Link>. Avete un
          processo diverso da questi? Raccontatecelo: lo valutiamo insieme in 30 minuti.
        </p>
      </div>
    </section>
  );
}
