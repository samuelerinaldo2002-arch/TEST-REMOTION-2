import json, io, sys
d = json.load(io.open(sys.argv[1], encoding="utf-8"))
for r in d["serie"]:
    if r: print(r["t"], r["scala_%"], r["dx"], r["dy"], r["inlier"])
