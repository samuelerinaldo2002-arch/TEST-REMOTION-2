// ═══ KW kit v2 · TEMPLATE · camera e transizioni (K) — blocco 2 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═══════════
// Stesso standard di kit2-template.js (scheda @scheda, TPL.<ID>(scena, opzioni) → { rect, pose, ancore, elementi, tempi }).
// Le scene di prova sono in CATALOGO-ANIMAZIONI/ritmo-02 (KW_RITMO).

// fascia scura dietro al titolo nell'HUD (per le scene a tutto schermo, come il muro K11): sale al taglio, sparisce a t1
const tplFasciaTitolo = (t0, t1, h) => {
  const f = el(hud, { position: "absolute", left: 0, top: 0, width: 1080, height: h || 400, background: "linear-gradient(180deg, rgba(24,24,24,.96) 0%, rgba(24,24,24,.82) 55%, rgba(24,24,24,0) 100%)", zIndex: 40, opacity: 0 });
  tl.set(f, { opacity: 1 }, t0);
  tl.set(f, { opacity: 0 }, t1);
  return f;
};

/* @scheda K11 · Muro di reel veri che scorre come una slot (l'eccezione che torna)
 * quando: "tra tutti i contenuti…", "ho analizzato migliaia di video", "l'eccezione mostrata in continuazione", il feed che
 *   scorre: un muro di reel veri a tutto schermo che si apre al taglio, una miniatura si accende (l'eccezione, col badge),
 *   poi il muro scorre velocissimo e si ferma dove ce ne sono altre accese
 * frase: «Non lo è. È l'eccezione mostrata in continuazione.» (14/10, 14,5–18,0 s)
 * durata: 3–5 s (consigliata 3,5–4)
 * scena: t0 (taglio: il muro si apre), t1, X, Y (centro della prima inquadratura), parole: { eccezione (si accende la prima
 *   miniatura, es. «eccezione»), scorre (il muro scorre, es. «mostrata»), titolo ([…]) }
 * opzioni: titolo, eccezioni ([[riga, colonna], …] accese: la prima si accende su «eccezione», le altre sono già accese nelle
 *   righe d'arrivo), badge ("1M"; false = niente), cols (11), vis (colonne inquadrate, 9: il muro esce dai bordi), da (prima
 *   riga della prima inquadratura, 3), a (prima riga dell'arrivo, 19), seed, fascia (true: fascia scura dietro al titolo),
 *   ingresso ("apertura" default | "nessuno"), fermo
 * restituisce: rect, pose (l'arrivo dello scorrimento), ancore { eccezione(i) (centro della miniatura i nel mondo) }, elementi {
 *   muro, celle, badge, L }, tempi { taglio, eccezione, scorre, fermo }
 * suoni: whoosh .14 al taglio · tick .06 su «eccezione» · whoosh .12 su «scorre» · land .1 all'arrivo
 * regole: R2 il muro è già lì al taglio e il movimento principale è l'apertura: zoom out ×2,4 → muro in 0,32 s con la scia
 *   (reel 61: ~0,35 s, la scia più forte a metà) · R3 una miniatura si accende (bordo lime + alone, 0,25 s, come la selezione
 *   del reel 61) · il secondo movimento è lo scorrimento della slot: 0,6 s, scia verticale legata alla velocità, frena forte
 *   (reel 61: ~0,6 s, 10,25 → 10,83 s) · poi la camera tiene (+1%) · R5 niente rimbalzi (la .spot() del kit con back.out non
 *   si usa) · R7 lo sfondo è coperto dal muro
 * prima: (demo-3 0–5,4 s · reel-09 9,8–11 s) apertura 0,24 s, scorrimento 0,7 s, .spot() con velo e scala 1,1 back.out(2,4),
 *   poi .pick() dei reel in riga: quattro movimenti in 5 s
 * chiamata:
 *   TPL.K11({ t0: 9.75, t1: 13.6, X: 7000, Y: 900, parole: { eccezione: 11.18, scorre: 11.78,
 *     titolo: [10.68, 11.05, 12.48, 12.62] } }, {
 *     titolo: [[{ t: "È " }, { t: "l'eccezione", box: true }], [{ t: "in continuazione", hand: true }]], badge: "1M" });
 */
