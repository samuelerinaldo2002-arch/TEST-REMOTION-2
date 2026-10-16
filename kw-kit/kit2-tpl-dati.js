// ═══ KW kit v2 · TEMPLATE · dati e grafici (D) — blocco 1 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═══════════════
// Stesso standard di kit2-template.js. Scene di prova in CATALOGO-ANIMAZIONI/ritmo-01 (KW_RITMO).

/* @scheda D01 · Contatore + grafico che si disegna + bagliore finale (con le fonti del numero sopra)
 * quando: risultati, crescita, views, soldi, follower: "raddoppi le visualizzazioni", "+27% di views"; il numero conta in
 *   modo continuo mentre la linea sale, all'arrivo il punto con l'anello e il bagliore; sopra, facoltative, le cose che
 *   fanno il numero (i tuoi reel coi loro badge views)
 * frase: «Stesso identico video ma raddoppi le visualizzazioni, gratis.» (03/10, 31,2–35,2 s)
 * durata: 3–5 s (consigliata 4)
 * scena: t0 (taglio o arrivo), t1, X, Y (centro), parole: { uguale (il segno «=» fra le fonti si accende, es. «identico»),
 *   conta (parte il conteggio, es. «raddoppi»; default il primo fotogramma come il reel 9), arriva (fine del conteggio, es.
 *   fine di «visualizzazioni»), finale (accento finale: il badge, es. «gratis»), titolo ([…]) }
 * opzioni: etichetta ("Visualizzazioni totali"), icona ("eye"), da, a, fmt, fonti ([{ media, badge, tag: "PROVA" | "NORMALE" }]
 *   0–2 reel sopra la card), badge (testo del badge finale, "×2"), titolo, ingresso ("arrivo" default, di lato come la card
 *   del reel 9 | "zoom" | "nessuno" = la camera la muove la composizione, es. la frusta R8), fermo (R7), fermoDa
 * restituisce: rect, pose, ancore { card, numero }, elementi { card, fonti, badge, L }, tempi { taglio, conta, arriva, finale }
 * suoni: whoosh .16 all'arrivo · tick .05 su «uguale» · rise .06 sul conteggio · ding .12 all'arrivo del numero · pop .12 sul badge
 * regole: R2 card, fonti e badge views già in scena all'arrivo · misurato su Kallaway (reel 9 e 30): la card arriva di lato
 *   (~0,35 s) e il conteggio è continuo, ~1 s quasi lineare insieme alla linea del grafico; all'arrivo punto con l'anello e
 *   bagliore 0,25 s · R6 un conteggio solo, lineare · R3 al massimo tre accenti · R5 niente back.out
 * prima: (demo-8 6,75–9,9 s) statCard.slideIn + count; nel reel-03 le card entravano con blurIn una dopo l'altra (0,45 s)
 *   dopo il whip, il «×2» con back.out(3)
 * chiamata:
 *   TPL.D01({ t0: 55.0, t1: 59.4, X: 18450, Y: 4400, parole: { uguale: 55.73, conta: 56.8, arriva: 58.3, finale: 58.5,
 *     titolo: [55.13, 55.73, 56.13, 56.8, 57.43, 58.5] } }, {
 *     titolo: [[{ t: "Stesso video, " }, { t: "×2 views", box: true }], [{ t: "gratis", hand: true }]], da: 1240, a: 2420,
 *     fonti: [{ media: "th-mio_04", badge: "1.240", tag: "NORMALE" }, { media: "th-mio_04", badge: "1.180", tag: "PROVA" }] });
 */
