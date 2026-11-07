import { cn } from "@/lib/utils";

export const Etichetta = ({ children }: { children: string }) => (
  <span className="border border-[#2A3F66] bg-accent-dim px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-[1px] text-accent">{children}</span>
);

interface SchedaProps {
  icona?: React.ReactNode;
  /** Small mono label above the title, e.g. "01" or "IN ARRIVO". */
  sopra?: string;
  titolo: React.ReactNode;
  etichette?: string[];
  className?: string;
  children?: React.ReactNode;
}

/** Card in the production style: icon box, title, body, tag chips. */
export default function Scheda({ icona, sopra, titolo, etichette, className, children }: SchedaProps) {
  return (
    <article className={cn("flex flex-col border border-border bg-bg-1 p-8", className)}>
      {sopra && <span className="font-mono text-[11px] tracking-[2px] text-cyan">{sopra}</span>}
      {icona && (
        <div aria-hidden className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-xl text-accent", sopra && "mt-4")}>
          {icona}
        </div>
      )}
      <h3 className={cn("text-lg font-bold tracking-[-0.5px] text-text-0", !icona && sopra && "mt-3")}>{titolo}</h3>
      {children && <div className="mt-3 flex-1 text-sm leading-relaxed text-text-1">{children}</div>}
      {etichette && etichette.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">{etichette.map((e) => <Etichetta key={e}>{e}</Etichetta>)}</div>
      )}
    </article>
  );
}
