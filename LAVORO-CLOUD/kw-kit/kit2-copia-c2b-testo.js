// ═══ KW kit v2 · COPIA FEDELE · testo del blocco C2b (reel 1 di Kallaway) — T02 ════════════════════════════════════════════

/* @copia T02 · Box evidenziatore che cresce insieme alle parole (copia del reel 1, 0,21–1,13 s: «A Million Views»)
 * kallaway: reel 1, 0,21 s · sotto la riga 1 del titolo nasce un cursore rosso sottile (x 156–191, alto 91 px); da 0,29 s il
 *   riquadro si allunga verso destra a velocità costante (~1000 px/s, 42 px a fotogramma) e frena negli ultimi 0,2 s fino a
 *   x 932 (1,13 s); le parole della riga («A» 0,58 · «Million» 0,63 · «Views» 0,71 s, bianche) arrivano grigie e sfocate come
 *   T01 e NON aspettano il riquadro: davanti al bordo sono già bianche sul nero, dietro il bordo bianche sul rosso
 * misure: riquadro x 156 → 191 (0,209) · 272 (0,292) · 362 (0,375) · 410 · 455 · 490 · 536 · 578 · 623 · 665 · 707 · 749 · 791
 *   · 833 · 875 · 914 (0,918) · 922 · 926 · 928 · 932 (1,126 s), y 211–302 (parole_titolo.py e la misura del rosso fotogramma
 *   per fotogramma, _script_copia07/); il titolo resta fino al taglio
 * quando: la riga del titolo con la promessa (il risultato, il numero)
 * scena: t0 (0: i tempi misurati partono da qui), parent (hud), y (alto del riquadro, 211), x0 (bordo sinistro, 156)
 * opzioni: testo ([parole]), tempi ([istante di ogni parola]), fs (78), bordo ([[t, x destro]] la curva del riquadro), h (91),
 *   ruoli ([ "sans" | "serif" ] per parola: il suo corsivo serif dentro il riquadro → Patrick Hand), fsSerif (fs × 1,18)
 * restituisce: elementi { box, parole, scure }
 * colori: il suo rosso con la scritta bianca → lime con la scritta scura; fuori dal riquadro la scritta resta bianca sul nero
 *   (due strati: bianco sotto, scuro ritagliato dal riquadro sopra, così si legge mentre il bordo passa)
 * chiamata: COPIA.T02({ t0: 0, parent: hud }, { testo: ["Un", "Milione", "Di", "Views"], tempi: [0.58, 0.6, 0.63, 0.71] });
 */
COPIA.T02 = (scena, o) => {
  o = o || {};
  const par = scena.parent || hud, t0 = scena.t0 || 0, y = scena.y == null ? 211 : scena.y, x0 = scena.x0 == null ? 156 : scena.x0;
  const h = o.h || 91, fs = o.fs || 78, W = 1080 - 2 * x0;
  const root = layered(el(par, { position: "absolute", left: x0, top: y, width: W, height: h, zIndex: o.z || 52 }));
  const box = el(root, { position: "absolute", left: 0, top: 0, width: W, height: h, background: K.lime, borderRadius: 2, boxShadow: `0 0 22px rgba(207,251,80,.30)` });
  const riga = (col, sh) => el(root, { position: "absolute", left: 0, top: 0, width: W, height: h, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", fontFamily: FD, fontWeight: 700, fontSize: fs, lineHeight: 1, letterSpacing: "-0.02em", color: col, textShadow: sh });
  const bianca = riga(K.white, CP_GLOW_T), scura = riga(K.ink, "none");
  const testo = o.testo || ["Un", "Milione", "Di", "Views"];
  const ruoli = o.ruoli || [];
  const mk = (r) => testo.map((p, i) => {
    const serif = ruoli[i] === "serif";
    const w = el(r, Object.assign({ display: "inline-block", whiteSpace: "pre" }, serif ? { fontFamily: FH, fontWeight: 400, fontSize: o.fsSerif || Math.round(fs * 1.18), letterSpacing: "0" } : {}), (i ? " " : "") + p, "span");
    gsap.set(w, { opacity: 0, filter: "blur(9px)", y: 5 });
    return w;
  });
  const P = mk(bianca), S = mk(scura);
  const tempi = o.tempi || [0.58, 0.6, 0.63, 0.71];
  P.forEach((w, i) => {
    const t = t0 + tempi[Math.min(i, tempi.length - 1)] - 0.17;   // i tempi misurati sono quando la parola è già bianca (0,17 s dopo l'arrivo)
    [w, S[i]].forEach((x) => {
      tl.to(x, { opacity: 1, duration: 0.06, ease: "none" }, t);
      tl.to(x, { filter: "blur(0px)", y: 0, duration: 0.2, ease: "power2.out" }, t);
      tl.set(x, { filter: "none" }, t + 0.21);
    });
  });
  // il bordo destro del riquadro (x schermo) misurato fotogramma per fotogramma; lo strato scuro ha lo stesso ritaglio
  const bordo = o.bordo || [[0.2, 191], [0.292, 272], [0.375, 362], [0.417, 410], [0.459, 455], [0.501, 490], [0.542, 536], [0.584, 578], [0.626, 623], [0.667, 665], [0.709, 707], [0.751, 749], [0.792, 791], [0.834, 833], [0.876, 875], [0.918, 914], [0.959, 922], [1.001, 926], [1.043, 928], [1.126, 932]];
  const f = cpCurva(bordo.map(([t, x]) => [t0 + t, x - x0]));
  const ta = t0 + bordo[0][0], tb = t0 + bordo[bordo.length - 1][0], st = { v: 0 };
  const clip = (t) => `inset(0px ${Math.max(0, W - f(t)).toFixed(1)}px 0px 0px)`;
  gsap.set([box, scura], { clipPath: "inset(0px 100% 0px 0px)" });
  tl.set([box, scura], { clipPath: clip(ta) }, ta);
  tl.fromTo(st, { v: 0 }, { v: 1, duration: tb - ta, ease: "none", immediateRender: false, onUpdate: () => { const c = clip(ta + st.v * (tb - ta)); box.style.clipPath = c; scura.style.clipPath = c; } }, ta);
  return { rect: [x0, y, x0 + W, y + h], pose: null, ancore: {}, elementi: { root, box, parole: P, scure: S } };
};
