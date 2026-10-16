# Note sugli effetti — studio fotogramma per fotogramma (ritagli a risoluzione piena)

Strumenti: `_tools/ritaglio.py` (ritagli 1080x1920, fps nativo o campionato). Immagini in `_analisi/fx/`.
Tempi in secondi; i nostri reel restano a 30 fps (i valori vanno applicati in secondi).

## E01 · Parola che compare quando la pronuncia (titoli) — reel 79 (0,4–0,85 s), reel 1 (0,13–0,6 s)
- Unità = **parola** (non lettera): ogni parola compare nel fotogramma in cui viene detta.
- Stato iniziale: grigia (≈55–60% luminanza), **sfocata 8–10 px** (a 1080 px), leggermente più in basso (~4–6 px).
- In 4–5 fotogrammi (≈0,17–0,21 s) → bianca, nitida, in posizione. Curva: veloce all'inizio (ease-out).
- Le parole in serif corsivo ("Storytelling", "addictive", "Way To Speedrun") hanno lo stesso trattamento, a volte con sfocatura più forte (~12 px) perché più grandi.
- Il testo bianco ha un **bagliore morbido** costante (bloom: alone ~15–25 px a bassa opacità).
- Quella che a bassa risoluzione sembra "pixelata" è questa sfocatura + compressione: NON è un mosaico vero (vedi E09 per il mosaico vero, raro).

## E02 · Box evidenziatore che si allarga mentre la parola compare — reel 1 (0,13–0,6 s)
- Fotogramma 1: **linea rossa verticale sottile** (cursore, ~6 px) dove inizierà il box.
- Il box cresce da sinistra verso destra (≈0,4 s), il bordo destro avanza **insieme** alle lettere: le lettere dietro il bordo sono già bianche, quelle davanti sono grigie e sfocate.
- Il box si adatta alla larghezza finale del testo (padding orizzontale ~0,3 em). Niente rimbalzo.

## E03 · Badge numerici che "poppano" in sequenza — reel 1 (0,87–1,07 s)
- Pill verdi con icona occhio + valore ("15.1M") sotto ogni card: una alla volta, ~0,07–0,1 s di distanza, pop di scala 0,8→1 con leggero overshoot.

