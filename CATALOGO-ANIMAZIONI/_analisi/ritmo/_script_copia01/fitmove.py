# -*- coding: utf-8 -*-
"""Curva di un movimento di camera misurato con camtrack.py (blocco C1): inizio, durata, spostamento e la curva che lo descrive.

    _tools/venv/Scripts/python.exe -I fitmove.py <camtrack.txt> <ta> <tb> [--canale x|y|s|xy|auto]

Prende le righe di camtrack fra ta e tb, normalizza il canale principale (o lo spostamento lungo la direzione del moto per xy)
fra il primo e l'ultimo valore, trova inizio e fine del moto (velocità sopra il 4% del picco) e confronta le curve note di GSAP
e le due del kit (KW.move, KW.arrive) e una cubic-bezier cercata a griglia. Stampa: inizio, durata, delta x/y/scala, picco di
velocità e quando, curva migliore con l'errore.
"""
import sys, io, argparse
import numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ap = argparse.ArgumentParser()
ap.add_argument("f"); ap.add_argument("ta", type=float); ap.add_argument("tb", type=float)
ap.add_argument("--canale", default="auto")
ap.add_argument("--soglia", type=float, default=0.04)
a = ap.parse_args()
R = []
for ln in open(a.f, encoding="utf-8"):
    p = ln.split()
    if len(p) >= 6 and not ln.startswith("#"):
        try:
            R.append([float(p[0]), float(p[1]), float(p[2]), float(p[3])])
        except ValueError:
            pass
R = np.array(R)
R = R[(R[:, 0] >= a.ta - 1e-6) & (R[:, 0] <= a.tb + 1e-6)]
t, s, x, y = R[:, 0], R[:, 1], R[:, 2], R[:, 3]


def bez(p1x, p1y, p2x, p2y):
    def f(X):
        X = np.clip(np.asarray(X, float), 0, 1)
        u = X.copy()
        for _ in range(12):
            cx = 3 * p1x; bx = 3 * (p2x - p1x) - cx; ax = 1 - cx - bx
            sx = ((ax * u + bx) * u + cx) * u - X
            d = (3 * ax * u + 2 * bx) * u + cx
            d = np.where(np.abs(d) < 1e-6, 1e-6, d)
            u = np.clip(u - sx / d, 0, 1)
        cy = 3 * p1y; by = 3 * (p2y - p1y) - cy; ay = 1 - cy - by
        return ((ay * u + by) * u + cy) * u
    return f


E = {
    "linear": lambda u: u, "sine.out": lambda u: np.sin(np.pi * u / 2), "sine.inOut": lambda u: (1 - np.cos(np.pi * u)) / 2,
    "power1.out": lambda u: 1 - (1 - u) ** 2, "power2.out": lambda u: 1 - (1 - u) ** 3, "power3.out": lambda u: 1 - (1 - u) ** 4,
    "power4.out": lambda u: 1 - (1 - u) ** 5, "expo.out": lambda u: np.where(u >= 1, 1, 1 - 2 ** (-10 * u)),
    "power1.inOut": lambda u: np.where(u < .5, 2 * u * u, 1 - 2 * (1 - u) ** 2),
    "power2.inOut": lambda u: np.where(u < .5, 4 * u ** 3, 1 - 4 * (1 - u) ** 3),
    "power3.inOut": lambda u: np.where(u < .5, 8 * u ** 4, 1 - 8 * (1 - u) ** 4),
    "power2.in": lambda u: u ** 3, "power1.in": lambda u: u ** 2,
    "circ.out": lambda u: np.sqrt(1 - (u - 1) ** 2),
    "KW.move": bez(0.3, 0.2, 0.35, 0.9), "KW.arrive": bez(0.2, 0.8, 0.7, 0.95), "KW.drift": bez(0.3, 0.35, 0.55, 0.8),
}
lx = np.log(s)
ch = a.canale
if ch == "auto":
    rng = {"x": abs(x[-1] - x[0]), "y": abs(y[-1] - y[0]), "s": abs(lx[-1] - lx[0]) * 900}
    ch = "xy" if rng["x"] > 0.2 * max(rng.values()) and rng["y"] > 0.2 * max(rng.values()) else max(rng, key=rng.get)
if ch == "xy":
    d = np.hypot(x - x[0], y - y[0])
    v = d
elif ch == "s":
    v = lx
else:
    v = {"x": x, "y": y}[ch]
p = (v - v[0]) / (v[-1] - v[0] if abs(v[-1] - v[0]) > 1e-9 else 1)
dt = np.diff(t)
vel = np.abs(np.diff(p)) / dt
pk = vel.max()
on = np.nonzero(vel > a.soglia * pk)[0]
i0, i1 = on[0], on[-1] + 1
T0, T1 = t[i0], t[i1]
ts = t[i0:i1 + 1]; ps = p[i0:i1 + 1]
ps = (ps - ps[0]) / (ps[-1] - ps[0])
u = (ts - T0) / (T1 - T0)
res = sorted(((float(np.sqrt(np.mean((f(u) - ps) ** 2))), n) for n, f in E.items()))
# griglia ridotta e poi raffinamento locale (niente scipy)
cands = []
for p1x in np.linspace(0.02, 0.9, 12):
    for p2x in np.linspace(0.1, 0.98, 12):
        for p1y in np.linspace(0, 1.2, 13):
            for p2y in np.linspace(0.5, 1.1, 13):
                f = bez(p1x, p1y, p2x, p2y)
                e = float(np.sqrt(np.mean((f(u) - ps) ** 2)))
                cands.append((e, (p1x, p1y, p2x, p2y)))
cands.sort()
e0, b0 = cands[0]
st = 0.04
for _ in range(60):
    imp = False
    for k in range(4):
        for sg in (-1, 1):
            b = list(b0); b[k] += sg * st
            if k in (0, 2) and not (0 <= b[k] <= 1):
                continue
            f = bez(*b)
            e = float(np.sqrt(np.mean((f(u) - ps) ** 2)))
            if e < e0:
                e0, b0, imp = e, tuple(b), True
    if not imp:
        st /= 2
        if st < 0.002:
            break
ipk = int(np.argmax(vel))
print(f"canale {ch} · inizio {T0:.3f} s · fine {T1:.3f} s · durata {T1 - T0:.3f} s")
print(f"delta: x {x[-1] - x[0]:+.1f} px · y {y[-1] - y[0]:+.1f} px · scala x{s[-1] / s[0]:.4f} ({(s[-1] / s[0] - 1) * 100:+.1f}%)")
vx = np.hypot(np.diff(x), np.diff(y)) / dt
print(f"picco di velocità a {t[ipk]:.3f} s ({(t[ipk] - T0) / (T1 - T0) * 100:.0f}% della durata) · {vx.max():.0f} px/s sullo schermo")
print("curve note:", " · ".join(f"{n} {e:.4f}" for e, n in res[:5]))
print(f"cubic-bezier({b0[0]:.3f}, {b0[1]:.3f}, {b0[2]:.3f}, {b0[3]:.3f}) errore {e0:.4f}")
