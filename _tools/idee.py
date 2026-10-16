# -*- coding: utf-8 -*-
"""Scene "per idea" di Kallaway: grafica → faccia → STESSA grafica conta come una scena sola.

    _tools/venv/Scripts/python.exe -I _tools/idee.py

Parte dai segmenti corretti con i tagli morbidi (_analisi/ritmo/tagli_morbidi.json). Per ogni sequenza grafica → faccia
("piena", < 4 s) → grafica confronta l'ultimo fotogramma della prima grafica con il primo della seconda (zona grafica, ORB +
RANSAC): se restano almeno 12 punti coerenti è la stessa grafica che riprende (stessa idea). Uscita:
_analisi/ritmo/idee.json + statistiche a terminale (grafica per idea, durata da inizio a fine, quante riprese).
"""
import io, json, os, sys
import numpy as np
import cv2
from multiprocessing import Pool

QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, QUI)
import tagli_morbidi as tm  # noqa: E402

AN = tm.AN


def fotogramma(cap, fps, t):
    cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, int(round(t * fps))))
    ok, f = cap.read()
    if not ok:
        return None
    g = cv2.cvtColor(cv2.resize(f, (tm.W, tm.H), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
    return g[tm.GY0:tm.GY1]


def analizza(arg):
    n, path, segs = arg
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    riprese = []
    for i in range(len(segs) - 2):
        a, f, b = segs[i], segs[i + 1], segs[i + 2]
        if a["tipo"] == "grafica" and f["tipo"] == "piena" and f["dur"] < 4.0 and b["tipo"] == "grafica":
            x, y = fotogramma(cap, fps, a["t1"] - 0.1), fotogramma(cap, fps, b["t0"] + 0.15)
            if x is None or y is None:
                continue
            inl, _, _ = tm.coerenti(x, y)
            riprese.append((i, i + 2, inl))
    cap.release()
    return n, riprese


def main():
    inv = {r["n"]: r for r in json.load(io.open(os.path.join(tm.CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
    tmj = json.load(io.open(os.path.join(AN, "ritmo", "tagli_morbidi.json"), encoding="utf-8"))
    lav = [(int(n), os.path.join(tm.CARTELLA, inv[int(n)]["file"]), r["segmenti"]) for n, r in tmj["per_reel"].items()]
    out, idee_g, idee_span, per_idea = {}, [], [], []
    n_rip = n_cand = 0
    with Pool(4) as p:
        for n, riprese in p.imap_unordered(analizza, lav):
            segs = tmj["per_reel"][str(n)]["segmenti"]
            stessa = {i: j for i, j, inl in riprese if inl >= 12}
            n_cand += len(riprese); n_rip += len(stessa)
            out[n] = {"riprese": [[segs[i]["t0"], segs[j]["t0"], inl] for i, j, inl in riprese]}
            k = 0
            while k < len(segs):
                if segs[k]["tipo"] != "grafica":
                    k += 1
                    continue
                g, t0, cnt, j = segs[k]["dur"], segs[k]["t0"], 1, k
                while j in stessa:
                    j = stessa[j]
                    g += segs[j]["dur"]
                    cnt += 1
                idee_g.append(g); idee_span.append(segs[j]["t1"] - t0); per_idea.append(cnt)
                k = j + 1
    q = lambda a: {"n": len(a), "p25": round(float(np.percentile(a, 25)), 2), "mediana": round(float(np.median(a)), 2), "p75": round(float(np.percentile(a, 75)), 2)}
    res = {"candidati_grafica_faccia_grafica": n_cand, "stessa_grafica": n_rip, "idee": len(idee_g),
           "grafica_per_idea_s": q(idee_g), "durata_idea_inizio_fine_s": q(idee_span),
           "segmenti_per_idea": {"1": per_idea.count(1), "2": per_idea.count(2), "3+": sum(1 for c in per_idea if c >= 3)},
           "per_reel": out}
    json.dump(res, io.open(os.path.join(AN, "ritmo", "idee.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in res.items() if k != "per_reel"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
