import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comune import *
import cv2
utf8_stdout()
out = os.path.join(r"C:\Users\rinal\AppData\Local\Temp\claude\c--Users-rinal-Desktop-REMOTION---TEST-2\6e881d3d-02aa-455f-ad61-a4b2e70ddf28\scratchpad", "prova")
os.makedirs(out, exist_ok=True)
def grab(path, ts, name):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    print(path, fps, cap.get(cv2.CAP_PROP_FRAME_COUNT), cap.get(cv2.CAP_PROP_FRAME_WIDTH), cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cells = []
    for t in ts:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * fps)))
        ok, fr = cap.read()
        if not ok:
            continue
        fr = cv2.resize(fr, (270, 480), interpolation=cv2.INTER_AREA)
        cv2.putText(fr, f"{t:.2f}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        cells.append(fr)
    cap.release()
    cv2.imwrite(os.path.join(out, name), np.hstack(cells))
grab(reel_path(72), [9.5, 11.5, 12.2, 12.8, 14.0, 16.0], "r72.jpg")
grab(os.path.join(AN, "render", "reel-10_bozza.mp4"), [1.0, 5.0, 9.0, 13.0, 20.0, 30.0], "our10.jpg")
