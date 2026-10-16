# -*- coding: utf-8 -*-
"""Per ogni frase di uno script propone i 2–4 template (TPL.<ID>) adatti, e segnala quelli già usati nei reel vicini.

    python -I _tools/suggerisci_template.py d14 [--n 4] [--vicini 2]

Fonti (niente da copiare a mano):
- le parole della voce: ../my-video-ottobre-p1-test/src/words/dDD.ts (come _tools/parole.py), divise in frasi sui . ? ! …
- le schede in testa ai template (kw-kit/kit2-template.js, kit2-tpl-*.js): «quando» e «frase» (parole in comune, pesate)
- CATALOGO-ANIMAZIONI/SCRIPT-CATEGORIZZATI.md, sezione «DD/10»: le battute dello script con le animazioni consigliate
- CATALOGO-ANIMAZIONI/catalogo.json, campo negli_script (la voce compare in questo script)
- contro le ripetizioni: le chiamate TPL.<ID>( nei sorgenti dei reel (reel-*/index.src.html) e le tabelle dei PIANO.md, per i
  reel entro ±vicini dal numero dello script (es. d14 → reel-12…reel-16)
Uscita: per ogni frase [inizio–fine] i template proposti con il motivo (S = battuta di SCRIPT-CATEGORIZZATI, Q = «quando» della
scheda, N = negli_script, P = parola chiave del tipo di frase) e «già in reel-NN»; in fondo un piano senza ripetizioni (ogni
template una volta) e le voci del catalogo consigliate che non hanno ancora un template.
"""
import glob, io, json, math, os, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
CAT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI")
KIT = os.path.join(CARTELLA, "kw-kit")
WORDS = os.path.abspath(os.path.join(CARTELLA, "..", "my-video-ottobre-p1-test", "src", "words"))

STOP = set("""a ad al alla alle allo agli ai anche ancora che chi ci con cosa così da dal dalla dalle dai degli dei del della delle
dello di e è ed era fa fai fare gli ha hai ho i il in io la le li lo ma mi ne nei nel nella nelle non o per perché più poi quando
quella quelle quello questa queste questo se si sia sono su sua sue sui sul sulla suo suoi te ti tra tu tua tue tuo tuoi un una
uno vuoi è ecco come dove ogni solo tutto tutti cioè quindi però già sempre sei siamo stai sta essere avere fatto viene vedi
devi puoi può""".split())

# parole chiave del tipo di frase → template (P): quando la frase contiene la parola, il template prende un punto in più
CUE = [
    (r"\bcommenta", ["X01"]), (r"claude|chatgpt|prompt|comando|chiedi", ["U01"]),
    (r"\bbio\b|profilo", ["U02", "K04", "F08"]), (r"stori[ae]", ["T02", "F03", "F08"]),
    (r"luce|fotocamera|faro|illumin", ["F01", "F04"]), (r"calendari|giorn[oi]|settiman|mese", ["O24", "K16", "U15"]),
    (r"second[oi]|minut|timer", ["U15", "D06"]), (r"%|percent|per cento", ["O23", "D01"]),
    (r"\b(\d+|due|tre|quattro|cinque|sei|sette|otto|dieci)\b", ["L01", "D02", "O23"]),
    (r"\bprim[ao]\b|\bsecond[ao]\b|\bterz[ao]\b|\bultim[ao]\b", ["L02", "L11"]),
    (r"passi|step|poi\b|dopo|bozza|duplica", ["L11", "U10", "U11", "U07"]),
    (r"visualizzazion|views|virale|milion", ["D01", "F02", "A01", "D02"]),
    (r"algoritmo", ["T05", "T02", "O21"]), (r"cervello|convince|mente|emozion", ["O13", "T01"]),
    (r"eccezion|soglia|fallimento", ["F04", "K11"]), (r"giust[ie]|obiettivo|bersaglio", ["O10"]),
    (r"script|copion|hook", ["L12", "U01"]), (r"filon|nicchia|temi", ["L09", "O10"]),
    (r"formati|funzionando|tendenz", ["D02", "A01"]), (r"idee|contenuti degli altri|guardando", ["A01", "K11"]),
    (r"danno|chiedono|invece|non è.*è\b", ["K03", "F01"]), (r"\bsale\b|salire|livell|gradin|scala", ["D13", "D01"]),
    (r"follower|persone nuove|chi ti segue", ["O21", "F08"]), (r"sito|carica|clicca|seleziona", ["U03"]),
]


