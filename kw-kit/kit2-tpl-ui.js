// ═══ KW kit v2 · TEMPLATE · UI e prodotti (U) — blocco 1 del rifacimento col ritmo (RIFACIMENTO-RITMO.md) ═══════════════
// Stesso standard di kit2-template.js. Scene di prova in CATALOGO-ANIMAZIONI/ritmo-01 (KW_RITMO). Le schermate di Instagram
// restano quelle vere del vecchio stile (igProfile, igDrafts, igShare, lens, dito che preme): regola dell'utente.

// ── il telefono nella proporzione di Kallaway (correzioni della regia al blocco 1, 13/10) ──
// Misurato sui reel originali (larghezza / 1080): reel 3 (il profilo, U02) telefono 0,555 prima del colpo di zoom e 0,65
// dopo; reel 65 (la schermata ferma col puntatore, U10 U11 U07) schermo 0,415 (448 px), quindi il nostro telefono 0,435
// (schermo 534 su 560: 0,415). Prima i telefoni stavano interi nella banda: 0,376.
// Opzioni dei template (in coda): scala (larghezza del telefono / 1080; null = l'inquadratura di prima), alto (y dello schermo
// del bordo alto del telefono, sotto il titolo), sfuma (px dello schermo: il telefono sfuma prima di y 1290 quando intero non ci
// sta: si vede la parte dove succede l'azione, come il profilo del reel 3 che sparisce dietro la faccia). Il default nuovo vale
// SOLO con KW_RITMO; senza il marcatore e senza o.scala resta l'inquadratura di prima.
const TPL_TEL = {
  U02: { scala: 0.555, alto: 420, sfuma: 150 }, // reel 3: profilo, bio e prima riga della griglia; il colpo lo porta a 0,65
  U10: { scala: 0.435, alto: 365, sfuma: 0 },   // reel 65: intero, il bordo basso sfuma nella safe zone
  U11: { scala: 0.435, alto: 365, sfuma: 0 },
  U07: { scala: 0.435, alto: 365, sfuma: 0 },
};
const tplTel = (id, o) => {
  if (o.scala === null || (o.scala === undefined && !KW_RITMO)) return null;
  const d = TPL_TEL[id] || TPL_TEL.U10;
  return { scala: o.scala == null ? d.scala : o.scala, alto: o.alto == null ? d.alto : o.alto, sfuma: o.sfuma == null ? d.sfuma : o.sfuma };
};
// posa della camera: il punto del mondo wx (centro del telefono o del gruppo telefono + reel) va al centro dello schermo e il
// bordo alto del telefono (py) va a y = alto
const tplPosaTel = (tel, wx, py) => {
  const s = (tel.scala * 1080) / PH.w;
  return { fx: wx - (540 - ANCHOR.x) / s, fy: py - (tel.alto - ANCHOR.y) / s, s };
};
// sfumatura in fondo al telefono (maschera sul telaio, nelle sue coordinate): finisce trasparente dove lo schermo è a y 1290
const tplSfumaTel = (frames, tel) => {
  if (!tel || !tel.sfuma) return;
  const s = (tel.scala * 1080) / PH.w, yb = (1290 - tel.alto) / s, ya = yb - tel.sfuma / s;
  const m = "linear-gradient(to bottom, #000 0px, #000 " + ya.toFixed(1) + "px, rgba(0,0,0,0) " + yb.toFixed(1) + "px)";
  frames.forEach((f) => { f.style.webkitMaskImage = m; f.style.maskImage = m; });
};

/* @scheda U02 · Profilo Instagram con i numeri che salgono
 * quando: profilo, bio, griglia, crescita: "ti porterà più follower", "il profilo che porta clienti", "da 0 a 10K"; il
 *   profilo vero (il tuo, coi tuoi reel che si muovono nella griglia) come prova
 * frase: «…in un profilo perfettamente ottimizzato che, ti garantisco, ti porterà più follower.» (05/10, 4,3–9,2 s)
 * durata: 3–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1, X, Y (centro del telefono), parole: { evidenzia (riquadro lime su una parte, es. «ottimizzato»),
 *   conta (parte il conteggio, es. «porterà»; default il primo fotogramma come il reel 3), arriva (il numero arriva e la pill
 *   si accende, es. fine di «follower.»), titolo ([…]) }
 * opzioni: profilo ({ user, handle, nome, bio: [righe], post, follower, seguiti, grid: [id video], mio, ring } = igProfile),
 *   conta ({ campo: "follower", da, a, fmt }), evidenzia ("bio" | "header" | "griglia" | null), titolo, ingresso ("arrivo"
 *   default: di lato, dx 175 | "spinta" (R4, senza colpo) | "nessuno"), colpo (zoom sul numero quando conta, 0.18; false =
 *   niente), fermo (R7, default true), scala / alto / sfuma (il telefono: larghezza / 1080, y del bordo alto, sfumatura in
 *   fondo; con KW_RITMO 0,555 / 420 / 150 come il reel 3, null = l'inquadratura di prima col telefono intero)
 * restituisce: rect, pose, ancore { telefono, numero (centro del numero che conta), foto }, elementi { tel, L },
 *   tempi { taglio, evidenzia, conta, arriva }
 * suoni: whoosh .14 al taglio · tick .05 su «evidenzia» · rise .06 sul conteggio · ding .1 all'arrivo
 * regole: R2 il telefono è già pieno al taglio · camera misurata sul reel 3 (deriva.py, telefono giallo nella verifica):
 *   arrivo di lato −175 px che frena in ~0,5 s, poi ferma; quando il numero arriva un colpo di zoom +18% in ~0,8 s
 *   (power2.out) col numero fermo sullo schermo → qui: arrivo dx 175 expo.out 0,6 s, colpo +18% power2.out 0,8 s sul
 *   conteggio · R6 conteggio continuo, lineare (reel 3: 2K → 100K in ~1,2 s, la pill si accende all'arrivo) · R3 un accento
 *   oltre al conteggio · R5 niente rimbalzi (la pill entra con power2.out, non back.out)
 * prima: (reel-01 v5 19,4–25 s, demo 33,7 s) il profilo entrava sfocato di lato (blurIn 0,6 s), i numeri contavano con
 *   power1.out e la pill entrava con back.out(2,6); la camera faceva float
 * chiamata:
 *   TPL.U02({ t0: 13.75, t1: 19.15, X: 8000, Y: 900, parole: { evidenzia: 15.6, conta: 17.8, arriva: 18.74,
 *     titolo: [14.1, 14.2, 15.6, 17.8, 18.2, 18.34] } }, {
 *     titolo: [[{ t: "Un profilo " }, { t: "ottimizzato", box: true }], [{ t: "porta più follower", hand: true }]],
 *     profilo: { user: "tu", handle: "samuelerinaldo.media", nome: "Samuele Rinaldo | Content creator", mio: true, ring: "lime",
 *       bio: ["Video · Foto · Content Creation", "Meno contenuti casuali. Più risultati."], post: "25", follower: "245",
 *       seguiti: "…", blurStats: true, chiaro: "follower", grid: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"] },
 *     conta: { campo: "follower", da: 245, a: 1000 }, evidenzia: "bio" });
 */