## E04 · Lista con segnaposto sfocati che si risolve con uno SHEEN — reel 5 (9–12,4 s)
- Barre scure arrotondate (grigio ~#1c1c1c), **accento rosso verticale sul bordo sinistro** (~6 px), numero "01" bianco bold, testo sfocato (blur ~6 px) e grigio.
- Quando arriva una nuova voce la pila si **ri-centra verticalmente** (scorre in su di mezza riga, ~0,3 s) + drift lento continuo verso l'alto.
- Risoluzione della voce sulla parola: una **banda di luce diagonale** attraversa la barra **da destra a sinistra** in ≈0,75 s; il testo si mette a fuoco al passaggio della banda; poi la barra diventa "attiva": riempimento un po' più chiaro, **bordo bianco sottile**, scala +3%. Le altre restano sfocate.

## E05 · Sheen che "risolve" la voce successiva — reel 5 (34,08–34,92 s)
- Banda di luce diagonale (≈40 px, inclinata ~20°, nucleo bianco + alone sfumato) entra dal **bordo destro** della barra e la attraversa **verso sinistra** in ≈0,8 s (velocità quasi costante, leggero ease-out).
- Il testo va a fuoco **dietro** la banda (rivelazione da destra a sinistra). Le voci già risolte restano nitide; le future restano sfocate.
- Uscita del titolo prima del cambio scena: il titolo diventa **grigio** (≈0,15 s) e poi sparisce.

## E06 · Pulse "disco pieno" — reel 7 (6,2–6,7 s), reel 79 (1,17–1,75 s), reel 14 (1,0–1,45 s)
- Disco **pieno** del colore d'accento (rosso cremisi, non saturo al 100%), con **contorno sottile chiaro** (2–3 px bianco/rosa) e leggera sfumatura radiale interna.
- Nasce piccolo (o da un **punto** di 8–10 px) → si espande con ease-out in ≈0,2 s → continua ad allargarsi poco mentre **sbiadisce** in ≈0,4–0,5 s. Totale 0,5–0,7 s.
- Può stare **dietro** all'oggetto (cervello, reel 79) o **davanti** a una lista (reel 7, semitrasparente ~65%).
- Spesso accompagnato da un piccolo **push-in** di camera (+3–5%) nello stesso momento.
- Variante "nascita di un'etichetta" (reel 14): punto → disco che si espande e svanisce → resta una **pill** rosso scuro con testo serif corsivo ("Storytelling Format").

## E07 · Anello di reel — reel 14 (0–2,9 s)
- 6 card 9:16 **piccole** (≈120×200 px su 1080) partono raggruppate al centro (raggio ~60 px) → si aprono a raggio ≈370 px in ≈0,3 s (ease-out forte) mentre l'anello ruota in senso orario; cerchio tratteggiato sottile che le collega.
- Le card mostrano clip in movimento (cambiano contenuto). Rotazione lenta continua (~20–25°/s), card sempre dritte.
- Titolo: due righe, parola per parola; **sottolineatura rossa** che cresce sotto la riga 2 seguendo il testo.
- Uscita: la camera fa un whip verso destra lungo una **linea luminosa orizzontale** (connettore con nucleo bianco e alone) fino al telefono-profilo, che entra dal bordo destro e si ferma decelerando (~0,6 s).

## E08 · Linee che diventano flusso di puntini — reel 94 (57,6–58,9 s)
- Diagramma a triangolo: 3 nodi = cerchi scuri con icona, **arco rosso parziale** sul bordo (tipo anello di progresso) e, sui nodi attivi, un **cerchio tratteggiato bianco** che ruota lentamente attorno.
- Collegamenti: linee bianche sottili (2–3 px); quella "debole" è tratteggiata.
- Sulla parola chiave la linea si trasforma in una **catena di puntini bianchi luminosi** (Ø ~8 px, passo ~12 px, glow) che si propaga dal nodo di partenza (≈0,15 s per linea) e poi **scorre** verso il nodo d'arrivo (flusso di traffico continuo).

## E09 · Contatore + grafico che si disegna + bagliore finale — reel 9 (10–13,9 s)
- Card "Inbox" / "Revenue" in vetro scuro (bordo 1,5 px chiaro, gradiente interno, ombra) entrano **da destra** mentre la camera le segue (pan ~0,6 s, decelerato).
- Il numero conta **in modo lineare** (passo costante) per ≈0,75–1 s e si ferma esattamente sulla parola detta ("44.000", "$250.000").
- In sincrono una **linea verde** con riempimento sfumato si disegna da sinistra a destra; alla fine compare un **punto** con anellino sul vertice finale.
- Al valore finale: **flash di bagliore** sul numero (bloom più forte per ~0,25 s, poi torna normale).

## E10 · Effetto PIXEL / mosaico (vero) — reel 107 (61,75–62,25 s)
- Foto di una persona che entra **a mosaico** (blocchi ~20 px → ~10 px) con **sfarfallio**: 3 fotogrammi alternati tinta **verde** / colori normali (≈0,1 s l'uno), poi resta pixelata (blocchi ~10 px) come stile "dato grezzo / identità".
- È un effetto "scansione digitale / glitch". Raro (1–2 reel), usato su ritratti. Non è il modo in cui compaiono le parole (quelle usano la sfocatura, E01).

## E11 · Barre-etichetta lucide che si accendono — reel 107 (63,4–65,9 s)
- Barre rosse con **gradiente lucido** e riflesso diagonale chiaro. Ingresso: compaiono **scure e sfocate** (rosso spento) e in 2–3 fotogrammi (≈0,1–0,15 s) diventano brillanti e nitide.
- Il testo dentro ("Skills", "Experience") arriva dopo, sulla parola: rosa chiaro/trasparente → bianco in ≈0,12 s.

## E12 · UI di chat ricreata + digitazione — reel 6 (7,1–10,9 s)
- Logo (ChatGPT/Claude) luminoso + frase di benvenuto; la barra di input nasce **piccola al centro** e si **allarga** orizzontalmente in ≈0,25 s (ease-out).
- Sulla prima parola del prompt la barra si **apre in altezza** (diventa area di testo) e il prompt si **digita** carattere per carattere (~18–22 caratteri/s), con le parole che arrivano quando lui le dice.
- La camera fa un lento **push-in + pan** che segue il cursore del testo (il box cresce ed esce dal bordo destro).

## E13 · Tubo al neon che si disegna + riflesso che corre — reel 16 (59,6–66,8 s)
- Oggetto-metafora (∞ di Meta) come **tubo 3D lucido** (blu, bloom morbido): parte da un **punto** e la linea si **traccia** lungo il percorso a velocità costante in ≈1,8 s (testa arrotondata).
- Etichette-pill in **vetro traslucido** (grigio chiaro trasparente, testo bianco): la pill vuota compare **sfocata**, poi il testo appare **lettera per lettera in ordine casuale** (≈0,2–0,3 s). Stesso effetto per i sottotitoli corsivi ("Ads Creative Studio", "Business").
- **Glint**: un riflesso bianco brillante **scorre lungo il tubo** (giro completo ≈1,6 s) = energia/ciclo.
- Pulse a disco rosso semitrasparente sopra l'oggetto sulla parola chiave; poi una **linea rossa tratteggiata** scende da un nodo verso una nuova etichetta (che compare con lettere casuali).

## E14 · Annotazioni (light mode) che entrano con motion blur — reel 102 (33,4–36,9 s)
- Card video che arriva con **zoom veloce** (scala ~0,6→1 in ≈0,25 s, sfocata nei primi fotogrammi).
- Parole-annotazione **nere bold** ("Trends", "Insights", "Patterns") + **freccetta a ricciolo disegnata a mano**, ciascuna con un documento-screenshot: entrano da **lati alterni** (destra, sinistra, destra) con **sfocatura di movimento orizzontale** e frenata (~0,35–0,4 s), una per parola detta.
- La parola nasce **grigia** e diventa nera in ~0,25 s; la camera nel frattempo sale piano per fare spazio (la card video sale e rimpicciolisce).

## E15 · Segnale che viaggia sul connettore + conto alla rovescia + disintegrazione — reel 40 (35,5–37,9 s)
- Diagramma: card-telefono → linea **rossa** sottile → pill di codice **verde** `<Algorithm/>` (font mono, bordo verde luminoso, alone) → linea rossa → box scuro con **griglia di icone-persona** (20×4) e contatore giallo "200 people".
- Un **cerchietto con il simbolo "−"** viaggia lungo la linea dall'algoritmo verso il pubblico (≈0,4 s): il "segnale" ha un segno, non è solo un punto.
- Riorganizzazione: il box del pubblico si attenua (20%), il diagramma si ricompone (card al centro sotto la pill) in ≈0,3 s.
- Badge views sulla card conta **all'indietro** in modo lineare (200 → 0 in ≈0,9 s).
- "Nuke": la card si **disintegra in particelle** (polvere brillante che si espande e svanisce in ≈0,6 s), poi taglio sul parlato.

## E16 · Anello di sfere di vetro + messa a fuoco + vortice di particelle — reel 49 (0–3,4 s)
- 6 **sfere di vetro scuro** con riflesso rosso in basso e icona bianca dentro, disposte ad anello che ruota lento in senso orario.
- Apertura con **rack focus**: nei primi 0,3–0,5 s le sfere sono **fuori fuoco** (blur ~10 px) e vanno a fuoco mentre compare il titolo.
- Push-in di camera; al centro nasce una **nuvola di particelle** bianche che gira a vortice (galassia, ~1 s), poi da lì escono i **loghi social** e linee bianche **ad angolo retto (circuito)** che collegano il centro alle sfere (≈0,3 s di disegno).

## E17 · Metafora fisica: il sasso nell'acqua (pebble effect) — reel 65 (18,3–24,4 s)
- Card UI (light) con **cursore a mano** che clicca "Share": il pulsante cambia colore (azzurro → viola) al clic.
- Dal pulsante "cade" un **sasso bianco**: la card sale e svanisce con **motion blur verticale**, la camera **scende seguendo il sasso** (≈0,5 s) e dal basso entra la **superficie d'acqua 3D** turchese con bordo luminoso e onde lente.
- Impatto: piccolo schizzo + **onde concentriche** che si allargano e svaniscono (≈1 s). Una **linea guida bianca sottile a gomito** sale dal punto d'impatto verso un'etichetta che si scrive **parola per parola** (grigio → bianco) a destra.
- Regola: l'oggetto fisico (sasso, pallina, meteora) è il **ponte** tra due scene — la camera lo segue e lui porta lo spettatore nel nuovo "mondo".

## E18 · Uscita da una scena seguendo una linea (anello → lista) — reel 13 (0–2,9 s)
- Anello di 6 reel su cerchio tratteggiato che nasce **piccolo** e si **allarga** (0–0,5 s) ruotando lentamente; titolo parola per parola.
- Una **linea orizzontale** cresce dal bordo dell'anello verso destra (≈0,3 s); poi **whip pan** verso destra che segue la linea (≈0,5 s, sfocatura di movimento). **Il titolo è nel mondo, non fisso sullo schermo**: esce a sinistra insieme all'anello. Il nuovo titolo arriva con la lista (già lì, voci sfocate) e si scrive parola per parola dopo l'arrivo.
- Dopo l'arrivo: un **riflesso bianco scende in cascata** sulle barre della lista (bordo che si accende, una barra ogni ~0,08 s, dall'alto verso il basso) — la lista "si accende".
- La linea resta come **connettore** tra le due scene (arriva sul fianco sinistro della lista).

## E19 · Checklist → oggetto 3D con "zoom-through" + rotazione che porta in alto la voce detta — reel 50 (18–21,7 s)
- Checklist: barre scure con accento rosso a sinistra, **checkbox spuntate** (icona quadrata bianca), testo su 2 righe.
- Passaggio (19,13–19,38 s): **sfocatura di movimento verticale / zoom blur** su tutto (titolo compreso, 1–2 fotogrammi) e al posto della lista compare l'**oggetto 3D** (triangolo con cornice scura smussata e nucleo rosso lucido) che arriva leggermente ruotato e si assesta.
- Sulle parole "relevant / novel / interesting" il triangolo **ruota** (≈0,5 s, ease-in-out, con leggera inclinazione 3D) finché il lato nominato è **in alto**: quell'etichetta diventa bianca e nitida, le altre restano **sfocate e grigie**. È il "focus per rotazione".

## E20 · Morph di forma 3D (esagono → triangolo → piramide a livelli) — reel 97 (5,4–8,4 s)
- Esagono 3D rosso, lucido, con **bordo luminoso** e **alone rosso** ampio; ruota in 3D (tumble) e intanto **cambia forma**: esagono → pentagono → triangolo con un lato curvo → triangolo (≈1,4 s).
- Il triangolo si **taglia in 3 fasce orizzontali** (si aprono fessure scure, ≈0,25 s) = livelli; le etichette "Level 1/2/3" compaiono con **lettere in ordine casuale** (E13).
- Titolo con **sottolineatura rossa sottile** sotto la riga.

## E21 · Documento "Video Script" che si costruisce riga per riga — reel 26 (2–6 s)
- Il titolo si **riorganizza**: dalle 2 righe grandi passa a **una riga dentro un box rosso lungo** già disegnato a tutta larghezza, con le parole in serif corsivo che compaiono **dentro il box** una alla volta (grigio→bianco).
- Doc: card scura lucida con **bordo bianco luminoso** (glow forte, ~20 px), intestazione "Video Script" in corsivo, ~25 righe-segnaposto grigio chiaro.
- Sulla parola, una sezione si colora: compare un **quadratino colorato** a sinistra + etichetta ("Hook", "Lock-in zone") e le righe di quella sezione si **riempiono di colore da sinistra a destra** (effetto evidenziatore, ≈0,3 s per riga, sfalsate).
- Camera: lento push-in sul doc (+8% in 1 s).

## E22 · Grafico che si disegna con punti ed etichette, camera che segue la spiegazione — reel 110 (4–11,3 s)
- Assi a L bianchi sottili con bagliore; la **curva rossa luminosa** (alone rosso ampio) si traccia dall'origine in ≈1,2 s (velocità costante), i **punti bianchi** compaiono quando la linea ci passa sopra.
- Etichette = **pill bianche con testo nero** (stile "tag"), una per parola detta, entrano con sfocatura→nitido; la camera **si sposta verso l'etichetta attiva** (pan + zoom leggero) e alla fine **arretra** per mostrare tutto.
- Nei sottotitoli: le parole-chiave passano in **serif corsivo** ("story arc.") — accento tipografico anche nella didascalia.

## E23 · Due dischi → Venn con intersezione colorata — reel 39 (57–65,8 s)
- "Number 1": la voce attiva della lista **sale e diventa intestazione** (pill in alto, ≈0,25 s) mentre il resto svanisce; compare un **disco rosso "1."** (nasce scuro/sfocato e in ≈0,25 s diventa rosso pieno e nitido, leggera crescita di scala).
- Dentro il disco la domanda si scrive **parola per parola** (grigio → bianco).
- "Number 2": il disco 1 **scivola a sinistra** per fare posto (≈0,25 s) e a destra nasce un **disco verde "2."** con lo stesso ingresso.
- "Intersection": i due dischi **si avvicinano e si sovrappongono**; la lente d'intersezione diventa **viola** (colore misto) — ≈0,5 s.

## E24 · Contorno al neon che si disegna + parola rossa neon (era podcast) — reel 149 (2–3,3 s)
- Due **punti rossi** compaiono, si uniscono in un **rettangolo al neon** (contorno rosso brillante, glow forte) che cresce in altezza (≈0,35 s).
- Il testo in **serif corsivo rosso neon** compare parola per parola: ogni parola nasce **rosso scuro sfocato** e si accende (≈0,15 s) con alone rosso.

## E25 · Transizione LIGHT LEAK / film burn — reel 149 (3,33–3,58 s)
- Sul taglio verso il primo piano: una **lama di luce arancio/rossa** diagonale attraversa l'inquadratura (2 fotogrammi), poi **1 fotogramma quasi bianco** (crema), poi l'immagine pulita. Totale ≈0,25 s. Usata come "botta" sul cambio d'inquadratura (bagliore).

## E26 · Testo che si "decodifica" (scramble) — reel 149 (3,58–3,83 s), lower third
- Lower third con **barra rossa verticale** a sinistra, nome in **font monospazio** maiuscolo: prima di fermarsi su "KALLAWAY" le lettere **cambiano a caso** ("SITTEEG" → "MCNNCYCA" → "KALLAWAY") per ≈0,25 s, una sostituzione ogni fotogramma o due. È l'effetto "pixel/glitch" sulle parole: usato su nomi, etichette tecniche, codice.

## E27 · Doc che si riempie "a cascata" + titolo a macchina da scrivere dentro un box già disegnato — reel 35 (0–3,9 s, 488K)
- Fotogramma 0: doc **fioco e sfocato** (opacità ~30%) con bordo luminoso; le righe colorate si **allungano da sinistra** una dopo l'altra dall'alto in basso (~20 ms per riga): l'intero doc si riempie in ≈0,5 s mentre il bordo si accende al 100%.
- Titolo riga 1: box rosso che **segue** le parole (E02); in seguito, per la sezione, il box rosso è **già lungo** e il testo serif corsivo si scrive **lettera per lettera** dentro (≈35–40 caratteri/s).
- Push-in di camera lento sul doc (≈+15% in 1,5 s). Griglia di reel che entra a gruppi (1 → 3 → 5 → 6 card, sfocato→nitido).

## E28 · Scala al neon + nome del livello a macchina da scrivere — reel 109 (10,6–13,2 s)
- Scala con montanti e pioli a **tubo neon rosso** (alone forte, texture interna a molecole); camera che **spinge** verso il piolo basso (≈0,4 s) e si assesta.
- Etichetta piccola "LEVEL 1" fissa; il nome ("STIMULATION") si scrive **lettera per lettera** in maiuscolo bianco bold (~10 lettere/s), in sincrono con la parola detta.

## E29 · Griglia di 100 puntini: comparsa a onda, accensione casuale, cambio di stato — reel 88 (39–46,5 s)
- Card in vetro con griglia 10×10 di puntini grigi che compaiono **riga per riga dall'alto** (≈50 ms per riga, 0,5 s in tutto).
- "Quanti sarebbero scioccati": puntini **casuali** diventano **bianchi luminosi** pochi alla volta (≈2 s in tutto, ritmo irregolare = sembra "conteggio dal vivo").
- Etichetta "28/100" + una **linea** che si allunga verso "Shock Score": nello stesso fotogramma tutti i puntini bianchi diventano **rossi** (cambio di stato secco = il concetto "scatta").

## E30 · Muro di miniature: scroll "slot machine" + riflettore verde — reel 61 (9,3–11,9 s)
- Una fila di miniature → **zoom out** rapido con sfocatura (diventa un muro di centinaia).
- **Scroll verticale velocissimo** con **sfocatura di movimento verticale** forte (≈0,4 s) che **decelera** fino a fermarsi (come i rulli di una slot).
- Selezione: alcune miniature si tingono di **verde con bagliore** (riflettore morbido che si allarga, ≈0,4 s) mentre tutto il resto si **scurisce** (velo grigio ~40%).
- Uscita: dissolvenza schiarita verso la griglia "migliori" 3×3 con badge views verdi.

## E31 · Nastro trasportatore di card + onda che le inghiotte — reel 32 (30–47,5 s)
- Fila orizzontale di **card-formato** (card scure lucide: screenshot + icone + etichetta) che **scorre verso sinistra a velocità costante** (la camera "viaggia" lungo la fila, ≈120 px/s) per 10+ s: ogni nuova card arriva da destra quando lui la nomina.
- Dal basso **sale una superficie d'acqua verde-teal** (bordo superiore leggermente ondulato, onde lente) e si ferma a ~⅔ dell'area grafica.
- A ogni nuova card, una card della fila **cade nell'acqua**: scende ~300 px con leggera rotazione (~5°) in ≈0,8 s e diventa **verde, traslucida e sfocata** (sott'acqua). Metafora continua che accompagna un elenco lungo.

