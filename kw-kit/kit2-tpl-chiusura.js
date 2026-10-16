// ═══ KW kit v2 · TEMPLATE · chiusura e CTA (X) — blocco 3 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ══════════════
// Stesso standard di kit2-template.js (scheda @scheda, TPL.<ID>(scena, opzioni) → { rect, pose, ancore, elementi, tempi }).
// Le scene di prova sono in CATALOGO-ANIMAZIONI/ritmo-03 (KW_RITMO).

/* @scheda X01 · "Commenta X" + anteprima della risorsa (i documenti arrivano a ondate)
 * quando: la chiusura di quasi ogni reel ("Commenta sistema e ti mando il comando…", "Commenta profilo e ti mando la
 *   checklist…"): il titolo con la parola da commentare nel box; sotto, il contenitore della risorsa con le pagine vere che
 *   arrivano a ondate (1 → 3 → 6), ogni pagina nuova si accende di lime e torna bianca; la pagina che nomini si accende
 * frase: «Commenta sistema e ti mando il comando…» (15/10, 39,8–41,8 s; la frase continua in U01)
 * durata: 2,5–6 s (consigliata 3–5)
 * scena: t0 (taglio), t1, X, Y (centro del contenitore), parole: { ondate ([tempo di ogni ondata], es. «Commenta», «sistema»,
 *   «mando»), risorsa (la pagina che nomini si accende, es. «comando»), titolo ([…]) }
 * opzioni: pagine ([titoli delle pagine vere], la prima è la risorsa che nomini), ondate ([quante pagine dopo ogni ondata],
 *   default [1, 3, 6]: la prima c'è già al taglio), cols (3), dw / dh (pagina 240 × 300), titolo, ingresso ("arrivo" default |
 *   "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { risorsa (centro della prima pagina: ci entra U01 con lo zoom-through), pagina(i) },
 *   elementi { box, pagine, L }, tempi { taglio, ondate, risorsa }
 * suoni: whoosh .14 al taglio · card .06 per ondata · tick .06 su «risorsa»
 * regole: X01 misurato (reel 12 a 81,0 s: al taglio il contenitore scuro con la prima pagina accesa di lime; le pagine
 *   arrivano una o due alla volta, ~0,25–0,5 s fra un'ondata e l'altra, ognuna accesa di lime per ~0,25 s, senza rimbalzo;
 *   titolo «Comment "Authority" To Get This Doc» con la parola nel box) · R2 il contenitore e la prima pagina sono già lì · R3
 *   gli accenti sono le ondate sulle parole e la pagina nominata · R5 niente back.out (docWall usava back.out(1,6)) · R7
 * prima: (demo-2 72–76 s · reel-09 57–61,5 s) docWall.show che entrava sfocato dopo il taglio, pagine con back.out(1,6)
 * chiamata:
 *   TPL.X01({ t0: 45.7, t1: 48.2, X: 25600, Y: 900, parole: { ondate: [46.2, 46.74, 47.5], risorsa: 47.83,
 *     titolo: [46.2, 46.74] } }, {
 *     titolo: [[{ t: "Commenta " }, { t: "«sistema»", box: true }]],
 *     pagine: ["Il comando", "Hook", "Spiega", "Mostra", "Insegna", "Esempi"] });
 */
TPL.X01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const PG = o.pagine || ["Risorsa", "Pagina 2", "Pagina 3", "Pagina 4", "Pagina 5", "Pagina 6"];
  const n = PG.length, cols = o.cols || 3, dw = o.dw || 240, dh = o.dh || 300, g = 26, pad = 40;
  const nr = Math.ceil(n / cols), W = cols * dw + (cols - 1) * g + pad * 2, H = nr * dh + (nr - 1) * g + pad * 2;
  const x0 = X - W / 2, y0 = Y - H / 2;
  const box = glass(L, x0, y0, W, H, { zIndex: 11, borderRadius: 34, overflow: "visible" });
  const pos = [];
  const pagine = PG.map((tit, i) => {
    const dx = pad + (i % cols) * (dw + g), dy = pad + Math.floor(i / cols) * (dh + g);
    const d = docPage(box, dx, dy, dw, dh, tit, i + 1);
    // velo lime della pagina appena arrivata (Kallaway: la pagina nuova è verde e torna bianca)
    const v = el(d, { position: "absolute", inset: 0, background: "rgba(207,251,80,.62)", mixBlendMode: "multiply", opacity: 0, zIndex: 9 });
    pos.push([x0 + dx + dw / 2, y0 + dy + dh / 2]);
    gsap.set(d, { opacity: 0 });
    return { d, v };
  });
  // 1) prima del taglio: il contenitore e la prima pagina (accesa) sono già lì (R2)
  gsap.set(box, { opacity: 0 });
  tplMonta(t0, (t) => { tl.to([box, pagine[0].d], { opacity: 1, duration: 0.2 }, t); tl.set(pagine[0].v, { opacity: 1 }, t); },
    () => { gsap.set([box, pagine[0].d], { opacity: 1 }); gsap.set(pagine[0].v, { opacity: 1 }); });
  tl.to(pagine[0].v, { opacity: 0, duration: 0.3 }, t0 + 0.25);
  // 2) gli accenti: le ondate sulle parole (ogni pagina entra a scala piena quasi, 0,9 → 1, e si accende di lime per 0,25 s)
  const OND = o.ondate || [1, 3, 6];
  const TW = P.ondate || OND.slice(1).map((_, i) => t0 + 0.6 + i * 0.5);
  let k = OND[0];
  OND.slice(1).forEach((upto, wi) => {
    const t = TW[Math.min(wi, TW.length - 1)];
    for (let j = 0; k < upto && k < n; k++, j++) {
      popK(pagine[k].d, t + j * 0.06, { da: 0.9, dur: 0.18, y: 18 });
      tl.set(pagine[k].v, { opacity: 1 }, t + j * 0.06);
      tl.to(pagine[k].v, { opacity: 0, duration: 0.3 }, t + j * 0.06 + 0.25);
    }
  });
  // 3) la pagina che nomini si accende (bordo lime + alone): è la risorsa
  const tr = P.risorsa == null ? t1 - 0.6 : P.risorsa;
  const cornice = layered(el(box, { position: "absolute", left: pad - 9, top: pad - 9, width: dw + 18, height: dh + 18, borderRadius: 14, border: `6px solid ${K.lime}`, boxShadow: `${GLOW_A(0.9)}, inset 0 0 18px rgba(207,251,80,.35)`, zIndex: 8 }));
  popK(cornice, tr, { da: 0.96, dur: 0.15 });
  // 4) la camera: arrivo dal basso che frena, poi tiene
  const rect = [x0 - 12, y0 - 12, x0 + W + 12, y0 + H + 12];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.97 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.97 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { risorsa: pos[0], pagina: (i) => pos[i] },
    elementi: { box, pagine, titolo: T, L },
    tempi: { taglio: t0, ondate: TW, risorsa: tr },
  };
};
