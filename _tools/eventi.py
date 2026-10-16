# -*- coding: utf-8 -*-
"""Dalle metriche per fotogramma (analisi_movimento.py) agli eventi: tagli, segmenti, movimenti di camera.

    _tools/venv/Scripts/python.exe -I _tools/eventi.py [codice_per_debug]

Uscite in CATALOGO-ANIMAZIONI/_analisi/: eventi.json (per reel) + statistiche.json (aggregate per era).
Tutte le durate sono in secondi (convertite con l'fps di ciascun reel), le velocita' in px/s a 1080x1920.

Chiavi aggiunte l'11/10/2026 (analisi del rimbalzo, CATALOGO-ANIMAZIONI/_analisi/ritmo/rimbalzo.md), le vecchie restano
identiche. Per ogni mossa: asse (pan|zoom), spost_finale (px | fattore di zoom), overshoot (picco oltre il valore finale /
spostamento finale, curva con segno, finestra +0,6 s), picco_t_s, assest_t_s, finestra_s, inversione, significativa
(>= 40 px o zoom >= 4%), ritorno_di_precedente, valid_frac, loc_medio, ease_firmata / err_firmata (candidati di
`ease` + back.out(1), back.out(1.7), back.out(2.5)). In statistiche.json, sotto "movimenti": easing_firmata,
easing_firmata_significative, overshoot.
"""
import io, json, math, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
AN = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi")
MET = os.path.join(AN, "metriche")

# candidate easings (normalised position over normalised time)
def _p(k):
    return {
        f"power{k}.in": lambda u: u ** (k + 1),
        f"power{k}.out": lambda u: 1 - (1 - u) ** (k + 1),
        f"power{k}.inOut": lambda u: np.where(u < .5, (2 * u) ** (k + 1) / 2, 1 - (2 * (1 - u)) ** (k + 1) / 2),
    }
EASES = {"linear": lambda u: u, "sine.inOut": lambda u: (1 - np.cos(np.pi * u)) / 2, "sine.out": lambda u: np.sin(np.pi * u / 2)}
for k in (1, 2, 3, 4):
    EASES.update(_p(k))
EASES["expo.out"] = lambda u: np.where(u >= 1, 1, 1 - 2 ** (-10 * u))
EASES["expo.inOut"] = lambda u: np.where(u < .5, 2 ** (20 * u - 10) / 2, (2 - 2 ** (-20 * u + 10)) / 2)


def era(data):
    if data < "2026-04-01":
        return "feb-podcast"
    if data < "2026-05-01":
        return "apr-light"
    if data < "2026-06-01":
        return "mag-misto"
    return "giu-ott-dark"


def best_ease(disp):
    """disp = cumulative displacement samples (monotonic-ish). returns (name, rmse)"""
    if len(disp) < 4 or disp[-1] <= 0:
        return None, None
    y = disp / disp[-1]
    u = np.linspace(0, 1, len(y))
    res = {n: float(np.sqrt(np.mean((f(u) - y) ** 2))) for n, f in EASES.items()}
    n = min(res, key=res.get)
    return n, round(res[n], 4)


# ── curva FIRMATA (aggiunta 11/10/2026, analisi del rimbalzo) ─────────────────────────────────────────────────────
# `ease` qui sopra si adatta alla lunghezza di percorso cumulata (np.cumsum(mag)), che cresce sempre: non può mai
# mostrare un overshoot. Qui lo spostamento cumulato è proiettato sulla direzione principale della mossa (o, se domina
# lo zoom, il log-scala cumulato), con la finestra estesa di EXT_S oltre la fine del tratto (la fase di ritorno di un
# overshoot spesso scende sotto la soglia del tratto), mai oltre il taglio successivo. Le chiavi vecchie restano uguali.
EXT_S = 0.6
PAN_MIN, ZOOM_MIN = 40.0, 0.04      # sotto questi spostamenti il rapporto di overshoot è dominato dal rumore


def _back(s):
    return lambda u: 1 + (s + 1) * (u - 1) ** 3 + s * (u - 1) ** 2     # GSAP back.out(s)


EASES_FIRMATE = dict(EASES)
EASES_FIRMATE["back.out(1)"] = _back(1.0)
EASES_FIRMATE["back.out(1.7)"] = _back(1.70158)    # default GSAP
EASES_FIRMATE["back.out(2.5)"] = _back(2.5)


