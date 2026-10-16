# -*- coding: utf-8 -*-
"""Conta le stringhe di easing GSAP nel kit e nei sorgenti (reel-*/index.src.html, demo*/index.src.html).
Uscita: stampa + r01_conta_ease.json accanto allo script."""
import io, os, re, json, glob, sys
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
QUI = os.path.dirname(os.path.abspath(__file__))

files = sorted(glob.glob(os.path.join(ROOT, "kw-kit", "*.js")))
files += sorted(glob.glob(os.path.join(ROOT, "reel-*", "index.src.html")))
files += sorted(glob.glob(os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "demo*", "index.src.html")))

# GSAP ease names (family.variant with optional params) + "none"/"linear" used as ease values
RX = re.compile(r"""\b(back|sine|power[0-4]|expo|circ|elastic|bounce|quad|cubic|quart|quint|strong|steps|rough|slow)\s*\.\s*(inOut|out|in)\b(\s*\([^)]*\))?""")
RX_NONE = re.compile(r"""ease\s*:\s*["'](none|linear)["']""")

per_file = {}
tot = Counter()
tot_param = Counter()
for f in files:
    txt = io.open(f, encoding="utf-8", errors="replace").read()
    c = Counter()
    cp = Counter()
    for m in RX.finditer(txt):
        name = f"{m.group(1)}.{m.group(2)}"
        c[name] += 1
        par = re.sub(r"\s", "", m.group(3) or "")
        cp[name + par] += 1
    for m in RX_NONE.finditer(txt):
        c[m.group(1)] += 1
        cp[m.group(1)] += 1
    rel = os.path.relpath(f, ROOT).replace("\\", "/")
    per_file[rel] = {"ease": dict(c.most_common()), "con_parametro": dict(cp.most_common())}
    tot.update(c)
    tot_param.update(cp)

def scope(pred):
    s = Counter()
    for k, v in per_file.items():
        if pred(k):
            s.update(v["ease"])
    return s

scopes = {
    "tutto (kit + reel-* + demo*)": lambda k: True,
    "kit (kw-kit/*.js)": lambda k: k.startswith("kw-kit/"),
    "reel-*/index.src.html": lambda k: k.startswith("reel-"),
    "demo*/index.src.html": lambda k: k.startswith("CATALOGO"),
    "kit + reel (senza demo)": lambda k: not k.startswith("CATALOGO"),
    "kit + reel 09-13": lambda k: k.startswith("kw-kit/") or any(k.startswith(f"reel-{x}/") for x in ("09", "10", "11", "12", "13")),
}
print("=== totali per ambito: back.out / sine.out / power2.out / power3.out / power1.out / linear+none / tutti")
res_scope = {}
for nm, pr in scopes.items():
    s = scope(pr)
    res_scope[nm] = dict(s.most_common())
    print(f"{nm:34s} back.out={s['back.out']:4d} sine.out={s['sine.out']:3d} power2.out={s['power2.out']:4d} power3.out={s['power3.out']:4d} power1.out={s['power1.out']:3d} none/linear={s['none']+s['linear']:3d}  tot={sum(s.values())}")
print()
print("=== per file (back.out, sine.out, power2.out, power3.out, altro)")
for k, v in per_file.items():
    e = v["ease"]
    altro = sum(e.values()) - e.get("back.out", 0) - e.get("sine.out", 0) - e.get("power2.out", 0) - e.get("power3.out", 0)
    print(f"{k:55s} back.out={e.get('back.out',0):3d} sine.out={e.get('sine.out',0):2d} power2.out={e.get('power2.out',0):3d} power3.out={e.get('power3.out',0):3d} altro={altro:3d}")
print()
print("=== totale per ease (tutto)")
for k, v in tot.most_common():
    print(f"  {k:14s} {v}")
print("=== back.out per parametro (tutto)")
for k, v in tot_param.most_common():
    if k.startswith("back."):
        print(f"  {k:22s} {v}")
json.dump({"file": per_file, "ambiti": res_scope, "totale": dict(tot.most_common()), "totale_parametri": dict(tot_param.most_common())},
          io.open(os.path.join(QUI, "r01_conta_ease.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
