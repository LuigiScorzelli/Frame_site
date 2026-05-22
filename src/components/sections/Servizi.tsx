"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const Tag = ({ children }: { children: string }) => (
  <span className="bg-accent-dim border border-[#2A3F66] px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-wider text-accent" style={{ letterSpacing: "1px" }}>
    {children}
  </span>
);

export default function Servizi() {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <section id="servizi" ref={ref} className="relative bg-bg-0 py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1440px] px-14">
        <div className="mb-12">
          <span className="font-mono text-xs font-medium tracking-[2px] text-accent">01 / COSA FACCIAMO</span>
          <h2 className="mt-4 text-[48px] font-extrabold tracking-[-2px] text-text-0">Servizi su misura.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
            Progettiamo soluzioni digitali che trasformano il tuo business.
          </p>
        </div>

        {/* Bento Grid */}
        <div className={cn("flex gap-6 flex-col lg:flex-row transition-all duration-500", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
          {/* Large card */}
          <div className="group relative flex-1 overflow-hidden border border-border bg-cover bg-center p-8" style={{ minHeight: 400, backgroundImage: "url('/images/servizi/automazione.jpg')" }}>
            <div className="absolute inset-0 bg-bg-0/90" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-accent">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-text-0">AUTOMAZIONE PROCESSI</h3>
                <p className="max-w-[380px] text-sm leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
                  Eliminiamo le attivita ripetitive con workflow intelligenti e personalizzati per la tua azienda. Dalla mappatura dei processi all&apos;implementazione di sistemi automatici che lavorano 24/7.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                <Tag>WORKFLOW</Tag>
                <Tag>RPA</Tag>
                <Tag>API INTEGRATION</Tag>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex w-full flex-col gap-6 lg:w-[500px]">
            {/* Sviluppo card */}
            <div className="group relative flex-1 overflow-hidden border border-border bg-cover bg-center p-8" style={{ backgroundImage: "url('/images/servizi/sviluppo.jpg')" }}>
              <div className="absolute inset-0 bg-bg-0/85" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-accent">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14.5" y1="4" x2="9.5" y2="20"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-0">SVILUPPO SOFTWARE</h3>
                <p className="mb-4 max-w-[380px] text-sm leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
                  Costruiamo piattaforme scalabili e performanti con tecnologie all&apos;avanguardia.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Tag>REACT</Tag>
                  <Tag>NODE.JS</Tag>
                  <Tag>CLOUD</Tag>
                </div>
              </div>
            </div>

            {/* Consulenza card */}
            <div className="group relative flex-1 overflow-hidden border border-border bg-cover bg-center p-8" style={{ backgroundImage: "url('/images/servizi/consulenza.jpg')" }}>
              <div className="absolute inset-0 bg-bg-0/85" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-accent">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a9 9 0 0 0-9 9c0 3.9 2.5 7.1 6 8.4V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.6c3.5-1.3 6-4.5 6-8.4a9 9 0 0 0-9-9z"/><path d="M9 14c0-1.7 1.3-3 3-3s3 1.3 3 3"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/></svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-0">CONSULENZA AI</h3>
                <p className="mb-4 max-w-[380px] text-sm leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
                  Integriamo l&apos;intelligenza artificiale nei tuoi processi per decisioni piu rapide e precise.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Tag>GPT</Tag>
                  <Tag>ML MODELS</Tag>
                  <Tag>NLP</Tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
