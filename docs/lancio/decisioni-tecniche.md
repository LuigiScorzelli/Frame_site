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

Con `NEXT_PUBLIC_CALENDLY_URL` valorizzato la pagina incorpora Calendly (widget inline, script caricato solo in quel caso). Senza, resta il modulo: nome, email, sito, messaggio, consenso, honeypot `sito_web`. Il calendario fatto in casa è stato tolto dal modulo: inviava "Call prenotata" senza che nessuna call fosse davvero in agenda.

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