## E32 · Imbuto 3D a strati + radar che "trova" i loghi — reel 46 (4,5–11,7 s)
- Imbuto 3D rosso costruito **strato per strato dall'alto** (ogni anello cade in posizione con dissolvenza, ≈0,15 s l'uno, sfalsati) fino a una **sfera rossa luminosa** in fondo con icona; alone rosso forte, etichette dentro gli strati.
- Cambio scena: tutto sparisce tranne un **punto grigio** al centro che cresce e diventa l'**avatar-profilo** con 3 anelli concentrici sottili (match cut punto → avatar).
- **Radar**: uno **spicchio verde luminoso** (gradiente, con puntini dentro) ruota attorno all'avatar (≈360° in 2,5 s, velocità costante); quando passa, i **loghi social** compaiono sul cerchio esterno sul bordo d'attacco dello spicchio e svaniscono dopo.
- Ritorno all'imbuto: la parola del titolo **si sostituisce** ("Funnel" → "Progression", scritta a macchina) mentre l'imbuto scivola a destra e a sinistra compaiono icone-persona (2 → 6).

## E33 · Bersaglio costruito dal centro con etichette su linee alternate — reel 91 (26–33,8 s)
- Parte da un **solo punto rosso** pieno (~60 px). Una **linea guida bianca sottile** esce verso destra (≈0,4 s) e l'etichetta si scrive **sopra la linea parola per parola** (grigio→bianco), sottolineata dalla linea stessa.
- "Un passo più largo": un **anello arancio** si espande dal punto (≈0,25 s, ease-out) e una nuova linea esce **verso sinistra** con la sua etichetta: gli anelli si aggiungono uno alla volta dal centro verso l'esterno, le etichette **alternano destra/sinistra**.
- Camera quasi ferma (micro drift): qui il movimento è tutto nell'oggetto.

