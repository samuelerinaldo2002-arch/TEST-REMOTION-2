# -*- coding: utf-8 -*-
"""Classifica ogni occorrenza di back.out nel kit e nei sorgenti: pop di elemento (scale/opacity), spostamento (x/y),
camera, default di helper, altro. Uscita: stampa + r02_classifica_back.json."""
import io, os, re, json, glob, sys
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
ROOT = r"C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
QUI = os.path.dirname(os.path.abspath(__file__))
files = sorted(glob.glob(os.path.join(ROOT, "kw-kit", "*.js")))
files += sorted(glob.glob(os.path.join(ROOT, "reel-*", "index.src.html")))
files += sorted(glob.glob(os.path.join(ROOT, "CATALOGO-ANIMAZIONI", "demo*", "index.src.html")))

RX = re.compile(r"back\s*\.\s*out(\s*\([^)]*\))?")
CAMT = re.compile(r"^\s*\[?\s*(pan|gpan|zoom|gzoom|gpan2|gzoom2|world|mondo|stage|camRig|rig)\b")


def match_back(txt, i, open_c, close_c):
    """from position i walk back to the nearest unmatched open_c"""
    d = 0
    while i >= 0:
        c = txt[i]
        if c == close_c:
            d += 1
        elif c == open_c:
            if d == 0:
                return i
            d -= 1
        i -= 1
    return -1


def match_fwd(txt, i, open_c, close_c):
    d = 0
    while i < len(txt):
        c = txt[i]
        if c == open_c:
            d += 1
        elif c == close_c:
            d -= 1
            if d == 0:
                return i
        i += 1
    return -1


def split_top(s):
    """split a call argument string on top-level commas"""
    out, d, cur, q = [], 0, "", None
    for c in s:
        if q:
            cur += c
            if c == q:
                q = None
            continue
        if c in "\"'`":
            q = c; cur += c; continue
        if c in "([{":
            d += 1
        elif c in ")]}":
            d -= 1
        if c == "," and d == 0:
            out.append(cur); cur = ""
        else:
            cur += c
    if cur.strip():
        out.append(cur)
    return out


KEYS = re.compile(r"(?:^|[{,\s])([A-Za-z_$][\w$]*)\s*:")


def keys_of(obj):
    # keys at depth 1 of an object literal string "{...}"
    ks, d = [], 0
    body = obj.strip()
    if not body.startswith("{"):
        return ks
    tok = ""
    depth = 0
    i = 0
    s = body
    # crude: remove nested braces content
    flat, depth = "", 0
    for c in s:
        if c in "{[(":
            depth += 1
            if depth == 1:
                flat += c
            continue
        if c in "}])":
            depth -= 1
            if depth == 0:
                flat += c
            continue
        if depth == 1:
            flat += c
    return KEYS.findall(flat)


ELEM = [("pill/badge/tag", r"pill|chip|tag|badge|label|etich|lbl|bolla|bubble|cta|btn|button|bottone|toast|notif|zeroTag|stamp|timbro|sticker|pin\b"),
        ("card/riquadro", r"card|box|riq|frame|panel|pannell|tile|post|reel|thumb|cover|foto|img|photo|phone|telef|screen|win|finestra|clip"),
        ("icona/spunta/punto", r"icon|ico\b|ico[A-Z]|heart|cuore|tick|check|spunta|send|dot|punto|ring|anello|logo|star|stella|xb|cross|croce|arrow|freccia|emoji|eye|occhio|lock|lk\b|bell|campan|play|like|cursor|dito|finger|mano|hand|plus|piu|badgeIco|glyph|svg|kpi"),
        ("numero/testo", r"num|count|cifra|digit|numero|perc|pct|valore|val\b|word|parola|txt|text|testo|title|titolo|head|riga|line|row|item|voce|lista|list|bar|barra"),
        ("avatar/persona", r"you|tu\b|avatar|profil|face|volto|persona|user|utente|follower|people|nodes|node|n\b")]


def elem_class(target):
    t = target or ""
    for nm, rx in ELEM:
        if re.search(rx, t, re.I):
            return nm
    return "altro/non chiaro"


