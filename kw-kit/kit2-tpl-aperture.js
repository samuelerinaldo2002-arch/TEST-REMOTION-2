// ═══ KW kit v2 · TEMPLATE · aperture, hook visivi dei primi 3 s (A) — blocco 3 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═══
// Stesso standard di kit2-template.js (scheda @scheda, TPL.<ID>(scena, opzioni) → { rect, pose, ancore, elementi, tempi }).
// Le scene di prova sono in CATALOGO-ANIMAZIONI/ritmo-03 (KW_RITMO).

/* @scheda A01 · Muro di reel veri con i badge views (l'hook: i contenuti che guardi, e il posto vuoto del tuo)
 * quando: hook su formati, tendenze, "cosa funziona", prova sociale, "stai guardando i contenuti degli altri": dal primo
 *   fotogramma una griglia di reel veri di altri creator (in movimento); i badge verdi con le visualizzazioni vere poppano uno
 *   dopo l'altro mentre il titolo si scrive; sulla parola che parla di te il muro si spegne e davanti compare il tuo posto vuoto
 * frase: «Non ti mancano le idee. Stai guardando i contenuti degli altri invece di fare i tuoi.» (02/10, 0–4,4 s)
 * durata: 3–5,5 s (consigliata 4–5)
 * scena: t0 (taglio, o il fotogramma 0 del reel), t1, X, Y (centro della griglia), parole: { badge (i badge poppano, es.
 *   «contenuti»), tuoi (il muro si spegne e compare il tuo posto, es. «tuoi»), titolo ([…]) }
 * opzioni: media ([6 id video di altri creator], griglia 3 × 2), views (["2,2M", …]: le visualizzazioni VERE di quei video),
 *   tu ("tu": il tuo posto vuoto con la tua foto; false = niente), cw (larghezza delle card, 272), ingresso ("zoom" default |
 *   "arrivo" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { centro, card(i), tu }, elementi { card, badge, posto, L }, tempi { taglio, badge, tuoi }
 * suoni: whoosh .14 al taglio · tick .04 per ogni badge · pop .1 su «tuoi»
 * regole: A01 misurato (reel 25, 84, 96 e 1 ai primi 3 s): griglia 3 × 2 di reel 9:16 larga ~0,70–0,76 dello schermo, i badge
 *   poppano 0,66 → 1 in 0,13 s, uno ogni 0,07–0,13 s (prima la riga in alto); Kallaway costruisce la griglia nei primi 0,3 s →
 *   con R2 la griglia è già piena al taglio e il movimento principale è uno zoom d'arrivo (+12% in 0,4 s power2.out) · R3 due
 *   accenti (i badge, il tuo posto) · R5 niente back.out · R7 sfondo fermo · le card spente con fromTo dal filtro esplicito
 *   (niente fotogramma nero) · visualizzazioni vere dei video sorgente, mai inventate
 * prima: (demo-8 17,25–23,2 s) reelWall che entrava sfocato (0,45 s), le card a cascata e popSeq con back.out(2,4)
 * chiamata:
 *   TPL.A01({ t0: 1.0, t1: 5.95, X: 600, Y: 900, parole: { badge: 3.6, tuoi: 5.27, titolo: [1.1, 1.3, 1.47, 1.9, 2.07] } }, {
 *     titolo: [[{ t: "Non ti mancano " }, { t: "le idee", box: true }]],
 *     media: ["a1", "a2", "a3", "a4", "a5", "a6"], views: ["2,2M", "114K", "136K", "675K", "75K", "19K"], tu: "tu" });
 */
