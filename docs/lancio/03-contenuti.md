# Contenuti delle pagine (voce "noi", senza prezzi)

Testi pronti per lo sprint 0; home, `/servizi`, menu e la pagina nuova `/offerta` riscritti il 20/11/2026 per lo Sprint A e **da approvare** prima del codice. `[NOME]` = `PLUGIN_NAME`. `[da confermare]` = dato da inserire o frase da tenere senza numero. Regole di scrittura: headline = domanda del cliente, dettagli concreti, niente superlativi, niente "non è solo X, è Y", niente lineetta lunga. Tutto quello che il plugin "fa" qui sotto è già vero nella beta.21 (vedi `public/wpla/update.json`); non aggiungere funzioni non ancora rilasciate.

## Menu e footer
Menu (deciso da Luigi il 20/11): **Servizi · Offerta · Plugin · Risorse** · pulsante `Prenota 30 minuti` (→ Calendly o /contatti, evento `click_prenota`, posizione menu). La voce Offerta resta nel menu finché le candidature sono aperte (31/03/2027 o posti finiti).
Footer: colonna 1 "aiframe costruisce agenti AI e automazioni per piccole aziende. I dati stanno dove decidete voi." + email; colonna 2 "Cosa facciamo": Servizi, Offerta, Plugin, Check-up, Risorse; colonna 3 Il mio account (se `ACCOUNT_URL`), Privacy, Contatti, "Chi c'è dietro → luigiscorzelli.com". Riga finale: "aiframe · P. IVA [da confermare] · Salerno".

---

## Home `/`
**Testi del 20/11/2026, da approvare (voce A.2).** Decisione di Luigi del 20/11: l'agenzia vende agenti AI, con la scelta su dove stanno i dati; [NOME] ha una sola fascia e rimanda a `/plugin`. Azione principale: `Prenota 30 minuti`. I testi della home del 7/11 (automazioni, assistenti, collegamenti, strumenti su misura) sono nella storia git.

Regole per tutti i testi sugli agenti: sono flussi con l'AI dentro e un controllo umano dichiarato, mai "agenti autonomi"; nessun risultato in numeri finché non c'è un caso vero; le demo si chiamano demo; non si nomina il fornitore dei modelli ("modelli AI con elaborazione in UE"); i tempi sono stime e si scrivono come stime.

**Titolo SEO**: Agenti AI per piccole aziende, con i dati dove decidete voi | aiframe
**Descrizione**: Costruiamo agenti AI che preparano i preventivi, rispondono su WhatsApp e smistano le email. Li gestiamo noi in UE, oppure girano sul vostro server con le vostre chiavi.

**Hero**
- Etichetta: AGENTI AI PER PICCOLE AZIENDE
- H1: **Chi risponde alle richieste mentre state lavorando?**
- Sotto: Siamo aiframe. Costruiamo agenti AI che preparano i preventivi, rispondono su WhatsApp e mettono ordine nella posta. L'AI legge e prepara, a decidere restate voi.
- Pulsanti: `Prenota 30 minuti` (evento `click_prenota`, posizione hero) · `Guarda cosa fanno gli agenti` (→ /servizi).

**Ticker**: AGENTI AI · PREVENTIVI · WHATSAPP · SMISTAMENTO EMAIL · DATI IN UE · SUL VOSTRO SERVER O GESTITI DA NOI · PICCOLE AZIENDE ·

**Barra sotto l'hero** (4 voci, parole e non cifre)
- LEGGE · RICHIESTE DA EMAIL, MODULO E WHATSAPP
- PREPARA · BOZZE DI PREVENTIVI E RISPOSTE
- CHIEDE · A UNA PERSONA NEI CASI DUBBI
- DATI · IN UE, DOVE DECIDETE VOI

**Cosa costruiamo** (titolo: Tre agenti per il lavoro di ogni giorno; 3 schede, ognuna con link "Come funziona" → /servizi)
1. **Preventivi e richieste.** Legge le richieste che arrivano da email e modulo del sito, chiede i dati che mancano e prepara il preventivo dal vostro tariffario. Lo approvate voi prima che parta.
2. **Assistente WhatsApp.** Risponde alle domande frequenti con i vostri documenti, fissa gli appuntamenti in agenda e manda il promemoria. Quando non sa, passa la conversazione a una persona.
3. **Smistamento email.** Mette ordine nella casella generica: inoltra ogni messaggio alla persona giusta e prepara le bozze per le domande che tornano sempre.
Riga sotto: Avete un processo diverso da questi? Raccontatecelo: lo valutiamo insieme in 30 minuti.

