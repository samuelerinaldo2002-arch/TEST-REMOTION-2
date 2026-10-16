# -*- coding: utf-8 -*-
"""Deriva della camera dopo un taglio, misurata sugli elementi FERMI (non bagliori, non video interni).

    _tools/venv/Scripts/python.exe -I _tools/deriva.py --k reel:72 --t 9.333 [--dur 3] [--maschera x,y,w,h;…] [--escludi x,y,w,h;…]
    _tools/venv/Scripts/python.exe -I _tools/deriva.py --n render.mp4 --t 68.6 …          (un nostro render di prova, 30 fps)

Per ogni fotogramma dopo il taglio: trasformazione di similitudine (scala + spostamento) dal primo fotogramma pulito F0,
stimata con SIFT + RANSAC solo dentro la maschera (default: area grafica, Kallaway y 3–56%, nostra y 150–1332) e fuori dai
rettangoli esclusi (barre che si riempiono, bagliori, video). Coordinate e px sempre nello spazio 1080x1920.
--t è l'istante approssimato del taglio: si cerca il fotogramma del taglio entro ±0,15 s (salto massimo della differenza).

Uscite in CATALOGO-ANIMAZIONI/_analisi/ritmo/deriva/<voce>.jpg + .json:
  scala % (contenuto che cresce = la camera si avvicina), spostamento del centro e degli angoli in px, velocità ai tempi
  0,25 / 1 / 2 / 3 s, curva che approssima il movimento cumulato (con back.out fra le candidate), titolo misurato a parte
  (HUD fermo o nel mondo?). Il foglio mostra i fotogrammi con una griglia di punti di F0 riportata con la trasformazione:
  se i punti restano attaccati agli stessi dettagli, la misura è giusta.
"""
import argparse, io, json, os, re, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
OUT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi", "ritmo", "deriva")
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}


def _back(s):
    return lambda u: 1 + (s + 1) * (u - 1) ** 3 + s * (u - 1) ** 2


EASES = {
    "linear": lambda u: u,
    "sine.out": lambda u: np.sin(np.pi * u / 2),
    "sine.inOut": lambda u: (1 - np.cos(np.pi * u)) / 2,
    "power1.out": lambda u: 1 - (1 - u) ** 2,
    "power2.out": lambda u: 1 - (1 - u) ** 3,
    "power3.out": lambda u: 1 - (1 - u) ** 4,
    "power1.inOut": lambda u: np.where(u < .5, 2 * u * u, 1 - 2 * (1 - u) ** 2),
    "power2.inOut": lambda u: np.where(u < .5, 4 * u ** 3, 1 - 4 * (1 - u) ** 3),
    "expo.out": lambda u: 1 - 2 ** (-10 * u),
    "back.out(1)": _back(1.0),
    "back.out(1.7)": _back(1.70158),
}


def rects(s):
    return [tuple(float(v) for v in r.split(",")) for r in s.split(";") if r.strip()] if s else []


def leggi(path, t, dur, pre=0.15):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    i0 = max(0, int(round((t - pre) * fps)))
    cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
    fr, idx = [], []
    for i in range(i0, i0 + int(round((dur + 2 * pre) * fps)) + 2):
        ok, f = cap.read()
        if not ok:
            break
        if f.shape[1] != 1080:
            f = cv2.resize(f, (1080, int(round(f.shape[0] * 1080 / f.shape[1]))), interpolation=cv2.INTER_CUBIC)
        fr.append(f)
        idx.append(i)
    cap.release()
    return fr, idx, fps


def trova_taglio(fr, k_max):
    """indice del primo fotogramma dopo il taglio = salto massimo di differenza nei primi k_max"""
    g = [cv2.cvtColor(cv2.resize(f, (270, 480)), cv2.COLOR_BGR2GRAY).astype(np.float32) for f in fr[:k_max + 1]]
    d = [float(np.abs(g[i] - g[i - 1]).mean()) for i in range(1, len(g))]
    return int(np.argmax(d)) + 1, max(d)


