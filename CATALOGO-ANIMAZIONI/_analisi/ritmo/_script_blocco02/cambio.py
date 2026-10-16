# -*- coding: utf-8 -*-
"""Cambio di stato (F08): quanti pixel del colore d'accento ci sono nella roi, fotogramma per fotogramma.

    _tools/venv/Scripts/python.exe -I cambio.py <video> <t0> <t1> <roi x,y,w,h;…> <rosso|lime> <voce>

Il conteggio normalizzato fra il valore iniziale e quello finale dà la durata del cambio (10% → 90%), se è secco (≤ 2
fotogrammi) o a onda, e la curva. Uscita: _analisi/ritmo/blocco02/<voce>_cambio.json
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(QUI, "..", "blocco02"))
path, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
rois = [[int(float(v)) for v in r.split(",")] for r in sys.argv[4].split(";") if r.strip()]
modo, voce = sys.argv[5], sys.argv[6]
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * fps)))
T, N = [], []
for i in range(int(round((t1 - t0) * fps)) + 1):
    ok, f = cap.read()
    if not ok:
        break
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    n = 0
    for x, y, w, h in rois:
        b, g, r = [c.astype(np.int32) for c in cv2.split(f[y:y + h, x:x + w])]
        m = ((r > 120) & (r - g > 60) & (r - b > 50)) if modo == "rosso" else (((g > 170) & (r > 140) & (b < 150) & (g - b > 70)) if modo == "lime" else ((r > 165) & (g > 165) & (b > 165)))
        n += int(m.sum())
    T.append(t0 + i / fps); N.append(n)
T, N = np.array(T), np.array(N, float)
a, b = np.median(N[:3]), np.median(N[-3:])
u = (N - a) / (b - a) if abs(b - a) > 1 else N * 0
def t_at(k):
    j = np.nonzero(u >= k)[0]
    return float(T[j[0]]) if len(j) else None
t10, t50, t90 = t_at(0.1), t_at(0.5), t_at(0.9)
dur = (t90 - t10) if (t10 is not None and t90 is not None) else None
res = {"voce": voce, "video": os.path.basename(path), "modo": modo, "inizio_px": int(a), "fine_px": int(b), "t10": t10, "t50": t50, "t90": t90,
       "durata_10_90_s": round(dur, 3) if dur is not None else None, "fotogrammi_10_90": int(round(dur * fps)) if dur is not None else None,
       "serie": [[round(float(t), 3), int(n)] for t, n in zip(T, N)]}
os.makedirs(OUT, exist_ok=True)
json.dump(res, io.open(os.path.join(OUT, voce + "_cambio.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in res.items() if k != "serie"}, ensure_ascii=False))
