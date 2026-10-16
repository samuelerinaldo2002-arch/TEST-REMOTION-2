# Note di rientro · lavoro fatto in cloud (ramo `cloud-catalogo`)

Bozza che si completa a fine lavoro. Tutto quello che è stato creato o modificato in cloud sta in `LAVORO-CLOUD/` con gli
stessi percorsi del progetto; il ramo `main` e i file esistenti nei percorsi normali del ramo non sono toccati.

## 1. File nuovi e file esistenti modificati
(si completa a fine lavoro; l'elenco vivo è `LAVORO-CLOUD/MANIFESTO.txt`)

**Nuovi, solo per il cloud (Linux):**
- `_tools/render_ritmo.sh` — render di prova sotto il lucchetto `CATALOGO-ANIMAZIONI/_analisi/render/.lock-render`
  (mkdir + chi.txt, tolto sempre con `trap`): versione Linux di `_script_blocco03/render_ritmo.ps1`.
- `_tools/trascrivi.py` — trascrizione con tempi parola per parola (vedi §3), uscita nel formato di `copia-01/_lavoro/r79_parole.json`.
- `_tools/salva.sh` / `_tools/ripristina.sh` — percorsi normali ↔ `LAVORO-CLOUD/` (il secondo serve anche al rientro).

**File esistenti modificati (passo a, ritocchi a C1, 16/10):** ogni modifica è un'opzione in coda col default di prima; senza
l'opzione il build di `copia-01` col sorgente di prima differisce solo nei rami nuovi (diff del build verificato: le righe
cambiate sono i rami `if (o.pieno)` / `if (RT)` e i loro `else` con il codice di prima).
- `kw-kit/kit2-copia-oggetti.js` — `COPIA.O30(…, { pieno: true })`: strade già disegnate al primo fotogramma (niente disegno
  0,3 s) e la pallina già lì al taglio, che rotola verso chi guarda ed esce in basso (Ø 68 → 95 → 115 px in 0,17 s, misurata).
  Perché: la regia ha visto il primo fotogramma vuoto; Kallaway al taglio ha la scena piena.
- `kw-kit/kit2-copia-r79.js` — `COPIA.r79_cta(…, { ritocco: true })`: miniatura visibile dal taglio (pannello +22 di luminanza
  sul fondo come il suo, entra in 0,17 s con la sfocatura, segnaposto 1 e strada già partiti), segnaposto della sua misura
  (112 px) e il «2» grande nello zoom (a 104,78 s la miniatura taglia sul «2» ×1,71 e si allontana in alto a destra), chip della
  sua misura (57×38 «Segui», 70×37 campanella con la freccia, nome 15 px) e tuffo ×3,3 attorno a (81, 1198) invece di ×4,5
  (misurato sulla riga del canale ferma: chip 57 → 186 px). Perché: richiesta della regia (miniatura quasi invisibile, «2»
  mancante, chip piccoli).
- `CATALOGO-ANIMAZIONI/copia-01/index.src.html` — passa le due opzioni; per O30 la posa del taglio è già la vista ravvicinata
  (prima era uno zoom di 0,001 s che al primo fotogramma dopo il taglio dava una posa a metà) col contenuto 221 px più in
  basso, che sale come nel suo video (`cpCam.percorso`: 0 · 53 · 141 · 197 · 209 · 216 · 221 px a +0 · 0,084 · 0,164 ·
  0,254 · 0,354 · 0,5 · 0,75 s, misurato sulla strada di destra a y 1000).
- `_tools/foglio_kd.py` — solo il ramo `--copia`: ogni cella prende il primo fotogramma con tempo ≥ istante (prima `POS_MSEC`
  dava il fotogramma precedente: a 30 fps un taglio fra due fotogrammi mostrava a «+0 s» ancora la scena di prima, e la copia
  sembrava vuota al taglio anche quando non lo era). Senza `--copia` non cambia niente.

