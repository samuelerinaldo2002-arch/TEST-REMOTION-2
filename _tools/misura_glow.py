# -*- coding: utf-8 -*-
"""Misura il bagliore (glow) attorno a testi/oggetti luminosi: profilo di luminanza in funzione della distanza.

    _tools/venv/Scripts/python.exe -I _tools/misura_glow.py <video> <t> <x0> <y0> <x1> <y1> <modo> [debug.png]

Coordinate nello spazio 1080x1920. modo: bianco | rosso | verde | blu | lime.
Stampa l'eccesso di luminanza (rispetto allo sfondo) a varie distanze dal bordo dell'oggetto, normalizzato sul nucleo,
e il fit a due gaussiane -> valori CSS equivalenti (text-shadow/box-shadow: blur = 2*sigma).
"""
import sys
import numpy as np
import cv2

video, t = sys.argv[1], float(sys.argv[2])
x0, y0, x1, y1 = (int(v) for v in sys.argv[3:7])
modo = sys.argv[7]
dbg = sys.argv[8] if len(sys.argv) > 8 else None

if video.lower().endswith((".png", ".jpg", ".jpeg")):
    fr = cv2.imread(video); ok = fr is not None
else:
    cap = cv2.VideoCapture(video)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
    ok, fr = cap.read()
if not ok:
    sys.exit("frame non letto")
H, W = fr.shape[:2]
k = W / 1080.0
crop = fr[int(y0 * k):int(y1 * k), int(x0 * k):int(x1 * k)].astype(np.float32) / 255.0
b, g, r = crop[..., 0], crop[..., 1], crop[..., 2]
Y = 0.2126 * r + 0.7152 * g + 0.0722 * b
if modo == "bianco":
    core = (Y > 0.82) & (np.abs(r - b) < 0.12)
    sig = Y
elif modo == "rosso":
    core = (r > 0.55) & (g < 0.25) & (b < 0.3)
    sig = r
elif modo == "verde":
    core = (g > 0.55) & (r < 0.45)
    sig = g
elif modo == "blu":
    core = (b > 0.6) & (r < 0.45)
    sig = b
elif modo == "lime":
    core = (g > 0.75) & (r > 0.6) & (b < 0.45)
    sig = g
else:
    sys.exit("modo?")
core = cv2.morphologyEx(core.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
if core.sum() < 30:
    sys.exit("nucleo troppo piccolo: controlla box/modo")
dist = cv2.distanceTransform((1 - core).astype(np.uint8), cv2.DIST_L2, 5) / k   # px in 1080-space
bg = float(np.median(sig[dist > 70])) if (dist > 70).sum() > 100 else float(np.percentile(sig, 5))
core_v = float(np.median(sig[core > 0]))
exc = (sig - bg) / max(1e-6, core_v - bg)
ds = np.arange(1, 71)
prof = np.array([exc[(dist >= d - 0.5) & (dist < d + 0.5)].mean() if ((dist >= d - 0.5) & (dist < d + 0.5)).sum() > 20 else np.nan for d in ds])
print(f"sorgente {W}x{H} (k={k:.2f}) · nucleo={core_v:.3f} sfondo={bg:.3f} · pixel nucleo={int(core.sum())}")
print("distanza px(1080): " + " ".join(f"{d:>5d}" for d in (2, 4, 6, 8, 12, 16, 24, 32, 48, 64)))
print("eccesso relativo : " + " ".join(f"{prof[d - 1]:5.3f}" for d in (2, 4, 6, 8, 12, 16, 24, 32, 48, 64)))
# fit a1*exp(-d^2/2s1^2)+a2*exp(-d^2/2s2^2) on d>=2 (skip antialias ring)
best = None
dd = ds[1:]; pp = prof[1:]
m = ~np.isnan(pp)
dd, pp = dd[m], pp[m]
for s1 in np.arange(1.5, 16, 0.5):
    for s2 in np.arange(8, 80, 2):
        if s2 <= s1 * 1.5:
            continue
        A = np.stack([np.exp(-dd ** 2 / (2 * s1 ** 2)), np.exp(-dd ** 2 / (2 * s2 ** 2))], 1)
        coef, *_ = np.linalg.lstsq(A, pp, rcond=None)
        if (coef < 0).any():
            continue
        err = float(np.mean((A @ coef - pp) ** 2))
        if best is None or err < best[0]:
            best = (err, s1, s2, coef)
if best:
    err, s1, s2, (a1, a2) = best
    print(f"fit: stretto sigma={s1:.1f}px a={a1:.3f} · largo sigma={s2:.1f}px a={a2:.3f} · rmse={np.sqrt(err):.4f}")
    print(f"CSS ~ 0 0 {2*s1:.0f}px rgba(colore,{min(1,a1*1.6):.2f}), 0 0 {2*s2:.0f}px rgba(colore,{min(1,a2*1.6):.2f})")
best3 = None
m4 = dd >= 4
d4, p4 = dd[m4], pp[m4]
for sm in np.arange(4, 20, 1.0):
    for sw in np.arange(20, 90, 2.0):
        A = np.stack([np.exp(-d4 ** 2 / (2 * sm ** 2)), np.exp(-d4 ** 2 / (2 * sw ** 2))], 1)
        coef, *_ = np.linalg.lstsq(A, p4, rcond=None)
        if (coef < 0).any():
            continue
        err = float(np.mean((A @ coef - p4) ** 2))
        if best3 is None or err < best3[0]:
            best3 = (err, sm, sw, coef)
if best3:
    err, sm, sw, (am, aw) = best3
    print(f"alone (d>=4): medio sigma={sm:.0f}px a={am:.3f} · largo sigma={sw:.0f}px a={aw:.3f} · rmse={np.sqrt(err):.4f}")
if dbg:
    vis = (np.clip(crop, 0, 1) * 255).astype(np.uint8).copy()
    vis[core > 0] = (0, 255, 255)
    cv2.imwrite(dbg, vis)
