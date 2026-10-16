// ═══ KW kit v2 · COPIA FEDELE · scene del reel 79 che non sono una voce del catalogo (COPIA.r79_*) — blocco C1 ═══════════════

/* @copia r79_griglia · Griglia di reel di altri, si tinge, il tuo reel esce in avanti (reel 79, 1,8–4,9 s)
 * kallaway: reel 79, 1,8–4,9 s · arriva dal basso (transizione dal cervello) una griglia di miniature vere di reel (3 colonne,
 *   celle 9:16 con le loro scritte); a 2,63 s tutte tranne quella al centro si tingono del colore d'accento (F11, in un fotogramma);
 *   2,9–3,3 s il bordo della cella centrale si accende di bianco; 3,25–4,1 s il SUO reel (titolo sopra, schermata, faccia sotto)
 *   esce in avanti e cresce ×1,77 restando al centro; poi la camera sale sul ∞ e la griglia esce dal basso sfumando
 * misure: griglia larga 500 px (0,46 della larghezza), celle 155×287, passo 172 × 304, 3 righe sopra quella centrale; cella
 *   centrale (545, 868) a 3,2 s → (540, 795) larga 275 a 4,15 s; crescita (scala) 3,34: 1,014 · 3,42: 1,046 · 3,50: 1,116 · 3,59:
 *   1,30 · 3,67: 1,535 · 3,75: 1,649 · 3,84: 1,715 · 3,92: 1,758 · 4,0: 1,769 · 4,09: 1,77
 * quando: «gli altri contenuti / il tuo contenuto»: il feed pieno e il tuo che si stacca
 * scena: X, Y (centro della cella centrale nel mondo), t0 (comparsa), t1 (uscita), parent · opzioni: celle (id th-/cp- delle
 *   miniature, 20), centro (id del video del tuo reel), tinta (2,63), luce (2,9), cresce (3,25), crescita (tabella), arrivo
 *   ([x, y] schermo della cella centrale a crescita finita, relativo a dove sta a 3,2 s: [−5, −73]), esce ([t, dur])
 * restituisce: rect, ancore { centro }, elementi { g, celle, centro }
 * colori: la sua tinta rossa → monocromo lime (scuri neri, chiari lime), il bordo bianco resta bianco
 */
COPIA.r79_griglia = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const cw = 155, ch = 287, px = 172, py = 304, R0 = o.sopra == null ? 3 : o.sopra, NR = R0 + 1 + (o.sotto == null ? 3 : o.sotto);
  const X = scena.X, Y = scena.Y;
  const g = layered(el(L, { position: "absolute", left: X - px - cw / 2 - 8, top: Y - R0 * py - ch / 2 - 8, width: 2 * px + cw + 16, height: (NR - 1) * py + ch + 16, zIndex: o.z || 10 }));
  const ox = 8, oy = 8;
  const ids = o.celle || Array.from({ length: 20 }, (_, i) => `cp-g${String(i + 1).padStart(2, "0")}`);
  const celle = [];
  let k = 0, centro = null;
  for (let r = 0; r < NR; r++) for (let c = 0; c < 3; c++) {
    const x = ox + c * px, y = oy + r * py;
    if (r === R0 && c === 1) {
      centro = layered(el(g, { position: "absolute", left: x, top: y, width: cw, height: ch, borderRadius: 9, overflow: "hidden", background: "#111", zIndex: 5, boxShadow: "0 0 0 1.5px rgba(255,255,255,.25)" }));
      mediaTile(centro, 0, 0, cw, ch, o.centro || "c_centro", 1).style.borderRadius = "0px";
      continue;
    }
    const cel = el(g, { position: "absolute", left: x, top: y, width: cw, height: ch, borderRadius: 9, overflow: "hidden", background: "#222", zIndex: 2 });
    imgIn(cel, ids[k++ % ids.length], { objectFit: "cover" });
    const tin = el(cel, { position: "absolute", inset: 0, background: K.lime, mixBlendMode: "multiply", opacity: 0, zIndex: 3 });
    celle.push({ cel, tin, r, c });
  }
  // vignetta: le celle lontane dal centro più scure (Kallaway: la griglia tinta è accesa al centro e si spegne verso i bordi)
  const vig = el(g, { position: "absolute", left: -40, top: -40, right: -40, bottom: -40, background: `radial-gradient(ellipse 62% 30% at 50% ${((oy + R0 * py + ch / 2 + 40) / ((NR - 1) * py + ch + 16 + 80)) * 100}%, rgba(20,20,20,0) 40%, rgba(20,20,20,.55) 78%, rgba(20,20,20,.85) 100%)`, opacity: 0, zIndex: 4, pointerEvents: "none" });
  // F11 · la tinta in un fotogramma (2,63 s)
  const tt = o.tinta == null ? 2.63 : o.tinta;
  celle.forEach(({ cel, tin }) => {
    tl.fromTo(cel.firstChild, { filter: "grayscale(0) contrast(1) brightness(1)" }, { filter: "grayscale(1) contrast(1.25) brightness(1.05)", duration: 0.04, ease: "none", immediateRender: false }, tt);
    tl.to(tin, { opacity: 1, duration: 0.04, ease: "none" }, tt);
  });
  tl.to(vig, { opacity: 1, duration: 0.04 }, tt);
  // il bordo della cella centrale si accende di bianco (2,9–3,3 s)
  const tluce = o.luce == null ? 2.9 : o.luce;
  tl.to(centro, { boxShadow: "0 0 0 3px rgba(255,255,255,.95), 0 0 34px rgba(255,255,255,.55), 0 0 90px rgba(255,255,255,.22)", duration: 0.4, ease: "power1.out" }, tluce);
  // il tuo reel esce in avanti e cresce ×1,77 (curva misurata), il centro va da (545, 868) a (540, 795) sullo schermo
  const tc = o.cresce == null ? 3.25 : o.cresce;
  const tab = o.crescita || [[0, 1], [0.087, 1.014], [0.17, 1.046], [0.254, 1.116], [0.337, 1.30], [0.42, 1.535], [0.504, 1.649], [0.587, 1.715], [0.671, 1.758], [0.754, 1.769], [0.837, 1.77]];
  const fk = cpCurva(tab), [ax, ay] = o.arrivo || [-5, -58], kf = tab[tab.length - 1][1], durC = tab[tab.length - 1][0];
  const st = { v: 0 };
  gsap.set(centro, { transformOrigin: "50% 50%" });
  tl.fromTo(st, { v: 0 }, { v: 1, duration: durC, ease: "none", immediateRender: false, onUpdate: () => { const kk = fk(st.v * durC), f = (kk - 1) / (kf - 1); gsap.set(centro, { scale: kk, x: ax * f, y: ay * f }); } }, tc);
  if (o.esce) tl.to(g, { opacity: 0, duration: o.esce[1], ease: "power1.in" }, o.esce[0]);
  return {
    rect: [X - px - cw / 2, Y - R0 * py - ch / 2, X + px + cw / 2, Y + (NR - 1 - R0) * py + ch / 2], pose: null,
    ancore: { centro: [X, Y] }, elementi: { g, celle, centro },
  };
};

/* @copia r79_albero · L'albero: il cervello (la psicologia) sopra, il ∞ e la slot sotto (reel 79, 6,67–9,9 s)
 * kallaway: reel 79, 6,67–9,9 s · la camera si allontana dal ∞ coi numeri (×0,55 in 1,42 s, il contenuto scende) e in alto entra
 *   il cervello, FERMO sullo schermo (non segue lo zoom), con una linea che scende fino al ∞; a 8,08 s sopra il cervello compare
 *   «Psychology»; 8,3–9,0 s un secondo allontanamento con un pan a sinistra fa entrare la slot da destra (O14) e una seconda linea
 *   va dal cervello alla slot; 9,6 s la camera parte verso la slot (K03), cervello e ∞ sfumano
 * misure: cervello (537, 440) largo ~280 (0,26 della larghezza), entra 6,95–7,2 s, esce 9,70–9,9 s; etichetta y 292, ~50 px;
 *   linea al ∞ 6,98–7,2 s, linea alla slot 8,82–9,05 s; ∞ esce 9,65–9,95 s
 * quando: «usa la stessa psicologia che…»: un concetto (cervello) che sta sopra due cose che lo usano
 * scena: t0, t1, parent (hud per il cervello) · opzioni: infinito (punto del mondo: la cima del ∞), slot (punto del mondo: la
 *   cima della slot), etichetta ("Psicologia"), tEtichetta (8,08)
 * restituisce: elementi { cervello, etichetta, linee }
 */
