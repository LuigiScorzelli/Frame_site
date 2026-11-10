import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import { AGENCY_NAME, CONTACT_EMAIL, PLUGIN_NAME, SITE_URL } from "@/lib/brand";

const descrizione = `Come ${AGENCY_NAME} e il plugin ${PLUGIN_NAME} trattano i dati: spiegato in italiano semplice, poi l'informativa completa.`;

export const metadata: Metadata = {
  title: "Privacy",
  description: descrizione,
  alternates: { canonical: "/privacy" },
  openGraph: { url: `${SITE_URL}/privacy`, description: descrizione },
};

const sulSito = [
  "Statistiche senza cookie (Vercel Analytics).",
  "Le email che ci lasci vanno in Brevo con doppia conferma.",
  "I moduli passano da Resend.",
  "Le prenotazioni passano da Calendly.",
  // TODO sprint 2: aggiungere Freemius per acquisti e licenze.
];

// Facts checked on 9/11/2026 against the n8n setup on the VPS. Do not promise retention times for the
// conversation and lead tables: automatic deletion does not exist yet (only n8n executions, 7 days).
const nellAssistente = [
  "L'assistente in basso a destra è un sistema di intelligenza artificiale: risponde con le informazioni di questo sito e te lo dice appena lo apri.",
  "Quello che scrivi all'assistente viene inviato a OpenAI per preparare la risposta. OpenAI elabora i dati negli Stati Uniti.",
  "Conversazioni e richieste sono salvate su un nostro server presso Hostinger, gestito da noi.",
  "Se lasci nome e recapito per essere ricontattato, la richiesta arriva a noi via email (tramite Resend) e nel nostro CRM, HubSpot.",
  "I registri tecnici di ogni risposta si cancellano da soli dopo 7 giorni. Conversazioni e richieste le conserviamo finché servono a risponderti: puoi chiederci di cancellarle quando vuoi.",
  "L'assistente non usa cookie: nel tuo browser la conversazione resta solo nella scheda aperta e sparisce quando la chiudi.",
];

const nelPlugin = [
  "Le conversazioni restano 24 ore sul server del tuo sito e poi vengono cancellate.",
  "L'indirizzo IP è salvato come impronta, non in chiaro.",
  "Le richieste consegnate si conservano per il tempo che scegli: da 7 a 365 giorni.",
  "Chi chiede solo informazioni non lascia dati.",
  "Chi lascia un recapito lascia solo quello che serve alla richiesta.",
  "Le domande dei visitatori vanno dal tuo sito direttamente al fornitore AI che scegli tu, OpenAI o Anthropic, con la tua chiave API: non passano dai nostri server. Si applicano il tuo contratto con il fornitore e la sua regione di elaborazione (di norma Stati Uniti): citalo nella privacy del tuo sito.",
];

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main>
        <PageHero tag="PRIVACY" title="Come trattiamo i dati, spiegato come lo spiegheremmo a un cliente" />

        <Section numero={1} tag="SUL SITO" title={`Sul sito ${AGENCY_NAME}.it`}>
          <ul className="max-w-3xl space-y-3 border border-border bg-bg-1 p-8 text-[15px] leading-relaxed text-text-1">
            {sulSito.map((x) => <li key={x} className="flex gap-3"><span className="font-label text-accent" aria-hidden>&gt;</span>{x}</li>)}
          </ul>
        </Section>

        <Section numero={2} tag="ASSISTENTE AI" title={`L'assistente di ${AGENCY_NAME}.it`}>
          <ul className="max-w-3xl space-y-3 border border-border bg-bg-1 p-8 text-[15px] leading-relaxed text-text-1">
            {nellAssistente.map((x) => <li key={x} className="flex gap-3"><span className="font-label text-accent" aria-hidden>&gt;</span>{x}</li>)}
          </ul>
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-text-1">
            Per vedere o cancellare i tuoi dati scrivici a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section numero={3} tag="NEL PLUGIN" title={`Nel plugin ${PLUGIN_NAME} installato sul tuo sito`}>
          <ul className="max-w-3xl space-y-3 border border-border bg-bg-1 p-8 text-[15px] leading-relaxed text-text-1">
            {nelPlugin.map((x) => <li key={x} className="flex gap-3"><span className="font-label text-accent" aria-hidden>&gt;</span>{x}</li>)}
          </ul>
          <h3 className="mt-10 text-xl font-bold text-text-0">Come cancelli i dati di un cliente</h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-1">
            In WordPress vai su Strumenti → Cancella dati personali, cerca per email: due clic.
          </p>
        </Section>

        <Section numero={4} tag="INFORMATIVA COMPLETA" title="Titolare, basi giuridiche, responsabili, tempi, diritti">
          {/* TODO: testo legale completo, da far rivedere con il parere privacy già previsto. */}
          <p className="max-w-3xl text-[15px] leading-relaxed text-text-1">
            L&apos;informativa completa è in revisione legale e verrà pubblicata qui. Per qualsiasi richiesta sui tuoi
            dati, compreso l&apos;accesso e la cancellazione, scrivici a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
