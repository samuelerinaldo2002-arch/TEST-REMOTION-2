# -*- coding: utf-8 -*-
"""Pulse a disco pieno (F02): raggio e copertura del disco del colore d'accento, fotogramma per fotogramma.

    _tools/venv/Scripts/python.exe -I disco.py <video> <t0> <t1> <roi x,y,w,h (1080x1920)> <rosso|lime> <voce> [cx,cy]

Per ogni fotogramma: maschera del colore d'accento nella roi (rosso: r>90, r-g>45, r-b>35; lime: g>150, r>120, g-b>60) →
raggio = metà della larghezza della maschera fra i percentili 2 e 98 (regge se un oggetto davanti copre il centro del disco),
pixel accesi. Uscite: istante in cui il disco compare, tempo al raggio massimo, raggio massimo (frazione della larghezza 1080),
quando sparisce (pixel < 10% del massimo), curva della crescita. _analisi/ritmo/blocco02/<voce>_disco.json + .jpg
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(QUI, "..", "blocco02"))
path, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
x, y, w, h = [int(float(v)) for v in sys.argv[4].split(",")]
modo, voce = sys.argv[5], sys.argv[6]
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * fps)))
T, R, N, fr = [], [], [], []
for i in range(int(round((t1 - t0) * fps)) + 1):
    ok, f = cap.read()
    if not ok:
        break
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))))
    c = f[y:y + h, x:x + w]
    b, g, r = [k.astype(np.int32) for k in cv2.split(c)]
    m = ((r > 90) & (r - g > 45) & (r - b > 35)) if modo == "rosso" else ((g > 150) & (r > 120) & (g - b > 60))
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
    ys, xs = np.nonzero(m)
    n = int(m.sum())
    rr = float((np.percentile(xs, 98) - np.percentile(xs, 2)) / 2) if n > 200 else 0.0
    T.append(t0 + i / fps); R.append(rr); N.append(n)
    if i % 2 == 0 and len(fr) < 12:
        fr.append(cv2.resize(c, (int(w * 160 / h), 160)))
T, R, N = np.array(T), np.array(R), np.array(N, float)
nm = N.max() if len(N) else 0
on = np.nonzero(N > 0.1 * nm)[0]
res = {"voce": voce, "video": os.path.basename(path), "roi": [x, y, w, h], "modo": modo}
if len(on):
    i0, i1 = on[0], on[-1]
    ip = int(np.argmax(R))
    res.update({"compare_s": round(float(T[i0]), 3), "raggio_max_px": round(float(R[ip]), 0), "raggio_max_frazione_larghezza": round(float(R[ip] * 2 / 1080), 3),
                "t_raggio_max_s": round(float(T[ip]), 3), "da_compare_a_max_s": round(float(T[ip] - T[i0]), 3), "sparisce_s": round(float(T[i1]), 3),
                "durata_s": round(float(T[i1] - T[i0]), 3), "pixel_max": int(nm), "t_pixel_max_s": round(float(T[int(np.argmax(N))]), 3)})
res["serie"] = [[round(float(a), 3), round(float(b), 1), int(c)] for a, b, c in zip(T, R, N)]
os.makedirs(OUT, exist_ok=True)
json.dump(res, io.open(os.path.join(OUT, voce + "_disco.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
if fr:
    cv2.imwrite(os.path.join(OUT, voce + "_disco.jpg"), np.hstack(fr))
print(json.dumps({k: v for k, v in res.items() if k != "serie"}, ensure_ascii=False))