TPL.U02 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const px = X - PH.w / 2, py = Y - PH.h / 2;
  const tel = igProfile(L, px, py, Object.assign({ z: 12 }, o.profilo || {}));
  const C = o.conta || null;
  // 1) il telefono è già lì, pieno (igProfile è statico: niente da montare); il numero parte dal valore iniziale
  if (C && C.da != null) tel.stat[C.campo || "follower"].num.textContent = (C.fmt || itNum)(C.da);
  // 2) accento: riquadro lime sulla parte detta
  const te = P.evidenzia == null ? t0 + 1.2 : P.evidenzia;
  if (o.evidenzia) tel.hl(te, o.evidenzia, { bw: 5 });
  // 3) il conteggio: uno solo, lineare (R6), poi la pill si accende sul numero arrivato e il numero brilla
  const tc = P.conta == null ? t0 + 0.05 : P.conta;
  const ta = P.arriva == null ? tc + 1.2 : P.arriva;
  const dC = Math.max(0.5, ta - tc);
  if (C) {
    const k = C.campo || "follower", s = tel.stat[k];
    tel.count(tc, k, C.da, C.a, dC, C.fmt, "none");
    tl.to(s.pill, { opacity: 1, duration: 0.15 }, ta);
    tl.fromTo(s.pill, { scale: 0.8 }, { scale: 1, duration: 0.18, ease: "power2.out", immediateRender: false }, ta);
    tl.to([s.num, s.lb], { color: K.ink, duration: 0.15 }, ta);
    glowFlash(s.num, ta, { base: "none", peak: "0 0 14px rgba(255,255,255,.9)" });
  }
  // 4) la camera (misurata sul reel 3): arrivo di lato al taglio (−175 px, frena), poi ferma; sul conteggio un colpo di zoom
  //    (+18% in 0,8 s power2.out) col numero fermo sullo schermo: la seconda cosa detta è il risultato (R3)
  const [nx, ny] = tel.at(252 + ["post", "follower", "seguiti"].indexOf((C && C.campo) || "follower") * 104, 190);
  const rect = [px - 20, py - 20, px + PH.w + 20, py + PH.h + 20];
  // il telefono nella proporzione del reel 3 (KW_RITMO): 0,555 della larghezza, sotto il titolo; il fondo sfuma (si vedono
  // numeri, bio, bottoni e la prima riga della griglia); col colpo arriva a 0,65 come Kallaway
  const tt = tplTel("U02", o), posa = tt ? tplPosaTel(tt, X, py) : null;
  tplSfumaTel([tel.frame], tt);
  let pose = posa || fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso === "spinta") pose = apertura(t0, t1, rect, { modo: "spinta", top: 380, posa, spinta: Object.assign({ dx: 0, dy: -46, ds: 0.09, dur: 2.4, dyCoda: -6, dsCoda: 0.01 }, o.spinta || {}) });
  else if (o.ingresso !== "nessuno") {
    pose = apertura(t0, t1, rect, { modo: "arrivo", dx: o.dx == null ? 175 : o.dx, dy: 0, dur: 0.6, top: 380, posa });
    if (C && o.colpo !== false) {
      const k = 1 + (o.colpo || 0.18), dz = 0.8, s0 = CAM.s;
      camK(tc, dz, nx - (nx - CAM.fx) / k, ny - (ny - CAM.fy) / k, s0 * k, "power2.out");
      if (t1 - tc - dz > 0.3) camK(tc + dz, t1 - tc - dz, CAM.fx, CAM.fy, CAM.s * 1.008, "sine.out");
    }
  }
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { telefono: [X, Y], numero: [nx, ny], foto: tel.at(98, 212) },
    elementi: { tel, titolo: T, L },
    tempi: { taglio: t0, evidenzia: te, conta: tc, arriva: ta },
  };
};

/* @scheda U03 · Cursore che clicca (un sito o un'app sul computer: carica → scegli)
 * quando: tutorial su un sito o un'app desktop ("vai su pfpmaker.com, carica una foto, scegli lo sfondo", "clicca su…",
 *   impostazioni dal computer): il puntatore entra, va sul bottone, clicca e il bottone cambia stato. Per le schermate del
 *   telefono si usa il dito (U07)
 * frase: «Per farne una, vai sul sito pfpmaker.com, carica una foto che ti faccia sembrare meglio di quello che sei e poi
 *   seleziona il tuo sfondo colorato.» (05/10, 47,3–54,8 s)
 * durata: 3–8 s (oltre 6 s con la seconda inquadratura)
 * scena: t0 (taglio), t1, X, Y (centro della finestra), parole: { url (l'indirizzo si scrive), clic1 (primo clic: «carica»),
 *   clic2 (secondo clic: «sfondo»), seconda (seconda inquadratura, stretta su foto e scelte), titolo ([…]) }
 * opzioni: url ("pfpmaker.com"), bottone (testo del primo bottone, "Carica una foto"), icona ("upload"), prima (id
 *   dell'immagine caricata: «img-…»/«av-…»), dopo (id del risultato), colori (sfondi tra cui scegliere, il primo è quello
 *   scelto), titolo, ingresso ("fermo" default: la camera sta ferma come nei reel 65 e 133 | "zoom" | "arrivo" | "nessuno"),
 *   seconda (false = niente seconda inquadratura), fermo (R7)
 * restituisce: rect, pose, ancore { foto, bottone, scelta }, elementi { win, foto, cur, L }, tempi { taglio, clic1, clic2 }
 * suoni: whoosh .14 al taglio · click .2 sull'indirizzo e su ogni clic · key .06 mentre si scrive · pop .1 sul risultato
 * regole: R2 la finestra è già piena al taglio · misurato (deriva.py) sui reel 65 e 133: la camera è FERMA (0–9 px), il
 *   movimento principale è il cursore che entra subito e frena (reel 133: metà strada in 0,12 s, ~0,75 s in tutto, ~430 px)
 *   → qui il cursore parte al taglio verso la barra dell'indirizzo (0,6 s power2.out), poi va sul bottone; clic = bottone che
 *   cambia stato · R3 un secondo inquadramento solo per la seconda cosa detta (la scelta dello sfondo), con la barra che si
 *   spegne per non passare sotto il titolo · R5 niente back.out
 * prima: (demo-2 17,2 s) cursor().moveTo con power3.inOut 0,45 s e click con back.out(3)
 * chiamata:
 *   TPL.U03({ t0: 19.15, t1: 26.95, X: 11000, Y: 900, parole: { url: 20.64, clic1: 22.34, seconda: 25.4, clic2: 26.0,
 *     titolo: [20.1, 20.25, 20.64, 25.4, 25.94, 26.0, 26.34] } }, {
 *     titolo: [[{ t: "Foto profilo " }, { t: "in 2 clic", box: true }]], url: "pfpmaker.com",
 *     prima: "img-tu-prima", dopo: "av-tu", colori: ["#CFFB50", "#6fc8ff", "#ff8fb1", "#ffb35c", "#b18cff"] });
 */
