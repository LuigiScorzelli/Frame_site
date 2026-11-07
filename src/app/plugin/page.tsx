import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import InteresseForm from "@/components/ui/InteresseForm";
import JsonLd from "@/components/seo/JsonLd";
import { AGENCY_NAME, BETA_DOWNLOAD_PATH, PLUGIN_NAME, SITE_URL, WPORG_URL } from "@/lib/brand";

const descrizione =
  "Assistente per siti WordPress di piccole aziende: risponde con le informazioni del tuo sito, raccoglie le richieste fuori orario, le consegna via email e nel pannello. Gratis, dati in Europa.";

export const metadata: Metadata = {
  title: { absolute: `${PLUGIN_NAME}, plugin chatbot gratuito per WordPress in italiano | ${AGENCY_NAME}` },
  description: descrizione,
  alternates: { canonical: "/plugin" },
  openGraph: { url: `${SITE_URL}/plugin`, title: `${PLUGIN_NAME}, plugin chatbot gratuito per WordPress`, description: descrizione },
};

const fa = [
  "Risponde solo con i tuoi contenuti",
  "Raccoglie nome, recapito e richiesta",
  "Manda l'email e salva nel pannello",
  "Se l'invio fallisce riprova e ti avvisa",
  "Esporta e cancella i dati personali su richiesta",
  "Ti avvisa se la pulizia automatica dei dati non è partita",
];

const nonFa = [
  "Non inventa risposte su cose che non sa",
  "Non vende né cede i tuoi dati",
  "Non risponde al telefono (la voce è nel piano a pagamento)",
  "Non decide al posto tuo: i casi dubbi te li passa",
];

const installazione = [
  "Scarica lo zip",
  "In WordPress vai su Plugin → Aggiungi nuovo → Carica plugin",
  "Attiva e segui la procedura guidata",
];

// Only questions with a confirmed answer are shown. Pending ones (AI key, data region,
// WooCommerce, AI cost, opening hours) are listed in docs/lancio/03-contenuti.md as [da confermare].
const faq = [
  {
    domanda: "Cosa succede se un cliente chiede una cosa che non c'è sul sito?",
    risposta: "L'assistente lo dice, chiede un recapito e ti passa la richiesta.",
  },
  {
    domanda: "Chi vede le conversazioni?",
    risposta: "Tu, dal pannello, per il tempo di conservazione che hai scelto.",
  },
];

export default function PluginPage() {
  const daWpOrg = Boolean(WPORG_URL);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: PLUGIN_NAME,
          description: descrizione,
          applicationCategory: "BusinessApplication",
          operatingSystem: "WordPress",
          inLanguage: "it",
          url: `${SITE_URL}/plugin`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          publisher: { "@type": "Organization", name: AGENCY_NAME, url: SITE_URL },
        }}
      />
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
        <section className="pb-20 pt-36 lg:pt-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">
              PLUGIN WORDPRESS · GRATUITO · IN ITALIANO
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-2px] text-text-0 sm:text-5xl lg:text-6xl">
              {PLUGIN_NAME}: il tuo sito risponde anche quando sei chiuso.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-1">
              Per attività locali, studi e piccole aziende con un sito WordPress. Risponde con le informazioni del tuo
              sito, raccoglie le richieste, te le consegna. Richiede WordPress 7.0 e PHP 8.3.
            </p>

            <div id="installa" className="mt-10 scroll-mt-24 border border-accent-border bg-bg-1 p-8">
              {daWpOrg ? (
                <CtaButton href={WPORG_URL} evento="click_installa" props={{ pagina: "plugin", posizione: "pagina" }}>
                  INSTALLA DA WORDPRESS.ORG &rarr;
                </CtaButton>
              ) : (
                <>
                  <CtaButton href={BETA_DOWNLOAD_PATH} evento="download_beta" props={{ pagina: "plugin", posizione: "pagina", fonte: "beta" }}>
                    SCARICA LA BETA &darr;
                  </CtaButton>
                  <ol className="mt-6 space-y-2 text-[15px] text-text-0">
                    {installazione.map((p, i) => (
                      <li key={p} className="flex gap-3">
                        <span className="font-mono text-accent">{i + 1}.</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </>
              )}
              <p className="mt-6 text-sm text-text-1">Nessun account, nessuna carta.</p>
            </div>
          </div>
        </section>

        <Section tag="IN CHIARO" title="Cosa fa e cosa non fa">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-bg-1 p-8">
              <h3 className="text-xl font-bold text-text-0">Fa</h3>
              <ul className="mt-5 space-y-3 text-[15px] text-text-1">
                {fa.map((x) => (
                  <li key={x} className="flex gap-3"><span className="text-accent" aria-hidden>✓</span>{x}</li>
                ))}
              </ul>
            </div>
            <div className="border border-border bg-bg-1 p-8">
              <h3 className="text-xl font-bold text-text-0">Non fa</h3>
              <ul className="mt-5 space-y-3 text-[15px] text-text-1">
                {nonFa.map((x) => (
                  <li key={x} className="flex gap-3"><span className="text-red" aria-hidden>✕</span>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* TODO: sezione "Schermate" (5 screenshot veri) e video 90 s di installazione quando disponibili */}

        <Section tag="DOMANDE FREQUENTI" title="Domande frequenti">
          <dl className="max-w-3xl divide-y divide-border border-y border-border">
            {faq.map((f) => (
              <div key={f.domanda} className="py-6">
                <dt className="text-lg font-bold text-text-0">{f.domanda}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-text-1">{f.risposta}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section tag="PIANO A PAGAMENTO" title="Quando ti serve di più">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Il piano a pagamento aggiunge vendita guidata, preventivi con i tuoi prezzi, riconoscimento del cliente
            abituale, CRM e voce. 30 giorni di prova. Si attiva dal pannello del plugin, senza reinstallare.
          </p>
          <div className="mt-6">
            <InteresseForm fonte="newsletter" interesse="pro" pagina="plugin" />
          </div>
        </Section>

        <section className="border-t border-border bg-bg-1 py-24">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-center lg:px-14">
            <CtaButton
              href={daWpOrg ? WPORG_URL : "#installa"}
              evento="click_installa"
              props={{ pagina: "plugin", posizione: "chiusura" }}
            >
              INSTALLA GRATIS &rarr;
            </CtaButton>
            <CtaButton href="/servizi" variant="secondary">
              PREFERISCI CHE LO FACCIAMO NOI? VEDI L&apos;AVVIO GUIDATO
            </CtaButton>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
