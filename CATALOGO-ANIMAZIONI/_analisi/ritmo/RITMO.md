# Ritmo e fluidità come Kallaway: verifica e regole proposte

Sessione 6 · catalogo (11–13/10), parallela alla regia dei reel 11–13. **Nessuna funzione del kit è stata cambiata**: le regole
qui sotto aspettano l'ok dell'utente. Dati in questa cartella (`_analisi/ritmo/`), strumenti nuovi in `_tools/`.

## In breve
1. **Durata delle scene.** Una grafica di Kallaway dura in mediana **4,0 s** (p25 2,5 s, p75 6,2 s). Il 4,5 s di prima era un
   po' alto: il rilevatore dei tagli perdeva 173 transizioni morbide (sfocatura, frusta, spinta).
   - Noi: reel-09 **2,6 s** (20 scene in 61,5 s), reel-10 **3,0 s** (10 scene in 34 s).
   - Contando ogni cambio d'immagine, facce comprese, lui cambia **13,9 volte al minuto**. Noi, che abbiamo la faccia sempre
     sotto, cambiamo 19,5 volte al minuto (reel-09) e 17,6 (reel-10): circa un terzo in più.
2. **Dopo un taglio** (12 tagli misurati fotogramma per fotogramma su 11 reel):
   - **un solo movimento principale** nei primi 0,3–0,8 s, che frena forte; poi la camera è quasi ferma e si muovono solo gli
     elementi;
   - la deriva lunga c'è solo in 2 tagli su 12 (il termometro del reel 72: +9,6% in 2,4 s).
   - **Non serve alzare `float()` per tutti**: va cambiato l'inizio della scena, non la tenuta.
3. **Rimbalzo.**
   - La camera di Kallaway non rimbalza: 2 movimenti su 3 non hanno nessun overshoot, e quelli veloci restano sotto l'1%
     nell'82% dei casi.
   - Gli elementi entrano senza rimbalzo visibile (8 entrate su 8).
   - Noi usiamo `back.out` 210 volte, di cui 168 per i pop di scala, quasi sempre con parametro 2–3 (+13–20% oltre la misura
     finale). È la differenza più evidente tra il nostro movimento e il suo.
4. **Prima/dopo** sul termometro (D13): `_analisi/confronti-video/D13_prima_dopo.mp4` (Kallaway | prima | dopo, a velocità
   reale e a 0,5×). Il «dopo» riproduce la sua deriva: +8,6% contro +9,6% in 2,4 s, con la stessa curva power2.out.

## 1. Quanto dura una scena

