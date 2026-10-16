# -*- coding: utf-8 -*-
"""Chiude una voce del blocco 3: riga in ritmo-03/scene.json, voto in _analisi/voti_kit.json (giro «ritmo», il giro di prima va
in storia), riga della tabella in RIFACIMENTO-RITMO.md, stato in ritmo-03/STATO.md.

    python -I chiudi_voce.py voce_O01.json

voce_XXX.json = { "id", "scena": {t0, t1, frase, script, kallaway: {reel, t0, t1}}, "voto": {voti, template, scena, confronto,
misure, manca, fatto}, "riga": {stato, template, numeri, voto} }
"""
import io, json, os, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
CAT = os.path.abspath(os.path.join(QUI, "..", "..", ".."))
GIRO = "ritmo 13/10 (blocco 03)"
COMP = "ritmo-03"
v = json.load(io.open(sys.argv[1], encoding="utf-8"))
ID = v["id"]

# 1) scene.json
sj = os.path.join(CAT, COMP, "scene.json")
sc = json.load(io.open(sj, encoding="utf-8")) if os.path.exists(sj) else []
sc = [s for s in sc if s["id"] != ID] + [dict(id=ID, **v["scena"])]
sc.sort(key=lambda s: s["t0"])
with io.open(sj, "w", encoding="utf-8") as f:
    f.write("[\n" + ",\n".join(" " + json.dumps(s, ensure_ascii=False) for s in sc) + "\n]\n")

# 2) voti_kit.json
vp = os.path.join(CAT, "_analisi", "voti_kit.json")
voti = json.load(io.open(vp, encoding="utf-8"))
old = voti.get(ID)
nuovo = dict(giro=GIRO, **v["voto"])
nuovo["sotto_4"] = any(x < 4 for x in nuovo.get("voti", {}).values())
if old:
    if old.get("giro") == GIRO:
        nuovo["storia"] = old.get("storia", [])
    else:
        st = old.pop("storia", [])
        nuovo["storia"] = [old] + st
voti[ID] = nuovo
json.dump(voti, io.open(vp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# 3) tabella di RIFACIMENTO-RITMO.md
rp = os.path.join(CAT, "RIFACIMENTO-RITMO.md")
txt = io.open(rp, encoding="utf-8").read()
r = v["riga"]
def sost(m):
    c = [x.strip() for x in m.group(3).split("|")]
    c[3], c[4], c[5], c[6] = r["stato"], r["template"], r["numeri"], r["voto"]
    return f"| {m.group(1)} | {m.group(2)} | " + " | ".join(c) + " |"
txt2, n = re.subn(r"^\|\s*(\d+)\s*\|\s*(" + ID + r")\s*\|(.*)\|\s*$", sost, txt, count=1, flags=re.M)
if n != 1:
    raise SystemExit("riga non trovata nella tabella: " + ID)
io.open(rp, "w", encoding="utf-8").write(txt2)

# 4) STATO.md
stp = os.path.join(CAT, COMP, "STATO.md")
st = io.open(stp, encoding="utf-8").read() if os.path.exists(stp) else ""
riga = f"- {ID}: **fatto** — {r['template']} · {r['numeri']} · voto {r['voto']}"
if re.search(r"^- " + ID + r":.*$", st, flags=re.M):
    st = re.sub(r"^- " + ID + r":.*$", riga.replace("\\", "\\\\"), st, flags=re.M)
else:
    st = st.rstrip("\n") + "\n" + riga + "\n"
# riga «Fatte: … — da fare: …» in testa: si ricalcola dalle righe «- ID: **fatto**» (ordine = quello della composizione)
ORDINE = ["A01", "T01", "L01", "L02", "K03", "T02", "F01", "K04", "F03", "D02", "X01", "U01"]
fatte = [x for x in ORDINE if re.search(r"^- " + x + r": \*\*fatto\*\*", st, flags=re.M)]
resto = [x for x in ORDINE if x not in fatte]
rf = f"Fatte: {len(fatte)} su {len(ORDINE)} ({' · '.join(fatte) or 'nessuna'}) — da fare: {' · '.join(resto) or 'nessuna'}."
if re.search(r"^Fatte: .*$", st, flags=re.M):
    st = re.sub(r"^Fatte: .*$", rf, st, count=1, flags=re.M)
else:
    st = re.sub(r"(R8: scene segnate «R8 morbida»\.\n)", lambda m: m.group(1) + rf + "\n", st, count=1)
io.open(stp, "w", encoding="utf-8").write(st)
print("chiusa", ID, "·", rf)
