# -*- coding: utf-8 -*-
"""Motion forensics sui 150 reel di Kallaway: tagli, layout, camera (pan/zoom), motion blur, animazioni locali.

    _tools/venv/Scripts/python.exe -I _tools/analisi_movimento.py misura [filtro]   # metriche per fotogramma
    _tools/venv/Scripts/python.exe -I _tools/analisi_movimento.py eventi            # eventi + statistiche

Uscite in CATALOGO-ANIMAZIONI/_analisi/: metriche/<codice>.npz (una riga per fotogramma) e, con `eventi`,
eventi.json (tagli, layout, movimenti di camera con durata/easing stimato, blur) + statistiche.json.

Fasce misurate su 1080x1920 (riferimento: fotogrammi calibrati):
  grafica   y 3-56%   (titolo + area grafica)
  sottotit. y 57-67%  (parola singola)
  facecam   y 74-100% (card arrotondata, margini laterali ~6%)
"""
import io, json, os, sys, glob, math
import numpy as np
import cv2
from multiprocessing import Pool

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
OUT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi")
MET = os.path.join(OUT, "metriche")
W, H = 360, 640           # analysis resolution = 1/3 of 1080x1920
K = 1080 / W              # analysis px -> full-res px
GY0, GY1 = int(0.03 * H), int(0.56 * H)
SY0, SY1 = int(0.57 * H), int(0.67 * H)
FY0 = int(0.74 * H)
MX = int(0.035 * W)       # side margins of the facecam band
COLS = ["lt", "nb", "nw", "mstd", "mlum", "dtop", "dall", "dsub", "dcam", "hist", "shp",
        "tx", "ty", "sc", "rot", "inl", "trk", "loc"]


def reels():
    inv = json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
    return [(r["codice"], os.path.join(CARTELLA, r["file"])) for r in inv]


def misura_uno(args):
    codice, path = args
    dest = os.path.join(MET, codice + ".npz")
    if os.path.exists(dest):
        return codice, "gia'"
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    rows, prev, prevh = [], None, None
    lk = dict(winSize=(21, 21), maxLevel=4, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 20, 0.03))
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        g = cv2.cvtColor(cv2.resize(fr, (W, H), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
        top = g[GY0:GY1]
        lt = float(top.mean())
        nb = float((top < 40).mean())
        nw = float((top > 200).mean())
        marg = np.concatenate([g[int(0.80 * H):int(0.95 * H), :MX].ravel(), g[int(0.80 * H):int(0.95 * H), W - MX:].ravel()])
        mstd, mlum = float(marg.std()), float(marg.mean())
        h = cv2.calcHist([g], [0], None, [32], [0, 256]).ravel()
        h /= h.sum() + 1e-9
        shp = float(cv2.Laplacian(top, cv2.CV_32F).var())
        r = dict(lt=lt, nb=nb, nw=nw, mstd=mstd, mlum=mlum, shp=shp, dtop=0.0, dall=0.0, dsub=0.0, dcam=0.0, hist=1.0,
                 tx=0.0, ty=0.0, sc=1.0, rot=0.0, inl=0.0, trk=0.0, loc=0.0)
        if prev is not None:
            d = cv2.absdiff(g, prev)
            r["dtop"] = float(d[GY0:GY1].mean())
            r["dall"] = float(d.mean())
            r["dsub"] = float(d[SY0:SY1].mean())
            r["dcam"] = float(d[FY0:].mean())
            r["hist"] = float(np.minimum(h, prevh).sum())   # histogram intersection (1 = same)
            ptop = prev[GY0:GY1]
            pts = cv2.goodFeaturesToTrack(ptop, maxCorners=300, qualityLevel=0.01, minDistance=6, blockSize=5)
            if pts is not None and len(pts) >= 8:
                nxt, st, _ = cv2.calcOpticalFlowPyrLK(ptop, top, pts, None, **lk)
                good = st.ravel() == 1
                r["trk"] = float(good.sum())
                if good.sum() >= 8:
                    M, inl = cv2.estimateAffinePartial2D(pts[good], nxt[good], method=cv2.RANSAC, ransacReprojThreshold=1.5, maxIters=500)
                    if M is not None:
                        s = math.hypot(M[0, 0], M[1, 0])
                        r["sc"], r["rot"] = s, math.degrees(math.atan2(M[1, 0], M[0, 0]))
                        # translation measured at the band centre, in full-res px/frame
                        cx, cy = W / 2, (GY1 - GY0) / 2
                        r["tx"] = float((M[0, 0] * cx + M[0, 1] * cy + M[0, 2] - cx) * K)
                        r["ty"] = float((M[1, 0] * cx + M[1, 1] * cy + M[1, 2] - cy) * K)
                        r["inl"] = float(inl.sum()) if inl is not None else 0.0
                        wp = cv2.warpAffine(ptop, M, (W, GY1 - GY0), borderMode=cv2.BORDER_REPLICATE)
                        r["loc"] = float(cv2.absdiff(wp, top).mean())
        rows.append([r[c] for c in COLS])
        prev, prevh = g, h
    cap.release()
    np.savez_compressed(dest, m=np.array(rows, dtype=np.float32), cols=np.array(COLS), fps=np.float32(fps))
    return codice, f"{len(rows)} fotogrammi @ {fps:.2f}"


def misura(filtro=None):
    os.makedirs(MET, exist_ok=True)
    lista = [r for r in reels() if not filtro or filtro in r[0]]
    print(f"misuro {len(lista)} reel…")
    with Pool(12) as p:
        for i, (c, msg) in enumerate(p.imap_unordered(misura_uno, lista), 1):
            if i % 10 == 0 or i == len(lista):
                print(f"   {i}/{len(lista)} · {c}: {msg}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "misura"
    if cmd == "misura":
        misura(sys.argv[2] if len(sys.argv) > 2 else None)
