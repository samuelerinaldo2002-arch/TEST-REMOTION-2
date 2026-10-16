# -*- coding: utf-8 -*-
"""Kallaway (sopra) | copia (sotto) agli stessi istanti, dai fotogrammi del reel 79 e dalle snapshot / dal render della copia.

    _tools/venv/Scripts/python.exe -I kd_snap.py <out.jpg> <t1,t2,…> [--snap cartella_snapshots | --render video.mp4] [--scala 0.3]

Le snapshot si cercano come frame-NN-at-<t>s.png. Griglia ogni 100 px (coordinate 1080×1920), linea rossa a y 1332 (safe zone).
"""
import argparse, glob, os, re, cv2, numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("ts")
ap.add_argument("--snap"); ap.add_argument("--render")
ap.add_argument("--k", default=os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "77_2026-07-08_DaiCxAkOpNb.mp4"))
ap.add_argument("--scala", type=float, default=0.3)
ap.add_argument("--y1", type=int, default=1400)
a = ap.parse_args()
ts = [float(x) for x in a.ts.split(",")]


def grab(path, t):
    cap = cv2.VideoCapture(path)
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, f = cap.read()
    cap.release()
    return f if ok else None


def snap(t):
    for p in glob.glob(os.path.join(a.snap, "frame-*-at-*s.png")):
        m = re.search(r"at-([\d.]+)s\.png$", p)
        if m and abs(float(m.group(1)) - t) < 1e-3:
            return cv2.imread(p)
    return None


def prep(f, lab):
    if f is None:
        f = np.zeros((1920, 1080, 3), np.uint8)
    f = cv2.resize(f, (1080, int(f.shape[0] * 1080 / f.shape[1])), interpolation=cv2.INTER_AREA)[:a.y1].copy()
    for x in range(0, 1081, 100):
        cv2.line(f, (x, 0), (x, a.y1), (0, 120, 220), 1)
    for y in range(0, a.y1 + 1, 100):
        cv2.line(f, (0, y), (1080, y), (0, 120, 220), 1)
    cv2.line(f, (0, 1332), (1080, 1332), (0, 0, 255), 2)
    f = cv2.resize(f, (int(1080 * a.scala), int(a.y1 * a.scala)), interpolation=cv2.INTER_AREA)
    cv2.rectangle(f, (0, 0), (150, 24), (0, 0, 0), -1)
    cv2.putText(f, lab, (4, 17), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (80, 255, 200), 1)
    return f


top, bot = [], []
for t in ts:
    top.append(prep(grab(a.k, t), f"K {t:.2f}s"))
    f = snap(t) if a.snap else grab(a.render, t)
    bot.append(prep(f, f"C {t:.2f}s"))
img = np.vstack([np.hstack(top), np.hstack(bot)])
cv2.imwrite(a.out, img, [cv2.IMWRITE_JPEG_QUALITY, 82])
print(a.out)
