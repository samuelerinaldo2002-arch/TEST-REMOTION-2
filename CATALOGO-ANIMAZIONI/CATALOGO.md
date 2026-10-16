# Catalogo animazioni Kallaway → brand Samuele

150 animazioni ricavate dai 150 reel di @kallawaymarketing (gen → ott 2026). Ogni voce: com'è, tempi misurati, quando usarla, come si fa nel kit, reel di riferimento (con clip in `clip/`).
Galleria navigabile con le clip: `catalogo.html`. Script di settembre/ottobre categorizzati: `SCRIPT-CATEGORIZZATI.md`.

## Numeri dello stile attuale (giugno → ottobre, 105 reel)

- 12.78 tagli al minuto; grafica 56% del tempo, faccia 29%, light mode 14%.
- Scena grafica: mediana 4.463 s (p25 2.878 – p75 6.712).
- Camera in movimento nel 58% del tempo delle grafiche.
- Arrivo in movimento dopo il taglio nel 17% delle scene: 1410 px/s che frenano in 0.32 s.
- Curve di camera (cubic-bezier misurate): spostamenti (0.3, 0.2, 0.35, 0.9) in 1.314 s · arrivi dopo il taglio (0.2, 0.8, 0.7, 0.95) · drift (0.3, 0.35, 0.55, 0.8).

