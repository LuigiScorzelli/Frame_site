import { cn } from "@/lib/utils";

interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTag({ children, className }: SectionTagProps) {
  return (
    <span className={cn("font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent", className)}>
      › {children}
    </span>
  );
}
