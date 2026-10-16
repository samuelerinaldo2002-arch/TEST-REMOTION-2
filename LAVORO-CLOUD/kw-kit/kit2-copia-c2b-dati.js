// ═══ KW kit v2 · COPIA FEDELE · dati del blocco C2b (reel 1 di Kallaway) — D02 (+ il badge delle views che usano anche A01 e
// le scene del reel 1) ═══════════════════════════════════════════════════════════════════════════════════════════════════════

// ── il badge delle views del reel 1: pillola piena (il suo verde, o rosso dentro le card dei suoi reel) con l'occhio e il numero
// bianchi, 148×43 px (scena 1) · da noi lime con l'occhio e il numero scuri. Può contare (scena 3: 0M → 43M; scena 11: 36 → 206)
// o: { w (148), h (43), fs (27), z, ancora ("centro" | "sx": cx è il bordo sinistro) } → { g, num, conta(t0, t1, a, b, fmt, ease) }
const r1Badge = (parent, cx, cy, testo, o) => {
  o = o || {};
  const w = o.w || 148, h = o.h || 43, fs = o.fs || Math.round(h * 0.74);
  const left = o.ancora === "sx" ? cx : cx - w / 2;
  const g = layered(el(parent, { position: "absolute", left, top: cy - h / 2, width: w, height: h, borderRadius: Math.round(h * 0.16), background: o.fondo || "linear-gradient(180deg,#d9ff6a 0%,#CFFB50 55%,#bfe942 100%)", boxShadow: o.glow || "0 0 16px rgba(207,251,80,.45), 0 0 40px rgba(207,251,80,.18)", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: Math.round(h * 0.2), padding: `0 ${Math.round(h * 0.18)}px`, overflow: "hidden", zIndex: o.z || 16 }));
  el(g, { display: "flex", alignItems: "center", justifyContent: "center", width: Math.round(h * 0.7), height: Math.round(h * 0.7), borderRadius: "50%", background: K.ink, flex: "none" }, svg("eye", Math.round(h * 0.5), K.lime, 2.6));
  const num = el(g, { fontFamily: FS, fontWeight: 800, fontSize: fs, lineHeight: 1, color: K.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }, testo);
  return {
    g, num,
    // il numero conta da a → b fra t0 e t1 (fmt(x) → testo); R6: continuo
    conta: (t0, t1, a, b, fmt, ease) => {
      const st = { v: 0 };
      num.innerHTML = fmt(a);
      tl.fromTo(st, { v: 0 }, { v: 1, duration: t1 - t0, ease: ease || "none", immediateRender: false, onUpdate: () => { num.innerHTML = fmt(a + (b - a) * st.v); } }, t0);
    },
  };
};
// l'arrivo del badge di Kallaway (misurato sul reel 1, 0,876–1,63 s): compare intero in un fotogramma 28 px più in basso, sale
// (~216 px/s), passa la sua posizione di 7 px e torna giù piano (un filo di rimbalzo di posizione, 23% della corsa)
const R1_BADGE_SU = [[0, 28], [0.042, 19], [0.083, 10], [0.125, 1], [0.167, -3], [0.21, -5], [0.25, -6.5], [0.3, -7], [0.375, -5], [0.46, -2], [0.5, -1], [0.6, 0]];
const r1BadgeEntra = (g, t, o) => {
  o = o || {};
  const k = o.k == null ? 1 : o.k, f = cpInterp(R1_BADGE_SU.map(([u, d]) => [u, d * k])), st = { v: 0 };
  gsap.set(g, { opacity: 0, y: f(0) });
  tl.set(g, { opacity: 1 }, t);
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 0.6, ease: "none", immediateRender: false, onUpdate: () => gsap.set(g, { y: f(st.v * 0.6) }) }, t);
};

/* @copia D02 · Badge views che poppano in sequenza (copia del reel 1, 0,876–1,29 s: sotto i 5 reel della griglia)
 * kallaway: reel 1, 0,876 s · sotto ogni reel della griglia compare la pillola verde con l'occhio e le views («15.1M» · «11M» ·
 *   «4.4M» la prima riga, «1.1M» · «4.4M» la seconda): una dopo l'altra (0,876 · 0,918 · 1,043 · 1,168 · 1,293 s), ognuna intera
 *   in un fotogramma 28 px più in basso, sale in 0,125 s, passa la sua posizione di 7 px e torna giù in 0,3 s
 * misure: pillole 148×43 px centrate sotto i reel (x 192–340 · 465–613 · 737–885 a y 751–794; x 324–473 · 606–755 a y 1195–1238);
 *   salita 28 → 0 px in 0,125 s, rimbalzo −7 px a +0,3 s, ferma a +0,6 s (misura del verde fotogramma per fotogramma)
 * quando: prova sociale sui reel di esempio (views vere sotto le copertine)
 * scena: parent (strato del mondo), X, Y (centro della griglia nel mondo: le coordinate delle pillole sono dello schermo, Y 880)
 * opzioni: badge ([[cx, cy, testo, t]]), k (1: ampiezza della salita)
 * restituisce: elementi { badge: [r1Badge] }
 * colori: il suo verde con l'occhio e il numero bianchi → lime con l'occhio e il numero scuri
 * chiamata: COPIA.D02({ parent: L, X, Y }, { badge: [[266, 772, "15,1M", 0.876], [539, 772, "11M", 0.918], …] });
 */
COPIA.D02 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(12), X = scena.X == null ? 540 : scena.X, Y = scena.Y == null ? 880 : scena.Y;
  const B = o.badge || [[266, 772, "15,1M", 0.876], [539, 772, "11M", 0.918], [811, 772, "4,4M", 1.043], [398, 1216, "1,1M", 1.168], [680, 1216, "4,4M", 1.293]];
  const badge = B.map(([cx, cy, testo, t]) => {
    const b = r1Badge(L, X - 540 + cx, Y - 880 + cy, testo, o.stile);
    r1BadgeEntra(b.g, t, { k: o.k });
    return b;
  });
  return { rect: null, pose: null, ancore: {}, elementi: { badge } };
};
