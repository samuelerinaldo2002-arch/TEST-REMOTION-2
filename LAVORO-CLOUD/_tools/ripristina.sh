#!/usr/bin/env bash
# Il contrario di salva.sh: rimette nei percorsi normali del progetto i file di LAVORO-CLOUD/ (per riprendere il lavoro in
# una sessione cloud nuova, dopo il clone del ramo cloud-catalogo). È anche il modo di fare il RIENTRO nel progetto
# principale (vedi NOTE-DI-RIENTRO.md): si copiano le cartelle di LAVORO-CLOUD/ sopra la radice del progetto, tranne i file
# di servizio della radice di LAVORO-CLOUD (STATO.md, NOTE-DI-RIENTRO.md, MANIFESTO.txt). Anche _tools/ si copia (gli
# script Linux nuovi finiscono accanto a quelli di Windows, senza sostituirne nessuno).
set -eu
R="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$R/LAVORO-CLOUD"
for d in */; do
  d="${d%/}"
  rsync -a "$d/" "$R/$d/"
done
echo "ripristinato nei percorsi normali"
