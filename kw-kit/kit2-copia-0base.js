// ═══ KW kit v2 · COPIA FEDELE (giro 2 del rifacimento, CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md) — base comune ═══════════════
// COPIA.<ID>(scena, opzioni): la voce del catalogo rifatta IDENTICA a Kallaway (camera, impaginazione, proporzioni, tempi, oggetti,
// stile), coi colori e i font del brand (lime #CFFB50, scuro #1E1E1E, bianco; Advercase / Patrick Hand / Zalando Sans negli stessi
// ruoli dei suoi: il suo sans neretto → Advercase, il suo serif corsivo → Patrick Hand, il sans delle etichette → Zalando Sans).
// Stesso standard dei TPL: scena = { t0, t1, X, Y, parole, parent }, restituisce { rect, pose, ancore, elementi } (+ tempi).
// COPIA.r79_<nome>: le scene del reel 79 che non sono una voce del catalogo. TRANS.<tipo>: le sue transizioni, riusabili (base del
// catalogo delle transizioni, fase 2).
// MISURE: coordinate = quelle di Kallaway × 1,5 (il suo 720×1280 → 1080×1920). La sua area utile (sopra i sottotitoli e la card
// della facecam, y 0–888 su 1280 = 0,694 dell'altezza) e la nostra (y 0–1332, 0,694) hanno lo stesso rapporto: con la scala
// uniforme 1,5 le frazioni di larghezza e d'altezza restano le sue. Tempi in secondi (suo 23,976 fps → nostro 30 fps).
// Questo file viene PRIMA di kit2-core.js (ordine alfabetico del build): qui solo funzioni, niente chiamate al caricamento.
const COPIA = {};
const TRANS = {};

