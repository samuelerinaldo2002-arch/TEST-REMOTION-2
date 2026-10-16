# -*- coding: utf-8 -*-
"""Misure UNA volta per voce del blocco C2 (reel 5), copia contro Kallaway agli stessi istanti (la copia sta 1:1 sul suo tempo).

    _tools/venv/bin/python -I misure_c2.py   → copia-02/_lavoro/misure.json (+ stampa)

L01 · lista: alto e altezza della prima barra (accento rosso di Kallaway / lime della copia) ai suoi istanti.
L02 · barra attiva: x dell'accento della voce 01 (si allarga: l'accento va a sinistra).
K14 · la voce che sale a intestazione: alto della barra fotogramma per fotogramma 12,9–14,6 s.
F03 · banda di luce sulla voce 02 (34,2–35,0 s): colonna più luminosa rispetto al fotogramma di 34,2 s.
T08 · uscita del titolo: luminanza media della zona del titolo 35,3–35,95 s (in % di quella a 35,3 s).
O21 · anelli: numero di persone e raggio medio dal centro a 17,4 e 18,4 s.
O28 · pillole: larghezza della torre e passo a 96,7 s.
X01 · card del video: rettangolo del bordo acceso a 120,5 s.
K01 · stacchi sulla faccia: istante del taglio (differenza fra fotogrammi) attorno a 3,417 e 8,917 s.
"""
import io, json, math, os, sys
import numpy as np, cv2

QUI = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
KV = os.path.join(PROJ, "03_2026-10-04_DeFA_f1uwLt.mp4")
CV = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "_analisi", "render", "copia-02_bozza.mp4")
OUT = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "copia-02", "_lavoro", "misure.json")


class V:
    def __init__(s, p):
        s.cap = cv2.VideoCapture(p); s.fps = s.cap.get(cv2.CAP_PROP_FPS)
    def f(s, t):
        s.cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, math.ceil(t * s.fps - 0.02))); ok, fr = s.cap.read()
        return cv2.resize(fr, (1080, 1920), interpolation=cv2.INTER_AREA) if ok else None


K, C = V(KV), V(CV)


def accento(fr, lime):
    B, G, R = [fr[:1340, :, k].astype(int) for k in range(3)]
    m = ((G > 170) & (R > 130) & (B < 0.6 * G)) if lime else ((R > 120) & (R > 2.2 * G) & (R > 2.2 * B))
    col = m[:, :330].sum(axis=1) > 6
    ys = np.where(col)[0]; segs = []
    if len(ys):
        s = p = ys[0]
        for y in ys[1:]:
            if y - p > 3: segs.append((s, p)); s = y
            p = y
        segs.append((s, p))
    out = []
    for s, e in segs:
        if e - s < 25 or s < 300: continue      # niente riquadro del titolo
        xs = np.where(m[s:e + 1, :330].any(axis=0))[0]
        out.append((int(s), int(e), int(xs[0])))
    return out


R = {}
def put(voce, nome, k, c):
    R.setdefault(voce, {})[nome] = {"kallaway": k, "copia": c}
    print(f"{voce:4s} {nome:34s} K {k}  |  C {c}")


# L01 · L02 · K14
for t in [8.92, 9.25, 9.5, 10.0, 10.33, 12.0, 13.0]:
    a, b = accento(K.f(t), False), accento(C.f(t), True)
    put("L01", f"prima barra a {t} s (alto-basso, x)", a[0] if a else None, b[0] if b else None)
for t in [10.9, 11.2, 11.6, 12.4]:
    a, b = accento(K.f(t), False), accento(C.f(t), True)
    put("L02", f"accento della 01 a {t} s (x)", a[0][2] if a else None, b[0][2] if b else None)
for t in [13.25, 13.5, 13.67, 13.83, 14.0, 14.17, 14.6]:
    a, b = accento(K.f(t), False), accento(C.f(t), True)
    put("K14", f"alto della voce a {t} s", a[0][0] if a else None, b[0][0] if b else None)


# F03 · banda sulla voce 02 (riga y della voce 02 a 34,2 s)
def banda(v, lime):
    ref = v.f(34.2); acc = accento(ref, lime)
    if len(acc) < 2: return None
    y0, y1, _ = acc[1]
    g0 = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY)[y0:y1, :].astype(float)
    res = []
    for t in np.arange(34.25, 35.01, 0.083):
        g = cv2.cvtColor(v.f(t), cv2.COLOR_BGR2GRAY)[y0:y1, :].astype(float)
        d = np.clip(g - g0, 0, None).mean(axis=0)
        d = np.convolve(d, np.ones(15) / 15, mode="same")
        res.append((round(float(t), 2), int(np.argmax(d)) if d.max() > 6 else None))
    return res
