// ═══ KW kit v2 · TEMPLATE · liste e strutture (L) — blocco 1 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═════════════
// Stesso standard di kit2-template.js. Scene di prova in CATALOGO-ANIMAZIONI/ritmo-01 (KW_RITMO).

/* @scheda L11 · Catena di passi: percorso a tappe con il tuo video che lo percorre
 * quando: procedure in N passi ("carica → salva in bozza → duplica → pubblica"), un metodo, "il mio sistema": tutte le tappe
 *   si vedono subito (quelle non ancora dette restano sfocate) e il tuo contenuto corre di tappa in tappa sulle parole
 * frase: «La prossima volta che carichi un video, prima di pubblicarlo, salvalo come bozza. Poi, duplicalo.» (16/10,
 *   6,5–12,8 s)
 * durata: 3–7 s (consigliata 4–6)
 * scena: t0 (taglio: il tracciato si disegna), t1, X, Y (centro), parole: { tappe: [quando si accende ogni tappa detta: la
 *   prima con l'arrivo del video, le altre con la corsa che finisce sulla parola] (le tappe senza tempo restano sfocate),
 *   copia (il video si sdoppia, facoltativo), titolo ([…]) }
 * opzioni: tappe ([{ t: nome, icona }], 3–6), media (copertina o video del tuo reel che corre: «th-mio_04»), copia (true: alla
 *   tappa «copia» compare la seconda copia), titolo, ingresso ("fermo" default, come il reel 124 | "arrivo" | "nessuno"),
 *   fermo (R7, default true), layout ("diagonale" default con KW_RITMO: il tracciato attraversa tutta la larghezza come il
 *   reel 124 e la scena riempie o.area, default [90, 390, 990, 1250] dello schermo | "colonna": la S verticale di prima),
 *   durTracciato (1.0: tracciato 10 → 90% in ~0,45 s con i due tratti, K r124 0,50 s)
 * restituisce: rect, pose, ancore { tappa(i), video (elemento), copia }, elementi { metro, video, copia, L },
 *   tempi { taglio, tappe }
 * suoni: whoosh .14 al taglio (il tracciato) · pop .1 quando arriva il video · tick .06 su ogni tappa · card .1 sulla copia
 * regole: R2 tappe ed etichette (sfocate) già in scena; al taglio si disegna il tracciato (reel 124: la linea entra dal
 *   bordo e attraversa tutta la larghezza e le 7 tappe, 10 → 90% in 0,50 s dal primo fotogramma, camera ferma) · R3 la
 *   camera tiene; accenti sulle parole: il video arriva sulla prima tappa, corre alla seconda e alla terza (0,7 s
 *   power2.inOut, arriva sulla parola) · R5 niente back.out · la scena riempie l'area utile (regia 13/10)
 * prima: (demo-2 30,15–32,5 s) metroPath.show + go con la pallina; la scena arrivava con arriveRect da 340 px e la checklist
 *   sopra (due oggetti in una scena). Prima stesura del blocco 1: S verticale stretta a metà larghezza (scala 0,80), sotto un
 *   grande vuoto
 * chiamata:
 *   TPL.L11({ t0: 31.45, t1: 38.0, X: 17000, Y: 900, parole: { tappe: [32.9, 35.8, 37.26], copia: 37.3,
 *     titolo: [32.9, 35.3, 36.53, 37.26] } }, {
 *     titolo: [[{ t: "Carica, " }, { t: "salva", box: true }], [{ t: "e duplica", hand: true }]], media: "th-mio_04", copia: true,
 *     tappe: [{ t: "Carica il video", icona: "upload" }, { t: "Salva in bozza", icona: "save" },
 *             { t: "Duplica", icona: "copy" }, { t: "Pubblica ×2", icona: "send" }] });
 */