// ── curve misurate ──
// cpBez: cubic-bezier misurata (fitmove.py) · cpTab: curva presa per punti [[u, p], …] (interpolazione monotona, Fritsch–Carlson)
const cpBez = (a, b, c, d) => bez(a, b, c, d);
const cpTab = (pts) => {
  const P = pts[0][0] > 0 ? [[0, 0]].concat(pts) : pts.slice();
  if (P[P.length - 1][0] < 1) P.push([1, 1]);
  return cpInterp(P);
};
// interpolazione monotona (Fritsch–Carlson) di una tabella [[x, y], …] qualsiasi; fuori dai capi resta sul primo / ultimo valore
const cpInterp = (P) => {
  const n = P.length, X = P.map((q) => q[0]), Y = P.map((q) => q[1]), d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((Y[i + 1] - Y[i]) / Math.max(1e-9, X[i + 1] - X[i]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(d[i]) < 1e-12) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return (u) => {
    if (u <= X[0]) return Y[0];
    if (u >= X[n - 1]) return Y[n - 1];
    let i = 0;
    while (i < n - 2 && u > X[i + 1]) i++;
    const h = X[i + 1] - X[i], s = (u - X[i]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * Y[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * Y[i + 1] + (s3 - s2) * h * m[i + 1];
  };
};
// tabella di tempi assoluti [[t, valore], …] → funzione del tempo (fuori dai capi resta ferma sul primo / ultimo valore)
const cpCurva = (pts) => {
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0], v0 = pts[0][1], v1 = pts[pts.length - 1][1];
  if (Math.abs(v1 - v0) < 1e-9) return () => v0;
  const f = cpTab(pts.map(([t, v]) => [(t - t0) / (t1 - t0), (v - v0) / (v1 - v0)]));
  return (t) => v0 + (v1 - v0) * f(Math.max(0, Math.min(1, (t - t0) / (t1 - t0))));
};

// ── camera «a pista»: la posa della camera come funzione del tempo, campionata a 30 fps in segmenti lineari del gestore di camera
// (seek-safe come pathCam). Serve quando Kallaway muove x, y e scala con curve diverse (non si fa con un solo camK).
// posa(t) → { fx, fy, s }. Una mossa successiva la tronca come sempre.
const cpPista = (t0, t1, posa, passo) => {
  const dt = passo || 1 / 30, N = Math.max(1, Math.round((t1 - t0) / dt));
  const a = posa(t0);
  cutTo(t0, a.fx, a.fy, a.s);
  for (let k = 0; k < N; k++) {
    const ta = t0 + ((t1 - t0) * k) / N, tb = t0 + ((t1 - t0) * (k + 1)) / N, c = posa(tb);
    camK(ta, tb - ta, c.fx, c.fy, c.s, "none");
  }
  return posa(t1);
};
// posa dalla posizione sullo schermo di un punto del mondo: il punto P del mondo sta in Q (schermo) con la scala s
const cpPosa = (P, Q, s) => ({ fx: P[0] - (Q[0] - ANCHOR.x) / s, fy: P[1] - (Q[1] - ANCHOR.y) / s, s });

// ── la camera della copia, come la misuro su Kallaway: movimenti del contenuto SULLO SCHERMO (camtrack.py) ──
// Ogni scena / transizione aggiunge i suoi pezzi: trasla (il contenuto scorre di dx, dy px schermo), zoom (il contenuto si
// ingrandisce di k attorno al punto Q dello schermo), percorso (spostamento preso per punti dal suo video). Si sommano nell'ordine
// dei tempi, come in After Effects; taglio(t, posa) riparte da una posa nuova (un taglio di montaggio). gira() alla fine scrive la
// camera: nei tratti che si muovono una pista a 30 fps (cpPista), nei tratti fermi niente.
// ease: stringa GSAP, funzione (cpBez, cpTab) — i valori misurati stanno nelle schede delle COPIA / TRANS.
const cpCam = (() => {
  const SEG = [];
  const fe = (e) => (typeof e === "function" ? e : gsap.parseEase(e || "none"));
  const cur = () => SEG[SEG.length - 1];
  const api = {
    taglio: (t, posa) => { SEG.push({ t, posa: Object.assign({}, posa), parti: [] }); return api; },
    trasla: (t0, dur, dx, dy, ease) => { const e = fe(ease); cur().parti.push({ t0, t1: t0 + dur, f: (u) => { const k = e(u); return { dx: dx * k, dy: dy * k, k: 1 }; } }); return api; },
    zoom: (t0, dur, k, Q, ease) => { const e = fe(ease), L = Math.log(k); cur().parti.push({ t0, t1: t0 + dur, Q: Q || [ANCHOR.x, ANCHOR.y], f: (u) => ({ dx: 0, dy: 0, k: Math.exp(L * e(u)) }) }); return api; },
    // pts = [[t, dx, dy], …] spostamento cumulato del contenuto (px schermo) da t del primo punto; interpolazione monotona
    percorso: (pts) => {
      const fx = cpInterp(pts.map((p) => [p[0], p[1]])), fy = cpInterp(pts.map((p) => [p[0], p[2]]));
      const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
      cur().parti.push({ t0, t1, assoluto: true, f: (u, t) => ({ dx: fx(t) - pts[0][1], dy: fy(t) - pts[0][2], k: 1 }) });
      return api;
    },
    // pts = [[t, k], …] scala cumulata (1 al primo punto) attorno al punto Q dello schermo
    scala: (pts, Q) => {
      const fk = cpInterp(pts.map((p) => [p[0], Math.log(p[1])]));
      cur().parti.push({ t0: pts[0][0], t1: pts[pts.length - 1][0], assoluto: true, Q: Q || [ANCHOR.x, ANCHOR.y], f: (u, t) => ({ dx: 0, dy: 0, k: Math.exp(fk(t) - Math.log(pts[0][1])) }) });
      return api;
    },
    // la camera presa dal suo video (camtrack.py → cattura_js.py): pts = [[t, s, x, y]] = scala e posizione del punto (540, 880)
    // del primo fotogramma; da lì la trasformazione è ricostruita così com'è (motion capture della sua camera)
    cattura: (pts) => {
      const fs = cpInterp(pts.map((p) => [p[0], Math.log(p[1])])), fx = cpInterp(pts.map((p) => [p[0], p[2]])), fy = cpInterp(pts.map((p) => [p[0], p[3]]));
      cur().parti.push({ t0: pts[0][0], t1: pts[pts.length - 1][0], assoluto: true, Q: [ANCHOR.x, ANCHOR.y], f: (u, t) => ({ dx: fx(t) - ANCHOR.x, dy: fy(t) - ANCHOR.y, k: Math.exp(fs(t)) }) });
      return api;
    },
    posa: (t) => {
      let g = SEG[0];
      for (const x of SEG) if (x.t <= t + 1e-6) g = x;
      const p = g.posa;
      let S = p.s, Tx = ANCHOR.x - p.fx * p.s, Ty = ANCHOR.y - p.fy * p.s;
      g.parti.slice().sort((a, b) => a.t0 - b.t0).forEach((q) => {
        if (t < q.t0 - 1e-6) return;
        const u = Math.max(0, Math.min(1, (t - q.t0) / Math.max(1e-6, q.t1 - q.t0)));
        const r = q.f(u, Math.min(t, q.t1));
        if (r.k !== 1) { const Q = q.Q; S *= r.k; Tx = Q[0] + r.k * (Tx - Q[0]); Ty = Q[1] + r.k * (Ty - Q[1]); }
        Tx += r.dx; Ty += r.dy;
      });
      return { fx: (ANCHOR.x - Tx) / S, fy: (ANCHOR.y - Ty) / S, s: S };
    },
    // dove sta sullo schermo il punto w del mondo all'istante t
    schermo: (w, t) => { const p = api.posa(t); return [ANCHOR.x + (w[0] - p.fx) * p.s, ANCHOR.y + (w[1] - p.fy) * p.s]; },
    // scrive la camera fra t0 e t1: taglio a ogni segmento, pista dove la posa cambia
    gira: (t0, t1) => {
      const dt = 1 / 30;
      const ts = SEG.map((g) => g.t).filter((t) => t >= t0 - 1e-6 && t < t1).concat([t1]);
      for (let i = 0; i < ts.length - 1; i++) {
        const a = ts[i], b = ts[i + 1];
        const p0 = api.posa(a);
        cutTo(a, p0.fx, p0.fy, p0.s);
        let prev = p0, run = null;
        const N = Math.max(1, Math.round((b - a) / dt));
        for (let k = 1; k <= N; k++) {
          const tb = a + ((b - a) * k) / N, ta = a + ((b - a) * (k - 1)) / N, c = api.posa(tb - (k === N ? 1e-4 : 0));
          const mosso = Math.abs(c.fx - prev.fx) > 0.02 || Math.abs(c.fy - prev.fy) > 0.02 || Math.abs(c.s - prev.s) > 2e-5;
          if (mosso) camK(ta, tb - ta, c.fx, c.fy, c.s, "none");
          prev = c;
        }
      }
    },
    SEG,
  };
  return api;
})();

// uno strato (layer del mondo o dell'HUD) che si sposta per conto suo, coi valori misurati: pts = [[t, dx, dy], …] (px)
const cpStrato = (L, pts) => {
  const fx = cpInterp(pts.map((p) => [p[0], p[1]])), fy = cpInterp(pts.map((p) => [p[0], p[2]]));
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0], st = { v: 0 };
  gsap.set(L, { x: fx(t0), y: fy(t0) });   // prima del via sta già al primo punto (non nell'origine del mondo)
  tl.fromTo(st, { v: 0 }, { v: 1, duration: t1 - t0, ease: "none", immediateRender: false, onUpdate: () => { const t = t0 + st.v * (t1 - t0); gsap.set(L, { x: fx(t), y: fy(t) }); } }, t0);
};

// un elemento dentro uno strato del mondo che resta FERMO sullo schermo (con la sua posizione sx, sy schermo) fra t0 e t1: serve
// quando Kallaway mette una cosa ferma fra due strati del mondo (la fascia scura sotto il titolo che copre la griglia ma non il ∞)
const cpFisso = (nodo, sx, sy, t0, t1) => {
  const st = { v: 0 };
  const put = (t) => { const p = cpCam.posa(t); gsap.set(nodo, { x: p.fx + (sx - ANCHOR.x) / p.s, y: p.fy + (sy - ANCHOR.y) / p.s, scale: 1 / p.s, transformOrigin: "0 0" }); };
  // (niente tl.call al via: in un salto della testina la call a t0 arriverebbe DOPO l'onUpdate e rimetterebbe la posa di t0)
  tl.fromTo(st, { v: 0 }, { v: 1, duration: t1 - t0, ease: "none", immediateRender: false, onUpdate: () => put(t0 + st.v * (t1 - t0)) }, t0);
};
// fascia scura dietro al titolo, ferma sullo schermo, dentro lo strato L (copre ciò che passa sotto il titolo): Kallaway nasconde
// così la parte alta della griglia (reel 79, 1,9–4,4 s: piena fino a y ~330, trasparente a ~460)
const cpFascia = (L, t0, t1, o) => {
  o = o || {};
  const f = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1080, height: o.h || 470, background: `linear-gradient(180deg, ${K.bg} 0%, ${K.bg} ${Math.round(((o.pieno || 330) / (o.h || 470)) * 100)}%, rgba(30,30,30,0) 100%)`, zIndex: o.z || 40, pointerEvents: "none" }));
  cpFisso(f, 0, 0, t0, t1);
  if (o.via) tl.to(f, { opacity: 0, duration: o.via[1], ease: "none" }, o.via[0]);
  tl.set(f, { opacity: 0 }, t1);
  return f;
};

