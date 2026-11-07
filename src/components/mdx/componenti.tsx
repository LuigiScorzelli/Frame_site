import Image from "next/image";
import Link from "next/link";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import CtaButton from "@/components/ui/CtaButton";
import { PLUGIN_NAME, INSTALL_PATH } from "@/lib/brand";

// Components allowed inside content/articoli/*.mdx (docs/lancio/02-specifiche.md, section 6):
// headings, paragraphs, lists, tables, images (next/image), <Nota> and <CtaInstalla>.

function Nota({ titolo = "Nota", children }: { titolo?: string; children: React.ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-cyan bg-bg-1 px-6 py-5">
      <p className="font-mono text-[11px] font-bold tracking-[2px] text-cyan">{titolo.toUpperCase()}</p>
      <div className="mt-2 text-[15px] leading-relaxed text-text-1 [&>p]:m-0">{children}</div>
    </aside>
  );
}

function CtaInstalla({ pagina = "articolo" }: { pagina?: string }) {
  return (
    <div className="my-10 border border-accent-border bg-bg-1 p-8">
      <p className="text-xl font-bold text-text-0">Prova {PLUGIN_NAME} sul tuo sito.</p>
      <p className="mt-2 text-[15px] text-text-1">È gratuito e si installa in 5 minuti dal pannello di WordPress.</p>
      <CtaButton
        href={INSTALL_PATH}
        evento="click_installa"
        props={{ pagina, posizione: "pagina" }}
        className="mt-6"
      >
        INSTALLA GRATIS &rarr;
      </CtaButton>
    </div>
  );
}

export const componentiMdx: NonNullable<MDXRemoteProps["components"]> = {
  h1: (p) => <h2 {...p} className="mt-12 text-3xl font-extrabold tracking-[-1px] text-text-0" />,
  h2: (p) => <h2 {...p} className="mt-12 text-2xl font-bold tracking-[-1px] text-text-0" />,
  h3: (p) => <h3 {...p} className="mt-8 text-xl font-bold text-text-0" />,
  p: (p) => <p {...p} className="mt-5 text-base leading-[1.8] text-text-1" />,
  ul: (p) => <ul {...p} className="mt-5 list-disc space-y-2 pl-6 text-base leading-[1.8] text-text-1" />,
  ol: (p) => <ol {...p} className="mt-5 list-decimal space-y-2 pl-6 text-base leading-[1.8] text-text-1" />,
  strong: (p) => <strong {...p} className="font-bold text-text-0" />,
  blockquote: (p) => <blockquote {...p} className="mt-6 border-l-2 border-accent pl-6 italic text-text-1" />,
  a: ({ href = "", ...p }) =>
    href.startsWith("/") ? (
      <Link href={href} {...p} className="text-accent underline underline-offset-2 hover:brightness-110" />
    ) : (
      <a href={href} {...p} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:brightness-110" />
    ),
  table: (p) => (
    <div className="mt-6 overflow-x-auto">
      <table {...p} className="w-full border-collapse text-left text-sm text-text-1" />
    </div>
  ),
  th: (p) => <th {...p} className="border-b border-border px-3 py-2 font-mono text-[11px] tracking-wider text-text-0" />,
  td: (p) => <td {...p} className="border-b border-border px-3 py-2" />,
  code: (p) => <code {...p} className="rounded bg-bg-2 px-1.5 py-0.5 font-mono text-sm text-accent" />,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        sizes="(max-width: 780px) 100vw, 780px"
        className="mt-6 h-auto w-full border border-border"
      />
    ) : null,
  Nota,
  CtaInstalla,
};
