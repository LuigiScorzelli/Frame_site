import { cn } from "@/lib/utils";

interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTag({ children, className }: SectionTagProps) {
  return (
    <span className={cn("font-label text-[13px] font-medium uppercase tracking-[0.2em] text-accent", className)}>
      › {children}
    </span>
  );
}
