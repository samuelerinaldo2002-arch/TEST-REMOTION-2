# Deriva della camera nei 3 s dopo un taglio, su tutti i segmenti grafici giu-ott-dark (dalle metriche per fotogramma).
import io, json, os, sys
import numpy as np
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
AN = "CATALOGO-ANIMAZIONI/_analisi"
ev = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
rows = []
for e in ev:
    if e["era"] != "giu-ott-dark":
        continue
    z = np.load(os.path.join(AN, "metriche", e["codice"] + ".npz"))
    m, cols, fps = z["m"], list(z["cols"]), float(z["fps"])
    g = lambda k: m[:, cols.index(k)].astype(np.float64)
    tx, ty, sc, inl = g("tx"), g("ty"), g("sc"), g("inl")
    valid = inl >= 15
    for s in e["segmenti"]:
        if s["tipo"] != "grafica" or s["t0"] <= 0 or s["dur"] < 2.0:
            continue
        a = int(round(s["t0"] * fps)); b = int(round(s["t1"] * fps))
        i0 = a + 2                      # salta il fotogramma del taglio e il primo dopo
        i1 = min(b - 1, a + int(round(3.0 * fps)))
        if i1 - i0 < int(1.5 * fps):
            continue
        v = valid[i0:i1]
        if v.mean() < 0.8:
            continue
        lz = np.where(v, np.log(np.maximum(sc[i0:i1], 1e-3)), 0.0)
        cz = np.cumsum(lz)                                  # log-scala cumulata
        cx = np.cumsum(np.where(v, tx[i0:i1], 0.0)); cy = np.cumsum(np.where(v, ty[i0:i1], 0.0))
        T = np.arange(1, len(cz) + 1) / fps
        def at(t):
            k = min(len(cz) - 1, int(round(t * fps)) - 1)
            return float(np.exp(cz[k]) - 1) * 100, float(np.hypot(cx[k], cy[k]))
        z05, p05 = at(0.5); z1, p1 = at(1.0); z2, p2 = at(2.0) if T[-1] >= 2 else (np.nan, np.nan)
        zf, pf = float(np.exp(cz[-1]) - 1) * 100, float(np.hypot(cx[-1], cy[-1]))
        rows.append(dict(reel=e["n"], codice=e["codice"], t0=s["t0"], dur=s["dur"], fin=round(T[-1], 2),
                         arrivo=("arrivo_in_moto" in s), z05=z05, z1=z1, z2=z2, zf=zf, p05=p05, p1=p1, p2=p2, pf=pf,
                         zmax=float(np.max(np.abs(np.exp(cz) - 1)) * 100)))
print("segmenti grafici misurati:", len(rows), "da", len({r['reel'] for r in rows}), "reel")
def q(a):
    a = np.array([x for x in a if np.isfinite(x)])
    return f"p10 {np.percentile(a,10):+.1f} · p25 {np.percentile(a,25):+.1f} · med {np.median(a):+.1f} · p75 {np.percentile(a,75):+.1f} · p90 {np.percentile(a,90):+.1f}"
for nome, sub in (("tutti", rows), ("senza arrivo in corsa", [r for r in rows if not r["arrivo"]]), ("con arrivo in corsa", [r for r in rows if r["arrivo"]])):
    print(f"\n== {nome} (n={len(sub)})")
    print(" zoom % a 0,5 s :", q([r["z05"] for r in sub]))
    print(" zoom % a 1 s   :", q([r["z1"] for r in sub]))
    print(" zoom % a 2 s   :", q([r["z2"] for r in sub]))
    print(" zoom % a fine (≤3 s):", q([r["zf"] for r in sub]))
    print(" |zoom| %       :", q([abs(r["zf"]) for r in sub]))
    print(" pan px a 1 s   :", q([r["p1"] for r in sub]))
    print(" pan px a fine  :", q([r["pf"] for r in sub]))
    zin = sum(1 for r in sub if r["zf"] > 1.5); zout = sum(1 for r in sub if r["zf"] < -1.5)
    print(f" zoom in >1,5%: {zin} ({zin/len(sub):.0%}) · zoom out <-1,5%: {zout} ({zout/len(sub):.0%}) · fermi: {len(sub)-zin-zout}")
json.dump(rows, io.open(os.path.join(AN, "ritmo", "deriva_popolazione.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
