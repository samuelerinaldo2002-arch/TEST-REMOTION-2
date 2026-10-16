# -*- coding: utf-8 -*-
"""Arricchisce r02_classifica_back.json: helper che contiene l'occorrenza, codice di catalogo vicino,
sottotipo del pop (entrata da scala<1/opacita' 0 vs impulso/assestamento da scala>1)."""
import io, os, re, json, sys
from collections import Counter, defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
QUI = os.path.dirname(os.path.abspath(__file__))
rows = json.load(io.open(os.path.join(QUI, "r02_classifica_back.json"), encoding="utf-8"))
cache = {}
DEF = re.compile(r"^\s{0,2}(?:const|function|let)\s+([A-Za-z_$][\w$]*)\s*(?:=|\()")
DEF_REEL = re.compile(r"^\s*(?:const|function|let)\s+([A-Za-z_$][\w$]*)\s*=\s*\(|^\s*//\s*(.{0,70})")
CODE = re.compile(r"\b([A-Z]\d{2})\b")
for r in rows:
    f = os.path.join(ROOT, r["file"])
    if f not in cache:
        cache[f] = io.open(f, encoding="utf-8", errors="replace").read().splitlines()
    L = cache[f]
    i = r["riga"] - 1
    helper, code, scena = None, None, None
    for j in range(i, max(-1, i - 400), -1):
        s = L[j]
        if helper is None:
            m = DEF.match(s)
            if m and (r["file"].startswith("kw-kit") or s.startswith("  const") is False):
                helper = m.group(1)
        if code is None and s.strip().startswith("//"):
            mc = CODE.search(s)
            if mc:
                code = mc.group(1)
        if scena is None and not r["file"].startswith("kw-kit"):
            if re.search(r"//\s*(═|─|=|-){2,}|//\s*(SCENA|scena|Scena|S\d+)\b", s):
                scena = s.strip()[:80]
        if helper and code and (scena or r["file"].startswith("kw-kit")):
            break
    r["helper"] = helper
    r["codice_catalogo_vicino"] = code
    if scena:
        r["scena"] = scena
    # subtype for scale pops: look at the from-object of fromTo, or the target value of .to
    line = r["codice"]
    sub = None
    if "scale" in " ".join(r["chiavi"]):
        mfrom = re.search(r"fromTo\([^{]*\{([^}]*)\}\s*,\s*\{([^}]*)\}", line)
        if mfrom:
            fr, to = mfrom.group(1), mfrom.group(2)
            sf = re.search(r"\bscale[XY]?\s*:\s*([\d.]+)", fr)
            st = re.search(r"\bscale[XY]?\s*:\s*([\d.]+)", to)
            if sf and st:
                a, b = float(sf.group(1)), float(st.group(1))
                sub = "entrata (scala cresce)" if a < b else "impulso/assestamento (scala cala)"
        else:
            st = re.search(r"\bscale[XY]?\s*:\s*([\d.]+)", line)
            if st:
                b = float(st.group(1))
                sub = "entrata (scala cresce)" if b <= 1.0001 else "impulso verso >1"
    r["sottotipo"] = sub
    if r["tipo"] == "altro" and re.search(r"\bpop\(", line):
        r["tipo"] = "pop scala (scale/opacity)"
        r["sottotipo"] = "entrata (scala cresce)"
        r["helper"] = (r["helper"] or "") + " -> pop()"
json.dump(rows, io.open(os.path.join(QUI, "r02_classifica_back.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
c = Counter(r["tipo"] for r in rows)
print("tipi:", c.most_common())
print("sottotipi pop:", Counter(r["sottotipo"] for r in rows if r["tipo"].startswith("pop")).most_common())
print("codici catalogo vicini:", Counter(r["codice_catalogo_vicino"] for r in rows).most_common(30))
print()
by = defaultdict(list)
for r in rows:
    by[(r["file"], r["helper"])].append(r)
for (f, h), lst in sorted(by.items(), key=lambda x: (-len(x[1]), x[0][0])):
    if f.startswith("kw-kit"):
        print(f"{len(lst):3d}  {f}:{lst[0]['riga']}  {h}  [{lst[0]['codice_catalogo_vicino']}]  {Counter(r['tipo'][:12] for r in lst).most_common()}  par={sorted(set(r['parametro'] for r in lst))}")
