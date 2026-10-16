# -*- coding: utf-8 -*-
"""Contact sheets: ~6 fps grid with timestamps, detected cuts (red), candidate cuts (yellow), segment type bar."""
import os
import numpy as np
import cv2

TIPO_COL = {"grafica": (60, 200, 60), "piena": (0, 140, 255), "light": (235, 235, 235), None: (90, 90, 90)}

def leggi_video(path, step=None, keep=None, cw=100, ch=178, kw=150, kh=267):
    """Decode sequentially. Returns fps, nframes, grid thumbs {idx: img} every `step` frames,
    and detail thumbs {idx: img} for indices in `keep`."""
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    if step is None:
        step = max(1, int(round(fps / 6.0)))
    keep = set(keep or [])
    grid, det = {}, {}
    i = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        if i % step == 0:
            grid[i] = cv2.resize(fr, (cw, ch), interpolation=cv2.INTER_AREA)
        if i in keep:
            det[i] = cv2.resize(fr, (kw, kh), interpolation=cv2.INTER_AREA)
        i += 1
    cap.release()
    return fps, i, step, grid, det

def put(img, txt, org, scale=0.42, col=(255, 255, 255), th=1):
    cv2.putText(img, txt, org, cv2.FONT_HERSHEY_SIMPLEX, scale, (0, 0, 0), th + 2, cv2.LINE_AA)
    cv2.putText(img, txt, org, cv2.FONT_HERSHEY_SIMPLEX, scale, col, th, cv2.LINE_AA)

def foglio_griglia(titolo, fps, nfr, step, grid, cuts, cand, tipo_di, out_prefix, cols=18, rows=8, cw=100, ch=178,
                   extra_marks=None):
    """cuts/cand: frame indices. tipo_di(frame)->type or None. extra_marks: {frame: (label, color)}.
    Writes out_prefix_pNN.jpg. Returns list of written paths."""
    extra_marks = extra_marks or {}
    idxs = sorted(grid)
    LM, GAP, LAB, TOPB, HEAD = 64, 3, 16, 5, 34
    rowh = TOPB + ch + LAB + GAP
    W = LM + cols * (cw + GAP)
    per_page = cols * rows
    paths = []
    cuts = sorted(cuts); cand = sorted(cand)
    for p0 in range(0, len(idxs), per_page):
        chunk = idxs[p0:p0 + per_page]
        nrows = (len(chunk) + cols - 1) // cols
        H = HEAD + nrows * rowh + 4
        img = np.full((H, W, 3), 28, np.uint8)
        t0, t1 = chunk[0] / fps, chunk[-1] / fps
        put(img, f"{titolo}   {t0:.1f}-{t1:.1f}s   step {step} fr (~{fps/step:.1f} fps)   ROSSO=taglio rilevato  GIALLO=candidato  barra: verde=grafica arancio=piena bianco=light",
            (8, 22), 0.5, (255, 255, 255), 1)
        for k, fi in enumerate(chunk):
            r, c = divmod(k, cols)
            x = LM + c * (cw + GAP)
            y = HEAD + r * rowh
            if c == 0:
                put(img, f"{fi/fps:.1f}s", (4, y + TOPB + ch // 2), 0.5, (255, 255, 255), 1)
            img[y + TOPB:y + TOPB + ch, x:x + cw] = grid[fi]
            tp = tipo_di(fi)
            img[y:y + TOPB, x:x + cw] = TIPO_COL.get(tp, (90, 90, 90))
            # cut inside (prev_cell, this_cell]
            prev = fi - step
            hit = [cf for cf in cuts if prev < cf <= fi]
            hitc = [cf for cf in cand if prev < cf <= fi]
            lab = f"{fi/fps:.2f}"
            col = (200, 200, 200)
            if hitc and not hit:
                cv2.rectangle(img, (x - 2, y + TOPB - 1), (x + cw + 1, y + TOPB + ch), (0, 230, 255), 2)
                lab = f"?{hitc[0]/fps:.2f}"
                col = (0, 230, 255)
            if hit:
                cv2.rectangle(img, (x - 2, y + TOPB - 1), (x + cw + 1, y + TOPB + ch), (0, 0, 255), 3)
                cv2.line(img, (x - 2, y), (x - 2, y + rowh - GAP), (0, 0, 255), 3)
                lab = f"T{hit[0]/fps:.2f}"
                col = (80, 80, 255)
            for ef, (el, ecol) in extra_marks.items():
                if prev < ef <= fi:
                    cv2.circle(img, (x + cw - 10, y + TOPB + 10), 7, ecol, -1)
                    put(img, el, (x + 3, y + TOPB + 30), 0.4, ecol, 1)
            put(img, lab, (x + 2, y + TOPB + ch + 13), 0.42, col, 1)
        path = f"{out_prefix}_p{p0 // per_page + 1:02d}.jpg"
        cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 85])
        paths.append(path)
    return paths

def foglio_dettaglio(titolo, fps, det, eventi_lista, out_prefix, offs=(-3, -1, 0, 1, 3), per_row=2, rows=6, kw=150, kh=267):
    """eventi_lista: [(frame, label, color)] -> strips of frames at frame+offs."""
    GAP, LAB, HEAD = 4, 18, 30
    stripw = len(offs) * (kw + GAP) + 16
    W = per_row * stripw
    rowh = LAB + kh + 18 + GAP
    paths = []
    per_page = per_row * rows
    for p0 in range(0, len(eventi_lista), per_page):
        chunk = eventi_lista[p0:p0 + per_page]
        nrows = (len(chunk) + per_row - 1) // per_row
        img = np.full((HEAD + nrows * rowh + 4, W, 3), 28, np.uint8)
        put(img, f"{titolo}  dettaglio (offset fotogrammi {offs})", (8, 20), 0.5)
        for k, (f, lab, colr) in enumerate(chunk):
            r, c = divmod(k, per_row)
            x0 = c * stripw + 8
            y0 = HEAD + r * rowh
            put(img, lab, (x0, y0 + 13), 0.45, colr, 1)
            for j, o in enumerate(offs):
                fi = f + o
                x = x0 + j * (kw + GAP)
                if fi in det:
                    img[y0 + LAB:y0 + LAB + kh, x:x + kw] = det[fi]
                if o == 0:
                    cv2.rectangle(img, (x - 2, y0 + LAB - 2), (x + kw + 1, y0 + LAB + kh + 1), colr, 2)
                put(img, f"{fi/fps:.2f} ({o:+d})", (x + 2, y0 + LAB + kh + 14), 0.4, (220, 220, 220), 1)
        path = f"{out_prefix}_d{p0 // per_page + 1:02d}.jpg"
        cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 85])
        paths.append(path)
    return paths
