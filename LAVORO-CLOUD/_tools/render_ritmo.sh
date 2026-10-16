#!/usr/bin/env bash
# Render di prova di una composizione (copia-NN, ritmo-NN…) sotto il lucchetto comune dei render
# (CATALOGO-ANIMAZIONI/_analisi/render/.lock-render): se il lucchetto c'è si aspetta (max 40 min), poi mkdir + chi.txt,
# build, render draft; il lucchetto si toglie sempre (trap). Versione Linux di _script_blocco03/render_ritmo.ps1.
# Uso: bash LAVORO-CLOUD/_tools/render_ritmo.sh copia-02 [voce/nota]
set -u
R="$(cd "$(dirname "$0")/../.." && pwd)"
comp="${1:-copia-02}"; voce="${2:-}"
lock="$R/CATALOGO-ANIMAZIONI/_analisi/render/.lock-render"
out="$R/CATALOGO-ANIMAZIONI/_analisi/render/${comp}_bozza.mp4"
tmp="$R/CATALOGO-ANIMAZIONI/_analisi/render/${comp}_bozza.tmp.mp4"
mkdir -p "$R/CATALOGO-ANIMAZIONI/_analisi/render"
t=0
while ! mkdir "$lock" 2>/dev/null; do
  [ $t -eq 0 ] && echo "lucchetto preso da: $(cat "$lock/chi.txt" 2>/dev/null) - aspetto"
  sleep 20; t=$((t+20))
  if [ $t -gt 2400 ]; then echo "lucchetto ancora preso dopo 40 min: esco"; exit 2; fi
done
trap 'rm -rf "$lock"' EXIT
echo "cloud ($comp) render di prova $voce - $(date '+%d/%m %H:%M')" > "$lock/chi.txt"
node "$R/kw-kit/build.cjs" "$R/CATALOGO-ANIMAZIONI/$comp" || exit 1
cd "$R/CATALOGO-ANIMAZIONI/$comp/composition" || exit 1
rm -f "$tmp"
npx --yes hyperframes@0.8.138 render --quality draft --output "$tmp" 2>&1 | tail -4
if [ -f "$tmp" ]; then mv -f "$tmp" "$out" && echo "ok $out"; else echo "render non riuscito"; exit 1; fi
