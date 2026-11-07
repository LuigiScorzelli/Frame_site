import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// MDX articles in content/articoli/*.mdx (docs/lancio/02-specifiche.md, section 6).
// The slug is the file name. Drafts (`bozza: true`) are visible only in development.

export const CATEGORIE = {
  "richieste-perse": "Richieste perse",
  "sito-crm": "Dal sito al CRM",
  "ai-onesta": "AI senza invenzioni",
  privacy: "Privacy",
  bottega: "Bottega",
} as const;

export type Categoria = keyof typeof CATEGORIE;

export interface FrontmatterArticolo {
  titolo: string;
  descrizione: string;
  /** ISO date, YYYY-MM-DD. */
  data: string;
  categoria: Categoria;
  tempoLettura: number;
  cover?: string;
  bozza: boolean;
}

export interface Articolo extends FrontmatterArticolo {
  slug: string;
  /** MDX body without frontmatter. */
  corpo: string;
}

const CARTELLA = path.join(process.cwd(), "content", "articoli");
const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const mostraBozze = process.env.NODE_ENV !== "production";

function dataIso(v: unknown): string {
  // gray-matter turns unquoted YAML dates into Date objects.
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return "";
}

function leggiFile(file: string): Articolo {
  const slug = file.replace(/\.mdx$/, "");
  const { data, content } = matter(readFileSync(path.join(CARTELLA, file), "utf8"));
  const errori: string[] = [];

  if (!SLUG_VALIDO.test(slug)) errori.push("nome file non valido come slug");
  if (typeof data.titolo !== "string" || !data.titolo.trim()) errori.push("titolo");
  if (typeof data.descrizione !== "string" || !data.descrizione.trim()) errori.push("descrizione");
  const d = dataIso(data.data);
  if (!d) errori.push("data (YYYY-MM-DD)");
  if (!(typeof data.categoria === "string" && data.categoria in CATEGORIE)) errori.push("categoria");
  if (typeof data.tempoLettura !== "number" || data.tempoLettura <= 0) errori.push("tempoLettura");
  if (data.cover !== undefined && typeof data.cover !== "string") errori.push("cover");
  if (data.bozza !== undefined && typeof data.bozza !== "boolean") errori.push("bozza");

  // A broken article must fail the build, not ship half-rendered.
  if (errori.length) throw new Error(`content/articoli/${file}: frontmatter non valido (${errori.join(", ")})`);

  return {
    slug,
    titolo: data.titolo,
    descrizione: data.descrizione,
    data: d,
    categoria: data.categoria as Categoria,
    tempoLettura: data.tempoLettura,
    cover: data.cover,
    bozza: data.bozza ?? false,
    corpo: content,
  };
}

function tutti(): Articolo[] {
  let files: string[];
  try {
    files = readdirSync(CARTELLA).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  return files
    .map(leggiFile)
    .filter((a) => mostraBozze || !a.bozza)
    .sort((a, b) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug));
}

/** Published articles, newest first. Drafts appear only outside production. */
export function getArticoli({ categoria }: { categoria?: Categoria } = {}): Articolo[] {
  const lista = tutti();
  return categoria ? lista.filter((a) => a.categoria === categoria) : lista;
}

export function getArticolo(slug: string): Articolo | null {
  return tutti().find((a) => a.slug === slug) ?? null;
}

/** Categories that have at least one visible article, in the declared order. */
export function getCategorie(): { slug: Categoria; nome: string }[] {
  const usate = new Set(tutti().map((a) => a.categoria));
  return (Object.keys(CATEGORIE) as Categoria[])
    .filter((c) => usate.has(c))
    .map((c) => ({ slug: c, nome: CATEGORIE[c] }));
}

export function formatDataArticolo(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}
