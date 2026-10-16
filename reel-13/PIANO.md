# Reel 13/10 — "Le storie in evidenza" · stile Kallaway (sotto-agente della regia, sessione 6)

**Stato delle tappe** (aggiornare a ogni passo): 1 piano ✔ (scene riorganizzate il 11/10 sera: ritmo di 4–7 s per idea e safe
zone a y 1332, vedi «Scene») · 2 spezzoni ✔ (`spezzoni_c.py`, da DA PUBBLICARE fuori dai momenti di 09/10/11/12; foto CC0 in
`assets/img`) · 3 build: kit `kw-kit/kit2-reel13.js` ✔, blocchi A (1–2), B (3–5) e C (6–7) ✔ (snapshot guardate e corrette, `check` 0 errori) ·
4 densità ✔ (13/13 inquadrature sopra soglia, la più bassa 0,348 / 0,90: `densita.txt`) · 5 render di prova + foglio dei fotogrammi sulle parole (niente `_sync.mp4`, richiesta dell'utente del 12/10): ✔
(`CATALOGO-ANIMAZIONI/_analisi/render/reel-13_bozza.mp4`, 13/10 07:51, 1358 fotogrammi; `safezone.py`: 0 campioni sotto la linea;
foglio delle parole `reel-13/parole.jpg`) · 6 confronto con Kallaway ✔ (`CATALOGO-ANIMAZIONI/_analisi/confronti-video/reel13_confronto.mp4`, 13 coppie, velocità
reale + 0,5×; strisce `_analisi/moto/K07_reel13`, `K13_reel13`, `D01_reel13`, `U07_reel13`) e correzioni ✔ (build e `check` 0 errori,
verificate con le snapshot; su richiesta dell'utente niente seconda bozza) · 7 server dell'anteprima :3027 avviato dalla regia ·
rapporto alla regia ✔ (13/10 mattina). 4K solo su richiesta della regia: `node kw-kit/deliver.cjs reel-13 13` (senza copertina).

45,27 s (1358 fotogrammi) sui tempi veri della voce: `../my-video-ottobre-p1-test/src/words/d13.ts`, 124 parole, controllato
con `_tools/verifica_parole.py 13` contro `timestamps_ottobre_p1.csv` e l'mp3 `velocizzati 110%/2026-10-13.mp3` (45,234 s):
"OK: corrisponde". 30 fps. Niente grafica sotto y ≈ 1320 (safe zone dell'11/10, `SAFEZONE.jpg`: da 1332 c'è la faccia; il
mondo sfuma nel fondo tra 1288 e 1330). Pattern: **P10** (UI di Instagram: il profilo e le storie in
evidenza) + **P02** (lista in ordine: 1 presentazione, 2 risultati, 3 domande frequenti, poi gli extra). Gemello di Kallaway
**3** ("The reason your personal brand is not growing": il profilo vero che cresce in un telefono, la lista sopra il profilo
sfocato, gli angoli di selezione, il telefono che si accende alla fine).

## L'idea: gli oblò del profilo
Chi arriva sul tuo profilo non ti scrive finché ha dei **dubbi** (chi è? funziona? quanto costa?). Prima di scriverti guarda
**dentro**: le storie in evidenza sono **gli oblò** del profilo, cerchi da cui si vede dentro la tua attività. La camera fa come
chi guarda: **entra** in un cerchio, dall'altra parte c'è la storia vera, poi **esce** e torna al profilo.
- Se negli oblò ci sono **storie a caso** (pizza, mare, gatto…), i dubbi restano lì, grigi, e il tasto "Messaggio" resta a 0.
- Nell'ordine giusto ogni oblò **scioglie un dubbio**: la presentazione risponde a "chi è?", i risultati a "funziona?", le domande
  frequenti a "quanto costa?". Quando l'ultimo dubbio cade, il lucchetto sul tasto "Messaggio" si apre.
- Il finale chiude il cerchio dell'hook: l'ultima entrata è nel DM, dove arriva il messaggio di chi guardava.

Chi guarda è **una persona qualunque** di profilo (`personaK`, la sagoma del reel 09), mai il volto di uno sconosciuto; la tua
foto vera (`avatar(…, "tu")`) è sul profilo, sulle storie e sulla copertina "Chi sono".

**Grammatica spaziale (assegnata dalla regia): la PROFONDITÀ.** Il mondo ha un centro, il tuo profilo con la fila delle
evidenze, e delle "stanze" dietro ogni cerchio. La camera non viaggia di lato (09), né in verticale (10), né in diagonale (11), né
sull'asse orizzontale (12): **entra ed esce** dagli oggetti. Entrate: dalla foto profilo del tuo reel al profilo (hook) · nella
prima evidenza a caso · nelle evidenze 1, 2, 3 · nel tasto "Messaggio" (finale). Uscite: da ogni stanza di nuovo al profilo, e
alla fine un passo indietro su tutto il profilo.

**Match cut** (tutti sul cerchio): la foto profilo del reel → la foto profilo del profilo · l'evidenza → l'iride della storia
(stesso posto e stessa misura sullo schermo al taglio, poi si apre) · la storia si richiude nel cerchio, che diventa lime · le
evidenze a caso cadono e lasciano tre posti vuoti numerati · dagli oblò degli extra escono gli oggetti (la fotocamera, il
cartellino, le stelle) · le evidenze dentro la vetrina · il tasto "Messaggio" → il DM.

Il dispositivo nuovo del reel è **l'oblò** (`obloInR13` / `obloOutR13` in `kw-kit/kit2-reel13.js`), nello stile di K07
(zoom-through) + K13 (match cut: un punto diventa l'oggetto): corsa nel cerchio con lo zoom esponenziale (velocità percepita
costante), taglio sotto un filo di sfocatura, iride che si apre con la cornice d'acciaio dell'oblò e la copertina che si dissolve
nella storia; l'uscita è lo stesso gesto al contrario.

## Scene (tempi = parole della voce, indici di `parole.py`)
Riorganizzate l'11/10 sera sulle indicazioni della regia: **una scena per idea** (4–7 s, come la mediana di 4,5 s di Kallaway),
in ogni scena un movimento principale subito dopo il taglio (di solito l'oblò) e poi una tenuta leggibile con la camera che
scivola; curve morbide (power2/sine), `back.out` solo per i piccoli pop. Safe zone a 1332: tutto sta entro y ≈ 1290–1320.

| # | Tempo | Voce | Cosa si vede | Catalogo |
|---|---|---|---|---|
| 1 | 0–5,65 | "Ti sei mai chiesto perché arrivano sul profilo e non ti scrivono? Anche quando i contenuti funzionano?" | Fotogramma 0 pieno: **il tuo reel vero** nel feed (interfaccia dei Reels con la tua foto) e attorno sei persone qualunque che lo guardano, rack focus. "perché": la tua foto pulsa e le persone ci entrano dentro; "arrivano": **la camera entra nella tua foto (l'oblò)** e dall'altra parte c'è la foto del tuo **profilo vero**, che si apre come un'iride con la cornice d'acciaio. "e non ti scrivono": il dito va su "Messaggio", esita e se ne va, gli angoli si chiudono sul tasto e la pill dei messaggi resta a **0**. "anche quando i contenuti funzionano": la camera scivola sulla griglia dei tuoi reel veri, poppano le **views** (48,2K · 103K · 31,5K) e diventano lime; la pill è ancora a 0. | A02 · K10 · oblò (nuova: K07 + K13) · U02 · U07 · H04 · D02 · F08 |
| 2 | 5,65–12,45 | "Perché dopo il profilo aprono le storie in evidenza e lì trovano storie a caso senza risposta." | Sul profilo la linea di lettura scende dal tasto alla **fila delle evidenze** (copertine a caso: mare, pizza, gatto, concerto, auto); "aprono": il dito tocca "Estate 23" e l'anello gira come in Instagram; "storie in evidenza": gli angoli sulla fila; **si entra nell'oblò**: la storia vera "Estate 23" (24 segmenti). Accanto chi guarda (persona qualunque) e i suoi tre **dubbi** grigi: "Chi è?", "Funziona?", "Quanto costa?". "storie a caso": il dito tocca e passano pizza, gatto, concerto, auto, torta; "senza risposta": i dubbi tremano e restano grigi, la storia si spegne; si esce dall'oblò. | K03 · C01 · U07 · U16 · H04 · oblò · K11 (raffica) · `personaK` · F11 |
| 3 | 12,45–20,42 | "Al primo posto va la presentazione. Chi sei e di cosa ti occupi? In modo che chi arriva da un video lo capisca senza cercare." | Le evidenze a caso **cadono** grigie e restano **tre posti vuoti numerati**; "primo": il numero 1 si accende; "va": la tua foto vola nel posto 1 e atterra, "presentazione": l'etichetta "Chi sono". **Si entra**: la storia "Chi sono" con **la tua faccia vera**; "Chi sei": lo sticker "Ciao, sono Samuele"; "di cosa ti occupi": "Ti porto clienti da Instagram". "chi arriva da un video": in alto **il tuo reel** (lo stesso del feed) e la linea tratteggiata fino a chi guarda; "lo capisca": il dubbio "Chi è?" diventa lime, impulso; "senza cercare": gli angoli sugli sticker. Si esce. | F11 · K08 · L01 · F02 · T06 · oblò · U16 · sticker (nuova) · C01 · F08 · H04 |
| 4 | 20,42–26,7 | "Al secondo i risultati portati ai clienti. Prove concrete, numeri, prima e dopo." | Sul profilo il 2 si accende e la copertina "Risultati" (freccia che sale, lime) atterra; **si entra**: la storia "Risultati" di un cliente (volto vero, esempio una tantum): "prove concrete" lampo da screenshot e angoli sulla card; "numeri": la card degli **account raggiunti** conta da 2.140 a 18.940 col grafico; "prima e dopo": la griglia del cliente passa dal grigio al lime con **la tendina**. Chi guarda: "Funziona?" diventa lime. Si esce. | L01 · F02 · oblò · U16 · H04 · D01 · A07 · prima/dopo (nuova, nello stile di F11) · F08 |
| 5 | 26,7–33,55 | "Al terzo le domande che ti fanno più spesso. Quelle che uno si fa prima di contattarti, così lo rassicuri subito." | Il 3 si accende, la copertina "Domande" atterra; **si entra**: lo sticker **"Fammi una domanda"** con la tua foto e le domande che arrivano ("Quanto costa?" ×24, "Come funziona?" ×17, "Quanto tempo serve?" ×12); "quelle che uno si fa": una linea dalla domanda al dubbio di chi guarda; "prima di contattarti": il tasto **Messaggio col lucchetto**; "rassicuri": le risposte arrivano, l'ultimo dubbio diventa lime, il **lucchetto si apre**; "subito": chi guarda si accende. Si esce. | L01 · oblò · U16 · U13 · C01 · L05 · F02 · F08 |
| 6 | 33,55–38,5 | "Poi, come extra, il dietro le quinte, le offerte, le testimonianze." | Le tre evidenze lime in fila; la fila scorre come in Instagram e su "extra" arrivano tre posti col "+"; sulle parole **dagli oblò escono gli oggetti** verso la camera: la **fotocamera vera** con la spia REC (dietro le quinte), il **cartellino** −20% (offerte), la **recensione a cinque stelle** con un volto vero (testimonianze). | oggetti dagli oblò (nuova) · `fotocamera` · F07 |
| 7 | 38,5–45,27 | "Non è una vetrina da riempire. È l'ultima cosa che qualcuno legge prima di decidere se scriverti o no." | La fila torna indietro e diventa una **vetrina** di vetro: cerchi a caso entrano e la riempiono, poi si spengono e scivolano fuori; "è l'ultima cosa": la camera fa un passo indietro su tutto il profilo, la linea di lettura scende dalla bio alle evidenze e si ferma col punto lime; "qualcuno legge": chi guarda, a sinistra, col suo sguardo sulle evidenze; "prima di decidere": il dito esita tra "indietro" e "Messaggio"; "scriverti": **preme Messaggio e la camera entra nel DM** (l'ultimo oblò): arriva il suo messaggio, i dubbi sono tutti lime e la pill dei messaggi passa da 0 a **1**. | vetrina (nuova) · F11 · K03 · C01 · U07 · oblò · U09 · F02 |

## Correzioni dopo la bozza e il confronto con Kallaway (13/10)
- **L'oblò più secco** (strisce K07 col reel 50 e K13 col reel 46: il passaggio di Kallaway dura ~0,5 s, il nostro 0,83 s): iride
  0,5 → 0,42 s, assestamento 0,55 → 0,45 s; nella corsa il cerchio va al centro presto (`easePos: "power2.out"`).
- **D01** (reel 9: il contatore dura ~1 s e la card arriva già piena): la card degli account raggiunti c'è dall'entrata, conteggio 0,95 s.
- Regia: 14,1 s "la presentazione" arriva pulita (la parola lunga parte 0,1 s prima, il box finisce di crescere entro 14,15 s);
  41,1 s chi guarda entra su "l'ultima" (prima la metà sinistra restava vuota fino a 41,6 s).
- Prima della bozza: stanza dei Risultati con contenuto subito (l'iride si apriva su una storia vuota), oggetti degli extra alzati
  sopra la safe zone e più piccoli, pill 0 → 1 senza testi sovrapposti, parte alta del profilo spenta (testi, non veli) quando la
  camera è più giù.

## Oggetti e materiali
- Dal kit: `phone2`, `tapFinger`, `igStoryView`, `storyCircle`, `personaK`, `selectCorners`, `viewBadge`/`popSeq`, `statCard`,
  `fotocamera`, `connector`, `signal`, `pulse`, `ripple`, `sparks`, `sheenK`, `typeIn`, `titleW`, camera kit2.
- Nuovi, in `kw-kit/kit2-reel13.js` (suffisso R13): profilo con la fila delle evidenze, cerchio in evidenza (copertina, anello,
  caricamento, numero), camera in profondità (`zoomR13`), **oblò** (entrata e uscita), sticker delle storie, sticker delle
  domande, dubbi di chi guarda, tasto "Messaggio" col lucchetto, prima/dopo con la tendina, cartellino, recensione, vetrina, DM.
- I tuoi reel veri in movimento (`spezzoni.txt` → `assets/clips/`, 30 fps, un fotogramma chiave al secondo): il reel del feed,
  la storia "Chi sono", lo sfondo delle domande, la griglia del profilo.
- Storie "a caso": foto CC0 / pubblico dominio da Openverse (`assets/img/`, fonti in `assets/img/FONTI.txt`).

## Documentazione condivisa
`kw-kit/KIT-V2.md` (sezione «Reel 13/10») e catalogo: voci **K18** (l'oblò), **U18** (profilo con le storie in evidenza in
ordine), **F14** (prima e dopo con la tendina) in `_tools/catalogo_dati.py` + IMPL in `_tools/genera_catalogo.py`.

## Verifiche
`check` 0 errori · snapshot sulle parole chiave · densità ≥ 0,23 e copertura ≥ 0,54 al 60% di ogni scena (`densita.txt`) ·
render di prova + `_sync.mp4` con la voce · confronto con Kallaway (3 per profilo e angoli; 50 per K07; 46/14 per K13; 65 per il
dito; 9 per la card; 123 per le domande) · anteprima :3027.