Legenda stato: **nel kit** (kw-kit v2: kit2-core.js / kit2-oggetti.js, API in KIT-V2.md) · **da rendere identico** (c'è ma va portato ai valori misurati) · **da creare** · **in montaggio** (DaVinci).

## A · Aperture (hook visivi, primi 3 s)

### A01 — Muro o griglia di reel veri con badge views

- **Com'è:** Dal fotogramma 0 una griglia di reel veri (2×3 o un muro che scorre); i badge views verdi poppano uno dopo l'altro mentre il titolo si scrive parola per parola.
- **Tempi:** Badge ogni ~0,08 s · griglia completa entro ~1,2 s · stacco sul volto a ~3 s.
- **Quando:** Hook su formati, tendenze, "cosa funziona", prova sociale. È l'apertura più frequente tra i reel più visti (9 su 30).
- **Nel kit:** reelWall() + viewBadge() + titleW() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 25 (0.0–3.0 s) · reel 84 (0.0–3.0 s) · reel 96 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-8 17,25–23,2 s · demo-2 69,2 s (come scena)

### A02 — Logo o oggetto protagonista già in scena

- **Com'è:** Il fotogramma 0 mostra già l'oggetto del video (logo con raggi, icona, telefono) al centro; il titolo arriva sopra parola per parola; dopo 1–2 s l'oggetto si trasforma (diventa un profilo, un doc, un anello).
- **Tempi:** Oggetto visibile da t=0 · titolo 0,1–1 s · trasformazione a ~1,8 s.
- **Quando:** Video su uno strumento o una piattaforma (Claude, Instagram, Meta). 7 su 30.
- **Nel kit:** appIcon() + rays() già in scena al fotogramma 0, poi il reel che esce e si sdoppia — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 102 (0.0–3.0 s) · reel 66 (0.0–3.0 s) · reel 16 (0.0–3.0 s)
- **Dove vederla nelle demo:** r03 0–3,6 s

### A03 — Documento/copione che si compila

- **Com'è:** Un documento (Video Script) fioco dal fotogramma 0 che in ~1 s si riempie di righe colorate per sezione (Hook, Body, CTA): l'oggetto stesso è il risultato promesso.
- **Tempi:** Righe a cascata ~20 ms l'una · tutto pieno in ~1 s.
- **Quando:** Script su copioni, hook, struttura dei video. 4 su 30 (tra cui 488K e 517K).
- **Nel kit:** scriptDoc() già in scena al taglio, .lay + .section a 0,22 s l'una — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 35 (0.0–3.0 s) · reel 100 (0.0–3.0 s) · reel 64 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-7 16,2–17,6 s

### A04 — Anello o orbita che si apre

- **Com'è:** Reel, loghi o avatar che escono dal centro e si dispongono in cerchio ruotando; al centro nasce il concetto (pill, logo, contatore).
- **Tempi:** Apertura 0,3 s (expo.out) · rotazione lenta · concetto al centro a ~1 s.
- **Quando:** "Tutti i formati", "tutti i social", "i top creator". 3 su 30.
- **Nel kit:** orbit() con le icone che partono dal centro (0,3 s expo.out) + avatar vero al centro — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 101 (0.0–3.0 s) · reel 98 (0.0–3.0 s) · reel 59 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-7 27,4–28,7 s

### A05 — Clip vera che diventa infografica

- **Com'è:** Si parte da uno spezzone vero (persona, situazione) in una card; una linea porta all'oggetto-concetto (cervello con disco rosso, testa in silhouette) e la scena diventa schema.
- **Tempi:** Clip 0–0,8 s · linea + oggetto 0,8–1,5 s · pulse sul concetto.
- **Quando:** Storytelling, psicologia: il reel più visto in assoluto (1,2M) apre così. 2 su 30.
- **Nel kit:** videoCard() + connector() + brain() + pulse() — la clip vera diventa schema — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 79 (0.0–3.0 s) · reel 48 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-7 0–5,6 s

### A06 — Tipografia gigante che diventa oggetto

- **Com'è:** Parole enormi del titolo ("PLAN", "30") che occupano lo schermo e poi si ritirano per lasciare il posto all'oggetto (il calendario).
- **Tempi:** Parole 0–1 s · trasformazione a ~1,2 s.
- **Quando:** Hook con un numero o una promessa forte ("30 giorni in 30 minuti"). 2 su 30 (477K).
- **Nel kit:** bigType(spec).inAt(tempi) · .retract(t, {scale, y}) + calendar(…).assemble(t, {spread}) · .fillVideos — parole giganti che diventano il titolo, il calendario si monta sotto. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 139 (0.0–3.0 s) · reel 150 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-4 0–5,6 s

### A07 — Profilo o UI con numeri che salgono

- **Com'è:** Un profilo/una UI vera già in scena con un numero che cresce (follower, retention) mentre il titolo si scrive.
- **Tempi:** Conteggio ~1 s.
- **Quando:** Risultati, casi studio, "come sono passato da X a Y". 2 su 30.
- **Nel kit:** igInsights(parent, X, Y, {media, views, delta, skip}).count(t, dur) · .curve(t, dur) · .skipOn(t) — Approfondimenti del reel veri con i numeri che salgono. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 110 (0.0–3.0 s) · reel 112 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-4 23,6–28 s

### A08 — Risposta sfocata indicata da una freccia

- **Com'è:** Una freccia punta su un disco/etichetta con la risposta sfocata: si vede che c'è, non si legge. Curiosità pura.
- **Tempi:** Freccia 0,3 s · la risposta resta sfocata fino alla parola.
- **Quando:** Hook a domanda ("il segreto è…"). 1 su 30 (e il reel-01 v4 usa una variante).
- **Nel kit:** listK con le voci sfocate + handArrow/handNote che le indicano — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 36 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-7 34,8–35,6 s

## K · Camera e transizioni

### K01 — Faccia a tutto schermo come stacco

- **Com'è:** Il taglio netto sulla faccia chiude un'idea; la grafica successiva riparte da zero.
- **Tempi:** 12,8 tagli/min nello stile attuale · grafica 56% del tempo (scena mediana 4,5 s, p25 2,9 – p75 6,7) · faccia 29% (mediana 2,9 s) · light mode 15%.
- **Quando:** Fine di ogni punto di una lista, prima di un cambio di sezione, sulle frasi forti dette guardando in camera.
- **Nel kit:** Montaggio in DaVinci (facecam). Nel PIANO di ogni reel si segnano i punti di stacco consigliati. *(in montaggio)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 79 (16.3–18.3 s) · reel 5 (7.1–7.9 s)

### K03 — Spostamento di camera tra due oggetti

- **Com'è:** Pan + zoom che porta l'attenzione dall'oggetto A al B: parte deciso e frena a lungo.
- **Tempi:** Durata mediana 1,31 s (p25 0,83 – p75 2,17) · curva cubic-bezier(0.30, 0.20, 0.35, 0.90): picco di velocità al 20% del tempo, 72% del percorso a metà durata.
- **Quando:** Ogni volta che il discorso passa all'elemento successivo dello stesso schema.
- **Nel kit:** move(t, dur, fx, fy, s) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 79 (9.8–12.2 s) · reel 40 (54.0–60.0 s)
- **Dove vederla nelle demo:** demo-8 6,55 s (dal reel alla card) · demo-2 34–37 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 06/10 Cinque step di un profilo che porta clienti, 23/09 Il ciclo della dipendenza da dopamina

### K04 — Drift continuo (la camera non è mai ferma)

- **Com'è:** Tra un evento e l'altro la camera scivola piano (push-in o pan di pochi px).
- **Tempi:** Camera in movimento nel 59% del tempo delle grafiche (mediana) · drift lenti 2,2/min · durata ~1,4 s · curva cubic-bezier(0.30, 0.35, 0.55, 0.80).
- **Quando:** Sempre, quando nessun altro movimento è in corso da più di ~1 s.
- **Nel kit:** float(t, dur, dx, dy, ds) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 79 (20.5–23.5 s) · reel 123 (9.0–15.0 s)
- **Dove vederla nelle demo:** demo e demo-2, ogni scena

### K02 — Arrivo in movimento dopo il taglio

- **Com'è:** La grafica non parte ferma: entra già in corsa e frena (sembra che la camera stesse viaggiando).
- **Tempi:** 17% delle scene grafiche · velocità iniziale mediana 1.410 px/s · frenata al 10% in 0,32 s (p25 0,13 – p75 0,44) · spostamento ~330 px · curva cubic-bezier(0.2, 0.8, 0.7, 0.95).
- **Quando:** All'inizio di ogni scena grafica che segue la faccia; con più forza sui cambi di sezione.
- **Nel kit:** arrive(t, fx, fy, s, {dx, dy}) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 79 (34.7–36.5 s) · reel 79 (50.9–52.4 s)
- **Dove vederla nelle demo:** demo 5 s · demo-2 ogni scena

### K09 — Uscita seguendo una linea (il titolo resta nel mondo)

- **Com'è:** Una linea esce dall'oggetto e la camera la segue in whip; il titolo vecchio esce insieme al mondo, il nuovo arriva con la scena.
- **Tempi:** Linea che cresce 0,3 s · whip 0,5 s · nuovo titolo parola per parola dopo l'arrivo.
- **Quando:** Hook → primo schema; collegare due schemi che sono causa ed effetto.
- **Nel kit:** lineExit(parent, S, a, b, t, posa, {grow, whip}) — linea con la testa luminosa (0,3 s), poi whip2 che la insegue; i titoli vivono nel mondo (titleW({parent: layer})). — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 13 (1.2–2.5 s) · reel 14 (2.0–2.9 s)
- **Dove vederla nelle demo:** demo-4 19,9–23,6 s · reel-09 31,8 s e 46,9 s

### K13 — Match cut: un punto diventa l'oggetto

- **Com'è:** Tutto sparisce tranne un punto, che cresce e diventa il protagonista della scena nuova (avatar, disco, etichetta).
- **Tempi:** Punto 8–10 px → oggetto in 0,3–0,5 s (expo.out).
- **Quando:** Passaggio da uno schema al 'soggetto' (il tuo profilo, il cliente, il concetto).
- **Nel kit:** punto lime → disco → barra (reel-01) · reelRing al centro — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 46 (5.6–6.3 s) · reel 14 (1.0–1.5 s)
- **Dove vederla nelle demo:** v5 0,5–1,1 s · reel-09 16,1 s (pomo della leva → centro del bersaglio)
- **Nei tuoi script:** 04/10 Il tuo profilo non è un curriculum

### K14 — Una voce della lista diventa l'intestazione

- **Com'è:** Shared element: la voce attiva sale in alto e diventa il titolo della sezione, il resto svanisce.
- **Tempi:** ≈0,25–0,35 s, power3.inOut.
- **Quando:** Ogni volta che si entra in un punto della lista (01 → spiegazione).
- **Nel kit:** listK(...).promote(i, t, x, y, s) · sectionBar → intestazione HUD — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 39 (57.3–57.9 s) · reel 5 (13.5–15.5 s)
- **Dove vederla nelle demo:** demo-8 4,75 s · demo 10,2 s · v5 4,05 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 04/10 Il tuo profilo non è un curriculum

### K16 — Push-in lento su un oggetto che si costruisce

- **Com'è:** Mentre il documento/schema si riempie, la camera si avvicina piano.
- **Tempi:** +8–15% in 1–1,5 s, sine.inOut.
- **Quando:** Documenti, tabelle, schemi che si compilano mentre parla.
- **Nel kit:** camK(t, 1.6, fx, fy, s · 1.1, "sine.inOut") mentre l'oggetto si costruisce — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 35 (0.3–2.2 s) · reel 26 (3.5–6.0 s)
- **Dove vederla nelle demo:** demo-7 16,25–17,85 s · demo-4 44,65 s
- **Nei tuoi script:** 15/10 30 giorni di contenuti in 30 secondi

### K05 — Whip pan con motion blur

- **Com'è:** Spostamento velocissimo (>3.000 px/s) con scia di movimento: si 'vola' alla scena successiva.
- **Tempi:** 0,65 per minuto · durata 0,4–0,6 s · sfocatura direzionale nei fotogrammi centrali.
- **Quando:** Cambio di sezione dentro lo stesso mondo (lista → schema, schema → prova), spesso seguendo una linea.
- **Nel kit:** whip2(t, dur, fx, fy, s) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 14 (2.0–2.9 s) · reel 13 (1.4–2.1 s)
- **Dove vederla nelle demo:** demo-2 66,4 s · 72 s

### K07 — Zoom-through (si passa 'attraverso' la scena)

- **Com'è:** 1–2 fotogrammi di sfocatura da zoom su tutto, e dall'altra parte c'è un oggetto nuovo.
- **Tempi:** ≈0,1–0,15 s di blur; l'oggetto nuovo arriva leggermente ruotato e si assesta in 0,3 s.
- **Quando:** Quando una lista o una domanda si 'trasforma' nella sua risposta visiva.
- **Nel kit:** zoomThrough(t, fx, fy, s) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 50 (19.0–19.6 s)
- **Dove vederla nelle demo:** demo 28 s · reel-09 16 s e 56,7 s
- **Nei tuoi script:** 10/09 Metodo 6 × 5 (30 giorni in 30 minuti)

### K10 — Messa a fuoco d'apertura (rack focus)

- **Com'è:** La scena nasce fuori fuoco e va a fuoco mentre compare il titolo.
- **Tempi:** Blur ~10 px → 0 in 0,3–0,5 s.
- **Quando:** Prima inquadratura del reel o di una sezione importante.
- **Nel kit:** rackFocus(t, dur) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 49 (0.0–0.6 s)
- **Dove vederla nelle demo:** demo 0 s
- **Nei tuoi script:** 11/10 Non è la fotocamera, è la luce (scala 99% → 10%)

### K11 — Scroll 'slot machine' di un muro di miniature

- **Com'è:** Il muro scorre in verticale velocissimo con motion blur e frena fino a fermarsi su una selezione.
- **Tempi:** Zoom out 0,2 s → scroll 0,4 s con scia → frenata 0,3 s → riflettore sulla selezione.
- **Quando:** "Ho analizzato migliaia di video...", "tra tutti i contenuti..." (ricerca, selezione).
- **Nel kit:** wallScroll(parent, cx, top, {cols, rows}).open(t, r0, r1) · .roll(t, r0, r1) · .spot(t, celle) · .pick(t, celle, idVideo, {views}) — muro di reel veri (atlante assets/atlas/muro.jpg da _tools/atlante.py) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 61 (9.3–11.9 s) · reel 90 (2.0–4.0 s)
- **Dove vederla nelle demo:** demo-3 0–5,4 s · reel-09 9,8–11 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 08/09 Non inventare le idee: trova gli outlier, 14/10 Se non diventi virale… e se si sbagliassero?

### K12 — Nastro trasportatore

- **Com'è:** Una fila di card scorre a velocità costante mentre lui le elenca una per una.
- **Tempi:** ~120 px/s costanti per tutta la sezione (10+ s); ogni card entra quando viene nominata.
- **Quando:** Elenchi lunghi (più di 5 voci) o una progressione nel tempo.
- **Nel kit:** conveyor(parent, x0, y, cards, {w, h, speed, timeline}).run(t0, t1) · .on(i, t) — copertine vere, pillole appese alla linea del tempo, ogni card si accende quando è detta. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 32 (30.0–41.0 s) · reel 25 (51.0–58.0 s)
- **Dove vederla nelle demo:** demo-4 33–39 s

### K06 — Punch-in sulla parola chiave

- **Com'è:** Zoom rapido di +8–20% su una parola o un numero.
- **Tempi:** Raro: 0,12/min · ≤0,35 s · power4.out.
- **Quando:** Solo sui 1–2 colpi veri del reel (il numero finale, il nome del framework).
- **Nel kit:** camK(t, dur, fx, fy, s * 1.12, 'power4.out') sul colpo — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 79 (12.6–13.6 s)
- **Dove vederla nelle demo:** v5 17,62 s ("Punto.")
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto

### K08 — La camera segue un oggetto che cade/vola

- **Com'è:** Un oggetto fisico (sasso, pallina, card) fa da ponte: la camera lo insegue fino al mondo successivo.
- **Tempi:** Inseguimento ~0,5 s · l'oggetto accelera (power2.in) e la camera lo aggancia in frenata.
- **Quando:** Quando una causa produce un effetto ("un like... e succede questo").
- **Nel kit:** fallFollow(nodo, t, x0, y0, x1, y1, posa, {dur: 0.55}) + pebble(parent, x, y, d, icona) — l'oggetto accelera (power2.in) e la camera lo insegue con la stessa curva, poi frena 0,35 s all'impatto. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 65 (20.2–21.6 s)
- **Dove vederla nelle demo:** demo-5 0,8–2,6 s

### K15 — Light leak / flash (era podcast)

- **Com'è:** Lama di luce arancio diagonale + 1 fotogramma quasi bianco sul cambio d'inquadratura.
- **Tempi:** ≈0,25 s. Frequente a febbraio (1,7/min), quasi assente nello stile attuale (0,05/min).
- **Quando:** Solo su un cambio forte, al massimo una volta per reel.
- **Nel kit:** lightLeak(t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 149 (3.2–3.7 s)
- **Dove vederla nelle demo:** demo 33,5 s

### K17 — Mappa a loop: la camera viaggia lungo il simbolo da una tappa all'altra

- **Com'è:** Il simbolo (∞ al neon con le molecole dentro) è la mappa del reel: le tappe numerate stanno attorno ai lobi. A ogni capitolo la camera parte stretta sull'etichetta precedente e attraversa il simbolo lungo il tubo fino alla tappa nuova; oppure dalla mappa intera si tuffa sulla tappa. Il numero compare grigio e diventa bianco, il nome si accende sulla parola.
- **Tempi:** Viaggio ~1,3 s: parte deciso dopo il taglio e frena a lungo (curva come K02, camera misurata 1,0 s fino al 15%); tuffo dalla mappa ~1,1 s; numero +0,2 s, nome sulla parola detta.
- **Quando:** Cicli e processi a tappe (il ciclo della dopamina, il loop del reel, le fasi di una strategia): un capitolo per tappa.
- **Nel kit:** loopMap(parent, cx, cy, nomi).go(i, t) · .name(i, tempi) · .overview(t) · .dive(i, t) — pathCam() lungo il tubo, neonPath({molecole}).glintTo() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 79 (34.6–36.6 s) · reel 79 (50.9–52.4 s)
- **Dove vederla nelle demo:** demo-3 36,4–44 s
- **Nei tuoi script:** 23/09 Il ciclo della dipendenza da dopamina

### K18 — L'oblò: la camera entra in un cerchio e ne esce

- **Com'è:** Nuova, nello stile di K07 (zoom-through) + K13 (match cut: un punto diventa l'oggetto): la camera corre dentro un cerchio del mondo (una storia in evidenza, una foto profilo, un tasto) con lo zoom esponenziale; al taglio, dall'altra parte, la stanza dietro il cerchio mostra un'iride con lo stesso posto e la stessa misura sullo schermo, che si apre con la cornice d'acciaio dell'oblò mentre la copertina si dissolve nella storia vera. L'uscita è lo stesso gesto al contrario: la storia si richiude nel cerchio e la camera esce all'indietro sul profilo.
- **Tempi:** Corsa nel cerchio 0,42 s (scala power2.in, posizione power2.out) · sfocatura 5 px negli ultimi 0,19 s · iride 0,42 s · assestamento 0,45 s (power2.out; più secchi dopo il confronto con i reel 50 e 46) · uscita: iride che si chiude 0,4 s e ritorno 0,6 s.
- **Quando:** Entrare in un'interfaccia o in un oggetto e tornare indietro: storie in evidenza, profili, DM, un reel dentro un altro; una grammatica di profondità per tutto un reel.
- **Nel kit:** obloInR13(t, {x, y, d}, {el, x, y, pose}, {pre, D, cover}) · obloOutR13(t, room, c, {pose, cover}) · zoomR13(t, dur, px, py, s1, {ease, easePos}) — la camera entra in un cerchio (evidenza, foto profilo, tasto) e dall'altra parte c'è la storia vera; l'uscita al contrario. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 50 (19.0–19.6 s) · reel 46 (5.6–6.3 s) · reel 14 (1.0–1.5 s)
- **Dove vederla nelle demo:** reel-13 1,07–2 s · 8,6–9,6 s · 12,05–13,05 s · 14,5–15,5 s · 43,6–44,5 s

## T · Titoli e testo

### T01 — Titolo parola per parola, sincronizzato alla voce

- **Com'è:** Ogni parola compare nell'istante in cui viene detta: grigia e sfocata → bianca e nitida.
- **Tempi:** Unità = parola · stato iniziale grigio ~58%, blur 8–10 px, y +5 px · 0,17–0,21 s ease-out · i corsivi più grandi partono da blur ~12 px.
- **Quando:** Sempre: titolo dell'hook e titoli di sezione.
- **Nel kit:** titleW({lines}).inAt([tempi parole]) + at('parola') — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 79 (0.0–0.8 s) · reel 1 (0.1–0.6 s)
- **Dove vederla nelle demo:** demo 0–1,3 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 06/10 Cinque step di un profilo che porta clienti, 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 23/09 Il ciclo della dipendenza da dopamina

### T02 — Box evidenziatore che cresce insieme alle parole

- **Com'è:** Prima un cursore verticale sottile, poi il box si allarga da sinistra seguendo le parole che compaiono.
- **Tempi:** Cursore ~6 px · crescita ≈0,4 s legata alle parole · dietro il bordo testo bianco, davanti grigio/sfocato.
- **Quando:** Parola-chiave del titolo (il problema, il risultato, il nome del metodo).
- **Nel kit:** titleW: segmento {box:true} — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 1 (0.1–0.6 s) · reel 7 (5.1–5.6 s)
- **Dove vederla nelle demo:** demo 0–1,3 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto

### T07 — Sottolineatura d'accento che cresce

- **Com'è:** Linea sottile del colore d'accento che si allunga sotto la seconda riga del titolo seguendo il testo.
- **Tempi:** Spessore 3–4 px · cresce con le parole.
- **Quando:** Titoli senza box (alternativa più leggera al box).
- **Nel kit:** titleW: segmento {hand: true, ul: true} — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 14 (0.4–1.0 s) · reel 56 (0.2–0.6 s)
- **Dove vederla nelle demo:** demo-7 16,6–17 s

### T08 — Uscita del titolo: diventa grigio e se ne va

- **Com'è:** Prima del cambio scena il titolo si spegne (bianco → grigio) e poi sparisce; il box si ritira.
- **Tempi:** Grigio in ≈0,15 s, poi uscita 0,25 s.
- **Quando:** Fine sezione.
- **Nel kit:** titleW(...).outAt(t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 5 (35.2–35.5 s)
- **Dove vederla nelle demo:** demo 4,6 s

### T12 — Parole-chiave del sottotitolo in corsivo

- **Com'è:** Nei sottotitoli (parola singola, bianco, ombra morbida, nessuna animazione) le parole importanti passano in serif corsivo.
- **Tempi:** Cambio secco a ogni parola.
- **Quando:** Nome del framework, parola su cui cade l'accento.
- **Nel kit:** In post (DaVinci): per il brand Patrick Hand lime sulle parole-chiave. *(in montaggio)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 110 (3.0–4.0 s) · reel 79 (0.9–1.7 s)

### T03 — Box già disegnato + testo a macchina da scrivere

- **Com'è:** Il box è già lungo e il testo (corsivo) si scrive lettera per lettera dentro.
- **Tempi:** ≈35–40 caratteri/s.
- **Quando:** Titoli di sezione brevi, ripresa del titolo in un formato compatto.
- **Nel kit:** typeIn(node, testo, t, cps, {caret}) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 35 (3.0–3.6 s) · reel 46 (6.0–6.8 s)
- **Dove vederla nelle demo:** demo 17,85 s (nodo della mappa)

### T04 — Lettere che compaiono in ordine casuale

- **Com'è:** Etichette e sottotitoli corsivi si 'materializzano' lettera per lettera in ordine sparso.
- **Tempi:** ≈0,2–0,3 s per parola; ogni lettera opacità 0→1 in 1–2 fotogrammi.
- **Quando:** Etichette di oggetti 3D, nomi di livelli, didascalie in corsivo.
- **Nel kit:** scrambleIn(node, testo, t, dur) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 16 (60.0–62.6 s) · reel 97 (7.3–7.8 s)
- **Dove vederla nelle demo:** demo 18,8 s (sotto-nicchie)

### T06 — Etichetta a macchina da scrivere

- **Com'è:** Il nome del livello/passo si scrive lettera per lettera mentre lo dice.
- **Tempi:** ~10 lettere/s, maiuscolo bold.
- **Quando:** Nomi dei livelli di una scala o dei passi di un metodo.
- **Nel kit:** typeIn() (usato da ladder) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 109 (12.0–13.0 s)
- **Dove vederla nelle demo:** demo-2 34 s
- **Nei tuoi script:** 06/10 Cinque step di un profilo che porta clienti

### T09 — Una parola del titolo viene sostituita

- **Com'è:** Il titolo resta, cambia solo una parola (si riscrive a macchina).
- **Tempi:** ≈0,3 s.
- **Quando:** Stesso schema, concetto che evolve ("Funnel" → "Progression", Primo → Secondo livello).
- **Nel kit:** swapWord(T, i, testo, t) — la parola si cancella e si riscrive a macchina (1/40 s a lettera), il resto del titolo resta. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 46 (10.4–11.4 s) · reel 4 (12.0–13.0 s)
- **Dove vederla nelle demo:** demo-4 12,6–17,4 s · reel-09 18,6–22 s

### T10 — Il titolo si riorganizza (compatto)

- **Com'è:** Da 2 righe grandi a 1 riga piccola in alto (dentro un box), per lasciare spazio allo schema.
- **Tempi:** ≈0,3–0,4 s.
- **Quando:** Quando dopo l'hook serve tutta l'area per la grafica.
- **Nel kit:** compactTitle(T, t, righe, {size, top}) — il titolo grande sale e sparisce, quello compatto si scrive in un box di vetro col bordo lime. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 26 (3.3–3.9 s)
- **Dove vederla nelle demo:** demo-4 6,75 s

### T13 — Testo che si corregge: parole barrate e tolte

- **Com'è:** Una frase scritta (hook, didascalia) viene corretta davanti a chi guarda: una parola si barra con un tratto rosso, le parole inutili e la punteggiatura spariscono e la frase si ricompatta; a volte la parola giusta prende il posto di quella barrata.
- **Tempi:** Tratto che barra ~0,2 s · la parola tolta svanisce e la riga si richiude ~0,3 s · una parola alla volta, sul parlato.
- **Quando:** Riscrivere un hook o una frase, un errore da togliere ("non è un curriculum, è un venditore", "taglia la frase e sposta la prima metà").
- **Nel kit:** strikeLines(parent, x, y, righe, {fs, w, lh}).strike(i, t) · .remove(i, t) · .add(t, testo, {color}) · .strikeR(r, t) · .removeR(r, t) — riga lime sopra le parole, la riga si chiude, quella giusta si scrive. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 31 (55.0–65.5 s) · reel 72 (91.0–96.5 s) · reel 142 (35.0–38.5 s)
- **Dove vederla nelle demo:** demo-6 6,55–9 s (la bio del tuo profilo vero, con la camera che entra)
- **Nei tuoi script:** 04/10 Il tuo profilo non è un curriculum, 30/09 Mai chiudere con "seguimi": il loop

### T05 — Testo che si decodifica (glitch)

- **Com'è:** Le lettere cambiano a caso per qualche fotogramma e si fermano sulla parola giusta.
- **Tempi:** ≈0,25 s, una sostituzione ogni 1–2 fotogrammi, font monospazio.
- **Quando:** Nomi, lower third, etichette 'tecniche' (codice, <algoritmo/>, dati).
- **Nel kit:** decode(node, testo, t, dur) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 149 (3.5–3.9 s)
- **Dove vederla nelle demo:** demo 20,55 s (risultato)
- **Nei tuoi script:** 10/10 Come funziona l'algoritmo delle storie, 14/10 Se non diventi virale… e se si sbagliassero?

### T11 — Numero o parola gigante sullo sfondo

- **Com'è:** Testo enorme, grigio scuro e trasparente, dietro l'oggetto; spesso conta. In Kallaway compare solo dietro un oggetto-metafora che lo spiega (reel 56: '100x' dietro il logo con le braccia).
- **Tempi:** Altezza ~1,5–2× l'oggetto · opacità ~15–25%.
- **Quando:** DA EVITARE (feedback 09/10: 'questo numero grande non si capisce cosa voglia dire'). Mai come scena a sé: i numeri vanno dentro un'infografica (D01 card dati, D07 formula, O23 100 puntini).
- **Nel kit:** bigBack() esiste nel kit ma non va usato da solo. *(da evitare)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 56 (1.2–2.2 s)
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 06/09 Le storie: +27% views, +31% condivisioni, 11/09 Il 95% ignora l'ordine, 22/09 360 contenuti in 60 minuti

## L · Liste e strutture

### L01 — Lista con voci-segnaposto sfocate

- **Com'è:** Tutte le voci sono già lì, sfocate; la lista si ri-centra quando ne arriva una nuova e sale piano.
- **Tempi:** Barre scure arrotondate, accento sul bordo sinistro ~6 px, numero bold · testo blur ~6 px · ri-centratura 0,3 s.
- **Quando:** Ogni elenco numerato annunciato all'inizio ("tre emozioni", "cinque impostazioni").
- **Nel kit:** listK(parent, cx, cy, w, voci).show(k, t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 5 (9.0–12.5 s) · reel 7 (5.0–7.0 s)
- **Dove vederla nelle demo:** demo-8 0–4 s (presente dal fotogramma 0) · demo 5–9 s
- **Nei tuoi script:** 04/10 Il tuo profilo non è un curriculum, 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 07/09 Registra tre volte, 07/10 Tre emozioni che tengono davanti al video, 09/10 Nessuno compra per le informazioni, 12/10 I contenuti non sono pubblicità (8 danno, 2 chiedono), 13/10 Le storie in evidenza, 21/09 Tre tipi di contenuto per follower veri, 25/09 Cinque pezzi di un profilo che porta clienti, 27/09 Tre tipi di carosello, 28/09 Tre tipi di contenuto: pubblico, marchio, vendita, 29/09 Gli unici quattro tipi di contenuto

### L02 — Una voce si risolve con uno sheen

- **Com'è:** Una banda di luce diagonale attraversa la barra da destra a sinistra e il testo va a fuoco al suo passaggio.
- **Tempi:** Banda ~40 px a ~20° · 0,75–0,8 s · poi barra attiva: fondo più chiaro, bordo bianco sottile, scala +3%.
- **Quando:** Quando nomina il punto della lista.
- **Nel kit:** listK(...).resolve(i, t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 5 (10.7–11.6 s) · reel 5 (34.0–35.0 s)
- **Dove vederla nelle demo:** demo-8 1,5–4,7 s · demo 6,8 s · 8,4 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 04/10 Il tuo profilo non è un curriculum, 07/09 Registra tre volte, 07/10 Tre emozioni che tengono davanti al video, 09/10 Nessuno compra per le informazioni, 12/10 I contenuti non sono pubblicità (8 danno, 2 chiedono), 13/10 Le storie in evidenza, 21/09 Tre tipi di contenuto per follower veri, 27/09 Tre tipi di carosello, 29/09 Gli unici quattro tipi di contenuto

### L09 — Albero / flowchart che cresce

- **Com'è:** Un nodo in alto, linee sottili che si disegnano verso i figli, che compaiono sfocati → nitidi.
- **Tempi:** Linee 0,3–0,5 s · nodi 0,25 s sfalsati.
- **Quando:** Categorie e sotto-categorie (nicchia → sotto-nicchie), cause → effetti.
- **Nel kit:** flowTree(parent, S, cx, y0, livelli, {dy, w, fs, h}).grow(l, t, {step}) · .light(l, i, t) · .rowRect(a, b) — albero a righe di pill con linee morbide, la camera scende con la crescita (reel 3); tree(S, p, figli) = solo le linee — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 3 (21.0–27.0 s) · reel 23 (9.0–14.0 s) · reel 68 (23.0–30.0 s)
- **Dove vederla nelle demo:** demo-8 29,2–36,2 s (5 × 10 × 7 = 350 idee) · demo 18,45 s (mappa delle sotto-nicchie)
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 15/10 30 giorni di contenuti in 30 secondi, 22/09 360 contenuti in 60 minuti

### L10 — Parentesi che raggruppa

- **Com'è:** Una parentesi (graffa o quadra) abbraccia un gruppo e porta a un'etichetta.
- **Tempi:** Si disegna in 0,3 s.
- **Quando:** "Questi tre sono...", raggruppare righe di un documento.
- **Nel kit:** bracket(S, x, y0, y1, lato).draw(t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 26 (20.0–23.0 s) · reel 31 (93.0–98.0 s) · reel 132 (34.0–37.0 s)
- **Dove vederla nelle demo:** demo-2 68,2 s
- **Nei tuoi script:** 07/09 Registra tre volte

### L11 — Catena di passi / percorso a tappe

- **Com'è:** Tappe collegate da una linea (dritta, a zig-zag o ondulata) che si disegna; la tappa attiva si accende.
- **Tempi:** Linea 0,4 s per tratto · pallino che percorre la linea.
- **Quando:** Procedure (salva → duplica → pubblica), metodi in N passi, "il mio sistema".
- **Nel kit:** metroPath(…).show · .go — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 14 (35.0–40.0 s) · reel 107 (6.0–15.0 s) · reel 124 (78.0–84.0 s)
- **Dove vederla nelle demo:** demo-2 30,15–32,5 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 09/09 Pubblichi il reel una volta sola, 16/10 Il trucco dei reel di prova (rifatto), 30/09 Mai chiudere con "seguimi": il loop

### L12 — Documento "Video Script" che si costruisce

- **Com'è:** Card-documento con righe grigie che si colorano a sezioni (Hook, corpo, CTA) con legenda a quadratini.
- **Tempi:** Righe che si allungano a cascata ~20 ms l'una · evidenziatore 0,3 s per riga · bordo luminoso.
- **Quando:** Script, struttura di un video, copioni, "hook, spiega, mostra, insegna".
- **Nel kit:** scriptDoc(parent, cx, cy, sezioni).lay / .section / .focus — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 35 (0.0–3.9 s) · reel 26 (3.5–6.2 s) · reel 4 (28.0–40.0 s)
- **Dove vederla nelle demo:** demo-2 48 s
- **Nei tuoi script:** 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 15/10 30 giorni di contenuti in 30 secondi

### L14 — Griglia di esempi con etichette

- **Com'è:** 2×2 o 2×3 reel veri con etichetta sopra e badge views sotto.
- **Tempi:** Card che entrano a gruppi sfocato → nitido.
- **Quando:** Esempi concreti di un formato, prova sociale.
- **Nel kit:** reelWall(parent, cx, cy, idVideo, {heads, views}).show(t) — contenitore pieno (reelGrid() = versione libera) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 8 (38.0–41.0 s) · reel 120 (13.0–22.0 s)
- **Dove vederla nelle demo:** demo-8 17,25–23,2 s (con la riga del creator sopra) · demo-2 69,2–72 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 08/10 Riordina la griglia prima di mandare gente sul profilo, 13/10 Le storie in evidenza, 21/09 Tre tipi di contenuto per follower veri, 27/09 Tre tipi di carosello, 29/09 Gli unici quattro tipi di contenuto

### L03 — La lista si accende a cascata

- **Com'è:** Appena arrivata, un riflesso bianco scende sulle barre una dopo l'altra.
- **Tempi:** ~80 ms tra una barra e l'altra.
- **Quando:** Arrivo della lista dopo un whip.
- **Nel kit:** listK(...).cascade(t, 0.08) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 13 (2.5–3.0 s)
- **Dove vederla nelle demo:** demo-7 33,2 s

### L04 — Checklist con spunte

- **Com'è:** Righe con casella; le spunte arrivano una alla volta (oppure tutte spuntate come domanda di verifica).
- **Tempi:** Spunta 0,15 s per riga.
- **Quando:** Domande di controllo, requisiti, "chiediti se...".
- **Nel kit:** checklist(...).show / .tick(i, t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 50 (14.0–18.6 s) · reel 82 (66.0–73.0 s)
- **Dove vederla nelle demo:** demo-2 28 s
- **Nei tuoi script:** 04/10 Il tuo profilo non è un curriculum, 08/09 Non inventare le idee: trova gli outlier

### L05 — Lista con lucchetti che si sbloccano

- **Com'è:** Ogni voce completata diventa verde con lucchetto aperto.
- **Tempi:** Cambio stato secco + piccolo pop.
- **Quando:** Percorsi/metodi in cui si 'sblocca' un passo alla volta.
- **Nel kit:** listK(…, {locks: true}).unlock(i, t) — barra lime piena, lucchetto aperto — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 61 (32.0–35.0 s) · reel 96 (34.0–38.0 s)
- **Dove vederla nelle demo:** demo-3 31,6–36,4 s
- **Nei tuoi script:** 25/09 Cinque pezzi di un profilo che porta clienti

### L08 — Tabella che si compila

- **Com'è:** Righe e colonne che si riempiono cella per cella (spesso con evidenziazione colorata).
- **Tempi:** ~0,1–0,2 s per cella.
- **Quando:** Matrici (argomenti × formati), confronti, valutazioni.
- **Nel kit:** table(parent, cx, cy, colonne, righe).show · .heads · .rowHead · .fill(t, {step}) · .lime · .pill — caselle tratteggiate da riempire — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 64 (33.0–37.0 s) · reel 68 (63.0–74.0 s) · reel 98 (37.0–45.0 s)
- **Dove vederla nelle demo:** demo-3 10,6–16,4 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 10/09 Metodo 6 × 5 (30 giorni in 30 minuti)

### L13 — Confronto a due colonne

- **Com'è:** Due intestazioni (es. sbagliato | giusto) e card affiancate che arrivano voce per voce.
- **Tempi:** Slide orizzontale tra un punto e l'altro.
- **Quando:** A vs B, prima/dopo, chi vince/chi perde.
- **Nel kit:** versusCards(parent, cx, top, A, B).show / .verdict — card piene con reel veri, badge e righe ✗/✓ (versus() = versione a sole righe) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 29 (5.0–20.0 s) · reel 123 (28.0–30.0 s)
- **Dove vederla nelle demo:** demo-2 64–66,4 s
- **Nei tuoi script:** 04/09 La pubblicità fatta per tutti, 05/09 Storie, caroselli e reel non sono uguali, 12/10 I contenuti non sono pubblicità (8 danno, 2 chiedono), 24/09 Odi metterti davanti alla telecamera

### L15 — Pila di card: le già viste si impilano

- **Com'è:** Le card (profili, esempi, categorie) arrivano una alla volta al centro; quella precedente rimpicciolisce e va in una pila in un angolo (o le card si impilano in 3D una sull'altra), così si vede quante ne sono passate.
- **Tempi:** Card nuova ~0,4 s; la precedente vola nella pila in ~0,35 s (power3.inOut) con un leggero sfasamento in profondità.
- **Quando:** Esempi in sequenza (tre tipi di carosello, casi studio, profili d'esempio), un elenco lungo senza perdere il filo.
- **Nel kit:** stackAway(nodo, t, x, y, i, {scale}) — la card vista va nella pila in un angolo; in demo-6 la variante del reel 15: la card vista va nella fila sotto il titolo e alla fine le tre si aprono a ventaglio. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 15 (35.0–53.0 s) · reel 59 (7.0–10.0 s) · reel 118 (65.0–68.0 s)
- **Dove vederla nelle demo:** demo-6 16,6–22 s
- **Nei tuoi script:** 27/09 Tre tipi di carosello

### L06 — Indice fisso in un angolo

- **Com'è:** Mini-lista delle sezioni in alto a sinistra per tutto il reel, con la sezione corrente evidenziata.
- **Tempi:** Sempre visibile, cambio evidenziazione 0,2 s.
- **Quando:** Reel lunghi con molte sezioni (strumenti, elenchi di 6+).
- **Nel kit:** sideIndex(voci, {x, top, w, fs}).show(t) · .go(i, t) — indice fisso nell'HUD, la voce corrente in una pill lime (0,2 s). — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 58 (7.0–11.0 s) · reel 140 (7.0–12.0 s)
- **Dove vederla nelle demo:** demo-5 6,2–11,9 s

### L07 — Tier list

- **Com'è:** Righe S/A/B/C colorate; gli elementi cadono nella riga giusta.
- **Tempi:** Ogni elemento scende riga per riga ~0,15 s per riga.
- **Quando:** Classifiche ("dal peggiore al migliore").
- **Nel kit:** tierList(parent, cx, top, ["S", "A", "B", "C"], {w, rh, slot}).show(t) · .drop(nodo, riga, t) — gli elementi cadono attraversando le righe (~0,15 s a riga). — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 131 (6.0–11.0 s) · reel 8 (77.0–88.0 s)
- **Dove vederla nelle demo:** demo-5 17–22,4 s

### L16 — Elementi che si riordinano (la griglia si rimescola)

- **Com'è:** Barre di una lista o celle di una griglia si scambiano di posto con un movimento a S: quella scelta si stacca (cornice e bagliore), le altre scorrono per fare spazio e l'ordine nuovo si assesta.
- **Tempi:** Scambio ~0,5 s (power3.inOut) con un piccolo sollevamento dell'elemento che si sposta.
- **Quando:** Riordinare la griglia del profilo, priorità che cambiano, "prima questo, poi quello".
- **Nel kit:** swapPlaces(a, b, t, {dur, arco, lift}) — un elemento alla volta (reel 69): quello scelto si stacca col bordo lime e fa una S fino al posto dell'altro, che scivola al suo; reorder(nodi, posti, ordine, t) per riordinare tutto insieme. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 69 (11.0–13.5 s) · reel 116 (60.0–67.0 s)
- **Dove vederla nelle demo:** demo-6 1,55–3,5 s
- **Nei tuoi script:** 08/10 Riordina la griglia prima di mandare gente sul profilo

## O · Oggetti-metafora

### O01 — Anello di reel che ruota

- **Com'è:** 6–7 card piccole partono raggruppate e si aprono in cerchio su un tratteggio, ruotando lente.
- **Tempi:** Card ~120×200 px · apertura da r 60 → 370 px in 0,3 s (ease-out forte) · rotazione 20–25°/s · card sempre dritte.
- **Quando:** Hook su "i contenuti", "i formati", "i creator" (un insieme di video).
- **Nel kit:** reelRing(parent, cx, cy, idVideo, {r, w}).open(t) · .spin(t, dur, 22) · .defocus / .refocus · .fling(t) ("di tutto") · .close(t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 14 (0.0–2.0 s) · reel 13 (0.0–1.4 s)
- **Dove vederla nelle demo:** demo 1,35–5 s · v5 0–4,4 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto

### O03 — Hub con loghi collegati

- **Com'è:** Loghi delle piattaforme sopra, curve che convergono su un nodo centrale.
- **Tempi:** Curve 0,4 s sfalsate, pallini che viaggiano.
- **Quando:** Strumenti, piattaforme, sorgenti di dati.
- **Nel kit:** chip(parent, cx, cy, tipo, nome) + connector() + flowLine() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 6 (4.0–6.0 s) · reel 41 (35.0–42.0 s)
- **Dove vederla nelle demo:** demo-2 62,5–64 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 10/10 Come funziona l'algoritmo delle storie, 25/09 Cinque pezzi di un profilo che porta clienti

### O05 — Piramide a livelli con bandiere

- **Com'è:** Piramide 3D che si costruisce dal basso: ogni livello ha due facce (sinistra in luce, destra in ombra) staccate da una fessura; nasce in grafite e il livello detto si accende di lime; etichette in vetro su una linea guida col pallino.
- **Tempi:** Livelli 0,2 s l'uno · bandiere che si risolvono sulla parola · alone dell'accento forte.
- **Quando:** Gerarchie, livelli di difficoltà, "sei nel primo X%".
- **Nel kit:** pyramid(parent, S, cx, base, etichette, {side, labelsR}).build / .flag(i, t) — 3D a due facce, grafite → lime; labelsR = pill del valore a destra di ogni livello (reel 4), il livello più alto lime — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 4 (0.0–5.0 s) · reel 23 (5.0–9.0 s) · reel 29 (56.0–59.0 s)
- **Dove vederla nelle demo:** demo-8 23,2–29,2 s (4 livelli, etichette sui due lati) · demo-2 54–56,7 s
- **Nei tuoi script:** 11/10 Non è la fotocamera, è la luce (scala 99% → 10%)

### O13 — Cervello luminoso

- **Com'è:** Cervello 3D grigio che si accende (rosso/verde) quando 'scatta' qualcosa.
- **Tempi:** Accensione 0,2 s + pulse.
- **Quando:** Psicologia, dopamina, attenzione, memoria.
- **Nel kit:** brain(parent, cx, cy, size).on / .spark · .accendi / .disco / .strobo / .spegni (battito misurato su Kallaway 48, 79, 62) — cervello a raggi X vero (Adobe Stock 318556173 → assets/obj/cervello*.png, _tools/oggetto_da_stock.py) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 79 (0.9–2.2 s) · reel 22 (47.0–55.0 s) · reel 34 (15.0–20.0 s)
- **Dove vederla nelle demo:** demo-2 20–23,5 s · demo-oggetti 0–4 s · reel-09 0–7 s
- **Nei tuoi script:** 06/09 Le storie: +27% views, +31% condivisioni, 07/10 Tre emozioni che tengono davanti al video, 09/10 Nessuno compra per le informazioni, 14/10 Se non diventi virale… e se si sbagliassero?, 23/09 Il ciclo della dipendenza da dopamina

### O21 — Anelli orbitali di persone

- **Com'è:** Avatar al centro, anelli di puntini-persona che si popolano e cambiano colore.
- **Tempi:** Puntini a gruppi · cambio colore a onda.
- **Quando:** Pubblico, chi ti segue, chi se ne va.
- **Nel kit:** peopleRings(parent, cx, cy, anelli, {user | media}).show(t, {daLontano, colore}) · .spin · .recolor · .leave · .count — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 44 (7.0–9.0 s) · reel 5 (16.0–18.0 s)
- **Dove vederla nelle demo:** v5 10,75–12,75 s · r03 22,8–31 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 03/10 Il trucco dei reel di prova, 05/09 Storie, caroselli e reel non sono uguali, 09/09 Pubblichi il reel una volta sola, 10/10 Come funziona l'algoritmo delle storie, 16/10 Il trucco dei reel di prova (rifatto)

### O25 — Telefono / tablet / lavagna come schermo

- **Com'è:** Dispositivo con UI vera dentro; la camera ci entra o lo segue.
- **Tempi:** Ingresso 0,4–0,6 s.
- **Quando:** Esempi, app, database, risultati.
- **Nel kit:** whiteboard(parent, cx, cy, voci).show · .panel(i, t) · .panelRect(i) (lavagna bianca vera) · tablet(parent, X, Y, {w, h}).screen · .at(x, y) · igPhone() — dispositivi con UI e reel veri. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 74 (0.0–10.0 s) · reel 20 (8.0–18.0 s)
- **Dove vederla nelle demo:** demo-4 5,6–12,6 s (lavagna) · 44,6–48,6 s (tablet)

### O02 — Anello di loghi che esplode e poi implode

- **Com'è:** I loghi schizzano dal centro su un anello al neon, girano, poi spiraleggiano dentro il logo protagonista.
- **Tempi:** Esplosione 0,25 s · rotazione ~40°/s · implosione 0,3 s + 2 onde d'urto.
- **Quando:** "Collega tutti i tuoi social a...", "tutto confluisce in...".
- **Nel kit:** logoRing(parent, cx, cy, icone, {r, w}).burst / .spin / .implode(t, scala) — tubo al neon pieno — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 98 (0.0–2.9 s)
- **Dove vederla nelle demo:** demo-2 60–62,2 s (implode nella tua foto vera)
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350)

### O04 — Loghi in orbita attorno al protagonista

- **Com'è:** Loghi su un cerchio tratteggiato che ruotano attorno a un avatar/logo.
- **Tempi:** Rotazione lenta continua.
- **Quando:** "Su tutte le piattaforme", "il tuo profilo al centro".
- **Nel kit:** orbit(parent, cx, cy, r, nodi).spin(t, dur, gradi) — loghi dritti — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 66 (60.0–63.0 s) · reel 95 (4.0–8.0 s)
- **Dove vederla nelle demo:** demo-7 27,5–32,8 s
- **Nei tuoi script:** 25/09 Cinque pezzi di un profilo che porta clienti, 26/09 Cinque impostazioni da attivare

### O06 — Imbuto a strati

- **Com'è:** Imbuto 3D a cono costruito strato per strato dall'alto: imboccatura ellittica scura col bordo in luce, ombreggiatura cilindrica, fessure tra le fasce, sheen quando una fascia si accende; sfera lucida con icona in fondo (il "Super Fan").
- **Tempi:** Strati 0,15 s sfalsati, etichette dentro.
- **Quando:** Da sconosciuto a cliente, filtri, selezione.
- **Nel kit:** funnel(parent, cx, top, etichette, {end, icon}).build / .light(i, t) / .lightAll / .lightOrb — cono 3D in SVG — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 46 (4.5–6.0 s) · reel 82 (2.0–12.0 s) · reel 103 (64.0–69.0 s)
- **Dove vederla nelle demo:** demo-2 38–43 s
- **Nei tuoi script:** 04/10 Il tuo profilo non è un curriculum, 08/09 Non inventare le idee: trova gli outlier, 25/09 Cinque pezzi di un profilo che porta clienti, 28/09 Tre tipi di contenuto: pubblico, marchio, vendita

### O07 — Scala al neon

- **Com'è:** Scala con montanti e pioli a tubo luminoso; la camera sale piolo per piolo, il nome si scrive a macchina.
- **Tempi:** Push al piolo 0,4 s · nome ~10 lettere/s.
- **Quando:** Gradini, step, livelli progressivi ("sali di uno step alla volta").
- **Nel kit:** ladder(parent, cx, bottom, etichette).build / .on(i, t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 109 (4.0–15.0 s) · reel 72 (4.0–15.0 s) · reel 84 (4.0–11.0 s)
- **Dove vederla nelle demo:** demo-2 33 s
- **Nei tuoi script:** 06/10 Cinque step di un profilo che porta clienti, 11/10 Non è la fotocamera, è la luce (scala 99% → 10%)

### O08 — Triade che ruota e porta in alto la voce detta

- **Com'è:** Triangolo 3D: a ogni parola ruota finché il lato nominato è in alto e nitido; gli altri sfocati.
- **Tempi:** Rotazione 0,5 s ease-in-out con leggera inclinazione 3D.
- **Quando:** Tre elementi da tenere insieme (nicchia, pubblico, problema).
- **Nel kit:** triad(parent, cx, cy, voci, {icons, esempi}).show(t) · .rotateTo(i, t) — cornice 3D in grafite, triangolo lime, icona e frase d'esempio per voce — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 50 (19.2–21.7 s)
- **Dove vederla nelle demo:** demo-3 5,4–10,6 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 07/10 Tre emozioni che tengono davanti al video, 21/09 Tre tipi di contenuto per follower veri

### O10 — Bersaglio costruito dal centro

- **Com'è:** Un punto, poi dischi pieni lucidi che si aggiungono verso l'esterno (ombra portata, riflesso, bordo lime), tacche da mirino, etichette su linee col pallino; una freccetta arriva in volo e si pianta al centro.
- **Tempi:** Anello 0,25 s ease-out · etichetta parola per parola sulla linea.
- **Quando:** Dal pubblico più specifico al più ampio, posizionamento, nicchia.
- **Nel kit:** bullseye(parent, cx, cy, raggi).ring(i, t) · .hit(t) freccetta · .dimOuter — dischi lucidi — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 91 (26.0–34.0 s) · reel 42 (15.0–29.0 s)
- **Dove vederla nelle demo:** demo 22–28 s · demo-2 52–54 s · v5 17,67 s · reel-09 16,1–18,3 s
- **Nei tuoi script:** 04/09 La pubblicità fatta per tutti, 14/10 Se non diventi virale… e se si sbagliassero?

### O11 — Due cerchi che diventano un Venn

- **Com'è:** Disco 1, disco 2, poi si sovrappongono e l'intersezione prende un terzo colore.
- **Tempi:** Ingresso disco 0,25 s · sovrapposizione 0,5 s.
- **Quando:** "Il punto d'incontro tra...", combinazioni vincenti.
- **Nel kit:** venn(…, {label}).one · .two · .meet · .lensOn — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 39 (57.4–65.8 s) · reel 106 (4.0–6.0 s)
- **Dove vederla nelle demo:** demo-7 38,2–43,6 s

### O12 — Lenti / sfere di vetro

- **Com'è:** Sfere scure con riflesso e un'immagine dentro, disposte a fiore o ad anello.
- **Tempi:** Rack focus d'apertura, rotazione lenta.
- **Quando:** Punti di vista, angoli, categorie.
- **Nel kit:** glassOrb(parent, cx, cy, r, media, {iris}) · orbFlower(parent, cx, cy, medias, {r, R, k0, links, dim}).show · .spin · .focus(i, t) · .all(t) — sfere di vetro con reel veri, raggi dal tema agli angoli. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 39 (3.0–11.0 s) · reel 49 (0.0–3.4 s)
- **Dove vederla nelle demo:** demo-4 39–44,6 s

### O14 — Slot machine / casinò

- **Com'è:** Slot 3D con rulli che girano; spesso al centro di un anello di reel.
- **Tempi:** Rulli 0,6–1 s.
- **Quando:** Dipendenza, ricompensa variabile, "come al casinò".
- **Nel kit:** slotMachine(parent, cx, cy, h, {reels}).pull / .spin(t, "heart") / .win — slot vera (Adobe Stock 730774093 in grafite, _tools/oggetti_adobe.py); rulli, leva lime e luci del kit — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 79 (7.0–11.0 s) · reel 118 (26.0–33.0 s)
- **Dove vederla nelle demo:** demo-oggetti 0–8 s
- **Nei tuoi script:** 23/09 Il ciclo della dipendenza da dopamina

### O18 — Tubo al neon che si disegna + riflesso che corre

- **Com'è:** Un percorso (∞, logo, freccia) disegnato come tubo luminoso cilindrico (bordo, corpo, anima chiara, filo speculare); un riflesso a cometa (testa bianca + scia) lo percorre.
- **Tempi:** Tracciatura ~1,8 s · riflesso: giro in 1,6 s.
- **Quando:** Cicli, loop, sistemi che si ripetono ("il ciclo della dipendenza").
- **Nel kit:** neonPath(parent, d, {w}).draw(t, dur) / .glint(t, giro, n) — tubo cilindrico + riflesso a cometa — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 16 (59.6–66.8 s) · reel 79 (4.5–6.5 s)
- **Dove vederla nelle demo:** demo-2 23,5–28 s · reel-09 2,9–4,5 s
- **Nei tuoi script:** 23/09 Il ciclo della dipendenza da dopamina, 30/09 Mai chiudere con "seguimi": il loop

### O20 — Radar

- **Com'è:** Spicchio luminoso che ruota attorno a un avatar; quando passa, compaiono elementi sul bordo.
- **Tempi:** 360° in ~2,5 s costanti.
- **Quando:** Ricerca, scoperta, "chi ti trova", analisi.
- **Nel kit:** radar(parent, cx, cy, r, {user, nome, sotto}).show / .spin / .find(ang, tipo, etichetta) — disco-profilo con la foto vera — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 46 (6.2–8.8 s) · reel 105 (0.0–4.0 s)
- **Dove vederla nelle demo:** demo-2 57–59,6 s

### O22 — Folla in un riquadro con contatore

- **Com'è:** Griglia di icone-persona in un box con contatore; si infittisce, si colora, esplode.
- **Tempi:** Contatore lineare · cambio colore a gruppi.
- **Quando:** Quante persone vedono/seguono/comprano, l'algoritmo che distribuisce.
- **Nel kit:** crowd(parent, cx, cy, col, righe).fillIn / .count / .recolor — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 40 (6.0–24.0 s) · reel 135 (4.0–6.0 s)
- **Dove vederla nelle demo:** demo-2 39 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 04/09 La pubblicità fatta per tutti, 10/10 Come funziona l'algoritmo delle storie, 24/09 Odi metterti davanti alla telecamera

### O24 — Calendario che si riempie

- **Com'è:** Mese a griglia; i giorni ricevono un reel vero in movimento uno dopo l'altro (reel 68, 59) oppure si colorano (reel 82, 67, 94). La versione con i reel è la più forte.
- **Tempi:** Reel nei giorni: ~0,055 s per giorno, il mese si riempie in ~1,6 s, in ordine · colorazione: ~30–50 ms per giorno.
- **Quando:** "30 giorni di contenuti", piani, frequenza di pubblicazione.
- **Nel kit:** calendar(parent, cx, cy, {mese, cellH}).fillVideos(t, idVideo) · .fill · .put · weekPlan(giorni).ghost / .resolve (settimana) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 67 (54.0–56.0 s) · reel 94 (22.0–26.0 s) · reel 139 (58.0–66.0 s)
- **Dove vederla nelle demo:** demo-2 0–5 s · v5 4,5–7,6 s (settimana) · r03 35,5–38,8 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 05/09 Storie, caroselli e reel non sono uguali, 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 15/10 30 giorni di contenuti in 30 secondi, 22/09 360 contenuti in 60 minuti

### O26 — Figura umana 3D (una persona col telefono)

- **Com'è:** Una figura umana 3D neutra (grigia o bianca, senza volto) che guarda il telefono: rappresenta lo spettatore. Spesso un pallino o un lucchetto sopra la testa, un cervello che si accende, una linea che arriva dal telefono.
- **Tempi:** Entra in 0,4–0,5 s (blur → nitida); resta mentre la camera deriva.
- **Quando:** "Chi guarda", lo spettatore che scorre, il cliente che arriva sul profilo, davanti alla telecamera.
- **Nel kit:** figure3d(parent, cx, base, h, {flip}).show · .screen · .dot · .focus · .pulse · .away · .headXY() · .phoneXY() — il manichino bianco luminoso di Kallaway (obj-manichino: Adobe Stock 140421534 + _tools/manichino.py), di profilo sul telefono; punto e lente sulla testa come nel reel 52. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 18 (10.0–11.5 s) · reel 52 (23.0–25.0 s) · reel 62 (2.0–4.5 s)
- **Dove vederla nelle demo:** demo-6 79,4–84,8 s
- **Nei tuoi script:** 13/10 Le storie in evidenza, 24/09 Odi metterti davanti alla telecamera

### O28 — Blocchi che si impilano in una torre (i pezzi)

- **Com'è:** Blocchi 3D (cubi, mattoncini, pill spesse) cadono uno sull'altro e formano una torre: ogni blocco è un componente con etichetta; un blocco può cambiare colore (variante) o uscire.
- **Tempi:** Ogni blocco cade in ~0,35 s con un piccolo rimbalzo; ~0,15 s tra un blocco e l'altro.
- **Quando:** I pezzi di un sistema (cinque pezzi di un profilo, i componenti di un video), combinare le parti.
- **Nel kit:** brickTower(parent, S, cx, base, etichette, {w, h, lw, fs, gap}).drop(i, t) · .say(i, t) · .snap(t) — mattoncini 3D in isometria (pioli 2 × 4, fianco in ombra) grafite → lime quando sono detti, etichette sfocate a sinistra; .snap li incastra in una torre (reel 90). — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 90 (12.0–30.0 s) · reel 5 (89.0–97.0 s) · reel 150 (31.0–34.0 s)
- **Dove vederla nelle demo:** demo-6 11,2–16,6 s
- **Nei tuoi script:** 25/09 Cinque pezzi di un profilo che porta clienti

### O09 — Morph di forma

- **Com'è:** Una forma 3D luminosa ruota e intanto cambia forma (esagono → triangolo → livelli).
- **Tempi:** ≈1,4 s di morph + taglio a fasce 0,25 s.
- **Quando:** Quando un concetto generico diventa una struttura precisa.
- **Nel kit:** morphShape(parent, cx, cy, r).show · .spin(t, dur, gradi) · .morph(t, "pentagono" | "triangolo", dur) · .slice(t, etichette) — forma lime lucida che ruota e cambia forma, poi si taglia a fasce. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 97 (5.3–8.4 s)
- **Dove vederla nelle demo:** demo-5 22,4–28 s

### O15 — Clessidra

- **Com'è:** Clessidra con sabbia che scende; si capovolge per 'resettare'.
- **Tempi:** Flip 0,5 s.
- **Quando:** Tempo, attenzione che scade, "in tre secondi".
- **Nel kit:** hourglass(parent, cx, cy, h).run(t, dur) · .flip(t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 60 (12.0–27.0 s)
- **Dove vederla nelle demo:** demo-7 21,6–27,4 s · reel-09 18,4 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto

### O16 — Acqua: sasso e onde

- **Com'è:** Superficie d'acqua 3D; un oggetto cade, onde concentriche, etichetta su linea guida.
- **Tempi:** Caduta 0,5 s · onde 1 s.
- **Quando:** Effetto a catena, condivisioni, portata ("piccole onde").
- **Nel kit:** water(parent, cx, cy, w, {k}).show · .ripples(t, x, y, {n, r}) · .splash(t, x, y) — acqua scura in prospettiva, onde bianche col bordo lime; con faceDot i volti si accendono quando l'onda arriva. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 65 (18.3–24.4 s) · reel 100 (94.0–99.0 s)
- **Dove vederla nelle demo:** demo-5 1,1–6,2 s

### O17 — Onda che inghiotte

- **Com'è:** Una superficie che sale e fa affondare gli elementi uno per uno.
- **Tempi:** Ogni elemento affonda in 0,8 s, diventa traslucido.
- **Quando:** Saturazione, "vengono sommersi", ciò che diventa obsoleto.
- **Nel kit:** sinkWave(parent, x0, x1, y, {amp}).show(t, dur) · .rise(t, dy, dur) · .sink(nodo, t) — onda in grafite col bordo lime che sale; gli elementi affondano in 0,8 s e diventano traslucidi. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 32 (30.0–41.0 s)
- **Dove vederla nelle demo:** demo-5 28–32,4 s

### O19 — Costellazione di punti

- **Com'è:** Linee sottili con punti luminosi ai vertici ed etichette, disegnate punto per punto.
- **Tempi:** 0,2 s per tratto.
- **Quando:** Mappe di momenti (hook, rehook, CTA) o di relazioni.
- **Nel kit:** constellation(parent, S, punti, etichette, {fs, lato}).draw(t, 0.2) — tratti sottili bianchi, punti lime luminosi, etichette che si scrivono. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 60 (5.0–10.0 s)
- **Dove vederla nelle demo:** demo-5 32,4–38,2 s

### O23 — Griglia di 100 puntini

- **Com'è:** 10×10 puntini che compaiono a onda; alcuni si accendono a caso; cambio di colore secco.
- **Tempi:** Onda 0,5 s · accensioni ~2 s · cambio colore in 1 fotogramma.
- **Quando:** Percentuali ("8 su 10", "meno del 15%", "il 99%").
- **Nel kit:** dotGrid(parent, cx, cy).waveIn / .light / .split — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 88 (39.0–46.5 s)
- **Dove vederla nelle demo:** demo-2 5 s
- **Nei tuoi script:** 06/09 Le storie: +27% views, +31% condivisioni, 11/09 Il 95% ignora l'ordine, 11/10 Non è la fotocamera, è la luce (scala 99% → 10%), 12/10 I contenuti non sono pubblicità (8 danno, 2 chiedono), 15/10 30 giorni di contenuti in 30 secondi

### O27 — Amo da pesca che aggancia (il hook)

- **Com'è:** Un amo scende su una curva (filo luminoso) verso l'oggetto da agganciare (una bolla di testo, un pesce, un reel), lo aggancia e lo tira su: la metafora letterale del "hook".
- **Tempi:** Discesa ~0,6 s su un arco · aggancio con un piccolo colpo · risalita ~0,5 s.
- **Quando:** Hook che aggancia lo spettatore, la frase che tiene, "il gancio".
- **Nel kit:** hookCatch(parent, cx, cy, {w, h, d, altri}).show · .cast(t, dur) · .swim(t, dur) · .snap(t) — cornice con la canna, la lenza lime ad arco e l'acqua a bande; l'amo d'acciaio scende, chi scorre (volto vero) abbocca e viene strappato fuori (reel 100). — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 76 (20.0–27.0 s) · reel 100 (94.0–99.0 s)
- **Dove vederla nelle demo:** demo-6 74–79,4 s

### O29 — Testa di profilo con il cervello dentro

- **Com'è:** La sagoma di una testa di profilo (nera su un disco luminoso, o rosa) con il cervello visibile dentro, che si accende: le emozioni e le decisioni dentro la testa di chi guarda.
- **Tempi:** La sagoma entra ~0,4 s; il cervello si accende ~0,3 s con un pulse.
- **Quando:** Psicologia di chi guarda: "comprano per come si sono sentiti", il cervello cablato per le storie.
- **Nel kit:** headBrain(parent, cx, cy, h, {visibile}).show · .disco · .accendi · .on · .strobo · .spegni · .brainXY() — testa di profilo col cervello vero; gesti misurati sul reel 48 (disco a scatti, cervello che lampeggia 5 fotogrammi e resta lime) e sul 62 (strobo). Niente battito periodico: in Kallaway non c'è. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 48 (1.0–4.0 s) · reel 55 (10.0–11.5 s) · reel 62 (2.0–4.0 s)
- **Dove vederla nelle demo:** demo-6 32,8–38,2 s
- **Nei tuoi script:** 07/10 Tre emozioni che tengono davanti al video, 09/10 Nessuno compra per le informazioni

### O30 — Bivio: la strada si divide in due rami luminosi

- **Com'è:** Una strada luminosa in prospettiva si divide in due rami; un ramo si accende (o un'auto/una pallina con i fari lo percorre) mentre l'altro resta spento; la camera segue il ramo scelto.
- **Tempi:** Strade che si disegnano ~0,8 s · ramo scelto che si accende ~0,4 s · la camera segue il ramo ~1 s.
- **Quando:** Una scelta, la finta ("pensi che vada da una parte e invece…"), due strade per crescere.
- **Nel kit:** roadFork(parent, S, cx, by, {w, h, split, labels}).draw(t, dur) · .drive(t, dur, {finta}) · .choose(t) — strada tratteggiata in prospettiva e la finta al neon lime; la pallina coi fari prende la finta (reel 79). forkPath(…) resta per il bivio a Y del reel 62. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 62 (31.0–39.0 s) · reel 79 (54.0–60.0 s)
- **Dove vederla nelle demo:** demo-6 63,2–68,6 s · reel-09 33,5–37,3 s (bivio verticale davanti al muro)
- **Nei tuoi script:** 23/09 Il ciclo della dipendenza da dopamina

### O31 — Razzo che decolla

- **Com'è:** Un razzo (o un logo che diventa razzo) si accende e decolla con la fiammata; il numero (views, follower) sale con lui.
- **Tempi:** Accensione ~0,3 s · decollo ~0,6 s (power2.in) con la scia.
- **Quando:** Crescita improvvisa, "raddoppi le visualizzazioni", il lancio di qualcosa.
- **Nel kit:** rocket(parent, cx, cy, h, {user, pill: {da, unita}}).show(t, dRazzo) · .ignite · .ride(t, dy, dur, {pose}) · .count(t, a, dur, ease) · .liftoff — il razzo vero porta su la tua foto col contatore (reel 59); la camera lo insegue tra le linee di velocità. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 45 (3.0–7.0 s) · reel 59 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-6 48–52,4 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova

### O32 — Cartella che si apre a ventaglio

- **Com'è:** Una cartella (o un mazzo) si apre e i file/le card escono a ventaglio, numerati; spesso è la risorsa da mandare nei DM.
- **Tempi:** Apertura ~0,3 s · le card escono a ventaglio con 0,05 s di sfasamento.
- **Quando:** La risorsa del "Commenta X", un archivio di esempi, il materiale grezzo.
- **Nel kit:** fanFolder(parent, cx, cy, file, {w, h, etichetta}).show · .fan(t) · .close(t) — cartella in grafite, le pagine vere escono a ventaglio. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 30 (77.0–80.0 s) · reel 58 (84.0–88.0 s) · reel 60 (108.0–110.0 s)
- **Dove vederla nelle demo:** demo-6 59,7–63,2 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350)

### O33 — Scala a gradini con la folla sulle alzate (la scala della luce)

- **Com'è:** Nuova, nello stile della piramide dei livelli (reel 4) e della scala della dopamina (reel 109): 4 gradini 3D in grafite che si alzano uno dopo l'altro; sull'alzata di ogni gradino il numero, la pill del valore e una folla di 100 persone (O23) che si accende per la quota di quel livello (99 → 50 → 30 → 10) con la tua foto vera tra loro. Su ogni pedata l'attrezzatura di quel livello, spenta finché non ci arrivi; la camera sale in diagonale un gradino alla volta e scende sull'alzata per il dato.
- **Tempi:** Gradini in piedi in ~0,6 s (0,1 s l'uno, back.out) · numeri 0,09 s l'uno · folla a righe 0,035–0,05 s · salita 0,85 s (KW.move) · discesa sull'alzata 0,55 s.
- **Quando:** Livelli con una percentuale per livello ("sei nel primo 10%"), crescita a step, "da dove parti a dove arrivi".
- **Nel kit:** scalaR11(parent, x0, ground, {w, r, pill}).rise · .num · .edge · .pill · B[i].folla (follaR11) — 4 gradini 3D con la folla di 100 sulle alzate e l'attrezzatura di ogni livello sulle pedate; la camera sale in diagonale. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 4 (0.0–5.0 s) · reel 109 (4.0–15.0 s) · reel 88 (39.0–46.5 s)
- **Dove vederla nelle demo:** reel-11 11,1–14 s · 14–35,6 s

### O34 — Stanza in prospettiva con la lampadina nuda

- **Com'è:** Nuova, nello stile degli oggetti veri: una stanza vista in sezione (soffitto, pareti, pavimento in prospettiva, listelli sul fondo) che si disegna dagli spigoli; una lampadina nuda appesa al soffitto sfarfalla e si accende con un cono giallastro duro e la chiazza sul pavimento: la luce sbagliata, dall'alto.
- **Tempi:** Spigoli 0,5 s · lampadina che sfarfalla 0,25 s (F05) · dondolio ±2° · ricadute di sfarfallio di 0,2 s.
- **Quando:** "Una stanza illuminata male", la luce sbagliata, l'ambiente prima di sistemarlo.
- **Nel kit:** stanzaR11(parent, x0, y0, w, h).show · lampadinaR11(parent, cx, yTop, len, {cono, pozza}).on · .sfarfalla · .dondola — la stanza in sezione con la lampadina nuda. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 144 (0.0–15.0 s) · reel 17 (1.0–1.5 s)
- **Dove vederla nelle demo:** reel-11 4,2–8,2 s

### O35 — Il contenuto diventa un cartellone pubblicitario

- **Com'è:** Nuova, nello stile degli oggetti veri e del contenuto tinto di sbagliato (F11, reel 136): il tuo reel vero prende l'interfaccia della pubblicità di Instagram (Sponsorizzato, barra "Acquista ora") e intorno gli cresce un cartellone su pali d'acciaio: pannello in grafite, poster di carta con "−30%" e "COMPRA ORA", lampade che si accendono con lo sfarfallio. Sul primo piano gli adesivi delle offerte calano sulla tua faccia uno dopo l'altro, il cartellino del prezzo oscilla, COMPRA ORA si gonfia; quando smetti le lampade si spengono a catena e i cartelloni crollano sul posto (le gambe cedono, il reel si sbriciola in polvere F10).
- **Tempi:** Pannello che cresce 0,5–0,6 s (power2.out) mentre la camera si allarga · lampade 0,27 s (F05) · adesivi ogni 0,21 s (da 1,9× a 1 in 0,14 s) · cartellino 1,6 s smorzato · crollo 0,34 s (power2.in) + polvere 0,75 s.
- **Quando:** "Trattare i contenuti come pubblicità", vendere invece di dare, contenuti che diventano spot e vengono ignorati.
- **Nel kit:** cartelloneR12(parent, cx, ground, {vid, ad}).adIG · .build · .lampsOn · .lampsOff · .views · .grey · .sticker · .tag · .cta · .crollo — il tuo reel diventa un cartellone pubblicitario, gli adesivi coprono la tua faccia, i cartelloni crollano. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 136 (0.0–6.0 s) · reel 103 (13.0–16.0 s)
- **Dove vederla nelle demo:** reel-12 3,1–6,35 s · 12,7–17,8 s · 21–26 s

### O36 — La gente che passa e il posto del cliente che resta vuoto

- **Com'è:** Nuova, nello stile delle folle di volti veri (O21/O22, reel 40): sotto i contenuti una corsia di persone (volti veri dell'atlante) che scorre a passo costante e non si ferma; sotto ogni contenuto il posto del cliente che dovrebbe arrivare (cerchio tratteggiato con la persona qualunque e il "?"). Il ritorno parte ("−", C03) e si spegne a metà strada, il contatore dei clienti resta piatto a 0 (D01). Nella regola la stessa gente si ferma, riceve il "+" e si accende; i posti sotto i due che chiedono si riempiono con la spunta lime e il contatore sale.
- **Tempi:** Corsia 80 px/s con il passo (±6 px ogni 0,26 s) · posto che compare 0,3 s · "?" che sfarfalla 0,3 s · riempimento 0,3 s + spunta 0,3 s (back.out).
- **Quando:** Clienti che non arrivano, "il ritorno", pubblico che passa oltre, persone che diventano clienti.
- **Nel kit:** corsiaR12(parent, x0, x1, y, {volti}).flow + postoR12(parent, cx, cy, d).show · .empty · .fill + levaR12(…).off — la gente che passa, il posto del cliente vuoto e poi pieno, l'interruttore Pubblica. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 40 (6.0–9.0 s) · reel 103 (60.5–63.5 s) · reel 136 (34.8–36.6 s)
- **Dove vederla nelle demo:** reel-12 3,6–21 s · 30–31,5 s · 39,4–41 s

## D · Dati e grafici

### D01 — Contatore + grafico che si disegna + bagliore finale

- **Com'è:** Card in vetro: il numero conta in modo lineare mentre la linea verde sale; al valore finale il numero 'brilla'.
- **Tempi:** Conteggio lineare 0,75–1 s, si ferma sulla parola · punto con anello sul vertice · flash di glow 0,25 s.
- **Quando:** Risultati, crescita, soldi, follower.
- **Nel kit:** statCard(parent, x, y, {label, icon, w, h, fs, points, hidden}).count(t, da, a, dur, fmt) · .slideIn(t, {from}) — card protagonista che entra di lato in corsa, numero che conta col grafico e il bagliore finale (reel 9) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 9 (10.0–13.9 s) · reel 30 (0.0–3.0 s)
- **Dove vederla nelle demo:** demo-8 6,75–9,9 s · demo 13 s · demo-2 68,5 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 06/09 Le storie: +27% views, +31% condivisioni, 09/09 Pubblichi il reel una volta sola, 10/10 Come funziona l'algoritmo delle storie, 11/10 Non è la fotocamera, è la luce (scala 99% → 10%), 16/10 Il trucco dei reel di prova (rifatto), 21/09 Tre tipi di contenuto per follower veri, 28/09 Tre tipi di contenuto: pubblico, marchio, vendita

### D02 — Badge views che poppano in sequenza

- **Com'è:** Pill con occhio e numero sotto ogni reel, una dopo l'altra.
- **Tempi:** Distanza 0,07–0,1 s · scala 0,8→1 con lieve rimbalzo.
- **Quando:** Prova sociale su esempi.
- **Nel kit:** viewBadge(...) + popSeq(badge, t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 1 (0.8–1.2 s)
- **Dove vederla nelle demo:** demo-8 17,85 s · demo 12,3 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 08/09 Non inventare le idee: trova gli outlier

### D04 — Retention che crolla

- **Com'è:** Telefono/card con la curva di retention che precipita (rossa).
- **Tempi:** Caduta 0,5 s.
- **Quando:** "Le persone scorrono via", hook sbagliati.
- **Nel kit:** igInsights(parent, X, Y, {media, punti, colore: "#ffffff"}).curve(t, dur) · .crash(t, u, causa) — negli Approfondimenti veri la curva crolla e nel punto del crollo nasce il disco con la causa (reel 18); retention() resta la versione semplice — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 18 (0.0–1.2 s) · reel 52 (0.0–1.2 s)
- **Dove vederla nelle demo:** demo-8 12,2–14,8 s · demo-2 43 s · v5 11,3 s
- **Nei tuoi script:** 07/10 Tre emozioni che tengono davanti al video, 12/10 I contenuti non sono pubblicità (8 danno, 2 chiedono), 13/10 Le storie in evidenza, 30/09 Mai chiudere con "seguimi": il loop

### D03 — Curva che si disegna con etichette e camera che la segue

- **Com'è:** Assi a L, curva luminosa che si traccia, punti ed etichette a pill; la camera si sposta sull'etichetta attiva.
- **Tempi:** Curva ~1,2 s costante · etichette sulla parola.
- **Quando:** Andamenti (retention, crescita, arco narrativo).
- **Nel kit:** lineChart({…, playhead: true}) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 110 (4.0–11.3 s) · reel 64 (71.0–77.0 s)
- **Dove vederla nelle demo:** demo-3 16,4–22,2 s
- **Nei tuoi script:** 06/09 Le storie: +27% views, +31% condivisioni, 30/09 Mai chiudere con "seguimi": il loop

### D05 — Barre con avatar in cima

- **Com'è:** Grafico a barre che crescono; avatar sopra ogni barra; la vincente si colora.
- **Tempi:** Crescita 0,5 s sfalsata.
- **Quando:** Confronti fra creator, strategie, risultati.
- **Nel kit:** barChart(parent, cx, base, [{v, l, av, val, win}]).grow(t) — foto vere sopra le barre lucide — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 38 (4.0–6.0 s) · reel 99 (6.0–9.0 s) · reel 59 (123.0–127.0 s)
- **Dove vederla nelle demo:** demo-2 44,6 s
- **Nei tuoi script:** 08/09 Non inventare le idee: trova gli outlier, 11/09 Il 95% ignora l'ordine, 27/09 Tre tipi di carosello

### D06 — Barra di avanzamento / timeline del video

- **Com'è:** Barra che si riempie (spesso a segmenti colorati) con tempi o lucchetti.
- **Tempi:** Riempimento lineare.
- **Quando:** Durata, momenti del video, progressi.
- **Nel kit:** progressBar(parent, x, y, w).fill(t, a, dur) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 24 (33.0–36.0 s) · reel 115 (71.0–75.0 s)
- **Dove vederla nelle demo:** demo-2 45,4 s
- **Nei tuoi script:** 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 07/09 Registra tre volte, 15/10 30 giorni di contenuti in 30 secondi, 30/09 Mai chiudere con "seguimi": il loop

### D07 — Formula che si compone

- **Com'è:** Numeri e operatori che arrivano uno alla volta fino al risultato (che conta e brilla).
- **Tempi:** Ogni termine 0,25 s · risultato con counter.
- **Quando:** Moltiplicazioni e calcoli ("5 × 10 × 7 = 350").
- **Nel kit:** equation(parent, cx, cy, termini, {vertical, units}).show(i, t) — mini-reel, risultato su pill lime, {tag} — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 117 (49.0–53.0 s)
- **Dove vederla nelle demo:** demo-2 10–14,5 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 22/09 360 contenuti in 60 minuti

### D08 — Gauge semicircolare

- **Com'è:** Tachimetro con lancetta.
- **Tempi:** Lancetta 0,6 s.
- **Quando:** Da evitare nel tuo stile (bocciato in reel-01). Al suo posto: D01 o O23.
- **Nel kit:** — *(in montaggio)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 2 (16.0–20.0 s)

### D09 — Percentuale al centro di un anello di persone

- **Com'è:** Le persone dell'anello si colorano mentre la percentuale al centro sale.
- **Tempi:** Conteggio 1 s.
- **Quando:** Quote di pubblico, tassi.
- **Nel kit:** peopleRings(…, {percent: true, volti}).pct(t, da, a, dur) — la percentuale al centro sale e la stessa quota di volti si colora di lime. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 24 (15.0–17.0 s)
- **Dove vederla nelle demo:** demo-5 38,2–43,8 s

### D10 — Anello di progresso che si riempie

- **Com'è:** Attorno a una foto profilo o a un numero, un anello che si riempie (a spicchi o continuo) fino al valore detto, con il bagliore sul bordo che avanza.
- **Tempi:** Riempimento ~1 s (lineare o power1.out) sincronizzato al numero al centro.
- **Quando:** Quanto manca, completamento (2 su 5), un tempo che scorre, la quota raggiunta.
- **Nel kit:** progressRing(parent, cx, cy, r, {w}).show · .to(f, t, dur) · .at(f) — arco lime attorno alla foto vera, i pezzi nascono sul bordo; in demo-6 con gli anelli concentrici del reel 46. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 46 (6.0–8.0 s) · reel 59 (32.0–34.0 s) · reel 88 (2.0–3.0 s)
- **Dove vederla nelle demo:** demo-6 22–27,4 s
- **Nei tuoi script:** 05/10 Profilo ottimizzato in 60 secondi (4 elementi)

### D11 — Corsa: curve o barre che salgono a velocità diverse

- **Com'è:** Più curve (o triangoli su binari verticali) salgono insieme a velocità diverse, con la foto di chi corre sulla punta: una va molto più su delle altre e si accende, le altre restano basse e grigie.
- **Tempi:** La corsa dura ~1,2–1,5 s (le curve hanno pendenze diverse); la vincente si accende alla fine.
- **Quando:** Chi supera chi ("un minimo di ordine e li superi"), l'outlier che corre più degli altri.
- **Nel kit:** raceChart(parent, x0, y0, linee, {w, h, mesi}) con linee [{pts, av, lime, val: [da, a]}] · .axes(t) · .run(t, dur, ease) — teste con i volti veri e la pill dei follower che sale con la curva (reel 65); la tua, lime, supera le altre. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 65 (4.0–6.5 s) · reel 94 (96.0–100.0 s) · reel 82 (90.0–93.0 s)
- **Dove vederla nelle demo:** demo-6 27,4–32,8 s
- **Nei tuoi script:** 08/09 Non inventare le idee: trova gli outlier, 11/09 Il 95% ignora l'ordine

### D12 — Scala a gradiente con il cursore

- **Com'è:** Una barra a gradiente (da peggio a meglio, rosso → verde) con le tacche e le etichette; un cursore scorre e si ferma sul punto detto, che si accende.
- **Tempi:** Cursore che scorre ~0,6–0,8 s (power3.out) con una piccola frenata.
- **Quando:** Percentili e livelli ("sei nel 99%… nel primo 10%"), da basso ad alto, valutazioni.
- **Nel kit:** gradientScale(parent, x, y, w, h, {n, etichette}).show · .fill(t, f, dur) · .cursor(t, f, testo, dur) — scala dal grafite al lime in colori pieni con il cursore; in demo-6 con la fotocamera vera in basso e il faro vero che illumina la cima. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 12 (15.0–19.0 s) · reel 92 (12.0–15.0 s) · reel 130 (24.0–29.0 s)
- **Dove vederla nelle demo:** demo-6 38,2–43,6 s
- **Nei tuoi script:** 11/10 Non è la fotocamera, è la luce (scala 99% → 10%)

### D13 — Termometro verticale che si riempie

- **Com'è:** Una barra verticale accanto a una scala o a un elenco si riempie dal basso fino al livello attivo ("più fiducia" in alto), con il bagliore sulla punta.
- **Tempi:** Riempimento ~0,6 s per livello, sincronizzato alla camera che sale.
- **Quando:** Fiducia che cresce gradino per gradino, valore accumulato.
- **Nel kit:** thermo(parent, x, yTop, yBot, {w, etichette}).show · .to(t, f, dur) — tubo di vetro col bulbo, il lime pieno sale accanto alla scala. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 72 (9.0–13.0 s) · reel 111 (65.0–73.0 s)
- **Dove vederla nelle demo:** demo-6 68,6–74 s
- **Nei tuoi script:** 06/10 Cinque step di un profilo che porta clienti

### D14 — Forma d'onda audio

- **Com'è:** Una forma d'onda (la voce, un suono) che si disegna e pulsa; si colora quando si parla della voce giusta, a volte con etichette sui picchi.
- **Tempi:** La forma d'onda scorre/pulsa in continuo; il cambio di colore ~0,3 s.
- **Quando:** Voce, registrazione, audio, "registra tre volte".
- **Nel kit:** waveform(parent, x, y, w, h, {n, prese}).play(t, dur) · .take(i, t) · .dim(i, t) · .takeX(i) — forma d'onda a prese con la testina lime. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 114 (4.0–5.5 s) · reel 127 (34.0–47.0 s) · reel 36 (17.0–23.0 s)
- **Dove vederla nelle demo:** demo-6 52,4–57,8 s
- **Nei tuoi script:** 07/09 Registra tre volte

### D15 — Cartellino del prezzo che oscilla e conta

- **Com'è:** Nuova: un cartellino di carta vero appeso con un filo all'oggetto, entra oscillando e si assesta; il prezzo conta (D01) e alla fine il più conveniente diventa lime pieno con un disco (F02).
- **Tempi:** Oscillazione 1,2 s smorzata · conteggio 0,5 s · lime 0,12 s.
- **Quando:** Costi dell'attrezzatura, "costa meno di tutte", confronti di prezzo.
- **Nel kit:** cartellinoR11(parent, x, y, testo, {filo}).show · .count · .lime — cartellino di carta appeso che oscilla e conta. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 9 (10.0–13.9 s)
- **Dove vederla nelle demo:** reel-11 6,9–8,1 s · 30,9–31,9 s

### D16 — Il righello della proporzione che diventa l'anello attorno a te

- **Com'è:** Nuova, nello stile della barra a segmenti (D06) e dell'anello che si riempie (D10): un righello d'acciaio a 10 segmenti numerati sotto una bacheca di 10 contenuti veri; sulla voce si riempiono 8 segmenti bianchi (gli 8 che danno, ognuno manda un "+" alla gente sotto) e 2 lime (i 2 che chiedono, con la barra "Scrivimi" / "Prenota" dentro il reel). Poi una linea porta dal righello alla tua foto vera e la stessa proporzione si chiude in un anello attorno a te: 8 segmenti bianchi + 2 lime.
- **Tempi:** Numeri 0,06 s l'uno · segmenti 0,12 s l'uno (power2.out) · "+" 0,26 s · anello: un segmento ogni 0,065 s, i due lime 0,1 s, colpo finale 0,14 s.
- **Quando:** Proporzioni e regole "x su 10" (8 danno e 2 chiedono, 80/20), mix di contenuti, quote di un calendario.
- **Nel kit:** righelloR12(parent, x0, y, n, pitch).light · .fill(i, t, "dai" | "chiedi") · .sheen + anelloR12(parent, cx, cy, r).seg · .pulse — 8 segmenti bianchi e 2 lime sotto i 10 contenuti, poi l'anello attorno alla tua foto. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 46 (6.0–8.0 s) · reel 115 (71.0–75.0 s)
- **Dove vederla nelle demo:** reel-12 26,2–35,3 s

## U · UI e prodotti

### U02 — Profilo Instagram con numeri che salgono

- **Com'è:** Profilo vero o 'scheletro' con follower che contano in una pill d'accento; celle della griglia evidenziate.
- **Tempi:** Conteggio 0,7–1 s.
- **Quando:** Profilo, bio, griglia, crescita (tuoi script 04, 05, 06, 08, 13/10).
- **Nel kit:** igProfile(parent, X, Y, {user, handle, bio, grid}).count / .pill / .hl / .follow · profileCard() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 9 (0.0–2.0 s) · reel 3 (5.0–7.0 s) · reel 143 (13.0–30.0 s)
- **Dove vederla nelle demo:** v5 19,4–25 s · demo 33,7 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 03/10 Il trucco dei reel di prova, 04/10 Il tuo profilo non è un curriculum, 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 06/10 Cinque step di un profilo che porta clienti, 08/10 Riordina la griglia prima di mandare gente sul profilo, 13/10 Le storie in evidenza

### U05 — Card dati in vetro

- **Com'è:** Card scura lucida (Inbox, Revenue, Views) con numero grande ed etichetta.
- **Tempi:** Ingresso da destra con la camera 0,6 s.
- **Quando:** Risultati e prove.
- **Nel kit:** statCard() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 9 (10.0–14.0 s)
- **Dove vederla nelle demo:** demo-8 6,75 s e 8,6 s (entra di lato in corsa) · demo 13 s
- **Nei tuoi script:** 21/09 Tre tipi di contenuto per follower veri, 28/09 Tre tipi di contenuto: pubblico, marchio, vendita

### U01 — Chat AI ricreata + prompt che si digita

- **Com'è:** Logo, frase di benvenuto, barra che si allarga e diventa area di testo; il prompt si scrive mentre lo dice.
- **Tempi:** Barra 0,25 s · digitazione ~20 caratteri/s · camera che segue il cursore.
- **Quando:** "Chiedi a Claude / ChatGPT..." (tuoi script 02/10, 15/10).
- **Nel kit:** chatUI(parent, cx, cy, {logo}).show / .type / .sendAt — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 6 (7.1–10.9 s) · reel 66 (4.0–7.0 s)
- **Dove vederla nelle demo:** demo-2 14,5 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 15/10 30 giorni di contenuti in 30 secondi, 22/09 360 contenuti in 60 minuti

### U03 — Cursore che clicca

- **Com'è:** Puntatore che si muove e clicca un pulsante (che cambia stato).
- **Tempi:** Spostamento 0,3 s · clic con piccolo 'press'.
- **Quando:** Tutorial su app e impostazioni (bozze, reel di prova, impostazioni).
- **Nel kit:** cursor(parent, x, y).show / .moveTo / .click — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 65 (18.3–20.3 s) · reel 133 (14.0–16.0 s)
- **Dove vederla nelle demo:** demo-2 17,2 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 08/10 Riordina la griglia prima di mandare gente sul profilo, 09/09 Pubblichi il reel una volta sola, 16/10 Il trucco dei reel di prova (rifatto), 22/09 360 contenuti in 60 minuti, 26/09 Cinque impostazioni da attivare

### U04 — Interruttori che si accendono

- **Com'è:** Toggle che passano su 'on' (verde) uno dopo l'altro.
- **Tempi:** 0,15 s ciascuno.
- **Quando:** Impostazioni da attivare (tuo script delle 5 impostazioni).
- **Nel kit:** igSettings(...).on(i, t) con iosSwitch() (toggle() = versione libera) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 95 (32.0–35.0 s) · reel 136 (35.0–36.0 s)
- **Dove vederla nelle demo:** demo-2 67,1–68 s
- **Nei tuoi script:** 26/09 Cinque impostazioni da attivare

### U06 — Lower third con barra d'accento

- **Com'è:** Nome in maiuscolo monospazio con barra verticale d'accento, testo che si decodifica.
- **Tempi:** 0,25 s.
- **Quando:** Presentare una persona/fonte.
- **Nel kit:** lowerThird(parent, x, y, nome, sotto, {fs}).show(t) — barra lime verticale + nome in maiuscolo spaziato che si decodifica (0,25 s). — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 149 (3.5–4.4 s)
- **Dove vederla nelle demo:** demo-5 12,3 s

### U07 — Dito che preme un bottone (UI Instagram)

- **Com'è:** Cerchio bianco traslucido con bordo che entra dal basso, scivola sul bottone e preme (si schiaccia + anello bianco); il bottone cambia stato. Dal tuo vecchio stile: Kallaway usa il cursore (U03), per le schermate del telefono resta il dito.
- **Tempi:** Spostamento 0,24–0,3 s (power2.inOut) · pressione 0,07 s a 0,74 + ritorno 0,24 s (back.out) · anello 0,45 s.
- **Quando:** Ogni tutorial su Instagram: tre puntini → Duplica, Reel di prova, impostazioni da attivare, bozze (regola dell'utente: il dito che preme è importante).
- **Nel kit:** tapFinger(parent).show / .to / .tap / .hide — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 65 (18.3–20.3 s)
- **Dove vederla nelle demo:** demo-2 66,7–68,1 s

### U08 — Impostazioni di Instagram con interruttori veri

- **Com'è:** Telefono scuro con la schermata Impostazioni (ricerca, sezione, righe con icona, titolo, descrizione e interruttore iOS); le righe giuste si accendono di lime una dopo l'altra, la tab bar mostra la tua foto profilo vera.
- **Tempi:** Interruttore 0,18 s (colore) + pomello 0,26 s (back.out) · camera stretta sulle righe, poi passa all'effetto (parentesi → dato → tag).
- **Quando:** "Attiva queste impostazioni" (Condividi su Facebook, comparsa su Google, account simili), privacy, notifiche.
- **Nel kit:** igSettings(parent, X, Y, righe, {user}).on(i, t) · .sw(i) · phone2() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 136 (35.0–36.5 s) · reel 95 (32.0–35.0 s)
- **Dove vederla nelle demo:** demo-2 66,4–69,2 s

### U09 — Notifica DM con la foto profilo vera

- **Com'è:** Banner di iOS che scende dall'alto: la tua foto profilo vera con il badge di Instagram, il tuo nome, "ti ha inviato: …" con l'icona del file; si accende di lime. Chiude il "Commenta X e ti mando…".
- **Tempi:** Discesa 0,5 s (expo.out) · alone lime 0,3 s · la risorsa dietro si abbassa al 45%.
- **Quando:** Chiusura con la parola da commentare (X01): mostra che la risorsa arriva davvero in DM.
- **Nel kit:** igNotif(parent, cx, top, {user, nome, testo, allegato}).show(t) · .attXY() + docWall.send() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 1 (111.0–116.0 s)
- **Dove vederla nelle demo:** demo-2 74–76 s · reel-09 58,5 s

### U10 — Bozze di Instagram: tre puntini → Duplica (con la lente)

- **Com'è:** Telefono con la schermata Bozze (reel grandi a 2 colonne con la tua copertina vera); il dito tocca i ⋯, sale il foglio Modifica / Duplica / Elimina, una lente vera ingrandisce "Duplica", il dito la preme e la bozza si divide: la copia scivola accanto e compaiono i numeri 1 e 2. Dal tuo vecchio stile (03/10), rifatto nello stile Kallaway.
- **Tempi:** Foglio 0,45 s (expo.out) · lente 0,42 s (power3.out) · divisione: lampo sulla cucitura 0,45 s + copia 0,5 s (back.out) · numeri 0,4 s (back.out).
- **Quando:** Tutorial su reel di prova, bozze, duplicare un contenuto (03/10, 16/10, 09/09).
- **Nel kit:** igDrafts(parent, X, Y, [media]).menu / .pick / .duplicate · lens() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 65 (18.3–20.3 s)
- **Dove vederla nelle demo:** r03 3,7–5,5 s · 10,5–14,5 s

### U11 — Nuovo reel: interruttore "Reel di prova" e Condividi

- **Com'è:** Schermata "Nuovo reel" (copertina, didascalia, opzioni) con la riga "Reel di prova · Solo per chi non ti segue": il dito accende l'interruttore (riga lime), preme Condividi e il reel esce dal telefono con l'etichetta PROVA (o NORMALE); toast lime "Bozza salvata" quando salvi in bozza. Si alterna con le Bozze come cambio di schermata.
- **Tempi:** Interruttore 0,18 s + pomello 0,26 s · pressione 0,07 s + ritorno 0,25 s · toast 0,45 s (back.out) · reel che esce 0,6 s (power3.inOut).
- **Quando:** Pubblicare come prova vs normale, salvare in bozza, qualsiasi passaggio di pubblicazione.
- **Nel kit:** igShare(parent, X, Y, media).trial / .press / .reset · igToast() — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 65 (18.3–20.3 s)
- **Dove vederla nelle demo:** r03 5,6–10,3 s · 16–22,4 s

### U12 — Azioni del reel che si accendono (like, commenti, condividi, salva)

- **Com'è:** La colonna di azioni di un reel di Instagram: l'icona detta (salva, condividi) si accende con un piccolo colpo e il contatore sotto sale.
- **Tempi:** Accensione ~0,2 s con un pop; contatore ~1 s.
- **Quando:** Salvataggi e condivisioni, "se la guardano viene spinta", raddoppiare le visualizzazioni.
- **Nel kit:** reelActions(parent, x, y, conti, {gap, size}).show · .on(i, t, da, a) — cuore, commento, invia, salva che si accendono di lime e i numeri che raddoppiano; in demo-6 dentro il tuo reel vero, con la camera che entra sulla colonna. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 22 (0.0–7.0 s) · reel 119 (51.0–56.0 s)
- **Dove vederla nelle demo:** demo-6 43,6–48 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 10/10 Come funziona l'algoritmo delle storie

### U13 — Commenti o notifiche che si moltiplicano

- **Com'è:** Commenti (o notifiche) spuntano uno dopo l'altro attorno al telefono o al reel e si moltiplicano fino a una nuvola: l'effetto della CTA, o il sovraccarico.
- **Tempi:** Un commento ogni ~0,08 s che accelera, ognuno con un pop e una leggera deriva verso l'alto.
- **Quando:** "Commenta X" che funziona, una pioggia di DM, la risposta del pubblico.
- **Nel kit:** commentBurst(parent, rett, righe, {fs, w}).burst(t, dur, esp) · .collect(t, x, y) — commenti di Instagram veri e leggibili (volto, nome, testo, Rispondi) che esplodono quasi tutti insieme e restano da leggere (reel 123: burst(t, 0.65, 1.8)); .collect li risucchia nella cartella. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 123 (26.0–27.5 s) · reel 89 (16.0–20.0 s)
- **Dove vederla nelle demo:** demo-6 57,8–60,3 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350)

### U14 — Mirino della fotocamera (angoli, REC, batteria)

- **Com'è:** L'inquadratura diventa il mirino di una videocamera: angoli bianchi, pallino REC rosso che lampeggia, tempo che scorre, batteria, ISO/f.
- **Tempi:** Il mirino si apre in ~0,3 s (gli angoli scivolano in posizione); REC lampeggia a 1 Hz.
- **Quando:** Davanti alla telecamera, registrare, la luce e la fotocamera.
- **Nel kit:** viewfinder(parent, [x0, y0, x1, y1]).show · .rec(t, dur) · .focus(t, x, y) — mirino vero (angoli, REC, timecode, 4K · 30, AF) sopra il tuo video vero. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 144 (0.0–15.0 s)
- **Dove vederla nelle demo:** demo-6 52,4–57,8 s
- **Nei tuoi script:** 07/09 Registra tre volte, 11/10 Non è la fotocamera, è la luce (scala 99% → 10%), 24/09 Odi metterti davanti alla telecamera

### U15 — Timer, conto alla rovescia

- **Com'è:** Un timer (cerchio che si svuota o cifre che scorrono, 60:00 → …) accanto all'oggetto: misura il tempo detto.
- **Tempi:** Le cifre scorrono a ritmo reale o accelerato; il cerchio si svuota in modo lineare.
- **Quando:** "In 60 secondi", "30 giorni in 30 minuti", "360 contenuti in 60 minuti".
- **Nel kit:** stopwatch(parent, cx, cy, d, {start, unita}).show · .run(t, dur, da, a, totale) — cronometro d'acciaio con l'arco lime e il numero. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 11 (10.0–14.0 s) · reel 13 (17.0–20.0 s) · reel 146 (1.0–3.0 s)
- **Dove vederla nelle demo:** demo-6 22–26 s
- **Nei tuoi script:** 04/10 Il tuo profilo non è un curriculum, 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 15/10 30 giorni di contenuti in 30 secondi, 22/09 360 contenuti in 60 minuti

### U16 — Storie di Instagram: fila, editor, storia aperta (UI del vecchio stile)

- **Com'è:** Nuova, nello stile di U10/U11 (regola dell'utente sulle funzioni di Instagram): la home con la fila delle storie (cerchi con l'anello a gradiente = da vedere, grigio = vista, lime = spinta), l'editor con "La tua storia" che il dito preme, la storia aperta con la barra a segmenti, nome e ora, "Invia messaggio", cuore e condividi. Il cerchio si apre nella storia (zoom dal cerchio) e la storia si richiude nel cerchio.
- **Tempi:** Apertura dal cerchio 0,3 s (power3.out) · la barra si riempie a velocità costante · scorrimento a cubo 0,42 s · like con i cuoricini che salgono in 0,9 s.
- **Quando:** Gli script sulle storie (10/10 l'algoritmo delle storie, 13/10 le storie in evidenza), chi guarda e cosa fa (apre, resta, scorre, reagisce).
- **Nel kit:** igHome · igStoryEdit · igStoryView · storyCircle · storyRow (kit2-storie.js) — la fila delle storie, l'editor con "La tua storia", la storia aperta con barra, like, risposta, condividi e lo scorrimento a cubo. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 65 (18.3–20.0 s)
- **Dove vederla nelle demo:** reel-10 0–5,4 s · 10,4–17,4 s · 19,6–25,4 s

### U17 — Orologio: le lancette corrono (l'ora)

- **Com'è:** Nuova, nello stile del cronometro U15: quadrante d'acciaio con le ore, le lancette corrono avanti di qualche ora e attorno gli orari veri (pill con la tua foto) si accendono al passaggio; poi tutto in grigio quando l'ora "non conta".
- **Tempi:** Comparsa 0,45 s (back.out) · lancette 0,75 s (power2.inOut) per 7 ore · pill che si accendono una ogni 0,15 s.
- **Quando:** "Non conta l'ora", l'orario di pubblicazione, "a qualsiasi ora".
- **Nel kit:** orologio(parent, cx, cy, d, {ora, min}).show · .spin(t, dur, ore) · .off(t) — quadrante d'acciaio, lancette che corrono, gli orari veri attorno. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 11 (10.0–14.0 s)
- **Dove vederla nelle demo:** reel-10 29,9–31,1 s

### U18 — Profilo con le storie in evidenza in ordine

- **Com'è:** Nuova, nello stile della UI di Instagram del vecchio stile (U02, U16): il tuo profilo visto da chi arriva, con la fila delle storie in evidenza. Le copertine a caso cadono e restano i posti vuoti numerati (come le voci-segnaposto di L01); sulla voce le copertine giuste (la tua foto, icone su lime) volano nel loro posto e l'etichetta si scrive; la fila scorre come in Instagram per gli extra. Il dito apre un'evidenza con l'anello che gira mentre carica.
- **Tempi:** Caduta delle copertine 0,5 s (power2.in, a scalare 0,05 s) · posti vuoti 0,35 s · numero lime 0,35 s (back.out) · copertina in volo 0,34 s e colpo all'atterraggio · scorrimento della fila 0,6 s.
- **Quando:** Storie in evidenza, bio, "cosa deve trovare chi arriva sul profilo", ordine delle cose sul profilo.
- **Nel kit:** profiloR13(parent, X, Y, {user, bio, grid, evidenze}).evXY · .scrollTo · evidenzaR13(…).load · .numOn · .fill · dubbiR13 · tastoMsgR13 · dmR13 — il profilo con le storie in evidenza in ordine, chi guarda coi suoi dubbi, il DM. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 3 (5.0–7.0 s) · reel 65 (18.3–20.3 s)
- **Dove vederla nelle demo:** reel-13 1,5–9 s · 12,5–14,5 s · 20,5–22,2 s · 26,7–28,2 s · 33,6–45,27 s

## C · Connettori e segnali

### C01 — Linea che si allunga mentre la camera viaggia

- **Com'è:** Il connettore cresce verso l'oggetto successivo e la camera lo segue.
- **Tempi:** Durata = durata del movimento di camera.
- **Quando:** Sempre, quando si passa da A a B collegati.
- **Nel kit:** connector().draw(t, dur) insieme a camK(t, dur, …) con la stessa curva: la punta resta in campo — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 79 (0.8–1.3 s)
- **Dove vederla nelle demo:** demo-7 0,8–4,05 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto

### C04 — Linea guida con etichetta che si scrive sopra

- **Com'è:** Linea sottile che esce da un punto; l'etichetta si scrive parola per parola sopra la linea.
- **Tempi:** Linea 0,4 s · parole sulla voce.
- **Quando:** Etichettare parti di un oggetto (anelli, livelli, punti di un grafico).
- **Nel kit:** leader(parent, S, x0, y0, x1, y1, testo).draw / .write — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 91 (26.0–29.0 s) · reel 4 (0.0–5.0 s)
- **Dove vederla nelle demo:** demo 22,7 s
- **Nei tuoi script:** 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 23/09 Il ciclo della dipendenza da dopamina

### C02 — Linea che diventa flusso di puntini

- **Com'è:** Sulla parola la linea si trasforma in una catena di puntini luminosi che scorre.
- **Tempi:** Propagazione 0,15 s · flusso continuo.
- **Quando:** Traffico, persone che passano da un posto all'altro.
- **Nel kit:** flowLine(S, d, t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 94 (57.5–59.0 s)
- **Dove vederla nelle demo:** demo-2 62,9 s (i canali che portano al tuo profilo)
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 04/10 Il tuo profilo non è un curriculum, 05/09 Storie, caroselli e reel non sono uguali, 24/09 Odi metterti davanti alla telecamera

### C06 — Pill dell'algoritmo in stile codice che riceve i segnali

- **Com'è:** La pill <Algorithm/> del reel 40: testo monospaziato che si decodifica, bordo luminoso; le linee la collegano al telefono e al pubblico di prova, i segnali + e − ci arrivano e lei reagisce (lampo lime per il +, bordo grigio per il −).
- **Tempi:** Decodifica ~0,45 s con un piccolo disco dietro · un lampo per segnale (0,08 s su, 0,4 s giù).
- **Quando:** Ogni volta che si spiega cosa fa l'algoritmo: misura, decide, spinge o affossa.
- **Nel kit:** algoPill(parent, cx, cy, {testo, fs}).show(t) · .flash(t, '+' | '-') — la pill <Algoritmo/> del reel 40 con i segnali C03 che ci arrivano. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 40 (0.0–2.2 s) · reel 40 (6.0–24.0 s)
- **Dove vederla nelle demo:** reel-10 1,9–3,5 s · 10,6–18 s · 19,8–25 s

### C03 — Segnale con segno che viaggia

- **Com'è:** Un cerchietto con +/− percorre la linea (dato positivo/negativo).
- **Tempi:** ≈0,4 s.
- **Quando:** Algoritmo che riceve un segnale buono/cattivo.
- **Nel kit:** signal(parent, connettore, t, dur, {sign: '+' | '-', back}) — disco col segno che viaggia sulla linea — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 40 (35.5–36.3 s)
- **Dove vederla nelle demo:** demo-3 22,2–27,2 s · reel-09 6,1 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 10/10 Come funziona l'algoritmo delle storie

### C05 — Circuito ad angoli retti

- **Com'è:** Linee a 90° (circuito) che collegano un centro a vari nodi.
- **Tempi:** 0,3 s.
- **Quando:** Sistemi, integrazioni, "tutto collegato".
- **Nel kit:** circuit(S, a, b, {prima: "h" | "v"}).draw(t, 0.3) · .pulse(t, dur, parent) — linee a 90° col gomito arrotondato e l'impulso che corre. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 49 (2.4–3.0 s)
- **Dove vederla nelle demo:** demo-5 43,8–49,4 s

## F · Luce, glow ed enfasi

### F01 — Glow (bloom) su testi e oggetti

- **Com'è:** Tutto ciò che è luminoso ha un alone morbido; gli oggetti al neon molto di più dei testi.
- **Tempi:** Testo bianco: alone medio σ≈7 px (eccesso ~0,11–0,16) + largo σ≈42–50 px (~0,07–0,10) · oggetti neon/accento: σ≈8–11 (~0,3+) + σ≈50–90 (~0,12–0,24).
- **Quando:** Sempre.
- **Nel kit:** GLOW_T (testo) · GLOW_A(a) (accento) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 79 (0.9–1.0 s) · reel 23 (6.0–7.0 s)
- **Dove vederla nelle demo:** ovunque

### F02 — Pulse a disco pieno

- **Com'è:** Disco pieno del colore d'accento con contorno chiaro sottile: nasce da un punto, si espande e svanisce.
- **Tempi:** Espansione 0,2 s ease-out + allargamento lento e dissolvenza 0,4–0,5 s · dietro (o davanti al 65%) · spesso con push-in +3–5%.
- **Quando:** Sulla parola-chiave del concetto ("addictive", "non-obvious") e per far nascere un'etichetta.
- **Nel kit:** pulse(parent, x, y, t, {r}) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 79 (1.1–1.8 s) · reel 7 (6.2–6.8 s) · reel 14 (1.0–1.5 s)
- **Dove vederla nelle demo:** demo 2,6 s · demo-2 21,2 s · reel-09 4,1 s e 29,2 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 06/09 Le storie: +27% views, +31% condivisioni, 06/10 Cinque step di un profilo che porta clienti, 07/09 Registra tre volte, 07/10 Tre emozioni che tengono davanti al video, 09/10 Nessuno compra per le informazioni, 14/10 Se non diventi virale… e se si sbagliassero?, 23/09 Il ciclo della dipendenza da dopamina, 24/09 Odi metterti davanti alla telecamera, 26/09 Cinque impostazioni da attivare

### F03 — Sheen (banda di luce)

- **Com'è:** Riflesso diagonale che attraversa card e barre appena arrivate o appena 'risolte'.
- **Tempi:** Banda ~40 px, ~20°, 0,7–0,9 s.
- **Quando:** Arrivo di card importanti, risoluzione di una voce.
- **Nel kit:** sheenK(card, t, {dur, w, dir}) — banda bianca stretta da destra a sinistra in 0,7 s (sheen() resta per i reel vecchi). — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 5 (34.0–35.0 s)
- **Dove vederla nelle demo:** demo-4 17,4–19,9 s

### F08 — Cambio di colore = cambio di stato

- **Com'è:** Elementi grigi/bianchi che diventano accento (o verde/rosso) tutti insieme o a onda.
- **Tempi:** Secco (1 fotogramma) o a onda 0,3 s.
- **Quando:** Giusto/sbagliato, chi resta/chi va, prima/dopo.
- **Nel kit:** cambio di stato a onda: filter + borderColor in 0,3 s (volti veri con faceDot) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 88 (45.5–46.0 s) · reel 13 (8.0–9.0 s)
- **Dove vederla nelle demo:** demo-7 6,9–9,1 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 10/10 Come funziona l'algoritmo delle storie, 24/09 Odi metterti davanti alla telecamera

### F04 — Riflettore + oscuramento del resto

- **Com'è:** Gli elementi scelti si illuminano (alone colorato), tutto il resto scende al 40–60%.
- **Tempi:** ≈0,4 s.
- **Quando:** Selezione ("questi sono i migliori"), focus su uno tra tanti.
- **Nel kit:** spotlight(scelti, altri, t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 61 (11.1–11.7 s) · reel 54 (41.0–45.0 s)
- **Dove vederla nelle demo:** demo-8 19,55 s (l'outlier, con la pill «4× la sua media») · demo 30,5 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 08/09 Non inventare le idee: trova gli outlier, 08/10 Riordina la griglia prima di mandare gente sul profilo, 11/09 Il 95% ignora l'ordine, 14/10 Se non diventi virale… e se si sbagliassero?

### F06 — Onde d'urto

- **Com'è:** Anelli che si allargano e svaniscono da un punto d'impatto.
- **Tempi:** 0,4–0,6 s, 1–2 onde.
- **Quando:** Impatto, arrivo del protagonista.
- **Nel kit:** ripple(parent, x, y, t, {s0, s1, w}) ×2 dal punto d'impatto — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 98 (2.3–2.9 s)
- **Dove vederla nelle demo:** demo-7 25,1 s

### F11 — Tinta rossa/verde sulle miniature

- **Com'è:** Gruppi di reel si colorano (rosso = sbagliato, verde = giusto).
- **Tempi:** 0,2–0,3 s.
- **Quando:** Selezionare esempi buoni/cattivi.
- **Nel kit:** tint(elementi, t, 'si'|'no') — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 136 (0.0–2.0 s) · reel 2 (7.0–9.0 s)
- **Dove vederla nelle demo:** demo-8 19,2 s · demo 7,6 s · demo 31,4 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 04/09 La pubblicità fatta per tutti, 08/10 Riordina la griglia prima di mandare gente sul profilo, 11/09 Il 95% ignora l'ordine, 12/10 I contenuti non sono pubblicità (8 danno, 2 chiedono), 21/09 Tre tipi di contenuto per follower veri, 28/09 Tre tipi di contenuto: pubblico, marchio, vendita

### F07 — Raggi vivi dietro un logo

- **Com'è:** Raggi morbidi dello stesso colore del logo che ruotano e respirano.
- **Tempi:** ±10°, lento.
- **Quando:** Presentare uno strumento/marchio protagonista.
- **Nel kit:** rays(parent, cx, cy, r).show / .live(t, dur) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 17 (0.0–0.8 s) · reel 56 (0.0–1.2 s)
- **Dove vederla nelle demo:** r03 0–3,7 s
- **Nei tuoi script:** 03/10 Il trucco dei reel di prova, 11/10 Non è la fotocamera, è la luce (scala 99% → 10%)

### F05 — Lampeggio di attivazione

- **Com'è:** Un elemento alterna due colori ogni 1–2 fotogrammi per ~0,3 s e si ferma sul nuovo stato.
- **Tempi:** ≈0,3 s.
- **Quando:** "Si attiva", "scatta", passaggio da spento ad acceso.
- **Nel kit:** flicker(nodo, t, statoA, statoB, 0.3) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 17 (1.0–1.5 s) · reel 107 (61.7–62.3 s)
- **Dove vederla nelle demo:** demo-7 13,3 s · 40,5 s · reel-09 1 s (accensione del cervello)

### F09 — Mosaico / pixel

- **Com'è:** Immagine a blocchi con sfarfallio di tinta: 'scansione' digitale.
- **Tempi:** Blocchi 20 → 10 px, 3 fotogrammi alternati.
- **Quando:** Raro: identità, dati grezzi, "analizzato".
- **Nel kit:** pixelate(parent, x, y, w, h, idImmagine, {b0}).show(t) · .resolve(t, dur) — foto vera a blocchi su canvas (36 → 24 → 14 → 8 → nitida) con lo sfarfallio di tinta lime. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 107 (61.7–62.4 s)
- **Dove vederla nelle demo:** demo-5 49,4–54,4 s

### F10 — Disintegrazione in particelle

- **Com'è:** Un elemento si dissolve in polvere luminosa che si espande.
- **Tempi:** ≈0,6 s.
- **Quando:** "Sparisce", "il video muore", "bruci tutto".
- **Nel kit:** disintegrate(parent, nodo, x, y, w, h, idImmagine, t, {spread}) — polvere su canvas fatta di pezzi veri dell'immagine — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 40 (37.2–37.9 s)
- **Dove vederla nelle demo:** demo-3 27,2–31,6 s
- **Nei tuoi script:** 09/10 Nessuno compra per le informazioni, 10/10 Come funziona l'algoritmo delle storie

### F12 — Timbro che cala

- **Com'è:** Un timbro ("BS", "Wasted", una parola) cala sull'oggetto con un colpo secco: scala da grande a normale, piccola scossa, inclinato.
- **Tempi:** Discesa 0,12 s (power2.in) · colpo con scossa · resta.
- **Quando:** Un verdetto netto: falso, sbagliato, scartato ("non è pubblicità", "non è un curriculum").
- **Nel kit:** stamp(parent, cx, cy, testo, {w, h, rot, fs}).down(t) — timbro in inchiostro lime pieno con l'usura, colpo di camera e polvere. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 80 (28.0–33.0 s) · reel 104 (98.0–103.0 s)
- **Dove vederla nelle demo:** demo-6 9,75 s (sul tuo profilo)
- **Nei tuoi script:** 04/10 Il tuo profilo non è un curriculum, 12/10 I contenuti non sono pubblicità (8 danno, 2 chiedono)

### F13 — La luce cambia sul soggetto (dal buio al controluce)

- **Com'è:** Nuova, nello stile di Kallaway: lo stesso reel vero cambia con la luce che riceve — buio e piatto, lampadina dall'alto (giallo, grana, vignetta), telefono, finestra (luce calda di lato), faro (nitido) e controluce (bordo lime e alone dietro che lo staccano dallo sfondo). Le sorgenti sono oggetti veri: faro, finestra con i fasci di sole, tubo LED lime; il mirino (U14) mostra l'ISO che sale al buio e l'autofocus che non aggancia, poi aggancia in lime con la luce giusta.
- **Tempi:** Cambio di stato 0,3–0,45 s · accensioni con lo sfarfallio F05 (0,2–0,25 s) · grana che cambia ogni 0,08 s.
- **Quando:** Luce, qualità dell'immagine, "sembrare professionale", prima/dopo di un'attrezzatura.
- **Nel kit:** reelLuceR11(…).stato(t, nome) · .rim · finestraR11 · ledR11 · faro · mirinoR11(…).iso · .cerca · .aggancia — lo stesso reel vero dal buio al controluce. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 17 (0.6–2.2 s) · reel 107 (61.7–62.3 s)
- **Dove vederla nelle demo:** reel-11 2,5–4,1 s · 5,6–11 s · 19,6–21 s · 24,8–29 s

### F14 — Prima e dopo con la tendina

- **Com'è:** Nuova, nello stile di F11 (grigio = sbagliato, lime = giusto): la griglia di un profilo prima (grigia, poche views) e dopo (lime, views alte); una tendina bianca con la maniglia scorre e scopre il dopo.
- **Tempi:** Tendina 0,5 s (power2.inOut) · la card pulsa sulla parola "prima".
- **Quando:** Risultati di un cliente, "prima e dopo", casi studio.
- **Nel kit:** primaDopoR13(parent, x, y, w, h, prima, dopo, views).wipe(t, dur) — la griglia grigia del prima, la tendina scopre il dopo lime. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** rara · **Riferimenti:** reel 136 (0.0–2.0 s) · reel 2 (7.0–9.0 s)
- **Dove vederla nelle demo:** reel-13 25,4–26,4 s

## H · Mano e annotazioni

### H02 — Cerchio / freccia a mano su uno screenshot

- **Com'è:** Tratto a mano dell'accento che cerchia un pulsante o un numero.
- **Tempi:** Disegno 0,3–0,4 s.
- **Quando:** Tutorial: "tocca qui", "guarda questo numero".
- **Nel kit:** handCircle(SH, …) + handArrow + handNote su uno svgLayer sopra l'interfaccia — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 139 (31.0–34.0 s) · reel 57 (30.0–50.0 s)
- **Dove vederla nelle demo:** demo-7 11,9–12,7 s
- **Nei tuoi script:** 01/10 L'errore n°1: pubblicare di tutto, 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 26/09 Cinque impostazioni da attivare

### H03 — Tag inclinati attorno a un reel

- **Com'è:** Piccole etichette inclinate con linea guida che spuntano attorno a un esempio.
- **Tempi:** Pop 0,15 s sfalsati.
- **Quando:** Smontare un esempio nei suoi ingredienti.
- **Nel kit:** tags(parent, S, lista, {from}).show(t) — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** alta · **Riferimenti:** reel 76 (13.0–17.0 s) · reel 109 (15.0–21.0 s)
- **Dove vederla nelle demo:** demo-2 68,65 s

### H01 — Annotazioni con freccia a ricciolo

- **Com'è:** Parole grandi + freccetta disegnata a mano che entrano da lati alterni con sfocatura di movimento.
- **Tempi:** 0,35–0,4 s l'una, una per parola detta.
- **Quando:** Elencare cosa si ottiene ("trends, insights, patterns").
- **Nel kit:** handIn(parent, x, y, parola, {side, page, pw, ph, fs}).show(t) — parola a mano + freccia a ricciolo + pagina vera, entrano dai lati alterni con la scia. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 102 (34.3–36.2 s) · reel 66 (33.0–37.0 s)
- **Dove vederla nelle demo:** demo-4 28–33 s

### H04 — Angoli di selezione (mirino) che si chiudono su un elemento

- **Com'è:** Quattro angoli (parentesi quadre a L) arrivano da fuori e si chiudono attorno all'elemento scelto (uno screenshot, una barra, un reel), che si stacca con il bagliore: "è questo".
- **Tempi:** Gli angoli si chiudono in ~0,3 s (power3.out) con un piccolo rimbalzo; restano o si aprono quando si passa oltre.
- **Quando:** Scegliere una cosa tra tante (una storia in evidenza, una barra della lista, un pulsante), indicare il punto preciso.
- **Nel kit:** selectCorners(parent, [x0, y0, x1, y1], {len, w, pad}).show(t) · .to(t, rett) · .hide(t) — quattro angoli lime che si chiudono in 0,35 s sull'elemento scelto. — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** media · **Riferimenti:** reel 56 (12.0–18.0 s) · reel 127 (25.0–28.0 s) · reel 69 (11.0–13.0 s)
- **Dove vederla nelle demo:** demo-6 1,15 s e 2,45 s (sceglie il reel prima di ogni scambio) · reel-09 51,4–52,9 s
- **Nei tuoi script:** 08/10 Riordina la griglia prima di mandare gente sul profilo, 13/10 Le storie in evidenza

## X · Chiusura e CTA

### X01 — "Commenta X" + anteprima della risorsa

- **Com'è:** Titolo con la parola da commentare nel box d'accento + anteprima (documento, griglia di doc che si riempie a ondate, card video).
- **Tempi:** Doc che arrivano a ondate (1 → 3 → 6) · 3–6 s.
- **Quando:** Chiusura di quasi ogni reel (99 su 100).
- **Nel kit:** docWall(parent, cx, cy, {titoli}).show(t, [1, 3, 6, 9]) · .send(t, i, x, y) + igNotif({allegato}) — pagine bianche vere — kw-kit v2 *(nel kit)*
- **Frequenza in Kallaway:** altissima · **Riferimenti:** reel 5 (118.0–125.0 s) · reel 12 (81.0–87.0 s) · reel 1 (111.0–116.0 s)
- **Dove vederla nelle demo:** demo-2 72–76 s · reel-09 57–61,5 s
- **Nei tuoi script:** 02/10 Non ti mancano le idee (5 × 10 × 7 = 350), 04/10 Il tuo profilo non è un curriculum, 05/09 Storie, caroselli e reel non sono uguali, 05/10 Profilo ottimizzato in 60 secondi (4 elementi), 07/10 Tre emozioni che tengono davanti al video, 08/09 Non inventare le idee: trova gli outlier, 09/10 Nessuno compra per le informazioni, 10/09 Metodo 6 × 5 (30 giorni in 30 minuti), 15/10 30 giorni di contenuti in 30 secondi, 27/09 Tre tipi di carosello, 29/09 Gli unici quattro tipi di contenuto
