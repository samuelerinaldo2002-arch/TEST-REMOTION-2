# -*- coding: utf-8 -*-
"""Oggetti-metafora da Adobe Stock (collezione gratuita, licenza standard) + scontorno di Photoshop → assets del kit.
Ricette riproducibili: ognuna parte dallo scontorno PNG che restituisce image_remove_background. Originali con licenza,
scontorni e licenze: kw-kit/sorgenti-adobe/ (FONTI.md).

    _tools/venv/Scripts/python.exe -I _tools/oggetti_adobe.py kw-kit/sorgenti-adobe [slot|fotocamera|faro|tutti] [anteprima.jpg]

Scontorni attesi nella cartella:
    slot_cut.png    AdobeStock_730774093  slot machine vintage (immagine generata con IA: testi finti da ripulire)
    camera_cut.png  AdobeStock_285265822  mirrorless argento, obiettivo verso chi guarda
    luce_cut.png    AdobeStock_329591900  flash da studio con alette (barn doors)
Escono in kw-kit/assets/obj/. La geometria (frazioni 0–1 dell'immagine finale) è stampata a schermo ed è la stessa
scritta come costanti in slotMachine(), fotocamera() e faro() di kit2-oggetti.js: se si rifà un asset, aggiornarle.
"""
import os, sys
import numpy as np, cv2

QUI = os.path.dirname(os.path.abspath(__file__))
OBJ = os.path.join(os.path.dirname(QUI), "kw-kit", "assets", "obj")
SRC = sys.argv[1]
COSA = sys.argv[2] if len(sys.argv) > 2 else "tutti"
PREVIEW = sys.argv[3] if len(sys.argv) > 3 else None
LIME = np.array([80, 251, 207], np.float32) / 255.0     # BGR di #CFFB50
HI = np.array([214, 255, 244], np.float32) / 255.0      # BGR di #f4ffd6
anteprime = []


def carica(nome):
    im = cv2.imread(os.path.join(SRC, nome), cv2.IMREAD_UNCHANGED)
    return im[:, :, :3].copy(), im[:, :, 3].astype(np.float32) / 255.0


def luma(bgr):
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32) / 255.0


def ritaglia(bgr, a, margine=0.02):
    ys, xs = np.where(a > 0.05)
    m = int(margine * max(xs.max() - xs.min(), ys.max() - ys.min()))
    x0, y0 = max(0, xs.min() - m), max(0, ys.min() - m)
    x1, y1 = min(a.shape[1], xs.max() + m + 1), min(a.shape[0], ys.max() + m + 1)
    return (x0, y0, x1, y1)


