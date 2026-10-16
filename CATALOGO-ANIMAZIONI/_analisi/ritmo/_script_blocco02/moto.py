# -*- coding: utf-8 -*-
"""Quanto si muove l'immagine, fotogramma per fotogramma (per i muri e le scie, dove deriva.py e viaggio.py non reggono:
griglie periodiche, motion blur forte). Differenza media fra fotogrammi consecutivi nella roi (scala di grigi, 0–255) e nitidezza
(varianza del laplaciano): il movimento c'è dove la differenza è sopra il 20% del picco; la scia dove la nitidezza crolla.

    _tools/venv/Scripts/python.exe -I moto.py <video | reel:N> <t0> <t1> <roi x,y,w,h> <voce> [soglia=0.2]

Uscita: tratti di movimento (inizio, fine, durata, istante del picco) e i tratti con la scia (nitidezza < 35% di quella ferma).
_analisi/ritmo/blocco02/<voce>_moto.json
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
OUT = os.path.abspath(os.path.join(QUI, "..", "blocco02"))
src, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
if src.startswith("reel:"):
    INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
    src = os.path.join(CARTELLA, INV[int(src[5:])]["file"])
x, y, w, h = [int(float(v)) for v in sys.argv[4].split(",")]
voce = sys.argv[5]
thr = float(sys.argv[6]) if len(sys.argv) > 6 else 0.2
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * fps)))
T, D, S, prev = [], [], [], None
for i in range(int(round((t1 - t0) * fps)) + 1):
    ok, f = cap.read()
    if not ok:
        break
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    g = cv2.cvtColor(f[y:y + h, x:x + w], cv2.COLOR_BGR2GRAY).astype(np.float32)
    S.append(float(cv2.Laplacian(g, cv2.CV_32F).var()))
    D.append(0.0 if prev is None else float(np.mean(np.abs(g - prev))))
    T.append(t0 + i / fps)
    prev = g
T, D, S = np.array(T), np.array(D), np.array(S)
pk = D.max() if len(D) else 0
on = D > thr * pk
tratti, i = [], 0
while i < len(on):
    if on[i]:
        j = i
        while j + 1 < len(on) and on[j + 1]:
            j += 1
        k = i + int(np.argmax(D[i:j + 1]))
        tratti.append({"inizio": round(float(T[i] - 1 / fps), 3), "fine": round(float(T[j]), 3), "durata": round(float(T[j] - T[i] + 1 / fps), 3), "picco": round(float(T[k]), 3)})
        i = j + 1
    else:
        i += 1
sf = np.percentile(S, 90)
scia = S < 0.35 * sf
st, i = [], 0
while i < len(scia):
    if scia[i]:
        j = i
        while j + 1 < len(scia) and scia[j + 1]:
            j += 1
        st.append([round(float(T[i]), 3), round(float(T[j]), 3)])
        i = j + 1
    else:
        i += 1
res = {"voce": voce, "video": os.path.basename(src), "fps": fps, "roi": [x, y, w, h], "tratti": tratti, "scia": st,
       "serie": [[round(float(a), 3), round(float(b), 2), round(float(c), 0)] for a, b, c in zip(T, D, S)]}
os.makedirs(OUT, exist_ok=True)
json.dump(res, io.open(os.path.join(OUT, voce + "_moto.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(voce, "· movimento:", " · ".join(f"{q['inizio']}–{q['fine']} ({q['durata']} s, picco {q['picco']})" for q in tratti) or "—", "· scia:", st or "—")
