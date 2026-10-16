// ═══ KW kit v2 · CORE — valori misurati sui 150 reel di Kallaway ═════════════════════════════
// Fonte: CATALOGO-ANIMAZIONI (catalogo.json, _analisi/statistiche.json, curve.json, note-effetti.md).
// Tutto è additivo: kit.js resta com'era (reel-01 v4 invariato), le funzioni nuove hanno nomi nuovi.
// Ogni funzione riporta l'ID della voce di catalogo che realizza.

// ── easing: cubic-bezier misurate → funzioni per GSAP (risolutore deterministico, come i browser) ──
const bez = (p1x, p1y, p2x, p2y) => {
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
  const sx = (u) => ((ax * u + bx) * u + cx) * u;
  const sy = (u) => ((ay * u + by) * u + cy) * u;
  const dx = (u) => (3 * ax * u + 2 * bx) * u + cx;
  const solve = (x) => {
    let u = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - x;
      if (Math.abs(e) < 1e-6) return u;
      const d = dx(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    let lo = 0, hi = 1;
    u = x;
    for (let i = 0; i < 32; i++) {
      const v = sx(u);
      if (Math.abs(v - x) < 1e-6) break;
      if (x > v) lo = u; else hi = u;
      u = (lo + hi) / 2;
    }
    return u;
  };
  return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)));
};
const KW = {
  move: bez(0.3, 0.2, 0.35, 0.9),     // K03 · spostamento tra due oggetti (206 misure, mediana 1,31 s)
  arrive: bez(0.2, 0.8, 0.7, 0.95),   // K02 · scena che entra già in corsa dopo un taglio (243 misure)
  drift: bez(0.3, 0.35, 0.55, 0.8),   // K04 · drift lento (1.565 misure)
};
// F01 · glow misurato: testo bianco = alone medio (σ≈7 px) + largo (σ≈45 px); oggetti d'accento molto più forti
const GLOW_T = "0 0 14px rgba(255,255,255,.34), 0 0 90px rgba(255,255,255,.17)";
const GLOW_A = (a) => { a = a == null ? 1 : a; return `0 0 18px rgba(207,251,80,${(0.62 * a).toFixed(3)}), 0 0 110px rgba(207,251,80,${(0.3 * a).toFixed(3)})`; };
const GREY = "rgba(255,255,255,.52)";           // T01 · parola non ancora "accesa"

