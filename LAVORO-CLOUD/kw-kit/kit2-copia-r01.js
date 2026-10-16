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
const R1_TITOLO_1 = { righe: [[{ t: "Il Modo ", ruolo: "sans", size: 68 }, { t: "Più Rapido Per Fare", ruolo: "serif", size: 80 }]], tempi: [0.21, 0.21, 0.33, 0.37, 0.42, 0.46] };
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

/* @copia r01_disco · F02 nel reel 1: il disco pieno che nasce sul badge delle views e svanisce (reel 1, 6,381–6,92 s; anche 45,2 e
 *   87,3 s). È la F02 del catalogo, ma più piccola e con altri tempi di quella del reel 79 (COPIA.F02): da qui una funzione sua.
 * kallaway: reel 1, 6,381 s · sul badge rosso in basso a sinistra del suo reel (le views a 15M) compare un disco rosso pieno col
 *   bordo chiaro sottile, già largo (r ~70 px), in un fotogramma è r 100, poi si allarga piano (124 · 135 · 149 · 160 · 167 · 172 ·
 *   175 px a 6,465 … 6,715 s) mentre svanisce (da 6,63 s, via a 6,92 s); il badge si vede appena attraverso
 * misure: centro sul badge (385, 1060 a 6,55 s); r 70 → 175 px in 0,33 s; opacità ~0,92 fino a +0,25 s, poi giù in 0,29 s
 * quando: il numero (le views) «si accende» sulla parola chiave («million»)
 * scena: t0, X, Y (centro, mondo o strato), parent · opzioni: r (175: il raggio finale), z
 * restituisce: elementi { d }
 * colori: il suo rosso pieno → lime pieno col bordo bianco (sul badge lime: il numero si legge appena, come il suo)
 * chiamata: COPIA.r01_disco({ t0: 6.381, X: 385, Y: 1060, parent: L });
 */
COPIA.r01_disco = (scena, o) => {
  o = o || {};
  const R = o.r || 175, L = scena.parent || layer(9), t0 = scena.t0;
  const d = layered(el(L, { position: "absolute", left: scena.X - R, top: scena.Y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", zIndex: o.z || 30, pointerEvents: "none", background: "radial-gradient(circle at 50% 40%, #e2ff8a 0%, #d3fc5c 45%, #CFFB50 70%, #c2ec44 100%)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.85), 0 0 30px rgba(207,251,80,.45)", opacity: 0 }));
  const f = cpCurva([[t0, 70], [t0 + 0.042, 100], [t0 + 0.084, 124], [t0 + 0.126, 135], [t0 + 0.167, 149], [t0 + 0.209, 160], [t0 + 0.25, 167], [t0 + 0.292, 172], [t0 + 0.334, 175], [t0 + 0.54, 178]].map(([t, r]) => [t, r / 175 * R]));
  const st = { v: 0 };
  gsap.set(d, { scale: f(t0) / R });
  tl.set(d, { opacity: 0.93 }, t0);
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 0.54, ease: "none", immediateRender: false, onUpdate: () => gsap.set(d, { scale: f(t0 + st.v * 0.54) / R }) }, t0);
  tl.to(d, { opacity: 0, duration: 0.29, ease: "power1.in" }, t0 + 0.25);
  return { rect: [scena.X - R, scena.Y - R, scena.X + R, scena.Y + R], pose: null, ancore: {}, elementi: { d }, tempi: { fine: t0 + 0.54 } };
};

// ── il muro dei reel (scena 3): celle 550×842 (come la card) a passo 665×982 nel mondo, ognuna con un fotogramma DIVERSO dei tuoi
// reel (pool c7-*, th-mio_*); la cella (0, 0) resta vuota per la card vera. ids: lista di id (uno per cella, mai ripetuti a vista)
const R1_MURO = (() => {
  const a = [];
  for (let k = 1; k <= 18; k++) a.push("c7-wv" + String(k).padStart(2, "0"), "c7-wg" + String(k).padStart(2, "0"));
  for (let k = 1; k <= 20; k++) a.push("c7-wx" + String(k).padStart(2, "0"));
  for (let k = 1; k <= 12; k++) a.push("c7-wn" + String(k).padStart(2, "0"));
  for (let k = 1; k <= 10; k++) a.push("th-mio_" + String(k).padStart(2, "0"));
  return a;
})();
const r1Muro = (L, cx, cy, o) => {
  o = o || {};
  const w = o.w || 550, h = o.h || 842, px = o.px || 665, py = o.py || 982, ids = o.ids || R1_MURO;
  const box = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: o.z || 9 }));
  const celle = [];
  let n = 0;
  for (let r = o.r0 == null ? -3 : o.r0; r <= (o.r1 == null ? 7 : o.r1); r++) {
    for (let c = -3; c <= 3; c++) {
      if (r === 0 && c === 0) continue;
      const id = ids[n++ % ids.length];
      const g = el(box, { position: "absolute", left: cx + c * px - w / 2, top: cy + r * py - h / 2, width: w, height: h, borderRadius: 14, overflow: "hidden", background: "#151515", boxShadow: "0 0 0 2.5px rgba(255,255,255,.62), 0 18px 50px rgba(0,0,0,.55)" });
      imgIn(g, id, { objectFit: "cover" });
      celle.push(g);
    }
  }
  return { box, celle, n };
};

