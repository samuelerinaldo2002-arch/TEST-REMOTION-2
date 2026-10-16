# -*- coding: utf-8 -*-
"""Tagli del reel fotogramma per fotogramma (blocco C2): differenza media fra fotogrammi consecutivi (zona grafica y < 0,69 e
faccia), con i picchi sopra la soglia. Serve a verificare i tagli già misurati (_dati/q1_reel005_auto.json).

    _tools/venv/bin/python -I tagli.py <video> [soglia 18]
"""
import sys, cv2, numpy as np
v = sys.argv[1]; thr = float(sys.argv[2]) if len(sys.argv) > 2 else 18
cap = cv2.VideoCapture(v); fps = cap.get(cv2.CAP_PROP_FPS)
prev = None; i = 0; out = []
while True:
    ok, f = cap.read()
    if not ok: break
    g = cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (90, 160)).astype(np.float32)
    if prev is not None:
        d = float(np.abs(g - prev).mean()); dt = float(np.abs(g[:110] - prev[:110]).mean())
        out.append((i, d, dt))
    prev = g; i += 1
for i, d, dt in out:
    if d > thr or dt > thr:
        print(f"{i:5d} {i / fps:8.3f}  diff {d:5.1f}  alto {dt:5.1f}")
