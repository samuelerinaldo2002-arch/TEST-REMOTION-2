// ═══ KW kit v2 · OGGETTI — i dispositivi del catalogo che servono ai tuoi script ═══════════════
// Ogni funzione riporta l'ID della voce di catalogo. Coordinate nel parent (di solito un layer del mondo).
// Regola di colore del brand: lime = ciò che conta / giusto; bianco = neutro; grigio scuro + sfocato = sbagliato/confuso.

const GLASS = { background: "linear-gradient(180deg, rgba(56,56,56,.9) 0%, rgba(33,33,33,.94) 45%, rgba(23,23,23,.97) 100%)", border: "1.5px solid rgba(255,255,255,.15)", boxShadow: "0 34px 90px rgba(0,0,0,.6), inset 0 1.5px 0 rgba(255,255,255,.11)" };
const glass = (parent, x, y, w, h, extra) => el(parent, Object.assign({ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, overflow: "hidden" }, GLASS, extra || {}));
const svgIn = (parent, w, h, extra) => {
  const S = document.createElementNS(NS, "svg");
  S.setAttribute("width", w); S.setAttribute("height", h); S.setAttribute("viewBox", `0 0 ${w} ${h}`);
  Object.assign(S.style, Object.assign({ position: "absolute", left: "0px", top: "0px", overflow: "visible", pointerEvents: "none" }, extra || {}));
  const defs = document.createElementNS(NS, "defs");
  S.appendChild(defs); S._defs = defs;
  parent.appendChild(S);
  return S;
};
const pathEl = (S, d, attrs) => {
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", d);
  for (const k in attrs) p.setAttribute(k, attrs[k]);
  S.appendChild(p);
  return p;
};
const shade = (k) => { const c = [207, 251, 80].map((v) => Math.round(Math.min(255, v * k))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
const limeFill = (k) => `linear-gradient(180deg, ${shade(1.12 * k)} 0%, ${shade(1 * k)} 45%, ${shade(0.8 * k)} 100%)`;
// alone che resta fuori da una forma ritagliata (clip-path taglia box-shadow e filtri dell'elemento stesso)
const clipGlow = (parent, x, y, w, h, poly, z, a) => {
  const g = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, filter: "blur(18px)", opacity: a == null ? 0.55 : a, zIndex: z, pointerEvents: "none" });
  el(g, { position: "absolute", inset: 0, clipPath: poly, background: "#CFFB50" });
  return g;
};
const drawable = (p) => { const L = p.getTotalLength(); p.setAttribute("stroke-dasharray", `${L} ${L}`); p.setAttribute("stroke-dashoffset", L); return L; };
const drawOn = (p, t, dur, ease) => tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: dur || 0.5, ease: ease || "power2.inOut" }, t);

