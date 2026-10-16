# -*- coding: utf-8 -*-
"""Censimento automatico di effetti su tutti i reel (dalle metriche per fotogramma + eventi.json).

    _tools/venv/Scripts/python.exe -I _tools/censimento.py

Conta per reel e per era: flash/light leak (picchi di luminanza di 1-4 fotogrammi), transizioni sfocate
(crollo di nitidezza senza movimento di camera = zoom/rack blur), whip veloci (>3000 px/s), punch-in rapidi
(zoom >=8% in <=0,35 s), drift lenti. Uscita: CATALOGO-ANIMAZIONI/_analisi/censimento.json
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
AN = os.path.join(os.path.dirname(QUI), "CATALOGO-ANIMAZIONI", "_analisi")


def main():
    ev = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
    out, per_era = [], {}
    for e in ev:
        z = np.load(os.path.join(AN, "metriche", e["codice"] + ".npz"))
        m, cols, fps = z["m"], list(z["cols"]), float(z["fps"])
        g = lambda k: m[:, cols.index(k)].astype(np.float64)
        lt, shp, inl = g("lt"), g("shp"), g("inl")
        spd = np.where(inl >= 15, np.hypot(g("tx"), g("ty")), 0) * fps
        sc = np.where(inl >= 15, g("sc"), 1.0)
        n = len(m)
        flash, blurtr = [], []
        i = 6
        while i < n - 8:
            ref = max(np.median(lt[i - 6:i - 2]), np.median(lt[i + 4:i + 8]))
            if lt[i] > 110 and lt[i] - ref > 45:
                j = i
                while j < n - 1 and lt[j] - ref > 45 and j - i < 6:
                    j += 1
                if j - i <= 4:
                    flash.append(round(i / fps, 3))
                i = j + 4
                continue
            i += 1
        i = 12
        while i < n - 8:
            base = np.median(shp[i - 12:i - 3])
            if base > 150 and shp[i] < 0.3 * base and spd[i] < 600:
                j = i
                while j < n - 1 and shp[j] < 0.5 * base and j - i < 10:
                    j += 1
                if 1 <= j - i <= 8 and np.median(shp[j:j + 6]) > 0.5 * base:
                    blurtr.append((i, j))
                i = j + 6
                continue
            i += 1
        path = os.path.join(os.path.dirname(QUI), e.get("file", ""))
        cap = cv2.VideoCapture(path) if e.get("file") else None
        def frame(k):
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(k)); ok, fr = cap.read()
            return cv2.resize(fr, (180, 320), interpolation=cv2.INTER_AREA).astype(np.float32) if ok else None
        bt = []
        for (a, b) in blurtr:
            f0, f1, fm = frame(a - 4), frame(b + 4), frame(a + (b - a) // 2) if cap else (None, None, None)
            if f0 is None or f1 is None:
                continue
            g0 = cv2.cvtColor(f0, cv2.COLOR_BGR2GRAY)[10:180]; g1 = cv2.cvtColor(f1, cv2.COLOR_BGR2GRAY)[10:180]
            corr = float(np.corrcoef(g0.ravel(), g1.ravel())[0, 1])
            bt.append({"t": round(a / fps, 3), "durata": round((b - a) / fps, 3), "stesso_contenuto": corr > 0.75, "corr": round(corr, 2)})
        blurtr = bt
        fl = []
        for t in flash:
            f = frame(int(round(t * fps)) + 1) if cap else None
            if f is None:
                continue
            bm, gm, rm = (float(f[..., c].mean()) for c in range(3))
            tipo = "bianco" if abs(rm - bm) < 25 else ("caldo" if rm > bm else "freddo")
            fl.append({"t": t, "tipo": tipo, "rgb": [round(rm), round(gm), round(bm)]})
        flash = fl
        if cap:
            cap.release()
        mv = e["movimenti"]
        whip = [x for x in mv if x["v_picco_px_s"] > 3000]
        punch = [x for x in mv if x["zoom"] >= 1.08 and x["dur"] <= 0.35]
        drift = [x for x in mv if x["v_picco_px_s"] < 250 and x["dur"] >= 1.0]
        r = {"n": e["n"], "codice": e["codice"], "era": e["era"], "minuti": e["durata"] / 60,
             "flash": flash, "transizioni_sfocate": blurtr, "whip": len(whip), "punch_in": len(punch), "drift": len(drift),
             "arrivi_in_moto": sum(1 for s in e["segmenti"] if "arrivo_in_moto" in s), "tagli": len(e["tagli"])}
        out.append(r)
        a = per_era.setdefault(e["era"], {"reel": 0, "minuti": 0, "flash": 0, "reel_con_flash": 0, "transizioni_sfocate": 0,
                                          "whip": 0, "punch_in": 0, "drift": 0, "arrivi_in_moto": 0, "tagli": 0})
        a["reel"] += 1; a["minuti"] += r["minuti"]
        a["flash"] += len(flash); a["reel_con_flash"] += 1 if flash else 0
        a.setdefault("flash_tipi", {})
        for f in flash:
            a["flash_tipi"][f["tipo"]] = a["flash_tipi"].get(f["tipo"], 0) + 1
        a["transizioni_sfocate"] += len(blurtr)
        a["sfocate_stesso_contenuto"] = a.get("sfocate_stesso_contenuto", 0) + sum(1 for b in blurtr if b["stesso_contenuto"])
        for k in ("whip", "punch_in", "drift", "arrivi_in_moto", "tagli"):
            a[k] += r[k]
    for k, a in per_era.items():
        mi = a["minuti"]
        a["per_minuto"] = {x: round(a[x] / mi, 2) for x in ("flash", "transizioni_sfocate", "whip", "punch_in", "drift", "arrivi_in_moto", "tagli")}
        a["minuti"] = round(mi, 1)
    with io.open(os.path.join(AN, "censimento.json"), "w", encoding="utf-8") as f:
        json.dump({"per_era": per_era, "per_reel": out}, f, ensure_ascii=False, indent=1)
    print(json.dumps(per_era, ensure_ascii=False, indent=1))
    top = sorted(out, key=lambda r: -len(r["flash"]))[:8]
    print("reel con piu' flash:", [(r["n"], len(r["flash"]), [(f["t"], f["tipo"]) for f in r["flash"][:3]]) for r in top])
    top = sorted(out, key=lambda r: -len(r["transizioni_sfocate"]))[:8]
    print("reel con piu' transizioni sfocate:", [(r["n"], [(b["t"], b["stesso_contenuto"]) for b in r["transizioni_sfocate"][:4]]) for r in top])


if __name__ == "__main__":
    main()
