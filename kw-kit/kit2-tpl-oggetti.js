// ═══ KW kit v2 · TEMPLATE · oggetti-metafora (O) — blocco 1 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═══════════
// Stesso standard di kit2-template.js (scheda @scheda, TPL.<ID>(scena, opzioni) → { rect, pose, ancore, elementi, tempi }).
// Le scene di prova sono in CATALOGO-ANIMAZIONI/ritmo-01 (KW_RITMO).

/* @scheda O01 · Anello di reel che ruota (la risposta al centro)
 * quando: un insieme di contenuti ("pubblicare di tutto", "i formati", "i creator", "i contenuti che…"); hook su un errore o
 *   una categoria di video, con la risposta al centro dell'insieme
 * frase: «L'errore numero uno che fanno i principianti? Pubblicare di tutto.» (01/10, 0–4,3 s)
 * durata: 3–6 s (consigliata 4–5)
 * scena: t0 (taglio: l'anello si apre), t1, X, Y (centro dell'anello), parole: { accento (disco lime dietro la risposta, es.
 *   «uno»), risposta (la risposta al centro va a fuoco, es. «Pubblicare»), sottolinea (es. «tutto.»), titolo ([tempo per
 *   parola]) }
 * opzioni: titolo, media (6–8 id video del pool: reel veri, uno per card), risposta ([riga 1, riga 2 a mano] al centro,
 *   facoltativa), r (raggio, 380), w (card 9:16, 170), giri (°/s, 24), apertura (s, 0.85), ingresso ("fermo" default: la
 *   camera tiene | "zoom" | "nessuno" = la camera la muove la composizione), fermo (R7, default true)
 * restituisce: rect, pose, ancore { centro, bordo(a) (punto dell'anello all'angolo a, rad), card(i) }, elementi { anello,
 *   risposta, sotto, L }, tempi { taglio, aperto, accento, risposta }
 * suoni: whoosh .14 al taglio · pop .12 su «accento» · card .1 su «risposta»
 * regole: R2 le card ci sono già al taglio, vicine al centro (30% del raggio); il movimento principale è l'apertura dal primo
 *   fotogramma: 0,85 s power1.out, misurata sui reel 13 e 14 (raggio ×2–3, metà a 0,2 s, 90% a 0,67 s, power1.out) · R3 la
 *   camera tiene (deriva 1,2% che si spegne); l'anello gira lento e continuo (24°/s, card sempre dritte) · accenti: disco
 *   lime (F02) e la risposta che va a fuoco · R5 niente rimbalzi · R7 sfondo fermo nella tenuta
 * prima: (demo 1,35–5 s, reel-01 v5) l'anello si apriva da una pila sfocata col rack focus, float +5% su tutta la scena,
 *   punto lime che sbocciava con back.out(3), la pill della risposta entrava con back.out(1,6) + sheen, il punto di domanda a
 *   mano e poi i reel scagliati via (fling): tre movimenti grandi in 4 s
 * chiamata:
 *   TPL.O01({ t0: 1.0, t1: 5.65, X: 600, Y: 900, parole: { accento: 1.83, risposta: 4.1, sottolinea: 4.87,
 *     titolo: [1.1, 1.27, 1.63, 1.83, 2.5, 2.6] } }, {
 *     titolo: [[{ t: "L'errore " }, { t: "numero uno", box: true }], [{ t: "dei principianti", hand: true }]],
 *     media: ["c1", "c2", "c3", "c4", "c5", "c6", "c7"], risposta: ["Pubblicare", "di tutto"] });
 */
