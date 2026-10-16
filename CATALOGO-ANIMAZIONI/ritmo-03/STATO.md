# ritmo-03 · stato del blocco 3 (sotto-agente, 15/10)

> **15/10 sera: blocco in PAUSA e sostituito dal giro 2 «copia fedele»** (RIFACIMENTO-RITMO.md). Le voci di questo blocco si rifanno come copia nei blocchi C1–C2; le correzioni T01/F01/T02/F03 qui sotto non si fanno più.

Ordine di lavoro = ordine della composizione (le scene si legano per script, così R8 si prova dove le idee si toccano):
A01 (02/10 «Non ti mancano le idee…») · T01 (07/10 «Ci sono solo tre emozioni…») · L01 · L02 (09/10 «Le emozioni che conta
capire sono tre. La prima è il desiderio…», R8: la stessa lista continua) · K03 (12/10 «8 contenuti su 10 danno qualcosa…») ·
T02 (10/10 «Ecco come funziona davvero l'algoritmo delle storie…») · F01 (11/10 «Non è la fotocamera…, è dove metti la luce.») ·
K04 (05/10 «…la tua bio ottimizzata… tre righe.») · F03 (13/10 «Al primo posto va la presentazione…», R8 morbida dalla bio) ·
D02 · X01 · U01 (15/10 «Cerca argomenti e formati…», «Commenta sistema e ti mando il comando…», R8 morbida X01 → U01).
Anteprima :3034 (`cd ritmo-03/composition && npx --yes hyperframes@0.8.138 preview --background --port 3034`). Render:
`_analisi/ritmo/_script_blocco03/render_ritmo.ps1 -comp ritmo-03 -voce <ID>` (lucchetto). Chiusura di una voce:
`_script_blocco03/chiudi_voce.py voce_XXX.json` (scene.json, voti_kit.json, tabella, questo file), poi
`_tools/genera_catalogo_ritmo.py --solo <ID>`. Fogli di Kallaway in `_analisi/ritmo/blocco03/` (kfoglio.py).
Template in `kw-kit/kit2-tpl-*.js` (per categoria; nuovi `kit2-tpl-aperture.js` A01 e `kit2-tpl-chiusura.js` X01); R7: `tplFermo()`
in fondo alla composizione; R8: scene segnate «R8 morbida».
Fatte: 2 su 12 (A01 · T01) — da fare: L01 · L02 · K03 · T02 · F01 · K04 · F03 · D02 · X01 · U01.

Voci:
- A01: **fatto** — TPL.A01 · ritmo-03 1,0–5,95 s (02/10 «Non ti mancano le idee. Stai guardando i contenuti degli altri invece di fare i tuoi.») · zoom d'arrivo +9,4% in 0,3 s expo.out, poi ferma (K: griglia costruita in 0,3 s, camera ferma) · badge 0,66 → 1 in 0,13 s, uno ogni 0,08 s, rimbalzo 0 (pop.py; K r1 0,66 → 1 in 0,13 s, 0,07–0,13 s) · muro 0,66 della larghezza (K r1 0,68) · visualizzazioni vere · voto 5·5·4·5
- T01: **fatto** — TPL.T01 · ritmo-03 5,95–11,0 s (07/10 «Ci sono solo tre emozioni che tengono qualcuno davanti a un video fino alla fine.») · parole sulla voce, 9 px → nitide in 0,2 s (K r79 0,17–0,21 s) · 3 cambi di clip secchi sulle parole (K r79 3 cambi in 0,5 s) · arrivo 120 px, 90% in 0,25 s expo.out, poi fermo · sagoma senza rimbalzo (pop.py) · barra lineare 1,9 s · reel 0,45 della larghezza (K r79 card orizzontale 0,68) · voto 5·5·4·5
- X01: **fatto (reel 15), demo e misure nel blocco 3** — TPL.X01 usato in `reel-15` 39,33–41,73 s (15/10 «Commenta sistema e ti mando il comando…»); la scena di ritmo-03 (45,7–48,2 s) resta da misurare e chiudere.
- U01: **fatto (reel 15), demo e misure nel blocco 3** — TPL.U01 usato in `reel-15` 41,73–45,83 s (R8 morbida da X01). Nota: con 4 s di scena la risposta a 4 sezioni sovrapponeva il campo spostato in basso (check: content_overlap «Come posso aiutarti oggi?»); nel reel si è passato `h: 1060` (opzione già nel codice, non nella scheda): da aggiungere alla scheda o correggere nel blocco 3. (D02 è usato anche nel reel 15, 18,57–22,67 s.)

## Stato alla PAUSA (15/10 sera, secondo sotto-agente)
- Composizione: transizioni rifatte come movimenti continui (campo «CAMBIO:» nei commenti di index.src.html): T01→L01 PAN, L01→L02 la lista continua, L02→K03 TAGLIO, K03→T02 PAN, T02→F01 ZOOM-THROUGH (tua storia), F01→K04 TAGLIO, K04→F03 PAN in basso (F03 Y 2280), F03→D02 PAN a destra (D02 X 20900 Y 2320), D02→X01 TAGLIO (X01 ondate [1,2,4,6]), X01→U01 ZOOM-THROUGH. SFX aggiornati. Build + check passati.
- U01: default dell'altezza dal contenuto (senza h: max(900, 784 + 92·(sezioni−1)) = 1060 con 4); reel 15 passa h: 1060, non cambia. Scheda aggiornata.
- Schede: chiamate di esempio con pan/zoom-through in L01, T02, F01, D02.
- Render di prova FATTO (20:53–20:58, lucchetto tolto): _analisi/render/ritmo-03_bozza.mp4 — contiene ancora T01/F01/T02/F03 vecchi.
- Fatto anche: _tools/suggerisci_template.py (provato su d14) e «usato nei reel» con i tempi dai PIANO.md in genera_catalogo_ritmo.py (pagina intera non ancora rigenerata).
- Correzioni regia (15/10) DA FARE: T01 cervello al posto della sagoma (riaprire, T01 non è nei reel 14–16); F01 riscrittura senza fotocamera/faro (stesso reel m01 due volte, piatto vs acceso su «luce»; bozza del codice pronta ma NON ancora scritta nel file: kit2-tpl-luce.js è quello di prima); T02 storie con foto vere (steven, thedankoe, hormozi…); F03 evidenze con le copertine vere (th-mio_XX) al posto delle sagome.
- Voci: A01 fatto · T01 fatto ma da riaprire · L01 da misurare/chiudere · L02 da misurare/chiudere · K03 da misurare/chiudere · T02 da correggere + misurare · F01 da riscrivere + misurare · K04 da misurare/chiudere · F03 da correggere (copertine) + misurare · D02 da misurare/chiudere · X01 da misurare/chiudere · U01 da misurare/chiudere. Poi nuovo render, pagina (--solo per voce, poi intera), rapporto.
- Kallaway (tagli trovati): L01 r5 8,917 · L02 r5 32,75 · K03 r79 9,8 (nessun taglio prima, pan 10,47) · T02 r7 5,0 · F01 r23 5,417 · K04 r48 25,567 · F03 r91 71,917 · D02 r1 0,0 · X01 r12 ~81,0 · U01 r6 7,09.
