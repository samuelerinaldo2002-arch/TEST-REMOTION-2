// ═══ KW kit v2 · TEMPLATE · luce, glow ed enfasi (F) — blocco 1 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═══════════
// Stesso standard di kit2-template.js. Scene di prova in CATALOGO-ANIMAZIONI/ritmo-01 (KW_RITMO).

/* @scheda F08 · Cambio di colore = cambio di stato (chi guarda si spegne, o si accende)
 * quando: giusto/sbagliato, chi resta/chi se ne va, capisce/non capisce, prima/dopo: lo stesso gruppo cambia stato tutto
 *   insieme ("secco", 1 fotogramma) o a onda (0,5 s); qui attorno al profilo, con la pill dell'algoritmo sopra
 * frase: «In questo modo l'algoritmo non capisce di cosa parla il tuo profilo e nemmeno chi ti guarda.» (01/10, 7,8–12,3 s)
 * durata: 3–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1, X, Y (centro del telefono), parole: { algoritmo (la pill cambia stato, secco: es. «non»),
 *   profilo (riquadro sulla griglia, es. «profilo»), persone (l'onda sulle persone, es. «nemmeno»), titolo ([…]) }
 * opzioni: titolo, profilo ({ handle, nome, bio: [righe], grid: [6 id video], user (foto, facoltativa) }), algoritmo (testo della
 *   pill, "<Algoritmo/>"; false = niente pill), persone (quante, 10: persone qualunque di profilo, mai volti veri), verso
 *   ("spento" default: da accese a spente | "acceso": da spente ad accese), modo ("onda" default | "secco"), k (scala del
 *   telefono, 0.66), ingresso ("arrivo" default | "zoom" | "nessuno"), fermo (R7, default true)
 * restituisce: rect, pose, ancore { telefono, pill, persona(i) }, elementi { tel, pill, persone, L }, tempi { taglio,
 *   algoritmo, profilo, persone }
 * suoni: whoosh .14 al taglio · glitch .1 su «algoritmo» (secco) · tick .05 su «profilo» · drop .12 sull'onda
 * regole: R2 telefono, pill e persone già in scena al taglio · R2 arrivo dal basso 140 px expo.out 0,7 s · R3 tre accenti
 *   sulle parole: la pill cambia stato di colpo (reel 88: in 1 fotogramma), il riquadro sulla griglia, le persone a onda
 *   (reel 13: ~0,5 s, dalla cima in giù) · R5 niente rimbalzi · R7 sfondo fermo
 * prima: (demo-7 6,9–9,1 s) cambio di stato a onda con filter + borderColor in 0,3 s su volti veri (faceDot), dopo la
 *   costruzione della scena
 * chiamata:
 *   TPL.F08({ t0: 8.75, t1: 13.75, X: 5000, Y: 900, parole: { algoritmo: 10.17, profilo: 11.5, persone: 12.37,
 *     titolo: [9.63, 10.17, 10.33, 11.87, 12.37, 12.73, 12.87, 12.97] } }, {
 *     titolo: [[{ t: "L'algoritmo " }, { t: "non capisce", box: true }], [{ t: "e nemmeno chi ti guarda", hand: true }]],
 *     profilo: { handle: "il.tuo.profilo", nome: "Il tuo profilo", bio: ["Fitness · viaggi · cucina · gatti"],
 *       grid: ["g1", "g2", "g3", "g4", "g5", "g6"] } });
 */
