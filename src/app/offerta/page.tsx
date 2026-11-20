import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Scheda from "@/components/ui/Scheda";
import { IconaCollegamento, IconaStella } from "@/components/ui/Icone";
import ModuloCandidatura from "@/components/ui/ModuloCandidatura";
import JsonLd from "@/components/seo/JsonLd";
import { AGENCY_NAME } from "@/lib/brand";
import { OFFERTA, offertaAperta } from "@/lib/offerta";
import { metaSocial } from "@/lib/seo";

// Copy: docs/lancio/03-contenuti.md, section /offerta (approved by Luigi on 2026-11-20).
// No prices: the discount amount goes in the written estimate only.

// Re-rendered hourly so the page closes by itself after the last day (see offertaAperta).
export const revalidate = 3600;

const descrizione = `Costruiamo un agente AI per cinque piccole aziende a condizioni riservate, in cambio di un caso d'uso pubblicabile. Candidature fino al ${OFFERTA.ultimoGiornoTesto}.`;

export const metadata: Metadata = {
  title: { absolute: `Cerchiamo 5 aziende per i primi agenti AI | ${AGENCY_NAME}` },
  description: descrizione,
  alternates: { canonical: "/offerta" },
  ...metaSocial({ percorso: "/offerta", immaginePropria: true, titolo: "Cerchiamo 5 aziende per i primi agenti AI", descrizione }),
};

const ricevete: React.ReactNode[] = [
  <>
    Un agente a scelta tra i tre: preventivi e richieste, assistente WhatsApp, smistamento email (
    <Link href="/servizi#agenti" className="text-accent underline underline-offset-4">i dettagli</Link>).
  </>,
  "Uno sconto sul costo di avvio, scritto nella stima che vi mandiamo. Il canone mensile resta quello di listino.",
  "La formula che preferite: lo gestiamo noi in UE oppure lo ospitate voi.",
  "Una demo funzionante prima della firma. Se non vi convince, non dovete nulla.",
  "Nessun vincolo di durata: disdetta con 30 giorni di preavviso.",
];

const chiediamo = [
  "Il permesso scritto di pubblicare il caso, con il nome dell'azienda o in forma anonima: lo scegliete voi.",
  "Di misurare insieme, prima di cominciare e dopo due mesi di uso, due o tre cose decise all'inizio. Per esempio in quanto tempo parte un preventivo, o quante richieste restano senza risposta.",
  "Una testimonianza di poche righe a fine prova, solo se siete soddisfatti.",
  "Una persona di riferimento che conosce il processo e ci risponde durante la costruzione.",
];

const perVoi = [
  "siete una piccola azienda di servizi e le richieste arrivano da email, modulo o WhatsApp;",
  "usate Google Workspace;",
  "avete un sito pubblico in HTTPS (serve per l'agente WhatsApp);",
  "potete cominciare entro la primavera del 2027.",
];

const passi = [
  "Vi candidate con il modulo qui sotto: bastano cinque minuti.",
  "Vi rispondiamo per email e vi mandiamo una stima scritta.",
  "Vedete la demo con dati di esempio della vostra azienda.",
  "Firmiamo la scheda di progetto, con i punti da verificare e le cose da misurare, e cominciamo.",
];

const faq = [
  {
    domanda: "Quanto costa?",
    risposta: "Dipende dall'agente e dalla formula. Lo trovate nella stima scritta, con lo sconto di avvio già indicato.",
  },
  {
    domanda: "Dove stanno i nostri dati?",
    risposta: "In Unione Europea. Potete farci gestire il server oppure tenerlo voi.",
  },
  {
    domanda: "L'agente decide da solo?",
    risposta: "No. Legge e prepara: preventivi e bozze li approvate voi, e i casi dubbi arrivano a una persona.",
  },
  {
    domanda: "Cosa succede se non siamo soddisfatti?",
    risposta:
      "Prima della firma vedete una demo e potete fermarvi senza pagare nulla. Dopo, il canone si disdice con 30 giorni di preavviso.",
  },
  {
    domanda: "Il nostro nome deve comparire per forza?",
    risposta: "No. Il caso si può pubblicare in forma anonima.",
  },
  {
    domanda: "Possiamo avere più di un agente?",
    risposta: "Per i cinque posti ne costruiamo uno per azienda. Gli altri si aggiungono dopo, alle condizioni normali.",
  },
];

