# Decisioni tecniche

Registro delle scelte prese durante l'implementazione, con il motivo. Una voce per decisione, la più recente in fondo.

## 2026-11-07 · Blog in MDX con `next-mdx-remote` (voce 0.6)

**Scelta:** `next-mdx-remote` 6 (API `next-mdx-remote/rsc`) + `gray-matter` per il frontmatter + `remark-gfm` per le tabelle. Articoli in `aiframe/content/articoli/*.mdx`, lettore in `src/lib/content.ts`, componenti consentiti in `src/components/mdx/componenti.tsx`.

**Perché non `@next/mdx`:**
- `@next/mdx` tratta ogni `.mdx` come una pagina o un modulo da importare. Per avere elenco, filtri per categoria, sitemap e "prossimo articolo" servirebbe comunque leggere i file dal disco e un indice a mano, oppure `import()` dinamici con il frontmatter esportato come `export const`, che è meno leggibile per chi scrive gli articoli.
- Con `next-mdx-remote` i file restano contenuto puro (frontmatter YAML + testo), letti da `content.ts`: la stessa funzione serve `/risorse`, `/risorse/[slug]`, la sitemap e in futuro `llms.txt`.
- Non richiede di cambiare `next.config.ts` né `pageExtensions`, e funziona con i React Server Components: le pagine degli articoli sono generate statiche (`generateStaticParams`, `dynamicParams = false`).

**Regole implementate:**
- Slug = nome del file (solo minuscole, numeri e trattini).
- Frontmatter validato in `content.ts`: un campo mancante o sbagliato fa fallire la build, così un articolo rotto non va online.
- `bozza: true` → visibile solo in sviluppo (`next dev`), escluso in produzione da elenco, pagina, sitemap.
- Componenti MDX: titoli, paragrafi, liste, tabelle, immagini (`next/image`), `<Nota>`, `<CtaInstalla />`. `next-mdx-remote` 6 blocca le espressioni JavaScript nell'MDX per default.
- Redirect 301 (non 308) da `/blog` e `/blog/:slug` in `next.config.ts`.

## 2026-11-07 · Rate limit (voce 0.8)

`src/lib/ratelimit.ts`: `@upstash/ratelimit` + `@upstash/redis` con sliding window, un'istanza per route (contact 10/60 s, newsletter 5/60 s, download 20/ora). Le credenziali si leggono da `UPSTASH_REDIS_REST_URL`/`TOKEN` oppure, se mancano, da `KV_REST_API_URL`/`KV_REST_API_TOKEN` (i nomi creati dall'integrazione Upstash del Marketplace Vercel, aggiunto il 7/11). Senza nessuna delle due coppie usa una `Map` in memoria (limite per singola istanza) e scrive una volta `ratelimit: Upstash non configurato, limite solo per istanza`. La chiave è SHA-256 di `RATELIMIT_SALT:ip`; l'IP in chiaro non va né in Redis né nei log. Se Redis non risponde la richiesta passa (fail open) e l'errore va nei log: meglio un modulo senza limite per qualche minuto che un sito che rifiuta tutti.

## 2026-11-07 · Newsletter Brevo (voce 0.7)

`src/lib/brevo.ts` chiama `POST /v3/contacts/doubleOptinConfirmation` con `includeListIds`, `templateId`, `redirectionUrl` e gli attributi `FONTE` e, se presente, `INTERESSE` (es. `pro` dal modulo "Avvisami quando è disponibile"). Senza `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID` o `BREVO_REDIRECT_URL` la route risponde 503 `Iscrizioni non ancora attive`. Gli attributi `FONTE` e `INTERESSE` vanno creati in Brevo (Contatti → Impostazioni → Attributi, tipo testo) prima di attivare le variabili, altrimenti Brevo rifiuta la richiesta.

## 2026-11-07 · `/contatti` (voce 0.15)

Con `CALENDLY_URL` valorizzato (dal 9/11 costante in `brand.ts`) la pagina incorpora Calendly (widget inline, script caricato solo in quel caso). Senza, resta il modulo: nome, email, sito, messaggio, consenso, honeypot `sito_web`. Il calendario fatto in casa è stato tolto dal modulo: inviava "Call prenotata" senza che nessuna call fosse davvero in agenda.

## 2026-11-07 · Home di nuovo dell'agenzia (voci 0.2, 0.3)

**Decisione di Luigi:** la home `/` non è dedicata tutta al plugin. Presenta aiframe (cosa costruiamo, per chi, come lavoriamo, dati sotto controllo, chi siamo) con azione principale `Prenota 30 minuti` (`click_prenota`). Il plugin ha una fascia "Il nostro primo prodotto" con lo stato verificato della beta e `Installa gratis` → `/plugin` (`click_installa`, posizione `pagina`); marketing e contenuti del plugin stanno in `/plugin`.

**Menu e footer:** menu Servizi · Plugin · Check-up · Risorse con pulsante `Prenota 30 minuti`; colonna footer "Cosa facciamo". Etichetta dell'hero senza la città (richiesta di Luigi). Amazon SEO resta fuori dal menu.

**Perché:** il plugin ha già la sua pagina; una home tutta sul prodotto nascondeva l'agenzia, che è ciò che vende i servizi.

**Seguito (stesso giorno):** `/servizi` ora ha i progetti su misura dell'agenzia prima dei servizi del plugin (commit `43f2763`); in `/plugin` sono tornati "A che punto siamo", "Cosa succede ai dati dei tuoi clienti" e "Perché gratis?" (commit `faf088f`). "Come funziona" in 3 passi non è stato riportato: la procedura di installazione in `/plugin#installa` lo copre. Commit `742ca7e` (menu e footer) e `00b4740` (home) su `lancio-plugin`.

## 2026-11-07 · Email prima del download della beta (voce 0.4)

**Decisione di Luigi:** per scaricare la beta da `/plugin` serve l'email, per costruire una lista da fidelizzare. Il download parte subito dopo l'invio, senza aspettare la conferma: in lista entra solo chi conferma la mail di Brevo (`FONTE=beta`), ma nessuno resta bloccato.

