# -*- coding: utf-8 -*-
"""Quanto è "pieno" il frame: densità e copertura dell'area grafica (Kallaway vs le nostre composizioni).

    _tools/venv/Scripts/python.exe -I _tools/densita.py kallaway                 # distribuzione sui reel giu→ott
    _tools/venv/Scripts/python.exe -I _tools/densita.py nostri <png> [<png>…]    # misura i nostri fotogrammi 1080x1920

densità  = quota di pixel dell'area grafica che si staccano dallo sfondo o sono bordi (dopo un filtro mediano che toglie la griglia di puntini)
copertura = quota delle celle di una griglia 6×8 sopra l'area grafica che contengono almeno il 3% di contenuto
Area grafica, titolo incluso: Kallaway y 3–56% (sotto: sottotitolo e facecam) · nostra y 150–1385 px (sotto: sottotitoli e facecam in post).
"""
import io, json, os, sys
import numpy as np
import cv2

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
AN = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI", "_analisi")


def misura(band):
    """band: BGR uint8 (area grafica) → (densità, copertura)"""
    g = cv2.cvtColor(cv2.resize(band, (360, int(360 * band.shape[0] / band.shape[1]))), cv2.COLOR_BGR2GRAY)
    g = cv2.medianBlur(g, 5)
    bg = float(np.percentile(g, 20))
    # contenuto = si stacca dallo sfondo OPPURE ha bordi (le card scure su sfondo #1E1E1E si staccano poco ma hanno contorni)
    diff = (np.abs(g.astype(np.int16) - bg) > 14)
    edges = cv2.dilate(cv2.Canny(g, 30, 90), np.ones((3, 3), np.uint8)) > 0
    m = (diff | edges).astype(np.uint8)
    dens = float(m.mean())
    H, W = m.shape
    cov = 0
    for j in range(8):
        for i in range(6):
            c = m[j * H // 8:(j + 1) * H // 8, i * W // 6:(i + 1) * W // 6]
            cov += 1 if c.mean() > 0.03 else 0
    return dens, cov / 48


def kallaway():
    ev = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
    D, C = [], []
    for e in ev:
        if e["era"] != "giu-ott-dark":
            continue
        cap = cv2.VideoCapture(os.path.join(CARTELLA, e["file"]))
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        segs = [s for s in e["segmenti"] if s["tipo"] == "grafica" and s["dur"] > 1.0]
        for s in segs[:: max(1, len(segs) // 6)][:6]:
            cap.set(cv2.CAP_PROP_POS_FRAMES, int((s["t0"] + s["dur"] * 0.6) * fps))
            ok, fr = cap.read()
            if not ok:
                continue
            h = fr.shape[0]
            d, c = misura(fr[int(0.03 * h):int(0.56 * h)])
            D.append(d); C.append(c)
        cap.release()
    q = lambda a, p: round(float(np.percentile(a, p)), 3)
    res = {"n_fotogrammi": len(D), "densita": {"p10": q(D, 10), "p25": q(D, 25), "mediana": q(D, 50), "p75": q(D, 75)},
           "copertura": {"p10": q(C, 10), "p25": q(C, 25), "mediana": q(C, 50), "p75": q(C, 75)}}
    json.dump(res, io.open(os.path.join(AN, "densita.json"), "w", encoding="utf-8"), indent=1)
    print(json.dumps(res, indent=1))


def nostri(files):
    ref = json.load(io.open(os.path.join(AN, "densita.json"), encoding="utf-8"))
    d25, c25 = ref["densita"]["p25"], ref["copertura"]["p25"]
    for f in files:
        fr = cv2.imread(f)
        k = fr.shape[1] / 1080
        d, c = misura(fr[int(150 * k):int(1385 * k)])
        flag = "TROPPO VUOTA" if (d < d25 or c < c25) else "ok"
        print(f"{os.path.basename(f):32s} densità {d:.3f} (K mediana {ref['densita']['mediana']}) · copertura {c:.2f} (K mediana {ref['copertura']['mediana']}) · {flag}")


if __name__ == "__main__":
    if sys.argv[1] == "kallaway":
        kallaway()
    else:
        nostri(sys.argv[2:])