// linea fra un punto FERMO sullo schermo (HUD, es. il cervello) e un punto del MONDO che si muove con la camera (es. il ∞): si
// disegna da A verso B fra td e td + dd, poi segue la camera fino a t1 (Kallaway, reel 79 7,0–9,9 s: la linea «oscilla» quando il
// ∞ si sposta). parent = hud. o: { w (2.5), a (opacità, 0.85) }
const cpLineaMista = (A, B, t0, t1, td, dd, o) => {
  o = o || {};
  const S = svgLayer(o.parent || hud, o.z || 30, 0, 0, 1080, 1920);
  const ln = document.createElementNS(NS, "line");
  ["x1", "x2"].forEach((k) => ln.setAttribute(k, A[0])); ["y1", "y2"].forEach((k) => ln.setAttribute(k, A[1]));
  ln.setAttribute("stroke", "#ffffff"); ln.setAttribute("stroke-width", o.w || 2.5); ln.setAttribute("stroke-linecap", "round");
  ln.setAttribute("opacity", 0);
  ln.style.filter = "drop-shadow(0 0 4px rgba(255,255,255,.8)) drop-shadow(0 0 12px rgba(255,255,255,.3))";
  S.appendChild(ln);
  const st = { v: 0 };
  const put = (t) => {
    const p = Math.max(0, Math.min(1, (t - td) / dd)), e = 1 - Math.pow(1 - p, 2), b = cpCam.schermo(typeof B === "function" ? B(t) : B, t);   // B: punto del mondo o funzione del tempo
    ln.setAttribute("x2", (A[0] + (b[0] - A[0]) * e).toFixed(1)); ln.setAttribute("y2", (A[1] + (b[1] - A[1]) * e).toFixed(1));
  };
  tl.set(ln, { attr: { opacity: o.a == null ? 0.85 : o.a } }, td);
  tl.fromTo(st, { v: 0 }, { v: 1, duration: t1 - td, ease: "none", immediateRender: false, onUpdate: () => put(td + st.v * (t1 - td)) }, td);
  return { S, ln };
};