TPL.O01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const R = o.r || 380, w = o.w || 170, h = Math.round((w * 16) / 9);
  const ring = reelRing(L, X, Y, o.media || [], { r: R, w, r0: Math.round(R * 0.3), a0: o.a0 == null ? -2.2 : o.a0, z: 12 });
  // la risposta al centro: card scura col bordo lime, due righe (la seconda nella «seconda voce», a mano, sottolineata);
  // c'è già al taglio ma sfocata (L01: non ancora detta)
  let card = null, und = null;
  if (o.risposta) {
    const [r1, r2] = o.risposta, cw = o.rw || 400, ch = r2 ? 180 : 116;
    card = layered(el(L, { position: "absolute", left: X - cw / 2, top: Y - ch / 2, width: cw, height: ch, borderRadius: 30, background: "linear-gradient(180deg, rgba(56,56,56,.97), rgba(26,26,26,.98))", border: "2px solid rgba(207,251,80,.55)", boxShadow: "0 24px 60px rgba(0,0,0,.6), inset 0 1.5px 0 rgba(255,255,255,.12)", zIndex: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }));
    el(card, { fontFamily: FD, fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, r1);
    if (r2) {
      const s2 = el(card, { position: "relative", fontFamily: FH, fontSize: 62, lineHeight: 1, color: K.lime, textShadow: GLOW_LT, whiteSpace: "nowrap" }, r2);
      und = el(s2, { position: "absolute", left: "-4%", bottom: -6, width: "108%", height: 5, borderRadius: 3, background: K.lime, boxShadow: GLOW_A(0.6), transformOrigin: "0 50%" });
      gsap.set(und, { scaleX: 0 });
    }
    gsap.set(card, { filter: "blur(9px)", opacity: 0.4 });
  }
  // 1) prima del taglio: le card ci sono già, raggruppate al centro (reel 14 al fotogramma 0)
  tplMonta(t0, (t) => tl.to(ring.cards.map((c) => c.wrap), { opacity: 1, duration: 0.2 }, t), () => gsap.set(ring.cards.map((c) => c.wrap), { opacity: 1 }));
  // 2) il movimento principale: l'anello si apre al taglio, poi gira lento fino alla fine
  const tAp = t0 + 0.02, dAp = o.apertura || 0.85;
  ring.open(tAp, dAp, "power1.out");
  ring.spin(tAp, Math.max(0.5, t1 - tAp + 0.3), o.giri || 24);
  // 3) accenti: disco lime dietro la risposta (F02), la risposta va a fuoco, la sottolineatura a mano
  const ta = P.accento == null ? t0 + 0.6 : P.accento;
  pulse(L, X, Y, ta, { r: R - 70, z: 11 });
  const tr = P.risposta == null ? ta + 0.5 : P.risposta;
  if (card) {
    tl.to(card, { filter: "blur(0px)", opacity: 1, duration: 0.3, ease: "power2.out" }, tr);
    tl.to(card, { borderColor: "rgba(207,251,80,.95)", boxShadow: `${GLOW_A(0.55)}, 0 24px 60px rgba(0,0,0,.6)`, duration: 0.3 }, tr);
    tl.set(card, { filter: "none" }, tr + 0.31);
    if (und) tl.to(und, { scaleX: 1, duration: 0.3, ease: "power2.out" }, P.sottolinea == null ? tr + 0.4 : P.sottolinea);
  }
  // 4) la camera: tiene ferma l'inquadratura dell'anello (il movimento è l'apertura) oppure "zoom"/"nessuno"
  // inquadratura stretta come Kallaway (anello largo ~80% del fotogramma): le card in cima e in fondo toccano la banda utile
  const rect = [X - R - w / 2, Y - R - h / 2, X + R + w / 2, Y + R + h / 2];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 370, fill: 1 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "fermo", top: 370, fill: 1, ds: 0.1 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], bordo: (a) => [X + Math.cos(a) * R, Y + Math.sin(a) * R], card: (i) => ring.cards[i].wrap },
    elementi: { anello: ring, risposta: card, sotto: und, titolo: T, L },
    tempi: { taglio: t0, aperto: tAp + dAp, accento: ta, risposta: tr },
  };
};

/* @scheda O21 · Anelli orbitali di persone (chi vede il tuo reel: i follower dentro, le persone nuove fuori)
 * quando: pubblico, chi ti segue e chi no, a chi viene mostrato un contenuto, chi resta / chi se ne va ("il reel di prova
 *   verrà mostrato solo a persone nuove", "prima ai follower che interagiscono"); al centro il tuo reel vero
 * frase: «…ma il reel di prova verrà mostrato solo a persone nuove che non ti seguono ancora.» (03/10, 26,4–30,9 s)
 * durata: 3–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1, X, Y (centro), parole: { spegni (l'anello interno si spegne: es. «solo»), accendi (gli anelli
 *   esterni si accendono di lime a onda: es. «persone»), titolo ([…]) }
 * opzioni: media (il tuo reel al centro: video o copertina), tag (true: etichetta PROVA sotto il centro), anelli ([[raggio,
 *   quanti], …], il primo = i tuoi follower), legenda ([[colore, testo], …]), giri (°/s della rotazione lenta, 9), titolo,
 *   ingresso ("zoom" default | "arrivo" | "nessuno"), fermo (R7, default true)
 * restituisce: rect, pose, ancore { centro, bordo }, elementi { anelli, L }, tempi { taglio, spegni, accendi }
 * suoni: whoosh .14 al taglio · drop .1 su «spegni» · rise .06 su «accendi»
 * regole: R2 anelli, persone e il tuo reel già in scena al taglio (reel 44: gli anelli pieni appena arriva la grafica) ·
 *   R2 zoom d'arrivo +15% in 0,4 s power2.out, poi camera ferma; gli anelli girano piano (elementi, non camera) · R3 due
 *   accenti sulle parole: i follower si spengono, le persone nuove si accendono a onda (reel 5: il colore cambia in ~0,3 s;
 *   qui 0,5 s) · R5 niente back.out
 * prima: (reel-01 v5 10,75–12,75 s; reel-03 22,8–31 s) gli anelli si aprivano dopo il taglio (0,5 s expo) e i puntini
 *   poppavano con back.out(2,5), whip d'ingresso e due spostamenti di camera fra due anelli
 * chiamata:
 *   TPL.O21({ t0: 50.15, t1: 55.0, X: 17000, Y: 4400, parole: { spegni: 52.36, accendi: 52.9,
 *     titolo: [51.0, 51.16, 51.3, 52.9, 53.26] } }, {
 *     titolo: [[{ t: "Il reel " }, { t: "di prova", box: true }], [{ t: "solo a persone nuove", hand: true }]],
 *     media: "r04v", tag: true, legenda: [["#ececec", "I tuoi follower"], ["#CFFB50", "Persone nuove"]] });
 */
