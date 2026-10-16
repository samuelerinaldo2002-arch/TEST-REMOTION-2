# -*- coding: utf-8 -*-
"""Verifica a vista degli overshoot di camera rilevati da eventi.py (giu-ott-dark).

Per ogni caso: striscia di fotogrammi (fascia grafica y 3-56%), anaglifo rosso/ciano inizio->picco e picco->fine
(grigio = fermo, frange colorate = spostato), curva con segno, e lo spostamento picco->fine misurato a parte nei
4 quadranti della fascia (LK + RANSAC sui fotogrammi nativi): se i quadranti concordano è la camera, se no è
un'animazione locale.

    python -I r11_verifica_camera.py        -> strisce_rimbalzo/camera_*.jpg + r11_verifica_camera.json
"""
import io, os, sys, json, math, random
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
AN = os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi")
OUT = os.path.join(AN, "ritmo", "strisce_rimbalzo")
QUI = os.path.dirname(os.path.abspath(__file__))
MET = os.path.join(AN, "metriche")
os.makedirs(OUT, exist_ok=True)


def curva(codice, i, j, je, asse):
    z = np.load(os.path.join(MET, codice + ".npz"))
    m, cols = z["m"], list(z["cols"])
    g = lambda k: m[:, cols.index(k)].astype(np.float64)
    tx, ty, sc, inl = g("tx"), g("ty"), g("sc"), g("inl")
    valid = inl >= 15
    zoom = np.where(valid, np.log(np.maximum(sc, 1e-3)), np.nan)
    vx = np.where(valid[i:je], tx[i:je], 0.0); vy = np.where(valid[i:je], ty[i:je], 0.0)
    zm = np.nan_to_num(zoom[i:je]); r = j - i
    dx, dy, dz = vx[:r].sum(), vy[:r].sum(), zm[:r].sum()
    if asse == "zoom":
        return np.concatenate([[0.0], np.cumsum(zm)]) * (1 if dz >= 0 else -1), (0.0, 0.0)
    p = math.hypot(dx, dy)
    return np.concatenate([[0.0], np.cumsum((vx * dx + vy * dy) / p)]), (dx / p, dy / p)


def leggi(path, f0, f1):
    cap = cv2.VideoCapture(path)
    cap.set(cv2.CAP_PROP_POS_FRAMES, f0)
    fr = []
    for f in range(f0, f1 + 1):
        ok, im = cap.read()
        if not ok:
            break
        fr.append(im)
    cap.release()
    return fr


def banda(im):
    h = im.shape[0]
    return im[int(0.03 * h):int(0.56 * h)]


def sim(a, b):
    """similarità a->b (LK + RANSAC) in px a 1080 di larghezza: (dx, dy, scala, inlier)"""
    k = 1080.0 / a.shape[1]
    ga, gb = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    pts = cv2.goodFeaturesToTrack(ga, maxCorners=200, qualityLevel=0.01, minDistance=5, blockSize=5)
    if pts is None or len(pts) < 8:
        return None
    nx, st, _ = cv2.calcOpticalFlowPyrLK(ga, gb, pts, None, winSize=(31, 31), maxLevel=5)
    ok = st.ravel() == 1
    if ok.sum() < 8:
        return None
    M, inl = cv2.estimateAffinePartial2D(pts[ok], nx[ok], method=cv2.RANSAC, ransacReprojThreshold=2.0, maxIters=1000)
    if M is None:
        return None
    s = math.hypot(M[0, 0], M[1, 0])
    cx, cy = a.shape[1] / 2, a.shape[0] / 2
    dx = (M[0, 0] * cx + M[0, 1] * cy + M[0, 2] - cx) * k
    dy = (M[1, 0] * cx + M[1, 1] * cy + M[1, 2] - cy) * k
    return round(float(dx), 1), round(float(dy), 1), round(float(s), 4), int(inl.sum())


