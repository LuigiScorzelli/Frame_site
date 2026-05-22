import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import BlogGrid from "@/components/sections/BlogGrid";
import ChatWidget from "@/components/ui/ChatWidget";
import { getArticoli } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Blog — FR>ME | Insight su AI e Automazione",
  description:
    "Articoli tecnici, case study e best practice su AI, automazione e sviluppo software per PMI italiane.",
  openGraph: {
    title: "Blog — FR>ME",
    description:
      "Insight, guide e novita dal mondo dell'automazione AI.",
    url: "https://aiframe.it/blog",
  },
};

export default async function BlogPage() {
  const res = await getArticoli();
  const articoli = res.data;

  return (
    <>
      <NavBar />
      <main>
        {/* Blog hero */}
        <section className="bg-bg-0 pt-24 lg:pt-28">
          <div className="mx-auto max-w-[1440px] px-14 pb-12 pt-20">
            <span className="font-mono text-xs font-medium tracking-[3px] text-accent">BLOG</span>
            <h1 className="mt-6 max-w-[800px] text-[48px] font-extrabold leading-[1.1] tracking-[-2px] text-text-0">
              Insight, guide e novita<br />dal mondo dell&apos;automazione.
            </h1>
            <p className="mt-6 max-w-[560px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
              Articoli tecnici, case study e best practice per trasformare il tuo business.
            </p>
          </div>
        </section>

        <section className="bg-bg-0 pb-20">
          <div className="mx-auto max-w-[1440px] px-14">
            <BlogGrid articoli={articoli} />
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
