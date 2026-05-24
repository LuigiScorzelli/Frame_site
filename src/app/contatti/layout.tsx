import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contatti — FR>ME | Prenota una Call",
  description:
    "Prenota una call gratuita con FR>ME. Analizziamo processi, dati e requisiti di sicurezza per valutare automazioni, agenti AI o software su misura.",
  openGraph: {
    title: "Contatti — FR>ME",
    description:
      "Prenota una call gratuita per capire come automatizzare processi mantenendo controllo su dati e know-how.",
    url: "https://aiframe.it/contatti",
  },
};

export default function ContattiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