TPL.F08 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const k = o.k || 0.66, pw = PH.w * k, ph = PH.h * k;
  const px0 = X - pw / 2, py0 = Y - ph / 2;
  // il telefono col profilo (scalato in un contenitore): la griglia mescolata dice «di cosa parla il tuo profilo»
  const hold = layered(el(L, { position: "absolute", left: px0, top: py0, width: PH.w, height: PH.h, transformOrigin: "0 0", zIndex: 12 }));
  gsap.set(hold, { scale: k });
  const pr = o.profilo || {};
  const tel = igProfile(hold, 0, 0, Object.assign({ post: "41", follower: "212", seguiti: "380" }, pr));
  // la pill dell'algoritmo sopra il telefono, con due linee che scendono al profilo
  let pill = null, qm = null;
  const yP = py0 - 100;
  if (o.algoritmo !== false) {
    pill = algoPill(L, X, yP, { testo: o.algoritmo || "<Algoritmo/>", fs: 38, z: 20 });
    pill.tx.textContent = o.algoritmo || "<Algoritmo/>"; // senza decode() l'innerHTML "<Algoritmo/>" diventerebbe un tag vuoto
    const S = svgLayer(L, 6, X - 2000, Y - 2000, 4000, 4000);
    [-1, 1].forEach((s) => { const c = connector(S, [[X + s * 60, yP + pill.h / 2], [X + s * 90, py0 + 4]], { w: 2.5, color: "rgba(207,251,80,.55)" }); c.p.setAttribute("stroke-dashoffset", 0); });
    qm = handNote(L, X + pill.w / 2 + 16, yP - 62, "?", { size: 110, rot: 8, z: 22 });
  }
  // chi guarda: persone qualunque di profilo (sagoma sul disco), ai due lati del telefono (cima e fondo liberi: la pill sopra)
  const nP = o.persone || 10, d = o.d || 116, rx = pw / 2 + 250, ry = ph / 2 + 20;
  const ang = []; for (let i = 0; i < nP; i++) { const half = Math.ceil(nP / 2), j = i % half, side = i < half ? 1 : -1; const a = -45 + (j * 100) / Math.max(1, half - 1); ang.push(side > 0 ? a : 180 - a); }
  const acceso = o.verso !== "acceso"; // stato iniziale: acceso se si spengono
  const persone = ang.map((a, i) => {
    const r = (a * Math.PI) / 180, cx = X + rx * Math.cos(r), cy = Y + 30 + ry * Math.sin(r);
    const g = layered(el(L, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: "50%", zIndex: 14 }));
    personaK(g, 0, 0, d, { z: 1 });
    const ring = el(g, { position: "absolute", left: -6, top: -6, width: d + 12, height: d + 12, borderRadius: "50%", border: `4px solid ${acceso ? K.lime : "rgba(255,255,255,.25)"}`, boxShadow: acceso ? GLOW_A(0.6) : "none", zIndex: 2 });
    if (!acceso) gsap.set(g, { filter: "grayscale(1) brightness(.5)" });
    return { g, ring, cx, cy };
  });
  // 1) prima del taglio: tutto c'è già (R2); la pill è accesa senza la decodifica (non si ripete T05)
  if (pill) tplMonta(t0, (t) => tl.set(pill.g, { opacity: 1 }, t), () => gsap.set(pill.g, { opacity: 1 }));
  // 2) accento 1: la pill cambia stato di colpo (secco, 1 fotogramma) e compare il punto di domanda
  const ta = P.algoritmo == null ? t0 + 0.9 : P.algoritmo;
  if (pill) {
    tl.set(pill.box, { borderColor: "#7d7d7d", boxShadow: "0 18px 40px rgba(0,0,0,.6)", background: "linear-gradient(180deg, rgba(48,48,48,.96), rgba(26,26,26,.98))" }, ta);
    tl.set(pill.tx, { color: "#9a9a9a", textShadow: "none" }, ta);
    qm.write(ta + 0.05, 0.12);
  }
  // 3) accento 2: il riquadro lime sulla griglia (di cosa parla il profilo: di tutto)
  const tp = P.profilo == null ? ta + 1.0 : P.profilo;
  tel.hl(tp, "griglia", { bw: 6 });
  // 4) accento 3: le persone cambiano stato a onda dalla cima in giù (reel 13: ~0,5 s) oppure tutte insieme (secco)
  const tw = P.persone == null ? tp + 1.0 : P.persone;
  const ord = persone.map((p, i) => [p.cy, i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const passo = o.modo === "secco" ? 0 : 0.5 / Math.max(1, nP - 1);
  ord.forEach((i, j) => {
    const p = persone[i], t = tw + j * passo, du = o.modo === "secco" ? 0.03 : 0.25;
    if (acceso) {
      // fromTo (regia 15/10): da "none" GSAP partirebbe da brightness(0) e ogni persona faceva un fotogramma nero
      tl.fromTo(p.g, { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(1) brightness(.45)", duration: du, ease: "power2.out", immediateRender: false }, t);
      tl.to(p.ring, { borderColor: "rgba(255,255,255,.22)", boxShadow: "0 0 0px rgba(207,251,80,0)", duration: du }, t);
    } else {
      tl.to(p.g, { filter: "grayscale(0) brightness(1)", duration: du, ease: "power2.out" }, t);
      tl.to(p.ring, { borderColor: K.lime, boxShadow: GLOW_A(0.6), duration: du }, t);
    }
  });
  // 5) la camera: arrivo che frena, poi tiene (R2, R3)
  const rect = [X - rx - d / 2 - 10, (pill ? yP - 72 : py0) - 10, X + rx + d / 2 + 10, Math.max(py0 + ph, Y + 30 + ry * Math.sin(0.96)) + d / 2 + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { telefono: [X, Y], pill: [X, yP], persona: (i) => [persone[i].cx, persone[i].cy] },
    elementi: { tel, pill, persone, titolo: T, L },
    tempi: { taglio: t0, algoritmo: ta, profilo: tp, persone: tw },
  };
};

// ═══ blocco 2 del rifacimento (ritmo-02) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda F02 · Pulse a disco pieno (la parola chiave fa nascere l'etichetta)
 * quando: la parola chiave del concetto ("virale", "il livello normale", "non ovvio"): un disco lime pieno nasce dal centro
 *   dell'oggetto, si allarga e svanisce, e dal disco nasce l'etichetta che dà il nome alla cosa; con dubbio l'etichetta si
 *   spegne e compare il punto di domanda ("e se si sbagliassero?")
 * frase: «Se non diventi virale, non stai andando da nessuna parte. E se si sbagliassero?» (14/10, 1,4–6,1 s)
 * durata: 3–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1, X, Y (centro dell'oggetto e del disco), parole: { parola (disco + etichetta, es. «virale»),
 *   dubbio (l'etichetta si spegne e compare «?», es. «sbagliassero?»), titolo ([tempo per parola]) }
 * opzioni: titolo, media ([6 id dei tuoi reel] → griglia 3 × 2 di reel veri in movimento) oppure oggetto (id di un'immagine
 *   del pool, "obj-…", con oggettoW), etichetta ({ testo, icona: "eye" }), dubbio (true: «?» a mano accanto all'etichetta),
 *   disco (diametro sullo schermo in frazione della larghezza, 0.56 come Kallaway), ingresso ("arrivo" default | "zoom" |
 *   "nessuno"), fermo (R7, default true)
 * restituisce: rect, pose, ancore { centro, etichetta, cella(i) }, elementi { celle, disco, etichetta, nota, L }, tempi {
 *   taglio, parola, dubbio }
 * suoni: whoosh .14 al taglio · pop .12 su «parola» · glitch .08 su «dubbio»
 * regole: R2 griglia (o oggetto) già piena al taglio, arrivo dal basso 140 px expo.out 0,7 s, poi la camera tiene · F02 come
 *   Kallaway (reel 14, 7, 79): il disco davanti all'oggetto, semitrasparente, arriva pieno (diametro ~0,55 della larghezza)
 *   in 0,15 s e svanisce allargandosi del 20% in 0,3 s; l'etichetta nasce nel disco (popK 0,8 → 1 in 0,15 s, niente
 *   rimbalzo) e resta · R3 al massimo due accenti (disco + etichetta, poi il dubbio) · R5 · R7 sfondo fermo
 * prima: (demo 2,6 s · demo-2 21,2 s · reel-09 4,1 s) pulse() dietro gli oggetti, 0,22 s + 0,5 s a scala 1,13; non faceva
 *   nascere niente e spesso arrivava dopo la costruzione della scena
 * chiamata:
 *   TPL.F02({ t0: 1.0, t1: 6.1, X: 600, Y: 900, parole: { parola: 1.98, dubbio: 5.25,
 *     titolo: [1.12, 1.42, 1.55, 1.98, 4.38, 4.98, 5.12, 5.25] } }, {
 *     titolo: [[{ t: "Se non diventi " }, { t: "virale", box: true }], [{ t: "e se si sbagliassero?", hand: true }]],
 *     media: ["m1", "m2", "m3", "m4", "m5", "m6"], etichetta: { testo: "1M views", icona: "eye" }, dubbio: true });
 */
TPL.F02 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  // l'oggetto: la griglia dei tuoi reel (3 × 2, card 9:16 vere in movimento) oppure un'immagine del pool
  const celle = [];
  let ow, oh;
  if (o.media && o.media.length) {
    const n = o.media.length, cols = n >= 6 ? 3 : n, rows = Math.ceil(n / cols);
    const cw = o.cw || 300, ch = Math.round((cw * 16) / 9), g = o.gap || 26;
    ow = cols * cw + (cols - 1) * g; oh = rows * ch + (rows - 1) * g;
    o.media.forEach((id, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const x = X - ow / 2 + c * (cw + g), y = Y - oh / 2 + r * (ch + g);
      const card = layered(el(L, { position: "absolute", left: x, top: y, width: cw, height: ch, borderRadius: Math.round(cw * 0.07), overflow: "hidden", border: "2.5px solid rgba(255,255,255,.22)", boxShadow: "0 30px 70px rgba(0,0,0,.6)", background: "#111", zIndex: 12 }));
      mediaTile(card, 0, 0, cw, ch, id, 1);
      celle.push({ card, cx: x + cw / 2, cy: y + ch / 2 });
    });
  } else if (o.oggetto) {
    ow = o.oggettoW || 620; oh = o.oggettoH || ow;
    const g = layered(el(L, { position: "absolute", left: X - ow / 2, top: Y - oh / 2, width: ow, height: oh, zIndex: 12 }));
    imgIn(g, o.oggetto);
    celle.push({ card: g, cx: X, cy: Y });
  } else { ow = oh = 600; }
  // la posa (serve per il diametro del disco sullo schermo)
  const lab = o.etichetta || { testo: "1M views", icona: "eye" };
  // proporzioni di Kallaway (reel 14: l'anello largo 0,68 della larghezza, alto da sotto il titolo alla faccia): rettangolo
  // stretto sull'oggetto e fill 0,98 → la griglia 3 × 2 larga ~0,70
  const rect = [X - ow / 2 - 8, Y - oh / 2 - 8, X + ow / 2 + 8, Y + oh / 2 + 8];
  const FILL = o.fill || 0.98;
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: FILL });
  // 1) prima del taglio: tutto c'è già (R2)
  gsap.set(celle.map((c) => c.card), { opacity: 0 });
  tplMonta(t0, (t) => tl.to(celle.map((c) => c.card), { opacity: 1, duration: 0.2 }, t), () => gsap.set(celle.map((c) => c.card), { opacity: 1 }));
  // 2) accento 1: il disco pieno davanti al centro (Kallaway: pieno in 0,15 s, poi +20% e svanisce in 0,3 s) e l'etichetta
  //    che nasce dentro il disco
  const tp = P.parola == null ? t0 + 0.9 : P.parola;
  const R = ((o.disco || 0.56) * 1080) / 2 / pose.s;
  const disco = pulse(L, X, Y, tp, { r: R, z: 30, a: o.discoA == null ? 0.82 : o.discoA, cresce: 0.15, svanisce: 0.32, allarga: 1.2 });
  const fs = o.fs || 60;
  const box = layered(el(L, { position: "absolute", left: X, top: Y, width: 1, height: 1, zIndex: 34 }));
  const pill = layered(el(box, { position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: Math.round(fs * 0.35), padding: `${Math.round(fs * 0.3)}px ${Math.round(fs * 0.62)}px`, borderRadius: Math.round(fs * 0.7), background: limeFill(1), color: K.ink, fontFamily: FS, fontWeight: 800, fontSize: fs, whiteSpace: "nowrap", boxShadow: `0 16px 40px rgba(0,0,0,.55), ${GLOW_A(0.7)}`, zIndex: 34 }, (lab.icona ? svg(lab.icona, Math.round(fs * 1.05), K.ink, 2.4) : "") + `<span>${lab.testo}</span>`));
  popK(box, tp + 0.12, { da: 0.8, dur: 0.15 });
  // 3) accento 2 (facoltativo): l'etichetta si spegne e compare il punto di domanda a mano
  let nota = null;
  const td = P.dubbio == null ? null : P.dubbio;
  if (o.dubbio && td != null) {
    tl.to(pill, { background: "linear-gradient(180deg, rgba(64,64,64,.98), rgba(34,34,34,.98))", color: "#a8a8a8", boxShadow: "0 16px 40px rgba(0,0,0,.55)", duration: 0.12, ease: "power2.out" }, td);
    const ic = pill.querySelector("svg");
    if (ic) tl.to(ic, { attr: { stroke: "#a8a8a8" }, duration: 0.12 }, td);
    // fromTo: da "none" GSAP partirebbe da brightness(0) (un fotogramma nero al primo passo)
    tl.fromTo(celle.map((c) => c.card), { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(.85) brightness(.55)", duration: 0.3, ease: "power2.out", immediateRender: false }, td);
    nota = handNote(L, X + (o.notaDx || 250), Y - 150, "?", { size: 190, rot: 10, z: 36 });
    nota.write(td + 0.05, 0.12);
  }
  // 4) la camera: arrivo che frena, poi tiene (R2, R3)
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: FILL });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], etichetta: [X, Y], cella: (i) => [celle[i].cx, celle[i].cy] },
    elementi: { celle, disco, etichetta: box, nota, titolo: T, L },
    tempi: { taglio: t0, parola: tp, dubbio: td },
  };
};

