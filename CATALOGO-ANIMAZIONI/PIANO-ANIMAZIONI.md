# Piano: fare le animazioni mancanti e portare al massimo quelle che ci sono

Per la chat nuova, da leggere dopo `PROSSIMA-SESSIONE.md`. Stato al 09/10/2026 sera (sessione 3): il catalogo ha 137 voci dopo la
revisione (115 + K17 + 21 nuove) e **133 sono nel kit** (le altre 4 non si fanno: 3 di montaggio, 1 da evitare). Fatti **Fase 0 e
Blocchi 1–4**: demo-3 (Blocco 1), demo-4 (Blocco 2), demo-7 + voti in `_analisi/voti_kit.json` (Blocco 3), demo-5 (Blocco 4).
Confronti in `_analisi/moto/` e video affiancati in `_analisi/confronti-video/`.
**Blocco 5** (aggiornato il 10/10, sessione 4 parte 2): le 16 scene di demo-6 **rifatte una per una contro le clip di Kallaway**
(funzioni in `kw-kit/kit2-blocco5.js`, reel veri dell'utente in movimento, O26 col manichino bianco di Kallaway). `check` 0 errori.
**Chiuso il 10/10 notte**: render di prova, strisce di movimento di tutte le 21 voci, correzioni (O31, O29, O28, U13, D11, D12,
L15), video affiancato `_analisi/confronti-video/blocco5_confronto.mp4`, voti in `_analisi/voti_kit.json`, anteprima :3023.

**Blocco 3 bis** (10/10): le voci più usate rifatte da protagoniste in `demo-8` (L01 · L02 · K14, D01 · U05 · K03, D04, A01 · L14 ·
D02 · F11 · F04, O05, L09). Le strisce in `_analisi/moto/` mostravano che nelle prime demo più dispositivi stavano stretti nella stessa
scena, piccoli; Kallaway dà a ognuno tutto il frame. Vedi `kw-kit/KIT-V2.md` → "Blocco 3 bis". Confrontato e corretto il 10/10 notte
(D04, D01), video `blocco3bis_confronto.mp4`, voti in `voti_kit.json`, anteprima :3024.
**Prossimo: «Blocco 3 ter»** → `demo-9` con U02, O21, O01, L11, C01, F08 (prompt pronto in `PROSSIMA-SESSIONE.md`).

Il reel del 09/10 si rifà da zero nella sessione 4 (vedi `PROSSIMA-SESSIONE.md`). Il resto di questo file descrive il piano
com'era all'inizio.
- **83** sono già nel kit.
- **28** sono da fare: 22 nuove e 6 da aggiornare.
- **4** non si fanno: 2 sono di montaggio (DaVinci) e 2 sono state bocciate.

Decisione dell'utente (09/10): si creano **tutte le 28 animazioni mancanti** e si migliorano **al massimo** le 83 esistenti, prima di
tornare ai reel. L'ordine: quelle che servono agli script, poi le frequenti, poi il miglioramento del kit, poi le rare.

## Come si lavora (vale per ogni animazione)
1. **Guardare Kallaway fotogramma per fotogramma**:
   - `python -I _tools/striscia.py CATALOGO-ANIMAZIONI/clip/<ID>_1.mp4 <out.jpg> 0 <durata> 15 6`;
   - per i dettagli (blur, glow, materiali) usare `_tools/ritaglio.py`;
   - per il bagliore usare `_tools/misura_glow.py`.
2. **Scrivere o rifare la funzione nel kit**: `kit2-oggetti.js` per gli oggetti, `kit2-core.js` per camera, testo, luce e connettori,
   `kit2-ui.js` per l'interfaccia. Valgono:
   - i tempi misurati della voce;
   - le curve KW di `kit2-core.js`;
   - le 25 regole di `kw-kit/KIT-V2.md`, in particolare 12 (oggetti veri), 21 (niente blur su back.out) e 25 (materiali);
   - una timeline sola, deterministica, senza Math.random.
3. **Provarla in un lab** (`KIT-V2.md` → "Lab veloce"), con snapshot nei momenti chiave.
4. **Confronto affiancato con Kallaway**:
   - fotogramma allo stesso istante (`_tools/confronto.py`): densità ≥ 0,23 e copertura ≥ 0,54;
   - movimento con `_tools/confronto_moto.py` (vedi Fase 0): tempi entro ±15% di quelli misurati, stessa curva, stesso numero di "colpi".
5. **Metterla nella demo del blocco** (`demo-3`, `demo-4`, …), con un titolo che dica cosa spiega (regola 12: ogni elemento deve
   c'entrare con la frase). `check` a 0 errori, poi anteprima aperta nel browser.
6. **Registrarla**:
   - `IMPL` in `_tools/genera_catalogo.py` con firma e "dove si vede";
   - stato `"kit"` in `_tools/catalogo_dati.py`;
   - API in `KIT-V2.md`;
   - `python -I _tools/genera_catalogo.py` per rigenerare il catalogo.
7. **Fine blocco**: l'utente guarda la demo e approva. Prima del suo ok l'animazione non entra nei reel. Poi aggiornare
   `PROSSIMA-SESSIONE.md`, così il lavoro riparte anche dopo una compattazione o in un'altra chat.

### Quando un'animazione è "fatta al massimo" (checklist)
- [ ] **Movimento:**
  - durate e ritardi uguali a quelli misurati (±15%);
  - stessa curva (attacco, frenata, rimbalzo);
  - stessa sequenza di colpi (es. zoom → scroll → frenata → riflettore).
- [ ] **Materiali e luce:**
  - oggetti veri o 3D lucidi, con ombra portata, glow e riflesso dove ce l'ha Kallaway;
  - lime sempre pieno, mai trasparente.
- [ ] **Frame pieno:** densità e copertura sopra la soglia nel confronto affiancato, con 3–6 elementi secondari che spiegano.
- [ ] **Brand:**
  - Advercase per i titoli, Zalando Sans per la UI, Patrick Hand per gli accenti;
  - #CFFB50 e #1E1E1E;
  - foto vere (la sua per "tu", dei creator per gli altri);
  - reel veri in movimento nelle griglie.
- [ ] **Regole dell'utente:**
  - niente caselle di testo;
  - niente numeri senza senso;
  - ogni elemento spiega la frase;
  - 30 fps.
- [ ] **Tecnica:**
  - `check` a 0 errori;
  - seek-safe (snapshot a tempi sparsi = stesso risultato);
  - nessuna sovrapposizione non voluta (se voluta: `data-layout-allow-overlap`);
  - frame 0 pieno se è un hook.
- [ ] **API generica:** contenuti come parametri (etichette, icone, id del pool) e metodi a tempo (`.show(t)`, `.on(t)`, …), così la
      stessa funzione serve a script diversi.

## Fase 0 · strumento da preparare per primo: `_tools/confronto_moto.py`
Due strisce di fotogrammi una sotto l'altra, alla stessa frequenza (15 o 30 fps), con il tempo scritto su ogni cella:
- sopra la clip di Kallaway (`clip/<ID>_n.mp4`, t0–t1);
- sotto la nostra animazione allo stesso passo.

Per la parte "nostra" ci sono due strade:
- `snapshot --at` con la lista dei tempi (es. 0,033 s di passo);
- un render di prova a bassa risoluzione della demo. Mai 4K senza l'ok dell'utente.

Va stampato anche il "profilo di movimento" dei due (differenza tra fotogrammi consecutivi nel tempo), così si vede se attacco,
durata e frenata coincidono. Riutilizzare il codice di `_tools/striscia.py` e la misura di `_tools/analisi_movimento.py`.

## Blocco 1 · servono ai tuoi script (7) → `CATALOGO-ANIMAZIONI/demo-3/`
### 1. K11 · Scroll 'slot machine' di un muro di miniature (nuova, frequenza media)
- **Com'è in Kallaway:** Il muro scorre in verticale velocissimo con motion blur e frena fino a fermarsi su una selezione.
- **Tempi misurati:** Zoom out 0,2 s → scroll 0,4 s con scia → frenata 0,3 s → riflettore sulla selezione.
- **Quando si usa:** "Ho analizzato migliaia di video...", "tra tutti i contenuti..." (ricerca, selezione).
- **Nel kit:** slotScroll(t, griglia, finale) — nuovo.
- **Clip di riferimento:** `clip/K11_1.mp4` · `clip/K11_2.mp4`
- **Script che la usano:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350); 08/09 Non inventare le idee: trova gli outlier; 14/10 Se non diventi virale… e se si sbagliassero?
### 2. O08 · Triade che ruota e porta in alto la voce detta (da aggiornare, frequenza media)
- **Com'è in Kallaway:** Triangolo 3D: a ogni parola ruota finché il lato nominato è in alto e nitido; gli altri sfocati.
- **Tempi misurati:** Rotazione 0,5 s ease-in-out con leggera inclinazione 3D.
- **Quando si usa:** Tre elementi da tenere insieme (nicchia, pubblico, problema).
- **Nel kit:** Triade nel kit (reel-01 S5) — aggiungere rotateTo().
- **Clip di riferimento:** `clip/O08_1.mp4`
- **Script che la usano:** 01/10 L'errore n°1: pubblicare di tutto; 07/10 Tre emozioni che tengono davanti al video; 21/09 Tre tipi di contenuto per follower veri
### 3. L08 · Tabella che si compila (nuova, frequenza media)
- **Com'è in Kallaway:** Righe e colonne che si riempiono cella per cella (spesso con evidenziazione colorata).
- **Tempi misurati:** ~0,1–0,2 s per cella.
- **Quando si usa:** Matrici (argomenti × formati), confronti, valutazioni.
- **Nel kit:** table() — nuovo.
- **Clip di riferimento:** `clip/L08_1.mp4` · `clip/L08_2.mp4`
- **Script che la usano:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350); 10/09 Metodo 6 × 5 (30 giorni in 30 minuti)
### 4. D03 · Curva che si disegna con etichette e camera che la segue (nuova, frequenza media)
- **Com'è in Kallaway:** Assi a L, curva luminosa che si traccia, punti ed etichette a pill; la camera si sposta sull'etichetta attiva.
- **Tempi misurati:** Curva ~1,2 s costante · etichette sulla parola.
- **Quando si usa:** Andamenti (retention, crescita, arco narrativo).
- **Nel kit:** lineChart() — nuovo.
- **Clip di riferimento:** `clip/D03_1.mp4` · `clip/D03_2.mp4`
- **Script che la usano:** 06/09 Le storie: +27% views, +31% condivisioni; 30/09 Mai chiudere con "seguimi": il loop
### 5. F10 · Disintegrazione in particelle (nuova, frequenza rara)
- **Com'è in Kallaway:** Un elemento si dissolve in polvere luminosa che si espande.
- **Tempi misurati:** ≈0,6 s.
- **Quando si usa:** "Sparisce", "il video muore", "bruci tutto".
- **Nel kit:** disintegrate() — nuovo.
- **Clip di riferimento:** `clip/F10_1.mp4`
- **Script che la usano:** 09/10 Nessuno compra per le informazioni; 10/10 Come funziona l'algoritmo delle storie
### 6. C03 · Segnale con segno che viaggia (da aggiornare, frequenza rara)
- **Com'è in Kallaway:** Un cerchietto con +/− percorre la linea (dato positivo/negativo).
- **Tempi misurati:** ≈0,4 s.
- **Quando si usa:** Algoritmo che riceve un segnale buono/cattivo.
- **Nel kit:** traveller() con icona — aggiornare.
- **Clip di riferimento:** `clip/C03_1.mp4`
- **Script che la usano:** 01/10 L'errore n°1: pubblicare di tutto; 10/10 Come funziona l'algoritmo delle storie
### 7. L05 · Lista con lucchetti che si sbloccano (nuova, frequenza media)
- **Com'è in Kallaway:** Ogni voce completata diventa verde con lucchetto aperto.
- **Tempi misurati:** Cambio stato secco + piccolo pop.
- **Quando si usa:** Percorsi/metodi in cui si 'sblocca' un passo alla volta.
- **Nel kit:** Variante di resolveRow() con icona lock.
- **Clip di riferimento:** `clip/L05_1.mp4` · `clip/L05_2.mp4`
- **Script che la usano:** 25/09 Cinque pezzi di un profilo che porta clienti

