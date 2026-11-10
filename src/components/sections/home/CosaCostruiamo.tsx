"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";
import { IconaAssistente, IconaCodice, IconaFulmine } from "@/components/ui/Icone";

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
  titolo: "AUTOMAZIONI DEI FLUSSI RIPETITIVI",
  testo: "Copiare dati da un'email a un foglio, mandare lo stesso promemoria ogni settimana, aggiornare due programmi a mano: lo fa il sistema, voi controllate.",
  immagine: "/images/servizi/automazione.jpg",
  velo: "bg-bg-0/90",
  icona: <IconaFulmine />,
  tag: ["WORKFLOW", "EMAIL E FOGLI", "PROMEMORIA"],
};

const laterali: Scheda[] = [
  {
    titolo: "COLLEGAMENTI E STRUMENTI SU MISURA",
    testo: "CRM, email, gestionale ed e-commerce che si passano i dati da soli, senza doppioni. Quando il software standard non basta, costruiamo lo strumento che manca.",
    immagine: "/images/servizi/sviluppo.jpg",
    velo: "bg-bg-0/85",
    icona: <IconaCodice />,
    tag: ["INTEGRAZIONI", "GESTIONALI", "SU MISURA"],
  },
  {
    titolo: "ASSISTENTI AI SUI VOSTRI DATI",
    testo: "Assistenti che rispondono con i vostri documenti e le vostre procedure, per i clienti o per chi lavora con voi, con permessi chiari su cosa possono leggere.",
    immagine: "/images/servizi/agenti-ai.jpg",
    velo: "bg-bg-0/85",
    icona: <IconaAssistente />,
    tag: ["ASSISTENTI", "DOCUMENTI", "PERMESSI"],
  },
];

function Card({ s, grandeFormato }: { s: Scheda; grandeFormato?: boolean }) {
  return (
    <div
      className={cn("relative flex-1 overflow-hidden border border-border bg-cover bg-center p-8", grandeFormato && "lg:min-h-[400px]")}
      style={{ backgroundImage: `url('${s.immagine}')` }}
    >
      <div className={cn("absolute inset-0", s.velo)} />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-accent">{s.icona}</div>
          <h3 className="mb-3 text-lg font-semibold text-text-0">{s.titolo}</h3>
          <p className="max-w-[420px] text-sm leading-relaxed text-text-1">{s.testo}</p>
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
          <span className="font-label text-[13px] font-medium tracking-[2px] text-accent">01 / COSA FACCIAMO</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold tracking-[-1px] text-text-0 lg:text-[48px]">Cosa costruiamo, in concreto.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1">
            Partiamo da come lavorate oggi e dai dati che usate ogni giorno. Costruiamo sugli strumenti che avete già.
          </p>
        </div>
        <div className={cn("flex flex-col gap-6 transition-all duration-500 lg:flex-row", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
          <Card s={grande} grandeFormato />
          <div className="flex w-full flex-col gap-6 lg:w-[500px]">
            {laterali.map((s) => <Card key={s.titolo} s={s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
