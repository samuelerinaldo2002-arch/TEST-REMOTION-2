// kw-kit v2 · Blocco 5 del piano: le voci nuove dalla revisione dei 150 reel (demo: CATALOGO-ANIMAZIONI/demo-6).
// Tenute in un file a sé dal 09/10 sera (sessione 4): stesso ambito di kit2-oggetti.js (il build concatena tutti i kit2-*.js
// in un solo script), così le correzioni del catalogo non toccano il file su cui lavora il reel in corso.

// ═══ blocco 5 del piano (demo-6): le nuove dalla revisione dei 150 reel ═════════════════════════════════════════════════

// H04 · angoli di selezione (reel 3, 31, 56, 69, 118, 127): quattro angoli a L lime arrivano larghi e si chiudono sul rettangolo
// in 0,35 s (power3.out); .to() li sposta su un altro elemento. r = [x0, y0, x1, y1] nel parent · o: { len (46), w (6), pad (14), z }
const selectCorners = (parent, r, o) => {
  o = o || {};
  const len = o.len || 46, sw = o.w || 6, pad = o.pad == null ? 14 : o.pad, z = o.z || 40;
  const RAD = ["10px 0 0 0", "0 10px 0 0", "0 0 0 10px", "0 0 10px 0"];
  const C = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([sx, sy], k) => {
    const b = `${sw}px solid ${K.lime}`;
    const c = el(parent, { position: "absolute", left: 0, top: 0, width: len, height: len, zIndex: z, pointerEvents: "none", boxSizing: "border-box",
      borderTop: sy ? "none" : b, borderBottom: sy ? b : "none", borderLeft: sx ? "none" : b, borderRight: sx ? b : "none", borderRadius: RAD[k],
      filter: "drop-shadow(0 0 8px rgba(207,251,80,.85))", opacity: 0 });
    return { c, sx, sy };
  });
  const pos = (rr) => C.map(({ sx, sy }) => ({ left: sx ? rr[2] + pad - len : rr[0] - pad, top: sy ? rr[3] + pad - len : rr[1] - pad }));
  return {
    // arrivano dal rettangolo "da" (default: lo stesso allargato del 45%) e si chiudono
    show: (t, da, dur) => {
      const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2, k = 1.45;
      const f = da || [cx - (cx - r[0]) * k, cy - (cy - r[1]) * k, cx + (r[2] - cx) * k, cy + (r[3] - cy) * k];
      const P0 = pos(f), P1 = pos(r);
      C.forEach(({ c }, i) => { tl.set(c, Object.assign({ opacity: 1 }, P0[i]), t); tl.to(c, Object.assign({ duration: dur || 0.35, ease: "power3.out" }, P1[i]), t); });
    },
    to: (t, rr, dur) => { const P = pos(rr); C.forEach(({ c }, i) => tl.to(c, Object.assign({ duration: dur || 0.4, ease: "power3.inOut" }, P[i]), t)); r = rr; },
    hide: (t) => tl.to(C.map((x) => x.c), { opacity: 0, duration: 0.2 }, t),
  };
};

// L16 · elementi che si riordinano (reel 69, 116): ogni elemento si alza (scala 1,06), scivola al nuovo posto (0,6 s, power3.inOut,
// a scalare 0,05 s) e si posa. nodi posizionati con left/top · posti = [[left, top], …] · ordine[i] = posto d'arrivo del nodo i
const reorder = (nodi, posti, ordine, t, o) => {
  o = o || {};
  const dur = o.dur || 0.6;
  nodi.forEach((n, i) => {
    const L0 = parseFloat(n.style.left) || 0, T0 = parseFloat(n.style.top) || 0, [L1, T1] = posti[ordine[i]];
    if (L0 === L1 && T0 === T1) return;
    const tt = t + i * (o.step == null ? 0.05 : o.step);
    tl.set(n, { zIndex: 30 + i }, tt);
    tl.to(n, { x: L1 - L0, y: T1 - T0, duration: dur, ease: "power3.inOut" }, tt);
    tl.to(n, { scale: o.lift || 1.06, duration: dur * 0.45, ease: "power2.out" }, tt);
    tl.to(n, { scale: 1, duration: dur * 0.55, ease: "power2.inOut" }, tt + dur * 0.45);
  });
};

// L16 · scambio di posto (reel 69 di Kallaway: un elemento alla volta, non tutti insieme): quello scelto si stacca (scala 1,08,
// bordo lime e bagliore), fa una S fino al posto dell'altro mentre l'altro scivola dritto al posto lasciato libero; 0,6 s,
// power3.inOut. a, b = nodi posizionati con left/top; si possono scambiare più volte (la posizione corrente resta nel nodo).
// o: { dur (0.6), arco (0.28: quanto curva la S), lift (1.08), glow (true) }
const swapPlaces = (a, b, t, o) => {
  o = o || {};
  const dur = o.dur || 0.6, k = o.arco == null ? 0.28 : o.arco;
  const pos = (n) => [(parseFloat(n.style.left) || 0) + (n._ox || 0), (parseFloat(n.style.top) || 0) + (n._oy || 0)];
  const [ax, ay] = pos(a), [bx, by] = pos(b), dx = bx - ax, dy = by - ay, L2 = Math.hypot(dx, dy) || 1;
  const mx = (ax + bx) / 2 - (dy / L2) * L2 * k, my = (ay + by) / 2 + (dx / L2) * L2 * k;
  tl.set(a, { zIndex: 40 }, t);
  tl.set(b, { zIndex: 30 }, t);
  tl.to(a, { keyframes: [{ x: mx - parseFloat(a.style.left) - 0, y: my - parseFloat(a.style.top), duration: dur / 2, ease: "power2.in" }, { x: bx - parseFloat(a.style.left), y: by - parseFloat(a.style.top), duration: dur / 2, ease: "power2.out" }] }, t);
  tl.to(a, { scale: o.lift || 1.08, duration: dur * 0.4, ease: "power2.out" }, t);
  tl.to(a, { scale: 1, duration: dur * 0.5, ease: "power2.inOut" }, t + dur * 0.5);
  if (o.glow !== false) { tl.to(a, { borderColor: K.lime, boxShadow: `${GLOW_A(0.8)}, 0 24px 50px rgba(0,0,0,.55)`, duration: 0.15 }, t); }
  tl.to(b, { x: ax - parseFloat(b.style.left), y: ay - parseFloat(b.style.top), duration: dur, ease: "power3.inOut" }, t + dur * 0.08);
  a._ox = bx - parseFloat(a.style.left); a._oy = by - parseFloat(a.style.top);
  b._ox = ax - parseFloat(b.style.left); b._oy = ay - parseFloat(b.style.top);
};

