import { cn } from "@/lib/utils";

interface ProcessCardProps {
  number: string;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  className?: string;
}

export default function ProcessCard({ number, icon, title, description, bullets, className }: ProcessCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border/30 bg-white p-6 transition-all duration-300",
      "hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5",
      className
    )}>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs text-text-1/60">{number}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-bg-0">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-text-1">{description}</p>
      <ul className="space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm text-bg-0/70">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
