# -*- coding: utf-8 -*-
"""Genera il catalogo animazioni: catalogo.json, CATALOGO.md, SCRIPT-CATEGORIZZATI.md, clip/ e catalogo.html.

    python -I _tools/genera_catalogo.py [--no-clip]
"""
import html, io, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, QUI)
from catalogo_dati import V, CATEGORIE, PATTERN  # noqa: E402
from script_mappa import SCRIPT  # noqa: E402

CARTELLA = os.path.dirname(QUI)
CAT = os.path.join(CARTELLA, "CATALOGO-ANIMAZIONI")
CLIP = os.path.join(CAT, "clip")
AN = os.path.join(CAT, "_analisi")
INV = {r["n"]: r for r in json.load(io.open(os.path.join(CARTELLA, "TUTTI-I-REEL", "_inventario.json"), encoding="utf-8"))}
FREQ_ORD = {"altissima": 0, "alta": 1, "media": 2, "rara": 3}
STATO = {"kit": "nel kit", "aggiornare": "da rendere identico", "nuovo": "da creare", "post": "in montaggio", "evitare": "da evitare"}

# implementati nel kit v2 (kw-kit/kit2-core.js, kit2-oggetti.js, kit2-ui.js): ID → (funzione, dove si vede nelle demo)
# demo = CATALOGO-ANIMAZIONI/demo (36 s) · demo-2 = CATALOGO-ANIMAZIONI/demo-2 (76 s) · v5 = reel-01-v5 (25,8 s) ·
# r03 = reel-03 (38,8 s, il trucco dei reel di prova) · "da provare" = non ancora in demo
IMPL = {
    "K02": ("arrive(t, fx, fy, s, {dx, dy})", "demo 5 s · demo-2 ogni scena"),
    "K03": ("move(t, dur, fx, fy, s)", "demo-8 6,55 s (dal reel alla card) · demo-2 34–37 s"),
    "K04": ("float(t, dur, dx, dy, ds)", "demo e demo-2, ogni scena"),
    "K05": ("whip2(t, dur, fx, fy, s)", "demo-2 66,4 s · 72 s"),
    "K07": ("zoomThrough(t, fx, fy, s)", "demo 28 s · reel-09 16 s e 56,7 s"),
    "K10": ("rackFocus(t, dur)", "demo 0 s"),
    "K06": ("camK(t, dur, fx, fy, s * 1.12, 'power4.out') sul colpo", "v5 17,62 s (\"Punto.\")"),
    "K13": ("punto lime → disco → barra (reel-01) · reelRing al centro", "v5 0,5–1,1 s · reel-09 16,1 s (pomo della leva → centro del bersaglio)"),
    "K14": ("listK(...).promote(i, t, x, y, s) · sectionBar → intestazione HUD", "demo-8 4,75 s · demo 10,2 s · v5 4,05 s"),
    "K15": ("lightLeak(t)", "demo 33,5 s"),
    "T01": ("titleW({lines}).inAt([tempi parole]) + at('parola')", "demo 0–1,3 s"),
    "T02": ("titleW: segmento {box:true}", "demo 0–1,3 s"),
    "T03": ("typeIn(node, testo, t, cps, {caret})", "demo 17,85 s (nodo della mappa)"),
    "T04": ("scrambleIn(node, testo, t, dur)", "demo 18,8 s (sotto-nicchie)"),
    "T05": ("decode(node, testo, t, dur)", "demo 20,55 s (risultato)"),
    "T06": ("typeIn() (usato da ladder)", "demo-2 34 s"),
    "T08": ("titleW(...).outAt(t)", "demo 4,6 s"),
    "L01": ("listK(parent, cx, cy, w, voci).show(k, t)", "demo-8 0–4 s (presente dal fotogramma 0) · demo 5–9 s"),
    "L02": ("listK(...).resolve(i, t)", "demo-8 1,5–4,7 s · demo 6,8 s · 8,4 s"),
    "L04": ("checklist(...).show / .tick(i, t)", "demo-2 28 s"),
    "L09": ("flowTree(parent, S, cx, y0, livelli, {dy, w, fs, h}).grow(l, t, {step}) · .light(l, i, t) · .rowRect(a, b) — albero a righe di pill con linee morbide, la camera scende con la crescita (reel 3); tree(S, p, figli) = solo le linee", "demo-8 29,2–36,2 s (5 × 10 × 7 = 350 idee) · demo 18,45 s (mappa delle sotto-nicchie)"),
    "L10": ("bracket(S, x, y0, y1, lato).draw(t)", "demo-2 68,2 s"),
    "L12": ("scriptDoc(parent, cx, cy, sezioni).lay / .section / .focus", "demo-2 48 s"),
    "L13": ("versusCards(parent, cx, top, A, B).show / .verdict — card piene con reel veri, badge e righe ✗/✓ (versus() = versione a sole righe)", "demo-2 64–66,4 s"),
    "L14": ("reelWall(parent, cx, cy, idVideo, {heads, views}).show(t) — contenitore pieno (reelGrid() = versione libera)", "demo-8 17,25–23,2 s (con la riga del creator sopra) · demo-2 69,2–72 s"),
    "O01": ("reelRing(parent, cx, cy, idVideo, {r, w}).open(t) · .spin(t, dur, 22) · .defocus / .refocus · .fling(t) (\"di tutto\") · .close(t)", "demo 1,35–5 s · v5 0–4,4 s"),
    "O13": ("brain(parent, cx, cy, size).on / .spark · .accendi / .disco / .strobo / .spegni (battito misurato su Kallaway 48, 79, 62) — cervello a raggi X vero (Adobe Stock 318556173 → assets/obj/cervello*.png, _tools/oggetto_da_stock.py)", "demo-2 20–23,5 s · demo-oggetti 0–4 s · reel-09 0–7 s"),
    "O14": ("slotMachine(parent, cx, cy, h, {reels}).pull / .spin(t, \"heart\") / .win — slot vera (Adobe Stock 730774093 in grafite, _tools/oggetti_adobe.py); rulli, leva lime e luci del kit", "demo-oggetti 0–8 s"),
    "O02": ("logoRing(parent, cx, cy, icone, {r, w}).burst / .spin / .implode(t, scala) — tubo al neon pieno", "demo-2 60–62,2 s (implode nella tua foto vera)"),
    "O03": ("chip(parent, cx, cy, tipo, nome) + connector() + flowLine()", "demo-2 62,5–64 s"),
    "O05": ("pyramid(parent, S, cx, base, etichette, {side, labelsR}).build / .flag(i, t) — 3D a due facce, grafite → lime; labelsR = pill del valore a destra di ogni livello (reel 4), il livello più alto lime", "demo-8 23,2–29,2 s (4 livelli, etichette sui due lati) · demo-2 54–56,7 s"),
    "O06": ("funnel(parent, cx, top, etichette, {end, icon}).build / .light(i, t) / .lightAll / .lightOrb — cono 3D in SVG", "demo-2 38–43 s"),
    "O07": ("ladder(parent, cx, bottom, etichette).build / .on(i, t)", "demo-2 33 s"),
    "O10": ("bullseye(parent, cx, cy, raggi).ring(i, t) · .hit(t) freccetta · .dimOuter — dischi lucidi", "demo 22–28 s · demo-2 52–54 s · v5 17,67 s · reel-09 16,1–18,3 s"),
    "O18": ("neonPath(parent, d, {w}).draw(t, dur) / .glint(t, giro, n) — tubo cilindrico + riflesso a cometa", "demo-2 23,5–28 s · reel-09 2,9–4,5 s"),
    "O20": ("radar(parent, cx, cy, r, {user, nome, sotto}).show / .spin / .find(ang, tipo, etichetta) — disco-profilo con la foto vera", "demo-2 57–59,6 s"),
    "O21": ("peopleRings(parent, cx, cy, anelli, {user | media}).show(t, {daLontano, colore}) · .spin · .recolor · .leave · .count", "v5 10,75–12,75 s · r03 22,8–31 s"),
    "O22": ("crowd(parent, cx, cy, col, righe).fillIn / .count / .recolor", "demo-2 39 s"),
    "O23": ("dotGrid(parent, cx, cy).waveIn / .light / .split", "demo-2 5 s"),
    "O24": ("calendar(parent, cx, cy, {mese, cellH}).fillVideos(t, idVideo) · .fill · .put · weekPlan(giorni).ghost / .resolve (settimana)", "demo-2 0–5 s · v5 4,5–7,6 s (settimana) · r03 35,5–38,8 s"),
    "D01": ("statCard(parent, x, y, {label, icon, w, h, fs, points, hidden}).count(t, da, a, dur, fmt) · .slideIn(t, {from}) — card protagonista che entra di lato in corsa, numero che conta col grafico e il bagliore finale (reel 9)", "demo-8 6,75–9,9 s · demo 13 s · demo-2 68,5 s"),
    "D02": ("viewBadge(...) + popSeq(badge, t)", "demo-8 17,85 s · demo 12,3 s"),
    "D04": ("igInsights(parent, X, Y, {media, punti, colore: \"#ffffff\"}).curve(t, dur) · .crash(t, u, causa) — negli Approfondimenti veri la curva crolla e nel punto del crollo nasce il disco con la causa (reel 18); retention() resta la versione semplice", "demo-8 12,2–14,8 s · demo-2 43 s"),
    "D04": ("igInsights(parent, X, Y, {media, punti, colore: \"#ffffff\"}).curve(t, dur) · .crash(t, u, causa) — negli Approfondimenti veri la curva crolla e nel punto del crollo nasce il disco con la causa (reel 18); retention() resta la versione semplice", "demo-8 12,2–14,8 s · demo-2 43 s · v5 11,3 s"),
    "D05": ("barChart(parent, cx, base, [{v, l, av, val, win}]).grow(t) — foto vere sopra le barre lucide", "demo-2 44,6 s"),
    "D06": ("progressBar(parent, x, y, w).fill(t, a, dur)", "demo-2 45,4 s"),
    "D07": ("equation(parent, cx, cy, termini, {vertical, units}).show(i, t) — mini-reel, risultato su pill lime, {tag}", "demo-2 10–14,5 s"),
    "U01": ("chatUI(parent, cx, cy, {logo}).show / .type / .sendAt", "demo-2 14,5 s"),
    "U03": ("cursor(parent, x, y).show / .moveTo / .click", "demo-2 17,2 s"),
    "U04": ("igSettings(...).on(i, t) con iosSwitch() (toggle() = versione libera)", "demo-2 67,1–68 s"),
    "U07": ("tapFinger(parent).show / .to / .tap / .hide", "demo-2 66,7–68,1 s"),
    "U08": ("igSettings(parent, X, Y, righe, {user}).on(i, t) · .sw(i) · phone2()", "demo-2 66,4–69,2 s"),
    "U09": ("igNotif(parent, cx, top, {user, nome, testo, allegato}).show(t) · .attXY() + docWall.send()", "demo-2 74–76 s · reel-09 58,5 s"),
    "U02": ("igProfile(parent, X, Y, {user, handle, bio, grid}).count / .pill / .hl / .follow · profileCard()", "v5 19,4–25 s · demo 33,7 s"),
    "U10": ("igDrafts(parent, X, Y, [media]).menu / .pick / .duplicate · lens()", "r03 3,7–5,5 s · 10,5–14,5 s"),
    "U11": ("igShare(parent, X, Y, media).trial / .press / .reset · igToast()", "r03 5,6–10,3 s · 16–22,4 s"),
    "U05": ("statCard()", "demo-8 6,75 s e 8,6 s (entra di lato in corsa) · demo 13 s"),
    "C02": ("flowLine(S, d, t)", "demo-2 62,9 s (i canali che portano al tuo profilo)"),
    "C04": ("leader(parent, S, x0, y0, x1, y1, testo).draw / .write", "demo 22,7 s"),
    "F01": ("GLOW_T (testo) · GLOW_A(a) (accento)", "ovunque"),
    "F02": ("pulse(parent, x, y, t, {r})", "demo 2,6 s · demo-2 21,2 s · reel-09 4,1 s e 29,2 s"),
    "F04": ("spotlight(scelti, altri, t)", "demo-8 19,55 s (l'outlier, con la pill «4× la sua media») · demo 30,5 s"),
    "F07": ("rays(parent, cx, cy, r).show / .live(t, dur)", "r03 0–3,7 s"),
    "F11": ("tint(elementi, t, 'si'|'no')", "demo-8 19,2 s · demo 7,6 s · demo 31,4 s"),
    "H03": ("tags(parent, S, lista, {from}).show(t)", "demo-2 68,65 s"),
    "X01": ("docWall(parent, cx, cy, {titoli}).show(t, [1, 3, 6, 9]) · .send(t, i, x, y) + igNotif({allegato}) — pagine bianche vere", "demo-2 72–76 s · reel-09 57–61,5 s"),
    "A02": ("appIcon() + rays() già in scena al fotogramma 0, poi il reel che esce e si sdoppia", "r03 0–3,6 s"),
    "A01": ("reelWall() + viewBadge() + titleW()", "demo-8 17,25–23,2 s · demo-2 69,2 s (come scena)"),
    # blocco 1 (09/10, demo-3): le 7 che servono agli script + K17 (mappa a ∞, segnalata dall'utente)
    "K11": ("wallScroll(parent, cx, top, {cols, rows}).open(t, r0, r1) · .roll(t, r0, r1) · .spot(t, celle) · .pick(t, celle, idVideo, {views}) — muro di reel veri (atlante assets/atlas/muro.jpg da _tools/atlante.py)", "demo-3 0–5,4 s · reel-09 9,8–11 s"),
    "O08": ("triad(parent, cx, cy, voci, {icons, esempi}).show(t) · .rotateTo(i, t) — cornice 3D in grafite, triangolo lime, icona e frase d'esempio per voce", "demo-3 5,4–10,6 s"),
    "L08": ("table(parent, cx, cy, colonne, righe).show · .heads · .rowHead · .fill(t, {step}) · .lime · .pill — caselle tratteggiate da riempire", "demo-3 10,6–16,4 s"),
    "C03": ("signal(parent, connettore, t, dur, {sign: '+' | '-', back}) — disco col segno che viaggia sulla linea", "demo-3 22,2–27,2 s · reel-09 6,1 s"),
    "F10": ("disintegrate(parent, nodo, x, y, w, h, idImmagine, t, {spread}) — polvere su canvas fatta di pezzi veri dell'immagine", "demo-3 27,2–31,6 s"),
    "L05": ("listK(…, {locks: true}).unlock(i, t) — barra lime piena, lucchetto aperto", "demo-3 31,6–36,4 s"),
    "K17": ("loopMap(parent, cx, cy, nomi).go(i, t) · .name(i, tempi) · .overview(t) · .dive(i, t) — pathCam() lungo il tubo, neonPath({molecole}).glintTo()", "demo-3 36,4–44 s"),
    # blocco 5 (09/10, demo-6 e reel-09): le nuove dalla revisione dei 150 reel
    "H04": ("selectCorners(parent, [x0, y0, x1, y1], {len, w, pad}).show(t) · .to(t, rett) · .hide(t) — quattro angoli lime che si chiudono in 0,35 s sull'elemento scelto.", "demo-6 1,15 s e 2,45 s (sceglie il reel prima di ogni scambio) · reel-09 51,4–52,9 s"),
    "T13": ("strikeLines(parent, x, y, righe, {fs, w, lh}).strike(i, t) · .remove(i, t) · .add(t, testo, {color}) · .strikeR(r, t) · .removeR(r, t) — riga lime sopra le parole, la riga si chiude, quella giusta si scrive.", "demo-6 6,55–9 s (la bio del tuo profilo vero, con la camera che entra)"),
    "O26": ("figure3d(parent, cx, base, h, {flip}).show · .screen · .dot · .focus · .pulse · .away · .headXY() · .phoneXY() — il manichino bianco luminoso di Kallaway (obj-manichino: Adobe Stock 140421534 + _tools/manichino.py), di profilo sul telefono; punto e lente sulla testa come nel reel 52.", "demo-6 79,4–84,8 s"),
    "O28": ("brickTower(parent, S, cx, base, etichette, {w, h, lw, fs, gap}).drop(i, t) · .say(i, t) · .snap(t) — mattoncini 3D in isometria (pioli 2 × 4, fianco in ombra) grafite → lime quando sono detti, etichette sfocate a sinistra; .snap li incastra in una torre (reel 90).", "demo-6 11,2–16,6 s"),
    "L15": ("stackAway(nodo, t, x, y, i, {scale}) — la card vista va nella pila in un angolo; in demo-6 la variante del reel 15: la card vista va nella fila sotto il titolo e alla fine le tre si aprono a ventaglio.", "demo-6 16,6–22 s"),
    "D10": ("progressRing(parent, cx, cy, r, {w}).show · .to(f, t, dur) · .at(f) — arco lime attorno alla foto vera, i pezzi nascono sul bordo; in demo-6 con gli anelli concentrici del reel 46.", "demo-6 22–27,4 s"),
    "D11": ("raceChart(parent, x0, y0, linee, {w, h, mesi}) con linee [{pts, av, lime, val: [da, a]}] · .axes(t) · .run(t, dur, ease) — teste con i volti veri e la pill dei follower che sale con la curva (reel 65); la tua, lime, supera le altre.", "demo-6 27,4–32,8 s"),
    "O29": ("headBrain(parent, cx, cy, h, {visibile}).show · .disco · .accendi · .on · .strobo · .spegni · .brainXY() — testa di profilo col cervello vero; gesti misurati sul reel 48 (disco a scatti, cervello che lampeggia 5 fotogrammi e resta lime) e sul 62 (strobo). Niente battito periodico: in Kallaway non c'è.", "demo-6 32,8–38,2 s"),
    "U15": ("stopwatch(parent, cx, cy, d, {start, unita}).show · .run(t, dur, da, a, totale) — cronometro d'acciaio con l'arco lime e il numero.", "demo-6 22–26 s"),
    "D12": ("gradientScale(parent, x, y, w, h, {n, etichette}).show · .fill(t, f, dur) · .cursor(t, f, testo, dur) — scala dal grafite al lime in colori pieni con il cursore; in demo-6 con la fotocamera vera in basso e il faro vero che illumina la cima.", "demo-6 38,2–43,6 s"),
    "U12": ("reelActions(parent, x, y, conti, {gap, size}).show · .on(i, t, da, a) — cuore, commento, invia, salva che si accendono di lime e i numeri che raddoppiano; in demo-6 dentro il tuo reel vero, con la camera che entra sulla colonna.", "demo-6 43,6–48 s"),
    "D14": ("waveform(parent, x, y, w, h, {n, prese}).play(t, dur) · .take(i, t) · .dim(i, t) · .takeX(i) — forma d'onda a prese con la testina lime.", "demo-6 52,4–57,8 s"),
    "U14": ("viewfinder(parent, [x0, y0, x1, y1]).show · .rec(t, dur) · .focus(t, x, y) — mirino vero (angoli, REC, timecode, 4K · 30, AF) sopra il tuo video vero.", "demo-6 52,4–57,8 s"),
    "O32": ("fanFolder(parent, cx, cy, file, {w, h, etichetta}).show · .fan(t) · .close(t) — cartella in grafite, le pagine vere escono a ventaglio.", "demo-6 59,7–63,2 s"),
    "U13": ("commentBurst(parent, rett, righe, {fs, w}).burst(t, dur, esp) · .collect(t, x, y) — commenti di Instagram veri e leggibili (volto, nome, testo, Rispondi) che esplodono quasi tutti insieme e restano da leggere (reel 123: burst(t, 0.65, 1.8)); .collect li risucchia nella cartella.", "demo-6 57,8–60,3 s"),
    "O30": ("roadFork(parent, S, cx, by, {w, h, split, labels}).draw(t, dur) · .drive(t, dur, {finta}) · .choose(t) — strada tratteggiata in prospettiva e la finta al neon lime; la pallina coi fari prende la finta (reel 79). forkPath(…) resta per il bivio a Y del reel 62.", "demo-6 63,2–68,6 s · reel-09 33,5–37,3 s (bivio verticale davanti al muro)"),
    "F12": ("stamp(parent, cx, cy, testo, {w, h, rot, fs}).down(t) — timbro in inchiostro lime pieno con l'usura, colpo di camera e polvere.", "demo-6 9,75 s (sul tuo profilo)"),
    "D13": ("thermo(parent, x, yTop, yBot, {w, etichette}).show · .to(t, f, dur) — tubo di vetro col bulbo, il lime pieno sale accanto alla scala.", "demo-6 68,6–74 s"),
    "L16": ("swapPlaces(a, b, t, {dur, arco, lift}) — un elemento alla volta (reel 69): quello scelto si stacca col bordo lime e fa una S fino al posto dell'altro, che scivola al suo; reorder(nodi, posti, ordine, t) per riordinare tutto insieme.", "demo-6 1,55–3,5 s"),
    "O27": ("hookCatch(parent, cx, cy, {w, h, d, altri}).show · .cast(t, dur) · .swim(t, dur) · .snap(t) — cornice con la canna, la lenza lime ad arco e l'acqua a bande; l'amo d'acciaio scende, chi scorre (volto vero) abbocca e viene strappato fuori (reel 100).", "demo-6 74–79,4 s"),
    "O31": ("rocket(parent, cx, cy, h, {user, pill: {da, unita}}).show(t, dRazzo) · .ignite · .ride(t, dy, dur, {pose}) · .count(t, a, dur, ease) · .liftoff — il razzo vero porta su la tua foto col contatore (reel 59); la camera lo insegue tra le linee di velocità.", "demo-6 48–52,4 s"),
    # blocco 4 (09/10, demo-5): le 11 rare
    "K08": ("fallFollow(nodo, t, x0, y0, x1, y1, posa, {dur: 0.55}) + pebble(parent, x, y, d, icona) — l'oggetto accelera (power2.in) e la camera lo insegue con la stessa curva, poi frena 0,35 s all'impatto.", "demo-5 0,8–2,6 s"),
    "O16": ("water(parent, cx, cy, w, {k}).show · .ripples(t, x, y, {n, r}) · .splash(t, x, y) — acqua scura in prospettiva, onde bianche col bordo lime; con faceDot i volti si accendono quando l'onda arriva.", "demo-5 1,1–6,2 s"),
    "L06": ("sideIndex(voci, {x, top, w, fs}).show(t) · .go(i, t) — indice fisso nell'HUD, la voce corrente in una pill lime (0,2 s).", "demo-5 6,2–11,9 s"),
    "U06": ("lowerThird(parent, x, y, nome, sotto, {fs}).show(t) — barra lime verticale + nome in maiuscolo spaziato che si decodifica (0,25 s).", "demo-5 12,3 s"),
    "L07": ("tierList(parent, cx, top, [\"S\", \"A\", \"B\", \"C\"], {w, rh, slot}).show(t) · .drop(nodo, riga, t) — gli elementi cadono attraversando le righe (~0,15 s a riga).", "demo-5 17–22,4 s"),
    "O09": ("morphShape(parent, cx, cy, r).show · .spin(t, dur, gradi) · .morph(t, \"pentagono\" | \"triangolo\", dur) · .slice(t, etichette) — forma lime lucida che ruota e cambia forma, poi si taglia a fasce.", "demo-5 22,4–28 s"),
    "O17": ("sinkWave(parent, x0, x1, y, {amp}).show(t, dur) · .rise(t, dy, dur) · .sink(nodo, t) — onda in grafite col bordo lime che sale; gli elementi affondano in 0,8 s e diventano traslucidi.", "demo-5 28–32,4 s"),
    "O19": ("constellation(parent, S, punti, etichette, {fs, lato}).draw(t, 0.2) — tratti sottili bianchi, punti lime luminosi, etichette che si scrivono.", "demo-5 32,4–38,2 s"),
    "D09": ("peopleRings(…, {percent: true, volti}).pct(t, da, a, dur) — la percentuale al centro sale e la stessa quota di volti si colora di lime.", "demo-5 38,2–43,8 s"),
    "C05": ("circuit(S, a, b, {prima: \"h\" | \"v\"}).draw(t, 0.3) · .pulse(t, dur, parent) — linee a 90° col gomito arrotondato e l'impulso che corre.", "demo-5 43,8–49,4 s"),
    # reel 10/10 (sessione 5): le storie di Instagram, l'orologio, la pill dell'algoritmo (kw-kit/kit2-storie.js)
    "U16": ("igHome · igStoryEdit · igStoryView · storyCircle · storyRow (kit2-storie.js) — la fila delle storie, l'editor con \"La tua storia\", la storia aperta con barra, like, risposta, condividi e lo scorrimento a cubo.", "reel-10 0–5,4 s · 10,4–17,4 s · 19,6–25,4 s"),
    "U17": ("orologio(parent, cx, cy, d, {ora, min}).show · .spin(t, dur, ore) · .off(t) — quadrante d'acciaio, lancette che corrono, gli orari veri attorno.", "reel-10 29,9–31,1 s"),
    "C06": ("algoPill(parent, cx, cy, {testo, fs}).show(t) · .flash(t, '+' | '-') — la pill <Algoritmo/> del reel 40 con i segnali C03 che ci arrivano.", "reel-10 1,9–3,5 s · 10,6–18 s · 19,8–25 s"),
    # reel 11/10 (sessione 5): la scala della luce, la stanza con la lampadina, la luce sul soggetto, il cartellino (kw-kit/kit2-reel11.js)
    "O33": ("scalaR11(parent, x0, ground, {w, r, pill}).rise · .num · .edge · .pill · B[i].folla (follaR11) — 4 gradini 3D con la folla di 100 sulle alzate e l'attrezzatura di ogni livello sulle pedate; la camera sale in diagonale.", "reel-11 11,1–14 s · 14–35,6 s"),
    "O34": ("stanzaR11(parent, x0, y0, w, h).show · lampadinaR11(parent, cx, yTop, len, {cono, pozza}).on · .sfarfalla · .dondola — la stanza in sezione con la lampadina nuda.", "reel-11 4,2–8,2 s"),
    "F13": ("reelLuceR11(…).stato(t, nome) · .rim · finestraR11 · ledR11 · faro · mirinoR11(…).iso · .cerca · .aggancia — lo stesso reel vero dal buio al controluce.", "reel-11 2,5–4,1 s · 5,6–11 s · 19,6–21 s · 24,8–29 s"),
    "D15": ("cartellinoR11(parent, x, y, testo, {filo}).show · .count · .lime — cartellino di carta appeso che oscilla e conta.", "reel-11 6,9–8,1 s · 30,9–31,9 s"),
    # reel 13/10 (11–13/10): l'oblò, il profilo con le storie in evidenza, prima e dopo (kw-kit/kit2-reel13.js)
    "K18": ("obloInR13(t, {x, y, d}, {el, x, y, pose}, {pre, D, cover}) · obloOutR13(t, room, c, {pose, cover}) · zoomR13(t, dur, px, py, s1, {ease, easePos}) — la camera entra in un cerchio (evidenza, foto profilo, tasto) e dall'altra parte c'è la storia vera; l'uscita al contrario.", "reel-13 1,07–2 s · 8,6–9,6 s · 12,05–13,05 s · 14,5–15,5 s · 43,6–44,5 s"),
    "U18": ("profiloR13(parent, X, Y, {user, bio, grid, evidenze}).evXY · .scrollTo · evidenzaR13(…).load · .numOn · .fill · dubbiR13 · tastoMsgR13 · dmR13 — il profilo con le storie in evidenza in ordine, chi guarda coi suoi dubbi, il DM.", "reel-13 1,5–9 s · 12,5–14,5 s · 20,5–22,2 s · 26,7–28,2 s · 33,6–45,27 s"),
    "F14": ("primaDopoR13(parent, x, y, w, h, prima, dopo, views).wipe(t, dur) — la griglia grigia del prima, la tendina scopre il dopo lime.", "reel-13 25,4–26,4 s"),
    # reel 12/10 (11–13/10): il cartellone, il righello della proporzione che diventa anello, la gente e il posto del cliente (kw-kit/kit2-reel12.js)
    "O35": ("cartelloneR12(parent, cx, ground, {vid, ad}).adIG · .build · .lampsOn · .lampsOff · .views · .grey · .sticker · .tag · .cta · .crollo — il tuo reel diventa un cartellone pubblicitario, gli adesivi coprono la tua faccia, i cartelloni crollano.", "reel-12 3,1–6,35 s · 12,7–17,8 s · 21–26 s"),
    "D16": ("righelloR12(parent, x0, y, n, pitch).light · .fill(i, t, \"dai\" | \"chiedi\") · .sheen + anelloR12(parent, cx, cy, r).seg · .pulse — 8 segmenti bianchi e 2 lime sotto i 10 contenuti, poi l'anello attorno alla tua foto.", "reel-12 26,2–35,3 s"),
    "O36": ("corsiaR12(parent, x0, x1, y, {volti}).flow + postoR12(parent, cx, cy, d).show · .empty · .fill + levaR12(…).off — la gente che passa, il posto del cliente vuoto e poi pieno, l'interruttore Pubblica.", "reel-12 3,6–21 s · 30–31,5 s · 39,4–41 s"),
    "F09": ("pixelate(parent, x, y, w, h, idImmagine, {b0}).show(t) · .resolve(t, dur) — foto vera a blocchi su canvas (36 → 24 → 14 → 8 → nitida) con lo sfarfallio di tinta lime.", "demo-5 49,4–54,4 s"),
    # blocco 3 (09/10, demo-7 e correzioni): voci del kit senza demo + rifatte dopo il confronto
    "A05": ("videoCard() + connector() + brain() + pulse() — la clip vera diventa schema", "demo-7 0–5,6 s"),
    "C01": ("connector().draw(t, dur) insieme a camK(t, dur, …) con la stessa curva: la punta resta in campo", "demo-7 0,8–4,05 s"),
    "F08": ("cambio di stato a onda: filter + borderColor in 0,3 s (volti veri con faceDot)", "demo-7 6,9–9,1 s"),
    "H02": ("handCircle(SH, …) + handArrow + handNote su uno svgLayer sopra l'interfaccia", "demo-7 11,9–12,7 s"),
    "F05": ("flicker(nodo, t, statoA, statoB, 0.3)", "demo-7 13,3 s · 40,5 s · reel-09 1 s (accensione del cervello)"),
    "A03": ("scriptDoc() già in scena al taglio, .lay + .section a 0,22 s l'una", "demo-7 16,2–17,6 s"),
    "K16": ("camK(t, 1.6, fx, fy, s · 1.1, \"sine.inOut\") mentre l'oggetto si costruisce", "demo-7 16,25–17,85 s · demo-4 44,65 s"),
    "T07": ("titleW: segmento {hand: true, ul: true}", "demo-7 16,6–17 s"),
    "O15": ("hourglass(parent, cx, cy, h).run(t, dur) · .flip(t)", "demo-7 21,6–27,4 s · reel-09 18,4 s"),
    "F06": ("ripple(parent, x, y, t, {s0, s1, w}) ×2 dal punto d'impatto", "demo-7 25,1 s"),
    "A04": ("orbit() con le icone che partono dal centro (0,3 s expo.out) + avatar vero al centro", "demo-7 27,4–28,7 s"),
    "O04": ("orbit(parent, cx, cy, r, nodi).spin(t, dur, gradi) — loghi dritti", "demo-7 27,5–32,8 s"),
    "L03": ("listK(...).cascade(t, 0.08)", "demo-7 33,2 s"),
    "A08": ("listK con le voci sfocate + handArrow/handNote che le indicano", "demo-7 34,8–35,6 s"),
    "O11": ("venn(…, {label}).one · .two · .meet · .lensOn", "demo-7 38,2–43,6 s"),
    "L11": ("metroPath(…).show · .go", "demo-2 30,15–32,5 s"),
    "D03": ("lineChart({…, playhead: true})", "demo-3 16,4–22,2 s"),
    # blocco 2 (09/10, demo-4): le 10 frequenti in Kallaway
    "K09": ("lineExit(parent, S, a, b, t, posa, {grow, whip}) — linea con la testa luminosa (0,3 s), poi whip2 che la insegue; i titoli vivono nel mondo (titleW({parent: layer})).", "demo-4 19,9–23,6 s · reel-09 31,8 s e 46,9 s"),
    "K12": ("conveyor(parent, x0, y, cards, {w, h, speed, timeline}).run(t0, t1) · .on(i, t) — copertine vere, pillole appese alla linea del tempo, ogni card si accende quando è detta.", "demo-4 33–39 s"),
    "T09": ("swapWord(T, i, testo, t) — la parola si cancella e si riscrive a macchina (1/40 s a lettera), il resto del titolo resta.", "demo-4 12,6–17,4 s · reel-09 18,6–22 s"),
    "T10": ("compactTitle(T, t, righe, {size, top}) — il titolo grande sale e sparisce, quello compatto si scrive in un box di vetro col bordo lime.", "demo-4 6,75 s"),
    "O12": ("glassOrb(parent, cx, cy, r, media, {iris}) · orbFlower(parent, cx, cy, medias, {r, R, k0, links, dim}).show · .spin · .focus(i, t) · .all(t) — sfere di vetro con reel veri, raggi dal tema agli angoli.", "demo-4 39–44,6 s"),
    "O25": ("whiteboard(parent, cx, cy, voci).show · .panel(i, t) · .panelRect(i) (lavagna bianca vera) · tablet(parent, X, Y, {w, h}).screen · .at(x, y) · igPhone() — dispositivi con UI e reel veri.", "demo-4 5,6–12,6 s (lavagna) · 44,6–48,6 s (tablet)"),
    "F03": ("sheenK(card, t, {dur, w, dir}) — banda bianca stretta da destra a sinistra in 0,7 s (sheen() resta per i reel vecchi).", "demo-4 17,4–19,9 s"),
    "H01": ("handIn(parent, x, y, parola, {side, page, pw, ph, fs}).show(t) — parola a mano + freccia a ricciolo + pagina vera, entrano dai lati alterni con la scia.", "demo-4 28–33 s"),
    "A06": ("bigType(spec).inAt(tempi) · .retract(t, {scale, y}) + calendar(…).assemble(t, {spread}) · .fillVideos — parole giganti che diventano il titolo, il calendario si monta sotto.", "demo-4 0–5,6 s"),
    "A07": ("igInsights(parent, X, Y, {media, views, delta, skip}).count(t, dur) · .curve(t, dur) · .skipOn(t) — Approfondimenti del reel veri con i numeri che salgono.", "demo-4 23,6–28 s"),
}


