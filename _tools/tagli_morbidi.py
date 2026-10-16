# -*- coding: utf-8 -*-
"""Tagli che eventi.py non vede: transizioni morbide (sfocatura, frusta, spinta, rotazione, dissolvenza breve).

    _tools/venv/Scripts/python.exe -I _tools/tagli_morbidi.py [n_reel …]      (senza argomenti: tutti i giu-ott-dark)

Regola (come la verifica a vista): c'è un taglio quando la composizione della zona grafica viene SOSTITUITA in pochi
fotogrammi. Candidati = picchi della differenza tra il fotogramma i e i-4 (zona grafica y 3–56%, 270 px di larghezza);
per ogni candidato si confrontano i fotogrammi i-5 e i+4 con ORB + RANSAC (similitudine): se restano meno di 12 punti
coerenti la composizione è stata sostituita (taglio); altrimenti è un movimento di camera dentro lo stesso mondo.
I tagli già trovati da eventi.py restano; si aggiungono quelli morbidi e si ricalcolano i segmenti grafici.
Uscita: CATALOGO-ANIMAZIONI/_analisi/ritmo/tagli_morbidi.json (per reel: tagli aggiunti, segmenti ricalcolati) e, a
terminale, le statistiche delle durate prima/dopo.
"""
import io, json, os, sys
import numpy as np
import cv2
from multiprocessing import Pool

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
AN = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi")
W, H = 270, 480
GY0, GY1 = int(0.03 * H), int(0.56 * H)
ORB = None


def leggi(path):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    G = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        g = cv2.cvtColor(cv2.resize(f, (W, H), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
        G.append(g[GY0:GY1])
    cap.release()
    return G, fps


def coerenti(a, b):
    global ORB
    if ORB is None:
        ORB = cv2.ORB_create(nfeatures=600, fastThreshold=7, edgeThreshold=11, patchSize=15)
    A = cv2.resize(a, (a.shape[1] * 2, a.shape[0] * 2), interpolation=cv2.INTER_CUBIC)
    B = cv2.resize(b, (b.shape[1] * 2, b.shape[0] * 2), interpolation=cv2.INTER_CUBIC)
    ka, da = ORB.detectAndCompute(A, None)
    kb, db = ORB.detectAndCompute(B, None)
    if da is None or db is None or len(ka) < 8 or len(kb) < 8:
        return 0, len(ka or []), len(kb or [])
    m = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True).match(da, db)
    if len(m) < 8:
        return 0, len(ka), len(kb)
    p0 = np.float32([ka[x.queryIdx].pt for x in m]); p1 = np.float32([kb[x.trainIdx].pt for x in m])
    M, inl = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC, ransacReprojThreshold=3.0, maxIters=2000)
    if M is None:
        return 0, len(ka), len(kb)
    s = float(np.hypot(M[0, 0], M[1, 0]))
    if s < 0.5 or s > 2.0:
        return 0, len(ka), len(kb)
    return int(inl.sum()), len(ka), len(kb)


def analizza(arg):
    n, path, tagli, durata = arg
    G, fps = leggi(path)
    N = len(G)
    D4 = np.zeros(N)
    for i in range(4, N):
        D4[i] = float(np.abs(G[i].astype(np.int16) - G[i - 4].astype(np.int16)).mean())
    fr_tagli = [int(round(t * fps)) for t in tagli]
    nuovi = []
    i = 6
    while i < N - 5:
        win = D4[max(0, i - 3):i + 4]
        if D4[i] >= 12 and D4[i] == win.max() and all(abs(i - c) > 6 for c in fr_tagli + [x[0] for x in nuovi]) and not any(0 < i - c <= int(0.5 * fps) for c in fr_tagli):
            inl, na, nb = coerenti(G[i - 5], G[min(N - 1, i + 4)])
            # composizione sostituita: pochi punti coerenti, ma entrambe le immagini hanno dettagli (non un nero/flash)
            if inl < 12 and na >= 25 and nb >= 25:
                nuovi.append((i, inl))
                i += 5
                continue
        i += 1
    return n, round(fps, 3), [round(f / fps, 3) for f, _ in nuovi], [int(x) for _, x in nuovi]


def main():
    inv = {r["codice"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
    ev = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
    filtro = [int(x) for x in sys.argv[1:]]
    lav = []
    byn = {}
    for e in ev:
        if e["era"] != "giu-ott-dark" or (filtro and e["n"] not in filtro):
            continue
        byn[e["n"]] = e
        lav.append((e["n"], os.path.join(CARTELLA, inv[e["codice"]]["file"]), e["tagli"], e["durata"]))
    nproc = 3 if os.path.exists(os.path.join(AN, "render", ".lock-render")) else 6
    out = {}
    with Pool(nproc) as p:
        for n, fps, add, inl in p.imap_unordered(analizza, lav):
            out[n] = {"fps": fps, "tagli_morbidi": add, "inlier": inl}
            if filtro:
                print(f"reel {n}: tagli eventi {byn[n]['tagli']}\n   morbidi aggiunti {add} (inlier {inl})")
    # segmenti ricalcolati: i segmenti di eventi.py tagliati nei punti nuovi (il tipo resta quello del segmento)
    prima, dopo, tot_t, tot_d, tot_add = [], [], 0, 0.0, 0
    for n, r in out.items():
        e = byn[n]
        add = sorted(r["tagli_morbidi"])
        tot_add += len(add)
        tot_t += len(e["tagli"]) + len(add)
        tot_d += e["durata"]
        segs = []
        for s in e["segmenti"]:
            pts = [s["t0"]] + [t for t in add if s["t0"] + 0.2 < t < s["t1"] - 0.2] + [s["t1"]]
            for a, b in zip(pts[:-1], pts[1:]):
                segs.append({"t0": a, "t1": b, "dur": round(b - a, 3), "tipo": s["tipo"]})
            if s["tipo"] == "grafica":
                prima.append(s["dur"])
        r["segmenti"] = segs
        dopo += [s["dur"] for s in segs if s["tipo"] == "grafica"]
    q = lambda a: {"n": len(a), "p25": round(float(np.percentile(a, 25)), 2), "mediana": round(float(np.median(a)), 2), "p75": round(float(np.percentile(a, 75)), 2)}
    res = {"reel": len(out), "tagli_morbidi_aggiunti": tot_add, "tagli_al_minuto_dopo": round(tot_t / (tot_d / 60), 2),
           "grafica_prima": q(prima), "grafica_dopo": q(dopo), "per_reel": out}
    if not filtro:
        json.dump(res, io.open(os.path.join(AN, "ritmo", "tagli_morbidi.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in res.items() if k != "per_reel"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