// ── il telefono di Kallaway (reel 79, 12,3–16,4 s): iPhone scuro con un filo di luce sul bordo, isola dinamica; lo schermo mostra
// media del pool che si alternano a scatti (cambi = [[t, id], …], il primo da subito) ──
const cpTelefono = (parent, cx, cy, w, h, cambi, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: w * 0.135, background: "linear-gradient(150deg,#4a4a4a 0%,#1a1a1a 30%,#0c0c0c 70%,#3a3a3a 100%)", boxShadow: "0 30px 80px rgba(0,0,0,.7), inset 0 0 0 1.5px rgba(255,255,255,.22), 0 0 0 1px rgba(255,255,255,.10), 0 0 30px rgba(255,255,255,.06)", zIndex: o.z || 12 }));
  const bz = Math.round(w * 0.03);
  const sc = el(g, { position: "absolute", left: bz, top: bz, width: w - 2 * bz, height: h - 2 * bz, borderRadius: w * 0.11, overflow: "hidden", background: "#000" });
  const strati = [];
  cambi.forEach(([t, id], i) => {
    const s = mediaTile(sc, 0, 0, w - 2 * bz, h - 2 * bz, id, 1);
    s.style.borderRadius = "0px";
    gsap.set(s, { opacity: i === 0 ? 1 : 0 });
    if (i > 0) { tl.set(s, { opacity: 1 }, t); tl.set(strati[i - 1], { opacity: 0 }, t); }
    strati.push(s);
  });
  el(sc, { position: "absolute", left: (w - 2 * bz) / 2 - w * 0.15, top: w * 0.035, width: w * 0.3, height: w * 0.085, borderRadius: w * 0.05, background: "#000", zIndex: 20 });
  return { g, sc, strati, rect: [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2] };
};
// spezzoni a tutto schermo (Kallaway, reel 79: film di suspense 71,6–75,3 s, casinò 78,4–82,3 s): da noi riempiono l'area utile
// (0–1332, sfuma nella safe zone), nell'HUD sopra a tutto; cambi = [[t, id del pool], …] a taglio secco
const cpSchermoPieno = (t0, t1, cambi) => {
  const g = layered(el(hud, { position: "absolute", left: 0, top: 0, width: 1080, height: 1332, overflow: "hidden", background: "#000", opacity: 0, zIndex: 90 }));
  const strati = [];
  cambi.forEach(([t, id], i) => {
    const s = mediaTile(g, 0, 0, 1080, 1332, id, 1);
    s.style.borderRadius = "0px";
    gsap.set(s, { opacity: i === 0 ? 1 : 0 });
    if (i > 0) { tl.set(s, { opacity: 1 }, t); tl.set(strati[i - 1], { opacity: 0 }, t); }
    strati.push(s);
  });
  tl.set(g, { opacity: 1 }, t0);
  tl.set(g, { opacity: 0 }, t1);
  return { g, strati };
};
// «facecam piena»: dove Kallaway è a tutto schermo in camera, lo spazio resta scuro per la stessa durata (copertura nell'HUD)
const cpFacecam = (t0, t1) => {
  const c = layered(el(hud, { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: K.bg, opacity: 0, zIndex: 99 }));
  tl.set(c, { opacity: 1 }, t0);
  tl.set(c, { opacity: 0 }, t1);
  return c;
};