def clip_nome(v, i):
    return f"{v['id']}_{i + 1}.mp4"


def fai_clip(job):
    v, i, r = job
    out = os.path.join(CLIP, clip_nome(v, i))
    if os.path.exists(out):
        return out
    src = os.path.join(CARTELLA, INV[r["n"]]["file"])
    t0 = max(0, r["t0"] - 0.15)
    dur = min(5.5, max(1.2, r["t1"] - r["t0"] + 0.3))
    crop = "" if v["id"] in ("K01", "K15", "U06", "T12") or v["id"].startswith("A") else "crop=iw:ih*0.70:0:0,"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.3f}", "-t", f"{dur:.3f}", "-i", src,
                    "-vf", f"{crop}scale=360:-2,fps=30", "-an", "-c:v", "libx264", "-crf", "27", "-preset", "veryfast",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], cwd="C:\\")
    return out


def main():
    os.makedirs(CLIP, exist_ok=True)
    stats = json.load(io.open(os.path.join(AN, "statistiche.json"), encoding="utf-8"))["giu-ott-dark"]
    curve = json.load(io.open(os.path.join(AN, "curve.json"), encoding="utf-8"))
    # where each entry is suggested in the scripts
    uso = {}
    for data, tit, pat, beats, gemelli, note in SCRIPT:
        for testo, ids in beats:
            for i in ids:
                uso.setdefault(i, []).append(f"{data} {tit}")
    for v in V:
        v["categoria"] = CATEGORIE[v["cat"]]
        v["clip"] = [f"clip/{clip_nome(v, i)}" for i in range(min(2, len(v["rif"])))]
        for r in v["rif"]:
            r["file"] = INV[r["n"]]["file"]
            r["data"] = INV[r["n"]]["data"]
            r["url"] = INV[r["n"]]["url"]
        v["negli_script"] = sorted(set(uso.get(v["id"], [])))
        if v["id"] in IMPL:
            fn, dove = IMPL[v["id"]]
            v["stato"] = "kit"
            v["kit"] = f"{fn} — kw-kit v2"
            v["demo"] = dove
    db = {"generato": "2026-10-09", "voci": V, "categorie": CATEGORIE, "pattern": PATTERN,
          "misure": {"stile_attuale": stats, "curve_camera": {k: {kk: vv for kk, vv in c.items() if kk != "esempi"} for k, c in curve.items()}},
          "script": [dict(data=s[0], titolo=s[1], pattern=s[2], battute=[dict(testo=b[0], voci=b[1]) for b in s[3]], gemelli_kallaway=s[4], note=s[5]) for s in SCRIPT]}
    with io.open(os.path.join(CAT, "catalogo.json"), "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=1)

    # ---- CATALOGO.md
    L = ["# Catalogo animazioni Kallaway → brand Samuele", "",
         f"{len(V)} animazioni ricavate dai 150 reel di @kallawaymarketing (gen → ott 2026). Ogni voce: com'è, tempi misurati, quando usarla, come si fa nel kit, reel di riferimento (con clip in `clip/`).",
         "Galleria navigabile con le clip: `catalogo.html`. Script di settembre/ottobre categorizzati: `SCRIPT-CATEGORIZZATI.md`.", "",
         "## Numeri dello stile attuale (giugno → ottobre, 105 reel)", "",
         f"- {stats['tagli_al_minuto']} tagli al minuto; grafica {int(stats['quota_tempo']['grafica']*100)}% del tempo, faccia {int(stats['quota_tempo']['piena']*100)}%, light mode {int(stats['quota_tempo']['light']*100)}%.",
         f"- Scena grafica: mediana {stats['durata_segmenti_grafica_s']['mediana']} s (p25 {stats['durata_segmenti_grafica_s']['p25']} – p75 {stats['durata_segmenti_grafica_s']['p75']}).",
         f"- Camera in movimento nel {int(stats['camera_in_moto_nelle_grafiche']['mediana']*100)}% del tempo delle grafiche.",
         f"- Arrivo in movimento dopo il taglio nel {round(stats['arrivi_in_moto']['n']/stats['arrivi_in_moto']['su_segmenti_grafica']*100)}% delle scene: {stats['arrivi_in_moto']['v0_px_s_mediana']:.0f} px/s che frenano in {stats['arrivi_in_moto']['decadimento_90_s_mediana']} s.",
         f"- Curve di camera (cubic-bezier misurate): spostamenti {tuple(curve['veloci_in_scena']['bezier_curva_mediana'])} in {curve['veloci_in_scena']['durata_mediana_s']} s · arrivi dopo il taglio {tuple(curve['arrivi_dopo_taglio']['bezier_curva_mediana'])} · drift {tuple(curve['lenti']['bezier_curva_mediana'])}.",
         "", "Legenda stato: **nel kit** (kw-kit v2: kit2-core.js / kit2-oggetti.js, API in KIT-V2.md) · **da rendere identico** (c'è ma va portato ai valori misurati) · **da creare** · **in montaggio** (DaVinci).", ""]
    for c, nome in CATEGORIE.items():
        vv = sorted([v for v in V if v["cat"] == c], key=lambda v: (FREQ_ORD[v["freq"]], v["id"]))
        L += [f"## {c} · {nome}", ""]
        for v in vv:
            rif = " · ".join(f"reel {r['n']} ({r['t0']:.1f}–{r['t1']:.1f} s)" for r in v["rif"])
            L += [f"### {v['id']} — {v['nome']}", "",
                  f"- **Com'è:** {v['cosa']}", f"- **Tempi:** {v['tempi']}", f"- **Quando:** {v['quando']}",
                  f"- **Nel kit:** {v['kit']} *({STATO[v['stato']]})*", f"- **Frequenza in Kallaway:** {v['freq']} · **Riferimenti:** {rif}"]
            if v.get("demo"):
                L.append(f"- **Dove vederla nelle demo:** {v['demo']}")
            if v["negli_script"]:
                L.append(f"- **Nei tuoi script:** {', '.join(v['negli_script'])}")
            L.append("")
    io.open(os.path.join(CAT, "CATALOGO.md"), "w", encoding="utf-8").write("\n".join(L))

    # ---- SCRIPT-CATEGORIZZATI.md
    nomi = {v["id"]: v["nome"] for v in V}
    S = ["# Script di settembre e ottobre 2026 → animazioni del catalogo", "",
         "Per ogni script: i pattern che contiene, la sequenza di animazioni consigliata battuta per battuta e i reel di Kallaway sullo stesso tema.", "",
         "## Pattern", ""] + [f"- **{k}** {v}" for k, v in PATTERN.items()] + [""]
    for data, tit, pat, beats, gemelli, note in SCRIPT:
        S += [f"## {data} · {tit}", "", "Pattern: " + ", ".join(f"{p} ({PATTERN[p].split(' (')[0]})" for p in pat), ""]
        S += ["| Battuta | Animazioni |", "|---|---|"]
        for testo, ids in beats:
            S.append(f"| {testo} | " + " · ".join(f"{i} {nomi[i]}" for i in ids) + " |")
        S.append("")
        if gemelli:
            S.append("Reel Kallaway sullo stesso tema: " + ", ".join(f"{g} ({INV[g]['caption'][:60].strip()}…)" for g in gemelli))
        if note:
            S.append(f"Nota: {note}")
        S.append("")
    io.open(os.path.join(CAT, "SCRIPT-CATEGORIZZATI.md"), "w", encoding="utf-8").write("\n".join(S))

    # ---- clips
    if "--no-clip" not in sys.argv:
        jobs = [(v, i, r) for v in V for i, r in enumerate(v["rif"][:2])]
        with ThreadPoolExecutor(6) as ex:
            list(ex.map(fai_clip, jobs))
        print(f"clip: {len(jobs)}")

    # ---- catalogo.html
    tpl = io.open(os.path.join(QUI, "catalogo_template.html"), encoding="utf-8").read()
    import base64
    fonts = ""
    for fam, fn, w in (("Advercase", "Advercase-Bold.ttf", 700), ("Patrick Hand", "PatrickHand-Regular.ttf", 400), ("Zalando Sans", "ZalandoSans-Variable.ttf", "100 900")):
        b64 = base64.b64encode(open(os.path.join(CARTELLA, "kw-kit", "assets", "fonts", fn), "rb").read()).decode()
        fonts += f'@font-face{{font-family:"{fam}";src:url(data:font/ttf;base64,{b64}) format("truetype");font-weight:{w};font-display:swap}}' + "\n"
    tpl = tpl.replace("/*__FONTS__*/", fonts)
    payload = json.dumps(db, ensure_ascii=False).replace("</", "<\\/")
    io.open(os.path.join(CAT, "catalogo.html"), "w", encoding="utf-8").write(tpl.replace("/*__DATI__*/null", payload))
    print(f"catalogo: {len(V)} voci · {len(SCRIPT)} script")


if __name__ == "__main__":
    main()
