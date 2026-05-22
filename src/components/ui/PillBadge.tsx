import { cn } from "@/lib/utils";

interface PillBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function PillBadge({ children, className }: PillBadgeProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-2 overflow-hidden rounded-full",
        "border border-accent-border bg-accent-dim px-4 py-1.5",
        "text-xs font-medium tracking-wide text-accent",
        className
      )}
    >
      <span className="absolute inset-0 -left-[80%] h-full w-1/2 skew-x-[-20deg] animate-pill-shimmer bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
      <span className="relative">{children}</span>
    </span>
  );
}
