// ═══ KW kit v2 · COPIA FEDELE · liste del blocco C2 (reel 5 di Kallaway) — L01 · L02 (+ la lista che serve a K14 e F03) ═══════
// Misurate sul reel 5 con _analisi/ritmo/_script_copia02/barre.py (le strisce dell'accento rosso fotogramma per fotogramma).

// ── la lista del reel 5: barre scure 858×122 (attiva ×1,077), passo 160, accento a sinistra 24 px, numero neretto, testo sfocato
// finché non è detto. In un contenitore (nel mondo) che si può spostare: .show, .entra (da sinistra, scena 1), .risolvi (L02,
// con la banda di luce F03), .attiva, .barra(i) (per K14: copia nell'HUD) ──
// voci: [testo | [riga1, riga2]] · o: { w (858), h (122), passo (160), fsNum (42), fs (31), z }
const r5Lista = (parent, cx, top, voci, o) => {
  o = o || {};
  const w = o.w || 858, h = o.h || 122, passo = o.passo || 160, fsN = o.fsNum || Math.round(42 * w / 858), fs = o.fs || Math.round(31 * w / 858);
  const kx = w / 858;
  const box = layered(el(parent, { position: "absolute", left: cx - w / 2, top, width: w, height: 1, zIndex: o.z || 12 }));
  const mkBarra = (par, i, txt, x, y, nitido) => {
    const r = layered(el(par, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 14, background: R5.barra, boxShadow: `inset 0 0 0 1.5px ${R5.bordo}, 0 14px 36px rgba(0,0,0,.45)`, overflow: "hidden" }));
    const acc = el(r, { position: "absolute", left: 0, top: 0, width: 24, height: h, background: K.lime, boxShadow: R5.glowL(0.5) });
    const num = el(r, { position: "absolute", left: Math.round(39 * kx), top: 0, height: h, display: "flex", alignItems: "center", fontFamily: FS, fontWeight: 800, fontSize: fsN, color: K.white, letterSpacing: "0.01em" }, String(i + 1).padStart(2, "0"));
    const righe = Array.isArray(txt) ? txt : [txt];
    const st = { position: "absolute", left: Math.round(125 * kx), top: 0, right: 26, height: h, display: "flex", flexDirection: "column", justifyContent: "center", fontFamily: FS, fontWeight: 700, fontSize: righe.length > 1 ? Math.round(fs * 0.9) : fs, lineHeight: 1.02, color: K.white, whiteSpace: "nowrap", letterSpacing: "-0.01em" };
    const html = righe.map((s) => `<div>${s}</div>`).join("");
    const soft = el(r, Object.assign({}, st, { filter: "blur(7px)", opacity: nitido ? 0 : 0.6 }), html);
    const sharp = el(r, Object.assign({}, st, { clipPath: nitido ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)", textShadow: "0 0 10px rgba(255,255,255,.25)" }), html);
    return { r, acc, num, soft, sharp };
  };
  const rows = voci.map((txt, i) => Object.assign(mkBarra(box, i, txt, 0, i * passo, false), { y: i * passo, txt }));
  gsap.set(rows.map((x) => x.r), { opacity: 0 });
  const api = {
    box, rows, w, h, passo,
    // voci già lì (piene) al primo fotogramma
    piene: (n, nitide) => { for (let i = 0; i < n; i++) { gsap.set(rows[i].r, { opacity: 1 }); if (nitide && nitide.includes(i)) { gsap.set(rows[i].soft, { opacity: 0 }); gsap.set(rows[i].sharp, { clipPath: "inset(0% 0% 0% 0%)" }); } } },
    // la voce i arriva da sotto e si accende (Kallaway scena 3: 9,0 e 9,17 s, mentre la lista sale)
    show: (i, t, dur) => { gsap.set(rows[i].r, { y: 34 }); tl.to(rows[i].r, { opacity: 1, y: 0, duration: dur || 0.15, ease: "power2.out" }, t); },
    // la voce i entra da sinistra in corsa e frena (scena 1: la prima a 0,125 s da x −130, poi 0,04 s fra una e l'altra; misurato:
    // accento a 9 · 45 · 72 · 93 · 108 · 120 · 129 · 135 · 138 px a +0,04 … +0,71 s)
    entra: (i, t, dx) => {
      const f = cpCurva([[0, -(dx || 129)], [0.042, -93], [0.083, -66], [0.125, -45], [0.167, -30], [0.208, -18], [0.25, -9], [0.333, -3], [0.5, 0]]);
      const st = { v: 0 };
      tl.set(rows[i].r, { opacity: 1 }, t);
      tl.fromTo(st, { v: 0 }, { v: 1, duration: 0.5, ease: "none", immediateRender: false, onUpdate: () => gsap.set(rows[i].r, { x: f(st.v * 0.5) }) }, t);
      gsap.set(rows[i].r, { x: -(dx || 129) });
    },
    // L02: la banda di luce (F03) passa da destra a sinistra e dietro di lei il testo va a fuoco; poi la barra si allarga
    risolvi: (i, t, o2) => {
      o2 = o2 || {};
      const dur = o2.dur || 0.67, rw = rows[i];
      COPIA.F03(rw.r, t, { dur, w: 60, ease: o2.ease });
      tl.to(rw.sharp, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: o2.ease || "none" }, t);
      tl.to(rw.soft, { opacity: 0, duration: dur * 0.9, ease: "power1.in" }, t);
      if (o2.attiva !== false) api.attiva(i, t + (o2.ritardo == null ? 0.2 : o2.ritardo), o2.durAttiva);
    },
    // la voce attiva si allarga del 7,7% (Kallaway: l'accento passa da x 117 a 99 in 0,6 s) e si schiarisce un poco
    attiva: (i, t, dur) => {
      tl.to(rows[i].r, { scale: 1.077, duration: dur || 0.6, ease: "power1.inOut" }, t);
      tl.to(rows[i].r, { boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,.16), 0 16px 40px rgba(0,0,0,.5)`, duration: dur || 0.6 }, t);
    },
    // la lista (contenitore) va in pts = [[t, dy], …] (px del mondo, rispetto a top); serve per la salita misurata
    sposta: (pts) => {
      const f = cpCurva(pts), st = { v: 0 }, t0 = pts[0][0], t1 = pts[pts.length - 1][0];
      gsap.set(box, { y: pts[0][1] });
      tl.fromTo(st, { v: 0 }, { v: 1, duration: t1 - t0, ease: "none", immediateRender: false, onUpdate: () => gsap.set(box, { y: f(t0 + st.v * (t1 - t0)) }) }, t0);
    },
    // una barra nuova nell'HUD con lo stesso aspetto (per K14: la voce che diventa intestazione esce dal mondo)
    barraHud: (i, nitida) => mkBarra(hud, i, rows[i].txt, 0, 0, nitida),
  };
  return api;
};

/* @copia L01 · Lista con voci-segnaposto sfocate (copia del reel 5, 8,92–12,5 s; anche 0–1,1 · 32,75–35 · 76,8–81 · 112,7–116 s)
 * kallaway: reel 5, 8,917 s · al taglio c'è già la prima barra (titolo fisso sopra); la seconda e la terza arrivano da sotto a
 *   9,0 e 9,17 s mentre tutta la lista sale e frena (1,4 s); il testo delle voci è sfocato finché non lo dice; poi la camera si
 *   allontana piano (fino a ×0,93 a 13,4 s) — la lista «non sta mai ferma»
 * misure: barre 858×122 px (0,79 della larghezza; 800 px nella lista lampo della scena 1), passo 160, accento 24 px; prima barra
 *   in alto a y 702 → 687 → 669 → 651 → 636
 *   → 621 → 609 → 600 → 591 → 582 → 564 (10,0) → 560 (10,33); camera ×1 → ×0,93 fra 9,0 e 13,4 s attorno a (540, 380)
 *   (barre.py: altezza 122 → 113 px, accento x 111 → 141)
 * quando: ogni elenco numerato annunciato all'inizio («tre motivi», «cinque impostazioni»)
 * scena: t0 (il taglio), X, Y (centro della camera, mondo), parent · opzioni: voci (3 testi, il terzo può essere [riga1, riga2]),
 *   arrivi ([t2, t3]), salita (tabella [[t, y]]), deriva ([t0, t1, k] della camera), titolo (righe di r5Titolo, null = nessuno)
 * restituisce: elementi { lista, titolo }
 * colori: barre grafite (le sue nere sul nero), accento lime (il suo rosso), testo bianco
 * chiamata: COPIA.L01({ t0: 8.917, X: 6000, Y: 880, parent: layer(12) }, { voci: R5_VOCI });
 */
COPIA.L01 = (scena, o) => {
  o = o || {};
  const X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const L = scena.parent || layer(12);
  const [lx, ltop] = W(540, 560);
  const lista = r5Lista(L, lx, ltop, o.voci || R5_VOCI, {});
  lista.piene(o.piene == null ? 1 : o.piene, o.nitide);
  (o.arrivi || [8.93, 9.1]).forEach((t, k) => { if (t != null) lista.show((o.piene == null ? 1 : o.piene) + k, t); });
  const t0 = scena.t0;
  // la salita misurata (y della prima barra in alto, schermo) → spostamento del contenitore rispetto alla posa finale (560)
  const sal = o.salita || [[0, 702], [0.083, 687], [0.167, 669], [0.25, 651], [0.333, 636], [0.417, 621], [0.5, 609], [0.583, 600], [0.667, 591], [0.75, 582], [0.917, 571], [1.083, 564], [1.25, 561], [1.416, 560]];
  if (sal !== false) lista.sposta(sal.map(([dt, y]) => [t0 + dt, y - 560]));
  // la camera si allontana piano (deriva): ×0,93 in 4,4 s attorno a (540, 380)
  const dr = o.deriva === undefined ? [t0 + 0.083, 4.5, 0.93] : o.deriva;
  if (dr) cpCam.zoom(dr[0], dr[1], dr[2], [540, 380], "none");
  return { rect: null, pose: null, ancore: { lista: [lx, ltop] }, elementi: { lista } };
};

/* @copia L02 · Una voce si risolve con uno sheen (copia del reel 5, 10,79–11,58 s e 34,25–35,0 s)
 * kallaway: reel 5, 10,79 s · su «Number one» una banda di luce bianca stretta e inclinata attraversa la barra da destra a
 *   sinistra in 0,67 s e dietro di lei il testo va a fuoco; da 11,0 s la barra attiva si allarga (×1,077 in 0,6 s); la lista
 *   intanto continua a derivare
 * misure: banda 10,79 (bordo destro) → 10,96 (3/4) → 11,12 (metà) → 11,29 (sinistra) → 11,46 finita; accento della barra
 *   attiva x 117 → 99 fra 11,0 e 11,58 s (barre.py); seconda volta 34,25–34,9 s sulla voce 02
 * quando: quando nomina il punto della lista
 * scena: lista (quella di COPIA.L01 o r5Lista), i, t · opzioni: dur (0,67), ritardo (0,2) e durAttiva (0,6) della barra attiva
 * colori: banda bianca; barra attiva grafite più chiara
 * chiamata: COPIA.L02({ lista: l01.elementi.lista, i: 0, t: 10.79 });
 */
COPIA.L02 = (scena, o) => {
  o = o || {};
  scena.lista.risolvi(scena.i, scena.t, { dur: o.dur || 0.67, ritardo: o.ritardo == null ? 0.21 : o.ritardo, durAttiva: o.durAttiva || 0.6, attiva: o.attiva });
  return { rect: null, pose: null, ancore: {}, elementi: { barra: scena.lista.rows[scena.i] } };
};

// le tre voci del reel 5 (la sua lista, tradotta della stessa lunghezza)
const R5_VOCI = ["I Tuoi Contenuti Attirano Chi Non Compra", "Chi Ti Guarda Non Si Fida Di Te", ["Chi Compra Non Ti Vede Abbastanza Diverso", "Dalla Categoria"]];
