// ═══ KW kit v2 · REEL 11/10 "Non è la fotocamera, è la luce" (sessione 5) ═══════════════════════════════════
// File a parte (variante "una chat per reel"): nessuna funzione esistente del kit cambia; tutti i nomi hanno il suffisso R11.
// Solo definizioni: niente codice eseguito al caricamento (il build inlinea questo file in ogni composizione).
// La scala della luce: stanza con la lampadina (stanzaR11, lampadinaR11), il tuo reel con gli stati di luce (reelLuceR11),
// il telefono che registra (telefonoR11), il mirino con l'ISO e l'autofocus che cerca (mirinoR11), la finestra con i raggi
// (finestraR11), il controluce a tubo LED (ledR11), il cartellino del prezzo (cartellinoR11), il treppiede (treppiedeR11),
// la folla di 100 persone (follaR11) e la scala di 4 gradini con la folla sulle alzate (scalaR11).

let R11N = 0;

// ── stati di luce del tuo reel: filtro sul video + veli (nero, luce dall'alto, luce di lato, grana, vignetta) ──
// f = [brightness, contrast, saturate, sepia] · nero/alto/lato/grana/vign = opacità dei veli
const LUCI_R11 = {
  buio: { f: [0.36, 0.9, 0.42, 0.12], nero: 0.3, alto: 0, lato: 0, grana: 0.16, vign: 0.8 },
  lampadina: { f: [0.6, 1.14, 0.5, 0.5], nero: 0.08, alto: 0.7, lato: 0, grana: 0.38, vign: 0.88 },
  telefono: { f: [0.66, 0.86, 0.66, 0.24], nero: 0.1, alto: 0.32, lato: 0, grana: 0.22, vign: 0.62 },
  finestra: { f: [1.02, 0.98, 0.98, 0.12], nero: 0, alto: 0, lato: 0.85, grana: 0.04, vign: 0.22 },
  faro: { f: [1.08, 1.07, 1.06, 0], nero: 0, alto: 0, lato: 0.3, grana: 0, vign: 0.12 },
  controluce: { f: [1.1, 1.09, 1.08, 0], nero: 0, alto: 0, lato: 0.24, grana: 0, vign: 0.04 },
};
const filtroR11 = (f) => `brightness(${f[0]}) contrast(${f[1]}) saturate(${f[2]}) sepia(${f[3]})`;

// ═══ il tuo reel vero con la luce che cambia sopra di lui ═══════════════════════════════════════════════════
// (x, y, w, h) nel parent · vid = id del pool · o: { stato ("buio"), bare (senza cornice né maniglia: dentro uno schermo),
// z, play: [t0, dur] barra di avanzamento } → { f, vw, dietro, stato(t, nome, dur), sfarfalla(t, seq), grana(t0, t1, passo),
// rim(t) controluce: bordo lime + alone dietro, maniglia(t, a), rect }
const reelLuceR11 = (parent, x, y, w, h, vid, o) => {
  o = o || {};
  const z = o.z || 24, bare = !!o.bare, rad = bare ? 0 : Math.round(w * 0.07), s0 = LUCI_R11[o.stato || "buio"];
  // alone dietro al reel (il controluce lo stacca dallo sfondo): luce bianca calda, mai lime trasparente
  const dietro = bare ? null : el(parent, { position: "absolute", left: x - w * 0.5, top: y - h * 0.24, width: w * 2, height: h * 1.48, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,253,240,.6), rgba(255,253,240,.2) 52%, rgba(255,253,240,0) 100%)", opacity: 0, zIndex: z - 1, pointerEvents: "none" });
  const f = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: rad, overflow: "hidden", background: "#0e0e0e", border: bare ? "none" : "2px solid rgba(255,255,255,.26)", boxShadow: bare ? "none" : "0 40px 90px rgba(0,0,0,.62)", zIndex: z });
  const vw = el(f, { position: "absolute", left: 0, top: 0, width: w, height: h, filter: filtroR11(s0.f) });
  videoTile(vw, 0, 0, w, h, vid, 1);
  const velo = (bg, extra) => el(f, Object.assign({ position: "absolute", left: 0, top: 0, width: w, height: h, background: bg, pointerEvents: "none", zIndex: 2 }, extra || {}));
  const nero = velo("#000", { opacity: s0.nero });
  // lampadina nuda: chiazza gialla in alto, il resto affonda nell'ombra
  const alto = velo("radial-gradient(ellipse 78% 40% at 50% -6%, rgba(255,222,150,.6), rgba(255,222,150,0) 74%), linear-gradient(180deg, rgba(0,0,0,0) 28%, rgba(0,0,0,.66) 100%)", { opacity: s0.alto });
  // luce di lato (finestra, faro): il lato sinistro si scalda e si schiarisce, il destro resta in ombra morbida
  const lato = velo("linear-gradient(90deg, rgba(255,246,222,.5) 0%, rgba(255,246,222,.14) 40%, rgba(255,246,222,0) 62%)", { opacity: s0.lato, mixBlendMode: "screen" });
  const ombra = velo("linear-gradient(90deg, rgba(0,0,0,0) 52%, rgba(0,0,0,.3) 100%)", { opacity: s0.lato });
  // grana (poca luce = ISO alto): rumore vero con feTurbulence, il seme cambia nel tempo
  const gid = "grR11_" + ++R11N;
  const gr = el(f, { position: "absolute", left: 0, top: 0, width: w, height: h, opacity: s0.grana, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 3 },
    `<svg width="${w}" height="${h}" style="display:block"><filter id="${gid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#${gid})"/></svg>`);
  const turb = gr.querySelector("feTurbulence");
  const vign = velo("radial-gradient(ellipse 80% 64% at 50% 40%, rgba(0,0,0,0) 42%, rgba(0,0,0,.9) 100%)", { opacity: s0.vign, zIndex: 3 });
  const flk = velo("#000", { opacity: 0, zIndex: 4 });
  let hd = null, rimEl = null;
  if (!bare) {
    el(f, { position: "absolute", left: 0, bottom: 0, width: w, height: Math.round(h * 0.2), background: "linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.6))", zIndex: 5 });
    const ad = Math.round(w * 0.11);
    hd = el(f, { position: "absolute", left: Math.round(w * 0.06), bottom: Math.round(w * 0.075), display: "flex", alignItems: "center", gap: Math.round(ad * 0.3), zIndex: 6 });
    const avb = el(hd, { position: "relative", width: ad, height: ad, borderRadius: "50%", overflow: "hidden", border: `2px solid ${K.white}`, flex: "none" });
    imgIn(avb, "av-tu", { objectFit: "cover" });
    el(hd, { fontFamily: FS, fontWeight: 700, fontSize: Math.round(w * 0.052), color: K.white, whiteSpace: "nowrap", textShadow: "0 1px 6px rgba(0,0,0,.8)" }, "samuelerinaldo.media");
    rimEl = el(f, { position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: rad, boxShadow: `inset 0 0 0 5px ${K.lime}, inset 0 0 34px rgba(255,255,255,.55)`, opacity: 0, zIndex: 7, pointerEvents: "none" });
    if (o.play) {
      const bar = el(f, { position: "absolute", left: 0, bottom: 0, width: w, height: 5, background: "rgba(255,255,255,.35)", zIndex: 8 });
      const prog = el(bar, { position: "absolute", left: 0, top: 0, width: w, height: 5, background: K.white, transformOrigin: "0 50%" });
      gsap.set(prog, { scaleX: 0 });
      tl.fromTo(prog, { scaleX: 0 }, { scaleX: 1, duration: o.play[1], ease: "none", immediateRender: false }, o.play[0]);
    }
  }
  const stato = (t, nome, dur) => {
    const s = LUCI_R11[nome];
    dur = dur == null ? 0.35 : dur;
    tl.to(vw, { filter: filtroR11(s.f), duration: dur, ease: "power2.out" }, t);
    tl.to(nero, { opacity: s.nero, duration: dur }, t);
    tl.to(alto, { opacity: s.alto, duration: dur }, t);
    tl.to([lato, ombra], { opacity: s.lato, duration: dur }, t);
    tl.to(gr, { opacity: s.grana, duration: dur }, t);
    tl.to(vign, { opacity: s.vign, duration: dur }, t);
  };
  return {
    f, vw, dietro, hd, rect: [x, y, x + w, y + h],
    stato,
    // la luce cala per qualche fotogramma (lampadina che sfarfalla): seq = [[dt, opacità del velo nero], …]
    sfarfalla: (t, seq) => (seq || [[0, 0.62], [0.07, 0.12], [0.13, 0.5], [0.2, 0]]).forEach(([dt, a]) => tl.to(flk, { opacity: a, duration: 0.03 }, t + dt)),
    grana: (t0, t1, passo) => { for (let k = 0, t = t0; t < t1; k++, t += passo || 0.08) tl.set(turb, { attr: { seed: 3 + (k % 11) } }, t); },
    rim: (t) => {
      if (!rimEl) return;
      tl.to(rimEl, { opacity: 1, duration: 0.18 }, t);
      tl.to(f, { borderColor: K.lime, boxShadow: `${GLOW_A(1.15)}, 0 40px 90px rgba(0,0,0,.62)`, duration: 0.25 }, t);
      if (dietro) tl.fromTo(dietro, { opacity: 0, scale: 0.78 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, t);
    },
    rimOff: (t) => {
      if (!rimEl) return;
      tl.to(rimEl, { opacity: 0, duration: 0.25 }, t);
      tl.to(f, { borderColor: "rgba(255,255,255,.26)", boxShadow: "0 40px 90px rgba(0,0,0,.62)", duration: 0.25 }, t);
      if (dietro) tl.to(dietro, { opacity: 0, duration: 0.3 }, t);
    },
    maniglia: (t, a) => hd && tl.to(hd, { opacity: a, duration: 0.2 }, t),
  };
};

