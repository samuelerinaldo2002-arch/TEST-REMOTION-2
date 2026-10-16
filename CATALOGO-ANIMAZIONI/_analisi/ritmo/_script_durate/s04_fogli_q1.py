# -*- coding: utf-8 -*-
"""Q1: contact sheets (~6 fps) + cut detail strips for the 10 random dark reels."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comune import *
from fogli_lib import *
from multiprocessing import Pool
utf8_stdout()

def candidati(m, cols, cuts):
    g = lambda k: m[:, cols.index(k)].astype(np.float64)
    dall, hist, inl = g("dall"), g("hist"), g("inl")
    cand = []
    for i in range(1, len(m)):
        base = np.median(dall[max(0, i - 6):i]) if i > 1 else dall[i]
        sp = dall[i] > 6 and dall[i] > 1.8 * (base + 2.0)
        if (sp and inl[i] < 15) or hist[i] < 0.85:
            if all(abs(i - c) > 3 for c in cuts) and (not cand or i - cand[-1] > 3):
                cand.append(i)
    return cand

def uno(n):
    ev = eventi()
    e = ev[n]
    z = np.load(os.path.join(MET, e["codice"] + ".npz"))
    m, cols, fps0 = z["m"], list(z["cols"]), float(z["fps"])
    cuts = [int(round(t * fps0)) for t in e["tagli"]]
    cand = candidati(m, cols, cuts)
    keep = set()
    for f in cuts + cand:
        for o in (-3, -1, 0, 1, 3):
            keep.add(f + o)
    fps, nfr, step, grid, det = leggi_video(reel_path(n), keep=keep)
    segs = e["segmenti"]
    def tipo_di(fi):
        t = fi / fps
        for s in segs:
            if s["t0"] <= t < s["t1"]:
                return s["tipo"]
        return None
    pref = os.path.join(FOGLI, f"q1_reel{n:03d}")
    tit = f"reel {n} ({e['codice']}, {e['data']})"
    p1 = foglio_griglia(tit, fps, nfr, step, grid, cuts, cand, tipo_di, pref)
    lst = [(c, f"T{k+1} {c/fps:.2f}s", (80, 80, 255)) for k, c in enumerate(cuts)] + \
          [(c, f"?{k+1} {c/fps:.2f}s", (0, 230, 255)) for k, c in enumerate(cand)]
    lst.sort()
    p2 = foglio_dettaglio(tit, fps, det, lst, pref)
    info = {"n": n, "codice": e["codice"], "fps": fps, "nfr": nfr, "step": step, "tagli_fr": cuts, "cand_fr": cand,
            "tagli_s": [round(c / fps, 3) for c in cuts], "cand_s": [round(c / fps, 3) for c in cand], "fogli": p1 + p2}
    save_json(os.path.join(DATI, f"q1_reel{n:03d}_auto.json"), info)
    return n, len(cuts), len(cand), len(p1), len(p2)

if __name__ == "__main__":
    q1, _ = campioni()
    os.makedirs(FOGLI, exist_ok=True); os.makedirs(DATI, exist_ok=True)
    with Pool(3) as p:
        for r in p.imap_unordered(uno, q1):
            print(r)
