# -*- coding: utf-8 -*-
"""O26 · la figura di Kallaway: un manichino bianco opaco, liscio come gesso, di profilo, chino sul telefono, con l'alone
morbido e il busto che sfuma in basso (reel 18, 52, 62). Dalla foto scontornata di una persona (Adobe Stock 140421534,
"Incorrect posture concept", scontorno di Photoshop) si tiene solo la forma: niente volto, capelli, barba o tessuto.

    _tools/venv/Scripts/python.exe -I _tools/manichino.py kw-kit/sorgenti-adobe/figura_cut.png kw-kit/assets/obj/manichino.png [anteprima.jpg]

Come:
1. si toglie il "colore" dei materiali (capelli scuri, camicia azzurra, pelle): la luminanza si divide per la sua media locale
   larga dentro la sagoma (convoluzione normalizzata), così resta solo l'ombreggiatura (pieghe, orecchio, braccio);
2. il volume viene dalla sagoma: rilievo dalla distanza dal bordo → normali → luce da sinistra in alto + bordo luminoso (rim);
3. tutto si leviga con filtri che tengono i bordi (texture del tessuto, barba e ciocche spariscono);
4. il telefono (grigio chiaro nella foto) diventa una lastra grafite scura col bordo chiaro, come in Kallaway;
5. il busto sfuma in basso e attorno si cuoce un alone bianco morbido.
Stampa le frazioni del telefono e della testa (per FIG_GEO nel kit).
"""
import sys
import numpy as np, cv2

src, out = sys.argv[1], sys.argv[2]
prev = sys.argv[3] if len(sys.argv) > 3 else None

im = cv2.imread(src, cv2.IMREAD_UNCHANGED)
bgr = im[:, :, :3].astype(np.float32) / 255
a = im[:, :, 3].astype(np.float32) / 255
H0, W0 = a.shape

# telefono nella foto originale: lastra vista quasi di taglio, quadrilatero misurato sull'ingrandimento (px della foto 3211 × 2429)
PHQ = np.array([[652, 1686], [1182, 1814], [1182, 1850], [652, 1714]], np.float32)
# testa (capelli, viso, barba, orecchio): ellisse in px della foto, dove la levigatura è molto più forte
HEAD = ((1200, 700), (600, 600))

# ── ritaglio sulla sagoma ──
ys, xs = np.where(a > 0.05)
pad = 8
y0, y1, x0, x1 = max(0, ys.min() - pad), min(H0, ys.max() + 1), max(0, xs.min() - pad), min(W0, xs.max() + pad)
bgr, a = bgr[y0:y1, x0:x1], a[y0:y1, x0:x1]
PHQ -= np.array([x0, y0], np.float32)
H, W = a.shape
L = 0.114 * bgr[:, :, 0] + 0.587 * bgr[:, :, 1] + 0.299 * bgr[:, :, 2]
# bordo della testa liscio come un calco: le ciocche che escono dalla sagoma si arrotondano (solo nella zona della testa)
(hcx0, hcy0), (hrx0, hry0) = HEAD
yyA, xxA = np.mgrid[0:H, 0:W].astype(np.float32)
hmA = np.clip(1.6 - np.sqrt(((xxA + x0 - hcx0) / hrx0) ** 2 + ((yyA + y0 - hcy0) / hry0) ** 2) * 1.6, 0, 1)
a_s = cv2.GaussianBlur(a, (0, 0), H * 0.009)
a_s = np.clip((a_s - 0.5) * 6 + 0.5, 0, 1)
a_s = cv2.GaussianBlur(a_s, (0, 0), 1.2)
a = a * (1 - hmA) + a_s * hmA
hsv = cv2.cvtColor((np.clip(bgr, 0, 1) * 255).astype(np.uint8), cv2.COLOR_BGR2HSV)
sat = hsv[:, :, 1].astype(np.float32) / 255
m = (a > 0.5).astype(np.float32)

