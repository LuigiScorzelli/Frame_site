import type { Metadata } from "next";
import { AGENCY_NAME, PLUGIN_NAME, SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    `Parliamone in 30 minuti: ci mostri il tuo sito, ti diciamo cosa farebbe ${PLUGIN_NAME} e se ha senso per te.`,
  openGraph: {
    title: `Contatti | ${AGENCY_NAME}`,
    description:
      `Ci mostri il tuo sito, ti diciamo cosa farebbe ${PLUGIN_NAME} e se ha senso per te.`,
    url: `${SITE_URL}/contatti`,
  },
};

export default function ContattiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
