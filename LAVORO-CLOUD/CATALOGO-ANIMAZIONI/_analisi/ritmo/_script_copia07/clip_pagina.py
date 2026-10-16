# -*- coding: utf-8 -*-
"""Clip della pagina per le voci di un blocco di copia (cloud, 16/10), SENZA rigenerare la pagina: ritmo-clip/<ID>_copia.mp4
(dal render _analisi/render/<comp>_bozza.mp4) e ritmo-clip/<ID>_kcopia.mp4 (dal reel di Kallaway agli stessi istanti), con gli
stessi parametri di _tools/genera_catalogo_ritmo.py (clip(): in alto il 70% del fotogramma, alta 640 px, 30 fps, crf 24, senza
audio) e gli stessi tempi (campo «voci» di <comp>/scene.json). La pagina la rigenera l'utente in locale (la clip si rifà solo
se cambia la chiave in ritmo-clip/_clip.json: qui non si tocca).

    _tools/venv/bin/python -I clip_pagina.py copia-02 L01,L02,…
"""
import io, json, os, subprocess, sys

QUI = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
CAT = os.path.join(PROJ, "CATALOGO-ANIMAZIONI")
comp, ids = sys.argv[1], set(sys.argv[2].split(","))
INV = {r["n"]: r for r in json.load(io.open(os.path.join(PROJ, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
ren = os.path.join(CAT, "_analisi", "render", comp + "_bozza.mp4")


def taglia(src, a, b, out):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", src,
                    "-vf", "crop=iw:ih*0.70:0:0,scale=-2:640,fps=30", "-an", "-c:v", "libx264", "-crf", "24", "-preset", "veryfast",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], check=True)
    print(os.path.relpath(out, PROJ))


fatte = set()
for s in json.load(io.open(os.path.join(CAT, comp, "scene.json"), encoding="utf-8")):
    for vid, (a, b) in (s.get("voci") or {}).items():
        if vid not in ids or vid in fatte:
            continue
        fatte.add(vid)
        k = s["kallaway"]; dk = k["t0"] - s["t0"]
        taglia(ren, a, b, os.path.join(CAT, "ritmo-clip", f"{vid}_copia.mp4"))
        taglia(os.path.join(PROJ, INV[k["reel"]]["file"]), a + dk, b + dk, os.path.join(CAT, "ritmo-clip", f"{vid}_kcopia.mp4"))
print("mancano:", sorted(ids - fatte) or "nessuna")