COPIA.r79_albero = (scena, o) => {
  o = o || {};
  const H = scena.parent || hud;
  const cerv = COPIA.O13({ X: 537, Y: 440, parent: H }, { larghezza: 280, entra: [6.95, 0.25], esce: [9.70, 0.2], z: 20 });
  tl.fromTo(cerv.elementi.g, { y: 42 }, { y: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, 6.95);   // entra un filo più in basso (483 → 440)
  const et = layered(el(H, { position: "absolute", left: 537 - 400, top: 262, width: 800, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: o.fsEtichetta || 54, lineHeight: 1, letterSpacing: "-0.02em", color: GREY, textShadow: CP_GLOW_T, zIndex: 21 }, o.etichetta || "Psicologia"));
  const te = o.tEtichetta == null ? 8.08 : o.tEtichetta;
  gsap.set(et, { opacity: 0, filter: "blur(9px)", y: 5 });
  tl.to(et, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.2, ease: "power2.out" }, te);
  tl.to(et, { color: K.white, duration: 0.2 }, te + 0.1);
  tl.set(et, { filter: "none" }, te + 0.21);
  tl.to(et, { opacity: 0, duration: 0.2, ease: "power1.in" }, 9.70);
  const linee = [];
  if (o.infinito) linee.push(cpLineaMista([537, 548], o.infinito, 6.98, 9.9, 6.98, 0.22));
  if (o.slot) linee.push(cpLineaMista([575, 540], o.slot, 8.82, 9.9, 8.82, 0.23));
  linee.forEach((l) => tl.to(l.ln, { attr: { opacity: 0 }, duration: 0.2 }, 9.70));
  return { rect: null, pose: null, ancore: {}, elementi: { cervello: cerv, etichetta: et, linee } };
};

/* @copia r79_telefono · Il telefono col tuo reel, il cervello sopra, due dischi (reel 79, 12,3–16,39 s; dentro c'è K06)
 * kallaway: reel 79, 12,30–16,39 s · taglio su un telefono al centro col SUO reel che scorre (documento «How To Script A Winning
 *   YouTube Video» + la faccia sotto; 14,45 s lui in bianco e nero; 15,45 s il documento scuro «Viral YouTube Script Framework»);
 *   a 12,38 s sopra il telefono sale il cervello e a 12,43 s dietro si apre il disco (F02); a 13,62 s un secondo disco più largo; dal
 *   13,75 s la camera si avvicina piano (×1,2 fino al taglio, power1.out) e il cervello sale
 * misure: telefono 333×680 centrato (541, 865) a 12,3 s (0,31 della larghezza); dischi: 12,37 s Ø 770 centro (541, 940) svanisce
 *   in ~0,5 s; 13,62 s Ø 900; cervello (541, 454) largo 194 a 12,42 s → 162 a 13,0 s (si accende grande e torna), sale a 275 a
 *   15,9 s; spinta ×1,195 da 13,75 a 16,39 s attorno a (541, 976)
 * quando: «perché ci sia dopamina, chi guarda deve tenerci alla tua storia»: il contenuto (telefono) e la reazione (cervello)
 * scena: t0 (12,304), t1 (16,39), X, Y (centro del telefono nel mondo), parent · opzioni: cambi (media dello schermo), dischi
 *   ([t, r]…), spinta ([t, dur, k, Q])
 * restituisce: elementi { tel, cervello }
 */
COPIA.r79_telefono = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 541 + sx, Y - 865 + sy];
  const tel = cpTelefono(L, X, Y, 333, 680, o.cambi || [[scena.t0, "tel_a"], [14.45, "tel_b"], [15.45, "tel_c"]], { z: 12 });
  const [bx, by] = W(541, 437);
  const cerv = COPIA.O13({ X: bx, Y: by, parent: L }, { larghezza: 165, z: 14 });
  gsap.set(cerv.elementi.g, { opacity: 0 });
  tl.to(cerv.elementi.g, { opacity: 1, duration: 0.05 }, 12.38);
  // si accende grande col disco e torna (194 → 162 px), di nuovo al secondo disco; poi sale piano
  tl.fromTo(cerv.elementi.g, { scale: 1.18 }, { scale: 1, duration: 0.55, ease: "power2.out", immediateRender: false }, 12.43);
  tl.fromTo(cerv.elementi.g, { scale: 1.14 }, { scale: 1, duration: 0.55, ease: "power2.out", immediateRender: false }, 13.62);
  // esce da dietro il telefono (60 px in 0,07 s) e poi sale piano come fumo (−52 px fino al taglio)
  tl.fromTo(cerv.elementi.g, { y: 60 }, { y: 17, duration: 0.07, ease: "power2.out", immediateRender: false }, 12.38);
  tl.fromTo(cerv.elementi.g, { y: 17 }, { y: -52, duration: scena.t1 - 12.44, ease: "none", immediateRender: false }, 12.44);
  const [dx, dy] = W(541, 940);
  (o.dischi || [[12.43, 385], [13.62, 450]]).forEach(([t, r]) => COPIA.F02({ t0: t, X: dx, Y: dy, parent: L }, { r, z: 10 }));
  const sp = o.spinta || [13.75, scena.t1 - 13.75, 1.195, [541, 976]];
  cpCam.zoom(sp[0], sp[1], sp[2], sp[3], "power1.out");
  return { rect: tel.rect, pose: null, ancore: { telefono: [X, Y] }, elementi: { tel, cervello: cerv } };
};

// fiche da casinò (reel 79, la «posta in gioco»): disco grafite lucido, anello col bordo a tacche lime, cerchio interno sottile,
// numero nel ruolo del suo serif (Patrick Hand) che compare quando la fiche diventa una voce della lista
const cpFiche = (parent, cx, cy, d, num, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: "50%", zIndex: o.z || 12, boxShadow: `0 10px 30px rgba(0,0,0,.6), ${GLOW_A(0.45)}` }));
  el(g, { position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #4a4a44 0%, #262624 55%, #141413 100%)", border: `${Math.round(d * 0.035)}px solid ${K.lime}` });
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4, r = d * 0.43;
    el(g, { position: "absolute", left: d / 2 + r * Math.cos(a) - d * 0.06, top: d / 2 + r * Math.sin(a) - d * 0.035, width: d * 0.12, height: d * 0.07, borderRadius: d * 0.015, background: "linear-gradient(180deg,#eaffa6,#CFFB50)", transform: `rotate(${(a * 180) / Math.PI + 90}deg)` });
  }
  el(g, { position: "absolute", left: d * 0.2, top: d * 0.2, width: d * 0.6, height: d * 0.6, borderRadius: "50%", border: "2px solid rgba(207,251,80,.75)", background: "radial-gradient(circle at 45% 40%, #34342f, #1b1b19 80%)" });
  const n = el(g, { position: "absolute", left: 0, top: 0, width: d, height: d, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FH, fontSize: d * 0.42, color: K.lime, textShadow: GLOW_LT, opacity: 0 }, String(num));
  return { g, n };
};

/* @copia r79_fiches · «Posta in gioco»: tre fiches in fila, ognuna sale in una lista e la sua voce si scrive accanto (reel 79,
 *   18,23–23,79 s; dentro c'è K04)
 * kallaway: reel 79, 18,23–23,79 s · titolo «Stakes» nell'HUD (grigio 18,33 → bianco 18,5); tre fiches d'oro entrano in fila in
 *   basso (sfumano dentro 18,35–18,8 e salgono di ~20 px frenando); su «one» la prima sale a sinistra e diventa la voce 1 (numero
 *   dentro la fiche), il testo si scrive accanto parola per parola; poi la 2 e la 3 lasciano la fila e vanno al loro posto; la
 *   lista risale man mano (−87 px) e la camera deriva (K04)
 * misure: fiches Ø 118 px (0,11 della larghezza) in fila a y 1098 (x 251 · 541 · 859); voce 1: la fiche sale da 1097 a 647 in
 *   2,4 s (18,56 → 20,94, frenando) e poi a 560 con la lista; voce 2: 21,45 → 22,15 s da (541, 1098) a (302, 845), poi (268,
 *   790); voce 3: 22,86 → 23,5 s da (858, 1098) a (300, 1022); testo a 122 px dalla fiche, ~38 px neretto bianco; righe a −16 e
 *   +39 dal centro (due righe) o +13 (una)
 * quando: una lista di 3 cose concrete che «si mettono in gioco» (posta, ingredienti, requisiti)
 * scena: t0 (18,23), t1 (23,79), X, Y (punto del mondo al centro della camera a riposo), parent · opzioni: titolo, voci
 *   ([{ righe: [..], tempi: [..] }] ×3), tTitolo (18,33)
 * restituisce: elementi { fiches, T }
 */