TPL.K11 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const cols = o.cols || 11, rows = o.rows || 30, vis = o.vis || 9, r0 = o.da == null ? 3 : o.da, r1 = o.a == null ? 19 : o.a;
  const tw = 118, gap = 12, th = Math.round((tw * 228) / 128), pitch = th + gap;
  const top = Y - (r0 + 2) * pitch;
  const WS = wallScroll(L, X, top, { cols, rows, tw, gap, seed: o.seed == null ? 5 : o.seed, z: 10 });
  const cm = Math.floor(cols / 2);
  const ecc = o.eccezioni || [[r0 + 1, cm], [r1, cm - 3], [r1 + 1, cm + 2], [r1 + 3, cm - 1]];
  // le miniature accese: bordo lime + alone, sopra il muro; badge views sotto
  const celle = ecc.map(([r, c]) => WS.tiles[r * cols + c]);
  const badge = ecc.map(([r, c]) => {
    if (o.badge === false) return null;
    const [x, y] = WS.cellXY(r, c);
    const b = viewBadge(L, x, y + th / 2 - 4, o.badge || "1M", { fs: 22, z: 12 });
    gsap.set(b, { scale: 1, opacity: 0 });
    return b;
  });
  const accendi = (i, t, d) => {
    celle[i].style.zIndex = 6;
    tl.to(celle[i], { borderColor: K.lime, borderWidth: 4, boxShadow: `${GLOW_A(1)}, 0 14px 30px rgba(0,0,0,.6)`, duration: d, ease: "power2.out" }, t);
    if (badge[i]) tl.to(badge[i], { opacity: 1, duration: d, ease: "power2.out" }, t);
  };
  // 1) prima del taglio: le eccezioni delle righe d'arrivo sono già accese (fuori campo)
  const m = montaT(t0);
  for (let i = 1; i < ecc.length; i++) accendi(i, m ? m.t : 0, m ? 0.2 : 0.001);
  // 2) il movimento principale: il muro si apre (zoom out con la scia)
  const tE = P.eccezione == null ? t0 + 0.9 : P.eccezione;
  const tS = P.scorre == null ? tE + 0.6 : P.scorre;
  let pose = WS.poseRows(r0, r0 + 3, { vis });
  if (o.ingresso !== "nessuno") {
    const p0 = WS.open(t0, r0, r0 + 3, { vis, dur: 0.32, k: 2.4, hold: 0.04 });
    if (tS - (t0 + 0.4) > 0.3) camK(t0 + 0.37, tS - (t0 + 0.37), p0.fx, p0.fy, p0.s * 1.01, "sine.out");
  }
  // 3) accento: l'eccezione si accende (reel 61: la selezione si accende in ~0,25 s)
  accendi(0, tE, 0.25);
  // 4) secondo movimento: lo scorrimento della slot, poi tiene
  const dR = o.durScorre || 0.6;
  pose = WS.roll(tS, r1, r1 + 3, { vis, dur: dR, peak: 26 });
  const tF = tS + dR;
  if (t1 - tF > 0.3) camK(tF, t1 - tF, pose.fx, pose.fy, pose.s * 1.01, "sine.out");
  if (o.fascia !== false) tplFasciaTitolo(t0, t1);
  if (o.fermo !== false && KW_RITMO) TPL_FERMO.push([t0, t1]);
  const T = tplTitoloK(scena, o);
  return {
    rect: WS.rect, pose,
    ancore: { eccezione: (i) => WS.cellXY(ecc[i][0], ecc[i][1]) },
    elementi: { muro: WS, celle, badge, titolo: T, L },
    tempi: { taglio: t0, eccezione: tE, scorre: tS, fermo: tF },
  };
};

