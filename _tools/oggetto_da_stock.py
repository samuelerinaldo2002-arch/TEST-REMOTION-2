# -*- coding: utf-8 -*-
"""Da un'immagine Adobe Stock scontornata con Photoshop (PNG con trasparenza) alle due versioni del kit:
bianca neutra (stato normale) e lime luminosa (stato acceso). La trasparenza dello scontorno resta (effetto vetro).

    _tools/venv/Scripts/python.exe -I _tools/oggetto_da_stock.py <scontorno.png> <nome> [larghezza=1800]
    → kw-kit/assets/obj/<nome>.png e <nome>_lime.png

Regola di colore del brand: il lime trasparente sul nero diventa oliva, quindi la versione accesa è schiarita
verso il bianco nelle parti luminose e l'opacità viene alzata.
"""
import os, sys
import numpy as np, cv2

QUI = os.path.dirname(os.path.abspath(__file__))
OBJ = os.path.join(os.path.dirname(QUI), "kw-kit", "assets", "obj")
src, nome = sys.argv[1], sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1800

im = cv2.imread(src, cv2.IMREAD_UNCHANGED)
rgb, a = im[:, :, :3].astype(np.float32) / 255.0, im[:, :, 3].astype(np.float32) / 255.0
ys, xs = np.where(a > 0.05)
m = int(0.04 * max(xs.max() - xs.min(), ys.max() - ys.min()))
x0, y0, x1, y1 = max(0, xs.min() - m), max(0, ys.min() - m), min(im.shape[1], xs.max() + m), min(im.shape[0], ys.max() + m)
rgb, a = rgb[y0:y1, x0:x1], a[y0:y1, x0:x1]
s = W / rgb.shape[1]
rgb = cv2.resize(rgb, (W, int(rgb.shape[0] * s)), interpolation=cv2.INTER_AREA)
a = cv2.resize(a, (W, int(a.shape[0] * s)), interpolation=cv2.INTER_AREA)
L = cv2.cvtColor(rgb, cv2.COLOR_BGR2GRAY)
Ln = np.clip((L - np.percentile(L[a > 0.2], 5)) / (np.percentile(L[a > 0.2], 99.5) - np.percentile(L[a > 0.2], 5) + 1e-6), 0, 1)


def save(path, col, alpha):
    out = np.dstack([np.clip(col * 255, 0, 255), np.clip(alpha * 255, 0, 255)]).astype(np.uint8)
    cv2.imwrite(path, out)
    print(path, out.shape)


# bianca neutra, appena fredda: luminosità dell'originale, niente blu
white = np.dstack([0.84 + 0.16 * Ln, 0.86 + 0.14 * Ln, 0.88 + 0.12 * Ln])  # BGR
save(os.path.join(OBJ, nome + ".png"), white, np.clip(a * 1.08, 0, 1))
# lime accesa: lime pieno nei toni medi, verso il bianco nei fili più luminosi; più opaca
lime = np.array([80, 251, 207], np.float32) / 255.0      # BGR di #CFFB50
hi = np.array([214, 255, 244], np.float32) / 255.0       # BGR di #f4ffd6
k = (Ln ** 1.6)[..., None]
col = lime * (0.82 + 0.18 * Ln[..., None]) * (1 - k) + hi * k
save(os.path.join(OBJ, nome + "_lime.png"), col, np.clip(a * (1.45 + 0.1 * Ln), 0, 1))
