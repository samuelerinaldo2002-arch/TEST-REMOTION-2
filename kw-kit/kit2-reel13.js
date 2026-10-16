// ═══ KW kit v2 · reel 13/10 "Le storie in evidenza" (sotto-agente della regia, 11/10) ════════════════════════════════════════
// File a parte (variante "una chat per reel"): nessuna funzione esistente cambia, tutti i nomi hanno il suffisso R13.
// Grammatica del reel: la PROFONDITÀ — la camera entra ed esce dagli oggetti (i cerchi delle storie in evidenza sono oblò).
// - zoomR13: camera in profondità (scala esponenziale = velocità percepita costante; il punto scelto scorre dritto sullo schermo)
// - obloInR13 / obloOutR13: L'OBLÒ (nuova, nello stile di K07 zoom-through + K13 match cut): corsa dentro un cerchio del mondo,
//   taglio sotto un filo di sfocatura, dall'altra parte l'iride della "stanza" ha lo stesso posto e la stessa misura sullo
//   schermo e si apre con la cornice d'acciaio; la copertina del cerchio si dissolve nella storia. L'uscita è il gesto inverso.
// - evidenzaR13: un cerchio delle storie in evidenza · profiloR13: il tuo profilo visto da chi arriva, con la fila delle evidenze
// - pillMsgR13 (i messaggi ricevuti) · stickerR13 (testo delle storie) · domandaR13 (lo sticker "Fammi una domanda") ·
//   dubbiR13 (chi guarda con i suoi dubbi) · tastoMsgR13 (il tasto "Messaggio" col lucchetto) · primaDopoR13 · cartellinoR13 ·
//   recensioneR13 · vetrinaR13 · reelFeedR13 (il tuo reel nel feed) · dmR13 (la chat del DM)

// ── camera in profondità ──────────────────────────────────────────────────────────────────────────────────────────────────────
// t, dur · (px, py) punto del mondo che scorre in linea retta sullo schermo fino a (o.sx, o.sy) (default: l'ancora 540, 880)
// mentre la scala va a s1 in modo esponenziale. Segmenti di un fotogramma del gestore kit2 (seek-safe, si tronca come move).
// o: { ease (curva della scala), easePos (curva dello spostamento sullo schermo: nelle entrate il cerchio va al centro presto,
//   power2.out, mentre lo zoom accelera, power2.in), sx, sy, steps }
const zoomR13 = (t, dur, px, py, s1, o) => {
  o = o || {};
  const a = camCut(t);
  Object.assign(CAM, a);
  const e = easeFn(o.ease || "power2.inOut"), ep = o.easePos ? easeFn(o.easePos) : e;
  const X0 = ANCHOR.x + (px - a.fx) * a.s, Y0 = ANCHOR.y + (py - a.fy) * a.s;
  const sx = o.sx == null ? ANCHOR.x : o.sx, sy = o.sy == null ? ANCHOR.y : o.sy;
  const N = o.steps || Math.max(6, Math.round(dur * 30));
  for (let k = 0; k < N; k++) {
    const u = e((k + 1) / N), v = ep((k + 1) / N), s = a.s * Math.pow(s1 / a.s, u);
    const X = X0 + (sx - X0) * v, Y = Y0 + (sy - Y0) * v;
    camK(t + (dur * k) / N, dur / N, px - (X - ANCHOR.x) / s, py - (Y - ANCHOR.y) / s, s, "none");
  }
  return { fx: CAM.fx, fy: CAM.fy, s: CAM.s };
};
// punto del mondo → posizione sullo schermo in una posa
const aSchermoR13 = (x, y, P) => [ANCHOR.x + (x - P.fx) * P.s, ANCHOR.y + (y - P.fy) * P.s];

// ── copertina di un cerchio (riusata dall'oblò) ───────────────────────────────────────────────────────────────────────────────
// cover: { img: id del pool } | { user: "tu" | handle } | { icon, bg, col } | { anon: true } | null
const copertinaR13 = (parent, d, cover) => {
  const f = el(parent, { position: "absolute", left: 0, top: 0, width: d, height: d, borderRadius: "50%", overflow: "hidden", background: (cover && cover.bg) || "#1c1c1e" });
  if (!cover) return f;
  if (cover.img) imgIn(f, cover.img, { objectFit: "cover" });
  else if (cover.user) imgIn(f, "av-" + cover.user, { objectFit: "cover" });
  else if (cover.anon) personaK(f, 0, 0, d, { z: 1 });
  else if (cover.icon) el(f, { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }, svg(cover.icon, Math.round(d * 0.46), cover.col || K.ink, 2.3));
  return f;
};

