import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import InteresseForm from "@/components/ui/InteresseForm";
import { AGENCY_NAME, BOOKING_URL, CITY, FOUNDER_URL, PLUGIN_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: `Assistente AI per siti WordPress di piccole aziende: rispondi ai clienti anche fuori orario | ${AGENCY_NAME}` },
  description:
    "Plugin WordPress gratuito in italiano: risponde con le informazioni del tuo sito, raccoglie le richieste fuori orario e te le consegna. Dati in Europa, 5 minuti per installarlo.",
  alternates: { canonical: "/" },
};

const cosaFa = [
  {
    titolo: "Risponde con i tuoi contenuti.",
    testo: "Legge le pagine del tuo sito e i documenti che carichi. Se non sa una cosa, lo dice e chiede un recapito. Non inventa.",
  },
  {
    titolo: "Raccoglie la richiesta completa.",
    testo: "Nome, email o telefono, cosa serve e per quando. Se l'invio fallisce, riprova e ti avvisa.",
  },
  {
    titolo: "Te la consegna dove lavori.",
    testo: "Via email subito e nel pannello dentro WordPress. Con il piano a pagamento, anche nel tuo CRM.",
  },
];

const passi = [
  "Installa dal pannello di WordPress (Plugin → Aggiungi nuovo).",
  "Scrivi due righe su cosa fai, dove sei e quando sei aperto.",
  "La chat è sul sito. Le richieste arrivano a te.",
];

const gratis = [
  "Risposte dai tuoi contenuti",
  "Raccolta delle richieste",
  "Email e pannello in WordPress",
  "Strumenti privacy",
  "Aggiornamenti",
];

const aPagamento = [
  "Vendita guidata con proposta di prodotti o servizi",
  "Preventivi con i tuoi prezzi reali",
  "Riconoscimento del cliente abituale",
  "CRM",
  "Voce",
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
              PER CHI HA UN SITO WORDPRESS E UN&apos;ATTIVITÀ DA MANDARE AVANTI
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-2px] text-text-0 sm:text-5xl lg:text-7xl">
              Quante richieste perde il tuo sito mentre sei chiuso?
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-1">
              Abbiamo costruito un assistente che risponde ai clienti con le informazioni del tuo sito, raccoglie nome,
              recapito e cosa cercano, e te li consegna in posta. Gratuito, si installa in 5 minuti dal pannello di
              WordPress, i dati restano in Europa.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CtaButton href="/plugin" evento="click_installa" props={{ pagina: "home", posizione: "hero" }}>
                INSTALLA GRATIS &rarr;
              </CtaButton>
              <CtaButton href="/check-up" variant="secondary">
                FAI IL CHECK-UP IN 2 MINUTI
              </CtaButton>
            </div>
            <p className="mt-4 text-sm text-text-1">Nessuna carta di credito. La versione gratuita resta gratuita.</p>
            {/* TODO: video muto 60 s o screenshot del pannello "Richieste ricevute" quando disponibili (niente segnaposto) */}
          </div>
        </section>

        <Section tag="IL PROBLEMA" title="Le richieste arrivano quando non ci sei">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            {/* TODO:dato risultato del test sui 30 siti ("Su 30 attività campane a cui abbiamo scritto di sabato sera, X hanno risposto entro lunedì alle 10") */}
            Una parte delle richieste dai siti delle piccole attività arriva la sera e nel weekend. Chi non trova risposta
            scrive al prossimo risultato di Google. Un modulo di contatto raccoglie il messaggio; nessuno lo legge fino al
            giorno dopo.
          </p>
        </Section>

        <Section tag="COSA FA" title={<>Cosa fa {PLUGIN_NAME}, in concreto</>}>
          <div className="grid gap-6 md:grid-cols-3">
            {cosaFa.map((c, i) => (
              <div key={c.titolo} className="border border-border bg-bg-1 p-8">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold text-text-0">{c.titolo}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-1">{c.testo}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section tag="COME FUNZIONA" title="Online in 5 minuti">
          <ol className="grid gap-6 md:grid-cols-3">
            {passi.map((p, i) => (
              <li key={p} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent font-mono text-sm font-bold text-accent">
                  {i + 1}
                </span>
                <p className="pt-2 text-[15px] leading-relaxed text-text-0">{p}</p>
              </li>
            ))}
          </ol>
          {/* TODO:dato minuti dell'installazione sul primo sito pilota: la riga si mostra solo quando misurata */}
        </Section>

        <Section tag="PROVE" title="A che punto siamo, detto chiaro">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            {PLUGIN_NAME} è in prova su siti reali dal 24 ottobre 2026 e supera 37 collaudi automatici su 37 (test
            interni). Pubblicheremo i primi numeri degli utenti a gennaio 2027, con il loro permesso. Finché non li
            abbiamo, non li inventiamo.
          </p>
        </Section>

        <Section tag="PRIVACY" title="Cosa succede ai dati dei tuoi clienti">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Le conversazioni restano sul server 24 ore, poi vengono cancellate. L&apos;indirizzo IP viene salvato solo come
            impronta, non in chiaro. Le richieste consegnate si conservano per il tempo che scegli tu: 7, 30, 90, 180 o
            365 giorni. Esporti e cancelli i dati personali con gli strumenti standard di WordPress. Tutti i dettagli
            nella{" "}
            <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">pagina privacy</Link>.
          </p>
        </Section>

        <Section tag="GRATIS E A PAGAMENTO" title="Cosa è gratis e cosa no">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-accent-border bg-bg-1 p-8">
              <h3 className="text-xl font-bold text-text-0">Gratis, per sempre</h3>
              <ul className="mt-5 space-y-3 text-[15px] text-text-1">
                {gratis.map((g) => (
                  <li key={g} className="flex gap-3"><span className="text-accent" aria-hidden>✓</span>{g}</li>
                ))}
              </ul>
            </div>
            <div className="border border-border bg-bg-1 p-8">
              <h3 className="text-xl font-bold text-text-0">Piano a pagamento</h3>
              <p className="mt-1 font-mono text-xs text-cyan">IN ARRIVO, CON 30 GIORNI DI PROVA</p>
              <ul className="mt-5 space-y-3 text-[15px] text-text-1">
                {aPagamento.map((g) => (
                  <li key={g} className="flex gap-3"><span className="text-cyan" aria-hidden>+</span>{g}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-text-1">
            Perché gratis? Perché il modo più onesto di farti vedere se funziona è lasciartelo provare sul tuo sito. Se
            poi ti serve di più, c&apos;è il piano a pagamento.
          </p>
          <div className="mt-6">
            <InteresseForm fonte="newsletter" interesse="pro" pagina="home" />
          </div>
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
              Il tuo sito può rispondere anche stasera.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href="/plugin" evento="click_installa" props={{ pagina: "home", posizione: "chiusura" }}>
                INSTALLA GRATIS &rarr;
              </CtaButton>
              <CtaButton href={BOOKING_URL} evento="click_prenota" props={{ pagina: "home", posizione: "chiusura" }} variant="secondary">
                PREFERISCI CHE LO INSTALLIAMO NOI? PRENOTA 30 MINUTI
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
