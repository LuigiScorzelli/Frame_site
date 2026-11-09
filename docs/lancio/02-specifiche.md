# Specifiche tecniche

Riferimento per le sessioni che implementano `01-piano-sprint.md`. Stack invariato: Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Vercel.

## 1. Architettura

```
Visitatore ─▶ aiframe.it (Next.js su Vercel: pagine statiche/ISR, blog MDX, calcolatore, check-up)
   Installa gratis   ─▶ WordPress.org (quando WPORG_URL è valorizzato) | /api/wpla/download (beta)
   Prova / account   ─▶ Freemius (checkout in overlay, portale cliente)        [sprint 2-3]
   Prenota           ─▶ Calendly
   Email / check-up  ─▶ Brevo (liste, doppio opt-in, sequenze)
   Modulo contatti   ─▶ Resend ─▶ casella aiframe
   Rate limit        ─▶ Upstash Redis
   Misura            ─▶ Vercel Analytics (pagine + eventi)
Plugin nel WP del cliente ─▶ update.json (beta) | WordPress.org (gratis) | Freemius SDK (a pagamento)
```

Il sito non ha database proprio, non ha utenti, non ha sessioni. Tutto lo stato vive nei servizi.

## 2. Struttura del repository (dopo lo sprint 0)

```
aiframe/
  content/articoli/*.mdx          articoli del blog (frontmatter sotto)
  public/wpla/                    zip beta + update.json (invariato, letto dal plugin)
  public/llms.txt
  public/risorse/*.pdf            checklist e materiali scaricabili (sprint 2)
  src/lib/brand.ts                costanti di brand e link esterni
  src/lib/content.ts              lettura MDX (lista, per slug, categorie)
  src/lib/ratelimit.ts            Upstash con fallback in memoria
  src/lib/brevo.ts                client minimo (createContact con doubleOptIn)
  src/lib/analytics.ts            nomi degli eventi tipizzati + helper track()
  src/lib/checkup/                analizzatore del sito (sprint 1)
  src/app/(pagine)/...            home, plugin, check-up, servizi, risorse, privacy, contatti
  src/app/api/contact|newsletter|checkup|wpla/download
```

Da rimuovere: `src/lib/strapi.ts`, i tipi Strapi in `src/lib/types.ts`, le route `/blog*` (sostituite da redirect), `src/app/amazon-seo` dal menu (file può restare), `ChatWidget`, `CalendarPicker` quando Calendly è attivo.

## 3. `src/lib/brand.ts`

```ts
export const AGENCY_NAME = "aiframe";
export const PLUGIN_NAME = process.env.NEXT_PUBLIC_PLUGIN_NAME ?? "Lead Assistant"; // provvisorio
export const CONTACT_EMAIL = "info@aiframe.it";
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";   // vuoto → modulo contatti
export const WPORG_URL = process.env.NEXT_PUBLIC_WPORG_URL ?? "";         // vuoto → download beta
export const ACCOUNT_URL = process.env.NEXT_PUBLIC_ACCOUNT_URL ?? "";     // portale Freemius, sprint 2
export const BETA_DOWNLOAD_PATH = "/api/wpla/download";
```
Regola: nessun componente scrive il nome del plugin o un link esterno a mano.

## 4. Variabili d'ambiente (`.env.example` da aggiornare)