// ═══ camera ════════════════════════════════════════════════════════════════════════════════
// Gestore di camera: ogni movimento kit2 passa da camK(). Due tween sulla stessa proprietà che si sovrappongono
// "litigano" quando il renderer salta tra i fotogrammi (vince quello renderizzato per ultimo): camK tronca il
// segmento precedente nell'istante in cui parte il nuovo, conservandone esattamente la traiettoria fino al taglio.
// Nei reel nuovi usare SOLO move / float / arrive / cutTo / whip2 / zoomThrough (non cam/drift/whip di kit.js).
const CAMQ = { seg: null };
const easeFn = (e) => (typeof e === "function" ? e : gsap.parseEase(e || "power3.inOut"));
const camTw = (targets, from, to, t, dur, ease) => {
  const tw = gsap.fromTo(targets, from, Object.assign({ duration: dur, ease, immediateRender: false }, to));
  tl.add(tw, t);
  return tw;
};
const camTweens = (t, dur, a, b, ease) => {
  const tw = [
    camTw([pan, gpan], { x: -a.fx, y: -a.fy }, { x: -b.fx, y: -b.fy }, t, dur, ease),
    camTw([zoom, gzoom], { scale: a.s }, { scale: b.s }, t, dur, ease),
  ];
  if (gpan2) {
    tw.push(camTw(gpan2, { x: -a.fx * PF, y: -a.fy * PF }, { x: -b.fx * PF, y: -b.fy * PF }, t, dur, ease));
    tw.push(camTw(gzoom2, { scale: 1 + (a.s - 1) * PF }, { scale: 1 + (b.s - 1) * PF }, t, dur, ease));
  }
  return tw;
};
// tronca il segmento attivo all'istante t; restituisce la posa della camera in quell'istante
const camCut = (t) => {
  const g = CAMQ.seg;
  if (!g) return { fx: CAM.fx, fy: CAM.fy, s: CAM.s };
  if (t >= g.t0 + g.dur - 1e-4) { CAMQ.seg = null; return { fx: g.to.fx, fy: g.to.fy, s: g.to.s }; }
  if (t < g.t0 - 1e-4) throw new Error(`camera: movimento a ${t}s prima del precedente (${g.t0}s) — scrivere le mosse in ordine`);
  const p = Math.max(0, (t - g.t0) / g.dur), ep = g.e(p);
  const mid = { fx: g.from.fx + (g.to.fx - g.from.fx) * ep, fy: g.from.fy + (g.to.fy - g.from.fy) * ep, s: g.from.s + (g.to.s - g.from.s) * ep };
  g.tw.forEach((x) => tl.remove(x));
  if (p > 1e-4 && ep > 1e-6) camTweens(g.t0, t - g.t0, g.from, mid, (x) => g.e(x * p) / ep);
  CAMQ.seg = null;
  return mid;
};
const camK = (t, dur, fx, fy, s, ease) => {
  const from = camCut(t);
  const to = { fx, fy, s: s == null ? from.s : s };
  const e = easeFn(ease);
  CAMQ.seg = { t0: t, dur, from, to, e, tw: camTweens(t, dur, from, to, e) };
  Object.assign(CAM, to);
};
// K03 · spostamento con la curva misurata (parte deciso, frena a lungo)
const move = (t, dur, fx, fy, s) => camK(t, dur == null ? 1.3 : dur, fx, fy, s == null ? CAM.s : s, KW.move);
// K04 · drift con la curva misurata (la camera non è mai ferma)
const float = (t, dur, dx, dy, ds) => camK(t, dur, CAM.fx + (dx || 0), CAM.fy + (dy || 0), CAM.s * (1 + (ds == null ? 0.025 : ds)), KW.drift);
// taglio netto: la camera salta a una posa (un taglio di montaggio dentro la grafica)
const cutTo = (t, fx, fy, s) => {
  camCut(t);
  tl.set([pan, gpan], { x: -fx, y: -fy }, t);
  tl.set([zoom, gzoom], { scale: s }, t);
  if (gpan2) {
    tl.set(gpan2, { x: -fx * PF, y: -fy * PF }, t);
    tl.set(gzoom2, { scale: 1 + (s - 1) * PF }, t);
  }
  Object.assign(CAM, { fx, fy, s });
};
// motion blur direzionale sul mondo (#mbwrap + #mbn): sale e scende attorno al picco
const mblur = (t, dur, peak, axis, shape) => {
  const P = { v: 0 };
  const write = () => mbn.setAttribute("stdDeviation", axis === "y" ? `0 ${P.v.toFixed(2)}` : `${P.v.toFixed(2)} 0`);
  tl.set(mbwrap, { filter: "url(#mb)" }, t);
  if (shape === "decay") tl.fromTo(P, { v: peak }, { v: 0, duration: dur, ease: "power2.out", onUpdate: write, immediateRender: false }, t);
  else {
    tl.fromTo(P, { v: 0 }, { v: peak, duration: dur / 2, ease: "power3.in", onUpdate: write, immediateRender: false }, t);
    tl.to(P, { v: 0, duration: dur / 2, ease: "power3.out", onUpdate: write }, t + dur / 2);
  }
  tl.set(mbwrap, { filter: "none" }, t + dur + 0.01);
};
// K05 · whip pan (spostamento velocissimo con scia), versione con gestore di camera
const whip2 = (t, dur, fx, fy, s, o) => {
  o = o || {};
  const dx = Math.abs(fx - CAM.fx), dy = Math.abs(fy - CAM.fy);
  mblur(t, dur, o.peak || 20, dy > dx ? "y" : "x");
  camK(t, dur, fx, fy, s == null ? CAM.s : s, o.ease || "power3.inOut");
};
// K02 · la scena entra già in movimento e frena sulla sua posa (+ un filo di motion blur nei primi fotogrammi)
// o: { dx, dy (px schermo da cui arriva il contenuto), ds, dur, blur }
const arrive = (t, fx, fy, s, o) => {
  o = o || {};
  const dx = o.dx || 0, dy = o.dy == null ? 360 : o.dy, ds = o.ds == null ? 0.05 : o.ds, dur = o.dur || 1.1;
  cutTo(t, fx - dx / s, fy - dy / s, s * (1 + ds));
  camK(t, dur, fx, fy, s, KW.arrive);
  const pk = o.blur == null ? 9 : o.blur;
  if (pk > 0) mblur(t, 0.3, pk, Math.abs(dx) > Math.abs(dy) ? "x" : "y", "decay");
};
// ── INQUADRATURA "PIENA" (confronto con Kallaway, 562 fotogrammi: area grafica piena al 23,5% dei pixel, contenuto sul
// 58% della superficie; mai sotto 16% / 48% in 3 casi su 4). Kallaway inquadra stretto: l'oggetto riempie l'80–90% della
// larghezza e parte subito sotto il titolo. fitPose calcola la posa di camera che fa entrare il rettangolo del mondo
// [x0, y0, x1, y1] nella zona utile dello schermo (sotto il titolo, sopra sottotitoli e facecam).
const BAND = { x0: 54, x1: 1026, y0: 330, y1: 1372 };
const fitPose = (x0, y0, x1, y1, o) => {
  o = o || {};
  const b = { x0: BAND.x0, x1: BAND.x1, y0: o.top == null ? BAND.y0 : o.top, y1: o.bottom == null ? BAND.y1 : o.bottom };
  const s = Math.min((b.x1 - b.x0) / (x1 - x0), (b.y1 - b.y0) / (y1 - y0)) * (o.fill == null ? 0.94 : o.fill);
  const scx = (b.x0 + b.x1) / 2, scy = (b.y0 + b.y1) / 2;
  return { fx: (x0 + x1) / 2 - (scx - ANCHOR.x) / s, fy: (y0 + y1) / 2 - (scy - ANCHOR.y) / s, s };
};
// sposta la camera sul rettangolo (K03) · fa arrivare la scena in corsa sul rettangolo (K02) · taglio secco sul rettangolo
const frameRect = (t, dur, r, o) => { const p = fitPose(r[0], r[1], r[2], r[3], o); move(t, dur, p.fx, p.fy, p.s); return p; };
const arriveRect = (t, r, o) => { const p = fitPose(r[0], r[1], r[2], r[3], o); arrive(t, p.fx, p.fy, p.s, o); return p; };
const cutRect = (t, r, o) => { const p = fitPose(r[0], r[1], r[2], r[3], o); cutTo(t, p.fx, p.fy, p.s); return p; };
// scia che segue la velocità: il motion blur è al massimo quando la curva è più ripida (K11, K17)
const mblurV = (t, dur, ease, peak, axis) => {
  const e = easeFn(ease), N = 30, v = [];
  for (let i = 0; i <= N; i++) { const a = Math.max(0, i / N - 0.5 / N), b = Math.min(1, i / N + 0.5 / N); v.push((e(b) - e(a)) / (b - a)); }
  const vm = Math.max(...v) || 1;
  const P = { u: 0 };
  const write = () => { const f = P.u * N, i = Math.min(N - 1, Math.floor(f)), r = f - i, s = peak * Math.max(0, v[i] + (v[i + 1] - v[i]) * r) / vm; mbn.setAttribute("stdDeviation", axis === "y" ? `0 ${s.toFixed(2)}` : axis === "xy" ? `${(s * 0.7).toFixed(2)} ${(s * 0.7).toFixed(2)}` : `${s.toFixed(2)} 0`); };
  tl.set(mbwrap, { filter: "url(#mb)" }, t);
  tl.fromTo(P, { u: 0 }, { u: 1, duration: dur, ease: "none", onUpdate: write, immediateRender: false }, t);
  tl.set(mbwrap, { filter: "none" }, t + dur + 0.01);
};
// K17 · la camera viaggia lungo un tracciato (path SVG in coordinate del mondo) da una lunghezza L0 a L1 (anche all'indietro o
// facendo il giro): il centro è il punto del tracciato più uno scostamento che passa da o.off0 a o.off1 (si parte inquadrando
// l'etichetta di partenza e si arriva su quella d'arrivo), la scala va da s0 a s1 (o.dip: quanto si allarga a metà strada).
// Curva di default KW.arrive (parte decisa e frena a lungo, come il reel 79 a 34,7 s). È fatta di segmenti del gestore di
// camera (seek-safe come move/float); una mossa successiva la tronca come sempre. o.cut: true = parte con un taglio.
const pathCam = (t, dur, p, L0, L1, s0, s1, o) => {
  o = o || {};
  const L = p.getTotalLength(), M = 96, pts = [];
  for (let i = 0; i <= M; i++) { const l = (((L0 + (L1 - L0) * (i / M)) % L) + L) % L; const q = p.getPointAtLength(l); pts.push([q.x, q.y]); }
  const o0 = o.off0 || [0, 0], o1 = o.off1 || [0, 0], dip = o.dip || 0, e = easeFn(o.ease || KW.arrive);
  const pose = (u) => {
    const f = u * M, i = Math.min(M - 1, Math.floor(f)), r = f - i;
    return { fx: pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r + o0[0] + (o1[0] - o0[0]) * u, fy: pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r + o0[1] + (o1[1] - o0[1]) * u, s: (s0 + (s1 - s0) * u) * (1 - dip * Math.sin(Math.PI * u)) };
  };
  const a = pose(0);
  if (o.cut !== false) cutTo(t, a.fx, a.fy, a.s);
  const N = o.steps || Math.max(18, Math.round(dur * 30));
  for (let k = 0; k < N; k++) { const c = pose(e((k + 1) / N)); camK(t + (dur * k) / N, dur / N, c.fx, c.fy, c.s, "none"); }
  if (o.blur !== 0) mblurV(t, dur, e, o.blur || 10, o.axis || "xy");
  return { start: a, end: pose(1) };
};
// K10 · la scena nasce fuori fuoco e va a fuoco
const rackFocus = (t, dur, from) => {
  dur = dur || 0.45;
  tl.fromTo(mbwrap, { filter: `blur(${from || 10}px)` }, { filter: "blur(0px)", duration: dur, ease: "power2.out", immediateRender: t <= 0.001 }, t);
  tl.set(mbwrap, { filter: "none" }, t + dur + 0.01);
};
// K07 · zoom-through: corsa in avanti sfocata, dall'altra parte c'è la scena nuova che si assesta
const zoomThrough = (t, fx, fy, s, o) => {
  o = o || {};
  const pre = o.pre || 0.12;
  camK(t - pre, pre, CAM.fx, CAM.fy, CAM.s * 1.3, "power2.in");
  tl.fromTo(mbwrap, { filter: "blur(0px)" }, { filter: `blur(${o.blur || 12}px)`, duration: pre, ease: "power2.in", immediateRender: false }, t - pre);
  cutTo(t, fx, fy, s * 0.86);
  camK(t, o.settle || 0.45, fx, fy, s, "power3.out");
  tl.to(mbwrap, { filter: "blur(0px)", duration: 0.2, ease: "power2.out" }, t);
  tl.set(mbwrap, { filter: "none" }, t + 0.21);
};
// livello di effetti a schermo intero (sopra a tutto): light leak, flash
let FXL = null;
const fxLayer = () => FXL || (FXL = el(document.getElementById("root") || document.body, { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, zIndex: 95, pointerEvents: "none", overflow: "hidden" }));
// K15 · light leak (era podcast): lama di luce calda diagonale + un fotogramma quasi bianco
const lightLeak = (t, o) => {
  o = o || {};
  const L = fxLayer();
  const blade = el(L, { position: "absolute", left: -900, top: -400, width: 900, height: 2800, background: "linear-gradient(90deg, rgba(255,120,40,0) 0%, rgba(255,150,60,.85) 45%, rgba(255,220,150,.95) 55%, rgba(255,120,40,0) 100%)", transform: "rotate(18deg)", opacity: 0, mixBlendMode: "screen" });
  const white = el(L, { position: "absolute", inset: 0, background: o.color || "#fff8ec", opacity: 0 });
  tl.set(blade, { opacity: 1 }, t);
  tl.fromTo(blade, { x: 0 }, { x: 2600, duration: 0.2, ease: "power1.in", immediateRender: false }, t);
  tl.set(blade, { opacity: 0 }, t + 0.2);
  tl.set(white, { opacity: 0.95 }, t + 0.167);
  tl.to(white, { opacity: 0, duration: 0.1, ease: "power2.out" }, t + 0.2);
};

// ═══ immagini dal pool statico (oggetti 3D, foto profilo vere) ══════════════════════════════════
// build.cjs mette ogni file di kw-kit/assets/obj e kw-kit/assets/avatars in un <img id="obj-…"/"av-…"> statico.
// pooledImg restituisce l'originale la prima volta e una copia (senza id) le volte successive.
const pooledImg = (id) => {
  const im = document.getElementById(id);
  if (!im) throw new Error("immagine non nel pool: " + id + " (file in kw-kit/assets/obj o avatars?)");
  if (!im._used) { im._used = true; return im; }
  const c = im.cloneNode(true);
  c.removeAttribute("id");
  c.removeAttribute("data-hf-render-id");
  return c;
};
const imgIn = (parent, id, style) => {
  const im = pooledImg(id);
  Object.assign(im.style, { position: "absolute", left: "0px", top: "0px", width: "100%", height: "100%", objectFit: "contain", display: "block" }, style || {});
  parent.appendChild(im);
  return im;
};
// riquadro con un media del pool: immagine statica (id "th-…", "av-…", "obj-…": copertine, foto, oggetti) oppure video
const mediaTile = (parent, x, y, w, h, id, z) => {
  if (/^(th|av|obj)-/.test(id)) {
    const t = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", background: "#222", zIndex: z || 3 });
    imgIn(t, id, { objectFit: "cover" });
    return t;
  }
  return videoTile(parent, x, y, w, h, id, z);
};
// avatar rotondo con la foto profilo vera (handle = nome del file in assets/avatars, es. "hormozi", "tu")
const avatar = (parent, cx, cy, d, handle, o) => {
  o = o || {};
  const a = el(parent, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: "50%", overflow: "hidden", border: `${o.bw || 4}px solid ${o.ring || K.lime}`, boxShadow: o.ring === "none" ? "0 12px 30px rgba(0,0,0,.5)" : `${GLOW_A(0.6)}, 0 12px 30px rgba(0,0,0,.5)`, background: "#222", zIndex: o.z || 14 });
  // "anon": persona generica (sagoma grigia) per chi non è un profilo vero (la media, uno sconosciuto)
  if (handle === "anon") el(a, { position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "radial-gradient(circle at 50% 30%, #606060, #2e2e2e 75%)" }, svg("user-round", Math.round(d * 0.78), "rgba(255,255,255,.75)", 1.6));
  else imgIn(a, "av-" + handle, { objectFit: "cover" });
  return a;
};

