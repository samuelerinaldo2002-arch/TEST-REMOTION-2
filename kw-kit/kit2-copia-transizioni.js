// ═══ KW kit v2 · COPIA FEDELE · transizioni (TRANS.*) — misurate sui cambi veri di Kallaway (blocco C1, reel 79) ═══════════════
// Ogni transizione aggiunge il suo pezzo alla camera della copia (cpCam) e accende / spegne gli elementi delle due scene. Sono la
// base del catalogo delle transizioni (fase 2): ogni voce = scena A → movimento → scena B. I profili misurati (tabelle) si possono
// riusare con altre distanze: il percorso si scala (o.k) e il tempo si allunga (o.dur).

// profili misurati sul reel 79 (camtrack.py: spostamento cumulato del contenuto, px schermo, dal primo punto): [[s dal via, px]].
// Si normalizzano qui sotto (u = frazione del tempo, p = frazione dello spostamento) e si riusano con altre distanze e durate.
const TR_MISURE = {
  // 1,376 → 3,9 s: il cervello sale e se ne va, la griglia arriva dal basso; parte piano, picco ~2800 px/s a 1,85 s, frena a lungo
  // (camtrack.py fino a 1,75 s sul cervello, righe.py dopo sulla griglia: la griglia arriva a ~2800 px/s e frena fino a ~3,6 s)
  r79_cervelloGriglia: [[0, 0], [0.126, -28], [0.251, -75], [0.376, -159], [0.417, -215], [0.459, -300], [0.501, -417], [0.543, -512], [0.584, -562], [0.626, -622], [0.668, -683], [0.709, -737], [0.751, -786], [0.793, -831], [0.835, -872], [0.876, -910], [0.918, -945], [0.96, -977], [1.001, -1007], [1.043, -1035], [1.085, -1061], [1.127, -1085], [1.168, -1108], [1.21, -1130], [1.252, -1150], [1.293, -1169], [1.377, -1200], [1.46, -1226], [1.544, -1248], [1.627, -1266], [1.71, -1280], [1.794, -1291], [1.877, -1299], [2.024, -1308], [2.224, -1312]],
  // 4,42 → 6,1 s: la camera sale sul ∞ che si disegna sopra la griglia; picco ~1700 px/s a 4,8 s
  r79_grigliaInfinito: [[0, 0], [0.08, 20], [0.16, 69], [0.25, 150], [0.33, 258], [0.41, 394], [0.5, 463], [0.58, 515], [0.66, 554], [0.78, 585], [0.93, 606], [1.18, 618], [1.68, 628]],
};
const TR_PROFILI = {};
Object.keys(TR_MISURE).forEach((k) => {
  const m = TR_MISURE[k], T = m[m.length - 1][0], D = m[m.length - 1][1];
  TR_PROFILI[k] = m.map(([t, v]) => [t / T, v / D]);
});

/* @trans panVerticale · Pan verticale con dissolvenza (reel 79: cervello → griglia 1,38–3,9 s; griglia → ∞ 4,42–6,1 s)
 * kallaway: la camera scorre in verticale verso la scena dopo, che sta sotto (o sopra) nel mondo; quella di prima esce dal bordo e
 *   sfuma, quella dopo arriva in corsa ed entra sfumando; parte piano, ha il picco a ~1/4 della durata e frena a lungo
 * misure: cervello → griglia: 1383 px in 2,52 s (picco ~2800 px/s a 1,85 s, 19% della durata), il cervello sfuma 1,70–1,88 s, la
 *   griglia entra 1,80–1,92 s · griglia → ∞: 628 px in 1,68 s (picco ~1700 px/s a 4,8 s, 23%), il ∞ si disegna mentre si sale
 * scena: t0, dur, dy (px schermo del contenuto: negativo = il contenuto sale, la camera scende) · opzioni: profilo (nome in TR_PROFILI
 *   o tabella), dx, esce ([nodi, t, dur]), entra ([nodi, t, dur])
 * chiamata: TRANS.panVerticale(1.376, 2.52, -1383, { profilo: "r79_cervelloGriglia", esce: [[cervello], 1.70, 0.18] });
 */
TRANS.panVerticale = (t0, dur, dy, o) => {
  o = o || {};
  const prof = typeof o.profilo === "string" ? TR_PROFILI[o.profilo] : o.profilo || TR_PROFILI.r79_cervelloGriglia;
  const f = cpTab(prof), dx = o.dx || 0, N = 48, pts = [];
  for (let i = 0; i <= N; i++) { const u = i / N, p = f(u); pts.push([t0 + u * dur, dx * p, dy * p]); }
  cpCam.percorso(pts);
  if (o.esce) tl.to(o.esce[0], { opacity: 0, duration: o.esce[2], ease: "power1.in" }, o.esce[1]);
  if (o.entra) { gsap.set(o.entra[0], { opacity: 0 }); tl.to(o.entra[0], { opacity: 1, duration: o.entra[2], ease: "power1.out" }, o.entra[1]); }
  return t0 + dur;
};
