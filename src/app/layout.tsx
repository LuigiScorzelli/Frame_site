import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import AssistenteAI from "@/components/ui/AssistenteAI";
import { AGENCY_NAME, CITY, CONTACT_EMAIL, FOUNDER_URL, SITE_URL } from "@/lib/brand";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Umami (cookieless statistics): production deployments only, so dev and preview visits are not counted.
// UMAMI_ANCHE_PREVIEW=1, passed only as a build env of a one-off test deploy, turns it on in a preview.
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const umamiAttivo =
  Boolean(UMAMI_WEBSITE_ID) &&
  (process.env.VERCEL_ENV === "production" ||
    (process.env.VERCEL_ENV === "preview" && process.env.UMAMI_ANCHE_PREVIEW === "1"));

// Defaults for pages without their own metadata (home og:title, 404): same message as the home page.
const titoloPredefinito = `${AGENCY_NAME}: automazioni e assistenti AI per piccole aziende`;
const descrizione =
  "Costruiamo automazioni, assistenti AI e collegamenti tra gli strumenti che usate già, per piccole aziende senza reparto tecnico. E abbiamo un plugin WordPress gratuito.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: titoloPredefinito,
    template: `%s | ${AGENCY_NAME}`,
  },
  description: descrizione,
  authors: [{ name: "Luigi Scorzelli", url: FOUNDER_URL }],
  openGraph: {
    title: titoloPredefinito,
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
        className={`${bricolage.variable} ${inter.variable} antialiased bg-bg-0 text-text-0`}
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
        {umamiAttivo && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
