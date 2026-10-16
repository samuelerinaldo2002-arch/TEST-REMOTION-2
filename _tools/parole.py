# -*- coding: utf-8 -*-
"""Stampa le parole del voice-over con indice e istante d'inizio (s, 30 fps), per agganciare i titoli parola per parola.

    python -I _tools/parole.py ../my-video-ottobre-p1-test/src/words/d03.ts

Serve per le parole che tornano più volte nella voce ("bozza", "normale"…): in un reel `at("parola")` prende la prima,
quindi si usa `at("parola", findWord("parola prima"))` oppure l'indice stampato qui (`WORDS[i][1]`).
"""
import re, io, sys

sys.stdout.reconfigure(encoding="utf-8")
f = sys.argv[1]
t = io.open(f, encoding="utf-8").read()
ws = re.findall(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*(\d+)\s*,\s*(\d+)\s*\]', t)
print(" ".join(f"{i}:{w}@{int(a) / 30:.2f}" for i, (w, a, b) in enumerate(ws)))
m = re.search(r"AUDIO_FRAMES = (\d+)", t)
print("durata:", f"{int(m.group(1)) / 30:.3f} s" if m else "?")
