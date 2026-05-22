"use client";

import { cn } from "@/lib/utils";

interface FilterTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-lg px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider transition-all duration-200",
            active === tab
              ? "bg-accent text-bg-0"
              : "border border-border/60 text-text-1 hover:border-accent/40 hover:text-text-0"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
