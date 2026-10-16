import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comune import *
utf8_stdout()
ev = eventi()
n = int(sys.argv[1]) if len(sys.argv) > 1 else 63
e = ev[n]
z = np.load(os.path.join(MET, e["codice"] + ".npz"))
m, cols, fps = z["m"], list(z["cols"]), float(z["fps"])
g = lambda k: m[:, cols.index(k)].astype(np.float64)
dall, hist, inl, lt = g("dall"), g("hist"), g("inl"), g("lt")
cuts = [int(round(t * fps)) for t in e["tagli"]]
print("fps", fps, "n", len(m), "cuts", cuts)
for c in cuts:
    print(c, round(c / fps, 2), "dall", [round(x, 1) for x in dall[c-2:c+3]], "hist", [round(x, 2) for x in hist[c-1:c+2]], "inl", inl[c-1:c+2].tolist())
# distribution of dall outside cuts
mask = np.ones(len(m), bool)
for c in cuts:
    mask[max(0, c-2):c+3] = False
print("dall pctl non-cut", np.percentile(dall[mask], [50, 90, 99, 99.9]).round(2), "max", dall[mask].max().round(1))
print("hist pctl non-cut", np.percentile(hist[mask], [0.1, 1, 10, 50]).round(3))
# relaxed candidates
cand = []
for i in range(1, len(m)):
    base = np.median(dall[max(0, i - 6):i]) if i > 1 else dall[i]
    sp = dall[i] > 6 and dall[i] > 1.8 * (base + 2.0)
    if (sp and inl[i] < 15) or hist[i] < 0.85:
        if all(abs(i - c) > 3 for c in cuts) and (not cand or i - cand[-1] > 3):
            cand.append(i)
print("cand", len(cand), [(i, round(i / fps, 2), round(dall[i], 1), round(hist[i], 2), int(inl[i])) for i in cand])
