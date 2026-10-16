# -*- coding: utf-8 -*-
"""Compare current eventi.json / statistiche.json with ritmo/backup (pre-regeneration copy)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comune import *
utf8_stdout()
new = {e["codice"]: e for e in load_json(os.path.join(AN, "eventi.json"))}
old = {e["codice"]: e for e in load_json(os.path.join(RITMO, "backup", "eventi.json"))}
print("reel nuovi", len(new), "vecchi", len(old), "stessi codici", set(new) == set(old))
diff_t, diff_s, diff_m, diff_mkeys = [], [], [], []
newkeys_seg, newkeys_mov, newkeys_top = set(), set(), set()
for c in old:
    a, b = old[c], new[c]
    newkeys_top |= set(b) - set(a)
    if a["tagli"] != b["tagli"]:
        diff_t.append(c)
    sa = [(s["t0"], s["t1"], s["dur"], s["tipo"], s["frac_camera_in_moto"]) for s in a["segmenti"]]
    sb = [(s["t0"], s["t1"], s["dur"], s["tipo"], s["frac_camera_in_moto"]) for s in b["segmenti"]]
    if sa != sb:
        diff_s.append(c)
    for s1, s2 in zip(a["segmenti"], b["segmenti"]):
        newkeys_seg |= set(s2) - set(s1)
        for k in s1:
            if s1[k] != s2.get(k):
                diff_s.append((c, k)) if (c, k) not in diff_s else None
    ma = [(m["t0"], m["dur"], tuple(m["pan_px"]), m["zoom"]) for m in a["movimenti"]]
    mb = [(m["t0"], m["dur"], tuple(m["pan_px"]), m["zoom"]) for m in b["movimenti"]]
    if ma != mb:
        diff_m.append((c, len(ma), len(mb)))
    for m1, m2 in zip(a["movimenti"], b["movimenti"]):
        newkeys_mov |= set(m2) - set(m1)
        for k in m1:
            if m1[k] != m2.get(k):
                diff_mkeys.append((c, k))
print("campi nuovi top:", newkeys_top, "segmenti:", newkeys_seg, "movimenti:", newkeys_mov)
print("reel con tagli diversi:", len(diff_t), diff_t[:10])
print("reel con segmenti diversi:", len(diff_s), diff_s[:10])
print("reel con movimenti (t0,dur,pan,zoom) diversi:", len(diff_m), diff_m[:10])
from collections import Counter
print("campi movimento cambiati:", Counter(k for c, k in diff_mkeys).most_common(10))
so = load_json(os.path.join(RITMO, "backup", "statistiche.json"))
sn = load_json(os.path.join(AN, "statistiche.json"))
for era in so:
    for k in so[era]:
        if so[era][k] != sn[era].get(k):
            print("statistiche diverse:", era, k)
    extra = set(sn[era]) - set(so[era])
    print(era, "campi nuovi in statistiche:", extra)
d = sn["giu-ott-dark"]
print("dark:", d["tagli_al_minuto"], d["durata_segmenti_grafica_s"], d["quota_tempo"])
