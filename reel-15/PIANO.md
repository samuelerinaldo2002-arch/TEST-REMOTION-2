# Reel 15/10 — «30 giorni di contenuti in 30 secondi» · stile Kallaway coi template (sotto-agente della regia, 15/10)

**Stato (15/10 19:45):** piano ✔ · composizione ✔ (`check` 0 errori; U01 con `h: 1060`, se no la risposta copriva il campo)
· bozza 1 → foglio → correzione (nomi dei formati D02 che si toccavano: «1 € vs 100K €») · bozza 2 ✔
(`CATALOGO-ANIMAZIONI/_analisi/render/reel-15_bozza.mp4`, 1375 fotogrammi) · safezone 0 su 275 · foglio `reel-15/foglio.jpg` ✔ ·
anteprima :3055 ✔ · tabella RIFACIMENTO-RITMO + `ritmo-03/STATO.md` (X01, U01) ✔ · rapporto ✔ · **da fare: 4K solo quando lo
dice la regia** (`node kw-kit/deliver.cjs reel-15 15`, senza copertina; poi ffprobe 2160×3840 30 fps 45,83 s, safezone, copia
in `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\INFOGRAFICA REMOTION\STILE KALLAWAY`). Nota: copiare i file finali con bash.

45,83 s (1375 fotogrammi) = l'mp3 `velocizzati 110%/2026-10-15.mp3` (45,817 s). Parole: `d15.ts`, 118, uguali al CSV
(`timestamps_ottobre_p1.csv`, 118, ultima «metodo.» 43,58–43,94 s). Marcatore `KW_RITMO`, R7 `tplFermo()` in fondo, safe zone 1332.

## Concept: «Il mese che si compila in 30 secondi»
Il reel è il cronometro stesso: parte da 30 secondi e ogni scena è un passo del piano (volume → suddivisione → filoni → script →
calendario), che alla fine la timeline del lettore (D06) ripassa come capitoli dei 30 secondi. Il mondo è una **scala che
scende** (ogni passo 3000 px a destra e 700 px più in basso, diverso dalla fila piatta del reel 14): il piano «scende» di un
gradino a ogni passo. Le transizioni morbide sono dove un passo entra nel successivo: il giorno del calendario diventa la
griglia della suddivisione; la settimana scorre nel riassunto; la risorsa da commentare si apre nella chat.

## Scene (tagli 0,1 s prima della prima parola della frase; tempi = `wt(i)` delle parole)
| # | tempo | frase | template | transizione |
|---|---|---|---|---|
| 1 | 0–4,27 | 30 giorni di contenuti pianificati in meno di 30 secondi. | `TPL.U15` (cronometro da 30, anello dei 30 giorni) | fotogramma 0 pieno |
| 2 | 4,27–9,17 | Scegli un volume. Uno al giorno vuol dire 30 video al mese. Poi decidi | `TPL.O24` (30 tuoi reel veri nei giorni, contatore) | taglio + arrivo |
| 3 | 9,17–15,97 | …la suddivisione. Io uso 70% valore, 20% fiducia, 10% conversione. | `TPL.O23` (100 puntini, gruppi sulle parole) | **R8 morbida** `tplZoomThrough` in un giorno del calendario |
| 4 | 15,97–18,57 | Scegli i tuoi filoni tematici dentro la tua nicchia. | `TPL.L09` (nicchia → 4 filoni coi tuoi reel) | taglio |
| 5 | 18,57–22,67 | Cerca argomenti e formati che stanno funzionando in questo momento sui social. | `TPL.D02` (4 formati veri, views vere) | taglio + arrivo |
| 6 | 22,67–28,33 | Scrivi gli script con un metodo fisso. Io uso hook, spiega, mostra, insegna. | `TPL.L12` (copione, sezioni sulle parole) | taglio + arrivo |
| 7 | 28,33–35,27 | Infine, organizza tutto in un calendario, alternando i filoni… lo stesso tema. | `TPL.K16` (settimana coi filoni alternati, spinta) | taglio |
| 8 | 35,27–39,33 | Ecco come pianifici 30 giorni di contenuti in meno di 30 secondi. | `TPL.D06` (lettore + 5 capitoli = i 5 passi) | **R8 morbida** `tplPan` dalla settimana |
| 9 | 39,33–41,73 | Commenta sistema e ti mando il comando… | `TPL.X01` (pagine a ondate, «Il comando») | taglio + arrivo |
| 10 | 41,73–45,83 | …che uso per scrivere i copioni con questo metodo. | `TPL.U01` (chat vera, il comando si scrive, invio su «metodo») | **R8 morbida** `tplZoomThrough` nella pagina del comando |

3 morbide su 9 cambi. Ogni template una volta. X01, U01 e D02 erano già scritti dal blocco 3 (fermo): qui sono usati e provati
nel reel; demo e misure restano al blocco 3.

## Materiali
`reel-15/assets/clips/`: `cal/o01–o30` (30 mini-clip dei tuoi reel di ottobre, da ritmo-02), `mio/m03` (il lettore),
`alt/f1–f4` (formati veri con le views vere, `_sorgenti.json`, da ritmo-03); la tua foto `av-tu` nella chat.
