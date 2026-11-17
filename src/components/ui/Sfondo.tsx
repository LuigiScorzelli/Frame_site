import { cn } from "@/lib/utils";

/**
 * Decorative backgrounds shared by the home and the inner pages.
 * All pieces are absolutely positioned, aria-hidden and not clickable:
 * the parent needs `relative overflow-hidden`, the content `relative z-10`.
 */

const SFUMATURE = {
  /** Fades out towards the bottom (page headers). */
  basso: "linear-gradient(to bottom, black 20%, transparent 90%)",
  /** Fades out on every side (bands in the middle of a page). */
  bordi: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
  nessuna: undefined,
} as const;

/** Dot grid. Visible on purpose (was 3% under an 80% veil, i.e. invisible). */
export function Puntini({ sfuma = "basso", className }: { sfuma?: keyof typeof SFUMATURE; className?: string }) {
  const mask = SFUMATURE[sfuma];
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.09) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}

const DISPOSIZIONI = {
  /** Original "Dati" band: lime on the left, cyan on the right. */
  fascia: [
    "left-[5%] top-[10%] h-[400px] w-[600px] bg-[radial-gradient(ellipse,rgba(191,255,0,0.12),transparent)]",
    "right-[5%] top-[25%] h-[350px] w-[500px] bg-[radial-gradient(ellipse,rgba(0,229,255,0.1),transparent)]",
  ],
  /** Home hero: glows on the right, away from the headline (bottom-left). */
  hero: [
    "-right-[5%] top-[8%] h-[560px] w-[760px] bg-[radial-gradient(ellipse,rgba(191,255,0,0.10),transparent_70%)]",
    "right-[25%] bottom-[5%] h-[420px] w-[560px] bg-[radial-gradient(ellipse,rgba(0,229,255,0.08),transparent_70%)]",
  ],
  /** Inner-page header: smaller and quieter than the home. */
  testata: [
    "-right-[8%] -top-[10%] h-[460px] w-[640px] bg-[radial-gradient(ellipse,rgba(191,255,0,0.09),transparent_70%)]",
    "right-[12%] top-[35%] h-[420px] w-[620px] bg-[radial-gradient(ellipse,rgba(0,229,255,0.06),transparent_70%)]",
  ],
} as const;

/** Lime and cyan glows (the "Dati, sicurezza e controllo" background). */
export function Bagliori({ disposizione }: { disposizione: keyof typeof DISPOSIZIONI }) {
  return (
    <>
      {DISPOSIZIONI[disposizione].map((c) => (
        <div key={c} aria-hidden className={cn("pointer-events-none absolute max-w-full rounded-full", c)} />
      ))}
    </>
  );
}

const TAGLIE = {
  /** "Chi siamo" in the home: short word (the logo), lots of room. */
  grande: "text-[160px] tracking-[-8px] lg:text-[300px] lg:tracking-[-15px]",
  /** Inner-page headers: longer words, sits behind the H1. */
  media: "text-[96px] tracking-[-4px] sm:text-[140px] sm:tracking-[-6px] lg:text-[220px] lg:tracking-[-10px]",
} as const;

/** Giant background word (the "Chi siamo" background). */
export function ScrittaSfondo({ testo, taglia = "grande", className }: { testo: string; taglia?: keyof typeof TAGLIE; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute right-0 top-0 select-none overflow-hidden", className)}>
      <span className={cn("block whitespace-nowrap text-right font-display font-extrabold leading-none text-accent/[0.035]", TAGLIE[taglia])}>
        {testo}
      </span>
    </div>
  );
}
