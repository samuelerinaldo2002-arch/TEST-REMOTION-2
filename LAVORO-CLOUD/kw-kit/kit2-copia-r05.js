// ═══ KW kit v2 · COPIA FEDELE · reel 5 di Kallaway intero (blocco C2, copia-02) — aiuti del reel e scene che non sono voci ═══
// «These are the three reasons why your content is not driving leads» (03_2026-10-04_DeFA_f1uwLt.mp4, 122,09 s, 24 fps).
// Lo stile di questo reel (ottobre 2026): fondo nero coi puntini, titolo fisso in alto (bianco neretto + una parola nel
// riquadro rosso in corsivo serif), lista di barre scure con l'accento rosso a sinistra, card dei reel coi bordi sottili,
// bande di luce che le scorrono, «pulsazioni» a disco, card di borsa col grafico verde. Da noi: il suo rosso (accento) e il suo
// verde (positivo, soldi) → lime; scritte bianche; riquadro rosso con scritta bianca → riquadro lime con scritta scura; il suo
// neretto → Advercase, il corsivo serif → Patrick Hand, le etichette → Zalando Sans (come in C1).
// MISURE: coordinate di Kallaway × 1,5 (il suo 720×1280 → 1080×1920): la sua zona grafica (y 0–~1335) è la nostra area utile
// (y 0–1332), quindi i px misurati sui suoi fotogrammi (portati a 1080 di larghezza) sono già i nostri. Tempi in secondi del suo
// reel (la copia sta 1:1 sul suo tempo).
// Questo file viene PRIMA di kit2-core.js (ordine alfabetico): qui solo funzioni.

// ── colori del reel 5 nel brand ──
const R5 = {
  barra: "linear-gradient(90deg,#2b2b2b 0%,#262626 100%)",       // le sue barre scure (#1c1c1c sul nero) un filo più chiare del fondo
  bordo: "rgba(255,255,255,.07)",
  card: "linear-gradient(160deg,#2c2c2c 0%,#222 60%,#1d1d1d 100%)",
  vetro: "linear-gradient(180deg,rgba(62,62,62,.92) 0%,rgba(38,38,38,.94) 100%)",
  glowL: (a) => `0 0 24px rgba(207,251,80,${(0.55 * a).toFixed(3)}), 0 0 70px rgba(207,251,80,${(0.25 * a).toFixed(3)})`,
};

// ── titolo del reel 5 (fisso nell'HUD): righe centrate; ogni parola arriva grigia, sfocata e 5 px più in basso e diventa bianca in
// 0,2 s (come T01); i segmenti { box: true } stanno nel riquadro (il suo rosso con la scritta bianca → lime con la scritta scura)
// che si allunga parola per parola da sinistra (Kallaway: il riquadro nasce come una lamella e cresce con le parole).
// spec: { righe: [[{ t, ruolo: "sans" | "serif", size, box, unita }]], y (alto della prima riga, 207), interlinea ([92]),
//   parent (hud), x (540), z } → { root, unita, inAt(tempi), outAt(t, o), grigio(t) }
const r5Titolo = (spec) => {
  const par = spec.parent || hud, x = spec.x || 540;
  const root = layered(el(par, { position: "absolute", left: x - 700, top: spec.y == null ? 207 : spec.y, width: 1400, zIndex: spec.z || 50 }));
  const U = [], BX = [];
  let y = 0;
  spec.righe.forEach((riga, ri) => {
    const r0 = el(root, { position: "absolute", left: 0, top: y, width: 1400, display: "flex", justifyContent: "center", alignItems: "center", whiteSpace: "nowrap" });
    let gruppo = null;
    riga.forEach((sg) => {
      const serif = sg.ruolo === "serif";
      const fs = sg.size || (serif ? 74 : 64);
      let host = r0;
      if (sg.box) {
        // il riquadro: un contenitore inline col fondo lime che si scopre con clip-path (frazioni = lunghezza delle parole)
        if (!gruppo) {
          gruppo = el(r0, { position: "relative", display: "inline-flex", alignItems: "center", padding: `0 ${Math.round(fs * 0.16)}px`, height: sg.h || Math.round(fs * 1.02), marginRight: Math.round(fs * 0.16), marginLeft: Math.round(fs * 0.1) }, null, "span");
          const fondo = layered(el(gruppo, { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: K.lime, borderRadius: 3, boxShadow: R5.glowL(0.35), zIndex: 0 }));
          gsap.set(fondo, { clipPath: "inset(0% 100% 0% 0%)" });
          BX.push({ fondo, parti: [] });
        }
        host = gruppo;
      } else gruppo = null;
      const st = { position: "relative", zIndex: 1, display: "inline-block", whiteSpace: "pre", fontFamily: serif ? FH : FD, fontWeight: serif ? 400 : 700, fontSize: fs, lineHeight: 1, letterSpacing: serif ? "0" : "-0.02em", color: sg.box ? K.ink : GREY, textShadow: sg.box ? "none" : CP_GLOW_T };
      const parts = sg.unita ? [sg.t] : sg.t.split(/(?<=\s)/);
      parts.forEach((p) => {
        const w = layered(el(host, st, p.replace(/ /g, "&nbsp;"), "span"));
        gsap.set(w, { opacity: 0, filter: "blur(9px)", y: 5 });
        U.push({ w, box: sg.box ? BX[BX.length - 1] : null, n: p.trim().length + 0.6 });
        if (sg.box) BX[BX.length - 1].parti.push(U.length - 1);
      });
    });
    if (spec.tops) r0.style.top = (spec.tops[ri] - spec.tops[0]) + "px";
    y += spec.interlinea ? (spec.interlinea[ri] == null ? 92 : spec.interlinea[ri]) : 92;
  });
  // la linea d'accento sotto una riga (Kallaway: rossa sottile sotto «Your Biggest Issue», «Clear Action», la CTA) → lime
  let und = null;
  if (spec.sottolinea) {
    const so = spec.sottolinea;
    und = layered(el(root, { position: "absolute", left: 700 - so.w / 2 + (so.dx || 0), top: so.y - (spec.y == null ? 207 : spec.y), width: so.w, height: so.h || 4, borderRadius: 2, background: K.lime, boxShadow: R5.glowL(0.5), transformOrigin: "0 50%" }));
    gsap.set(und, { scaleX: 0 });
  }
  return {
    root, unita: U,
    inAt: (T) => {
      U.forEach((u, i) => {
        const t = T[Math.min(i, T.length - 1)];
        if (u.box) {
          // il riquadro si allunga fino a coprire questa parola (frazione dei caratteri del riquadro)
          const tot = u.box.parti.reduce((a, j) => a + U[j].n, 0), fin = u.box.parti.filter((j) => j <= i).reduce((a, j) => a + U[j].n, 0);
          tl.to(u.box.fondo, { clipPath: `inset(0% ${(100 * (1 - fin / tot)).toFixed(1)}% 0% 0%)`, duration: 0.12, ease: "power2.out" }, t);
          tl.to(u.w, { opacity: 1, duration: 0.06, ease: "none" }, t + 0.02);
          tl.to(u.w, { filter: "blur(0px)", y: 0, duration: 0.18, ease: "power2.out" }, t + 0.02);
          tl.set(u.w, { filter: "none" }, t + 0.21);
          return;
        }
        tl.to(u.w, { opacity: 1, duration: 0.06, ease: "none" }, t);
        tl.to(u.w, { filter: "blur(0px)", y: 0, color: K.white, duration: 0.2, ease: "power2.out" }, t);
        tl.set(u.w, { filter: "none" }, t + 0.21);
      });
    },
    // T08 (reel 5, 35,2–35,8 s): le parole tornano grigie e il titolo si spegne; il riquadro si spegne con loro
    outAt: (t, o) => {
      o = o || {};
      const W = U.filter((u) => !u.box).map((u) => u.w), Wb = U.filter((u) => u.box).map((u) => u.w);
      if (W.length) tl.to(W, { color: GREY, duration: o.grigio || 0.15, ease: "power1.out" }, t);
      BX.forEach((b) => tl.to(b.fondo, { opacity: 0.45, duration: o.grigio || 0.15 }, t));
      tl.to(U.map((u) => u.w).concat(BX.map((b) => b.fondo)), { opacity: 0, duration: o.via || 0.25, ease: "power1.in" }, t + (o.dopo == null ? 0.12 : o.dopo));
    },
    via: (t, dur) => tl.to(root, { opacity: 0, duration: dur || 0.2, ease: "power1.in" }, t),
    sottolinea: (t, dur, ease) => { if (und) tl.to(und, { scaleX: 1, duration: dur || 0.35, ease: ease || "power2.out" }, t); },
  };
};

