# kw-kit v2 — API e regole (misurate sui 150 reel di Kallaway)

File: `kit2-core.js` (camera, testo, liste, luce, dati, connettori), `kit2-oggetti.js` (oggetti-metafora, grafici),
`kit2-blocco5.js` (le voci del Blocco 5: angoli, mattoncini, razzo, bivio, amo, manichino, testa col cervello…) e
`kit2-ui.js` (schermate di Instagram, telefono, dito che preme, notifica DM, icone delle piattaforme) e `kit2-storie.js` (le storie
di Instagram: fila, editor, storia aperta, la pill `<Algoritmo/>`, l'orologio — sessione 5, reel 10/10).
`build.cjs` li inlinea dopo `kit.js` (ordine alfabetico `kit2-*.js`): tutte le funzioni di `kit.js` restano disponibili,
reel-01 v4 non cambia. Ogni funzione porta l'ID della voce di catalogo (`CATALOGO-ANIMAZIONI/catalogo.html`).
Demo eseguibili: `CATALOGO-ANIMAZIONI/demo` (36 s) e `demo-2` (76 s), ogni scena etichettata con gli ID (commenti `// [catalogo]`).
Reel completi fatti col kit v2 sui tempi veri della voce: `reel-01-v5/` (25,8 s, "Pubblicare di tutto") e `reel-03/` (38,8 s,
"Il trucco dei reel di prova": la UI di Instagram del vecchio stile al completo) — sono anche i modelli da copiare.

**Dal 13/10: regole del ritmo e template** (sezione «Ritmo e template» in fondo). Le composizioni nuove (reel dal 14 in poi,
blocchi `CATALOGO-ANIMAZIONI/ritmo-NN`) mettono il marcatore `KW_RITMO` nel sorgente e costruiscono le scene con i template
`TPL.<ID>` di `kit2-template.js` quando una voce del catalogo è giusta per la frase. Senza il marcatore il kit non cambia.

## Regole (non negoziabili)

1. **Camera solo con il gestore kit2**: `move` · `float` · `arrive` · `cutTo` · `whip2` · `zoomThrough`. Non mescolare con
   `cam/drift/whip` di kit.js nello stesso reel. Le mosse vanno scritte **in ordine di tempo**: una mossa che parte mentre la
   precedente è in corso la tronca nell'istante esatto (stessa traiettoria fino al taglio). Due tween sovrapposti sulla stessa
   proprietà altrimenti "litigano" quando il renderer salta tra i fotogrammi (bug visto in demo-2 a 74 s, risolto così).
2. **Tempi dalla voce**: nel sorgente `<!--WORDS ../../my-video-ottobre-p1-test/src/words/dNN.ts-->` → `WORDS` =
   `[[parola, inizio, fine], …]` in secondi (30 fps). `at("tutto.")` = istante della parola; `at("di", k)` = dalla parola k in poi;
   `wordsFrom(i0, n)` = inizi di n parole consecutive (da passare a `titleW(...).inAt()`).
3. **30 fps** sempre (i reel dell'utente). I tempi misurati sono in secondi.
4. **Colore**: lime #CFFB50 = ciò che conta / giusto; bianco = neutro; grigio scuro + sfocato = sbagliato o confuso.
   Mai grandi superfici di lime **trasparente** (sul nero diventa verde oliva): lime pieno (`limeFill(k)`, gradienti opachi)
   oppure vetro scuro con bordo/luce lime (`GLOW_A`).
5. **Layout**: i layer del mondo sono larghi 1 px → un testo posizionato in assoluto senza `width` va a capo a ogni parola.
   Dare sempre `width` o `whiteSpace: "nowrap"`.
6. Movimento di camera nel 59% del tempo delle grafiche: se una scena sta ferma più di ~1 s, aggiungere `float`.
7. **Ogni scena = un'infografica (oggetto, schema, UI) + un titolo** (feedback dell'utente, 09/10). Gli effetti di testo
   (typeIn, scrambleIn, decode, titleW) vivono solo dentro nodi, card, etichette, pill: mai scene di solo testo, mai un
   numero gigante di cui non si capisce il senso (`bigBack` / T11 = da evitare).
8. **Nessuna casella di testo/sottotitolo nel video**: i sottotitoli li aggiunge l'utente in DaVinci. Etichette di debug
   delle demo solo come commenti nel sorgente, mai a schermo.
9. Calendari di contenuti: preferire `calendar(...).fillVideos(t, idVideo)` (giorni che si riempiono di reel veri in
   movimento, come il reel 68 di Kallaway) alle sole caselle colorate. Mini-clip: `_tools/mini_clip.py <cartella> 30`.

10. **Frame pieno come Kallaway** (richiesta dell'utente: "non vorrei infografiche troppo scarse"). Misura su 562 fotogrammi
    di Kallaway (area grafica titolo incluso): densità mediana 0,33 (p25 0,23), copertura mediana 0,65 (p25 0,54). Il reel-01 v4
    approvato ha mediana ~0,33. **Ogni scena va inquadrata con `arriveRect` / `frameRect` / `cutRect`** sul rettangolo che
    contiene oggetto + etichette (riempie la zona utile sotto il titolo) e va controllata con
    `_tools/densita.py nostri <snapshot.png>` (soglia: ≥ p25 di Kallaway) e con il confronto affiancato `_tools/confronto.py`
    (fotogramma di Kallaway | nostro). Attorno all'oggetto principale: 3–6 etichette/pill/elementi secondari.
11. **Quando la camera passa al secondo oggetto della scena, il primo si spegne** (opacity 0 in 0,3 s): altrimenti finisce dietro
    al titolo (errore visto nelle demo).
12. **Oggetti-metafora = oggetti veri, non icone**: file in `kw-kit/assets/obj/`, usati con `imgIn()`. Dal 09/10 vengono da
    **Adobe Stock** (solo collezione gratuita), scontornati con Photoshop:
    - cervello a raggi X (`brain`);
    - slot machine in grafite (`slotMachine`);
    - fotocamera argento (`fotocamera`);
    - faro da studio (`faro`).

    Fonti, licenze, scarti e regole sono in `kw-kit/sorgenti-adobe/FONTI.md`, con gli originali e gli scontorni. Le ricette
    riproducibili sono `_tools/oggetto_da_stock.py` (oggetti di vetro: bianco + lime) e `_tools/oggetti_adobe.py` (slot,
    fotocamera, faro: stampano le frazioni che vanno nelle costanti `SLOT_GEO` / `CAM_GEO` / `FARO_GEO`).

    Il connettore *Adobe for creativity* non ha la generazione da testo: si cerca su Stock (`asset_search`, `pricing: "free"`),
    si licenzia (`asset_license_and_download_stock`) e si scontorna (`image_remove_background`). Se compare un preventivo,
    ci si ferma e si chiede. Il vecchio cervello procedurale è in `assets/obj_archivio/`. La clessidra resta quella vettoriale
    del reel-01: sabbia lime + match cut, meglio di qualsiasi foto.
    Gli oggetti presi da foto restano nel brand: grafite, argento, bianco. Il lime lo aggiungono le parti del kit (rulli, pomo,
    luci, fascio, alone), mai una foto colorata.
13. **Foto profilo vere**: `python -I _tools/foto_profilo.py <handle…>` → `kw-kit/assets/avatars/<handle>.jpg`; `avatar(parent, cx, cy, d, "hormozi")`.
    Già scaricate: hormozi, leilahormozi, garyvee, tonyrobbins, codiesanchez, thedankoe, steven, devinjatho, tu (la tua).
14. Le immagini devono stare nell'HTML statico: `build.cjs` crea da solo il pool `<img id="obj-…">` / `<img id="av-…">` /
    `<img id="th-…">` (copertine dei tuoi reel in `assets/thumbs/mio_*.jpg`). `mediaTile(parent, x, y, w, h, id)` accetta sia un
    video del pool sia un'immagine (`"th-mio_04"`, `"av-tu"`, `"obj-cervello"`).
15. **L'utente è @samuelerinaldo.media** (Samuele Rinaldo): `avatar(…, "tu")` e `{ user: "tu" }` usano la sua foto profilo vera
    (`assets/avatars/tu.jpg` = `samuelerinaldo.media.jpg`, 320 px). Ovunque compare "il tuo profilo" (radar, hub, tab bar, DM) va la sua foto.
16. **Titoli in sequenza**: l'uscita di un titolo dura ~0,45 s, quindi `outAt` ≥ 0,45 s prima dell'`inAt` del titolo successivo,
    altrimenti due titoli si sovrappongono (visto a 69,6 s nella demo-2).
17. **Mai interfaccia dietro al titolo**: quando la camera passa a una seconda inquadratura, il rettangolo deve partire dal bordo
    alto dell'oggetto (es. `PY - 10` per il telefono), così niente sale nella zona del titolo.
18. **UI di Instagram del vecchio stile** (regola dell'utente): telefono vero + dito che preme (`tapFinger`), non diagrammi astratti.
    Nel kit (09/10): Impostazioni (`igSettings`), notifica DM (`igNotif`), **Bozze + ⋯ + Duplica** (`igDrafts` + `lens`),
    **Nuovo reel + Reel di prova + Condividi** (`igShare` + `igToast`), **profilo** (`igProfile`, `profileCard`). Esempio completo: `reel-03/`.
19. **Un telefono visibile alla volta**: per i cambi di schermata (Bozze ↔ Nuovo reel) i due telefoni stanno nello stesso punto e
    si alternano con l'opacità (`screenTo` in `reel-03`): due telefoni visibili uno sopra l'altro sono un errore di layout.
20. **Inquadratura bassa di un telefono** (foglio, interruttore, bottoni): la parte alta dello schermo finirebbe sotto il titolo
    (regola 17) → si spegne con l'opacità mentre la camera è giù e si riaccende quando torna sul telefono intero (`dimTop` in `reel-03`).
21. **Mai blur su una curva che rimbalza** (`back.out`): un blur negativo è CSS non valido e il browser tiene l'ultimo valore
    (l'elemento resta sfocato). Blur e opacità su `power2.out`, il rimbalzo solo su scale/posizione (vedi `weekPlan.drop`).
22. **Parole che tornano più volte nella voce** ("bozza", "normale", "capisce", "visualizzazioni"…): `at("parola")` prende la prima.
    Usare `at("parola", findWord("parola prima"))` (in reel: `W("parola", "prima")`) oppure l'indice `WORDS[i][1]`; controllare i
    tempi stampando le parole con indice e inizio: `python -I _tools/parole.py ../my-video-ottobre-p1-test/src/words/d0N.ts`.
23. **Sovrapposizioni volute** (lente sopra la riga, notifica sopra i documenti): marcarle con `data-layout-allow-overlap` sugli
    elementi (lo fanno già `lens` e `igNotif`), altrimenti `check` le conta come errori.
24. **Fotogramma 0 pieno** (A02): l'oggetto del hook è già in scena al tempo 0 (niente `blurIn` da opacità 0 a t = 0); il rack focus
    sfoca il mondo, non lo nasconde.
25. **Lettura dei materiali** (fogli di Kallaway): oggetti a facce in luce/ombra (piramide), cilindrici (imbuto, barre, tubo), dischi
    lucidi con ombra portata (bersaglio), pagine bianche vere (documenti). Grafite lucida = non ancora detto; lime = acceso/giusto.
26. **Mai `querySelector` con un template literal** (es. `` S._defs.querySelector(`#${id} rect`) ``): il bundler di HyperFrames
    si blocca (`template_literal_selector`). Creare gli elementi con `document.createElementNS` e tenerne il riferimento.
27. **Confronto di movimento**: `_tools/confronto_moto.py --k <ID> --kt t0,t1 --n <cartella> --nt t0,t1` (strisce K/N alla
    stessa frequenza, profilo locale + camera, curva cumulata). Un "taglio" è un picco isolato di un fotogramma; le corse con la
    scia restano moto. Per le linee sottili (curve) il profilo conta poco: guardare le strisce. Video affiancato (anche 0,5×):
    `_tools/confronto_video.py <coppie.json> <uscita.mp4> --lento` su un render di prova (mai 4K senza ok).

## Valori misurati (stile giu → ott, 105 reel)

| Cosa | Valore |
|---|---|
| Spostamento di camera tra oggetti (`KW.move`) | cubic-bezier(0.30, 0.20, 0.35, 0.90) · durata mediana 1,31 s (p25 0,83 – p75 2,17) |
| Arrivo in corsa dopo un taglio (`KW.arrive`) | cubic-bezier(0.20, 0.80, 0.70, 0.95) · 1.410 px/s che frenano al 10% in 0,32 s · ~330 px |
| Drift (`KW.drift`) | cubic-bezier(0.30, 0.35, 0.55, 0.80) · ~1,4 s |
| Titolo parola per parola | grigio 52% + blur 9 px + y +5 px → bianco nitido in 0,2 s, sulla parola detta |
| Glow testo (`GLOW_T`) | alone medio σ≈7 px + largo σ≈45 px (misurato) |
| Pulse | da un punto a pieno in 0,22 s (expo.out), poi si allarga e svanisce in 0,5 s |
| Sheen di una voce | banda ~40 px a 20°, da destra a sinistra, 0,78 s; il testo va a fuoco dietro la banda |
| Ritmo | 12,8 tagli/min · scena grafica mediana 4,5 s · faccia 2,9 s · grafica 56% / faccia 29% / light 15% |

## API

### Camera (core)
- `fitPose(x0, y0, x1, y1, {top, bottom, fill})` → posa che fa riempire al rettangolo la zona utile (BAND x 54–1026, y 330–1372)
- `arriveRect(t, [x0,y0,x1,y1], {dx, dy, top, fill})` · `frameRect(t, dur, rect, o)` · `cutRect(t, rect, o)` — usare questi di default
- `move(t, dur=1.3, fx, fy, s)` — K03 · `float(t, dur, dx, dy, ds=0.025)` — K04 · `cutTo(t, fx, fy, s)` — taglio secco
- `arrive(t, fx, fy, s, {dx, dy=360, ds=0.05, dur=1.1, blur=9})` — K02 (la scena entra in corsa da (dx,dy) px schermo)
- `whip2(t, dur, fx, fy, s, {peak=20})` — K05 · `zoomThrough(t, fx, fy, s, {pre, blur, settle})` — K07
- `rackFocus(t, dur=0.45, from=10)` — K10 · `lightLeak(t)` — K15 · `mblur(t, dur, picco, asse, "decay")`

### Testo (core)
- `titleW({lines, size, top | x,y, parent, align})` — T01/T02/T07/T08. Segmenti: `{t, box, hand, ul, scale}`.
  `.inAt(t | [tempi per parola])` → fine · `.outAt(t)` · `.n` (numero di parole). Con `parent` = layer del mondo il titolo
  vive nel mondo (si muove con la camera, K09).
- `typeIn(node, testo, t, cps=30, {caret, size})` — T03/T06 · `scrambleIn(node, testo, t, dur=.28)` — T04
- `decode(node, testo, t, dur=.3)` — T05 · `bigBack(parent, cx, cy, testo, {size})` → `.inAt/.outAt` — T11
- `at(parola, dopo)`, `findWord`, `wordsFrom(i0, n)`

### Liste (core)
- `listK(parent, cx, cy, w, voci, {h, gap, fs, numbers})` — L01/L02/L03/K14 →
  `.show(k, t)` (voci fino alla k-esima, la pila si ri-centra) · `.resolve(i, t)` (sheen + a fuoco + attiva) ·
  `.activate/.deactivate(i, t)` · `.cascade(t)` · `.dimOthers(i, t)` · `.promote(i, t, x, y, s)` (diventa intestazione)

### Luce ed enfasi (core)
- `pulse(parent, x, y, t, {r, front})` — F02 · `glowFlash(node, t)` · `spotlight(scelti, altri, t)` — F04
- `tint(elementi, t, "si"|"no")` — F11 · `flicker(node, t, statoA, statoB, dur)` — F05

### Dati e connettori (core)
- `statCard(parent, x, y, {label, icon, w, h, points})` → `.count(t, da, a, dur, fmt)` — D01/U05
- `viewBadge(parent, cx, cy, testo, {dark})` + `popSeq(badge, t, gap)` — D02
- `leader(parent, S, x0, y0, x1, y1, testo)` → `.draw(t)` `.write(t | tempi)` — C04
- `flowLine(S, d, t, {dur, gap, speed})` — C02

### Immagini (core)
- `imgIn(parent, "obj-cervello")` · `pooledImg(id)` · `avatar(parent, cx, cy, d, handle, {ring, bw})` (handle `"anon"` = sagoma grigia) ·
  `mediaTile(parent, x, y, w, h, id)` (video del pool oppure immagine `th-` / `av-` / `obj-`)

### Oggetti (kit2-oggetti.js)
`reelRing` O01 (reel veri che si aprono e ruotano: `.open(t)` `.spin(t, dur, 22)` `.defocus(t)` `.refocus(t)` `.fling(t)` "di tutto"
`.close(t)`) · `calendar` O24 (`.fillVideos(t, id, {label})`) · `weekPlan` O24 in riga (planner con i giorni: `.ghost(t, ids)` tutti i reel
già nelle celle sfocati, `.resolve(i, t, etichetta, icona, colore)` va a fuoco sul giorno detto, `.dayOn` `.drop` `.cellXY`) ·
`dotGrid` O23 · `equation` D07 (`{vertical, units, unit, fs, w}`; termine risultato `{res, tag: "≈ 1 anno"}` su pill lime) ·
`cursor` U03 · **`brain` O13** (`.on` `.off` `.spark` e il **battito di Kallaway misurato fotogramma per fotogramma**, sessione 4:
`.accendi(t, {n: 5})` acceso/spento a ogni fotogramma per ~0,17 s poi fisso con l'alone (reel 48, 1,67–1,84 s) · `.disco(t, {r})`
disco grafite con l'anello lime pieno che nasce a metà misura, arriva pieno in 0,12 s e svanisce allargandosi (reel 79; nel 48 arriva
~0,15 s prima del lampeggio) · `.strobo(t, {n: 3, periodo: 0.3})` lampi di 2 fotogrammi ogni 0,30 s con un'onda dopo il primo (reel 62)
· `.spegni(t, {dim})`. Nessun reel di riferimento ha un battito periodico "a cuore". Esempio: `reel-09` 0–7 s) · `neonPath` O18 (tubo cilindrico, `.glint` = cometa) · `checklist` L04 (`{blurUntilTick}`, `.rect`) ·
`pathSteps` L11 (`{icons: ["save", "copy", …], lw}`) · `ladder` O07 · **`funnel` O06 3D** (`{end, icon, tilt}`: `.build` `.light(i, t)`
`.lightAll` `.lightOrb` `.dim` `.rect`) · `crowd` O22 · `retention` D04 · **`barChart` D05** (`[{v, l, win, av: "tu" | "anon",
val: "922K"}]`, `.rect`) · `progressBar` D06 · `ctaCard` X01 · `reelGrid` L14 · `versus` L13 · `toggle` U04 · `tree` L09 ·
`bracket` L10 · `tags` H03 · **`bullseye` O10 lucido** (`.ring(i, t)` `.hit(t, {dx, dy, r, amp})` freccetta `.dimOuter` `.dart()`) ·
`scriptDoc` L12 · `chatUI` U01 · **`pyramid` O05 3D** (`{side: 1}` etichette a destra, `.build` `.flag(i, t)` `.light` `.rect`) ·
`orbit` O04 · `venn` O11 · **`peopleRings` O21** (`{user | media, ring, d, dot, legenda}`: `.show(t, {daLontano, colore, dur})`
`.spin` `.recolor` `.leave(t, frazione)` → restituisce chi se ne va · `.count` · `.dots` `.holders` `.av`) · **`rays` F07** (raggi vivi:
`.show` `.live(t, dur)` `.hide`) · `docPage(parent, x, y, w, h, titolo, seme)` (pagina bianca vera) ·
`radar` O20 (disco-profilo con foto vera: `{user, nome, sotto}` → `.show(t)` `.spin(t, dur, giri)` `.find(ang, tipo, etichetta)` `.all()`) ·
`logoRing` O02 (tubo al neon pieno `{r, w}`, `.implode(t, scala)` lascia l'anello come bordo del protagonista) · `chip` O03 (icona + nome) ·
`versusCards` L13 (due card piene con reel veri, badge e righe ✗/✓: `.show(t)` `.verdict(t)` `.rect`) ·
`reelWall` L14/A01 (contenitore con griglia di reel veri, etichette di colonna, badge: `.show(t)` `.rect`) ·
`docWall` X01 (pagine vere a ondate in un contenitore: `.show(t, [1, 3, 6, 9])` `.send(t, i, x, y, s)` una copia vola nel DM · `.rect`).
`radar` ha ora croce e tacche da strumento; `leader` C04 ha il pallino luminoso nel punto d'attacco (`{dot: false}` per toglierlo).

**Oggetti veri da Adobe Stock** (demo: `CATALOGO-ANIMAZIONI/demo-oggetti/`):
- **`slotMachine(parent, cx, cy, h, {reels, start, z})` O14**
  - Slot vera in grafite: la larghezza è 0,70 × h. I rulli, la leva con il pomo lime e le luci sono del kit.
  - `.pull(t)` tira la leva.
  - `.spin(t, stops | "heart", {dur, stagger, giri ≤ 4, luci})` fa girare i rulli, sfocati, che si fermano con un colpo. Le luci lampeggiano. Restituisce l'istante dell'ultimo stop.
  - `.win(t)` accende la cornice lime sulla riga vincente, le luci e l'alone; `.unwin(t)` li spegne; `.lights(t, dur)`; `.knobXY()`; `.reels`; `.rect`.
  - Simboli dei rulli: icone Lucide (di default le ricompense di IG: heart, message-circle, user-plus, send, bookmark, eye), testo breve oppure id `av-` / `th-`.
  - Il rullo è stretto (0,11 × la larghezza): meglio icone che parole.
- **`fotocamera(parent, cx, cy, w, {z})`**
  - Mirrorless argento con l'obiettivo verso chi guarda: l'altezza è w / 1,37.
  - `.rec(t, dur)` accende la spia rossa e la fa lampeggiare; `.recOff(t)`.
  - `.shutter(t)`: il vetro si chiude e parte un lampo. `.glint(t, dur)`: un riflesso passa sul vetro.
  - `.lens()` dà `{x, y, r}` del vetro nel mondo: serve per entrare nell'obiettivo con la camera, match cut sul nero.
- **`faro(parent, cx, cy, w, {dir, len, spread, flip, z})`**
  - Flash da studio con le alette.
  - Il fascio è del kit: bianco caldo, mai lime trasparente. Esce dalla parabola verso l'alto a destra, a −27°; con `{flip: true}` è specchiato.
  - `.on(t, soggetti)`: sfarfalla e si accende. I soggetti restano in penombra fino all'accensione e vanno messi **sopra** al faro, con uno z più alto, così il fascio finisce sotto di loro.
  - `.target(f)` è il punto del mondo a frazione f del fascio, dove mettere il reel o il profilo illuminato. `.live(t0, t1)` fa respirare il fascio. `.off(t)` lo spegne.

### Blocco 1 del piano (09/10, demo: `CATALOGO-ANIMAZIONI/demo-3/`, 44 s) — misurate e confrontate con `_tools/confronto_moto.py`
- **`wallScroll(parent, cx, top, {cols, rows, tw, gap, atlas})` K11**: muro di reel veri (fotogrammi da `_tools/atlante.py` →
  `assets/atlas/muro.jpg`, nel pool come `atlas-muro` solo se la composizione usa `wallScroll(`).
  `.open(t, r0, r1, {k})` primo fotogramma nitido e zoom out 0,24 s con la scia · `.roll(t, r0, r1, {dur: 0.7})` scorrimento
  "slot" (scia verticale legata alla velocità, frenata) · `.spot(t, [[r, c], …])` bordo lime + velo scuro sul resto ·
  `.pick(t, celle, idVideo, {views, w})` le scelte escono come reel veri in riga con il badge views → `{rect}` ·
  `.poseRows(r0, r1, {vis: 9})` inquadra 9 colonne (il muro esce dai bordi come in Kallaway).
- **`triad(parent, cx, cy, voci, {r, icons, esempi, start: -60})` O08**: cornice 3D in grafite, triangolo lime pieno, voci lungo i
  lati; `.show(t)` · `.rotateTo(i, t)` 0,85 s (parte deciso, si assesta piano, inclinazione 3D e scia sul tratto veloce: curva
  uguale al reel 50, scarto 0,05) · icona al centro e frase d'esempio sotto ("Come va a finire?") che cambiano con la voce ·
  `.rect` (punta in su) / `.rectDown` (punta in giù) per stringere dopo la prima rotazione.
- **`table(parent, cx, cy, colonne, righe, {cw, rh, hw, hh, fs, cfs})` L08**: vetro, sheen sull'intestazione, griglia che si
  disegna, caselle tratteggiate da riempire; `.heads(t, step)` · `.rowHead(i, t)` (vanno a fuoco con un lampo) · `.fill(t, {step:
  0.06})` numeri cella per cella (reel 68: ~0,05 s a cella) · `.cell(i, j, t, html)` · `.lime(i, j, t)` · `.pill(t, "= 30 contenuti")`.
- **`lineChart(parent, x0, y0, punti, {w, h, ghost, area, bars, yTicks, xTicks})` D03**: assi a L, curva al neon con la testa
  luminosa (~1,1 s costante), pallini al passaggio, `ghost` = curva e colonne già presenti in grigio, `bars` = colonne di vetro
  (una per tacca) che si accendono al passaggio · `.axes(t)` · `.draw(t, dur)` · `.label(k, t, testo, "l"|"r"|"t"|"b", {lime, gap})`
  pill che si apre come una barra · `.axisLabel(t, "x"|"y", testo)` · `.storyAt(k, t, "tu")` foto vera con l'anello delle storie ·
  `.pt(k)` `.tip(f)` `.rect`. Inquadrature: la prima comprende tutto il grafico (asse Y sotto il titolo, regola 17), poi
  `frameRect` sulla parte destra con il bordo alto = cima del grafico.
- **`signal(parent, connettore, t, dur = 0.4, {sign: "+" | "-", back})` C03**: disco col segno che viaggia sulla linea; "+" lime
  pieno, "−" grafite col bordo bianco; all'arrivo un anello.
- **`disintegrate(parent, nodo, x, y, w, h, idImmagine, t, {cols: 52, spread, dur: 0.7})` F10**: polvere su **canvas** (migliaia
  di pezzi veri dell'immagine con la scia), il centro si sbriciola entro 0,13 s e la nuvola resta fitta fino al taglio (reel 40).
  L'immagine deve essere nel pool (`th-`, `av-`, `obj-`).
- **`listK(…, {locks: true}).unlock(i, t)` L05**: la barra si riempie di lime in 0,2 s, testo scuro, lucchetto aperto con un colpo.
  `listK` ha anche `.rowXY(i)` e `.rect(k)`.
- **`loopMap(parent, cx, cy, nomi, {a, b, w, fs, molecole})` K17** (nuova, segnalata dall'utente: reel 79 di Kallaway): ∞ al
  neon con le molecole di dopamina, tappe 1 in alto a sinistra → 2 in basso a destra → 3 in alto a destra → 4 in basso a sinistra.
  `.go(i, t, {dur: 1.3})` la camera viaggia lungo il tubo dalla tappa corrente (curva uguale al reel 79, scarto 0,04) con il riflesso
  davanti; la prima volta è un taglio · `.name(i, tempi)` · `.overview(t, dur)` · `.dive(i, t, dur)` · `.poseStage(i)`.
- Base: **`pathCam(t, dur, pathSvg, L0, L1, s0, s1, {off0, off1, dip, blur})`** camera lungo un tracciato (segmenti del gestore,
  seek-safe) · **`mblurV(t, dur, curva, picco, "x"|"y"|"xy")`** scia legata alla velocità · `neonPath(…, {drawn, molecole})` con
  `.path` e **`.glintTo(t, da, a, dur)`** (riflesso in entrambi i versi).

### Blocco 2 del piano (09/10, demo: `CATALOGO-ANIMAZIONI/demo-4/`, 48,6 s) — le 10 frequenti in Kallaway
- **`bigType(spec)` A06** (misurato sul reel 139): `titleW` gigante (size 200, top 470) con le parole in ~0,8 s ·
  `.retract(t, {scale: 0.28, y: -300, dur: 0.3})` a ~1 s; **la camera è già sull'oggetto** (nessun movimento nella
  trasformazione) e sotto `calendar(…).assemble(t, {spread, dur})` monta i giorni sparsi nello stesso istante, poi `.fillVideos`.
- **`compactTitle(T, t, righe, {size: 50, top: 150, step: 0.1})` T10** (misurato sul reel 26): **taglio secco** del titolo
  grande, poi il titolo compatto si scrive parola per parola (~0,1 s l'una) nel box d'accento che nasce sottile e si allunga
  (passare un solo segmento `{t: "4 tipi di contenuto", box: true}`). La camera entra nello schema solo dopo (~0,25 s).
- **`swapWord(T, i, testo, t)` T09**: la parola `i` si cancella e si riscrive a macchina (1/40 s a lettera) con un lampo.
- **`sheenK(card, t, {dur: 0.7, w: 46, dir: -1})` F03**: banda bianca stretta a 20° da destra a sinistra (misurata sul reel 5).
  `sheen()` di kit.js resta per i reel vecchi.
- **`lineExit(parent, S, a, b, t, posa, {dur: 1.15})` K09** (misurato sul reel 13): **un solo movimento continuo** — la camera
  parte piano, corre a metà con la scia e frena sulla scena nuova (curva `bez(0.55, 0.17, 0.38, 0.8)`), la testa luminosa corre
  davanti (si vede crescere la linea) e arriva poco prima; il titolo nuovo si scrive ~0,8 s dopo la partenza. I titoli vivono nel
  mondo (`titleW({parent: L, x, y})`); la posa d'arrivo inquadra solo l'oggetto e il titolo va dove cade la riga dei titoli
  (`y = top_rett − (330 − 150) / posa.s`).
- **`whiteboard(parent, cx, cy, voci, {pw, ph, gap, fs})` O25** (kit2-ui): lavagna bianca vera con pannelli neri 9:16 che si
  riempiono di reel veri · `.show(t)` · `.panel(i, t)` · `.panelRect(i)` · `.rect`. **`tablet(parent, X, Y, {w, h})`**:
  `.screen` `.sw` `.sh` `.at(x, y)` `.rect`.
- **`igInsights(parent, X, Y, {media, views: [a, b], delta, skip, didascalia, data})` A07** (kit2-ui): "Approfondimenti sul reel"
  veri · `.count(t, dur)` views che salgono · `.curve(t, dur)` fidelizzazione che si disegna · `.skipOn(t)` · `.chartRect()`.
- **`handIn(parent, x, y, parola, {side, page, pw: 640, ph: 250, fs: 116})` H01**: parola a mano + freccia a ricciolo + pagina
  vera, entrano dai lati alterni con la scia (0,36 s). Come nel reel 102 la camera **parte stretta sul reel d'origine e si allarga**
  mentre arrivano le note (`camK(t, 1.5, …, KW.arrive)`). Pagine **senza sovrapporsi** (passo ≥ ph + 70) e parola sul lato libero,
  sennò la parola bianca sparisce sulla pagina bianca (reel 102: spazio tra una pagina e l'altra).
- **`conveyor(parent, x0, y, cards, {w, h, gap, speed, timeline})` K12**: `.run(t0, t1)` velocità costante · `.on(i, t)` la card
  va a fuoco, numero lime, sheen. `timeline: true` = card tutta copertina + pillola appesa alla linea del tempo (reel 25).
  Con 6 voci in 6 s: card 250, passo 272, 150 px/s, una ogni 0,8 s, `x0 = X − 445` → la voce detta è sempre in campo.
- **`glassOrb(parent, cx, cy, r, media, {iris, label})` · `orbFlower(parent, cx, cy, medias, {r, R, k0, iris0, links, dim})` O12**:
  sfere di vetro scuro con reel veri (la sfera arriva scura e l'immagine si accende dentro dopo 0,3 s, reel 39), rack focus d'apertura, `.spin` lento con le sfere dritte, `.focus(i, t)` (la centrale resta
  accesa, le altre a `dim` 0,6), `.all(t)`. `links: true` = raggi dal tema (centro) a ogni angolo (reel 49): servono `R ≥ r·k0 + r + 50`.
- **`peopleRings(…, {volti: "atlas-muro", dot: 62})`**: al posto dei puntini, **volti veri** (83 facce trovate con YuNet nei
  fotogrammi dell'atlante, `VOLTI_MURO`); `recolor` colora il bordo, `spin` li tiene dritti. Da sola: **`faceDot(parent, x, y, d, i)`**.

### Blocco 3 del piano (09/10) — le 83 del kit confrontate con Kallaway (`_analisi/voti_kit.json`), demo: `CATALOGO-ANIMAZIONI/demo-7/`
- **`KW_FISSO`**: le composizioni approvate (reel-01 v5, reel-03) hanno il marcatore `KW_FISSO` nel sorgente; `build.cjs` definisce
  `const KW_FISSO = true` e le funzioni corrette nel Blocco 3 tengono il comportamento approvato finché l'utente non vede la
  versione nuova. Le altre composizioni prendono la versione nuova.
- **`metroPath(parent, S, stazioni, etichette, {icons, side, r, fs, lw})` L11 v2** (reel 88 e 124): tracciato curvo che passa da
  tutte le stazioni, si disegna da sinistra (le stazioni nascono al passaggio, etichette sfocate); `.go(i, t, dur)` la pallina
  corre e il tratto fatto si accende di lime, la stazione si accende e l'etichetta va a fuoco · `.poseAt(i)` · `.rect`.
- **`lineChart({…, playhead: true})` D03 v2** (reel 110): barra a segmenti sotto l'asse che si riempie con la punta della curva.
- **`statCard(…, {hidden: true}).slideIn(t, {from: 1})` U05** (reel 9): la card entra di lato in corsa; sotto la linea un velo
  bianco (non più lime trasparente; con `KW_FISSO` resta il vecchio).
- **`scriptDoc(…, {fitto: true})` L12** (default): righe sottili e fitte ×1,7, cascata 0,014 s, sezioni a 0,05 s a riga (reel 35).
- **`listK(…).cascade(t, 0.08)` L03** (reel 13): oltre al bordo, un riflesso `sheenK` scende di barra in barra.
- **`hourglass(parent, cx, cy, h)` O15** (reel 60): vetro con i tappi in grafite e la sabbia lime · `.run(t, dur)` · `.flip(t)` (0,5 s,
  a fine giro torna a 0° con la sabbia in alto senza salti) · `.rect`.
- **`venn(parent, cx, cy, r, a, b, {label, fs})` O11 v2** (reel 39 e 106): cerchi di vetro (bianco e bordo lime: niente lime
  trasparente), `.one` `.two` `.meet` e `.lensOn(t)`: l'intersezione si riempie di lime pieno con il lampeggio F05.
- Segni a mano sopra le interfacce (H02, A08): un secondo `svgLayer(L, 45, …)` per `handCircle`/`handArrow`, sennò il telefono li copre.
- `faceDot(…, {bw: 0})` ora rispetta lo zero (volti nelle storie senza bordo).
- Voti finali: nessuna voce sotto 4 (le 15 senza demo stanno in demo-7; L01, L09, K10, O02, X01 corretti nelle demo).

### Blocco 4 del piano (09/10, demo: `CATALOGO-ANIMAZIONI/demo-5/`, 54,4 s) — le 11 rare
- **`water(parent, cx, cy, w, {k: 0.36})` O16**: acqua scura in prospettiva con i riflessi · `.ripples(t, x, y, {n, r})` onde bianche
  col bordo lime (1 s, 3 onde a 0,18 s) · `.splash(t, x, y)` gocce. Con `faceDot` i volti sull'acqua si accendono quando l'onda arriva.
- **`fallFollow(nodo, t, x0, y0, x1, y1, posa, {dur: 0.55})` K08** + **`pebble(parent, x, y, d, icona)`**: l'oggetto accelera
  (power2.in), la camera lo insegue con la stessa curva e frena 0,35 s all'impatto (scia verticale).
- **`sideIndex(voci, {x, top, w, fs})` L06**: indice fisso nell'HUD (la camera non lo muove) · `.show(t)` · `.go(i, t)` pill lime 0,2 s.
  Con l'indice a sinistra inquadrare il contenuto spostato a destra (rettangolo allargato a sinistra di ~250 px).
- **`lowerThird(parent, x, y, nome, sotto, {fs})` U06**: barra lime + nome maiuscolo spaziato che si decodifica (0,25 s).
- **`tierList(parent, cx, top, ["S", "A", "B", "C"], {w, rh, slot})` L07**: `.show(t)` · `.drop(nodo, riga, t)` (cade ~0,15 s a riga).
- **`morphShape(parent, cx, cy, r)` O09**: forma lime lucida (12 punti: si interpola l'attributo d) · `.spin` · `.morph(t, forma, dur)`
  ("esagono", "pentagono", "triangolo") · `.slice(t, etichette)` taglio a fasce in 0,25 s con le etichette.
- **`sinkWave(parent, x0, x1, y, {amp})` O17**: onda in grafite col bordo lime che scorre · `.rise(t, dy, dur)` · `.sink(nodo, t, dist)`.
- **`constellation(parent, S, punti, etichette, {fs, lato})` O19**: `.draw(t, 0.2)` tratto per tratto, punti lime, etichette.
- **`peopleRings(…, {percent: true}).pct(t, da, a, dur)` D09**: percentuale al centro + la stessa quota di persone in lime.
- **`circuit(S, a, b, {prima: "h" | "v", raggio})` C05**: un gomito a 90° arrotondato · `.draw(t, 0.3)` · `.pulse(t, dur, parent)`.
- **`pixelate(parent, x, y, w, h, idImmagine, {b0: 36})` F09**: canvas a blocchi · `.show(t)` · `.resolve(t, dur)` 36 → 8 → nitida
  con lo sfarfallio di tinta lime ogni 2 fotogrammi.

### Blocco 5 del piano (demo: `CATALOGO-ANIMAZIONI/demo-6/`, 84,8 s) — le nuove dalla revisione, rifatte contro Kallaway (10/10)
Dal 09/10 sera queste funzioni stanno in **`kw-kit/kit2-blocco5.js`** (stesso ambito degli altri `kit2-*.js`: il build li concatena
in un solo script). Il 10/10 sono state rifatte tutte confrontandole con le clip di Kallaway (fogli in `_analisi/moto/`); ogni
scena della demo-6 usa i tuoi reel veri in movimento (spezzoni in `demo-6/assets/clips/mio/`, presi da
`D:\CONTENUTI\OTTOBRE 2026\PARTE 1\DA PUBBLICARE`, 30 fps con un fotogramma chiave al secondo).
- **`selectCorners(parent, [x0, y0, x1, y1], {len, w, pad})` H04**: `.show(t, da)` quattro angoli lime che si chiudono in 0,35 s ·
  `.to(t, rett, dur)` · `.hide(t)`.
- **`swapPlaces(a, b, t, {dur, arco, lift})` L16** (reel 69): **un elemento alla volta**. Quello scelto si stacca (scala 1,08, bordo
  lime) e fa una S fino al posto dell'altro, che scivola dritto al suo; si può scambiare più volte. `reorder(nodi, posti, ordine, t)`
  resta per riordinare tutto insieme (a metà è confuso: usarlo solo con pochi elementi).
- **`strikeLines(parent, x, y, righe, {fs, w, lh})` T13**: `.strike(i, t)` riga lime sulle parole (larga quanto il testo) ·
  `.remove(i, t)` la riga si chiude · `.add(t, testo, {color})` si scrive (anche lei barrabile: `.strikeR(r, t)` `.removeR(r, t)`).
  Come nel reel 31 la correzione sta **dentro un'interfaccia vera**: in demo-6 è la bio del tuo `igProfile` (`bio: ["", "", ""]`
  per tenere il posto, `lh: 1.32` = l'interlinea della bio) con la camera che entra partendo dal bordo alto del telefono.
- **`stamp(parent, cx, cy, testo, {w, h, rot, fs})` F12**: `.down(t)` timbro in inchiostro lime pieno (l'usura è una maschera
  di buchi, mai trasparenza), cala in 0,16 s con il colpo di camera e l'anello di polvere. Può calare sopra al testo (è segnato).
- **`brickTower(parent, S, cx, base, etichette, {w, h, lw, fs, gap})` O28** (reel 90): **mattoncini 3D in isometria** (faccia
  davanti, faccia sopra con i pioli 2 × 4, fianco in ombra), uno sopra l'altro con un po' d'aria; grafite = non detto, lime =
  detto. `.drop(i, t)` · `.say(i, t)` · **`.snap(t)`** si incastrano in una torre sola. Ritmo del reel 90: la torre è in piedi in
  mezzo secondo (`.drop` a 0,1 s l'uno), poi le etichette vanno a fuoco una alla volta sulla voce (`.say` a ~0,7 s).
  **`brickWall(parent, x0, y0, cols, rows, {bw, bh})` F10 (il muro)**: `.build(t, dur)` · `.blast(t, {cx, cy, power})` · `.grey(t)` ·
  `.rewind(t, dur)` i mattoni tornano al loro posto.
- **`stackAway(nodo, t, x, y, i, {scale})` L15**. In demo-6 la variante del reel 15: la card vista va nella fila sotto il titolo
  (`scale` 0,26, senza rotazione, in 0,9 s mentre entra la nuova) e alla fine le tre si aprono a ventaglio, grandi (0,62, ±8°,
  quella al centro davanti, in 0,75 s).
- **`progressRing(parent, cx, cy, r, {w})` D10** (`.to(f, t, dur)` `.at(f)`): come il reel 46 mettere attorno 2–3 anelli sottili
  concentrici e il nome sotto la foto. **`stopwatch(parent, cx, cy, d, {start, unita})` U15** (`.run(t, dur, da, a, totale)`).
- **`raceChart(parent, x0, y0, linee, {w, h, mesi})` D11**: le teste (volti veri, `av: "tu"` per la tua foto) avanzano insieme
  nel tempo e ognuna sale con la sua curva: `.axes(t)` · `.run(t, dur, ease)`. Nel reel 65 la corsa parte **subito dopo il taglio**
  e sale a passo costante: `.run` 0,15 s dopo `.axes`, `ease` `"sine.out"` (il default `"power1.inOut"` parte troppo lento).
  **`val: [da, a]`** su una linea = pill col numero accanto alla testa che sale con la curva (reel 65), lime per la tua; le pill
  arrivano quando le teste si sono separate.
- **`headBrain(parent, cx, cy, h, {visibile})` O29**: profilo in grafite sul disco bianco con il cervello vero dentro. Gesti
  **misurati fotogramma per fotogramma sul reel 48** (23,976 fps), gli stessi di `brain()`:
  - `.show(t)` la testa scura col cervello bianco entra (senza disco);
  - `.disco(t)` un disco scuro col bordo lime si allarga e sparisce, poi il disco bianco si accende a scatti: mezzo, pieno, giù per
    un fotogramma, pieno (1,50–1,63 s);
  - `.accendi(t)` il cervello alterna lime e bianco a ogni fotogramma per 5 fotogrammi e resta lime, con un anello (1,71–1,88 s);
  - `.on(t)` = `.disco(t)` + `.accendi(t + 0,2)` · `.strobo(t, {n, periodo})` lampi di 2 fotogrammi ogni 0,30 s (reel 62) ·
    `.spegni(t)`.
  - **Niente battito periodico**: il "tum-tum" di `.beat` (sessione 3) non è di Kallaway ed è stato tolto. Niente alone lime
    trasparente sopra la testa scura (diventa verde oliva, regola 4). `{visibile: true}` = già in scena al fotogramma 0 (A02).
  - Camera come nel reel 48: **prima la testa da vicino** (disco e lampeggio), poi in ~1 s scende e scopre la lista sotto.
- **`gradientScale(parent, x, y, w, h, {n, etichette})` D12** (reel 12): in demo-6 con la fotocamera vera in basso (il 99%) e il
  `faro` vero che illumina la cima (il primo 10%). Nel reel 12 la barra si riempie a 1,3–2,4 s dall'inizio della scena e poi resta
  piena da leggere: non tenere il riempimento per la fine.
- **`reelActions(parent, x, y, conti, {gap, size, z})` U12** (`.on(i, t, da, a)`): come nei reel 22 e 119 la colonna va **dentro il
  reel vero** (bordo destro, con il velo scuro e il nome come in Instagram) e la camera ci entra mentre le icone si accendono.
- **`waveform(parent, x, y, w, h, {prese})` D14** (`.play` `.take` `.dim`) · **`viewfinder(parent, rett)` U14** (`.rec` `.focus`), sopra
  un tuo video vero in movimento.
- **`commentBurst(parent, rett, righe, {fs, w})` U13** (reel 123): commenti di Instagram veri e **leggibili** (volto vero, nome,
  "2 min", testo grande, "Rispondi", cuore) che riempiono il frame e salgono piano · **`.burst(t, dur, esp)`**: nel reel 123 una
  dozzina di commenti **esplode in ~0,3 s** e poi resta ferma da leggere → `burst(t, 0.65, 1.8)` (`esp` > 1 = tutti subito, poi
  rallenta; il default 0,62 è la valanga che accelera) · **`.collect(t, x, y)`** li risucchia in un punto (la cartella).
  **`fanFolder(parent, cx, cy, file, {w, h, etichetta})` O32**: `.show` `.fan` `.close`.
- **`roadFork(parent, S, cx, by, {w, h, split, labels, fs})` O30** (reel 79, "The Headfake"): la strada attesa tratteggiata in
  prospettiva (trattini sempre più corti e sottili, bordi appena accennati) e la finta, un nastro al neon lime che se ne stacca ·
  `.draw(t, dur)` dal basso · `.drive(t, dur, {finta})` la pallina coi fari corre e al bivio prende la finta (rimpicciolisce con la
  distanza) · `.choose(t)` la finta si accende, la strada attesa si spegne. **`forkPath(…)`** resta per il bivio a Y del reel 62.
- **`thermo(parent, x, yTop, yBot, {w, etichette})` D13** accanto alla scala al neon (reel 72).
- **`rocket(parent, cx, cy, h, {user, pill: {da, unita}})` O31** (reel 59, `obj-razzo`): la tua foto sopra la punta e il contatore ·
  `.show(t, dRazzo)` prima la foto, poi il razzo da sotto · `.ignite(t, dur)` · **`.ride(t, dy, dur, {pose})`** decolla e la camera lo
  insegue (resta in campo, le linee di velocità passano; niente scia sul mondo, così foto e numero restano leggibili) ·
  `.count(t, a, dur, ease)` (nel reel 59 il numero sale **da subito** e quasi lineare: `ease` `"none"`, partenza col razzo) ·
  `.liftoff(t, dy, dur)` decollo a camera ferma. Nella demo-6 l'orbita dei volti **gira** (perno per anello che ruota, volti che
  controruotano per restare dritti) e al decollo i volti **esplodono verso l'esterno** (crescono, volano lungo il raggio, si spengono).
- **`hookCatch(parent, cx, cy, {w, h, d, altri})` O27** (reel 100): cornice con la canna (puntini lime), la lenza lime che si arcua
  e l'acqua a bande con le onde che scorrono · `.show(t)` · `.cast(t, dur)` l'amo d'acciaio (disegnato) scende sull'arco ·
  `.swim(t, dur)` chi scorre (volto vero) nuota con la scia · `.snap(t)` abbocca e viene strappato fuori con gli schizzi.
- **`figure3d(parent, cx, base, h, {flip, z})` O26** (reel 18, 52, 62): **il manichino bianco luminoso** di Kallaway, di profilo,
  chino sul telefono, busto che sfuma (`obj-manichino`: Adobe Stock 140421534 → `_tools/manichino.py`). Guarda a sinistra: il
  telefono grande con lo schermo vero va da quel lato (reel 18) · `.show(t)` entra di lato · `.screen(t)` lo schermo gli illumina
  il viso · `.dot(t)` punto lime sulla testa · `.focus(t, tieni)` lente sulla testa (reel 52) · `.pulse(t)` disco dietro (reel 62) ·
  `.away(t)` se ne va in grigio · `.headXY()` `.phoneXY()` `.headR`. La vecchia figura d'argilla (`obj-persona`) è in
  `assets/obj_archivio/`: l'utente l'ha bocciata perché "non è Kallaway".
- **Altri due oggetti** nati per i tentativi del reel 09/10 (sessione 3) e mai confrontati con un riferimento preciso di Kallaway
  (nessuna voce di catalogo):
  - **`gauge(parent, cx, cy, r, {etichetta})`**: lancetta su semicerchio d'acciaio, scala dal grafite al lime ·
    `.show(t)` · `.to(t, f, dur)` · `.shake(t, dur)` lancetta bloccata che trema. È il D08 "gauge semicircolare", **bocciato** nel
    reel-01: non usarlo come scena; al suo posto D01 o O23.
  - **`glassCage(parent, cx, cy, r, {n})`**: cupola di vetro a schegge (il "carcere" di una convinzione) · `.close(t)` le schegge
    arrivano · `.shatter(t)` crepe e schegge che volano via con le scintille. Effetto di rottura simile a F10, da usare solo se una
    frase parla di qualcosa che si rompe.
- Segni a mano sopra gli oggetti: un secondo `svgLayer(L, 45, …)`. Nomi delle variabili: mai `card` (c'è già nel kit).

### Blocco 3 bis (10/10, demo: `CATALOGO-ANIMAZIONI/demo-8/`, 36,2 s) — le più usate, rifatte da protagoniste
Le strisce di confronto (`_analisi/moto/<ID>.jpg`) mostravano lo stesso difetto nelle voci più frequenti delle prime demo:
**più dispositivi stretti nella stessa scena**, piccoli, mentre Kallaway dà a ognuno tutto il frame. Regola: **una voce = una scena
da protagonista** (oggetto grande, camera che ci arriva, 3–6 elementi secondari che spiegano il numero o la frase).
- **L01 · L02 · K14** (reel 5): la lista c'è **dal fotogramma 0** con le voci sfocate (`listK(…).show(k, 0)` + `gsap.set` delle barre
  a opacità 1), le voci vanno a fuoco con lo sheen sulla parola, alla fine la prima sale e fa da intestazione (`.promote`).
- **D01 · U05 · K03** (reel 9): si parte sul contenuto (il tuo reel), la camera viaggia (`move`) e la `statCard` grande (`w` 820,
  `fs` 160, `{hidden: true}` + `.slideIn`) entra di lato in corsa; `.count(t, 0, 27, 0.95, fmt)` col grafico e il bagliore, **che
  parte mentre la card sta ancora entrando** (0,1 s dopo `.slideIn`, come nel reel 9). Il numero ha sempre l'etichetta: cosa
  misura e rispetto a cosa.
- **D04** (reel 18): **`igInsights(…, {colore: "#ffffff", punti})`** curva bianca (il lime è per ciò che funziona) e
  **`.crash(t, u, causa)`**: nel punto u della curva si gonfia un disco pieno bianco che si spegne in ~0,5 s (il disco rosso del
  reel 18), poi resta il disco del crollo (scuro col bordo bianco, pulsa piano) e sopra, su una linea guida, la pill con la causa.
  Il crollo arriva appena la curva lo raggiunge (curva in ~0,8 s, come nel reel 18). Se la camera entra sul grafico, spegnere la
  parte alta dello schermo (regola 20).
- **A01 · L14 · D02 · F11 · F04**: `reelWall` di reel veri di un creator con la riga del profilo sopra (foto vera, nome, "Media:
  390K views"), badge che poppano, la media che si spegne (`tint(…, "no")`), l'outlier col riflettore (`spotlight`) e la pill che
  spiega ("4× la sua media").
- **O05** (reel 4): **`pyramid(…, {labelsR: [...]})`** 4 livelli con l'etichetta a sinistra e la **pill del valore a destra** (il
  livello più alto lime); arriva in corsa (`arriveRect`) e si costruisce dal basso.
- **L09** (reel 3): **`flowTree(parent, S, cx, y0, livelli, {dy, w, fs, h, z})`** (in `kit2-blocco5.js`), albero a righe di pill
  con linee morbide. `livelli` = `[{nodi: [{t, p, lime}], cols, w}]` (`p` = indice del genitore nella riga sopra) · `.grow(l, t,
  {step, dur})` fa nascere la riga l · `.light(l, i, t)` accende di lime il ramo seguito · `.rowRect(a, b)` per inquadrare le righe
  a–b mentre la camera scende con la crescita · `.nodeXY(l, i)` · `.rect` · `.L`. In demo-8: nicchia → 5 argomenti → 10 angoli →
  7 formati, poi la formula "5 × 10 × 7 = 350 idee"; la radice si spegne quando finirebbe sotto il titolo (regola 20) e torna
  quando la camera si allarga.

### Lezioni del confronto del 10/10 notte (strisce di tutte le voci del Blocco 5 e del Blocco 3 bis)
1. **Kallaway carica il movimento subito dopo il taglio**: la torre del reel 90 è in piedi in mezzo secondo, i commenti del reel 123
   esplodono in 0,3 s, la corsa del reel 65 e il contatore del reel 59 partono al primo fotogramma. Da noi gli oggetti tendevano a
   costruirsi piano. Si parte subito e poi si lascia il tempo di leggere.
2. **Gli elementi grandi che cambiano posto** (card che va nella fila, camera dalla testa alla lista) si muovono in ~0,9–1 s con la
   coda morbida, non con scatti di 0,5 s.
3. **Da verificare: la deriva della camera dopo un taglio.** Nelle strisce di D13, O27, H04 e L16 la camera di Kallaway continua a
   scivolare rallentando (100–150 px/s); il nostro `float` (2% in 5 s) è quasi fermo. Prima di cambiare `float` nel kit va misurato
   sui fotogrammi quanto cresce davvero la scala (nota in `voti_kit.json`, voce D13).

### UI di Instagram (kit2-ui.js)
`brandIcon(parent, cx, cy, size, tipo)` (instagram, youtube, facebook, google, esplora, simili) · `tapFinger(parent)` U07
(`.show(t, x, y)` `.to(t, x, y, dur)` `.tap(t)` `.hide(t)`) · `phone2(parent, X, Y)` (`.at(x, y)` = punto dello schermo nel mondo) ·
`iosSwitch` · `igSettings(parent, X, Y, righe, {user, titolo, sezione})` U08 (`.on(i, t)` `.sw(i)` `.rowRect(i)`) ·
`igNotif(parent, cx, top, {user, nome, testo, allegato})` U09 (`.show(t)` · `.attXY()` dove atterra `docWall.send`) ·
**`igDrafts(parent, X, Y, [media])` U10** (`.dots(i)` `.tileXY(i)` `.menu(t)` `.row(k)` `.rowLabel(k)` `.rowEl(k)` `.pick(k, t)` `.closeMenu(t)`
`.duplicate(t, media)` `.tiles` `.tileRect` `.sheetRect`) · **`lens(parent, x, y, elemento, {fx, fy, r, k})`** (lente vera: ingrandisce una
copia dell'elemento: `.show` `.hide` `.copy`) · **`igShare(parent, X, Y, media)` U11** (`.swXY()` `.share()` `.save()` `.backXY()`
`.thumbXY()` `.trial(t)` `.press("share" | "save", t)` `.reset(t)` `.trialRect()`) · **`igToast(screen, cx, y, testo)`** (`.show(t, dur)`) ·
**`igProfile(parent, X, Y, {user, handle, nome, bio: [...], post, follower, seguiti, grid, blurStats, chiaro, mio, ring, verificato})` U02**
(`.count(t, campo, da, a, dur, fmt)` `.pill(t, campo)` `.hl(t, "header" | "bio" | "bottoni" | "griglia")` `.follow(t)` `.followXY()`
`.cellXY(i)` `.partRect(parte)`) · **`profileCard(parent, cx, top, {user, handle, numero, vids})`** (scheda del reel 9: `.show(t)` `.rect`).
Firme e metodi: vedi i commenti in testa a ogni funzione e gli esempi in `CATALOGO-ANIMAZIONI/demo-2/index.src.html`.
Utility: `glass(parent, x, y, w, h)`, `limeFill(k)`, `shade(k)`, `clipGlow(...)`, `svgIn(parent, w, h)`, `drawable(path)`, `drawOn(path, t, dur)`.

### Storie di Instagram (kit2-storie.js, sessione 5: reel 10/10, servono anche al 13/10) — catalogo U16, U17, C06
File a parte: nessuna funzione esistente cambia. Esempio completo: `reel-10/index.src.html`.
- **`storyCircle(parent, cx, cy, d, src, {ring, nome, lw, fs, plus, z})`**: il cerchio di una storia. `src` = `"tu"` / handle di
  `assets/avatars` / `{face: i}` (volto dell'atlante) / `{anon: true}` (persona qualunque) / `{media: id}`. `ring`: `"ig"` (gradiente,
  da vedere) · `"visto"` (grigio) · `"lime"` (spinta/scelta) · `"none"`. `.seen(t)` `.ig(t)` `.lime(t)` `.dim(t)`. Nome sotto lungo
  al massimo quanto il passo della fila (`lw`): i nomi lunghi vanno troncati a mano come in Instagram ("samuelerinal…"), sennò
  `check` li conta come testi sovrapposti.
- **`storyRow(parent, x, y, items, {d, gap, pad, panel})`**: una fila di cerchi (`panel: true` = la striscia scura di un telefono);
  `.xy(i)` `.pitch` `.rect`. Per "prima in ogni fila": i cerchi scivolano di `pitch` e il tuo compare al posto 0.
- **`igHome(parent, X, Y, {storie: [{src, nome, ring, plus}], post: {user, nome, media | atlas}, user})`**: home del vecchio stile
  (scritta Instagram, fila delle storie, un post con un reel vero, tab bar). `.tray[i]` `.circleXY(i)` `.circleRect(i)`
  `.trayRect()` `.postRect()` `.header`. Il post di un altro creator con `atlas: q` viene sgranato (miniatura 128 px): meglio
  un tuo reel vero.
- **`igStoryEdit(parent, X, Y, {media, user})`**: l'editor con "La tua storia" · "Amici più stretti" · →; `.yourXY()` `.press(t)`.
- **`igStoryView(parent, X, Y, {user, nome, quando, media, segs, seg})`**: la storia aperta. `.play(t, dur, {da, a})` riempie il
  segmento · `.fillTo(k, t)` · `.like(t)` (cuore rosso + cuoricini) · `.reply(t, testo)` + `.sent(t)` · `.share(t)` ·
  `.swipe(t, idProssima | {atlas: q})` scorrimento a cubo verso la storia dopo · `.reset(t)` · `.barRect()` `.heartXY()`
  `.inputXY()` `.sendXY()` · `.content` (per aprirla dal cerchio: `fromTo(content, {scale: .2, transformOrigin: "223px 199px"})`).
  Un video del pool sta in un posto solo: per riaprire la storia da capo serve un secondo `igStoryView` con un altro id.
- **`algoPill(parent, cx, cy, {testo, fs})`** C06 (reel 40): `<Algoritmo/>` monospaziato che si decodifica, bordo lime pieno;
  `.show(t)` (disco piccolo: sta subito sotto il titolo) · `.flash(t, "+" | "-")` all'arrivo di un `signal()`.
- **`orologio(parent, cx, cy, d, {ora, min})`** U17: `.show(t)` `.spin(t, dur, ore, ease)` `.off(t)`.
- **`sagomaK` / `personaK`**: la persona qualunque di profilo del reel 09 (per chi guarda), **`atlasCrop(parent, x, y, w, h, q)`**.

Lezioni del reel 10/10:
- Gli spezzoni dei reel finiti hanno flash di transizione e grafiche ogni ~5 s: prima di usarli si cercano le finestre pulite
  con `_tools/finestre_pulite.py` (luminanza stabile) e si controllano a 6 fps; se serve una storia lunga si uniscono due blocchi
  (`_tools/spezzoni.py`, riga con "+"). Il foglio a 1 fps non basta: il flash del 04/10 a 22 s cadeva tra due fotogrammi.
- Una salita/discesa lunga (K08) non deve attraversare il vuoto: si avvicina la destinazione e si mettono linee di velocità
  lungo il percorso; a fine corsa la camera si ferma un filo oltre la posa (dalla parte del titolo) così niente resta sotto il titolo.
- Arrivo dopo un taglio verso l'alto: se il contenuto entra dall'alto passa sotto il titolo; meglio arrivare di lato.

### Reel 11/10 (kit2-reel11.js, sessione 5: "Non è la fotocamera, è la luce") — catalogo O33, O34, F13, D15
File a parte, nomi col suffisso `R11`: nessuna funzione esistente cambia. Esempio completo: `reel-11/index.src.html`.
- **`scalaR11(parent, x0, ground, {w, r, dx, dy, pill})`** O33: 4 gradini 3D in grafite (pedata con lo spigolo che si accende,
  fianco sull'ultimo). Sull'alzata: numero, pill del valore (`pill`: testi), **`follaR11`** (10 × 10 persone, la tua foto al posto 4).
  `.rise(t, passo)` in piedi uno dopo l'altro · `.num(i, t)` · `.edge(i, t, lime)` · `.pill(i, t)` · `.tread(i)` → `{x0, x1, y}` ·
  `.faceRect(i)` (alzata da inquadrare per il dato) · `B[i].folla.accendi(t, n, "bianco" | "lime" | "grigio")` in ordine di lettura (le
  righe si contano: 50 = 5 righe) · `.te(t)` · `.tinta(t, da, a, colore)` onda F11 · `.lampo(t, n)`.
- **`reelLuceR11(parent, x, y, w, h, vid, {stato, bare, play})`** F13: il tuo reel vero con la luce del momento. `.stato(t, nome, dur)`
  con `buio`, `lampadina`, `telefono`, `finestra`, `faro`, `controluce` (filtro sul video + veli: nero, luce dall'alto, luce di lato,
  grana feTurbulence, vignetta) · `.rim(t)` / `.rimOff(t)` bordo lime + alone dietro · `.sfarfalla(t, seq)` · `.grana(t0, t1, passo)` ·
  `.maniglia(t, a)`. `bare: true` = senza cornice né maniglia, dentro lo schermo di un telefono.
- **`telefonoR11(parent, cx, bottom, vid, {k, stand, stato})`**: telefono sul cavalletto con l'app della fotocamera (timer, VIDEO, tasto)
  e il reel dentro (`.R`) · `.rec(t, dur)`. **`fantasmaTelR11(parent, cx, bottom)`**: lo stesso telefono spento, senza testi.
- **`stanzaR11(parent, x0, y0, w, h, {ix, iy})`** O34 · **`lampadinaR11(parent, cx, yTop, len, {w, cono, pozza})`** `.on` `.sfarfalla`
  `.off` `.dondola`. **`finestraR11(parent, x, y, w, h, {verso})`** `.show` (notte) `.giorno` `.sole` (fasci in screen, mai lime
  trasparente) `.live` (pulviscolo). **`ledR11(parent, cx, yTop, h, {stand})`** il controluce: tubo lime pieno `.on` `.off`.
- **`mirinoR11(parent, r, {nero})`** (U14 rifatto): `nero` = fasce nere attorno (si guarda dentro la fotocamera) · `.show` `.hide` `.rec` ·
  `.iso(t, da, a, dur)` a scatti, rosso oltre 3200 · `.cerca(t, dur)` l'autofocus salta e non aggancia · `.aggancia(t, u, v)` lime.
- **`cartellinoR11(parent, x, y, testo, {w, h, fs, filo})`** D15: `.show(t)` oscilla e si assesta · `.count(t, da, a, dur)` · `.lime(t)`.
  Con `filo: 0` lo si lega all'oggetto con un `connector`. **`treppiedeR11(parent, cx, yTop, yFloor, {spread, col})`**.

Lezioni del reel 11/10:
- **Safe zone dell'11/10** (`SAFEZONE.jpg`): dalla linea y = 1332 in giù c'è la faccia dell'utente. Nel sorgente: `BAND.y1 = 1300`
  subito dopo il kit (tutte le `fitPose` finiscono a 1300) e la maschera di `#safe` che sfuma da 1290 a 1331; si controlla sulla bozza
  con `_tools/safezone.py` (restano solo code sfumate).
- Una scala in diagonale in un fotogramma verticale lascia vuoto il triangolo in alto: l'attrezzatura di ogni gradino (spenta, in
  grigio) e il fascio di luce dalla cima lo riempiono e la scala si legge già (come i livelli del reel 4). Quando la camera arriva su
  un gradino, l'attrezzatura spenta lascia il posto a quella vera; quando riparte, torna spenta.
- Inquadrare l'alzata (il dato) sotto la pedata porta in alto l'attrezzatura del gradino: va spenta prima che la camera scenda
  (altrimenti il telefono passa sotto il titolo).
- `rotationY` su un telefono grande con `transformPerspective` basso (900) lo deforma troppo: per un ribaltamento leggibile ≥ 2600.

### Reel 13/10 (kit2-reel13.js, sotto-agente della regia, 11–13/10: "Le storie in evidenza") — catalogo K18, U18, F14
File a parte, nomi col suffisso `R13`: nessuna funzione esistente cambia. Esempio completo: `reel-13/index.src.html`.
Grammatica del reel: la **profondità** — la camera entra ed esce dagli oggetti (i cerchi delle evidenze sono oblò).
- **`zoomR13(t, dur, px, py, s1, {ease, easePos, sx, sy})`**: camera in profondità a segmenti del gestore (seek-safe): la scala va a
  `s1` in modo **esponenziale** (velocità percepita costante anche per zoom ×8–9) e il punto (px, py) scorre dritto sullo schermo
  fino a (sx, sy) (default l'ancora). Nelle entrate `easePos: "power2.out"` porta il cerchio al centro presto mentre lo zoom
  accelera (`ease: "power2.in"`): con la stessa curva il cerchio arrivava al centro solo all'ultimo.
- **`obloInR13(t, c, room, {pre, D, k, settle, iris, cover, parent})`** K18 (L'OBLÒ, nuova nello stile di K07 + K13): corsa nel
  cerchio `c = {x, y, d}` del mondo (0,42 s), al taglio la "stanza" (`room = {el, x, y, pose}`: un contenitore 1×1 nel mondo con
  `clip-path`) mostra un'iride con **lo stesso posto e la stessa misura sullo schermo** (D = 520 px), che si apre (0,42 s, assestamento 0,45 s) mentre la
  camera continua ad avanzare e si assesta; la cornice d'acciaio coi bulloni (`corniceR13`) cresce con l'iride e la copertina del
  cerchio (`cover`) si dissolve nella stanza. **`obloOutR13(t, room, c, {pose, cover, pre, out})`**: il gesto inverso (l'iride si
  chiude sul centro della stanza, taglio sul cerchio piccolo della stessa misura, la camera esce all'indietro fino a `pose`).
  Si entra anche da una foto profilo (`reelFeedR13(…).avXY()`) e da un tasto rettangolare (Messaggio: `d` = altezza del tasto).
- **`profiloR13(parent, X, Y, {user, handle, nome, bio, grid, evidenze, ring})`** U18: il tuo profilo visto da chi arriva, con la fila
  delle **storie in evidenza** (`row` scorre come in Instagram: `.scrollTo(t, x)`), `msgXY()` `msgRect()` `evXY(i, scroll)` `bioRect()`
  `avXY()`; `topEls` / `bioEls` / `headEls` per spegnere la parte alta quando la camera è più giù (regola 20, niente veli opachi: il
  `check` li conta come testo coperto). **`evidenzaR13(parent, cx, cy, d, {cover, vuoto, nome, ring})`**: copertina (foto, la tua
  foto, icona su lime), posto vuoto tratteggiato col numero (L01), `.load(t, dur)` l'anello che gira mentre carica, `.numOn(t)`,
  `.fill(t, cover, nome)` (la copertina si posa e l'etichetta si scrive), `.lime(t)`.
- **`dubbiR13(parent, cx, cy, domande, {d, fs, pos})`**: chi guarda (persona qualunque di profilo, `personaK`) con i suoi dubbi in
  nuvolette: `.show` `.ask(i, t)` `.trema(t)` (senza risposta) `.answer(i, t)` (lime con la spunta) `.sereno(t)` `.stato(t, n, visibili)`
  per riprendere lo stato in una stanza nuova. **`tastoMsgR13(parent, cx, cy, {w, h})`** il tasto Messaggio col lucchetto (L05):
  `.show` `.unlock(t)`. **`pillMsgR13(parent, cx, cy, {fs})`** i messaggi ricevuti: `.show` `.nulla(t)` (tremolio a 0) `.accendi(t)` (1, lime).
- **`stickerR13(parent, cx, cy, testo, {fs, bg, col, rot, icon})`** testo delle storie (stile Classico) · **`primaDopoR13(parent, x, y, w,
  h, prima, dopo, views)`** F14: la griglia di un cliente grigia, la **tendina** scopre quella lime (`.wipe(t, dur)`) ·
  **`cartellinoR13`** (offerta) · **`recensioneR13`** (`.stelle(t)`) · **`vetrinaR13`** (`.riflesso(t)`) · **`reelFeedR13`** (il tuo reel
  nel feed con l'interfaccia dei Reels) · **`dmR13`** (la chat del DM: `.msg(t, testo)` coi puntini prima).

Lezioni del reel 13/10:
- **Un oblò si legge se al taglio il cerchio non cambia**: stessa posizione e stessa misura sullo schermo prima e dopo (match cut di
  K13), un filo di sfocatura (5 px) solo sugli ultimi fotogrammi della corsa, e la camera che dopo il taglio continua ad avanzare
  (la stanza parte all'80% della sua scala). La copertina del cerchio si dissolve dentro la stanza in 0,3 s.
- La stanza deve avere contenuto subito: un'iride che si apre su una storia ancora vuota (la card che arriva dopo) è un fotogramma vuoto.
- Due stati di testo sovrapposti (pill 0 → 1) vanno marcati con `data-layout-allow-overlap`, e quello vecchio si spegne.
- Gli spezzoni: `finestre_pulite.py` scambia per faccia anche le grafiche chiare e colorate (08/10 0–5,5 s sembrava faccia, da 1,6 s è
  la griglia colorata): conta solo il foglio a 6 fps.

### Reel 12/10 (kit2-reel12.js, sotto-agente della regia, 11–13/10: "I contenuti non sono pubblicità") — catalogo O35, D16, O36
File a parte, nomi col suffisso `R12`: nessuna funzione esistente cambia. Esempio completo: `reel-12/index.src.html`.
Grammatica del reel: l'**asse orizzontale** — una strada che si sviluppa da sinistra a destra, due corsie che scorrono insieme (sopra
i contenuti, sotto la gente), la camera che viaggia di lato senza tornare a un hub.
- **`cartelloneR12(parent, cx, ground, {vid, ad: [titolo, sotto, cta], fsBig, views, z})`** O35: il tuo reel vero (241 × 428, con
  nome e foto) dentro un cartellone su pali (`CART_R12`: pannello 788 × 456, pali di 480, lampade). `.adIG(t)` la pubblicità di
  Instagram (Sponsorizzato + barra "Acquista ora") · `.build(t)` il pannello cresce attorno al reel con il poster dell'offerta, i pali
  e le lampade · `.lampsOn(t)` / `.lampsOff(t)` (F05) · `.viewsIn` · `.views(t, da, a, dur)` · `.grey(t, k)` · `.sticker(t, testo, x,
  y, rot, {round, dark, w, h, fs, font})` adesivo che cala (F12) · `.tag(t, prezzo)` cartellino che oscilla · `.cta(t, k)` ·
  `.crollo(t, {rot, k})` le gambe cedono e il pannello cade sul posto (restituisce l'impatto: poi `disintegrate` sul reel) ·
  `.topple(t, dir)` domino · `.rect()` `.panelRect()` `.reelRect()` `.ctaXY()`.
- **`levaR12(parent, cx, cy, {label})`**: l'interruttore grande "PUBBLICA" (U04 del reel 136) che nasce acceso: `.off(t)`.
- **`righelloR12(parent, x0, y, n, pitch, {h})`** + **`anelloR12(parent, cx, cy, r, {n, w, gap})`** D16: righello d'acciaio a segmenti
  numerati (`.light(i, t)` · `.fill(i, t, "dai" | "chiedi")` bianco o lime · `.sheen(t)`) e lo stesso numero di segmenti in un anello
  attorno a una foto (`.show` · `.seg(i, t, kind)` · `.pulse(t)`).
- **`corsiaR12(parent, x0, x1, y, {volti, gap, d})`** + **`postoR12(parent, cx, cy, d)`** O36: la gente che passa (volti veri,
  `.flow(t0, t1, v)` col passo, `.dim`, `.hide`) e il posto del cliente (persona qualunque + "?": `.show` · `.empty` · `.fill` · `.hide`).
- **`bollaR12(parent, x, y, testo, {side, fs})`** il messaggio diretto (`.typing(t, dur)` i puntini, `.show(t)`) · **`parentesiR12`**
  parentesi quadra orizzontale (L10) col numero e la parola.

Lezioni del reel 12/10:
- **Un mondo orizzontale nel 9:16 lascia vuota la banda in verticale**: una fila lunga di 10 reel (o di cartelloni lontani) costringe a
  un'inquadratura larga e piccola (densità 0,2). Si riempie con ciò che spiega la frase sopra e sotto la fila (la curva delle
  visualizzazioni che crolla sopra i cartelloni, le due linee 1 e 2 lungo le corsie, la gente sotto) oppure si compatta l'oggetto: la
  regola "8 su 10" è diventata una bacheca 2 × 5 col righello sotto (densità 0,75).
- Safe zone a 1320: `BAND.y1 = 1300` subito dopo il kit e la maschera di `#safe` che sfuma tra 1290 e 1331; i pali che escono dal basso
  nel primo piano sfumano con la maschera. Un oggetto non ancora detto ma già in scena (tu e l'interruttore nella scena 4) va tenuto
  sfocato e semitrasparente (L01) finché non viene detto.
- Testo bianco coperto da un disco lime (numero acceso) o da una barra (la richiesta nel reel): il `check` lo conta come contrasto
  basso o testo coperto → quando si accende il disco il numero sotto diventa scuro, quando arriva la barra il nome sotto si spegne.

## Ritmo e template (13/10, passo 0 del rifacimento: `CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md`)
Regole misurate su Kallaway in `CATALOGO-ANIMAZIONI/_analisi/ritmo/RITMO.md` (R1–R6 approvate il 13/10; R7 e R8 provate nel blocco 1 e approvate il 14/10).

**Marcatore `KW_RITMO`** (il contrario di `KW_FISSO`): se il sorgente contiene la parola, `build.cjs` definisce
`const KW_RITMO = true` e valgono:
- **niente rimbalzi (R5):** ogni ease `back.*` con parametro > 1,2 (anche quelle scritte dentro il kit: i pop di scala con
  `back.out(2–3)`) diventa la curva morbida corrispondente, con la stessa durata. Resta solo il colpo voluto: `back.out(≤ 1.2)`
  (timbro F12) o una funzione di ease;
- **safe zone:** `BAND.y1 = 1290`, quindi `fitPose`, `apertura` e i template inquadrano sopra la faccia (y 1332). Nella shell la
  maschera di `#safe` sfuma tra 1288 e 1330 (come i reel 11–13 e `CATALOGO-ANIMAZIONI/ritmo-09`).

Senza il marcatore non cambia niente: demo-8 ricostruita, 5 snapshot prima e dopo con differenza 0 (13/10).

**Funzioni nuove** (`kit2-ritmo.js`, si possono usare anche senza il marcatore):
- `apertura(t0, t1, rect, {modo, dx, dy, ds, dur, tenuta, top, bottom, fill})` — R2 + R3: taglio sul rettangolo, UN movimento
  principale subito, poi la tenuta (deriva dell'1,2% che si spegne fino a t1). `modo`:
  - `"arrivo"` (default): entra dal basso (dy 140) o di lato (dx), 0,7 s, expo.out;
  - `"zoom"`: +15% in 0,4 s, power2.out;
  - `"spinta"`: R4, vedi sotto (`o.spinta` = opzioni);
  - `"fermo"`: il movimento principale è dell'oggetto (riempimento o conteggio dal primo fotogramma).
- `spinta(t, {ds: 0.09, dur: 2.4, dx, dy, coda, dsCoda: 0.01, dxCoda, dyCoda})` — R4, la deriva lunga (reel 72: +9,6% in 2,4 s,
  power2.out), solo per un oggetto solo che si legge.
- `popK(target, t, {da: 0.8, dur: 0.15, y, stagger})` — R5, il pop senza rimbalzo (opacità + scala, power2.out).
- `montaT(t0)` → `{ t, dur, fine }`: quando montare gli oggetti della scena **prima** del taglio (da t0 − 1 s, finiti entro
  t0 − 0,1 s); `null` per la prima scena (t0 < 1 s): allora gli oggetti vanno messi già pieni con `gsap.set` (regola 24).
  I build con le cascate durano più di `dur`: guardare la snapshot al taglio.
- `sfondoFermo()` — R7 (approvata 14/10): i puntini dello sfondo non seguono più la camera (il titolo è già fermo nell'HUD).
- **Opzione `ease` per riempimenti e conteggi** (R6: continui, lineari o quasi), aggiunta in coda con il default di prima:
  `thermo(…).to(t, f, dur, ease)` (e ora espone `tube`, `fill`, `bulb`, `lab`, `tipY(f)`), `statCard(…).count(t, da, a, dur,
  fmt, ease)`, `crowd(…).count(t, da, a, dur, fmt, ease)`, `igProfile(…).count(t, campo, da, a, dur, fmt, ease)`,
  `igInsights(…).count(t, dur, ease)`; `progressBar(…).fill` e `counter()` l'avevano già. **Regola per i blocchi:** quando un
  template ha bisogno di un'opzione nuova in una funzione del kit, la si aggiunge in coda con il default di prima, così le
  composizioni senza `KW_RITMO` non cambiano.

**Template** (`kit2-template.js`; se cresce, più file `kit2-tpl-<categoria>.js`, il build li prende tutti):
- `TPL.<ID>(scena, opzioni)`:
  - `scena = { t0 (il taglio), t1, X, Y (centro nel mondo), parole: {…}, parent }`;
  - `opzioni` = il contenuto (titolo, voci, numeri, media veri, utente, colori…).
- Restituisce `{ rect, pose, ancore, elementi, tempi }`. Con le ancore e la posa il reel lega le scene (arrivo dalla scena
  prima, match cut); con `tempi` scrive gli SFX; con `ingresso: "nessuno"` la camera la muove il reel (transizione morbida R8).
- Dentro ogni template: montaggio prima di t0 (`montaT`), un movimento principale al taglio (`apertura` o `spinta`), accenti
  sulle parole (al massimo 2–3), niente `back.out`, riempimenti continui. Il titolo della scena (`tplTitolo`) sta nell'HUD,
  entra dal taglio a 0,12 s a parola (o sui tempi di `parole.titolo`) ed esce 0,45 s prima di t1.
- **Scheda in testa:** commento `/* @scheda <ID> · <nome>` con le righe `quando`, `frase`, `durata`, `scena`, `opzioni`,
  `restituisce`, `suoni`, `regole`, `prima`, `chiamata` (le righe con più rientro continuano il valore). La legge
  `_tools/genera_catalogo_ritmo.py` per la pagina `CATALOGO-ANIMAZIONI/catalogo-ritmo.html`.
- **Contro la ripetizione:** in un reel ogni template compare una volta (al massimo due se è il centro del concetto); la pagina
  mostra «usato in» (le chiamate `TPL.<ID>(` nei sorgenti dei reel), per non ripetere lo stesso template in reel vicini. Il
  concetto del reel resta originale: i template sono i mattoni, non il reel.

Fatti: **`TPL.D13`** (termometro accanto alla scala, dal lab D13; scena di prova in `CATALOGO-ANIMAZIONI/ritmo-09`, 06/10 «Non
serve rifare il profilo da zero, serve salire di uno step alla volta.»). Misurato: spinta +8,9% in 3 s (Kallaway +9,6% in
2,4 s), angoli 79 → 35 → 2 px/s (Kallaway 86 → 41 → 8), niente rimbalzi.

**Blocco 1 (13/10 notte, `CATALOGO-ANIMAZIONI/ritmo-01`, stato in `ritmo-01/STATO.md`)**: 12 template nuovi in file per categoria
(`kit2-tpl-oggetti.js` O01 O21 · `kit2-tpl-connettori.js` C01 · `kit2-tpl-luce.js` F08 · `kit2-tpl-ui.js` U02 U03 U10 U11 U07 ·
`kit2-tpl-liste.js` L11 · `kit2-tpl-dati.js` D01 · `kit2-tpl-testo.js` T05). Aiuti comuni in `kit2-template.js` (D13 non cambia):
- `tplTitoloK(scena, o)` — come `tplTitolo`, ma l'uscita finisce prima del taglio anche coi titoli di 6+ parole (con `tplTitolo`
  l'ultima parola sfumava nel primo fotogramma della scena dopo);
- `tplMonta(t0, fa, pieno)` — montaggio prima del taglio (`montaT`) o tutto pieno per la prima scena;
- R7 (approvata 14/10): `tplFermo0(scena, o)` registra la finestra della scena (`o.fermo`, `o.fermoDa`), `tplFermo()` una volta in fondo
  alla composizione → `sfondoFermo(finestre)` (opzione in coda: i puntini fermi solo nella tenuta, con la camera nelle transizioni);
- R8 (approvata 14/10): `tplZoomThrough(t, [x, y], posa)` (corsa dentro un'ancora della scena prima, 0,16 + 0,45 s), `tplPan(t, posa)`
  (scorre di lato sine.out 0,7 s, come la card del reel 9), `tplTenuta(t, t1)`; C01 con `da` = transizione con la linea;
- `tplReelCard`, `tplTagReel` (il reel che esce dal telefono con PROVA / NORMALE).
Opzioni in coda, default di prima: `reelRing.open(t, dur, ease)`, `cursor().moveTo(t, x, y, dur, ease)`, `metroPath.show(t, dur,
piene)`, `igDrafts.duplicate(t, id, accanto)`, `sfondoFermo(finestre)`. Lezioni: `algoPill` senza `decode()` mostra un tag vuoto
(innerHTML «<Algoritmo/>»: impostare `tx.textContent`); viaggi e frusta vanno misurati (`_analisi/ritmo/_script_blocco01/viaggio.py`):
con la scena dopo a 1,5 schermate il picco era 2,5–4,7 volte Kallaway → scena vicina (~1 schermata) e 0,7 s; l'apertura degli anelli
di Kallaway dura ~0,85 s power1.out (`radiale.py`), non 0,3 s; nelle schermate UI di Kallaway la camera è ferma (si muove il puntatore).

**Correzioni della regia al blocco 1 (13–14/10)** (stato in `CATALOGO-ANIMAZIONI/ritmo-01/STATO.md`, «Correzioni regia»):
- **Telefoni nella proporzione di Kallaway** (`kit2-tpl-ui.js`, `TPL_TEL` + `tplTel` / `tplPosaTel` / `tplSfumaTel`): opzioni
  `scala` (larghezza del telefono / 1080), `alto` (y del bordo alto), `sfuma` (px di sfumatura prima di y 1290) in U02, U10, U11,
  U07. Default nuovo solo con `KW_RITMO`: U02 0,555 (reel 3; col colpo 0,66), alto 420, sfuma 150; U10 · U11 · U07 0,435 (lo
  schermo 0,415 come il reel 65), alto 365, interi. `scala: null` = l'inquadratura di prima (telefono intero, 0,376).
- `apertura(t0, t1, rect, { posa })`: opzione in coda, una posa già calcolata al posto di `fitPose(rect)` (default di prima).
- **L11 «diagonale»** (default con `KW_RITMO`; `layout: "colonna"` = quella di prima): il tracciato entra dal bordo sinistro,
  scende a S per le tappe ed esce dal destro (reel 124); la scena riempie `area` (default x 90–990, y 390–1250 dello schermo);
  il tracciato coi due tratti di bordo si disegna in `durTracciato` 1,0 s (10 → 90% in 0,43 s, K 0,50 s).
- pop.py su tutte le voci: nessun rimbalzo rimasto. I riquadri lime (highlight) si misurano su uno spezzone coi soli pixel lime
  (col contenuto fermo dentro il modello di pop.py resta a scala 1); un foglio scuro che sale (bozze) a sola traslazione.
- demo-8 senza `KW_RITMO`: kit senza e con le correzioni, 3 snapshot (1,2 · 13,7 · 31,5 s) con hash identici.

**Blocco 2 (14–15/10, `CATALOGO-ANIMAZIONI/ritmo-02`, stato in `ritmo-02/STATO.md`)**: 12 template nuovi, sulle frasi dei reel 14 e 15
(`kit2-tpl-luce.js` F02 F04 · `kit2-tpl-oggetti.js` O13 O10 O24 O23 · **nuovo `kit2-tpl-camera.js`** K11 K16 (+ `tplFasciaTitolo`,
fascia scura dietro al titolo per le scene a tutto schermo) · `kit2-tpl-ui.js` U15 · `kit2-tpl-liste.js` L09 L12 · `kit2-tpl-dati.js` D06).
R8 nel blocco: 3 morbide su 11 cambi (K11→F04 `tplZoomThrough` nell'eccezione accesa del muro, L09→L12 `tplZoomThrough` nel reel di un
filone, K16→D06 `tplPan`). D13: la demo `ritmo-09` ora usa i 2,25 s di default (niente `parole.arriva`).
Opzioni in coda, default di prima: `pulse(…, { cresce, svanisce, allarga })` (0.22 / 0.5 / 1.13), `bullseye().ring(i, t, dur, ease)`
(0.32 expo.out), `scriptDoc(…, { fsTitolo, fsLab, top })` (40 / 22 / 100), `stopwatch()` restituisce anche `num`; `build.cjs` mette
l'atlante del muro nel pool anche quando la composizione chiama `TPL.K11(`. demo-8 senza `KW_RITMO`: kit di prima e kit nuovo, 3
snapshot (1,2 · 13,7 · 31,5 s) con hash identici (15/10).
Lezioni: **un filtro animato da `none`** (`tl.to(x, { filter: "grayscale(1) brightness(.5)" })`) **parte da brightness(0)**: un fotogramma
nero al primo passo (visto in F02 e F04, corretto con `fromTo` da `grayscale(0) brightness(1)`; c'è anche in F08 del blocco 1, a onda,
sulle persone: −6/−7 di luminosità per un fotogramma). Con 30+ video nella composizione (`ritmo-02`: 49) le `snapshot` diventano
lentissime (> 5 min per 6 fotogrammi): meglio guardare i fotogrammi dal render di prova. pop.py sugli elementi davanti ai video:
`_analisi/ritmo/_script_blocco02/solo_colore.py` (spezzone coi soli pixel lime/bianchi); proporzioni: `ingombro.py`; muri e scie:
`moto.py`; dischi F02: `disco.py`.

## Copia fedele (giro 2, dal 16/10: `CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md`, blocco C1 = reel 79 intero in `copia-01`)
File `kit2-copia-*.js` (il build li prende tutti; `kit2-copia-0base.js` viene prima di `kit2-core.js` e contiene solo funzioni):
`COPIA.<ID>(scena, opzioni)` = la voce rifatta identica a Kallaway, con la scheda `/* @copia <ID> · …` (righe `kallaway`, `misure`,
`quando`, `scena`, `opzioni`, `restituisce`, `colori`, `chiamata`) letta dalla pagina; `COPIA.r79_<nome>` = scene del reel 79 che
non sono voci; `TRANS.<tipo>` = transizioni misurate (base del catalogo delle transizioni).
- **Camera della copia `cpCam`** (in `0base`): i movimenti si scrivono come li misuro su Kallaway, cioè come spostamento del
  contenuto SULLO SCHERMO: `.taglio(t, posa)`, `.trasla(t, dur, dx, dy, ease)`, `.zoom(t, dur, k, [qx, qy], ease)`,
  `.percorso([[t, dx, dy]…])`, `.scala([[t, k]…], Q)`, `.cattura([[t, s, x, y]…])` (camera presa dal suo video con
  `_analisi/ritmo/_script_copia01/camtrack.py` → `cattura_js.py`; le catture stanno in `CP_CATTURE`), `.posa(t)`,
  `.schermo(w, t)`; **una sola chiamata `cpCam.gira(0, durata)` in fondo** scrive la camera (pista a 30 fps sul gestore camK).
- Aiuti: `cpTitolo` (T01 di Kallaway: grigio 52%, blur 9 px, +5 px → bianco in 0,2 s; ruoli "sans" = Advercase, "serif" =
  Patrick Hand; sottolineatura d'accento), `cpCardVideo`, `cpTelefono`, `cpStrato` (uno strato che si muove coi valori misurati),
  `cpFisso` / `cpFascia` (fermo sullo schermo dentro il mondo), `cpLineaMista` (dall'HUD a un punto del mondo), `cpFacecam`
  («facecam piena»: spazio scuro), `cpSchermoPieno` (spezzoni a tutto schermo nell'area utile), `cpInfD` (il ∞ di Kallaway),
  `cpBez`, `cpTab`, `cpInterp`, `cpCurva` (curve misurate).
- Opzione in coda aggiunta: `neonPath(…).draw(t, dur, ease)` (default "none" come prima).
- Misure e strumenti del blocco: `_analisi/ritmo/_script_copia01/` (`camtrack.py`, `fitmove.py`, `righe.py`, `kd_snap.py`,
  `misure_c1.py`, `affiancato.py`); foglio KALLAWAY | COPIA per scena: `_tools/foglio_kd.py --copia copia-01 [n,…]`.

## Lab veloce (prova di un oggetto senza toccare le demo)
Una cartella con `index.src.html` minimo (shell delle demo + `/*__KIT__*/`), anche fuori dal progetto (es. nello scratchpad):
`node kw-kit/build.cjs <cartella>` e `snapshot --at …` in `<cartella>/composition`. Il build inlinea il kit **dopo** aver
sostituito `<!--SFX-->` e `<!--VIDEOS-->` (i commenti del kit non vengono più scambiati per blocchi video).

## Come si prova
```
node kw-kit/build.cjs CATALOGO-ANIMAZIONI/demo-2
cd CATALOGO-ANIMAZIONI/demo-2/composition
npx --yes hyperframes@0.8.138 snapshot --at 2,10,20 --no-end --describe false
npx --yes hyperframes@0.8.138 preview --background --port 3014
```
