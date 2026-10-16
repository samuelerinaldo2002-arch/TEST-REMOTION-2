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

// ── finestra di un nodo dell'HUD: invisibile (autoAlpha) fuori dalla sua scena, così i titoli delle scene dopo non si
// sovrappongono (per il check) a quelli della scena in corso
const r1Finestra = (n, t0, t1) => { gsap.set(n, { autoAlpha: 0 }); tl.set(n, { autoAlpha: 1 }, t0 - 0.001); if (t1 != null) tl.set(n, { autoAlpha: 0 }, t1); };

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
  T1.inAt([12.6, 12.64, 12.72, 12.8, 12.88].map(a));
  const T2 = COPIA.T02({ t0: 0, parent: hud, y: 230, x0: 228 }, { testo: ["Per", "Avere", "Più", "Views"], ruoli: ["sans", "sans", "serif", "serif"], fs: 60, fsSerif: 70, h: 68,
    tempi: [13.18, 13.18, 13.43, 13.47].map(a), bordo: [[12.846, 229], [12.888, 247], [12.93, 277], [12.971, 323], [13.013, 362], [13.055, 414], [13.096, 474], [13.138, 527], [13.18, 590], [13.222, 646], [13.263, 701], [13.305, 746], [13.347, 788], [13.388, 821], [13.43, 845], [13.472, 851]].map(([t, x]) => [a(t), x]) });
  r1Finestra(T1.root, t0, t1); r1Finestra(T2.elementi.root, t0, t1);
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
  // gli anelli escono dal centro già prima del taglio (al primo fotogramma dopo il taglio il raggio esterno è già 185 px): partono
  // a 15,64 s, nascosti fino a 15,77 s
  for (let k = 1; k <= 5; k++) an.esce(k, a(15.64 + 0.04 * (k - 1)), 0.24);
  an.persone.forEach((r) => { gsap.set(r.G, { opacity: 0 }); tl.set(r.G, { opacity: 1 }, a(15.77)); });
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
  r1Finestra(T.root, t0, o.titoloFine || t1);
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
  const idea = r1Etichetta(L, ...W(872, 1038), "Idea", { fs: 50, h: 84, padX: 60 });
  r1Pop(idea, a(31.2));
  const ang = r1Etichetta(L, ...W(175, 1038), "Angolo", { fs: 50, h: 84, padX: 44 });
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
 *   (×1,32 fino a 41,65 s, poi ×1,83 a 42,65 s) e l'anello che resta diventa rosso (42,417 s). Il logo nel primo secondo e il
 *   rosso lampeggiano a fotogrammi alterni (un difetto del suo montaggio): da noi fermi
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
  r1Finestra(T.root, t0, t1);
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
  // l'anello che resta diventa lime tutto insieme (il suo rosso: 42,417 s, a fotogrammi alterni fino a 42,67 s)
  an.colora(1, a(42.41), 0, K.lime);
  tl.to(an.persone[0], { filter: "drop-shadow(0 0 6px rgba(207,251,80,.8))", duration: 0.15 }, a(42.42));
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: { centro: [cx, cy] }, elementi: { an, logo } };
};

// ── la barra della lista del reel 1 («01 Broaden The Outcome Frame»): barra scura con l'accento rosso a sinistra, il numero e la
// voce in bianco, l'estremità destra più chiara (un riflesso); arriva spenta e sfocata e si accende con la banda di luce quando
// lui la dice · da noi l'accento lime. w×h (670×87), num ("01"), testo · o: { fs (25), z } → { g, accendi(t), spenta(t) }
const r1Barra = (parent, cx, top, w, h, num, testo, o) => {
  o = o || {};
  const fs = o.fs || Math.round(h * 0.33);
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top, width: w, height: h, borderRadius: 4, overflow: "hidden", background: "linear-gradient(90deg,#1b1b1b 0%,#222 55%,#3a3a3a 82%,#6a6a6a 92%,#2c2c2c 100%)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.10), 0 12px 30px rgba(0,0,0,.5)", zIndex: o.z || 12 }));
  el(g, { position: "absolute", left: 0, top: 0, width: Math.round(h * 0.31), height: h, background: K.lime, boxShadow: "0 0 18px rgba(207,251,80,.45)" });
  const txt = el(g, { position: "absolute", left: Math.round(h * 0.58), top: 0, height: h, display: "flex", alignItems: "center", gap: Math.round(h * 0.36), fontFamily: FS, fontWeight: 800, fontSize: fs, color: K.white, whiteSpace: "nowrap", letterSpacing: "-0.01em" }, `<span style="font-size:${Math.round(fs * 1.05)}px">${num}</span><span>${testo}</span>`);
  const band = el(g, { position: "absolute", left: -140, top: -10, width: 110, height: h + 20, background: "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0))", transform: "skewX(-20deg)", opacity: 0 });
  return {
    g, txt,
    // spenta e sfocata (come arriva da lui) e poi accesa con la banda di luce che la passa da sinistra a destra
    spenta: (t) => { gsap.set(g, { opacity: 0.38, filter: "blur(3px)" }); },
    accendi: (t, dur) => {
      tl.to(g, { opacity: 1, filter: "blur(0px)", duration: 0.25, ease: "power1.out" }, t);
      tl.set(g, { filter: "none" }, t + 0.26);
      tl.set(band, { opacity: 1 }, t);
      tl.fromTo(band, { x: 0 }, { x: w + 280, duration: dur || 0.45, ease: "power1.inOut", immediateRender: false }, t);
      tl.set(band, { opacity: 0 }, t + (dur || 0.45));
    },
  };
};
const R1_VOCI = ["Amplia La Cornice Del Risultato", "Amplia La Cornice Dell'Avatar", "Semplifica Tutto Il Linguaggio"];

