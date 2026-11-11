import { parse, type HTMLElement } from "node-html-parser";
import { testiVoce } from "./testi";

// The 5 scored items of the check-up (docs/lancio/02-specifiche.md, section 5): 0-20 each, total 0-100.
// We read the HTML as served, without running JavaScript. Pure functions: no network here.

export type IdVoce = "contatto" | "fuori_orario" | "promessa" | "telefono" | "informativa";

export interface Voce {
  id: IdVoce;
  nome: string;
  punti: number;
  max: number;
  spiegazione: string;
  rimedio: string;
}

export interface Modulo {
  pagina: "home" | "contatti";
  campi: number;
  consenso: boolean;
}

/** What we found in the pages: the input of the scores and of the explanations. */
export interface Rilevamenti {
  tel: boolean;
  mailto: boolean;
  whatsapp: boolean;
  /** Contact forms written in the HTML (not search or newsletter forms). */
  moduli: Modulo[];
  /** Form loaded from a known provider (HubSpot, Typeform…), fields not readable. */
  moduloEsterno: string | null;
  chat: string[];
  /** Our own plugin is on the site. */
  plugin: boolean;
  promessa: boolean;
  orari: boolean;
  viewport: boolean;
  zoomBloccato: boolean;
  privacy: "footer" | "pagina" | null;
  wordpress: boolean;
  paginaContatti: boolean;
}

export const MAX_CAMPI_TELEFONO = 10;

