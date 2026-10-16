# -*- coding: utf-8 -*-
"""Media della copia del reel 5 (blocco C2, cloud 16/10): spezzoni di reel veri di creator già nel progetto (_clip-esterni) e
i reel dell'utente già tagliati per C1 (copia-01/assets/clips: i suoi reel veri di D:\\CONTENUTI non ci sono in cloud).
Rilanciabile: rifà solo ciò che manca.  _tools/venv/bin/python -I CATALOGO-ANIMAZIONI/copia-02/_lavoro/media.py"""
import os, subprocess, json, shutil
QUI = os.path.dirname(os.path.abspath(__file__))
C2 = os.path.dirname(QUI)
PROJ = os.path.dirname(os.path.dirname(C2))
EST = os.path.join(PROJ, "_clip-esterni")
C1CL = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "copia-01", "assets", "clips")
CL = os.path.join(C2, "assets", "clips"); IM = os.path.join(C2, "assets", "img")
os.makedirs(CL, exist_ok=True); os.makedirs(IM, exist_ok=True)
REG = {}


def ff(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)


def clip(nome, src, ss, dur, vf, nota):
    out = os.path.join(CL, nome + ".mp4")
    REG[nome] = {"sorgente": os.path.relpath(src, PROJ), "da": ss, "durata": dur, "cosa": nota}
    if not os.path.exists(out):
        ff(["-ss", str(ss), "-t", str(dur), "-i", src, "-vf", vf + ",fps=30", "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out])


def foto(nome, src, ss, vf, nota):
    out = os.path.join(IM, nome + ".jpg")
    REG[nome] = {"sorgente": os.path.relpath(src, PROJ), "da": ss, "cosa": nota}
    if not os.path.exists(out):
        ff(["-ss", str(ss), "-i", src, "-frames:v", "1", "-vf", vf, "-q:v", "3", out])


est = lambda r: os.path.join(EST, r)
mio = lambda r: os.path.join(C1CL, r)
V = "scale=360:640:flags=lanczos,unsharp=5:5:0.4"

# scena 1: due reel di altri creator (Kallaway: due creator, uno in studio con la lampada, uno col cappellino e il microfono)
clip("cr_a", est("dankoe/20260519_2yJUzTBHcLs.mp4"), 10.0, 2.6, V, "creator in studio (felpa)")
clip("cr_b", est("garyvee/20261003_vNeW21vW66Q.mp4"), 8.0, 2.6, V, "creator col cappellino")
# scena 3: il reel di un creator con la barra-classifica a sinistra (Kallaway: «DOG BREED TRAINABILITY» con la barra rosso→verde),
# poi una folla (Kallaway: un reel con una folla in un locale)
clip("metro", est("fitness/20260628_W9-m9PH6NTE.mp4"), 40.0, 2.3, V, "creator con la tier list colorata a sinistra")
clip("folla", est("viaggi/20260909_ufpZt8HrFhQ.mp4"), 24.0, 3.0, V, "folla in una sala")
# i tuoi reel (Kallaway: i suoi reel, lui sotto e la grafica sopra) — dai reel dell'utente già tagliati per C1
for nome, f, nota in [("tuo1", "mio/v01.mp4", "tuo reel: tu e il profilo"), ("tuo2", "mio/v03.mp4", "tuo reel: interfaccia sopra, tu sotto"),
                      ("tuo3", "mio/m05.mp4", "tuo reel: grafica sopra, tu sotto"), ("tuo4", "tel_c.mp4", "tuo reel (telefono di C1)"),
                      ("tuo5", "mio/m01.mp4", "tuo reel: tu in primo piano")]:
    out = os.path.join(CL, nome + ".mp4")
    REG[nome] = {"sorgente": os.path.relpath(mio(f), PROJ), "da": 0, "cosa": nota}
    if not os.path.exists(out):
        shutil.copyfile(mio(f), out)
# scena 27: il tuo video 16:9 (Kallaway: lui nello studio col microfono, 16:9) — ritaglio del tuo reel v02 sul viso
clip("cta_tu", mio("mio/v02.mp4"), 0.0, 4.6, "crop=540:304:0:150,scale=640:360:flags=lanczos,unsharp=5:5:0.5", "tu che parli in camera, 16:9")
# scena 19: la copertina di un creator col microfono e la scritta (Kallaway: «This Is How You Go Viral»), clonata 9 volte
foto("clone", est("stevenbartlett/20261001_7DtkrTrTfF0.mp4"), 0.6, "crop=360:500:0:40,scale=288:400:flags=lanczos", "creator col microfono e la scritta, copertina")
json.dump(REG, open(os.path.join(C2, "assets", "_sorgenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok", len(REG))
