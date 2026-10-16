# -*- coding: utf-8 -*-
"""Sostituzione testuale sicura (UTF-8) in uno o più file: python -I sost.py <vecchio> <nuovo> <file…>  (stampa quante)."""
import io, sys

vec, nuo = sys.argv[1], sys.argv[2]
for f in sys.argv[3:]:
    t = io.open(f, encoding="utf-8").read()
    n = t.count(vec)
    if n:
        io.open(f, "w", encoding="utf-8", newline="").write(t.replace(vec, nuo))
    print(f"{n} × {f}")