// ── card di un reel (i reel di creator e i tuoi): riquadro arrotondato col media del pool e il bordo sottile chiaro ──
// cambi: [[t, id], …] (il primo da subito) · o: { r (10), bordo, z, glow } → { g, strati, scan(t, dur, o), rect }
const r5Card = (parent, cx, cy, w, h, cambi, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: o.r == null ? 10 : o.r, overflow: "hidden", background: "#111", boxShadow: o.glow || `0 0 0 ${o.bw || 2}px ${o.bordo || "rgba(255,255,255,.55)"}, 0 18px 50px rgba(0,0,0,.55), 0 0 30px rgba(255,255,255,.08)`, zIndex: o.z || 10 }));
  const strati = [];
  (cambi || []).forEach(([t, id], i) => {
    const s = mediaTile(g, 0, 0, w, h, id, 1);
    s.style.width = "100%"; s.style.height = "100%"; s.style.borderRadius = "0px";
    gsap.set(s, { opacity: i === 0 ? 1 : 0 });
    if (i > 0) { tl.set(s, { opacity: 1 }, t); tl.set(strati[i - 1], { opacity: 0 }, t); }
    strati.push(s);
  });
  return { g, strati, rect: [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2] };
};

// ── banda di luce che scorre una card dall'alto in basso (Kallaway: rossa sui reel di scena 1 e 19, verde sui suoi reel di
// scena 7, 11, 23): una lamella luminosa larga quanto la card con l'alone, e sopra di lei la card tinta che si spegne.
// card = elemento con overflow nascosto · o: { col (lime), h (0,09 dell'altezza), tinta (0,35), ease ("power1.inOut") }
const r5Scan = (card, t, dur, o) => {
  o = o || {};
  const W = parseFloat(card.style.width), H = parseFloat(card.style.height);
  const col = o.col || K.lime, bh = Math.max(14, Math.round(H * (o.h || 0.09)));
  const wrap = layered(el(card, { position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", pointerEvents: "none", zIndex: o.z || 30 }));
  const tinta = el(wrap, { position: "absolute", left: 0, top: 0, width: W, height: H, background: col, mixBlendMode: "multiply", opacity: 0 });
  const band = el(wrap, { position: "absolute", left: -10, top: -bh, width: W + 20, height: bh, background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${col} 42%, #ffffff 50%, ${col} 58%, rgba(0,0,0,0) 100%)`, boxShadow: `0 0 ${Math.round(bh * 1.2)}px ${col}`, filter: "blur(2px)", opacity: 0 });
  tl.set(band, { opacity: 1 }, t);
  tl.fromTo(band, { y: 0 }, { y: H + bh, duration: dur, ease: o.ease || "power1.inOut", immediateRender: false }, t);
  tl.set(band, { opacity: 0 }, t + dur);
  if (o.tinta !== 0) {
    tl.to(tinta, { opacity: o.tinta || 0.35, duration: dur * 0.5 }, t);
    tl.to(tinta, { opacity: 0, duration: o.spegni || 0.5 }, t + dur);
  }
  return { band, tinta };
};

// ── disco che pulsa (Kallaway: il cerchio rosso pieno sfumato che si allarga e si spegne dietro a un oggetto: «Leads» in scena
// 1, le pillole di scena 13 e 21, la persona di scena 15; verde dietro la card di borsa) → lime ──
// o: { r0, r1, dur (0,5), a (0,55), col } ; parent nel mondo o nell'HUD
const r5Pulse = (parent, cx, cy, t, o) => {
  o = o || {};
  const r1 = o.r1 || 120, col = o.col || "207,251,80";
  const d = layered(el(parent, { position: "absolute", left: cx - r1, top: cy - r1, width: 2 * r1, height: 2 * r1, borderRadius: "50%", background: `radial-gradient(circle, rgba(${col},${o.a || 0.55}) 0%, rgba(${col},${(o.a || 0.55) * 0.75}) 45%, rgba(${col},${(o.a || 0.55) * 0.25}) 68%, rgba(${col},0) 72%)`, opacity: 0, zIndex: o.z == null ? 2 : o.z, pointerEvents: "none" }));
  gsap.set(d, { scale: (o.r0 || 20) / r1 });
  tl.set(d, { opacity: 1 }, t);
  tl.to(d, { scale: 1, duration: o.dur || 0.5, ease: o.ease || "power2.out" }, t);
  tl.to(d, { opacity: 0, duration: o.via || 0.45, ease: "power1.in" }, t + (o.tiene == null ? (o.dur || 0.5) * 0.6 : o.tiene));
  return d;
};

// ── chip scura con la scritta bianca (Kallaway: «Trust», «Buy», le pillole «Proof Of Results», «Nonobvious»…): riquadro
// arrotondato grafite col bordo chiaro sottile ──  o: { fs (34), h, padX, r, bordo, fondo, peso, col, z }
const r5Chip = (parent, cx, cy, testo, o) => {
  o = o || {};
  const fs = o.fs || 34, h = o.h || Math.round(fs * 1.6);
  const c = layered(el(parent, { position: "absolute", left: cx, top: cy - h / 2, height: h, padding: `0 ${o.padX == null ? Math.round(fs * 0.55) : o.padX}px`, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", borderRadius: o.r == null ? 10 : o.r, background: o.fondo || R5.vetro, boxShadow: `inset 0 0 0 ${o.bw || 2}px ${o.bordo || "rgba(255,255,255,.55)"}, 0 10px 30px rgba(0,0,0,.5)`, fontFamily: o.font || FS, fontWeight: o.peso || 700, fontSize: fs, color: o.col || K.white, letterSpacing: "-0.01em", zIndex: o.z || 12 }, testo));
  gsap.set(c, { xPercent: -50 });
  return c;
};

// ── card di borsa (Kallaway: «$221,42 → $309,99» e il «ROI $40,298 → $118,000» col grafico verde che sale): vetro scuro col bordo
// chiaro, etichetta piccola, valore grande che conta, linea del grafico che si disegna da sinistra (verde → lime) ──
// o: { etichetta ("ROI" | null), fs (64), punti ([[u, v]] 0–1), valuta ("€"), dec (2 | 0) }
const r5Borsa = (parent, cx, cy, w, h, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: Math.round(w * 0.06), background: "linear-gradient(170deg,#343434 0%,#262626 55%,#202020 100%)", boxShadow: "inset 0 0 0 2.5px rgba(255,255,255,.62), 0 0 26px rgba(255,255,255,.18), 0 24px 60px rgba(0,0,0,.6)", zIndex: o.z || 12 }));
  if (o.etichetta) el(g, { position: "absolute", left: w * 0.075, top: h * 0.07, fontFamily: FS, fontWeight: 700, fontSize: Math.round(w * 0.04), color: "rgba(255,255,255,.85)" }, o.etichetta);
  const fs = o.fs || Math.round(w * 0.105);
  const val = el(g, { position: "absolute", left: w * 0.075, top: h * (o.etichetta ? 0.14 : 0.1), fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, letterSpacing: "-0.02em", textShadow: "0 0 14px rgba(255,255,255,.35)", whiteSpace: "nowrap" }, "");
  const S = svgLayer(g, 3, 0, 0, w, h);
  const px = (u) => w * (0.1 + 0.8 * u), py = (v) => h * (0.86 - 0.5 * v);
  el(g, { position: "absolute", left: w * 0.1, top: h * 0.88, width: w * 0.8, height: 2, background: "rgba(255,255,255,.35)" });
  el(g, { position: "absolute", left: w * 0.1, top: h * 0.36, width: 2, height: h * 0.52, background: "rgba(255,255,255,.35)" });
  const pts = o.punti || [[0, 0], [0.18, 0.08], [0.32, 0.28], [0.48, 0.42], [0.62, 0.44], [0.74, 0.46], [0.86, 0.8], [1, 0.78]];
  const d = "M" + pts.map(([u, v]) => `${px(u).toFixed(1)} ${py(v).toFixed(1)}`).join(" L");
  const ln = pathEl(S, d, { fill: "none", stroke: K.lime, "stroke-width": Math.max(3, w * 0.008), "stroke-linejoin": "round", "stroke-linecap": "round" });
  ln.style.filter = `drop-shadow(0 0 6px ${K.lime})`;
  const LL = drawable(ln);
  const fmt = (x) => (o.valuta || "€") + (o.dec === 0 ? Math.round(x).toLocaleString("it-IT") : x.toFixed(2).replace(".", ","));
  return {
    g, val, ln,
    // il valore conta da a → b fra t0 e t1 (lineare, R6) e la linea si disegna con lui (fino alla frazione fino, 1)
    conta: (t0, t1, a, b, fino, ease) => {
      const st = { v: 0 };
      val.innerHTML = fmt(a);
      tl.fromTo(st, { v: 0 }, { v: 1, duration: t1 - t0, ease: ease || "none", immediateRender: false, onUpdate: () => { val.innerHTML = fmt(a + (b - a) * st.v); } }, t0);
      tl.to(ln, { attr: { "stroke-dashoffset": LL * (1 - (fino == null ? 1 : fino)) }, duration: t1 - t0, ease: ease || "none" }, t0);
    },
    fmt,
  };
};

// ── persona (Kallaway: il cerchio bianco con la sagoma nera — l'utente, «Viewer»; o la sagoma con la stellina, rossa) ──
// o: { d (110), col (bianco), sagoma (K.ink), icona ("user-round") }
const r5Persona = (parent, cx, cy, o) => {
  o = o || {};
  const d = o.d || 110;
  const p = layered(el(parent, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: "50%", background: o.col || "#ffffff", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", boxShadow: o.glow || "0 0 18px rgba(255,255,255,.55), 0 0 50px rgba(255,255,255,.18)", zIndex: o.z || 14 }, svg(o.icona || "user-round", Math.round(d * 0.86), o.sagoma || K.ink, 2.2, o.sagoma || K.ink)));
  return p;
};

// ── linea tratteggiata che si allunga (Kallaway: la linea rossa a puntini fra la persona e la pagina, fra la pagina e il ROI) ──
const r5Tratteggio = (S, pts, t, dur, o) => {
  o = o || {};
  const c = connector(S, pts, { color: o.col || K.lime, w: o.w || 4, dash: o.dash || [7, 7] });
  c.p.style.filter = `drop-shadow(0 0 5px ${o.col || K.lime})`;
  c.draw(t, dur, o.ease || "power1.out");
  return c;
};

// titolo «3 Motivi …» del reel 5 (scene 1, 3, 9, 17, 25): riquadro «3 Motivi» + «Per Cui I Contenuti» / «Non Portano Clienti»
const R5_TITOLO = [[{ t: "3 Motivi", ruolo: "serif", size: 72, box: true }, { t: "Per Cui I Contenuti", ruolo: "sans", size: 56 }], [{ t: "Non Portano Clienti", ruolo: "sans", size: 56 }]];
// il titolo già pieno al taglio (montato sotto la facecam che copre prima del taglio) e via a t1
const r5TitoloPieno = (t0, t1, o) => {
  o = o || {};
  const T = r5Titolo({ righe: o.righe || R5_TITOLO, interlinea: o.interlinea || [92], y: o.y });
  T.inAt(T.unita.map(() => t0 - 0.3));
  if (t1 != null) tl.set(T.root, { opacity: 0 }, t1);
  return T;
};

/* @copia r05_apertura · Titolo, lista lampo, due reel di creator scansionati e la card «Clienti» che scende (reel 5, 0–3,417 s)
 * kallaway: reel 5, 0–3,417 s · il titolo si scrive parola per parola dal primo fotogramma (riquadro rosso «3 Reasons» che si
 *   allunga, poi «Your Content / Is Not Driving Leads», una parola ogni 0,125 s); 0,125 s: le tre barre della lista entrano da
 *   sinistra in corsa una dopo l'altra (0,083 s), salgono un poco e a 1,08 s si spengono; due reel di creator salgono da sotto e
 *   si accendono (1,08–1,9 s); una banda rossa li scorre dall'alto (1,88–2,5 s) e li lascia rossi in basso; due archi bianchi
 *   li abbracciano e scendono (2,0–2,6 s); la camera si allontana (×0,765 attorno a 540, 335); da sotto sale la card «Leads»
 *   col grafico rosso che scende e il disco rosso che pulsa (2,33–2,8 s)
 * misure: barre come la lista (accento x −15 → 139 px in 0,8 s); reel 277×497 px a (345, 766) e (726, 766) a 1,92 s; camera
 *   ×1 → ×0,888 (2,21) → ×0,78 (2,46) → ×0,765 (3,0) → ×0,757 (3,4); card «Leads» 565×378 (mondo) col centro a (540, 1280)
 * scena: t0 (0), t1 (3,417), X, Y, parent · opzioni: clip (["cr_a", "cr_b"]), voci (la lista), titolo (righe)
 * colori: il rosso della banda, dei reel e della card → lime (grafico che scende lime, disco lime)
 */
COPIA.r05_apertura = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0 || 0;
  // titolo nell'HUD: «3» al primo fotogramma, poi una parola ogni ~0,1 s (i suoi istanti: 0 · 0,17 · 0,38 · 0,5 · 0,62 · 0,75 · 0,88 · 1,0)
  const T = r5Titolo({ righe: o.titolo || R5_TITOLO, interlinea: [92] });
  T.inAt(o.tempiTitolo || [0, 0.17, 0.38, 0.44, 0.5, 0.56, 0.75, 0.88, 1.0]);
  tl.set(T.root, { opacity: 0 }, scena.t1);
  // la lista lampo: entra da sinistra (0,125 s, poi ogni 0,083 s), sale di 32 px da 0,75 s e si spegne a 1,08 s
  const [lx, lt] = W(544, 552);
  const lista = r5Lista(L, lx, lt, o.voci || R5_VOCI, { passo: 159 });
  [0, 1, 2].forEach((i) => {
    const r = lista.rows[i].r, f = cpCurva([[0, -151], [0.042, -130], [0.083, -109], [0.125, -94], [0.167, -79], [0.208, -67], [0.25, -55], [0.292, -46], [0.333, -37], [0.375, -31], [0.417, -25], [0.458, -19], [0.5, -15], [0.542, -10], [0.583, -7], [0.625, -4], [0.708, -1], [0.79, 0]]);
    const ti = t0 + 0.125 + i * 0.083, st = { v: 0 };
    gsap.set(r, { x: -151 });
    tl.to(r, { opacity: 1, duration: 0.08 }, ti);
    tl.fromTo(st, { v: 0 }, { v: 1, duration: 0.79, ease: "none", immediateRender: false, onUpdate: () => gsap.set(r, { x: f(st.v * 0.79) }) }, ti);
  });
  lista.sposta([[t0 + 0.75, 0], [t0 + 0.833, -3], [t0 + 0.917, -12], [t0 + 1.0, -24], [t0 + 1.083, -32]]);
  tl.to(lista.box, { opacity: 0, filter: "blur(8px)", duration: 0.12, ease: "power1.in" }, t0 + 1.06);
  // i due reel di creator salgono da sotto e si accendono (1,08 → 1,92 s)
  const cl = o.clip || ["cr_a", "cr_b"];
  const cards = [[345, cl[0]], [726, cl[1]]].map(([sx, id]) => {
    const [x, y] = W(sx, 766);
    const c = r5Card(L, x, y, 277, 497, [[0, id]], { r: 8 });
    gsap.set(c.g, { opacity: 0, y: 330, filter: "brightness(.35) blur(3px)" });
    tl.to(c.g, { opacity: 1, duration: 0.12 }, t0 + 1.08);
    tl.to(c.g, { y: 0, duration: 0.84, ease: "power2.out" }, t0 + 1.08);
    tl.to(c.g, { filter: "brightness(1) blur(0px)", duration: 0.4, ease: "power1.out" }, t0 + 1.12);
    tl.set(c.g, { filter: "none" }, t0 + 1.53);
    // la banda lime li scorre (1,88 → 2,5 s) e lascia il basso tinto
    r5Scan(c.g, t0 + 1.88, 0.62, { tinta: 0 });
    const basso = el(c.g, { position: "absolute", left: 0, bottom: 0, width: 277, height: 497 * 0.45, background: `linear-gradient(180deg, rgba(207,251,80,0) 0%, rgba(207,251,80,.55) 100%)`, mixBlendMode: "multiply", opacity: 0, zIndex: 20 });
    tl.to(basso, { opacity: 1, duration: 0.5 }, t0 + 2.1);
    return c;
  });
  // due archi bianchi attorno ai reel (2,0–2,6 s): si disegnano, girano verso il basso e si spengono
  const [ax, ay] = W(540, 790);
  const SA = svgLayer(L, 8, ax - 520, ay - 520, 1040, 1040);
  const archi = [-1, 1].map((s) => {
    const r = 380, a0 = s < 0 ? 200 : -20, a1 = s < 0 ? 160 : 20;
    const pt = (a) => [ax + r * Math.cos((a * Math.PI) / 180), ay + r * Math.sin((a * Math.PI) / 180)];
    const [p0, p1] = [pt(a0), pt(a1)];
    const p = pathEl(SA, `M${p0[0]} ${p0[1]} A${r} ${r} 0 0 ${s < 0 ? 0 : 1} ${p1[0]} ${p1[1]}`, { fill: "none", stroke: "#ffffff", "stroke-width": 4, "stroke-linecap": "round", opacity: 0.9 });
    p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.9))";
    p.style.transformOrigin = `${ax}px ${ay}px`;
    drawable(p);
    tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.2, ease: "power1.out" }, t0 + 2.0);
    tl.to(p, { rotation: s * -48, duration: 0.45, ease: "power2.in" }, t0 + 2.2);
    tl.to(p, { opacity: 0, duration: 0.12 }, t0 + 2.55);
    return p;
  });
  // la card «Clienti» (la sua «Leads») sale da sotto col grafico che scende e il disco che pulsa
  const [kx, ky] = W(540, 1280);
  const kc = layered(el(L, { position: "absolute", left: kx - 282, top: ky - 189, width: 565, height: 378, borderRadius: 18, background: "linear-gradient(170deg,#343a24 0%,#262a1c 55%,#202217 100%)", boxShadow: "inset 0 0 0 2px rgba(207,251,80,.45), 0 0 40px rgba(207,251,80,.18), 0 24px 60px rgba(0,0,0,.6)", overflow: "hidden", zIndex: 12 }));
  el(kc, { position: "absolute", left: 34, top: 26, fontFamily: FS, fontWeight: 700, fontSize: 34, color: K.white }, "Clienti");
  el(kc, { position: "absolute", right: 34, top: 30, fontFamily: FS, fontWeight: 700, fontSize: 24, color: K.lime, display: "flex", alignItems: "center", gap: 4 }, svg("trending-down", 26, K.lime, 2.6) + "−38%");
  el(kc, { position: "absolute", left: 44, top: 100, width: 3, height: 230, background: "rgba(255,255,255,.55)" });
  el(kc, { position: "absolute", left: 44, top: 328, width: 480, height: 3, background: "rgba(255,255,255,.55)" });
  const SK = svgLayer(kc, 3, 0, 0, 565, 378);
  const lk = pathEl(SK, "M60 150 L110 170 L150 160 L200 205 L250 200 L300 240 L345 232 L390 272 L440 268 L505 305", { fill: "none", stroke: K.lime, "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" });
  lk.style.filter = `drop-shadow(0 0 6px ${K.lime})`;
  const LKL = drawable(lk);
  gsap.set(kc, { y: 260, opacity: 0 });
  tl.to(kc, { opacity: 1, duration: 0.1 }, t0 + 2.3);
  tl.to(kc, { y: 0, duration: 0.45, ease: "power2.out" }, t0 + 2.3);
  tl.to(lk, { attr: { "stroke-dashoffset": 0 }, duration: 0.9, ease: "power1.inOut" }, t0 + 2.4);
  r5Pulse(L, kx - 20, ky - 10, t0 + 2.33, { r0: 50, r1: 210, dur: 0.45, a: 0.6, tiene: 0.4, via: 0.5, z: 13 });
  // la camera si allontana (attorno a 540, 335 dello schermo)
  cpCam.scala([[t0 + 2.0, 1], [t0 + 2.1, 0.96], [t0 + 2.21, 0.888], [t0 + 2.33, 0.82], [t0 + 2.46, 0.78], [t0 + 2.6, 0.772], [t0 + 3.0, 0.765], [t0 + 3.417, 0.757]], [540, 335]);
  return { rect: null, pose: null, ancore: {}, elementi: { T, lista, cards, archi, kc } };
};

/* @copia r05_argomenti · Il reel del creator, gli argomenti tutti diversi, poi l'algoritmo ti porta le persone sbagliate
 *   (reel 5, 13,79–18,54 s; dentro c'è O21)
 * kallaway: reel 5, 13,79 s · sotto l'intestazione 01 sale il reel di un creator (barra-classifica rosso→verde a sinistra), va a
 *   sinistra (14,46–14,96 s) e da lui parte una linea bianca verso destra e giù fino al riquadro coi sei argomenti (Fitness Tips
 *   · Motivation · AI News · Dating Advice · Business Tips · Content Marketing), che si scrive sfocato e si accende; una banda
 *   verde lo scorre dall'alto (15,12–15,79 s); il reel cambia (una folla, 15,79 s); a 16,29 s riquadro e linea si spengono, il
 *   reel torna al centro (16,3–16,9 s) e attorno parte O21; la camera si allontana (reel 302 → 251 px fra 16,5 e 18,5 s)
 * misure: reel 302×560 a (540, 883) che sale da +40 px; a sinistra centro x 352 (15,12 s); riquadro x 648–985, y 720–1000;
 *   linea dall'angolo del reel (531, 660) a (820, 660) e giù a (820, 720); camera ×1 → ×0,83 attorno a (540, 841)
 * scena: t0 (13,79), t1 (18,542), X, Y, parent · opzioni: clip (["metro", "folla"]), argomenti (6 testi)
 * colori: il suo verde (scansione) → lime; il suo rosso (persone sbagliate) → lime
 */
COPIA.r05_argomenti = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(13), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0;
  const cl = o.clip || ["metro", "folla"];
  const [px, py] = W(540, 830);
  const tel = r5Card(L, px, py, 302, 560, [[0, cl[0]], [t0 + 2.0, cl[1]]], { r: 12, z: 14 });
  gsap.set(tel.g, { opacity: 0, y: 53 });
  tl.to(tel.g, { opacity: 1, duration: 0.12 }, t0);
  tl.to(tel.g, { y: 0, duration: 0.4, ease: "power2.out" }, t0);
  // a sinistra (14,46 → 14,96 s) e poi di nuovo al centro (16,3 → 16,9 s)
  tl.to(tel.g, { x: -188, duration: 0.55, ease: "power2.inOut" }, t0 + 0.62);
  tl.to(tel.g, { x: 0, duration: 0.6, ease: "power2.inOut" }, t0 + 2.5);
  // la linea bianca e il riquadro degli argomenti
  const S = svgLayer(L, 13, X - 600, Y - 600, 1200, 1200);
  const [a1x, a1y] = W(503, 660), [a2x] = W(820, 660), [, a3y] = W(820, 722);
  const lin = connector(S, [[a1x, a1y], [a2x, a1y], [a2x, a3y]], { color: "rgba(255,255,255,.85)", w: 2.5 });
  lin.draw(t0 + 0.33, 0.5, "power1.inOut");
  const [bx, by] = W(816, 860);
  const arg = o.argomenti || ["Consigli Fitness", "Motivazione", "Notizie AI", "Consigli Di Coppia", "Idee Di Business", "Content Marketing"];
  const box = layered(el(L, { position: "absolute", left: bx - 168, top: by - 140, width: 336, height: 280, borderRadius: 14, background: R5.vetro, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.4), 0 16px 40px rgba(0,0,0,.5)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, zIndex: 14 }));
  const voci = arg.map((s) => el(box, { fontFamily: FS, fontWeight: 700, fontSize: 25, lineHeight: 1.08, color: K.white, whiteSpace: "nowrap" }, s));
  gsap.set(box, { opacity: 0, filter: "blur(8px)" });
  tl.to(box, { opacity: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out" }, t0 + 0.83);
  tl.set(box, { filter: "none" }, t0 + 1.09);
  // la banda lime scorre il riquadro (15,12 → 15,79 s) e lo lascia acceso un attimo
  const sc = r5Scan(box, t0 + 1.33, 0.6, { h: 0.3, tinta: 0.0 });
  const acc = el(box, { position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(207,251,80,.0), rgba(207,251,80,.55))`, opacity: 0, zIndex: 0 });
  tl.to(acc, { opacity: 1, duration: 0.3 }, t0 + 1.4);
  tl.to(acc, { opacity: 0, duration: 0.3 }, t0 + 2.0);
  // via riquadro e linea (16,29 s)
  tl.to(box, { opacity: 0, filter: "blur(8px)", duration: 0.25, ease: "power1.in" }, t0 + 2.5);
  lin.hide(t0 + 2.5, 0.2);
  // O21 attorno al reel tornato al centro
  const [rx, ry] = W(544, 841);
  const o21 = COPIA.O21({ X: rx, Y: ry, parent: L }, { r: 440, disegno: [t0 + 2.5, 0.6], compare: [t0 + 3.17, 0.16], colore: [t0 + 3.83, 0.34] });
  // la camera si allontana piano (16,5 → 18,54 s)
  cpCam.scala([[t0 + 2.7, 1], [t0 + 3.33, 0.89], [t0 + 3.83, 0.86], [t0 + 4.67, 0.83], [scena.t1, 0.82]], [540, 841]);
  return { rect: null, pose: null, ancore: {}, elementi: { tel, box, voci, o21, sc } };
};

// uno strato del mondo le cui coordinate interne sono quelle dello SCHERMO alla posa della camera dell'istante t (scala compresa):
// serve per montare la scena dopo senza un taglio della camera (Kallaway passa da una cosa all'altra nello stesso mondo), con le
// misure prese sui suoi fotogrammi (px dello schermo). La scena si chiama poi con X = 540, Y = 880.
const r5Strato = (t, z) => {
  const p = cpCam.posa(t), L = layer(z || 10);
  gsap.set(L, { x: p.fx - ANCHOR.x / p.s, y: p.fy - ANCHOR.y / p.s, scale: 1 / p.s, transformOrigin: "0 0" });
  return L;
};

// la card di vetro coi sei argomenti (scene 3 e 5)
const R5_ARGOMENTI = ["Consigli Fitness", "Motivazione", "Notizie AI", "Consigli Di Coppia", "Idee Di Business", "Content Marketing"];

/* @copia r05_problema · «Il Tuo Vero Problema»: la card degli argomenti e la banda che la scorre (reel 5, 20,083–22,625 s)
 * kallaway: reel 5, 20,083 s · titolo in corsivo serif tutto bianco («Your Biggest Issue»: Your 20,08 · Biggest 20,21 · Issue
 *   20,58); la card di vetro scura coi sei argomenti compare a 20,21 s e cresce piano (×1,13 fino al taglio); su «topic
 *   selection» una banda rossa la scorre dall'alto in basso (21,58–22,2 s) e la lascia col bordo basso acceso; a 22,08 s la
 *   linea d'accento sotto il titolo
 * misure: titolo y 264–348, x 249–834; card 510×453 a (557, 800) a 20,46 s → 575×491 a 22,58 s; righe passo 60 px, ~40 px
 * scena: t0 (20,083), t1 (22,625), X, Y, parent · opzioni: titolo (righe), argomenti
 * colori: il suo rosso (banda, linea) → lime
 */
COPIA.r05_problema = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0;
  const T = r5Titolo({ righe: o.titolo || [[{ t: "Il Tuo Vero Problema", ruolo: "serif", size: 84 }]], y: 262, sottolinea: { y: 356, w: 560, h: 4 } });
  T.inAt([t0, t0 + 0.07, t0 + 0.13, t0 + 0.5]);
  T.sottolinea(t0 + 1.95, 0.35);
  tl.set(T.root, { opacity: 0 }, scena.t1);
  const [cx, cy] = W(557, 800);
  const card = layered(el(L, { position: "absolute", left: cx - 255, top: cy - 226, width: 510, height: 453, borderRadius: 14, background: R5.vetro, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.22), 0 0 40px rgba(255,255,255,.08), 0 24px 60px rgba(0,0,0,.6)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 12 }));
  const voci = (o.argomenti || R5_ARGOMENTI).map((s) => el(card, { position: "relative", zIndex: 2, fontFamily: FS, fontWeight: 700, fontSize: 40, lineHeight: "60px", color: K.white, whiteSpace: "nowrap", letterSpacing: "-0.01em" }, s));
  gsap.set(card, { opacity: 0 });
  tl.to(card, { opacity: 0.45, duration: 0.12 }, t0 + 0.125);
  tl.to(card, { opacity: 1, duration: 0.25 }, t0 + 0.25);
  // la banda lime dall'alto in basso; le righe che tocca diventano lime per un attimo
  r5Scan(card, t0 + 1.47, 0.62, { h: 0.1, tinta: 0.22, spegni: 0.25, z: 3, ease: "none" });
  voci.forEach((v, k) => { const tk = t0 + 1.47 + 0.62 * ((k + 0.7) / 6.6); tl.to(v, { color: K.lime, duration: 0.06 }, tk); tl.to(v, { color: K.white, duration: 0.2 }, tk + 0.12); });
  const fondo = el(card, { position: "absolute", left: 0, bottom: 0, width: 510, height: 60, background: "linear-gradient(180deg, rgba(207,251,80,0), rgba(207,251,80,.75))", opacity: 0, zIndex: 1 });
  tl.to(fondo, { opacity: 1, duration: 0.1 }, t0 + 2.05);
  tl.to(fondo, { opacity: 0, duration: 0.3 }, t0 + 2.2);
  // la card cresce piano (spinta: ×1,13 fino al taglio)
  cpCam.zoom(t0 + 0.38, scena.t1 - t0 - 0.38, 1.13, [557, 800], "sine.out");
  return { rect: null, pose: null, ancore: {}, elementi: { T, card, voci } };
};

/* @copia r05_target · «Fai Solo Video Che / Aiutano Il Tuo Pubblico»: il tuo reel, la banda, il contatore, le persone, il muro
 *   di 30 reel (reel 5, 24,792–30,833 s)
 * kallaway: reel 5, 24,792 s · titolo neretto parola per parola, la seconda riga nel riquadro rosso che cresce con le parole; al
 *   centro il suo reel (lui sotto, la sagoma col cartellino sopra), una banda verde lo scorre (25,33–26,0 s); a 26,4 s il reel va
 *   a sinistra e un arco lo lega al contatore verde «↗ 77.28K» che sale fino a 219.94K (26,58–28,58 s, lineare), sotto compaiono
 *   le persone (27,58 s); a 28,58 s tutto si stringe e la camera si allontana di colpo: il reel diventa uno dei 30 di un muro
 *   (29,1–29,6 s), con i bordi che si spengono
 * misure: reel 414×737 a (540, 786); a sinistra 393 px a (335, 762); contatore 346×90 a (865, 763); persone a (820, 892);
 *   muro: celle 95×170 sullo schermo (passo 110) a 30,3 s, cioè la camera ×1 → ×0,23 in ~1 s (28,6 → 29,6) attorno al reel
 * scena: t0 (24,792), t1 (30,833), X, Y, parent · opzioni: titolo, clip ("tuo1"), muro (id delle miniature, 30)
 * colori: il suo verde (banda, contatore, freccia) → lime; il riquadro rosso → lime con la scritta scura
 */
COPIA.r05_target = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0;
  const T = r5Titolo({ righe: o.titolo || [[{ t: "Fai Solo Video Che", ruolo: "sans", size: 58 }], [{ t: "Aiutano Il Tuo Pubblico", ruolo: "sans", size: 58, box: true, h: 68 }]], tops: [221, 282], y: 221 });
  T.inAt([t0 + 0.04, t0 + 0.2, t0 + 0.41, t0 + 0.54, t0 + 0.66, t0 + 0.8, t0 + 0.92, t0 + 1.12]);
  tl.set(T.root, { opacity: 0 }, scena.t1);
  // il tuo reel al centro (pieno al taglio), la banda lime
  const [px, py] = W(540, 786);
  const tel = r5Card(L, px, py, 414, 737, [[0, o.clip || "tuo1"]], { r: 10, z: 14 });
  r5Scan(tel.g, t0 + 0.54, 0.67, { h: 0.1, tinta: 0.3, spegni: 0.35 });
  // a sinistra (26,4 → 26,8 s): x 540 → 335, ×0,95
  tl.to(tel.g, { x: -205, y: -24, scale: 0.95, duration: 0.42, ease: "power2.inOut" }, t0 + 1.6);
  // l'arco che lo lega al contatore (26,4–26,8 s)
  const S = svgLayer(L, 13, X - 600, Y - 700, 1200, 1400);
  const [ax0, ay0] = W(525, 640), [ax1, ay1] = W(525, 890), [cxm] = W(700, 0);
  const arco = pathEl(S, `M${ax0} ${ay0} C${cxm} ${ay0} ${cxm} ${ay1} ${ax1} ${ay1}`, { fill: "none", stroke: "#ffffff", "stroke-width": 3.5, "stroke-linecap": "round", opacity: 0.9 });
  arco.style.filter = "drop-shadow(0 0 5px rgba(255,255,255,.8))";
  drawable(arco);
  tl.to(arco, { attr: { "stroke-dashoffset": 0 }, duration: 0.25, ease: "power1.out" }, t0 + 1.62);
  tl.to(arco, { opacity: 0, duration: 0.15 }, t0 + 1.95);
  // il contatore
  const [kx, ky] = W(865, 763);
  const chip = layered(el(L, { position: "absolute", left: kx - 173, top: ky - 45, width: 346, height: 90, borderRadius: 12, background: R5.vetro, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.45), 0 12px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, overflow: "hidden", zIndex: 15 }));
  el(chip, { display: "flex" }, svg("arrow-up-right", 40, K.lime, 3.2));
  const num = el(chip, { fontFamily: FS, fontWeight: 800, fontSize: 52, color: K.white, letterSpacing: "-0.02em", minWidth: 210 }, "77,28K");
  const lampo = el(chip, { position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(207,251,80,0) 0%, rgba(207,251,80,.75) 70%, rgba(207,251,80,0) 100%)`, opacity: 0 });
  gsap.set(chip, { opacity: 0, scale: 0.9 });
  tl.to(chip, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }, t0 + 1.75);
  tl.to(lampo, { opacity: 1, duration: 0.1 }, t0 + 1.79); tl.to(lampo, { opacity: 0, duration: 0.35 }, t0 + 1.95);
  const st = { v: 0 };
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 2.0, ease: "none", immediateRender: false, onUpdate: () => { num.innerHTML = (77.28 + (219.94 - 77.28) * st.v).toFixed(2).replace(".", ",") + "K"; } }, t0 + 1.79);
  // le persone sotto (27,58 s) con la lineetta
  // (27,5 s) il contatore sale di 112 px e sotto compaiono le persone, grandi (181 px), con la lineetta
  tl.to(chip, { y: -112, duration: 0.3, ease: "power2.inOut" }, t0 + 2.7);
  const [qx, qy] = W(830, 866);
  const ln = layered(el(L, { position: "absolute", left: qx - 1, top: ky - 112 + 45, width: 2, height: qy - 70 - (ky - 112 + 45), background: "rgba(255,255,255,.6)", transformOrigin: "50% 0%", zIndex: 13 }));
  gsap.set(ln, { scaleY: 0 }); tl.to(ln, { scaleY: 1, duration: 0.2 }, t0 + 2.85);
  const gente = layered(el(L, { position: "absolute", left: qx - 95, top: qy - 75, width: 190, height: 150, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15 }, svg("users-round", 181, "#ffffff", 2, "#ffffff")));
  gente.style.filter = "drop-shadow(0 0 10px rgba(255,255,255,.6))";
  gsap.set(gente, { opacity: 0, scale: 0.6 }); tl.to(gente, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }, t0 + 2.8);
  // tutto si stringe (28,58 s): contatore, persone e linea si spengono, il reel torna al centro
  tl.to([chip, gente, ln], { opacity: 0, duration: 0.2 }, t0 + 3.5);
  tl.to(tel.g, { x: 0, y: 0, scale: 1, duration: 1.0, ease: "power2.inOut" }, t0 + 3.5);
  // il muro: 30 reel attorno al tuo (passo 480×860 nel mondo = 110×198 sullo schermo a ×0,23); i bordi si spengono
  const ids = o.muro || Array.from({ length: 10 }, (_, i) => `th-mio_${String(i + 1).padStart(2, "0")}`);
  const pxw = 478, pyw = 852, celle = [];
  let k = 0;
  for (let r = -3; r <= 3; r++) for (let c = -3; c <= 3; c++) {
    if (r === 0 && c === 0) continue;
    const d = Math.hypot(c * 1.0, r * 0.9);
    if (d > 3.3) continue;
    const [x, y] = [px + c * pxw, py + r * pyw];
    const cel = layered(el(L, { position: "absolute", left: x - 207, top: y - 368, width: 414, height: 737, borderRadius: 18, overflow: "hidden", background: "#222", boxShadow: "0 0 0 4px rgba(255,255,255,.18)", zIndex: 8 }));
    imgIn(cel, ids[k++ % ids.length], { objectFit: "cover" });
    const a = Math.max(0.12, 1 - Math.pow(d / 3.4, 1.6));
    gsap.set(cel, { opacity: 0 });
    tl.to(cel, { opacity: a, duration: 0.35, ease: "power1.out" }, t0 + 4.0 + 0.04 * d);
    celle.push(cel);
  }
  // la camera: ×1 → ×0,23 attorno al reel (28,6 → 29,6 s), poi piano fino a ×0,21
  cpCam.scala([[t0 + 3.46, 1], [t0 + 3.66, 0.86], [t0 + 3.79, 0.69], [t0 + 3.96, 0.55], [t0 + 4.11, 0.48], [t0 + 4.31, 0.36], [t0 + 4.56, 0.27], [t0 + 4.81, 0.24], [t0 + 5.21, 0.232], [scena.t1, 0.215]], [540, 786]);
  return { rect: null, pose: null, ancore: {}, elementi: { T, tel, chip, gente, celle } };
};

