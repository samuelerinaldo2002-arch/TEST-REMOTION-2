# -*- coding: utf-8 -*-
"""Video affiancato KALLAWAY | COPIA di tutto il reel 79, senza audio (blocco C1).

    _tools/venv/Scripts/python.exe -I affiancato.py
→ CATALOGO-ANIMAZIONI/_analisi/confronti-video/r79_copia_affiancato.mp4 (1080×960: due colonne 540×960, 30 fps, crf 22),
con l'etichetta, il tempo e la linea rossa della safe zone a 1332 su entrambi (sulla copia è il limite della grafica).
"""
import os, subprocess

QUI = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
K = os.path.join(PROJ, "77_2026-07-08_DaiCxAkOpNb.mp4")
C = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "_analisi", "render", "copia-01_bozza.mp4")
OUT = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "_analisi", "confronti-video", "r79_copia_affiancato.mp4")
os.makedirs(os.path.dirname(OUT), exist_ok=True)
font = "C\\:/Windows/Fonts/arialbd.ttf"
lab = lambda t: (f"drawtext=fontfile='{font}':text='{t}':x=12:y=12:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6,"
                 "drawbox=x=0:y=666:w=540:h=2:color=red@0.7:t=fill")
vf = (f"[0:v]fps=30,scale=540:960:flags=lanczos,setsar=1,{lab('KALLAWAY')}[a];"
      f"[1:v]fps=30,scale=540:960:flags=lanczos,setsar=1,{lab('COPIA')},"
      f"drawtext=fontfile='{font}':text='%{{pts\\:hms}}':x=w-tw-12:y=12:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6[b];"
      "[a][b]hstack=2[v]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", K, "-i", C, "-filter_complex", vf, "-map", "[v]", "-an", "-t", "107.6",
                "-c:v", "libx264", "-crf", "22", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT], check=True, cwd="C:\\")
print(OUT)
