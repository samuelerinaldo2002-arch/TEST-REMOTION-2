// ═══ KW kit v2 · COPIA FEDELE · oggetti del blocco C2 (reel 5 di Kallaway) — O21 · O28 ══════════════════════════════════════

/* @copia O21 · Anelli orbitali di persone (copia del reel 5, 16,29–18,54 s; ritorna a 108,7–110,0 s)
 * kallaway: reel 5, 16,29 s · su «the algorithm will bring you…» un cerchio tratteggiato sottile si disegna attorno al reel che
 *   è tornato al centro (in senso orario dall'alto, 0,6 s), dentro un disco rosso scurissimo; a 16,96 s compaiono a gruppi
 *   ~36 persone (icone tonde bianche con la sagoma scura) in due anelli larghi; su «wrong viewer» (17,62–17,96 s) diventano
 *   rosse a onda; intanto la camera si allontana (raggio del cerchio 400 → 346 px fra 17,1 e 18,5 s)
 * misure: cerchio Ø 800 px attorno al reel (centro 544, 841), icone Ø 30 px fra r 210 e 375, comparsa 16,96–17,12 s (0,16 s,
 *   a gruppi), colore 17,62 → 17,96 s dall'alto in senso orario; secondo uso (scena 23) verdi da subito, attorno al documento
 * quando: pubblico, chi ti segue, chi arriva (giusto o sbagliato)
 * scena: X, Y (centro, mondo), parent · opzioni: r (400), n (36), disegno ([t, dur]), compare ([t, dur]), colore ([t, dur]: il
 *   cambio a onda; null = niente), colIniziale ("#fff" | lime), alone (rgba del disco dentro, null = niente), cerchio (false =
 *   senza il cerchio tratteggiato, come in scena 23)
 * restituisce: elementi { S, cerchio, persone }
 * colori: il suo rosso (le persone sbagliate) → lime; il suo verde (scena 23) → lime; il disco dentro grafite tinto di lime
 * chiamata: COPIA.O21({ X: cx, Y: cy, parent: L }, { disegno: [16.29, 0.6], compare: [16.96, 0.16], colore: [17.62, 0.34] });
 */
