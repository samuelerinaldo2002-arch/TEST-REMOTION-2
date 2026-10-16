# -*- coding: utf-8 -*-
"""Entrata di un elemento (pop, scivolata): scala e posizione fotogramma per fotogramma → rimbalzo vero o no.

    _tools/venv/Scripts/python.exe -I _tools/pop.py --k reel:76 --t 13.9,14.6 --roi 700,740,300,120 --voce H03_names
    _tools/venv/Scripts/python.exe -I _tools/pop.py --n render.mp4 --t 10,10.6 --roi … --voce …     (un nostro render)

L'elemento si cerca da solo nell'ultimo fotogramma (la componente più grande che si stacca dallo sfondo dentro --roi);
diventa il modello, che si cerca in ogni fotogramma dentro --area (default: la roi allargata di --margine px) su posizione e
scala (0,30–1,50). Rimbalzo di scala = picco oltre la scala finale; rimbalzo di posizione = quanto passa oltre il punto
d'arrivo lungo la direzione del moto, in % dello spostamento. Coordinate nello spazio 1080x1920.
Uscita: CATALOGO-ANIMAZIONI/_analisi/ritmo/pop/<voce>.jpg (+ .json).
"""
import argparse, io, json, os, re, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
OUT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi", "ritmo", "pop")
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}


def leggi(path, t0, t1):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    i0, i1 = int(round(t0 * fps)), int(round(t1 * fps))
    cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
    out = []
    for i in range(i0, i1 + 1):
        ok, f = cap.read()
        if not ok:
            break
        if f.shape[1] != 1080:
            f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))), interpolation=cv2.INTER_CUBIC)
        out.append(f)
    cap.release()
    return out, fps, i0