def quadranti(a, b):
    h, w = a.shape[:2]
    out = {}
    for nome, (y0, y1, x0, x1) in {"alto-sx": (0, h // 2, 0, w // 2), "alto-dx": (0, h // 2, w // 2, w),
                                   "basso-sx": (h // 2, h, 0, w // 2), "basso-dx": (h // 2, h, w // 2, w)}.items():
        out[nome] = sim(a[y0:y1, x0:x1], b[y0:y1, x0:x1])
    out["tutta"] = sim(a, b)
    return out


def anaglifo(a, b, larg):
    ga, gb = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    im = cv2.merge([gb, gb, ga])     # BGR: rosso = a, ciano = b
    return cv2.resize(im, (larg, int(im.shape[0] * larg / im.shape[1])), interpolation=cv2.INTER_AREA)


def grafico(c, F, r, kp, ke, fps, W, H, testo):
    im = np.full((H, W, 3), 18, np.uint8)
    y = c / F if F else c
    lo, hi = min(-0.05, float(y.min())), max(1.3, float(y.max()) + 0.05)
    X = lambda k: int(30 + (W - 50) * k / max(1, len(c) - 1))
    Y = lambda v: int(H - 25 - (H - 60) * (v - lo) / (hi - lo))
    cv2.line(im, (30, Y(1)), (W - 20, Y(1)), (90, 90, 90), 1)
    cv2.line(im, (30, Y(0)), (W - 20, Y(0)), (60, 60, 60), 1)
    for k, col in ((r, (0, 140, 255)), (kp, (80, 80, 255)), (ke, (80, 255, 80))):
        cv2.line(im, (X(k), 30), (X(k), H - 25), col, 1)
    pts = np.array([[X(k), Y(v)] for k, v in enumerate(y)], np.int32)
    cv2.polylines(im, [pts], False, (255, 255, 255), 2, cv2.LINE_AA)
    for k in range(len(y)):
        cv2.circle(im, (X(k), Y(y[k])), 2, (200, 200, 200), -1)
    cv2.putText(im, testo, (8, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
    cv2.putText(im, "arancio=fine tratto  rosso=picco  verde=assestamento  (1 fotogramma = 1 punto)", (8, H - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (170, 170, 170), 1, cv2.LINE_AA)
    return im


def scegli():
    ev = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
    rows = []
    for e in ev:
        if e["era"] != "giu-ott-dark":
            continue
        for m in e["movimenti"]:
            if m["dur"] >= 0.3 and m.get("asse") and m["significativa"] and not m["inversione"] and not m["ritorno_di_precedente"] and m["overshoot"] is not None:
                rows.append(dict(m, n=e["n"], codice=e["codice"], fps=e["fps"], file=e["file"]))
    rnd = random.Random(11)
    A = [r for r in rows if str(r["ease_firmata"]).startswith("back") and r["err_firmata"] < 0.05 and r["overshoot"] > 0.02]
    A.sort(key=lambda r: -r["v_picco_px_s"])
    pickA, seen = [], set()
    for r in A:
        if r["n"] not in seen:
            pickA.append(dict(r, gruppo="A: back.out con fit buono (err<0,05)")); seen.add(r["n"])
        if len(pickA) >= 10:
            break
    B = [r for r in rows if r["overshoot"] > 0.10 and (not str(r["ease_firmata"]).startswith("back") or r["err_firmata"] >= 0.1) and r["n"] not in seen]
    rnd.shuffle(B)
    pickB = []
    for r in B:
        if r["n"] not in seen:
            pickB.append(dict(r, gruppo="B: overshoot >10% con forma non da rimbalzo")); seen.add(r["n"])
        if len(pickB) >= 6:
            break
    return pickA + pickB


def main():
    casi = scegli()
    res = []
    for idx, m in enumerate(casi, 1):
        fps = m["fps"]
        i = int(round(m["t0"] * fps)); j = i + int(round(m["dur"] * fps)); je = i + int(round(m["finestra_s"] * fps))
        c, u = curva(m["codice"], i, j, je, m["asse"])
        kp = int(np.argmax(c))
        ke = int(round(m["assest_t_s"] * fps)) if m["assest_t_s"] is not None else len(c) - 1
        F = c[ke] if ke < len(c) else c[-1]
        fr = leggi(os.path.join(ROOT, m["file"]), i - 1, je + 2)
        if len(fr) < je - i:
            print("video corto", m["n"]); continue
        b0, bp, be = banda(fr[0]), banda(fr[kp]), banda(fr[min(ke, len(fr) - 1)])
        q_sp, q_pe = quadranti(b0, bp), quadranti(bp, be)
        # strip: 10 frames across the window
        sel = np.unique(np.linspace(0, min(len(fr) - 1, len(c) + 1), 10).round().astype(int))
        tiles = []
        for k in sel:
            t = cv2.resize(banda(fr[k]), (180, int(banda(fr[k]).shape[0] * 180 / banda(fr[k]).shape[1])), interpolation=cv2.INTER_AREA)
            lab = f"f{i - 1 + k} {'P' if k == kp else ''}{'E' if k == ke else ''}"
            cv2.rectangle(t, (0, 0), (180, 15), (0, 0, 0), -1)
            cv2.putText(t, lab, (3, 11), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (255, 255, 255), 1, cv2.LINE_AA)
            tiles.append(t)
        while len(tiles) < 10:
            tiles.append(np.zeros_like(tiles[0]))
        row1 = np.hstack(tiles)
        a1, a2 = anaglifo(b0, bp, 600), anaglifo(bp, be, 600)
        for im, s in ((a1, "inizio -> picco (rosso=inizio, ciano=picco)"), (a2, "picco -> fine (rosso=picco, ciano=fine)")):
            cv2.rectangle(im, (0, 0), (600, 18), (0, 0, 0), -1)
            cv2.putText(im, s, (5, 13), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
        txt = f"reel {m['n']} t={m['t0']:.2f}s {m['asse']} fin={m['spost_finale']} ov={m['overshoot']:.1%} {m['ease_firmata']} err={m['err_firmata']}"
        gr = grafico(c, F, j - i, kp, ke, fps, 600, a1.shape[0], txt)
        row2 = np.hstack([a1, a2, gr])
        W = max(row1.shape[1], row2.shape[1])
        pad = lambda x: np.pad(x, ((0, 0), (0, W - x.shape[1]), (0, 0)))
        im = np.vstack([pad(row1), np.zeros((4, W, 3), np.uint8), pad(row2)])
        nome = f"camera_{idx:02d}_reel{m['n']}_{m['t0']:.2f}s.jpg"
        cv2.imwrite(os.path.join(OUT, nome), im, [cv2.IMWRITE_JPEG_QUALITY, 86])
        # projection of each quadrant's peak->end shift on the move direction (pan) or its scale (zoom)
        def proj(q):
            if not q:
                return None
            return round(q[0] * u[0] + q[1] * u[1], 1) if m["asse"] == "pan" else round(math.log(q[2]) * (1 if (m["spost_finale"] or 1) >= 1 else -1) * 100, 2)
        rec = {"caso": idx, "gruppo": m["gruppo"], "n": m["n"], "t0": m["t0"], "dur": m["dur"], "asse": m["asse"], "spost_finale": m["spost_finale"],
               "overshoot": m["overshoot"], "ease_firmata": m["ease_firmata"], "err_firmata": m["err_firmata"], "v_picco_px_s": m["v_picco_px_s"],
               "loc_medio": m["loc_medio"], "valid_frac": m["valid_frac"], "striscia": nome,
               "ritorno_misurato_quadranti": {k: proj(v) for k, v in q_pe.items()},
               "andata_misurata_quadranti": {k: proj(v) for k, v in q_sp.items()},
               "ritorno_atteso": round(float(c[kp] - F), 1) if m["asse"] == "pan" else round(float(c[kp] - F) * 100, 2)}
        res.append(rec)
        print(f"{idx:2d} {m['gruppo'][:2]} reel {m['n']:3d} t={m['t0']:6.2f} {m['asse']:4s} fin={m['spost_finale']} ov={m['overshoot']:.3f} {m['ease_firmata']} err={m['err_firmata']} v={m['v_picco_px_s']}")
        print(f"      andata (quadranti): {rec['andata_misurata_quadranti']}")
        print(f"      ritorno atteso {rec['ritorno_atteso']} -> misurato: {rec['ritorno_misurato_quadranti']}")
    json.dump(res, io.open(os.path.join(QUI, "r11_verifica_camera.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