TPL.U03 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const W = o.w || 860, H = 860, x0 = X - W / 2, y0 = Y - H / 2;
  // la finestra del browser (scura, nello stile delle card): barra con i tre punti e l'indirizzo, poi la pagina
  const win = layered(el(L, { position: "absolute", left: x0, top: y0, width: W, height: H, borderRadius: 30, overflow: "hidden", background: "linear-gradient(180deg,#2c2c2e,#1d1d1f)", border: "1.5px solid rgba(255,255,255,.18)", boxShadow: "0 40px 100px rgba(0,0,0,.65), inset 0 1.5px 0 rgba(255,255,255,.1)", zIndex: 12 }));
  const bar = el(win, { position: "absolute", left: 0, top: 0, width: W, height: 78, background: "#3a3a3c", borderBottom: "1px solid rgba(255,255,255,.1)" });
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => el(bar, { position: "absolute", left: 28 + i * 32, top: 29, width: 20, height: 20, borderRadius: "50%", background: c }));
  const urlBox = el(bar, { position: "absolute", left: 150, top: 16, width: W - 300, height: 46, borderRadius: 23, background: "#1f1f21", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", fontFamily: FS, fontWeight: 600, fontSize: 24, color: "rgba(255,255,255,.9)", whiteSpace: "nowrap" }, svg("lock", 20, "rgba(255,255,255,.55)", 2.2));
  const urlTx = el(urlBox, { whiteSpace: "pre" }, "", "span");
  // la foto: prima un riquadro vuoto da riempire, poi la foto caricata, poi il risultato
  const F = 420, fx = X - F / 2, fy = y0 + 118;
  const frame = el(win, { position: "absolute", left: (W - F) / 2, top: 118, width: F, height: F, borderRadius: 26, overflow: "hidden", background: "#151517", border: "3px dashed rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center" }, svg("image-plus", 90, "rgba(255,255,255,.3)", 1.6));
  const fPrima = el(frame, { position: "absolute", left: 0, top: 0, width: F, height: F, opacity: 0 });
  if (o.prima) imgIn(fPrima, o.prima, { objectFit: "cover" });
  const fDopo = el(frame, { position: "absolute", left: 0, top: 0, width: F, height: F, opacity: 0 });
  if (o.dopo) imgIn(fDopo, o.dopo, { objectFit: "cover" });
  // il bottone (cambia stato al clic: diventa lime con la spunta)
  const bw = 440, bh = 92, by = 118 + F + 40;
  const btn = el(win, { position: "absolute", left: (W - bw) / 2, top: by, width: bw, height: bh, borderRadius: 22, background: K.ig, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FS, fontWeight: 800, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }, svg(o.icona || "upload", 32, "#fff", 2.4) + (o.bottone || "Carica una foto"));
  const btnOn = el(btn, { position: "absolute", inset: 0, borderRadius: 22, background: limeFill(1), display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FS, fontWeight: 800, fontSize: 32, color: K.ink, opacity: 0, whiteSpace: "nowrap" }, svg("check", 34, K.ink, 3) + "Caricata");
  // gli sfondi fra cui scegliere (il primo è quello scelto)
  const cols = o.colori || ["#CFFB50", "#6fc8ff", "#ff8fb1", "#ffb35c", "#b18cff"], sw = 76, sg = 26;
  const sy = by + bh + 62, sx0 = (W - (cols.length * sw + (cols.length - 1) * sg)) / 2;
  el(win, { position: "absolute", left: 0, top: sy - 38, width: W, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,.55)" }, "Sfondo");
  const sws = cols.map((c, i) => el(win, { position: "absolute", left: sx0 + i * (sw + sg), top: sy, width: sw, height: sw, borderRadius: "50%", background: c, border: "4px solid rgba(255,255,255,0)", boxShadow: "0 8px 20px rgba(0,0,0,.45)" }));
  // il cursore (U03): entra dal basso a destra prima del primo clic
  const cur = cursor(L, x0 + W * 0.6, y0 + 230, { size: 70, z: 40 });
  const btnXY = [X + 60, y0 + by + bh / 2 + 6], swXY = [x0 + sx0 + sw / 2 + 4, y0 + sy + sw / 2 + 4];
  // 1) prima del taglio: la finestra c'è (statica); niente da montare
  // 2) il movimento principale (reel 65 e 133: la camera è ferma, si muove il cursore): al taglio il cursore entra dal basso a
  //    destra e frena sulla barra dell'indirizzo (0,6 s power2.out: metà strada in 0,12 s come il reel 133); clic e l'indirizzo
  //    si scrive sulla parola (es. «pfpmaker»)
  const tu = P.url == null ? t0 + 0.8 : P.url;
  const urlXY = [x0 + 150 + 60, y0 + 39 + 6];
  cur.show(t0 + 0.02);
  cur.moveTo(t0 + 0.05, urlXY[0], urlXY[1], 0.6, "power2.out");
  cur.click(Math.max(t0 + 0.75, tu - 0.12));
  typeText(urlTx, o.url || "pfpmaker.com", tu, 0.4);
  // 3) primo clic (es. «carica»): il cursore frena sul bottone, clic, il bottone cambia stato, compare la foto
  const c1 = P.clic1 == null ? t0 + 1.8 : P.clic1;
  cur.moveTo(Math.max(tu + 0.5, c1 - 0.72), btnXY[0], btnXY[1], 0.6, "power2.out");
  cur.click(c1);
  tl.to(btnOn, { opacity: 1, duration: 0.12 }, c1 + 0.04);
  tl.set(btn, { color: K.ink }, c1 + 0.16); // il testo di prima resta sotto lo stato nuovo: scuro, per il controllo del contrasto
  tl.fromTo(fPrima, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out", immediateRender: false }, c1 + 0.12);
  tl.to(frame, { borderColor: "rgba(255,255,255,0)", duration: 0.2 }, c1 + 0.12);
  // 4) seconda inquadratura (la seconda cosa detta): stretta su foto e sfondi; poi il secondo clic sul colore scelto
  const c2 = P.clic2 == null ? c1 + 1.6 : P.clic2;
  const t2 = P.seconda == null ? c2 - 0.6 : P.seconda;
  cur.moveTo(Math.max(c1 + 0.3, c2 - 0.55), swXY[0], swXY[1], 0.5, "power2.out");
  cur.click(c2);
  tl.to(sws[0], { borderColor: "#ffffff", boxShadow: `${GLOW_A(0.8)}, 0 8px 20px rgba(0,0,0,.45)`, duration: 0.12 }, c2 + 0.04);
  tl.to(fDopo, { opacity: 1, duration: 0.18, ease: "power2.out" }, c2 + 0.08);
  tl.to(frame, { boxShadow: `${GLOW_A(0.7)}`, borderColor: "rgba(207,251,80,.9)", duration: 0.25 }, c2 + 0.08);
  pulse(L, X, fy + F / 2, c2 + 0.08, { r: F * 0.62, z: 11 });
  cur.hide(Math.min(t1 - 0.3, c2 + 0.6));
  // 5) la camera: la finestra si avvicina al taglio (zoom, reel 65), tiene; la seconda inquadratura stringe su foto e sfondi
  const rect = [x0 - 20, y0 - 20, x0 + W + 20, y0 + H + 20];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") {
    pose = apertura(t0, t1, rect, { modo: o.ingresso || "fermo", top: 380, ds: 0.15, dur: 0.45 });
    if (o.seconda !== false) {
      const r2 = [X - F / 2 - 120, fy - 30, X + F / 2 + 120, y0 + sy + sw + 40];
      const p2 = fitPose(r2[0], r2[1], r2[2], r2[3], { top: 430 });
      camK(t2, 0.6, p2.fx, p2.fy, p2.s, "power2.out");
      if (t1 - t2 - 0.6 > 0.3) camK(t2 + 0.6, t1 - t2 - 0.6, CAM.fx, CAM.fy, CAM.s * 1.01, "sine.out");
      // inquadratura stretta: la barra dell'indirizzo resta sopra la banda utile e passerebbe sotto il titolo → si spegne
      tl.to(bar, { opacity: 0, duration: 0.3, ease: "power2.out" }, t2);
    }
  }
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { foto: [X, fy + F / 2], bottone: btnXY, scelta: swXY },
    elementi: { win, foto: frame, cur, titolo: T, L },
    tempi: { taglio: t0, clic1: c1, clic2: c2 },
  };
};

/* @scheda U10 · Bozze di Instagram: tre puntini → Duplica (con la lente e il dito che preme)
 * quando: tutorial su bozze, duplicare un contenuto, reel di prova ("apri le bozze, tocca i tre puntini e duplicalo"); la
 *   schermata vera delle Bozze col tuo reel, il dito che preme (regola dell'utente: il dito è importante)
 * frase: «Apri le bozze, tocca i tre puntini accanto al video e duplicalo.» (03/10, 10,6–14,6 s)
 * durata: 3–5 s (consigliata 4)
 * scena: t0 (taglio), t1, X, Y (centro del telefono), parole: { tocca (il dito entra), puntini (tocca i ⋯: sale il foglio),
 *   lente (la lente ingrandisce «Duplica»), duplica (il dito preme Duplica: la bozza si sdoppia), titolo ([…]) }
 * opzioni: media (id della tua copertina o del tuo reel: «th-mio_04»), altre ([id]: le altre tue bozze in griglia, così lo
 *   schermo è pieno; la copia nasce accanto e le altre scivolano), titolo, ingresso ("zoom" default, +15% in 0,4 s |
 *   "arrivo" | "nessuno" = la camera la muove la composizione, es. lo zoom-through R8), fermo (R7, default true), fermoDa,
 *   scala / alto / sfuma (il telefono: con KW_RITMO 0,435 / 365 / 0 come lo schermo del reel 65; null = come prima)
 * restituisce: rect, pose, ancore { telefono, puntini, duplica, bozza(i) }, elementi { dr, dito, lente, L }, tempi { taglio,
 *   puntini, duplica, copia }
 * suoni: whoosh .14 al taglio · tap .2 sui ⋯ · card .1 sul foglio · tap .2 su Duplica · pop .12 sulla copia
 * regole: R2 la schermata delle Bozze è già piena al taglio (il tuo reel nella bozza) · camera ferma dopo l'ingresso (reel 65
 *   di Kallaway: lo schermo resta fermo, si muove il cursore; qui il dito) · tre accenti sulle parole: foglio, lente, copia ·
 *   R5 niente rimbalzi (foglio expo.out, lente power3.out; i back.out del kit con KW_RITMO diventano power2.out)
 * prima: (reel-03 10,5–14,6 s) whip sul telefono, poi la camera scendeva sul foglio e risaliva sulla copia (tre movimenti di
 *   camera in 4 s) e float continui
 * chiamata:
 *   TPL.U10({ t0: 38.0, t1: 42.35, X: 20000, Y: 900, parole: { tocca: 39.32, puntini: 39.68, lente: 40.1, duplica: 41.15,
 *     titolo: [38.15, 38.55, 38.68, 39.32, 39.58, 39.68] } }, {
 *     titolo: [[{ t: "Apri le " }, { t: "bozze", box: true }], [{ t: "tocca i 3 puntini", hand: true }]], media: "th-mio_04" });
 */
TPL.U10 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const px = X - PH.w / 2, py = Y - PH.h / 2;
  const media = o.media || "th-mio_04";
  const DR = igDrafts(L, px, py, [media].concat(o.altre || []), { z: 12 });
  const F = tapFinger(L, { size: 92 });
  // 1) prima del taglio: la schermata delle Bozze c'è già (statica)
  // 2) il dito entra e tocca i ⋯ della tua bozza: sale il foglio Modifica / Duplica / Elimina
  const tp = P.puntini == null ? t0 + 1.2 : P.puntini;
  const tf = P.tocca == null ? tp - 0.4 : Math.min(P.tocca, tp - 0.3);
  const [ddx, ddy] = DR.dots(0);
  F.show(tf, ddx + 70, ddy + 250);
  F.to(tf + 0.06, ddx, ddy, Math.max(0.2, tp - tf - 0.12));
  F.tap(tp);
  tl.to(DR.tiles[0].dt, { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 }, tp - 0.02);
  DR.menu(tp + 0.1);
  // 3) la lente ingrandisce «Duplica» (vecchio stile, la riga vera dentro la lente)
  const td = P.duplica == null ? tp + 1.4 : P.duplica;
  const tz = P.lente == null ? tp + 0.5 : P.lente;
  const rl = DR.rowLabel(1);
  const LZ = lens(L, rl.x, rl.y, DR.rowEl(1), { fx: rl.fx, fy: rl.fy, r: 140, k: 1.5 });
  LZ.show(tz);
  LZ.hide(td - 0.3);
  // 4) il dito preme Duplica: la riga si accende, il foglio scende, la bozza si sdoppia (numeri 1 e 2)
  const [dpx, dpy] = DR.row(1);
  F.to(td - 0.42, dpx - 120, dpy, 0.34);
  F.tap(td);
  DR.pick(1, td);
  DR.closeMenu(td + 0.3);
  F.hide(td + 0.35);
  const tc = td + 0.45;
  DR.duplicate(tc, media, !!(o.altre && o.altre.length));
  // 5) la camera: ingresso (zoom che frena) e poi ferma sul telefono intero (KW_RITMO: nella proporzione del reel 65)
  const rect = [px - 20, py - 20, px + PH.w + 20, py + PH.h + 20];
  const tt = tplTel("U10", o), posa = tt ? tplPosaTel(tt, X, py) : null;
  tplSfumaTel([DR.frame], tt);
  let pose = posa || fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "zoom", top: 380, ds: 0.15, dur: 0.4, posa });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { telefono: [X, Y], puntini: [ddx, ddy], duplica: [dpx, dpy], bozza: (i) => DR.tileXY(i) },
    elementi: { dr: DR, dito: F, lente: LZ, titolo: T, L },
    tempi: { taglio: t0, puntini: tp, duplica: td, copia: tc },
  };
};

