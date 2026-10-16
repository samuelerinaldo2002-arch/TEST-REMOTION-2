# altezza della barra verde del termometro (reel 72, 9.333-11.833 s): bordo alto dei pixel verdi nella colonna del tubo
import cv2, numpy as np, json, io
inv = {r["n"]: r for r in json.load(io.open("TUTTI-I-REEL/_inventario.json", encoding="utf-8"))}
cap = cv2.VideoCapture(inv[72]["file"]); fps = cap.get(cv2.CAP_PROP_FPS)
i0, i1 = int(round(9.375 * fps)), int(round(11.80 * fps))
cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
out = []
for i in range(i0, i1 + 1):
    ok, f = cap.read()
    f = cv2.resize(f, (1080, 1920), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(f[100:1100, 180:360], cv2.COLOR_BGR2HSV)
    g = (hsv[..., 0] > 40) & (hsv[..., 0] < 85) & (hsv[..., 1] > 120) & (hsv[..., 2] > 120)
    rows = np.where(g.sum(1) > 4)[0]
    top, bot = (int(rows.min()) + 100, int(rows.max()) + 100) if len(rows) else (None, None)
    out.append((round(i / fps - 9.333, 3), top, bot))
bots = [b for _, _, b in out if b]; B = max(bots) if bots else None
for t, top, bot in out[::3]:
    print(t, top, bot, None if top is None else B - top)
