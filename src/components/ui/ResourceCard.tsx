import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { Risorsa } from "@/lib/types";

interface ResourceCardProps {
  risorsa: Risorsa;
  className?: string;
}

const tipoBadgeColors: Record<string, string> = {
  Ebook: "bg-cyan/10 text-cyan",
  Template: "bg-accent/10 text-accent",
  Prompt: "bg-amber/10 text-amber",
  Checklist: "bg-red/10 text-red",
};

export default function ResourceCard({ risorsa, className }: ResourceCardProps) {
  return (
    <div className={cn(
      "group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-bg-1 transition-all duration-300",
      "hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5",
      className
    )}>
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-2">
        {risorsa.cover ? (
          <Image
            src={getStrapiMediaUrl(risorsa.cover.url)}
            alt={risorsa.titolo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-2xl text-text-1/30">FR&gt;ME</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className={cn("rounded-md px-2.5 py-1 font-mono text-[11px] font-medium", tipoBadgeColors[risorsa.tipo] || "bg-bg-2 text-text-1")}>
            {risorsa.tipo}
          </span>
          {risorsa.gratuito && (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium text-accent">FREE</span>
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text-0">{risorsa.titolo}</h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-1">{risorsa.descrizione}</p>
        <Link
          href={`/risorse/${risorsa.slug}`}
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          Scarica risorsa <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