rows = []
for f in files:
    txt = io.open(f, encoding="utf-8", errors="replace").read()
    rel = os.path.relpath(f, ROOT).replace("\\", "/")
    for m in RX.finditer(txt):
        pos = m.start()
        line_no = txt.count("\n", 0, pos) + 1
        line = txt.splitlines()[line_no - 1].strip()
        par = re.sub(r"\s", "", (m.group(1) or "()"))[1:-1]
        try:
            amt = float(par) if par else 1.70158
        except ValueError:
            amt = None
        # enclosing object and call
        ob = match_back(txt, pos, "{", "}")
        cl = match_back(txt, ob - 1, "(", ")") if ob > 0 else -1
        kind = None
        call_name, target, allkeys = "", "", []
        pre = txt[max(0, pos - 40):pos]
        if re.search(r"(\|\||\?\?)\s*[\"']$", pre) or re.search(r"=\s*[\"']$", pre):
            kind = "default di helper"
        if cl > 0:
            ce = match_fwd(txt, cl, "(", ")")
            call = txt[cl + 1:ce] if ce > 0 else txt[cl + 1:cl + 400]
            # name of the called function
            nm = re.search(r"([\w$.\]\[]+)\s*$", txt[max(0, cl - 60):cl])
            call_name = nm.group(1) if nm else ""
            args = split_top(call)
            target = args[0].strip() if args else ""
            for a in args:
                a = a.strip()
                if a.startswith("{"):
                    allkeys += keys_of(a)
        ks = set(allkeys)
        pos_keys = ks & {"x", "y", "xPercent", "yPercent", "left", "top", "dx", "dy", "motionPath", "bottom", "right"}
        sc_keys = ks & {"scale", "scaleX", "scaleY", "s", "sc"}
        is_tween = bool(re.search(r"\.(to|from|fromTo)$", call_name))
        if kind is None:
            if CAMT.search(target) or re.search(r"\b(cam|camK|move|float|arrive|whip2|whip|frameRect|arriveRect|pathCam)$", call_name):
                kind = "camera"
            elif pos_keys and sc_keys:
                kind = "pop + spostamento"
            elif pos_keys:
                kind = "spostamento (x/y)"
            elif sc_keys:
                kind = "pop scala (scale/opacity)"
            elif ks & {"rotation", "rotate", "rot"}:
                kind = "rotazione"
            elif ks & {"width", "height", "w", "h", "strokeDashoffset", "drawSVG", "attr"}:
                kind = "dimensione/tracciato"
            elif ks & {"opacity", "autoAlpha"}:
                kind = "solo opacita'"
            else:
                kind = "altro"
        rows.append({"file": rel, "riga": line_no, "parametro": amt, "tipo": kind, "chiamata": call_name, "target": target[:60],
                     "chiavi": sorted(ks), "elemento": elem_class(target + " " + call_name), "codice": line[:200]})

print(f"occorrenze back.out: {len(rows)}")
c = Counter(r["tipo"] for r in rows)
for k, v in c.most_common():
    print(f"  {k:28s} {v:4d}  ({100*v/len(rows):.0f}%)")
print("\nper elemento (solo pop/spostamento):")
ce = Counter(r["elemento"] for r in rows if r["tipo"] not in ("camera", "default di helper"))
for k, v in ce.most_common():
    print(f"  {k:22s} {v}")
print("\nparametro back.out:")
cp = Counter(r["parametro"] for r in rows)
for k, v in sorted(cp.items(), key=lambda x: (x[0] is None, x[0])):
    print(f"  {k}: {v}")
vals = [r["parametro"] for r in rows if r["parametro"]]
import statistics
print("mediana parametro:", statistics.median(vals))
print("\n--- campione per tipo")
by = defaultdict(list)
for r in rows:
    by[r["tipo"]].append(r)
for k, lst in by.items():
    print(f"\n## {k} ({len(lst)})")
    for r in lst[:6]:
        print(f"   {r['file']}:{r['riga']} [{r['chiamata']}] target={r['target'][:30]} keys={r['chiavi']}")
print("\n--- spostamento / pop+spostamento / altro (tutti)")
for r in rows:
    if r["tipo"] in ("spostamento (x/y)", "pop + spostamento", "altro", "rotazione", "dimensione/tracciato", "solo opacita'", "camera"):
        print(f"   {r['tipo'][:18]:18s} {r['file']}:{r['riga']} [{r['chiamata']}] t={r['target'][:24]} k={r['chiavi']} :: {r['codice'][:110]}")
json.dump(rows, io.open(os.path.join(QUI, "r02_classifica_back.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