TPL.A01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const media = o.media || [], V = o.views || [];
  const cols = o.cols || 3, rows = Math.ceil(media.length / cols);
  const cw = o.cw || 272, ch = Math.round((cw * 16) / 9), gx = 28, gy = 52;
  const W = cols * cw + (cols - 1) * gx, H = rows * ch + (rows - 1) * gy, x0 = X - W / 2, y0 = Y - H / 2;
  const card = [], badge = [];
  media.forEach((id, i) => {
    const x = x0 + (i % cols) * (cw + gx), y = y0 + Math.floor(i / cols) * (ch + gy);
    const c = layered(el(L, { position: "absolute", left: x, top: y, width: cw, height: ch, borderRadius: 20, overflow: "hidden", background: "#111", border: "2px solid rgba(255,255,255,.22)", boxShadow: "0 28px 64px rgba(0,0,0,.6)", zIndex: 12 }));
    mediaTile(c, 0, 0, cw, ch, id, 1);
    card.push(c);
    if (V[i]) badge.push(viewBadge(L, x + cw / 2, y + ch + 2, V[i], { fs: 34, z: 16 }));
  });
  // il tuo posto (vuoto, tratteggiato): la tua foto vera col «+», davanti al muro
  let posto = null;
  if (o.tu !== false) {
    const pw = Math.round(cw * 1.4), ph = Math.round((pw * 16) / 9);
    posto = layered(el(L, { position: "absolute", left: X - pw / 2, top: Y - ph / 2, width: pw, height: ph, borderRadius: 24, background: "linear-gradient(180deg, rgba(40,44,32,.97), rgba(22,24,18,.98))", border: `4px dashed ${K.lime}`, boxShadow: `0 40px 90px rgba(0,0,0,.7), ${GLOW_A(0.6)}`, zIndex: 30 }));
    const ad = Math.round(pw * 0.56);
    avatar(posto, pw / 2, ph * 0.42, ad, o.tu || "tu", { bw: 5, z: 2 });
    const pd = Math.round(ad * 0.34);
    el(posto, { position: "absolute", left: pw / 2 + ad * 0.5 - pd * 0.75, top: ph * 0.42 + ad * 0.5 - pd * 0.75, width: pd, height: pd, borderRadius: "50%", background: K.lime, boxShadow: GLOW_A(0.8), display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }, svg("plus", Math.round(pd * 0.66), K.ink, 3.4));
    el(posto, { position: "absolute", left: 0, top: ph * 0.42 + ad * 0.5 + 34, width: pw, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: 46, color: K.lime, textShadow: GLOW_LT, whiteSpace: "nowrap", zIndex: 3 }, o.etichettaTu || "Il tuo");
    gsap.set(posto, { opacity: 0 });
  }
  // 1) prima del taglio: la griglia è già piena (R2)
  gsap.set(card, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(card, { opacity: 1, duration: 0.2 }, t), () => gsap.set(card, { opacity: 1 }));
  // 2) accento 1: i badge views poppano uno dopo l'altro (prima la riga in alto), 0,66 → 1 in 0,13 s
  const tb = P.badge == null ? t0 + 0.9 : P.badge;
  badge.forEach((b, i) => popK(b, tb + i * (o.passo || 0.08), { da: 0.66, dur: 0.13 }));
  // 3) accento 2: «i tuoi» — il muro si spegne (fromTo dal filtro esplicito) e davanti compare il tuo posto
  const tt = P.tuoi == null ? t1 - 0.9 : P.tuoi;
  if (posto) {
    tl.fromTo(card, { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(.85) brightness(.45)", duration: 0.3, ease: "power2.out", immediateRender: false }, tt);
    tl.to(badge, { opacity: 0.35, duration: 0.3 }, tt);
    popK(posto, tt + 0.04, { da: 0.88, dur: 0.18 });
  }
  // 4) la camera: zoom d'arrivo (+12% in 0,4 s power2.out), poi tiene
  const rect = [x0 - 14, y0 - 14, x0 + W + 14, y0 + H + 36];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.99 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "zoom", ds: 0.12, top: 380, fill: o.fill || 0.99 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], card: (i) => [x0 + (i % cols) * (cw + gx) + cw / 2, y0 + Math.floor(i / cols) * (ch + gy) + ch / 2], tu: [X, Y] },
    elementi: { card, badge, posto, titolo: T, L },
    tempi: { taglio: t0, badge: tb, tuoi: tt },
  };
};
