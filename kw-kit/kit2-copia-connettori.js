// ═══ KW kit v2 · COPIA FEDELE · connettori (C01) — blocco C1, reel 79 di Kallaway ═══════════════════════════════════════════

/* @copia C01 · Linea che si allunga mentre la camera viaggia (copia del reel 79, 0,63–1,42 s)
 * kallaway: reel 79, 0,70–1,42 s · dal bordo destro della card parte una linea bianca orizzontale (sottile, con l'alone) che corre
 *   verso destra davanti alla camera; la camera scorre di lato e arriva sul cervello, dove la linea si attacca con un lampo di luce
 * misure: pan del contenuto −870 px in 0,75 s (0,626 → 1,376 s), cubic-bezier(0.65, 0.057, 0.337, 0.913) (power2.inOut il più
 *   vicino), picco 2950 px/s a 0,96 s (44% della durata); punta della linea dal bordo della card (x 943) a quello del cervello
 *   (+347 px) quasi lineare fra 0,70 e 0,95 s (sempre fuori campo a destra mentre la camera la insegue)
 * quando: si passa da una cosa a quella che la spiega (la clip → il cervello): la linea porta lo sguardo e la camera la segue
 * scena: t0 (partenza della camera, 0,626), da [x, y] (mondo, inizio della linea), a [x, y] (mondo, fine), parent
 * opzioni: dur (0.75), dx (−870, px schermo del contenuto), ease, linea: [t, dur] (0.70, 0.25), lampo (true)
 * restituisce: elementi { linea, lampo }, tempi { arrivo }
 * chiamata: COPIA.C01({ t0: 0.626, da: [940, 964], a: [1290, 967] }, {});
 */
COPIA.C01 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(9);
  const [x0, y0] = scena.da, [x1, y1] = scena.a;
  const S = svgLayer(L, o.z || 9, Math.min(x0, x1) - 60, Math.min(y0, y1) - 60, Math.abs(x1 - x0) + 120, Math.abs(y1 - y0) + 120);
  const p = pathEl(S, `M${x0} ${y0} L${x1} ${y1}`, { fill: "none", stroke: "#ffffff", "stroke-width": o.w || 3, "stroke-linecap": "round", opacity: 0.95 });
  p.style.filter = "drop-shadow(0 0 5px rgba(255,255,255,.85)) drop-shadow(0 0 16px rgba(255,255,255,.35))";
  drawable(p);
  const [tl0, tld] = o.linea || [0.70, 0.25];
  tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: tld, ease: "none" }, tl0);
  // il lampo dove la linea tocca l'oggetto (Kallaway: un punto bianco che brilla sul bordo del cervello)
  let lampo = null;
  if (o.lampo !== false) {
    lampo = layered(el(L, { position: "absolute", left: x1 - 46, top: y1 - 46, width: 92, height: 92, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.45) 18%, rgba(255,255,255,0) 62%)", opacity: 0, zIndex: (o.z || 9) + 4, pointerEvents: "none" }));
    tl.to(lampo, { opacity: 1, duration: 0.08 }, tl0 + tld - 0.02);
    tl.to(lampo, { opacity: 0.55, duration: 0.4 }, tl0 + tld + 0.1);
  }
  const dur = o.dur || 0.75;
  if (o.camera !== false) cpCam.trasla(scena.t0, dur, o.dx == null ? -870 : o.dx, 0, o.ease || cpBez(0.65, 0.057, 0.337, 0.913));
  return { rect: [x0, y0 - 10, x1, y1 + 10], pose: null, ancore: { da: [x0, y0], a: [x1, y1] }, elementi: { linea: p, lampo, S }, tempi: { arrivo: scena.t0 + dur } };
};
