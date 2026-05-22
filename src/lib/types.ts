export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface Articolo {
  id: number;
  documentId: string;
  titolo: string;
  slug: string;
  excerpt: string;
  contenuto: StrapiBlock[];
  categoria: string;
  cover: StrapiMedia | null;
  tempo_lettura: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Risorsa {
  id: number;
  documentId: string;
  titolo: string;
  slug: string;
  descrizione: string;
  tipo: "Ebook" | "Template" | "Prompt" | "Checklist";
  file: StrapiMedia | null;
  cover: StrapiMedia | null;
  gratuito: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  id: number;
  documentId: string;
  cliente: string;
  titolo: string;
  descrizione: string;
  settore: string;
  metriche: Metrica[];
  cover: StrapiMedia | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Metrica {
  label: string;
  valore: string;
  prefisso?: string;
  suffisso?: string;
}

export interface Servizio {
  id: number;
  documentId: string;
  nome: string;
  slug: string;
  descrizione: string;
  icona: string;
  tag_tech: string[];
  ordine: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type StrapiBlock =
  | { type: "paragraph"; children: StrapiInline[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: StrapiInline[] }
  | { type: "list"; format: "ordered" | "unordered"; children: StrapiListItem[] }
  | { type: "quote"; children: StrapiInline[] }
  | { type: "code"; children: StrapiInline[] }
  | { type: "image"; image: StrapiMedia };

export interface StrapiInline {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiListItem {
  type: "list-item";
  children: StrapiInline[];
}

export interface ContactFormData {
  nome: string;
  email: string;
  azienda?: string;
  messaggio: string;
  budget?: string;
  servizio?: string;
}
