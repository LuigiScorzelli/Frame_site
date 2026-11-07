import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import { AGENCY_NAME, BOOKING_URL, CITY, CONTACT_EMAIL, FOUNDER_URL, PLUGIN_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: `Automazioni e assistenti AI per piccole aziende | ${AGENCY_NAME}` },
  description:
    "Costruiamo automazioni, assistenti AI e collegamenti tra gli strumenti che usate già, per piccole aziende senza reparto tecnico. E abbiamo un plugin WordPress gratuito.",
  alternates: { canonical: "/" },
};

const cosaFacciamo = [
  {
    titolo: "Automazioni dei flussi ripetitivi",
    testo: "Copiare dati da un'email a un foglio, mandare lo stesso promemoria ogni settimana, aggiornare due programmi a mano: lo fa il sistema, voi controllate.",
  },
  {
    titolo: "Assistenti AI sui vostri dati",
    testo: "Assistenti che rispondono con i vostri documenti e le vostre procedure, per i clienti o per chi lavora con voi. Con permessi chiari su cosa possono leggere.",
  },
  {
    titolo: "Collegamenti tra gli strumenti",
    testo: "CRM, email, fogli, gestionale ed e-commerce che si passano i dati da soli, senza copia-incolla e senza doppioni.",
  },
  {
    titolo: "Strumenti su misura",
    testo: "Quando il software standard non copre un pezzo del vostro lavoro, costruiamo lo strumento che manca, collegato a quello che avete già.",
  },
];

const passi = [
  {
    titolo: "Analisi",
    testo: "Partiamo da 30 minuti di chiamata: ci raccontate dove si perde tempo e quali dati usate ogni giorno.",
  },
  {
    titolo: "Dati e accessi",
    testo: "Prima di costruire decidiamo chi può vedere cosa, dove restano i dati e quali strumenti tocchiamo.",
  },
  {
    titolo: "Costruzione",
    testo: "Realizziamo la soluzione e la colleghiamo agli strumenti che usate già, senza cambiare il vostro modo di lavorare più del necessario.",
  },
  {
    titolo: "Prova e ritocchi",
    testo: "La proviamo su casi reali con il vostro team, correggiamo quello che non va e la miglioriamo dopo il rilascio.",
  },
];

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-20 pt-36 lg:pb-28 lg:pt-44">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">
              AUTOMAZIONI E AI PER PICCOLE AZIENDE
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-2px] text-text-0 sm:text-5xl lg:text-7xl">
              Quanto lavoro ripetitivo fate ancora a mano?
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-1">
              Siamo {AGENCY_NAME}. Costruiamo automazioni, assistenti AI e collegamenti tra gli strumenti che usate già,
              per piccole aziende senza reparto tecnico.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CtaButton href={BOOKING_URL} evento="click_prenota" props={{ pagina: "home", posizione: "hero" }}>
                PRENOTA 30 MINUTI &rarr;
              </CtaButton>
              <CtaButton href="/plugin" variant="secondary">
                SCOPRI IL PLUGIN GRATUITO
              </CtaButton>
            </div>
          </div>
        </section>

        <Section tag="COSA FACCIAMO" title="Cosa costruiamo, in concreto">
          <div className="grid gap-6 md:grid-cols-2">
            {cosaFacciamo.map((c, i) => (
              <div key={c.titolo} className="border border-border bg-bg-1 p-8">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold text-text-0">{c.titolo}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-1">{c.testo}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section tag="PER CHI" title="Per chi lavoriamo">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Piccole aziende senza reparto tecnico, con i dati sparsi tra email, fogli e gestionale, e qualcuno che passa
            ogni settimana ore a spostarli da un posto all&apos;altro. Non serve sapere cos&apos;è un&apos;API: ci basta
            capire come lavorate oggi.
          </p>
        </Section>

        <Section tag="COME LAVORIAMO" title="Quattro passi, nessuna sorpresa">
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {passi.map((p, i) => (
              <li key={p.titolo} className="flex flex-col gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent font-mono text-sm font-bold text-accent">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-text-0">{p.titolo}</h3>
                <p className="text-[15px] leading-relaxed text-text-1">{p.testo}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[15px] text-text-1">Dopo la chiamata ricevete una proposta scritta di una pagina.</p>
        </Section>

        {/* Plugin band */}
        <section className="border-t border-accent-border bg-bg-1 py-20 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-cyan">IL NOSTRO PRIMO PRODOTTO</span>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-1px] text-text-0 lg:text-4xl">
              {PLUGIN_NAME}: il sito WordPress che risponde anche quando siete chiusi
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-1">
              Un plugin WordPress gratuito che risponde ai clienti con le informazioni del vostro sito, raccoglie nome,
              recapito e cosa cercano, e ve li consegna in posta. È in prova su siti reali dal 24 ottobre 2026 e supera
              37 collaudi automatici su 37 (test interni).
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CtaButton href="/plugin" evento="click_installa" props={{ pagina: "home", posizione: "pagina" }}>
                INSTALLA GRATIS &rarr;
              </CtaButton>
              <Link href="/check-up" className="font-mono text-sm text-accent underline-offset-4 hover:underline">
                Oppure fai il check-up del tuo sito in 2 minuti &rarr;
              </Link>
            </div>
          </div>
        </section>

        <Section tag="DATI" title="I vostri dati restano sotto controllo">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Ogni progetto parte da una domanda: quali dati servono davvero, e chi deve poterli vedere. Diamo accessi solo
            dove servono, non copiamo informazioni sensibili in giro per strumenti diversi e vi lasciamo il controllo di
            quello che costruiamo. Come trattiamo i dati di chi visita questo sito è scritto nella{" "}
            <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">pagina privacy</Link>.
          </p>
        </Section>

        <Section id="chi-siamo" tag="CHI C'È DIETRO" title="Chi siamo">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            {AGENCY_NAME} è lo studio di Luigi Scorzelli, a {CITY}. Costruiamo automazioni per piccole aziende senza
            reparto tecnico. {PLUGIN_NAME} nasce da una cosa vista in ogni azienda per cui abbiamo lavorato: le
            richieste arrivano alle 22 e qualcuno le legge alle 9.
          </p>
          <a href={FOUNDER_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-mono text-sm text-accent hover:underline">
            {FOUNDER_URL.replace(/^https?:\/\//, "")} &rarr;
          </a>
        </Section>

        <section className="border-t border-border bg-bg-1 py-24">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-14">
            <h2 className="text-3xl font-extrabold tracking-[-1px] text-text-0 lg:text-5xl">
              Raccontateci un processo che vi fa perdere tempo.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href={BOOKING_URL} evento="click_prenota" props={{ pagina: "home", posizione: "chiusura" }}>
                PRENOTA 30 MINUTI &rarr;
              </CtaButton>
              <CtaButton href={`mailto:${CONTACT_EMAIL}`} variant="secondary">
                {CONTACT_EMAIL.toUpperCase()}
              </CtaButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
