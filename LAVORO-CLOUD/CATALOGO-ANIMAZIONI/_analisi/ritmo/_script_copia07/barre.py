# -*- coding: utf-8 -*-
"""Le barre della lista di Kallaway (reel 5): per ogni fotogramma, le strisce rosse dell'accento a sinistra (x < 300) → y0–y1 di
ogni voce, x dell'accento e larghezza della barra scura (blocco C2). Coordinate 1080x1920.

    _tools/venv/bin/python -I barre.py <video> <t0> <t1> [passo 1] [lime]
Con «lime» cerca l'accento lime della copia (nostro render) al posto del rosso di Kallaway.
"""
import sys, math, cv2, numpy as np
v, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); passo = int(sys.argv[4]) if len(sys.argv) > 4 else 1
LIME = len(sys.argv) > 5 and sys.argv[5] == "lime"
cap = cv2.VideoCapture(v); fps = cap.get(cv2.CAP_PROP_FPS)
i0, i1 = math.ceil(a * fps - 0.02), int(b * fps)
for i in range(i0, i1 + 1, passo):
    cap.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = cap.read()
    if not ok: break
    f = cv2.resize(f, (1080, 1920), interpolation=cv2.INTER_AREA)
    B, G, R = [f[:1340, :, k].astype(int) for k in range(3)]
    red = ((G > 170) & (R > 130) & (B < 0.6 * G)) if LIME else ((R > 120) & (R > 2.2 * G) & (R > 2.2 * B))
    col = red[:, :330].sum(axis=1) > 6
    ys = np.where(col)[0]
    segs = []
    if len(ys):
        s = p = ys[0]
        for y in ys[1:]:
            if y - p > 3: segs.append((s, p)); s = y
            p = y
        segs.append((s, p))
    out = []
    for s, e in segs:
        if e - s < 25: continue
        xs = np.where(red[s:e + 1, :330].any(axis=0))[0]
        m = (s + e) // 2
        g = cv2.cvtColor(f[m:m + 1], cv2.COLOR_BGR2GRAY)[0].astype(int)
        dark = np.where(g[xs[-1]:] > 18)[0]
        xr = xs[-1] + (np.where(g[xs[-1]:] < 14)[0][0] if (g[xs[-1]:] < 14).any() else 0)
        out.append(f"y{s}-{e} x{xs[0]}-{xs[-1]}")
    print(f"{i / fps:7.3f} " + "  ".join(out))
