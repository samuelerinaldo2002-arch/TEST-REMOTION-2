# Reel 10/10 — "Come funziona l'algoritmo delle storie" · stile Kallaway (sessione 5)

34,07 s (1022 fotogrammi) sui tempi veri della voce: `../my-video-ottobre-p1-test/src/words/d10.ts`, 103 parole, controllato
contro `timestamps_ottobre_p1.csv` e l'mp3 `velocizzati 110%/2026-10-10.mp3` (34,045 s) con `_tools/verifica_parole.py 10`.
30 fps. Niente grafica sotto y ≈ 1385. Pattern: **P08** (come funziona un meccanismo) + **P10** (UI di Instagram).
Gemello di Kallaway **40** ("Escape the 200 view jail": telefono → `<Algorithm/>` → folla di prova che conta; dato positivo
→ la folla cresce, negativo → "−" e la nuvola di particelle).

## L'idea: la fila delle storie
Le storie di Instagram sono **una fila di cerchi** in cima all'app: chi è primo viene visto. La storia non va a tutti: passa
prima da un **anello di prova** (i follower che interagiscono di più) e l'algoritmo misura cosa fanno. Da lì la fila ha due
direzioni, e il mondo è **verticale**:
- in basso c'è il **pozzo delle storie sepolte** (cerchi spenti ammucchiati: la tua ci cade dentro e le altre le cadono sopra);
- in alto c'è **la cima**: un muro di file di storie (le file di tutti gli altri), e la tua prende il primo posto in ognuna.

Grammatica spaziale diversa dal 09 (console al centro e viaggi laterali): qui la camera **scende e sale** lungo una colonna
(il telefono del primo follower), con l'anello di prova a sinistra come punto di partenza e di ritorno.

Match cut: il tuo cerchio nella fila → si entra nel cerchio ed è la tua storia (K13/K07) · il telefono si rimpicciolisce e
diventa il cerchio al centro degli anelli · la storia si richiude nel cerchio che cade nel pozzo / che sale in cima ·
l'orologio di "l'ora" si rimpicciolisce sul cerchio dei primi.

Il `<Algoritmo/>` di Kallaway 40 (pill in stile codice col bordo luminoso) è il giudice: riceve i segnali "−" e "+" (C03)
da chi guarda e decide.

