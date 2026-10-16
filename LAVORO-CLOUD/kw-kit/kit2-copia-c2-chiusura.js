// ═══ KW kit v2 · COPIA FEDELE · chiusura del blocco C2 (reel 5 di Kallaway) — X01 ════════════════════════════════════════════

/* @copia X01 · «Commenta X» + anteprima della risorsa (copia del reel 5, 117,708–122,09 s: la fine del reel)
 * kallaway: reel 5, 117,708 s · taglio sul nero; a 117,92 s compare la card 16:9 del suo video (lui nello studio che parla) col
 *   bordo rosso acceso e il bagliore rosso, e si assesta 26 px più in basso; sopra il titolo parola per parola: «Comment»
 *   (118,08) «"leads"» in corsivo (118,25) «To» «Scale» / «Your Content With Me 1:1» (119,0 → 119,88), la linea rossa sotto la
 *   seconda riga che si allunga; fino all'ultimo fotogramma (il file finisce a 122,09 s: il catalogo diceva 118–125)
 * misure: card 734×431 a (540, 758) → (540, 784); titolo righe y 246–306 (x 198–880) e 318–359 (x 236–851), linea y 373
 *   (x 222–854); niente movimento di camera
 * quando: chiusura di quasi ogni reel: commenta una parola, ricevi la risorsa (qui: lavorare con lui 1:1)
 * scena: t0 (il taglio), t1 (la fine), parent · opzioni: video (id del pool, il TUO video), titolo (righe), parola
 * restituisce: elementi { T, card }
 * colori: il suo rosso (bordo, bagliore, linea) → lime
 * chiamata: COPIA.X01({ t0: 117.708, t1: 122.09, X, Y, parent: L }, { video: "cta_tu" });
 */
COPIA.X01 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10), X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const t0 = scena.t0;
  const T = r5Titolo({ righe: o.titolo || [[{ t: "Commenta ", ruolo: "sans", size: 50 }, { t: "“clienti”", ruolo: "serif", size: 62, unita: true }, { t: " Per Scalare", ruolo: "sans", size: 50 }], [{ t: "I Tuoi Contenuti Con Me 1:1", ruolo: "sans", size: 46 }]], tops: [244, 316], y: 244, sottolinea: { y: 371, w: 640, h: 4 } });
  T.inAt([t0 + 0.37, t0 + 0.54, t0 + 0.75, t0 + 1.08, t0 + 1.29, t0 + 1.46, t0 + 1.62, t0 + 1.83, t0 + 1.95, t0 + 2.17]);
  T.sottolinea(t0 + 1.25, 1.0, "power1.inOut");
  const [cx, cy] = W(540, 784);
  const card = r5Card(L, cx, cy, 734, 431, [[0, o.video || "cta_tu"]], { r: 10, z: 14, glow: `0 0 0 4px ${K.lime}, ${R5.glowL(0.8)}, 0 0 90px rgba(207,251,80,.25), 0 24px 60px rgba(0,0,0,.6)` });
  gsap.set(card.g, { opacity: 0, y: -26, scale: 0.96 });
  tl.to(card.g, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, t0 + 0.02);
  tl.to(card.g, { y: 0, duration: 0.6, ease: "power2.out" }, t0 + 0.14);
  return { rect: null, pose: null, ancore: {}, elementi: { T, card } };
};