/* @scheda K16 · Push-in lento su un oggetto che si costruisce (la settimana che si compila)
 * quando: documenti, tabelle, piani che si compilano mentre parli ("organizza tutto in un calendario, alternando i filoni
 *   durante la settimana"): un solo oggetto che si legge, la camera si avvicina piano mentre si riempie
 * frase: «Infine, organizza tutto in un calendario, alternando i filoni durante la settimana per non ripetere sempre lo
 *   stesso tema.» (15/10, 28,4–34,9 s)
 * durata: 4–6,5 s (consigliata 5–6)
 * scena: t0 (taglio: parte la spinta), t1, X, Y (centro della scheda), parole: { riempie (i reel entrano nei giorni: es.
 *   «calendario»), filoni (i filoni compaiono alternati: es. «alternando»), tema (lo stesso filone s'illumina nei suoi giorni,
 *   lontani fra loro: es. «stesso»), titolo ([…]) }
 * opzioni: titolo, giorni ([{ g: "LUN", filone: "Profilo", icona: "user-round", media: "th-mio_04" }, …] 5–7), evidenzia
 *   (nome del filone da far risaltare su «tema», default il primo), titoloScheda ("La tua settimana"), spinta ({ ds: 0.15,
 *   dur: 2.0 }), ingresso ("spinta" default | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { riga(i), centro }, elementi { scheda, righe, L }, tempi { taglio, riempie, filoni, tema }
 * suoni: whoosh .14 al taglio · tick .04 sui reel · pop .06 sui filoni · ding .08 su «tema»
 * regole: R4 un solo oggetto che si legge → la spinta lunga misurata sul reel 35 (il copione: +15,8% in ~2 s, rallenta: +6% nei
 *   primi 0,25 s dopo l'arrivo, poi +3% e +1,4%), power2.out, poi coda quasi ferma · R2 la scheda coi giorni e gli spazi vuoti
 *   c'è già al taglio · R3 accenti sulle parole: i reel nei giorni (popK sfalsati), i filoni alternati, lo stesso filone che si
 *   accende nei suoi giorni (si vede che non sono mai vicini) · R6 i riempimenti in ordine, a passo costante · R7 sfondo
 *   fermo
 * prima: (demo-7 16,25–17,85 s · demo-4 44,65 s) camK +10% in 1,6 s sine.inOut mentre un oggetto si costruiva pezzo per pezzo
 * chiamata:
 *   TPL.K16({ t0: 45.6, t1: 51.2, X: 31600, Y: 900, parole: { riempie: 46.53, filoni: 47.33, tema: 50.17,
 *     titolo: [45.73, 46.07, 46.3, 46.53] } }, {
 *     titolo: [[{ t: "Tutto in un " }, { t: "calendario", box: true }]],
 *     giorni: [{ g: "LUN", filone: "Profilo", icona: "user-round", media: "th-mio_04" }, …] });
 */
