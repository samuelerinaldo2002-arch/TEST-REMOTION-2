# -*- coding: utf-8 -*-
"""Media della copia del reel 1 (blocco C2b, cloud 16/10): i reel dell'utente già tagliati per C1 (copia-01/assets/clips/mio) e
i fotogrammi del muro di C2 (copia-02/assets/img), reel veri di creator già nel progetto (_clip-esterni). I reel veri
dell'utente (D:\\CONTENUTI) non ci sono in cloud. Rilanciabile: rifà solo ciò che manca.
    _tools/venv/bin/python -I CATALOGO-ANIMAZIONI/copia-07/_lavoro/media.py"""
import os, subprocess, json, shutil
QUI = os.path.dirname(os.path.abspath(__file__))
C7 = os.path.dirname(QUI)
PROJ = os.path.dirname(os.path.dirname(C7))
EST = os.path.join(PROJ, "_clip-esterni")
C1CL = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "copia-01", "assets", "clips")
C2 = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "copia-02", "assets")
CL = os.path.join(C7, "assets", "clips"); IM = os.path.join(C7, "assets", "img")
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


est = lambda cr, i: os.path.join(EST, cr, sorted(f for f in os.listdir(os.path.join(EST, cr)) if f.endswith(".mp4"))[i])
mio = lambda r: os.path.join(C1CL, "mio", r + ".mp4")
# ritagli: i tuoi reel «m» sono 360×480 (la parte alta), i «v» 540×960 (interi)
CARD_M = "crop=300:480:30:0"                                   # card 0,625 (scena 1, muro)
CARD_V = "scale=300:534:flags=lanczos,crop=300:480:0:27"
VERT = "scale=360:640:flags=lanczos"

# scena 1 · la griglia di 5 reel (Kallaway: 5 SUOI reel, grafica sopra e lui sotto, che girano) → 5 tuoi reel diversi
for nome, r, ss, nota in [("g1", "m02", 0.0, "tuo reel: il profilo con le etichette"), ("g2", "v01", 0.3, "tuo reel: tu che parli"),
                          ("g3", "m04", 0.0, "tuo reel: la griglia dei post"), ("g4", "v03", 3.0, "tuo reel: tu che parli (caroselli)"),
                          ("g5", "m09", 2.5, "tuo reel: la scala degli step")]:
    clip(nome, mio(r), ss, 3.2, CARD_M if r.startswith("m") else CARD_V, nota)
# scena 3 · il SUO reel con le views che contano, poi un altro suo reel (Kallaway: lui che parla, poi il tablet con la città)
clip("c3a", mio("v02"), 0.4, 1.4, "scale=440:782:flags=lanczos,crop=440:672:0:40", "tuo reel: tu che parli in camera")
clip("c3b", mio("v01"), 3.15, 1.4, "scale=440:782:flags=lanczos,crop=440:672:0:40", "tuo reel: il profilo che spieghi")
# scena 11 · il reel di un piccolo creator (Kallaway: un creator alla scrivania con le scritte, 36 → 206 views)
clip("cr11", est("devinjatho", 1), 3.0, 2.2, "scale=440:782:flags=lanczos,crop=440:672:0:40", "creator che parla con le scritte")
# scena 18 · «Reel insights»: il SUO reel nella miniatura (lui che parla) → il tuo reel
clip("ins", mio("v03"), 0.0, 4.2, "scale=270:480:flags=lanczos", "tuo reel nella miniatura delle statistiche")
# scena 25 · CTA: il SUO video 16:9 (lui allo studio) e poi lo schema «6 Step Blueprint» → tu che parli (16:9 di C2) e una tua grafica
src_cta = os.path.join(C2, "clips", "cta_tu.mp4")
out = os.path.join(CL, "cta_a.mp4")
REG["cta_a"] = {"sorgente": os.path.relpath(src_cta, PROJ), "da": 0, "cosa": "tu che parli in camera, 16:9 (ritaglio del tuo reel v02, come in C2)"}
if not os.path.exists(out): shutil.copyfile(src_cta, out)
clip("cta_b", mio("m04"), 0.5, 4.0, "crop=360:203:0:120,scale=640:360:flags=lanczos", "la tua grafica (la griglia dei post) in 16:9")
# coda A01 (reel 25 di Kallaway, 0–3,04 s: 6 reel di creator diversi, «contenuti applicazione») → 6 creator diversi
for k, (cr, i, ss) in enumerate([("leilahormozi", 2, 2.0), ("codiesanchez", 2, 2.0), ("fitness", 1, 2.0),
                                 ("cucina", 1, 2.0), ("viaggi", 0, 2.0), ("stevenbartlett", 3, 2.0)]):
    clip(f"a{k + 1}", est(cr, i), ss, 3.2, "scale=300:534:flags=lanczos,crop=300:480:0:27", f"creator {cr}")
# scena 3 · il muro di ~100 reel (Kallaway: i SUOI reel, tutti diversi) → 48 fotogrammi DIVERSI dei tuoi reel: i 36 del muro di C2
# (copia-02/assets/img/wv*, wg*) + 12 nuovi a istanti non usati
for p in ("wv", "wg"):
    for k in range(1, 19):
        n = f"{p}{k:02d}"; s = os.path.join(C2, "img", n + ".jpg"); d = os.path.join(IM, n + ".jpg")
        REG[n] = {"sorgente": os.path.relpath(s, PROJ), "cosa": "muro: fotogramma di un tuo reel (dal muro di C2)"}
        if not os.path.exists(d): shutil.copyfile(s, d)
NUOVI = [("v01", 1.6), ("v01", 2.8), ("v01", 5.0), ("v02", 1.6), ("v02", 2.8), ("v02", 4.0), ("v03", 0.4), ("v03", 1.6),
         ("v03", 2.8), ("v03", 5.2), ("m02", 4.0), ("m07", 4.0)]
for k, (r, t) in enumerate(NUOVI):
    foto(f"wn{k + 1:02d}", mio(r), t, "crop=270:480:45:0" if r.startswith("m") else "scale=270:480:flags=lanczos", f"muro: il tuo reel {r} a {t} s")
json.dump(REG, open(os.path.join(C7, "assets", "_sorgenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok", len(REG))
