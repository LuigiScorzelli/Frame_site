import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata: Metadata = {
  title: "Chi Siamo — FR>ME | AI, automazioni e controllo dei dati",
  description:
    "Scopri FR>ME: automazioni, agenti AI e software custom per analizzare dati interni, proteggere know-how e semplificare processi aziendali.",
  openGraph: {
    title: "Chi Siamo — FR>ME",
    description:
      "Uno studio operativo per automazioni, agenti AI e software custom con attenzione a dati, sicurezza e know-how aziendale.",
    url: "https://aiframe.it/chi-siamo",
  },
};

const principles = [
  { value: "DATI", label: "ANALISI INTERNA E SETUP CONTROLLATI", color: "text-text-0" },
  { value: "SICUREZZA", label: "ACCESSI, PERMESSI E INTEGRAZIONI GOVERNATE", color: "text-accent" },
  { value: "KNOW-HOW", label: "PROCEDURE AZIENDALI PROTETTE", color: "text-cyan" },
];

const servizi = [
  { icon: "⚡", title: "Automazioni intelligenti", desc: "Automatizziamo attivita ripetitive e flussi operativi riducendo passaggi manuali, errori e copie non necessarie di dati sensibili.", tags: ["WORKFLOW", "N8N", "MAKE"] },
  { icon: "◎", title: "Agenti AI su misura", desc: "Costruiamo assistenti operativi e sistemi di supporto interno progettati intorno a dati, procedure e permessi definiti.", tags: ["AI AGENTS", "ASSISTENTI", "PERMESSI"], iconCyan: true },
  { icon: "◇", title: "Software e setup proprietari", desc: "Sviluppiamo strumenti web e ambienti controllati per analizzare dati interni e gestire processi non coperti da software standard.", tags: ["DATI INTERNI", "ACCESSI", "API"] },
  { icon: "◈", title: "Integrazioni operative", desc: "Colleghiamo strumenti gia in uso per ridurre copia-incolla, errori, passaggi manuali e lavoro disperso tra troppe piattaforme.", tags: ["CRM", "EMAIL", "GESTIONALI"], iconCyan: true },
  { icon: "⬡", title: "Amazon SEO", desc: "Aiutiamo seller Amazon italiani a lavorare su listing, intenti di ricerca e flussi operativi legati alla gestione del catalogo.", tags: ["LISTING", "KEYWORD", "SELLER"] },
  { icon: "◆", title: "Ottimizzazione processi", desc: "Analizziamo il lavoro quotidiano per capire dove semplificare, automatizzare e costruire strumenti piu adatti al team.", tags: ["PROCESSI", "OPERATIONS"], iconCyan: true },
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
                Uno studio operativo<br />per dati, AI e processi.
              </h1>
              <p className="mt-5 max-w-[560px] text-lg leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
                FR&gt;ME nasce per costruire tecnologia utile dove contano controllo dei dati, sicurezza e protezione del know-how aziendale.
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
                Portare AI e automazione dentro l&apos;azienda, senza perdere controllo sulle informazioni.
              </h2>
            </div>

            <div className="grid gap-16 lg:grid-cols-2">
              {/* Left: paragraphs */}
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
                  FR&gt;ME nasce dall&apos;esigenza delle aziende di analizzare dati internamente, automatizzare processi e usare agenti AI senza disperdere informazioni sensibili, procedure e know-how su strumenti esterni non governati.
                </p>
                <p className="text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
                  Lavoriamo come partner tecnico operativo: partiamo dai processi reali, definiamo il perimetro dei dati e costruiamo soluzioni su misura con attenzione a sicurezza, accessi, integrazioni e continuita del lavoro quotidiano.
                </p>
              </div>

              {/* Right: stats */}
              <div className="space-y-4">
                {principles.map((s) => (
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
              <h2 className="mt-4 text-[40px] font-extrabold tracking-[-2px] text-text-0">Soluzioni su misura per processi reali.</h2>
              <p className="mt-4 max-w-[600px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
                Partiamo da come lavora la tua azienda e costruiamo automazioni, agenti AI o software custom intorno a dati, processi e requisiti di sicurezza.
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
              Prenota una call gratuita di 30 minuti e scopri quali processi possiamo semplificare mantenendo controllo su dati e know-how.
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
