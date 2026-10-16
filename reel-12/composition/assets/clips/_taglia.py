# Spezzoni PROVVISORI del reel 12/10, tagliati dalle COPIE LOCALI dei tuoi reel finiti: l'11/10 il disco D: con DA PUBBLICARE era
# scollegato. Le copie sono gli spezzoni già estratti per reel-09/10/11 e per la demo-6 (30 fps, senza audio). Quando D: torna,
# le clip uguali a momenti già usati nei reel 09/10 (e 11/13) si rifanno da DA PUBBLICARE con gli stessi id e le stesse durate
# (piano in ../../spezzoni.txt).
# Uscita: <id>.mp4 9:16, 30 fps, un fotogramma chiave al secondo, senza audio · _contatto.jpg (una riga per clip, 2 fps).
# Controlli: (1) niente salti di luminanza da flash (> 28/255 tra due fotogrammi) dentro un pezzo; (2) nessuna coppia di clip
# mostra lo stesso pezzo di reel nello stesso istante (scarto < 1,5 s).
# Uso: python -I reel-12/assets/clips/_taglia.py
import subprocess, sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
TK = QUI.parents[2]
D6 = TK / "CATALOGO-ANIMAZIONI/demo-6/assets/clips/mio"
# sorgente → (file, 3:4?, [(pezzo, t0, t1)]) · pezzo W* = facecam (finestra pulita del reel originale), G* = grafica del tuo reel
SRC = {
    "C": (TK / "reel-11/assets/clips/c.mp4", 0, [("W5", 0, 5.0), ("W6", 5.0, 10.0), ("W2", 10.0, 12.3)]),
    "P": (TK / "reel-11/assets/clips/p.mp4", 0, [("W7", 0, 5.3), ("W8", 5.3, 10.26)]),
    "A": (TK / "reel-11/assets/clips/a.mp4", 0, [("W1", 0, 3.8), ("W2", 3.8, 7.8), ("W3", 7.8, 12.7), ("W4", 12.7, 13.86)]),
    "ST": (TK / "reel-10/assets/clips/st.mp4", 0, [("W1", 0, 4.8), ("W3", 4.9, 9.8)]),
    "FC": (TK / "reel-10/assets/clips/feedc.mp4", 0, [("W9", 0.1, 4.8), ("W10", 4.8, 8.73)]),
    "BIG1": (TK / "reel-09/assets/clips/big1.mp4", 0, [("G11", 5.7, 7.2)]),
    "BIG2": (TK / "reel-09/assets/clips/big2.mp4", 0, [("G10", 0, 5.0)]),
    "V01": (D6 / "v01.mp4", 0, [("W16", 0, 3.2), ("G1", 3.3, 6.0)]),
    "V02": (D6 / "v02.mp4", 0, [("W11", 0, 4.2), ("G2", 4.6, 6.0)]),
    "V03": (D6 / "v03.mp4", 0, [("G3", 0, 3.1), ("W17", 3.3, 6.0)]),
    "M05": (D6 / "m05.mp4", 1, [("G5", 0.9, 6.0)]),
    "M06": (D6 / "m06.mp4", 1, [("G6", 0, 4.4), ("W18", 4.55, 6.0)]),
    "M07": (D6 / "m07.mp4", 1, [("G7", 0, 4.7), ("W19", 4.8, 6.0)]),
    "M08": (D6 / "m08.mp4", 1, [("G8", 0, 6.0)]),
    "M09": (D6 / "m09.mp4", 1, [("W20", 0, 2.1), ("G9", 2.6, 6.0)]),
}
# pezzi che sono lo stesso momento in copie diverse: istante d'inizio nel reel originale
W0 = {"W1": 19.1, "W2": 44.2, "W3": 28.0, "W4": 14.4, "W5": 37.7, "W6": 36.7, "W7": 14.0, "W8": 42.7, "W9": 9.4, "W10": 20.4}
# clip: id → (inizio nella composizione, larghezza, [(sorgente, t0, t1), …])
CLIPS = {
    # la prima strada (0–26 s): b0 = il hook (faccia), r1…r4 = la fila dei contenuti che diventano cartelloni, b3/b4 i cartelloni dopo
    "b0": (0.0, 720, [("C", 0, 5.0), ("C", 5.0, 9.0)]),
    "r1": (1.4, 540, [("M08", 0, 6.0), ("M05", 0.9, 6.0)]),
    "r2": (1.4, 720, [("BIG2", 0, 5.0), ("V03", 0, 3.1), ("M09", 2.6, 5.6), ("P", 0, 5.3), ("P", 5.3, 5.5)]),
    "r3": (1.4, 540, [("V01", 3.3, 6.0)]),
    "r4": (1.4, 540, [("M07", 0, 2.8)]),
    "b3": (11.0, 540, [("M06", 0, 4.4), ("V03", 3.3, 6.0), ("M08", 0, 6.0), ("V02", 4.6, 5.7)]),
    "b4": (17.8, 540, [("M05", 0.9, 5.3), ("V02", 0, 3.4)]),
    # la regola (28,9–41,03 s): t1–t7 fino a 35,3 s, t8–t10 fino alla fine
    "t1": (28.9, 540, [("ST", 0, 4.8), ("BIG1", 5.7, 7.2), ("M07", 4.8, 4.9)]),
    "t2": (28.9, 540, [("A", 3.8, 7.8), ("V01", 3.3, 5.7)]),
    "t3": (28.9, 540, [("BIG2", 0, 5.0), ("M06", 4.55, 5.95)]),
    "t4": (28.9, 540, [("C", 0, 5.0), ("M09", 0.7, 2.1)]),
    "t5": (28.9, 540, [("M07", 0, 4.7), ("V01", 0, 1.7)]),
    "t6": (28.9, 540, [("P", 0, 5.3), ("V02", 4.6, 5.7)]),
    "t7": (28.9, 540, [("M05", 0.9, 6.0), ("V03", 3.3, 4.5)]),
    "t8": (28.9, 540, [("FC", 0.1, 4.8), ("M06", 0, 4.4), ("ST", 4.9, 7.93)]),
    "t9": (28.9, 720, [("C", 5.0, 10.0), ("V03", 0, 3.1), ("V02", 0, 4.03)]),
    "t10": (28.9, 720, [("P", 5.3, 10.26), ("M08", 0, 4.0), ("A", 0, 3.17)]),
}


