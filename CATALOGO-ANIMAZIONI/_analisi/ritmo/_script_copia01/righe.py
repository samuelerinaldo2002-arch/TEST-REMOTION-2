# -*- coding: utf-8 -*-
"""Spostamento verticale di un contenuto a righe (griglia, lista) fotogramma per fotogramma: correlazione del profilo verticale
(media orizzontale della luminosità in una fascia x) fra fotogrammi consecutivi. Più robusto di SIFT sulle griglie che sfumano.

    _tools/venv/Scripts/python.exe -I righe.py <video> <t0> <t1> --x 300,790 [--y 330,1290]
stampa t, spostamento del fotogramma (px, + = il contenuto scende), cumulato, velocità px/s
"""
import argparse, sys, io
import numpy as np, cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("t0", type=float); ap.add_argument("t1", type=float)
ap.add_argument("--x", default="300,790"); ap.add_argument("--y", default="330,1290")
ap.add_argument("--max", type=int, default=160)
a = ap.parse_args()
X0, X1 = [int(v) for v in a.x.split(",")]; Y0, Y1 = [int(v) for v in a.y.split(",")]
cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
i0, i1 = int(round(a.t0 * fps)), int(round(a.t1 * fps))
cap.set(cv2.CAP_PROP_POS_FRAMES, i0)


def prof():
    ok, f = cap.read()
    if not ok:
        return None
    f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))), interpolation=cv2.INTER_AREA)
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32)
    p = g[:, X0:X1].mean(axis=1)
    d = np.gradient(cv2.GaussianBlur(p.reshape(-1, 1), (1, 5), 0).ravel())
    return d


p0 = prof()
cum = 0.0
print(f"{i0 / fps:7.3f}      0      0")
for i in range(i0 + 1, i1 + 1):
    p1 = prof()
    if p1 is None:
        break
    best, bs = 0, -1e18
    a0 = p0[Y0:Y1]
    for s in range(-a.max, a.max + 1):
        lo, hi = max(Y0, Y0 + s), min(Y1, Y1 + s)
        if hi - lo < 200:
            continue
        b = p1[lo:hi]; c = p0[lo - s:hi - s]
        sc = float(np.dot(b - b.mean(), c - c.mean()) / (np.linalg.norm(b - b.mean()) * np.linalg.norm(c - c.mean()) + 1e-9))
        if sc > bs:
            bs, best = sc, s
    cum += best
    print(f"{i / fps:7.3f} {best:+5d} {cum:+7.0f} {best * fps:7.0f}  r={bs:.2f}")
    p0 = p1
