// ═══ KW kit v2 · COPIA FEDELE · oggetti (O13, O18, O14, O30) — blocco C1, reel 79 di Kallaway ═════════════════════════════

/* @copia O13 · Cervello luminoso (copia del reel 79: 0,9–1,9 s dietro la linea; 7,0–9,9 s in cima all'albero; 12,3–16,4 s sopra il
 *   telefono)
 * kallaway: reel 79, 0,96–1,88 s · cervello bianco a raggi X (visto di lato), largo 267 px (0,25 della larghezza), alla fine della
 *   linea; al «so addictive» il disco F02 si apre dietro di lui (1,21 s); dopo cresce da solo del 13% (1,25–1,65 s) e se ne va in
 *   alto sfumando (1,70–1,88 s) mentre la camera scende sulla griglia
 * misure: larghezza visibile 267 px · crescita ×1,13 in 0,4 s power1.out · uscita in 0,18 s · non cambia colore (resta bianco)
 * quando: «la psicologia», «il cervello», «la dopamina»: il concetto che spiega la cosa vera
 * scena: X, Y (centro, mondo), parent · opzioni: larghezza (267), entra ([t, dur]: sfuma dentro), cresce ([t, dur, k]), esce
 *   ([t, dur]), disco (t del disco F02, con o.discoR), z
 * restituisce: rect, ancore { centro, sotto, sopra, sinistra }, elementi { b, g }
 * colori: il suo cervello bianco resta bianco (cervello a raggi X del kit, Adobe Stock 318556173)
 * chiamata: COPIA.O13({ X: 1430, Y: 975 }, { cresce: [1.25, 0.4, 1.13], esce: [1.70, 0.18], disco: 1.21 });
 */
COPIA.O13 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(12);
  const w = o.larghezza || 267, size = w / 0.926;          // il png ha il cervello sul 92,6% della larghezza
  const b = brain(L, scena.X, scena.Y, size, { z: o.z || 12 });
  COPIA.F01(b.g, { tipo: "oggetto", a: 0.9 });
  if (o.entra) { gsap.set(b.g, { opacity: 0 }); tl.to(b.g, { opacity: 1, duration: o.entra[1], ease: "power1.out" }, o.entra[0]); }
  if (o.cresce) tl.to(b.g, { scale: o.cresce[2], duration: o.cresce[1], ease: "power1.out" }, o.cresce[0]);
  if (o.esce) tl.to(b.g, { opacity: 0, duration: o.esce[1], ease: "power1.in" }, o.esce[0]);
  let disco = null;
  if (o.disco != null) disco = COPIA.F02({ t0: o.disco, X: scena.X, Y: scena.Y + w * 0.03, parent: L }, { r: o.discoR || 385, z: (o.z || 12) - 2 });
  const h = w / 1.18;
  return {
    rect: [scena.X - w / 2, scena.Y - h / 2, scena.X + w / 2, scena.Y + h / 2], pose: null,
    ancore: { centro: [scena.X, scena.Y], sotto: [scena.X, scena.Y + h * 0.48], sopra: [scena.X, scena.Y - h * 0.5], sinistra: [scena.X - w * 0.5, scena.Y] },
    elementi: { b, g: b.g, disco },
  };
};

// il simbolo ∞ di Kallaway (lemniscata a lobi tondi): a = mezza larghezza all'asse del tubo, b = altezza delle maniglie (la curva
// arriva a 0,75 b); si disegna dal centro verso l'alto a SINISTRA (lobo sinistro, poi il destro), come nel reel 79
const cpInfD = (cx, cy, a, b) => `M${cx} ${cy} C${cx - 0.35 * a} ${cy - b} ${cx - a} ${cy - b} ${cx - a} ${cy} C${cx - a} ${cy + b} ${cx - 0.35 * a} ${cy + b} ${cx} ${cy} C${cx + 0.35 * a} ${cy - b} ${cx + a} ${cy - b} ${cx + a} ${cy} C${cx + a} ${cy + b} ${cx + 0.35 * a} ${cy + b} ${cx} ${cy}`;

