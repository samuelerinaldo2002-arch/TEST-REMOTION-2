// ═══ KW kit v2 · COPIA FEDELE · aperture (A05) — blocco C1, reel 79 di Kallaway ═════════════════════════════════════════════

/* @copia A05 · Clip vera che diventa infografica (copia del reel 79, 0–1,88 s: contiene T01, C01, O13, F02, F01, K02)
 * kallaway: reel 79, 0–1,88 s · fotogramma 0 già pieno: una card orizzontale con 4 storyteller veri in montaggio rapido (cambi a
 *   0,167 · 0,334 · 0,48 s), che arriva dal basso in corsa e frena (K02); sopra, il titolo parola per parola (T01); a 0,63 s la
 *   camera scorre a destra seguendo una linea (C01) fino al cervello (O13), dietro al quale si apre il disco (F02, 1,21 s); poi il
 *   cervello cresce e la camera scende verso la griglia (transizione TRANS.panVerticale)
 * misure: card 800×444 centrata (540, 961) al fotogramma 0 (0,74 della larghezza), dalla clip 4 (0,48 s) 796×400 · arrivo del
 *   contenuto −75 px nei primi 0,125 s (600 px/s), −146 px a 0,5 s, poi deriva ~70 px/s verso l'alto fino a 1,38 s (−217 px) ·
 *   zoom +1,1% in 0,9 s · cervello 883 px a destra del centro della card, stessa altezza
 * quando: l'apertura del reel: una situazione vera (persone che raccontano) che diventa il concetto (cervello, dipendenza)
 * scena: t0 (0), t1 (1,88), X, Y (punto del mondo al centro della camera al fotogramma 0), parent
 * opzioni: clip ([[t, id]] del pool: le 4 clip), card ([w, h, w2, h2]), titolo (righe di COPIA.T01), titoloEsce (t, 4,17),
 *   cervello (true)
 * restituisce: rect, pose, ancore { card, cervello, cervelloSotto }, elementi { card, T, linea, cervello }, tempi { taglio, linea,
 *   disco }
 * chiamata:
 *   const a05 = COPIA.A05({ t0: 0, t1: 1.88, X: 540, Y: 880 }, { clip: [[0, "card_a"], [0.167, "card_b"], [0.334, "card_c"],
 *     [0.48, "card_d"]], titoloEsce: 4.17 });
 */
COPIA.A05 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const X = scena.X, Y = scena.Y, t0 = scena.t0 || 0;
  const W = (sx, sy) => [X - ANCHOR.x + sx, Y - ANCHOR.y + sy];   // misura sullo schermo di Kallaway al fotogramma 0 → mondo
  const [cw, ch, cw2, ch2] = o.card || [800, 444, 796, 400];
  const [ccx, ccy] = W(540, 961);
  const clip = o.clip || [[0, "card_a"], [0.167, "card_b"], [0.334, "card_c"], [0.48, "card_d"]];
  const card = cpCardVideo(L, ccx, ccy, cw, ch, clip.map(([t, id], i) => (i === clip.length - 1 ? [t0 + t, id, cw2, ch2] : [t0 + t, id])), { z: 10, r: 14 });
  // camera: taglio d'apertura + K02 (arrivo dal basso che frena) + deriva verso l'alto; zoom lieve
  cpCam.taglio(t0, { fx: X, fy: Y, s: 1 });
  cpCam.percorso([[0, 0, 0], [0.125, 0, -75], [0.21, 0, -96], [0.3, 0, -112], [0.4, 0, -131], [0.5, 0, -146], [0.626, 0, -154], [0.751, 0, -164], [0.876, 0, -173], [1.001, 0, -179], [1.126, 0, -187], [1.251, 0, -200], [1.376, 0, -217]].map(([t, a, b]) => [t0 + t, a, b]));
  cpCam.scala([[0.5, 1], [0.92, 1.0086], [1.38, 1.0107], [1.75, 1.017]].map(([t, k]) => [t0 + t, k]), [540, 880]);
  // T01 · il titolo
  const T = COPIA.T01({ t0, t1: o.titoloEsce == null ? null : o.titoloEsce }, { righe: o.titolo });
  // O13 · il cervello in fondo alla linea, F02 · il disco dietro di lui
  const [bx, by] = W(1423, 967);
  let cerv = null;
  if (o.cervello !== false) cerv = COPIA.O13({ X: bx, Y: by, parent: L }, { larghezza: 267, cresce: [t0 + 1.25, 0.4, 1.13], disco: t0 + 1.21, discoR: 385 });
  // C01 · la linea dal bordo della card al cervello, la camera la segue
  const lin = COPIA.C01({ t0: t0 + 0.626, da: [ccx + cw / 2, ccy + 3], a: [bx - 134, by], parent: L }, { linea: [t0 + 0.70, 0.25] });
  return {
    rect: [ccx - cw / 2, ccy - ch / 2, bx + 140, ccy + ch / 2], pose: { fx: X, fy: Y, s: 1 },
    ancore: { card: [ccx, ccy], cervello: [bx, by], cervelloSotto: [bx, by + 110] },
    elementi: { card, T: T.elementi.T, linea: lin, cervello: cerv, L },
    tempi: { taglio: t0, linea: t0 + 0.7, disco: t0 + 1.21 },
  };
};
