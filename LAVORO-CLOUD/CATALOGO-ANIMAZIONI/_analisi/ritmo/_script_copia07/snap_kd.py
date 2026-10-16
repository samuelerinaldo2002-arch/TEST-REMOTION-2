# -*- coding: utf-8 -*-
"""KALLAWAY (sopra) | COPIA (sotto) dalle snapshot di HyperFrames (composition/snapshots/frame-NN-at-Ts.png) e dal suo reel agli
stessi istanti (blocco C2: verifica veloce senza render). Zona y 0–1340, linea rossa a 1332.

    _tools/venv/bin/python -I snap_kd.py <comp> <reel.mp4> <out.jpg> [altezza 380]
"""
import sys, os, re, math, glob, cv2, numpy as np
comp, reel, out = sys.argv[1], sys.argv[2], sys.argv[3]
H = int(sys.argv[4]) if len(sys.argv) > 4 else 380
snaps = sorted(glob.glob(os.path.join(comp, "composition", "snapshots", "frame-*-at-*s.png")), key=lambda p: int(re.search(r"frame-(\d+)", p).group(1)))
cap = cv2.VideoCapture(reel); fps = cap.get(cv2.CAP_PROP_FPS)
def cella(f, et):
    f = cv2.resize(f, (1080, int(f.shape[0] * 1080 / f.shape[1])))[:1400]
    cv2.line(f, (0, 1332), (1080, 1332), (0, 0, 255), 3)
    f = cv2.resize(f, (int(1080 * H / 1400), H), interpolation=cv2.INTER_AREA)
    cv2.putText(f, et, (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (80, 255, 200), 2)
    return f
K, C = [], []
for p in snaps:
    t = float(re.search(r"at-([\d.]+)s", p).group(1))
    cap.set(cv2.CAP_PROP_POS_FRAMES, math.ceil(t * fps - 0.02)); ok, fk = cap.read()
    K.append(cella(fk if ok else np.zeros((1280, 720, 3), np.uint8), f"K {t:g}"))
    C.append(cella(cv2.imread(p), f"C {t:g}"))
righe = []
for k in range(0, len(K), 8):
    a, b = K[k:k + 8], C[k:k + 8]
    pad = [np.zeros_like(K[0])] * (8 - len(a))
    righe += [np.hstack(a + pad), np.hstack(b + pad)]
cv2.imwrite(out, np.vstack(righe), [cv2.IMWRITE_JPEG_QUALITY, 80])
print(out)
