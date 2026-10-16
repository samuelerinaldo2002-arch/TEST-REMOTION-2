# -*- coding: utf-8 -*-
"""Larghezza delle righe del titolo, Kallaway contro copia (blocco C2b): nelle fasce y0–y1 date, l'estensione x dei pixel chiari
(> soglia) nel suo fotogramma e in una snapshot / render della copia allo stesso istante. Serve a tarare le misure dei font.

    _tools/venv/bin/python -I larghezza_titolo.py <reel.mp4> <copia.png|mp4> <t> <y0:y1,y0:y1,…> [soglia 170]
"""
import sys, math, cv2, numpy as np
kv, cv, t = sys.argv[1], sys.argv[2], float(sys.argv[3])
bande = [tuple(int(v) for v in b.split(":")) for b in sys.argv[4].split(",")]
thr = int(sys.argv[5]) if len(sys.argv) > 5 else 170
def fr(p):
    if p.endswith(".png"): return cv2.imread(p)
    cap = cv2.VideoCapture(p); fps = cap.get(cv2.CAP_PROP_FPS); cap.set(cv2.CAP_PROP_POS_FRAMES, math.ceil(t * fps - 0.02)); ok, f = cap.read(); return f
for nome, f in (("K", fr(kv)), ("C", fr(cv))):
    g = cv2.cvtColor(cv2.resize(f, (1080, 1920)), cv2.COLOR_BGR2GRAY)
    out = []
    for y0, y1 in bande:
        m = g[y0:y1] > thr; xs = np.where(m.sum(0) > 1)[0]; ys = np.where(m.sum(1) > 1)[0]
        out.append(f"y {y0}-{y1}: x {xs[0]}–{xs[-1]} (largo {xs[-1] - xs[0]}), alto {ys[0] + y0}–{ys[-1] + y0}" if len(xs) else f"y {y0}-{y1}: vuoto")
    print(nome, " | ".join(out))
