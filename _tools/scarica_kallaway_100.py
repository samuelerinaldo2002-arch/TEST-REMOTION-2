# -*- coding: utf-8 -*-
"""Porta la reference Kallaway da 40 a 100 reel.

    python -I _tools/scarica_kallaway_100.py [quanti=60]

Usa la stessa strada di CLAUDE SYSTEM/research (actor Apify `apify~instagram-scraper`,
token letti da CLAUDE SYSTEM/.env, mai stampati). Scarta i reel gia' presenti in
_info_reel.json, prende i successivi in ordine di data (i piu' recenti prima) e li salva
come NN_AAAA-MM-GG_SHORTCODE.mp4 (41..100) + _info_reel_41-100.json con le stesse chiavi.
Solo libreria standard: gira con `python -I`.
"""
import io, json, os, sys, time, urllib.request, urllib.parse

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
ENV = r"C:\Users\rinal\Desktop\CLAUDE SYSTEM\.env"
PROFILO = "kallawaymarketing"
QUANTI = int(sys.argv[1]) if len(sys.argv) > 1 else 60
ACTOR = "apify~instagram-scraper"


def env_tokens():
    toks = []
    for line in io.open(ENV, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip()
            if k.startswith("APIFY_TOKEN") and v and "EXHAUSTED" not in k:
                toks.append((k, v))
    return sorted(toks)


def get(url, timeout=30):
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=timeout) as r:
        return r.status, r.read()


def token_valido(t):
    try:
        st, _ = get("https://api.apify.com/v2/users/me?" + urllib.parse.urlencode({"token": t}), 20)
        return st == 200
    except Exception:
        return False


def chiama_actor(token, limite):
    url = f"https://api.apify.com/v2/acts/{ACTOR}/run-sync-get-dataset-items?" + urllib.parse.urlencode({"token": token})
    body = json.dumps({"directUrls": [f"https://www.instagram.com/{PROFILO}/"], "resultsType": "posts", "resultsLimit": limite}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    gia = json.load(io.open(os.path.join(CARTELLA, "_info_reel.json"), encoding="utf-8"))
    nuovi_path = os.path.join(CARTELLA, "_info_reel_41-100.json")
    precedenti = json.load(io.open(nuovi_path, encoding="utf-8")) if os.path.exists(nuovi_path) else []
    codici_gia = {g["url"].rstrip("/").split("/")[-1] for g in gia + precedenti}
    print(f"gia' presenti: {len(codici_gia)} reel")

    tokens = [t for k, t in env_tokens() if token_valido(t)]
    if not tokens:
        print("nessun token Apify valido"); sys.exit(1)
    print(f"token Apify validi: {len(tokens)}")

    items = None
    for t in tokens:
        try:
            print("chiamo l'actor (puo' richiedere qualche minuto)…")
            # ~4 post su 10 sono caroselli/foto: si chiede abbondante
            items = chiama_actor(t, int((len(codici_gia) + QUANTI) * 1.8) + 40)
            break
        except Exception as e:
            print(f"   token fallito: {str(e)[:80]}")
    if not items:
        print("nessun risultato"); sys.exit(1)

    video = [x for x in items if (x.get("type") == "Video" or x.get("videoUrl")) and x.get("videoUrl")]
    video = [x for x in video if (x.get("shortCode") or "") not in codici_gia]
    video.sort(key=lambda x: x.get("timestamp") or "", reverse=True)
    # i post fissati in alto tornano sempre: vanno bene lo stesso, sono reel veri
    scelti = video[:QUANTI]
    print(f"post ricevuti: {len(items)} · video nuovi: {len(video)} · scarico: {len(scelti)}")

    info, n = list(precedenti), len(gia) + len(precedenti)
    for x in scelti:
        n += 1
        data = (x.get("timestamp") or "")[:10]
        code = x.get("shortCode") or f"x{n}"
        nome = f"{n:02d}_{data}_{code}.mp4"
        dest = os.path.join(CARTELLA, nome)
        if not os.path.exists(dest):
            for tentativo in range(3):
                try:
                    st, blob = get(x["videoUrl"], 120)
                    with open(dest, "wb") as f:
                        f.write(blob)
                    break
                except Exception as e:
                    print(f"   {nome}: tentativo {tentativo + 1} fallito ({str(e)[:60]})")
                    time.sleep(2)
        ok = os.path.exists(dest)
        print(f"{'✓' if ok else '✗'} {nome}  {x.get('videoPlayCount') or x.get('videoViewCount') or 0} views")
        info.append({
            "file": nome, "url": f"https://www.instagram.com/reel/{code}/", "data": data,
            "views": x.get("videoPlayCount") or x.get("videoViewCount") or 0,
            "likes": x.get("likesCount") or 0, "commenti": x.get("commentsCount") or 0,
            "durata": x.get("videoDuration") or 0, "caption": x.get("caption") or "",
        })
    with io.open(nuovi_path, "w", encoding="utf-8") as f:
        json.dump(info, f, ensure_ascii=False, indent=1)
    print(f"fatto: {sum(1 for i in info if os.path.exists(os.path.join(CARTELLA, i['file'])))} file · _info_reel_41-100.json")


if __name__ == "__main__":
    main()