def ease_firmata(y):
    """y = spostamento cumulato con segno, normalizzato sul valore finale (può superare 1), y[0] = 0 -> (nome, rmse)"""
    if len(y) < 4 or not np.all(np.isfinite(y)):
        return None, None
    u = np.linspace(0, 1, len(y))
    res = {n: float(np.sqrt(np.mean((f(u) - y) ** 2))) for n, f in EASES_FIRMATE.items()}
    n = min(res, key=res.get)
    return n, round(res[n], 4)


def curva_firmata(i, j, b, fps, tx, ty, valid, zoom, loc):
    """mossa [i, j) nel segmento che finisce in b -> chiavi nuove: asse, overshoot, ease_firmata, ..."""
    je = min(b, j + int(round(EXT_S * fps)))
    vx = np.where(valid[i:je], tx[i:je], 0.0)
    vy = np.where(valid[i:je], ty[i:je], 0.0)
    zm = np.nan_to_num(zoom[i:je])
    r = j - i
    dx, dy, dz = float(vx[:r].sum()), float(vy[:r].sum()), float(zm[:r].sum())
    pan = math.hypot(dx, dy)
    out = {"asse": None, "spost_finale": None, "overshoot": None, "picco_t_s": None, "assest_t_s": None,
           "finestra_s": round((je - i) / fps, 3), "inversione": False, "significativa": False,
           "valid_frac": round(float(np.mean(valid[i:je])), 3), "loc_medio": round(float(np.mean(loc[i:je])), 2),
           "ease_firmata": None, "err_firmata": None, "_assest_abs": None}
    if abs(dz) * 900 > pan:
        out["asse"], noise = "zoom", 0.0004
        c = np.concatenate([[0.0], np.cumsum(zm)]) * (1.0 if dz >= 0 else -1.0)
    elif pan > 0:
        out["asse"], noise = "pan", 0.3
        c = np.concatenate([[0.0], np.cumsum((vx * dx + vy * dy) / pan)])
    else:
        return out
    kp = int(np.argmax(c))
    P = float(c[kp])
    # fine della fase di ritorno: dal picco si segue la curva finché scende (2 fotogrammi fermi = assestata)
    ks, calm, k = kp, 0, kp
    while k + 1 < len(c):
        if c[k + 1] - c[k] < -noise:
            ks, calm = k + 1, 0
        else:
            calm += 1
            if calm >= 2:
                break
        k += 1
    F = float(c[ks]) if ks > kp else float(c[-1])
    out["picco_t_s"] = round(kp / fps, 3)
    if out["asse"] == "zoom":
        out["spost_finale"] = round(float(np.exp(F if dz >= 0 else -F)), 4)
        out["significativa"] = bool(abs(math.expm1(F)) >= ZOOM_MIN)
    else:
        out["spost_finale"] = round(F, 1)
        out["significativa"] = bool(abs(F) >= PAN_MIN)
    if F <= 0 or (P - F) > 0.5 * P:
        out["inversione"] = True          # torna oltre metà strada: è una nuova mossa all'indietro, non un rimbalzo
        return out
    ov = max(0.0, P - F) / F
    out["overshoot"] = round(ov, 4)
    ke = ks if (ov >= 0.01 and ks > kp) else r
    out["assest_t_s"] = round(ke / fps, 3)
    out["_assest_abs"] = i - 1 + ke
    if c[ke] > 0:
        out["ease_firmata"], out["err_firmata"] = ease_firmata(c[:ke + 1] / c[ke])
    return out


