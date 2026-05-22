import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contatti — FR>ME | Prenota una Call",
  description:
    "Prenota una call gratuita con il team FR>ME. Analizziamo i tuoi processi e ti proponiamo un piano di automazione AI su misura.",
  openGraph: {
    title: "Contatti — FR>ME",
    description:
      "Prenota una call gratuita per scoprire come automatizzare la tua azienda.",
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
