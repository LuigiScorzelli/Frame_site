import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

const chatGptToolUrl =
  "https://chatgpt.com/g/g-69fceb94bca881919e19011a2aff1fb3-intent-hexagon-mapping-tool";

export const metadata: Metadata = {
  title: "Amazon SEO Intent Hexagon — FR>ME",
  description:
    "Scopri come Amazon interpreta keyword, intenti e percorsi di ricerca con l'Intent Hexagon. Audit Amazon SEO per seller e brand.",
  openGraph: {
    title: "Amazon SEO Intent Hexagon — FR>ME",
    description:
      "Un framework pratico per trasformare il brevetto Amazon 12,561,383 in azioni su listing, keyword, competitor e accessori.",
    url: "https://aiframe.it/amazon-seo",
    siteName: "FR>ME",
    locale: "it_IT",
    type: "website",
  },
};

const intentTiles = [
  "Specification",
  "Generalization",
  "Equivalence",
  "Substitution",
  "Complement",
  "Irrelevant",
];

const stages = [
  {
    num: "01",
    title: "Comprensione",
    desc: "Il sistema legge ogni query e ne capisce il significato, non solo le parole.",
  },
  {
    num: "02",
    title: "Classificazione",
    desc: "Ogni cambio di ricerca viene etichettato con uno dei 6 tipi di intento.",
  },
  {
    num: "03",
    title: "Previsione",
    desc: "Amazon prevede quale tipo di intento seguirà, basandosi sulla cronologia.",
  },
  {
    num: "04",
    title: "Generazione",
    desc: "Vengono generate 3-5 query che il cliente probabilmente cercherà dopo.",
  },
];

const intents = [
  {
    num: "01",
    title: "Specification",
    desc: "Il cliente restringe la ricerca aggiungendo dettagli. Sta convergendo verso un acquisto.",
    example: '"laptop" -> "gaming laptop RTX 4090"',
    color: "text-accent",
  },
  {
    num: "02",
    title: "Generalization",
    desc: "Il cliente allarga la ricerca togliendo dettagli. Non ha trovato quello che cercava.",
    example: '"standing desk 60 inch" -> "standing desk"',
    color: "text-cyan",
  },
  {
    num: "03",
    title: "Equivalence",
    desc: "Il cliente cerca un prodotto specifico per nome o modello. Sa già cosa vuole.",
    example: '"Canon EOS R6 Mark II"',
    color: "text-[#00C975]",
  },
  {
    num: "04",
    title: "Substitution",
    desc: "Il cliente cambia brand o caratteristica principale. Sta confrontando alternative.",
    example: '"Nike running shoes" -> "Asics running shoes"',
    color: "text-red",
  },
  {
    num: "05",
    title: "Complement",
    desc: "Il cliente cerca accessori o prodotti correlati. Spesso dopo un acquisto.",
    example: '"Canon R6" -> "Canon RF 50mm lens"',
    color: "text-cyan",
  },
  {
    num: "06",
    title: "Irrelevant",
    desc: "Il cliente cerca qualcosa di completamente diverso. Tutto il contesto precedente viene azzerato.",
    example: '"dog food" -> "birthday cards"',
    color: "text-text-2",
  },
];

const journeys = [
  {
    title: "Il Corridore da Maratona",
    desc: "Da una ricerca generica di scarpe, il cliente si specializza, cambia brand, poi scopre accessori.",
    steps: [
      ["running shoes", "Specification"],
      ["marathon running shoes", "Specification"],
      ["Nike marathon shoes", "Substitution"],
      ["Asics marathon shoes", "Complement"],
      ["running socks", ""],
    ],
    takeaway:
      "Un venditore di scarpe deve posizionarsi sia per il termine generico sia per il brand specifico, e sopravvivere alla sostituzione. Un venditore di accessori deve intercettare le query Complement post-acquisto.",
  },
  {
    title: "L'Appassionato di Fotografia",
    desc: "Il cliente cerca un modello specifico, lo acquista, poi parte una catena di accessori.",
    steps: [
      ["Canon EOS R6 Mark II", "Complement"],
      ["Canon RF 50mm lens", "Complement"],
      ["camera bag mirrorless", "Complement"],
      ["SD card 128GB", ""],
    ],
    takeaway:
      "Dopo l'acquisto del prodotto principale, il sistema passa a prevedere Complement. I venditori di accessori che ottimizzano per query specifiche del modello catturano l'intera catena.",
  },
  {
    title: "Il Gaming Setup Completo",
    desc: "Ricerca profonda, punto di saturazione, cambio brand, poi catena di accessori.",
    steps: [
      ["laptop", "Specification"],
      ["gaming laptop", "Specification"],
      ["gaming laptop RTX 4090", "Substitution"],
      ["Alienware laptop", "Complement"],
      ["cooling pad", "Complement"],
      ["gaming mouse wireless", ""],
    ],
    takeaway:
      "Il punto di saturazione arriva dopo più Specification senza acquisto. Da lì Amazon può prevedere alternative e accessori, creando nuove finestre di ranking.",
  },
];

