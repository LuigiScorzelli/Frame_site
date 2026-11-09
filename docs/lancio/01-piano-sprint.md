# Piano a sprint

Ordine di esecuzione. Ogni voce ha un criterio di accettazione: finché non è vero, la voce non è chiusa. Le voci marcate **[B]** sono bloccate da qualcosa che deve fare Luigi (vedi `00-LEGGIMI.md`).

## Sprint 0 · da giovedì 6/11 a domenica 9/11 · "pronto per lunedì"
Obiettivo: lunedì 10/11 il sito parla al titolare di PMI con WordPress, ha il blog vero, conta i download della beta, raccoglie email in una lista e misura i clic. Tutto il resto può aspettare.

| # | Lavoro | Accettazione |
| --- | --- | --- |
| 0.1 | Ramo `lancio-plugin`; `src/lib/brand.ts` con `PLUGIN_NAME`, `AGENCY_NAME = "aiframe"`, `CONTACT_EMAIL`, `CALENDLY_URL`, `WPORG_URL` (vuoto finché non approvato), `BETA_DOWNLOAD_PATH` | `npm run build` passa; nessun testo del sito contiene più "FR>ME" né "Lead Assistant" scritto a mano (dal 7/11 il **logo** è di nuovo FR>ME, solo tramite `LOGO_TEXT` in `brand.ts`) |
| 0.2 | Menu e footer nuovi (`03-contenuti.md`, sezione Menu). Amazon SEO fuori dal menu (la pagina resta raggiungibile). "Chi siamo" via dal menu, contenuto ridotto nella sezione "chi c'è dietro" della home | Menu: Servizi · Plugin · Check-up · Risorse + pulsante Prenota 30 minuti (cambiato il 7/11, vedi `decisioni-tecniche.md`) |
| 0.3 | Home riscritta con i testi di `03-contenuti.md` (dal 7/11 home dell'agenzia con una fascia plugin). Sezione risultati con i numeri inventati **rimossa**; al suo posto la sezione "Prove" con lo stato della beta | Nessun numero senza fonte in pagina; Lighthouse accessibilità ≥ 90 |
| 0.4 | Pagina `/plugin` nuova: cosa fa / non fa, installazione, FAQ, pulsante download beta (sprint 0) o WordPress.org (quando `WPORG_URL` è valorizzato) | Il pulsante cambia da solo in base a `WPORG_URL`; dal 7/11 la beta si scarica dopo l'email (vedi `decisioni-tecniche.md`) |
| 0.5 | Route `GET /api/wpla/download` che serve lo zip corrente (letto da `public/wpla/update.json`), registra un evento e risponde con `Content-Disposition`. I link alla beta nel sito puntano qui, non allo zip | Il download funziona; l'evento `download_beta` compare in Vercel Analytics; `update.json` resta invariato per il plugin già installato |
| 0.6 | Blog in MDX: cartella `content/articoli/*.mdx` con frontmatter (`titolo, descrizione, data, categoria, tempoLettura, cover, slug`), lettore in `src/lib/content.ts`, `/risorse` e `/risorse/[slug]` (redirect 301 da `/blog` e `/blog/[slug]`). Strapi rimosso (`src/lib/strapi.ts`, tipi, env) | Un articolo di prova si vede; nessun lorem ipsum in nessuna pagina; `STRAPI_*` sparito da `.env.example` |
| 0.7 | **[B Brevo]** `POST /api/newsletter` riscritto: crea il contatto in Brevo con doppio opt-in e attributo `FONTE` (newsletter, checkup, beta). Se `BREVO_API_KEY` manca, risponde 503 con messaggio chiaro, non finge successo | Iscrizione di prova arriva in lista Brevo con la fonte giusta; email di conferma ricevuta |
| 0.8 | **[B Upstash]** Rate limit con Upstash Redis (`@upstash/ratelimit`) su `/api/contact`, `/api/newsletter`, `/api/wpla/download`. Fallback: se le variabili mancano, limite in memoria con avviso nei log | 11 richieste in 60 s dallo stesso IP: l'ultima riceve 429 anche dopo un cold start |
| 0.9 | Eventi Vercel Analytics (`track()` da `@vercel/analytics`): `click_installa, download_beta, checkup_start, checkup_done, checkup_email, newsletter_ok, click_prova, click_prenota, click_account` | Ogni pulsante principale manda il suo evento (verifica nel pannello Vercel) |
| 0.10 | Pagina `/check-up` versione 0: solo il **calcolatore** "quanto costa una richiesta persa" lato client, con formula dichiarata, e il modulo email (fonte `checkup`). Il controllo automatico del sito arriva nello sprint 1 | Il calcolo cambia al variare dei 3 campi; l'email entra in Brevo |
| 0.11 | Pagina `/servizi` senza prezzi: tre servizi descritti, pulsante "Prenota 30 minuti" (link Calendly da `brand.ts`; se vuoto, apre il modulo contatti) | Nessuna cifra in pagina |
| 0.12 | Pagina `/privacy` nuova con la parte "in italiano semplice" e la parte legale; `[da confermare]` per fornitore AI e regione sostituito da Luigi prima del deploy | La pagina esiste, è linkata nel footer e nei moduli |
| 0.13 | SEO di base: `metadata` per pagina (titoli in `03-contenuti.md`), `sitemap.ts` e `robots.ts` aggiornati, JSON-LD `Organization` + `SoftwareApplication` in `/plugin`, `public/llms.txt` | Rich Results Test senza errori |
| 0.14 | ~~Chat widget rimosso~~ Cambiato il 9/11: al posto del menu c'è l'assistente AI vero (vedi `decisioni-tecniche.md`) | Risposta vera e risposta vuota gestite sull'anteprima del ramo |
| 0.15 | `/contatti`: calendario fatto in casa sostituito da Calendly incorporato **[B Calendly]**; finché manca l'URL resta il modulo attuale senza calendario | Prenotazione di prova arriva in agenda |

Fuori dallo sprint 0, anche se tenta: check-up automatico, Freemius, pagina partner, PDF.

## Sprint 1 · 10-23/11 (settimane 1-2 del piano contenuti)
| # | Lavoro | Accettazione |
| --- | --- | --- |
| 1.1 | Check-up v1: `POST /api/checkup` riceve un URL, scarica la home e la pagina contatti (timeout 8 s, solo http/https, niente IP privati), calcola 5 voci con punteggio 0-100 (specifiche in `02-specifiche.md`), risponde in pagina; con email invia il report HTML via Resend e crea il contatto in Brevo (`FONTE=checkup`) | 10 siti reali analizzati senza errori; punteggio spiegato voce per voce |
| 1.2 | Articoli 1 e 2 pubblicati in MDX (testi dal Company Brain); categorie e pagina `/risorse` con filtri | 2 articoli online |
| 1.3 | Video 60 s in home (MP4 muto, caricato al clic; YouTube non in elenco per i lunghi) | LCP < 2,5 s su mobile |
| 1.4 | Dati strutturati `Article` e `FAQPage`; Open Graph per ogni pagina | Anteprima LinkedIn corretta |
| 1.5 | `readme.txt`, 5 screenshot e icona del plugin pronti nel repo del plugin (non in questo) per la richiesta a WordPress.org | Plugin Check 0 errori con il nome definitivo |

## Sprint 2 · 24/11-7/12 (settimane 3-4)
| # | Lavoro | Accettazione |
| --- | --- | --- |
| 2.1 | Checklist PDF "sito pronto per le feste" (statico in `public/`), scaricabile dopo email | Download tracciato |
| 2.2 | **[B Freemius]** Prodotto creato su Freemius: piano gratuito + piano a pagamento con prova 30 giorni; SDK nel plugin su ramo separato; checkout di prova in sandbox; link "Il mio account" nel footer | Acquisto di prova in sandbox va a buon fine; licenza visibile nel pannello del plugin |
| 2.3 | Richiesta di pubblicazione su WordPress.org inviata (dal repo del plugin) | Email di presa in carico ricevuta |
| 2.4 | Sequenza Brevo di onboarding (5 email in 14 giorni) collegata alla fonte `beta`/`install` | La sequenza parte all'iscrizione di prova |

## Sprint 3 · dall'8/12 (lancio)
| # | Lavoro | Accettazione |
| --- | --- | --- |
| 3.1 | `WPORG_URL` valorizzato quando approvato; pulsanti aggiornati da soli | Clic su "Installa" porta a WordPress.org |
| 3.2 | Checkout Freemius in produzione; `/servizi` con il Piano a pagamento attivabile dal plugin | Primo acquisto reale registrato |
| 3.3 | Verifica licenza dal backend AI (se il backend è gestito da aiframe) | Chiamata senza licenza valida rifiutata |
| 3.4 | Pagina `/casi` (gennaio) e pagina partner per agenzie (settimana 11) | Online con il primo caso vero |

## Definizione di "fatto" per ogni sprint
`npm run lint` e `npm run build` senza errori; nessun testo con "io/ho/mio"; nessun prezzo; nessun numero senza fonte; `[NOME]` solo tramite `PLUGIN_NAME`; variabili nuove aggiunte a `.env.example` con commento; commit piccoli con messaggio in inglese; nota di fine sessione nel diario (`companyBrain/regole/diario-sessioni-mac.md`).
