# Rapporto · blocco C2 (copia del reel 5 di Kallaway, intero)

**Fatto (16/10, in cloud).** Il reel 5 («These are the three reasons why your content is not driving leads», 122,09 s) è copiato
tutto, 1:1 sul suo tempo, in `CATALOGO-ANIMAZIONI/copia-02/` (KW_RITMO, 1080×1920, 30 fps, safe zone 1332, niente audio). Le
scene sono 27: 13 sono facecam piena. Le transizioni annotate sono 56. Il render di prova è `_analisi/render/copia-02_bozza.mp4`
(ridotto: `copia-02_bozza_540.mp4`); un render intero in cloud dura 6 min 20 s – 7 min (senza GPU). Check: 0 errori.

**Voci (9), tutte con la scheda `@copia` e misurate una volta contro Kallaway** (`_lavoro/misure.json`, `misure_c2.py`):
- L01: prima barra al taglio y 700–819 (K 696–818), a 10,33 s 556 (K 560), a 13,0 s 548 (K 549); accento x 112 → 121 (K 111 →
  120). Barre 858×122 come le sue, passo 160; la camera deriva ×0,93 (barre.py).
- L02: accento della barra attiva 124 · 120 · 98 · 103 px a 10,9 · 11,2 · 11,6 · 12,4 s (K 118 · 110 · 99 · 102).
- K14: alto della voce che sale 528 · 474 · 348 · 306 px a 13,25 · 13,5 · 13,67 · 13,83 s (K 531 · 480 · 351 · 309).
- F03: la banda passa x 851 → 765 → 638 → 550 px fra 34,42 e 34,66 s (K 878 → 804 → 695), ~1150 px/s, lineare.
- T08: titolo 100 · 76 · 70 · 57 · 45 · 17 · 12 % ogni 0,083 s da 35,3 s (K 100 · 84 · 69 · 52 · 35 · 18 · 15).
- O21: raggio mediano delle persone 328 px a 17,4 s e 290 a 18,4 s (K 343 e 284).
- K01: stacchi sulla faccia sul primo fotogramma dopo il suo (3,433 · 8,933 · 18,567 s contro 3,417 · 8,917 · 18,542 a 24 fps).
- O28: pillole a 96,7 s x 351–755, passo 95 (K 366–755, passo 93); a 95,05 s «Idee» a x 359 (K 345).
- X01: card del video x 169–910, y 565–1003 (K 172–905, 564–995).

Voti: 5·5·5·5 in L01, L02, K14, F03, T08, K01; un 4 in O21 (materiali), O28 (movimento) e X01 (materiali).

**Transizioni del reel** (`copia-02/transizioni.json`; nessuna TRANS nuova, sono dentro le scene):
- tagli e stacchi sulla faccia: 26 (più l'apertura dal nero e la fine);
- arrivi in corsa dopo il taglio (la lista che sale, la copertina da destra): 5;
- oggetto che resta: la voce della lista che diventa intestazione (K14, 3 volte), la pillola, il reel che diventa una cella del
  muro, la copertina coi cloni: 7;
- zoom indietro con l'oggetto che resta o che arriva: 6;
- linea che continua (linea bianca, arco, linee a puntini, il pan che segue la linea fino al ROI): 5;
- zoom-through dentro il reel (×1,94): 1;
- stacchi sul posto (la lista che lascia il posto ai reel, il reel che lascia la frase, il reel che diventa la card ROI o
  il documento, il tablet che lascia la persona): 5;
- comparse e uscite dentro la scena (arrivi da sotto, chip col lampo): il resto.
Camera presa dalle sue misure (barre.py, strisce dei fotogrammi): niente `CP_CATTURE` nuove, i movimenti sono semplici.

**Cosa non torna:**
- I suoi media sono sostituiti con media veri dello stesso tipo (`assets/_sorgenti.json`):
  - creator del progetto al posto dei suoi (dankoe, garyvee, fitness con la tier list, una folla; nei cloni 9 creator
    diversi di `_clip-esterni` con la scritta «“Ecco Come Diventare Virale”» sopra, come i suoi 9 con «This Is How You Go
    Viral»);
  - il muro della scena 7: 36 fotogrammi diversi dei tuoi reel (i suoi sono 30 reel diversi);
  - scena 11: il tuo reel col profilo (v01) con sopra un titolo italiano messo da noi (una fascia scura copre il «4» del tuo
    reel), al posto del suo reel col titolo già dentro;
  - i tuoi reel già tagliati per C1 al posto dei suoi reel (i tuoi reel veri non ci sono in cloud);
  - la sua pagina e il suo template disegnati da noi.
- Il suo rosso e il suo verde diventano tutti e due lime: dove lui contrappone rosso (sbagliato) e verde (giusto), da noi è
  bianco → lime.
- Il titolo in Advercase è più alto del suo neretto alla stessa larghezza; il corsivo nel riquadro è Patrick Hand scuro su lime.
- O28: nell'allineamento della seconda pillola lui ha un filo di rimbalzo (pop.py: 8,6%), da noi 0.
- X01: il tuo video 16:9 è un ritaglio del tuo reel verticale (640×360): da rifare da un tuo video orizzontale.
- Il catalogo segna X01 a 118–125 s ma il file finisce a 122,09 s; K01 (7,1–7,9 s) è dentro la facecam 3,417–8,917 s.
- safezone.py con la soglia automatica (49) segna 73 campioni su 733: è la griglia di puntini dello sfondo (luminanza ≤ 60, più
  visibile nelle scene 1, 3 e 5); con soglia 75 i campioni sotto la linea sono 0.

**Correzioni della regia dopo i fogli (16/10, un giro):** C1 CTA (titolo al taglio, card velata al primo fotogramma, titolo
della miniatura sopra i numeri); C2 scene 1 (titolo al fotogramma 0), 5 (lime solo la riga sotto la banda), 7 (banda che
scorre misurata, senza tinta; muro di fotogrammi tutti diversi), 11 (il tuo profilo col titolo cerchiato in lime, niente
tazza), 19 e 21 (creator diversi con la stessa scritta), 25 (barre da sinistra, misurate: −288 px a +0,042 s → ferme a
+0,875, scaglionate di 2 e 5 fotogrammi come le sue; «3 Motivi» a +0,1 s). Scena 13: la spunta verde e la barra sono del tuo
reel, restano. Dettagli in `STATO.md`.

**Fogli e video:**
- `_analisi/ritmo/fogli_regia/copia-02_NN_<id>.jpg`: KALLAWAY | COPIA per ognuna delle 27 scene (`_tools/foglio_kd.py --copia`);
- `_analisi/confronti-video/r05_copia_affiancato.mp4`: tutto il reel, senza audio;
- clip della pagina `ritmo-clip/<ID>_copia.mp4` e `<ID>_kcopia.mp4` per L01 L02 K14 O21 F03 T08 K01 O28 X01 (la pagina la
  rigenera l'utente in locale).
