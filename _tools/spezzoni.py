# Spezzoni dei reel finiti di Samuele per le infografiche: 30 fps, un fotogramma chiave al secondo, senza audio,
# più un foglio di contatto (un fotogramma al secondo per spezzone) per controllare che non partano su schermate o flash.
# Uso: python -I _tools/spezzoni.py <cartella_reel> <lista.txt>
#   lista.txt: una riga per spezzone → "id  giorno(01..08)  inizio  durata  [larghezza=540]"  (# = commento)
#   spezzone composto (due tagli uniti, es. due blocchi di facecam puliti): "id 01 19.1 5.0 720 + 06 28.0 5.0"
# Scrive <cartella_reel>/assets/clips/<id>.mp4 e <cartella_reel>/assets/clips/_contatto.jpg
import subprocess, sys
from pathlib import Path

SRC = Path("D:/CONTENUTI/OTTOBRE 2026/PARTE 1/DA PUBBLICARE")
FILES = {p.name[8:10]: p for p in SRC.glob("2026-10-0*REEL.mp4")}

out = Path(sys.argv[1]) / "assets" / "clips"
out.mkdir(parents=True, exist_ok=True)
righe = [r.split() for r in Path(sys.argv[2]).read_text(encoding="utf-8").splitlines() if r.strip() and not r.lstrip().startswith("#")]
fogli, larg = [], []
for r in righe:
    parti = " ".join(r).split("+")
    p0 = parti[0].split()
    cid, w = p0[0], int(p0[4]) if len(p0) > 4 else 540
    segs = [(p0[1].zfill(2), float(p0[2]), float(p0[3]))] + [(q.split()[0].zfill(2), float(q.split()[1]), float(q.split()[2])) for q in parti[1:]]
    dur = sum(x[2] for x in segs)
    dst = out / f"{cid}.mp4"
    args = ["ffmpeg", "-v", "error", "-y"]
    for dd, t0, du in segs:
        args += ["-ss", f"{t0:.3f}", "-t", f"{du:.3f}", "-i", str(FILES[dd])]
    fc = "".join(f"[{i}:v]fps=30,scale={w}:-2:flags=lanczos,setsar=1[v{i}];" for i in range(len(segs))) + "".join(f"[v{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[vo]"
    args += ["-filter_complex", fc, "-map", "[vo]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", "-movflags", "+faststart", str(dst)]
    subprocess.run(args, check=True)
    dd, t0 = segs[0][0], segs[0][1]
    sheet = out / f"_c_{cid}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(dst), "-vf", f"fps=1,scale=160:-2,tile={max(1, int(dur + 0.999))}x1", "-frames:v", "1", str(sheet)], check=True)
    fogli.append(sheet)
    larg.append(160 * max(1, int(dur + 0.999)))
    print(f"{cid}: " + " + ".join(f"{FILES[a].name} {b}-{b + c:.1f} s" for a, b, c in segs) + f" → {dst.name} ({w} px)")
# foglio unico: una riga per spezzone
args = ["ffmpeg", "-v", "error", "-y"]
for f in fogli:
    args += ["-i", str(f)]
n = len(fogli)
pads = "".join(f"[{i}:v]pad={max(larg)}:ih:0:0:color=black[p{i}];" for i in range(n))
args += ["-filter_complex", pads + "".join(f"[p{i}]" for i in range(n)) + f"vstack=inputs={n}", str(out / "_contatto.jpg")]
subprocess.run(args, check=True)
for f in fogli:
    f.unlink()
print("foglio:", out / "_contatto.jpg")
