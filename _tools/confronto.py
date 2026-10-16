# -*- coding: utf-8 -*-
"""Confronti affiancati: fotogramma di Kallaway | nostro fotogramma, con densità e copertura dell'area grafica.

    _tools/venv/Scripts/python.exe -I _tools/confronto.py <coppie.json>
coppie.json: [{"nostro": "path.png", "reel": N, "t": secondi, "voce": "O24 calendario"}, …]
-> CATALOGO-ANIMAZIONI/_analisi/confronti/confronto_NN.jpg (3 coppie per riga)
"""
import io, json, os, sys
import numpy as np
import cv2

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from densita import misura  # noqa: E402

QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
OUT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi", "confronti")
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
W, H = 360, 640
REF = json.load(io.open(os.path.join(CARTELLA, 'CATALOGO-ANIMAZIONI', '_analisi', 'densita.json'), encoding='utf-8'))


def frame_k(n, t):
    cap = cv2.VideoCapture(os.path.join(CARTELLA, INV[n]["file"]))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
    ok, fr = cap.read()
    cap.release()
    return fr if ok else np.zeros((1920, 1080, 3), np.uint8)


def testo(img, s, y, col=(80, 251, 207), sc=0.48):
    cv2.putText(img, s, (8, y), cv2.FONT_HERSHEY_SIMPLEX, sc, (0, 0, 0), 4, cv2.LINE_AA)
    cv2.putText(img, s, (8, y), cv2.FONT_HERSHEY_SIMPLEX, sc, col, 1, cv2.LINE_AA)


def coppia(c):
    k = frame_k(c["reel"], c["t"])
    hk = k.shape[0]
    dk, ck = misura(k[int(0.03 * hk):int(0.56 * hk)])
    o = cv2.imread(c["nostro"])
    so = o.shape[1] / 1080
    do, co = misura(o[int(150 * so):int(1385 * so)])
    a = cv2.resize(k, (W, H), interpolation=cv2.INTER_AREA)
    b = cv2.resize(o, (W, H), interpolation=cv2.INTER_AREA)
    # graphic band guides
    cv2.rectangle(a, (1, int(0.03 * H)), (W - 2, int(0.56 * H)), (90, 90, 90), 1)
    cv2.rectangle(b, (1, int(150 / 1920 * H)), (W - 2, int(1385 / 1920 * H)), (90, 90, 90), 1)
    testo(a, f"KALLAWAY reel {c['reel']} @{c['t']}s", 18, (255, 255, 255))
    testo(a, f"dens {dk:.2f}  cop {ck:.2f}", 38)
    ok = do >= REF['densita']['p25'] and co >= REF['copertura']['p25']  # soglia = 25° percentile di Kallaway (densita.json)
    testo(b, f"NOSTRO {c['voce']}", 18, (255, 255, 255))
    testo(b, f"dens {do:.2f}  cop {co:.2f}  {'ok' if ok else 'TROPPO VUOTO'}", 38, (80, 251, 207) if ok else (80, 80, 255))
    sep = np.full((H, 6, 3), 40, np.uint8)
    return np.hstack([a, sep, b]), (dk, ck, do, co)


def main():
    coppie = json.load(io.open(sys.argv[1], encoding="utf-8"))
    os.makedirs(OUT, exist_ok=True)
    tiles, righe = [], []
    for c in coppie:
        t, m = coppia(c)
        tiles.append(t)
        righe.append(dict(c, k_dens=round(m[0], 3), k_cop=round(m[1], 3), dens=round(m[2], 3), cop=round(m[3], 3)))
    per_foglio = 9
    for f in range(0, len(tiles), per_foglio):
        chunk = tiles[f:f + per_foglio]
        while len(chunk) % 3:
            chunk.append(np.full_like(tiles[0], 25))
        rows = [np.hstack([chunk[i], np.full((H, 14, 3), 25, np.uint8), chunk[i + 1], np.full((H, 14, 3), 25, np.uint8), chunk[i + 2]]) for i in range(0, len(chunk), 3)]
        sheet = np.vstack([np.vstack([r, np.full((14, r.shape[1], 3), 25, np.uint8)]) for r in rows])
        cv2.imwrite(os.path.join(OUT, f"confronto_{f // per_foglio + 1:02d}.jpg"), sheet, [cv2.IMWRITE_JPEG_QUALITY, 88])
    json.dump(righe, io.open(os.path.join(OUT, "confronti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(tiles)} confronti -> {OUT}")


if __name__ == "__main__":
    main()
