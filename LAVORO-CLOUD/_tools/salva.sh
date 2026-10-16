#!/usr/bin/env bash
# Copia in LAVORO-CLOUD/ (stesso percorso) i file creati o modificati nei percorsi normali del progetto, elencati in
# LAVORO-CLOUD/MANIFESTO.txt (una riga = un file o una cartella relativi alla radice; # = commento). Le cartelle composition/
# (rigenerate dal build), node_modules e snapshots non si copiano. Da lanciare prima di ogni commit.
# Poi: git add LAVORO-CLOUD && git commit … && git push origin cloud-catalogo   (MAI git add -A: i percorsi normali restano fuori)
set -eu
R="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$R"
while IFS= read -r p || [ -n "$p" ]; do
  p="${p%%#*}"; p="$(echo "$p" | sed 's/[[:space:]]*$//')"; [ -z "$p" ] && continue
  case "$p" in LAVORO-CLOUD/*) continue;; esac
  if [ -d "$p" ]; then
    mkdir -p "LAVORO-CLOUD/$p"
    rsync -a --delete --exclude composition/ --exclude node_modules/ --exclude snapshots/ --exclude '*.tmp.mp4' "$p/" "LAVORO-CLOUD/$p/"
  elif [ -f "$p" ]; then
    mkdir -p "LAVORO-CLOUD/$(dirname "$p")"; cp -p "$p" "LAVORO-CLOUD/$p"
  else
    echo "manca: $p"
  fi
done < LAVORO-CLOUD/MANIFESTO.txt
# file sopra 95 MB: GitHub li rifiuta
find LAVORO-CLOUD -type f -size +95M -exec echo "TROPPO GRANDE per GitHub (comprimere o togliere): {}" \;
echo "salvato in LAVORO-CLOUD/"