def piece(src, t):
    ws = SRC[src][2]
    for w, a, b in ws:
        if a - 1e-6 <= t < b - 1e-6 or (w, a, b) == ws[-1] and abs(t - b) < 0.05:
            return w, W0.get(w, 0) + (t - a) if w in W0 else (src + w, t)
    raise ValueError(f"{src} {t}: fuori dai pezzi controllati")


def timeline(cid):
    t, out = CLIPS[cid][0], []
    for s, a, b in CLIPS[cid][2]:
        out.append((t, t + (b - a), s, a))
        t += b - a
    return out


err = []
ids = list(CLIPS)
for i, a in enumerate(ids):
    for b in ids[i + 1:]:
        for ga0, ga1, sa, ta in timeline(a):
            for gb0, gb1, sb, tb in timeline(b):
                lo, hi, k = max(ga0, gb0), min(ga1, gb1), 0
                while lo + k * 0.1 < hi - 1e-6:
                    g = lo + k * 0.1
                    pa, pb = piece(sa, ta + g - ga0), piece(sb, tb + g - gb0)
                    ka = pa[0] if pa[0] in W0 else pa[1][0] if isinstance(pa[1], tuple) else pa[0]
                    same = (pa[0] == pb[0] and pa[0] in W0 and abs(pa[1] - pb[1]) < 1.5) or (pa[0] not in W0 and pa == pb)
                    if pa[0] not in W0 and pb[0] not in W0 and sa == sb and abs((ta + g - ga0) - (tb + g - gb0)) < 1.5:
                        same = True
                    if same:
                        err.append(f"{a} e {b} a {g:.1f} s: stesso pezzo")
                        break
                    k += 1
if err:
    print("\n".join(sorted(set(err))))
    sys.exit("ERRORE: pezzi uguali nello stesso istante")

for cid, (g0, w, segs) in CLIPS.items():
    h = round(w * 16 / 9 / 2) * 2
    args = ["ffmpeg", "-v", "error", "-y"]
    for s, a, b in segs:
        args += ["-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", str(SRC[s][0])]
    vf = lambda i, s: f"[{i}:v]fps=30,scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h},setsar=1[v{i}];"
    fc = "".join(vf(i, s) for i, (s, a, b) in enumerate(segs)) + "".join(f"[v{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[vo]"
    dst = QUI / f"{cid}.mp4"
    args += ["-filter_complex", fc, "-map", "[vo]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", "-movflags", "+faststart", str(dst)]
    subprocess.run(args, check=True)
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(dst), "-vf", "scale=135:-2,signalstats,metadata=mode=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"], capture_output=True, text=True).stdout
    Y = [float(l.split("=")[1]) for l in out.splitlines() if "YAVG" in l]
    cuts, t = [], 0
    for s, a, b in segs[:-1]:
        t += b - a
        cuts.append(round(t * 30))
    salti = [(round(i / 30, 2), round(Y[i] - Y[i - 1], 1)) for i in range(1, len(Y)) if abs(Y[i] - Y[i - 1]) > 28 and all(abs(i - c) > 1 for c in cuts)]
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dst)]).decode().strip())
    print(f"{cid:4s} da {g0:5.2f} s, {dur:5.2f} s, {w}x{h}, luminanza {min(Y):.0f}-{max(Y):.0f}" + (f", SALTI {salti}" if salti else ""))

fogli = []
for cid in CLIPS:
    f = QUI / f"_c_{cid}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(QUI / f"{cid}.mp4"), "-vf", "fps=2,scale=72:-2,pad=iw:ih+2:0:0:0x202020,tile=34x1:color=0x202020", "-frames:v", "1", str(f)], check=True)
    fogli.append(f)
args = ["ffmpeg", "-v", "error", "-y"]
for f in fogli:
    args += ["-i", str(f)]
args += ["-filter_complex", "".join(f"[{i}:v]" for i in range(len(fogli))) + f"vstack=inputs={len(fogli)}[o]", "-map", "[o]", str(QUI / "_contatto.jpg")]
subprocess.run(args, check=True)
for f in fogli:
    f.unlink()
print("contatto:", QUI / "_contatto.jpg")
