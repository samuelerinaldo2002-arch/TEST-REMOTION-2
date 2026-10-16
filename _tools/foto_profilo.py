# -*- coding: utf-8 -*-
"""Scarica la VERA foto profilo Instagram (HD) dei creator da mostrare nei reel.

    python -I _tools/foto_profilo.py hormozi leilahormozi garyvee …
-> kw-kit/assets/avatars/<handle>.jpg  (+ _profili.json con nome, follower, bio)
Actor Apify `apify~instagram-scraper` (resultsType "details"); token letti da CLAUDE SYSTEM/.env, mai stampati.
"""
import io, json, os, sys, urllib.parse, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
CARTELLA = os.path.dirname(QUI)
OUT = os.path.join(CARTELLA, "kw-kit", "assets", "avatars")
ENV = r"C:\Users\rinal\Desktop\CLAUDE SYSTEM\.env"
API = "https://api.apify.com/v2"


def tokens():
    out = []
    for line in io.open(ENV, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = (x.strip() for x in line.split("=", 1))
            if k.startswith("APIFY_TOKEN") and v and "EXHAUSTED" not in k:
                out.append(v)
    return out


def req(url, data=None, timeout=300):
    r = urllib.request.Request(url, data=data, headers={"User-Agent": "Mozilla/5.0", "Content-Type": "application/json"}, method="POST" if data else "GET")
    with urllib.request.urlopen(r, timeout=timeout) as resp:
        return resp.read()


def main(handles):
    os.makedirs(OUT, exist_ok=True)
    body = json.dumps({"directUrls": [f"https://www.instagram.com/{h}/" for h in handles], "resultsType": "details", "resultsLimit": 1}).encode()
    items = None
    for t in tokens():
        try:
            items = json.loads(req(f"{API}/acts/apify~instagram-scraper/run-sync-get-dataset-items?" + urllib.parse.urlencode({"token": t}), body, 600).decode("utf-8"))
            break
        except Exception as e:
            print("   token fallito:", str(e)[:80])
    if not items:
        sys.exit("nessun risultato")
    prof = {}
    pth = os.path.join(OUT, "_profili.json")
    if os.path.exists(pth):
        prof = json.load(io.open(pth, encoding="utf-8"))
    for it in items:
        h = (it.get("username") or "").lower()
        url = it.get("profilePicUrlHD") or it.get("profilePicUrl")
        if not h or not url:
            continue
        try:
            blob = req(url, timeout=120)
            open(os.path.join(OUT, f"{h}.jpg"), "wb").write(blob)
            prof[h] = {"nome": it.get("fullName"), "follower": it.get("followersCount"), "post": it.get("postsCount"), "bio": it.get("biography"), "verificato": it.get("verified")}
            print(f"✓ {h}.jpg ({len(blob) // 1024} KB) · {it.get('fullName')} · {it.get('followersCount')} follower")
        except Exception as e:
            print(f"✗ {h}: {str(e)[:80]}")
    json.dump(prof, io.open(pth, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main(sys.argv[1:])