// ═══ stanza (cutaway): pareti, pavimento e soffitto in prospettiva ══════════════════════════════════════════════
// rettangolo davanti (x0, y0, w, h); la parete di fondo è rientrata di ix, iy. Listelli verticali sul fondo (come lo studio),
// assi del pavimento in prospettiva. .show(t, dur) gli spigoli si disegnano e le facce si riempiono · .back · .rect · .g
const stanzaR11 = (parent, x0, y0, w, h, o) => {
  o = o || {};
  const ix = o.ix || Math.round(w * 0.14), iy = o.iy || Math.round(h * 0.12), z = o.z || 8;
  const g = layered(el(parent, { position: "absolute", left: x0, top: y0, width: w, height: h, zIndex: z }));
  const SV = svgIn(g, w, h);
  const gid = "stR11_" + ++R11N;
  SV._defs.insertAdjacentHTML("beforeend",
    `<linearGradient id="${gid}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151515"/><stop offset="1" stop-color="#202020"/></linearGradient>` +
    `<linearGradient id="${gid}l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2a2a"/><stop offset="1" stop-color="#1d1d1d"/></linearGradient>` +
    `<linearGradient id="${gid}r" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#2a2a2a"/><stop offset="1" stop-color="#1d1d1d"/></linearGradient>` +
    `<linearGradient id="${gid}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#262626"/><stop offset="1" stop-color="#3a3a3a"/></linearGradient>` +
    `<linearGradient id="${gid}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a1a"/><stop offset="1" stop-color="#232323"/></linearGradient>`);
  const A = [0, 0], B = [w, 0], C = [w, h], D = [0, h], a = [ix, iy], b = [w - ix, iy], c = [w - ix, h - iy], d = [ix, h - iy];
  const P = (pts) => "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";
  const facce = [
    pathEl(SV, P([A, B, b, a]), { fill: `url(#${gid}c)` }),
    pathEl(SV, P([A, a, d, D]), { fill: `url(#${gid}l)` }),
    pathEl(SV, P([B, C, c, b]), { fill: `url(#${gid}r)` }),
    pathEl(SV, P([D, d, c, C]), { fill: `url(#${gid}f)` }),
    pathEl(SV, P([a, b, c, d]), { fill: `url(#${gid}b)` }),
  ];
  const det = [];
  // listelli verticali sulla parete di fondo e assi del pavimento che convergono
  for (let k = 1; k < 14; k++) { const xx = ix + ((w - 2 * ix) * k) / 14; det.push(pathEl(SV, `M${xx} ${iy + 6} L${xx} ${h - iy - 6}`, { stroke: "rgba(255,255,255,.085)", "stroke-width": 3 })); }
  for (let k = 1; k < 9; k++) { const u = k / 9; det.push(pathEl(SV, `M${ix + (w - 2 * ix) * u} ${h - iy} L${w * u} ${h}`, { stroke: "rgba(255,255,255,.1)", "stroke-width": 2.5 })); }
  const spigoli = [[a, b], [b, c], [c, d], [d, a], [A, a], [B, b], [C, c], [D, d]].map(([p, q]) => {
    const s = pathEl(SV, `M${p[0]} ${p[1]} L${q[0]} ${q[1]}`, { stroke: "rgba(255,255,255,.42)", "stroke-width": 3.5, "stroke-linecap": "round", fill: "none" });
    drawable(s);
    return s;
  });
  gsap.set([...facce, ...det], { opacity: 0 });
  return {
    g, SV, facce, spigoli, rect: [x0, y0, x0 + w, y0 + h], back: [x0 + ix, y0 + iy, x0 + w - ix, y0 + h - iy],
    show: (t, dur) => {
      dur = dur || 0.45;
      spigoli.forEach((s, k) => drawOn(s, t + (k % 4) * 0.04, dur, "power2.out"));
      tl.to([...facce, ...det], { opacity: 1, duration: dur, ease: "power1.out" }, t + 0.12);
    },
  };
};

