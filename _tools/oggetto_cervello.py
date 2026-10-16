# -*- coding: utf-8 -*-
"""Cervello 3D "a raggi X" bianco (stile Kallaway) generato in locale, PNG con trasparenza.

    _tools/venv/Scripts/python.exe -I _tools/oggetto_cervello.py [lato=1200]
-> kw-kit/assets/obj/cervello.png (bianco) + cervello_lime.png (acceso, per il passaggio di stato)

Pieghe: reazione-diffusione Gray-Scott (motivo labirintico, come i giri cerebrali) dentro la sagoma laterale del cervello;
volume: mappa di altezza dalla distanza dal bordo + pieghe → normali → luce morbida dall'alto + luce di contorno + bagliore.
Deterministico (seme fisso).
"""
import os, sys
import numpy as np
import cv2

QUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(QUI), "kw-kit", "assets", "obj")
N = int(sys.argv[1]) if len(sys.argv) > 1 else 1200
G = 600  # simulation grid (more cells = finer folds)


def ellipse_mask(h, w, cx, cy, rx, ry, ang=0):
    m = np.zeros((h, w), np.uint8)
    cv2.ellipse(m, (int(cx * w), int(cy * h)), (int(rx * w), int(ry * h)), ang, 0, 360, 255, -1)
    return m


def sagoma(h, w):
    """sagoma laterale: lobi frontale/parietale/occipitale/temporale, cervelletto, tronco"""
    cer = ellipse_mask(h, w, 0.33, 0.42, 0.21, 0.21, 0)        # frontal
    for e in ((0.50, 0.33, 0.25, 0.20, -6), (0.68, 0.40, 0.21, 0.20, 10), (0.76, 0.50, 0.13, 0.14, 25), (0.52, 0.45, 0.30, 0.20, 0)):
        cer = cv2.bitwise_or(cer, ellipse_mask(h, w, *e))
    temp = ellipse_mask(h, w, 0.47, 0.60, 0.22, 0.10, 8)         # temporal lobe
    cer = cv2.bitwise_or(cer, temp)
    cbl = ellipse_mask(h, w, 0.70, 0.66, 0.14, 0.085, 12)        # cerebellum (under the occipital lobe)
    stem = np.zeros((h, w), np.uint8)
    pts = np.array([[0.57, 0.62], [0.64, 0.63], [0.62, 0.86], [0.585, 0.86]]) * [w, h]
    cv2.fillPoly(stem, [pts.astype(np.int32)], 255)
    cer = cv2.bitwise_and(cer, cv2.bitwise_not(cbl))
    # lateral sulcus: a groove between the temporal lobe and the rest
    sulc = np.zeros((h, w), np.uint8)
    pts = np.array([[0.30, 0.55], [0.45, 0.515], [0.62, 0.50], [0.70, 0.47]]) * [w, h]
    cv2.polylines(sulc, [pts.astype(np.int32)], False, 255, max(2, int(w * 0.012)))
    return cer, cbl, stem, sulc


def gray_scott(mask, iters=7000, seed=7):
    rng = np.random.default_rng(seed)
    h, w = mask.shape
    U = np.ones((h, w), np.float32)
    V = np.zeros((h, w), np.float32)
    for _ in range(140):
        y, x = rng.integers(10, h - 10), rng.integers(10, w - 10)
        V[y - 3:y + 3, x - 3:x + 3] = 0.5
        U[y - 3:y + 3, x - 3:x + 3] = 0.25
    Du, Dv, f, k = 1.0, 0.5, 0.0545, 0.062
    K = np.array([[0.05, 0.2, 0.05], [0.2, -1, 0.2], [0.05, 0.2, 0.05]], np.float32)
    for _ in range(iters):
        Lu = cv2.filter2D(U, -1, K, borderType=cv2.BORDER_REFLECT)
        Lv = cv2.filter2D(V, -1, K, borderType=cv2.BORDER_REFLECT)
        uvv = U * V * V
        U += Du * Lu - uvv + f * (1 - U)
        V += Dv * Lv + uvv - (f + k) * V
    return V


