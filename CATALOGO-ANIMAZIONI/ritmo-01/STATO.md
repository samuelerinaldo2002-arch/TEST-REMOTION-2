# ritmo-01 · stato del blocco 1 (sotto-agente, 13/10)

Ordine di lavoro = ordine della composizione (le scene si legano per script, così R8 si prova dove le idee si toccano):
O01 · C01 · F08 (01/10) → U02 · U03 (05/10) → T05 (14/10) → L11 (16/10) → U10 · U11 · U07 · O21 · D01 (03/10).
Anteprima :3032 (`cd ritmo-01/composition && npx --yes hyperframes@0.8.138 preview --port 3032`). Render:
`_analisi/ritmo/_script_blocco01/render_ritmo01.ps1` (lucchetto). Chiusura di una voce: `_script_blocco01/chiudi_voce.py voce_XXX.json`
(scene.json, voti_kit.json, tabella, questo file), poi `_tools/genera_catalogo_ritmo.py --solo <ID…>`.
Template in `kw-kit/kit2-tpl-*.js` (per categoria); R7: `tplFermo()` in fondo alla composizione; R8: scene segnate «R8 morbida».
Fatte: 12 su 12 (O01 · C01 · F08 · U02 · U03 · T05 · L11 · U10 · U11 · U07 · O21 · D01) — da fare: nessuna.

**Blocco 1 FINITO (13/10 notte): 12 voci su 12.** Render finale `_analisi/render/ritmo-01_bozza.mp4` (59,4 s), safezone 0 campioni sotto
1332, check 0 errori, demo-8 senza KW_RITMO identica (3 snapshot, hash uguali). In attesa della regia (R7, R8, standard).