/* @copia O18 · Tubo al neon che si disegna (il ∞ della dopamina, copia del reel 79, 4,25–6,9 s)
 * kallaway: reel 79, 4,25–5,3 s · sopra la griglia comincia a disegnarsi un tubo al neon con le molecole di dopamina dentro, dal
 *   centro verso l'alto a sinistra: prima il lobo sinistro, poi il destro; la camera sale e lo mette al centro mentre si disegna;
 *   sopra compare il titolo nel mondo («The Dopamine / Addiction Loop», a sinistra); a 6,17 s il titolo diventa grigio e se ne
 *   va, a 6,25–6,38 s compaiono i numeri 1 · 3 (sopra i lobi) e 4 · 2 (sotto)
 * misure: ∞ largo 433 px (0,40 della larghezza) e alto 207 a 5,35 s, centro (538, 843); tubo ~32 px; disegno 0,95 s (4,25 →
 *   5,2 s) lineare (15% a 4,42 · 35% a 4,58 · 55% a 4,75 · 70% a 4,92 · 88% a 5,08); zoom ×1,21 fra 5,65
 *   e 6,65 s attorno al ∞; titolo: riga 1 a 350 px sopra il centro del ∞, 283 px a sinistra, neretto ~78 px; riga 2 corsivo
 * quando: il nome di un ciclo / di un metodo che si ripete (il loop)
 * scena: X, Y (centro del ∞ nel mondo), t0 (inizio del disegno), parent · opzioni: a (200), b (117), w (32), dur (1,05), titolo
 *   (righe di cpTitolo, nel mondo), tempiTitolo, titoloEsce (6,17), numeri (t, 6,25), molecole (true)
 * restituisce: rect, ancore { centro, lobo(i), d }, elementi { np, T, numeri }
 * colori: il suo rosso → il lime del kit (neonPath con le molecole), i numeri bianchi restano bianchi
 */
COPIA.O18 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  // misura (ingombro.py a 5,35 s): Kallaway 0,395 della larghezza × 210 px; con 200/117/32 la copia era 0,428 × 241 → ×0,93
  const k = o.k || 0.93, X = scena.X, Y = scena.Y, a = (o.a || 200) * k, b = (o.b || 117) * k, w = (o.w || 32) * k;
  const d = cpInfD(X, Y, a, b);
  const np = cpNeonK(neonPath(L, d, { w, z: o.z || 9, molecole: o.molecole !== false }));
  np.draw(scena.t0, o.dur || 0.95, o.ease || "none");   // Kallaway: lineare (16% a 4,42 · 35% a 4,58 · 55% a 4,75)
  let T = null;
  if (o.titolo) {
    T = cpTitolo({ righe: o.titolo, x: X - 283, y: Y - 350, align: "left", parent: L, interlinea: o.interlinea || [96], z: 14 });
    T.inAt(o.tempiTitolo || [4.8, 4.98, 5.4, 5.65]);
    if (o.titoloEsce) T.outAt(o.titoloEsce, { grigio: 0.08, dopo: 0.08, via: 0.08 });
  }
  const numeri = [];
  if (o.numeri != null) {
    const pos = [[-124, -144], [111, 124], [117, -144], [-120, 124]];   // 1 sopra a sinistra, 2 sotto a destra, 3 sopra a destra, 4 sotto a sinistra
    pos.forEach(([dx0, dy0], i) => {
      const dx = dx0 * k, dy = dy0 * k;
      const n = layered(el(L, { position: "absolute", left: X + dx - 40, top: Y + dy - 26, width: 80, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: o.fsNumeri || 50, lineHeight: 1.3, color: GREY, textShadow: CP_GLOW_T, zIndex: 15 }, String(i + 1)));
      gsap.set(n, { opacity: 0, filter: "blur(8px)" });
      const tn = o.numeri + [0, 0.04, 0, 0.08][i];
      tl.to(n, { opacity: 1, filter: "blur(0px)", color: K.white, duration: 0.2, ease: "power2.out" }, tn);
      tl.set(n, { filter: "none" }, tn + 0.21);
      numeri.push(n);
    });
  }
  return {
    rect: [X - a - w, Y - 0.75 * b - w, X + a + w, Y + 0.75 * b + w], pose: null,
    ancore: { centro: [X, Y], sopra: [X, Y - 0.75 * b - w / 2], d },
    elementi: { np, T, numeri },
  };
};

