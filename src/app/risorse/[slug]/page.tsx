import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import CtaButton from "@/components/ui/CtaButton";
import JsonLd from "@/components/seo/JsonLd";
import { componentiMdx } from "@/components/mdx/componenti";
import { CATEGORIE, formatDataArticolo, getArticoli, getArticolo } from "@/lib/content";
import { AGENCY_NAME, SITE_URL, INSTALL_PATH } from "@/lib/brand";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticoli().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articolo = getArticolo(slug);
  if (!articolo) return { title: "Articolo non trovato" };
  return {
    title: articolo.titolo,
    description: articolo.descrizione,
    alternates: { canonical: `/risorse/${slug}` },
    robots: articolo.bozza ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/risorse/${slug}`,
      title: articolo.titolo,
      description: articolo.descrizione,
      publishedTime: articolo.data,
      ...(articolo.cover ? { images: [articolo.cover] } : {}),
    },
  };
}

export default async function ArticoloPage({ params }: PageProps) {
  const { slug } = await params;
  const articolo = getArticolo(slug);
  if (!articolo) notFound();

  const lista = getArticoli();
  const indice = lista.findIndex((a) => a.slug === slug);
  // List is newest first: the "next" article to read is the previous (older) one, else the newest.
  const prossimo = lista.length > 1 ? lista[(indice + 1) % lista.length] : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: articolo.titolo,
          description: articolo.descrizione,
          datePublished: articolo.data,
          inLanguage: "it",
          mainEntityOfPage: `${SITE_URL}/risorse/${slug}`,
          ...(articolo.cover ? { image: `${SITE_URL}${articolo.cover}` } : {}),
          author: { "@type": "Organization", name: AGENCY_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: AGENCY_NAME, url: SITE_URL },
        }}
      />
      <NavBar />
      <main className="bg-bg-0 pt-24 lg:pt-28">
        <article className="mx-auto max-w-[780px] px-6 pb-20 pt-16">
          <div className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-[1px] text-text-1">
            <Link href="/risorse" className="transition-colors hover:text-accent">RISORSE</Link>
            <span aria-hidden>/</span>
            <span className="text-accent">{CATEGORIE[articolo.categoria].toUpperCase()}</span>
            {articolo.bozza && <span className="ml-2 border border-amber px-2 py-0.5 text-amber">BOZZA</span>}
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-[-2px] text-text-0 lg:text-5xl">
            {articolo.titolo}
          </h1>

          <div className="mt-6 flex items-center gap-4 font-mono text-[11px] tracking-[1px] text-text-1">
            <time dateTime={articolo.data}>{formatDataArticolo(articolo.data).toUpperCase()}</time>
            <span className="h-1 w-1 rounded-full bg-text-1" aria-hidden />
            <span>{articolo.tempoLettura} MIN DI LETTURA</span>
          </div>

          <div className="my-10 h-px bg-border" />

          <MDXRemote
            source={articolo.corpo}
            components={componentiMdx}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />

          <div className="mt-16 border border-accent-border bg-bg-1 p-8">
            <p className="text-xl font-bold text-text-0">Il tuo sito può rispondere anche stasera.</p>
            <CtaButton
              href={INSTALL_PATH}
              evento="click_installa"
              props={{ pagina: "articolo", posizione: "chiusura" }}
              className="mt-6"
            >
              INSTALLA GRATIS &rarr;
            </CtaButton>
          </div>

          {prossimo && (
            <div className="mt-10 border-t border-border pt-8">
              <span className="font-mono text-[11px] tracking-[1px] text-text-1">PROSSIMO ARTICOLO</span>
              <Link href={`/risorse/${prossimo.slug}`} className="mt-2 block text-lg font-bold text-text-0 hover:text-accent">
                {prossimo.titolo} &rarr;
              </Link>
            </div>
          )}
        </article>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
