# -*- coding: utf-8 -*-
"""Scompone gli overshoot di camera (giu-ott-dark): per ease firmata, errore di fit, velocita', posizione del picco."""
import io, os, json, sys
import numpy as np
from collections import Counter
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
AN = os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi")
ev = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
rows = []
for e in ev:
    if e["era"] != "giu-ott-dark":
        continue
    for m in e["movimenti"]:
        if m["dur"] >= 0.3 and m.get("asse") and m["significativa"] and not m["inversione"] and not m["ritorno_di_precedente"] and m["overshoot"] is not None:
            rows.append(dict(m, n=e["n"], codice=e["codice"], fps=e["fps"]))
print("valutate:", len(rows))
ov = np.array([r["overshoot"] for r in rows])
isback = np.array([str(r["ease_firmata"]).startswith("back") for r in rows])
err = np.array([r["err_firmata"] if r["err_firmata"] is not None else 9 for r in rows])
vel = np.array([r["v_picco_px_s"] for r in rows])
pk_after = np.array([r["picco_t_s"] - r["dur"] for r in rows])     # >0: peak after the end of the run (in the extension)
loc = np.array([r["loc_medio"] for r in rows])
print("best fit back.out:", isback.sum(), f"({isback.mean():.1%})")
for lo, hi in ((0.02, 0.05), (0.05, 0.10), (0.10, 0.20), (0.20, 0.5), (0.5, 9)):
    s = (ov > lo) & (ov <= hi)
    print(f"ov {lo:.2f}-{hi:.2f}: n={s.sum():4d}  back.out best={isback[s].mean():.0%}  err med={np.median(err[s]):.3f}  v_picco med={np.median(vel[s]):.0f}  picco dopo fine run med={np.median(pk_after[s]):+.2f}s  loc med={np.median(loc[s]):.2f}")
s = ov <= 0.01
print(f"ov <=1%   : n={s.sum():4d}  back.out best={isback[s].mean():.0%}  err med={np.median(err[s]):.3f}  v_picco med={np.median(vel[s]):.0f}  loc med={np.median(loc[s]):.2f}")
# back.out best fits: overshoot distribution & error
print("\nback.out come miglior curva: overshoot p25/50/75 =", np.percentile(ov[isback], [25, 50, 75]).round(3), " err p50 =", np.median(err[isback]).round(3))
for nm in ("back.out(1)", "back.out(1.7)", "back.out(2.5)"):
    s = np.array([r["ease_firmata"] == nm for r in rows])
    print(f"   {nm:14s} n={s.sum():3d} ov med={np.median(ov[s]):.3f} err med={np.median(err[s]):.3f} v med={np.median(vel[s]):.0f}")
# plausible bounces: back.out best with good fit
good = isback & (err < 0.05) & (ov > 0.02)
print("\nback.out best & err<0.05 & ov>2%:", good.sum(), f"({good.mean():.1%} delle valutate)")
good2 = isback & (err < 0.03) & (ov > 0.02)
print("back.out best & err<0.03 & ov>2%:", good2.sum(), f"({good2.mean():.1%})")
# where is the peak relative to the run
print("\npeak timing for ov>5%: in run", ((pk_after <= 0) & (ov > 0.05)).sum(), " after run", ((pk_after > 0) & (ov > 0.05)).sum())
# per-reel concentration
c = Counter(r["n"] for r, g in zip(rows, good) if g)
print("reel con piu' rimbalzi plausibili:", c.most_common(12))
print("reel con almeno un rimbalzo plausibile:", len(c), "su", len(set(r["n"] for r in rows)))
json.dump([dict(r) for r, g in zip(rows, good) if g], io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "r10_rimbalzi_plausibili.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