COPIA.r79_fiches = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const T = cpTitolo({ righe: [[{ t: o.titolo || "Posta in gioco", ruolo: "sans", size: 66, unita: true }]], x: 540, y: 196, parent: hud });
  T.inAt([o.tTitolo || 18.33]);
  T.outAt(scena.t1 - 0.06, { grigio: 0.02, dopo: 0.01, via: 0.02 });
  const D = 150;   // il disco col bordo a tacche (la parte più chiara misura 118 px, con le tacche e l'alone ~165)
  const tracce = [
    [[18.4, 251, 1097], [18.56, 251, 1097], [18.81, 255, 1076], [18.94, 257, 1062], [19.06, 259, 1036], [19.19, 260.5, 997], [19.31, 262.5, 950], [19.44, 263, 904], [19.56, 263, 864], [19.69, 263, 830], [19.81, 262.5, 800], [19.94, 261.5, 775], [20.06, 261, 752], [20.19, 260.5, 732], [20.31, 260.5, 714.5], [20.44, 260.5, 698], [20.56, 260.5, 683.5], [20.69, 260.5, 670.5], [20.81, 261.5, 658], [20.94, 261.5, 647], [21.19, 261.5, 628], [21.44, 262, 614], [21.69, 262.5, 601.5], [21.94, 263, 590], [22.19, 263, 583], [22.44, 263.5, 576], [22.69, 264, 569.5], [22.94, 264, 565.5], [23.19, 264.5, 562.5], [23.44, 264.5, 560.5], [23.69, 264.5, 560]],
    [[18.4, 541, 1098], [21.45, 541, 1098], [21.52, 510, 1050], [21.6, 460, 1005], [21.69, 424, 975], [21.85, 360, 905], [22.0, 320, 862], [22.15, 302, 845], [22.3, 295, 835], [22.6, 285, 820], [23.0, 275, 805], [23.4, 270, 795], [23.69, 268, 790]],
    [[18.4, 858.5, 1098], [22.86, 858.5, 1098], [22.94, 782, 1084], [22.98, 758, 1081], [23.02, 726, 1076], [23.06, 681, 1070], [23.11, 618, 1060], [23.15, 543, 1050], [23.19, 477, 1041], [23.23, 427, 1035], [23.27, 391, 1031], [23.4, 330, 1025], [23.5, 300, 1022], [23.69, 275, 1020]],
  ];
  const voci = o.voci || [
    { righe: ["Un personaggio per cui", "fare il tifo"], tempi: [20.04, 20.08, 20.32, 20.44, 20.56, 20.76, 20.96] },
    { righe: ["Qualcosa da perdere"], tempi: [21.94, 22.06, 22.28] },
    { righe: ["Urgenza"], tempi: [23.44] },
  ];
  const numT = [19.4, 21.5, 23.0];
  const fiches = tracce.map((tr, i) => {
    const holder = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 12 }));
    const f = cpFiche(holder, 0, 0, D, i + 1);
    const pts = tr.map(([t, sx, sy]) => { const w = W(sx, sy); return [t, w[0], w[1]]; });
    gsap.set(holder, { x: pts[0][1], y: pts[0][2], opacity: 0 });
    cpStrato(holder, pts);
    tl.to(holder, { opacity: 1, duration: 0.4, ease: "power1.out" }, 18.38);
    tl.to(f.n, { opacity: 1, duration: 0.15 }, numT[i]);
    const v = voci[i], due = v.righe.length > 1;
    const tx = layered(el(holder, { position: "absolute", left: 124, top: due ? -20 - 24 : 13 - 24, width: 900, zIndex: 13 }));
    const parole = [];
    v.righe.forEach((r, ri) => {
      const rr = el(tx, { position: "absolute", left: 0, top: ri * 55, whiteSpace: "nowrap", fontFamily: FS, fontWeight: 800, fontSize: 38, lineHeight: 1.15, letterSpacing: "-0.01em" });
      r.split(" ").forEach((p, k, A) => parole.push(el(rr, { display: "inline-block", whiteSpace: "pre", color: GREY, textShadow: CP_GLOW_T }, p + (k < A.length - 1 ? " " : ""), "span")));
    });
    gsap.set(parole, { opacity: 0, filter: "blur(8px)", y: 4 });
    parole.forEach((p, k) => {
      const t = v.tempi[Math.min(k, v.tempi.length - 1)];
      tl.to(p, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.17, ease: "power2.out" }, t);
      tl.to(p, { color: K.white, duration: 0.18 }, t + 0.12);
      tl.set(p, { filter: "none" }, t + 0.18);
    });
    return { holder, f, tx };
  });
  COPIA.K04({ t0: 20.81 }, { arrivo: 18.4 });
  return { rect: null, pose: null, ancore: {}, elementi: { fiches, T } };
};

/* @copia r79_copione · Il documento COPIONE: la riga di luce lo scorre, poi ci si avvicina e la frase d'esempio è scritta dentro
 *   (reel 79, 23,79–30,36 s)
 * kallaway: reel 79, 23,79–30,36 s · taglio su un documento in vetro scuro «SCRIPT» con le righe grigie segnaposto: una riga di
 *   luce bianca lo scorre dall'alto in basso (23,85–24,75 s); 25,45–25,55 s si spegne sul nero e riappare ingrandito ×1,65
 *   (bordo bianco luminoso) con una riga scritta in bianco al posto di un segnaposto («me as the character will have to sell my
 *   house»); a 27,85 s compare la seconda («if I don't complete a specific mission in the next 2 weeks.»); camera quasi ferma
 *   (−13 px in 4,4 s)
 * misure: documento 1: x 260–820, y 350–1114 (0,52 della larghezza); riga di luce 23,85 → 24,75 s da y 560 a 1100; documento 2:
 *   x 76–1002, y 240 → oltre il fondo (0,86 della larghezza), «SCRIPT» y 340 ~44 px, righe da y 514 ogni 66 px, testo bianco
 *   ~32 px su y 844 e 880; buio 25,45–25,55 s, il documento 2 entra 25,55–25,75 s
 * quando: «per esempio…»: la frase d'esempio scritta dentro un copione vero
 * scena: t0, t1, X, Y (centro della camera a riposo, mondo), parent · opzioni: righe ([riga1, riga2]), tRighe ([25,7, 27,85]),
 *   titolo ("COPIONE")
 */
COPIA.r79_copione = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const X = scena.X, Y = scena.Y, W = (sx, sy) => [X - 540 + sx, Y - 880 + sy];
  const doc = (x0, y0, w, h, forte) => {
    const g = layered(el(L, { position: "absolute", left: x0, top: y0, width: w, height: h, borderRadius: forte ? 6 : 4, background: "linear-gradient(180deg, rgba(40,40,40,.92), rgba(24,24,24,.96))", border: `${forte ? 2.5 : 1.5}px solid rgba(255,255,255,${forte ? 0.92 : 0.32})`, boxShadow: forte ? "0 0 16px rgba(255,255,255,.55), 0 0 60px rgba(255,255,255,.18), inset 0 0 30px rgba(255,255,255,.05)" : "0 0 30px rgba(255,255,255,.06), inset 0 0 40px rgba(255,255,255,.03)", overflow: "hidden", zIndex: 12 }));
    el(g, { position: "absolute", left: 0, top: forte ? 78 : 44, width: w, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: forte ? 44 : 26, letterSpacing: "0.02em", color: forte ? K.white : "rgba(255,255,255,.62)", textShadow: forte ? CP_GLOW_T : "none" }, o.titolo || "COPIONE");
    return g;
  };
  const [a0, b0] = W(260, 350);
  const d1 = doc(a0, b0, 560, 764, false);
  [0.75, 0.4, 0.8, 0.58, 0.8, 0.78, 0.7, 0.82, 0.62, 0.84, 0.5, 0.5].forEach((f, i) => el(d1, { position: "absolute", left: 78, top: 166 + i * 40, width: (560 - 156) * f, height: 5, borderRadius: 3, background: "rgba(255,255,255,.22)" }));
  const luce = el(d1, { position: "absolute", left: -10, top: 0, width: 580, height: 6, borderRadius: 3, background: "linear-gradient(90deg, rgba(255,255,255,.2), #ffffff 12%, #ffffff 88%, rgba(255,255,255,.2))", boxShadow: "0 0 14px rgba(255,255,255,.9), 0 0 40px rgba(255,255,255,.4)", opacity: 0 });
  tl.set(luce, { opacity: 1 }, 23.85);
  tl.fromTo(luce, { y: 210 }, { y: 750, duration: 0.9, ease: "power1.inOut", immediateRender: false }, 23.85);
  tl.to(luce, { opacity: 0, duration: 0.1 }, 24.75);
  tl.to(d1, { opacity: 0, duration: 0.08 }, 25.45);
  const [a2, b2] = W(76, 240);
  const d2 = doc(a2, b2, 926, 1300, true);
  gsap.set(d2, { opacity: 0 });
  tl.to(d2, { opacity: 1, duration: 0.2, ease: "power1.out" }, 25.55);
  [0.76, 0.4, 0.74, 0.58, 0.81, null, null, 0.72, 0.82, 0.62, 0.84, 0.5, 0.5, 0.4].forEach((f, i) => { if (f) el(d2, { position: "absolute", left: 140, top: 274 + i * 66, width: (926 - 280) * f, height: 8, borderRadius: 4, background: "rgba(255,255,255,.2)" }); });
  const righe = o.righe || ["io, il personaggio, dovrò vendere casa mia", "se non completo una missione precisa entro 2 settimane."];
  const tR = o.tRighe || [25.7, 27.85];
  righe.forEach((r, i) => {
    const n = el(d2, { position: "absolute", left: 140, top: 274 + 5 * 66 - 16 + i * 40, width: 760, whiteSpace: "nowrap", fontFamily: FS, fontWeight: 800, fontSize: i ? 26 : 31, color: K.white, textShadow: CP_GLOW_T, letterSpacing: "-0.01em" }, r);
    gsap.set(n, { opacity: 0 });
    tl.to(n, { opacity: 1, duration: 0.12 }, tR[i]);
  });
  cpCam.percorso([[25.75, 0, 0], [26.6, 0, -1.7], [27.6, 0, -6.3], [28.6, 0, -10.3], [29.6, 0, -12.3], [30.3, 0, -12.7]]);
  return { rect: null, pose: null, ancore: {}, elementi: { d1, d2 } };
};

