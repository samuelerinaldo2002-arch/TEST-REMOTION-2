# confronto a vista: fotogramma subito dopo il taglio vs 2,4 s dopo, ritaglio del bordo destro (griglia + scala)
import cv2, numpy as np, json, io, os
inv = {r["n"]: r for r in json.load(io.open("TUTTI-I-REEL/_inventario.json", encoding="utf-8"))}
cap = cv2.VideoCapture(inv[72]["file"])
fps = cap.get(cv2.CAP_PROP_FPS)
def fr(t):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
    ok, f = cap.read()
    return cv2.resize(f, (1080, 1920), interpolation=cv2.INTER_CUBIC)
a, b = fr(9.42), fr(11.75)
crop = lambda f: f[100:700, 640:1080]
A, B = crop(a), crop(b)
mix = np.zeros_like(A)
mix[..., 2] = cv2.cvtColor(A, cv2.COLOR_BGR2GRAY)   # rosso = prima
mix[..., 1] = cv2.cvtColor(B, cv2.COLOR_BGR2GRAY)   # verde = dopo
out = np.hstack([A, B, mix])
cv2.putText(out, "9.42s", (10, 30), 0, 0.8, (255, 255, 255), 2); cv2.putText(out, "11.75s", (450, 30), 0, 0.8, (255, 255, 255), 2)
cv2.putText(out, "rosso=prima verde=dopo (giallo=fermo)", (890, 30), 0, 0.6, (255, 255, 255), 2)
os.makedirs("CATALOGO-ANIMAZIONI/_analisi/ritmo/deriva", exist_ok=True)
cv2.imwrite("CATALOGO-ANIMAZIONI/_analisi/ritmo/deriva/r72_griglia_ferma.jpg", out)
