import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FR>ME — Automazioni, agenti AI e software con controllo dei dati",
  description:
    "Aiutiamo aziende e seller Amazon a semplificare processi operativi con automazioni, agenti AI e software su misura, mantenendo attenzione su dati interni, sicurezza e know-how aziendale.",
  keywords: [
    "AI",
    "automazione",
    "PMI",
    "Italia",
    "n8n",
    "LangChain",
    "agenti AI",
  ],
  authors: [{ name: "Luigi Scorzelli" }],
  openGraph: {
    title: "FR>ME — Automazioni, agenti AI e software con controllo dei dati",
    description:
      "Automazioni, agenti AI e software custom per processi aziendali, dati interni e setup proprietari.",
    url: "https://aiframe.it",
    siteName: "FR>ME",
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