/* @scheda F04 · Riflettore + oscuramento del resto (sopra la soglia / sotto la soglia)
 * quando: selezione, "questi sono i migliori", uno fra tanti, "ogni video sotto quella soglia sembra un fallimento": i reel
 *   veri in riga, sopra ognuno la sua barra (alta quanto vale), una soglia orizzontale che taglia le barre; su una parola gli
 *   scelti si accendono e tutto il resto scende al 40% e perde il colore
 * frase: «Ma da quel momento ogni video sotto quella soglia sembra un fallimento.» (14/10, 18,4–21,7 s)
 * durata: 3–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio), t1, X, Y (centro), parole: { soglia (la linea della soglia si accende con l'etichetta: es. «soglia»),
 *   riflettore (gli scelti si accendono e il resto si spegne: es. «fallimento»), titolo ([…]) }
 * opzioni: titolo, colonne ([{ media (id video o "th-…"), v (altezza della barra 0–1), scelto (true = sopra la soglia,
 *   resta acceso) }]), soglia ({ v (0–1), testo: "1M views" }; false = senza soglia, solo il riflettore), barre (true),
 *   cw (larghezza delle card, 180), ingresso ("arrivo" default | "zoom" | "nessuno" = la camera la muove la composizione,
 *   es. tplZoomThrough), fermoDa (R7), fermo
 * restituisce: rect, pose, ancore { scelto (centro della card scelta), soglia (y della linea), colonna(i) }, elementi {
 *   colonne, linea, etichetta, L }, tempi { taglio, soglia, riflettore }
 * suoni: whoosh .14 al taglio · tick .06 su «soglia» · drop .1 su «riflettore»
 * regole: R2 colonne, barre e linea (spenta) già in scena al taglio · R3 due accenti: la soglia si accende (0,25 s), poi il
 *   riflettore come Kallaway (reel 61: la selezione si accende e il resto scende dal 100 al 72% di luminosità in ~0,37 s):
 *   gli scelti bordo lime + alone senza crescere, il resto al 40% grigio in 0,4 s power2.out · R5 niente scala né rimbalzo
 *   (spotlight() del kit con s: 1) · R7 sfondo fermo
 * prima: (demo-8 19,55 s · demo 30,5 s) spotlight() con lo scelto che cresce a 1,05 e il resto a 0,32, dopo la costruzione
 * chiamata:
 *   TPL.F04({ t0: 13.6, t1: 17.3, X: 10000, Y: 900, parole: { soglia: 15.65, riflettore: 16.32,
 *     titolo: [15.18, 15.42, 15.65, 15.95, 16.28, 16.32] } }, {
 *     titolo: [[{ t: "Sotto la " }, { t: "soglia", box: true }], [{ t: "sembra un fallimento", hand: true }]],
 *     colonne: [{ media: "m7", v: 0.3 }, { media: "m8", v: 0.42 }, { media: "h4", v: 1, scelto: true }, { media: "m9", v: 0.22 },
 *       { media: "m10", v: 0.36 }], soglia: { v: 0.8, testo: "1M views" } });
 */