def maschera(shape, keep, drop):
    m = np.zeros(shape[:2], np.uint8)
    for x, y, w, h in keep:
        m[int(y):int(y + h), int(x):int(x + w)] = 255
    for x, y, w, h in drop:
        m[int(y):int(y + h), int(x):int(x + w)] = 0
    return m


SIFT = cv2.SIFT_create(nfeatures=5000, contrastThreshold=0.02)
BF = cv2.BFMatcher(cv2.NORM_L2)


def feat(img, m):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return SIFT.detectAndCompute(g, m)


def _ident(A):
    return abs(np.hypot(A[0, 0], A[1, 0]) - 1) < 0.0015 and abs(A[0, 2] + (A[0, 0] - 1) * 540) < 1.5 and abs(A[1, 2]) < 1.5


def modelli(kp0, d0, img, m, k=3):
    """fino a k similitudini F0 → Fi, una dopo l'altra sui match rimasti (livelli: HUD fermo, mondo, …)"""
    kp1, d1 = feat(img, m)
    if d1 is None or d0 is None or len(kp1) < 12:
        return []
    mm = BF.knnMatch(d0, d1, k=2)
    good = [a for a, b in (p for p in mm if len(p) == 2) if a.distance < 0.75 * b.distance]
    p0 = np.float32([kp0[g.queryIdx].pt for g in good])
    p1 = np.float32([kp1[g.trainIdx].pt for g in good])
    out = []
    while len(p0) >= 10 and len(out) < k:
        A, inl = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC, ransacReprojThreshold=2.0, maxIters=4000, confidence=0.999)
        if A is None:
            break
        sel = inl.ravel() == 1
        if sel.sum() < 8:
            break
        A2, _ = cv2.estimateAffinePartial2D(p0[sel], p1[sel], method=cv2.LMEDS)
        out.append((A2 if A2 is not None else A, int(sel.sum())))
        p0, p1 = p0[~sel], p1[~sel]
    return out


def stima(kp0, d0, img, m, prev=None, livello="mondo", minimo=20):
    """similitudine F0 → Fi del livello scelto: "mondo" = il modello che si muove con più inlier (l'HUD fermo — titolo,
    griglia di sfondo — viene scartato), "tutto" = il modello con più inlier. Con prev si sceglie il più vicino alla stima
    precedente fra quelli forti (niente salti fra livelli)."""
    ms = modelli(kp0, d0, img, m)
    if not ms:
        return None, 0
    if livello == "tutto":
        return ms[0]
    tot = sum(n for _, n in ms)
    mov = [(A, n) for A, n in ms if not _ident(A) and n >= minimo]
    if not mov:
        I = np.array([[1, 0, 0], [0, 1, 0]], float)
        return I, ms[0][1]
    if prev is not None and len(mov) > 1:
        ps = np.hypot(prev[0, 0], prev[1, 0])
        mov.sort(key=lambda An: abs(np.hypot(An[0][0, 0], An[0][1, 0]) - ps) * 100 + np.hypot(*(An[0][:, 2] - prev[:, 2])) * 0.05)
    return mov[0]


def ecc(f0g, fig, m, init):
    """allineamento d'intensità (ECC, affine) F0 → Fi a metà risoluzione, solo dentro la maschera; → A 2x3 a 1080"""
    w = init.astype(np.float32).copy()
    w[:, 2] /= 2.0
    crit = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6)
    try:
        cc, w = cv2.findTransformECC(f0g, fig, w, cv2.MOTION_AFFINE, crit, m, 5)
    except cv2.error:
        return None, 0.0
    A = w.astype(np.float64).copy()
    A[:, 2] *= 2.0
    return A, float(cc)


def scomponi(A, W=1080, H=1920, cy=None):
    s = float(np.hypot(A[0, 0], A[1, 0]))
    rot = float(np.degrees(np.arctan2(A[1, 0], A[0, 0])))
    cx = W / 2
    cy = H / 2 if cy is None else cy
    c = np.array([cx, cy, 1.0])
    d = A @ c - c[:2]
    # spostamento medio degli angoli della zona grafica (zoom + pan visti come px sullo schermo)
    corners = np.array([[54, 150, 1], [1026, 150, 1], [54, 1100, 1], [1026, 1100, 1]], float)
    dc = np.linalg.norm((corners @ A.T) - corners[:, :2], axis=1).mean()
    return s, rot, float(d[0]), float(d[1]), float(dc)


