# Rapporto del sotto-agente del blocco 2 (14–15/10)
Salvato dalla regia (sessione 9). La revisione da regia è nella sezione «Sessione 9 · regia nuova» di PROSSIMA-SESSIONE.md.

**Fatte tutte e 12 le voci, più D13 prima del blocco.** Ogni voce ha template, scheda, scena in `ritmo-02`, render di prova,
misure, voto, riga di tabella e pagina rigenerata.

## Verifiche finali
- `ritmo-02` dura 55,75 s; check 0 errori, `safezone.py` 0 campioni sotto 1332, anteprima :3033 accesa.
- demo-8 senza `KW_RITMO`: kit di prima e kit nuovo, 3 snapshot (1,2 · 13,7 · 31,5 s) con hash identici.

## D13 prima/dopo
- Riempimento: prima 4,05 s fino a «volta.», ora lineare in 2,25 s come Kallaway (K).
- Spinta +9,0% in 3 s (K +9,6% in 2,4 s); angoli 79/35/2 px/s (K 86/41/8).
- Tolto `parole.arriva` dalla scena e dalla `chiamata` della scheda; il template non è cambiato.

## Ordine delle scene
- reel 14: F02 · O13 · K11 · F04 · O10;
- reel 15: U15 · O24 · O23 · L09 · L12 · K16 · D06.

## Numeri contro Kallaway
pop.py su tutte le 12 voci: rimbalzo 0 dappertutto.
- **F02**: disco pieno in 0,07 s, diametro da 0,50 a 0,62 della larghezza (K r7 da 0,47 a 0,57). L'etichetta va da 0,90 a 1 senza
  tornare indietro; in K r14 cresce del 10% e torna.
- **O13**: battito come K r48 (acceso/spento a ogni fotogramma per 5 fotogrammi); etichetta scritta in 0,6 s (K r34 0,6 s).
- **K11**: apertura 0,35 s (K r61 0,42 s), scorrimento 0,6 s (K 0,54 s).
- **F04**: il resto scende al 67% in 0,27 s (K r61 al 72% in 0,37 s); lo scelto non cresce più (prima 1,05).
- **O10**: costruzione dal centro in 0,77 s, quasi lineare (K r42 0,85 s, con un ritorno del 6%).
- **U15**: cronometro in tempo reale; i 30 giorni si riempiono in 1,57 s (K r13 scansione in 0,85 s).
- **O24**: 30 reel veri in 1,2 s, 0,04 s a giorno (K r67 31 giorni in 1,1 s).
- **O23**: 70 puntini lime in 0,7 s, 20 bianchi in 0,2 s, 10 anelli lime, un gruppo per parola.
- **L09**: rami cresciuti e a fuoco in circa 0,75 s (K r3 un livello in circa 0,5 s).
- **L12**: una sezione per parola, 3 righe in 0,23 s.
- **K16**: spinta +15% in 2 s (K r35 +15,8% in circa 2 s).
- **D06**: testina lineare per 2,7 s, contatore da 0:00 a 0:28.

## Proporzioni
Larghezza occupata, misurata con il nuovo `ingombro.py`.

| voce | noi | K |
|---|---|---|
| F02 | 0,69 | 0,68 |
| O13 | 0,65 (cervello 0,43) | 0,50 |
| K11 | 0,97, a tutto schermo | 0,98 |
| F04 | 0,78 | |
| O10 | 0,81 | 0,63 |
| U15 | 0,78 | |
| O24 | 0,78 | circa 0,7 |
| O23 | 0,72 | 0,49 |
| L09 | 0,79 | 0,64 |
| L12 | 0,64 | 0,57 |
| K16 | da 0,50 a 0,56 | da 0,48 a 0,53 |
| D06 | 0,82 | 0,74 |

Le scene piccole al centro della prima stesura sono state ingrandite: O10 era a 0,58, O23 a 0,56, L09 alta la metà; poi F04, O24 e
K16.

## Transizioni morbide (R8)
3 su 11 cambi:
- K11 → F04: zoom-through nell'eccezione accesa del muro;
- L09 → L12: zoom-through nel reel del filone «Idee»;
- K16 → D06: la camera scorre di lato (1146 px, 90% in 0,53 s, picco 2337 px/s; K r9 736 px, 1972 px/s).

## Cosa non torna
- **Difetto trovato:** un filtro animato partendo da «none» fa un fotogramma nero al primo passo.
  - Corretto in F02 e F04.
  - C'è anche in F08 del blocco 1 (le persone a onda): non toccato, per la regola sulle scene di ritmo-01.
- **O10 e L09:** partono dal centro o dalla radice, con etichette e filoni già lì ma sfocati. Il movimento principale è la
  costruzione, quindi al taglio la scena non è del tutto piena.
- **K16:** la scheda è stretta come il copione di Kallaway, quindi le pill si leggono piccole; le copertine nei giorni sono statiche.
- **D06:** lo scorrimento è più lungo di quello misurato su Kallaway.
- **U15:** il cronometro è il protagonista, mentre in Kallaway il timer è piccolo, accanto all'oggetto.
- **L09:** dura 2,85 s, perché la frase è corta.
- **Materiali:**
  - «1M views» è il «virale» dello script, non un dato vero;
  - i reel virali sono di Hormozi;
  - tutti gli altri sono reel dell'utente: 30 mini-clip in `ritmo-02/assets/clips/cal`.
- **Lentezza:** con 49 video nella composizione le snapshot sono lentissime e il render prende 4,3 min; i fotogrammi sono
  stati controllati dal render.

## Kit
Tutte opzioni in coda, col default di prima:
- `pulse`: cresce, svanisce, allarga;
- `bullseye().ring`: dur, ease;
- `scriptDoc`: fsTitolo, fsLab, top;
- `stopwatch()` restituisce anche `num`.

Altro:
- `build.cjs` mette l'atlante del muro nel pool anche con `TPL.K11(`;
- file nuovo `kw-kit/kit2-tpl-camera.js` per K11 e K16;
- note in `KIT-V2.md`.

## File
- Render: `_analisi/render/ritmo-02_bozza.mp4` e `ritmo-09_bozza.mp4`.
- Clip della pagina: `ritmo-clip/<ID>_dopo.mp4` e `<ID>_kallaway.mp4`.
- Fogli di Kallaway, misure e primi fotogrammi di tutti i tagli (`N_tagli_ritmo02.jpg`): `_analisi/ritmo/blocco02/`.
- Strisce: `_analisi/ritmo/pop/*_ritmo02_*.jpg` e `_analisi/ritmo/deriva/*ritmo02*.jpg`.
- Script e strumenti nuovi (`disco.py`, `ingombro.py`, `moto.py`, `solo_colore.py`, `render_ritmo.ps1`, `voce_*.json`):
  `_analisi/ritmo/_script_blocco02/`.
- Stato voce per voce: `ritmo-02/STATO.md`.