// ═══ lampadina nuda appesa al soffitto ═══════════════════════════════════════════════════════════════════════
// filo da (cx, yTop) lungo len, portalampada, vetro a pera col filamento. Accesa = luce gialla spenta, cono duro verso il
// basso (o.cono = [larghezza in fondo, altezza]). .on(t) sfarfalla e si accende (F05) · .sfarfalla(t) · .off(t) · .dondola(t, dur)
const lampadinaR11 = (parent, cx, yTop, len, o) => {
  o = o || {};
  const bw = o.w || 64, bh = Math.round(bw * 1.42), z = o.z || 30, [cw, ch] = o.cono || [760, 900];
  const g = layered(el(parent, { position: "absolute", left: cx - bw, top: yTop, width: bw * 2, height: len + bh + 10, zIndex: z }));
  el(g, { position: "absolute", left: bw - 2, top: 0, width: 4, height: len + 4, background: "linear-gradient(90deg,#0c0c0c,#3c3c3c,#0c0c0c)" });
  el(g, { position: "absolute", left: bw - bw * 0.27, top: len, width: bw * 0.54, height: bw * 0.46, borderRadius: "7px 7px 3px 3px", background: "linear-gradient(90deg,#141414,#4c4c4c 46%,#181818)" });
  const gy = len + bw * 0.4;
  const pera = `M${bw * 0.72} ${gy} C${bw * 0.72} ${gy + bh * 0.22}, ${bw * 0.18} ${gy + bh * 0.4}, ${bw * 0.18} ${gy + bh * 0.66} C${bw * 0.18} ${gy + bh * 0.92}, ${bw * 0.6} ${gy + bh}, ${bw} ${gy + bh} C${bw * 1.4} ${gy + bh}, ${bw * 1.82} ${gy + bh * 0.92}, ${bw * 1.82} ${gy + bh * 0.66} C${bw * 1.82} ${gy + bh * 0.4}, ${bw * 1.28} ${gy + bh * 0.22}, ${bw * 1.28} ${gy} Z`;
  const SV = svgIn(g, bw * 2, len + bh + 10);
  const gid = "lpR11_" + ++R11N;
  SV._defs.insertAdjacentHTML("beforeend", `<radialGradient id="${gid}o" cx="0.42" cy="0.62" r="0.6"><stop offset="0" stop-color="#5c5c5c" stop-opacity=".55"/><stop offset="1" stop-color="#1f1f1f" stop-opacity=".85"/></radialGradient><radialGradient id="${gid}a" cx="0.5" cy="0.62" r="0.6"><stop offset="0" stop-color="#fffbe9"/><stop offset="0.45" stop-color="#ffe7a6"/><stop offset="1" stop-color="#d9a748"/></radialGradient>`);
  pathEl(SV, pera, { fill: `url(#${gid}o)`, stroke: "rgba(255,255,255,.35)", "stroke-width": 2 });
  const lit = pathEl(SV, pera, { fill: `url(#${gid}a)`, opacity: 0 });
  pathEl(SV, `M${bw * 0.8} ${gy + bh * 0.2} L${bw * 0.86} ${gy + bh * 0.55} L${bw} ${gy + bh * 0.48} L${bw * 1.14} ${gy + bh * 0.55} L${bw * 1.2} ${gy + bh * 0.2}`, { fill: "none", stroke: "rgba(120,100,60,.9)", "stroke-width": 2.5 });
  const cyB = yTop + gy + bh * 0.6;
  // alone e cono di luce (nel parent: restano dritti anche se la lampadina dondola)
  const alone = el(parent, { position: "absolute", left: cx - bw * 3.2, top: cyB - bw * 3.2, width: bw * 6.4, height: bw * 6.4, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,196,.75) 0%, rgba(255,214,130,.28) 34%, rgba(255,214,130,0) 70%)", opacity: 0, zIndex: z - 1, mixBlendMode: "screen", pointerEvents: "none" });
  const cono = el(parent, { position: "absolute", left: cx - cw / 2, top: cyB, width: cw, height: ch, clipPath: `polygon(${(cw / 2 - bw * 0.9).toFixed(1)}px 0px, ${(cw / 2 + bw * 0.9).toFixed(1)}px 0px, ${cw}px ${ch}px, 0px ${ch}px)`, background: "linear-gradient(180deg, rgba(255,226,160,.34) 0%, rgba(255,226,160,.12) 55%, rgba(255,226,160,0) 100%)", filter: "blur(6px)", opacity: 0, zIndex: z - 2, mixBlendMode: "screen", pointerEvents: "none" });
  // chiazza di luce sul pavimento (o.pozza = [cx, cy, w, h])
  const pozza = o.pozza ? el(parent, { position: "absolute", left: o.pozza[0] - o.pozza[2] / 2, top: o.pozza[1] - o.pozza[3] / 2, width: o.pozza[2], height: o.pozza[3], borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,226,160,.42), rgba(255,226,160,.12) 60%, rgba(255,226,160,0) 100%)", opacity: 0, zIndex: z - 3, mixBlendMode: "screen", pointerEvents: "none" }) : null;
  const luci = pozza ? [lit, alone, cono, pozza] : [lit, alone, cono];
  return {
    g, luci, xy: [cx, cyB],
    on: (t) => [[0, 1], [0.05, 0.15], [0.11, 0.9], [0.17, 0.25], [0.24, 1]].forEach(([dt, a]) => tl.to(luci, { opacity: a, duration: 0.03 }, t + dt)),
    sfarfalla: (t) => [[0, 0.2], [0.06, 1], [0.12, 0.35], [0.18, 1]].forEach(([dt, a]) => tl.to(luci, { opacity: a, duration: 0.03 }, t + dt)),
    off: (t) => tl.to(luci, { opacity: 0, duration: 0.2 }, t),
    dondola: (t, dur) => {
      gsap.set(g, { transformOrigin: `${bw}px 0px` });
      const k = Math.max(1, Math.round(dur / 0.9));
      for (let i = 0; i < k; i++) tl.to(g, { rotation: i % 2 ? -2.2 : 2.2, duration: dur / k, ease: "sine.inOut" }, t + (i * dur) / k);
    },
  };
};

