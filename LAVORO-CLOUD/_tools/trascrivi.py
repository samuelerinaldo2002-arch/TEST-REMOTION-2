"""Trascrizione con tempi parola per parola, al posto di faster-whisper small.en (in cloud huggingface.co è bloccato dal proxy).
Modello: NeMo Parakeet TDT 0.6B v2 int8 via sherpa-onnx (release GitHub k2-fsa/sherpa-onnx «asr-models»), in ~/modelli-asr/.

    _tools/venv/bin/python -I LAVORO-CLOUD/_tools/trascrivi.py <video.mp4> <uscita.json>

Uscita come _lavoro/r79_parole.json di copia-01: [{"text": parola, "start": inizio, "end": fine}, …] in secondi del video.
Taratura (16/10, reel 79): contro r79_parole.json di faster-whisper small.en 427 parole su 434 trovate, inizi più tardi di
0,055 s di mediana (p90 0,155 s): si toglie OFFSET = 0,055 s, così i tempi sono confrontabili con quelli di C1.
"""
import json, os, subprocess, sys
import numpy as np
import sherpa_onnx

M = os.path.expanduser("~/modelli-asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8")
src, out = sys.argv[1], sys.argv[2]
OFFSET = 0.055
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx", joiner=f"{M}/joiner.int8.onnx",
    tokens=f"{M}/tokens.txt", model_type="nemo_transducer", num_threads=4)
# a pezzi da ~25 s con 1 s di sovrapposizione, tagliati nei silenzi vicini
SR = 16000
parole = []
i = 0
while i < len(a):
    j = min(len(a), i + 25 * SR)
    if j < len(a):  # cerca il punto più quieto negli ultimi 3 s del pezzo
        w = a[j - 3 * SR:j]
        e = np.convolve(w ** 2, np.ones(1600) / 1600, mode="same")
        j = j - 3 * SR + int(np.argmin(e))
    st = rec.create_stream()
    st.accept_waveform(SR, a[i:j])
    rec.decode_stream(st)
    r = st.result
    toks, ts = r.tokens, r.timestamps
    cur = None
    for k, (tk, t) in enumerate(zip(toks, ts)):
        t = t + i / SR
        if tk.startswith(" ") or cur is None:
            if cur: parole.append(cur)
            cur = {"w": tk.strip(), "s": round(t, 3), "e": round(t + 0.08, 3)}
        else:
            cur["w"] += tk
            cur["e"] = round(t + 0.08, 3)
    if cur: parole.append(cur)
    i = j
# fine parola = inizio della successiva se vicina (i token TDT danno solo l'inizio)
for k in range(len(parole) - 1):
    nx = parole[k + 1]["s"]
    if nx - parole[k]["e"] < 0.35:
        parole[k]["e"] = round(max(parole[k]["e"], nx - 0.01), 3)
    parole[k]["e"] = round(min(parole[k]["e"], max(parole[k]["s"] + 0.04, nx - 0.01)), 3)
parole = [{"text": p["w"], "start": round(max(0, p["s"] - OFFSET), 3), "end": round(max(0, p["e"] - OFFSET), 3)} for p in parole]
json.dump(parole, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(len(parole), "parole →", out)
print(" ".join(p["text"] for p in parole))