R7 (sfondo fermo nella tenuta): in tutte le 12 scene (ogni template registra [t0 o fine dell'ingresso, t1]; nelle transizioni
morbide i puntini seguono la camera). Si toglie cancellando la riga `tplFermo();` in fondo a index.src.html (o `fermo: false` in
una scena). R8: tagli netti + arrivo in 8 cambi su 11; morbide in 3: O01→C01 5,6 s (la linea parte dall'anello e la camera la
segue, TPL.C01 con `da`), L11→U10 38,0 s (zoom-through nel tuo video, `tplZoomThrough`), O21→D01 55,0 s (la camera scorre di
lato, `tplPan`). Si tolgono: C01 senza `da` (entra col taglio), U10/D01 senza `ingresso: "nessuno"` e senza la riga tplZoomThrough /
tplPan (entrano col loro zoom / arrivo).

## Correzioni regia (13/10 notte, sotto-agente delle correzioni; si riparte da qui)
1. pop.py su tutte le voci: **fatto** — 1–2 elementi per voce (pill, foglio, riquadri lime, card, badge, etichette, il reel che esce), strisce guardate: nessun rimbalzo né back.out rimasto, niente da correggere. Valori in voti_kit.json (misure «pop.py · …», con K accanto), strisce in _analisi/ritmo/pop/<ID>_ritmo01_*.jpg. Riquadri lime misurati su uno spezzone coi soli pixel lime; il foglio di U10 a sola traslazione (pop.py non aggancia il foglio scuro); la copia di U10 solo a vista (identica alla bozza 0)
2. telefoni nella proporzione di Kallaway: **fatto** — U02 0,555 → 0,66 col colpo (K reel 3 0,555 → 0,65), alto a y 420, il fondo sfuma; U10 · U11 · U07 0,435 (schermo 0,415 = K reel 65), interi sotto il titolo. Opzioni scala / alto / sfuma nei template (TPL_TEL in kit2-tpl-ui.js), default nuovo solo con KW_RITMO; apertura(…, { posa }) in coda; U10 prende la posa dal template per lo zoom-through
3. L11 su tutta l'area utile: **fatto** — layout «diagonale» (default con KW_RITMO): tracciato da bordo a bordo, x 90–980, y 410–1245, scala 0,915 (prima 0,805); camera ferma (+0,35%); tracciato 10 → 90% in 0,43 s (K 0,50 s), 1,0 s coi tratti di bordo
4. riga «Fatte:» in testa aggiornata da chiudi_voce.py: **fatto** (chiudi_voce.py la ricalcola dalle righe «- ID: **fatto**» in fondo, ordine della composizione)
Verifiche dopo le correzioni (14/10 notte): check 0 errori (1 avviso: rotation_pivot_drift a 56,1 s, gli anelli di O21 che girano, scena non toccata); snapshot dei tagli guardate, tutti pieni (_analisi/ritmo/blocco01/N_tagli_ritmo01.jpg rifatto); render di prova sotto il lucchetto (ritmo-01_bozza.mp4, 59,4 s); safezone 0 campioni sotto 1332; deriva.py su U02 (arrivo + colpo), L11, U10, U11, U07 coi pannelli guardati (gialli sugli elementi fermi); pagina rigenerata per le 12 voci; demo-8 senza KW_RITMO: kit senza e con le correzioni, 3 snapshot con hash identici. Anteprima :3032 accesa.

Voci:
- O01: **fatto** — TPL.O01 · ritmo-01 1,0–5,6 s (01/10 «L'errore numero uno… Pubblicare di tutto.») · apertura 90% a 0,63 s quasi lineare (K 0,67 s power1.out; prima 0,17 s) · camera ferma +1,2% · 24°/s · rimbalzo 0 (pop.py, strisce guardate) · voto 5·4·4·5
- C01: **fatto** — TPL.C01 · ritmo-01 5,6–8,75 s (01/10 «Lunedì parlo di fitness, martedì di viaggi, venerdì di motivazione.»), R8 morbida da O01 · viaggio 1113 px, 90% a 0,47 s, picco 3000 px/s, power1.out (K 712–808 px, 0,42–0,71 s, 2360–2970 px/s; prima 7490 px/s) · rimbalzo 0 (pop.py, strisce guardate) · voto 5·4·4·5
- F08: **fatto** — TPL.F08 · ritmo-01 8,75–13,75 s (01/10 «…l'algoritmo non capisce… e nemmeno chi ti guarda.») · onda 0,40 s (K r13 0,33 s) · pill secca 1–3 fotogrammi (K r88 1) · arrivo 139 → 1,6 px/s expo.out (K 175 → 11) · rimbalzo 0 (pop.py, strisce guardate) · voto 5·4·4·5
- U02: **fatto** — TPL.U02 · ritmo-01 13,75–19,15 s (05/10 «…un profilo perfettamente ottimizzato… ti porterà più follower.») · telefono 0,555 → 0,66 della larghezza col colpo (K r3 0,555 → 0,65; prima 0,376) · arrivo 175 px expo.out 148 → 0,6 px/s (K −175 px 241 → 35) · colpo +19,1% (K +19,3%) · conteggio lineare 0,94 s (K ~1,2 s) · riquadro e pill senza rimbalzo (pop.py) · voto 5·5·5·5
- U03: **fatto** — TPL.U03 · ritmo-01 19,15–26,95 s (05/10 «…vai sul sito pfpmaker.com, carica una foto… seleziona il tuo sfondo colorato.») · camera ferma +0,8% (K 0–9 px) · cursore al taglio, metà strada 0,12 s (K ~0,125 s) · seconda inquadratura +11,7% · rimbalzo 0 (pop.py, strisce guardate) · voto 5·5·4·5
- T05: **fatto** — TPL.T05 · ritmo-01 26,95–31,45 s (14/10 «L'algoritmo ci mostra soprattutto i contenuti con tantissima interazione.») · decodifica 7 fotogrammi da 0,05 s dopo il taglio (K 4–5 fotogrammi) · arrivo 136 → 2,9 px/s expo.out · numeri lineari 0,6 s · rimbalzo 0 (pop.py, strisce guardate) · voto 5·4·4·5
- L11: **fatto** — TPL.L11 · ritmo-01 31,45–38,0 s (16/10 «…salvalo come bozza. Poi, duplicalo.») · tracciato da bordo a bordo, 10→90% in 0,43 s dal taglio (K r124 0,50 s) · area x 90–980, y 410–1245 (prima x 150–840, y 430–1160), scala 0,915 (prima 0,805) · camera ferma (+0,35%) · video che arriva 0,9 → 1 in 0,13 s senza rimbalzo (pop.py) · voto 5·5·5·5
- U10: **fatto** — TPL.U10 · ritmo-01 38,0–42,35 s (03/10 «Apri le bozze, tocca i tre puntini… e duplicalo.»), R8 morbida da L11 (zoom-through) · telefono 0,435 della larghezza (K r65 schermo 0,415; prima 0,376) · zoom-through 0,16 + 0,45 s, assestamento +8,4% 84 → 3 px/s · camera poi ferma (K r65 ferma) · foglio expo.out senza rimbalzo · 3 accenti sulle parole · voto 5·5·4·5
- U11: **fatto** — TPL.U11 · ritmo-01 42,35–46,15 s (03/10 «Ora prendi la prima bozza e pubblicala come reel di prova.») · telefono 0,435 della larghezza (K r65 schermo 0,415; prima 0,376) · arrivo 175 px expo.out 148 → 0,7 px/s · reel che esce e PROVA senza rimbalzo (pop.py) · camera poi ferma (K r65 ferma) · voto 5·5·4·5
- U07: **fatto** — TPL.U07 · ritmo-01 46,15–50,15 s (03/10 «Poi torna indietro e pubblica la seconda bozza come reel normale.») · telefono 0,435 della larghezza (K r65 schermo 0,415; prima 0,376) · arrivo 175 px expo.out 148 → 0,7 px/s · reel che esce e NORMALE senza rimbalzo (pop.py) · camera poi ferma (K r65 ferma) · voto 5·5·4·5
- O21: **fatto** — TPL.O21 · ritmo-01 50,15–55,0 s (03/10 «…il reel di prova verrà mostrato solo a persone nuove che non ti seguono ancora.») · zoom d'arrivo +10% expo.out 109 → 2,8 px/s · onda 0,40 s (K 0,25–0,33 s) · anelli pieni al taglio · rimbalzo 0 (pop.py, strisce guardate) · voto 5·5·4·5
- D01: **fatto** — TPL.D01 · ritmo-01 55,0–59,4 s (03/10 «Stesso identico video ma raddoppi le visualizzazioni, gratis.»), R8 morbida da O21 (scorre di lato) · ingresso 973 px, 90% a 0,53 s, picco 2008 px/s sine.out (K r9 736 px, 0,58 s, 1972 px/s; prima 9374 px/s) · conteggio lineare 1,5 s (K 0,7–1 s) · rimbalzo 0 (pop.py, strisce guardate) · voto 5·5·4·5

Correzione regia del 15/10 (fatta dal sotto-agente del blocco 2): F08, tolto il fotogramma nero dell'onda (TPL.F08: fromTo sul filtro da grayscale(0) brightness(1)); render ritmo-01_bozza.mp4 del 15/10 00:37, resto invariato, safezone 0; pagina --solo F08.
