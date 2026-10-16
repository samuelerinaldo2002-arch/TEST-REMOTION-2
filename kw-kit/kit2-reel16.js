// ═══ KW kit v2 · reel 16/10 («Il trucco del reel di prova», sotto-agente della regia, 15/10) ═══════════════════════════════
// Solo funzioni piccole per le frasi senza un template adatto (PROMPT-REEL-14-16.md, Parte B). Stesso schema dei template:
// (scena, opzioni) → { rect, pose, ancore, elementi, tempi }, montaggio prima del taglio, un movimento principale al taglio,
// 2–3 accenti sulle parole, niente back.out.

// nascostoR16 · «E probabilmente non te ne sei nemmeno accorto.» La schermata vera «Nuovo reel» di Instagram col tuo reel: la
// riga «Reel di prova» è lì, spenta, e nessuno la guarda. Su «non» il resto della schermata si spegne, su «nemmeno» la lente la
// trova (la riga vera ingrandita), su «accorto» la riga si accende di bordo e compare la pill NUOVO (il regalo dell'hook).
// L'interruttore resta spento: lo accende il dito più avanti (TPL.U11).
//   parole: { spegni, lente, nuovo, titolo } · opzioni: media («th-mio_04»), titolo, ingresso ("arrivo" default | "zoom" |
//   "nessuno"), fermo, fermoDa, scala / alto (il telefono come U11: 0,435 / 365)
// suoni: whoosh .14 al taglio · drop .06 su «spegni» · whoosh .08 sulla lente · pop .1 su NUOVO
const nascostoR16 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const px = X - PH.w / 2, py = Y - PH.h / 2;
  const SH = igShare(L, px, py, o.media || "th-mio_04", { z: 12 });
  const S = SH.screen;
  // il velo che spegne il resto della schermata (la riga resta sopra)
  const velo = el(S, { position: "absolute", left: 0, top: 0, width: PH.sw, height: PH.sh, background: "rgba(8,8,8,.72)", zIndex: 4, opacity: 0 });
  velo.setAttribute("data-layout-allow-overlap", "");
  SH.row.style.zIndex = 5;
  // la pill NUOVO sopra la riga, a destra (fuori dalla lente)
  const [rx0, ry0, rx1] = SH.trialRect();
  const nw = 190, nh = 62;
  const nuovo = layered(el(L, { position: "absolute", left: rx1 - nw - 6, top: ry0 - nh - 14, width: nw, height: nh, borderRadius: nh / 2, background: limeFill(1), boxShadow: `0 10px 26px rgba(0,0,0,.5), ${GLOW_A(0.8)}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FS, fontWeight: 800, fontSize: 28, color: K.ink, whiteSpace: "nowrap", zIndex: 30 }, svg("sparkles", 26, K.ink, 2.4) + "NUOVO"));
  gsap.set(nuovo, { opacity: 0 });
  // 1) prima del taglio: la schermata c'è già (R2)
  gsap.set(SH.frame, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(SH.frame, { opacity: 1, duration: 0.2 }, t), () => gsap.set(SH.frame, { opacity: 1 }));
  // 2) accento 1 · «non»: il resto si spegne
  const ts = P.spegni == null ? t0 + 1.0 : P.spegni;
  tl.to(velo, { opacity: 1, duration: 0.25, ease: "power2.out" }, ts);
  // 3) accento 2 · «nemmeno»: la lente trova la riga «Reel di prova»
  const tz = P.lente == null ? ts + 0.5 : P.lente;
  const fx = 210, fy = 64; // punto della riga (sue coordinate): il nome «Reel di prova»
  const [lx, ly] = SH.at(16 + fx, 788 + fy);
  const LZ = lens(L, lx, ly, SH.row, { fx, fy, r: 150, k: 1.55, z: 28 });
  LZ.show(tz);
  // 4) accento 3 · «accorto»: la riga si accende di bordo (l'interruttore resta spento) e compare NUOVO
  const tn = P.nuovo == null ? tz + 0.4 : P.nuovo;
  tl.to(SH.row, { borderColor: "rgba(207,251,80,.85)", boxShadow: GLOW_A(0.35), duration: 0.2, ease: "power2.out" }, tn);
  popK(nuovo, tn, { da: 0.8, dur: 0.16 });
  // 5) la camera: arrivo che frena, poi ferma (telefono nella proporzione del reel 65, come U11)
  const rect = [px - 20, py - 20, px + PH.w + 20, py + PH.h + 20];
  const tt = tplTel("U11", o), posa = tt ? tplPosaTel(tt, X, py) : null;
  tplSfumaTel([SH.frame], tt);
  let pose = posa || fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", top: 380, posa });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { telefono: [X, Y], riga: [lx, ly], interruttore: SH.swXY() },
    elementi: { sh: SH, velo, lente: LZ, nuovo, titolo: T, L },
    tempi: { taglio: t0, spegni: ts, lente: tz, nuovo: tn },
  };
};
