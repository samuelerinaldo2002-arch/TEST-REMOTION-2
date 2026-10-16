# Blocco C2 · copia del REEL 5 intero (copia-02, porta :3042; in cloud niente anteprima)

**Riga di stato (16/10, cloud):** FATTO + un giro di correzioni della regia (sezione sotto), da rivedere con l'utente (in cloud niente anteprima :3042). 27 scene 0–122,09 s 1:1
sul tempo di Kallaway; build e check passati (0 errori); tre render di prova, l'ultimo è `_analisi/render/copia-02_bozza.mp4`
(6 min 59 s; ridotto `copia-02_bozza_540.mp4`), lucchetto tolto. `scene.json` (27 righe), `transizioni.json` (56), misure una
volta per voce coi valori di Kallaway (`_lavoro/misure.json`, `_lavoro/misure.log`), clip della pagina per L01 L02 K14 O21 F03
T08 K01 O28 X01 (`ritmo-clip/<ID>_copia.mp4` e `_kcopia.mp4`), affiancato `_analisi/confronti-video/r05_copia_affiancato.mp4`,
fogli KALLAWAY | COPIA per scena `_analisi/ritmo/fogli_regia/copia-02_NN_*.jpg`, RAPPORTO.md; voti e riga della tabella del giro 2
come frammenti in `LAVORO-CLOUD/NOTE-DI-RIENTRO.md` §4 («### C2»).

Safe zone: quella dell'utente (niente grafica sotto y = 1332). `_tools/safezone.py` con la soglia automatica segna i puntini
dello sfondo (luminanza ≤ 60) in 73 campioni su 733; con soglia 75: 0 campioni sotto la linea.

Reel 5 = `03_2026-10-04_DeFA_f1uwLt.mp4` (radice; inventario n = 5), 720×1280, 24 fps, video 122,0 s (2928 fotogrammi), audio
e contenitore 122,09 s. Trascrizione `_lavoro/r05_parole.json` (Parakeet tarato, vedi NOTE-DI-RIENTRO §3).

## Passo 0 (due ritocchi a C1, opzioni in coda col default di prima) — FATTO 16/10
- (a) O30 «La Finta» a 53,846 s: scena piena al taglio (`COPIA.O30(…, { pieno: true })` + salita della camera misurata).
- (b) CTA 100,06 s: miniatura visibile, «2» grande nello zoom, chip della sua misura, tuffo ×3,3 (`{ ritocco: true }`).
- render `copia-01` (6 min 37 s), fogli `copia-01_16_O30.jpg` e `copia-01_25_r79_cta.jpg`, clip `O30_copia` e `K06_copia`.

## Correzioni della regia dopo i fogli (un giro, 16/10) — FATTE
Solo le scene indicate; il resto non è stato toccato né rimisurato.
- C1 · CTA (`copia-01`, scena 25, opzione `ritocco`): «Commenta» c'è già grigio al taglio e bianco a +0,1 s, «“storytelling”»
  a +0,15 s; la card è già velata al primo fotogramma (dissolvenza da 0,07 s prima del taglio, sotto la copertura); il titolo
  della miniatura più in alto e più piccolo (36 / 52 px, le sue proporzioni fra le righe): sta sopra i numeri, non tocca il «3».
- 1 · al fotogramma 0 la stanghetta lime del riquadro e il «3» grigio (stato messo con `gsap.set`: un tween che parte a 0 non
  si vede al fotogramma 0 del render).
- 5 · è lime solo la riga sotto la banda (a +2 s solo «Content Marketing»).
- 7 · banda misurata sul suo (sul bordo alto del reel a +0,545 s, 1100 px/s lineari, via a +1,25 s), il reel non si tinge;
  il muro: 36 fotogrammi diversi dei tuoi reel già tagliati (`assets/img/wv01–18` col tuo viso, `wg01–18` di grafica), a
  scacchiera, nessuno ripetuto.
- 11 · il tuo reel ora è il tuo v01 col profilo che spieghi (giulia.fit, Nome / Foto / Bio, tu sotto) con in alto il titolo
  «Come Far Crescere Una *Coach Fitness* / Sui Social Da 0 A 100K» (la fascia copre il «4» del tuo reel); a +4,35 s il
  riquadro lime tratteggiato attorno al titolo e il resto del reel si scurisce, come il suo. Niente più tazza.
- 13 · verificato: il quadrato verde con la spunta e la barra lime sono il contenuto del tuo reel (tuo3 = m05 a 2,06 s, la
  scheda «19 MAR · Corsa · Carosello · Errore»), non oggetti nostri: restano (annotato nel kit).
- 19 e 21 · i cloni sono 9 creator diversi di `_clip-esterni` (Leila Hormozi al centro, Dan Koe, Hormozi, Codie Sanchez,
  Devin Jatho, Tony Robbins, Steven Bartlett, il cuoco, il fitness) con la stessa scritta «“Ecco Come Diventare Virale”»
  sopra; tinti come prima (21: lime).
- 25 · le tre barre entrano scorrendo da sinistra, tagliate dal bordo: misurato una volta (bordo destro fotogramma per
  fotogramma): −288 px a +0,042 s, −88 a +0,25, −26 a +0,5, ferme a +0,875; la 2ª e la 3ª fanno la stessa corsa 0,083 e
  ~0,2 s dopo (quasi insieme, scaglionate di 2 e 5 fotogrammi, come le sue). Titolo: stanghetta e «3» grigio al taglio,
  «3 Motivi» a +0,1 s.
- render nuovi di `copia-02` e `copia-01`, fogli rifatti solo per le scene corrette (copia-01 25; copia-02 1 5 7 11 13 19 21
  25), ridotto e affiancato rifatti, clip della pagina di O28 e L01 rifatte.

## Scene (una riga per scena del reel)
| # | copia = Kallaway (s) | cosa | funzione · voci | stato |
|---|---|---|---|---|
| 1 | 0–3,417 | titolo «3 Motivi…» + lista lampo; due reel di creator, banda di scansione, card «Clienti» col grafico che scende | COPIA.r05_apertura | fatto |
| 2 | 3,417–8,917 | facecam piena (K01) | cpFacecam | fatto |
| 3 | 8,917–18,542 | lista coi segnaposto sfocati, voce 01 risolta, sale a intestazione; reel del creator, argomenti, anelli di persone | COPIA.L01 · L02 · K14 · O21 + r05_argomenti | fatto |
| 4 | 18,542–20,083 | facecam piena | cpFacecam | fatto |
| 5 | 20,083–22,625 | «Il Tuo Vero Problema»: la card degli argomenti, banda che la scorre | COPIA.r05_problema | fatto |
| 6 | 22,625–24,792 | facecam piena | cpFacecam | fatto |
| 7 | 24,792–30,833 | «Fai Solo Video Che / Aiutano Il Tuo Pubblico»: il tuo reel, contatore, persone, muro di 30 reel | COPIA.r05_target | fatto |
| 8 | 30,833–32,75 | facecam piena | cpFacecam | fatto |
| 9 | 32,75–38,833 | lista, voce 02 risolta (sheen), titolo esce, 02 a intestazione; «Fiducia» e il titolo in borsa | COPIA.L02 · F03 · T08 · K14 + r05_fiducia | fatto |
| 10 | 38,833–44,125 | facecam piena | cpFacecam | fatto |
| 11 | 44,125–54,292 | «La Fiducia Nasce Da Due Cose»: due pillole, il tuo reel, profilo, «Il Posto Giusto…», copione con la zona d'aggancio | COPIA.r05_prove | fatto |
| 12 | 54,292–59,458 | facecam piena | cpFacecam | fatto |
| 13 | 59,458–63,333 | «Informazioni Nuove / Azione Chiara»: il tuo reel, cerchio, due pillole coi lampi | COPIA.r05_azione | fatto |
| 14 | 63,333–66,875 | facecam piena | cpFacecam | fatto |
| 15 | 66,875–72,0 | «Fallo Provare»: la persona, la pagina, la linea fino al ROI che cresce | COPIA.r05_prova | fatto |
| 16 | 72,0–76,792 | facecam piena | cpFacecam | fatto |
| 17 | 76,792–85,125 | lista, voce 03 risolta, a intestazione; «Compra», il tuo reel, il ROI | COPIA.r05_compra (L02 · K14) | fatto |
| 18 | 85,125–88,708 | facecam piena | cpFacecam | fatto |
| 19 | 88,708–93,417 | «Smetti Di Essere Uguale Agli Altri»: il reel del creator clonato, la persona, «Sono tutti uguali» | COPIA.r05_cloni | fatto |
| 20 | 93,417–94,375 | facecam piena | cpFacecam | fatto |
| 21 | 94,375–98,333 | pillole Idee · Metodi · Framework che si impilano; i cloni a sinistra | COPIA.O28 | fatto |
| 22 | 98,333–105,833 | facecam piena | cpFacecam | fatto |
| 23 | 105,833–110,042 | «Distinguiti Con / Qualcosa Di Nuovo»: il tuo reel, scansione, il documento nuovo, anelli di persone | COPIA.r05_nuovo | fatto |
| 24 | 110,042–112,708 | facecam piena | cpFacecam | fatto |
| 25 | 112,708–115,958 | la lista intera di nuovo, risolta | COPIA.r05_riepilogo (L01) | fatto |
| 26 | 115,958–117,708 | facecam piena | cpFacecam | fatto |
| 27 | 117,708–122,09 | CTA «Commenta “clienti”…» + card del tuo video | COPIA.X01 | fatto |
