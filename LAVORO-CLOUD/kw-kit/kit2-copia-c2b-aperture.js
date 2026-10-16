// ═══ KW kit v2 · COPIA FEDELE · aperture del blocco C2b — A01 (copiata dal reel 25, in coda al reel 1 di copia-07) ════════════

/* @copia A01 · Muro o griglia di reel veri con badge views (copia del reel 25, 0–3,042 s: «This New Type Of Content Is Going Crazy
 *   Viral Right Now»; nel reel 1 la griglia d'apertura è al buio e senza fondo chiaro: la voce isolata è questa)
 * kallaway: reel 25, 0 s · fondo chiaro con la griglia sottile; il titolo scuro su due righe («This New Type Of Content» / «Is Going
 *   Crazy Viral Right Now», «Crazy Viral» in corsivo serif) parola per parola da 0 s (la riga 2 c'è già grigia); la griglia 3×2 di
 *   reel di creator diversi arriva da sotto sfocata, una cella dopo l'altra (0 · 0,083 · 0,167 · 0,2 · 0,25 · 0,25 s, a fuoco in
 *   ~0,25 s); i badge verdi delle views sotto ogni reel (1,083 · 1,167 · 1,167 · 1,25 · 1,5 · 1,417 s: «4.1M» «3.1M» «1.6M» «3.4M»
 *   «1.1M» «2.4M»), che poppano senza rimbalzo; i reel girano; 3,042 s taglio
 * misure: celle 227×363 coi centri x 260 · 540 · 820, y 457 e 957; badge ~150×40 a y 702 e 1182; titolo riga 1 x 231–849 (y ~130–
 *   170), riga 2 x 201–876 (y ~190–235)
 * quando: hook su un formato o una tendenza che funziona (prova sociale con reel veri)
 * scena: t0 (il taglio), t1, parent (hud) · opzioni: clip (6 id del pool: creator diversi), views (6 testi), titolo ({ r1, r2 })
 * restituisce: elementi { P, celle, badge }
 * colori: fondo chiaro come il suo (bianco e grigio), titolo scuro #1E1E1E, corsivo Patrick Hand scuro; badge verdi → lime con
 *   l'occhio e il numero scuri
 * chiamata: COPIA.A01({ t0: 119.42, t1: 122.462 }, { clip: ["a1", …, "a6"] });
 */
COPIA.A01 = (scena, o) => {
  o = o || {};
  const t0 = scena.t0, t1 = scena.t1;
  const P = layered(el(scena.parent || hud, { position: "absolute", left: 0, top: 0, width: 1080, height: 1332, overflow: "hidden", background: "#e4e4e2", zIndex: 82 }));
  el(P, { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,.07) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0,0,0,.07) 1.5px, transparent 1.5px)", backgroundSize: "27px 27px", opacity: 0.8 });
  gsap.set(P, { autoAlpha: 0 }); tl.set(P, { autoAlpha: 1 }, t0 - 0.001); if (t1) tl.set(P, { autoAlpha: 0 }, t1);
  // il titolo scuro parola per parola (la riga 2 c'è già grigia al taglio)
  const tit = el(P, { position: "absolute", left: 0, top: 118, width: 1080, zIndex: 5 });
  const riga = (top, parti) => {
    const r = el(tit, { position: "absolute", left: 0, top, width: 1080, display: "flex", justifyContent: "center", alignItems: "baseline", whiteSpace: "nowrap" });
    const U = [];
    parti.forEach(([testo, serif]) => testo.split(/(?<=\s)/).forEach((p) => {
      const w = el(r, { display: "inline-block", whiteSpace: "pre", fontFamily: serif ? FH : FD, fontWeight: serif ? 400 : 700, fontSize: serif ? 64 : 54, letterSpacing: serif ? "0" : "-0.02em", color: "rgba(30,30,30,.35)" }, p.replace(/ /g, "&nbsp;"), "span");
      U.push(w);
    }));
    return U;
  };
  const T = o.titolo || { r1: [["Questo Nuovo Tipo Di Contenuti", false]], r2: [["Sta Diventando ", false], ["Super Virale", true], [" Adesso", false]] };
  const U1 = riga(0, T.r1), U2 = riga(64, T.r2);
  gsap.set(U1, { opacity: 0, filter: "blur(6px)" }); gsap.set(U2, { opacity: 1 });
  const tempi1 = [0, 0.12, 0.2, 0.3, 0.4], tempi2 = [0.45, 0.5, 0.55, 0.6, 0.65];
  U1.forEach((w, i) => { const t = t0 + tempi1[Math.min(i, 4)]; tl.to(w, { opacity: 1, filter: "blur(0px)", color: K.ink, duration: 0.18, ease: "power2.out" }, t); tl.set(w, { filter: "none" }, t + 0.19); });
  U2.forEach((w, i) => tl.to(w, { color: K.ink, duration: 0.15, ease: "power1.out" }, t0 + tempi2[Math.min(i, 4)]));
  gsap.set(U1[0], { opacity: 1, filter: "none", color: K.ink });
  // la griglia 3×2
  const C = [[260, 457, 0], [540, 457, 0.083], [820, 457, 0.167], [260, 957, 0.2], [540, 957, 0.25], [820, 957, 0.25]];
  const cl = o.clip || ["a1", "a2", "a3", "a4", "a5", "a6"];
  const celle = C.map(([x, y, ti], i) => {
    const c = r5Card(P, x, y, 227, 363, [[0, cl[i]]], { r: 6, glow: "0 0 0 2px rgba(255,255,255,.9), 0 10px 26px rgba(0,0,0,.22)" });
    gsap.set(c.g, { opacity: 0, y: 90, filter: "blur(10px)" });
    if (ti === 0) gsap.set(c.g, { opacity: 0.55, y: 60, filter: "blur(8px)" });
    tl.to(c.g, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.27, ease: "power2.out" }, t0 + ti);
    tl.set(c.g, { filter: "none" }, t0 + ti + 0.28);
    return c;
  });
  const V = o.views || ["4,1M", "3,1M", "1,6M", "3,4M", "1,1M", "2,4M"], TB = [1.167, 1.083, 1.167, 1.25, 1.5, 1.417];
  const badge = C.map(([x, y], i) => {
    const b = r1Badge(P, x, y + 245, V[i], { w: 150, h: 42, fs: 28, z: 8 });
    gsap.set(b.g, { opacity: 0, scale: 0.8 });
    tl.to(b.g, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, t0 + TB[i]);
    return b;
  });
  return { rect: null, pose: null, ancore: {}, elementi: { P, celle, badge } };
};
