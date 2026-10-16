// ═══ KW kit v2 · TEMPLATE · titoli e testo (T) — blocco 1 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═════════════
// Stesso standard di kit2-template.js. Scene di prova in CATALOGO-ANIMAZIONI/ritmo-01 (KW_RITMO).

/* @scheda T05 · Etichetta tecnica che si decodifica (glitch) sopra ciò che descrive
 * quando: un nome o un'etichetta "tecnica" che entra (<Algoritmo/>, codice, dati, un lower third col nome): le lettere
 *   cambiano a caso per qualche fotogramma e si fermano sulla parola; qui l'algoritmo che sceglie i contenuti da mostrare
 * frase: «L'algoritmo ci mostra soprattutto i contenuti con tantissima interazione.» (14/10, 6,7–10,9 s)
 * durata: 3–5 s (consigliata 4)
 * scena: t0 (taglio: l'etichetta si decodifica subito), t1, X, Y (centro della fila), parole: { decodifica (default t0 +
 *   0,05), mostra (le linee scendono ai contenuti), interazione (i numeri corrono e si accendono), titolo ([…]) }
 * opzioni: etichetta ("<Algoritmo/>"), media ([3 id video del pool]: i contenuti), numeri ([{ da, a, fmt, icona }] uno per
 *   contenuto), titolo, ingresso ("arrivo" default | "zoom" | "nessuno"), fermo (R7, default true)
 * restituisce: rect, pose, ancore { etichetta, card(i) }, elementi { pill, card, numeri, linee, L }, tempi { taglio,
 *   decodifica, mostra, interazione }
 * suoni: whoosh .14 al taglio · glitch .1 sulla decodifica · tick .05 sulle linee · rise .06 sui numeri
 * regole: R2 pill, card e numeri già in scena al taglio; il testo della pill si decodifica subito (reel 149: 5 fotogrammi di
 *   glifi a caso, ~0,2 s, monospazio, poi la parola) insieme all'arrivo che frena (140 px expo.out) · R3 due accenti sulle
 *   parole: le linee verso i contenuti, i numeri che corrono · R6 conteggi continui, lineari · R5 niente rimbalzi
 * prima: (demo 20,55 s) decode() su un'etichetta del risultato, dopo che la scena si era costruita
 * chiamata:
 *   TPL.T05({ t0: 26.95, t1: 31.45, X: 14000, Y: 900, parole: { mostra: 28.34, interazione: 30.0,
 *     titolo: [27.1, 28.34, 29.3, 30.0, 30.54] } }, {
 *     titolo: [[{ t: "L'algoritmo " }, { t: "mostra", box: true }], [{ t: "chi ha tantissima interazione", hand: true }]],
 *     media: ["e1", "e2", "e3"], numeri: [{ da: 120, a: 1200 }, { da: 90, a: 860 }, { da: 240, a: 2400 }] });
 */
