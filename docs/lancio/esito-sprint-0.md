# Esito Sprint 0 (revisione "Sessione C")

Revisione a occhi freschi del 9/11/2026, sera. Solo verifica: nessun file del sito modificato, nessun commit.

- **Codice:** ramo `lancio-plugin` @ `a2de97d` (un commit di sola documentazione sopra `main`).
- **Produzione:** https://www.aiframe.it (`main` @ `aa83c59`), pagine scaricate con `curl` il 9/11 alle 18:53 UTC.
- **Criteri:** `01-piano-sprint.md` (Sprint 0 e "Definizione di fatto"), corretti dalle decisioni successive in `decisioni-tecniche.md` (0.2 menu, 0.3 home dell'agenzia, 0.4 email prima del download, 0.14 assistente AI, 0.15 Calendly come costante).
- **Non fatto di proposito:** nessuna iscrizione Brevo, nessun invio di moduli, nessuna prenotazione, nessun messaggio all'assistente. Unica azione "reale": **un** download della beta (`GET /api/wpla/download`, una riga `download_beta` nei log di Vercel è mia) e 12 `POST /api/contact` con corpo non valido (risposta 400/429, nessun dato salvato, nessuna email).
- **Senza accesso:** il progetto Vercel di aiframe non è nell'account collegato alla CLI (`vercel project ls` mostra solo altri progetti) e il connettore Vercel non è autorizzato: variabili d'ambiente, log e pannello Analytics non letti.

## Riepilogo

| Esito | Voci |
| --- | --- |
| ok | 27 (20 Sprint 0 + 7 Definizione di fatto) |
| no | 4 (0.5 e 0.9 eventi Analytics; 0.6 articolo visibile; "io/ho/mio" nell'assistente) |
| non verificabile | 4 (0.10 email check-up, 0.14 assistente, 0.15 prenotazione, diario) |

Aggiornato il 9/11 sera con le verifiche di Luigi: `FONTE` corretto in Brevo (0.7 → ok); eventi di Vercel Analytics non attivi (0.5 e 0.9 → no); Upstash attivo, nessun avviso nei log (0.8 → ok); Rich Results Test e validator.schema.org senza errori (0.13 → ok).

Le righe sono 35 perché le voci con più criteri sono divise in una riga per criterio.

## Voci dello Sprint 0

| Voce | Criterio | Esito | Prova |
| --- | --- | --- | --- |
| 0.1 | `npm run build` passa | ok | `npm run build` su `lancio-plugin`: 16 pagine generate, exit 0 |
| 0.1 | Nessun testo con "FR>ME" o "Lead Assistant" scritti a mano (logo solo da `LOGO_TEXT`) | ok | `grep -rn "FR>ME\|Lead Assistant" src content public/llms.txt`: solo `src/lib/brand.ts:6`, `:8`, un commento in `ChiSiamo.tsx:14` e un commento in `brand.ts:27`. Il logo passa da `LOGO_TEXT` in `GlitchLogo.tsx`, `Footer.tsx:28`, `ChiSiamo.tsx:21`. In produzione l'unico "FR>ME" fuori dal logo è la scritta di sfondo di "Chi siamo" (ammessa dalla decisione del 7/11) |
| 0.2 | Menu: Servizi · Plugin · Check-up · Risorse + Prenota 30 minuti; Amazon SEO e Chi siamo fuori dal menu | ok | `src/components/layout/NavBar.tsx:10-15`, `:49`; HTML di produzione di `/risorse`. `/chi-siamo` → 308 su `/#chi-siamo` (`next.config.ts:19`); `/amazon-seo` risponde 200 ma non è nel menu |
| 0.3 | Nessun numero senza fonte in home | ok | `src/app/page.tsx:23-27`: le sole cifre sono "24/10/2026" e "37/37 (test interni)", con fonte in `03-contenuti.md:40`. Vecchi "-40%/+55%" assenti |
| 0.3 | Lighthouse accessibilità ≥ 90 | ok | `npx lighthouse@13.6.0 --only-categories=accessibility`: home **96**, `/plugin` **93**. Audit falliti: `color-contrast`, `label-content-name-mismatch` (home); `definition-list`, `label-content-name-mismatch`, `link-in-text-block` (`/plugin`) |
| 0.4 | Il pulsante cambia da solo con `WPORG_URL` | ok | `src/app/plugin/page.tsx:69`, `:108`, `:219`. Solo il ramo "beta" è visibile, finché `WPORG_URL` è vuoto |
| 0.4 | Beta scaricabile dopo l'email | ok | Produzione `/plugin`: modulo "La tua email / SCARICA LA BETA" con consenso e link privacy; logica in `src/components/ui/InteresseForm.tsx:56-62`. Flusso completo non provato (richiede un'iscrizione) |
| 0.5 | Il download funziona e risponde con `Content-Disposition` | ok | `curl -D - https://www.aiframe.it/api/wpla/download`: 200, `content-disposition: attachment; filename="wpla-lead-assistant-0.2.0-beta.21.zip"`, `x-plugin-version: 0.2.0-beta.21`, 85.823 byte |
| 0.5 | L'evento `download_beta` compare in Vercel Analytics | no | Luigi (9/11): gli eventi in Vercel Analytics non sono attivi. L'evento parte dal browser (`InteresseForm.tsx:60`); la route scrive solo un log. Vedi problema 2 |
| 0.5 | `update.json` resta invariato | ok | `git log -- public/wpla/update.json`: ultimo cambio `7db4a3e` del 28/10, prima dello sprint |
| 0.6 | Un articolo di prova si vede | no | In produzione nessun articolo: `content/articoli/` contiene solo `esempio.mdx` con `bozza: true`, `/risorse/esempio` → 404 e la sezione "Articoli" di `/risorse` non compare (`src/app/risorse/page.tsx`, `articoli.length > 0`). Il comportamento è voluto (bozze solo in sviluppo), ma oggi `/risorse` ("Guide pratiche…") mostra solo due schede verso `/check-up` e la newsletter |
| 0.6 | Nessun lorem ipsum in nessuna pagina | ok | `grep -rni "lorem\|ipsum" src content public`: 0 risultati; 0 anche nell'HTML di produzione di tutte le pagine |
| 0.6 | `STRAPI_*` sparito da `.env.example` (e dal codice) | ok | `grep -rn STRAPI src .env.example`: 0 risultati. `/blog` → 301 su `/risorse`, `/blog/x` → 301 su `/risorse/x` |
| 0.7 | Iscrizione di prova in lista Brevo con la fonte giusta; email di conferma ricevuta | ok | Confermato da Luigi il 9/11: doppio opt-in funzionante (`decisioni-tecniche.md`) e `FONTE` corretto sui contatti in Brevo. Nessuna iscrizione di prova fatta da questa revisione |
| 0.8 | 11 richieste in 60 s dallo stesso IP: l'ultima riceve 429 | ok | 11 `POST /api/contact` con corpo non valido: 10 × 400, l'11ª **429** (`x-ratelimit-limit: 10`, `retry-after: 43`) |
| 0.8 | …anche dopo un cold start (Upstash attivo in produzione) | ok | Luigi (9/11): nei log di Vercel non compare `ratelimit: Upstash non configurato` (`src/lib/ratelimit.ts:77`), quindi in produzione il limite è condiviso in Redis e non per istanza |
| 0.9 | Ogni pulsante principale manda il suo evento (pannello Vercel) | no | Luigi (9/11): nel pannello gli eventi non compaiono (vedi problema 2). Codice: `click_prenota` (menu, hero, chiusura home, `/servizi`), `click_installa` (home, `/plugin`, `/check-up`, `/grazie`, articoli), `checkup_start/done`, `checkup_email`, `newsletter_ok`, `download_beta` collegati; `Analytics` montato in `src/app/layout.tsx:66`, `/_vercel/insights/script.js` → 200. `click_prova` non è usato da nessun componente (previsto per il piano a pagamento). **Luigi:** controllare gli eventi nel pannello |
| 0.10 | Il calcolo cambia al variare dei 3 campi; formula dichiarata | ok | `src/components/ui/Calcolatore.tsx:28-31` (formula), `:118-120` (3 campi), `:146-154` (formula e ipotesi mostrate). Verificato sul codice, non cliccando in pagina |
| 0.10 | L'email del check-up entra in Brevo | non verificabile | Richiede un'iscrizione. Codice: `fonte="checkup"` → evento `checkup_email` (`InteresseForm.tsx:58`) |
| 0.11 | `/servizi` senza cifre; "Prenota 30 minuti" su Calendly da `brand.ts` | ok | HTML di produzione: 0 "€"; le cifre presenti sono "30 minuti", "20 domande", "30 giorni di prova" (descrizioni, non prezzi). Link Calendly da `CALENDLY_URL` (`src/lib/brand.ts:15`) |
| 0.12 | `/privacy` esiste, linkata nel footer e nei moduli; niente "[da confermare]" | ok | Produzione `/privacy` → 200, 0 occorrenze di "da confermare"; link `/privacy` nel footer di ogni pagina e nei consensi dei moduli (`/plugin`: 4 link, `/check-up`: 2) |
| 0.13 | `metadata` per pagina, `sitemap.ts`, `robots.ts`, JSON-LD `Organization` + `SoftwareApplication` in `/plugin`, `llms.txt` | ok | Titoli di produzione uguali a `03-contenuti.md` (home, plugin, check-up, risorse; `/servizi` cambiato dopo la decisione del 7/11). `/sitemap.xml`, `/robots.txt`, `/llms.txt` → 200. JSON-LD in `/plugin`: `Organization`, `SoftwareApplication` (`price: "0"`), `FAQPage`. Vedi però i problemi 5 e 6 più sotto |
| 0.13 | Rich Results Test senza errori | ok | Luigi (9/11, scansione 20:07) su `https://www.aiframe.it/plugin`: Rich Results Test "2 elementi validi rilevati" (Società, Applicazioni software), solo "problemi non critici"; validator.schema.org: SoftwareApplication, Organization, FAQPage con 0 errori e 0 avvisi. I problemi non critici (probabilmente `aggregateRating`/`review` assenti) non vanno risolti con valutazioni inventate |
| 0.14 | Assistente AI: risposta vera e risposta vuota gestite | non verificabile | Nessun messaggio inviato all'assistente in produzione (avrebbe creato conversazioni nel database del VPS). Lo script `/assistente/wpla-widget-b4d6338.js` → 200, montato una volta in `layout.tsx:65`. La risposta vuota è stata provata in locale (`decisioni-tecniche.md`, 9/11). **Luigi:** fare una domanda vera da `www.aiframe.it` e da `aiframe.it` (le origini consentite sono esatte) |
| 0.15 | `/contatti` con Calendly incorporato | ok | `src/app/contatti/page.tsx:19`, `:30`; nell'HTML di produzione c'è `assets.calendly.com/assets/external/widget.js` |
| 0.15 | Prenotazione di prova arriva in agenda | non verificabile | Prenotazioni escluse. `decisioni-tecniche.md` (9/11): Luigi ha verificato Calendly dal sito |

## Definizione di "fatto"

| Voce | Criterio | Esito | Prova |
| --- | --- | --- | --- |
| DoD | `npm run lint` senza errori | ok | `npm run lint` → exit 0, nessun avviso |
| DoD | `npm run build` senza errori | ok | Vedi 0.1. Nel build locale compare `ratelimit: Upstash non configurato` (è il `.env.local`, non la produzione) |
| DoD | Nessun testo con "io/ho/mio" | no | Nei componenti del sito solo voce del visitatore ("dei miei dati" in `ModuloContatti.tsx:98`, "Il mio account" in `Footer.tsx:68`: ok). **Ma l'assistente, che compare su ogni pagina, parla in prima persona singolare:** `public/assistente/wpla-widget-b4d6338.js:56-57` (benvenuto predefinito "Ciao! Sono l'assistente… Rispondo… posso metterti in contatto", e `ASSISTANT` in `brand.ts` non passa un `welcome`), `:432` "non riesco a rispondere", `:433` "Non sono riuscito a inviare" |
| DoD | Nessun prezzo | ok | `grep "€\|euro"` in `src`: solo il calcolatore (valori del visitatore) e `priceCurrency: "EUR"` del JSON-LD con prezzo 0 |
| DoD | Nessun numero senza fonte | ok | Cifre della beta con fonte (vedi 0.3). Nota: i valori predefiniti del calcolatore (10 richieste, 40% fuori orario segnato "STIMA", 150 €, 30% che diventano clienti, quota persa 0,5 dichiarata come ipotesi) sono esempi modificabili; il 30% (`Calcolatore.tsx:23`) non è segnato come stima |
| DoD | `[NOME]` solo tramite `PLUGIN_NAME` | ok | Vedi 0.1; "[NOME]" non compare in nessuna pagina di produzione |
| DoD | Variabili nuove in `.env.example` con commento | ok | Tutte le `process.env.*` di `src` sono in `.env.example`; `KV_REST_API_URL/TOKEN` citate nel commento della sezione Upstash |
| DoD | Commit piccoli con messaggio in inglese | ok | `git log --since=2026-11-05`: 33 commit in stile `type(scope): subject`, in inglese; uno solo supera i 72 caratteri (76) |
| DoD | Nota di fine sessione nel diario | non verificabile | Il diario sta in un altro repo (`companyBrain/diario-vps`); non controllato da qui |

## Problemi trovati (in ordine di importanza)

1. **L'assistente parla in prima persona singolare su tutto il sito** (DoD "io/ho/mio"). Benvenuto, "non riesco a rispondere", "Non sono riuscito a inviare" vengono dalla copia del widget `wpla-widget-b4d6338.js`. Nel repo del plugin c'è già il commit `aa19d2e` con i testi in voce "noi" (ramo `fix/copy-voce-noi` di `assisteAI_CRM`, non ancora su `main`): basta rinfrescare la copia e `ASSISTANT.scriptPath`, oppure passare un `welcome` da `brand.ts`. Le risposte generate dal workflow n8n sulla VPS restano in prima persona finché non si importa il nuovo JSON.
2. **Gli eventi personalizzati di Vercel Analytics non arrivano** (0.5, 0.9). Nel codice `track()` è chiamato e lo script `/_vercel/insights/script.js` risponde 200, quindi Web Analytics è attivo. Causa probabile, da verificare: gli eventi personalizzati di Vercel sono disponibili solo con il piano Pro o Enterprise; con il piano Hobby si contano le visite ma non gli eventi. Prima di cambiare codice va controllato il piano del progetto aiframe; se è Hobby, si sceglie tra passare a Pro e usare un altro strumento per gli eventi.
3. **`/risorse` in produzione non ha nessuna guida.** Titolo e meta promettono "Guide pratiche…", ma ci sono solo due schede verso `/check-up` e la newsletter; l'unico articolo è la bozza di esempio. Serve almeno un articolo vero prima di spingere la pagina (o un titolo che non prometta guide).
4. **Dominio non coerente.** `SITE_URL = "https://aiframe.it"` (`src/lib/brand.ts:10`) va in canonical, `og:url`, sitemap, `robots.txt` (`Host` e `Sitemap`), JSON-LD e `llms.txt`; ma `https://aiframe.it` risponde **307** (temporaneo) verso `https://www.aiframe.it`. Google vede canonical e sitemap che puntano a indirizzi rediretti. Da decidere quale dominio è principale e allineare `SITE_URL` o il redirect di Vercel (e renderlo 301/308).
5. **`public/llms.txt` è rimasto alla home del plugin:** la descrizione dice "aiframe costruisce un plugin WordPress…" e la riga Home "cosa fa il plugin, come si installa…" (`llms.txt:3`, `:7`); la riga Servizi non cita i progetti su misura che ora aprono la pagina (`:9`).
6. **Titolo e descrizione predefiniti ancora sul plugin.** In `src/app/layout.tsx:20-38` il titolo di riserva e l'Open Graph sono "il tuo sito WordPress risponde anche quando sei chiuso": li usano l'`og:title` della home (diverso dal suo `<title>` dell'agenzia) e il titolo della pagina 404.
7. **Footer senza P. IVA** (`src/components/layout/Footer.tsx:85`, `TODO:dato`). Per un sito che vende servizi in Italia la partita IVA va indicata.
8. **Accessibilità minore** (sopra 90 ma con audit falliti): contrasto colori in home, nomi accessibili diversi dal testo visibile, una `<dl>` non valida e link nel testo distinguibili solo dal colore in `/plugin`.
9. **Eventi minori non tracciati:** il link di riserva "scarica da qui" dopo l'email (`InteresseForm.tsx`, stato `ok`) e "Preferisci che lo facciamo noi? Vedi l'avvio guidato" (`src/app/plugin/page.tsx:226`) non mandano eventi; `click_prova` è definito ma non usato.

## Cosa deve controllare Luigi
- Piano del progetto aiframe su Vercel (Hobby o Pro), per capire perché gli eventi non arrivano.
- Una domanda vera all'assistente da `www.aiframe.it` e da `aiframe.it`.
