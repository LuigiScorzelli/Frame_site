import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
import PageHero from "@/components/ui/PageHero";
import { INSTALL_PATH } from "@/lib/brand";

// Landing page after the Brevo double opt-in link (BREVO_REDIRECT_URL). Not indexed.

export const metadata: Metadata = {
  title: "Iscrizione confermata",
  description: "Iscrizione confermata.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/grazie" },
};

export default function GraziePage() {
  return (
    <>
      <NavBar />
      <main>
        <PageHero tag="ISCRIZIONE" title="Fatto. Sei dentro.">
            <p className="max-w-2xl text-lg leading-relaxed text-text-1">
              La tua iscrizione è confermata. Ti scriviamo solo quando abbiamo qualcosa di utile, e ti cancelli quando
              vuoi con il link in fondo a ogni email.
            </p>
            <p className="mt-10 text-[15px] text-text-1">Nel frattempo, il tuo sito può già rispondere ai clienti stasera.</p>
            <CtaButton href={INSTALL_PATH} variant="gradient" evento="click_installa" props={{ pagina: "grazie", posizione: "pagina" }} className="mt-6">
              INSTALLA GRATIS &rarr;
            </CtaButton>
        </PageHero>
        <div className="pb-16" />
      </main>
      <Footer />
    </>
  );
}
