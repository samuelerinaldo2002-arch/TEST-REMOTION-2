# -*- coding: utf-8 -*-
"""Dati del catalogo animazioni Kallaway -> brand (fonte unica: genera_catalogo.py produce json, md, html, clip).

Ogni voce: id, nome, cat, cosa (com'è), tempi (valori misurati), quando (quando usarla, legato agli script),
kit (come si fa nel kw-kit), rif [(n_reel, t0, t1)] (n = numero inventario, 1 = più recente), freq, stato.
freq: "altissima" (in quasi ogni reel) · "alta" (1 reel su 3+) · "media" (1 su 10) · "rara" (pochi reel)
stato: "kit" (c'è) · "aggiornare" (c'è ma va reso identico) · "nuovo" (da creare) · "post" (si fa in montaggio)
"""

CATEGORIE = {
    "A": "Aperture (hook visivi, primi 3 s)",
    "K": "Camera e transizioni",
    "T": "Titoli e testo",
    "L": "Liste e strutture",
    "O": "Oggetti-metafora",
    "D": "Dati e grafici",
    "U": "UI e prodotti",
    "C": "Connettori e segnali",
    "F": "Luce, glow ed enfasi",
    "H": "Mano e annotazioni",
    "X": "Chiusura e CTA",
}

PATTERN = {
    "P01": "Hook con risultato o numero (\"30 giorni in 30 secondi\", \"il 27% in più\")",
    "P02": "Lista numerata (\"tre emozioni\", \"cinque impostazioni\", \"quattro tipi\")",
    "P03": "Scala / livelli / gradini (\"cinque step\", \"sei nel primo 10%\")",
    "P04": "Procedura a passi / tutorial (\"salva in bozza, duplica, pubblica\")",
    "P05": "Confronto A vs B (\"reel normale vs reel di prova\", \"8 danno, 2 chiedono\")",
    "P06": "Framework o metafora con un nome (\"ciclo della dipendenza\", \"metodo 6×5\")",
    "P07": "Formula / moltiplicazione (\"5 × 10 × 7 = 350\", \"12 × 30 = 360\")",
    "P08": "Come funziona un meccanismo / l'algoritmo",
    "P09": "Mito o errore → verità (\"il tuo profilo non è un curriculum\")",
    "P10": "Profilo / UI Instagram (bio, griglia, impostazioni, bozze, storie in evidenza)",
    "P11": "Calendario / pianificazione (30 giorni, settimana, volume)",
    "P12": "Dato / statistica / percentuale",
    "P13": "Psicologia / emozioni / cervello",
    "P14": "Chiusura con \"Commenta X\"",
}

V = []  # voci


def voce(id, nome, cosa, tempi, quando, kit, rif, freq, stato, pattern=()):
    V.append(dict(id=id, cat=id[0], nome=nome, cosa=cosa, tempi=tempi, quando=quando, kit=kit,
                  rif=[dict(n=r[0], t0=r[1], t1=r[2]) for r in rif], freq=freq, stato=stato, pattern=list(pattern)))


# ═══ K · CAMERA E TRANSIZIONI ═══════════════════════════════════════════════════════════
voce("K01", "Faccia a tutto schermo come stacco",
     "Il taglio netto sulla faccia chiude un'idea; la grafica successiva riparte da zero.",
     "12,8 tagli/min nello stile attuale · grafica 56% del tempo (scena mediana 4,5 s, p25 2,9 – p75 6,7) · faccia 29% (mediana 2,9 s) · light mode 15%.",
     "Fine di ogni punto di una lista, prima di un cambio di sezione, sulle frasi forti dette guardando in camera.",
     "Montaggio in DaVinci (facecam). Nel PIANO di ogni reel si segnano i punti di stacco consigliati.",
     [(79, 16.3, 18.3), (5, 7.1, 7.9)], "altissima", "post", ("P02", "P09"))
voce("K02", "Arrivo in movimento dopo il taglio",
     "La grafica non parte ferma: entra già in corsa e frena (sembra che la camera stesse viaggiando).",
     "17% delle scene grafiche · velocità iniziale mediana 1.410 px/s · frenata al 10% in 0,32 s (p25 0,13 – p75 0,44) · spostamento ~330 px · curva cubic-bezier(0.2, 0.8, 0.7, 0.95).",
     "All'inizio di ogni scena grafica che segue la faccia; con più forza sui cambi di sezione.",
     "arrive(t, {dx, dy, ds}) — nuovo: sposta il mondo e lo fa frenare con la curva misurata.",
     [(79, 34.74, 36.5), (79, 50.93, 52.4)], "alta", "nuovo", ("P02", "P06"))
voce("K03", "Spostamento di camera tra due oggetti",
     "Pan + zoom che porta l'attenzione dall'oggetto A al B: parte deciso e frena a lungo.",
     "Durata mediana 1,31 s (p25 0,83 – p75 2,17) · curva cubic-bezier(0.30, 0.20, 0.35, 0.90): picco di velocità al 20% del tempo, 72% del percorso a metà durata.",
     "Ogni volta che il discorso passa all'elemento successivo dello stesso schema.",
     "cam(t, dur, x, y, s, KW.move) — aggiornare l'easing di default con la curva misurata.",
     [(79, 9.8, 12.2), (40, 54, 60)], "altissima", "aggiornare", ("P02", "P04"))
voce("K04", "Drift continuo (la camera non è mai ferma)",
     "Tra un evento e l'altro la camera scivola piano (push-in o pan di pochi px).",
     "Camera in movimento nel 59% del tempo delle grafiche (mediana) · drift lenti 2,2/min · durata ~1,4 s · curva cubic-bezier(0.30, 0.35, 0.55, 0.80).",
     "Sempre, quando nessun altro movimento è in corso da più di ~1 s.",
     "drift(t, dur, dx, dy, ds) — già nel kit; usare la curva misurata.",
     [(79, 20.5, 23.5), (123, 9, 15)], "altissima", "aggiornare")
voce("K05", "Whip pan con motion blur",
     "Spostamento velocissimo (>3.000 px/s) con scia di movimento: si 'vola' alla scena successiva.",
     "0,65 per minuto · durata 0,4–0,6 s · sfocatura direzionale nei fotogrammi centrali.",
     "Cambio di sezione dentro lo stesso mondo (lista → schema, schema → prova), spesso seguendo una linea.",
     "whip(t, dur, x, y, s, asse, picco) — nel kit.",
     [(14, 2.0, 2.9), (13, 1.4, 2.1)], "media", "kit")
voce("K06", "Punch-in sulla parola chiave",
     "Zoom rapido di +8–20% su una parola o un numero.",
     "Raro: 0,12/min · ≤0,35 s · power4.out.",
     "Solo sui 1–2 colpi veri del reel (il numero finale, il nome del framework).",
     "cam(t, 0.3, x, y, s*1.1, 'power4.out').",
     [(79, 12.6, 13.6)], "rara", "kit")
voce("K07", "Zoom-through (si passa 'attraverso' la scena)",
     "1–2 fotogrammi di sfocatura da zoom su tutto, e dall'altra parte c'è un oggetto nuovo.",
     "≈0,1–0,15 s di blur; l'oggetto nuovo arriva leggermente ruotato e si assesta in 0,3 s.",
     "Quando una lista o una domanda si 'trasforma' nella sua risposta visiva.",
     "zoomThrough(t, scenaA, scenaB) — nuovo.",
     [(50, 19.0, 19.6)], "media", "nuovo", ("P06",))
voce("K08", "La camera segue un oggetto che cade/vola",
     "Un oggetto fisico (sasso, pallina, card) fa da ponte: la camera lo insegue fino al mondo successivo.",
     "Inseguimento ~0,5 s · l'oggetto accelera (power2.in) e la camera lo aggancia in frenata.",
     "Quando una causa produce un effetto (\"un like... e succede questo\").",
     "fallFollow(nodo, t, x0, y0, x1, y1, posa, {dur: 0.55}) + pebble(parent, x, y, d, icona) — l'oggetto accelera (power2.in) e la camera lo insegue con la stessa curva, poi frena 0,35 s all'impatto.",
     [(65, 20.2, 21.6)], "rara", "kit", ("P08",))
voce("K09", "Uscita seguendo una linea (il titolo resta nel mondo)",
     "Una linea esce dall'oggetto e la camera la segue in whip; il titolo vecchio esce insieme al mondo, il nuovo arriva con la scena.",
     "Linea che cresce 0,3 s · whip 0,5 s · nuovo titolo parola per parola dopo l'arrivo.",
     "Hook → primo schema; collegare due schemi che sono causa ed effetto.",
     "lineExit(parent, S, a, b, t, posa, {grow, whip}) — linea con la testa luminosa (0,3 s), poi whip2 che la insegue; i titoli vivono nel mondo (titleW({parent: layer})).",
     [(13, 1.2, 2.5), (14, 2.0, 2.9)], "alta", "kit")
voce("K10", "Messa a fuoco d'apertura (rack focus)",
     "La scena nasce fuori fuoco e va a fuoco mentre compare il titolo.",
     "Blur ~10 px → 0 in 0,3–0,5 s.",
     "Prima inquadratura del reel o di una sezione importante.",
     "rackFocus(t, dur) sul mondo — nuovo.",
     [(49, 0, 0.6)], "media", "nuovo")
voce("K11", "Scroll 'slot machine' di un muro di miniature",
     "Il muro scorre in verticale velocissimo con motion blur e frena fino a fermarsi su una selezione.",
     "Zoom out 0,2 s → scroll 0,4 s con scia → frenata 0,3 s → riflettore sulla selezione.",
     "\"Ho analizzato migliaia di video...\", \"tra tutti i contenuti...\" (ricerca, selezione).",
     "wallScroll(parent, cx, top, {cols, rows}).open / .roll / .spot / .pick — muro di reel veri (atlante assets/atlas/muro.jpg).",
     [(61, 9.3, 11.9), (90, 2.0, 4.0)], "media", "kit", ("P12",))
voce("K12", "Nastro trasportatore",
     "Una fila di card scorre a velocità costante mentre lui le elenca una per una.",
     "~120 px/s costanti per tutta la sezione (10+ s); ogni card entra quando viene nominata.",
     "Elenchi lunghi (più di 5 voci) o una progressione nel tempo.",
     "conveyor(parent, x0, y, cards, {w, h, speed, timeline}).run(t0, t1) · .on(i, t) — copertine vere, pillole appese alla linea del tempo, ogni card si accende quando è detta.",
     [(32, 30, 41), (25, 51, 58)], "media", "kit", ("P02",))
voce("K13", "Match cut: un punto diventa l'oggetto",
     "Tutto sparisce tranne un punto, che cresce e diventa il protagonista della scena nuova (avatar, disco, etichetta).",
     "Punto 8–10 px → oggetto in 0,3–0,5 s (expo.out).",
     "Passaggio da uno schema al 'soggetto' (il tuo profilo, il cliente, il concetto).",
     "Nel kit per l'anello di reel (punto → disco → barra); generalizzare in matchDot().",
     [(46, 5.6, 6.3), (14, 1.0, 1.5)], "alta", "aggiornare")
voce("K14", "Una voce della lista diventa l'intestazione",
     "Shared element: la voce attiva sale in alto e diventa il titolo della sezione, il resto svanisce.",
     "≈0,25–0,35 s, power3.inOut.",
     "Ogni volta che si entra in un punto della lista (01 → spiegazione).",
     "promote(row, header) — c'è in reel-01, da rendere generico.",
     [(39, 57.3, 57.9), (5, 13.5, 15.5)], "alta", "aggiornare", ("P02",))
voce("K15", "Light leak / flash (era podcast)",
     "Lama di luce arancio diagonale + 1 fotogramma quasi bianco sul cambio d'inquadratura.",
     "≈0,25 s. Frequente a febbraio (1,7/min), quasi assente nello stile attuale (0,05/min).",
     "Solo su un cambio forte, al massimo una volta per reel.",
     "lightLeak(t) — nuovo (opzionale).",
     [(149, 3.25, 3.7)], "rara", "nuovo")
voce("K16", "Push-in lento su un oggetto che si costruisce",
     "Mentre il documento/schema si riempie, la camera si avvicina piano.",
     "+8–15% in 1–1,5 s, sine.inOut.",
     "Documenti, tabelle, schemi che si compilano mentre parla.",
     "drift(t, dur, 0, 0, +0.1).",
     [(35, 0.3, 2.2), (26, 3.5, 6.0)], "alta", "kit")