def main():
    os.makedirs(OUT, exist_ok=True)
    cer, cbl, stem, _ = sagoma(G, G)
    V = gray_scott(cer > 0)
    V = cv2.resize(V, (N, N), interpolation=cv2.INTER_CUBIC)
    cer, cbl, stem, sulc = sagoma(N, N)
    mcer, mcbl, mstem = cer > 0, cbl > 0, stem > 0
    # folds: normalised pattern inside the cerebrum, horizontal folia in the cerebellum
    P = np.clip((V - V[mcer].min()) / (np.percentile(V[mcer], 99) - V[mcer].min() + 1e-6), 0, 1)
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32) / N
    rr = np.sqrt((xx - 0.70) ** 2 + (yy - 0.50) ** 2)
    folia = 0.5 + 0.5 * np.sin(rr * 2 * np.pi * 34)
    fold = np.where(mcer, P, 0) + np.where(mcbl, folia * 0.8, 0)
    whole = (mcer | mcbl | mstem).astype(np.uint8) * 255
    # volume: distance from the outline (rounded), sculpted by the folds
    def dome(m):
        d = cv2.distanceTransform(m.astype(np.uint8) * 255, cv2.DIST_L2, 5)
        d = d / (d.max() + 1e-6)
        return np.sqrt(np.clip(d, 0, 1))
    H = 0.75 * dome(mcer) + 0.55 * dome(mcbl) + 0.45 * dome(mstem)
    H = H + 0.10 * cv2.GaussianBlur(fold.astype(np.float32), (0, 0), N / 420)
    H = cv2.GaussianBlur(H, (0, 0), N / 600)
    gy, gx = np.gradient(H * N * 0.09)
    nz = 1.0 / np.sqrt(gx * gx + gy * gy + 1)
    nx, ny = -gx * nz, -gy * nz
    L1 = np.array([-0.45, -0.65, 0.62]); L1 /= np.linalg.norm(L1)
    lam = np.clip(nx * L1[0] + ny * L1[1] + nz * L1[2], 0, 1)
    rim = np.clip(1 - nz, 0, 1) ** 1.6
    # fold lines: the walls of the sulci read as fine bright "wireframe" lines
    edges = cv2.GaussianBlur(fold.astype(np.float32), (0, 0), N / 900)
    ex, ey = cv2.Sobel(edges, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(edges, cv2.CV_32F, 0, 1, ksize=3)
    lines = np.sqrt(ex * ex + ey * ey)
    lines = np.clip(lines / (np.percentile(lines[whole > 0], 98) + 1e-6), 0, 1) ** 0.8
    groove = cv2.GaussianBlur(1 - fold.astype(np.float32), (0, 0), N / 700)
    groove = groove + 1.4 * cv2.GaussianBlur(sulc.astype(np.float32) / 255, (0, 0), N / 160)
    inside = whole > 0
    lum = 0.06 + 0.36 * lam + 0.80 * rim + 0.50 * lines - 0.42 * groove * (mcer | mcbl)
    lum = np.where(mstem & ~mcbl, lum * 0.7, lum)
    lum = np.where(inside, np.clip(lum, 0, 1.2), 0).astype(np.float32) ** 1.3
    # soft edge + outer bloom
    alpha_body = cv2.GaussianBlur(whole.astype(np.float32) / 255, (0, 0), N / 500)
    lum = lum * alpha_body
    bloom = cv2.GaussianBlur(lum, (0, 0), N / 40) * 0.40 + cv2.GaussianBlur(lum, (0, 0), N / 140) * 0.28
    tot = np.clip(lum + bloom, 0, 1.4)
    alpha = np.clip(tot, 0, 1)
    def save(name, tint):
        rgb = np.clip(tot[..., None] * np.array(tint, np.float32)[None, None, :] / 255.0, 0, 1)
        # premultiplied → straight colour for PNG
        a = np.maximum(alpha, 1e-4)[..., None]
        col = np.clip(rgb / a, 0, 1)
        img = np.dstack([col[..., 2], col[..., 1], col[..., 0], alpha]) * 255
        cv2.imwrite(os.path.join(OUT, name), img.astype(np.uint8))
    save("cervello.png", (236, 242, 248))
    save("cervello_lime.png", (214, 255, 96))
    print("ok", OUT)


if __name__ == "__main__":
    main()
