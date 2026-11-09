import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import AssistenteAI from "@/components/ui/AssistenteAI";
import { AGENCY_NAME, CITY, CONTACT_EMAIL, FOUNDER_URL, SITE_URL } from "@/lib/brand";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const descrizione =
  "Plugin WordPress gratuito in italiano per piccole aziende: risponde ai clienti con le informazioni del sito, raccoglie le richieste fuori orario e te le consegna.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${AGENCY_NAME}: il tuo sito WordPress risponde anche quando sei chiuso`,
    template: `%s | ${AGENCY_NAME}`,
  },
  description: descrizione,
  authors: [{ name: "Luigi Scorzelli", url: FOUNDER_URL }],
  openGraph: {
    title: `${AGENCY_NAME}: il tuo sito WordPress risponde anche quando sei chiuso`,
    description: descrizione,
    url: SITE_URL,
    siteName: AGENCY_NAME,
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${sora.variable} ${spaceMono.variable} antialiased bg-bg-0 text-text-0`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: AGENCY_NAME,
            url: SITE_URL,
            email: CONTACT_EMAIL,
            logo: `${SITE_URL}/logos/logo-icon.svg`,
            address: { "@type": "PostalAddress", addressLocality: CITY, addressCountry: "IT" },
            founder: { "@type": "Person", name: "Luigi Scorzelli", url: FOUNDER_URL },
          }}
        />
        {children}
        <AssistenteAI />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