voce("K17", "Mappa a loop: la camera viaggia lungo il simbolo da una tappa all'altra",
     "Il simbolo (∞ al neon con le molecole dentro) è la mappa del reel: le tappe numerate stanno attorno ai lobi. A ogni capitolo la camera parte stretta sull'etichetta precedente e attraversa il simbolo lungo il tubo fino alla tappa nuova; oppure dalla mappa intera si tuffa sulla tappa. Il numero compare grigio e diventa bianco, il nome si accende sulla parola.",
     "Viaggio ~1,3 s: parte deciso dopo il taglio e frena a lungo (curva come K02, camera misurata 1,0 s fino al 15%); tuffo dalla mappa ~1,1 s; numero +0,2 s, nome sulla parola detta.",
     "Cicli e processi a tappe (il ciclo della dopamina, il loop del reel, le fasi di una strategia): un capitolo per tappa.",
     "loopMap(parent, cx, cy, nomi).go(i, t) · .name(i, tempi) · .overview(t) · .dive(i, t) — pathCam() + neonPath({molecole}).glintTo().",
     [(79, 34.6, 36.6), (79, 50.85, 52.4)], "rara", "kit", ("P06", "P08"))

# ═══ T · TITOLI E TESTO ═══════════════════════════════════════════════════════════════════
voce("T01", "Titolo parola per parola, sincronizzato alla voce",
     "Ogni parola compare nell'istante in cui viene detta: grigia e sfocata → bianca e nitida.",
     "Unità = parola · stato iniziale grigio ~58%, blur 8–10 px, y +5 px · 0,17–0,21 s ease-out · i corsivi più grandi partono da blur ~12 px.",
     "Sempre: titolo dell'hook e titoli di sezione.",
     "title({lines, words:[tempi]}) — aggiornare: oggi è per lettera con stagger fisso; va legato ai tempi delle parole del voiceover.",
     [(79, 0, 0.85), (1, 0.1, 0.6)], "altissima", "aggiornare", ("P01",))
voce("T02", "Box evidenziatore che cresce insieme alle parole",
     "Prima un cursore verticale sottile, poi il box si allarga da sinistra seguendo le parole che compaiono.",
     "Cursore ~6 px · crescita ≈0,4 s legata alle parole · dietro il bordo testo bianco, davanti grigio/sfocato.",
     "Parola-chiave del titolo (il problema, il risultato, il nome del metodo).",
     "title() box lime — aggiornare la crescita (oggi wipe unico).",
     [(1, 0.1, 0.6), (7, 5.1, 5.6)], "altissima", "aggiornare")
voce("T03", "Box già disegnato + testo a macchina da scrivere",
     "Il box è già lungo e il testo (corsivo) si scrive lettera per lettera dentro.",
     "≈35–40 caratteri/s.",
     "Titoli di sezione brevi, ripresa del titolo in un formato compatto.",
     "typeIn(el, t, cps) — nuovo (typeText va verificato).",
     [(35, 3.0, 3.6), (46, 6.0, 6.8)], "media", "nuovo")
voce("T04", "Lettere che compaiono in ordine casuale",
     "Etichette e sottotitoli corsivi si 'materializzano' lettera per lettera in ordine sparso.",
     "≈0,2–0,3 s per parola; ogni lettera opacità 0→1 in 1–2 fotogrammi.",
     "Etichette di oggetti 3D, nomi di livelli, didascalie in corsivo.",
     "scrambleIn(el, t, dur, seed) — nuovo.",
     [(16, 60.0, 62.6), (97, 7.3, 7.8)], "media", "nuovo")
voce("T05", "Testo che si decodifica (glitch)",
     "Le lettere cambiano a caso per qualche fotogramma e si fermano sulla parola giusta.",
     "≈0,25 s, una sostituzione ogni 1–2 fotogrammi, font monospazio.",
     "Nomi, lower third, etichette 'tecniche' (codice, <algoritmo/>, dati).",
     "decode(el, t, dur) — nuovo. È l'effetto 'pixel' sulle parole.",
     [(149, 3.55, 3.9)], "rara", "nuovo")
voce("T06", "Etichetta a macchina da scrivere",
     "Il nome del livello/passo si scrive lettera per lettera mentre lo dice.",
     "~10 lettere/s, maiuscolo bold.",
     "Nomi dei livelli di una scala o dei passi di un metodo.",
     "typeText() del kit (verificare velocità e cursore).",
     [(109, 12.0, 13.0)], "media", "aggiornare", ("P03",))
voce("T07", "Sottolineatura d'accento che cresce",
     "Linea sottile del colore d'accento che si allunga sotto la seconda riga del titolo seguendo il testo.",
     "Spessore 3–4 px · cresce con le parole.",
     "Titoli senza box (alternativa più leggera al box).",
     "title({underline:true}) — nuovo.",
     [(14, 0.4, 1.0), (56, 0.2, 0.6)], "alta", "nuovo")
voce("T08", "Uscita del titolo: diventa grigio e se ne va",
     "Prima del cambio scena il titolo si spegne (bianco → grigio) e poi sparisce; il box si ritira.",
     "Grigio in ≈0,15 s, poi uscita 0,25 s.",
     "Fine sezione.",
     "title.outAt(t) — aggiornare con lo 'spegnimento'.",
     [(5, 35.2, 35.5)], "alta", "aggiornare")
voce("T09", "Una parola del titolo viene sostituita",
     "Il titolo resta, cambia solo una parola (si riscrive a macchina).",
     "≈0,3 s.",
     "Stesso schema, concetto che evolve (\"Funnel\" → \"Progression\", Primo → Secondo livello).",
     "swapWord(T, i, testo, t) — la parola si cancella e si riscrive a macchina (1/40 s a lettera), il resto del titolo resta.",
     [(46, 10.4, 11.4), (4, 12, 13)], "media", "kit")
voce("T10", "Il titolo si riorganizza (compatto)",
     "Da 2 righe grandi a 1 riga piccola in alto (dentro un box), per lasciare spazio allo schema.",
     "≈0,3–0,4 s.",
     "Quando dopo l'hook serve tutta l'area per la grafica.",
     "compactTitle(T, t, righe, {size, top}) — il titolo grande sale e sparisce, quello compatto si scrive in un box di vetro col bordo lime.",
     [(26, 3.3, 3.9)], "media", "kit")
voce("T11", "Numero o parola gigante sullo sfondo",
     "Testo enorme, grigio scuro e trasparente, dietro l'oggetto; spesso conta. In Kallaway compare solo dietro un oggetto-metafora che lo spiega (reel 56: '100x' dietro il logo con le braccia).",
     "Altezza ~1,5–2× l'oggetto · opacità ~15–25%.",
     "DA EVITARE (feedback 09/10: 'questo numero grande non si capisce cosa voglia dire'). Mai come scena a sé: i numeri vanno dentro un'infografica (D01 card dati, D07 formula, O23 100 puntini).",
     "bigBack() esiste nel kit ma non va usato da solo.",
     [(56, 1.2, 2.2)], "rara", "evitare", ("P07", "P12"))
voce("T12", "Parole-chiave del sottotitolo in corsivo",
     "Nei sottotitoli (parola singola, bianco, ombra morbida, nessuna animazione) le parole importanti passano in serif corsivo.",
     "Cambio secco a ogni parola.",
     "Nome del framework, parola su cui cade l'accento.",
     "In post (DaVinci): per il brand Patrick Hand lime sulle parole-chiave.",
     [(110, 3.0, 4.0), (79, 0.9, 1.7)], "alta", "post")
voce("T13", "Testo che si corregge: parole barrate e tolte",
     "Una frase scritta (hook, didascalia) viene corretta davanti a chi guarda: una parola si barra con un tratto rosso, le parole inutili e la punteggiatura spariscono e la frase si ricompatta; a volte la parola giusta prende il posto di quella barrata.",
     "Tratto che barra ~0,2 s · la parola tolta svanisce e la riga si richiude ~0,3 s · una parola alla volta, sul parlato.",
     "Riscrivere un hook o una frase, un errore da togliere (\"non è un curriculum, è un venditore\", \"taglia la frase e sposta la prima metà\").",
     "strikeLines(parent, x, y, righe, {fs, w}).strike(i, t) · .remove(i, t) · .add(t, testo, {color}) · .strikeR(r, t) · .removeR(r, t) — riga lime sopra le parole, la riga si chiude, quella giusta si scrive.",
     [(31, 55, 65.5), (72, 91, 96.5), (142, 35, 38.5)], "media", "kit", ("P09",))

# ═══ L · LISTE E STRUTTURE ════════════════════════════════════════════════════════════════
voce("L01", "Lista con voci-segnaposto sfocate",
     "Tutte le voci sono già lì, sfocate; la lista si ri-centra quando ne arriva una nuova e sale piano.",
     "Barre scure arrotondate, accento sul bordo sinistro ~6 px, numero bold · testo blur ~6 px · ri-centratura 0,3 s.",
     "Ogni elenco numerato annunciato all'inizio (\"tre emozioni\", \"cinque impostazioni\").",
     "row() + placeholder sfocati — aggiornare (accento sinistro, ri-centratura).",
     [(5, 9, 12.5), (7, 5, 7)], "altissima", "aggiornare", ("P02",))
voce("L02", "Una voce si risolve con uno sheen",
     "Una banda di luce diagonale attraversa la barra da destra a sinistra e il testo va a fuoco al suo passaggio.",
     "Banda ~40 px a ~20° · 0,75–0,8 s · poi barra attiva: fondo più chiaro, bordo bianco sottile, scala +3%.",
     "Quando nomina il punto della lista.",
     "resolveRow(row, t) — nuovo (unisce sheen() + unblur()).",
     [(5, 10.7, 11.6), (5, 34.0, 35.0)], "altissima", "nuovo", ("P02",))
voce("L03", "La lista si accende a cascata",
     "Appena arrivata, un riflesso bianco scende sulle barre una dopo l'altra.",
     "~80 ms tra una barra e l'altra.",
     "Arrivo della lista dopo un whip.",
     "listK(...).cascade(t, 0.08) — bordo bianco + riflesso sheenK che scende di barra in barra (reel 13).",
     [(13, 2.5, 3.0)], "media", "nuovo")
voce("L04", "Checklist con spunte",
     "Righe con casella; le spunte arrivano una alla volta (oppure tutte spuntate come domanda di verifica).",
     "Spunta 0,15 s per riga.",
     "Domande di controllo, requisiti, \"chiediti se...\".",
     "checklist(items, tempi) — nuovo.",
     [(50, 14, 18.6), (82, 66, 73)], "media", "nuovo", ("P04",))
voce("L05", "Lista con lucchetti che si sbloccano",
     "Ogni voce completata diventa verde con lucchetto aperto.",
     "Cambio stato secco + piccolo pop.",
     "Percorsi/metodi in cui si 'sblocca' un passo alla volta.",
     "listK(…, {locks: true}).unlock(i, t).",
     [(61, 32, 35), (96, 34, 38)], "media", "kit", ("P04",))
voce("L06", "Indice fisso in un angolo",
     "Mini-lista delle sezioni in alto a sinistra per tutto il reel, con la sezione corrente evidenziata.",
     "Sempre visibile, cambio evidenziazione 0,2 s.",
     "Reel lunghi con molte sezioni (strumenti, elenchi di 6+).",
     "sideIndex(voci, {x, top, w, fs}).show(t) · .go(i, t) — indice fisso nell'HUD, la voce corrente in una pill lime (0,2 s).",
     [(58, 7, 11), (140, 7, 12)], "rara", "kit")
voce("L07", "Tier list",
     "Righe S/A/B/C colorate; gli elementi cadono nella riga giusta.",
     "Ogni elemento scende riga per riga ~0,15 s per riga.",
     "Classifiche (\"dal peggiore al migliore\").",
     "tierList(parent, cx, top, [\"S\", \"A\", \"B\", \"C\"], {w, rh, slot}).show(t) · .drop(nodo, riga, t) — gli elementi cadono attraversando le righe (~0,15 s a riga).",
     [(131, 6, 11), (8, 77, 88)], "rara", "kit")
