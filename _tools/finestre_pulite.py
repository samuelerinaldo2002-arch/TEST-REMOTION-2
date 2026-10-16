# Trova nei reel finiti (DA PUBBLICARE) le finestre senza flash né cambi di inquadratura: luminanza media a 10 fps stabile
# (salto tra fotogrammi < soglia, secondo argomento: 6 = niente tagli, 20 = tagli sì ma niente flash) e lontana dal nero delle grafiche. Uso: python -I _tools/finestre_pulite.py [min_s=5.5]
import subprocess, sys
from pathlib import Path
SRC = Path("D:/CONTENUTI/OTTOBRE 2026/PARTE 1/DA PUBBLICARE")
MIN = float(sys.argv[1]) if len(sys.argv) > 1 else 5.5
for f in sorted(SRC.glob("2026-10-0*REEL.mp4")):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(f), "-vf", "fps=10,scale=270:-2,signalstats,metadata=mode=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"], capture_output=True, text=True).stdout
    Y = [float(l.split("=")[1]) for l in out.splitlines() if "YAVG" in l]
    wins, s = [], 0
    for i in range(1, len(Y) + 1):
        if i == len(Y) or abs(Y[i] - Y[i - 1]) > float(sys.argv[2] if len(sys.argv) > 2 else 6) or Y[i] < 60:
            if (i - s) / 10 >= MIN and min(Y[s:i]) >= 60: wins.append((s / 10, i / 10))
            s = i
    print(f.name[8:10], " ".join(f"{a:.1f}-{b:.1f}" for a, b in wins))