// neon con il bagliore misurato su Kallaway (reel 79, 5,6 s): alone vicino forte (σ≈7 px, a≈1,4), largo debole (σ≈26 px,
// a≈0,04); il neonPath del kit ha l'alone largo più forte (a≈0,35): qui si abbassa il largo e si rinforza il vicino
const cpNeonK = (np) => {
  const P = np.S.querySelectorAll(":scope > path");
  if (P[0]) P[0].setAttribute("opacity", 0.06);
  if (P[1]) P[1].style.filter = "drop-shadow(0 0 5px rgba(207,251,80,.95)) drop-shadow(0 0 14px rgba(207,251,80,.75))";
  return np;
};

// ── F01 · il bagliore di Kallaway (misurato: testo bianco alone medio σ≈7 px + largo σ≈42–50 px; neon e accenti molto di più) ──
const CP_GLOW_T = "0 0 10px rgba(255,255,255,.42), 0 0 34px rgba(255,255,255,.20), 0 0 80px rgba(255,255,255,.10)";
const CP_GLOW_CARD = "0 0 26px rgba(255,255,255,.16), 0 0 70px rgba(255,255,255,.07)";

// ── T01 · titolo parola per parola come Kallaway: ogni unità (parola o gruppo) arriva grigia (52%), sfocata 9 px e 5 px più in
// basso, e diventa bianca e nitida in 0,2 s (4–5 fotogrammi, ease-out) nell'istante misurato sul suo video. Righe: [{t, ruolo,
// size, gap}] con ruolo "sans" (il suo neretto → Advercase) o "serif" (il suo corsivo → Patrick Hand bianco); ogni riga è una lista
// di segmenti {t: testo, ruolo, unita: true se il segmento entra tutto insieme}.
// spec: { righe, x, y (centro della prima riga in alto, coordinate del parent), parent (hud), align ("center" | "left"), z,
//   sottolinea: { riga, da, a (frazioni della riga), t, dur } (T07, la linea d'accento sotto il corsivo), interlinea }
// → { root, unita: [[nodi]], inAt([tempi]), outAt(t), grigio(t) }
const cpTitolo = (spec) => {
  const par = spec.parent || hud, al = spec.align || "center";
  const root = layered(el(par, { position: "absolute", left: al === "center" ? spec.x - 700 : spec.x, top: spec.y, width: 1400, zIndex: spec.z || 50 }));
  const U = [];
  let y = 0;
  const righe = [];
  spec.righe.forEach((riga, ri) => {
    const r0 = el(root, { position: "absolute", left: 0, top: y, width: 1400, display: "flex", justifyContent: al === "center" ? "center" : "flex-start", alignItems: "baseline", whiteSpace: "nowrap" });
    // il contenitore della riga è largo quanto il testo: la sottolineatura (figlia) prende la sua larghezza senza misure a runtime
    const r = el(r0, { position: "relative", display: "inline-flex", alignItems: "baseline", whiteSpace: "nowrap" }, null, "span");
    righe.push(r);
    riga.forEach((sg) => {
      const serif = sg.ruolo === "serif";
      const fs = sg.size || (serif ? 104 : 62);
      const st = { position: "relative", display: "inline-block", whiteSpace: "pre", fontFamily: serif ? FH : FD, fontWeight: serif ? 400 : 700, fontSize: fs, lineHeight: 1, letterSpacing: serif ? "0" : "-0.02em", color: GREY, textShadow: CP_GLOW_T };
      const parts = sg.unita ? [sg.t] : sg.t.split(/(?<=\s)/);
      parts.forEach((p) => {
        const w = layered(el(r, st, p.replace(/ /g, "&nbsp;"), "span"));
        gsap.set(w, { opacity: 0, filter: "blur(9px)", y: 5 });
        U.push(w);
      });
    });
    y += spec.interlinea ? spec.interlinea[ri] || 80 : 80;
  });
  let und = null;
  if (spec.sottolinea) {
    const so = spec.sottolinea, rr = righe[so.riga || 0];
    und = el(rr, { position: "absolute", left: 0, top: so.y || 0, width: "100%", height: so.h || 5, borderRadius: 3, background: `linear-gradient(90deg, rgba(207,251,80,0) 0%, ${K.lime} 12%, ${K.lime} 88%, rgba(207,251,80,0) 100%)`, boxShadow: GLOW_A(0.55), transformOrigin: "0 50%", opacity: 0 });
  }
  return {
    root, unita: U, righe, und,
    inAt: (T) => {
      U.forEach((w, i) => {
        const t = T[Math.min(i, T.length - 1)];
        tl.to(w, { opacity: 1, duration: 0.06, ease: "none" }, t);
        tl.to(w, { filter: "blur(0px)", y: 0, color: K.white, duration: 0.2, ease: "power2.out" }, t);
        tl.set(w, { filter: "none" }, t + 0.21);
      });
    },
    // la linea d'accento sotto il corsivo (Kallaway: rossa, cresce da sinistra sotto le lettere) — px nel sistema della riga
    sottolinea: (t, x0, x1, dur, ease) => {
      if (!und) return;
      if (x0 != null && x1 != null) gsap.set(und, { left: x0, width: x1 - x0 });   // senza estremi: tutta la riga (100%)
      gsap.set(und, { scaleX: 0 });
      tl.set(und, { opacity: 1 }, t);
      tl.to(und, { scaleX: 1, duration: dur || 0.6, ease: ease || "power1.out" }, t);
    },
    // T08 · uscita di Kallaway: le parole tornano grigie (0,1 s) e poi spariscono
    outAt: (t, o) => {
      o = o || {};
      tl.to(U, { color: GREY, duration: o.grigio || 0.1, ease: "power1.out" }, t);
      if (und) tl.to(und, { opacity: 0, duration: 0.1 }, t);
      tl.to(U, { opacity: 0, duration: o.via || 0.12, ease: "power1.in" }, t + (o.dopo == null ? 0.1 : o.dopo));
    },
  };
};

// ── card video (A05, la clip vera): riquadro arrotondato con un media del pool che cambia a scatti (montaggio della clip) ──
// cambi: [[t, idVideo | "th-…", w, h]] (w, h opzionali: Kallaway cambia anche la misura del riquadro con la clip)
const cpCardVideo = (parent, cx, cy, w, h, cambi, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: o.r || 14, overflow: "hidden", background: "#111", boxShadow: o.glow || CP_GLOW_CARD, zIndex: o.z || 10 }));
  const strati = [];
  cambi.forEach(([t, id, w2, h2], i) => {
    const s = mediaTile(g, 0, 0, w, h, id, 1);
    s.style.width = "100%"; s.style.height = "100%"; s.style.borderRadius = "0px";
    gsap.set(s, { opacity: i === 0 ? 1 : 0 });
    if (i > 0) { tl.set(s, { opacity: 1 }, t); tl.set(strati[i - 1], { opacity: 0 }, t); }
    if (w2 && i > 0) tl.set(g, { left: cx - w2 / 2, top: cy - h2 / 2, width: w2, height: h2 }, t);
    strati.push(s);
  });
  return { g, strati };
};
