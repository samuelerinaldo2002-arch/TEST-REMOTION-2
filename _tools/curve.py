# -*- coding: utf-8 -*-
"""Stima la curva di easing (cubic-bezier, come in After Effects / CSS) dei movimenti di camera di Kallaway.

    _tools/venv/Scripts/python.exe -I _tools/curve.py

Legge eventi.json + metriche/*.npz, prende i movimenti veloci (picco > 1500 px/s, durata >= 0,45 s)
e per ciascuno trova il cubic-bezier(x1,y1,x2,y2) che meglio descrive lo spostamento cumulato.
Uscita: CATALOGO-ANIMAZIONI/_analisi/curve.json
"""
import io, json, os, sys
import numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
AN = os.path.join(os.path.dirname(QUI), "CATALOGO-ANIMAZIONI", "_analisi")

G = np.round(np.arange(0, 1.0001, 0.05), 3)
T = np.linspace(0, 1, 400)


def bez_curves():
    """for every (x1,y1,x2,y2) on the grid: y as a function of x sampled on 41 x points"""
    params, curves = [], []
    xs = np.linspace(0, 1, 41)
    for x1 in G:
        for y1 in G:
            for x2 in G:
                for y2 in G:
                    bx = 3 * (1 - T) ** 2 * T * x1 + 3 * (1 - T) * T ** 2 * x2 + T ** 3
                    by = 3 * (1 - T) ** 2 * T * y1 + 3 * (1 - T) * T ** 2 * y2 + T ** 3
                    if np.any(np.diff(bx) < -1e-9):
                        continue
                    params.append((x1, y1, x2, y2))
                    curves.append(np.interp(xs, bx, by))
    return np.array(params), np.array(curves)


def main():
    ev = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
    params, curves = bez_curves()
    print(f"{len(params)} curve candidate")
    xs = np.linspace(0, 1, 41)
    gruppi = {"veloci_in_scena": [], "arrivi_dopo_taglio": [], "lenti": []}
    for e in ev:
        if e["era"] != "giu-ott-dark":
            continue
        z = np.load(os.path.join(AN, "metriche", e["codice"] + ".npz"))
        m, cols, fps = z["m"], list(z["cols"]), float(z["fps"])
        g = lambda k: m[:, cols.index(k)].astype(np.float64)
        inl = g("inl")
        spd = np.where(inl >= 15, np.hypot(g("tx"), g("ty")), 0) + np.abs(np.log(np.maximum(g("sc"), 1e-3))) * 900 * (inl >= 15)
        for mv in e["movimenti"]:
            if mv["dur"] < 0.45:
                continue
            i0 = int(round(mv["t0"] * fps)); i1 = i0 + int(round(mv["dur"] * fps))
            prof = spd[i0:i1]
            if len(prof) < 8 or prof.sum() <= 0:
                continue
            if mv["dopo_taglio"] and mv["v_picco_px_s"] > 900:
                key = "arrivi_dopo_taglio"
            elif mv["v_picco_px_s"] > 1500:
                key = "veloci_in_scena"
            elif 150 < mv["v_picco_px_s"] < 700 and mv["dur"] >= 0.8:
                key = "lenti"
            else:
                continue
            # include the frame before (motion starts from 0)
            cum = np.concatenate([[0], np.cumsum(prof)])
            y = np.interp(xs, np.linspace(0, 1, len(cum)), cum / cum[-1])
            err = np.sqrt(np.mean((curves - y) ** 2, axis=1))
            k = int(np.argmin(err))
            gruppi[key].append({"reel": e["n"], "t0": mv["t0"], "dur": mv["dur"], "v": mv["v_picco_px_s"],
                                "bezier": [float(v) for v in params[k]], "err": round(float(err[k]), 4)})
    out = {}
    for key, lst in gruppi.items():
        if not lst:
            continue
        B = np.array([x["bezier"] for x in lst])
        D = np.array([x["dur"] for x in lst])
        # the "median curve": average the fitted curves point-wise, then refit one bezier to it
        idx = [int(np.argmin(np.sqrt(np.mean((curves - np.interp(xs, xs, 0 * xs + 0) ) ** 2, axis=1))))]  # placeholder
        fitted = []
        for x in lst:
            p = np.array(x["bezier"])
            k = int(np.argmin(np.abs(params - p).sum(axis=1)))
            fitted.append(curves[k])
        meanc = np.median(np.array(fitted), axis=0)
        err = np.sqrt(np.mean((curves - meanc) ** 2, axis=1))
        k = int(np.argmin(err))
        out[key] = {"n": len(lst), "durata_mediana_s": round(float(np.median(D)), 3), "durata_p25_p75": [round(float(np.percentile(D, 25)), 3), round(float(np.percentile(D, 75)), 3)],
                    "bezier_curva_mediana": [float(v) for v in params[k]], "errore": round(float(err[k]), 4),
                    "bezier_mediana_parametri": [round(float(v), 2) for v in np.median(B, axis=0)],
                    "curva_mediana_campioni": [round(float(v), 3) for v in meanc[::4]],
                    "esempi": sorted(lst, key=lambda x: x["err"])[:12]}
        print(key, json.dumps({k2: v for k2, v in out[key].items() if k2 != "esempi"}, ensure_ascii=False))
    with io.open(os.path.join(AN, "curve.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