// card del reel che esce dal telefono dopo Condividi (U11, U07): la tua copertina, centrata su (cx, cy) col transform
const tplReelCard = (L, cx, cy, w, h, media, z) => {
  const wrap = layered(el(L, { position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, zIndex: z || 40 }));
  gsap.set(wrap, { x: cx, y: cy, opacity: 0 });
  const body = el(wrap, { position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: Math.round(w * 0.08), border: "2.5px solid rgba(255,255,255,.3)", boxShadow: `0 ${Math.round(w * 0.12)}px ${Math.round(w * 0.3)}px rgba(0,0,0,.6)`, overflow: "hidden", background: "#111" });
  mediaTile(body, 0, 0, w, h, media, 1);
  return wrap;
};
// etichetta del reel pubblicato: PROVA (lime, provetta) o NORMALE (bianca, aereo di carta)
const tplTagReel = (L, cx, cy, prova, z) => el(L, { position: "absolute", left: cx - 125, top: cy - 31, width: 250, height: 62, borderRadius: 31, background: prova ? limeFill(1) : "linear-gradient(180deg,#f4f4f2,#d9d9d4)", boxShadow: prova ? `0 10px 26px rgba(0,0,0,.5), ${GLOW_A(0.8)}` : "0 10px 26px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FS, fontWeight: 800, fontSize: 28, color: K.ink, zIndex: z || 41, whiteSpace: "nowrap" }, svg(prova ? "flask-conical" : "send", 27, K.ink, 2.4) + (prova ? "PROVA" : "NORMALE"));

/* @scheda U11 · Nuovo reel: l'interruttore «Reel di prova» e Condividi (il reel esce con l'etichetta)
 * quando: pubblicare come prova o come normale, qualsiasi passaggio di pubblicazione ("pubblicala come reel di prova");
 *   la schermata vera «Nuovo reel» col tuo reel, il dito che accende l'interruttore e preme Condividi
 * frase: «Ora prendi la prima bozza e pubblicala come reel di prova.» (03/10, 14,9–18,3 s)
 * durata: 3–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio), t1, X, Y (centro del telefono), parole: { interruttore (il dito accende «Reel di prova», es. «reel»),
 *   condividi (preme Condividi, es. «prova.»: il reel esce con l'etichetta), titolo ([…]) }
 * opzioni: media (la tua copertina: «th-mio_04»), numero (badge sulla copertina: 1 = la prima copia), prova (true: accende
 *   l'interruttore e l'etichetta è PROVA; false = reel normale, U07), titolo, ingresso ("arrivo" default, di lato | "zoom" |
 *   "nessuno"), fermo (R7, default true), scala / alto / sfuma (il telefono: con KW_RITMO 0,435 / 365 / 0 come lo schermo
 *   del reel 65; null = come prima)
 * restituisce: rect, pose, ancore { telefono, interruttore, condividi, reel (dove atterra il reel pubblicato) }, elementi
 *   { sh, dito, reel, tag, L }, tempi { taglio, interruttore, condividi, uscita }
 * suoni: whoosh .14 al taglio · tap .2 + toggle .14 sull'interruttore · tap .2 su Condividi · whoosh .12 + pop .12 all'uscita
 * regole: R2 la schermata è già piena al taglio, di lato c'è il posto dove atterra il reel pubblicato · arrivo di lato che
 *   frena (175 px expo.out) e poi camera ferma (come lo schermo del reel 65) · accenti sulle parole: interruttore, Condividi
 *   + il reel che esce (0,55 s power3.out, frena) con l'etichetta · R5 niente back.out
 * prima: (reel-03 16–18,6 s) whip sulla metà bassa del telefono, float, poi move della camera per seguire il reel che esce
 *   (power3.inOut) e il tag con pop back.out(2,2)
 * chiamata:
 *   TPL.U11({ t0: 42.35, t1: 46.15, X: 23000, Y: 900, parole: { interruttore: 44.92, condividi: 45.58,
 *     titolo: [42.48, 43.28, 43.42, 44.92, 45.38, 45.58] } }, {
 *     titolo: [[{ t: "La prima " }, { t: "bozza", box: true }], [{ t: "come reel di prova", hand: true }]], media: "th-mio_04", numero: 1 });
 */
TPL.U11 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const prova = o.prova !== false, media = o.media || "th-mio_04";
  const px = X - 170 - PH.w / 2, py = Y - PH.h / 2; // il telefono a sinistra, a destra il posto del reel pubblicato
  const SH = igShare(L, px, py, media, { z: 12 });
  if (o.numero) el(SH.thumb, { position: "absolute", left: 12, top: 12, width: 50, height: 50, borderRadius: "50%", background: limeFill(1), color: K.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 28, boxShadow: `0 6px 16px rgba(0,0,0,.45), ${GLOW_A(0.5)}`, zIndex: 5 }, String(o.numero));
  const F = tapFinger(L, { size: 92 });
  // 1) il dito entra e accende «Reel di prova» (se prova)
  const ts = P.condividi == null ? t0 + 2.4 : P.condividi;
  const ti = P.interruttore == null ? ts - 0.7 : P.interruttore;
  const [swx, swy] = SH.swXY(), [shx, shy] = SH.share();
  if (prova) {
    F.show(ti - 0.42, swx + 230, swy + 30);
    F.to(ti - 0.34, swx, swy, 0.3);
    F.tap(ti);
    SH.trial(ti + 0.02);
    F.to(ti + 0.12, shx, shy, Math.max(0.25, ts - ti - 0.2));
  } else {
    F.show(ts - 0.6, shx + 60, shy + 230);
    F.to(ts - 0.5, shx, shy, 0.34);
  }
  // 2) il dito preme Condividi: il reel esce dal telefono e atterra a destra con la sua etichetta
  F.tap(ts);
  SH.press("share", ts);
  F.hide(ts + 0.3);
  const lx = X + 300, ly = Y + 120, cw = 230, ch = Math.round((cw * 16) / 9);
  const reel = tplReelCard(L, shx, shy, cw, ch, media, 40);
  gsap.set(reel, { scale: 0.4 });
  tl.set(reel, { opacity: 1 }, ts + 0.05);
  tl.to(reel, { x: lx, y: ly, rotation: prova ? 6 : -6, scale: 1, duration: 0.55, ease: "power3.out" }, ts + 0.05);
  const tag = tplTagReel(L, lx, ly + ch / 2 + 50, prova, 41);
  popK(tag, ts + 0.45, { da: 0.8, dur: 0.18 });
  // 3) la camera: arrivo di lato che frena, poi ferma (telefono + posto d'atterraggio; KW_RITMO: telefono come il reel 65)
  const rect = [px - 20, py - 20, lx + cw / 2 + 60, py + PH.h + 20];
  const tt = tplTel("U11", o), posa = tt ? tplPosaTel(tt, (rect[0] + rect[2]) / 2, py) : null;
  tplSfumaTel([SH.frame], tt);
  let pose = posa || fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", dx: 175, dy: 0, dur: 0.6, top: 380, posa });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { telefono: [px + PH.w / 2, Y], interruttore: [swx, swy], condividi: [shx, shy], reel: [lx, ly] },
    elementi: { sh: SH, dito: F, reel, tag, titolo: T, L },
    tempi: { taglio: t0, interruttore: prova ? ti : null, condividi: ts, uscita: ts + 0.6 },
  };
};

