import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Scheda from "@/components/ui/Scheda";
import { IconaAssistente, IconaCollegamento, IconaFulmine, IconaRazzo, IconaScudo } from "@/components/ui/Icone";
import { AGENCY_NAME, BOOKING_URL, PLUGIN_NAME } from "@/lib/brand";
import { OFFERTA, offertaAperta } from "@/lib/offerta";
import { metaSocial } from "@/lib/seo";
import TrackedLink from "@/components/ui/TrackedLink";

// Copy: docs/lancio/03-contenuti.md, section /servizi (approved by Luigi on 2026-11-20).
// Rules: no prices, no result figures, delivery times are estimates and are labelled as such.
// Re-rendered hourly so the link to /offerta disappears when the offer closes.
export const revalidate = 3600;

const descrizione =
  "Tre agenti AI per piccole aziende: preventivi e richieste, assistente WhatsApp, smistamento email. Gestiti da noi in UE oppure sul vostro server, con un controllo umano scritto.";

export const metadata: Metadata = {
  title: { absolute: `Agenti AI per preventivi, WhatsApp ed email | ${AGENCY_NAME}` },
  description: descrizione,
  alternates: { canonical: "/servizi" },
  ...metaSocial({ percorso: "/servizi", immaginePropria: true, titolo: "Agenti AI per preventivi, WhatsApp ed email", descrizione }),
};

interface Agente {
  nome: string;
  icona: React.ReactNode;
  etichette: string[];
  perChi: string;
  cosaFa: string;
  restaAVoi: string;
  tempi: string;
}

const agenti: Agente[] = [
  {
    nome: "Preventivi e richieste",
    icona: <IconaFulmine />,
    etichette: ["EMAIL", "MODULO DEL SITO", "CRM"],
    perChi: "Chi riceve richieste di preventivo e risponde quando trova il tempo",
    cosaFa:
      "Legge email e modulo del sito, chiede i dati mancanti, calcola un preventivo indicativo dal vostro tariffario, prepara la bozza e salva il contatto in un foglio o nel CRM.",
    restaAVoi: "Ogni preventivo lo approvate voi prima dell'invio. Le cifre vengono dal vostro tariffario, non dall'AI.",
    tempi: "3-4 settimane da quando abbiamo materiali e accessi",
  },
  {
    nome: "Assistente WhatsApp",
    icona: <IconaAssistente />,
    etichette: ["WHATSAPP", "AGENDA", "DOCUMENTI"],
    perChi: "Chi riceve su WhatsApp sempre le stesse domande e richieste di appuntamento",
    cosaFa:
      "Risponde dalle vostre domande frequenti e dai vostri documenti, fissa gli appuntamenti in agenda, manda il promemoria, passa la conversazione a un collega.",
    restaAVoi: "Le domande fuori dai documenti, i reclami e i prezzi fuori tariffario arrivano a una persona.",
    tempi: "4-6 settimane, compresa l'attesa dell'approvazione di Meta",
  },
  {
    nome: "Smistamento email",
    icona: <IconaCollegamento />,
    etichette: ["CASELLA INFO@", "BOZZE"],
    perChi: "Chi ha una casella generica (info@) che nessuno riesce a tenere in ordine",
    cosaFa:
      "Classifica i messaggi, li inoltra alla persona giusta, passa le richieste di preventivo al primo agente, prepara le bozze per le domande frequenti.",
    restaAVoi:
      "Tutte le bozze le rivedete voi. Reclami e messaggi che non rientrano in nessuna categoria arrivano a una persona.",
    tempi: "2-3 settimane",
  },
];

interface Formula {
  nome: string;
  icona: React.ReactNode;
  righe: { voce: string; testo: string }[];
}

const formule: Formula[] = [
  {
    nome: "Lo gestiamo noi",
    icona: <IconaRazzo />,
    righe: [
      { voce: "Per chi", testo: "Chi vuole un servizio che funziona, senza occuparsi di server" },
      { voce: "Dove gira", testo: "Server dedicato a voi in un data center dell'Unione Europea, gestito da noi" },
      { voce: "Modelli AI", testo: "Modelli AI con elaborazione in UE, scelti e pagati da noi dentro il canone" },
      { voce: "Copie di sicurezza e controlli", testo: "Li facciamo noi" },
      { voce: "Accordo sui dati", testo: "Siamo responsabili del trattamento: accordo scritto con l'elenco dei fornitori" },
      { voce: "Se un giorno smettete", testo: "Vi consegniamo i flussi e i dati" },
    ],
  },
  {
    nome: "Lo ospitate voi",
    icona: <IconaScudo />,
    righe: [
      { voce: "Per chi", testo: "Chi vuole scegliere dove girano il sistema e i modelli AI" },
      { voce: "Dove gira", testo: "Server in UE intestato a voi. Il nostro accesso di manutenzione lo potete togliere" },
      { voce: "Modelli AI", testo: "Con la vostra chiave: fornitore e regione li scegliete voi" },
      { voce: "Copie di sicurezza e controlli", testo: "Li impostiamo e li seguiamo noi, sul vostro server" },
      { voce: "Accordo sui dati", testo: "Accordo più corto, solo per gli accessi di manutenzione" },
      { voce: "Se un giorno smettete", testo: "Il sistema è già vostro" },
    ],
  },
];

const perPartire = [
  "Google Workspace e un amministratore disponibile per circa 30 minuti, con la nostra guida.",
  "Per WhatsApp: un sito pubblico in HTTPS che descrive l'azienda e un numero dedicato.",
  "I contenuti: tariffario, domande frequenti, regole degli appuntamenti, chi si occupa di cosa.",
  "La firma dell'accordo sui dati.",
];

