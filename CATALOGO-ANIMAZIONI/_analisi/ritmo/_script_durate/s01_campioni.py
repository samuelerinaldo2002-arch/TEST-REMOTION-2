import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comune import *
utf8_stdout()
q1, q3 = campioni()
print("Q1 (10):", q1)
print("Q3 (15):", q3)
ev = eventi()
for n in q3:
    e = ev[n]
    segs = e["segmenti"]
    print(f"\n== n={n} {e['codice']} {e['data']} fps={e['fps']} dur={e['durata']} cuts={len(e['tagli'])} segs={len(segs)} file={reel_info(n)['file']}")
    for s in segs:
        print(f"   {s['t0']:7.2f}-{s['t1']:7.2f} {s['dur']:5.2f} {s['tipo']:7s} moto={s['frac_camera_in_moto']}")