## Blocco 2 · Kallaway le usa spesso, probabilmente serviranno (10) → `CATALOGO-ANIMAZIONI/demo-4/`
### 1. F03 · Sheen (banda di luce) (da aggiornare, frequenza altissima)
- **Com'è in Kallaway:** Riflesso diagonale che attraversa card e barre appena arrivate o appena 'risolte'.
- **Tempi misurati:** Banda ~40 px, ~20°, 0,7–0,9 s.
- **Quando si usa:** Arrivo di card importanti, risoluzione di una voce.
- **Nel kit:** sheen() nel kit — verificare verso e larghezza.
- **Clip di riferimento:** `clip/F03_1.mp4`
- **Script che la usano:** —
### 2. K09 · Uscita seguendo una linea (il titolo resta nel mondo) (nuova, frequenza alta)
- **Com'è in Kallaway:** Una linea esce dall'oggetto e la camera la segue in whip; il titolo vecchio esce insieme al mondo, il nuovo arriva con la scena.
- **Tempi misurati:** Linea che cresce 0,3 s · whip 0,5 s · nuovo titolo parola per parola dopo l'arrivo.
- **Quando si usa:** Hook → primo schema; collegare due schemi che sono causa ed effetto.
- **Nel kit:** connector.draw() + whip(); opzione title({world:true}).
- **Clip di riferimento:** `clip/K09_1.mp4` · `clip/K09_2.mp4`
- **Script che la usano:** —
### 3. O25 · Telefono / tablet / lavagna come schermo (da aggiornare, frequenza alta)
- **Com'è in Kallaway:** Dispositivo con UI vera dentro; la camera ci entra o lo segue.
- **Tempi misurati:** Ingresso 0,4–0,6 s.
- **Quando si usa:** Esempi, app, database, risultati.
- **Nel kit:** igPhone() nel kit; tablet() nuovo.
- **Clip di riferimento:** `clip/O25_1.mp4` · `clip/O25_2.mp4`
- **Script che la usano:** —
### 4. A07 · Profilo o UI con numeri che salgono (da aggiornare, frequenza media)
- **Com'è in Kallaway:** Un profilo/una UI vera già in scena con un numero che cresce (follower, retention) mentre il titolo si scrive.
- **Tempi misurati:** Conteggio ~1 s.
- **Quando si usa:** Risultati, casi studio, "come sono passato da X a Y". 2 su 30.
- **Nel kit:** igPhone() + statCard() / pill follower — kit (U02 da aggiornare).
- **Clip di riferimento:** `clip/A07_1.mp4` · `clip/A07_2.mp4`
- **Script che la usano:** —
### 5. H01 · Annotazioni con freccia a ricciolo (da aggiornare, frequenza media)
- **Com'è in Kallaway:** Parole grandi + freccetta disegnata a mano che entrano da lati alterni con sfocatura di movimento.
- **Tempi misurati:** 0,35–0,4 s l'una, una per parola detta.
- **Quando si usa:** Elencare cosa si ottiene ("trends, insights, patterns").
- **Nel kit:** handNote() + handArrow() — aggiungere ingresso con motion blur.
- **Clip di riferimento:** `clip/H01_1.mp4` · `clip/H01_2.mp4`
- **Script che la usano:** —
### 6. T09 · Una parola del titolo viene sostituita (nuova, frequenza media)
- **Com'è in Kallaway:** Il titolo resta, cambia solo una parola (si riscrive a macchina).
- **Tempi misurati:** ≈0,3 s.
- **Quando si usa:** Stesso schema, concetto che evolve ("Funnel" → "Progression", Primo → Secondo livello).
- **Nel kit:** swapWord(title, i, testo, t) — nuovo.
- **Clip di riferimento:** `clip/T09_1.mp4` · `clip/T09_2.mp4`
- **Script che la usano:** —
### 7. T10 · Il titolo si riorganizza (compatto) (nuova, frequenza media)
- **Com'è in Kallaway:** Da 2 righe grandi a 1 riga piccola in alto (dentro un box), per lasciare spazio allo schema.
- **Tempi misurati:** ≈0,3–0,4 s.
- **Quando si usa:** Quando dopo l'hook serve tutta l'area per la grafica.
- **Nel kit:** title.compact(t) — nuovo.
- **Clip di riferimento:** `clip/T10_1.mp4`
- **Script che la usano:** —
### 8. K12 · Nastro trasportatore (nuova, frequenza media)
- **Com'è in Kallaway:** Una fila di card scorre a velocità costante mentre lui le elenca una per una.
- **Tempi misurati:** ~120 px/s costanti per tutta la sezione (10+ s); ogni card entra quando viene nominata.
- **Quando si usa:** Elenchi lunghi (più di 5 voci) o una progressione nel tempo.
- **Nel kit:** conveyor(t, cards, velocità) — nuovo.
- **Clip di riferimento:** `clip/K12_1.mp4` · `clip/K12_2.mp4`
- **Script che la usano:** —
### 9. A06 · Tipografia gigante che diventa oggetto (nuova, frequenza media)
- **Com'è in Kallaway:** Parole enormi del titolo ("PLAN", "30") che occupano lo schermo e poi si ritirano per lasciare il posto all'oggetto (il calendario).
- **Tempi misurati:** Parole 0–1 s · trasformazione a ~1,2 s.
- **Quando si usa:** Hook con un numero o una promessa forte ("30 giorni in 30 minuti"). 2 su 30 (477K).
- **Nel kit:** titleW({size: 180+}) + calendar() — da comporre (non usare il numero da solo: vedi T11).
- **Clip di riferimento:** `clip/A06_1.mp4` · `clip/A06_2.mp4`
- **Script che la usano:** —
### 10. O12 · Lenti / sfere di vetro (nuova, frequenza media)
- **Com'è in Kallaway:** Sfere scure con riflesso e un'immagine dentro, disposte a fiore o ad anello.
- **Tempi misurati:** Rack focus d'apertura, rotazione lenta.
- **Quando si usa:** Punti di vista, angoli, categorie.
- **Nel kit:** glassOrb() — nuovo.
- **Clip di riferimento:** `clip/O12_1.mp4` · `clip/O12_2.mp4`
- **Script che la usano:** —