**Come:** `InteresseForm` ha le prop `download` e `testoConsenso`; con `download`, dopo la risposta ok di `/api/newsletter` manda `newsletter_ok` e `download_beta` e avvia il file, con link di riserva se il browser non parte. La route del download non cambia.

**Limiti noti:** gli zip restano pubblici in `public/wpla/` perché servono agli aggiornamenti dei plugin installati: chi conosce l'indirizzo scarica senza email. Quando `WPORG_URL` è valorizzato il modulo sparisce e resta il pulsante WordPress.org. Il testo del consenso legato al download va fatto confermare al consulente privacy. La sequenza di benvenuto per `FONTE=beta` è la voce 2.4.

## 2026-11-07 · Logo FR>ME e grafica di produzione (voci 0.1, 0.3)

**Decisione di Luigi:** dopo aver visto la preview, la grafica della produzione resta. Il logo torna FR>ME (navbar con animazione glitch, footer grande, scritta di sfondo in "Chi siamo"); il nome nei testi e il dominio restano aiframe. Il logo passa solo da `LOGO_TEXT` in `brand.ts`.

**Home:** componenti in `src/components/sections/home/` con lo stile di `main` e i testi nuovi: hero a tutto schermo su 4 righe colorate con comparsa animata, fascia che scorre verde→azzurro (decorativa, `aria-hidden`), barra DATI/AI/SEC/OPS, "Cosa costruiamo" con le 3 foto di `public/images/servizi/` e le icone (le 4 voci sono diventate 3: collegamenti e strumenti su misura insieme), "Come lavoriamo" a schede con icone, fascia "Dati" con i bagliori, "Chi siamo" con i 4 valori. Torna `useInView`; `CtaButton` ha la variante `gradient`.

**Non riportato:** "I numeri parlano" (-40%, 30h/mese, +55%: numeri senza fonte). Al suo posto, nella fascia del plugin, le due prove della beta in stile schede numeriche. Nel footer niente social: GitHub `fr-me-agency` non esiste, X e gli altri non verificabili; restano email e sito personale finché Luigi non conferma i profili veri.

## 2026-11-07 · Pagine interne nello stile di produzione

**Richiesta di Luigi:** tutte le pagine con lo stile della home. Pezzi comuni: `PageHero` (testata con puntini, sfumature, H1 grande con comparsa CSS), `Section` larga 1440 px con titoli da 48 px e numero "01 / TAG", `Scheda` (riquadro icona, titolo, testo, etichette), icone in `src/components/ui/Icone.tsx`, CTA principale con variante `gradient`. Applicati a `/servizi`, `/plugin`, `/check-up`, `/risorse` e articoli, `/contatti`, `/privacy`, `/grazie`, 404. `/amazon-seo` già in stile, non toccata. Testi, link, eventi e moduli invariati, salvo la descrizione meta di `/plugin`: "dati in Europa" tolto, non più vero con la chiave AI del cliente.

## 2026-11-09 · Chat widget: resta e va rivisto (voce 0.14)

**Decisione di Luigi:** il `ChatWidget` (oggi in home e `/plugin`) non si toglie dal sito: va rivisto. La voce 0.14 "widget rimosso" è superata. Cosa cambiare nel widget (testi, opzioni, stile, eventuale collegamento alla versione web del plugin) è da definire.

**Revisione approvata da Luigi lo stesso giorno:** il widget resta un menu di scorciatoie, non una chat. Testata "Come possiamo aiutarti". Opzioni, come link tracciati (`TrackedLink`): **Prenota 30 minuti** → `BOOKING_URL` (`click_prenota`, in evidenza), **Installa [NOME], è gratis** → `INSTALL_PATH` (`click_installa`), **check-up** → `/check-up`, **email** → mailto. Tolti "Richiedi un preventivo" (contraddice "niente prezzi") e "Voglio automatizzare i miei processi" (doppione). Gli eventi hanno `posizione: "widget"` (nuovo valore in `analytics.ts` e `02-specifiche.md`) e `pagina` ricavata dall'indirizzo.

**Come:** l'opzione che porta alla pagina corrente non compare (le ancore come `/plugin#installa` sì); su `/plugin` "Installa" va per prima. Tolto da `/contatti`, resta sulle altre 8 pagine che lo montano. Accessibilità: `role="dialog"`, `aria-expanded`/`aria-controls` sul bottone, pannello `inert` da chiuso, Escape e clic fuori chiudono e il focus torna al bottone, icone SVG `aria-hidden` al posto delle emoji. L'anello pulsa 3 volte e poi si ferma; con `prefers-reduced-motion` non c'è. Su mobile bottone da 48 px e pannello largo al massimo lo schermo meno 2 rem.

**Futuro:** quando esisterà la versione web del plugin, il widget potrà diventare la chat vera (demo del plugin dentro il pannello). Non fatto ora.

**Servizi esterni verificati da Luigi lo stesso giorno:** Calendly, Vercel e Brevo funzionano dal sito.

## 2026-11-09 · Assistente AI vero al posto del menu di scorciatoie (voce 0.14)

**Decisione di Luigi:** il `ChatWidget` (menu di scorciatoie) è sostituito dall'assistente vero, il widget standalone del plugin collegato al workflow n8n "WP Lead Assistant - Servizi" sulla VPS (`https://n8n.aiframe.it/webhook/wpla-chat`, tenant `aiframe`). Colore `#1E2D4A` (bg-2: con bg-0 il pulsante spariva sullo sfondo), etichetta "Hai domande? Chiedi all'assistente", tre domande suggerite. Configurazione in `ASSISTANT` di `src/lib/brand.ts`.

