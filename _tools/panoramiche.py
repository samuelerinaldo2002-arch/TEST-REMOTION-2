# -*- coding: utf-8 -*-
"""Un foglio panoramico per reel: 1 fotogramma al secondo, solo titolo + grafica + sottotitolo (y 0-68%).

    python -I _tools/panoramiche.py [fps=1]
-> CATALOGO-ANIMAZIONI/_analisi/panoramiche/NNN_codice[_b].jpg  (NNN = numero nell'inventario, 1 = piu' recente)
"""
import io, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
OUT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi", "panoramiche")
FPS = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
COLS, ROWS, CW = 12, 10, 160
FONT = "C\\:/Windows/Fonts/arial.ttf"


def foglio(r):
    path = os.path.join(CARTELLA, r["file"])
    per_foglio = COLS * ROWS / FPS
    fatti, t0, k = [], 0.0, 0
    while t0 < r["durata"] - 0.5:
        out = os.path.join(OUT, f"{r['n']:03d}_{r['codice']}{'' if k == 0 else '_' + 'bcdef'[k - 1]}.jpg")
        if not os.path.exists(out):
            vf = (f"fps={FPS},crop=iw:ih*0.68:0:0,scale={CW}:-2,"
                  f"drawtext=fontfile='{FONT}':text='%{{pts\\:hms}}':x=3:y=3:fontsize=12:fontcolor=white:box=1:boxcolor=black@0.6,"
                  f"tile={COLS}x{ROWS}:padding=3:color=0x303030")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0}", "-t", f"{per_foglio}", "-copyts", "-i", path,
                            "-vf", vf, "-frames:v", "1", "-q:v", "3", out], cwd="C:\\")
        fatti.append(out)
        t0 += per_foglio
        k += 1
    return r["n"], len(fatti)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    inv = json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
    with ThreadPoolExecutor(4) as ex:
        tot = sum(n for _, n in ex.map(foglio, inv))
    print(f"{tot} fogli per {len(inv)} reel -> {OUT}")
