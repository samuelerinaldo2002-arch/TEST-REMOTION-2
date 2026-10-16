# Blocco C2 · copia del REEL 5 intero (copia-02, porta :3042; in cloud niente anteprima)

**Riga di stato (16/10, cloud):** IN CORSO — tutte le 27 scene scritte e guardate sulle snapshot (KALLAWAY | COPIA con
`_script_copia02/snap_kd.py`); `scene.json` (27) e `transizioni.json` (56) fatti; check 0 errori; primo render intero in corso. Media in `copia-02/assets` (`_lavoro/media.py`), kit in
`kw-kit/kit2-copia-r05.js` (aiuti del reel + scene `COPIA.r05_*`) e `kit2-copia-c2-{liste,luce,camera,testo,oggetti}.js` (voci
L01 L02 F03 K14 K01 T08 O21). Tagli verificati fotogramma per fotogramma (`_script_copia02/tagli.py`: 26 tagli, uguali a
`_dati/q1_reel005_auto.json`) → 27 scene, 13 facecam piene. Strisce dei suoi fotogrammi in `copia-02/_lavoro/k/sNN.jpg`.
Render di prova e fogli per scena: alla fine (pochi render, più scene insieme).

Reel 5 = `03_2026-10-04_DeFA_f1uwLt.mp4` (radice; inventario n = 5), 720×1280, 24 fps, video 122,0 s (2928 fotogrammi), audio
e contenitore 122,09 s. Trascrizione `_lavoro/r05_parole.json` (Parakeet tarato, vedi NOTE-DI-RIENTRO §3).

## Passo 0 (due ritocchi a C1, opzioni in coda col default di prima) — FATTO 16/10
- (a) O30 «La Finta» a 53,846 s: scena piena al taglio (`COPIA.O30(…, { pieno: true })` + salita della camera misurata).
- (b) CTA 100,06 s: miniatura visibile, «2» grande nello zoom, chip della sua misura, tuffo ×3,3 (`{ ritocco: true }`).
- render `copia-01` (6 min 37 s), fogli `copia-01_16_O30.jpg` e `copia-01_25_r79_cta.jpg`, clip `O30_copia` e `K06_copia`.

## Scene (una riga per scena del reel)
| # | copia = Kallaway (s) | cosa | funzione · voci | stato |
|---|---|---|---|---|
| 1 | 0–3,417 | titolo «3 Motivi…» + lista lampo; due reel di creator, banda di scansione, card «Clienti» col grafico che scende | COPIA.r05_apertura | scritta, snapshot guardata |
| 2 | 3,417–8,917 | facecam piena (K01) | cpFacecam | scritta, snapshot guardata |
| 3 | 8,917–18,542 | lista coi segnaposto sfocati, voce 01 risolta, sale a intestazione; reel del creator, argomenti, anelli di persone | COPIA.L01 · L02 · K14 · O21 + r05_argomenti | scritta, snapshot guardata |
| 4 | 18,542–20,083 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 5 | 20,083–22,625 | «Il Tuo Vero Problema»: la card degli argomenti, banda che la scorre | COPIA.r05_problema | scritta, snapshot guardata |
| 6 | 22,625–24,792 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 7 | 24,792–30,833 | «Fai Solo Video Che / Aiutano Il Tuo Pubblico»: il tuo reel, contatore, persone, muro di 30 reel | COPIA.r05_target | scritta, snapshot guardata |
| 8 | 30,833–32,75 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 9 | 32,75–38,833 | lista, voce 02 risolta (sheen), titolo esce, 02 a intestazione; «Fiducia» e il titolo in borsa | COPIA.L02 · F03 · T08 · K14 + r05_fiducia | scritta, snapshot guardata |
| 10 | 38,833–44,125 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 11 | 44,125–54,292 | «La Fiducia Nasce Da Due Cose»: due pillole, il tuo reel, profilo, «Il Posto Giusto…», copione con la zona d'aggancio | COPIA.r05_prove | scritta, snapshot guardata |
| 12 | 54,292–59,458 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 13 | 59,458–63,333 | «Informazioni Nuove / Azione Chiara»: il tuo reel, cerchio, due pillole coi lampi | COPIA.r05_azione | scritta, snapshot guardata |
| 14 | 63,333–66,875 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 15 | 66,875–72,0 | «Fallo Provare»: la persona, la pagina, la linea fino al ROI che cresce | COPIA.r05_prova | scritta, snapshot guardata |
| 16 | 72,0–76,792 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 17 | 76,792–85,125 | lista, voce 03 risolta, a intestazione; «Compra», il tuo reel, il ROI | COPIA.r05_compra (L02 · K14) | scritta, snapshot guardata |
| 18 | 85,125–88,708 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 19 | 88,708–93,417 | «Smetti Di Essere Uguale Agli Altri»: il reel del creator clonato, la persona, «Sono tutti uguali» | COPIA.r05_cloni | scritta, snapshot guardata |
| 20 | 93,417–94,375 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 21 | 94,375–98,333 | pillole Idee · Metodi · Framework che si impilano; i cloni a sinistra | COPIA.O28 | scritta, snapshot guardata |
| 22 | 98,333–105,833 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 23 | 105,833–110,042 | «Distinguiti Con / Qualcosa Di Nuovo»: il tuo reel, scansione, il documento nuovo, anelli di persone | COPIA.r05_nuovo | scritta, snapshot guardata |
| 24 | 110,042–112,708 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 25 | 112,708–115,958 | la lista intera di nuovo, risolta | COPIA.r05_riepilogo (L01) | scritta, snapshot guardata |
| 26 | 115,958–117,708 | facecam piena | cpFacecam | scritta, snapshot guardata |
| 27 | 117,708–122,09 | CTA «Commenta “clienti”…» + card del tuo video | COPIA.X01 | scritta, snapshot guardata |