## Scene (tempi = parole della voce, indici di `parole.py`)
| # | Tempo | Voce | Cosa si vede | Catalogo |
|---|---|---|---|---|
| 1 | 0–4,1 | "Ecco come funziona davvero l'algoritmo delle storie su Instagram." | Telefono grande con la **home di Instagram** del vecchio stile già in scena al fotogramma 0 (fila delle storie con le foto vere, la tua per prima; sotto il tuo post). Rack focus. "davvero" (1,03): il tuo cerchio pulsa. "l'algoritmo" (1,93): sopra il telefono si decodifica la pill `<Algoritmo/>` e da lei scendono le linee a ogni cerchio della fila. "storie" (2,83): i cerchi si accendono a cascata. | A02 · K10 · T05 · O03 · C01 · F02 · L03 |
| 2 | 4,2–7,2 | "Quando pubblici una storia, Instagram non la mostra a tutti," | "Quando": si entra nel tuo cerchio (K07) → l'editor della storia con il tuo video vero; "pubblici" (4,73): il dito preme **"La tua storia"**. "storia": il telefono si rimpicciolisce e diventa il cerchio al centro di **tre anelli di follower** (volti veri); "non la mostra a tutti": gli anelli restano spenti, l'esterno si oscura. | K07 · K13 · U07 · O21 · F11 |
| 3 | 7,3–10,3 | "la fa vedere prima ai follower che interagiscono di più con te" | Su "prima" il primo anello si accende di lime (F08) e i raggi partono dalla storia verso quei volti (C01); su "interagiscono" accanto ai volti spuntano ♥ 💬 ➤; "con te": la tua foto sul cerchio. | O21 · F08 · C01 · F07 |
| 4 | 10,3–12,0 | "e misura una cosa sola," | Da un volto del primo anello una linea porta la camera **dentro il suo telefono** (K09): la sua home con il tuo cerchio ancora da aprire; sopra la pill `<Algoritmo/>`; su "una cosa sola" gli angoli di selezione si chiudono sul tuo cerchio. | K09 · H04 |
| 5 | 12,1–15,0 | "se la aprono e quanto ci restano sopra." | "aprono" (12,53): il dito tocca il cerchio e la storia si apre; "quanto ci restano sopra": la barra in alto si riempie e accanto al telefono il **cronometro** conta i secondi; gli angoli passano sulla barra. | U07 · D06 · U15 · H04 |
| 6 | 15,1–19,5 | "Se non la aprono o entrano e scorrono subito, la storia viene sepolta." | "non la aprono": il dito scorre oltre, il cerchio resta da aprire; "entrano e scorrono subito": tocca, la barra si ferma presto, la storia scivola via; un "−" (C03) va alla pill. "sepolta" (18,3): il tuo cerchio cade (K08, la camera lo segue) nel **pozzo** di storie spente e le altre gli cadono sopra. | C03 · K08 · F11 |
| 7 | 19,6–25,0 | "Se invece la guardano fino in fondo e reagiscono con un like, una risposta o una condivisione," | La camera torna su (arrivo in corsa dal basso) sulla storia aperta; "fino in fondo": la barra arriva in fondo e si accende; il dito mette il **like**, scrive la **risposta**, tocca **condividi**: ogni gesto manda un "+" alla pill. | K02 · U07 · D06 · C03 |
| 8 | 25,0–27,4 | "viene spinta in cima alle storie di tutti gli altri." | La storia si richiude nel tuo cerchio (anello lime) che **sale** (la camera lo insegue) fino al **muro delle file di storie**; "in cima": prende il primo posto della fila più alta (le altre scivolano); "di tutti gli altri": la camera si allarga e il tuo cerchio è primo in ogni fila. | K08 · O31 (ride) · L16 · A01 · F08 |
| 9 | 27,5–31,1 | "Non conta quante storie pubblichi, non conta l'ora," | A destra della cima: le tue **storie del giorno** a ventaglio (barra con 12 segmenti, video veri) → su "non conta" si spengono e una riga le barra; poi un **orologio** che gira veloce (l'ora di pubblicazione) → spento e barrato. | L15 · F11 · T13 · nuova (orologio, nello stile di U15) |
| 10 | 31,2–34,1 | "conta solo cosa fanno i primi che le vedono." | Taglio sugli anelli: si accende solo il primo anello con ♥ 💬 ➤ (F04), gli angoli si chiudono attorno ai primi su "i primi", impulso finale. | F04 · H04 · F02 · O21 |

## Oggetti
- Dal kit: `phone2`, `tapFinger`, `peopleRings` (volti veri), `faceDot`, `avatar(…, "tu")`, `decode`, `connector`, `signal`,
  `selectCorners`, `stopwatch`, `pulse`, `ripple`, `sheenK`, `tint`, `strikeLines`, `fallFollow`, `titleW`, `swapWord`,
  camera kit2.
- **Nuovi, nel kit (`kw-kit/kit2-storie.js`, servono anche al 13/10)**: `igHome` (home del vecchio stile con la fila delle
  storie), `igStoryEdit` (editor della storia con "La tua storia" / "Amici più stretti"), `igStoryView` (la storia aperta:
  barra a segmenti, nome e ora, risposta, cuore, condividi), `storyRow` (fila di cerchi con l'anello), `algoPill`
  (`<Algoritmo/>` di Kallaway 40), `orologio` (quadrante con le lancette).
- Chi guarda: i volti veri dell'atlante solo nella folla degli anelli e nel pozzo; il follower che apre la storia non ha volto
  (si vede solo il suo telefono).
- I tuoi reel veri in movimento (`spezzoni.txt` → `assets/clips/`, 30 fps, un fotogramma chiave al secondo): la storia
  `st` (04/10, 20–26 s), il post `feed` (02/10), le storie del giorno `f1–f5` (07/10, 08/10, 02/10).

## Correzioni dopo le snapshot e il confronto con Kallaway
- Hook stretto sulla fila delle storie (cerchi grandi, la tua facecam nel post) e la camera che si allarga **prima** di
  "l'algoritmo", così la pill compare già ferma sotto il titolo.
- Spezzoni: il primo `st` (04/10) aveva 0,33 s di grafica all'inizio, un flash bianco a 2 s e una grafica in fondo → rifatto
  con due blocchi di facecam puliti (01/10 + 06/10) trovati con `_tools/finestre_pulite.py`; `f1` e `f3` avevano flash → sostituiti.
- Anelli: volti più grandi (124/102/88) e inquadratura che arriva ai bordi (densità della scena 2 da 0,219 a 0,250).
- **K08 (reel 65)**: Kallaway parte subito e chiude in ~0,5 s; noi aspettavamo 0,33 s e cadevamo per 1.800 px → pozzo subito
  sotto il telefono, caduta di 0,46 s che parte con il cerchio, polvere all'impatto.
- **Reel 40**: sul dato positivo la sua pill pulsa con un disco pieno → `algoPill.flash("+")` col disco lime; il contatore della
  folla (200 → 2.000) → contatore delle visualizzazioni della storia: **38** nel pozzo, **38 → 2.417** in cima.
- **O31 (reel 59)**: salita più lunga (0,6 s) con la camera che insegue, linee di velocità e le file che scorrono accanto.
- Arrivo della scena 7 di lato (dall'alto passava sotto il titolo); il telefono del follower sparisce prima che il pozzo sia in posa.

## Verifiche
`check` 0 errori · snapshot sulle parole chiave · densità ≥ 0,23 e copertura ≥ 0,54 al 60% di ogni scena (`densita.txt`) ·
render di prova + `_sync.mp4` con la voce · confronto con Kallaway (40 per pill, segnali e folla; 65 per la caduta; 59 per la
salita; 15 per il ventaglio) · anteprima :3024 (prima :3024 era demo-8). 4K solo dopo l'ok:
`node kw-kit/deliver.cjs reel-10 10 <secondo della copertina>`.
