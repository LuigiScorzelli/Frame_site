import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import { BlockList, isIP, type LookupFunction } from "node:net";
import { Agent, fetch as undiciFetch } from "undici";

// Safe HTTP client for the check-up (docs/lancio/02-specifiche.md, sections 5 and 12).
// Only http(s) on ports 80/443, no private addresses (checked on the IP we actually connect to,
// so DNS rebinding does not pass), at most 3 redirects, 8 s per page, at most 1 MB read.

export const TIMEOUT_PAGINA_MS = 8_000;
export const MAX_REDIRECT = 3;
export const MAX_BYTE = 1_000_000;
const USER_AGENT = process.env.CHECKUP_USER_AGENT || "aiframe-checkup/1.0 (+https://www.aiframe.it/check-up)";

export type CodiceErrore =
  | "url_non_valido"
  | "indirizzo_vietato"
  | "irraggiungibile"
  | "timeout"
  | "non_html"
  | "troppi_redirect"
  | "errore_http";

/** Error with a code the route turns into a 400/422 with an Italian message. */
export class ErroreCheckup extends Error {
  constructor(
    public codice: CodiceErrore,
    messaggio?: string,
  ) {
    super(messaggio ?? codice);
    this.name = "ErroreCheckup";
  }
}

// ---------------------------------------------------------------------------------------------
// Forbidden addresses

const vietatiV4 = new BlockList();
for (const [rete, prefisso] of [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8], // private
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local, cloud metadata (169.254.169.254)
  ["172.16.0.0", 12], // private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // documentation
  ["192.88.99.0", 24], // 6to4 relay
  ["192.168.0.0", 16], // private
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // documentation
  ["203.0.113.0", 24], // documentation
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved, broadcast
] as const) {
  vietatiV4.addSubnet(rete, prefisso, "ipv4");
}

// IPv6: only global unicast (2000::/3) is allowed, minus the ranges below.
// Everything else (::, ::1, fc00::/7, fe80::/10, ff00::/8, 64:ff9b::/96 NAT64, ::ffff:0:0/96) is outside 2000::/3.
const globaliV6 = new BlockList();
globaliV6.addSubnet("2000::", 3, "ipv6");
const vietatiV6 = new BlockList();
for (const [rete, prefisso] of [
  ["2001::", 32], // Teredo: embeds an IPv4 address
  ["2001:db8::", 32], // documentation
  ["2002::", 16], // 6to4: embeds an IPv4 address
] as const) {
  vietatiV6.addSubnet(rete, prefisso, "ipv6");
}

/** IPv4 embedded in an IPv4-mapped IPv6 address (::ffff:a.b.c.d or ::ffff:7f00:1), else null. */
function ipv4Mappato(ip: string): string | null {
  const m = /^::ffff:(?:0:)?(.+)$/i.exec(ip);
  if (!m) return null;
  if (isIP(m[1]) === 4) return m[1];
  const esa = /^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(m[1]);
  if (!esa) return null;
  const alto = parseInt(esa[1], 16);
  const basso = parseInt(esa[2], 16);
  return `${alto >> 8}.${alto & 255}.${basso >> 8}.${basso & 255}`;
}

/** True for every address the check-up must never connect to. Unknown formats are forbidden too. */
export function ipVietato(ip: string): boolean {
  const pulito = ip.replace(/^\[|\]$/g, "").split("%")[0];
  const tipo = isIP(pulito);
  if (tipo === 4) return vietatiV4.check(pulito, "ipv4");
  if (tipo === 6) {
    const v4 = ipv4Mappato(pulito);
    if (v4) return ipVietato(v4);
    return !globaliV6.check(pulito, "ipv6") || vietatiV6.check(pulito, "ipv6");
  }
  return true;
}

// ---------------------------------------------------------------------------------------------
// URL

const HOST_VIETATI = /(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain)$/i;

/**
 * Checks a URL before any request: http(s) only, default ports, no credentials, no internal names,
 * no forbidden IP literals. Used for the visitor's URL and for every redirect target.
 */
export function controllaUrl(url: URL): void {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ErroreCheckup("url_non_valido", "Solo indirizzi http o https.");
  }
  if (url.username || url.password) throw new ErroreCheckup("url_non_valido", "Indirizzo con credenziali.");
  // URL drops the default port, so any explicit port is a non-standard one.
  if (url.port !== "") throw new ErroreCheckup("url_non_valido", "Porta non standard.");
  const host = url.hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (!host) throw new ErroreCheckup("url_non_valido", "Indirizzo senza dominio.");
  if (isIP(host)) {
    // The DNS lookup is skipped for IP literals, so they are checked here.
    if (ipVietato(host)) throw new ErroreCheckup("indirizzo_vietato");
    return;
  }
  if (HOST_VIETATI.test(host) || !host.includes(".")) throw new ErroreCheckup("indirizzo_vietato");
}

/** Visitor input → URL to analyse. Adds https:// when the scheme is missing; drops the fragment. */
export function normalizzaUrl(input: string): URL {
  const testo = input.trim();
  if (!testo || testo.length > 2048) throw new ErroreCheckup("url_non_valido");
  const conSchema = /^[a-z][a-z0-9+.-]*:/i.test(testo) && !/^[^/:]+:\d+(\/|$)/.test(testo) ? testo : `https://${testo}`;
  let url: URL;
  try {
    url = new URL(conSchema);
  } catch {
    throw new ErroreCheckup("url_non_valido");
  }
  url.hash = "";
  controllaUrl(url);
  return url;
}

// ---------------------------------------------------------------------------------------------
// DNS check at connect time