**Nuovi (blocco C2, reel 5 intero):**
- `kw-kit/kit2-copia-r05.js` — aiuti del reel 5 (`R5`, `r5Titolo` col riquadro che cresce e la linea d'accento, `r5Card`,
  `r5Scan` (banda di luce che scorre una card), `r5Pulse` (disco che pulsa), `r5Chip`, `r5Pillola`, `r5Borsa` (card di borsa /
  ROI che conta), `r5Persona`, `r5Tratteggio`, `r5Tablet`, `r5Strato` (strato del mondo con le coordinate dello schermo a un
  istante: la scena dopo senza taglio di camera), `r5TitoloPieno`) e le scene che non sono voci: `COPIA.r05_apertura`,
  `r05_argomenti`, `r05_problema`, `r05_target`, `r05_fiducia`, `r05_prove`, `r05_azione`, `r05_prova`, `r05_compra`,
  `r05_cloni`, `r05_pezzi`, `r05_nuovo`, `r05_riepilogo`.
- `kw-kit/kit2-copia-c2-liste.js` (`r5Lista`, `R5_VOCI`, **COPIA.L01**, **COPIA.L02**), `kit2-copia-c2-luce.js` (**COPIA.F03**),
  `kit2-copia-c2-camera.js` (**COPIA.K14**, **COPIA.K01**), `kit2-copia-c2-testo.js` (**COPIA.T08**), `kit2-copia-c2-oggetti.js`
  (**COPIA.O21**, **COPIA.O28**), `kit2-copia-c2-chiusura.js` (**COPIA.X01**). Nessuna TRANS nuova: le transizioni del reel 5
  sono tagli, arrivi in corsa, zoom indietro con l'oggetto che resta, linee che continuano e un pan (dentro le scene, annotate
  in `copia-02/transizioni.json`); `TRANS.panVerticale` di C1 qui non serve.
- `CATALOGO-ANIMAZIONI/copia-02/` — `index.src.html` (KW_RITMO, 122,09 s), `scene.json` (27), `transizioni.json` (56),
  `STATO.md`, `RAPPORTO.md`, `assets/` (clip e immagine, `_sorgenti.json`), `_lavoro/` (`media.py`, `r05_parole.json`, strisce
  dei suoi fotogrammi `k/`, misure).
- `CATALOGO-ANIMAZIONI/_analisi/ritmo/_script_copia02/` — `tagli.py` (tagli fotogramma per fotogramma), `striscia_k.py`
  (strisce di fotogrammi della zona grafica, il fotogramma dopo il taglio), `barre.py` (le barre della lista fotogramma per
  fotogramma: accento rosso di Kallaway o lime della copia), `snap_kd.py` (KALLAWAY | COPIA dalle snapshot di HyperFrames, senza
  render), `clip_pagina.py` (clip `ritmo-clip/<ID>_copia.mp4` e `<ID>_kcopia.mp4` con gli stessi parametri di
  `genera_catalogo_ritmo.py`, senza toccare la pagina né `_clip.json`), `affiancato.py` (copia di quello di C1 senza `cwd`).

## 2. Come rimettere tutto nel progetto principale
1. Scaricare il ramo `cloud-catalogo` (o il solo `LAVORO-CLOUD/`).
2. Copiare il contenuto di `LAVORO-CLOUD/` sopra la cartella del progetto `TEST KALLAWAYMARKETING` (le cartelle, non i tre
   file di servizio della radice: `STATO.md`, `NOTE-DI-RIENTRO.md`, `MANIFESTO.txt`). I file nuovi si aggiungono; i file
   esistenti modificati sono elencati al §1 con il perché.
3. Aggiungere a mano i frammenti del §4 (voti_kit.json, tabelle) invece di sovrascrivere quei file.
4. Rilanciare (da completare a fine lavoro): `node kw-kit/build.cjs CATALOGO-ANIMAZIONI/copia-NN` per ogni blocco, il render
   di prova, `_tools/genera_catalogo_ritmo.py --solo <ID>` per le voci nuove, le clip della pagina.

