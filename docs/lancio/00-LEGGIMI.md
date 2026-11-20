# Lancio del plugin da aiframe.it: documentazione per le sessioni di sviluppo

Scritto il 5/11/2026 (sessione Cowork con Luigi). Serve alle sessioni Claude Code che implementano il sito nei prossimi giorni e settimane. La strategia completa è nel Company Brain: `companyBrain/vault/workspace/lavori/2026-11-05-lancio-plugin-aiframe/`.

## In una frase
aiframe.it è il sito dell'agenzia, che costruisce **agenti AI per piccole aziende** e lascia al cliente la scelta su dove stanno i dati: li gestiamo noi in UE, oppure girano sul suo server con le sue chiavi. La home presenta i servizi e porta a **Prenota 30 minuti**; fino a esaurimento c'è un'offerta di avvio per 5 clienti, in cambio di un caso d'uso pubblicabile. **inFrame**, il plugin WordPress gratuito che risponde ai clienti fuori orario e raccoglie le richieste, è un prodotto dell'agenzia per chi vuole provare prima di un progetto più complesso: ha una fascia in home e la sua pagina `/plugin`. (Decisioni di Luigi: 7/11, la home non è dedicata al plugin; 20/11, l'offerta dell'agenzia sono gli agenti AI. Vedi `decisioni-tecniche.md`.)

**Da dove partire:** lo Sprint A di `01-piano-sprint.md`.

## File di questa cartella
| File | Cosa contiene | Chi lo usa |
| --- | --- | --- |
| `01-piano-sprint.md` | Lavori in ordine, con criteri di accettazione. Sprint 0 = cosa deve essere pronto lunedì 10/11 | Ogni sessione, per sapere cosa fare |
| `02-specifiche.md` | Architettura, route, variabili d'ambiente, servizi esterni, eventi, dati | La sessione che implementa |
| `03-contenuti.md` | Testi delle pagine in voce "noi", senza prezzi, con `[NOME]` per il plugin | La sessione che riscrive le pagine |
| `04-prompt-sessioni.md` | Prompt pronti da incollare per aprire ogni sessione | Luigi |

## Regole fisse (decise da Luigi il 5/11/2026)
1. **Voce "noi"**: aiframe è l'agenzia. "Abbiamo costruito", "lo installiamo noi". Mai "io" nei testi del sito. (Il profilo LinkedIn resta in prima persona, ma non riguarda questo repo.)
2. **Nome del plugin: inFrame** (deciso da Luigi il 19/11). Nei testi si scrive `[NOME]` e nel codice si usa solo la costante `PLUGIN_NAME` in `src/lib/brand.ts`. Se cambia, si cambia in un punto solo. Slug, cartelle e route non devono contenere il nome.
3. **Niente prezzi** sul sito (confermato da Luigi il 20/11 anche per gli agenti: le cifre vanno solo nelle stime scritte). In `/servizi` si descrive cosa comprende ogni servizio e si manda a "Prenota 30 minuti". Nessun "da X €", nessun placeholder visibile.
4. **Niente numeri senza fonte.** I numeri dei test interni si dichiarano come test; i numeri che ancora non esistono si segnano nel codice come `TODO:dato` e nel sito non si mostrano (si mostra la frase senza numero, mai una cifra inventata). I "-40%" e "+55%" attuali vanno tolti.
5. **Servizi gestiti, niente codice dove non serve**: WordPress.org per distribuire la versione gratuita, Freemius per pagamenti/licenze/portale cliente, Brevo per le liste, Resend per le notifiche, Calendly per le call, Upstash Redis per i rate limit, MDX nel repo per il blog. Non si scrivono checkout, login, licenze, fatture.
6. **Non si cambia stack**: Next.js 16, App Router, Tailwind v4, Vercel. Si toglie Strapi.
7. **Si lavora su un ramo** `lancio-plugin`; `main` resta deployabile. Nessun push su `main` senza il sì di Luigi.
8. **Segreti** solo in `.env.local` e nelle variabili di Vercel. Mai nel repo, mai nei log.
9. Lingua: testi in italiano, codice e commit in inglese (come da `CLAUDE.md`).

## Cosa aspetta Luigi (bloccanti segnati nel piano)
- ~~Nome del plugin~~ fatto il 19/11: inFrame, online dal 19/11
- Dati del Titolare per iubenda (nome, indirizzo, P. IVA): sbloccano informativa collegata e P. IVA nel footer
- ~~Prezzi sul sito~~ deciso il 20/11: niente prezzi sul sito
- Offerta per 5 clienti: entità dello sconto sull'avvio (non blocca). Chiusura delle candidature decisa: 31/03/2027
- Approvazione dei testi nuovi di `03-contenuti.md` (voce A.2): blocca il codice di A.3-A.6
- Account Brevo, Upstash (Marketplace Vercel), Calendly, Freemius (sprint 3)
- Dominio verificato su Resend (SPF, DKIM, DMARC)
- ~~Fornitore e regione dell'elaborazione AI da dichiarare in /privacy~~ fatto il 7/11: chiave del cliente (OpenAI o Anthropic), chiamata diretta dal sito
