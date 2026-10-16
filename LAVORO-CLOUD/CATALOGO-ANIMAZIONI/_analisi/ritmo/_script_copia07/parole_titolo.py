# -*- coding: utf-8 -*-
"""Istante in cui ogni parola di un titolo di Kallaway diventa bianca (blocco C2b): nella fascia y0–y1 (coordinate 1080×1920)
divide la riga in parole (colonne con pixel chiari nel fotogramma finale, spazi ≥ gap px) e per ognuna dà il primo fotogramma
in cui la parola ha almeno il 60% dei pixel bianchi (> 200) del fotogramma finale.

    _tools/venv/bin/python -I parole_titolo.py <video> <t0> <t1> <y0> <y1> [gap 14] [soglia 200]
"""
import sys, math, cv2, numpy as np
v, t0, t1, y0, y1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
gap = int(sys.argv[6]) if len(sys.argv) > 6 else 14
thr = int(sys.argv[7]) if len(sys.argv) > 7 else 200
cap = cv2.VideoCapture(v); fps = cap.get(cv2.CAP_PROP_FPS)
i0, i1 = math.ceil(t0 * fps - 1e-6), math.ceil(t1 * fps - 1e-6)
cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
F = []
for i in range(i0, i1 + 1):
    ok, f = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(f, (1080, int(f.shape[0] * 1080 / f.shape[1]))), cv2.COLOR_BGR2GRAY)[y0:y1]
    F.append((i, g > thr))
last = F[-1][1]
cols = last.sum(0) > 0
segs, inn, gapc = [], False, 0
for x, c in enumerate(cols):
    if c:
        if not inn: s = x; inn = True
        e = x; gapc = 0
    elif inn:
        gapc += 1
        if gapc >= gap: segs.append((s, e)); inn = False
if inn: segs.append((s, e))
for s, e in segs:
    tot = last[:, s:e + 1].sum()
    t = next((i / fps for i, m in F if (m[:, s:e + 1] & last[:, s:e + 1]).sum() >= 0.6 * tot), None)
    print(f"x {s:4d}–{e:4d}  bianca a {t:.3f} s" if t is not None else f"x {s}-{e} mai")
