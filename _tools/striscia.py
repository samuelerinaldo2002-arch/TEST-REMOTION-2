# -*- coding: utf-8 -*-
"""Fogli di fotogrammi con timestamp (per guardare le animazioni fotogramma per fotogramma).

    python -I _tools/striscia.py <video> <out.jpg> <t0> <t1> <fps> <colonne> [larghezza_cella=180] [y0%=0] [y1%=100]

fps = fotogrammi al secondo campionati (0 = tutti i fotogrammi del video). y0/y1 ritagliano una fascia verticale.
"""
import os, subprocess, sys

video, out = sys.argv[1], sys.argv[2]
t0, t1, fps, cols = float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), int(sys.argv[6])
cw = int(sys.argv[7]) if len(sys.argv) > 7 else 180
y0 = float(sys.argv[8]) if len(sys.argv) > 8 else 0
y1 = float(sys.argv[9]) if len(sys.argv) > 9 else 100
font = "C\\:/Windows/Fonts/arial.ttf"
crop = f"crop=iw:ih*{(y1 - y0) / 100:.4f}:0:ih*{y0 / 100:.4f}," if (y0, y1) != (0, 100) else ""
sel = f"fps={fps}," if fps > 0 else ""
n = int((t1 - t0) * (fps if fps > 0 else 23.976)) + 1
rows = max(1, -(-n // cols))
vf = (f"{sel}{crop}scale={cw}:-2,"
      f"drawtext=fontfile='{font}':text='%{{pts\\:hms}}':x=4:y=4:fontsize={max(11, cw // 12)}:fontcolor=white:box=1:boxcolor=black@0.6,"
      f"tile={cols}x{rows}:padding=3:color=0x303030")
cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{t0}", "-t", f"{t1 - t0}", "-copyts", "-i", video, "-vf", vf, "-frames:v", "1", "-q:v", "3", out]
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
subprocess.run(cmd, check=True, cwd="C:\\")
print("ok", out, f"{n} fotogrammi")
