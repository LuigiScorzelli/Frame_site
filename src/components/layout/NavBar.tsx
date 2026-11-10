"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import TrackedLink from "@/components/ui/TrackedLink";
import { AGENCY_NAME, BOOKING_URL } from "@/lib/brand";

const navLinks = [
  { label: "SERVIZI", href: "/servizi" },
  { label: "PLUGIN", href: "/plugin" },
  { label: "CHECK-UP", href: "/check-up" },
  { label: "RISORSE", href: "/risorse" },
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
      <nav aria-label="Menu principale" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-14">
        <Link href="/" aria-label={`${AGENCY_NAME}, home`}>
          <Logo className="text-2xl" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-label text-[13px] font-medium tracking-wider text-text-1 transition-colors hover:text-text-0" style={{ letterSpacing: "1px" }}>{link.label}</Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <TrackedLink href={BOOKING_URL} evento="click_prenota" props={{ posizione: "menu" }} className="bg-accent px-5 py-2.5 font-label text-[13px] font-bold tracking-wider text-bg-0" style={{ letterSpacing: "1px" }}>
            PRENOTA 30 MINUTI &rarr;
          </TrackedLink>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden" aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"} aria-expanded={mobileOpen}>
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
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="font-label text-xl font-medium tracking-wider text-text-0 transition-colors hover:text-accent">{link.label}</Link>
          ))}
          <TrackedLink href={BOOKING_URL} evento="click_prenota" props={{ posizione: "menu" }} className="mt-4 bg-accent px-8 py-3 font-label text-sm font-bold tracking-wider text-bg-0">PRENOTA 30 MINUTI &rarr;</TrackedLink>
        </div>
      </div>
    </header>
  );
}