// ═══ testo ═════════════════════════════════════════════════════════════════════════════════
// T01 · T02 · T07 · T08 — titolo parola per parola: ogni parola compare quando viene detta (grigia e sfocata →
// bianca e nitida in 0,2 s); il box d'accento nasce come cursore sottile e cresce insieme alle parole.
// spec: { lines: [[{t:"L'errore "},{t:"numero uno", box:true}], [{t:"dei principianti", hand:true, ul:true}]],
//         size, top, parent (default hud), x, y (centro/alto in coordinate del parent), align }
// inAt(tempi) — tempi: un numero (inizio, ~0,12 s per parola) oppure un array con l'istante di ogni parola.
const titleW = (spec) => {
  const size = spec.size || 84;
  const parent = spec.parent || hud;
  const root = el(parent, { position: "absolute", left: spec.x == null ? 40 : spec.x - 500, top: spec.y == null ? spec.top || TITLE_TOP : spec.y, width: 1000, display: "flex", flexDirection: "column", alignItems: spec.align || "center", gap: spec.gap == null ? Math.round(size * 0.05) : spec.gap, zIndex: spec.z || 50 });
  const W = [];
  const halos = [];
  spec.lines.forEach((line) => {
    const rowEl = el(root, { display: "flex", alignItems: "baseline", justifyContent: "center", whiteSpace: "nowrap" });
    line.forEach((seg) => {
      const hand = !!seg.hand, box = !!seg.box, ul = !!seg.ul;
      const fs = Math.round(size * (hand ? 1.1 : 1) * (seg.scale || 1));
      const toks = [];
      seg.t.split(/(\s+)/).filter(Boolean).forEach((p) => (/^\s+$/.test(p) && toks.length ? (toks[toks.length - 1] += p) : toks.push(p)));
      const grp = el(rowEl, { position: "relative", display: "inline-flex", alignItems: "baseline", margin: box ? `0 ${Math.round(size * 0.05)}px` : 0 }, null, "span");
      const halo = box ? el(grp, { position: "absolute", left: 0, right: 0, top: Math.round(size * 0.02), height: Math.round(size * 1.04), borderRadius: 8, boxShadow: GLOW_A(0.75), opacity: 0, zIndex: 0 }) : null;
      if (halo) halos.push(halo);
      toks.forEach((tk, i) => {
        const first = i === 0, last = i === toks.length - 1;
        const tkTrim = box && last ? tk.replace(/\s+$/, "") : tk;
        const w = el(grp, { position: "relative", display: "inline-block", whiteSpace: "pre", paddingLeft: box && first ? Math.round(size * 0.17) : 0, paddingRight: box && last ? Math.round(size * 0.17) : 0, zIndex: 1 }, null, "span");
        let bg = null, und = null;
        if (box) {
          const rr = Math.round(size * 0.08);
          bg = el(w, { position: "absolute", left: 0, top: Math.round(size * 0.02), width: "100%", height: Math.round(size * 1.04), background: "linear-gradient(180deg,#dcff74 0%,#CFFB50 55%,#bde83f 100%)", borderRadius: `${first ? rr : 0}px ${last ? rr : 0}px ${last ? rr : 0}px ${first ? rr : 0}px`, transformOrigin: "0 50%", zIndex: 0 });
          gsap.set(bg, { scaleX: 0 });
        }
        if (ul) {
          und = el(w, { position: "absolute", left: 0, bottom: -Math.round(size * 0.06), width: "100%", height: Math.max(3, Math.round(size * 0.045)), borderRadius: 3, background: K.lime, boxShadow: GLOW_A(0.6), transformOrigin: "0 50%", zIndex: 0 });
          gsap.set(und, { scaleX: 0 });
        }
        const c1 = box ? K.ink : hand ? K.lime : K.white;
        const c0 = hand ? "rgba(207,251,80,.42)" : GREY;
        const tx = el(w, { position: "relative", zIndex: 1, fontFamily: hand ? FH : FD, fontWeight: hand ? 400 : 700, fontSize: fs, lineHeight: 1.04, letterSpacing: hand ? "0" : "-0.01em", color: c0, textShadow: box ? "none" : hand ? GLOW_LT : GLOW_T }, tkTrim.replace(/ /g, "&nbsp;"), "span");
        gsap.set(tx, { opacity: 0, filter: `blur(${hand || fs > size ? 11 : 9}px)`, y: Math.round(size * 0.06) });
        W.push({ w, tx, bg, und, c1, box, first, last, nc: tkTrim.length });
      });
    });
  });
  const auto = (t0) => W.map((_, i) => t0 + i * 0.12);
  let tEnd = 0;
  const inAt = (times) => {
    const T = Array.isArray(times) ? times : auto(times);
    // blocco 3 del ritmo (T02, opzione in coda; senza spec.boxCps non cambia niente): il box d'accento cresce lettera per
    // lettera a boxCps caratteri al secondo dal tempo della sua prima parola, il bordo avanza con le lettere (reel 7 e 1 di
    // Kallaway: «Used To Speedrun His Growth» in ~0,25 s, TPL.T02 usa 100 car/s); le parole del box compaiono quando il bordo le raggiunge
    if (spec.boxCps) {
      let tb = null, acc = 0;
      W.forEach((wd, i) => {
        if (!wd.box) { tb = null; return; }
        if (wd.first || tb == null) { tb = T[Math.min(i, T.length - 1)]; acc = 0; }
        wd.tB = tb + acc / spec.boxCps; wd.dB = Math.max(1, wd.nc) / spec.boxCps; acc += Math.max(1, wd.nc) + 1;
      });
    }
    W.forEach((wd, i) => {
      const t = wd.tB != null ? wd.tB : T[Math.min(i, T.length - 1)];
      tl.to(wd.tx, { opacity: 1, duration: 0.07, ease: "none" }, t);
      tl.to(wd.tx, { filter: "blur(0px)", y: 0, duration: 0.2, ease: "power2.out" }, t);
      tl.to(wd.tx, { color: wd.c1, duration: wd.box ? 0.18 : 0.2, ease: "power2.out" }, t + (wd.box ? 0.05 : 0));
      tl.set(wd.tx, { filter: "none" }, t + 0.21);
      if (wd.bg) {
        if (wd.first) {
          tl.set(wd.bg, { scaleX: 0.035 }, t - 0.07); // il cursore sottile che anticipa il box
        }
        if (wd.dB != null) tl.to(wd.bg, { scaleX: 1, duration: wd.dB, ease: "none" }, t);
        else tl.to(wd.bg, { scaleX: 1, duration: 0.22, ease: "power2.out" }, t);
        if (wd.last) halos.forEach((h) => tl.to(h, { opacity: 1, duration: 0.35, ease: "power1.out" }, t + 0.12));
      }
      if (wd.und) tl.to(wd.und, { scaleX: 1, duration: 0.24, ease: "power2.out" }, t);
      tEnd = Math.max(tEnd, t + 0.21);
    });
    return tEnd;
  };
  // T08 · uscita: il titolo si spegne (grigio) e poi se ne va
  const outAt = (t) => {
    W.forEach((wd) => tl.to(wd.tx, { color: wd.box ? "rgba(30,30,30,.55)" : GREY, duration: 0.15, ease: "power1.out" }, t));
    W.forEach((wd) => wd.bg && tl.to(wd.bg, { opacity: 0.45, duration: 0.15 }, t));
    halos.forEach((h) => tl.to(h, { opacity: 0, duration: 0.15 }, t));
    tl.to(W.map((wd) => wd.w), { opacity: 0, filter: "blur(8px)", y: -10, duration: 0.24, ease: "power2.in", stagger: 0.012 }, t + 0.15);
    tl.set(root, { opacity: 0 }, t + 0.42 + W.length * 0.012);
  };
  return { root, words: W, inAt, outAt, n: W.length };
};
// tempi delle parole dal voice-over (WORDS = [[parola, inizio, fine], …] iniettato da build.cjs)
// wordsFrom(i0, n): gli inizi delle n parole a partire dall'indice i0 · findWord("tutto.", dopo) → indice
const wordsFrom = (i0, n) => WORDS.slice(i0, i0 + n).map((w) => w[1]);
const findWord = (txt, after) => {
  const k = WORDS.findIndex((w, i) => i >= (after || 0) && w[0].toLowerCase().replace(/[^\p{L}\p{N}']/gu, "") === txt.toLowerCase().replace(/[^\p{L}\p{N}']/gu, ""));
  if (k < 0) throw new Error("parola non trovata nel voice-over: " + txt);
  return k;
};
const at = (txt, after) => WORDS[findWord(txt, after)][1];

