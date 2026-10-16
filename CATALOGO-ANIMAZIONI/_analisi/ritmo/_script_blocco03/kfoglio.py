# -*- coding: utf-8 -*-
"""Blocco 2 del rifacimento: foglio dei fotogrammi di Kallaway ai tempi rif del catalogo + i suoi tagli esatti.

    python -I kfoglio.py <ID> <reel> <t0> <t1> [fps=8] [margine=1.0]

Tagli: ffmpeg select='gt(scene,0.2)',showinfo nella finestra allargata di 2,5 s (poi si controllano a vista sul foglio).
Foglio: _analisi/ritmo/blocco03/K_<ID>_r<reel>.jpg (fotogrammi a <fps>, da t0 - margine a t1 + margine).
"""
import io, json, os, re, subprocess, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
OUT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi", "ritmo", "blocco03")
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}

voce, n, t0, t1 = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
fps = float(sys.argv[5]) if len(sys.argv) > 5 else 8
mg = float(sys.argv[6]) if len(sys.argv) > 6 else 1.0
src = os.path.join(CARTELLA, INV[n]["file"])
os.makedirs(OUT, exist_ok=True)
a, b = max(0, t0 - 2.5), t1 + 2.5
r = subprocess.run(["ffmpeg", "-hide_banner", "-ss", f"{a}", "-t", f"{b - a}", "-copyts", "-i", src, "-vf",
                    "select='gt(scene,0.2)',showinfo", "-f", "null", "-"], capture_output=True, text=True, encoding="utf-8", errors="replace")
tagli = [(float(m.group(1)), None) for m in re.finditer(r"pts_time:([\d.]+)", r.stderr)]
sc = [float(m.group(1)) for m in re.finditer(r"scene_score=([\d.]+)", r.stderr)]
print(f"{voce} · reel {n} ({INV[n]['file']}) · finestra {a:.2f}–{b:.2f} s")
print("  tagli (scene > 0,2):", ", ".join(f"{t:.3f}" for t, _ in tagli) or "nessuno")
out = os.path.join(OUT, f"K_{voce}_r{n}.jpg")
subprocess.run([sys.executable, "-I", os.path.join(CARTELLA, "_tools", "striscia.py"), src, out, f"{max(0, t0 - mg)}", f"{t1 + mg}", f"{fps}", "8", "170"], check=True)
