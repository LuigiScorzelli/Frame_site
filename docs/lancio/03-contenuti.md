# Contenuti delle pagine (voce "noi", senza prezzi)

Testi pronti per lo sprint 0. `[NOME]` = `PLUGIN_NAME`. `[da confermare]` = dato da inserire o frase da tenere senza numero. Regole di scrittura: headline = domanda del cliente, dettagli concreti, niente superlativi, niente "non è solo X, è Y", niente lineetta lunga. Tutto quello che il plugin "fa" qui sotto è già vero nella beta.21 (vedi `public/wpla/update.json`); non aggiungere funzioni non ancora rilasciate.

## Menu e footer
Menu: **Servizi · Plugin · Check-up · Risorse** · pulsante `Prenota 30 minuti` (→ Calendly o /contatti, evento `click_prenota`, posizione menu).
Footer: colonna 1 "aiframe, automazioni e AI per piccole aziende. Il nostro primo prodotto è [NOME]." + email; colonna 2 "Cosa facciamo": Servizi, Plugin, Check-up, Risorse; colonna 3 Il mio account (se `ACCOUNT_URL`), Privacy, Contatti, "Chi c'è dietro → luigiscorzelli.com". Riga finale: "aiframe · P. IVA [da confermare] · Salerno".

---

## Home `/`
Decisione di Luigi del 7/11/2026: la home presenta l'agenzia; il plugin ha una sola fascia e rimanda a `/plugin`. Azione principale: `Prenota 30 minuti`. I testi della vecchia home dedicata al plugin (problema, come funziona, privacy, gratis e a pagamento) sono nella storia git (commit `57a34b8`); i contenuti utili vanno in `/plugin`.

**Titolo SEO**: Automazioni e assistenti AI per piccole aziende | aiframe
**Descrizione**: Costruiamo automazioni, assistenti AI e collegamenti tra gli strumenti che usate già, per piccole aziende senza reparto tecnico. E abbiamo un plugin WordPress gratuito.

**Hero**
- Etichetta: AUTOMAZIONI E AI PER PICCOLE AZIENDE (senza la città: decisione di Luigi)
- H1: **Quanto lavoro ripetitivo fate ancora a mano?**
- Sotto: Siamo aiframe. Costruiamo automazioni, assistenti AI e collegamenti tra gli strumenti che usate già, per piccole aziende senza reparto tecnico.
- Pulsanti: `Prenota 30 minuti` (evento `click_prenota`, posizione hero) · `Scopri il plugin gratuito` (→ /plugin).

**Cosa facciamo** (titolo: Cosa costruiamo, in concreto; 4 schede)
1. **Automazioni dei flussi ripetitivi.** Copiare dati da un'email a un foglio, mandare lo stesso promemoria ogni settimana, aggiornare due programmi a mano: lo fa il sistema, voi controllate.
2. **Assistenti AI sui vostri dati.** Assistenti che rispondono con i vostri documenti e le vostre procedure, per i clienti o per chi lavora con voi. Con permessi chiari su cosa possono leggere.
3. **Collegamenti tra gli strumenti.** CRM, email, fogli, gestionale ed e-commerce che si passano i dati da soli, senza copia-incolla e senza doppioni.
4. **Strumenti su misura.** Quando il software standard non copre un pezzo del vostro lavoro, costruiamo lo strumento che manca, collegato a quello che avete già.

**Per chi** (titolo: Per chi lavoriamo)
Piccole aziende senza reparto tecnico, con i dati sparsi tra email, fogli e gestionale, e qualcuno che passa ogni settimana ore a spostarli da un posto all'altro. Non serve sapere cos'è un'API: ci basta capire come lavorate oggi.

**Come lavoriamo** (titolo: Quattro passi, nessuna sorpresa)
1. Analisi: 30 minuti di chiamata su dove si perde tempo e quali dati usate.
2. Dati e accessi: chi può vedere cosa, dove restano i dati, quali strumenti tocchiamo.
3. Costruzione: la soluzione collegata agli strumenti che usate già.
4. Prova e ritocchi: casi reali con il vostro team, correzioni, miglioramenti dopo il rilascio.
Riga: Dopo la chiamata ricevete una proposta scritta di una pagina.