// ── la cornice d'acciaio dell'oblò (anello lucido con i bulloni) attorno a un cerchio di raggio r ──────────────────────────────────
const corniceR13 = (parent, cx, cy, r, o) => {
  o = o || {};
  const R = r * 1.24, g = layered(el(parent, { position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, zIndex: o.z || 60, pointerEvents: "none" }));
  g.setAttribute("data-layout-allow-occlusion", "");
  // anello: gradiente conico d'acciaio, bucato al centro
  const ring = el(g, { position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 210deg, #f2f2f2, #7c7c7c 12%, #d9d9d9 24%, #5e5e5e 38%, #eeeeee 52%, #6c6c6c 66%, #cfcfcf 80%, #8a8a8a 90%, #f2f2f2)",
    WebkitMaskImage: `radial-gradient(circle, transparent ${(r / R) * 70.7 - 0.1}%, #000 ${(r / R) * 70.7 + 0.3}%)`, maskImage: `radial-gradient(circle, transparent ${(r / R) * 70.7 - 0.1}%, #000 ${(r / R) * 70.7 + 0.3}%)`,
    boxShadow: "0 24px 60px rgba(0,0,0,.6)" });
  // filo lime pieno sul bordo interno (la luce della stanza)
  el(g, { position: "absolute", left: R - r - 3, top: R - r - 3, width: 2 * r + 6, height: 2 * r + 6, borderRadius: "50%", border: `${Math.max(3, r * 0.035)}px solid ${K.lime}`, boxShadow: GLOW_A(0.8), boxSizing: "border-box" });
  // bulloni
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + Math.PI / 8, rb = (r + R) / 2, bd = (R - r) * 0.34;
    el(g, { position: "absolute", left: R + Math.cos(a) * rb - bd / 2, top: R + Math.sin(a) * rb - bd / 2, width: bd, height: bd, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #bdbdbd 40%, #5a5a5a 100%)", boxShadow: "0 2px 4px rgba(0,0,0,.6)" });
  }
  gsap.set(g, { opacity: 0 });
  return { g, ring, R, r };
};

// ── L'OBLÒ: entrata ───────────────────────────────────────────────────────────────────────────────────────────────────────────
// t = istante del taglio · c = { x, y, d } il cerchio da cui si entra (mondo) · room = { el (contenitore della stanza, livello
// 1×1 nel mondo, parte nascosto), x, y (centro dell'iride, mondo), pose (posa finale) } · o: { parent (livello del mondo per
// cornice e copertina), cover (come copertinaR13), pre (0.42 corsa nel cerchio), D (520, diametro a schermo al taglio),
// k (0.78: la stanza parte un filo più lontana e la camera continua ad avanzare), settle (0.55), iris (0.5), blur (5), z }
const obloInR13 = (t, c, room, o) => {
  o = o || {};
  const pre = o.pre || 0.42, D = o.D || 520, settle = o.settle || 0.45, iris = o.iris || 0.42, par = o.parent || room.el.parentNode; // confronto con K07/K13: più secco
  // 1 · la corsa nel cerchio; la cornice compare attorno al cerchio mentre ci si avvicina
  const F1 = corniceR13(par, c.x, c.y, c.d / 2, { z: o.z || 70 });
  tl.fromTo(F1.g, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: pre * 0.6, ease: "power2.out", immediateRender: false }, t - pre * 0.75);
  tl.set(F1.g, { opacity: 0 }, t);
  zoomR13(t - pre, pre, c.x, c.y, D / c.d, { ease: "power2.in", easePos: "power2.out" });
  tl.fromTo(mbwrap, { filter: "blur(0px)" }, { filter: `blur(${o.blur || 5}px)`, duration: pre * 0.45, ease: "power2.in", immediateRender: false }, t - pre * 0.45);
  // 2 · il taglio: la stanza con l'iride della stessa misura sullo schermo, la camera continua ad avanzare e si assesta
  const P = room.pose, s0 = P.s * (o.k || 0.78), r0 = D / 2 / s0;
  const [Xf, Yf] = aSchermoR13(room.x, room.y, P);
  const R = (Math.hypot(1080, 1920) / 2 + Math.hypot(Xf - 540, Yf - 960)) / P.s + 40;
  cutTo(t, room.x, room.y, s0);
  zoomR13(t, settle, room.x, room.y, P.s, { ease: "power2.out", sx: Xf, sy: Yf });
  tl.to(mbwrap, { filter: "blur(0px)", duration: 0.22, ease: "power2.out" }, t);
  tl.set(mbwrap, { filter: "none" }, t + 0.23);
  // 3 · l'iride si apre
  tl.set(room.el, { opacity: 1, clipPath: `circle(${r0.toFixed(1)}px at ${room.x}px ${room.y}px)` }, t);
  tl.to(room.el, { clipPath: `circle(${R.toFixed(1)}px at ${room.x}px ${room.y}px)`, duration: iris, ease: "power2.in" }, t);
  tl.set(room.el, { clipPath: "none" }, t + iris + 0.02);
  // 4 · cornice e copertina dalla parte della stanza: crescono con l'iride, la copertina si dissolve nella storia
  const F2 = corniceR13(par, room.x, room.y, r0, { z: (o.z || 70) + 1 });
  tl.set(F2.g, { opacity: 1 }, t);
  tl.to(F2.g, { scale: R / r0, duration: iris, ease: "power2.in" }, t);
  tl.to(F2.g, { opacity: 0, duration: iris * 0.45, ease: "power1.in" }, t + iris * 0.4);
  if (o.cover !== undefined) {
    const cw = layered(el(par, { position: "absolute", left: room.x - r0, top: room.y - r0, width: 2 * r0, height: 2 * r0, zIndex: (o.z || 70) - 1, pointerEvents: "none" }));
    copertinaR13(cw, 2 * r0, o.cover);
    gsap.set(cw, { opacity: 0 });
    tl.set(cw, { opacity: 1 }, t);
    tl.to(cw, { scale: 1.35, opacity: 0, duration: 0.3, ease: "power1.in" }, t + 0.04);
  }
  return { r0, R, end: t + Math.max(settle, iris) };
};

// ── L'OBLÒ: uscita ────────────────────────────────────────────────────────────────────────────────────────────────────────────
// t = istante del taglio · room = { el, x, y } · c = { x, y, d } il cerchio in cui si torna · o: { pose (posa d'arrivo nel mondo
// di partenza), cover, pre (0.4), D (520), k (0.85), out (0.6), parent, z }
const obloOutR13 = (t, room, c, o) => {
  o = o || {};
  const pre = o.pre || 0.4, D = o.D || 520, out = o.out || 0.6, par = o.parent || room.el.parentNode;
  const a = camCut(t - pre);
  Object.assign(CAM, a);
  const s1 = a.s * (o.k || 0.85), r1 = D / 2 / s1;
  const [Xa, Ya] = aSchermoR13(room.x, room.y, a);
  const R = (Math.hypot(1080, 1920) / 2 + Math.hypot(Xa - 540, Ya - 960)) / a.s + 40;
  // 1 · l'iride si chiude sul centro della stanza, che va al centro dello schermo
  zoomR13(t - pre, pre, room.x, room.y, s1, { ease: "power2.in" });
  tl.set(room.el, { clipPath: `circle(${R.toFixed(1)}px at ${room.x}px ${room.y}px)` }, t - pre);
  tl.to(room.el, { clipPath: `circle(${r1.toFixed(1)}px at ${room.x}px ${room.y}px)`, duration: pre, ease: "power2.in" }, t - pre);
  const F2 = corniceR13(par, room.x, room.y, r1, { z: (o.z || 70) + 1 });
  tl.fromTo(F2.g, { opacity: 0, scale: R / r1 }, { opacity: 1, scale: 1, duration: pre, ease: "power2.in", immediateRender: false }, t - pre);
  tl.set(F2.g, { opacity: 0 }, t);
  if (o.cover !== undefined) {
    const cw = layered(el(par, { position: "absolute", left: room.x - r1, top: room.y - r1, width: 2 * r1, height: 2 * r1, zIndex: (o.z || 70) - 1, pointerEvents: "none" }));
    copertinaR13(cw, 2 * r1, o.cover);
    gsap.set(cw, { opacity: 0 });
    tl.to(cw, { opacity: 1, duration: 0.18, ease: "power1.in" }, t - 0.2);
    tl.set(cw, { opacity: 0 }, t);
  }
  tl.fromTo(mbwrap, { filter: "blur(0px)" }, { filter: "blur(4px)", duration: 0.16, ease: "power2.in", immediateRender: false }, t - 0.16);
  // 2 · il taglio sul cerchio piccolo e la camera esce all'indietro fino alla posa d'arrivo
  tl.set(room.el, { opacity: 0 }, t);
  cutTo(t, c.x, c.y, D / c.d);
  const F1 = corniceR13(par, c.x, c.y, c.d / 2, { z: o.z || 70 });
  tl.set(F1.g, { opacity: 1 }, t);
  tl.to(F1.g, { opacity: 0, duration: out * 0.6, ease: "power1.out" }, t + 0.05);
  const P = o.pose, [Xf, Yf] = aSchermoR13(c.x, c.y, P);
  zoomR13(t, out, c.x, c.y, P.s, { ease: "power2.out", sx: Xf, sy: Yf });
  tl.to(mbwrap, { filter: "blur(0px)", duration: 0.2, ease: "power2.out" }, t);
  tl.set(mbwrap, { filter: "none" }, t + 0.21);
  return { end: t + out };
};