voce("L08", "Tabella che si compila",
     "Righe e colonne che si riempiono cella per cella (spesso con evidenziazione colorata).",
     "~0,1–0,2 s per cella.",
     "Matrici (argomenti × formati), confronti, valutazioni.",
     "table(parent, cx, cy, colonne, righe).show / .heads / .rowHead / .fill / .lime / .pill.",
     [(64, 33, 37), (68, 63, 74), (98, 37, 45)], "media", "kit", ("P07", "P11"))
voce("L09", "Albero / flowchart che cresce",
     "Un nodo in alto, linee sottili che si disegnano verso i figli, che compaiono sfocati → nitidi.",
     "Linee 0,3–0,5 s · nodi 0,25 s sfalsati.",
     "Categorie e sotto-categorie (nicchia → sotto-nicchie), cause → effetti.",
     "connector() + nodePill() — aggiungere helper tree().",
     [(3, 21, 27), (23, 9, 14), (68, 23, 30)], "altissima", "aggiornare", ("P06", "P07"))
voce("L10", "Parentesi che raggruppa",
     "Una parentesi (graffa o quadra) abbraccia un gruppo e porta a un'etichetta.",
     "Si disegna in 0,3 s.",
     "\"Questi tre sono...\", raggruppare righe di un documento.",
     "bracket() — nuovo.",
     [(26, 20, 23), (31, 93, 98), (132, 34, 37)], "alta", "nuovo")
voce("L11", "Catena di passi / percorso a tappe",
     "Tappe collegate da una linea (dritta, a zig-zag o ondulata) che si disegna; la tappa attiva si accende.",
     "Linea 0,4 s per tratto · pallino che percorre la linea.",
     "Procedure (salva → duplica → pubblica), metodi in N passi, \"il mio sistema\".",
     "metroPath(parent, S, stazioni, etichette, {icons, side}).show(t, dur) · .go(i, t, dur) · .poseAt(i) — percorso curvo 'a metropolitana': la pallina corre e il tratto fatto si accende (reel 88 e 124). pathSteps() resta per i percorsi dritti.",
     [(14, 35, 40), (107, 6, 15), (124, 78, 84)], "alta", "nuovo", ("P04",))
voce("L12", "Documento \"Video Script\" che si costruisce",
     "Card-documento con righe grigie che si colorano a sezioni (Hook, corpo, CTA) con legenda a quadratini.",
     "Righe che si allungano a cascata ~20 ms l'una · evidenziatore 0,3 s per riga · bordo luminoso.",
     "Script, struttura di un video, copioni, \"hook, spiega, mostra, insegna\".",
     "scriptDoc(parent, cx, cy, sezioni, {title, fitto}).lay(t) · .section(i, t) · .focus(i, t) — righe sottili e fitte, colorate per sezione (reel 35).",
     [(35, 0, 3.9), (26, 3.5, 6.2), (4, 28, 40)], "alta", "nuovo", ("P04", "P06"))
voce("L13", "Confronto a due colonne",
     "Due intestazioni (es. sbagliato | giusto) e card affiancate che arrivano voce per voce.",
     "Slide orizzontale tra un punto e l'altro.",
     "A vs B, prima/dopo, chi vince/chi perde.",
     "versus(a, b) — nuovo.",
     [(29, 5, 20), (123, 28, 30)], "media", "nuovo", ("P05",))
voce("L14", "Griglia di esempi con etichette",
     "2×2 o 2×3 reel veri con etichetta sopra e badge views sotto.",
     "Card che entrano a gruppi sfocato → nitido.",
     "Esempi concreti di un formato, prova sociale.",
     "reelGrid() — nuovo (usa videoCard).",
     [(8, 38, 41), (120, 13, 22)], "alta", "nuovo")
voce("L15", "Pila di card: le già viste si impilano",
     "Le card (profili, esempi, categorie) arrivano una alla volta al centro; quella precedente rimpicciolisce e va in una pila in un angolo (o le card si impilano in 3D una sull'altra), così si vede quante ne sono passate.",
     "Card nuova ~0,4 s; la precedente vola nella pila in ~0,35 s (power3.inOut) con un leggero sfasamento in profondità.",
     "Esempi in sequenza (tre tipi di carosello, casi studio, profili d'esempio), un elenco lungo senza perdere il filo.",
     "stackAway(nodo, t, x, y, i, {scale}) — la card vista rimpicciolisce e vola nella pila in un angolo.",
     [(15, 35, 53), (59, 7, 10), (118, 65, 68)], "media", "kit", ("P02",))
voce("L16", "Elementi che si riordinano (la griglia si rimescola)",
     "Barre di una lista o celle di una griglia si scambiano di posto con un movimento a S: quella scelta si stacca (cornice e bagliore), le altre scorrono per fare spazio e l'ordine nuovo si assesta.",
     "Scambio ~0,5 s (power3.inOut) con un piccolo sollevamento dell'elemento che si sposta.",
     "Riordinare la griglia del profilo, priorità che cambiano, \"prima questo, poi quello\".",
     "reorder(nodi, posti, ordine, t, {dur, step}) — ogni elemento si alza e scivola al suo nuovo posto.",
     [(69, 11, 13.5), (116, 60, 67)], "rara", "kit", ("P10",))

# ═══ O · OGGETTI-METAFORA ═════════════════════════════════════════════════════════════════
voce("O01", "Anello di reel che ruota",
     "6–7 card piccole partono raggruppate e si aprono in cerchio su un tratteggio, ruotando lente.",
     "Card ~120×200 px · apertura da r 60 → 370 px in 0,3 s (ease-out forte) · rotazione 20–25°/s · card sempre dritte.",
     "Hook su \"i contenuti\", \"i formati\", \"i creator\" (un insieme di video).",
     "Nel kit (reel-01 S1) — aggiornare dimensioni e tempi misurati.",
     [(14, 0, 2.0), (13, 0, 1.4)], "alta", "aggiornare", ("P01",))
voce("O02", "Anello di loghi che esplode e poi implode",
     "I loghi schizzano dal centro su un anello al neon, girano, poi spiraleggiano dentro il logo protagonista.",
     "Esplosione 0,25 s · rotazione ~40°/s · implosione 0,3 s + 2 onde d'urto.",
     "\"Collega tutti i tuoi social a...\", \"tutto confluisce in...\".",
     "logoRing() — nuovo.",
     [(98, 0, 2.9)], "media", "nuovo", ("P08",))
voce("O03", "Hub con loghi collegati",
     "Loghi delle piattaforme sopra, curve che convergono su un nodo centrale.",
     "Curve 0,4 s sfalsate, pallini che viaggiano.",
     "Strumenti, piattaforme, sorgenti di dati.",
     "appIcon() + connector() — nel kit.",
     [(6, 4, 6), (41, 35, 42)], "alta", "kit", ("P08",))
voce("O04", "Loghi in orbita attorno al protagonista",
     "Loghi su un cerchio tratteggiato che ruotano attorno a un avatar/logo.",
     "Rotazione lenta continua.",
     "\"Su tutte le piattaforme\", \"il tuo profilo al centro\".",
     "orbit(items, r, velocità) — nuovo.",
     [(66, 60, 63), (95, 4, 8)], "media", "nuovo")
voce("O05", "Piramide a livelli con bandiere",
     "Piramide 3D che si costruisce dal basso: ogni livello ha due facce (sinistra in luce, destra in ombra) staccate da una fessura; nasce in grafite e il livello detto si accende di lime; etichette in vetro su una linea guida col pallino.",
     "Livelli 0,2 s l'uno · bandiere che si risolvono sulla parola · alone dell'accento forte.",
     "Gerarchie, livelli di difficoltà, \"sei nel primo X%\".",
     "pyramid(livelli) — nuovo.",
     [(4, 0, 5), (23, 5, 9), (29, 56, 59)], "alta", "nuovo", ("P03",))
voce("O06", "Imbuto a strati",
     "Imbuto 3D a cono costruito strato per strato dall'alto: imboccatura ellittica scura col bordo in luce, ombreggiatura cilindrica, fessure tra le fasce, sheen quando una fascia si accende; sfera lucida con icona in fondo (il \"Super Fan\").",
     "Strati 0,15 s sfalsati, etichette dentro.",
     "Da sconosciuto a cliente, filtri, selezione.",
     "funnel(strati) — nuovo.",
     [(46, 4.5, 6.0), (82, 2, 12), (103, 64, 69)], "media", "nuovo", ("P03", "P08"))
voce("O07", "Scala al neon",
     "Scala con montanti e pioli a tubo luminoso; la camera sale piolo per piolo, il nome si scrive a macchina.",
     "Push al piolo 0,4 s · nome ~10 lettere/s.",
     "Gradini, step, livelli progressivi (\"sali di uno step alla volta\").",
     "ladder(pioli) — nuovo (perfetto per lo script dei 5 step del profilo).",
     [(109, 4, 15), (72, 4, 15), (84, 4, 11)], "media", "nuovo", ("P03",))
voce("O08", "Triade che ruota e porta in alto la voce detta",
     "Triangolo 3D: a ogni parola ruota finché il lato nominato è in alto e nitido; gli altri sfocati.",
     "Rotazione 0,5 s ease-in-out con leggera inclinazione 3D.",
     "Tre elementi da tenere insieme (nicchia, pubblico, problema).",
     "triad(parent, cx, cy, voci, {icons, esempi}).show / .rotateTo(i, t) — cornice 3D in grafite, triangolo lime.",
     [(50, 19.2, 21.7)], "media", "kit", ("P02", "P06"))
voce("O09", "Morph di forma",
     "Una forma 3D luminosa ruota e intanto cambia forma (esagono → triangolo → livelli).",
     "≈1,4 s di morph + taglio a fasce 0,25 s.",
     "Quando un concetto generico diventa una struttura precisa.",
     "morphShape(parent, cx, cy, r).show · .spin(t, dur, gradi) · .morph(t, \"pentagono\" | \"triangolo\", dur) · .slice(t, etichette) — forma lime lucida che ruota e cambia forma, poi si taglia a fasce.",
     [(97, 5.3, 8.4)], "rara", "kit")
voce("O10", "Bersaglio costruito dal centro",
     "Un punto, poi dischi pieni lucidi che si aggiungono verso l'esterno (ombra portata, riflesso, bordo lime), tacche da mirino, etichette su linee col pallino; una freccetta arriva in volo e si pianta al centro.",
     "Anello 0,25 s ease-out · etichetta parola per parola sulla linea.",
     "Dal pubblico più specifico al più ampio, posizionamento, nicchia.",
     "bullseye(anelli) — nuovo (nel kit c'è solo la freccetta).",
     [(91, 26, 34), (42, 15, 29)], "media", "nuovo", ("P06",))
voce("O11", "Due cerchi che diventano un Venn",
     "Disco 1, disco 2, poi si sovrappongono e l'intersezione prende un terzo colore.",
     "Ingresso disco 0,25 s · sovrapposizione 0,5 s.",
     "\"Il punto d'incontro tra...\", combinazioni vincenti.",
     "venn(parent, cx, cy, r, a, b, {label}).one · .two · .meet · .lensOn(t) — cerchi di vetro (mai lime trasparente), intersezione lime piena con il lampeggio F05.",
     [(39, 57.4, 65.8), (106, 4, 6)], "media", "nuovo", ("P06",))
voce("O12", "Lenti / sfere di vetro",
     "Sfere scure con riflesso e un'immagine dentro, disposte a fiore o ad anello.",
     "Rack focus d'apertura, rotazione lenta.",
     "Punti di vista, angoli, categorie.",
     "glassOrb(parent, cx, cy, r, media, {iris}) · orbFlower(parent, cx, cy, medias, {r, R, k0, links, dim}).show · .spin · .focus(i, t) · .all(t) — sfere di vetro con reel veri, raggi dal tema agli angoli.",
     [(39, 3, 11), (49, 0, 3.4)], "media", "kit")
voce("O13", "Cervello luminoso",
     "Cervello 3D grigio che si accende (rosso/verde) quando 'scatta' qualcosa.",
     "Accensione 0,2 s + pulse.",
     "Psicologia, dopamina, attenzione, memoria.",
     "brain() — nel kit: cervello a raggi X vero da Adobe Stock (bianco → lime).",
     [(79, 0.9, 2.2), (22, 47, 55), (34, 15, 20)], "alta", "kit", ("P13",))
