# Piano a sprint

Ordine di esecuzione. Ogni voce ha un criterio di accettazione: finché non è vero, la voce non è chiusa. Le voci marcate **[B]** sono bloccate da qualcosa che deve fare Luigi (vedi `00-LEGGIMI.md`).

**Piano rivisto il 20/11/2026** (decisione di Luigi, vedi `decisioni-tecniche.md`): l'agenzia vende agenti AI, con la scelta su dove stanno i dati, e apre un'offerta per 5 clienti per raccogliere casi d'uso reali. Lo **Sprint A** qui sotto viene prima di tutto il resto. inFrame resta il prodotto dell'agenzia per chi vuole provare prima di un progetto più complesso: la sua pagina e i suoi sprint non cambiano, ma vengono dopo lo Sprint A.

## Stato al 20/11
| Sprint | Stato |
| --- | --- |
| A · Offerta agenti | In corso: A.1 e A.2 chiuse, A.3-A.6 in PR; restano la candidatura di prova, il Post Inspector e A.7 (post LinkedIn) |
| 0 | Chiuso (`esito-sprint-0.md`) |
| 1 | Chiuse 1.1 e 1.4. Aperte 1.2 (manca l'articolo 2) e 1.5 (repo del plugin). 1.3 spostata, vedi sotto |
| 2 | Avviata solo la 2.2 (checkout Freemius in sandbox sulle anteprime). Dopo lo Sprint A |
| 3 | Non iniziato. Dopo lo Sprint A |

## Sprint A · dal 20/11 · "Offerta agenti"
Obiettivo: chi apre il sito capisce che aiframe costruisce agenti AI per piccole aziende, sceglie se farli gestire a noi o tenerli sotto il proprio controllo, e può candidarsi a uno dei 5 posti dell'offerta di avvio.

Base dei contenuti (Company Brain, bozze approvate da Luigi per il preventivo del 18/11): `vault/workspace/lavori/2026-11-18-preventivo-nitore/commerciale-offerta-ripetibile.md`.

| # | Lavoro | Accettazione |
| --- | --- | --- |
| A.1 | **Chiusa il 20/11.** Decisione registrata e piano riscritto (questo file, `decisioni-tecniche.md`, `00-LEGGIMI.md`) | Una sessione nuova sa cosa fare leggendo solo `docs/lancio/` |
| A.2 | **Chiusa il 20/11** (testi approvati da Luigi). Testi nuovi in `03-contenuti.md`: home, `/servizi`, pagina dell'offerta, menu. Voce "noi"; le demo si chiamano demo; nessun numero di risultato finché non c'è un caso vero | Luigi ha letto e approvato i testi prima che diventino codice |
| A.3 | **Fatta il 20/11, in PR.** `/servizi` riscritta: i tre agenti standard (preventivi e richieste, assistente WhatsApp, smistamento email) con cosa fa, cosa controlla una persona e tempi dichiarati come stime; le due formule (servizio gestito in UE, dati sotto il controllo del cliente); "su misura" in fondo | Le tre categorie generiche di oggi non ci sono più; ogni agente ha il suo punto di controllo umano scritto |
| A.4 | **Fatta il 20/11, in PR.** Manca la candidatura di prova vera, che fa Luigi dall'anteprima. Pagina nuova dell'offerta per 5 clienti: cosa ricevono (sconto sull'avvio, canone pieno), cosa danno in cambio (permesso scritto di pubblicare il caso, numeri prima e dopo, testimonianza), requisiti (Google Workspace, sito in HTTPS), posti e scadenza, modulo di candidatura con consenso. Solo agenti standard, uno per cliente | La candidatura di prova arriva per email e in Brevo con una `FONTE` dedicata; rate limit attivo sulla route |
| A.5 | **Fatta il 20/11, in PR.** Home: hero e "Cosa costruiamo" sugli agenti, fascia sui dati allineata alle due formule, richiamo all'offerta. La fascia inFrame resta | In 5 secondi si capisce che vendiamo agenti; nessun numero senza fonte; Lighthouse accessibilità ≥ 90 |
| A.6 | **Fatta il 20/11, in PR.** Manca il Post Inspector di LinkedIn, che si fa dopo il merge. Menu e footer, `metadata` e immagine Open Graph della pagina nuova, `sitemap.ts`, `public/llms.txt`, eventi `click_candidatura` e `candidatura_ok` | Post Inspector di LinkedIn corretto sulla pagina dell'offerta |
| A.7 | Post LinkedIn di annuncio (testo nel Company Brain, non in questo repo) | Bozza pronta per Luigi |

**Decisioni di Luigi del 20/11:** il favore dell'offerta è uno sconto sull'avvio (il canone non si tocca); solo agenti standard; canali: sito e LinkedIn.

**Decise da Luigi il 20/11 (sera):** niente prezzi sul sito (la regola 3 di `00-LEGGIMI.md` resta); candidature aperte fino al **31/03/2027**; menu **Servizi · Offerta · Plugin · Risorse**, con Check-up nel footer.

**Ancora da decidere:**
- **Entità dello sconto sull'avvio.** Non blocca: i testi dicono "condizioni riservate ai primi 5" e la cifra va nella stima scritta.

Fuori dallo Sprint A: agenti su misura in pubblicità, pagina `/casi` (arriva con il primo caso vero, voce 3.4), email a freddo (in pausa).

## Sprint 0 · da giovedì 6/11 a domenica 9/11 · "pronto per lunedì" · chiuso
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
| 1.1 | **Chiusa** (`decisioni-tecniche.md`, 11/11). Check-up v1: `POST /api/checkup` riceve un URL, scarica la home e la pagina contatti (timeout 8 s, solo http/https, niente IP privati), calcola 5 voci con punteggio 0-100 (specifiche in `02-specifiche.md`), risponde in pagina; con email invia il report HTML via Resend e crea il contatto in Brevo (`FONTE=checkup`) | 10 siti reali analizzati senza errori; punteggio spiegato voce per voce |
| 1.2 | **Articolo 1 online, manca il 2.** Articoli 1 e 2 pubblicati in MDX (testi dal Company Brain); categorie e pagina `/risorse` con filtri | 2 articoli online |
| 1.3 | ~~Video 60 s in home~~ Cambiato il 20/11: il video non va in home (la home presenta i servizi dell'agenzia). Se Luigi decide di farlo va in `/plugin`, registrato dopo la rinomina in inFrame, e si lega al lancio (Sprint 3). MP4 muto, caricato al clic | LCP < 2,5 s su mobile in `/plugin` |
| 1.4 | **Chiusa il 19/11.** Dati strutturati `Article` e `FAQPage`; Open Graph per ogni pagina | Anteprima LinkedIn corretta |
| 1.5 | `readme.txt`, 5 screenshot e icona del plugin pronti nel repo del plugin (non in questo) per la richiesta a WordPress.org | Plugin Check 0 errori con il nome definitivo |

## Sprint 2 · dopo lo Sprint A (era 24/11-7/12)
| # | Lavoro | Accettazione |
| --- | --- | --- |
| 2.1 | Checklist PDF "sito pronto per le feste" (statico in `public/`), scaricabile dopo email | Download tracciato |
| 2.2 | **[B Freemius]** Prodotto creato su Freemius: piano gratuito + piano a pagamento con prova 30 giorni; SDK nel plugin su ramo separato; checkout di prova in sandbox; link "Il mio account" nel footer | Acquisto di prova in sandbox va a buon fine; licenza visibile nel pannello del plugin |
| 2.3 | Richiesta di pubblicazione su WordPress.org inviata (dal repo del plugin) | Email di presa in carico ricevuta |
| 2.4 | Sequenza Brevo di onboarding (5 email in 14 giorni) collegata alla fonte `beta`/`install` | La sequenza parte all'iscrizione di prova |

## Sprint 3 · lancio di inFrame, dopo lo Sprint 2 (era dall'8/12)
| # | Lavoro | Accettazione |
| --- | --- | --- |
| 3.1 | `WPORG_URL` valorizzato quando approvato; pulsanti aggiornati da soli | Clic su "Installa" porta a WordPress.org |
| 3.2 | Checkout Freemius in produzione; `/servizi` con il Piano a pagamento attivabile dal plugin | Primo acquisto reale registrato |
| 3.3 | Verifica licenza dal backend AI (se il backend è gestito da aiframe) | Chiamata senza licenza valida rifiutata |
| 3.4 | Pagina `/casi` (gennaio) e pagina partner per agenzie (settimana 11) | Online con il primo caso vero |

## Definizione di "fatto" per ogni sprint
`npm run lint` e `npm run build` senza errori; nessun testo con "io/ho/mio"; nessun prezzo; nessun numero senza fonte; `[NOME]` solo tramite `PLUGIN_NAME`; variabili nuove aggiunte a `.env.example` con commento; commit piccoli con messaggio in inglese; nota di fine sessione nel diario (`companyBrain/regole/diario-sessioni-mac.md`).
