# -*- coding: utf-8 -*-
"""Fogli delle APERTURE: i primi 3 secondi di ogni reel (8 fotogrammi), 10 reel per foglio, ordinati per views.

    python -I _tools/aperture.py
-> CATALOGO-ANIMAZIONI/_analisi/aperture/aperture_NN.jpg  (+ indice.json con l'ordine dei reel)
"""
import io, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
OUT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi", "aperture")
TMP = os.path.join(OUT, "_righe")
TEMPI = [0.0, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0]
CW = 150
FONT = "C\\:/Windows/Fonts/arial.ttf"


def riga(r):
    out = os.path.join(TMP, f"{r['n']:03d}.jpg")
    if os.path.exists(out):
        return out
    src = os.path.join(CARTELLA, r["file"])
    sel = "+".join(f"eq(n\\,{int(round(t * 30))})" for t in TEMPI)
    label = f"#{r['n']} {r['views']//1000}K {r['data'][5:]}"
    vf = (f"fps=30,select='{sel}',crop=iw:ih*0.70:0:0,scale={CW}:-2,"
          f"tile={len(TEMPI)}x1:padding=2:color=0x303030,"
          f"drawtext=fontfile='{FONT}':text='{label}':x=4:y=4:fontsize=13:fontcolor=yellow:box=1:boxcolor=black@0.75")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-t", "3.2", "-i", src, "-vf", vf, "-frames:v", "1", "-q:v", "3", out], cwd="C:\\")
    return out


if __name__ == "__main__":
    os.makedirs(TMP, exist_ok=True)
    inv = json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
    inv.sort(key=lambda r: -r["views"])
    with ThreadPoolExecutor(6) as ex:
        righe = list(ex.map(riga, inv))
    for k in range(0, len(righe), 10):
        chunk = [f for f in righe[k:k + 10] if os.path.exists(f)]
        out = os.path.join(OUT, f"aperture_{k // 10 + 1:02d}.jpg")
        args = ["ffmpeg", "-v", "error", "-y"]
        for f in chunk:
            args += ["-i", f]
        args += ["-filter_complex", "".join(f"[{i}:v]" for i in range(len(chunk))) + f"vstack=inputs={len(chunk)}", "-q:v", "3", out]
        subprocess.run(args, cwd="C:\\")
    json.dump([{"n": r["n"], "views": r["views"], "data": r["data"], "file": r["file"]} for r in inv], io.open(os.path.join(OUT, "indice.json"), "w", encoding="utf-8"), indent=1)
    print(f"{len(righe)} righe · {(len(righe) + 9) // 10} fogli -> {OUT}")
