# -*- coding: utf-8 -*-
"""Scontorno locale con IS-Net (isnet-general-use, lo stesso modello di rembg) eseguito con cv2.dnn, senza Photoshop.

    _tools/venv/Scripts/python.exe -I _tools/scontorno.py _tools/modelli/isnet-general-use.onnx foto.jpg uscita_cut.png [maschera.png]
"""
import sys, numpy as np, cv2
mdl, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
im = cv2.imread(src, cv2.IMREAD_COLOR)
H, W = im.shape[:2]
rgb = cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(np.float32)
x = cv2.resize(rgb, (1024, 1024), interpolation=cv2.INTER_LANCZOS4)
x = x / max(1.0, float(x.max()))
x = (x - 0.5) / 1.0
blob = x.transpose(2, 0, 1)[None].astype(np.float32)
net = cv2.dnn.readNetFromONNX(mdl)
net.setInput(blob)
outs = net.forward(net.getUnconnectedOutLayersNames())
pred = outs[0] if isinstance(outs, (list, tuple)) else outs
pred = np.array(pred).reshape(-1, 1024, 1024)[0]
pred = (pred - pred.min()) / max(1e-6, pred.max() - pred.min())
m = cv2.resize(pred, (W, H), interpolation=cv2.INTER_LINEAR)
a = np.clip(m * 255, 0, 255).astype(np.uint8)
rgba = np.dstack([im, a])
cv2.imwrite(out, rgba)
if len(sys.argv) > 4: cv2.imwrite(sys.argv[4], a)
print(out, W, H, "alpha media", round(float(a.mean()) / 255, 3))