## Blocco 3 · portare al massimo le 83 già nel kit (a giri, per frequenza)
Ogni voce passa la checklist qui sopra con il confronto di movimento (Fase 0). Per ogni voce si dà un voto da 1 a 5 su:
- movimento;
- materiali e luce;
- frame pieno;
- brand.

Si rifà ciò che sta sotto 4, partendo dalle voci più frequenti, che compaiono in quasi ogni reel. I voti vanno in
`CATALOGO-ANIMAZIONI/_analisi/voti_kit.json` (voce → voti, cosa manca, cosa è stato fatto): così il lavoro si riprende.

Le correzioni vanno nel kit, quindi valgono per tutti i reel futuri.
- demo, demo-2, demo-oggetti e reel-03 si rigenerano e si ricontrollano;
- **reel-01 v4 non si tocca**;
- reel-01 v5 e reel-03 sono stati approvati: se una correzione li cambia a vista, si mostra prima l'anteprima.

Punti deboli già noti dalle sessioni precedenti:
- formula D07 e piramide O05 sono al limite della soglia di densità (0,22 / 0,25);
- 10 voci risultano nel kit ma senza un punto della demo dove si vedono: K16, O15, C01, F06, F08, H02, A03, A04, A05, A08.
  Vanno messe in una demo e verificate;
