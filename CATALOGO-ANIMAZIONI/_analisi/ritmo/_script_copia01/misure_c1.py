# -*- coding: utf-8 -*-
"""Misure UNA volta per ogni voce del blocco C1 (copia del reel 79), Kallaway e copia con lo stesso strumento e agli stessi istanti.

    _tools/venv/Scripts/python.exe -I misure_c1.py [ID,ID…]

Strumenti: camtrack.py + fitmove.py (camera: inizio, durata, picco, curva), _tools/deriva.py (camera dopo il taglio, sugli elementi
fermi), _tools/pop.py (ingresso di un elemento), ingombro.py (proporzioni, y 300–1190: sopra i sottotitoli di Kallaway),
_tools/misura_glow.py (F01). Uscita: copia-01/_lavoro/misure.json (testo grezzo di ogni strumento per voce, K e C).
"""
import io, json, os, subprocess, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(QUI, "..", "..", "..", ".."))
PY = os.path.join(PROJ, "_tools", "venv", "Scripts", "python.exe")
K = os.path.join(PROJ, "77_2026-07-08_DaiCxAkOpNb.mp4")
C = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "_analisi", "render", "copia-01_bozza.mp4")
LAV = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "copia-01", "_lavoro")
ING = os.path.join(PROJ, "CATALOGO-ANIMAZIONI", "_analisi", "ritmo", "_script_blocco03", "ingombro.py")


def run(args, cwd=None):
    r = subprocess.run([PY, "-I"] + args, capture_output=True, text=True, encoding="utf-8", errors="replace", cwd=cwd)
    return (r.stdout + r.stderr).strip()


def cam(src, a, b, canale, roi="0,330,1080,1290", tag=""):
    f = os.path.join(LAV, "cam", f"m_{tag}.txt")
    open(f, "w", encoding="utf-8").write(run([os.path.join(QUI, "camtrack.py"), src, str(a - 0.05), str(b), "--roi", roi]))
    return run([os.path.join(QUI, "fitmove.py"), f, str(a), str(b), "--canale", canale])


def ing(src, t):
    return run([ING, src, str(t), "300", "1190"]).splitlines()[-1]


VOCI = {
    "A05": lambda s, w: {"ingombro 0,4 s (card)": ing(s, 0.4), "arrivo 0–0,5 s": cam(s, 0.0, 0.55, "y", tag=f"A05_{w}")},
    "T01": lambda s, w: {"ingombro titolo 1,6 s": run([ING, s, "1.6", "120", "320"]).splitlines()[-1]},
    "C01": lambda s, w: {"pan della linea": cam(s, 0.55, 1.5, "x", tag=f"C01_{w}")},
    "F01": lambda s, w: {"glow titolo 1,6 s": "\n".join(run([os.path.join(PROJ, "_tools", "misura_glow.py"), s, "1.6", "300", "145", "780", "205", "bianco"]).splitlines()[-3:]),
                         "glow neon 5,6 s": "\n".join(run([os.path.join(PROJ, "_tools", "misura_glow.py"), s, "5.6", "330", "760", "750", "930", "rosso" if w == "K" else "lime"]).splitlines()[-3:])},
    "O13": lambda s, w: {"ingombro cervello 1,0 s": run([ING, s, "1.0", "800", "1150"]).splitlines()[-1]},
    "F02": lambda s, w: {"ingombro disco 1,3 s": ing(s, 1.3)},
    "O18": lambda s, w: {"ingombro ∞ 5,35 s": run([ING, s, "5.35", "600", "1000"]).splitlines()[-1]},
    "O14": lambda s, w: {"ingombro slot 10,2 s": ing(s, 10.2)},
    "K03": lambda s, w: {"verso la slot": cam(s, 9.5, 10.65, "s", tag=f"K03a_{w}"), "verso la mappa": cam(s, 10.45, 12.2, "x", tag=f"K03b_{w}")},
    "K04": lambda s, w: {"deriva 20,81 s": run([os.path.join(PROJ, "_tools", "deriva.py"), "--k" if w == "K" else "--n", "reel:79" if w == "K" else s, "--t", "20.81", "--nocut", "--dur", "1.8", "--maschera", "760,960,200,200", "--livello", "tutto", "--voce", f"K04_copia01_{w}"]).splitlines()[-6:]},
    "K02": lambda s, w: {"arrivo sulla mappa": cam(s, 34.75, 36.5, "xy", "0,150,1080,1290", tag=f"K02_{w}")},
    "K17": lambda s, w: {"tuffo sulla tappa 3": cam(s, 50.93, 52.45, "s", "0,150,1080,1290", tag=f"K17_{w}")},
    "K06": lambda s, w: {"tuffo nella card": cam(s, 102.12, 102.7, "s", "0,330,1080,1290", tag=f"K06_{w}")},
    "O30": lambda s, w: {"ingombro 63,5 s": ing(s, 63.5), "pop «A» 60,45 s": run([os.path.join(PROJ, "_tools", "pop.py"), "--k" if w == "K" else "--n", "reel:79" if w == "K" else s, "--t", "60.35,60.95", "--roi", "260,570,140,110", "--voce", f"O30_A_copia01_{w}"]).splitlines()[-3:]},
}

solo = sys.argv[1].split(",") if len(sys.argv) > 1 else list(VOCI)
out_f = os.path.join(LAV, "misure.json")
R = json.load(io.open(out_f, encoding="utf-8")) if os.path.exists(out_f) else {}
for vid in solo:
    R[vid] = {"K": VOCI[vid](K, "K"), "C": VOCI[vid](C, "C")}
    print("=====", vid)
    for w in ("K", "C"):
        for k, v in R[vid][w].items():
            print(f"[{w}] {k}: {v if isinstance(v, str) else ' | '.join(v)}")
    json.dump(R, io.open(out_f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