| Variabile | Uso | Sprint |
| --- | --- | --- |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | già presenti | 0 |
| `RESEND_FROM` | es. `aiframe <noreply@aiframe.it>` (dominio verificato) | 0 |
| `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `BREVO_REDIRECT_URL` | iscrizioni con doppio opt-in | 0 |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | rate limit (Marketplace Vercel, piano gratuito) | 0 |
| `NEXT_PUBLIC_PLUGIN_NAME`, `NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_WPORG_URL`, `NEXT_PUBLIC_ACCOUNT_URL` | brand e link | 0-3 |
| `CHECKUP_USER_AGENT` | identificazione onesta del check-up (es. `aiframe-checkup/1.0 (+https://aiframe.it/check-up)`) | 1 |
| `FREEMIUS_*` | solo se il backend AI verifica le licenze | 3 |

Via: `STRAPI_URL`, `STRAPI_API_TOKEN`.

## 5. Route API

### `GET /api/wpla/download`
- Legge `public/wpla/update.json`, ricava il nome file dal campo `package`, serve lo zip da `public/wpla/` con `Content-Type: application/zip` e `Content-Disposition: attachment`.
- Rate limit: 20/ora per IP. Logga `{ts, version, ua (troncato), referer}` senza IP in chiaro (hash).
- Non tocca `update.json`: il plugin installato continua ad aggiornarsi dall'URL diretto dello zip. Il conteggio dei download riguarda solo i clic dal sito.
- Evento lato client `download_beta` sul clic (il server non può mandare eventi Vercel Analytics del browser).

### `POST /api/newsletter`
- Body: `{ email, fonte: "newsletter" | "checkup" | "beta", consenso: true }`.
- Validazione; rate limit 5/min per IP; Brevo `POST /v3/contacts/doubleOptinConfirmation` con `includeListIds=[BREVO_LIST_ID]`, `templateId`, `redirectionUrl`, `attributes: { FONTE, SITO? }`.
- Risposte: 200 `{ ok: true }` (anche se il contatto esiste già); 400 input; 429; 503 se Brevo non è configurato (`{ error: "Iscrizioni non ancora attive" }`).
- Niente email a Luigi per ogni iscrizione: lo vede in Brevo.

### `POST /api/contact`
- Come oggi, più: rate limit Upstash; `from` da `RESEND_FROM`; `reply_to` = email del visitatore; campo honeypot `sito_web` (se pieno, 200 silenzioso). Se Calendly è attivo, i campi data/orario spariscono dal modulo e dalla validazione.

### `POST /api/checkup` (sprint 1)
- Body `{ url, email? }`. Normalizza l'URL, consente solo `http(s)`, risolve l'host e **rifiuta IP privati/loopback/link-local** (SSRF), segue al massimo 3 redirect, timeout 8 s, legge al massimo 1 MB per pagina, `User-Agent` dichiarato.
- Scarica la home e prova `/contatti`, `/contact`, `/contattaci` e il primo link del menu che contiene "contatt".
- Cinque voci, ciascuna 0-20 punti, con una riga di spiegazione:
  1. **Contatto in un clic**: `tel:` o `mailto:` o link WhatsApp visibili nell'HTML della home.
  2. **Scrivere fuori orario**: presenza di un form (`<form>` con input email/textarea), una chat (script noti: tawk, crisp, tidio, intercom, hubspot, wa.me, messenger) o del plugin stesso.
  3. **Promessa di risposta**: testo con "rispondiamo entro", "entro 24 ore", "orari", "lun-ven" ecc. nella home o nella pagina contatti.
  4. **Da telefono**: `viewport` presente, nessun `user-scalable=no`, form senza campi > 10 (euristica dichiarata).
  5. **Informativa chiara**: link con "privacy" nel footer e checkbox di consenso nel form.
- Risposta `{ punteggio, voci: [{nome, punti, max, spiegazione}], sito, wordpress: boolean }` (`wordpress` = presenza di `/wp-content/` o header `link` a `wp-json`).
- Se `email`: contatto Brevo (`FONTE=checkup`, `SITO=url`) e report HTML via Resend al visitatore con le 3 voci più basse e il rimedio. Niente PDF nella v1.
- Rate limit 10/ora per IP; cache del risultato per URL per 1 ora (Upstash) per non analizzare lo stesso sito dieci volte.
- Il check-up non salva l'HTML dei siti: solo il punteggio aggregato anonimo per statistiche (`checkup:stats` in Redis), se serve.

## 6. Blog in MDX

Frontmatter obbligatorio:
```yaml
titolo: "..."
descrizione: "..."          # 140-160 caratteri, usata come meta description
data: 2026-11-17
categoria: richieste-perse  # richieste-perse | sito-crm | ai-onesta | privacy | bottega
tempoLettura: 7
cover: /images/articoli/slug.jpg   # opzionale
bozza: false                # true = non pubblicato in produzione
```
`src/lib/content.ts`: `getArticoli({categoria?})` ordinati per data, `getArticolo(slug)`, `getCategorie()`. Compilazione con `next-mdx-remote` o `@next/mdx` (scegliere una, documentare). Componenti MDX consentiti: titoli, paragrafi, liste, tabelle, immagini (`next/image`), blocco "Nota" e blocco "CTA installa". Redirect 301 `/blog` → `/risorse`, `/blog/:slug` → `/risorse/:slug` in `next.config.ts`.

## 7. Rate limit (`src/lib/ratelimit.ts`)
`@upstash/ratelimit` con `Ratelimit.slidingWindow(n, "60 s")`, un'istanza per route. Se le variabili mancano: `Map` in memoria + `console.warn("ratelimit: Upstash non configurato, limite solo per istanza")`. Chiave: hash SHA-256 dell'IP (`x-forwarded-for` primo valore) con un sale fisso in env, mai l'IP in chiaro nei log.

## 8. Eventi (`src/lib/analytics.ts`)
```ts
export type Evento =
  | "click_installa" | "download_beta" | "checkup_start" | "checkup_done" | "checkup_email"
  | "newsletter_ok" | "click_prova" | "click_prenota" | "click_account" | "download_checklist";
export function traccia(e: Evento, props?: Record<string, string | number>) { track(e, props); }
```
Proprietà consentite: `pagina`, `posizione` (hero, chiusura, menu, footer, pagina, widget), `fonte`. Mai email o URL del visitatore nelle proprietà.

## 9. Calcolatore "quanto costa una richiesta persa" (client)
Input: `richieste_settimana` (default 10), `percentuale_fuori_orario` (default: valore del test dei 30 siti, finché non c'è 40 con etichetta "stima"), `valore_cliente` (default 150 €), `tasso_chiusura` (default 30%, modificabile in "avanzate").
Formula dichiarata sotto il risultato: `perse_mese = richieste_settimana × 4,33 × fuori_orario% × 0,5` (ipotesi: metà delle richieste senza risposta entro il mattino dopo va altrove) → `euro_mese = perse_mese × tasso_chiusura × valore_cliente`. Tutti i coefficienti visibili e modificabili. Nessuna chiamata di rete.

## 10. SEO e dati strutturati
- `metadata` per pagina con i titoli di `03-contenuti.md`; `openGraph` con immagine per pagina.
- JSON-LD: `Organization` (aiframe) nel layout; `SoftwareApplication` in `/plugin` (`applicationCategory: BusinessApplication`, `operatingSystem: WordPress`, `offers.price: 0`); `Article` negli articoli; `FAQPage` in `/plugin`.
- `public/llms.txt`: una riga per pagina con descrizione; aggiornare con gli articoli.
- `sitemap.ts` include articoli non bozza.

## 11. Freemius (sprint 2-3, solo riferimento)
- Nel repo del plugin: SDK Freemius in `vendor/freemius`, inizializzato con `is_premium` separato, opt-in esplicito, `has_addons`/`has_premium_version` secondo il modello scelto (plugin gratuito su WordPress.org + componente premium scaricato da Freemius).
- Nel sito: il checkout si apre con lo script di Freemius in overlay dalla pagina `/servizi` (pulsante "Prova 30 giorni" → `click_prova`); link "Il mio account" → `ACCOUNT_URL`.
- Se il backend AI è gestito da aiframe: verifica licenza con l'API Freemius (`/v1/plugins/{id}/licenses/{key}.json` o endpoint equivalente), cache 1 ora, rifiuto con messaggio chiaro nel plugin.
- Da confermare prima di iniziare: percentuali, tempi di payout, compatibilità SDK con le linee guida WordPress.org, fattura mensile al merchant of record (commercialista).

## 12. Sicurezza e privacy, in breve
- Nessun dato personale nei log; IP sempre hash.
- `Content-Security-Policy` di base nel `next.config.ts` (self, Vercel Analytics, Calendly, Freemius checkout, Brevo).
- Il check-up è un client HTTP verso siti terzi: SSRF bloccato, timeout, limite di dimensione, UA dichiarato, nessuna memorizzazione dell'HTML.
- Consenso esplicito (checkbox non preselezionata) su ogni modulo che manda dati a Brevo.

## 13. Test minimi
Nessun framework oggi. Per lo sprint 0 bastano: `npm run build`, controllo manuale delle route API con `curl` (casi 200/400/429/503), Lighthouse su home e /plugin. Sprint 1: Vitest per `src/lib/checkup/` (10 HTML di esempio in `fixtures/`) e per il calcolatore.