/* @scheda U07 · Dito che preme un bottone (schermata vera di Instagram che cambia stato)
 * quando: ogni tutorial su Instagram: tocca la bozza, Condividi, Duplica, un'impostazione da attivare (regola dell'utente: il
 *   dito che preme è importante); il bottone premuto cambia stato o cambia la schermata
 * frase: «Poi torna indietro e pubblica la seconda bozza come reel normale.» (03/10, 18,6–22,4 s)
 * durata: 3–5 s (consigliata 4)
 * scena: t0 (taglio: si è tornati alle Bozze), t1, X, Y (centro del telefono), parole: { bozza (il dito preme la bozza:
 *   la schermata diventa «Nuovo reel»), condividi (preme Condividi: il reel esce con l'etichetta NORMALE), titolo ([…]) }
 * opzioni: media (la tua copertina), altre ([id] le altre bozze in griglia), pubblicata (true: la bozza 1 è già pubblicata,
 *   spenta con la spunta), titolo, ingresso ("arrivo" default, di lato | "zoom" | "nessuno"), fermo (R7, default true)
 *   scala / alto / sfuma (il telefono: con KW_RITMO 0,435 / 365 / 0 come lo schermo del reel 65; null = come prima)
 * restituisce: rect, pose, ancore { telefono, bozza, condividi, reel }, elementi { dr, sh, dito, reel, tag, L },
 *   tempi { taglio, bozza, condividi }
 * suoni: whoosh .14 al taglio · tap .2 sulla bozza · card .08 al cambio di schermata · tap .2 su Condividi · whoosh .12 + pop
 *   .12 all'uscita
 * regole: il dito (cerchio bianco traslucido) entra dal basso e scivola sul bottone (0,3 s power2.inOut), preme (0,74 in
 *   0,07 s + anello bianco) e torna senza rimbalzo (KW_RITMO); il bottone cambia stato (la schermata, il blu che si accende) ·
 *   R2 schermata piena al taglio · camera ferma dopo l'arrivo (lo schermo del reel 65 resta fermo) · R5 niente back.out
 * prima: (demo-2 66,7–68,1 s; reel-03 18,6–22,4 s) il dito premeva con il ritorno back.out(3); nel reel-03 la camera faceva
 *   move + whip + move per seguire bozze, schermata e reel che esce
 * chiamata:
 *   TPL.U07({ t0: 46.15, t1: 50.15, X: 26000, Y: 900, parole: { bozza: 47.98, condividi: 48.88,
 *     titolo: [46.18, 46.58, 46.85, 47.45, 47.98, 48.88, 49.38] } }, {
 *     titolo: [[{ t: "Poi torna " }, { t: "indietro", box: true }], [{ t: "la seconda: reel normale", hand: true }]],
 *     media: "th-mio_04", altre: ["th-mio_02", "th-mio_07", "th-mio_09"], pubblicata: true });
 */
TPL.U07 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const media = o.media || "th-mio_04";
  const px = X + 170 - PH.w / 2, py = Y - PH.h / 2; // il telefono a destra: il reel normale esce a sinistra
  // le due schermate nello stesso telefono: Bozze (le due copie, la prima già pubblicata) → «Nuovo reel» della seconda
  const DR = igDrafts(L, px, py, [media, media].concat(o.altre || []), { z: 12 });
  [0, 1].forEach((i) => gsap.set(DR.tiles[i].num, { opacity: 1, scale: 1 }));
  if (o.pubblicata !== false) {
    gsap.set(DR.tiles[0].t0, { opacity: 0.4 });
    el(DR.screen, { position: "absolute", left: DR.tiles[0].x + 92, top: DR.tiles[0].y + 170, width: 64, height: 64, borderRadius: "50%", background: limeFill(1), boxShadow: GLOW_A(0.8), display: "flex", alignItems: "center", justifyContent: "center", zIndex: 8 }, svg("check", 38, K.ink, 3.2));
  }
  const SH = igShare(L, px, py, media, { z: 13 });
  el(SH.thumb, { position: "absolute", left: 12, top: 12, width: 50, height: 50, borderRadius: "50%", background: limeFill(1), color: K.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 28, boxShadow: `0 6px 16px rgba(0,0,0,.45), ${GLOW_A(0.5)}`, zIndex: 5 }, "2");
  gsap.set(SH.frame, { opacity: 0 });
  const F = tapFinger(L, { size: 92 });
  // 1) il dito preme la seconda bozza: la schermata diventa «Nuovo reel» (il bottone che cambia stato è la schermata)
  const tb = P.bozza == null ? t0 + 1.2 : P.bozza;
  const [bx, by] = DR.tileXY(1);
  F.show(tb - 0.55, bx + 60, by + 260);
  F.to(tb - 0.45, bx, by, 0.34);
  F.tap(tb);
  tl.to(DR.tiles[1].t0, { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1 }, tb);
  const tsw = tb + 0.14;
  tl.set(SH.frame, { opacity: 1 }, tsw);
  tl.set(DR.frame, { opacity: 0 }, tsw);
  // 2) il dito preme Condividi (interruttore spento: reel normale); il reel esce a sinistra con l'etichetta NORMALE
  const ts = P.condividi == null ? tb + 0.9 : P.condividi;
  const [shx, shy] = SH.share();
  F.to(tsw + 0.04, shx, shy, Math.max(0.3, ts - tsw - 0.16));
  F.tap(ts);
  SH.press("share", ts);
  F.hide(ts + 0.3);
  const lx = X - 300, ly = Y + 120, cw = 230, ch = Math.round((cw * 16) / 9);
  const reel = tplReelCard(L, shx, shy, cw, ch, media, 40);
  gsap.set(reel, { scale: 0.4 });
  tl.set(reel, { opacity: 1 }, ts + 0.05);
  tl.to(reel, { x: lx, y: ly, rotation: -6, scale: 1, duration: 0.55, ease: "power3.out" }, ts + 0.05);
  const tag = tplTagReel(L, lx, ly + ch / 2 + 50, false, 41);
  popK(tag, ts + 0.45, { da: 0.8, dur: 0.18 });
  // 3) la camera: arrivo di lato che frena, poi ferma (KW_RITMO: telefono come il reel 65)
  const rect = [lx - cw / 2 - 60, py - 20, px + PH.w + 20, py + PH.h + 20];
  const tt = tplTel("U07", o), posa = tt ? tplPosaTel(tt, (rect[0] + rect[2]) / 2, py) : null;
  tplSfumaTel([DR.frame, SH.frame], tt);
  let pose = posa || fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "arrivo", dx: -175, dy: 0, dur: 0.6, top: 380, posa });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { telefono: [px + PH.w / 2, Y], bozza: [bx, by], condividi: [shx, shy], reel: [lx, ly] },
    elementi: { dr: DR, sh: SH, dito: F, reel, tag, titolo: T, L },
    tempi: { taglio: t0, bozza: tb, condividi: ts },
  };
};

