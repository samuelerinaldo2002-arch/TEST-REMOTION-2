// ═══ KW kit v2 · reel 12/10 "I contenuti non sono pubblicità" (sessione 5, sotto-agente della regia) ═══════════════════
// File a parte, nomi col suffisso R12: non cambia nessuna funzione degli altri file del kit (il build concatena tutti i
// kit2-*.js nello stesso ambito). Qui solo definizioni: niente codice che parte da solo.
// - cartelloneR12: il tuo reel vero che diventa un cartellone pubblicitario (pannello in grafite, poster chiaro con l'offerta,
//   gambe d'acciaio, lampade): interfaccia della pubblicità di Instagram, adesivi delle offerte, cartellino del prezzo, lampade
//   che si accendono / si spengono, crollo a domino
// - levaR12: l'interruttore grande "Pubblica" (U04, come il toggle del reel 136 di Kallaway): acceso lime → spento
// - righelloR12: il righello d'acciaio a 10 segmenti numerati (la regola 8/2): segmenti che si riempiono di bianco o di lime
// - corsiaR12: la gente che passa (volti veri dell'atlante) su una corsia orizzontale che scorre
// - postoR12: il posto del cliente (cerchio tratteggiato con la persona qualunque e il "?"): resta vuoto o si riempie
// - bollaR12: la bolla di un messaggio diretto (in arrivo grafite, la tua lime) con i puntini che scrivono
// - parentesiR12: parentesi quadra orizzontale (L10) sopra un gruppo, con il numero e la parola
// - anelloR12: anello a segmenti attorno a una foto (D10): il righello della regola che si chiude attorno a te (8 bianchi + 2 lime)

const CART_R12 = { W: 788, H: 456, B: 14, RW: 241, RH: 428, L: 480 };