/* @copia r01_tremodi · Il reel di un piccolo creator con le views che contano e il disco (F02); poi «Ecco I 3 Modi Per /
 *   Espandere Il Tuo TAM», l'imbuto, e la lista 01 · 02 · 03 che arriva da sotto (reel 1, 44,67–54,346 s; dentro c'è F02)
 * kallaway: reel 1, 44,67 s · taglio dalla faccia: il titolo di prima, più in basso (riga 1 y 160–214), con le righe che arrivano in
 *   corsa da parti opposte come in scena 9 (−148 / +123 px, ferme a ~46,2 s); il reel di un creator alla scrivania (377×607, centro
 *   557, 857) sale frenando (centro y 857 → 823 → 797 → 779 → 766 → 757 → 750 px a 44,67 … 45,17 s), il badge rosso sotto conta
 *   36 → 67 → 97 → 120 → 151 → 181 → 204 → 206 (44,7–45,6 s) e il disco rosso (F02) ci nasce sopra (45,17 s, r 57 → 146 in 0,29 s,
 *   via a 45,55 s); la camera si avvicina ×1,16 (45,17–46,1 s); da 46,3 s tutto sale sempre più veloce e a 46,63 s taglio: il titolo
 *   nuovo («Here Are The 3 Ways / To Expand Your TAM Size», la linea rossa sotto che cresce da x 192 a 887 in 0,75 s), l'imbuto che
 *   si allarga e l'avatar che sale da sotto (1287 → 1180 px, 46,71–47,63 s); da 47,6 s la camera scende (il contenuto sale sempre più
 *   veloce: l'imbuto esce in alto) e da sotto arriva la barra 01 in corsa (in cima a y 1089 → 1019 → 961 → 920 → 883 → 854 → 828 →
 *   807 → 789 → 771 → 757 px ogni 0,084 s da 48,13 s, poi 724 · 699 · 683 · 672 · 666 · 660 · 655 fino a 51,25 s), spenta e sfocata,
 *   si accende; la 02 arriva da sotto a 50,5 s, la 03 a 52,6 s (+166 px, frenando in ~1,5 s); 51,3–53,5 s la camera si avvicina
 *   ×1,22 (barre alte 87 → 106 px)
 * misure: barre 670×87 (accento 27 px) a passo 134 px; titolo riga 1 x 131–946 (y 180–239), riga 2 x 171–927 (y 240–299), linea
 *   y 322; card 377×607, badge 254×60 sotto la card
 * scena: t0 (44,67), t1 (54,346), X, Y, X2 (il mondo dopo il taglio di 46,63 s), parent · opzioni: clip ("cr11"), voci (3)
 * colori: badge e disco rossi → lime; linea rossa → lime; accento rosso delle barre → lime
 */
COPIA.r01_tremodi = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(17), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, a = (t) => t0 + (t - 44.67), tc = a(46.63);
  // il titolo di prima, più in basso, le righe in corsa da parti opposte; a fine tratto sale con la camera
  const T = r5Titolo({ righe: R1_TIT_SPECIFICO, y: 158, interlinea: [64] });
  T.unita.forEach((u) => gsap.set(u.w, { opacity: 0, filter: "none", y: 0, color: K.white }));
  tl.set(T.unita.map((u) => u.w), { opacity: 1 }, t0);
  const [r1, r2] = [T.root.children[0], T.root.children[1]];
  const D1 = [-148, -133, -108, -84, -67, -54, -44, -35, -29, -23, -18, -15, -12, -9, -6, -4, -3, -2, -1, 0], D2 = [123, 111, 90, 71, 56, 45, 36, 30, 24, 19, 16, 12, 10, 7, 5, 4, 3, 2, 1, 0];
  const f1 = cpCurva(D1.map((d, k) => [t0 + 0.0834 * k, d])), f2 = cpCurva(D2.map((d, k) => [t0 + 0.0834 * k, d]));
  const st = { v: 0 }, dur = 0.0834 * 19;
  gsap.set(r1, { x: f1(t0) }); gsap.set(r2, { x: f2(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: dur, ease: "none", immediateRender: false, onUpdate: () => { const t = t0 + st.v * dur; gsap.set(r1, { x: f1(t) }); gsap.set(r2, { x: f2(t) }); } }, t0);
  const fu = cpCurva([[46.0, 0], [46.25, -3], [46.3, -6], [46.34, -9], [46.38, -13], [46.42, -18], [46.46, -25], [46.505, -34], [46.55, -47], [46.63, -70]].map(([t, d]) => [a(t), d]));
  const su = { v: 0 };
  tl.fromTo(su, { v: 0 }, { v: 1, duration: tc - a(46.0), ease: "none", immediateRender: false, onUpdate: () => gsap.set(T.root, { y: fu(a(46.0) + su.v * (tc - a(46.0))) }) }, a(46.0));
  r1Finestra(T.root, t0, tc);
  // il reel del creator e il badge che conta
  const [cx, cy] = W(557, 857);
  const card = r5Card(L, cx, cy, 377, 607, [[0, o.clip || "cr11"]], { r: 10, bw: 2.5, glow: "0 0 0 2.5px rgba(255,255,255,.8), 0 20px 50px rgba(0,0,0,.6), 0 0 26px rgba(255,255,255,.10)" });
  const [bx, by] = W(562, 1218);
  const b = r1Badge(L, bx, by, "36", { w: 254, h: 60, fs: 40, z: 18 });
  b.conta(a(44.7), a(45.6), 36, 206, (x) => String(Math.round(x)), "power1.out");
  const disco = COPIA.r01_disco({ t0: a(45.17), X: bx, Y: by, parent: L }, { r: 146, z: 22 });
  // la camera: sale frenando, si avvicina ×1,16 attorno a (557, 950), poi sale sempre più veloce fino al taglio
  cpCam.percorso([[44.67, 0, 0], [44.711, 0, -18], [44.753, 0, -34.5], [44.795, 0, -48.5], [44.837, 0, -60], [44.878, 0, -70], [44.92, 0, -78.5], [44.962, 0, -85.5], [45.003, 0, -91.5], [45.045, 0, -96], [45.087, 0, -100], [45.128, 0, -104], [45.17, 0, -107.5]].map(([t, x, y]) => [a(t), x, y]));
  cpCam.scala([[45.17, 1], [45.21, 1.008], [45.25, 1.021], [45.3, 1.04], [45.34, 1.058], [45.38, 1.074], [45.42, 1.081], [45.46, 1.087], [45.5, 1.095], [45.55, 1.1], [45.59, 1.111], [45.63, 1.113], [45.8, 1.128], [45.9, 1.131], [46.1, 1.144]].map(([t, k]) => [a(t), k]), [557, 950]);
  cpCam.percorso([[46.0, 0, 0], [46.25, 0, -3], [46.3, 0, -6], [46.34, 0, -9], [46.38, 0, -13], [46.42, 0, -18], [46.46, 0, -25], [46.505, 0, -34], [46.55, 0, -47], [46.63, 0, -70]].map(([t, x, y]) => [a(t), x, y]));
  tl.set(L, { opacity: 0 }, tc);
  return { rect: null, pose: null, ancore: {}, elementi: { T, card, b, disco } };
};

/* @copia r01_tremodi2 · seconda metà della scena 11 (dopo il taglio di 46,63 s): «Ecco I 3 Modi Per / Espandere Il Tuo TAM»,
 *   l'imbuto che esce in alto e la lista 01 · 02 · 03 (scheda: r01_tremodi) · scena: t0 (46,63), t1 (54,346), X, Y, parent
 */