TPL.O21 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const AN = o.anelli || [[250, 16], [345, 24], [440, 32]];
  const R = AN[AN.length - 1][0];
  const pr = peopleRings(L, X, Y, AN, { media: o.media, d: Math.round(R * 0.44), dot: o.dot || 24, legenda: o.legenda, z: 10 });
  let tag = null;
  if (o.tag) { tag = tplTagReel(L, X, Y + Math.round(R * 0.22) + 44, o.prova !== false, 20); gsap.set(tag, { opacity: 0 }); }
  // 1) prima del taglio: anelli, persone, il reel al centro e la legenda già costruiti (R2)
  tplMonta(t0, (t) => { pr.show(t, { dur: 0.3 }); if (tag) tl.to(tag, { opacity: 1, duration: 0.2 }, t + 0.3); },
    () => { gsap.set(pr.av, { opacity: 1, scale: 1 }); pr.holders.forEach((h) => { gsap.set(h.ring, { opacity: 1 }); gsap.set(h.dots.map((x) => x.d), { opacity: 1, scale: 1 }); }); if (tag) gsap.set(tag, { opacity: 1 }); });
  // gli anelli girano piano per tutta la scena (elementi: la camera resta ferma)
  const dps = o.giri || 9;
  pr.spin(Math.max(0, t0 - 1), t1 - t0 + 1.3, dps * (t1 - t0 + 1.3));
  // 2) accento: l'anello interno (i tuoi follower) si spegne
  const ts = P.spegni == null ? t0 + 1.2 : P.spegni;
  const dentro = pr.holders[0];
  tl.to(dentro.dots.map((x) => x.d), { background: "#4a4a4a", boxShadow: "0 0 0px rgba(255,255,255,0)", duration: 0.25 }, ts);
  tl.to(dentro.ring, { borderColor: "rgba(255,255,255,.06)", duration: 0.25 }, ts);
  // 3) accento: le persone nuove (anelli esterni) si accendono di lime a onda, per angolo
  const ta = P.accendi == null ? ts + 0.6 : P.accendi;
  const fuori = pr.holders.slice(1).flatMap((h) => h.dots).sort((p, q) => ((p.a % 6.283) + 6.283) % 6.283 - (((q.a % 6.283) + 6.283) % 6.283));
  fuori.forEach((x, i) => tl.to(x.d, { background: K.lime, boxShadow: GLOW_A(0.8), duration: 0.12 }, ta + (i / fuori.length) * 0.5));
  pr.holders.slice(1).forEach((h) => tl.to(h.ring, { borderColor: "rgba(207,251,80,.35)", duration: 0.4 }, ta));
  // 4) la camera: zoom d'arrivo che frena, poi ferma
  const rect = pr.rect;
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "zoom", top: 380, ds: 0.15, dur: 0.4 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], bordo: (a) => [X + Math.cos(a) * R, Y + Math.sin(a) * R] },
    elementi: { anelli: pr, tag, titolo: T, L },
    tempi: { taglio: t0, spegni: ts, accendi: ta },
  };
};

