import type { Metadata } from "next";
import { AGENCY_NAME, SITE_URL } from "@/lib/brand";
import { OG_SIZE } from "@/lib/og";


// Same text as the site image (app/opengraph-image.tsx).
const ALT_SITO = "Automazioni e assistenti AI per piccole aziende";

type Social = {
  /** Page path, e.g. "/plugin". */
  percorso: string;
  titolo: string;
  descrizione: string;
  tipo?: "website" | "article" | "profile";
  /** ISO date, articles only. */
  pubblicato?: string;
  /** Author page paths, articles only. */
  autori?: string[];
  /** Set to true on routes that have their own opengraph-image.tsx; otherwise the site image is used. */
  immaginePropria?: boolean;
};

/**
 * openGraph + twitter for a page. Next.js replaces the layout's openGraph instead of merging it,
 * so every page must repeat siteName, locale and type: this does it in one place.
 * Image: a page that sets openGraph loses the image inherited from app/opengraph-image.tsx, and an
 * explicit image here also hides the route's own opengraph-image.tsx (checked in the build HTML, 19/11).
 * So the URL is always explicit: the route's own file with immaginePropria, the site one otherwise.
 */
export function metaSocial({
  percorso,
  titolo,
  descrizione,
  tipo = "website",
  pubblicato,
  autori,
  immaginePropria = false,
}: Social): Pick<
  Metadata,
  "openGraph" | "twitter"
> {
  const immagine = {
    url: immaginePropria ? `${percorso}/opengraph-image` : "/opengraph-image",
    ...OG_SIZE,
    alt: immaginePropria ? titolo : ALT_SITO,
  };
  const comune = {
    url: `${SITE_URL}${percorso === "/" ? "" : percorso}`,
    title: titolo,
    description: descrizione,
    siteName: AGENCY_NAME,
    locale: "it_IT",
    images: [immagine],
  };
  const openGraph: Metadata["openGraph"] =
    tipo === "article"
      ? { ...comune, type: "article", publishedTime: pubblicato, authors: autori?.map((a) => `${SITE_URL}${a}`) }
      : { ...comune, type: tipo };
  return {
    openGraph,
    twitter: { card: "summary_large_image", title: titolo, description: descrizione, images: [immagine] },
  };
}
