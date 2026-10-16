import cv2, numpy as np, sys, os
D = "CATALOGO-ANIMAZIONI/_analisi/ritmo/pop"
names = sys.argv[2:]
ims = [cv2.imread(os.path.join(D, n + ".jpg")) for n in names]
W = max(i.shape[1] for i in ims)
ims = [np.hstack([i, np.zeros((i.shape[0], W - i.shape[1], 3), np.uint8)]) for i in ims]
out = np.vstack(ims)
k = min(1.0, 1900 / out.shape[1])
out = cv2.resize(out, (int(out.shape[1] * k), int(out.shape[0] * k)), interpolation=cv2.INTER_AREA)
cv2.imwrite(os.path.join(D, sys.argv[1]), out, [cv2.IMWRITE_JPEG_QUALITY, 82])
print(out.shape)