TPL.K16 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const G = o.giorni || [];
  const n = G.length, rh = o.rh || 132, gap = 12, W = o.w || 820, head = 118, pad = 26;
  const H = head + n * rh + (n - 1) * gap + pad;
  const x0 = X - W / 2, y0 = Y - H / 2;
  const card = glass(L, x0, y0, W, H, { zIndex: 11, borderRadius: 34 });
  el(card, { position: "absolute", left: 34, top: 26, fontFamily: FD, fontWeight: 700, fontSize: 60, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, o.titoloScheda || "La tua settimana");
  const tw = Math.round(((rh - 22) * 9) / 16);
  const righe = G.map((d, i) => {
    const y = head + i * (rh + gap);
    const row = el(card, { position: "absolute", left: 22, top: y, width: W - 44, height: rh, borderRadius: 22, background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.09)" });
    el(row, { position: "absolute", left: 24, top: 0, height: rh, display: "flex", alignItems: "center", fontFamily: FD, fontWeight: 700, fontSize: 54, color: "rgba(255,255,255,.6)", width: 130, whiteSpace: "nowrap" }, d.g);
    // lo spazio del reel (tratteggiato) e il reel vero che ci entra
    const slot = el(row, { position: "absolute", left: 160, top: 11, width: tw, height: rh - 22, borderRadius: 10, border: "2px dashed rgba(255,255,255,.2)" });
    const tile = d.media ? mediaTile(row, 160, 11, tw, rh - 22, d.media, 3) : null;
    if (tile) { tile.style.borderRadius = "10px"; gsap.set(tile, { opacity: 0 }); }
    // il filone (pill con icona), alternato
    // la pill del filone grande (riempie la riga: nel primo render era piccola e metà riga restava vuota)
    const chip = el(row, { position: "absolute", left: 160 + tw + 30, top: (rh - 88) / 2, height: 88, padding: "0 32px", display: "flex", alignItems: "center", gap: 14, borderRadius: 44, background: "linear-gradient(180deg,#3b3b3b,#262626)", border: "1.5px solid rgba(255,255,255,.22)", fontFamily: FS, fontWeight: 800, fontSize: 48, color: K.white, whiteSpace: "nowrap" }, (d.icona ? svg(d.icona, 46, K.white, 2.2) : "") + `<span>${d.filone || ""}</span>`);
    gsap.set(chip, { opacity: 0 });
    return { row, slot, tile, chip, d };
  });
  // 1) prima del taglio: la scheda coi giorni e gli spazi vuoti (R2)
  gsap.set(card, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(card, { opacity: 1, duration: 0.2 }, t), () => gsap.set(card, { opacity: 1 }));
  // 2) accenti: i reel entrano nei giorni (in ordine), poi i filoni alternati, poi lo stesso filone nei suoi giorni
  const tr = P.riempie == null ? t0 + 0.6 : P.riempie;
  righe.forEach((r, i) => { if (r.tile) { popK(r.tile, tr + i * 0.08, { da: 0.85, dur: 0.15 }); tl.to(r.slot, { opacity: 0, duration: 0.1 }, tr + i * 0.08); } });
  const tf = P.filoni == null ? tr + 0.9 : P.filoni;
  righe.forEach((r, i) => popK(r.chip, tf + i * 0.1, { da: 0.85, dur: 0.15 }));
  const tt = P.tema == null ? tf + 1.6 : P.tema;
  const ev = o.evidenzia || (G[0] && G[0].filone);
  righe.forEach((r) => {
    if (r.d.filone !== ev) return;
    tl.to(r.chip, { background: limeFill(1), color: K.ink, borderColor: K.lime, boxShadow: GLOW_A(0.7), duration: 0.2 }, tt);
    const ic = r.chip.querySelector("svg");
    if (ic) tl.to(ic, { attr: { stroke: K.ink }, duration: 0.2 }, tt);
    tl.to(r.row, { borderColor: "rgba(207,251,80,.6)", background: "rgba(207,251,80,.06)", duration: 0.2 }, tt);
  });
  // 3) la camera: K16 / R4, la spinta lunga sulla scheda (reel 35: +15,8% in ~2 s, rallenta), poi quasi ferma
  const rect = [x0 - 10, y0 - 10, x0 + W + 10, y0 + H + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.86 });
  const sp = Object.assign({ ds: 0.15, dur: 2.0, dx: 0, dy: -10, dsCoda: 0.01 }, o.spinta || {});
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: "spinta", top: 380, fill: o.fill || 0.86, spinta: sp });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], riga: (i) => [X, y0 + head + i * (rh + gap) + rh / 2] },
    elementi: { scheda: card, righe, titolo: T, L },
    tempi: { taglio: t0, riempie: tr, filoni: tf, tema: tt },
  };
};

