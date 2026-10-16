import io, os, json, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
cat = json.load(io.open(os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "catalogo.json"), encoding="utf-8"))
print(type(cat), list(cat.keys()) if isinstance(cat, dict) else len(cat))
inv = json.load(io.open(os.path.join(ROOT, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))
byn = {r["n"]: r for r in inv}
v = cat["voci"]
print(len(v), "voci; keys:", list(v[0].keys()))
want = sys.argv[1:] if len(sys.argv) > 1 else None
for x in v:
    if want and x["id"] not in want:
        continue
    refs = x.get("rif", [])
    dark = [r for r in refs if byn.get(r["n"], {}).get("data", "") >= "2026-06-01"]
    print(f"{x['id']:4s} {x['nome'][:70]:70s} rif={len(refs)} dark={len(dark)}")
    if want:
        for k, val in x.items():
            if k not in ("rif",):
                print("      ", k, ":", str(val)[:300])
        for r in refs:
            d = byn.get(r["n"], {}).get("data", "?")
            print(f"        n={r['n']:3d} {d} t={r.get('t0')}-{r.get('t1')} {r.get('file','')[:60]}")