def salva(nome, col01, a, larghezza, box):
    x0, y0, x1, y1 = box
    col, al = col01[y0:y1, x0:x1], a[y0:y1, x0:x1]
    s = larghezza / col.shape[1]
    size = (larghezza, int(round(col.shape[0] * s)))
    col = cv2.resize(col, size, interpolation=cv2.INTER_AREA)
    al = cv2.resize(al, size, interpolation=cv2.INTER_AREA)
    out = np.dstack([np.clip(col * 255, 0, 255), np.clip(al * 255, 0, 255)]).astype(np.uint8)
    p = os.path.join(OBJ, nome + ".png")
    cv2.imwrite(p, out, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    print(p, out.shape[1], "x", out.shape[0], f"{os.path.getsize(p) / 1e6:.1f} MB")
    anteprime.append(out)
    return out


def frazioni(box, **punti):
    """punti in coordinate sorgente → frazioni dell'immagine ritagliata (x su larghezza, y su altezza)"""
    x0, y0, x1, y1 = box
    W, H = x1 - x0, y1 - y0
    res = {}
    for k, v in punti.items():
        if len(v) == 4:   # rettangolo
            res[k] = [round((v[0] - x0) / W, 4), round((v[1] - y0) / H, 4), round((v[2] - x0) / W, 4), round((v[3] - y0) / H, 4)]
        elif len(v) == 3:  # cerchio (cx, cy, r su larghezza)
            res[k] = [round((v[0] - x0) / W, 4), round((v[1] - y0) / H, 4), round(v[2] / W, 4)]
        else:
            res[k] = [round((v[0] - x0) / W, 4), round((v[1] - y0) / H, 4)]
    res["ratio"] = round(W / H, 4)
    return res


def liscia(bgr, rects, margine=14, sigma=22):
    """interno dei riquadri (pannellini con testi finti) → superficie liscia, il bordo resta"""
    out = bgr.copy()
    for x0, y0, x1, y1 in rects:
        x0, y0, x1, y1 = x0 + margine, y0 + margine, x1 - margine, y1 - margine
        roi = out[y0:y1, x0:x1].astype(np.float32)
        b = cv2.GaussianBlur(roi, (0, 0), sigma)
        b = cv2.GaussianBlur(b, (0, 0), sigma)
        # bordo morbido: niente scalino tra zona lisciata e originale
        mk = np.zeros(roi.shape[:2], np.float32)
        e = max(4, min(roi.shape[0], roi.shape[1]) // 8)
        mk[e:-e, e:-e] = 1
        mk = cv2.GaussianBlur(mk, (0, 0), e / 2)[..., None]
        out[y0:y1, x0:x1] = np.clip(b * mk + roi * (1 - mk), 0, 255).astype(np.uint8)
    return out


def riempi(bgr, rects, margine=10, vignetta=0.1):
    """pannello con testo fitto → ogni riga diventa il suo colore mediano (il testo è minoranza in ogni riga),
    con una leggera vignettatura ai lati; bordo morbido"""
    out = bgr.copy()
    for x0, y0, x1, y1 in rects:
        x0, y0, x1, y1 = x0 + margine, y0 + margine, x1 - margine, y1 - margine
        roi = out[y0:y1, x0:x1].astype(np.float32)
        row = np.median(roi, axis=1, keepdims=True)
        row = cv2.GaussianBlur(row, (1, 0), sigmaX=1, sigmaY=3) if row.shape[0] > 6 else row
        u = np.linspace(-1, 1, roi.shape[1], dtype=np.float32)[None, :, None]
        fill = row * (1 - vignetta * u ** 4)
        fill = np.broadcast_to(fill, roi.shape)
        mk = np.zeros(roi.shape[:2], np.float32)
        e = max(3, min(roi.shape[0], roi.shape[1]) // 10)
        mk[e:-e, e:-e] = 1
        mk = cv2.GaussianBlur(mk, (0, 0), e / 2)[..., None]
        out[y0:y1, x0:x1] = np.clip(fill * mk + roi * (1 - mk), 0, 255).astype(np.uint8)
    return out


def ripara(bgr, rects, r=9):
    """testo su fascia uniforme → inpainting (Telea) dell'intero riquadro"""
    mask = np.zeros(bgr.shape[:2], np.uint8)
    for x0, y0, x1, y1 in rects:
        mask[y0:y1, x0:x1] = 255
    return cv2.inpaint(bgr, mask, r, cv2.INPAINT_TELEA)


# ═══ slot machine (O14) ═══════════════════════════════════════════════════════════════════
def slot():
    bgr, a = carica("slot_cut.png")
    a[4550:, 3500:] = 0                                   # riflesso a terra sotto la leva
    # testi inventati dall'IA → superfici pulite
    bgr = ripara(bgr, [(1030, 1058, 2730, 1148),          # fascia alta "ODBIN I DE …"
                       (1515, 2990, 1945, 3105)])         # "M SALE"
    bgr = liscia(bgr, [(909, 2632, 1102, 2722), (1243, 2632, 1430, 2722), (1533, 2632, 1719, 2722), (1815, 2632, 1995, 2722), (2105, 2632, 2297, 2722),
                       (928, 2812, 1083, 2915), (1224, 2812, 1378, 2915), (1462, 2812, 1616, 2915), (1700, 2812, 1848, 2915), (1937, 2812, 2085, 2915), (2169, 2812, 2310, 2915)],
                 margine=12, sigma=10)                    # etichette dei bottoni
    bgr = riempi(bgr, [(1906, 3596, 2321, 3768), (2393, 3596, 2808, 3768), (1906, 3802, 2321, 3984), (2393, 3802, 2808, 3984),
                       (2000, 4020, 2780, 4135)], margine=8)                                          # pannellini bassi e targa
    # finestre dei rulli: le copre il kit (rulli veri); sotto resta scuro, mai i 7 dell'originale
    REELS = [(1159, 1177, 1534, 2447), (1701, 1177, 2083, 2447), (2244, 1177, 2625, 2447)]
    # leva (pomo + asta) tolta: il kit la ridisegna e la tira
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    leva = ((xx > 3262) & (yy < 3795)) | (((xx - 3420) ** 2 + (yy - 2205) ** 2) < 186 ** 2) & (xx > 3246)
    a = np.where(leva, 0, a)

    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    h, s = hsv[..., 0].astype(np.float32), hsv[..., 1].astype(np.float32) / 255.0
    L = luma(bgr)
    red = cv2.GaussianBlur((((h < 10) | (h > 170)) & (s > 0.42)).astype(np.float32), (0, 0), 3)
    teal = cv2.GaussianBlur(((h > 80) & (h < 112) & (s > 0.25)).astype(np.float32), (0, 0), 3)
    # grafite: corpo rosso → lacca nera (riflessi tenuti), pannelli azzurri → acciaio scuro, cromature invariate
    g = 0.06 + 0.9 * np.power(L, 1.25)
    g = g * (1 - red) + (0.035 + 0.95 * np.power(L, 1.9)) * red
    g = g * (1 - teal) + (0.07 + 0.62 * np.power(L, 1.35)) * teal
    col = np.dstack([g * 1.03, g * 1.0, g * 0.97])
    # pannelli luminosi (erano ambra con testi finti) → vetro scuro liscio: le luci lime le accende il kit (slotMachine)
    LUCI = [(925, 3232, 1530, 3422), (1710, 3232, 2252, 3422)]
    for x0, y0, x1, y1 in LUCI:
        v = np.linspace(-1, 1, y1 - y0, dtype=np.float32)[:, None]
        u = np.linspace(-1, 1, x1 - x0, dtype=np.float32)[None, :]
        gl = 0.085 + 0.05 * (1 - v ** 2) - 0.03 * u ** 4
        gl = gl + 0.12 * np.exp(-((v + 0.78) / 0.07) ** 2)           # filo di luce in alto (vetro)
        col[y0:y1, x0:x1] = np.dstack([gl * 1.03, gl, gl * 0.97])
    for x0, y0, x1, y1 in REELS:
        col[y0:y1, x0:x1] = 0.07
    # luce dall'alto: piena fino ai rulli, poi la parte bassa scende nel buio
    fall = np.clip(1 - (np.arange(a.shape[0], dtype=np.float32) - 2700) / (4835 - 2700), 0, 1)
    fall = 0.5 + 0.5 * fall ** 1.3
    col = col * fall[:, None, None]
    box = ritaglia(bgr, a)
    salva("slot", np.clip(col, 0, 1), a, 1300, box)
    print("slot", frazioni(box, r1=REELS[0], r2=REELS[1], r3=REELS[2], pomo=(3420, 2205, 180), perno=(3392, 3790), asta=(3392, 2380), l1=LUCI[0], l2=LUCI[1], cupola=(1853, 560, 430)))


# ═══ fotocamera ═══════════════════════════════════════════════════════════════════════════
def fotocamera():
    bgr, a = carica("camera_cut.png")
    col = bgr.astype(np.float32) / 255.0
    # colori veri (argento e similpelle nera sono già nel brand); appena più contrasto, niente dominante verde
    L = luma(bgr)[..., None]
    col = np.clip(L + (col - L) * 0.55, 0, 1)
    col = np.clip((col - 0.5) * 1.06 + 0.5, 0, 1)
    # vetro frontale: centro del cerchio scuro dentro la ghiera
    dark = (luma(bgr) < 0.16).astype(np.uint8)
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    dark &= (((xx - 1760) ** 2 + (yy - 2075) ** 2) < 520 ** 2).astype(np.uint8)
    n, lab, st, cen = cv2.connectedComponentsWithStats(dark)
    i = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    gx, gy = cen[i]
    gr = float(np.sqrt(st[i, cv2.CC_STAT_AREA] / np.pi))
    box = ritaglia(bgr, a)
    salva("fotocamera", col, a, 1800, box)
    print("fotocamera", frazioni(box, vetro=(gx, gy, gr), ghiera=(1711, 2074, 712), rec=(3607, 1062)))   # rec = lampadina AF in alto a destra


# ═══ faro da studio ═══════════════════════════════════════════════════════════════════════
def faro():
    bgr, a = carica("luce_cut.png")
    H = a.shape[0]
    # lo stativo esce dal bordo della foto: sfuma negli ultimi 9% invece di finire tagliato
    fade = np.clip((H - 1 - np.arange(H, dtype=np.float32)) / (0.09 * H), 0, 1) ** 1.5
    a = a * fade[:, None]
    col = bgr.astype(np.float32) / 255.0
    L = luma(bgr)
    Lc = L[..., None]
    col = np.clip(Lc + (col - Lc) * 0.4, 0, 1)            # metallo neutro, niente dominanti
    # parabola: componente chiara e poco satura dentro l'ellisse delle alette
    s = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)[..., 1].astype(np.float32) / 255.0
    ell = np.zeros(L.shape, np.uint8)
    cv2.ellipse(ell, (3778, 2748), (760, 930), -18, 0, 360, 1, -1)
    bowl = ((L > 0.42) & (s < 0.22) & (ell > 0)).astype(np.uint8)
    bowl = cv2.morphologyEx(bowl, cv2.MORPH_CLOSE, np.ones((41, 41), np.uint8))
    n, lab, st, cen = cv2.connectedComponentsWithStats(bowl)
    i = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    bowl = (lab == i).astype(np.float32)
    bx, by = cen[i]
    pts = cv2.findNonZero((lab == i).astype(np.uint8))
    (ex, ey), (ew, eh), ang = cv2.fitEllipse(pts)
    box = ritaglia(bgr, a)
    salva("faro", col, a, 1600, box)
    # acceso: la parabola diventa bianca incandescente, il riflesso resta leggibile
    m = cv2.GaussianBlur(bowl, (0, 0), 18)[..., None]
    hot = np.clip(0.80 + 0.2 * Lc, 0, 1) * np.array([0.97, 1.0, 0.985], np.float32)
    on = col * (1 - m) + hot * m
    glow = cv2.GaussianBlur(bowl, (0, 0), 90)[..., None]
    on = np.clip(on + glow * 0.22 * (1 - m), 0, 1)
    salva("faro_on", on, a, 1600, box)
    print("faro", frazioni(box, parabola=(ex, ey, max(ew, eh) / 2), centro=(bx, by)), "ellisse", round(ew), round(eh), round(ang, 1))


for nome, f in [("slot", slot), ("fotocamera", fotocamera), ("faro", faro)]:
    if COSA in (nome, "tutti"):
        f()

if PREVIEW and anteprime:
    tiles = []
    for im in anteprime:
        al = im[:, :, 3:4].astype(np.float32) / 255.0
        c = (im[:, :, :3].astype(np.float32) * al + 30 * (1 - al)).astype(np.uint8)
        hh = 900
        tiles.append(cv2.resize(c, (int(c.shape[1] * hh / c.shape[0]), hh), interpolation=cv2.INTER_AREA))
    cv2.imwrite(PREVIEW, np.hstack(tiles), [cv2.IMWRITE_JPEG_QUALITY, 90])
