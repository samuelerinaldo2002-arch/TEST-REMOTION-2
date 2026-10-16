# -*- coding: utf-8 -*-
"""Spezzone coi soli pixel di un colore (lime o bianco) su fondo nero, per pop.py sugli elementi davanti a video o bagliori.

    _tools/venv/Scripts/python.exe -I solo_colore.py <video> <t0> <t1> <lime|bianco|rosso> <uscita.mp4> [roi x,y,w,h]

Fuori dalla roi (se data) tutto nero. 30 fps, 1080x1920. Poi: pop.py --n <uscita.mp4> --t <0,dur> --roi … (tempi dallo 0
dello spezzone).
"""
import sys
import numpy as np
import cv2

path, t0, t1, modo, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4], sys.argv[5]
roi = [int(float(v)) for v in sys.argv[6].split(",")] if len(sys.argv) > 6 else None
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * fps)))
vw = cv2.VideoWriter(out, cv2.VideoWriter_fourcc(*"mp4v"), fps, (1080, 1920))
for i in range(int(round((t1 - t0) * fps)) + 1):
    ok, f = cap.read()
    if not ok:
        break
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, 1920))
    b, g, r = [c.astype(np.int32) for c in cv2.split(f)]
    if modo == "lime":
        m = (g > 170) & (r > 140) & (b < 150) & (g - b > 70)
    elif modo == "rosso":
        m = (r > 120) & (r - g > 60) & (r - b > 50)
    else:
        m = (r > 200) & (g > 200) & (b > 200)
    if roi:
        x, y, w, h = roi
        k = np.zeros_like(m); k[y:y + h, x:x + w] = True; m &= k
    o = np.zeros_like(f); o[m] = (255, 255, 255)
    vw.write(o)
vw.release()
print("ok", out)
