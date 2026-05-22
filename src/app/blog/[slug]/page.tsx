import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import { getArticoloBySlug } from "@/lib/strapi";
import { formatDate } from "@/lib/utils";
import type { StrapiBlock, StrapiInline } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getArticoloBySlug(slug);
  const articolo = res.data?.[0];

  if (!articolo) {
    return { title: "Articolo non trovato — FR>ME" };
  }

  return {
    title: `${articolo.titolo} — FR>ME Blog`,
    description: articolo.excerpt,
    openGraph: {
      title: articolo.titolo,
      description: articolo.excerpt,
      url: `https://aiframe.it/blog/${slug}`,
      type: "article",
      publishedTime: articolo.publishedAt,
    },
  };
}

function RichText({ blocks }: { blocks: StrapiBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="text-base leading-relaxed text-text-1" style={{ lineHeight: 1.8 }}>
                <InlineChildren children={block.children} />
              </p>
            );
          case "heading": {
            const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
            return (
              <Tag key={i} className="mt-4 text-2xl font-bold tracking-[-1px] text-text-0">
                <InlineChildren children={block.children} />
              </Tag>
            );
          }
          case "list":
            return (
              <ul key={i} className={`space-y-2 pl-6 ${block.format === "ordered" ? "list-decimal" : "list-disc"} text-text-1`}>
                {block.children.map((item, j) => (
                  <li key={j} className="text-base leading-relaxed" style={{ lineHeight: 1.8 }}>
                    <InlineChildren children={item.children} />
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-accent pl-6 text-text-1 italic">
                <InlineChildren children={block.children} />
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} className="overflow-x-auto rounded-lg bg-bg-2 p-4 font-mono text-sm text-text-0">
                <InlineChildren children={block.children} />
              </pre>
            );
          case "image":
            return null;
          default:
            return null;
        }
      })}
    </div>
  );
}

function InlineChildren({ children }: { children: StrapiInline[] }) {
  return (
    <>
      {children.map((child, i) => {
        let el: React.ReactNode = child.text;
        if (child.bold) el = <strong key={i}>{el}</strong>;
        if (child.italic) el = <em key={i}>{el}</em>;
        if (child.code) el = <code key={i} className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-sm text-accent">{el}</code>;
        return <span key={i}>{el}</span>;
      })}
    </>
  );
}

export default async function ArticoloPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await getArticoloBySlug(slug);
  const articolo = res.data?.[0];

  if (!articolo) notFound();

  return (
    <>
      <NavBar />
      <main className="bg-bg-0 pt-24 lg:pt-28">
        <article className="mx-auto max-w-[780px] px-6 pb-20 pt-20">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>
            <Link href="/blog" className="transition-colors hover:text-accent">BLOG</Link>
            <span>/</span>
            <span className="text-accent">{articolo.categoria?.toUpperCase()}</span>
          </div>

          {/* Title */}
          <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-[-2px] text-text-0 lg:text-[48px]">
            {articolo.titolo}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex items-center gap-4 font-mono text-[11px] tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>
            <span>{formatDate(articolo.publishedAt).toUpperCase()}</span>
            <span className="h-1 w-1 rounded-full bg-text-1" />
            <span>{articolo.tempo_lettura} MIN LETTURA</span>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-border" />

          {/* Content */}
          <RichText blocks={articolo.contenuto} />

          {/* Back link */}
          <div className="mt-16 border-t border-border pt-8">
            <Link href="/blog" className="font-mono text-[11px] font-bold tracking-wider text-accent transition-colors hover:text-accent/80" style={{ letterSpacing: "1px" }}>
              &larr; TORNA AL BLOG
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
