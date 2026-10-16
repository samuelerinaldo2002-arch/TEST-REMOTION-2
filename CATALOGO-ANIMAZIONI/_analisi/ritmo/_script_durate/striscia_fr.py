# -*- coding: utf-8 -*-
"""Frame-by-frame strip for close inspection: striscia_fr.py <n|path> t0 t1 [step] [nome]
   n = reel number (inventario) or a video path. Writes to ritmo/_dati/strisce/."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comune import *
import cv2
from fogli_lib import put
utf8_stdout()
src = sys.argv[1]
path = reel_path(int(src)) if src.isdigit() else src
t0, t1 = float(sys.argv[2]), float(sys.argv[3])
step = int(sys.argv[4]) if len(sys.argv) > 4 else 1
nome = sys.argv[5] if len(sys.argv) > 5 else f"{os.path.splitext(os.path.basename(path))[0]}_{t0:.2f}-{t1:.2f}"
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS)
f0, f1 = int(round(t0 * fps)), int(round(t1 * fps))
cap.set(cv2.CAP_PROP_POS_FRAMES, f0)
cells = []
cw, ch = 150, 267
for f in range(f0, f1 + 1):
    ok, fr = cap.read()
    if not ok:
        break
    if (f - f0) % step:
        continue
    c = cv2.resize(fr, (cw, ch), interpolation=cv2.INTER_AREA)
    c = cv2.copyMakeBorder(c, 0, 18, 0, 3, cv2.BORDER_CONSTANT, value=(28, 28, 28))
    put(c, f"{f/fps:.2f} f{f}", (3, ch + 14), 0.42)
    cells.append(c)
cols = 12
rows = []
for i in range(0, len(cells), cols):
    r = cells[i:i + cols]
    while len(r) < cols:
        r.append(np.full_like(cells[0], 28))
    rows.append(np.hstack(r))
img = np.vstack(rows)
od = os.path.join(DATI, "strisce"); os.makedirs(od, exist_ok=True)
p = os.path.join(od, nome + ".jpg")
cv2.imwrite(p, img, [cv2.IMWRITE_JPEG_QUALITY, 85])
print(p, img.shape)
