# Reel 16/10 — «Il trucco del reel di prova» · stile Kallaway coi template (sotto-agente della regia, 15/10)

**Stato (15/10 20:05):** piano ✔ · composizione ✔ (`check` 0 errori) · bozza 1 → foglio (niente da correggere; 1014 fotogrammi → durata 33,76) · bozza 2 ✔ (`CATALOGO-ANIMAZIONI/_analisi/render/reel-16_bozza.mp4`, 1013 fotogrammi) · safezone 0 su 203 · foglio `reel-16/foglio.jpg` ✔ · anteprima :3056 ✔ · rapporto ✔ ·
**4K solo quando lo dice la regia** (`node kw-kit/deliver.cjs reel-16 16`, senza copertina; copiare i file finali con bash).

33,76 s (1013 fotogrammi) = l'mp3 `velocizzati 110%/2026-10-16.mp3` (33,745 s, arrotondato al fotogramma per eccesso come i
reel 14 e 15). Parole: `d16.ts`, 88, uguali al CSV (`timestamps_ottobre_p1.csv`, 88, ultima «volta.» 32,66–33,12 s).
Marcatore `KW_RITMO`, R7 `tplFermo()` in fondo, safe zone 1332.

## Concept: «Il bivio» — lo stesso video, due strade
Un solo video, il tuo (la copertina vera del 04/10, `th-mio_04`, e lo stesso reel in movimento `r04`), attraversa tutto il reel:
lo carichi, va in bozza, si sdoppia, e da lì il mondo **si biforca**: la copia 1 prende la strada alta (reel di prova → persone
nuove), la copia 2 la strada bassa (reel normale → i tuoi follower). Le due strade si ritrovano nel risultato: stesso video, il
doppio delle views; la linea finale lo ripete su ogni video («ogni volta»). Il mondo: un tronco lungo X (y 900), poi due rami
(y −1800 e y 3600), diverso dalla fila del reel 14 e dalla scala del reel 15. Il regalo dell'hook è l'interruttore «Reel di
prova» che nella scena 2 sta nella schermata e nessuno lo vede (la lente lo trova), e nella scena 5 il dito lo accende.

## Scene (tagli 0,1 s prima della prima parola della frase; tempi = `wt(i)` delle parole)
| # | tempo | frase | template | transizione |
|---|---|---|---|---|
| 1 | 0–3,57 | Instagram ti ha appena regalato un trucco enorme. | `TPL.O01` (anello dei tuoi reel veri, al centro «Un trucco enorme») | fotogramma 0 pieno, l'anello si apre |
| 2 | 3,57–6,37 | E probabilmente non te ne sei nemmeno accorto. | `nascostoR16` (nuova, `kw-kit/kit2-reel16.js`): «Nuovo reel» vero, il resto si spegne su «non», la lente trova «Reel di prova» su «nemmeno», NUOVO su «accorto» | taglio + arrivo |
| 3 | 6,37–10,07 | La prossima volta che carichi un video, prima di pubblicarlo, | `TPL.L11` (4 tappe; il video arriva su «carichi», corre a «Salva in bozza» su «pubblicarlo») | taglio, tracciato |
| 4 | 10,07–13,07 | salvalo come bozza. Poi, duplicalo. | `TPL.U10` (Bozze, ⋯ su «bozza», lente su «Poi», Duplica su «duplicalo») | **R8 morbida** `tplZoomThrough` nel video sulla tappa «Salva in bozza» |
| 5 | 13,07–16,1 | Prendi la prima copia e pubblicala come reel di prova. | `TPL.U11` (copia 1, interruttore su «pubblicala», Condividi su «reel», PROVA) | taglio + arrivo di lato (ramo alto) |
| 6 | 16,1–19,57 | Poi torna indietro e pubblica la seconda come reel normale. | `TPL.U07` (copia 2, Condividi su «reel», NORMALE) | taglio + arrivo di lato (ramo basso) |
| 7 | 19,57–22,73 | Il reel normale raggiungerà i tuoi follower come sempre, | `TPL.F08` (il tuo profilo vero, riquadro sulla griglia su «normale», i follower si accendono a onda su «follower») | taglio + arrivo |
| 8 | 22,73–26,97 | ma il reel di prova verrà mostrato solo a persone nuove che non ti seguono ancora. | `TPL.O21` (il reel vero al centro, follower spenti su «solo», persone nuove su «persone») | taglio + zoom (ramo alto) |
| 9 | 26,97–31,73 | Stesso identico video, ma il doppio delle visualizzazioni. Gratis. | `TPL.D01` (NORMALE + PROVA, «=» su «identico», conta su «doppio», ×2 su «Gratis») | **R8 morbida** `tplPan` dagli anelli |
| 10 | 31,73–33,77 | Fallo ogni volta. | `TPL.C01` (la linea parte dalla card e accende tre tuoi video: prova + normale) | **R8 morbida** linea dalla scena prima |

3 morbide su 9 cambi. Template mai usati nei reel 14 e 15. Clip: `assets/clips/cal` (i tuoi reel, da ritmo-02), `mio` e
`r04.mp4` (da ritmo-01).
