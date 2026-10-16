import io, json, os
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
inv = json.load(io.open(os.path.join(ROOT, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
print(len(inv), "keys:", list(inv[0].keys()))
ev = json.load(io.open(os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi", "eventi.json"), encoding="utf-8"))
print(len(ev), "eventi keys:", list(ev[0].keys()))
evd = {e["codice"]: e for e in ev}
dark = [r for r in inv if r["data"] >= "2026-06-01"]
print("dark:", len(dark))
miss = 0
for r in sorted(inv, key=lambda r: r["n"]):
    p = os.path.join(ROOT, r["file"])
    ex = os.path.exists(p)
    if not ex: miss += 1
    e = evd.get(r["codice"])
    print(r["n"], r["codice"], r["data"], r["file"], round(r["durata"], 2), "OK" if ex else "MISSING", e["fps"] if e else None, e["durata"] if e else None, len(e["tagli"]) if e else None)
print("missing", miss)
