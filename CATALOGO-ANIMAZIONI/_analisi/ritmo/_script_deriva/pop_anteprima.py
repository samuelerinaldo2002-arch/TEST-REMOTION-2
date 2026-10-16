import json, io, os, sys
import numpy as np, cv2
inv = {r["n"]: r for r in json.load(io.open("TUTTI-I-REEL/_inventario.json", encoding="utf-8"))}
C = [("D02", 1, 0.7, 1.5), ("H03", 76, 13.0, 15.0), ("L01", 5, 9.0, 11.0), ("L04", 50, 14.0, 16.0),
     ("O03", 6, 4.0, 6.0), ("L16", 69, 10.76, 11.6), ("O21", 49, 68.57, 69.6), ("U05", 9, 10.0, 12.0)]
righe = []
for k, (nome, n, a, b) in enumerate(C):
    cap = cv2.VideoCapture(inv[n]["file"]); fps = cap.get(cv2.CAP_PROP_FPS)
    cells = []
    for t in np.linspace(a, b, 9):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps))); ok, f = cap.read()
        f = cv2.resize(f, (1080, 1920), interpolation=cv2.INTER_AREA)[0:1150]
        for x in range(0, 1080, 100): cv2.line(f, (x, 0), (x, 1150), (60, 60, 170), 1)
        for y in range(0, 1150, 100): cv2.line(f, (0, y), (1080, y), (60, 60, 170), 1)
        c = cv2.resize(f, (216, 230), interpolation=cv2.INTER_AREA)
        cv2.putText(c, f"{t:.2f}", (3, 14), 0, 0.42, (255, 255, 255), 1)
        cells.append(c)
    cap.release()
    row = np.hstack(cells)
    lab = np.full((20, row.shape[1], 3), 12, np.uint8)
    cv2.putText(lab, f"{nome} reel {n} {a}-{b}s (griglia 100 px)", (5, 15), 0, 0.48, (255, 255, 255), 1)
    righe.append(np.vstack([lab, row]))
cv2.imwrite("CATALOGO-ANIMAZIONI/_analisi/ritmo/pop/anteprima_pop.jpg", np.vstack(righe), [cv2.IMWRITE_JPEG_QUALITY, 80])
print("ok")
