import { cn } from "@/lib/utils";
import TrackedLink from "@/components/ui/TrackedLink";
import type { Evento, ProprietaEvento } from "@/lib/analytics";

const base =
  "inline-flex items-center justify-center gap-2 font-mono text-[11px] font-bold tracking-wider transition-all duration-200 px-7 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0";

const variants = {
  primary: "bg-accent text-bg-0 hover:brightness-110",
  gradient: "bg-[linear-gradient(135deg,#BFFF00,#00E5FF)] text-bg-0 hover:brightness-110",
  secondary: "border border-text-0 text-text-0 hover:border-accent hover:text-accent",
};

interface CtaButtonProps {
  href: string;
  evento?: Evento;
  props?: ProprietaEvento;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}

export default function CtaButton({ href, evento, props, variant = "primary", className, children }: CtaButtonProps) {
  return (
    <TrackedLink
      href={href}
      evento={evento}
      props={props}
      className={cn(base, variants[variant], className)}
      style={{ letterSpacing: "1px" }}
    >
      {children}
    </TrackedLink>
  );
}
