// ═══ KW kit v2 · COPIA FEDELE · luce del blocco C2 (reel 5 di Kallaway) — F03 ═════════════════════════════════════════════════

/* @copia F03 · Sheen (banda di luce) (copia del reel 5, 34,25–34,92 s: la voce 02 della lista; anche 10,79–11,46 s sulla 01)
 * kallaway: reel 5, 34,25 s · una banda di luce bianca, morbida ai bordi e inclinata (~20°), attraversa la barra da DESTRA a
 *   sinistra in ~0,67 s (parte piano, corre a metà, frena), luminosa al centro; dietro di lei il testo della voce va a fuoco
 * misure: colonna più luminosa (misure_c2.py) 934 (34,33) → 878 (34,42) → 804 (34,5) → 695 (34,58) px: ~1150 px/s quasi
 *   costante, fuori a sinistra verso 35,05 s → 0,75 s lineare (la prima volta, 10,79–11,46 s, 0,67 s); larga ~60 px, alta più
 *   della barra (inclinata), bianca al centro (≈0,85)
 * quando: arrivo di card importanti, una voce che si «risolve»
 * scena: card (elemento con overflow nascosto), t · opzioni: dur (0,67), w (60), a (0,85), dir (−1 da destra), ease ("none")
 * restituisce: la banda
 * colori: bianco
 * chiamata: COPIA.F03(barra, 34.25, { dur: 0.67 });
 */
COPIA.F03 = (card, t, o) => {
  o = o || {};
  const dur = o.dur || 0.67, bw = o.w || 60, dir = o.dir || -1, a = o.a || 0.85;
  const W = parseFloat(card.style.width) || 600, H = parseFloat(card.style.height) || 120;
  const wrap = layered(el(card, { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden", borderRadius: "inherit", pointerEvents: "none", zIndex: o.z || 30 }));
  const band = el(wrap, { position: "absolute", top: -H * 0.6, left: 0, width: bw, height: H * 2.2, transform: "rotate(20deg)", filter: "blur(3px)", opacity: 0,
    background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${(0.45 * a).toFixed(2)}) 35%, rgba(255,255,255,${a}) 50%, rgba(255,255,255,${(0.45 * a).toFixed(2)}) 65%, rgba(255,255,255,0) 100%)` });
  const x0 = dir < 0 ? W + bw : -bw * 2, x1 = dir < 0 ? -bw * 2 : W + bw;
  tl.set(band, { opacity: 1 }, t);
  tl.fromTo(band, { x: x0 }, { x: x1, duration: dur, ease: o.ease || "none", immediateRender: false }, t);
  tl.set(band, { opacity: 0 }, t + dur);
  return band;
};