COPIA.r01_tremodi2 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(18), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 46.63);
  // titolo (HUD) con la linea d'accento che cresce da sinistra
  // («Here Are The 3 Ways / To Expand Your TAM Size» → «Ecco I 3 Modi Per Espandere / La Dimensione Del Tuo TAM»: «To Expand»
  // sale nella riga 1, così le due righe hanno la sua larghezza, 815 e 756 px, senza un font gigante)
  const T = r5Titolo({ righe: [[{ t: "Ecco I 3 Modi Per Espandere", ruolo: "sans", size: 69 }], [{ t: "La Dimensione ", ruolo: "sans", size: 64 }, { t: "Del Tuo TAM", ruolo: "serif", size: 78 }]], y: 172, interlinea: [66], sottolinea: { y: 320, w: 695, h: 5, dx: -0.5 } });
  T.inAt([46.55, 46.56, 46.57, 46.58, 46.6, 46.62, 46.6, 46.62, 46.75, 46.9, 47.05].map(a));
  r1Finestra(T.root, t0, t1);
  T.sottolinea(a(46.68), 0.78, "power1.inOut");
  // l'imbuto e la tua foto che sale da sotto
  const forma = [[46.63, 694, 125], [46.713, 639, 159], [46.797, 605, 170], [46.88, 586, 195], [46.964, 571, 218], [47.047, 561, 227], [47.13, 552, 235], [47.214, 546, 254], [47.297, 540, 260], [47.381, 537, 267], [47.464, 533, 282], [47.547, 531, 288], [47.631, 527, 289]].map(([t, y, w]) => [a(t), y, w * 1.18]);
  const imb = r1Imbuto(L, X, Y, forma, { yV: 1190, yBasso: 1065, righe: 11, passoY: 54, passoX: 65, d: 40, col: "#c4c4c4", a: 0.85 });
  const [ax, ay] = W(540, 1180);
  const av = r1Avatar(L, ax, ay, { r: 83 });
  const fa = cpCurva([[46.63, 140], [46.713, 107], [46.797, 74], [46.88, 56], [46.964, 44], [47.047, 32], [47.13, 25], [47.214, 18], [47.297, 13], [47.381, 8], [47.464, 6], [47.547, 3], [47.631, 0]].map(([t, d]) => [a(t), d]));
  const st = { v: 0 };
  gsap.set(av, { y: fa(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 1.0, ease: "none", immediateRender: false, onUpdate: () => gsap.set(av, { y: fa(t0 + st.v * 1.0) }) }, t0);
  // la lista sotto l'imbuto (nel mondo: la camera ci scende); la 01 c'è già, la 02 e la 03 arrivano da sotto
  const voci = o.voci || R1_VOCI, top01 = 1238, passo = 134;
  const bars = voci.map((s, i) => {
    const [bx, byt] = W(540, top01 + passo * i);
    const B = r1Barra(L, bx, byt, 670, 87, String(i + 1).padStart(2, "0"), s);
    B.spenta();
    return B;
  });
  // (a 48,13 s il taglio: l'imbuto e la foto, già quasi fuori in alto, non ci sono più; da sotto arriva in corsa la barra 01)
  tl.set([imb.box, av], { opacity: 0 }, a(48.13));
  gsap.set(bars[0].g, { opacity: 0 });
  tl.set(bars[0].g, { opacity: 0.38 }, a(48.13));
  bars[0].accendi(a(48.45), 0.5);
  const arriva = (B, t) => {
    const f = cpCurva([[0, 166], [0.25, 68], [0.5, 43], [0.75, 30], [1.0, 20], [1.25, 13], [1.5, 6], [2.0, 0]]), s2 = { v: 0 };
    gsap.set(B.g, { opacity: 0, y: f(0) });
    tl.to(B.g, { opacity: 0.38, duration: 0.1, ease: "none" }, t);
    tl.fromTo(s2, { v: 0 }, { v: 1, duration: 2.0, ease: "none", immediateRender: false, onUpdate: () => gsap.set(B.g, { y: f(s2.v * 2.0) }) }, t);
  };
  arriva(bars[1], a(50.45)); bars[1].accendi(a(50.95), 0.5);
  arriva(bars[2], a(52.55)); bars[2].accendi(a(53.05), 0.5);
  // la camera: il contenuto sale sempre più veloce (l'imbuto esce in alto), la barra 01 arriva in corsa e frena; poi si avvicina
  cpCam.percorso([[47.55, 0, 0], [47.631, 0, -2], [47.714, 0, -7], [47.798, 0, -18], [47.881, 0, -35], [47.964, 0, -60], [48.048, 0, -94], [48.131, 0, -149], [48.217, 0, -219], [48.3, 0, -277], [48.384, 0, -318], [48.467, 0, -355], [48.55, 0, -384], [48.634, 0, -410], [48.717, 0, -431], [48.801, 0, -449], [48.884, 0, -467], [48.967, 0, -481], [49.25, 0, -514], [49.5, 0, -539], [49.75, 0, -555], [50.0, 0, -566], [50.25, 0, -572], [50.5, 0, -578], [50.75, 0, -579], [51.0, 0, -581], [51.25, 0, -583]].map(([t, x, y]) => [a(t), x, y]));
  cpCam.scala([[51.25, 1], [51.5, 1.034], [51.75, 1.046], [52.0, 1.069], [52.25, 1.103], [52.5, 1.138], [52.75, 1.184], [53.0, 1.195], [53.25, 1.218], [53.5, 1.22], [54.0, 1.23], [54.346, 1.232]].map(([t, k]) => [a(t), k]), [529, 894]);
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: {}, elementi: { T, imb, av, bars } };
};

