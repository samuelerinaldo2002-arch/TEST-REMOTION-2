# Reel 12/10 — "I contenuti non sono pubblicità" · stile Kallaway (sessione 5, sotto-agente della regia)

**Stato delle tappe** (aggiornare a ogni passo): 1 piano ✔ (v2: 8 scene, safe zone 1320, ritmo) · 2 spezzoni ✔ (da DA PUBBLICARE, solo momenti mai usati in 09/10/11/13/demo-6, `spezzoni.txt`) · 3 build ✔ · 4 densità ✔ · 5 bozza v1 ✔ (13/10 07:44, `CATALOGO-ANIMAZIONI/_analisi/render/reel-12_bozza.mp4`), foglio sulle parole v1 ✔ (`_parole.jpg`), `safezone.py` v1: fuori linea a 0,5–2,8 s e 13,8–18 s · **correzioni v3 della regia applicate** (1 safe zone: erano i puntini dello sfondo ingranditi dallo zoom, ora sfumano anche loro prima della linea; sulle snapshot sotto y 1332 luminanza massima 30 = fondo piatto · 2 a 26,8 s la scena vecchia esce a sinistra e la bacheca entra da destra (posti in grafite numerati 1–10 che si accendono su "regola"), polvere F10 chiara e grande su "tutto quello" · 3 titoli: la seconda riga non resta a metà (+ corretti i tempi di "Il contenuto peggiora" e "Il ritorno non arriva", erano una parola in ritardo) · 4 hook: altri reel fuori fuoco attorno al tuo che si allargano, visualizzazioni che salgono, Sponsorizzato su "come se fossero", il reel diventa il cartellone con la camera solo su di lui, poi la strada; la gente che passa entra con la strada) · build ✔ `check` 0 errori · densità ✔ (`densita.txt` v3) · **niente nuova bozza** (richiesta dell'utente): snapshot sui punti corretti e sulle parole ✔ (`_parole_v3.jpg`) · 4K e safe zone sul 4K: regia · KIT-V2.md e catalogo ✔ (O35, D16, O36; `genera_catalogo.py` rilanciato: 150 voci) · 6 confronto con Kallaway ✔ sulla bozza delle 07:44 (`CATALOGO-ANIMAZIONI/_analisi/confronti-video/reel12_confronto.mp4`) · 7 server di anteprima :3026 avviato dalla regia (non toccarlo: basta ricaricare) · rapporto alla regia ✔ (13/10). 4K solo su richiesta della regia: `node kw-kit/deliver.cjs reel-12 12`.

41,03 s (1231 fotogrammi) sui tempi veri della voce: `../my-video-ottobre-p1-test/src/words/d12.ts`, 104 parole, controllato
contro `timestamps_ottobre_p1.csv` e l'mp3 (41,008 s) con `_tools/verifica_parole.py 12` ("OK: corrisponde"). 30 fps.
**Safe zone (11/10 sera): niente grafica sotto y = 1320** (sotto c'è la faccia dell'utente, linea rossa di `SAFEZONE.jpg` a
1332): tutte le inquadrature con `fitPose(…, {bottom: 1300})`, la gente e i piani compresi. **Ritmo**: una scena per idea
(~4–5 s), un movimento principale subito dopo il taglio, poi una tenuta leggibile con la camera che scivola piano; curve morbide.
Pattern: **P09** (mito → verità) + **P05** (cartellone contro persona) + **P12** (8 su 10 / 2 su 10). Riferimenti di Kallaway:
**136** (la griglia che si tinge, l'interruttore che si spegne, i ricavi) e **103** (social media is not for selling: le persone).

## L'idea: il cartellone e la persona
Dalla caption dell'utente: *"se 10 contenuti su 10 hanno dentro una vendita, sei un cartellone pubblicitario. Se 8 danno qualcosa
e 2 chiedono qualcosa, sei una persona con cui viene voglia di parlare."*

Il mondo è **una strada orizzontale** che si sviluppa da sinistra a destra; la camera la percorre di lato e non torna mai
indietro. Due corsie scorrono insieme: sopra i tuoi contenuti, sotto la gente che passa (volti veri, una folla).
- **La via dei cartelloni.** I tuoi reel veri diventano **cartelloni pubblicitari** su pali alti (pannello in grafite, poster
  chiaro con "−30%" e "COMPRA ORA", lampade). Sotto ognuno c'è il posto del cliente che dovrebbe arrivare. La gente passa e non si
  ferma; il contenuto peggiora (gli adesivi coprono la tua faccia), il ritorno non arriva (il contatore dei clienti resta piatto
  a 0), spegni l'interruttore "Pubblica" (come il toggle del reel 136) e i cartelloni cadono a domino e si sbriciolano.
- **La regola.** La linea della strada porta (K09) a **un righello di 10 segmenti** con sopra 10 tuoi reel veri che scorrono
  piano (K12): 8 **danno** (bianchi, mandano un "+" alla gente sotto, che si ferma) e 2 **chiedono** (lime, con la barra "Scrivimi"
  / "Prenota"). In fondo alla strada, al posto del cartellone, **ci sei tu**: il righello diventa l'anello attorno alla tua foto
  vera (8 segmenti bianchi + 2 lime) e la gente viene a parlarti (bolle dei DM). Poi i due che chiedono funzionano.

Grammatica spaziale diversa dagli altri reel (09 console al centro · 10 colonna verticale · 11 scala in diagonale · 13 profondità):
qui **asse orizzontale**, corsie parallele e viaggi laterali, nessun hub.
Match cut: il tuo reel → pubblicità di Instagram → cartellone (il pannello cresce attorno al reel) · la linea della strada vuota
dopo il crollo → il righello della regola · il righello (8 bianchi + 2 lime) → l'anello attorno alla tua foto · il contatore dei
clienti piatto a 0 (scena 4) → lo stesso contatore che sale nel finale.

## Scene (tempi = parole della voce)
| # | Tempo | Voce | Cosa si vede | Catalogo |
|---|---|---|---|---|
| 1 | 0–6,35 | "Molte attività trattano i propri contenuti come se fossero pubblicità diretta, e questo li rovina." | **Il tuo reel vero** grande, già in scena al fotogramma 0 (rack focus) con la camera che spinge piano; "Molte attività": attorno, altri reel fuori fuoco (2 colonne ai bordi) che si allargano e si spengono su "contenuti", quando le visualizzazioni del tuo salgono (0 → 12,4K). "come se fossero" (2,23): Sponsorizzato e "Acquista ora" (la pubblicità di Instagram). "pubblicità" (3,13): **il reel diventa il cartellone** (il pannello cresce dai suoi bordi, gambe, lampade) e la camera si allarga solo sul cartellone intero; "diretta": le lampade si accendono. "e questo" (4,47): la camera scorre sulla strada degli altri cartelloni, entra la gente che passa; "rovina": la curva delle visualizzazioni crolla e i reel diventano grigi a onda | A02 · K10 · A05 · K03 · F05 · D02 · F11 (reel 136) |
| 2 | 6,4–12,6 | "Nel momento in cui pretendi che ogni contenuto porti un cliente, succedono due cose insieme." | La camera scorre a destra. "pretendi": i "COMPRA ORA" pulsano; "ogni contenuto": i cartelloni si accendono a cascata; "porti un cliente": da ognuno scende una linea tratteggiata al **posto del cliente** (persona qualunque con il "?"). "due cose": i numeri **1** (cartelloni) e **2** (gente) sulle due corsie; "insieme": due linee lime corrono **insieme** lungo le corsie. | K03 · L03 · C01 |
| 3 | 12,7–17,8 | "La prima, il contenuto peggiora perché inizi a vendere invece che a dire qualcosa." | Primo piano del cartellone: il numero 1 si accende; il tuo reel parla (nuvoletta con la lampadina = dire qualcosa). "peggiora": **gli adesivi delle offerte** calano sulla tua faccia (−50%, SOLO OGGI, PROMO, ULTIMI POSTI) e il reel diventa grigio. "vendere": **il cartellino del prezzo** oscilla, "COMPRA ORA" si gonfia. "dire qualcosa": la nuvoletta si spegne, viene barrata e cade. | F12 · F11 · nuova (adesivi e cartellino, nello stile degli oggetti veri) |
| 4 | 17,9–21,0 | "La seconda, il ritorno non arriva comunque," | La camera va al cartellone dopo: il 2 si accende sul **posto del cliente**; "il ritorno": la freccia tratteggiata del ritorno sale verso il cartellone e accanto c'è la card **Clienti dai contenuti** con la linea piatta a 0 (D01); "non arriva": una persona rallenta davanti al posto vuoto e tira dritto; "comunque": "COMPRA ORA" lampeggia, sempre 0. | D01 · C01 · F05 |
| 5 | 21,0–26,1 | "quindi ti convinci che non funzioni e smetti, buttando via anche tutto quello che avevi già costruito." | La camera scivola su di te: **la tua foto vera** accanto al contatore a 0 e al grande **interruttore "Pubblica"** acceso. "non funzioni": sul contatore cala una ✗; "smetti" (22,83): l'interruttore si spegne (toggle del reel 136) e le lampade si spengono a catena. "buttando via": i cartelloni **cadono a domino**; "costruito": si sbriciolano in polvere (F10), resta la linea della strada. | U04 (reel 136) · F05 · nuova (domino, nello stile di O28) · F10 (reel 40) |
| 6 | 26,2–33,45 | "La regola pratica è semplice. 8 contenuti su 10 danno qualcosa, 2 chiedono qualcosa." | La linea della strada corre a destra e la camera la segue (K09): le macerie, tu e l'interruttore escono a sinistra mentre da destra entra la regola: **una bacheca di 10 posti vuoti in grafite, numerati 1–10** (2 file da 5) sopra **il righello** d'acciaio a 10 segmenti; poi la camera scivola piano. "regola": i numeri si accendono, "semplice": il riflesso. "8 contenuti": entrano **10 tuoi reel veri**. "danno": gli 8 si accendono di bianco col **regalo**, i segmenti 1–8 si riempiono e da ognuno parte un **"+"** (C03) verso la persona sotto, che si accende. "2 chiedono": gli ultimi 2 diventano **lime** con la barra "Scrivimi" / "Prenota una call", segmenti lime, e sotto di loro i posti dei clienti ancora vuoti. | K09 (reel 13) · F03 · C03 (reel 40) · D06 · F08 · O36 |
| 7 | 33,5–37,35 | "Se rispetti quella proporzione, diventi una persona con cui viene voglia di parlare" | La camera va oltre l'ultimo reel: **ci sei tu** (foto profilo vera, grande). "rispetti quella proporzione": il righello si chiude in **un anello attorno alla tua foto**, 8 segmenti bianchi e 2 lime (D10). "una persona": la foto pulsa, il nome. "con cui viene voglia di parlare": le persone qualunque arrivano dalla corsia e spuntano le **bolle dei messaggi** (i puntini che scrivono, "Ciao Samuele!", "Mi è servito tantissimo", "Come lavori?"), cuori. | D10 · F02 · U01/U09 · O21 (reel 103) |
| 8 | 37,4–41,03 | "e a quel punto i due che chiedono funzionano." | La camera si allarga sui due reel lime, su di te e sulla card dei clienti. "i due che chiedono": pulsano (F04); "funzionano" (39,43): le barre diventano "✓ Prenotato" / "✓ Inviato", **i posti dei clienti sotto di loro si riempiono** (al contrario della prima strada) e la card **Clienti** sale da 0 a 2 con la linea che sale (D01). | F04 · D01 · F02 |

Titoli (parola per parola sulla voce, uscita ≥ 0,45 s prima del successivo): "Molte attività / trattano i contenuti" ·
"**Pubblicità** / diretta" · "Questo li **rovina**" · "Ogni contenuto / porti un **cliente**" · "Due cose / **insieme**" ·
"Il contenuto / **peggiora**" · "Vendere / invece che **dire qualcosa**" · "Il ritorno / **non arriva**" · "Ti convinci / e
**smetti**" · "Tutto quello / avevi **costruito**" · "Regola pratica / **semplice**" · "8 contenuti su 10 / **danno** qualcosa" ·
"2 **chiedono**" · "Rispetti quella / **proporzione**" · "Una persona / con cui **parlare**" · "I due che chiedono /
**funzionano**".

## Mondo (coordinate)
- Strada a y = 1100, corsia della gente a y ≈ 1218. Cartelloni B0…B3 a x = 540, 1420, 2300, 3180 (pannello 788 × 456 su pali
  di 480, reel 241 × 428 a sinistra). Il tuo posto (contatore dei clienti, foto, interruttore) a x ≈ 3640–4380.
- La regola da x = 5300: bacheca 2 × 5 di reel 240 × 427 (T1…T10, passo 262) sopra il righello a 10 segmenti da 131 (y 1100), la
  gente sotto (y 1252); la tua foto (d 440) a x ≈ 7030, y 640, con l'anello e i messaggi a destra.
- Chi passa: volti veri dell'atlante (folla: occhi aperti, niente scritte, persone diverse). Chi ti scrive e chi diventa cliente:
  **persona qualunque** (`personaK`).

## Oggetti
- Dal kit: `titleW`, camera kit2, `faceDot`, `personaK`, `avatar(…, "tu")`, `connector`, `signal`, `flicker`, `statCard`,
  `disintegrate`, `sheenK`, `pulse`, `ripple`, `sparks`, `shake`, `tapFinger`, `lineExit`.
- Nuovi, in `kw-kit/kit2-reel12.js` (suffisso `R12`): `cartelloneR12` (cartellone, pubblicità di Instagram, adesivi, cartellino,
  lampade, crollo), `levaR12` (interruttore "Pubblica"), `righelloR12`, `corsiaR12` (la gente che passa), `postoR12` (il posto del
  cliente), `bollaR12` (DM), `parentesiR12` (L10 orizzontale).

## Spezzoni (`spezzoni.txt`, assets/clips)
Tagliati da `DA PUBBLICARE` (D: ricollegato) solo su momenti **mai usati** nei reel 09, 10, 11, 13 e nella demo-6 (momenti degli
altri trovati confrontando i fotogrammi; pezzi del 13 dall'elenco della regia; il pezzo di faccia 05 42,0–44,4 ceduto dal 13).
Controllati fotogramma per fotogramma (luminanza: niente flash) e a 6 fps (facce pulite, niente grafiche dentro i primi piani).
- b0 (il hook, B0): faccia 05/10 81,45–85,9, poi grafica 05/10 51,0 · r1 (B1): grafiche 02/10 8,5 · 08/10 1,7 · 03/10 11,0 ·
  r2 (B2): grafiche 03/10 27,0 · 04/10 8,1, poi la faccia per il primo piano della scena 3: 05/10 59,3 · 06/10 15,4 ·
  b3 (B3): grafiche 02/10 33,0 · 05/10 68,0.
- t1…t10 (la regola): infografiche dei tuoi reel (01, 02, 04, 05, 06, 07, 08/10) e, per t9 e t10 (i due che chiedono, in primo
  piano nel finale), la tua faccia: 03/10 34,4 · 01/10 0,0 e 05/10 42,15 · 03/10 0,0.

- Hook (v3): i 4 reel fuori fuoco attorno al tuo (`h1`–`h4`) non sono tagli nuovi: sono `t4`, `t5`, `t6`, `t7` della bacheca da 3,0 / 5,0 / 2,0 / 4,5 s del file, sfocati e piccoli per 0–2,3 s (nel pool VIDEOS con mediaStart).

## Verifiche
`check` 0 errori · snapshot sulle parole chiave · densità ≥ 0,23 e copertura ≥ 0,54 al 60% di ogni scena (`densita.txt`) ·
render di prova `CATALOGO-ANIMAZIONI/_analisi/render/reel-12_bozza.mp4` + `_tools/safezone.py` + `_sync.mp4` con la voce ·
confronto con Kallaway (136 tinta e interruttore, 40 polvere e segnali, 13 linea, 25/32 nastro, 103 persone, 9 contatore) in
`CATALOGO-ANIMAZIONI/_analisi/confronti-video/reel12_confronto.mp4` · server di anteprima :3026 (senza aprire il browser).
