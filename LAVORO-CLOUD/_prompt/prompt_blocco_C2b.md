Lavori nel progetto TEST KALLAWAYMARKETING, copiato in un repository Git in una sessione CLOUD su Linux: la radice è
/home/user/TEST-REMOTION-2 (non c'è C:\…, non c'è D:\…). Sei il sotto-agente della regia per UN blocco del giro 2 «copia
fedele»: il blocco C2b = REEL 1 INTERO in CATALOGO-ANIMAZIONI/copia-07/. Lavori da solo fino alla fine senza chiedere
approvazioni; non lanciare altri sotto-agenti.

## Leggi prima (in quest'ordine)
1. CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md: sezione in testa «GIRO 2 · COPIA FEDELE» con «Come si fa un blocco di copia»,
   «Prompt di un blocco di copia», «Reel interi» e la tabella del giro 2.
2. I MODELLI: CATALOGO-ANIMAZIONI/copia-01/ (C1, reel 79, approvato dall'utente: «molto bene») e soprattutto
   CATALOGO-ANIMAZIONI/copia-02/ (C2, reel 5, fatto in questa sessione cloud con lo stesso metodo che userai tu): RAPPORTO.md,
   STATO.md (anche «Correzioni della regia»), scene.json, transizioni.json, index.src.html, _lavoro/media.py, gli script in
   CATALOGO-ANIMAZIONI/_analisi/ritmo/_script_copia02/ (tagli.py, striscia_k.py, barre.py, snap_kd.py, clip_pagina.py,
   affiancato.py, misure_c2.py: riusali copiandoli in _script_copia07/ e adattandoli). Stesso ordine, stesso metodo, stessa
   forma dei file. Le note di LAVORO-CLOUD/NOTE-DI-RIENTRO.md §3 hanno le lezioni del cloud.
3. kw-kit/KIT-V2.md, sezioni «Copia fedele» e «Ritmo e template»; kw-kit/kit2-copia-*.js (cpCam, cpTitolo, cpCardVideo,
   cpTelefono, cpFacecam, cpSchermoPieno, TRANS.*, COPIA.*); CATALOGO-ANIMAZIONI/_analisi/ritmo/RITMO.md §8 (come misurare).
4. LAVORO-CLOUD/STATO.md (stato generale del cloud; il tuo è il passo «c»). Se esiste già CATALOGO-ANIMAZIONI/copia-07/STATO.md
   (una sessione precedente si è fermata), riparti dalla sua riga di stato.

## Ambiente cloud (già pronto, non reinstallare)
- Python: `_tools/venv/bin/python -I …` (funziona anche `_tools/venv/Scripts/python.exe`, è un collegamento). Ha numpy,
  opencv, pillow, scipy, sherpa-onnx.
- Build: `node kw-kit/build.cjs CATALOGO-ANIMAZIONI/copia-NN` (le icone Lucide arrivano da /home/user/my-video-ottobre-p1-test,
  già a posto). Check/snapshot: `cd …/composition && npx --yes hyperframes@0.8.138 check` / `snapshot --at 1,2 --no-end
  --describe false`. ATTENZIONE: snapshot SVUOTA la cartella composition/snapshots/: usalo solo in copia-07; se lo usi altrove
  rimetti i file con `git checkout -- CATALOGO-ANIMAZIONI/copia-01/composition/snapshots` e cancella i png nuovi.
- Render di prova (sotto il lucchetto, Linux): `bash LAVORO-CLOUD/_tools/render_ritmo.sh copia-07 "nota"` →
  CATALOGO-ANIMAZIONI/_analisi/render/copia-07_bozza.mp4. Niente GPU: un reel di ~2
  minuti richiede ~7 minuti: pochi render, più scene insieme; lancialo in background e intanto lavora. Per guardare le scene
  mentre le scrivi senza render c'è _script_copia02/snap_kd.py (KALLAWAY | COPIA dalle snapshot).
- Anteprime :30xx: NON avviarle (l'utente non le vede). Al loro posto consegni fogli e video in LAVORO-CLOUD/.
- Trascrizione: faster-whisper non c'è (huggingface bloccato). Quella del reel 1 è già fatta, stesso formato di
  copia-01/_lavoro/r79_parole.json: CATALOGO-ANIMAZIONI/copia-07/_lavoro/r01_parole.json (Parakeet TDT tarato su faster-whisper,
  scarto 0,055 s già corretto). Per altri video: `_tools/venv/bin/python -I LAVORO-CLOUD/_tools/trascrivi.py <mp4> <out.json>`.
- Script con `cwd="C:\\"` (es. _script_copia01/affiancato.py, _tools/mini_clip.py): su Linux si rompono. Se ti servono fai
  una copia NUOVA senza cwd in CATALOGO-ANIMAZIONI/_analisi/ritmo/_script_copia02/ (vale per tutti i tuoi script del blocco).
- Reel di Kallaway: il reel 1 è `TUTTI-I-REEL/2026-10-08_DePIvvKub8b.mp4` (720×1280, 23,976 fps, 119,42 s; nel
  TUTTI-I-REEL/_inventario.json è n = 1: «The easiest way to get more views is to expand the TAM size of your ideas»); i
  reel 25, 84, 96 (per A01) li trovi con l'inventario. Attenzione: il numero
  davanti al nome dei file della radice NON è il numero del reel; usa sempre l'inventario.
- Media dell'utente: i suoi reel veri (D:\CONTENUTI\…) NON ci sono. Usa gli asset già nel repository: kw-kit/avatars/tu.jpg
  (lui), kw-kit/assets/thumbs/mio_*.jpg, i reel dell'utente già tagliati in copia-01/_lavoro/mio_*, copia-01/assets e
  copia-02/assets (anche i 36 fotogrammi diversi dei suoi reel), i reel di creator in _clip-esterni/ e negli assets delle
  composizioni. Annota ogni sostituzione (vedi «Note»).

## Isolamento (regole più importanti, decise dall'utente)
- Ramo: `cloud-catalogo` (ci sei già). Mai main.
- Lavori nei percorsi normali (il build legge kw-kit/kit2-*.js e CATALOGO-ANIMAZIONI/copia-NN/), ma la copia che conta è in
  LAVORO-CLOUD/ con la stessa struttura di percorsi. Ogni file che crei o modifichi nei percorsi normali va elencato (una riga,
  anche con *) in LAVORO-CLOUD/MANIFESTO.txt; `bash LAVORO-CLOUD/_tools/salva.sh` lo copia in LAVORO-CLOUD/ (le cartelle
  composition/ e snapshots/ restano fuori: le rifà il build).
- File NUOVI per il codice di C2b: kw-kit/kit2-copia-r01.js (scene del reel 1 che non sono voci, COPIA.r01_*, aiuti `r1*`),
  kw-kit/kit2-copia-c2b-<categoria>.js (le voci COPIA.<ID> del blocco), kw-kit/kit2-copia-transizioni-c2b.js se servono TRANS
  nuove. Le TRANS.*, gli aiuti cp* di C1 e gli aiuti r5* di C2 si RIUSANO dove servono (non duplicarli; se un aiuto r5* ti
  serve con un comportamento diverso, aggiungi un'opzione in coda col default di prima e annotalo).
- Le voci già copiate in C1/C2 (T01, F02, X01 di C2…) NON si riscrivono: se nel reel 1 la stessa voce è uguale, richiami la
  COPIA.<ID> esistente; se da lui è diversa (altro impaginato, altri tempi), fai una nuova funzione COPIA.r01_<nome> o
  un'opzione in coda, e lo annoti.
- File ESISTENTI (anche quelli di C1 e C2 di questa sessione, già consegnati): non modificarli, tranne un'opzione in coda a
  una funzione col default di prima, verificata (build di copia-01 e copia-02 senza differenze nelle parti già fatte). Ogni file esistente modificato: nel MANIFESTO e annotato in LAVORO-CLOUD/NOTE-DI-RIENTRO.md §1 (file, cosa
  è cambiato, perché). Verifica che senza l'opzione nuova il comportamento sia identico a prima.
- voti_kit.json, tabelle (RIFACIMENTO-RITMO.md, PROSSIMA-SESSIONE.md), catalogo-ritmo.html: NON modificarli. Scrivi invece i
  frammenti da aggiungere in LAVORO-CLOUD/NOTE-DI-RIENTRO.md §4, sotto un nuovo «### C2b» (voti: le voci JSON
  complete del giro "copia 16/10 (blocco C2b)" con `misure` copia → valore · Kallaway → valore e `manca`; la riga della tabella
  del giro 2). La pagina la rigenera l'utente in locale. Le clip della pagina invece le fai con
  _script_copia02/clip_pagina.py (adattato in _script_copia07/): ritmo-clip/<ID>_copia.mp4 e <ID>_kcopia.mp4, nel MANIFESTO.
  ATTENZIONE: se una voce ha già le clip di C1 o C2 (es. T01, X01), NON sovrascriverle: chiama le tue <ID>_copia_r01.mp4 e
  annotalo (sarà l'utente a scegliere quale tenere nella pagina).
- Non toccare: TPL.*, reel-12…16, i reel consegnati, i KW_FISSO, ritmo-01/02/03/09, il comportamento del kit senza KW_RITMO.
- Commit piccoli e frequenti, SOLO di LAVORO-CLOUD/, e push dopo ogni scena finita:
  `bash LAVORO-CLOUD/_tools/salva.sh && git add LAVORO-CLOUD && git commit -m "C2b: scena N <id>" && git push origin cloud-catalogo`
  MAI `git add -A` o `git add .` (i percorsi normali devono restare fuori dai commit). Messaggi di commit in italiano, senza
  nomi di modelli; in fondo al messaggio queste due righe:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01CdCxG9vC6LwG6uAVFnU4LV
  Nessun file sopra 95 MB in LAVORO-CLOUD (salva.sh avvisa): i video di prova si consegnano ridotti (vedi sotto). Se un push dà
  errore 500, fallo a pezzi.
- Stato: aggiorna CATALOGO-ANIMAZIONI/copia-07/STATO.md (riga di stato + tabella scene come in copia-01/STATO.md) e la riga del
  passo in LAVORO-CLOUD/STATO.md a OGNI scena finita, prima del commit: la sessione può fermarsi per il limite e chi riprende
  riparte da lì.

## Il blocco · C2b = REEL 1 INTERO in CATALOGO-ANIMAZIONI/copia-07/ (porta :3047, in cloud niente anteprima)
Reel 1 (TUTTI-I-REEL/2026-10-08_DePIvvKub8b.mp4, 720×1280, 23,976 fps, 119,42 s). Voci del catalogo con rif nel reel 1:
T01 e T02 (0,1–0,6 s), D02 (0,85–1,2 s), X01 e U09 (111–116 s). La tabella del giro 2 nomina anche F02 e A01: F02 se c'è
nel reel 1 la copi al suo posto (verifica); A01 (muro o griglia di reel veri con badge views) ha i rif nei reel 25, 84, 96
(0–3 s): se nel reel 1 non c'è, aggiungila DOPO la fine del reel 1 come voce isolata (taglio netto, un punto diverso del
mondo), copiando il suo tratto migliore dei tre 1:1 sul suo tempo (scena con kallaway: {reel: 25|84|96, t0, t1}); la
durata della composizione diventa 119,42 s + quella coda, e lo scrivi in scene.json e nel RAPPORTO.
Copia 1:1 sul suo tempo: dal primo all'ultimo fotogramma, ogni scena e ogni transizione al suo istante (i tempi in secondi:
il suo reel è a 23,976 fps, la copia a 30). Ordine e metodo identici a C2:
- tagli del reel fotogramma per fotogramma e strisce dei suoi fotogrammi per scena; scene.json ({n, id, t0, t1, cosa,
  funzione, voci: {ID: [t0, t1]}, kallaway: {reel: 1, t0, t1}}; «facecam piena» dove lui è a tutto schermo senza grafica:
  spazio scuro con cpFacecam per la stessa durata);
- COPIA.<ID> con la scheda «/* @copia <ID> · …» (righe kallaway, misure, quando, scena, opzioni, restituisce, colori,
  chiamata) per le voci; COPIA.r01_<nome> per le scene che non sono voci;
- copia-07/index.src.html (KW_RITMO, 1080×1920, 30 fps, safe zone dell'utente), scene.json, transizioni.json (tutte le
  transizioni del reel, forma di copia-02/transizioni.json), STATO.md, RAPPORTO.md.
Come si copia (regole fisse dell'utente):
- Identico a Kallaway in camera, impaginazione, proporzioni, tempi, durate, tipo di oggetti, stile e transizioni; COLORI e
  FONT del brand dell'utente (lime #CFFB50, scuro #1E1E1E, bianco; Advercase / Patrick Hand / Zalando Sans negli stessi ruoli
  dei suoi); testi suoi tradotti in italiano della stessa lunghezza, titoli parola per parola sui tempi delle sue parole e
  delle sue scritte; media dello stesso tipo dei suoi (creator → reel veri di creator, lui → la foto/i reel dell'utente,
  loghi di piattaforme → gli stessi loghi). Kallaway vince sulle regole R1–R8 (si copia lui e si annota). La camera complessa
  si prende dal suo video come in C1 (camtrack.py → cattura_js.py, CP_CATTURE).
- SCENA PIENA AL TAGLIO: al primo fotogramma dopo ogni taglio c'è quello che c'è da lui (in C2 la regia ha dovuto correggere
  scene vuote o tardive al taglio: guarda sempre la cella «+0 s» e «+0,1 s» del foglio). Lezione di C2: un tween che parte a 0
  non si vede al fotogramma 0 del render, lo stato del fotogramma 0 va con `gsap.set`; dopo un taglio basta un `tl.set` poco
  prima del taglio, sotto la copertura della facecam.
- MEDIA VARI COME I SUOI: dove lui mostra tanti reel o creator diversi (muri, griglie, cloni), da noi devono essere tutti
  diversi, mai la stessa immagine ripetuta (correzione della regia in C2). Niente icone stock o sagome dove lui mostra
  persone, profili o schermate vere.
- SAFE ZONE DELL'UTENTE, non quella di Kallaway: niente grafica sotto y = 1332 su 1080×1920 (sotto solo sfumature verso il
  nero; `_tools/safezone.py`, con `--soglia 75` se i puntini dello sfondo danno falsi allarmi). La sua divisione grafica
  sopra / faccia sotto non si copia: le sue proporzioni si riportano nell'area utile y 0–1332 (scala uniforme ×1,5 del suo
  720×1280, stessa frazione, come C1 e C2). 30 fps; niente audio nelle bozze.
- Niente caselle di testo: ogni scena è un'infografica + titolo e ogni elemento spiega quello che si dice.
Verifica (una volta, niente secondi giri su ciò che è a posto):
- build, check (0 errori), fotogramma del taglio di ogni scena guardato;
- render di prova (pochi) e foglio KALLAWAY | COPIA agli stessi istanti dal taglio per ogni scena
  (`_tools/venv/bin/python -I _tools/foglio_kd.py --copia copia-07 [n,…]` → _analisi/ritmo/fogli_regia/copia-07_NN_<id>.jpg),
  guardato: se si vede una differenza nel movimento, nell'impaginazione o nei media la correggi;
- misure UNA volta per voce coi valori di Kallaway accanto (deriva.py, pop.py, ingombro.py, safezone.py; se il valore di
  Kallaway per quella voce non c'è, lo misuri una volta lui con lo stesso strumento); rimisuri solo ciò che correggi;
- video affiancato KALLAWAY | COPIA di tutto il reel senza audio (r01_copia_affiancato.mp4).
Consegna in LAVORO-CLOUD/ (tutto via MANIFESTO + salva.sh):
- codice (kit2-copia-r01.js, kit2-copia-c2b-*.js), copia-07/ intera (index.src.html, scene.json, transizioni.json, STATO.md,
  RAPPORTO.md, assets/, _lavoro/ senza file enormi), _script_copia07/;
- per ogni scena il foglio KALLAWAY | COPIA (fogli_regia/copia-07_NN_<id>.jpg);
- i video di prova ridotti: _analisi/render/copia-07_bozza_540.mp4 (540×960, crf 26, senza audio) e
  _analisi/confronti-video/r01_copia_affiancato.mp4 (sotto 95 MB; controlla con `git status LAVORO-CLOUD` che siano entrati,
  altrimenti `git add -f`);
- le clip della pagina ritmo-clip/<ID>_copia.mp4 e <ID>_kcopia.mp4 delle voci del blocco (_script_copia02/clip_pagina.py
  adattato, senza toccare la pagina né _clip.json);
- NOTE-DI-RIENTRO.md: §1 file nuovi/modificati (sezione «Nuovi (blocco C2b, reel 1 intero)»), §3 sostituzioni di asset e
  cose che non tornano (sezione «Blocco C2b»), §4 frammenti (voti, riga della tabella del giro 2 per C2b); aggiorna anche, in
  testa alle note, la riga «Stato al …» e «Da guardare per primi», e in fondo il paragrafo per PROSSIMA-SESSIONE.md.
- LAVORO-CLOUD/STATO.md: il passo «c» fatto (o la riga di dove sei arrivato, se ti fermi).

## Fine
Rapporto finale alla regia (al massimo 40 righe): voci fatte, numeri copia contro Kallaway, transizioni annotate, cosa non
torna, percorsi dei fogli e dei video, tempo di un render. La regia guarderà una volta i fogli e ti manderà le correzioni in
un solo messaggio.
