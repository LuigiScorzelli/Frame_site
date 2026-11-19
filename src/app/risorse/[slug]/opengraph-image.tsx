import { notFound } from "next/navigation";
import { CATEGORIE, getArticoli, getArticolo } from "@/lib/content";
import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Anteprima dell'articolo";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticoli().map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const articolo = getArticolo((await params).slug);
  if (!articolo) notFound();
  return immagineSocial({ etichetta: CATEGORIE[articolo.categoria], titolo: articolo.titolo });
}
