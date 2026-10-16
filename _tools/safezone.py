"""Safe zone: cerca grafica sotto la linea della faccia dell'utente (regola dell'11/10, immagine SAFEZONE.jpg).

    _tools/venv/Scripts/python.exe -I _tools/safezone.py VIDEO [--linea 1332] [--passo 5] [--soglia 0]

La linea rossa di SAFEZONE.jpg sta a y = 1332-1340 su 1080x1920: sotto la linea niente grafica, solo sfumature
verso il nero dello sfondo (quelle possono scendere anche sotto).
Per ogni fotogramma campionato stampa la riga piu' bassa (in px 1080x1920, anche per i video 4K) che ha almeno il 2%
di pixel piu' chiari della soglia, e quanti pixel chiari ci sono sotto la linea. La soglia, se 0, e' il 99,5
percentile della luminanza del fondo (ultime 150 righe di tutti i fotogrammi) + 25.
Una sfumatura risulta come pochi px sotto la linea che calano: guardare sempre il fotogramma prima di correggere.
"""
import argparse

import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--linea", type=int, default=1332)
ap.add_argument("--passo", type=int, default=5)
ap.add_argument("--soglia", type=float, default=0)
a = ap.parse_args()

cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS)
campioni = []
i = 0
while True:
    ok, fr = cap.read()
    if not ok:
        break
    if i % a.passo == 0:
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        if g.shape[0] != 1920:
            g = cv2.resize(g, (1080, 1920), interpolation=cv2.INTER_AREA)
        campioni.append((i / fps, g[a.linea - 40:, :].copy()))
    i += 1

fondo = np.concatenate([c[1][-150:].ravel() for c in campioni])
soglia = a.soglia or float(np.percentile(fondo, 99.5)) + 25
print(f"fotogrammi {i}, campioni {len(campioni)}, soglia luminanza {soglia:.0f}, linea {a.linea}")

fuori = 0
print("t(s)   riga piu' bassa con grafica   pixel chiari sotto la linea")
for t, reg in campioni:
    conta = (reg > soglia).sum(axis=1)
    piene = np.nonzero(conta > 1080 * 0.02)[0]
    if len(piene) == 0:
        continue
    y_bassa = a.linea - 40 + int(piene.max())
    if y_bassa > a.linea:
        fuori += 1
        px_sotto = int((reg[40:] > soglia).sum())
        print(f"{t:6.2f}   {y_bassa:5d} (+{y_bassa - a.linea:3d})   {px_sotto:7d}")
print(f"campioni con qualcosa sotto la linea: {fuori} su {len(campioni)}")
