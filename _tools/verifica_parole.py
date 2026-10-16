# Controlla che ../my-video-ottobre-p1-test/src/words/dDD.ts corrisponda al CSV di ElevenLabs e all'mp3:
# stesse parole, tempi entro un fotogramma (30 fps), durata uguale all'mp3.
# Uso: python -X utf8 _tools/verifica_parole.py DD
import csv, json, re, subprocess, sys
from pathlib import Path

dd = sys.argv[1].zfill(2)
ROOT = Path("D:/CONTENUTI/OTTOBRE 2026/PARTE 1")
TS = Path(__file__).resolve().parents[2] / "my-video-ottobre-p1-test" / "src" / "words" / f"d{dd}.ts"
FPS = 30

rows = [r for r in csv.DictReader(open(ROOT / "timestamps_ottobre_p1.csv", encoding="utf-8-sig")) if r["publish_date"] == f"{dd}/10/2026"]
src = TS.read_text(encoding="utf-8")
words = re.findall(r'\["((?:[^"\\]|\\.)*)", (\d+), (\d+)\]', src.split("WORDS")[1].split("];")[0])
frames = int(re.search(r"AUDIO_FRAMES = (\d+)", src).group(1))
mp3 = ROOT / "velocizzati 110%" / rows[0]["audio_file"]
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)]).decode().strip())

err = []
if len(rows) != len(words):
    err.append(f"numero di parole: CSV {len(rows)} · ts {len(words)}")
for i, (r, w) in enumerate(zip(rows, words)):
    t, a, b = json.loads('"' + w[0] + '"'), int(w[1]), int(w[2])
    if t != r["word"]:
        err.append(f"{i}: parola CSV {r['word']!r} · ts {t!r}")
    if abs(a / FPS - float(r["word_start"])) > 1 / FPS + 1e-6 or abs(b / FPS - float(r["word_end"])) > 1 / FPS + 1e-6:
        err.append(f"{i} {t}: tempi CSV {r['word_start']}-{r['word_end']} · ts {a / FPS:.3f}-{b / FPS:.3f}")
if abs(frames / FPS - dur) > 1 / FPS:
    err.append(f"durata: mp3 {dur:.3f} s · ts {frames} fotogrammi = {frames / FPS:.3f} s")
print(f"d{dd}.ts · {len(words)} parole · {frames} fotogrammi ({frames / FPS:.3f} s) · mp3 {dur:.3f} s · CSV {len(rows)} parole")
print("OK: corrisponde" if not err else "DIFFERENZE:\n  " + "\n  ".join(err[:40]))
