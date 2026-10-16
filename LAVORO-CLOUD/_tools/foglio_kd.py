"""Revisione da regia: foglio Kallaway (sopra) / DOPO (sotto) agli stessi istanti dal taglio (0 0,1 0,25 0,5 1 2 3,5 s).

    _tools/venv/Scripts/python.exe -I _tools/foglio_kd.py ID [ID...]
    _tools/venv/Scripts/python.exe -I _tools/foglio_kd.py --copia copia-01 [n1,n2,…]   (copia fedele: KALLAWAY | COPIA per scena)

Legge CATALOGO-ANIMAZIONI/ritmo-clip/<ID>_kallaway.mp4 e <ID>_dopo.mp4 (clip della pagina, ritagliate sopra la safe zone:
per la safe zone guardare un fotogramma intero del render). Scrive CATALOGO-ANIMAZIONI/_analisi/ritmo/fogli_regia/<ID>.jpg.
"""
import os, sys, cv2, numpy as np

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "CATALOGO-ANIMAZIONI")
CLIP = os.path.join(BASE, "ritmo-clip")
OUT = os.path.join(BASE, "_analisi", "ritmo", "fogli_regia")
os.makedirs(OUT, exist_ok=True)
T = [0, 0.1, 0.25, 0.5, 1.0, 2.0, 3.5]
H = 300


def riga(path, etichetta):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = n / fps
    celle = []
    for t in T:
        tt = min(t, dur - 1 / fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(tt * fps)))
        ok, f = cap.read()
        if not ok:
            f = np.zeros((640, 360, 3), np.uint8)
        f = cv2.resize(f, (int(f.shape[1] * H / f.shape[0]), H))
        cv2.putText(f, f"{t:g}s", (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (80, 255, 200), 2)
        celle.append(f)
    r = np.hstack(celle)
    cv2.putText(r, f"{etichetta} ({dur:.1f}s)", (6, H - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 220, 255), 2)
    return r


# ── opzione per la copia fedele (giro 2, blocchi copia-NN): --copia copia-01 [n1,n2,…] ──
# Per ogni scena di CATALOGO-ANIMAZIONI/<copia>/scene.json: riga KALLAWAY (il suo reel, kallaway.t0 + T) e riga COPIA (il render
# _analisi/render/<copia>_bozza.mp4, t0 + T) agli stessi istanti dal taglio, fotogramma intero ridotto (la safe zone a 1332 si
# vede: linea rossa). Uscita: _analisi/ritmo/fogli_regia/<copia>_<n>_<id>.jpg. Senza --copia il comportamento è quello di prima.
if len(sys.argv) > 2 and sys.argv[1] == "--copia":
    import json, io as _io
    comp = sys.argv[2]
    solo = set(int(x) for x in sys.argv[3].split(",")) if len(sys.argv) > 3 else None
    SC = json.load(_io.open(os.path.join(BASE, comp, "scene.json"), encoding="utf-8"))
    INV = {r["n"]: r for r in json.load(_io.open(os.path.join(BASE, "..", "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
    REN = os.path.join(BASE, "_analisi", "render", comp + "_bozza.mp4")

    def riga_t(path, t0, offs, etichetta, Hc=360):
        cap = cv2.VideoCapture(path)
        fps_v = cap.get(cv2.CAP_PROP_FPS) or 30
        celle = []
        for t in offs:
            # (16/10, cloud) il primo fotogramma con tempo >= t0 + t (tolleranza 0,02 fotogrammi per i tempi arrotondati):
            # con POS_MSEC OpenCV dava il fotogramma prima, e un taglio fra due fotogrammi mostrava a «+0 s» la scena di prima
            import math
            cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, math.ceil((t0 + t) * fps_v - 0.02)))
            ok, f = cap.read()
            if not ok:
                f = np.zeros((1920, 1080, 3), np.uint8)
            f = cv2.resize(f, (1080, int(f.shape[0] * 1080 / f.shape[1])))[:1400]
            cv2.line(f, (0, 1332), (1080, 1332), (0, 0, 255), 3)
            f = cv2.resize(f, (int(1080 * Hc / 1400), Hc))
            cv2.putText(f, f"+{t:g}s", (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (80, 255, 200), 2)
            celle.append(f)
        r = np.hstack(celle)
        cv2.putText(r, etichetta, (6, Hc - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 220, 255), 2)
        return r

    for s in SC:
        if solo and s["n"] not in solo:
            continue
        d = s["t1"] - s["t0"]
        offs = [x for x in T + [5.0, 7.0, 9.0, 12.0] if x < d - 0.03] or [0]
        k = s["kallaway"]
        kr = riga_t(os.path.join(BASE, "..", INV[k["reel"]]["file"]), k["t0"], offs, f"K r{k['reel']} {k['t0']:.2f}s")
        cr = riga_t(REN, s["t0"], offs, f"COPIA {s['t0']:.2f}s {s['id']}")
        out = os.path.join(OUT, f"{comp}_{s['n']:02d}_{s['id']}.jpg")
        cv2.imwrite(out, np.vstack([kr, cr]), [cv2.IMWRITE_JPEG_QUALITY, 82])
        print(os.path.normpath(out))
    sys.exit(0)

for vid in sys.argv[1:]:
    k = riga(os.path.join(CLIP, vid + "_kallaway.mp4"), "K " + vid)
    d = riga(os.path.join(CLIP, vid + "_dopo.mp4"), "DOPO " + vid)
    w = max(k.shape[1], d.shape[1])
    pad = lambda a: np.hstack([a, np.zeros((a.shape[0], w - a.shape[1], 3), np.uint8)])
    out = os.path.join(OUT, vid + ".jpg")
    cv2.imwrite(out, np.vstack([pad(k), pad(d)]), [cv2.IMWRITE_JPEG_QUALITY, 82])
    print(os.path.normpath(out))