// ═══ blocco 3 del rifacimento (ritmo-03) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda K03 · Spostamento di camera tra due oggetti (dal primo gruppo al secondo, quando la frase passa alla seconda cosa)
 * quando: la frase passa all'elemento successivo dello stesso schema ("8 contenuti su 10 danno qualcosa, 2 chiedono
 *   qualcosa", "prima… poi…", il gruppo A e il gruppo B): la scena si apre sul primo oggetto e, sulla parola della seconda
 *   cosa, la camera scorre fino al secondo (pan + un filo di zoom), parte decisa e frena a lungo
 * frase: «8 contenuti su 10 danno qualcosa, 2 chiedono qualcosa.» (12/10, 29,0–33,0 s)
 * durata: 3,5–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1, X, Y (centro del gruppo A), parole: { a (il gruppo A si accende, es. «danno»), sposta (la camera
 *   parte verso B, es. «2»), b (il gruppo B si accende, es. «chiedono»), titolo ([…]) }
 * opzioni: a ({ media: [id] (reel veri, 4 per riga), etichetta, icona }), b ({ media, etichetta, icona }), cw (larghezza delle
 *   card, 196), distanza (px fra i due gruppi, 40: B appena fuori campo), scalaB (le card di B, 1,6: B riempie lo schermo come A), durSposta (1,3 s), ease ("power2.inOut"), ingresso ("arrivo" default |
 *   "nessuno"), fermo (R7)
 * restituisce: rect (il gruppo A), pose (A), poseB, ancore { a, b, cardA(i), cardB(i) }, elementi { A, B, L }, tempi { taglio,
 *   a, sposta, b, arrivo }
 * suoni: whoosh .14 al taglio · tick .05 su «a» · whoosh .1 sullo spostamento · tick .05 su «b»
 * regole: K03 misurato (reel 79 a 10,47 s: pan 762 px, 90% in 0,88 s, picco 2076 px/s a metà, power2.inOut, nessun rimbalzo;
 *   reel 40 a 56,7 s: 265 px con zoom in 1,3 s) · R2 al taglio il gruppo A pieno e arrivo dal basso che frena; B è già lì fuori
 *   campo · R3 il secondo movimento solo perché la frase introduce la seconda cosa · R5 niente rimbalzi · R7 sfondo fermo
 *   (anche durante lo spostamento: è un movimento dentro la scena, non una transizione)
 * prima: (demo-8 6,55 s · demo-2 34–37 s) move() con la curva bezier(0.30, 0.20, 0.35, 0.90) in 1,3 s fra oggetti lontani
 * chiamata:
 *   TPL.K03({ t0: 18.3, t1: 22.85, X: 9600, Y: 880, parole: { a: 19.58, sposta: 20.92, b: 21.22,
 *     titolo: [18.45, 18.65, 19.32, 19.58, 20.92, 21.22] } }, {
 *     titolo: [[{ t: "8 su 10 " }, { t: "danno", box: true }], [{ t: "2 chiedono", hand: true }]],
 *     a: { media: ["k1", …, "k8"], etichetta: "Danno qualcosa", icona: "gift" },
 *     b: { media: ["k9", "k10"], etichetta: "Chiedono", icona: "shopping-bag" } });
 */
