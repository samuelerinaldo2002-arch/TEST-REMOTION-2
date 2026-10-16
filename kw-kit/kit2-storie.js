// ═══ KW kit v2 · storie di Instagram (reel 10/10 "l'algoritmo delle storie", servono anche al 13/10) ═══════════════
// UI del vecchio stile (come igDrafts / igShare): telefono vero, schermate realistiche, il dito che preme. File a parte: non
// cambia nessuna funzione usata dai reel approvati.
// - storyCircle / storyRow: i cerchi delle storie (anello a gradiente = da vedere, grigio = vista, lime = spinta/scelta)
// - igHome: la home con la fila delle storie e un post · igStoryEdit: l'editor con "La tua storia" · igStoryView: la storia
//   aperta (barra a segmenti, nome e ora, "Invia messaggio", cuore, condividi)
// - algoPill: la pill `<Algoritmo/>` del reel 40 di Kallaway (bordo luminoso, testo in stile codice che si decodifica)
// - orologio: quadrante d'acciaio con le lancette (l'ora di pubblicazione)
// - sagomaK / personaK: la persona qualunque di profilo del reel 09 (sagoma nera sul disco bianco), per chi guarda

const IG_GRAD = "linear-gradient(45deg,#feda75 0%,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5 100%)";
const LIME_RING = "linear-gradient(135deg,#f4ffc8 0%,#CFFB50 45%,#a6d136 100%)";

