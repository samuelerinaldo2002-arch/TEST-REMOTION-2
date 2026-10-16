# -*- coding: utf-8 -*-
"""Ritaglio a risoluzione piena, fotogramma per fotogramma (per studiare effetti: blur, glow, pixel, flare).

    python -I _tools/ritaglio.py <video> <out.jpg> <t0> <t1> <fps|0> <colonne> <x> <y> <w> <h> [larghezza_cella]

Coordinate in pixel sul fotogramma 1080x1920 (il video viene prima portato a 1080x1920).
"""
import os, subprocess, sys

video, out = sys.argv[1], sys.argv[2]
t0, t1, fps, cols = float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), int(sys.argv[6])
x, y, w, h = (int(v) for v in sys.argv[7:11])
cw = int(sys.argv[11]) if len(sys.argv) > 11 else w
font = "C\\:/Windows/Fonts/arial.ttf"
sel = f"fps={fps}," if fps > 0 else ""
n = int((t1 - t0) * (fps if fps > 0 else 30)) + 2
rows = max(1, -(-n // cols))
vf = (f"{sel}scale=1080:1920,crop={w}:{h}:{x}:{y},scale={cw}:-2,"
      f"drawtext=fontfile='{font}':text='%{{pts\\:hms}}':x=4:y=4:fontsize={max(12, cw // 22)}:fontcolor=yellow:box=1:boxcolor=black@0.7,"
      f"tile={cols}x{rows}:padding=4:color=0x3a3a3a")
cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{t0}", "-t", f"{t1 - t0}", "-copyts", "-i", video, "-vf", vf, "-frames:v", "1", "-q:v", "2", out]
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
subprocess.run(cmd, check=True, cwd="C:\\")
print("ok", out)