TPL.K03 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const cw = o.cw || 196, ch = Math.round((cw * 16) / 9), g = 22;
  // un gruppo: card di reel veri (4 per riga) con l'etichetta sopra e il segno in basso a destra di ogni card
  const gruppo = (spec, cx, cy, cols, k) => {
    const cw = Math.round((o.cw || 196) * (k || 1)), ch = Math.round((cw * 16) / 9);
    const ids = spec.media || [], rows = Math.ceil(ids.length / cols);
    const W = cols * cw + (cols - 1) * g, H = rows * ch + (rows - 1) * g, x0 = cx - W / 2, y0 = cy - H / 2;
    const cards = ids.map((id, i) => {
      const x = x0 + (i % cols) * (cw + g), y = y0 + Math.floor(i / cols) * (ch + g);
      const c = layered(el(L, { position: "absolute", left: x, top: y, width: cw, height: ch, borderRadius: 18, overflow: "hidden", background: "#111", border: "2px solid rgba(255,255,255,.22)", boxShadow: "0 24px 56px rgba(0,0,0,.55)", zIndex: 12 }));
      mediaTile(c, 0, 0, cw, ch, id, 1);
      const sd = Math.round(58 * (k || 1));
      const sg = el(c, { position: "absolute", left: cw - sd - 10, top: ch - sd - 10, width: sd, height: sd, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,30,30,.86)", border: "2px solid rgba(255,255,255,.35)", zIndex: 5 }, svg(spec.icona || "plus", Math.round(32 * (k || 1)), "#ffffff", 2.4));
      return { c, sg, cx: x + cw / 2, cy: y + ch / 2 };
    });
    const fsE = 46;
    const lab = layered(el(L, { position: "absolute", left: cx - 330, top: y0 - 112, width: 660, height: 84, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 14 }));
    const pill = el(lab, { display: "flex", alignItems: "center", gap: 14, padding: "0 30px", height: 84, borderRadius: 42, background: "linear-gradient(180deg,#3b3b3b,#262626)", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 16px 36px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: fsE, color: "rgba(255,255,255,.7)", whiteSpace: "nowrap" }, svg(spec.icona || "plus", 44, "rgba(255,255,255,.7)", 2.4) + `<span>${spec.etichetta || ""}</span>`);
    return { cards, pill, rect: [x0 - 14, y0 - 130, x0 + W + 14, y0 + H + 14], cx, cy, W, H };
  };
  const A = gruppo(o.a || {}, X, Y, Math.min(4, (o.a && o.a.media && o.a.media.length) || 4), 1);
  // B: le sue card più grandi, così sullo schermo B riempie come A e lo spostamento è un pan (reel 79: ~760 px, senza zoom)
  const kB = o.scalaB || 1.6, nB = Math.min(2, (o.b && o.b.media && o.b.media.length) || 2), WB = nB * Math.round(cw * kB) + (nB - 1) * g;
  const XB = X + A.W / 2 + (o.distanza == null ? 40 : o.distanza) + WB / 2;
  const B = gruppo(o.b || {}, XB, Y, nB, kB);
  const all = [...A.cards, ...B.cards].map((x) => x.c).concat([A.pill.parentNode, B.pill.parentNode]);
  // 1) prima del taglio: i due gruppi ci sono già (B fuori campo)
  gsap.set(all, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(all, { opacity: 1, duration: 0.2 }, t), () => gsap.set(all, { opacity: 1 }));
  // accendi un gruppo: l'etichetta diventa lime, i segni si accendono in fila (0,05 s)
  const accendi = (G, t, lime) => {
    tl.to(G.pill, { background: lime ? limeFill(1) : "linear-gradient(180deg,#f4f4f2,#d9d9d4)", color: K.ink, borderColor: lime ? K.lime : "#ffffff", boxShadow: lime ? `${GLOW_A(0.7)}, 0 16px 36px rgba(0,0,0,.5)` : "0 0 22px rgba(255,255,255,.35), 0 16px 36px rgba(0,0,0,.5)", duration: 0.2 }, t);
    const ic = G.pill.querySelector("svg");
    if (ic) tl.to(ic, { attr: { stroke: K.ink }, duration: 0.2 }, t);
    G.cards.forEach((x, i) => {
      tl.to(x.sg, { background: lime ? K.lime : "#f4f4f2", borderColor: lime ? "#efffb8" : "#ffffff", boxShadow: lime ? GLOW_A(0.8) : "0 0 14px rgba(255,255,255,.5)", duration: 0.15 }, t + 0.1 + i * 0.05);
      const s2 = x.sg.querySelector("svg");
      if (s2) tl.to(s2, { attr: { stroke: K.ink }, duration: 0.15 }, t + 0.1 + i * 0.05);
    });
  };
  const ta = P.a == null ? t0 + 1.0 : P.a;
  accendi(A, ta, true);
  // 2) la camera: arrivo sul gruppo A al taglio (R2)
  const rA = A.rect, rB = B.rect;
  let pose = fitPose(rA[0], rA[1], rA[2], rA[3], { top: 380, fill: o.fill || 0.98 });
  const poseB = fitPose(rB[0], rB[1], rB[2], rB[3], { top: 380, fill: o.fillB || 0.96 });
  const tm = P.sposta == null ? ta + 1.2 : P.sposta, dm = o.durSposta || 1.3;
  if (o.ingresso !== "nessuno") {
    pose = apertura(t0, tm, rA, { modo: "arrivo", top: 380, fill: o.fill || 0.98, tenuta: 0.008 });
    // 3) il secondo movimento: K03, da A a B (misurato sul reel 79: ~760 px, 90% in 0,88 s, power2.inOut), poi tiene
    camK(tm, dm, poseB.fx, poseB.fy, poseB.s, o.ease || "power2.inOut");
    tplTenuta(tm + dm, t1, 0.008);
  }
  const tb = P.b == null ? tm + 0.3 : P.b;
  accendi(B, tb, false);
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect: rA, pose, poseB,
    ancore: { a: [A.cx, A.cy], b: [B.cx, B.cy], cardA: (i) => [A.cards[i].cx, A.cards[i].cy], cardB: (i) => [B.cards[i].cx, B.cards[i].cy] },
    elementi: { A, B, titolo: T, L },
    tempi: { taglio: t0, a: ta, sposta: tm, b: tb, arrivo: tm + dm },
  };
};

