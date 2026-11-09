# Prompt pronti per le sessioni Claude Code

Da incollare all'apertura di ogni sessione in `Desktop/portfolio/FRAME_Site/aiframe`. Ogni prompt rimanda ai documenti invece di ripeterli. A fine sessione: voce nel diario (`companyBrain/regole/diario-sessioni-mac.md`, progetto `aiframe`).

## Sessione A · Sprint 0, parte 1 (fondamenta e contenuti)
```
Leggi docs/lancio/00-LEGGIMI.md, 01-piano-sprint.md (solo Sprint 0), 02-specifiche.md (sezioni 2, 3, 4, 8) e 03-contenuti.md.
Crea il ramo lancio-plugin. Esegui le voci 0.1, 0.2, 0.3, 0.4, 0.9, 0.11, 0.12, 0.13, 0.14 dello Sprint 0, nell'ordine.
Regole: voce "noi", nessun prezzo, nessun numero senza fonte, il nome del plugin solo da PLUGIN_NAME in src/lib/brand.ts. Non toccare public/wpla/update.json.
Al termine: npm run lint e npm run build devono passare; elenca le righe di 03-contenuti.md marcate [da confermare] che hai lasciato senza numero; commit piccoli in inglese; nessun push.
```

## Sessione B · Sprint 0, parte 2 (blog MDX, download, newsletter, rate limit, calcolatore)
```
Leggi docs/lancio/00-LEGGIMI.md, 01-piano-sprint.md (Sprint 0) e 02-specifiche.md (sezioni 5, 6, 7, 9).
Sul ramo lancio-plugin esegui 0.5, 0.6, 0.7, 0.8, 0.10 e 0.15.
Per 0.6 scegli tra next-mdx-remote e @next/mdx, motiva la scelta in docs/lancio/decisioni-tecniche.md e crea content/articoli/esempio.mdx con bozza: true. Rimuovi Strapi del tutto.
Per 0.7 e 0.8 le chiavi potrebbero mancare: implementa i fallback descritti (503 chiaro per Brevo, limite in memoria con warning per Upstash) e aggiorna .env.example con commenti.
Verifica con curl i casi 200/400/429/503 di ogni route e riporta i comandi usati. Nessun push.
```

## Sessione C · Revisione dello sprint 0 (sessione separata, occhio fresco)
```
Leggi docs/lancio/00-LEGGIMI.md e 01-piano-sprint.md. Sul ramo lancio-plugin verifica ogni criterio di accettazione dello Sprint 0 e produci docs/lancio/esito-sprint-0.md con: criterio, esito (ok / no), prova (comando o file). Cerca nei testi: "io ", "ho ", "mio", "FR>ME", "Lead Assistant" scritto a mano, cifre in euro, percentuali senza fonte, lorem. Non correggere: elenca.
```

## Sessione D · Sprint 1, check-up v1
```
Leggi docs/lancio/02-specifiche.md sezione 5 (POST /api/checkup) e 12, e 03-contenuti.md (pagina /check-up).
Implementa src/lib/checkup/ con le 5 voci, la protezione SSRF, timeout e limiti; la route; la pagina con il risultato; l'invio del report via Resend e il contatto Brevo con FONTE=checkup.
Aggiungi Vitest con 10 fixture HTML (siti finti, non reali) e test per ogni voce. Prova poi su 10 siti reali e riporta punteggi e tempi senza salvare il loro HTML.
```

## Sessione E · Sprint 2, Freemius (solo quando Luigi ha l'account)
```
Leggi docs/lancio/02-specifiche.md sezione 11 e companyBrain/vault/workspace/lavori/2026-11-05-lancio-plugin-aiframe/piattaforma-sito-pagamenti-utenti.md sezione 3.2.
Nel sito: pulsante "Prova 30 giorni" con checkout Freemius in overlay (sandbox), link "Il mio account" da ACCOUNT_URL, eventi click_prova e click_account. Documenta in docs/lancio/freemius.md cosa è stato configurato nel pannello Freemius (nomi dei piani, prova, prezzi lasciati vuoti finché Luigi non decide).
La parte SDK va fatta nel repo del plugin (pluginWD/assisteAI_CRM), su un ramo separato, in un'altra sessione.
```

## Sessione F · Pubblicazione di un articolo (ricorrente, ogni lunedì)
```
Leggi docs/lancio/02-specifiche.md sezione 6. Prendi il testo dell'articolo da companyBrain/vault/workspace/lavori/2026-11-05-lancio-plugin-aiframe/contenuti-settimana-N.md, crea content/articoli/<slug>.mdx con il frontmatter completo, bozza: false, controlla con la lista di brand-e-voce (companyBrain/vault/self/brand-e-voce.md, "Controllo prima di pubblicare"), aggiorna public/llms.txt, build, commit. Nessun push senza ok.
```

## Prima del primo deploy del ramo (Luigi)
1. Variabili su Vercel: RESEND_FROM, BREVO_*, UPSTASH_*, NEXT_PUBLIC_* (vedi `.env.example`).
2. Dominio Resend verificato (SPF, DKIM, DMARC).
3. Sostituire ogni `[da confermare]` rimasto in `/privacy` e `/plugin` (fornitore AI, regione, P. IVA).
4. Deploy di anteprima del ramo, controllo su telefono, poi merge in `main`.