// ═══ O24 · calendario che si riempie ═══════════════════════════════════════════════════════
// o: { mese:"Novembre", start (0=lun), giorni:30, cell, cellH (celle verticali per i video), gap, z }
// .fill(t, giorni, {step, conta})   → giorni che si accendono di lime (reel 82, 67, 94)
// .fillVideos(t, idVideo, {step})   → ogni giorno riceve un reel vero che si muove, in ordine (reel 68 e 59)
// .put(t, giorno, html)             → un'icona/contenuto in un giorno
const calendar = (parent, cx, cy, o) => {
  o = o || {};
  const cell = o.cell || 108, cellH = o.cellH || cell, gap = o.gap || 10, cols = 7;
  const start = o.start == null ? 2 : o.start, days = o.giorni || 30;
  const rows = Math.ceil((start + days) / 7);
  const gw = cols * cell + (cols - 1) * gap, gh = rows * cellH + (rows - 1) * gap;
  const pad = 34, head = 150;
  const W = gw + pad * 2, H = gh + head + pad;
  const c = glass(parent, cx - W / 2, cy - H / 2, W, H, { zIndex: o.z || 12 });
  el(c, { position: "absolute", left: pad, top: 26, fontFamily: FD, fontWeight: 700, fontSize: 58, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, o.mese || "Novembre");
  const counter = el(c, { position: "absolute", right: pad, top: 34, fontFamily: FS, fontWeight: 800, fontSize: 30, color: K.lime, textShadow: GLOW_LT, opacity: 0, whiteSpace: "nowrap" }, "");
  "LMMGVSD".split("").forEach((d, i) => el(c, { position: "absolute", left: pad + i * (cell + gap), top: 104, width: cell, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,.4)", letterSpacing: "0.1em" }, d));
  const cells = [];
  for (let d = 1; d <= days; d++) {
    const i = start + d - 1, x = pad + (i % 7) * (cell + gap), y = head + Math.floor(i / 7) * (cellH + gap);
    const b = el(c, { position: "absolute", left: x, top: y, width: cell, height: cellH, borderRadius: 16, background: "rgba(255,255,255,.045)", border: "1.5px solid rgba(255,255,255,.07)", overflow: "hidden" });
    const fillE = el(b, { position: "absolute", inset: 0, background: limeFill(1), opacity: 0 });
    const n = el(b, { position: "absolute", left: 10, top: 7, fontFamily: FS, fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,.55)", zIndex: 6 }, String(d));
    cells.push({ b, fillE, n });
  }
  const conta = (t, n, dur, f) => {
    f = f || ((v) => `${Math.round(v)} contenuti`);
    tl.set(counter, { opacity: 1 }, t);
    const P = { v: 0 };
    tl.to(P, { v: n, duration: dur, ease: "none", onUpdate: () => (counter.textContent = f(P.v)) }, t);
    glowFlash(counter, t + dur, { base: GLOW_LT });
  };
  const fill = (t, list, o2) => {
    o2 = o2 || {};
    const step = o2.step == null ? 0.035 : o2.step;
    const L = list || cells.map((_, i) => i + 1);
    L.forEach((d, k) => {
      const cl = cells[d - 1];
      const tt = t + k * step;
      tl.to(cl.fillE, { opacity: 1, duration: 0.12 }, tt);
      tl.to(cl.n, { color: K.ink, duration: 0.12 }, tt);
      tl.fromTo(cl.b, { scale: 0.86 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, tt);
    });
    if (o2.conta) conta(t, L.length, L.length * step + 0.1, o2.label);
  };
  // i reel arrivano nei giorni in ordine, ~0,055 s l'uno (il mese si riempie in ~1,6 s come nel reel 68)
  const fillVideos = (t, ids, o2) => {
    o2 = o2 || {};
    const step = o2.step == null ? 0.055 : o2.step;
    const tiles = [];
    ids.forEach((id, k) => {
      const cl = cells[k];
      if (!cl) return;
      const tile = videoTile(cl.b, 0, 0, cell, cellH, id, 4);
      tile.style.borderRadius = "15px";
      gsap.set(tile, { opacity: 0, scale: 0.5 });
      const tt = t + k * step;
      tl.to(tile, { opacity: 1, duration: 0.05 }, tt);
      tl.to(tile, { scale: 1, duration: 0.3, ease: "back.out(2.2)" }, tt);
      tl.to(cl.n, { color: "#ffffff", textShadow: "0 1px 6px rgba(0,0,0,.95), 0 0 2px rgba(0,0,0,.9)", duration: 0.08 }, tt);
      tl.to(cl.b, { borderColor: "rgba(255,255,255,.35)", duration: 0.1 }, tt);
      tiles.push(tile);
    });
    if (o2.conta !== false) conta(t, ids.length, ids.length * step + 0.1, o2.label);
    return tiles;
  };
  const put = (t, d, html) => {
    const cl = cells[d - 1];
    const m = el(cl.b, { position: "absolute", left: 0, top: 22, width: cell, height: cellH - 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }, html);
    gsap.set(m, { opacity: 0, scale: 0.6 });
    tl.to(m, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.2)" }, t);
    return m;
  };
  // A06 · i giorni arrivano sparsi (fuori posto, ruotati) e si montano nella griglia in ~0,6 s (reel 139 di Kallaway)
  const assemble = (t, o2) => {
    o2 = o2 || {};
    const spr = o2.spread || 420, dd = o2.dur || 0.45;
    gsap.set(cells.map((cl) => cl.b), { opacity: 0 });
    cells.forEach((cl, k) => {
      const tt = t + ((hash(k + 7, 9) + 1) / 2) * dd;
      tl.fromTo(cl.b, { x: hash(k + 1, 3) * spr, y: hash(k + 41, 5) * spr * 1.2, rotation: hash(k + 81, 7) * 50, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, tt);
    });
    return t + dd + 0.5;
  };
  return { c, cells, fill, fillVideos, put, assemble, W, H, cell, cellH, pad, head };
};

// ═══ O23 · griglia di 100 puntini ══════════════════════════════════════════════════════════
// o: { cols, rows, gap, r, z } · light(t, n, dur): n puntini a caso diventano bianchi luminosi
// split(t, gruppi): colora i puntini a blocchi, es. [[70, K.lime], [20, "#fff"], [10, "rgba(255,255,255,.18)"]]
const dotGrid = (parent, cx, cy, o) => {
  o = o || {};
  const cols = o.cols || 10, rows = o.rows || 10, gap = o.gap || 62, r = o.r || 16;
  const W = (cols - 1) * gap + 2 * r + 80, H = (rows - 1) * gap + 2 * r + 80;
  const c = glass(parent, cx - W / 2, cy - H / 2, W, H, { zIndex: o.z || 12, borderRadius: 30 });
  const dots = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const d = el(c, { position: "absolute", left: 40 + i * gap, top: 40 + j * gap, width: r * 2, height: r * 2, borderRadius: "50%", background: "rgba(255,255,255,.22)" });
    dots.push(d);
  }
  gsap.set(dots, { opacity: 0 });
  const order = dots.map((_, i) => i).sort((a, b) => hash(a + 3, 17) - hash(b + 3, 17));
  const waveIn = (t, dur) => { for (let j = 0; j < rows; j++) tl.to(dots.slice(j * cols, j * cols + cols), { opacity: 1, duration: 0.12 }, t + j * ((dur || 0.5) / rows)); };
  const light = (t, n, dur, color) => {
    const pick = order.slice(0, n);
    pick.forEach((i, k) => {
      const tt = t + ((hash(k + 11, 4) + 1) / 2) * (dur || 1.6);
      tl.to(dots[i], { background: color || "#ffffff", boxShadow: color ? GLOW_A(0.8) : "0 0 14px rgba(255,255,255,.9)", duration: 0.08 }, tt);
    });
    return pick;
  };
  const recolor = (t, idx, color) => tl.to(idx.map((i) => dots[i]), { background: color, boxShadow: color === K.lime ? GLOW_A(0.8) : "none", duration: 0.05 }, t);
  const split = (t, gruppi, step) => {
    let k = 0;
    gruppi.forEach(([n, color]) => {
      for (let q = 0; q < n && k < dots.length; q++, k++) tl.to(dots[k], { background: color, boxShadow: color === K.lime ? GLOW_A(0.7) : "none", duration: 0.08 }, t + k * (step == null ? 0.012 : step));
    });
  };
  return { c, dots, waveIn, light, recolor, split, W, H };
};

// ═══ D07 · formula che si compone ══════════════════════════════════════════════════════════
// terms: [{v:"5", l:"sotto-nicchie"}, {op:"×"}, {v:"10", l:"formati"}, {op:"×"}, {v:"7", l:"angoli"}, {op:"="}, {v:"350", res:true, l:"contenuti"}]
const equation = (parent, cx, cy, terms, o) => {
  o = o || {};
  if (o.vertical) return equationV(parent, cx, cy, terms, o);
  const fs = o.fs || 150;
  const row = el(parent, { position: "absolute", left: cx - 1000, top: cy - fs * 0.6, width: 2000, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: Math.round(fs * 0.16), zIndex: o.z || 14 });
  const items = terms.map((tm) => {
    const col = el(row, { display: "flex", flexDirection: "column", alignItems: "center" });
    const big = el(col, { fontFamily: tm.op ? FS : FD, fontWeight: tm.op ? 300 : 700, fontSize: tm.op ? fs * 0.62 : fs * (tm.res ? 1.12 : 1), lineHeight: 1, color: tm.res ? K.lime : tm.op ? "rgba(255,255,255,.6)" : K.white, textShadow: tm.res ? GLOW_LT : GLOW_T, marginTop: tm.op ? fs * 0.22 : 0, whiteSpace: "nowrap" }, tm.res ? "0" : tm.v || tm.op);
    let lab = null;
    if (tm.l) lab = el(col, { marginTop: 10, fontFamily: FH, fontSize: Math.round(fs * 0.26), color: tm.res ? K.lime : "rgba(255,255,255,.75)", whiteSpace: "nowrap" }, tm.l);
    gsap.set(col, { opacity: 0, filter: "blur(10px)", y: 24, scale: 0.9 });
    return { col, big, lab, tm };
  });
  // show(i, t): fa entrare il termine i (il risultato conta e brilla)
  const show = (i, t, dur) => {
    const it = items[i];
    tl.to(it.col, { opacity: 1, filter: "blur(0px)", y: 0, scale: 1, duration: 0.32, ease: "back.out(1.8)" }, t);
    tl.set(it.col, { filter: "none" }, t + 0.33);
    if (it.tm.res) {
      const to = Number(String(it.tm.v).replace(/\D/g, "")) || 0;
      const P = { v: 0 };
      tl.to(P, { v: to, duration: dur || 0.7, ease: "power1.out", onUpdate: () => (it.big.textContent = itNum(P.v) + (it.tm.suffix || "")) }, t);
      glowFlash(it.big, t + (dur || 0.7), { base: GLOW_LT, peak: "0 0 18px rgba(207,251,80,1), 0 0 70px rgba(207,251,80,.8), 0 0 140px rgba(207,251,80,.45)" });
    }
  };
  return { row, items, show };
};

// D07 verticale (reel 117 di Kallaway): i termini impilati in un riquadro tratteggiato, operatore a sinistra, etichetta a
// destra, una riga sopra il risultato in lime che conta e brilla. Molto più "pieno" della formula in riga.
const equationV = (parent, cx, cy, terms, o) => {
  const fs = o.fs || 130, rowH = Math.round(fs * 1.22), w = o.w || 860;
  const rows = terms.filter((tm) => !tm.op);
  const H = rows.length * rowH + 120;
  const box = el(parent, { position: "absolute", left: cx - w / 2, top: cy - H / 2, width: w, height: H, borderRadius: 30, background: "linear-gradient(180deg, rgba(48,48,48,.55), rgba(24,24,24,.75))", border: "3px dashed rgba(255,255,255,.28)", boxShadow: "0 30px 80px rgba(0,0,0,.5)", zIndex: o.z || 13 });
  gsap.set(box, { opacity: 0, scale: 0.94 });
  const items = [];
  let r = 0, pendingOp = null;
  terms.forEach((tm) => {
    if (tm.op) { pendingOp = tm.op; return; }
    const y = 60 + r * rowH;
    const rowEl = el(box, { position: "absolute", left: 0, top: y, width: w, height: rowH, display: "flex", alignItems: "center", gap: Math.round(fs * 0.22), padding: `0 ${Math.round(fs * 0.4)}px` });
    const opTxt = pendingOp || "";
    const op = el(rowEl, { width: Math.round(fs * 0.5), textAlign: "center", fontFamily: FS, fontWeight: 300, fontSize: Math.round(fs * 0.6), color: "rgba(255,255,255,.55)" }, opTxt);
    // il risultato sta su una pill lime piena (come il "10.6M" in rosso del reel 117): è il punto della scena
    const big = el(rowEl, Object.assign({ fontFamily: FD, fontWeight: 700, fontSize: tm.res ? Math.round(fs * 1.02) : fs, lineHeight: 1, color: tm.res ? K.ink : K.white, textShadow: tm.res ? "none" : GLOW_T, whiteSpace: "nowrap" },
      tm.res ? { background: "linear-gradient(180deg,#e6ff94 0%,#CFFB50 55%,#bde83f 100%)", borderRadius: Math.round(fs * 0.16), padding: `${Math.round(fs * 0.1)}px ${Math.round(fs * 0.22)}px ${Math.round(fs * 0.04)}px`, boxShadow: `${GLOW_A(0.9)}, inset 0 2px 0 rgba(255,255,255,.6)` } : {}), tm.res ? "0" : tm.v);
    const lab = el(rowEl, { fontFamily: FH, fontSize: Math.round(fs * (tm.res && tm.tag ? 0.3 : 0.38)), color: tm.res ? K.lime : "rgba(255,255,255,.85)", textShadow: tm.res ? GLOW_LT : "none", whiteSpace: "nowrap", marginTop: Math.round(fs * 0.12) }, tm.l || "");
    // o.units: la quantità disegnata come mini-reel 9:16 a destra (5 → cinque reel): riempie la riga e rende concreto il numero
    if (o.units && !tm.res) {
      const nU = Math.min(12, Number(tm.v) || 0), uw0 = Math.round(fs * (o.unit || 0.2)), uh0 = Math.round(uw0 * 1.62), ug = Math.round(uw0 * 0.3);
      const per = nU > 6 ? Math.ceil(nU / 2) : nU;
      const uw = el(rowEl, { marginLeft: "auto", display: "flex", flexWrap: "wrap", gap: ug, width: per * uw0 + (per - 1) * ug, justifyContent: "flex-end" });
      for (let q = 0; q < nU; q++) el(uw, { width: uw0, height: nU > 6 ? Math.round(uh0 * 0.8) : uh0, borderRadius: Math.round(uw0 * 0.22), background: "linear-gradient(180deg,#e6ff94,#CFFB50 55%,#b6e23c)", boxShadow: `${GLOW_A(0.45)}, inset 0 1.5px 0 rgba(255,255,255,.6)` }, `<div style="width:0;height:0;margin:${Math.round(uh0 * 0.3)}px auto 0;border-top:${Math.round(uw0 * 0.2)}px solid transparent;border-bottom:${Math.round(uw0 * 0.2)}px solid transparent;border-left:${Math.round(uw0 * 0.3)}px solid rgba(30,30,30,.55)"></div>`);
    }
    // tm.tag: etichetta sulla riga del risultato (es. "≈ 1 anno"), lega il numero al titolo
    if (tm.res && tm.tag) el(rowEl, { marginLeft: "auto", display: "flex", alignItems: "center", gap: Math.round(fs * 0.07), padding: `${Math.round(fs * 0.06)}px ${Math.round(fs * 0.13)}px`, borderRadius: Math.round(fs * 0.12), border: `3px solid ${K.lime}`, boxShadow: GLOW_A(0.4), fontFamily: FS, fontWeight: 800, fontSize: Math.round(fs * 0.21), color: K.lime, textShadow: GLOW_LT, whiteSpace: "nowrap", flexShrink: 0 }, svg(tm.icon || "calendar", Math.round(fs * 0.21), K.lime, 2.4) + tm.tag);
    if (opTxt === "=" || tm.res) el(box, { position: "absolute", left: Math.round(fs * 0.4), top: y - 6, width: w - Math.round(fs * 0.8), height: 3, borderRadius: 2, background: "rgba(255,255,255,.55)" });
    gsap.set(rowEl, { opacity: 0, filter: "blur(10px)", x: 30 });
    items.push({ col: rowEl, big, lab, tm });
    pendingOp = null;
    r++;
  });
  let shown = false;
  const show = (i, t, dur) => {
    if (!shown) { tl.to(box, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }, t - 0.1); shown = true; }
    const it = items[i];
    tl.to(it.col, { opacity: 1, filter: "blur(0px)", x: 0, duration: 0.32, ease: "power3.out" }, t);
    tl.set(it.col, { filter: "none" }, t + 0.33);
    if (it.tm.res) {
      const to = Number(String(it.tm.v).replace(/\D/g, "")) || 0;
      const P = { v: 0 };
      tl.to(P, { v: to, duration: dur || 0.7, ease: "power1.out", onUpdate: () => (it.big.textContent = itNum(P.v) + (it.tm.suffix || "")) }, t);
      const te = t + (dur || 0.7);
      tl.to(it.big, { boxShadow: "0 0 30px rgba(207,251,80,1), 0 0 120px rgba(207,251,80,.75), inset 0 2px 0 rgba(255,255,255,.6)", scale: 1.06, duration: 0.08, ease: "power2.out" }, te);
      tl.to(it.big, { boxShadow: `${GLOW_A(0.9)}, inset 0 2px 0 rgba(255,255,255,.6)`, scale: 1, duration: 0.4, ease: "power2.out" }, te + 0.09);
    }
  };
  return { box, items, show, W: w, H };
};

// ═══ U03 · cursore che si muove e clicca ══════════════════════════════════════════════════
const cursor = (parent, x, y, o) => {
  o = o || {};
  const s = o.size || 64;
  const c = el(parent, { position: "absolute", left: 0, top: 0, width: s, height: s, zIndex: o.z || 70, pointerEvents: "none" },
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.2 L18 14.2 Z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>`);
  c.style.filter = "drop-shadow(0 6px 10px rgba(0,0,0,.55))";
  gsap.set(c, { x: x - s * 0.17, y: y - s * 0.1, opacity: 0 });
  let cx0 = x, cy0 = y;
  return {
    c,
    show: (t) => tl.to(c, { opacity: 1, duration: 0.15 }, t),
    hide: (t) => tl.to(c, { opacity: 0, duration: 0.2 }, t),
    // ease in coda (blocco 1 del rifacimento: il cursore di Kallaway frena all'arrivo, reel 65 e 133); default di prima power3.inOut
    moveTo: (t, x2, y2, dur, ease) => { tl.to(c, { x: x2 - s * 0.17, y: y2 - s * 0.1, duration: dur || 0.45, ease: ease || "power3.inOut" }, t); cx0 = x2; cy0 = y2; },
    click: (t) => {
      tl.to(c, { scale: 0.82, duration: 0.07, ease: "power2.out", transformOrigin: "17% 10%" }, t);
      tl.to(c, { scale: 1, duration: 0.18, ease: "back.out(3)" }, t + 0.08);
      ripple(parent, cx0, cy0, t + 0.04, { r: 46, s0: 0.3, s1: 1.3, w: 3, dur: 0.4, color: "#ffffff", glow: false, z: (o.z || 70) - 1 });
    },
  };
};

// ═══ O13 · cervello luminoso ══════════════════════════════════════════════════════════════
// Oggetto vero, non un'icona (regola dell'utente per tutti gli oggetti-metafora): cervello a raggi X di Adobe Stock 318556173
// scontornato con Photoshop → _tools/oggetto_da_stock.py → assets/obj/cervello.png (bianco) + cervello_lime.png (acceso).
// Il vecchio cervello procedurale è in assets/obj_archivio/. .on() lo accende di lime con neuroni e alone.
const brain = (parent, cx, cy, size, o) => {
  o = o || {};
  const g = el(parent, { position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, zIndex: o.z || 12 });
  const halo = el(g, { position: "absolute", left: -size * 0.2, top: -size * 0.2, width: size * 1.4, height: size * 1.4, borderRadius: "50%", background: "radial-gradient(circle, rgba(207,251,80,.34) 0%, rgba(207,251,80,.10) 40%, rgba(207,251,80,0) 68%)", opacity: 0 });
  const base = el(g, { position: "absolute", left: 0, top: 0, width: size, height: size });
  imgIn(base, o.img || "obj-cervello");
  const lit = el(g, { position: "absolute", left: 0, top: 0, width: size, height: size, opacity: 0 });
  imgIn(lit, o.imgOn || "obj-cervello_lime");
  const N = [[0.30, 0.30], [0.46, 0.22], [0.62, 0.27], [0.38, 0.44], [0.56, 0.42], [0.72, 0.40], [0.28, 0.52], [0.48, 0.56]].map(([u, v]) =>
    el(g, { position: "absolute", left: size * u - 6, top: size * v - 6, width: 12, height: 12, borderRadius: "50%", background: "#fff", boxShadow: "0 0 12px #fff, 0 0 26px rgba(207,251,80,.8)", opacity: 0 }));
  // lampo dello strobo: copia accesa, più luminosa, sopra al cervello (si vede solo per 2 fotogrammi)
  const fla = el(g, { position: "absolute", left: 0, top: 0, width: size, height: size, opacity: 0, filter: "brightness(1.75) drop-shadow(0 0 24px rgba(207,251,80,.9))" });
  imgIn(fla, o.imgOn || "obj-cervello_lime");
  const F1 = 1 / 30;
  return {
    g, halo,
    on: (t) => { tl.to([lit, halo], { opacity: 1, duration: 0.3 }, t); tl.to(base, { opacity: 0, duration: 0.3 }, t); N.forEach((d, i) => { tl.to(d, { opacity: 1, duration: 0.08 }, t + 0.05 + i * 0.04); tl.to(d, { opacity: 0.35, duration: 0.4 }, t + 0.3 + i * 0.04); }); },
    off: (t) => { tl.to([lit, halo], { opacity: 0, duration: 0.3 }, t); tl.to(base, { opacity: 1, duration: 0.3 }, t); tl.to(N, { opacity: 0, duration: 0.2 }, t); },
    spark: (t) => N.forEach((d, i) => { tl.to(d, { opacity: 1, duration: 0.06 }, t + ((hash(i, 3) + 1) / 2) * 0.5); tl.to(d, { opacity: 0, duration: 0.3 }, t + 0.1 + ((hash(i, 3) + 1) / 2) * 0.5); }),
    // ── il battito di Kallaway, misurato fotogramma per fotogramma (sessione 4): nessun "tum-tum" periodico, tre gesti ──
    // .accendi (reel 48, 1,67–1,84 s): acceso e spento si alternano a OGNI fotogramma per ~0,17 s (o.n = 5 fotogrammi a
    // 30 fps), poi resta acceso fisso con l'alone; i neuroni scintillano
    accendi: (t, o2) => {
      o2 = o2 || {};
      const n = o2.n || 5;
      for (let k = 0; k < n; k++) { tl.set(lit, { opacity: k % 2 ? 0 : 1 }, t + k * F1); tl.set(base, { opacity: k % 2 ? 1 : 0 }, t + k * F1); }
      tl.set(lit, { opacity: 1 }, t + n * F1);
      tl.set(base, { opacity: 0 }, t + n * F1);
      tl.to(halo, { opacity: 1, duration: 0.12 }, t + n * F1);
      N.forEach((d, i) => { tl.to(d, { opacity: 1, duration: 0.06 }, t + n * F1 + i * 0.03); tl.to(d, { opacity: 0.35, duration: 0.4 }, t + n * F1 + 0.2 + i * 0.03); });
    },
    // .disco (reel 79, 1,21–1,6 s): dietro al cervello nasce un disco già a metà misura, arriva pieno in ~0,12 s e svanisce
    // allargandosi (~0,35 s). Da noi è grafite con l'anello lime pieno (il disco lime pieno coprirebbe il cervello lime).
    // o: { r (0,62 · size), z } → il disco
    disco: (t, o2) => {
      o2 = o2 || {};
      const R = o2.r || size * 0.62, X = cx, Y = cy + size * 0.02;
      const d = el(parent, { position: "absolute", left: X - R, top: Y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, rgba(58,58,58,.55) 0%, rgba(26,26,26,.6) 70%, rgba(20,20,20,.65) 100%)", border: `${Math.max(4, Math.round(R * 0.022))}px solid ${K.lime}`, boxShadow: `${GLOW_A(1)}, inset 0 0 0 3px rgba(255,255,255,.85)`, opacity: 0, zIndex: (o2.z || o.z || 12) - 1, pointerEvents: "none" });
      d.setAttribute("data-layout-allow-overlap", "");
      gsap.set(d, { scale: 0.45 });
      tl.set(d, { opacity: 1 }, t);
      tl.to(d, { scale: 1, duration: 0.12, ease: "expo.out" }, t);
      tl.to(d, { scale: 1.16, opacity: 0, duration: 0.35, ease: "power1.in" }, t + 0.12);
      return d;
    },
    // .strobo (reel 62, 2,97–3,60 s): lampi di 2 fotogrammi ogni 0,30 s (o.n = 3), un'onda lime si allarga dopo il primo
    strobo: (t, o2) => {
      o2 = o2 || {};
      const n = o2.n || 3, per = o2.periodo || 0.3;
      for (let k = 0; k < n; k++) { tl.set(fla, { opacity: 1 }, t + k * per); tl.set(fla, { opacity: 0 }, t + k * per + 2 * F1); }
      ripple(parent, cx, cy, t + 2 * F1, { r: size * 0.5, s0: 0.55, s1: 1.5, w: 5, dur: 0.5, z: (o.z || 12) + 2 });
      return t + (n - 1) * per + 2 * F1;
    },
    // si spegne: torna bianco e si abbassa (o.dim = luminosità finale, 0,62)
    spegni: (t, o2) => {
      o2 = o2 || {};
      tl.to([lit, halo], { opacity: 0, duration: 0.35 }, t);
      tl.to(base, { opacity: 1, duration: 0.35 }, t);
      tl.to(N, { opacity: 0, duration: 0.2 }, t);
      if (o2.dim !== false) tl.to(g, { filter: `brightness(${o2.dim || 0.62}) saturate(.4)`, duration: 0.4 }, t);
    },
  };
};

// ═══ O14 · slot machine (reel 79 e 118 di Kallaway) ═════════════════════════════════════════
// Oggetto vero: Adobe Stock 730774093 scontornato con Photoshop e portato in grafite da _tools/oggetti_adobe.py (testi
// inventati dall'IA ripuliti, finestre dei rulli vuote, leva tolta). Rulli, luci e leva sono del kit: .spin() fa girare
// i rulli (sfocati) e li ferma sui simboli, .pull() tira la leva (pomo lime), .win() accende la riga vincente e le luci.
// Simboli: nomi di icone Lucide, testo breve o id del pool ("av-…", "th-…"); o.reels = 3 liste (default: ricompense IG).
// SLOT_GEO = frazioni dell'immagine stampate da oggetti_adobe.py: se si rifà l'asset, vanno aggiornate.
const SLOT_GEO = {
  ratio: 0.7008, reels: [[0.2596, 0.2138, 0.3718, 0.4801], [0.4218, 0.2138, 0.536, 0.4801], [0.5842, 0.2138, 0.6982, 0.4801]],
  pomo: [0.936, 0.4294, 0.0538], perno: [0.9276, 0.7616], asta: [0.9276, 0.466], luci: [[0.1897, 0.6447, 0.3706, 0.6845], [0.4245, 0.6447, 0.5866, 0.6845]],
};
const slotCell = (parent, y, w, h, s) => {
  const c = el(parent, { position: "absolute", left: 0, top: y, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "2px solid rgba(0,0,0,.14)", background: "linear-gradient(90deg, #c9ccc4 0%, #f3f4ef 28%, #f7f8f3 50%, #f3f4ef 72%, #c9ccc4 100%)" });
  const m = Math.min(w, h);
  if (/^(av|th|obj)-/.test(s)) { const d = el(c, { position: "relative", width: m * 0.74, height: m * 0.74, borderRadius: "50%", overflow: "hidden", border: `3px solid ${K.ink}` }); imgIn(d, s, { objectFit: "cover" }); }
  else if (ICON[s]) c.innerHTML = svg(s, Math.round(m * 0.62), K.ink, 2.5);
  else el(c, { fontFamily: FD, fontWeight: 700, fontSize: Math.round(Math.min(h * 0.42, (w * 1.75) / Math.max(1, s.length))), color: K.ink, whiteSpace: "nowrap", lineHeight: 1 }, s);
  return c;
};
const slotMachine = (parent, cx, cy, h, o) => {
  o = o || {};
  const G = SLOT_GEO, W = Math.round(h * G.ratio), x0 = cx - W / 2, y0 = cy - h / 2;
  const g = layered(el(parent, { position: "absolute", left: x0, top: y0, width: W, height: h, zIndex: o.z || 12 }));
  // controluce: stacca la lacca nera dallo sfondo scuro
  el(g, { position: "absolute", left: -W * 0.3, top: -h * 0.12, width: W * 1.6, height: h * 1.24, background: "radial-gradient(ellipse 50% 50% at 50% 42%, rgba(255,255,255,.09), rgba(255,255,255,0) 70%)" });
  const halo = el(g, { position: "absolute", left: -W * 0.35, top: -h * 0.15, width: W * 1.7, height: h * 1.3, background: `radial-gradient(ellipse 50% 50% at 50% 40%, ${rgba(K.lime, 0.3)}, ${rgba(K.lime, 0.08)} 45%, rgba(207,251,80,0) 70%)`, opacity: 0 });
  const body = el(g, { position: "absolute", left: 0, top: 0, width: W, height: h, filter: "drop-shadow(0 30px 60px rgba(0,0,0,.6))" });
  imgIn(body, o.img || "obj-slot");
  const SYM = o.reels || [["heart", "message-circle", "user-plus", "send", "bookmark", "eye"], ["eye", "heart", "bookmark", "message-circle", "send", "user-plus"], ["user-plus", "send", "heart", "eye", "message-circle", "bookmark"]];
  const R = 7; // ripetizioni della striscia: bastano per un giro lungo, poi .spin() la riporta in cima
  const reels = G.reels.map(([u0, v0, u1, v1], i) => {
    const rw = (u1 - u0) * W, rh = (v1 - v0) * h, ch = rh / 3, list = SYM[i % SYM.length], N = list.length;
    const win = el(g, { position: "absolute", left: u0 * W, top: v0 * h, width: rw, height: rh, overflow: "hidden", background: "#e9ebe4" });
    const strip = el(win, { position: "absolute", left: 0, top: 0, width: rw, height: ch * N * R });
    for (let r = 0; r < R; r++) list.forEach((s, k) => slotCell(strip, (r * N + k) * ch, rw, ch, s));
    // cilindro: ombra sopra e sotto, riflesso obliquo del vetro
    el(win, { position: "absolute", left: 0, top: 0, width: rw, height: rh, background: "linear-gradient(180deg, rgba(0,0,0,.74) 0%, rgba(0,0,0,.2) 22%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 62%, rgba(0,0,0,.2) 78%, rgba(0,0,0,.74) 100%)" });
    el(win, { position: "absolute", left: 0, top: 0, width: rw, height: rh, background: "linear-gradient(104deg, rgba(255,255,255,0) 28%, rgba(255,255,255,.18) 40%, rgba(255,255,255,0) 52%)" });
    const frame = el(win, { position: "absolute", left: 0, top: ch, width: rw, height: ch, boxSizing: "border-box", border: `4px solid ${K.lime}`, boxShadow: `inset 0 0 16px ${rgba(K.lime, 0.55)}`, opacity: 0 });
    const k0 = o.start ? o.start[i] : i;
    const st = { win, strip, ch, N, frame, idx: (R - 2) * N + k0 }; // cella al centro della finestra
    tl.set(strip, { y: -(st.idx - 1) * ch, filter: "blur(0px)" }, 0);
    return st;
  });
  const luci = G.luci.map(([u0, v0, u1, v1]) => el(g, { position: "absolute", left: u0 * W, top: v0 * h, width: (u1 - u0) * W, height: (v1 - v0) * h, borderRadius: 4, background: `linear-gradient(180deg, #f4ffd6 0%, ${K.lime} 38%, ${K.lime} 100%)`, boxShadow: GLOW_L(0.8), opacity: 0 }));
  // leva del kit: asta cromata + pomo lime (la foto non ce l'ha più)
  const [pu, pv] = G.perno, [, av] = G.asta, [ku, kv, kr] = G.pomo;
  const rodW = W * 0.03, rodH = (pv - av) * h, KR = kr * W;
  const rod = el(g, { position: "absolute", left: pu * W - rodW / 2, top: av * h, width: rodW, height: rodH, borderRadius: rodW / 2, background: "linear-gradient(90deg, #2c2c2c 0%, #cfcfcf 34%, #ffffff 47%, #8c8c8c 70%, #262626 100%)", transformOrigin: "50% 100%" });
  const knob = el(g, { position: "absolute", left: ku * W - KR, top: kv * h - KR, width: 2 * KR, height: 2 * KR, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #ffffff 0%, #f4ffd6 12%, ${K.lime} 44%, #a6cc35 100%)`, boxShadow: `0 10px 24px rgba(0,0,0,.55), ${GLOW_L(0.45)}` });
  const blink = (t, dur, step) => {
    for (let k = 0; k * step < dur; k++) luci.forEach((l, j) => tl.set(l, { opacity: (k + j) % 2 ? 0.25 : 1 }, t + k * step));
    tl.set(luci, { opacity: 0 }, t + dur);
  };
  return {
    g, W, H: h, reels, rect: [x0 - W * 0.02, y0, x0 + W * 1.02, y0 + h],
    knobXY: () => [x0 + ku * W, y0 + kv * h],
    // tira la leva: l'asta ruota verso chi guarda (si accorcia), il pomo scende e si avvicina
    pull: (t) => {
      tl.to(rod, { scaleY: 0.1, duration: 0.26, ease: "power2.in" }, t);
      tl.to(knob, { y: rodH * 0.9, scale: 1.2, duration: 0.26, ease: "power2.in" }, t);
      tl.to(rod, { scaleY: 1, duration: 0.6, ease: "back.out(1.8)" }, t + 0.34);
      tl.to(knob, { y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" }, t + 0.34);
    },
    // stops = indice del simbolo su cui si ferma ogni rullo, oppure il nome di un simbolo (tris: vince); giri interi
    // prima di fermarsi; le luci lampeggiano finché gira. Restituisce l'istante dell'ultimo stop (→ .win()).
    spin: (t, stops, oo) => {
      oo = oo || {};
      const dur = oo.dur || 1.1, stag = oo.stagger == null ? 0.28 : oo.stagger, giri = Math.min(4, oo.giri || 3);
      if (typeof stops === "string") { const nome = stops; stops = reels.map((r, i) => Math.max(0, SYM[i % SYM.length].indexOf(nome))); }
      reels.forEach((r, i) => {
        const k = stops[i] % r.N, cur = r.idx % r.N, d = giri * r.N + ((cur - k + r.N) % r.N);
        const end = r.idx - d, ti = dur + i * stag;
        tl.to(r.strip, { y: -(r.idx - 1) * r.ch - r.ch * 0.22, duration: 0.12, ease: "power2.out" }, t);   // carica
        tl.to(r.strip, { y: -(end - 1) * r.ch, duration: ti, ease: "back.out(1.25)" }, t + 0.12);
        tl.to(r.strip, { filter: "blur(5px)", duration: 0.1, ease: "power1.in" }, t + 0.12);
        tl.to(r.strip, { filter: "blur(0px)", duration: 0.22, ease: "power1.out" }, t + 0.12 + ti * 0.55);
        // a giro finito la striscia torna in cima alla stessa cella (contenuto identico): un altro spin è possibile
        r.idx = (R - 2) * r.N + k;
        tl.set(r.strip, { y: -(r.idx - 1) * r.ch }, t + 0.14 + ti);
      });
      const stop = t + 0.12 + dur + (reels.length - 1) * stag;   // istante dell'ultimo stop
      if (oo.luci !== false) blink(t, stop - t, 0.12);
      return stop;
    },
    win: (t) => {
      reels.forEach((r, i) => { tl.to(r.frame, { opacity: 1, duration: 0.12 }, t + i * 0.06); });
      tl.to(luci, { opacity: 1, duration: 0.1 }, t);
      tl.to(halo, { opacity: 1, duration: 0.3 }, t);
      tl.to(knob, { boxShadow: `0 10px 24px rgba(0,0,0,.55), ${GLOW_L(1)}`, duration: 0.3 }, t);
    },
    unwin: (t) => {
      tl.to(reels.map((r) => r.frame), { opacity: 0, duration: 0.25 }, t);
      tl.to([...luci, halo], { opacity: 0, duration: 0.3 }, t);
    },
    lights: (t, dur) => blink(t, dur || 1, 0.14),
  };
};

// ═══ fotocamera vera (script 24/09 "davanti alla telecamera" e 11/10 "non è la fotocamera") ═══════════
// Adobe Stock 285265822 (mirrorless argento, obiettivo verso chi guarda), colori veri appena desaturati.
// .rec() accende la spia rossa (lampeggia per dur s), .shutter() scatta (il vetro si chiude + lampo), .glint() riflesso
// che passa sul vetro, .lens() = centro e raggio del vetro nel mondo (entrare nell'obiettivo: match cut sul nero).
const CAM_GEO = { ratio: 1.3707, vetro: [0.2707, 0.6476, 0.1039], rec: [0.7601, 0.2946] };
const fotocamera = (parent, cx, cy, w, o) => {
  o = o || {};
  const G = CAM_GEO, h = Math.round(w / G.ratio), x0 = cx - w / 2, y0 = cy - h / 2;
  const g = layered(el(parent, { position: "absolute", left: x0, top: y0, width: w, height: h, zIndex: o.z || 12 }));
  el(g, { position: "absolute", left: -w * 0.15, top: -h * 0.2, width: w * 1.3, height: h * 1.4, background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,.07), rgba(255,255,255,0) 70%)" });
  const body = el(g, { position: "absolute", left: 0, top: 0, width: w, height: h, filter: "drop-shadow(0 34px 50px rgba(0,0,0,.6))" });
  imgIn(body, o.img || "obj-fotocamera");
  const [vu, vv, vr] = G.vetro, R = vr * w, LX = vu * w, LY = vv * h;
  const glass = el(g, { position: "absolute", left: LX - R, top: LY - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden" });
  const sweep = el(glass, { position: "absolute", left: -2 * R, top: -R, width: R * 0.9, height: R * 4, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))", transform: "rotate(28deg)", opacity: 0.9 });
  const iris = el(glass, { position: "absolute", left: 0, top: 0, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle, #040404 0%, #0a0a0a 72%, #1b1b1b 100%)" });
  tl.set(iris, { scale: 0 }, 0);
  const flash = el(g, { position: "absolute", left: LX - R * 2.6, top: LY - R * 2.6, width: R * 5.2, height: R * 5.2, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.35) 28%, rgba(255,255,255,0) 64%)", opacity: 0 });
  const [ru, rv] = G.rec, rr = Math.max(6, w * 0.012);
  const rec = el(g, { position: "absolute", left: ru * w - rr, top: rv * h - rr, width: 2 * rr, height: 2 * rr, borderRadius: "50%", background: "#ff3b30", boxShadow: "0 0 10px #ff3b30, 0 0 28px rgba(255,59,48,.75)", opacity: 0 });
  return {
    g, W: w, H: h, rect: [x0, y0, x0 + w, y0 + h],
    lens: () => ({ x: x0 + LX, y: y0 + LY, r: R }),
    rec: (t, dur) => {
      tl.to(rec, { opacity: 1, duration: 0.06 }, t);
      for (let k = 0.6; k < (dur || 0); k += 1) { tl.to(rec, { opacity: 0.2, duration: 0.2 }, t + k); tl.to(rec, { opacity: 1, duration: 0.2 }, t + k + 0.45); }
    },
    recOff: (t) => tl.to(rec, { opacity: 0, duration: 0.15 }, t),
    glint: (t, dur) => tl.fromTo(sweep, { x: 0 }, { x: R * 4.4, duration: dur || 0.9, ease: "power2.inOut", immediateRender: false }, t),
    shutter: (t) => {
      tl.to(iris, { scale: 1, duration: 0.07, ease: "power2.in" }, t);
      tl.to(iris, { scale: 0, duration: 0.18, ease: "power2.out" }, t + 0.11);
      tl.to(flash, { opacity: 1, duration: 0.04 }, t + 0.08);
      tl.to(flash, { opacity: 0, duration: 0.45, ease: "power2.out" }, t + 0.14);
    },
  };
};

// ═══ faro da studio con fascio di luce (script 11/10 "è dove metti la luce") ═════════════════════════
// Adobe Stock 329591900 (flash con alette), metallo neutro; faro_on.png = parabola incandescente. Il fascio è del kit,
// bianco caldo in screen (mai lime trasparente: diventa oliva). La parabola guarda in alto a destra (asse -27°): il soggetto
// da illuminare va lì, oppure o.flip = specchiato (fascio in alto a sinistra). o.len = lunghezza del fascio, o.spread = apertura.
const FARO_GEO = { ratio: 1.0368, parabola: [0.597, 0.4031], semiasse: 0.1268, ang: -27.2 };
const faro = (parent, cx, cy, w, o) => {
  o = o || {};
  const G = FARO_GEO, h = Math.round(w / G.ratio), x0 = cx - w / 2, y0 = cy - h / 2;
  const g = layered(el(parent, { position: "absolute", left: x0, top: y0, width: w, height: h, zIndex: o.z || 12, transform: o.flip ? "scaleX(-1)" : "none" }));
  const body = el(g, { position: "absolute", left: 0, top: 0, width: w, height: h, filter: "drop-shadow(0 30px 50px rgba(0,0,0,.6))" });
  imgIn(body, o.img || "obj-faro");
  const lit = el(g, { position: "absolute", left: 0, top: 0, width: w, height: h, opacity: 0 });
  imgIn(lit, o.imgOn || "obj-faro_on");
  const BX = G.parabola[0] * w, BY = G.parabola[1] * h, dir = o.dir == null ? G.ang : o.dir, len = o.len || w * 2.3;
  const s0 = 2 * G.semiasse * w * 0.9, s1 = s0 + 2 * len * Math.tan(((o.spread || 12) * Math.PI) / 180);
  // fascio: involucro sfocato (bordi morbidi) > trapezio con gradiente; il nucleo è più stretto e più chiaro
  const beam = el(g, { position: "absolute", left: BX, top: BY - s1 / 2, width: len, height: s1, transformOrigin: `0px ${s1 / 2}px`, opacity: 0, mixBlendMode: "screen", pointerEvents: "none" });
  const cone = (k, a0, blur) => {
    const wrap = el(beam, { position: "absolute", left: 0, top: 0, width: len, height: s1, filter: `blur(${blur}px)` });
    const e0 = (s0 * k) / 2, e1 = (s1 * k) / 2, m = s1 / 2;
    el(wrap, { position: "absolute", left: 0, top: 0, width: len, height: s1, clipPath: `polygon(0px ${m - e0}px, ${len}px ${m - e1}px, ${len}px ${m + e1}px, 0px ${m + e0}px)`, background: `linear-gradient(90deg, rgba(255,252,236,${a0}) 0%, rgba(255,252,236,${(a0 * 0.4).toFixed(3)}) 50%, rgba(255,252,236,0) 100%)` });
  };
  cone(1, 0.42, 16);
  cone(0.55, 0.5, 8);
  tl.set(beam, { rotation: dir }, 0);
  const halo = el(g, { position: "absolute", left: BX - s0 * 1.1, top: BY - s0 * 1.1, width: s0 * 2.2, height: s0 * 2.2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,.75) 0%, rgba(244,255,214,.35) 30%, ${rgba(K.lime, 0.1)} 52%, rgba(207,251,80,0) 70%)`, opacity: 0, mixBlendMode: "screen" });
  const fl = (t, els, a) => { tl.to(els, { opacity: a, duration: 0.05 }, t); tl.to(els, { opacity: a * 0.3, duration: 0.05 }, t + 0.07); tl.to(els, { opacity: a, duration: 0.06 }, t + 0.14); };
  return {
    g, W: w, H: h, rect: [x0, y0, x0 + w, y0 + h],
    // punto del mondo a frazione f del fascio (dove mettere ciò che viene illuminato)
    target: (f) => {
      const d = len * (f == null ? 0.8 : f), a = (dir * Math.PI) / 180, lx = BX + Math.cos(a) * d, ly = BY + Math.sin(a) * d;
      return [x0 + (o.flip ? w - lx : lx), y0 + ly];
    },
    // sogg = elementi illuminati dal fascio: restano in penombra finché il faro non si accende
    on: (t, sogg) => {
      fl(t, lit, 1); fl(t + 0.02, [halo, beam], 1);
      if (sogg) { tl.set(sogg, { filter: "brightness(0.32) saturate(0.6)" }, 0); tl.to(sogg, { filter: "brightness(1.06) saturate(1)", duration: 0.3, ease: "power2.out" }, t + 0.16); }
    },
    off: (t) => tl.to([lit, halo, beam], { opacity: 0, duration: 0.25 }, t),
    // il fascio respira appena (luce viva) tra t0 e t1
    live: (t0, t1) => { for (let k = 0, t = t0; t < t1; k++, t += 0.6) tl.to(beam, { opacity: 0.86 + 0.14 * ((hash(k, 7) + 1) / 2), duration: 0.6, ease: "sine.inOut" }, t); },
  };
};

// ═══ O18 · tubo al neon che si disegna + riflesso che corre ═══════════════════════════════
// d = path SVG (coordinate del parent); o: { w (spessore), color, z, x0,y0,W,H (area svg), drawn (già disegnato), molecole }
// → { S, L, path, draw(t, dur), glint(t, giro, n), glintTo(t, da, a, dur) }
// Il tubo è cilindrico (reel 16 di Kallaway: tubo lucido in 3D): bordo scuro, corpo, anima chiara e filo speculare
// bianco, più il bagliore. Il riflesso è una cometa (testa bianca + scia) che corre dentro il tubo.
const neonPath = (parent, d, o) => {
  o = o || {};
  const w = o.w || 34, col = o.color || K.lime, lime = !o.color || o.color === K.lime;
  const S = svgLayer(parent, o.z || 8, o.x0 == null ? -60000 : o.x0, o.y0 == null ? -60000 : o.y0, o.W || 200000, o.H || 200000);
  const st = (c, sw, op) => ({ fill: "none", stroke: c, "stroke-width": sw, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: op });
  const glowP = pathEl(S, d, st(col, w + 34, 0.2));
  glowP.style.filter = "blur(18px)";
  const edge = pathEl(S, d, st(lime ? "#86a82e" : col, w, 1));
  edge.style.filter = `drop-shadow(0 0 12px ${lime ? "rgba(207,251,80,.75)" : col})`;
  const body = pathEl(S, d, st(col, w * 0.74, 1));
  const core = pathEl(S, d, st(lime ? "#efffc2" : "#ffffff", w * 0.36, 0.92));
  // o.molecole: molecole di dopamina dentro il tubo (anello esagonale + due OH + catena), linee scure sul lime (reel 79)
  let mol = null;
  if (o.molecole) {
    const pid = "mol" + ++SVGN, r = Math.max(5, w * 0.13), tw = w * 1.25, th = w * 1.05;
    const hex = (x, y, a) => { let q = ""; for (let k = 0; k < 6; k++) { const an = a + (k * Math.PI) / 3; q += `${k ? "L" : "M"}${(x + r * Math.cos(an)).toFixed(1)} ${(y + r * Math.sin(an)).toFixed(1)}`; } return q + "Z"; };
    const arm = (x, y, a, k, len) => { const an = a + (k * Math.PI) / 3, x1 = x + r * Math.cos(an), y1 = y + r * Math.sin(an); return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${(x1 + len * Math.cos(an)).toFixed(1)} ${(y1 + len * Math.sin(an)).toFixed(1)}`; };
    const chain = (x, y, a) => { const an = a + Math.PI, x1 = x + r * Math.cos(an), y1 = y + r * Math.sin(an); let q = `M${x1.toFixed(1)} ${y1.toFixed(1)}`, cx = x1, cy = y1; for (let k = 0; k < 3; k++) { const b2 = an + (k % 2 ? 0.5 : -0.5); cx += r * Math.cos(b2); cy += r * Math.sin(b2); q += `L${cx.toFixed(1)} ${cy.toFixed(1)}`; } return q; };
    const mol1 = (x, y, a) => hex(x, y, a) + arm(x, y, a, 0, r * 0.8) + arm(x, y, a, 1, r * 0.8) + chain(x, y, a);
    S._defs.insertAdjacentHTML("beforeend", `<pattern id="${pid}" patternUnits="userSpaceOnUse" width="${tw.toFixed(1)}" height="${th.toFixed(1)}"><path d="${mol1(tw * 0.3, th * 0.32, 0.3)}${mol1(tw * 0.78, th * 0.78, 2.1)}" fill="none" stroke="rgba(48,66,6,.5)" stroke-width="${Math.max(1.4, w * 0.035).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"/></pattern>`);
    mol = pathEl(S, d, st(`url(#${pid})`, w * 0.66, 1));
  }
  const spec = pathEl(S, d, st("#ffffff", Math.max(2.5, w * 0.11), 0.8));
  const parts = [glowP, edge, body, core, mol, spec].filter(Boolean);
  const L = glowP.getTotalLength();
  // o.drawn: il tubo c'è già (niente tratteggio da disegnare)
  if (!o.drawn) parts.forEach(drawable);
  // cometa: alone largo, scia, testa (le tre hanno il bordo d'attacco allineato)
  const gl = Math.max(30, L * 0.035);
  const com = [[w * 1.5, gl * 2.6, 0.22, "blur(10px)"], [w * 0.62, gl * 2.2, 0.55, "blur(3px)"], [w * 0.4, gl, 1, "blur(1.5px)"]].map(([sw, D, op, f]) => {
    const p = pathEl(S, d, st("#ffffff", sw, 0));
    p.setAttribute("stroke-dasharray", `${D.toFixed(1)} ${Math.max(1, L - D).toFixed(1)}`); // periodo = L: il giro si chiude senza salti
    p.style.filter = f;
    return { p, D, op };
  });
  return {
    S, L, path: body,
    // blocco C1 (copia del reel 79, opzione in coda): ease della tracciatura; senza, "none" come prima
    draw: (t, dur, ease) => { parts.forEach((p) => drawOn(p, t, dur || 1.8, ease || "none")); },
    // K17 · il riflesso corre da una lunghezza del tracciato all'altra (anche all'indietro), con la testa davanti
    glintTo: (t, h0, h1, dur, ease) => {
      const back = h1 < h0;
      com.forEach(({ p, D, op }) => {
        const off = (h) => (back ? -h : D - h);
        tl.set(p, { attr: { opacity: op } }, t);
        tl.fromTo(p, { attr: { "stroke-dashoffset": off(h0) } }, { attr: { "stroke-dashoffset": off(h1) }, duration: dur, ease: ease || "power2.inOut", immediateRender: false }, t);
        tl.to(p, { attr: { opacity: 0 }, duration: 0.25 }, t + dur);
      });
    },
    // il riflesso fa n giri (giro = durata) a partire da t
    glint: (t, giro, n) => {
      const g = giro || 1.6, k = n || 1;
      com.forEach(({ p, D, op }) => {
        tl.set(p, { attr: { opacity: op } }, t);
        tl.fromTo(p, { attr: { "stroke-dashoffset": D } }, { attr: { "stroke-dashoffset": D - L * k }, duration: g * k, ease: "none", immediateRender: false }, t);
        tl.set(p, { attr: { opacity: 0 } }, t + g * k);
      });
    },
  };
};

// ═══ L04 · checklist con spunte ════════════════════════════════════════════════════════════
// (reel 50 di Kallaway) righe scure con l'accento a sinistra, casella grande; la voce non ancora detta è sfocata e va a
// fuoco quando viene spuntata (o.blurUntilTick). .tick(i, t): la spunta si disegna, casella e riga si accendono.
const checklist = (parent, cx, cy, w, items, o) => {
  o = o || {};
  const h = o.h || 128, gap = o.gap || 22, fs = o.fs || 42, cb = Math.round(h * 0.44);
  const top = cy - (items.length * h + (items.length - 1) * gap) / 2;
  const rows = items.map((txt, i) => {
    const r = el(parent, { position: "absolute", left: cx - w / 2, top: top + i * (h + gap), width: w, height: h, borderRadius: 18, background: "linear-gradient(90deg,#2c2c2c,#202020)", border: "1.5px solid rgba(255,255,255,.1)", boxShadow: "0 18px 44px rgba(0,0,0,.5), inset 0 1.5px 0 rgba(255,255,255,.07)", overflow: "hidden", zIndex: o.z || 12 });
    const lit = el(r, { position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.02))", opacity: 0 });
    el(r, { position: "absolute", left: 0, top: 0, width: 9, height: h, background: K.lime, boxShadow: GLOW_A(0.5) });
    const bx = el(r, { position: "absolute", left: 38, top: h / 2 - cb / 2, width: cb, height: cb, borderRadius: Math.round(cb * 0.24), border: "3.5px solid rgba(255,255,255,.85)", background: "rgba(0,0,0,.2)" });
    const ci = cb - 10;
    const chk = el(bx, { position: "absolute", left: 1.5, top: 1.5, width: ci, height: ci }, `<svg width="${ci}" height="${ci}" viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="${K.lime}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    const p = chk.querySelector("path"); drawable(p);
    chk.style.filter = "drop-shadow(0 0 6px rgba(207,251,80,.9))";
    const tx = el(r, { position: "absolute", left: 38 + cb + 34, top: 0, right: 26, height: h, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, lineHeight: 1.12, textShadow: GLOW_T }, txt);
    if (o.blurUntilTick) gsap.set(tx, { filter: "blur(9px)", opacity: 0.55 });
    gsap.set(r, { opacity: 0 });
    return { r, lit, bx, p, tx };
  });
  return {
    rows, rect: [cx - w / 2 - 10, top - 10, cx + w / 2 + 10, top + items.length * (h + gap) - gap + 10],
    show: (t, step) => rows.forEach((rw, i) => blurIn(rw.r, t + i * (step == null ? 0.08 : step), { y: 24, blur: 10, dur: 0.4 })),
    tick: (i, t) => {
      const rw = rows[i];
      drawOn(rw.p, t, 0.22, "power2.out");
      tl.to(rw.bx, { borderColor: K.lime, boxShadow: GLOW_A(0.55), duration: 0.15 }, t);
      tl.fromTo(rw.bx, { scale: 1.18 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t);
      tl.to(rw.lit, { opacity: 1, duration: 0.3 }, t);
      tl.to(rw.r, { borderColor: "rgba(207,251,80,.45)", duration: 0.3 }, t);
      if (o.blurUntilTick) { tl.to(rw.tx, { filter: "blur(0px)", opacity: 1, duration: 0.3, ease: "power2.out" }, t - 0.05); tl.set(rw.tx, { filter: "none" }, t + 0.26); }
    },
  };
};

// ═══ L11 · percorso a tappe ════════════════════════════════════════════════════════════════
// pts: [[x,y], …] (coordinate del parent) · labels: testo di ogni tappa · o: { S (svgLayer), r }
// o.icons: un'icona per tappa al posto del numero (es. ["save", "copy", "flask-conical"]) · o.lw: larghezza etichetta
const pathSteps = (parent, S, pts, labels, o) => {
  o = o || {};
  const R = o.r || 34;
  const segs = [];
  for (let i = 1; i < pts.length; i++) segs.push(connector(S, [pts[i - 1], pts[i]], { color: "rgba(255,255,255,.35)", w: 4, curve: o.curve || null }));
  const lit = [];
  for (let i = 1; i < pts.length; i++) lit.push(connector(S, [pts[i - 1], pts[i]], { color: K.lime, w: 5, curve: o.curve || null, glow: true }));
  const lw = o.lw || 360;
  const nodes = pts.map(([x, y], i) => {
    const ic = o.icons && o.icons[i];
    const n = el(parent, { position: "absolute", left: x - R, top: y - R, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #404040, #232323 70%)", border: "3px solid rgba(255,255,255,.35)", boxShadow: "0 14px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: R * 0.8, color: "rgba(255,255,255,.6)", zIndex: 14 }, ic ? svg(ic, Math.round(R * 0.95), "rgba(255,255,255,.7)", 2.2) : String(i + 1));
    // stato acceso sovrapposto (si accende con l'opacità: niente tween di gradienti)
    const on = el(n, { position: "absolute", left: -3, top: -3, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #f6ffd8 0%, #dcff74 35%, #CFFB50 62%, #b2dd38 100%)", border: "3px solid #f4ffd0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: R * 0.8, color: K.ink, opacity: 0 }, ic ? svg(ic, Math.round(R * 0.95), K.ink, 2.6) : String(i + 1));
    const icOn = on;
    const lb = el(parent, { position: "absolute", left: x - lw / 2, top: y + R + 14, width: lw, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 28, color: "rgba(255,255,255,.5)", filter: "blur(5px)", zIndex: 14, lineHeight: 1.15 }, labels[i] || "");
    gsap.set([n, lb], { opacity: 0 });
    return { n, lb, icOn };
  });
  const runner = el(parent, { position: "absolute", left: pts[0][0] - 11, top: pts[0][1] - 11, width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 0 16px #fff, 0 0 34px rgba(207,251,80,.8)", opacity: 0, zIndex: 15 });
  return {
    nodes,
    show: (t) => { segs.forEach((s, i) => s.draw(t + i * 0.12, 0.35)); nodes.forEach((nd, i) => tl.to([nd.n, nd.lb], { opacity: 1, duration: 0.25 }, t + i * 0.12)); },
    // go(i, t): il tratto fino alla tappa i si accende, la tappa si attiva, l'etichetta va a fuoco
    go: (i, t, dur) => {
      if (i > 0) { lit[i - 1].draw(t, dur || 0.45, "power2.inOut"); tl.set(runner, { opacity: 1 }, t); tl.to(runner, { x: pts[i][0] - pts[0][0], y: pts[i][1] - pts[0][1], duration: dur || 0.45, ease: "power2.inOut" }, t); }
      const nd = nodes[i], tt = t + (i > 0 ? (dur || 0.45) : 0);
      tl.to(nd.icOn, { opacity: 1, duration: 0.16 }, tt);
      tl.to(nd.n, { boxShadow: `${GLOW_A(0.9)}, 0 14px 30px rgba(0,0,0,.5)`, duration: 0.18 }, tt);
      tl.fromTo(nd.n, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, tt);
      tl.to(nd.lb, { filter: "blur(0px)", color: K.white, duration: 0.25 }, tt);
    },
  };
};

// ═══ L11 v2 · percorso "a metropolitana" (reel 88 e 124 di Kallaway) ══════════════════════════════════════════════════════
// Un tracciato curvo e morbido (passa da tutte le stazioni) si disegna da sinistra e le stazioni nascono al passaggio, con
// l'etichetta ancora sfocata (segnaposto). .go(i, t) fa correre la pallina luminosa dalla stazione corrente alla i: dietro di lei
// il tratto fatto si accende di lime, la stazione d'arrivo si accende (colpo) e la sua etichetta va a fuoco. Usarla con la
// camera che segue la pallina (.poseAt(i)) o con l'inquadratura intera (.rect).
// S = svgLayer del mondo · pts: stazioni [[x, y], …] · labels · o: { tension (0.5), w (6), r (24), fs (30), lw (330),
//   side: posizione di ogni etichetta "t" | "b" | "l" | "r" (default alternate su/giù), icons, z }
// → { st, at, L, show(t, dur), go(i, t, dur), poseAt(i, {top}), rect }
const metroPath = (parent, S, pts, labels, o) => {
  o = o || {};
  const R = o.r || 24, z = o.z || 14, fs = o.fs || 30, tn = o.tension == null ? 0.5 : o.tension, lw = o.lw || 330;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tn) / 3, p1[1] + ((p2[1] - p0[1]) * tn) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tn) / 3, p2[1] - ((p3[1] - p1[1]) * tn) / 3];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  const sw = o.w || 6;
  const base = pathEl(S, d, { fill: "none", stroke: "rgba(255,255,255,.7)", "stroke-width": sw, "stroke-linecap": "round", "stroke-linejoin": "round" });
  base.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.35))";
  const glowP = pathEl(S, d, { fill: "none", stroke: K.lime, "stroke-width": sw + 18, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.3 });
  glowP.style.filter = "blur(9px)";
  const lit = pathEl(S, d, { fill: "none", stroke: K.lime, "stroke-width": sw + 3, "stroke-linecap": "round", "stroke-linejoin": "round" });
  lit.style.filter = "drop-shadow(0 0 8px rgba(207,251,80,.85))";
  const L = base.getTotalLength();
  [base, lit, glowP].forEach((p) => { p.setAttribute("stroke-dasharray", `${L.toFixed(1)} ${L.toFixed(1)}`); p.setAttribute("stroke-dashoffset", L.toFixed(1)); });
  // lunghezza del tracciato in ogni stazione
  const at = pts.map(([x, y], i) => {
    if (i === 0) return 0;
    if (i === pts.length - 1) return L;
    let best = 0, bd = 1e12;
    for (let k = 0; k <= 600; k++) { const q = base.getPointAtLength((k / 600) * L), dd = (q.x - x) ** 2 + (q.y - y) ** 2; if (dd < bd) { bd = dd; best = (k / 600) * L; } }
    return best;
  });
  const st = pts.map(([x, y], i) => {
    const ic = o.icons && o.icons[i];
    const n = el(parent, { position: "absolute", left: x - R, top: y - R, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #4a4a4a, #1f1f1f 72%)", border: "4px solid rgba(255,255,255,.85)", boxShadow: "0 0 12px rgba(255,255,255,.35), 0 12px 26px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: R * 0.85, color: "rgba(255,255,255,.75)", zIndex: z + 1 }, ic ? svg(ic, Math.round(R * 1.0), "rgba(255,255,255,.8)", 2.2) : String(i + 1));
    const on = el(n, { position: "absolute", left: -4, top: -4, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #f6ffd8 0%, #dcff74 35%, #CFFB50 62%, #b2dd38 100%)", border: "4px solid #f4ffd0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: R * 0.85, color: K.ink, opacity: 0 }, ic ? svg(ic, Math.round(R * 1.0), K.ink, 2.6) : String(i + 1));
    const sd = (o.side && o.side[i]) || (i % 2 ? "b" : "t");
    const lb = el(parent, { position: "absolute", left: sd === "r" ? x + R + 16 : sd === "l" ? x - R - 16 - lw : x - lw / 2, top: sd === "t" ? y - R - 16 - fs * 1.9 : sd === "b" ? y + R + 16 : y - fs * 0.95, width: lw, height: fs * 1.9, display: "flex", alignItems: "center", justifyContent: sd === "r" ? "flex-start" : sd === "l" ? "flex-end" : "center", zIndex: z + 2 });
    if (!labels[i]) lb.style.display = "none";
    const pill = el(lb, { padding: `0 ${Math.round(fs * 0.6)}px`, height: fs * 1.8, display: "flex", alignItems: "center", borderRadius: 14, background: "linear-gradient(180deg, rgba(56,56,56,.95), rgba(28,28,28,.97))", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 14px 30px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: fs, color: "rgba(255,255,255,.55)", whiteSpace: "nowrap", filter: "blur(4px)" }, labels[i] || "");
    gsap.set([n, lb], { opacity: 0 });
    return { n, on, lb, pill, x, y, sd };
  });
  const ball = layered(el(parent, { position: "absolute", left: -16, top: -16, width: 32, height: 32, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #f2ffc8 30%, #CFFB50 65%, #93bf27 100%)", boxShadow: "0 0 18px rgba(207,251,80,.95), 0 0 46px rgba(207,251,80,.55)", opacity: 0, zIndex: z + 4 }));
  const NS_ = 400, PT = [];
  for (let i = 0; i <= NS_; i++) { const q = base.getPointAtLength((i / NS_) * L); PT.push([q.x, q.y]); }
  const rider = o.walker || ball; // o.walker: un elemento qualsiasi (posizionato con x/y) che corre al posto della pallina
  const put = (len) => {
    const f = (Math.max(0, Math.min(L, len)) / L) * NS_, i = Math.min(NS_ - 1, Math.floor(f)), r = f - i;
    gsap.set(rider, { x: PT[i][0] + (PT[i + 1][0] - PT[i][0]) * r, y: PT[i][1] + (PT[i + 1][1] - PT[i][1]) * r });
    lit.setAttribute("stroke-dashoffset", (L - len).toFixed(1));
    glowP.setAttribute("stroke-dashoffset", (L - len).toFixed(1));
  };
  let cur = 0;
  const lightSt = (i, t) => {
    const s = st[i];
    tl.to(s.on, { opacity: 1, duration: 0.16 }, t);
    tl.to(s.n, { boxShadow: `${GLOW_A(0.9)}, 0 12px 26px rgba(0,0,0,.55)`, duration: 0.2 }, t);
    tl.fromTo(s.n, { scale: 1.3 }, { scale: 1, duration: 0.38, ease: "back.out(2.6)", immediateRender: false }, t);
    tl.to(s.pill, { filter: "blur(0px)", color: K.white, borderColor: "rgba(207,251,80,.8)", duration: 0.25 }, t);
    tl.set(s.pill, { filter: "none" }, t + 0.26);
  };
  return {
    st, at, L, d, ball,
    rect: (() => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; st.forEach((s) => { x0 = Math.min(x0, s.x - (s.sd === "l" ? lw + R + 20 : s.sd === "r" ? R : lw / 2)); x1 = Math.max(x1, s.x + (s.sd === "r" ? lw + R + 20 : s.sd === "l" ? R : lw / 2)); y0 = Math.min(y0, s.y - R - (s.sd === "t" ? fs * 1.9 + 20 : 10)); y1 = Math.max(y1, s.y + R + (s.sd === "b" ? fs * 1.9 + 20 : 10)); }); return [x0 - 20, y0 - 20, x1 + 20, y1 + 20]; })(),
    // il tracciato si disegna da sinistra (le stazioni nascono al passaggio, etichette sfocate); la prima si accende
    // piene (in coda, blocco 1 del rifacimento): le stazioni e le etichette sfocate ci sono già (le mette il chiamante prima
    // del taglio, come il reel 124) e al taglio si disegna solo il tracciato; default di prima: nascono al passaggio
    show: (t, dur, piene) => {
      dur = dur || 1.0;
      tl.to(base, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "power1.inOut" }, t);
      if (!piene) st.forEach((s, i) => {
        const tt = t + dur * Math.min(0.97, (at[i] / L) * 0.95);
        tl.fromTo(s.n, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, tt);
        tl.to(s.lb, { opacity: 1, duration: 0.25 }, tt + 0.05);
      });
      if (!o.walker) tl.set(ball, { opacity: 1, x: pts[0][0], y: pts[0][1] }, t + 0.05);
      if (!piene) lightSt(0, t + 0.12); // con piene la prima stazione la accende il chiamante (go(0, t, 0.05) sulla parola)
    },
    // la pallina corre fino alla stazione i (il tratto fatto si accende dietro di lei), la stazione si accende
    go: (i, t, dur) => {
      dur = dur || 0.75;
      const P = { len: at[cur] }, a0 = at[cur], a1 = at[i];
      tl.fromTo(P, { len: a0 }, { len: a1, duration: dur, ease: "power2.inOut", onUpdate: () => put(P.len), immediateRender: false }, t);
      lightSt(i, t + dur - 0.04);
      cur = i;
      return t + dur;
    },
    poseAt: (i, oo) => { const s = st[i]; oo = oo || {}; const m = oo.m || 330; return fitPose(s.x - m, s.y - m * 0.75, s.x + m, s.y + m * 0.75, Object.assign({ top: 330 }, oo)); },
  };
};


// ═══ O07 · scala al neon ═══════════════════════════════════════════════════════════════════
// pioli dal basso (0) all'alto; labels per piolo · o: { w, gap, n }
const ladder = (parent, cx, bottom, labels, o) => {
  o = o || {};
  const n = labels.length, gap = o.gap || 170, w = o.w || 520, tube = o.tube || 22;
  const H = gap * (n - 1) + 160, top = bottom - H;
  const S = svgLayer(parent, o.z || 8, cx - w, top - 100, w * 2, H + 200);
  const rail = (x) => `M${x} ${bottom + 40} L${x} ${top}`;
  const parts = [];
  const tubeP = (d, a) => {
    const g = pathEl(S, d, { fill: "none", stroke: K.lime, "stroke-width": tube + 22, "stroke-linecap": "round", opacity: 0.18 * (a || 1) });
    g.style.filter = "blur(12px)";
    const b = pathEl(S, d, { fill: "none", stroke: K.lime, "stroke-width": tube, "stroke-linecap": "round", opacity: 0.55 * (a || 1) });
    b.style.filter = "drop-shadow(0 0 8px rgba(207,251,80,.8))";
    const c = pathEl(S, d, { fill: "none", stroke: "#fff", "stroke-width": tube * 0.22, "stroke-linecap": "round", opacity: 0.5 * (a || 1) });
    [g, b, c].forEach(drawable);
    parts.push([g, b, c]);
    return [g, b, c];
  };
  tubeP(rail(cx - w / 2)); tubeP(rail(cx + w / 2));
  const rungs = labels.map((_, i) => tubeP(`M${cx - w / 2} ${bottom - i * gap} L${cx + w / 2} ${bottom - i * gap}`, 0.8));
  const tags = labels.map((tx, i) => {
    const y = bottom - i * gap;
    const fsN = o.fs || 34;
    const nm = el(parent, { position: "absolute", left: cx - w / 2 + 30, top: y - gap / 2 - fsN * 0.75, width: w - 60, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: fsN, lineHeight: 1.1, letterSpacing: "0.04em", color: K.white, textShadow: GLOW_T, zIndex: 12, whiteSpace: "nowrap" });
    const lvl = el(parent, { position: "absolute", left: cx - 200, top: y - gap / 2 + fsN * 0.55, width: 400, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: 18, letterSpacing: "0.22em", color: "rgba(255,255,255,.55)", zIndex: 12 }, `LIVELLO ${i + 1}`);
    gsap.set(lvl, { opacity: 0 });
    return { lvl, nm, tx };
  });
  return {
    S, rungs, tags,
    build: (t, dur) => parts.forEach((pp, i) => pp.forEach((p) => drawOn(p, t + (i < 2 ? 0 : 0.15 + (i - 2) * 0.06), dur || 0.6, "power2.out"))),
    // il piolo i si accende e il nome si scrive a macchina
    on: (i, t) => {
      const [g, b, c] = rungs[i];
      tl.to([g], { attr: { opacity: 0.4 }, duration: 0.2 }, t);
      tl.to([b], { attr: { opacity: 1 }, duration: 0.2 }, t);
      tl.to([c], { attr: { opacity: 0.9 }, duration: 0.2 }, t);
      tl.to(tags[i].lvl, { opacity: 1, duration: 0.2 }, t);
      typeIn(tags[i].nm, tags[i].tx.toUpperCase(), t + 0.1, 14);
    },
  };
};

// ═══ O06 · imbuto 3D (reel 46 di Kallaway) ═══════════════════════════════════════════════════
// Fasce di un cono viste dall'alto: imboccatura ellittica scura col bordo in luce, ombreggiatura cilindrica, fessure tra
// le fasce, bagliore dietro; in fondo una sfera lucida con icona (il "Super Fan" di Kallaway). Nasce in grafite;
// .light(i, t) accende la fascia di lime con uno sheen, .lightAll(t, step) a cascata, .dim(i, t) la spegne.
// labels dall'alto · o: { w, wEnd, h, gap, fs, tilt (ry/rx dell'ellisse), lit, icon, end (etichetta della sfera), orb, z }
// → { layers, orb, build(t, step), light, lightAll, dim, rect }
const funnel = (parent, cx, top, labels, o) => {
  o = o || {};
  const n = labels.length, w0 = o.w || 820, w1 = o.wEnd || 260, h = o.h || 104, gap = o.gap || 14, z = o.z || 12, k = o.tilt || 0.14, fs = o.fs || 30;
  const ry0 = (w0 / 2) * k, totH = n * h + (n - 1) * gap;
  const od = o.orb || Math.round(Math.max(110, w1 * 0.55));
  const yOrb = top + totH + gap + ((w1 / 2) * k) + od / 2 + 14;
  const bx = cx - w0 / 2 - 90, by = top - ry0 - 90, BW = w0 + 180, BH = yOrb + od / 2 + 120 - by;
  const holder = el(parent, { position: "absolute", left: bx, top: by, width: BW, height: BH, zIndex: z });
  const Sg = svgIn(holder, BW, BH);
  Sg.style.filter = "blur(26px)";
  const Sv = svgIn(holder, BW, BH);
  const X = (x) => (x - bx).toFixed(1), Y = (y) => (y - by).toFixed(1);
  const id = "fn" + ++SVGN;
  const stops = (arr) => arr.map(([of, c]) => `<stop offset="${of}" stop-color="${c}"/>`).join("");
  Sv._defs.innerHTML =
    `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0">${stops([[0, "#141414"], [0.16, "#2e2e2e"], [0.4, "#4b4b4b"], [0.58, "#3d3d3d"], [0.84, "#242424"], [1, "#121212"]])}</linearGradient>` +
    `<linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="0">${stops([[0, "#7f9e2c"], [0.15, "#a9d436"], [0.38, "#e9ff9c"], [0.55, "#d6fd5e"], [0.82, "#a7d137"], [1, "#7b9a2b"]])}</linearGradient>` +
    `<radialGradient id="${id}o" cx=".5" cy=".38" r=".62">${stops([[0, "#050505"], [0.7, "#121212"], [1, "#2a2a2a"]])}</radialGradient>` +
    `<linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  const mk = (tag, a, par) => { const e = document.createElementNS(NS, tag); for (const q in a) e.setAttribute(q, a[q]); (par || Sv).appendChild(e); return e; };
  const groups = [];
  const layers = labels.map((tx, i) => {
    const a = w0 - ((w0 - w1) * i) / n, b = w0 - ((w0 - w1) * (i + 1)) / n;
    const yT = top + i * (h + gap), yB = yT + h, rxT = a / 2, ryT = rxT * k, rxB = b / 2, ryB = rxB * k;
    const face = `M${X(cx - rxT)} ${Y(yT)} A${rxT} ${ryT} 0 0 0 ${X(cx + rxT)} ${Y(yT)} L${X(cx + rxB)} ${Y(yB)} A${rxB} ${ryB} 0 0 1 ${X(cx - rxB)} ${Y(yB)} Z`;
    const lidD = `M${X(cx - rxT)} ${Y(yT)} A${rxT} ${ryT} 0 1 0 ${X(cx + rxT)} ${Y(yT)} A${rxT} ${ryT} 0 1 0 ${X(cx - rxT)} ${Y(yT)} Z`;
    const lipD = `M${X(cx - rxT)} ${Y(yT)} A${rxT} ${ryT} 0 0 0 ${X(cx + rxT)} ${Y(yT)}`;
    const g = document.createElementNS(NS, "g");
    groups.push(g);
    // la "mensola" in cima alla fascia (si vede nella fessura) · l'imboccatura scura per la prima fascia
    const lidG = mk("path", { d: lidD, fill: i === 0 ? `url(#${id}o)` : "#5a5a5a" }, g);
    const lidL = mk("path", { d: lidD, fill: i === 0 ? `url(#${id}o)` : "#efffb8", opacity: 0 }, g);
    const faceG = mk("path", { d: face, fill: `url(#${id}g)` }, g);
    const faceL = mk("path", { d: face, fill: `url(#${id}l)`, opacity: 0 }, g);
    const lipG = mk("path", { d: i === 0 ? lidD : lipD, fill: "none", stroke: "#8c8c8c", "stroke-width": i === 0 ? 4 : 3, opacity: 0.9 }, g);
    const lipL = mk("path", { d: i === 0 ? lidD : lipD, fill: "none", stroke: "#f6ffd8", "stroke-width": i === 0 ? 5 : 3.5, opacity: 0 }, g);
    // sheen dentro la fascia
    const cid = id + "c" + i;
    const cp = mk("clipPath", { id: cid }, Sv._defs);
    mk("path", { d: face }, cp);
    const shg = mk("g", { "clip-path": `url(#${cid})` }, g);
    const sh = mk("rect", { x: X(cx - rxT - 160), y: Y(yT - ryT - 10), width: 90, height: h + ryT + ryB + 30, fill: `url(#${id}s)`, opacity: 0 }, shg);
    const glow = mk("path", { d: face, fill: "#CFFB50", opacity: 0 }, Sg);
    const lb = el(holder, { position: "absolute", left: cx - rxB - bx, top: yT - by + (ryT + ryB) / 2, width: rxB * 2, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: fs, color: "rgba(255,255,255,.9)", whiteSpace: "nowrap", zIndex: 3, textShadow: "0 2px 8px rgba(0,0,0,.5)" }, tx);
    gsap.set([g, lb], { opacity: 0 });
    return { g, lidG, lidL, faceG, faceL, lipG, lipL, sh, glow, lb, yT, rxT, ryT, h };
  });
  // le fasce di sotto si disegnano prima (quelle sopra le coprono)
  groups.slice().reverse().forEach((g) => Sv.appendChild(g));
  // sfera lucida in fondo con l'icona
  const orb = el(holder, { position: "absolute", left: cx - od / 2 - bx, top: yOrb - od / 2 - by, width: od, height: od, borderRadius: "50%", background: "radial-gradient(circle at 36% 30%, #8a8a8a 0%, #4a4a4a 22%, #2a2a2a 62%, #161616 100%)", border: "2px solid rgba(255,255,255,.22)", boxShadow: "0 24px 50px rgba(0,0,0,.6), inset 0 -10px 24px rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4 });
  const orbL = el(orb, { position: "absolute", inset: -2, borderRadius: "50%", background: "radial-gradient(circle at 36% 30%, #ffffff 0%, #f0ffc2 10%, #d8fd66 36%, #b4de3a 70%, #86ad26 100%)", boxShadow: `${GLOW_A(1)}, inset 0 -10px 24px rgba(0,0,0,.18)`, opacity: 0 });
  const orbI = el(orb, { position: "relative", zIndex: 2 }, svg(o.icon || "user-check", Math.round(od * 0.46), "#ffffff", 2.2));
  const orbI2 = el(orb, { position: "absolute", left: 0, top: 0, width: od, height: od, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, opacity: 0 }, svg(o.icon || "user-check", Math.round(od * 0.46), K.ink, 2.4));
  const orbLab = o.end ? el(holder, { position: "absolute", left: cx - 200 - bx, top: yOrb + od / 2 + 14 - by, width: 400, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(fs * 1.05), color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap", zIndex: 4 }, o.end) : null;
  gsap.set([orb, orbLab].filter(Boolean), { opacity: 0 });
  gsap.set(orb, { scale: 0.4 });
  const light = (i, t) => {
    const L = layers[i];
    tl.to([L.faceL, L.lidL, L.lipL], { attr: { opacity: 1 }, duration: 0.22, ease: "power2.out" }, t);
    tl.to(L.glow, { attr: { opacity: 0.5 }, duration: 0.3 }, t);
    tl.to(L.lb, { color: K.ink, textShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.2 }, t);
    tl.set(L.sh, { attr: { opacity: 1 } }, t + 0.05);
    tl.fromTo(L.sh, { attr: { x: X(cx - L.rxT - 160) } }, { attr: { x: X(cx + L.rxT + 120) }, duration: 0.7, ease: "power1.inOut", immediateRender: false }, t + 0.05);
    tl.set(L.sh, { attr: { opacity: 0 } }, t + 0.76);
    tl.fromTo([L.g, L.lb], { y: -6 }, { y: 0, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t);
  };
  const lightOrb = (t) => {
    tl.to([orbL, orbI2], { opacity: 1, duration: 0.25 }, t);
    tl.to(orbI, { opacity: 0, duration: 0.2 }, t);
    tl.fromTo(orb, { scale: 1.15 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)", immediateRender: false }, t);
  };
  return {
    layers, orb, holder, rect: [cx - w0 / 2 - 20, top - ry0 - 24, cx + w0 / 2 + 20, yOrb + od / 2 + (orbLab ? 70 : 24)],
    build: (t, step) => {
      const st = step || 0.13;
      layers.forEach((L, i) => {
        const tt = t + i * st;
        tl.fromTo([L.g, L.lb], { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.34, ease: "power3.out", immediateRender: false }, tt);
        if (o.lit) light(i, tt + 0.25);
      });
      const to = t + n * st + 0.05;
      tl.to(orb, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, to);
      if (orbLab) blurIn(orbLab, to + 0.15, { y: 10, blur: 8, dur: 0.3 });
      if (o.lit) lightOrb(to + 0.3);
    },
    light, lightOrb,
    lightAll: (t, step) => { layers.forEach((_, i) => light(i, t + i * (step || 0.12))); lightOrb(t + n * (step || 0.12) + 0.05); },
    dim: (i, t) => tl.to([layers[i].g, layers[i].lb], { opacity: 0.28, duration: 0.3 }, t),
  };
};

// ═══ O22 · folla in un riquadro con contatore ═══════════════════════════════════════════════
const crowd = (parent, cx, cy, cols, rows, o) => {
  o = o || {};
  const s = o.s || 44, gap = o.gap || 12;
  const W = cols * s + (cols - 1) * gap + 70, H = rows * s + (rows - 1) * gap + 130;
  const c = glass(parent, cx - W / 2, cy - H / 2, W, H, { zIndex: o.z || 12 });
  const people = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) people.push(person(c, 35 + s / 2 + i * (s + gap), 35 + s / 2 + j * (s + gap), s, "rgba(255,255,255,.85)", 3));
  const num = el(c, { position: "absolute", left: 0, bottom: 22, width: W, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: 40, color: K.lime, textShadow: GLOW_LT }, o.label || "");
  gsap.set(people, { opacity: 0 });
  const recolorP = (t, idx, color, step) => idx.forEach((i, k) => tl.to(people[i].children, { background: color, duration: 0.1 }, t + k * (step || 0)));
  return {
    c, people, num,
    fillIn: (t, dur) => people.forEach((p, i) => tl.to(p, { opacity: 1, duration: 0.1 }, t + ((hash(i, 21) + 1) / 2) * (dur || 0.6))),
    recolor: recolorP,
    dim: (t, idx, a) => tl.to(idx.map((i) => people[i]), { opacity: a == null ? 0.18 : a, duration: 0.3 }, t),
    count: (t, from, to, dur, fmt) => { const P = { v: from }; tl.to(P, { v: to, duration: dur, ease: "none", onUpdate: () => (num.textContent = (fmt || ((v) => itNum(v) + " persone"))(P.v)) }, t); },
  };
};

// ═══ D04 · retention che crolla ══════════════════════════════════════════════════════════
const retention = (parent, x, y, o) => {
  o = o || {};
  const w = o.w || 620, h = o.h || 380;
  const c = glass(parent, x, y, w, h, { zIndex: o.z || 12 });
  el(c, { position: "absolute", left: 30, top: 24, fontFamily: FS, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,.8)" }, o.label || "Visualizzazione");
  const S = svgIn(c, w, h);
  const x0 = 40, x1 = w - 40, y0 = 90, y1 = h - 40;
  const P = o.points || [[0, 0], [0.08, 0.12], [0.14, 0.55], [0.22, 0.7], [0.4, 0.78], [0.7, 0.84], [1, 0.88]];
  const d = "M" + P.map(([u, v]) => `${(x0 + (x1 - x0) * u).toFixed(1)} ${(y0 + (y1 - y0) * v).toFixed(1)}`).join(" L");
  pathEl(S, `M${x0} ${y1} L${x1} ${y1}`, { stroke: "rgba(255,255,255,.2)", "stroke-width": 2 });
  const line = pathEl(S, d, { fill: "none", stroke: "#fff", "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" });
  line.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,.7))";
  drawable(line);
  const dropX = x0 + (x1 - x0) * P[2][0], dropY = y0 + (y1 - y0) * P[2][1];
  const pct = el(c, { position: "absolute", right: 30, top: 16, fontFamily: FD, fontWeight: 700, fontSize: 50, color: K.white, textShadow: GLOW_T }, "100%");
  return {
    c, dropX, dropY,
    draw: (t, dur) => {
      drawOn(line, t, dur || 0.9, "power1.inOut");
      const Q = { v: 100 };
      tl.to(Q, { v: o.end || 12, duration: dur || 0.9, ease: "power2.in", onUpdate: () => (pct.textContent = Math.round(Q.v) + "%") }, t);
    },
  };
};

// ═══ D05 · barre che crescono ══════════════════════════════════════════════════════════════
// D05 (reel 38 di Kallaway): sopra ogni barra la foto profilo vera e il valore, che arrivano quando la barra finisce di
// crescere. Barre lucide (cilindriche): grafite per le altre, lime per la vincente.
// bars: [{v:0..1, l:"etichetta", win:true, av:"handle", val:"922K"}] · o: { h, bw, gap, fs, z }
const barChart = (parent, cx, base, bars, o) => {
  o = o || {};
  const bw = o.bw || 120, gap = o.gap || 60, H = o.h || 520, z = o.z || 12;
  const W = bars.length * bw + (bars.length - 1) * gap;
  const axis = el(parent, { position: "absolute", left: cx - W / 2 - 30, top: base, width: W + 60, height: 3, borderRadius: 2, background: "rgba(255,255,255,.32)", zIndex: z });
  const items = bars.map((b, i) => {
    const x = cx - W / 2 + i * (bw + gap), bh = H * b.v;
    const bar = el(parent, { position: "absolute", left: x, top: base - bh, width: bw, height: bh, borderRadius: "16px 16px 4px 4px",
      background: b.win ? "linear-gradient(90deg,#9cc82e 0%,#d2fb5c 30%,#efffb4 46%,#CFFB50 64%,#9fcb30 100%)" : "linear-gradient(90deg,#262626 0%,#444 32%,#5a5a5a 46%,#3c3c3c 66%,#222 100%)",
      boxShadow: b.win ? `${GLOW_A(0.85)}, inset 0 2px 0 rgba(255,255,255,.6)` : "0 0 24px rgba(255,255,255,.06), inset 0 2px 0 rgba(255,255,255,.22)",
      border: b.win ? "none" : "1.5px solid rgba(255,255,255,.12)", transformOrigin: "50% 100%", zIndex: z });
    const lb = el(parent, { position: "absolute", left: x - 50, top: base + 18, width: bw + 100, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 28, color: b.win ? K.lime : "rgba(255,255,255,.8)", textShadow: b.win ? GLOW_LT : "none", zIndex: z, lineHeight: 1.1, whiteSpace: "nowrap" }, b.l || "");
    const ad = Math.round(Math.min(bw * 0.82, 130));
    const av = b.av ? avatar(parent, x + bw / 2, base - bh - ad / 2 - 16, ad, b.av, { ring: b.win ? K.lime : "rgba(255,255,255,.75)", bw: b.win ? 5 : 3, z: z + 2 }) : null;
    const val = b.val ? el(parent, { position: "absolute", left: x - 60, top: base - bh - (av ? ad + 30 : 14) - (o.fs || 28) * 1.5, width: bw + 120, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: Math.round((o.fs || 28) * 1.35), color: b.win ? K.lime : K.white, textShadow: b.win ? GLOW_LT : GLOW_T, zIndex: z + 2, whiteSpace: "nowrap" }, b.val) : null;
    gsap.set(bar, { scaleY: 0 });
    gsap.set([lb, val].filter(Boolean), { opacity: 0 });
    if (av) gsap.set(av, { opacity: 0, scale: 0.4 });
    return { bar, lb, av, val, b };
  });
  return {
    items, axis, rect: [cx - W / 2 - 40, base - H - 230, cx + W / 2 + 40, base + 70],
    grow: (t, step) => items.forEach((it, i) => {
      const tt = t + i * (step == null ? 0.12 : step);
      tl.to(it.bar, { scaleY: 1, duration: 0.55, ease: "power3.out" }, tt);
      tl.to(it.lb, { opacity: 1, duration: 0.3 }, tt + 0.1);
      if (it.av) tl.to(it.av, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)" }, tt + 0.4);
      if (it.val) blurIn(it.val, tt + 0.5, { y: 12, blur: 8, dur: 0.3 });
    }),
  };
};

// ═══ D06 · barra di avanzamento ════════════════════════════════════════════════════════════
const progressBar = (parent, x, y, w, o) => {
  o = o || {};
  const h = o.h || 26;
  const tr = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.14)", overflow: "hidden", zIndex: o.z || 12 });
  const f = el(tr, { position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: h / 2, background: "linear-gradient(90deg,#b9e63b,#e2ff8a)", boxShadow: GLOW_A(0.7), transformOrigin: "0 50%" });
  gsap.set(f, { scaleX: 0 });
  const lab = o.label ? el(parent, { position: "absolute", left: x, top: y - 44, width: w, display: "flex", justifyContent: "space-between", fontFamily: FS, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,.75)", zIndex: o.z || 12 }, `<span>${o.label}</span><span class="pv">0%</span>`) : null;
  return {
    tr, f,
    fill: (t, to, dur, ease) => {
      tl.to(f, { scaleX: to == null ? 1 : to, duration: dur || 1, ease: ease || "none" }, t);
      if (lab) { const pv = lab.querySelector(".pv"), P = { v: 0 }; tl.to(P, { v: (to == null ? 1 : to) * 100, duration: dur || 1, ease: ease || "none", onUpdate: () => (pv.textContent = Math.round(P.v) + "%") }, t); }
    },
  };
};

// ═══ X01 · "Commenta X" + anteprima della risorsa ══════════════════════════════════════════
// parola = la parola da commentare; o: { docs (quanti documenti), titolo, sotto }
const ctaCard = (parent, cx, cy, parola, o) => {
  o = o || {};
  const T = titleW({ parent, x: cx, y: cy - 520, size: 88, lines: [[{ t: "Commenta " }, { t: `"${parola}"`, box: true }], [{ t: o.sotto || "e te lo mando", hand: true }]] });
  const n = o.docs || 6, cols = 3, dw = 230, dh = 300, g = 26;
  const gx = cx - (cols * dw + (cols - 1) * g) / 2, gy = cy - 180;
  const docs = [];
  for (let i = 0; i < n; i++) {
    const x = gx + (i % cols) * (dw + g), y = gy + Math.floor(i / cols) * (dh + g);
    const d = el(parent, { position: "absolute", left: x, top: y, width: dw, height: dh, borderRadius: 16, background: "linear-gradient(180deg,#f7f7f2,#e6e6df)", boxShadow: "0 24px 60px rgba(0,0,0,.5)", overflow: "hidden", zIndex: o.z || 14 });
    el(d, { position: "absolute", left: 18, top: 18, width: dw - 36, height: 16, borderRadius: 4, background: "#1e1e1e" });
    el(d, { position: "absolute", left: 18, top: 44, width: (dw - 36) * 0.6, height: 10, borderRadius: 3, background: "#CFFB50" });
    for (let k = 0; k < 9; k++) el(d, { position: "absolute", left: 18, top: 72 + k * 22, width: (dw - 36) * (0.55 + 0.45 * ((hash(i * 9 + k, 4) + 1) / 2)), height: 9, borderRadius: 3, background: "rgba(30,30,30,.22)" });
    gsap.set(d, { opacity: 0, y: 40, scale: 0.9 });
    docs.push(d);
  }
  return {
    T, docs,
    // i documenti arrivano a ondate (1 → 3 → 6)
    show: (t, times) => {
      T.inAt(times || t);
      const waves = o.waves || [1, 3, n];
      let k = 0;
      waves.forEach((upto, wi) => { for (; k < upto && k < n; k++) tl.to(docs[k], { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, t + 0.5 + wi * 0.35 + (k % cols) * 0.05); });
    },
  };
};

// ═══ L14 · griglia di esempi (reel veri) con etichetta e badge ═══════════════════════════════
// vids: [{v:"id", l:"etichetta", b:"1,2M"}] · o: { cols, w, h, gap }
const reelGrid = (parent, cx, cy, vids, o) => {
  o = o || {};
  const cols = o.cols || 3, w = o.w || 270, h = o.h || 480, gap = o.gap || 28;
  const rows = Math.ceil(vids.length / cols);
  const W = cols * w + (cols - 1) * gap, H = rows * h + (rows - 1) * (gap + 70);
  const cards = vids.map((vd, i) => {
    const x = cx - W / 2 + (i % cols) * (w + gap) + w / 2, y = cy - H / 2 + Math.floor(i / cols) * (h + gap + 70) + h / 2;
    const vc = videoCard(parent, x, y, w, h, vd.v, { z: 10 });
    const lab = vd.l ? el(parent, { position: "absolute", left: x - w / 2, top: y - h / 2 - 48, width: w, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: 24, color: K.white, textShadow: GLOW_T, zIndex: 12, whiteSpace: "nowrap" }, vd.l) : null;
    const bd = vd.b ? viewBadge(parent, x, y + h / 2 + 34, vd.b, { fs: 26 }) : null;
    gsap.set(vc.body, { opacity: 0 });
    if (lab) gsap.set(lab, { opacity: 0 });
    return { vc, lab, bd };
  });
  return {
    cards,
    show: (t, step) => {
      cards.forEach((c, i) => { blurIn(c.vc.body, t + i * (step == null ? 0.07 : step), { y: 40, blur: 14, dur: 0.45 }); if (c.lab) tl.to(c.lab, { opacity: 1, duration: 0.3 }, t + 0.2 + i * (step == null ? 0.07 : step)); });
      popSeq(cards.filter((c) => c.bd).map((c) => c.bd), t + 0.45, 0.08);
    },
  };
};

// ═══ L13 · confronto a due colonne ═════════════════════════════════════════════════════════
const versus = (parent, cx, top, left, right, o) => {
  o = o || {};
  const w = o.w || 430, gap = o.gap || 40, fs = o.fs || 34;
  const mk = (x, txt, good) => {
    const hdr = el(parent, { position: "absolute", left: x, top, width: w, height: 84, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: good ? "linear-gradient(180deg,#dcff74,#c4f03e)" : "linear-gradient(180deg,#3a3a3a,#2a2a2a)", color: good ? K.ink : "rgba(255,255,255,.7)", fontFamily: FD, fontWeight: 700, fontSize: fs * 1.15, boxShadow: good ? GLOW_A(0.7) : "0 16px 40px rgba(0,0,0,.45)", zIndex: 13 }, txt);
    gsap.set(hdr, { opacity: 0 });
    return hdr;
  };
  const L = mk(cx - gap / 2 - w, left, false), R = mk(cx + gap / 2, right, true);
  const rowsL = [], rowsR = [];
  const add = (t, a, b, k) => {
    const y = top + 110 + k * 110;
    const mkr = (x, txt, good) => {
      const r = el(parent, { position: "absolute", left: x, top: y, width: w, height: 92, borderRadius: 14, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", background: "linear-gradient(90deg,#272727,#1f1f1f)", border: `1.5px solid ${good ? "rgba(207,251,80,.45)" : "rgba(255,255,255,.08)"}`, fontFamily: FS, fontWeight: 700, fontSize: fs * 0.82, color: good ? K.white : "rgba(255,255,255,.55)", zIndex: 13 }, svg(good ? "check" : "x", 30, good ? K.lime : "rgba(255,255,255,.4)", 3) + txt);
      blurIn(r, t + (good ? 0.12 : 0), { y: 20, blur: 10, dur: 0.4 });
      return r;
    };
    rowsL.push(mkr(cx - gap / 2 - w, a, false));
    rowsR.push(mkr(cx + gap / 2, b, true));
  };
  return { L, R, rowsL, rowsR, head: (t) => { blurIn(L, t, { y: 20, blur: 12, dur: 0.4 }); blurIn(R, t + 0.1, { y: 20, blur: 12, dur: 0.4 }); }, add };
};

// ═══ U04 · interruttori che si accendono ════════════════════════════════════════════════════
const toggle = (parent, x, y, o) => {
  o = o || {};
  const w = o.w || 104, h = o.h || 60;
  const tr = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,.18)", border: "1.5px solid rgba(255,255,255,.2)", zIndex: o.z || 14 });
  const kn = el(tr, { position: "absolute", left: 4, top: 4, width: h - 8, height: h - 8, borderRadius: "50%", background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,.4)" });
  return { tr, kn, on: (t) => { tl.to(tr, { background: K.lime, borderColor: K.lime, boxShadow: GLOW_A(0.7), duration: 0.2 }, t); tl.to(kn, { x: w - h, duration: 0.25, ease: "back.out(2)" }, t); } };
};

// ═══ L09 · albero (padre → figli) ═════════════════════════════════════════════════════════
// collega il punto p ai punti dei figli con curve verticali; restituisce i connettori da disegnare in sequenza
const tree = (S, p, kids, o) => {
  o = o || {};
  const cns = kids.map((k) => connector(S, [p, k], { curve: o.curve || "v", color: o.color || "rgba(255,255,255,.7)", w: o.w || 3, dash: o.dash || null }));
  return { cns, draw: (t, step, dur) => cns.forEach((c, i) => c.draw(t + i * (step == null ? 0.08 : step), dur || 0.4)) };
};

// ═══ L10 · parentesi che raggruppa ══════════════════════════════════════════════════════════
// verticale da (x, y0) a (x, y1), apertura verso destra (side=1) o sinistra (-1)
const bracket = (S, x, y0, y1, side, o) => {
  o = o || {};
  const k = (o.depth || 28) * (side || 1), ym = (y0 + y1) / 2;
  const d = `M${x} ${y0} C${x - k} ${y0} ${x} ${ym - 10} ${x - k} ${ym} C${x} ${ym + 10} ${x - k} ${y1} ${x} ${y1}`;
  const p = pathEl(S, d, { fill: "none", stroke: o.color || K.lime, "stroke-width": o.w || 4, "stroke-linecap": "round" });
  p.style.filter = "drop-shadow(0 0 6px rgba(207,251,80,.8))";
  drawable(p);
  return { p, draw: (t, dur) => drawOn(p, t, dur || 0.35, "power2.out") };
};

// ═══ H03 · tag inclinati attorno a un esempio ════════════════════════════════════════════
// tags: [{t:"testo", x, y, rot}] (coordinate del parent) · o: { from:[x,y] punto da cui partono le linee }
const tags = (parent, S, list, o) => {
  o = o || {};
  return list.map((tg, i) => {
    const b = el(parent, { position: "absolute", left: tg.x, top: tg.y, padding: "10px 18px", borderRadius: 12, background: tg.good === false ? "#2b2b2b" : K.lime, color: tg.good === false ? "rgba(255,255,255,.75)" : K.ink, fontFamily: FS, fontWeight: 800, fontSize: o.fs || 28, whiteSpace: "nowrap", boxShadow: tg.good === false ? "0 10px 26px rgba(0,0,0,.5)" : `0 10px 26px rgba(0,0,0,.45), ${GLOW_A(0.5)}`, transform: `rotate(${tg.rot || 0}deg)`, zIndex: 20 }, tg.t);
    gsap.set(b, { opacity: 0, scale: 0.7 });
    const cn = o.from ? connector(S, [o.from, [tg.x + 20, tg.y + 24]], { color: "rgba(255,255,255,.6)", w: 2.5 }) : null;
    return { b, cn, show: (t) => { if (cn) cn.draw(t, 0.25, "power2.out"); tl.to(b, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)" }, t + 0.12); } };
  });
};

// ═══ O10 · bersaglio lucido (reel 91 di Kallaway) ═════════════════════════════════════════════
// Dischi pieni sovrapposti in grafite lucida (ombra portata, riflesso in alto a sinistra, bordo lime che si accende),
// centro lime a sfera, tacche da mirino sul disco esterno. radii: dal centro all'esterno.
// .ring(i, t) costruisce dal centro · .dimOuter(da, t) · .hit(t, {dx, dy}) una freccetta arriva in volo e si pianta
// al centro (scia, onde, scintille, scossa, vibrazione) · o: { z, ticks (true) }
const bullseye = (parent, cx, cy, radii, o) => {
  o = o || {};
  const n = radii.length, z = o.z || 10;
  const rings = radii.map((r, i) => {
    const solid = i === 0;
    const a = Math.max(0.5, 1 - i * 0.14);
    const d = el(parent, { position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%",
      background: solid ? "radial-gradient(circle at 36% 30%, #ffffff 0%, #f1ffc4 9%, #dcff6e 32%, #CFFB50 52%, #a8d334 82%, #8bb127 100%)"
        : `radial-gradient(circle at 34% 26%, rgba(255,255,255,.13) 0%, rgba(255,255,255,0) 46%), radial-gradient(circle, ${i % 2 ? "#262626" : "#303030"} 0%, ${i % 2 ? "#1d1d1d" : "#242424"} 82%, ${i % 2 ? "#161616" : "#1b1b1b"} 100%)`,
      border: solid ? "none" : `3px solid rgba(207,251,80,${a.toFixed(2)})`,
      boxShadow: solid ? `${GLOW_A(1)}, inset -6px -10px 22px rgba(0,0,0,.2)` : `0 ${Math.round(r * 0.08)}px ${Math.round(r * 0.22)}px rgba(0,0,0,.55), 0 0 26px rgba(207,251,80,${(a * 0.32).toFixed(2)}), inset 0 2px 0 rgba(255,255,255,.1), inset 0 0 ${Math.round(r * 0.12)}px rgba(0,0,0,.5)`,
      zIndex: z + n - i });
    gsap.set(d, { opacity: 0, scale: 0.4 });
    return d;
  });
  // tacche da mirino sul disco esterno (4 lunghe + 20 corte)
  const R = radii[n - 1];
  const tk = el(parent, { position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, zIndex: z + 1, pointerEvents: "none" });
  if (o.ticks !== false) for (let q = 0; q < 24; q++) {
    const long = q % 6 === 0, L = long ? 26 : 12;
    const arm = el(tk, { position: "absolute", left: R, top: R, width: 1, height: 1, transform: `rotate(${q * 15}deg)` });
    el(arm, { position: "absolute", left: -1.5, top: -R + 8, width: 3, height: L, borderRadius: 2, background: long ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.22)" });
  }
  gsap.set(tk, { opacity: 0, scale: 0.6 });
  // dur, ease in coda (blocco 2 del ritmo: la costruzione di Kallaway è più lenta e quasi lineare); default di prima 0.32 expo.out
  const ring = (i, t, dur, ease) => {
    tl.to(rings[i], { opacity: 1, scale: 1, duration: dur || 0.32, ease: ease || "expo.out" }, t);
    if (i === n - 1) tl.to(tk, { opacity: 1, scale: 1, rotation: 15, duration: 0.6, ease: "expo.out" }, t);
  };
  // freccetta (come nel reel-01: alette lime, asta bianca, impugnatura grafite, punta)
  let dartW = null, dart = null;
  const hit = (t, o2) => {
    o2 = o2 || {};
    const dx = o2.dx == null ? 1 : o2.dx, dy = o2.dy == null ? 0.72 : o2.dy;
    const ang = (Math.atan2(-dy, -dx) * 180) / Math.PI;
    dartW = el(parent, { position: "absolute", left: cx, top: cy, width: 1, height: 1, transform: `rotate(${ang.toFixed(1)}deg)`, zIndex: z + n + 10 });
    dart = el(dartW, { position: "absolute", left: -360, top: -30, width: 360, height: 60, transformOrigin: "100% 50%" });
    el(dart, { position: "absolute", left: 0, top: 3, width: 92, height: 22, background: "linear-gradient(90deg,#a6d136,#e2ff8c)", transform: "skewX(-35deg)", borderRadius: 3, boxShadow: GLOW_A(0.5) });
    el(dart, { position: "absolute", left: 0, top: 35, width: 92, height: 22, background: "linear-gradient(90deg,#a6d136,#e2ff8c)", transform: "skewX(35deg)", borderRadius: 3, boxShadow: GLOW_A(0.5) });
    el(dart, { position: "absolute", left: 44, top: 25, width: 260, height: 10, borderRadius: 5, background: "linear-gradient(180deg,#ffffff,#bdbdbd)", boxShadow: "0 0 14px rgba(255,255,255,.5)" });
    el(dart, { position: "absolute", left: 206, top: 18, width: 90, height: 24, borderRadius: 9, background: "linear-gradient(180deg,#666,#262626)", border: "1.5px solid rgba(255,255,255,.3)" });
    el(dart, { position: "absolute", left: 300, top: 22, width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: "58px solid #f2f2f2" });
    gsap.set(dart, { x: -820, opacity: 0, filter: "blur(10px)" });
    tl.set(dart, { opacity: 1 }, t - 0.24);
    tl.to(dart, { x: 0, duration: 0.24, ease: "power2.in" }, t - 0.24);
    tl.to(dart, { filter: "blur(0px)", duration: 0.05 }, t);
    tl.set(dart, { filter: "none" }, t + 0.06);
    [9, -6, 4, -2, 0].forEach((r, k) => tl.to(dart, { rotation: r, duration: 0.06, ease: "sine.inOut" }, t + k * 0.06));
    rings.forEach((rg, i) => tl.fromTo(rg, { scale: 1 - 0.03 * (n - i) }, { scale: 1, duration: 0.45, ease: "back.out(3)", immediateRender: false }, t + i * 0.025));
    const RR = o2.r || R; // raggio delle onde (o2.r quando il bersaglio è solo un appoggio per la freccetta)
    ripple(parent, cx, cy, t, { r: RR * 0.85, s0: 0.2, dur: 0.7, w: 5, z: z + n + 8 });
    ripple(parent, cx, cy, t + 0.1, { r: RR * 1.15, s0: 0.2, dur: 0.8, w: 3, a: 0.6, z: z + n + 8 });
    sparks(parent, cx, cy, t, { n: 10, r0: 40, r1: Math.max(150, RR * 0.6), len: 38, z: z + n + 9 });
    if (o2.shake !== false) shake(t + 0.01, o2.amp || 11, 6);
  };
  return { rings, ticks: tk, ring, hit, dimOuter: (from, t) => tl.to(rings.slice(from).concat(from <= n - 1 ? [tk] : []), { opacity: 0.22, duration: 0.35 }, t), dart: () => dart };
};

// ═══ L12 · documento "Video Script" che si costruisce ═══════════════════════════════════════
// sections: [{label:"Hook", rows:2, color}] · o: { w, h, title }
const scriptDoc = (parent, cx, cy, sections, o) => {
  o = o || {};
  // reel 35: righe sottili e fitte (o.fitto, default) che si stendono a cascata e si colorano per sezione
  const fitto = o.fitto !== false, rf = fitto ? 1.7 : 1;
  sections = sections.map((x) => Object.assign({}, x, { rows: Math.round(x.rows * rf) }));
  const w = o.w || 620, rowsTot = sections.reduce((a, s) => a + s.rows, 0), rh = o.rh || (fitto ? 19 : 30), rhh = fitto ? 9 : 12;
  const h = o.h || 140 + rowsTot * rh + sections.length * 18;
  const c = el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: 22, background: "linear-gradient(180deg,#232323,#171717)", border: "2px solid rgba(255,255,255,.85)", boxShadow: "0 0 26px rgba(255,255,255,.35), 0 0 90px rgba(255,255,255,.12), 0 30px 80px rgba(0,0,0,.6)", overflow: "hidden", zIndex: o.z || 12 });
  // blocco 2 del ritmo (opzioni in coda, default di prima): o.fsTitolo (40), o.fsLab (22), o.top (100: dove partono le sezioni)
  el(c, { position: "absolute", left: 0, top: 26, width: w, textAlign: "center", fontFamily: FH, fontSize: o.fsTitolo || 40, color: K.white }, o.title || "Copione");
  const PAL = ["#CFFB50", "#ffffff", "#9fd4ff", "#ffd27a", "#b9a3ff"];
  let y = o.top || 100;
  const secs = sections.map((s, si) => {
    const col = s.color || PAL[si % PAL.length];
    const mark = el(c, { position: "absolute", left: 30, top: y + 2, width: 18, height: 18, borderRadius: 4, background: col, boxShadow: `0 0 10px ${col}`, opacity: 0 });
    const lab = el(c, { position: "absolute", left: 58, top: y - 4, fontFamily: FS, fontWeight: 800, fontSize: o.fsLab || 22, color: col, opacity: 0, whiteSpace: o.fsLab ? "nowrap" : "normal" }, s.label);
    y += o.fsLab ? Math.round(o.fsLab * 1.35) : 30;
    const rows = [];
    for (let k = 0; k < s.rows; k++) {
      const ww = (w - 90) * (k === s.rows - 1 ? 0.62 : 0.9 + 0.1 * ((hash(si * 10 + k, 6) + 1) / 2) - 0.1);
      const base = el(c, { position: "absolute", left: 58, top: y + k * rh, width: ww, height: rhh, borderRadius: 4, background: "rgba(255,255,255,.18)" });
      const fillR = el(c, { position: "absolute", left: 58, top: y + k * rh, width: ww, height: rhh, borderRadius: 4, background: col, boxShadow: `0 0 10px ${col}`, transformOrigin: "0 50%" });
      gsap.set(fillR, { scaleX: 0 });
      rows.push({ base, fillR });
    }
    y += s.rows * rh + 18;
    return { mark, lab, rows, col };
  });
  const allBase = secs.flatMap((s) => s.rows.map((r) => r.base));
  gsap.set(allBase, { scaleX: 0, transformOrigin: "0 50%" });
  return {
    c, secs,
    // le righe grigie si stendono a cascata
    lay: (t) => allBase.forEach((b, i) => tl.to(b, { scaleX: 1, duration: 0.25, ease: "power2.out" }, t + i * (fitto ? 0.014 : 0.02))),
    // la sezione i si colora riga per riga (evidenziatore) con quadratino + etichetta
    section: (i, t, step) => {
      const s = secs[i];
      tl.to([s.mark, s.lab], { opacity: 1, duration: 0.2 }, t);
      s.rows.forEach((r, k) => tl.to(r.fillR, { scaleX: 1, duration: 0.3, ease: "power1.inOut" }, t + 0.1 + k * (step || (fitto ? 0.05 : 0.12))));
    },
    focus: (i, t) => secs.forEach((s, j) => tl.to([s.mark, s.lab, ...s.rows.map((r) => r.fillR), ...s.rows.map((r) => r.base)], { opacity: j === i ? 1 : 0.25, duration: 0.3 }, t)),
  };
};

// ═══ U01 · chat AI ricreata + prompt che si digita ══════════════════════════════════════════
// o: { logo:"claude"|"ai", saluto }
const chatUI = (parent, cx, cy, o) => {
  o = o || {};
  const w = o.w || 940;
  const logo = el(parent, { position: "absolute", left: cx - 50, top: cy - 230, width: 100, height: 100, zIndex: 13 }, o.logo === "claude"
    ? `<svg width="100" height="100" viewBox="0 0 100 100">${Array.from({ length: 12 }, (_, i) => `<rect x="47" y="8" width="6" height="40" rx="3" fill="#D97757" transform="rotate(${i * 30 + (i % 2) * 7} 50 50)"/>`).join("")}</svg>`
    : svg("sparkles", 100, K.lime, 1.6));
  logo.style.filter = o.logo === "claude" ? "drop-shadow(0 0 18px rgba(217,119,87,.6))" : "drop-shadow(0 0 18px rgba(207,251,80,.7))";
  const hi = el(parent, { position: "absolute", left: cx - w / 2, top: cy - 110, width: w, textAlign: "center", fontFamily: FD, fontWeight: 400, fontSize: 52, color: K.white, textShadow: GLOW_T, zIndex: 13 }, o.saluto || "Come posso aiutarti oggi?");
  const rowsMax = o.rows || 2, HB = 84 + rowsMax * 42;
  const bar = el(parent, { position: "absolute", left: cx - w / 2, top: cy + 10, width: w, height: HB, zIndex: 13 });
  const barBg = el(bar, { position: "absolute", left: 0, top: 0, width: w, height: HB, borderRadius: 26, background: "linear-gradient(180deg,#2c2c2c,#232323)", border: "1.5px solid rgba(255,255,255,.16)", boxShadow: "0 24px 60px rgba(0,0,0,.5)", transformOrigin: "50% 0%" });
  gsap.set(barBg, { scaleY: 84 / HB });
  const txt = el(bar, { position: "absolute", left: 30, top: 22, right: 110, fontFamily: FS, fontWeight: 500, fontSize: 32, color: K.white, lineHeight: 1.3 });
  const ph = el(bar, { position: "absolute", left: 30, top: 22, fontFamily: FS, fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,.35)" }, o.placeholder || "Scrivi qui…");
  const send = el(bar, { position: "absolute", right: 16, top: 14, width: 56, height: 56, borderRadius: "50%", background: o.logo === "claude" ? "#D97757" : K.lime, display: "flex", alignItems: "center", justifyContent: "center" }, svg("arrow-up", 30, o.logo === "claude" ? "#fff" : K.ink, 2.6));
  gsap.set([logo, hi], { opacity: 0 });
  gsap.set(bar, { scaleX: 0.18, opacity: 0 });
  return {
    show: (t) => { blurIn(logo, t, { y: 20, blur: 12, dur: 0.45, scale: 0.8 }); blurIn(hi, t + 0.12, { y: 16, blur: 10, dur: 0.4 }); tl.to(bar, { opacity: 1, duration: 0.15 }, t + 0.25); tl.to(bar, { scaleX: 1, duration: 0.3, ease: "power3.out" }, t + 0.25); },
    // il campo si apre in altezza e il prompt si scrive
    type: (t, text, cps) => {
      tl.to(barBg, { scaleY: 1, duration: 0.25, ease: "power2.out" }, t - 0.1);
      tl.to(ph, { opacity: 0, duration: 0.1 }, t - 0.05);
      return typeIn(txt, text, t, cps || 22, { caret: true, size: 32 });
    },
    sendAt: (t) => { tl.to(send, { scale: 0.85, duration: 0.08 }, t); tl.to(send, { scale: 1, duration: 0.25, ease: "back.out(3)" }, t + 0.08); },
  };
};

// ═══ O05 · piramide 3D a livelli (reel 23 di Kallaway) ═════════════════════════════════════════
// Ogni livello ha due facce — sinistra in luce, destra in ombra, divise dal crinale — e i livelli sono staccati da una
// fessura. Nasce in grafite lucida; .flag(i, t) accende il livello di lime (bagliore, piccolo colpo) e scrive la sua
// etichetta in fondo a una linea guida col pallino. labels dal basso.
// o: { w, h, gap, fs, lit (accesi da subito), ridge (crinale spostato a destra, frazione di w), labW, side (1 = tutte le
//      etichette a destra: piramide più grande nell'inquadratura · -1 a sinistra · default alternate), z }
// → { lv, build(t, step), flag(i, t), light(i, t), rect } (rect = piramide + etichette, da inquadrare)
const pyramid = (parent, S, cx, base, labels, o) => {
  o = o || {};
  const n = labels.length, W = o.w || 700, H = o.h || 640, gap = o.gap || 14, fs = o.fs || 34, z = o.z || 12;
  const lh = (H - gap * (n - 1)) / n, apex = base - H, kr = o.ridge == null ? 0.08 : o.ridge;
  const half = (y) => ((W / 2) * (y - apex)) / H;
  const rid = (y) => cx + (kr * W * (y - apex)) / H;
  const shadow = el(parent, { position: "absolute", left: cx - W * 0.62, top: base - 36, width: W * 1.24, height: 96, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.7), rgba(0,0,0,0))", zIndex: z - 3, opacity: 0 });
  const halo = el(parent, { position: "absolute", left: cx - W * 0.8, top: apex - H * 0.15, width: W * 1.6, height: H * 1.35, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(207,251,80,.16), rgba(207,251,80,.05) 55%, rgba(207,251,80,0))", opacity: 0, zIndex: z - 4 });
  const labW = o.labW || Math.round(Math.max(...labels.map((s) => s.length)) * fs * 0.6 + 64);
  const GA = "linear-gradient(180deg, #8a8a8a 0px, #8a8a8a 3px, #555 3px, #3a3a3a 55%, #2c2c2c 100%)";
  const GB = "linear-gradient(180deg, #5e5e5e 0px, #5e5e5e 3px, #2f2f2f 3px, #232323 60%, #1a1a1a 100%)";
  const LA = "linear-gradient(180deg, #f7ffd8 0px, #f7ffd8 4px, #e4ff8c 4px, #CFFB50 55%, #c0ec44 100%)";
  const LB = "linear-gradient(180deg, #e2f8a0 0px, #e2f8a0 4px, #b6df3e 4px, #a2cc32 55%, #8fb829 100%)";
  const lv = labels.map((tx, i) => {
    const yb = base - i * (lh + gap), yt = yb - lh, ym = yt + lh / 2;
    const x0 = cx - half(yb), x3 = cx + half(yb), x1 = cx - half(yt), x2 = cx + half(yt), rb = rid(yb), rt = rid(yt);
    const bx = x0, by = yt, bw = x3 - x0, bh = lh;
    const P = (pts) => `polygon(${pts.map(([x, y]) => `${(((x - bx) / bw) * 100).toFixed(3)}% ${(((y - by) / bh) * 100).toFixed(3)}%`).join(", ")})`;
    const pl = P([[x1, yt], [rt, yt], [rb, yb], [x0, yb]]), pr = P([[rt, yt], [x2, yt], [x3, yb], [rb, yb]]), pa = P([[x1, yt], [x2, yt], [x3, yb], [x0, yb]]);
    const face = (bg, poly, zz) => el(parent, { position: "absolute", left: bx, top: by, width: bw, height: bh, clipPath: poly, background: bg, zIndex: zz });
    const glow = clipGlow(parent, bx, by, bw, bh, pa, z - 1, 0);
    const gA = face(GA, pl, z), gB = face(GB, pr, z), lA = face(LA, pl, z + 1), lB = face(LB, pr, z + 1);
    gsap.set([lA, lB], { opacity: 0 });
    // il numero sta sulla faccia in luce, in basso nel livello (dove è più largo)
    const ny = yt + lh * (i === n - 1 ? 0.66 : 0.56), nfs = Math.round(Math.min(66, lh * 0.46));
    const num = el(parent, { position: "absolute", left: (x0 + rb) / 2 - 70, top: ny - nfs * 0.62, width: 140, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: nfs, lineHeight: 1.2, color: "rgba(255,255,255,.88)", textShadow: "0 2px 10px rgba(0,0,0,.45)", zIndex: z + 3 }, String(i + 1));
    // linea guida: pallino sulla faccia dal lato dell'etichetta → fuori dalla piramide → etichetta in un vetro
    // (con o.labelsR le etichette stanno tutte a sinistra e a destra c'è la pill del valore, come nel reel 4)
    const side = o.labelsR ? -1 : o.side ? o.side : i % 2 ? -1 : 1;
    const xd = side > 0 ? rid(ym) + (cx + half(ym) - rid(ym)) * 0.55 : cx - half(ym) * 0.7, xe = cx + side * (W / 2 + 46);
    const dot = el(parent, { position: "absolute", left: xd - 9, top: ym - 9, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff, 0 0 22px rgba(207,251,80,.8)", zIndex: z + 4, opacity: 0 });
    const cn = connector(S, [[xd, ym], [xe, ym]], { color: "rgba(255,255,255,.85)", w: 3 });
    const lab = el(parent, { position: "absolute", left: side > 0 ? xe : xe - labW, top: ym - fs * 0.95, width: labW, height: fs * 1.9, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, rgba(58,58,58,.95), rgba(30,30,30,.97))", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 16px 36px rgba(0,0,0,.5), inset 0 1.5px 0 rgba(255,255,255,.1)", fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, whiteSpace: "nowrap", zIndex: z + 4 });
    const words = tx.split(" ").map((wd, k, a) => el(lab, { display: "inline-block", whiteSpace: "pre" }, wd + (k < a.length - 1 ? " " : ""), "span"));
    gsap.set(lab, { opacity: 0 });
    gsap.set(words, { opacity: 0, filter: "blur(6px)" });
    // o.labelsR[i]: pill del valore a destra del livello (lime per il livello più alto), su una linea guida dalla faccia in ombra
    let labR = null, dotR = null, cnR = null;
    if (o.labelsR && o.labelsR[i] != null) {
      const xd2 = rid(ym) + (cx + half(ym) - rid(ym)) * 0.55, xe2 = cx + W / 2 + 46, topL = i === n - 1;
      dotR = el(parent, { position: "absolute", left: xd2 - 9, top: ym - 9, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff, 0 0 22px rgba(207,251,80,.8)", zIndex: z + 4, opacity: 0 });
      cnR = connector(S, [[xd2, ym], [xe2, ym]], { color: "rgba(255,255,255,.85)", w: 3 });
      labR = el(parent, { position: "absolute", left: xe2, top: ym - fs * 0.95, height: fs * 1.9, padding: `0 ${Math.round(fs * 0.6)}px`, borderRadius: 16, display: "flex", alignItems: "center", background: topL ? limeFill(1) : "linear-gradient(180deg, rgba(74,74,74,.97), rgba(40,40,40,.98))", border: topL ? "none" : "1.5px solid rgba(255,255,255,.22)", boxShadow: topL ? `${GLOW_A(0.75)}, 0 16px 36px rgba(0,0,0,.5)` : "0 16px 36px rgba(0,0,0,.5)", fontFamily: FD, fontWeight: 700, fontSize: Math.round(fs * 1.05), color: topL ? K.ink : K.white, whiteSpace: "nowrap", zIndex: z + 4 }, o.labelsR[i]);
      gsap.set(labR, { opacity: 0 });
    }
    const all = [gA, gB, lA, lB, num];
    gsap.set(all, { opacity: 0 });
    gsap.set([lA, lB], { opacity: 0 });
    return { gA, gB, lA, lB, num, glow, dot, cn, lab, words, all, side, ym, yt, yb, lit: false, labR, dotR, cnR };
  });
  const labRW = o.labelsR ? Math.round(Math.max(...o.labelsR.map((s) => String(s).length)) * fs * 0.66 + fs * 1.3) : 0;
  const light = (i, t) => {
    const l = lv[i];
    tl.to([l.lA, l.lB], { opacity: 1, duration: 0.22, ease: "power2.out" }, t);
    tl.to(l.num, { color: K.ink, textShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.2 }, t);
    tl.to(l.glow, { opacity: 0.55, duration: 0.3 }, t);
    tl.fromTo([l.gA, l.gB, l.lA, l.lB], { scale: 1.05 }, { scale: 1, duration: 0.4, ease: "back.out(2.4)", immediateRender: false }, t);
    tl.to(halo, { opacity: 1, duration: 0.5 }, t);
  };
  return {
    lv, rect: o.labelsR
      ? [cx - W / 2 - 46 - labW - 16, apex - 30, cx + W / 2 + 46 + labRW + 16, base + 40]
      : [cx - W / 2 - (o.side === 1 || n === 1 ? 24 : 46 + labW + 16), apex - 30, cx + W / 2 + (o.side === -1 ? 24 : 46 + labW + 16), base + 40],
    build: (t, step) => {
      tl.to(shadow, { opacity: 1, duration: 0.5 }, t);
      lv.forEach((l, i) => {
        const tt = t + i * (step || 0.15);
        tl.fromTo([l.gA, l.gB, l.num], { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.38, ease: "power3.out", immediateRender: false }, tt);
        tl.fromTo([l.lA, l.lB], { y: 34 }, { y: 0, duration: 0.38, ease: "power3.out", immediateRender: false }, tt);
        if (o.lit) light(i, tt + 0.2);
      });
    },
    light,
    flag: (i, t) => {
      const l = lv[i];
      light(i, t);
      tl.to(l.dot, { opacity: 1, duration: 0.12 }, t + 0.05);
      l.cn.draw(t + 0.08, 0.3, "power2.out");
      tl.fromTo(l.lab, { opacity: 0, x: l.side * -24, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.32, ease: "power3.out", immediateRender: false }, t + 0.25);
      l.words.forEach((wd, k) => { tl.to(wd, { opacity: 1, duration: 0.06 }, t + 0.32 + k * 0.1); tl.to(wd, { filter: "blur(0px)", duration: 0.2 }, t + 0.32 + k * 0.1); tl.set(wd, { filter: "none" }, t + 0.53 + k * 0.1); });
      tl.to(l.lab, { borderColor: "rgba(207,251,80,.75)", boxShadow: `0 16px 36px rgba(0,0,0,.5), ${GLOW_A(0.35)}`, duration: 0.3 }, t + 0.4);
      if (l.labR) {
        tl.to(l.dotR, { opacity: 1, duration: 0.12 }, t + 0.12);
        l.cnR.draw(t + 0.15, 0.28, "power2.out");
        tl.fromTo(l.labR, { opacity: 0, x: -20, scale: 0.8 }, { opacity: 1, x: 0, scale: 1, duration: 0.32, ease: "back.out(2.2)", immediateRender: false }, t + 0.36);
      }
    },
  };
};

// ═══ O20 · radar (reel 46 e 105 di Kallaway) ══════════════════════════════════════════════════
// Al centro il disco-profilo (foto profilo vera, nome, sotto-nome, bottone), due anelli sottili, uno spicchio luminoso che
// gira (360° in ~2,5 s) con puntini bianchi che si accendono al passaggio. .find(ang, tipo, etichetta) fa comparire sul bordo
// quello che lo spicchio trova (icona di piattaforma + etichetta), nell'istante in cui ci passa sopra.
// o: { user (foto in assets/avatars), nome, sotto, bottone, disc (raggio del disco / r, 0,53), blips: [[ang, k]], z }
// Ordine: .show(t) → .spin(t, dur, giri) → .find(...). Angoli in gradi, 0 = alto, senso orario.
const radar = (parent, cx, cy, r, o) => {
  o = o || {};
  const z = o.z || 9, rd = r * (o.disc || 0.53);
  const rings = [1, 0.78].map((k) => el(parent, { position: "absolute", left: cx - r * k, top: cy - r * k, width: r * 2 * k, height: r * 2 * k, borderRadius: "50%", border: "2px solid rgba(255,255,255,.26)", zIndex: z }));
  // strumento: croce sottile e tacche ogni 5° fuori dal bordo (lunghe ogni 30°), come un mirino radar
  const SR = r * 1.1;
  const scope = el(parent, { position: "absolute", left: cx - SR, top: cy - SR, width: SR * 2, height: SR * 2, zIndex: z, pointerEvents: "none" });
  el(scope, { position: "absolute", left: SR - r, top: SR - 0.75, width: r * 2, height: 1.5, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.14) 20%, rgba(255,255,255,.14) 80%, rgba(255,255,255,0))" });
  el(scope, { position: "absolute", left: SR - 0.75, top: SR - r, width: 1.5, height: r * 2, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.14) 20%, rgba(255,255,255,.14) 80%, rgba(255,255,255,0))" });
  for (let q = 0; q < 72; q++) {
    const long = q % 6 === 0;
    const arm = el(scope, { position: "absolute", left: SR, top: SR, width: 1, height: 1, transform: `rotate(${q * 5}deg)` });
    el(arm, { position: "absolute", left: long ? -1.5 : -1, top: -r * 1.085, width: long ? 3 : 2, height: long ? r * 0.06 : r * 0.03, borderRadius: 1, background: long ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)" });
  }
  gsap.set(scope, { opacity: 0 });
  // bordo d'attacco lime quasi bianco, scia che sfuma in un verde saturo (il lime trasparente sul nero diventa oliva)
  const sweep = el(parent, { position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "conic-gradient(from 0deg, rgba(40,190,60,0) 0deg, rgba(40,190,60,0) 292deg, rgba(60,205,55,.16) 312deg, rgba(110,232,60,.42) 334deg, rgba(185,250,80,.82) 352deg, #eeffb8 359.3deg, rgba(40,190,60,0) 360deg)", zIndex: z + 1, opacity: 0 });
  const B = (o.blips || [[18, 0.72], [64, 0.9], [101, 0.66], [122, 0.95], [150, 0.84], [196, 0.7], [243, 0.92], [262, 0.78], [282, 0.68], [331, 0.86]]).map(([a, k]) => {
    const rad = ((a - 90) * Math.PI) / 180;
    const b = el(parent, { position: "absolute", left: cx + Math.cos(rad) * r * k - 7, top: cy + Math.sin(rad) * r * k - 7, width: 14, height: 14, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff, 0 0 22px rgba(207,251,80,.8)", opacity: 0, zIndex: z + 2 });
    return { b, a };
  });
  const disc = el(parent, { position: "absolute", left: cx - rd, top: cy - rd, width: rd * 2, height: rd * 2, borderRadius: "50%", background: "radial-gradient(circle at 50% 30%, #5c5c5c 0%, #484848 58%, #3c3c3c 100%)", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 30px 70px rgba(0,0,0,.55), inset 0 1.5px 0 rgba(255,255,255,.12)", zIndex: z + 3 });
  const ad = rd * 0.84;
  const av = el(disc, { position: "absolute", left: rd - ad / 2, top: rd * 0.2, width: ad, height: ad, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,.9)", boxShadow: "0 10px 24px rgba(0,0,0,.45)", background: "#222" });
  if (o.user) imgIn(av, "av-" + o.user, { objectFit: "cover" });
  const nm = el(disc, { position: "absolute", left: 0, top: rd * 1.1, width: rd * 2, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(rd * 0.14), color: "#fff", whiteSpace: "nowrap" }, o.nome || "");
  const sb = el(disc, { position: "absolute", left: 0, top: rd * 1.3, width: rd * 2, textAlign: "center", fontFamily: FS, fontWeight: 500, fontSize: Math.round(rd * 0.1), color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }, o.sotto || "");
  const bt = el(disc, { position: "absolute", left: rd * 0.64, top: rd * 1.5, width: rd * 0.72, height: rd * 0.22, borderRadius: rd * 0.07, background: K.lime, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(rd * 0.1), color: K.ink }, o.bottone || "Segui");
  let T0 = 0, GIRO = 2.5;
  const found = [];
  return {
    sweep, rings, disc, av, found,
    all: () => [...rings, scope, sweep, disc, ...B.map((x) => x.b), ...found.flatMap((f) => [f.ic, f.lb].filter(Boolean))],
    show: (t) => {
      rings.forEach((g, i) => tl.fromTo(g, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: "expo.out" }, t + i * 0.06));
      tl.fromTo(scope, { opacity: 0, rotation: -25, scale: 0.9 }, { opacity: 1, rotation: 0, scale: 1, duration: 0.7, ease: "expo.out", immediateRender: false }, t + 0.05);
      blurIn(disc, t, { y: 0, blur: 12, scale: 0.8, dur: 0.4 });
      blurIn([nm, sb, bt], t + 0.18, { y: 12, blur: 8, dur: 0.3, stagger: 0.06 });
    },
    spin: (t, dur, giri) => {
      giri = giri || 1; T0 = t; GIRO = dur / giri;
      tl.set(sweep, { opacity: 1 }, t);
      tl.fromTo(sweep, { rotation: 0 }, { rotation: 360 * giri, duration: dur, ease: "none", immediateRender: false }, t);
      tl.to(sweep, { opacity: 0, duration: 0.3 }, t + dur);
      for (let g = 0; g < giri; g++) B.forEach(({ b, a }) => { const tb = t + (g + a / 360) * GIRO + 0.02; tl.to(b, { opacity: 1, duration: 0.05 }, tb); tl.to(b, { opacity: 0, duration: 0.8, ease: "power1.in" }, tb + 0.08); });
    },
    find: (ang, kind, label, o2) => {
      o2 = o2 || {};
      const rad = ((ang - 90) * Math.PI) / 180, x = cx + Math.cos(rad) * r, y = cy + Math.sin(rad) * r, s = o2.size || Math.round(r * 0.26);
      const tf = T0 + (ang / 360) * GIRO;
      const ic = brandIcon(parent, x, y, s, kind, z + 6);
      tl.fromTo(ic, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.6)" }, tf);
      ripple(parent, x, y, tf + 0.02, { r: s * 0.75, s0: 0.6, s1: 1.7, w: 3, dur: 0.5, z: z + 5 });
      let lb = null;
      if (label) {
        lb = el(parent, { position: "absolute", left: x - 150, top: y + s / 2 + 12, width: 300, textAlign: "center", zIndex: z + 6 });
        el(lb, { display: "inline-block", padding: "8px 18px", borderRadius: 14, background: "rgba(22,22,22,.94)", border: "1.5px solid rgba(207,251,80,.65)", fontFamily: FS, fontWeight: 800, fontSize: Math.round(s * 0.27), color: K.white, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,.45)" }, label);
        blurIn(lb, tf + 0.1, { y: 10, blur: 8, dur: 0.3 });
      }
      found.push({ ic, lb, t: tf });
      return { ic, lb, t: tf };
    },
    // compatibilità: un elemento qualsiasi compare quando lo spicchio passa sul suo angolo
    reveal: (node, t, ang, dur) => tl.fromTo(node, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.5)", immediateRender: false }, t + (ang / 360) * dur),
  };
};

// ═══ O04 · elementi in orbita su un cerchio tratteggiato ═══════════════════════════════════
const orbit = (parent, cx, cy, r, nodes, o) => {
  o = o || {};
  const ring = el(parent, { position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", border: "2px dashed rgba(255,255,255,.22)", zIndex: 9 });
  const arm = el(parent, { position: "absolute", left: cx, top: cy, width: 1, height: 1, zIndex: 12 });
  nodes.forEach((nd, i) => {
    const a = (i / nodes.length) * Math.PI * 2;
    const holder = el(arm, { position: "absolute", left: Math.cos(a) * r, top: Math.sin(a) * r, width: 1, height: 1 });
    holder.appendChild(nd);
    nd._holder = holder;
  });
  return {
    ring, arm,
    spin: (t, dur, gradi) => {
      tl.fromTo(arm, { rotation: 0 }, { rotation: gradi || 90, duration: dur, ease: "none", immediateRender: false }, t);
      nodes.forEach((nd) => tl.fromTo(nd._holder, { rotation: 0 }, { rotation: -(gradi || 90), duration: dur, ease: "none", immediateRender: false }, t)); // restano dritti
    },
  };
};

// ═══ O01 · anello di reel veri che si apre e ruota (reel 13 e 14 di Kallaway) ══════════════════════
// ids: id dei <video> del pool · o: { r (raggio finale ~370), w (card 9:16, ~120–160), r0 (raggio iniziale ~60), z }
// .open(t) le card partono raggruppate e si aprono in 0,3 s (expo.out) · .spin(t, dur, °/s) rotazione lenta oraria (~22°/s),
// le card restano sempre dritte · .close(t) si richiudono al centro.
const reelRing = (parent, cx, cy, ids, o) => {
  o = o || {};
  const R = o.r || 370, w = o.w || 150, h = Math.round(w * 16 / 9), r0 = o.r0 || 60, z = o.z || 10;
  const ring = el(parent, { position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: "50%", border: "2px dashed rgba(255,255,255,.3)", zIndex: z - 1 });
  gsap.set(ring, { scale: r0 / R, opacity: 0 });
  const cards = ids.map((id) => {
    const wrap = el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z });
    const body = el(wrap, { position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: Math.round(w * 0.1), overflow: "hidden", border: "2px solid rgba(255,255,255,.32)", boxShadow: "0 18px 40px rgba(0,0,0,.6), 0 0 18px rgba(255,255,255,.07)", background: "#111" });
    videoTile(body, 0, 0, w, h, id, 1);
    return { wrap, body };
  });
  const P = { a: o.a0 == null ? -Math.PI / 2 : o.a0, rr: r0 };
  const put = () => cards.forEach((c, i) => {
    const a = P.a + (i / cards.length) * Math.PI * 2;
    gsap.set(c.wrap, { x: Math.cos(a) * P.rr, y: Math.sin(a) * P.rr });
  });
  put();
  gsap.set(cards.map((c) => c.wrap), { opacity: 0, scale: 0.7 });
  let aNow = P.a;
  return {
    ring, cards,
    // ease in coda (blocco 1 del rifacimento: Kallaway apre in ~0,85 s power1.out, t90 0,67 s); default di prima expo.out
    open: (t, dur, ease) => {
      dur = dur || 0.32;
      const e = ease || "expo.out";
      tl.to(cards.map((c) => c.wrap), { opacity: 1, duration: 0.1 }, t);
      tl.to(cards.map((c) => c.wrap), { scale: 1, duration: dur + 0.12, ease: e }, t);
      tl.fromTo(P, { rr: r0 }, { rr: R, duration: dur, ease: e, onUpdate: put, immediateRender: false }, t);
      tl.to(ring, { opacity: 1, scale: 1, duration: dur, ease: e }, t);
    },
    spin: (t, dur, degPerSec) => {
      const dps = degPerSec || 22, a1 = aNow + (dps * Math.PI / 180) * dur;
      tl.fromTo(P, { a: aNow }, { a: a1, duration: dur, ease: "none", onUpdate: put, immediateRender: false }, t);
      tl.fromTo(ring, { rotation: (aNow - (o.a0 == null ? -Math.PI / 2 : o.a0)) * 180 / Math.PI }, { rotation: (a1 - (o.a0 == null ? -Math.PI / 2 : o.a0)) * 180 / Math.PI, duration: dur, ease: "none", immediateRender: false }, t);
      aNow = a1;
    },
    close: (t, dur) => {
      dur = dur || 0.35;
      tl.fromTo(P, { rr: R }, { rr: r0 * 0.5, duration: dur, ease: "power3.in", onUpdate: put, immediateRender: false }, t);
      tl.to(cards.map((c) => c.wrap), { scale: 0.6, opacity: 0, duration: dur, ease: "power3.in" }, t);
      tl.to(ring, { scale: r0 / R, opacity: 0, duration: dur, ease: "power3.in" }, t);
    },
    // "di tutto": l'anello accelera e scaglia i reel in ogni direzione (raggio × 3,5 in power3.in), che svaniscono
    fling: (t, dur) => {
      dur = dur || 0.6;
      const a1 = aNow + 1.9;
      tl.fromTo(P, { a: aNow, rr: R }, { a: a1, rr: R * 3.6, duration: dur, ease: "power3.in", onUpdate: put, immediateRender: false }, t);
      tl.to(cards.map((c) => c.wrap), { opacity: 0, duration: 0.25, stagger: 0.02 }, t + dur * 0.55);
      tl.to(ring, { opacity: 0, scale: 1.4, duration: dur * 0.6, ease: "power2.in" }, t);
      aNow = a1;
    },
    // fuori fuoco (la risposta è il punto, non i reel) / di nuovo a fuoco
    defocus: (t, a) => tl.to(cards.map((c) => c.body), { filter: "blur(7px)", opacity: a == null ? 0.4 : a, duration: 0.45, ease: "power2.out", stagger: 0.012 }, t),
    refocus: (t) => { tl.to(cards.map((c) => c.body), { filter: "blur(0px)", opacity: 1, duration: 0.25 }, t); tl.set(cards.map((c) => c.body), { filter: "none" }, t + 0.26); },
  };
};

// ═══ planner settimanale (O24 in riga · reel 68 di Kallaway): un contenitore di vetro con i giorni, celle 9:16 vuote
// (tratteggiate) dove "cadono" i reel veri quando il giorno viene detto, ognuno con la sua etichetta di tema.
// giorni: ["LUN", "MAR", …] · o: { cw (larghezza cella), gap, pad, z }
// .dayOn(i, t) il giorno si accende · .drop(i, t, idVideo, etichetta, icona, colore) il reel cade nel giorno
// .cellXY(i) centro della cella (parent) · .cells · .rect · .box
const weekPlan = (parent, cx, cy, giorni, o) => {
  o = o || {};
  const n = giorni.length, cw = o.cw || 180, ch = Math.round((cw * 16) / 9), g = o.gap || 18, pad = o.pad || 30, hh = 92, chipH = 64;
  const W = n * cw + (n - 1) * g + pad * 2, H = pad + hh + ch + 18 + chipH + pad;
  const x0 = cx - W / 2, y0 = cy - H / 2;
  const box = glass(parent, x0, y0, W, H, { zIndex: o.z || 11, borderRadius: 34, overflow: "visible" });
  const cells = giorni.map((d, i) => {
    const x = pad + i * (cw + g);
    const hd = el(box, { position: "absolute", left: x, top: pad + 6, width: cw, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: 46, color: "rgba(255,255,255,.4)", lineHeight: 1, whiteSpace: "nowrap" }, d);
    const dot = el(box, { position: "absolute", left: x + cw / 2 - 7, top: pad + 62, width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,.25)" });
    const slot = el(box, { position: "absolute", left: x, top: pad + hh, width: cw, height: ch, borderRadius: 18, border: "2.5px dashed rgba(255,255,255,.18)", background: "rgba(255,255,255,.025)", display: "flex", alignItems: "center", justifyContent: "center" }, svg("plus", 44, "rgba(255,255,255,.22)", 2));
    const tile = el(box, { position: "absolute", left: x, top: pad + hh, width: cw, height: ch, borderRadius: 18, overflow: "hidden", background: "#111", border: "2px solid rgba(255,255,255,.28)", boxShadow: "0 18px 40px rgba(0,0,0,.55)", zIndex: 3 });
    gsap.set(tile, { opacity: 0 });
    const chip = el(box, { position: "absolute", left: x - 14, top: pad + hh + ch + 18, width: cw + 28, height: chipH, borderRadius: chipH / 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(180deg,#3b3b3b,#262626)", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 12px 26px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: 25, color: K.white, whiteSpace: "nowrap", zIndex: 4 });
    gsap.set(chip, { opacity: 0 });
    return { hd, dot, slot, tile, chip, x };
  });
  return {
    box, cells, W, H, rect: [x0 - 10, y0 - 10, x0 + W + 10, y0 + H + 10],
    cellXY: (i) => [x0 + cells[i].x + cw / 2, y0 + pad + hh + ch / 2],
    dayOn: (i, t) => {
      const c = cells[i];
      tl.to(c.hd, { color: K.white, textShadow: GLOW_T, duration: 0.2 }, t);
      tl.to(c.dot, { backgroundColor: K.lime, boxShadow: GLOW_A(0.8), duration: 0.2 }, t);
      tl.fromTo(c.dot, { scale: 1.8 }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, t);
    },
    // L01 applicato al planner: tutti i reel sono già nei giorni, sfocati e spenti (non ancora detti)…
    ghost: (t, ids) => ids.forEach((id, i) => {
      const c = cells[i];
      if (!id) return;
      videoTile(c.tile, 0, 0, cw, ch, id, 1);
      gsap.set(c.tile, { filter: "blur(11px)", scale: 0.96 });
      tl.fromTo(c.tile, { opacity: 0 }, { opacity: 0.42, duration: 0.3, immediateRender: false }, t + i * 0.04);
      tl.to(c.slot, { opacity: 0, duration: 0.2 }, t);
    }),
    // …e ognuno va a fuoco quando viene detto: nitido, piccolo colpo, bordo che lampeggia, etichetta del tema
    resolve: (i, t, label, icon, col) => {
      const c = cells[i];
      tl.to(c.tile, { opacity: 1, filter: "blur(0px)", duration: 0.32, ease: "power2.out" }, t);
      tl.set(c.tile, { filter: "none" }, t + 0.33);
      tl.fromTo(c.tile, { scale: 0.96 }, { scale: 1, duration: 0.42, ease: "back.out(2.6)", immediateRender: false }, t);
      tl.to(c.tile, { borderColor: "rgba(255,255,255,.95)", boxShadow: "0 18px 40px rgba(0,0,0,.55), 0 0 26px rgba(255,255,255,.25)", duration: 0.08 }, t + 0.05);
      tl.to(c.tile, { borderColor: "rgba(255,255,255,.28)", boxShadow: "0 18px 40px rgba(0,0,0,.55)", duration: 0.4 }, t + 0.2);
      c.chip.innerHTML = `<span style="width:16px;height:16px;border-radius:50%;background:${col || K.lime};display:inline-block;box-shadow:0 0 10px ${col || K.lime}"></span>` + (icon ? svg(icon, 26, K.white, 2.2) : "") + label;
      tl.fromTo(c.chip, { opacity: 0, y: 14, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, t + 0.12);
    },
    drop: (i, t, id, label, icon, col) => {
      const c = cells[i];
      videoTile(c.tile, 0, 0, cw, ch, id, 1);
      // il blur non deve stare sulla curva che rimbalza (un blur negativo è CSS non valido e resta l'ultimo valore)
      tl.fromTo(c.tile, { opacity: 0, y: -90, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.6)", immediateRender: false }, t);
      tl.fromTo(c.tile, { filter: "blur(14px)" }, { filter: "blur(0px)", duration: 0.3, ease: "power2.out", immediateRender: false }, t);
      tl.set(c.tile, { filter: "none" }, t + 0.43);
      tl.to(c.tile, { borderColor: "rgba(255,255,255,.95)", duration: 0.08 }, t + 0.3);
      tl.to(c.tile, { borderColor: "rgba(255,255,255,.28)", duration: 0.35 }, t + 0.4);
      tl.to(c.slot, { opacity: 0, duration: 0.2 }, t + 0.25);
      c.chip.innerHTML = `<span style="width:16px;height:16px;border-radius:50%;background:${col || K.lime};display:inline-block;box-shadow:0 0 10px ${col || K.lime}"></span>` + (icon ? svg(icon, 26, K.white, 2.2) : "") + label;
      tl.fromTo(c.chip, { opacity: 0, y: 14, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, t + 0.22);
    },
  };
};

// ═══ O02 · anello di loghi che esplode dal centro e implode nel protagonista (reel 98) ══════════
// icons: elementi (es. brandIcon) già creati al centro (cx, cy) in un layer; o: { r, w (spessore del tubo) }
// .burst(t) · .spin(t, dur, radianti) · .implode(t, scalaFinale) — l'anello stretto resta come bordo luminoso del protagonista
const logoRing = (parent, cx, cy, icons, o) => {
  o = o || {};
  const r = o.r || 320, w = o.w || 20;
  // tubo al neon pieno con alone dentro e fuori (mai lime trasparente: diventa oliva) + filo di luce bianca al centro
  const ring = el(parent, { position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `${w}px solid #CFFB50`, boxShadow: "0 0 26px rgba(207,251,80,.75), 0 0 90px rgba(207,251,80,.35), inset 0 0 26px rgba(207,251,80,.7), inset 0 0 70px rgba(207,251,80,.22)", zIndex: 9 });
  el(ring, { position: "absolute", left: -w / 2 - 1.5, top: -w / 2 - 1.5, right: -w / 2 - 1.5, bottom: -w / 2 - 1.5, borderRadius: "50%", border: "3px solid rgba(255,255,255,.55)" });
  gsap.set(ring, { scale: 0.1, opacity: 0 });
  const P = { a: 0, rr: 0.05 };
  const put = () => icons.forEach((ic, i) => {
    const a = P.a + (i / icons.length) * Math.PI * 2;
    gsap.set(ic, { x: Math.cos(a) * r * P.rr, y: Math.sin(a) * r * P.rr });
  });
  put();
  return {
    ring,
    burst: (t) => { tl.to(ring, { scale: 1, opacity: 1, duration: 0.35, ease: "expo.out" }, t); tl.to(P, { rr: 1, duration: 0.3, ease: "expo.out", onUpdate: put }, t); },
    spin: (t, dur, rad) => tl.to(P, { a: P.a + (rad || 1), duration: dur, ease: "none", onUpdate: put }, t),
    implode: (t, s) => { tl.to(P, { rr: 0.02, a: "+=3", duration: 0.32, ease: "power3.in", onUpdate: put }, t); tl.to(icons, { opacity: 0, scale: 0.5, duration: 0.1 }, t + 0.26); tl.to(ring, { scale: s || 0.55, duration: 0.3, ease: "power3.in" }, t); },
  };
};

// ═══ O15 · clessidra che si svuota e si capovolge (reel 60 di Kallaway) ═══════════════════════════════════════════════
// Clessidra di vetro (bordo chiaro, riflesso) con i tappi in grafite e la sabbia lime piena: .run(t, dur) la sabbia scende
// (in alto il cono si abbassa verso il collo, sotto il mucchio cresce, filo di sabbia nel mezzo) · .flip(t) si capovolge in
// 0,5 s (misurato) e riparte piena: siccome le due metà sono simmetriche, a fine giro si torna a 0° con la sabbia in alto senza
// salti. cx, cy = centro (il collo) · h = altezza totale · o: { w (0.62·h), z }
const hourglass = (parent, cx, cy, h, o) => {
  o = o || {};
  const w = o.w || Math.round(h * 0.62), z = o.z || 12, hb = h / 2 - 34, neck = 14;
  const g = layered(el(parent, { position: "absolute", left: cx, top: cy, width: 1, height: 1, zIndex: z }));
  const SV = svgIn(g, 1, 1);
  const half = w / 2 - 18;
  // vetro: due bulbi (triangoli smussati) con il collo stretto
  const glassD = `M${-half} ${-hb} L${half} ${-hb} C${half} ${-hb * 0.35}, ${neck} ${-hb * 0.12}, ${neck} 0 C${neck} ${hb * 0.12}, ${half} ${hb * 0.35}, ${half} ${hb} L${-half} ${hb} C${-half} ${hb * 0.35}, ${-neck} ${hb * 0.12}, ${-neck} 0 C${-neck} ${-hb * 0.12}, ${-half} ${-hb * 0.35}, ${-half} ${-hb} Z`;
  const gid = "hg" + ++SVGN;
  SV._defs.insertAdjacentHTML("beforeend", `<linearGradient id="${gid}v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".16"/><stop offset=".35" stop-color="#ffffff" stop-opacity=".05"/><stop offset=".75" stop-color="#ffffff" stop-opacity=".03"/><stop offset="1" stop-color="#ffffff" stop-opacity=".12"/></linearGradient><linearGradient id="${gid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaffa6"/><stop offset=".45" stop-color="#CFFB50"/><stop offset="1" stop-color="#b5e03c"/></linearGradient><clipPath id="${gid}c"><path d="${glassD}"/></clipPath>`);
  pathEl(SV, glassD, { fill: `url(#${gid}v)` });
  // sabbia: cono in alto (punta sul collo) e mucchio in basso (base sul fondo), entrambi dentro il vetro
  const sandG = document.createElementNS(NS, "g");
  sandG.setAttribute("clip-path", `url(#${gid}c)`);
  SV.appendChild(sandG);
  const topS = pathEl(sandG, `M${-half} ${-hb + 18} L${half} ${-hb + 18} L0 ${-4} Z`, { fill: `url(#${gid}s)` });
  const botS = pathEl(sandG, `M${-half} ${hb} L${half} ${hb} L0 ${4} Z`, { fill: `url(#${gid}s)` });
  const stream = pathEl(sandG, `M0 -6 L0 ${hb}`, { stroke: K.lime, "stroke-width": 6, opacity: 0 });
  [topS, botS].forEach((p) => (p.style.filter = "drop-shadow(0 0 10px rgba(207,251,80,.55))"));
  gsap.set(topS, { svgOrigin: "0 -4", scale: 1 });
  gsap.set(botS, { svgOrigin: `0 ${hb}`, scaleY: 0 });
  // contorno del vetro + riflesso
  const rim = pathEl(SV, glassD, { fill: "none", stroke: "rgba(255,255,255,.75)", "stroke-width": 4 });
  rim.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,.35))";
  pathEl(SV, `M${-half + 22} ${-hb + 26} C${-half + 22} ${-hb * 0.45}, ${-neck - 18} ${-hb * 0.2}, ${-neck - 6} -26`, { fill: "none", stroke: "rgba(255,255,255,.42)", "stroke-width": 5, "stroke-linecap": "round" });
  // tappi in grafite
  const cap = (y) => el(g, { position: "absolute", left: -w / 2, top: y - 17, width: w, height: 34, borderRadius: 14, background: "linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 45%, #222 100%)", border: "1.5px solid rgba(255,255,255,.25)", boxShadow: "0 12px 26px rgba(0,0,0,.5), inset 0 1.5px 0 rgba(255,255,255,.25)" });
  cap(-hb - 17); cap(hb + 17);
  gsap.set(g, { opacity: 0 });
  return {
    g, rect: [cx - w / 2 - 20, cy - h / 2 - 20, cx + w / 2 + 20, cy + h / 2 + 20],
    show: (t) => { tl.fromTo(g, { opacity: 0, scale: 0.8, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, t); tl.set(g, { filter: "none" }, t + 0.46); },
    // la sabbia scende in dur secondi (lineare, come il tempo che passa)
    run: (t, dur) => {
      tl.set(stream, { attr: { opacity: 1 } }, t);
      tl.fromTo(topS, { scale: 1 }, { scale: 0, duration: dur, ease: "none", immediateRender: false }, t);
      tl.fromTo(botS, { scaleY: 0 }, { scaleY: 1, duration: dur, ease: "none", immediateRender: false }, t);
      tl.set(stream, { attr: { opacity: 0 } }, t + dur);
    },
    // si capovolge (0,5 s, power2.inOut) e torna a 0° con la sabbia di nuovo in alto
    flip: (t) => {
      tl.fromTo(g, { rotation: 0 }, { rotation: 180, duration: 0.5, ease: "power2.inOut", immediateRender: false }, t);
      tl.set(g, { rotation: 0 }, t + 0.5);
      tl.set(topS, { scale: 1 }, t + 0.5);
      tl.set(botS, { scaleY: 0 }, t + 0.5);
    },
  };
};

// ═══ O11 · Venn che si forma (reel 39 e 106 di Kallaway) ══════════════════════════════════════════════════════════════
// Due cerchi di vetro (mai lime trasparente): il primo nasce, il secondo arriva accanto, poi si sovrappongono e
// l'intersezione si riempie di lime pieno con la sua etichetta (con il lampeggio di attivazione F05).
// o: { fs (32), label (testo dell'intersezione), ov (metà distanza tra i centri a fine incontro, 0.55·r), z }
// → { A, B, lens, one(t), two(t), meet(t), lensOn(t) }
const venn = (parent, cx, cy, r, a, b, o) => {
  o = o || {};
  const z = o.z || 12, ov = o.ov || r * 0.55, fs = o.fs || 32;
  const mk = (txt, side) => {
    const c = el(parent, { position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, rgba(255,255,255,.16), rgba(255,255,255,.05) 60%, rgba(255,255,255,.08) 100%)", border: side ? "3px solid rgba(207,251,80,.9)" : "3px solid rgba(255,255,255,.85)", boxShadow: side ? `${GLOW_A(0.45)}, inset 0 0 40px rgba(255,255,255,.06)` : "0 0 22px rgba(255,255,255,.25), inset 0 0 40px rgba(255,255,255,.06)", zIndex: z });
    // l'etichetta sta nella parte del cerchio che resta fuori dall'intersezione
    el(c, { position: "absolute", left: side ? r * 0.92 : r * 0.12, top: r - fs * 1.4, width: r * 0.96, height: fs * 2.8, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: fs, lineHeight: 1.12, color: K.white, textShadow: GLOW_T }, txt);
    gsap.set(c, { opacity: 0, scale: 0.6 });
    return c;
  };
  const A = mk(a, 0), B = mk(b, 1);
  // la lente: intersezione dei due cerchi a fine incontro (centri in cx ± ov)
  const hh = Math.sqrt(r * r - ov * ov);
  const lw = 2 * (r - ov);
  const SV = svgIn(el(parent, { position: "absolute", left: cx, top: cy, width: 1, height: 1, zIndex: z + 1 }), 1, 1);
  const lens = pathEl(SV, `M0 ${(-hh).toFixed(1)} A${r} ${r} 0 0 1 0 ${hh.toFixed(1)} A${r} ${r} 0 0 1 0 ${(-hh).toFixed(1)} Z`, { fill: K.lime });
  lens.style.filter = "drop-shadow(0 0 18px rgba(207,251,80,.75))";
  const lab = o.label ? el(parent, { position: "absolute", left: cx - lw / 2 - 30, top: cy - fs * 1.5, width: lw + 60, height: fs * 3, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(fs * 0.9), lineHeight: 1.1, color: K.ink, zIndex: z + 2 }, o.label) : null;
  gsap.set(lens, { opacity: 0 });
  if (lab) gsap.set(lab, { opacity: 0 });
  return {
    A, B, lens, lab,
    one: (t) => tl.to(A, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }, t),
    two: (t, dx) => { tl.to(A, { x: -(dx || r * 1.12), duration: 0.3, ease: "power3.inOut" }, t); tl.set(B, { x: dx || r * 1.12 }, t); tl.to(B, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }, t + 0.1); },
    meet: (t) => { tl.to(A, { x: -ov, duration: 0.5, ease: "power3.inOut" }, t); tl.to(B, { x: ov, duration: 0.5, ease: "power3.inOut" }, t); },
    // F05: l'intersezione lampeggia (lime / spento ogni 2 fotogrammi per 0,3 s) e resta accesa
    lensOn: (t) => { flicker(lens, t, { opacity: 0 }, { opacity: 1 }, 0.3); if (lab) flicker(lab, t, { opacity: 0 }, { opacity: 1 }, 0.3); },
  };
};

// ═══ L13 · confronto "pieno" (reel 29 e 123 di Kallaway) ═════════════════════════════════════
// Due card alte affiancate: intestazione, griglia di reel veri con badge views, righe ✗ / ✓. A = sbagliato (grigio,
// desaturato), B = giusto (lime). A/B: { titolo, vids: [6 id del pool], views: [6 testi], righe: [testi] }
// o: { w (larghezza di una card, 450), gap, cols (3) } · .show(t) cascata · .verdict(t) A si spegne, B si accende
const versusCards = (parent, cx, top, A, B, o) => {
  o = o || {};
  const w = o.w || 450, gap = o.gap || 40, pad = 24, cols = o.cols || 3, tg = 10, hh = 84, rh = 80, rg = 14;
  const tw = (w - pad * 2 - tg * (cols - 1)) / cols, th = (tw * 16) / 9;
  const mk = (S, x, good) => {
    const nr = Math.ceil(S.vids.length / cols), gridH = nr * th + (nr - 1) * tg, rowsH = S.righe.length * rh + (S.righe.length - 1) * rg;
    const h = pad + hh + 22 + gridH + 26 + rowsH + pad;
    const c = glass(parent, x, top, w, h, { zIndex: 12, border: good ? "2px solid rgba(207,251,80,.6)" : "1.5px solid rgba(255,255,255,.14)", boxShadow: "0 34px 90px rgba(0,0,0,.6), 0 0 0px rgba(207,251,80,0), 0 0 0px rgba(207,251,80,0)", filter: "grayscale(0) blur(0px)" });
    const hd = el(c, { position: "absolute", left: pad, top: pad, width: w - pad * 2, height: hh, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: FD, fontWeight: 700, fontSize: 42, color: good ? K.ink : "rgba(255,255,255,.78)", background: good ? limeFill(1) : "linear-gradient(180deg,#3c3c3c,#2b2b2b)", boxShadow: good ? GLOW_A(0.5) : "none", whiteSpace: "nowrap" }, svg(good ? "check" : "x", 36, good ? K.ink : "rgba(255,255,255,.6)", 3.2) + S.titolo);
    const tiles = S.vids.map((id, i) => {
      const tx = pad + (i % cols) * (tw + tg), ty = pad + hh + 22 + Math.floor(i / cols) * (th + tg);
      const t0 = el(c, { position: "absolute", left: tx, top: ty, width: tw, height: th, borderRadius: 12, overflow: "hidden", background: "#111", border: "1.5px solid rgba(255,255,255,.14)", filter: good ? "none" : "grayscale(.75) brightness(.72)" });
      videoTile(t0, 0, 0, tw, th, id, 1);
      const bd = S.views && S.views[i] ? viewBadge(c, tx + tw / 2, ty + th - 24, S.views[i], { fs: 19, dark: !good, z: 6 }) : null;
      return { t0, bd };
    });
    const rows = S.righe.map((txt, k) => el(c, { position: "absolute", left: pad, top: pad + hh + 22 + gridH + 26 + k * (rh + rg), width: w - pad * 2, height: rh, borderRadius: 14, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", background: "linear-gradient(90deg,#2b2b2b,#212121)", border: `1.5px solid ${good ? "rgba(207,251,80,.4)" : "rgba(255,255,255,.08)"}`, fontFamily: FS, fontWeight: 700, fontSize: 27, color: good ? K.white : "rgba(255,255,255,.55)", whiteSpace: "nowrap" }, svg(good ? "check" : "x", 30, good ? K.lime : "rgba(255,255,255,.4)", 3) + txt));
    gsap.set(c, { opacity: 0 });
    return { c, hd, tiles, rows, h };
  };
  const a = mk(A, cx - gap / 2 - w, false), b = mk(B, cx + gap / 2, true);
  const H = Math.max(a.h, b.h);
  return {
    a, b, H, rect: [cx - gap / 2 - w - 10, top - 10, cx + gap / 2 + w + 10, top + H + 10],
    show: (t) => {
      [a, b].forEach((s, si) => {
        const t1 = t + si * 0.1;
        blurIn(s.c, t1, { y: 34, blur: 14, dur: 0.45, scale: 0.97 });
        s.tiles.forEach((x, i) => blurIn(x.t0, t1 + 0.15 + i * 0.035, { y: 18, blur: 10, dur: 0.35 }));
        popSeq(s.tiles.filter((x) => x.bd).map((x) => x.bd), t1 + 0.45, 0.05);
        s.rows.forEach((r, k) => blurIn(r, t1 + 0.75 + k * 0.22, { y: 16, blur: 10, dur: 0.35 }));
      });
    },
    verdict: (t) => {
      tl.to(a.c, { opacity: 0.5, filter: "grayscale(1) blur(1.5px)", duration: 0.4, ease: "power2.out" }, t);
      tl.to(b.c, { scale: 1.03, boxShadow: `0 34px 90px rgba(0,0,0,.6), ${GLOW_A(0.8)}`, duration: 0.4, ease: "power2.out" }, t);
    },
  };
};

// ═══ L14 · A01 · muro di reel veri (reel 109 e 120 di Kallaway) ══════════════════════════════
// Contenitore arrotondato con una griglia di reel veri (ids in ordine di riga), etichette di colonna e badge views che
// poppano in sequenza. o: { cols, tw, th, gap, heads: [...], views: [...] } · .show(t) · .rect = rettangolo da inquadrare
const reelWall = (parent, cx, cy, ids, o) => {
  o = o || {};
  const cols = o.cols || 3, tw = o.tw || 270, th = o.th || 340, g = o.gap || 18, pad = 30, hh = o.heads ? 80 : 0;
  const nr = Math.ceil(ids.length / cols);
  const W = cols * tw + (cols - 1) * g + pad * 2, H = pad + hh + nr * th + (nr - 1) * g + pad;
  const x0 = cx - W / 2, y0 = cy - H / 2;
  const box = glass(parent, x0, y0, W, H, { zIndex: 11, borderRadius: 34 });
  const heads = (o.heads || []).map((txt, i) => {
    const h = el(box, { position: "absolute", left: pad + i * (tw + g), top: pad, width: tw, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 36, color: K.ink, background: limeFill(1), boxShadow: GLOW_A(0.45), whiteSpace: "nowrap" }, txt);
    gsap.set(h, { opacity: 0 });
    return h;
  });
  const tiles = ids.map((id, i) => {
    const tx = pad + (i % cols) * (tw + g), ty = pad + hh + Math.floor(i / cols) * (th + g);
    const t0 = el(box, { position: "absolute", left: tx, top: ty, width: tw, height: th, borderRadius: 16, overflow: "hidden", background: "#111", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 14px 30px rgba(0,0,0,.45)" });
    videoTile(t0, 0, 0, tw, th, id, 1);
    const bd = o.views && o.views[i] ? viewBadge(box, tx + tw / 2, ty + th - 30, o.views[i], { fs: 24 }) : null;
    gsap.set(t0, { opacity: 0 });
    return { t0, bd };
  });
  return {
    box, heads, tiles, W, H, rect: [x0 - 10, y0 - 10, x0 + W + 10, y0 + H + 10],
    show: (t) => {
      blurIn(box, t, { y: 30, blur: 12, dur: 0.45, scale: 0.97 });
      heads.forEach((h, i) => blurIn(h, t + 0.1 + i * 0.06, { y: 14, blur: 8, dur: 0.3 }));
      tiles.forEach((c, i) => blurIn(c.t0, t + 0.12 + (i % cols) * 0.04 + Math.floor(i / cols) * 0.07, { y: 26, blur: 12, dur: 0.36 }));
      popSeq(tiles.filter((c) => c.bd).map((c) => c.bd), t + 0.6, 0.08);
    },
  };
};

// ═══ X01 · contenitore con i documenti della risorsa che arrivano a ondate (reel 12 e 1 di Kallaway) ═══
// o: { n (9), cols (3), dw, dh, titoli: [...] } · .show(t, ondate = [1, 3, 6, n]) · .rect
// Pagine bianche vere (titolo, sottotitolo, evidenziatore lime, paragrafi, elenco puntato, intestazione, tabellina):
// ogni pagina ha una struttura diversa, così il muro si legge come "documenti veri" e non come caselle grigie.
const docPage = (parent, x, y, dw, dh, titolo, seed, o) => {
  o = o || {};
  const d = el(parent, { position: "absolute", left: x, top: y, width: dw, height: dh, borderRadius: 8, background: "linear-gradient(180deg,#ffffff 0%,#f7f7f3 60%,#eeeee8 100%)", boxShadow: "0 18px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.06), inset 0 1px 0 #fff", overflow: "hidden", zIndex: o.z || 2 });
  const m = Math.round(dw * 0.075), cw = dw - m * 2, u = dw / 250;
  const rnd = (k) => (hash(seed * 37 + k, 5) + 1) / 2;
  el(d, { position: "absolute", left: m, top: Math.round(15 * u), width: cw, fontFamily: FS, fontWeight: 800, fontSize: Math.round(21 * u), color: "#1e1e1e", whiteSpace: "nowrap", overflow: "hidden" }, titolo);
  let yy = Math.round(46 * u);
  const line = (wf, hh, c, xo) => { el(d, { position: "absolute", left: m + (xo || 0), top: yy, width: Math.round(cw * wf) - (xo || 0), height: Math.max(3, Math.round(hh * u)), borderRadius: 2, background: c }); };
  line(0.5 + 0.2 * rnd(1), 6, "rgba(30,30,30,.32)"); yy += Math.round(16 * u);
  // evidenziatore lime dietro a una riga (la parte importante)
  el(d, { position: "absolute", left: m - 3, top: yy - 3, width: Math.round(cw * (0.62 + 0.25 * rnd(2))), height: Math.round(13 * u), borderRadius: 3, background: "#d9fd6a" });
  line(0.58 + 0.25 * rnd(2), 6, "rgba(30,30,30,.55)"); yy += Math.round(20 * u);
  const para = (nl, k0) => { for (let q = 0; q < nl; q++) { line(q === nl - 1 ? 0.45 + 0.3 * rnd(k0 + q) : 0.86 + 0.14 * rnd(k0 + q), 5, "rgba(30,30,30,.24)"); yy += Math.round(12 * u); } yy += Math.round(6 * u); };
  para(3, 10);
  const kind = Math.floor(rnd(3) * 3);
  if (kind === 0) {
    for (let q = 0; q < 4; q++) { el(d, { position: "absolute", left: m, top: yy - 1, width: Math.round(7 * u), height: Math.round(7 * u), borderRadius: "50%", background: q === 0 ? "#9ccc26" : "rgba(30,30,30,.55)" }); line(0.55 + 0.35 * rnd(20 + q), 5, "rgba(30,30,30,.28)", Math.round(14 * u)); yy += Math.round(14 * u); }
  } else if (kind === 1) {
    const th = Math.round(13 * u);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) el(d, { position: "absolute", left: m + c * Math.round(cw / 3), top: yy + r * (th + 3), width: Math.round(cw / 3) - 4, height: th, borderRadius: 2, background: r === 0 ? "rgba(30,30,30,.62)" : c === 2 && r === 1 ? "#d9fd6a" : "rgba(30,30,30,.1)" });
    yy += 3 * (th + 3) + Math.round(6 * u);
  } else {
    line(0.4, 8, "rgba(30,30,30,.6)"); yy += Math.round(16 * u);
    para(2, 30);
  }
  yy += Math.round(4 * u);
  line(0.36 + 0.2 * rnd(4), 8, "rgba(30,30,30,.6)"); yy += Math.round(16 * u);
  while (yy < dh - Math.round(18 * u)) { line(0.7 + 0.3 * rnd(yy), 5, "rgba(30,30,30,.22)"); yy += Math.round(12 * u); }
  return d;
};
const docWall = (parent, cx, cy, o) => {
  o = o || {};
  const n = o.n || 9, cols = o.cols || 3, dw = o.dw || 250, dh = o.dh || 300, g = o.g || 24, pad = 36;
  const nr = Math.ceil(n / cols);
  const W = cols * dw + (cols - 1) * g + pad * 2, H = nr * dh + (nr - 1) * g + pad * 2;
  const x0 = cx - W / 2, y0 = cy - H / 2;
  const box = glass(parent, x0, y0, W, H, { zIndex: 11, borderRadius: 34, overflow: "visible" });
  const docs = [], pos = [];
  for (let i = 0; i < n; i++) {
    const dx = pad + (i % cols) * (dw + g), dy = pad + Math.floor(i / cols) * (dh + g);
    const d = docPage(box, dx, dy, dw, dh, (o.titoli && o.titoli[i]) || `Idea ${String(i + 1).padStart(2, "0")}`, i + 1);
    gsap.set(d, { opacity: 0 });
    docs.push(d);
    pos.push([x0 + dx + dw / 2, y0 + dy + dh / 2]);
  }
  return {
    box, docs, W, H, pos, rect: [x0 - 10, y0 - 10, x0 + W + 10, y0 + H + 10],
    show: (t, waves) => {
      blurIn(box, t, { y: 30, blur: 12, dur: 0.45, scale: 0.97 });
      const wv = waves || [1, 3, 6, n];
      let k = 0;
      wv.forEach((upto, wi) => { for (; k < upto && k < n; k++) tl.fromTo(docs[k], { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)", immediateRender: false }, t + 0.35 + wi * 0.42 + (k % cols) * 0.05); });
    },
    // una copia della pagina i si stacca (alone lime) e vola fino a (x, y) del mondo rimpicciolendo a s: "te la mando"
    send: (t, i, x, y, s) => {
      const d = docs[i].cloneNode(true), [px, py] = pos[i];
      box.appendChild(d);
      gsap.set(d, { opacity: 0 });
      tl.set(d, { opacity: 1, zIndex: 30 }, t);
      tl.to(d, { scale: 1.12, y: -18, boxShadow: `0 30px 60px rgba(0,0,0,.6), ${GLOW_A(0.9)}`, duration: 0.25, ease: "power2.out" }, t);
      tl.to(d, { x: x - px, y: y - py, scale: s == null ? 0.22 : s, rotation: -8, duration: 0.42, ease: "power3.in" }, t + 0.28);
      tl.to(d, { opacity: 0, duration: 0.08 }, t + 0.66);
    },
  };
};

// ═══ F07 · raggi vivi dietro un logo (reel 17 e 56 di Kallaway) ═════════════════════════════════════════════
// fasci morbidi che girano piano e respirano (±10°), sfumati verso l'esterno. o: { n (fasci), color, a (opacità), z }
// .show(t) · .live(t, dur) rotazione e respiro · .hide(t)
const rays = (parent, cx, cy, r, o) => {
  o = o || {};
  const n = o.n || 14, step = 360 / n, c = o.color || "235,255,170";
  const g = el(parent, { position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", zIndex: o.z || 5, pointerEvents: "none",
    background: `repeating-conic-gradient(from 0deg, rgba(${c},0) 0deg, rgba(${c},${o.a || 0.26}) ${(step * 0.18).toFixed(2)}deg, rgba(${c},0) ${(step * 0.42).toFixed(2)}deg, rgba(${c},0) ${step}deg)`,
    WebkitMaskImage: "radial-gradient(circle, #000 12%, rgba(0,0,0,.65) 38%, transparent 70%)", maskImage: "radial-gradient(circle, #000 12%, rgba(0,0,0,.65) 38%, transparent 70%)", filter: "blur(3px)" });
  gsap.set(g, { opacity: 0, scale: 0.4 });
  return {
    g,
    show: (t) => tl.to(g, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }, t),
    live: (t, dur) => {
      tl.fromTo(g, { rotation: -10 }, { rotation: 18, duration: dur, ease: "sine.inOut", immediateRender: false }, t);
      const k = Math.max(1, Math.round(dur / 1.2));
      for (let i = 0; i < k; i++) tl.to(g, { scale: i % 2 ? 1 : 1.08, duration: dur / k, ease: "sine.inOut" }, t + (i * dur) / k);
    },
    hide: (t) => tl.to(g, { opacity: 0, scale: 1.3, duration: 0.4, ease: "power2.in" }, t),
  };
};

// pill di un canale (icona vera + nome) — per hub e mappe di piattaforme
const chip = (parent, cx, cy, kind, text, o) => {
  o = o || {};
  const h = o.h || 80, w = o.w || 214;
  const c = el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: h / 2, background: "linear-gradient(180deg,#3b3b3b,#262626)", border: "1.5px solid rgba(255,255,255,.18)", boxShadow: "0 16px 36px rgba(0,0,0,.5), inset 0 1.5px 0 rgba(255,255,255,.1)", zIndex: o.z || 14 });
  brandIcon(c, h / 2, h / 2, h - 18, kind, 2);
  el(c, { position: "absolute", left: h + 4, top: 0, height: h, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 26, color: K.white, whiteSpace: "nowrap" }, text);
  gsap.set(c, { opacity: 0 });
  return { c, show: (t) => blurIn(c, t, { y: 18, blur: 10, dur: 0.35 }) };
};

// ═══ O21 · anelli orbitali di persone (reel 44 di Kallaway) ══════════════════════════════════════════════════
// Foto profilo vera al centro, anelli sottili con puntini-persona che ruotano piano in versi alterni; i puntini cambiano
// colore a onda (lime = chi ti capisce / compra, bianco = neutro) o se ne vanno verso l'esterno.
// rings: [[raggio, quanti], …] dal centro · o: { user, d (diametro foto), dot (diametro puntino), legenda: [[colore, testo], …], z }
// .show(t) anelli che si aprono + puntini a gruppi · .spin(t, dur, gradi) · .recolor(t, frazione, colore, dur) onda di colore
// .leave(t, frazione, dur) · .count(t, da, a, dur, fmt) contatore sotto la foto · .rect · .dots
// o.volti ("atlas-muro"): al posto dei puntini, volti veri presi dai fotogrammi dei reel dell'atlante (VOLTI_MURO, rilevati con
// YuNet): cerchietti con la faccia e il bordo bianco; recolor() colora il bordo (lime = chi compra), spin() li tiene dritti.
const VOLTI_MURO = [[0,59.7,108.9,68.4],[2,74.2,97.9,101.9],[4,82.9,64.0,72.9],[6,62.8,62.9,64.9],[9,58.9,104.6,64.0],[10,71.6,65.1,64.9],[11,71.4,103.5,72.4],[12,58.0,82.7,81.8],[14,67.2,105.0,98.9],[15,52.8,82.9,87.4],[17,68.5,93.0,58.4],[19,83.9,77.4,56.8],[21,61.9,83.8,50.1],[22,62.6,87.3,95.9],[23,56.2,55.9,65.8],[24,65.6,70.9,51.4],[27,80.1,69.4,65.3],[28,77.5,113.9,99.1],[29,65.2,89.8,48.8],[31,56.4,81.0,66.0],[35,61.0,78.5,88.0],[36,60.2,82.1,60.8],[37,56.1,59.8,57.5],[38,72.6,107.9,44.6],[39,79.0,138.4,50.4],[40,51.8,74.8,70.4],[43,47.1,70.3,122.3],[45,52.8,110.7,108.4],[46,71.7,109.9,43.4],[48,55.6,86.3,84.5],[52,59.0,157.4,41.7],[54,59.0,67.1,68.1],[55,85.6,85.4,85.2],[56,63.8,86.5,44.6],[57,72.4,84.7,49.0],[58,71.2,66.3,62.2],[61,68.0,59.7,55.8],[65,72.7,120.6,104.4],[66,69.1,94.6,48.4],[67,36.1,70.1,51.0],[68,69.7,77.9,62.9],[70,80.4,83.2,57.1],[72,54.3,79.4,68.6],[73,56.4,32.4,61.7],[74,56.8,65.7,60.4],[75,67.8,105.6,42.5],[76,63.0,63.7,60.8],[78,56.5,72.5,93.8],[81,70.1,71.7,80.3],[83,61.3,80.1,51.6],[85,65.1,91.7,78.0],[86,36.7,57.7,47.6],[87,43.2,64.4,69.6],[90,51.4,83.9,56.5],[91,62.9,72.0,102.2],[92,70.1,84.6,80.1],[94,61.6,80.4,61.2],[95,73.2,63.9,66.9],[98,69.2,65.3,58.3],[104,59.7,78.7,90.5],[105,66.7,82.7,64.8],[107,76.0,84.0,61.6],[109,64.3,69.0,55.8],[111,77.0,98.6,97.9],[112,92.1,72.8,54.2],[113,65.5,65.7,65.7],[115,56.5,77.2,87.3],[116,61.6,103.0,61.9],[117,83.1,70.2,64.4],[118,64.0,57.5,64.2],[120,38.7,84.4,51.9],[122,55.2,141.8,53.6],[124,62.1,105.4,133.7],[126,71.8,75.9,63.8],[127,67.4,87.3,57.6],[128,59.9,78.4,105.1],[130,61.9,86.8,94.8],[131,53.8,68.2,60.2],[132,65.8,77.6,73.1],[133,63.7,74.2,51.5],[135,67.1,84.0,69.6],[139,39.0,110.2,76.0],[141,58.3,76.5,88.0]];
// cerchietto con un volto vero dell'atlante (i = indice qualunque, scelto in modo deterministico) · d = diametro
const faceDot = (parent, x, y, d, i, atlas, o) => {
  o = o || {};
  const [q, fx, fy, fsz] = VOLTI_MURO[((i * 29 + 7) % VOLTI_MURO.length + VOLTI_MURO.length) % VOLTI_MURO.length];
  const c = el(parent, { position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", overflow: "hidden", background: "#1a1a1a", border: `${o.bw == null ? 2 : o.bw}px solid rgba(255,255,255,.9)`, boxShadow: "0 0 10px rgba(255,255,255,.28), 0 6px 14px rgba(0,0,0,.5)", boxSizing: "border-box" });
  const k = d / (fsz * 1.45), qc = q % 12, qr = Math.floor(q / 12);
  imgIn(c, atlas || "atlas-muro", { left: d / 2 - (qc * 128 + fx) * k + "px", top: d / 2 - (qr * 228 + fy) * k + "px", width: 12 * 128 * k + "px", height: 12 * 228 * k + "px", objectFit: "fill" });
  return c;
};
const peopleRings = (parent, cx, cy, rings, o) => {
  o = o || {};
  const z = o.z || 10, ds = o.dot || 18, R = rings[rings.length - 1][0];
  let nf = 0;
  const holders = rings.map(([r, n], k) => {
    const ring = el(parent, { position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.16)", zIndex: z });
    const dots = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + k * 0.37;
      const d = o.volti ? faceDot(ring, r + Math.cos(a) * r - ds / 2, r + Math.sin(a) * r - ds / 2, ds, nf++, o.volti)
        : el(ring, { position: "absolute", left: r + Math.cos(a) * r - ds / 2, top: r + Math.sin(a) * r - ds / 2, width: ds, height: ds, borderRadius: "50%", background: "#ececec", boxShadow: "0 0 10px rgba(255,255,255,.35)" });
      dots.push({ d, a, k });
    }
    gsap.set(dots.map((x) => x.d), { opacity: 0, scale: 0.3 });
    return { ring, dots, r };
  });
  const all = holders.flatMap((h) => h.dots);
  // ordine deterministico per onde e partenze: per angolo (onda che gira) con un filo di rumore
  const byAngle = all.map((x, i) => ({ x, key: ((x.a + Math.PI * 2) % (Math.PI * 2)) + hash(i, 13) * 0.25 })).sort((p, q) => p.key - q.key).map((p) => p.x);
  const ad = o.d || Math.round(R * 0.42);
  let av, pctN = null;
  if (o.percent) {
    // D09 (reel 21): al centro un disco di vetro con la percentuale che sale mentre le persone si colorano
    av = el(parent, { position: "absolute", left: cx - ad / 2, top: cy - ad / 2, width: ad, height: ad, borderRadius: "50%", background: "radial-gradient(circle at 40% 32%, #3a3a3a, #1b1b1b 70%)", border: `4px solid ${K.lime}`, boxShadow: `${GLOW_A(0.6)}, 0 14px 30px rgba(0,0,0,.55)`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: z + 3 });
    pctN = el(av, { fontFamily: FD, fontWeight: 700, fontSize: Math.round(ad * 0.34), color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, "0%");
  } else if (o.media) {
    // al centro un reel (video o copertina) dentro un cerchio con l'anello: o.ring = colore dell'anello
    av = el(parent, { position: "absolute", left: cx - ad / 2, top: cy - ad / 2, width: ad, height: ad, borderRadius: "50%", overflow: "hidden", border: `5px solid ${o.ring || K.lime}`, boxShadow: o.ring && o.ring !== K.lime ? "0 14px 30px rgba(0,0,0,.55), 0 0 26px rgba(255,255,255,.25)" : `${GLOW_A(0.7)}, 0 14px 30px rgba(0,0,0,.55)`, background: "#222", zIndex: z + 3 });
    mediaTile(av, 0, 0, ad - 10, ad - 10, o.media, 1);
  } else av = avatar(parent, cx, cy, ad, o.user || "tu", { bw: 5, z: z + 3 });
  gsap.set(av, { opacity: 0, scale: 0.5 });
  const cfs = Math.round(ad * 0.19);
  const cntW = el(parent, { position: "absolute", left: cx - 200, top: cy + ad / 2 + 14, width: 400, textAlign: "center", zIndex: z + 4, opacity: 0 });
  const cnt = el(cntW, { display: "inline-block", padding: `${Math.round(cfs * 0.28)}px ${Math.round(cfs * 0.7)}px`, borderRadius: 999, background: "linear-gradient(180deg, rgba(58,58,58,.96), rgba(30,30,30,.98))", border: "1.5px solid rgba(207,251,80,.6)", boxShadow: "0 12px 28px rgba(0,0,0,.55)", fontFamily: FS, fontWeight: 800, fontSize: cfs, color: K.white, whiteSpace: "nowrap" }, "", "span");
  const leg = (o.legenda || []).map(([c, t], i, A) => {
    const lg = el(parent, { position: "absolute", left: cx + (i - (A.length - 1) / 2) * 340 - 160, top: cy - R - 110, width: 320, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FS, fontWeight: 800, fontSize: 38, color: K.white, whiteSpace: "nowrap", zIndex: z + 3 }, `<span style="width:30px;height:30px;border-radius:50%;background:${c};box-shadow:${c === K.lime ? GLOW_A(0.8) : "0 0 10px rgba(255,255,255,.4)"};display:inline-block"></span>` + t);
    gsap.set(lg, { opacity: 0 });
    return lg;
  });
  return {
    holders, dots: all, av, rect: [cx - R - 40, cy - R - (leg.length ? 140 : 40), cx + R + 40, cy + R + 40],
    // o2.daLontano: le persone arrivano da fuori verso il loro posto (pubblico nuovo che entra), o2.colore: già colorate
    show: (t, o2) => {
      o2 = o2 || {};
      tl.to(av, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, t);
      holders.forEach((h, k) => {
        tl.fromTo(h.ring, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out", immediateRender: false }, t + 0.05 + k * 0.07);
        h.dots.forEach((x, i) => {
          const tt = t + 0.2 + k * 0.1 + ((hash(i + k * 50, 7) + 1) / 2) * (o2.dur || 0.45);
          if (o2.colore) gsap.set(x.d, { background: o2.colore, boxShadow: o2.colore === K.lime ? GLOW_A(0.8) : "0 0 10px rgba(255,255,255,.35)" });
          if (o2.daLontano) {
            const dist = 260 + Math.abs(hash(i + k * 13, 3)) * 260;
            tl.fromTo(x.d, { x: Math.cos(x.a) * dist, y: Math.sin(x.a) * dist, opacity: 0, scale: 0.6 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, tt);
          } else tl.to(x.d, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.5)" }, tt);
        });
      });
      leg.forEach((lg, i) => blurIn(lg, t + 0.3 + i * 0.1, { y: 12, blur: 8, dur: 0.3 }));
    },
    spin: (t, dur, deg) => holders.forEach((h, k) => {
      const rot = (k % 2 ? -1 : 1) * (deg || 20);
      tl.to(h.ring, { rotation: rot, duration: dur, ease: "none" }, t);
      if (o.volti) tl.to(h.dots.map((x) => x.d), { rotation: -rot, duration: dur, ease: "none" }, t);
    }),
    recolor: (t, frac, color, dur) => {
      const pick = byAngle.filter((_, i) => (i * 7919) % 100 < frac * 100);
      pick.forEach((x, i) => tl.to(x.d, Object.assign(o.volti ? { borderColor: color, borderWidth: color === K.lime ? 4 : 2 } : { background: color }, { boxShadow: color === K.lime ? GLOW_A(0.8) : "0 0 10px rgba(255,255,255,.35)", duration: 0.12 }), t + (i / Math.max(1, pick.length)) * (dur || 0.8)));
      return pick;
    },
    leave: (t, frac, dur) => {
      const pick = byAngle.filter((_, i) => ((i * 4271) % 100) < frac * 100);
      pick.forEach((x, i) => {
        const dist = 150 + Math.abs(hash(i, 9)) * 200;
        tl.to(x.d, { x: Math.cos(x.a) * dist, y: Math.sin(x.a) * dist, opacity: 0, duration: 0.6, ease: "power2.in" }, t + Math.abs(hash(i + 3, 4)) * (dur || 0.7));
      });
      return pick;
    },
    // D09: la percentuale al centro sale da a a b in dur secondi e la stessa quota di persone si colora di lime a onda
    pct: (t, a, b, dur) => {
      dur = dur || 1.0;
      const V = { v: a };
      if (pctN) tl.fromTo(V, { v: a }, { v: b, duration: dur, ease: "power1.inOut", onUpdate: () => (pctN.textContent = Math.round(V.v) + "%"), immediateRender: false }, t);
      const pick = byAngle.filter((_, i) => (i * 7919) % 100 < b);
      pick.forEach((x, i) => tl.to(x.d, Object.assign(o.volti ? { borderColor: K.lime, borderWidth: 4 } : { background: K.lime }, { boxShadow: GLOW_A(0.8), duration: 0.12 }), t + (i / Math.max(1, pick.length)) * dur));
      if (pctN) glowFlash(pctN, t + dur);
    },
    count: (t, from, to, dur, fmt, ease) => {
      const V = { v: from }, f = fmt || ((v) => itNum(v) + " persone");
      cnt.textContent = f(from);
      tl.fromTo(cntW, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, t);
      tl.to(V, { v: to, duration: dur || 0.9, ease: ease || "power1.inOut", onUpdate: () => (cnt.textContent = f(V.v)) }, t);
    },
  };
};

// ═══ K11 · muro di reel veri che scorre come una slot e si ferma sulla selezione (reel 61 e 90 di Kallaway) ═════════════
// Muro di miniature 9:16 = fotogrammi veri di reel (_tools/atlante.py → assets/atlas/muro.jpg, nel pool come "atlas-muro").
// La camera lo apre (zoom out 0,2 s), lo fa scorrere in verticale velocissimo con la scia (0,4 s) e frena (0,3 s) sulla
// selezione; .spot() accende le scelte (bordo lime + alone) e spegne il resto sotto un velo scuro; .pick() le porta avanti come
// reel veri in riga con il badge views (gli outlier).
// o: { cols (10), rows (30), tw (118), gap (12), atlas ("atlas-muro"), ac / ar (colonne e righe dell'atlante, 12), atw / ath
//   (miniatura dell'atlante, 128 × 228), seed, z }
// → { box, W, H, th, rect, cellXY(r, c), poseRows(r0, r1, o), open(t, r0, r1, {dur, k}), roll(t, r0, r1, {dur, peak, ease}),
//     spot(t, celle), pick(t, celle, ids, {views, w, gap, y}) → { rect, cards } }
const wallScroll = (parent, cx, top, o) => {
  o = o || {};
  const cols = o.cols || 10, rows = o.rows || 30, tw = o.tw || 118, gap = o.gap || 12, ac = o.ac || 12, ar = o.ar || 12, atw = o.atw || 128, ath = o.ath || 228;
  const th = Math.round((tw * ath) / atw), W = cols * tw + (cols - 1) * gap, H = rows * th + (rows - 1) * gap, x0 = cx - W / 2, z = o.z || 10;
  const box = el(parent, { position: "absolute", left: x0, top, width: W, height: H, zIndex: z });
  const k = tw / atw, seed = o.seed || 0;
  const tiles = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const q = (r * 37 + c * 11 + seed) % (ac * ar), qc = q % ac, qr = Math.floor(q / ac);
    const t0 = el(box, { position: "absolute", left: c * (tw + gap), top: r * (th + gap), width: tw, height: th, borderRadius: 10, overflow: "hidden", background: "#111", border: "1.5px solid rgba(255,255,255,.14)", boxShadow: "0 10px 22px rgba(0,0,0,.45)", zIndex: 1 });
    imgIn(t0, o.atlas || "atlas-muro", { left: -qc * atw * k + "px", top: -qr * ath * k + "px", width: ac * atw * k + "px", height: ar * ath * k + "px", objectFit: "fill" });
    tiles.push(t0);
  }
  // velo che spegne il muro sotto le scelte (un solo elemento: niente filtri su centinaia di miniature)
  const veil = el(box, { position: "absolute", left: -40, top: -40, width: W + 80, height: H + 80, background: "rgba(14,14,14,.74)", opacity: 0, zIndex: 5 });
  const T = (r, c) => tiles[r * cols + c];
  const cellXY = (r, c) => [x0 + c * (tw + gap) + tw / 2, top + r * (th + gap) + th / 2];
  // inquadra le righe r0..r1 su una finestra di colonne (default le 9 centrali): il muro esce dai bordi come in Kallaway
  const poseRows = (r0, r1, oo) => {
    oo = oo || {};
    const nv = Math.min(cols, oo.vis || 9), c0 = oo.c0 == null ? Math.floor((cols - nv) / 2) : oo.c0;
    return fitPose(x0 + c0 * (tw + gap) - 8, top + r0 * (th + gap) - 20, x0 + (c0 + nv) * (tw + gap) - gap + 8, top + r1 * (th + gap) + th + 20, Object.assign({ top: 330, fill: 1 }, oo));
  };
  return {
    box, W, H, th, tiles, rect: [x0, top, x0 + W, top + H], cellXY, poseRows,
    // zoom out: dalla riga r0 vista da vicino (k volte più grande) al muro che riempie l'inquadratura (0,22 s, scia che si scarica)
    open: (t, r0, r1, oo) => {
      oo = oo || {};
      const p = poseRows(r0, r1, oo), [mx, my] = cellXY(Math.round((r0 + r1) / 2), Math.floor(cols / 2)), d = oo.dur || 0.24, t1 = t + (oo.hold == null ? 0.07 : oo.hold);
      cutTo(t, mx, my, p.s * (oo.k || 2.4));
      camK(t1, d, p.fx, p.fy, p.s, "power2.inOut");
      mblurV(t1, d, "power2.inOut", oo.blur || 9, "xy");
      return p;
    },
    // scorrimento 'slot': parte quasi di colpo, corre (scia verticale al massimo) e frena sulla posa delle righe r0..r1
    roll: (t, r0, r1, oo) => {
      oo = oo || {};
      const p = poseRows(r0, r1, oo), dur = oo.dur || 0.7, e = oo.ease || bez(0.42, 0.0, 0.18, 1.0);
      camK(t, dur, p.fx, p.fy, p.s, e);
      mblurV(t, dur, e, oo.peak || 26, "y");
      return p;
    },
    spot: (t, cells) => {
      tl.to(veil, { opacity: 1, duration: 0.35, ease: "power2.out" }, t);
      cells.forEach(([r, c], i) => {
        const x = T(r, c);
        x.style.zIndex = 6;
        tl.to(x, { borderColor: K.lime, borderWidth: 4, boxShadow: `${GLOW_A(1)}, 0 14px 30px rgba(0,0,0,.6)`, duration: 0.2 }, t + i * 0.07);
        tl.fromTo(x, { scale: 1 }, { scale: 1.1, duration: 0.35, ease: "back.out(2.4)", immediateRender: false }, t + i * 0.07);
      });
    },
    // le scelte escono dal muro come reel veri (video del pool) e si mettono in riga davanti; badge views in sequenza
    pick: (t, cells, ids, oo) => {
      oo = oo || {};
      const n = cells.length, w = oo.w || 270, h = Math.round((w * 16) / 9), g = oo.gap || 34, Wr = n * w + (n - 1) * g;
      const yR = oo.y == null ? cellXY(cells[0][0], 0)[1] : oo.y;
      tl.to(box, { opacity: 0.35, filter: "blur(5px)", duration: 0.45, ease: "power2.out" }, t);
      const cards = cells.map(([r, c], i) => {
        const [sx, sy] = cellXY(r, c), tx = cx - Wr / 2 + i * (w + g) + w / 2;
        const vc = videoCard(parent, sx, sy, w, h, ids[i], { z: z + 20, scale: (tw * 1.1) / w });
        vc.body.style.border = `4px solid ${K.lime}`;
        vc.body.style.boxShadow = `${GLOW_A(0.9)}, 0 30px 70px rgba(0,0,0,.6)`;
        gsap.set(vc.wrap, { opacity: 0 });
        tl.set(vc.wrap, { opacity: 1 }, t);
        tl.to(vc.wrap, { x: tx, y: yR, scale: 1, rotation: (i - (n - 1) / 2) * 2.5, duration: 0.55, ease: "power3.inOut" }, t + i * 0.05);
        tl.to(T(r, c), { opacity: 0, duration: 0.1 }, t + 0.05);
        const bd = oo.views && oo.views[i] ? viewBadge(parent, tx, yR + h / 2 + 46, oo.views[i], { fs: 34, z: z + 22 }) : null;
        return { vc, bd };
      });
      popSeq(cards.filter((c) => c.bd).map((c) => c.bd), t + 0.6, 0.1);
      return { cards, rect: [cx - Wr / 2 - 30, yR - h / 2 - 30, cx + Wr / 2 + 30, yR + h / 2 + 100] };
    },
  };
};

// ═══ O08 · triade 3D che ruota e porta in alto la voce detta (reel 50 di Kallaway) ══════════════════════════════════════
// Cornice triangolare spessa in grafite lucida (due falde: esterna in ombra, interna in luce, filo di luce sul crinale) con un
// triangolo lime pieno al centro; le tre voci sono scritte lungo i lati, dentro la cornice. .rotateTo(i, t) gira la triade
// (0,85 s) con un'inclinazione 3D a metà corsa e la scia, finché il lato i è in alto: la sua voce va a fuoco e
// si accende, le altre restano sfocate (0,85 s misurati sul reel 50, parte decisa e si assesta piano). Lati: 0 in alto, 1 in basso a sinistra, 2 in basso a destra (giro orario di 120° a
// passo). o: { r (raggio del cerchio circoscritto, 330), band (spessore della cornice), fs, start (gradi iniziali: -60 = punta
// in su), icons (un'icona per voce al centro, dritta, cambia con la voce), z } → { g, rect, show(t), rotateTo(i, t, dur), on(i, t) }
const triad = (parent, cx, cy, labels, o) => {
  o = o || {};
  const R = o.r || 330, b = o.band || Math.round(R * 0.29), Ri = R - 2 * b, S = Math.round(R * 2.3), C = S / 2, fs = o.fs || Math.round(b * 0.34);
  const g = layered(el(parent, { position: "absolute", left: cx - C, top: cy - C, width: S, height: S, zIndex: o.z || 12 }));
  const halo = el(parent, { position: "absolute", left: cx - R * 1.1, top: cy - R * 1.1, width: R * 2.2, height: R * 2.2, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(207,251,80,.20), rgba(207,251,80,.06) 55%, rgba(207,251,80,0))", zIndex: (o.z || 12) - 1, opacity: 0 });
  const Sv = svgIn(g, S, S);
  const id = "tr" + ++SVGN;
  const V = (r, a) => [C + r * Math.cos((a * Math.PI) / 180), C + r * Math.sin((a * Math.PI) / 180)];
  const ANG = [210, 330, 90]; // vertici: in alto a sinistra, in alto a destra, in basso (punta in giù: lato 0 in alto)
  const Vo = ANG.map((a) => V(R, a)), Vm = ANG.map((a) => V(R - b, a)), Vi = ANG.map((a) => V(Ri, a));
  const SIDES = [[0, 1], [2, 0], [1, 2]]; // lato 0 in alto, 1 in basso a sinistra, 2 in basso a destra
  const mk = (tag, a, par) => { const e = document.createElementNS(NS, tag); for (const q in a) e.setAttribute(q, a[q]); (par || Sv).appendChild(e); return e; };
  const P = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
  let defs = `<filter id="${id}b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>`;
  defs += `<radialGradient id="${id}L" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#f4ffd0"/><stop offset=".35" stop-color="#dcff74"/><stop offset=".72" stop-color="#CFFB50"/><stop offset="1" stop-color="#a6d034"/></radialGradient>`;
  SIDES.forEach(([i, j], s) => {
    const mo = [(Vo[i][0] + Vo[j][0]) / 2, (Vo[i][1] + Vo[j][1]) / 2], mm = [(Vm[i][0] + Vm[j][0]) / 2, (Vm[i][1] + Vm[j][1]) / 2], mi = [(Vi[i][0] + Vi[j][0]) / 2, (Vi[i][1] + Vi[j][1]) / 2];
    defs += `<linearGradient id="${id}o${s}" gradientUnits="userSpaceOnUse" x1="${mo[0]}" y1="${mo[1]}" x2="${mm[0]}" y2="${mm[1]}"><stop offset="0" stop-color="#262626"/><stop offset=".65" stop-color="#3f3f3f"/><stop offset="1" stop-color="#5a5a5a"/></linearGradient>`;
    defs += `<linearGradient id="${id}i${s}" gradientUnits="userSpaceOnUse" x1="${mm[0]}" y1="${mm[1]}" x2="${mi[0]}" y2="${mi[1]}"><stop offset="0" stop-color="#7a7a7a"/><stop offset=".4" stop-color="#4c4c4c"/><stop offset="1" stop-color="#262626"/></linearGradient>`;
  });
  Sv._defs.innerHTML = defs;
  // ombra portata e alone lime del triangolo interno (sfocati, sotto)
  mk("polygon", { points: P(Vo.map(([x, y]) => [x + 10, y + 26])), fill: "rgba(0,0,0,.55)", filter: `url(#${id}b)` });
  const glow = mk("polygon", { points: P(Vi), fill: "#CFFB50", opacity: 0.55, filter: `url(#${id}b)` });
  SIDES.forEach(([i, j], s) => {
    mk("polygon", { points: P([Vo[i], Vo[j], Vm[j], Vm[i]]), fill: `url(#${id}o${s})` });
    mk("polygon", { points: P([Vm[i], Vm[j], Vi[j], Vi[i]]), fill: `url(#${id}i${s})` });
  });
  mk("polygon", { points: P(Vo), fill: "none", stroke: "rgba(255,255,255,.22)", "stroke-width": 2, "stroke-linejoin": "round" });
  mk("polygon", { points: P(Vm), fill: "none", stroke: "rgba(255,255,255,.18)", "stroke-width": 1.5, "stroke-linejoin": "round" });
  // triangolo lime pieno, con il bordo più scuro (è incassato nella cornice) e un riflesso
  const core = mk("polygon", { points: P(Vi), fill: `url(#${id}L)`, stroke: "#8fb32a", "stroke-width": 4, "stroke-linejoin": "round" });
  mk("polygon", { points: P([Vi[0], Vi[1], [(Vi[0][0] + Vi[1][0]) / 2, Vi[0][1] + (Vi[2][1] - Vi[0][1]) * 0.42]]), fill: "rgba(255,255,255,.22)" });
  // voci lungo i lati, nella cornice (ruotano con la triade: quella in alto si legge dritta)
  const side = Math.hypot(Vm[1][0] - Vm[0][0], Vm[1][1] - Vm[0][1]);
  const labs = SIDES.map(([i, j], s) => {
    const mx = (Vo[i][0] + Vo[j][0] + Vi[i][0] + Vi[j][0]) / 4, my = (Vo[i][1] + Vo[j][1] + Vi[i][1] + Vi[j][1]) / 4;
    const phi = (Math.atan2(my - C, mx - C) * 180) / Math.PI, lw = side * 0.78;
    const lb = el(g, { position: "absolute", left: mx - lw / 2, top: my - b / 2, width: lw, height: b, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(phi + 90).toFixed(2)}deg)`, fontFamily: FS, fontWeight: 800, fontSize: fs, letterSpacing: "0.04em", color: "rgba(255,255,255,.9)", whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,.6)" }, labels[s] || "");
    gsap.set(lb, { opacity: 0.42, filter: "blur(3.5px)" });
    return lb;
  });
  let rot = o.start == null ? -60 : o.start, cur = -1;
  gsap.set(g, { transformPerspective: 1700, transformOrigin: "50% 50%", rotation: rot, opacity: 0 });
  // o.esempi: sotto la triade la frase che pensa chi guarda, una per voce (fumetto con la sagoma), cambia con la voce
  const exs = (o.esempi || []).map((tx) => {
    const ew = Math.round(R * 1.9), eh = Math.round(R * 0.32);
    const e = el(parent, { position: "absolute", left: cx - ew / 2, top: cy + R + Math.round(R * 0.22), width: ew, height: eh, display: "flex", alignItems: "center", gap: Math.round(eh * 0.3), padding: `0 ${Math.round(eh * 0.34)}px`, borderRadius: Math.round(eh * 0.5), background: "linear-gradient(180deg, rgba(58,58,58,.96), rgba(30,30,30,.98))", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 18px 40px rgba(0,0,0,.55), inset 0 1.5px 0 rgba(255,255,255,.1)", fontFamily: FH, fontSize: Math.round(eh * 0.5), color: K.white, whiteSpace: "nowrap", zIndex: (o.z || 12) + 2 });
    avatar(e, 0, 0, Math.round(eh * 0.7), "anon", { ring: "rgba(255,255,255,.75)", bw: 2, z: 2 }).style.cssText += ";position:relative;left:0;top:0;flex:none";
    el(e, {}, "“" + tx + "”", "span");
    gsap.set(e, { opacity: 0, y: 26, filter: "blur(10px)" });
    return e;
  });
  // o.icons: un'icona per voce al centro del triangolo lime, sempre dritta (non ruota), cambia con la voce in alto
  const ics = (o.icons || []).map((nm) => {
    const ic = layered(el(parent, { position: "absolute", left: cx - Ri * 0.42, top: cy - Ri * 0.42 - Ri * 0.12, width: Ri * 0.84, height: Ri * 0.84, display: "flex", alignItems: "center", justifyContent: "center", zIndex: (o.z || 12) + 2, pointerEvents: "none" }, svg(nm, Math.round(Ri * 0.62), K.ink, 2.3)));
    gsap.set(ic, { opacity: 0, scale: 0.5 });
    return ic;
  });
  const on = (i, t) => {
    if (cur >= 0 && cur !== i) {
      tl.to(labs[cur], { opacity: 0.42, filter: "blur(3.5px)", color: "rgba(255,255,255,.9)", textShadow: "0 2px 8px rgba(0,0,0,.6)", duration: 0.25 }, t);
      if (ics[cur]) tl.to(ics[cur], { opacity: 0, scale: 0.6, duration: 0.15, ease: "power2.in" }, t - 0.2);
    }
    tl.to(labs[i], { opacity: 1, filter: "blur(0px)", color: "#ffffff", textShadow: GLOW_T, duration: 0.25, ease: "power2.out" }, t);
    if (ics[i]) { tl.to(ics[i], { opacity: 1, duration: 0.1 }, t); tl.to(ics[i], { scale: 1, duration: 0.4, ease: "back.out(2.6)" }, t); }
    exs.forEach((e, k) => { if (k === cur && k !== i) blurOut(e, t - 0.2, { dur: 0.2, y: 10 }); });
    if (exs[i]) { tl.to(exs[i], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power3.out" }, t + 0.1); tl.set(exs[i], { filter: "none" }, t + 0.46); }
    cur = i;
  };
  return {
    g, labs, core, on, rect: [cx - R * 0.9 - 30, cy - R - 30, cx + R * 0.9 + 30, cy + R + 30 + (o.esempi ? Math.round(R * 0.6) : 0)],
    rectDown: [cx - R * 0.9 - 30, cy - R * 0.5 - 40, cx + R * 0.9 + 30, cy + R + 30 + (o.esempi ? Math.round(R * 0.6) : 0)],
    show: (t) => {
      tl.fromTo(g, { opacity: 0, scale: 0.7, rotationX: 50 }, { opacity: 1, scale: 1, rotationX: 0, duration: 0.6, ease: "expo.out", immediateRender: false }, t);
      tl.to(halo, { opacity: 1, duration: 0.6 }, t + 0.1);
      if (exs[0]) tl.to(exs[0], { opacity: 0.45, y: 0, filter: "blur(8px)", duration: 0.4, ease: "power2.out" }, t + 0.2);
    },
    // gira finché il lato i è in alto (sempre in senso orario, almeno 60°): 0,85 s, inclinazione 3D e scia sul tratto veloce
    rotateTo: (i, t, dur) => {
      dur = dur || 0.85;
      let to = 120 * i;
      while (to < rot + 59) to += 360;
      while (to > rot + 360 + 59) to -= 360;
      // come il reel 50: parte deciso (il grosso del giro nel primo 60%) e si assesta piano; inclinazione 3D e scia sul tratto veloce
      tl.to(g, { rotation: to, duration: dur, ease: bez(0.35, 0.1, 0.15, 1) }, t);
      tl.to(g, { rotationX: 32, rotationY: -22, duration: dur * 0.38, ease: "sine.out" }, t);
      tl.to(g, { rotationX: 0, rotationY: 0, duration: dur * 0.62, ease: "sine.inOut" }, t + dur * 0.38);
      tl.to(g, { filter: "blur(3px)", duration: dur * 0.3, ease: "sine.in" }, t);
      tl.to(g, { filter: "blur(0px)", duration: dur * 0.35, ease: "sine.out" }, t + dur * 0.3);
      tl.set(g, { filter: "none" }, t + dur + 0.01);
      tl.fromTo(glow, { attr: { opacity: 0.55 } }, { attr: { opacity: 0.95 }, duration: 0.12, immediateRender: false }, t + dur * 0.9);
      tl.to(glow, { attr: { opacity: 0.55 }, duration: 0.45 }, t + dur + 0.05);
      on(i, t + dur * 0.5);
      rot = to;
      return t + dur;
    },
  };
};

// ═══ L08 · tabella che si compila (reel 64, 68 e 98 di Kallaway) ═════════════════════════════════════════════════════════
// Contenitore di vetro con la fascia d'intestazione (uno sheen la attraversa all'arrivo), griglia sottile che si disegna,
// intestazioni sfocate e grigie finché non vengono dette (vanno a fuoco con un lampo di luce bianca), celle che si riempiono
// una per una (~0,1 s a cella: numero, testo o badge che poppa con un lampo). .lime(i, j, t) accende una cella (lime pieno).
// cols / rows: intestazioni · o: { cw (132), rh (92), hw (colonna dei titoli di riga, 210), hh (96), fs, hfs, cfs, z }
// → { box, W, H, rect, cellXY(i, j), show(t), head(j, t), rowHead(i, t), heads(t, step), cell(i, j, t, html), fill(t, {step,
//     order: "row" | "col", fmt, from}) → fine, lime(i, j, t), pill(t, html) }
const table = (parent, cx, cy, cols, rows, o) => {
  o = o || {};
  const cw = o.cw || 132, rh = o.rh || 92, hw = o.hw || 210, hh = o.hh || 96, pad = 24, fs = o.fs || 26, z = o.z || 12;
  const nC = cols.length, nR = rows.length, W = pad * 2 + hw + nC * cw, H = pad * 2 + hh + nR * rh, x0 = cx - W / 2, y0 = cy - H / 2;
  const box = glass(parent, x0, y0, W, H, { zIndex: z, borderRadius: 30 });
  const gx = pad + hw, gy = pad + hh;
  const hband = el(box, { position: "absolute", left: pad, top: pad, width: W - pad * 2, height: hh, borderRadius: 16, overflow: "hidden", background: "linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.035))", border: "1px solid rgba(255,255,255,.10)" });
  const sh = el(hband, { position: "absolute", top: -hh * 0.4, left: 0, width: 54, height: hh * 1.8, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 45%, rgba(255,255,255,.8) 50%, rgba(255,255,255,.5) 55%, rgba(255,255,255,0) 100%)", transform: "rotate(20deg)", filter: "blur(1.5px)", opacity: 0 });
  const vl = [], hl = [];
  for (let j = 0; j <= nC; j++) vl.push(el(box, { position: "absolute", left: gx + j * cw - 0.75, top: pad + 8, width: 1.5, height: hh + nR * rh - 8, background: "rgba(255,255,255,.13)", transformOrigin: "50% 0%" }));
  for (let i = 1; i <= nR; i++) hl.push(el(box, { position: "absolute", left: pad + 8, top: gy + i * rh - 0.75, width: hw + nC * cw - 8, height: 1.5, background: "rgba(255,255,255,.13)", transformOrigin: "0% 50%" }));
  const flash = (x, y, w, h) => el(box, { position: "absolute", left: x - 26, top: y - 26, width: w + 52, height: h + 52, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,255,255,.6), rgba(255,255,255,.18) 55%, rgba(255,255,255,0))", opacity: 0, zIndex: 1 });
  const heads = cols.map((tx, j) => {
    const c = el(box, { position: "absolute", left: gx + j * cw, top: pad, width: cw, height: hh, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 8px", fontFamily: FS, fontWeight: 800, fontSize: o.hfs || fs, lineHeight: 1.08, color: "rgba(255,255,255,.5)", zIndex: 2 }, tx);
    gsap.set(c, { filter: "blur(6px)" });
    return { c, fl: flash(gx + j * cw, pad, cw, hh) };
  });
  const rheads = rows.map((tx, i) => {
    const c = el(box, { position: "absolute", left: pad + 18, top: gy + i * rh, width: hw - 26, height: rh, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 800, fontSize: o.rfs || fs, lineHeight: 1.08, color: "rgba(255,255,255,.5)", zIndex: 2 }, tx);
    gsap.set(c, { filter: "blur(6px)" });
    return { c, fl: flash(pad, gy + i * rh, hw, rh) };
  });
  const c0s = [];
  const cells = rows.map((_, i) => cols.map((__, j) => {
    if (o.slots !== false) c0s.push(el(box, { position: "absolute", left: gx + j * cw + 12, top: gy + i * rh + 12, width: cw - 24, height: rh - 24, borderRadius: 10, border: "2px dashed rgba(255,255,255,.2)", zIndex: 1 }));
    const c = el(box, { position: "absolute", left: gx + j * cw + 6, top: gy + i * rh + 6, width: cw - 12, height: rh - 12, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: o.cfs || Math.round(rh * 0.4), color: K.white, textShadow: GLOW_T, zIndex: 2 });
    gsap.set(c, { opacity: 0 });
    c._slot = c0s[c0s.length - 1] || null;
    return c;
  }));
  gsap.set(box, { opacity: 0 });
  const sharpen = (h, t) => {
    tl.to(h.c, { filter: "blur(0px)", color: "#ffffff", textShadow: GLOW_T, duration: 0.22, ease: "power2.out" }, t);
    tl.set(h.c, { filter: "none" }, t + 0.23);
    tl.to(h.fl, { opacity: 1, duration: 0.07 }, t);
    tl.to(h.fl, { opacity: 0, duration: 0.45, ease: "power2.out" }, t + 0.08);
  };
  const pop = (c, t) => {
    tl.to(c, { opacity: 1, duration: 0.06 }, t);
    if (c._slot) tl.to(c._slot, { opacity: 0, duration: 0.1 }, t);
    tl.fromTo(c, { scale: 0.55 }, { scale: 1, duration: 0.3, ease: "back.out(2.6)", immediateRender: false }, t);
    tl.fromTo(c, { backgroundColor: "rgba(255,255,255,.18)" }, { backgroundColor: "rgba(255,255,255,0)", duration: 0.4, ease: "power2.out", immediateRender: false }, t);
  };
  let pillEl = null;
  return {
    box, W, H, rect: [x0 - 10, y0 - 10, x0 + W + 10, y0 + H + 10], cells,
    cellXY: (i, j) => [x0 + gx + j * cw + cw / 2, y0 + gy + i * rh + rh / 2],
    show: (t) => {
      blurIn(box, t, { y: 30, blur: 12, dur: 0.45, scale: 0.97 });
      vl.forEach((l, k) => tl.fromTo(l, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, t + 0.12 + k * 0.025));
      hl.forEach((l, k) => tl.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, t + 0.16 + k * 0.03));
      tl.set(sh, { opacity: 1 }, t + 0.3);
      tl.fromTo(sh, { x: -70 }, { x: W, duration: 0.78, ease: "power1.inOut", immediateRender: false }, t + 0.3);
      tl.set(sh, { opacity: 0 }, t + 1.08);
    },
    head: (j, t) => sharpen(heads[j], t),
    rowHead: (i, t) => sharpen(rheads[i], t),
    heads: (t, step) => { heads.forEach((h, j) => sharpen(h, t + j * (step == null ? 0.1 : step))); return t + nC * (step == null ? 0.1 : step); },
    cell: (i, j, t, html) => { const c = cells[i][j]; c.innerHTML = html; pop(c, t); return c; },
    fill: (t, oo) => {
      oo = oo || {};
      const step = oo.step == null ? 0.1 : oo.step, f = oo.fmt || ((k) => String(k)), from = oo.from || 1;
      const order = [];
      if (oo.order === "col") for (let j = 0; j < nC; j++) for (let i = 0; i < nR; i++) order.push([i, j]);
      else for (let i = 0; i < nR; i++) for (let j = 0; j < nC; j++) order.push([i, j]);
      order.forEach(([i, j], k) => { cells[i][j].innerHTML = f(from + k); pop(cells[i][j], t + k * step); });
      return t + order.length * step;
    },
    lime: (i, j, t) => {
      const c = cells[i][j];
      tl.to(c, { background: limeFill(1), color: K.ink, textShadow: "0 0 0 rgba(0,0,0,0)", boxShadow: GLOW_A(0.8), duration: 0.18 }, t);
      tl.fromTo(c, { scale: 1.18 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t);
    },
    // pill lime sotto la tabella (il totale: "= 30 contenuti")
    pill: (t, html, oo) => {
      oo = oo || {};
      pillEl = el(parent, { position: "absolute", left: cx - 300, top: y0 + H + 36, width: 600, display: "flex", justifyContent: "center", zIndex: z + 2 });
      const p = el(pillEl, { display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: 22, background: limeFill(1), boxShadow: `${GLOW_A(0.8)}, inset 0 2px 0 rgba(255,255,255,.6)`, fontFamily: FD, fontWeight: 700, fontSize: oo.fs || 54, color: K.ink, whiteSpace: "nowrap" }, html, "span");
      gsap.set(pillEl, { opacity: 0 });
      tl.fromTo(pillEl, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, t);
      tl.fromTo(p, { scaleX: 0.06 }, { scaleX: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, t);
      return pillEl;
    },
  };
};

// ═══ D03 · curva che si disegna con le etichette e la camera che la segue (reel 110 e 64 di Kallaway) ═══════════════════════
// Assi a L che crescono dall'origine (0,3 s), curva al neon lime (alone, corpo, anima chiara) che si traccia a velocità
// costante (~1,2 s) con una testa luminosa, pallini che si accendono quando la punta ci passa, etichette a pill bianca che si
// aprono come una barra (0,17 s) accanto al punto, titoli degli assi che si scrivono (T03) con il valore in una pill lime.
// x0, y0 = origine degli assi (in basso a sinistra) · pts: [[u, v], …] in 0..1 (u verso destra, v verso l'alto)
// o: { w (760), h (520), dots (indici dei pallini, default tutti tranne il primo), grid (righe, 4), yTicks, xTicks (valori sugli assi), tfs,
//   ghost (curva grigia sfocata già presente), area (velo bianco sotto la curva), bars (colonne sotto la curva, una per tacca), z }
//   · .storyAt(k, t, handle) foto con l'anello delle storie
// → { rect, pt(k), tip(f), axes(t), draw(t, dur), label(k, t, testo, lato "l"|"r"|"t"|"b"), axisLabel(t, "x"|"y", testo, valore) }
const lineChart = (parent, x0, y0, pts, o) => {
  o = o || {};
  const w = o.w || 760, h = o.h || 520, z = o.z || 12;
  const P = pts.map(([u, v]) => [x0 + u * w, y0 - v * h]);
  const hx = x0 - 80, hy = y0 - h - 120, HW = w + 200, HH = h + 220;
  const holder = el(parent, { position: "absolute", left: hx, top: hy, width: HW, height: HH, zIndex: z, pointerEvents: "none" });
  const S = svgIn(holder, HW, HH);
  const X = (x) => (x - hx).toFixed(1), Y = (y) => (y - hy).toFixed(1);
  let d = `M${X(P[0][0])} ${Y(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    d += ` C${X(p1[0] + (p2[0] - p0[0]) / 6)} ${Y(p1[1] + (p2[1] - p0[1]) / 6)} ${X(p2[0] - (p3[0] - p1[0]) / 6)} ${Y(p2[1] - (p3[1] - p1[1]) / 6)} ${X(p2[0])} ${Y(p2[1])}`;
  }
  const ax = (dd) => { const p = pathEl(S, dd, { fill: "none", stroke: "#ffffff", "stroke-width": 5, "stroke-linecap": "round" }); p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.75))"; drawable(p); return p; };
  // griglia leggera e valori sugli assi (o.yTicks dal basso, o.xTicks da sinistra): danno la scala, compaiono con gli assi
  const gl = [];
  const nG = o.yTicks ? o.yTicks.length : o.grid == null ? 4 : o.grid;
  for (let k = 1; k <= nG; k++) { const gy = y0 - (h * k) / nG; const q = pathEl(S, `M${X(x0)} ${Y(gy)} L${X(x0 + w + 20)} ${Y(gy)}`, { fill: "none", stroke: "rgba(255,255,255,.09)", "stroke-width": 2, "stroke-dasharray": "6 10" }); gl.push(q); }
  const tks = [];
  (o.yTicks || []).forEach((tx, k) => tks.push(el(parent, { position: "absolute", left: x0 - 220, top: y0 - (h * (k + 1)) / nG - 18, width: 200, textAlign: "right", fontFamily: FS, fontWeight: 700, fontSize: o.tfs || 26, color: "rgba(255,255,255,.55)", whiteSpace: "nowrap", zIndex: z + 1 }, tx)));
  (o.xTicks || []).forEach((tx, k, A) => tks.push(el(parent, { position: "absolute", left: x0 + (w * (k + 0.5)) / A.length - 60, top: y0 + 16, width: 120, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: o.tfs || 26, color: "rgba(255,255,255,.55)", whiteSpace: "nowrap", zIndex: z + 1 }, tx)));
  gsap.set([...gl, ...tks], { opacity: 0 });
  const axY = ax(`M${X(x0)} ${Y(y0)} L${X(x0)} ${Y(y0 - h - 40)}`), axX = ax(`M${X(x0)} ${Y(y0)} L${X(x0 + w + 40)} ${Y(y0)}`);
  // o.ghost: la curva c'è già, grigia e sfocata (come le voci non ancora dette di L01), e il neon la ripassa
  const ghost = o.ghost ? pathEl(S, d, { fill: "none", stroke: "rgba(255,255,255,.22)", "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round" }) : null;
  if (ghost) { ghost.style.filter = "blur(4px)"; gsap.set(ghost, { opacity: 0 }); }
  // o.area: velo bianco sotto la curva (mai lime trasparente), rivelato da sinistra insieme al tratto
  let areaClip = null, area = null;
  if (o.area) {
    const gid = "lca" + ++SVGN;
    S._defs.insertAdjacentHTML("beforeend", `<linearGradient id="${gid}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>`);
    const cp = document.createElementNS(NS, "clipPath");
    cp.setAttribute("id", gid + "c");
    areaClip = document.createElementNS(NS, "rect");
    areaClip.setAttribute("x", X(x0)); areaClip.setAttribute("y", 0); areaClip.setAttribute("width", 0); areaClip.setAttribute("height", HH);
    cp.appendChild(areaClip); S._defs.appendChild(cp);
    area = pathEl(S, d + ` L${X(P[P.length - 1][0])} ${Y(y0)} L${X(P[0][0])} ${Y(y0)} Z`, { fill: `url(#${gid}g)`, "clip-path": `url(#${gid}c)` });
  }
  // o.bars: n colonne di vetro scuro (una per tacca dell'asse x) alte quanto la curva in quel punto
  const bars = [];
  if (o.bars) {
    const nb = o.xTicks ? o.xTicks.length : o.bars, bw = (w / nb) * 0.56;
    for (let k = 0; k < nb; k++) {
      const bx = x0 + (w * (k + 0.5)) / nb;
      // altezza = curva in quel punto (interpolata tra i punti dati)
      let v = pts[pts.length - 1][1];
      for (let q = 0; q < pts.length - 1; q++) if ((k + 0.5) / nb >= pts[q][0] && (k + 0.5) / nb <= pts[q + 1][0]) { const f = ((k + 0.5) / nb - pts[q][0]) / (pts[q + 1][0] - pts[q][0]); v = pts[q][1] + (pts[q + 1][1] - pts[q][1]) * f; }
      const bh = Math.max(12, v * h - 16);
      const b = el(parent, { position: "absolute", left: bx - bw / 2, top: y0 - bh, width: bw, height: bh, borderRadius: "12px 12px 3px 3px", background: "linear-gradient(90deg,#2a2a2a 0%,#474747 35%,#5a5a5a 48%,#404040 70%,#262626 100%)", border: "1.5px solid rgba(255,255,255,.16)", borderBottom: "none", boxShadow: "inset 0 2px 0 rgba(255,255,255,.22)", transformOrigin: "50% 100%", zIndex: z - 1 });
      gsap.set(b, { scaleY: 0 });
      bars.push({ b, f: (k + 0.5) / nb });
    }
  }
  const glowC = pathEl(S, d, { fill: "none", stroke: K.lime, "stroke-width": 30, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.32 });
  glowC.style.filter = "blur(12px)";
  const body = pathEl(S, d, { fill: "none", stroke: K.lime, "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round" });
  body.style.filter = "drop-shadow(0 0 10px rgba(207,251,80,.8))";
  const core = pathEl(S, d, { fill: "none", stroke: "#f4ffd0", "stroke-width": 3.6, "stroke-linecap": "round", "stroke-linejoin": "round" });
  const L = drawable(body); drawable(glowC); drawable(core);
  // campioni del tracciato (testa luminosa, istante in cui la punta passa sui pallini)
  const N = 240, SM = [];
  for (let i = 0; i <= N; i++) { const q = body.getPointAtLength((i / N) * L); SM.push([q.x + hx, q.y + hy]); }
  const fracOf = (p) => { let bi = 0, bd = 1e12; SM.forEach((q, i) => { const dd = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (dd < bd) { bd = dd; bi = i; } }); return bi / N; };
  const head = el(parent, { position: "absolute", left: -13, top: -13, width: 26, height: 26, borderRadius: "50%", background: "#fff", boxShadow: "0 0 14px #fff, 0 0 34px rgba(207,251,80,.95)", opacity: 0, zIndex: z + 3 });
  layered(head);
  // o.playhead (reel 110): sotto l'asse una barra a segmenti che avanza con la punta (la "timeline" del video): ogni segmento si
  // riempie di lime quando la curva ci passa sopra
  const phSeg = [];
  if (o.playhead) {
    const nS = o.xTicks ? o.xTicks.length : 6, gp = 8, sw = (w - gp * (nS - 1)) / nS, py = y0 + (o.xTicks ? 64 : 22);
    for (let k = 0; k < nS; k++) {
      const tr = el(parent, { position: "absolute", left: x0 + k * (sw + gp), top: py, width: sw, height: 16, borderRadius: 5, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.14)", overflow: "hidden", zIndex: z + 1 });
      const fl = el(tr, { position: "absolute", inset: 0, background: limeFill(1), boxShadow: GLOW_A(0.5), transformOrigin: "0 50%" });
      gsap.set(fl, { scaleX: 0 });
      gsap.set(tr, { opacity: 0 });
      phSeg.push({ tr, fl, f0: k / nS, f1: (k + 1) / nS });
    }
  }
  const dotIdx = o.dots || P.map((_, i) => i).slice(1);
  const dots = dotIdx.map((k) => {
    const dt = el(parent, { position: "absolute", left: P[k][0] - 10, top: P[k][1] - 10, width: 20, height: 20, borderRadius: "50%", background: "#fff", border: `3px solid ${K.lime}`, boxShadow: "0 0 12px #fff, 0 0 26px rgba(207,251,80,.85)", zIndex: z + 2 });
    gsap.set(dt, { opacity: 0, scale: 0.3 });
    return { k, dt, f: fracOf(P[k]) };
  });
  return {
    holder, rect: [x0 - 40, y0 - h - 90, x0 + w + 60, y0 + 60],
    pt: (k) => P[k].slice(),
    tip: (f) => SM[Math.round(Math.max(0, Math.min(1, f)) * N)].slice(),
    axes: (t) => {
      drawOn(axY, t, 0.3, "power2.out"); drawOn(axX, t + 0.06, 0.32, "power2.out");
      if (ghost) tl.to(ghost, { opacity: 1, duration: 0.4 }, t + 0.2);
      if (ghost) bars.forEach((x, k) => { tl.to(x.b, { scaleY: 1, duration: 0.45, ease: "power3.out" }, t + 0.25 + k * 0.05); tl.fromTo(x.b, { opacity: 0 }, { opacity: 0.55, duration: 0.3, immediateRender: false }, t + 0.25 + k * 0.05); });
      gl.forEach((q, k) => tl.to(q, { opacity: 1, duration: 0.3 }, t + 0.15 + k * 0.05));
      phSeg.forEach((x, k) => tl.to(x.tr, { opacity: 1, duration: 0.25 }, t + 0.2 + k * 0.03));
      tks.forEach((q, k) => tl.fromTo(q, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, t + 0.2 + k * 0.04));
    },
    draw: (t, dur) => {
      dur = dur || 1.2;
      [glowC, body, core].forEach((p) => drawOn(p, t, dur, "none"));
      if (areaClip) tl.to(areaClip, { attr: { width: w + 10 }, duration: dur, ease: "none" }, t);
      bars.forEach((x) => {
        const tb = t + dur * Math.max(0, x.f - 0.06);
        if (ghost) { tl.to(x.b, { opacity: 1, borderColor: "rgba(255,255,255,.3)", duration: 0.25 }, tb); tl.fromTo(x.b, { y: 6 }, { y: 0, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, tb); }
        else tl.to(x.b, { scaleY: 1, duration: 0.4, ease: "power3.out" }, tb);
      });
      if (ghost) tl.to(ghost, { opacity: 0, duration: 0.3 }, t + dur);
      phSeg.forEach((x) => tl.to(x.fl, { scaleX: 1, duration: dur * (x.f1 - x.f0), ease: "none" }, t + dur * x.f0));
      const U = { u: 0 };
      const put = () => { const f = U.u * N, i = Math.min(N - 1, Math.floor(f)), r = f - i; gsap.set(head, { x: SM[i][0] + (SM[i + 1][0] - SM[i][0]) * r, y: SM[i][1] + (SM[i + 1][1] - SM[i][1]) * r }); };
      put();
      tl.set(head, { opacity: 1 }, t);
      tl.fromTo(U, { u: 0 }, { u: 1, duration: dur, ease: "none", onUpdate: put, immediateRender: false }, t);
      tl.to(head, { opacity: 0, duration: 0.25 }, t + dur);
      dots.forEach((x) => {
        const td = t + dur * x.f;
        tl.to(x.dt, { opacity: 1, duration: 0.06 }, td);
        tl.to(x.dt, { scale: 1, duration: 0.3, ease: "back.out(3)" }, td);
      });
      return t + dur;
    },
    // foto profilo vera con l'anello delle storie (gradiente di Instagram) sul punto k: "qui iniziano le storie"
    storyAt: (k, t, handle, oo) => {
      oo = oo || {};
      const d0 = oo.d || 92, [px, py] = P[k];
      const ring = el(parent, { position: "absolute", left: px - d0 / 2 - 6, top: py - d0 / 2 - 6, width: d0 + 12, height: d0 + 12, borderRadius: "50%", background: "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)", padding: 5, zIndex: z + 5, boxShadow: "0 12px 26px rgba(0,0,0,.55)" });
      const inner = el(ring, { width: "100%", height: "100%", borderRadius: "50%", background: "#1e1e1e", padding: 3 });
      const face = el(inner, { width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", position: "relative", background: "#333" });
      imgIn(face, "av-" + (handle || "tu"), { objectFit: "cover" });
      gsap.set(ring, { opacity: 0, scale: 0.4 });
      tl.to(ring, { opacity: 1, duration: 0.08 }, t);
      tl.to(ring, { scale: 1, duration: 0.42, ease: "back.out(2.4)" }, t);
      ripple(parent, px, py, t + 0.05, { r: d0 * 0.8, s0: 0.6, s1: 1.7, w: 3, dur: 0.5, z: z + 4 });
      return ring;
    },
    // etichetta a pill bianca che si apre come una barra accanto al punto k
    label: (k, t, text, side, oo) => {
      oo = oo || {};
      const [px, py] = P[k], fsz = oo.fs || 36, ph = Math.round(fsz * 1.75), gapX = oo.gap || 26, gapY = oo.gap || 30;
      side = side || "r";
      const wrap = el(parent, { position: "absolute", left: side === "l" ? px - gapX - 600 : side === "r" ? px + gapX : px - 300, top: side === "t" ? py - gapY - ph : side === "b" ? py + gapY : py - ph / 2, width: 600, height: ph, display: "flex", justifyContent: side === "l" ? "flex-end" : side === "r" ? "flex-start" : "center", zIndex: z + 4, pointerEvents: "none" });
      const p = el(wrap, { display: "inline-flex", alignItems: "center", height: ph, padding: `0 ${Math.round(fsz * 0.6)}px`, borderRadius: Math.round(fsz * 0.4), background: oo.lime ? limeFill(1) : "linear-gradient(180deg,#ffffff,#ececE6)", boxShadow: oo.lime ? `${GLOW_A(0.7)}, 0 12px 28px rgba(0,0,0,.5)` : "0 12px 28px rgba(0,0,0,.5), 0 0 22px rgba(255,255,255,.18)", transformOrigin: side === "l" ? "100% 50%" : side === "r" ? "0% 50%" : "50% 50%", fontFamily: FS, fontWeight: 800, fontSize: fsz, color: K.ink, whiteSpace: "nowrap" }, null, "span");
      const tx = el(p, { display: "inline-block" }, text, "span");
      gsap.set(p, { scaleX: 0.05, opacity: 0 });
      gsap.set(tx, { opacity: 0 });
      tl.to(p, { opacity: 1, duration: 0.05 }, t);
      tl.to(p, { scaleX: 1, duration: 0.17, ease: "power2.out" }, t);
      tl.to(tx, { opacity: 1, duration: 0.12 }, t + 0.1);
      return wrap;
    },
    // titolo di un asse che si scrive (T03) + valore in una pill lime: "y" in alto a destra dell'asse verticale, "x" in fondo
    axisLabel: (t, which, text, val, oo) => {
      oo = oo || {};
      const fsz = oo.fs || 40;
      const n = el(parent, { position: "absolute", left: which === "y" ? x0 + 26 : x0 + w - 560, top: which === "y" ? y0 - h - 60 : y0 + (o.xTicks ? 62 : 22) + (o.playhead ? 36 : 0), width: 560, display: "flex", alignItems: "center", justifyContent: which === "y" ? "flex-start" : "flex-end", gap: 14, zIndex: z + 4 });
      const lab = el(n, { fontFamily: FS, fontWeight: 800, fontSize: fsz, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, "", "span");
      const end = typeIn(lab, text, t, 26, { size: fsz });
      if (val) {
        const v = el(n, { display: "inline-flex", padding: `${Math.round(fsz * 0.12)}px ${Math.round(fsz * 0.4)}px`, borderRadius: Math.round(fsz * 0.3), background: limeFill(1), boxShadow: GLOW_A(0.7), fontFamily: FS, fontWeight: 800, fontSize: Math.round(fsz * 0.9), color: K.ink, whiteSpace: "nowrap" }, val, "span");
        gsap.set(v, { opacity: 0, scale: 0.6 });
        tl.to(v, { opacity: 1, duration: 0.08 }, end + 0.05);
        tl.to(v, { scale: 1, duration: 0.3, ease: "back.out(2.6)" }, end + 0.05);
      }
      return n;
    },
  };
};

// ═══ K17 · mappa a ∞: le tappe di un ciclo attorno al simbolo, la camera viaggia lungo il tubo da una tappa all'altra ═════════
// (reel 79 di Kallaway, 34,7 s e 50,9 s) Il simbolo è il tubo al neon (neonPath, con le molecole di dopamina dentro); le tappe
// sono numeri grandi col nome: 1 in alto a sinistra, 2 in basso a destra, 3 in alto a destra, 4 in basso a sinistra (l'ordine in
// cui si percorre il ∞). .go(i, t) porta la camera sulla tappa i: dalla tappa precedente ci arriva viaggiando lungo il tubo
// (pathCam: parte decisa, frena a lungo, ~1,5 s) con un riflesso che corre davanti; la prima volta entra con un taglio. Il numero
// compare grigio e diventa bianco; il nome si accende sulla parola detta (.name(i, tempi)). .overview(t, dur) allarga sulla mappa
// intera; .dive(i, t, dur) entra nella tappa i dalla mappa (zoom deciso con frenata, come a 50,9 s).
// nomi: ["Posta in gioco", "Domanda", …] ("\n" = a capo) · o: { a (mezza larghezza, 420), b (mezza altezza, 270), w (tubo, 60),
//   molecole (true), fs (nome, 64), lobo (quanto lobo si vede oltre il centro, 0,45 di b), z } → { np, rect, stageXY(i), poseStage(i), go(i, t, {dur}), name(i, tempi), overview(t, dur),
//   dive(i, t, dur), labs }
const loopMap = (parent, cx, cy, nomi, o) => {
  o = o || {};
  const a = o.a || 420, b = o.b || 270, w = o.w || 60, z = o.z || 10, fs = o.fs || 64;
  const d = `M${cx} ${cy} C${cx + 0.35 * a} ${cy - b} ${cx + a} ${cy - b} ${cx + a} ${cy} C${cx + a} ${cy + b} ${cx + 0.35 * a} ${cy + b} ${cx} ${cy} C${cx - 0.35 * a} ${cy - b} ${cx - a} ${cy - b} ${cx - a} ${cy} C${cx - a} ${cy + b} ${cx - 0.35 * a} ${cy + b} ${cx} ${cy}`;
  const np = neonPath(parent, d, { w, z, drawn: o.drawn !== false, molecole: o.molecole !== false });
  const p = np.path, L = np.L, NS0 = 480, SM = [];
  for (let i = 0; i <= NS0; i++) { const q = p.getPointAtLength((i / NS0) * L); SM.push([q.x, q.y]); }
  // punti più alti / più bassi di ogni quarto del tracciato = dove stanno le tappe
  const la = [0, 1, 2, 3].map((q) => {
    let bi = q * (NS0 / 4), bv = q % 2 ? -1e9 : 1e9;
    for (let i = q * (NS0 / 4); i < (q + 1) * (NS0 / 4); i++) { const y = SM[i][1]; if (q % 2 ? y > bv : y < bv) { bv = y; bi = i; } }
    return (bi / NS0) * L;
  });
  const QS = [2, 1, 0, 3]; // tappa → quarto: 1 in alto a sinistra, 2 in basso a destra, 3 in alto a destra, 4 in basso a sinistra
  const AX = QS.map((q) => { const v = p.getPointAtLength(la[q]); return [v.x, v.y]; });
  const labs = nomi.map((nm, i) => {
    const top = QS[i] % 2 === 0, [ax, ay] = AX[i];
    const righe = nm.split("\n"), lw = Math.max(...righe.map((r) => r.length)) * fs * 0.58 + fs * 1.6;
    const y = top ? ay - w / 2 - 30 : ay + w / 2 + 30, x = ax - 0.3 * a;
    const holder = el(parent, { position: "absolute", left: x, top: y, width: 1, height: 1, zIndex: z + 6 });
    const blk = el(holder, Object.assign({ position: "absolute", left: 0, display: "flex", alignItems: "flex-end", gap: Math.round(fs * 0.22), whiteSpace: "nowrap" }, top ? { bottom: 0 } : { top: 0 }));
    const num = el(blk, { fontFamily: FD, fontWeight: 700, fontSize: Math.round(fs * 2.3), lineHeight: 0.8, color: K.white, textShadow: GLOW_T }, String(i + 1), "span");
    const nameEl = el(blk, { display: "flex", flexDirection: "column", fontFamily: FD, fontWeight: 700, fontSize: fs, lineHeight: 1.0, color: K.white, textShadow: GLOW_T, paddingBottom: Math.round(fs * 0.02) }, null, "span");
    const words = [];
    righe.forEach((r) => { const rr = el(nameEl, { display: "block" }, null, "span"); r.split(" ").forEach((wd, k, A) => words.push(el(rr, { display: "inline-block", whiteSpace: "pre" }, wd + (k < A.length - 1 ? " " : ""), "span"))); });
    gsap.set(num, { opacity: 0 });
    gsap.set(words, { opacity: 0 });
    const nh = fs * 2.3 * 0.8, bh = Math.max(nh, righe.length * fs);
    return { num, words, top, rect: [x - 10, top ? y - bh - 10 : y - 10, x + lw + 10, top ? y + 10 : y + bh + 10] };
  });
  // inquadratura di una tappa: l'etichetta e il suo lobo fin oltre il centro (il frame resta pieno anche per le tappe in basso)
  const poseStage = (i) => {
    const [ax, ay] = AX[i], r = labs[i].rect, top = labs[i].top;
    const y0 = top ? r[1] : cy - (o.lobo == null ? 0.45 : o.lobo) * b, y1 = top ? cy + (o.lobo == null ? 0.45 : o.lobo) * b : r[3];
    return fitPose(Math.min(r[0], ax - 0.6 * a) - 24, y0 - 24, Math.max(r[2], ax + 0.6 * a) + 24, y1 + 24, { top: 330, fill: 0.97 });
  };
  const showNum = (i, t) => {
    tl.fromTo(labs[i].num, { opacity: 0, filter: "blur(8px)", color: GREY }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power2.out", immediateRender: false }, t);
    tl.to(labs[i].num, { color: K.white, duration: 0.2 }, t + 0.25);
    tl.set(labs[i].num, { filter: "none" }, t + 0.25);
  };
  const name = (i, times) => {
    const W = labs[i].words, T = Array.isArray(times) ? times : W.map((_, k) => times + k * 0.12);
    W.forEach((wd, k) => {
      tl.fromTo(wd, { opacity: 0, filter: "blur(8px)", color: GREY }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power2.out", immediateRender: false }, T[Math.min(k, T.length - 1)]);
      tl.to(wd, { color: K.white, duration: 0.2 }, T[Math.min(k, T.length - 1)] + 0.12);
      tl.set(wd, { filter: "none" }, T[Math.min(k, T.length - 1)] + 0.21);
    });
  };
  let cur = -1;
  const all = [cx - a - w - 40, cy - b - w - 40, cx + a + w + 40, cy + b + w + 40];
  labs.forEach((l) => { all[0] = Math.min(all[0], l.rect[0]); all[1] = Math.min(all[1], l.rect[1]); all[2] = Math.max(all[2], l.rect[2]); all[3] = Math.max(all[3], l.rect[3]); });
  return {
    np, labs, rect: all, stageXY: (i) => AX[i].slice(), poseStage, name, showNum,
    // la camera va alla tappa i: dalla tappa corrente lungo il tubo (all'indietro: 1 → 2 → 3 → 4), altrimenti con un taglio
    go: (i, t, oo) => {
      oo = oo || {};
      const pj = poseStage(i);
      if (cur < 0) { cutTo(t, pj.fx, pj.fy, pj.s); showNum(i, t + (oo.num == null ? 0.05 : oo.num)); cur = i; return pj; }
      const pi = poseStage(cur), L0 = la[QS[cur]];
      let L1 = la[QS[i]];
      if (L1 >= L0) L1 -= L;
      const dur = oo.dur || 1.5;
      pathCam(t, dur, p, L0, L1, pi.s, pj.s, { off0: [pi.fx - AX[cur][0], pi.fy - AX[cur][1]], off1: [pj.fx - AX[i][0], pj.fy - AX[i][1]], dip: oo.dip == null ? 0.12 : oo.dip, blur: oo.blur || 9, cut: false });
      np.glintTo(t, L0, L1, dur * 0.7, "power2.out");
      showNum(i, t + (oo.num == null ? 0.22 : oo.num));
      cur = i;
      return pj;
    },
    overview: (t, dur) => { const pz = fitPose(all[0], all[1], all[2], all[3], { top: 330, fill: 0.95 }); move(t, dur || 0.9, pz.fx, pz.fy, pz.s); return pz; },
    dive: (i, t, dur, oo) => {
      oo = oo || {};
      const pj = poseStage(i), e = KW.arrive;
      camK(t, dur || 1.1, pj.fx, pj.fy, pj.s, e);
      mblurV(t, dur || 1.1, e, oo.blur || 7, "xy");
      showNum(i, t + 0.15);
      cur = i;
      return pj;
    },
  };
};

// ═══ K12 · nastro trasportatore (reel 32 e 25 di Kallaway) ═══════════════════════════════════════════════════════════
// Una fila di card scorre verso sinistra a velocità costante (~120 px/s misurati) per tutta la sezione: le card sono già sul nastro,
// sfocate e spente (non ancora dette), e ognuna si accende quando viene nominata (a fuoco, bordo lime, numero lime, piccolo colpo).
// La camera resta ferma: si muove il nastro. cards: [{t: "Risultati", icon: "trophy", media: "th-…" | id video}] · o: { w (260),
// h (330), gap (28), speed (120), z } → { strip, items, run(t0, t1), on(i, t), xAt(i, t), rect(t) }
const conveyor = (parent, x0, y, cards, o) => {
  o = o || {};
  const w = o.w || 260, h = o.h || 330, g = o.gap || 28, sp = o.speed || 120, z = o.z || 12;
  const strip = el(parent, { position: "absolute", left: x0, top: y - h / 2, width: 1, height: h, zIndex: z });
  let T0 = 0;
  // o.timeline (reel 25): l'etichetta esce dalla card e sta in una pillola sotto, appesa con un trattino a una linea del tempo che
  // scorre con il nastro; la card è tutta copertina (reel vero 9:16)
  const TLy = h + 150;
  if (o.timeline) el(strip, { position: "absolute", left: -1400, top: TLy, width: cards.length * (w + g) + 2800, height: 3, borderRadius: 2, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55) 12%, rgba(255,255,255,.55) 88%, rgba(255,255,255,0))", boxShadow: "0 0 10px rgba(255,255,255,.3)" });
  const items = cards.map((c, i) => {
    const card = glass(strip, i * (w + g), 0, w, h, { borderRadius: 26 });
    const mh = o.timeline ? h - 28 : Math.round(h * 0.56);
    if (c.media) {
      const m = el(card, { position: "absolute", left: 14, top: 14, width: w - 28, height: mh, borderRadius: 16, overflow: "hidden", background: "#111" });
      mediaTile(m, 0, 0, w - 28, mh, c.media, 1);
    } else el(card, { position: "absolute", left: 14, top: 14, width: w - 28, height: mh, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,.10), rgba(255,255,255,.02) 70%)" }, svg(c.icon || "circle", Math.round(mh * 0.46), "rgba(255,255,255,.88)", 1.8));
    const num = el(card, { position: "absolute", left: 24, top: 24, width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,20,20,.75)", border: "1.5px solid rgba(255,255,255,.25)", fontFamily: FD, fontWeight: 700, fontSize: 26, color: K.white, zIndex: 3 }, String(i + 1).padStart(2, "0"));
    const numOn = el(num, { position: "absolute", inset: -1.5, borderRadius: 14, background: limeFill(1), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 26, color: K.ink, opacity: 0 }, String(i + 1).padStart(2, "0"));
    let lab, pill = null, tick = null;
    if (o.timeline) {
      tick = el(strip, { position: "absolute", left: i * (w + g) + w / 2 - 1.5, top: h + 86, width: 3, height: TLy - h - 86, background: "rgba(255,255,255,.4)" });
      pill = el(strip, { position: "absolute", left: i * (w + g) - 10, top: h + 22, width: w + 20, height: 64, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 });
      lab = el(pill, { padding: "0 18px", height: 58, display: "flex", alignItems: "center", borderRadius: 16, background: "linear-gradient(180deg, rgba(48,48,48,.95), rgba(26,26,26,.97))", border: "1.5px solid rgba(255,255,255,.28)", boxShadow: "0 12px 26px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 26, color: K.white, whiteSpace: "nowrap" }, c.t);
      gsap.set([pill, tick], { opacity: 0.45, filter: "blur(3px)" });
    } else lab = el(card, { position: "absolute", left: 16, right: 16, top: mh + 30, bottom: 16, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 32, lineHeight: 1.1, color: K.white, textShadow: GLOW_T }, c.t);
    gsap.set(card, { filter: "blur(5px) brightness(.55)" });
    return { card, num, numOn, lab, pill, tick };
  });
  return {
    strip, items,
    run: (t0, t1) => { T0 = t0; tl.fromTo(strip, { x: 0 }, { x: -sp * (t1 - t0), duration: t1 - t0, ease: "none", immediateRender: false }, t0); },
    on: (i, t) => {
      const it = items[i];
      tl.to(it.card, { filter: "blur(0px) brightness(1)", borderColor: "rgba(207,251,80,.75)", boxShadow: `0 34px 90px rgba(0,0,0,.6), ${GLOW_A(0.55)}`, duration: 0.3, ease: "power2.out" }, t);
      tl.set(it.card, { filter: "none" }, t + 0.31);
      tl.fromTo(it.card, { y: -14 }, { y: 0, duration: 0.4, ease: "back.out(2.6)", immediateRender: false }, t);
      tl.to(it.numOn, { opacity: 1, duration: 0.15 }, t);
      if (it.pill) {
        tl.to([it.pill, it.tick], { opacity: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out" }, t + 0.05);
        tl.set([it.pill, it.tick], { filter: "none" }, t + 0.31);
        tl.to(it.lab, { borderColor: "rgba(207,251,80,.85)", boxShadow: `0 12px 26px rgba(0,0,0,.5), ${GLOW_A(0.35)}`, duration: 0.25 }, t + 0.05);
        tl.to(it.tick, { background: K.lime, duration: 0.25 }, t + 0.05);
      }
      sheenK(it.card, t + 0.05, { dur: 0.7 });
    },
    xAt: (i, t) => x0 + i * (w + g) + w / 2 - sp * Math.max(0, t - T0),
    rect: (t, i0, i1) => { const xa = x0 + (i0 || 0) * (w + g) - sp * Math.max(0, t - T0); return [xa - 20, y - h / 2 - 20, xa + ((i1 == null ? 3 : i1) - (i0 || 0) + 1) * (w + g) - g + 20, y + h / 2 + 20]; },
  };
};

// ═══ O12 · lenti di vetro (reel 39 e 49 di Kallaway) ══════════════════════════════════════════════════════════════════
// Sfera di vetro scuro con un'immagine o un reel vero dentro (con l'ombra sferica ai bordi), il riflesso a falce in alto a sinistra,
// il bordo in luce e l'ombra portata. o.iris: un diaframma a 6 lamelle chiude la lente e .iris(t) lo apre sul contenuto (la lente
// grande del reel 39). orbFlower: n sfere a fiore attorno a una centrale, nascono fuori fuoco e vanno a fuoco (rack focus d'apertura)
// e ruotano piano; .focus(i, t) porta avanti una sfera e attenua le altre. orbFlower o: { r, R, k0 (scala della centrale), iris0
// (diaframma sulla centrale: .orbs[0].iris(t)), labels, z }
const glassOrb = (parent, cx, cy, r, media, o) => {
  o = o || {};
  const z = o.z || 12;
  const g = layered(el(parent, { position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, zIndex: z }));
  el(g, { position: "absolute", left: r * 0.1, top: r * 1.75, width: r * 1.8, height: r * 0.5, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.6), rgba(0,0,0,0))", zIndex: 0 });
  const ball = el(g, { position: "absolute", left: 0, top: 0, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 50% 45%, #2a2a2a, #0b0b0b 75%)", zIndex: 1 });
  // il contenuto nasce dopo il vetro: la sfera arriva scura e l'immagine si accende dentro (reel 39)
  let mt = null;
  if (media) { mt = mediaTile(ball, r * 0.08, r * 0.08, r * 1.84, r * 1.84, media, 1); mt.style.borderRadius = "50%"; gsap.set(mt, { opacity: 0 }); }
  // profondità sferica: bordo scuro interno + vignetta
  el(ball, { position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `inset 0 0 ${Math.round(r * 0.35)}px rgba(0,0,0,.85), inset 0 ${Math.round(-r * 0.12)}px ${Math.round(r * 0.3)}px rgba(0,0,0,.55)`, background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", zIndex: 5 });
  // diaframma (opzionale)
  const blades = [];
  if (o.iris) for (let k = 0; k < 6; k++) {
    const a = k * 60;
    const arm = el(ball, { position: "absolute", left: r, top: r, width: 1, height: 1, transform: `rotate(${a}deg)`, zIndex: 4 });
    const bl = el(arm, { position: "absolute", left: -r * 1.1, top: -r * 1.25, width: r * 2.2, height: r * 1.3, background: "linear-gradient(180deg, #2c2c2c, #121212 70%)", clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)", borderBottom: "1px solid rgba(255,255,255,.08)" });
    blades.push(bl);
  }
  // vetro: riflesso a falce in alto a sinistra + filo di luce sul bordo + riflesso basso
  el(g, { position: "absolute", left: 0, top: 0, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(ellipse 62% 42% at 34% 24%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.08) 55%, rgba(255,255,255,0) 72%)`, zIndex: 6 });
  el(g, { position: "absolute", left: 0, top: 0, width: 2 * r, height: 2 * r, borderRadius: "50%", border: "2px solid rgba(255,255,255,.28)", boxShadow: `0 0 ${Math.round(r * 0.18)}px rgba(255,255,255,.12), 0 ${Math.round(r * 0.12)}px ${Math.round(r * 0.4)}px rgba(0,0,0,.6)`, zIndex: 7 });
  el(g, { position: "absolute", left: r * 0.35, top: r * 1.55, width: r * 1.3, height: r * 0.28, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,255,255,.14), rgba(255,255,255,0))", zIndex: 6 });
  let lab = null;
  if (o.label) {
    lab = el(parent, { position: "absolute", left: cx - 220, top: cy + r + 18, width: 440, textAlign: "center", zIndex: z + 1 });
    el(lab, { display: "inline-block", padding: "8px 20px", borderRadius: 14, background: "rgba(22,22,22,.92)", border: "1.5px solid rgba(255,255,255,.22)", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 28, color: K.white, whiteSpace: "nowrap" }, o.label, "span");
    gsap.set(lab, { opacity: 0 });
  }
  gsap.set(g, { opacity: 0 });
  return {
    g, ball, lab, r, cx, cy,
    show: (t, o2) => {
      o2 = o2 || {};
      tl.fromTo(g, { opacity: 0, scale: 0.7, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: o2.dur || 0.6, ease: "power3.out", immediateRender: false }, t);
      tl.set(g, { filter: "none" }, t + (o2.dur || 0.6) + 0.01);
      if (mt) tl.to(mt, { opacity: 1, duration: 0.3, ease: "power1.out" }, t + (o2.mediaAt == null ? 0.3 : o2.mediaAt));
      if (lab) blurIn(lab, t + 0.25, { y: 10, blur: 8, dur: 0.3 });
    },
    // il diaframma si apre: le lamelle scivolano fuori ruotando (0,45 s, power3.inOut)
    iris: (t) => blades.forEach((bl, k) => tl.to(bl, { y: -r * 0.95, rotation: 18, duration: 0.45, ease: "power3.inOut" }, t + k * 0.015)),
  };
};
const orbFlower = (parent, cx, cy, medias, o) => {
  o = o || {};
  const r = o.r || 150, R = o.R || r * 1.9, n = medias.length - 1;
  const arm = el(parent, { position: "absolute", left: cx, top: cy, width: 1, height: 1, zIndex: o.z || 12 });
  // o.links: raggi dal centro (il tema) a ogni sfera (gli angoli), come i collegamenti del reel 49: si disegnano dopo le sfere,
  // ruotano con il fiore; focus(i) accende il raggio della sfera scelta (lime) e spegne gli altri
  const rays = [];
  if (o.links) {
    const SV = svgIn(arm, 1, 1);
    SV.style.zIndex = 1;
    for (let i = 1; i <= n; i++) {
      const a = ((i - 1) / n) * Math.PI * 2 - Math.PI / 2, r0 = r * (o.k0 || 1.05) + 6, r1 = R - r - 6;
      const p = pathEl(SV, `M${(Math.cos(a) * r0).toFixed(1)} ${(Math.sin(a) * r0).toFixed(1)} L${(Math.cos(a) * r1).toFixed(1)} ${(Math.sin(a) * r1).toFixed(1)}`, { fill: "none", stroke: "rgba(255,255,255,.55)", "stroke-width": 3, "stroke-linecap": "round" });
      const Ln = r1 - r0;
      p.setAttribute("stroke-dasharray", Ln.toFixed(1)); p.setAttribute("stroke-dashoffset", Ln.toFixed(1));
      p.style.filter = "drop-shadow(0 0 5px rgba(255,255,255,.45))";
      rays.push({ p, L: Ln });
    }
  }
  const orbs = medias.map((m, i) => {
    if (i === 0) return glassOrb(arm, 0, 0, r * (o.k0 || 1.05), m, { z: 3, label: o.labels && o.labels[0], iris: !!o.iris0 });
    const a = ((i - 1) / n) * Math.PI * 2 - Math.PI / 2;
    const orb = glassOrb(arm, Math.cos(a) * R, Math.sin(a) * R, r, m, { z: 2, label: o.labels && o.labels[i] });
    orb.holder = orb.g;
    return orb;
  });
  return {
    arm, orbs, rays, rect: [cx - R - r - 30, cy - R - r - 30, cx + R + r + 30, cy + R + r + (o.labels ? 80 : 30)],
    // rack focus d'apertura: tutte nascono sfocate insieme, la centrale per prima; poi i raggi escono dal centro
    show: (t) => {
      orbs.forEach((ob, i) => ob.show(t + (i === 0 ? 0 : 0.12 + i * 0.05), { dur: 0.7 }));
      rays.forEach((ry, i) => tl.to(ry.p, { attr: { "stroke-dashoffset": 0 }, duration: 0.35, ease: "power2.out" }, t + 0.55 + i * 0.04));
    },
    // rotazione lenta del fiore (le sfere restano dritte: contro-rotazione)
    spin: (t, dur, deg) => {
      tl.fromTo(arm, { rotation: 0 }, { rotation: deg || 20, duration: dur, ease: "none", immediateRender: false }, t);
      orbs.forEach((ob) => tl.fromTo(ob.g, { rotation: 0 }, { rotation: -(deg || 20), duration: dur, ease: "none", immediateRender: false }, t));
    },
    focus: (i, t) => {
      orbs.forEach((ob, j) => {
        tl.to(ob.g, { opacity: j === i || j === 0 ? 1 : (o.dim == null ? 0.5 : o.dim), scale: j === i ? 1.12 : j === 0 ? 1 : 0.92, duration: 0.35, ease: "power2.out" }, t);
        if (ob.lab) tl.to(ob.lab, { opacity: j === i ? 1 : 0.3, duration: 0.3 }, t);
      });
      rays.forEach((ry, j) => tl.to(ry.p, { attr: { stroke: j + 1 === i ? K.lime : "rgba(255,255,255,.3)", "stroke-width": j + 1 === i ? 5 : 3 }, duration: 0.3 }, t));
    },
    // tutte di nuovo accese (e raggi bianchi)
    all: (t) => {
      tl.to(orbs.map((ob) => ob.g), { opacity: 1, scale: 1, duration: 0.35 }, t);
      rays.forEach((ry) => tl.to(ry.p, { attr: { stroke: "rgba(255,255,255,.55)", "stroke-width": 3 }, duration: 0.3 }, t));
    },
  };
};

// ═══ H01 · annotazione a mano che entra con la scia (reel 102 e 66 di Kallaway) ═════════════════════════════════════════
// Una parola grande scritta a mano (Patrick Hand) con la freccia a ricciolo verso una pagina vera (docPage): entrano insieme da un
// lato (alternare sinistra/destra) con il motion blur in ~0,35 s e frenano; una per ogni parola detta.
// x, y = centro della pagina (nel parent) · o: { side (1: parola a destra della pagina, -1 a sinistra), page (titolo della pagina,
//   false = senza pagina), pw, ph, fs, z } → { g, show(t) }
const handIn = (parent, x, y, testo, o) => {
  o = o || {};
  const side = o.side || 1, pw = o.pw || 360, ph = o.ph || 210, fs = o.fs || 78, z = o.z || 14;
  const g = layered(el(parent, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: z }));
  if (o.page !== false) docPage(g, x - pw / 2, y - ph / 2, pw, ph, o.page || testo, (o.seed || 3), { z: 1 });
  const wx = side > 0 ? x + pw / 2 + 30 : x - pw / 2 - 30;
  const word = el(g, { position: "absolute", left: side > 0 ? wx : wx - 600, top: y - ph / 2 - fs * 0.35, width: 600, textAlign: side > 0 ? "left" : "right", fontFamily: FH, fontSize: fs, lineHeight: 1, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap", zIndex: 3 }, testo);
  // freccia a ricciolo: scende dalla parola, fa un occhiello e punta al bordo della pagina
  const S = svgIn(g, 1, 1);
  const ax = side > 0 ? wx + fs * 0.6 : wx - fs * 0.6, ay = y - ph / 2 + fs * 0.75, ex = side > 0 ? x + pw / 2 + 10 : x - pw / 2 - 10, ey = y - ph * 0.05;
  const s = side;
  const d = `M${ax} ${ay} C${ax + s * 10} ${ay + 40}, ${ax + s * 46} ${ay + 54}, ${ax + s * 40} ${ay + 26} C${ax + s * 34} ${ay + 4}, ${ax - s * 4} ${ay + 18}, ${ax + s * 6} ${ay + 46} C${ax + s * 12} ${ay + 64}, ${ex + s * 30} ${ey + 8}, ${ex} ${ey}`;
  pathEl(S, d, { fill: "none", stroke: "#ffffff", "stroke-width": 4.5, "stroke-linecap": "round", "stroke-linejoin": "round" });
  const hd = `M${ex + s * 22} ${ey - 14} L${ex} ${ey} L${ex + s * 24} ${ey + 12}`;
  pathEl(S, hd, { fill: "none", stroke: "#ffffff", "stroke-width": 4.5, "stroke-linecap": "round", "stroke-linejoin": "round" });
  S.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.5))";
  gsap.set(g, { opacity: 0 });
  return {
    g, word,
    show: (t, dur) => {
      dur = dur || 0.36;
      tl.fromTo(g, { opacity: 0, x: -side * 420 }, { opacity: 1, x: 0, duration: dur, ease: "power3.out", immediateRender: false }, t);
      tl.fromTo(g, { filter: "blur(9px)" }, { filter: "blur(0px)", duration: dur * 0.9, ease: "power2.out", immediateRender: false }, t);
      tl.set(g, { filter: "none" }, t + dur + 0.01);
    },
  };
};

// ═══ blocco 4 del piano (demo-5): le 11 rare ════════════════════════════════════════════════════════════════════════════

// O16 · superficie d'acqua in prospettiva (reel 65 di Kallaway): piano scuro ellittico con i riflessi; .ripples(t, x, y) onde
// concentriche bianche col bordo lime che si allargano e svaniscono (1 s, 3 onde a 0,18 s), .splash(t, x, y) gocce che saltano.
// cx, cy = centro del piano · w = larghezza · o: { k (schiacciamento prospettico, 0.3), z }
const water = (parent, cx, cy, w, o) => {
  o = o || {};
  const k = o.k || 0.3, h = Math.round(w * k), z = o.z || 9;
  const g = el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z });
  const surf = el(g, { position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 42%, #2c3a3f 0%, #1c272b 45%, #121a1d 75%, rgba(18,26,29,0) 100%)", boxShadow: "inset 0 10px 40px rgba(255,255,255,.06)" });
  // riflessi orizzontali (onde ferme)
  const gl = [];
  for (let i = 0; i < 7; i++) {
    const yy = h * (0.24 + i * 0.085), ww = w * (0.36 + 0.5 * Math.sin((i / 6) * Math.PI)) * 0.8;
    gl.push(el(g, { position: "absolute", left: w / 2 - ww / 2 + hash(i, 5) * 40, top: yy, width: ww, height: 3, borderRadius: 2, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.16), rgba(255,255,255,0))" }));
  }
  gsap.set(g, { opacity: 0 });
  return {
    g, w, h, rect: [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2],
    show: (t, dur) => { tl.fromTo(g, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: dur || 0.4, ease: "power2.out", immediateRender: false }, t); gl.forEach((x, i) => tl.to(x, { x: (i % 2 ? 1 : -1) * 30, duration: 4, ease: "sine.inOut" }, t)); },
    // onde concentriche dal punto (x, y) del parent
    ripples: (t, x, y, oo) => {
      oo = oo || {};
      const n = oo.n || 3, R = oo.r || w * 0.42;
      for (let i = 0; i < n; i++) {
        const r = el(parent, { position: "absolute", left: x - R, top: y - R * k, width: R * 2, height: R * 2 * k, borderRadius: "50%", border: `${i ? 3 : 5}px solid rgba(255,255,255,.9)`, boxShadow: `0 0 14px rgba(207,251,80,.55), inset 0 0 10px rgba(207,251,80,.35)`, opacity: 0, zIndex: z + 1, pointerEvents: "none" });
        gsap.set(r, { scale: 0.08 });
        tl.set(r, { opacity: 1 }, t + i * 0.18);
        tl.to(r, { scale: 1, opacity: 0, duration: oo.dur || 1.0, ease: "power2.out" }, t + i * 0.18);
      }
    },
    // gocce che saltano all'impatto
    splash: (t, x, y) => {
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + hash(i, 11) * 1.1, sp = 120 + Math.abs(hash(i, 4)) * 140;
        const d = el(parent, { position: "absolute", left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #cfe9ef 60%, rgba(255,255,255,.4))", opacity: 0, zIndex: z + 3 });
        tl.set(d, { opacity: 1 }, t);
        tl.to(d, { x: Math.cos(a) * sp * 0.8, duration: 0.55, ease: "power1.out" }, t);
        tl.to(d, { y: Math.sin(a) * sp, duration: 0.27, ease: "power2.out" }, t);
        tl.to(d, { y: 20, opacity: 0, duration: 0.28, ease: "power2.in" }, t + 0.27);
      }
    },
  };
};

// K08 · la camera segue un oggetto che cade (reel 65): l'oggetto accelera (power2.in) e la camera lo insegue con la stessa
// curva, poi all'impatto frena da sola (0,35 s). node = elemento già messo a (x0, y0) nel parent · pose = posa finale (fitPose)
const fallFollow = (node, t, x0, y0, x1, y1, pose, o) => {
  o = o || {};
  const dur = o.dur || 0.55;
  tl.to(node, { x: x1 - x0, y: y1 - y0, duration: dur, ease: "power2.in" }, t);
  tl.fromTo(node, { rotation: 0 }, { rotation: o.rot || 140, duration: dur, ease: "power1.in", immediateRender: false }, t);
  // la camera insegue: arriva quasi in posa insieme all'oggetto, poi l'aggancia in frenata
  const midY = pose.fy - (y1 - y0) * 0.08;
  camK(t, dur, pose.fx, midY, pose.s, "power2.in");
  camK(t + dur, o.brake || 0.35, pose.fx, pose.fy, pose.s, "power2.out");
  mblurV(t, dur, "power2.in", o.peak || 14, "y");
  return t + dur;
};

// sasso-oggetto: sfera lucida lime con l'icona di quello che rappresenta (es. "send" = una condivisione)
const pebble = (parent, x, y, d, icon, o) => {
  o = o || {};
  const b = layered(el(parent, { position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: "radial-gradient(circle at 34% 28%, #fbffe6 0%, #e4ff8c 22%, #CFFB50 52%, #9fca2c 86%, #7da11d 100%)", boxShadow: `${GLOW_A(0.7)}, 0 18px 34px rgba(0,0,0,.55)`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: o.z || 20 }, icon ? svg(icon, Math.round(d * 0.46), K.ink, 2.6) : ""));
  gsap.set(b, { opacity: 0 });
  return b;
};

// L06 · indice fisso in un angolo (reel ~70 di Kallaway): mini-lista delle sezioni sempre in vista (nell'HUD, la camera non la
// muove) con la sezione corrente in una pill lime; .go(i, t) cambia evidenziazione in 0,2 s. voci: ["Script", …]
// o: { x (40), top (360), w (250), fs (24), parent (hud) }
const sideIndex = (voci, o) => {
  o = o || {};
  const parent = o.parent || hud, x = o.x == null ? 40 : o.x, top = o.top == null ? 360 : o.top, w = o.w || 250, fs = o.fs || 24, rh = Math.round(fs * 2.1);
  const box = el(parent, { position: "absolute", left: x, top, width: w, height: voci.length * (rh + 8) + 18, borderRadius: 18, background: "linear-gradient(180deg, rgba(44,44,44,.92), rgba(26,26,26,.94))", border: "1.5px solid rgba(255,255,255,.16)", boxShadow: "0 18px 40px rgba(0,0,0,.5)", zIndex: 45 });
  const hl = el(box, { position: "absolute", left: 8, top: 9, width: w - 16, height: rh, borderRadius: 12, background: limeFill(1), boxShadow: GLOW_A(0.5), opacity: 0 });
  const rows = voci.map((v, i) => el(box, { position: "absolute", left: 18, top: 9 + i * (rh + 8), width: w - 36, height: rh, display: "flex", alignItems: "center", gap: 10, fontFamily: FS, fontWeight: 800, fontSize: fs, color: "rgba(255,255,255,.55)", whiteSpace: "nowrap", zIndex: 2 }, `<span style="font-family:${FD};opacity:.8">${i + 1}</span>${v}`));
  gsap.set(box, { opacity: 0 });
  let cur = -1;
  return {
    box,
    show: (t) => blurIn(box, t, { x: -40, y: 0, blur: 10, dur: 0.4 }),
    go: (i, t) => {
      tl.to(hl, { opacity: 1, y: i * (rh + 8), duration: cur < 0 ? 0.01 : 0.2, ease: "power2.inOut" }, t);
      rows.forEach((r, j) => tl.to(r, { color: j === i ? K.ink : "rgba(255,255,255,.55)", duration: 0.2 }, t));
      cur = i;
    },
  };
};

// U06 · lower third con la barra d'accento (reel 149 di Kallaway): barra verticale lime + nome in maiuscolo spaziato che si
// decodifica (0,25 s) + riga sotto più piccola. x, y = angolo in alto a sinistra (nel parent) · o: { fs (40), z }
const lowerThird = (parent, x, y, nome, sotto, o) => {
  o = o || {};
  const fs = o.fs || 40, z = o.z || 30;
  const g = el(parent, { position: "absolute", left: x, top: y, width: 1, height: 1, zIndex: z });
  const bar = el(g, { position: "absolute", left: 0, top: 0, width: 8, height: fs * 2.3, borderRadius: 3, background: K.lime, boxShadow: GLOW_A(0.7), transformOrigin: "50% 0%" });
  const n = el(g, { position: "absolute", left: 26, top: -2, fontFamily: FS, fontWeight: 800, fontSize: fs, letterSpacing: "0.16em", color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, "");
  const s = el(g, { position: "absolute", left: 28, top: fs * 1.32, fontFamily: FS, fontWeight: 600, fontSize: Math.round(fs * 0.58), letterSpacing: "0.14em", color: "rgba(255,255,255,.62)", whiteSpace: "nowrap" }, "");
  gsap.set(bar, { scaleY: 0 });
  return {
    g,
    show: (t) => {
      tl.to(bar, { scaleY: 1, duration: 0.22, ease: "power3.out" }, t);
      decode(n, nome.toUpperCase(), t + 0.05, 0.25);
      decode(s, sotto.toUpperCase(), t + 0.15, 0.25);
    },
  };
};

// L07 · tier list (reel ~19 di Kallaway): righe S/A/B/C con la lettera in un quadrato colorato (S lime, A bianco, B grigio,
// C grafite); .drop(node, riga, t) l'elemento cade dall'alto e attraversa le righe (~0,15 s a riga) fino al suo posto.
// rows: ["S", "A", "B", "C"] · o: { w (900), rh (150), gap (14), slot (larghezza di un elemento, 116), z }
const tierList = (parent, cx, top, rows, o) => {
  o = o || {};
  const w = o.w || 900, rh = o.rh || 150, gap = o.gap || 14, sw = o.slot || 116, z = o.z || 12;
  const COL = [limeFill(1), "linear-gradient(180deg,#ffffff,#dcdcdc)", "linear-gradient(180deg,#9a9a9a,#6e6e6e)", "linear-gradient(180deg,#575757,#3a3a3a)"];
  const used = rows.map(() => 0);
  const R = rows.map((k, i) => {
    const y = top + i * (rh + gap);
    const r = el(parent, { position: "absolute", left: cx - w / 2, top: y, width: w, height: rh, borderRadius: 18, background: "linear-gradient(180deg, rgba(46,46,46,.92), rgba(28,28,28,.95))", border: "1.5px solid rgba(255,255,255,.14)", boxShadow: "0 16px 36px rgba(0,0,0,.45)", zIndex: z });
    el(r, { position: "absolute", left: 10, top: 10, width: rh - 20, height: rh - 20, borderRadius: 14, background: COL[i % COL.length], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: Math.round(rh * 0.5), color: i < 2 ? K.ink : K.white, boxShadow: i === 0 ? GLOW_A(0.6) : "none" }, k);
    gsap.set(r, { opacity: 0 });
    return { r, y };
  });
  return {
    rows: R, rect: [cx - w / 2 - 20, top - 20, cx + w / 2 + 20, top + rows.length * (rh + gap) + 6],
    show: (t) => R.forEach((x, i) => blurIn(x.r, t + i * 0.08, { x: -30, y: 0, blur: 10, dur: 0.35 })),
    // posto libero nella riga i (centro x, y)
    slotXY: (i) => [cx - w / 2 + rh + 20 + used[i] * (sw + 16) + sw / 2, R[i].y + rh / 2],
    drop: (node, i, t) => {
      const [sx, sy] = [cx - w / 2 + rh + 20 + used[i] * (sw + 16) + sw / 2, R[i].y + rh / 2];
      used[i]++;
      const y0 = top - 260, nh = i + 1.6;
      gsap.set(node, { left: sx - sw / 2, top: sy - (parseFloat(node.style.height) || sw * 1.4) / 2 });
      tl.fromTo(node, { y: y0 - sy, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 * nh, ease: "power2.in", immediateRender: false }, t);
      tl.fromTo(node, { scale: 1.1 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t + 0.15 * nh);
      tl.to(R[i].r, { borderColor: "rgba(255,255,255,.5)", duration: 0.08 }, t + 0.15 * nh);
      tl.to(R[i].r, { borderColor: "rgba(255,255,255,.14)", duration: 0.3 }, t + 0.15 * nh + 0.1);
      return t + 0.15 * nh;
    },
  };
};

// O09 · forma che ruota e cambia forma (reel ~38 di Kallaway): esagono → pentagono → triangolo (≈1,4 s) e poi il triangolo si
// taglia in fasce (0,25 s) con le etichette. Forma lucida lime con il bordo chiaro e l'alone; i vertici sono 12 punti fissi, così
// GSAP interpola l'attributo d tra una forma e l'altra. o: { z }
const morphShape = (parent, cx, cy, r, o) => {
  o = o || {};
  const z = o.z || 12, N = 12;
  const poly = (k, rot) => { const V = []; for (let i = 0; i < k; i++) { const a = rot + (i / k) * Math.PI * 2; V.push([Math.cos(a) * r, Math.sin(a) * r]); } return V; };
  // distribuisce N punti lungo il perimetro del poligono (così ogni forma ha 12 punti)
  const spread = (V) => { const P = [], per = []; let tot = 0; for (let i = 0; i < V.length; i++) { const a = V[i], b = V[(i + 1) % V.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); per.push(l); tot += l; } for (let j = 0; j < N; j++) { let d = (j / N) * tot, i = 0; while (d > per[i]) { d -= per[i]; i++; } const a = V[i], b = V[(i + 1) % V.length], f = d / per[i]; P.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); } return P; };
  const D = (P) => "M" + P.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";
  const SH = { esagono: spread(poly(6, -Math.PI / 2)), pentagono: spread(poly(5, -Math.PI / 2)), triangolo: spread(poly(3, -Math.PI / 2)) };
  const g = layered(el(parent, { position: "absolute", left: cx, top: cy, width: 1, height: 1, zIndex: z }));
  const SV = svgIn(g, 1, 1);
  const gid = "ms" + ++SVGN;
  SV._defs.insertAdjacentHTML("beforeend", `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4ffd0"/><stop offset=".35" stop-color="#d9fd6a"/><stop offset=".7" stop-color="#CFFB50"/><stop offset="1" stop-color="#9fca2c"/></linearGradient>`);
  const halo = pathEl(SV, D(SH.esagono), { fill: K.lime, opacity: 0.3 });
  halo.style.filter = "blur(26px)";
  const body = pathEl(SV, D(SH.esagono), { fill: `url(#${gid})`, stroke: "#f6ffd8", "stroke-width": 4, "stroke-linejoin": "round" });
  body.style.filter = "drop-shadow(0 20px 30px rgba(0,0,0,.5))";
  // fasce del triangolo finale (per .slice)
  const T = poly(3, -Math.PI / 2), top = T[0][1], bot = T[1][1], H = bot - top;
  const xAt = (y, side) => { const f = (y - top) / H; return side * (T[1][0] * f); };
  let bands = [], labs = [];
  gsap.set(g, { opacity: 0 });
  const shape = { cur: "esagono" };
  return {
    g, rect: [cx - r - 40, cy - r - 40, cx + r + 40, cy + r + 40],
    show: (t) => { tl.fromTo(g, { opacity: 0, scale: 0.7, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out", immediateRender: false }, t); tl.set(g, { filter: "none" }, t + 0.51); },
    spin: (t, dur, deg) => tl.fromTo(SV, { rotation: 0 }, { rotation: deg || 120, duration: dur, ease: "power1.inOut", transformOrigin: "0px 0px", immediateRender: false }, t),
    morph: (t, to, dur) => { [body, halo].forEach((p) => tl.to(p, { attr: { d: D(SH[to]) }, duration: dur || 0.7, ease: "power2.inOut" }, t)); shape.cur = to; },
    // il triangolo si taglia in n fasce staccate (dal vertice alla base) con le etichette a destra
    slice: (t, etichette, oo) => {
      oo = oo || {};
      const n = etichette.length, gp = oo.gap || 18;
      tl.set(SV, { rotation: 0 }, t);
      tl.set([body, halo], { opacity: 0 }, t);
      bands = etichette.map((lb, i) => {
        const y0 = top + (H * i) / n, y1 = top + (H * (i + 1)) / n;
        const P = [[xAt(y0, -1), y0], [xAt(y0, 1), y0], [xAt(y1, 1), y1], [xAt(y1, -1), y1]];
        const p = pathEl(SV, "M" + P.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z", { fill: `url(#${gid})`, stroke: "#f6ffd8", "stroke-width": 4, "stroke-linejoin": "round", opacity: 0 });
        tl.set(p, { attr: { opacity: 1 } }, t);
        tl.to(p, { y: (i - (n - 1) / 2) * gp, duration: 0.25, ease: "power3.out" }, t);
        const l = el(parent, { position: "absolute", left: cx + xAt((y0 + y1) / 2, 1) + 40, top: cy + (y0 + y1) / 2 + (i - (n - 1) / 2) * gp - 26, height: 52, display: "flex", alignItems: "center", padding: "0 20px", borderRadius: 14, background: "linear-gradient(180deg, rgba(56,56,56,.95), rgba(28,28,28,.97))", border: "1.5px solid rgba(255,255,255,.22)", fontFamily: FS, fontWeight: 800, fontSize: 28, color: K.white, whiteSpace: "nowrap", zIndex: z + 2 }, lb);
        gsap.set(l, { opacity: 0 });
        blurIn(l, t + 0.2 + i * 0.12, { x: -20, y: 0, blur: 8, dur: 0.3 });
        return p;
      });
    },
  };
};

// O17 · onda che sale e inghiotte (reel 32 di Kallaway): superficie scura col bordo lime ondulato (mai lime trasparente: il
// corpo è grafite) che scorre di lato; .rise(t, dy, dur) sale; .sink(node, t) l'elemento affonda in 0,8 s e diventa traslucido
// dietro l'onda. x0..x1 = estensione orizzontale · y = livello dell'acqua · o: { amp (18), z (davanti agli elementi) }
const sinkWave = (parent, x0, x1, y, o) => {
  o = o || {};
  const z = o.z || 30, amp = o.amp || 18, W = x1 - x0, depth = o.depth || 900;
  const g = el(parent, { position: "absolute", left: x0, top: y - amp * 2, width: W, height: depth, zIndex: z, overflow: "hidden", pointerEvents: "none" });
  const SV = svgIn(g, W, depth);
  const wv = (ph) => { let d = `M0 ${amp * 2}`; for (let i = 0; i <= 24; i++) { const x = (i / 24) * W * 2; d += ` L${x.toFixed(1)} ${(amp * 2 + Math.sin((i / 24) * Math.PI * 8 + ph) * amp).toFixed(1)}`; } return d; };
  const strip = el(g, { position: "absolute", left: 0, top: 0, width: W * 2, height: depth });
  const SS = svgIn(strip, W * 2, depth);
  const gid = "sw" + ++SVGN;
  SS._defs.insertAdjacentHTML("beforeend", `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3236" stop-opacity=".9"/><stop offset=".3" stop-color="#1b2124" stop-opacity=".94"/><stop offset="1" stop-color="#121618" stop-opacity=".97"/></linearGradient>`);
  const fillD = wv(0) + ` L${W * 2} ${depth} L0 ${depth} Z`;
  pathEl(SS, fillD, { fill: `url(#${gid})` });
  const crest = pathEl(SS, wv(0), { fill: "none", stroke: K.lime, "stroke-width": 5, "stroke-linejoin": "round" });
  crest.style.filter = "drop-shadow(0 0 10px rgba(207,251,80,.8))";
  gsap.set(g, { opacity: 0 });
  return {
    g,
    show: (t, dur) => { tl.fromTo(g, { opacity: 0, y: 120 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, t); tl.fromTo(strip, { x: 0 }, { x: -W, duration: dur || 6, ease: "none", immediateRender: false }, t); },
    rise: (t, dy, dur) => tl.to(g, { y: -dy, duration: dur || 1.2, ease: "power1.inOut" }, t),
    sink: (node, t, dist) => {
      tl.to(node, { y: dist || 300, rotation: (hash(t * 10, 3) > 0 ? 1 : -1) * 6, duration: 0.8, ease: "power2.in" }, t);
      tl.to(node, { opacity: 0.35, filter: "blur(3px) saturate(.4)", duration: 0.6 }, t + 0.25);
    },
  };
};

// O19 · costellazione (reel 60 di Kallaway): linee sottili bianche tra i punti, punti lime luminosi ai vertici, etichette che si
// scrivono; si disegna tratto per tratto (0,2 s l'uno). pts: [[x, y], …] · labels: testo per punto · o: { lato: per ogni punto
// "l" | "r" (default destra), fs (28) }
const constellation = (parent, S, pts, labels, o) => {
  o = o || {};
  const fs = o.fs || 28, z = o.z || 14;
  const segs = [];
  for (let i = 1; i < pts.length; i++) segs.push(connector(S, [pts[i - 1], pts[i]], { color: "rgba(255,255,255,.8)", w: 2.5 }));
  const dots = pts.map(([x, y]) => { const d = el(parent, { position: "absolute", left: x - 12, top: y - 12, width: 24, height: 24, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbffe6, #CFFB50 60%, #a6d332)", boxShadow: `${GLOW_A(0.9)}`, zIndex: z }); gsap.set(d, { opacity: 0, scale: 0.3 }); return d; });
  const labs = pts.map(([x, y], i) => {
    const sd = (o.lato && o.lato[i]) || "r";
    const l = el(parent, { position: "absolute", left: sd === "r" ? x + 26 : x - 26 - 420, top: y - fs * 0.7, width: 420, textAlign: sd === "r" ? "left" : "right", fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap", zIndex: z }, labels[i] || "");
    gsap.set(l, { opacity: 0 });
    return l;
  });
  return {
    dots, labs,
    draw: (t, step) => {
      step = step || 0.2;
      pts.forEach((_, i) => {
        const tt = t + i * step;
        if (i > 0) segs[i - 1].draw(tt - step, step, "none");
        tl.to(dots[i], { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(3)" }, tt);
        blurIn(labs[i], tt + 0.04, { x: 0, y: 8, blur: 8, dur: 0.25 });
      });
      return t + pts.length * step;
    },
  };
};

// C05 · circuito ad angoli retti (reel 49 di Kallaway): linea che va da a a b con un solo gomito a 90° arrotondato (prima in
// orizzontale o prima in verticale), si disegna in 0,3 s; .pulse(t) un punto lime corre lungo il tracciato.
// o: { prima: "h" | "v" (default h), raggio (18), color, w }
const circuit = (S, a, b, o) => {
  o = o || {};
  const R = o.raggio || 18, h = (o.prima || "h") === "h";
  const [x0, y0] = a, [x1, y1] = b, sx = Math.sign(x1 - x0) || 1, sy = Math.sign(y1 - y0) || 1;
  const d = h
    ? `M${x0} ${y0} L${x1 - sx * R} ${y0} Q${x1} ${y0} ${x1} ${y0 + sy * R} L${x1} ${y1}`
    : `M${x0} ${y0} L${x0} ${y1 - sy * R} Q${x0} ${y1} ${x0 + sx * R} ${y1} L${x1} ${y1}`;
  const p = pathEl(S, d, { fill: "none", stroke: o.color || "rgba(255,255,255,.85)", "stroke-width": o.w || 4, "stroke-linecap": "round", "stroke-linejoin": "round" });
  p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.45))";
  const L = p.getTotalLength();
  p.setAttribute("stroke-dasharray", `${L.toFixed(1)} ${L.toFixed(1)}`); p.setAttribute("stroke-dashoffset", L.toFixed(1));
  return {
    p, L,
    draw: (t, dur) => tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: dur || 0.3, ease: "power2.out" }, t),
    pulse: (t, dur, parent) => {
      const q = layered(el(parent || S.parentNode, { position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 0 12px #fff, 0 0 26px rgba(207,251,80,.95)", opacity: 0, zIndex: 40 }));
      const U = { u: 0 }, NP = 120, PT = [];
      for (let i = 0; i <= NP; i++) { const pt = p.getPointAtLength((i / NP) * L); PT.push([pt.x + (S._ox || 0), pt.y + (S._oy || 0)]); }
      const put = () => { const f = U.u * NP, i = Math.min(NP - 1, Math.floor(f)), r = f - i; gsap.set(q, { x: PT[i][0] + (PT[i + 1][0] - PT[i][0]) * r, y: PT[i][1] + (PT[i + 1][1] - PT[i][1]) * r }); };
      tl.set(q, { opacity: 1 }, t);
      tl.fromTo(U, { u: 0 }, { u: 1, duration: dur || 0.6, ease: "power1.inOut", onUpdate: put, immediateRender: false }, t);
      tl.to(q, { opacity: 0, duration: 0.15 }, t + (dur || 0.6));
    },
  };
};

// F09 · mosaico / pixel (reel 132 di Kallaway): un'immagine vera del pool disegnata a blocchi su canvas; .resolve(t, dur) i blocchi
// scendono (36 → 24 → 14 → 8 → nitida) con lo sfarfallio di tinta lime ogni 2 fotogrammi: la "scansione" digitale.
// x, y, w, h nel parent · id dell'immagine nel pool ("av-tu", "th-…") · o: { b0 (36), r (raggio angoli), z }
const pixelate = (parent, x, y, w, h, id, o) => {
  o = o || {};
  const RS = 1.5, z = o.z || 14, b0 = o.b0 || 36;
  const wrap = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: o.r == null ? 24 : o.r, overflow: "hidden", border: "2px solid rgba(255,255,255,.3)", boxShadow: "0 30px 70px rgba(0,0,0,.55)", zIndex: z });
  const cv = el(wrap, { position: "absolute", left: 0, top: 0, width: w, height: h }, null, "canvas");
  cv.width = Math.round(w * RS); cv.height = Math.round(h * RS);
  const ctx = cv.getContext("2d");
  const small = document.createElement("canvas"), sctx = small.getContext("2d");
  const img = document.getElementById(id);
  if (!img) throw new Error("pixelate: immagine non nel pool: " + id);
  const tint = el(wrap, { position: "absolute", inset: 0, background: K.lime, mixBlendMode: "multiply", opacity: 0 });
  // disegna con blocchi di b px (b ≤ 1: nitida); copre l'immagine come object-fit: cover
  const paint = (b) => {
    const iw = img.naturalWidth || w, ih = img.naturalHeight || h, k = Math.max(w / iw, h / ih), sw = w / k, sh = h / k, sx = (iw - sw) / 2, sy = (ih - sh) / 2;
    ctx.imageSmoothingEnabled = true;
    if (b <= 1.5) { ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height); return; }
    const cw = Math.max(1, Math.round(w / b)), ch = Math.max(1, Math.round(h / b));
    small.width = cw; small.height = ch;
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, cw, ch, 0, 0, cv.width, cv.height);
  };
  const B = { b: b0 };
  gsap.set(wrap, { opacity: 0 });
  return {
    wrap, rect: [x, y, x + w, y + h],
    show: (t) => { tl.set(wrap, { opacity: 1 }, t); tl.fromTo(B, { b: b0 }, { b: b0, duration: 0.01, onUpdate: () => paint(B.b), immediateRender: false }, t); },
    // la risoluzione sale a scatti (un livello ogni dur/4) con la tinta che sfarfalla
    resolve: (t, dur) => {
      dur = dur || 1.0;
      const L = [b0, 24, 14, 8, 1];
      L.forEach((b, i) => tl.fromTo(B, { b: L[Math.max(0, i - 1)] }, { b, duration: 0.01, onUpdate: () => paint(B.b), immediateRender: false }, t + (i * dur) / (L.length - 1)));
      for (let k = 0; k < Math.round((dur / (2 / 30)) * 0.6); k++) tl.set(tint, { opacity: k % 2 ? 0 : 0.45 }, t + k * (2 / 30));
      tl.set(tint, { opacity: 0 }, t + dur);
    },
  };
};
