# -*- coding: utf-8 -*-
"""Video di confronto affiancato: Kallaway a sinistra, la nostra animazione a destra, stessa altezza, stessi tempi.

    python -I _tools/confronto_video.py <coppie.json> <uscita.mp4> [--lento]

coppie.json: [{"id": "K11", "nome": "Muro che scorre come una slot", "k": [61, 9.25, 12.25], "n": ["render.mp4", 0, 3.6]}, …]
  k = [numero del reel nell'inventario, t0, t1] · n = [video nostro (render di prova, mai 4K senza ok), t0, t1]
Ogni coppia: area grafica ritagliata (Kallaway y 0–58%, nostra y 0–1385 px su 1920), altezza 1100 px, la più corta resta
ferma sull'ultimo fotogramma; in alto ID e nome, sotto ogni lato l'etichetta. --lento aggiunge dopo ogni coppia la stessa
coppia a metà velocità. Uscita a 30 fps (h264), pronta da guardare.
"""
import io, json, os, subprocess, sys, tempfile

sys.stdout.reconfigure(encoding="utf-8")
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
FONT = "C\\:/Windows/Fonts/arialbd.ttf"
H = 1100


def esc(s):
    return s.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\u2019").replace("%", "\\%")


def lato(src, t0, t1, crop, dur, etichetta, out, k):
    """un lato: ritaglio, scala, pausa finale fino a dur, etichetta in basso; k = fattore di rallentamento"""
    vf = (f"{crop},scale=-2:{H},fps=30,setpts=(PTS-STARTPTS)*{k},tpad=stop_mode=clone:stop_duration={dur * k:.3f},"
          f"trim=duration={dur * k:.3f},drawbox=x=0:y=ih-64:w=iw:h=64:color=black@0.6:t=fill,"
          f"drawtext=fontfile='{FONT}':text='{esc(etichetta)}':x=(w-tw)/2:y=h-48:fontsize=34:fontcolor=white")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.3f}", "-t", f"{t1 - t0:.3f}", "-i", src, "-vf", vf, "-an",
                    "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", out], check=True, cwd="C:\\")


def main():
    coppie = json.load(io.open(sys.argv[1], encoding="utf-8"))
    out = os.path.abspath(sys.argv[2])
    lento = "--lento" in sys.argv
    tmp = tempfile.mkdtemp(prefix="confronto_")
    pezzi = []
    for i, c in enumerate(coppie):
        n, k0, k1 = c["k"]
        nf, n0, n1 = c["n"]
        nf = os.path.abspath(os.path.join(CARTELLA, nf)) if not os.path.isabs(nf) else nf
        dur = max(k1 - k0, n1 - n0)
        for kk in ([1, 2] if lento else [1]):
            a, b, ab = (os.path.join(tmp, f"{i:02d}_{kk}_{x}.mp4") for x in ("k", "n", "ab"))
            tag = "" if kk == 1 else "  ·  0,5×"
            lato(os.path.join(CARTELLA, INV[n]["file"]), k0, k1, "crop=iw:ih*0.58:0:0", dur, f"KALLAWAY · reel {n}{tag}", a, kk)
            lato(nf, n0, n1, "crop=iw:ih*1385/1920:0:0", dur, f"NOSTRO{tag}", b, kk)
            titolo = f"{c['id']} · {c['nome']}"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a, "-i", b, "-filter_complex",
                            f"[0:v][1:v]hstack=inputs=2,pad=iw+0:ih+90:0:90:color=0x141414,"
                            f"drawtext=fontfile='{FONT}':text='{esc(titolo)}':x=24:y=26:fontsize=40:fontcolor=0xCFFB50",
                            "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", ab], check=True, cwd="C:\\")
            pezzi.append(ab)
    # stessa larghezza per tutti i pezzi (i lati hanno proporzioni diverse): pad alla più larga, poi concat
    larg = []
    for p in pezzi:
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width", "-of", "csv=p=0", p], capture_output=True, text=True)
        larg.append(int(r.stdout.strip()))
    W = max(larg) + (max(larg) % 2)
    lista = os.path.join(tmp, "lista.txt")
    with io.open(lista, "w", encoding="utf-8") as f:
        for p, w in zip(pezzi, larg):
            q = p.replace(".mp4", "_w.mp4")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-vf", f"pad={W}:ih:(ow-iw)/2:0:color=0x141414", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", q], check=True, cwd="C:\\")
            f.write(f"file '{q}'\n")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", out], check=True, cwd="C:\\")
    print(f"ok {out} · {len(pezzi)} pezzi")


if __name__ == "__main__":
    main()
