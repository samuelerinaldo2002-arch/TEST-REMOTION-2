// ── KW kit · "stile Kallaway" nel brand di Samuele ─────────────────────────────
// Inlined into every reel's <script> by kw-kit/build.cjs. Expects the shell in
// kw-kit/shell.html: #pan/#zoom (world camera), #gpan/#gzoom (dots camera),
// #shake, #mbwrap + <feGaussianBlur id="mbn"> (whip blur), #hud (screen-space
// titles, never moved by the camera).
//
// Grammar extracted from 40 kallawaymarketing reels (see STILE-KALLAWAY/GUIDA-STILE.md):
//  · persistent title at the top, swapped per section, revealed char-by-char from blur,
//    a highlight box wiping in behind the key words, a second "voice" for accents
//  · dark glossy cards on a near-black dotted field, ONE accent colour (here lime)
//  · everything arrives blur→sharp; things not yet spoken sit there blurred
//  · camera never stops: slow push between beats, whip pans with directional blur
//  · thin connectors (solid / dashed) drawn on, nodes, lists, rings, crowds, counters

const pan = document.getElementById("pan");
const zoom = document.getElementById("zoom");
const gpan = document.getElementById("gpan");
const gzoom = document.getElementById("gzoom");
// optional far layer (bokeh) moving at PF of the camera speed → parallax depth
const gpan2 = document.getElementById("gpan2");
const gzoom2 = document.getElementById("gzoom2");
const PF = 0.45;
const shakeEl = document.getElementById("shake");
const mbwrap = document.getElementById("mbwrap");
const mbn = document.getElementById("mbn");
const hud = document.getElementById("hud");
const $ = (id) => document.getElementById(id);

// ── brand tokens ──
const K = {
  bg: "#1E1E1E", ink: "#1E1E1E", lime: "#CFFB50", white: "#FFFFFF",
  text: "#F4F4F2", mute: "rgba(255,255,255,.55)", faint: "rgba(255,255,255,.28)",
  line: "rgba(255,255,255,.16)", card: "#272727", card2: "#1f1f1f", ig: "#4a5df9",
};
// AE-style glow presets (Kallaway's look is glow everywhere: titles, accents, lines)
const GLOW_W = "0 0 18px rgba(255,255,255,.26), 0 0 46px rgba(255,255,255,.10)";
const GLOW_L = (a) => `0 0 22px rgba(207,251,80,${(0.55 * (a == null ? 1 : a)).toFixed(3)}), 0 0 70px rgba(207,251,80,${(0.22 * (a == null ? 1 : a)).toFixed(3)})`;
const GLOW_LT = "0 0 20px rgba(207,251,80,.45), 0 0 48px rgba(207,251,80,.18)"; // lime text
const FD = '"Advercase", serif';        // display: titles, numbers, captions
const FH = '"Patrick Hand", cursive';   // the "second voice": accents, handwritten notes
const FS = '"Zalando Sans", sans-serif'; // UI: labels inside cards
const ANCHOR = { x: 540, y: 880 };       // screen point the camera centres on

const UNITLESS = new Set(["opacity", "zIndex", "fontWeight", "lineHeight", "flex"]);
const css = (o) => {
  const r = {};
  for (const k in o) r[k] = typeof o[k] === "number" && !UNITLESS.has(k) ? o[k] + "px" : o[k];
  return r;
};
const el = (parent, style, html, tag) => {
  const d = document.createElement(tag || "div");
  Object.assign(d.style, css(style || {}));
  if (html != null) d.innerHTML = html;
  parent.appendChild(d);
  return d;
};
const layered = (d) => (d.setAttribute("data-layout-allow-overlap", ""), d);
const layer = (z, parent) => el(parent || pan, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: z || 1 });
const hx = (h) => [0, 2, 4].map((i) => parseInt(h.replace("#", "").slice(i, i + 2), 16));
const rgba = (a, al) => { const A = hx(a); return `rgba(${A[0]},${A[1]},${A[2]},${al})`; };
const svg = (name, size, color, sw, fill) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill || "none"}" stroke="${color}" stroke-width="${sw || 2}" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none">${ICON[name]}</svg>`;
// deterministic noise (no Math.random in a seekable render)
const hash = (n, seed) => { const x = Math.sin(n * 127.1 + (seed || 1) * 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
const NS = "http://www.w3.org/2000/svg";

const tl = gsap.timeline({ paused: true });

// ═══ camera ═══════════════════════════════════════════════════════════════════
const CAM = { fx: ANCHOR.x, fy: ANCHOR.y, s: 1 };
const camInit = (fx, fy, s) => {
  Object.assign(CAM, { fx, fy, s });
  gsap.set([zoom, gzoom], { transformOrigin: "0 0", scale: s });
  gsap.set([pan, gpan], { x: -fx, y: -fy });
  if (gpan2) {
    gsap.set(gzoom2, { transformOrigin: "0 0", scale: 1 + (s - 1) * PF });
    gsap.set(gpan2, { x: -fx * PF, y: -fy * PF });
  }
};
const cam = (t, dur, fx, fy, s, ease) => {
  tl.to([pan, gpan], { x: -fx, y: -fy, duration: dur, ease: ease || "power3.inOut" }, t);
  tl.to([zoom, gzoom], { scale: s, duration: dur, ease: ease || "power3.inOut" }, t);
  if (gpan2) {
    tl.to(gpan2, { x: -fx * PF, y: -fy * PF, duration: dur, ease: ease || "power3.inOut" }, t);
    tl.to(gzoom2, { scale: 1 + (s - 1) * PF, duration: dur, ease: ease || "power3.inOut" }, t);
  }
  Object.assign(CAM, { fx, fy, s });
};
// far bokeh: big soft lime/white glows in the half-speed space of the parallax layer
const bokeh = (parent, spots) =>
  spots.map(([x, y, r, a, white]) =>
    el(parent, { position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${white ? `rgba(255,255,255,${a})` : rgba(K.lime, a)} 0%, rgba(0,0,0,0) 70%)` }));