function Elenco({ voci }: { voci: React.ReactNode[] }) {
  return (
    <ul className="space-y-3 text-[15px] leading-relaxed">
      {voci.map((x, i) => (
        <li key={i} className="flex gap-3">
          <span className="font-label text-accent" aria-hidden>&gt;</span>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

export default function OffertaPage() {
  if (!offertaAperta()) {
    return (
      <>
        <NavBar />
        <main>
          <PageHero tag="OFFERTA" parola="OFFERTA" title="Le candidature sono chiuse.">
            <p className="max-w-2xl text-lg leading-relaxed text-text-1">
              I cinque posti sono assegnati. Gli agenti restano disponibili alle condizioni normali.
            </p>
            <div className="mt-8">
              <CtaButton href="/servizi" variant="gradient">VEDI I SERVIZI &rarr;</CtaButton>
            </div>
          </PageHero>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.domanda,
            acceptedAnswer: { "@type": "Answer", text: f.risposta },
          })),
        }}
      />
      <NavBar />
      <main>
        <PageHero
          tag={`${OFFERTA.posti} POSTI · CANDIDATURE FINO AL ${OFFERTA.ultimoGiornoTesto.toUpperCase()}`}
          parola="OFFERTA"
          title={`Volete essere una delle prime ${OFFERTA.posti} aziende?`}
        >
          <p className="max-w-2xl text-lg leading-relaxed text-text-1">
            Costruiamo un agente AI per cinque piccole aziende, a condizioni riservate. In cambio vi chiediamo di poter
            raccontare com&apos;è andata, con i numeri veri.
          </p>
          <div className="mt-8">
            <CtaButton href="#candidatura" variant="gradient" evento="click_candidatura" props={{ pagina: "offerta", posizione: "hero" }}>
              CANDIDATI &rarr;
            </CtaButton>
          </div>
        </PageHero>

        <Section numero={1} tag="PERCHÉ LO FACCIAMO" title="Perché cinque, e perché adesso">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Gli agenti che proponiamo li abbiamo costruiti e provati in demo. Ci mancano i casi reali: aziende vere, con
            i numeri di prima e di dopo. Preferiamo dirlo che inventare risultati. Per questo apriamo cinque posti a
            condizioni che dopo non ripeteremo.
          </p>
        </Section>

        <Section numero={2} tono="alterno" tag="LO SCAMBIO" title="Cosa ricevete, cosa vi chiediamo">
          <div className="grid gap-6 md:grid-cols-2">
            <Scheda icona={<IconaStella />} titolo="Cosa ricevete">
              <Elenco voci={ricevete} />
            </Scheda>
            <Scheda icona={<IconaCollegamento />} titolo="Cosa vi chiediamo">
              <Elenco voci={chiediamo} />
            </Scheda>
          </div>
        </Section>

        <Section numero={3} tag="PER CHI È" title="È per voi se">
          <div className="max-w-3xl text-[15px] text-text-0">
            <Elenco voci={perVoi} />
          </div>
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-text-1">
            Scegliamo aziende di settori diversi e partiamo con una o due alla volta, in ordine di candidatura.
          </p>
        </Section>

        <Section numero={4} tono="alterno" tag="COME FUNZIONA" title="Dalla candidatura al primo agente">
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {passi.map((p, i) => (
              <li key={p} className="border border-border bg-bg-1 p-8">
                <span className="font-label text-[13px] tracking-[2px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 text-[15px] leading-relaxed text-text-0">{p}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="candidatura" numero={5} tag="CANDIDATURA" title="Candidatevi a uno dei cinque posti">
          <div className="max-w-3xl">
            <ModuloCandidatura />
          </div>
        </Section>

        <Section numero={6} tono="alterno" tag="DOMANDE FREQUENTI" title="Domande frequenti">
          <div className="grid gap-6 md:grid-cols-2">
            {faq.map((f, i) => (
              <div key={f.domanda} className="border border-border bg-bg-1 p-8">
                <span className="font-label text-[13px] tracking-[2px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-bold text-text-0">{f.domanda}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-1">{f.risposta}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-text-1">
            Le due formule sui dati sono spiegate in{" "}
            <Link href="/servizi#formule" className="text-accent underline underline-offset-4">Servizi</Link>.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
