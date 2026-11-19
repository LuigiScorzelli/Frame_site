import type { Metadata } from "next";
import { AGENCY_NAME, PLUGIN_NAME } from "@/lib/brand";
import { metaSocial } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    `Parliamone in 30 minuti: ci mostri il tuo sito, ti diciamo cosa farebbe ${PLUGIN_NAME} e se ha senso per te.`,
  ...metaSocial({
    percorso: "/contatti",
    titolo: `Contatti | ${AGENCY_NAME}`,
    descrizione: `Ci mostri il tuo sito, ti diciamo cosa farebbe ${PLUGIN_NAME} e se ha senso per te.`,
  }),
};

export default function ContattiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
