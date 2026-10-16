# -*- coding: utf-8 -*-
"""Oggetti del Blocco 5 da fonti libere (09/10 sera: il connettore Adobe non era collegato).

    _tools/venv/Scripts/python.exe -I _tools/oggetti_liberi.py <cartella con *_cut.png>

Gli scontorni (*_cut.png) vengono da _tools/scontorno (IS-Net "isnet-general-use", lo stesso modello di rembg, eseguito in locale
con cv2.dnn). Qui si portano nel brand: grafite / argento / bianco, il lime lo aggiunge il kit. Uscita in kw-kit/assets/obj/:
  razzo.png        razzo retrò (render CC0, Flickr 42741462332 via Openverse) portato a cromo argento, scala di servizio tolta
  amo.png          ancoretta doppia (Pexels 6478096) portata ad acciaio, verticale con l'occhiello in alto
  persona.png      ragazzo che guarda il telefono (Pexels 9558694) come figura in gesso bianco (la "figura 3D" di Kallaway)
  persona_colori.png  la stessa foto ai colori veri, leggermente desaturata
"""
import os, sys
import numpy as np, cv2

QUI = os.path.dirname(os.path.abspath(__file__))
OBJ = os.path.join(os.path.dirname(QUI), "kw-kit", "assets", "obj")
SRC = sys.argv[1]


def load(n):
    im = cv2.imread(os.path.join(SRC, n), cv2.IMREAD_UNCHANGED)
    return im[:, :, :3].astype(np.float32) / 255, im[:, :, 3].astype(np.float32) / 255


def crop(rgb, a, pad=12):
    ys, xs = np.where(a > 0.04)
    y0, y1, x0, x1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + pad), max(0, xs.min() - pad), min(a.shape[1], xs.max() + pad)
    return rgb[y0:y1, x0:x1], a[y0:y1, x0:x1]


