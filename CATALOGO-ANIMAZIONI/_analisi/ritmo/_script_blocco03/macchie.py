# -*- coding: utf-8 -*-
"""Blocco 3: dove sono gli elementi di un colore (lime o bianco) in un fotogramma del render → riquadri per pop.py --roi.

    _tools/venv/Scripts/python.exe -I macchie.py <video> <t> <lime|bianco> [area_min=400] [y0=300] [y1=1300]
"""
import sys
import numpy as np
import cv2

src, t, modo = sys.argv[1], float(sys.argv[2]), sys.argv[3]
amin = int(sys.argv[4]) if len(sys.argv) > 4 else 400
y0 = int(sys.argv[5]) if len(sys.argv) > 5 else 300
y1 = int(sys.argv[6]) if len(sys.argv) > 6 else 1300
cap = cv2.VideoCapture(src)
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * (cap.get(cv2.CAP_PROP_FPS) or 30))))
ok, f = cap.read()
b, g, r = [c.astype(np.int32) for c in cv2.split(f)]
if modo == "lime":
    m = (g > 170) & (r > 140) & (b < 150) & (g - b > 70)
else:
    m = (r > 200) & (g > 200) & (b > 200)
m[:y0] = False; m[y1:] = False
m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
n, lab, st, cen = cv2.connectedComponentsWithStats(m)
R = sorted([tuple(st[k]) for k in range(1, n) if st[k][4] >= amin], key=lambda s: (s[1] // 40, s[0]))
for x, y, w, h, a in R:
    print(f"x {x} y {y} w {w} h {h} · area {a} · roi {x - 10},{y - 10},{w + 20},{h + 20}")