- titoli in sequenza: in demo-2 restano due avvisi di sovrapposizione a 52,15 s ("Il copione" → titolo successivo). Va applicata la regola 16.

| # | Voce | Frequenza | Negli script | Dove si vede ora | Clip di Kallaway |
|---|---|---|---|---|---|
| 1 | L01 · Lista con voci-segnaposto sfocate | altissima | 12 | demo 5–9 s | `clip/L01_1.mp4` · `clip/L01_2.mp4` |
| 2 | X01 · "Commenta X" + anteprima della risorsa | altissima | 11 | demo-2 72–76 s | `clip/X01_1.mp4` · `clip/X01_2.mp4` |
| 3 | F02 · Pulse a disco pieno | altissima | 10 | demo 2,6 s · demo-2 21,2 s | `clip/F02_1.mp4` · `clip/F02_2.mp4` |
| 4 | L02 · Una voce si risolve con uno sheen | altissima | 10 | demo 6,8 s · 8,4 s | `clip/L02_1.mp4` · `clip/L02_2.mp4` |
| 5 | D01 · Contatore + grafico che si disegna + bagliore finale | altissima | 8 | demo 13 s · demo-2 68,5 s | `clip/D01_1.mp4` · `clip/D01_2.mp4` |
| 6 | U02 · Profilo Instagram con numeri che salgono | altissima | 7 | v5 19,4–25 s · demo 33,7 s | `clip/U02_1.mp4` · `clip/U02_2.mp4` |
| 7 | K03 · Spostamento di camera tra due oggetti | altissima | 4 | demo-2 34–37 s | `clip/K03_1.mp4` · `clip/K03_2.mp4` |
| 8 | L09 · Albero / flowchart che cresce | altissima | 4 | demo 18,45 s (mappa delle sotto-nicchie) | `clip/L09_1.mp4` · `clip/L09_2.mp4` |
| 9 | T01 · Titolo parola per parola, sincronizzato alla voce | altissima | 4 | demo 0–1,3 s | `clip/T01_1.mp4` · `clip/T01_2.mp4` |
| 10 | F08 · Cambio di colore = cambio di stato | altissima | 3 | **da mettere in una demo** | `clip/F08_1.mp4` · `clip/F08_2.mp4` |
| 11 | D02 · Badge views che poppano in sequenza | altissima | 2 | demo 12,3 s | `clip/D02_1.mp4` |
| 12 | U05 · Card dati in vetro | altissima | 2 | demo 13 s | `clip/U05_1.mp4` |
| 13 | C01 · Linea che si allunga mentre la camera viaggia | altissima | 1 | **da mettere in una demo** | `clip/C01_1.mp4` |
| 14 | T02 · Box evidenziatore che cresce insieme alle parole | altissima | 1 | demo 0–1,3 s | `clip/T02_1.mp4` · `clip/T02_2.mp4` |
| 15 | A01 · Muro o griglia di reel veri con badge views | altissima | 0 | demo-2 69,2 s (come scena) | `clip/A01_1.mp4` · `clip/A01_2.mp4` |
| 16 | F01 · Glow (bloom) su testi e oggetti | altissima | 0 | ovunque | `clip/F01_1.mp4` · `clip/F01_2.mp4` |
| 17 | K04 · Drift continuo (la camera non è mai ferma) | altissima | 0 | demo e demo-2, ogni scena | `clip/K04_1.mp4` · `clip/K04_2.mp4` |
| 18 | F11 · Tinta rossa/verde sulle miniature | alta | 7 | demo 7,6 s · demo 31,4 s | `clip/F11_1.mp4` · `clip/F11_2.mp4` |
| 19 | L14 · Griglia di esempi con etichette | alta | 6 | demo-2 69,2–72 s | `clip/L14_1.mp4` · `clip/L14_2.mp4` |
| 20 | O21 · Anelli orbitali di persone | alta | 6 | v5 10,75–12,75 s · r03 22,8–31 s | `clip/O21_1.mp4` · `clip/O21_2.mp4` |
| 21 | F04 · Riflettore + oscuramento del resto | alta | 5 | demo 30,5 s | `clip/F04_1.mp4` · `clip/F04_2.mp4` |
| 22 | O13 · Cervello luminoso | alta | 5 | demo-2 20–23,5 s · demo-oggetti 0–4 s | `clip/O13_1.mp4` · `clip/O13_2.mp4` |
| 23 | D04 · Retention che crolla | alta | 4 | demo-2 43 s · v5 11,3 s | `clip/D04_1.mp4` · `clip/D04_2.mp4` |
| 24 | L11 · Catena di passi / percorso a tappe | alta | 4 | demo-2 30 s | `clip/L11_1.mp4` · `clip/L11_2.mp4` |
| 25 | O03 · Hub con loghi collegati | alta | 4 | demo-2 62,5–64 s | `clip/O03_1.mp4` · `clip/O03_2.mp4` |
| 26 | U01 · Chat AI ricreata + prompt che si digita | alta | 4 | demo-2 14,5 s | `clip/U01_1.mp4` · `clip/U01_2.mp4` |
| 27 | H02 · Cerchio / freccia a mano su uno screenshot | alta | 3 | **da mettere in una demo** | `clip/H02_1.mp4` · `clip/H02_2.mp4` |
| 28 | C04 · Linea guida con etichetta che si scrive sopra | alta | 2 | demo 22,7 s | `clip/C04_1.mp4` · `clip/C04_2.mp4` |
| 29 | K14 · Una voce della lista diventa l'intestazione | alta | 2 | demo 10,2 s · v5 4,05 s | `clip/K14_1.mp4` · `clip/K14_2.mp4` |
| 30 | L12 · Documento "Video Script" che si costruisce | alta | 2 | demo-2 48 s | `clip/L12_1.mp4` · `clip/L12_2.mp4` |
| 31 | K13 · Match cut: un punto diventa l'oggetto | alta | 1 | v5 0,5–1,1 s | `clip/K13_1.mp4` · `clip/K13_2.mp4` |
| 32 | K16 · Push-in lento su un oggetto che si costruisce | alta | 1 | **da mettere in una demo** | `clip/K16_1.mp4` · `clip/K16_2.mp4` |
| 33 | L10 · Parentesi che raggruppa | alta | 1 | demo-2 68,2 s | `clip/L10_1.mp4` · `clip/L10_2.mp4` |
| 34 | O01 · Anello di reel che ruota | alta | 1 | demo 1,35–5 s · v5 0–4,4 s | `clip/O01_1.mp4` · `clip/O01_2.mp4` |
| 35 | O05 · Piramide a livelli con bandiere | alta | 1 | demo-2 54–56,7 s | `clip/O05_1.mp4` · `clip/O05_2.mp4` |
| 36 | A02 · Logo o oggetto protagonista già in scena | alta | 0 | r03 0–3,6 s | `clip/A02_1.mp4` · `clip/A02_2.mp4` |
| 37 | A03 · Documento/copione che si compila | alta | 0 | **da mettere in una demo** | `clip/A03_1.mp4` · `clip/A03_2.mp4` |
| 38 | F06 · Onde d'urto | alta | 0 | **da mettere in una demo** | `clip/F06_1.mp4` |
| 39 | H03 · Tag inclinati attorno a un reel | alta | 0 | demo-2 68,65 s | `clip/H03_1.mp4` · `clip/H03_2.mp4` |
| 40 | K02 · Arrivo in movimento dopo il taglio | alta | 0 | demo 5 s · demo-2 ogni scena | `clip/K02_1.mp4` · `clip/K02_2.mp4` |
| 41 | T07 · Sottolineatura d'accento che cresce | alta | 0 | da provare | `clip/T07_1.mp4` · `clip/T07_2.mp4` |
| 42 | T08 · Uscita del titolo: diventa grigio e se ne va | alta | 0 | demo 4,6 s | `clip/T08_1.mp4` |
| 43 | U03 · Cursore che clicca | media | 7 | demo-2 17,2 s | `clip/U03_1.mp4` · `clip/U03_2.mp4` |
| 44 | O24 · Calendario che si riempie | media | 5 | demo-2 0–5 s · v5 4,5–7,6 s (settimana) · r03 35,5–38,8 s | `clip/O24_1.mp4` · `clip/O24_2.mp4` |
| 45 | C02 · Linea che diventa flusso di puntini | media | 4 | demo-2 62,9 s (i canali che portano al tuo profilo) | `clip/C02_1.mp4` |
| 46 | D06 · Barra di avanzamento / timeline del video | media | 4 | demo-2 45,4 s | `clip/D06_1.mp4` · `clip/D06_2.mp4` |
| 47 | L13 · Confronto a due colonne | media | 4 | demo-2 64–66,4 s | `clip/L13_1.mp4` · `clip/L13_2.mp4` |
| 48 | O06 · Imbuto a strati | media | 4 | demo-2 38–43 s | `clip/O06_1.mp4` · `clip/O06_2.mp4` |
| 49 | O22 · Folla in un riquadro con contatore | media | 4 | demo-2 39 s | `clip/O22_1.mp4` · `clip/O22_2.mp4` |
| 50 | D05 · Barre con avatar in cima | media | 3 | demo-2 44,6 s | `clip/D05_1.mp4` · `clip/D05_2.mp4` |
| 51 | F07 · Raggi vivi dietro un logo | media | 2 | r03 0–3,7 s | `clip/F07_1.mp4` · `clip/F07_2.mp4` |
| 52 | L04 · Checklist con spunte | media | 2 | demo-2 28 s | `clip/L04_1.mp4` · `clip/L04_2.mp4` |
| 53 | O04 · Loghi in orbita attorno al protagonista | media | 2 | da provare | `clip/O04_1.mp4` · `clip/O04_2.mp4` |
| 54 | O07 · Scala al neon | media | 2 | demo-2 33 s | `clip/O07_1.mp4` · `clip/O07_2.mp4` |
| 55 | O10 · Bersaglio costruito dal centro | media | 2 | demo 22–28 s · demo-2 52–54 s · v5 17,67 s | `clip/O10_1.mp4` · `clip/O10_2.mp4` |
| 56 | O18 · Tubo al neon che si disegna + riflesso che corre | media | 2 | demo-2 23,5–28 s | `clip/O18_1.mp4` · `clip/O18_2.mp4` |
| 57 | K07 · Zoom-through (si passa 'attraverso' la scena) | media | 1 | demo 28 s | `clip/K07_1.mp4` |
| 58 | K10 · Messa a fuoco d'apertura (rack focus) | media | 1 | demo 0 s | `clip/K10_1.mp4` |
| 59 | O02 · Anello di loghi che esplode e poi implode | media | 1 | demo-2 60–62,2 s (implode nella tua foto vera) | `clip/O02_1.mp4` |
| 60 | O14 · Slot machine / casinò | media | 1 | demo-oggetti 0–8 s | `clip/O14_1.mp4` · `clip/O14_2.mp4` |
| 61 | T06 · Etichetta a macchina da scrivere | media | 1 | demo-2 34 s | `clip/T06_1.mp4` |
| 62 | A04 · Anello o orbita che si apre | media | 0 | **da mettere in una demo** | `clip/A04_1.mp4` · `clip/A04_2.mp4` |
| 63 | A05 · Clip vera che diventa infografica | media | 0 | **da mettere in una demo** | `clip/A05_1.mp4` · `clip/A05_2.mp4` |
| 64 | K05 · Whip pan con motion blur | media | 0 | demo-2 66,4 s · 72 s | `clip/K05_1.mp4` · `clip/K05_2.mp4` |
| 65 | L03 · La lista si accende a cascata | media | 0 | da provare | `clip/L03_1.mp4` |
| 66 | O11 · Due cerchi che diventano un Venn | media | 0 | da provare | `clip/O11_1.mp4` · `clip/O11_2.mp4` |
| 67 | O20 · Radar | media | 0 | demo-2 57–59,6 s | `clip/O20_1.mp4` · `clip/O20_2.mp4` |
| 68 | T03 · Box già disegnato + testo a macchina da scrivere | media | 0 | demo 17,85 s (nodo della mappa) | `clip/T03_1.mp4` · `clip/T03_2.mp4` |
| 69 | T04 · Lettere che compaiono in ordine casuale | media | 0 | demo 18,8 s (sotto-nicchie) | `clip/T04_1.mp4` · `clip/T04_2.mp4` |
| 70 | O23 · Griglia di 100 puntini | rara | 5 | demo-2 5 s | `clip/O23_1.mp4` |
| 71 | D07 · Formula che si compone | rara | 3 | demo-2 10–14,5 s | `clip/D07_1.mp4` |
| 72 | T05 · Testo che si decodifica (glitch) | rara | 2 | demo 20,55 s (risultato) | `clip/T05_1.mp4` |
| 73 | K06 · Punch-in sulla parola chiave | rara | 1 | v5 17,62 s ("Punto.") | `clip/K06_1.mp4` |
| 74 | O15 · Clessidra | rara | 1 | **da mettere in una demo** | `clip/O15_1.mp4` |
| 75 | U04 · Interruttori che si accendono | rara | 1 | demo-2 67,1–68 s | `clip/U04_1.mp4` · `clip/U04_2.mp4` |
| 76 | A08 · Risposta sfocata indicata da una freccia | rara | 0 | **da mettere in una demo** | `clip/A08_1.mp4` |
| 77 | F05 · Lampeggio di attivazione | rara | 0 | da provare | `clip/F05_1.mp4` · `clip/F05_2.mp4` |
| 78 | K15 · Light leak / flash (era podcast) | rara | 0 | demo 33,5 s | `clip/K15_1.mp4` |
| 79 | U07 · Dito che preme un bottone (UI Instagram) | rara | 0 | demo-2 66,7–68,1 s | `clip/U07_1.mp4` |
| 80 | U08 · Impostazioni di Instagram con interruttori veri | rara | 0 | demo-2 66,4–69,2 s | `clip/U08_1.mp4` · `clip/U08_2.mp4` |
| 81 | U09 · Notifica DM con la foto profilo vera | rara | 0 | demo-2 74–76 s | `clip/U09_1.mp4` |
| 82 | U10 · Bozze di Instagram: tre puntini → Duplica (con la lente) | rara | 0 | r03 3,7–5,5 s · 10,5–14,5 s | `clip/U10_1.mp4` |
| 83 | U11 · Nuovo reel: interruttore "Reel di prova" e Condividi | rara | 0 | r03 5,6–10,3 s · 16–22,4 s | `clip/U11_1.mp4` |

