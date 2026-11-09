import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Scheda from "@/components/ui/Scheda";
import { IconaAssistente, IconaCodice, IconaCollegamento, IconaFulmine, IconaRazzo, IconaStella } from "@/components/ui/Icone";
import { AGENCY_NAME, BOOKING_URL, CONTACT_EMAIL, PLUGIN_NAME, SITE_URL } from "@/lib/brand";

const descrizione = `Automazioni, assistenti AI e collegamenti tra gli strumenti per piccole aziende, più avvio guidato e integrazioni per ${PLUGIN_NAME}, il nostro plugin WordPress.`;

export const metadata: Metadata = {
  title: { absolute: `Servizi: automazioni, assistenti AI e avvio di ${PLUGIN_NAME} | ${AGENCY_NAME}` },
  description: descrizione,
  alternates: { canonical: "/servizi" },
  openGraph: { url: `${SITE_URL}/servizi`, description: descrizione },
};

interface Servizio {
  nome: string;
  icona: React.ReactNode;
  etichette: string[];
  nota?: string;
  perChi: string;
  comprende: string;
}

const progetti: Servizio[] = [
  {
    nome: "Automazioni dei flussi ripetitivi",
    icona: <IconaFulmine />,
    etichette: ["WORKFLOW", "EMAIL E FOGLI"],
    perChi: "Chi passa ore ogni settimana a copiare dati tra email, fogli e programmi",
    comprende:
      "Analisi del flusso con chi lo fa ogni giorno, automazione costruita sugli strumenti che usate già, prove su casi reali, istruzioni scritte per il team.",
  },
  {
    nome: "Assistenti AI sui vostri dati",
    icona: <IconaAssistente />,
    etichette: ["DOCUMENTI", "PERMESSI"],
    perChi: "Chi risponde sempre alle stesse domande, a clienti o a colleghi",
    comprende:
      "Raccolta di documenti e procedure, assistente che risponde solo da quelle fonti e dice quando non sa, permessi su cosa può leggere, prove con domande vere.",
  },
  {
    nome: "Collegamenti e strumenti su misura",
    icona: <IconaCodice />,
    etichette: ["INTEGRAZIONI", "SU MISURA"],
    perChi: "Chi usa CRM, gestionale ed e-commerce che non si parlano",
    comprende:
      "Collegamento degli strumenti esistenti con controllo dei duplicati e registro delle operazioni. Quando il software standard non basta, lo strumento che manca.",
  },
];

const plugin: Servizio[] = [
  {
    nome: "Avvio guidato",
    icona: <IconaRazzo />,
    etichette: ["IN UN GIORNO", "VIDEOCHIAMATA"],
    perChi: "Chi vuole partire bene in un giorno",
    comprende:
      "Installazione, caricamento di listini e documenti, 20 domande vere di prova, orari e tono delle risposte, consegna in videochiamata di 30 minuti.",
  },
  {
    nome: `Piano a pagamento di ${PLUGIN_NAME}`,
    icona: <IconaStella />,
    etichette: ["VENDITA GUIDATA", "PROVA 30 GIORNI"],
    nota: "In arrivo",
    perChi: "Chi vuole che il sito venda, non solo risponda",
    comprende:
      "Vendita guidata con proposta di prodotti o servizi, preventivi con i tuoi prezzi, cliente abituale riconosciuto, CRM, voce. Aggiornamento dei contenuti ogni mese e assistenza. 30 giorni di prova.",
  },
  {
    nome: "Collegamento al tuo gestionale",
    icona: <IconaCollegamento />,
    etichette: ["CRM", "GESTIONALE"],
    perChi: "Chi ha già un CRM o un gestionale",
    comprende:
      "Le richieste entrano nel tuo sistema (HubSpot provato nei nostri test), con controllo dei duplicati e registro delle operazioni.",
  },
];

const procedura = ["Prenota 30 minuti", "Analisi del sito e dei processi", "Proposta scritta di una pagina"];

function Schede({ elenco }: { elenco: Servizio[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {elenco.map((s) => (
        <Scheda key={s.nome} icona={s.icona} sopra={s.nota?.toUpperCase()} titolo={s.nome} etichette={s.etichette}>
          <p className="font-mono text-[11px] tracking-[1px] text-accent">PER CHI</p>
          <p className="mt-1 text-[15px] text-text-0">{s.perChi}</p>
          <p className="mt-5 font-mono text-[11px] tracking-[1px] text-accent">COSA COMPRENDE</p>
          <p className="mt-1 text-[15px] leading-relaxed">{s.comprende}</p>
        </Scheda>
      ))}
    </div>
  );
}

export default function ServiziPage() {
  return (
    <>
      <NavBar />
      <main>
        <PageHero tag="SERVIZI" title="Cosa possiamo fare per la vostra azienda?">
            <p className="max-w-2xl text-lg leading-relaxed text-text-1">
              Lavoriamo in due modi: progetti su misura per togliere lavoro ripetitivo, e servizi intorno a{" "}
              <Link href="/plugin" className="text-accent underline-offset-4 hover:underline">{PLUGIN_NAME}</Link>, il
              nostro plugin WordPress. Il prezzo lo diciamo dopo 30 minuti di chiamata, quando abbiamo capito cosa serve.
            </p>
        </PageHero>

        <Section numero={1} tag="PROGETTI SU MISURA" title="Automazioni e AI per il vostro lavoro">
          <Schede elenco={progetti} />
        </Section>

        <Section numero={2} tag={`INTORNO A ${PLUGIN_NAME.toUpperCase()}`} title="Non vuoi configurare niente? Lo facciamo noi.">
          <Schede elenco={plugin} />
          <p className="mt-8 text-[15px] text-text-1">
            Gestisci siti per i tuoi clienti?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">Scrivici</a>: stiamo preparando
            una versione per agenzie.
          </p>
        </Section>

        <Section numero={3} tag="COME SI PROCEDE" title="Tre passi, nessuna sorpresa">
          <ol className="grid gap-6 md:grid-cols-3">
            {procedura.map((p, i) => (
              <li key={p} className="border border-border bg-bg-1 p-8">
                <span className="font-mono text-[11px] tracking-[2px] text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 text-lg font-bold tracking-[-0.5px] text-text-0">{p}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[15px] text-text-1">Pagamento con bonifico su fattura.</p>
          <div className="mt-8">
            <CtaButton href={BOOKING_URL} variant="gradient" evento="click_prenota" props={{ pagina: "servizi", posizione: "pagina" }}>
              PRENOTA 30 MINUTI &rarr;
            </CtaButton>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