// ── i due copioni del reel 1 (scene 13, 15, 18): fogli scuri 410×616 col bordo sottile, il titolo «Script 1 / 2» in corsivo con lo
// svolazzo, 2–3 righe bianche in cima e le righe grigie sotto (passo 30 px); uno alla volta viene avanti (scala ~1,87 attorno alla
// prima riga e va al centro, l'altro resta fermo dietro) e la frase si scrive al posto delle righe bianche.
// Coordinate dello schermo (scena senza camera): centri (305, 792) e (775, 792), alto 484. → api
const r1Copioni = (L, X, Y, o) => {
  o = o || {};
  const W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const w = 410, h = 616, top = 484, riga0 = 74, passo = 30;
  const docs = [305, 775].map((sx, i) => {
    const [x, y] = W(sx, top);
    const d = layered(el(L, { position: "absolute", left: x - w / 2, top: y, width: w, height: h, borderRadius: 10, background: "linear-gradient(180deg,#141414 0%,#0e0e0e 100%)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.20), 0 0 30px rgba(255,255,255,.05), 0 20px 50px rgba(0,0,0,.6)", transformOrigin: `50% ${riga0}px`, zIndex: i === 0 ? 12 : 11 }));
    el(d, { position: "absolute", left: 0, top: 10, width: w, textAlign: "center", fontFamily: FH, fontSize: 25, color: "rgba(255,255,255,.85)" }, `Copione ${i + 1}`);
    el(d, { position: "absolute", left: w / 2 - 38, top: 40, width: 76, height: 7, borderBottom: "1.5px solid rgba(255,255,255,.55)", borderRadius: "0 0 50% 50%" });
    const bianche = i === 0 ? 2 : 3, righe = [];
    for (let k = 0; k < 18; k++) {
      const r = el(d, { position: "absolute", left: 43, top: riga0 + passo * k - (k < bianche ? 3 : 2), width: 319, height: k < bianche ? 6 : 4, borderRadius: 2, background: k < bianche ? "#ffffff" : "rgba(255,255,255,.42)", boxShadow: k < bianche ? "0 0 8px rgba(255,255,255,.6)" : "none" });
      righe.push(r);
    }
    const testo = layered(el(d, { position: "absolute", left: 43, top: riga0 - 12, width: 330, fontFamily: FS, fontWeight: 800, fontSize: 15, lineHeight: `${passo}px`, color: K.white, textShadow: "0 0 6px rgba(255,255,255,.45)", whiteSpace: "nowrap" }));
    return { d, righe, testo, sx, bianche };
  });
  const api = {
    docs,
    // il copione i viene avanti / torna: pts = [[t, scala, centro x dello schermo]] (prima riga ferma in altezza)
    muovi: (i, pts) => {
      const D = docs[i], fs = cpCurva(pts.map((p) => [p[0], p[1]])), fx = cpCurva(pts.map((p) => [p[0], p[2]])), st = { v: 0 };
      const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
      tl.fromTo(st, { v: 0 }, { v: 1, duration: t1 - t0, ease: "none", immediateRender: false, onUpdate: () => { const t = t0 + st.v * (t1 - t0); gsap.set(D.d, { scale: fs(t), x: fx(t) - D.sx }); } }, t0);
      tl.set(D.d, { zIndex: 13 }, t0);
    },
    // posa fissa (scala, centro x) a partire da t
    posa: (i, t, s, cx) => { gsap.set(docs[i].d, { scale: s, x: cx - docs[i].sx }); },
    // la frase scritta lettera per lettera al posto delle righe bianche: righe = [[[parola, t], …], …] (una per riga)
    scrivi: (i, righe, o2) => {
      o2 = o2 || {};
      const D = docs[i];
      righe.forEach((riga, ri) => {
        const r = layered(el(D.testo, { position: "relative", height: passo, whiteSpace: "nowrap" }));
        tl.to(D.righe[ri], { opacity: 0, duration: 0.08, ease: "none" }, riga[0][1] - 0.02);
        riga.forEach(([p, t], pi) => {
          const parola = (pi ? " " : "") + p, dur = Math.min(0.32, 0.045 * parola.length);
          [...parola].forEach((c, ci) => {
            const s = el(r, { display: "inline", opacity: 0, whiteSpace: "pre" }, c === " " ? " " : c, "span");
            tl.set(s, { opacity: 1 }, t + (dur * ci) / Math.max(1, parola.length));
          });
        });
      });
      if (o2.pieno) gsap.set(D.testo.querySelectorAll("span"), { opacity: 1 });
    },
    // le righe del copione si accendono di un colore per un attimo (Kallaway: rosso 67,78–67,96 s, verde 84,7 s → lime)
    lampo: (i, t, dur, col) => {
      const R = docs[i].righe.slice(docs[i].bianche);
      tl.to(R, { background: col || K.lime, boxShadow: `0 0 10px ${col || K.lime}`, duration: 0.04, ease: "none" }, t);
      tl.to(R, { background: "rgba(255,255,255,.42)", boxShadow: "none", duration: 0.08, ease: "none" }, t + (dur || 0.2));
      tl.to(docs[i].d, { boxShadow: `inset 0 0 0 2px ${col || K.lime}, 0 0 40px rgba(207,251,80,.35)`, duration: 0.04 }, t);
      tl.to(docs[i].d, { boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.20), 0 0 30px rgba(255,255,255,.05), 0 20px 50px rgba(0,0,0,.6)", duration: 0.1 }, t + (dur || 0.2));
    },
  };
  return api;
};
// la barra d'intestazione (K14 del reel 1: la voce della lista in alto, 940×124, nell'HUD) · accesa a t
const r1Intestazione = (num, testo, t, o) => {
  o = o || {};
  const B = r1Barra(hud, 540, o.top || 176, 940, 124, num, testo, { z: 60 });
  gsap.set(B.g, { opacity: 0.45 });
  tl.to(B.g, { opacity: 1, duration: 0.2, ease: "power1.out" }, t);
  return B;
};
// le curve misurate del copione che viene avanti (scena 13: il copione 1, da 58,85 s) e del copione 2 (scena 15, a metà al taglio)
const R1_AVANTI_1 = [[0, 1.0, 302.5], [0.084, 1.025, 308.5], [0.126, 1.063, 318.5], [0.168, 1.122, 334], [0.21, 1.26, 373], [0.252, 1.326, 390.5], [0.294, 1.379, 405], [0.336, 1.426, 417.5], [0.378, 1.467, 429], [0.42, 1.505, 439], [0.462, 1.536, 448], [0.504, 1.561, 456], [0.546, 1.589, 463.5], [0.588, 1.608, 469.5], [0.63, 1.636, 476], [0.672, 1.655, 481], [0.714, 1.677, 486.5], [0.756, 1.693, 491], [0.84, 1.72, 499.5], [0.924, 1.746, 506.5], [1.008, 1.765, 512], [1.092, 1.787, 517.5], [1.134, 1.796, 519.5], [1.4, 1.837, 530.5], [1.65, 1.862, 536.5], [1.9, 1.871, 539], [2.15, 1.875, 539.5]];
const R1_AVANTI_2 = [[0, 1.245, 709.5], [0.084, 1.326, 686.5], [0.168, 1.392, 668], [0.252, 1.448, 653], [0.336, 1.502, 639.5], [0.42, 1.542, 628], [0.504, 1.577, 618.5], [0.588, 1.608, 609.5], [0.672, 1.636, 602], [0.756, 1.665, 595.5], [0.84, 1.687, 589], [0.924, 1.718, 581], [1.008, 1.734, 576.5], [1.092, 1.749, 572], [1.176, 1.765, 567.5], [2.0, 1.83, 548], [3.2, 1.856, 540]];
// il copione che torna indietro (scena 15, 66,84–68,0 s): scala e centro x misurati
const R1_INDIETRO_2 = [[0, 1.856, 540], [0.042, 1.846, 542.5], [0.084, 1.828, 547.5], [0.126, 1.793, 557], [0.168, 1.734, 571.5], [0.21, 1.643, 595], [0.252, 1.536, 623], [0.294, 1.42, 650], [0.378, 1.317, 685], [0.42, 1.266, 698], [0.462, 1.232, 708.5], [0.504, 1.194, 718.5], [0.546, 1.169, 725.5], [0.63, 1.122, 738], [0.714, 1.088, 748.5], [0.798, 1.06, 755], [1.16, 1.0, 774.5]];

/* @copia r01_copione1 · Intestazione «01 Amplia La Cornice Del Risultato»; i due copioni, il primo viene avanti e si scrive
 *   «Questa Strategia Porta Il Tuo ROAS / Da 2X A 4X» (reel 1, 58,851–62,312 s)
 * kallaway: reel 1, 58,851 s · taglio: in alto la barra «01 Broaden The Outcome Frame» (940×124, spenta, si accende a 59,0 s); sotto
 *   i due copioni affiancati («Script 1», «Script 2»: fogli scuri 410×616, due-tre righe bianche e le grigie); da 58,9 s il copione 1
 *   viene avanti e va al centro (scala 1 → 1,26 → 1,51 → 1,64 → 1,72 → 1,79 → 1,87 a 59,06 · 59,27 · 59,48 · 59,69 · 59,93 · 60,25 ·
 *   61,0 s, la prima riga ferma a y 555), il 2 resta dietro; la frase si scrive lettera per lettera al posto delle righe bianche
 *   (59,55–61,98 s) sulle sue parole
 * misure: copioni 410×616 coi centri x 305 e 775, alto 484; righe a passo 30 da y 558; prima riga larga 319 px; scrittura ~16 lettere
 *   al secondo (striscia dei suoi fotogrammi)
 * scena: t0 (58,851), t1 (62,312), X, Y, parent
 * colori: l'accento rosso della barra → lime; il resto bianco e grigio come il suo
 */
COPIA.r01_copione1 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(19), X = scena.X, Y = scena.Y;
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 58.851);
  const H = r1Intestazione("01", R1_VOCI[0], a(59.0));
  r1Finestra(H.g, t0, t1);
  const C = r1Copioni(L, X, Y);
  C.muovi(0, R1_AVANTI_1.map(([u, s, x]) => [t0 + u, s, x]));
  C.scrivi(0, [[["Questa", 59.55], ["Strategia", 59.7], ["Porta", 60.1], ["Il", 60.35], ["Tuo", 60.5], ["ROAS", 60.8]], [["Da", 61.2], ["2X", 61.4], ["A", 61.6], ["4X", 61.8]]].map((r) => r.map(([p, t]) => [p, a(t)])));
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: {}, elementi: { H, C } };
};