TPL.D01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const fonti = o.fonti || [];
  const tw = 200, th = Math.round((tw * 16) / 9), gap = 150;
  const cw = o.cw || 860, chh = o.ch || 400;
  const topF = Y - (fonti.length ? (th + 90 + 40 + chh) / 2 : chh / 2);
  const yCard = fonti.length ? topF + th + 90 + 40 : topF;
  // le fonti: i tuoi reel coi badge views e l'etichetta (prova / normale), il segno «=» in mezzo
  const fn = fonti.map((q, i) => {
    const cx = X + (i - (fonti.length - 1) / 2) * (tw + gap);
    const c = layered(el(L, { position: "absolute", left: cx - tw / 2, top: topF, width: tw, height: th, borderRadius: 18, overflow: "hidden", background: "#111", border: "2.5px solid rgba(255,255,255,.3)", boxShadow: "0 22px 50px rgba(0,0,0,.6)", zIndex: 12 }));
    mediaTile(c, 0, 0, tw, th, q.media, 1);
    let b = null;
    if (q.badge) { b = viewBadge(L, cx, topF + th + 4, q.badge, { fs: 30, dark: q.tag !== "PROVA", z: 20 }); gsap.set(b, { opacity: 1, scale: 1 }); }
    let tg = null;
    if (q.tag) tg = el(L, { position: "absolute", left: cx - 80, top: topF - 52, width: 160, height: 42, borderRadius: 21, background: q.tag === "PROVA" ? limeFill(1) : "linear-gradient(180deg,#f4f4f2,#d9d9d4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FS, fontWeight: 800, fontSize: 20, color: K.ink, zIndex: 20 }, svg(q.tag === "PROVA" ? "flask-conical" : "send", 20, K.ink, 2.4) + q.tag);
    return { c, b, tg, cx };
  });
  let uguale = null;
  if (fonti.length === 2) uguale = el(L, { position: "absolute", left: X - 50, top: topF + th / 2 - 50, width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 96, color: "rgba(255,255,255,.35)", zIndex: 13 }, "=");
  // la card coi numeri e il grafico (statCard del kit): il numero parte dal valore di prima
  const fmt = o.fmt || ((v) => itNum(v));
  const card = statCard(L, X - cw / 2, yCard, { label: o.etichetta || "Visualizzazioni totali", icon: o.icona || "eye", w: cw, h: chh, fs: 140, start: fmt(o.da || 0), points: o.punti || [[0, 0], [0.2, 0.1], [0.4, 0.22], [0.55, 0.3], [0.7, 0.6], [0.85, 0.82], [1, 1]], z: 14 });
  // il badge finale (×2)
  const badge = el(L, { position: "absolute", left: X + cw / 2 - 250, top: yCard + 40, width: 190, height: 100, borderRadius: 24, background: limeFill(1), boxShadow: GLOW_A(0.9), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 70, color: K.ink, zIndex: 20 }, o.badge || "×2");
  gsap.set(badge, { opacity: 0 });
  // 1) prima del taglio: tutto in scena (statico) — niente da montare
  // 2) accento: il segno «=» si accende (stesso identico video)
  const tu = P.uguale == null ? t0 + 0.7 : P.uguale;
  if (uguale) { tl.to(uguale, { color: K.lime, textShadow: GLOW_LT, duration: 0.2 }, tu); fn.forEach((f) => tl.to(f.c, { borderColor: "rgba(207,251,80,.9)", duration: 0.2 }, tu)); }
  // 3) il conteggio: uno, lineare, con la linea del grafico; all'arrivo il punto con l'anello e il bagliore (statCard)
  const tc = P.conta == null ? t0 + 0.05 : P.conta;
  const ta = P.arriva == null ? tc + 1.0 : P.arriva;
  card.count(tc, o.da || 0, o.a || 100, Math.max(0.5, ta - tc), fmt, "none");
  // 4) accento finale: il badge
  const tf = P.finale == null ? ta + 0.1 : P.finale;
  popK(badge, tf, { da: 0.8, dur: 0.18 });
  // 5) la camera: arrivo di lato (reel 9) o la composizione (frusta R8); poi ferma
  const rect = [X - cw / 2 - 30, (fonti.length ? topF - 70 : yCard) - 20, X + cw / 2 + 30, yCard + chh + 30];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", dx: 300, dy: 0, dur: 0.5, top: 380 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { card: [X, yCard + chh / 2], numero: [X - cw / 2 + 120, yCard + 120] },
    elementi: { card, fonti: fn, badge, titolo: T, L },
    tempi: { taglio: t0, conta: tc, arriva: ta, finale: tf },
  };
};

