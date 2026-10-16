# Reel 14/10 — «Se non diventi virale…» · stile Kallaway coi template (sotto-agente della regia, 15/10)

**Stato (15/10 19:25):** piano ✔ · composizione ✔ (`check` 0 errori) · bozza 1 ✔ → foglio → correzioni (numero nuovo
invisibile: la copia ereditava opacity 0; lucchetto sopra il tasto, «Condividi» leggibile; etichette del tubo 42 px) · bozza 2 ✔
(`CATALOGO-ANIMAZIONI/_analisi/render/reel-14_bozza.mp4`, 1281 fotogrammi) · safezone 0 su 257 · foglio `reel-14/foglio.jpg` ✔ ·
anteprima :3054 ✔ · rapporto ✔ · **da fare: 4K solo quando lo dice la regia** (`node kw-kit/deliver.cjs reel-14 14`, senza
copertina). Nota render: dalla shell del sotto-agente il rename/copia di PowerShell sul file finale è negato: copiare con bash.

42,70 s (1281 fotogrammi) = l'mp3 `velocizzati 110%/2026-10-14.mp3` (42,699 s). Parole: `d14.ts`, 121, uguali al CSV
(`timestamps_ottobre_p1.csv`, 121, ultima «giusto.» 41,60 s). Marcatore `KW_RITMO`, R7 `tplFermo()` in fondo, safe zone 1332.

## Concept: «Il numero sbagliato»
Un solo numero, **«1M views»**, attraversa tutto il reel come un oggetto che torna: nasce dal disco su «virale», è il badge dei
contenuti che il cervello prende per normali, è l'eccezione accesa nel muro, è la soglia sopra i tuoi reel, è la cima della scala
della pressione. Su «Cambia il numero» la cima si decodifica in **«100 persone giuste»**, la pressione scende, e nel bersaglio
finale «1M di views» resta fuori, barrato. Il mondo: una fila di stazioni lungo X (y 900), due transizioni morbide dove le idee
si toccano (l'eccezione → la soglia; il tuo posto vuoto → la tua foto sul termometro).

## Scene (tagli 0,1 s prima della prima parola della frase; tempi = `wt(i)` delle parole)
| # | tempo | frase | template | transizione |
|---|---|---|---|---|
| 1 | 0–6,63 | Ormai lo pensano tutti. Se non diventi virale… E se si sbagliassero? | `TPL.F02` (griglia dei tuoi reel veri, «1M views» su «virale», «?» su «sbagliassero») | fotogramma 0 pieno, arrivo |
| 2 | 6,63–10,9 | L'algoritmo ci mostra soprattutto i contenuti con tantissima interazione. | `TPL.T05` (<Algoritmo/>, reel di Hormozi) | taglio + arrivo |
| 3 | 10,9–14,43 | E il cervello si convince che quello sia il livello normale. | `TPL.O13` (cervello che pulsa, badge 1M) | taglio + zoom |
| 4 | 14,43–18,33 | Non lo è. È l'eccezione mostrata in continuazione. | `TPL.K11` (muro, eccezione «1M») | taglio |
| 5 | 18,33–21,77 | Ma da quel momento ogni video sotto quella soglia sembra un fallimento. | `TPL.F04` (soglia «1M views», riflettore) | **R8 morbida** `tplZoomThrough` nell'eccezione |
| 6 | 21,77–28,73 | E nasce quella cosa che blocca davvero le persone. Cioè la vergogna di aver pubblicato qualcosa che non ha funzionato. | `vergognaR14` (nuova, `kw-kit/kit2-reel14.js`): lucchetto sul Condividi del prossimo reel su «blocca», linea all'ultimo reel (312 views) su «vergogna», ✗ su «funzionato» | taglio + arrivo |
| 7 | 28,73–31,73 | Ed è così che si passano mesi senza farsi vedere. | `TPL.A01` (reel veri di altri con views vere, il tuo posto vuoto su «senza») | taglio + zoom |
| 8 | 31,73–37,1 | Convinti di essere pigri quando in realtà è pressione. Cambia il numero e cambia tutto. | `TPL.D13` (termometro = pressione, scala 100 views → 1M, la tua foto) + `numeroR14` (nuova: «Pigrizia?» barrata su «realtà», 1M → «100 persone giuste» su «numero», la pressione scende) | **R8 morbida** `tplZoomThrough` nel tuo posto |
| 9 | 37,1–42,7 | L'obiettivo non è un milione di visualizzazioni. È arrivare alle persone giuste col messaggio giusto. | `TPL.O10` (bersaglio, «1M di views» barrato, silhouette al centro, freccetta) | taglio |

## Materiali
`reel-14/assets/clips/`: `nastro/g1–g6` (i tuoi reel, il nastro del reel 13), `mio/` (m07–m09, v01), `est/` (Hormozi),
`alt/` (Bartlett, Dan Koe, Tony Robbins, Hormozi, GaryVee, views vere in `_sorgenti.json`); la tua foto `av-tu`.
