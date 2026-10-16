#!/usr/bin/env bash
# Ricrea in una sessione cloud NUOVA (Linux) l'ambiente usato il 16/10 per il giro 2 «copia fedele».
# Uso, dalla radice del repository, sul ramo cloud-catalogo:  bash LAVORO-CLOUD/_tools/prepara_ambiente.sh
# Poi: bash LAVORO-CLOUD/_tools/ripristina.sh (rimette i file di LAVORO-CLOUD nei percorsi normali).
set -u
R="$(cd "$(dirname "$0")/../.." && pwd)"; cd "$R"
echo "== rsync"; command -v rsync >/dev/null || (apt-get update -qq && apt-get install -y -qq rsync)
echo "== Python venv (_tools/venv)"
[ -x _tools/venv/bin/python ] || python3 -m venv _tools/venv
_tools/venv/bin/pip install -q numpy opencv-python-headless pillow scipy sherpa-onnx soundfile
[ -e _tools/venv/Scripts ] || ln -s bin _tools/venv/Scripts            # i comandi scritti per Windows funzionano uguale
[ -e _tools/venv/bin/python.exe ] || ln -s python _tools/venv/bin/python.exe
echo "== icone Lucide (build.cjs le legge da ../my-video-ottobre-p1-test, fuori dal repository): lucide-react 0.469.0"
L="$(dirname "$R")/my-video-ottobre-p1-test"
mkdir -p "$L"; [ -f "$L/package.json" ] || echo '{"name":"lucide-holder","private":true}' > "$L/package.json"
(cd "$L" && npm install --no-audit --no-fund -s lucide-react@0.469.0)
echo "== HyperFrames 0.8.138 e il suo Chrome"
npx --yes hyperframes@0.8.138 browser ensure 2>&1 | tail -2
echo "== modello di trascrizione (Parakeet TDT 0.6B v2 int8, al posto di faster-whisper: huggingface.co è bloccato)"
M="$HOME/modelli-asr"; mkdir -p "$M"
if [ ! -f "$M/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8/tokens.txt" ]; then
  curl -sSL -o "$M/p.tar.bz2" https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2 \
    && tar xjf "$M/p.tar.bz2" -C "$M" && rm -f "$M/p.tar.bz2"
fi
echo "== controllo"
node -v; ffmpeg -version | head -1; _tools/venv/bin/python -c "import numpy, cv2, sherpa_onnx; print('python ok')"
ls "$M/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8/tokens.txt" >/dev/null && echo "parakeet ok"
# i percorsi normali di copia-NN non vanno nei commit: li tengo fuori da git status
grep -q "copia-07/" .git/info/exclude 2>/dev/null || printf 'CATALOGO-ANIMAZIONI/copia-02/\nCATALOGO-ANIMAZIONI/copia-07/\n' >> .git/info/exclude
echo "ambiente pronto"