TPL.L11 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const tp = o.tappe || [], n = tp.length;
  // layout «diagonale» (default con KW_RITMO, correzioni della regia al blocco 1): come il reel 124 il tracciato attraversa
  // tutta la larghezza, entra dal bordo sinistro, scende a S per le tappe e esce dal bordo destro; tutto più grande (tappe,
  // etichette, il tuo video) e la scena riempie l'area utile (x 90–990, dal titolo a y ~1250). Layout «colonna» (di prima):
  // tappe su una S verticale stretta (±dx) al centro
  const diag = o.layout === "diagonale" || (o.layout == null && KW_RITMO);
  let pts, xs, dx, passo;
  if (diag) {
    // tappe in discesa da sinistra a destra (fra una e l'altra il tracciato piega a S), fino a 6; etichette a destra, l'ultima
    // a sinistra (resta dentro lo schermo); il tuo video corre a sinistra del tracciato
    const base = [[-230, -290], [-40, -80], [10, 145], [220, 385], [300, 470], [380, 560]];
    pts = tp.map((_, i) => [X + base[i][0], Y + base[i][1]]);
    xs = X; dx = 0; passo = 0;
  } else {
    // tappe su una S verticale (9:16, il tracciato ondeggia di ±dx) con le etichette grandi a destra; il tuo video corre a
    // sinistra del tracciato, così non copre mai le etichette
    dx = o.dx || 70; passo = o.passo || 235; xs = X - 190;
    const y0 = Y - ((n - 1) * passo) / 2;
    pts = tp.map((_, i) => [xs + (i % 2 ? dx : -dx), y0 + i * passo]);
  }
  const S = svgLayer(L, 8, X - 3000, Y - 3000, 6000, 6000);
  // il tuo video che corre: una card 9:16 a sinistra di un punto lime che sta sul tracciato (è il «walker» di metroPath)
  const cw = o.cw || (diag ? 180 : 168), ch = Math.round((cw * 16) / 9), R = diag ? 50 : 46, FSZ = diag ? 50 : 46;
  const mk = (z) => {
    const w = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: z }));
    el(w, { position: "absolute", left: -13, top: -13, width: 26, height: 26, borderRadius: "50%", background: limeFill(1), boxShadow: GLOW_A(0.9) });
    const c = el(w, { position: "absolute", left: -cw - R - 26, top: -ch / 2, width: cw, height: ch, borderRadius: 18, overflow: "hidden", background: "#111", border: `3px solid ${K.lime}`, boxShadow: `${GLOW_A(0.55)}, 0 18px 40px rgba(0,0,0,.6)` });
    if (o.media) mediaTile(c, 0, 0, cw, ch, o.media, 1);
    return w;
  };
  const video = mk(40);
  gsap.set(video, { x: pts[0][0], y: pts[0][1], opacity: 0 });
  const lati = tp.map((_, i) => (diag && (i === n - 1 || i >= 3) ? "l" : "r"));
  const metro = metroPath(L, S, pts, tp.map((q) => q.t), { r: R, fs: FSZ, lw: 470, w: 9, side: lati, icons: tp.map((q) => q.icona), z: 14, walker: video });
  // 1) prima del taglio: stazioni ed etichette (sfocate: non ancora dette) già in scena
  const tutte = metro.st.map((s) => [s.n, s.lb]).flat();
  tplMonta(t0, (t) => tl.set(tutte, { opacity: 1 }, t), () => gsap.set(tutte, { opacity: 1 }));
  // 2) al taglio: il tracciato si disegna (0,85 s, reel 124). Diagonale: con un tratto che entra dal bordo sinistro e uno che
  //    esce dal bordo destro, disegnati di seguito come una linea sola (una curva power1.inOut su tutta la lunghezza)
  if (diag) {
    const p0 = pts[0], p1 = pts[1] || [p0[0] + 100, p0[1] + 100], pn = pts[n - 1], pm = pts[n - 2] || [pn[0] - 100, pn[1] - 100];
    const v0 = [p1[0] - p0[0], p1[1] - p0[1]], vn = [pn[0] - pm[0], pn[1] - pm[1]];
    const dIn = `M${X - 760} ${p0[1] - 120} C${X - 520} ${p0[1] - 120}, ${(p0[0] - v0[0] * 0.35).toFixed(1)} ${(p0[1] - v0[1] * 0.35).toFixed(1)}, ${p0[0]} ${p0[1]}`;
    const dOut = `M${pn[0]} ${pn[1]} C${(pn[0] + vn[0] * 0.25).toFixed(1)} ${(pn[1] + vn[1] * 0.25).toFixed(1)}, ${pn[0] + 230} ${pn[1] + 70}, ${pn[0] + 560} ${pn[1] + 65}`;
    const base = S.getElementsByTagName("path")[0]; // il tracciato di metroPath (il primo path del livello)
    const tratto = (d) => {
      const p = pathEl(S, d, { fill: "none", stroke: "rgba(255,255,255,.7)", "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round" });
      p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.35))";
      const l = p.getTotalLength();
      p.setAttribute("stroke-dasharray", `${l.toFixed(1)} ${l.toFixed(1)}`);
      p.setAttribute("stroke-dashoffset", l.toFixed(1));
      return [p, l];
    };
    const [pIn, lIn] = tratto(dIn), [pOut, lOut] = tratto(dOut), lM = metro.L, U = { u: 0 };
    const metti = (p, l, a) => p.setAttribute("stroke-dashoffset", (l - Math.max(0, Math.min(l, a))).toFixed(1));
    tl.fromTo(U, { u: 0 }, { u: lIn + lM + lOut, duration: o.durTracciato || 1.0, ease: "power1.inOut", immediateRender: false,
      onUpdate: () => { metti(pIn, lIn, U.u); metti(base, lM, U.u - lIn); metti(pOut, lOut, U.u - lIn - lM); } }, t0 + 0.03);
  } else metro.show(t0 + 0.03, 0.85, true);
  // 3) accenti: il video arriva sulla prima tappa, poi corre di tappa in tappa e arriva sulla parola
  const T = P.tappe || [t0 + 1.0, t0 + 2.2, t0 + 3.4];
  if (T[0] != null) {
    tl.fromTo(video, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out", immediateRender: false }, T[0]);
    metro.go(0, T[0], 0.05);
  }
  let cur = 0;
  for (let i = 1; i < T.length && i < n; i++) {
    if (T[i] == null) continue;
    const du = Math.min(0.7, Math.max(0.35, T[i] - T[i - 1] - 0.2));
    metro.go(i, T[i] - du, du); // il video corre (power2.inOut), dietro di lui il tratto fatto si accende, la tappa si accende all'arrivo
    cur = i;
  }
  // la copia (facoltativa): alla tappa detta il video si sdoppia, la copia esce di lato e resta dietro (due card)
  let copia = null;
  if (o.copia && P.copia != null) {
    const k = Math.min(n - 1, cur), [cx, cy] = pts[k];
    copia = mk(39);
    gsap.set(copia, { x: cx, y: cy, opacity: 0 });
    tl.set(copia, { opacity: 1 }, P.copia);
    tl.to(copia, { x: cx - 34, y: cy - 30, duration: 0.3, ease: "power2.out" }, P.copia);
  }
  // 4) la camera: ferma come nel reel 124 (il movimento è il tracciato), poi tiene
  let rect, posa = null;
  if (diag) {
    // il rettangolo delle cose vere (tappe, etichette stimate, il video dove arriva) riempie l'area utile o.area (schermo,
    // default x 90–990, y 390–1250): la scala è la più grande che ci sta
    const est = (t) => FSZ * 0.56 * t.length + FSZ * 1.2;
    let a0 = 1e9, b0 = 1e9, a1 = -1e9, b1 = -1e9;
    const add = (a, b, c, d) => { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, c); b1 = Math.max(b1, d); };
    pts.forEach(([x, y], i) => {
      add(x - R, y - R, x + R, y + R);
      const w = est(tp[i].t || "");
      if (lati[i] === "r") add(x + R + 16, y - FSZ * 0.95, x + R + 16 + w, y + FSZ * 0.95);
      else add(x - R - 16 - w, y - FSZ * 0.95, x - R - 16, y + FSZ * 0.95);
    });
    T.forEach((tt, i) => { if (tt != null && i < n) add(pts[i][0] - R - 26 - cw, pts[i][1] - ch / 2, pts[i][0] - R - 26, pts[i][1] + ch / 2); });
    rect = [a0 - 10, b0 - 10, a1 + 10, b1 + 10];
    const A = o.area || [90, 390, 990, 1250];
    const s = Math.min((A[2] - A[0]) / (rect[2] - rect[0]), (A[3] - A[1]) / (rect[3] - rect[1]));
    posa = { fx: (rect[0] + rect[2]) / 2 - ((A[0] + A[2]) / 2 - ANCHOR.x) / s, fy: (rect[1] + rect[3]) / 2 - ((A[1] + A[3]) / 2 - ANCHOR.y) / s, s };
  } else {
    const r0 = metro.rect;
    rect = [Math.min(r0[0], xs - dx - cw - R - 60), Math.min(r0[1], pts[0][1] - ch / 2 - 40), r0[2], Math.max(r0[3], pts[n - 1][1] + ch / 2 + 20)];
  }
  let pose = posa || fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "fermo", top: 380, posa });
  tplFermo0(scena, o);
  const Ti = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { tappa: (i) => pts[i], videoXY: (i) => [pts[i][0] - cw / 2 - R - 26, pts[i][1]], video, copia },
    elementi: { metro, video, copia, titolo: Ti, L },
    tempi: { taglio: t0, tappe: T },
  };
};