/**
 * DNS lookup that resolves all addresses and refuses the host if any of them is forbidden.
 * undici calls it for every new connection, redirects included.
 */
export const lookupSicuro: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { all: true, verbatim: true }, (err, indirizzi: LookupAddress[]) => {
    if (err) return callback(err, "", 4);
    if (indirizzi.length === 0 || indirizzi.some((a) => ipVietato(a.address))) {
      return callback(new ErroreCheckup("indirizzo_vietato"), "", 4);
    }
    const famiglia = options.family === 4 || options.family === 6 ? options.family : 0;
    const ammessi = famiglia ? indirizzi.filter((a) => a.family === famiglia) : indirizzi;
    if (ammessi.length === 0) return callback(new ErroreCheckup("irraggiungibile"), "", 4);
    if (options.all) {
      (callback as unknown as (e: null, a: LookupAddress[]) => void)(null, ammessi);
    } else {
      callback(null, ammessi[0].address, ammessi[0].family);
    }
  });
};

const agente = new Agent({
  connect: { lookup: lookupSicuro, timeout: TIMEOUT_PAGINA_MS },
  headersTimeout: TIMEOUT_PAGINA_MS,
  bodyTimeout: TIMEOUT_PAGINA_MS,
});

// ---------------------------------------------------------------------------------------------
// Download

export interface Pagina {
  /** Final URL after redirects. */
  url: URL;
  html: string;
  /** Value of the `link` response header (WordPress announces wp-json there). */
  link: string;
  troncata: boolean;
}

/** Walks the cause chain of a fetch error to find our own error or a timeout. */
function traduciErrore(err: unknown): ErroreCheckup {
  let e: unknown = err;
  for (let i = 0; i < 5 && e; i++) {
    if (e instanceof ErroreCheckup) return e;
    if (e instanceof Error) {
      if (e.name === "TimeoutError" || e.name === "AbortError") return new ErroreCheckup("timeout");
      const codice = (e as { code?: string }).code;
      if (codice === "UND_ERR_CONNECT_TIMEOUT" || codice === "UND_ERR_HEADERS_TIMEOUT" || codice === "UND_ERR_BODY_TIMEOUT") {
        return new ErroreCheckup("timeout");
      }
      e = (e as { cause?: unknown }).cause;
    } else break;
  }
  return new ErroreCheckup("irraggiungibile");
}

function charsetDa(contentType: string): string {
  const m = /charset=["']?([\w-]+)/i.exec(contentType);
  return m ? m[1].toLowerCase() : "utf-8";
}

async function leggiCorpo(corpo: ReadableStream<Uint8Array> | null, charset: string): Promise<{ testo: string; troncata: boolean }> {
  if (!corpo) return { testo: "", troncata: false };
  const lettore = corpo.getReader();
  const pezzi: Uint8Array[] = [];
  let totale = 0;
  let troncata = false;
  while (true) {
    const { done, value } = await lettore.read();
    if (done) break;
    const resto = MAX_BYTE - totale;
    if (value.byteLength >= resto) {
      pezzi.push(value.subarray(0, resto));
      totale += resto;
      troncata = true;
      await lettore.cancel().catch(() => {});
      break;
    }
    pezzi.push(value);
    totale += value.byteLength;
  }
  const buffer = Buffer.concat(pezzi, totale);
  let decoder: TextDecoder;
  try {
    decoder = new TextDecoder(charset);
  } catch {
    decoder = new TextDecoder("utf-8");
  }
  return { testo: decoder.decode(buffer), troncata };
}

/**
 * GET of one HTML page with all the guards. `scadenza` is the shared deadline of the whole check-up.
 */
export async function scaricaPagina(input: URL, scadenza?: AbortSignal): Promise<Pagina> {
  let url = new URL(input.href);
  const segnale = scadenza
    ? AbortSignal.any([AbortSignal.timeout(TIMEOUT_PAGINA_MS), scadenza])
    : AbortSignal.timeout(TIMEOUT_PAGINA_MS);

  for (let salti = 0; ; salti++) {
    controllaUrl(url);
    let risposta;
    try {
      risposta = await undiciFetch(url.href, {
        method: "GET",
        redirect: "manual",
        dispatcher: agente,
        signal: segnale,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
          "accept-language": "it-IT,it;q=0.9,en;q=0.5",
        },
      });
    } catch (err) {
      throw traduciErrore(err);
    }

    if (risposta.status >= 300 && risposta.status < 400 && risposta.headers.get("location")) {
      await risposta.body?.cancel().catch(() => {});
      if (salti >= MAX_REDIRECT) throw new ErroreCheckup("troppi_redirect");
      try {
        url = new URL(risposta.headers.get("location")!, url);
      } catch {
        throw new ErroreCheckup("irraggiungibile");
      }
      url.hash = "";
      continue;
    }

    if (!risposta.ok) {
      await risposta.body?.cancel().catch(() => {});
      throw new ErroreCheckup("errore_http", String(risposta.status));
    }
    const tipo = risposta.headers.get("content-type") ?? "";
    if (tipo && !/text\/html|application\/xhtml\+xml/i.test(tipo)) {
      await risposta.body?.cancel().catch(() => {});
      throw new ErroreCheckup("non_html");
    }
    try {
      const { testo, troncata } = await leggiCorpo(risposta.body as ReadableStream<Uint8Array> | null, charsetDa(tipo));
      return { url, html: testo, link: risposta.headers.get("link") ?? "", troncata };
    } catch (err) {
      throw traduciErrore(err);
    }
  }
}
