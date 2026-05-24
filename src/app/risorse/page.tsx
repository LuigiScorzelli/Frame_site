import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ChatWidget from "@/components/ui/ChatWidget";
import { getRisorse } from "@/lib/strapi";
import type { Risorsa } from "@/lib/types";

export const metadata: Metadata = {
  title: "Risorse — FR>ME | Template, Guide e Checklist operative",
  description:
    "Scarica template, guide e checklist su automazioni, setup proprietari, sicurezza dei dati e processi aziendali.",
  openGraph: {
    title: "Risorse — FR>ME",
    description:
      "Template, guide e strumenti per automatizzare processi mantenendo controllo su dati e know-how.",
    url: "https://aiframe.it/risorse",
  },
};

const fallbackResources = [
  { icon: "◇", badge: "TEMPLATE", badgeColor: "accent", title: "Process Audit Template", desc: "Mappa processi, strumenti e dati coinvolti per capire dove automatizzare senza perdere controllo sulle informazioni.", ctaColor: "accent" },
  { icon: "◎", badge: "GUIDA PDF", badgeColor: "cyan", title: "Guida ai setup AI proprietari", desc: "Una guida pratica per valutare agenti AI, dati interni, accessi e strumenti prima di introdurre automazioni in azienda.", ctaColor: "cyan" },
  { icon: "⬡", badge: "CHECKLIST", badgeColor: "accent", title: "Checklist sicurezza dati", desc: "Punti di controllo per valutare accessi, permessi, integrazioni e trattamento dei dati nelle automazioni operative.", ctaColor: "accent" },
];

function ResourceCardStatic({ r }: { r: typeof fallbackResources[0] }) {
  const isAccent = r.ctaColor === "accent";
  return (
    <div className="flex w-[420px] max-w-full flex-col justify-between border border-border bg-bg-1 p-8">
      <div className="space-y-4">
        <span
          className={`inline-block border border-[#2A3F66] px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider ${isAccent ? "bg-accent-dim text-accent" : "bg-[#00E5FF14] text-cyan"}`}
          style={{ letterSpacing: "1px" }}
        >
          {r.badge}
        </span>
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-bg-2 text-[28px] ${isAccent ? "text-accent" : "text-cyan"}`}>
          {r.icon}
        </div>
        <h3 className="text-lg font-bold tracking-[-0.5px] text-text-0">{r.title}</h3>
        <p className="text-sm text-text-1" style={{ lineHeight: 1.6 }}>{r.desc}</p>
      </div>
      <button
        className={`mt-6 w-full py-3 font-mono text-[11px] font-bold tracking-wider text-bg-0 ${isAccent ? "bg-accent" : "bg-cyan"}`}
        style={{ letterSpacing: "1px" }}
      >
        SCARICA GRATIS &rarr;
      </button>
    </div>
  );
}

export default async function RisorsePage() {
  let risorse: Risorsa[] = [];

  try {
    const res = await getRisorse();
    risorse = res.data;
  } catch {
    // Strapi not available
  }

  return (
    <>
      <NavBar />
      <main>
        {/* Header */}
        <section className="bg-bg-0 pt-24 lg:pt-28">
          <div className="mx-auto max-w-[1440px] px-14 pb-12 pt-20">
            <span className="font-mono text-xs font-medium tracking-[3px] text-accent">RISORSE GRATUITE</span>
            <h1 className="mt-6 max-w-[800px] text-[48px] font-extrabold leading-[1.1] tracking-[-2px] text-text-0">
              Tool, template e guide<br />per accelerare il tuo business.
            </h1>
            <p className="mt-6 max-w-[560px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
              Risorse pratiche per ragionare su automazioni, dati interni, sicurezza e controllo operativo.
            </p>
          </div>
        </section>

        {/* Resources grid */}
        <section className="bg-bg-0 pb-20">
          <div className="mx-auto max-w-[1440px] px-14">
            {risorse.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {risorse.map((r, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <div key={r.id} className="flex flex-col justify-between border border-border bg-bg-1 p-8">
                      <div className="space-y-4">
                        <span className={`inline-block border border-[#2A3F66] px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider ${isEven ? "bg-accent-dim text-accent" : "bg-[#00E5FF14] text-cyan"}`} style={{ letterSpacing: "1px" }}>
                          {r.tipo.toUpperCase()}
                        </span>
                        <h3 className="text-lg font-bold tracking-[-0.5px] text-text-0">{r.titolo}</h3>
                        <p className="text-sm text-text-1" style={{ lineHeight: 1.6 }}>{r.descrizione}</p>
                      </div>
                      <button className={`mt-6 w-full py-3 font-mono text-[11px] font-bold tracking-wider text-bg-0 ${isEven ? "bg-accent" : "bg-cyan"}`} style={{ letterSpacing: "1px" }}>
                        SCARICA GRATIS &rarr;
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {fallbackResources.map((r) => (
                  <ResourceCardStatic key={r.title} r={r} />
                ))}
              </div>
            )}
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