/* @copia r05_fiducia · «Fiducia» e il titolo in borsa che sale (reel 5, 35,9–38,833 s; prima c'è la lista: L01 · L02 · F03 · T08
 *   · K14)
 * kallaway: reel 5, 35,9 s · sotto l'intestazione 02 compare la chip «Trust» grande con un lampo verde (36,0–36,3 s); a 36,6 s
 *   sale e si stringe, da sotto arriva la card di borsa «$217,57» legata da una linea rossa a puntini; un disco verde pulsa
 *   dietro la card (36,9–37,4 s); il valore sale fino a $309,99 (38,75 s, lineare) e la linea verde del grafico con lui
 * misure: chip 345×104 a (531, 771) → 294×95 a (536, 590); card 476×314 a (540, 946) a 37,25 s (prima 510 px, la camera si
 *   allontana ×0,93 fra 36,75 e 37,25 s); valore +46,2 al secondo
 * scena: t0 (35,9), t1 (38,833), X, Y, parent · opzioni: parola ("Fiducia"), da (217,57), a (309,99)
 * colori: il suo verde (lampo, disco, grafico) → lime; la linea rossa a puntini → lime
 */
COPIA.r05_fiducia = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0;
  const [cx, cy] = W(536, 590);
  const chip = r5Chip(L, cx, cy, o.parola || "Fiducia", { fs: 64, h: 96, padX: 44, r: 14, z: 16 });
  // grande al centro (771) e poi su (590), più piccola
  gsap.set(chip, { y: 181, scale: 1.17, opacity: 0, transformOrigin: "50% 50%" });
  tl.to(chip, { opacity: 1, duration: 0.1 }, t0);
  r5Pulse(L, cx, cy + 181, t0 + 0.03, { r0: 40, r1: 190, dur: 0.35, a: 0.65, tiene: 0.15, via: 0.35, z: 15 });
  tl.to(chip, { y: 0, scale: 1, duration: 0.55, ease: "power2.inOut" }, t0 + 0.68);
  // la card di borsa e la linea a puntini
  const [bx, by] = W(540, 946);
  const b = r5Borsa(L, bx, by, 476, 314, { etichetta: null });
  gsap.set(b.g, { opacity: 0, y: 60 });
  tl.to(b.g, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, t0 + 0.85);
  b.conta(t0 + 0.85, scena.t1 - 0.08, o.da || 217.57, o.a || 309.99, 1);
  const S = svgLayer(L, 14, X - 300, Y - 600, 600, 1200);
  r5Tratteggio(S, [W(540, 640), W(540, 789)], t0 + 0.9, 0.3, { w: 3.5, dash: [5, 6] });
  r5Pulse(L, bx, by, t0 + 1.0, { r0: 80, r1: 300, dur: 0.45, a: 0.5, tiene: 0.2, via: 0.45, z: 11 });
  cpCam.zoom(t0 + 0.85, 0.5, 0.93, [540, 760], "power2.out");
  return { rect: null, pose: null, ancore: {}, elementi: { chip, borsa: b } };
};
