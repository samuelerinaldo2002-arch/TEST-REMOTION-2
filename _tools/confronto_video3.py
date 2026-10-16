# -*- coding: utf-8 -*-
"""Video di confronto a tre: Kallaway | PRIMA | DOPO, stessa altezza, stessi tempi (velocità reale, poi 0,5×).

    python -I _tools/confronto_video3.py <trio.json> <uscita.mp4>

trio.json: {"id": "D13", "nome": "…", "k": [72, 9.333, 14.733], "prima": ["render.mp4", 68.6, 74.0], "dopo": ["lab.mp4", 1.0, 6.4]}
Usa i lati di confronto_video.py (ritaglio area grafica, altezza 1100, etichetta sotto).
"""
import io, json, os, subprocess, sys, tempfile

sys.stdout.reconfigure(encoding="utf-8")
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, QUI)
import confronto_video as cv  # noqa: E402

c = json.load(io.open(sys.argv[1], encoding="utf-8"))
out = os.path.abspath(sys.argv[2])
tmp = tempfile.mkdtemp(prefix="trio_")
n, k0, k1 = c["k"]
pf, p0, p1 = c["prima"]
df, d0, d1 = c["dopo"]
ab = lambda f: f if os.path.isabs(f) else os.path.abspath(os.path.join(cv.CARTELLA, f))
dur = max(k1 - k0, p1 - p0, d1 - d0)
pezzi = []
for kk in (1, 2):
    tag = "" if kk == 1 else "  ·  0,5×"
    a, b, d, o = (os.path.join(tmp, f"{kk}_{x}.mp4") for x in ("k", "p", "d", "o"))
    cv.lato(os.path.join(cv.CARTELLA, cv.INV[n]["file"]), k0, k1, "crop=iw:ih*0.58:0:0", dur, f"KALLAWAY · reel {n}{tag}", a, kk)
    cv.lato(ab(pf), p0, p1, "crop=iw:ih*1385/1920:0:0", dur, f"PRIMA{tag}", b, kk)
    cv.lato(ab(df), d0, d1, "crop=iw:ih*1385/1920:0:0", dur, f"DOPO{tag}", d, kk)
    titolo = f"{c['id']} · {c['nome']}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a, "-i", b, "-i", d, "-filter_complex",
                    f"[0:v][1:v][2:v]hstack=inputs=3,pad=iw+0:ih+90:0:90:color=0x141414,"
                    f"drawtext=fontfile='{cv.FONT}':text='{cv.esc(titolo)}':x=24:y=26:fontsize=40:fontcolor=0xCFFB50",
                    "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", o], check=True, cwd="C:\\")
    pezzi.append(o)
lista = os.path.join(tmp, "lista.txt")
with io.open(lista, "w", encoding="utf-8") as f:
    for p in pezzi:
        f.write(f"file '{p}'\n")
os.makedirs(os.path.dirname(out), exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", out], check=True, cwd="C:\\")
print("ok", out)