const rules = [
  {
    title: "Inversione Post-Acquisto",
    desc: "Dopo un acquisto, Amazon suggerisce automaticamente accessori e prodotti correlati. Se vendi cover per telefoni, la tua finestra di massima visibilità si apre quando qualcuno compra un telefono.",
  },
  {
    title: "Punto di Saturazione",
    desc: "Dopo circa 4 ricerche sempre più specifiche senza acquisto, Amazon inizia a mostrare competitor. Se il cliente non converte durante la fase di specializzazione, il sistema prevede che vorrà alternative.",
  },
  {
    title: "Reset della Sessione",
    desc: "Una ricerca completamente fuori tema azzera il contesto precedente. Interesse, preferenze di brand e segnali raccolti vengono messi da parte.",
  },
  {
    title: "Gerarchia dei Segnali",
    desc: "Visualizzazione pagina, aggiunta al carrello e acquisto pesano diversamente. Una visualizzazione sposta poco, un carrello cambia le previsioni, un acquisto le inverte.",
  },
  {
    title: "Personalizzazione",
    desc: "La stessa ricerca produce risultati diversi per persone diverse. Amazon usa lingua, posizione, dispositivo, cronologia e dati demografici per personalizzare le previsioni.",
  },
];

const playbook = [
  {
    title: "Titolo",
    items: [
      "Inizia con il termine di categoria principale per catturare Generalization.",
      "Segui con il modificatore primario per intercettare Specification.",
      "Inserisci il brand dove il traffico Equivalence lo premia.",
      "Tratta i primi 80 caratteri come superficie critica di ranking.",
    ],
  },
  {
    title: "Bullet Point",
    items: [
      "Bullet 1: filtra traffico irrilevante e conferma il fit in 3 secondi.",
      "Bullet 2-3: dettagli di Specification con feature e prove specifiche.",
      "Bullet 4: difesa Substitution, cioè perché scegliere te rispetto alle alternative.",
      "Bullet 5: agganci Complement per accessori, bundle e prodotti correlati.",
    ],
  },
  {
    title: "Backend Keywords",
    items: [
      "Circa 60% Specification: modificatori long-tail.",
      "Circa 15% Generalization: termini di categoria ampi.",
      "Circa 15% Equivalence/Substitution: alternative e competitor.",
      "Circa 10% Complement: linguaggio di prodotti correlati.",
    ],
  },
  {
    title: "A+ Content",
    items: [
      "Modulo 1: conferma rapida di rilevanza.",
      "Modulo 2: dettagli Specification e feature.",
      "Modulo 3: posizionamento rispetto alle alternative.",
      "Modulo 4: ecosistema Complement e abbinamenti.",
    ],
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium uppercase tracking-[2px] text-accent">
      {children}
    </p>
  );
}

function PrimaryCta({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/contatti"
      className="inline-flex min-h-11 items-center justify-center bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-[1px] text-bg-0 transition-opacity hover:opacity-90"
    >
      {children}
    </Link>
  );
}