// ═══ treppiede: colonna e tre gambe in metallo scuro, da yTop (attacco) a yFloor (pavimento) ═════════════════════
const treppiedeR11 = (parent, cx, yTop, yFloor, o) => {
  o = o || {};
  const H = yFloor - yTop, sp = o.spread || Math.round(H * 0.5), z = o.z == null ? 11 : o.z, col = o.col || 14;
  const W = 2 * sp + 40, mx = sp + 20, hub = Math.round(H * (o.hub || 0.4));
  const g = layered(el(parent, { position: "absolute", left: cx - mx, top: yTop, width: W, height: H + 10, zIndex: z }));
  const SV = svgIn(g, W, H + 10);
  const metallo = (d, wd) => {
    pathEl(SV, d, { fill: "none", stroke: "#111", "stroke-width": wd + 3, "stroke-linecap": "round" });
    pathEl(SV, d, { fill: "none", stroke: "#474747", "stroke-width": wd, "stroke-linecap": "round" });
    pathEl(SV, d, { fill: "none", stroke: "rgba(255,255,255,.3)", "stroke-width": Math.max(1.5, wd * 0.24), "stroke-linecap": "round" });
  };
  [[mx + sp * 0.2, H - 16]].forEach(([fx, fy]) => metallo(`M${mx} ${hub} L${fx} ${fy}`, col * 0.55));
  metallo(`M${mx} 0 L${mx} ${hub + 6}`, col);
  [[mx - sp, H], [mx + sp, H]].forEach(([fx, fy]) => metallo(`M${mx} ${hub} L${fx} ${fy}`, col * 0.62));
  el(g, { position: "absolute", left: mx - col * 1.1, top: hub - col * 0.6, width: col * 2.2, height: col * 1.4, borderRadius: 5, background: "linear-gradient(90deg,#1c1c1c,#555 50%,#1c1c1c)" });
  return g;
};

// ═══ cartellino del prezzo appeso a un filo (oscilla e si assesta) ═══════════════════════════════════════════════
// (x, y) = punto a cui è appeso · o: { w, h, fs, filo, z } → { g, num, show(t), count(t, da, a, dur, fmt), lime(t) }
const cartellinoR11 = (parent, x, y, testo, o) => {
  o = o || {};
  const w = o.w || 220, h = o.h || 112, fs = o.fs || 46, filo = o.filo == null ? 60 : o.filo, z = o.z || 42;
  const g = layered(el(parent, { position: "absolute", left: x - w / 2, top: y, width: w, height: filo + h + 10, zIndex: z }));
  if (filo > 0) el(g, { position: "absolute", left: w / 2 - 1.5, top: 0, width: 3, height: filo + 20, borderRadius: 2, background: "linear-gradient(180deg,#e2e2da,#9c9c94)" });
  const forma = "polygon(50% 0, 100% 24%, 100% 100%, 0 100%, 0 24%)";
  const ombra = el(g, { position: "absolute", left: 0, top: filo, width: w, height: h, filter: "drop-shadow(0 16px 20px rgba(0,0,0,.55))" });
  const carta = el(ombra, { position: "absolute", left: 0, top: 0, width: w, height: h, clipPath: forma, background: "linear-gradient(180deg,#fefefb 0%,#eaeae2 100%)" });
  const verde = el(ombra, { position: "absolute", left: 0, top: 0, width: w, height: h, clipPath: forma, background: limeFill(1), opacity: 0 });
  el(ombra, { position: "absolute", left: w / 2 - 9, top: h * 0.14, width: 18, height: 18, borderRadius: "50%", background: "#1e1e1e", boxShadow: "inset 0 2px 3px rgba(0,0,0,.6)", zIndex: 3 });
  const num = el(ombra, { position: "absolute", left: 0, top: h * 0.3, width: w, height: h * 0.66, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: fs, color: K.ink, whiteSpace: "nowrap", zIndex: 4 }, testo);
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  gsap.set(g, { opacity: 0, transformOrigin: `${w / 2}px 0px` });
  return {
    g, num,
    show: (t) => {
      tl.fromTo(g, { opacity: 0, rotation: -38, y: -24 }, { opacity: 1, rotation: 15, y: 0, duration: 0.26, ease: "power2.out", immediateRender: false }, t);
      [[-8, 0.3], [4, 0.3], [0, 0.36]].reduce((tt, [r, d]) => (tl.to(g, { rotation: r, duration: d, ease: "sine.inOut" }, tt), tt + d), t + 0.26);
    },
    count: (t, a, b, dur, fmt) => {
      const V = { v: a };
      tl.fromTo(V, { v: a }, { v: b, duration: dur, ease: "power1.out", immediateRender: false, onUpdate: () => (num.textContent = fmt ? fmt(V.v) : itNum(V.v) + " €") }, t);
    },
    lime: (t) => {
      tl.to(verde, { opacity: 1, duration: 0.12 }, t);
      tl.fromTo(ombra, { scale: 1.2 }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, t);
      tl.to(ombra, { filter: "drop-shadow(0 0 16px rgba(207,251,80,.85))", duration: 0.2 }, t);
    },
  };
};

// ═══ telefono che registra, sul suo supporto: dentro lo schermo il tuo reel vero con la luce del momento ═════════════
// (cx, bottom) = centro e appoggio · vid = id del pool · o: { k (scala, 0.72), stand (altezza del supporto), stato, z }
// → { g, ph, R (reelLuceR11 nello schermo), rec(t, dur) timer e tasto che registra, rect }
const telefonoR11 = (parent, cx, bottom, vid, o) => {
  o = o || {};
  const k = o.k || 0.72, z = o.z || 26, st = o.stand == null ? 150 : o.stand, W = PH.w * k, H = PH.h * k;
  const g = layered(el(parent, { position: "absolute", left: cx - W / 2, top: bottom - st - H, width: W, height: H + st, zIndex: z }));
  treppiedeR11(g, W / 2, H - 30, H + st, { spread: Math.round(st * 0.55), col: 12, z: 0, hub: 0.45 });
  el(g, { position: "absolute", left: W / 2 - 48, top: H - 46, width: 96, height: 36, borderRadius: 8, background: "linear-gradient(180deg,#3a3a3a,#141414)", zIndex: 1 });
  const ph = el(g, { position: "absolute", left: 0, top: 0, width: PH.w, height: PH.h, zIndex: 2 });
  gsap.set(ph, { scale: k, transformOrigin: "0px 0px" });
  const P = phone2(ph, 0, 0, { z: 2 });
  const R = reelLuceR11(P.screen, 0, 0, PH.sw, PH.sh, vid, { bare: true, stato: o.stato || "telefono", z: 1 });
  // app della fotocamera: timer in alto, "VIDEO" e il tasto di registrazione in basso
  const timer = el(P.screen, { position: "absolute", left: PH.sw / 2 - 88, top: 66, width: 176, height: 54, borderRadius: 12, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: FS, fontWeight: 700, fontSize: 32, color: K.white, zIndex: 20 });
  const rdot = el(timer, { width: 16, height: 16, borderRadius: "50%", background: "#ff3b30", opacity: 0.35 }, null, "span");
  const tt = el(timer, {}, "00:00", "span");
  el(P.screen, { position: "absolute", left: 0, top: PH.sh - 300, width: PH.sw, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: K.white, textShadow: "0 2px 8px rgba(0,0,0,.8)", zIndex: 20 }, "VIDEO");
  const ring = el(P.screen, { position: "absolute", left: PH.sw / 2 - 66, top: PH.sh - 236, width: 132, height: 132, borderRadius: "50%", border: "8px solid #fff", zIndex: 20 });
  const tondo = el(ring, { position: "absolute", left: 9, top: 9, width: 98, height: 98, borderRadius: "50%", background: "#ff3b30" });
  const quadro = el(ring, { position: "absolute", left: 32, top: 32, width: 52, height: 52, borderRadius: 12, background: "#ff3b30", opacity: 0 });
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", "")); // vola sopra i gradini
  return {
    g, ph, P, R, W, H, rect: [cx - W / 2, bottom - st - H, cx + W / 2, bottom],
    rec: (t, dur) => {
      tl.to(tondo, { opacity: 0, scale: 0.5, duration: 0.18 }, t);
      tl.fromTo(quadro, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2)", immediateRender: false }, t);
      tl.to(rdot, { opacity: 1, duration: 0.1 }, t);
      const V = { s: 0 };
      tl.fromTo(V, { s: 0 }, { s: dur, duration: dur, ease: "none", immediateRender: false, onUpdate: () => (tt.textContent = "00:" + String(Math.floor(V.s)).padStart(2, "0")) }, t);
      for (let q = 0.5; q < dur; q += 0.5) tl.set(rdot, { opacity: Math.round(q * 2) % 2 ? 0.25 : 1 }, t + q);
    },
  };
};

