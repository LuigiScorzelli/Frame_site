"use client";

import { useState } from "react";
import BlogCard from "@/components/ui/BlogCard";
import type { Articolo } from "@/lib/types";

const categories = ["TUTTI", "AUTOMAZIONE", "AI", "SVILUPPO", "CASE STUDY", "GUIDE"];

interface BlogGridProps {
  articoli: Articolo[];
}

export default function BlogGrid({ articoli }: BlogGridProps) {
  const [active, setActive] = useState("TUTTI");

  const filtered = active === "TUTTI"
    ? articoli
    : articoli.filter((a) => a.categoria?.toUpperCase() === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 font-mono text-[11px] font-medium tracking-wider transition-all ${active === cat ? "bg-accent text-bg-0" : "border border-border bg-bg-1 text-text-1 hover:border-accent/40 hover:text-text-0"}`}
            style={{ letterSpacing: "1px" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <BlogCard key={a.id} articolo={a} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-text-1">Nessun articolo trovato per questa categoria.</p>
      )}
    </div>
  );
}