// T13 · testo che si corregge (reel 31, 72, 76, 103, 108, 142): una riga lime passa sopra le parole (0,15 s), la riga barrata si
// chiude (0,3 s) e al suo posto si scrive quella giusta. La barra è larga quanto il testo (percentuale dello span: niente misure).
// righe: ["…", …] · o: { w (700), fs (34), lh (1.45), color, z } → { box, rows, strike(i, t), remove(i, t), add(t, testo, {color}) }
const strikeLines = (parent, x, y, righe, o) => {
  o = o || {};
  const fs = o.fs || 34, lh = Math.round(fs * (o.lh || 1.45)), w = o.w || 700;
  const box = el(parent, { position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", zIndex: o.z || 14 });
  const mk = (tx, col, fw) => {
    const row = el(box, { position: "relative", height: lh, overflow: "hidden", display: "flex", alignItems: "center", flex: "0 0 auto" });
    const sp = el(row, { position: "relative", display: "inline-block", whiteSpace: "nowrap", fontFamily: FS, fontWeight: fw || 700, fontSize: fs, color: col || "rgba(255,255,255,.9)" }, tx, "span");
    const bar = el(sp, { position: "absolute", left: -6, right: -6, top: "50%", height: Math.max(4, Math.round(fs * 0.12)), marginTop: -Math.round(fs * 0.04), borderRadius: 3, background: o.color || K.lime, boxShadow: GLOW_A(0.6), transformOrigin: "0 50%" });
    gsap.set(bar, { scaleX: 0 });
    return { row, sp, bar };
  };
  const rows = righe.map((tx) => mk(tx));
  return {
    box, rows, lh,
    strike: (i, t) => { tl.to(rows[i].bar, { scaleX: 1, duration: 0.15, ease: "power2.out" }, t); tl.to(rows[i].sp, { color: "rgba(255,255,255,.42)", duration: 0.15 }, t); },
    remove: (i, t) => tl.to(rows[i].row, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" }, t),
    add: (t, testo, oo) => {
      oo = oo || {};
      const r = mk("", oo.color || K.white, 800);
      gsap.set(r.row, { height: 0, opacity: 0 });
      tl.to(r.row, { height: lh, opacity: 1, duration: 0.25, ease: "power2.out" }, t);
      typeIn(r.sp, testo, t + 0.1, oo.cps || 34);
      r.sp.appendChild(r.bar); // typeIn svuota lo span: la barra torna dentro, così anche le righe scritte si possono barrare
      return r;
    },
    // barra / chiude una riga aggiunta con .add (r = quello che .add restituisce)
    strikeR: (r, t) => { tl.to(r.bar, { scaleX: 1, duration: 0.15, ease: "power2.out" }, t); tl.to(r.sp, { color: "rgba(255,255,255,.42)", duration: 0.15 }, t); },
    removeR: (r, t) => tl.to(r.row, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" }, t),
  };
};

// F12 · timbro che cala (reel 80, 104): impronta in inchiostro lime pieno (l'usura sono buchi della maschera, mai trasparenza) che
// cala grande e inclinata e si pianta in 0,16 s (power4.in), con un colpo di camera e un anello di polvere.
// cx, cy = centro dell'impronta · o: { w (440), h (170), rot (-12), fs (72), seed, z } → { g, down(t) }
const stamp = (parent, cx, cy, testo, o) => {
  o = o || {};
  const w = o.w || 440, h = o.h || 170, z = o.z || 42, seed = o.seed || 5, fs = o.fs || 72;
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z, pointerEvents: "none" }));
  g.setAttribute("data-layout-allow-occlusion", "");
  const SV = svgIn(g, w, h);
  SV.setAttribute("data-layout-allow-overlap", ""); // il timbro cala apposta sopra al testo (bio, nome, bottoni)
  const id = "st" + ++SVGN;
  let holes = "";
  for (let i = 0; i < 150; i++) { const x = ((hash(i, seed) + 1) / 2) * w, y = ((hash(i + 300, seed) + 1) / 2) * h, r = 0.8 + Math.abs(hash(i + 600, seed)) * 2.8; holes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#000"/>`; }
  for (let i = 0; i < 8; i++) { const x = ((hash(i + 900, seed) + 1) / 2) * w, y = ((hash(i + 950, seed) + 1) / 2) * h; holes += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(30 + Math.abs(hash(i, 3)) * 90).toFixed(0)}" height="2.4" fill="#000" transform="rotate(${(hash(i, 7) * 10).toFixed(1)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }
  SV._defs.insertAdjacentHTML("beforeend", `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/>${holes}</mask>`);
  const grp = document.createElementNS(NS, "g");
  grp.setAttribute("mask", `url(#${id})`);
  SV.appendChild(grp);
  grp.insertAdjacentHTML("beforeend", `<rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="18" fill="none" stroke="${K.lime}" stroke-width="9"/><rect x="22" y="22" width="${w - 44}" height="${h - 44}" rx="10" fill="none" stroke="${K.lime}" stroke-width="3"/>`);
  const tx = document.createElementNS(NS, "text");
  tx.setAttribute("x", w / 2); tx.setAttribute("y", h / 2 + fs * 0.36); tx.setAttribute("text-anchor", "middle");
  tx.setAttribute("font-family", "Advercase, serif"); tx.setAttribute("font-weight", "700"); tx.setAttribute("font-size", fs);
  tx.setAttribute("letter-spacing", "4"); tx.setAttribute("fill", K.lime);
  tx.setAttribute("textLength", Math.min(w - 80, testo.length * fs * 0.66).toFixed(0)); tx.setAttribute("lengthAdjust", "spacingAndGlyphs");
  tx.textContent = testo.toUpperCase();
  tx.setAttribute("data-layout-allow-overlap", "");
  grp.appendChild(tx);
  SV.style.filter = "drop-shadow(0 0 10px rgba(207,251,80,.45))";
  gsap.set(g, { opacity: 0, rotation: o.rot == null ? -12 : o.rot });
  return {
    g,
    down: (t) => {
      tl.fromTo(g, { opacity: 0, scale: 2.3, y: -70 }, { opacity: 1, scale: 1, y: 0, duration: 0.16, ease: "power4.in", immediateRender: false }, t);
      tl.fromTo(g, { scale: 0.95 }, { scale: 1, duration: 0.28, ease: "back.out(3)", immediateRender: false }, t + 0.16);
      shake(t + 0.16, 10, 5);
      ripple(parent, cx, cy, t + 0.16, { wd: w * 1.08, ht: h * 1.25, radius: "40px", s0: 0.92, s1: 1.35, w: 3, color: "rgba(255,255,255,.75)", glow: false, z: z - 1, dur: 0.5 });
    },
  };
};

// O28 · mattoncini che si impilano (reel 90 di Kallaway, anche 5, 92, 147, 150): veri mattoncini 3D in isometria (faccia davanti,
// faccia sopra con i pioli 2 × 4, fianco in ombra), uno sopra l'altro con un po' d'aria come nel reel 90, ognuno con la sua
// etichetta a sinistra su una linea tratteggiata, sfocata finché non è detta. Grafite lucida = non ancora detto; .say(i, t)
// accende il mattoncino di lime e mette a fuoco l'etichetta; .snap(t) li incastra in una torre sola (l'aria si chiude, i pioli
// spariscono uno dentro l'altro). cx, base = centro e fondo della pila · labels dal basso · o: { w (300), h (96), lw (330),
// fs (34), gap (34), z } → { B, rect, drop(i, t), say(i, t), snap(t) }
const brickTower = (parent, S, cx, base, labels, o) => {
  o = o || {};
  const w = o.w || 300, h = o.h || 96, z = o.z || 12, fs = o.fs || 34, lw = o.lw || 330, gap = o.gap == null ? 34 : o.gap;
  const dx = w * 0.3, dy = w * 0.17, sh = Math.round(h * 0.17); // profondità isometrica e altezza dei pioli
  const lx = o.lx == null ? cx - w / 2 - 110 - lw : o.lx, pitch = h + dy + gap;
  const PAL = {
    g: { top: "#5d5d5d", topE: "#6c6c6c", front: ["#4a4a4a", "#2a2a2a"], side: ["#262626", "#161616"], stud: "#707070", studS: "#3c3c3c", line: "rgba(255,255,255,.22)" },
    l: { top: "#e8ff9e", topE: "#f4ffd0", front: ["#d4fb5c", "#a9d136"], side: ["#9cc22e", "#7d9c22"], stud: "#f6ffd6", studS: "#b8df44", line: "rgba(255,255,255,.65)" },
  };
  const brickSVG = (S2, P, gid) => {
    const d0 = S2._defs;
    d0.insertAdjacentHTML("beforeend", `<linearGradient id="${gid}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.front[0]}"/><stop offset="1" stop-color="${P.front[1]}"/></linearGradient><linearGradient id="${gid}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.side[0]}"/><stop offset="1" stop-color="${P.side[1]}"/></linearGradient>`);
    const g = document.createElementNS(NS, "g");
    S2.appendChild(g);
    const T = sh + dy; // y del bordo alto della faccia davanti nella scatola
    pathEl(g, `M0 ${T} L${dx} ${T - dy} L${w + dx} ${T - dy} L${w} ${T} Z`, { fill: P.top, stroke: P.line, "stroke-width": 1.5 });
    pathEl(g, `M${w} ${T} L${w + dx} ${T - dy} L${w + dx} ${T - dy + h} L${w} ${T + h} Z`, { fill: `url(#${gid}s)` });
    pathEl(g, `M0 ${T} L${w} ${T} L${w} ${T + h} L0 ${T + h} Z`, { fill: `url(#${gid}f)`, stroke: P.line, "stroke-width": 1.5 });
    pathEl(g, `M2 ${T + 2} L${w - 2} ${T + 2}`, { stroke: "rgba(255,255,255,.35)", "stroke-width": 2 });
    // pioli 2 × 4 sulla faccia sopra: dal fondo al davanti, così quelli davanti coprono quelli dietro
    const rx = w * 0.075, ry = rx * 0.55;
    for (let r = 1; r >= 0; r--) for (let c = 0; c < 4; c++) {
      const u = (c + 0.5) / 4, v = (r + 0.5) / 2, px = u * w + v * dx, py = T - v * dy;
      pathEl(g, `M${px - rx} ${py} L${px - rx} ${py - sh} A${rx} ${ry} 0 0 1 ${px + rx} ${py - sh} L${px + rx} ${py} A${rx} ${ry} 0 0 1 ${px - rx} ${py} Z`, { fill: P.studS });
      const e = document.createElementNS(NS, "ellipse");
      e.setAttribute("cx", px.toFixed(1)); e.setAttribute("cy", (py - sh).toFixed(1)); e.setAttribute("rx", rx.toFixed(1)); e.setAttribute("ry", ry.toFixed(1)); e.setAttribute("fill", P.stud);
      g.appendChild(e);
    }
    return g;
  };
  const BW = w + dx, BH = sh + dy + h;
  const B = labels.map((tx, i) => {
    const y = base - h - i * pitch; // alto della faccia davanti
    const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: y - sh - dy, width: BW, height: BH, zIndex: z + i, filter: "drop-shadow(0 18px 26px rgba(0,0,0,.5))" }));
    const SG = svgIn(g, BW, BH), SL = svgIn(g, BW, BH);
    const gid = "bk" + ++SVGN;
    brickSVG(SG, PAL.g, gid + "g");
    brickSVG(SL, PAL.l, gid + "l");
    SL.style.opacity = 0;
    SL.style.filter = "drop-shadow(0 0 18px rgba(207,251,80,.55))";
    const ym = y + h / 2;
    const cn = connector(S, [[cx - w / 2 - 14, ym], [lx + lw + 14, ym]], { color: "rgba(255,255,255,.6)", w: 3, dash: [4, 10] });
    const lab = el(parent, { position: "absolute", left: lx, top: ym - fs * 0.95, width: lw, height: fs * 1.9, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, rgba(56,56,56,.95), rgba(28,28,28,.97))", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 14px 30px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: fs, color: "rgba(255,255,255,.55)", filter: "blur(6px)", whiteSpace: "nowrap", zIndex: z + 10 }, tx);
    gsap.set([g, lab], { opacity: 0 });
    return { g, SL, cn, lab, y };
  });
  const n = labels.length;
  return {
    B, rect: [Math.min(lx, cx - w / 2) - 20, base - h - (n - 1) * pitch - sh - dy - 30, cx + w / 2 + dx + 20, base + 30],
    // cade al suo posto (0,3 s, power2.in) e si assesta con un rimbalzo
    drop: (i, t) => {
      const b = B[i];
      tl.fromTo(b.g, { opacity: 0, y: -300 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.in", immediateRender: false }, t);
      tl.fromTo(b.g, { scaleY: 0.9 }, { scaleY: 1, duration: 0.25, ease: "back.out(3)", transformOrigin: "50% 100%", immediateRender: false }, t + 0.3);
      b.cn.draw(t + 0.28, 0.3);
      tl.to(b.lab, { opacity: 1, duration: 0.2 }, t + 0.42);
    },
    say: (i, t) => {
      const b = B[i];
      tl.to(b.lab, { filter: "blur(0px)", color: K.white, borderColor: "rgba(207,251,80,.75)", duration: 0.25 }, t);
      tl.set(b.lab, { filter: "none" }, t + 0.26);
      tl.to(b.SL, { opacity: 1, duration: 0.2 }, t);
      tl.fromTo(b.g, { scale: 1.06 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, t);
    },
    // si incastrano: ogni mattoncino scende sul precedente (l'aria si chiude), le linee tratteggiate si spengono, colpo finale
    snap: (t) => {
      B.forEach((b, i) => {
        tl.to(b.g, { y: i * (dy + gap), duration: 0.32, ease: "power3.in" }, t + (n - 1 - i) * 0.04);
        b.cn.hide(t, 0.2);
        tl.to(b.lab, { y: i * (dy + gap), duration: 0.32, ease: "power3.in" }, t + (n - 1 - i) * 0.04);
      });
      shake(t + 0.36, 6, 3);
    },
  };
};

// L15 · pila di card (reel 5, 15, 59, 67, 118): la card appena vista rimpicciolisce e vola in una pila in un angolo (0,5 s), un filo
// ruotata e sfalsata. node posizionato con left/top · (x, y) = posto della pila (centro, nel parent) · i = posizione nella pila
const stackAway = (node, t, x, y, i, o) => {
  o = o || {};
  const w = parseFloat(node.style.width) || 0, h = parseFloat(node.style.height) || 0, L0 = parseFloat(node.style.left) || 0, T0 = parseFloat(node.style.top) || 0;
  [node, ...node.querySelectorAll("*")].forEach((n) => n.setAttribute("data-layout-allow-overlap", ""));
  tl.set(node, { zIndex: 20 + i }, t);
  tl.to(node, { x: x - (L0 + w / 2) + i * 10, y: y - (T0 + h / 2) + i * 8, scale: o.scale || 0.3, rotation: (i % 2 ? 1 : -1) * (5 + i * 2), duration: 0.5, ease: "power3.inOut" }, t);
};

// D10 · anello di progresso (reel 46, 59, 88, 119): attorno a un centro (foto vera) un arco lime luminoso si allunga a scatti;
// .at(f) dà il punto del bordo alla frazione f (per far nascere un'icona). o: { w (16), z } → { holder, show(t), to(f, t, dur), at(f) }
const progressRing = (parent, cx, cy, r, o) => {
  o = o || {};
  const sw = o.w || 16, z = o.z || 12, c0 = r + sw;
  const holder = el(parent, { position: "absolute", left: cx - c0, top: cy - c0, width: 2 * c0, height: 2 * c0, zIndex: z });
  const SV = svgIn(holder, 2 * c0, 2 * c0);
  const d = `M${c0} ${c0 - r} A${r} ${r} 0 1 1 ${(c0 - 0.01).toFixed(2)} ${c0 - r}`;
  pathEl(SV, d, { fill: "none", stroke: "rgba(255,255,255,.12)", "stroke-width": sw, "stroke-linecap": "round" });
  const arc = pathEl(SV, d, { fill: "none", stroke: K.lime, "stroke-width": sw, "stroke-linecap": "round" });
  arc.style.filter = "drop-shadow(0 0 10px rgba(207,251,80,.85))";
  const L = arc.getTotalLength();
  arc.setAttribute("stroke-dasharray", `${L.toFixed(1)} ${L.toFixed(1)}`); arc.setAttribute("stroke-dashoffset", L.toFixed(1));
  gsap.set(holder, { opacity: 0 });
  return {
    holder,
    show: (t) => tl.fromTo(holder, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, t),
    to: (f, t, dur) => tl.to(arc, { attr: { "stroke-dashoffset": (L * (1 - f)).toFixed(1) }, duration: dur || 0.5, ease: "power2.inOut" }, t),
    at: (f) => { const a = -Math.PI / 2 + f * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; },
  };
};

// U15 · timer (reel 11, 13, 146): cronometro d'acciaio (ghiera, pulsante, quadrante scuro con 60 tacche), l'arco lime del tempo che
// resta si accorcia e il numero al centro scende. o: { z } → { g, show(t), run(t, dur, da, a) }
const stopwatch = (parent, cx, cy, d, o) => {
  o = o || {};
  const z = o.z || 14, R = d / 2;
  const g = layered(el(parent, { position: "absolute", left: cx - R, top: cy - R, width: d, height: d, zIndex: z }));
  el(g, { position: "absolute", left: R - d * 0.075, top: -d * 0.14, width: d * 0.15, height: d * 0.1, borderRadius: 8, background: "linear-gradient(90deg,#5a5a5a,#e2e2e2 45%,#8a8a8a 72%,#444)", boxShadow: "0 6px 12px rgba(0,0,0,.5)" });
  el(g, { position: "absolute", left: R - d * 0.045, top: -d * 0.05, width: d * 0.09, height: d * 0.08, background: "linear-gradient(90deg,#4a4a4a,#bdbdbd 50%,#4a4a4a)" });
  el(g, { position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 200deg, #f4f4f4, #8a8a8a, #dcdcdc, #6a6a6a, #ececec, #8a8a8a, #f4f4f4)", boxShadow: "0 34px 70px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.4)" });
  const face = el(g, { position: "absolute", left: d * 0.065, top: d * 0.065, width: d * 0.87, height: d * 0.87, borderRadius: "50%", background: "radial-gradient(circle at 45% 35%, #303030, #111 72%)", boxShadow: "inset 0 10px 26px rgba(0,0,0,.85)" });
  const fd = d * 0.87, fc = fd / 2, rr = fd * 0.4;
  const SV = svgIn(face, fd, fd);
  for (let k = 0; k < 60; k++) {
    const a = (k / 60) * Math.PI * 2, l = k % 5 ? fd * 0.025 : fd * 0.055;
    pathEl(SV, `M${(fc + Math.sin(a) * rr).toFixed(1)} ${(fc - Math.cos(a) * rr).toFixed(1)} L${(fc + Math.sin(a) * (rr - l)).toFixed(1)} ${(fc - Math.cos(a) * (rr - l)).toFixed(1)}`, { stroke: k % 5 ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.85)", "stroke-width": k % 5 ? 2 : 4, "stroke-linecap": "round" });
  }
  const ra = rr + fd * 0.055;
  const arc = pathEl(SV, `M${fc} ${(fc - ra).toFixed(1)} A${ra.toFixed(1)} ${ra.toFixed(1)} 0 1 1 ${(fc - 0.01).toFixed(2)} ${(fc - ra).toFixed(1)}`, { fill: "none", stroke: K.lime, "stroke-width": fd * 0.035, "stroke-linecap": "round" });
  arc.style.filter = "drop-shadow(0 0 8px rgba(207,251,80,.85))";
  const L = arc.getTotalLength();
  arc.setAttribute("stroke-dasharray", `${L.toFixed(1)} ${L.toFixed(1)}`); arc.setAttribute("stroke-dashoffset", 0);
  const num = el(face, { position: "absolute", left: 0, top: fd * 0.24, width: "100%", height: fd * 0.4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: fd * 0.3, lineHeight: 1, color: K.white, textShadow: GLOW_T, zIndex: 2 }, o.start || "60");
  el(face, { position: "absolute", left: 0, top: fd * 0.67, width: "100%", textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: fd * 0.06, letterSpacing: "0.2em", color: "rgba(255,255,255,.55)", zIndex: 2 }, o.unita || "SECONDI");
  gsap.set(g, { opacity: 0 });
  return {
    g, num, // num in coda (blocco 2 del ritmo: il bagliore sul numero), non cambia niente
    show: (t) => tl.fromTo(g, { opacity: 0, scale: 0.8, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, t),
    run: (t, dur, da, a, tot) => {
      tot = tot || 60;
      const V = { v: da };
      tl.fromTo(V, { v: da }, { v: a, duration: dur, ease: "none", onUpdate: () => (num.textContent = String(Math.max(0, Math.ceil(V.v - 1e-6))).padStart(2, "0")), immediateRender: false }, t);
      tl.fromTo(arc, { attr: { "stroke-dashoffset": (L * (1 - da / tot)).toFixed(1) } }, { attr: { "stroke-dashoffset": (L * (1 - a / tot)).toFixed(1) }, duration: dur, ease: "none", immediateRender: false }, t);
    },
  };
};

// D11 · corsa (reel 65, 67, 82, 94): linee che salgono con la foto in testa; le teste avanzano insieme nel tempo (asse x) e ognuna
// sale con la sua curva: la tua (lime) parte piano e supera le altre. lines: [{ pts: [[u, v], …], av: "tu" | indice volto, lime }]
// o: { w (760), h (620), mesi: ["Mese 1", …], z } → { rect, axes(t), run(t, dur) }
const raceChart = (parent, x0, y0, lines, o) => {
  o = o || {};
  const w = o.w || 760, h = o.h || 620, z = o.z || 12;
  const hx = x0 - 60, hy = y0 - h - 120, HW = w + 220, HH = h + 220;
  const holder = el(parent, { position: "absolute", left: hx, top: hy, width: HW, height: HH, zIndex: z, pointerEvents: "none" });
  const S = svgIn(holder, HW, HH);
  const X = (u) => x0 - hx + u * w, Yv = (v) => y0 - hy - v * h;
  const ax = (dd) => { const p = pathEl(S, dd, { fill: "none", stroke: "#ffffff", "stroke-width": 5, "stroke-linecap": "round" }); p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.7))"; drawable(p); return p; };
  const axY = ax(`M${X(0)} ${Yv(0)} L${X(0)} ${Yv(1.08)}`), axX = ax(`M${X(0)} ${Yv(0)} L${X(1.06)} ${Yv(0)}`);
  const grid = [0.25, 0.5, 0.75, 1].map((v) => { const q = pathEl(S, `M${X(0)} ${Yv(v)} L${X(1.02)} ${Yv(v)}`, { stroke: "rgba(255,255,255,.08)", "stroke-width": 2, "stroke-dasharray": "6 10" }); gsap.set(q, { opacity: 0 }); return q; });
  const LN = lines.map((ln, k) => {
    let d = `M${X(ln.pts[0][0])} ${Yv(ln.pts[0][1])}`;
    for (let i = 1; i < ln.pts.length; i++) { const [u0, v0] = ln.pts[i - 1], [u1, v1] = ln.pts[i], mu = (u0 + u1) / 2; d += ` C${X(mu)} ${Yv(v0)} ${X(mu)} ${Yv(v1)} ${X(u1)} ${Yv(v1)}`; }
    const p = pathEl(S, d, { fill: "none", stroke: ln.lime ? K.lime : "rgba(255,255,255,.7)", "stroke-width": ln.lime ? 8 : 4, "stroke-linecap": "round" });
    if (ln.lime) p.style.filter = "drop-shadow(0 0 10px rgba(207,251,80,.85))";
    const len = drawable(p), N = 220, SM = [];
    for (let i = 0; i <= N; i++) { const q = p.getPointAtLength((i / N) * len); SM.push([q.x + hx, q.y + hy, (i / N) * len]); }
    const ad = ln.lime ? 96 : 70;
    const hold = layered(el(parent, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: z + (ln.lime ? 4 : 3) }));
    if (ln.av === "tu") avatar(hold, 0, 0, ad, "tu", { bw: 4, z: 1 });
    else faceDot(hold, -ad / 2, -ad / 2, ad, ln.av == null ? k * 11 : ln.av, "atlas-muro", { bw: 3 });
    // ln.val = [da, a]: pill col numero accanto alla testa (reel 65: "3K", "12K", "100K") che sale con la corsa
    let pv = null;
    if (ln.val) pv = el(hold, { position: "absolute", left: ad / 2 + 10, top: -19, height: 38, padding: "0 12px", display: "flex", alignItems: "center", borderRadius: 10, background: ln.lime ? limeFill(1) : "linear-gradient(180deg,#4a4a4a,#2c2c2c)", border: ln.lime ? "none" : "1.5px solid rgba(255,255,255,.25)", boxShadow: ln.lime ? GLOW_A(0.7) : "0 8px 18px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: 26, color: ln.lime ? K.ink : K.white, whiteSpace: "nowrap", zIndex: 2 }, (o.fmt || ((v) => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(".", ",") + "K" : String(Math.round(v)))))(ln.val[0]));
    if (pv) gsap.set(pv, { opacity: 0 });
    gsap.set(hold, { x: SM[0][0], y: SM[0][1], opacity: 0 });
    return { p, len, SM, hold, pv, val: ln.val };
  });
  const fmtV = o.fmt || ((v) => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(".", ",") + "K" : String(Math.round(v))));
  const mesi = (o.mesi || []).map((m, k, A) => {
    const u = (k + 1) / A.length;
    const pl = el(parent, { position: "absolute", left: x0 + u * w - 80, top: y0 + 22, width: 160, textAlign: "center", zIndex: z + 1 });
    el(pl, { display: "inline-block", padding: "8px 18px", borderRadius: 14, background: "linear-gradient(180deg,#3a3a3a,#242424)", border: "1.5px solid rgba(255,255,255,.2)", fontFamily: FS, fontWeight: 800, fontSize: 26, color: K.white, whiteSpace: "nowrap" }, m, "span");
    gsap.set(pl, { opacity: 0 });
    return { pl, u };
  });
  const U = { u: 0 };
  const put = () => LN.forEach((l) => {
    const xt = x0 + U.u * w;
    let i = 1;
    while (i < l.SM.length - 1 && l.SM[i][0] < xt) i++;
    const a = l.SM[i - 1], b = l.SM[i], f = b[0] === a[0] ? 0 : Math.max(0, Math.min(1, (xt - a[0]) / (b[0] - a[0])));
    gsap.set(l.hold, { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f });
    l.p.setAttribute("stroke-dashoffset", (l.len - (a[2] + (b[2] - a[2]) * f)).toFixed(1));
    // il numero segue l'altezza della testa (più in alto = più grande)
    if (l.pv) { const yy = a[1] + (b[1] - a[1]) * f, vv = Math.max(0, Math.min(1, (y0 - yy) / h)); l.pv.textContent = fmtV(l.val[0] + (l.val[1] - l.val[0]) * vv); }
  });
  return {
    rect: [x0 - 80, y0 - h - 110, x0 + w + 110, y0 + 90],
    axes: (t) => { drawOn(axY, t, 0.3, "power2.out"); drawOn(axX, t + 0.06, 0.32, "power2.out"); grid.forEach((q, k) => tl.to(q, { opacity: 1, duration: 0.3 }, t + 0.15 + k * 0.05)); LN.forEach((l) => tl.to(l.hold, { opacity: 1, duration: 0.25 }, t + 0.25)); },
    // ease: nel reel 65 le teste partono subito dopo il taglio e salgono a passo costante ("none"); default "power1.inOut"
    run: (t, dur, ease) => {
      tl.fromTo(U, { u: 0 }, { u: 1, duration: dur, ease: ease || "power1.inOut", onUpdate: put, immediateRender: false }, t);
      // le pill dei numeri arrivano quando le teste si sono separate (all'inizio partono tutte dallo stesso punto)
      LN.forEach((l, k) => { if (l.pv) tl.fromTo(l.pv, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, t + dur * 0.42 + k * 0.05); });
      mesi.forEach((m) => blurIn(m.pl, t + dur * m.u * 0.92, { y: 10, blur: 8, dur: 0.3 }));
    },
  };
};

// O29 · testa di profilo con il cervello dentro (reel 48, 55, 62, 134 di Kallaway): profilo in grafite col bordo chiaro, dentro il
// cervello vero (obj-cervello), dietro un disco bianco luminoso. Gesti misurati fotogramma per fotogramma sul reel 48 (23,976 fps),
// gli stessi di brain() (sessione 4): niente battito periodico "a cuore", che in Kallaway non c'è.
//   .show(t)     la testa scura col cervello bianco entra (senza disco, come il reel 48 a 1,0 s)
//   .disco(t)    il disco dietro la testa si accende a scatti: mezzo, pieno, abbassato per un fotogramma, pieno (1,50–1,63 s);
//                prima un disco scuro col bordo lime si allarga e sparisce (il disco rosso del reel 48 a 1,42 s)
//   .accendi(t)  il cervello alterna lime e bianco a ogni fotogramma per 5 fotogrammi, poi resta lime (1,71–1,88 s) + alone
//   .on(t)       la sequenza del reel 48: disco(t) e accendi(t + 0,2)
//   .strobo(t)   lampi di 2 fotogrammi ogni 0,30 s (o.n = 3) con l'onda dopo il primo (reel 62, 2,97–3,60 s)
//   .spegni(t)   il cervello torna bianco e il disco si abbassa
// cx, cy = centro della testa · h = altezza del profilo · o: { visibile (A02: già in scena al fotogramma 0), z }
// → { g, disk, rect, brainXY(), show, disco, accendi, on, strobo, spegni }
const headBrain = (parent, cx, cy, h, o) => {
  o = o || {};
  const z = o.z || 12, W = h * 0.86, x0 = cx - W * 0.5, y0 = cy - h * 0.5, F1 = 1 / 30;
  const disk = el(parent, { position: "absolute", left: cx - h * 0.64, top: cy - h * 0.66, width: h * 1.28, height: h * 1.28, borderRadius: "50%", background: "radial-gradient(circle at 50% 46%, #ffffff 0%, #f6f6f1 52%, #dcdcd4 68%, #2a2a2a 69.5%, rgba(30,30,30,0) 71%)", boxShadow: "0 0 90px rgba(255,255,255,.28)", zIndex: z });
  const g = layered(el(parent, { position: "absolute", left: x0, top: y0, width: W, height: h, zIndex: z + 1 }));
  // profilo rivolto a destra, in una scatola 1 × 1,25 (x, y normalizzati sulla larghezza W)
  const P = [[0.30, 1.25], [0.30, 1.06], [0.24, 0.97], [0.17, 0.83], [0.05, 0.62], [0.06, 0.30], [0.24, 0.14], [0.40, 0.01], [0.68, -0.01], [0.82, 0.11], [0.92, 0.20], [0.94, 0.33], [0.93, 0.42], [0.93, 0.47], [0.97, 0.50], [0.99, 0.53], [1.07, 0.63], [1.07, 0.66], [1.03, 0.68], [1.0, 0.69], [1.02, 0.72], [1.0, 0.74], [1.01, 0.77], [0.98, 0.79], [0.99, 0.83], [0.95, 0.88], [0.86, 0.90], [0.76, 0.92], [0.70, 1.0], [0.70, 1.25]];
  const k = W, X = (u) => (u * k).toFixed(1), Yy = (v) => (v * k * (h / (1.25 * W))).toFixed(1);
  let d = `M${X(P[0][0])} ${Yy(P[0][1])}`;
  for (let i = 1; i < P.length; i++) { const p0 = P[Math.max(0, i - 2)], p1 = P[i - 1], p2 = P[i], p3 = P[Math.min(P.length - 1, i + 1)]; d += ` C${X(p1[0] + (p2[0] - p0[0]) / 6)} ${Yy(p1[1] + (p2[1] - p0[1]) / 6)} ${X(p2[0] - (p3[0] - p1[0]) / 6)} ${Yy(p2[1] - (p3[1] - p1[1]) / 6)} ${X(p2[0])} ${Yy(p2[1])}`; }
  d += " Z";
  const SV = svgIn(g, W, h);
  const gid = "hb" + ++SVGN;
  SV._defs.insertAdjacentHTML("beforeend", `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e2e2e"/><stop offset=".55" stop-color="#161616"/><stop offset="1" stop-color="#0c0c0c"/></linearGradient>`);
  const head = pathEl(SV, d, { fill: `url(#${gid})`, stroke: "rgba(255,255,255,.55)", "stroke-width": 3 });
  head.style.filter = "drop-shadow(0 20px 40px rgba(0,0,0,.6))";
  // cervello nel cranio, ritagliato dalla sagoma
  const brainBox = el(g, { position: "absolute", left: 0, top: 0, width: W, height: h, clipPath: `path('${d}')` });
  const bw = W * 0.66, bh = bw * (1523 / 1800), bx = W * 0.15, by = h * 0.1;
  const bWhite = el(brainBox, { position: "absolute", left: bx, top: by, width: bw, height: bh });
  imgIn(bWhite, "obj-cervello", { objectFit: "contain" });
  const bLime = el(brainBox, { position: "absolute", left: bx, top: by, width: bw, height: bh, opacity: 0 });
  imgIn(bLime, "obj-cervello_lime", { objectFit: "contain" });
  const fla = el(brainBox, { position: "absolute", left: bx, top: by, width: bw, height: bh, opacity: 0, filter: "brightness(1.7) drop-shadow(0 0 22px rgba(207,251,80,.9))" });
  imgIn(fla, "obj-cervello_lime", { objectFit: "contain" });
  const BX = x0 + bx + bw / 2, BY = y0 + by + bh / 2, R = h * 0.64;
  gsap.set(disk, { opacity: o.visibile ? 1 : 0 });
  gsap.set(g, { opacity: o.visibile ? 1 : 0 });
  const disco = (t) => {
    // disco scuro col bordo lime che si allarga e sparisce (al posto del rosso), poi il disco bianco a scatti
    const dd = el(parent, { position: "absolute", left: cx - R, top: cy - h * 0.02 - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, rgba(58,58,58,.5), rgba(26,26,26,.6) 72%)", border: `${Math.max(5, Math.round(R * 0.02))}px solid ${K.lime}`, boxShadow: GLOW_A(0.9), opacity: 0, zIndex: z - 1, pointerEvents: "none" });
    dd.setAttribute("data-layout-allow-overlap", "");
    gsap.set(dd, { scale: 0.55 });
    tl.set(dd, { opacity: 1 }, t - 4 * F1);
    tl.to(dd, { scale: 1, duration: 3 * F1, ease: "expo.out" }, t - 4 * F1);
    tl.to(dd, { scale: 1.12, opacity: 0, duration: 0.3, ease: "power1.in" }, t);
    [0.55, 1, 0.42, 1].forEach((a, i) => tl.set(disk, { opacity: a }, t + i * F1));
  };
  const accendi = (t, n) => {
    n = n || 5;
    for (let i = 0; i < n; i++) { tl.set(bLime, { opacity: i % 2 ? 0 : 1 }, t + i * F1); tl.set(bWhite, { opacity: i % 2 ? 1 : 0 }, t + i * F1); }
    tl.set(bLime, { opacity: 1 }, t + n * F1);
    tl.set(bWhite, { opacity: 0 }, t + n * F1);
    // niente alone né disco lime trasparente sopra la testa scura (diventerebbe verde oliva, regola 4): solo un anello lime pieno
    ripple(parent, BX, BY, t + n * F1, { r: bw * 0.42, s0: 0.7, s1: 1.5, w: 5, dur: 0.45, z: z + 3 });
  };
  return {
    g, disk, rect: [cx - h * 0.64, cy - h * 0.66, cx + h * 0.64, cy + h * 0.62],
    brainXY: () => [BX, BY],
    show: (t) => tl.fromTo(g, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, t),
    disco, accendi,
    on: (t) => { disco(t); accendi(t + 0.2); },
    strobo: (t, oo) => {
      oo = oo || {};
      const n = oo.n || 3, per = oo.periodo || 0.3;
      for (let i = 0; i < n; i++) { tl.set(fla, { opacity: 1 }, t + i * per); tl.set(fla, { opacity: 0 }, t + i * per + 2 * F1); }
      ripple(parent, BX, BY, t + 2 * F1, { r: bw * 0.5, s0: 0.55, s1: 1.6, w: 5, dur: 0.5, z: z + 3 });
      return t + (n - 1) * per + 2 * F1;
    },
    spegni: (t) => {
      tl.to(bLime, { opacity: 0, duration: 0.35 }, t);
      tl.to(bWhite, { opacity: 1, duration: 0.35 }, t);
      tl.to(disk, { opacity: 0.45, duration: 0.4 }, t);
    },
  };
};

// D12 · scala a gradiente con il cursore (reel 12, 92, 130): barra verticale a tacche dal grafite (in basso) al lime (in alto), in
// colori pieni; si accende dal basso e il cursore con l'etichetta sale fino al livello. o: { n (12), fs (30), etichette: [basso,
// alto], z } → { fill(t, f, dur), cursor(t, f, testo, dur) }
const gradientScale = (parent, x, y, w, h, o) => {
  o = o || {};
  const n = o.n || 12, gp = 7, sh = (h - gp * (n - 1)) / n, z = o.z || 12;
  const mix = (f) => { const A = [62, 62, 62], B = [207, 251, 80]; return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * f)).join(",")})`; };
  el(parent, { position: "absolute", left: x - 12, top: y - 12, width: w + 24, height: h + 24, borderRadius: 16, background: "linear-gradient(180deg, rgba(40,40,40,.9), rgba(24,24,24,.95))", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 24px 60px rgba(0,0,0,.55)", zIndex: z - 1 });
  const segs = Array.from({ length: n }, (_, k) => {
    const s = el(parent, { position: "absolute", left: x, top: y + h - (k + 1) * sh - k * gp, width: w, height: sh, borderRadius: 6, background: mix(k / (n - 1)), zIndex: z });
    gsap.set(s, { opacity: 0.16 });
    return s;
  });
  const lab = (o.etichette || []).map((tx, i) => el(parent, { position: "absolute", left: x - 252, top: i ? y - 4 : y + h - 40, width: 220, textAlign: "right", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 30, color: i ? K.lime : "rgba(255,255,255,.6)", textShadow: i ? GLOW_LT : "none", whiteSpace: "nowrap", zIndex: z }, tx));
  const cur = el(parent, { position: "absolute", left: x + w + 16, top: y + h - 32, height: 64, display: "flex", alignItems: "center", gap: 10, zIndex: z + 2 }, `<span style="width:0;height:0;border-top:15px solid transparent;border-bottom:15px solid transparent;border-right:22px solid #ffffff;filter:drop-shadow(0 0 6px rgba(255,255,255,.7))"></span>`);
  const cl = el(cur, { padding: "8px 18px", borderRadius: 14, background: "linear-gradient(180deg,#ffffff,#e4e4e4)", color: K.ink, fontFamily: FS, fontWeight: 800, fontSize: o.fs || 30, whiteSpace: "nowrap" }, "", "span");
  gsap.set([cur, ...lab], { opacity: 0 });
  return {
    show: (t) => { lab.forEach((l, i) => blurIn(l, t + i * 0.1, { y: 8, blur: 8, dur: 0.3 })); tl.to(cur, { opacity: 1, duration: 0.2 }, t + 0.1); },
    fill: (t, f, dur) => segs.forEach((s, k) => { if ((k + 0.5) / n <= f) tl.to(s, { opacity: 1, duration: 0.12 }, t + ((k + 0.5) / n / Math.max(0.01, f)) * (dur || 0.8)); }),
    cursor: (t, f, testo, dur) => {
      tl.set(cl, { textContent: testo }, t);
      tl.to(cur, { y: -f * h, duration: dur || 0.8, ease: "power2.inOut" }, t);
      if (f > 0.7) tl.to(cl, { background: limeFill(1), boxShadow: GLOW_A(0.6), duration: 0.2 }, t + (dur || 0.8) * 0.8);
    },
  };
};

// U12 · azioni del reel che si accendono (reel 22, 119): colonna di icone come in Instagram (cuore, commento, invia, salva) con i
// numeri; .on(i, t, da, a) l'icona si riempie di lime con un colpo e il numero sale. x, y = centro della prima icona
// conti = numeri iniziali [4] · o: { gap (132), size (60), fmt, z } → { items, on(i, t, da, a, dur) }
const reelActions = (parent, x, y, conti, o) => {
  o = o || {};
  const gap = o.gap || 132, s = o.size || 60, z = o.z || 16;
  const fmt = o.fmt || ((v) => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(".", ",") + "K" : String(Math.round(v))));
  const items = ["heart", "message-circle", "send", "bookmark"].map((ic, i) => {
    const g = el(parent, { position: "absolute", left: x - 80, top: y + i * gap - s / 2, width: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: z });
    const box = el(g, { position: "relative", width: s, height: s, filter: "drop-shadow(0 4px 10px rgba(0,0,0,.6))" }, svg(ic, s, "#ffffff", 2.2));
    const on = el(box, { position: "absolute", inset: 0, opacity: 0, filter: "drop-shadow(0 0 10px rgba(207,251,80,.9))" }, svg(ic, s, K.lime, 2.2, K.lime));
    const n = el(g, { fontFamily: FS, fontWeight: 800, fontSize: Math.round(s * 0.42), color: K.white, textShadow: "0 2px 8px rgba(0,0,0,.8)", whiteSpace: "nowrap" }, fmt(conti[i] || 0));
    gsap.set(g, { opacity: 0 });
    return { g, box, on, n };
  });
  return {
    items,
    show: (t) => items.forEach((it, i) => blurIn(it.g, t + i * 0.06, { x: 20, y: 0, blur: 8, dur: 0.3 })),
    on: (i, t, da, a, dur) => {
      const it = items[i], V = { v: da };
      tl.to(it.on, { opacity: 1, duration: 0.08 }, t);
      tl.fromTo(it.box, { scale: 1.45 }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, t);
      tl.fromTo(V, { v: da }, { v: a, duration: dur || 0.7, ease: "power2.out", onUpdate: () => (it.n.textContent = fmt(V.v)), immediateRender: false }, t);
      tl.to(it.n, { color: K.lime, textShadow: GLOW_LT, duration: 0.2 }, t);
    },
  };
};

// O31 · razzo che decolla (reel 45, 59 di Kallaway): il razzo vero (obj-razzo, cromo) con la fiamma lime e bianca che pulsa e il
// fumo alla base. Come nel reel 59 porta su il protagonista: o.user = foto profilo sopra la punta, o.pill = contatore accanto
// alla foto ({ da, unita }), e .ride() lo fa decollare con la camera che lo insegue (il razzo resta in campo, le linee di velocità
// e il mondo gli scorrono sotto, il numero sale). .liftoff() è il decollo a camera ferma (il razzo esce dall'inquadratura).
// cx, cy = centro del razzo · h = altezza · o: { user, pill: { da, unita, fmt }, z }
// → { g, rect, show(t), ignite(t, dur), ride(t, dy, dur, {pose, lag}), count(t, a, dur), liftoff(t, dy, dur) }
const rocket = (parent, cx, cy, h, o) => {
  o = o || {};
  const z = o.z || 14, w = (h * 449) / 1024;
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z }));
  // il passeggero (reel 59): foto profilo sopra la punta, contatore lime accanto
  const ad = w * 0.92;
  const pax = o.user ? avatar(g, w * 0.465, -ad * 0.38, ad, o.user, { bw: Math.max(5, Math.round(ad * 0.035)), z: 3 }) : null;
  const fmtN = (o.pill && o.pill.fmt) || ((v) => (v >= 1000 ? (v / 1000).toFixed(1).replace(".", ",") + "K" : String(Math.round(v))));
  let pill = null, pillN = null;
  if (o.pill) {
    pill = el(g, { position: "absolute", left: w * 0.465 + ad * 0.42, top: -ad * 0.38 - ad * 0.62, display: "flex", alignItems: "baseline", gap: 10, padding: `${Math.round(ad * 0.06)}px ${Math.round(ad * 0.12)}px`, borderRadius: Math.round(ad * 0.1), background: limeFill(1), boxShadow: GLOW_A(0.8), fontFamily: FD, fontWeight: 700, fontSize: Math.round(ad * 0.26), color: K.ink, whiteSpace: "nowrap", zIndex: 4 });
    pillN = el(pill, {}, fmtN(o.pill.da || 0), "span");
    if (o.pill.unita) el(pill, { fontFamily: FS, fontWeight: 800, fontSize: Math.round(ad * 0.13) }, o.pill.unita, "span");
  }
  const fl = el(g, { position: "absolute", left: w * 0.5 - w * 0.2, top: h * 0.88, width: w * 0.4, height: h * 0.62, transformOrigin: "50% 0%", zIndex: 0, opacity: 0 });
  el(fl, { position: "absolute", left: "8%", top: 0, width: "84%", height: "100%", borderRadius: "45% 45% 50% 50% / 18% 18% 82% 82%", background: K.lime, filter: "blur(10px)" });
  el(fl, { position: "absolute", left: "22%", top: "2%", width: "56%", height: "70%", borderRadius: "45% 45% 50% 50% / 18% 18% 82% 82%", background: "#f6ffd8", filter: "blur(6px)" });
  el(fl, { position: "absolute", left: "34%", top: "2%", width: "32%", height: "40%", borderRadius: "50%", background: "#ffffff", filter: "blur(4px)" });
  const body = el(g, { position: "absolute", inset: 0, zIndex: 1 });
  imgIn(body, "obj-razzo", { objectFit: "contain" });
  const glowB = el(g, { position: "absolute", left: -w * 0.4, top: h * 0.7, width: w * 1.8, height: h * 0.5, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(207,251,80,.45), rgba(207,251,80,0))", opacity: 0, zIndex: 0 });
  const smoke = Array.from({ length: 9 }, (_, i) => {
    const sd = w * (0.5 + Math.abs(hash(i, 5)) * 0.5);
    const p = el(parent, { position: "absolute", left: cx - sd / 2 + hash(i, 9) * w * 0.2, top: cy + h * 0.46 - sd / 2, width: sd, height: sd, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, rgba(235,235,235,.85), rgba(160,160,160,.55) 55%, rgba(120,120,120,0) 72%)", filter: "blur(3px)", opacity: 0, zIndex: z - 1 });
    return p;
  });
  gsap.set(g, { opacity: 0 });
  const top = cy - h / 2 - (pax ? ad * 0.9 : 20);
  return {
    g, pax, pill, rect: [cx - w, top, cx + w + (pill ? ad * 0.9 : 0), cy + h * 0.95],
    paxXY: () => [cx - w / 2 + w * 0.465, cy - h / 2 - ad * 0.38],
    // il passeggero (foto + contatore) arriva a t, il razzo sale da sotto dBody s dopo (reel 59: prima la foto, poi il razzo)
    show: (t, dBody) => {
      dBody = dBody || 0;
      const pas = [pax, pill].filter(Boolean);
      gsap.set([body, ...pas], { opacity: 0 });
      tl.set(g, { opacity: 1 }, t);
      if (pas.length) tl.fromTo(pas, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, t);
      tl.fromTo(body, { opacity: 0, y: 60, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, t + dBody);
      tl.set(body, { filter: "none" }, t + dBody + 0.46);
    },
    // il numero del contatore sale (da quello attuale ad a) con un colpo sulla pill; nel reel 59 sale da subito e quasi lineare
    // (ease "none"), il default resta "power1.in"
    count: (t, a, dur, ease) => {
      if (!pillN) return;
      const V = { v: o.pill.da || 0 };
      tl.fromTo(V, { v: o.pill.da || 0 }, { v: a, duration: dur || 1.2, ease: ease || "power1.in", onUpdate: () => (pillN.textContent = fmtN(V.v)), immediateRender: false }, t);
      tl.fromTo(pill, { scale: 1 }, { scale: 1.12, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, t + (dur || 1.2));
    },
    // decollo con la camera che insegue (reel 59): il razzo sale di dy in dur accelerando; la camera parte o.lag s dopo con la
    // stessa curva e frena un filo prima, così il razzo sale nell'inquadratura e poi resta in campo. Linee di velocità nel mondo
    // lungo tutta la corsa (passano sotto perché la camera sale); niente scia sul mondo, così foto e numero restano leggibili. o.pose = posa della camera (da cutRect/frameRect).
    ride: (t, dy, dur, oo) => {
      oo = oo || {};
      dur = dur || 2.4;
      const lag = oo.lag == null ? 0.18 : oo.lag, P = oo.pose || CAM;
      tl.to(body, { x: 0, duration: 0.05 }, t);
      tl.to(fl, { scaleY: 1.6, duration: 0.3, ease: "power2.out" }, t);
      tl.to(g, { y: -dy, duration: dur, ease: "power2.in" }, t);
      tl.to(smoke, { opacity: 0, duration: 0.6 }, t + 0.25);
      camK(t + lag, dur - lag * 0.6, P.fx, P.fy - dy * 0.97, P.s, "power2.in");
      // linee di velocità: bianche sottili e qualcuna lime, sparse attorno alla traiettoria (fisse nel mondo)
      for (let i = 0; i < 46; i++) {
        const lx = cx + hash(i, 41) * w * 3.2, ly = cy - h * 0.6 - (i / 46) * dy * 1.05 + hash(i, 43) * 80;
        const lh = 120 + Math.abs(hash(i, 47)) * 260, lime = i % 7 === 3;
        const ln = el(parent, { position: "absolute", left: lx, top: ly, width: lime ? 4 : 3, height: lh, borderRadius: 2, background: lime ? "linear-gradient(180deg, rgba(207,251,80,0), #CFFB50)" : "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.8))", boxShadow: lime ? "0 0 10px rgba(207,251,80,.7)" : "none", opacity: 0, zIndex: z - 2 });
        const tt = t + dur * (0.25 + 0.75 * (i / 46) ** 0.8);
        tl.fromTo(ln, { opacity: 0, y: 0 }, { opacity: 0.9, y: lh * 0.6, duration: 0.18, ease: "none", immediateRender: false }, tt);
        tl.to(ln, { opacity: 0, y: lh * 1.8, duration: 0.3, ease: "none" }, tt + 0.18);
      }
    },
    ignite: (t, dur) => {
      dur = dur || 0.8;
      tl.to(fl, { opacity: 1, duration: 0.1 }, t);
      tl.to(glowB, { opacity: 1, duration: 0.2 }, t);
      const n = Math.round(dur / 0.06);
      for (let k = 0; k <= n; k++) tl.to(fl, { scaleY: 0.55 + 0.45 * Math.min(1, k / 4) * (0.82 + 0.18 * Math.abs(hash(k, 21))), scaleX: 0.92 + 0.08 * Math.abs(hash(k, 23)), duration: 0.06, ease: "none" }, t + k * 0.06);
      for (let k = 0; k < n; k++) tl.to(body, { x: hash(k, 31) * 3, duration: 0.05, ease: "none" }, t + k * 0.06);
      smoke.forEach((p, i) => {
        const dx = (i % 2 ? 1 : -1) * w * (0.4 + Math.abs(hash(i, 3)) * 0.9);
        tl.fromTo(p, { opacity: 0, scale: 0.3, x: 0, y: 0 }, { opacity: 0.9, scale: 1.6, x: dx, y: -h * 0.05 * Math.abs(hash(i, 4)), duration: 0.9, ease: "power2.out", immediateRender: false }, t + 0.1 + i * 0.05);
      });
    },
    liftoff: (t, dy, dur) => {
      dur = dur || 0.9;
      tl.to(body, { x: 0, duration: 0.05 }, t);
      tl.to(fl, { scaleY: 1.5, duration: 0.25, ease: "power2.out" }, t);
      tl.to(g, { y: -dy, duration: dur, ease: "power2.in" }, t);
      tl.to(smoke, { opacity: 0, duration: 0.6 }, t + 0.3);
      for (let i = 0; i < 10; i++) {
        const lx = cx + hash(i, 41) * w * 1.6, ly = cy - h * 0.2 - Math.abs(hash(i, 43)) * h;
        const ln = el(parent, { position: "absolute", left: lx, top: ly, width: 3, height: 90 + Math.abs(hash(i, 47)) * 140, borderRadius: 2, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.75))", opacity: 0, zIndex: z - 1 });
        tl.fromTo(ln, { opacity: 0, y: 0 }, { opacity: 0.9, y: 120, duration: 0.15, ease: "none", immediateRender: false }, t + dur * 0.35 + i * 0.04);
        tl.to(ln, { opacity: 0, y: 360, duration: 0.25, ease: "none" }, t + dur * 0.35 + i * 0.04 + 0.15);
      }
    },
  };
};

// D14 · forma d'onda audio (reel 36, 114, 127): barre simmetriche (ampiezza deterministica, inviluppo per ogni presa) che si alzano
// al passaggio della testina lime; .take(i, t) accende di lime la presa i (la buona), .dim(i, t) spegne le altre.
// x, y = inizio e asse · o: { n (96), prese (1), z } → { play(t, dur), take(i, t), dim(i, t), takeX(i) }
const waveform = (parent, x, y, w, h, o) => {
  o = o || {};
  const n = o.n || 96, takes = o.prese || 1, z = o.z || 12, gapT = takes > 1 ? 34 : 0, per = n / takes;
  const span = w - gapT * (takes - 1), bw = (span / n) * 0.6;
  const bars = [];
  for (let i = 0; i < n; i++) {
    const tk = Math.floor(i / per), local = (i - tk * per) / per;
    const env = Math.pow(Math.sin(Math.PI * Math.min(0.999, local * 1.02 + 0.01)), 0.55);
    const amp = (0.22 + 0.78 * Math.abs(hash(i, 17)) * (0.6 + 0.4 * Math.abs(Math.sin(i * 0.7)))) * env;
    const bx = x + (i / n) * span + tk * gapT, bh = Math.max(8, amp * h);
    const b = el(parent, { position: "absolute", left: bx, top: y - bh / 2, width: bw, height: bh, borderRadius: bw, background: "#e9e9e9", boxShadow: "0 0 6px rgba(255,255,255,.35)", zIndex: z });
    gsap.set(b, { scaleY: 0.06, opacity: 0.35 });
    bars.push({ b, tk, f: (bx - x) / w });
  }
  const head = el(parent, { position: "absolute", left: x - 2, top: y - h * 0.62, width: 4, height: h * 1.24, borderRadius: 2, background: K.lime, boxShadow: GLOW_A(0.9), opacity: 0, zIndex: z + 1 });
  return {
    takeX: (k) => [x + (k * per / n) * span + k * gapT, x + (((k + 1) * per) / n) * span + k * gapT],
    play: (t, dur) => {
      bars.forEach((q) => { tl.to(q.b, { scaleY: 1, opacity: 1, duration: 0.16, ease: "power2.out" }, t + q.f * dur); tl.to(q.b, { scaleY: 0.82 + 0.18 * Math.abs(hash(q.f * 100, 5)), duration: 0.2, ease: "sine.inOut" }, t + q.f * dur + 0.16); });
      tl.fromTo(head, { x: 0, opacity: 1 }, { x: w, duration: dur, ease: "none", immediateRender: false }, t);
      tl.to(head, { opacity: 0, duration: 0.2 }, t + dur);
    },
    take: (k, t) => bars.filter((q) => q.tk === k).forEach((q, j) => tl.to(q.b, { background: K.lime, boxShadow: GLOW_A(0.6), duration: 0.12 }, t + j * 0.006)),
    dim: (k, t) => tl.to(bars.filter((q) => q.tk === k).map((q) => q.b), { opacity: 0.3, duration: 0.25 }, t),
  };
};

// U14 · mirino della fotocamera (reel 144): sopra un video vero: angoli bianchi, REC rosso che lampeggia (UI vera), timecode che corre,
// batteria e "4K · 30", quadrato di messa a fuoco che si stringe. r = [x0, y0, x1, y1] · o: { z }
// → { show(t), rec(t, dur), focus(t, x, y) }
const viewfinder = (parent, r, o) => {
  o = o || {};
  const z = o.z || 30, [x0, y0, x1, y1] = r, W = x1 - x0, H = y1 - y0, len = Math.round(Math.min(W, H) * 0.1), sw = 5;
  const box = el(parent, { position: "absolute", left: x0, top: y0, width: W, height: H, zIndex: z, pointerEvents: "none" });
  box.setAttribute("data-layout-allow-occlusion", "");
  const RAD = ["8px 0 0 0", "0 8px 0 0", "0 0 0 8px", "0 0 8px 0"];
  const cs = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([sx, sy], k) => el(box, { position: "absolute", left: sx ? W - 26 - len : 26, top: sy ? H - 26 - len : 26, width: len, height: len, boxSizing: "border-box", borderTop: sy ? "none" : `${sw}px solid #fff`, borderBottom: sy ? `${sw}px solid #fff` : "none", borderLeft: sx ? "none" : `${sw}px solid #fff`, borderRight: sx ? `${sw}px solid #fff` : "none", borderRadius: RAD[k], filter: "drop-shadow(0 0 4px rgba(0,0,0,.6))" }));
  const fs = Math.round(W * 0.045);
  const recRow = el(box, { position: "absolute", left: 40 + len * 0.4, top: 40, display: "flex", alignItems: "center", gap: 10, fontFamily: FS, fontWeight: 800, fontSize: fs, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,.7)", whiteSpace: "nowrap" });
  const dot = el(recRow, { width: fs * 0.7, height: fs * 0.7, borderRadius: "50%", background: "#ff3b30", boxShadow: "0 0 10px rgba(255,59,48,.8)" }, null, "span");
  el(recRow, {}, "REC", "span");
  const tc = el(box, { position: "absolute", left: 0, top: 40, width: W, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: fs, letterSpacing: "0.06em", color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,.7)" }, "00:00:00");
  el(box, { position: "absolute", right: 40 + len * 0.4, top: 40, display: "flex", alignItems: "center", gap: 10, fontFamily: FS, fontWeight: 800, fontSize: fs * 0.85, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,.7)", whiteSpace: "nowrap" }, `4K · 30 <span style="display:inline-block;width:${fs * 1.6}px;height:${fs * 0.8}px;border:2px solid #fff;border-radius:4px;position:relative"><span style="position:absolute;left:2px;top:2px;bottom:2px;width:70%;background:${K.lime};border-radius:2px"></span></span>`);
  el(box, { position: "absolute", left: 40 + len * 0.4, bottom: 40, fontFamily: FS, fontWeight: 700, fontSize: fs * 0.8, color: "rgba(255,255,255,.85)", textShadow: "0 2px 6px rgba(0,0,0,.7)", whiteSpace: "nowrap" }, "AF-C · 1/60 · ISO 400");
  const foc = el(box, { position: "absolute", left: W / 2 - W * 0.14, top: H * 0.38 - W * 0.14, width: W * 0.28, height: W * 0.28, border: `3px solid ${K.lime}`, borderRadius: 10, boxShadow: GLOW_A(0.6), opacity: 0 });
  gsap.set(box, { opacity: 0 });
  return {
    box,
    show: (t) => { tl.to(box, { opacity: 1, duration: 0.2 }, t); cs.forEach((c, i) => tl.fromTo(c, { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t + i * 0.03)); },
    rec: (t, dur) => {
      const n = Math.round(dur / 0.5);
      for (let k = 0; k <= n; k++) tl.set(dot, { opacity: k % 2 ? 0.2 : 1 }, t + k * 0.5);
      const V = { s: 0 };
      tl.fromTo(V, { s: 0 }, { s: dur, duration: dur, ease: "none", onUpdate: () => { const s = Math.floor(V.s), f = Math.floor((V.s - s) * 30); tc.textContent = `00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`; }, immediateRender: false }, t);
    },
    focus: (t, fx, fy) => {
      if (fx != null) gsap.set(foc, { left: fx - x0 - W * 0.14, top: fy - y0 - W * 0.14 });
      tl.fromTo(foc, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, t);
      tl.to(foc, { scale: 1.06, duration: 0.08, yoyo: true, repeat: 1 }, t + 0.3);
      tl.to(foc, { opacity: 0, duration: 0.3 }, t + 0.9);
    },
  };
};

// O32 · cartella che si apre a ventaglio (reel 30, 58, 60): cartella in grafite con la linguetta e l'etichetta; i file escono a
// ventaglio dal bordo (0,5 s, ruotano attorno al fondo) e restano aperti. files: [titolo, …] (pagine vere docPage)
// o: { w (420), h (300), etichetta, z } → { g, rect, show(t), fan(t), close(t) }
const fanFolder = (parent, cx, cy, files, o) => {
  o = o || {};
  const w = o.w || 420, h = o.h || 300, z = o.z || 12;
  const g = el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z });
  el(g, { position: "absolute", left: 0, top: -h * 0.12, width: w * 0.42, height: h * 0.2, borderRadius: "14px 14px 0 0", background: "linear-gradient(180deg,#4a4a4a,#2e2e2e)", border: "1.5px solid rgba(255,255,255,.18)" });
  el(g, { position: "absolute", inset: 0, borderRadius: "0 18px 18px 18px", background: "linear-gradient(180deg,#3a3a3a,#232323)", border: "1.5px solid rgba(255,255,255,.18)", boxShadow: "0 30px 70px rgba(0,0,0,.6)" });
  const pw = w * 0.5, ph = pw * 1.3;
  const pages = files.map((tt, i) => {
    const holder = el(g, { position: "absolute", left: w / 2 - pw / 2, top: h * 0.52 - ph, width: pw, height: ph, transformOrigin: "50% 100%", zIndex: 2 + i });
    docPage(holder, 0, 0, pw, ph, tt, 3 + i, { z: 1 });
    gsap.set(holder, { y: ph * 0.55, opacity: 0 });
    return holder;
  });
  const front = el(g, { position: "absolute", left: 0, top: h * 0.3, width: w, height: h * 0.7, borderRadius: "10px 10px 18px 18px", background: "linear-gradient(180deg,#5a5a5a 0%,#3a3a3a 40%,#262626 100%)", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 -10px 30px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.2)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(w * 0.075), color: K.white, gap: 12, whiteSpace: "nowrap" }, svg("folder-open", Math.round(w * 0.08), K.lime, 2.4) + (o.etichetta || "Cartella"));
  front.setAttribute("data-layout-allow-occlusion", "");
  gsap.set(g, { opacity: 0 });
  const n = pages.length;
  return {
    g, rect: [cx - w * 1.1, cy - h / 2 - ph * 1.1, cx + w * 1.1, cy + h / 2 + 30],
    show: (t) => tl.fromTo(g, { opacity: 0, y: 40, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t),
    fan: (t) => pages.forEach((p, i) => {
      const f = n === 1 ? 0 : i / (n - 1) - 0.5;
      tl.to(p, { opacity: 1, duration: 0.1 }, t + i * 0.05);
      tl.to(p, { y: -ph * 0.25, x: f * w * 0.95, rotation: f * 50, duration: 0.5, ease: "back.out(1.6)" }, t + i * 0.05);
    }),
    close: (t) => pages.forEach((p, i) => tl.to(p, { y: ph * 0.55, x: 0, rotation: 0, duration: 0.4, ease: "power3.in" }, t + (n - 1 - i) * 0.04)),
  };
};

// U13 · commenti che si moltiplicano (reel 123 di Kallaway; anche 89): commenti di Instagram veri e leggibili (volto vero, nome,
// testo grande, "2 min · Rispondi", cuore) che spuntano in tutto il riquadro sempre più in fretta, sfalsati e un po' sovrapposti,
// ognuno con una leggera deriva verso l'alto. .collect(t, x, y) li risucchia tutti in un punto (la cartella del "ti mando la lista").
// r = [x0, y0, x1, y1] · righe: [[nome, testo], …] · o: { fs (34), w (frazione della larghezza, 0.56), z }
// → { rows, burst(t, dur), collect(t, x, y, {scale}) }
const commentBurst = (parent, r, righe, o) => {
  o = o || {};
  const [x0, y0, x1, y1] = r, RW = x1 - x0, RH = y1 - y0, fs = o.fs || 34, z = o.z || 18, n = righe.length;
  const cw = RW * (o.w || 0.56), ch = fs * 2.95, ad = ch * 0.62;
  const rows = righe.map(([nome, testo], i) => {
    // a zig-zag dall'alto in basso, sfalsati a sinistra e a destra (deterministico)
    const col = i % 2, f = n > 1 ? i / (n - 1) : 0;
    const x = x0 + (col ? RW - cw : 0) + hash(i, 3) * RW * 0.06 + (col ? -1 : 1) * RW * 0.04 * Math.abs(hash(i, 5));
    const y = y0 + f * (RH - ch) + hash(i, 7) * fs * 0.4;
    const c = el(parent, { position: "absolute", left: x, top: y, width: cw, height: ch, borderRadius: 18, background: "linear-gradient(180deg, rgba(44,44,46,.97), rgba(28,28,30,.98))", border: "1.5px solid rgba(255,255,255,.14)", boxShadow: "0 18px 40px rgba(0,0,0,.55)", zIndex: z + i });
    c.setAttribute("data-layout-allow-overlap", "");
    const fd = el(c, { position: "absolute", left: fs * 0.55, top: (ch - ad) / 2, width: ad, height: ad });
    faceDot(fd, 0, 0, ad, 7 + i * 13, "atlas-muro", { bw: 0 });
    const tx = fs * 0.55 + ad + fs * 0.5;
    el(c, { position: "absolute", left: tx, top: ch * 0.12, fontFamily: FS, fontWeight: 800, fontSize: Math.round(fs * 0.62), color: "rgba(255,255,255,.72)", whiteSpace: "nowrap" }, nome + `<span style="font-weight:600;color:rgba(255,255,255,.45)"> · ${1 + (i % 5)} min</span>`);
    el(c, { position: "absolute", left: tx, top: ch * 0.36, fontFamily: FS, fontWeight: 800, fontSize: fs, color: "#ffffff", whiteSpace: "nowrap" }, testo);
    el(c, { position: "absolute", left: tx, top: ch * 0.74, fontFamily: FS, fontWeight: 700, fontSize: Math.round(fs * 0.5), color: "rgba(255,255,255,.45)", whiteSpace: "nowrap" }, "Rispondi");
    el(c, { position: "absolute", right: fs * 0.6, top: (ch - fs * 0.8) / 2, width: fs * 0.8, height: fs * 0.8 }, svg("heart", Math.round(fs * 0.8), "rgba(255,255,255,.6)", 2));
    gsap.set(c, { opacity: 0, scale: 0.6 });
    return c;
  });
  return {
    rows,
    // pop con rimbalzo e deriva lenta verso l'alto. esp = ritmo: < 1 accelera (valanga, default 0.62); > 1 esplode subito e
    // rallenta, come il reel 123 (una dozzina di commenti in ~0,3 s, poi restano fermi da leggere): burst(t, 0.65, 1.8)
    burst: (t, dur, esp) => {
      rows.forEach((c, i) => {
        const tt = t + dur * Math.pow(i / Math.max(1, n - 1), esp || 0.62);
        tl.to(c, { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2.2)" }, tt);
        tl.to(c, { y: -fs * 0.8, duration: 2.4, ease: "none" }, tt);
      });
    },
    // tutti risucchiati in (x, y): si rimpiccioliscono e volano dentro, dall'ultimo arrivato al primo
    collect: (t, x, y, oo) => {
      oo = oo || {};
      rows.forEach((c, i) => {
        const L0 = parseFloat(c.style.left), T0 = parseFloat(c.style.top), tt = t + (n - 1 - i) * 0.025;
        tl.to(c, { x: x - (L0 + cw / 2), y: y - (T0 + ch / 2), scale: oo.scale || 0.12, opacity: 0, duration: 0.42, ease: "power3.in" }, tt);
      });
    },
  };
};

// O30 · bivio (reel 62, 79): la linea sale dal basso fino al bivio e si divide in due rami curvi (0,3 s l'uno) con le etichette in
// cima; .choose(i, t) accende di lime il ramo i e spegne l'altro. (x, yb) = base · yf = bivio · o: { dx (360), dy (320), labels,
// fs (32) } → { rect, draw(t), choose(i, t) }
const forkPath = (parent, S, x, yb, yf, o) => {
  o = o || {};
  const dx = o.dx || 360, dy = o.dy || 320, fs = o.fs || 32, z = o.z || 14;
  const stem = pathEl(S, `M${x} ${yb} L${x} ${yf}`, { fill: "none", stroke: "#ffffff", "stroke-width": 7, "stroke-linecap": "round" });
  stem.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,.7))";
  drawable(stem);
  const br = [-1, 1].map((s) => {
    const p = pathEl(S, `M${x} ${yf} C${x} ${yf - dy * 0.45}, ${x + s * dx} ${yf - dy * 0.35}, ${x + s * dx} ${yf - dy}`, { fill: "none", stroke: "#ffffff", "stroke-width": 7, "stroke-linecap": "round" });
    p.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,.7))";
    drawable(p);
    return p;
  });
  const node = el(parent, { position: "absolute", left: x - 16, top: yf - 16, width: 32, height: 32, borderRadius: "50%", background: "#fff", boxShadow: "0 0 14px #fff, 0 0 30px rgba(207,251,80,.8)", opacity: 0, zIndex: z + 1 });
  const labs = (o.labels || []).map((tx, i) => {
    const s = i ? 1 : -1;
    const l = el(parent, { position: "absolute", left: x + s * dx - 210, top: yf - dy - fs * 2.6, width: 420, textAlign: "center", zIndex: z + 2 });
    el(l, { display: "inline-block", padding: `${Math.round(fs * 0.35)}px ${Math.round(fs * 0.7)}px`, borderRadius: 16, background: "linear-gradient(180deg, rgba(56,56,56,.95), rgba(28,28,28,.97))", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 14px 30px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, whiteSpace: "nowrap" }, tx, "span");
    gsap.set(l, { opacity: 0 });
    return l;
  });
  return {
    rect: [x - dx - 230, yf - dy - fs * 3, x + dx + 230, yb + 20],
    draw: (t) => {
      drawOn(stem, t, 0.35, "power2.in");
      tl.fromTo(node, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)", immediateRender: false }, t + 0.35);
      br.forEach((p) => drawOn(p, t + 0.38, 0.32, "power2.out"));
      labs.forEach((l, i) => blurIn(l, t + 0.62 + i * 0.12, { y: 10, blur: 8, dur: 0.3 }));
    },
    // si può chiamare più volte (prima un ramo, poi l'altro): il ramo scelto torna pieno, l'altro si spegne
    choose: (i, t) => {
      tl.to(br[i], { attr: { stroke: K.lime, "stroke-width": 10, opacity: 1 }, duration: 0.2 }, t);
      tl.to(br[1 - i], { attr: { stroke: "#ffffff", "stroke-width": 7, opacity: 0.25 }, duration: 0.3 }, t);
      if (labs[i]) { tl.to(labs[i], { opacity: 1, duration: 0.2 }, t); tl.to(labs[i].firstChild, { background: limeFill(1), color: K.ink, boxShadow: GLOW_A(0.6), duration: 0.2 }, t); }
      if (labs[1 - i]) { tl.to(labs[1 - i], { opacity: 0.3, duration: 0.3 }, t); tl.to(labs[1 - i].firstChild, { background: "linear-gradient(180deg, rgba(56,56,56,.95), rgba(28,28,28,.97))", color: K.white, boxShadow: "0 14px 30px rgba(0,0,0,.5)", duration: 0.2 }, t); }
    },
  };
};

// O30 · bivio in prospettiva (reel 79 di Kallaway, "The Headfake"): la strada che tutti si aspettano (linea tratteggiata che curva
// verso l'orizzonte, coi bordi appena accennati) e il ramo al neon lime che se ne stacca (la finta). Una pallina luminosa coi fari
// percorre la strada e al bivio prende il neon. Tratteggi e neon si disegnano dal basso (~0,8 s), sempre più sottili verso
// l'orizzonte; la pallina rimpicciolisce con la distanza. (cx, by) = centro della strada in basso · o: { w (900), h (1300),
// split (0.34: dove si stacca il ramo), labels: [strada, finta], fs (36), z }
// → { rect, draw(t, dur), drive(t, dur, {finta}), choose(t), endA, endB }
const roadFork = (parent, S, cx, by, o) => {
  o = o || {};
  const w = o.w || 900, h = o.h || 1300, z = o.z || 14, fs = o.fs || 36, SP = o.split == null ? 0.34 : o.split;
  const bz = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
  // strada attesa: parte in basso, piega a sinistra, poi rientra e sparisce in alto (come la strada tratteggiata del reel 79)
  const A = [[cx - w * 0.04, by], [cx - w * 0.5, by - h * 0.36], [cx + w * 0.12, by - h * 0.7], [cx - w * 0.16, by - h]];
  const NA = 240, PA = Array.from({ length: NA + 1 }, (_, i) => bz(A[0], A[1], A[2], A[3], i / NA));
  const arc = (P) => { const s = [0]; for (let i = 1; i < P.length; i++) s.push(s[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return s; };
  const SA = arc(PA), LA = SA[NA];
  const atS = (P, S2, s) => { let i = 1; while (i < P.length - 1 && S2[i] < s) i++; const f = (s - S2[i - 1]) / Math.max(1e-6, S2[i] - S2[i - 1]); return [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * f, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * f, Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0])]; };
  // prospettiva: la profondità dipende dall'altezza sullo schermo (0 in basso, 1 all'orizzonte)
  const depth = (y) => Math.max(0, Math.min(1, (by - y) / h));
  const wid = (y, a, b) => a + (b - a) * Math.pow(depth(y), 0.75);
  // tratteggio della strada attesa: trattini sempre più corti e sottili
  const dashes = [];
  for (let s = 0, k = 0; s < LA - 4; k++) {
    const y = atS(PA, SA, s)[1], len = wid(y, 92, 12), gap = len * 0.85;
    const a = atS(PA, SA, s), b = atS(PA, SA, Math.min(LA, s + len));
    const p = pathEl(S, `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`, { stroke: "#ffffff", "stroke-width": wid(y, 13, 2.5).toFixed(1), "stroke-linecap": "round", opacity: 0 });
    p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.75))";
    dashes.push({ p, f: s / LA });
    s += len + gap;
  }
  // bordi della strada (sottili, appena accennati), a distanza decrescente dal centro
  const edge = (sgn) => {
    let d = "";
    PA.forEach((q, i) => { if (i % 4) return; const j = Math.min(NA, i + 1), a2 = Math.atan2(PA[j][1] - PA[Math.max(0, j - 2)][1], PA[j][0] - PA[Math.max(0, j - 2)][0]), off = wid(q[1], w * 0.2, w * 0.018) * sgn; d += `${d ? "L" : "M"}${(q[0] - Math.sin(a2) * off).toFixed(1)} ${(q[1] + Math.cos(a2) * off).toFixed(1)} `; });
    const p = pathEl(S, d, { fill: "none", stroke: "rgba(255,255,255,.2)", "stroke-width": 3 });
    drawable(p);
    return p;
  };
  const edges = [edge(1), edge(-1)];
  // la finta: ramo al neon che si stacca dalla strada a SP e piega a destra verso l'orizzonte
  const B0 = atS(PA, SA, LA * SP);
  const B = [[B0[0], B0[1]], [B0[0] + w * 0.42, B0[1] - h * 0.05], [cx + w * 0.62, by - h * 0.62], [cx + w * 0.38, by - h * 0.99]];
  const NB = 200, PB = Array.from({ length: NB + 1 }, (_, i) => bz(B[0], B[1], B[2], B[3], i / NB)), SB = arc(PB), LB = SB[NB];
  // nastro al neon: poligono che si assottiglia con la distanza (alone lime pieno + anima chiara)
  const ribbon = (P, w0, w1) => {
    const L2 = [], R2 = [];
    P.forEach((q, i) => { const j = Math.min(P.length - 1, i + 1), k = Math.max(0, i - 1), a2 = Math.atan2(P[j][1] - P[k][1], P[j][0] - P[k][0]), hw = wid(q[1], w0, w1) / 2; L2.push([q[0] - Math.sin(a2) * hw, q[1] + Math.cos(a2) * hw]); R2.push([q[0] + Math.sin(a2) * hw, q[1] - Math.cos(a2) * hw]); });
    return "M" + L2.concat(R2.reverse()).map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L") + " Z";
  };
  const mid = "rf" + ++SVGN;
  const mk = document.createElementNS(NS, "mask");
  mk.setAttribute("id", mid); mk.setAttribute("maskUnits", "userSpaceOnUse");
  ["x", "y"].forEach((a2) => mk.setAttribute(a2, "-60000")); ["width", "height"].forEach((a2) => mk.setAttribute(a2, "200000"));
  const mp = document.createElementNS(NS, "path");
  mp.setAttribute("d", "M" + PB.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L"));
  mp.setAttribute("fill", "none"); mp.setAttribute("stroke", "#fff"); mp.setAttribute("stroke-width", 90); mp.setAttribute("stroke-linecap", "round");
  mp.setAttribute("stroke-dasharray", `${LB.toFixed(1)} ${LB.toFixed(1)}`); mp.setAttribute("stroke-dashoffset", LB.toFixed(1));
  mk.appendChild(mp); S._defs.appendChild(mk);
  const neonG = document.createElementNS(NS, "g");
  neonG.setAttribute("mask", `url(#${mid})`);
  S.appendChild(neonG);
  const glowR = pathEl(neonG, ribbon(PB, 30, 5), { fill: K.lime });
  glowR.style.filter = "drop-shadow(0 0 14px rgba(207,251,80,.95)) drop-shadow(0 0 40px rgba(207,251,80,.55))";
  const coreR = pathEl(neonG, ribbon(PB, 11, 2), { fill: "#f4ffd6" });
  // pallina coi fari (reel 79 a 58 s): disco bianco luminoso + cono di luce nella direzione di marcia
  const ball = layered(el(parent, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: z + 3, pointerEvents: "none" }));
  const beam = el(ball, { position: "absolute", left: 0, top: -70, width: 260, height: 140, transformOrigin: "0 50%", background: "linear-gradient(90deg, rgba(255,255,255,.75), rgba(255,255,255,.18) 60%, rgba(255,255,255,0))", clipPath: "polygon(0 44%, 100% 0, 100% 100%, 0 56%)", filter: "blur(3px)" });
  el(ball, { position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #f2f2f2 55%, #cfcfcf)", boxShadow: "0 0 18px #fff, 0 0 46px rgba(255,255,255,.55)" });
  gsap.set(ball, { x: PA[0][0], y: PA[0][1], opacity: 0 });
  // etichette alle due estremità
  const lab = (o.labels || []).map((tx, i) => {
    const e2 = i ? PB[NB] : PA[NA];
    // la strada attesa ha l'etichetta a sinistra della sua fine, la finta a destra: non si toccano mai
    const l = el(parent, { position: "absolute", left: i ? e2[0] - 60 : e2[0] - 600, top: e2[1] - fs * 2.7, width: 660, textAlign: i ? "left" : "right", zIndex: z + 2 });
    el(l, { display: "inline-block", padding: `${Math.round(fs * 0.35)}px ${Math.round(fs * 0.7)}px`, borderRadius: 16, background: "linear-gradient(180deg, rgba(56,56,56,.95), rgba(28,28,28,.97))", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 14px 30px rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, whiteSpace: "nowrap" }, tx, "span");
    gsap.set(l, { opacity: 0 });
    return l;
  });
  const put = (P, S2, L2, f) => { const q = atS(P, S2, L2 * f), k = 1 - 0.68 * Math.pow(depth(q[1]), 0.8); gsap.set(ball, { x: q[0], y: q[1], scale: k }); gsap.set(beam, { rotation: (q[2] * 180) / Math.PI }); };
  return {
    rect: [cx - w * 0.62, by - h - fs * 3, cx + w * 0.72, by + 40],
    endA: PA[NA], endB: PB[NB], split: [B0[0], B0[1]],
    // la strada si disegna dal basso (trattini in sequenza) e i bordi con lei; il neon parte dal bivio un filo dopo
    draw: (t, dur) => {
      dur = dur || 0.8;
      dashes.forEach((d) => tl.to(d.p, { opacity: 1, duration: 0.08 }, t + d.f * dur));
      edges.forEach((p) => drawOn(p, t, dur, "power1.out"));
      tl.to(mp, { attr: { "stroke-dashoffset": 0 }, duration: dur * 0.9, ease: "power2.out" }, t + dur * SP * 0.8);
      lab.forEach((l, i) => blurIn(l, t + dur * (0.75 + i * 0.15), { y: 10, blur: 8, dur: 0.3 }));
    },
    // la pallina percorre la strada fino al bivio e poi prende la finta (o.finta = false: tira dritto)
    drive: (t, dur, oo) => {
      oo = oo || {};
      const finta = oo.finta !== false, f1 = SP, V = { u: 0 };
      tl.to(ball, { opacity: 1, duration: 0.15 }, t);
      tl.fromTo(V, { u: 0 }, { u: 1, duration: dur, ease: "power1.inOut", immediateRender: false, onUpdate: () => {
        const u = V.u, cut = finta ? 0.42 : 1;
        if (u <= cut) put(PA, SA, LA, (u / cut) * (finta ? f1 : 1));
        else put(PB, SB, LB, (u - cut) / (1 - cut));
      } }, t);
    },
    // la finta si accende: neon più forte, la strada attesa si spegne, l'etichetta della finta diventa lime
    choose: (t) => {
      tl.to(coreR, { attr: { fill: "#ffffff" }, duration: 0.12 }, t);
      tl.fromTo(glowR, { filter: "drop-shadow(0 0 14px rgba(207,251,80,.95)) drop-shadow(0 0 40px rgba(207,251,80,.55))" }, { filter: "drop-shadow(0 0 22px rgba(207,251,80,1)) drop-shadow(0 0 70px rgba(207,251,80,.75))", duration: 0.2, immediateRender: false }, t);
      tl.to([...dashes.map((d) => d.p), ...edges], { opacity: 0.28, duration: 0.35 }, t);
      if (lab[1]) tl.to(lab[1].firstChild, { background: limeFill(1), color: K.ink, boxShadow: GLOW_A(0.7), duration: 0.2 }, t);
      if (lab[0]) tl.to(lab[0], { opacity: 0.35, duration: 0.3 }, t);
      pulse(parent, B0[0], B0[1], t, { r: 66, z: z + 4 });
    },
  };
};

// D13 · termometro verticale (reel 72, 111): tubo di vetro col bulbo in basso, il lime pieno sale fino al livello; si mette accanto
// alla scala (O07). (x, yTop, yBot) = asse e estremi del tubo · o: { w (46), etichette: [basso, alto], fs (26), z }
// → { show(t), to(t, f, dur, ease), tube, fill, bulb, lab, tipY(f) } · ease: default power2.inOut; con le regole del ritmo
// (R6) un riempimento solo e continuo, ease "none" (reel 72: lineare, 2,25 s) — vedi TPL.D13 in kit2-template.js
const thermo = (parent, x, yTop, yBot, o) => {
  o = o || {};
  const w = o.w || 46, z = o.z || 12, H = yBot - yTop, bd = w * 1.9;
  const tube = el(parent, { position: "absolute", left: x - w / 2, top: yTop, width: w, height: H, borderRadius: w / 2, background: "linear-gradient(90deg, rgba(255,255,255,.14), rgba(255,255,255,.05) 40%, rgba(255,255,255,.1))", border: "2px solid rgba(255,255,255,.55)", boxShadow: "0 0 18px rgba(255,255,255,.15)", overflow: "hidden", zIndex: z });
  const fill = el(tube, { position: "absolute", left: 5, right: 5, bottom: 4, height: H - 8, borderRadius: w / 2, background: "linear-gradient(90deg,#a6d332,#e8ff9c 40%,#CFFB50 60%,#9fca2c)", boxShadow: GLOW_A(0.6), transformOrigin: "50% 100%" });
  const bulb = el(parent, { position: "absolute", left: x - bd / 2, top: yBot - bd * 0.35, width: bd, height: bd, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #f6ffd8, #CFFB50 55%, #8fb829)", border: "2px solid rgba(255,255,255,.6)", boxShadow: GLOW_A(0.8), zIndex: z + 1 });
  const lab = (o.etichette || []).map((tx, i) => el(parent, { position: "absolute", left: x - 140, top: i ? yTop - 54 : yBot + bd * 0.7, width: 280, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 26, color: i ? K.lime : "rgba(255,255,255,.7)", textShadow: i ? GLOW_LT : "none", whiteSpace: "nowrap", zIndex: z }, tx));
  gsap.set(fill, { scaleY: 0 });
  gsap.set([tube, bulb, ...lab], { opacity: 0 });
  return {
    tube, fill, bulb, lab,
    tipY: (f) => yBot - 4 - f * (H - 8), // quota nel mondo della punta del lime al livello f
    show: (t) => { tl.to([tube, bulb], { opacity: 1, duration: 0.3 }, t); lab.forEach((l, i) => blurIn(l, t + 0.1 + i * 0.1, { y: 8, blur: 8, dur: 0.3 })); },
    to: (t, f, dur, ease) => tl.to(fill, { scaleY: f, duration: dur || 0.6, ease: ease || "power2.inOut" }, t),
  };
};

// O27 · amo che aggancia (reel 100 di Kallaway, "Hook-Lean-Snap"; anche reel 76): una cornice con dentro la canna (due puntini
// lime, come i suoi gialli), la lenza che si arcua dalla punta e l'amo d'acciaio che scende sull'arco nell'acqua scura a bande con
// le onde che scorrono. Chi scorre (volto vero) nuota con la scia verso l'amo, abbocca e viene strappato fuori dall'acqua con gli
// schizzi; la canna si piega e torna. Altri volti nuotano dietro e non abboccano.
// (cx, cy) = centro della cornice · o: { w (900), h (980), d (volto, 120), volto, altri (0), z }
// → { rect, show(t), cast(t, dur), swim(t, dur), snap(t) }
const hookCatch = (parent, cx, cy, o) => {
  o = o || {};
  const W = o.w || 900, H = o.h || 980, d = o.d || 120, z = o.z || 14;
  const X0 = cx - W / 2, Y0 = cy - H / 2;
  const card = el(parent, { position: "absolute", left: X0, top: Y0, width: W, height: H, borderRadius: 40, overflow: "hidden", background: "linear-gradient(180deg, #121212 0%, #0d0d0d 100%)", border: "2px solid rgba(255,255,255,.28)", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 40px rgba(255,255,255,.06)", zIndex: z });
  card.setAttribute("data-layout-allow-overlap", "");
  // acqua: tre bande che scorrono (onde sinusoidali in SVG, traslate in orizzontale), cresta chiara in cima
  const WY = H * 0.6; // pelo dell'acqua nella cornice
  const SW = svgIn(card, W, H);
  const wave = (y0, amp, len, col, k) => {
    let dd = `M${-len} ${H}`;
    for (let x = -len; x <= W + len; x += 10) dd += ` L${x} ${(y0 + Math.sin((x / len) * Math.PI * 2 + k) * amp).toFixed(1)}`;
    dd += ` L${W + len} ${H} Z`;
    return pathEl(SW, dd, { fill: col });
  };
  const W1 = wave(WY, 14, 260, "#18343a", 0), W2 = wave(WY + 46, 18, 300, "#1d4a52", 1.7), W3 = wave(WY + 120, 12, 240, "#173c43", 3.1);
  let cd = "";
  for (let x = -260; x <= W + 260; x += 10) cd += `${cd ? "L" : "M"}${x} ${(WY + Math.sin((x / 260) * Math.PI * 2) * 14).toFixed(1)} `;
  const crest = pathEl(SW, cd, { fill: "none", stroke: "rgba(255,255,255,.55)", "stroke-width": 3 });
  crest.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.5))";
  // canna (dritta, bianca) con il manico e la punta lime; lenza lime che si arcua dalla punta all'amo
  const HX = W * 0.1, HY = H * 0.48, TX = W * 0.3, TY = H * 0.18;
  const rod = pathEl(SW, `M${HX} ${HY} L${TX} ${TY}`, { stroke: "#ffffff", "stroke-width": 7, "stroke-linecap": "round" });
  rod.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,.6))";
  const dots = [[HX, HY], [TX, TY]].map(([x, y]) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 13); c.setAttribute("fill", K.lime);
    c.style.filter = "drop-shadow(0 0 10px rgba(207,251,80,.9))";
    SW.appendChild(c);
    return c;
  });
  const AX = W * 0.62; // dove scende l'amo
  const line = pathEl(SW, "M0 0", { fill: "none", stroke: K.lime, "stroke-width": 5, "stroke-linecap": "round" });
  line.style.filter = "drop-shadow(0 0 8px rgba(207,251,80,.85))";
  // amo d'acciaio disegnato: occhiello, gambo, curva a J con l'ardiglione; gradiente argento
  const hook = layered(el(card, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 6 }));
  const HS = svgIn(hook, 1, 1);
  const hg = "hk" + ++SVGN;
  HS._defs.insertAdjacentHTML("beforeend", `<linearGradient id="${hg}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d9196"/><stop offset=".45" stop-color="#ffffff"/><stop offset=".7" stop-color="#c9cdd2"/><stop offset="1" stop-color="#6c7075"/></linearGradient>`);
  const hk = pathEl(HS, "M0 -10 L0 58 C0 96 -48 96 -48 62 L-48 50 L-38 64", { fill: "none", stroke: `url(#${hg})`, "stroke-width": 11, "stroke-linecap": "round", "stroke-linejoin": "round" });
  hk.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,.55))";
  const eye = document.createElementNS(NS, "circle");
  eye.setAttribute("cx", 0); eye.setAttribute("cy", -20); eye.setAttribute("r", 10); eye.setAttribute("fill", "none"); eye.setAttribute("stroke", `url(#${hg})`); eye.setAttribute("stroke-width", 6);
  HS.appendChild(eye);
  // posizione dell'amo (aggiorna lenza, canna e punta): bend = quanto si piega la canna nello strappo
  const P = { x: TX + 40, y: TY + 30, bend: 0 };
  const setLine = () => {
    gsap.set(hook, { x: P.x, y: P.y });
    const tx = TX + P.bend * 40, ty = TY + P.bend * 60;
    const mx = (tx + P.x) / 2 + 60 * (1 - P.bend), my = Math.min(ty, P.y) - 40 * (1 - P.bend);
    line.setAttribute("d", `M${tx.toFixed(1)} ${ty.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${P.x.toFixed(1)} ${(P.y - 30).toFixed(1)}`);
    rod.setAttribute("d", `M${HX} ${HY} L${tx.toFixed(1)} ${ty.toFixed(1)}`);
    dots[1].setAttribute("cx", tx.toFixed(1)); dots[1].setAttribute("cy", ty.toFixed(1));
  };
  setLine();
  // chi scorre: volto vero con la scia; gli altri nuotano più in fondo e più piccoli
  const mkFace = (dd, i) => {
    const f = layered(el(card, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 5 }));
    faceDot(f, -dd / 2, -dd / 2, dd, i, "atlas-muro", { bw: 3 });
    gsap.set(f, { opacity: 0 });
    return f;
  };
  const others = Array.from({ length: o.altri || 0 }, (_, i) => {
    const od = d * (0.55 + 0.2 * Math.abs(hash(i, 61))), oy = WY + 150 + (i % 3) * 90 + hash(i, 63) * 20, ox = W * (0.12 + ((i * 0.37) % 1) * 0.76);
    const f = mkFace(od, 40 + i * 17);
    gsap.set(f, { x: ox, y: oy });
    return { f, ox, oy, dir: i % 2 ? -1 : 1 };
  });
  const fish = mkFace(d, o.volto == null ? 21 : o.volto);
  const FY = WY + 110, FX0 = W * 0.08;
  gsap.set(fish, { x: FX0, y: FY });
  const wake = pathEl(SW, `M${FX0 - 140} ${FY + 26} Q${FX0 - 60} ${FY + 40} ${FX0} ${FY + 26}`, { fill: "none", stroke: "rgba(255,255,255,.75)", "stroke-width": 3, "stroke-linecap": "round", opacity: 0 });
  gsap.set(card, { opacity: 0 });
  const waves = [W1, W2, W3, crest];
  return {
    rect: [X0 - 20, Y0 - 20, X0 + W + 20, Y0 + H + 20],
    show: (t) => {
      tl.fromTo(card, { opacity: 0, scale: 0.94, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, t);
      // onde che scorrono per tutta la scena (sensi alterni, deterministiche)
      waves.forEach((p, i) => tl.fromTo(p, { x: 0 }, { x: (i % 2 ? -1 : 1) * 260, duration: 6, ease: "none", immediateRender: false }, t));
      others.forEach((q, i) => { tl.to(q.f, { opacity: 0.55, duration: 0.3 }, t + 0.2 + i * 0.05); tl.to(q.f, { x: q.ox + q.dir * 140, duration: 5.5, ease: "sine.inOut" }, t + 0.2); });
    },
    // lancio: l'amo scende sull'arco dalla punta della canna fin sott'acqua (0,6 s), la lenza lo segue
    cast: (t, dur) => {
      dur = dur || 0.6;
      tl.fromTo(P, { x: TX + 40, y: TY + 30 }, { x: AX, y: WY + 100, duration: dur, ease: "power2.inOut", onUpdate: setLine, immediateRender: false }, t);
      ripple(card, AX, WY, t + dur * 0.7, { wd: 160, ht: 36, s0: 0.3, s1: 1.4, w: 3, color: "rgba(255,255,255,.8)", glow: false, z: 7, dur: 0.6 });
    },
    // nuota verso l'amo con la scia (onda deterministica)
    swim: (t, dur) => {
      tl.to(fish, { opacity: 1, duration: 0.25 }, t);
      tl.to(wake, { attr: { opacity: 1 }, duration: 0.2 }, t);
      const n = 8, tx = AX - d * 0.55;
      for (let k = 1; k <= n; k++) {
        const f = k / n, x = FX0 + (tx - FX0) * f, y = FY + Math.sin(f * Math.PI * 2.5) * 18;
        tl.to(fish, { x, y, rotation: Math.cos(f * Math.PI * 2.5) * 7, duration: dur / n, ease: "sine.inOut" }, t + (k - 1) * (dur / n));
        tl.to(wake, { attr: { d: `M${(x - 150).toFixed(1)} ${(y + 26).toFixed(1)} Q${(x - 70).toFixed(1)} ${(y + 44).toFixed(1)} ${(x - d * 0.4).toFixed(1)} ${(y + 24).toFixed(1)}` }, duration: dur / n, ease: "sine.inOut" }, t + (k - 1) * (dur / n));
      }
      tl.to(P, { x: AX + 6, duration: dur * 0.5, ease: "sine.inOut", yoyo: true, repeat: 1, onUpdate: setLine }, t);
    },
    // abbocca (piccolo strattone), poi lo strappo: la canna si piega, amo e volto escono dall'acqua con gli schizzi
    snap: (t) => {
      tl.to(fish, { x: AX - d * 0.18, y: WY + 140, rotation: 0, duration: 0.12, ease: "power2.out" }, t);
      tl.to(wake, { attr: { opacity: 0 }, duration: 0.15 }, t);
      tl.to(P, { y: WY + 118, duration: 0.08, ease: "power2.out", onUpdate: setLine }, t + 0.12);
      tl.to(P, { x: AX - 120, y: WY - 300, bend: 1, duration: 0.36, ease: "power3.in", onUpdate: setLine }, t + 0.22);
      tl.to(fish, { x: AX - 120 - d * 0.18, y: WY - 260, rotation: -16, duration: 0.36, ease: "power3.in" }, t + 0.22);
      tl.to(P, { bend: 0.35, duration: 0.5, ease: "back.out(2)", onUpdate: setLine }, t + 0.6);
      for (let i = 0; i < 12; i++) {
        const a = -Math.PI / 2 + hash(i, 13) * 1.3, sp = 110 + Math.abs(hash(i, 4)) * 180;
        const dd = el(card, { position: "absolute", left: AX - 9, top: WY - 9, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #d6eef2 60%, rgba(255,255,255,.4))", opacity: 0, zIndex: 8 });
        tl.set(dd, { opacity: 1 }, t + 0.42);
        tl.to(dd, { x: Math.cos(a) * sp * 0.9, duration: 0.6, ease: "power1.out" }, t + 0.42);
        tl.to(dd, { y: Math.sin(a) * sp, duration: 0.3, ease: "power2.out" }, t + 0.42);
        tl.to(dd, { y: 40, opacity: 0, duration: 0.3, ease: "power2.in" }, t + 0.72);
      }
      ripple(card, AX - 40, WY, t + 0.42, { wd: 420, ht: 70, s0: 0.3, s1: 1.4, w: 3, color: "rgba(255,255,255,.85)", glow: false, z: 7, dur: 0.7 });
      shake(t + 0.42, 8, 4);
    },
  };
};

// O26 · figura umana 3D con il telefono (reel 18, 52, 62 di Kallaway). In Kallaway non è una persona riconoscibile: è un
// manichino bianco opaco, liscio come gesso, di profilo, chino sul telefono, con l'alone morbido e il busto che sfuma in basso.
// obj-manichino = Adobe Stock 140421534 ("Incorrect posture concept", scontorno di Photoshop) passato da _tools/manichino.py.
// Guarda a sinistra (con {flip: true} a destra): il telefono grande con lo schermo vero va dal lato in cui guarda (reel 18).
// Gesti misurati sui reel:
//   .show(t)    entra di lato in corsa e va a fuoco (reel 62, 0,45 s)
//   .screen(t)  lo schermo si accende e illumina il viso (luce lime morbida sul volto e sulle mani)
//   .dot(t)     un punto lime compare sulla testa (reel 52 a 23,8 s: "confuso")
//   .focus(t)   una lente sulla testa: disco scuro trasparente col bordo lime, arriva in 0,15 s, resta, svanisce allargandosi (reel 52)
//   .pulse(t)   disco grafite col bordo lime dietro tutta la figura, nasce e svanisce allargandosi (reel 62 a 3,05 s)
//   .away(t)    se ne va: si spegne in grigio e scivola via (il "bounce" del reel 52)
// cx = centro dell'immagine · base = fondo (il busto sfuma) · h = altezza dell'immagine · o: { flip, z }
// → { g, rect, headXY(), headR, phoneXY(), show, screen, dot, focus, pulse, away }
const FIG_GEO = { ar: 2089 / 2200, head: [0.305, 0.245, 0.165], phone: [0.168, 0.673], box: [0.084, 0.082, 0.916, 0.814] };
const figure3d = (parent, cx, base, h, o) => {
  o = o || {};
  const z = o.z || 12, w = h * FIG_GEO.ar, X0 = cx - w / 2, Y0 = base - h;
  const fx = (u) => X0 + (o.flip ? 1 - u : u) * w, fy = (v) => Y0 + v * h;
  const g = layered(el(parent, { position: "absolute", left: X0, top: Y0, width: w, height: h, zIndex: z }));
  const im = imgIn(g, "obj-manichino", { objectFit: "contain" });
  if (o.flip) im.style.transform = "scaleX(-1)";
  const [hu, hv, hr] = FIG_GEO.head, HX = fx(hu), HY = fy(hv), HR = hr * h;
  const PX = fx(FIG_GEO.phone[0]), PY = fy(FIG_GEO.phone[1]);
  // luce dello schermo: alone lime morbido sul volto e sulle mani (dentro il gruppo, sopra al manichino, in modalità screen)
  const spill = el(g, { position: "absolute", left: PX - X0 - w * 0.2, top: PY - Y0 - h * 0.34, width: w * 0.46, height: h * 0.46, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(207,251,80,.5), rgba(207,251,80,.16) 55%, rgba(207,251,80,0))", mixBlendMode: "screen", opacity: 0 });
  const scr = el(g, { position: "absolute", left: PX - X0 - w * 0.085, top: PY - Y0 - h * 0.022, width: w * 0.17, height: h * 0.044, borderRadius: 10, background: "radial-gradient(closest-side, rgba(240,255,200,.95), rgba(207,251,80,.55) 60%, rgba(207,251,80,0))", mixBlendMode: "screen", opacity: 0 });
  // punto sulla testa (tempia) e lente sulla testa
  const dotD = Math.max(18, HR * 0.16);
  const dot = el(parent, { position: "absolute", left: HX + (o.flip ? -1 : 1) * HR * 0.12 - dotD / 2, top: HY - HR * 0.18 - dotD / 2, width: dotD, height: dotD, borderRadius: "50%", background: K.lime, boxShadow: GLOW_A(1), opacity: 0, zIndex: z + 3 });
  const lens = el(parent, { position: "absolute", left: HX - HR * 1.12, top: HY - HR * 1.12, width: HR * 2.24, height: HR * 2.24, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, rgba(20,20,20,.14), rgba(20,20,20,.34) 70%, rgba(20,20,20,.5))", border: `${Math.max(5, Math.round(HR * 0.03))}px solid ${K.lime}`, boxShadow: `${GLOW_A(0.9)}, inset 0 0 40px rgba(207,251,80,.25)`, opacity: 0, zIndex: z + 2, pointerEvents: "none" });
  [dot, lens].forEach((n) => n.setAttribute("data-layout-allow-overlap", ""));
  const bx = FIG_GEO.box, R0 = [fx(o.flip ? bx[2] : bx[0]), fy(bx[1]), fx(o.flip ? bx[0] : bx[2]), fy(bx[3])];
  gsap.set(g, { opacity: 0 });
  return {
    g, headR: HR,
    rect: [R0[0] - 20, R0[1] - 30, R0[2] + 20, base - h * 0.08],
    headXY: () => [HX, HY],
    phoneXY: () => [PX, PY],
    show: (t, oo) => {
      oo = oo || {};
      const dx = oo.dx == null ? (o.flip ? -1 : 1) * w * 0.35 : oo.dx;
      tl.fromTo(g, { opacity: 0, x: dx, filter: "blur(14px)" }, { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out", immediateRender: false }, t);
      tl.set(g, { filter: "none" }, t + 0.46);
    },
    screen: (t) => { tl.to(scr, { opacity: 1, duration: 0.12 }, t); tl.to(spill, { opacity: 1, duration: 0.35, ease: "power2.out" }, t + 0.04); },
    dot: (t) => tl.fromTo(dot, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.18, ease: "back.out(3)", immediateRender: false }, t),
    focus: (t, hold) => {
      hold = hold == null ? 0.35 : hold;
      tl.fromTo(lens, { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 0.15, ease: "expo.out", immediateRender: false }, t);
      tl.to(lens, { opacity: 0, scale: 1.18, duration: 0.3, ease: "power1.in" }, t + 0.15 + hold);
    },
    pulse: (t, oo) => {
      oo = oo || {};
      const r = oo.r || h * 0.42, PCX = fx(0.52), PCY = fy(0.44);
      const d = el(parent, { position: "absolute", left: PCX - r, top: PCY - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, rgba(58,58,58,.55), rgba(26,26,26,.6) 72%)", border: `${Math.max(5, Math.round(r * 0.018))}px solid ${K.lime}`, boxShadow: GLOW_A(0.9), opacity: 0, zIndex: z - 1, pointerEvents: "none" });
      d.setAttribute("data-layout-allow-overlap", "");
      gsap.set(d, { scale: 0.5 });
      tl.set(d, { opacity: 1 }, t);
      tl.to(d, { scale: 1, duration: 0.14, ease: "expo.out" }, t);
      tl.to(d, { scale: 1.14, opacity: 0, duration: 0.4, ease: "power1.in" }, t + 0.26);
      return d;
    },
    away: (t) => {
      tl.to([scr, spill, dot], { opacity: 0, duration: 0.25 }, t);
      tl.to(g, { x: (o.flip ? -1 : 1) * w * 0.3, opacity: 0.35, filter: "grayscale(1) brightness(.55)", duration: 0.6, ease: "power2.in" }, t);
    },
  };
};

// F10 · muro di mattoni (reel 40 di Kallaway: "il muro" da mostrare o buttare giù): mattoni in grafite lucida a file sfalsate che
// si montano dal basso (.build), si accendono di luce (.light) o esplodono in pezzi che volano via ruotando (.blast) lasciando
// vedere cosa c'era dietro. x0, y0 = angolo in alto a sinistra · cols × rows · o: { bw (150), bh (66), gap (8), z }
// → { g, bricks, rect, build(t, dur), blast(t, {cx, cy, power}), grey(t) }
const brickWall = (parent, x0, y0, cols, rows, o) => {
  o = o || {};
  const bw = o.bw || 150, bh = o.bh || 66, gap = o.gap || 8, z = o.z || 14;
  const W = cols * (bw + gap) - gap, H = rows * (bh + gap) - gap;
  const g = el(parent, { position: "absolute", left: x0, top: y0, width: W, height: H, zIndex: z });
  const bricks = [];
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? -bw / 2 : 0;
    for (let c = 0; c < cols + (r % 2 ? 1 : 0); c++) {
      let x = off + c * (bw + gap), w = bw;
      if (x < 0) { w += x; x = 0; }
      if (x + w > W) w = W - x;
      if (w < 20) continue;
      const y = H - (r + 1) * (bh + gap) + gap;
      const b = el(g, { position: "absolute", left: x, top: y, width: w, height: bh, borderRadius: 8, background: "linear-gradient(180deg,#5a5a5a 0%,#3a3a3a 18%,#2a2a2a 62%,#1d1d1d 100%)", border: "1.5px solid rgba(255,255,255,.16)", boxShadow: "inset 0 2px 0 rgba(255,255,255,.22), 0 10px 22px rgba(0,0,0,.45)" });
      gsap.set(b, { opacity: 0 });
      bricks.push({ b, r, c, x: x0 + x + w / 2, y: y0 + y + bh / 2, k: bricks.length });
    }
  }
  return {
    g, bricks, rect: [x0, y0, x0 + W, y0 + H],
    // i mattoni cadono al loro posto, fila per fila dal basso
    build: (t, dur) => {
      dur = dur || 0.8;
      const n = bricks.length;
      bricks.forEach((q, i) => {
        const tt = t + (q.r / rows) * dur * 0.85 + ((hash(i, 5) + 1) / 2) * dur * 0.12;
        tl.fromTo(q.b, { opacity: 0, y: -90 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.in", immediateRender: false }, tt);
      });
    },
    // esplosione dal punto (cx, cy): ogni mattone vola via in fuori ruotando e svanisce (power2.out), con la scossa
    blast: (t, oo) => {
      oo = oo || {};
      const cx = oo.cx == null ? x0 + W / 2 : oo.cx, cy = oo.cy == null ? y0 + H / 2 : oo.cy, pw = oo.power || 900;
      bricks.forEach((q, i) => {
        const dx = q.x - cx, dy = q.y - cy, d = Math.max(60, Math.hypot(dx, dy)), k = (pw * (0.7 + 0.5 * Math.abs(hash(i, 9)))) / Math.sqrt(d);
        const tt = t + (d / 2400) + Math.abs(hash(i, 3)) * 0.04;
        tl.to(q.b, { x: (dx / d) * k * 22, y: (dy / d) * k * 22 + 260, rotation: hash(i, 7) * 220, opacity: 0, duration: 0.85, ease: "power2.out" }, tt);
      });
      shake(t, 16, 7);
    },
    grey: (t) => tl.to(bricks.map((q) => q.b), { filter: "grayscale(1) brightness(.6)", duration: 0.3 }, t),
    // riavvolgi: i mattoni tornano al loro posto (dopo .blast), in fretta e con la scia
    rewind: (t, dur) => {
      dur = dur || 0.55;
      bricks.forEach((q, i) => tl.to(q.b, { x: 0, y: 0, rotation: 0, opacity: 1, duration: dur, ease: "power3.inOut" }, t + Math.abs(hash(i, 21)) * 0.08));
      mblurV(t, dur + 0.08, "power3.inOut", 10, "xy");
    },
  };
};

// ═══ per il reel 09/10 (anche riusabili) ═══════════════════════════════════════════════════════════════════════════════

// D · indicatore a lancetta (gauge): semicerchio d'acciaio con le tacche e la scala dal grafite al lime (colori pieni), lancetta
// bianca con la punta lime e il perno; .to(t, f, dur) porta la lancetta alla frazione f (0 = sinistra, 1 = destra), .shake(t)
// la fa tremare sul posto (bloccata). cx, cy = perno · r = raggio · o: { etichetta, z } → { g, rect, show(t), to(t, f, dur), shake(t, dur) }
const gauge = (parent, cx, cy, r, o) => {
  o = o || {};
  const z = o.z || 13, W = r * 2 + 80, H = r + 140;
  const g = layered(el(parent, { position: "absolute", left: cx - W / 2, top: cy - r - 40, width: W, height: H, zIndex: z }));
  const SV = svgIn(g, W, H);
  const ox = W / 2, oy = r + 40;
  const P = (a, rr) => [ox + Math.cos(a) * rr, oy + Math.sin(a) * rr];
  // ghiera
  const gid = "ga" + ++SVGN;
  SV._defs.insertAdjacentHTML("beforeend", `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f2f2"/><stop offset=".35" stop-color="#8a8a8a"/><stop offset=".6" stop-color="#d6d6d6"/><stop offset="1" stop-color="#5a5a5a"/></linearGradient>`);
  const arcD = (rr) => { const [x0, y0] = P(Math.PI, rr), [x1, y1] = P(0, rr); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rr} ${rr} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  pathEl(SV, arcD(r + 18), { fill: "none", stroke: `url(#${gid})`, "stroke-width": 22, "stroke-linecap": "round" }).style.filter = "drop-shadow(0 18px 30px rgba(0,0,0,.55))";
  pathEl(SV, arcD(r - 6), { fill: "none", stroke: "#141414", "stroke-width": 40 });
  // scala a settori (grafite → lime, pieni)
  const n = 10;
  for (let k = 0; k < n; k++) {
    const a0 = Math.PI + (k / n) * Math.PI + 0.02, a1 = Math.PI + ((k + 1) / n) * Math.PI - 0.02, f = k / (n - 1);
    const col = `rgb(${[62, 62, 62].map((v, i) => Math.round(v + ([207, 251, 80][i] - v) * f)).join(",")})`;
    const [x0, y0] = P(a0, r - 6), [x1, y1] = P(a1, r - 6);
    pathEl(SV, `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r - 6} ${r - 6} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`, { fill: "none", stroke: col, "stroke-width": 26 });
  }
  for (let k = 0; k <= 20; k++) { const a = Math.PI + (k / 20) * Math.PI, l = k % 5 ? 14 : 30; const [x0, y0] = P(a, r - 34), [x1, y1] = P(a, r - 34 - l); pathEl(SV, `M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)}`, { stroke: k % 5 ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.85)", "stroke-width": k % 5 ? 2.5 : 4, "stroke-linecap": "round" }); }
  // lancetta (ruota attorno al perno: holder con l'origine nel perno)
  const arm = el(g, { position: "absolute", left: ox, top: oy, width: 1, height: 1, zIndex: 3 });
  el(arm, { position: "absolute", left: -6, top: -(r - 30), width: 12, height: r - 30, borderRadius: 6, background: "linear-gradient(180deg, #CFFB50 0%, #CFFB50 22%, #ffffff 23%, #dcdcdc 100%)", boxShadow: "0 0 14px rgba(255,255,255,.5)" });
  el(g, { position: "absolute", left: ox - 26, top: oy - 26, width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #ffffff, #9a9a9a 55%, #4a4a4a)", boxShadow: "0 6px 14px rgba(0,0,0,.6)", zIndex: 4 });
  const lab = o.etichetta ? el(g, { position: "absolute", left: 0, top: oy + 46, width: W, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(r * 0.16), color: "rgba(255,255,255,.85)", whiteSpace: "nowrap", zIndex: 4 }, o.etichetta) : null;
  gsap.set(arm, { rotation: -90 });
  gsap.set(g, { opacity: 0 });
  return {
    g, rect: [cx - W / 2, cy - r - 40, cx + W / 2, cy + 120],
    show: (t) => tl.fromTo(g, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t),
    to: (t, f, dur, ease) => tl.to(arm, { rotation: -90 + f * 180, duration: dur || 0.6, ease: ease || "power3.out" }, t),
    shake: (t, dur) => { const k = Math.round((dur || 0.4) / 0.05); for (let i = 0; i < k; i++) tl.to(arm, { rotation: `-=${i % 2 ? -3 : 3}`, duration: 0.05, ease: "none" }, t + i * 0.05); },
  };
};

// F10 · cupola di vetro che si frantuma (il "carcere" di una convinzione): una cupola di vetro (bordo chiaro, riflesso) fatta di
// schegge a ventaglio; .close(t) le schegge arrivano e la chiudono, .shatter(t) esplodono in fuori ruotando con le scintille.
// cx, cy = centro · r = raggio · o: { n (14 schegge), z } → { g, rect, close(t), shatter(t) }
const glassCage = (parent, cx, cy, r, o) => {
  o = o || {};
  const n = o.n || 14, z = o.z || 18, D = 2 * r;
  const g = layered(el(parent, { position: "absolute", left: cx - r, top: cy - r, width: D, height: D, zIndex: z, pointerEvents: "none" }));
  g.setAttribute("data-layout-allow-occlusion", "");
  const shards = [];
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * Math.PI * 2 + hash(k, 3) * 0.08, a1 = ((k + 1) / n) * Math.PI * 2 + hash(k + 1, 3) * 0.08;
    const ri = r * (0.0 + 0.12 * Math.abs(hash(k, 5)));
    const pts = [[r + Math.cos(a0) * ri, r + Math.sin(a0) * ri], [r + Math.cos(a0) * r * 1.02, r + Math.sin(a0) * r * 1.02], [r + Math.cos((a0 + a1) / 2) * r * 1.05, r + Math.sin((a0 + a1) / 2) * r * 1.05], [r + Math.cos(a1) * r * 1.02, r + Math.sin(a1) * r * 1.02], [r + Math.cos(a1) * ri, r + Math.sin(a1) * ri]];
    const poly = "polygon(" + pts.map(([x, y]) => `${((x / D) * 100).toFixed(2)}% ${((y / D) * 100).toFixed(2)}%`).join(", ") + ")";
    const s = el(g, { position: "absolute", left: 0, top: 0, width: D, height: D, clipPath: poly, background: "radial-gradient(circle at 36% 28%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.1) 38%, rgba(200,220,230,.06) 70%, rgba(255,255,255,.2) 100%)", borderRadius: "50%" });
    shards.push({ s, a: (a0 + a1) / 2, k });
  }
  const rim = el(g, { position: "absolute", left: 0, top: 0, width: D, height: D, borderRadius: "50%", border: "4px solid rgba(255,255,255,.75)", boxShadow: "0 0 26px rgba(255,255,255,.35), inset 0 0 40px rgba(255,255,255,.18)", boxSizing: "border-box" });
  const glint = el(g, { position: "absolute", left: r * 0.28, top: r * 0.18, width: r * 0.5, height: r * 0.22, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,255,255,.6), rgba(255,255,255,0))", transform: "rotate(-28deg)" });
  // crepe che compaiono un istante prima dell'esplosione
  const SV = svgIn(g, D, D);
  const cracks = [0, 1, 2, 3, 4, 5].map((k) => { const a = (k / 6) * Math.PI * 2 + 0.3; let d = `M${r} ${r}`; for (let j = 1; j <= 4; j++) { const rr = (j / 4) * r * 0.98, aa = a + hash(k * 10 + j, 9) * 0.25; d += ` L${(r + Math.cos(aa) * rr).toFixed(1)} ${(r + Math.sin(aa) * rr).toFixed(1)}`; } const p = pathEl(SV, d, { fill: "none", stroke: "rgba(255,255,255,.9)", "stroke-width": 2.5, "stroke-linejoin": "round" }); drawable(p); return p; });
  gsap.set(g, { opacity: 0 });
  return {
    g, rect: [cx - r - 20, cy - r - 20, cx + r + 20, cy + r + 20],
    // la cupola si chiude: le schegge arrivano da fuori (0,45 s) e il bordo si accende
    close: (t) => {
      tl.set(g, { opacity: 1 }, t);
      shards.forEach((q) => tl.fromTo(q.s, { x: Math.cos(q.a) * r * 0.9, y: Math.sin(q.a) * r * 0.9, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t + Math.abs(hash(q.k, 7)) * 0.1));
      tl.fromTo([rim, glint], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, t + 0.2);
    },
    // crepe (0,15 s) e poi esplosione: schegge in fuori che ruotano, il bordo sparisce, scossa e scintille
    shatter: (t) => {
      cracks.forEach((p) => drawOn(p, t, 0.15, "power2.out"));
      tl.to([rim, glint, ...cracks], { opacity: 0, duration: 0.12 }, t + 0.18);
      shards.forEach((q) => tl.to(q.s, { x: Math.cos(q.a) * r * (1.6 + Math.abs(hash(q.k, 11))), y: Math.sin(q.a) * r * (1.6 + Math.abs(hash(q.k, 13))) + 120, rotation: hash(q.k, 17) * 160, opacity: 0, duration: 0.8, ease: "power2.out" }, t + 0.18));
      sparks(parent, cx, cy, t + 0.18, { n: 16, len: 60, r0: r * 0.6, r1: r * 1.4, color: "#ffffff", z: z + 1 });
      shake(t + 0.18, 12, 6);
    },
  };
};

// ═══ Blocco 3 bis (10/10): le voci più usate rifatte da protagoniste (demo-8) ══════════════════════════════════════════════

// L09 · albero / flowchart che cresce (reel 3 di Kallaway, "The Formula Behind Winning Content"; anche 23 e 68): nodi a pill su
// righe, collegati con linee morbide che scendono dal genitore; ogni riga si disegna (linea 0,35 s, nodo 0,25 s, sfalsati) e la
// camera scende con la crescita. livelli: [{ nodi: [{t, p (indice del genitore nella riga sopra), lime}], cols (a capo dopo cols
// nodi), w (larghezza della riga) }] — il livello 0 è la radice. o: { dy (passo tra le righe, 200), w (960), fs (28), h (66), z }
// → { L (righe), grow(l, t, {step, dur}), light(l, i, t), nodeXY(l, i), rowRect(l0, l1), rect }
const flowTree = (parent, S, cx, y0, livelli, o) => {
  o = o || {};
  const fs = o.fs || 28, nh = o.h || 66, dy = o.dy || 200, z = o.z || 13, W0 = o.w || 960;
  let y = y0;
  const L = livelli.map((lv, l) => {
    const n = lv.nodi.length, cols = lv.cols || n, rows = Math.ceil(n / cols), w = lv.w || W0, cw = w / cols;
    const nodes = lv.nodi.map((nd, i) => {
      const r = Math.floor(i / cols), c = i % cols, inRow = Math.min(cols, n - r * cols);
      const x = cx - (inRow * cw) / 2 + (c + 0.5) * cw, yy = y + r * (nh + 34);
      const lime = nd.lime || l === 0;
      const b = el(parent, { position: "absolute", left: x - (cw - 16) / 2, top: yy, width: cw - 16, height: nh, borderRadius: nh / 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px", background: lime ? limeFill(1) : "linear-gradient(180deg, rgba(62,62,62,.97), rgba(32,32,32,.98))", border: lime ? "none" : "1.5px solid rgba(255,255,255,.22)", boxShadow: lime ? `${GLOW_A(0.7)}, 0 14px 30px rgba(0,0,0,.5)` : "0 14px 30px rgba(0,0,0,.5), inset 0 1.5px 0 rgba(255,255,255,.1)", fontFamily: FS, fontWeight: 800, fontSize: l === 0 ? Math.round(fs * 1.2) : fs, color: lime ? K.ink : K.white, whiteSpace: "nowrap", overflow: "hidden", zIndex: z }, nd.t);
      gsap.set(b, { opacity: 0, scale: 0.7 });
      return { b, x, y: yy, p: nd.p, cn: null };
    });
    const out = { nodes, y0: y, y1: y + rows * (nh + 34) - 34, w };
    y = out.y1 + dy;
    return out;
  });
  // collegamenti: dal fondo del genitore alla cima del figlio
  L.forEach((lv, l) => { if (!l) return; lv.nodes.forEach((nd) => { const pa = L[l - 1].nodes[nd.p || 0]; nd.cn = connector(S, [[pa.x, pa.y + nh], [nd.x, nd.y]], { curve: "v", color: "rgba(255,255,255,.7)", w: 3 }); }); });
  const minX = Math.min(...L.map((lv) => cx - lv.w / 2)), maxX = Math.max(...L.map((lv) => cx + lv.w / 2));
  return {
    L,
    rect: [minX - 20, y0 - 30, maxX + 20, L[L.length - 1].y1 + 30],
    rowRect: (a, b) => [minX - 20, L[a].y0 - 30, maxX + 20, L[b == null ? a : b].y1 + 30],
    nodeXY: (l, i) => [L[l].nodes[i].x, L[l].nodes[i].y + nh / 2],
    grow: (l, t, oo) => {
      oo = oo || {};
      const step = oo.step == null ? 0.06 : oo.step, dur = oo.dur || 0.35;
      L[l].nodes.forEach((nd, i) => {
        const tt = t + i * step;
        if (nd.cn) nd.cn.draw(tt, dur, "power2.out");
        tl.fromTo(nd.b, { opacity: 0, scale: 0.7, filter: "blur(6px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.25, ease: "back.out(2.2)", immediateRender: false }, tt + (nd.cn ? dur * 0.7 : 0));
        tl.set(nd.b, { filter: "none" }, tt + (nd.cn ? dur * 0.7 : 0) + 0.26);
      });
    },
    // accende un nodo (e la sua linea) di lime: il ramo che si segue
    light: (l, i, t) => {
      const nd = L[l].nodes[i];
      tl.to(nd.b, { background: limeFill(1), color: K.ink, borderColor: "rgba(0,0,0,0)", boxShadow: `${GLOW_A(0.8)}, 0 14px 30px rgba(0,0,0,.5)`, duration: 0.2 }, t);
      tl.fromTo(nd.b, { scale: 1.08 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, t);
      if (nd.cn) tl.to(nd.cn.p, { attr: { stroke: K.lime }, duration: 0.2 }, t);
    },
  };
};
