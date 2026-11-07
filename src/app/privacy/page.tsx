import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import Section from "@/components/ui/Section";
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
        <section className="pb-8 pt-36 lg:pt-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">PRIVACY</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-[-2px] text-text-0 sm:text-5xl">
              Come trattiamo i dati, spiegato come lo spiegheremmo a un cliente
            </h1>
          </div>
        </section>

        <Section tag="SUL SITO" title={`Sul sito ${AGENCY_NAME}.it`}>
          <ul className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-text-1">
            {sulSito.map((x) => <li key={x} className="flex gap-3"><span className="text-accent" aria-hidden>·</span>{x}</li>)}
          </ul>
        </Section>

        <Section tag="NEL PLUGIN" title={`Nel plugin ${PLUGIN_NAME} installato sul tuo sito`}>
          <ul className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-text-1">
            {nelPlugin.map((x) => <li key={x} className="flex gap-3"><span className="text-accent" aria-hidden>·</span>{x}</li>)}
          </ul>
          <h3 className="mt-10 text-xl font-bold text-text-0">Come cancelli i dati di un cliente</h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-1">
            In WordPress vai su Strumenti → Cancella dati personali, cerca per email: due clic.
          </p>
        </Section>

        <Section tag="INFORMATIVA COMPLETA" title="Titolare, basi giuridiche, responsabili, tempi, diritti">
          {/* TODO: testo legale completo, da far rivedere con il parere privacy già previsto. */}
          <p className="max-w-3xl text-[15px] leading-relaxed text-text-1">
            L&apos;informativa completa è in revisione legale e verrà pubblicata qui. Per qualsiasi richiesta sui tuoi
            dati, compreso l&apos;accesso e la cancellazione, scrivici a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        </Section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