const procedura = [
  {
    titolo: "Stima scritta",
    testo: "Ci raccontate il processo, vi mandiamo una stima che si legge da sola. La chiamata di 30 minuti c'è sempre, per chi la vuole.",
  },
  {
    titolo: "Demo prima della firma",
    testo: "Vedete un agente funzionante con dati di esempio della vostra azienda. Se non vi convince, non dovete nulla.",
  },
  {
    titolo: "Costruzione",
    testo: "Un agente alla volta, collegato agli strumenti che usate già, con i punti di controllo scritti.",
  },
  {
    titolo: "Prova e ritocchi",
    testo: "Casi reali con il vostro team, correzioni, rapporto ogni mese.",
  },
];

const Voce = ({ children }: { children: string }) => (
  <p className="mt-5 font-label text-[13px] tracking-[1px] text-accent first:mt-0">{children}</p>
);

export default function ServiziPage() {
  return (
    <>
      <NavBar />
      <main>
        <PageHero tag="SERVIZI" parola="AGENTI" title="Quale lavoro volete togliere dalla vostra giornata?">
          <p className="max-w-2xl text-lg leading-relaxed text-text-1">
            Costruiamo agenti AI che leggono le richieste, preparano le risposte e passano a una persona i casi dubbi.
            Prezzi e tempi li trovate in una stima scritta, dopo che ci avete raccontato come lavorate.
          </p>
        </PageHero>

        <Section id="agenti" numero={1} tag="I TRE AGENTI" title="Tre agenti, ognuno con il suo controllo">
          <div className="grid gap-6 lg:grid-cols-3">
            {agenti.map((a) => (
              <Scheda key={a.nome} icona={a.icona} titolo={a.nome} etichette={a.etichette}>
                <Voce>PER CHI</Voce>
                <p className="mt-1 text-[15px] text-text-0">{a.perChi}</p>
                <Voce>COSA FA</Voce>
                <p className="mt-1 text-[15px] leading-relaxed">{a.cosaFa}</p>
                <Voce>COSA RESTA A VOI</Voce>
                <p className="mt-1 text-[15px] leading-relaxed">{a.restaAVoi}</p>
                <Voce>TEMPI (STIMA)</Voce>
                <p className="mt-1 text-[15px] leading-relaxed">{a.tempi}</p>
              </Scheda>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[15px] text-text-1">
            I tempi sono stime, non misure: li confermiamo nella stima scritta. Si parte da un agente, gli altri si
            aggiungono dopo.
          </p>
        </Section>

        <Section id="formule" numero={2} tono="alterno" tag="LE DUE FORMULE" title="Chi gestisce l'agente, e dove stanno i dati?">
          <div className="grid gap-6 md:grid-cols-2">
            {formule.map((f) => (
              <Scheda key={f.nome} icona={f.icona} titolo={f.nome}>
                <dl>
                  {f.righe.map((r) => (
                    <div key={r.voce} className="border-t border-border py-4 first:border-t-0 first:pt-0">
                      <dt className="font-label text-[13px] tracking-[1px] text-accent">{r.voce.toUpperCase()}</dt>
                      <dd className="mt-1 text-[15px] leading-relaxed text-text-0">{r.testo}</dd>
                    </div>
                  ))}
                </dl>
              </Scheda>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-text-1">
            In tutte e due le formule gli account di Google, WhatsApp e CRM sono intestati a voi. WhatsApp passa sempre
            da Meta: usiamo solo il canale ufficiale. Con dati sanitari o legali la soluzione si studia a parte.
          </p>
        </Section>

        <Section numero={3} tag="PER PARTIRE" title="Cosa vi chiediamo per partire">
          <ul className="grid max-w-4xl gap-4 md:grid-cols-2">
            {perPartire.map((x) => (
              <li key={x} className="flex gap-3 border border-border bg-bg-1 p-6 text-[15px] leading-relaxed text-text-0">
                <span className="font-label text-accent" aria-hidden>&gt;</span>
                {x}
              </li>
            ))}
          </ul>
        </Section>

        <Section numero={4} tono="alterno" tag="SU MISURA" title="Il vostro processo non è tra questi?">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Costruiamo anche agenti e automazioni su processi diversi: collegamenti tra CRM, gestionale ed e-commerce,
            strumenti che mancano al software standard. Si parte da 30 minuti di chiamata e da una proposta scritta.
          </p>
          {offertaAperta() && (
            <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-text-1">
              Cerchiamo {OFFERTA.posti} aziende per i primi casi reali, a condizioni riservate.{" "}
              <TrackedLink href="/offerta" evento="click_candidatura" props={{ pagina: "servizi", posizione: "pagina" }} className="text-accent underline underline-offset-4">
                Leggi l&apos;offerta
              </TrackedLink>
              .
            </p>
          )}
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-text-1">
            Avete un sito WordPress e volete provare un assistente prima di un progetto? C&apos;è{" "}
            <Link href="/plugin" className="text-accent underline underline-offset-4">{PLUGIN_NAME}</Link>, il nostro
            plugin gratuito.
          </p>
        </Section>

        <Section numero={5} tag="COME SI PROCEDE" title="Quattro passi, nessuna sorpresa">
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {procedura.map((p, i) => (
              <li key={p.titolo} className="border border-border bg-bg-1 p-8">
                <span className="font-label text-[13px] tracking-[2px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 text-lg font-bold tracking-[-0.5px] text-text-0">{p.titolo}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-text-1">{p.testo}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[15px] text-text-1">
            Nessun vincolo di durata: disdetta con 30 giorni di preavviso. Pagamento con bonifico su fattura.
          </p>
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
