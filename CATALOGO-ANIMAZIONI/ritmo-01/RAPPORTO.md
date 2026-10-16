# Rapporto del sotto-agente del blocco 1 (13/10 sera)
Salvato dalla regia della sessione 8 per la regia nuova. La revisione da regia (pagina `?b=1`, strisce, correzioni) e le domande
all'utente (R7, R8, standard dei template, D13) non sono ancora state fatte.

**Fatte tutte e 12 le voci.** Ognuna ha il template con la scheda, la scena in `ritmo-01`, il voto in `voti_kit.json`, la riga in
tabella e la pagina rigenerata.
- `ritmo-01` dura 59,4 s.
- Il check dà 0 errori e `safezone.py` 0 campioni sotto la riga.
- Il primo fotogramma di ogni taglio è pieno.
- L'anteprima è sulla :3032 e lo stato voce per voce in `STATO.md`.

## Misure contro Kallaway (K)
- **O01:** apertura al 90% in 0,63 s, quasi lineare (K 0,67 s, power1.out); prima 0,17 s. Camera ferma.
- **C01:** viaggio di 1113 px, 90% in 0,47 s, picco 3000 px/s (K 712–808 px, 0,42–0,71 s, 2360–2970 px/s); prima stesura
  7490 px/s.
- **F08:** onda di 0,40 s (K 0,33 s); la pill cambia in 1–3 fotogrammi (K 1).
- **U02:** arrivo di 175 px, poi colpo del +19,1% sul conteggio (K −175 px, +19,3%); conteggio lineare 0,94 s (K ~1,2 s).
- **U03:** camera ferma, +0,8% (K 0–9 px); il cursore fa metà strada in 0,12 s (K ~0,125 s).
- **T05:** decodifica di 7 fotogrammi (K 4–5).
- **L11:** tracciato dal 10 al 90% in 0,43 s (K 0,50 s), camera ferma.
- **D01:** ingresso di 973 px, 90% in 0,53 s, picco 2008 px/s, sine.out (K 736 px, 0,58 s, 1972 px/s); con la frusta da 0,4 s
  erano 9374 px/s.
- **O21:** onda di 0,40 s (K 0,25–0,33 s).
- **U10, U11, U07:** camera ferma dopo l'ingresso, come lo schermo del reel 65; arrivo di lato 148 → 0,5 px/s.
- **Rimbalzo:** 0 ovunque.
- **Voti:** 5·4·4·5 per O01, C01, F08 e T05; 5·5·4·5 per le altre otto.

## R7, sfondo fermo
- Applicata in tutte le 12 scene: i puntini restano fermi nella tenuta e seguono la camera nelle transizioni morbide.
- Si toglie cancellando la riga `tplFermo();` in fondo a `index.src.html`, oppure con `fermo: false` per una scena sola.

## R8, transizioni
Taglio netto + arrivo in 8 cambi su 11. Le 3 morbide:
| tempo | cambio | come | per toglierla |
|---|---|---|---|
| 5,6 s | O01 → C01 | la linea parte dall'anello e la camera la segue | `TPL.C01` senza `da` |
| 38,0 s | L11 → U10 | zoom-through dentro il video dell'utente (`tplZoomThrough`) | togliere la riga della transizione; `TPL.U10` senza `ingresso: "nessuno"` |
| 55,0 s | O21 → D01 | pan di lato (`tplPan`) | togliere la riga della transizione; `TPL.D01` senza `ingresso: "nessuno"` |

## Cosa non torna
- **Standard dei template:** aggiunto `tplTitoloK` invece di cambiare `tplTitolo`. Con quest'ultimo, nei titoli di 6 o più parole
  l'ultima parola sfumava ancora nel primo fotogramma della scena dopo. D13 non è stato toccato.
- **Durate fuori norma:** U03 dura 7,8 s (una frase sola, con la seconda inquadratura), L11 6,55 s.
- **Frase anticipata:** in U11 e U07 Condividi è premuto su «reel» e non alla fine della frase, altrimenti il reel pubblicato
  resterebbe in scena solo 0,1 s.
- **Fotogrammi vuoti:** le schermate dei telefoni occupano circa il 37% della larghezza, con fondo ai lati; anche L11 con 4 tappe è
  piuttosto vuoto.
- **Numeri d'esempio:** in U02 i 245 follower sono veri, il 1.000 è inventato; inventate anche le views di D01 e T05.
- **Materiali:** O01, C01 e F08 usano reel d'esempio per tema, non quelli dell'utente.
- **Conteggi:** in D01 il conteggio dura 1,5 s perché segue le parole (K ~1 s). In T05 le lettere si fermano a scalare, in K
  tutte insieme.

## Kit
- Opzioni nuove, tutte in coda col default di prima: `reelRing.open` (ease), `cursor().moveTo` (ease), `metroPath.show` (piene),
  `igDrafts.duplicate` (accanto), `sfondoFermo` (finestre).
- demo-8 ricostruita senza `KW_RITMO`: 3 snapshot con hash identici.
- Note nella sezione «Ritmo e template» di `KIT-V2.md`; template in `kw-kit/kit2-tpl-*.js`.

## Strumenti nuovi
In `_analisi/ritmo/_script_blocco01/`:
- `radiale.py`: le aperture ad anello;
- `viaggio.py`: i viaggi su più schermate, dove `deriva.py` perde il riferimento;
- `cambio.py`, `kfoglio.py`, `chiudi_voce.py`.

## File
- Render: `_analisi/render/ritmo-01_bozza.mp4`.
- Clip della pagina: `ritmo-clip/<ID>_dopo.mp4` e `<ID>_kallaway.mp4`.
- Fogli di Kallaway, strisce, misure (`_radiale`, `_viaggio`, `_cambio`) e primi fotogrammi di tutti i tagli
  (`N_tagli_ritmo01.jpg`): `_analisi/ritmo/blocco01/`.
- Deriva: `_analisi/ritmo/deriva/*_ritmo01*.jpg`.
- Pop: `_analisi/ritmo/pop/U11_ritmo01_reel.jpg`.