// ── un cerchio delle storie in evidenza ───────────────────────────────────────────────────────────────────────────────────────
// o: { cover (come copertinaR13), vuoto (numero del posto vuoto: cerchio tratteggiato col numero), nome, ring ("grigio" | "lime"),
//      fs, lw, z } → { g, face, lab, num, lime(t), grey(t), load(t, dur), numOn(t), fill(t, cover, nome), d }
const evidenzaR13 = (parent, cx, cy, d, o) => {
  o = o || {};
  const g = el(parent, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, zIndex: o.z || 4 });
  const bw = Math.max(2, Math.round(d * 0.028)), gp = Math.max(3, Math.round(d * 0.05)), cd = d - 2 * bw - 2 * gp;
  const ringG = el(g, { position: "absolute", inset: 0, borderRadius: "50%", background: "#48484b", opacity: o.vuoto ? 0 : 1 });
  const ringL = el(g, { position: "absolute", inset: 0, borderRadius: "50%", background: LIME_RING, boxShadow: GLOW_A(0.7), opacity: o.ring === "lime" ? 1 : 0 });
  const inner = el(g, { position: "absolute", left: bw, top: bw, width: d - 2 * bw, height: d - 2 * bw, borderRadius: "50%", background: "#000", opacity: o.vuoto ? 0 : 1 });
  const fw = el(g, { position: "absolute", left: bw + gp, top: bw + gp, width: cd, height: cd, borderRadius: "50%", overflow: "hidden" });
  let face = o.cover ? copertinaR13(fw, cd, o.cover) : null;
  // posto vuoto: cerchio tratteggiato con il numero (come le voci-segnaposto sfocate di L01)
  let dash = null, num = null, numOn = null;
  if (o.vuoto) {
    dash = el(g, { position: "absolute", inset: 0, borderRadius: "50%", border: `${Math.max(3, d * 0.035)}px dashed rgba(255,255,255,.42)`, boxSizing: "border-box" });
    num = el(g, { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: Math.round(d * 0.42), color: "rgba(255,255,255,.5)" }, String(o.vuoto));
    numOn = el(g, { position: "absolute", left: d * 0.12, top: d * 0.12, width: d * 0.76, height: d * 0.76, borderRadius: "50%", background: limeFill(1), boxShadow: GLOW_A(0.9), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: Math.round(d * 0.42), color: K.ink, opacity: 0 }, String(o.vuoto));
  }
  let lab = null;
  const fs = o.fs || Math.round(d * 0.19), lw = o.lw || d * 1.12;
  lab = el(g, { position: "absolute", left: (d - lw) / 2, top: d + fs * 0.4, width: lw, textAlign: "center", fontFamily: FS, fontWeight: 600, fontSize: fs, color: "rgba(255,255,255,.92)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, o.nome || "");
  // anello che gira mentre la storia si carica (come in Instagram)
  const S = svgIn(g, d, d);
  const spin = pathEl(S, `M ${d / 2} ${bw / 2 + 1} A ${d / 2 - bw / 2 - 1} ${d / 2 - bw / 2 - 1} 0 1 1 ${d / 2 - 0.01} ${bw / 2 + 1}`, { fill: "none", stroke: "#ffffff", "stroke-width": bw + 2, "stroke-dasharray": `${d * 0.22} ${d * 0.09}`, "stroke-linecap": "round" });
  S.style.transformOrigin = "50% 50%";
  gsap.set(S, { opacity: 0 });
  const api = {
    g, fw, face, lab, num, numOn, dash, ringG, ringL, d, cx, cy,
    lime: (t, dur) => { tl.to(ringL, { opacity: 1, duration: dur || 0.2 }, t); tl.to(ringG, { opacity: 0, duration: dur || 0.2 }, t); },
    grey: (t) => { tl.to(ringL, { opacity: 0, duration: 0.2 }, t); tl.to(g, { filter: "grayscale(1) brightness(.5)", duration: 0.3 }, t); },
    load: (t, dur) => { tl.set(S, { opacity: 1 }, t); tl.fromTo(S, { rotation: 0 }, { rotation: 360 * dur * 1.2, duration: dur, ease: "none", immediateRender: false }, t); tl.set(S, { opacity: 0 }, t + dur); },
    numOn: (t) => { tl.to(numOn, { opacity: 1, duration: 0.12 }, t); tl.fromTo(numOn, { scale: 0.4 }, { scale: 1, duration: 0.35, ease: "back.out(2.6)", immediateRender: false }, t); tl.to(num, { opacity: 0, duration: 0.12 }, t); tl.to(dash, { borderColor: "rgba(207,251,80,.9)", duration: 0.15 }, t); },
    // la copertina vera si posa nel posto vuoto: anello, nero e copertina compaiono, il numero lascia il posto
    fill: (t, cover, nome) => {
      const nf = copertinaR13(fw, cd, cover);
      gsap.set(nf, { opacity: 0 });
      tl.set([inner, nf], { opacity: 1 }, t);
      tl.set(ringL, { opacity: 1 }, t);
      if (dash) tl.set([dash, numOn, num], { opacity: 0 }, t);
      if (nome) { lab.textContent = ""; typeIn(lab, nome, t + 0.1, 26); }
      api.face = nf;
      return nf;
    },
  };
  return api;
};

// ── il tuo profilo visto da chi arriva (vecchio stile, dark), con la fila delle storie in evidenza ─────────────────────────────────
// o: { user, handle, nome, bio: [righe], grid: [id video], evidenze: [{ cover, nome }], ring ("ig" | "lime"), z }
// → phone2 + { stat, cells, msgBtn, seguiBtn, row (contenitore della fila, scorre in x), ev (cerchi iniziali), HD, HP, HY, BY,
//   TY, GY, evLocal(i) (centro nello schermo), evXY(i, scroll) (mondo), msgXY(), backXY(), avXY(), bioRect(), partY(y) (mondo) }
const profiloR13 = (parent, X, Y, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw;
  const sbar = [...S.children]; // tacca, ora, segnale, barra in basso del telefono
  const back = el(S, { position: "absolute", left: 14, top: 64, width: 40, height: 40 }, svg("chevron-left", 38, "#fff", 2.4));
  const hd = el(S, { position: "absolute", left: 0, top: 68, width: W, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontFamily: FS, fontSize: 28, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }, o.handle || "");
  const hic = el(S, { position: "absolute", right: 20, top: 68, display: "flex", gap: 22 }, svg("bell", 30, "#fff", 2) + svg("ellipsis", 30, "#fff", 2.4));
  const AX = 98, AY = 212, AD = 150;
  const ring = el(S, { position: "absolute", left: AX - AD / 2 - 6, top: AY - AD / 2 - 6, width: AD + 12, height: AD + 12, borderRadius: "50%", background: o.ring === "lime" ? LIME_RING : IG_GRAD, padding: 5 });
  const inner = el(ring, { width: "100%", height: "100%", borderRadius: "50%", background: "#000", padding: 4 });
  const face = el(inner, { width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", position: "relative", background: "#333" });
  if (o.user) imgIn(face, "av-" + o.user, { objectFit: "cover" });
  const stat = {};
  [["post", o.post || "184", "post"], ["follower", o.follower || "8.430", "follower"], ["seguiti", o.seguiti || "312", "seguiti"]].forEach(([key, v, lb], k) => {
    const cx0 = 252 + k * 104;
    const box = el(S, { position: "absolute", left: cx0 - 60, top: 162, width: 120, textAlign: "center", fontFamily: FS, color: "#fff", zIndex: 4 });
    const num = el(box, { position: "relative", fontSize: 32, fontWeight: 800, lineHeight: 1.4, filter: "blur(7px)", whiteSpace: "nowrap" }, v);
    el(box, { position: "relative", fontSize: 20, color: "rgba(255,255,255,.7)" }, lb);
    stat[key] = { box, num };
  });
  const nm = el(S, { position: "absolute", left: 24, top: 302, fontFamily: FS, fontSize: 25, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }, o.nome || "");
  const bio = (o.bio || []).map((r, i) => el(S, { position: "absolute", left: 24, top: 338 + i * 30, width: W - 48, fontFamily: FS, fontSize: 22, color: "rgba(255,255,255,.88)", whiteSpace: "nowrap", overflow: "hidden" }, r));
  const BY = 338 + Math.max(1, (o.bio || []).length) * 30 + 18;
  const seguiBtn = el(S, { position: "absolute", left: 24, top: BY, width: 214, height: 56, borderRadius: 14, background: K.ig, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontSize: 23, fontWeight: 800, color: "#fff" }, "Segui");
  const msgBtn = el(S, { position: "absolute", left: 248, top: BY, width: 214, height: 56, borderRadius: 14, background: "#2c2c2e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontSize: 23, fontWeight: 800, color: "#fff", overflow: "hidden" }, "Messaggio");
  el(S, { position: "absolute", left: 472, top: BY, width: 56, height: 56, borderRadius: 14, background: "#2c2c2e", display: "flex", alignItems: "center", justifyContent: "center" }, svg("user-plus", 26, "#fff", 2.2));
  // la fila delle evidenze (contenitore che scorre in orizzontale come in Instagram)
  const HD = o.hd || 96, HP = o.hp || 108, HY = BY + 56 + 26 + HD / 2;
  const row = el(S, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 5 });
  const evLocal = (i) => [16 + HD / 2 + i * HP, HY];
  const ev = (o.evidenze || []).map((it, i) => evidenzaR13(row, evLocal(i)[0], HY, HD, Object.assign({ fs: 19, lw: HP - 6 }, it)));
  const TY = HY + HD / 2 + 48;
  const tabs = el(S, { position: "absolute", left: 0, top: TY, width: W, height: 50, display: "flex" });
  ["grid-3x3", "clapperboard", "square-user"].forEach((n, k) => el(tabs, { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: k === 0 ? "2.5px solid #fff" : "1px solid rgba(255,255,255,.14)" }, svg(n, 27, k === 0 ? "#fff" : "rgba(255,255,255,.45)", 2)));
  const GY = TY + 52, cw = (W - 4) / 3, ch = Math.round((cw * 4) / 3);
  const cells = (o.grid || []).map((id, i) => {
    const x = (i % 3) * (cw + 2), y = GY + Math.floor(i / 3) * (ch + 2);
    const c = el(S, { position: "absolute", left: x, top: y, width: cw, height: ch, overflow: "hidden", background: "#1a1a1a", zIndex: 2 });
    if (id) videoTile(c, 0, 0, cw, ch, id, 1);
    // icona del reel in alto a destra, come nella griglia di Instagram
    el(c, { position: "absolute", right: 8, top: 8, width: 26, height: 26, zIndex: 3, filter: "drop-shadow(0 1px 3px rgba(0,0,0,.7))" }, svg("clapperboard", 24, "#fff", 2.2));
    return { c, x, y };
  });
  let scroll = 0;
  return Object.assign(P, {
    stat, cells, msgBtn, seguiBtn, row, ev, bio, nm, hd, ring, HD, HP, HY, BY, TY, GY, cw, ch, AX, AY, AD,
    // per spegnere la parte alta dello schermo quando la camera è più giù (niente interfaccia sotto il titolo, regola 20)
    topEls: [back, hd, hic, ring, ...Object.values(stat).map((x) => x.box)], bioEls: [nm, ...bio], headEls: [back, hd, hic, ...sbar.slice(0, 3)],
    evLocal,
    evXY: (i, sc) => P.at(evLocal(i)[0] + (sc == null ? scroll : sc), HY),
    setScroll: (v) => { scroll = v; },
    scrollTo: (t, v, dur) => { tl.to(row, { x: v, duration: dur || 0.6, ease: "power3.inOut" }, t); scroll = v; },
    msgXY: () => P.at(248 + 107, BY + 28),
    msgRect: () => { const a = P.at(248, BY), b = P.at(462, BY + 56); return [a[0], a[1], b[0], b[1]]; },
    seguiXY: () => P.at(24 + 107, BY + 28),
    backXY: () => P.at(34, 84),
    avXY: () => P.at(AX, AY),
    bioRect: () => { const a = P.at(16, 296), b = P.at(W - 16, BY - 8); return [a[0], a[1], b[0], b[1]]; },
    cellXY: (i) => P.at(cells[i].x + cw / 2, cells[i].y + ch / 2),
    y: (yy) => P.at(0, yy)[1],
  });
};

// ── i messaggi che ricevi: pill con l'icona del DM e il numero (grigia a 0, lime quando arriva qualcosa) ──────────────────────────
const pillMsgR13 = (parent, cx, cy, o) => {
  o = o || {};
  const fs = o.fs || 40, h = Math.round(fs * 1.9), w = o.w || Math.round(fs * 4.2);
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: o.z || 60 }));
  const off = el(g, { position: "absolute", inset: 0, borderRadius: h / 2, background: "linear-gradient(180deg, rgba(64,64,64,.97), rgba(30,30,30,.98))", border: "3px solid rgba(255,255,255,.5)", boxShadow: "0 16px 36px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: Math.round(fs * 0.3), fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, whiteSpace: "nowrap" }, svg("send", Math.round(fs * 1.05), "rgba(255,255,255,.85)", 2.4) + `<span>${o.n0 == null ? 0 : o.n0}</span>`);
  const on = el(g, { position: "absolute", inset: 0, borderRadius: h / 2, background: limeFill(1), border: "3px solid #f4ffd0", boxShadow: `${GLOW_A(0.9)}, 0 16px 36px rgba(0,0,0,.5)`, display: "flex", alignItems: "center", justifyContent: "center", gap: Math.round(fs * 0.3), fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.ink, whiteSpace: "nowrap", opacity: 0 }, svg("send", Math.round(fs * 1.05), K.ink, 2.6) + `<span>${o.n1 == null ? 1 : o.n1}</span>`);
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", "")); // i due stati stanno uno sopra l'altro
  gsap.set(g, { opacity: 0 });
  return {
    g, off, on,
    show: (t) => tl.fromTo(g, { opacity: 0, scale: 0.5, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(2.6)", immediateRender: false }, t),
    // non succede niente: tremolio
    nulla: (t) => { [0, 1, 2, 3, 4].forEach((k) => tl.to(g, { x: k % 2 ? -9 : 9, duration: 0.05, ease: "none" }, t + k * 0.05)); tl.to(g, { x: 0, duration: 0.08 }, t + 0.25); },
    accendi: (t) => { tl.to(on, { opacity: 1, duration: 0.12 }, t); tl.to(off, { opacity: 0, duration: 0.12 }, t); tl.fromTo(g, { scale: 1 }, { scale: 1.2, duration: 0.12, ease: "power2.out", immediateRender: false }, t); tl.to(g, { scale: 1, duration: 0.35, ease: "back.out(3)" }, t + 0.12); },
    hide: (t) => tl.to(g, { opacity: 0, duration: 0.2 }, t),
  };
};

// ── sticker di testo di una storia (stile "Classico" di Instagram: riquadro bianco arrotondato, testo nero) ─────────────────────
// o: { fs (34), bg ("#fff" | K.lime | "rgba(0,0,0,.6)"), col, rot, w, z, icon } → { s, show(t) }
const stickerR13 = (parent, cx, cy, testo, o) => {
  o = o || {};
  const fs = o.fs || 34;
  const s = layered(el(parent, { position: "absolute", left: cx - (o.w || 600) / 2, top: cy - fs, width: o.w || 600, height: fs * 2, display: "flex", alignItems: "center", justifyContent: "center", zIndex: o.z || 8, pointerEvents: "none" }));
  const b = el(s, { display: "inline-flex", alignItems: "center", gap: Math.round(fs * 0.3), padding: `${Math.round(fs * 0.22)}px ${Math.round(fs * 0.5)}px`, borderRadius: Math.round(fs * 0.36), background: o.bg || "#ffffff", color: o.col || "#111", fontFamily: FS, fontWeight: 800, fontSize: fs, whiteSpace: "nowrap", boxShadow: "0 8px 22px rgba(0,0,0,.35)", transform: `rotate(${o.rot || 0}deg)` }, (o.icon ? svg(o.icon, Math.round(fs * 1.05), o.col || "#111", 2.6) : "") + testo);
  gsap.set(s, { opacity: 0 });
  return { s, b, show: (t) => tl.fromTo(s, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.38, ease: "back.out(2.6)", immediateRender: false }, t) };
};

// ── chi guarda con i suoi dubbi (persona qualunque di profilo, come nel reel 09) ──────────────────────────────────────────────────
// domande: ["Chi è?", …] · o: { d (220 diametro della persona), pos: [[dx, dy], …] (centri delle nuvolette rispetto alla persona),
//   fs (36), z } → { g, p, bubbles, show(t), ask(i, t), trema(t), answer(i, t), tutti(t) }
const dubbiR13 = (parent, cx, cy, domande, o) => {
  o = o || {};
  const d = o.d || 220, fs = o.fs || 36, z = o.z || 30;
  const g = layered(el(parent, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: z }));
  const p = el(g, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, zIndex: 3 });
  personaK(p, 0, 0, d, { z: 1 });
  const ring = el(p, { position: "absolute", left: -7, top: -7, width: d + 14, height: d + 14, borderRadius: "50%", border: "5px solid rgba(255,255,255,.85)", boxSizing: "border-box", zIndex: 2 });
  const ringL = el(p, { position: "absolute", left: -7, top: -7, width: d + 14, height: d + 14, borderRadius: "50%", border: `6px solid ${K.lime}`, boxShadow: GLOW_A(0.9), boxSizing: "border-box", zIndex: 3, opacity: 0 });
  const POS = o.pos || [[-10, -d * 1.05], [0, -d * 1.55], [10, -d * 2.05]];
  const S = svgIn(g, 1, 1);
  const bubbles = domande.map((q, i) => {
    const [dx, dy] = POS[i], bx = cx + dx, by = cy + dy;
    // puntini del pensiero dalla testa alla nuvoletta
    const dots = [0.28, 0.5, 0.72].map((u, k) => el(g, { position: "absolute", left: cx + dx * u - (6 + k * 3), top: cy - d * 0.42 + (dy + d * 0.42) * u - (6 + k * 3), width: 12 + k * 6, height: 12 + k * 6, borderRadius: "50%", background: "rgba(255,255,255,.75)", opacity: 0, zIndex: 2 }));
    const b = el(g, { position: "absolute", left: bx - 260, top: by - fs * 0.95, width: 520, height: fs * 1.9, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4 });
    const off = el(b, { display: "inline-flex", alignItems: "center", gap: Math.round(fs * 0.28), padding: `${Math.round(fs * 0.3)}px ${Math.round(fs * 0.62)}px`, borderRadius: fs, background: "linear-gradient(180deg, rgba(66,66,66,.97), rgba(32,32,32,.98))", border: "2.5px solid rgba(255,255,255,.55)", boxShadow: "0 14px 32px rgba(0,0,0,.55)", fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, whiteSpace: "nowrap" }, svg("circle-help", Math.round(fs * 1.1), "rgba(255,255,255,.85)", 2.4) + q);
    const on = el(b, { position: "absolute", display: "inline-flex", alignItems: "center", gap: Math.round(fs * 0.28), padding: `${Math.round(fs * 0.3)}px ${Math.round(fs * 0.62)}px`, borderRadius: fs, background: limeFill(1), border: "2.5px solid #f4ffd0", boxShadow: `${GLOW_A(0.85)}, 0 14px 32px rgba(0,0,0,.45)`, fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.ink, whiteSpace: "nowrap", opacity: 0 }, svg("circle-check", Math.round(fs * 1.1), K.ink, 2.6) + q);
    [b, ...b.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
    gsap.set(b, { opacity: 0 });
    return { b, off, on, dots, x: bx, y: by };
  });
  gsap.set(p, { opacity: 0 });
  const api = {
    g, p, ring, ringL, bubbles, d, cx, cy,
    show: (t) => tl.fromTo(p, { opacity: 0, scale: 0.6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(2.2)", immediateRender: false }, t),
    ask: (i, t) => {
      const B = bubbles[i];
      B.dots.forEach((dd, k) => tl.to(dd, { opacity: 1, duration: 0.08 }, t + k * 0.04));
      tl.fromTo(B.b, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)", immediateRender: false }, t + 0.1);
    },
    trema: (t) => bubbles.forEach((B, i) => {
      [0, 1, 2, 3, 4, 5].forEach((k) => tl.to(B.b, { x: (k % 2 ? -1 : 1) * 10, duration: 0.045, ease: "none" }, t + i * 0.04 + k * 0.045));
      tl.to(B.b, { x: 0, duration: 0.08 }, t + i * 0.04 + 0.27);
      tl.to(B.off, { opacity: 0.55, duration: 0.3 }, t + 0.3);
    }),
    answer: (i, t) => {
      const B = bubbles[i];
      tl.to(B.on, { opacity: 1, duration: 0.12 }, t);
      tl.to(B.off, { opacity: 0, duration: 0.12 }, t);
      tl.fromTo(B.b, { scale: 1 }, { scale: 1.16, duration: 0.1, ease: "power2.out", immediateRender: false }, t);
      tl.to(B.b, { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.1);
      B.dots.forEach((dd) => tl.to(dd, { backgroundColor: K.lime, duration: 0.15 }, t));
    },
    // tutti i dubbi sciolti: la persona si accende
    sereno: (t) => { tl.to(ringL, { opacity: 1, duration: 0.2 }, t); tl.to(ring, { opacity: 0, duration: 0.2 }, t); pulse(g, cx, cy, t, { r: d * 0.8, z: 1 }); },
    // stato già raggiunto in una scena precedente (senza animazione)
    stato: (t, risposte, visibili) => {
      tl.set(p, { opacity: 1, scale: 1, y: 0 }, t);
      bubbles.forEach((B, i) => {
        const vis = visibili == null || i < visibili;
        tl.set(B.b, { opacity: vis ? 1 : 0, scale: 1 }, t);
        tl.set(B.dots, { opacity: vis ? 1 : 0 }, t);
        if (i < risposte) { tl.set(B.on, { opacity: 1 }, t); tl.set(B.off, { opacity: 0 }, t); tl.set(B.dots, { backgroundColor: K.lime }, t); }
      });
    },
  };
  return api;
};

// ── il tasto "Messaggio" grande, col lucchetto (i dubbi prima di contattarti) ───────────────────────────────────────────────────────
// o: { w (520), h (118), z } → { g, unlock(t), press(t), rect }
const tastoMsgR13 = (parent, cx, cy, o) => {
  o = o || {};
  const w = o.w || 520, h = o.h || 118, z = o.z || 30;
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z }));
  const btn = el(g, { position: "absolute", inset: 0, borderRadius: h * 0.24, background: "linear-gradient(180deg,#3a3a3c,#232325)", border: "2px solid rgba(255,255,255,.22)", boxShadow: "0 26px 60px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.14)", overflow: "hidden" });
  const txt = el(btn, { position: "absolute", left: 0, top: 0, width: w - h * 0.6, height: h, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: FS, fontWeight: 800, fontSize: h * 0.4, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }, svg("send", Math.round(h * 0.42), "rgba(255,255,255,.6)", 2.4) + "Messaggio");
  const on = el(btn, { position: "absolute", inset: 0, background: limeFill(1), display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: FS, fontWeight: 800, fontSize: h * 0.4, color: K.ink, whiteSpace: "nowrap", opacity: 0 }, svg("send", Math.round(h * 0.42), K.ink, 2.6) + "Messaggio");
  // il lucchetto (corpo in grafite col foro lime, archetto d'acciaio)
  const L = el(g, { position: "absolute", left: w - h * 0.62, top: -h * 0.42, width: h * 0.82, height: h * 1.1, zIndex: 3 });
  const arc = el(L, { position: "absolute", left: h * 0.17, top: 0, width: h * 0.48, height: h * 0.62, borderRadius: `${h * 0.24}px ${h * 0.24}px 0 0`, border: `${h * 0.09}px solid #d4d4d4`, borderBottom: "none", boxSizing: "border-box", transformOrigin: "88% 100%" });
  const body = el(L, { position: "absolute", left: 0, top: h * 0.46, width: h * 0.82, height: h * 0.64, borderRadius: h * 0.14, background: "linear-gradient(160deg,#5a5a5a 0%,#2c2c2c 55%,#1c1c1c 100%)", border: "2px solid rgba(255,255,255,.3)", boxShadow: "0 12px 26px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center" });
  const hole = el(body, { width: h * 0.13, height: h * 0.24, borderRadius: h * 0.06, background: "#8a8a8a" });
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  gsap.set(g, { opacity: 0 });
  return {
    g, btn, on, L, rect: [cx - w / 2, cy - h / 2 - h * 0.42, cx + w / 2, cy + h / 2],
    show: (t) => tl.fromTo(g, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.45, ease: KW.arrive, immediateRender: false }, t),
    unlock: (t) => {
      tl.to(arc, { y: -h * 0.16, rotation: 32, duration: 0.18, ease: "back.out(3)" }, t);
      tl.to(hole, { backgroundColor: K.lime, boxShadow: GLOW_A(1), duration: 0.12 }, t);
      tl.to(body, { borderColor: "#f4ffd0", boxShadow: `${GLOW_A(0.9)}, 0 12px 26px rgba(0,0,0,.55)`, duration: 0.15 }, t);
      tl.to(on, { opacity: 1, duration: 0.2 }, t + 0.12);
      tl.to(btn, { boxShadow: `${GLOW_A(1)}, 0 26px 60px rgba(0,0,0,.6)`, borderColor: "#f4ffd0", duration: 0.2 }, t + 0.12);
      tl.fromTo(g, { scale: 1 }, { scale: 1.06, duration: 0.12, ease: "power2.out", immediateRender: false }, t + 0.12);
      tl.to(g, { scale: 1, duration: 0.35, ease: "back.out(3)" }, t + 0.24);
      tl.to(L, { opacity: 0, y: -40, duration: 0.3, ease: "power2.in" }, t + 0.55);
    },
  };
};

// ── prima / dopo con la tendina (nuova, nello stile di F11: il grigio sbagliato, il lime giusto) ───────────────────────────────────
// x, y, w, h nel parent · prima/dopo: [indici dell'atlante] (6 miniature ciascuno) · views: [[testi prima], [testi dopo]]
// → { g, show(t), wipe(t, dur) }
const primaDopoR13 = (parent, x, y, w, h, prima, dopo, views, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, overflow: "hidden", background: "#0e0e0e", border: "2px solid rgba(255,255,255,.22)", zIndex: o.z || 6 }));
  const tw = (w - 4 * 8) / 3, th = (h - 64 - 3 * 8) / 2;
  const grid = (ids, vv, lime) => {
    const c = el(g, { position: "absolute", left: 0, top: 0, width: w, height: h });
    el(c, { position: "absolute", left: 0, top: 0, width: w, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", color: lime ? K.ink : "#d0d0d0", background: lime ? limeFill(1) : "#2a2a2a" }, lime ? "DOPO" : "PRIMA");
    ids.forEach((q, i) => {
      const tx = 8 + (i % 3) * (tw + 8), ty = 68 + Math.floor(i / 3) * (th + 8);
      const t0 = atlasCrop(c, tx, ty, tw, th, q, { z: 1 });
      t0.style.borderRadius = "8px";
      if (!lime) t0.style.filter = "grayscale(1) brightness(.55)";
      el(c, { position: "absolute", left: tx + 6, top: ty + th - 40, display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 14, background: lime ? K.lime : "rgba(20,20,20,.85)", fontFamily: FS, fontWeight: 800, fontSize: 20, color: lime ? K.ink : "#bbbbbb", whiteSpace: "nowrap", zIndex: 3 }, svg("play", 16, lime ? K.ink : "#bbbbbb", 2.6, lime ? K.ink : "#bbbbbb") + vv[i]);
    });
    return c;
  };
  grid(prima, views[0], false);
  const after = grid(dopo, views[1], true);
  after.style.clipPath = "inset(0% 0% 0% 100%)";
  const bar = el(g, { position: "absolute", left: w - 3, top: 0, width: 6, height: h, background: "#ffffff", boxShadow: "0 0 18px rgba(255,255,255,.9)", zIndex: 6 });
  const knob = el(bar, { position: "absolute", left: -27, top: h / 2 - 30, width: 60, height: 60, borderRadius: "50%", background: "#ffffff", boxShadow: "0 6px 16px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }, svg("chevrons-left-right", 34, "#111", 2.6));
  gsap.set(bar, { opacity: 0 });
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  return {
    g, after, bar,
    wipe: (t, dur) => {
      tl.set(bar, { opacity: 1 }, t);
      tl.to(after, { clipPath: "inset(0% 0% 0% 0%)", duration: dur || 0.55, ease: "power2.inOut" }, t);
      tl.fromTo(bar, { x: 0 }, { x: -(w - 3), duration: dur || 0.55, ease: "power2.inOut", immediateRender: false }, t);
      tl.to(bar, { opacity: 0, duration: 0.15 }, t + (dur || 0.55));
    },
  };
};

// ── il cartellino dell'offerta (grafite lucida, foro col filo, prezzo lime) ────────────────────────────────────────────────────────
const cartellinoR13 = (parent, cx, cy, w, testo, o) => {
  o = o || {};
  const h = w * 0.56, g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: o.z || 30, transformOrigin: "8% 50%" }));
  const shape = "polygon(22% 0%, 100% 0%, 100% 100%, 22% 100%, 0% 50%)";
  clipGlow(g, -10, -10, w + 20, h + 20, shape, 0, 0.35);
  const b = el(g, { position: "absolute", inset: 0, clipPath: shape, background: "linear-gradient(160deg,#5c5c5c 0%,#333 40%,#1d1d1d 100%)", zIndex: 1 });
  el(b, { position: "absolute", left: "22%", top: 0, width: "78%", height: "45%", background: "linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,0))" });
  el(g, { position: "absolute", left: w * 0.1, top: h / 2 - w * 0.045, width: w * 0.09, height: w * 0.09, borderRadius: "50%", background: "#0a0a0a", border: "3px solid #b9b9b9", zIndex: 2 });
  el(g, { position: "absolute", left: w * 0.25, top: 0, width: w * 0.72, height: h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 3 },
    `<div style="font-family:${FD};font-weight:700;font-size:${Math.round(h * 0.42)}px;line-height:1;color:${K.lime};text-shadow:${GLOW_LT};white-space:nowrap">${testo}</div>` +
    `<div style="font-family:${FS};font-weight:800;font-size:${Math.round(h * 0.15)}px;letter-spacing:.14em;color:#e8e8e8;margin-top:${Math.round(h * 0.06)}px;white-space:nowrap">${o.sotto || "OFFERTA"}</div>`);
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  gsap.set(g, { opacity: 0 });
  return { g };
};