## 3. Sostituzioni, differenze Linux / Windows, cose che non tornano
**Ambiente cloud (16/10):** Linux x64, 4 core, 16 GB, senza GPU (Chrome in software: render più lenti che su Windows).
- Node 22.22, ffmpeg/ffprobe 6.1.1, HyperFrames 0.8.138 con il suo chrome-headless-shell 152 (`npx hyperframes@0.8.138 browser ensure`).
- Python 3.13 in `_tools/venv` (ricreato: numpy, opencv-python-headless, pillow, scipy, faster-whisper, sherpa-onnx). Per non
  cambiare i comandi scritti per Windows ci sono due collegamenti: `_tools/venv/Scripts → bin` e `bin/python.exe → python`.
- **Trascrizione:** faster-whisper small.en non si scarica (huggingface.co è bloccato dal proxy del cloud, anche
  openaipublic.azureedge.net). Al suo posto **NVIDIA Parakeet TDT 0.6B v2** (int8, sherpa-onnx, dalla release GitHub
  `k2-fsa/sherpa-onnx` «asr-models»), con `_tools/trascrivi.py`. Tarato sul reel 79 contro `copia-01/_lavoro/r79_parole.json`:
  427 parole su 434 ritrovate, inizi 0,055 s più tardi di mediana (p90 0,155 s) → corretto con −0,055 s. In locale si può
  continuare con faster-whisper: i tempi sono confrontabili.
- **Icone Lucide:** `kw-kit/build.cjs` le legge da `../my-video-ottobre-p1-test/node_modules/lucide-react` (fuori dal progetto).
  In cloud quella cartella è stata ricreata con **lucide-react 0.469.0**: il build di `copia-01` esce **identico byte per byte**
  al `composition/index.html` del repository (88 icone). In locale non serve niente.
- **PowerShell:** `render_ritmo.ps1` → `_tools/render_ritmo.sh`. Gli script Python con `cwd="C:\\"` (affiancato.py,
  mini_clip.py, ritaglio.py, striscia.py, confronto_video*.py, aperture.py, panoramiche.py) su Linux si rompono: dove servono
  se ne fa una copia nuova senza `cwd` (annotata qui sotto).
- **Asset dell'utente:** i reel veri di `D:\CONTENUTI\...` non ci sono; si usano gli asset già nel repository (annotati per
  blocco qui sotto).

