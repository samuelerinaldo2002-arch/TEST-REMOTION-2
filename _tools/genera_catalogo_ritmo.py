# -*- coding: utf-8 -*-
"""Pagina del rifacimento col ritmo: CATALOGO-ANIMAZIONI/catalogo-ritmo.html (Kallaway | prima | dopo, schede dei template).

    _tools/venv/Scripts/python.exe -I _tools/genera_catalogo_ritmo.py [--no-clip] [--solo D13,U02]

Fonti (niente da copiare a mano):
- ordine, blocchi, «serve a», stato: la tabella di CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md
- voci (nome, categoria, frequenza, quando, riferimenti, dove si vede oggi): CATALOGO-ANIMAZIONI/catalogo.json
- KALLAWAY: clip/<ID>_1.mp4 (e _2) già esistenti
- PRIMA: tagliata dal render di prova _analisi/render/<composizione>_bozza.mp4 al primo tempo del campo «demo» del catalogo
  (= dizionario IMPL di genera_catalogo.py) oppure da PRIMA_MANUALE qui sotto; se il render è più vecchio del sorgente
  della composizione la pagina lo scrive
- DOPO: CATALOGO-ANIMAZIONI/ritmo-NN/scene.json ([{id, t0, t1, frase, script, kallaway: {reel, t0, t1}}]) + render
  _analisi/render/ritmo-NN_bozza.mp4; «kallaway» = il segmento grafico di Kallaway dal suo taglio (misurato): diventa la
  clip KALLAWAY allineata (ritmo-clip/<ID>_kallaway.mp4), così i tre video partono dallo stesso istante
- scheda e codice: i commenti «@scheda <ID> · <nome>» in kw-kit/kit2-template.js (e kit2-tpl-*.js)
- voto e numeri misurati: _analisi/voti_kit.json (giro che comincia con «ritmo», campo «misure»)
- usato nei reel: le chiamate TPL.<ID>( nei sorgenti dei reel (reel-*/index.src.html)
- COPIA (giro 2, copia fedele): CATALOGO-ANIMAZIONI/copia-NN/scene.json (campo «voci»: {ID: [t0, t1]}) + render
  _analisi/render/copia-NN_bozza.mp4 → ritmo-clip/<ID>_copia.mp4; la clip KALLAWAY agli stessi istanti del suo reel
  (ritmo-clip/<ID>_kcopia.mp4) va in testa; schede «@copia <ID> · …» in kw-kit/kit2-copia-*.js; voto del giro «copia …»
Clip PRIMA e DOPO in CATALOGO-ANIMAZIONI/ritmo-clip/ (in alto il 70% del fotogramma come le clip di Kallaway, alte 640 px,
crf 24, senza audio); si rifanno solo se cambiano il render o i tempi (ritmo-clip/_clip.json).
La pagina aperta nel browser si ricarica da sola (ogni 10 s guarda ritmo-clip/_versione.js, scritto qui): basta rigenerarla.
"""
import base64, datetime, glob, html, io, json, os, re, subprocess, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
CAT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI")
AN = os.path.join(CAT, "_analisi")
RENDER = os.path.join(AN, "render")
CLIPR = os.path.join(CAT, "ritmo-clip")
KIT = os.path.join(CARTELLA, "kw-kit")
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}

# nomi delle composizioni nel campo «demo» → (cartella del sorgente, nome del render di prova)
COMP = {"v5": "reel-01-v5", "r03": "reel-03"}
# voci senza un tempo nel campo «demo» o con un tempo da correggere: ID → (composizione, t0, t1)
PRIMA_MANUALE = {}


def dir_comp(nome):
    nome = COMP.get(nome, nome)
    d = os.path.join(CAT, nome) if nome.startswith("demo") else os.path.join(CARTELLA, nome)
    return nome, d


def it(x):
    return f"{x:g}".replace(".", ",")


def num(s):
    return float(s.replace(",", "."))


RX_DEMO = re.compile(r"(demo-oggetti|demo-\d+|demo|reel-\d+(?:-v5)?|v5|r03)\s+(\d+(?:,\d+)?)(?:\s*[–-]\s*(\d+(?:,\d+)?))?\s*s")