// riquadro d'evidenza sulle scritte di un reel vero (Kallaway: verde per la «Big Question», viola per gli «Stakes"; qui lime e
// bianco): bordo pieno con l'alone, compare in 2 fotogrammi senza rimbalzo
const cpEvidenza = (parent, x, y, w, h, t, col, o) => {
  o = o || {};
  const b = layered(el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 4, border: `4px solid ${col}`, boxShadow: `0 0 14px ${col === K.lime ? "rgba(207,251,80,.75)" : "rgba(255,255,255,.7)"}, inset 0 0 18px ${col === K.lime ? "rgba(207,251,80,.25)" : "rgba(255,255,255,.18)"}`, background: col === K.lime ? "rgba(207,251,80,.07)" : "rgba(255,255,255,.06)", opacity: 0, zIndex: o.z || 30, pointerEvents: "none" }));
  tl.fromTo(b, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.08, ease: "power2.out", immediateRender: false }, t);
  if (o.via) tl.to(b, { opacity: 0, duration: 0.12 }, o.via);
  return b;
};
// etichetta in neretto con il connettore tratteggiato che va al riquadro (Kallaway: «Stakes» e «Big Question» a sinistra del reel)
const cpEtichettaTratteggio = (parent, testo, lx, ly, punti, t, o) => {
  o = o || {};
  const e = layered(el(parent, { position: "absolute", left: lx, top: ly, whiteSpace: "nowrap", fontFamily: FD, fontWeight: 700, fontSize: o.fs || 46, lineHeight: 1, letterSpacing: "-0.02em", color: GREY, textShadow: CP_GLOW_T, zIndex: 32 }, testo));
  gsap.set(e, { opacity: 0, filter: "blur(8px)" });
  tl.to(e, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power2.out" }, t);
  tl.to(e, { color: K.white, duration: 0.2 }, t + (o.bianco == null ? 0.5 : o.bianco));
  tl.set(e, { filter: "none" }, t + 0.21);
  const xs = punti.map((p) => p[0]), ys = punti.map((p) => p[1]);
  const S = svgLayer(parent, 31, Math.min(...xs) - 20, Math.min(...ys) - 20, Math.max(...xs) - Math.min(...xs) + 40, Math.max(...ys) - Math.min(...ys) + 40);
  const c = connector(S, punti, { color: "rgba(255,255,255,.9)", w: 3, dash: [10, 8] });
  c.draw(t + 0.05, 0.25, "power1.out");
  if (o.via) { tl.to(e, { opacity: 0, duration: 0.15 }, o.via); tl.to(S, { opacity: 0, duration: 0.15 }, o.via); }
  return { e, S };
};

/* @copia r79_creator · Il reel vero di un creator: le sue scritte evidenziate, chi guarda si fa la domanda (reel 79, 36,54–46,17 s)
 * kallaway: reel 79, 36,54–46,17 s · taglio su un reel vero di un creator (verticale, al centro) che arriva dal basso frenando;
 *   37,6 s un riquadro verde si accende sulla sua scritta; 37,92 s la camera parte a destra e si avvicina (×1,15) e frena a lungo:
 *   compare chi guarda (un'iconcina di persona) con il fumetto «Did he actually hit 10k?» (38,75 s); 41,0 s di nuovo il reel al
 *   centro, a sinistra «Stakes» con un tratteggio che va a un riquadro viola sulla scritta; 42,75 s «Stakes» se ne va e arriva
 *   «Big Question» col riquadro verde; il reel risale piano
 * misure: reel 500×883 (0,46 della larghezza), centro x 540, cima 346 → 303 in 1,4 s (arrivo) · pan: bordo destro del reel 791 →
 *   724 → 662 → 633 → 613 → 595 → 581 (38,66) → 558 (38,91) → 534 (39,29) → 514 (39,79) → 503 (40,29) → 498 (40,91), zoom ×1,15
 *   attorno a (540, 750) entro 38,66 s · chi guarda a (978, 738) a 38,6 s, fumetto (846, 588) a 39,4 s · seconda parte: cima 363 →
 *   344 (41,17) → 320 (41,67) → 304 (42,33) → 296 (43,0) → 288 (43,84) → 282 (45,0) → 280 (46,0) · etichette x 95, y ~950 / ~905
 * quando: un esempio vero (il reel di un altro creator) per mostrare dove stanno «posta in gioco» e «grande domanda»
 * scena: t0, t1, X, Y (centro della camera a riposo nel mondo, parte 1), X2, Y2 (parte 2), parent · opzioni: clip ([id parte 1,
 *   id stakes, id domanda]), fumetto, etichette ([stakes, domanda])
 */
COPIA.r79_creator = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const W1 = (sx, sy) => [scena.X - 540 + sx, scena.Y - 880 + sy];
  const W2 = (sx, sy) => [scena.X2 - 540 + sx, scena.Y2 - 880 + sy];
  const clip = o.clip || ["cr_a", "cr_b", "cr_c"];
  const CW = 500, CH = 883;
  // parte 1: il reel al centro (cima 346 al taglio), il riquadro lime sulla scritta, poi chi guarda a destra
  const [c1x, c1y] = W1(540, 346 + CH / 2);
  const card1 = cpCardVideo(L, c1x, c1y, CW, CH, [[scena.t0, clip[0]]], { z: 12, r: 14 });
  const bx = (cx, cy) => [cx - CW / 2 + 0.17 * CW, cy - CH / 2 + 0.592 * CH, 0.66 * CW, 0.08 * CH];
  const [e1x, e1y, e1w, e1h] = bx(c1x, c1y);
  cpEvidenza(L, e1x, e1y, e1w, e1h, 37.62, K.lime);
  cpCam.taglio(scena.t0, { fx: scena.X, fy: scena.Y, s: 1 });
  cpCam.percorso([[36.54, 0, 0], [36.66, 0, -8], [36.79, 0, -14], [36.91, 0, -19], [37.04, 0, -23], [37.16, 0, -26], [37.29, 0, -30], [37.41, 0, -33], [37.54, 0, -36], [37.66, 0, -38], [37.79, 0, -41], [37.91, 0, -43]]);
  cpCam.scala([[37.91, 1], [38.04, 1.06], [38.16, 1.10], [38.29, 1.125], [38.41, 1.14], [38.54, 1.148], [38.66, 1.15]], [540, 750]);
  cpCam.percorso([[37.91, 0, 0], [38.04, -81, -2], [38.16, -153, -4], [38.29, -188, -5], [38.41, -212, -6], [38.54, -232, -6], [38.66, -246.5, -6], [38.79, -259.5, -6], [38.91, -269.5, -6], [39.04, -278.5, -6], [39.29, -293.5, -6], [39.54, -304.5, -6], [39.79, -313.5, -6], [40.04, -320.5, -6], [40.29, -324.5, -6], [40.54, -328.5, -6], [40.91, -329.5, -6]]);
  // chi guarda (la sagoma di profilo è ammessa solo per «chi ti guarda»): testa lime, spalle grigie, e il fumetto con la domanda
  const p386 = cpCam.posa(38.6), p394 = cpCam.posa(39.4);
  const wv = [p386.fx + (978 - ANCHOR.x) / p386.s, p386.fy + (738 - ANCHOR.y) / p386.s];
  const vis = layered(el(L, { position: "absolute", left: wv[0] - 45, top: wv[1] - 52, width: 90, height: 104, zIndex: 14 }));
  el(vis, { position: "absolute", left: 27, top: 0, width: 36, height: 36, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #f0ffc0, ${K.lime} 60%, #a8cf3a)`, boxShadow: GLOW_A(0.5) });
  el(vis, { position: "absolute", left: 10, top: 42, width: 70, height: 46, borderRadius: "30px 30px 8px 8px", background: "linear-gradient(180deg,#9a9aa8,#6e6e7a)", boxShadow: "0 8px 20px rgba(0,0,0,.5)" });
  gsap.set(vis, { opacity: 0, scale: 0.85 });
  tl.to(vis, { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" }, 37.98);
  const wb = [p394.fx + (846 - ANCHOR.x) / p394.s, p394.fy + (588 - ANCHOR.y) / p394.s];
  const bub = layered(el(L, { position: "absolute", left: wb[0] - 300, top: wb[1] - 30, width: 600, display: "flex", justifyContent: "center", zIndex: 15 }));
  el(bub, { padding: "10px 22px", borderRadius: 22, border: "2.5px solid rgba(255,255,255,.92)", background: "rgba(20,20,20,.85)", boxShadow: "0 0 18px rgba(255,255,255,.25)", fontFamily: FS, fontWeight: 800, fontSize: 26, color: K.white, whiteSpace: "nowrap" }, o.fumetto || "Gli hanno davvero dato fuoco?", "span");
  gsap.set(bub, { opacity: 0, scale: 0.9 });
  tl.to(bub, { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" }, 38.75);
  // parte 2 (taglio a 41,0 s): di nuovo il reel al centro, risale piano; «Posta in gioco» poi «Grande domanda»
  const [c2x, c2y] = W2(540, 363 + CH / 2);
  const card2 = cpCardVideo(L, c2x, c2y, CW, CH, [[41.0, clip[1]], [42.75, clip[2]]], { z: 12, r: 14 });
  cpCam.taglio(41.0, { fx: scena.X2, fy: scena.Y2, s: 1 });
  cpCam.percorso([[41.0, 0, 0], [41.17, 0, -19], [41.33, 0, -30], [41.5, 0, -37], [41.67, 0, -43], [41.83, 0, -48], [42.0, 0, -52], [42.33, 0, -59], [42.67, 0, -64], [43.0, 0, -67], [43.5, 0, -72], [43.84, 0, -75], [44.5, 0, -79], [45.0, 0, -81], [45.5, 0, -82], [46.0, 0, -83], [46.17, 0, -83]]);
  const [e2x, e2y, e2w, e2h] = bx(c2x, c2y);
  const et = o.etichette || ["Posta in gioco", "Grande domanda"];
  // l'etichetta sta a sinistra, 100 px sotto il riquadro, col tratteggio a L che sale al riquadro (geometria di Kallaway rispetto
  // al riquadro: le scritte del nostro reel stanno più in basso delle sue)
  const top2 = e2y + e2h, lx = W2(95, 0)[0], ly = top2 + 100;
  cpEvidenza(L, e2x, e2y, e2w, e2h, 41.17, K.white, { via: 42.75 });
  cpEtichettaTratteggio(L, et[0], lx, ly, [[lx + 105, ly - 8], [lx + 105, top2 + 50], [e2x + 40, top2 + 50], [e2x + 40, top2]], 41.17, { via: 42.75, bianco: 0.5 });
  cpEvidenza(L, e2x, e2y, e2w, e2h, 43.0, K.lime);
  cpEtichettaTratteggio(L, et[1], lx, ly - 6, [[lx + 120, ly - 14], [lx + 120, top2 + 44], [e2x + 40, top2 + 44], [e2x + 40, top2]], 43.0, { bianco: 0.6 });
  return { rect: null, pose: null, ancore: {}, elementi: { card1, card2, vis, bub } };
};

// carta da gioco vera (reel 79, il blackjack): faccia bianca con gli indici agli angoli e i semi disposti come nelle carte vere
// (cuori rossi, picche nere: colori dell'oggetto vero), oppure il dorso (Kallaway viola → grafite con il disegno lime del brand)
const CP_SEMI = { "♥": "#d4202c", "♦": "#d4202c", "♠": "#141414", "♣": "#141414" };
const CP_PIP = {
  7: [[0.28, 0.2], [0.72, 0.2], [0.5, 0.35], [0.28, 0.5], [0.72, 0.5], [0.28, 0.8], [0.72, 0.8]],
  9: [[0.28, 0.2], [0.72, 0.2], [0.28, 0.4], [0.72, 0.4], [0.5, 0.5], [0.28, 0.6], [0.72, 0.6], [0.28, 0.8], [0.72, 0.8]],
  6: [[0.28, 0.2], [0.72, 0.2], [0.28, 0.5], [0.72, 0.5], [0.28, 0.8], [0.72, 0.8]],
};
const cpCarta = (parent, cx, cy, w, h, valore, seme, o) => {
  o = o || {};
  const g = layered(el(parent, { position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: w * 0.07, zIndex: o.z || 12, boxShadow: "0 18px 40px rgba(0,0,0,.6), 0 0 26px rgba(255,255,255,.18)", overflow: "hidden" }));
  if (o.dorso) {
    el(g, { position: "absolute", inset: 0, background: "#f2f2ee" });
    const dd = el(g, { position: "absolute", left: w * 0.06, top: w * 0.06, right: w * 0.06, bottom: w * 0.06, borderRadius: w * 0.04, background: `repeating-linear-gradient(45deg, rgba(207,251,80,.55) 0 2px, rgba(0,0,0,0) 2px 11px), repeating-linear-gradient(-45deg, rgba(207,251,80,.55) 0 2px, rgba(0,0,0,0) 2px 11px), radial-gradient(circle at 50% 50%, #3a3a36, #22221f 70%)`, border: `2px solid ${K.lime}` });
    el(dd, { position: "absolute", left: "25%", top: "30%", width: "50%", height: "40%", borderRadius: "50%", border: `2px solid ${K.lime}`, background: "radial-gradient(circle, #2b2b28, #1c1c1a)" });
    return { g };
  }
  const col = CP_SEMI[seme] || "#141414";
  el(g, { position: "absolute", inset: 0, background: "linear-gradient(160deg,#ffffff,#f1f1ed)" });
  const ang = (x, y, rot) => {
    const a = el(g, { position: "absolute", left: x, top: y, width: w * 0.2, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, color: col, lineHeight: 0.95, transform: rot ? "rotate(180deg)" : "none" });
    el(a, { fontSize: w * 0.2 }, String(valore));
    el(a, { fontSize: w * 0.15 }, seme);
  };
  ang(w * 0.02, w * 0.05, false);
  ang(w * 0.78, h - w * 0.05 - w * 0.36, true);
  (CP_PIP[valore] || []).forEach(([u, v]) => el(g, { position: "absolute", left: w * u - w * 0.11, top: h * v - w * 0.13, width: w * 0.22, textAlign: "center", fontFamily: "Georgia, serif", fontSize: w * 0.22, lineHeight: 1, color: col, transform: v > 0.55 ? "rotate(180deg)" : "none" }, seme));
  [g, ...g.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));
  return { g };
};

/* @copia r79_carte · La «grande domanda» al casinò: la carta coperta e le due scoperte del blackjack (reel 79, 46,17–50,93 s)
 * kallaway: reel 79, 46,17–50,93 s · titolo a tre righe nell'HUD («How does the / Big Question / works in casino», grigio → bianco
 *   46,25–47,0 s); una carta coperta sale dal basso e frena al centro (46,25 → 47,1 s, sfumando dentro); le due carte scoperte (9♥
 *   dietro, 7♠ davanti) entrano da destra e frenano accanto, sotto (46,5 → 48,05 s); 48,9–50,4 s la carta coperta si accende di
 *   luce e scende un poco, la coppia scende (la prossima carta sta per arrivare); camera ferma
 * misure: carta coperta 165 px (0,15 della larghezza), cima 899 → 454 (frena), poi 454 → 537 (48,9–50,4 s); coppia: bordo sinistro
 *   941 (46,55) → 692 (47,0) → 531 (47,38) → 460 (47,71) → 432 (48,05), cima 741 → 658; poi 658 → 782 (48,9–50,4 s, power2.inOut);
 *   carte scoperte ~195×275, la 7♠ (+98, −49) rispetto alla 9♥; titolo: riga 1 y 227 ~40 px, riga 2 corsivo y 298 ~84 px,
 *   riga 3 y 382 ~36 px
 * quando: un esempio concreto e visivo dal mondo dell'azzardo (la carta che verrà = la domanda che tiene incollati)
 * scena: t0, t1, X, Y (centro della camera, mondo), parent · opzioni: titolo ([r1, r2, r3]), tempiTitolo ([46,2, 46,35, 46,55])
 */
COPIA.r79_carte = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const W = (sx, sy) => [scena.X - 540 + sx, scena.Y - 880 + sy];
  const tt = o.titolo || ["Come funziona la", "Grande domanda", "al casinò"];
  const T = cpTitolo({ righe: [[{ t: tt[0], ruolo: "sans", size: 40, unita: true }], [{ t: tt[1], ruolo: "serif", size: 86, unita: true }], [{ t: tt[2], ruolo: "sans", size: 36, unita: true }]], x: 540, y: 205, parent: hud, interlinea: [52, 88] });
  T.inAt(o.tempiTitolo || [46.2, 46.35, 46.55]);
  T.outAt(scena.t1 - 0.06, { grigio: 0.02, dopo: 0.01, via: 0.02 });
  const cw = 165, ch = 232;
  // carta coperta: sale dal basso e frena (cima 899 → 454), poi si accende e scende (454 → 537)
  const [bx, by] = W(537, 454 + ch / 2);
  const dorso = cpCarta(L, bx, by, cw, ch, 0, "", { dorso: true, z: 12 });
  const luce = el(dorso.g, { position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: "inset 0 0 40px rgba(255,255,255,.55)", opacity: 0 });
  gsap.set(dorso.g, { y: 445, opacity: 0 });
  tl.to(dorso.g, { opacity: 1, duration: 0.25, ease: "power1.out" }, 46.2);
  tl.to(dorso.g, { y: 0, duration: 0.95, ease: cpBez(0.15, 0.6, 0.35, 1) }, 46.2);
  tl.to(dorso.g, { y: 83, scale: 1.04, boxShadow: "0 18px 40px rgba(0,0,0,.6), 0 0 40px rgba(255,255,255,.75), 0 0 110px rgba(207,251,80,.35)", duration: 1.5, ease: "power2.inOut" }, 48.9);
  tl.to(luce, { opacity: 1, duration: 1.2, ease: "power1.inOut" }, 49.0);
  // la coppia scoperta: entra da destra (bordo sinistro 1080 → 432) e frena, poi scende di 124 px
  const coppia = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 13 }));
  const [px0, py0] = W(432, 658);
  const c9 = cpCarta(coppia, 98, 275 / 2 + 49, 195, 275, 9, "♥", { z: 1 });
  const c7 = cpCarta(coppia, 98 + 98 + 98 / 2 - 49 + 0, 275 / 2, 195, 275, 7, "♠", { z: 2 });
  gsap.set(c9.g, { rotation: -3 }); gsap.set(c7.g, { rotation: 4 });
  gsap.set(coppia, { opacity: 0 });
  tl.set(coppia, { opacity: 1 }, 46.45);
  cpStrato(coppia, [[46.45, px0 + 700, py0 + 95], [46.55, px0 + 509, py0 + 83], [46.75, px0 + 400, py0 + 30], [47.0, px0 + 260, py0 + 5], [47.38, px0 + 99, py0], [47.71, px0 + 28, py0], [48.05, px0, py0], [48.9, px0, py0], [49.2, px0, py0 + 20], [49.55, px0, py0 + 78], [49.88, px0, py0 + 107], [50.22, px0, py0 + 119], [50.55, px0, py0 + 124], [50.93, px0, py0 + 124]]);
  return { rect: null, pose: null, ancore: {}, elementi: { dorso, coppia, T } };
};

/* @copia r79_storie · «Storie buone» e «Storie grandi»: un arco solo contro anelli a cascata (reel 79, 84,88–91,05 s)
 * kallaway: reel 79, 84,88–91,05 s · un riquadro sottile col titolo «Good Stories» (grigio 85,0 → bianco 85,35 s); dentro si disegna
 *   UN arco (la dipendenza che sale e scende una volta) da 85,35 a 87,45 s; sotto compare il secondo riquadro «Great Stories»
 *   (87,6 s) e dentro si disegnano archi a cascata, ognuno parte dalla cima del precedente (viola), 88,55–90,95 s; poi tutto sale e
 *   sfuma (90,9–91,05 s); camera ferma
 * misure: riquadro A x 255–825, y 308–650 (0,53 della larghezza), titolo y 282 ~44 px; arco da (272, 621) a (802, 621) con la cima a
 *   (540, 470), disegnato con la curva 85,67: 5% · 86,0: 20% · 86,17: 37% · 86,42: 59% · 86,67: 76% · 86,92: 89% · 87,17: 97%;
 *   riquadro B x 255–825, y 862–1205, titolo y 832; tre archi a cascata sempre più alti
 * quando: confronto fra due modi (normale contro migliore) con un grafico semplice per ciascuno
 * scena: t0, t1, X, Y (centro della camera, mondo), parent · opzioni: titoli (["Storie buone", "Storie grandi"])
 * colori: il suo bianco (storie buone) resta bianco, il suo viola (storie grandi) → lime
 */
COPIA.r79_storie = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const W = (sx, sy) => [scena.X - 540 + sx, scena.Y - 880 + sy];
  const g = layered(el(L, { position: "absolute", left: 0, top: 0, width: 1, height: 1, zIndex: 12 }));
  const tit = o.titoli || ["Storie buone", "Storie grandi"];
  const riquadro = (y0, h, titolo, tIn, tTit) => {
    const [x, y] = W(255, y0);
    const r = layered(el(g, { position: "absolute", left: x, top: y, width: 570, height: h, borderRadius: 6, border: "2.5px solid rgba(255,255,255,.85)", boxShadow: "0 0 14px rgba(255,255,255,.35), inset 0 0 22px rgba(255,255,255,.06)", background: "rgba(255,255,255,.015)" }));
    gsap.set(r, { opacity: 0 });
    tl.to(r, { opacity: 0.35, duration: 0.12 }, tIn);
    tl.to(r, { opacity: 1, duration: 0.3 }, tTit + 0.15);
    const T = cpTitolo({ righe: [[{ t: titolo.split(" ")[0] + " ", ruolo: "sans", size: 46 }, { t: titolo.split(" ").slice(1).join(" "), ruolo: "sans", size: 46, unita: true }]], x: x + 285, y: y - 50, parent: g, z: 13 });
    T.inAt([tTit, tTit + 0.33]);
    return r;
  };
  riquadro(308, 342, tit[0], 84.92, 85.0);
  riquadro(862, 343, tit[1], 87.58, 87.62);
  const S = svgLayer(g, 14, scena.X - 600, scena.Y - 700, 1200, 1400);
  const P = (x, y) => W(x, y).map((v) => v.toFixed(1)).join(" ");
  // l'arco unico (bianco), disegnato con la curva misurata
  const a = pathEl(S, `M${P(272, 621)} C${P(400, 420)} ${P(680, 420)} ${P(802, 621)}`, { fill: "none", stroke: "#ffffff", "stroke-width": 5, "stroke-linecap": "round" });
  a.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,.85)) drop-shadow(0 0 16px rgba(255,255,255,.35))";
  const La = drawable(a), fa = cpCurva([[85.35, 0], [85.67, 0.05], [86.0, 0.2], [86.17, 0.37], [86.42, 0.59], [86.67, 0.76], [86.92, 0.89], [87.17, 0.97], [87.45, 1]]);
  const st = { v: 0 };
  tl.fromTo(st, { v: 0 }, { v: 1, duration: 2.1, ease: "none", immediateRender: false, onUpdate: () => a.setAttribute("stroke-dashoffset", (La * (1 - fa(85.35 + st.v * 2.1))).toFixed(1)) }, 85.35);
  // gli archi a cascata (lime): ognuno parte dalla cima del precedente ed è più alto
  [[[285, 1180], [330, 1090], [400, 1090], [445, 1172], 88.55], [[365, 1118], [420, 1000], [520, 1000], [575, 1130], 89.35], [[470, 1050], [540, 880], [680, 880], [745, 1075], 90.1]].forEach(([p0, c1, c2, p1, t]) => {
    const c = pathEl(S, `M${P(...p0)} C${P(...c1)} ${P(...c2)} ${P(...p1)}`, { fill: "none", stroke: K.lime, "stroke-width": 5, "stroke-linecap": "round" });
    c.style.filter = "drop-shadow(0 0 6px rgba(207,251,80,.9)) drop-shadow(0 0 18px rgba(207,251,80,.4))";
    drawable(c);
    tl.to(c, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "power1.inOut" }, t);
  });
  // uscita: tutto sale e sfuma
  tl.to(g, { y: -60, opacity: 0, duration: 0.15, ease: "power1.in" }, scena.t1 - 0.15);
  return { rect: null, pose: null, ancore: {}, elementi: { g, S } };
};