// ═══ blocco 2 del rifacimento (ritmo-02) ═══════════════════════════════════════════════════════════════════════════════════

/* @scheda U15 · Timer, conto alla rovescia (il cronometro che misura il tempo detto, con l'anello di quello che si fa)
 * quando: "in 60 secondi", "30 giorni in 30 minuti", "360 contenuti in 60 minuti": il cronometro d'acciaio conta alla
 *   rovescia in tempo reale e attorno l'anello delle cose fatte (i giorni pianificati) si riempie molto più in fretta
 * frase: «30 giorni di contenuti pianificati in meno di 30 secondi.» (15/10, 0–4,0 s)
 * durata: 3–5 s (consigliata 3,5–4,5)
 * scena: t0 (taglio: il cronometro parte e l'anello si riempie), t1, X, Y (centro del cronometro), parole: { pieno (l'anello
 *   è pieno: es. «pianificati»), secondi (accento sul numero: es. «secondi»), titolo ([…]) }
 * opzioni: titolo, da (secondi al taglio, 30), unita ("SECONDI"), giorni (segmenti dell'anello, 30), etichetta (testo del
 *   contatore dell'anello, "giorni"), d (diametro del cronometro nel mondo, 560), ingresso ("fermo" default | "zoom" |
 *   "arrivo" | "nessuno"), fermo (R7)
 * restituisce: rect, pose, ancore { centro, anello(f) (punto dell'anello a frazione f) }, elementi { cronometro, segmenti,
 *   contatore, L }, tempi { taglio, pieno, secondi }
 * suoni: whoosh .14 al taglio · rise .06 col riempimento · tick .05 a ogni secondo (facoltativo) · ding .1 su «secondi»
 * regole: R2 cronometro e anello vuoto già in scena al taglio; il movimento principale è il riempimento dal primo fotogramma:
 *   i segmenti si accendono in giro, lineari (R6), e il contatore conta insieme · il cronometro conta in tempo reale (reel
 *   146 e 13: un secondo al secondo, lineare) e l'arco del tempo si accorcia lineare · R3 un accento sul numero (bagliore) ·
 *   R5 niente back.out (lo show() del kit non si usa) · R7 sfondo fermo
 * prima: (demo-6 22–26 s) il cronometro entrava ruotando con back.out(1,8) e contava dopo l'entrata; niente anello delle cose
 *   fatte
 * chiamata:
 *   TPL.U15({ t0: 22.75, t1: 26.95, X: 16600, Y: 900, parole: { pieno: 24.6, secondi: 26.0,
 *     titolo: [22.85, 23.1, 23.5, 24.0, 25.5, 26.0] } }, {
 *     titolo: [[{ t: "30 giorni " }, { t: "in 30 secondi", box: true }]] });
 */
TPL.U15 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const d = o.d || 560, R = d / 2, da = o.da == null ? 30 : o.da;
  const SW = stopwatch(L, X, Y, d, { start: String(da), unita: o.unita || "SECONDI", z: 14 });
  // l'anello delle cose fatte: n segmenti grigi attorno al cronometro, con la copia lime che si accende
  const n = o.giorni || 30, rr = R + 62, sw = 40, gapA = 2.4;
  const S = svgLayer(L, 13, X - 1500, Y - 1500, 3000, 3000);
  const arcD = (a0, a1) => {
    const p = (a) => [X + Math.cos(((a - 90) * Math.PI) / 180) * rr, Y + Math.sin(((a - 90) * Math.PI) / 180) * rr];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rr} ${rr} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const segs = [];
  for (let k = 0; k < n; k++) {
    const a0 = (k * 360) / n + gapA / 2, a1 = ((k + 1) * 360) / n - gapA / 2;
    const mk = (col) => { const q = document.createElementNS(NS, "path"); q.setAttribute("d", arcD(a0, a1)); q.setAttribute("fill", "none"); q.setAttribute("stroke", col); q.setAttribute("stroke-width", sw); S.appendChild(q); return q; };
    mk("rgba(255,255,255,.12)");
    const on = mk(K.lime);
    gsap.set(on, { opacity: 0 });
    segs.push(on);
  }
  // il contatore dell'anello (cosa misura l'anello): «0 → 30 giorni» in una pill sopra a sinistra
  const cnt = layered(el(L, { position: "absolute", left: X - rr - 40, top: Y - rr - 70, height: 76, padding: "0 28px", display: "flex", alignItems: "center", gap: 12, borderRadius: 38, background: "rgba(34,34,34,.94)", border: `2px solid ${K.lime}`, boxShadow: `0 16px 36px rgba(0,0,0,.55), ${GLOW_A(0.45)}`, fontFamily: FS, fontWeight: 800, fontSize: 40, color: K.white, whiteSpace: "nowrap", zIndex: 20 }, svg("calendar-check", 40, K.lime, 2.4) + `<span>0 ${o.etichetta || "giorni"}</span>`));
  const cntN = cnt.querySelector("span");
  const tutto = [SW.g, S, cnt];
  gsap.set(tutto, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(tutto, { opacity: 1, duration: 0.2 }, t), () => gsap.set(tutto, { opacity: 1 }));
  // il movimento principale: l'anello si riempie dal primo fotogramma, lineare, col contatore (R6); il cronometro conta in
  // tempo reale per tutta la scena
  const ts = t0 + 0.03, tp = P.pieno == null ? t0 + 1.4 : P.pieno, dF = Math.max(0.6, tp - ts);
  segs.forEach((s, k) => tl.set(s, { opacity: 1 }, ts + (dF * (k + 1)) / n));
  const V = { v: 0 }, et = o.etichetta || "giorni";
  tl.fromTo(V, { v: 0 }, { v: n, duration: dF, ease: "none", immediateRender: false, onUpdate: () => (cntN.textContent = `${Math.round(V.v)} ${et}`) }, ts);
  tl.set(S, { filter: `drop-shadow(0 0 8px ${rgba(K.lime, 0.55)})` }, ts);
  SW.run(ts, t1 - ts, da, da - (t1 - ts), da);
  // accento: il numero dei secondi s'illumina
  const tsec = P.secondi == null ? tp + 0.8 : P.secondi;
  glowFlash(SW.num, tsec);
  tl.to(cnt, { boxShadow: `0 16px 36px rgba(0,0,0,.55), ${GLOW_A(1)}`, duration: 0.2 }, tp);
  // la camera: tiene (il movimento è il riempimento)
  const rect = [X - rr - sw / 2 - 50, Y - rr - 80, X + rr + sw / 2 + 50, Y + rr + sw / 2 + 10];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: o.ingresso || "fermo", top: 380, fill: o.fill || 0.98 });
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { centro: [X, Y], anello: (f) => [X + Math.cos(f * 2 * Math.PI - Math.PI / 2) * rr, Y + Math.sin(f * 2 * Math.PI - Math.PI / 2) * rr] },
    elementi: { cronometro: SW, segmenti: segs, contatore: cnt, titolo: T, L },
    tempi: { taglio: t0, pieno: ts + dF, secondi: tsec },
  };
};

