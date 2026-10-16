# -*- coding: utf-8 -*-
"""Atlante di miniature 9:16 da reel veri (un fotogramma per clip) per i muri di reel (K11 scroll 'slot machine', L14…).

    _tools/venv/Scripts/python.exe -I _tools/atlante.py [nome=muro] [colonne=12] [righe=12] [larghezza=128]

Sorgenti: tutte le clip di _clip-esterni/<cartella>/*.mp4 (creator e temi), a rotazione tra le cartelle, così le
miniature vicine sono diverse. Per ogni clip si prende il primo fotogramma "pieno" (contrasto sufficiente) al 30/50/70%.
Uscita: kw-kit/assets/atlas/<nome>.jpg (griglia colonne × righe) + <nome>.json (geometria) — build.cjs lo mette nel
pool come <img id="atlas-<nome>"> solo se la composizione nomina "atlas-<nome>".
"""
import glob, io, json, os, sys
import numpy as np
sys.stdout.reconfigure(encoding="utf-8")
import cv2

QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
nome = sys.argv[1] if len(sys.argv) > 1 else "muro"
C = int(sys.argv[2]) if len(sys.argv) > 2 else 12
R = int(sys.argv[3]) if len(sys.argv) > 3 else 12
TW = int(sys.argv[4]) if len(sys.argv) > 4 else 128
TH = int(round(TW * 16 / 9))
N = C * R

pools = [sorted(glob.glob(os.path.join(d, "*.mp4"))) for d in sorted(glob.glob(os.path.join(CARTELLA, "_clip-esterni", "*")))]
pools = [p for p in pools if p]
src, i = [], 0
while len(src) < N * 2 and any(pools):
    p = pools[i % len(pools)]
    if p:
        src.append(p.pop(0))
    i += 1


def fotogramma(path, prove=(0.3, 0.5, 0.7, 0.15)):
    cap = cv2.VideoCapture(path)
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    best = None
    for f in prove:
        cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, int(n * f)))
        ok, fr = cap.read()
        if not ok:
            continue
        h, w = fr.shape[:2]
        # ritaglio 9:16 centrato
        if w / h > 9 / 16:
            nw = int(h * 9 / 16); fr = fr[:, (w - nw) // 2:(w - nw) // 2 + nw]
        else:
            nh = int(w * 16 / 9); fr = fr[(h - nh) // 2:(h - nh) // 2 + nh]
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        if g.std() > 32 and 35 < g.mean() < 215:
            best = fr
            break
        best = fr if best is None else best
    cap.release()
    return None if best is None else cv2.resize(best, (TW, TH), interpolation=cv2.INTER_AREA)


tiles = []
# primo giro: un fotogramma per clip; se non bastano, un secondo momento (più avanti) della stessa clip
for prove in ((0.3, 0.5, 0.7, 0.15), (0.78, 0.62, 0.9)):
    for s in src:
        t = fotogramma(s, prove)
        if t is not None:
            tiles.append(t)
        if len(tiles) >= N:
            break
    if len(tiles) >= N:
        break
# mescolamento deterministico: le due serie (stessa clip) non finiscono vicine
ordine = sorted(range(len(tiles)), key=lambda k: (k * 7919) % 1009)
tiles = [tiles[k] for k in ordine]
if len(tiles) < N:
    sys.exit(f"solo {len(tiles)} miniature su {N}")
atl = np.zeros((R * TH, C * TW, 3), np.uint8)
for k, t in enumerate(tiles[:N]):
    r, c = divmod(k, C)
    atl[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW] = t
out = os.path.join(CARTELLA, "kw-kit", "assets", "atlas")
os.makedirs(out, exist_ok=True)
cv2.imwrite(os.path.join(out, nome + ".jpg"), atl, [cv2.IMWRITE_JPEG_QUALITY, 84])
json.dump({"cols": C, "rows": R, "tw": TW, "th": TH, "n": N}, io.open(os.path.join(out, nome + ".json"), "w", encoding="utf-8"))
print(f"{nome}: {N} miniature {TW}x{TH} → {C * TW}x{R * TH} px · {os.path.getsize(os.path.join(out, nome + '.jpg')) // 1024} KB")