// ═══ blocco 2 del rifacimento (ritmo-02) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda O13 · Cervello luminoso (si accende col battito di Kallaway e scrive cosa ha capito)
 * quando: psicologia, cervello, abitudine, dopamina, vergogna, "il cervello si convince che…", "ti resta in testa": in alto
 *   quello che il cervello vede (i reel veri), sotto il cervello che si accende e nell'etichetta la conclusione che ne tira
 * frase: «E il cervello si convince che quello sia il livello normale.» (14/10, 11,0–14,0 s)
 * durata: 3–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio), t1, X, Y (centro della scena), parole: { accende (il cervello si accende: es. «convince»),
 *   etichetta (si scrive la conclusione: es. «livello»), titolo ([…]) }
 * opzioni: titolo, media ([1–3 id video]: quello che il cervello vede, reel veri in movimento), ratio (altezza/larghezza delle
 *   card, 4/3 per le clip 3:4, 16/9 per i reel), badge (testo sulle card, es. "1M views"; false = niente), etichetta (testo
 *   scritto a macchina sotto il cervello), size (larghezza del cervello nel mondo, 600), ingresso ("zoom" default | "arrivo"
 *   | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { cervello, etichetta, card(i) }, elementi { cervello, card, linee, etichetta, L }, tempi {
 *   taglio, accende, etichetta }
 * suoni: whoosh .14 al taglio · sub .1 + glitch .06 su «accende» · key1 .05 su «etichetta»
 * regole: R2 card, linee e cervello già in scena al taglio; zoom d'arrivo +15% in 0,4 s power2.out, poi la
 *   camera tiene · il battito misurato su Kallaway (kit brain()): il disco grafite con l'anello lime nasce ~0,15 s prima
 *   (reel 48/79), poi acceso/spento a ogni fotogramma per ~0,17 s e fisso con l'alone (reel 48); le linee dalle card al cervello
 *   si accendono di lime insieme (il segnale arriva) · il riquadro dell'etichetta entra con la scritta (popK 0,8 → 1 in 0,15 s)
 *   e la scritta si batte a macchina come «Two Hits Of Dopamine» (reel 34, ~0,6 s): mai un riquadro vuoto · R3 due accenti · R5 niente rimbalzi · R7 sfondo fermo
 * prima: (demo-2 20–23,5 s · demo-oggetti 0–4 s · reel-09 0–7 s) il cervello entrava sfocato col rack focus e float, oppure
 *   si accendeva con .on() in 0,3 s senza il battito; nessun legame con quello che vede
 * chiamata:
 *   TPL.O13({ t0: 6.1, t1: 9.75, X: 3600, Y: 900, parole: { accende: 6.98, etichetta: 8.38,
 *     titolo: [6.42, 6.48, 6.88, 6.98] } }, {
 *     titolo: [[{ t: "Il cervello " }, { t: "si convince", box: true }]],
 *     media: ["h1", "h2", "h3"], ratio: 4 / 3, badge: "1M views", etichetta: "= il livello normale" });
 */
TPL.O13 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const media = o.media || [];
  const n = media.length, cw = o.cw || (n >= 3 ? 300 : 340), ch = Math.round(cw * (o.ratio || 16 / 9)), gap = o.gap || 30;
  const LG = 70; // spazio delle linee fra le card e il cervello
  const size = o.size || 600, bh = size / 1.18; // il cervello vero è 1800 × 1523
  const eh = 104, ew = o.etichettaW || Math.max(560, size * 1.02);
  // colonna: card in alto, le linee, il cervello, l'etichetta (proporzioni: la riga di card larga ~0,7 dello schermo come
  // la griglia di F02; il cervello ~0,43, Kallaway reel 34 0,40)
  const H = (n ? ch + LG : 0) + bh + 40 + eh;
  const yTop = Y - H / 2, yB = yTop + (n ? ch + LG : 0) + bh / 2, yE = yB + bh / 2 + 40;
  const rowW = n * cw + (n - 1) * gap;
  // 1) le card (reel veri in movimento) col badge
  const card = media.map((id, i) => {
    const x = X - rowW / 2 + i * (cw + gap);
    const c = layered(el(L, { position: "absolute", left: x, top: yTop, width: cw, height: ch, borderRadius: Math.round(cw * 0.07), overflow: "hidden", border: "2.5px solid rgba(255,255,255,.22)", boxShadow: "0 26px 60px rgba(0,0,0,.6)", background: "#111", zIndex: 12 }));
    mediaTile(c, 0, 0, cw, ch, id, 1);
    let b = null;
    if (o.badge !== false) { b = viewBadge(L, x + cw / 2, yTop + ch - 2, o.badge || "1M views", { fs: 26, z: 14 }); gsap.set(b, { scale: 1 }); }
    return { c, b, cx: x + cw / 2 };
  });
  // 2) le linee dalle card al cervello (convergono in cima al cervello): grigie, si accendono col cervello
  const S = svgLayer(L, 11, X - 1500, Y - 1500, 3000, 3000);
  const linee = card.map((k) => {
    const c = connector(S, [[k.cx, yTop + ch + 16], [X + (k.cx - X) * 0.18, yB - bh * 0.38]], { w: 3, color: "rgba(255,255,255,.32)", curve: "v" });
    c.p.setAttribute("stroke-dashoffset", 0);
    return c;
  });
  // 3) il cervello (oggetto vero) e il riquadro dell'etichetta, vuoto, col cursore
  const BR = brain(L, X, yB, size, { z: 13 });
  const box = layered(el(L, { position: "absolute", left: X - ew / 2, top: yE, width: ew, height: eh, borderRadius: 22, background: "linear-gradient(180deg, rgba(44,44,44,.94), rgba(22,22,22,.96))", border: "2px solid rgba(255,255,255,.28)", boxShadow: "0 20px 50px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 14 }));
  const tx = el(box, { fontFamily: FD, fontWeight: 700, fontSize: 52, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" });
  // il riquadro dell'etichetta NON è in scena al taglio (regia 15/10: niente riquadro vuoto): entra con la scritta
  const tutto = [...card.map((k) => k.c), ...card.map((k) => k.b).filter(Boolean), BR.g, S];
  gsap.set(tutto, { opacity: 0 });
  gsap.set(box, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(tutto, { opacity: 1, duration: 0.2 }, t), () => gsap.set(tutto, { opacity: 1 }));
  // 4) accento 1: il cervello si accende col battito di Kallaway (disco ~0,15 s prima, poi il lampeggio a ogni fotogramma);
  //    le linee diventano lime (il segnale arriva dalle card)
  const ta = P.accende == null ? t0 + 0.9 : P.accende;
  BR.disco(ta - 0.15, { z: 12, r: size * 0.52 });
  BR.accendi(ta);
  linee.forEach((c) => { tl.to(c.p, { attr: { stroke: K.lime }, duration: 0.15 }, ta); });
  tl.set(S, { filter: `drop-shadow(0 0 7px ${rgba(K.lime, 0.6)})` }, ta);
  // 5) accento 2: il riquadro entra con la scritta (popK 0,8 → 1 in 0,15 s, R5) e la conclusione si scrive a macchina
  //    (reel 34: riquadro e «Two Hits Of Dopamine» compaiono insieme, ~0,6 s); il bordo è già lime
  const te = P.etichetta == null ? ta + 1.2 : P.etichetta;
  if (o.etichetta) {
    gsap.set(box, { borderColor: K.lime, boxShadow: `0 20px 50px rgba(0,0,0,.6), ${GLOW_A(0.5)}` });
    popK(box, te, { da: 0.8, dur: 0.15 });
    typeIn(tx, o.etichetta, te + 0.04, o.cps || 32, { caret: true, size: 52, blinks: 1 });
  }
  // 6) la camera: zoom d'arrivo che frena, poi tiene
  const rect = [X - Math.max(rowW, ew, size) / 2 - 10, yTop - 10, X + Math.max(rowW, ew, size) / 2 + 10, yE + eh + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "zoom", top: 380, fill: o.fill || 0.98, ds: 0.15, dur: 0.4 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { cervello: [X, yB], etichetta: [X, yE + eh / 2], card: (i) => [card[i].cx, yTop + ch / 2] },
    elementi: { cervello: BR, card, linee, etichetta: box, titolo: T, L },
    tempi: { taglio: t0, accende: ta, etichetta: te },
  };
};

/* @scheda O10 · Bersaglio costruito dal centro (il pubblico giusto al centro, la freccetta del messaggio giusto)
 * quando: dal pubblico più specifico al più ampio, posizionamento, nicchia, "non è un milione di visualizzazioni, è arrivare
 *   alle persone giuste col messaggio giusto": al centro le persone giuste, fuori il pubblico largo che si spegne, la
 *   freccetta (il messaggio) si pianta al centro
 * frase: «L'obiettivo non è un milione di visualizzazioni. È arrivare alle persone giuste col messaggio giusto.» (14/10,
 *   37,2–42,0 s)
 * durata: 3,5–6 s (consigliata 4,5–5)
 * scena: t0 (taglio: il bersaglio si costruisce dal centro), t1, X, Y (centro del bersaglio), parole: { fuori (l'etichetta
 *   esterna va a fuoco: es. «milione»), spegni (il pubblico largo si spegne e l'etichetta si barra: es. «visualizzazioni»),
 *   centro (il centro si accende con le persone giuste: es. «persone»), freccia (la freccetta si pianta: es. «messaggio»),
 *   titolo ([…]) }
 * opzioni: titolo, raggi ([centro, …, esterno], default [150, 250, 340, 430]), etichette ({ fuori: "1M di views",
 *   centro: "Le persone giuste" }), fs (46), passo (0.17), durAnello (0.42), persone (silhouette nel centro, 3: «chi ti guarda», mai volti veri), freccia (true),
 *   ingresso ("fermo" default: la camera tiene, il movimento è la costruzione | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { centro, bordo }, elementi { bersaglio, persone, etichette, L }, tempi { taglio, costruito,
 *   fuori, spegni, centro, freccia }
 * suoni: whoosh .14 al taglio · tick .05 su «fuori» · drop .08 su «spegni» · pop .1 su «centro» · slam .12 su «freccia»
 * regole: R2 il centro (con le persone) c'è al taglio; il movimento principale è la costruzione dal centro, dal primo
 *   fotogramma: un anello ogni 0,17 s, 0,42 s power1.out, ~0,76 s in tutto (reel 42: dal punto al bersaglio pieno in 0,85 s,
 *   quasi lineare) · le etichette ci sono
 *   già, sfocate (L01), pill sul bersaglio (reel 42: «Specific topic» nel centro), e vanno a fuoco quando sono dette · R3 accenti sulle
 *   parole (fuori a fuoco, spento e barrato, centro acceso, freccetta) · la freccetta trema (è un colpo voluto, F12) ma niente
 *   scossa della camera e niente back.out sugli anelli · R7 sfondo fermo
 * prima: (demo 22–28 s · demo-2 52–54 s · reel-09 16,1–18,3 s) gli anelli entravano uno per parola con back.out, la camera
 *   scuoteva all'impatto (shake 11 px) e gli anelli rimbalzavano (back.out(3))
 * chiamata:
 *   TPL.O10({ t0: 17.3, t1: 22.2, X: 13400, Y: 900, parole: { fuori: 18.45, spegni: 18.9, centro: 20.45, freccia: 21.45,
 *     titolo: [17.73, 18.05, 18.23, 20.45, 20.82] } }, {
 *     titolo: [[{ t: "Non " }, { t: "un milione", box: true }], [{ t: "le persone giuste", hand: true }]],
 *     etichette: { fuori: "1M di views", centro: "Le persone giuste" } });
 */
TPL.O10 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const RR = o.raggi || [150, 250, 340, 430], n = RR.length, R = RR[n - 1];
  const B = bullseye(L, X, Y, RR, { z: 10 });
  // le persone giuste nel centro: silhouette di profilo sul disco bianco (mai volti veri)
  const np = o.persone == null ? 3 : o.persone, dp = Math.round(RR[0] * 0.56);
  const pers = [];
  for (let i = 0; i < np; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / np, rr = np > 1 ? RR[0] * 0.48 : 0;
    const g = layered(el(L, { position: "absolute", left: X + Math.cos(a) * rr - dp / 2, top: Y + Math.sin(a) * rr - dp / 2, width: dp, height: dp, borderRadius: "50%", zIndex: 10 + n + 4, boxShadow: "0 8px 20px rgba(0,0,0,.45)" }));
    personaK(g, 0, 0, dp, { z: 1 });
    pers.push(g);
  }
  // etichette: pill scure SUL bersaglio (come «Specific topic» nel centro del reel 42), così il bersaglio può riempire
  // l'inquadratura: «fuori» in cima all'anello esterno, «centro» sotto il disco centrale; già lì, sfocate (L01)
  const E = Object.assign({ fuori: "1M di views", centro: "Le persone giuste" }, o.etichette || {});
  const lab = (cy, testo, z) => {
    const box = layered(el(L, { position: "absolute", left: X, top: cy, width: 1, height: 1, zIndex: z }));
    const tx = layered(el(box, { position: "absolute", left: 0, top: 0, transform: "translate(-50%,-50%)", padding: "12px 30px", borderRadius: 34, background: "rgba(30,30,30,.94)", border: "2px solid rgba(255,255,255,.3)", boxShadow: "0 14px 34px rgba(0,0,0,.55)", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 46, color: K.white, whiteSpace: "nowrap", textShadow: GLOW_T }, testo));
    const strike = el(tx, { position: "absolute", left: 22, top: "50%", height: 5, marginTop: -2, width: 0, background: "#e6e6e6", borderRadius: 3 });
    gsap.set(tx, { filter: "blur(8px)" });
    return { box, tx, strike };
  };
  const eF = lab(Y - R + 26, E.fuori, 10 + n + 7);
  const eC = lab(Y + RR[0] + 44, E.centro, 10 + n + 7);
  const S = null;
  // 1) prima del taglio: il centro, le persone, le linee e le etichette sfocate ci sono già (R2)
  const sub = [eF.box, eC.box, ...pers];
  gsap.set(sub, { opacity: 0 });
  gsap.set([eF.tx, eC.tx], { opacity: 0.5 });
  tplMonta(t0, (t) => { tl.to(B.rings[0], { opacity: 1, scale: 1, duration: 0.2 }, t); tl.to(sub, { opacity: 1, duration: 0.2 }, t); },
    () => { gsap.set(B.rings[0], { opacity: 1, scale: 1 }); gsap.set(sub, { opacity: 1 }); });
  // 2) il movimento principale: gli anelli si costruiscono dal centro, dal primo fotogramma (reel 42: ~0,7 s)
  // reel 42: dal punto al bersaglio pieno in ~0,85 s, quasi lineare → un anello ogni 0,17 s, 0,42 s power1.out (~0,76 s)
  const stg = o.passo || 0.17, dR = o.durAnello || 0.42;
  for (let i = 1; i < n; i++) B.ring(i, t0 + 0.02 + (i - 1) * stg, dR, "power1.out");
  const tc0 = t0 + 0.02 + (n - 2) * stg + dR;
  // 3) accenti: l'etichetta esterna a fuoco, poi spenta e barrata con gli anelli esterni
  const tf = P.fuori == null ? t0 + 1.0 : P.fuori;
  tl.to(eF.tx, { filter: "blur(0px)", opacity: 1, duration: 0.25, ease: "power2.out" }, tf);
  tl.set(eF.tx, { filter: "none" }, tf + 0.26);
  const ts = P.spegni == null ? tf + 0.5 : P.spegni;
  B.dimOuter(1, ts);
  tl.to(eF.strike, { width: "calc(100% - 44px)", duration: 0.25, ease: "power2.out" }, ts);
  tl.to(eF.tx, { color: "#8a8a8a", textShadow: "none", duration: 0.25 }, ts);
  // il centro si accende: le persone giuste e l'etichetta del centro
  const tcn = P.centro == null ? ts + 1.0 : P.centro;
  tl.to(eC.tx, { filter: "blur(0px)", opacity: 1, color: K.lime, textShadow: GLOW_LT, duration: 0.25, ease: "power2.out" }, tcn);
  tl.set(eC.tx, { filter: "none" }, tcn + 0.26);
  pulse(L, X, Y, tcn, { r: RR[0] * 1.5, z: 10 + n - 1, cresce: 0.15, svanisce: 0.35, allarga: 1.2, a: 0.7 });
  tl.to(eC.tx, { borderColor: K.lime, boxShadow: `0 14px 34px rgba(0,0,0,.55), ${GLOW_A(0.6)}`, duration: 0.25 }, tcn);
  // la freccetta (il messaggio giusto) si pianta al centro: niente scossa della camera
  const tfr = P.freccia == null ? tcn + 0.9 : P.freccia;
  if (o.freccia !== false) B.hit(tfr, { shake: false, r: RR[1], dx: 1, dy: -0.55 }); // dall'alto a destra: la coda non copre l'etichetta del centro
  // 4) la camera: tiene (il movimento è la costruzione)
  // proporzioni: il bersaglio riempie l'area utile (reel 42: 0,55–0,75 della larghezza; qui ~0,8)
  const rect = [X - R - 10, Y - R - 10, X + R + 10, Y + R + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "fermo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], bordo: (a) => [X + Math.cos(a) * R, Y + Math.sin(a) * R] },
    elementi: { bersaglio: B, persone: pers, etichette: [eF, eC], titolo: T, L },
    tempi: { taglio: t0, costruito: tc0, fuori: tf, spegni: ts, centro: tcn, freccia: tfr },
  };
};

/* @scheda O24 · Calendario che si riempie (un reel vero al giorno)
 * quando: "30 giorni di contenuti", "uno al giorno vuol dire 30 video al mese", piani e frequenza di pubblicazione: il mese in
 *   vetro, i giorni ricevono in ordine un tuo reel vero che si muove, il contatore conta i video
 * frase: «Scegli un volume. Uno al giorno vuol dire 30 video al mese.» (15/10, 4,4–7,9 s)
 * durata: 3–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio), t1, X, Y (centro del calendario), parole: { riempie (parte il riempimento: es. «Uno»), conta
 *   (accento sul contatore: es. «video»), titolo ([…]) }
 * opzioni: titolo, media ([30 id video]: i tuoi reel, mini-clip in assets/clips/cal), mese ("Il tuo mese"; un mese vero con
 *   il suo start, es. "Novembre", 6), start (0 = lunedì, 6 = domenica), giorni (30), passo (s fra un giorno e l'altro, 0.04: tutto il mese in ~1,2 s), etichetta ("video"),
 *   cell (120), cellH (150), ingresso ("arrivo" default | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { giorno(i) (centro della cella i), contatore }, elementi { calendario, tiles, contatore, L },
 *   tempi { taglio, riempie, pieno, conta }
 * suoni: whoosh .14 al taglio · rise .06 sul riempimento · ding .1 su «conta»
 * regole: R2 il mese vuoto è già in scena al taglio, arrivo dal basso 140 px expo.out 0,7 s · R6 un solo riempimento in
 *   ordine, a passo costante (reel 67: 31 giorni in ~1,1 s, lineari; reel 68: reel veri nei giorni), ogni reel entra con
 *   popK (0,8 → 1 in 0,15 s, niente back.out) e il contatore conta insieme, lineare · R3 un accento sul contatore · R7
 *   sfondo fermo
 * prima: (demo-2 0–5 s · r03 35,5–38,8 s) fillVideos con 0,055 s a giorno e i reel che entravano da 0,5 con back.out(2,2);
 *   reel di altri creator
 * chiamata:
 *   TPL.O24({ t0: 27.2, t1: 31.0, X: 19600, Y: 900, parole: { riempie: 28.57, conta: 30.1,
 *     titolo: [28.57, 28.87, 29.0, 29.77, 30.1, 30.37, 30.5] } }, {
 *     titolo: [[{ t: "Uno al giorno " }, { t: "= 30 video", box: true }]],
 *     media: Array.from({ length: 30 }, (_, i) => "g" + String(i + 1).padStart(2, "0")) });
 */
TPL.O24 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const giorni = o.giorni || 30, cell = o.cell || 120, cellH = o.cellH || 150;
  // default: un mese generico che parte di lunedì (5 righe: il calendario riempie di più la larghezza, come il reel 67)
  const cal = calendar(L, X, Y, { mese: o.mese || "Il tuo mese", start: o.start == null ? 0 : o.start, giorni, cell, cellH, gap: 10, z: 12 });
  // il contatore dei video (pill lime in alto a destra del calendario, al posto del contatore interno)
  const cnt = layered(el(L, { position: "absolute", left: X + cal.W / 2 - 330, top: Y - cal.H / 2 + 26, width: 300, height: 74, borderRadius: 37, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(30,30,30,.9)", border: `2px solid ${K.lime}`, fontFamily: FS, fontWeight: 800, fontSize: 40, color: K.white, whiteSpace: "nowrap", zIndex: 20 }, svg("clapperboard", 38, K.lime, 2.4) + `<span>0 ${o.etichetta || "video"}</span>`));
  const cntN = cnt.querySelector("span");
  gsap.set([cal.c, cnt], { opacity: 0 });
  tplMonta(t0, (t) => tl.to([cal.c, cnt], { opacity: 1, duration: 0.2 }, t), () => gsap.set([cal.c, cnt], { opacity: 1 }));
  // il riempimento: un reel vero per giorno, in ordine, a passo costante (R6); ogni reel entra con popK (R5)
  const tr = P.riempie == null ? t0 + 0.6 : P.riempie, st = o.passo || 0.04;
  const tiles = (o.media || []).slice(0, giorni).map((id, k) => {
    const cl = cal.cells[k];
    const tile = mediaTile(cl.b, 0, 0, cell, cellH, id, 4);
    tile.style.borderRadius = "15px";
    popK(tile, tr + k * st, { da: 0.8, dur: 0.15 });
    tl.to(cl.n, { color: "#ffffff", textShadow: "0 1px 6px rgba(0,0,0,.95), 0 0 2px rgba(0,0,0,.9)", duration: 0.08 }, tr + k * st);
    tl.to(cl.b, { borderColor: "rgba(255,255,255,.35)", duration: 0.1 }, tr + k * st);
    return tile;
  });
  const n = tiles.length || giorni, et = o.etichetta || "video", V = { v: 0 };
  tl.fromTo(V, { v: 0 }, { v: n, duration: n * st + 0.1, ease: "none", immediateRender: false, onUpdate: () => (cntN.textContent = `${Math.round(V.v)} ${et}`) }, tr);
  const tp = tr + n * st + 0.1;
  // accento sul contatore (es. «video»)
  const tc = P.conta == null ? tp + 0.3 : P.conta;
  tl.to(cnt, { background: limeFill(1), color: K.ink, boxShadow: GLOW_A(0.8), duration: 0.2, ease: "power2.out" }, tc);
  const ic = cnt.querySelector("svg");
  if (ic) tl.to(ic, { attr: { stroke: K.ink }, duration: 0.2 }, tc);
  // la camera: arrivo che frena, poi tiene
  const rect = [X - cal.W / 2 - 10, Y - cal.H / 2 - 10, X + cal.W / 2 + 10, Y + cal.H / 2 + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  const cellXY = (i) => { const j = (o.start == null ? 0 : o.start) + i; return [X - cal.W / 2 + cal.pad + (j % 7) * (cell + 10) + cell / 2, Y - cal.H / 2 + cal.head + Math.floor(j / 7) * (cellH + 10) + cellH / 2]; };
  return {
    rect, pose,
    ancore: { giorno: cellXY, contatore: [X + cal.W / 2 - 180, Y - cal.H / 2 + 63] },
    elementi: { calendario: cal, tiles, contatore: cnt, titolo: T, L },
    tempi: { taglio: t0, riempie: tr, pieno: tp, conta: tc },
  };
};

/* @scheda O23 · Griglia di 100 puntini (la suddivisione in percentuali)
 * quando: percentuali e suddivisioni ("70% valore, 20% fiducia, 10% conversione", "8 su 10", "il 95% ignora…"): 100
 *   puntini in vetro, ogni gruppo si accende del suo colore sulla parola che lo nomina, con la sua voce di legenda sotto
 * frase: «Io uso 70% valore, 20% fiducia, 10% conversione.» (15/10, 10,3–15,4 s)
 * durata: 3,5–6 s (consigliata 4,5–5)
 * scena: t0 (taglio), t1, X, Y (centro), parole: { gruppi: [tempo per gruppo] (es. «valore», «fiducia», «conversione»),
 *   titolo ([…]) }
 * opzioni: titolo, gruppi ([{ n, nome, stile: "lime" | "bianco" | "anello" }], somma 100), cols / rows (10), gap (80), r (22),
 *   passo (s fra un puntino e l'altro nel gruppo, 0.012), ingresso ("arrivo" default | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { puntino(i), voce(g) }, elementi { griglia, voci, L }, tempi { taglio, gruppi }
 * suoni: whoosh .14 al taglio · tick .05 per gruppo
 * regole: R2 i 100 puntini grigi e la legenda spenta già in scena al taglio, arrivo dal basso 140 px expo.out 0,7 s · R6 ogni
 *   gruppo si colora in ordine, riga per riga, a passo costante (reel 88: i puntini si accendono in ~2 s, il cambio di colore
 *   in un fotogramma) · R3 un accento per gruppo, sulla parola (la voce di legenda si accende insieme) · R7 sfondo fermo
 * prima: (demo-2 5 s) dotGrid con l'onda di comparsa dopo il taglio e split() in un colpo solo
 * chiamata:
 *   TPL.O23({ t0: 31.15, t1: 36.3, X: 22600, Y: 900, parole: { gruppi: [33.08, 34.55, 35.92],
 *     titolo: [32.2, 33.08, 34.55, 35.92] } }, {
 *     titolo: [[{ t: "70 · 20 · " }, { t: "10", box: true }]],
 *     gruppi: [{ n: 70, nome: "Valore", stile: "lime" }, { n: 20, nome: "Fiducia", stile: "bianco" }, { n: 10, nome: "Conversione", stile: "anello" }] });
 */
TPL.O23 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  // proporzioni (blocco 2): griglia larga ~0,7 dello schermo (prima stesura 0,56 con gap 70: troppo piccola)
  const cols = o.cols || 10, rows = o.rows || 10, gap = o.gap || 80, r = o.r || 22;
  const G = o.gruppi || [{ n: 70, nome: "Valore", stile: "lime" }, { n: 20, nome: "Fiducia", stile: "bianco" }, { n: 10, nome: "Conversione", stile: "anello" }];
  const legH = 88, legGap = 30;
  const GW = (cols - 1) * gap + 2 * r + 80, GH = (rows - 1) * gap + 2 * r + 80;
  const yG = Y - (GH + legGap + legH) / 2 + GH / 2;
  const DG = dotGrid(L, X, yG, { cols, rows, gap, r, z: 12 });
  const STY = {
    lime: { background: K.lime, boxShadow: GLOW_A(0.7), border: "0px solid rgba(0,0,0,0)" },
    bianco: { background: "#ffffff", boxShadow: "0 0 12px rgba(255,255,255,.75)", border: "0px solid rgba(0,0,0,0)" },
    anello: { background: "#1c1c1c", boxShadow: GLOW_A(0.5), border: `5px solid ${K.lime}` },
  };
  gsap.set(DG.dots, { border: "0px solid rgba(0,0,0,0)", boxSizing: "border-box" });
  // la legenda: una voce per gruppo, in riga sotto la griglia (spenta finché il gruppo non è detto)
  const leg = layered(el(L, { position: "absolute", left: X - 600, top: yG + GH / 2 + legGap, width: 1200, height: legH, display: "flex", justifyContent: "center", gap: 16, zIndex: 14 }));
  const voci = G.map((g) => {
    const v = el(leg, { display: "flex", alignItems: "center", gap: 12, padding: "0 18px", height: legH, borderRadius: legH / 2, background: "rgba(34,34,34,.92)", border: "2px solid rgba(255,255,255,.18)", fontFamily: FS, fontWeight: 800, fontSize: 34, color: "#8d8d8d", whiteSpace: "nowrap" });
    const sw = el(v, Object.assign({ width: 34, height: 34, borderRadius: "50%", boxSizing: "border-box", flex: "none" }, STY[g.stile || "lime"]));
    el(v, {}, `${g.n}% ${g.nome}`, "span");
    gsap.set(sw, { opacity: 0.35 });
    return { v, sw };
  });
  // 1) prima del taglio: i 100 puntini grigi e la legenda spenta (R2)
  gsap.set(leg, { opacity: 0 });
  tplMonta(t0, (t) => { tl.to(DG.dots, { opacity: 1, duration: 0.2 }, t); tl.to(leg, { opacity: 1, duration: 0.2 }, t); },
    () => { gsap.set(DG.dots, { opacity: 1 }); gsap.set(leg, { opacity: 1 }); });
  // 2) gli accenti: ogni gruppo si colora in ordine (riga per riga, passo costante) sulla sua parola, con la sua voce
  const TG = P.gruppi || G.map((_, i) => t0 + 0.9 + i * 1.2);
  const st = o.passo || 0.012;
  let k = 0;
  G.forEach((g, gi) => {
    const t = TG[gi];
    for (let q = 0; q < g.n && k < DG.dots.length; q++, k++) tl.to(DG.dots[k], Object.assign({ duration: 0.06 }, STY[g.stile || "lime"]), t + q * st);
    tl.to(voci[gi].v, { color: K.white, borderColor: g.stile === "bianco" ? "#ffffff" : K.lime, boxShadow: g.stile === "bianco" ? "0 0 18px rgba(255,255,255,.35)" : GLOW_A(0.45), duration: 0.2 }, t);
    tl.to(voci[gi].sw, { opacity: 1, duration: 0.2 }, t);
  });
  // 3) la camera: arrivo che frena, poi tiene
  const LW = o.legendaW || 980; // la riga della legenda è più larga della griglia
  const rect = [X - Math.max(GW, LW) / 2 - 10, yG - GH / 2 - 10, X + Math.max(GW, LW) / 2 + 10, yG + GH / 2 + legGap + legH + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  const dotXY = (i) => [X - GW / 2 + 40 + (i % cols) * gap + r, yG - GH / 2 + 40 + Math.floor(i / cols) * gap + r];
  return {
    rect, pose,
    ancore: { puntino: dotXY, voce: (g) => [X, yG + GH / 2 + legGap + legH / 2] },
    elementi: { griglia: DG, voci, L, titolo: T },
    tempi: { taglio: t0, gruppi: TG },
  };
};