/* @copia O14 · Slot machine / casinò (copia del reel 79, 8,6–10,9 s)
 * kallaway: reel 79, 8,6–10,9 s · la slot vera (con l'insegna luminosa in alto e i 7 sui rulli) entra da destra mentre la camera si
 *   allontana; è il secondo ramo dell'albero (cervello → ∞ e slot); la camera ci va sopra (K03) e i rulli girano, poi si riparte
 * misure: a 10,2 s centro (545, 891), alta 454 px (0,42 dell'altezza utile), larga 269 con la leva; a 9,0 s alta 183 px a destra
 *   del ∞ (centro x 807), poi cresce da sola ×1,7 fra 9,35 e 9,62 s attorno al piede (a 9,6 s alta 317, centro x 700) mentre la
 *   camera è ferma; rulli che girano ~0,7 s (9,95 → 10,65 s) e si fermano sui 7
 * quando: «come nei casinò», la ricompensa variabile, il gioco d'azzardo
 * scena: X, Y (centro, mondo), h (altezza, mondo), parent · opzioni: gira ([t, dur]), simboli, z
 * restituisce: rect, ancore { sopra, centro }, elementi { slot }
 * colori: la sua slot cromata → la slot grafite del kit (Adobe Stock 730774093) con i 7 sui rulli e il pomo lime
 */
COPIA.O14 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const sym = o.simboli || [["7", "cherry", "bell", "gem", "star", "crown"], ["gem", "7", "star", "cherry", "crown", "bell"], ["bell", "crown", "7", "gem", "cherry", "star"]];
  const sl = slotMachine(L, scena.X, scena.Y, scena.h, { reels: sym, start: [0, 1, 2], z: o.z || 10 });
  if (o.gira) sl.spin(o.gira[0], [0, 1, 2], { dur: o.gira[1] * 0.62, stagger: o.gira[1] * 0.12, giri: 3, luci: true });
  // Kallaway: la slot entra piccola e cresce da sola (×1,7 fra 9,35 e 9,62 s) attorno al suo piede, verso sinistra
  if (o.cresce) { gsap.set(sl.g, { scale: 1 / o.cresce[2], transformOrigin: o.origine || "97% 100%" }); tl.to(sl.g, { scale: 1, duration: o.cresce[1], ease: "power2.out" }, o.cresce[0]); }
  return { rect: sl.rect, pose: null, ancore: { sopra: [scena.X - sl.W * 0.05, scena.Y - scena.h / 2], centro: [scena.X, scena.Y] }, elementi: { slot: sl } };
};

/* @copia O30 · Bivio: la strada si divide in due rami luminosi (copia del reel 79, «The Headfake», 53,85–67,86 s)
 * kallaway: reel 79, 53,85–67,86 s · taglio, titolo «The Headfake» nell'HUD; due strade partono dal basso e si disegnano in 0,3 s:
 *   a sinistra quella che tutti si aspettano (la riga di mezzeria a tratti bianchi + il bordo tratteggiato, piega a sinistra in
 *   alto), a destra una linea sola che piega a destra (la finta); su «contrast» (54,7 s) la finta si accende di verde; 57,6–58,2 s
 *   la camera si allontana (×0,85 attorno a un punto in basso a sinistra), la strada attesa si assottiglia e si spegne; compare la
 *   pallina con i fari in basso al centro: i fari puntano la strada A (59,0 s, «assume A» → la «A» a 60,45 s), poi su «snap the
 *   story» (60,9–61,3 s) girano verso la finta («B» a 63,0 s); a 65,0 s il titolo diventa «Art of Contrast» con la linea d'accento
 * misure (vista larga, da 58,2 s): finta da (910, 1400) all'angolo (590, 790) e alla fine (985, 684); strada attesa da (90, 1330)
 *   a (410, 830) e a sinistra fino a (225, 698); pallina Ø 50 a (540, 1084), fascio lungo ~330 px e aperto ~55°; «A» (327, 623),
 *   «B» (793, 623) ~62 px; titolo y 300 ~72 px · disegno 53,85 → 54,15 s · zoom ×0,85 in 0,6 s attorno a (363, 1848)
 * quando: «la finta»: il pubblico si aspetta una strada e la storia ne prende un'altra; due possibilità, la scelta inattesa
 * scena: t0, t1, X, Y (centro della camera a riposo nella vista larga, mondo), parent · opzioni: titoli (["La Finta", ["L'arte del",
 *   "Contrasto"]]), etichette (["A", "B"]), tempi { disegno, accende, largo, pallina, faroA, A, giro, B, titolo2 }
 * restituisce: elementi { S, pallina, fascio }
 * colori: il suo verde della finta → il lime; strada attesa bianca; la sua linea rossa sotto il titolo → lime
 */