def tempi_prima(v):
    if v["id"] in PRIMA_MANUALE:
        c, a, b = PRIMA_MANUALE[v["id"]]
        return c, a, b
    m = RX_DEMO.search(v.get("demo") or "")
    if not m:
        return None
    a = num(m.group(2))
    if m.group(3):
        b = num(m.group(3))
        return m.group(1), a, min(b, a + 6.5)
    return m.group(1), max(0, a - 0.3), a + 3.7


def tabella():
    righe = []
    for ln in io.open(os.path.join(CAT, "RIFACIMENTO-RITMO.md"), encoding="utf-8"):
        m = re.match(r"^\|\s*(\d+)\s*\|\s*([A-Z]\d+)\s*\|(.*)\|\s*$", ln)
        if not m:
            continue
        c = [x.strip() for x in m.group(3).split("|")]
        righe.append(dict(blocco=int(m.group(1)), id=m.group(2), nome=c[0], freq=c[1], serve=c[2], stato=c[3],
                          template=c[4], numeri=c[5], voto=c[6]))
    return righe


def schede():
    out = {}
    for f in sorted(glob.glob(os.path.join(KIT, "kit2-template.js")) + glob.glob(os.path.join(KIT, "kit2-tpl-*.js"))):
        src = io.open(f, encoding="utf-8").read()
        for m in re.finditer(r"/\*\s*@scheda\s+([A-Z]\d+)\s*·\s*([^\n]*)\n(.*?)\*/", src, re.S):
            sc = {"nome": m.group(2).strip(), "file": os.path.basename(f)}
            chiave = None
            for raw in m.group(3).split("\n"):
                ln = re.sub(r"^\s*\*", "", raw)
                mk = re.match(r"^ (\w+):\s?(.*)$", ln)
                if mk:
                    chiave = mk.group(1)
                    sc[chiave] = mk.group(2).rstrip()
                elif chiave and ln.strip():
                    cont = ln[3:] if ln.startswith("   ") else ln.strip()
                    sc[chiave] = (sc[chiave] + "\n" + cont.rstrip()) if chiave == "chiamata" else (sc[chiave] + " " + cont.strip()).strip()
            if sc.get("chiamata"):
                sc["chiamata"] = sc["chiamata"].strip("\n")
            out[m.group(1)] = sc
    return out


def scene():
    out = {}
    for f in sorted(glob.glob(os.path.join(CAT, "ritmo-*", "scene.json"))):
        comp = os.path.basename(os.path.dirname(f))
        for s in json.load(io.open(f, encoding="utf-8")):
            s["comp"] = comp
            out[s["id"]] = s
    return out


def copie():
    """giro 2 (copia fedele): copia-NN/scene.json → per ogni voce (campo «voci»: {ID: [t0, t1]}) la clip COPIA dal render
    _analisi/render/copia-NN_bozza.mp4 e la clip KALLAWAY agli stessi istanti del suo reel (la copia sta 1:1 sul suo tempo)"""
    out = {}
    for f in sorted(glob.glob(os.path.join(CAT, "copia-*", "scene.json"))):
        comp = os.path.basename(os.path.dirname(f))
        for s in json.load(io.open(f, encoding="utf-8")):
            for vid, ab in (s.get("voci") or {}).items():
                if vid in out:
                    continue
                k = s.get("kallaway") or {}
                dk = (k.get("t0", s["t0"]) - s["t0"])
                out[vid] = dict(comp=comp, t0=ab[0], t1=ab[1], reel=k.get("reel"), kt0=ab[0] + dk, kt1=ab[1] + dk, n=s.get("n"), cosa=s.get("cosa", ""), funzione=s.get("funzione", ""))
    return out


def schede_copia():
    """commenti «@copia <ID> · <nome>» in kw-kit/kit2-copia-*.js (stesso formato delle schede dei template)"""
    out = {}
    for f in sorted(glob.glob(os.path.join(KIT, "kit2-copia-*.js"))):
        src = io.open(f, encoding="utf-8").read()
        for m in re.finditer(r"/\*\s*@copia\s+([A-Za-z0-9_]+)\s*·\s*([^\n]*)\n(.*?)\*/", src, re.S):
            sc = {"nome": m.group(2).strip(), "file": os.path.basename(f)}
            chiave = None
            for raw in m.group(3).split("\n"):
                ln = re.sub(r"^\s*\*", "", raw)
                mk = re.match(r"^ (\w+):\s?(.*)$", ln)
                if mk:
                    chiave = mk.group(1)
                    sc[chiave] = mk.group(2).rstrip()
                elif chiave and ln.strip():
                    cont = ln[3:] if ln.startswith("   ") else ln.strip()
                    sc[chiave] = (sc[chiave] + "\n" + cont.rstrip()) if chiave == "chiamata" else (sc[chiave] + " " + cont.strip()).strip()
            if sc.get("chiamata"):
                sc["chiamata"] = sc["chiamata"].strip("\n")
            out[m.group(1)] = sc
    return out


