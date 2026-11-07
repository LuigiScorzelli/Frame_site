import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import CtaButton from "@/components/ui/CtaButton";
import Section from "@/components/ui/Section";
import Hero from "@/components/sections/home/Hero";
import Ticker from "@/components/sections/home/Ticker";
import MetricsBar from "@/components/sections/home/MetricsBar";
import CosaCostruiamo from "@/components/sections/home/CosaCostruiamo";
import ComeLavoriamo from "@/components/sections/home/ComeLavoriamo";
import DatiBand from "@/components/sections/home/DatiBand";
import ChiSiamo from "@/components/sections/home/ChiSiamo";
import { AGENCY_NAME, BOOKING_URL, CONTACT_EMAIL, PLUGIN_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: `Automazioni e assistenti AI per piccole aziende | ${AGENCY_NAME}` },
  description:
    "Costruiamo automazioni, assistenti AI e collegamenti tra gli strumenti che usate già, per piccole aziende senza reparto tecnico. E abbiamo un plugin WordPress gratuito.",
  alternates: { canonical: "/" },
};

// Verified beta facts (docs/lancio): the only figures on the page, each with its source.
const prove = [
  { valore: "24/10/2026", etichetta: "IN PROVA SU SITI REALI DAL" },
  { valore: "37/37", etichetta: "COLLAUDI AUTOMATICI SUPERATI (TEST INTERNI)" },
];

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Ticker />
        <MetricsBar />
        <CosaCostruiamo />

        <Section tag="PER CHI" title="Per chi lavoriamo">
          <p className="max-w-3xl text-lg leading-relaxed text-text-1">
            Piccole aziende senza reparto tecnico, con i dati sparsi tra email, fogli e gestionale, e qualcuno che passa
            ogni settimana ore a spostarli da un posto all&apos;altro. Non serve sapere cos&apos;è un&apos;API: ci basta
            capire come lavorate oggi.
          </p>
        </Section>

        <ComeLavoriamo />
        <DatiBand />

        {/* Plugin band */}
        <section className="border-t border-accent-border bg-bg-1 py-20 lg:py-24">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-cyan">IL NOSTRO PRIMO PRODOTTO</span>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-1px] text-text-0 lg:text-[48px] lg:tracking-[-2px]">
              {PLUGIN_NAME}: il sito WordPress che risponde anche quando siete chiusi
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-1">
              Un plugin WordPress gratuito che risponde ai clienti con le informazioni del vostro sito, raccoglie nome,
              recapito e cosa cercano, e ve li consegna in posta.
            </p>
            <div className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
              {prove.map((p) => (
                <div key={p.valore} className="border border-border bg-bg-0 p-6">
                  <div className="font-mono text-3xl font-bold text-accent">{p.valore}</div>
                  <div className="mt-1 font-mono text-[11px] font-medium tracking-widest text-text-1">{p.etichetta}</div>
                </div>
              ))}
            </div>
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

        <ChiSiamo />

        <section className="border-t border-border bg-bg-1 py-24">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-14">
            <h2 className="text-3xl font-extrabold tracking-[-1px] text-text-0 lg:text-5xl">
              Raccontateci un processo che vi fa perdere tempo.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href={BOOKING_URL} variant="gradient" evento="click_prenota" props={{ pagina: "home", posizione: "chiusura" }}>
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