// ═══ blocco 3 del rifacimento (ritmo-03) ═══════════════════════════════════════════════════════════════════════════════════

// il logo a raggi di Claude (lo stesso di chatUI), in un svg di lato s
const tplLogoClaude = (s, col) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100">${Array.from({ length: 12 }, (_, i) => `<rect x="46.5" y="6" width="7" height="44" rx="3.5" fill="${col || "#D97757"}" transform="rotate(${i * 30 + (i % 2) * 7} 50 50)"/>`).join("")}</svg>`;

/* @scheda U01 · Chat AI ricreata come la UI vera + il comando che si scrive (e la risposta che arriva)
 * quando: "chiedi a Claude / ChatGPT…", "il comando che uso per scrivere i copioni", un prompt da copiare: la schermata vera
 *   della chat (non un diagramma) col saluto; il prompt si scrive lettera per lettera mentre lo dici, sulla parola d'invio il
 *   bottone si preme, il messaggio sale nella conversazione e la risposta arriva con le sue sezioni
 * frase: «…il comando che uso per scrivere i copioni con questo metodo.» (15/10, 41,8–43,9 s; la frase comincia in X01)
 * durata: 2,5–6 s (consigliata 3–5)
 * scena: t0 (taglio, o l'arrivo dello zoom-through dalla risorsa di X01), t1, X, Y (centro della finestra), parole: { scrive
 *   (parte la digitazione, default t0 + 0,1), invia (il bottone si preme e il messaggio parte, es. «metodo»), titolo ([…]) }
 * opzioni: prompt (il testo che si scrive: un comando corto, ~20–30 lettere al secondo fra scrive e invia), risposta ({ intro,
 *   sezioni: ["Hook", "Spiega", "Mostra", "Insegna"] }: le sezioni della risposta, in lime), utente ({ nome: "Samuele", user:
 *   "tu" }), saluto ("Buonasera, Samuele"), modello ("Opus 4.1"), w (940), h (altezza della finestra: default dal contenuto,
 *   max(900, 784 + 92 × (sezioni − 1)) → 1060 con 4 sezioni, il valore consigliato; sotto quel valore la risposta copre il campo
 *   che dopo l'invio scende in fondo), vicino (true: prima da vicino sul campo, poi larga sull'invio come il reel 66; false =
 *   sempre larga), ingresso ("arrivo" default | "zoom" | "nessuno" = la
 *   camera la muove la composizione, es. tplZoomThrough dalla risorsa di X01), fermoDa, fermo
 * restituisce: rect, pose (vicina, sul campo), poseTutto, ancore { campo, invio }, elementi { finestra, campo, testo, bolla,
 *   risposta, seconda(t) (con ingresso "nessuno": tenuta e seconda inquadratura da t), L }, tempi { taglio,
 *   scrive, invia, fine }
 * suoni: key1–key6 .03 a gruppi sulla digitazione · click .08 su «invia» · pop .05 sulla risposta
 * regole: U01 misurato (reel 6 a 7,09 s: la chat vera, la barra si allarga in 0,25 s, il prompt si scrive a ~20 lettere al
 *   secondo insieme alla voce, la camera ferma; reel 66 a 3,84 s: «/analyze» come comando, poi la seconda inquadratura) · R2
 *   la finestra col saluto e il campo vuoto è già lì al taglio; la digitazione parte al primo fotogramma (il movimento
 *   principale è il testo; la camera arriva vicina sul campo, come il reel 66, e tiene) · R3 un solo secondo stato: l'invio (il
 *   messaggio sale, la risposta arriva con le sezioni) con la seconda inquadratura larga in 0,5 s power2.inOut · R5 il bottone premuto torna con power2.out, niente back.out · R7
 * prima: (demo-2 14,5 s) chatUI: logo e saluto entravano sfocati, la barra si allargava dopo il taglio, il prompt si scriveva a
 *   22 lettere al secondo e l'invio rimbalzava (back.out(3))
 * chiamata:
 *   S.U01 = TPL.U01({ t0: 48.2, t1: 51.0, X: 28600, Y: 900, parole: { scrive: 48.28, invia: 49.93,
 *     titolo: [48.9, 49.07, 49.37, 49.5] } }, {
 *     titolo: [[{ t: "Per scrivere i " }, { t: "copioni", box: true }]], prompt: "/copione metodo: hook, spiega, mostra, insegna",
 *     risposta: { intro: "Ecco il copione del tuo reel:", sezioni: ["Hook", "Spiega", "Mostra", "Insegna"] },
 *     ingresso: "nessuno", fermoDa: 48.65 });
 *   S.U01.elementi.seconda(tplZoomThrough(48.2, S.X01.ancore.risorsa, S.U01.pose));   // R8 dalla risorsa di X01
 */
