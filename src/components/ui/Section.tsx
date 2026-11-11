import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  tag?: string;
  /** Optional section number, rendered as "01 / TAG" like the production home. */
  numero?: number;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  /** "alterno" uses bg-1 to give inner pages a rhythm; bg-1 cards inside switch to bg-0 (see globals.css). */
  tono?: "base" | "alterno";
  className?: string;
  children: React.ReactNode;
}

/** Standard content section in the production style: mono tag, large H2, optional intro, body. */
export default function Section({ id, tag, numero, title, intro, tono = "base", className, children }: SectionProps) {
  const etichetta = tag && numero ? `${String(numero).padStart(2, "0")} / ${tag}` : tag;
  return (
    <section
      id={id}
      data-tono={tono}
      className={cn("scroll-mt-20 border-t border-border py-20 lg:py-[100px]", tono === "alterno" ? "bg-bg-1" : "bg-bg-0", className)}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        {etichetta && <span className="font-label text-[13px] font-medium tracking-[2px] text-accent">{etichetta}</span>}
        {title && (
          <h2 className="mt-4 max-w-4xl text-3xl font-display font-extrabold leading-[1.1] tracking-[-0.5px] text-text-0 lg:text-[48px] lg:tracking-[-1px]">
            {title}
          </h2>
        )}
        {intro && <div className="mt-4 max-w-[640px] text-base leading-relaxed text-text-1">{intro}</div>}
        <div className={cn(title || tag ? "mt-12" : "")}>{children}</div>
      </div>
    </section>
  );
}