/* @copia r01_copione2 · Il secondo copione si scrive «Questa Strategia Mi Ha Fatto 500.000 € / Nell'Ultimo Mese»; torna
 *   indietro, si accende un attimo; i copioni scivolano a sinistra e a 69,44 s gli anelli di persone attorno al copione piccolo,
 *   che diventano lime dal centro in fuori (reel 1, 63,605–72,322 s)
 * kallaway: reel 1, 63,605 s · taglio: il copione 2 è già a metà della sua venuta avanti (scala 1,25, centro x 710) e arriva al
 *   centro (1,77 a 64,78 s; 1,86 a 66,8 s); la frase si scrive 63,94–66,6 s; 66,84–68,0 s torna al suo posto (scala 1,86 → 1,64 →
 *   1,32 → 1,19 → 1,09 → 1,0, centro x 540 → 595 → 685 → 719 → 749 → 775), le sue righe diventano rosse per un attimo (67,78–67,96 s);
 *   68,3–69,4 s i copioni scivolano a sinistra sempre più veloci; 69,44 s taglio sugli anelli (4 anelli di persone grigie con le
 *   orbite, il copione piccolo al centro); 70,0–71,15 s le persone diventano verdi dal centro in fuori; la camera si avvicina
 *   (×1,5 fino a 72,3 s); da 71,9 s tutto sale (la barra in alto esce) verso la lista della scena dopo
 * misure: come r01_copione1; anelli r 110 · 170 · 230 · 290 px (12 · 16 · 20 · 24 persone) attorno a (540, 790)
 * scena: t0 (63,605), t1 (72,322), X, Y, parent · la seconda metà (dal taglio di 69,44 s) è COPIA.r01_copione2b
 * colori: rosso e verde → lime (il lampo rosso sulle righe da noi è lime: «riduce la forza della promessa» resta un accento)
 */
COPIA.r01_copione2 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(20), X = scena.X, Y = scena.Y;
  const t0 = scena.t0, a = (t) => t0 + (t - 63.605), tc = a(69.44);
  const H = r1Intestazione("01", R1_VOCI[0], t0 - 0.01);
  gsap.set(H.g, { opacity: 1 });
  r1Finestra(H.g, t0, scena.t1);
  const fu = cpCurva([[71.9, 0], [72.0, -6], [72.1, -18], [72.2, -36], [72.322, -62]].map(([t, d]) => [a(t), d])), su = { v: 0 };
  tl.fromTo(su, { v: 0 }, { v: 1, duration: a(72.322) - a(71.9), ease: "none", immediateRender: false, onUpdate: () => gsap.set(H.g, { y: fu(a(71.9) + su.v * (a(72.322) - a(71.9))) }) }, a(71.9));
  const C = r1Copioni(L, X, Y);
  // il copione 1 è già scritto (tre righe piccole), il 2 viene avanti
  C.scrivi(0, [[["Questa", 0], ["Strategia", 0], ["Porta", 0], ["Il", 0], ["Tuo", 0], ["ROAS", 0]], [["Da", 0], ["2X", 0], ["A", 0], ["4X", 0]]], { pieno: true });
  C.docs[0].righe.slice(0, 2).forEach((r) => gsap.set(r, { opacity: 0 }));
  C.muovi(1, R1_AVANTI_2.map(([u, s, x]) => [t0 + u, s, x]));
  C.scrivi(1, [[["Questa", 63.94], ["Strategia", 64.1], ["Mi", 64.6], ["Ha", 64.7], ["Fatto", 64.8], ["500.000", 65.0], ["€", 65.4]], [["Nell'Ultimo", 65.77], ["Mese", 66.27]]].map((r) => r.map(([p, t]) => [p, a(t)])));
  C.muovi(1, R1_INDIETRO_2.map(([u, s, x]) => [a(66.84) + u, s, x]));
  tl.to(C.docs[1].d, { filter: "blur(3px)", duration: 0.1 }, a(66.9));
  tl.to(C.docs[1].d, { filter: "blur(0px)", duration: 0.25 }, a(67.1));
  tl.set(C.docs[1].d, { filter: "none" }, a(67.36));
  C.lampo(1, a(67.3), 0.66, K.lime);   // (da lui rosso 67,3–67,96 s, a fotogrammi alterni nell'ultimo tratto)
  // i copioni scivolano a sinistra sempre più veloci fino al taglio (68,3–69,44 s: −10 · −36 · −99 px a 68,5 · 69,0 · 69,35 s)
  cpCam.percorso([[68.3, 0, 0], [68.5, -10, 0], [68.75, -20, 0], [69.0, -36, 0], [69.2, -62, 0], [69.35, -99, 0], [69.44, -125, 0]].map(([t, x, y]) => [a(t), x, y]));
  tl.set(L, { opacity: 0 }, tc);
  return { rect: null, pose: null, ancore: {}, elementi: { H, C } };
};