TPL.U01 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const U = Object.assign({ nome: "Samuele", user: "tu" }, o.utente || {});
  // altezza della finestra (blocco 3, 15/10): senza h segue il contenuto, così dopo l'invio la risposta non copre il campo spostato
  // in basso (con 4 sezioni → 1060, il valore passato a mano nel reel 15; il minimo resta 900, l'altezza di prima)
  const nSez = ((o.risposta && o.risposta.sezioni) || [1, 2, 3, 4]).length;
  const W = o.w || 940, H = o.h || Math.max(900, 784 + (nSez - 1) * 92), x0 = X - W / 2, y0 = Y - H / 2;
  const SERIF = 'Georgia, "Times New Roman", serif';
  // la finestra della chat (Claude, tema scuro): barra in alto, saluto al centro, campo di testo sotto
  const fin = layered(el(L, { position: "absolute", left: x0, top: y0, width: W, height: H, borderRadius: 34, overflow: "hidden", background: "#262624", border: "1.5px solid rgba(255,255,255,.12)", boxShadow: "0 40px 100px rgba(0,0,0,.65)", zIndex: 12 }));
  el(fin, { position: "absolute", left: 30, top: 28, width: 40, height: 40 }, svg("panel-left", 36, "rgba(255,255,255,.6)", 2));
  el(fin, { position: "absolute", left: 86, top: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: SERIF, fontSize: 36, color: "#e8e6dc", whiteSpace: "nowrap" }, tplLogoClaude(34) + "Claude");
  const me = el(fin, { position: "absolute", right: 28, top: 24, width: 46, height: 46, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,.25)" });
  imgIn(me, "av-" + U.user, { objectFit: "cover" });
  // il saluto (logo + testo serif)
  const sal = el(fin, { position: "absolute", left: 0, top: 230, width: W, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, fontFamily: SERIF, fontSize: 62, color: "#e8e6dc", whiteSpace: "nowrap" }, tplLogoClaude(66) + (o.saluto || `Buonasera, ${U.nome}`));
  // il campo di testo (con placeholder, strumenti, modello e invio arancione)
  const cx0 = 40, cw = W - 80, chh = 250, cy0 = 360;
  const campo = el(fin, { position: "absolute", left: cx0, top: cy0, width: cw, height: chh, borderRadius: 28, background: "#30302e", border: "1.5px solid rgba(255,255,255,.14)", boxShadow: "0 18px 40px rgba(0,0,0,.35)", zIndex: 4 });
  const ph = el(campo, { position: "absolute", left: 30, top: 26, fontFamily: FS, fontWeight: 500, fontSize: 42, color: "rgba(255,255,255,.4)", whiteSpace: "nowrap" }, o.placeholder || "Come posso aiutarti oggi?");
  const testo = el(campo, { position: "absolute", left: 30, top: 22, width: cw - 60, fontFamily: FS, fontWeight: 600, fontSize: 44, lineHeight: 1.28, color: "#f0efe8" });
  const tb = el(campo, { position: "absolute", left: 22, top: chh - 78, width: cw - 44, height: 58, display: "flex", alignItems: "center", gap: 14 });
  ["plus", "sliders-horizontal", "clock"].forEach((ic) => el(tb, { width: 56, height: 56, borderRadius: 14, border: "1.5px solid rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center" }, svg(ic, 28, "rgba(255,255,255,.7)", 2)));
  el(tb, { flex: 1 });
  el(tb, { display: "flex", alignItems: "center", gap: 8, fontFamily: FS, fontWeight: 600, fontSize: 28, color: "rgba(255,255,255,.65)", whiteSpace: "nowrap", marginRight: 10 }, (o.modello || "Opus 4.1") + svg("chevron-down", 24, "rgba(255,255,255,.65)", 2.2));
  const invio = el(tb, { width: 58, height: 58, borderRadius: 16, background: "#c96442", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.45 }, svg("arrow-up", 32, "#ffffff", 2.8));
  // la conversazione dopo l'invio: la bolla del tuo messaggio e la risposta con le sezioni
  const pr = o.prompt || "Scrivi un copione";
  const bolla = el(fin, { position: "absolute", right: 50, top: 110, maxWidth: W - 220, padding: "20px 28px", borderRadius: 26, background: "#3a3a37", fontFamily: FS, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: "#f0efe8", zIndex: 3 }, pr);
  gsap.set(bolla, { opacity: 0 });
  const RS = Object.assign({ intro: "Ecco il copione:", sezioni: ["Hook", "Spiega", "Mostra", "Insegna"] }, o.risposta || {});
  const yR = 290;
  const risp = el(fin, { position: "absolute", left: 50, top: yR, width: W - 100, zIndex: 3 });
  const rLogo = el(risp, { position: "absolute", left: 0, top: 0 }, tplLogoClaude(44));
  const rIntro = el(risp, { position: "absolute", left: 66, top: 2, fontFamily: SERIF, fontSize: 40, color: "#e8e6dc", whiteSpace: "nowrap" }, RS.intro);
  const righe = RS.sezioni.map((s, i) => {
    const y = 74 + i * 92;
    const g = el(risp, { position: "absolute", left: 66, top: y, width: W - 216, height: 80 });
    el(g, { position: "absolute", left: 0, top: 0, fontFamily: FS, fontWeight: 800, fontSize: 34, color: K.lime, textShadow: GLOW_LT, whiteSpace: "nowrap", letterSpacing: "0.04em" }, s.toUpperCase());
    el(g, { position: "absolute", left: 0, top: 44, width: (W - 216) * (0.92 - 0.12 * (i % 2)), height: 12, borderRadius: 6, background: "rgba(255,255,255,.22)" });
    el(g, { position: "absolute", left: 0, top: 64, width: (W - 216) * (0.6 + 0.1 * (i % 3)), height: 12, borderRadius: 6, background: "rgba(255,255,255,.14)" });
    gsap.set(g, { opacity: 0 });
    return g;
  });
  gsap.set([rLogo, rIntro], { opacity: 0 });
  // 1) prima del taglio: la finestra col saluto e il campo vuoto (R2)
  gsap.set(fin, { opacity: 0 });
  tplMonta(t0, (t) => tl.to(fin, { opacity: 1, duration: 0.2 }, t), () => gsap.set(fin, { opacity: 1 }));
  // 2) il movimento principale: il comando si scrive dal primo fotogramma, lettera per lettera
  const ts = P.scrive == null ? t0 + 0.1 : P.scrive;
  const ti = P.invia == null ? t1 - 1.0 : P.invia;
  const cps = Math.max(18, Math.min(34, (pr.length + 2) / Math.max(0.6, ti - ts - 0.08)));
  tl.to(ph, { opacity: 0, duration: 0.06 }, ts - 0.04);
  // il testo va a capo per parole (typeIn scrive su una riga): righe spezzate qui sulla larghezza del campo, scritte una dopo l'altra
  const maxC = Math.max(8, Math.floor((cw - 60) / (44 * 0.56)));
  const RIGHE = pr.split(" ").reduce((acc, w) => { const l = acc[acc.length - 1]; if (l != null && (l + " " + w).length <= maxC) acc[acc.length - 1] = l + " " + w; else acc.push(w); return acc; }, []);
  let fine = ts;
  RIGHE.forEach((r, i) => {
    const rg = el(testo, { position: "relative", height: Math.round(44 * 1.28), whiteSpace: "nowrap" });
    fine = typeIn(rg, r + (i < RIGHE.length - 1 ? " " : ""), fine, cps, { caret: true, size: 44, caretColor: "#e8e6dc", blinks: i < RIGHE.length - 1 ? -0.5 : 0 });
  });
  tl.to(invio, { opacity: 1, duration: 0.12 }, ts + 0.1);
  // 3) l'invio: il bottone si preme (senza rimbalzo), il messaggio sale nella conversazione, la risposta arriva a sezioni
  tl.to(invio, { scale: 0.86, duration: 0.07, ease: "power2.out" }, ti);
  tl.to(invio, { scale: 1, duration: 0.18, ease: "power2.out" }, ti + 0.07);
  tl.to(sal, { opacity: 0, y: -20, duration: 0.15, ease: "power2.in" }, ti + 0.08);
  tl.to(campo, { y: H - chh - 40 - cy0, duration: 0.35, ease: "power3.out" }, ti + 0.1);
  tl.to(testo, { opacity: 0, duration: 0.08 }, ti + 0.1);
  tl.set(ph, { opacity: 1 }, ti + 0.2);
  tl.to(invio, { opacity: 0.45, duration: 0.1 }, ti + 0.2);
  popK(bolla, ti + 0.14, { da: 0.94, dur: 0.18, y: 40 });
  tl.to([rLogo, rIntro], { opacity: 1, duration: 0.15 }, ti + 0.34);
  righe.forEach((r, i) => popK(r, ti + 0.46 + i * 0.12, { da: 0.97, dur: 0.15, y: 12 }));
  // 4) la camera (reel 66): prima da vicino sul campo, dove si legge il comando; sull'invio la seconda inquadratura, larga, sulla
  //    finestra intera (la risposta è la seconda cosa: R3). Con ingresso "nessuno" la composizione porta la camera sulla posa
  //    vicina (es. tplZoomThrough) e poi chiama elementi.seconda(fine dell'arrivo) per la tenuta e la seconda inquadratura
  const rect = [x0 - 12, y0 - 12, x0 + W + 12, y0 + H + 12];
  const poseTutto = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380, fill: o.fill || 0.98 });
  const rc = [x0 + cx0 - 14, y0 + cy0 - 200, x0 + cx0 + cw + 14, y0 + cy0 + chh + 14];
  let pose = o.vicino === false ? poseTutto : fitPose(rc[0], rc[1], rc[2], rc[3], { top: 380, fill: 0.99 });
  const seconda = (tDa) => {
    if (o.vicino === false) { tplTenuta(tDa, t1, 0.006); return; }
    tplTenuta(tDa, ti, 0.006);
    camK(ti + 0.06, 0.5, poseTutto.fx, poseTutto.fy, poseTutto.s, "power2.inOut");
    tplTenuta(ti + 0.56, t1, 0.006);
  };
  if (o.ingresso !== "nessuno") { pose = apertura(t0, t0 + 0.7, rc, { modo: o.ingresso || "arrivo", posa: pose, tenuta: 0 }); seconda(t0 + 0.7); }
  tplFermo0(scena, o);
  const T = tplTitoloK(scena, o);
  return {
    rect, pose,
    ancore: { campo: [x0 + cx0 + cw / 2, y0 + cy0 + chh / 2], invio: [x0 + cx0 + cw - 50, y0 + cy0 + chh - 49] },
    poseTutto,
    elementi: { finestra: fin, campo, testo, bolla, risposta: risp, seconda, titolo: T, L },
    tempi: { taglio: t0, scrive: ts, invia: ti, fine },
  };
};
