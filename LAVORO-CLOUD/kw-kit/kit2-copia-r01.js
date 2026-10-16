// ═══ KW kit v2 · COPIA FEDELE · reel 1 di Kallaway intero (blocco C2b, copia-07) — aiuti del reel e scene che non sono voci ═══
// «The easiest way to get more views is to expand the TAM size of your ideas» (TUTTI-I-REEL/2026-10-08_DePIvvKub8b.mp4, 119,42 s,
// 23,976 fps). Lo stile di questo reel (ottobre 2026): fondo nero coi puntini, titolo fisso in alto (neretto bianco + corsivo serif,
// a volte il riquadro rosso che si allunga), griglie e muri dei suoi reel con le views, imbuto e anelli di persone (omini grigi), il
// suo avatar tondo al centro, copioni scuri che si scrivono, barre della lista con l'accento rosso, la CTA su fondo chiaro.
// Da noi: il suo rosso (accento, riquadri, dischi, badge dentro le card) e il suo verde (views, persone giuste) → lime; scritte
// bianche; riquadro rosso con la scritta bianca → lime con la scritta scura; il suo neretto → Advercase, il corsivo serif →
// Patrick Hand, le etichette → Zalando Sans (come in C1 e C2). Dove lui contrappone rosso (escluso) e verde (giusto) nella stessa
// scena, da noi l'escluso diventa grafite spento e il giusto lime (scena 20, annotato).
// MISURE: coordinate di Kallaway × 1,5 (il suo 720×1280 → 1080×1920): la sua zona grafica (y 0–~1330, sopra i sottotitoli e la
// card della faccia) è la nostra area utile (y 0–1332). Tempi in secondi del suo reel (la copia sta 1:1 sul suo tempo).
// Strumenti: CATALOGO-ANIMAZIONI/_analisi/ritmo/_script_copia07/ (tagli.py, striscia_k.py, griglia.py, parole_titolo.py, …).
// Questo file viene PRIMA di kit2-core.js e di kit2-copia-r05.js (ordine alfabetico): qui solo funzioni e costanti semplici;
// gli aiuti r5* (r5Titolo, r5Card, r5Pulse, r5Chip, r5Strato) si usano solo dentro le funzioni.

// ── omino di Kallaway (imbuti e anelli): testa tonda e busto arrotondato, grigio chiaro; d = lato (34 px) ──
const R1_OMINO = (col) => `<svg width="100%" height="100%" viewBox="0 0 34 34" style="display:block"><circle cx="17" cy="9.6" r="7.4" fill="${col}"/><path d="M2.6 32.6 C2.6 23.4 8.6 19.2 17 19.2 C25.4 19.2 31.4 23.4 31.4 32.6 Z" fill="${col}"/></svg>`;
const r1Omino = (parent, cx, cy, o) => {
  o = o || {};
  const d = o.d || 34;
  const p = el(parent, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, zIndex: o.z || 6 }, R1_OMINO(o.col || "#ffffff"));
  if (o.a != null) p.style.opacity = o.a;
  return p;
};
// colora un omino (il suo rosso / verde → lime; lo spento → grafite)
const r1ColOmino = (p, t, col, dur) => { const pt = p.querySelectorAll("circle, path"); tl.to(pt, { attr: { fill: col }, duration: dur || 0.12, ease: "none" }, t); };

// ── il SUO avatar tondo (la foto profilo nell'anello grigio sottile) → la tua foto (kw-kit/assets/avatars/tu.jpg) ──
// o: { r (80), bordo, z } → nodo (centrato su cx, cy)
const r1Avatar = (parent, cx, cy, o) => {
  o = o || {};
  const r = o.r || 80;
  const a = layered(el(parent, { position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", background: "#222", boxShadow: `0 0 0 ${o.bw || 2.5}px ${o.bordo || "rgba(255,255,255,.55)"}, 0 0 26px rgba(255,255,255,.12), 0 14px 40px rgba(0,0,0,.6)`, zIndex: o.z || 14 }));
  imgIn(a, "av-tu", { objectFit: "cover" });
  return a;
};

// ── imbuto di persone (scena 1, 2,753–4,63 s; scena 7; scena 11): un triangolo rovesciato di omini a righe sfalsate sopra
// l'avatar, che si allarga e sale (Kallaway: «Expanding the TAM»). Gli omini si accendono quando il bordo dell'imbuto li raggiunge
// (forma presa dal suo video: alto della prima riga e mezza larghezza in cima, fotogramma per fotogramma).
// forma: [[t, yAlto, mezzaLarghezza]] (px dello schermo, con cx = 540 e il vertice a yV) · o: { yV (1100), passoX (64), passoY (57),
//   yBasso (1030), righe (12), d (34), col, a (0,62: grigio) } → { box, omini }
const r1Imbuto = (L, X, Y, forma, o) => {
  o = o || {};
  const W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const yV = o.yV || 1100, px = o.passoX || 64, py = o.passoY || 57, yB = o.yBasso || 1030, nR = o.righe || 12;
  const fy = cpCurva(forma.map((f) => [f[0], f[1]])), fw = cpCurva(forma.map((f) => [f[0], f[2]]));
  const t0 = forma[0][0], t1 = forma[forma.length - 1][0];
  const box = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: o.z || 8 }));
  const omini = [];
  for (let k = 0; k < nR; k++) {
    const y = yB - k * py, off = (k % 2) * px * 0.5;
    for (let j = -9; j <= 9; j++) {
      const x = 540 + off + j * px;
      // primo istante in cui l'omino sta dentro l'imbuto
      let tv = null;
      for (let t = t0; t <= t1 + 1e-6; t += 1 / 60) {
        const yt = fy(t), hw = fw(t), hr = hw * (yV - y) / Math.max(1, yV - yt);
        if (y >= yt - 22 && Math.abs(x - 540) <= hr + 14) { tv = t; break; }
      }
      if (tv == null) continue;
      const hwF = fw(t1) * (yV - y) / (yV - fy(t1));
      const a = (o.a || 0.62) * Math.max(0.25, Math.min(1, 1.35 - Math.abs(x - 540) / Math.max(40, hwF))) * (k >= nR - 1 ? 0.5 : k >= nR - 2 ? 0.8 : 1);
      const [wx, wy] = W(x, y);
      const p = r1Omino(box, wx, wy, { d: o.d || 34, col: o.col || "#ffffff" });
      gsap.set(p, { opacity: tv <= t0 + 1e-6 ? a : 0 });
      if (tv > t0 + 1e-6) tl.to(p, { opacity: a, duration: 0.14, ease: "power1.out" }, tv);
      omini.push(p);
    }
  }
  return { box, omini };
};

