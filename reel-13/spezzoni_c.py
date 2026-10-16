# Spezzoni del reel 13/10, tagliati dai tuoi reel finiti (D:\CONTENUTI\OTTOBRE 2026\PARTE 1\DA PUBBLICARE), 11/10 sera.
# Solo momenti che NON compaiono nei reel 09, 10, 11 né in quelli previsti per il 12 (tempi ricavati confrontando i fotogrammi
# delle loro clip con i reel finiti: 09 s1 = 01 6,4–10,2 · s2 = 02 4,0–8,0 · s3 = 04 3,6–7,6 · s4 = 07 9,6–13,6 · s5 = 08 13,8–17,8 ·
# s6 = 05 10,0–14,0 · big1 = 03 13,8–21,0 · big2 = 05 2,0–7,0 · big3 = 06 28,2–33,2; reel 10 e 11 dai loro spezzoni.txt; reel 12:
# le copie della demo-6 che usa ora — m05 02 26–32 · m06 07 13,4–19,4 · m07 04 15,6–21,6 · m08 03 4,6–10,6 · m09 06 17,2–23,2 ·
# v01 05 11–17 · v02 01 7,2–13,2 · v03 08 21–27 — e le finestre che si è segnato per quando torna D: 03 34,2–37,2 · 05 59,1–63,4 ·
# 05 70,2–73,6 · 05 81,3–85,9 · 06 3,8–8,0 · 06 15,3–19,4).
# Finestre di faccia pulite: _tools/finestre_pulite.py 2 6; flash a 10 fps (Y > 140 o salto > 22): 02 22,3 · 03 32,2 e 34,0 ·
# 04 21,9–22,1 · 05 41,6–41,8 e 58,8–59,0 · 05 80,9 · 07 8,3 → tutti fuori dai pezzi qui sotto. Controllo a 6 fps: _contatto6.jpg.
# Uscita: reel-13/assets/clips/<id>.mp4 a 30 fps, un fotogramma chiave al secondo, senza audio, + _contatto.jpg (1 fps) e
# _contatto6.jpg (6 fps, solo feed e chi). 05 42,0–44,4 ceduto al reel 12 (al suo posto 03 1,6–4,0).
# - feed (hook) e feed2 (scena 7, "chi arriva da un video"): lo stesso reel, 07/10 19,4–22,4 (faccia; a 22,6 parte una grafica)
# - chi (la storia "Chi sono"): 02/10 22,4–26,2 + 04/10 22,3–23,9 (faccia; 04 ha un flash a 21,9–22,1, prima del taglio)
# - g1…g6 (le sei celle della griglia del profilo, 3:4, 360 × 480, 45,6 s): un nastro di 15 pezzi (faccia e grafiche dei tuoi reel,
#   tagli secchi come nei reel), ogni cella lo legge da un punto diverso (sfasamento 10,6 s): due celle non mostrano mai lo stesso
#   momento insieme.
# Uso: python -I reel-13/spezzoni_c.py
import subprocess
from pathlib import Path

R = Path(__file__).resolve().parent
SRC = Path("D:/CONTENUTI/OTTOBRE 2026/PARTE 1/DA PUBBLICARE")
FILES = {p.name[8:10]: p for p in SRC.glob("2026-10-0*REEL.mp4")}
OUT = R / "assets" / "clips"
OUT.mkdir(parents=True, exist_ok=True)
ENC = ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", "-movflags", "+faststart"]
CROP34 = "fps=30,crop=iw:iw*4/3:0:(ih-iw*4/3)/2,scale=360:480:flags=lanczos,setsar=1"

