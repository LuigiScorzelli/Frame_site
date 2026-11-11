import { createHash } from "node:crypto";
import { redis } from "@/lib/ratelimit";
import { linkContatti, rileva, valuta, type Voce } from "./analisi";
import { ErroreCheckup, normalizzaUrl, scaricaPagina, type Pagina } from "./rete";

// Check-up orchestrator: home page, contact page, 5 items, 1-hour cache of the result only (never the HTML).

/** Total budget for the two pages; the route allows 30 s (maxDuration). */
const SCADENZA_MS = 18_000;
const CACHE_TTL_S = 3600;
const PERCORSI_CONTATTI = ["/contatti", "/contact", "/contattaci"];

export interface RisultatoCheckup {
  punteggio: number;
  /** Final URL of the home page, after redirects. */
  sito: string;
  wordpress: boolean;
  paginaContatti: string | null;
  voci: Voce[];
  /** ISO time of the analysis (a cached result keeps its time). */
  analizzatoIl: string;
}

export { ErroreCheckup, normalizzaUrl };

function chiaveCache(url: URL): string {
  return `checkup:v1:${createHash("sha256").update(url.href).digest("hex")}`;
}

async function daCache(url: URL): Promise<RisultatoCheckup | null> {
  if (!redis) return null;
  try {
    return (await redis.get<RisultatoCheckup>(chiaveCache(url))) ?? null;
  } catch (err) {
    console.error("checkup: cache non leggibile", err instanceof Error ? err.message : err);
    return null;
  }
}

async function inCache(url: URL, risultato: RisultatoCheckup): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(chiaveCache(url), risultato, { ex: CACHE_TTL_S });
  } catch (err) {
    console.error("checkup: cache non scrivibile", err instanceof Error ? err.message : err);
  }
}

/** Contact page: the menu link first, then the usual paths. At most 3 attempts; failures are not errors. */
async function cercaContatti(home: Pagina, scadenza: AbortSignal): Promise<Pagina | null> {
  const candidati: URL[] = [];
  const dalMenu = linkContatti(home.html, home.url);
  if (dalMenu) candidati.push(dalMenu);
  for (const percorso of PERCORSI_CONTATTI) {
    const u = new URL(percorso, home.url);
    if (!candidati.some((c) => c.pathname.replace(/\/$/, "") === u.pathname)) candidati.push(u);
  }
  for (const url of candidati.slice(0, 3)) {
    if (scadenza.aborted) return null;
    try {
      return await scaricaPagina(url, scadenza);
    } catch (err) {
      // A forbidden address here means the site redirects to a private network: stop, do not retry.
      if (err instanceof ErroreCheckup && (err.codice === "indirizzo_vietato" || err.codice === "timeout")) return null;
    }
  }
  return null;
}

/** Runs the check-up on a normalized URL (see normalizzaUrl). Throws ErroreCheckup for unusable sites. */
export async function eseguiCheckup(url: URL, opzioni: { cache?: boolean } = {}): Promise<RisultatoCheckup & { daCache: boolean }> {
  const usaCache = opzioni.cache ?? true;
  if (usaCache) {
    const salvato = await daCache(url);
    if (salvato) return { ...salvato, daCache: true };
  }

  const scadenza = AbortSignal.timeout(SCADENZA_MS);
  const home = await scaricaPagina(url, scadenza);
  const contatti = await cercaContatti(home, scadenza);
  const rilevamenti = rileva(home, contatti);
  const { punteggio, voci } = valuta(rilevamenti);
  const risultato: RisultatoCheckup = {
    punteggio,
    sito: home.url.href,
    wordpress: rilevamenti.wordpress,
    paginaContatti: contatti?.url.href ?? null,
    voci,
    analizzatoIl: new Date().toISOString(),
  };
  if (usaCache) await inCache(url, risultato);
  return { ...risultato, daCache: false };
}