def statistiche_firmate(mv):
    """riassunto per era delle chiavi nuove (stesso filtro dur >= 0.3 s della tabella `easing`)"""
    base = [m for m in mv if m["dur"] >= 0.3 and m.get("asse")]
    ef = {}
    for m in base:
        if m.get("ease_firmata"):
            ef[m["ease_firmata"]] = ef.get(m["ease_firmata"], 0) + 1
    val = [m for m in base if m.get("significativa") and not m.get("inversione") and not m.get("ritorno_di_precedente")
           and m.get("overshoot") is not None]
    efs = {}
    for m in val:
        if m.get("ease_firmata"):
            efs[m["ease_firmata"]] = efs.get(m["ease_firmata"], 0) + 1

    def riass(lst):
        ov = np.array([m["overshoot"] for m in lst], dtype=float)
        if not len(ov):
            return {"n": 0}
        q = lambda x: round(float((ov > x).mean()), 4)
        bins = [0, 0.01, 0.02, 0.05, 0.10, 0.20, 1e9]
        lab = ["0-1%", "1-2%", "2-5%", "5-10%", "10-20%", ">20%"]
        h = np.histogram(ov, bins=bins)[0]
        return {"n": int(len(ov)), "oltre_2": q(0.02), "oltre_5": q(0.05), "oltre_10": q(0.10),
                "percentili": {f"p{p}": round(float(np.percentile(ov, p)), 4) for p in (50, 75, 90, 95, 99)},
                "istogramma": {a: int(c) for a, c in zip(lab, h)}}
    return {
        "easing_firmata": dict(sorted(ef.items(), key=lambda x: -x[1])),
        "easing_firmata_significative": dict(sorted(efs.items(), key=lambda x: -x[1])),
        "overshoot": {
            "nota": "overshoot = picco oltre il valore finale / spostamento finale, sulla curva con segno (finestra +0,6 s). "
                    "Valutate: dur >= 0,3 s, spostamento >= 40 px o zoom >= 4%, senza inversioni e senza i tratti che sono "
                    "la fase di ritorno della mossa precedente.",
            "valutate": riass(val),
            "pan": riass([m for m in val if m["asse"] == "pan"]),
            "zoom": riass([m for m in val if m["asse"] == "zoom"]),
            "veloci": riass([m for m in val if m["v_picco_px_s"] > 1500]),
            "tutte_senza_soglia": riass([m for m in base if m.get("overshoot") is not None and not m.get("ritorno_di_precedente")]),
            "inversioni_n": sum(1 for m in base if m.get("inversione")),
            "ritorni_di_precedente_n": sum(1 for m in base if m.get("ritorno_di_precedente")),
            "n_base": len(base),
        },
    }