voce("O14", "Slot machine / casinò",
     "Slot 3D con rulli che girano; spesso al centro di un anello di reel.",
     "Rulli 0,6–1 s.",
     "Dipendenza, ricompensa variabile, \"come al casinò\".",
     "slotMachine() — nel kit: slot vera da Adobe Stock in grafite; i rulli mostrano le ricompense di Instagram (cuore, commento, follower) e si fermano in tris.",
     [(79, 7, 11), (118, 26, 33)], "media", "kit", ("P13",))
voce("O15", "Clessidra",
     "Clessidra con sabbia che scende; si capovolge per 'resettare'.",
     "Flip 0,5 s.",
     "Tempo, attenzione che scade, \"in tre secondi\".",
     "hourglass(parent, cx, cy, h).show · .run(t, dur) · .flip(t) — vetro con la sabbia lime, si capovolge in 0,5 s (reel 60) e riparte senza salti.",
     [(60, 12, 27)], "rara", "kit")
voce("O16", "Acqua: sasso e onde",
     "Superficie d'acqua 3D; un oggetto cade, onde concentriche, etichetta su linea guida.",
     "Caduta 0,5 s · onde 1 s.",
     "Effetto a catena, condivisioni, portata (\"piccole onde\").",
     "water(parent, cx, cy, w, {k}).show · .ripples(t, x, y, {n, r}) · .splash(t, x, y) — acqua scura in prospettiva, onde bianche col bordo lime; con faceDot i volti si accendono quando l'onda arriva.",
     [(65, 18.3, 24.4), (100, 94, 99)], "rara", "kit", ("P08",))
voce("O17", "Onda che inghiotte",
     "Una superficie che sale e fa affondare gli elementi uno per uno.",
     "Ogni elemento affonda in 0,8 s, diventa traslucido.",
     "Saturazione, \"vengono sommersi\", ciò che diventa obsoleto.",
     "sinkWave(parent, x0, x1, y, {amp}).show(t, dur) · .rise(t, dy, dur) · .sink(nodo, t) — onda in grafite col bordo lime che sale; gli elementi affondano in 0,8 s e diventano traslucidi.",
     [(32, 30, 41)], "rara", "kit")
voce("O18", "Tubo al neon che si disegna + riflesso che corre",
     "Un percorso (∞, logo, freccia) disegnato come tubo luminoso cilindrico (bordo, corpo, anima chiara, filo speculare); un riflesso a cometa (testa bianca + scia) lo percorre.",
     "Tracciatura ~1,8 s · riflesso: giro in 1,6 s.",
     "Cicli, loop, sistemi che si ripetono (\"il ciclo della dipendenza\").",
     "neonPath(d) — nuovo.",
     [(16, 59.6, 66.8), (79, 4.5, 6.5)], "media", "nuovo", ("P06", "P13"))
voce("O19", "Costellazione di punti",
     "Linee sottili con punti luminosi ai vertici ed etichette, disegnate punto per punto.",
     "0,2 s per tratto.",
     "Mappe di momenti (hook, rehook, CTA) o di relazioni.",
     "constellation(parent, S, punti, etichette, {fs, lato}).draw(t, 0.2) — tratti sottili bianchi, punti lime luminosi, etichette che si scrivono.",
     [(60, 5, 10)], "rara", "kit")
voce("O20", "Radar",
     "Spicchio luminoso che ruota attorno a un avatar; quando passa, compaiono elementi sul bordo.",
     "360° in ~2,5 s costanti.",
     "Ricerca, scoperta, \"chi ti trova\", analisi.",
     "radar() — nuovo.",
     [(46, 6.2, 8.8), (105, 0, 4)], "media", "nuovo", ("P08",))
voce("O21", "Anelli orbitali di persone",
     "Avatar al centro, anelli di puntini-persona che si popolano e cambiano colore.",
     "Puntini a gruppi · cambio colore a onda.",
     "Pubblico, chi ti segue, chi se ne va.",
     "Nel kit (reel-01 S4b).",
     [(44, 7, 9), (5, 16, 18)], "alta", "kit", ("P08",))
voce("O22", "Folla in un riquadro con contatore",
     "Griglia di icone-persona in un box con contatore; si infittisce, si colora, esplode.",
     "Contatore lineare · cambio colore a gruppi.",
     "Quante persone vedono/seguono/comprano, l'algoritmo che distribuisce.",
     "crowd() — nuovo.",
     [(40, 6, 24), (135, 4, 6)], "media", "nuovo", ("P08", "P12"))
voce("O23", "Griglia di 100 puntini",
     "10×10 puntini che compaiono a onda; alcuni si accendono a caso; cambio di colore secco.",
     "Onda 0,5 s · accensioni ~2 s · cambio colore in 1 fotogramma.",
     "Percentuali (\"8 su 10\", \"meno del 15%\", \"il 99%\").",
     "dotGrid() — nuovo (perfetto per 70/20/10 e 8 su 10).",
     [(88, 39, 46.5)], "rara", "nuovo", ("P12",))
voce("O24", "Calendario che si riempie",
     "Mese a griglia; i giorni ricevono un reel vero in movimento uno dopo l'altro (reel 68, 59) oppure si colorano (reel 82, 67, 94). La versione con i reel è la più forte.",
     "Reel nei giorni: ~0,055 s per giorno, il mese si riempie in ~1,6 s, in ordine · colorazione: ~30–50 ms per giorno.",
     "\"30 giorni di contenuti\", piani, frequenza di pubblicazione.",
     "calendar() — nuovo (alta priorità: tanti tuoi script parlano di pianificazione).",
     [(67, 54, 56), (94, 22, 26), (139, 58, 66)], "media", "nuovo", ("P11",))
voce("O25", "Telefono / tablet / lavagna come schermo",
     "Dispositivo con UI vera dentro; la camera ci entra o lo segue.",
     "Ingresso 0,4–0,6 s.",
     "Esempi, app, database, risultati.",
     "whiteboard(parent, cx, cy, voci).show · .panel(i, t) · .panelRect(i) (lavagna bianca vera) · tablet(parent, X, Y, {w, h}).screen · .at(x, y) · igPhone() — dispositivi con UI e reel veri.",
     [(74, 0, 10), (20, 8, 18)], "alta", "kit", ("P10",))
voce("O26", "Figura umana 3D (una persona col telefono)",
     "Una figura umana 3D neutra (grigia o bianca, senza volto) che guarda il telefono: rappresenta lo spettatore. Spesso un pallino o un lucchetto sopra la testa, un cervello che si accende, una linea che arriva dal telefono.",
     "Entra in 0,4–0,5 s (blur → nitida); resta mentre la camera deriva.",
     "\"Chi guarda\", lo spettatore che scorre, il cliente che arriva sul profilo, davanti alla telecamera.",
     "figure3d(parent, cx, base, h, {colori}).show · .glow · .attenzione · .phoneXY() — figura in argilla bianca col telefono (foto Pexels 9558694, obj-persona).",
     [(18, 10, 11.5), (52, 23, 25), (62, 2, 4.5)], "media", "kit", ("P13",))
voce("O27", "Amo da pesca che aggancia (il hook)",
     "Un amo scende su una curva (filo luminoso) verso l'oggetto da agganciare (una bolla di testo, un pesce, un reel), lo aggancia e lo tira su: la metafora letterale del \"hook\".",
     "Discesa ~0,6 s su un arco · aggancio con un piccolo colpo · risalita ~0,5 s.",
     "Hook che aggancia lo spettatore, la frase che tiene, \"il gancio\".",
     "hookCatch(parent, x, wy, {ah, d, depth, altri}).show · .swim(t, dur) · .snap(t, su) — l'amo vero (obj-amo) sott'acqua, chi scorre nuota, abbocca e viene tirato su.",
     [(76, 20, 27), (100, 94, 99)], "rara", "kit", ("P08",))
voce("O28", "Blocchi che si impilano in una torre (i pezzi)",
     "Blocchi 3D (cubi, mattoncini, pill spesse) cadono uno sull'altro e formano una torre: ogni blocco è un componente con etichetta; un blocco può cambiare colore (variante) o uscire.",
     "Ogni blocco cade in ~0,35 s con un piccolo rimbalzo; ~0,15 s tra un blocco e l'altro.",
     "I pezzi di un sistema (cinque pezzi di un profilo, i componenti di un video), combinare le parti.",
     "brickTower(parent, S, cx, base, etichette, {w, h, lw, fs}).drop(i, t) · .say(i, t) — mattoncini in grafite che si impilano, etichetta sfocata che va a fuoco, il mattoncino si accende.",
     [(90, 12, 30), (5, 89, 97), (150, 31, 34)], "media", "kit", ("P06",))
voce("O29", "Testa di profilo con il cervello dentro",
     "La sagoma di una testa di profilo (nera su un disco luminoso, o rosa) con il cervello visibile dentro, che si accende: le emozioni e le decisioni dentro la testa di chi guarda.",
     "La sagoma entra ~0,4 s; il cervello si accende ~0,3 s con un pulse.",
     "Psicologia di chi guarda: \"comprano per come si sono sentiti\", il cervello cablato per le storie.",
     "headBrain(parent, cx, cy, h, {visibile}).show · .on · .brainXY() — profilo in grafite sul disco bianco con il cervello vero dentro che si accende.",
     [(48, 1, 4), (55, 10, 11.5), (62, 2, 4)], "rara", "kit", ("P13",))
voce("O30", "Bivio: la strada si divide in due rami luminosi",
     "Una strada luminosa in prospettiva si divide in due rami; un ramo si accende (o un'auto/una pallina con i fari lo percorre) mentre l'altro resta spento; la camera segue il ramo scelto.",
     "Strade che si disegnano ~0,8 s · ramo scelto che si accende ~0,4 s · la camera segue il ramo ~1 s.",
     "Una scelta, la finta (\"pensi che vada da una parte e invece…\"), due strade per crescere.",
     "forkPath(parent, S, x, yb, yf, {dx, dy, labels}).draw(t) · .choose(i, t) — il bivio (si può scegliere un ramo e poi l'altro).",
     [(62, 31, 39), (79, 54, 60)], "rara", "kit", ("P05",))
voce("O31", "Razzo che decolla",
     "Un razzo (o un logo che diventa razzo) si accende e decolla con la fiammata; il numero (views, follower) sale con lui.",
     "Accensione ~0,3 s · decollo ~0,6 s (power2.in) con la scia.",
     "Crescita improvvisa, \"raddoppi le visualizzazioni\", il lancio di qualcosa.",
     "rocket(parent, cx, cy, h).show · .ignite(t, dur) · .liftoff(t, dy, dur) — il razzo vero (obj-razzo, cromo) con la fiamma lime, il fumo e le linee di velocità.",
     [(45, 3, 7), (59, 0, 3)], "rara", "kit", ("P01", "P12"))
voce("O32", "Cartella che si apre a ventaglio",
     "Una cartella (o un mazzo) si apre e i file/le card escono a ventaglio, numerati; spesso è la risorsa da mandare nei DM.",
     "Apertura ~0,3 s · le card escono a ventaglio con 0,05 s di sfasamento.",
     "La risorsa del \"Commenta X\", un archivio di esempi, il materiale grezzo.",
     "fanFolder(parent, cx, cy, file, {w, h, etichetta}).show · .fan(t) · .close(t) — cartella in grafite, le pagine vere escono a ventaglio.",
     [(30, 77, 80), (58, 84, 88), (60, 108, 110)], "rara", "kit", ("P14",))

# ═══ D · DATI E GRAFICI ═══════════════════════════════════════════════════════════════════
voce("D01", "Contatore + grafico che si disegna + bagliore finale",
     "Card in vetro: il numero conta in modo lineare mentre la linea verde sale; al valore finale il numero 'brilla'.",
     "Conteggio lineare 0,75–1 s, si ferma sulla parola · punto con anello sul vertice · flash di glow 0,25 s.",
     "Risultati, crescita, soldi, follower.",
     "counter() nel kit + statCard() nuovo.",
     [(9, 10, 13.9), (30, 0, 3)], "altissima", "nuovo", ("P01", "P12"))
voce("D02", "Badge views che poppano in sequenza",
     "Pill con occhio e numero sotto ogni reel, una dopo l'altra.",
     "Distanza 0,07–0,1 s · scala 0,8→1 con lieve rimbalzo.",
     "Prova sociale su esempi.",
     "viewBadge() — nuovo.",
     [(1, 0.85, 1.2)], "altissima", "nuovo")
