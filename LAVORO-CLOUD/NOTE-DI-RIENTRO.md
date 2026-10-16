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

## 4. Frammenti da aggiungere (voti_kit.json, tabelle)
(si completa a fine lavoro)