/* @copia r79_riepilogo · Il ∞ coi quattro passi attorno e il titolo finale (reel 79, 91,05–96,68 s)
 * kallaway: reel 79, 91,05–96,68 s · su «This combination» il ∞ si disegna di nuovo, piccolo, al centro (91,3 → 92,3 s); sui nomi
 *   detti compaiono i 4 passi attorno ai lobi (Stakes 92,0 · Big Question 92,6 · Headfake 93,4 · Rehook 94,0, grigio → bianco);
 *   la camera si avvicina sempre di più (×1,36 fra 92,6 e 95,8 s, accelera); 95,5 s in alto «Super Addicting Story» con la linea
 *   d'accento sotto
 * misure: ∞ largo 462 px a 92,6 s (0,43 della larghezza), centro (539, 808) → 627 px centro (541, 762) a 95,8 s (zoom attorno a
 *   (540, 947)); etichette ~44 px a 95,8 s: Stakes (366, 575), Headfake (712, 575), Rehook (370, 962), Big Question (791, 1000);
 *   titolo y 237
 * quando: il riassunto finale: lo schema intero coi nomi dei passi
 * scena: t0, t1, X, Y (centro del ∞ nel mondo), parent · opzioni: nomi ([1, 2, 3, 4]), titolo ([neretto, corsivo])
 */