voce("D03", "Curva che si disegna con etichette e camera che la segue",
     "Assi a L, curva luminosa che si traccia, punti ed etichette a pill; la camera si sposta sull'etichetta attiva.",
     "Curva ~1,2 s costante · etichette sulla parola.",
     "Andamenti (retention, crescita, arco narrativo).",
     "lineChart(parent, x0, y0, punti, {ghost, area, bars, playhead, yTicks, xTicks}) — playhead: barra a segmenti sotto l'asse che avanza con la punta (reel 110).",
     [(110, 4, 11.3), (64, 71, 77)], "media", "kit", ("P08", "P12"))
voce("D04", "Retention che crolla",
     "Telefono/card con la curva di retention che precipita (rossa).",
     "Caduta 0,5 s.",
     "\"Le persone scorrono via\", hook sbagliati.",
     "retention() — nuovo.",
     [(18, 0, 1.2), (52, 0, 1.2)], "alta", "nuovo", ("P09",))
voce("D05", "Barre con avatar in cima",
     "Grafico a barre che crescono; avatar sopra ogni barra; la vincente si colora.",
     "Crescita 0,5 s sfalsata.",
     "Confronti fra creator, strategie, risultati.",
     "barChart() — nuovo.",
     [(38, 4, 6), (99, 6, 9), (59, 123, 127)], "media", "nuovo", ("P05",))
voce("D06", "Barra di avanzamento / timeline del video",
     "Barra che si riempie (spesso a segmenti colorati) con tempi o lucchetti.",
     "Riempimento lineare.",
     "Durata, momenti del video, progressi.",
     "progressBar() — nuovo.",
     [(24, 33, 36), (115, 71, 75)], "media", "nuovo")
voce("D07", "Formula che si compone",
     "Numeri e operatori che arrivano uno alla volta fino al risultato (che conta e brilla).",
     "Ogni termine 0,25 s · risultato con counter.",
     "Moltiplicazioni e calcoli (\"5 × 10 × 7 = 350\").",
     "equation() — nuovo (tre tuoi script lo usano).",
     [(117, 49, 53)], "rara", "nuovo", ("P07",))
voce("D08", "Gauge semicircolare",
     "Tachimetro con lancetta.",
     "Lancetta 0,6 s.",
     "Da evitare nel tuo stile (bocciato in reel-01). Al suo posto: D01 o O23.",
     "—",
     [(2, 16, 20)], "rara", "post")
voce("D09", "Percentuale al centro di un anello di persone",
     "Le persone dell'anello si colorano mentre la percentuale al centro sale.",
     "Conteggio 1 s.",
     "Quote di pubblico, tassi.",
     "peopleRings(…, {percent: true, volti}).pct(t, da, a, dur) — la percentuale al centro sale e la stessa quota di volti si colora di lime.",
     [(24, 15, 17)], "rara", "kit", ("P12",))
voce("D10", "Anello di progresso che si riempie",
     "Attorno a una foto profilo o a un numero, un anello che si riempie (a spicchi o continuo) fino al valore detto, con il bagliore sul bordo che avanza.",
     "Riempimento ~1 s (lineare o power1.out) sincronizzato al numero al centro.",
     "Quanto manca, completamento (2 su 5), un tempo che scorre, la quota raggiunta.",
     "progressRing(parent, cx, cy, r, {w}).show · .to(f, t, dur) · .at(f) — arco lime attorno alla foto vera, le icone nascono sul bordo.",
     [(46, 6, 8), (59, 32, 34), (88, 2, 3)], "rara", "kit", ("P12",))
voce("D11", "Corsa: curve o barre che salgono a velocità diverse",
     "Più curve (o triangoli su binari verticali) salgono insieme a velocità diverse, con la foto di chi corre sulla punta: una va molto più su delle altre e si accende, le altre restano basse e grigie.",
     "La corsa dura ~1,2–1,5 s (le curve hanno pendenze diverse); la vincente si accende alla fine.",
     "Chi supera chi (\"un minimo di ordine e li superi\"), l'outlier che corre più degli altri.",
     "raceChart(parent, x0, y0, linee, {w, h, mesi}).axes(t) · .run(t, dur) — le teste (volti veri, la tua lime) avanzano insieme nel tempo, la tua supera le altre.",
     [(65, 4, 6.5), (94, 96, 100), (82, 90, 93)], "rara", "kit", ("P05", "P12"))
voce("D12", "Scala a gradiente con il cursore",
     "Una barra a gradiente (da peggio a meglio, rosso → verde) con le tacche e le etichette; un cursore scorre e si ferma sul punto detto, che si accende.",
     "Cursore che scorre ~0,6–0,8 s (power3.out) con una piccola frenata.",
     "Percentili e livelli (\"sei nel 99%… nel primo 10%\"), da basso ad alto, valutazioni.",
     "gradientScale(parent, x, y, w, h, {n, etichette}).show · .fill(t, f, dur) · .cursor(t, f, testo, dur) — scala dal grafite al lime in colori pieni con il cursore.",
     [(12, 15, 19), (92, 12, 15), (130, 24, 29)], "rara", "kit", ("P03", "P12"))
voce("D13", "Termometro verticale che si riempie",
     "Una barra verticale accanto a una scala o a un elenco si riempie dal basso fino al livello attivo (\"più fiducia\" in alto), con il bagliore sulla punta.",
     "Riempimento ~0,6 s per livello, sincronizzato alla camera che sale.",
     "Fiducia che cresce gradino per gradino, valore accumulato.",
     "thermo(parent, x, yTop, yBot, {w, etichette}).show · .to(t, f, dur) — tubo di vetro col bulbo, il lime pieno sale accanto alla scala.",
     [(72, 9, 13), (111, 65, 73)], "rara", "kit", ("P03",))
voce("D14", "Forma d'onda audio",
     "Una forma d'onda (la voce, un suono) che si disegna e pulsa; si colora quando si parla della voce giusta, a volte con etichette sui picchi.",
     "La forma d'onda scorre/pulsa in continuo; il cambio di colore ~0,3 s.",
     "Voce, registrazione, audio, \"registra tre volte\".",
     "waveform(parent, x, y, w, h, {n, prese}).play(t, dur) · .take(i, t) · .dim(i, t) · .takeX(i) — forma d'onda a prese con la testina lime.",
     [(114, 4, 5.5), (127, 34, 47), (36, 17, 23)], "rara", "kit", ("P04",))

# ═══ U · UI E PRODOTTI ════════════════════════════════════════════════════════════════════
voce("U01", "Chat AI ricreata + prompt che si digita",
     "Logo, frase di benvenuto, barra che si allarga e diventa area di testo; il prompt si scrive mentre lo dice.",
     "Barra 0,25 s · digitazione ~20 caratteri/s · camera che segue il cursore.",
     "\"Chiedi a Claude / ChatGPT...\" (tuoi script 02/10, 15/10).",
     "chatUI() — nuovo.",
     [(6, 7.1, 10.9), (66, 4, 7)], "alta", "nuovo", ("P04",))
voce("U02", "Profilo Instagram con numeri che salgono",
     "Profilo vero o 'scheletro' con follower che contano in una pill d'accento; celle della griglia evidenziate.",
     "Conteggio 0,7–1 s.",
     "Profilo, bio, griglia, crescita (tuoi script 04, 05, 06, 08, 13/10).",
     "igPhone() nel kit — aggiungere pill follower e modalità scheletro.",
     [(9, 0, 2), (3, 5, 7), (143, 13, 30)], "altissima", "aggiornare", ("P10",))
voce("U03", "Cursore che clicca",
     "Puntatore che si muove e clicca un pulsante (che cambia stato).",
     "Spostamento 0,3 s · clic con piccolo 'press'.",
     "Tutorial su app e impostazioni (bozze, reel di prova, impostazioni).",
     "cursor() — nuovo (finger() c'è per il tocco).",
     [(65, 18.3, 20.3), (133, 14, 16)], "media", "nuovo", ("P04", "P10"))
voce("U04", "Interruttori che si accendono",
     "Toggle che passano su 'on' (verde) uno dopo l'altro.",
     "0,15 s ciascuno.",
     "Impostazioni da attivare (tuo script delle 5 impostazioni).",
     "toggle() — nuovo.",
     [(95, 32, 35), (136, 35, 36)], "rara", "nuovo", ("P04", "P10"))
voce("U05", "Card dati in vetro",
     "Card scura lucida (Inbox, Revenue, Views) con numero grande ed etichetta.",
     "Ingresso da destra con la camera 0,6 s.",
     "Risultati e prove.",
     "statCard(parent, x, y, {label, icon, hidden}).slideIn(t, {from}) · .count(t, da, a, dur) — la card entra di lato in corsa (reel 9); velo bianco sotto la linea.",
     [(9, 10, 14)], "altissima", "nuovo", ("P12",))
voce("U06", "Lower third con barra d'accento",
     "Nome in maiuscolo monospazio con barra verticale d'accento, testo che si decodifica.",
     "0,25 s.",
     "Presentare una persona/fonte.",
     "lowerThird(parent, x, y, nome, sotto, {fs}).show(t) — barra lime verticale + nome in maiuscolo spaziato che si decodifica (0,25 s).",
     [(149, 3.5, 4.4)], "rara", "kit")

voce("U07", "Dito che preme un bottone (UI Instagram)",
     "Cerchio bianco traslucido con bordo che entra dal basso, scivola sul bottone e preme (si schiaccia + anello bianco); il bottone cambia stato. Dal tuo vecchio stile: Kallaway usa il cursore (U03), per le schermate del telefono resta il dito.",
     "Spostamento 0,24–0,3 s (power2.inOut) · pressione 0,07 s a 0,74 + ritorno 0,24 s (back.out) · anello 0,45 s.",
     "Ogni tutorial su Instagram: tre puntini → Duplica, Reel di prova, impostazioni da attivare, bozze (regola dell'utente: il dito che preme è importante).",
     "tapFinger() — kw-kit/kit2-ui.js.",
     [(65, 18.3, 20.3)], "rara", "kit", ("P04", "P10"))
voce("U08", "Impostazioni di Instagram con interruttori veri",
     "Telefono scuro con la schermata Impostazioni (ricerca, sezione, righe con icona, titolo, descrizione e interruttore iOS); le righe giuste si accendono di lime una dopo l'altra, la tab bar mostra la tua foto profilo vera.",
     "Interruttore 0,18 s (colore) + pomello 0,26 s (back.out) · camera stretta sulle righe, poi passa all'effetto (parentesi → dato → tag).",
     "\"Attiva queste impostazioni\" (Condividi su Facebook, comparsa su Google, account simili), privacy, notifiche.",
     "igSettings() + phone2() + iosSwitch() — kw-kit/kit2-ui.js.",
     [(136, 35, 36.5), (95, 32, 35)], "rara", "kit", ("P04", "P10"))
voce("U09", "Notifica DM con la foto profilo vera",
     "Banner di iOS che scende dall'alto: la tua foto profilo vera con il badge di Instagram, il tuo nome, \"ti ha inviato: …\" con l'icona del file; si accende di lime. Chiude il \"Commenta X e ti mando…\".",
     "Discesa 0,5 s (expo.out) · alone lime 0,3 s · la risorsa dietro si abbassa al 45%.",
     "Chiusura con la parola da commentare (X01): mostra che la risorsa arriva davvero in DM.",
     "igNotif() — kw-kit/kit2-ui.js.",
     [(1, 111, 116)], "rara", "kit", ("P14",))
voce("U10", "Bozze di Instagram: tre puntini → Duplica (con la lente)",
     "Telefono con la schermata Bozze (reel grandi a 2 colonne con la tua copertina vera); il dito tocca i ⋯, sale il foglio Modifica / Duplica / Elimina, una lente vera ingrandisce \"Duplica\", il dito la preme e la bozza si divide: la copia scivola accanto e compaiono i numeri 1 e 2. Dal tuo vecchio stile (03/10), rifatto nello stile Kallaway.",
     "Foglio 0,45 s (expo.out) · lente 0,42 s (power3.out) · divisione: lampo sulla cucitura 0,45 s + copia 0,5 s (back.out) · numeri 0,4 s (back.out).",
     "Tutorial su reel di prova, bozze, duplicare un contenuto (03/10, 16/10, 09/09).",
     "igDrafts() + lens() + tapFinger() — kw-kit/kit2-ui.js.",
     [(65, 18.3, 20.3)], "rara", "kit", ("P04", "P10"))