// ── cartellone ──────────────────────────────────────────────────────────────────────────────────────────────────────
// parent: layer del mondo · cx: centro · ground: y della strada · o: { vid (video del pool nel reel), ad: [titolo, sotto, cta],
//   fsBig (148), views ("12,4K"), z } → { g, frame, poster, reel, … } + metodi (tempi in secondi):
//   .adIG(t) "Sponsorizzato" + barra "Acquista ora" (la pubblicità di Instagram) · .build(t) il pannello cresce attorno al reel,
//   gambe e lampade · .lampsOn(t) / .lampsOff(t) (sfarfallio F05) · .viewsIn(t) · .views(t, da, a, dur) · .grey(t)
//   · .sticker(t, testo, x, y, rot, {fs, w, h, round, dark}) adesivo che cala (coordinate del pannello) · .tag(t, prezzo)
//   cartellino che oscilla · .cta(t) il bottone si gonfia · .topple(t, dir, {ang, dur}) cade a domino (dir 1 = a destra)
//   · .rect() · .panelRect() · .reelRect() · .ctaXY() · .bottomXY()
const cartelloneR12 = (parent, cx, ground, o) => {
  o = o || {};
  const { W, H, B, RW, RH, L } = CART_R12, z = o.z || 12;
  const X0 = cx - W / 2, Y0 = ground - L - H;
  const g = el(parent, { position: "absolute", left: X0, top: Y0, width: W, height: H, zIndex: z });
  // gambe d'acciaio (dietro al pannello), traversa, piedi
  const legs = el(g, { position: "absolute", left: 0, top: H - 12, width: W, height: L + 12, zIndex: 1, transformOrigin: "50% 0%" });
  const PX = [0.27 * W, 0.73 * W];
  PX.forEach((px) => {
    el(legs, { position: "absolute", left: px - 15, top: 0, width: 30, height: L + 4, borderRadius: 5, background: "linear-gradient(90deg,#5a5a5a 0%,#d9d9d9 34%,#a2a2a2 58%,#3f3f3f 100%)", boxShadow: "0 0 18px rgba(0,0,0,.45)" });
    el(legs, { position: "absolute", left: px - 46, top: L - 2, width: 92, height: 22, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 35%, #6b6b6b, #262626 70%)", boxShadow: "0 8px 16px rgba(0,0,0,.6)" });
  });
  el(legs, { position: "absolute", left: PX[0], top: L * 0.42, width: PX[1] - PX[0], height: 14, borderRadius: 4, background: "linear-gradient(180deg,#cfcfcf,#7a7a7a 60%,#4a4a4a)" });
  // lampade sopra al pannello
  const lamps = el(g, { position: "absolute", left: 0, top: -92, width: W, height: 92, zIndex: 4 });
  el(lamps, { position: "absolute", left: 24, top: 80, width: W - 48, height: 10, borderRadius: 4, background: "linear-gradient(180deg,#6a6a6a,#2c2c2c)" });
  const lens = [0.2, 0.5, 0.8].map((f) => {
    const x = f * W;
    el(lamps, { position: "absolute", left: x - 4, top: 22, width: 8, height: 62, borderRadius: 3, background: "linear-gradient(90deg,#3c3c3c,#8a8a8a,#3a3a3a)" });
    el(lamps, { position: "absolute", left: x - 38, top: 6, width: 76, height: 32, borderRadius: "10px 10px 20px 20px", background: "linear-gradient(180deg,#707070 0%,#3a3a3a 55%,#222 100%)", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: "0 8px 16px rgba(0,0,0,.5)" });
    return el(lamps, { position: "absolute", left: x - 27, top: 32, width: 54, height: 9, borderRadius: 5, background: "#4b4b4b" });
  });
  // pannello: cornice in grafite + poster di carta chiara
  const frame = el(g, { position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: 14, background: "linear-gradient(180deg,#4b4b4b 0%,#2c2c2c 32%,#1d1d1d 100%)", backgroundColor: "#262626", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 44px 100px rgba(0,0,0,.62), inset 0 2px 0 rgba(255,255,255,.16)", transformOrigin: `${B + RW / 2}px 50%`, zIndex: 3 });
  const poster = el(frame, { position: "absolute", left: B, top: B, width: W - 2 * B, height: H - 2 * B, borderRadius: 8, overflow: "hidden", background: "linear-gradient(160deg,#fcfbf7 0%,#f0efe9 55%,#e3e2db 100%)", backgroundColor: "#f0efe9" });
  const ad = o.ad || ["−30%", "OFFERTA LIMITATA", "COMPRA ORA"];
  const ax = RW + 26, aw = W - 2 * B - ax - 18;
  const copy = [
    el(poster, { position: "absolute", left: ax, top: 26, width: aw, fontFamily: FS, fontWeight: 700, fontSize: 19, letterSpacing: "3.5px", color: "#6f6e68", whiteSpace: "nowrap" }, "SPONSORIZZATO"),
    el(poster, { position: "absolute", left: ax - 4, top: 50, width: aw + 8, fontFamily: FD, fontWeight: 700, fontSize: o.fsBig || 148, lineHeight: 1, color: "#1e1e1e", whiteSpace: "nowrap" }, ad[0]),
    el(poster, { position: "absolute", left: ax, top: 216, width: aw, fontFamily: FS, fontWeight: 800, fontSize: 30, color: "#3b3b38", whiteSpace: "nowrap" }, ad[1]),
  ];
  const btn = el(poster, { position: "absolute", left: ax, top: 288, width: 384, height: 94, borderRadius: 47, background: "linear-gradient(180deg,#2e2e2e,#161616)", backgroundColor: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FS, fontWeight: 800, fontSize: 36, color: "#ffffff", whiteSpace: "nowrap", boxShadow: "0 10px 22px rgba(0,0,0,.35)" }, ad[2] + svg("arrow-right", 36, "#ffffff", 3));
  copy.push(btn);
  // luce delle lampade: il poster è al buio finché non si accendono (velo scuro), con le macchie di luce in alto
  const hot = el(poster, { position: "absolute", inset: 0, background: "radial-gradient(40% 30% at 22% 0%, rgba(255,255,255,.75), rgba(255,255,255,0) 100%), radial-gradient(40% 30% at 50% 0%, rgba(255,255,255,.75), rgba(255,255,255,0) 100%), radial-gradient(40% 30% at 78% 0%, rgba(255,255,255,.75), rgba(255,255,255,0) 100%)", opacity: 0, zIndex: 5 });
  const dark = el(poster, { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,12,12,.55), rgba(12,12,12,.7))", zIndex: 6 });
  // il reel vero (sopra al poster, a sinistra): interfaccia di Instagram + quella della pubblicità
  const reel = el(g, { position: "absolute", left: B, top: B, width: RW, height: RH, borderRadius: 8, overflow: "hidden", background: "#111", border: "1.5px solid rgba(255,255,255,.3)", zIndex: 6 });
  if (o.vid) videoTile(reel, 0, 0, RW, RH, o.vid, 1);
  el(reel, { position: "absolute", left: 0, bottom: 0, width: RW, height: 120, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.62))", zIndex: 2 });
  const hd = el(reel, { position: "absolute", left: 12, bottom: 56, display: "flex", alignItems: "center", gap: 8, zIndex: 3 });
  const avb = el(hd, { position: "relative", width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1.5px solid #fff", flex: "none" });
  imgIn(avb, "av-tu", { objectFit: "cover" });
  const nm = el(hd, { display: "flex", flexDirection: "column", lineHeight: 1.15 });
  el(nm, { fontFamily: FS, fontWeight: 700, fontSize: 15, color: "#fff", whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,.8)" }, "samuelerinaldo.media");
  const spons = el(nm, { fontFamily: FS, fontWeight: 500, fontSize: 12, color: "#fff", whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,.8)", opacity: 0 }, "Sponsorizzato");
  const igBar = el(reel, { position: "absolute", left: 0, bottom: 0, width: RW, height: 42, background: "linear-gradient(180deg,#ffffff,#ececec)", backgroundColor: "#f3f3f3", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontFamily: FS, fontWeight: 800, fontSize: 16, color: "#1e1e1e", zIndex: 4 }, "<span>Acquista ora</span>" + svg("chevron-right", 18, "#1e1e1e", 3));
  gsap.set(igBar, { y: 44 });
  const vw = el(reel, { position: "absolute", left: 10, top: 10, display: "flex", alignItems: "center", gap: 5, padding: "4px 9px 4px 6px", borderRadius: 12, background: "rgba(0,0,0,.5)", fontFamily: FS, fontWeight: 800, fontSize: 15, color: "#fff", zIndex: 4, opacity: 0 }, svg("play", 14, "#fff", 2.6, "#fff"));
  const vwN = el(vw, {}, o.views || "12,4K", "span");
  // pezzi del cartellone sovrapposti di proposito (reel sul poster, adesivi, polvere del crollo): niente errori di layout
  [g, ...g.querySelectorAll("*")].forEach((e) => { e.setAttribute("data-layout-allow-overlap", ""); e.setAttribute("data-layout-allow-occlusion", ""); });
  gsap.set([frame, legs, lamps], { opacity: 0 });
  gsap.set(igBar, { opacity: 0 });
  const api = {
    g, frame, poster, reel, legs, lamps, btn, dark, copy, igBar, spons, vw, vwN, cx, ground, X0, Y0,
    adIG: (t) => {
      tl.to(spons, { opacity: 1, duration: 0.15 }, t);
      tl.set(igBar, { opacity: 1 }, t + 0.05);
      tl.to(igBar, { y: 0, duration: 0.3, ease: "power2.out" }, t + 0.05);
    },
    build: (t, o2) => {
      o2 = o2 || {};
      tl.set(frame, { opacity: 1 }, t);
      tl.fromTo(frame, { scaleX: (RW + 2 * B) / W, scaleY: (RH + 2 * B) / H }, { scaleX: 1, scaleY: 1, duration: o2.dur || 0.5, ease: "power2.out", immediateRender: false }, t);
      copy.forEach((c, i) => tl.fromTo(c, { opacity: 0, x: -30, filter: "blur(8px)" }, { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.3, ease: "power2.out", immediateRender: false }, t + 0.16 + i * 0.05));
      copy.forEach((c, i) => tl.set(c, { filter: "none" }, t + 0.47 + i * 0.05));
      tl.set(legs, { opacity: 1 }, t + 0.1);
      tl.fromTo(legs, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, t + 0.1);
      tl.fromTo(lamps, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, t + 0.22);
    },
    lampsOn: (t) => {
      flicker(dark, t, { opacity: 0.55 }, { opacity: 0 }, 0.27);
      flicker(hot, t, { opacity: 0 }, { opacity: 1 }, 0.27);
      lens.forEach((l) => flicker(l, t, { background: "#4b4b4b", boxShadow: "none" }, { background: "#ffffff", boxShadow: "0 0 14px #fff, 0 0 40px rgba(255,255,255,.75)" }, 0.27));
    },
    lampsOff: (t, k) => {
      flicker(dark, t, { opacity: 0 }, { opacity: k == null ? 0.85 : k }, 0.2);
      flicker(hot, t, { opacity: 1 }, { opacity: 0 }, 0.2);
      lens.forEach((l) => flicker(l, t, { background: "#ffffff", boxShadow: "0 0 14px #fff, 0 0 40px rgba(255,255,255,.75)" }, { background: "#3a3a3a", boxShadow: "none" }, 0.2));
      tl.to(reel, { filter: "brightness(.32) grayscale(.6)", duration: 0.25 }, t + 0.1);
    },
    viewsIn: (t) => tl.fromTo(vw, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, t),
    views: (t, a, b, dur) => {
      const V = { v: a };
      const f = (v) => (v >= 1000 ? (v / 1000).toFixed(1).replace(".", ",") + "K" : String(Math.round(v)));
      tl.to(V, { v: b, duration: dur || 0.5, ease: "power2.in", onUpdate: () => (vwN.textContent = f(V.v)) }, t);
      tl.to(vw, { background: "rgba(60,60,60,.75)", duration: 0.2 }, t + (dur || 0.5));
    },
    grey: (t, k) => tl.to(reel, { filter: `grayscale(1) brightness(${k == null ? 0.5 : k})`, duration: 0.3, ease: "power2.out" }, t),
    sticker: (t, testo, x, y, rot, o2) => {
      o2 = o2 || {};
      const w = o2.w || 230, h = o2.h || (o2.round ? w : 92), fs = o2.fs || 44;
      const s = el(g, { position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: o2.round ? "50%" : 10, background: o2.dark ? "linear-gradient(160deg,#2f2f2f,#141414)" : "linear-gradient(160deg,#ffffff,#ecebe5)", backgroundColor: o2.dark ? "#1e1e1e" : "#f6f5f0", border: o2.dark ? "3px solid #ffffff" : "3px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: o2.font || FD, fontWeight: 700, fontSize: fs, lineHeight: 1, color: o2.dark ? "#ffffff" : "#1e1e1e", whiteSpace: "nowrap", boxShadow: "0 14px 26px rgba(0,0,0,.45)", zIndex: 8 + (o2.z || 0) }, testo);
      s.setAttribute("data-layout-allow-overlap", "");
      s.setAttribute("data-layout-allow-occlusion", "");
      gsap.set(s, { opacity: 0, rotation: rot || 0 });
      tl.fromTo(s, { opacity: 0, scale: 1.9 }, { opacity: 1, scale: 1, duration: 0.14, ease: "power2.in", immediateRender: false }, t);
      tl.fromTo(s, { y: 0 }, { y: 3, duration: 0.06, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, t + 0.14);
      return s;
    },
    tag: (t, prezzo, o2) => {
      o2 = o2 || {};
      const px = o2.x == null ? W - 70 : o2.x;
      const hang = el(g, { position: "absolute", left: px, top: -6, width: 1, height: 1, zIndex: 9, transformOrigin: "0 0" });
      el(hang, { position: "absolute", left: -2, top: 0, width: 4, height: 120, background: "linear-gradient(180deg,#d8d8d8,#9a9a9a)", borderRadius: 2 });
      const card = el(hang, { position: "absolute", left: -95, top: 112, width: 190, height: 120, borderRadius: "14px 14px 14px 14px", background: "linear-gradient(170deg,#ffffff,#eceae3)", backgroundColor: "#f6f5f0", border: "3px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 56, color: "#1e1e1e", whiteSpace: "nowrap", boxShadow: "0 18px 30px rgba(0,0,0,.5)" }, prezzo || "€ 97");
      el(card, { position: "absolute", left: 87, top: 10, width: 16, height: 16, borderRadius: "50%", background: "#1e1e1e" });
      [hang, card, ...card.querySelectorAll("*")].forEach((e) => { e.setAttribute("data-layout-allow-overlap", ""); e.setAttribute("data-layout-allow-occlusion", ""); });
      gsap.set(hang, { opacity: 0, rotation: -70 });
      tl.set(hang, { opacity: 1 }, t);
      tl.to(hang, { rotation: 22, duration: 0.32, ease: "power2.in" }, t);
      tl.to(hang, { rotation: -12, duration: 0.34, ease: "sine.inOut" }, t + 0.32);
      tl.to(hang, { rotation: 6, duration: 0.32, ease: "sine.inOut" }, t + 0.66);
      tl.to(hang, { rotation: -2, duration: 0.3, ease: "sine.inOut" }, t + 0.98);
      tl.to(hang, { rotation: 0, duration: 0.3, ease: "sine.out" }, t + 1.28);
      return hang;
    },
    cta: (t, k) => {
      tl.fromTo(btn, { scale: 1 }, { scale: k || 1.14, duration: 0.12, ease: "power2.out", immediateRender: false }, t);
      tl.to(btn, { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.12);
      tl.fromTo(btn, { boxShadow: "0 10px 22px rgba(0,0,0,.35), 0 0 0px rgba(255,255,255,0)" }, { boxShadow: "0 10px 22px rgba(0,0,0,.35), 0 0 40px rgba(255,255,255,.95)", duration: 0.1, yoyo: true, repeat: 1, immediateRender: false }, t);
    },
    topple: (t, dir, o2) => {
      o2 = o2 || {};
      const ang = (o2.ang || 80) * (dir || 1), dur = o2.dur || 0.5;
      const fx = (dir || 1) > 0 ? PX[1] + 15 : PX[0] - 15;
      gsap.set(g, { transformOrigin: `${fx}px ${H + L}px` });
      tl.to(g, { rotation: ang, duration: dur, ease: "power2.in" }, t);
      tl.to(g, { rotation: ang * 0.94, duration: 0.12, ease: "power2.out" }, t + dur);
      tl.to(g, { rotation: ang, duration: 0.14, ease: "power2.in" }, t + dur + 0.12);
      return t + dur;
    },
    // crollo sul posto (demolizione): le gambe cedono e si accorciano, il pannello cade a terra e si inclina; restituisce
    // l'istante dell'impatto. o2: { k (0,12: quanto restano le gambe), rot (gradi), dur (0,34) }
    crollo: (t, o2) => {
      o2 = o2 || {};
      const k = o2.k == null ? 0.12 : o2.k, dur = o2.dur || 0.34, dy = (L + 12) * (1 - k);
      gsap.set(legs, { transformOrigin: "50% 0%" });
      tl.to(legs, { scaleY: k, duration: dur, ease: "power2.in" }, t);
      tl.to(g, { y: dy, duration: dur, ease: "power2.in" }, t);
      tl.to(g, { rotation: o2.rot == null ? 6 : o2.rot, duration: 0.22, ease: "power2.out" }, t + dur);
      tl.fromTo(g, { y: dy }, { y: dy - 14, duration: 0.09, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, t + dur);
      return t + dur;
    },
    rect: () => [X0 - 10, Y0 - 100, X0 + W + 10, ground + 14],
    panelRect: () => [X0, Y0, X0 + W, Y0 + H],
    reelRect: () => [X0 + B, Y0 + B, X0 + B + RW, Y0 + B + RH],
    ctaXY: () => [X0 + B + ax + 192, Y0 + B + 288 + 47],
    bottomXY: () => [cx, Y0 + H],
  };
  return api;
};

// ── interruttore grande "Pubblica" (U04 · toggle del reel 136): nasce acceso, .off(t) lo spegne ─────────────────────────
// o: { label ("PUBBLICA"), z } → { g, track, knob, off(t), rect }
const levaR12 = (parent, cx, cy, o) => {
  o = o || {};
  const PW = 380, PHh = 250;
  const g = el(parent, { position: "absolute", left: cx - PW / 2, top: cy - PHh / 2, width: PW, height: PHh, borderRadius: 42, background: "linear-gradient(180deg,#474747 0%,#2b2b2b 40%,#1c1c1c 100%)", backgroundColor: "#262626", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.16)", zIndex: o.z || 14 });
  el(g, { position: "absolute", left: 0, top: 30, width: PW, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: 32, letterSpacing: "6px", color: "#e6e6e6", whiteSpace: "nowrap" }, o.label || "PUBBLICA");
  const track = el(g, { position: "absolute", left: 46, top: 92, width: 288, height: 128, borderRadius: 64, background: limeFill(1), boxShadow: `${GLOW_A(1)}, inset 0 4px 10px rgba(0,0,0,.18)` });
  const trackOff = el(track, { position: "absolute", inset: 0, borderRadius: 64, background: "linear-gradient(180deg,#3d3d3f,#2a2a2c)", boxShadow: "inset 0 4px 12px rgba(0,0,0,.6)", opacity: 0 });
  const knob = el(track, { position: "absolute", left: 288 - 118, top: 10, width: 108, height: 108, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #ffffff 0%, #f1f1ee 55%, #c9c9c4 100%)", boxShadow: "0 8px 18px rgba(0,0,0,.45)" });
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  return {
    g, track, knob,
    off: (t) => {
      tl.to(knob, { x: -(288 - 128), duration: 0.24, ease: "power2.inOut" }, t);
      tl.to(trackOff, { opacity: 1, duration: 0.18 }, t + 0.06);
      tl.to(track, { boxShadow: "0 0 0px rgba(207,251,80,0), inset 0 4px 10px rgba(0,0,0,.18)", duration: 0.25 }, t + 0.06);
    },
    rect: [cx - PW / 2, cy - PHh / 2, cx + PW / 2, cy + PHh / 2],
  };
};

// ── righello d'acciaio a n segmenti numerati (la regola) ─────────────────────────────────────────────────────────────────
// x0, y: angolo in alto a sinistra · pitch: lunghezza di un segmento · o: { h (72), z } →
// { bar, fills, nums, light(i, t), fill(i, t, "dai" | "chiedi"), sheen(t), segX(i), rect }
const righelloR12 = (parent, x0, y, n, pitch, o) => {
  o = o || {};
  const h = o.h || 72, Wt = n * pitch;
  const bar = el(parent, { position: "absolute", left: x0, top: y, width: Wt, height: h, borderRadius: 10, overflow: "hidden", background: "linear-gradient(180deg,#f6f6f3 0%,#d3d3ce 30%,#a9a9a3 62%,#e4e4df 100%)", backgroundColor: "#d8d8d3", border: "1.5px solid rgba(255,255,255,.6)", boxShadow: "0 26px 50px rgba(0,0,0,.55), inset 0 2px 0 #ffffff, inset 0 -3px 6px rgba(0,0,0,.25)", zIndex: o.z || 14 });
  const S = svgIn(bar, Wt, h);
  for (let k = 0; k <= n * 10; k++) {
    const x = (k * pitch) / 10, big = k % 10 === 0, mid = k % 5 === 0;
    pathEl(S, `M${x.toFixed(1)} 0 L${x.toFixed(1)} ${big ? h : mid ? 18 : 11}`, { stroke: big ? "rgba(30,30,30,.55)" : "rgba(30,30,30,.4)", "stroke-width": big ? 2.5 : 1.5 });
  }
  const fills = [], nums = [];
  for (let i = 0; i < n; i++) {
    const f = el(bar, { position: "absolute", left: i * pitch + 4, top: 4, width: pitch - 8, height: h - 8, borderRadius: 7, opacity: 0, zIndex: 1 });
    fills.push(f);
    nums.push(el(bar, { position: "absolute", left: i * pitch, top: 0, width: pitch, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 38, color: "#3a3a37", zIndex: 2 }, String(i + 1)));
  }
  return {
    bar, fills, nums,
    light: (i, t) => {
      tl.fromTo(nums[i], { scale: 1 }, { scale: 1.3, duration: 0.1, ease: "power2.out", immediateRender: false }, t);
      tl.to(nums[i], { scale: 1, duration: 0.3, ease: "back.out(3)" }, t + 0.1);
      tl.to(nums[i], { color: "#111111", duration: 0.1 }, t);
    },
    fill: (i, t, kind) => {
      const lime = kind === "chiedi";
      gsap.set(fills[i], { background: lime ? limeFill(1) : "linear-gradient(180deg,#ffffff,#ecece8)", boxShadow: lime ? GLOW_A(0.9) : "0 0 16px rgba(255,255,255,.9)" });
      tl.fromTo(fills[i], { opacity: 0, scaleX: 0.2 }, { opacity: 1, scaleX: 1, duration: 0.24, ease: "power2.out", immediateRender: false }, t);
    },
    sheen: (t, dur) => sheenK(bar, t, { dur: dur || 0.75, w: 60 }),
    segX: (i) => x0 + (i + 0.5) * pitch,
    rect: [x0, y, x0 + Wt, y + h],
  };
};

// ── la gente che passa: volti veri dell'atlante su una corsia orizzontale ─────────────────────────────────────────────────
// x0 → x1: tratto della corsia · y: centro · o: { volti: [indici di faceDot], gap (200), d (100), z, seed } →
// { faces: [{ h, x, y, d }], flow(t0, t1, v) (scorrono a sinistra a v px/s, con il passo), dim(t), hide(t, dur) }
const corsiaR12 = (parent, x0, x1, y, o) => {
  o = o || {};
  const V = o.volti || [3, 2, 8, 5, 13, 17, 22, 29, 25, 10, 33, 27, 38, 44, 40, 9, 53, 55, 70, 1, 12, 18, 32, 35, 41, 49, 52, 67, 80, 82];
  const gap = o.gap || 200, D = o.d || 100, sd = o.seed || 1;
  const faces = [];
  let x = x0, k = 0;
  while (x <= x1) {
    const d = D * (0.92 + 0.16 * ((hash(k, 3 + sd) + 1) / 2)), yy = y + hash(k, 7 + sd) * 12;
    const h = el(parent, { position: "absolute", left: x - d / 2, top: yy - d / 2, width: d, height: d, zIndex: o.z || 16 });
    faceDot(h, 0, 0, d, V[(k + (o.shift || 0)) % V.length], null, { bw: 3 });
    h.setAttribute("data-layout-allow-overlap", "");
    faces.push({ h, x, y: yy, d });
    x += gap * (0.85 + 0.3 * ((hash(k, 11 + sd) + 1) / 2));
    k++;
  }
  return {
    faces,
    flow: (t0, t1, v) => faces.forEach((f, i) => {
      tl.fromTo(f.h, { x: 0 }, { x: -v * (t1 - t0), duration: t1 - t0, ease: "none", immediateRender: false }, t0);
      const n = Math.max(1, Math.floor((t1 - t0) / 0.26));
      tl.fromTo(f.h, { y: 0 }, { y: -6, duration: 0.26, ease: "sine.inOut", yoyo: true, repeat: n - 1, immediateRender: false }, t0 + (i % 4) * 0.065);
    }),
    dim: (t, k2) => tl.to(faces.map((f) => f.h), { filter: `grayscale(1) brightness(${k2 == null ? 0.5 : k2})`, duration: 0.3 }, t),
    hide: (t, dur) => tl.to(faces.map((f) => f.h), { opacity: 0, duration: dur || 0.3 }, t),
  };
};

// ── il posto del cliente: cerchio tratteggiato con la persona qualunque e il "?" ────────────────────────────────────────────
// o: { z } → { g, show(t), empty(t) (il "?" sfarfalla: non arriva nessuno), fill(t) (arriva: anello lime pieno e la spunta),
//   hide(t) }
const postoR12 = (parent, cx, cy, d, o) => {
  o = o || {};
  const g = el(parent, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, zIndex: o.z || 14 });
  const ring = el(g, { position: "absolute", inset: 0, borderRadius: "50%", border: "4px dashed rgba(255,255,255,.75)" });
  const who = el(g, { position: "absolute", left: 8, top: 8, width: d - 16, height: d - 16, borderRadius: "50%", overflow: "hidden", opacity: 0.32 });
  personaK(who, 0, 0, d - 16, { z: 1 });
  const q = el(g, { position: "absolute", left: d - 34, top: -10, width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(180deg,#3a3a3a,#1e1e1e)", backgroundColor: "#262626", border: "2.5px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 30, color: "#ffffff", boxShadow: "0 6px 14px rgba(0,0,0,.5)" }, "?");
  const ok = el(g, { position: "absolute", left: d - 34, top: -10, width: 46, height: 46, borderRadius: "50%", background: limeFill(1), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: GLOW_A(0.9), opacity: 0 }, svg("check", 28, K.ink, 3.4));
  const solid = el(g, { position: "absolute", inset: -2, borderRadius: "50%", border: `6px solid ${K.lime}`, boxShadow: GLOW_A(0.9), opacity: 0 });
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  gsap.set(g, { opacity: 0 });
  return {
    g, ring, who, q,
    show: (t) => tl.fromTo(g, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, t),
    empty: (t) => { flicker(q, t, { opacity: 0.25 }, { opacity: 1 }, 0.3); tl.fromTo(g, { x: 0 }, { x: 8, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, t); },
    fill: (t) => {
      tl.to(who, { opacity: 1, duration: 0.2 }, t);
      tl.to(ring, { opacity: 0, duration: 0.15 }, t);
      tl.fromTo(solid, { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, t);
      tl.to(q, { opacity: 0, duration: 0.1 }, t);
      tl.fromTo(ok, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t + 0.08);
    },
    hide: (t, dur) => tl.to(g, { opacity: 0, duration: dur || 0.3 }, t),
  };
};

// ── bolla di un messaggio diretto ─────────────────────────────────────────────────────────────────────────────────────
// x, y: punto della coda · o: { side: "in" (grafite, coda a sinistra) | "out" (lime, coda a destra), fs (30), z } →
// { b, show(t), typing(t, dur) (tre puntini che saltano prima del testo) }
const bollaR12 = (parent, x, y, testo, o) => {
  o = o || {};
  const out = o.side === "out", fs = o.fs || 30;
  const b = el(parent, { position: "absolute", left: x, top: y - fs * 2.1, display: "flex", alignItems: "center", padding: `${Math.round(fs * 0.5)}px ${Math.round(fs * 0.8)}px`, borderRadius: Math.round(fs * 1.05), background: out ? limeFill(1) : "linear-gradient(180deg,#3a3a3c,#2a2a2c)", backgroundColor: out ? "#CFFB50" : "#323234", border: out ? "none" : "1.5px solid rgba(255,255,255,.16)", fontFamily: FS, fontWeight: 600, fontSize: fs, color: out ? K.ink : "#ffffff", whiteSpace: "nowrap", boxShadow: out ? `${GLOW_A(0.6)}, 0 14px 30px rgba(0,0,0,.45)` : "0 14px 30px rgba(0,0,0,.5)", zIndex: o.z || 40, transformOrigin: out ? "100% 100%" : "0% 100%" }, testo);
  // la bolla tua ("out") ha la coda a destra: il punto x è il suo bordo destro
  if (out) gsap.set(b, { xPercent: -100 });
  const dots = el(parent, { position: "absolute", left: out ? x - 130 : x, top: y - fs * 2.1, width: 130, height: fs * 2.1, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: Math.round(fs * 1.05), background: "linear-gradient(180deg,#3a3a3c,#2a2a2c)", border: "1.5px solid rgba(255,255,255,.16)", zIndex: (o.z || 40) - 1, opacity: 0, transformOrigin: "0% 100%" });
  const ds = [0, 1, 2].map(() => el(dots, { width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,.8)" }));
  [b, dots, ...dots.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  gsap.set(b, { opacity: 0 });
  return {
    b, dots,
    typing: (t, dur) => {
      tl.fromTo(dots, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2.4)", immediateRender: false }, t);
      ds.forEach((d, i) => tl.fromTo(d, { y: 0 }, { y: -8, duration: 0.16, yoyo: true, repeat: Math.max(1, Math.floor((dur || 0.6) / 0.32) * 2 - 1), ease: "sine.inOut", immediateRender: false }, t + i * 0.08));
      tl.to(dots, { opacity: 0, duration: 0.1 }, t + (dur || 0.6));
    },
    show: (t) => tl.fromTo(b, { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 0.32, ease: "back.out(2.2)", immediateRender: false }, t),
  };
};

// ── parentesi quadra orizzontale (L10) sopra un gruppo, con il numero e la parola ─────────────────────────────────────────
// S: svgLayer del mondo · x0 → x1, y: linea (i ganci scendono di dh verso il gruppo) · o: { color, num, word, lime, fs, z } →
// { draw(t, dur), lab }
const parentesiR12 = (parent, S, x0, x1, y, o) => {
  o = o || {};
  const col = o.lime ? K.lime : "#ffffff", dh = o.dh || 34, xm = (x0 + x1) / 2;
  const p = pathEl(S, `M${x0} ${y + dh} L${x0} ${y} L${xm - 16} ${y} L${xm} ${y - 18} L${xm + 16} ${y} L${x1} ${y} L${x1} ${y + dh}`, { fill: "none", stroke: col, "stroke-width": o.w || 7, "stroke-linecap": "round", "stroke-linejoin": "round" });
  p.style.filter = o.lime ? "drop-shadow(0 0 8px rgba(207,251,80,.8))" : "drop-shadow(0 0 8px rgba(255,255,255,.6))";
  drawable(p);
  const fs = o.fs || 120;
  const lab = el(parent, { position: "absolute", left: xm - 400, top: y - 30 - fs * 1.05, width: 800, display: "flex", alignItems: "baseline", justifyContent: "center", gap: Math.round(fs * 0.16), whiteSpace: "nowrap", zIndex: o.z || 30 });
  const n = el(lab, { fontFamily: FD, fontWeight: 700, fontSize: fs, lineHeight: 1, color: o.lime ? K.lime : "#ffffff", textShadow: o.lime ? GLOW_LT : GLOW_T }, o.num || "", "span");
  const w = el(lab, { fontFamily: FS, fontWeight: 800, fontSize: Math.round(fs * 0.42), color: o.lime ? K.lime : "#ffffff", textShadow: o.lime ? GLOW_LT : GLOW_T }, o.word || "", "span");
  gsap.set(lab, { opacity: 0 });
  return {
    p, lab, n, w,
    draw: (t, dur) => {
      drawOn(p, t, dur || 0.35, "power2.out");
      tl.fromTo(lab, { opacity: 0, y: 16, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3, ease: "power2.out", immediateRender: false }, t + 0.12);
      tl.set(lab, { filter: "none" }, t + 0.43);
    },
  };
};

// ── anello a n segmenti attorno a una foto (D10): .seg(i, t, "dai" | "chiedi", dur) disegna un segmento · .pulse(t) ─────────
// cx, cy: centro · r: raggio · o: { n (10), w (spessore 26), gap (gradi tra i segmenti, 5), z } → { S, segs, seg(i, t, kind, dur), pulse(t) }
const anelloR12 = (parent, cx, cy, r, o) => {
  o = o || {};
  const n = o.n || 10, w = o.w || 26, gap = o.gap == null ? 5 : o.gap, R = r + w;
  const box = el(parent, { position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, zIndex: o.z || 22 });
  box.setAttribute("data-layout-allow-overlap", "");
  const S = svgIn(box, 2 * R, 2 * R);
  const pt = (a) => [R + r * Math.cos(a), R + r * Math.sin(a)];
  const segs = [];
  for (let i = 0; i < n; i++) {
    const a0 = ((-90 + (i * 360) / n + gap / 2) * Math.PI) / 180, a1 = ((-90 + ((i + 1) * 360) / n - gap / 2) * Math.PI) / 180;
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    const base = pathEl(S, `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`, { fill: "none", stroke: "rgba(255,255,255,.14)", "stroke-width": w, "stroke-linecap": "butt" });
    const p = pathEl(S, `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`, { fill: "none", stroke: "#ffffff", "stroke-width": w, "stroke-linecap": "butt" });
    drawable(p);
    segs.push({ p, base });
  }
  gsap.set(box, { opacity: 0 });
  return {
    box, S, segs,
    show: (t, dur) => tl.to(box, { opacity: 1, duration: dur || 0.25 }, t),
    seg: (i, t, kind, dur) => {
      const lime = kind === "chiedi";
      segs[i].p.setAttribute("stroke", lime ? K.lime : "#ffffff");
      segs[i].p.style.filter = lime ? "drop-shadow(0 0 10px rgba(207,251,80,.9))" : "drop-shadow(0 0 8px rgba(255,255,255,.7))";
      drawOn(segs[i].p, t, dur || 0.14, "power1.out");
    },
    pulse: (t) => {
      tl.fromTo(box, { scale: 1 }, { scale: 1.06, duration: 0.14, ease: "power2.out", immediateRender: false }, t);
      tl.to(box, { scale: 1, duration: 0.35, ease: "power2.out" }, t + 0.14);
    },
  };
};
