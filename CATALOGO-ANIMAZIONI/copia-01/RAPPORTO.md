# Rapporto · blocco C1 (copia del reel 79 di Kallaway, intero)

**Fatto.** Il reel 79 (107,6 s) è copiato tutto, 1:1 sul suo tempo, in `CATALOGO-ANIMAZIONI/copia-01/` (KW_RITMO, 1080×1920,
30 fps, safe zone 1332). Le scene sono 25: 6 sono facecam piena e 2 sono spezzoni a tutto schermo. Le transizioni sono 33. Anteprima
:3041. Il render di prova è `_analisi/render/copia-01_bozza.mp4`.

**Voci (14), tutte con la scheda `@copia` e misurate una volta contro Kallaway** (dettaglio in `voti_kit.json`):
- T01: parole sugli istanti misurati, 0,2 s. Titolo 0,78 della larghezza (K 0,68: il corsivo italiano è più lungo).
- A05: card 0,737 della larghezza (K 0,738); cambi di clip a 0,167 · 0,334 · 0,48 s (uguali).
- C01: pan 0,73 s, picco 2943 px/s al 46% (K 0,75 s, 2948 px/s al 44%).
- F01: alone del titolo σ 4 / 20 px (K σ 7 / 20). Il neon aveva l'alone largo troppo forte (0,30, K 0,04): corretto con
  `cpNeonK`, non rimisurato.
- O13: cervello 282 px (K 276–286).
- F02: disco Ø 632 → 770 in 1 fotogramma, poi ~935 (come lui); ingombro 0,91 (K 0,87).
- O18: ∞ 0,428 (K 0,395), corretto ×0,93.
- O14: slot 0,24 (K 0,29 con l'insegna), corretta ×1,15.
- K03: ×1,567 / −300 px (K ×1,556 / −298).
- K04: deriva −86 px in 1,77 s, angoli 27 → 75 px/s (K −92 px, 28 → 76 px/s).
- K02: arrivo in corsa, KW.arrive (errore 0,018 contro K 0,009).
- K17: camera presa dal suo video in 4 tratti.
- K06: ×4,5 in 0,33 s con la scia (K: 3 fotogrammi mossi, non misurabili).
- O30: 0,61 della larghezza (K 0,51).

Voti: 5·5·5·5 in 7 voci; un 4 in O14 (2), A05, F01, F02, O30, K17 e K06.

**Transizioni del reel** (`copia-01/transizioni.json`; funzioni in `kit2-copia-transizioni.js`):
- tagli e stacchi sulla faccia: 16;
- arrivi in corsa, K02/K17 (1,3–2,7 s, picco al primo fotogramma, KW.arrive): 4;
- pan verticali con dissolvenza, `TRANS.panVerticale` (2,2 s e 1,7 s, tabelle misurate): 2;
- linea che continua, C01 (0,75 s): 1;
- pan + zoom tra oggetti, K03 (1,0 s e 1,6 s): 3;
- zoom indietro con l'oggetto che resta (1,4 s): 1;
- tuffi, K17 e K06 (1,4 s; 0,33 + 0,25 s): 2;
- stacchi sul nero o uscite verso l'alto: 2.
La camera complessa è presa dal suo video (`CP_CATTURE`, motion capture con `camtrack.py`).

**Cosa non torna:**
- I suoi media sono sostituiti con media veri dello stesso tipo:
  - creator del progetto al posto dei suoi storyteller;
  - un reel di viaggi al posto del suo creator;
  - film e casinò da Pexels (`_lavoro/stock/`);
  - i tuoi reel e la tua foto dove c'è lui.
- La slot grafite è più scura della sua, cromata con l'insegna.
- Il disco F02 è grafite con l'anello lime, non pieno come il suo rosso.
- La miniatura della CTA è più scura del suo pannello viola.
- I nomi delle tappe vanno su due righe (testo italiano più lungo).
- Le correzioni F01, O18 e O14 sono fatte ma non rimisurate.
- Il whisper-cpp di hyperframes manca: la trascrizione è fatta con faster-whisper small.en (`_lavoro/r79_parole.json`).

**Fogli e video:**
- `_analisi/ritmo/fogli_regia/copia-01_NN_<id>.jpg`: KALLAWAY | COPIA per ognuna delle 25 scene (`_tools/foglio_kd.py --copia`);
- `_analisi/confronti-video/r79_copia_affiancato.mp4`: tutto il reel, senza audio;
- pagina `catalogo-ritmo.html`: colonna COPIA, PRIMA nascondibile, filtro «Copia fatta».