// figura umana di profilo (testa e spalle), rivolta a destra; o.flip la gira (stessa sagoma del reel 09)
const sagomaK = (parent, x, y, W, o) => {
  o = o || {};
  const P = [[0.30, 1.25], [0.30, 1.06], [0.24, 0.97], [0.17, 0.83], [0.05, 0.62], [0.06, 0.30], [0.24, 0.14], [0.40, 0.01], [0.68, -0.01], [0.82, 0.11], [0.92, 0.20], [0.94, 0.33], [0.93, 0.42], [0.93, 0.47], [0.97, 0.50], [0.99, 0.53], [1.07, 0.63], [1.07, 0.66], [1.03, 0.68], [1.0, 0.69], [1.02, 0.72], [1.0, 0.74], [1.01, 0.77], [0.98, 0.79], [0.99, 0.83], [0.95, 0.88], [0.86, 0.90], [0.76, 0.92], [0.70, 1.0], [0.70, 1.24], [1.02, 1.33], [1.22, 1.46], [1.3, 1.72], [-0.32, 1.72], [-0.24, 1.47], [-0.02, 1.34]];
  const ox = 0.34 * W, X = (u) => ((o.flip ? 0.98 - u : u) * W + ox).toFixed(1), Y = (v) => (v * W + 0.03 * W).toFixed(1), n = P.length;
  let d = `M${X(P[0][0])} ${Y(P[0][1])}`;
  for (let i = 1; i <= n; i++) {
    const p0 = P[(i - 2 + n) % n], p1 = P[(i - 1) % n], p2 = P[i % n], p3 = P[(i + 1) % n];
    d += ` C${X(p1[0] + (p2[0] - p0[0]) / 6)} ${Y(p1[1] + (p2[1] - p0[1]) / 6)} ${X(p2[0] - (p3[0] - p1[0]) / 6)} ${Y(p2[1] - (p3[1] - p1[1]) / 6)} ${X(p2[0])} ${Y(p2[1])}`;
  }
  const g = el(parent, { position: "absolute", left: x - ox, top: y - 0.03 * W, width: 1.66 * W, height: 1.78 * W, zIndex: o.z || 14 });
  const SV = svgIn(g, 1.66 * W, 1.78 * W);
  const body = pathEl(SV, d + " Z", { fill: o.fill || "#202020", stroke: o.stroke || "rgba(255,255,255,.7)", "stroke-width": o.sw || 3 });
  return { g, body };
};
// chi guarda: una persona qualunque (sagoma di profilo sul disco bianco, come nel reel 48 di Kallaway)
const personaK = (parent, x, y, d, o) => {
  o = o || {};
  const c = el(parent, { position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 50% 40%, #ffffff 0%, #f3f3ef 46%, #d9d9d1 74%, #b9b9b1 100%)", zIndex: o.z || 3 });
  const W = d * 0.46;
  sagomaK(c, d * 0.5 - 0.49 * W, d * 0.15, W, { z: 1, fill: "#1b1b1b", stroke: "rgba(0,0,0,0)", sw: 0 });
  return c;
};

// riquadro con un fotogramma vero di un reel di un altro creator (atlante dei muri, 12 × 12 miniature 128 × 228), a riempire
const atlasCrop = (parent, x, y, w, h, q, o) => {
  o = o || {};
  const t = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", background: "#111", zIndex: o.z || 1 });
  const k = Math.max(w / 128, h / 228), qc = q % 12, qr = Math.floor(q / 12) % 12;
  imgIn(t, "atlas-muro", { left: -qc * 128 * k + (w - 128 * k) / 2 + "px", top: -qr * 228 * k + (h - 228 * k) / 2 + "px", width: 12 * 128 * k + "px", height: 12 * 228 * k + "px", objectFit: "fill" });
  return t;
};

// ── cerchio di una storia ──
// src: "tu" | handle di assets/avatars | { face: i } (volto vero dell'atlante) | { anon: true } (persona qualunque) |
//      { media: id } (video/immagine del pool)
// o: { ring: "ig" (da vedere, default) | "visto" | "lime" | "none", nome, fs, lw (larghezza dell'etichetta), plus (il "+" blu della tua storia), z }
// → { g, rIG, rSeen, rLime, face, lab, d, seen(t), lime(t, dur), ig(t), dim(t, k) }
const storyCircle = (parent, cx, cy, d, src, o) => {
  o = o || {};
  const ring = o.ring || "ig";
  const g = el(parent, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, zIndex: o.z || 12 });
  const mk = (bg, on) => el(g, { position: "absolute", left: 0, top: 0, width: d, height: d, borderRadius: "50%", background: bg, opacity: on ? 1 : 0 });
  const rSeen = mk("#4c4c4f", ring === "visto");
  const rIG = mk(IG_GRAD, ring === "ig");
  const rLime = mk(LIME_RING, ring === "lime");
  rLime.style.boxShadow = GLOW_A(0.75);
  const bw = Math.max(3, Math.round(d * 0.05)), gp = Math.max(3, Math.round(d * 0.035));
  const inner = el(g, { position: "absolute", left: bw, top: bw, width: d - 2 * bw, height: d - 2 * bw, borderRadius: "50%", background: o.bg || "#000" });
  const fd = d - 2 * bw - 2 * gp;
  const face = el(inner, { position: "absolute", left: gp, top: gp, width: fd, height: fd, borderRadius: "50%", overflow: "hidden", background: "#2a2a2a" });
  if (src && src.anon) personaK(face, 0, 0, fd, { z: 1 });
  else if (src && src.face != null) faceDot(face, 0, 0, fd, src.face, null, { bw: 0 });
  else if (src && src.media) mediaTile(face, 0, 0, fd, fd, src.media, 1);
  else if (src) imgIn(face, "av-" + src, { objectFit: "cover" });
  if (o.plus) {
    const pd = Math.round(d * 0.3);
    el(g, { position: "absolute", left: d - pd + 2, top: d - pd + 2, width: pd, height: pd, borderRadius: "50%", background: "#3897f0", border: `${Math.max(2, Math.round(d * 0.03))}px solid #000`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }, svg("plus", Math.round(pd * 0.62), "#fff", 3.2));
  }
  let lab = null;
  if (o.nome) {
    const fs = o.fs || Math.round(d * 0.165);
    const lw = o.lw || d * 1.12;
    lab = el(g, { position: "absolute", left: (d - lw) / 2, top: d + fs * 0.35, width: lw, textAlign: "center", fontFamily: FS, fontWeight: 500, fontSize: fs, color: "rgba(255,255,255,.92)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, o.nome);
  }
  const to = (on, t, dur) => [rSeen, rIG, rLime].forEach((r) => tl.to(r, { opacity: r === on ? 1 : 0, duration: dur || 0.2 }, t));
  return {
    g, rIG, rSeen, rLime, face, lab, d,
    seen: (t, dur) => to(rSeen, t, dur),
    ig: (t, dur) => to(rIG, t, dur),
    lime: (t, dur) => to(rLime, t, dur),
    dim: (t, k) => tl.to(g, { filter: `grayscale(1) brightness(${k == null ? 0.45 : k})`, duration: 0.3 }, t),
  };
};

// ── fila di storie (una "tray"): items [{ src, nome, ring, plus }] · o: { d (118), gap (26), fs, panel (striscia scura dietro,
// come la fila di un telefono), pad, z } → { items, panel, xy(i), rect, pitch }
const storyRow = (parent, x, y, items, o) => {
  o = o || {};
  const d = o.d || 118, gap = o.gap == null ? 26 : o.gap, pitch = d + gap, pad = o.pad == null ? 26 : o.pad, z = o.z || 12;
  const W = items.length * pitch - gap + pad * 2, H = d + (o.fs || Math.round(d * 0.165)) * 1.9 + pad * 1.4;
  let panel = null;
  if (o.panel) panel = el(parent, { position: "absolute", left: x, top: y, width: W, height: H, borderRadius: Math.round(d * 0.3), background: "linear-gradient(180deg,#121212,#050505)", border: "1.5px solid rgba(255,255,255,.12)", boxShadow: "0 24px 50px rgba(0,0,0,.55)", zIndex: z - 1 });
  const xy = (i) => [x + pad + d / 2 + i * pitch, y + pad * 0.8 + d / 2];
  const out = items.map((it, i) => storyCircle(parent, xy(i)[0], xy(i)[1], d, it.src, Object.assign({ fs: o.fs, z }, it)));
  return { items: out, panel, xy, pitch, d, rect: [x, y, x + W, y + H] };
};

// ═══ home di Instagram (vecchio stile, dark) con la fila delle storie e un post ═══════════════════════════════════
// o: { storie: [{ src, nome, ring, plus }], d (diametro dei cerchi, 118), post: { user, nome, media }, user (tab bar), z }
// → phone2 + { tray (storyCircle[]), circleXY(i) (mondo), circleRect(i), trayRect(), postRect(), screenTop: [elementi alti] }
const igHome = (parent, X, Y, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw, H = PH.sh;
  const hd = el(S, { position: "absolute", left: 24, top: 58, fontFamily: FH, fontSize: 52, color: "#fff", whiteSpace: "nowrap", lineHeight: 1.1 }, "Instagram");
  const ic = el(S, { position: "absolute", right: 22, top: 70, display: "flex", gap: 26 }, svg("square-plus", 32, "#fff", 2) + svg("heart", 32, "#fff", 2) + svg("send", 32, "#fff", 2));
  const d = o.d || 118, pitch = d + 22, ty = 140;
  const tray = (o.storie || []).map((it, i) => storyCircle(S, 24 + d / 2 + i * pitch, ty + d / 2, d, it.src, Object.assign({ fs: 19, z: 4 }, it)));
  el(S, { position: "absolute", left: 0, top: ty + d + 52, width: W, height: 1, background: "rgba(255,255,255,.12)" });
  // il post
  const py = ty + d + 68, ps = o.post || {};
  const pav = el(S, { position: "absolute", left: 20, top: py, width: 54, height: 54, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,.2)" });
  if (ps.user) imgIn(pav, "av-" + ps.user, { objectFit: "cover" });
  el(S, { position: "absolute", left: 88, top: py + 12, fontFamily: FS, fontWeight: 700, fontSize: 23, color: "#fff", whiteSpace: "nowrap" }, ps.nome || "");
  el(S, { position: "absolute", right: 20, top: py + 12, width: 30, height: 30 }, svg("ellipsis", 30, "#fff", 2.2));
  const my = py + 70, mh = H - 112 - my - 64;
  const media = el(S, { position: "absolute", left: 0, top: my, width: W, height: mh, overflow: "hidden", background: "#111" });
  if (ps.media) mediaTile(media, 0, 0, W, mh, ps.media, 1);
  else if (ps.atlas != null) atlasCrop(media, 0, 0, W, mh, ps.atlas);
  el(S, { position: "absolute", left: 20, top: my + mh + 14, display: "flex", gap: 22 }, svg("heart", 32, "#fff", 2) + svg("message-circle", 32, "#fff", 2) + svg("send", 32, "#fff", 2));
  el(S, { position: "absolute", right: 20, top: my + mh + 14, width: 32, height: 32 }, svg("bookmark", 32, "#fff", 2));
  const tb = el(S, { position: "absolute", left: 0, top: H - 112, width: W, height: 112, background: "#000", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", justifyContent: "space-around", alignItems: "flex-start", paddingTop: 24, zIndex: 8 });
  ["house", "search", "square-play", "shopping-bag"].forEach((n) => el(tb, { width: 40, height: 40 }, svg(n, 36, "#fff", 2)));
  const me = el(tb, { width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: "2.5px solid #fff", position: "relative" });
  if (o.user) imgIn(me, "av-" + o.user, { objectFit: "cover" });
  const cxy = (i) => P.at(24 + d / 2 + i * pitch, ty + d / 2);
  return Object.assign(P, {
    tray, header: [hd, ic], media,
    circleXY: cxy,
    circleRect: (i) => { const [x, y] = cxy(i); return [x - d / 2, y - d / 2, x + d / 2, y + d / 2]; },
    trayRect: () => { const a = P.at(0, ty - 20), b = P.at(W, ty + d + 52); return [a[0], a[1], b[0], b[1]]; },
    postRect: () => { const a = P.at(0, py), b = P.at(W, my + mh + 60); return [a[0], a[1], b[0], b[1]]; },
  });
};

// ═══ editor della storia (vecchio stile): il tuo video a tutto schermo, in basso "La tua storia" · "Amici più stretti" · → ═══
// o: { media, user, z } → phone2 + { yourXY(), press(t) }
const igStoryEdit = (parent, X, Y, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw, H = PH.sh;
  if (o.media) mediaTile(S, 0, 0, W, H, o.media, 1);
  el(S, { position: "absolute", left: 0, top: 0, width: W, height: 200, background: "linear-gradient(180deg, rgba(0,0,0,.5), rgba(0,0,0,0))", zIndex: 2 });
  el(S, { position: "absolute", left: 0, top: H - 230, width: W, height: 230, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.65))", zIndex: 2 });
  el(S, { position: "absolute", left: 22, top: 66, width: 40, height: 40, zIndex: 3 }, svg("x", 38, "#fff", 2.6));
  el(S, { position: "absolute", right: 20, top: 66, display: "flex", gap: 22, zIndex: 3 }, ["type", "sticker", "music", "sparkles"].map((n) => svg(n, 34, "#fff", 2)).join(""));
  const by = H - 128;
  const you = el(S, { position: "absolute", left: 18, top: by, width: 214, height: 78, borderRadius: 39, background: "rgba(255,255,255,.95)", display: "flex", alignItems: "center", gap: 10, paddingLeft: 10, fontFamily: FS, fontWeight: 700, fontSize: 21, color: "#111", whiteSpace: "nowrap", zIndex: 3 });
  const av = el(you, { width: 56, height: 56, borderRadius: "50%", overflow: "hidden", flex: "none", position: "relative" });
  if (o.user) imgIn(av, "av-" + o.user, { objectFit: "cover" });
  el(you, {}, "La tua storia", "span");
  const cf = el(S, { position: "absolute", left: 244, top: by, width: 200, height: 78, borderRadius: 39, background: "rgba(255,255,255,.95)", display: "flex", alignItems: "center", gap: 8, paddingLeft: 10, fontFamily: FS, fontWeight: 700, fontSize: 19, color: "#111", whiteSpace: "nowrap", zIndex: 3 });
  el(cf, { width: 52, height: 52, borderRadius: "50%", background: "#1fbe4f", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }, svg("star", 30, "#fff", 2.4));
  el(cf, {}, "Amici più stretti", "span");
  el(S, { position: "absolute", left: W - 76, top: by + 4, width: 70, height: 70, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }, svg("arrow-right", 36, "#111", 2.6));
  return Object.assign(P, {
    you,
    yourXY: () => P.at(18 + 107, by + 39),
    press: (t) => {
      tl.to(you, { scale: 0.93, duration: 0.07, ease: "power2.out" }, t);
      tl.to(you, { scale: 1, duration: 0.25, ease: "back.out(3)" }, t + 0.08);
      tl.to(you, { boxShadow: `0 0 0 4px ${K.lime}, ${GLOW_A(0.6)}`, duration: 0.15 }, t);
    },
  });
};

// ═══ storia aperta (vecchio stile) ═══════════════════════════════════════════════════════════════════════════════
// o: { user, nome, quando ("2 h"), media, segs (segmenti della barra, 1), seg (quello in corso, 0), z }
// .play(t, dur, {da, a, ease}) riempie il segmento in corso · .fillTo(k, t) segmenti pieni fino a k · .like(t) · .reply(t, testo)
// · .share(t) · .swipe(t, idProssima) la storia scivola via (cubo) e arriva quella dopo · .barRect() · .heartXY() .inputXY()
// .sendXY() (mondo) · .content (media + intestazione: per spegnerla/girarla) · .bar (contenitore della barra)
const igStoryView = (parent, X, Y, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw, H = PH.sh;
  const content = el(S, { position: "absolute", left: 0, top: 0, width: W, height: H, zIndex: 1, transformOrigin: "0% 50%" });
  if (o.media) mediaTile(content, 0, 0, W, H, o.media, 1);
  el(content, { position: "absolute", left: 0, top: 0, width: W, height: 220, background: "linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0))", zIndex: 2 });
  el(content, { position: "absolute", left: 0, top: H - 200, width: W, height: 200, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6))", zIndex: 2 });
  // barra a segmenti
  const n = o.segs || 1, gp = n > 8 ? 3 : 5, bx = 14, bw = W - 28, sw = (bw - (n - 1) * gp) / n, by = 58;
  const bar = el(S, { position: "absolute", left: bx, top: by, width: bw, height: 5, zIndex: 4 });
  const fills = [];
  for (let k = 0; k < n; k++) {
    const s = el(bar, { position: "absolute", left: k * (sw + gp), top: 0, width: sw, height: 5, borderRadius: 3, background: "rgba(255,255,255,.38)", overflow: "hidden" });
    const f = el(s, { position: "absolute", left: 0, top: 0, width: sw, height: 5, background: "#fff", transformOrigin: "0 50%" });
    gsap.set(f, { scaleX: k < (o.seg || 0) ? 1 : 0 });
    fills.push(f);
  }
  // intestazione
  const head = el(content, { position: "absolute", left: 16, top: 78, display: "flex", alignItems: "center", gap: 12, zIndex: 3, whiteSpace: "nowrap" });
  const av = el(head, { width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,.8)", position: "relative", flex: "none" });
  if (o.user === "anon") personaK(av, 0, 0, 52, { z: 1 });
  else if (o.user) imgIn(av, "av-" + o.user, { objectFit: "cover" });
  el(head, { fontFamily: FS, fontWeight: 700, fontSize: 23, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,.6)" }, o.nome || "", "span");
  el(head, { fontFamily: FS, fontWeight: 500, fontSize: 21, color: "rgba(255,255,255,.75)", textShadow: "0 1px 6px rgba(0,0,0,.6)" }, o.quando || "2 h", "span");
  el(content, { position: "absolute", right: 16, top: 88, display: "flex", gap: 20, zIndex: 3 }, svg("ellipsis", 32, "#fff", 2.4) + svg("x", 34, "#fff", 2.6));
  // footer: Invia messaggio · cuore · condividi
  const fy = H - 104;
  const inp = el(S, { position: "absolute", left: 16, top: fy, width: W - 150, height: 70, borderRadius: 35, border: "2px solid rgba(255,255,255,.7)", display: "flex", alignItems: "center", paddingLeft: 26, fontFamily: FS, fontWeight: 500, fontSize: 23, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", zIndex: 4 });
  const ph = el(inp, { position: "absolute", left: 26, top: 0, height: 66, display: "flex", alignItems: "center" }, "Invia messaggio");
  const txt = el(inp, { position: "absolute", left: 26, top: 0, height: 66, display: "flex", alignItems: "center", fontWeight: 700 }, "");
  const hx0 = W - 120, sx0 = W - 62;
  const heart = el(S, { position: "absolute", left: hx0 - 22, top: fy + 13, width: 44, height: 44, zIndex: 4 }, svg("heart", 42, "#fff", 2.2));
  const heartOn = el(S, { position: "absolute", left: hx0 - 22, top: fy + 13, width: 44, height: 44, zIndex: 5, opacity: 0 }, svg("heart", 42, "#ff3040", 2.2, "#ff3040"));
  const send = el(S, { position: "absolute", left: sx0 - 22, top: fy + 13, width: 44, height: 44, zIndex: 4 }, svg("send", 40, "#fff", 2.2));
  // la storia che arriva dopo lo scorrimento (chi scorre via passa a un'altra persona)
  let next = null;
  const nextIn = (id) => {
    next = el(S, { position: "absolute", left: 0, top: 0, width: W, height: H, zIndex: 1, background: "#151515", transformOrigin: "100% 50%", opacity: 0 });
    if (id && id.atlas != null) atlasCrop(next, 0, 0, W, H, id.atlas);
    else if (id) mediaTile(next, 0, 0, W, H, id, 1);
    el(next, { position: "absolute", left: 0, top: 0, width: W, height: 220, background: "linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0))", zIndex: 2 });
    const h2 = el(next, { position: "absolute", left: 16, top: 78, display: "flex", alignItems: "center", gap: 12, zIndex: 3, whiteSpace: "nowrap" });
    const a2 = el(h2, { width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,.8)", position: "relative", flex: "none" });
    faceDot(a2, 0, 0, 52, 5, null, { bw: 0 });
    el(h2, { fontFamily: FS, fontWeight: 700, fontSize: 23, color: "#fff" }, "giulia.ferri", "span");
    el(h2, { fontFamily: FS, fontWeight: 500, fontSize: 21, color: "rgba(255,255,255,.75)" }, "1 h", "span");
    return next;
  };
  let lastReply = "";
  S.style.perspective = "1400px";
  const W2 = (x, y) => P.at(x, y);
  return Object.assign(P, {
    content, bar, fills, inp, heart, send,
    barRect: () => { const a = W2(bx - 6, by - 14), b = W2(bx + bw + 6, by + 19); return [a[0], a[1], b[0], b[1]]; },
    heartXY: () => W2(hx0, fy + 35),
    sendXY: () => W2(sx0, fy + 35),
    inputXY: () => W2(16 + (W - 150) / 2, fy + 35),
    play: (t, dur, oo) => {
      oo = oo || {};
      const f = fills[o.seg || 0];
      tl.fromTo(f, { scaleX: oo.da || 0 }, { scaleX: oo.a == null ? 1 : oo.a, duration: dur, ease: oo.ease || "none", immediateRender: false }, t);
    },
    fillTo: (k, t) => fills.forEach((f, i) => tl.set(f, { scaleX: i < k ? 1 : 0 }, t)),
    like: (t) => {
      tl.to(heartOn, { opacity: 1, duration: 0.05 }, t);
      tl.fromTo(heartOn, { scale: 0.4 }, { scale: 1, duration: 0.4, ease: "back.out(3.2)", immediateRender: false }, t);
      tl.to(heart, { opacity: 0, duration: 0.05 }, t);
      // cuoricini che salgono (le reazioni del vecchio stile)
      for (let k = 0; k < 6; k++) {
        const h = el(S, { position: "absolute", left: hx0 - 18, top: fy - 10, width: 36, height: 36, zIndex: 6, opacity: 0 }, svg("heart", 34, "#ff3040", 2, "#ff3040"));
        const dx = hash(k, 5) * 110, up = 260 + Math.abs(hash(k, 9)) * 260;
        tl.fromTo(h, { opacity: 1, x: 0, y: 0, scale: 0.6 }, { opacity: 0, x: dx, y: -up, scale: 1.25, duration: 0.9, ease: "power2.out", immediateRender: false }, t + 0.05 + k * 0.05);
      }
    },
    reply: (t, testo, cps) => {
      lastReply = testo;
      tl.to(ph, { opacity: 0, duration: 0.08 }, t);
      typeIn(txt, testo, t + 0.05, cps || 30);
      tl.to(inp, { borderColor: "#ffffff", duration: 0.15 }, t);
    },
    // la risposta parte: la pill si svuota e il fumetto (blu, come i DM) sale
    sent: (t) => {
      const b = el(S, { position: "absolute", left: 24, top: fy - 6, padding: "14px 22px", borderRadius: 28, background: K.ig, fontFamily: FS, fontWeight: 700, fontSize: 23, color: "#fff", whiteSpace: "nowrap", zIndex: 6, opacity: 0 }, lastReply);
      tl.set(b, { opacity: 1 }, t);
      tl.to(b, { y: -300, opacity: 0, duration: 0.6, ease: "power2.in" }, t + 0.05);
      tl.set(txt, { opacity: 0 }, t);
      tl.set(ph, { opacity: 1 }, t + 0.1);
    },
    share: (t) => {
      tl.to(send, { scale: 0.8, duration: 0.07, ease: "power2.out" }, t);
      tl.to(send, { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.08);
      const pl = el(S, { position: "absolute", left: sx0 - 22, top: fy + 13, width: 44, height: 44, zIndex: 6, opacity: 0 }, svg("send", 40, K.lime, 2.6));
      tl.fromTo(pl, { opacity: 1, x: 0, y: 0, rotation: 0 }, { opacity: 0, x: 120, y: -360, rotation: -12, scale: 1.6, duration: 0.7, ease: "power2.in", immediateRender: false }, t + 0.05);
    },
    swipe: (t, idNext) => {
      const nx = next || nextIn(idNext);
      tl.to(content, { x: -W, rotationY: 55, opacity: 0.2, duration: 0.42, ease: "power2.in" }, t);
      tl.fromTo(nx, { x: W, rotationY: -55, opacity: 0.5 }, { x: 0, rotationY: 0, opacity: 1, duration: 0.42, ease: "power2.in", immediateRender: false }, t);
      tl.to(bar, { opacity: 0, duration: 0.15 }, t);
      return nx;
    },
    // torna la storia di prima (dopo uno swipe), pronta da riguardare
    reset: (t) => {
      tl.set(content, { x: 0, rotationY: 0, opacity: 1 }, t);
      if (next) tl.set(next, { opacity: 0 }, t);
      tl.set(bar, { opacity: 1 }, t);
    },
  });
};

// ═══ `<Algoritmo/>` (reel 40 di Kallaway: pill in stile codice, bordo luminoso, linee verso tutto il resto) ═════════════
// o: { testo, fs (40), z } → { g, box, rect, cx, cy, w, h, show(t), flash(t, "+" | "-") }
const algoPill = (parent, cx, cy, o) => {
  o = o || {};
  const fs = o.fs || 40, testo = o.testo || "<Algoritmo/>", w = Math.round(fs * 0.62 * testo.length + fs * 1.6), h = Math.round(fs * 2.1);
  const g = el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: o.z || 30 });
  const box = el(g, { position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: Math.round(h * 0.28), background: "linear-gradient(180deg, rgba(40,44,32,.96), rgba(18,20,14,.98))", border: `3px solid ${K.lime}`, boxShadow: `${GLOW_A(0.85)}, 0 18px 40px rgba(0,0,0,.6), inset 0 0 22px rgba(207,251,80,.18)` });
  const tx = el(g, { position: "absolute", left: 0, top: 0, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Consolas", "Courier New", monospace', fontWeight: 700, fontSize: fs, color: "#efffc2", textShadow: GLOW_LT, whiteSpace: "nowrap" }, testo);
  const off = el(g, { position: "absolute", left: -3, top: -3, width: w + 6, height: h + 6, borderRadius: Math.round(h * 0.28) + 3, border: "3px solid #ffffff", opacity: 0 });
  gsap.set(g, { opacity: 0 });
  return {
    g, box, tx, w, h, cx, cy, rect: [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2],
    show: (t, oo) => {
      oo = oo || {};
      tl.fromTo(g, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.2)", immediateRender: false }, t);
      if (oo.decode !== false) decode(tx, testo, t + 0.04, oo.dur || 0.45);
      pulse(parent, cx, cy, t + 0.05, { r: oo.pr || h * 0.7, z: (o.z || 30) - 1 }); // piccolo: la pill sta subito sotto il titolo (oo.pr = raggio)
    },
    // un segnale arriva: "+" il bordo lampeggia lime pieno, "-" diventa bianco/grigio per un attimo
    flash: (t, s) => {
      if (s === "-") {
        tl.to(off, { opacity: 1, duration: 0.06 }, t);
        tl.to(off, { opacity: 0, duration: 0.4 }, t + 0.12);
        tl.to(box, { borderColor: "#8a8a8a", boxShadow: "0 18px 40px rgba(0,0,0,.6)", duration: 0.08 }, t);
        tl.to(box, { borderColor: K.lime, boxShadow: `${GLOW_A(0.85)}, 0 18px 40px rgba(0,0,0,.6), inset 0 0 22px rgba(207,251,80,.18)`, duration: 0.4 }, t + 0.3);
      } else {
        pulse(parent, cx, cy, t, { r: h * 1.3, z: (o.z || 30) - 1 }); // il disco pieno dietro la pill sul dato positivo (reel 40)
        tl.fromTo(g, { scale: 1 }, { scale: 1.12, duration: 0.08, ease: "power2.out", immediateRender: false }, t);
        tl.to(g, { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.08);
        tl.to(box, { boxShadow: `${GLOW_A(1.6)}, 0 18px 40px rgba(0,0,0,.6), inset 0 0 30px rgba(207,251,80,.4)`, duration: 0.08 }, t);
        tl.to(box, { boxShadow: `${GLOW_A(0.85)}, 0 18px 40px rgba(0,0,0,.6), inset 0 0 22px rgba(207,251,80,.18)`, duration: 0.45 }, t + 0.1);
      }
    },
  };
};

// ═══ orologio: quadrante d'acciaio (come il cronometro U15) con le lancette che girano ═══════════════════════════════
// o: { ora (ore, 9), min (minuti, 0), z } → { g, show(t), spin(t, dur, ore) le lancette avanzano di "ore" ore, off(t) }
const orologio = (parent, cx, cy, d, o) => {
  o = o || {};
  const R = d / 2, z = o.z || 14;
  const g = layered(el(parent, { position: "absolute", left: cx - R, top: cy - R, width: d, height: d, zIndex: z }));
  el(g, { position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 200deg, #f4f4f4, #8a8a8a, #dcdcdc, #6a6a6a, #ececec, #8a8a8a, #f4f4f4)", boxShadow: "0 34px 70px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.4)" });
  const fd = d * 0.88, fc = fd / 2;
  const face = el(g, { position: "absolute", left: d * 0.06, top: d * 0.06, width: fd, height: fd, borderRadius: "50%", background: "radial-gradient(circle at 45% 35%, #333, #111 72%)", boxShadow: "inset 0 10px 26px rgba(0,0,0,.85)", overflow: "hidden" });
  const SV = svgIn(face, fd, fd);
  for (let k = 0; k < 60; k++) {
    const a = (k / 60) * Math.PI * 2, rr = fd * 0.44, l = k % 5 ? fd * 0.025 : fd * 0.07;
    pathEl(SV, `M${(fc + Math.sin(a) * rr).toFixed(1)} ${(fc - Math.cos(a) * rr).toFixed(1)} L${(fc + Math.sin(a) * (rr - l)).toFixed(1)} ${(fc - Math.cos(a) * (rr - l)).toFixed(1)}`, { stroke: k % 5 ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.9)", "stroke-width": k % 5 ? 2 : 6, "stroke-linecap": "round" });
  }
  [12, 3, 6, 9].forEach((n, i) => {
    const a = (i / 4) * Math.PI * 2, rr = fd * 0.3;
    el(face, { position: "absolute", left: fc + Math.sin(a) * rr - 40, top: fc - Math.cos(a) * rr - 30, width: 80, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: fd * 0.1, color: K.white }, String(n));
  });
  const hand = (len, w, col) => el(face, { position: "absolute", left: fc - w / 2, top: fc - len, width: w, height: len + w * 0.8, borderRadius: w / 2, background: col, transformOrigin: `50% ${len}px`, boxShadow: "0 4px 10px rgba(0,0,0,.6)", zIndex: 3 });
  const hH = hand(fd * 0.22, fd * 0.04, "#ffffff"), hM = hand(fd * 0.34, fd * 0.026, "#ffffff");
  el(face, { position: "absolute", left: fc - fd * 0.04, top: fc - fd * 0.04, width: fd * 0.08, height: fd * 0.08, borderRadius: "50%", background: K.lime, boxShadow: GLOW_A(0.8), zIndex: 4 });
  const h0 = o.ora == null ? 9 : o.ora, m0 = o.min || 0;
  gsap.set(hH, { rotation: (h0 % 12) * 30 + m0 * 0.5 });
  gsap.set(hM, { rotation: m0 * 6 });
  gsap.set(g, { opacity: 0 });
  let cur = 0;
  return {
    g, face,
    show: (t) => tl.fromTo(g, { opacity: 0, scale: 0.8, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, t),
    spin: (t, dur, ore, ease) => {
      cur += ore;
      tl.to(hM, { rotation: m0 * 6 + cur * 360, duration: dur, ease: ease || "power1.inOut" }, t);
      tl.to(hH, { rotation: (h0 % 12) * 30 + m0 * 0.5 + cur * 30, duration: dur, ease: ease || "power1.inOut" }, t);
    },
    off: (t) => tl.to(g, { filter: "grayscale(1) brightness(.5)", duration: 0.3 }, t),
  };
};
