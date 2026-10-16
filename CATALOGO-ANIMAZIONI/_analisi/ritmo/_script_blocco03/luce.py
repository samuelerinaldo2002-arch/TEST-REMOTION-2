# -*- coding: utf-8 -*-
"""Blocco 3 (F01): quanto si accende una zona, fotogramma per fotogramma — luminanza media nella roi e nell'alone attorno
(una corona larga quanto la roi), normalizzate fra il primo e l'ultimo valore: inizio, 10 → 90%, picco oltre la fine (%).

    _tools/venv/Scripts/python.exe -I luce.py <video | reel:N> <t0> <t1> <roi x,y,w,h> [canale: luma|verde]
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
t0, t1 = float(sys.argv[2]), float(sys.argv[3])
x, y, w, h = [int(v) for v in sys.argv[4].split(",")]
can = sys.argv[5] if len(sys.argv) > 5 else "luma"
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * fps)))
V, A, T = [], [], []
for i in range(int(round((t1 - t0) * fps)) + 1):
    ok, f = cap.read()
    if not ok:
        break
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    g = f[:, :, 1].astype(float) if can == "verde" else cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(float)
    V.append(g[y:y + h, x:x + w].mean())
    X0, Y0, X1, Y1 = max(0, x - w // 2), max(0, y - h // 2), min(1080, x + w + w // 2), min(f.shape[0], y + h + h // 2)
    ring = g[Y0:Y1, X0:X1].copy()
    ring[y - Y0:y - Y0 + h, x - X0:x - X0 + w] = np.nan
    A.append(np.nanmean(ring))
    T.append(t0 + i / fps)
V, A = np.array(V), np.array(A)
def anal(v, nome):
    a, b = v[0], v[-1]
    n = (v - a) / (b - a) if abs(b - a) > 1e-6 else v * 0
    k10 = next((i for i in range(len(n)) if n[i] >= 0.1), None)
    k90 = next((i for i in range(len(n)) if n[i] >= 0.9), None)
    pk = (n.max() - 1) * 100
    print(f"{nome}: {a:.1f} → {b:.1f} · 10% a {T[k10] if k10 is not None else '-':.3f} s · 90% a {T[k90] if k90 is not None else '-':.3f} s · "
          f"10 → 90% in {(k90 - k10) / fps if k10 is not None and k90 is not None else float('nan'):.3f} s · picco oltre la fine {pk:.0f}%")
anal(V, "zona")
anal(A, "alone attorno")
print("valori zona:", " ".join(f"{v:.0f}" for v in V))
print("valori alone:", " ".join(f"{v:.0f}" for v in A))