// Kallaway's camera never rests: a slow push (or drift) across a hold
const drift = (t, dur, dx, dy, ds) => {
  const fx = CAM.fx + (dx || 0), fy = CAM.fy + (dy || 0), s = CAM.s * (1 + (ds == null ? 0.03 : ds));
  cam(t, dur, fx, fy, s, "sine.inOut");
};
// whip pan: position on power3.inOut, directional blur peaking mid-leg (motion-blur-streak rule)
const whip = (t, dur, fx, fy, s, axis, peak) => {
  peak = peak || 22;
  const P = { v: 0 };
  const write = () => mbn.setAttribute("stdDeviation", axis === "y" ? `0 ${P.v}` : `${P.v} 0`);
  write();
  tl.set(mbwrap, { filter: "url(#mb)" }, t);
  tl.to(P, { v: peak, duration: dur / 2, ease: "power3.in", onUpdate: write }, t);
  tl.to(P, { v: 0, duration: dur / 2, ease: "power3.out", onUpdate: write }, t + dur / 2);
  tl.set(mbwrap, { filter: "none" }, t + dur);
  cam(t, dur, fx, fy, s, "power3.inOut");
};
// world point → screen point under the current CAM (layout helper only)
const toScreen = (wx, wy, c) => { c = c || CAM; return [ANCHOR.x + (wx - c.fx) * c.s, ANCHOR.y + (wy - c.fy) * c.s]; };
// screen point → world point for a camera pose {fx, fy, s} (place things where they will be seen)
const toWorld = (sx, sy, c) => { c = c || CAM; return [c.fx + (sx - ANCHOR.x) / c.s, c.fy + (sy - ANCHOR.y) / c.s]; };

const shake = (t, amp, n) => {
  for (let k = 0; k < n; k++) {
    const f = 1 - k / n;
    tl.to(shakeEl, { x: (k % 2 ? -1 : 1) * amp * f, y: (((k * 5) % 3) - 1) * amp * 0.6 * f, duration: 0.04, ease: "none" }, t + k * 0.04);
  }
  tl.to(shakeEl, { x: 0, y: 0, duration: 0.06, ease: "power1.out" }, t + n * 0.04);
};

// ═══ reveals ══════════════════════════════════════════════════════════════════
// the signature arrival: blur → sharp, a small lift and scale settle
const blurIn = (target, t, o) => {
  o = o || {};
  const b = o.blur == null ? 18 : o.blur;
  gsap.set(target, { opacity: 0, filter: `blur(${b}px)`, y: o.y == null ? 28 : o.y, x: o.x || 0, scale: o.scale == null ? 0.96 : o.scale });
  const d = o.dur || 0.6;
  tl.to(target, { opacity: 1, filter: "blur(0px)", y: 0, x: 0, scale: 1, duration: d, ease: o.ease || "power3.out", stagger: o.stagger || 0 }, t);
  const n = Array.isArray(target) ? target.length : 1;
  tl.set(target, { filter: "none" }, t + d + (o.stagger || 0) * (n - 1) + 0.01);
};
const blurOut = (target, t, o) => {
  o = o || {};
  tl.to(target, { opacity: 0, filter: `blur(${o.blur || 14}px)`, y: o.y || 0, x: o.x || 0, scale: o.scale == null ? 0.97 : o.scale, duration: o.dur || 0.35, ease: "power2.in", stagger: o.stagger || 0 }, t);
};
// "not spoken yet": sharp-but-blurred placeholder that resolves on its cue
const unblur = (target, t, from, dur) => {
  gsap.set(target, { filter: `blur(${from || 9}px)`, opacity: 0.45 });
  tl.to(target, { filter: "blur(0px)", opacity: 1, duration: dur || 0.4, ease: "power2.out" }, t);
  tl.set(target, { filter: "none" }, t + (dur || 0.4) + 0.01);
};
const pop = (target, t, from, ease, dur) => {
  gsap.set(target, { scale: from == null ? 0 : from, opacity: 0 });
  tl.to(target, { opacity: 1, duration: 0.1 }, t);
  tl.to(target, { scale: 1, duration: dur || 0.45, ease: ease || "back.out(2.2)" }, t);
};
const fadeOut = (target, t, dur) => tl.to(target, { opacity: 0, duration: dur || 0.3 }, t);
const counter = (node, from, to, t, dur, ease, fmt) => {
  const o = { v: from };
  tl.to(o, { v: to, duration: dur, ease: ease || "power2.out", onUpdate: () => (node.textContent = fmt ? fmt(o.v) : String(Math.round(o.v))) }, t);
};
const itNum = (v) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const typeText = (node, text, t, dur) => {
  const o = { n: 0 };
  tl.to(o, { n: text.length, duration: dur, ease: "none", onUpdate: () => (node.textContent = text.slice(0, Math.round(o.n))) }, t);
};
// a glossy light sweep across a card (Kallaway's "sheen")
const sheen = (card, t, dur) => {
  const s = el(card, { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "hidden", borderRadius: "inherit", zIndex: 30 });
  const band = el(s, { position: "absolute", left: "-60%", top: "-20%", width: "45%", height: "140%", background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.16) 50%, rgba(255,255,255,0) 100%)", transform: "skewX(-14deg)" });
  gsap.set(band, { x: 0, opacity: 0 });
  tl.set(band, { opacity: 1 }, t);
  tl.to(band, { x: (parseFloat(card.style.width) || 560) * 2.2, duration: dur || 0.9, ease: "power2.inOut" }, t);
  tl.set(band, { opacity: 0 }, t + (dur || 0.9));
};
const glowOn = (target, t, color, r, dur) =>
  tl.to(target, { boxShadow: `0 0 ${r || 60}px ${rgba(color || K.lime, 0.45)}, 0 30px 80px rgba(0,0,0,.55)`, duration: dur || 0.4 }, t);