/* @copia r01_apertura · Il titolo «Il Modo Più Rapido Per Fare / Un Milione Di Views», la griglia di 5 tuoi reel con le views
 *   (reel 1, 0–2,753 s: dentro ci sono T01, T02 e D02; è anche una A01 al buio)
 * kallaway: reel 1, 0 s · al primo fotogramma i primi due reel della griglia ci sono già, sfocati e 24 px più in basso; gli altri
 *   arrivano a 0,083 e 0,125 s (in 0,17 s sono tutti a fuoco): 3 sopra, 2 sotto, i suoi reel che girano; da 0,21 s il titolo
 *   parola per parola (T01: «The Easiest» 0,375 · «Way» 0,50 · «To» 0,54 · «Speedrun» 0,63 s) e il riquadro rosso che si allunga
 *   sotto (T02); da 0,876 s le views sotto i reel (D02); da 1,85 s la griglia sale sempre più veloce (camera che accelera verso
 *   l'alto: 5 · 11 · 21 · 33 · 44 · 58 · 76 · 89 · 105 · 127 · 146 px a 1,88 … 2,71 s, mosso negli ultimi fotogrammi) e a
 *   2,753 s il taglio sull'imbuto (il titolo resta)
 * misure: reel 206×330 px coi centri (267, 565) (540, 565) (813, 565) e (398, 1011) (680, 1011), bordo bianco sottile, angoli
 *   8 px; titolo riga 1 x 149–930, y ~158–212; riquadro x 156–932, y 211–302
 * scena: t0 (0), t1 (2,753), X, Y, parent · opzioni: clip (5 id del pool), titolo ({ riga1: [[testo, ruolo]], riga2: [parole] })
 * colori: il suo verde (views) → lime; il riquadro rosso → lime con la scritta scura
 */