COPIA.r01_copione2b = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(21), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 69.44);
  const [cx, cy] = W(540, 790);
  const an = r1Anelli(L, cx, cy, { raggi: [110, 170, 230, 290], conte: [12, 16, 20, 24], orbite: [80, 110, 140, 170, 200, 230, 260, 290], d: 26, col: "#9c9c9c", z: 8 });
  an.pieni(); an.orbiteIn(t0 - 0.01, 0.01);
  // il copione piccolo al centro
  const mini = layered(el(L, { position: "absolute", left: cx - 30, top: cy - 40, width: 60, height: 80, borderRadius: 4, background: "#121212", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.45)", zIndex: 10 }));
  for (let k = 0; k < 8; k++) el(mini, { position: "absolute", left: 9, top: 12 + 8 * k, width: 42, height: 3, background: k < 2 ? "#fff" : "rgba(255,255,255,.45)" });
  // le persone diventano lime dal centro in fuori (il suo verde)
  [[1, 70.0], [2, 70.3], [3, 70.6], [4, 70.9]].forEach(([k, t]) => an.colora(k, a(t), 0.25, K.lime));
  // la camera si avvicina (×1,5) e alla fine sale verso la lista
  cpCam.scala([[69.44, 1], [70.0, 1.06], [70.6, 1.13], [71.15, 1.2], [71.5, 1.27], [71.9, 1.4], [72.322, 1.5]].map(([t, k]) => [a(t), k]), [540, 790]);
  cpCam.percorso([[71.9, 0, 0], [72.0, 0, -6], [72.1, 0, -18], [72.2, 0, -36], [72.322, 0, -62]].map(([t, x, y]) => [a(t), x, y]));
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: {}, elementi: { an, mini } };
};

/* @copia r01_lista02 · «Ecco Come Puoi “Espandere” / La Dimensione Del Tuo TAM»: la lista, la 02 accesa che cresce
 *   (reel 1, 72,322–73,782 s; è il K14 al contrario: la lista torna e la voce detta si allarga)
 * kallaway: reel 1, 72,322 s · taglio in corsa (il contenuto sale ancora e frena: titolo in cima a y 248 → 237 → 231 → 227 → 225 ·
 *   224 px fino a 73,5 s); la lista coi tre riquadri, 01 e 03 spenti (scritte grigie), 02 accesa e più grande, che si allarga ancora
 *   (accento a x 130 → 102 → 84 → 70 → 63 → 57 → 53 → 48 px, alta 107 → 130 px) con il riflesso che la passa
 * misure: barre 790×104 (01, 03), la 02 ×1,04 → ×1,22; titolo riga 1 y ~240–300 (x 160–915), riga 2 y ~305–360, linea y 375
 * scena: t0 (72,322), t1 (73,782), X, Y, parent
 */
COPIA.r01_lista02 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(22), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 72.322);
  // titolo nel mondo (sale con la camera), già pieno al taglio
  const T = r5Titolo({ righe: [[{ t: "Ecco Come Puoi “Espandere”", ruolo: "sans", size: 74 }], [{ t: "La Dimensione ", ruolo: "sans", size: 66 }, { t: "Del Tuo TAM", ruolo: "serif", size: 80 }]], parent: L, x: W(540, 0)[0], y: W(0, 236)[1], interlinea: [66], sottolinea: { y: W(0, 375)[1], w: 615, h: 5 } });
  T.unita.forEach((u) => gsap.set(u.w, { opacity: 1, filter: "none", y: 0, color: K.white }));
  T.sottolinea(t0 - 0.02, 0.01);
  const voci = R1_VOCI, bars = voci.map((s, i) => {
    const [bx, by] = W(540, 600 + 188 * i);
    const B = r1Barra(L, bx, by, 790, 104, String(i + 1).padStart(2, "0"), s, { fs: 33 });
    if (i !== 1) gsap.set(B.txt, { color: "rgba(255,255,255,.42)" });
    return B;
  });
  gsap.set(bars[1].g, { scale: 1.04, transformOrigin: "50% 50%", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.18), 0 16px 40px rgba(0,0,0,.6)" });
  tl.to(bars[1].g, { scale: 1.22, duration: 1.2, ease: "power2.out" }, t0);
  bars[1].accendi(a(72.4), 0.6);
  cpCam.percorso([[72.322, 0, 0], [72.414, 0, -4], [72.498, 0, -7], [72.582, 0, -11], [72.666, 0, -13], [72.75, 0, -15], [72.834, 0, -17], [72.918, 0, -19], [73.002, 0, -20], [73.17, 0, -23], [73.5, 0, -24], [73.782, 0, -24]].map(([t, x, y]) => [a(t), x, y]));
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: {}, elementi: { T, bars } };
};