COPIA.O30 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const tm = Object.assign({ disegno: 53.85, accende: 54.7, largo: 57.6, pallina: 57.8, faroA: 59.0, A: 60.45, giro: 60.9, B: 63.0, titolo2: 65.0 }, o.tempi || {});
  const P = (pts) => pts.map(([x, y]) => W(x, y).map((v) => v.toFixed(1)).join(" "));
  const S = svgLayer(L, 10, X - 900, Y - 1300, 1800, 2400);
  // la finta (B): linea sola, bianca, poi lime al neon
  const dB = (() => { const q = P([[910, 1400], [870, 1150], [585, 960], [588, 800], [590, 730], [720, 686], [985, 684]]); return `M${q[0]} C${q[1]} ${q[2]} ${q[3]} C${q[4]} ${q[5]} ${q[6]}`; })();
  const bGlow = pathEl(S, dB, { fill: "none", stroke: K.lime, "stroke-width": 26, "stroke-linecap": "round", opacity: 0 });
  bGlow.style.filter = "blur(10px)";
  const bCore = pathEl(S, dB, { fill: "none", stroke: "#ffffff", "stroke-width": 7, "stroke-linecap": "round" });
  bCore.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.8))";
  // la strada attesa (A): mezzeria a tratti larghi + bordo a tratti sottili
  const dA = (() => { const q = P([[90, 1330], [260, 1150], [420, 960], [410, 830], [400, 760], [300, 710], [225, 698]]); return `M${q[0]} C${q[1]} ${q[2]} ${q[3]} C${q[4]} ${q[5]} ${q[6]}`; })();
  const dA2 = (() => { const q = P([[20, 1300], [190, 1120], [340, 950], [340, 830], [340, 770], [270, 728], [205, 716]]); return `M${q[0]} C${q[1]} ${q[2]} ${q[3]} C${q[4]} ${q[5]} ${q[6]}`; })();
  const aMid = pathEl(S, dA, { fill: "none", stroke: "#ffffff", "stroke-width": 9, "stroke-linecap": "butt", "stroke-dasharray": "34 26", opacity: 0.95 });
  const aEdge = pathEl(S, dA2, { fill: "none", stroke: "rgba(255,255,255,.75)", "stroke-width": 3, "stroke-dasharray": "8 10" });
  [aMid, aEdge].forEach((p) => { p.style.filter = "drop-shadow(0 0 5px rgba(255,255,255,.7))"; });
  // si disegnano dal basso (maschera che scopre il tracciato): 0,3 s
  const scopri = (p, d, t, dur) => {
    const mid = "o30m" + ++SVGN, m = document.createElementNS(NS, "mask");
    m.setAttribute("id", mid); m.setAttribute("maskUnits", "userSpaceOnUse");
    ["x", "y"].forEach((k) => m.setAttribute(k, "-60000")); ["width", "height"].forEach((k) => m.setAttribute(k, "200000"));
    const mp = document.createElementNS(NS, "path");
    mp.setAttribute("d", d); mp.setAttribute("fill", "none"); mp.setAttribute("stroke", "#fff"); mp.setAttribute("stroke-width", 60); mp.setAttribute("stroke-linecap", "round");
    m.appendChild(mp); S._defs.appendChild(m);
    const Lm = drawable(mp);
    p.setAttribute("mask", `url(#${mid})`);
    tl.to(mp, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "power1.out" }, t);
    return Lm;
  };
  [[bCore, dB], [bGlow, dB], [aMid, dA], [aEdge, dA2]].forEach(([p, d]) => scopri(p, d, tm.disegno, 0.3));
  // la finta si accende (54,7 s): neon lime
  tl.to(bGlow, { attr: { opacity: 0.85 }, duration: 0.3 }, tm.accende);
  tl.to(bCore, { attr: { stroke: "#efffc2", "stroke-width": 8 }, duration: 0.3 }, tm.accende);
  // vista larga (57,6–58,2 s): la strada attesa si assottiglia e si spegne
  tl.to(aMid, { attr: { "stroke-width": 3.5, opacity: 0.45 }, duration: 0.6, ease: "power2.inOut" }, tm.largo);
  tl.to(aEdge, { attr: { opacity: 0 }, duration: 0.4 }, tm.largo);
  tl.to(bCore, { attr: { "stroke-width": 5 }, duration: 0.6 }, tm.largo);
  tl.to(bGlow, { attr: { "stroke-width": 18 }, duration: 0.6 }, tm.largo);
  // la pallina coi fari
  const [px, py] = W(540, 1084);
  const pallina = layered(el(L, { position: "absolute", left: px, top: py, width: 1, height: 1, zIndex: 14 }));
  const fascio = el(pallina, { position: "absolute", left: 0, top: -90, width: 340, height: 180, transformOrigin: "0 50%", background: "linear-gradient(90deg, rgba(255,255,255,.85), rgba(255,255,255,.35) 55%, rgba(255,255,255,0))", clipPath: "polygon(0 46%, 100% 0, 100% 100%, 0 54%)", filter: "blur(4px)", opacity: 0 });
  el(pallina, { position: "absolute", left: -25, top: -25, width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #f4f4f4 55%, #d8d8d8)", boxShadow: "0 0 18px #fff, 0 0 46px rgba(255,255,255,.6)" });
  gsap.set(pallina, { opacity: 0 });
  tl.set(pallina, { opacity: 1 }, tm.disegno);
  tl.set(pallina, { opacity: 0 }, tm.disegno + 0.1);
  tl.to(pallina, { opacity: 1, duration: 0.15 }, tm.pallina);
  gsap.set(fascio, { rotation: -124 });
  tl.to(fascio, { opacity: 1, duration: 0.25 }, tm.faroA);
  tl.to(fascio, { rotation: -51, duration: 0.4, ease: "power2.inOut" }, tm.giro);
  // A e B
  const et = o.etichette || ["A", "B"];
  [[327, 623, et[0], tm.A], [793, 623, et[1], tm.B]].forEach(([sx, sy, tx, t]) => {
    const [ex, ey] = W(sx, sy);
    const e = layered(el(L, { position: "absolute", left: ex - 60, top: ey - 36, width: 120, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: 64, lineHeight: 1, color: GREY, textShadow: CP_GLOW_T, zIndex: 15 }, tx));
    gsap.set(e, { opacity: 0, filter: "blur(8px)" });
    tl.to(e, { opacity: 1, filter: "blur(0px)", color: K.white, duration: 0.2, ease: "power2.out" }, t);
    tl.set(e, { filter: "none" }, t + 0.21);
  });
  // titoli nell'HUD: «La Finta», poi «L'arte del Contrasto» con la linea d'accento
  const ti = o.titoli || ["La Finta", ["L'arte del ", "Contrasto"]];
  const T1 = cpTitolo({ righe: [[{ t: ti[0], ruolo: "sans", size: 74, unita: true }]], x: 540, y: 262, parent: hud });
  T1.inAt([tm.disegno]);
  T1.outAt(tm.titolo2 - 0.12, { grigio: 0.04, dopo: 0.04, via: 0.06 });
  const T2 = cpTitolo({ righe: [[{ t: ti[1][0], ruolo: "sans", size: 64, unita: true }, { t: ti[1][1], ruolo: "serif", size: 84, unita: true }]], x: 540, y: 262, parent: hud, sottolinea: { riga: 0, y: 78, h: 5 } });
  T2.inAt([tm.titolo2, tm.titolo2 + 0.06]);
  T2.sottolinea(tm.titolo2 + 0.05, null, null, 0.7, "power1.out");
  T2.outAt(scena.t1 - 0.06, { grigio: 0.02, dopo: 0.01, via: 0.02 });
  return { rect: null, pose: null, ancore: {}, elementi: { S, pallina, fascio, T1, T2 } };
};