voce("U11", "Nuovo reel: interruttore \"Reel di prova\" e Condividi",
     "Schermata \"Nuovo reel\" (copertina, didascalia, opzioni) con la riga \"Reel di prova · Solo per chi non ti segue\": il dito accende l'interruttore (riga lime), preme Condividi e il reel esce dal telefono con l'etichetta PROVA (o NORMALE); toast lime \"Bozza salvata\" quando salvi in bozza. Si alterna con le Bozze come cambio di schermata.",
     "Interruttore 0,18 s + pomello 0,26 s · pressione 0,07 s + ritorno 0,25 s · toast 0,45 s (back.out) · reel che esce 0,6 s (power3.inOut).",
     "Pubblicare come prova vs normale, salvare in bozza, qualsiasi passaggio di pubblicazione.",
     "igShare() + igToast() + tapFinger() — kw-kit/kit2-ui.js.",
     [(65, 18.3, 20.3)], "rara", "kit", ("P04", "P10"))
voce("U12", "Azioni del reel che si accendono (like, commenti, condividi, salva)",
     "La colonna di azioni di un reel di Instagram: l'icona detta (salva, condividi) si accende con un piccolo colpo e il contatore sotto sale.",
     "Accensione ~0,2 s con un pop; contatore ~1 s.",
     "Salvataggi e condivisioni, \"se la guardano viene spinta\", raddoppiare le visualizzazioni.",
     "reelActions(parent, x, y, conti, {gap, size}).show · .on(i, t, da, a) — cuore, commento, invia, salva che si accendono di lime e i numeri che salgono.",
     [(22, 0, 7), (119, 51, 56)], "rara", "kit", ("P10",))
voce("U13", "Commenti o notifiche che si moltiplicano",
     "Commenti (o notifiche) spuntano uno dopo l'altro attorno al telefono o al reel e si moltiplicano fino a una nuvola: l'effetto della CTA, o il sovraccarico.",
     "Un commento ogni ~0,08 s che accelera, ognuno con un pop e una leggera deriva verso l'alto.",
     "\"Commenta X\" che funziona, una pioggia di DM, la risposta del pubblico.",
     "commentBurst(parent, rett, righe, {fs}).burst(t, dur) — commenti con i volti veri che arrivano sempre più in fretta.",
     [(123, 26, 27.5), (89, 16, 20)], "rara", "kit", ("P14",))
voce("U14", "Mirino della fotocamera (angoli, REC, batteria)",
     "L'inquadratura diventa il mirino di una videocamera: angoli bianchi, pallino REC rosso che lampeggia, tempo che scorre, batteria, ISO/f.",
     "Il mirino si apre in ~0,3 s (gli angoli scivolano in posizione); REC lampeggia a 1 Hz.",
     "Davanti alla telecamera, registrare, la luce e la fotocamera.",
     "viewfinder(parent, [x0, y0, x1, y1]).show · .rec(t, dur) · .focus(t, x, y) — mirino vero (angoli, REC, timecode, 4K · 30, AF).",
     [(144, 0, 15)], "rara", "kit", ("P04",))
voce("U15", "Timer, conto alla rovescia",
     "Un timer (cerchio che si svuota o cifre che scorrono, 60:00 → …) accanto all'oggetto: misura il tempo detto.",
     "Le cifre scorrono a ritmo reale o accelerato; il cerchio si svuota in modo lineare.",
     "\"In 60 secondi\", \"30 giorni in 30 minuti\", \"360 contenuti in 60 minuti\".",
     "stopwatch(parent, cx, cy, d, {start, unita}).show · .run(t, dur, da, a, totale) — cronometro d'acciaio con l'arco lime e il numero.",
     [(11, 10, 14), (13, 17, 20), (146, 1, 3)], "rara", "kit", ("P01", "P11"))
voce("U16", "Storie di Instagram: fila, editor, storia aperta (UI del vecchio stile)",
     "Nuova, nello stile di U10/U11 (regola dell'utente sulle funzioni di Instagram): la home con la fila delle storie (cerchi con l'anello a gradiente = da vedere, grigio = vista, lime = spinta), l'editor con \"La tua storia\" che il dito preme, la storia aperta con la barra a segmenti, nome e ora, \"Invia messaggio\", cuore e condividi. Il cerchio si apre nella storia (zoom dal cerchio) e la storia si richiude nel cerchio.",
     "Apertura dal cerchio 0,3 s (power3.out) · la barra si riempie a velocità costante · scorrimento a cubo 0,42 s · like con i cuoricini che salgono in 0,9 s.",
     "Gli script sulle storie (10/10 l'algoritmo delle storie, 13/10 le storie in evidenza), chi guarda e cosa fa (apre, resta, scorre, reagisce).",
     "kit2-storie.js: igHome(parent, X, Y, {storie, post, user}) · igStoryEdit(…, {media, user}).yourXY() .press(t) · igStoryView(…, {user, nome, quando, media, segs}).play(t, dur, {da, a}) .like(t) .reply(t, testo) .sent(t) .share(t) .swipe(t, prossima) .barRect() · storyCircle(parent, cx, cy, d, src, {ring}).seen/.lime/.ig · storyRow(…, {panel}).",
     [(65, 18.3, 20)], "rara", "kit", ("P10",))
voce("U17", "Orologio: le lancette corrono (l'ora)",
     "Nuova, nello stile del cronometro U15: quadrante d'acciaio con le ore, le lancette corrono avanti di qualche ora e attorno gli orari veri (pill con la tua foto) si accendono al passaggio; poi tutto in grigio quando l'ora \"non conta\".",
     "Comparsa 0,45 s (back.out) · lancette 0,75 s (power2.inOut) per 7 ore · pill che si accendono una ogni 0,15 s.",
     "\"Non conta l'ora\", l'orario di pubblicazione, \"a qualsiasi ora\".",
     "kit2-storie.js: orologio(parent, cx, cy, d, {ora, min}).show(t) · .spin(t, dur, ore, ease) · .off(t).",
     [(11, 10, 14)], "rara", "kit", ("P11",))

# ═══ C · CONNETTORI E SEGNALI ═════════════════════════════════════════════════════════════
voce("C01", "Linea che si allunga mentre la camera viaggia",
     "Il connettore cresce verso l'oggetto successivo e la camera lo segue.",
     "Durata = durata del movimento di camera.",
     "Sempre, quando si passa da A a B collegati.",
     "connector().draw() sincronizzato a cam().",
     [(79, 0.75, 1.3)], "altissima", "kit")
voce("C02", "Linea che diventa flusso di puntini",
     "Sulla parola la linea si trasforma in una catena di puntini luminosi che scorre.",
     "Propagazione 0,15 s · flusso continuo.",
     "Traffico, persone che passano da un posto all'altro.",
     "connector().flow() — nuovo.",
     [(94, 57.5, 59.0)], "media", "nuovo", ("P08",))
voce("C03", "Segnale con segno che viaggia",
     "Un cerchietto con +/− percorre la linea (dato positivo/negativo).",
     "≈0,4 s.",
     "Algoritmo che riceve un segnale buono/cattivo.",
     "signal(parent, connettore, t, dur, {sign: '+' | '-', back}).",
     [(40, 35.5, 36.3)], "rara", "kit", ("P08",))
voce("C04", "Linea guida con etichetta che si scrive sopra",
     "Linea sottile che esce da un punto; l'etichetta si scrive parola per parola sopra la linea.",
     "Linea 0,4 s · parole sulla voce.",
     "Etichettare parti di un oggetto (anelli, livelli, punti di un grafico).",
     "leader() — nuovo.",
     [(91, 26, 29), (4, 0, 5)], "alta", "nuovo")
voce("C05", "Circuito ad angoli retti",
     "Linee a 90° (circuito) che collegano un centro a vari nodi.",
     "0,3 s.",
     "Sistemi, integrazioni, \"tutto collegato\".",
     "circuit(S, a, b, {prima: \"h\" | \"v\"}).draw(t, 0.3) · .pulse(t, dur, parent) — linee a 90° col gomito arrotondato e l'impulso che corre.",
     [(49, 2.4, 3.0)], "rara", "kit")
voce("C06", "Pill dell'algoritmo in stile codice che riceve i segnali",
     "La pill <Algorithm/> del reel 40: testo monospaziato che si decodifica, bordo luminoso; le linee la collegano al telefono e al pubblico di prova, i segnali + e − ci arrivano e lei reagisce (lampo lime per il +, bordo grigio per il −).",
     "Decodifica ~0,45 s con un piccolo disco dietro · un lampo per segnale (0,08 s su, 0,4 s giù).",
     "Ogni volta che si spiega cosa fa l'algoritmo: misura, decide, spinge o affossa.",
     "kit2-storie.js: algoPill(parent, cx, cy, {testo, fs}).show(t) · .flash(t, \"+\" | \"-\") + signal(…, {sign, back}) sui connettori.",
     [(40, 0, 2.2), (40, 6, 24)], "media", "kit", ("P08",))

# ═══ F · LUCE, GLOW ED ENFASI ═════════════════════════════════════════════════════════════
voce("F01", "Glow (bloom) su testi e oggetti",
     "Tutto ciò che è luminoso ha un alone morbido; gli oggetti al neon molto di più dei testi.",
     "Testo bianco: alone medio σ≈7 px (eccesso ~0,11–0,16) + largo σ≈42–50 px (~0,07–0,10) · oggetti neon/accento: σ≈8–11 (~0,3+) + σ≈50–90 (~0,12–0,24).",
     "Sempre.",
     "GLOW_W / GLOW_L nel kit — ricalibrare sui valori misurati.",
     [(79, 0.9, 1.0), (23, 6, 7)], "altissima", "aggiornare")
voce("F02", "Pulse a disco pieno",
     "Disco pieno del colore d'accento con contorno chiaro sottile: nasce da un punto, si espande e svanisce.",
     "Espansione 0,2 s ease-out + allargamento lento e dissolvenza 0,4–0,5 s · dietro (o davanti al 65%) · spesso con push-in +3–5%.",
     "Sulla parola-chiave del concetto (\"addictive\", \"non-obvious\") e per far nascere un'etichetta.",
     "pulse(x, y, t, r) — nuovo (ripple() del kit fa solo l'anello).",
     [(79, 1.15, 1.8), (7, 6.2, 6.8), (14, 1.0, 1.5)], "altissima", "nuovo")
voce("F03", "Sheen (banda di luce)",
     "Riflesso diagonale che attraversa card e barre appena arrivate o appena 'risolte'.",
     "Banda ~40 px, ~20°, 0,7–0,9 s.",
     "Arrivo di card importanti, risoluzione di una voce.",
     "sheenK(card, t, {dur, w, dir}) — banda bianca stretta da destra a sinistra in 0,7 s (sheen() resta per i reel vecchi).",
     [(5, 34, 35)], "altissima", "kit")
voce("F04", "Riflettore + oscuramento del resto",
     "Gli elementi scelti si illuminano (alone colorato), tutto il resto scende al 40–60%.",
     "≈0,4 s.",
     "Selezione (\"questi sono i migliori\"), focus su uno tra tanti.",
     "spotlight() — nuovo.",
     [(61, 11.1, 11.7), (54, 41, 45)], "alta", "nuovo")
voce("F05", "Lampeggio di attivazione",
     "Un elemento alterna due colori ogni 1–2 fotogrammi per ~0,3 s e si ferma sul nuovo stato.",
     "≈0,3 s.",
     "\"Si attiva\", \"scatta\", passaggio da spento ad acceso.",
     "flicker(el, t, colori) — nuovo.",
     [(17, 1.0, 1.5), (107, 61.7, 62.3)], "rara", "nuovo")
voce("F06", "Onde d'urto",
     "Anelli che si allargano e svaniscono da un punto d'impatto.",
     "0,4–0,6 s, 1–2 onde.",
     "Impatto, arrivo del protagonista.",
     "ripple() nel kit.",
     [(98, 2.3, 2.9)], "alta", "kit")
voce("F07", "Raggi vivi dietro un logo",
     "Raggi morbidi dello stesso colore del logo che ruotano e respirano.",
     "±10°, lento.",
     "Presentare uno strumento/marchio protagonista.",
     "rays() — nuovo.",
     [(17, 0, 0.8), (56, 0, 1.2)], "media", "nuovo")
