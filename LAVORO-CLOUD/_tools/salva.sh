#!/usr/bin/env bash
# Copia in LAVORO-CLOUD/ (stesso percorso) i file creati o modificati nei percorsi normali del progetto, elencati in
# LAVORO-CLOUD/MANIFESTO.txt (una riga = un file, una cartella o un modello con * relativi alla radice; # = commento). Le cartelle composition/
# (rigenerate dal build), node_modules e snapshots non si copiano. Da lanciare prima di ogni commit.
# Poi: git add LAVORO-CLOUD && git commit … && git push origin cloud-catalogo   (MAI git add -A: i percorsi normali restano fuori)
set -eu
R="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$R"
copia() {
  local p="$1"
  if [ -d "$p" ]; then
    mkdir -p "LAVORO-CLOUD/$p"
    rsync -a --delete --exclude composition/ --exclude node_modules/ --exclude snapshots/ --exclude '*.tmp.mp4' "$p/" "LAVORO-CLOUD/$p/"
  elif [ -f "$p" ]; then
    mkdir -p "LAVORO-CLOUD/$(dirname "$p")"; cp -p "$p" "LAVORO-CLOUD/$p"
  else
    echo "manca: $p"
  fi
}
while IFS= read -r riga || [ -n "$riga" ]; do
  riga="${riga%%#*}"; riga="$(echo "$riga" | sed 's/[[:space:]]*$//')"; [ -z "$riga" ] && continue
  case "$riga" in LAVORO-CLOUD/*) continue;; esac
  if [[ "$riga" == *"*"* ]]; then
    for f in $(compgen -G "$riga" || true); do copia "$f"; done
  else
    copia "$riga"
  fi
done < LAVORO-CLOUD/MANIFESTO.txt
# file sopra 95 MB: GitHub li rifiuta
find LAVORO-CLOUD -type f -size +95M -exec echo "TROPPO GRANDE per GitHub (comprimere o togliere): {}" \;
echo "salvato in LAVORO-CLOUD/"
