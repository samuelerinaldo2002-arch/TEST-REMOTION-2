# -*- coding: utf-8 -*-
"""Apertura di un anello (O01, O21…): raggio medio del contenuto chiaro attorno al suo baricentro, fotogramma per fotogramma.

    _tools/venv/Scripts/python.exe -I radiale.py <video> <t0> <t1> <roi x,y,w,h (spazio 1080x1920)> <voce> [soglia=55]

Per ogni fotogramma: pixel con luminanza > soglia nella roi → baricentro e raggio RMS. Normalizzato sul valore finale dà la curva
d'apertura: tempo al 50% e al 90%, curva più vicina (stesse candidate di deriva.py), rimbalzo (picco oltre il valore finale).
Uscita: _analisi/ritmo/blocco02/<voce>_radiale.json + .jpg (grafico).
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(QUI, "..", "blocco02"))
EASES = {
    "linear": lambda u: u, "sine.out": lambda u: np.sin(np.pi * u / 2), "power1.out": lambda u: 1 - (1 - u) ** 2,
    "power2.out": lambda u: 1 - (1 - u) ** 3, "power3.out": lambda u: 1 - (1 - u) ** 4, "expo.out": lambda u: 1 - 2 ** (-10 * u),
    "power2.inOut": lambda u: np.where(u < .5, 4 * u ** 3, 1 - 4 * (1 - u) ** 3),
}
path, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
x, y, w, h = [int(float(v)) for v in sys.argv[4].split(",")]
voce = sys.argv[5]
thr = float(sys.argv[6]) if len(sys.argv) > 6 else 55
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * fps)))
T, Rr = [], []
for i in range(int(round((t1 - t0) * fps)) + 1):
    ok, f = cap.read()
    if not ok:
        break
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    g = cv2.cvtColor(f[y:y + h, x:x + w], cv2.COLOR_BGR2GRAY).astype(np.float32)
    ys, xs = np.nonzero(g > thr)
    if len(xs) < 50:
        T.append(i / fps); Rr.append(np.nan); continue
    cx, cy = xs.mean(), ys.mean()
    T.append(i / fps); Rr.append(float(np.sqrt(np.mean((xs - cx) ** 2 + (ys - cy) ** 2))))
T, Rr = np.array(T), np.array(Rr)
ok = ~np.isnan(Rr)
T, Rr = T[ok], Rr[ok]
r0, r1 = Rr[0], np.median(Rr[-max(3, len(Rr) // 6):])
u = (Rr - r0) / (r1 - r0) if abs(r1 - r0) > 1 else Rr * 0
def t_at(k):
    j = np.nonzero(u >= k)[0]
    return round(float(T[j[0]]), 3) if len(j) else None
t90 = t_at(0.9)
fin = t_at(0.98) or T[-1]
sel = T <= fin
uu = np.clip(u[sel], 0, 1.2)
res = {n: float(np.sqrt(np.mean((f_(np.linspace(0, 1, sel.sum())) - uu) ** 2))) for n, f_ in EASES.items()}
best = sorted(res.items(), key=lambda kv: kv[1])
out = {"voce": voce, "video": os.path.basename(path), "t0": t0, "roi": [x, y, w, h], "r_iniziale_px": round(float(r0), 1),
       "r_finale_px": round(float(r1), 1), "t50_s": t_at(0.5), "t90_s": t90, "t98_s": t_at(0.98), "rimbalzo_%": round(float((Rr.max() - r1) / max(1, r1 - r0) * 100), 1),
       "curva": best[0][0], "curve_vicine": {k: round(v, 3) for k, v in best[:3]}, "serie": [[round(float(a), 3), round(float(b), 1)] for a, b in zip(T, Rr)]}
os.makedirs(OUT, exist_ok=True)
json.dump(out, io.open(os.path.join(OUT, voce + "_radiale.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
W, H = 900, 300
img = np.full((H, W, 3), 28, np.uint8)
tm = max(T[-1], 0.1)
pts = [(30 + int((W - 50) * a / tm), H - 30 - int((H - 60) * min(1.3, max(-0.1, b)))) for a, b in zip(T, u)]
cv2.polylines(img, [np.array(pts, np.int32)], False, (80, 251, 207), 2, cv2.LINE_AA)
cv2.line(img, (30, H - 30 - int((H - 60) * 1.0)), (W - 20, H - 30 - int((H - 60) * 1.0)), (90, 90, 90), 1)
cv2.putText(img, f"{voce}: r {r0:.0f}->{r1:.0f}px  t50 {out['t50_s']}s t90 {t90}s  curva {best[0][0]}  rimbalzo {out['rimbalzo_%']}%", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (240, 240, 240), 1, cv2.LINE_AA)
cv2.imwrite(os.path.join(OUT, voce + "_radiale.jpg"), img)
print(json.dumps({k: v for k, v in out.items() if k != "serie"}, ensure_ascii=False))