# ── telefono: dentro il quadrilatero, solo i pixel grigi e chiari (le dita che lo coprono restano dita) ──
quad = np.zeros_like(m, np.uint8)
cv2.fillConvexPoly(quad, np.round(PHQ).astype(np.int32), 1)
quad = cv2.dilate(quad, np.ones((5, 5), np.uint8), iterations=2)
ph = ((quad > 0) & (sat < 0.2) & (L > 0.38) & (m > 0)).astype(np.uint8)
ph = cv2.morphologyEx(ph, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
ph = cv2.morphologyEx(ph, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(ph, 8)
if n > 1:
    keep = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] >= 0.08 * st[1:, cv2.CC_STAT_AREA].max()]
    ph = np.isin(lab, keep).astype(np.uint8)
phf = cv2.GaussianBlur(ph.astype(np.float32), (0, 0), 2.0)

# ── 1. via il colore dei materiali: luminanza / media locale larga (convoluzione normalizzata nella sagoma) ──
def nblur(v, s):
    num = cv2.GaussianBlur(v * m, (0, 0), s)
    den = cv2.GaussianBlur(m, (0, 0), s)
    return num / np.maximum(den, 1e-4)

Lc = np.where(ph > 0, nblur(L, H * 0.01), L)  # il telefono non conta nella media
mean_big = nblur(Lc, H * 0.035)
detail = np.clip(Lc / np.maximum(mean_big, 0.03), 0.4, 1.6)
# levigatura del dettaglio: via barba, ciocche, trama del tessuto; restano pieghe, orecchio, separazione del braccio
d8 = (np.clip(detail / 1.6, 0, 1) * 255).astype(np.uint8)
d8 = cv2.bilateralFilter(d8, 0, 28, H * 0.006)
d8 = cv2.bilateralFilter(d8, 0, 22, H * 0.012)
detail = d8.astype(np.float32) / 255 * 1.6
detail = nblur(detail, H * 0.0035)
# testa: capelli, occhio e barba spariscono (dettaglio molto attenuato e levigato largo); restano naso, orecchio, nuca
(hcx, hcy), (hrx, hry) = HEAD
yy0, xx0 = np.mgrid[0:H, 0:W].astype(np.float32)
hm = np.clip(1.6 - np.sqrt(((xx0 + x0 - hcx) / hrx) ** 2 + ((yy0 + y0 - hcy) / hry) ** 2) * 1.6, 0, 1)
hm = hm * hm * (3 - 2 * hm)
det_head = nblur(1 + (detail - 1) * 0.22, H * 0.016)
# corpo: pieghe sì, trama e taschino no (dettaglio attenuato e levigato un po' più largo)
det_body = nblur(1 + (detail - 1) * 0.6, H * 0.006)
detail = det_body * (1 - hm) + det_head * hm

# ── 2. volume dalla sagoma: rilievo arrotondato → normali → luce + bordo ──
dist = cv2.distanceTransform((m > 0).astype(np.uint8), cv2.DIST_L2, 5)
R = H * 0.09
hgt = np.sqrt(np.clip(dist / R, 0, 1) * (2 - np.clip(dist / R, 0, 1)))  # profilo a quarto di cerchio
hgt = cv2.GaussianBlur(hgt, (0, 0), H * 0.004)
gy, gx = np.gradient(hgt * R)
nz = 1 / np.sqrt(1 + gx * gx + gy * gy)
nx, ny = -gx * nz, -gy * nz
lx, ly, lz = -0.55, -0.62, 0.56  # luce da sinistra in alto, davanti
ln = np.sqrt(lx * lx + ly * ly + lz * lz)
lamb = np.clip((nx * lx + ny * ly + nz * lz) / ln, 0, 1)
rim = np.clip(1 - nz, 0, 1) ** 1.6  # bordo che si illumina (la figura "splende" ai margini)
geo = 0.60 + 0.30 * lamb + 0.30 * rim