// ── il pannello «Reel insights» (scena 18): vetro scuro 500×826 col bordo sottile, il titolo, la miniatura del tuo reel, la pillola
// delle views che conta, «Virality Graph» col grafico: la curva rossa (conversioni) a gobba e la verde (views) che sale → la rossa
// resta grafite chiara, la verde diventa lime. Coordinate dello schermo a ×1 (alto a sinistra 306, 380). → api
const r1Insights = (L, X, Y, o) => {
  o = o || {};
  const W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const [px, py] = W(306, 380), w = 500, h = 826;
  const g = layered(el(L, { position: "absolute", left: px, top: py, width: w, height: h, borderRadius: 12, background: "linear-gradient(180deg,rgba(40,40,40,.92) 0%,rgba(24,24,24,.94) 100%)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.28), 0 0 40px rgba(255,255,255,.06), 0 24px 60px rgba(0,0,0,.6)", zIndex: 14 }));
  el(g, { position: "absolute", left: 0, top: 22, width: w, textAlign: "center", fontFamily: FS, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.9)" }, "Statistiche del reel");
  el(g, { position: "absolute", left: 20, top: 62, width: w - 40, height: 1.5, background: "rgba(255,255,255,.18)" });
  const th = layered(el(g, { position: "absolute", left: 180, top: 96, width: 140, height: 246, borderRadius: 6, overflow: "hidden", background: "#111", zIndex: 2 }));
  mediaTile(th, 0, 0, 140, 246, o.clip || "ins", 1).style.borderRadius = "0px";
  const b = r1Badge(g, 250, 382, "0k", { w: 104, h: 32, fs: 20, z: 3 });
  el(g, { position: "absolute", left: 0, top: 428, width: w, textAlign: "center", fontFamily: FS, fontWeight: 600, fontSize: 21, color: "rgba(255,255,255,.9)" }, "Grafico Viralità");
  const S = svgLayer(g, 4, 0, 0, w, h);
  const ax = (d, sw, op) => pathEl(S, d, { fill: "none", stroke: `rgba(255,255,255,${op})`, "stroke-width": sw });
  ax("M90 450 L90 690", 2, 0.75); ax("M84 670 L440 670", 2, 0.75); ax("M90 478 L440 478", 1.5, 0.6); ax("M90 576 L440 576", 1.5, 0.6);
  el(g, { position: "absolute", left: 40, top: 466, fontFamily: FS, fontWeight: 600, fontSize: 15, color: "rgba(255,255,255,.75)" }, "1M");
  el(g, { position: "absolute", left: 26, top: 564, fontFamily: FS, fontWeight: 600, fontSize: 15, color: "rgba(255,255,255,.75)" }, "200K");
  const rossa = pathEl(S, "M84 670 C150 650 220 632 300 630 C360 628 400 645 436 662", { fill: "none", stroke: "rgba(225,225,225,.85)", "stroke-width": 5, "stroke-linecap": "round" });
  rossa.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.45))";
  const verde = pathEl(S, "M84 660 C190 640 280 610 340 560 C380 528 405 500 425 455", { fill: "none", stroke: K.lime, "stroke-width": 5, "stroke-linecap": "round" });
  verde.style.filter = `drop-shadow(0 0 8px ${K.lime})`;
  const LR = drawable(rossa), LV = drawable(verde);
  return {
    g, b, rossa, verde,
    rossaIn: (t, dur) => tl.to(rossa, { attr: { "stroke-dashoffset": 0 }, duration: dur || 0.6, ease: "power1.out" }, t),
    verdeIn: (t, dur, ease) => tl.to(verde, { attr: { "stroke-dashoffset": 0 }, duration: dur || 1.5, ease: ease || "power1.in" }, t),
    centroGrafico: () => W(306 + 260, 380 + 600),
  };
};

/* @copia r01_avatar · Intestazione «02 Amplia La Cornice Dell'Avatar»; i copioni: «Ecco Come Fare Ads Per Brand E-Commerce / Che
 *   Fatturano 30 Milioni O Più» e «Ecco La Migliore Strategia Ads / Per Brand E-Commerce»; il secondo si accende; il pannello delle
 *   statistiche col tuo reel, le views che contano e il grafico, il disco (F02) (reel 1, 76,702–88,672 s)
 * kallaway: reel 1, 76,702 s · taglio: la barra «02 Broaden The Avatar Frame» in alto, i due copioni vuoti; il copione 1 viene avanti
 *   come in scena 13 (da 76,75 s) e si scrive (77,0–80,1 s); 80,2 s torna indietro sfocato e il 2 viene avanti (80,55–81,6 s), si
 *   scrive (81,2–83,9 s); 83,9 s torna al suo posto; le sue righe diventano verdi un attimo (84,65–84,85 s) mentre i copioni
 *   scivolano a sinistra; 84,88 s arriva da destra in corsa il pannello «Reel insights» (centro x 745 → 667 → 628 → 572 → 556 px a
 *   84,88 · 85,09 · 85,25 · 85,63 · 85,9 s): la sua miniatura, la pillola delle views che conta 0k → 92k → 246k → 412k → 565k →
 *   731k → 885k (85,3–88,63 s), il grafico con la curva rossa a gobba e da 86,9 s la verde che sale; 86,75–87,3 s la camera si
 *   avvicina ×1,46 (il pannello esce in alto sotto la barra); 87,3 s il disco rosso (F02) sul grafico
 * misure: pannello 500×826 (x 306–806, y 380–1206); miniatura 140×246; grafico x 396–740, y 830–1070; copioni come scena 13
 * scena: t0 (76,702), t1 (88,672), X, Y, parent · opzioni: clip ("ins")
 * colori: accento rosso della barra → lime; il verde (views) → lime; il rosso (conversioni) → grafite chiara; il disco rosso → lime
 */
COPIA.r01_avatar = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(23), X = scena.X, Y = scena.Y;
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 76.702);
  const H = r1Intestazione("02", R1_VOCI[1], a(76.85));
  r1Finestra(H.g, t0, t1);
  const C = r1Copioni(L, X, Y);
  C.muovi(0, R1_AVANTI_1.map(([u, s, x]) => [a(76.75) + u, s, x]));
  C.scrivi(0, [[["Ecco", 77.0], ["Come", 77.3], ["Fare", 77.45], ["Ads", 77.75], ["Per", 78.0], ["Brand", 78.2], ["E-Commerce", 78.4]], [["Che", 78.79], ["Fatturano", 79.0], ["30", 79.25], ["Milioni", 79.4], ["O", 79.7], ["Più", 79.9]]].map((r) => r.map(([p, t]) => [p, a(t)])));
  // il copione 1 torna e il 2 viene avanti
  C.muovi(0, R1_INDIETRO_2.map(([u, s, x]) => [a(80.2) + u * 0.6, s, 302.5 + (237.5 * (x - 774.5)) / (540 - 774.5)]));
  tl.to(C.docs[0].d, { filter: "blur(3px)", duration: 0.08 }, a(80.22)); tl.to(C.docs[0].d, { filter: "blur(0px)", duration: 0.2 }, a(80.4)); tl.set(C.docs[0].d, { filter: "none", zIndex: 11 }, a(80.62));
  const av2 = R1_AVANTI_1.map(([u, s, x]) => [a(80.55) + u * 0.75, s, 774.5 - (x - 302.5)]);
  C.muovi(1, av2);
  C.scrivi(1, [[["Ecco", 81.21], ["La", 81.6], ["Migliore", 81.8], ["Strategia", 82.2], ["Ads", 82.5]], [["Per", 82.9], ["Brand", 83.2], ["E-Commerce", 83.5]]].map((r) => r.map(([p, t]) => [p, a(t)])));
  C.muovi(1, R1_INDIETRO_2.map(([u, s, x]) => [a(83.9) + u * 0.8, s, x]));
  C.lampo(1, a(84.65), 0.2, K.lime);
  // i copioni scivolano a sinistra e il pannello arriva in corsa da destra (stesso movimento)
  cpCam.percorso([[84.4, 0, 0], [84.6, -20, 0], [84.75, -60, 0], [84.88, -120, 0]].map(([t, x, y]) => [a(t), x, y]));
  tl.set(C.docs.map((d) => d.d), { opacity: 0 }, a(84.88));
  // nel mondo 309 px più a destra: con lo scorrimento (−120 prima del taglio, −191 dopo) arriva al centro x 745 → 556
  const P = r1Insights(L, X + 309, Y, { clip: o.clip });
  gsap.set(P.g, { opacity: 0 }); tl.set(P.g, { opacity: 1 }, a(84.88));
  cpCam.percorso([[84.88, 0, 0], [85.09, -78, 0], [85.25, -117, 0], [85.45, -150, 0], [85.63, -173, 0], [85.9, -189, 0], [86.3, -191, 0]].map(([t, x, y]) => [a(t), x, y]));
  P.rossaIn(a(85.0), 0.8);
  P.b.conta(a(85.3), a(88.63), 0, 885, (x) => Math.round(x) + "k", "none");
  P.verdeIn(a(86.85), 0.75, "power1.out");
  cpCam.scala([[86.75, 1], [86.9, 1.08], [87.05, 1.22], [87.2, 1.36], [87.3, 1.42], [87.5, 1.46], [88.672, 1.5]].map(([t, k]) => [a(t), k]), [590, 1150]);
  const [gx, gy] = P.centroGrafico();
  COPIA.r01_disco({ t0: a(87.3), X: gx - 30, Y: gy - 60, parent: L }, { r: 80, z: 20 });
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: {}, elementi: { H, C, P } };
};

