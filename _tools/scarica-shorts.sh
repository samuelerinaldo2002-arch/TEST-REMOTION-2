#!/bin/bash
# Scarica gli ultimi N shorts pubblici di un canale YouTube (720p max) per la libreria B-roll del test.
#   bash _tools/scarica-shorts.sh <@canale> <cartella> <N>
cd "$(dirname "$0")/.."
./_tools/yt-dlp.exe --compat-options no-certifi --playlist-end "${3:-12}" \
  -f "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[height<=720]" --merge-output-format mp4 \
  --ffmpeg-location "$(dirname "$(which ffmpeg)")" \
  -o "_clip-esterni/$2/%(upload_date)s_%(id)s.%(ext)s" --write-info-json --no-overwrites --quiet --no-warnings \
  "https://www.youtube.com/$1/shorts"
