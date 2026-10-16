# -*- coding: utf-8 -*-
"""Camera di un tratto senza tagli, fotogramma per fotogramma (blocco C1, copia del reel 79).

    _tools/venv/Scripts/python.exe -I camtrack.py <video> <t0> <t1> [--roi x0,y0,x1,y1] [--escludi x,y,w,h;…] [--ref x,y]

Per ogni coppia di fotogrammi consecutivi: similitudine (scala + spostamento) stimata con SIFT + RANSAC dentro la roi (default
la zona grafica y 330–1290 nelle coordinate 1080x1920), scartando i modelli fermi (titolo nell'HUD). Le stime si accumulano:
si ottiene dove va a finire sullo schermo il punto di riferimento --ref (default 540,880) del primo fotogramma e la scala
cumulata. Serve per copiare pan, zoom e arrivi (inizio, durata, curva, picco di velocità). Coordinate e px nello spazio 1080x1920.
"""
import argparse, sys, io
import numpy as np, cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("t0", type=float); ap.add_argument("t1", type=float)
ap.add_argument("--roi", default="0,330,1080,1290")
ap.add_argument("--escludi", default="")
ap.add_argument("--ref", default="540,880")
ap.add_argument("--tutto", action="store_true", help="non scartare i modelli fermi")
a = ap.parse_args()
R = [int(v) for v in a.roi.split(",")]
ref = np.array([float(v) for v in a.ref.split(",")] + [1.0])
cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
i0, i1 = int(round(a.t0 * fps)), int(round(a.t1 * fps))
cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
m = np.zeros((1920, 1080), np.uint8)
m[R[1]:R[3], R[0]:R[2]] = 255
for r in [r for r in a.escludi.split(";") if r.strip()]:
    x, y, w, h = [int(float(v)) for v in r.split(",")]
    m[y:y + h, x:x + w] = 0
SIFT = cv2.SIFT_create(nfeatures=4000, contrastThreshold=0.015)
BF = cv2.BFMatcher(cv2.NORM_L2)


def lf():
    ok, f = cap.read()
    if not ok:
        return None
    if f.shape[1] != 1080:
        f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))), interpolation=cv2.INTER_CUBIC)
    return cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)


def ident(A):
    return abs(np.hypot(A[0, 0], A[1, 0]) - 1) < 0.002 and abs(A[0, 2]) < 1.2 and abs(A[1, 2]) < 1.2


g0 = lf()
kp0, d0 = SIFT.detectAndCompute(g0, m[:g0.shape[0]])
C = np.eye(3)  # trasformazione cumulata F0 -> Fi
prev = None
print(f"# fps {fps:.3f} · ref {ref[:2]} · roi {R}")
print("   t      s      x      y     dx     dy   vpx/s  inl")
p0 = ref[:2].copy()
print(f"{i0 / fps:7.3f} 1.0000 {p0[0]:6.1f} {p0[1]:6.1f}   0.0    0.0      0")
for i in range(i0 + 1, i1 + 1):
    g1 = lf()
    if g1 is None:
        break
    kp1, d1 = SIFT.detectAndCompute(g1, m[:g1.shape[0]])
    A = None; n = 0
    if d0 is not None and d1 is not None and len(kp0) > 10 and len(kp1) > 10:
        mm = BF.knnMatch(d0, d1, k=2)
        good = [x for x, y in (p for p in mm if len(p) == 2) if x.distance < 0.75 * y.distance]
        P0 = np.float32([kp0[x.queryIdx].pt for x in good]); P1 = np.float32([kp1[x.trainIdx].pt for x in good])
        cands = []
        while len(P0) >= 8 and len(cands) < 3:
            B, inl = cv2.estimateAffinePartial2D(P0, P1, method=cv2.RANSAC, ransacReprojThreshold=1.5, maxIters=3000, confidence=0.999)
            if B is None:
                break
            sel = inl.ravel() == 1
            if sel.sum() < 6:
                break
            cands.append((B, int(sel.sum())))
            P0, P1 = P0[~sel], P1[~sel]
        if cands:
            mov = cands if a.tutto else [c for c in cands if not ident(c[0])]
            if mov:
                A, n = max(mov, key=lambda c: c[1])
            else:
                A, n = np.array([[1, 0, 0], [0, 1, 0]], float), cands[0][1]
    if A is None:
        A = np.array([[1, 0, 0], [0, 1, 0]], float)
    M = np.vstack([A, [0, 0, 1]])
    C = M @ C
    p = (C @ ref)[:2]
    s = float(np.hypot(C[0, 0], C[1, 0]))
    v = float(np.hypot(*(p - p0))) * fps
    print(f"{i / fps:7.3f} {s:6.4f} {p[0]:6.1f} {p[1]:6.1f} {p[0] - ref[0]:6.1f} {p[1] - ref[1]:6.1f} {v:7.0f} {n:4d}")
    p0 = p
    kp0, d0 = kp1, d1