/* @copia r01_termini · «Termini Più Complessi / Meno Persone Guardano»: il riquadro che si riempie di persone, il disco «Termini
 *   Complessi» che sale; cinque persone escono e gli fanno corona, le altre si spengono; le cinque diventano lime
 *   (reel 1, 93,385–97,931 s)
 * kallaway: reel 1, 93,385 s · taglio: il titolo parola per parola («More Complex Terminology» 93,39–93,7 · «Fewer People Watch»
 *   93,72–94,05 s); un riquadro col bordo bianco sottile (x 138–933, y 397–683) che si riempie di omini bianchi uno dopo l'altro
 *   (21 in 3 righe da 7, 93,39–93,9 s); da sotto sale il disco rosso «Complex Terminology» (centro y ~1145 → 1000 px, frena fino a
 *   94,5 s); 95,2–95,6 s cinque omini della riga in basso escono e si mettono ad arco sopra il disco, gli altri diventano rossi;
 *   97,06 s i cinque diventano verdi
 * misure: omini ~62 px a passo 108 (righe y 445 · 540 · 631); disco r 160; arco a (324, 855) (410, 800) (540, 780) (648, 800) (747, 855)
 * scena: t0 (93,385), t1 (97,931), X, Y, parent
 * colori: il disco rosso → lime con la scritta scura; gli esclusi rossi → grafite spenta (il contrasto rosso/verde: escluso / giusto);
 *   i cinque verdi → lime
 */
COPIA.r01_termini = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(24), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0, t1 = scena.t1, a = (t) => t0 + (t - 93.385);
  const T = r5Titolo({ righe: [[{ t: "Termini Più ", ruolo: "sans", size: 76 }, { t: "Complessi", ruolo: "serif", size: 94 }], [{ t: "Meno Persone Guardano", ruolo: "sans", size: 64 }]], y: 150, interlinea: [86] });
  T.inAt([93.35, 93.5, 93.62, 93.72, 93.86, 94.0].map(a));
  r1Finestra(T.root, t0, t1);
  const [bx, by] = W(138, 397);
  const box = layered(el(L, { position: "absolute", left: bx, top: by, width: 795, height: 286, borderRadius: 4, boxShadow: "inset 0 0 0 2.5px rgba(255,255,255,.85), 0 0 18px rgba(255,255,255,.10)", zIndex: 10 }));
  const omini = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
    const [x, y] = W(216 + 108 * c, 445 + 93 * r);
    const p = r1Omino(L, x, y, { d: 62, col: "#ffffff", z: 12 });
    gsap.set(p, { opacity: 0, scale: 0.6 });
    tl.to(p, { opacity: 1, scale: 1, duration: 0.1, ease: "power2.out" }, a(93.39 + 0.025 * (r * 7 + c)));
    omini.push(p);
  }
  // il disco «Termini Complessi» sale da sotto e frena
  const [dx, dy] = W(540, 1000);
  const disco = layered(el(L, { position: "absolute", left: dx - 160, top: dy - 160, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #e2ff8a 0%, #d3fc5c 45%, #CFFB50 70%, #b9e33f 100%)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.75), 0 0 50px rgba(207,251,80,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 14 }));
  el(disco, { fontFamily: FS, fontWeight: 800, fontSize: 46, color: K.ink, lineHeight: 1 }, "Termini");
  el(disco, { fontFamily: FH, fontSize: 54, color: K.ink, lineHeight: 1.05 }, "Complessi");
  const fd = cpCurva([[93.385, 150], [93.55, 110], [93.72, 70], [93.89, 45], [94.05, 30], [94.22, 18], [94.39, 9], [94.55, 4], [94.8, 0]].map(([t, d]) => [a(t), d])), st = { v: 0 };
  gsap.set(disco, { y: fd(t0) });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 1.42, ease: "none", immediateRender: false, onUpdate: () => gsap.set(disco, { y: fd(t0 + st.v * 1.42) }) }, t0);
  // cinque omini della riga in basso escono e fanno corona sopra il disco; gli altri si spengono
  const arco = [[324, 855], [410, 800], [540, 780], [648, 800], [747, 855]], esce = [14, 16, 17, 18, 20];
  esce.forEach((k, i) => {
    const p = omini[k], [x0, y0] = W(216 + 108 * (k % 7), 445 + 93 * 2), [x1, y1] = W(arco[i][0], arco[i][1]);
    tl.to(p, { x: x1 - x0, y: y1 - y0, scale: 0.85, duration: 0.42, ease: "power2.inOut" }, a(95.18 + 0.03 * i));
    r1ColOmino(p, a(97.06), K.lime, 0.12);
  });
  omini.forEach((p, k) => { if (!esce.includes(k)) tl.to(p, { opacity: 0.32, duration: 0.2, ease: "power1.out" }, a(95.3 + 0.008 * k)); });
  tl.set(L, { opacity: 0 }, t1);
  return { rect: null, pose: null, ancore: {}, elementi: { T, box, omini, disco } };
};
