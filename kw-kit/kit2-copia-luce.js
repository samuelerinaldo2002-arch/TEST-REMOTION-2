// ═══ KW kit v2 · COPIA FEDELE · luce (F01, F02) — blocco C1, reel 79 di Kallaway ════════════════════════════════════════════

/* @copia F01 · Glow (bloom) su testi e oggetti (copia del reel 79)
 * kallaway: reel 79, 0,9–1,0 s · il titolo bianco, la card col video, la linea e il cervello a raggi X hanno tutti un alone
 * misure: testo bianco alone medio σ≈7 px + largo σ≈42–50 px (catalogo F01); la card ha un alone chiaro largo ~30 px che prende i
 *   colori del video; il cervello e la linea brillano di bianco; i neon (∞) ~3 volte più forti dei testi
 * quando: sempre: è lo stile di tutto ciò che è luminoso; i neon molto più dei testi
 * scena: — (si applica ai nodi) · opzioni: tipo ("testo" | "card" | "oggetto" | "neon"), a (intensità, 1)
 * restituisce: i nodi
 * chiamata: COPIA.F01([titolo, etichetta], { tipo: "testo" });
 */
COPIA.F01 = (nodi, o) => {
  o = o || {};
  const a = o.a == null ? 1 : o.a, L = Array.isArray(nodi) ? nodi : [nodi];
  const tipo = o.tipo || "testo";
  L.forEach((n) => {
    if (!n) return;
    if (tipo === "testo") n.style.textShadow = CP_GLOW_T;
    else if (tipo === "card") n.style.boxShadow = CP_GLOW_CARD;
    else if (tipo === "oggetto") n.style.filter = `drop-shadow(0 0 ${Math.round(10 * a)}px rgba(255,255,255,${(0.45 * a).toFixed(2)})) drop-shadow(0 0 ${Math.round(34 * a)}px rgba(255,255,255,${(0.18 * a).toFixed(2)}))`;
    else if (tipo === "neon") n.style.filter = `drop-shadow(0 0 ${Math.round(12 * a)}px rgba(207,251,80,${(0.8 * a).toFixed(2)})) drop-shadow(0 0 ${Math.round(48 * a)}px rgba(207,251,80,${(0.35 * a).toFixed(2)}))`;
  });
  return L;
};

/* @copia F02 · Pulse a disco pieno (copia del reel 79, dietro al cervello)
 * kallaway: reel 79, 1,21–1,67 s · il disco compare in UN fotogramma già largo (diametro 632 px, 0,59 della larghezza), al
 *   fotogramma dopo è 770 px, poi si allarga piano fino a ~935 px mentre svanisce, a 1,67 s non c'è più; centrato sul cervello,
 *   dietro di lui; riempimento rosso scuro e bordo chiaro sottile con alone
 * misure: r 316 → 385 in 0,042 s → ~467 a +0,46 s · opacità ~0,9 → 0 quasi lineare in 0,46 s · nessun rimbalzo
 * quando: l'oggetto-concetto si «accende» sulla parola chiave (qui «addictive»)
 * scena: t0 (istante del disco), X, Y (centro, mondo), parent · opzioni: r (385), z, riempimento ("grafite" come brain.disco del
 *   kit — il lime pieno coprirebbe il cervello bianco — oppure "lime" per il disco pieno del kit dietro a oggetti scuri)
 * restituisce: elementi { d }, tempi { fine }
 * colori: il suo rosso → bordo lime pieno con alone; il riempimento resta scuro (regola del kit: niente lime trasparente sul nero)
 * chiamata: COPIA.F02({ t0: 1.21, X: 1430, Y: 975 }, { r: 385 });
 */
COPIA.F02 = (scena, o) => {
  o = o || {};
  const R = o.r || 385, L = scena.parent || layer(9);
  const lime = o.riempimento === "lime";
  const d = layered(el(L, { position: "absolute", left: scena.X - R, top: scena.Y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", zIndex: o.z || 8, pointerEvents: "none",
    background: lime ? "radial-gradient(circle at 50% 42%, #eaffa6 0%, #d6fd62 38%, #CFFB50 62%, #bce63f 100%)" : "radial-gradient(circle at 50% 45%, rgba(70,74,60,.72) 0%, rgba(38,40,32,.78) 62%, rgba(26,27,22,.82) 100%)",
    border: `${Math.max(4, Math.round(R * 0.012))}px solid ${lime ? "rgba(255,255,255,.92)" : K.lime}`,
    boxShadow: lime ? "0 0 60px rgba(207,251,80,.55)" : `${GLOW_A(0.9)}, inset 0 0 0 2px rgba(255,255,255,.55), inset 0 0 90px rgba(207,251,80,.10)`, opacity: 0 }));
  const t0 = scena.t0;
  gsap.set(d, { scale: 316 / 385 });
  tl.set(d, { opacity: 0.92 }, t0);
  tl.to(d, { scale: 1, duration: 0.042, ease: "none" }, t0);
  tl.to(d, { scale: 467 / 385, duration: 0.46, ease: "power1.out" }, t0 + 0.042);
  tl.to(d, { opacity: 0, duration: 0.46, ease: "none" }, t0 + 0.042);
  return { rect: [scena.X - R, scena.Y - R, scena.X + R, scena.Y + R], pose: null, ancore: { centro: [scena.X, scena.Y] }, elementi: { d }, tempi: { fine: t0 + 0.5 } };
};