function SecondaryCta({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={chatGptToolUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center justify-center border border-cyan px-6 py-3 font-mono text-xs font-bold uppercase tracking-[1px] text-cyan transition-colors hover:bg-cyan hover:text-bg-0"
    >
      {children}
    </a>
  );
}

export default function AmazonSeoPage() {
  return (
    <>
      <NavBar />
      <main className="bg-bg-0">
        <section className="relative overflow-hidden border-b border-border pt-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(232,236,244,0.06) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div className="relative mx-auto max-w-[1180px] px-6 pb-16 pt-12 text-center md:px-14 md:pb-20">
            <SectionLabel>Amazon SEO · Brevetto 12,561,383</SectionLabel>
            <h1 className="mx-auto mt-5 max-w-[900px] text-4xl font-extrabold leading-tight text-text-0 md:text-6xl">
              Intent Hexagon: Amazon non premia più solo keyword.
              <span className="block text-accent">Anticipa l&apos;intento di acquisto.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[760px] text-base leading-relaxed text-text-1 md:text-lg">
              Amazon classifica ogni modifica di query in 6 tipi di intento e genera le prossime ricerche prima ancora che il cliente le digiti. Per seller e brand significa una cosa concreta: chi ottimizza solo le parole chiave arriva tardi.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryCta>Richiedi audit Amazon SEO</PrimaryCta>
              <SecondaryCta>Prova il tool ChatGPT</SecondaryCta>
            </div>
            <div className="mx-auto mt-12 grid max-w-[820px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {intentTiles.map((intent, index) => (
                <div key={intent} className="border border-border bg-bg-1 p-4 text-center">
                  <span className="block font-mono text-[10px] text-text-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block break-words font-mono text-[10px] font-bold uppercase tracking-[1px] text-text-0">
                    {intent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <nav className="sticky top-16 z-30 border-b border-border bg-bg-0/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1180px] gap-5 overflow-x-auto px-6 py-3 md:px-14">
            {[
              ["Problema", "#problema"],
              ["Intenti", "#hexagon"],
              ["Esempi", "#esempi"],
              ["Regole", "#regole"],
              ["Playbook", "#playbook"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[1px] text-text-1 transition-colors hover:text-accent"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section id="problema" className="border-b border-border py-20">
          <div className="mx-auto max-w-[1180px] px-6 md:px-14">
            <SectionLabel>Il problema</SectionLabel>
            <h2 className="mt-4 max-w-[820px] text-3xl font-extrabold leading-tight text-text-0 md:text-5xl">
              Il ranking Amazon ha due layer. Molti seller lavorano solo sul primo.
            </h2>
            <p className="mt-5 max-w-[760px] text-base leading-relaxed text-text-1">
              Per anni bastava presidiare keyword, titolo, bullet e backend. Oggi Amazon interpreta anche la sequenza delle ricerche: capisce perché un cliente cambia query e usa quel segnale per orientare suggerimenti, alternative e prodotti correlati.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <div className="border border-border border-t-text-2 bg-bg-1 p-7">
                <h3 className="text-xl font-bold text-text-0">Layer 1 — Keyword Matching</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-1">
                  Il sistema classico: inserisci keyword nel titolo, nei bullet e nel backend. Amazon mostra il tuo prodotto quando un cliente cerca quelle parole. Funziona ancora, ma non difende più da solo traffico, margine e conversione.
                </p>
              </div>
              <div className="border border-border border-t-accent bg-bg-1 p-7">
                <h3 className="text-xl font-bold text-text-0">Layer 2 — Intent Prediction</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-1">
                  Il nuovo sistema: Amazon analizza la sequenza di ricerche di un cliente, classifica perché ha cambiato query e prevede cosa cercherà dopo. I suggerimenti nella barra di ricerca arrivano da qui.
                </p>
              </div>
            </div>

            <div className="mt-14">
              <SectionLabel>I 4 stadi del sistema</SectionLabel>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stages.map((stage) => (
                  <div key={stage.num} className="border border-border bg-bg-1 p-6">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[1px] text-accent">
                      Stadio {stage.num}
                    </p>
                    <h3 className="mt-3 text-lg font-bold text-text-0">{stage.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-1">{stage.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="hexagon" className="border-b border-border py-20">
          <div className="mx-auto max-w-[1180px] px-6 text-center md:px-14">
            <SectionLabel>I 6 tipi di intento</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold text-text-0 md:text-5xl">
              L&apos;Intent Hexagon
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-base leading-relaxed text-text-1">
              Ogni volta che un cliente modifica la sua ricerca, Amazon classifica quella modifica in uno di questi 6 tipi. Non esiste una settima opzione.
            </p>

            <div className="mx-auto mt-8 max-w-[520px]">
              <svg viewBox="0 0 500 460" role="img" aria-label="Intent Hexagon" className="h-auto w-full">
                <polygon points="250,40 435,147 435,313 250,420 65,313 65,147" fill="none" stroke="#1E2D4A" strokeWidth="2" />
                <polygon points="250,80 400,167 400,293 250,380 100,293 100,167" fill="none" stroke="#1E2D4A" strokeWidth="1" strokeDasharray="4 7" opacity="0.65" />
                {[
                  ["250", "40", "#BFFF00"],
                  ["435", "147", "#00E5FF"],
                  ["435", "313", "#00C975"],
                  ["250", "420", "#EF4444"],
                  ["65", "313", "#00E5FF"],
                  ["65", "147", "#556B8A"],
                ].map(([cx, cy, fill]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="10" fill={fill} stroke="#0B1120" strokeWidth="3" />
                ))}
                <text x="250" y="225" textAnchor="middle" fontSize="18" fill="#E8ECF4" fontWeight="700">INTENT</text>
                <text x="250" y="250" textAnchor="middle" fontSize="18" fill="#E8ECF4" fontWeight="700">HEXAGON</text>
              </svg>
            </div>

            <div className="mt-10 grid gap-5 text-left md:grid-cols-2 xl:grid-cols-3">
              {intents.map((intent) => (
                <div key={intent.title} className="border border-border bg-bg-1 p-6 transition-colors hover:border-cyan">
                  <span className={`font-mono text-[11px] font-bold ${intent.color}`}>{intent.num}</span>
                  <h3 className="mt-3 text-xl font-bold text-text-0">{intent.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-1">{intent.desc}</p>
                  <p className="mt-4 inline-block bg-accent-dim px-3 py-2 font-mono text-[11px] leading-relaxed text-accent">
                    {intent.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="esempi" className="border-b border-border py-20">
          <div className="mx-auto max-w-[1180px] px-6 md:px-14">
            <SectionLabel>Esempi pratici</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold text-text-0 md:text-5xl">
              L&apos;Hexagon in azione
            </h2>
            <p className="mt-4 max-w-[720px] text-base leading-relaxed text-text-1">
              Tre percorsi reali di acquisto. Ogni transizione mostra come Amazon può classificare il cambio di query e cosa significa per chi vende.
            </p>
            <div className="mt-8 space-y-5">
              {journeys.map((journey) => (
                <div key={journey.title} className="border border-border bg-bg-1 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-text-0">{journey.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-1">{journey.desc}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {journey.steps.map(([query, badge], index) => (
                      <div key={`${journey.title}-${query}`} className="contents">
                        <div className="border border-border bg-bg-2 px-3 py-2 font-mono text-[11px] text-text-0">
                          {query}
                        </div>
                        {index < journey.steps.length - 1 && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-[1px] text-cyan">
                              {badge}
                            </span>
                            <span className="text-accent">-&gt;</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 border-l-2 border-accent pl-4 text-sm leading-relaxed text-text-1">
                    <strong className="text-text-0">Per il seller:</strong> {journey.takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="regole" className="border-b border-border py-20">
          <div className="mx-auto max-w-[1180px] px-6 md:px-14">
            <SectionLabel>Le 5 regole del gioco</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold text-text-0 md:text-5xl">
              Come si comporta il sistema
            </h2>
            <p className="mt-4 max-w-[760px] text-base leading-relaxed text-text-1">
              Cinque dinamiche fondamentali governano come Amazon traduce il comportamento dei clienti in previsioni.
            </p>
            <div className="mt-8 space-y-4">
              {rules.map((rule, index) => (
                <div key={rule.title} className="grid gap-4 border border-border bg-bg-1 p-6 md:grid-cols-[64px_1fr]">
                  <div className="font-mono text-4xl font-bold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-0">{rule.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-1">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="playbook" className="border-b border-border py-20">
          <div className="mx-auto max-w-[1180px] px-6 md:px-14">
            <SectionLabel>Cosa fare</SectionLabel>
            <h2 className="mt-4 max-w-[860px] text-3xl font-extrabold leading-tight text-text-0 md:text-5xl">
              Guida pratica per trasformare gli intenti in listing più competitivi
            </h2>
            <p className="mt-4 max-w-[760px] text-base leading-relaxed text-text-1">
              Quattro superfici del listing da rivedere con logica di intento: non solo dove inserire keyword, ma quale fase del percorso d&apos;acquisto intercettare e difendere.
            </p>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {playbook.map((block) => (
                <div key={block.title} className="border border-border bg-bg-1 p-7">
                  <h3 className="text-xl font-bold text-accent">{block.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-1">
                        <span className="mt-1 text-accent">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-[980px] px-6 text-center md:px-14">
            <div className="border border-border bg-bg-1 p-8 md:p-12">
              <SectionLabel>Audit Amazon SEO</SectionLabel>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-text-0 md:text-5xl">
                Vuoi applicare l&apos;Intent Hexagon ai tuoi listing Amazon?
              </h2>
              <p className="mx-auto mt-5 max-w-[700px] text-base leading-relaxed text-text-1">
                Partiamo da un audit: mappiamo query, intenti, competitor e superfici del listing per capire dove stai perdendo visibilità e quali interventi hanno priorità commerciale.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <PrimaryCta>Richiedi audit Amazon SEO</PrimaryCta>
                <SecondaryCta>Prova il tool ChatGPT</SecondaryCta>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