## E34 · Anello di loghi che esplode dal centro e poi implode in un logo — reel 98 (0–2,9 s)
- Fotogramma 0: un solo logo al centro. In ≈0,25 s i loghi **schizzano fuori** dal centro con sfocatura di movimento e si dispongono su un **anello verde al neon** spesso e sfocato (alone ampio), che si allarga fino al raggio finale (ease-out).
- L'anello **ruota lento** (~40°/s) mentre si parla.
- Sulla parola chiave i loghi **spiraleggiano verso il centro** (la rotazione accelera, il raggio si stringe, si inclinano, motion blur, ≈0,3 s) e **implodono** nel logo protagonista (Claude), che compare in un disco verde con **2 onde d'urto** (anelli arancio che si allargano e svaniscono, ≈0,4 s l'una).

## E35 · Lista light mode (era maggio) — reel 123 (9–14,9 s)
- Titolo in box rosso con **numero gigante** ("3") a sinistra e testo impilato a destra.
- Voci = **pill bianche con contorno nero** e testo nero sfocato; numeri "1. 2. 3." neri fuori dalla pill. La 3ª voce entra dal basso.
- **Drift continuo verso l'alto** di tutta la scena (camera che sale piano, mai ferma).
- Risoluzione sulla parola: sfocato → nitido in **2 fotogrammi** (≈0,07 s), senza sheen (variante "secca").

