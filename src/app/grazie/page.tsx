import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/ui/CtaButton";
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
        <section className="pb-24 pt-36 lg:pt-44">
          <div className="mx-auto max-w-[900px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">ISCRIZIONE</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-[-2px] text-text-0 sm:text-5xl">
              Fatto. Sei dentro.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-1">
              La tua iscrizione è confermata. Ti scriviamo solo quando abbiamo qualcosa di utile, e ti cancelli quando
              vuoi con il link in fondo a ogni email.
            </p>
            <p className="mt-10 text-[15px] text-text-1">Nel frattempo, il tuo sito può già rispondere ai clienti stasera.</p>
            <CtaButton href={INSTALL_PATH} evento="click_installa" props={{ pagina: "grazie", posizione: "pagina" }} className="mt-6">
              INSTALLA GRATIS &rarr;
            </CtaButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
