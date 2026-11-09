# Lancio del plugin da aiframe.it: documentazione per le sessioni di sviluppo

Scritto il 5/11/2026 (sessione Cowork con Luigi). Serve alle sessioni Claude Code che implementano il sito nei prossimi giorni e settimane. La strategia completa è nel Company Brain: `companyBrain/vault/workspace/lavori/2026-11-05-lancio-plugin-aiframe/`.

## In una frase
aiframe.it resta il sito dell'agenzia (automazioni e AI per piccole aziende) e lancia il suo primo prodotto: un plugin WordPress gratuito per PMI italiane che risponde ai clienti fuori orario e raccoglie le richieste. La home presenta l'agenzia e porta a **Prenota 30 minuti**; il plugin ha una fascia in home e la sua pagina `/plugin`, dove l'azione è installarlo (o, per chi non è pronto, fare il check-up). I servizi a pagamento si vendono anche a chi ha già installato. (Decisione di Luigi del 7/11/2026: la home non è più dedicata al plugin, vedi `decisioni-tecniche.md`.)

## File di questa cartella
| File | Cosa contiene | Chi lo usa |
| --- | --- | --- |
| `01-piano-sprint.md` | Lavori in ordine, con criteri di accettazione. Sprint 0 = cosa deve essere pronto lunedì 10/11 | Ogni sessione, per sapere cosa fare |
| `02-specifiche.md` | Architettura, route, variabili d'ambiente, servizi esterni, eventi, dati | La sessione che implementa |
| `03-contenuti.md` | Testi delle pagine in voce "noi", senza prezzi, con `[NOME]` per il plugin | La sessione che riscrive le pagine |
| `04-prompt-sessioni.md` | Prompt pronti da incollare per aprire ogni sessione | Luigi |

## Regole fisse (decise da Luigi il 5/11/2026)
1. **Voce "noi"**: aiframe è l'agenzia. "Abbiamo costruito", "lo installiamo noi". Mai "io" nei testi del sito. (Il profilo LinkedIn resta in prima persona, ma non riguarda questo repo.)
2. **Nome del plugin: ancora da trovare.** Nei testi si scrive `[NOME]` e nel codice una costante `PLUGIN_NAME` in `src/lib/brand.ts` (default provvisorio: "Lead Assistant"). Quando il nome arriva, si cambia in un punto solo. Slug, cartelle e route non devono contenere il nome.
3. **Niente prezzi.** Luigi non li conosce ancora. In `/servizi` si descrive cosa comprende ogni servizio e si manda a "Prenota 30 minuti". Nessun "da X €", nessun placeholder visibile.
4. **Niente numeri senza fonte.** I numeri dei test interni si dichiarano come test; i numeri che ancora non esistono si segnano nel codice come `TODO:dato` e nel sito non si mostrano (si mostra la frase senza numero, mai una cifra inventata). I "-40%" e "+55%" attuali vanno tolti.
5. **Servizi gestiti, niente codice dove non serve**: WordPress.org per distribuire la versione gratuita, Freemius per pagamenti/licenze/portale cliente, Brevo per le liste, Resend per le notifiche, Calendly per le call, Upstash Redis per i rate limit, MDX nel repo per il blog. Non si scrivono checkout, login, licenze, fatture.
6. **Non si cambia stack**: Next.js 16, App Router, Tailwind v4, Vercel. Si toglie Strapi.
7. **Si lavora su un ramo** `lancio-plugin`; `main` resta deployabile. Nessun push su `main` senza il sì di Luigi.
8. **Segreti** solo in `.env.local` e nelle variabili di Vercel. Mai nel repo, mai nei log.
9. Lingua: testi in italiano, codice e commit in inglese (come da `CLAUDE.md`).

## Cosa aspetta Luigi (bloccanti segnati nel piano)
- Nome del plugin (entro il 15/11; proposta in `companyBrain/.../nome-plugin.md`)
- Prezzi (non bloccano: /servizi funziona senza)
- Account Brevo, Upstash (Marketplace Vercel), Calendly, Freemius (sprint 3)
- Dominio verificato su Resend (SPF, DKIM, DMARC)
- ~~Fornitore e regione dell'elaborazione AI da dichiarare in /privacy~~ fatto il 7/11: chiave del cliente (OpenAI o Anthropic), chiamata diretta dal sito
