import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ChatWidget from "@/components/ui/ChatWidget";
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
        <section className="pb-16 pt-36 lg:pt-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">RISORSE</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-[-2px] text-text-0 sm:text-5xl">
              Guide pratiche per chi riceve richieste dal sito e vuole perderne meno.
            </h1>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {schede.map((s) => (
                <Link key={s.tag} href={s.href} className="group border border-border bg-bg-1 p-8 transition-colors hover:border-accent-border">
                  <span className="font-mono text-[11px] font-bold tracking-[2px] text-cyan">{s.tag}</span>
                  <h2 className="mt-3 text-xl font-bold text-text-0 group-hover:text-accent">{s.titolo}</h2>
                  <p className="mt-2 text-[15px] text-text-1">{s.testo}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {articoli.length > 0 && (
          <section className="border-t border-border py-16">
            <div className="mx-auto max-w-[1200px] px-6 lg:px-14">
              <h2 className="text-2xl font-extrabold tracking-[-1px] text-text-0">Articoli</h2>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {articoli.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/risorse/${a.slug}`} className="group block py-6">
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[1px] text-text-1">
                        <span className="text-accent">{CATEGORIE[a.categoria].toUpperCase()}</span>
                        <time dateTime={a.data}>{formatDataArticolo(a.data)}</time>
                        <span>{a.tempoLettura} min</span>
                        {a.bozza && <span className="border border-amber px-2 py-0.5 text-amber">BOZZA</span>}
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-text-0 group-hover:text-accent">{a.titolo}</h3>
                      <p className="mt-1 max-w-3xl text-[15px] text-text-1">{a.descrizione}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <NewsletterSection pagina="risorse" />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