/* @scheda K04 · La camera si avvicina piano a un oggetto solo che si legge (la deriva lunga, R4; non una camera che fluttua sempre)
 * quando: un oggetto SOLO che si legge mentre lo spieghi (la bio, un documento, una scheda, un termometro: "la tua bio
 *   dovrebbe essere fatta di tre righe"): la camera si avvicina del 9% in 2,4 s e frena, poi resta quasi ferma mentre si
 *   accendono le parti dette. Non va usato su schemi con più oggetti, griglie, liste che si costruiscono o schermate UI col dito
 * frase: «Al penultimo posto hai la tua bio ottimizzata e dovrebbe essere fatta di tre righe.» (05/10, 54,8–59,6 s)
 * durata: 3,5–6 s (consigliata 4,5–5,5)
 * scena: t0 (taglio: parte la spinta), t1, X, Y (centro della scheda), parole: { bio (riquadro sulle righe, es. «bio»), righe (le
 *   righe si numerano una dopo l'altra, es. «tre»), titolo ([…]) }
 * opzioni: profilo ({ user: "tu", nome, categoria }), righe ([testi della bio, 3]), spinta ({ ds: 0.09, dur: 2.4, dy }: la R4;
 *   modo "continua" = lo zoom lento che accelera del reel 48, +25% in 3 s power1.in), w (980), titolo, ingresso ("spinta"
 *   default | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { centro, riga(i), foto }, elementi { scheda, righe, L }, tempi { taglio, bio, righe }
 * suoni: whoosh .14 al taglio · rise .05 sulla spinta · tick .05 su «bio» · pop .05 per riga
 * regole: K04 riletta con le misure (RITMO.md §2): il catalogo diceva "drift continuo, la camera non è mai ferma", ma dopo un
 *   taglio Kallaway tiene la camera quasi ferma (reel 79 a 18,2 s, la scena del catalogo per K04: −0,16% in 4 s; reel 123:
 *   ferma 3,4 s, poi un colpo del +4,8% quando la voce si risolve). La deriva lunga c'è solo su un oggetto solo che si legge:
 *   reel 72 (il termometro, +9,6% in 2,4 s power2.out, angoli 86 → 41 → 8 px/s) e reel 48 (il documento, +30% in 3,3 s che
 *   accelera) → il template è la spinta R4 (spinta() di kit2-ritmo: +9% in 2,4 s power2.out, il contenuto scivola verso le
 *   righe, poi coda +1%) · R2 la scheda è piena al taglio · R3 due accenti sulle parole · R5 · R7 sfondo fermo
 * prima: (demo e demo-2, ogni scena) float() +2,5% in 3–5 s quasi lineare su qualunque scena, anche su griglie e schemi
 * chiamata:
 *   TPL.K04({ t0: 31.4, t1: 36.7, X: 19600, Y: 860, parole: { bio: 33.75, righe: 35.75, titolo: [33.52, 33.75, 34.45] } }, {
 *     titolo: [[{ t: "La tua bio: " }, { t: "tre righe", box: true }]],
 *     profilo: { user: "tu", nome: "Samuele Rinaldo", categoria: "Creatore digitale" },
 *     righe: ["Video · Foto · Content Creation", "Meno contenuti casuali. Più risultati.", "Scrivimi «PROFILO» nei DM ↓"] });
 */
