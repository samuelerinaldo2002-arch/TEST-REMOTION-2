// ═══ KW kit v2 · TEMPLATE · connettori e segnali (C) — blocco 1 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═════════
// Stesso standard di kit2-template.js. Scene di prova in CATALOGO-ANIMAZIONI/ritmo-01 (KW_RITMO).

/* @scheda C01 · Linea che si allunga mentre la camera viaggia (fino alle tappe dette)
 * quando: si passa da A a B collegati (la causa e i suoi esempi, un elenco nel tempo: "lunedì…, martedì…, venerdì…",
 *   "prima… poi…"); è anche la transizione morbida R8 fra due scene che si toccano (la linea parte da un'ancora della scena
 *   prima)
 * frase: «Lunedì parno di fitness, martedì di viaggi, venerdì di motivazione.» (01/10, 4,7–7,5 s)
 * durata: 2,5–5 s (consigliata 3–4)
 * scena: t0 (la linea parte e la camera la segue), t1, X, Y (centro della fila di tappe), parole: { tappe: [quando si
 *   accende ogni tappa: la prima all'arrivo, le altre sulle parole], titolo ([tempo per parola]) }
 * opzioni: da ([x, y] del mondo: l'ancora della scena prima da cui parte la linea; senza, la scena entra col taglio netto e un
 *   arrivo da destra), tappe ([{ media (id video del pool), giorno (etichetta sopra), tema, icona (lucide) }], 2–4),
 *   viaggio (s, 0.7), w (card 9:16, 300; tre card riempiono la larghezza), titolo, fermo (R7, default true: dall'arrivo)
 * restituisce: rect, pose, ancore { nodo(i), card(i) (centro), fine (ultimo nodo) }, elementi { linee, card, titolo, L },
 *   tempi { partenza, arrivo, tappe: [...] }
 * suoni: whoosh .16 alla partenza (la linea) · land .12 all'arrivo · tick .06 su ogni tappa
 * regole: R2 le tappe ci sono già (fuori fuoco, non ancora dette) quando la camera arriva · R8 la linea riempie il viaggio: la
 *   camera la segue con la stessa curva (power1.out, 0,7 s; misurati reel 79 e 14: ~0,7 schermate, 90% in 0,42–0,71 s,
 *   picco 2400–3000 px/s, frena sull'oggetto già in scena) e la scena dopo sta vicina (~1 schermata): niente corsa nel vuoto · R3 dopo l'arrivo la camera tiene (1,2%) e la linea va avanti da sola
 *   di tappa in tappa sulle parole (accenti: nodo + card che va a fuoco) · R5 niente rimbalzi · R7 sfondo fermo dall'arrivo
 * prima: (demo-7 0,8–4,05 s) connector().draw insieme a camK con la stessa curva; nel reel-01 v5 la settimana arrivava con un
 *   whip e la camera correva lungo i giorni (due movimenti)
 * chiamata:
 *   TPL.C01({ t0: 5.6, t1: 8.75, X: 1850, Y: 900, parole: { tappe: [6.2, 6.93, 7.63], titolo: [5.83, 6.5, 6.93, 7.63] } }, {
 *     da: S.O01.ancore.bordo(0), titolo: [[{ t: "Ogni giorno " }, { t: "un tema", box: true }], [{ t: "diverso", hand: true }]],
 *     tappe: [{ media: "w1", giorno: "LUN", tema: "Fitness", icona: "dumbbell" },
 *             { media: "w2", giorno: "MAR", tema: "Viaggi", icona: "plane" },
 *             { media: "w3", giorno: "VEN", tema: "Motivazione", icona: "flame" }] });
 */
