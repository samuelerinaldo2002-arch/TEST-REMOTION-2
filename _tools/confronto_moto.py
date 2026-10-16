# -*- coding: utf-8 -*-
"""Confronto di MOVIMENTO: striscia di Kallaway sopra, la nostra sotto, alla stessa frequenza, + profilo di movimento.

    _tools/venv/Scripts/python.exe -I _tools/confronto_moto.py --k K11 --n CATALOGO-ANIMAZIONI/demo-3 --nt 4.0,6.6
    _tools/venv/Scripts/python.exe -I _tools/confronto_moto.py --k K11:2 --kt 2.0,4.0 --n render.mp4 --nt 10,12 --fps 15

Kallaway (--k):
  ID di catalogo (K11 = primo riferimento, K11:2 = secondo) → reel originale e tempi da catalogo.json (--kt li sostituisce),
  oppure reel:61 con --kt t0,t1, oppure il percorso di un video con --kt.
Nostra (--n): un video (render di prova) oppure la cartella di una composizione (reel/demo/lab: usa composition/index.html):
  in quel caso i fotogrammi si catturano con `hyperframes snapshot --at` negli istanti esatti, a 30 fps (cache in _analisi/moto/_snap).
Opzioni: --fps (strisce, 15) · --cols (celle per riga, 15) · --cw (larghezza cella, 150) · --zk / --zn x,y,w,h (ritaglio nello
spazio 1080x1920, default = area grafica: Kallaway y 3–56%, nostra y 150–1385) · --voce (etichetta) · --out · --json

Uscita: CATALOGO-ANIMAZIONI/_analisi/moto/<voce>.jpg (+ .json) e, a terminale, il confronto dei numeri:
  moto locale = differenza tra fotogrammi consecutivi (al secondo) nell'area ritagliata · camera = traslazione+zoom stimati
  (optical flow, px/s a 1080) · inizio/picco/fine = 15% del picco · colpi = gruppi separati sopra il 35% del picco ·
  curva = cubic-bezier che approssima il movimento cumulato tra inizio e fine (come _tools/curve.py).
Verdetto: durata entro ±15%, stessi colpi, curva cumulata entro 0,06 di scarto quadratico.
"""
import argparse, hashlib, io, json, os, re, shutil, subprocess, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
CAT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI")
OUT = os.path.join(CAT, "_analisi", "moto")
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
HF = "npx --yes hyperframes@0.8.138"
AW = 270  # larghezza di analisi (px)

BG = (24, 24, 24)
CK = (235, 235, 235)   # colore Kallaway nei grafici (bianco)
CN = (80, 251, 207)    # colore nostro (lime, BGR)


# ─── sorgenti ────────────────────────────────────────────────────────────────────────────────
def sorgente_k(spec, kt):
    """→ (percorso video, t0, t1, descrizione)"""
    if os.path.exists(spec):
        t0, t1 = kt
        return spec, t0, t1, os.path.basename(spec)
    m = re.match(r"reel:(\d+)$", spec)
    if m:
        n = int(m.group(1))
        return os.path.join(CARTELLA, INV[n]["file"]), kt[0], kt[1], f"reel {n}"
    m = re.match(r"([A-Z]\d\d)(?::(\d))?$", spec)
    if not m:
        sys.exit("--k: ID di catalogo (K11, K11:2), reel:N o percorso di un video")
    voci = {v["id"]: v for v in json.load(io.open(os.path.join(CAT, "catalogo.json"), encoding="utf-8"))["voci"]}
    v = voci[m.group(1)]
    r = v["rif"][int(m.group(2) or 1) - 1]
    t0, t1 = kt if kt else (r["t0"], r["t1"])
    return os.path.join(CARTELLA, INV[r["n"]]["file"]), t0, t1, f"{v['id']} reel {r['n']}"


