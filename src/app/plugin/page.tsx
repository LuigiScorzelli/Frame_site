import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import FasciaPausa from "@/components/ui/FasciaPausa";
import Scheda from "@/components/ui/Scheda";
import { IconaCroce, IconaSpunta } from "@/components/ui/Icone";
import InteresseForm from "@/components/ui/InteresseForm";
import JsonLd from "@/components/seo/JsonLd";
import { AGENCY_NAME, BETA_DOWNLOAD_PATH, PLUGIN_NAME, SITE_URL, WPORG_URL } from "@/lib/brand";

const descrizione =
  "Assistente per siti WordPress di piccole aziende: risponde con le informazioni del tuo sito, raccoglie le richieste fuori orario, le consegna via email e nel pannello. Gratis, con la tua chiave AI.";

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

// Only questions with a confirmed answer are shown. Pending ones (WooCommerce, AI cost,
// opening hours) are listed in docs/lancio/03-contenuti.md as [da confermare].
const faq = [
  {
    domanda: "Cosa succede se un cliente chiede una cosa che non c'è sul sito?",
    risposta: "L'assistente lo dice, chiede un recapito e ti passa la richiesta.",
  },
  {
    domanda: "Chi vede le conversazioni?",
    risposta: "Tu, dal pannello, per il tempo di conservazione che hai scelto.",
  },
  {
    domanda: "Serve una chiave di un fornitore AI?",
    risposta: "Sì: inserisci la tua chiave API di OpenAI o di Anthropic, scegli tu quale. Il contratto con il fornitore è tuo.",
  },
  {
    domanda: "Dove vengono elaborati i dati?",
    risposta:
      "Le domande vanno dal tuo sito direttamente al fornitore AI che hai scelto, senza passare dai nostri server, e sono elaborate nella sua regione (di norma Stati Uniti). Citalo nella privacy del tuo sito. Le conversazioni restano 24 ore sul tuo server, poi vengono cancellate.",
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
        <PageHero tag="PLUGIN WORDPRESS · GRATUITO · IN ITALIANO" parola="PLUGIN" title={`${PLUGIN_NAME}: il tuo sito risponde anche quando sei chiuso.`}>
            <p className="max-w-2xl text-lg leading-relaxed text-text-1">
              Per attività locali, studi e piccole aziende con un sito WordPress. Risponde con le informazioni del tuo
              sito, raccoglie le richieste, te le consegna. Richiede WordPress 7.0 e PHP 8.3.
            </p>

            <div id="installa" className="mt-10 max-w-3xl scroll-mt-24 border border-accent-border bg-bg-1 p-8">
              {daWpOrg ? (
                <CtaButton href={WPORG_URL} evento="click_installa" props={{ pagina: "plugin", posizione: "pagina" }}>
                  INSTALLA DA WORDPRESS.ORG &rarr;
                </CtaButton>
              ) : (
                <>
                  <p className="mb-4 text-[15px] text-text-0">
                    Lasciaci l&apos;email e il download parte subito: ti scriviamo quando esce un aggiornamento e
                    con qualche consiglio per usarlo bene.
                  </p>
                  <InteresseForm
                    fonte="beta"
                    pagina="plugin"
                    bottone="SCARICA LA BETA ↓"
                    download={BETA_DOWNLOAD_PATH}
                    testoConsenso={`Acconsento a ricevere da ${AGENCY_NAME} email sugli aggiornamenti della beta e consigli per usarla.`}
                  />
                  <ol className="mt-6 space-y-2 text-[15px] text-text-0">
                    {installazione.map((p, i) => (
                      <li key={p} className="flex gap-3">
                        <span className="font-label text-accent">{i + 1}.</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </>
              )}
              <p className="mt-6 text-sm text-text-1">Nessun account, nessuna carta.</p>
            </div>
        </PageHero>

        <Section numero={1} tag="IN CHIARO" title="Cosa fa e cosa non fa">
          <div className="grid gap-6 md:grid-cols-2">
            <Scheda icona={<IconaSpunta />} titolo="Fa">
              <ul className="space-y-3 text-[15px]">
                {fa.map((x) => (
                  <li key={x} className="flex gap-3"><span className="font-label text-accent" aria-hidden>&gt;</span>{x}</li>
                ))}
              </ul>
            </Scheda>
            <Scheda icona={<span className="text-red"><IconaCroce /></span>} titolo="Non fa">
              <ul className="space-y-3 text-[15px]">
                {nonFa.map((x) => (
                  <li key={x} className="flex gap-3"><span className="font-label text-red" aria-hidden>&gt;</span>{x}</li>
                ))}
              </ul>
            </Scheda>
          </div>
        </Section>

        {/* TODO: sezione "Schermate" (5 screenshot veri) e video 90 s di installazione quando disponibili */}

        <Section numero={2} tono="alterno" tag="PROVE" title="A che punto siamo, detto chiaro">
          <div className="mb-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            {[
              { valore: "24/10/2026", etichetta: "IN PROVA SU SITI REALI DAL" },
              { valore: "37/37", etichetta: "COLLAUDI AUTOMATICI SUPERATI (TEST INTERNI)" },
            ].map((p) => (
              <div key={p.valore} className="border border-border bg-bg-1 p-6">
                <div className="font-label text-3xl font-bold text-accent">{p.valore}</div>
                <div className="mt-1 font-label text-[13px] font-medium tracking-widest text-text-1">{p.etichetta}</div>
              </div>
            ))}
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            {PLUGIN_NAME} è in prova su siti reali dal 24 ottobre 2026 e supera 37 collaudi automatici su 37 (test
            interni). Pubblicheremo i primi numeri degli utenti a gennaio 2027, con il loro permesso. Finché non li
            abbiamo, non li inventiamo.
          </p>
        </Section>

        <FasciaPausa etichetta="03 / PRIVACY" titolo="Cosa succede ai dati dei tuoi clienti">
          <p>
            Le conversazioni restano sul server 24 ore, poi vengono cancellate. L&apos;indirizzo IP viene salvato solo come
            impronta, non in chiaro. Le richieste consegnate si conservano per il tempo che scegli tu: 7, 30, 90, 180 o
            365 giorni. Esporti e cancelli i dati personali con gli strumenti standard di WordPress. Tutti i dettagli
            nella{" "}
            <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">pagina privacy</Link>.
          </p>
        </FasciaPausa>


        <Section numero={4} tono="alterno" tag="DOMANDE FREQUENTI" title="Domande frequenti">
          <dl className="grid gap-6 md:grid-cols-2">
            {faq.map((f, i) => (
              <div key={f.domanda} className="border border-border bg-bg-1 p-8">
                <span className="font-label text-[13px] tracking-[2px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <dt className="mt-3 text-lg font-bold text-text-0">{f.domanda}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-text-1">{f.risposta}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section numero={5} tag="PIANO A PAGAMENTO" title="Quando ti serve di più">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Il piano a pagamento aggiunge vendita guidata, preventivi con i tuoi prezzi, riconoscimento del cliente
            abituale, CRM e voce. 30 giorni di prova. Si attiva dal pannello del plugin, senza reinstallare.
          </p>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-text-1">
            Perché gratis? Perché il modo più onesto di farti vedere se funziona è lasciartelo provare sul tuo sito. Se
            poi ti serve di più, c&apos;è il piano a pagamento.
          </p>
          <div className="mt-6">
            <InteresseForm fonte="newsletter" interesse="pro" pagina="plugin" />
          </div>
        </Section>

        <section className="border-t border-border bg-bg-1 py-24">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-center lg:px-14">
            <CtaButton
              variant="gradient"
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
    </>
  );
}