// ═══ blocco 2 del rifacimento (ritmo-02) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda L09 · Albero che cresce (la nicchia e i suoi filoni, coi reel veri sotto ogni filone)
 * quando: categorie e sotto-categorie (nicchia → filoni, argomento → formati), cause → effetti: la radice in alto, i rami
 *   che si disegnano verso i figli, sotto ogni figlio i reel veri che ne sono un esempio
 * frase: «Scegli i tuoi filoni tematici dentro la tua nicchia.» (15/10, 16,1–18,3 s)
 * durata: 2,5–5 s (consigliata 3–4)
 * scena: t0 (taglio: i rami crescono), t1, X, Y (centro), parole: { esempi (i reel compaiono sotto i rami: es. «filoni»),
 *   radice (la radice si accende: es. «nicchia»), titolo ([…]) }
 * opzioni: titolo, radice (testo, "La tua nicchia"), rami ([{ t: "Profilo", media: [id] }], 3–4; uno o due reel per ramo),
 *   tw (larghezza dei reel, di default tutta la colonna del ramo: 225 con un reel), ingresso ("fermo" default: il movimento è la crescita | "arrivo" | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { radice, ramo(i), reel(i, j) }, elementi { albero, reel, L }, tempi { taglio, cresciuto,
 *   esempi, radice }
 * suoni: whoosh .14 al taglio · tick .05 sui rami · pop .08 sugli esempi · ding .08 sulla radice
 * regole: R2 la radice e i filoni (sfocati, segnaposto L01) ci sono al taglio; il movimento principale è la crescita dal
 *   primo fotogramma: i rami si disegnano (0,35 s, sfalsati di 0,06 s) e ogni filone va a fuoco quando la sua linea lo
 *   raggiunge (reel 3: linee 0,3–0,5 s, nodi 0,25 s sfalsati; reel 23: i figli coi reel veri sotto) · R3 accenti: i reel sotto i rami (popK, sfalsati), la radice che si accende · R5 niente back.out né
 *   scala sui nodi · R7 sfondo fermo
 * prima: (demo-8 29,2–36,2 s · demo 18,45 s) flowTree a tre righe che si costruiva riga per riga con la camera che scendeva
 *   dietro alla crescita (tre movimenti di camera in 7 s)
 * chiamata:
 *   TPL.L09({ t0: 36.65, t1: 39.5, X: 25600, Y: 900, parole: { esempi: 37.23, radice: 38.57,
 *     titolo: [36.77, 37.15, 37.2, 37.23] } }, {
 *     titolo: [[{ t: "Scegli i tuoi " }, { t: "filoni", box: true }]], radice: "La tua nicchia",
 *     rami: [{ t: "Profilo", media: ["f1"] }, { t: "Algoritmo", media: ["f3"] }, { t: "Idee", media: ["f5"] },
 *       { t: "Psicologia", media: ["f7"] }] });
 */
TPL.L09 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const R = o.rami || [];
  // proporzioni (blocco 2): un reel grande per ramo riempie l'area utile (con 2 reel piccoli l'albero era alto la metà)
  const n = R.length, cw = o.cw || 255, W = n * cw, nm = Math.max(1, ...R.map((r) => (r.media || []).length));
  const tw = o.tw || Math.floor((cw - 30 - (nm - 1) * 12) / nm), th = Math.round((tw * 16) / 9), nh = 84, dy = o.dy || 190;
  const H = nh + dy + nh + 40 + th;
  const y0 = Y - H / 2;
  const S = svgLayer(L, 12, X - 2000, Y - 2000, 4000, 4000);
  const FT = flowTree(L, S, X, y0, [{ nodi: [{ t: o.radice || "La tua nicchia" }], w: 500 }, { nodi: R.map((r) => ({ t: r.t, p: 0 })), w: W }], { fs: 38, h: nh, dy, z: 13 });
  // la radice c'è già al taglio, i rami sono già lì sfocati (L01: segnaposto): al taglio il fotogramma è pieno (R2)
  const rad = FT.L[0].nodes[0].b, figli = FT.L[1].nodes.map((nd) => nd.b);
  tplMonta(t0, (t) => { tl.to(rad, { opacity: 1, scale: 1, duration: 0.2 }, t); tl.to(figli, { opacity: 0.38, scale: 1, filter: "blur(6px)", duration: 0.2 }, t); },
    () => { gsap.set(rad, { opacity: 1, scale: 1 }); gsap.set(figli, { opacity: 0.38, scale: 1, filter: "blur(6px)" }); });
  // i reel sotto ogni ramo (reel veri in movimento), nascosti fino a «esempi»
  const yR = y0 + nh + dy + nh + 40;
  const reel = R.map((r, i) => (r.media || []).map((id, j, A) => {
    const [x] = FT.nodeXY(1, i), x0 = x - (A.length * tw + (A.length - 1) * 12) / 2 + j * (tw + 12);
    const c = layered(el(L, { position: "absolute", left: x0, top: yR, width: tw, height: th, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,255,255,.22)", boxShadow: "0 18px 40px rgba(0,0,0,.55)", background: "#111", zIndex: 13 }));
    mediaTile(c, 0, 0, tw, th, id, 1);
    gsap.set(c, { opacity: 0 });
    return c;
  }));
  // il movimento principale: i rami si disegnano dal primo fotogramma (linee 0,35 s, sfalsate di 0,06 s) e ogni filone va a
  // fuoco quando la sua linea lo raggiunge (0,25 s, power2.out: niente scala né rimbalzo)
  FT.L[1].nodes.forEach((nd, i) => {
    const tt = t0 + 0.03 + i * 0.06;
    if (nd.cn) nd.cn.draw(tt, 0.35, "power2.out");
    tl.to(nd.b, { opacity: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out" }, tt + 0.245);
    tl.set(nd.b, { filter: "none" }, tt + 0.5);
  });
  const tc = t0 + 0.03 + (n - 1) * 0.06 + 0.35 * 0.7 + 0.25;
  // accento 1: i reel d'esempio compaiono sotto i rami (popK sfalsati)
  const te = P.esempi == null ? tc + 0.3 : P.esempi;
  reel.forEach((rr, i) => rr.forEach((c, j) => popK(c, te + (i * 2 + j) * 0.05, { da: 0.85, dur: 0.15 })));
  // accento 2: la radice (la tua nicchia) si accende
  const trd = P.radice == null ? te + 1.0 : P.radice;
  glowFlash(rad, trd);
  tl.to(rad, { boxShadow: `${GLOW_A(1.2)}, 0 14px 30px rgba(0,0,0,.5)`, duration: 0.25 }, trd);
  // la camera: tiene (il movimento è la crescita)
  const rect = [X - W / 2 - 10, y0 - 10, X + W / 2 + 10, yR + th + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "fermo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { radice: FT.nodeXY(0, 0), ramo: (i) => FT.nodeXY(1, i), reel: (i, j) => { const [x] = FT.nodeXY(1, i), A = (R[i].media || []).length; return [x - (A * tw + (A - 1) * 12) / 2 + j * (tw + 12) + tw / 2, yR + th / 2]; } },
    elementi: { albero: FT, reel, titolo: T, L },
    tempi: { taglio: t0, cresciuto: tc, esempi: te, radice: trd },
  };
};

/* @scheda L12 · Documento «Script» che si costruisce (le sezioni si accendono quando le nomini)
 * quando: script, struttura di un video, copioni, "hook, spiega, mostra, insegna": il copione in vetro con le righe già
 *   stese; ogni sezione si evidenzia di lime riga per riga sulla parola che la nomina, le sezioni già dette restano bianche
 * frase: «Scrivi gli script con un metodo fisso. Io uso hook, spiega, mostra, insegna.» (15/10, 22,8–28,4 s)
 * durata: 3,5–6 s (consigliata 4,5–5,5)
 * scena: t0 (taglio), t1, X, Y (centro del documento), parole: { sezioni: [tempo per sezione], titolo ([…]) }
 * opzioni: titolo, sezioni ([{ label: "Hook", rows: 4 }, …]), doc (titolo del documento, "Script"), w (720), ingresso
 *   ("arrivo" default | "zoom" | "nessuno" = la camera la muove la composizione, es. tplZoomThrough), fermoDa, fermo (R7)
 * restituisce: rect, pose, ancore { centro, sezione(i) }, elementi { documento, L }, tempi { taglio, sezioni }
 * suoni: whoosh .14 al taglio · tick .05 per sezione
 * regole: R2 il documento con tutte le righe grigie e le etichette spente è già in scena al taglio (reel 26: il documento
 *   bianco c'è, poi la riga «Hook» si colora sulla parola) · R3 un accento per sezione detta: etichetta e quadratino, righe
 *   evidenziate in sequenza (0,3 s per riga, 0,07 s fra le righe); la sezione prima diventa bianca (fatta) · lime =
 *   quella detta, bianco = fatte, grigio = da fare (brand) · R5 niente rimbalzi · R7 sfondo fermo
 * prima: (demo-2 48 s) scriptDoc che si stendeva dopo il taglio (cascata) e cinque colori per le sezioni
 * chiamata:
 *   TPL.L12({ t0: 39.5, t1: 44.7, X: 28600, Y: 900, parole: { sezioni: [42.2, 42.8, 43.67, 44.4],
 *     titolo: [39.62, 40.17, 40.6, 40.87] } }, {
 *     titolo: [[{ t: "Un metodo " }, { t: "fisso", box: true }]],
 *     sezioni: [{ label: "Hook", rows: 3 }, { label: "Spiega", rows: 5 }, { label: "Mostra", rows: 5 }, { label: "Insegna", rows: 4 }] });
 */
TPL.L12 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const SZ = o.sezioni || [{ label: "Hook", rows: 3 }, { label: "Spiega", rows: 5 }, { label: "Mostra", rows: 5 }, { label: "Insegna", rows: 4 }];
  const w = o.w || 720;
  const hh = 120 + SZ.reduce((a, s) => a + Math.round(36 * 1.35) + s.rows * 32 + 18, 0) + 24; // altezza del documento
  const D = scriptDoc(L, X, Y, SZ.map((s) => ({ label: s.label, rows: s.rows, color: K.lime })), { fitto: false, w, h: hh, rh: 32, title: o.doc || "Script", fsTitolo: 56, fsLab: 36, top: 120, z: 12 });
  const rows = D.secs.flatMap((s) => s.rows.map((r) => r.base));
  // 1) prima del taglio: il documento con le righe grigie già stese (R2)
  gsap.set(D.c, { opacity: 0 });
  tplMonta(t0, (t) => { tl.to(D.c, { opacity: 1, duration: 0.2 }, t); tl.to(rows, { scaleX: 1, duration: 0.2 }, t); },
    () => { gsap.set(D.c, { opacity: 1 }); gsap.set(rows, { scaleX: 1 }); });
  // le etichette ci sono già, spente (grigie): si accendono quando la sezione è detta
  D.secs.forEach((s) => { gsap.set([s.mark, s.lab], { opacity: 0.35 }); gsap.set(s.mark, { background: "#8a8a8a", boxShadow: "none" }); gsap.set(s.lab, { color: "#8a8a8a" }); });
  // 2) gli accenti: ogni sezione si evidenzia sulla sua parola; quella prima diventa bianca (fatta)
  const TS = P.sezioni || SZ.map((_, i) => t0 + 0.8 + i * 0.8);
  D.secs.forEach((s, i) => {
    const t = TS[i];
    tl.to(s.mark, { opacity: 1, background: K.lime, boxShadow: `0 0 10px ${K.lime}`, duration: 0.2 }, t);
    tl.to(s.lab, { opacity: 1, color: K.lime, textShadow: GLOW_LT, duration: 0.2 }, t);
    s.rows.forEach((r, k) => tl.to(r.fillR, { scaleX: 1, duration: 0.3, ease: "power1.inOut" }, t + 0.05 + k * 0.07));
    if (i > 0) {
      const p = D.secs[i - 1];
      tl.to(p.rows.map((r) => r.fillR), { background: "#f2f2f2", boxShadow: "0 0 6px rgba(255,255,255,.35)", duration: 0.25 }, t);
      tl.to([p.mark], { background: "#f2f2f2", boxShadow: "none", duration: 0.25 }, t);
      tl.to([p.lab], { color: "#f2f2f2", textShadow: GLOW_T, duration: 0.25 }, t);
    }
  });
  // 3) la camera
  const h = hh;
  const rect = [X - w / 2 - 10, Y - h / 2 - 10, X + w / 2 + 10, Y + h / 2 + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], sezione: (i) => [X, Y - h / 2 + parseFloat(D.secs[i].lab.style.top) + 20] },
    elementi: { documento: D, titolo: T, L },
    tempi: { taglio: t0, sezioni: TS },
  };
};

// ═══ blocco 3 del rifacimento (ritmo-03) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda L01 · Lista con voci-segnaposto sfocate (l'elenco annunciato: ci sono tutte, non si leggono ancora)
 * quando: un elenco numerato annunciato prima di spiegarlo ("le emozioni che conta capire sono tre", "succedono due cose",
 *   "quattro elementi"): le barre arrivano una dopo l'altra già al loro posto, il testo è sfocato finché non viene detto
 *   (si risolve con L02, sulla stessa lista)
 * frase: «Le emozioni che conta capire sono tre.» (09/10, 11,7–14,0 s)
 * durata: 2,5–5 s (consigliata 3–4)
 * scena: t0 (taglio), t1, X, Y (centro della lista), parole: { numeri (i numeri si accendono uno dopo l'altro, es. «tre»),
 *   titolo ([…]) }
 * opzioni: voci (testi delle barre, 2–6: si leggono solo sfocati), w (larghezza delle barre, 820), passi ([0.08, 0.23]: quando
 *   arrivano le barre dopo la prima), durCentra (1,3 s: l'ultima ri-centratura, power2.out), h (112), gap (46), fs (42),
 *   titolo, ingresso ("fermo" default: la camera ferma, il movimento è della lista | "arrivo" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { voce(i) }, elementi { lista (listK: la passa a L02), L }, tempi { taglio, numeri }
 * suoni: whoosh .14 al taglio · tick .04 per ogni barra · pop .06 su «numeri»
 * regole: L01 misurato (reel 5 a 8,92 s, fascia.py; reel 7 a 5,0 s): al taglio c'è la prima barra, la seconda arriva a +0,08 s
 *   e la terza a +0,23 s (sfocate, dal basso), la pila si ri-centra e continua a salire frenando (−144 px in ~1,5 s): è il
 *   movimento principale (R2: niente camera che vola), larga ~0,7–0,8 dello schermo;
 *   barre scure con l'accento lime a sinistra (~7 px), numero bold, testo sfocato ~7 px · R3 un accento: i numeri si accendono
 *   sulla parola che dà il conto · R5 niente rimbalzi · R7 sfondo fermo
 * prima: (demo-8 0–4 s · demo 5–9 s) listK già piena dal fotogramma 0 oppure costruita voce per voce a 0,6 s l'una
 * chiamata:
 *   // arrivo con il pan dalla scena prima (ritmo-03): la lista a ~1 schermata di distanza, le barre arrivano mentre frena
 *   S.L01 = TPL.L01({ t0: 11.0, t1: 14.0, X: 3600 + 1000, Y: 860, parole: { numeri: 13.28,
 *     titolo: [11.15, 11.68, 12.18, 12.48, 13.28] } }, {
 *     titolo: [[{ t: "Le emozioni sono " }, { t: "tre", box: true }]], voci: ["Il desiderio", "La paura", "Cosa crede di sé"],
 *     passi: [0.25, 0.4], ingresso: "nessuno", fermoDa: 11.7 });
 *   tplTenuta(tplPan(10.95, S.L01.pose, { dur: 0.75 }), 14.0, 0.008);
 *   // da sola, dopo un taglio: senza ingresso (la camera ferma, passi 0,08 / 0,23 s come il reel 5)
 */
TPL.L01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const voci = o.voci || ["Voce 1", "Voce 2", "Voce 3"];
  const w = o.w || 820, h = o.h || 112, gap = o.gap || 46, fs = o.fs || 42;
  const lista = listK(L, X, Y, w, voci, { h, gap, fs, z: 12 });
  // i numeri in lime (l'accento della barra); il testo resta sfocato (listK: soft)
  lista.rows.forEach((r) => gsap.set(r.num, { color: "rgba(255,255,255,.75)" }));
  // 1) prima del taglio: la prima barra c'è già (montata sotto la scena prima)
  const m = montaT(t0);
  if (m) lista.show(1, m.t, { noRecentre: false }); else { gsap.set(lista.rows[0].r, { opacity: 1 }); lista.show(1, 0); }
  // 2) il movimento principale (reel 5: la seconda barra a +0,08 s, la terza a +0,23 s; la pila si ri-centra e continua a salire
  //    piano, frenando, per ~1,3 s): le altre barre arrivano una alla volta, l'ultima ri-centratura è lunga e morbida
  const passi = o.passi || [0.08, 0.23];
  for (let k = 2; k <= voci.length; k++) {
    const ult = k === voci.length;
    lista.show(k, t0 + (passi[k - 2] != null ? passi[k - 2] : passi[passi.length - 1] + (k - passi.length - 1) * 0.12), ult ? { dur: o.durCentra || 1.3, ease: "power2.out" } : { dur: 0.45 });
  }
  // 3) accento: i numeri si accendono uno dopo l'altro sulla parola che dà il conto
  const tn = P.numeri == null ? t0 + 1.2 : P.numeri;
  lista.rows.forEach((r, i) => tl.to(r.num, { color: K.lime, textShadow: GLOW_LT, duration: 0.15 }, tn + i * 0.08));
  // 4) la camera: ferma (il movimento è della lista), tenuta dell'1,2%
  const rect = lista.rect(voci.length);
  const R = [rect[0] - 10, rect[1] - 30, rect[2] + 10, rect[3] + 30];
  let pose = fitPose(R[0], R[1], R[2], R[3], { top: 400, fill: o.fill || 0.92 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, R, { modo: o.ingresso || "fermo", top: 400, fill: o.fill || 0.92 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect: R, pose,
    ancore: { voce: (i) => lista.rowXY(i) },
    elementi: { lista, titolo: T, L },
    tempi: { taglio: t0, numeri: tn },
  };
};

/* @scheda L02 · Una voce si risolve con uno sheen (il punto detto va a fuoco, gli altri restano sfocati)
 * quando: quando nomini il punto della lista ("la prima è il desiderio", "il secondo errore…"): una banda di luce attraversa la
 *   barra da destra a sinistra, il testo va a fuoco dietro la banda e la barra diventa attiva; si usa sulla lista di L01 (la
 *   stessa, che continua) oppure da sola
 * frase: «La prima è il desiderio. Ogni persona vuole qualcosa di preciso.» (09/10, 14,4–18,1 s)
 * durata: 2,5–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio, o l'inizio della frase se la lista continua), t1, X, Y (centro della lista se è nuova), parole: { risolve
 *   (la banda parte, es. «desiderio»), fuoco (le altre barre si attenuano, es. «preciso»), titolo ([…]) }
 * opzioni: lista (la listK restituita da L01: continua sulla stessa lista, niente taglio) oppure voci (lista nuova, piena al
 *   taglio), voce (indice della voce che si risolve, 0), titolo, durSheen (0,78), spinta ({ ds: 0.06, dur: 0.8 }: con la lista
 *   che continua, la seconda inquadratura verso la voce), ingresso ("arrivo" default per la lista nuova | "nessuno"), fermo
 * restituisce: rect, pose, ancore { voce(i) }, elementi { lista, L }, tempi { taglio, risolve, fuoco }
 * suoni: sub .05 sulla banda · tick .05 su «fuoco»
 * regole: L02 misurato (reel 5 a 10,6 s e a 34,1 s, note-effetti E04–E05): banda bianca ~46 px inclinata di 20° che entra dal
 *   bordo destro ed esce a sinistra in ~0,78 s quasi a velocità costante; il testo va a fuoco dietro la banda; poi la barra
 *   attiva (fondo più chiaro, bordo bianco sottile, +3%, power2.out senza rimbalzo); le altre restano sfocate · R8 con la lista
 *   di L01 non c'è taglio: la stessa lista continua e la camera fa una seconda inquadratura breve (+6% in 0,8 s power2.out)
 *   verso la voce · R3 al massimo due accenti (la voce detta, poi il fuoco) · R5 · R7
 * prima: (demo-8 1,5–4,7 s · demo 6,8 s) listK.resolve sulla lista della demo, dopo una costruzione voce per voce
 * chiamata:
 *   TPL.L02({ t0: 14.0, t1: 18.3, X: 6600, Y: 860, parole: { risolve: 15.08, fuoco: 17.42,
 *     titolo: [14.55, 14.78, 15.08] } }, {
 *     titolo: [[{ t: "La prima: " }, { t: "il desiderio", box: true }]], lista: S.L01.elementi.lista, voce: 0 });
 */
TPL.L02 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const k = o.voce || 0;
  let lista = o.lista, nuova = false;
  if (!lista) {
    nuova = true;
    const voci = o.voci || ["Voce 1", "Voce 2", "Voce 3"];
    lista = listK(L, X, Y, o.w || 820, voci, { h: o.h || 112, gap: o.gap || 46, fs: o.fs || 42, z: 12 });
    // R2: tutte le barre già lì al taglio (montate prima), testo sfocato
    const m = montaT(t0);
    if (m) lista.show(voci.length, m.t); else { gsap.set(lista.rows.map((r) => r.r), { opacity: 1 }); lista.show(voci.length, 0); }
  }
  const n = lista.rows.length;
  // accento 1: la voce si risolve con lo sheen (da destra a sinistra) e diventa attiva
  const tr = P.risolve == null ? t0 + 0.9 : P.risolve;
  lista.resolve(k, tr, o.durSheen || 0.78);
  tl.to(lista.rows[k].num, { color: K.lime, textShadow: GLOW_LT, duration: 0.2 }, tr + 0.1);
  // accento 2: le altre barre si attenuano (il fuoco resta sulla voce detta)
  const tf = P.fuoco == null ? null : P.fuoco;
  if (tf != null) lista.dimOthers(k, tf, 0.45);
  // la camera
  const rect = lista.rect(n);
  const R = [rect[0] - 10, rect[1] - 30, rect[2] + 10, rect[3] + 30];
  let pose = fitPose(R[0], R[1], R[2], R[3], { top: 400, fill: o.fill || 0.98 });
  if (!nuova) {
    // la lista continua (R8): seconda inquadratura breve verso la voce, poi tiene
    const sp = Object.assign({ ds: 0.06, dur: 0.8 }, o.spinta || {});
    const [vx, vy] = lista.rowXY(k);
    const s1 = CAM.s * (1 + sp.ds);
    camK(t0, sp.dur, CAM.fx + (vx - CAM.fx) * 0.12, CAM.fy + (vy - CAM.fy) * 0.35, s1, "power2.out");
    tplTenuta(t0 + sp.dur, t1, 0.008);
    pose = { fx: CAM.fx, fy: CAM.fy, s: CAM.s };
  } else if (o.ingresso !== "nessuno") pose = apertura(t0, t1, R, { modo: o.ingresso || "arrivo", top: 400, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect: R, pose,
    ancore: { voce: (i) => lista.rowXY(i) },
    elementi: { lista, titolo: T, L },
    tempi: { taglio: t0, risolve: tr, fuoco: tf },
  };
};