// ── la recensione a cinque stelle (volto vero dell'atlante, stelle lime, righe del testo) ─────────────────────────────────────────
const recensioneR13 = (parent, cx, cy, w, o) => {
  o = o || {};
  const h = w * 0.62, g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: o.z || 30 }));
  const c = glass(g, 0, 0, w, h, { borderRadius: 26, border: "2px solid rgba(255,255,255,.25)" });
  const fd = h * 0.4;
  faceDot(c, w * 0.06, h * 0.1, fd, o.volto == null ? 25 : o.volto, null, { bw: 3 });
  const st = el(c, { position: "absolute", left: w * 0.06 + fd + w * 0.05, top: h * 0.16, display: "flex", gap: 6 });
  const stars = [0, 1, 2, 3, 4].map(() => el(st, { width: h * 0.17, height: h * 0.17, opacity: 0.25 }, svg("star", Math.round(h * 0.17), K.lime, 2, K.lime)));
  el(c, { position: "absolute", left: w * 0.06 + fd + w * 0.05, top: h * 0.4, width: w * 0.4, height: h * 0.07, borderRadius: 6, background: "rgba(255,255,255,.55)" });
  [0, 1].forEach((k) => el(c, { position: "absolute", left: w * 0.06, top: h * (0.62 + k * 0.14), width: w * (k ? 0.6 : 0.86), height: h * 0.07, borderRadius: 6, background: "rgba(255,255,255,.3)" }));
  el(c, { position: "absolute", right: w * 0.05, top: h * 0.02, fontFamily: FD, fontWeight: 700, fontSize: h * 0.42, color: "rgba(207,251,80,.95)", lineHeight: 1 }, "“");
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  gsap.set(g, { opacity: 0 });
  return { g, stars, stelle: (t) => stars.forEach((s, k) => { tl.to(s, { opacity: 1, duration: 0.06 }, t + k * 0.06); tl.fromTo(s, { scale: 0.4 }, { scale: 1, duration: 0.25, ease: "back.out(3)", immediateRender: false }, t + k * 0.06); }) };
};

