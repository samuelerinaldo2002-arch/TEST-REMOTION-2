Lavori nel progetto TEST KALLAWAYMARKETING, copiato in un repository Git in una sessione CLOUD su Linux: la radice è
/home/user/TEST-REMOTION-2 (non c'è C:\…, non c'è D:\…). Sei il sotto-agente della regia per UN blocco del giro 2 «copia
fedele»: prima i due ritocchi a C1 (reel 79), poi il blocco C2 = REEL 5 INTERO. Lavori da solo fino alla fine senza chiedere
approvazioni; non lanciare altri sotto-agenti.

## Leggi prima (in quest'ordine)
1. CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md: sezione in testa «GIRO 2 · COPIA FEDELE» con «Come si fa un blocco di copia»,
   «Prompt di un blocco di copia», «Reel interi» e la tabella del giro 2.
2. CATALOGO-ANIMAZIONI/copia-01/RAPPORTO.md, STATO.md, scene.json, transizioni.json, index.src.html: il blocco C1 è il MODELLO
   (approvato dall'utente: «molto bene»). Stesso ordine, stesso metodo, stessa forma dei file.
3. kw-kit/KIT-V2.md, sezioni «Copia fedele» e «Ritmo e template»; kw-kit/kit2-copia-*.js (cpCam, cpTitolo, cpCardVideo,
   cpTelefono, cpFacecam, cpSchermoPieno, TRANS.*, COPIA.*); CATALOGO-ANIMAZIONI/_analisi/ritmo/RITMO.md §8 (come misurare).
4. CATALOGO-ANIMAZIONI/copia-02/STATO.md (riga di stato del blocco) e LAVORO-CLOUD/STATO.md (stato generale del cloud).

## Ambiente cloud (già pronto, non reinstallare)
- Python: `_tools/venv/bin/python -I …` (funziona anche `_tools/venv/Scripts/python.exe`, è un collegamento). Ha numpy,
  opencv, pillow, scipy, sherpa-onnx.
- Build: `node kw-kit/build.cjs CATALOGO-ANIMAZIONI/copia-NN` (le icone Lucide arrivano da /home/user/my-video-ottobre-p1-test,
  già a posto). Check/snapshot: `cd …/composition && npx --yes hyperframes@0.8.138 check` / `snapshot --at 1,2 --no-end
  --describe false`. ATTENZIONE: snapshot SVUOTA la cartella composition/snapshots/: usalo solo in copia-02; se lo usi in
  copia-01 rimetti i file con `git checkout -- CATALOGO-ANIMAZIONI/copia-01/composition/snapshots` e cancella i png nuovi.
- Render di prova (sotto il lucchetto, Linux): `bash LAVORO-CLOUD/_tools/render_ritmo.sh copia-02 "nota"` →
  CATALOGO-ANIMAZIONI/_analisi/render/copia-02_bozza.mp4. Niente GPU: un reel di ~2 minuti richiede vari minuti (misura il
  tempo del primo e regolati: pochi render, più scene insieme; lancialo in background e intanto lavora). Il render di
  riferimento di C1 (prima dei ritocchi) è _analisi/render/copia-01_bozza.mp4: la regia lo sta facendo adesso (lucchetto
  preso; lo script aspetta da solo); quando c'è, copialo in copia-01_bozza_prima.mp4 prima di rifarlo.
- Anteprime :30xx: NON avviarle (l'utente non le vede). Al loro posto consegni fogli e video in LAVORO-CLOUD/.
- Trascrizione: faster-whisper non c'è (huggingface bloccato). Quella del reel 5 è già fatta, stesso formato di
  copia-01/_lavoro/r79_parole.json: CATALOGO-ANIMAZIONI/copia-02/_lavoro/r05_parole.json (Parakeet TDT tarato su faster-whisper,
  scarto 0,055 s già corretto). Per altri video: `_tools/venv/bin/python -I LAVORO-CLOUD/_tools/trascrivi.py <mp4> <out.json>`.
- Script con `cwd="C:\\"` (es. _script_copia01/affiancato.py, _tools/mini_clip.py): su Linux si rompono. Se ti servono fai
  una copia NUOVA senza cwd in CATALOGO-ANIMAZIONI/_analisi/ritmo/_script_copia02/ (vale per tutti i tuoi script del blocco).
- Reel di Kallaway: il reel 5 è `03_2026-10-04_DeFA_f1uwLt.mp4` nella radice (720×1280, 24 fps, 122,09 s; nel
  TUTTI-I-REEL/_inventario.json è n = 5); il reel 79 è `77_2026-07-08_DaiCxAkOpNb.mp4` (n = 79). Attenzione: il numero
  davanti al nome dei file della radice NON è il numero del reel; usa sempre l'inventario.
- Media dell'utente: i suoi reel veri (D:\CONTENUTI\…) NON ci sono. Usa gli asset già nel repository: kw-kit/avatars/tu.jpg
  (lui), kw-kit/assets/thumbs/mio_*.jpg, i reel dell'utente già tagliati in copia-01/_lavoro/mio_* e copia-01/assets, i reel
  di creator in _clip-esterni/ e negli assets delle composizioni. Annota ogni sostituzione (vedi «Note»).

## Isolamento (regole più importanti, decise dall'utente)
- Ramo: `cloud-catalogo` (ci sei già). Mai main.
- Lavori nei percorsi normali (il build legge kw-kit/kit2-*.js e CATALOGO-ANIMAZIONI/copia-NN/), ma la copia che conta è in
  LAVORO-CLOUD/ con la stessa struttura di percorsi. Ogni file che crei o modifichi nei percorsi normali va elencato (una riga,
  anche con *) in LAVORO-CLOUD/MANIFESTO.txt; `bash LAVORO-CLOUD/_tools/salva.sh` lo copia in LAVORO-CLOUD/ (le cartelle
  composition/ e snapshots/ restano fuori: le rifà il build).
- File NUOVI per il codice di C2: kw-kit/kit2-copia-r05.js (scene del reel 5 che non sono voci, COPIA.r05_*),
  kw-kit/kit2-copia-c2-<categoria>.js (le voci COPIA.<ID> del blocco: liste, oggetti, camera, luce, testo…),
  kw-kit/kit2-copia-transizioni-c2.js se servono TRANS nuove. Le TRANS.* di C1 si RIUSANO (non duplicarle).
- File ESISTENTI: non modificarli, tranne dove serve davvero: i due ritocchi a C1 (kit2-copia-oggetti.js per O30,
  kit2-copia-r79.js per la CTA, copia-01/index.src.html per passare l'opzione), un'opzione in coda a una funzione del kit col
  default di prima. Ogni file esistente modificato: nel MANIFESTO e annotato in LAVORO-CLOUD/NOTE-DI-RIENTRO.md §1 (file, cosa
  è cambiato, perché). Verifica che senza l'opzione nuova il comportamento sia identico a prima.
- voti_kit.json, tabelle (RIFACIMENTO-RITMO.md, PROSSIMA-SESSIONE.md), catalogo-ritmo.html: NON modificarli. Scrivi invece i
  frammenti da aggiungere in LAVORO-CLOUD/NOTE-DI-RIENTRO.md §4, sotto «### C1 ritocchi» e «### C2» (voti: le voci JSON
  complete del giro "copia 16/10 (blocco C2)" con `misure` copia → valore · Kallaway → valore e `manca`; la riga della tabella
  del giro 2). La pagina la rigenera l'utente in locale. Le clip della pagina invece le fai: puoi lanciare
  `_tools/genera_catalogo_ritmo.py --solo <ID,…>` per creare ritmo-clip/<ID>_copia.mp4 e <ID>_kcopia.mp4 (mettile nel
  MANIFESTO), ma SUBITO dopo rimetti com'erano i file esistenti che lo script riscrive: `git checkout --
  CATALOGO-ANIMAZIONI/catalogo-ritmo.html CATALOGO-ANIMAZIONI/ritmo-clip/` (attento: non cancellare le clip nuove non
  tracciate; `git status` per controllare).
- Non toccare: TPL.*, reel-12…16, i reel consegnati, i KW_FISSO, ritmo-01/02/03/09, il comportamento del kit senza KW_RITMO.
- Commit piccoli e frequenti, SOLO di LAVORO-CLOUD/, e push dopo ogni scena finita (e dopo i ritocchi a C1):
  `bash LAVORO-CLOUD/_tools/salva.sh && git add LAVORO-CLOUD && git commit -m "C2: scena N <id>" && git push origin cloud-catalogo`
  MAI `git add -A` o `git add .` (i percorsi normali devono restare fuori dai commit). Messaggi di commit in italiano, senza
  nomi di modelli; in fondo al messaggio queste due righe:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01CdCxG9vC6LwG6uAVFnU4LV
  Nessun file sopra 95 MB in LAVORO-CLOUD (salva.sh avvisa): i video di prova si consegnano ridotti (vedi sotto). Se un push dà
  errore 500, fallo a pezzi.
- Stato: aggiorna CATALOGO-ANIMAZIONI/copia-02/STATO.md (riga di stato + tabella scene come in copia-01/STATO.md) e la riga del
  passo in LAVORO-CLOUD/STATO.md a OGNI scena finita, prima del commit: la sessione può fermarsi per il limite e chi riprende
  riparte da lì.

## Passo a · due ritocchi a C1 (reel 79), con un'opzione in coda col default di prima
1. O30, «La finta», scena 16 a 53,846 s: il primo fotogramma della copia è vuoto; in Kallaway strade e pallina sono già al
   taglio. Scena piena al taglio (oggetti già montati al primo fotogramma), come lui.
2. CTA finale, scena 25 a 100,06 s (COPIA.r79_cta): la miniatura del video è quasi invisibile nei primi 0,5 s; nello zoom
   manca il «2» grande che c'è in Kallaway; i chip sono troppo piccoli. Guarda i suoi fotogrammi (reel 79 da 100,06 s) e rendi
   uguali visibilità, «2» e dimensione dei chip.
Verifica: build, check, render di copia-01, foglio `_tools/venv/bin/python -I _tools/foglio_kd.py --copia copia-01 16,25`
guardato (KALLAWAY | COPIA), safezone.py sul tratto. Consegna in LAVORO-CLOUD i fogli nuovi
(CATALOGO-ANIMAZIONI/_analisi/ritmo/fogli_regia/copia-01_16_O30.jpg e copia-01_25_*.jpg) e le clip O30_copia/K06_copia se le
rifai. Commit + push. Poi C2.

## Passo b · C2 = REEL 5 INTERO in CATALOGO-ANIMAZIONI/copia-02/
Reel 5 (03_2026-10-04_DeFA_f1uwLt.mp4, 720×1280, 24 fps, 122,09 s): «These are the three reasons why your content is not
driving leads». Contiene le voci del catalogo L01 (9–12,5 s), L02 (10,7–11,6 e 34–35 s), K14 (13,5–15,5 s), O21 (16–18 s),
F03 (34–35 s), T08 (35,2–35,5 s), K01 (7,1–7,9 s), O28 (89–97 s); X01 è segnata a 118–125 s ma il file finisce a 122,09:
verifica cosa c'è davvero e annotalo. Tagli già misurati (aiuto, da verificare):
CATALOGO-ANIMAZIONI/_analisi/ritmo/_dati/q1_reel005_auto.json.
Copia 1:1 sul suo tempo: dal primo all'ultimo fotogramma, ogni scena e ogni transizione al suo istante, durata della
composizione = la sua. Ordine e metodo identici a C1:
- tagli del reel e fogli dei suoi fotogrammi; elenco delle scene in copia-02/scene.json ({n, id, t0, t1, cosa, funzione,
  voci: {ID: [t0, t1]}, kallaway: {reel: 5, t0, t1}}; «facecam piena» dove lui è a tutto schermo senza grafica: spazio scuro
  con cpFacecam per la stessa durata);
- COPIA.<ID> con la scheda «/* @copia <ID> · …» (righe kallaway, misure, quando, scena, opzioni, restituisce, colori,
  chiamata) per le voci; COPIA.r05_<nome> per le scene che non sono voci; TRANS.* riusate da C1;
- copia-02/index.src.html (KW_RITMO, 1080×1920, 30 fps, safe zone dell'utente), scene.json, transizioni.json (tutte le
  transizioni del reel, forma di copia-01/transizioni.json), STATO.md, RAPPORTO.md (forma di copia-01/RAPPORTO.md).
Come si copia (regole fisse dell'utente):
- Identico a Kallaway in camera, impaginazione, proporzioni, tempi, durate, tipo di oggetti, stile e transizioni; COLORI e
  FONT del brand dell'utente (lime #CFFB50, scuro #1E1E1E, bianco; Advercase / Patrick Hand / Zalando Sans negli stessi ruoli
  dei suoi); testi suoi tradotti in italiano della stessa lunghezza, titoli parola per parola sui tempi delle sue parole
  (r05_parole.json); media dello stesso tipo dei suoi (creator → reel veri di creator, lui → la foto/i reel dell'utente,
  loghi di piattaforme → gli stessi loghi). Kallaway vince sulle regole R1–R8 (si copia lui e si annota). Scena piena al
  taglio. La camera complessa si prende dal suo video come in C1 (camtrack.py → cattura_js.py, CP_CATTURE).
- SAFE ZONE DELL'UTENTE, non quella di Kallaway: niente grafica sotto y = 1332 su 1080×1920 (sotto solo sfumature verso il
  nero; `_tools/safezone.py`). La sua divisione grafica sopra / faccia sotto non si copia: le sue proporzioni si riportano
  nell'area utile y 0–1332 (in C1: scala uniforme ×1,5 del suo 720×1280, stessa frazione). 30 fps anche se il suo reel è a 24;
  niente audio nelle bozze.
- Niente caselle di testo: ogni scena è un'infografica + titolo e ogni elemento spiega quello che si dice. Niente sagome
  generiche o oggetti stock (fotocamera, sagoma del ragazzo) se Kallaway mostra altro: si copia quello che mostra lui.
Verifica (una volta, niente secondi giri su ciò che è a posto):
- build, check (0 errori), fotogramma del taglio di ogni scena guardato;
- render di prova (pochi: più scene insieme) e foglio KALLAWAY | COPIA agli stessi istanti dal taglio per ogni scena
  (`_tools/venv/bin/python -I _tools/foglio_kd.py --copia copia-02 [n,…]` → _analisi/ritmo/fogli_regia/copia-02_NN_<id>.jpg),
  guardato: se si vede una differenza nel movimento o nell'impaginazione la correggi;
- misure UNA volta per voce coi valori di Kallaway accanto (deriva.py, pop.py, ingombro.py in _script_blocco03, safezone.py;
  se il valore di Kallaway per quella voce non c'è, lo misuri una volta lui con lo stesso strumento); rimisuri solo ciò che
  correggi;
- video affiancato KALLAWAY | COPIA di tutto il reel senza audio (copia di _script_copia01/affiancato.py in _script_copia02/,
  senza cwd).
Consegna in LAVORO-CLOUD/ (tutto via MANIFESTO + salva.sh):
- codice (kit2-copia-r05.js, kit2-copia-c2-*.js), copia-02/ intera (index.src.html, scene.json, transizioni.json, STATO.md,
  RAPPORTO.md, assets/, _lavoro/ con le misure e i fogli di lavoro utili, senza file enormi), _script_copia02/;
- per ogni scena il foglio KALLAWAY | COPIA (fogli_regia/copia-02_NN_<id>.jpg);
- i video di prova ridotti: _analisi/render/copia-02_bozza_540.mp4 (540×960, crf 26, senza audio) e
  _analisi/confronti-video/r05_copia_affiancato.mp4 (sotto 95 MB; le due cartelle sono in .gitignore, ma salva.sh copia lo
  stesso i file elencati nel MANIFESTO dentro LAVORO-CLOUD, dove non sono ignorati: controlla con `git status LAVORO-CLOUD`
  che siano entrati, altrimenti `git add -f`);
- le clip della pagina ritmo-clip/<ID>_copia.mp4 e <ID>_kcopia.mp4 delle voci del blocco;
- NOTE-DI-RIENTRO.md: §1 file nuovi/modificati, §3 sostituzioni di asset e cose che non tornano, §4 frammenti (voti, riga
  della tabella).

## Fine
Rapporto finale alla regia (al massimo 40 righe): voci fatte, numeri copia contro Kallaway, transizioni annotate, cosa non
torna, percorsi dei fogli e dei video, tempo di un render. La regia guarderà una volta i fogli e ti manderà le correzioni in
un solo messaggio.