// ═══ blocco 2 del rifacimento (ritmo-02) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda D06 · Barra di avanzamento / timeline del video (i capitoli che si accendono mentre il video scorre)
 * quando: durata, momenti del video, progressi, il riassunto dei passi ("ecco come pianifici 30 giorni in meno di 30
 *   secondi"): il tuo reel nel lettore, sotto la timeline a segmenti (un segmento per passo) che si riempie lineare col
 *   tempo che corre; accanto i capitoli, che si accendono quando la testina li supera
 * frase: «Ecco come pianifici 30 giorni di contenuti in meno di 30 secondi.» (15/10, 35,4–39,4 s)
 * durata: 3–5 s (consigliata 4)
 * scena: t0 (taglio: la testina parte), t1, X, Y (centro), parole: { fine (la barra è piena: es. «meno»), tempo (accento sul
 *   tempo: es. «secondi»), titolo ([…]) }
 * opzioni: titolo, media (id del tuo reel nel lettore), capitoli ([{ t: "Volume", icona: "layers" }, …] 3–6), durata ("0:30"
 *   il totale scritto), fino (secondi a cui arriva il contatore, 28), ingresso ("arrivo" default | "zoom" | "nessuno" = la
 *   camera la muove la composizione, es. tplPan), fermoDa, fermo (R7)
 * restituisce: rect, pose, ancore { lettore, barra(f) }, elementi { lettore, segmenti, capitoli, contatore, L }, tempi {
 *   taglio, fine, tempo }
 * suoni: whoosh .14 al taglio · tick .04 per capitolo · ding .1 su «tempo»
 * regole: R2 lettore, timeline vuota e capitoli spenti già in scena al taglio · R6 la testina corre lineare dal primo
 *   fotogramma e il contatore conta lineare (reel 24: il tempo «12:20 / 22:20» corre e i segmenti si colorano in ordine; reel
 *   115: la barra a segmenti colorati sotto la striscia di clip) · ogni capitolo si accende quando la testina passa il suo
 *   segmento (lime = fatto) · R3 un accento sul tempo · R7 sfondo fermo
 * prima: (demo-2 45,4 s) progressBar().fill con una barra sola sotto un oggetto, dopo la costruzione
 * chiamata:
 *   TPL.D06({ t0: 51.2, t1: 55.6, X: 32850, Y: 900, parole: { fine: 53.9, tempo: 54.5, titolo: [51.37, 51.83, 52.0, 52.57] } }, {
 *     titolo: [[{ t: "Ecco come " }, { t: "pianifici", box: true }]], media: "d1",
 *     capitoli: [{ t: "Volume", icona: "layers" }, { t: "Suddivisione", icona: "chart-pie" }, { t: "Filoni", icona: "git-branch" },
 *       { t: "Script", icona: "file-text" }, { t: "Calendario", icona: "calendar-days" }] });
 */
TPL.D06 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const C = o.capitoli || [];
  const n = C.length, pw = o.pw || 420, ph = Math.round((pw * 16) / 9), gapC = 40, cw = o.cw || 470, rh = Math.min(140, (ph - (n - 1) * 14) / n);
  const W = pw + gapC + cw, barH = 26, barGap = 44, cntH = 70;
  const H = ph + barGap + barH + 20 + cntH;
  const x0 = X - W / 2, y0 = Y - H / 2;
  // il lettore: il tuo reel vero
  const pl = layered(el(L, { position: "absolute", left: x0, top: y0, width: pw, height: ph, borderRadius: 30, overflow: "hidden", border: "2.5px solid rgba(255,255,255,.28)", boxShadow: "0 30px 70px rgba(0,0,0,.6)", background: "#111", zIndex: 12 }));
  if (o.media) mediaTile(pl, 0, 0, pw, ph, o.media, 1);
  // i capitoli a destra (spenti) e la timeline a segmenti sotto (vuota)
  const caps = C.map((c, i) => {
    const y = y0 + (ph - (n * rh + (n - 1) * 14)) / 2 + i * (rh + 14);
    const r = layered(el(L, { position: "absolute", left: x0 + pw + gapC, top: y, width: cw, height: rh, borderRadius: 24, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: "linear-gradient(180deg, rgba(52,52,52,.95), rgba(28,28,28,.97))", border: "2px solid rgba(255,255,255,.16)", fontFamily: FS, fontWeight: 800, fontSize: 40, color: "#8a8a8a", whiteSpace: "nowrap", zIndex: 12 },
      `<span style="font-family:${FD};font-size:34px;opacity:.7">${i + 1}</span>` + (c.icona ? svg(c.icona, 42, "#8a8a8a", 2.2) : "") + `<span>${c.t}</span>`));
    return r;
  });
  const yB = y0 + ph + barGap, segW = (W - (n - 1) * 10) / n;
  const segs = C.map((c, i) => {
    const s = layered(el(L, { position: "absolute", left: x0 + i * (segW + 10), top: yB, width: segW, height: barH, borderRadius: barH / 2, background: "rgba(255,255,255,.14)", overflow: "hidden", zIndex: 12 }));
    const f = el(s, { position: "absolute", left: 0, top: 0, width: segW, height: barH, background: limeFill(1), boxShadow: GLOW_A(0.6), transformOrigin: "0 50%" });
    gsap.set(f, { scaleX: 0 });
    return { s, f };
  });
  const tot = o.durata || "0:30", fino = o.fino == null ? 28 : o.fino;
  const cnt = layered(el(L, { position: "absolute", left: X + W / 2 - 330, top: yB + barH + 20, width: 330, height: cntH, display: "flex", alignItems: "center", justifyContent: "flex-end", fontFamily: FD, fontWeight: 700, fontSize: 56, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap", zIndex: 12 }, `<span>0:00</span>&nbsp;<span style="opacity:.5">/ ${tot}</span>`));
  const cntN = cnt.querySelector("span");
  const tutto = [pl, ...caps, ...segs.map((s) => s.s), cnt];
  gsap.set(tutto, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(tutto, { opacity: 1, duration: 0.2 }, t), () => gsap.set(tutto, { opacity: 1 }));
  // il movimento principale: la testina corre lineare dal primo fotogramma, segmento dopo segmento (R6); il contatore insieme
  const ts = t0 + 0.03, tf = P.fine == null ? t0 + 2.4 : P.fine, dF = Math.max(1.2, tf - ts), dS = dF / n;
  segs.forEach((s, i) => tl.to(s.f, { scaleX: 1, duration: dS, ease: "none" }, ts + i * dS));
  caps.forEach((r, i) => {
    const t = ts + (i + 1) * dS;
    tl.to(r, { color: K.white, borderColor: K.lime, boxShadow: GLOW_A(0.45), duration: 0.15 }, t);
    const ic = r.querySelector("svg");
    if (ic) tl.to(ic, { attr: { stroke: K.lime }, duration: 0.15 }, t);
  });
  const V = { v: 0 };
  tl.fromTo(V, { v: 0 }, { v: fino, duration: dF, ease: "none", immediateRender: false, onUpdate: () => (cntN.textContent = `0:${String(Math.floor(V.v)).padStart(2, "0")}`) }, ts);
  // accento sul tempo
  const tt = P.tempo == null ? tf + 0.4 : P.tempo;
  glowFlash(cnt, tt);
  tl.to(cntN, { color: K.lime, textShadow: GLOW_LT, duration: 0.2 }, tt);
  // la camera
  const rect = [x0 - 10, y0 - 10, x0 + W + 10, yB + barH + 20 + cntH + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { lettore: [x0 + pw / 2, y0 + ph / 2], barra: (f) => [x0 + f * W, yB + barH / 2] },
    elementi: { lettore: pl, segmenti: segs, capitoli: caps, contatore: cnt, titolo: T, L },
    tempi: { taglio: t0, fine: ts + dF, tempo: tt },
  };
};

// ═══ blocco 3 del rifacimento (ritmo-03) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda D02 · Badge views che poppano in sequenza (la prova che quei formati funzionano)
 * quando: prova sociale su esempi ("cerca argomenti e formati che stanno funzionando", "questi sono i reel che vanno"): reel
 *   veri in fila col nome del formato sopra; sulla parola i badge con le visualizzazioni vere poppano uno dopo l'altro sotto
 *   ogni reel
 * frase: «Cerca argomenti e formati che stanno funzionando in questo momento sui social.» (15/10, 18,7–22,2 s)
 * durata: 3–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio), t1, X, Y (centro della fila), parole: { formati (i nomi dei formati si accendono, es. «formati»), badge
 *   (i badge poppano, es. «funzionando»), adesso (l'etichetta del periodo si accende, es. «momento»), titolo ([…]) }
 * opzioni: formati ([{ media (id video), nome, views ("9,1M": le visualizzazioni VERE del video) }] 3–5), periodo
 *   ("Questa settimana"; false = niente), cw (larghezza delle card, 252), passo (0,08 s fra i badge), ingresso ("arrivo"
 *   default | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { card(i), badge(i) }, elementi { card, badge, nomi, periodo, L }, tempi { taglio, formati,
 *   badge, adesso }
 * suoni: whoosh .14 al taglio · tick .04 per ogni badge · ding .06 su «adesso»
 * regole: D02 misurato (reel 1 a 0,83 s, pop.py: il badge 0,66 → 1 in 0,13 s senza rimbalzo, 0,07–0,13 s fra un badge e
 *   l'altro, prima la riga in alto poi quella sotto) → popK da 0,66 in 0,13 s, passo 0,08 s · R2 le card e i nomi già in scena
 *   al taglio · R3 tre accenti piccoli sulle parole (nomi, badge, periodo) · R5 niente back.out (il catalogo diceva "lieve
 *   rimbalzo": misurato 0%) · R7 sfondo fermo · numeri veri (visualizzazioni del video sorgente), niente numeri inventati
 * prima: (demo-8 17,85 s · demo 12,3 s) popSeq con back.out(2,4), 0,32 s per badge
 * chiamata:
 *   TPL.D02({ t0: 41.55, t1: 45.7, X: 22600, Y: 900, parole: { formati: 42.5, badge: 43.27, adesso: 44.37,
 *     titolo: [41.7, 42.0, 42.5, 43.27] } }, {
 *     titolo: [[{ t: "Formati che " }, { t: "funzionano", box: true }]],
 *     formati: [{ media: "f1", nome: "Classifica", views: "9,1M" }, …], periodo: "Questa settimana" });
 *   // ritmo-03: arrivo col pan dalla scena prima (vicina, ~1 schermata a destra): ingresso: "nessuno", fermoDa: t0 + 0.7, poi
 *   // tplTenuta(tplPan(t0 - 0.05, S.D02.pose, { dur: 0.75 }), t1, 0.008)
 */
TPL.D02 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const F = o.formati || [];
  const n = F.length, cw = o.cw || 252, ch = Math.round((cw * 16) / 9), g = o.gap || 26, RW = n * cw + (n - 1) * g;
  const x0 = X - RW / 2, y0 = Y - ch / 2;
  const fsN = o.fsNome || 36;
  const card = [], badge = [], nomi = [];
  F.forEach((f, i) => {
    const x = x0 + i * (cw + g);
    const c = layered(el(L, { position: "absolute", left: x, top: y0, width: cw, height: ch, borderRadius: 20, overflow: "hidden", background: "#111", border: "2px solid rgba(255,255,255,.24)", boxShadow: "0 28px 64px rgba(0,0,0,.6)", zIndex: 12 }));
    mediaTile(c, 0, 0, cw, ch, f.media, 1);
    card.push(c);
    // il nome del formato sopra la card (spento finché non lo dici)
    const nm = layered(el(L, { position: "absolute", left: x - 30, top: y0 - fsN * 1.9, width: cw + 60, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: fsN, color: "rgba(255,255,255,.4)", whiteSpace: "nowrap", zIndex: 13 }, f.nome || ""));
    nomi.push(nm);
    // il badge views sotto la card, sul bordo (le visualizzazioni vere)
    badge.push(viewBadge(L, x + cw / 2, y0 + ch + 6, f.views || "", { fs: 36, z: 16 }));
  });
  // il periodo ("in questo momento"), sopra la fila
  let periodo = null;
  if (o.periodo !== false) {
    periodo = layered(el(L, { position: "absolute", left: X - 260, top: y0 - fsN * 1.9 - 112, width: 520, height: 76, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 14 }));
    el(periodo, { display: "flex", alignItems: "center", gap: 12, height: 76, padding: "0 30px", borderRadius: 38, background: "linear-gradient(180deg,#3b3b3b,#262626)", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 16px 36px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: 42, color: "rgba(255,255,255,.75)", whiteSpace: "nowrap" }, svg("trending-up", 46, "rgba(255,255,255,.75)", 2.4) + `<span>${o.periodo || "Questa settimana"}</span>`);
  }
  // 1) prima del taglio: card, nomi e periodo già in scena (R2)
  const tutto = [...card, ...nomi].concat(periodo ? [periodo] : []);
  gsap.set(tutto, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(tutto, { opacity: 1, duration: 0.2 }, t), () => gsap.set(tutto, { opacity: 1 }));
  // 2) accento 1: i nomi dei formati si accendono
  const tf = P.formati == null ? t0 + 0.8 : P.formati;
  nomi.forEach((nm, i) => tl.to(nm, { color: K.white, textShadow: GLOW_T, duration: 0.15 }, tf + i * 0.06));
  // 3) accento 2: i badge poppano in sequenza (0,66 → 1 in 0,13 s, passo 0,08 s)
  const tb = P.badge == null ? tf + 0.8 : P.badge, ps = o.passo || 0.08;
  badge.forEach((b, i) => popK(b, tb + i * ps, { da: 0.66, dur: 0.13 }));
  // 4) accento 3: il periodo si accende
  const tn = P.adesso == null ? tb + 1.0 : P.adesso;
  if (periodo) {
    const pl = periodo.firstChild;
    tl.to(pl, { background: limeFill(1), borderColor: K.lime, color: K.ink, boxShadow: `${GLOW_A(0.7)}, 0 16px 36px rgba(0,0,0,.5)`, duration: 0.2 }, tn);
    const ic = pl.querySelector("svg");
    if (ic) tl.to(ic, { attr: { stroke: K.ink }, duration: 0.2 }, tn);
  }
  // 5) la camera: arrivo dal basso che frena, poi tiene
  const rect = [x0 - 20, (periodo ? y0 - fsN * 1.9 - 112 : y0 - fsN * 1.9) - 16, x0 + RW + 20, y0 + ch + 40];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { card: (i) => [x0 + i * (cw + g) + cw / 2, Y], badge: (i) => [x0 + i * (cw + g) + cw / 2, y0 + ch + 6] },
    elementi: { card, badge, nomi, periodo, titolo: T, L },
    tempi: { taglio: t0, formati: tf, badge: tb, adesso: tn },
  };
};
