# -*- coding: utf-8 -*-
"""Test di _tools/eventi.py (curva firmata) su mosse sintetiche con overshoot noto, passando per analizza()."""
import io, os, sys, math, importlib.util, tempfile
import numpy as np
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
spec = importlib.util.spec_from_file_location("eventi", os.path.join(ROOT, "_tools", "eventi.py"))
ev = importlib.util.module_from_spec(spec); spec.loader.exec_module(ev)
TMP = os.path.join(os.environ.get("TEMP", "."), "rimbalzo_test_met"); os.makedirs(TMP, exist_ok=True)
ev.MET = TMP
COLS = ["lt", "nb", "nw", "mstd", "mlum", "dtop", "dall", "dsub", "dcam", "hist", "shp", "tx", "ty", "sc", "rot", "inl", "trk", "loc"]
rng = np.random.default_rng(1)
def back(s):
    return lambda u: 1 + (s + 1) * (u - 1) ** 3 + s * (u - 1) ** 2
cases = [("power2.out 400px 1s", lambda u: 1 - (1 - u) ** 3, 400, 24, "pan"),
         ("sine.out 300px 0.8s", lambda u: np.sin(np.pi * u / 2), 300, 19, "pan"),
         ("back.out(1) 400px 1s", back(1.0), 400, 24, "pan"),
         ("back.out(1.7) 400px 1s", back(1.70158), 400, 24, "pan"),
         ("back.out(2.5) 400px 1s", back(2.5), 400, 24, "pan"),
         ("back.out(1.7) 120px 0.6s", back(1.70158), 120, 14, "pan"),
         ("back.out(1.7) zoom x1.3 1s", back(1.70158), math.log(1.3), 24, "zoom"),
         ("power2.out zoom x0.8 0.8s", lambda u: 1 - (1 - u) ** 3, math.log(0.8), 19, "zoom")]
fps = 23.976
for name, f, amp, nfr, asse in cases:
    pre, post = 12, 30
    n = pre + nfr + post
    pos = np.zeros(n)
    u = np.linspace(0, 1, nfr + 1)
    pos[pre - 1:pre + nfr] = amp * f(u)
    pos[pre + nfr:] = amp
    vel = np.diff(pos, prepend=0.0)
    m = np.zeros((n, len(COLS)), dtype=np.float32)
    C = {c: k for k, c in enumerate(COLS)}
    m[:, C["hist"]] = 1; m[:, C["inl"]] = 100; m[:, C["sc"]] = 1; m[:, C["lt"]] = 30; m[:, C["shp"]] = 50
    if asse == "pan":
        ang = 0.6
        m[:, C["tx"]] = vel * math.cos(ang) + rng.normal(0, 0.07, n)
        m[:, C["ty"]] = vel * math.sin(ang) + rng.normal(0, 0.07, n)
    else:
        m[:, C["sc"]] = np.exp(vel + rng.normal(0, 0.0001, n))
        m[:, C["tx"]] = rng.normal(0, 0.07, n); m[:, C["ty"]] = rng.normal(0, 0.07, n)
    np.savez_compressed(os.path.join(TMP, "synt.npz"), m=m, cols=np.array(COLS), fps=np.float32(fps))
    e = ev.analizza("synt", "2026-07-01", os.path.join(TMP, "nonesiste.mp4"))
    s = 4 * ((1.70158 if "1.7" in name else 2.5 if "2.5" in name else 1.0) ** 3) / 27 / (((1.70158 if "1.7" in name else 2.5 if "2.5" in name else 1.0) + 1) ** 2) if "back" in name else 0
    print(f"{name:30s} attesa={s:.3f}  mosse={len(e['movimenti'])}")
    for mv in e["movimenti"]:
        print(f"      t0={mv['t0']:.2f} dur={mv['dur']:.2f} ease={mv['ease']:12s} | asse={mv['asse']} ov={mv['overshoot']} firm={mv['ease_firmata']} err={mv['err_firmata']} fin={mv['spost_finale']} sig={mv['significativa']} inv={mv['inversione']} rit={mv['ritorno_di_precedente']} picco={mv['picco_t_s']} assest={mv['assest_t_s']}")