**Fascia plugin** (etichetta: IL NOSTRO PRIMO PRODOTTO; titolo: [NOME]: il sito WordPress che risponde anche quando siete chiusi)
Un plugin WordPress gratuito che risponde ai clienti con le informazioni del vostro sito, raccoglie nome, recapito e cosa cercano, e ve li consegna in posta. È in prova su siti reali dal 24 ottobre 2026 e supera 37 collaudi automatici su 37 (test interni).
Pulsante `Installa gratis` (→ /plugin, evento `click_installa`) · link "Oppure fai il check-up del tuo sito in 2 minuti" (→ /check-up).

**Dati** (titolo: I vostri dati restano sotto controllo)
Ogni progetto parte da una domanda: quali dati servono davvero, e chi deve poterli vedere. Diamo accessi solo dove servono, non copiamo informazioni sensibili in giro per strumenti diversi e vi lasciamo il controllo di quello che costruiamo. Link alla pagina privacy.

**Chi siamo** (ancora `#chi-siamo`, destinazione del redirect da `/chi-siamo`)
aiframe è lo studio di Luigi Scorzelli, a Salerno. Costruiamo automazioni per piccole aziende senza reparto tecnico. [NOME] nasce da una cosa vista in ogni azienda per cui abbiamo lavorato: le richieste arrivano alle 22 e qualcuno le legge alle 9. Link: luigiscorzelli.com.

**Chiusura**
H2: Raccontateci un processo che vi fa perdere tempo.
Pulsanti: `Prenota 30 minuti` (evento `click_prenota`, posizione chiusura) · email info@aiframe.it.

---

## `/plugin`
**Titolo SEO**: [NOME], plugin chatbot gratuito per WordPress in italiano | aiframe
**Descrizione**: Assistente per siti WordPress di piccole aziende: risponde con le informazioni del tuo sito, raccoglie le richieste fuori orario, le consegna via email e nel pannello. Gratis, dati in Europa.

- Etichetta: PLUGIN WORDPRESS · GRATUITO · IN ITALIANO
- H1: **[NOME]: il tuo sito risponde anche quando sei chiuso.**
- Sotto: Per attività locali, studi e piccole aziende con un sito WordPress. Risponde con le informazioni del tuo sito, raccoglie le richieste, te le consegna. Richiede WordPress 7.0 e PHP 8.3.
- Pulsante (id `installa`): se `WPORG_URL` → `Installa da WordPress.org`; altrimenti, dal 7/11, modulo email + consenso con pulsante `Scarica la beta`: all'invio il contatto va in Brevo con `FONTE=beta` (doppia conferma) e il download (`/api/wpla/download`, evento `download_beta`) parte subito, senza aspettare la conferma. Consenso: "email sugli aggiornamenti della beta e consigli per usarla" [da far confermare al consulente privacy]. Sotto, le 3 righe: "Scarica lo zip · In WordPress vai su Plugin → Aggiungi nuovo → Carica plugin · Attiva e segui la procedura guidata". Riga: Nessun account, nessuna carta.

**Cosa fa / cosa non fa** (due colonne)
Fa: risponde solo con i tuoi contenuti · raccoglie nome, recapito e richiesta · manda l'email e salva nel pannello · se l'invio fallisce riprova e ti avvisa · esporta e cancella i dati personali su richiesta · ti avvisa se la pulizia automatica dei dati non è partita.
Non fa: non inventa risposte su cose che non sa · non vende né cede i tuoi dati · non risponde al telefono (la voce è nel piano a pagamento) · non decide al posto tuo: i casi dubbi te li passa.

**Schermate** (5, vere): la chat sul sito · Richieste ricevute · Impostazioni in due righe · Impostazioni → Privacy · l'email che arriva.

**Installazione in 5 minuti** (passi numerati con schermate) + video 90 s quando pronto.