// a physical flight on a quadratic arc: node is centred on its (x,y) transform (left/top = -w/2,-h/2).
// blur peaks mid-flight (speed), scale/rotation settle on landing. o: {lift, bend, s0, s1, rot0, rotMid, blur, ease, hold}
const arcFly = (node, from, to, t, dur, o) => {
  o = o || {};
  const [x0, y0] = from, [x1, y1] = to;
  const mx = (x0 + x1) / 2 + (o.bend || 0), my = o.straight ? (y0 + y1) / 2 : Math.min(y0, y1) - (o.lift == null ? 160 : o.lift);
  const s0 = o.s0 == null ? 1 : o.s0, s1 = o.s1 == null ? 1 : o.s1, r0 = o.rot0 || 0, bl = o.blur == null ? 7 : o.blur;
  const P = { u: 0 };
  const put = () => {
    const u = P.u, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u, sp = Math.sin(Math.PI * u);
    gsap.set(node, { x: a * x0 + b * mx + c * x1, y: a * y0 + b * my + c * y1, rotation: r0 * (1 - u) + (o.rotMid || 0) * sp, scale: s0 + (s1 - s0) * u, filter: `blur(${(bl * sp).toFixed(2)}px)` });
  };
  put();
  gsap.set(node, { opacity: 0 });
  tl.set(node, { opacity: 1 }, t);
  tl.to(P, { u: 1, duration: dur, ease: o.ease || "power2.inOut", onUpdate: put }, t);
  tl.set(node, { opacity: 0 }, t + dur + (o.hold || 0));
  return { mx, my, d: `M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}` };
};
// expanding ring (impact / pulse)
const ripple = (parent, x, y, t, o) => {
  o = o || {};
  const r = o.r || 200, W = o.wd || r * 2, H = o.ht || r * 2;
  const g = el(parent, { position: "absolute", left: x - W / 2, top: y - H / 2, width: W, height: H, borderRadius: o.radius || "50%", border: `${o.w || 4}px solid ${o.color || K.lime}`, boxShadow: o.glow === false ? "none" : GLOW_L(0.6), opacity: 0, zIndex: o.z || 30, pointerEvents: "none" });
  gsap.set(g, { scale: o.s0 == null ? 0.3 : o.s0 });
  tl.set(g, { opacity: o.a == null ? 0.95 : o.a }, t);
  tl.to(g, { scale: o.s1 || 1, opacity: 0, duration: o.dur || 0.65, ease: "power2.out" }, t);
  return g;
};
// impact sparks: short bars shooting out radially
const sparks = (parent, x, y, t, o) => {
  o = o || {};
  const n = o.n || 10, r0 = o.r0 || 40, r1 = o.r1 || 150, L = o.len || 44;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 360 + hash(i, o.seed || 2) * 14;
    const w = el(parent, { position: "absolute", left: x, top: y, width: 1, height: 1, transform: `rotate(${a}deg)`, zIndex: o.z || 31, pointerEvents: "none" });
    const b = el(w, { position: "absolute", left: 0, top: -3, width: L, height: 6, borderRadius: 3, background: o.color || K.lime, boxShadow: GLOW_L(0.7), transformOrigin: "0 50%" });
    gsap.set(b, { x: r0, scaleX: 0, opacity: 0 });
    tl.set(b, { opacity: 1 }, t);
    tl.to(b, { x: r1 * (0.8 + 0.4 * Math.abs(hash(i, 7))), scaleX: 1, duration: 0.22, ease: "power3.out" }, t);
    tl.to(b, { x: r1 * 1.25, scaleX: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, t + 0.22);
  }
};
// Kallaway section bar: glossy dark bar, solid accent block holding the number, label (+ optional sub)
const sectionBar = (parent, x, y, w, h, num, text, sub, o) => {
  o = o || {};
  const r = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10, background: "linear-gradient(90deg,#2f2f2f 0%,#262626 60%,#3a3a3a 100%)", border: "1.5px solid rgba(255,255,255,.16)", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.1), 0 18px 44px rgba(0,0,0,.5)", overflow: "hidden", zIndex: o.z || 14 });
  const blk = el(r, { position: "absolute", left: 0, top: 0, width: Math.round(h * 0.78), height: h, background: "linear-gradient(180deg,#dcff74,#CFFB50 55%,#b6e23a)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: Math.round(h * 0.46), color: K.ink }, num);
  const lx = Math.round(h * 0.78) + 22;
  const tx = el(r, { position: "absolute", left: lx, top: sub ? Math.round(h * 0.12) : 0, height: sub ? "auto" : h, display: "flex", alignItems: "center", fontFamily: FD, fontWeight: 700, fontSize: o.fs || Math.round(h * 0.44), color: K.white, lineHeight: 1, whiteSpace: "nowrap", textShadow: GLOW_W }, text);
  if (sub) el(r, { position: "absolute", left: lx + 2, top: Math.round(h * 0.62), fontFamily: FS, fontWeight: 600, fontSize: Math.round(h * 0.2), color: K.mute, whiteSpace: "nowrap" }, sub);
  return { r, blk, tx };
};
// Kallaway video card: real footage in a rounded frame with a thin light border, a category chip at the bottom.
// Centred on (cx, cy) through its x/y transform (so it can fly); the inner body takes the entrance animation.
const videoCard = (parent, cx, cy, w, h, vid, o) => {
  o = o || {};
  const wrap = layered(el(parent, { position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, zIndex: o.z || 10 }));
  gsap.set(wrap, { x: cx, y: cy, scale: o.scale || 1, rotation: o.rot || 0 });
  const body = el(wrap, { position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: Math.round(w * 0.07), border: "2px solid rgba(255,255,255,.24)", boxShadow: `0 ${Math.round(w * 0.12)}px ${Math.round(w * 0.3)}px rgba(0,0,0,.6), 0 0 ${Math.round(w * 0.12)}px rgba(255,255,255,.08)`, overflow: "hidden", background: "#111" });
  videoTile(body, 0, 0, w, h, vid, 1);
  if (o.label) {
    const fs = Math.max(14, Math.round(w * 0.085));
    el(body, { position: "absolute", left: 0, bottom: 0, width: w, height: Math.round(h * 0.34), background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.75))", zIndex: 2 });
    el(body, { position: "absolute", left: Math.round(w * 0.07), bottom: Math.round(w * 0.07), display: "flex", alignItems: "center", gap: Math.round(fs * 0.4), padding: `${Math.round(fs * 0.3)}px ${Math.round(fs * 0.6)}px`, borderRadius: Math.round(fs * 0.5), background: "rgba(20,20,20,.72)", border: "1.5px solid rgba(255,255,255,.22)", fontFamily: FS, fontWeight: 700, fontSize: fs, color: K.white, zIndex: 3, whiteSpace: "nowrap" }, (o.icon ? svg(o.icon, Math.round(fs * 1.15), K.white, 2.2) : "") + o.label);
  }
  return { wrap, body };
};
// Kallaway UI highlight: an accent rectangle that snaps onto a region of a screenshot / phone
const highlight = (parent, x, y, w, h, t, o) => {
  o = o || {};
  const b = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: o.r == null ? 10 : o.r, border: `${o.bw || 4}px solid ${o.color || K.lime}`, boxShadow: `${GLOW_L(0.7)}, inset 0 0 24px ${rgba(o.color || K.lime, 0.22)}`, background: rgba(o.color || K.lime, 0.06), opacity: 0, zIndex: o.z || 40, pointerEvents: "none" });
  gsap.set(b, { scale: 1.1 });
  tl.to(b, { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2)" }, t);
  return b;
};
// touch indicator (the viewer's thumb on the screen)
const finger = (parent, z) => {
  const f = el(parent, { position: "absolute", left: -45, top: -45, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.55) 0%, rgba(255,255,255,.25) 60%, rgba(255,255,255,.1) 100%)", border: "3px solid rgba(255,255,255,.9)", boxShadow: "0 10px 30px rgba(0,0,0,.45), 0 0 30px rgba(255,255,255,.25)", opacity: 0, zIndex: z || 60 });
  return f;
};

