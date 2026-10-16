# -*- coding: utf-8 -*-
"""Shared helpers for the rhythm analysis (ritmo/durate). Read-only on project data."""
import io, json, os, random, sys
import numpy as np

ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
AN = os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "_analisi")
MET = os.path.join(AN, "metriche")
RITMO = os.path.join(AN, "ritmo")
SCRIPT = os.path.join(RITMO, "_script_durate")
FOGLI = os.path.join(RITMO, "fogli")
DATI = os.path.join(RITMO, "_dati")
SEED = 20261011

def load_json(p):
    with io.open(p, encoding="utf-8") as f:
        return json.load(f)

def save_json(p, obj, indent=1):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with io.open(p, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent)

def inventario():
    return load_json(os.path.join(ROOT, "TUTTI-I-REEL", "_inventario.json"))

def eventi():
    return {e["n"]: e for e in load_json(os.path.join(AN, "eventi.json"))}

def dark_ns():
    return sorted(r["n"] for r in inventario() if r["data"] >= "2026-06-01")

def campioni():
    """15 random dark reels (fixed seed); the first 10 are the cut-verification sample (Q1)."""
    rng = random.Random(SEED)
    s = rng.sample(dark_ns(), 15)
    return s[:10], s

def reel_path(n):
    for r in inventario():
        if r["n"] == n:
            return os.path.join(ROOT, r["file"])
    raise KeyError(n)

def reel_info(n):
    for r in inventario():
        if r["n"] == n:
            return r
    raise KeyError(n)

def pct(a, q):
    return round(float(np.percentile(a, q)), 3) if len(a) else None

def summ(a):
    a = [x for x in a if x is not None]
    if not a:
        return {"n": 0}
    return {"n": len(a), "mediana": pct(a, 50), "p25": pct(a, 25), "p75": pct(a, 75), "media": round(float(np.mean(a)), 3)}

def utf8_stdout():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
