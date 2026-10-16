# -*- coding: utf-8 -*-
"""Proporzioni come Kallaway: quanto occupa la grafica nel fotogramma (sotto il titolo, sopra la faccia).

    _tools/venv/Scripts/python.exe -I ingombro.py <video | reel:N> <t> [y0=300] [y1=1300] [soglia=45]

Pixel che si staccano dal fondo (luminanza > soglia, o saturi) fra y0 e y1 → estensione fra i percentili 1 e 99 in x e y:
larghezza in frazione di 1080, altezza in px, area coperta. Stampa una riga; con più istanti separati da virgola, la mediana.
"""
import io, json, os, sys
import numpy as np
import cv2

QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
src = sys.argv[1]
if src.startswith("reel:"):
    INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
    src = os.path.join(CARTELLA, INV[int(src[5:])]["file"])
ts = [float(v) for v in sys.argv[2].split(",")]
y0 = int(sys.argv[3]) if len(sys.argv) > 3 else 300
y1 = int(sys.argv[4]) if len(sys.argv) > 4 else 1300
thr = float(sys.argv[5]) if len(sys.argv) > 5 else 45
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
R = []
for t in ts:
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
    ok, f = cap.read()
    if not ok:
        continue
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    c = f[y0:y1]
    hsv = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
    m = (c.mean(axis=2) > thr) | ((hsv[..., 1] > 90) & (hsv[..., 2] > 60))
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)) > 0
    ys, xs = np.nonzero(m)
    if len(xs) < 100:
        continue
    xa, xb, ya, yb = np.percentile(xs, 1), np.percentile(xs, 99), np.percentile(ys, 1) + y0, np.percentile(ys, 99) + y0
    R.append((t, (xb - xa) / 1080, xa, xb, ya, yb, m.mean()))
for r in R:
    print(f"t {r[0]:.2f}: larghezza {r[1]:.3f} (x {r[2]:.0f}–{r[3]:.0f}) · y {r[4]:.0f}–{r[5]:.0f} ({r[5] - r[4]:.0f} px) · coperto {r[6]:.2f}")
if len(R) > 1:
    a = np.array([r[1:] for r in R])
    print(f"mediana: larghezza {np.median(a[:, 0]):.3f} · y {np.median(a[:, 3]):.0f}–{np.median(a[:, 4]):.0f} · coperto {np.median(a[:, 5]):.2f}")