def fit(y):
    u = np.linspace(0, 1, len(y))
    res = {n: float(np.sqrt(np.mean((f(u) - y) ** 2))) for n, f in EASES.items()}
    best = sorted(res.items(), key=lambda kv: kv[1])
    return best[0][0], round(best[0][1], 4), {k: round(v, 4) for k, v in best[:4]}


def txt(img, s, x, y, col=(255, 255, 255), sc=0.5, th=1):
    cv2.putText(img, s, (x, y), cv2.FONT_HERSHEY_SIMPLEX, sc, (0, 0, 0), th + 3, cv2.LINE_AA)
    cv2.putText(img, s, (x, y), cv2.FONT_HERSHEY_SIMPLEX, sc, col, th, cv2.LINE_AA)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--k")
    ap.add_argument("--n")
    ap.add_argument("--t", type=float, required=True)
    ap.add_argument("--dur", type=float, default=3.0)
    ap.add_argument("--maschera")
    ap.add_argument("--escludi")
    ap.add_argument("--titolo", help="rettangolo del titolo x,y,w,h (misurato a parte)")
    ap.add_argument("--salta", type=int, default=1, help="fotogrammi da saltare dopo il taglio prima di F0")
    ap.add_argument("--nocut", action="store_true", help="--t è già l'inizio: non cercare il taglio")
    ap.add_argument("--livello", default="mondo", choices=["mondo", "tutto"])
    ap.add_argument("--metodo", default="sift", choices=["sift", "ecc"])
    ap.add_argument("--voce", required=True)
    a = ap.parse_args()
    nostro = bool(a.n)
    if a.k:
        m = re.match(r"reel:(\d+)$", a.k)
        path = os.path.join(CARTELLA, INV[int(m.group(1))]["file"]) if m else a.k
        desc = f"Kallaway reel {m.group(1)}" if m else os.path.basename(a.k)
    else:
        path, desc = a.n, os.path.basename(a.n)
    fr, idx, fps = leggi(path, a.t, a.dur)
    if a.nocut:
        k0, salto = int(round(0.15 * fps)), 0.0
    else:
        k0, salto = trova_taglio(fr, int(round(0.3 * fps)))
    t_cut = idx[k0] / fps
    # fine: prossimo taglio (salto grande) o dur
    g = [cv2.cvtColor(cv2.resize(f, (270, 480)), cv2.COLOR_BGR2GRAY).astype(np.float32) for f in fr]
    fine = len(fr) - 1
    for i in range(k0 + 2, len(fr)):
        if float(np.abs(g[i] - g[i - 1]).mean()) > max(18.0, 0.6 * salto):
            fine = i - 1
            break
    fine = min(fine, k0 + int(round(a.dur * fps)))
    f0 = k0 + a.salta
    keep = rects(a.maschera) or ([(0, 150, 1080, 1182)] if nostro else [(0, 58, 1080, 1017)])
    drop = rects(a.escludi)
    M = maschera(fr[f0].shape, keep, drop)
    kp0, d0 = feat(fr[f0], M) if a.metodo == "sift" else (None, None)
    Mt = maschera(fr[f0].shape, rects(a.titolo), []) if a.titolo else None
    kt0, dt0 = feat(fr[f0], Mt) if a.titolo else (None, None)
    serie, A_list = [], []
    prev = None
    for i in range(f0, fine + 1):
        if a.metodo == "ecc":
            if i == f0:
                half = lambda im: cv2.GaussianBlur(cv2.resize(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), (540, im.shape[0] // 2), interpolation=cv2.INTER_AREA).astype(np.float32), (0, 0), 1.0)
                g0 = half(fr[f0]); m0 = cv2.resize(M, (540, M.shape[0] // 2), interpolation=cv2.INTER_NEAREST)
                A, n_in = np.array([[1, 0, 0], [0, 1, 0]], float), 1.0
            else:
                A, n_in = ecc(g0, half(fr[i]), m0, prev if prev is not None else np.array([[1, 0, 0], [0, 1, 0]], float))
                if A is not None and n_in < 0.80:
                    A = None
        else:
            A, n_in = stima(kp0, d0, fr[i], M, prev, a.livello) if i > f0 else (np.array([[1, 0, 0], [0, 1, 0]], float), len(kp0))
        if A is not None and i > f0:
            prev = A
        if A is None:
            serie.append(None)
            A_list.append(None)
            continue
        s, rot, dx, dy, dc = scomponi(A)
        row = {"t": round((i - f0) / fps, 4), "scala_%": round((s - 1) * 100, 3), "rot": round(rot, 3), "dx": round(dx, 2),
               "dy": round(dy, 2), "angoli_px": round(dc, 2), "inlier": n_in}
        if a.titolo and i > f0:
            At, nt = stima(kt0, dt0, fr[i], Mt, None, "tutto")
            if At is not None:
                st, _, tdx, tdy, _ = scomponi(At)
                row.update({"titolo_scala_%": round((st - 1) * 100, 3), "titolo_dx": round(tdx, 2), "titolo_dy": round(tdy, 2), "titolo_inlier": nt})
        serie.append(row)
        A_list.append(A)
    ok = [r for r in serie if r]
    T = np.array([r["t"] for r in ok])
    S = np.array([r["scala_%"] for r in ok])
    DC = np.array([r["angoli_px"] for r in ok])
    DX = np.array([r["dx"] for r in ok]); DY = np.array([r["dy"] for r in ok])

    def v_at(arr, t, w=0.25):
        sel = (T >= max(0, t - w)) & (T <= t + w)
        if sel.sum() < 3:
            return None
        p = np.polyfit(T[sel], arr[sel], 1)
        return round(float(p[0]), 2)

    # curva: spostamento degli angoli (zoom + pan in px) normalizzato sul valore finale
    yc = DC / DC[-1] if DC[-1] > 1 else DC * 0
    ease, err, top = fit(yc) if DC[-1] > 1 else ("ferma", 0, {})
    res = {"voce": a.voce, "sorgente": desc, "fps": round(fps, 3), "t_taglio": round(t_cut, 3), "f0": round(idx[f0] / fps, 3),
           "durata_misurata": round(float(T[-1]), 3), "nostro": nostro, "maschera": keep, "escludi": drop,
           "scala_finale_%": round(float(S[-1]), 2), "scala_a_1s_%": round(float(np.interp(1.0, T, S)), 2) if T[-1] >= 1 else None,
           "scala_a_2s_%": round(float(np.interp(2.0, T, S)), 2) if T[-1] >= 2 else None,
           "centro_finale_px": [round(float(DX[-1]), 1), round(float(DY[-1]), 1)],
           "angoli_finale_px": round(float(DC[-1]), 1),
           "vel_angoli_px_s": {str(t): v_at(DC, t) for t in (0.25, 1.0, 2.0, 2.75) if t <= T[-1]},
           "vel_scala_%_s": {str(t): v_at(S, t) for t in (0.25, 1.0, 2.0, 2.75) if t <= T[-1]},
           "curva": ease, "err_curva": err, "curve_vicine": top,
           "inlier_mediana": round(float(np.median([r["inlier"] for r in ok])), 3), "fotogrammi_falliti": sum(1 for r in serie if r is None),
           "serie": serie}
    if a.titolo:
        tt = [r for r in ok if "titolo_scala_%" in r]
        if tt:
            res["titolo_finale"] = {"scala_%": tt[-1]["titolo_scala_%"], "dx": tt[-1]["titolo_dx"], "dy": tt[-1]["titolo_dy"]}
    os.makedirs(OUT, exist_ok=True)
    json.dump(res, io.open(os.path.join(OUT, a.voce + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    # foglio: fotogrammi a ~6 fps con la griglia di F0 riportata + grafico
    step = max(1, int(round(fps / 6)))
    gx, gy = np.meshgrid(np.linspace(100, 980, 9), np.linspace(keep[0][1] + 40, keep[0][1] + keep[0][3] - 40, 11))
    P = np.stack([gx.ravel(), gy.ravel(), np.ones(gx.size)], 1)
    cw = 180
    cells = []
    for j, i in enumerate(range(f0, fine + 1, step)):
        A = A_list[i - f0]
        im = fr[i].copy()
        for (x, y, w, h) in drop:
            cv2.rectangle(im, (int(x), int(y)), (int(x + w), int(y + h)), (60, 60, 255), 3)
        if A is not None:
            Q = P @ A.T
            for (x0, y0), (x1, y1) in zip(P[:, :2], Q):
                cv2.circle(im, (int(x1), int(y1)), 7, (80, 251, 207), -1, cv2.LINE_AA)
                cv2.circle(im, (int(x0), int(y0)), 4, (255, 120, 0), -1, cv2.LINE_AA)
        c = cv2.resize(im, (cw, int(cw * 1920 / 1080)), interpolation=cv2.INTER_AREA)
        r = serie[i - f0]
        txt(c, f"+{(i - f0) / fps:.2f}s", 4, 16, (255, 255, 255), 0.45)
        if r:
            txt(c, f"{r['scala_%']:+.1f}%", 4, 34, (80, 251, 207), 0.45)
        cells.append(c)
    cols = 12
    rows = []
    for k in range(0, len(cells), cols):
        row = cells[k:k + cols]
        row += [np.full_like(cells[0], 20)] * (cols - len(row))
        rows.append(np.hstack(row))
    sheet = np.vstack(rows)
    W = sheet.shape[1]

    def pannello(serie_, titolo, unita):
        gh = 200
        g_ = np.full((gh, W, 3), 28, np.uint8)
        L, R, Tp, B = 60, 20, 30, 28
        tmax = max(float(T[-1]), 0.5)
        vm = max(1e-6, max(float(np.max(np.abs(a_))) for a_, _, _ in serie_) * 1.15)
        y0 = Tp + (gh - Tp - B) // 2
        cv2.line(g_, (L, y0), (W - R, y0), (70, 70, 70), 1)
        for k in range(int(tmax * 4) + 1):
            x = L + int((W - L - R) * (k / 4) / tmax)
            cv2.line(g_, (x, gh - B), (x, gh - B + 5), (120, 120, 120), 1)
            if k % 2 == 0:
                txt(g_, f"{k / 4:.1f}s", x - 12, gh - 6, (160, 160, 160), 0.4)
        for j, (arr, col, lab) in enumerate(serie_):
            pts = [(L + int((W - L - R) * t / tmax), y0 - int((gh - Tp - B) / 2 * v / vm)) for t, v in zip(T, arr)]
            cv2.polylines(g_, [np.array(pts, np.int32)], False, col, 2, cv2.LINE_AA)
            txt(g_, lab, W - 420, Tp + 14 + 18 * j, col, 0.45)
        txt(g_, f"{titolo} (scala del grafico ±{vm:.1f}{unita})", 10, 20, (230, 230, 230), 0.5)
        return g_

    g1 = pannello([(S, (80, 251, 207), f"scala {S[-1]:+.2f}% in {T[-1]:.2f}s · curva {ease} ({err})")],
                  f"{a.voce} · {desc} · taglio {t_cut:.3f}s · SCALA %", "%")
    g2 = pannello([(DX, (255, 160, 60), f"centro dx {DX[-1]:+.0f} px"), (DY, (200, 120, 255), f"centro dy {DY[-1]:+.0f} px"),
                   (DC, (80, 251, 207), f"angoli {DC[-1]:.0f} px")], "SPOSTAMENTO px (1080)", " px")
    gimg = np.vstack([g1, g2])
    # verifica: F0 (rosso) + Fi riportato indietro con l'inversa (verde) → ciò che la misura segue diventa giallo
    ver = []
    y0k, y1k = int(keep[0][1]), int(keep[0][1] + keep[0][3])
    for tq in (0.5, 1.5, float(T[-1])):
        jj = int(np.argmin(np.abs(T - tq)))
        ii = f0 + int(round(T[jj] * fps))
        A = A_list[ii - f0]
        if A is None:
            continue
        Ai = cv2.invertAffineTransform(A)
        back = cv2.warpAffine(fr[ii], Ai, (1080, 1920))
        mix = np.zeros((1920, 1080, 3), np.uint8)
        mix[..., 2] = cv2.cvtColor(fr[f0], cv2.COLOR_BGR2GRAY)
        mix[..., 1] = cv2.cvtColor(back, cv2.COLOR_BGR2GRAY)
        c = mix[y0k:y1k]
        c = cv2.resize(c, (W // 3, int(c.shape[0] * (W // 3) / 1080)), interpolation=cv2.INTER_AREA)
        txt(c, f"verifica a +{T[jj]:.2f}s: giallo = segue la misura", 8, 20, (255, 255, 255), 0.5)
        ver.append(c)
    if ver:
        hh = max(v.shape[0] for v in ver)
        ver = [np.vstack([v, np.zeros((hh - v.shape[0], v.shape[1], 3), np.uint8)]) for v in ver]
        vrow = np.hstack(ver)
        vrow = np.hstack([vrow, np.zeros((hh, W - vrow.shape[1], 3), np.uint8)]) if vrow.shape[1] < W else vrow[:, :W]
        gimg = np.vstack([gimg, vrow])
    # verifica compatta (per i fogli riassuntivi): primo, ultimo, sovrapposizione all'ultimo
    try:
        jj = len(A_list) - 1
        while jj > 0 and A_list[jj] is None:
            jj -= 1
        A = A_list[jj]
        back = cv2.warpAffine(fr[f0 + jj], cv2.invertAffineTransform(A), (1080, 1920))
        mix = np.zeros((1920, 1080, 3), np.uint8)
        mix[..., 2] = cv2.cvtColor(fr[f0], cv2.COLOR_BGR2GRAY)
        mix[..., 1] = cv2.cvtColor(back, cv2.COLOR_BGR2GRAY)
        pan_ = []
        for im in (fr[f0].copy(), fr[f0 + jj].copy(), mix):
            for (x, y, w, h) in keep:
                cv2.rectangle(im, (int(x), int(y)), (int(x + w), int(y + h)), (255, 200, 0), 4)
            for (x, y, w, h) in drop:
                cv2.rectangle(im, (int(x), int(y)), (int(x + w), int(y + h)), (60, 60, 255), 4)
            pan_.append(cv2.resize(im[0:1150], (300, 320), interpolation=cv2.INTER_AREA))
        cv = np.hstack(pan_)
        lab = np.full((40, cv.shape[1], 3), 12, np.uint8)
        txt(lab, f"{a.voce}: scala {S[-1]:+.1f}% in {T[-1]:.2f}s, centro ({DX[-1]:+.0f},{DY[-1]:+.0f}) px", 4, 16, (255, 255, 255), 0.42)
        txt(lab, f"curva {ease} · v angoli {res['vel_angoli_px_s']}", 4, 34, (200, 200, 200), 0.36)
        cv2.imwrite(os.path.join(OUT, a.voce + "_v.jpg"), np.vstack([lab, cv]), [cv2.IMWRITE_JPEG_QUALITY, 85])
    except Exception as ex:
        print("verifica compatta non riuscita:", ex)
    out = np.vstack([sheet, gimg])
    if out.shape[1] > 2200:
        k = 2200 / out.shape[1]
        out = cv2.resize(out, (2200, int(out.shape[0] * k)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(os.path.join(OUT, a.voce + ".jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 86])
    print(f"{a.voce}: taglio {t_cut:.3f}s · misurati {T[-1]:.2f}s · scala {S[-1]:+.2f}% (1 s {res['scala_a_1s_%']}, 2 s {res['scala_a_2s_%']}) · "
          f"centro ({DX[-1]:+.0f}, {DY[-1]:+.0f}) px · angoli {DC[-1]:.0f} px · vel. angoli {res['vel_angoli_px_s']} px/s · curva {ease} {err} "
          f"· inlier {res['inlier_mediana']} · falliti {res['fotogrammi_falliti']}" + (f" · titolo {res.get('titolo_finale')}" if a.titolo else ""))


if __name__ == "__main__":
    main()
