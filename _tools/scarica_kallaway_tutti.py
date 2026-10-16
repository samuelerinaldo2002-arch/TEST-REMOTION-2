# -*- coding: utf-8 -*-
"""Scarica TUTTI i reel di @kallawaymarketing (oltre ai 100 gia' presenti nella cartella).

    python -I _tools/scarica_kallaway_tutti.py conta           # quanti post ha il profilo (1 risultato Apify)
    python -I _tools/scarica_kallaway_tutti.py metadati [N]    # run Apify asincrona -> TUTTI-I-REEL/_apify_posts.json
    python -I _tools/scarica_kallaway_tutti.py video           # scarica i video mancanti (6 in parallelo) + _inventario.json

Stessa strada di scarica_kallaway_100.py: actor `apify~instagram-scraper`, token letti da
CLAUDE SYSTEM/.env e mai stampati. I reel nuovi finiscono in TUTTI-I-REEL/AAAA-MM-GG_SHORTCODE.mp4;
_inventario.json elenca tutti i reel (i 100 vecchi + i nuovi) dal piu' recente al piu' vecchio.
Solo libreria standard: gira con `python -I`.
"""
import io, json, os, sys, time, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
TUTTI = os.path.join(CARTELLA, "TUTTI-I-REEL")
ENV = r"C:\Users\rinal\Desktop\CLAUDE SYSTEM\.env"
PROFILO = "kallawaymarketing"
ACTOR = "apify~instagram-scraper"
API = "https://api.apify.com/v2"


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


def req(url, data=None, timeout=60):
    r = urllib.request.Request(url, data=data, headers={"User-Agent": "Mozilla/5.0", "Content-Type": "application/json"}, method="POST" if data else "GET")
    with urllib.request.urlopen(r, timeout=timeout) as resp:
        return resp.status, resp.read()


def token_valido(t):
    try:
        st, _ = req(f"{API}/users/me?" + urllib.parse.urlencode({"token": t}), timeout=20)
        return st == 200
    except Exception:
        return False


def tokens_validi():
    toks = [t for _, t in env_tokens() if token_valido(t)]
    if not toks:
        print("nessun token Apify valido"); sys.exit(1)
    print(f"token Apify validi: {len(toks)}")
    return toks


def conta():
    for t in tokens_validi():
        try:
            body = json.dumps({"directUrls": [f"https://www.instagram.com/{PROFILO}/"], "resultsType": "details", "resultsLimit": 1}).encode()
            _, raw = req(f"{API}/acts/{ACTOR}/run-sync-get-dataset-items?" + urllib.parse.urlencode({"token": t}), body, 300)
            d = json.loads(raw.decode("utf-8"))[0]
            print(f"@{PROFILO}: {d.get('postsCount')} post · {d.get('followersCount')} follower · igtv {d.get('igtvVideoCount')}")
            return
        except Exception as e:
            print(f"   token fallito: {str(e)[:80]}")


def metadati(limite):
    os.makedirs(TUTTI, exist_ok=True)
    for t in tokens_validi():
        tq = urllib.parse.urlencode({"token": t})
        try:
            body = json.dumps({"directUrls": [f"https://www.instagram.com/{PROFILO}/"], "resultsType": "posts", "resultsLimit": limite}).encode()
            _, raw = req(f"{API}/acts/{ACTOR}/runs?{tq}", body, 60)
            run = json.loads(raw.decode("utf-8"))["data"]
        except Exception as e:
            print(f"   avvio fallito con questo token: {str(e)[:80]}"); continue
        rid, ds = run["id"], run["defaultDatasetId"]
        print(f"run Apify avviata ({limite} post richiesti), attendo…")
        stato = run.get("status")
        while stato in ("READY", "RUNNING"):
            time.sleep(20)
            try:
                _, raw = req(f"{API}/actor-runs/{rid}?{tq}", timeout=30)
                stato = json.loads(raw.decode("utf-8"))["data"]["status"]
                _, raw = req(f"{API}/datasets/{ds}?{tq}", timeout=30)
                n = json.loads(raw.decode("utf-8"))["data"].get("itemCount")
                print(f"   {time.strftime('%H:%M:%S')} {stato} · {n} post finora")
            except Exception as e:
                print(f"   (poll: {str(e)[:60]})")
        items, off = [], 0
        while True:
            _, raw = req(f"{API}/datasets/{ds}/items?" + urllib.parse.urlencode({"token": t, "format": "json", "clean": "true", "offset": off, "limit": 500}), timeout=120)
            page = json.loads(raw.decode("utf-8"))
            items += page
            off += len(page)
            if len(page) < 500:
                break
        out = os.path.join(TUTTI, "_apify_posts.json")
        with io.open(out, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False)
        video = [x for x in items if x.get("videoUrl")]
        date = sorted((x.get("timestamp") or "")[:10] for x in video)
        print(f"stato finale {stato} · post: {len(items)} · video: {len(video)} · dal {date[0] if date else '?'} al {date[-1] if date else '?'}")
        return
    print("nessun token ha funzionato"); sys.exit(1)


