# -*- coding: utf-8 -*-
"""Parole di dDD.ts con indice, inizio e fine (s), in un intervallo di indici, e la loro posizione spostata nella composizione.

    python -I parole2.py d01 0 12 [offset]      → "i:parola inizio–fine (comp inizio)"
"""
import io, os, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
QUI = os.path.dirname(os.path.abspath(__file__))
WORDS = os.path.abspath(os.path.join(QUI, "..", "..", "..", "..", "..", "my-video-ottobre-p1-test", "src", "words"))
d, a, b = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
off = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
t = io.open(os.path.join(WORDS, d + ".ts"), encoding="utf-8").read()
ws = re.findall(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*(\d+)\s*,\s*(\d+)\s*\]', t)
for i in range(a, min(b + 1, len(ws))):
    w, s, e = ws[i]
    print(f"{i}:{w} {int(s) / 30:.3f}–{int(e) / 30:.3f}" + (f"  (comp {int(s) / 30 + off:.3f}–{int(e) / 30 + off:.3f})" if off else ""))