// ── la vetrina (vetro con i riflessi, telaio in grafite) ───────────────────────────────────────────────────────────────────────────
const vetrinaR13 = (parent, x, y, w, h, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: x, top: y, width: w, height: h, zIndex: o.z || 40, pointerEvents: "none" }));
  g.setAttribute("data-layout-allow-occlusion", "");
  el(g, { position: "absolute", inset: 0, borderRadius: 18, border: "10px solid #3c3c3e", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.18), 0 30px 70px rgba(0,0,0,.55)", boxSizing: "border-box" });
  el(g, { position: "absolute", left: 10, top: 10, width: w - 20, height: h - 20, borderRadius: 10, background: "linear-gradient(115deg, rgba(255,255,255,.13) 0%, rgba(255,255,255,.03) 30%, rgba(255,255,255,0) 45%, rgba(255,255,255,.08) 62%, rgba(255,255,255,0) 72%)" });
  const sh = el(g, { position: "absolute", left: 10, top: 10, width: w - 20, height: h - 20, borderRadius: 10, overflow: "hidden" });
  const band = el(sh, { position: "absolute", left: -220, top: -h * 0.3, width: 120, height: h * 1.6, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.28), rgba(255,255,255,0))", transform: "rotate(18deg)" });
  el(g, { position: "absolute", left: -14, top: h - 26, width: w + 28, height: 34, borderRadius: 8, background: "linear-gradient(180deg,#4a4a4c,#232325)", boxShadow: "0 16px 30px rgba(0,0,0,.5)" });
  gsap.set(g, { opacity: 0 });
  return { g, riflesso: (t, dur) => tl.fromTo(band, { x: 0 }, { x: w + 440, duration: dur || 0.8, ease: "power1.inOut", immediateRender: false }, t) };
};