def video():
    items = json.load(io.open(os.path.join(TUTTI, "_apify_posts.json"), encoding="utf-8"))
    vecchi = []
    for nome in ("_info_reel.json", "_info_reel_41-100.json"):
        p = os.path.join(CARTELLA, nome)
        if os.path.exists(p):
            vecchi += json.load(io.open(p, encoding="utf-8"))
    per_codice = {v["url"].rstrip("/").split("/")[-1]: v for v in vecchi}
    visti, video = set(), []
    for x in items:
        c = x.get("shortCode")
        if x.get("videoUrl") and c and c not in visti:
            visti.add(c); video.append(x)
    da_scaricare = [x for x in video if x["shortCode"] not in per_codice]
    print(f"video nel profilo: {len(video)} · gia' presenti: {len(video) - len(da_scaricare)} · da scaricare: {len(da_scaricare)}")

    def scarica(x):
        nome = f"{(x.get('timestamp') or '0000-00-00')[:10]}_{x['shortCode']}.mp4"
        dest = os.path.join(TUTTI, nome)
        if os.path.exists(dest) and os.path.getsize(dest) > 10000:
            return nome, True
        for tentativo in range(3):
            try:
                _, blob = req(x["videoUrl"], timeout=180)
                with open(dest + ".part", "wb") as f:
                    f.write(blob)
                os.replace(dest + ".part", dest)
                return nome, True
            except Exception:
                time.sleep(3)
        return nome, False

    fatti = 0
    with ThreadPoolExecutor(6) as ex:
        for nome, ok in ex.map(scarica, da_scaricare):
            fatti += 1
            if not ok or fatti % 25 == 0:
                print(f"   {fatti}/{len(da_scaricare)} {'✓' if ok else '✗ ' + nome}")

    inv = []
    for x in video:
        c = x["shortCode"]
        if c in per_codice:
            f = per_codice[c]["file"]
        else:
            f = "TUTTI-I-REEL/" + f"{(x.get('timestamp') or '0000-00-00')[:10]}_{c}.mp4"
        inv.append({
            "file": f, "esiste": os.path.exists(os.path.join(CARTELLA, f)), "codice": c,
            "url": f"https://www.instagram.com/reel/{c}/", "data": (x.get("timestamp") or "")[:10],
            "views": x.get("videoPlayCount") or x.get("videoViewCount") or 0, "likes": x.get("likesCount") or 0,
            "commenti": x.get("commentsCount") or 0, "durata": x.get("videoDuration") or 0, "caption": x.get("caption") or "",
        })
    inv.sort(key=lambda r: r["data"], reverse=True)
    for i, r in enumerate(inv, 1):
        r["n"] = i
    with io.open(os.path.join(TUTTI, "_inventario.json"), "w", encoding="utf-8") as f:
        json.dump(inv, f, ensure_ascii=False, indent=1)
    print(f"inventario: {len(inv)} reel ({sum(r['esiste'] for r in inv)} file presenti) · TUTTI-I-REEL/_inventario.json")


def uno(codice):
    """riprende un solo reel con un link video nuovo (quando il CDN rifiuta quello vecchio)"""
    for t in tokens_validi():
        try:
            body = json.dumps({"directUrls": [f"https://www.instagram.com/reel/{codice}/"], "resultsType": "posts", "resultsLimit": 1}).encode()
            _, raw = req(f"{API}/acts/{ACTOR}/run-sync-get-dataset-items?" + urllib.parse.urlencode({"token": t}), body, 300)
            x = json.loads(raw.decode("utf-8"))[0]
            dest = os.path.join(TUTTI, f"{(x.get('timestamp') or '0000-00-00')[:10]}_{codice}.mp4")
            _, blob = req(x["videoUrl"], timeout=400)
            with open(dest, "wb") as f:
                f.write(blob)
            print(f"✓ {os.path.basename(dest)} ({len(blob) // 1024} KB)")
            return
        except Exception as e:
            print(f"   tentativo fallito: {str(e)[:80]}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "conta"
    if cmd == "uno":
        uno(sys.argv[2])
    if cmd == "conta":
        conta()
    elif cmd == "metadati":
        metadati(int(sys.argv[2]) if len(sys.argv) > 2 else 2000)
    elif cmd == "video":
        video()