**Come:** `public/assistente/wpla-widget-<commit>.js` è una copia **non modificata** di `assisteAI_CRM/widget/src/wpla-widget.js` (commit nel nome, così la cache non serve una versione vecchia; esclusa da ESLint). Per aggiornarla: nuova copia con il nuovo commit nel nome, `scriptPath` in `brand.ts`, cancellare la vecchia. `AssistenteAI` è montato una volta in `layout.tsx` (`next/script`, `lazyOnload`) e imposta `window.WPLA_CONFIG`; la conversazione sopravvive al cambio pagina (`sessionStorage`). Privacy linkata in relativo (`/privacy`), così le anteprime usano la propria. `ChatWidget.tsx` resta nel repo, non montato: gli eventi `posizione: "widget"` non partono più.

**Guasti:** se n8n risponde 200 con corpo vuoto il widget mostra "In questo momento non riesco a rispondere", il modulo di contatto e `info@aiframe.it` (provato in locale simulando la risposta vuota).

**Origini:** il backend accetta solo origini esatte (`wpla_tenants.allowed_origins`): `www.aiframe.it`, `aiframe.it`, `localhost:3000`, l'alias Vercel del ramo `lancio-plugin`. Un nuovo dominio o alias va aggiunto lì, altrimenti risponde 403.

**`/privacy`:** nuova sezione "L'assistente di aiframe.it" (OpenAI negli USA, server Hostinger gestito da noi, email via Resend, HubSpot, registri n8n cancellati dopo 7 giorni). Nessun tempo di conservazione promesso per conversazioni e lead: la cancellazione automatica delle tabelle `wpla_*` non c'è ancora.

## 2026-11-09 · Link Calendly come costante, non variabile d'ambiente (voce 0.15)

**Decisione di Luigi:** `NEXT_PUBLIC_CALENDLY_URL` è tolta. Il link (`https://calendly.com/luigi-scorzelli/30min`) è in `CALENDLY_URL` di `src/lib/brand.ts`.