def leggi_video(path, t0, t1):
    """fotogrammi nativi tra t0 e t1 → (lista BGR, tempi assoluti, fps)"""
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    i0, i1 = int(round(t0 * fps)), int(round(t1 * fps))
    cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
    frames, times = [], []
    for i in range(i0, i1 + 1):
        ok, fr = cap.read()
        if not ok:
            break
        frames.append(fr)
        times.append(i / fps)
    cap.release()
    if not frames:
        sys.exit(f"nessun fotogramma letto da {path} ({t0}–{t1} s)")
    return frames, times, fps


def comp_dir(p):
    p = os.path.abspath(p)
    if os.path.exists(os.path.join(p, "composition", "index.html")):
        return os.path.join(p, "composition")
    if os.path.exists(os.path.join(p, "index.html")):
        return p
    sys.exit(f"--n: {p} non è un video né una composizione (manca index.html)")


def _num(f):
    return int(re.match(r"frame-(\d+)", f).group(1))


def leggi_comp(path, t0, t1, fps=30):
    """cattura la composizione negli istanti esatti t0 + k/fps (cache per contenuto + tempi)"""
    cd = comp_dir(path)
    idx = os.path.join(cd, "index.html")
    n = int(round((t1 - t0) * fps)) + 1
    times = [round(t0 + k / fps, 4) for k in range(n)]
    key = hashlib.sha1(open(idx, "rb").read() + ",".join(map(str, times)).encode()).hexdigest()[:16]
    sd = os.path.join(OUT, "_snap", key)
    pngs = sorted([f for f in os.listdir(sd) if f.startswith("frame-") and f.endswith(".png")], key=_num) if os.path.isdir(sd) else []
    if len(pngs) != n:
        if os.path.isdir(sd):
            shutil.rmtree(sd)
        os.makedirs(sd, exist_ok=True)
        print(f"   snapshot di {n} fotogrammi ({t0}–{t1} s a {fps} fps) da {os.path.relpath(cd, CARTELLA)} …")
        # a blocchi: la riga di comando di Windows ha un limite di lunghezza
        for b in range(0, n, 60):
            chunk = times[b:b + 60]
            tmp = os.path.join(sd, f"_b{b:04d}")
            r = subprocess.run(f'{HF} snapshot --at {",".join(f"{t:.4f}" for t in chunk)} --no-end --describe false -o "{tmp}"',
                               shell=True, cwd=cd, capture_output=True, text=True, encoding="utf-8", errors="replace")
            got = sorted([f for f in os.listdir(tmp) if f.startswith("frame-") and f.endswith(".png")], key=_num) if os.path.isdir(tmp) else []
            if len(got) != len(chunk):
                print(r.stdout[-2000:], r.stderr[-2000:])
                sys.exit("snapshot non riuscito")
            for k, f in enumerate(got):
                os.replace(os.path.join(tmp, f), os.path.join(sd, f"frame-{b + k:04d}.png"))
            shutil.rmtree(tmp, ignore_errors=True)
        pngs = sorted([f for f in os.listdir(sd) if f.startswith("frame-") and f.endswith(".png")], key=_num)
    frames = [cv2.imread(os.path.join(sd, f)) for f in pngs]
    return frames, times, float(fps)


# ─── misure ──────────────────────────────────────────────────────────────────────────────────
def ritaglio(fr, z):
    """z = (x, y, w, h) nello spazio 1080x1920"""
    H, W = fr.shape[:2]
    k = W / 1080.0
    x, y, w, h = z
    return fr[int(y * k):int((y + h) * k), int(x * k):int((x + w) * k)]


