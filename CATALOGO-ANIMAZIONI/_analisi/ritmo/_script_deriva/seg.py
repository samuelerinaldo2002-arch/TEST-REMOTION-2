import json, io, sys
ev = json.load(io.open("CATALOGO-ANIMAZIONI/_analisi/eventi.json", encoding="utf-8"))
inv = {r["n"]: r for r in json.load(io.open("TUTTI-I-REEL/_inventario.json", encoding="utf-8"))}
byc = {e["codice"]: e for e in ev}
for n, (a, b) in {72: (5, 20), 100: (88, 104), 56: (8, 22), 69: (6, 18)}.items():
    e = byc[inv[n]["codice"]]
    print(f"reel {n} {e['codice']} fps {e['fps']} dur {e['durata']}")
    for s in e["segmenti"]:
        if s["t1"] >= a and s["t0"] <= b:
            print("   SEG", s)
    for m in e["movimenti"]:
        if a <= m["t0"] <= b:
            print("   MOV", {k: m[k] for k in ("t0", "dur", "dopo_taglio", "pan_px", "zoom", "v_picco_px_s", "ease")})