def pelle(path, frames):
    """quota di pixel color pelle nella fascia alta (volto a tutto schermo = parlato o clip piena)"""
    cap = cv2.VideoCapture(path)
    out = []
    for f in frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(f))
        ok, fr = cap.read()
        if not ok:
            continue
        y = cv2.cvtColor(cv2.resize(fr, (360, 640), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2YCrCb)
        reg = y[64:397, 54:306]
        m = (reg[..., 1] >= 135) & (reg[..., 1] <= 172) & (reg[..., 2] >= 80) & (reg[..., 2] <= 125) & (reg[..., 0] > 60)
        out.append(float(m.mean()))
    cap.release()
    return float(np.median(out)) if out else 0.0


def analizza(codice, data, path):
    z = np.load(os.path.join(MET, codice + ".npz"))
    m, cols, fps = z["m"], list(z["cols"]), float(z["fps"])
    g = lambda k: m[:, cols.index(k)].astype(np.float64)
    n = len(m)
    dall, hist, inl, lt, nb = g("dall"), g("hist"), g("inl"), g("lt"), g("nb")
    tx, ty, sc, loc, shp = g("tx"), g("ty"), g("sc"), g("loc"), g("shp")
    valid = inl >= 15
    spd = np.where(valid, np.hypot(tx, ty), np.nan)            # px / frame (full res)
    zoom = np.where(valid, np.log(np.maximum(sc, 1e-3)), np.nan)  # log-scale / frame
    # --- cuts: a spike of difference the rigid model cannot explain, or a histogram jump
    cuts = []
    for i in range(1, n):
        base = np.median(dall[max(0, i - 6):i]) if i > 1 else dall[i]
        spike = dall[i] > 14 and dall[i] > 2.4 * (base + 2.5)
        if (spike and inl[i] < 15) or hist[i] < 0.70:
            if not cuts or i - cuts[-1] > 3:
                cuts.append(i)
    bounds = [0] + cuts + [n]
    segs = []
    for a, b in zip(bounds[:-1], bounds[1:]):
        if b - a < 2:
            continue
        L = float(np.median(lt[a:b]))
        sk = pelle(path, [a + (b - a) * q for q in (0.25, 0.5, 0.75)])
        kind = "piena" if sk >= 0.17 else ("light" if L > 140 else "grafica")
        s = spd[a + 1:b]; zz = zoom[a + 1:b]
        moving = (np.nan_to_num(s) > 0.6) | (np.abs(np.nan_to_num(zz)) > 0.0006)
        seg = {"t0": round(a / fps, 3), "t1": round(b / fps, 3), "dur": round((b - a) / fps, 3), "tipo": kind,
               "frac_camera_in_moto": round(float(moving.mean()) if len(moving) else 0, 3)}
        # "arrives moving": the first valid frames after the cut are already fast and then decay
        head = np.nan_to_num(spd[a + 1:min(b, a + 4)])
        if a > 0 and len(head) and head.max() * fps > 900:
            v0 = float(head.max())
            k = a + 1 + int(np.argmax(head))
            tail = np.nan_to_num(spd[k:b])
            below = np.where(tail < 0.1 * v0)[0]
            seg["arrivo_in_moto"] = {"v0_px_s": round(v0 * fps), "t_decadimento_90": round((below[0] if len(below) else len(tail)) / fps, 3),
                                     "spostamento_px": round(float(np.nansum(np.nan_to_num(spd[k:b][:int(2.5 * fps)])))) }
        segs.append(seg)
    # --- camera moves inside segments: contiguous runs of global motion
    moves = []
    for a, b in zip(bounds[:-1], bounds[1:]):
        i = a + 1
        fine_ritorno = -1     # (curva firmata) ultimo fotogramma della fase di ritorno della mossa precedente
        while i < b:
            v = np.nan_to_num(spd[i]) + abs(np.nan_to_num(zoom[i])) * 900
            if v > 2.0:
                j = i
                while j < b and (np.nan_to_num(spd[j]) + abs(np.nan_to_num(zoom[j])) * 900) > 0.8:
                    j += 1
                if j - i >= 4:
                    sp = np.nan_to_num(spd[i:j]); zm = np.nan_to_num(zoom[i:j])
                    dx, dy = float(np.sum(tx[i:j] * valid[i:j])), float(np.sum(ty[i:j] * valid[i:j]))
                    zt = float(np.exp(np.sum(zm)))
                    mag = sp + np.abs(zm) * 900
                    ease, err = best_ease(np.cumsum(mag))
                    peak = int(np.argmax(mag))
                    blur_drop = float(np.median(shp[max(a, i - 3):i])) if i - a > 3 else None
                    moves.append({
                        "t0": round(i / fps, 3), "dur": round((j - i) / fps, 3),
                        "dopo_taglio": bool(i - a <= 2 and a > 0),
                        "pan_px": [round(dx), round(dy)], "zoom": round(zt, 3),
                        "v_picco_px_s": round(float(sp.max()) * fps), "picco_a": round(peak / max(1, j - i - 1), 2),
                        "ease": ease, "err": err,
                        "nitidezza_rel": round(float(np.min(shp[i:j]) / (blur_drop + 1e-6)), 3) if blur_drop else None,
                    })
                    cf = curva_firmata(i, j, b, fps, tx, ty, valid, zoom, loc)
                    cf["ritorno_di_precedente"] = bool(i <= fine_ritorno)
                    fa = cf.pop("_assest_abs")
                    if fa is not None and (cf["overshoot"] or 0) >= 0.01:
                        fine_ritorno = max(fine_ritorno, fa)
                    moves[-1].update(cf)
                i = j
            else:
                i += 1
    return {"codice": codice, "data": data, "era": era(data), "fps": round(fps, 3), "durata": round(n / fps, 2),
            "tagli": [round(c / fps, 3) for c in cuts], "segmenti": segs, "movimenti": moves}


def main():
    inv = json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
    dbg = sys.argv[1] if len(sys.argv) > 1 else None
    out = []
    for r in inv:
        if dbg and r["codice"] != dbg:
            continue
        e = analizza(r["codice"], r["data"], os.path.join(CARTELLA, r["file"]))
        e["n"], e["views"] = r["n"], r["views"]
        e["file"] = r["file"]      # chiave presente nell'eventi.json originale (la leggono densita.py e censimento.py)
        out.append(e)
    if dbg:
        e = out[0]
        print("tagli:", e["tagli"])
        for s in e["segmenti"]:
            print("SEG", s)
        for mv in e["movimenti"]:
            print("MOV", mv)
        return
    scrivi_json(os.path.join(AN, "eventi.json"), out)
    # --- aggregate statistics per era
    st = {}
    for e in out:
        s = st.setdefault(e["era"], {"reel": 0, "durata": 0, "tagli": 0, "seg_grafica": [], "seg_piena": [], "seg_light": [],
                                      "frac_moto_grafica": [], "arrivi": [], "mosse": []})
        s["reel"] += 1; s["durata"] += e["durata"]; s["tagli"] += len(e["tagli"])
        for g in e["segmenti"]:
            s["seg_" + g["tipo"]].append(g["dur"])
            if g["tipo"] == "grafica":
                s["frac_moto_grafica"].append(g["frac_camera_in_moto"])
                if "arrivo_in_moto" in g:
                    s["arrivi"].append(g["arrivo_in_moto"])
        s["mosse"] += [m for m in e["movimenti"]]
    res = {}
    for k, s in st.items():
        pct = lambda a, q: round(float(np.percentile(a, q)), 3) if len(a) else None
        mv = s["mosse"]
        eases = {}
        for m in mv:
            if m["ease"] and m["dur"] >= 0.3:
                eases[m["ease"]] = eases.get(m["ease"], 0) + 1
        big = [m for m in mv if m["v_picco_px_s"] > 1500]
        res[k] = {
            "reel": s["reel"], "minuti": round(s["durata"] / 60, 1),
            "tagli_al_minuto": round(s["tagli"] / (s["durata"] / 60), 2),
            "durata_segmenti_grafica_s": {"mediana": pct(s["seg_grafica"], 50), "p25": pct(s["seg_grafica"], 25), "p75": pct(s["seg_grafica"], 75), "n": len(s["seg_grafica"])},
            "durata_segmenti_piena_s": {"mediana": pct(s["seg_piena"], 50), "n": len(s["seg_piena"])},
            "quota_tempo": {k2: round(sum(s["seg_" + k2]) / s["durata"], 3) for k2 in ("grafica", "piena", "light")},
            "durata_segmenti_light_s": {"mediana": pct(s["seg_light"], 50), "n": len(s["seg_light"])},
            "camera_in_moto_nelle_grafiche": {"mediana": pct(s["frac_moto_grafica"], 50), "p25": pct(s["frac_moto_grafica"], 25)},
            "arrivi_in_moto": {"n": len(s["arrivi"]), "su_segmenti_grafica": len(s["seg_grafica"]),
                               "v0_px_s_mediana": pct([a["v0_px_s"] for a in s["arrivi"]], 50),
                               "decadimento_90_s_mediana": pct([a["t_decadimento_90"] for a in s["arrivi"]], 50),
                               "decadimento_p25_p75": [pct([a["t_decadimento_90"] for a in s["arrivi"]], 25), pct([a["t_decadimento_90"] for a in s["arrivi"]], 75)],
                               "spostamento_px_mediana": pct([a["spostamento_px"] for a in s["arrivi"]], 50)},
            "movimenti": {"n": len(mv), "durata_mediana_s": pct([m["dur"] for m in mv], 50), "durata_p25_p75": [pct([m["dur"] for m in mv], 25), pct([m["dur"] for m in mv], 75)],
                          "veloci_n": len(big), "veloci_durata_mediana_s": pct([m["dur"] for m in big], 50),
                          "veloci_picco_a_mediana": pct([m["picco_a"] for m in big], 50),
                          "zoom_in_frac": round(sum(1 for m in mv if m["zoom"] > 1.03) / max(1, len(mv)), 3),
                          "zoom_out_frac": round(sum(1 for m in mv if m["zoom"] < 0.97) / max(1, len(mv)), 3),
                          "easing": dict(sorted(eases.items(), key=lambda x: -x[1])[:8])},
        }
        res[k]["movimenti"].update(statistiche_firmate(mv))     # chiavi nuove (curva firmata, overshoot)
    scrivi_json(os.path.join(AN, "statistiche.json"), res, indent=1)
    print(json.dumps(res, ensure_ascii=False, indent=1))


def scrivi_json(path, obj, indent=None):
    """scrittura atomica (file temporaneo + rename): chi legge in parallelo non vede mai un file a metà"""
    tmp = path + ".tmp"
    with io.open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent)
    for k in range(20):
        try:
            os.replace(tmp, path)
            return
        except PermissionError:
            import time
            time.sleep(0.5)
    os.replace(tmp, path)


if __name__ == "__main__":
    main()