COPIA.r79_riepilogo = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const X = scena.X, Y = scena.Y, a = 212, b = 124, w = 36;
  const np = cpNeonK(neonPath(L, cpInfD(X, Y, a, b), { w, z: 10, molecole: true }));
  np.draw(91.3, 1.0, "power1.inOut");
  const nomi = o.nomi || ["Posta in gioco", "Grande\ndomanda", "Finta", "Riaggancio"];
  const pos = [[-129, -138], [184, 175], [126, -138], [-126, 147]];
  const tN = [[92.0, 92.3], [92.6, 92.9], [93.4, 93.7], [94.0, 94.3]];
  nomi.forEach((nm, i) => {
    const [dx, dy] = pos[i];
    const e = layered(el(L, { position: "absolute", left: X + dx - 250, top: Y + dy - (nm.includes("\n") ? 34 : 17), width: 500, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: 33, lineHeight: 1.05, letterSpacing: "-0.02em", color: GREY, textShadow: CP_GLOW_T, whiteSpace: "pre", zIndex: 15 }, nm));
    gsap.set(e, { opacity: 0, filter: "blur(7px)" });
    tl.to(e, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power2.out" }, tN[i][0]);
    tl.to(e, { color: K.white, duration: 0.2 }, tN[i][1]);
    tl.set(e, { filter: "none" }, tN[i][0] + 0.21);
  });
  // la camera della scena parte a scala 0,94 (taglio nella composizione): ×1,064 a 92,6 s = il ∞ largo 462 px come Kallaway
  cpCam.scala([[91.3, 1.0], [92.6, 1.064], [93.9, 1.19], [95.8, 1.444], [96.68, 1.574]], [540, 947]);
  const tt = o.titolo || ["Storia ad Alta ", "Dipendenza"];
  const T = cpTitolo({ righe: [[{ t: tt[0], ruolo: "sans", size: 64 }, { t: tt[1], ruolo: "serif", size: 80, unita: true }]], x: 540, y: 200, parent: hud, sottolinea: { riga: 0, y: 74, h: 5 } });
  T.inAt([95.5, 95.56, 95.6, 95.67]);
  T.sottolinea(95.75, null, null, 0.6, "power1.out");
  T.outAt(scena.t1 - 0.06, { grigio: 0.02, dopo: 0.01, via: 0.02 });
  return { rect: null, pose: null, ancore: { centro: [X, Y] }, elementi: { np, T } };
};