TPL.C01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const tp = o.tappe || [], n = tp.length;
  const w = o.w || 300, h = Math.round((w * 16) / 9), g = o.gap || 40;
  const RW = n * w + (n - 1) * g, x0 = X - RW / 2;
  const cx = (i) => x0 + w / 2 + i * (w + g);
  const yN = Y - h / 2 - 72; // la linea delle tappe corre sopra le card
  const S = svgLayer(L, 6, X - 6000, Y - 3000, 12000, 6000);
  // le tappe: card col reel vero, etichetta del giorno sopra il nodo, tema sotto; ci sono già, fuori fuoco (L01)
  const cards = tp.map((q, i) => {
    const c = layered(el(L, { position: "absolute", left: cx(i) - w / 2, top: Y - h / 2, width: w, height: h, borderRadius: Math.round(w * 0.09), overflow: "hidden", background: "#111", border: "2px solid rgba(255,255,255,.28)", boxShadow: "0 24px 60px rgba(0,0,0,.6)", zIndex: 12 }));
    if (q.media) mediaTile(c, 0, 0, w, h, q.media, 1);
    const nodo = el(L, { position: "absolute", left: cx(i) - 13, top: yN - 13, width: 26, height: 26, borderRadius: "50%", background: "#2a2a2a", border: "3px solid rgba(255,255,255,.55)", zIndex: 14 });
    const gi = el(L, { position: "absolute", left: cx(i) - 120, top: yN - 78, width: 240, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: 46, lineHeight: 1, color: K.white, textShadow: GLOW_T, zIndex: 14 }, q.giorno || "");
    const te = el(L, { position: "absolute", left: cx(i) - (w + 40) / 2, top: Y + h / 2 + 24, width: w + 40, height: 64, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(180deg,#3b3b3b,#262626)", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 12px 26px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: 28, color: K.white, whiteSpace: "nowrap", zIndex: 14 }, (q.icona ? svg(q.icona, 28, K.lime, 2.4) : "") + (q.tema || ""));
    gsap.set(c, { filter: "blur(8px)", opacity: 0.38 });
    gsap.set([gi, te], { opacity: 0.3, filter: "blur(5px)" });
    return { c, nodo, gi, te };
  });
  // le linee: dall'ancora della scena prima al primo nodo (curva a S), poi da nodo a nodo
  const linee = [];
  if (o.da) linee.push(connector(S, [o.da, [cx(0) - 13, yN]], { curve: "h", w: 4, color: "rgba(255,255,255,.85)" }));
  for (let i = 1; i < n; i++) linee.push(connector(S, [[cx(i - 1) + 13, yN], [cx(i) - 13, yN]], { w: 4, color: "rgba(255,255,255,.85)" }));
  const lv = o.da ? 1 : 0; // indice della prima linea fra le tappe
  // 1) prima della partenza: le tappe ci sono già (fuori fuoco)
  tplMonta(t0, (t) => { gsap.set(cards.map((c) => [c.c, c.nodo, c.gi, c.te]).flat(), { visibility: "hidden" }); tl.set(cards.map((c) => [c.c, c.nodo, c.gi, c.te]).flat(), { visibility: "visible" }, t); });
  // 2) il viaggio: la linea parte e la camera la segue con la stessa curva, la punta resta in campo (R8 morbida); senza «da»
  //    la scena entra col taglio netto e un arrivo da destra (R2)
  const rect = [x0 - 30, yN - 100, x0 + RW + 30, Y + h / 2 + 100];
  const dv = o.viaggio || 0.7;
  const pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: 0.97 });
  let tArr = t0;
  if (o.da) {
    linee[0].draw(t0, dv + 0.05, "power1.out");
    camK(t0 + 0.05, dv, pose.fx, pose.fy, pose.s, "power1.out");
    mblur(t0 + 0.05, 0.3, 10, "x", "decay");
    tArr = t0 + 0.05 + dv;
    if (t1 - tArr > 0.3) camK(tArr, t1 - tArr, CAM.fx, CAM.fy, CAM.s * 1.012, "sine.out");
  } else {
    apertura(t0, t1, rect, { modo: "arrivo", dx: -220, top: 380, fill: 0.97 });
    tArr = t0 + 0.1;
  }
  // 3) le tappe: la prima all'arrivo, le altre sulle parole; la linea va avanti da sola (la camera tiene)
  const T = P.tappe || tp.map((_, i) => tArr + i * 0.6);
  cards.forEach((c, i) => {
    const t = Math.max(T[i], i === 0 ? tArr - 0.08 : 0);
    if (i > 0) linee[lv + i - 1].draw(t - 0.22, 0.24, "power2.out");
    tl.to(c.nodo, { backgroundColor: K.lime, borderColor: "#f4ffd0", boxShadow: GLOW_A(0.8), duration: 0.15 }, t);
    tl.fromTo(c.nodo, { scale: 0.8 }, { scale: 1, duration: 0.18, ease: "power2.out", immediateRender: false }, t);
    tl.to(c.c, { filter: "blur(0px)", opacity: 1, borderColor: "rgba(207,251,80,.9)", boxShadow: `${GLOW_A(0.45)}, 0 24px 60px rgba(0,0,0,.6)`, duration: 0.25, ease: "power2.out" }, t);
    tl.set(c.c, { filter: "none" }, t + 0.26);
    tl.to([c.gi, c.te], { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power2.out" }, t);
    tl.set([c.gi, c.te], { filter: "none" }, t + 0.23);
  });
  if (o.da) tplFermo0(scena, Object.assign({ fermoDa: tArr }, o)); else tplFermo0(scena, o);
  const Ti = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { nodo: (i) => [cx(i), yN], card: (i) => [cx(i), Y], fine: [cx(n - 1), yN] },
    elementi: { linee, card: cards, titolo: Ti, L },
    tempi: { partenza: t0, arrivo: tArr, tappe: cards.map((_, i) => Math.max(T[i], i === 0 ? tArr - 0.08 : 0)) },
  };
};
