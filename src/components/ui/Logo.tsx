import { LOGO_TEXT } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The ">" of the logo: a rounded chevron drawn at cap height, in the accent color. */
function Chevron() {
  return (
    <svg viewBox="0 0 58 72" aria-hidden="true" className="mx-[0.03em] inline-block h-[0.7em] w-[0.56em] text-accent">
      <polyline points="12,10 46,36 12,62" fill="none" stroke="currentColor" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** FR>ME wordmark in the display font. Size it with a text-* class on the parent or via className. */
export default function Logo({ className }: { className?: string }) {
  const [prima, dopo] = LOGO_TEXT.split(">");
  return (
    <span className={cn("inline-flex items-baseline font-display font-extrabold leading-none tracking-[-0.03em] text-text-0", className)}>
      <span>{prima}</span>
      <Chevron />
      <span>{dopo}</span>
    </span>
  );
}