/* @copia r79_cta · «Commenta …»: la card del video completo, la camera ci entra fino al canale e torna fuori (reel 79, 100,06–107,6 s)
 * kallaway: reel 79, 100,06–107,6 s · titolo nell'HUD («Comment “storytelling” / to get video link», parola per parola 100,2 →
 *   101,5 s); sotto, la card del suo video YouTube: la miniatura animata (una strada viola a forma di ∞ che si disegna, con i
 *   segnaposto 1 · 2 · 3) e sotto la riga del canale (foto, nome, iscritti, Join, campanella); 102,17–102,5 s la camera si tuffa
 *   nella riga del canale (×4,5, scia), tiene; la miniatura scorre e mostra il segnaposto 2; 105,35–105,6 s torna fuori di colpo;
 *   la miniatura ora ha il titolo «4 STEP ADDICTION LOOP» e il 4; 107,27 s nella card parte il video di lui
 * misure: card x 95–995, miniatura y 537–1045 (0,83 della larghezza), riga del canale y ~1092; titolo righe y 395 e 467 (~52 px);
 *   tuffo ×4,5 attorno a (109, 1172); strada disegnata 100,25 → 101,55 s; segnaposto 1 · 2 · 3 a 100,4 · 101,1 · 101,45 s, 4 a 105,6 s
 * quando: la chiamata all'azione finale (commenta una parola, ricevi la risorsa)
 * scena: t0, t1, X, Y (centro della camera, mondo), parent · opzioni: titolo ([riga 1 neretto, parola corsiva, riga 2]),
 *   miniatura (["4 STEP", "LOOP DIPENDENZA"]), canale ({ nome, sotto }), video (id del pool del tuo video, alla fine)
 * opzione in coda (16/10, ritocco della regia): ritocco: true = come Kallaway in tre cose, rimisurate sul suo video:
 *   1) la miniatura si vede subito: pannello più chiaro del fondo come il suo (luminanza +22 sul fondo; lui +20…24), entra in
 *      0,17 s dal taglio con la sfocatura (lui: 10% al primo fotogramma, 65% a +0,12 s, 95% a +0,17 s), segnaposto 1 e strada
 *      già partiti al taglio;
 *   2) il «2» grande: segnaposto della sua misura (~112 px, lui 110–160) e, dentro lo zoom, a 104,78 s la miniatura taglia sul
 *      «2» in primo piano (~630 px sullo schermo) che si allontana in alto a destra fino all'uscita (105,35 s);
 *   3) la riga del canale nella sua misura: chip 57×38 e 70×37 px (lui Join 57×38, campanella 70×37 con la freccia), nome
 *      15 px; e il tuffo della camera è ×3,3 attorno a (81, 1198) (misurato sulla riga ferma: chip 57 → 186 px, nome → chip
 *      113 → 377 px), non ×4,5. Senza l'opzione il comportamento è quello di prima.
 */