const CHAT: [string, RegExp][] = [
  ["Tawk.to", /embed\.tawk\.to/i],
  ["Crisp", /client\.crisp\.chat/i],
  ["Tidio", /code\.tidio\.co|tidiochat/i],
  ["Intercom", /widget\.intercom\.io|intercomsettings/i],
  ["HubSpot", /js\.hs-scripts\.com|js\.usemessages\.com/i],
  ["Zendesk", /static\.zdassets\.com|zopim/i],
  ["LiveChat", /cdn\.livechatinc\.com/i],
  ["Messenger", /customerchat|\/\/m\.me\//i],
  ["Smartsupp", /smartsuppchat|smartsupp\.com/i],
  ["JivoChat", /code\.jivo(site)?\.(com|ru)/i],
  ["Chatwoot", /chatwoot/i],
  ["Brevo Conversations", /conversations-widget\.brevo\.com|conversations-widget\.sendinblue\.com/i],
  ["Freshchat", /wchat\.freshchat\.com/i],
];
const PLUGIN = /wpla-widget|wpla_config|wpla-lead-assistant|\/plugins\/wpla/i;
const WHATSAPP = /^(https?:\/\/)?(wa\.me|api\.whatsapp\.com|(web\.)?whatsapp\.com\/send)|^whatsapp:/i;
const MODULI_ESTERNI: [string, RegExp][] = [
  ["HubSpot Forms", /js\.hsforms\.net|hsforms\.com/i],
  ["Typeform", /typeform\.com/i],
  ["Jotform", /jotform\.(com|eu)/i],
  ["Google Moduli", /docs\.google\.com\/forms|forms\.gle/i],
  ["Tally", /tally\.so/i],
  ["Zoho Forms", /forms\.zohopublic/i],
];

// Response promise and opening hours, in Italian (heuristics, declared on the page).
const PROMESSA =
  /\b(rispond\w*|rispost\w*|ricontatt\w*|richiam\w*)\b[^.!?\n]{0,40}\bentro\b|\bentro\s+(le\s+)?(24|48|72|12|poche|un'?|una|1|2)\s*(h\b|ore\b|ora\b|giorn\w*|minut\w*)|\bin\s+giornata\b|\bentro\s+il\s+giorno\s+(lavorativo\s+)?successivo\b|\bentro\s+(fine\s+)?giornata\b/i;
const ORARI =
  /\borari\w*\s+(di\s+|d')?(apertura|ufficio|lavoro|servizio|negozio)\b|\borari\w*\s*:|\blun(edì|edi|\.)?\s*(-|–|—|a|al)\s*(ven|sab)|\bdal\s+luned[iì]\s+al\s+(venerd[iì]|sabato)\b|\b\d{1,2}[:.]\d{2}\s*(-|–|—|alle)\s*\d{1,2}[:.]\d{2}\b|\bdalle\s+(ore\s+)?\d{1,2}([:.]\d{2})?\s+alle\s+(ore\s+)?\d{1,2}/i;
const CONSENSO = /privacy|consenso|acconsent|gdpr|trattamento|accett|informativa/i;
const PAROLE_CONTATTI = /contatt|contact|scrivic|dove\s+siamo/i;

function radice(html: string): HTMLElement {
  return parse(html, { comment: false, blockTextElements: { script: true, style: true, noscript: true, pre: true } });
}

/** Visible text: scripts, styles and templates removed, spaces collapsed. */
export function testoVisibile(html: string): string {
  const r = radice(html);
  r.querySelectorAll("script, style, noscript, template, svg").forEach((n) => n.remove());
  return r.textContent.replace(/\s+/g, " ").trim();
}

function campiVisibili(form: HTMLElement): number {
  let n = 0;
  for (const el of form.querySelectorAll("input, select, textarea")) {
    if (el.tagName === "INPUT") {
      const tipo = (el.getAttribute("type") ?? "text").toLowerCase();
      if (["hidden", "submit", "button", "reset", "image", "checkbox", "radio"].includes(tipo)) continue;
    }
    // Honeypots usually say so in the markup.
    const segni = `${el.getAttribute("name") ?? ""} ${el.getAttribute("class") ?? ""} ${el.getAttribute("style") ?? ""}`;
    if (/honeypot|hp-|display:\s*none/i.test(segni) || el.getAttribute("tabindex") === "-1") continue;
    n++;
  }
  return n;
}

/** Contact forms only: a textarea, or an email/phone field with at least 3 visible fields. */
export function moduliContatto(html: string, pagina: Modulo["pagina"]): Modulo[] {
  const r = radice(html);
  const moduli: Modulo[] = [];
  for (const form of r.querySelectorAll("form")) {
    if ((form.getAttribute("role") ?? "").toLowerCase() === "search") continue;
    const campi = campiVisibili(form);
    const conTextarea = form.querySelector("textarea") !== null;
    const conEmail = form.querySelector('input[type="email"], input[type="tel"]') !== null ||
      /name=["'][^"']*(email|mail|telefono|phone)/i.test(form.toString());
    if (!conTextarea && !(conEmail && campi >= 3)) continue;
    const checkbox = form.querySelectorAll('input[type="checkbox"]');
    const consenso = checkbox.length > 0 && (CONSENSO.test(form.textContent) || checkbox.some((c) => CONSENSO.test(c.toString())));
    moduli.push({ pagina, campi, consenso });
  }
  return moduli;
}

function dentroFooter(el: HTMLElement): boolean {
  for (let p: HTMLElement | null = el.parentNode; p; p = p.parentNode) {
    if (p.tagName === "FOOTER") return true;
    const segni = `${p.getAttribute?.("id") ?? ""} ${p.getAttribute?.("class") ?? ""} ${p.getAttribute?.("role") ?? ""}`;
    if (/footer|contentinfo|colophon/i.test(segni)) return true;
  }
  return false;
}

function stessoSito(a: URL, b: URL): boolean {
  return a.hostname.replace(/^www\./, "") === b.hostname.replace(/^www\./, "");
}

/** First same-site link to a contact page, preferring the menu (header/nav). */
export function linkContatti(html: string, base: URL): URL | null {
  const r = radice(html);
  const ancore = r.querySelectorAll("a[href]");
  const candidati: { url: URL; menu: boolean }[] = [];
  for (const a of ancore) {
    const href = a.getAttribute("href") ?? "";
    if (/^(mailto|tel|javascript|whatsapp):/i.test(href) || href.startsWith("#")) continue;
    if (!PAROLE_CONTATTI.test(href) && !PAROLE_CONTATTI.test(a.textContent)) continue;
    let url: URL;
    try {
      url = new URL(href, base);
    } catch {
      continue;
    }
    url.hash = "";
    if (!stessoSito(url, base) || url.href === base.href) continue;
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    let menu = false;
    for (let p: HTMLElement | null = a.parentNode; p; p = p.parentNode) {
      if (p.tagName === "NAV" || p.tagName === "HEADER") {
        menu = true;
        break;
      }
    }
    candidati.push({ url, menu });
  }
  return (candidati.find((c) => c.menu) ?? candidati[0])?.url ?? null;
}

/** Everything we look for, from the home page and (if found) the contact page. */
export function rileva(home: { html: string; link: string }, contatti: { html: string } | null): Rilevamenti {
  const r = radice(home.html);
  const hrefs = r.querySelectorAll("a[href]").map((a) => (a.getAttribute("href") ?? "").trim());
  const tutto = home.html + (contatti?.html ?? "");

  const viewportMeta = r.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "";
  const scala = /maximum-scale\s*=\s*([\d.]+)/i.exec(viewportMeta);
  const zoomBloccato = /user-scalable\s*=\s*(no|0)\b/i.test(viewportMeta) || (scala !== null && Number(scala[1]) < 2);

  let privacy: Rilevamenti["privacy"] = null;
  for (const a of r.querySelectorAll("a[href]")) {
    if (/privacy/i.test(a.getAttribute("href") ?? "") || /privacy/i.test(a.textContent)) {
      if (dentroFooter(a)) {
        privacy = "footer";
        break;
      }
      privacy = "pagina";
    }
  }

  const testo = testoVisibile(home.html) + " " + (contatti ? testoVisibile(contatti.html) : "");
  const generatore = r.querySelector('meta[name="generator"]')?.getAttribute("content") ?? "";

  return {
    tel: hrefs.some((h) => /^tel:/i.test(h)),
    mailto: hrefs.some((h) => /^mailto:/i.test(h)),
    whatsapp: hrefs.some((h) => WHATSAPP.test(h)),
    moduli: [...moduliContatto(home.html, "home"), ...(contatti ? moduliContatto(contatti.html, "contatti") : [])],
    moduloEsterno: MODULI_ESTERNI.find(([, re]) => re.test(tutto))?.[0] ?? null,
    chat: [
      ...CHAT.filter(([, re]) => re.test(tutto)).map(([nome]) => nome),
      ...(/wa\.me\/|api\.whatsapp\.com|whatsapp\.com\/send/i.test(tutto) ? ["WhatsApp"] : []),
    ],
    plugin: PLUGIN.test(tutto),
    promessa: PROMESSA.test(testo),
    orari: ORARI.test(testo),
    viewport: /width\s*=\s*device-width/i.test(viewportMeta),
    zoomBloccato,
    privacy,
    wordpress:
      /\/wp-content\/|\/wp-includes\//i.test(home.html) || /wordpress/i.test(generatore) || /wp-json|api\.w\.org/i.test(home.link),
    paginaContatti: contatti !== null,
  };
}

/** The main form: the contact page one if there is one, else the home one. */
export function moduloPrincipale(r: Rilevamenti): Modulo | null {
  return r.moduli.find((m) => m.pagina === "contatti") ?? r.moduli[0] ?? null;
}

/** Points per item. Missing form costs points only in item 2: in items 4 and 5 that part is "not applicable". */
export function punteggi(r: Rilevamenti): Record<IdVoce, number> {
  const modulo = moduloPrincipale(r);
  const haModulo = modulo !== null || r.moduloEsterno !== null;

  const contatto = Math.min(20, (r.tel ? 8 : 0) + (r.mailto ? 6 : 0) + (r.whatsapp ? 6 : 0));
  const fuoriOrario = r.plugin ? 20 : (haModulo ? 10 : 0) + (r.chat.length > 0 ? 10 : 0);
  const promessa = (r.promessa ? 12 : 0) + (r.orari ? 8 : 0);
  const campiOk = modulo === null || modulo.campi <= MAX_CAMPI_TELEFONO;
  const telefono = (r.viewport ? 10 : 0) + (r.viewport && !r.zoomBloccato ? 5 : 0) + (campiOk ? 5 : 0);
  // A form from an external provider handles its own consent: we cannot read it, so no penalty.
  const consensoOk = modulo === null || modulo.consenso;
  const informativa = (r.privacy ? 10 : 0) + (consensoOk ? 10 : 0);

  return { contatto, fuori_orario: fuoriOrario, promessa, telefono, informativa };
}

const ORDINE: IdVoce[] = ["contatto", "fuori_orario", "promessa", "telefono", "informativa"];

export function valuta(r: Rilevamenti): { punteggio: number; voci: Voce[] } {
  const p = punteggi(r);
  const voci = ORDINE.map((id) => ({ id, max: 20, punti: p[id], ...testiVoce(id, r, p[id]) }));
  return { punteggio: voci.reduce((s, v) => s + v.punti, 0), voci };
}
