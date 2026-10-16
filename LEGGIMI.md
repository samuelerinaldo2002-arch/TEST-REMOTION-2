# TEST KALLAWAYMARKETING — cosa c'è qui

Test isolato: se non ti convince, **elimina questa cartella** e tutto torna come prima.
Fuori da qui ci sono solo la skill globale `reel-hyperframes` e i puntatori in memoria.
**Per riprendere il lavoro in una chat nuova: leggere `PROSSIMA-SESSIONE.md`.**

| Cartella / file | Contenuto |
|---|---|
| `PROSSIMA-SESSIONE.md` | Stato del lavoro, cosa riverificare, prossimi passi, comandi. |
| `CATALOGO-ANIMAZIONI/PIANO-ANIMAZIONI.md` | Piano per completare le 28 animazioni mancanti (schede con tempi misurati, clip, script che le usano) e portare al massimo le 83 del kit (checklist, voti, ordine per frequenza). |
| `01_…mp4` → `100_…mp4` + `TUTTI-I-REEL/` | Tutti i 150 reel di @kallawaymarketing (l'intero profilo). Elenco completo: `TUTTI-I-REEL/_inventario.json`. |
| `CATALOGO-ANIMAZIONI/` | **Catalogo di 137 animazioni** (`catalogo.html` da aprire nel browser, `CATALOGO.md`, `catalogo.json`, `clip/`), script di settembre/ottobre categorizzati (`SCRIPT-CATEGORIZZATI.md`), demo del kit v2 (`demo/`, `demo-2/`, `demo-oggetti/` con slot, fotocamera, faro e cervello presi da Adobe Stock; `demo-3`…`demo-7` i blocchi del piano; `demo-6` il Blocco 5 rifatto contro Kallaway il 10/10; `demo-8` le voci più usate rifatte da protagoniste), analisi grezze (`_analisi/`: note di visione, effetti fotogramma per fotogramma, misure; `moto/` le strisce di movimento Kallaway | nostro, `confronti-video/` i video affiancati, `render/` i render di prova, `voti_kit.json` i voti di ogni voce). |
| `STILE-KALLAWAY/GUIDA-STILE.md` | La prima analisi di stile (struttura, tipografia, colore, componenti) adattata al brand. I valori di movimento aggiornati e misurati sono nel catalogo e in `kw-kit/KIT-V2.md`. |
| `kw-kit/` | Kit HyperFrames: `kit.js` (v1, usato da reel-01 v4), `kit2-core.js` + `kit2-oggetti.js` + `kit2-blocco5.js` (le voci del Blocco 5) + `kit2-ui.js` (v2, valori misurati; oggetti 3D lucidi; UI di Instagram con il dito: bozze, Duplica con la lente, Reel di prova, impostazioni, profilo, DM), `KIT-V2.md` (API e 25 regole), build, deliver, font, SFX, `assets/obj/` (oggetti veri: cervello, slot, fotocamera, faro, razzo, amo, manichino bianco della figura O26), `sorgenti-adobe/` (originali Adobe Stock con licenza, scontorni di Photoshop, `FONTI.md` con fonti e regole), `assets/avatars/` (foto profilo vere), `assets/thumbs/` (copertine dei tuoi reel). |
| `reel-01/` | Il reel 01/10 in stile Kallaway (v4, approvato) — `index.src.html`, `PIANO.md`, `assets/clips/`, `composition/`. Invariato, per il confronto. |
| `reel-01-v5/` | Il reel 01/10 rifatto con il kit v2 (09/10): titoli sulla voce, planner della settimana, anelli con la tua foto, finale come infografica. `PIANO.md` dice cosa cambia rispetto al v4. |
| `reel-03/` | Il reel 03/10 "Il trucco dei reel di prova" (09/10, nuovo): la UI di Instagram del vecchio stile al completo (bozze, ⋯, Duplica, Reel di prova, Condividi) sulla voce vera. Modello anche per 16/10 e 09/09. |
| `reel-09/` | Il reel 09/10 "Nessuno compra per le informazioni" (sessione 4, rifatto da zero): concept "le tre leve" in `PIANO.md`, sorgente `index.src.html`, i tuoi reel veri in movimento in `assets/clips/`, densità scena per scena in `densita.txt`. Consegna 4K in `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\INFOGRAFICA REMOTION\STILE KALLAWAY\` (`2026-10-09 - INFOGRAFICA KALLAWAY STYLE (4K).mp4` + copia senza copertina): è la cartella di tutte le consegne in stile Kallaway. |
| `_archivio/reel-09-sessione3/` | I due tentativi scartati della sessione 3, archiviati senza aprirli. |
| `reel-01_v3-concept-derivato/` | Versione precedente, solo per confronto. |
| `_clip-esterni/` | Shorts pubblici (Hormozi, Tony Robbins, GaryVee, …) da cui tagliare spezzoni. |
| `_tools/` | Script: download (`scarica_kallaway_tutti.py`, `foto_profilo.py`), analisi (`analisi_movimento.py`, `eventi.py`, `curve.py`, `censimento.py`, `misura_glow.py`, `densita.py`, `confronto.py`, `aperture.py`), fogli e ritagli (`panoramiche.py`, `striscia.py`, `ritaglio.py`), catalogo (`catalogo_dati.py`, `script_mappa.py`, `genera_catalogo.py`, `catalogo_template.html`), asset (`oggetto_da_stock.py` e `oggetti_adobe.py` per gli oggetti da Adobe Stock, `oggetto_cervello.py` = vecchio cervello procedurale, `mini_clip.py`, `manichino.py` = la figura O26 dal manichino di Adobe Stock, `scontorno.py` = scontorno locale IS-Net), voce (`parole.py`: parole del VO con indice e tempo); `venv/` con OpenCV; `yt-dlp.exe`. |
| `_backup-skill-hyperframes-prima-update/` | Copia delle skill HyperFrames prima dell'aggiornamento. |
