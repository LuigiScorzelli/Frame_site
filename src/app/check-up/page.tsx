import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import CtaButton from "@/components/ui/CtaButton";
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
        <section className="pb-16 pt-36 lg:pt-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">CHECK-UP</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-2px] text-text-0 sm:text-5xl lg:text-6xl">
              Il tuo sito risponde ai clienti? Scoprilo in 2 minuti.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-1">
              Prima di misurare il sito, misura il costo: quante richieste ti arrivano, quante fuori orario, quanto vale
              un cliente.
            </p>
          </div>
        </section>

        <Section id="calcolatore" tag="CALCOLATORE" title="Quanto ti costa una richiesta persa" className="scroll-mt-24">
          <Calcolatore />
        </Section>

        <Section tag="REPORT" title="Vuoi il report con le 3 cose da sistemare per prime? Te lo mandiamo via email.">
          <InteresseForm fonte="checkup" pagina="check-up" bottone="Mandami il report" />
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
      <ChatWidget />
    </>
  );
}