// ═══ telefono spento sul suo supporto (l'attrezzatura di un gradino quando non ci sei: niente testo, schermo nero) ═══════════
const fantasmaTelR11 = (parent, cx, bottom, o) => {
  o = o || {};
  const k = o.k || 0.72, z = o.z || 25, st = o.stand == null ? 150 : o.stand, W = PH.w * k, H = PH.h * k;
  const g = layered(el(parent, { position: "absolute", left: cx - W / 2, top: bottom - st - H, width: W, height: H + st, zIndex: z }));
  treppiedeR11(g, W / 2, H - 30, H + st, { spread: Math.round(st * 0.55), col: 12, z: 0, hub: 0.45 });
  el(g, { position: "absolute", left: W / 2 - 48, top: H - 46, width: 96, height: 36, borderRadius: 8, background: "linear-gradient(180deg,#3a3a3a,#141414)", zIndex: 1 });
  const fr = el(g, { position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: PH.r * k, background: "linear-gradient(150deg,#3e3e3e 0%,#171717 36%,#0d0d0d 70%,#2d2d2d 100%)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.14)", zIndex: 2 });
  const sc = el(fr, { position: "absolute", left: PH.bz * k, top: PH.bz * k, width: PH.sw * k, height: PH.sh * k, borderRadius: PH.sr * k, background: "linear-gradient(160deg,#1c1c1c 0%,#050505 60%,#111 100%)", overflow: "hidden" });
  el(sc, { position: "absolute", left: -W * 0.3, top: -H * 0.1, width: W * 0.35, height: H * 1.3, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.1), rgba(255,255,255,0))", transform: "rotate(18deg)" });
  el(sc, { position: "absolute", left: (PH.sw * k) / 2 - 44, top: 10, width: 88, height: 26, borderRadius: 13, background: "#000" });
  return { g };
};

