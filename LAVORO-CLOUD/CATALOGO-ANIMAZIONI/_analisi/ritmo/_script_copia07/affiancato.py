# -*- coding: utf-8 -*-
"""Video affiancato KALLAWAY | COPIA di tutto il reel 5, senza audio (blocco C2; copia di _script_copia01/affiancato.py senza
il cwd di Windows e col font di Linux).

    _tools/venv/bin/python -I affiancato.py
→ CATALOGO-ANIMAZIONI/_analisi/confronti-video/r05_copia_affiancato.mp4 (1080×960: due colonne 540×960, 30 fps, crf 26),
con l'etichetta, il tempo e la linea rossa della safe zone a 1332 su entrambi (sulla copia è il limite della grafica).
"""
import os, subprocess

QUI = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
K = os.path.join(PROJ, "03_2026-10-04_DeFA_f1uwLt.mp4")
C = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "_analisi", "render", "copia-02_bozza.mp4")
OUT = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "_analisi", "confronti-video", "r05_copia_affiancato.mp4")
os.makedirs(os.path.dirname(OUT), exist_ok=True)
font = next((f for f in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"] if os.path.exists(f)), None)
ff = f"fontfile='{font}':" if font else ""
lab = lambda t: (f"drawtext={ff}text='{t}':x=12:y=12:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6,"
                 "drawbox=x=0:y=666:w=540:h=2:color=red@0.7:t=fill")
vf = (f"[0:v]fps=30,scale=540:960:flags=lanczos,setsar=1,{lab('KALLAWAY')}[a];"
      f"[1:v]fps=30,scale=540:960:flags=lanczos,setsar=1,{lab('COPIA')},"
      f"drawtext={ff}text='%{{pts\\:hms}}':x=w-tw-12:y=12:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6[b];"
      "[a][b]hstack=2[v]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", K, "-i", C, "-filter_complex", vf, "-map", "[v]", "-an", "-t", "122.09",
                "-c:v", "libx264", "-crf", "26", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT], check=True)
print(OUT)