| | grafiche: p25 · mediana · p75 | tagli al minuto | n |
|---|---|---|---|
| Kallaway, rilevatore di prima (`eventi.py`) | 2,9 · 4,46 · 6,7 s | 12,8 | 971 |
| **Kallaway, con i tagli morbidi** (`tagli_morbidi.py`) | **2,5 · 4,0 · 6,2 s** | **13,9** | 1089 |
| **Kallaway, per idea** (stessa grafica prima e dopo la faccia = una scena) | **2,5 · 4,3 · 6,9 s** | | 946 |
| Nostro reel-09 | mediana 2,6 s (scene 2–5: 2,2 s l'una, quattro pezzi della stessa frase) | 19,5 | 20 |
| Nostro reel-10 | mediana 3,0 s (la scena 4 dura 1,7 s) | 17,6 | 10 |

Come è stato verificato:
- **Il rilevatore perdeva le transizioni morbide.** Un agente ha controllato a vista due reel:
  - reel 45: 4 tagli persi e 1 falso;
  - reel 63: un taglio a frusta incerto.
- **Rilevatore nuovo** (`_tools/tagli_morbidi.py`): c'è un taglio quando, tra 4 fotogrammi prima e 4 dopo, la composizione non
  ha più punti in comune (ORB + RANSAC); se i punti corrispondono è un movimento di camera.
  - Sul reel 45 ritrova i 4 tagli persi.
  - Escludendo i 0,5 s dopo un taglio netto, dove c'è l'arrivo in corsa, sui 105 reel aggiunge 173 tagli.
- **Non verificato:** le parole per scena. La trascrizione dei reel di Kallaway non è stata fatta, perché l'agente si è
  fermato sul limite di sessione. La regola sotto usa la struttura delle frasi, non un conteggio di parole.

### 1 bis. Scene per idea
`_tools/idee.py`: quando dopo la faccia torna la **stessa** grafica (si confrontano l'ultimo fotogramma prima e il primo dopo,
ORB + RANSAC), le due parti contano come una scena sola.
- Su 325 casi «grafica → faccia (< 4 s) → grafica», la stessa grafica torna 143 volte (44%).
- Le idee sono 946: l'88% sta in un solo segmento, 96 in due, 20 in tre o più.
- **Una scena-idea dura in mediana 4,3 s (p25 2,5 s · p75 6,9 s); da inizio a fine, faccia compresa, 4,4 s (2,5–7,0 s).**

La regola che ne viene: **una scena per idea, attorno ai 4 s, normalmente fra 2,5 e 7 s**. Nei nostri reel la faccia sta sempre
sotto e non c'è lo stacco sul volto a cambiare l'immagine: per questo conviene restare nella parte bassa dell'intervallo e non
superare ~14 cambi d'immagine al minuto.

## 2. Cosa fa la camera dopo un taglio
Strumento `_tools/deriva.py`: trasformazione (scala + spostamento) dal primo fotogramma dopo il taglio, stimata **solo sugli
elementi fermi** (maschera; esclusi barre che si riempiono, bagliori, video interni), con la verifica a vista (fotogramma finale
riportato indietro sul primo: ciò che la misura segue diventa giallo). Fogli in `deriva/`. Dove il contenuto cambia troppo la
misura non regge e la classe viene dalla verifica a vista (`deriva/anteprima_*.jpg`).

| # | reel · istante | scena | dopo il taglio (0–3 s) | numeri |
|---|---|---|---|---|
| 0 | 72 · 9,33 s (D13) | scala + termometro | **deriva lunga**: si avvicina frenando | +9,6% in 2,4 s, centro +78/+23 px, power2.out; angoli 86 → 41 → 8 px/s a 0,25/1/2 s |
| 1 | 100 · 92,5 s | lista «Triple Hook» | **ferma**, le voci vanno a fuoco | 0,0% per 1,8 s |
| 1b | 100 · 94,4 s (O27) | cornice dell'amo | entra con uno zoom (transizione), poi ferma | −30% in ~0,15 s |
| 2 | 56 · 11,5 s (H04) | tre teste | **ferma**, la card centrale cresce (animazione dell'elemento) | card laterali ferme |
| 3 | 69 · 10,76 s (L16) | lista «3 Types of Hooks» | si costruisce in 0,5 s, poi **un colpo** di zoom e ferma | +16% in ~0,35 s (0,55–0,9 s) |
| 4 | 31 · 74,8 s | telefono con video | **arrivo** dal basso che frena, poi ferma | −112 px, expo.out; 175 → 11 px/s a 0,25/1 s |
| 5 | 46 · 35,8 s | «Fandom Formula» | **ferma**, le icone si spostano | — |
| 6 | 48 · 25,6 s | documento | **zoom lento continuo** (accelera) | +3,4% a 1 s, +17% a 2 s, +24% a 2,5 s |
| 7 | 98 · 36,6 s | tabella | **arrivo** dal basso, poi deriva minima | −160 px in 0,75 s, power1.out |
| 8 | 65 · 58,75 s | lista «Super Share» | **arrivo** di lato, poi ferma | −137 px, expo.out; 230 → 1,5 px/s a 0,25/1 s |
| 9 | 19 · 36,5 s | screenshot | **ferma**, scorre solo lo schermo | — |
| 10 | 27 · 34,8 s | documento → seconda card | ferma, poi a 1,2–2,0 s **seconda inquadratura** (zoom indietro) | −47% |
| 11 | 49 · 68,6 s | cerchio «Create Advocates» | **arrivo** con zoom in ~0,4 s, poi ferma; a 2,5 s cambio di colore (F08) | ~+15% |

Riassunto:
- **arrivo che frena e poi ferma:** 5 casi (4, 7, 8, 11, 1b);
- **ferma, si muovono gli elementi:** 4 casi (1, 2, 5, 9);
- **deriva lunga:** 2 casi (0, 6);
- **colpo o seconda inquadratura dentro la scena:** 2 casi (3, 10).

Il titolo resta sempre fermo (HUD). Nel reel 72 anche la griglia dello sfondo resta ferma e si muove solo il contenuto: il nostro
sfondo a puntini invece si muove con la camera.

Su tutte le 773 grafiche, con la misura grezza (sporcata dalle animazioni locali), nei 3 s dopo un taglio lo zoom vale in mediana
|7%| e lo spostamento 114 px. Contiene arrivi e colpi, quindi non va letto come una deriva continua (`deriva_popolazione.json`).

Nel kit, `float()` fa +2,5% in tutta la durata (di solito 3–5 s) con una curva quasi lineare: va bene per la tenuta. Quello che
ci manca è il movimento iniziale. Le nostre scene partono spesso con `cutRect` fermo e poi costruiscono gli oggetti pezzo per pezzo.

## 3. Curve e rimbalzo

**Camera** (`_tools/eventi.py`, ora con la curva con segno e `back.out` fra le candidate; i file di prima sono in
`backup/`; le chiavi vecchie sono identiche, ne sono state solo aggiunte):

| curva con segno (movimenti significativi, giu-ott-dark) | n |
|---|---|
| power2.out | 492 |
| sine.out | 370 |
| power1.out | 351 |
| power1.in | 236 |
| linear | 212 |
| power3.out | 202 |
| back.out (1 · 1,7 · 2,5 insieme) | 214 su 2.887 (7%) |

Overshoot misurato sui 2.887 movimenti valutati:
- il 67% sta sotto l'1%; la mediana è 0 e il p75 è 3,8%;
- nei movimenti veloci, cioè quelli principali e le transizioni (328), l'82% sta sotto l'1% e il p90 è 4,7%;
- i casi con un rimbalzo plausibile secondo i criteri dell'agente sono 25 su 2.887;
- gli overshoot grandi (>20%) vengono quasi tutti da due movimenti consecutivi o dalle animazioni locali.

**Elementi** (`_tools/pop.py`: un modello preso dal fotogramma finale, cercato fotogramma per fotogramma su posizione e scala;
strisce in `pop/`):

| entrata | come entra | rimbalzo |
|---|---|---|
| D02 badge views (reel 1) | scala 0,66 → 1,00 in 0,13 s | 0% |
| D02 badge (reel 1) | compare in 2 fotogrammi | nessuno visibile |
| H03 tag «Names» (reel 76) | scivola fuori da dietro il telefono | 2,7% (rumore) |
| H03 tag «Percentages» (reel 76) | era già in scena, compare il testo | — |
| O03 loghi TikTok / YouTube (reel 6) | dissolvenza a scala piena in ~0,13 s | 0% |
| L16 card «Text Hook» (reel 69) | sale e compare insieme | 0% di scala |
| U05 card Inbox (reel 9) | entra da destra, frena morbida | nessuno visibile |

**Nostro codice** (`_script_rimbalzo/r01_conta_ease.json`, `r02_classifica_back.json`):
- `back.out` 210 volte (kit 114, reel 77, il resto nelle demo), `sine.out` 4;
- dei 210 `back.out`, 168 sono pop di scala;
- parametri usati: 3,0 (71 volte), 2,0 (35), 2,4 (28), 2,2 (22), 2,6 (21).

## 4. Regole proposte (da approvare)
- **R1 · Una scena per idea.** Si cambia scena dove cambia l'idea (fine di frase o soggetto nuovo), mai a metà frase.
  - Durata tipica **~4 s**; tra 2,5 e 6 s è normale.
  - 7–8 s solo se dentro c'è una seconda inquadratura dello stesso mondo.
  - Conto indicativo: 60 s → 13–15 scene, 34 s → 7–8.
  - Contando ogni cambio d'immagine (tagli + seconde inquadrature): non più di ~14 al minuto.
- **R2 · Un movimento principale, subito.** Parte entro 0,1 s dal taglio e dura 0,3–0,8 s. Può essere:
  - un arrivo in corsa (100–350 px, oppure uno zoom del 10–25%) con una frenata forte (`arrive`, expo.out, power2.out);
  - oppure un riempimento o un conteggio che parte al primo fotogramma.
  - La scena è già piena al taglio (A02): niente oggetti che si costruiscono pezzo per pezzo dopo il taglio.
- **R3 · Poi si legge.**
  - La camera è quasi ferma: deriva di 1–2% che si spegne.
  - Si muove solo ciò che la voce nomina (fuoco, accensioni, conteggi), al massimo 2–3 accenti piccoli.
  - Un secondo movimento di camera solo se la frase introduce una seconda cosa.
- **R4 · Deriva lunga solo per un oggetto solo** che si legge (termometro, documento):
  - spinta del +8–10% in ~2,4 s con power2.out (reel 72);
  - oppure zoom lento continuo (reel 48).
- **R5 · Curve.**
  - Camera e grandi spostamenti: solo decelerazioni morbide (power2.out, sine.out, power1.out, `KW.arrive`). Mai `back.out`.
  - Pop degli elementi: opacità + scala 0,8 → 1 in **0,1–0,2 s** con power2.out, senza rimbalzo (misurati: badge 0,66 → 1 in 0,13 s; loghi in dissolvenza a scala piena in 0,13 s; card e tag scivolano dentro e frenano, senza passare oltre).
  - `back.out` resta solo per un colpo voluto (timbro F12), con parametro ≤ 1,2.
- **R6 · Riempimenti e conteggi continui** (lineari o quasi: termometro lineare nel reel 72, contatore "none" nel reel 59,
  corsa sine.out nel reel 65), non a scatti con le pause in mezzo.
- **R7 · Da valutare:** in Kallaway titolo e griglia di fondo restano fermi mentre il contenuto deriva.

## 5. Prima/dopo sul termometro (D13)
- Video: `_analisi/confronti-video/D13_prima_dopo.mp4` (prima a velocità reale, poi a 0,5×). Lab: `_analisi/ritmo/lab-d13/`
  (anteprima :3030), render `_analisi/render/lab-d13_dopo_bozza.mp4`.

| | Kallaway (reel 72) | prima (demo-6) | dopo (lab) |
|---|---|---|---|
| al taglio | scala e termometro già pieni | la scala si costruisce in 0,6 s, il termometro sfuma | già pieni, nomi già leggibili |
| riempimento | uno, lineare, 2,25 s dal primo fotogramma | 5 scatti da 0,5 s (power2.inOut) con pause, fino a 3,6 s | uno, lineare, 2,25 s |
| gradini | si accendono quando la barra li supera | si accendono e si scrivono a ogni scatto | si accendono quando la barra li supera |
| camera | +9,6% in 2,4 s, power2.out, poi quasi ferma | `float` +2% in 5,4 s, quasi lineare | +8,6% in 2,4 s, power2.out, poi +1% |

Tutto è scritto nel sorgente del lab (`camK` con una curva diversa, il riempimento preso dal DOM del termometro): nessuna funzione
del kit è cambiata.

## 6. Reel-10: quali scene unirei (senza modificarlo)
Da 10 a **7 scene**: durate 4,1 · 6,1 · 4,7 · 4,4 · 7,8 · 3,6 · 2,9 s, mediana 4,4 s, 12,3 cambi al minuto (Kallaway 13,9).
| ora | scene di oggi | perché |
|---|---|---|
| 1 | 1 (0–4,1) | hook: resta |
| 2 | **2 + 3** (4,2–10,3) | è una frase sola ("non la mostra a tutti, la fa vedere prima ai follower che interagiscono di più"). Oggi sono 5 movimenti separati: si entra nel cerchio, l'editor, il dito, il telefono che diventa anelli, l'anello lime con i raggi e le icone. Unita: taglio sugli anelli con la tua storia al centro, un solo movimento (l'anello di prova si accende), poi si leggono volti e reazioni |
| 3 | **4 + 5** (10,3–15,0) | "misura una cosa sola: se la aprono e quanto ci restano". La scena 4 dura 1,7 s ed è un viaggio K09 per mezza frase. Unita: taglio dentro il telefono del follower, gli angoli sul cerchio, il dito apre, barra e cronometro lineari |
| 4 | 6 (15,1–19,5) | la strada negativa: resta |
| 5 | **7 + 8** (19,6–27,4) | la strada positiva è una frase sola. Like, risposta e condivisione diventano un'esplosione unica (come U13, reel 123: tutto subito, poi si legge); poi l'unico secondo movimento, il cerchio che sale al muro |
| 6 | 9 (27,5–31,1) | cosa non conta: resta |
| 7 | 10 (31,2–34,1) | la conclusione, cosa conta: resta. Volendo si unisce alla 9 (6 scene) |

Lo stesso difetto c'è nel reel-09: le scene 2–5 sono quattro pezzi da 2,2 s di "Comprano per come si sono sentiti. E se il tuo
video non fa provare niente, può essere corretto in ogni singola parola e non servire a niente." Per idea sono 2 scene.

## 7. Dopo l'ok: cosa cambierebbe
Il 12 e il 13 sono in costruzione: una modifica globale del kit li cambierebbe al prossimo build. Proposta: un marcatore
**`KW_RITMO`** nel sorgente, il contrario di `KW_FISSO`, che attiva il comportamento nuovo solo dove c'è.
- **Con `KW_RITMO` (consigliato): non cambia nessuna demo e nessun reel esistente.**
  - Lo usano demo-9 (Blocco 3 ter) e i reel nuovi; il 12 e il 13 solo se la regia lo decide.
  - Nel kit si aggiungerebbero:
    - `spinta()` (R4);
    - `popK()`, il pop morbido (R5);
    - un'opzione `ease` per i riempimenti (`thermo.to`, `progressBar`…, R6);
    - con il marcatore, i pop di scala del kit passerebbero da `back.out(2–3)` a power2.out.
- **Senza marcatore (globale):**
  - cambierebbero al prossimo build demo, demo-2…demo-8 e demo-oggetti;
  - cambierebbero anche il 12 e il 13 se ricostruiti, per questo si farebbe solo dopo la loro consegna;
  - reel-01 v5 e reel-03 restano fermi (`KW_FISSO`);
  - 09, 10 e 11 sono consegnati e non si ricostruiscono.
- Poi: regole in `KIT-V2.md`, in `PROMPT-REEL-10-13.md` (sezione «Ritmo») e in `PROMPT-REGIA-SOTTOAGENTI.md`.

## Strumenti nuovi
| strumento | cosa fa |
|---|---|
| `_tools/deriva.py` | deriva della camera dopo un taglio sugli elementi fermi; SIFT a due livelli (HUD fermo e mondo) oppure `--metodo ecc` |
| `_tools/pop.py` | entrata di un elemento: scala e posizione per fotogramma, rimbalzo |
| `_tools/tagli_morbidi.py` | tagli persi da `eventi.py` |
| `_tools/idee.py` | scene per idea |
| `_tools/confronto_video3.py` | video Kallaway \| prima \| dopo |
| `_tools/eventi.py` | in più la curva con segno, `back.out` e l'overshoot (lo ha aggiunto il sotto-agente; backup in `ritmo/backup/`) |

## 8. Aggiunte del 13/10 sera (dal riesame dell'analisi)

### R8 · Transizioni tra una scena e l'altra (nuova, da confermare)
Misura sui 105 reel (`eventi.json` + `tagli_morbidi.json`):
- Su 2.195 cambi d'immagine, 1.629 (74%) vanno verso la faccia di Kallaway o ne tornano: è lo stacco sul volto che fa respirare le
  grafiche.
- Fra una grafica e l'altra (566 cambi), il **taglio netto vale 2 volte su 3** (393). La **transizione morbida** (frusta,
  sfocatura, spinta, zoom-through) vale **1 volta su 3** (173).
- Dopo il taglio, nel 17% delle grafiche la scena arriva già in corsa (165 su 971, partenza oltre 900 px/s, frenata al 10% in
  0,32 s).

Regola. Nei nostri reel la faccia sta sempre sotto, quindi ogni cambio è da grafica a grafica:
- di base si cambia scena **con un taglio netto** e un arrivo che frena (R2);
- una transizione morbida circa una volta ogni tre cambi, dove le due idee si toccano (match cut, la stessa cosa che si
  trasforma), **mai a ogni cambio**;
- niente lunghe corse della camera attraverso il vuoto fra due scene.

### Come costruire la scena «piena al taglio» (R2)
Gli oggetti vanno montati **prima** del taglio, mentre si vede ancora la scena precedente o, nel lab, sotto una copertina che
sparisce al taglio (`lab-d13`: `ld.build(0.1, 0.5)`, `th.show(0.1)`, copertina tolta a T0 = 1,0 s). Al taglio parte solo il
movimento principale.

### Come misurare senza sbagliare (limiti degli strumenti scoperti in questa analisi)
- **`confronto_moto.py`:**
  - il profilo «camera» si sporca con le animazioni locali (una card che cresce, un pesce che nuota) e con i tagli verso la faccia
    dentro la finestra. Le «derive di 100–150 px/s» annotate nelle voci D13, O27, H04 e L16 venivano da qui e non erano vere;
  - la finestra di Kallaway va presa su un solo segmento grafico, senza tagli.
- **`deriva.py`:**
  - la maschera va scelta **a vista** sugli elementi fermi del mondo, escludendo barre, bagliori, video interni ed elementi che
    entrano;
  - il titolo e lo sfondo di Kallaway sono fermi (HUD): lo strumento li separa (livello «mondo»), ma le griglie regolari possono
    ingannarlo;
  - sulle grafiche scure con pochi dettagli SIFT trova pochi punti: provare `--metodo ecc`, che però regge solo se dentro la
    maschera il contenuto non cambia;
  - controllare sempre i pannelli di verifica (giallo = la misura segue il contenuto);
  - sui nostri render la scena al taglio deve già esistere, sennò il primo fotogramma è vuoto e la misura fallisce.
- **`pop.py`:**
  - il modello viene dall'ultimo fotogramma: se all'inizio l'elemento non c'è ancora, il tracciamento si aggancia ad altro (badge 1
    del reel 1);
  - una lista che si ricentra sembra un rimbalzo di posizione (L16);
  - guardare sempre la striscia.
- **`eventi.py`:** non vede le transizioni morbide (`tagli_morbidi.py` le aggiunge). Ora misura anche la curva con segno e il
  rimbalzo della camera; i dati vecchi sono identici.
- **Non misurato:** le parole per scena di Kallaway (servirebbero le trascrizioni: `hyperframes transcribe … -m small.en`).