def usato_nei_reel():
    """TPL.<ID>( nei sorgenti dei reel; dalle tabelle dei PIANO.md (| # | tempo | frase | template | …) anche il tempo della
    scena: «reel-15 18,57–22,67 s» (blocco 3: la colonna «usato nei reel» coi reel 14–16)."""
    uso = {}
    for f in glob.glob(os.path.join(CARTELLA, "reel-*", "index.src.html")):
        r = os.path.basename(os.path.dirname(f))
        for i in set(re.findall(r"TPL\.([A-Z]\d+)\(", io.open(f, encoding="utf-8").read())):
            uso.setdefault(i, {})[r] = r
    for f in glob.glob(os.path.join(CARTELLA, "reel-*", "PIANO.md")):
        r = os.path.basename(os.path.dirname(f))
        for ln in io.open(f, encoding="utf-8"):
            c = [x.strip() for x in ln.strip().strip("|").split("|")]
            if len(c) < 4 or not re.match(r"^\d+$", c[0]):
                continue
            for i in re.findall(r"TPL\.([A-Z]\d+)\b", c[3]):
                uso.setdefault(i, {})[r] = f"{r} {c[1]} s"
    return {k: [v[r] for r in sorted(v)] for k, v in uso.items()}


def data_it(ts):
    return datetime.datetime.fromtimestamp(ts).strftime("%d/%m %H:%M")


REG = {}


def clip(src, a, b, out):
    """Taglia [a, b] dal render (in alto il 70%, alta 640 px, crf 24). Rifà la clip solo se render o tempi cambiano."""
    chiave = f"{os.path.relpath(src, CARTELLA)}|{a:.3f}|{b:.3f}|{os.path.getmtime(src):.0f}"
    if os.path.exists(out) and REG.get(os.path.basename(out)) == chiave:
        return False
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", src,
                    "-vf", "crop=iw:ih*0.70:0:0,scale=-2:640,fps=30", "-an", "-c:v", "libx264", "-crf", "24", "-preset", "veryfast",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], check=True)
    REG[os.path.basename(out)] = chiave
    return True