voce("F08", "Cambio di colore = cambio di stato",
     "Elementi grigi/bianchi che diventano accento (o verde/rosso) tutti insieme o a onda.",
     "Secco (1 fotogramma) o a onda 0,3 s.",
     "Giusto/sbagliato, chi resta/chi va, prima/dopo.",
     "Utility nel kit (tl.to backgroundColor).",
     [(88, 45.5, 46.0), (13, 8, 9)], "altissima", "kit")
voce("F09", "Mosaico / pixel",
     "Immagine a blocchi con sfarfallio di tinta: 'scansione' digitale.",
     "Blocchi 20 → 10 px, 3 fotogrammi alternati.",
     "Raro: identità, dati grezzi, \"analizzato\".",
     "pixelate(parent, x, y, w, h, idImmagine, {b0}).show(t) · .resolve(t, dur) — foto vera a blocchi su canvas (36 → 24 → 14 → 8 → nitida) con lo sfarfallio di tinta lime.",
     [(107, 61.7, 62.4)], "rara", "kit")
voce("F10", "Disintegrazione in particelle",
     "Un elemento si dissolve in polvere luminosa che si espande.",
     "≈0,6 s.",
     "\"Sparisce\", \"il video muore\", \"bruci tutto\".",
     "disintegrate(parent, nodo, x, y, w, h, idImmagine, t) — polvere su canvas, pezzi veri dell'immagine.",
     [(40, 37.2, 37.9)], "rara", "kit")
voce("F11", "Tinta rossa/verde sulle miniature",
     "Gruppi di reel si colorano (rosso = sbagliato, verde = giusto).",
     "0,2–0,3 s.",
     "Selezionare esempi buoni/cattivi.",
     "tint() — nuovo (nel brand: lime = giusto, grigio scuro = sbagliato).",
     [(136, 0, 2), (2, 7, 9)], "alta", "nuovo", ("P05",))
voce("F12", "Timbro che cala",
     "Un timbro (\"BS\", \"Wasted\", una parola) cala sull'oggetto con un colpo secco: scala da grande a normale, piccola scossa, inclinato.",
     "Discesa 0,12 s (power2.in) · colpo con scossa · resta.",
     "Un verdetto netto: falso, sbagliato, scartato (\"non è pubblicità\", \"non è un curriculum\").",
     "stamp(parent, cx, cy, testo, {w, h, rot, fs}).down(t) — timbro in inchiostro lime pieno con l'usura, colpo di camera e polvere.",
     [(80, 28, 33), (104, 98, 103)], "rara", "kit", ("P09",))

# ═══ H · MANO E ANNOTAZIONI ═══════════════════════════════════════════════════════════════
voce("H01", "Annotazioni con freccia a ricciolo",
     "Parole grandi + freccetta disegnata a mano che entrano da lati alterni con sfocatura di movimento.",
     "0,35–0,4 s l'una, una per parola detta.",
     "Elencare cosa si ottiene (\"trends, insights, patterns\").",
     "handIn(parent, x, y, parola, {side, page, pw, ph, fs}).show(t) — parola a mano + freccia a ricciolo + pagina vera, entrano dai lati alterni con la scia.",
     [(102, 34.3, 36.2), (66, 33, 37)], "media", "kit")
voce("H02", "Cerchio / freccia a mano su uno screenshot",
     "Tratto a mano dell'accento che cerchia un pulsante o un numero.",
     "Disegno 0,3–0,4 s.",
     "Tutorial: \"tocca qui\", \"guarda questo numero\".",
     "handCircle() / handArrow() — nel kit.",
     [(139, 31, 34), (57, 30, 50)], "alta", "kit", ("P04",))
voce("H03", "Tag inclinati attorno a un reel",
     "Piccole etichette inclinate con linea guida che spuntano attorno a un esempio.",
     "Pop 0,15 s sfalsati.",
     "Smontare un esempio nei suoi ingredienti.",
     "tags() — nuovo.",
     [(76, 13, 17), (109, 15, 21)], "alta", "nuovo")
voce("H04", "Angoli di selezione (mirino) che si chiudono su un elemento",
     "Quattro angoli (parentesi quadre a L) arrivano da fuori e si chiudono attorno all'elemento scelto (uno screenshot, una barra, un reel), che si stacca con il bagliore: \"è questo\".",
     "Gli angoli si chiudono in ~0,3 s (power3.out) con un piccolo rimbalzo; restano o si aprono quando si passa oltre.",
     "Scegliere una cosa tra tante (una storia in evidenza, una barra della lista, un pulsante), indicare il punto preciso.",
     "selectCorners(parent, [x0, y0, x1, y1], {len, w, pad}).show(t) · .to(t, rett) · .hide(t) — quattro angoli lime che si chiudono in 0,35 s.",
     [(56, 12, 18), (127, 25, 28), (69, 11, 13)], "media", "kit", ("P10",))

# ═══ X · CHIUSURA E CTA ═══════════════════════════════════════════════════════════════════
voce("X01", "\"Commenta X\" + anteprima della risorsa",
     "Titolo con la parola da commentare nel box d'accento + anteprima (documento, griglia di doc che si riempie a ondate, card video).",
     "Doc che arrivano a ondate (1 → 3 → 6) · 3–6 s.",
     "Chiusura di quasi ogni reel (99 su 100).",
     "ctaCard(parola, risorsa) — nuovo.",
     [(5, 118, 125), (12, 81, 87), (1, 111, 116)], "altissima", "nuovo", ("P14",))


# ═══ A · APERTURE (hook visivi) ═══════════════════════════════════════════════════════════
# Studio dei primi 3 s di tutti i 150 reel (fogli in _analisi/aperture/, ordinati per views). Nello stile attuale il 100% dei reel
# apre su un'infografica (mai sul volto, mai schermo vuoto); la prima grafica dura in mediana 3,4 s (p25 2,6 – p75 4,5) prima
# dello stacco sulla faccia. Frequenze contate sui 30 reel più visti.
voce("A01", "Muro o griglia di reel veri con badge views",
     "Dal fotogramma 0 una griglia di reel veri (2×3 o un muro che scorre); i badge views verdi poppano uno dopo l'altro mentre il titolo si scrive parola per parola.",
     "Badge ogni ~0,08 s · griglia completa entro ~1,2 s · stacco sul volto a ~3 s.",
     "Hook su formati, tendenze, \"cosa funziona\", prova sociale. È l'apertura più frequente tra i reel più visti (9 su 30).",
     "reelGrid() + viewBadge() + popSeq() + titleW() — kit v2.",
     [(25, 0, 3), (84, 0, 3), (96, 0, 3)], "altissima", "kit", ("P01", "P12"))
voce("A02", "Logo o oggetto protagonista già in scena",
     "Il fotogramma 0 mostra già l'oggetto del video (logo con raggi, icona, telefono) al centro; il titolo arriva sopra parola per parola; dopo 1–2 s l'oggetto si trasforma (diventa un profilo, un doc, un anello).",
     "Oggetto visibile da t=0 · titolo 0,1–1 s · trasformazione a ~1,8 s.",
     "Video su uno strumento o una piattaforma (Claude, Instagram, Meta). 7 su 30.",
     "appIcon() / chatUI() + titleW(); raggi vivi F07 da creare.",
     [(102, 0, 3), (66, 0, 3), (16, 0, 3)], "alta", "aggiornare", ("P04", "P10"))
voce("A03", "Documento/copione che si compila",
     "Un documento (Video Script) fioco dal fotogramma 0 che in ~1 s si riempie di righe colorate per sezione (Hook, Body, CTA): l'oggetto stesso è il risultato promesso.",
     "Righe a cascata ~20 ms l'una · tutto pieno in ~1 s.",
     "Script su copioni, hook, struttura dei video. 4 su 30 (tra cui 488K e 517K).",
     "scriptDoc().lay() + .section() — kit v2.",
     [(35, 0, 3), (100, 0, 3), (64, 0, 3)], "alta", "kit", ("P06",))
voce("A04", "Anello o orbita che si apre",
     "Reel, loghi o avatar che escono dal centro e si dispongono in cerchio ruotando; al centro nasce il concetto (pill, logo, contatore).",
     "Apertura 0,3 s (expo.out) · rotazione lenta · concetto al centro a ~1 s.",
     "\"Tutti i formati\", \"tutti i social\", \"i top creator\". 3 su 30.",
     "anello di reel (kit v1, reel-01 v4) · logoRing() · orbit() — kit v2.",
     [(101, 0, 3), (98, 0, 3), (59, 0, 3)], "media", "kit", ("P01",))
voce("A05", "Clip vera che diventa infografica",
     "Si parte da uno spezzone vero (persona, situazione) in una card; una linea porta all'oggetto-concetto (cervello con disco rosso, testa in silhouette) e la scena diventa schema.",
     "Clip 0–0,8 s · linea + oggetto 0,8–1,5 s · pulse sul concetto.",
     "Storytelling, psicologia: il reel più visto in assoluto (1,2M) apre così. 2 su 30.",
     "videoCard() + connector() + brain() + pulse() — kit v2.",
     [(79, 0, 3), (48, 0, 3)], "media", "kit", ("P13",))
voce("A06", "Tipografia gigante che diventa oggetto",
     "Parole enormi del titolo (\"PLAN\", \"30\") che occupano lo schermo e poi si ritirano per lasciare il posto all'oggetto (il calendario).",
     "Parole 0–1 s · trasformazione a ~1,2 s.",
     "Hook con un numero o una promessa forte (\"30 giorni in 30 minuti\"). 2 su 30 (477K).",
     "bigType(spec).inAt(tempi) · .retract(t, {scale, y}) + calendar(…).assemble(t, {spread}) · .fillVideos — parole giganti che diventano il titolo, il calendario si monta sotto.",
     [(139, 0, 3), (150, 0, 3)], "media", "kit", ("P01", "P11"))
voce("A07", "Profilo o UI con numeri che salgono",
     "Un profilo/una UI vera già in scena con un numero che cresce (follower, retention) mentre il titolo si scrive.",
     "Conteggio ~1 s.",
     "Risultati, casi studio, \"come sono passato da X a Y\". 2 su 30.",
     "igInsights(parent, X, Y, {media, views, delta, skip}).count(t, dur) · .curve(t, dur) · .skipOn(t) — Approfondimenti del reel veri con i numeri che salgono.",
     [(110, 0, 3), (112, 0, 3)], "media", "kit", ("P01", "P10"))
voce("A08", "Risposta sfocata indicata da una freccia",
     "Una freccia punta su un disco/etichetta con la risposta sfocata: si vede che c'è, non si legge. Curiosità pura.",
     "Freccia 0,3 s · la risposta resta sfocata fino alla parola.",
     "Hook a domanda (\"il segreto è…\"). 1 su 30 (e il reel-01 v4 usa una variante).",
     "handArrow() + listK/segnaposto sfocati — kit.",
     [(36, 0, 3)], "rara", "kit", ("P09",))

# ═══ reel 11/10 (sessione 5, "Non è la fotocamera, è la luce"): voci nuove nello stile di Kallaway (kw-kit/kit2-reel11.js) ═══
voce("O33", "Scala a gradini con la folla sulle alzate (la scala della luce)",
     "Nuova, nello stile della piramide dei livelli (reel 4) e della scala della dopamina (reel 109): 4 gradini 3D in grafite che si alzano uno dopo l'altro; sull'alzata di ogni gradino il numero, la pill del valore e una folla di 100 persone (O23) che si accende per la quota di quel livello (99 → 50 → 30 → 10) con la tua foto vera tra loro. Su ogni pedata l'attrezzatura di quel livello, spenta finché non ci arrivi; la camera sale in diagonale un gradino alla volta e scende sull'alzata per il dato.",
     "Gradini in piedi in ~0,6 s (0,1 s l'uno, back.out) · numeri 0,09 s l'uno · folla a righe 0,035–0,05 s · salita 0,85 s (KW.move) · discesa sull'alzata 0,55 s.",
     "Livelli con una percentuale per livello (\"sei nel primo 10%\"), crescita a step, \"da dove parti a dove arrivi\".",
     "kit2-reel11.js: scalaR11(parent, x0, ground, {w, r, dx, dy, pill}).rise(t, passo) · .num(i, t) · .edge(i, t, lime) · .pill(i, t) · .tread(i) · .faceRect(i) · B[i].folla = follaR11 (.accendi(t, n, colore) · .te(t) · .tinta(t, da, a, colore) · .lampo(t, n)).",
     [(4, 0, 5), (109, 4, 15), (88, 39, 46.5)], "rara", "kit", ("P03", "P12"))
