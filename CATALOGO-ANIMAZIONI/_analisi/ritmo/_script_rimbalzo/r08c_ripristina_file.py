# -*- coding: utf-8 -*-
"""Ripristina in eventi.json la chiave per-reel "file" (presente nell'originale; la legge _tools/densita.py), in coda come prima.
Equivale a rieseguire _tools/eventi.py corretto (e["file"] = r["file"]) senza rifare i 19 minuti di calcolo."""
import io, os, json, sys, time
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
AN = os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi")
inv = {r["codice"]: r for r in json.load(io.open(os.path.join(ROOT, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
p = os.path.join(AN, "eventi.json")
ev = json.load(io.open(p, encoding="utf-8"))
for e in ev:
    e.pop("file", None)
    e["file"] = inv[e["codice"]]["file"]
tmp = p + ".tmp"
with io.open(tmp, "w", encoding="utf-8") as f:
    json.dump(ev, f, ensure_ascii=False)
for k in range(20):
    try:
        os.replace(tmp, p); break
    except PermissionError:
        time.sleep(0.5)
print("ok", len(ev), list(ev[0].keys()))