def main():
    fai_clip = "--no-clip" not in sys.argv
    solo = None
    if "--solo" in sys.argv:
        solo = set(sys.argv[sys.argv.index("--solo") + 1].split(","))
    os.makedirs(CLIPR, exist_ok=True)
    preg = os.path.join(CLIPR, "_clip.json")
    if os.path.exists(preg):
        REG.update(json.load(io.open(preg, encoding="utf-8")))
    cat = json.load(io.open(os.path.join(CAT, "catalogo.json"), encoding="utf-8"))
    V = {v["id"]: v for v in cat["voci"]}
    voti = json.load(io.open(os.path.join(AN, "voti_kit.json"), encoding="utf-8"))
    SC, SE, USO, CP, SCC = schede(), scene(), usato_nei_reel(), copie(), schede_copia()
    voci, fatte, nuove, ncopie = [], 0, 0, 0
    for r in tabella():
        v = V.get(r["id"], {})
        e = dict(id=r["id"], nome=v.get("nome", r["nome"]), cat=v.get("cat", r["id"][0]), freq=r["freq"], blocco=r["blocco"],
                 serve=r["serve"], stato_tab=r["stato"], cosa=v.get("cosa", ""), quando=v.get("quando", ""),
                 tempi_k=v.get("tempi", ""), negli_script=v.get("negli_script", []), usato=USO.get(r["id"], []))
        e["kallaway"] = [c for c in v.get("clip", []) if os.path.exists(os.path.join(CAT, c))]
        e["rif"] = [f"reel {x['n']} · {it(x['t0'])}–{it(x['t1'])} s" for x in v.get("rif", [])[:2]]
        # PRIMA
        tp = tempi_prima(v) if v else None
        if tp:
            nome, d = dir_comp(tp[0])
            ren = os.path.join(RENDER, f"{nome}_bozza.mp4")
            p = dict(dove=f"{nome} {it(tp[1])}–{it(tp[2])} s", demo=v.get("demo", ""))
            if os.path.exists(ren):
                out = os.path.join(CLIPR, f"{r['id']}_prima.mp4")
                if fai_clip and (solo is None or r["id"] in solo):
                    nuove += clip(ren, tp[1], tp[2], out)
                if os.path.exists(out):
                    p["clip"] = f"ritmo-clip/{r['id']}_prima.mp4"
                srcf = os.path.join(d, "index.src.html")
                if os.path.exists(srcf) and os.path.getmtime(srcf) > os.path.getmtime(ren) + 60:
                    p["vecchio"] = f"render del {data_it(os.path.getmtime(ren))}, sorgente cambiato il {data_it(os.path.getmtime(srcf))}: la clip può non essere l'ultima versione"
            else:
                p["manca"] = f"manca il render di prova {nome}_bozza.mp4"
            e["prima"] = p
        else:
            e["prima"] = dict(manca="nessun tempo nel catalogo: aggiungerlo in PRIMA_MANUALE (genera_catalogo_ritmo.py)", demo=v.get("demo", ""))
        # DOPO
        s = SE.get(r["id"])
        if s:
            ren = os.path.join(RENDER, f"{s['comp']}_bozza.mp4")
            dd = dict(scena=f"{s['comp']} {it(s['t0'])}–{it(s['t1'])} s", frase=s.get("frase", ""), script=s.get("script", ""))
            if os.path.exists(ren):
                out = os.path.join(CLIPR, f"{r['id']}_dopo.mp4")
                if fai_clip and (solo is None or r["id"] in solo):
                    nuove += clip(ren, s["t0"], s["t1"], out)
                if os.path.exists(out):
                    dd["clip"] = f"ritmo-clip/{r['id']}_dopo.mp4"
                srcf = os.path.join(CAT, s["comp"], "index.src.html")
                if os.path.getmtime(srcf) > os.path.getmtime(ren) + 60:
                    dd["vecchio"] = f"render del {data_it(os.path.getmtime(ren))}, sorgente cambiato il {data_it(os.path.getmtime(srcf))}: rifare il render di prova"
            else:
                dd["manca"] = f"manca il render di prova {s['comp']}_bozza.mp4"
            e["dopo"] = dd
            # KALLAWAY allineato al taglio (scene.json: "kallaway": {reel, t0 = il suo taglio, t1}): i tre video partono dallo
            # stesso istante; le clip del catalogo restano come riferimento 2
            k = s.get("kallaway")
            if k and k.get("reel") in INV:
                out = os.path.join(CLIPR, f"{r['id']}_kallaway.mp4")
                if fai_clip and (solo is None or r["id"] in solo):
                    nuove += clip(os.path.join(CARTELLA, INV[k["reel"]]["file"]), k["t0"], k["t1"], out)
                if os.path.exists(out):
                    e["kallaway"] = [f"ritmo-clip/{r['id']}_kallaway.mp4"] + e["kallaway"][:1]
                    e["rif"] = [f"reel {k['reel']} · {it(round(k['t0'], 2))}–{it(round(k['t1'], 2))} s (dal taglio)"] + e["rif"][:1]
        # COPIA (giro 2): clip dal render del reel copiato, KALLAWAY agli stessi istanti (sostituisce la clip KALLAWAY in testa)
        c = CP.get(r["id"])
        if c:
            ren = os.path.join(RENDER, f"{c['comp']}_bozza.mp4")
            cc = dict(comp=c["comp"], dove=f"{c['comp']} {it(round(c['t0'], 2))}–{it(round(c['t1'], 2))} s (scena {c['n']})", cosa=c["cosa"])
            if os.path.exists(ren):
                out = os.path.join(CLIPR, f"{r['id']}_copia.mp4")
                outk = os.path.join(CLIPR, f"{r['id']}_kcopia.mp4")
                if fai_clip and (solo is None or r["id"] in solo):
                    nuove += clip(ren, c["t0"], c["t1"], out)
                    if c.get("reel") in INV:
                        nuove += clip(os.path.join(CARTELLA, INV[c["reel"]]["file"]), c["kt0"], c["kt1"], outk)
                if os.path.exists(out):
                    cc["clip"] = f"ritmo-clip/{r['id']}_copia.mp4"
                if os.path.exists(outk):
                    e["kallaway"] = [f"ritmo-clip/{r['id']}_kcopia.mp4"] + e["kallaway"][:1]
                    e["rif"] = [f"reel {c['reel']} · {it(round(c['kt0'], 2))}–{it(round(c['kt1'], 2))} s (= copia)"] + e["rif"][:1]
                srcf = os.path.join(CAT, c["comp"], "index.src.html")
                if os.path.exists(srcf) and os.path.getmtime(srcf) > os.path.getmtime(ren) + 60:
                    cc["vecchio"] = f"render del {data_it(os.path.getmtime(ren))}, sorgente cambiato il {data_it(os.path.getmtime(srcf))}"
            else:
                cc["manca"] = f"manca il render di prova {c['comp']}_bozza.mp4"
            e["copia"] = cc
        e["scheda_copia"] = SCC.get(r["id"])
        e["copia_fatta"] = bool(e.get("copia", {}).get("clip"))
        ncopie += e["copia_fatta"]
        e["scheda"] = SC.get(r["id"])
        vk = voti.get(r["id"])
        if vk:
            giri = [vk] + vk.get("storia", [])
            rt = next((g for g in giri if str(g.get("giro", "")).startswith("ritmo")), None)
            pr = next((g for g in giri if not str(g.get("giro", "")).startswith(("ritmo", "copia"))), None)
            cp = next((g for g in giri if str(g.get("giro", "")).startswith("copia")), None)
            if cp:
                e["voto_copia"] = dict(giro=cp["giro"], voti=cp.get("voti", {}), misure=cp.get("misure", {}), manca=cp.get("manca", ""))
            if rt:
                e["voto"] = dict(giro=rt["giro"], voti=rt.get("voti", {}), misure=rt.get("misure", {}), manca=rt.get("manca", ""))
            if pr:
                e["voto_prima"] = dict(giro=pr.get("giro", ""), voti=pr.get("voti", {}))
        e["rifatta"] = bool(e.get("scheda") and e.get("dopo", {}).get("clip"))
        fatte += e["rifatta"]
        voci.append(e)
    json.dump(REG, io.open(preg, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    tpl = io.open(os.path.join(QUI, "catalogo_ritmo_template.html"), encoding="utf-8").read()
    fonts = ""
    for fam, fn, w in (("Advercase", "Advercase-Bold.ttf", 700), ("Patrick Hand", "PatrickHand-Regular.ttf", 400), ("Zalando Sans", "ZalandoSans-Variable.ttf", "100 900")):
        b64 = base64.b64encode(open(os.path.join(KIT, "assets", "fonts", fn), "rb").read()).decode()
        fonts += f'@font-face{{font-family:"{fam}";src:url(data:font/ttf;base64,{b64}) format("truetype");font-weight:{w};font-display:swap}}' + "\n"
    ora = datetime.datetime.now()
    db = dict(generato=ora.strftime("%d/%m/%Y %H:%M"), versione=ora.strftime("%Y%m%d%H%M%S%f"), voci=voci,
              categorie=cat["categorie"], totale=len(voci), fatte=fatte, copie=ncopie)
    payload = json.dumps(db, ensure_ascii=False).replace("</", "<\\/")
    io.open(os.path.join(CAT, "catalogo-ritmo.html"), "w", encoding="utf-8").write(
        tpl.replace("/*__FONTS__*/", fonts).replace("/*__DATI__*/null", payload))
    # la pagina aperta nel browser controlla questo file ogni 10 s e si ricarica quando la versione cambia
    io.open(os.path.join(CLIPR, "_versione.js"), "w", encoding="utf-8").write('window.__RITMO_VER = "%s";\n' % db["versione"])
    print(f"catalogo-ritmo.html: {len(voci)} voci, {fatte} rifatte, {ncopie} copie · clip nuove {nuove} · {sum(1 for e in voci if e['prima'].get('clip'))} PRIMA")


if __name__ == "__main__":
    main()
