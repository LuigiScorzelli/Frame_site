import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  tags?: string[];
  className?: string;
}

export default function ServiceCard({ icon, title, description, tags = [], className }: ServiceCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border/60 bg-bg-1 p-6 transition-all duration-300",
      "hover:border-accent/30 hover:bg-bg-1/80 hover:shadow-lg hover:shadow-accent/5",
      className
    )}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-border/40 bg-bg-2/50 text-xl">{icon}</div>
        <h3 className="mb-2 text-lg font-semibold text-text-0">{title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-text-1">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-md bg-bg-2/60 px-2.5 py-1 font-mono text-[11px] text-text-1/70">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