# ── 3. gesso: geometria × dettaglio, toni chiari ──
detail = np.where(detail < 1, 1 - (1 - detail) * 0.75, detail)
v = geo * detail ** 0.85
v = (v - np.percentile(v[m > 0], 1)) / max(1e-3, np.percentile(v[m > 0], 99.5) - np.percentile(v[m > 0], 1))
v = 0.44 + 0.55 * np.clip(v, 0, 1) ** 0.85
v8 = (np.clip(v, 0, 1) * 255).astype(np.uint8)
v8 = cv2.edgePreservingFilter(cv2.cvtColor(v8, cv2.COLOR_GRAY2BGR), flags=1, sigma_s=40, sigma_r=0.25)[:, :, 0]
v = v8.astype(np.float32) / 255
# grigio caldo appena accennato (gesso), quasi neutro
body = np.dstack([v * 0.985, v * 0.99, v * 1.0])

# ── 4. telefono: lastra grafite scura, bordo chiaro ──
phd = cv2.distanceTransform(ph, cv2.DIST_L2, 3)
edge = np.clip(1 - phd / 4.0, 0, 1) * ph
phone = np.dstack([np.full_like(v, 0.16)] * 3) + edge[:, :, None] * 0.45
body = body * (1 - phf[:, :, None]) + phone * phf[:, :, None]

# ── 5. sfumatura in basso + alone ──
yy = np.linspace(0, 1, H)[:, None]
fade = np.clip((1 - yy) / 0.22, 0, 1)  # ultimo 22% della figura
fade = fade * fade * (3 - 2 * fade)
af = a * fade
P = int(H * 0.09)
af = cv2.copyMakeBorder(af, P, P, P, P, cv2.BORDER_CONSTANT, value=0)
body = cv2.copyMakeBorder(body, P, P, P, P, cv2.BORDER_CONSTANT, value=0)
g1 = cv2.GaussianBlur(af, (0, 0), H * 0.012)
g2 = cv2.GaussianBlur(af, (0, 0), H * 0.045)
glow = np.clip(0.55 * g1 + 0.42 * g2, 0, 1)
oa = af + glow * (1 - af)
white = np.ones_like(body) * 0.94
rgb = (body * af[:, :, None] + white * (glow * (1 - af))[:, :, None]) / np.maximum(oa, 1e-4)[:, :, None]

# ── uscita: lato lungo 2200 px (nitido anche in 4K a ~1000 px di altezza nel fotogramma) ──
HH, WW = oa.shape
k = min(1.0, 2200 / max(HH, WW))
if k < 1:
    rgb = cv2.resize(rgb, (int(WW * k), int(HH * k)), interpolation=cv2.INTER_AREA)
    oa = cv2.resize(oa, (rgb.shape[1], rgb.shape[0]), interpolation=cv2.INTER_AREA)
o8 = np.dstack([np.clip(rgb * 255, 0, 255), np.clip(oa * 255, 0, 255)]).astype(np.uint8)
cv2.imwrite(out, o8)
Ho, Wo = oa.shape
print("manichino", Wo, "x", Ho)

# frazioni utili per il kit (nel PNG finale, alone compreso)
pys, pxs = np.where(ph > 0)
if len(pxs):
    print("telefono: x %.3f–%.3f  y %.3f–%.3f" % ((pxs.min() + P) / WW, (pxs.max() + P) / WW, (pys.min() + P) / HH, (pys.max() + P) / HH))
ys2, xs2 = np.where(m[: int(H * 0.45)] > 0)
top = ys2.min()
row = np.where(m[top + int(H * 0.12)] > 0)[0]
print("testa: cima y %.3f · centro x %.3f (a 12%% sotto la cima)" % ((top + P) / HH, ((row.min() + row.max()) / 2 + P) / WW))

if prev:
    bg = np.full((Ho, Wo, 3), 0x1E / 255, np.float32)
    comp = rgb * oa[:, :, None] + bg * (1 - oa[:, :, None])
    cv2.imwrite(prev, (np.clip(comp, 0, 1) * 255).astype(np.uint8))