// ── il tuo reel nel feed (il video vero con l'interfaccia dei Reels: foto, nome, Segui, colonna delle azioni) ────────────────────────
// → { g, avXY() centro della foto (mondo), avD, rect }
const reelFeedR13 = (parent, x, y, w, vid, o) => {
  o = o || {};
  const h = Math.round((w * 16) / 9);
  const g = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: Math.round(w * 0.06), overflow: "hidden", background: "#111", border: "2px solid rgba(255,255,255,.26)", boxShadow: "0 44px 100px rgba(0,0,0,.62)", zIndex: o.z || 20 });
  videoTile(g, 0, 0, w, h, vid, 1);
  el(g, { position: "absolute", left: 0, top: 0, width: w, height: h * 0.16, background: "linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0))", zIndex: 2 });
  el(g, { position: "absolute", left: 0, bottom: 0, width: w, height: h * 0.34, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.72))", zIndex: 2 });
  el(g, { position: "absolute", left: w * 0.06, top: h * 0.035, fontFamily: FS, fontWeight: 800, fontSize: w * 0.06, color: "#fff", zIndex: 3 }, "Reels");
  el(g, { position: "absolute", right: w * 0.06, top: h * 0.035, zIndex: 3 }, svg("camera", Math.round(w * 0.065), "#fff", 2));
  const col = el(g, { position: "absolute", right: w * 0.035, bottom: h * 0.2, display: "flex", flexDirection: "column", alignItems: "center", gap: w * 0.04, zIndex: 3, fontFamily: FS, fontWeight: 700, fontSize: w * 0.034, color: "#fff" });
  [["heart", "4.812"], ["message-circle", "126"], ["send", "318"], ["ellipsis", ""]].forEach(([ic, n]) => el(col, { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }, svg(ic, Math.round(w * 0.075), "#fff", 2) + (n ? `<span>${n}</span>` : "")));
  const ad = Math.round(w * 0.105), ax = w * 0.06, ay = h * 0.84;
  const av = el(g, { position: "absolute", left: ax, top: ay - ad / 2, width: ad, height: ad, borderRadius: "50%", overflow: "hidden", border: "2px solid #fff", zIndex: 4 });
  imgIn(av, "av-tu", { objectFit: "cover" });
  el(g, { position: "absolute", left: ax + ad + w * 0.03, top: ay - w * 0.03, fontFamily: FS, fontWeight: 800, fontSize: w * 0.045, color: "#fff", whiteSpace: "nowrap", zIndex: 4, textShadow: "0 1px 6px rgba(0,0,0,.7)" }, "samuelerinaldo.media");
  el(g, { position: "absolute", left: ax + ad + w * 0.03 + w * 0.5, top: ay - w * 0.04, padding: `${w * 0.008}px ${w * 0.03}px`, borderRadius: w * 0.02, border: "2px solid rgba(255,255,255,.85)", fontFamily: FS, fontWeight: 800, fontSize: w * 0.036, color: "#fff", zIndex: 4 }, "Segui");
  el(g, { position: "absolute", left: ax, top: ay + ad * 0.7, width: w * 0.7, fontFamily: FS, fontWeight: 500, fontSize: w * 0.036, color: "rgba(255,255,255,.9)", whiteSpace: "nowrap", overflow: "hidden", zIndex: 4 }, "Perché nessuno ti scrive? 👇");
  return { g, av, h, avD: ad, avXY: () => [x + ax + ad / 2, y + ay], rect: [x, y, x + w, y + h] };
};

