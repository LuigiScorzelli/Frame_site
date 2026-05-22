import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata: Metadata = {
  title: "Chi Siamo — FR>ME | AI Implementation Partner",
  description:
    "Scopri il team FR>ME: esperti in automazione AI, sviluppo software e consulenza per PMI italiane. 320h+ automatizzate ogni mese.",
  openGraph: {
    title: "Chi Siamo — FR>ME",
    description:
      "Il team che automatizza il futuro delle PMI italiane con AI concreta.",
    url: "https://aiframe.it/chi-siamo",
  },
};

const stats = [
  { value: "320h+", label: "ORE AUTOMATIZZATE OGNI MESE", color: "text-text-0" },
  { value: "12+", label: "AUTOMAZIONI ATTIVE IN PRODUZIONE", color: "text-accent" },
  { value: "3 sett.", label: "TEMPO MEDIO DI DELIVERY", color: "text-cyan" },
];

const servizi = [
  { icon: "⚡", title: "Automazione Processi", desc: "Eliminiamo le attivita ripetitive con workflow intelligenti. Dalla mappatura all\u2019implementazione di sistemi che lavorano 24/7.", tags: ["ZAPIER", "N8N", "MAKE"] },
  { icon: "◇", title: "Sviluppo Software", desc: "Costruiamo piattaforme scalabili e performanti con tecnologie all\u2019avanguardia. Web app, API, microservizi.", tags: ["REACT", "NODE.JS", "PYTHON"] },
  { icon: "◎", title: "Consulenza AI", desc: "Integriamo l\u2019intelligenza artificiale nei tuoi processi per decisioni piu rapide, chatbot e modelli predittivi.", tags: ["GPT", "ML MODELS", "NLP"], iconCyan: true },
  { icon: "◈", title: "Data Analytics", desc: "Trasformiamo i tuoi dati in insight azionabili con dashboard, report avanzati e business intelligence.", tags: ["POWER BI", "LOOKER"], iconCyan: true },
  { icon: "⬡", title: "Sicurezza & Compliance", desc: "Garantiamo che ogni soluzione rispetti gli standard di sicurezza e le normative vigenti. GDPR, penetration testing.", tags: ["GDPR", "ISO 27001"] },
  { icon: "◆", title: "UX/UI Design", desc: "Progettiamo interfacce intuitive e esperienze utente che convertono. Design system, prototipi interattivi.", tags: [], iconCyan: true },
];

export default function ChiSiamoPage() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero with BG image */}
        <section className="relative h-[500px] overflow-hidden">
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-0 via-bg-0/80 to-bg-0/30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/80 to-transparent" />
          <div className="relative z-10 mx-auto max-w-[1440px] px-14">
            <div className="pt-[200px]">
              <span className="font-mono text-xs font-medium tracking-[3px] text-accent">CHI SIAMO</span>
              <h1 className="mt-5 max-w-[800px] text-[56px] font-extrabold leading-[1.05] tracking-[-3px] text-text-0">
                Un team che parla<br />la lingua dei risultati.
              </h1>
              <p className="mt-5 max-w-[560px] text-lg leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
                Ingegneri, designer e strategist uniti dalla passione per l&apos;automazione e l&apos;innovazione tecnologica.
              </p>
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="bg-bg-0 py-20">
          <div className="mx-auto max-w-[1440px] px-14">
            <div className="mb-12">
              <span className="font-mono text-xs font-medium tracking-[2px] text-accent">LA NOSTRA MISSIONE</span>
              <h2 className="mt-4 max-w-[700px] text-[40px] font-extrabold tracking-[-2px] text-text-0">
                Inquadrare il futuro attraverso la tecnologia.
              </h2>
            </div>

            <div className="grid gap-16 lg:grid-cols-2">
              {/* Left: paragraphs */}
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
                  FR&gt;ME nasce dalla convinzione che ogni business merita strumenti intelligenti. Il nostro nome — una fusione tra &quot;frame&quot; e il simbolo &quot;&gt;&quot; del codice — rappresenta la nostra missione: inquadrare il futuro attraverso la tecnologia.
                </p>
                <p className="text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
                  Siamo un team di ingegneri, designer e strategist che parlano la stessa lingua: quella dei risultati misurabili. Ogni progetto parte da un principio semplice: eliminare il superfluo, potenziare cio che conta.
                </p>
              </div>

              {/* Right: stats */}
              <div className="space-y-4">
                {stats.map((s) => (
                  <div key={s.label} className="border border-border bg-bg-1 p-6">
                    <div className={`text-4xl font-extrabold tracking-[-2px] ${s.color}`}>{s.value}</div>
                    <div className="mt-1 font-mono text-[10px] font-medium tracking-[2px] text-text-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="border-t border-border bg-bg-0 py-20">
          <div className="mx-auto max-w-[1440px] px-14">
            <div className="mb-12">
              <span className="font-mono text-xs font-medium tracking-[2px] text-accent">I NOSTRI SERVIZI</span>
              <h2 className="mt-4 text-[40px] font-extrabold tracking-[-2px] text-text-0">Soluzioni su misura per ogni sfida.</h2>
              <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
                Dalla consulenza strategica all&apos;implementazione tecnica, copriamo l&apos;intero ciclo di vita dei tuoi progetti digitali.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {servizi.map((s) => (
                <div key={s.title} className="border border-border bg-bg-1 p-8">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-2 text-xl ${s.iconCyan ? "text-cyan" : "text-accent"}`}>{s.icon}</div>
                  <h3 className="mb-2 text-xl font-bold tracking-[-0.5px] text-text-0">{s.title}</h3>
                  <p className="mb-4 text-sm text-text-1" style={{ lineHeight: 1.7 }}>{s.desc}</p>
                  {s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map((tag) => (
                        <span key={tag} className="border border-[#2A3F66] bg-accent-dim px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-wider text-accent" style={{ letterSpacing: "1px" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-bg-0 py-20 text-center">
          <div className="mx-auto max-w-[1440px] px-14">
            <span className="font-mono text-xs font-medium tracking-[3px] text-accent">PRONTO A INIZIARE?</span>
            <h2 className="mt-4 text-[48px] font-extrabold tracking-[-2px] text-text-0">Parliamo del tuo progetto.</h2>
            <p className="mx-auto mt-4 max-w-[500px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
              Prenota una call gratuita di 30 minuti e scopri come possiamo trasformare il tuo business.
            </p>
            <a
              href="/contatti"
              className="mt-8 inline-flex items-center justify-center px-8 py-4 font-mono text-xs font-bold tracking-wider text-bg-0"
              style={{ background: "linear-gradient(135deg, #BFFF00, #00E5FF)", letterSpacing: "1px" }}
            >
              PRENOTA LA TUA CALL &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