COPIA.r79_cta = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(10);
  const W = (sx, sy) => [scena.X - 540 + sx, scena.Y - 880 + sy];
  const tt = o.titolo || ["Commenta ", "“storytelling”", "e ti mando il video"];
  const T = cpTitolo({ righe: [[{ t: tt[0], ruolo: "sans", size: 54 }, { t: tt[1], ruolo: "serif", size: 66, unita: true }], [{ t: tt[2], ruolo: "sans", size: 50 }]], x: 540, y: 362, parent: hud, interlinea: [70] });
  T.inAt([100.2, 100.35, 100.7, 100.9, 101.0, 101.2, 101.5]);
  // mentre la camera è dentro la card il titolo non c'è (Kallaway: sparisce col tuffo e torna con l'uscita)
  tl.to(T.root, { opacity: 0, duration: 0.08 }, 102.42);
  tl.to(T.root, { opacity: 1, duration: 0.12 }, 105.5);
  // la card: miniatura + riga del canale
  const [cx, cy] = W(95, 537);
  const card = layered(el(L, { position: "absolute", left: cx, top: cy, width: 900, height: 600, zIndex: 12 }));
  const RT = !!o.ritocco;
  if (RT) {
    gsap.set(card, { opacity: 0, filter: "blur(10px)" });
    tl.to(card, { opacity: 1, filter: "blur(0px)", duration: 0.17, ease: "none" }, scena.t0);
    tl.set(card, { filter: "none" }, scena.t0 + 0.18);
  } else {
    gsap.set(card, { opacity: 0 });
    tl.to(card, { opacity: 1, duration: 0.3, ease: "power1.out" }, scena.t0);
  }
  const mini = el(card, { position: "absolute", left: 0, top: 0, width: 900, height: 506, borderRadius: 18, overflow: "hidden", background: RT ? "radial-gradient(ellipse at 50% 45%, #424a28 0%, #31371d 55%, #292d19 100%)" : "radial-gradient(ellipse at 50% 45%, #2d2f26 0%, #1b1c18 70%)", boxShadow: RT ? "0 30px 70px rgba(0,0,0,.6), 0 0 46px rgba(207,251,80,.16), inset 0 0 0 1.5px rgba(255,255,255,.14)" : "0 30px 70px rgba(0,0,0,.6), 0 0 40px rgba(207,251,80,.10), inset 0 0 0 1.5px rgba(255,255,255,.10)" });
  const dentro = el(mini, { position: "absolute", left: 0, top: 0, width: 900, height: 506 });
  const S = svgLayer(dentro, 2, 0, 0, 900, 506);
  // la strada parte dal segnaposto 1 (estremo del lobo sinistro) come quella di Kallaway, poi il lobo destro e ritorno
  const rx = 445, ry = 330, ra = 380, rb = 118;
  const dR = `M${rx - ra} ${ry} C${rx - ra} ${ry + rb} ${rx - 0.35 * ra} ${ry + rb} ${rx} ${ry} C${rx + 0.35 * ra} ${ry - rb} ${rx + ra} ${ry - rb} ${rx + ra} ${ry} C${rx + ra} ${ry + rb} ${rx + 0.35 * ra} ${ry + rb} ${rx} ${ry} C${rx - 0.35 * ra} ${ry - rb} ${rx - ra} ${ry - rb} ${rx - ra} ${ry}`;
  const glowR = pathEl(S, dR, { fill: "none", stroke: K.lime, "stroke-width": 64, "stroke-linecap": "round", opacity: 0.55 });
  glowR.style.filter = "blur(14px)";
  const edge = pathEl(S, dR, { fill: "none", stroke: "#e9ffad", "stroke-width": 48, "stroke-linecap": "round", opacity: 0.35 });
  const road = pathEl(S, dR, { fill: "none", stroke: "#b9e23f", "stroke-width": 44, "stroke-linecap": "round" });
  const mid = pathEl(S, dR, { fill: "none", stroke: "#ffffff", "stroke-width": 3.5, "stroke-dasharray": "14 12", opacity: 0.9 });
  const LR = road.getTotalLength();
  const tStrada = RT ? scena.t0 : 100.25;
  [glowR, edge, road].forEach((p) => { drawable(p); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 101.55 - tStrada, ease: "power1.inOut" }, tStrada); });
  gsap.set(mid, { opacity: 0 }); tl.to(mid, { opacity: 0.9, duration: 0.8 }, 100.6);
  // i segnaposto stanno SULLA strada; entrano col pop misurato su Kallaway (pop.py: 0,57 → 0,82 → 0,98 → 1,01–1,03 → 1,00 in
  // 0,46 s: un filo di rimbalzo, il 2,5%: Kallaway vince su R5)
  const popS = cpCurva([[0, 0.57], [0.04, 0.82], [0.08, 0.98], [0.13, 1.01], [0.21, 1.02], [0.25, 1.03], [0.33, 1.01], [0.46, 1.0]]);
  // (ritocco) segnaposto della misura di Kallaway: riquadro 112×116, numero 84 px; il primo c'è già al taglio
  const MW = RT ? 112 : 68, MH = RT ? 116 : 70, MP = RT ? 23 : 90 - 70 + 0;
  const segna = [[0.0, RT ? scena.t0 : 100.3], [0.2, 101.1], [0.42, 101.45], [0.6, 105.6]].map(([f, t], i) => {
    const q = road.getPointAtLength(LR * f), x = q.x, y = q.y;
    const m = RT
      ? layered(el(dentro, { position: "absolute", left: x - MW / 2, top: y - MH - MP, width: MW, height: MH + MP + 7, zIndex: 5, transformOrigin: "50% 100%" }))
      : layered(el(dentro, { position: "absolute", left: x - 34, top: y - 90, width: 68, height: 96, zIndex: 5, transformOrigin: "50% 100%" }));
    el(m, { position: "absolute", left: 0, top: 0, width: MW, height: MH, borderRadius: RT ? 18 : 12, background: "linear-gradient(180deg, rgba(70,72,64,.92), rgba(36,37,33,.95))", border: "1.5px solid rgba(255,255,255,.35)", boxShadow: "0 10px 24px rgba(0,0,0,.5), 0 0 16px rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: RT ? 84 : 46, color: K.white, textShadow: CP_GLOW_T }, String(i + 1));
    if (RT) el(m, { position: "absolute", left: MW / 2 - 7, top: MH + MP - 7, width: 14, height: 14, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff" });
    else el(m, { position: "absolute", left: 28, top: 84, width: 12, height: 12, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff" });
    m._c = [x, y - MP - MH / 2];   // centro del riquadro (coordinate della miniatura)
    gsap.set(m, { opacity: 0, scale: 0.57 });
    const st = { v: 0 };
    tl.to(m, { opacity: 1, duration: 0.04 }, t);
    tl.fromTo(st, { v: 0 }, { v: 1, duration: 0.46, ease: "none", immediateRender: false, onUpdate: () => gsap.set(m, { scale: popS(st.v * 0.46) }) }, t);
    return m;
  });
  // il titolo della miniatura (compare quando la camera torna fuori)
  const mt = o.miniatura || ["4 STEP", "LOOP DIPENDENZA"];
  const tm = el(mini, { position: "absolute", left: 0, top: 36, width: 900, textAlign: "center", fontFamily: FD, fontWeight: 700, color: "#f6ffd9", textShadow: "0 0 18px rgba(207,251,80,.9), 0 0 50px rgba(207,251,80,.5)", lineHeight: 0.95, zIndex: 6 });
  el(tm, { fontSize: 40, letterSpacing: "0.04em" }, mt[0]);
  el(tm, { fontSize: 72, letterSpacing: "0.01em" }, mt[1]);
  gsap.set(tm, { opacity: 0 }); tl.to(tm, { opacity: 1, duration: 0.25 }, 105.55);
  [mini, ...mini.querySelectorAll("*")].forEach((e) => e.setAttribute("data-layout-allow-overlap", ""));   // miniatura: segnaposto e titolo sopra la strada
  // la miniatura scorre mentre la camera è dentro (mostra il segnaposto 2), poi torna
  if (RT) {
    // Kallaway: a 104,78 s la sua miniatura taglia sul «2» in primo piano (riquadro ~630 px sullo schermo, centro (550, 340)),
    // poi si allontana verso l'alto a destra (105,2 s: ~350 px, centro (975, 87)); con lo zoom ×3,3 attorno a (81, 1198) e la
    // card in (95, 537) sono il centro (128, 401) ×1,71 → (257, 324) ×0,95 nelle coordinate della miniatura
    const c2 = segna[1]._c, put = (cx2, cy2, s2) => ({ x: cx2 - s2 * c2[0], y: cy2 - s2 * c2[1], scale: s2 });
    gsap.set(dentro, { transformOrigin: "0 0" });
    tl.set(dentro, put(128, 401, 1.71), 104.78);
    tl.to(dentro, Object.assign(put(290, 300, 0.8), { duration: 0.6, ease: "power1.inOut" }), 104.78);
    tl.set(dentro, { x: 0, y: 0, scale: 1 }, 105.47);
  } else {
    tl.to(dentro, { x: -119, y: 206, duration: 0.75, ease: "power2.inOut" }, 104.6);
    tl.set(dentro, { x: 0, y: 0 }, 105.47);
  }
  // alla fine nella card parte il tuo video
  if (o.video !== false) {
    const v = mediaTile(mini, 0, 0, 900, 506, o.video || "cta_tu", 20);
    v.style.borderRadius = "0px";
    gsap.set(v, { opacity: 0 });
    tl.set(v, { opacity: 1 }, 107.27);
  }
  // la riga del canale: la tua foto, nome e handle, «Segui» e la campanella
  const can = o.canale || { nome: "Samuele Rinaldo", sotto: "@samuelerinaldo.media", riga2: "Il video completo · YouTube" };
  // (misure di Kallaway riportate dalla vista ingrandita: la riga è piccola, occupa x 37–230 e y 530–600 della card)
  const r = el(card, { position: "absolute", left: 0, top: 0, width: 900, height: 600, zIndex: 3 });
  if (RT) {
    // (ritocco) la riga nella misura di Kallaway (sua: foto x 120–157, nome x 167 cap 12 px, Join 57×38 e campanella 70×37 a
    // y 1057–1095, «171K views» x 133 y 1123): coordinate della card (in 95, 537)
    avatar(r, 43, 531, 37, "tu", { ring: "none", bw: 0, z: 2 });
    el(r, { position: "absolute", left: 72, top: 519, fontFamily: FS, fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", color: K.white, whiteSpace: "nowrap" }, can.nome);
    el(r, { position: "absolute", left: 72, top: 540, fontFamily: FS, fontWeight: 500, fontSize: 11.5, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }, can.sotto);
    el(r, { position: "absolute", left: 210, top: 520, width: 57, height: 38, borderRadius: 19, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 700, fontSize: 14, color: K.ink }, "Segui");
    const cmp = el(r, { position: "absolute", left: 273, top: 520, width: 70, height: 37, borderRadius: 18.5, background: limeFill(1), display: "flex", alignItems: "center", justifyContent: "center", gap: 6 });
    cmp.innerHTML = svg("bell", 19, K.ink, 2.3) + svg("chevron-down", 15, K.ink, 2.6);
    el(r, { position: "absolute", left: 38, top: 583, fontFamily: FS, fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,.72)", whiteSpace: "nowrap" }, can.riga2);
    COPIA.K06({ t0: 102.17, t1: 105.6 }, { k: 3.3, Q: [81, 1198], dur: 0.33, esce: [105.35, 0.25] });
    return { rect: null, pose: null, ancore: {}, elementi: { card, mini, T, segna } };
  }
  avatar(r, 51, 545, 28, "tu", { ring: "none", bw: 0, z: 2 });
  el(r, { position: "absolute", left: 70, top: 532, fontFamily: FS, fontWeight: 700, fontSize: 10.5, letterSpacing: "-0.01em", color: K.white, whiteSpace: "nowrap" }, can.nome);
  el(r, { position: "absolute", left: 70, top: 547, fontFamily: FS, fontWeight: 500, fontSize: 8.5, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }, can.sotto);
  el(r, { position: "absolute", left: 172, top: 534, width: 40, height: 22, borderRadius: 11, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontWeight: 700, fontSize: 9.5, color: K.ink }, "Segui");
  el(r, { position: "absolute", left: 218, top: 534, width: 28, height: 22, borderRadius: 11, background: limeFill(1), display: "flex", alignItems: "center", justifyContent: "center" }, svg("bell", 12, K.ink, 2.4));
  el(r, { position: "absolute", left: 32, top: 584, fontFamily: FS, fontWeight: 600, fontSize: 9, color: "rgba(255,255,255,.65)", whiteSpace: "nowrap" }, can.riga2);
  // la camera: tuffo nella riga del canale (×4,5 con la scia), tiene, torna fuori di colpo
  COPIA.K06({ t0: 102.17, t1: 105.6 }, { k: 4.5, Q: [109, 1172], dur: 0.33, esce: [105.35, 0.25] });
  return { rect: null, pose: null, ancore: {}, elementi: { card, mini, T, segna } };
};