## E36 · Logo con raggi "vivi" + volo in posizione con motion blur + lampeggio di attivazione — reel 17 (0–1,6 s)
- Logo Claude come **icona-app** (tile corallo) con dietro un **ventaglio di raggi organici** dello stesso colore, bordi morbidi: i raggi **ruotano piano e respirano** (±10°, leggero cambio di scala) = l'oggetto è "vivo".
- Il logo **vola** nell'angolo dove servirà (scala 1 → 0,35 in ≈0,2 s) con **sfocatura di movimento/zoom** forte.
- **Lampeggio di attivazione**: per ≈0,3 s alterna **corallo / verde** ogni 1–2 fotogrammi (sfarfallio digitale) e si ferma sul verde; intanto escono le linee dell'albero verso le voci (segnaposto sfocati).

## E37 · Numero gigante sullo sfondo che conta + raggi che diventano braccia — reel 56 (1,2–2,1 s)
- Dietro l'oggetto, in **grigio scuro a bassa opacità** e corpo enorme (≈2× la larghezza dell'oggetto), un numero che **conta veloce** ("5x" → "6x" → "9x" → "100x") = enfasi senza rubare la scena.
- Gag visiva: i raggi del logo si **trasformano in braccia** (motion blur) che reggono i loghi delle app (Gmail, Notion, YouTube, Instagram, Docs, Sheets).

## E38 · I sottotitoli NON sono animati
- Parola (o 2–3 parole) bianca bold con **ombra scura morbida**, cambio **secco** a ogni parola, nessuna sfocatura, nessun pop; le parole-chiave a volte in **serif corsivo**. L'effetto "blur/pixel sulle parole dette" riguarda **titoli ed etichette** (E01, E13 lettere casuali, E26 decodifica), non i sottotitoli.
