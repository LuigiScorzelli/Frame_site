import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { CATEGORIE, formatDataArticolo, getArticoli } from "@/lib/content";
import { AGENCY_NAME, SITE_URL } from "@/lib/brand";

const descrizione =
  "Guide pratiche per chi riceve richieste dal sito e vuole perderne meno: richieste perse, dal sito al CRM, AI senza invenzioni, privacy.";

export const metadata: Metadata = {
  title: { absolute: `Guide su richieste dal sito, chatbot e CRM per piccole aziende | ${AGENCY_NAME}` },
  description: descrizione,
  alternates: { canonical: "/risorse" },
  openGraph: { url: `${SITE_URL}/risorse`, title: `Risorse | ${AGENCY_NAME}`, description: descrizione },
};

// The holiday checklist card (sprint 2) is added when the PDF exists.
const schede = [
  {
    tag: "CHECK-UP",
    titolo: "Il tuo sito risponde ai clienti?",
    testo: "Come il tuo sito riceve le richieste e cosa succede fuori orario.",
    href: "/check-up",
  },
  {
    tag: "CALCOLATORE",
    titolo: "Quanto ti costa una richiesta persa",
    testo: "Tre numeri tuoi, una formula dichiarata, il costo al mese.",
    href: "/check-up#calcolatore",
  },
];

export default function RisorsePage() {
  const articoli = getArticoli();

  return (
    <>
      <NavBar />
      <main>
        <PageHero tag="RISORSE" title="Guide pratiche per chi riceve richieste dal sito e vuole perderne meno." />

        <Section numero={1} tag="DA DOVE PARTIRE">
          <div className="grid gap-6 md:grid-cols-2">
            {schede.map((s) => (
              <Link key={s.tag} href={s.href} className="group border border-border bg-bg-1 p-8 transition-colors hover:border-accent-border">
                <span className="font-label text-[13px] font-bold tracking-[2px] text-accent">{s.tag}</span>
                <h2 className="mt-3 text-xl font-bold text-text-0 group-hover:text-accent">{s.titolo}</h2>
                <p className="mt-2 text-[15px] text-text-1">{s.testo}</p>
                <span className="mt-6 inline-block font-label text-[13px] tracking-[1px] text-accent">APRI &rarr;</span>
              </Link>
            ))}
          </div>
        </Section>

        {articoli.length > 0 && (
          <Section numero={2} tag="ARTICOLI" title="Articoli">
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articoli.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/risorse/${a.slug}`} className="group flex h-full flex-col border border-border bg-bg-1 p-8 transition-colors hover:border-accent-border">
                      <div className="flex flex-wrap items-center gap-3 font-label text-[13px] tracking-[1px] text-text-1">
                        <span className="text-accent">{CATEGORIE[a.categoria].toUpperCase()}</span>
                        <time dateTime={a.data}>{formatDataArticolo(a.data)}</time>
                        <span>{a.tempoLettura} min</span>
                        {a.bozza && <span className="border border-amber px-2 py-0.5 text-amber">BOZZA</span>}
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-text-0 group-hover:text-accent">{a.titolo}</h3>
                      <p className="mt-1 max-w-3xl text-[15px] text-text-1">{a.descrizione}</p>
                    </Link>
                  </li>
                ))}
              </ul>
          </Section>
        )}

        <NewsletterSection pagina="risorse" />
      </main>
      <Footer />
    </>
  );
}