// T03 · T06 — testo a macchina da scrivere (lettere che compaiono in ordine, con cursore opzionale)
const typeIn = (node, text, t, cps, o) => {
  o = o || {};
  node.innerHTML = "";
  const box = el(node, { display: "inline-block", whiteSpace: "pre" }, null, "span");
  const step = 1 / (cps || 30);
  const cw = Math.max(3, Math.round((o.size || 40) * 0.07));
  const chars = [...text];
  // each glyph carries its own caret (absolute, right after it): no layout measuring, seek-safe
  const cs = chars.map((ch) => {
    const c = el(box, { position: "relative", display: "inline-block", whiteSpace: "pre" }, ch === " " ? "&nbsp;" : ch, "span");
    let k = null;
    if (o.caret) k = el(c, { position: "absolute", right: -cw - 3, top: "0.08em", width: cw, height: "0.92em", background: o.caretColor || K.lime }, null, "span");
    return { c, k };
  });
  gsap.set(cs.map((x) => x.c), { opacity: 0 });
  if (o.caret) gsap.set(cs.map((x) => x.k), { opacity: 0 });
  cs.forEach((x, i) => {
    tl.set(x.c, { opacity: 1 }, t + i * step);
    if (x.k) { tl.set(x.k, { opacity: 1 }, t + i * step); if (i < cs.length - 1) tl.set(x.k, { opacity: 0 }, t + (i + 1) * step); }
  });
  const end = t + cs.length * step;
  if (o.caret && cs.length) {
    const k = cs[cs.length - 1].k;
    for (let i = 0; i < (o.blinks || 3); i++) { tl.set(k, { opacity: 0 }, end + i * 0.5 + 0.25); tl.set(k, { opacity: 1 }, end + i * 0.5 + 0.5); }
    tl.set(k, { opacity: 0 }, end + (o.blinks || 3) * 0.5 + 0.25);
  }
  return end;
};
// T04 — lettere che compaiono in ordine casuale (etichette, corsivi)
const scrambleIn = (node, text, t, dur, seed) => {
  node.innerHTML = "";
  const wrapS = el(node, { display: "inline-block", whiteSpace: "pre" }, null, "span");
  const cs = [...text].map((ch) => el(wrapS, { display: "inline-block", whiteSpace: "pre" }, ch === " " ? "&nbsp;" : ch, "span"));
  gsap.set(cs, { opacity: 0 });
  dur = dur || 0.28;
  cs.forEach((c, i) => {
    const u = (hash(i + 1, seed || 5) + 1) / 2;
    tl.to(c, { opacity: 1, duration: 0.05, ease: "none" }, t + u * dur);
  });
  return t + dur + 0.05;
};
// T05 — testo che si decodifica (glitch): glifi a caso che si fermano sulla parola giusta
const decode = (node, text, t, dur, o) => {
  o = o || {};
  const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/#%&";
  dur = dur || 0.3;
  node.innerHTML = "";
  const STEP = 1 / 30;
  const wrapD = el(node, { display: "inline-block", whiteSpace: "pre" }, null, "span");
  [...text].forEach((ch, i) => {
    const slot = el(wrapD, { position: "relative", display: "inline-block", whiteSpace: "pre" }, null, "span");
    const fin = el(slot, { display: "inline-block", whiteSpace: "pre" }, ch === " " ? "&nbsp;" : ch, "span");
    gsap.set(fin, { opacity: 0 });
    if (ch === " ") { tl.set(fin, { opacity: 1 }, t); return; }
    const tr = t + (0.35 + 0.65 * (hash(i + 2, o.seed || 9) + 1) / 2) * dur; // quando si ferma
    const n = Math.max(1, Math.round((tr - t) / STEP));
    for (let k = 0; k < n; k++) {
      const g = el(slot, { position: "absolute", left: 0, top: 0, whiteSpace: "pre", color: o.glitchColor || "inherit" }, GL[Math.floor(((hash(i * 31 + k, o.seed || 9) + 1) / 2) * GL.length) % GL.length], "span");
      gsap.set(g, { opacity: 0 });
      tl.set(g, { opacity: 1 }, t + k * STEP);
      tl.set(g, { opacity: 0 }, t + (k + 1) * STEP);
    }
    tl.set(fin, { opacity: 1 }, tr);
  });
  return t + dur;
};
// T11 — parola/numero gigante sullo sfondo (grigio, trasparente), opzionale conteggio
const bigBack = (parent, cx, cy, text, o) => {
  o = o || {};
  const b = el(parent, { position: "absolute", left: cx - 1200, top: cy - (o.size || 520) * 0.62, width: 2400, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: o.size || 520, lineHeight: 1, letterSpacing: "-0.03em", color: "rgba(255,255,255,.075)", zIndex: o.z || 1, whiteSpace: "nowrap" }, text);
  gsap.set(b, { opacity: 0, scale: 0.92 });
  return { b, inAt: (t) => tl.to(b, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, t), outAt: (t) => tl.to(b, { opacity: 0, duration: 0.3 }, t) };
};

