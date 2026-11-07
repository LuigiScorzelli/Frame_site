import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting for the public API routes (docs/lancio/02-specifiche.md, section 7).
// Upstash Redis when configured; otherwise an in-memory sliding window per instance.
// The key is always a salted SHA-256 hash of the client IP: the IP never reaches logs or Redis.

type Durata = `${number} s` | `${number} m` | `${number} h`;

export interface RisultatoLimite {
  ok: boolean;
  limite: number;
  rimanenti: number;
  /** Unix ms when the window frees a slot. */
  reset: number;
}

interface Limitatore {
  limita(chiave: string): Promise<RisultatoLimite>;
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = UPSTASH_URL && UPSTASH_TOKEN ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN }) : null;

let avvisoMostrato = false;

function msDa(durata: Durata): number {
  const [n, unita] = durata.split(" ");
  const k = unita === "h" ? 3_600_000 : unita === "m" ? 60_000 : 1_000;
  return Number(n) * k;
}

function limitatoreInMemoria(richieste: number, finestra: Durata): Limitatore {
  const ms = msDa(finestra);
  const colpi = new Map<string, number[]>();
  return {
    async limita(chiave) {
      const ora = Date.now();
      const recenti = (colpi.get(chiave) ?? []).filter((t) => t > ora - ms);
      const ok = recenti.length < richieste;
      if (ok) recenti.push(ora);
      colpi.set(chiave, recenti);
      // Keep the map bounded on long-lived instances.
      if (colpi.size > 10_000) {
        for (const [k, v] of colpi) if (v.every((t) => t <= ora - ms)) colpi.delete(k);
      }
      return {
        ok,
        limite: richieste,
        rimanenti: Math.max(0, richieste - recenti.length),
        reset: (recenti[0] ?? ora) + ms,
      };
    },
  };
}

/** One limiter per route, as in the spec: `creaLimitatore("newsletter", 5, "60 s")`. */
export function creaLimitatore(nome: string, richieste: number, finestra: Durata): Limitatore {
  if (redis) {
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(richieste, finestra),
      prefix: `ratelimit:${nome}`,
      analytics: false,
    });
    return {
      async limita(chiave) {
        const r = await rl.limit(chiave);
        return { ok: r.success, limite: r.limit, rimanenti: r.remaining, reset: r.reset };
      },
    };
  }
  if (!avvisoMostrato) {
    console.warn("ratelimit: Upstash non configurato, limite solo per istanza");
    avvisoMostrato = true;
  }
  return limitatoreInMemoria(richieste, finestra);
}

/** First x-forwarded-for value (Vercel sets it), then x-real-ip. */
export function ipDa(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Salted SHA-256 of the IP. Use it as rate-limit key and in logs; never log the raw IP. */
export function hashIp(ip: string): string {
  const sale = process.env.RATELIMIT_SALT || "aiframe-ratelimit";
  return createHash("sha256").update(`${sale}:${ip}`).digest("hex");
}

/** Checks the limit for the request's IP. Fails open if Redis is unreachable, logging the error. */
export async function controllaLimite(limitatore: Limitatore, request: Request): Promise<RisultatoLimite> {
  try {
    return await limitatore.limita(hashIp(ipDa(request)));
  } catch (err) {
    console.error("ratelimit: errore del limitatore, richiesta lasciata passare", err instanceof Error ? err.message : err);
    return { ok: true, limite: 0, rimanenti: 0, reset: Date.now() };
  }
}

/** Standard headers for a 429 response. */
export function intestazioniLimite(r: RisultatoLimite): Record<string, string> {
  return {
    "Retry-After": String(Math.max(1, Math.ceil((r.reset - Date.now()) / 1000))),
    "X-RateLimit-Limit": String(r.limite),
    "X-RateLimit-Remaining": String(r.rimanenti),
  };
}