// ═══ mirino della fotocamera (U14) con l'ISO che sale e l'autofocus che cerca senza agganciare ═══════════════════════
// r = [x0, y0, x1, y1] (il riquadro inquadrato, di solito il tuo reel) · o: { z, nero (fasce nere attorno: si guarda dentro) }
// → { box, nero, show(t), rec(t, dur), iso(t, da, a, dur), cerca(t, dur, punti), hide(t) }
const mirinoR11 = (parent, r, o) => {
  o = o || {};
  const z = o.z || 62, [x0, y0, x1, y1] = r, W = x1 - x0, H = y1 - y0, len = Math.round(Math.min(W, H) * 0.12), sw = Math.max(4, Math.round(W * 0.014));
  const nero = o.nero ? [[x0 - 5000, y0 - 5000, W + 10000, 5000], [x0 - 5000, y1, W + 10000, 5000], [x0 - 5000, y0, 5000, H], [x1, y0, 5000, H]].map(([a, b, c, d]) => el(parent, { position: "absolute", left: a, top: b, width: c, height: d, background: "#060606", opacity: 0, zIndex: z - 1 })) : [];
  const box = el(parent, { position: "absolute", left: x0, top: y0, width: W, height: H, zIndex: z, pointerEvents: "none" });
  box.setAttribute("data-layout-allow-occlusion", "");
  const m = Math.round(W * 0.06);
  const RAD = ["8px 0 0 0", "0 8px 0 0", "0 0 0 8px", "0 0 8px 0"];
  const cs = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([sx, sy], k) => el(box, { position: "absolute", left: sx ? W - m - len : m, top: sy ? H - m - len : m, width: len, height: len, boxSizing: "border-box", borderTop: sy ? "none" : `${sw}px solid #fff`, borderBottom: sy ? `${sw}px solid #fff` : "none", borderLeft: sx ? "none" : `${sw}px solid #fff`, borderRight: sx ? `${sw}px solid #fff` : "none", borderRadius: RAD[k], filter: "drop-shadow(0 0 4px rgba(0,0,0,.6))" }));
  const fs = Math.round(W * 0.05), ts = "0 2px 6px rgba(0,0,0,.85)";
  const recRow = el(box, { position: "absolute", left: m + 6, top: m + len + 10, display: "flex", alignItems: "center", gap: 8, fontFamily: FS, fontWeight: 800, fontSize: fs, color: "#fff", textShadow: ts, whiteSpace: "nowrap" });
  const dot = el(recRow, { width: fs * 0.66, height: fs * 0.66, borderRadius: "50%", background: "#ff3b30", boxShadow: "0 0 10px rgba(255,59,48,.8)" }, null, "span");
  el(recRow, {}, "REC", "span");
  const tc = el(box, { position: "absolute", left: 0, top: m + 4, width: W, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: fs, letterSpacing: "0.05em", color: "#fff", textShadow: ts }, "00:00:00");
  el(box, { position: "absolute", right: m + 6, top: m + len + 10, display: "flex", alignItems: "center", gap: 8, fontFamily: FS, fontWeight: 800, fontSize: fs * 0.86, color: "#fff", textShadow: ts, whiteSpace: "nowrap" }, `4K · 30 <span style="display:inline-block;width:${fs * 1.5}px;height:${fs * 0.76}px;border:2px solid #fff;border-radius:4px;position:relative"><span style="position:absolute;left:2px;top:2px;bottom:2px;width:70%;background:${K.lime};border-radius:2px"></span></span>`);
  const basso = el(box, { position: "absolute", left: m + 4, bottom: m + 4, width: W - 2 * m - 8, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FS, fontWeight: 800, fontSize: fs * 0.9, color: "#fff", textShadow: ts, whiteSpace: "nowrap" });
  el(basso, {}, "1/50", "span");
  el(basso, {}, "f/1.4", "span");
  const isoBox = el(basso, { display: "flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 8 }, null, "span");
  el(isoBox, {}, "ISO", "span");
  const isoN = el(isoBox, {}, "400", "span");
  // quadrato dell'autofocus: bianco che cerca, rosso quando non aggancia
  const AF = Math.round(W * 0.3);
  const af = el(box, { position: "absolute", left: W / 2 - AF / 2, top: H * 0.3 - AF / 2, width: AF, height: AF, border: "4px solid #fff", borderRadius: 10, boxShadow: "0 0 8px rgba(0,0,0,.6)", opacity: 0 });
  const afT = el(af, { position: "absolute", left: 0, top: -fs * 1.3, width: AF, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: fs * 0.8, color: "#fff", textShadow: ts, whiteSpace: "nowrap" }, "AF");
  [box, ...box.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  gsap.set(box, { opacity: 0 });
  return {
    box, nero,
    show: (t) => {
      if (nero.length) tl.to(nero, { opacity: 1, duration: 0.15 }, t);
      tl.to(box, { opacity: 1, duration: 0.2 }, t);
      cs.forEach((c, i) => tl.fromTo(c, { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t + i * 0.03));
    },
    hide: (t) => { tl.to(box, { opacity: 0, duration: 0.2 }, t); if (nero.length) tl.to(nero, { opacity: 0, duration: 0.3 }, t); },
    rec: (t, dur) => {
      const n = Math.round(dur / 0.5);
      for (let k = 0; k <= n; k++) tl.set(dot, { opacity: k % 2 ? 0.2 : 1 }, t + k * 0.5);
      const V = { s: 0 };
      tl.fromTo(V, { s: 0 }, { s: dur, duration: dur, ease: "none", immediateRender: false, onUpdate: () => { const s = Math.floor(V.s), f = Math.floor((V.s - s) * 30); tc.textContent = `00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`; } }, t);
    },
    // ISO che sale a scatti (poca luce): oltre 3200 diventa rosso e lampeggia
    iso: (t, da, a, dur) => {
      const scala = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600].filter((v) => v >= da && v <= a);
      const V = { i: 0 };
      tl.fromTo(V, { i: 0 }, { i: scala.length - 1, duration: dur, ease: "none", immediateRender: false, onUpdate: () => {
        const v = scala[Math.round(V.i)];
        isoN.textContent = itNum(v);
        isoBox.style.backgroundColor = v >= 3200 ? "#d42a20" : "rgba(0,0,0,0)";
      } }, t);
      for (let k = 0; k < 8; k++) tl.set(isoBox, { backgroundColor: k % 2 ? "#7d1913" : "#d42a20" }, t + dur + 0.15 + k * 0.25);
    },
    // con la luce giusta l'autofocus aggancia subito: il quadrato si stringe sul viso (u, v) e diventa lime
    aggancia: (t, u, v) => {
      gsap.set(af, { x: (u - 0.5) * W, y: (v - 0.3) * H });
      tl.fromTo(af, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: 0.24, ease: "power3.out", immediateRender: false }, t);
      tl.set(af, { borderColor: K.lime, boxShadow: GLOW_A(0.8) }, t + 0.24);
      tl.set(afT, { color: K.lime }, t + 0.24);
      tl.fromTo(af, { scale: 1 }, { scale: 1.08, duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, t + 0.26);
    },
    // l'autofocus cerca: il quadrato salta tra i punti (frazioni del riquadro) e non aggancia mai
    cerca: (t, dur, punti) => {
      punti = punti || [[0.5, 0.36], [0.36, 0.48], [0.62, 0.34], [0.5, 0.58], [0.42, 0.32], [0.6, 0.46]];
      tl.to(af, { opacity: 1, duration: 0.1 }, t);
      const step = dur / punti.length;
      punti.forEach(([u, v], i) => {
        const tt = t + i * step;
        tl.to(af, { x: (u - 0.5) * W, y: (v - 0.3) * H, scale: 1.18, duration: step * 0.45, ease: "power2.out" }, tt);
        tl.to(af, { scale: 1, duration: step * 0.35, ease: "power2.in" }, tt + step * 0.45);
        tl.set(af, { borderColor: i % 2 ? "#ff3b30" : "#ffffff" }, tt + step * 0.5);
        tl.set(afT, { color: i % 2 ? "#ff5a50" : "#ffffff" }, tt + step * 0.5);
      });
    },
  };
};

// ═══ finestra vera con la luce del giorno e i fasci di sole che entrano ═══════════════════════════════════════════
// (x, y, w, h) nel parent · o: { verso: [tx, ty] (dove cadono i raggi), z } → { g, giorno(t), sole(t), live(t0, t1), spegni(t) }
const finestraR11 = (parent, x, y, w, h, o) => {
  o = o || {};
  const z = o.z || 18, fr = Math.round(w * 0.075), mul = Math.max(9, Math.round(w * 0.036));
  const g = layered(el(parent, { position: "absolute", left: x, top: y, width: w, height: h, zIndex: z }));
  el(g, { position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 8, background: "linear-gradient(140deg,#f3f3ef 0%,#d4d4ce 55%,#b4b4ad 100%)", boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.85)" });
  const vetro = (bg, op) => el(g, { position: "absolute", left: fr, top: fr, width: w - 2 * fr, height: h - 2 * fr, background: bg, opacity: op });
  vetro("linear-gradient(170deg,#2c3134 0%,#191c1f 100%)", 1);
  const giornoV = vetro("linear-gradient(168deg,#ffffff 0%,#fbf7ec 32%,#e9ebe8 72%,#d6dbdc 100%)", 0);
  const rifl = el(g, { position: "absolute", left: fr, top: fr, width: w - 2 * fr, height: h - 2 * fr, overflow: "hidden" });
  [[0.12, 0.5], [0.52, 0.22]].forEach(([u, a]) => el(rifl, { position: "absolute", left: (w - 2 * fr) * u, top: -h * 0.2, width: w * 0.16, height: h * 1.4, background: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,${a}), rgba(255,255,255,0))`, transform: "rotate(18deg)" }));
  const tel = "linear-gradient(90deg,#c9c9c2,#efefea 50%,#c9c9c2)";
  el(g, { position: "absolute", left: w / 2 - mul / 2, top: fr, width: mul, height: h - 2 * fr, background: tel });
  el(g, { position: "absolute", left: fr, top: h * 0.46 - mul / 2, width: w - 2 * fr, height: mul, background: "linear-gradient(180deg,#c9c9c2,#efefea 50%,#c9c9c2)" });
  el(g, { position: "absolute", left: -16, top: h - 12, width: w + 32, height: 24, borderRadius: 5, background: "linear-gradient(180deg,#f4f4f0,#bdbdb6)", boxShadow: "0 14px 24px rgba(0,0,0,.5)" });
  // fasci di sole: dal vetro verso il bersaglio, bianco caldo in screen (mai lime trasparente)
  const [tx, ty] = o.verso || [x + w * 2.2, y + h * 1.2];
  const sx = x + w * 0.7, sy = y + h * 0.42, dx = tx - sx, dy = ty - sy, L = Math.hypot(dx, dy) * 1.25, ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const s0 = h * 0.8, s1 = s0 * 1.9;
  const fascio = el(parent, { position: "absolute", left: sx, top: sy - s1 / 2, width: L, height: s1, transformOrigin: `0px ${s1 / 2}px`, transform: `rotate(${ang.toFixed(2)}deg)`, opacity: 0, mixBlendMode: "screen", pointerEvents: "none", zIndex: z + 6 });
  [[1, 0.46, 18], [0.5, 0.56, 8]].forEach(([k, a0, blur]) => {
    const e0 = (s0 * k) / 2, e1 = (s1 * k) / 2, mm = s1 / 2;
    const wr = el(fascio, { position: "absolute", left: 0, top: 0, width: L, height: s1, filter: `blur(${blur}px)` });
    el(wr, { position: "absolute", left: 0, top: 0, width: L, height: s1, clipPath: `polygon(0px ${mm - e0}px, ${L}px ${mm - e1}px, ${L}px ${mm + e1}px, 0px ${mm + e0}px)`, background: `linear-gradient(90deg, rgba(255,250,232,${a0}) 0%, rgba(255,250,232,${(a0 * 0.45).toFixed(3)}) 55%, rgba(255,250,232,0) 100%)` });
  });
  // pulviscolo nel fascio
  const polv = [];
  for (let q = 0; q < 16; q++) {
    const u = 0.15 + 0.75 * ((hash(q, 3) + 1) / 2), v = hash(q, 7) * 0.32;
    const px = u * L, py = s1 / 2 + v * (s0 + (s1 - s0) * u);
    polv.push(el(fascio, { position: "absolute", left: px, top: py, width: 4 + 3 * ((hash(q, 5) + 1) / 2), height: 4 + 3 * ((hash(q, 5) + 1) / 2), borderRadius: "50%", background: "rgba(255,252,240,.95)", boxShadow: "0 0 6px rgba(255,252,240,.8)" }));
  }
  gsap.set(g, { opacity: 0 });
  return {
    g, fascio,
    show: (t) => tl.fromTo(g, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t),
    giorno: (t) => { tl.fromTo(g, { scale: 1 }, { scale: 1.04, duration: 0.12, ease: "power2.out", immediateRender: false }, t); tl.to(g, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, t + 0.12); tl.to(giornoV, { opacity: 1, duration: 0.45, ease: "power2.out" }, t); },
    sole: (t) => tl.fromTo(fascio, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, t),
    live: (t0, t1) => polv.forEach((p, q) => tl.fromTo(p, { x: 0, y: 0 }, { x: 40 + 30 * hash(q, 9), y: -26 + 40 * hash(q, 11), duration: t1 - t0, ease: "none", immediateRender: false }, t0)),
    spegni: (t) => tl.to([fascio], { opacity: 0, duration: 0.3 }, t),
  };
};

// ═══ controluce: tubo LED su uno stativo basso (spento grigio, acceso lime pieno con l'alone) ══════════════════════════
const ledR11 = (parent, cx, yTop, h, o) => {
  o = o || {};
  const tw = o.w || 36, z = o.z || 22, st = o.stand == null ? 130 : o.stand;
  const g = layered(el(parent, { position: "absolute", left: cx - 80, top: yTop - 14, width: 160, height: h + st + 14, zIndex: z }));
  treppiedeR11(g, 80, h + 10, h + st + 14, { spread: 70, col: 11, z: 0, hub: 0.3 });
  el(g, { position: "absolute", left: 80 - tw / 2, top: 14, width: tw, height: h, borderRadius: tw / 2, background: "linear-gradient(90deg,#222 0%,#555 40%,#7c7c7c 50%,#555 60%,#222 100%)", border: "1.5px solid rgba(255,255,255,.22)", zIndex: 1 });
  const acceso = el(g, { position: "absolute", left: 80 - tw / 2, top: 14, width: tw, height: h, borderRadius: tw / 2, background: "linear-gradient(90deg,#a8d233 0%,#dcff8a 28%,#fbfff0 50%,#dcff8a 72%,#a8d233 100%)", boxShadow: GLOW_A(1.3), opacity: 0, zIndex: 2 });
  [0, h - 8].forEach((yy) => el(g, { position: "absolute", left: 80 - tw / 2 - 5, top: 10 + yy, width: tw + 10, height: 16, borderRadius: 6, background: "linear-gradient(180deg,#3c3c3c,#151515)", zIndex: 3 }));
  return {
    g, rect: [cx - tw / 2, yTop, cx + tw / 2, yTop + h],
    on: (t) => [[0, 1], [0.05, 0.2], [0.1, 1], [0.15, 0.45], [0.21, 1]].forEach(([dt, a]) => tl.to(acceso, { opacity: a, duration: 0.03 }, t + dt)),
    off: (t) => tl.to(acceso, { opacity: 0, duration: 0.2 }, t),
  };
};

// ═══ folla di 100 persone (O23 con le persone): 10 × 10 dischi con la sagoma, la tua foto vera al posto io ═══════════════
// accendi(t, quanti, "bianco" | "lime" | "grigio", {riga, col}) in ordine di lettura (le righe si contano: 50 = 5 righe)
// te(t) la tua foto · lampo(t) tutti i dischi accesi lampeggiano · .dots · .tu
const COL_R11 = {
  spento: ["#2e2e2e", "rgba(255,255,255,.2)", "rgba(255,255,255,.32)", "0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)"],
  bianco: ["#ededea", "rgba(255,255,255,.95)", "#2c2c2c", "0 0 9px rgba(255,255,255,.55), 0 0 26px rgba(255,255,255,.18)"],
  lime: ["#CFFB50", "#efffc2", "#1e1e1e", "0 0 9px rgba(207,251,80,.7), 0 0 26px rgba(207,251,80,.28)"],
  grigio: ["#575757", "rgba(255,255,255,.22)", "#2a2a2a", "0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)"],
};
const follaR11 = (parent, x, y, o) => {
  o = o || {};
  const n = 10, p = o.p || 50, d = o.d || 38, io = o.io == null ? 4 : o.io, C0 = COL_R11.spento;
  const c = el(parent, { position: "absolute", left: x, top: y, width: (n - 1) * p + d, height: (n - 1) * p + d });
  const dots = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++)
    dots.push(el(c, { position: "absolute", left: i * p, top: j * p, width: d, height: d, borderRadius: "50%", overflow: "hidden", backgroundColor: C0[0], border: `1.5px solid ${C0[1]}`, color: C0[2], boxShadow: C0[3], display: "flex", alignItems: "flex-end", justifyContent: "center" }, svg("user-round", Math.round(d * 0.92), "currentColor", 2.3)));
  const tu = avatar(c, (io % n) * p + d / 2, Math.floor(io / n) * p + d / 2, Math.round(d * 1.42), "tu", { bw: 3, ring: K.lime, z: 5 });
  tu.setAttribute("data-layout-allow-overlap", "");
  gsap.set(tu, { opacity: 0, scale: 0.4 });
  const colora = (t, k, col) => { const C = COL_R11[col]; tl.to(dots[k], { backgroundColor: C[0], borderColor: C[1], color: C[2], boxShadow: C[3], duration: 0.1 }, t); };
  return {
    c, dots, tu,
    accendi: (t, quanti, col, o2) => {
      o2 = o2 || {};
      const rs = o2.riga == null ? 0.045 : o2.riga, cs = o2.col == null ? 0.012 : o2.col;
      for (let k = 0; k < quanti; k++) colora(t + Math.floor(k / n) * rs + (k % n) * cs, k, col || "bianco");
    },
    // a onda (F11): i dischi da da a a-1 passano a col
    tinta: (t, da, a, col, passo) => { for (let k = da; k < a; k++) colora(t + (k - da) * (passo == null ? 0.004 : passo), k, col); },
    te: (t) => { tl.to(tu, { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(2.6)" }, t); tl.to(dots[io], { opacity: 0, duration: 0.1 }, t); },
    lampo: (t, quanti) => {
      const acc = dots.slice(0, quanti);
      tl.to(acc, { scale: 1.22, duration: 0.09, ease: "power2.out" }, t);
      tl.to(acc, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, t + 0.09);
    },
  };
};

// ═══ la scala della luce: 4 gradini 3D in grafite (O05/O07/O28: reel 4, 109, 90), sull'alzata il numero, la pill e la folla ═══
// x0 = bordo sinistro del gradino 1 · ground = pavimento · o: { n, w (pedata), r (alzata), dx, dy (profondità), pill: [testi], z }
// → { B, tread(i) {x0, x1, y}, faceRect(i), rect, rise(t, passo), num(i, t), edge(i, t, lime), pill(i, t) }
const scalaR11 = (parent, x0, ground, o) => {
  o = o || {};
  const n = o.n || 4, W = o.w || 800, R = o.r || 800, dx = o.dx || 84, dy = o.dy || 54, z = o.z || 10;
  const testi = o.pill || ["99%", "primo 50%", "primo 30%", "primo 10%"];
  const B = [];
  for (let i = 0; i < n; i++) {
    const left = x0 + i * W, top = ground - (i + 1) * R, H = (i + 1) * R, last = i === n - 1;
    const g = layered(el(parent, { position: "absolute", left, top: top - dy, width: W + dx, height: H + dy, zIndex: z + i }));
    const SV = svgIn(g, W + dx, H + dy);
    const gid = "scR11_" + ++R11N;
    SV._defs.insertAdjacentHTML("beforeend",
      `<linearGradient id="${gid}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3e3e3e"/><stop offset="0.16" stop-color="#2d2d2d"/><stop offset="1" stop-color="#191919"/></linearGradient>` +
      `<linearGradient id="${gid}t" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#606060"/><stop offset="1" stop-color="#454545"/></linearGradient>` +
      `<linearGradient id="${gid}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#202020"/><stop offset="1" stop-color="#121212"/></linearGradient>`);
    pathEl(SV, `M0 ${dy} L${dx} 0 L${W + dx} 0 L${W} ${dy} Z`, { fill: `url(#${gid}t)`, stroke: "rgba(255,255,255,.16)", "stroke-width": 2 });
    if (last) pathEl(SV, `M${W} ${dy} L${W + dx} 0 L${W + dx} ${H} L${W} ${dy + H} Z`, { fill: `url(#${gid}s)` });
    pathEl(SV, `M0 ${dy} L${W} ${dy} L${W} ${dy + H} L0 ${dy + H} Z`, { fill: `url(#${gid}f)`, stroke: "rgba(255,255,255,.12)", "stroke-width": 2 });
    const edge = pathEl(SV, `M3 ${dy} L${W - 3} ${dy}`, { stroke: "rgba(255,255,255,.7)", "stroke-width": 5, "stroke-linecap": "round", opacity: 0 });
    edge.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.7))";
    const edgeL = pathEl(SV, `M3 ${dy} L${W - 3} ${dy}`, { stroke: K.lime, "stroke-width": 8, "stroke-linecap": "round", opacity: 0 });
    edgeL.style.filter = "drop-shadow(0 0 12px rgba(207,251,80,.95))";
    const face = el(g, { position: "absolute", left: 0, top: dy, width: W, height: H });
    const num = el(face, { position: "absolute", left: 50, top: 22, fontFamily: FD, fontWeight: 700, fontSize: 168, lineHeight: 1, color: "#f4f4f2", textShadow: GLOW_T, whiteSpace: "nowrap", opacity: 0 }, String(i + 1));
    const pill = el(face, { position: "absolute", right: 48, top: 64, height: 96, padding: "0 34px", borderRadius: 48, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 800, fontSize: 54, color: K.ink, background: i ? limeFill(1) : "linear-gradient(180deg,#ffffff,#d9d9d3)", boxShadow: i ? `${GLOW_A(0.8)}, 0 16px 34px rgba(0,0,0,.5)` : "0 0 24px rgba(255,255,255,.35), 0 16px 34px rgba(0,0,0,.5)", whiteSpace: "nowrap", opacity: 0 }, testi[i]);
    const folla = follaR11(face, (W - (9 * 50 + 38)) / 2, 232, { io: 4 });
    gsap.set(g, { opacity: 0 });
    B.push({ g, left, top, H, num, pill, folla, edge, edgeL });
  }
  return {
    B, W, R, dx, dy,
    tread: (i) => ({ x0: x0 + i * W, x1: x0 + (i + 1) * W, y: ground - (i + 1) * R }),
    faceRect: (i) => [x0 + i * W - 12, ground - (i + 1) * R - 14, x0 + (i + 1) * W + 12, ground - (i + 1) * R + 760],
    rect: [x0, ground - n * R - dy, x0 + n * W + dx, ground],
    rise: (t, passo) => B.forEach((b, i) => {
      const tt = t + i * (passo == null ? 0.1 : passo);
      tl.set(b.g, { opacity: 1 }, tt);
      tl.fromTo(b.g, { scaleY: 0.03 }, { scaleY: 1, duration: 0.34, ease: "back.out(1.5)", transformOrigin: "50% 100%", immediateRender: false }, tt);
    }),
    num: (i, t) => { tl.fromTo(B[i].num, { opacity: 0, y: 34, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(2.4)", immediateRender: false }, t); glowFlash(B[i].num, t + 0.22); },
    edge: (i, t, lime) => tl.to(lime ? B[i].edgeL : B[i].edge, { opacity: 1, duration: 0.15 }, t),
    pill: (i, t) => tl.fromTo(B[i].pill, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(2.6)", immediateRender: false }, t),
  };
};
