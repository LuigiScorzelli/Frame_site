import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { Articolo } from "@/lib/types";

interface BlogCardProps {
  articolo: Articolo;
  className?: string;
}

export default function BlogCard({ articolo, className }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${articolo.slug}`}
      className={cn(
        "group flex w-[420px] max-w-full flex-col overflow-hidden border border-border bg-bg-1 transition-all duration-300",
        "hover:border-accent/30",
        className
      )}
    >
      <div className="relative h-[200px] overflow-hidden bg-bg-2">
        {articolo.cover ? (
          <Image
            src={getStrapiMediaUrl(articolo.cover.url)}
            alt={articolo.cover.alternativeText || articolo.titolo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-2xl text-text-1/30">FR&gt;ME</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="border border-[#2A3F66] bg-accent-dim px-2 py-0.5 font-mono text-[9px] font-medium tracking-wider text-accent" style={{ letterSpacing: "1px" }}>
            {articolo.categoria?.toUpperCase()}
          </span>
          <span className="font-mono text-[9px] tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>{formatDate(articolo.publishedAt).toUpperCase()}</span>
        </div>
        <h3 className="mb-2 text-base font-bold leading-tight tracking-[-0.5px] text-text-0" style={{ lineHeight: 1.3 }}>
          {articolo.titolo}
        </h3>
        <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>{articolo.excerpt}</p>
        <span className="mt-auto font-mono text-[11px] font-bold tracking-wider text-accent" style={{ letterSpacing: "1px" }}>LEGGI &rarr;</span>
      </div>
    </Link>
  );
}