const R1_TITOLO_1 = { righe: [[{ t: "Il Modo ", ruolo: "sans", size: 64 }, { t: "Più Rapido Per Fare", ruolo: "serif", size: 76 }]], tempi: [0.21, 0.21, 0.33, 0.37, 0.42, 0.46] };
COPIA.r01_apertura = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0 || 0;
  // titolo nell'HUD (fermo fino al taglio della faccia, 4,63 s): riga 1 (T01) e riga 2 col riquadro (T02)
  const T1 = r5Titolo({ righe: R1_TITOLO_1.righe, y: 136, interlinea: [70] });
  T1.inAt(R1_TITOLO_1.tempi.map((x) => t0 + x));
  const T2 = COPIA.T02({ t0, parent: hud }, { testo: ["Un", "Milione", "Di", "Views"], tempi: [0.58, 0.6, 0.63, 0.71] });
  // la griglia: 5 tuoi reel (3 + 2), già lì al primo fotogramma (i primi due sfocati), a fuoco in 0,17 s
  const cl = o.clip || ["g1", "g2", "g3", "g4", "g5"];
  const C = [[267, 565, 0], [540, 565, 0], [813, 565, 0.083], [398, 1011, 0.083], [680, 1011, 0.125]];
  const cards = C.map(([sx, sy, ti], i) => {
    const [x, y] = W(sx, sy);
    const c = r5Card(L, x, y, 206, 330, [[0, cl[i]]], { r: 8, bw: 2, bordo: "rgba(255,255,255,.78)", glow: "0 0 0 2px rgba(255,255,255,.78), 0 16px 40px rgba(0,0,0,.55), 0 0 26px rgba(255,255,255,.10)" });
    if (ti === 0) {
      gsap.set(c.g, { opacity: 0.55, y: 24, scale: 1.03, filter: "blur(6px)" });
      tl.to(c.g, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.17, ease: "power2.out" }, t0);
    } else {
      gsap.set(c.g, { opacity: 0, y: 24, scale: 1.03, filter: "blur(6px)" });
      tl.set(c.g, { opacity: 0.55 }, t0 + ti - 0.04);
      tl.to(c.g, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.13, ease: "power2.out" }, t0 + ti - 0.04);
    }
    tl.set(c.g, { filter: "none" }, t0 + ti + 0.18);
    return c;
  });
  // D02 · le views sotto i reel
  const d02 = COPIA.D02({ parent: L, X, Y }, { badge: [[266, 772, "15,1M", t0 + 0.876], [539, 772, "11M", t0 + 0.918], [811, 772, "4,4M", t0 + 1.043], [398, 1216, "1,1M", t0 + 1.168], [680, 1216, "4,4M", t0 + 1.293]] });
  // la camera accelera verso l'alto fino al taglio (misurata sulle pillole: il contenuto sale di 146 px in 0,86 s)
  cpCam.percorso([[t0 + 1.84, 0, 0], [t0 + 1.877, 0, -5], [t0 + 2.0, 0, -11], [t0 + 2.169, 0, -21], [t0 + 2.294, 0, -33], [t0 + 2.377, 0, -44], [t0 + 2.461, 0, -58], [t0 + 2.544, 0, -76], [t0 + 2.586, 0, -89], [t0 + 2.628, 0, -105], [t0 + 2.669, 0, -127], [t0 + 2.711, 0, -146], [t0 + 2.753, 0, -168]]);
  // il mosso degli ultimi fotogrammi (Kallaway: le pillole sfocate in verticale a 2,71 s)
  tl.to(L, { filter: "blur(2.5px)", duration: 0.08, ease: "none" }, t0 + 2.63);
  tl.set(L, { filter: "none" }, scena.t1);
  tl.set(L, { opacity: 0 }, scena.t1);
  // il titolo resta sull'imbuto fino allo stacco sulla faccia (4,63 s)
  tl.set([T1.root, T2.elementi.root], { opacity: 0 }, t0 + (o.tFine == null ? 4.63 : o.tFine));
  return { rect: null, pose: null, ancore: {}, elementi: { T1, T2, cards, d02 } };
};

/* @copia r01_imbuto · L'imbuto di persone sopra la tua foto che si allarga: «Expanding the TAM size» (reel 1, 2,753–4,63 s)
 * kallaway: reel 1, 2,753 s · taglio (il titolo resta): al centro un imbuto di omini grigi a righe sfalsate, stretto (9 righe,
 *   largo 208 px in cima a y 700); si allarga e sale fino a ~4,0 s (in cima y 607 · 581 · 547 · 536 · 514 · 503 · 498, larga
 *   291 · 336 · 406 · 448 · 512 · 549 · 594 px a 2,88 · 3,0 · 3,13 · 3,25 · 3,5 · 3,75 · 4,0 s); da sotto sale il suo avatar tondo
 *   (2,8–3,2 s) e si ferma sotto la punta; gli omini ai bordi sono più scuri (l'imbuto sfuma)
 * misure: omini 34 px, passo 64 px, righe ogni 57 px (l'ultima in basso a y 1030), avatar Ø 164 (anello grigio) col centro a
 *   (540, 1145); niente movimento di camera
 * scena: t0 (2,753), t1 (4,63), X, Y, parent
 * colori: omini grigi come i suoi; la sua foto → la tua
 */
COPIA.r01_imbuto = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(11), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0;
  const d = t0 - 2.753;
  // (mezze larghezze misurate sugli omini chiari × 1,18: i bordi più scuri sfuggono alla soglia; in cima a 4,3 s è larga ~700 px)
  const forma = o.forma || [[2.753, 700, 104], [2.88, 607, 145], [3.0, 581, 168], [3.13, 547, 203], [3.25, 536, 224], [3.5, 514, 256], [3.75, 503, 275], [4.0, 496, 297], [4.3, 494, 300]].map(([t, y, w]) => [t + d, y, w * 1.18]);
  const imb = r1Imbuto(L, X, Y, forma, { yV: 1160, yBasso: 1030, righe: 11, passoY: 54, passoX: 65, d: 40, col: "#c4c4c4", a: 0.85 });
  const [ax, ay] = W(540, 1145);
  const av = r1Avatar(L, ax, ay, { r: 80 });
  const fa = cpCurva([[t0, 210], [t0 + 0.125, 150], [t0 + 0.25, 88], [t0 + 0.375, 22], [t0 + 0.5, 5], [t0 + 0.65, 0]]), st = { v: 0 };
  gsap.set(av, { y: fa(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 0.65, ease: "none", immediateRender: false, onUpdate: () => gsap.set(av, { y: fa(t0 + st.v * 0.65) }) }, t0);
  return { rect: null, pose: null, ancore: { avatar: [ax, ay] }, elementi: { imb, av } };
};