// ═══ title system (screen-space, top of frame) ════════════════════════════════
// spec = { lines: [[{t:"L'errore "},{t:"n°1",box:true}], [{t:"dei principianti",hand:true}]], size, top }
// returns { root, inAt(t), outAt(t) } — chars arrive left→right from blur, the lime box wipes in
const TITLE_TOP = 168;
// small glossy section badge above a title (Kallaway's icon square)
const iconBadge = (parent, icon, size) => {
  size = size || 66;
  return el(parent, { width: size, height: size, borderRadius: size * 0.24, background: "linear-gradient(160deg,#3c3c3c 0%,#262626 55%,#1d1d1d 100%)", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.14), 0 12px 30px rgba(0,0,0,.5), 0 0 30px rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: Math.round(size * 0.22) }, svg(icon, Math.round(size * 0.52), "#fff", 2));
};
const title = (spec) => {
  const size = spec.size || 82;
  const root = el(hud, { position: "absolute", left: 40, top: spec.top || TITLE_TOP, width: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: Math.round(size * 0.08), zIndex: 50 });
  const badge = spec.icon ? iconBadge(root, spec.icon) : null;
  if (badge) gsap.set(badge, { opacity: 0, scale: 0.6, filter: "blur(8px)" });
  const chars = [], boxes = [];
  spec.lines.forEach((line) => {
    const row = el(root, { display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "nowrap", whiteSpace: "nowrap" });
    line.forEach((seg) => {
      const hand = !!seg.hand, box = !!seg.box;
      const fs = Math.round(size * (hand ? 1.08 : 1) * (seg.scale || 1));
      const wrap = el(row, { position: "relative", display: "inline-flex", alignItems: "baseline", padding: box ? `0 ${Math.round(size * 0.14)}px` : 0, margin: box ? `0 ${Math.round(size * 0.06)}px` : 0 }, null, "span");
      if (box) {
        const b = el(wrap, { position: "absolute", left: 0, top: Math.round(size * 0.04), width: "100%", height: Math.round(size * 1.0), background: "linear-gradient(180deg,#dcff74 0%,#CFFB50 55%,#bde83f 100%)", borderRadius: 6, transformOrigin: "0 50%", zIndex: 0, boxShadow: GLOW_L(0.8) });
        gsap.set(b, { scaleX: 0 });
        boxes.push([b, chars.length]);
      }
      [...seg.t].forEach((ch) => {
        const c = el(wrap, {
          position: "relative", zIndex: 1, display: "inline-block", whiteSpace: "pre",
          fontFamily: hand ? FH : FD, fontWeight: hand ? 400 : 700, fontSize: fs, lineHeight: 1.04,
          letterSpacing: hand ? "0" : "-0.01em", color: box ? K.ink : hand ? K.lime : K.white,
          textShadow: box ? "none" : hand ? GLOW_LT : GLOW_W,
        }, ch === " " ? "&nbsp;" : ch, "span");
        chars.push(c);
      });
    });
  });
  gsap.set(chars, { opacity: 0, filter: "blur(10px)", x: -8 });
  const STEP = spec.step || 0.022;
  const inAt = (t) => {
    if (badge) {
      tl.to(badge, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "back.out(2)" }, t - 0.06);
      tl.set(badge, { filter: "none" }, t + 0.4);
    }
    tl.to(chars, { opacity: 1, filter: "blur(0px)", x: 0, duration: 0.3, ease: "power2.out", stagger: STEP }, t);
    tl.set(chars, { filter: "none" }, t + 0.32 + STEP * chars.length);
    boxes.forEach(([b, i0]) => tl.to(b, { scaleX: 1, duration: 0.42, ease: "expo.out" }, t + i0 * STEP - 0.04));
    return t + 0.3 + STEP * chars.length;
  };
  // exit: chars leave left→right upward into blur, the box wipes away to the right
  const outAt = (t) => {
    if (badge) tl.to(badge, { opacity: 0, scale: 0.7, filter: "blur(8px)", duration: 0.2, ease: "power2.in" }, t);
    tl.to(chars, { opacity: 0, filter: "blur(9px)", y: -16, duration: 0.2, ease: "power2.in", stagger: 0.007 }, t);
    boxes.forEach(([b]) => {
      tl.set(b, { transformOrigin: "100% 50%" }, t);
      tl.to(b, { scaleX: 0, duration: 0.26, ease: "power3.in" }, t + 0.02);
    });
    tl.set(root, { opacity: 0 }, t + 0.22 + chars.length * 0.007);
  };
  return { root, chars, inAt, outAt };
};