def trova_elemento(img, roi):
    x, y, w, h = roi
    g = cv2.cvtColor(img[y:y + h, x:x + w], cv2.COLOR_BGR2GRAY).astype(np.float32)
    bg = float(np.median(g))
    m = (np.abs(g - bg) > 38).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n < 2:
        return None
    k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    bx, by, bw, bh = st[k, :4]
    pad = 4
    return tuple(int(v) for v in (x + max(0, bx - pad), y + max(0, by - pad), min(w - bx + pad, bw + 2 * pad), min(h - by + pad, bh + 2 * pad)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--k"); ap.add_argument("--n")
    ap.add_argument("--t", required=True)
    ap.add_argument("--roi", required=True, help="x,y,w,h dove sta l'elemento a riposo (ultimo fotogramma)")
    ap.add_argument("--margine", type=int, default=160)
    ap.add_argument("--voce", required=True)
    a = ap.parse_args()
    t0, t1 = (float(v) for v in a.t.split(","))
    roi = tuple(int(float(v)) for v in a.roi.split(","))
    if a.k:
        n = int(re.match(r"reel:(\d+)", a.k).group(1))
        path, desc = os.path.join(CARTELLA, INV[n]["file"]), f"Kallaway reel {n}"
    else:
        path, desc = a.n, os.path.basename(a.n)
    fr, fps, i0 = leggi(path, t0, t1)
    el = trova_elemento(fr[-1], roi)
    if el is None:
        sys.exit("elemento non trovato nella roi")
    ex, ey, ew, eh = el
    tmpl = cv2.cvtColor(fr[-1][ey:ey + eh, ex:ex + ew], cv2.COLOR_BGR2GRAY)
    M = a.margine
    ax0, ay0 = max(0, roi[0] - M), max(0, roi[1] - M)
    ax1, ay1 = min(1080, roi[0] + roi[2] + M), min(fr[0].shape[0], roi[1] + roi[3] + M)
    scales = np.round(np.arange(0.30, 1.505, 0.01), 3)
    rows = []
    prev_s = None
    for i, f in enumerate(fr):
        g = cv2.cvtColor(f[ay0:ay1, ax0:ax1], cv2.COLOR_BGR2GRAY)
        best = (-2, 0, 0, 1.0)
        cand = scales if prev_s is None else scales[np.abs(scales - prev_s) <= 0.25]
        for s in cand:
            tw, th = max(6, int(round(ew * s))), max(6, int(round(eh * s)))
            if tw >= g.shape[1] or th >= g.shape[0]:
                continue
            r = cv2.matchTemplate(g, cv2.resize(tmpl, (tw, th), interpolation=cv2.INTER_AREA), cv2.TM_CCOEFF_NORMED)
            _, mv, _, ml = cv2.minMaxLoc(r)
            if mv > best[0]:
                best = (mv, ml[0] + tw / 2 + ax0, ml[1] + th / 2 + ay0, float(s))
        score, cx, cy, s = best
        rows.append({"t": round(i / fps, 4), "score": round(float(score), 3), "cx": round(cx, 1), "cy": round(cy, 1), "scala": s})
        prev_s = s if score > 0.6 else None
    ok = [r for r in rows if r["score"] >= 0.55]
    if len(ok) < 3:
        sys.exit("tracciamento non riuscito")
    T = np.array([r["t"] for r in ok]); S = np.array([r["scala"] for r in ok])
    X = np.array([r["cx"] for r in ok]); Y = np.array([r["cy"] for r in ok])
    sf, xf, yf = float(np.median(S[-4:])), float(np.median(X[-4:])), float(np.median(Y[-4:]))
    # rimbalzo di scala: picco oltre la scala finale (dopo il primo istante a ≥ 90% della finale)
    k90 = int(np.argmax(S >= 0.9 * sf)) if np.any(S >= 0.9 * sf) else 0
    ov_s = max(0.0, float(S[k90:].max()) / sf - 1)
    # rimbalzo di posizione lungo la direzione del moto
    d0 = np.array([X[0] - xf, Y[0] - yf]); dist = float(np.hypot(*d0))
    if dist > 12:
        u = d0 / dist
        proj = (X - xf) * u[0] + (Y - yf) * u[1]          # >0 = ancora da arrivare, <0 = oltre l'arrivo
        ov_p = max(0.0, float(-proj.min()) / dist)
    else:
        ov_p = None
    # durata dell'entrata: dal primo fotogramma tracciato a quando scala e posizione restano entro il 2%
    near = (np.abs(S / sf - 1) <= 0.02) & (np.hypot(X - xf, Y - yf) <= max(3, 0.02 * max(dist, 1)))
    k_end = len(T) - 1
    for j in range(len(T)):
        if near[j:].all():
            k_end = j; break
    res = {"voce": a.voce, "sorgente": desc, "t": [t0, t1], "fps": round(fps, 3), "elemento": el,
           "scala_iniziale": round(float(S[0]), 3), "scala_finale": round(sf, 3), "rimbalzo_scala_%": round(ov_s * 100, 1),
           "spostamento_px": round(dist, 1), "rimbalzo_posizione_%": None if ov_p is None else round(ov_p * 100, 1),
           "durata_entrata_s": round(float(T[k_end] - T[0]), 3), "primo_t_tracciato": round(float(T[0]), 3), "serie": rows}
    os.makedirs(OUT, exist_ok=True)
    json.dump(res, io.open(os.path.join(OUT, a.voce + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # striscia: area a ogni fotogramma con il riquadro trovato
    cells = []
    for f, r in zip(fr, rows):
        c = f[ay0:ay1, ax0:ax1].copy()
        if r["score"] >= 0.55:
            tw, th = ew * r["scala"], eh * r["scala"]
            p0 = (int(r["cx"] - tw / 2 - ax0), int(r["cy"] - th / 2 - ay0)); p1 = (int(r["cx"] + tw / 2 - ax0), int(r["cy"] + th / 2 - ay0))
            cv2.rectangle(c, p0, p1, (80, 251, 207), 2)
        k = 150 / c.shape[1]
        c = cv2.resize(c, (150, max(20, int(c.shape[0] * k))), interpolation=cv2.INTER_AREA)
        cv2.putText(c, f"+{r['t']:.2f} s{r['scala']:.2f}", (2, 12), 0, 0.36, (255, 255, 255), 1)
        cells.append(c)
    cols = 12
    h = max(c.shape[0] for c in cells)
    cells = [np.vstack([c, np.zeros((h - c.shape[0], 150, 3), np.uint8)]) for c in cells]
    righe = [np.hstack(cells[k:k + cols] + [np.zeros((h, 150, 3), np.uint8)] * (cols - len(cells[k:k + cols]))) for k in range(0, len(cells), cols)]
    sheet = np.vstack(righe)
    lab = np.full((24, sheet.shape[1], 3), 12, np.uint8)
    ps = "-" if ov_p is None else f"{ov_p * 100:.1f}%"
    cv2.putText(lab, f"{a.voce} {desc}: scala {S[0]:.2f}->{sf:.2f} rimbalzo scala {ov_s * 100:.1f}% · spostamento {dist:.0f}px rimbalzo pos {ps} · entrata {T[k_end] - T[0]:.2f}s",
                (4, 16), 0, 0.42, (255, 255, 255), 1)
    cv2.imwrite(os.path.join(OUT, a.voce + ".jpg"), np.vstack([lab, sheet]), [cv2.IMWRITE_JPEG_QUALITY, 85])
    print(f"{a.voce}: scala {S[0]:.2f}→{sf:.2f} · rimbalzo scala {ov_s * 100:.1f}% · spostamento {dist:.0f} px · rimbalzo pos {ps} · entrata {T[k_end] - T[0]:.2f} s · score min {min(r['score'] for r in ok):.2f}")


if __name__ == "__main__":
    main()