## Blocco 4 · rare (11) → `CATALOGO-ANIMAZIONI/demo-5/`
### 1. K08 · La camera segue un oggetto che cade/vola (nuova, frequenza rara)
- **Com'è in Kallaway:** Un oggetto fisico (sasso, pallina, card) fa da ponte: la camera lo insegue fino al mondo successivo.
- **Tempi misurati:** Inseguimento ~0,5 s · l'oggetto accelera (power2.in) e la camera lo aggancia in frenata.
- **Quando si usa:** Quando una causa produce un effetto ("un like... e succede questo").
- **Nel kit:** arcFly() + cam() sincronizzati — composizione di primitive del kit.
- **Clip di riferimento:** `clip/K08_1.mp4`
- **Script che la usano:** —
### 2. L06 · Indice fisso in un angolo (nuova, frequenza rara)
- **Com'è in Kallaway:** Mini-lista delle sezioni in alto a sinistra per tutto il reel, con la sezione corrente evidenziata.
- **Tempi misurati:** Sempre visibile, cambio evidenziazione 0,2 s.
- **Quando si usa:** Reel lunghi con molte sezioni (strumenti, elenchi di 6+).
- **Nel kit:** sideIndex(voci) — nuovo.
- **Clip di riferimento:** `clip/L06_1.mp4` · `clip/L06_2.mp4`
- **Script che la usano:** —
### 3. L07 · Tier list (nuova, frequenza rara)
- **Com'è in Kallaway:** Righe S/A/B/C colorate; gli elementi cadono nella riga giusta.
- **Tempi misurati:** Ogni elemento scende riga per riga ~0,15 s per riga.
- **Quando si usa:** Classifiche ("dal peggiore al migliore").
- **Nel kit:** tierList() — nuovo (bassa priorità).
- **Clip di riferimento:** `clip/L07_1.mp4` · `clip/L07_2.mp4`
- **Script che la usano:** —
### 4. O09 · Morph di forma (nuova, frequenza rara)
- **Com'è in Kallaway:** Una forma 3D luminosa ruota e intanto cambia forma (esagono → triangolo → livelli).
- **Tempi misurati:** ≈1,4 s di morph + taglio a fasce 0,25 s.
- **Quando si usa:** Quando un concetto generico diventa una struttura precisa.
- **Nel kit:** morphShape() su SVG — nuovo.
- **Clip di riferimento:** `clip/O09_1.mp4`
- **Script che la usano:** —
### 5. O16 · Acqua: sasso e onde (nuova, frequenza rara)
- **Com'è in Kallaway:** Superficie d'acqua 3D; un oggetto cade, onde concentriche, etichetta su linea guida.
- **Tempi misurati:** Caduta 0,5 s · onde 1 s.
- **Quando si usa:** Effetto a catena, condivisioni, portata ("piccole onde").
- **Nel kit:** water() — nuovo.
- **Clip di riferimento:** `clip/O16_1.mp4` · `clip/O16_2.mp4`
- **Script che la usano:** —
### 6. O17 · Onda che inghiotte (nuova, frequenza rara)
- **Com'è in Kallaway:** Una superficie che sale e fa affondare gli elementi uno per uno.
- **Tempi misurati:** Ogni elemento affonda in 0,8 s, diventa traslucido.
- **Quando si usa:** Saturazione, "vengono sommersi", ciò che diventa obsoleto.
- **Nel kit:** Con conveyor() — nuovo.
- **Clip di riferimento:** `clip/O17_1.mp4`
- **Script che la usano:** —
### 7. O19 · Costellazione di punti (nuova, frequenza rara)
- **Com'è in Kallaway:** Linee sottili con punti luminosi ai vertici ed etichette, disegnate punto per punto.
- **Tempi misurati:** 0,2 s per tratto.
- **Quando si usa:** Mappe di momenti (hook, rehook, CTA) o di relazioni.
- **Nel kit:** constellation() — nuovo.
- **Clip di riferimento:** `clip/O19_1.mp4`
- **Script che la usano:** —
### 8. D09 · Percentuale al centro di un anello di persone (nuova, frequenza rara)
- **Com'è in Kallaway:** Le persone dell'anello si colorano mentre la percentuale al centro sale.
- **Tempi misurati:** Conteggio 1 s.
- **Quando si usa:** Quote di pubblico, tassi.
- **Nel kit:** Combina O21 + counter().
- **Clip di riferimento:** `clip/D09_1.mp4`
- **Script che la usano:** —
### 9. U06 · Lower third con barra d'accento (nuova, frequenza rara)
- **Com'è in Kallaway:** Nome in maiuscolo monospazio con barra verticale d'accento, testo che si decodifica.
- **Tempi misurati:** 0,25 s.
- **Quando si usa:** Presentare una persona/fonte.
- **Nel kit:** lowerThird() + decode() — nuovo.
- **Clip di riferimento:** `clip/U06_1.mp4`
- **Script che la usano:** —
### 10. C05 · Circuito ad angoli retti (nuova, frequenza rara)
- **Com'è in Kallaway:** Linee a 90° (circuito) che collegano un centro a vari nodi.
- **Tempi misurati:** 0,3 s.
- **Quando si usa:** Sistemi, integrazioni, "tutto collegato".
- **Nel kit:** connector({curve:'circuit'}) — nuovo.
- **Clip di riferimento:** `clip/C05_1.mp4`
- **Script che la usano:** —
### 11. F09 · Mosaico / pixel (nuova, frequenza rara)
- **Com'è in Kallaway:** Immagine a blocchi con sfarfallio di tinta: 'scansione' digitale.
- **Tempi misurati:** Blocchi 20 → 10 px, 3 fotogrammi alternati.
- **Quando si usa:** Raro: identità, dati grezzi, "analizzato".
- **Nel kit:** pixelate() — nuovo (opzionale).
- **Clip di riferimento:** `clip/F09_1.mp4`
- **Script che la usano:** —

