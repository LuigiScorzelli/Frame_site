"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/components/animations/useInView";

const values = [
  { icon: "⚡", label: "VELOCITA", desc: "Deploy rapido, iterazioni continue." },
  { icon: "◆", label: "AFFIDABILITA", desc: "Sistemi robusti e testati 24/7." },
  { icon: "◎", label: "INNOVAZIONE", desc: "Sempre un passo avanti con le ultime tech." },
  { icon: "◈", label: "PARTNERSHIP", desc: "Non fornitori, ma partner strategici." },
];

const timeline = [
  { year: "2021", title: "L\u2019idea prende forma", desc: "Due sviluppatori con una passione per l\u2019automazione iniziano a costruire tool interni per le aziende locali." },
  { year: "2022", title: "Nasce FR>ME", desc: "Il brand prende forma ufficialmente. Primo ufficio, primi clienti enterprise, prime automazioni complesse." },
  { year: "2023", title: "AI-First Approach", desc: "Integriamo l\u2019intelligenza artificiale come pilastro del nostro stack. GPT, ML models e NLP entrano nei nostri workflow." },
  { year: "2024", title: "Scaling Up", desc: "Team raddoppiato, 12+ automazioni attive, partnership strategiche con leader del settore tech." },
  { year: "2025 \u2014 OGGI", title: "Il futuro e adesso", desc: "Espansione internazionale, nuove soluzioni AI-powered e un ecosistema di prodotti in crescita." },
];

export default function BrandHistory() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border bg-bg-0 py-24 lg:py-[100px]">
      {/* Big background text */}
      <div className="pointer-events-none absolute right-0 top-0 overflow-hidden">
        <span className="block text-right text-[300px] font-extrabold leading-none tracking-[-15px] text-accent/[0.035]">FR&gt;ME</span>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-14">
        <div className="mb-12">
          <span className="font-mono text-xs font-medium tracking-[2px] text-accent">03 / LA NOSTRA STORIA</span>
          <h2 className="mt-4 text-[48px] font-extrabold tracking-[-2px] text-text-0">Da un&apos;idea, un framework.</h2>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
            Nati dall&apos;ossessione per l&apos;efficienza, cresciuti con la passione per l&apos;innovazione.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: Intro + Values */}
          <div className={cn("transition-all duration-500", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
            <p className="mb-6 text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
              FR&gt;ME nasce dalla convinzione che ogni business merita strumenti intelligenti. Il nostro nome — una fusione tra &quot;frame&quot; e il simbolo &quot;&gt;&quot; del codice — rappresenta la nostra missione: inquadrare il futuro attraverso la tecnologia.
            </p>
            <p className="mb-10 text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
              Siamo un team di ingegneri, designer e strategist che parlano la stessa lingua: quella dei risultati misurabili. Ogni progetto parte da un principio semplice: eliminare il superfluo, potenziare cio che conta.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.label} className="border border-border bg-bg-1 p-6">
                  <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-bg-2 text-base">{v.icon}</div>
                  <span className="block font-mono text-[11px] font-bold tracking-wider text-accent" style={{ letterSpacing: "1px" }}>{v.label}</span>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timeline */}
          <div className={cn("transition-all duration-500 delay-150", inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
            <div className="border-l-2 pl-8" style={{ borderImage: "linear-gradient(180deg, #BFFF00, #00E5FF) 1" }}>
              {timeline.map((item, i) => (
                <div key={item.year} className={cn("pb-8", i < timeline.length - 1 && "border-b border-border")}>
                  <div className="pt-6">
                    <span className="font-mono text-[11px] font-bold tracking-[2px] text-accent">{item.year}</span>
                    <h4 className="mt-1.5 text-base font-bold text-text-0">{item.title}</h4>
                    <p className="mt-1 text-[13px] leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
