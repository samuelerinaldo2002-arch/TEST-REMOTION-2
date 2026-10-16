# Reel 11/10 — "Non è la fotocamera, è la luce" · stile Kallaway (sessione 5)

**Stato delle tappe**: 1 piano ✔ · 2 spezzoni ✔ · 3 build ✔ (`check` 0 errori) · 4 densità ✔ (11/11, `densita.txt`) · 5 bozza ✔
(`CATALOGO-ANIMAZIONI/_analisi/render/reel-11_bozza.mp4`, 11/10 20:39, safe zone 1332, `safezone.py`: solo code sfumate) +
fotogrammi della bozza ai tempi delle parole di `d11.ts` ✔ (`_sync.mp4` delle 23:08 c'è, ma dal 12/10 non si fa più) · 6 confronto
con Kallaway ✔ (`_analisi/confronti-video/reel11_confronto.mp4`, 15 coppie; strisce `K08`, `O23`, `O05-O28`, `K07` `_reel11`) ·
catalogo ✔ (O33, O34, F13, D15) · 4K ✔ consegnato e verificato dalla regia (11/10 23:28, solo senza copertina, in
`D:\CONTENUTI\OTTOBRE 2026\PARTE 1\INFOGRAFICA REMOTION\STILE KALLAWAY\`; qui resta `raw-4k.mp4`) · 7 anteprima :3025 NON avviata
(la regia ha chiesto di non toccare `composition/`, e il server ci scrive `.hyperframes/`): quando serve,
`cd reel-11/composition && npx --yes hyperframes@0.8.138 preview --background --no-open --port 3025`.

35,67 s (1070 fotogrammi) sui tempi veri della voce: `../my-video-ottobre-p1-test/src/words/d11.ts`, 108 parole, controllato
contro `timestamps_ottobre_p1.csv` e l'mp3 `velocizzati 110%/2026-10-11.mp3` (35,642 s) con `_tools/verifica_parole.py 11`
("OK: corrisponde"). 30 fps. **Safe zone dell'11/10**: niente grafica dalla linea y = 1332 in giù (`SAFEZONE.jpg`): nel sorgente
`BAND.y1 = 1300` (tutte le inquadrature finiscono a 1300) e la maschera di `#safe` sfuma da 1290 a 1331. Pattern: **P03** (scala /
livelli) + **P12** (percentuali) + **P09** (mito → verità nell'hook). Riferimenti di Kallaway: **4** (piramide dei "view
ceilings": 4 livelli con il valore) e **109** (la scala della dopamina: si sale un piolo alla volta).

## L'idea: la scala della luce
Il mondo è **una scala di 4 gradini che sale dal buio alla luce**. In basso, ai suoi piedi, c'è la **stanza illuminata male**
(lampadina nuda dal soffitto) dove gira quasi tutta la gente; in cima c'è la luce (raggi e un fascio che scende lungo la scala).
Ogni gradino è **una luce in più**: telefono e basta → telefono + finestra → fotocamera + luce principale → + controluce. Su ogni
pedata c'è l'attrezzatura di quel livello, spenta finché non ci arrivi; quando arrivi si accende e la luce cambia davvero sul tuo
reel vero (buio e piatto → morbido → nitido → staccato dallo sfondo). Sull'alzata di ogni gradino c'è **la folla di 100 persone**
(O23): si accendono quelle che stanno a quel livello (99 → 50 → 30 → 10) e la tua foto vera sale con loro.

Grammatica spaziale diversa dal 09 (console al centro, viaggi laterali e ritorni) e dal 10 (colonna verticale: pozzo sotto,
muro sopra): qui la camera **sale in diagonale gradino dopo gradino**, dal basso a sinistra all'alto a destra, guarda giù
sull'alzata per il dato e riparte verso il gradino dopo; non torna mai indietro.

Match cut: l'obiettivo della fotocamera → si entra e si è nel suo mirino; dal mirino si esce all'indietro e la stanza è ai piedi
della scala · il telefono salta dal gradino 1 al 2 · sul gradino 3 il telefono ruota su se stesso e diventa la fotocamera vera, e
dal suo schermo esce il tuo reel · l'attrezzatura del gradino 3 sale con te in cima, dove dietro di te si accende il controluce.

## Scene (tempi = parole della voce, indici di `parole.py`)
| # | Tempo | Voce | Cosa si vede | Catalogo |
|---|---|---|---|---|
| 1 | 0–2,45 | "Non è la fotocamera a farti sembrare professionale," | La **fotocamera vera** grande, già in scena al fotogramma 0 con la spia REC (A02), rack focus. "fotocamera" (0,40): scatto con il lampo. "a farti sembrare professionale": la camera si allarga e accanto c'è **il tuo reel vero** che lei sta riprendendo (linea tratteggiata dall'obiettivo): buio e piatto. | A02 · K10 · K03 · C01 |
| 2 | 2,5–4,1 | "è dove metti la luce." | "è": la fotocamera si spegne in grigio e si fa da parte (F11), resta in alto, spenta. "dove": entra il **faro vero**; "metti": viene messo giù al suo posto (colpo e polvere); "luce" (3,53): sfarfalla e si accende, il fascio cade sul tuo viso, il reel si illumina (colori veri, bordo lime, disco F02). | F11 · F05 · F02 · faro |
| 3 | 4,2–6,5 | "E finché giri in una stanza illuminata male," | Il faro si spegne ed esce; la camera si allarga e attorno al reel si disegna **la stanza** (pareti, pavimento, soffitto in prospettiva, listelli sul fondo). "illuminata": una **lampadina nuda** scende dal soffitto, sfarfalla e si accende: cono giallastro duro dall'alto, chiazza sul pavimento, grana e ombre sul reel; "male": sfarfalla ancora, dondola. | O34 (nuova) · F05 · F13 (nuova) |
| 4 | 6,6–8,2 | "anche l'attrezzatura da 5.000 euro" | La fotocamera torna nella stanza sul treppiede (K02), con il **cartellino del prezzo** appeso alla cinghia che oscilla; "5.000 euro": il prezzo conta 0 → 5.000 € (D01). | K02 · D01 · D15 (nuova) |
| 5 | 8,2–11,0 | "ti fa sembrare uno che improvvisa." | Zoom attraverso l'obiettivo (K07): siamo **nel mirino** della fotocamera da 5.000 € (U14, fasce nere attorno) e il tuo reel è quello che vede: buio, giallastro, con la grana; "sembrare" l'ISO sale a scatti fino a 12.800 (rosso, lampeggia), "uno che" l'autofocus cerca e non aggancia (quadrato bianco/rosso che salta), "improvvisa" la lampadina sfarfalla, la camera trema. | K07 · U14 · F05 · F13 |
| 6 | 11,1–14,0 | "C'è una scala e ha 4 gradini." | Dal mirino la camera esce all'indietro fino alla stanza intera, poi viaggia verso destra mentre **la scala di 4 gradini** (blocchi 3D in grafite) si alza: "scala" i gradini in piedi uno dopo l'altro (0,1 s l'uno, come la torre del reel 90); su ogni pedata la sua attrezzatura spenta (telefono · finestra e telefono · faro, fotocamera e reel · lo stesso più il tubo LED); in cima i raggi (F07) e il fascio di luce che scende lungo la scala; "4" i numeri 1–4 sulle alzate; "gradini" gli spigoli si accendono. Sulle alzate le folle di 100 persone, spente. | O33 (nuova) · O05 (reel 4) · O07 (reel 109) · O28 · O23 · F07 |
| 7 | 14,1–18,4 | "Se registri col telefono e basta, sei dentro il 99% di tutti." | La camera sale sul gradino 1: al posto del telefono spento c'è **il telefono vero** sul cavalletto con il tuo reel nello schermo; "registri" il tasto registra e il timer corre; "e basta": la camera si stringe sul telefono da solo. "sei dentro il 99%": la camera scende sull'alzata 1 (il telefono si spegne prima di passare sotto il titolo): la folla si accende a righe, 99 su 100 in bianco, **la tua foto vera** è una di loro; pill "99%". "di tutti": tutta la folla lampeggia. | K03 · O33 · O23 · D09 · F02 |
| 8 | 18,4–22,8 | "Se usi il telefono ma cerchi una buona luce naturale, sei già nel primo 50." | Il telefono salta sul gradino 2 insieme alla camera (K08) e atterra su "telefono"; la tua foto lascia la folla di sotto. "cerchi": nella **finestra vera** si fa giorno e il telefono le va incontro; "luce naturale": i fasci di sole col pulviscolo cadono sul telefono, il tuo reel si schiarisce e si scalda (F13). "primo 50": sull'alzata 2 si accendono 50 persone su 100, in lime (F08), con la tua foto; pill "primo 50%". | K08 · F13 · O23 · F08 |
| 9 | 22,9–27,0 | "Se usi una fotocamera vera con una luce principale, sei nel primo 30." | Salita al gradino 3: il telefono arriva dove c'era la fotocamera spenta, **ruota su se stesso e diventa la fotocamera vera** (match cut); dal suo schermo esce il tuo reel, grande, nel mirino (U14): "vera" REC e **l'autofocus aggancia subito, in lime**, ISO 400. "luce principale": **il faro** di lato si accende, il fascio cade sul tuo viso: nitido. "primo 30": alzata 3, 30 accese; pill "primo 30%". | K13 · U14 · F13 · O23 · faro |
| 10 | 27,1–32,4 | "E se aggiungi un controluce dietro di te, che è la cosa che nessuno fa e che costa meno di tutte," | Tutta l'attrezzatura del gradino 3 sale in cima con te (la camera la segue, O31); sul gradino 3 torna quella spenta. "aggiungi" dietro il tuo reel sale **un tubo LED lime** (come quelli del tuo studio); "controluce" si accende: bordo lime e alone dietro il reel, ti stacca dallo sfondo; "dietro di te" la camera si stringe, "te" la tua maniglia si accende. "nessuno fa": la camera si allarga sulla scala, le persone accese sui gradini sotto diventano grigie a onda (F11), resta acceso solo il controluce (F04). "costa meno di tutte": **cartellini** legati ai tre oggetti (5.000 € · 50 € · 20 €), quello del controluce diventa lime. | O31 · F13 · F11 · F04 · D15 |
| 11 | 32,5–35,67 | "sei nel primo 10%." | Alzata 4: si accendono 10 persone su 100 in lime con la tua foto, pill "primo 10%"; poi la camera si allarga su tutta la scala: la stanza buia in basso, l'attrezzatura spenta e le folle grigie sui gradini bassi, in cima tu nella luce, con i raggi. | O23 · O33 · F07 · K03 |

Prezzi dei cartellini: 5.000 € è detto nella voce; 50 € per la luce principale viene dalla caption ("poche decine di euro");
20 € per il controluce (un tubo LED) è il valore che fa capire "costa meno di tutte".

## Titoli (solo parole dette, uscita ≥ 0,45 s prima del titolo dopo)
"Non è la fotocamera" · "È dove metti / la luce" · "Una stanza / illuminata male" · "L'attrezzatura / da 5.000 euro" ·
"Uno che / improvvisa" · "Una scala, / 4 gradini" · "Col telefono / e basta" · "Il 99% / di tutti" · "Telefono, ma /
luce naturale" · "Nel primo 50" · "Fotocamera vera, / luce principale" · "Nel primo 30" · "Un controluce / dietro di te" ·
"Che nessuno fa" · "Costa meno / di tutte" · "Nel primo / 10%".

## Oggetti
- Dal kit: `fotocamera`, `faro`, `phone2`, `rays`, `avatar(…, "tu")`, `pulse`, `ripple`, `connector`, `glowFlash`, `titleW`,
  camera kit2.
- Nuovi, in `kw-kit/kit2-reel11.js` (nomi con il suffisso `R11`, documentati in `KIT-V2.md`, catalogo O33, O34, F13, D15): la
  scala con le folle (`scalaR11`, `follaR11`), il tuo reel con gli stati di luce (`reelLuceR11`), la stanza (`stanzaR11`), la
  lampadina nuda (`lampadinaR11`), il telefono che registra e quello spento (`telefonoR11`, `fantasmaTelR11`), il mirino con ISO e
  autofocus (`mirinoR11`), la finestra con i fasci di sole (`finestraR11`), il controluce a tubo LED (`ledR11`), il cartellino
  (`cartellinoR11`), il treppiede (`treppiedeR11`).
- I tuoi reel veri in movimento (`spezzoni.txt` → `assets/clips/`, 30 fps, un fotogramma chiave al secondo): `a` nella stanza e nel
  mirino, `p` nello schermo del telefono, `c` nel mirino della fotocamera vera e in cima.

## Correzioni dopo le snapshot e la densità
- Hook: fotocamera e reel più grandi; su "è" la fotocamera non esce ma resta in alto, spenta in grigio (densità della scena 2 da
  0,218 a 0,284) e il faro si accende su "la luce" (dal "la").
- Stanza: listelli e assi più visibili e inquadratura che la riempie (scena 3 da 0,230 a 0,264; con la safe zone 0,238).
- Mirino: la maniglia e il cartellino si spengono prima di entrare (sotto il nero restavano testi coperti); l'autofocus non salta
  più sopra "4K · 30".
- Scala: prima la stanza intera, poi il viaggio verso la scala che si alza (prima a 11,4 s il fotogramma era vuoto); l'attrezzatura
  spenta su ogni gradino e il fascio di luce dalla cima (scena 6 da 0,197 a 0,300; la scala ora si legge già, come il reel 4).
- Gradini: il telefono si spegne prima che la camera scenda sull'alzata (passava sotto il titolo); il telefono salta insieme alla
  camera e atterra su "telefono"; la finestra spostata a sinistra perché il telefono non la copra; sul gradino 3 il telefono arriva
  già sul posto (prima volava sotto il titolo) e il ribaltamento ha la prospettiva a 2600 (a 900 si deformava).
- Mirino del gradino 3: senza maniglia (si sovrapponeva a "1/50 · f/1.4 · ISO"); "primo 10%" senza disco sopra (lo copriva).
- Safe zone dell'11/10: `BAND.y1 = 1300`, maschera 1290–1331, stanza a fill 1, inquadratura di "nessuno" più alta (il gradino 1
  restava mezzo sfumato in basso).

## Verifiche
`check` 0 errori (anche contrasto) · snapshot sulle parole chiave · densità ≥ 0,23 e copertura ≥ 0,54 al 60% di ogni scena
(`densita.txt`) · render di prova + `safezone.py` + `_sync.mp4` con la voce · confronto con Kallaway (reel 102, 17, 107, 9, 50, 144,
4, 109, 88, 65, 46, 59, 61) · anteprima :3025 (solo il server, senza aprire il browser). 4K: `node kw-kit/deliver.cjs reel-11 11`
(solo la versione senza copertina).