**Perché:** in produzione la variabile mancava al momento della build e tutti i "Prenota 30 minuti" portavano a `/contatti`. Il link non è un segreto (sta nell'HTML di ogni pagina), quindi non serve una variabile: una costante non può mancare in un ambiente. Per cambiarlo si modifica `brand.ts` e si fa un deploy.

## 2026-11-11 · Check-up v1 (voce 1.1)

**Piano approvato da Luigi l'11/11.** `POST /api/checkup` in `src/app/api/checkup/route.ts`, motore in `src/lib/checkup/` (`rete.ts` download sicuro, `analisi.ts` le 5 voci, `testi.ts` spiegazioni e rimedi, `report.ts` email, `index.ts` orchestrazione e cache), interfaccia in `src/components/ui/Checkup.tsx`.

**Librerie:** `undici` 7 (non l'8, che vuole Node ≥ 22.19) per collegare la verifica DNS alla connessione; `node-html-parser` per leggere l'HTML senza regex fragili; `vitest` 4 per i test (`npm test`, 69 test, HTML di esempio in `src/lib/checkup/fixtures/`).

**SSRF:** solo http/https su porte 80/443, niente credenziali né nomi interni; IP letterali controllati subito; per i nomi la `lookup` di undici risolve tutti gli indirizzi e rifiuta se anche uno è privato, loopback, link-local (metadati cloud), CGNAT, documentazione, multicast, IPv6 non globale, IPv4 mappato, 6to4/Teredo. Il controllo è sull'IP a cui ci colleghiamo davvero (niente DNS rebinding). Al massimo 3 redirect, ognuno ricontrollato. 8 s per pagina, 18 s in tutto, 1 MB letto, `User-Agent` da `CHECKUP_USER_AGENT`.

**Punteggio:** 5 voci da 0 a 20, totale 0-100, come in `02-specifiche.md`. Il modulo mancante pesa solo in "Scrivere fuori orario"; in "Da telefono" e "Informativa chiara" la parte sul modulo è "non applicabile" e prende i punti (detto nella spiegazione). Il nostro plugin sul sito vale 20 su "fuori orario". Si legge l'HTML senza eseguire JavaScript: lo diciamo sotto il risultato e nell'email.

**Email:** solo con email e consenso. Brevo con doppio opt-in, `FONTE=checkup`, `SITO=<host>`; finché l'attributo `SITO` non esiste in Brevo la route riprova senza `SITO` (avviso nei log). Report via Resend con le 3 voci più basse; il sito del visitatore è testo, non link. Se Brevo o Resend falliscono il risultato si mostra lo stesso, con l'esito in `email`.

**Limiti:** 10 check-up all'ora per IP, 3 email al giorno per indirizzo (hash), cache del solo risultato 1 ora in Upstash (`checkup:v1:<sha256 URL>`). `checkup:stats` non fatto. Gli eventi `checkup_start`/`checkup_done` partono sia dal calcolatore (come prima) sia dal check-up, che aggiunge `fonte: "checkup"`.

**Limiti noti visti nel test dei siti reali:** siti dietro Akamai Bot Manager (es. marchesi1824.com) chiudono la connessione al nostro user-agent dichiarato → 422; chat e widget caricati via JavaScript (anche l'assistente di aiframe.it, montato con `lazyOnload`) non si vedono.

## 2026-11-11 · Articoli sul piano del 10/11, firma e una CTA per articolo (voce 1.2)

**Decisione di Luigi:** la voce 1.2 segue il piano dei contenuti del 10/11 (Company Brain, `2026-11-10-strategia-comunicazione-frme/`), non la bozza del 5/11. L'articolo 1 è "Il percorso di una richiesta cliente, disegnato su un foglio" (testo v2 della sezione 1 di `marketing-settimana-1-contenuti-v2.md`, parole invariate tranne "oggi in beta" al posto di "oggi in beta privata": la beta si scarica da `/plugin`). L'articolo del test dei 30 siti non esce finché il test non ha i numeri. L'articolo 2 ("Cosa fa, e cosa non fa, un assistente AI…") ha solo la scaletta: la voce 1.2 si chiude quando esce anche lui.

**Firma (AV2):** `AUTORI` in `brand.ts`, campo facoltativo `autore` nel frontmatter, riga "di Luigi Scorzelli, AI Automation Engineer" sotto il titolo e pagina `/autore/luigi-scorzelli` con presentazione ed elenco degli articoli. Nel JSON-LD `Article` l'autore diventa `Person` (anticipa una parte della voce 1.4). Nei testi resta "aiframe" (regola del repo) finché la voce 124 del Company Brain (FR>ME) non viene portata qui.

**Una sola CTA per articolo (AV24, K49):** campo `cta` nel frontmatter (`checkup` | `installa` | `nessuna`, default `installa`, cioè il blocco di prima). L'articolo 1 chiude con "Fai il check-up" e il nuovo evento `click_checkup`.

**Filtri in `/risorse`:** `ElencoArticoli` lato client con `FilterTabs` (ora con `type="button"` e `aria-pressed`); i filtri compaiono solo con articoli in almeno due categorie.

**Bozze sulle anteprime:** da oggi `bozza: true` si vede anche sulle anteprime Vercel (`VERCEL_ENV=preview`, protette, pagina in `noindex`, esclusa dalla sitemap), non solo in sviluppo: serve a rileggere un articolo prima di pubblicarlo. In produzione resta nascosta.

**Pubblicazione:** riletto da Luigi sull'anteprima, pubblicato l'11/11 con data 11/11 (decisione di Luigi: oggi, non martedì 17/11 come nel piano). Va online con il merge su `main`, non c'è pubblicazione programmata.

## 2026-11-11 · Sfondi della home portati nelle pagine interne

**Richiesta di Luigi:** le pagine interne non continuavano lo stile della home, soprattutto negli sfondi; da riusare i due sfondi della home che piacciono: i bagliori di "Dati, sicurezza e controllo" e la scritta gigante di "Chi siamo".

**Diagnosi:** la griglia a puntini c'era già in `PageHero` e nell'hero della home, ma al 3% sotto un velo dell'80-100%: invisibile. Il carattere della home veniva da 4 elementi (fascia che scorre, foto, bagliori, scritta di sfondo) che le pagine interne non avevano; in più le `Section` interne avevano tutte lo stesso fondo.

**Fatto:**
- `src/components/ui/Sfondo.tsx`: `Puntini` (9%, sfumati con una maschera al posto del velo), `Bagliori` (disposizioni `fascia`, `hero`, `testata`), `ScrittaSfondo` (taglie `grande`, `media`). Sostituisce le copie a mano in Hero, PageHero, DatiBand, ChiSiamo, 404, articoli. `/amazon-seo` non toccata.
- `PageHero`: bagliori sempre, prop `parola` per la scritta di sfondo con la parola della pagina (SERVIZI, PLUGIN, CHECK-UP, RISORSE, CONTATTI, PRIVACY). FR>ME resta solo in "Chi siamo", per non mettere l'agenzia sopra il prodotto. `/grazie` e `/autore` senza parola.
- Hero della home con i bagliori.
- `Section tono="alterno"` (fondo `bg-1`) sulle sezioni pari di servizi, plugin, risorse, privacy. Le schede `bg-bg-1` dentro passano a `bg-0` con una regola non in layer in `globals.css` (dentro `@layer utilities` Tailwind v4 la scarta). Le sezioni con moduli (check-up, piano a pagamento di `/plugin`) restano `bg-0`: i loro campi `bg-0` sparirebbero.
- `FasciaPausa` (dal DatiBand): al massimo una per pagina; su `/plugin` è la sezione 3 "Privacy".
- "Come lavoriamo": emoji sostituite da icone SVG (`IconaLente`, `IconaScudo`, `IconaIngranaggio`, `IconaProvetta`).

**Regola:** bagliori negli hero e in una sola fascia pausa per pagina, altrimenti diventano carta da parati. Contrasto peggiore del testo `text-1` sopra i bagliori sovrapposti: 5,6:1.

**Da tenere presente:** se il video della voce 1.3 va nell'hero della home, i bagliori vanno spostati accanto o sotto.

**Aggiornamento 11/11, dopo l'anteprima (decisione di Luigi):** la scritta FR>ME non resta solo in "Chi siamo": va anche dietro "05 / Piano a pagamento" di `/plugin` e la newsletter di `/risorse` (prop `scritta` di `Section`). Le testate delle pagine tengono la parola della pagina. In home, "Cosa costruiamo" apre con "Collegamenti e strumenti su misura" nella scheda grande; "Automazioni dei flussi ripetitivi" passa nella prima laterale.

**Aggiornamento 11/11, seconda revisione dell'anteprima (decisione di Luigi):** in "Come lavoriamo" tornano le emoji colorate; le icone SVG lime sono tolte. La scheda grande di "Cosa costruiamo" ha testo più grande su desktop (titolo 28 px, testo 18 px).

## 2026-11-19 · iubenda (informativa e banner) e Freemius in sandbox

**Decisioni di Luigi (19/11):**
- Umami, Vercel Analytics e Speed Insights si caricano **solo dopo il consenso "Misurazione"** (finalità 4 di iubenda), anche se non usano cookie: il par. 7.2 delle linee guida del Garante per gli strumenti senza cookie resta aperto (D42). In `/privacy` non si scrive "banner non necessario".
- Calendly incorporato in `/contatti` **bloccato fino al consenso "Esperienza"** (finalità 3). Verificato il 19/11 con `curl` sulla pagina di embed: Calendly imposta `_calendly_session` e Cloudflare `__cf_bm` e `_cfuvid` sul dominio calendly.com. Senza consenso al posto del calendario c'è un riquadro con "Gestisci le preferenze", "Apri Calendly in una nuova scheda" e l'email.
- Checkout Freemius **solo su anteprime e in locale**: il pulsante "Prova 30 giorni" (evento `click_prova`) e `/api/freemius/sandbox` sono spenti con `VERCEL_ENV=production` anche se le variabili ci fossero. In produzione `/plugin` resta con "Avvisami".

**Come:**
- Pannello iubenda (19/11): sito `www.aiframe.it`, site ID 4768416, banner con consenso per finalità, pulsante "Rifiuta", codice di embed `embeds.iubenda.com/widgets/1a005c87-9c76-48e6-8a81-aa8280972fa4.js` (configurazione remota). Policy (cookiePolicyId 42824372) **non pubblicata**: serve una licenza a pagamento, finché manca le URL della policy rispondono 404.
- `src/lib/iubenda.ts`: `NEXT_PUBLIC_IUBENDA_WIDGET_ID` accende il banner; `NEXT_PUBLIC_IUBENDA_POLICY_ID` accende i link a privacy e cookie policy, da impostare solo dopo la pubblicazione. Senza widget niente banner e tutto si carica come prima.
- `src/components/consenso/Iubenda.tsx`: configurazione inline in `<head>` con le sole callback (scrivono la preferenza su `window` e lanciano l'evento `iubenda:consenso`), poi il widget con `next/script` `afterInteractive`. Nel `<head>`, come chiede iubenda, il suo blocco automatico riscrive script e link prima dell'idratazione: React error #418 e pagina ricostruita sul client (provato il 19/11). Dopo l'idratazione l'errore sparisce e il blocco automatico non serve, perché gli script soggetti a consenso li monta React.
- `src/lib/consenso.ts`: `useConsenso(finalità)` per i componenti React. Il blocco preventivo di iubenda (`type="text/plain"`) non è usato: gli script li monta React dopo il consenso.
- `src/components/consenso/Statistiche.tsx` sostituisce `<Analytics />`, `<SpeedInsights />` e lo script Umami nel layout. Gli eventi `traccia()` prima del consenso vanno persi, non si accodano.
- Footer: "Preferenze cookie" (classe `iubenda-cs-preferences-link`) con il banner, "Cookie policy" solo con la policy pubblicata. `/privacy`: elenco servizi con Vercel, Umami Cloud (regione UE, sub-responsabili anche negli USA), Brevo, Resend, Upstash, Calendly; sezione 5 con i link a privacy e cookie policy di iubenda.
- Freemius: `src/lib/freemius.ts`, `src/app/api/freemius/sandbox/route.ts` (firma `md5(ctx + product_id + secret_key + public_key + "checkout")`, la stessa di `@freemius/sdk` 0.5.0), `src/components/ui/ProvaFreemius.tsx` con `@freemius/checkout`. La chiave segreta è solo in `FREEMIUS_SECRET_KEY`. Dettagli del pannello in `freemius.md`.

**Provato in locale il 19/11** (build di produzione con il widget vero): prima della scelta riquadro al posto di Calendly e nessuna statistica; "Rifiuta" lascia tutto bloccato; dal riquadro "Gestisci le preferenze" apre il pannello; "Accetta tutto" + "Salva e continua" carica Calendly, Vercel Analytics e Speed Insights senza ricaricare; la scelta resta al ricaricamento. Umami non provato (parte solo su Vercel produzione).

**Provato sull'anteprima della PR il 19/11** (dopo il Redeploy con le variabili): stessi flussi ok; Vercel Analytics e Speed Insights caricati da percorsi offuscati dopo il consenso. Il consenso però si perdeva a ogni pagina: iubenda scrive il cookie sul dominio registrabile, che sulle anteprime è `.vercel.app` (suffisso pubblico, il browser lo rifiuta). Aggiunto `localConsentDomainExact: true`: cookie solo sull'host esatto; in produzione il sito vive solo su `www.aiframe.it`.

**Informativa iubenda (19/11, licenza Pro singola acquistata da Luigi):** pubblicata, privacy e cookie policy 42824372 rispondono 200. Servizi: Brevo email, Resend, Vercel, Calendly Widget, API di OpenAI (segnato come servizio IA, chatbot), HubSpot CRM, Hostinger dalla libreria; Umami Cloud e Upstash creati a mano (testi scritti dal codice: Upstash in `fra1`, impronte di IP ed email al massimo 24 ore, risultato del check-up 1 ora); clausole "Modulo di contatto" (nome, email, sito web) e "Mailing list o newsletter" (con sito web per il check-up). Nella cookie policy Calendly è sotto Esperienza e Umami sotto Misurazione, come nel codice. **Manca il Titolare** (nome e indirizzo): finché non c'è, `NEXT_PUBLIC_IUBENDA_POLICY_ID` resta vuota e il sito non linka l'informativa. Da verificare: luogo del server Hostinger (iubenda scrive "Hostinger UK Limited, Regno Unito").

**Limiti noti:** con iubenda attivo chi non sceglie nel banner non viene contato; i numeri di Umami da oggi non sono confrontabili con quelli di prima. Freemius non è ancora nell'elenco di `/privacy`: va aggiunto quando il checkout diventa pubblico (sprint 3, con il sì di Luigi).

## 2026-11-19 · Nome del plugin nel sito: inFrame

**Decisione di Luigi (19/11):** il plugin si chiama **inFrame** (stesso nome del prodotto Freemius, vedi `freemius.md`).

**Come:** `PLUGIN_NAME = "inFrame"` in `src/lib/brand.ts`, costante. `NEXT_PUBLIC_PLUGIN_NAME` è tolta da `.env.example`: come per `CALENDLY_URL`, un valore vecchio in un ambiente Vercel mostrerebbe un altro nome senza avvisi. Se la variabile è ancora impostata su Vercel non ha più effetto e si può cancellare.

**Non toccati:** il widget dell'assistente (`public/assistente/wpla-widget-*.js`), `public/wpla/update.json` e il riconoscimento del plugin nel check-up (`wpla-*` in `src/lib/checkup/analisi.ts`): dipendono dallo slug del plugin installato, che cambia con la voce 2.3 nel repo del plugin.

**In produzione dal 19/11, 15:48** (PR #14, merge `3ea2e5c`): verificato con `curl` su home, `/plugin`, `/servizi`, `/check-up`, `/privacy`, `/contatti`: "inFrame" presente, "Lead Assistant" assente.

## 2026-11-19 · iubenda in produzione senza informativa collegata

**Stato:** la PR #13 è su `main` (merge `b275042`) prima che arrivassero i dati del Titolare. In produzione il banner è attivo (`NEXT_PUBLIC_IUBENDA_WIDGET_ID` impostata, widget `1a005c87…` nella home), ma `NEXT_PUBLIC_IUBENDA_POLICY_ID` è vuota: il sito non linka privacy e cookie policy. Da oggi le statistiche contano solo chi accetta "Misurazione".

**Bloccato su:** dati del Titolare per iubenda (nome, indirizzo, P. IVA). Lo stesso dato chiude il `TODO:dato` della P. IVA in `Footer.tsx`.

**Decisione di Luigi (19/11):** il banner **resta attivo** in produzione anche senza informativa collegata, fino ai dati del Titolare. `NEXT_PUBLIC_IUBENDA_WIDGET_ID` non si tocca. (La sessione aveva proposto di spegnerlo finché manca l'informativa.)

**Quando arriva il Titolare:** inserirlo nel pannello iubenda, impostare `NEXT_PUBLIC_IUBENDA_POLICY_ID=42824372` su Vercel (Production), redeploy; P. IVA nel footer con un commit.

## 2026-11-19 · Assistente del sito in voce "noi"

**Problema** (esito Sprint 0, problema 1): il widget su ogni pagina parlava in prima persona singolare ("Sono l'assistente…", "non riesco a rispondere", "Non sono riuscito a inviare").

**Come:** nuova copia `public/assistente/wpla-widget-b4d6338-aa19d2e.js` = widget del plugin a `b4d6338` più **solo** i testi del commit `aa19d2e` di `assisteAI_CRM` (benvenuto, etichetta predefinita, errori in voce "noi"; consenso "ad aiframe"). `ASSISTANT.scriptPath` in `brand.ts` punta al nuovo file; il nome nuovo evita che i browser tengano in cache il vecchio.

**Perché non il widget di `main` del plugin:** da `b4d6338` a oggi `main` ha anche passaggio a WhatsApp, valutazione delle risposte, italiano/inglese e la rinomina inFrame (P6.6, P6.9, P6.8, P6.20). Sono funzioni nuove che parlano con il backend: vanno portate con una prova a parte sul workflow n8n del sito, non dentro una correzione di testi.

**Resta in prima persona:** le risposte generate dal workflow n8n "WP Lead Assistant - Servizi" sulla VPS, finché non si aggiorna il prompt lì (fuori da questo repo).

**Provato in locale il 19/11** (build di produzione): benvenuto "Questo è l'assistente… possiamo metterti in contatto"; con `fetch` bloccato nella pagina (nessuna richiesta al server n8n) l'errore è "non riusciamo a rispondere" e il consenso "trasmetteremo ad aiframe". Il widget salva la conversazione in `sessionStorage`: chi ha già una scheda aperta vede il vecchio benvenuto fino a una scheda nuova.

## 2026-11-19 · Open Graph e immagini di anteprima (voce 1.4)

**Piano approvato da Luigi il 19/11.** Prima nessuna pagina aveva `og:image` (LinkedIn mostrava il link senza immagine), le pagine con un `openGraph` proprio perdevano `og:site_name`, `og:locale` e `og:type` (Next.js sostituisce l'`openGraph` del layout invece di unirlo) e `twitter:card` era `summary`.

**Come:**
- `src/lib/seo.ts`: `metaSocial({ percorso, titolo, descrizione, tipo, pubblicato, autori, immaginePropria })` restituisce `openGraph` e `twitter` completi (`summary_large_image`). Lo usano tutte le pagine tranne `/amazon-seo`, che non è stata toccata.
- `src/lib/og.tsx`: `immagineSocial({ etichetta, titolo })`, 1200×630 nello stile del sito (fondo `bg-0`, bagliori lime e ciano, puntini, logo FR>ME, etichetta lime, titolo in Bricolage Grotesque 800). I font arrivano da Google Fonts in TTF, ridotti ai caratteri disegnati; se il download fallisce l'immagine esce con il font predefinito e un avviso `[og]` nei log. I puntini sono un pattern SVG: il renderer ignora i gradienti CSS ripetuti.
- File `opengraph-image.tsx`: sito (home e pagine senza immagine propria), `/plugin`, `/servizi`, `/check-up`, `/risorse`, ogni articolo (`/risorse/[slug]`, etichetta = categoria, titolo dal frontmatter). Tutte generate alla build. Un articolo nuovo ha la sua immagine senza fare niente.

**Da sapere:** un `openGraph.images` scritto nei metadati nasconde il file `opengraph-image.tsx` della stessa route, e senza `images` la pagina perde quella del sito: per questo l'URL è sempre esplicito (`immaginePropria: true` sulle route con il loro file). Il campo `cover` del frontmatter non è più usato per l'anteprima (nessun articolo lo aveva).

**Provato il 19/11** (build di produzione in locale): tag `og:*`, `twitter:*`, `article:published_time` e `article:author` su 10 pagine; 6 immagini aperte e controllate; articolo inesistente → 404. Anteprima LinkedIn da fare dopo il merge: le anteprime Vercel sono protette.

**In produzione dal 19/11, 16:16** (PR #16): `og:image` 200 (`image/png`) e `twitter:card=summary_large_image` su home, `/plugin`, `/servizi`, `/check-up`, `/risorse`, articolo, `/contatti`, `/privacy`; le immagini pesano come in locale, quindi anche nella build di Vercel i font si caricano. **Post Inspector di LinkedIn** su `/plugin` e sull'articolo: immagine, titolo e dominio corretti. Voce 1.4 chiusa.

## 2026-11-20 · L'agenzia vende agenti AI; offerta di avvio per 5 clienti (Sprint A)

**Decisione di Luigi del 20/11.** Il piano va rivisto partendo da cosa vende l'agenzia. Si punta sulla vendita di agenti AI; il tema dei dati è la leva: il cliente sceglie se ospitare e gestire gli agenti o lasciare a noi gestione e messa online. inFrame non è l'offerta dell'agenzia: è un prodotto dell'agenzia, disponibile a chi vuole provare prima di un progetto di AI più complesso. Resta con la sua pagina e non entra nel discorso sui servizi.

**Da dove viene:** una richiesta di preventivo arrivata via email il 18/11 (impresa di servizi in avvio, tre agenti: preventivi, assistente WhatsApp, smistamento email). Il lavoro nel Company Brain (`vault/workspace/lavori/2026-11-18-preventivo-nitore/`) ha già le due formule e i prezzi decisi da Luigi il 19/11 per quel caso, e lo schema di offerta ripetibile (bozza, non listino ufficiale). Nessun dato del prospect va in questo repo.

**Cosa si vende e si pubblicizza:**
- tre agenti standard: preventivi e richieste, assistente WhatsApp, smistamento email. Sono workflow con l'AI dentro e un controllo umano dichiarato, non agenti autonomi: i testi lo devono dire;
- due formule: servizio gestito in UE (server, backup, monitoraggio e modelli a carico nostro) oppure dati sotto il controllo del cliente (server e chiavi suoi, nostro accesso di manutenzione revocabile);
- agenti su misura: si vendono a progetto, non si pubblicizzano.

**Offerta per 5 clienti** (Luigi, 20/11): al massimo 5 clienti, solo sviluppo di agenti, per raccogliere casi d'uso reali. Scelte di Luigi: sconto sull'avvio (il canone resta pieno), solo agenti standard, canali sito e LinkedIn. Regole proposte e da confermare con i testi (A.2): un agente per cliente; scambio scritto nella scheda di progetto (permesso di pubblicare il caso, numeri prima e dopo, testimonianza); cosa si misura fissato all'inizio; scadenza oltre al numero di posti; clienti scaglionati, non cinque insieme.

**Perché serve:** oggi non c'è nessun caso venduto, e gli asset sono demo. Senza casi veri il sito non può mostrare risultati (regola 4: niente numeri senza fonte).

**Conseguenze sul piano:** nuovo Sprint A in testa a `01-piano-sprint.md`; Sprint 2 e 3 (Freemius, WordPress.org, sequenza Brevo, lancio di inFrame) vengono dopo, con le date da rifissare. Voce 1.3: il video non va in home; se si fa, va in `/plugin` e si lega al lancio.

**Cosa non cambia nel sito:** grafica e componenti, `/plugin`, `/check-up`, `/risorse`, `/privacy`, `/contatti`, moduli, Brevo, rate limit, Open Graph. Cambiano i testi della home, `/servizi`, il menu, e si aggiunge la pagina dell'offerta.

**Deciso da Luigi il 20/11 (sera):** niente prezzi sul sito; candidature fino al 31/03/2027 (il 31/01 proposto era troppo vicino); menu Servizi · Offerta · Plugin · Risorse, con Check-up nel footer.

**Aperto:** entità dello sconto (nei testi "condizioni riservate ai primi 5", la cifra va nella stima scritta); indirizzo della pagina (proposta `/offerta`); dove mettere i servizi intorno a inFrame (proposta: in `/plugin`).

## 2026-11-20 · `/servizi` sugli agenti AI (voce A.3)

**Testi approvati da Luigi il 20/11** (`03-contenuti.md`), con l'indirizzo `/offerta` per la pagina nuova e lo spostamento dei servizi intorno a inFrame.

**Come:** `src/app/servizi/page.tsx` ha cinque sezioni: i tre agenti (schede con per chi, cosa fa, cosa resta a voi, tempi come stima), le due formule (`#formule`, due schede con le stesse sei voci), cosa serve per partire, su misura con il rimando a `/plugin`, i quattro passi. Titolo, descrizione e immagine Open Graph aggiornati.

**Servizi intorno a inFrame:** "Avvio guidato" e "Collegamento al tuo gestionale", con la riga per le agenzie, sono ora in `/plugin`, sezione 06 (`#avvio`); il pulsante di chiusura di `/plugin` punta lì e non più a `/servizi`. La scheda "Piano a pagamento" non è stata spostata: `/plugin` ha già la sua sezione 05.

**Rimandato ad A.4:** la riga di `/servizi` verso `/offerta`, perché la pagina non esiste ancora e il link darebbe 404.

**Non toccati, da allineare in A.5 e A.6:** home, menu, footer, `public/llms.txt`. Fuori dal repo: l'assistente del sito risponde dal workflow n8n "Servizi" sulla VPS, che descrive ancora i servizi vecchi.

**Provato il 20/11** (build di produzione in locale): `/servizi` e `/plugin#avvio` a 800 px e a 375 px, nessuno scorrimento orizzontale, nessun "€" in pagina; in console solo i 404 degli script Vercel, che in locale non esistono.

## 2026-11-20 · Pagina `/offerta` e candidature (voce A.4)

**Come:**
- `src/lib/offerta.ts`: dati dell'offerta (`OFFERTA`: 5 posti, ultimo giorno 31/03/2027, `postiEsauriti`), `offertaAperta()` e `validaCandidatura()`, usata sia dal modulo sia dalla route.
- `src/app/offerta/page.tsx` con la sua immagine Open Graph e il JSON-LD `FAQPage`; `src/components/ui/ModuloCandidatura.tsx`.
- `POST /api/candidatura`: limite di 5 richieste al minuto per IP, campo trappola, convalida, email alla casella dell'agenzia tramite Resend con `replyTo` del candidato.
- Eventi `click_candidatura` e `candidatura_ok`; `/offerta` nella sitemap finché l'offerta è aperta; riga di rimando in `/servizi`; una frase in `/privacy`.

**Chiusura automatica:** la pagina e `/servizi` si rigenerano ogni ora (`revalidate = 3600`). Dal 1/4/2027, ora italiana, `/offerta` mostra "Le candidature sono chiuse", il rimando in `/servizi` sparisce, la sitemap la toglie e la route risponde 410. Se i posti finiscono prima: `postiEsauriti: true` in `src/lib/offerta.ts` e un deploy. La voce di menu (A.6) dovrà usare la stessa funzione.

**Brevo solo con un consenso a parte.** Il piano diceva "in Brevo con una `FONTE` dedicata" per ogni candidatura. Il consenso del modulo però copre solo "essere ricontattato su questa candidatura", e Brevo è la lista delle email: per questo c'è una seconda casella facoltativa ("Voglio ricevere anche le email di aiframe…"). Solo chi la spunta entra in Brevo, con `FONTE=offerta` e doppia conferma. Le candidature si leggono nella posta, non in Brevo. Se Brevo fallisce, la candidatura resta valida (l'email è già partita) e l'errore va nei log.

**Mai un successo finto:** senza `RESEND_API_KEY` la route risponde 503 "Candidature non ancora attive" (il modulo contatti, in quel caso, risponde 200).

**Provato il 20/11:** 17 test nuovi (`src/lib/offerta.test.ts`, `src/app/api/candidatura/route.test.ts`, con Resend e Brevo sostituiti: nessuna email parte dai test), 88 in tutto. Nel browser, build di produzione: pagina a 800 px, modulo vuoto con i 7 errori, route con corpo vuoto (400), non oggetto (400), campo trappola (200). **Non provato:** un invio vero, perché in locale `RESEND_API_KEY` è valorizzata e sarebbe partita un'email. Lo fa Luigi dall'anteprima.

**Da fare prima della produzione:** testo dei due consensi dal consulente privacy; attributo `FONTE` di Brevo con il valore nuovo `offerta` (è un testo libero: nessuna modifica in Brevo).

## 2026-11-20 · Home, menu e footer sugli agenti AI (voci A.5 e A.6)

**Come:** i testi approvati di `03-contenuti.md` nelle sezioni di `src/components/sections/home/` (hero, ticker, barra, tre agenti, come lavoriamo, chi siamo) e in `src/app/page.tsx` (per chi, fascia offerta, fascia plugin, chiusura). `DatiBand` non usa più `FasciaPausa`: ha lo stesso aspetto ma è più larga, per le due schede delle formule. Ordine delle sezioni: 01 cosa costruiamo, per chi, 02 dati, 03 come lavoriamo, offerta, plugin, 04 chi siamo. Titolo e descrizione predefiniti del sito (`layout.tsx`) e immagine Open Graph generale allineati: chiude il problema 6 dell'esito dello Sprint 0. `public/llms.txt` riscritto (problema 5).

**Menu:** Servizi · Offerta · Plugin · Risorse. Check-up resta nel footer e nella fascia plugin della home.

**La voce Offerta sparisce da sola.** Menu e footer usano `useOffertaAperta()` (`src/lib/useOffertaAperta.ts`): le pagine statiche sono costruite una volta, quindi sul server la voce c'è sempre e nel browser decide l'orologio del visitatore. Dopo il 31/03/2027 una pagina costruita prima toglie la voce al caricamento; chi naviga senza JavaScript la vede finché non c'è un deploy, e arriva alla pagina "Le candidature sono chiuse". Per questo `Footer` è diventato un componente client. La fascia offerta della home si rigenera ogni ora, come `/servizi`.

**Provato il 20/11** (build di produzione in locale): home a 1280 px e a 375 px, nessuno scorrimento orizzontale, nessun errore di idratazione, nessun "€"; menu e footer con la voce Offerta. Lighthouse 13.6.0, solo accessibilità: home 100, `/offerta` 100, `/servizi` 100 (unico audit fallito: `label-content-name-mismatch`, già presente).

**Resta fuori dal repo:** il workflow n8n dell'assistente sulla VPS, che descrive ancora i servizi vecchi.


## 2026-11-21 · Candidature: copia in Upstash, ricevuta al candidato, campo trappola

**Perché:** le candidature di `/offerta` non arrivavano né a Luigi né al candidato. La route non passa da n8n (lo fa Resend), non mandava nessuna ricevuta al candidato e non salvava niente: l'email all'agenzia era l'unica copia. I log Vercel non sono leggibili da qui (progetto in un altro account), quindi la causa della mancata consegna è ancora da trovare nel pannello Resend.

**Decisioni di Luigi (21/11):** copia in Upstash, non nel Postgres della VPS; conservazione 6 mesi; chat nelle anteprime Vercel lasciata com'è (403 `origin_not_allowed`, la produzione e localhost rispondono 200).

**Come:**
- `src/lib/candidature.ts`: `salvaCandidatura()` scrive `candidatura:<data ISO>:<uuid>` con scadenza 183 giorni, `email_agenzia: "in_invio"`; `segnaEmailAgenzia()` la aggiorna a `inviata` o `non_inviata` mantenendo la scadenza.
- `POST /api/candidatura`, nell'ordine: copia in Upstash, email all'agenzia (con la chiave della copia), poi ricevuta al candidato e Brevo. Il visitatore vede "Candidatura ricevuta" solo se copia ed email all'agenzia sono riuscite. Senza Upstash o senza Resend: 503. Copia non riuscita: 502, nessuna email. Email all'agenzia non riuscita: 502, la copia resta con `non_inviata`. Ricevuta al candidato o Brevo non riusciti: solo nei log.
- Campo trappola: da `sito_web` a `rif_interno`, con gli attributi che fanno ignorare il campo a 1Password e LastPass. La route rifiuta in silenzio anche `sito_web`, per le pagine in cache.
- `/privacy`: ricevuta e copia in Upstash per 6 mesi.

**Leggere le candidature salvate:** console Upstash, Data Browser, chiavi `candidatura:*`.

**Da fare per Luigi:** aggiornare il servizio Upstash nell'informativa iubenda (oggi dice "al massimo 24 ore"); controllare che Upstash sia attivo su Production in Vercel, altrimenti il modulo risponde 503.