def save(n, rgb, a, maxside=None):
    if maxside and max(a.shape) > maxside:
        k = maxside / max(a.shape)
        rgb = cv2.resize(rgb, (int(rgb.shape[1] * k), int(rgb.shape[0] * k)), interpolation=cv2.INTER_AREA)
        a = cv2.resize(a, (rgb.shape[1], rgb.shape[0]), interpolation=cv2.INTER_AREA)
    out = np.dstack([np.clip(rgb * 255, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
    cv2.imwrite(os.path.join(OBJ, n), out)
    print(n, out.shape[1], "x", out.shape[0])


def lum(rgb):
    return 0.114 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.299 * rgb[:, :, 2]


def metal(L, lo, hi, tint=(1.0, 1.0, 1.0), gamma=1.0):
    """luminanza → metallo neutro: lo..hi con una curva a S (contrasto da cromo)"""
    L = np.clip(L, 0, 1) ** gamma
    s = L * L * (3 - 2 * L)
    v = lo + (hi - lo) * (0.55 * s + 0.45 * L)
    return np.dstack([v * tint[0], v * tint[1], v * tint[2]])


# ── razzo: cromo argento; la scaletta di servizio sul fianco si toglie (inpainting sulla luminanza) ──
rgb, a = load("razzo_cut.png")
rgb, a = crop(rgb, a)
L = lum(rgb)
# la scala: dettaglio fine (alta frequenza) in una fascia verticale sul fianco destro del corpo: si trova come scarto tra la
# luminanza e la sua versione molto smussata, si allarga e si ricostruisce con l'inpainting
H, W = L.shape
Lm = cv2.medianBlur((np.clip(L, 0, 1) * 255).astype(np.uint8), 21).astype(np.float32) / 255
hf = np.abs(L - Lm)
band = np.zeros_like(a, np.uint8)
xs = np.where(a[int(H * 0.6)] > 0.5)[0]
cxr = (xs.min() + xs.max()) / 2 if len(xs) else W / 2
band[int(H * 0.40):int(H * 0.985), int(cxr - W * 0.02):int(cxr + W * 0.17)] = 1
lad = ((hf > 0.045) & (band > 0) & (a > 0.5)).astype(np.uint8)
hsv = cv2.cvtColor((rgb * 255).astype(np.uint8), cv2.COLOR_BGR2HSV)
sat = hsv[:, :, 1].astype(np.float32) / 255
lad |= ((sat < 0.45) & (band > 0) & (a > 0.5) & (L > 0.06)).astype(np.uint8)
lad = cv2.dilate(lad, np.ones((3, 3), np.uint8), iterations=3)
L8 = (np.clip(L, 0, 1) * 255).astype(np.uint8)
L8 = cv2.inpaint(L8, lad * 255, 9, cv2.INPAINT_TELEA)
L8 = cv2.inpaint(L8, (cv2.dilate(lad, np.ones((3, 3), np.uint8)) * 255), 9, cv2.INPAINT_NS)
L = L8.astype(np.float32) / 255
Ln = (L - np.percentile(L[a > 0.5], 2)) / max(1e-3, np.percentile(L[a > 0.5], 99.5) - np.percentile(L[a > 0.5], 2))
body = metal(Ln, 0.16, 0.97, (1.0, 1.0, 1.02), gamma=0.9)
save("razzo.png", body, a, 1400)

# ── amo: acciaio, verticale (occhiello in alto) ──
rgb, a = load("pexels_6478096_cut.png")
rgb, a = crop(rgb, a, 30)
L = lum(rgb)
Ln = (L - np.percentile(L[a > 0.5], 1)) / max(1e-3, np.percentile(L[a > 0.5], 99.7) - np.percentile(L[a > 0.5], 1))
steel = metal(Ln, 0.18, 0.98, (1.02, 1.0, 0.97), gamma=0.85)
# raddrizza: l'asse occhiello → curva è inclinato; si stima con i momenti dell'alfa
m = cv2.moments((a > 0.5).astype(np.uint8))
ang = 0.5 * np.degrees(np.arctan2(2 * m["mu11"], m["mu20"] - m["mu02"]))
rot = ang - 90 if ang > 0 else ang + 90
Hh, Ww = a.shape
diag = int(np.hypot(Hh, Ww)) + 20
M = cv2.getRotationMatrix2D((Ww / 2, Hh / 2), rot, 1.0)
M[0, 2] += (diag - Ww) / 2; M[1, 2] += (diag - Hh) / 2
steel = cv2.warpAffine(steel, M, (diag, diag), flags=cv2.INTER_CUBIC)
a2 = cv2.warpAffine(a, M, (diag, diag), flags=cv2.INTER_CUBIC)
steel, a2 = crop(steel, a2, 16)
# occhiello in alto: l'occhiello è la parte più stretta; se la massa sta in alto, si capovolge
top = a2[: a2.shape[0] // 2].sum(); bot = a2[a2.shape[0] // 2:].sum()
if top > bot: steel, a2 = steel[::-1].copy(), a2[::-1].copy()
print("amo ruotato di", round(rot, 1), "gradi")
save("amo.png", steel, a2, 1200)

# ── persona: gesso bianco (figura 3D di Kallaway) + versione ai colori veri ──
rgb, a = load("pexels_9558694_cut.png")
rgb, a = crop(rgb, a, 20)
# "argilla bianca": smussatura che tiene i bordi (via la texture di pelle, capelli e tessuto), poi solo la forma della luce
u8 = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)
sm = cv2.edgePreservingFilter(u8, flags=cv2.RECURS_FILTER, sigma_s=80, sigma_r=0.35)
sm = cv2.edgePreservingFilter(sm, flags=cv2.RECURS_FILTER, sigma_s=40, sigma_r=0.25)
Ls = lum(sm.astype(np.float32) / 255)
Ls = cv2.GaussianBlur(Ls, (0, 0), 2.2)
Ln = (Ls - np.percentile(Ls[a > 0.5], 1)) / max(1e-3, np.percentile(Ls[a > 0.5], 99.5) - np.percentile(Ls[a > 0.5], 1))
plaster = metal(np.clip(Ln, 0, 1) ** 0.8, 0.40, 0.98, (0.975, 0.985, 1.0), gamma=0.9)
# il bordo dell'alfa più netto (niente alone della foto)
a = np.clip((a - 0.12) / 0.76, 0, 1)
save("persona.png", plaster, a, 1600)
hsv = cv2.cvtColor((rgb * 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
hsv[:, :, 1] *= 0.82
col = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32) / 255
save("persona_colori.png", col, a, 1600)
