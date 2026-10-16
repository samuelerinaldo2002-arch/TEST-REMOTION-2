# rumore per fotogramma di tx/ty sui tratti fermi + proprieta' video
import io, os, json, sys
import numpy as np, cv2
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
MET = os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi", "metriche")
inv = json.load(io.open(os.path.join(ROOT, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
dark = [r for r in inv if r["data"] >= "2026-06-01"]
allv, fpsl, res = [], [], {}
for r in dark[::7]:
    z = np.load(os.path.join(MET, r["codice"] + ".npz"))
    m, cols, fps = z["m"], list(z["cols"]), float(z["fps"])
    g = lambda k: m[:, cols.index(k)].astype(np.float64)
    tx, ty, inl, sc = g("tx"), g("ty"), g("inl"), g("sc")
    v = inl >= 15
    sp = np.hypot(tx, ty)[v]
    allv.append(sp)
    cap = cv2.VideoCapture(os.path.join(ROOT, r["file"]))
    res[r["n"]] = (int(cap.get(3)), int(cap.get(4)), round(cap.get(5), 3), int(cap.get(7)))
    cap.release()
    fpsl.append(fps)
sp = np.concatenate(allv)
print("speed percentiles px/frame (valid frames):", [round(float(np.percentile(sp, q)), 3) for q in (5, 10, 25, 50, 75, 90)])
print("fps:", sorted(set(round(f, 2) for f in fpsl)))
print("res:", res)