TPL.T05 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const testo = o.etichetta || "<Algoritmo/>";
  const media = o.media || [], n = Math.max(1, media.length);
  const w = o.w || 250, h = Math.round((w * 16) / 9), g = 44, RW = n * w + (n - 1) * g, x0 = X - RW / 2;
  const cx = (i) => x0 + w / 2 + i * (w + g);
  const yC = Y + 30; // centro delle card
  // la pill tecnica (stessa di algoPill), sopra la fila
  const yP = yC - h / 2 - 150;
  const pill = algoPill(L, X, yP, { testo, fs: 44, z: 20 });
  // i contenuti: reel veri con il numero d'interazione sotto
  const S = svgLayer(L, 6, X - 3000, Y - 3000, 6000, 6000);
  const fmtK = (v) => (v >= 1000 ? (v / 1000).toFixed(1).replace(".", ",").replace(",0", "") + " Mln" : Math.round(v) + "K");
  const card = media.map((id, i) => {
    const c = layered(el(L, { position: "absolute", left: cx(i) - w / 2, top: yC - h / 2, width: w, height: h, borderRadius: 22, overflow: "hidden", background: "#111", border: "2px solid rgba(255,255,255,.26)", boxShadow: "0 24px 60px rgba(0,0,0,.6)", zIndex: 12 }));
    mediaTile(c, 0, 0, w, h, id, 1);
    return c;
  });
  const NU = o.numeri || media.map(() => ({ da: 100, a: 1000 }));
  const numeri = NU.map((q, i) => {
    const b = el(L, { position: "absolute", left: cx(i) - 115, top: yC + h / 2 - 34, width: 230, height: 68, borderRadius: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(180deg,#3b3b3b,#232323)", border: "1.5px solid rgba(255,255,255,.25)", boxShadow: "0 12px 26px rgba(0,0,0,.55)", fontFamily: FD, fontWeight: 700, fontSize: 34, color: K.white, whiteSpace: "nowrap", zIndex: 16 }, svg(q.icona || "heart", 30, K.lime, 2.6));
    const tx = el(b, { whiteSpace: "nowrap" }, (q.fmt || fmtK)(q.da), "span");
    return { b, tx, q };
  });
  const linee = card.map((_, i) => connector(S, [[X + (i - (n - 1) / 2) * 70, yP + pill.h / 2], [cx(i), yC - h / 2 - 6]], { curve: "v", w: 3, color: "rgba(207,251,80,.8)", glow: true }));
  // 1) prima del taglio: tutto in scena (R2); il testo della pill è vuoto finché non si decodifica
  tplMonta(t0, (t) => tl.set(pill.g, { opacity: 1 }, t), () => gsap.set(pill.g, { opacity: 1 }));
  // 2) al taglio: la decodifica (T05, ~0,25 s, un glifo nuovo a ogni fotogramma) + l'arrivo che frena (sotto)
  const td = P.decodifica == null ? t0 + 0.05 : P.decodifica;
  decode(pill.tx, testo, td, o.durDecodifica || 0.25);
  // 3) accento: le linee scendono dall'algoritmo ai contenuti che mostra
  const tm = P.mostra == null ? t0 + 1.2 : P.mostra;
  linee.forEach((c, i) => c.draw(tm + i * 0.07, 0.35, "power2.out"));
  // 4) accento: «tantissima interazione» — i numeri corrono (continui) e si accendono di lime
  const ti = P.interazione == null ? tm + 1.4 : P.interazione;
  numeri.forEach(({ b, tx, q }) => {
    const V = { v: q.da }, f = q.fmt || fmtK;
    tl.to(V, { v: q.a, duration: 0.6, ease: "none", onUpdate: () => (tx.textContent = f(V.v)) }, ti);
    tl.to(b, { borderColor: "rgba(207,251,80,.95)", boxShadow: `${GLOW_A(0.6)}, 0 12px 26px rgba(0,0,0,.55)`, duration: 0.2 }, ti + 0.6);
    glowFlash(tx, ti + 0.6);
  });
  // 5) la camera: arrivo dal basso che frena, poi tiene
  const rect = [x0 - 30, yP - pill.h / 2 - 30, x0 + RW + 30, yC + h / 2 + 60];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { etichetta: [X, yP], card: (i) => [cx(i), yC] },
    elementi: { pill, card, numeri, linee, titolo: T, L },
    tempi: { taglio: t0, decodifica: td, mostra: tm, interazione: ti },
  };
};

// ═══ blocco 3 del rifacimento (ritmo-03) ═══════════════════════════════════════════════════════════════════════════════════
// T01 e T02 sono il titolo di tutte le scene: si appoggiano a tplTitoloK (kit2-template.js) e a titleW, niente secondo sistema
// di titoli. Il template costruisce la scena d'apertura in cui il titolo è il protagonista.

/* @scheda T01 · Titolo parola per parola, sincronizzato alla voce (l'apertura: il titolo e il reel che cambia sulle parole)
 * quando: l'hook e i titoli di sezione ("Ci sono solo tre emozioni…", "L'errore numero uno…"): ogni parola del titolo compare
 *   nell'istante in cui è detta; sotto, il reel di cui parla il titolo, che cambia clip sulle prime parole (il montaggio del reel
 *   79) e la barra di avanzamento che arriva in fondo
 * frase: «Ci sono solo tre emozioni che tengono qualcuno davanti a un video fino alla fine.» (07/10, 0–4,5 s)
 * durata: 3–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1, X, Y (centro del reel), parole: { titolo ([tempo per parola]: OBBLIGATORIO, è la voce), cambi ([tempi
 *   in cui il reel cambia clip], default le prime parole del titolo), chi (la persona davanti al video, es. «qualcuno»), barra
 *   (parte la barra, es. «tengono»), fine (la barra arriva in fondo, es. «fine») }
 * opzioni: titolo (righe di titleW: solo parole dette, un tempo per parola), media ([id dei tuoi reel]: il primo al taglio, gli
 *   altri sui cambi), chi (true: la sagoma di profilo sul disco bianco davanti al reel), titoloSize (88), w (larghezza del reel,
 *   470), ingresso ("arrivo" default | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { reel, chi }, elementi { card, clip, barra, chi, titolo, L }, tempi { taglio, cambi, barra, fine }
 * suoni: whoosh .14 al taglio · tick .04 sui cambi · rise .05 sulla barra · ding .08 su «fine»
 * regole: T01 misurato (reel 79 e 1, note-effetti E01): ogni parola compare quando è detta, grigia e sfocata (9 px, +5 px) →
 *   bianca e nitida in 0,2 s power2.out; il titolo resta nell'HUD (tplTitoloK, come in tutte le scene) · R2 il reel è già in scena
 *   al taglio, arrivo dal basso 140 px expo.out 0,7 s, poi la camera tiene · R3 accenti sulle parole: i cambi di clip (taglio
 *   secco dentro la card, come i 3 cambi in 0,5 s del reel 79), la sagoma su «qualcuno», la barra che corre lineare (R6) e si
 *   accende in fondo · R5 niente rimbalzi · R7 sfondo fermo
 * prima: (demo 0–1,3 s) titleW dal taglio a 0,12 s per parola, non sulla voce, sopra una scena che si costruiva
 * chiamata:
 *   TPL.T01({ t0: 5.95, t1: 11.0, X: 3600, Y: 900, parole: { titolo: [6.42, 6.68, 7.15, 9.95, 10.18, 10.32],
 *     cambi: [6.42, 6.68, 7.15], chi: 8.78, barra: 8.42, fine: 10.32 } }, {
 *     titolo: [[{ t: "Solo tre " }, { t: "emozioni", box: true }], [{ t: "fino alla fine", hand: true }]],
 *     media: ["t1", "t2", "t3", "t4"], chi: true });
 */
TPL.T01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const media = o.media || [];
  const w = o.w || 500, h = Math.round((w * 16) / 9), x0 = X - w / 2, y0 = Y - h / 2;
  // il reel: le clip impilate, ogni cambio ne scopre una nuova (taglio secco dentro la card)
  const card = layered(el(L, { position: "absolute", left: x0, top: y0, width: w, height: h, borderRadius: Math.round(w * 0.07), overflow: "hidden", background: "#111", border: "2.5px solid rgba(255,255,255,.26)", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 40px rgba(255,255,255,.06)", zIndex: 12 }));
  const clip = media.map((id, i) => { const c = mediaTile(card, 0, 0, w, h, id, 1 + i); if (i) gsap.set(c, { opacity: 0 }); return c; });
  // la barra di avanzamento di Instagram in fondo al reel
  el(card, { position: "absolute", left: 0, top: h - 150, width: w, height: 150, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.55))", zIndex: 20 });
  const bw = w - 52;
  const track = el(card, { position: "absolute", left: 26, top: h - 34, width: bw, height: 8, borderRadius: 4, background: "rgba(255,255,255,.32)", zIndex: 21 });
  const barra = el(track, { position: "absolute", left: 0, top: 0, width: bw, height: 8, borderRadius: 4, background: "#ffffff", transformOrigin: "0 50%" });
  gsap.set(barra, { scaleX: 0.03 });
  // chi guarda: la sagoma di profilo sul disco bianco, davanti al reel (mai un volto vero)
  let chi = null;
  const dC = 220, cx = x0 - 36, cy = y0 + h * 0.64;
  if (o.chi) { chi = layered(el(L, { position: "absolute", left: cx - dC / 2, top: cy - dC / 2, width: dC, height: dC, borderRadius: "50%", boxShadow: "0 24px 60px rgba(0,0,0,.6), 0 0 0 5px rgba(255,255,255,.9)", zIndex: 16 })); personaK(chi, 0, 0, dC, { z: 1 }); }
  // 1) prima del taglio: il reel c'è già (R2); la sagoma no (arriva sulla parola)
  gsap.set(card, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(card, { opacity: 1, duration: 0.2 }, t), () => gsap.set(card, { opacity: 1 }));
  // 2) accenti: i cambi di clip sulle prime parole del titolo
  const TT = P.titolo || [];
  const cambi = P.cambi || TT.slice(0, Math.max(0, clip.length - 1));
  cambi.forEach((t, i) => { if (clip[i + 1]) tl.set(clip[i + 1], { opacity: 1 }, t); });
  // la persona davanti al video
  const tc = P.chi == null ? t0 + 1.6 : P.chi;
  if (chi) popK(chi, tc, { da: 0.8, dur: 0.15 });
  // la barra corre lineare fino in fondo e si accende (R6)
  const tb = P.barra == null ? t0 + 0.3 : P.barra, tf = P.fine == null ? t1 - 0.6 : P.fine;
  tl.fromTo(barra, { scaleX: 0.03 }, { scaleX: 1, duration: Math.max(0.4, tf - tb), ease: "none", immediateRender: false }, tb);
  tl.to(barra, { background: K.lime, boxShadow: GLOW_A(0.9), duration: 0.15 }, tf);
  tl.to(card, { borderColor: "rgba(207,251,80,.9)", boxShadow: `0 40px 90px rgba(0,0,0,.6), ${GLOW_A(0.7)}`, duration: 0.2 }, tf);
  // 3) la camera: arrivo dal basso che frena, poi tiene
  const rect = [(chi ? cx - dC / 2 : x0) - 12, y0 - 12, x0 + w + 12, y0 + h + 12];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, Object.assign({ titoloSize: 88 }, o));
  return {
    rect, pose,
    ancore: { reel: [X, Y], chi: [cx, cy] },
    elementi: { card, clip, barra, chi, titolo: T, L },
    tempi: { taglio: t0, cambi, barra: tb, fine: tf },
  };
};

/* @scheda T02 · Box evidenziatore che cresce insieme alle parole (la parola chiave del titolo, lettera per lettera)
 * quando: la parola chiave del titolo (il problema, il risultato, il nome del metodo: «l'algoritmo delle storie», «il più
 *   grande trucco», «un milione di views»): un cursore sottile, poi il box si allarga da sinistra e il bordo avanza con le
 *   lettere; sotto, l'oggetto di cui parla il titolo (qui la fila delle storie con l'algoritmo che le mette in ordine)
 * frase: «Ecco come funziona davvero l'algoritmo delle storie su Instagram.» (10/10, 0–3,6 s)
 * durata: 3–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio), t1, X, Y (centro della fila), parole: { titolo ([tempo per parola]; il box parte dal tempo della sua
 *   prima parola e cresce a boxCps), storie (le linee scendono dall'algoritmo e gli anelli si accendono, es. «storie»), tu (la
 *   tua storia diventa la prima, lime, es. «Instagram») }
 * opzioni: titolo (il segmento box: true; con titoloSize 66 il box sta su una riga fino a ~24 lettere), boxCps (100: caratteri
 *   al secondo del box; misurato sul reel 7: riempimento 10 → 90% in 0,16 s, tutto in ~0,25 s), storie ([{ src: "tu" | handle | { anon: true }, nome, plus }] 3–5, default la tua + 3 sagome), algoritmo
 *   ("<Algoritmo/>"; false = niente pill), ingresso ("arrivo" default | "zoom" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { pill, storia(i) }, elementi { pill, cerchi, linee, titolo, L }, tempi { taglio, storie, tu }
 * suoni: whoosh .14 al taglio · key1 .05 sul box · tick .05 su «storie» · ding .08 su «tu»
 * regole: T02 misurato (reel 7 a 5,2 s e reel 1 a 0,3 s, note-effetti E02): prima un cursore sottile (~6 px), poi il box cresce
 *   da sinistra con le lettere (cambio.py sui pixel rossi: 10 → 90% in 0,16 s, «Used To Speedrun His Growth» tutto in ~0,25 s,
 *   prima che la voce lo dica), le lettere dietro il bordo bianche, quelle
 *   davanti grigie e sfocate, niente rimbalzo → titleW con l'opzione in coda boxCps (tplTitoloK → tplTitolo → titleW, lo stesso
 *   titolo di tutte le scene) · R2 pill e fila delle storie già in scena al taglio, arrivo dal basso che frena · R3 due accenti
 *   sulle parole (le linee e gli anelli a onda, la tua storia lime) · R5 · R7
 * prima: (demo 0–1,3 s) il box nasceva sottile e cresceva a pezzi, una parola alla volta in 0,22 s power2.out
 * chiamata:
 *   TPL.T02({ t0: 22.85, t1: 27.0, X: 13600, Y: 950, parole: { titolo: [23.22, 23.42, 23.98, 24.88, 25.62, 25.78],
 *     storie: 25.78, tu: 26.22 } }, {
 *     titolo: [[{ t: "Come funziona davvero" }], [{ t: "l'algoritmo delle storie", box: true }]], titoloSize: 66,
 *     storie: [{ src: "tu", nome: "La tua storia", plus: true }, { src: { anon: true }, nome: "giulia" }, …],
 *     ingresso: "nessuno", fermoDa: 23.55 });
 *   tplTenuta(tplPan(22.8, S.T02.pose, { dur: 0.75 }), 27.0, 0.008);   // ritmo-03: la camera continua il viaggio di K03
 *   // la tua storia (ancore.storia(0)) è un buon punto per lo zoom-through verso la scena dopo (match cut sulla tua foto)
 */
TPL.T02 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const ST = o.storie || [{ src: "tu", nome: "La tua storia", plus: true }, { src: { anon: true }, nome: "giulia" }, { src: { anon: true }, nome: "marco" }, { src: { anon: true }, nome: "sara" }];
  const n = ST.length, d = o.d || 214, g = o.gap || 46, RW = n * d + (n - 1) * g;
  const cxs = ST.map((_, i) => X - RW / 2 + d / 2 + i * (d + g));
  // la fila delle storie (anelli già visti, grigi: si accendono quando l'algoritmo le distribuisce)
  const cerchi = ST.map((s, i) => storyCircle(L, cxs[i], Y, d, s.src, { ring: "visto", nome: s.nome, plus: s.plus, fs: 36, lw: d + 40, z: 14 }));
  // l'algoritmo sopra, con le linee verso ogni storia
  const yP = Y - d / 2 - 380;
  let pill = null;
  const S = svgLayer(L, 8, X - 3000, Y - 3000, 6000, 6000);
  if (o.algoritmo !== false) { pill = algoPill(L, X, yP, { testo: o.algoritmo || "<Algoritmo/>", fs: 54, z: 20 }); pill.tx.textContent = o.algoritmo || "<Algoritmo/>"; }
  const linee = pill ? cxs.map((x, i) => connector(S, [[X + (i - (n - 1) / 2) * 56, yP + pill.h / 2], [x, Y - d / 2 - 10]], { curve: "v", w: 3, color: "rgba(207,251,80,.75)", glow: true })) : [];
  // 1) prima del taglio: pill e fila già in scena (R2)
  if (pill) tplMonta(t0, (t) => tl.set(pill.g, { opacity: 1 }, t), () => gsap.set(pill.g, { opacity: 1 }));
  // 2) accento 1: l'algoritmo distribuisce le storie (linee a onda, anelli a gradiente)
  const ts = P.storie == null ? t0 + 1.6 : P.storie;
  linee.forEach((c, i) => c.draw(ts + i * 0.06, 0.32, "power2.out"));
  cerchi.forEach((c, i) => c.ig(ts + 0.18 + i * 0.06, 0.18));
  // 3) accento 2: la tua storia diventa la prima (anello lime, alone)
  const tu = P.tu == null ? ts + 0.6 : P.tu;
  const iTu = Math.max(0, ST.findIndex((s) => s.src === "tu"));
  cerchi[iTu].lime(tu, 0.2);
  if (linee[iTu]) tl.to(linee[iTu].p, { attr: { "stroke-width": 6 }, duration: 0.2 }, tu);
  // 4) la camera: arrivo dal basso che frena, poi tiene
  const rect = [X - RW / 2 - 20, (pill ? yP - pill.h / 2 : Y - d / 2) - 20, X + RW / 2 + 20, Y + d / 2 + 90];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 400, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 400, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, Object.assign({ boxCps: 100 }, o));
  return {
    rect, pose,
    ancore: { pill: [X, yP], storia: (i) => [cxs[i], Y] },
    elementi: { pill, cerchi, linee, titolo: T, L },
    tempi: { taglio: t0, storie: ts, tu },
  };
};