## Blocco 5 · nuove dalla revisione dei 150 reel (09/10) → `CATALOGO-ANIMAZIONI/demo-6/`
Richiesta dell'utente: "riguardati i vari reel di Kallaway, magari ti sono sfuggite alcune animazioni". Fatto incrociando
`_analisi/note-visione.md` (150/150 reel) con il catalogo: 21 dispositivi ricorrenti che non avevano una voce (la prima è la
**K17** mappa a ∞, segnalata dall'utente e già fatta nel Blocco 1). Ordine = frequenza in Kallaway + uso nei tuoi script.

| # | Voce | In Kallaway (reel) | Nei tuoi script |
|---|---|---|---|
| 1 | H04 · Angoli di selezione (mirino) che si chiudono su un elemento | 3, 31, 56, 69, 118, 127 | 08/10 riordina la griglia · 13/10 storie in evidenza |
| 2 | T13 · Testo che si corregge: parole barrate e tolte | 31, 72, 76, 103, 108, 142 | 04/10 "non è un curriculum, è un venditore" · 30/09 taglia la frase |
| 3 | O26 · Figura umana 3D col telefono (oggetto vero da Adobe Stock) | 7, 18, 34, 44, 52, 62 | 24/09 davanti alla telecamera · 13/10 arrivano sul profilo |
| 4 | O28 · Blocchi che si impilano in una torre | 5, 90, 92, 147, 150 | 25/09 cinque pezzi di un profilo |
| 5 | L15 · Pila di card: le già viste si impilano | 5, 15, 59, 67, 118 | 27/09 tre tipi di carosello |
| 6 | D10 · Anello di progresso che si riempie | 46, 59, 88, 119 | 05/10 in 60 secondi |
| 7 | D11 · Corsa: curve o barre che salgono a velocità diverse | 65, 67, 82, 94 | 11/09 "e li superi" · 08/09 outlier |
| 8 | O29 · Testa di profilo con il cervello dentro | 48, 55, 62, 134 | 09/10 · 07/10 · 06/09 (emozioni, cervello) |
| 9 | U15 · Timer, conto alla rovescia | 11, 13, 146 | 05/10 · 15/10 · 10/09 · 22/09 · 04/10 |
| 10 | D12 · Scala a gradiente con il cursore | 12, 92, 130 | 11/10 "99% → primo 10%" |
| 11 | U12 · Azioni del reel che si accendono (salva, condividi…) | 22, 119 | 03/10 raddoppi le views · 10/10 viene spinta |
| 12 | D14 · Forma d'onda audio | 36, 114, 127 | 07/09 registra tre volte |
| 13 | U14 · Mirino della fotocamera (angoli, REC) | 144 | 24/09 · 11/10 · 07/09 |
| 14 | O32 · Cartella che si apre a ventaglio | 30, 58, 60 | 02/10 Commenta IDEE |
| 15 | U13 · Commenti o notifiche che si moltiplicano | 89, 123 | i "Commenta X" |
| 16 | O30 · Bivio: la strada si divide in due rami | 62, 79 | 23/09 la finta |
| 17 | F12 · Timbro che cala | 80, 104 | 04/10 · 12/10 |
| 18 | D13 · Termometro verticale che si riempie | 72, 111 | 06/10 dalla base all'ultimo gradino |
| 19 | L16 · Elementi che si riordinano | 69, 116 | 08/10 riordina la griglia |
| 20 | O27 · Amo che aggancia (il hook, oggetto vero) | 76, 100 | ogni "hook" |
| 21 | O31 · Razzo che decolla (oggetto vero) | 45, 59 | 03/10 raddoppi le visualizzazioni |

Miglioramenti di voci già nel kit emersi dalla revisione (vanno nel Blocco 3):
- **L11** percorso a tappe: versione ondulata "a metropolitana" con la pallina che corre e il tratto fatto che si accende, che
  torna tra i capitoli (reel 107, 123, 124, 129, 130, 135: è la mappa del suo "Short-Form Content System").
- **D03** curva: playhead sotto l'asse e curva che si colora segmento per segmento, alone che segue la punta (reel 110, 130).
- **O15** clessidra che si capovolge (reel 60) · **O07** scala con il termometro a fianco (reel 72, vedi D13).

## Da non fare
- **K01** (stacco sulla faccia) e **T12** (parole-chiave del sottotitolo in corsivo): si fanno in montaggio su DaVinci.
- **D08** (gauge semicircolare): bocciato nel reel-01. Al suo posto: D01 o O23.
- **T11** (numero o parola gigante sullo sfondo): bocciato il 09/10 ("non si capisce cosa voglia dire"). Mai come scena a sé.

## Ordine nella chat nuova
0. Fase 0: `confronto_moto.py`.
1. Blocco 1: 7 animazioni → `demo-3` → anteprima aperta all'utente. Si va avanti col blocco dopo mentre lui guarda;
   le sue correzioni si applicano appena arrivano.
2. Blocco 2: 10 animazioni → `demo-4` → anteprima.
3. Blocco 3: a giri per frequenza. Prima le "altissima" e "alta", poi "media", poi "rara". Voti in `voti_kit.json`; demo
   rigenerate e anteprime aperte a ogni giro.
4. Blocco 4: 11 rare → `demo-5` → anteprima.
4b. Blocco 5: 21 nuove dalla revisione → `demo-6` → anteprima.
5. Poi si torna ai reel: render 4K di reel-01 v5 e reel-03 (se l'utente dà l'ok, il render può girare in background
   anche prima), poi 23/09, 24/09, 11/10 e gli altri di `PROSSIMA-SESSIONE.md`.

A ogni blocco chiuso: catalogo rigenerato, `KIT-V2.md` aggiornato, `PROSSIMA-SESSIONE.md` con il punto in cui si è arrivati.
