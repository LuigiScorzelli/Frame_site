import type {
  StrapiResponse,
  Articolo,
  Risorsa,
  CaseStudy,
  Servizio,
  StrapiBlock,
} from "./types";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

/* ── Articoli placeholder (usati quando Strapi non è raggiungibile) ── */

const LOREM_BLOCKS: StrapiBlock[] = [
  { type: "paragraph", children: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }] },
  { type: "heading", level: 2, children: [{ type: "text", text: "Il contesto attuale" }] },
  { type: "paragraph", children: [{ type: "text", text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium." }] },
  { type: "heading", level: 2, children: [{ type: "text", text: "Come funziona" }] },
  { type: "paragraph", children: [{ type: "text", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet." }] },
  { type: "list", format: "unordered", children: [
    { type: "list-item", children: [{ type: "text", text: "Analisi dei processi esistenti e identificazione delle aree di miglioramento" }] },
    { type: "list-item", children: [{ type: "text", text: "Progettazione della soluzione personalizzata" }] },
    { type: "list-item", children: [{ type: "text", text: "Implementazione graduale con feedback continuo" }] },
  ] },
  { type: "paragraph", children: [{ type: "text", text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident." }] },
];

const ARTICOLI_PLACEHOLDER: Articolo[] = [
  {
    id: 1,
    documentId: "demo-1",
    titolo: "AI e automazione: come mantenere il controllo dei dati",
    slug: "ai-automazione-aziendale",
    excerpt: "Come valutare automazioni e agenti AI partendo da processi, dati interni, accessi e protezione del know-how aziendale.",
    contenuto: LOREM_BLOCKS,
    categoria: "AI",
    cover: null,
    tempo_lettura: 5,
    publishedAt: "2026-02-20T10:00:00.000Z",
    createdAt: "2026-02-20T10:00:00.000Z",
    updatedAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: 2,
    documentId: "demo-2",
    titolo: "Guida pratica: automatizzare i workflow con le API",
    slug: "automatizzare-workflow-api",
    excerpt: "Una guida passo-passo per integrare i tuoi strumenti aziendali tramite API e creare workflow automatici che fanno risparmiare ore di lavoro manuale ogni settimana.",
    contenuto: LOREM_BLOCKS,
    categoria: "AUTOMAZIONE",
    cover: null,
    tempo_lettura: 8,
    publishedAt: "2026-02-15T10:00:00.000Z",
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: 3,
    documentId: "demo-3",
    titolo: "React Server Components: il futuro dello sviluppo web",
    slug: "react-server-components-futuro",
    excerpt: "Analizziamo come i React Server Components stanno cambiando il modo di costruire applicazioni web, con vantaggi concreti in performance e developer experience.",
    contenuto: LOREM_BLOCKS,
    categoria: "SVILUPPO",
    cover: null,
    tempo_lettura: 6,
    publishedAt: "2026-02-10T10:00:00.000Z",
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-10T10:00:00.000Z",
  },
];
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

async function fetchStrapi<T>(
  endpoint: string,
  params?: Record<string, string>,
  revalidate: number = 60
): Promise<T> {
  const url = new URL(`/api${endpoint}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getArticoli(page = 1, pageSize = 9): Promise<StrapiResponse<Articolo[]>> {
  try {
    return await fetchStrapi<StrapiResponse<Articolo[]>>("/articoli", {
      populate: "*",
      sort: "publishedAt:desc",
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
    });
  } catch {
    // Strapi non raggiungibile — restituisci articoli placeholder
    const start = (page - 1) * pageSize;
    const sliced = ARTICOLI_PLACEHOLDER.slice(start, start + pageSize);
    return {
      data: sliced,
      meta: { pagination: { page, pageSize, pageCount: 1, total: ARTICOLI_PLACEHOLDER.length } },
    };
  }
}

export async function getArticoloBySlug(slug: string): Promise<StrapiResponse<Articolo[]>> {
  try {
    return await fetchStrapi<StrapiResponse<Articolo[]>>("/articoli", {
      "filters[slug][$eq]": slug,
      populate: "*",
    });
  } catch {
    // Strapi non raggiungibile — cerca tra i placeholder
    const found = ARTICOLI_PLACEHOLDER.filter((a) => a.slug === slug);
    return { data: found, meta: {} };
  }
}

export async function getRisorse(page = 1, pageSize = 12): Promise<StrapiResponse<Risorsa[]>> {
  try {
    return await fetchStrapi<StrapiResponse<Risorsa[]>>("/risorse", {
      populate: "*",
      sort: "publishedAt:desc",
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
    }, 3600);
  } catch {
    return { data: [], meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } } };
  }
}

export async function getCaseStudies(): Promise<StrapiResponse<CaseStudy[]>> {
  try {
    return await fetchStrapi<StrapiResponse<CaseStudy[]>>("/case-studies", {
      populate: "*",
      sort: "publishedAt:desc",
    }, 3600);
  } catch {
    return { data: [], meta: {} };
  }
}

export async function getServizi(): Promise<StrapiResponse<Servizio[]>> {
  try {
    return await fetchStrapi<StrapiResponse<Servizio[]>>("/servizi", {
      populate: "*",
      sort: "ordine:asc",
    }, 3600);
  } catch {
    return { data: [], meta: {} };
  }
}

export function getStrapiMediaUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}