// ═══ building blocks ══════════════════════════════════════════════════════════
const CARD_SH = "0 34px 90px rgba(0,0,0,.6), 0 2px 0 rgba(0,0,0,.4), inset 0 1.5px 0 rgba(255,255,255,.09)";
const card = (parent, x, y, w, h, extra) =>
  el(parent, Object.assign({ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, background: "linear-gradient(180deg,#323232 0%,#262626 40%,#1b1b1b 100%)", border: "1.5px solid rgba(255,255,255,.17)", boxShadow: CARD_SH, overflow: "hidden" }, extra || {}));
// small caps label inside cards (Zalando Sans)
const label = (parent, x, y, text, o) =>
  el(parent, Object.assign({ position: "absolute", left: x, top: y, fontFamily: FS, fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", textTransform: "uppercase", color: K.mute, whiteSpace: "nowrap" }, o || {}), text);
// Kallaway list row: dark bar, accent stripe on the left, number + label
const row = (parent, x, y, w, num, text, o) => {
  o = o || {};
  const h = o.h || 92;
  const r = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 14, background: "linear-gradient(90deg,#2d2d2d,#242424)", border: "1.5px solid rgba(255,255,255,.1)", boxShadow: "0 18px 40px rgba(0,0,0,.4)", overflow: "hidden", zIndex: o.z || 10 });
  const bar = el(r, { position: "absolute", left: 0, top: 0, width: 9, height: h, background: K.lime });
  const n = el(r, { position: "absolute", left: 30, top: 0, height: h, display: "flex", alignItems: "center", fontFamily: FD, fontWeight: 700, fontSize: Math.round(h * 0.48), color: K.white }, num);
  const tx = el(r, { position: "absolute", left: 30 + Math.round(h * 0.95), top: 0, height: h, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 700, fontSize: o.fs || Math.round(h * 0.37), color: K.white, whiteSpace: "nowrap" }, text);
  return { r, bar, n, tx };
};
// glowing node pill, e.g. ‹algoritmo›
const nodePill = (parent, cx, cy, html, o) => {
  o = o || {};
  const w = o.w || 380, h = o.h || 86;
  const p = el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: h / 2, background: "linear-gradient(180deg,#2a3313,#1d230c)", border: `2px solid ${K.lime}`, boxShadow: `0 0 50px ${rgba(K.lime, 0.32)}, inset 0 0 22px ${rgba(K.lime, 0.12)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FS, fontWeight: 700, fontSize: o.fs || 34, color: K.lime, letterSpacing: "0.02em", zIndex: o.z || 20 }, html);
  return p;
};
// glossy brand app icon (Kallaway drops real platform logos into his diagrams)
const APP = {
  instagram: { bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", icon: "instagram" },
  youtube: { bg: "linear-gradient(160deg,#ff3b3b,#e00000)", icon: "youtube" },
};
const appIcon = (parent, cx, cy, size, kind, z) => {
  const a = APP[kind];
  const t = el(parent, { position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, borderRadius: size * 0.26, background: a.bg, boxShadow: `inset 0 ${size * 0.03}px 0 rgba(255,255,255,.35), inset 0 -${size * 0.06}px ${size * 0.14}px rgba(0,0,0,.18), 0 ${size * 0.12}px ${size * 0.3}px rgba(0,0,0,.55)`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: z || 20, overflow: "hidden" }, svg(a.icon, Math.round(size * 0.62), "#fff", 2));
  // top gloss
  el(t, { position: "absolute", left: 0, top: 0, width: "100%", height: "48%", background: "linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0))", pointerEvents: "none" });
  return t;
};
// person glyph (Kallaway's crowds): head + shoulders, filled
const person = (parent, cx, cy, size, color, z) => {
  const g = el(parent, { position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, zIndex: z || 5 });
  el(g, { position: "absolute", left: size * 0.3, top: 0, width: size * 0.4, height: size * 0.4, borderRadius: "50%", background: color });
  el(g, { position: "absolute", left: size * 0.1, top: size * 0.48, width: size * 0.8, height: size * 0.5, borderRadius: `${size * 0.4}px ${size * 0.4}px ${size * 0.08}px ${size * 0.08}px`, background: color });
  return g;
};

// ═══ connectors (SVG, world space) ═══════════════════════════════════════════
// one big overlay svg per layer; path draws on; dashed lines draw on through a mask
let SVGN = 0;
// an svg overlay covering the world rect (x0,y0,w,h); paths use world coordinates
const svgLayer = (parent, z, x0, y0, w, h, glow) => {
  x0 = x0 == null ? -200 : x0; y0 = y0 == null ? -200 : y0; w = w || 1500; h = h || 2300;
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("width", w); s.setAttribute("height", h);
  Object.assign(s.style, { position: "absolute", left: x0 + "px", top: y0 + "px", overflow: "visible", zIndex: z || 4, pointerEvents: "none" });
  // one bloom for every stroke on this layer (AE "Glow" on the line pass)
  if (glow) s.style.filter = glow === "white" ? "drop-shadow(0 0 6px rgba(255,255,255,.55))" : `drop-shadow(0 0 ${glow === true ? 7 : glow}px rgba(207,251,80,.55))`;
  s.setAttribute("viewBox", `${x0} ${y0} ${w} ${h}`);
  const defs = document.createElementNS(NS, "defs");
  s.appendChild(defs);
  parent.appendChild(s);
  s._defs = defs;
  return s;
};
const pathD = (pts, curve) => {
  if (!curve) return "M" + pts.map((p) => p.join(" ")).join(" L");
  // smooth cubic through the points (horizontal tangents — Kallaway's "S" connectors)
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const k = curve === "v" ? [x0, (y0 + y1) / 2, x1, (y0 + y1) / 2] : [(x0 + x1) / 2, y0, (x0 + x1) / 2, y1];
    d += ` C${k[0]} ${k[1]} ${k[2]} ${k[3]} ${x1} ${y1}`;
  }
  return d;
};
// o: { color, w, dash:[a,b], curve:'h'|'v'|null, glow }
const connector = (S, pts, o) => {
  o = o || {};
  const id = "cn" + ++SVGN;
  const d = o.d || pathD(pts, o.curve);
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", d);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", o.color || "rgba(255,255,255,.75)");
  p.setAttribute("stroke-width", o.w || 3);
  p.setAttribute("stroke-linecap", "round");
  if (o.glow) p.style.filter = `drop-shadow(0 0 8px ${rgba(K.lime, 0.7)})`;
  S.appendChild(p);
  const L = p.getTotalLength();
  if (o.dash) {
    // dashed: real dash pattern on the path, draw-on through a mask path
    p.setAttribute("stroke-dasharray", o.dash.join(" "));
    const m = document.createElementNS(NS, "mask");
    m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
    m.setAttribute("x", "-60000"); m.setAttribute("y", "-60000"); m.setAttribute("width", "200000"); m.setAttribute("height", "200000");
    const mp = document.createElementNS(NS, "path");
    mp.setAttribute("d", d); mp.setAttribute("fill", "none"); mp.setAttribute("stroke", "#fff");
    mp.setAttribute("stroke-width", (o.w || 3) + 8); mp.setAttribute("stroke-linecap", "round");
    mp.setAttribute("stroke-dasharray", `${L} ${L}`); mp.setAttribute("stroke-dashoffset", L);
    m.appendChild(mp); S._defs.appendChild(m);
    p.setAttribute("mask", `url(#${id})`);
    return { p, L, draw: (t, dur, ease) => tl.to(mp, { attr: { "stroke-dashoffset": 0 }, duration: dur || 0.5, ease: ease || "power2.inOut" }, t),
      march: (t, dur, px) => tl.fromTo(p, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -(px || 120) }, duration: dur, ease: "none", immediateRender: false }, t),
      hide: (t, dur) => tl.to(p, { opacity: 0, duration: dur || 0.25 }, t) };
  }
  p.setAttribute("stroke-dasharray", `${L} ${L}`);
  p.setAttribute("stroke-dashoffset", L);
  return { p, L, draw: (t, dur, ease) => tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: dur || 0.5, ease: ease || "power2.inOut" }, t),
    hide: (t, dur) => tl.to(p, { opacity: 0, duration: dur || 0.25 }, t) };
};
// a dot that travels along a connector (data flowing)
const traveller = (S, conn, t, dur, color, r) => {
  const c = document.createElementNS(NS, "circle");
  c.setAttribute("r", r || 9); c.setAttribute("fill", color || K.lime);
  c.style.filter = `drop-shadow(0 0 10px ${rgba(color || K.lime, 0.9)})`;
  c.setAttribute("opacity", "0");
  S.appendChild(c);
  // sample the path once at build time; the tween only interpolates baked points
  const N = 48, PTS = [];
  for (let i = 0; i <= N; i++) { const pt = conn.p.getPointAtLength((i / N) * conn.L); PTS.push([pt.x, pt.y]); }
  const o = { u: 0 };
  const put = () => {
    const f = o.u * N, i = Math.min(N - 1, Math.floor(f)), r = f - i;
    c.setAttribute("cx", PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * r);
    c.setAttribute("cy", PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * r);
  };
  put();
  tl.set(c, { attr: { opacity: 1 } }, t);
  tl.to(o, { u: 1, duration: dur, ease: "power1.inOut", onUpdate: put }, t);
  tl.set(c, { attr: { opacity: 0 } }, t + dur);
  return c;
};