COPIA.O21 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(12), cx = scena.X, cy = scena.Y, R = o.r || 400, n = o.n || 36;
  let disco = null;
  if (o.alone !== null) {
    disco = layered(el(L, { position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: `radial-gradient(circle, rgba(207,251,80,0) 30%, ${o.alone || "rgba(207,251,80,.07)"} 82%, rgba(207,251,80,0) 100%)`, opacity: 0, zIndex: 1 }));
  }
  const S = svgLayer(L, 3, cx - R - 20, cy - R - 20, 2 * R + 40, 2 * R + 40);
  const c = document.createElementNS(NS, "circle");
  c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", R);
  c.setAttribute("fill", "none"); c.setAttribute("stroke", "rgba(255,255,255,.75)"); c.setAttribute("stroke-width", 2.5);
  c.setAttribute("stroke-dasharray", "7 9"); c.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
  S.appendChild(c);
  // il tratteggio si scopre in senso orario con una maschera (cerchio pieno col dashoffset)
  const mid = "o21m" + ++SVGN, m = document.createElementNS(NS, "mask");
  m.setAttribute("id", mid); m.setAttribute("maskUnits", "userSpaceOnUse");
  ["x", "y"].forEach((k) => m.setAttribute(k, "-60000")); ["width", "height"].forEach((k) => m.setAttribute(k, "200000"));
  const mc = document.createElementNS(NS, "circle");
  mc.setAttribute("cx", cx); mc.setAttribute("cy", cy); mc.setAttribute("r", R); mc.setAttribute("fill", "none"); mc.setAttribute("stroke", "#fff"); mc.setAttribute("stroke-width", 14);
  mc.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
  m.appendChild(mc); S._defs.appendChild(m);
  const LC = 2 * Math.PI * R;
  mc.setAttribute("stroke-dasharray", `${LC} ${LC}`); mc.setAttribute("stroke-dashoffset", LC);
  c.setAttribute("mask", `url(#${mid})`);
  if (o.cerchio === false) c.setAttribute("opacity", 0);
  const dis = o.disegno || [scena.t0 || 0, 0.6];
  if (o.disegno === null) mc.setAttribute("stroke-dashoffset", 0);
  else tl.to(mc, { attr: { "stroke-dashoffset": 0 }, duration: dis[1], ease: "power1.inOut" }, dis[0]);
  if (disco) { if (o.disegno === null) gsap.set(disco, { opacity: 1 }); else tl.to(disco, { opacity: 1, duration: dis[1] }, dis[0]); }
  // le persone: due anelli larghi, posizioni fisse pseudo-casuali (Kallaway: sparse, non in fila)
  const col0 = o.colIniziale || "#ffffff", d = o.d || 30, persone = [];
  for (let k = 0; k < n; k++) {
    const est = k % 5 < 3;                                          // 3 su 5 nell'anello esterno
    const a = (k / n) * Math.PI * 2 + hash(k, 3) * 0.12 - Math.PI / 2;
    const r = R * (est ? 0.86 + 0.06 * hash(k, 7) : 0.6 + 0.08 * hash(k, 11));
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    const p = layered(el(L, { position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: col0, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", boxShadow: "0 0 8px rgba(255,255,255,.35)", zIndex: 6 }, svg("user-round", Math.round(d * 0.8), K.ink, 2.4, K.ink)));
    p._a = Math.atan2(y - cy, x - cx);
    persone.push(p);
  }
  const cmp = o.compare || [dis[0] + 0.67, 0.16];
  if (o.compare === null) gsap.set(persone, { opacity: 1 });
  else {
    gsap.set(persone, { opacity: 0, scale: 0.4 });
    persone.forEach((p, k) => tl.to(p, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, cmp[0] + cmp[1] * ((k * 7) % n) / n));
  }
  if (o.colore) {
    // a onda dall'alto in senso orario
    persone.forEach((p) => {
      const u = ((p._a + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI);
      tl.to(p, { backgroundColor: K.lime, boxShadow: R5.glowL(0.6), duration: 0.12 }, o.colore[0] + o.colore[1] * u);
    });
  }
  return { rect: [cx - R, cy - R, cx + R, cy + R], pose: null, ancore: { centro: [cx, cy] }, elementi: { S, cerchio: c, persone, disco } };
};

/* @copia O28 · Blocchi che si impilano (i pezzi) (copia del reel 5, 94,375–97,0 s: «Ideas · Methods · Frameworks»)
 * kallaway: reel 5, 94,375 s · sotto il titolo fisso, su «ideas» al taglio c'è già la prima pillola rossa piena (scritta bianca
 *   neretta) con un disco rosso che pulsa dietro; su «methods» (95,0 s) la seconda cade sotto, un po' spostata a destra, col suo
 *   disco, e le due si riallineano (95,2–95,6 s); su «frameworks» (95,85 s) la terza; restano impilate un filo sfalsate e poi si
 *   allineano (96,6 s): una torre di tre pezzi uguali
 * misure: pillole 405×74 px, passo 95; «Ideas» a (607, 683) → (535, 683); «Methods» a (641, 778) → (551, 778); «Frameworks» a
 *   (605, 873) → (590, 873) → tutte a ~553 (96,6 s); dischi r 45 → 194 px in 0,35 s, spenti in ~0,6 s
 * quando: i pezzi di un sistema (idee, metodi, framework; i componenti di un profilo)
 * scena: t0 (il taglio), X, Y (centro, mondo), parent · opzioni: voci (3 testi), tempi ([t1, t2, t3]), allinea (t)
 * restituisce: elementi { pezzi }
 * colori: il suo rosso pieno → lime pieno con la scritta scura; dischi lime
 * chiamata: COPIA.O28({ t0: 94.375, X, Y, parent: L }, { voci: ["Idee", "Metodi", "Framework"] });
 */
COPIA.O28 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(12), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const voci = o.voci || ["Idee", "Metodi", "Framework"], tt = o.tempi || [scena.t0, 95.0, 95.85];
  const pos = [[607, 683], [641, 778], [605, 873]], fin = [[535, 683], [551, 778], [590, 873]];
  const pezzi = voci.map((v, i) => {
    const [x, y] = W(pos[i][0], pos[i][1]);
    const p = layered(el(L, { position: "absolute", left: x - 202, top: y - 37, width: 405, height: 74, borderRadius: 8, background: limeFill(1), boxShadow: `${R5.glowL(0.45)}, 0 10px 26px rgba(0,0,0,.45)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 800, fontSize: 50, color: K.ink, letterSpacing: "-0.01em", zIndex: 14 + i }, v));
    r5Pulse(L, x, y, tt[i] + (i === 0 ? 0.04 : 0), { r0: 45, r1: 194, dur: 0.35, a: 0.5, tiene: 0.25, via: 0.45, z: 12 });
    if (i === 0 && tt[0] <= scena.t0 + 0.01) gsap.set(p, { opacity: 1 });
    else { gsap.set(p, { opacity: 0, y: -40 }); tl.to(p, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, tt[i]); }
    return p;
  });
  // si riallineano: le prime due dopo la seconda (95,2–95,6 s), tutte alla fine (96,6 s)
  tl.to(pezzi[0], { x: 547 - pos[0][0], duration: 0.3, ease: "power2.out" }, tt[1] - 0.05);
  tl.to(pezzi[0], { x: fin[0][0] - pos[0][0], duration: 0.4, ease: "power2.inOut" }, tt[1] + 0.25);
  tl.to(pezzi[1], { x: fin[1][0] - pos[1][0], duration: 0.4, ease: "power2.inOut" }, tt[1] + 0.2);
  tl.to(pezzi[2], { x: fin[2][0] - pos[2][0], duration: 0.15, ease: "power2.out" }, tt[2] + 0.1);
  const al = o.allinea || 96.15;
  pezzi.forEach((p, i) => tl.to(p, { x: 553 - pos[i][0], duration: 0.35, ease: "power2.inOut" }, al));
  return { rect: null, pose: null, ancore: { centro: W(553, 778) }, elementi: { pezzi } };
};
