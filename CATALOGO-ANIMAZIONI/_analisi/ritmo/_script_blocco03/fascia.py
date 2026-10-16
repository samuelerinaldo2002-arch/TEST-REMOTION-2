# -*- coding: utf-8 -*-
"""Blocco 3: estensione verticale e orizzontale del contenuto (righe e colonne con abbastanza pixel sopra soglia), istante per
istante: per liste che si costruiscono e si ri-centrano (L01), barre, schede (deriva.py segue un solo pezzo, qui si vede tutto).

    _tools/venv/Scripts/python.exe -I fascia.py <video | reel:N> <t1,t2,…> [y0=330] [y1=1300] [soglia=40] [quota=0.12]
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
src = sys.argv[1]
if src.startswith("reel:"):
    INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
    src = os.path.join(CARTELLA, INV[int(src[5:])]["file"])
ts = [float(v) for v in sys.argv[2].split(",")]
y0 = int(sys.argv[3]) if len(sys.argv) > 3 else 330
y1 = int(sys.argv[4]) if len(sys.argv) > 4 else 1300
thr = float(sys.argv[5]) if len(sys.argv) > 5 else 40
q = float(sys.argv[6]) if len(sys.argv) > 6 else 0.12
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
for t in ts:
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
    ok, f = cap.read()
    if not ok:
        continue
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    g = cv2.cvtColor(f[y0:y1], cv2.COLOR_BGR2GRAY) > thr
    rows = np.nonzero(g.mean(axis=1) > q)[0]
    cols = np.nonzero(g.mean(axis=0) > q * 0.5)[0]
    if len(rows) == 0:
        print(f"t {t:.3f}: niente")
        continue
    # bande di righe consecutive (le barre)
    bande, a = [], rows[0]
    for i in range(1, len(rows)):
        if rows[i] != rows[i - 1] + 1:
            bande.append((a + y0, rows[i - 1] + y0)); a = rows[i]
    bande.append((a + y0, rows[-1] + y0))
    bande = [b for b in bande if b[1] - b[0] > 12]
    print(f"t {t:.3f}: y {rows[0] + y0}–{rows[-1] + y0} · x {cols[0] if len(cols) else '-'}–{cols[-1] if len(cols) else '-'} · bande {len(bande)}: " + " ".join(f"{a}-{b}" for a, b in bande))