TPL.F04 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const C = o.colonne || [];
  const n = C.length, cw = o.cw || 180, ch = Math.round((cw * 16) / 9), g = o.gap || 34, HB = o.hb || 600;
  const rowW = n * cw + (n - 1) * g;
  // i reel in riga in basso; sopra ognuno la sua barra (alta quanto vale): la soglia taglia solo le barre
  const yC = Y + (HB + ch) / 2 - ch + 20;  // bordo alto delle card
  const base = yC - 14;                    // piede delle barre
  const so = o.soglia === false ? null : Object.assign({ v: 0.8, testo: "1M views" }, o.soglia || {});
  const ySo = so ? base - so.v * HB : null;
  const col = C.map((c, i) => {
    const x = X - rowW / 2 + i * (cw + g), bh = Math.max(30, c.v * HB);
    const bar = o.barre === false ? null : layered(el(L, { position: "absolute", left: x + cw * 0.14, top: base - bh, width: cw * 0.72, height: bh, borderRadius: "12px 12px 4px 4px", background: c.scelto ? "linear-gradient(180deg, #e4ff8f 0%, #CFFB50 40%, #a9d23a 100%)" : "linear-gradient(180deg, rgba(255,255,255,.26), rgba(255,255,255,.07))", border: `2px solid ${c.scelto ? "#e9ffa8" : "rgba(255,255,255,.3)"}`, boxShadow: "0 18px 40px rgba(0,0,0,.45)", zIndex: 11 }));
    const card = layered(el(L, { position: "absolute", left: x, top: yC, width: cw, height: ch, borderRadius: Math.round(cw * 0.08), overflow: "hidden", border: "2.5px solid rgba(255,255,255,.24)", boxShadow: "0 24px 56px rgba(0,0,0,.6)", background: "#111", zIndex: 13 }));
    mediaTile(card, 0, 0, cw, ch, c.media, 1);
    return { card, bar, cx: x + cw / 2, cy: yC + ch / 2, scelto: !!c.scelto };
  });
  // la soglia: linea tratteggiata spenta da bordo a bordo + etichetta sopra la linea, a sinistra (sopra le barre basse)
  const S = svgLayer(L, 12, X - 1500, Y - 1500, 3000, 3000);
  let linea = null, etich = null;
  if (so) {
    linea = connector(S, [[X - rowW / 2 - 30, ySo], [X + rowW / 2 + 30, ySo]], { w: 4, color: "rgba(255,255,255,.3)" });
    linea.p.setAttribute("stroke-dashoffset", 0);
    linea.p.setAttribute("stroke-dasharray", "18 12");
    etich = layered(el(L, { position: "absolute", left: X - rowW / 2 - 20, top: ySo - 76, width: 290, height: 60, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(40,40,40,.92)", border: "2px solid rgba(255,255,255,.25)", fontFamily: FS, fontWeight: 800, fontSize: 32, color: "#bdbdbd", whiteSpace: "nowrap", zIndex: 30 }, svg("eye", 32, "#bdbdbd", 2.4) + so.testo));
  }
  // accento 1: la soglia si accende (linea lime con alone, etichetta lime)
  const ts = P.soglia == null ? t0 + 0.8 : P.soglia;
  if (so) {
    tl.to(linea.p, { attr: { stroke: K.lime }, duration: 0.25, ease: "power2.out" }, ts);
    tl.set(S, { filter: `drop-shadow(0 0 7px ${rgba(K.lime, 0.6)})` }, ts);
    tl.to(etich, { background: limeFill(1), borderColor: K.lime, color: K.ink, boxShadow: GLOW_A(0.6), duration: 0.25, ease: "power2.out" }, ts);
    const ic = etich.querySelector("svg");
    if (ic) tl.to(ic, { attr: { stroke: K.ink }, duration: 0.25 }, ts);
  }
  // accento 2: il riflettore (reel 61: ~0,37 s): gli scelti si accendono senza crescere, il resto al 40% e grigio
  const tr = P.riflettore == null ? ts + 0.8 : P.riflettore;
  const scelti = col.filter((c) => c.scelto), altri = col.filter((c) => !c.scelto);
  spotlight(scelti.map((c) => c.card), [], tr, { s: 1 });
  const spenti = altri.flatMap((c) => [c.card, c.bar].filter(Boolean));
  tl.to(spenti, { opacity: 0.4, duration: 0.4, ease: "power2.out" }, tr);
  // fromTo: da "none" GSAP partirebbe da brightness(0) (un fotogramma nero al primo passo)
  tl.fromTo(spenti, { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(1) brightness(.7)", duration: 0.4, ease: "power2.out", immediateRender: false }, tr);
  scelti.forEach((c) => c.bar && tl.to(c.bar, { boxShadow: `${GLOW_A(0.8)}, 0 18px 40px rgba(0,0,0,.45)`, duration: 0.4 }, tr));
  // la camera (proporzioni: grafico largo ~0,9 dello schermo, dalla soglia alle card)
  const yTop = Math.min(...C.map((c) => base - Math.max(30, c.v * HB)), so ? ySo - 80 : 1e9);
  const rect = [X - rowW / 2 - 34, yTop - 12, X + rowW / 2 + 34, yC + ch + 12];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  const sc = scelti[0] || col[0];
  return {
    rect, pose,
    ancore: { scelto: [sc.cx, sc.cy], soglia: ySo, colonna: (i) => [col[i].cx, col[i].cy] },
    elementi: { colonne: col, linea, etichetta: etich, titolo: T, L },
    tempi: { taglio: t0, soglia: ts, riflettore: tr },
  };
};

// ═══ blocco 3 del rifacimento (ritmo-03) ═══════════════════════════════════════════════════════════════════════════════════

// F01 · il bagliore misurato su Kallaway (catalogo, misura_glow.py): testo bianco = alone medio σ≈7 px + largo σ≈45 px (GLOW_T);
// oggetti al neon / accesi = σ≈8–11 px forte (~0,3+) + σ≈50–90 px (0,12–0,24). In CSS il raggio di sfocatura è 2σ.
const BLOOM_ACCESO = (a) => { a = a == null ? 1 : a; return `drop-shadow(0 0 20px rgba(255,255,255,${(0.62 * a).toFixed(2)})) drop-shadow(0 0 130px rgba(255,255,255,${(0.3 * a).toFixed(2)}))`; };

/* @scheda F01 · Glow (bloom): la cosa che conta si accende col suo alone (gli oggetti accesi brillano più del testo)
 * quando: la frase oppone due cose e la seconda è quella che conta ("non è la fotocamera…, è dove metti la luce", "non il
 *   prodotto, la storia"): la prima si spegne, la seconda si accende con l'alone misurato (medio + largo) e illumina quello
 *   che cambia; il bagliore è un'informazione (acceso = conta), non una decorazione
 * frase: «Non è la fotocamera a farti sembrare professionale, è dove metti la luce.» (11/10, 0–3,8 s)
 * durata: 3–5,5 s (consigliata 4–4,5)
 * scena: t0 (taglio), t1, X, Y (centro della scena), parole: { spegni (la prima cosa si spegne, es. «fotocamera»), accendi (la
 *   luce si accende, es. «luce»), titolo ([…]) }
 * opzioni: spento ("obj-fotocamera": l'oggetto che non conta), luce ("obj-faro" → acceso "obj-faro_on"), tu (la tua foto vera,
 *   "tu": prima in ombra, poi illuminata), titolo, ingresso ("arrivo" default | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { spento, luce, lente, tu }, elementi { spento, luce, acceso, bloom, cono, foto, L }, tempi {
 *   taglio, spegni, accendi }
 * suoni: whoosh .14 al taglio · drop .06 su «spegni» · rise .05 + ding .1 su «accendi»
 * regole: F01 misurato (catalogo: testo σ≈7 + 45 px, oggetti accesi σ≈8–11 forte + 50–90 px; reel 23 a 6,85 s: il livello si
 *   accende in 1–2 fotogrammi col suo alone): l'alone sale in 0,1 s e si assesta (0,4 s), forte e stretto sulla lente + largo
 *   e tenue attorno; il titolo ha il suo alone medio (GLOW_T) · R2 i tre oggetti già in scena al taglio, in ombra; arrivo dal
 *   basso 140 px expo.out · R3 due accenti: si spegne la cosa che non conta (grigio, fromTo con il filtro di partenza
 *   esplicito: niente fotogramma nero), si accende quella che conta · R5 · R7 sfondo fermo
 * prima: (ovunque) GLOW_T e GLOW_A fissi su testi e oggetti, mai acceso sulla parola
 * chiamata:
 *   S.F01 = TPL.F01({ t0: 27.0, t1: 31.4, X: 16600, Y: 860, parole: { spegni: 27.5, accendi: 30.63,
 *     titolo: [27.5, 28.73, 30.17, 30.63] } }, {
 *     titolo: [[{ t: "Non la " }, { t: "fotocamera", box: true }], [{ t: "la luce", hand: true }]], tu: "tu",
 *     ingresso: "nessuno", fermoDa: 27.45 });
 *   tplTenuta(tplZoomThrough(27.0, S.T02.ancore.storia(0), S.F01.pose), 31.4);   // ritmo-03: match cut sulla tua foto
 *   // dopo un taglio: senza ingresso (arrivo dal basso 140 px expo.out)
 */
TPL.F01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  // la fotocamera (in alto a sinistra), il faro (in alto a destra, girato verso di te), la tua foto (in basso al centro)
  const cw = o.cw || 470, chh = Math.round((cw * 1313) / 1800);
  const cX = X - 250, cY = Y - 250;
  const spento = layered(el(L, { position: "absolute", left: cX - cw / 2, top: cY - chh / 2, width: cw, height: chh, zIndex: 12 }));
  imgIn(spento, o.spento || "obj-fotocamera");
  const fw = o.fw || 470, fh = Math.round((fw * 1543) / 1600);
  const fX = X + 260, fY = Y - 300;
  const luce = layered(el(L, { position: "absolute", left: fX - fw / 2, top: fY - fh / 2, width: fw, height: fh, transform: "scaleX(-1)", zIndex: 13 }));
  imgIn(luce, o.luce || "obj-faro");
  const acceso = layered(el(L, { position: "absolute", left: fX - fw / 2, top: fY - fh / 2, width: fw, height: fh, transform: "scaleX(-1)", zIndex: 14 }));
  imgIn(acceso, o.luceOn || "obj-faro_on");
  gsap.set(acceso, { opacity: 0 });
  // la lente del faro (girato): circa al 46% / 39% dell'immagine
  const lx = fX - fw / 2 + fw * 0.46, ly = fY - fh / 2 + fh * 0.39;
  // la tua foto, in basso al centro
  const pw = o.pw || 380, ph = Math.round(pw * 1.25), pX = X - 50, pY = Y + 250;
  const foto = layered(el(L, { position: "absolute", left: pX - pw / 2, top: pY - ph / 2, width: pw, height: ph, borderRadius: 28, overflow: "hidden", background: "#222", border: "2.5px solid rgba(255,255,255,.18)", boxShadow: "0 34px 80px rgba(0,0,0,.65)", zIndex: 11 }));
  imgIn(foto, "av-" + (o.tu || "tu"), { objectFit: "cover" });
  const OMBRA = "brightness(.38) saturate(.55) contrast(.95)", LUCE = "brightness(1.06) saturate(1.05) contrast(1.02)";
  gsap.set(foto, { filter: OMBRA });
  // il cono di luce (dalla lente verso la foto) e il bagliore sulla lente
  const ang = (Math.atan2(pY - ly, pX - lx) * 180) / Math.PI, dist = Math.hypot(pX - lx, pY - ly) + ph * 0.55;
  const cono = layered(el(L, { position: "absolute", left: lx, top: ly - 260, width: dist, height: 520, transformOrigin: "0 50%", transform: `rotate(${ang.toFixed(1)}deg)`, background: "linear-gradient(90deg, rgba(255,250,235,.34) 0%, rgba(255,250,235,.14) 55%, rgba(255,250,235,0) 100%)", clipPath: "polygon(0% 46%, 100% 0%, 100% 100%, 0% 54%)", filter: "blur(14px)", mixBlendMode: "screen", zIndex: 10 }));
  gsap.set(cono, { opacity: 0 });
  const bd = o.bloom || 320;
  const bloom = layered(el(L, { position: "absolute", left: lx - bd / 2, top: ly - bd / 2, width: bd, height: bd, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,250,.55) 22%, rgba(255,255,240,.18) 48%, rgba(255,255,240,0) 70%)", mixBlendMode: "screen", zIndex: 15 }));
  gsap.set(bloom, { opacity: 0, scale: 0.6 });
  // 1) prima del taglio: tutto c'è già, in ombra (R2)
  const tutto = [spento, luce, foto];
  gsap.set(tutto, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(tutto, { opacity: 1, duration: 0.2 }, t), () => gsap.set(tutto, { opacity: 1 }));
  // 2) accento 1: la cosa che non conta si spegne (fromTo dal filtro esplicito: da "none" partirebbe da brightness(0))
  const ts = P.spegni == null ? t0 + 0.6 : P.spegni;
  tl.fromTo(spento, { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(1) brightness(.42)", duration: 0.3, ease: "power2.out", immediateRender: false }, ts);
  tl.to(spento, { opacity: 0.7, duration: 0.3 }, ts);
  // 3) accento 2: la luce si accende col suo alone (sale in 0,1 s, si assesta), il cono, la tua foto illuminata
  const ta = P.accendi == null ? t1 - 1.0 : P.accendi;
  tl.to(acceso, { opacity: 1, duration: 0.07, ease: "none" }, ta);
  tl.fromTo(acceso, { filter: BLOOM_ACCESO(0.01) }, { filter: BLOOM_ACCESO(1.25), duration: 0.1, ease: "power2.out", immediateRender: false }, ta);
  tl.to(acceso, { filter: BLOOM_ACCESO(1), duration: 0.4, ease: "power2.out" }, ta + 0.1);
  tl.to(bloom, { opacity: 1, scale: 1, duration: 0.1, ease: "power2.out" }, ta);
  tl.to(bloom, { opacity: 0.85, duration: 0.4, ease: "power2.out" }, ta + 0.1);
  tl.to(cono, { opacity: 1, duration: 0.18, ease: "power2.out" }, ta + 0.03);
  tl.fromTo(foto, { filter: OMBRA }, { filter: LUCE, duration: 0.25, ease: "power2.out", immediateRender: false }, ta + 0.04);
  tl.to(foto, { borderColor: "rgba(255,255,255,.75)", boxShadow: "0 34px 80px rgba(0,0,0,.65), 0 0 22px rgba(255,255,255,.45), 0 0 110px rgba(255,255,255,.2)", duration: 0.25 }, ta + 0.04);
  // 4) la camera: arrivo dal basso che frena, poi tiene
  const rect = [Math.min(cX - cw / 2, pX - pw / 2) - 16, fY - fh / 2 - 16, fX + fw / 2 + 16, pY + ph / 2 + 16];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { spento: [cX, cY], luce: [fX, fY], lente: [lx, ly], tu: [pX, pY] },
    elementi: { spento, luce, acceso, bloom, cono, foto, titolo: T, L },
    tempi: { taglio: t0, spegni: ts, accendi: ta },
  };
};

/* @scheda F03 · Sheen (banda di luce) sulla card importante appena arrivata
 * quando: arriva la card che conta ("al primo posto va la presentazione", "il deep link", la risorsa): la card entra al suo
 *   posto e una banda di luce la attraversa (la rende «quella giusta»); poi si scrive quello che contiene. Per la voce di una
 *   lista che si risolve si usa L02
 * frase: «Al primo posto va la presentazione. Chi sei e di cosa ti occupi?» (13/10, 12,7–16,9 s)
 * durata: 3,5–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1, X, Y (centro della scena), parole: { posto (il primo posto si accende, es. «primo»), arriva (la card
 *   arriva e passa la banda, es. «presentazione»), righe ([tempi delle scritte sulla card], es. «Chi», «occupi»), titolo }
 * opzioni: evidenze ([nomi delle storie in evidenza dopo la prima], es. ["Risultati", "Domande", "Extra"]), card ({ user: "tu",
 *   handle, nome: "Presentazione", righe: ["Ciao, sono Samuele", "Video e contenuti per attività locali"] }), durSheen (0,6),
 *   ingresso ("arrivo" default | "nessuno" = la camera la muove la composizione, es. tplPan dalla scena prima), fermoDa, fermo
 * restituisce: rect, pose, ancore { card, posto }, elementi { card, cerchi, banda, L }, tempi { taglio, posto, arriva, righe }
 * suoni: tick .05 su «posto» · card .1 all'arrivo · sub .05 sulla banda · key1 .04 per riga
 * regole: F03 misurato (reel 91 a 73,3 s: il livello appena arrivato, una banda diagonale chiara lo attraversa in ~0,6 s da
 *   sinistra; reel 5 a 34,1 s: ~46 px, 20°, 0,8 s) → sheenK con dir 1 (da sinistra) e 0,6 s, una volta sola, dopo che la card
 *   si è fermata · R2 la fila delle storie in evidenza è già lì al taglio (il posto vuoto tratteggiato); la card è già al suo posto,
 *   sfocata e spenta (segnaposto, come L01: niente riquadro vuoto in attesa), e va a fuoco sulla sua parola (0,94 → 1, 0,3 s
 *   power2.out, niente rimbalzo) · R3 tre accenti sulle parole (posto, card + banda,
 *   scritte) · R5 · R7
 * prima: (demo-4 17,4–19,9 s) sheenK da destra su card già ferme da tempo, non legato a una parola
 * chiamata:
 *   TPL.F03({ t0: 36.7, t1: 41.55, X: 19600, Y: 2000, parole: { posto: 37.25, arriva: 38.22, righe: [39.18, 40.35],
 *     titolo: [36.85, 37.25, 37.42, 38.22] } }, {
 *     titolo: [[{ t: "Al primo posto: " }], [{ t: "la presentazione", box: true }]], evidenze: ["Risultati", "Domande", "Extra"],
 *     card: { user: "tu", handle: "samuelerinaldo.media", righe: ["Ciao, sono Samuele", "Creo video per attività locali"] } });
 */
TPL.F03 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const EV = o.evidenze || ["Risultati", "Domande", "Extra"];
  const C = Object.assign({ user: "tu", handle: "il.tuo.profilo", nome: "Presentazione", righe: ["Chi sei", "Di cosa ti occupi"] }, o.card || {});
  // la fila delle storie in evidenza (in basso): il primo posto vuoto, tratteggiato
  const d = o.d || 196, g = o.gap || 60, n = EV.length + 1, RW = n * d + (n - 1) * g;
  const rY = Y + 380, xs = Array.from({ length: n }, (_, i) => X - RW / 2 + d / 2 + i * (d + g));
  const vuoto = layered(el(L, { position: "absolute", left: xs[0] - d / 2, top: rY - d / 2, width: d, height: d, borderRadius: "50%", border: "4px dashed rgba(255,255,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 13 }, svg("plus", 64, "rgba(255,255,255,.5)", 2.4)));
  const labV = el(L, { position: "absolute", left: xs[0] - d, top: rY + d / 2 + 14, width: d * 2, textAlign: "center", fontFamily: FS, fontWeight: 600, fontSize: 32, color: "rgba(255,255,255,.55)", whiteSpace: "nowrap", zIndex: 13 }, "Nuova");
  const cerchi = EV.map((nm, i) => storyCircle(L, xs[i + 1], rY, d, { anon: true }, { ring: "visto", nome: nm, fs: 32, lw: d + 50, z: 13 }));
  cerchi.forEach((c) => gsap.set(c.g, { filter: "grayscale(1) brightness(.6)" }));
  // il primo posto pieno (la tua foto, anello lime): compare quando arriva la card
  const primo = storyCircle(L, xs[0], rY, d, C.user, { ring: "lime", nome: C.nome, fs: 32, lw: d + 60, z: 14 });
  gsap.set(primo.g, { opacity: 0 });
  // la card della storia (9:16): la tua foto vera, barra a segmenti, avatar e nome, le scritte che si scrivono
  const cw = o.cw || 400, chh = Math.round((cw * 16) / 9), cX = X + 90, cY = Y - 200;
  const card = layered(el(L, { position: "absolute", left: cX - cw / 2, top: cY - chh / 2, width: cw, height: chh, borderRadius: 30, overflow: "hidden", background: "#111", border: "3px solid rgba(255,255,255,.85)", boxShadow: "0 40px 90px rgba(0,0,0,.65), 0 0 26px rgba(255,255,255,.25)", zIndex: 20 }));
  imgIn(card, "av-" + C.user, { objectFit: "cover", filter: "brightness(.92)" });
  el(card, { position: "absolute", left: 0, top: 0, width: cw, height: 150, background: "linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0))", zIndex: 2 });
  el(card, { position: "absolute", left: 0, top: chh - 260, width: cw, height: 260, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6))", zIndex: 2 });
  [0, 1, 2].forEach((k) => el(card, { position: "absolute", left: 16 + k * ((cw - 32 - 12) / 3 + 6), top: 16, width: (cw - 32 - 12) / 3, height: 5, borderRadius: 3, background: k ? "rgba(255,255,255,.45)" : "#fff", zIndex: 3 }));
  const av = el(card, { position: "absolute", left: 16, top: 34, width: 46, height: 46, borderRadius: "50%", overflow: "hidden", border: "2px solid #fff", zIndex: 3 });
  imgIn(av, "av-" + C.user, { objectFit: "cover" });
  el(card, { position: "absolute", left: 72, top: 44, fontFamily: FS, fontWeight: 700, fontSize: 22, color: "#fff", whiteSpace: "nowrap", zIndex: 3 }, C.handle);
  const righe = (C.righe || []).map((tx, i) => {
    const r = el(card, { position: "absolute", left: 22, top: chh - 210 + i * 86, maxWidth: cw - 44, padding: "10px 18px", borderRadius: 14, background: i ? "rgba(20,20,20,.82)" : "#ffffff", fontFamily: FS, fontWeight: 800, fontSize: i ? 26 : 32, color: i ? "#fff" : K.ink, whiteSpace: "nowrap", zIndex: 4 }, tx);
    gsap.set(r, { opacity: 0 });
    return r;
  });
  // il filo dal primo posto alla card
  const S = svgLayer(L, 12, X - 2000, Y - 2000, 4000, 4000);
  const filo = connector(S, [[xs[0], rY - d / 2 - 8], [cX - cw / 2 + 30, cY + chh / 2 - 40]], { curve: "v", w: 4, color: "rgba(207,251,80,.85)", glow: true });
  // 1) prima del taglio: la fila e la card ci sono già (R2); la card è un segnaposto sfocato e spento finché non la nomini (L01:
  //    niente riquadro vuoto in attesa)
  const SEGNA = "blur(12px) grayscale(.7) brightness(.55)", NITIDA = "blur(0px) grayscale(0) brightness(1)";
  gsap.set(card, { filter: SEGNA, scale: 0.94 });
  const fila = [vuoto, labV, card, ...cerchi.map((c) => c.g)];
  gsap.set(fila, { opacity: 0 });
  tplMonta(t0, (t) => { tl.to(fila, { opacity: 1, duration: 0.2 }, t); tl.set(card, { opacity: 0.6 }, t + 0.2); }, () => { gsap.set(fila, { opacity: 1 }); gsap.set(card, { opacity: 0.6 }); });
  // 2) accento 1: il primo posto si accende (bordo lime)
  const tp = P.posto == null ? t0 + 0.5 : P.posto;
  tl.to(vuoto, { borderColor: K.lime, boxShadow: GLOW_A(0.7), duration: 0.2 }, tp);
  const ic = vuoto.querySelector("svg");
  if (ic) tl.to(ic, { attr: { stroke: K.lime }, duration: 0.2 }, tp);
  // 3) accento 2: la card arriva al suo posto (senza rimbalzo), il primo posto si riempie, poi la banda di luce la attraversa
  const ta = P.arriva == null ? tp + 1.0 : P.arriva;
  tl.fromTo(card, { opacity: 0.6, scale: 0.94, filter: SEGNA }, { opacity: 1, scale: 1, filter: NITIDA, duration: 0.3, ease: "power2.out", immediateRender: false }, ta);
  tl.set(card, { filter: "none" }, ta + 0.31);
  filo.draw(ta + 0.05, 0.3, "power2.out");
  tl.to([vuoto, labV], { opacity: 0, duration: 0.12 }, ta + 0.2);
  popK(primo.g, ta + 0.2, { da: 0.9, dur: 0.15 });
  const banda = sheenK(card, ta + 0.32, { dur: o.durSheen || 0.6, dir: 1, w: 70, a: 0.9 });
  // 4) accento 3: le scritte della storia (chi sei, di cosa ti occupi)
  const TR = P.righe || righe.map((_, i) => ta + 1.0 + i * 0.8);
  righe.forEach((r, i) => popK(r, TR[i], { da: 0.92, dur: 0.15, y: 10 }));
  // 5) la camera: arrivo che frena (o la muove la composizione, R8)
  const rect = [X - RW / 2 - 20, cY - chh / 2 - 20, X + RW / 2 + 20, rY + d / 2 + 70];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { card: [cX, cY], posto: [xs[0], rY] },
    elementi: { card, cerchi, primo, banda, titolo: T, L },
    tempi: { taglio: t0, posto: tp, arriva: ta, righe: TR },
  };
};
