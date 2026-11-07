import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  tag?: string;
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Standard content section: optional mono tag, H2 title, body. */
export default function Section({ id, tag, title, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("border-t border-border py-20 lg:py-24", className)}>
      <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
        {tag && (
          <span className="font-mono text-xs font-medium tracking-[2px] text-accent">{tag}</span>
        )}
        {title && (
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-1px] text-text-0 lg:text-4xl">
            {title}
          </h2>
        )}
        <div className={cn(title || tag ? "mt-10" : "")}>{children}</div>
      </div>
    </section>
  );
}
