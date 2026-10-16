// ═══ KW kit v2 · COPIA FEDELE · testo del blocco C2 (reel 5 di Kallaway) — T08 ════════════════════════════════════════════════

/* @copia T08 · Uscita del titolo: diventa grigio e se ne va (copia del reel 5, 35,42–35,83 s; anche 13,42–13,8 e 81,1–81,4 s)
 * kallaway: reel 5, 35,42 s · finita la lista, mentre la voce 02 sale a fare da intestazione, il titolo «3 Reasons…» si spegne:
 *   le parole bianche tornano grigie (il riquadro rosso con loro) in ~0,15 s e poi tutto svanisce in ~0,25 s
 * misure: 35,42 bianco pieno → 35,5 grigio (≈52%) → 35,75 appena visibile → 35,83 sparito (fotogrammi a 24 fps); il riquadro
 *   rosso non si ritira, si spegne insieme alle parole
 * quando: fine sezione, quando il titolo lascia il posto all'intestazione o alla scena dopo
 * scena: titolo (r5Titolo o cpTitolo con outAt), t · opzioni: grigio (0,15), dopo (0,12), via (0,25)
 * restituisce: niente
 * colori: bianco → grigio 52% → via; riquadro lime → spento
 * chiamata: COPIA.T08(T, 35.42);
 */
COPIA.T08 = (T, t, o) => {
  o = o || {};
  T.outAt(t, { grigio: o.grigio || 0.15, dopo: o.dopo == null ? 0.12 : o.dopo, via: o.via || 0.25 });
};
