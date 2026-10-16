// ═══ KW kit v2 · COPIA FEDELE · testo (T01) — blocco C1, reel 79 di Kallaway ═══════════════════════════════════════════════

/* @copia T01 · Titolo parola per parola, sincronizzato alla voce (copia del reel 79, 0–2,4 s)
 * kallaway: reel 79, 0,04–0,71 s · «How to make your / Storytelling addictive» nell'HUD, fermo per tutta la scena (fino a 4,17 s)
 * misure: riga 1 sans neretto, maiuscole y 155–198, x 297–783 (larga 486); riga 2 serif corsivo, maiuscole y 207–275, x 158–920
 *   (larga 762); ogni parola arriva grigia, sfocata ~9 px e 5 px più in basso → bianca e nitida in 4–5 fotogrammi (0,17–0,21 s),
 *   sugli istanti misurati 0,04 · 0,125 · 0,25 · 0,33 · 0,50 · 0,71 s (un filo prima della voce); la linea d'accento sotto il
 *   corsivo (y 297, 4 px) cresce da x 155 a 920 fra 0,85 e ~2,4 s (0,9 s: 5% · 1,15: 27% · 1,3: 63% · 1,45: 76% · 1,8: 92% ·
 *   2,2: 99%); uscita a 4,17 s: in 2 fotogrammi
 * quando: il titolo del reel (hook) nelle prime parole, due righe: la promessa in neretto e la parola chiave in corsivo
 * scena: t0 (0), t1 (uscita), parole: { titolo: [tempo per unità] } · parent (hud)
 * opzioni: righe ([[{t, ruolo: "sans" | "serif", size, unita}]]), y (alto della riga 1, 155), interlinea ([77]), sottolinea
 *   ({ x0, x1, y } nella riga 2, false per toglierla), esce (true)
 * restituisce: rect (HUD), elementi { T }, tempi { fine }
 * colori: il suo bianco resta bianco (Patrick Hand bianco nel ruolo del suo serif corsivo), la sua linea rossa → lime
 * chiamata:
 *   COPIA.T01({ t0: 0, t1: 4.17 }, { righe: [[{ t: "Come rendere il tuo", ruolo: "sans" }], [{ t: "Storytelling ", ruolo: "serif" },
 *     { t: "da dipendenza", ruolo: "serif", unita: true }]] });
 */
COPIA.T01 = (scena, o) => {
  o = o || {};
  const P = scena.parole || {};
  const righe = o.righe || [[{ t: "Come rendere il tuo", ruolo: "sans", size: 60 }], [{ t: "Storytelling ", ruolo: "serif", size: 96 }, { t: "da dipendenza", ruolo: "serif", size: 96, unita: true }]];
  const T = cpTitolo({ righe, x: 540, y: o.y == null ? 146 : o.y, interlinea: o.interlinea || [62], parent: scena.parent || hud, sottolinea: o.sottolinea === false ? null : { riga: 1, y: (o.sottolinea && o.sottolinea.y) || 106, h: 5 } });
  const tempi = P.titolo || [0.04, 0.125, 0.25, 0.33, 0.5, 0.71];
  T.inAt(tempi);
  // T07 · la linea d'accento sotto il corsivo: cresce coi tempi misurati (curva presa per punti dal suo video)
  if (o.sottolinea !== false) {
    // la linea è larga quanto la riga 2 (figlia del suo contenitore): x0, x1 = frazioni della riga (Kallaway 0 → 1)
    const so = o.sottolinea || {};
    const x0 = so.x0 == null ? 0 : so.x0, x1 = so.x1 == null ? 1 : so.x1;
    gsap.set(T.und, { left: `${x0 * 100}%`, width: `${(x1 - x0) * 100}%`, scaleX: 0 });
    const f = cpCurva([[0.85, 0], [0.9, 0.05], [1.0, 0.088], [1.15, 0.274], [1.3, 0.627], [1.45, 0.76], [1.8, 0.924], [2.2, 0.987], [2.6, 1]]);
    const st = { v: 0 };
    tl.set(T.und, { opacity: 1 }, 0.85 + (scena.t0 || 0));
    tl.fromTo(st, { v: 0 }, { v: 1, duration: 1.75, ease: "none", immediateRender: false, onUpdate: () => gsap.set(T.und, { scaleX: f(0.85 + st.v * 1.75) }) }, 0.85 + (scena.t0 || 0));
  }
  if (o.esce !== false && scena.t1) T.outAt(scena.t1, { grigio: 0.04, dopo: 0.03, via: 0.05 });
  return { rect: [0, 140, 1080, 310], pose: null, ancore: {}, elementi: { T }, tempi: { fine: tempi[tempi.length - 1] + 0.21 } };
};