// ═══ handwritten annotations (Patrick Hand voice, lime marker) ═══════════════
// wobbly hand-drawn strokes, deterministic per seed, drawn on
const handPath = (pts, seed, amp) => {
  amp = amp == null ? 3 : amp;
  const q = pts.map(([x, y], i) => [x + hash(i * 2, seed) * amp, y + hash(i * 2 + 1, seed) * amp]);
  let d = `M${q[0][0].toFixed(1)} ${q[0][1].toFixed(1)}`;
  for (let i = 1; i < q.length - 1; i++) {
    const mx = (q[i][0] + q[i + 1][0]) / 2, my = (q[i][1] + q[i + 1][1]) / 2;
    d += ` Q${q[i][0].toFixed(1)} ${q[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const l = q[q.length - 1];
  return d + ` L${l[0].toFixed(1)} ${l[1].toFixed(1)}`;
};
const handStroke = (S, d, o) => {
  o = o || {};
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", d); p.setAttribute("fill", "none");
  p.setAttribute("stroke", o.color || K.lime); p.setAttribute("stroke-width", o.w || 7);
  p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  S.appendChild(p);
  const L = p.getTotalLength();
  p.setAttribute("stroke-dasharray", `${L} ${L}`); p.setAttribute("stroke-dashoffset", L);
  return { p, L, draw: (t, dur) => tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: dur || 0.5, ease: "power1.inOut" }, t), hide: (t, dur) => tl.to(p, { opacity: 0, duration: dur || 0.25 }, t) };
};
// loose ellipse that overshoots its start (a marker circle around something)
const handCircle = (S, cx, cy, rx, ry, seed, o) => {
  const pts = [];
  const a0 = -2.2, sweep = Math.PI * 2 + 0.55;
  for (let i = 0; i <= 26; i++) {
    const a = a0 + (sweep * i) / 26, k = 1 + hash(i, seed) * 0.035 + (i / 26) * 0.06;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return handStroke(S, handPath(pts, seed, 2), o);
};
const handArrow = (S, x0, y0, x1, y1, bend, seed, o) => {
  const mx = (x0 + x1) / 2 + (y1 - y0) * (bend || 0.25), my = (y0 + y1) / 2 - (x1 - x0) * (bend || 0.25);
  const pts = [];
  for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([(1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * x1, (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * my + u * u * y1]); }
  const shaft = handStroke(S, handPath(pts, seed, 1.6), o);
  const ang = Math.atan2(y1 - pts[10][1], x1 - pts[10][0]), hl = (o && o.head) || 30;
  const hd = `M${(x1 - Math.cos(ang - 0.5) * hl).toFixed(1)} ${(y1 - Math.sin(ang - 0.5) * hl).toFixed(1)} L${x1} ${y1} L${(x1 - Math.cos(ang + 0.5) * hl).toFixed(1)} ${(y1 - Math.sin(ang + 0.5) * hl).toFixed(1)}`;
  const head = handStroke(S, hd, o);
  return { shaft, head, draw: (t, dur) => { shaft.draw(t, (dur || 0.45) * 0.75); head.draw(t + (dur || 0.45) * 0.72, (dur || 0.45) * 0.3); }, hide: (t) => { shaft.hide(t); head.hide(t); } };
};
// handwritten note: letters appear left→right like a marker writing
const handNote = (parent, x, y, text, o) => {
  o = o || {};
  const n = el(parent, { position: "absolute", left: x, top: y, fontFamily: FH, fontSize: o.size || 54, color: o.color || K.lime, whiteSpace: "nowrap", transform: `rotate(${o.rot == null ? -4 : o.rot}deg)`, transformOrigin: "0 50%", zIndex: o.z || 40, textShadow: o.color && o.color !== K.lime ? GLOW_W : GLOW_LT, lineHeight: 1 });
  // a marker note is drawn ON things on purpose; handwritten glyphs also overlap their neighbours
  layered(n).setAttribute("data-layout-allow-occlusion", "");
  const cs = [...text].map((ch) => layered(el(n, { display: "inline-block", whiteSpace: "pre" }, ch === " " ? "&nbsp;" : ch, "span")));
  gsap.set(cs, { opacity: 0, y: 6, scale: 0.8 });
  return { n, write: (t, dur) => tl.to(cs, { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out", stagger: (dur || 0.5) / cs.length }, t), hide: (t) => tl.to(n, { opacity: 0, duration: 0.25 }, t) };
};

// ═══ Instagram profile phone (dark UI, brand fonts) ══════════════════════════
// o: { user, name, bio, bio2, posts, fol, seg, avatar (img src) | avIcon, grid: [{img}|{icon,label}], ring }
const PH = { w: 560, h: 1140, bz: 13, r: 74, sr: 62 };
PH.sw = PH.w - PH.bz * 2; PH.sh = PH.h - PH.bz * 2;
const PL = { avX: 92, avY: 196, avD: 140, gridTop: 470, cw: 177, ch: 236, gap: 2.5 };
const cellXY = (i) => [(i % 3) * (PL.cw + PL.gap), PL.gridTop + Math.floor(i / 3) * (PL.ch + PL.gap)];
const TOPIC = {
  fitness: ["dumbbell", "Fitness"], viaggi: ["plane", "Viaggi"], motivazione: ["flame", "Motivazione"], cucina: ["pizza", "Cucina"],
  gatti: ["cat", "Gatti"], auto: ["car", "Auto"], musica: ["music", "Musica"], moda: ["shirt", "Moda"], gaming: ["gamepad-2", "Gaming"], caffe: ["coffee", "Caffè"], foto: ["camera", "Foto"], bici: ["bike", "Bici"],
};
// a topic post tile: monochrome photo-ish card, white icon + small label
const topicTile = (parent, x, y, w, h, key, z) => {
  const [ic, lb] = TOPIC[key];
  const k = Object.keys(TOPIC).indexOf(key);
  const tone = 34 + (k % 4) * 7;
  const t = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 3, background: `radial-gradient(120% 90% at 30% 20%, rgb(${tone + 26},${tone + 26},${tone + 24}) 0%, rgb(${tone},${tone},${tone}) 55%, rgb(${tone - 14},${tone - 14},${tone - 14}) 100%)`, overflow: "hidden", zIndex: z || 3 });
  el(t, { position: "absolute", left: w / 2 - w * 0.2, top: h * 0.3 - w * 0.2, width: w * 0.4, height: w * 0.4, display: "flex", alignItems: "center", justifyContent: "center" }, svg(ic, Math.round(w * 0.4), "rgba(255,255,255,.92)", 1.8));
  el(t, { position: "absolute", left: 0, bottom: h * 0.12, width: w, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: Math.max(12, Math.round(w * 0.13)), color: "rgba(255,255,255,.85)" }, lb);
  return t;
};
const thumbTile = (parent, x, y, w, h, src, z) => {
  const t = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 3, overflow: "hidden", background: "#222", zIndex: z || 3 });
  el(t, { width: "100%", height: "100%", objectFit: "cover", display: "block" }, null, "img").setAttribute("src", src);
  return t;
};
// a live clip inside a tile (Kallaway shows real footage, not stills). The <video> must exist in the
// static HTML (the render compiler finds media before any script runs), so build.cjs writes them from the
// <!--VIDEOS--> block into a hidden pool and we only MOVE the element here. The wrapper stays untimed;
// the <video> carries the timing (HyperFrames owns playback — never play/seek it here).
const videoTile = (parent, x, y, w, h, id, z) => {
  const t = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 3, overflow: "hidden", background: "#222", zIndex: z || 3 });
  const vd = document.getElementById(id);
  Object.assign(vd.style, { position: "absolute", left: "0px", top: "0px", width: "100%", height: "100%", objectFit: "cover", display: "block" });
  t.appendChild(vd);
  return t;
};
const igPhone = (parent, X, Y, o) => {
  const frame = el(parent, { position: "absolute", left: X, top: Y, width: PH.w, height: PH.h, borderRadius: PH.r, background: "linear-gradient(150deg,#3a3a3a 0%,#161616 36%,#0d0d0d 70%,#2a2a2a 100%)", boxShadow: "0 50px 110px rgba(0,0,0,.65), inset 0 0 0 2px rgba(255,255,255,.10)", zIndex: o.z || 8 });
  const screen = el(frame, { position: "absolute", left: PH.bz, top: PH.bz, width: PH.sw, height: PH.sh, borderRadius: PH.sr, background: "#000", overflow: "hidden" });
  el(screen, { position: "absolute", left: (PH.sw - 122) / 2, top: 12, width: 122, height: 35, borderRadius: 18, background: "#000", zIndex: 60, boxShadow: "0 0 0 1.5px #121212" });
  const head = [];
  head.push(el(screen, { position: "absolute", left: 42, top: 17, fontFamily: FS, fontSize: 22, fontWeight: 700, color: "#fff", zIndex: 59 }, "9:41"));
  head.push(el(screen, { position: "absolute", left: 24, top: 64, display: "flex", alignItems: "center", gap: 6, fontFamily: FS, fontSize: 29, fontWeight: 800, color: "#fff" }, (o.user || "il_tuo_profilo") + svg("chevron-down", 24, "#fff", 2.6)));
  head.push(el(screen, { position: "absolute", right: 22, top: 66, display: "flex", gap: 22 }, svg("square-plus", 31, "#fff", 2) + svg("menu", 31, "#fff", 2)));
  const av = el(screen, { position: "absolute", left: PL.avX - PL.avD / 2, top: PL.avY - PL.avD / 2, width: PL.avD, height: PL.avD, borderRadius: "50%", background: o.ring || "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)", padding: 5 });
  const avIn = el(av, { width: "100%", height: "100%", borderRadius: "50%", background: "#000", padding: 4 });
  const avFace = el(avIn, { width: "100%", height: "100%", borderRadius: "50%", background: "#3a3a3a", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }, o.avatar ? null : svg(o.avIcon || "user", 56, "#fff", 2.1));
  if (o.avatar) el(avFace, { width: "100%", height: "100%", objectFit: "cover", display: "block" }, null, "img").setAttribute("src", o.avatar);
  const nums = [[o.posts || "12", "post"], [o.fol || "214", "follower"], [o.seg || "380", "seguiti"]].map(([n, l], k) => {
    const s = el(screen, { position: "absolute", left: 178 + k * 122, top: 150, width: 122, textAlign: "center", fontFamily: FS, color: "#fff" });
    // statBlur: Kallaway blurs numbers that are not the point (and we never invent a real person's stats)
    const v = el(s, { fontSize: 31, fontWeight: 800, filter: o.statBlur ? "blur(7px)" : "none" }, n);
    el(s, { fontSize: 20, color: "rgba(255,255,255,.7)", marginTop: 2 }, l);
    return v;
  });
  const name = el(screen, { position: "absolute", left: 24, top: 272, fontFamily: FS, fontSize: 23, fontWeight: 700, color: "#fff" }, o.name || "Il tuo profilo");
  const bio = el(screen, { position: "absolute", left: 24, top: 304, width: 500, fontFamily: FS, fontSize: 21, lineHeight: 1.32, color: "rgba(255,255,255,.86)", whiteSpace: "nowrap" }, o.bio || "");
  const follow = el(screen, { position: "absolute", left: 24, top: 372, width: 248, height: 54, borderRadius: 14, background: K.ig, overflow: "hidden", fontFamily: FS });
  const followTxt = layered(el(follow, { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }, "Segui"));
  const followed = layered(el(follow, { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 22, fontWeight: 700, color: K.ink, background: K.lime, opacity: 0 }, "Segui già" + svg("check", 22, K.ink, 3.2)));
  const msg = el(screen, { position: "absolute", left: 280, top: 372, width: 248, height: 54, borderRadius: 14, background: "#2c2c2e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontSize: 22, fontWeight: 700, color: "#fff" }, "Messaggio");
  const tabs = el(screen, { position: "absolute", left: 0, top: 436, width: PH.sw, height: 34, display: "flex" });
  ["grid-3x3", "clapperboard", "square-user"].forEach((n, k) => el(tabs, { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: k === 0 ? "2.5px solid #fff" : "1px solid rgba(255,255,255,.14)" }, svg(n, 25, k === 0 ? "#fff" : "rgba(255,255,255,.45)", 2)));
  const cells = (o.grid || []).map((g, i) => {
    const [x, y] = cellXY(i);
    return g.video ? videoTile(screen, x, y, PL.cw, PL.ch, g.video) : g.img ? thumbTile(screen, x, y, PL.cw, PL.ch, g.img) : topicTile(screen, x, y, PL.cw, PL.ch, g.topic);
  });
  // header pieces in reading order (a profile can "build itself" with a cascade)
  head.push(av, ...nums.map((v) => v.parentNode), name, bio, follow, msg, tabs);
  return { frame, screen, X, Y, av, avFace, nums, name, bio, follow, followTxt, followed, msg, cells, tabs, head };
};
// world centre of a phone's avatar / grid cell
const phAvatar = (P) => [P.X + PH.bz + PL.avX, P.Y + PH.bz + PL.avY];
const phCell = (P, i) => { const [x, y] = cellXY(i); return [P.X + PH.bz + x + PL.cw / 2, P.Y + PH.bz + y + PL.ch / 2]; };
// ─────────────────────────────────────────────────────────────────────────────