/* @copia r01_cento · Il tuo reel con le views che contano, cambia reel, poi lo zoom indietro nel muro di ~100 tuoi reel che scorre
 *   («I've personally gotten a million views or more on a hundred different videos») (reel 1, 5,589–9,426 s; dentro c'è F02)
 * kallaway: reel 1, 5,589 s · taglio: il suo reel (lui che parla) è già in corsa e sale (alto della card 520 → 456 → 396 → 354 →
 *   324 → 301 → 284 → 270 → 259 → 249 → 240 → 233 → 227 → 222 px a 5,589 · 5,71 · 5,84 · 5,96 · 6,09 · 6,21 · 6,34 · 6,46 · 6,59 ·
 *   6,72 · 6,88 · 7,05 · 7,22 · 7,5 s); il badge rosso in basso a sinistra conta 0M → 16M (5,6–6,5 s), il disco (F02) a 6,381 s;
 *   a 6,798 s il reel cambia (il tablet con la città) e il badge corre 16M → 43M (6,97–7,6 s); da 7,55 s la camera si allontana
 *   di colpo (la card 550 → 500 → 400 → 328 → 280 → 240 → 216 → 200 px in 0,35 s, sfocato) e attorno c'è il muro dei suoi reel
 *   (5 colonne); da 8,13 s il muro scorre in alto velocissimo (picco 137 px a fotogramma, mosso in verticale) e frena fino al
 *   taglio sulla faccia (−1315 px in tutto)
 * misure: card 550×842 col centro x 540; badge 200×50 nell'angolo in basso a sinistra; muro a passo 193 × 285 px a ×0,29 (celle
 *   ~160×240); scorrimento misurato con la correlazione di fase fra fotogrammi (_script_copia07, in RAPPORTO)
 * scena: t0 (5,589), t1 (9,426), X, Y, parent · opzioni: clip (["c3a", "c3b"]), muro (ids)
 * colori: il badge rosso → lime con la scritta scura; il disco rosso → lime
 */
COPIA.r01_cento = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(12), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0;
  const cw = 550, ch = 842;
  const [cx, cy] = W(540, 222 + ch / 2);
  const grp = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 14 }));
  const cl = o.clip || ["c3a", "c3b"];
  const card = r5Card(grp, cx, cy, cw, ch, [[0, cl[0]], [t0 + 1.209, cl[1]]], { r: 14, bw: 2.5, glow: "0 0 0 2.5px rgba(255,255,255,.8), 0 24px 60px rgba(0,0,0,.6), 0 0 30px rgba(255,255,255,.10)" });
  // il badge delle views nell'angolo in basso a sinistra (conta)
  const b = r1Badge(card.g, 4, ch - 29, "0M", { w: 200, h: 50, fs: 34, ancora: "sx", z: 20 });
  const fmt = (x) => Math.round(x) + "M";
  b.conta(t0 + 0.011, t0 + 0.92, 0, 16, fmt, "none");
  b.conta(t0 + 1.38, t0 + 2.0, 16, 43, fmt, "power1.in");
  // F02 · il disco sul badge (6,381 s)
  const disco = COPIA.r01_disco({ t0: t0 + 0.792, X: cx - cw / 2 + 4 + 100, Y: cy + ch / 2 - 29, parent: grp });
  // la salita misurata (alto della card), card e disco insieme
  const su = cpCurva([[0, 298], [0.042, 279], [0.083, 257], [0.125, 234], [0.167, 212], [0.208, 192], [0.25, 174], [0.292, 158], [0.334, 144], [0.375, 132], [0.417, 121], [0.459, 111], [0.5, 102], [0.542, 94], [0.584, 86], [0.626, 79], [0.667, 73], [0.709, 67], [0.751, 62], [0.792, 57], [0.876, 48], [0.959, 40], [1.043, 33], [1.168, 25], [1.293, 18], [1.46, 11], [1.627, 7], [1.794, 4], [1.919, 0]].map(([u, d]) => [t0 + u, d]));
  const st = { v: 0 };
  gsap.set(grp, { y: su(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 1.92, ease: "none", immediateRender: false, onUpdate: () => gsap.set(grp, { y: su(t0 + st.v * 1.92) }) }, t0);
  // il muro attorno (compare quando la camera comincia ad allontanarsi)
  const muro = r1Muro(L, cx, cy, { ids: o.muro });
  gsap.set(muro.box, { opacity: 0 });
  tl.to(muro.box, { opacity: 1, duration: 0.05, ease: "none" }, t0 + 1.95);
  // lo zoom indietro (attorno a 540, 764 dello schermo: la card scende un poco mentre rimpicciolisce, come la sua)
  cpCam.scala([[t0 + 1.961, 1], [t0 + 2.011, 0.91], [t0 + 2.051, 0.727], [t0 + 2.091, 0.596], [t0 + 2.131, 0.51], [t0 + 2.171, 0.44], [t0 + 2.211, 0.41], [t0 + 2.261, 0.385], [t0 + 2.311, 0.365], [t0 + 2.411, 0.328], [t0 + 2.511, 0.299], [t0 + 2.611, 0.29]], [540, 764]);
  tl.to(L, { filter: "blur(5px)", duration: 0.06, ease: "none" }, t0 + 1.98);
  tl.to(L, { filter: "blur(0px)", duration: 0.26, ease: "power1.out" }, t0 + 2.06);
  tl.set(L, { filter: "none" }, t0 + 2.33);
  // lo scorrimento verso l'alto (correlazione di fase fra i suoi fotogrammi: px dello schermo)
  const dy = [[8.133, 0], [8.175, -36], [8.217, -124], [8.258, -261], [8.3, -396], [8.342, -511], [8.383, -607], [8.425, -690], [8.467, -760], [8.509, -822], [8.55, -876], [8.592, -924], [8.634, -966], [8.675, -1005], [8.717, -1039], [8.759, -1071], [8.8, -1099], [8.842, -1125], [8.884, -1149], [8.926, -1171], [8.967, -1190], [9.009, -1208], [9.051, -1224], [9.092, -1239], [9.134, -1252], [9.176, -1264], [9.218, -1275], [9.259, -1285], [9.301, -1294], [9.343, -1302], [9.384, -1309], [9.426, -1315]];
  cpCam.percorso(dy.map(([t, d]) => [t0 + (t - 5.589), 0, d]));
  // il mosso verticale dello scorrimento (filtro #mb del kit sul palco)
  const P = { v: 0 }, wr = () => mbn.setAttribute("stdDeviation", `0 ${P.v.toFixed(2)}`);
  tl.set(mbwrap, { filter: "url(#mb)" }, t0 + 2.54);
  tl.to(P, { v: 26, duration: 0.12, ease: "power1.in", onUpdate: wr }, t0 + 2.55);
  tl.to(P, { v: 0, duration: 0.6, ease: "power2.out", onUpdate: wr }, t0 + 2.67);
  tl.set(mbwrap, { filter: "none" }, t0 + 3.28);
  tl.set(L, { opacity: 0 }, scena.t1);
  return { rect: null, pose: null, ancore: {}, elementi: { card, b, disco, muro } };
};