def stem(w):
    w = re.sub(r"[^a-zàèéìòù0-9%]", "", w.lower())
    return w[:5] if len(w) > 5 else w


def toks(s):
    return {stem(w) for w in re.split(r"[\s'’«»\"().,;:!?…/\-–]+", s.lower()) if w and w not in STOP and len(stem(w)) > 2}


def frasi(dd):
    t = io.open(os.path.join(WORDS, dd + ".ts"), encoding="utf-8").read()
    ws = [(w, int(a) / 30, int(b) / 30) for w, a, b in re.findall(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*(\d+)\s*,\s*(\d+)\s*\]', t)]
    out, cur = [], []
    for w, a, b in ws:
        if cur and w.startswith("'"):
            cur[-1] = (cur[-1][0] + w, cur[-1][1], b)  # «L» + «'algoritmo»
        else:
            cur.append((w, a, b))
        if re.search(r"[.?!…]$", w):
            out.append(cur); cur = []
    if cur:
        out.append(cur)
    # R1 (una scena per idea, ~4 s): una frase più corta di 1,6 s si unisce alla seguente («Non lo è. È l'eccezione…»)
    uniti = []
    for f in out:
        if uniti and uniti[-1][-1][2] - uniti[-1][0][1] < 1.6:
            uniti[-1] = uniti[-1] + f
        else:
            uniti.append(f)
    return [(" ".join(x[0] for x in f), f[0][1], f[-1][2]) for f in uniti]


def schede():
    out = {}
    for f in sorted(glob.glob(os.path.join(KIT, "kit2-template.js")) + glob.glob(os.path.join(KIT, "kit2-tpl-*.js"))):
        src = io.open(f, encoding="utf-8").read()
        for m in re.finditer(r"/\*\s*@scheda\s+([A-Z]\d+)\s*·\s*([^\n]*)\n(.*?)\*/", src, re.S):
            sc, k = {"nome": m.group(2).strip()}, None
            for raw in m.group(3).split("\n"):
                ln = re.sub(r"^\s*\*", "", raw)
                mk = re.match(r"^ (\w+):\s?(.*)$", ln)
                if mk:
                    k = mk.group(1); sc[k] = mk.group(2)
                elif k and ln.strip():
                    sc[k] += " " + ln.strip()
            out[m.group(1)] = sc
    return out


def battute(dd):
    """Le righe «battuta | animazioni» della sezione DD/10 di SCRIPT-CATEGORIZZATI.md."""
    md = io.open(os.path.join(CAT, "SCRIPT-CATEGORIZZATI.md"), encoding="utf-8").read()
    m = re.search(r"^## " + re.escape(f"{int(dd[1:]):02d}/10") + r" · (.*?)$(.*?)(?=^## |\Z)", md, re.S | re.M)
    if not m:
        return "", []
    rows = []
    for ln in m.group(2).split("\n"):
        r = re.match(r"^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$", ln)
        if r and not r.group(1).startswith(("Battuta", "---")):
            rows.append((r.group(1), re.findall(r"\b([A-Z]\d\d)\b", r.group(2))))
    return m.group(1), rows


def usati_vicini(n, k):
    """TPL usati nei reel entro ±k dal numero dello script: dai sorgenti e dai PIANO.md."""
    uso = {}
    for d in glob.glob(os.path.join(CARTELLA, "reel-*")):
        mm = re.match(r"reel-(\d+)$", os.path.basename(d))
        if not mm or abs(int(mm.group(1)) - n) > k:
            continue
        nome = os.path.basename(d)
        for f in ("index.src.html", "PIANO.md"):
            p = os.path.join(d, f)
            if os.path.exists(p):
                for i in re.findall(r"TPL\.([A-Z]\d\d)\b", io.open(p, encoding="utf-8").read()):
                    uso.setdefault(i, set()).add(nome)
    return {i: sorted(v) for i, v in uso.items()}


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__); return
    dd = a[0] if a[0].startswith("d") else "d" + a[0]
    N = int(a[a.index("--n") + 1]) if "--n" in a else 4
    K = int(a[a.index("--vicini") + 1]) if "--vicini" in a else 2
    SC = schede()
    cat = {v["id"]: v for v in json.load(io.open(os.path.join(CAT, "catalogo.json"), encoding="utf-8"))["voci"]}
    data = f"{int(dd[1:]):02d}/10"
    ns = {i for i, v in cat.items() if any(str(x).startswith(data) for x in v.get("negli_script", []))}
    titolo, BT = battute(dd)
    USO = usati_vicini(int(dd[1:]), K)
    QUESTO = f"reel-{int(dd[1:]):02d}"
    # pesi delle parole (idf sulle schede): le parole rare contano di più
    QT = {i: toks(s.get("quando", "") + " " + s.get("frase", "")) for i, s in SC.items()}
    df = {}
    for t in QT.values():
        for w in t:
            df[w] = df.get(w, 0) + 1
    idf = {w: math.log((len(QT) + 1) / (c + 0.5)) for w, c in df.items()}
    F = frasi(dd)
    print(f"{dd} · {data} · {titolo or '(non in SCRIPT-CATEGORIZZATI.md)'} · {len(F)} frasi · {len(SC)} template")
    print(f"già usati nei reel vicini (±{K}): " + (", ".join(f"{i} ({' '.join(v)})" for i, v in sorted(USO.items())) or "nessuno"))
    print()
    piano, presi, senza = [], set(), {}
    for fr, t0, t1 in F:
        ft = toks(fr)
        sc = {}
        why = {}
        # S · le battute dello script che somigliano alla frase
        for b, ids in BT:
            bt = toks(re.sub(r"^hook\s*", "", b))
            if not bt:
                continue
            o = len(ft & bt) / len(bt)
            if o >= 0.34:
                for i in ids:
                    if i in SC:
                        sc[i] = sc.get(i, 0) + 3 * o; why.setdefault(i, set()).add("S")
                    else:
                        senza.setdefault(i, cat.get(i, {}).get("nome", ""))
        # Q · «quando» e «frase» della scheda
        for i, qt in QT.items():
            s = sum(idf.get(w, 0) for w in ft & qt)
            if s > 2.2:
                sc[i] = sc.get(i, 0) + min(2.5, s / 3); why.setdefault(i, set()).add("Q")
        # P · parole chiave del tipo di frase
        for rx, ids in CUE:
            if re.search(rx, fr.lower()):
                for i in ids:
                    if i in SC:
                        sc[i] = sc.get(i, 0) + 1.0; why.setdefault(i, set()).add("P")
        # N · la voce del catalogo compare in questo script (solo come spareggio)
        for i in list(sc):
            if i in ns:
                sc[i] += 0.5; why[i].add("N")
        top = sorted(sc.items(), key=lambda x: -x[1])[:N]
        top = [x for x in top if x[1] >= 1.0] or top[:2]
        print(f"[{t0:5.2f}–{t1:5.2f}] {fr}")
        for i, s in top:
            u = f" · già in {', '.join(r + (' (questo script)' if r == QUESTO else '') for r in USO[i])}" if i in USO else ""
            print(f"    TPL.{i} {SC[i]['nome'][:70]} ({'+'.join(sorted(why[i]))} {s:.1f}){u}")
        # piano: il migliore non ancora preso e, se possibile, non usato nei reel vicini
        altri = lambda i: [r for r in USO.get(i, []) if r != QUESTO]
        scelta = next((i for i, _ in top if i not in presi and not altri(i)), None) or next((i for i, _ in top if i not in presi), None)
        if scelta:
            presi.add(scelta)
        piano.append((t0, scelta))
    print()
    print("piano senza ripetizioni (il primo libero, evitando gli altri reel vicini): " + " · ".join(f"{t:.1f} s {i or '—'}" for t, i in piano))
    if senza:
        print("consigliate da SCRIPT-CATEGORIZZATI ma ancora senza template: " + ", ".join(f"{i} {n}" for i, n in sorted(senza.items())))


if __name__ == "__main__":
    main()