// ── la chat del DM (vecchio stile, dark): chi guardava ti scrive ───────────────────────────────────────────────────────────────────
// o: { nome, sotto, z } → phone2 + { msg(t, testo) (fumetto in arrivo, con i puntini prima), bubbleRect() }
const dmR13 = (parent, X, Y, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw, H = PH.sh;
  el(S, { position: "absolute", left: 14, top: 64, width: 40, height: 40 }, svg("chevron-left", 38, "#fff", 2.4));
  const av = el(S, { position: "absolute", left: 66, top: 58, width: 56, height: 56, borderRadius: "50%", overflow: "hidden" });
  personaK(av, 0, 0, 56, { z: 1 });
  el(S, { position: "absolute", left: 136, top: 60, fontFamily: FS, fontWeight: 800, fontSize: 25, color: "#fff", whiteSpace: "nowrap" }, o.nome || "Nuovo messaggio");
  el(S, { position: "absolute", left: 136, top: 92, fontFamily: FS, fontWeight: 500, fontSize: 19, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }, o.sotto || "Richiesta di messaggio");
  el(S, { position: "absolute", right: 20, top: 70, display: "flex", gap: 24 }, svg("phone", 30, "#fff", 2) + svg("video", 32, "#fff", 2));
  el(S, { position: "absolute", left: 0, top: 136, width: W, height: 1, background: "rgba(255,255,255,.12)" });
  // in alto il profilo di chi scrive (come in Instagram quando la chat è nuova)
  const pav = el(S, { position: "absolute", left: W / 2 - 70, top: 190, width: 140, height: 140, borderRadius: "50%", overflow: "hidden" });
  personaK(pav, 0, 0, 140, { z: 1 });
  el(S, { position: "absolute", left: 0, top: 346, width: W, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: 26, color: "#fff" }, "Ti ha appena scritto");
  el(S, { position: "absolute", left: 0, top: 384, width: W, textAlign: "center", fontFamily: FS, fontWeight: 500, fontSize: 20, color: "rgba(255,255,255,.6)" }, "ha visto il tuo profilo e le tue evidenze");
  // barra in basso
  el(S, { position: "absolute", left: 16, top: H - 108, width: W - 32, height: 72, borderRadius: 36, background: "#1f1f21", display: "flex", alignItems: "center", gap: 16, paddingLeft: 12, fontFamily: FS, fontSize: 22, color: "rgba(255,255,255,.55)" }, `<div style="width:50px;height:50px;border-radius:50%;background:${K.ig};display:flex;align-items:center;justify-content:center">${svg("camera", 28, "#fff", 2.2)}</div>Messaggio…`);
  const bubbles = [];
  let by = 470;
  return Object.assign(P, {
    msg: (t, testo, oo) => {
      oo = oo || {};
      const typing = el(S, { position: "absolute", left: 20, top: by, width: 96, height: 56, borderRadius: 28, background: "#2c2c2e", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0 });
      const dts = [0, 1, 2].map(() => el(typing, { width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,.7)" }));
      tl.to(typing, { opacity: 1, duration: 0.1 }, t);
      dts.forEach((dd, k) => { tl.to(dd, { y: -6, duration: 0.12, yoyo: true, repeat: 1 }, t + 0.05 + k * 0.08); });
      tl.set(typing, { opacity: 0 }, t + (oo.typing || 0.45));
      const b = el(S, { position: "absolute", left: 20, top: by, maxWidth: W - 120, padding: "16px 24px", borderRadius: 28, background: "#2c2c2e", fontFamily: FS, fontWeight: 600, fontSize: oo.fs || 26, lineHeight: 1.3, color: "#fff", opacity: 0 }, testo);
      tl.fromTo(b, { opacity: 0, scale: 0.6, transformOrigin: "0% 100%" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, t + (oo.typing || 0.45));
      bubbles.push(b);
      by += oo.h || 130;
      return b;
    },
    bubbles,
  });
};
