# 8 tagli a caso (seme fisso) da segmenti grafici giu-ott-dark >= 3 s, reel diversi, + anteprime compatte (graphic band)
import io, json, os, random, sys
import numpy as np, cv2
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
AN = "CATALOGO-ANIMAZIONI/_analisi"
ev = json.load(io.open(os.path.join(AN, "ritmo", "backup", "eventi.json") if os.path.exists(os.path.join(AN, "ritmo", "backup", "eventi.json")) else os.path.join(AN, "eventi.json"), encoding="utf-8"))
inv = {r["n"]: r for r in json.load(io.open("TUTTI-I-REEL/_inventario.json", encoding="utf-8"))}
cand = []
for e in ev:
    if e["era"] != "giu-ott-dark" or e["n"] in (72, 100, 56, 69):
        continue
    for s in e["segmenti"]:
        if s["tipo"] == "grafica" and s["t0"] > 0 and s["dur"] >= 3.0:
            cand.append((e["n"], s["t0"], s["dur"]))
rnd = random.Random(20261012)
rnd.shuffle(cand)
scelti, visti = [], set()
for n, t0, d in cand:
    if n in visti:
        continue
    scelti.append((n, t0, d)); visti.add(n)
    if len(scelti) == 8:
        break
nominati = [(72, 9.333, 2.5), (100, 94.36, 3.0), (56, 11.5, 7.1), (69, 10.761, 3.7)]
tutti = nominati + scelti
print(json.dumps(tutti))
json.dump(tutti, io.open(os.path.join(AN, "ritmo", "deriva", "campione.json"), "w"), indent=0)
# anteprime: per taglio una riga di 7 fotogrammi (0..3 s), banda grafica y 0-1100
def frame(path, t):
    cap = cv2.VideoCapture(path); fps = cap.get(cv2.CAP_PROP_FPS)
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps))); ok, f = cap.read(); cap.release()
    f = cv2.resize(f, (1080, 1920), interpolation=cv2.INTER_AREA)
    return f
righe = []
for k, (n, t0, d) in enumerate(tutti):
    path = inv[n]["file"]
    cells = []
    for dt in (0.08, 0.5, 1.0, 1.5, 2.0, 2.5, 2.95):
        if dt > d - 0.05:
            cells.append(np.full((366, 270, 3), 25, np.uint8)); continue
        f = frame(path, t0 + dt)[0:1100]
        # griglia di riferimento ogni 100 px (per scegliere le maschere)
        for x in range(0, 1080, 100): cv2.line(f, (x, 0), (x, 1100), (60, 60, 160), 1)
        for y in range(0, 1100, 100): cv2.line(f, (0, y), (1080, y), (60, 60, 160), 1)
        c = cv2.resize(f, (270, 366), interpolation=cv2.INTER_AREA)
        cv2.putText(c, f"+{dt:.1f}", (4, 16), 0, 0.45, (255, 255, 255), 1)
        cells.append(c)
    row = np.hstack(cells)
    lab = np.full((24, row.shape[1], 3), 12, np.uint8)
    cv2.putText(lab, f"#{k} reel {n} taglio {t0:.3f}s (seg {d:.1f}s) - griglia rossa ogni 100 px", (6, 17), 0, 0.5, (255, 255, 255), 1)
    righe.append(np.vstack([lab, row]))
os.makedirs(os.path.join(AN, "ritmo", "deriva"), exist_ok=True)
for b in range(0, len(righe), 4):
    cv2.imwrite(os.path.join(AN, "ritmo", "deriva", f"anteprima_{b // 4}.jpg"), np.vstack(righe[b:b + 4]), [cv2.IMWRITE_JPEG_QUALITY, 82])
print("ok")
