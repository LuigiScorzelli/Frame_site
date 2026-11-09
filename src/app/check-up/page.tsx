import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import InteresseForm from "@/components/ui/InteresseForm";
import Calcolatore from "@/components/ui/Calcolatore";
import { AGENCY_NAME, SITE_URL, INSTALL_PATH } from "@/lib/brand";

// Check-up v0 (0.10): only the client-side calculator and the email form (fonte checkup).
// The automatic site analysis (POST /api/checkup) arrives in sprint 1.

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
        <PageHero tag="CHECK-UP" title="Il tuo sito risponde ai clienti? Scoprilo in 2 minuti.">
            <p className="max-w-2xl text-lg leading-relaxed text-text-1">
              Prima di misurare il sito, misura il costo: quante richieste ti arrivano, quante fuori orario, quanto vale
              un cliente.
            </p>
        </PageHero>

        <Section id="calcolatore" numero={1} tag="CALCOLATORE" title="Quanto ti costa una richiesta persa" className="scroll-mt-24">
          <Calcolatore />
        </Section>

        <Section numero={2} tag="REPORT" title="Vuoi il report con le 3 cose da sistemare per prime? Te lo mandiamo via email.">
          <div className="max-w-3xl border border-border bg-bg-1 p-8">
            <InteresseForm fonte="checkup" pagina="check-up" bottone="Mandami il report" />
          </div>
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