TPL.K04 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const pr = o.profilo || { user: "tu", nome: "Il tuo nome", categoria: "Creatore digitale" };
  const R = o.righe || ["Cosa fai", "Un risultato", "Una call to action"];
  const W = o.w || 980, pad = 50, ad = 224, fsR = o.fs || 44, rp = Math.round(fsR * 2.45);
  const hHead = ad + 40, H = pad + hHead + 30 + R.length * rp + pad;
  const x0 = X - W / 2, y0 = Y - H / 2;
  const card = glass(L, x0, y0, W, H, { zIndex: 12, borderRadius: 36 });
  // l'intestazione del profilo: la tua foto vera con l'anello, nome e categoria
  const ring = el(card, { position: "absolute", left: pad, top: pad, width: ad, height: ad, borderRadius: "50%", background: IG_GRAD, padding: 7 });
  const inner = el(ring, { width: "100%", height: "100%", borderRadius: "50%", background: "#111", padding: 6 });
  const face = el(inner, { width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", position: "relative", background: "#333" });
  imgIn(face, "av-" + (pr.user || "tu"), { objectFit: "cover" });
  el(card, { position: "absolute", left: pad + ad + 40, top: pad + 50, fontFamily: FD, fontWeight: 700, fontSize: 62, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, pr.nome || "");
  el(card, { position: "absolute", left: pad + ad + 44, top: pad + 136, fontFamily: FS, fontWeight: 600, fontSize: 38, color: "rgba(255,255,255,.55)", whiteSpace: "nowrap" }, pr.categoria || "");
  // le righe della bio, ognuna col suo numero (spento finché non si contano)
  const yR = pad + hHead + 30;
  const righe = R.map((txt, i) => {
    const y = yR + i * rp;
    const nd = Math.round(fsR * 1.25);
    const num = el(card, { position: "absolute", left: pad, top: y + (rp - nd) / 2 - 4, width: nd, height: nd, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.08)", border: "2px solid rgba(255,255,255,.18)", fontFamily: FD, fontWeight: 700, fontSize: Math.round(fsR * 0.72), color: "rgba(255,255,255,.35)" }, String(i + 1));
    const tx = el(card, { position: "absolute", left: pad + nd + 26, top: y, height: rp, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 600, fontSize: fsR, color: "rgba(255,255,255,.92)", whiteSpace: "nowrap" }, txt);
    return { num, tx, y };
  });
  // il riquadro lime sulle righe (la bio), che entra con la sua parola
  const fr = el(card, { position: "absolute", left: pad - 18, top: yR - 14, width: W - 2 * pad + 36, height: R.length * rp + 20, borderRadius: 22, border: `4px solid ${K.lime}`, boxShadow: `${GLOW_A(0.6)}, inset 0 0 26px rgba(207,251,80,.14)`, background: "rgba(207,251,80,.05)", zIndex: 3 });
  gsap.set(fr, { opacity: 0 });
  // 1) prima del taglio: la scheda c'è già, piena (R2)
  gsap.set(card, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(card, { opacity: 1, duration: 0.2 }, t), () => gsap.set(card, { opacity: 1 }));
  // 2) accento 1: il riquadro sulla bio (entra con la parola, senza crescere oltre la misura)
  const tb = P.bio == null ? t0 + 1.0 : P.bio;
  popK(fr, tb, { da: 0.96, dur: 0.18 });
  // 3) accento 2: le righe si numerano una dopo l'altra
  const tr = P.righe == null ? tb + 1.5 : P.righe;
  righe.forEach((r, i) => {
    const t = tr + i * 0.12;
    tl.to(r.num, { background: limeFill(1), borderColor: K.lime, color: K.ink, boxShadow: GLOW_A(0.7), duration: 0.15 }, t);
    tl.to(r.tx, { color: K.white, textShadow: GLOW_T, duration: 0.15 }, t);
  });
  // 4) la camera: R4, la spinta lunga sull'oggetto solo (reel 72), il contenuto scivola un po' verso le righe; poi coda +1%
  const rect = [x0 - 12, y0 - 12, x0 + W + 12, y0 + H + 12];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 390, fill: o.fill || 0.94 });
  if (o.ingresso !== "nessuno") {
    if (o.modo === "continua") {
      // reel 48: lo zoom lento che accelera fino al taglio dopo (+25% in 3 s, power1.in)
      cutTo(t0, pose.fx, pose.fy, pose.s);
      camK(t0, t1 - t0, pose.fx, pose.fy + 30 / pose.s, pose.s * (1 + ((o.spinta && o.spinta.ds) || 0.25)), "power1.in");
    } else {
      const sp = Object.assign({ ds: 0.09, dur: 2.4, dx: 0, dy: 40, dsCoda: 0.01, dyCoda: 4 }, o.spinta || {});
      pose = apertura(t0, t1, rect, { modo: "spinta", top: 390, fill: o.fill || 0.94, spinta: sp });
    }
  }
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], riga: (i) => [X, y0 + righe[i].y + rp / 2], foto: [x0 + pad + ad / 2, y0 + pad + ad / 2] },
    elementi: { scheda: card, righe, riquadro: fr, titolo: T, L },
    tempi: { taglio: t0, bio: tb, righe: tr },
  };
};