voce("O34", "Stanza in prospettiva con la lampadina nuda",
     "Nuova, nello stile degli oggetti veri: una stanza vista in sezione (soffitto, pareti, pavimento in prospettiva, listelli sul fondo) che si disegna dagli spigoli; una lampadina nuda appesa al soffitto sfarfalla e si accende con un cono giallastro duro e la chiazza sul pavimento: la luce sbagliata, dall'alto.",
     "Spigoli 0,5 s · lampadina che sfarfalla 0,25 s (F05) · dondolio ±2° · ricadute di sfarfallio di 0,2 s.",
     "\"Una stanza illuminata male\", la luce sbagliata, l'ambiente prima di sistemarlo.",
     "kit2-reel11.js: stanzaR11(parent, x0, y0, w, h, {ix, iy}).show(t, dur) · .back · lampadinaR11(parent, cx, yTop, len, {w, cono, pozza}).on(t) · .sfarfalla(t) · .off(t) · .dondola(t, dur).",
     [(144, 0, 15), (17, 1.0, 1.5)], "rara", "kit", ("P03",))
voce("F13", "La luce cambia sul soggetto (dal buio al controluce)",
     "Nuova, nello stile di Kallaway: lo stesso reel vero cambia con la luce che riceve — buio e piatto, lampadina dall'alto (giallo, grana, vignetta), telefono, finestra (luce calda di lato), faro (nitido) e controluce (bordo lime e alone dietro che lo staccano dallo sfondo). Le sorgenti sono oggetti veri: faro, finestra con i fasci di sole, tubo LED lime; il mirino (U14) mostra l'ISO che sale al buio e l'autofocus che non aggancia, poi aggancia in lime con la luce giusta.",
     "Cambio di stato 0,3–0,45 s · accensioni con lo sfarfallio F05 (0,2–0,25 s) · grana che cambia ogni 0,08 s.",
     "Luce, qualità dell'immagine, \"sembrare professionale\", prima/dopo di un'attrezzatura.",
     "kit2-reel11.js: reelLuceR11(parent, x, y, w, h, vid, {stato, bare}).stato(t, \"buio\" | \"lampadina\" | \"telefono\" | \"finestra\" | \"faro\" | \"controluce\", dur) · .rim(t) · .sfarfalla(t) · .grana(t0, t1) · finestraR11(…).show · .giorno · .sole · ledR11(…).on · telefonoR11(…).rec · mirinoR11(r, {nero}).iso · .cerca · .aggancia.",
     [(17, 0.6, 2.2), (107, 61.7, 62.3)], "rara", "kit", ("P03", "P09"))
voce("D15", "Cartellino del prezzo che oscilla e conta",
     "Nuova: un cartellino di carta vero appeso con un filo all'oggetto, entra oscillando e si assesta; il prezzo conta (D01) e alla fine il più conveniente diventa lime pieno con un disco (F02).",
     "Oscillazione 1,2 s smorzata · conteggio 0,5 s · lime 0,12 s.",
     "Costi dell'attrezzatura, \"costa meno di tutte\", confronti di prezzo.",
     "kit2-reel11.js: cartellinoR11(parent, x, y, testo, {w, h, fs, filo}).show(t) · .count(t, da, a, dur, fmt) · .lime(t) (filo: 0 = legato con un connector al suo oggetto).",
     [(9, 10, 13.9)], "rara", "kit", ("P12",))

# ═══ reel 13/10 (sotto-agente della regia, 11–13/10, "Le storie in evidenza"): voci nuove nello stile di Kallaway (kw-kit/kit2-reel13.js) ═══
voce("K18", "L'oblò: la camera entra in un cerchio e ne esce",
     "Nuova, nello stile di K07 (zoom-through) + K13 (match cut: un punto diventa l'oggetto): la camera corre dentro un cerchio del mondo (una storia in evidenza, una foto profilo, un tasto) con lo zoom esponenziale; al taglio, dall'altra parte, la stanza dietro il cerchio mostra un'iride con lo stesso posto e la stessa misura sullo schermo, che si apre con la cornice d'acciaio dell'oblò mentre la copertina si dissolve nella storia vera. L'uscita è lo stesso gesto al contrario: la storia si richiude nel cerchio e la camera esce all'indietro sul profilo.",
     "Corsa nel cerchio 0,42 s (scala power2.in, posizione power2.out) · sfocatura 5 px negli ultimi 0,19 s · iride 0,42 s · assestamento 0,45 s (power2.out; più secchi dopo il confronto con i reel 50 e 46) · uscita: iride che si chiude 0,4 s e ritorno 0,6 s.",
     "Entrare in un'interfaccia o in un oggetto e tornare indietro: storie in evidenza, profili, DM, un reel dentro un altro; una grammatica di profondità per tutto un reel.",
     "kit2-reel13.js: obloInR13(t, {x, y, d}, {el, x, y, pose}, {pre, D, cover}) · obloOutR13(t, {el, x, y}, {x, y, d}, {pose, cover}) · zoomR13(t, dur, px, py, s1, {ease, easePos}) · corniceR13(parent, cx, cy, r).",
     [(50, 19.0, 19.6), (46, 5.6, 6.3), (14, 1.0, 1.5)], "rara", "kit", ("P10",))
voce("U18", "Profilo con le storie in evidenza in ordine",
     "Nuova, nello stile della UI di Instagram del vecchio stile (U02, U16): il tuo profilo visto da chi arriva, con la fila delle storie in evidenza. Le copertine a caso cadono e restano i posti vuoti numerati (come le voci-segnaposto di L01); sulla voce le copertine giuste (la tua foto, icone su lime) volano nel loro posto e l'etichetta si scrive; la fila scorre come in Instagram per gli extra. Il dito apre un'evidenza con l'anello che gira mentre carica.",
     "Caduta delle copertine 0,5 s (power2.in, a scalare 0,05 s) · posti vuoti 0,35 s · numero lime 0,35 s (back.out) · copertina in volo 0,34 s e colpo all'atterraggio · scorrimento della fila 0,6 s.",
     "Storie in evidenza, bio, \"cosa deve trovare chi arriva sul profilo\", ordine delle cose sul profilo.",
     "kit2-reel13.js: profiloR13(parent, X, Y, {user, handle, bio, grid, evidenze}).evXY(i) · .scrollTo(t, x) · .msgXY() · evidenzaR13(parent, cx, cy, d, {cover, vuoto, nome}).load(t, dur) · .numOn(t) · .fill(t, cover, nome) · dubbiR13 · tastoMsgR13 · dmR13.",
     [(3, 5, 7), (65, 18.3, 20.3)], "rara", "kit", ("P10", "P02"))
voce("F14", "Prima e dopo con la tendina",
     "Nuova, nello stile di F11 (grigio = sbagliato, lime = giusto): la griglia di un profilo prima (grigia, poche views) e dopo (lime, views alte); una tendina bianca con la maniglia scorre e scopre il dopo.",
     "Tendina 0,5 s (power2.inOut) · la card pulsa sulla parola \"prima\".",
     "Risultati di un cliente, \"prima e dopo\", casi studio.",
     "kit2-reel13.js: primaDopoR13(parent, x, y, w, h, prima, dopo, views).wipe(t, dur).",
     [(136, 0, 2), (2, 7, 9)], "rara", "kit", ("P01", "P05"))

# ═══ reel 12/10 (sotto-agente della regia, 11–13/10, "I contenuti non sono pubblicità"): voci nuove nello stile di Kallaway (kw-kit/kit2-reel12.js) ═══
voce("O35", "Il contenuto diventa un cartellone pubblicitario",
     "Nuova, nello stile degli oggetti veri e del contenuto tinto di sbagliato (F11, reel 136): il tuo reel vero prende l'interfaccia della pubblicità di Instagram (Sponsorizzato, barra \"Acquista ora\") e intorno gli cresce un cartellone su pali d'acciaio: pannello in grafite, poster di carta con \"−30%\" e \"COMPRA ORA\", lampade che si accendono con lo sfarfallio. Sul primo piano gli adesivi delle offerte calano sulla tua faccia uno dopo l'altro, il cartellino del prezzo oscilla, COMPRA ORA si gonfia; quando smetti le lampade si spengono a catena e i cartelloni crollano sul posto (le gambe cedono, il reel si sbriciola in polvere F10).",
     "Pannello che cresce 0,5–0,6 s (power2.out) mentre la camera si allarga · lampade 0,27 s (F05) · adesivi ogni 0,21 s (da 1,9× a 1 in 0,14 s) · cartellino 1,6 s smorzato · crollo 0,34 s (power2.in) + polvere 0,75 s.",
     "\"Trattare i contenuti come pubblicità\", vendere invece di dare, contenuti che diventano spot e vengono ignorati.",
     "kit2-reel12.js: cartelloneR12(parent, cx, ground, {vid, ad: [titolo, sotto, cta], fsBig, views}).adIG(t) · .build(t) · .lampsOn(t) · .lampsOff(t) · .viewsIn · .views(t, da, a) · .grey(t) · .sticker(t, testo, x, y, rot, o) · .tag(t, prezzo) · .cta(t) · .crollo(t, {rot}) · .topple(t, dir).",
     [(136, 0, 6), (103, 13, 16)], "rara", "kit", ("P09", "P05"))
voce("D16", "Il righello della proporzione che diventa l'anello attorno a te",
     "Nuova, nello stile della barra a segmenti (D06) e dell'anello che si riempie (D10): un righello d'acciaio a 10 segmenti numerati sotto una bacheca di 10 contenuti veri; sulla voce si riempiono 8 segmenti bianchi (gli 8 che danno, ognuno manda un \"+\" alla gente sotto) e 2 lime (i 2 che chiedono, con la barra \"Scrivimi\" / \"Prenota\" dentro il reel). Poi una linea porta dal righello alla tua foto vera e la stessa proporzione si chiude in un anello attorno a te: 8 segmenti bianchi + 2 lime.",
     "Numeri 0,06 s l'uno · segmenti 0,12 s l'uno (power2.out) · \"+\" 0,26 s · anello: un segmento ogni 0,065 s, i due lime 0,1 s, colpo finale 0,14 s.",
     "Proporzioni e regole \"x su 10\" (8 danno e 2 chiedono, 80/20), mix di contenuti, quote di un calendario.",
     "kit2-reel12.js: righelloR12(parent, x0, y, n, pitch, {h}).light(i, t) · .fill(i, t, \"dai\" | \"chiedi\") · .sheen(t) · .segX(i) + anelloR12(parent, cx, cy, r, {n, w, gap}).show(t) · .seg(i, t, \"dai\" | \"chiedi\") · .pulse(t).",
     [(46, 6, 8), (115, 71, 75)], "rara", "kit", ("P12", "P05"))
voce("O36", "La gente che passa e il posto del cliente che resta vuoto",
     "Nuova, nello stile delle folle di volti veri (O21/O22, reel 40): sotto i contenuti una corsia di persone (volti veri dell'atlante) che scorre a passo costante e non si ferma; sotto ogni contenuto il posto del cliente che dovrebbe arrivare (cerchio tratteggiato con la persona qualunque e il \"?\"). Il ritorno parte (\"−\", C03) e si spegne a metà strada, il contatore dei clienti resta piatto a 0 (D01). Nella regola la stessa gente si ferma, riceve il \"+\" e si accende; i posti sotto i due che chiedono si riempiono con la spunta lime e il contatore sale.",
     "Corsia 80 px/s con il passo (±6 px ogni 0,26 s) · posto che compare 0,3 s · \"?\" che sfarfalla 0,3 s · riempimento 0,3 s + spunta 0,3 s (back.out).",
     "Clienti che non arrivano, \"il ritorno\", pubblico che passa oltre, persone che diventano clienti.",
     "kit2-reel12.js: corsiaR12(parent, x0, x1, y, {volti, gap, d}).flow(t0, t1, v) · .dim · .hide + postoR12(parent, cx, cy, d).show(t) · .empty(t) · .fill(t) · .hide(t) + levaR12(parent, cx, cy).off(t) (l'interruttore \"Pubblica\", U04 del reel 136).",
     [(40, 6, 9), (103, 60.5, 63.5), (136, 34.8, 36.6)], "rara", "kit", ("P05", "P12"))
