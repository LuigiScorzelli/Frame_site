import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Checkup from "@/components/ui/Checkup";
import Calcolatore from "@/components/ui/Calcolatore";
import { AGENCY_NAME, SITE_URL, INSTALL_PATH } from "@/lib/brand";

// Check-up v1 (1.1): automatic site analysis (POST /api/checkup) with the email report, then the
// client-side calculator (0.10).

const descrizione =
  "Controllo gratuito in 2 minuti: come il tuo sito riceve le richieste, cosa succede fuori orario e quanto ti costa ogni richiesta persa.";

export const metadata: Metadata = {
  title: { absolute: `Check-up richieste perse: il tuo sito risponde ai clienti? | ${AGENCY_NAME}` },
  description: descrizione,
  alternates: { canonical: "/check-up" },
  openGraph: { url: `${SITE_URL}/check-up`, title: "Check-up richieste perse: il tuo sito risponde ai clienti?", description: descrizione },
};

export default function CheckUpPage() {
  return (
    <>
      <NavBar />
      <main>
        <PageHero tag="CHECK-UP" parola="CHECK-UP" title="Il tuo sito risponde ai clienti? Scoprilo in 2 minuti.">
            <p className="max-w-2xl text-lg leading-relaxed text-text-1">
              Inserisci l&apos;indirizzo del sito. Controlliamo come riceve le richieste: moduli, chat, orari, promessa di
              risposta, pagina contatti da telefono. Risultato subito in pagina, report completo via email se lo vuoi.
            </p>
        </PageHero>

        <Section id="analisi" numero={1} tag="CHECK-UP" title="Il controllo del tuo sito" className="scroll-mt-24">
          <Checkup />
        </Section>

        <Section id="calcolatore" numero={2} tag="CALCOLATORE" title="Quanto ti costa una richiesta persa" className="scroll-mt-24">
          <Calcolatore />
          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
            <p className="text-[15px] text-text-1">La voce &quot;fuori orario&quot; si sistema in 5 minuti:</p>
            <CtaButton
              href={INSTALL_PATH}
              evento="click_installa"
              props={{ pagina: "check-up", posizione: "chiusura" }}
            >
              INSTALLA GRATIS &rarr;
            </CtaButton>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
