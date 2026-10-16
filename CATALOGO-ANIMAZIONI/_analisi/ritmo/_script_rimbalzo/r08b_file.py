import io, os, json, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
AN = os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi")
old = json.load(io.open(os.path.join(AN, "ritmo", "backup", "eventi.json"), encoding="utf-8"))
new = json.load(io.open(os.path.join(AN, "eventi.json"), encoding="utf-8"))
inv = {r["codice"]: r for r in json.load(io.open(os.path.join(ROOT, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
print("old keys order:", list(old[0].keys()))
print("new keys order:", list(new[0].keys()))
same = sum(1 for e in old if e["file"] == inv[e["codice"]]["file"])
print("file == inventario.file:", same, "/", len(old))
for e in old[:3] + old[-2:]:
    print(e["codice"], repr(e["file"]), "| inv:", inv[e["codice"]]["file"])
diffs = [e for e in old if e["file"] != inv[e["codice"]]["file"]]
for e in diffs[:10]:
    print("DIFF", e["codice"], repr(e["file"]), "| inv:", inv[e["codice"]]["file"])