put("F03", "colonna della banda nel tempo", banda(K, False), banda(C, True))


# T08 · titolo (zona y 170–350)
def titolo(v):
    vals = []
    for t in np.arange(35.3, 35.96, 0.083):
        g = cv2.cvtColor(v.f(t), cv2.COLOR_BGR2GRAY)[170:350, 150:950].astype(float)
        vals.append(float(np.percentile(g, 99)))
    b = vals[0] or 1
    return [round(100 * x / b) for x in vals]
put("T08", "titolo (% del p99) 35,3 → 35,96 s ogni 0,083", titolo(K), titolo(C))


# O21 · persone attorno al reel
def persone(fr, lime_o_rosso):
    hsv = cv2.cvtColor(fr[:1340], cv2.COLOR_BGR2HSV); g = cv2.cvtColor(fr[:1340], cv2.COLOR_BGR2GRAY)
    m = (g > 170) if lime_o_rosso == "bianco" else ((hsv[..., 1] > 120) & (hsv[..., 2] > 120))
    n, lab, st, cen = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    pts = [cen[i] for i in range(1, n) if 200 < st[i, 4] < 2500 and 0.6 < st[i, 2] / max(1, st[i, 3]) < 1.6]
    pts = [p for p in pts if not (380 < p[0] < 700 and 560 < p[1] < 1120)]   # fuori dal reel
    if not pts: return None
    P = np.array(pts); c = np.array([540, 841]); r = np.hypot(*(P - c).T)
    return {"n": len(P), "raggio_medio": int(np.median(r)), "raggio_max": int(r.max())}
put("O21", "persone a 17,4 s", persone(K.f(17.4), "bianco"), persone(C.f(17.4), "bianco"))
put("O21", "persone a 18,4 s (colorate)", persone(K.f(18.4), "colore"), persone(C.f(18.4), "colore"))


# O28 · torre di pillole a 96,7 s (rosse / lime)
def torre(fr, lime):
    B, G, Rr = [fr[:1340, :, k].astype(int) for k in range(3)]
    m = ((G > 170) & (Rr > 130) & (B < 0.6 * G)) if lime else ((Rr > 120) & (Rr > 2.2 * G) & (Rr > 2.2 * B))
    m[:330] = False
    rows = np.where(m.sum(axis=1) > 150)[0]
    if not len(rows): return None
    segs = []; s = p = rows[0]
    for y in rows[1:]:
        if y - p > 4: segs.append((s, p)); s = y
        p = y
    segs.append((s, p))
    out = []
    for a, b in segs:
        xs = np.where(m[a:b + 1].sum(axis=0) > 2)[0]
        out.append((int(a), int(b), int(xs[0]), int(xs[-1])))
    return out
put("O28", "pillole a 96,7 s (y0, y1, x0, x1)", torre(K.f(96.7), False), torre(C.f(96.7), True))
put("O28", "pillole a 95,05 s", torre(K.f(95.05), False), torre(C.f(95.05), True))


# X01 · card a 120,5 s (bordo acceso)
def card(fr, lime):
    B, G, Rr = [fr[:1340, :, k].astype(int) for k in range(3)]
    m = ((G > 170) & (Rr > 130) & (B < 0.6 * G)) if lime else ((Rr > 150) & (Rr > 2.2 * G) & (Rr > 2.2 * B))
    m[:420] = False
    ys, xs = np.nonzero(m)
    if not len(xs): return None
    return [int(np.percentile(xs, 1)), int(np.percentile(ys, 1)), int(np.percentile(xs, 99)), int(np.percentile(ys, 99))]
put("X01", "card a 120,5 s (x0, y0, x1, y1)", card(K.f(120.5), False), card(C.f(120.5), True))


# K01 · stacchi
def taglio(v, t):
    best = None; prev = None
    i0, i1 = int((t - 0.2) * v.fps), int((t + 0.2) * v.fps)
    v.cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
    for i in range(i0, i1 + 1):
        ok, fr = v.cap.read()
        if not ok: break
        g = cv2.resize(cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY), (90, 160)).astype(float)
        if prev is not None:
            d = np.abs(g - prev).mean()
            if best is None or d > best[1]: best = (round(i / v.fps, 3), round(float(d), 1))
        prev = g
    return best
for t in [3.417, 8.917, 18.542, 117.708]:
    put("K01", f"taglio attorno a {t} s (istante, salto)", taglio(K, t), taglio(C, t))

json.dump(R, io.open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(OUT)