**Per chi** (titolo: Per chi lavoriamo)
Piccole aziende di servizi senza reparto tecnico: imprese di pulizie e manutenzioni, studi, attività locali. Le richieste arrivano da email, modulo e WhatsApp, e oggi qualcuno le legge, le copia e risponde a mano, quando trova il tempo. Non serve sapere cos'è un'API: ci basta capire come lavorate oggi.

**Dati** (titolo: Dove stanno i vostri dati? Lo decidete voi.; 2 colonne, link "Confronta le due formule" → /servizi#formule e link alla privacy)
- **Lo gestiamo noi.** L'agente gira su un server dedicato a voi in un data center dell'Unione Europea. Pensiamo noi a server, copie di sicurezza, controlli e modelli AI. Voi usate il servizio.
- **Lo ospitate voi.** L'agente gira su un server intestato a voi, con le vostre chiavi. Noi entriamo solo per la manutenzione, con un accesso che potete togliere quando volete.
Riga sotto: In tutti e due i casi gli account di posta, WhatsApp e CRM restano a nome vostro, e l'accordo sui dati si firma prima di cominciare.

**Come lavoriamo** (titolo: Quattro passi, nessuna sorpresa)
1. Stima scritta: ci raccontate il processo, vi mandiamo una stima che si legge da sola. La chiamata di 30 minuti c'è sempre, per chi la vuole.
2. Demo prima della firma: vedete un agente funzionante con dati di esempio della vostra azienda. Se non vi convince, non dovete nulla.
3. Costruzione: un agente alla volta, collegato agli strumenti che usate già, con i punti di controllo scritti.
4. Prova e ritocchi: casi reali con il vostro team, correzioni, rapporto ogni mese.
Riga: Nessun vincolo di durata: disdetta con 30 giorni di preavviso.

**Fascia offerta** (etichetta: 5 POSTI · CANDIDATURE FINO AL 31 MARZO 2027; titolo: Cerchiamo 5 aziende per i primi casi reali)
Costruiamo un agente per cinque aziende a condizioni riservate. In cambio vi chiediamo di poter raccontare il vostro caso, con i numeri di prima e di dopo.
Pulsante `Leggi l'offerta` (→ /offerta, evento `click_candidatura`, posizione home).

**Fascia plugin** (etichetta: UN NOSTRO PRODOTTO, PER PROVARE; titolo: [NOME]: il sito WordPress che risponde anche quando siete chiusi)
Volete vedere un assistente AI al lavoro prima di un progetto su misura? [NOME] è il nostro plugin WordPress gratuito: risponde ai clienti con le informazioni del vostro sito, raccoglie nome, recapito e cosa cercano, e ve li consegna in posta. È in prova su siti reali dal 24 ottobre 2026 e supera 37 collaudi automatici su 37 (test interni).
Pulsante `Installa gratis` (→ /plugin, evento `click_installa`) · link "Oppure fai il check-up del tuo sito in 2 minuti" (→ /check-up).

**Chi siamo** (ancora `#chi-siamo`, destinazione del redirect da `/chi-siamo`)
aiframe è lo studio di Luigi Scorzelli, a Salerno. Costruiamo agenti AI e automazioni per piccole aziende senza reparto tecnico. Partiamo da una cosa vista in ogni azienda per cui abbiamo lavorato: le richieste arrivano alle 22 e qualcuno le legge alle 9. Link: luigiscorzelli.com.

**Chiusura**
H2: Raccontateci come gestite oggi le richieste.
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
**Testi del 20/11/2026, da approvare (voce A.2).** La pagina descrive solo l'offerta dell'agenzia. **Proposta da confermare:** i tre servizi intorno a [NOME] che oggi stanno qui (avvio guidato, piano a pagamento, collegamento al gestionale) passano in `/plugin`, con gli stessi testi; qui resta una riga di rimando.

**Titolo SEO**: Agenti AI per preventivi, WhatsApp ed email | aiframe
**Descrizione**: Tre agenti AI per piccole aziende: preventivi e richieste, assistente WhatsApp, smistamento email. Gestiti da noi in UE oppure sul vostro server, con un controllo umano scritto.

- H1: **Quale lavoro volete togliere dalla vostra giornata?**
- Sotto: Costruiamo agenti AI che leggono le richieste, preparano le risposte e passano a una persona i casi dubbi. Prezzi e tempi li trovate in una stima scritta, dopo che ci avete raccontato come lavorate.

**I tre agenti** (titolo: Tre agenti, ognuno con il suo controllo)

| Agente | Per chi | Cosa fa | Cosa resta a voi | Tempi (stima) |
| --- | --- | --- | --- | --- |
| **Preventivi e richieste** | Chi riceve richieste di preventivo e risponde quando trova il tempo | Legge email e modulo del sito, chiede i dati mancanti, calcola un preventivo indicativo dal vostro tariffario, prepara la bozza e salva il contatto in un foglio o nel CRM | Ogni preventivo lo approvate voi prima dell'invio. Le cifre vengono dal vostro tariffario, non dall'AI | 3-4 settimane da quando abbiamo materiali e accessi |
| **Assistente WhatsApp** | Chi riceve su WhatsApp sempre le stesse domande e richieste di appuntamento | Risponde dalle vostre domande frequenti e dai vostri documenti, fissa gli appuntamenti in agenda, manda il promemoria, passa la conversazione a un collega | Le domande fuori dai documenti, i reclami e i prezzi fuori tariffario arrivano a una persona | 4-6 settimane, compresa l'attesa dell'approvazione di Meta |
| **Smistamento email** | Chi ha una casella generica (info@) che nessuno riesce a tenere in ordine | Classifica i messaggi, li inoltra alla persona giusta, passa le richieste di preventivo al primo agente, prepara le bozze per le domande frequenti | Tutte le bozze le rivedete voi. Reclami e messaggi che non rientrano in nessuna categoria arrivano a una persona | 2-3 settimane |

Riga sotto la tabella: I tempi sono stime, non misure: li confermiamo nella stima scritta. Si parte da un agente, gli altri si aggiungono dopo.

**Le due formule** (ancora `#formule`; titolo: Chi gestisce l'agente, e dove stanno i dati?)

| | **Lo gestiamo noi** | **Lo ospitate voi** |
| --- | --- | --- |
| Per chi | Chi vuole un servizio che funziona, senza occuparsi di server | Chi vuole scegliere dove girano il sistema e i modelli AI |
| Dove gira | Server dedicato a voi in un data center dell'Unione Europea, gestito da noi | Server in UE intestato a voi. Il nostro accesso di manutenzione lo potete togliere |
| Modelli AI | Modelli AI con elaborazione in UE, scelti e pagati da noi dentro il canone | Con la vostra chiave: fornitore e regione li scegliete voi |
| Copie di sicurezza e controlli | Li facciamo noi | Li impostiamo e li seguiamo noi, sul vostro server |
| Accordo sui dati | Siamo responsabili del trattamento: accordo scritto con l'elenco dei fornitori | Accordo più corto, solo per gli accessi di manutenzione |
| Se un giorno smettete | Vi consegniamo i flussi e i dati | Il sistema è già vostro |

Sotto la tabella: In tutte e due le formule gli account di Google, WhatsApp e CRM sono intestati a voi. WhatsApp passa sempre da Meta: usiamo solo il canale ufficiale. Con dati sanitari o legali la soluzione si studia a parte.

**Cosa vi chiediamo per partire** (elenco)
- Google Workspace e un amministratore disponibile per circa 30 minuti, con la nostra guida.
- Per WhatsApp: un sito pubblico in HTTPS che descrive l'azienda e un numero dedicato.
- I contenuti: tariffario, domande frequenti, regole degli appuntamenti, chi si occupa di cosa.
- La firma dell'accordo sui dati.

**Su misura** (titolo: Il vostro processo non è tra questi?)
Costruiamo anche agenti e automazioni su processi diversi: collegamenti tra CRM, gestionale ed e-commerce, strumenti che mancano al software standard. Si parte da 30 minuti di chiamata e da una proposta scritta.

**Rimandi** (due righe, in fondo)
- Cerchiamo 5 aziende per i primi casi reali, a condizioni riservate. `Leggi l'offerta` (→ /offerta, evento `click_candidatura`, posizione servizi).
- Avete un sito WordPress e volete provare un assistente prima di un progetto? C'è [NOME], il nostro plugin gratuito (→ /plugin).

Come si procede (titolo: Quattro passi, nessuna sorpresa): gli stessi quattro passi della home. `Prenota 30 minuti` (Calendly, evento `click_prenota`). Pagamento con bonifico su fattura.
Nessuna cifra di prezzo in pagina.

---

## `/offerta`
**Pagina nuova, testi del 20/11/2026, da approvare (voce A.2).** Indirizzo proposto: `/offerta`. Decisioni di Luigi: massimo 5 clienti, solo agenti standard, sconto sull'avvio (canone pieno), candidature fino al 31/03/2027, niente prezzi in pagina. L'entità dello sconto non è decisa: in pagina "condizioni riservate", la cifra va nella stima scritta. Quando i posti finiscono o la data passa, la pagina dice che le candidature sono chiuse e rimanda a `/servizi`; la voce esce dal menu.

**Titolo SEO**: Cerchiamo 5 aziende per i primi agenti AI | aiframe
**Descrizione**: Costruiamo un agente AI per cinque piccole aziende a condizioni riservate, in cambio di un caso d'uso pubblicabile. Candidature fino al 31 marzo 2027.

- Etichetta: 5 POSTI · CANDIDATURE FINO AL 31 MARZO 2027
- H1: **Volete essere una delle prime 5 aziende?**
- Sotto: Costruiamo un agente AI per cinque piccole aziende, a condizioni riservate. In cambio vi chiediamo di poter raccontare com'è andata, con i numeri veri.
- Pulsante `Candidati` (→ #candidatura, evento `click_candidatura`, posizione hero).

**Perché lo facciamo** (titolo: Perché cinque, e perché adesso)
Gli agenti che proponiamo li abbiamo costruiti e provati in demo. Ci mancano i casi reali: aziende vere, con i numeri di prima e di dopo. Preferiamo dirlo che inventare risultati. Per questo apriamo cinque posti a condizioni che dopo non ripeteremo.

**Cosa ricevete** (elenco)
- Un agente a scelta tra i tre: preventivi e richieste, assistente WhatsApp, smistamento email (→ /servizi per i dettagli).
- Uno sconto sul costo di avvio, scritto nella stima che vi mandiamo. Il canone mensile resta quello di listino.
- La formula che preferite: lo gestiamo noi in UE oppure lo ospitate voi.
- Una demo funzionante prima della firma. Se non vi convince, non dovete nulla.
- Nessun vincolo di durata: disdetta con 30 giorni di preavviso.

**Cosa vi chiediamo** (elenco)
- Il permesso scritto di pubblicare il caso, con il nome dell'azienda o in forma anonima: lo scegliete voi.
- Di misurare insieme, prima di cominciare e dopo due mesi di uso, due o tre cose decise all'inizio. Per esempio in quanto tempo parte un preventivo, o quante richieste restano senza risposta.
- Una testimonianza di poche righe a fine prova, solo se siete soddisfatti.
- Una persona di riferimento che conosce il processo e ci risponde durante la costruzione.

**Per chi è** (titolo: È per voi se)
- siete una piccola azienda di servizi e le richieste arrivano da email, modulo o WhatsApp;
- usate Google Workspace;
- avete un sito pubblico in HTTPS (serve per l'agente WhatsApp);
- potete cominciare entro la primavera del 2027.
Riga: Scegliamo aziende di settori diversi e partiamo con una o due alla volta, in ordine di candidatura.

**Come funziona** (4 passi)
1. Vi candidate con il modulo qui sotto: bastano cinque minuti.
2. Vi rispondiamo per email e vi mandiamo una stima scritta.
3. Vedete la demo con dati di esempio della vostra azienda.
4. Firmiamo la scheda di progetto, con i punti da verificare e le cose da misurare, e cominciamo.

**Candidatura** (ancora `#candidatura`; modulo, `FONTE=offerta` in Brevo, evento `candidatura_ok`, rate limit come `/api/contact`)
Campi: Nome e cognome · Azienda · Email di lavoro · Sito web · Quale agente vi interessa (preventivi e richieste / assistente WhatsApp / smistamento email / non so ancora) · Come gestite oggi queste richieste? (testo libero) · Quante ne ricevete in un mese, più o meno? (facoltativo) · Usate Google Workspace? (sì / no / non so).
Consenso: "Ho letto l'informativa privacy e acconsento a essere ricontattato da aiframe su questa candidatura." [da far confermare al consulente privacy]
Pulsante: `Invia la candidatura`.
Dopo l'invio: "Candidatura ricevuta. Vi rispondiamo per email, di solito entro due giorni lavorativi." [tempo di risposta da confermare con Luigi]
Errore: "Non siamo riusciti a inviare la candidatura. Riprovate tra poco o scriveteci a info@aiframe.it."

**Domande frequenti**
- **Quanto costa?** Dipende dall'agente e dalla formula. Lo trovate nella stima scritta, con lo sconto di avvio già indicato.
- **Dove stanno i nostri dati?** In Unione Europea. Potete farci gestire il server oppure tenerlo voi (→ /servizi#formule).
- **L'agente decide da solo?** No. Legge e prepara: preventivi e bozze li approvate voi, e i casi dubbi arrivano a una persona.
- **Cosa succede se non siamo soddisfatti?** Prima della firma vedete una demo e potete fermarvi senza pagare nulla. Dopo, il canone si disdice con 30 giorni di preavviso.
- **Il nostro nome deve comparire per forza?** No. Il caso si può pubblicare in forma anonima.
- **Possiamo avere più di un agente?** Per i cinque posti ne costruiamo uno per azienda. Gli altri si aggiungono dopo, alle condizioni normali.

**Stato chiuso** (quando posti o data sono esauriti)
H1: Le candidature sono chiuse. Sotto: I cinque posti sono assegnati. Gli agenti restano disponibili alle condizioni normali. Pulsante `Vedi i servizi` (→ /servizi).

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
