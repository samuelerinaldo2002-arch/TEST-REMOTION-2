# -*- coding: utf-8 -*-
"""Media della copia del reel 79 (blocco C1): spezzoni e miniature da reel veri di creator già nel progetto
(_clip-esterni) e dai reel dell'utente. Rilanciabile: rifà solo ciò che manca.
    _tools/venv/Scripts/python.exe -I CATALOGO-ANIMAZIONI/copia-01/_lavoro/media.py [gruppo]"""
import os, subprocess, sys, json
QUI = os.path.dirname(os.path.abspath(__file__))
C1 = os.path.dirname(QUI)
PROJ = os.path.dirname(os.path.dirname(C1))
EST = os.path.join(PROJ, "_clip-esterni")
CL = os.path.join(C1, "assets", "clips"); IM = os.path.join(C1, "assets", "img")
os.makedirs(CL, exist_ok=True); os.makedirs(IM, exist_ok=True)
REG = {}


def ff(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)


def clip(nome, src, ss, dur, vf, w=None):
    out = os.path.join(CL, nome + ".mp4")
    REG[nome] = {"sorgente": os.path.relpath(src, PROJ) if src[:1].lower() == PROJ[:1].lower() else src, "da": ss, "durata": dur}
    if os.path.exists(out):
        return
    ff(["-ss", str(ss), "-t", str(dur), "-i", src, "-vf", vf + ",fps=30", "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out])


def foto(nome, src, ss, vf):
    out = os.path.join(IM, nome + ".jpg")
    REG[nome] = {"sorgente": os.path.relpath(src, PROJ), "da": ss}
    if os.path.exists(out):
        return
    ff(["-ss", str(ss), "-i", src, "-frames:v", "1", "-vf", vf, "-q:v", "3", out])


def est(rel):
    return os.path.join(EST, rel)


def durata(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


# ── scena 1 (A05): la card orizzontale col montaggio di 4 creator che raccontano (Kallaway: 4 storyteller in 16:9) ──
CARD = "crop=360:203:0:{y},scale=800:450:flags=lanczos,unsharp=5:5:0.6"
clip("card_a", est("dankoe/20260325_ZM6JkNnOPbg.mp4"), 3.0, 1.0, CARD.format(y=150))
clip("card_b", est("leilahormozi/20261005_QYQFWtT4uRg.mp4"), 4.0, 1.0, CARD.format(y=150))
clip("card_c", est("garyvee/20261004_7LVK2brR_SQ.mp4"), 4.0, 1.0, CARD.format(y=170))
clip("card_d", est("tonyrobbins/20260922_enGdUAmTbc8.mp4"), 9.0, 2.5, "crop=360:181:0:225,scale=796:400:flags=lanczos,unsharp=5:5:0.6")

# ── scena 2: la griglia di reel di altri creator (miniature ferme con le loro scritte, come Kallaway) + il tuo reel al centro ──
G = ["codiesanchez/20261001_VLRC_mdmkgA.mp4", "dankoe/20260411_Bw9EkEKFY9k.mp4", "hormozi/20261005_2uH6CYuOE3w.mp4",
     "leilahormozi/20261006_eA_DgwMICjU.mp4", "garyvee/20261006_Qym1ouLattY.mp4", "viaggi/20260921_jeuTcG6Wu2E.mp4",
     "animali/20261006_GvSB5dw82uk.mp4", "hormozi/20261005_vYTuKljjXNM.mp4", "fitness/20260825_aHIt29V6hwo.mp4",
     "stevenbartlett/20261004_cK13l1gYyDc.mp4", "codiesanchez/20261003_3CeVvT-Tgh0.mp4", "tonyrobbins/20260903_0_b9DrdmTag.mp4",
     "devinjatho/20260824_8p75INXg84Q.mp4", "viaggi/20260929_8grbpwPxr1s.mp4", "garyvee/20261003_vNeW21vW66Q.mp4",
     "leilahormozi/20261005_PEYfgqSdfcw.mp4", "hormozi/20261006_bItxHR3h_as.mp4", "cucina/20260930_v8p1uRsQYNk.mp4",
     "dankoe/20260519_2yJUzTBHcLs.mp4", "stevenbartlett/20260930_TkAUoahM950.mp4", "fitness/20260923_rHgCRGNbG_Q.mp4"]
for i, g in enumerate(G):
    p = est(g)
    foto(f"g{i + 1:02d}", p, round(durata(p) * 0.38, 2), "scale=320:569:flags=lanczos")

json.dump(REG, open(os.path.join(C1, "assets", "_sorgenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok", len(REG))

# ── scena 6: il telefono col TUO reel che scorre (Kallaway: il suo reel «How To Script A Winning YouTube Video», poi lui in B/N,
# poi il documento scuro «Viral YouTube Script Framework» con la faccia sotto) ──
MIO = r"D:\CONTENUTI\OTTOBRE 2026\PARTE 1\DA PUBBLICARE"
clip("tel_a", os.path.join(MIO, "2026_10_13 REEL.mp4"), 4.6, 2.4, "scale=400:712:flags=lanczos")
clip("tel_b", os.path.join(MIO, "2026_10_13 REEL.mp4"), 8.0, 1.2, "scale=400:712:flags=lanczos,hue=s=0")
clip("tel_c", os.path.join(MIO, "2026_10_12 REEL.mp4"), 24.6, 1.2, "scale=400:712:flags=lanczos")
json.dump(REG, open(os.path.join(C1, "assets", "_sorgenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok scena 6")

# ── scena 12: il reel vero di un creator che racconta una storia (Kallaway: un creator che apre un account nuovo e chiede
# «quanto in fretta arrivo a 10K?»; qui un creator di viaggi: «il taglio di capelli col fuoco»), le sue scritte evidenziate ──
CR = "scale=500:888:flags=lanczos,unsharp=5:5:0.5"
clip("cr_a", est("viaggi/20260921_jeuTcG6Wu2E.mp4"), 7.0, 4.6, CR)
clip("cr_b", est("viaggi/20260921_jeuTcG6Wu2E.mp4"), 13.0, 1.9, CR)
clip("cr_c", est("viaggi/20260921_jeuTcG6Wu2E.mp4"), 0.9, 3.6, CR)
json.dump(REG, open(os.path.join(C1, "assets", "_sorgenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok scena 12")

# ── scene 18 e 20: spezzoni a tutto schermo (Kallaway: tre film di suspense; il casinò coi primi piani delle carte sul panno rosso)
# fonti libere: Pexels (licenza Pexels, niente attribuzione), file in _lavoro/stock/
ST = os.path.join(QUI, "stock")
FS = "crop={w}:{h}:{x}:{y},scale=1080:1332:flags=lanczos"
clip("film_a", os.path.join(ST, "px_34279707.mp4"), 8.0, 1.0, FS.format(w=1080, h=1332, x=0, y=420) + ",eq=gamma=1.9:brightness=0.04:saturation=1.2,colorbalance=bs=0.12:bm=0.06")
clip("film_b", os.path.join(ST, "px_8888784.mp4"), 4.6, 1.1, FS.format(w=1168, h=1440, x=1000, y=0))
clip("film_c", os.path.join(ST, "px_29072593.mp4"), 4.0, 2.1, FS.format(w=1168, h=1440, x=1100, y=0))
clip("casino_a", os.path.join(ST, "px_6664998.mp4"), 1.6, 2.2, FS.format(w=960, h=1184, x=360, y=1350))
clip("casino_b", os.path.join(ST, "px_6664998.mp4"), 6.4, 2.0, FS.format(w=960, h=1184, x=360, y=1350))
json.dump(REG, open(os.path.join(C1, "assets", "_sorgenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok scene 18 e 20")

# ── scena 25: nella card del video, alla fine, il TUO video (Kallaway: lui che parla nel suo studio, 16:9)
clip("cta_tu", os.path.join(MIO, "2026_10_13 REEL.mp4"), 19.0, 0.8, "crop=1080:608:0:460,scale=900:506:flags=lanczos")
json.dump(REG, open(os.path.join(C1, "assets", "_sorgenti.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok scena 25")
