# -*- coding: utf-8 -*-
"""Verifica di compatibilita': ogni chiave/valore dei file originali (backup) deve esistere identico nei file nuovi."""
import io, os, json, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
AN = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING\CATALOGO-ANIMAZIONI\_analisi"
BK = os.path.join(AN, "ritmo", "backup")
diff, added = [], {}

def cmp(old, new, path):
    if isinstance(old, dict):
        if not isinstance(new, dict):
            diff.append((path, "tipo")); return
        for k in old:
            if k not in new:
                diff.append((path + "." + k, "manca")); continue
            cmp(old[k], new[k], path + "." + k)
        for k in new:
            if k not in old:
                key = (path.split("[")[0] if "[" in path else path) + "." + k
                key = ".".join(p.split("[")[0] for p in (path + "." + k).split("."))
                added[key] = added.get(key, 0) + 1
    elif isinstance(old, list):
        if not isinstance(new, list) or len(old) != len(new):
            diff.append((path, f"lista {len(old)} vs {len(new) if isinstance(new, list) else type(new)}")); return
        for i, (a, b) in enumerate(zip(old, new)):
            cmp(a, b, f"{path}[{i}]")
    else:
        if old != new:
            diff.append((path, f"{old!r} -> {new!r}"))

for nome in ("eventi.json", "statistiche.json"):
    diff.clear(); added.clear()
    old = json.load(io.open(os.path.join(BK, nome), encoding="utf-8"))
    new = json.load(io.open(os.path.join(AN, nome), encoding="utf-8"))
    if nome == "eventi.json":
        print("reel:", len(old), len(new), "stesso ordine:", [e["codice"] for e in old] == [e["codice"] for e in new])
        print("mosse vecchie:", sum(len(e["movimenti"]) for e in old), "nuove:", sum(len(e["movimenti"]) for e in new))
    cmp(old, new, "")
    print(f"== {nome}: differenze sui valori/chiavi vecchie = {len(diff)}")
    for d in diff[:15]:
        print("   ", d)
    print("   chiavi aggiunte:", sorted(added.items())[:40])
