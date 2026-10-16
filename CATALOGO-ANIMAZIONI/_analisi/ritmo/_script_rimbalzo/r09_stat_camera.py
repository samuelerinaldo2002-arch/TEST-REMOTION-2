# -*- coding: utf-8 -*-
import io, os, json, sys, py_compile
import numpy as np
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
AN = os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi")
py_compile.compile(os.path.join(ROOT, "_tools", "eventi.py"), doraise=True, cfile=os.path.join(os.environ["TEMP"], "ev_check.pyc"))
print("eventi.py compila")
st = json.load(io.open(os.path.join(AN, "statistiche.json"), encoding="utf-8"))
for era in ("giu-ott-dark", "mag-misto", "apr-light", "feb-podcast"):
    m = st[era]["movimenti"]
    print(f"\n===== {era}: mosse {m['n']}  easing (vecchio, top8): {m['easing']}")
    print("easing_firmata:", m["easing_firmata"])
    print("easing_firmata_significative:", m["easing_firmata_significative"])
    print(json.dumps(m["overshoot"], ensure_ascii=False, indent=1)[:2500])