def grigio(fr):
    h = int(round(AW * fr.shape[0] / fr.shape[1]))
    g = cv2.cvtColor(cv2.resize(fr, (AW, max(8, h)), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
    return cv2.medianBlur(g, 3)


def profilo(frames, times, z):
    """→ tempi (relativi al primo), moto locale al secondo, velocità di camera px/s"""
    G = [grigio(ritaglio(f, z)) for f in frames]
    k1080 = z[2] / AW  # px di analisi → px a 1080
    loc, camv, tagli = [0.0], [0.0], []
    lk = dict(winSize=(21, 21), maxLevel=4, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 20, 0.03))
    for i in range(1, len(G)):
        dt = max(1e-3, times[i] - times[i - 1])
        d = cv2.absdiff(G[i], G[i - 1]).astype(np.float32)
        # taglio di scena: tanta differenza e istogramma cambiato → si segna e si esclude dalle misure
        h0 = cv2.calcHist([G[i - 1]], [0], None, [32], [0, 256]).ravel(); h0 /= h0.sum() + 1e-9
        h1 = cv2.calcHist([G[i]], [0], None, [32], [0, 256]).ravel(); h1 /= h1.sum() + 1e-9
        dm, hi = float(d.mean()), float(np.minimum(h0, h1).sum())
        # candidato taglio: tanta differenza; diventa taglio solo se isolato (i vicini hanno meno della metà del suo moto)
        dp = float(cv2.absdiff(G[i - 1], G[i - 2]).mean()) if i >= 2 else 0.0
        dn = float(cv2.absdiff(G[i + 1], G[i]).mean()) if i + 1 < len(G) else 0.0
        if ((dm > 14 and hi < 0.88) or dm > 30) and dp < 0.5 * dm and dn < 0.5 * dm:
            tagli.append(times[i] - times[0])
            loc.append(0.0)
            camv.append(0.0)
            continue
        d[d < 6] = 0  # rumore di compressione
        loc.append(float(d.mean()) / dt)
        v = 0.0
        pts = cv2.goodFeaturesToTrack(G[i - 1], maxCorners=300, qualityLevel=0.01, minDistance=5, blockSize=5)
        if pts is not None and len(pts) >= 10:
            nxt, st, _ = cv2.calcOpticalFlowPyrLK(G[i - 1], G[i], pts, None, **lk)
            good = st.ravel() == 1
            if good.sum() >= 10:
                M, inl = cv2.estimateAffinePartial2D(pts[good], nxt[good], method=cv2.RANSAC, ransacReprojThreshold=1.2, maxIters=400)
                if M is not None and inl is not None and inl.sum() >= 12:
                    s = float(np.hypot(M[0, 0], M[1, 0]))
                    cx, cy = G[i].shape[1] / 2, G[i].shape[0] / 2
                    tx = (M[0, 0] * cx + M[0, 1] * cy + M[0, 2] - cx) * k1080
                    ty = (M[1, 0] * cx + M[1, 1] * cy + M[1, 2] - cy) * k1080
                    v = (float(np.hypot(tx, ty)) + abs(np.log(max(s, 1e-3))) * 900) / dt
        camv.append(v)
    t = np.array(times) - times[0]
    return t, np.array(loc), np.array(camv), tagli


def liscia(a):
    if len(a) < 3:
        return a.copy()
    b = np.convolve(np.pad(a, 1, mode="edge"), np.ones(3) / 3, mode="valid")
    return b


# griglia di cubic-bezier (come curve.py, vettoriale: 0,1 poi raffinata a 0,025)
_XS = np.linspace(0, 1, 41)
_T = np.linspace(0, 1, 160)


def _curve(P):
    x1, y1, x2, y2 = (P[:, i:i + 1] for i in range(4))
    T = _T[None, :]
    bx = 3 * (1 - T) ** 2 * T * x1 + 3 * (1 - T) * T ** 2 * x2 + T ** 3
    by = 3 * (1 - T) ** 2 * T * y1 + 3 * (1 - T) * T ** 2 * y2 + T ** 3
    ok = np.all(np.diff(bx, axis=1) >= -1e-9, axis=1)
    out = np.full((len(P), len(_XS)), np.nan)
    for i in np.where(ok)[0]:
        out[i] = np.interp(_XS, bx[i], by[i])
    return out


def fit_bezier(y):
    g = np.round(np.arange(0, 1.0001, 0.1), 3)
    P = np.array(np.meshgrid(g, np.arange(-0.2, 1.4001, 0.1), g, np.arange(-0.2, 1.4001, 0.1), indexing="ij")).reshape(4, -1).T
    C = _curve(P)
    e = np.sqrt(np.nanmean((C - y) ** 2, axis=1))
    e[np.isnan(C).any(axis=1)] = 9
    b = P[int(np.argmin(e))]
    d = np.arange(-0.1, 0.1001, 0.025)
    Q = np.array(np.meshgrid(*[np.clip(b[i] + d, 0 if i % 2 == 0 else -0.5, 1 if i % 2 == 0 else 1.6) for i in range(4)], indexing="ij")).reshape(4, -1).T
    C2 = _curve(Q)
    e2 = np.sqrt(np.nanmean((C2 - y) ** 2, axis=1))
    e2[np.isnan(C2).any(axis=1)] = 9
    k = int(np.argmin(e2))
    return [round(float(v), 3) for v in Q[k]], round(float(e2[k]), 4)


def statistiche(t, v, nome):
    v = np.asarray(v, float)
    s = liscia(v)
    pk = float(s.max()) if len(s) else 0.0
    if pk <= 1e-6:
        return {"nome": nome, "picco": 0.0, "vuoto": True}
    on = s > 0.15 * pk
    i_on = np.where(on)[0]
    i0, i1 = int(i_on[0]), int(i_on[-1])
    # colpi: gruppi sopra il 35% del picco separati da almeno 2 fotogrammi sotto
    hi = s > 0.35 * pk
    colpi, gap, dentro = 0, 99, False
    for h in hi:
        if h and not dentro:
            if gap >= 2 or colpi == 0:
                colpi += 1
            dentro = True
            gap = 0
        elif not h:
            dentro = False
            gap += 1
    cum = np.concatenate([[0], np.cumsum(v[i0 + 1:i1 + 1])]) if i1 > i0 else np.array([0, 1.0])
    cum = cum / cum[-1] if cum[-1] > 0 else cum
    yc = np.interp(_XS, np.linspace(0, 1, len(cum)), cum)
    bz, err = fit_bezier(yc)
    return {"nome": nome, "picco": round(pk, 1), "t_picco": round(float(t[int(np.argmax(s))]), 3), "inizio": round(float(t[i0]), 3),
            "fine": round(float(t[i1]), 3), "durata": round(float(t[i1] - t[i0]), 3), "attacco": round(float(t[int(np.argmax(s))] - t[i0]), 3),
            "colpi": colpi, "bezier": bz, "err_bezier": err, "cumulata": [round(float(x), 3) for x in yc]}


def verdetto(a, b):
    """a = Kallaway, b = nostro (stessa metrica)"""
    if a.get("vuoto") or b.get("vuoto"):
        return {"ok": False, "nota": "metrica vuota"}
    dd = (b["durata"] - a["durata"]) / max(1e-3, a["durata"])
    da = (b["attacco"] - a["attacco"]) / max(0.05, a["attacco"])
    rms = float(np.sqrt(np.mean((np.array(a["cumulata"]) - np.array(b["cumulata"])) ** 2)))
    ok_d, ok_c, ok_k = abs(dd) <= 0.15, rms <= 0.06, a["colpi"] == b["colpi"]
    return {"durata_%": round(dd * 100, 1), "attacco_%": round(da * 100, 1), "rms_curva": round(rms, 3),
            "ok_durata": ok_d, "ok_curva": ok_c, "ok_colpi": ok_k, "ok": ok_d and ok_c and ok_k}


# ─── disegno ─────────────────────────────────────────────────────────────────────────────────
def txt(img, s, x, y, col=(255, 255, 255), sc=0.45, th=1):
    cv2.putText(img, s, (x, y), cv2.FONT_HERSHEY_SIMPLEX, sc, (0, 0, 0), th + 3, cv2.LINE_AA)
    cv2.putText(img, s, (x, y), cv2.FONT_HERSHEY_SIMPLEX, sc, col, th, cv2.LINE_AA)


def cella(fr, z, cw):
    c = ritaglio(fr, z)
    h = int(round(cw * c.shape[0] / c.shape[1]))
    return cv2.resize(c, (cw, h), interpolation=cv2.INTER_AREA)


def pick(times, t):
    return int(np.argmin(np.abs(np.array(times) - t)))


def grafico(w, h, serie, titolo, tmax, unit="", norm=True, marks=()):
    """serie: [(t, v, colore, etichetta)]"""
    g = np.full((h, w, 3), 30, np.uint8)
    L, R, T, B = 46, 14, 26, 24
    cv2.rectangle(g, (L, T), (w - R, h - B), (60, 60, 60), 1)
    txt(g, titolo, 8, 17, (220, 220, 220), 0.45)
    vmax = max([float(np.max(v)) for _, v, _, _ in serie if len(v)] + [1e-6])
    for k in range(0, int(tmax * 10) + 1, 2 if tmax < 2.5 else 5):
        x = L + int((w - L - R) * (k / 10) / tmax)
        cv2.line(g, (x, h - B), (x, h - B + 4), (120, 120, 120), 1)
        txt(g, f"{k / 10:.1f}", x - 10, h - 6, (150, 150, 150), 0.34)
    for (t, v, col, lab), off in zip(serie, range(len(serie))):
        if not len(v):
            continue
        m = float(np.max(v)) if norm else vmax
        pts = [(L + int((w - L - R) * min(tt, tmax) / tmax), h - B - int((h - T - B) * (vv / max(m, 1e-6)))) for tt, vv in zip(t, v)]
        cv2.polylines(g, [np.array(pts, np.int32)], False, col, 2, cv2.LINE_AA)
        txt(g, lab, w - R - 260, T + 16 + off * 16, col, 0.4)
    for (tt, col) in marks:
        x = L + int((w - L - R) * min(tt, tmax) / tmax)
        cv2.line(g, (x, T), (x, h - B), col, 1, cv2.LINE_AA)
    if not norm:
        txt(g, f"{vmax:.0f}{unit}", 4, T + 10, (150, 150, 150), 0.34)
    return g


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--k", required=True)
    ap.add_argument("--kt")
    ap.add_argument("--n", required=True)
    ap.add_argument("--nt", required=True)
    ap.add_argument("--fps", type=float, default=15)
    ap.add_argument("--cols", type=int, default=15)
    ap.add_argument("--cw", type=int, default=150)
    ap.add_argument("--zk")
    ap.add_argument("--zn")
    ap.add_argument("--voce")
    ap.add_argument("--out")
    ap.add_argument("--json")
    a = ap.parse_args()
    kt = tuple(float(x) for x in a.kt.split(",")) if a.kt else None
    nt = tuple(float(x) for x in a.nt.split(","))
    kp, k0, k1, kdesc = sorgente_k(a.k, kt)
    KF, KT, Kfps = leggi_video(kp, k0, k1)
    if os.path.isdir(a.n):
        NF, NT, Nfps = leggi_comp(a.n, nt[0], nt[1])
        ndesc = os.path.basename(os.path.abspath(a.n).rstrip("\\/"))
    else:
        NF, NT, Nfps = leggi_video(a.n, nt[0], nt[1])
        ndesc = os.path.basename(a.n)
    zk = tuple(float(x) for x in a.zk.split(",")) if a.zk else (0, 0.03 * 1920, 1080, 0.53 * 1920)
    zn = tuple(float(x) for x in a.zn.split(",")) if a.zn else (0, 150, 1080, 1235)
    voce = a.voce or (a.k if re.match(r"[A-Z]\d\d", a.k) else "confronto")

    # profili
    tk, lk_, ck_, tgk = profilo(KF, KT, zk)
    tn, ln_, cn_, tgn = profilo(NF, NT, zn)
    S = {"kallaway": {"locale": statistiche(tk, lk_, "locale"), "camera": statistiche(tk, ck_, "camera")},
         "nostro": {"locale": statistiche(tn, ln_, "locale"), "camera": statistiche(tn, cn_, "camera")}}
    V = {m: verdetto(S["kallaway"][m], S["nostro"][m]) for m in ("locale", "camera")}

    # strisce alla stessa frequenza
    dur = max(KT[-1] - KT[0], NT[-1] - NT[0])
    n = int(dur * a.fps) + 1
    cw, cols = a.cw, a.cols
    ck0 = cella(KF[0], zk, cw)
    cn0 = cella(NF[0], zn, cw)
    hk, hn = ck0.shape[0], cn0.shape[0]
    LM = 30
    righe = []
    for c0 in range(0, n, cols):
        rk = np.full((hk, LM + cols * (cw + 3), 3), 22, np.uint8)
        rn = np.full((hn, LM + cols * (cw + 3), 3), 22, np.uint8)
        txt(rk, "K", 8, hk // 2 + 6, CK, 0.6, 2)
        txt(rn, "N", 8, hn // 2 + 6, CN, 0.6, 2)
        for j in range(cols):
            i = c0 + j
            if i >= n:
                break
            t = i / a.fps
            x = LM + j * (cw + 3)
            if t <= KT[-1] - KT[0] + 1e-6:
                im = cella(KF[pick(KT, KT[0] + t)], zk, cw)
                rk[:im.shape[0], x:x + cw] = im[:hk]
            if t <= NT[-1] - NT[0] + 1e-6:
                im = cella(NF[pick(NT, NT[0] + t)], zn, cw)
                rn[:im.shape[0], x:x + cw] = im[:hn]
            for tg, rr in ((tgk, rk), (tgn, rn)):
                if any(abs(tg_ - t) < 0.5 / a.fps for tg_ in tg):
                    cv2.rectangle(rr, (x, 0), (x + cw - 1, rr.shape[0] - 1), (60, 60, 255), 3)
                    txt(rr, "TAGLIO", x + 4, rr.shape[0] - 8, (90, 90, 255), 0.42)
            txt(rk, f"+{t:.2f}", x + 3, 14, (255, 255, 255), 0.4)
            txt(rn, f"+{t:.2f}", x + 3, 14, (255, 255, 255), 0.4)
        righe += [rk, np.full((3, rk.shape[1], 3), 22, np.uint8), rn, np.full((14, rk.shape[1], 3), 10, np.uint8)]
    W = righe[0].shape[1]
    head = np.full((58, W, 3), 12, np.uint8)
    txt(head, f"{voce} · MOVIMENTO · strisce a {a.fps:g} fps", 10, 22, (255, 255, 255), 0.6, 1)
    txt(head, f"K = Kallaway {kdesc} {k0:.2f}-{k1:.2f}s ({Kfps:.0f} fps)   N = nostro {ndesc} {nt[0]:.2f}-{nt[1]:.2f}s ({Nfps:.0f} fps)", 10, 46, (200, 200, 200), 0.45)
    tmax = max(tk[-1], tn[-1], 0.1)
    gw = W // 3
    sl, sc_ = S["kallaway"]["locale"], S["nostro"]["locale"]
    mk = lambda s, col: [(s["inizio"], col), (s["fine"], col)] if not s.get("vuoto") else []
    g1 = grafico(gw, 210, [(tk, liscia(lk_), CK, f"K picco {sl.get('t_picco', 0):.2f}s colpi {sl.get('colpi', 0)}"), (tn, liscia(ln_), CN, f"N picco {sc_.get('t_picco', 0):.2f}s colpi {sc_.get('colpi', 0)}")],
                 "moto locale (normalizzato)", tmax, marks=mk(sl, (150, 150, 150)) + mk(sc_, (60, 180, 150)) + [(x, (60, 60, 255)) for x in tgk + tgn])
    kc, nc = S["kallaway"]["camera"], S["nostro"]["camera"]
    g2 = grafico(gw, 210, [(tk, liscia(ck_), CK, f"K max {kc.get('picco', 0):.0f} px/s"), (tn, liscia(cn_), CN, f"N max {nc.get('picco', 0):.0f} px/s")],
                 "camera px/s (stessa scala)", tmax, " px/s", norm=False, marks=[(x, (60, 60, 255)) for x in tgk + tgn])
    g3 = np.full((210, W - 2 * gw, 3), 30, np.uint8)
    L3, T3 = 40, 26
    pw, ph = g3.shape[1] - L3 - 16, 210 - T3 - 26
    cv2.rectangle(g3, (L3, T3), (L3 + pw, T3 + ph), (60, 60, 60), 1)
    txt(g3, "curva cumulata (inizio->fine)", 8, 17, (220, 220, 220), 0.45)
    for s, col, lab, off in ((sl, CK, "K", 0), (sc_, CN, "N", 1)):
        if s.get("vuoto"):
            continue
        pts = [(L3 + int(pw * x), T3 + ph - int(ph * y)) for x, y in zip(_XS, s["cumulata"])]
        cv2.polylines(g3, [np.array(pts, np.int32)], False, col, 2, cv2.LINE_AA)
        b = s["bezier"]
        txt(g3, f"{lab} {s['durata']:.2f}s bez({b[0]:.2f},{b[1]:.2f},{b[2]:.2f},{b[3]:.2f})", L3 + 6, T3 + 16 + off * 16, col, 0.38)
    plots = np.hstack([g1, g2, g3])
    foot = np.full((62, W, 3), 12, np.uint8)
    for r, m in enumerate(("locale", "camera")):
        v = V[m]
        if "durata_%" in v:
            s = f"{m:7s} durata {v['durata_%']:+.0f}% {'OK' if v['ok_durata'] else 'NO'} | attacco {v['attacco_%']:+.0f}% | colpi K{S['kallaway'][m]['colpi']} N{S['nostro'][m]['colpi']} {'OK' if v['ok_colpi'] else 'NO'} | curva rms {v['rms_curva']:.3f} {'OK' if v['ok_curva'] else 'NO'}"
        else:
            s = f"{m:7s} {v.get('nota', '')}"
        txt(foot, s, 10, 22 + r * 24, CN if v.get("ok") else (120, 160, 255), 0.5)
    sheet = np.vstack([head] + righe + [plots, foot])
    os.makedirs(OUT, exist_ok=True)
    out = a.out or os.path.join(OUT, f"{voce}.jpg")
    cv2.imwrite(out, sheet, [cv2.IMWRITE_JPEG_QUALITY, 88])
    res = {"voce": voce, "kallaway": {"sorgente": kdesc, "t": [k0, k1], "fps": Kfps, "tagli": [round(x, 3) for x in tgk]},
           "nostro": {"sorgente": ndesc, "t": list(nt), "fps": Nfps, "tagli": [round(x, 3) for x in tgn]},
           "misure": {w: {m: {k: v for k, v in S[w][m].items() if k != "cumulata"} for m in S[w]} for w in S}, "verdetto": V}
    jp = a.json or os.path.splitext(out)[0] + ".json"
    json.dump(res, io.open(jp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{voce}: {os.path.relpath(out, CARTELLA)}" + (f" · tagli K {[round(x, 2) for x in tgk]}" if tgk else "") + (f" · tagli N {[round(x, 2) for x in tgn]}" if tgn else ""))
    for m in ("locale", "camera"):
        a_, b_ = S["kallaway"][m], S["nostro"][m]
        if a_.get("vuoto") or b_.get("vuoto"):
            print(f"  {m}: metrica vuota (K {'vuota' if a_.get('vuoto') else 'ok'}, N {'vuota' if b_.get('vuoto') else 'ok'})")
            continue
        v = V[m]
        print(f"  {m:7s} K: inizio {a_['inizio']:.2f} picco {a_['t_picco']:.2f} fine {a_['fine']:.2f} durata {a_['durata']:.2f} colpi {a_['colpi']} bez {a_['bezier']}")
        print(f"  {'':7s} N: inizio {b_['inizio']:.2f} picco {b_['t_picco']:.2f} fine {b_['fine']:.2f} durata {b_['durata']:.2f} colpi {b_['colpi']} bez {b_['bezier']}")
        print(f"  {'':7s} → durata {v['durata_%']:+.0f}% · attacco {v['attacco_%']:+.0f}% · colpi {'uguali' if v['ok_colpi'] else 'diversi'} · curva rms {v['rms_curva']:.3f} · {'OK' if v['ok'] else 'da rivedere'}")


if __name__ == "__main__":
    main()
