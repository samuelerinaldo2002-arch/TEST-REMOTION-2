# -*- coding: utf-8 -*-
"""Foglio di provini (contact sheet) di un tratto di video, a fps nativo o un fotogramma ogni `passo`.

    python -I r06_foglio.py <n|percorso.mp4> <t0> <t1> <uscita.jpg> [passo=1] [larg_tile=180] [roi=x0,y0,x1,y1 in 1080x1920] [col=10]

n = numero del reel di Kallaway (campo n dell'inventario) oppure un percorso di video (le nostre bozze).
"""
import io, os, sys, json
import numpy as np
import cv2

ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"


def video_di(x):
    if os.path.exists(x):
        return x
    inv = json.load(io.open(os.path.join(ROOT, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
    r = [r for r in inv if str(r["n"]) == str(x)][0]
    return os.path.join(ROOT, r["file"])


def fotogrammi(path, t0, t1, passo=1):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    f0, f1 = int(round(t0 * fps)), int(round(t1 * fps))
    cap.set(cv2.CAP_PROP_POS_FRAMES, f0)
    out = []
    for f in range(f0, f1 + 1):
        ok, fr = cap.read()
        if not ok:
            break
        if (f - f0) % passo == 0:
            out.append((f, f / fps, fr))
    cap.release()
    return out, fps


def foglio(frames, larg=180, roi=None, col=10, etich=True):
    tiles = []
    for f, t, fr in frames:
        h, w = fr.shape[:2]
        k = w / 1080.0
        if roi:
            x0, y0, x1, y1 = [int(round(v * k)) for v in roi]
            fr = fr[max(0, y0):min(h, y1), max(0, x0):min(w, x1)]
        hh = int(round(fr.shape[0] * larg / fr.shape[1]))
        im = cv2.resize(fr, (larg, hh), interpolation=cv2.INTER_AREA)
        if etich:
            cv2.rectangle(im, (0, 0), (larg, 16), (0, 0, 0), -1)
            cv2.putText(im, f"{t:.2f}s f{f}", (3, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
        tiles.append(im)
    if not tiles:
        return None
    hh = max(t.shape[0] for t in tiles)
    rows = []
    for k in range(0, len(tiles), col):
        r = tiles[k:k + col]
        r = [np.pad(t, ((0, hh - t.shape[0]), (0, 2), (0, 0))) for t in r]
        while len(r) < col:
            r.append(np.zeros_like(r[0]))
        rows.append(np.hstack(r))
    return np.vstack([np.pad(r, ((0, 2), (0, 0), (0, 0))) for r in rows])


if __name__ == "__main__":
    a = sys.argv[1:]
    path = video_di(a[0])
    t0, t1, dest = float(a[1]), float(a[2]), a[3]
    passo = int(a[4]) if len(a) > 4 else 1
    larg = int(a[5]) if len(a) > 5 else 180
    roi = [float(v) for v in a[6].split(",")] if len(a) > 6 and a[6] not in ("-", "") else None
    col = int(a[7]) if len(a) > 7 else 10
    fr, fps = fotogrammi(path, t0, t1, passo)
    im = foglio(fr, larg, roi, col)
    os.makedirs(os.path.dirname(os.path.abspath(dest)), exist_ok=True)
    cv2.imwrite(dest, im, [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(dest, im.shape, f"fps={fps:.3f}", len(fr), "fotogrammi")
