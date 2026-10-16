# Reel 01/10 — "Pubblicare di tutto" · stile Kallaway (v5, kit v2)

25,83 s, agganciato al voice-over (`my-video-ottobre-p1-test/src/words/d01.ts`). Stessa struttura del **v4 approvato**
(`../reel-01/`, invariato per il confronto), rifatta con il kit v2: titoli parola per parola sui tempi della voce (`at()`), camera solo
col gestore kit2 (`arrive/frameRect/move/float/whip2/camK`), anello d'apertura con `reelRing`, Hormozi con la foto profilo vera.
Il piano del v4 è in `PIANO-v4.md`.

| # | Tempo | Cosa cambia rispetto al v4 |
|---|---|---|
| 1 | 0–2,95 | Fotogramma 0 già pieno (la pila di reel, sfocata dal rack focus); l'anello è `reelRing` (si apre in 0,42 s e gira); titolo parola per parola su "L'errore / numero uno / principianti". |
| 2 | 2,95–4,5 | "di tutto": l'anello accelera e scaglia via i reel (`reelRing.fling`); la barra diventa l'intestazione come nel v4. |
| 3 | 4,5–7,6 | **Nuovo**: al posto della timeline (vuota a 5,6 e 7,4 s nel v4) un planner della settimana pieno di reel veri, già nelle celle e sfocati; ognuno va a fuoco sul giorno detto con l'etichetta del tema; la camera corre LUN–MAR → GIO–VEN → tutta la settimana. Densità a 5,6 s: 0,55 (v4 0,25); a 7,4 s: 0,37 (v4 0,17). |
| 4 | 7,6–10,75 | La settimana sale e diventa la riga d'ingresso dell'hub (stesso oggetto, match cut), connettori e analisi del profilo come nel v4. |
| 5 | 10,75–12,75 | Anelli di persone `peopleRings` con **la tua foto vera** al centro; chi se ne va vola via, i 4 che restano diventano lime; sotto, la card "Chi ti guarda" crolla da 50 a 4 con la curva che precipita. |
| 6 | 12,75–18,5 | Triade del v4; le tre caselle vuote sono tratteggiate da subito; "Punto.": freccetta del kit (`bullseye.hit`) + punch-in K06. |
| 7 | 18,5–22,95 | Clessidra del v4; profilo di Hormozi con `igProfile` (foto profilo vera, spunta blu, griglia di reel veri), riquadri header → bio → griglia sui secondi della sabbia. |
| 8 | 22,95–25,83 | Il telefono parte sotto il titolo (nel v4 il titolo lo copriva); al posto del "+0" (numero da solo) resta la card "Nuovi follower oggi: 0" con la linea piatta e le 5 visite che non ti seguono. Il profilo "di tutto" usa la tua foto (regola "il tuo profilo"), con handle `il_tuo_profilo` e non il tuo vero. |

Comandi: `node kw-kit/build.cjs reel-01-v5` · `cd reel-01-v5/composition && npx --yes hyperframes@0.8.138 check` · anteprima
`npx --yes hyperframes@0.8.138 preview --background --port 3015` · render 4K solo dopo il tuo ok: `node kw-kit/deliver.cjs reel-01-v5 01 2.4`.