# il nastro della griglia: (giorno, inizio, durata) — F = faccia, g = grafica
NASTRO = [("05", 24.5, 5.0), ("08", 17.8, 3.2), ("04", 27.0, 5.0), ("07", 0.0, 3.0), ("03", 22.0, 5.0), ("02", 12.0, 3.5),
          ("06", 8.5, 5.0), ("03", 1.6, 2.4), ("07", 25.0, 5.0), ("04", 24.0, 1.5), ("02", 16.0, 5.0), ("05", 46.0, 5.0),
          ("08", 6.0, 5.0), ("05", 64.0, 4.0), ("08", 29.0, 4.5)]
CELLE, SFASA, LUNG = 6, 10.35, 45.6
# 9:16: id → [(giorno, inizio, durata), …] (controllati a 6 fps: dove finisce la faccia e comincia la grafica)
VERT = {"feed": [("07", 19.4, 3.0)], "chi": [("02", 22.4, 3.8), ("04", 22.3, 1.6)]}


def run(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


tmp = R / "_tmp_clips"
tmp.mkdir(exist_ok=True)
parts = []
for k, (dd, t0, du) in enumerate(NASTRO):
    dst = tmp / f"n{k:02d}.mp4"
    run(["-ss", f"{t0:.3f}", "-t", f"{du:.3f}", "-i", str(FILES[dd]), "-vf", CROP34, *ENC, str(dst)])
    parts.append(dst)
lst = tmp / "nastro.txt"
lst.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts * 2), encoding="utf-8")
nastro = tmp / "nastro.mp4"
run(["-f", "concat", "-safe", "0", "-i", str(lst), "-vf", "fps=30", *ENC, str(nastro)])
giro = sum(x[2] for x in NASTRO)
print(f"nastro: {giro:.1f} s per giro")
for c in range(CELLE):
    t0 = (c * SFASA) % giro
    run(["-ss", f"{t0:.3f}", "-t", f"{LUNG:.3f}", "-i", str(nastro), "-vf", "fps=30", *ENC, str(OUT / f"g{c + 1}.mp4")])
    print(f"g{c + 1}: dal nastro a {t0:.1f} s")
for vid, segs in VERT.items():
    pz = []
    for k, (dd, t0, du) in enumerate(segs):
        dst = tmp / f"{vid}_{k}.mp4"
        run(["-ss", f"{t0:.3f}", "-t", f"{du:.3f}", "-i", str(FILES[dd]), "-vf", "fps=30,scale=540:960:flags=lanczos,setsar=1", *ENC, str(dst)])
        pz.append(dst)
    lst = tmp / f"{vid}.txt"
    lst.write_text("".join(f"file '{p.as_posix()}'\n" for p in pz), encoding="utf-8")
    run(["-f", "concat", "-safe", "0", "-i", str(lst), "-vf", "fps=30", *ENC, str(OUT / f"{vid}.mp4")])
    print(vid, " + ".join(f"{dd}/10 {t0}-{t0 + du:.1f} s" for dd, t0, du in segs))
for p in tmp.glob("*"):
    p.unlink()
tmp.rmdir()


def foglio(nomi, fps, out, cols):
    fogli = []
    for p in nomi:
        sheet = OUT / f"_c_{p.stem}.png"
        run(["-i", str(p), "-vf", f"fps={fps},scale=-2:120,tile={cols}x1", "-frames:v", "1", str(sheet)])
        fogli.append(sheet)
    args = []
    for f in fogli:
        args += ["-i", str(f)]
    n = len(fogli)
    args += ["-filter_complex", "".join(f"[{i}:v]pad={cols}*96:120:0:0:color=black[p{i}];" for i in range(n)) + "".join(f"[p{i}]" for i in range(n)) + f"vstack=inputs={n}", str(OUT / out)]
    run(args)
    for f in fogli:
        f.unlink()


foglio(sorted(OUT.glob("*.mp4")), 1, "_contatto.jpg", 46)
foglio([OUT / "feed.mp4", OUT / "chi.mp4"], 6, "_contatto6.jpg", 34)
print("fogli:", OUT / "_contatto.jpg", OUT / "_contatto6.jpg")
