# -*- coding: utf-8 -*-
"""Disegna le metriche per fotogramma di un reel (debug/calibrazione).

    _tools/venv/Scripts/python.exe -I _tools/grafico_metriche.py <codice> <out.png> [t0 t1]
"""
import os, sys
import numpy as np
import cv2

QUI = os.path.dirname(os.path.abspath(__file__))
MET = os.path.join(os.path.dirname(QUI), "CATALOGO-ANIMAZIONI", "_analisi", "metriche")

codice, out = sys.argv[1], sys.argv[2]
z = np.load(os.path.join(MET, codice + ".npz"))
m, cols, fps = z["m"], list(z["cols"]), float(z["fps"])
col = lambda c: m[:, cols.index(c)]
n = len(m)
t0 = float(sys.argv[3]) if len(sys.argv) > 3 else 0
t1 = float(sys.argv[4]) if len(sys.argv) > 4 else n / fps
f0, f1 = int(t0 * fps), min(n, int(t1 * fps))
speed = np.hypot(col("tx"), col("ty"))
zoom = np.log(np.maximum(col("sc"), 1e-3)) * 1000
series = [
    ("dall diff tutto", col("dall"), 0, 40),
    ("dtop diff grafica", col("dtop"), 0, 40),
    ("1-hist", 1 - col("hist"), 0, 0.6),
    ("speed px/f", speed, 0, 120),
    ("zoom x1000/f", zoom, -40, 40),
    ("shp nitidezza", col("shp"), 0, 3000),
    ("inl inlier", col("inl"), 0, 300),
    ("loc locale", col("loc"), 0, 30),
    ("nb nero top", col("nb"), 0, 1),
    ("mstd margini", col("mstd"), 0, 40),
]
RW, RH, LW = 1800, 90, 170
img = np.full((RH * len(series) + 30, RW + LW, 3), 22, np.uint8)
xs = lambda f: LW + int((f - f0) / max(1, f1 - f0) * RW)
for s in range(int(t0), int(t1) + 1):
    x = xs(s * fps)
    cv2.line(img, (x, 0), (x, img.shape[0] - 30), (60, 60, 60) if s % 5 else (110, 110, 110), 1)
    if s % 5 == 0:
        cv2.putText(img, str(s), (x - 6, img.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)
for i, (name, v, lo, hi) in enumerate(series):
    y0 = i * RH
    cv2.putText(img, name, (6, y0 + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (220, 220, 220), 1)
    cv2.line(img, (LW, y0 + RH - 1), (LW + RW, y0 + RH - 1), (70, 70, 70), 1)
    pts = []
    for f in range(f0, f1):
        y = y0 + RH - 4 - int((min(max(v[f], lo), hi) - lo) / (hi - lo) * (RH - 10))
        pts.append((xs(f), y))
    cv2.polylines(img, [np.array(pts, np.int32)], False, (80, 251, 207), 1)
cv2.imwrite(out, img)
print("ok", out)
