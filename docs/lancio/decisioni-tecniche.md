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