**Domande frequenti** (risposte di 2-3 righe, usate anche per `FAQPage`)
- *Serve una chiave di un fornitore AI?* Sì: chiave API propria del cliente, OpenAI o Anthropic a sua scelta (confermato il 7/11).
- *Dove vengono elaborati i dati?* Dal sito del cliente direttamente al fornitore scelto, senza passare dai nostri server; regione del fornitore (di norma USA). Le conversazioni restano 24 ore sul server del sito, poi vengono cancellate.
- *Funziona con WooCommerce?* Risponde su prodotti e ordini con le informazioni pubbliche del sito; la vendita guidata è nel piano a pagamento. [verificare]
- *Quanto costa l'AI?* Nella versione gratuita [da confermare in base al modello].
- *Posso spegnerlo in certi orari?* [verificare se esiste l'opzione; se no, togliere]
- *Cosa succede se un cliente chiede una cosa che non c'è sul sito?* L'assistente lo dice, chiede un recapito e ti passa la richiesta.
- *Chi vede le conversazioni?* Tu, dal pannello, per il tempo di conservazione che hai scelto.

**Piano a pagamento** (breve): cosa aggiunge (vendita guidata, preventivi con i tuoi prezzi, cliente abituale, CRM, voce), 30 giorni di prova, "si attiva dal pannello del plugin, senza reinstallare". Pulsante `Avvisami quando è disponibile`. Quando Freemius è attivo: `Prova 30 giorni` (evento `click_prova`).

**Chiusura**: `Installa gratis` · "Preferisci che lo facciamo noi? Vedi l'avvio guidato" → /servizi.

---

## `/check-up`
**Titolo SEO**: Check-up richieste perse: il tuo sito risponde ai clienti? | aiframe
**Descrizione**: Controllo gratuito in 2 minuti: come il tuo sito riceve le richieste, cosa succede fuori orario e quanto ti costa ogni richiesta persa.

- H1: **Il tuo sito risponde ai clienti? Scoprilo in 2 minuti.**
- Sotto (sprint 1, con l'analisi automatica): Inserisci l'indirizzo del sito. Controlliamo come riceve le richieste: moduli, chat, orari, promessa di risposta, pagina contatti da telefono. Risultato subito in pagina, report completo via email se lo vuoi.
- Sprint 0 (solo calcolatore): H1 uguale, sotto: "Prima di misurare il sito, misura il costo: quante richieste ti arrivano, quante fuori orario, quanto vale un cliente."

**Calcolatore** (titolo: Quanto ti costa una richiesta persa)
Tre campi: richieste a settimana · quante arrivano fuori orario (%) · quanto vale in media un cliente (€). Avanzate: quante richieste diventano clienti (%). Risultato: "Ogni mese circa [X] € di richieste senza risposta in tempo." Sotto, in piccolo, la formula e le ipotesi (vedi `02-specifiche.md`, sezione 9), modificabili.

**Risultato del check-up** (sprint 1): punteggio 0-100, cinque voci con spiegazione, etichetta "Sito WordPress: sì/no".

**Chiusura**: "Vuoi il report con le 3 cose da sistemare per prime? Te lo mandiamo via email." Campo email + checkbox consenso (fonte `checkup`). Poi: "La voce 'fuori orario' si sistema in 5 minuti: `Installa gratis`."

---

## `/servizi`
**Titolo SEO**: Avvio guidato, piano a pagamento e integrazioni per [NOME] | aiframe
**Descrizione**: Non vuoi configurare niente? Lo facciamo noi: installazione, contenuti, prove con domande vere, collegamento al tuo gestionale.

Dal 7/11/2026 la pagina copre anche i progetti dell'agenzia (Servizi è il primo link del menu).
- H1: **Cosa possiamo fare per la vostra azienda?**
- Sotto: Lavoriamo in due modi: progetti su misura per togliere lavoro ripetitivo, e servizi intorno a [NOME], il nostro plugin WordPress. Il prezzo lo diciamo dopo 30 minuti di chiamata, quando abbiamo capito cosa serve.

**Progetti su misura** (titolo: Automazioni e AI per il vostro lavoro)

| Servizio | Per chi | Cosa comprende |
| --- | --- | --- |
| **Automazioni dei flussi ripetitivi** | Chi passa ore ogni settimana a copiare dati tra email, fogli e programmi | Analisi del flusso con chi lo fa ogni giorno, automazione costruita sugli strumenti che usate già, prove su casi reali, istruzioni scritte per il team |
| **Assistenti AI sui vostri dati** | Chi risponde sempre alle stesse domande, a clienti o a colleghi | Raccolta di documenti e procedure, assistente che risponde solo da quelle fonti e dice quando non sa, permessi su cosa può leggere, prove con domande vere |
| **Collegamenti e strumenti su misura** | Chi usa CRM, gestionale ed e-commerce che non si parlano | Collegamento degli strumenti esistenti con controllo dei duplicati e registro delle operazioni. Quando il software standard non basta, lo strumento che manca |

**Intorno a [NOME]** (titolo: Non vuoi configurare niente? Lo facciamo noi.)

| Servizio | Per chi | Cosa comprende |
| --- | --- | --- |
| **Avvio guidato** | Chi vuole partire bene in un giorno | Installazione, caricamento di listini e documenti, 20 domande vere di prova, orari e tono delle risposte, consegna in videochiamata di 30 minuti |
| **Piano a pagamento di [NOME]** (in arrivo) | Chi vuole che il sito venda, non solo risponda | Vendita guidata con proposta di prodotti o servizi, preventivi con i tuoi prezzi, cliente abituale riconosciuto, CRM, voce. Aggiornamento dei contenuti ogni mese e assistenza. 30 giorni di prova |
| **Collegamento al tuo gestionale** | Chi ha già un CRM o un gestionale | Le richieste entrano nel tuo sistema (HubSpot provato nei nostri test), con controllo dei duplicati e registro delle operazioni |

Riga: Gestisci siti per i tuoi clienti? Scrivici: stiamo preparando una versione per agenzie.
Come si procede: `Prenota 30 minuti` (Calendly, evento `click_prenota`) → analisi del sito e dei processi → proposta scritta di una pagina. Pagamento con bonifico su fattura.
Nessuna cifra in pagina.

---

## `/risorse`
**Titolo SEO**: Guide su richieste dal sito, chatbot e CRM per piccole aziende | aiframe
- H1: **Guide pratiche per chi riceve richieste dal sito e vuole perderne meno.**
- Tre schede in alto: Check-up · Calcolatore · Checklist "sito pronto per le feste" (sprint 2).
- Elenco articoli: categoria, data, tempo di lettura. Categorie: Richieste perse · Dal sito al CRM · AI senza invenzioni · Privacy · Bottega.
- Newsletter: "Ogni due settimane: un numero vero dal plugin e una cosa da sistemare sul sito. Niente altro." Email + consenso (fonte `newsletter`).
- Nessun segnaposto: la pagina va online con il primo articolo vero (settimana 1).

Articolo `/risorse/[slug]`: titolo, data, tempo, categoria, corpo, blocco finale "Installa gratis" + "Prossimo articolo".

---

## `/privacy`
**Parte 1, in italiano semplice** (titolo: Come trattiamo i dati, spiegato come lo spiegheremmo a un cliente)
- Sul sito aiframe.it: statistiche senza cookie (Vercel Analytics); le email che ci lasci vanno in Brevo con doppia conferma; i moduli passano da Resend; le prenotazioni da Calendly; [Freemius per acquisti e licenze, da aggiungere nello sprint 2].
- Nel plugin installato sul tuo sito: le conversazioni restano 24 ore sul server del tuo sito e poi vengono cancellate; l'IP è salvato come impronta; le richieste consegnate si conservano per il tempo che scegli (7-365 giorni); chi chiede solo informazioni non lascia dati; chi lascia un recapito lascia solo quello che serve alla richiesta. Elaborazione AI: fornitore scelto dal cliente (OpenAI o Anthropic) con la sua chiave, chiamato direttamente dal sito; regione del fornitore, di norma USA.
- Come cancelli i dati di un cliente: Strumenti → Cancella dati personali, cerca per email, 2 clic.
**Parte 2**: informativa completa (titolare, basi giuridiche, responsabili, tempi, diritti). [Testo legale da far rivedere con il parere privacy già previsto.]

---

## `/contatti`
- H1: **Parliamone in 30 minuti.**
- Sotto: Ci mostri il tuo sito, ti diciamo cosa farebbe [NOME] e se ha senso per te. Nessun impegno.
- Calendly incorporato (se `CALENDLY_URL`), altrimenti modulo: nome, email, sito, messaggio, consenso. Honeypot nascosto.
- Riga: Oppure scrivici a info@aiframe.it.

---

## Testi di sistema
- Email di conferma iscrizione (Brevo, template DOI): "Conferma l'iscrizione ad aiframe. Un clic e sei dentro. Se non sei stato tu, ignora questa email."
- Pagina `/grazie`: "Fatto. Controlla la posta per confermare." + `Installa gratis`.
- 404: "Questa pagina non c'è. Il plugin invece sì." + link.
- Errore modulo: "Non siamo riusciti a inviare. Scrivici a info@aiframe.it."
