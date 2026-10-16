# -*- coding: utf-8 -*-
"""Viaggio della camera (C01, transizioni R8): spostamento fra fotogrammi consecutivi con la correlazione di fase, sommato.

    _tools/venv/Scripts/python.exe -I viaggio.py <video> <t0> <t1> <roi x,y,w,h (1080x1920)> <voce>

deriva.py misura rispetto al primo fotogramma e si perde quando la camera esce dalla scena: qui ogni passo si misura fra due
fotogrammi vicini (contenuto in comune), quindi regge anche un viaggio di più schermate. Uscite: spostamento totale (px dello
schermo 1080), inizio (velocità > 150 px/s), durata fino al 90% e al 98%, velocità di picco, curva più vicina sul tratto
inizio → 98%, rimbalzo (quanto si torna indietro dopo il massimo). _analisi/ritmo/blocco03/<voce>_viaggio.json + .jpg
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(QUI, "..", "blocco03"))
EASES = {
    "linear": lambda u: u, "sine.out": lambda u: np.sin(np.pi * u / 2), "power1.out": lambda u: 1 - (1 - u) ** 2,
    "power2.out": lambda u: 1 - (1 - u) ** 3, "power3.out": lambda u: 1 - (1 - u) ** 4, "expo.out": lambda u: 1 - 2 ** (-10 * u),
    "power2.inOut": lambda u: np.where(u < .5, 4 * u ** 3, 1 - 4 * (1 - u) ** 3), "power3.inOut": lambda u: np.where(u < .5, 16 * u ** 5, 1 - 16 * (1 - u) ** 5),
}
path, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
x, y, w, h = [int(float(v)) for v in sys.argv[4].split(",")]
voce = sys.argv[5]
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * fps)))
fr = []
for i in range(int(round((t1 - t0) * fps)) + 1):
    ok, f = cap.read()
    if not ok:
        break
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    g = cv2.cvtColor(f[y:y + h, x:x + w], cv2.COLOR_BGR2GRAY).astype(np.float32)
    fr.append(cv2.GaussianBlur(g, (0, 0), 1.2))
win = cv2.createHanningWindow((w, h), cv2.CV_32F)
D = [(0.0, 0.0)]
for a, b in zip(fr, fr[1:]):
    (dx, dy), resp = cv2.phaseCorrelate(a, b, win)
    D.append((-dx, -dy))  # spostamento della camera = contrario del contenuto
D = np.array(D)
C = np.cumsum(D, axis=0)
T = np.arange(len(C)) / fps
tot = np.hypot(*C[-1])
dist = np.hypot(C[:, 0], C[:, 1])
v = np.r_[0, np.hypot(D[1:, 0], D[1:, 1]) * fps]
i0 = int(np.argmax(v > 150)) if (v > 150).any() else 0
def t_at(k):
    j = np.nonzero(dist >= k * tot)[0]
    return float(T[j[0]]) if len(j) else None
t90, t98 = t_at(0.9), t_at(0.98)
j98 = int(np.nonzero(dist >= 0.98 * tot)[0][0]) if t98 is not None else len(T) - 1
seg = dist[i0:j98 + 1]
u = (seg - seg[0]) / max(1e-6, seg[-1] - seg[0])
fitv = {n: float(np.sqrt(np.mean((f_(np.linspace(0, 1, len(u))) - u) ** 2))) for n, f_ in EASES.items()} if len(u) > 2 else {}
best = sorted(fitv.items(), key=lambda kv: kv[1])
over = float((dist.max() - dist[-1]) / max(1, tot) * 100)
res = {"voce": voce, "video": os.path.basename(path), "t0": t0, "roi": [x, y, w, h], "spostamento_px": [round(float(C[-1, 0]), 1), round(float(C[-1, 1]), 1)],
       "totale_px": round(float(tot), 1), "inizio_s": round(float(T[i0]), 3), "t90_s": round(t90, 3) if t90 is not None else None,
       "t98_s": round(t98, 3) if t98 is not None else None, "durata_90_s": round(t90 - T[i0], 3) if t90 is not None else None,
       "picco_px_s": round(float(v.max()), 0), "t_picco_s": round(float(T[int(np.argmax(v))]), 3), "curva": best[0][0] if best else None,
       "curve_vicine": {k: round(val, 3) for k, val in best[:3]}, "rimbalzo_%": round(over, 1),
       "serie": [[round(float(a), 3), round(float(b), 1), round(float(c), 0)] for a, b, c in zip(T, dist, v)]}
os.makedirs(OUT, exist_ok=True)
json.dump(res, io.open(os.path.join(OUT, voce + "_viaggio.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
W, H = 900, 300
img = np.full((H, W, 3), 28, np.uint8)
tm = max(T[-1], 0.1)
pts = [(30 + int((W - 50) * a / tm), H - 30 - int((H - 60) * (b / max(1, tot)))) for a, b in zip(T, dist)]
cv2.polylines(img, [np.array(pts, np.int32)], False, (80, 251, 207), 2, cv2.LINE_AA)
vm = max(1, v.max())
pv = [(30 + int((W - 50) * a / tm), H - 30 - int((H - 60) * (b / vm))) for a, b in zip(T, v)]
cv2.polylines(img, [np.array(pv, np.int32)], False, (255, 160, 60), 1, cv2.LINE_AA)
cv2.putText(img, f"{voce}: {tot:.0f}px  inizio {res['inizio_s']}s  90% a {res['t90_s']}s  picco {res['picco_px_s']:.0f}px/s  {res['curva']}  rimb {res['rimbalzo_%']}%", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (240, 240, 240), 1, cv2.LINE_AA)
cv2.imwrite(os.path.join(OUT, voce + "_viaggio.jpg"), img)
print(json.dumps({k: v_ for k, v_ in res.items() if k != "serie"}, ensure_ascii=False))