**Blocco C2 (reel 5) · sostituzioni di media e cose che non tornano:**
- I suoi media → media veri dello stesso tipo, già nel repository (`copia-02/assets/_sorgenti.json`, `copia-02/_lavoro/media.py`):
  - scena 1, i due reel di creator (uno in studio, uno col cappellino e il microfono) → `_clip-esterni/dankoe` (2yJU) e
    `garyvee` (vNeW);
  - scena 3, il reel «DOG BREED TRAINABILITY» con la barra-classifica rosso → verde → `_clip-esterni/fitness` (W9-m, la tier
    list colorata a sinistra); la folla nel locale → `_clip-esterni/viaggi` (ufpZ, una folla in sala, con la sua scritta);
  - scene 7, 11, 13, 17, 23, i suoi reel (lui sotto, la grafica sopra) → i tuoi reel già tagliati per C1
    (`copia-01/assets/clips/mio/v01`, `v03`, `m05`, `m01`, `tel_c`), perché i tuoi reel veri (D:\CONTENUTI) non ci sono in cloud;
  - scena 7, il muro coi suoi 30 reel → le 10 miniature dei tuoi reel (`kw-kit/assets/thumbs/mio_01…10`) ripetute;
  - scena 19 e 21, la copertina del creator «This Is How You Go Viral» clonata → una copertina vera di
    `_clip-esterni/stevenbartlett` (7Dtk, «I've been to hell»);
  - scena 27, il suo video 16:9 nello studio → un ritaglio 16:9 del tuo reel `mio/v02` (640×360, bassa definizione: da rifare
    in locale da un tuo video orizzontale);
  - scena 15, la sua pagina («7 Steps to a Short Form Growth System…») e scena 23 il suo documento «New … story template» →
    disegnati (pagina della risorsa gratuita, template), testo italiano della stessa lunghezza.
- Colori: il suo rosso (accento: riquadri, accenti delle barre, pillole, persone «sbagliate», bande, dischi) e il suo verde
  (positivo: soldi, bande sui suoi reel, persone «giuste») → tutti e due lime; il giallo della «zona d'aggancio» → lime; le righe
  rosse del documento → grafite con una riga lime ogni quattro. Il contrasto rosso/verde di alcune scene (scena 3: le persone
  bianche che diventano rosse = sbagliate; scena 23: verdi = giuste) da noi è bianco → lime e lime da subito.
- Il catalogo segna X01 a 118–125 s, ma il file finisce a 122,09 s (video 122,0 s, 2928 fotogrammi; audio 122,09): la CTA è la
  scena 27, 117,708–122,09 s, fino all'ultimo fotogramma.
- K01 (7,1–7,9 s nel catalogo) è dentro la facecam piena 3,417–8,917 s: nessun movimento di camera, è lo stacco sulla faccia;
  da noi lo spazio resta scuro (`COPIA.K01` = `cpFacecam`).
- La trascrizione del reel 5 (`copia-02/_lavoro/r05_parole.json`) è Parakeet tarato (vedi sopra); i titoli seguono comunque i
  tempi delle SUE scritte (misurati sui fotogrammi), che spesso anticipano le parole.

## 4. Frammenti da aggiungere (voti_kit.json, tabelle)
(si completa a fine lavoro)

### C1 ritocchi
Da aggiungere a mano in `_analisi/voti_kit.json` (voci del giro «copia 15/10 (blocco C1)», solo i campi che cambiano):
```json
"O30": { "misure": { "taglio (16/10)": "copia → scena piena al primo fotogramma: strade disegnate, pallina Ø 68 px a y 1100 che rotola verso di noi (Ø 115 a +0,17 s), la camera sale di 221 px in 0,5 s · Kallaway → uguale (pallina Ø 68 → 95 → 113 px, la strada di destra a y 1000 sale 0 · 53 · 141 · 197 · 221 px)" },
         "manca": "al taglio le sue strade sono un po' più strette (prospettiva che cambia: pendenze 0,60 → 0,70); da noi solo la salita, senza il cambio di prospettiva" },
"K06": { "misure": { "tuffo nella riga del canale (16/10)": "copia → ×3,3 attorno a (81, 1198) in 0,33 s, chip 57 → 186 px sullo schermo · Kallaway → ×3,3 (riga ferma: chip «Join» 57×38 → 186×123 px, nome → chip 113 → 377 px)" },
         "manca": "" }
```
`r79_cta` non ha una voce nel catalogo: il ritocco (miniatura visibile dal taglio, «2» grande nello zoom, chip 57×38 e 70×37)
è nella scheda `@copia r79_cta` (`kit2-copia-r79.js`) e in `copia-01/STATO.md` non cambia la riga della scena 25.
Clip della pagina rifatte: `ritmo-clip/O30_copia.mp4`, `ritmo-clip/K06_copia.mp4` (le `_kcopia` non cambiano).
Fogli: `_analisi/ritmo/fogli_regia/copia-01_16_O30.jpg`, `copia-01_25_r79_cta.jpg`. Safe zone sui due tratti: 0 campioni
sotto la linea (O30 141, CTA 76). Render di `copia-01`: 6 min 37 s per 107,6 s (cloud, senza GPU).
