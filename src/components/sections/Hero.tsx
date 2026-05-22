"use client";

import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden pb-24">
      {/* BG image placeholder — dark grid/tech pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Gradient overlays like design */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-0 via-bg-0/85 to-bg-0/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/80 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-14">
        <div className="max-w-[900px]">
          <h1 className="animate-[fadeIn_0.6s_ease_forwards] opacity-0">
            <span className="block text-[80px] font-extrabold leading-none tracking-[-4px] text-text-0">
              AUTOMATIZZIAMO
            </span>
            <span className="mt-2 flex gap-4">
              <span className="text-[80px] font-extrabold leading-none tracking-[-4px] text-accent">IL TUO</span>
              <span className="text-[80px] font-extrabold leading-none tracking-[-4px] text-cyan">BUSINESS.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-[560px] animate-[fadeIn_0.6s_ease_0.3s_forwards] text-lg leading-relaxed text-text-1 opacity-0" style={{ lineHeight: 1.6 }}>
            Progettiamo sistemi intelligenti che eliminano il lavoro ripetitivo e accelerano la crescita della tua azienda.
          </p>

          <div className="mt-8 flex animate-[fadeIn_0.6s_ease_0.6s_forwards] items-center gap-4 opacity-0">
            <Button href="/contatti" variant="gradient" size="lg">INIZIA ORA &rarr;</Button>
            <a href="#risultati" className="border border-text-0 px-6 py-3 font-mono text-[11px] font-medium tracking-wider text-text-0 transition-colors hover:border-accent hover:text-accent" style={{ letterSpacing: "1px" }}>
              VEDI I CASI STUDIO
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
