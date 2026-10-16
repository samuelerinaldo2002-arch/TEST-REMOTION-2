# -*- coding: utf-8 -*-
"""camtrack.txt → array JS per cpCam.cattura (blocco C1): [[t, s, x, y], …] fra ta e tb, levigato (media mobile su 3 fotogrammi,
capi fermi), coi valori relativi al primo campione (s = 1, x = 540, y = 880).

    python -I cattura_js.py <camtrack.txt> <ta> <tb> [--liscio 3]
"""
import sys, argparse
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("f"); ap.add_argument("ta", type=float); ap.add_argument("tb", type=float)
ap.add_argument("--liscio", type=int, default=3)
a = ap.parse_args()
R = []
for ln in open(a.f, encoding="utf-8"):
    p = ln.split()
    if ln.startswith("#") or len(p) < 4:
        continue
    try:
        R.append([float(p[0]), float(p[1]), float(p[2]), float(p[3])])
    except ValueError:
        pass
R = np.array(R)
R = R[(R[:, 0] >= a.ta - 1e-6) & (R[:, 0] <= a.tb + 1e-6)]
t, s, x, y = R.T
ls = np.log(s)
k = a.liscio
if k > 1:
    def sm(v):
        w = np.ones(k) / k
        p = np.pad(v, (k // 2, k // 2), mode="edge")
        o = np.convolve(p, w, mode="valid")
        o[0], o[-1] = v[0], v[-1]
        return o
    ls, x, y = sm(ls), sm(x), sm(y)
s = np.exp(ls - ls[0])
# il primo campione (ta) diventa la base: C(t)·C(ta)⁻¹ → scala s_t/s_a, il punto (540, 880) di ta finisce in p_t + (s_t/s_a)(ref − p_a)
xr = x + s * (540 - x[0])
yr = y + s * (880 - y[0])
out = ", ".join(f"[{tt:.3f}, {ss:.4f}, {xx:.1f}, {yy:.1f}]" for tt, ss, xx, yy in zip(t, s, xr, yr))
print("[" + out + "]")
