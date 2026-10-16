# -*- coding: utf-8 -*-
"""Mini-clip verticali per griglie e calendari (spezzoni brevi di reel veri, ritagliati e leggeri).

    python -I _tools/mini_clip.py <cartella_uscita> <quanti> [durata=5] [larghezza=240] [altezza=324] [cartelle sorgente…]

Sorgenti di default: _clip-esterni/<creator> (marketing) a rotazione, così ogni giorno/cella ha un video diverso.
Ogni clip parte al 30% del video sorgente; uscita cNN.mp4 (h264, senza audio, 30 fps).
"""
import glob, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
out_dir = os.path.abspath(sys.argv[1])
n = int(sys.argv[2])
dur = float(sys.argv[3]) if len(sys.argv) > 3 else 5.0
W = int(sys.argv[4]) if len(sys.argv) > 4 else 240
H = int(sys.argv[5]) if len(sys.argv) > 5 else 324
cartelle = sys.argv[6:] or ["hormozi", "garyvee", "codiesanchez", "devinjatho", "leilahormozi", "dankoe", "stevenbartlett", "tonyrobbins"]

pools = [sorted(glob.glob(os.path.join(CARTELLA, "_clip-esterni", c, "*.mp4"))) for c in cartelle]
pools = [p for p in pools if p]
src = []
i = 0
while len(src) < n and any(pools):
    p = pools[i % len(pools)]
    if p:
        src.append(p.pop(0))
    i += 1
os.makedirs(out_dir, exist_ok=True)


def durata(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 20.0


def fai(job):
    k, f = job
    out = os.path.join(out_dir, f"c{k + 1:02d}.mp4")
    if os.path.exists(out):
        return out
    t0 = max(0.0, min(durata(f) * 0.3, durata(f) - dur - 0.2))
    vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps=30"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.2f}", "-t", f"{dur:.2f}", "-i", f, "-vf", vf, "-an",
                    "-c:v", "libx264", "-crf", "24", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], cwd="C:\\")
    return out


with ThreadPoolExecutor(6) as ex:
    res = list(ex.map(fai, enumerate(src)))
json.dump([os.path.relpath(f, CARTELLA) for f in src], open(os.path.join(out_dir, "_sorgenti.json"), "w"), indent=1)
print(f"{len(res)} mini-clip in {out_dir}")
