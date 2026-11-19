# Freemius · cosa è configurato (19/11/2026)

Sprint 2, voce 2.2. Solo **sandbox**: niente checkout pubblico né prezzi reali senza il sì di Luigi.

## Pannello (dashboard.freemius.com)
| Cosa | Valore | Note |
| --- | --- | --- |
| Store | `aiframe` (ID 22493) | Rinominato da "luigi's Store" |
| Prodotto | **inFrame**, plugin WordPress, ID **45583** | Nome deciso da Luigi il 19/11 |
| Slug | `inframe` | Libero su WordPress.org il 19/11. Deve coincidere con lo slug su WordPress.org: il plugin oggi è `wpla-lead-assistant` e va rinominato prima della richiesta (voce 2.3) |
| Public key | `pk_a78e9b84c939a0d11fe8c97198e21` | Pubblica, va nel browser |
| Secret key | solo nel pannello e in `FREEMIUS_SECRET_KEY` | Mai nel codice, nei log o in chat |
| Piano Free | ID 80286 | Creato in automatico |
| Piano Pro | ID **80287**, titolo "Pro", nome `pro`, prova **30 giorni** | **Nessun prezzo** (Luigi, 19/11): senza prezzo il checkout propone solo il download gratuito |
| "Get Analytics through Freemius" | attivo (predefinito) | I dati d'uso partono solo con l'opt-in nel plugin (SDK) |

Non ancora fatto nel pannello: prezzo del piano Pro, carta richiesta o no per la prova, "Release Plans", rimborsi, email e DKIM personalizzati, deployment della versione a pagamento, portale cliente (`NEXT_PUBLIC_ACCOUNT_URL`).

## Sito
- `/plugin`, sezione "Piano a pagamento": pulsante **Prova 30 giorni** (`src/components/ui/ProvaFreemius.tsx`, evento `click_prova`) solo se `checkoutSandboxAttivo()` (`src/lib/freemius.ts`): tutte le variabili impostate **e** `VERCEL_ENV` diverso da `production`. In produzione resta il modulo "Avvisami".
- `GET /api/freemius/sandbox`: firma `ctx`/`token` della sandbox con la chiave segreta (formula di `@freemius/sdk` 0.5.0). 404 in produzione o senza variabili.
- Provato in locale il 19/11 con una chiave segreta finta e poi sull'anteprima della PR con la chiave vera: `/api/freemius/sandbox` risponde 200 (`no-store`), il checkout si apre in sandbox (`sandbox`, `plan_id=80287`, `trial=1`) senza errori di firma; senza prezzo propone il download gratuito. Acquisto di prova non ancora fatto.

## Variabili su Vercel (le imposta Luigi, solo Preview e Development)
```
NEXT_PUBLIC_FREEMIUS_PRODUCT_ID=45583
NEXT_PUBLIC_FREEMIUS_PLAN_ID=80287
NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY=pk_a78e9b84c939a0d11fe8c97198e21
FREEMIUS_SECRET_KEY=<dal pannello: Settings → API & Keys>
```

## Per chiudere la voce 2.2
1. Prezzo (anche solo di prova) sul piano Pro, poi acquisto di prova in sandbox da un'anteprima.
2. SDK Freemius nel plugin, su un ramo separato del repo `pluginWD/assisteAI_CRM` (altra sessione).
3. Link "Il mio account" (`NEXT_PUBLIC_ACCOUNT_URL`) quando c'è il portale cliente.
