# -*- coding: utf-8 -*-
"""Blocco 3: foglio di fotogrammi di un render agli istanti dati (con la riga rossa della safe zone a 1332).

    _tools/venv/Scripts/python.exe -I fotogrammi.py <video> <uscita.jpg> <t1,t2,…> [larghezza=300] [colonne=6]
"""
import sys
import numpy as np
import cv2

src, out, ts = sys.argv[1], sys.argv[2], [float(v) for v in sys.argv[3].split(",")]
W = int(sys.argv[4]) if len(sys.argv) > 4 else 300
C = int(sys.argv[5]) if len(sys.argv) > 5 else 6
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
tiles = []
for t in ts:
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
    ok, f = cap.read()
    if not ok:
        f = np.zeros((1920, 1080, 3), np.uint8)
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, 1920))
    cv2.line(f, (0, 1332), (1080, 1332), (0, 0, 255), 3)
    h = int(round(1920 * W / 1080))
    g = cv2.resize(f, (W, h), interpolation=cv2.INTER_AREA)
    cv2.rectangle(g, (0, 0), (W, 26), (0, 0, 0), -1)
    cv2.putText(g, f"{t:.2f}s", (6, 19), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1, cv2.LINE_AA)
    tiles.append(g)
while len(tiles) % C:
    tiles.append(np.zeros_like(tiles[0]))
rows = [np.hstack(tiles[i:i + C]) for i in range(0, len(tiles), C)]
cv2.imwrite(out, np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 88])
print("ok", out, len(ts))
