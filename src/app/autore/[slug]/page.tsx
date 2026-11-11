import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { CATEGORIE, formatDataArticolo, getArticoliAutore } from "@/lib/content";
import { AGENCY_NAME, AUTORI, SITE_URL, type SlugAutore } from "@/lib/brand";

// Author page (Company Brain, AV2): the article byline links here.

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(AUTORI).map((slug) => ({ slug }));
}

function autoreDa(slug: string) {
  return slug in AUTORI ? { slug: slug as SlugAutore, ...AUTORI[slug as SlugAutore] } : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const autore = autoreDa((await params).slug);
  if (!autore) return { title: "Autore non trovato" };
  const descrizione = `${autore.nome}, ${autore.ruolo}. ${autore.presentazione[0]}`;
  return {
    title: `${autore.nome}, ${autore.ruolo}`,
    description: descrizione,
    alternates: { canonical: `/autore/${autore.slug}` },
    openGraph: { type: "profile", url: `${SITE_URL}/autore/${autore.slug}`, title: autore.nome, description: descrizione },
  };
}

export default async function AutorePage({ params }: PageProps) {
  const autore = autoreDa((await params).slug);
  if (!autore) notFound();
  const articoli = getArticoliAutore(autore.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: autore.nome,
            jobTitle: autore.ruolo,
            url: `${SITE_URL}/autore/${autore.slug}`,
            sameAs: [autore.sitoPersonale],
            worksFor: { "@type": "Organization", name: AGENCY_NAME, url: SITE_URL },
          },
        }}
      />
      <NavBar />
      <main>
        <PageHero tag="AUTORE" title={autore.nome}>
          <p className="font-label text-[15px] tracking-[1px] text-accent">{autore.ruolo.toUpperCase()}</p>
          <div className="mt-6 max-w-2xl space-y-3 text-lg leading-relaxed text-text-1">
            {autore.presentazione.map((riga) => (
              <p key={riga}>{riga}</p>
            ))}
          </div>
          <a
            href={autore.sitoPersonale}
            className="mt-6 inline-block font-label text-[13px] tracking-[1px] text-text-0 underline underline-offset-4 hover:text-accent"
          >
            {autore.sitoPersonale.replace(/^https?:\/\//, "").toUpperCase()} &rarr;
          </a>
        </PageHero>

        {articoli.length > 0 && (
          <Section numero={1} tag="ARTICOLI" title="I suoi articoli">
            <ul className="grid gap-6 md:grid-cols-2">
              {articoli.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/risorse/${a.slug}`}
                    className="group flex h-full flex-col border border-border bg-bg-1 p-8 transition-colors hover:border-accent-border"
                  >
                    <div className="flex flex-wrap items-center gap-3 font-label text-[13px] tracking-[1px] text-text-1">
                      <span className="text-accent">{CATEGORIE[a.categoria].toUpperCase()}</span>
                      <time dateTime={a.data}>{formatDataArticolo(a.data)}</time>
                      <span>{a.tempoLettura} min</span>
                      {a.bozza && <span className="border border-amber px-2 py-0.5 text-amber">BOZZA</span>}
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-text-0 group-hover:text-accent">{a.titolo}</h2>
                    <p className="mt-1 text-[15px] text-text-1">{a.descrizione}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </main>
      <Footer />
    </>
  );
}
