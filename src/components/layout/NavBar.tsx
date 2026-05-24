"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import GlitchLogo from "@/components/animations/GlitchLogo";

const navLinks = [
  { label: "SERVIZI", href: "/#servizi" },
  { label: "AMAZON SEO", href: "/amazon-seo" },
  { label: "CHI SIAMO", href: "/chi-siamo" },
  { label: "CASE STUDY", href: "/#risultati" },
  { label: "BLOG", href: "/blog" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-bg-0/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20" : "bg-transparent"
    )}>
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-14">
        <Link href="/">
          <GlitchLogo className="text-lg font-extrabold tracking-tight" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-mono text-xs font-medium tracking-wider text-text-1 transition-colors hover:text-text-0" style={{ letterSpacing: "1px" }}>{link.label}</Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/contatti" className="bg-accent px-5 py-2 font-mono text-[10px] font-bold tracking-wider text-bg-0" style={{ letterSpacing: "1px" }}>
            PARLA CON NOI &rarr;
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden" aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}>
          <span className={cn("block h-0.5 w-6 bg-text-0 transition-all duration-300", mobileOpen && "translate-y-2 rotate-45")} />
          <span className={cn("block h-0.5 w-6 bg-text-0 transition-all duration-300", mobileOpen && "opacity-0")} />
          <span className={cn("block h-0.5 w-6 bg-text-0 transition-all duration-300", mobileOpen && "-translate-y-2 -rotate-45")} />
        </button>
      </nav>

      <div className={cn(
        "fixed inset-0 z-40 bg-bg-0/95 backdrop-blur-xl transition-all duration-300 md:hidden",
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="font-mono text-xl font-medium tracking-wider text-text-0 transition-colors hover:text-accent">{link.label}</Link>
          ))}
          <Link href="/contatti" onClick={() => setMobileOpen(false)} className="mt-4 bg-accent px-8 py-3 font-mono text-sm font-bold tracking-wider text-bg-0">PARLA CON NOI &rarr;</Link>
        </div>
      </div>
    </header>
  );
}
