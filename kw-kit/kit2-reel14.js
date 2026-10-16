// ═══ KW kit v2 · reel 14/10 («Se non diventi virale…», sotto-agente della regia, 15/10) ════════════════════════════════════
// Solo funzioni piccole per le frasi senza un template adatto (PROMPT-REEL-14-16.md, Parte B). Stesso schema dei template:
// (scena, opzioni) → { rect, pose, ancore, elementi, tempi }, montaggio prima del taglio, un movimento principale al taglio,
// 2–3 accenti sulle parole, niente back.out, fromTo dei filtri da un valore esplicito (niente fotogramma nero).

// vergognaR14 · «E nasce quella cosa che blocca davvero le persone. Cioè la vergogna di aver pubblicato qualcosa che non ha
// funzionato.» A sinistra il tuo ultimo reel (vero, con le sue views sul riquadro come nella griglia di Instagram), a destra il
// prossimo, pronto, col tasto «Condividi» di Instagram.
//   parole: { blocca (il lucchetto si chiude sul Condividi, il prossimo si spegne), vergogna (la linea dal lucchetto all'ultimo
//   reel, che si accende di bianco), fallito (l'ultimo reel perde il colore, ✗ a mano), titolo }
//   opzioni: ultimo, prossimo (id video), views ("312"), etichette (["Ultimo reel", "Il prossimo"]), cw (330), titolo,
//   ingresso ("arrivo" default | "zoom" | "nessuno"), fermo, fermoDa
// suoni: whoosh .14 al taglio · land .1 su «blocca» · tick .05 su «vergogna» · drop .08 su «fallito»
const vergognaR14 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const cw = o.cw || 330, ch = Math.round((cw * 16) / 9), g = o.gap || 130;
  const xa = X - g / 2 - cw, xb = X + g / 2, y0 = Y - ch / 2 + 30;
  const card = (x, id) => {
    const c = layered(el(L, { position: "absolute", left: x, top: y0, width: cw, height: ch, borderRadius: Math.round(cw * 0.07), overflow: "hidden", border: "2.5px solid rgba(255,255,255,.24)", boxShadow: "0 30px 70px rgba(0,0,0,.6)", background: "#111", zIndex: 12 }));
    mediaTile(c, 0, 0, cw, ch, id, 1);
    return c;
  };
  const A = card(xa, o.ultimo), B = card(xb, o.prossimo);
  // le due etichette sopra le card (grigie, piccole: dicono quale è quale)
  const ET = o.etichette || ["Ultimo reel", "Il prossimo"];
  const etich = [[xa, ET[0], "check"], [xb, ET[1], "clock"]].map(([x, tx, ic]) => layered(el(L, { position: "absolute", left: x, top: y0 - 74, width: cw, height: 54, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FS, fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,.82)", whiteSpace: "nowrap", zIndex: 14 }, svg(ic, 30, "rgba(255,255,255,.82)", 2.4) + tx)));
  // le views dell'ultimo reel, in basso a sinistra sul riquadro (come la griglia di Instagram)
  const vw = layered(el(A, { position: "absolute", left: 18, bottom: 20, display: "flex", alignItems: "center", gap: 9, padding: "8px 16px", borderRadius: 24, background: "rgba(16,16,16,.78)", fontFamily: FS, fontWeight: 800, fontSize: 32, color: K.white, whiteSpace: "nowrap", zIndex: 6 }, svg("play", 28, K.white, 2.6) + (o.views || "312")));
  // il tasto Condividi di Instagram in fondo al prossimo reel
  const bh = 78, by = ch - bh - 26;
  const btn = layered(el(B, { position: "absolute", left: 22, top: by, width: cw - 44, height: bh, borderRadius: 16, background: K.ig, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FS, fontWeight: 800, fontSize: 32, color: K.white, boxShadow: "0 10px 26px rgba(0,0,0,.5)", zIndex: 6 }, "Condividi"));
  // il lucchetto (disco grafite, anello lime, lucchetto chiuso) sopra il tasto
  const ld = 150, lx = xb + cw / 2, ly = y0 + by - ld / 2 - 18; // sopra il tasto: «Condividi» resta leggibile
  const lockBox = layered(el(L, { position: "absolute", left: lx, top: ly, width: 1, height: 1, zIndex: 30 }));
  const lock = el(lockBox, { position: "absolute", left: -ld / 2, top: -ld / 2, width: ld, height: ld, borderRadius: "50%", background: "radial-gradient(circle at 40% 32%, #4a4a4a, #222 70%)", border: `5px solid ${K.lime}`, boxShadow: `0 18px 40px rgba(0,0,0,.6), ${GLOW_A(0.7)}`, display: "flex", alignItems: "center", justifyContent: "center" }, svg("lock", 76, K.white, 2.4));
  gsap.set(lockBox, { opacity: 0 });
  // la linea dal lucchetto all'ultimo reel (la causa del blocco)
  const S = svgLayer(L, 20, X - 1500, Y - 1500, 3000, 3000);
  const linea = connector(S, [[lx - ld / 2 - 6, ly], [xa + cw - 30, y0 + ch - 44]], { curve: "h", w: 5, color: K.white, dash: [16, 12] });
  S.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.55))";
  // ✗ a mano sull'ultimo reel
  const nota = handNote(L, xa + cw / 2 - 62, y0 + ch * 0.3, "✗", { size: 210, rot: 0, color: K.white, z: 32 });
  // 1) prima del taglio: tutto in scena (R2)
  const tutto = [A, B, ...etich];
  gsap.set(tutto, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(tutto, { opacity: 1, duration: 0.2 }, t), () => gsap.set(tutto, { opacity: 1 }));
  // 2) accento 1 · «blocca»: il lucchetto si chiude sul Condividi, il tasto e il prossimo reel si spengono
  const tb = P.blocca == null ? t0 + 1.0 : P.blocca;
  popK(lockBox, tb, { da: 0.8, dur: 0.15 });
  tl.to(btn, { background: "#3c3c3c", color: "rgba(255,255,255,.45)", duration: 0.2, ease: "power2.out" }, tb + 0.05);
  tl.fromTo(B, { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(.7) brightness(.55)", duration: 0.3, ease: "power2.out", immediateRender: false }, tb + 0.05);
  // 3) accento 2 · «vergogna»: la linea va dal lucchetto all'ultimo reel, che si accende di bianco (senza crescere)
  const tv = P.vergogna == null ? tb + 2.0 : P.vergogna;
  linea.draw(tv, 0.4, "power2.out");
  tl.to(A, { boxShadow: "0 0 0 4px #fff, 0 0 40px rgba(255,255,255,.45), 0 30px 70px rgba(0,0,0,.6)", duration: 0.25, ease: "power2.out" }, tv + 0.3);
  // 4) accento 3 · «non ha funzionato»: l'ultimo reel perde il colore, ✗ a mano
  const tf = P.fallito == null ? tv + 1.8 : P.fallito;
  tl.fromTo(A, { filter: "grayscale(0) brightness(1)" }, { filter: "grayscale(1) brightness(.6)", duration: 0.3, ease: "power2.out", immediateRender: false }, tf);
  nota.write(tf + 0.05, 0.12);
  // 5) la camera: arrivo che frena, poi tiene
  const rect = [xa - 16, y0 - 84, xb + cw + 16, y0 + ch + 14];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.96 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, fill: o.fill || 0.96 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { ultimo: [xa + cw / 2, y0 + ch / 2], prossimo: [xb + cw / 2, y0 + ch / 2], lucchetto: [lx, ly] },
    elementi: { ultimo: A, prossimo: B, lucchetto: lockBox, linea, nota, titolo: T, L },
    tempi: { taglio: t0, blocca: tb, vergogna: tv, fallito: tf },
  };
};

// numeroR14 · dopo TPL.D13 (il termometro della pressione accanto alla scala delle views): «Cambia il numero e cambia tutto.»
// Il nome del gradino in cima si decodifica nel numero nuovo, la pressione scende (continua, R6) fino al gradino `a`, i gradini
// sopra si spengono e la tua foto scende con la barra; su «tutto» il disco lime dietro la tua foto e il gradino nuovo brilla.
// Barra a mano sull'etichetta in basso del tubo («Pigrizia?») su o.barra.
//   d13 = il risultato di TPL.D13 · o: { numero (t), testo ("100 GIUSTE"), tutto (t), a (indice del gradino d'arrivo, 0),
//   barra (t della barra sull'etichetta in basso, facoltativa), fGiu (livello del tubo d'arrivo) }
const numeroR14 = (d13, o) => {
  const { scala: ld, termo: th, tu } = d13.elementi;
  const n = ld.tags.length, top = ld.tags[n - 1];
  if (o.barra != null && th.lab[0]) {
    const lb = th.lab[0];
    const fsL = parseFloat(lb.style.fontSize) || 26, wL = parseFloat(lb.style.width) || 280, wB = fsL * 0.56 * lb.textContent.length + 20;
    const bar = el(lb.parentNode, { position: "absolute", left: parseFloat(lb.style.left) + (wL - wB) / 2, top: parseFloat(lb.style.top) + fsL * 0.62, width: wB, height: 5, borderRadius: 3, background: K.lime, boxShadow: GLOW_A(0.6), transformOrigin: "0 50%", zIndex: 30 });
    gsap.set(bar, { scaleX: 0 });
    tl.to(bar, { scaleX: 1, duration: 0.22, ease: "power2.out" }, o.barra);
    tl.to(lb, { opacity: 0.45, duration: 0.2 }, o.barra + 0.1);
  }
  // il numero nuovo: una copia del nome in cima, che si decodifica mentre il vecchio sparisce
  const nn = top.nm.cloneNode(false);
  top.nm.parentNode.appendChild(nn);
  nn.style.opacity = 1; // il nome originale ha opacity 0 inline (gsap.set del template): la copia la ereditava
  nn.style.color = K.lime;
  nn.style.textShadow = GLOW_LT;
  tl.set(top.nm, { opacity: 0 }, o.numero);
  decode(nn, o.testo, o.numero, 0.3);
  // la pressione scende (lineare quasi, 0,7 s) al gradino a
  const a = o.a || 0;
  const fGiu = o.fGiu == null ? 0.12 : o.fGiu;
  const tg = o.numero + 0.1;
  th.to(tg, fGiu, 0.7, "power1.out");
  if (tu) tl.to(tu, { y: th.tipY(fGiu) - th.tipY(0), duration: 0.7, ease: "power1.out" }, tg);
  for (let i = n - 2; i > a; i--) {
    const [g, b, c] = ld.rungs[i];
    const t = tg + 0.7 * ((n - 2 - i) / Math.max(1, n - 2 - a));
    tl.to([g], { attr: { opacity: 0.14 }, duration: 0.2 }, t);
    tl.to([b], { attr: { opacity: 0.44 }, duration: 0.2 }, t);
    tl.to([c], { attr: { opacity: 0.4 }, duration: 0.2 }, t);
    tl.to([ld.tags[i].nm], { opacity: 0.42, duration: 0.2 }, t);
    tl.to([ld.tags[i].lvl], { opacity: 0, duration: 0.2 }, t);
  }
  if (th.lab[1]) tl.to(th.lab[1], { opacity: 0.35, duration: 0.3 }, tg);
  // «tutto»: il gradino nuovo brilla, il disco dietro la tua foto
  const tt = o.tutto == null ? o.numero + 0.9 : o.tutto;
  glowFlash(nn, tt, { base: GLOW_LT });
  // la tua foto sta a sinistra del tubo, centrata 96 px prima del bulbo (TPL.D13)
  if (tu) pulse(d13.elementi.L, d13.ancore.bulbo[0] - 96, th.tipY(fGiu), tt, { r: 72, z: 14 });
  return { nuovo: nn, tempi: { numero: o.numero, giu: tg, tutto: tt } };
};
