# -*- coding: utf-8 -*-
"""Fotogrammi di Kallaway (o della copia) portati a 1080 di larghezza con la griglia delle coordinate ogni 100 px (blocco C2b):
per leggere posizioni e misure sul suo fotogramma nelle coordinate della copia (× 1,5 del suo 720×1280).

    _tools/venv/bin/python -I griglia.py <video> <out.jpg> <t1,t2,…> [y0 0] [y1 1340] [larghezza cella 540]
"""
import sys, math, cv2, numpy as np
v, out, ts = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3].split(",")]
Y0 = int(sys.argv[4]) if len(sys.argv) > 4 else 0
Y1 = int(sys.argv[5]) if len(sys.argv) > 5 else 1340
CW = int(sys.argv[6]) if len(sys.argv) > 6 else 540
cap = cv2.VideoCapture(v); fps = cap.get(cv2.CAP_PROP_FPS)
cells = []
for t in ts:
    cap.set(cv2.CAP_PROP_POS_FRAMES, math.ceil(t * fps - 1e-6)); ok, f = cap.read()
    if not ok: f = np.zeros((1920, 1080, 3), np.uint8)
    f = cv2.resize(f, (1080, int(f.shape[0] * 1080 / f.shape[1])), interpolation=cv2.INTER_CUBIC)[Y0:Y1].copy()
    for x in range(0, 1081, 50):
        cv2.line(f, (x, 0), (x, f.shape[0]), (0, 200, 255) if x % 100 == 0 else (0, 90, 120), 1)
    for y in range((Y0 // 50) * 50, Y1 + 1, 50):
        yy = y - Y0
        if yy < 0: continue
        cv2.line(f, (0, yy), (1080, yy), (0, 200, 255) if y % 100 == 0 else (0, 90, 120), 1)
        if y % 100 == 0: cv2.putText(f, str(y), (2, yy - 3), 0, 0.5, (0, 255, 255), 1)
    for x in range(100, 1080, 100): cv2.putText(f, str(x), (x + 2, 14), 0, 0.45, (0, 255, 255), 1)
    cv2.putText(f, f"{t:.3f}", (950, 30), 0, 0.8, (80, 255, 200), 2)
    s = CW / 1080
    cells.append(cv2.resize(f, (CW, int(f.shape[0] * s)), interpolation=cv2.INTER_AREA))
n = 2 if CW >= 540 else 4
rows = [np.hstack(cells[k:k + n] + [np.zeros_like(cells[0])] * (n - len(cells[k:k + n]))) for k in range(0, len(cells), n)]
cv2.imwrite(out, np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 85])
print(out)
