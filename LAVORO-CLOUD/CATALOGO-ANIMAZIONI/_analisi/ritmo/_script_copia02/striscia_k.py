# -*- coding: utf-8 -*-
"""Striscia di fotogrammi (zona grafica y 0–1340 su 1080x1920) agli istanti dati, con il tempo; per studiare le scene (blocco C2).

    _tools/venv/bin/python -I striscia_k.py <video> <out.jpg> <t1,t2,…|a:b:passo> [altezza 420] [y1 1340]
Il fotogramma preso è il primo con tempo >= t (ceil), così l'istante di un taglio mostra già la scena nuova.
"""
import sys, math, cv2, numpy as np
v, out, spec = sys.argv[1], sys.argv[2], sys.argv[3]
H = int(sys.argv[4]) if len(sys.argv) > 4 else 420
Y1 = int(sys.argv[5]) if len(sys.argv) > 5 else 1340
if ":" in spec:
    a, b, p = [float(x) for x in spec.split(":")]
    ts = list(np.arange(a, b + 1e-6, p))
else:
    ts = [float(x) for x in spec.split(",")]
cap = cv2.VideoCapture(v); fps = cap.get(cv2.CAP_PROP_FPS)
cells = []
for t in ts:
    i = math.ceil(t * fps - 1e-6)
    cap.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = cap.read()
    if not ok: f = np.zeros((1920, 1080, 3), np.uint8)
    f = cv2.resize(f, (1080, int(f.shape[0] * 1080 / f.shape[1])), interpolation=cv2.INTER_AREA)[:Y1]
    f = cv2.resize(f, (int(1080 * H / Y1), H), interpolation=cv2.INTER_AREA)
    cv2.putText(f, f"{i / fps:.2f}", (4, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (80, 255, 200), 2)
    cells.append(f)
rows = [np.hstack(cells[k:k + 8] + [np.zeros_like(cells[0])] * (8 - len(cells[k:k + 8]))) for k in range(0, len(cells), 8)]
cv2.imwrite(out, np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 80])
print(out, len(ts))