// ── anelli di persone attorno alla tua foto (scene 5, 9, 15, 22): anelli concentrici di omini bianchi a passo regolare (sfalsati
// fra un anello e l'altro) e le orbite grigie sottili (più fitte degli anelli di persone, come le sue); ogni anello può uscire dal
// centro (esce), comparire girando in senso orario dall'alto (giro), colorarsi (colora: il suo rosso / verde → lime), spegnersi
// (spegni); le orbite possono comparire (orbiteIn) e tingersi (tinta). Indici da 1.
// o: { raggi ([70, 125, 180, 235, 290]), conte ([6, 12, 18, 24, 31]), orbite (raggi delle linee: [70, 97, …]), d (17), col, z (6) }
const r1Anelli = (L, cx, cy, o) => {
  o = o || {};
  const raggi = o.raggi || [70, 125, 180, 235, 290], conte = o.conte || raggi.map((r) => Math.max(6, Math.round((2 * Math.PI * r) / 58)));
  const rOrb = o.orbite || [], d = o.d || 17, z = o.z || 6;
  const R = Math.max(...raggi.concat(rOrb)) + 60;
  const S = svgLayer(L, z - 1, cx - R, cy - R, 2 * R, 2 * R);
  const mkC = (r, w, col) => { const c = document.createElementNS(NS, "circle"); c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", r); c.setAttribute("fill", "none"); c.setAttribute("stroke", col); c.setAttribute("stroke-width", w); c.setAttribute("opacity", 0); S.appendChild(c); return c; };
  const aloni = rOrb.map((r) => mkC(r, 14, "rgba(207,251,80,.10)"));
  const orbite = rOrb.map((r) => mkC(r, 2.2, "rgba(255,255,255,.30)"));
  const persone = raggi.map((r, i) => {
    const n = conte[i], ring = [];
    const G = layered(el(L, { position: "absolute", left: cx, top: cy, width: 0, height: 0, zIndex: z }));   // l'anello (ruota nel giro)
    for (let j = 0; j < n; j++) {
      const a = -Math.PI / 2 + (2 * Math.PI * (j + 0.5 * (i % 2))) / n;
      const p = r1Omino(G, r * Math.cos(a), r * Math.sin(a), { d, col: o.col || "#ffffff", z });
      p._a = ((a + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); p._dx = r * Math.cos(a); p._dy = r * Math.sin(a);
      gsap.set(p, { opacity: 0 });
      ring.push(p);
    }
    ring.G = G;
    return ring;
  });
  const ks = (x) => (x == null ? persone.map((_, i) => i + 1) : [].concat(x));
  const api = {
    S, orbite, aloni, persone, raggi,
    pieni: (x) => ks(x).forEach((k) => gsap.set(persone[k - 1], { opacity: 1 })),
    // l'anello k vola fuori dal centro (dal 30% del raggio) e si accende, col mosso
    esce: (k, t, dur) => persone[k - 1].forEach((p) => {
      gsap.set(p, { x: -p._dx * 0.7, y: -p._dy * 0.7, scale: 0.7, filter: "blur(2px)" });
      tl.to(p, { opacity: 1, duration: 0.06, ease: "none" }, t);
      tl.to(p, { x: 0, y: 0, scale: 1, filter: "blur(0px)", duration: dur || 0.3, ease: "power2.out" }, t);
      tl.set(p, { filter: "none" }, t + (dur || 0.3) + 0.01);
    }),
    // l'anello k compare girando in senso orario dall'alto (un giro in dur): ogni omino arriva sfocato quando passa la testa
    // del giro e l'anello intero ruota di −40° → 0 (la scia di Kallaway, reel 1 20,27–21,4 s)
    giro: (k, t, dur) => {
      const D = dur || 0.5, G = persone[k - 1].G;
      gsap.set(G, { rotation: -40, transformOrigin: "0px 0px" });
      tl.to(G, { rotation: 0, duration: D + 0.35, ease: "power2.out" }, t);
      persone[k - 1].forEach((p) => { const tt = t + D * (p._a / (2 * Math.PI)); gsap.set(p, { filter: "blur(4px)" }); tl.to(p, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power1.out" }, tt); tl.set(p, { filter: "none" }, tt + 0.23); });
    },
    // le orbite (indici o tutte) compaiono
    orbiteIn: (t, dur, x) => (x == null ? orbite.map((_, i) => i + 1) : [].concat(x)).forEach((k) => tl.to(orbite[k - 1], { attr: { opacity: 1 }, duration: dur || 0.4, ease: "power1.out" }, t)),
    // persone dell'anello (o di tutti) colorate in onda dall'alto (il suo rosso / verde → lime)
    colora: (x, t, dur, col) => ks(x).forEach((k) => persone[k - 1].forEach((p) => r1ColOmino(p, t + (dur || 0) * (p._a / (2 * Math.PI)), col || K.lime, 0.12))),
    // anelli che si spengono (le persone svaniscono)
    spegni: (x, t, dur) => ks(x).forEach((k) => tl.to(persone[k - 1], { opacity: 0, duration: dur || 0.3, ease: "power1.in" }, t)),
    orbiteVia: (x, t, dur) => [].concat(x).forEach((k) => tl.to(orbite[k - 1], { attr: { opacity: 0 }, duration: dur || 0.3 }, t)),
    // le orbite si tingono (il suo rosso → lime) dall'interno verso l'esterno, ognuna col suo alone
    tinta: (t, passo, x) => (x == null ? orbite.map((_, i) => i + 1) : [].concat(x)).forEach((k, i) => {
      const tt = t + (passo || 0.1) * i;
      tl.to(orbite[k - 1], { attr: { stroke: "rgba(207,251,80,.34)", opacity: 1 }, duration: 0.3, ease: "power1.out" }, tt);
      tl.to(aloni[k - 1], { attr: { opacity: 1 }, duration: 0.4, ease: "power1.out" }, tt);
    }),
  };
  return api;
};

/* @copia r01_tam · «Devi Espandere Il Tuo “TAM” / Per Avere Più Views»: «TAM Dell'Idea», la linea, «Mercato Totale
 *   Raggiungibile»; poi gli anelli di persone attorno alla tua foto che escono, si allargano, si riempiono e si tingono
 *   (reel 1, 12,554–23,732 s)
 * kallaway: reel 1, 12,554 s · taglio: la pillola rossa «Idea TAM» c'è già, sfocata, e sale frenando (centro y 856 → 830 → 810 →
 *   788 → 767 → 755 → 743 → 722 px a 12,554 · 12,68 · 12,80 · 13,01 · 13,26 · 13,43 · 13,72 · 14,8 s), a fuoco in 0,3 s, una banda
 *   di luce la passa (13,1–13,3 s); il titolo parola per parola («You Must Expand» 13,01 · «Your “TAM”» 13,18 bianche) e il
 *   riquadro rosso della riga 2 che si allunga da x 228 a 851 (12,85–13,47 s) con «To Get» 13,18 · «More Views» 13,43–13,47;
 *   da 13,4 s una linea bianca curva parte dal lato sinistro della pillola e scende a «Total Addressable Market» (corsivo, 13,93 ·
 *   14,26 · 14,6 s); a 15,77 s tutto lascia il posto agli anelli: il suo avatar (centro y 907) e gli anelli di omini che escono dal
 *   centro uno dopo l'altro (raggio esterno 185 → 300 px in 0,25 s); la camera sale (avatar a y 862 · 837 · 820 · 807 · 798 ·
 *   791 · 786 · 784 px a 16,0 … 17,8 s); 17,5–19,8 s la camera si avvicina ×1,29 e compaiono le orbite grigie; 20,0–21,4 s un
 *   anello nuovo gira dall'alto in senso orario (scia luminosa) e la camera si allontana (×0,89): gli anelli sono 10; 22,5–23,7 s
 *   le orbite si tingono di rosso dal centro in fuori, la camera si avvicina piano (×0,97)
 * misure: pillola 580×122 (x 250–830); riga 1 x 155–920 (y 180–222); riquadro x 228–851, y 230–298; «Total Addressable Market»
 *   x 225–855 col centro a y 930 (14,8 s); anelli: raggio esterno 300 px a ×1 (7 anelli), 387 a ×1,29, 391 a 23,5 s (10 anelli)
 * scena: t0 (12,554), t1 (23,732), X, Y, parent
 * colori: pillola rossa → lime con la scritta scura; riquadro rosso → lime; orbite rosse → lime con l'alone
 */
COPIA.r01_tam = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(13), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 12.554);
  // titolo (HUD)
  const T1 = r5Titolo({ righe: [[{ t: "Devi Espandere Il Tuo “TAM”", ruolo: "sans", size: 64 }]], y: 160, interlinea: [70] });
  T1.inAt([12.84, 12.84, 12.84, 13.01, 13.01].map(a));
  const T2 = COPIA.T02({ t0: 0, parent: hud, y: 230, x0: 228 }, { testo: ["Per", "Avere", "Più", "Views"], ruoli: ["sans", "sans", "serif", "serif"], fs: 60, fsSerif: 70, h: 68,
    tempi: [13.18, 13.18, 13.43, 13.47].map(a), bordo: [[12.846, 229], [12.888, 247], [12.93, 277], [12.971, 323], [13.013, 362], [13.055, 414], [13.096, 474], [13.138, 527], [13.18, 590], [13.222, 646], [13.263, 701], [13.305, 746], [13.347, 788], [13.388, 821], [13.43, 845], [13.472, 851]].map(([t, x]) => [a(t), x]) });
  tl.set([T1.root, T2.elementi.root], { opacity: 0 }, t1);
  // la pillola «TAM Dell'Idea», la linea e «Mercato Totale Raggiungibile» (un gruppo che sale frenando)
  const grp = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 12 }));
  const [px, py] = W(540, 722);
  const chip = layered(el(grp, { position: "absolute", left: px - 290, top: py - 61, width: 580, height: 122, borderRadius: 4, background: "linear-gradient(90deg,#c4ef44 0%,#CFFB50 45%,#9fc232 100%)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.55), 0 0 30px rgba(207,251,80,.25)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: FD, fontWeight: 700, fontSize: 62, color: K.ink, letterSpacing: "-0.02em", whiteSpace: "nowrap", zIndex: 3 }, "TAM Dell'Idea"));
  const band = el(chip, { position: "absolute", left: -120, top: -20, width: 90, height: 162, background: "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0))", transform: "skewX(-18deg)", opacity: 0 });
  tl.set(band, { opacity: 1 }, a(13.1));
  tl.fromTo(band, { x: 0 }, { x: 760, duration: 0.25, ease: "none", immediateRender: false }, a(13.1));
  tl.set(band, { opacity: 0 }, a(13.36));
  gsap.set(chip, { filter: "blur(7px)" });
  tl.to(chip, { filter: "blur(0px)", duration: 0.3, ease: "power2.out" }, t0);
  tl.set(chip, { filter: "none" }, t0 + 0.31);
  const S = svgLayer(grp, 2, px - 600, py - 300, 1200, 700);
  const lin = connector(S, [], { d: `M${px - 290} ${py + 8} C${px - 420} ${py + 30} ${px - 450} ${py + 190} ${px - 300} ${py + 210}`, color: "rgba(255,255,255,.92)", w: 3.5 });
  lin.p.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.8))";
  lin.draw(a(13.38), 0.5, "power1.inOut");
  const TM = r5Titolo({ righe: [[{ t: "Mercato Totale Raggiungibile", ruolo: "serif", size: 66 }]], parent: grp, x: px, y: py + 172, z: 4 });
  TM.inAt([13.76, 14.09, 14.43].map(a));
  const su = cpCurva([[0, 856], [0.042, 846], [0.084, 838], [0.125, 830], [0.167, 823], [0.209, 816], [0.25, 810], [0.334, 800], [0.459, 788], [0.584, 777], [0.709, 767], [0.876, 755], [1.168, 743], [1.6, 733], [2.25, 722], [3.2, 712]].map(([u, y]) => [t0 + u, y - 722]));
  const st = { v: 0 };
  gsap.set(grp, { y: su(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 3.2, ease: "none", immediateRender: false, onUpdate: () => gsap.set(grp, { y: su(t0 + st.v * 3.2) }) }, t0);
  tl.set(grp, { opacity: 0 }, a(15.77));
  // gli anelli attorno alla tua foto (15,77 s)
  const [cx, cy] = W(540, 907);
  // 5 anelli di persone (raggi 70 · 125 · 180 · 235 · 290, 6 → 31 persone) + 3 che arrivano girando (330 · 368 · 405); le orbite ogni
  // 27 px (misurate a 18,6 s: le linee sono il doppio degli anelli di persone)
  const orb = Array.from({ length: 13 }, (_, m) => 70 + 28 * m);
  const an = r1Anelli(L, cx, cy, { raggi: [70, 125, 180, 235, 290, 330, 368, 405], conte: [6, 12, 18, 24, 31, 35, 39, 43], orbite: orb });
  const av = r1Avatar(L, cx, cy, { r: 48, z: 9 });
  gsap.set(av, { opacity: 0 });
  tl.set(av, { opacity: 1 }, a(15.77));
  for (let k = 1; k <= 5; k++) an.esce(k, a(15.70 + 0.06 * (k - 1)), 0.3);
  an.orbiteIn(a(17.75), 0.5, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  // tre anelli nuovi che girano dall'alto in senso orario (20,27 · 20,74 · 21,02 s, ~0,5 s l'uno), con le loro orbite
  [[6, 20.27, [10, 11]], [7, 20.74, [12]], [8, 21.02, [13]]].forEach(([k, t, ob]) => { an.giro(k, a(t), 0.5); an.orbiteIn(a(t + 0.2), 0.6, ob); });
  an.tinta(a(22.45), 0.09);
  // l'alone largo attorno agli anelli che si accende con la tinta (il suo rosso scuro fino a ~r 520 → lime tenue)
  const alone = layered(el(L, { position: "absolute", left: cx - 560, top: cy - 560, width: 1120, height: 1120, borderRadius: "50%", background: "radial-gradient(circle, rgba(207,251,80,0) 35%, rgba(207,251,80,.07) 62%, rgba(207,251,80,.05) 80%, rgba(207,251,80,0) 100%)", opacity: 0, zIndex: 2 }));
  tl.to(alone, { opacity: 1, duration: 1.0, ease: "power1.out" }, a(22.6));
  // la camera: sale con l'avatar, si avvicina (×1,29), si allontana mentre si riempiono gli anelli, si riavvicina piano
  const ya = [[15.77, 907], [16.02, 862], [16.27, 837], [16.52, 820], [16.77, 807], [17.02, 798], [17.27, 791], [17.52, 786], [17.77, 784], [19.0, 780], [20.0, 778], [20.77, 768], [21.5, 765], [22.5, 762], [23.73, 762]];
  cpCam.percorso(ya.map(([t, y]) => [a(t), 0, y - 907]));
  cpCam.scala([[17.27, 1], [17.52, 1.02], [17.77, 1.067], [18.02, 1.137], [18.27, 1.187], [18.52, 1.223], [18.77, 1.247], [19.02, 1.267], [19.27, 1.277], [19.52, 1.287], [19.8, 1.29], [20.0, 1.27], [20.3, 1.15], [20.6, 1.0], [21.0, 0.92], [21.4, 0.89], [21.8, 0.887], [22.27, 0.9], [22.52, 0.92], [22.77, 0.935], [23.02, 0.945], [23.27, 0.955], [23.52, 0.963], [23.73, 0.97]].map(([t, k]) => [a(t), k]), [540, 784]);
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: { avatar: [cx, cy] }, elementi: { T1, T2, chip, lin, TM, an, av } };
};

// ── etichetta a riquadro di Kallaway («Idea», «Angle», i tre argomenti): bordo bianco sottile arrotondato, fondo scuro, scritta
// bianca neretta (o corsiva serif) · o: { fs (30), h, padX, serif, z } → nodo centrato su cx, cy
const r1Etichetta = (parent, cx, cy, testo, o) => {
  o = o || {};
  const fs = o.fs || 30, h = o.h || Math.round(fs * 1.75);
  const c = layered(el(parent, { position: "absolute", left: cx, top: cy - h / 2, height: h, padding: `0 ${o.padX == null ? Math.round(fs * 0.9) : o.padX}px`, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", borderRadius: o.r == null ? Math.round(h * 0.2) : o.r, background: o.fondo || "rgba(20,20,20,.88)", boxShadow: `inset 0 0 0 ${o.bw || 2.2}px rgba(255,255,255,.85), 0 0 14px rgba(255,255,255,.10)`, fontFamily: o.serif ? FH : FS, fontWeight: o.serif ? 400 : 700, fontSize: o.serif ? Math.round(fs * 1.12) : fs, color: K.white, letterSpacing: o.serif ? "0" : "-0.01em", zIndex: o.z || 16 }, testo));
  gsap.set(c, { xPercent: -50 });
  return c;
};
// il pop di un'etichetta (Kallaway: da piccola a intera in ~0,2 s, senza rimbalzo)
const r1Pop = (n, t, o) => { o = o || {}; gsap.set(n, { opacity: 0, scale: o.da || 0.3 }); tl.to(n, { opacity: 1, duration: 0.08, ease: "none" }, t); tl.to(n, { scale: 1, duration: o.dur || 0.21, ease: "power2.out" }, t); };

/* @copia r01_specifico · «I Contenuti Specifici / Raggiungono Meno Persone»: la tua foto sale, l'imbuto cresce sopra di lei,
 *   «Idea» e «Angolo» ai lati (reel 1, 28,654–33,075 s)
 * kallaway: reel 1, 28,654 s · taglio: il titolo parola per parola («Specific Content Always» 28,90–28,95 · «Reaches» 28,99 ·
 *   «Fewer» 29,32 · «People» 29,40 s bianche); il suo avatar sale da sotto (centro y 1247 → 1195 → 1145 → 1115 → 1095 → 1080 →
 *   1060 → 1048 → 1042 → 1038 px a 28,66 … 30,3 s); da 29,45 s l'imbuto di omini grigi sale dall'avatar come una colonna stretta
 *   (in cima a y 407 a 29,6 s) e si allarga (mezza larghezza in cima 36 · 101 · 160 · 192 · 223 · 235 · 263 · 282 px a 29,6 … 31,0 s);
 *   31,0–31,5 s la camera si allontana (×0,85) e va a sinistra (−48 px) mentre a destra spunta «Idea» (31,2–31,5 s); 32,3–32,9 s
 *   torna a destra (+68 px) mentre a sinistra spunta «Angle» (32,4–32,6 s)
 * misure: avatar Ø 166 (anello grigio); omini 40 px a passo 65 × 54; etichette 172×52 e 192×52 px sullo schermo (a ×0,85), bordo
 *   bianco, a y 1028; titolo riga 1 x 149–926 (y ~100–145), riga 2 x 141–939 (y ~160–220)
 * scena: t0 (28,654), t1 (33,075), X, Y, parent
 * colori: omini grigi come i suoi; etichette bianche su scuro come le sue; la sua foto → la tua
 */
const R1_TIT_SPECIFICO = [[{ t: "I Contenuti Specifici Raggiungono", ruolo: "sans", size: 54 }], [{ t: "Sempre ", ruolo: "sans", size: 82 }, { t: "Meno Persone", ruolo: "serif", size: 100 }]];
COPIA.r01_specifico = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(14), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 28.654);
  // (la frase intera: «I contenuti specifici raggiungono sempre meno persone»; «Always Reaches» → «Raggiungono Sempre», così le
  // due righe hanno la sua larghezza: riga 1 778 px, riga 2 799 px)
  const T = r5Titolo({ righe: R1_TIT_SPECIFICO, y: 92, interlinea: [64] });
  T.inAt([28.68, 28.7, 28.73, 28.78, 28.82, 29.15, 29.23].map(a));
  if (o.titoloFine !== false) tl.set(T.root, { opacity: 0 }, o.titoloFine || t1);
  const [ax, ay] = W(540, 1038);
  // l'imbuto (forma misurata, mezze larghezze × 1,18 come in scena 1: gli omini dei bordi sono più scuri della soglia)
  const forma = [[29.4, 1000, 12], [29.5, 720, 24], [29.6, 407, 36], [29.8, 398, 101], [30.0, 392, 160], [30.2, 389, 192], [30.4, 388, 223], [30.6, 388, 235], [30.8, 388, 263], [31.0, 388, 282]].map(([t, y, w]) => [a(t), y, w * 1.18]);
  const imb = r1Imbuto(L, X, Y, forma, { yV: 1050, yBasso: 923, righe: 11, passoY: 54, passoX: 65, d: 40, col: "#c4c4c4", a: 0.85 });
  const av = r1Avatar(L, ax, ay, { r: 83 });
  const fa = cpCurva([[28.654, 209], [28.785, 157], [28.91, 107], [29.035, 77], [29.16, 57], [29.285, 42], [29.41, 30], [29.535, 22], [29.66, 15], [29.785, 10], [29.91, 6], [30.035, 4], [30.16, 1], [30.3, 0]].map(([t, d]) => [a(t), d]));
  const st = { v: 0 };
  gsap.set(av, { y: fa(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 1.65, ease: "none", immediateRender: false, onUpdate: () => gsap.set(av, { y: fa(t0 + st.v * 1.65) }) }, t0);
  // «Idea» a destra, «Angolo» a sinistra (posizioni nel mondo ricavate dallo schermo con la camera a ×0,85)
  const idea = r1Etichetta(L, ...W(872, 1038), "Idea", { fs: 34, h: 61, padX: 52 });
  r1Pop(idea, a(31.2));
  const ang = r1Etichetta(L, ...W(175, 1038), "Angolo", { fs: 34, h: 61, padX: 40 });
  r1Pop(ang, a(32.4));
  // la camera: indietro ×0,85 attorno a (540, 950) e a sinistra; poi a destra
  cpCam.scala([[31.0, 1], [31.1, 0.975], [31.2, 0.935], [31.3, 0.9], [31.4, 0.87], [31.55, 0.855], [31.8, 0.85]].map(([t, k]) => [a(t), k]), [540, 950]);
  cpCam.percorso([[31.0, 0, 0], [31.16, -26, -3], [31.29, -37, -6], [31.41, -43, -9], [31.54, -45, -10], [31.79, -49, -12], [32.16, -49, -13], [32.29, -42, -13], [32.41, -26, -13], [32.54, -9, -13], [32.66, 3, -12], [32.79, 12, -12], [32.91, 18, -12], [33.075, 21, -12]].map(([t, dx, dy]) => [a(t), dx, dy]));
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: { avatar: [ax, ay] }, elementi: { T, imb, av, idea, ang } };
};

// ── il logo dell'agenzia del suo esempio («PeakAds»: cerchio scuro con l'anello bianco, la «A» a montagna bianca con la striscia
// verde e la scritta «PeakAds») · da noi la striscia e «Ads» lime · r = raggio del cerchio → nodo centrato su cx, cy
const r1Logo = (parent, cx, cy, r, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #262626 0%, #141414 70%, #0e0e0e 100%)", boxShadow: `inset 0 0 0 ${Math.max(1.6, r * 0.022)}px rgba(255,255,255,.72), 0 0 ${Math.round(r * 0.35)}px rgba(255,255,255,.14), 0 0 ${Math.round(r * 0.9)}px rgba(255,255,255,.05)`, zIndex: o.z || 16 }));
  const S = `<svg width="${r * 0.62}" height="${r * 0.5}" viewBox="0 0 62 50" style="display:block"><path d="M31 2 L60 48 L44 48 L31 26 L18 48 L2 48 Z" fill="#ffffff"/><path d="M8 47 C18 36 30 30 46 27 L40 37 C30 38 20 42 12 48 Z" fill="${K.lime}"/></svg>`;
  el(g, { position: "absolute", left: 0, top: r * 0.32, width: 2 * r, display: "flex", justifyContent: "center" }, S);
  el(g, { position: "absolute", left: 0, top: r * 0.92, width: 2 * r, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: Math.round(r * 0.27), letterSpacing: "-0.02em", color: K.white, whiteSpace: "nowrap" }, `Peak<span style="color:${K.lime}">Ads</span>`);
  el(g, { position: "absolute", left: 0, top: r * 1.24, width: 2 * r, textAlign: "center", fontFamily: FS, fontWeight: 600, fontSize: Math.max(4, Math.round(r * 0.06)), letterSpacing: "0.18em", color: "rgba(255,255,255,.55)", whiteSpace: "nowrap" }, "PERFORMANCE · CRESCITA");
  return g;
};

/* @copia r01_agenzia · Il logo dell'agenzia e i tre argomenti specifici; poi gli anelli di persone attorno al logo che si
 *   stringono, si spengono e restano in pochi, lime (reel 1, 33,575–43,168 s)
 * kallaway: reel 1, 33,575 s · taglio dalla faccia: il titolo di prima è già pieno ma le due righe arrivano in corsa da parti opposte
 *   (riga 1 da −147 px, riga 2 da +123 px, ferme a ~35,2 s: 12 → 60 → 97 → 118 → 132 → 141 → 148 → 153 → 157 px il bordo sinistro
 *   della riga 1 ogni 0,084 s); il logo «PeakAds» sale da sotto già in corsa (centro y 1163 → 1017 → 947 → 909 → 886 → 871 → 864 →
 *   859 px a 33,6 … 34,78 s), poi sale ancora (35,0–37,25 s: 823 · 710 · 644 · 599 · 570 · 548 · 535 · 522 · 515 · 509) e sotto
 *   compaiono i tre argomenti in corsivo nei riquadri (35,6 · 35,72 · 35,84 s); da 36,75 s la camera scivola a sinistra sempre più
 *   veloce (logo x 530 · 515 · 495 · 434 a 37,0 … 37,75 s) e a 37,875 s taglia sugli anelli attorno al logo piccolo, che continuano
 *   lo stesso movimento e frenano (centro x 682 → 625 → 596 → 578 → 561 → 547 → 541 a 37,9 … 39,65 s); l'anello interno si stringe
 *   (r 190 → 125 px, 38,3–38,9 s), gli altri diventano grigi e si spengono uno alla volta fino a 41,6 s; la camera si avvicina
 *   (×1,32 fino a 41,65 s, poi ×1,83 a 42,65 s) e l'anello che resta diventa rosso (42,7 s)
 * misure: logo r 108 (34,3–37,7 s), r 56 negli anelli; riquadri 580×96 a passo 140 sotto il logo (centri y 775 · 915 · 1056 a
 *   36,5 s); anelli: 12 persone a r 190 → 125, 18 a r 280, 24 a r 375; orbite a r 85 e 170
 * scena: t0 (33,575), t1 (43,168), X, Y, parent · opzioni: argomenti (3 testi)
 * colori: il suo verde del logo → lime; le persone rosse (il pubblico piccolo) → lime; le grigie restano grigie
 */
const R1_ARGOMENTI = ["Lead Generation Per Founder SaaS", "Script Di Cold Call Per Vendite B2B", "Video Brevi In Motion Graphics"];
COPIA.r01_agenzia = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(15), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 33.575);
  const tc = a(37.875);
  // il titolo di prima, già pieno; le due righe arrivano in corsa da parti opposte
  const T = r5Titolo({ righe: R1_TIT_SPECIFICO, y: 92, interlinea: [64] });
  T.unita.forEach((u) => gsap.set(u.w, { opacity: 0, filter: "none", y: 0, color: K.white }));
  tl.set(T.unita.map((u) => u.w), { opacity: 1 }, t0);
  const [r1, r2] = [T.root.children[0], T.root.children[1]];
  const f1 = cpCurva([[33.6, -147], [33.684, -126], [33.768, -99], [33.852, -78], [33.936, -62], [34.02, -50], [34.104, -41], [34.188, -33], [34.272, -27], [34.356, -22], [34.44, -18], [34.524, -14], [34.608, -11], [34.692, -9], [34.776, -6], [34.86, -4], [34.944, -3], [35.0, -2], [35.25, 0]].map(([t, x]) => [a(t), x]));
  const f2 = cpCurva([[33.6, 123], [33.684, 105], [33.768, 83], [33.852, 66], [33.936, 52], [34.02, 43], [34.104, 35], [34.188, 28], [34.272, 23], [34.356, 19], [34.44, 15], [34.524, 12], [34.608, 10], [34.692, 8], [34.776, 6], [34.86, 4], [34.944, 3], [35.0, 2], [35.25, 1], [35.5, 0]].map(([t, x]) => [a(t), x]));
  const st = { v: 0 };
  gsap.set(r1, { x: f1(t0) }); gsap.set(r2, { x: f2(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 1.95, ease: "none", immediateRender: false, onUpdate: () => { const t = t0 + st.v * 1.95; gsap.set(r1, { x: f1(t) }); gsap.set(r2, { x: f2(t) }); } }, t0);
  tl.set(T.root, { opacity: 0 }, t1);
  // il logo e i tre argomenti (un gruppo che sale due volte)
  const grp = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 14 }));
  const [lx, ly] = W(540, 510);
  const logo = r1Logo(grp, lx, ly, 108);
  const args = (o.argomenti || R1_ARGOMENTI).map((s, i) => {
    const [ax, ay] = W(540, 775 + 140 * i);
    const c = layered(el(grp, { position: "absolute", left: ax - 290, top: ay - 48, width: 580, height: 96, borderRadius: 4, background: "rgba(24,24,24,.9)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.34), 0 10px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FH, fontSize: 44, color: K.white, whiteSpace: "nowrap", textShadow: "0 0 10px rgba(255,255,255,.25)", zIndex: 15 }, s));
    r1Pop(c, a(35.6 + 0.12 * i), { da: 0.85, dur: 0.18 });
    return c;
  });
  const fy = cpCurva([[33.6, 653], [33.684, 566], [33.768, 507], [33.852, 467], [33.936, 437], [34.02, 416], [34.104, 399], [34.188, 387], [34.272, 376], [34.356, 368], [34.44, 361], [34.608, 354], [34.776, 349], [34.95, 345], [35.0, 313], [35.25, 200], [35.5, 134], [35.75, 89], [36.0, 60], [36.25, 38], [36.5, 25], [36.75, 12], [37.0, 5], [37.25, 0]].map(([t, y]) => [a(t), y]));
  const sg = { v: 0 };
  gsap.set(grp, { y: fy(t0) });
  tl.fromTo(sg, { v: 0 }, { v: 1, duration: 3.7, ease: "none", immediateRender: false, onUpdate: () => gsap.set(grp, { y: fy(t0 + sg.v * 3.7) }) }, t0);
  gsap.set(logo, { filter: "blur(4px)" });
  tl.to(logo, { filter: "blur(0px)", duration: 0.25 }, t0);
  tl.set(logo, { filter: "none" }, t0 + 0.26);
  // la camera scivola a sinistra fino al taglio (misurata sul logo)
  cpCam.percorso([[36.75, 0, 0], [37.0, -10, 0], [37.25, -25, 0], [37.5, -45, 0], [37.75, -106, 0], [37.875, -150, 0]].map(([t, dx, dy]) => [a(t), dx, dy]));
  tl.set(grp, { opacity: 0 }, tc);
  return { rect: null, pose: null, ancore: {}, elementi: { T, logo, args } };
};

/* @copia r01_agenzia2 · seconda metà della scena 9 (dopo il taglio di 37,875 s, nello stesso movimento): gli anelli attorno al
 *   logo piccolo che si stringono e si spengono; la camera si avvicina; l'anello che resta diventa lime (scheda: r01_agenzia)
 * scena: t0 (37,875), t1 (43,168), X, Y, parent
 */
COPIA.r01_agenzia2 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(16), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 37.875);
  const [cx, cy] = W(540, 794);
  const an = r1Anelli(L, cx, cy, { raggi: [190, 280, 375], conte: [12, 18, 24], orbite: [85, 170], d: 30, z: 8 });
  an.pieni();
  an.orbiteIn(t0 - 0.01, 0.01);
  const logo = r1Logo(L, cx, cy, 56, { z: 12 });
  // l'anello esterno è già grigio; il secondo diventa grigio mentre l'interno si stringe (190 → 125)
  gsap.set(an.persone[2], { opacity: 0.42 });
  tl.to(an.persone[1], { opacity: 0.45, duration: 0.3, ease: "power1.out" }, a(38.3));
  const G0 = an.persone[0].G, k = { v: 0 };
  tl.fromTo(k, { v: 0 }, { v: 1, duration: 0.6, ease: "power2.inOut", immediateRender: false, onUpdate: () => { const f = 1 - (1 - 125 / 190) * k.v; an.persone[0].forEach((p) => gsap.set(p, { x: p._dx * (f - 1), y: p._dy * (f - 1) })); } }, a(38.3));
  // i grigi si spengono uno alla volta: l'anello esterno 38,3–39,3 s, il secondo 39,3–41,3 s (a 41 s ne restano 3–4, come i suoi)
  an.persone[2].forEach((p, i) => tl.to(p, { opacity: 0, duration: 0.25, ease: "power1.in" }, a(38.3 + 1.0 * ((i * 7) % 24) / 24)));
  an.persone[1].forEach((p, i) => tl.to(p, { opacity: 0, duration: 0.25, ease: "power1.in" }, a(39.3 + 2.0 * ((i * 5) % 18) / 18)));
  // continua il movimento a sinistra della prima metà e frena (centro x 682 → 541): al taglio il contenuto è 142 px più a destra
  // (la posa del taglio nella composizione: fx − 142), poi scorre di −142 px
  cpCam.percorso([[37.875, 142, 0], [37.9, 142, 0], [38.15, 85, 0], [38.4, 56, 0], [38.65, 38, 0], [38.9, 21, 0], [39.15, 13, 0], [39.4, 7, 0], [39.65, 1, 0], [39.9, 0, 0]].map(([t, dx, dy]) => [a(t), dx - 142, dy]));
  // si avvicina piano, poi deciso
  cpCam.scala([[39.4, 1], [39.9, 1.06], [40.4, 1.14], [40.9, 1.2], [41.4, 1.26], [41.65, 1.32], [41.9, 1.48], [42.15, 1.6], [42.4, 1.66], [42.65, 1.83], [43.168, 1.85]].map(([t, z]) => [a(t), z]), [540, 794]);
  // l'anello che resta diventa lime (il suo rosso)
  an.colora(1, a(42.65), 0.12, K.lime);
  tl.to(an.persone[0], { filter: "drop-shadow(0 0 6px rgba(207,251,80,.8))", duration: 0.15 }, a(42.7));
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: { centro: [cx, cy] }, elementi: { an, logo } };
};