// ═══ liste ═════════════════════════════════════════════════════════════════════════════════
// L01 · L02 · L03 · K14 — la lista di Kallaway: barre scure, accento a sinistra, numero, testo sfocato finché
// non viene detto; la pila si ri-centra quando arriva una voce; la voce si "risolve" con uno sheen da destra.
// items: ["Testo 1", …] · o: { h, gap, fs, z, numbers:true, locks (L05: lucchetto a destra, .unlock(i, t)) }
// .rowXY(i) centro della voce i (dopo l'ultimo .show) · .rect(k) rettangolo della pila con k voci (da inquadrare)
const listK = (parent, cx, cy, w, items, o) => {
  o = o || {};
  const h = o.h || 112, gap = o.gap || 22, fs = o.fs || 40;
  const box = el(parent, { position: "absolute", left: cx - w / 2, top: cy, width: w, height: 1, zIndex: o.z || 12 });
  const rows = items.map((txt, i) => {
    const y = i * (h + gap);
    const r = el(box, { position: "absolute", left: 0, top: y, width: w, height: h, borderRadius: 16, background: "linear-gradient(90deg,#272727 0%,#1f1f1f 100%)", border: "1.5px solid rgba(255,255,255,.09)", boxShadow: "0 16px 40px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)", overflow: "hidden" });
    const lit = el(r, { position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(255,255,255,.075),rgba(255,255,255,.03))", opacity: 0 });
    const acc = el(r, { position: "absolute", left: 0, top: 0, width: 7, height: h, background: K.lime, boxShadow: GLOW_A(0.5) });
    const nx = 34;
    const num = el(r, { position: "absolute", left: nx, top: 0, height: h, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(fs * 0.95), color: K.white, letterSpacing: "0.02em" }, o.numbers === false ? "" : String(i + 1).padStart(2, "0"));
    const lx = o.numbers === false ? nx : nx + Math.round(fs * 2.1);
    const mk = (extra) => el(r, Object.assign({ position: "absolute", left: lx, top: 0, right: 24, height: h, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 700, fontSize: fs, color: K.white, whiteSpace: "nowrap", overflow: "hidden" }, extra), txt);
    const soft = mk({ filter: "blur(7px)", opacity: 0.6 });
    const sharp = mk({ clipPath: "inset(0% 0% 0% 100%)", textShadow: GLOW_T });
    const band = el(r, { position: "absolute", top: -h * 0.4, left: 0, width: 46, height: h * 1.8, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 45%, rgba(255,255,255,.85) 50%, rgba(255,255,255,.55) 55%, rgba(255,255,255,0) 100%)", transform: "rotate(20deg)", filter: "blur(1.5px)", opacity: 0, zIndex: 5 });
    // L05 · lucchetto a destra: chiuso finché la voce non si "sblocca" (la barra diventa lime piena, lucchetto aperto)
    let fillL = null, lk = null, lkC = null, lkO = null;
    if (o.locks) {
      fillL = el(r, { position: "absolute", inset: 0, background: limeFill(1), transformOrigin: "0 50%", zIndex: 0 });
      gsap.set(fillL, { scaleX: 0 });
      const ls = Math.round(h * 0.4);
      lk = el(r, { position: "absolute", right: 26, top: h / 2 - ls / 2, width: ls, height: ls, zIndex: 3 });
      lkC = el(lk, { position: "absolute", inset: 0 }, svg("lock", ls, "rgba(255,255,255,.55)", 2.2));
      lkO = el(lk, { position: "absolute", inset: 0, opacity: 0 }, svg("lock-open", ls, K.ink, 2.6));
      [num, soft, sharp].forEach((x) => { x.style.zIndex = 2; });
      soft.style.right = sharp.style.right = `${26 + ls + 18}px`;
    }
    return { r, lit, acc, num, soft, sharp, band, y, fillL, lk, lkC, lkO };
  });
  gsap.set(rows.map((x) => x.r), { opacity: 0 });
  const H = (k) => k * h + (k - 1) * gap;
  let shown = 0, curY = -H(1) / 2;
  gsap.set(box, { y: curY });
  // fa comparire le voci fino alla k-esima (1-based); la pila si ri-centra su cy
  const show = (k, t, o2) => {
    for (let i = shown; i < k; i++) blurIn(rows[i].r, t + (i - shown) * 0.06, { y: 26, blur: 12, dur: 0.45 });
    // blocco 3 del ritmo (L01, opzioni in coda; default di prima 0,4 s power3.out): o2.dur, o2.ease della ri-centratura
    if (!(o2 && o2.noRecentre)) { curY = -H(k) / 2; tl.to(box, { y: curY, duration: (o2 && o2.dur) || 0.4, ease: (o2 && o2.ease) || "power3.out" }, t); }
    shown = Math.max(shown, k);
  };
  // L02 · sheen da destra a sinistra, il testo va a fuoco dietro la banda, poi la barra diventa "attiva"
  const resolve = (i, t, dur) => {
    dur = dur || 0.78;
    const rw = rows[i];
    tl.set(rw.band, { opacity: 1 }, t);
    tl.fromTo(rw.band, { x: w + 40 }, { x: -80, duration: dur, ease: "power1.inOut", immediateRender: false }, t);
    tl.set(rw.band, { opacity: 0 }, t + dur);
    tl.to(rw.sharp, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "power1.inOut" }, t);
    tl.to(rw.soft, { opacity: 0, duration: dur * 0.9, ease: "power1.in" }, t);
    activate(i, t + 0.08);
  };
  const activate = (i, t) => {
    const rw = rows[i];
    tl.to(rw.lit, { opacity: 1, duration: 0.3 }, t);
    tl.to(rw.r, { borderColor: "rgba(255,255,255,.55)", scale: 1.03, boxShadow: "0 18px 46px rgba(0,0,0,.55), 0 0 26px rgba(255,255,255,.10)", duration: 0.3, ease: "power2.out" }, t);
  };
  const deactivate = (i, t) => {
    const rw = rows[i];
    tl.to(rw.lit, { opacity: 0, duration: 0.25 }, t);
    tl.to(rw.r, { borderColor: "rgba(255,255,255,.09)", scale: 1, boxShadow: "0 16px 40px rgba(0,0,0,.45)", duration: 0.25 }, t);
  };
  // L03 · accensione a cascata (bordo bianco che scende di barra in barra)
  // (reel 13: un riflesso bianco scende di barra in barra, ~0,08 s tra una e l'altra)
  const cascade = (t, stepT) => rows.forEach((rw, i) => {
    tl.to(rw.r, { borderColor: "rgba(255,255,255,.7)", duration: 0.08 }, t + i * (stepT || 0.08));
    tl.to(rw.r, { borderColor: "rgba(255,255,255,.09)", duration: 0.25 }, t + i * (stepT || 0.08) + 0.1);
    sheenK(rw.r, t + i * (stepT || 0.08), { dur: 0.5, a: 0.55, w: 60 });
  });
  // L05 · la voce si sblocca (reel 61 e 96 di Kallaway): cambio di stato secco — la barra si riempie di lime da sinistra in
  // 0,2 s, testo e numero diventano scuri e nitidi, il lucchetto si apre con un piccolo colpo, alone lime
  const unlock = (i, t) => {
    const rw = rows[i];
    if (!rw.fillL) throw new Error("listK: unlock() vuole l'opzione { locks: true }");
    tl.to(rw.fillL, { scaleX: 1, duration: 0.2, ease: "power2.out" }, t);
    tl.to(rw.soft, { opacity: 0, duration: 0.12 }, t);
    tl.set(rw.sharp, { clipPath: "inset(0% 0% 0% 0%)" }, t);
    tl.to(rw.sharp, { color: K.ink, textShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.14 }, t + 0.04);
    tl.to(rw.num, { color: K.ink, duration: 0.14 }, t + 0.04);
    tl.to(rw.acc, { opacity: 0, duration: 0.1 }, t);
    tl.to(rw.lkC, { opacity: 0, duration: 0.08 }, t + 0.06);
    tl.to(rw.lkO, { opacity: 1, duration: 0.08 }, t + 0.06);
    tl.fromTo(rw.lk, { scale: 1.35 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t + 0.06);
    tl.to(rw.r, { borderColor: "rgba(244,255,208,.9)", boxShadow: `0 16px 40px rgba(0,0,0,.45), ${GLOW_A(0.55)}`, duration: 0.22 }, t);
    tl.fromTo(rw.r, { scale: 1.04 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, t);
  };
  // le altre voci si attenuano (focus) / tornano
  const dimOthers = (i, t, a) => rows.forEach((rw, j) => j !== i && tl.to(rw.r, { opacity: a == null ? 0.35 : a, duration: 0.3 }, t));
  // K14 · la voce i sale e diventa l'intestazione (coordinate nel parent), il resto se ne va
  const promote = (i, t, x, y, s) => {
    const rw = rows[i];
    rows.forEach((o3, j) => j !== i && blurOut(o3.r, t, { dur: 0.3 }));
    const bx = cx - w / 2, by = cy + curY;
    tl.to(rw.r, { x: x - (bx + w / 2), y: y - (by + rw.y + h / 2), scale: s || 0.8, duration: 0.45, ease: "power3.inOut" }, t);
  };
  return { box, rows, show, resolve, activate, deactivate, cascade, dimOthers, promote, unlock, h, gap, rowXY: (i) => [cx, cy + curY + rows[i].y + h / 2], rect: (k) => [cx - w / 2 - 12, cy - H(k || items.length) / 2 - 12, cx + w / 2 + 12, cy + H(k || items.length) / 2 + 12] };
};

// ═══ luce ed enfasi ════════════════════════════════════════════════════════════════════════
// F02 · pulse: disco pieno dell'accento (versione profonda) con contorno chiaro: nasce da un punto, si espande
// in 0,22 s e svanisce allargandosi. o: { r, a, z, front }
// blocco 2 del ritmo (opzioni in coda, default di prima): o.cresce (s, 0.22), o.svanisce (s, 0.5), o.allarga (scala finale, 1.13)
const pulse = (parent, x, y, t, o) => {
  o = o || {};
  const R = o.r || 230;
  // lime pieno (non scurito: il lime scuro diventa verde oliva), contorno chiaro e bagliore
  const d = el(parent, { position: "absolute", left: x - R, top: y - R, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 50% 42%, #eaffa6 0%, #d6fd62 38%, #CFFB50 62%, #bce63f 100%)", border: "3px solid rgba(255,255,255,.92)", boxShadow: "0 0 60px rgba(207,251,80,.55), inset 0 0 50px rgba(255,255,255,.22)", opacity: 0, zIndex: o.z || 2, pointerEvents: "none" });
  gsap.set(d, { scale: 0.035 });
  tl.set(d, { opacity: o.a == null ? (o.front ? 0.5 : 0.9) : o.a }, t);
  const cr = o.cresce || 0.22;
  tl.to(d, { scale: 1, duration: cr, ease: "expo.out" }, t);
  tl.to(d, { scale: o.allarga || 1.13, opacity: 0, duration: o.svanisce || 0.5, ease: "power1.in" }, t + cr);
  return d;
};
// F09/D01 · flash di glow su un numero/testo appena arrivato al valore finale
const glowFlash = (node, t, o) => {
  o = o || {};
  const base = o.base || GLOW_T;
  tl.to(node, { textShadow: o.peak || "0 0 18px rgba(255,255,255,.95), 0 0 60px rgba(255,255,255,.6), 0 0 120px rgba(207,251,80,.35)", duration: 0.07, ease: "power2.out" }, t);
  tl.to(node, { textShadow: base, duration: 0.35, ease: "power2.out" }, t + 0.08);
};
// F04 · riflettore: gli scelti si accendono, il resto si scurisce
const spotlight = (keep, dim, t, o) => {
  o = o || {};
  if (dim && dim.length) tl.to(dim, { opacity: o.a == null ? 0.32 : o.a, duration: 0.4, ease: "power2.out" }, t);
  if (keep && keep.length) tl.to(keep, { scale: o.s || 1.05, boxShadow: `${GLOW_A(0.9)}, 0 0 0 3px ${K.lime}`, duration: 0.4, ease: "power2.out" }, t);
};
// F11 · tinta: "si" = verde-lime (giusto), "no" = spento e desaturato (sbagliato)
const tint = (target, t, kind, o) => {
  o = o || {};
  const ts = Array.isArray(target) ? target : [target];
  ts.forEach((tg, i) => {
    const tt = t + i * (o.stagger || 0);
    if (kind === "si") {
      const ov = el(tg, { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(207,251,80,.34), rgba(207,251,80,.16))", mixBlendMode: "screen", opacity: 0, zIndex: 20, pointerEvents: "none", borderRadius: "inherit" });
      tl.to(ov, { opacity: 1, duration: 0.25 }, tt);
      tl.to(tg, { boxShadow: `${GLOW_A(0.8)}, 0 0 0 3px ${K.lime}`, duration: 0.25 }, tt);
    } else {
      tl.to(tg, { filter: "grayscale(1) brightness(.42)", duration: 0.3, ease: "power2.out" }, tt);
    }
  });
};
// F05 · lampeggio di attivazione: alterna due stati ogni 2 fotogrammi e si ferma sul nuovo
const flicker = (node, t, a, b, dur) => {
  dur = dur || 0.3;
  const n = Math.round(dur / (2 / 30));
  for (let k = 0; k <= n; k++) tl.set(node, k % 2 ? a : b, t + k * (2 / 30));
  tl.set(node, b, t + (n + 1) * (2 / 30));
};

// ═══ dati ══════════════════════════════════════════════════════════════════════════════════
// D02 · badge views (pill con occhio) — poppano in sequenza
const viewBadge = (parent, cx, cy, text, o) => {
  o = o || {};
  const fs = o.fs || 26;
  const b = el(parent, { position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: Math.round(fs * 0.35), padding: `${Math.round(fs * 0.22)}px ${Math.round(fs * 0.55)}px`, borderRadius: Math.round(fs * 0.5), background: o.dark ? "rgba(20,20,20,.85)" : K.lime, color: o.dark ? K.white : K.ink, fontFamily: FS, fontWeight: 800, fontSize: fs, whiteSpace: "nowrap", boxShadow: o.dark ? "0 8px 20px rgba(0,0,0,.5)" : `0 8px 20px rgba(0,0,0,.45), ${GLOW_A(0.45)}`, zIndex: o.z || 30 }, svg("eye", Math.round(fs * 1.05), o.dark ? K.lime : K.ink, 2.4) + text);
  b.setAttribute("data-layout-allow-overlap", "");
  gsap.set(b, { opacity: 0, scale: 0.8 });
  return b;
};
const popSeq = (els, t, gap) => els.forEach((e, i) => {
  tl.to(e, { opacity: 1, duration: 0.08 }, t + i * (gap || 0.08));
  tl.to(e, { scale: 1, duration: 0.32, ease: "back.out(2.4)" }, t + i * (gap || 0.08));
});
// D01 · U05 — card dati in vetro: etichetta, numero che conta (lineare, si ferma sulla parola), grafico che sale,
// punto finale con anello, flash di glow sul numero. o: { label, icon, fmt, chart:true, w, h }
const statCard = (parent, x, y, o) => {
  o = o || {};
  const w = o.w || 560, h = o.h || 330;
  const c = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, background: "linear-gradient(180deg, rgba(58,58,58,.92) 0%, rgba(34,34,34,.95) 45%, rgba(24,24,24,.97) 100%)", border: "1.5px solid rgba(255,255,255,.16)", boxShadow: "0 34px 90px rgba(0,0,0,.6), inset 0 1.5px 0 rgba(255,255,255,.12)", overflow: "hidden", zIndex: o.z || 14 });
  el(c, { position: "absolute", left: 30, top: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: FS, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,.85)" }, (o.icon ? svg(o.icon, 26, "rgba(255,255,255,.85)", 2.2) : "") + (o.label || ""));
  const num = el(c, { position: "absolute", left: 28, top: 62 + Math.max(0, ((o.fs || 92) - 92) * 0.32), fontFamily: FD, fontWeight: 700, fontSize: o.fs || 92, lineHeight: 1, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, o.start || "0");
  let line = null, area = null, dot = null, ring = null;
  if (o.chart !== false) {
    const S = document.createElementNS(NS, "svg");
    S.setAttribute("width", w); S.setAttribute("height", h); S.setAttribute("viewBox", `0 0 ${w} ${h}`);
    Object.assign(S.style, { position: "absolute", left: 0, top: 0, overflow: "visible" });
    c.appendChild(S);
    const x0 = 40, x1 = w - 46, y0 = h - 34, y1 = h * 0.5;
    const P = o.points || [[0, 0], [0.18, 0.12], [0.34, 0.3], [0.48, 0.34], [0.62, 0.62], [0.78, 0.72], [1, 1]];
    const pts = P.map(([u, v]) => [x0 + (x1 - x0) * u, y0 - (y0 - y1) * v]);
    const d = "M" + pts.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join(" L");
    // area under the line (revealed with a clip rect that grows with the line)
    const gid = "sg" + ++SVGN, cid = "sc" + SVGN;
    // sotto la linea un velo bianco (il lime non è mai trasparente: diventerebbe verde oliva); KW_FISSO tiene quello approvato
    const vc = KW_FISSO ? "#CFFB50" : "#ffffff", va = KW_FISSO ? ".38" : ".2";
    S.innerHTML = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${vc}" stop-opacity="${va}"/><stop offset="1" stop-color="${vc}" stop-opacity="0"/></linearGradient><clipPath id="${cid}"><rect x="0" y="0" width="0" height="${h}"/></clipPath></defs>`;
    area = document.createElementNS(NS, "path");
    area.setAttribute("d", d + ` L${x1} ${y0} L${x0} ${y0} Z`); area.setAttribute("fill", `url(#${gid})`); area.setAttribute("clip-path", `url(#${cid})`);
    S.appendChild(area);
    el(c, { position: "absolute", left: x0, top: y0, width: x1 - x0, height: 1.5, background: "rgba(255,255,255,.22)" });
    line = document.createElementNS(NS, "path");
    line.setAttribute("d", d); line.setAttribute("fill", "none"); line.setAttribute("stroke", K.lime); line.setAttribute("stroke-width", 5);
    line.setAttribute("stroke-linecap", "round"); line.setAttribute("stroke-linejoin", "round");
    line.style.filter = "drop-shadow(0 0 8px rgba(207,251,80,.75))";
    S.appendChild(line);
    const L = line.getTotalLength();
    line.setAttribute("stroke-dasharray", `${L} ${L}`); line.setAttribute("stroke-dashoffset", L);
    const end = pts[pts.length - 1];
    ring = el(c, { position: "absolute", left: end[0] - 16, top: end[1] - 16, width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(255,255,255,.9)", boxShadow: GLOW_A(0.7), opacity: 0 });
    dot = el(c, { position: "absolute", left: end[0] - 7, top: end[1] - 7, width: 14, height: 14, borderRadius: "50%", background: K.white, boxShadow: "0 0 12px #fff", opacity: 0 });
    c._clip = S.getElementsByTagName("rect")[0];
    c._L = L; c._x1 = x1;
  }
  const count = (t, from, to, dur, fmt, ease) => {
    const P = { v: from };
    const f = fmt || ((v) => itNum(v));
    num.textContent = f(from);
    tl.to(P, { v: to, duration: dur, ease: ease || "none", onUpdate: () => (num.textContent = f(P.v)) }, t);
    if (line) {
      tl.to(line, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: ease || "none" }, t);
      tl.to(c._clip, { attr: { width: c._x1 + 10 }, duration: dur, ease: ease || "none" }, t);
      tl.to([dot, ring], { opacity: 1, duration: 0.15 }, t + dur - 0.05);
      tl.fromTo(ring, { scale: 0.4 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, t + dur - 0.05);
    }
    glowFlash(num, t + dur);
  };
  // U05 (reel 9): la card entra di lato in corsa (0,45 s, scia che si scarica) e frena sulla sua posa; o: { from: 1 da destra,
  // -1 da sinistra, dist (px, 520), dur (0.45) }
  const slideIn = (t, o2) => {
    o2 = o2 || {};
    const dir = o2.from || 1, dist = o2.dist || 520, dur = o2.dur || 0.45;
    tl.fromTo(c, { x: dir * dist, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: dur, ease: KW.arrive, immediateRender: false }, t);
    tl.set(c, { filter: "none" }, t + dur + 0.01);
  };
  if (o.hidden) gsap.set(c, { opacity: 0 });
  return { c, num, count, slideIn };
};

// ═══ connettori ════════════════════════════════════════════════════════════════════════════
// C04 · linea guida + etichetta che si scrive parola per parola sopra la linea
// (x0,y0) punto d'attacco → (x1,y1) fine linea; l'etichetta si appoggia sulla linea (sopra), allineata al lato giusto
const leader = (parent, S, x0, y0, x1, y1, text, o) => {
  o = o || {};
  const cn = connector(S, [[x0, y0], [x1, y1]], { color: o.color || "rgba(255,255,255,.85)", w: o.w || 2.5 });
  const right = x1 >= x0;
  const lab = el(parent, { position: "absolute", left: right ? Math.min(x0, x1) + 12 : Math.min(x0, x1), top: y1 - (o.fs || 30) * 1.25, width: Math.abs(x1 - x0) - 12, textAlign: right ? "right" : "left", fontFamily: FS, fontWeight: 700, fontSize: o.fs || 30, color: K.white, whiteSpace: "nowrap", textShadow: GLOW_T, zIndex: o.z || 20 });
  const words = text.split(" ").map((wd, i, a) => el(lab, { display: "inline-block", whiteSpace: "pre" }, wd + (i < a.length - 1 ? " " : ""), "span"));
  gsap.set(words, { opacity: 0, filter: "blur(6px)", color: GREY });
  // pallino luminoso nel punto d'attacco (come nelle linee guida di Kallaway)
  const dot = o.dot === false ? null : el(parent, { position: "absolute", left: x0 - 8, top: y0 - 8, width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff, 0 0 22px rgba(207,251,80,.8)", opacity: 0, zIndex: (o.z || 20) + 1 });
  return {
    cn, lab, words, dot,
    draw: (t, dur) => { if (dot) tl.fromTo(dot, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)", immediateRender: false }, t); cn.draw(t, dur || 0.4, "power2.out"); },
    write: (times) => {
      const T = Array.isArray(times) ? times : words.map((_, i) => times + i * 0.12);
      words.forEach((wd, i) => {
        tl.to(wd, { opacity: 1, duration: 0.06 }, T[i]);
        tl.to(wd, { filter: "blur(0px)", color: K.white, duration: 0.2, ease: "power2.out" }, T[i]);
        tl.set(wd, { filter: "none" }, T[i] + 0.21);
      });
    },
  };
};
// C02 · linea che diventa un flusso di puntini luminosi che scorre (traffico)
const flowLine = (S, d, t, o) => {
  o = o || {};
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", d); p.setAttribute("fill", "none");
  p.setAttribute("stroke", o.color || "#fff"); p.setAttribute("stroke-width", o.r || 8);
  p.setAttribute("stroke-linecap", "round");
  const gapPx = o.gap || 16;
  p.setAttribute("stroke-dasharray", `0 ${gapPx}`);
  p.style.filter = `drop-shadow(0 0 6px ${o.glow || "rgba(255,255,255,.8)"})`;
  S.appendChild(p);
  const L = p.getTotalLength();
  // propagation from the start (mask), then a continuous flow
  const id = "fm" + ++SVGN;
  const m = document.createElementNS(NS, "mask");
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  m.setAttribute("x", "-60000"); m.setAttribute("y", "-60000"); m.setAttribute("width", "200000"); m.setAttribute("height", "200000");
  const mp = document.createElementNS(NS, "path");
  mp.setAttribute("d", d); mp.setAttribute("fill", "none"); mp.setAttribute("stroke", "#fff"); mp.setAttribute("stroke-width", (o.r || 8) + 16);
  mp.setAttribute("stroke-dasharray", `${L} ${L}`); mp.setAttribute("stroke-dashoffset", L);
  m.appendChild(mp); S._defs.appendChild(m);
  p.setAttribute("mask", `url(#${id})`);
  tl.to(mp, { attr: { "stroke-dashoffset": 0 }, duration: o.grow || 0.18, ease: "power1.out" }, t);
  const flowDur = o.dur || 3;
  tl.fromTo(p, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -(o.speed || 90) * flowDur }, duration: flowDur, ease: "none", immediateRender: false }, t);
  return p;
};

// ═══ segnali ed effetti ════════════════════════════════════════════════════════════════════
// C03 · segnale col segno che viaggia sul connettore (reel 40 di Kallaway): un disco con "+" (lime pieno: segnale buono) o "−"
// (grafite col bordo bianco: segnale cattivo) percorre la linea in ~0,4 s (power1.inOut) e all'arrivo il punto d'arrivo pulsa.
// parent = layer del mondo che contiene lo svgLayer del connettore · conn = connector(...) · o: { sign: "+" | "-", d (46), z,
//   ring (true: anello all'arrivo), back (true: dall'ultimo punto al primo) } · restituisce l'istante d'arrivo
const signal = (parent, conn, t, dur, o) => {
  o = o || {};
  dur = dur || 0.4;
  const plus = o.sign !== "-" && o.sign !== "−", d = o.d || 46, N = 40, PTS = [];
  for (let i = 0; i <= N; i++) { const pt = conn.p.getPointAtLength(((o.back ? N - i : i) / N) * conn.L); PTS.push([pt.x, pt.y]); }
  const g = el(parent, { position: "absolute", left: -d / 2, top: -d / 2, width: d, height: d, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: o.z || 30, pointerEvents: "none",
    background: plus ? "radial-gradient(circle at 38% 30%, #f6ffd8 0%, #dcff74 38%, #CFFB50 64%, #a9d436 100%)" : "radial-gradient(circle at 38% 30%, #5a5a5a 0%, #333 55%, #1c1c1c 100%)",
    border: plus ? "2.5px solid #f4ffd0" : "2.5px solid rgba(255,255,255,.92)", boxShadow: plus ? `${GLOW_A(0.9)}, 0 6px 14px rgba(0,0,0,.45)` : "0 0 14px rgba(255,255,255,.45), 0 6px 14px rgba(0,0,0,.5)" },
    svg(plus ? "plus" : "minus", Math.round(d * 0.62), plus ? K.ink : "#ffffff", 3.4));
  layered(g);
  const P = { u: 0 };
  const put = () => { const f = P.u * N, i = Math.min(N - 1, Math.floor(f)), r = f - i; gsap.set(g, { x: PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * r, y: PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * r }); };
  put();
  gsap.set(g, { opacity: 0, scale: 0.4 });
  tl.to(g, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, t);
  tl.fromTo(P, { u: 0 }, { u: 1, duration: dur, ease: o.ease || "power1.inOut", onUpdate: put, immediateRender: false }, t);
  tl.to(g, { opacity: 0, scale: 0.5, duration: 0.12, ease: "power2.in" }, t + dur);
  const [ex, ey] = PTS[N];
  if (o.ring !== false) ripple(parent, ex, ey, t + dur - 0.02, { r: d * 0.9, s0: 0.5, s1: 1.6, w: 3, dur: 0.4, color: plus ? K.lime : "#ffffff", glow: plus, z: (o.z || 30) - 1 });
  return t + dur;
};

// F10 · disintegrazione (reel 40 di Kallaway): il riquadro si sbriciola dai bordi verso il centro in una polvere fitta che vola via
// allargandosi e si spegne (~0,7 s). Le particelle sono pezzi veri dell'immagine (stessi colori) disegnati su un canvas, con la
// scia nella direzione del volo (migliaia di particelle, deterministiche, seek-safe); qualche scintilla bianca dà la luce.
// node = elemento da sostituire (si spegne all'istante t); x, y, w, h = il suo riquadro nel parent; id = immagine del pool
// ("th-…", "av-…", "obj-…") che ne ricopre il contenuto (object-fit: cover). o: { cols (52), dur (0.7), spread (480), up (60),
//   sparks (40), z } → { cv, end } · misurato sul reel 40: il centro si sbriciola entro 0,13 s, la nuvola resta fitta fino al taglio
const disintegrate = (parent, node, x, y, w, h, id, t, o) => {
  o = o || {};
  const cols = o.cols || 52, pw = w / cols, rows = Math.max(1, Math.round(h / pw)), ph = h / rows;
  const dur = o.dur || 0.7, sp = o.spread || 480, z = o.z || 30, up = o.up == null ? 60 : o.up, RS = 1.5;
  const M = Math.round(sp * 1.25 + 60), CW = Math.round(w + 2 * M), CH = Math.round(h + 2 * M);
  const cv = layered(el(parent, { position: "absolute", left: x - M, top: y - M, width: CW, height: CH, zIndex: z, pointerEvents: "none" }, null, "canvas"));
  cv.setAttribute("data-layout-allow-occlusion", "");
  cv.width = Math.round(CW * RS); cv.height = Math.round(CH * RS);
  const ctx = cv.getContext("2d");
  const img = document.getElementById(id);
  if (!img) throw new Error("disintegrate: immagine non nel pool: " + id);
  const PT = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const k = r * cols + c, dx = (c + 0.5) * pw - w / 2, dy = (r + 0.5) * ph - h / 2;
    const edge = Math.max(Math.abs(dx) / (w / 2), Math.abs(dy) / (h / 2));
    const n1 = (hash(k + 1, 11) + 1) / 2, n2 = hash(k + 7, 23), n3 = (hash(k + 3, 31) + 1) / 2;
    const ang = Math.atan2(dy, dx || 0.001) + n2 * 0.7, dist = sp * (0.3 + 0.7 * n1) * (0.55 + 0.45 * edge);
    PT.push({ c, r, d0: (1 - edge) * 0.12 + n3 * 0.04, vx: Math.cos(ang) * dist, vy: Math.sin(ang) * dist - up * n3, s1: 0.32 + 0.3 * n1 });
  }
  const SPK = [];
  for (let k = 0; k < (o.sparks == null ? 40 : o.sparks); k++) {
    const a = (k / 40) * Math.PI * 2 + hash(k, 41) * 0.5, n = (hash(k, 43) + 1) / 2;
    SPK.push({ x0: w / 2 + Math.cos(a) * w * 0.32, y0: h / 2 + Math.sin(a) * h * 0.32, vx: Math.cos(a) * sp * (0.6 + 0.6 * n), vy: Math.sin(a) * sp * (0.6 + 0.6 * n) - 40, d0: 0.04 + n * 0.16, r: 2 + 2.5 * n });
  }
  const total = 0.16 + dur;
  const U = { v: 0 };
  const draw = () => {
    ctx.setTransform(RS, 0, 0, RS, 0, 0);
    ctx.clearRect(0, 0, CW, CH);
    if (U.v <= 0 || U.v >= 1) return;
    const now = U.v * total, iw = img.naturalWidth || w, ih = img.naturalHeight || h;
    const sc = Math.max(w / iw, h / ih), sx0 = (iw - w / sc) / 2, sy0 = (ih - h / sc) / 2, kx = 1 / sc;
    for (const q of PT) {
      const p = Math.max(0, Math.min(1, (now - q.d0) / dur)), bx = M + q.c * pw, by = M + q.r * ph, sx = sx0 + q.c * pw * kx, sy = sy0 + q.r * ph * kx;
      if (p <= 0) { ctx.globalAlpha = 1; ctx.drawImage(img, sx, sy, pw * kx, ph * kx, bx, by, pw + 0.6, ph + 0.6); continue; }
      // la polvere continua ad allargarsi (reel 40: si espande fino all'ultimo fotogramma): metà lineare, metà power2.out
      const e = 0.55 * p + 0.45 * (1 - (1 - p) * (1 - p)), v = 0.55 + 0.9 * (1 - p), sz = pw * (1 + (q.s1 - 1) * Math.min(1, p / 0.55));
      const a = p < 0.85 ? 1 : Math.max(0, 1 - (p - 0.85) / 0.15);
      if (a <= 0) continue;
      const cx = bx + pw / 2 + q.vx * e, cy = by + ph / 2 + q.vy * e;
      // scia: copie più trasparenti all'indietro lungo la velocità
      for (let k = 3; k >= 0; k--) {
        const bk = k * 0.011 * v;
        ctx.globalAlpha = a * (k ? 0.22 : 1);
        ctx.drawImage(img, sx, sy, pw * kx, ph * kx, cx - sz / 2 - q.vx * bk, cy - sz / 2 - q.vy * bk, sz, sz);
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255,255,255,.9)"; ctx.shadowBlur = 10;
    for (const q of SPK) {
      const p = Math.max(0, Math.min(1, (now - q.d0) / (dur * 0.9)));
      if (p <= 0 || p >= 1) continue;
      const e = 1 - (1 - p) * (1 - p);
      ctx.globalAlpha = p < 0.45 ? 1 : 1 - (p - 0.45) / 0.55;
      ctx.beginPath(); ctx.arc(M + q.x0 + q.vx * e, M + q.y0 + q.vy * e, q.r * (1 - 0.5 * p), 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  };
  if (node) tl.set(node, { opacity: 0 }, t);
  tl.fromTo(U, { v: 0 }, { v: 1, duration: total, ease: "none", onUpdate: draw, immediateRender: false }, t);
  return { cv, end: t + total };
};

// ═══ blocco 2 del piano (demo-4) ═════════════════════════════════════════════════════════════
// F03 · sheen misurato (reel 5 di Kallaway): una banda bianca stretta (~46 px) inclinata di 20° attraversa la card da DESTRA a
// sinistra in ~0,7 s (power1.inOut), luminosa al centro. (sheen() di kit.js resta per i reel vecchi: va nel verso opposto ed è
// larga e tenue.) card = elemento con overflow nascosto · o: { dur (0.7), w (46), a (0.85), dir (-1 da destra, 1 da sinistra) }
const sheenK = (card, t, o) => {
  o = o || {};
  const dur = o.dur || 0.7, bw = o.w || 46, dir = o.dir || -1;
  const W = parseFloat(card.style.width) || card.offsetWidth || 600, H = parseFloat(card.style.height) || card.offsetHeight || 200;
  const wrap = el(card, { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden", borderRadius: "inherit", pointerEvents: "none", zIndex: o.z || 30 });
  const band = el(wrap, { position: "absolute", top: -H * 0.5, left: 0, width: bw, height: H * 2, transform: "rotate(20deg)", filter: "blur(1.5px)", opacity: 0,
    background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${(0.55 * (o.a || 0.85)).toFixed(2)}) 42%, rgba(255,255,255,${(o.a || 0.85).toFixed(2)}) 50%, rgba(255,255,255,${(0.55 * (o.a || 0.85)).toFixed(2)}) 58%, rgba(255,255,255,0) 100%)` });
  const x0 = dir < 0 ? W + bw : -bw * 2, x1 = dir < 0 ? -bw * 2 : W + bw;
  tl.set(band, { opacity: 1 }, t);
  tl.fromTo(band, { x: x0 }, { x: x1, duration: dur, ease: "power1.inOut", immediateRender: false }, t);
  tl.set(band, { opacity: 0 }, t + dur);
  return band;
};

// K09 · uscita lungo una linea (reel 13 e 14 di Kallaway, misurato): dal punto A dell'oggetto parte una linea con la testa luminosa
// e la camera la insegue in UN solo movimento continuo (~1,15 s: parte piano, corre a metà con la scia, frena sulla scena nuova);
// la testa corre davanti alla camera (si vede crescere) e arriva in B poco prima che la camera si fermi. I titoli che vivono nel
// mondo (titleW({parent: layer})) escono con la scena vecchia; il nuovo si scrive ~0,8 s dopo la partenza della linea.
// S = svgLayer del mondo · pose = posa d'arrivo (fitPose) · o: { dur (1.15), ease (curva della camera), color, w, peak }
const lineExit = (parent, S, a, b, t, pose, o) => {
  o = o || {};
  const dur = o.dur || 1.15, camE = o.ease || bez(0.55, 0.17, 0.38, 0.8);
  const cn = connector(S, [a, b], { color: o.color || "rgba(255,255,255,.9)", w: o.w || 4 });
  cn.p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.7))";
  const N = 40, PTS = [];
  for (let i = 0; i <= N; i++) { const q = cn.p.getPointAtLength((i / N) * cn.L); PTS.push([q.x, q.y]); }
  const head = layered(el(parent, { position: "absolute", left: -11, top: -11, width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 0 14px #fff, 0 0 34px rgba(207,251,80,.9)", opacity: 0, zIndex: 40 }));
  const U = { u: 0 };
  const put = () => {
    const f = U.u * N, i = Math.min(N - 1, Math.floor(f)), r = f - i;
    gsap.set(head, { x: PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * r, y: PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * r });
    cn.p.setAttribute("stroke-dashoffset", (cn.L * (1 - U.u)).toFixed(1));
  };
  tl.set(head, { opacity: 1 }, t);
  tl.fromTo(U, { u: 0 }, { u: 1, duration: dur * 0.85, ease: bez(0.3, 0.05, 0.3, 1), onUpdate: put, immediateRender: false }, t);
  tl.to(head, { opacity: 0, duration: 0.2 }, t + dur * 0.85);
  camK(t, dur, pose.fx, pose.fy, pose.s, camE);
  mblurV(t, dur, camE, o.peak || 18, "x");
  return { cn, end: t + dur };
};

// T09 · una parola del titolo viene sostituita (reel 4 e 46 di Kallaway): la parola si cancella lettera per lettera e la nuova si
// riscrive a macchina (~0,3 s in tutto), il resto del titolo resta. T = titleW(...) · i = indice della parola (in T.words)
const swapWord = (T, i, testo, t, o) => {
  o = o || {};
  const wd = T.words[i], tx = wd.tx;
  const old = (tx.textContent || "").replace(/ /g, " ").replace(/\s+$/, ""), sp = /\s$/.test((tx.textContent || "").replace(/ /g, " ")) ? " " : "";
  const step = o.step || 1 / 40;
  let k = 0;
  for (let n = old.length - 1; n >= 0; n--, k++) tl.set(tx, { textContent: old.slice(0, n) + sp }, t + k * step);
  for (let n = 1; n <= testo.length; n++, k++) tl.set(tx, { textContent: testo.slice(0, n).replace(/ /g, " ") + sp }, t + k * step);
  tl.fromTo(tx, { textShadow: "0 0 18px rgba(255,255,255,.95), 0 0 50px rgba(207,251,80,.6)" }, { textShadow: wd.box ? "none" : GLOW_T, duration: 0.35, immediateRender: false }, t + k * step);
  return t + k * step;
};

// T10 · il titolo si compatta (reel 26 di Kallaway, misurato): taglio secco — il titolo grande sparisce e in alto il titolo compatto
// si scrive parola per parola (~0,1 s l'una) dentro il box d'accento che nasce sottile e si allunga con le parole (come T02), così
// sotto resta tutto lo spazio per lo schema. T = titleW grande · righe = titolo compatto (di solito un solo segmento con box: true)
// o: { size (50), top (150), step (0.1) }
const compactTitle = (T, t, righe, o) => {
  o = o || {};
  tl.set(T.root, { opacity: 0 }, t);
  const C = titleW({ lines: righe, size: o.size || 50, top: o.top == null ? 150 : o.top });
  const st = o.step || 0.1;
  C.inAt(C.words.map((_, k) => t + 0.07 + k * st));
  return C;
};

// A06 · tipografia gigante che diventa l'oggetto (reel 139 e 150 di Kallaway): le parole del hook riempiono lo schermo una alla volta
// (grigie e sfocate → nere/bianche nitide, come T01 ma enormi), poi si ritirano verso l'alto rimpicciolendo e lasciano il posto
// all'oggetto che si monta sotto (es. calendar(...).assemble). spec come titleW (size 170–200) · .retract(t, {scale, y})
const bigType = (spec) => {
  const T = titleW(Object.assign({ size: 190, top: 520, gap: Math.round((spec.size || 190) * 0.16) }, spec));
  T.retract = (t, o) => {
    o = o || {};
    tl.to(T.root, { scale: o.scale || 0.38, y: o.y == null ? -380 : o.y, duration: o.dur || 0.45, ease: o.ease || "power3.inOut", transformOrigin: "50% 0%" }, t);
  };
  return T;
};
