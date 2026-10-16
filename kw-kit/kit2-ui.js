// ═══ KW kit v2 · UI — schermate di Instagram, telefono e dito che preme ═══════════════════════════
// Regola dell'utente: negli script sulle funzioni di Instagram restano le schermate realistiche del vecchio stile
// (hyperframes-test-03/brag-output) con il dito/puntatore che va a premere i bottoni — qui rifatte nello stile Kallaway.

// ── icone delle piattaforme (Kallaway mette loghi veri nei suoi schemi) ──
// instagram e youtube vengono da kit.js (appIcon); qui si aggiungono facebook, google, esplora (bussola), simili (account suggeriti)
const G_LOGO = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const BRAND = {
  facebook: { bg: "linear-gradient(160deg,#3d8dff,#1665e4)", html: (s) => svg("facebook", Math.round(s * 0.56), "#fff", 2.2) },
  google: { bg: "linear-gradient(180deg,#ffffff,#e9edf2)", html: (s) => G_LOGO(Math.round(s * 0.58)) },
  esplora: { bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", html: (s) => svg("compass", Math.round(s * 0.6), "#fff", 2) },
  simili: { bg: "linear-gradient(160deg,#454547,#262628)", html: (s) => svg("user-plus", Math.round(s * 0.56), "#fff", 2.1) },
};
const brandIcon = (parent, cx, cy, size, kind, z) => {
  if (APP[kind]) return appIcon(parent, cx, cy, size, kind, z);
  const a = BRAND[kind];
  const t = el(parent, { position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, borderRadius: size * 0.26, background: a.bg, boxShadow: `inset 0 ${size * 0.03}px 0 rgba(255,255,255,.35), inset 0 -${size * 0.06}px ${size * 0.14}px rgba(0,0,0,.18), 0 ${size * 0.12}px ${size * 0.3}px rgba(0,0,0,.55)`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: z || 20, overflow: "hidden" }, a.html(size));
  el(t, { position: "absolute", left: 0, top: 0, width: "100%", height: "48%", background: "linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0))", pointerEvents: "none" });
  return t;
};

// ═══ U07 · dito che preme (vecchio stile, migliorato) ═══════════════════════════════════════════
// cerchio bianco traslucido con bordo: entra dal basso, scivola sul bottone (0,3 s power2.inOut), preme (scala 0,74 +
// anello bianco che si allarga) e se ne va. Vive nel mondo (si muove con la camera). o: { size, z }
const tapFinger = (parent, o) => {
  o = o || {};
  const d = o.size || 84, z = o.z || 80;
  const f = el(parent, { position: "absolute", left: -d / 2, top: -d / 2, width: d, height: d, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,.62), rgba(255,255,255,.34) 62%, rgba(255,255,255,.24))", border: "3px solid rgba(255,255,255,.95)", boxShadow: "0 10px 28px rgba(0,0,0,.5), 0 0 22px rgba(255,255,255,.3)", opacity: 0, zIndex: z, pointerEvents: "none" });
  let P = [0, 0];
  return {
    f,
    show: (t, x, y) => { P = [x, y]; tl.set(f, { x, y: y + 80, scale: 1.12 }, t); tl.to(f, { opacity: 1, y, scale: 1, duration: 0.24, ease: "power2.out" }, t); },
    to: (t, x, y, dur) => { P = [x, y]; tl.to(f, { x, y, duration: dur || 0.3, ease: "power2.inOut" }, t); },
    tap: (t) => {
      tl.to(f, { scale: 0.74, duration: 0.07, ease: "power2.out" }, t - 0.03);
      tl.to(f, { scale: 1, duration: 0.24, ease: "back.out(3)" }, t + 0.05);
      ripple(parent, P[0], P[1], t, { r: d * 0.85, s0: 0.45, s1: 1.45, w: 3, dur: 0.45, color: "#ffffff", glow: false, z: z - 1 });
    },
    hide: (t) => tl.to(f, { opacity: 0, scale: 0.9, y: P[1] + 40, duration: 0.2, ease: "power2.in" }, t),
  };
};

// ═══ telefono (iPhone scuro) ═══════════════════════════════════════════════════════════════════
// PH (kit.js): 560 × 1140, schermo 534 × 1114. .at(x, y) = coordinate del parent di un punto dello schermo.
const phone2 = (parent, X, Y, o) => {
  o = o || {};
  const frame = el(parent, { position: "absolute", left: X, top: Y, width: PH.w, height: PH.h, borderRadius: PH.r, background: "linear-gradient(150deg,#3e3e3e 0%,#171717 36%,#0d0d0d 70%,#2d2d2d 100%)", boxShadow: "0 50px 110px rgba(0,0,0,.65), inset 0 0 0 2px rgba(255,255,255,.12), 0 0 0 1.5px rgba(255,255,255,.07)", zIndex: o.z || 12 });
  const screen = el(frame, { position: "absolute", left: PH.bz, top: PH.bz, width: PH.sw, height: PH.sh, borderRadius: PH.sr, background: "#000", overflow: "hidden" });
  el(screen, { position: "absolute", left: (PH.sw - 122) / 2, top: 12, width: 122, height: 35, borderRadius: 18, background: "#000", zIndex: 60, boxShadow: "0 0 0 1.5px #121212" });
  el(screen, { position: "absolute", left: 42, top: 17, fontFamily: FS, fontSize: 22, fontWeight: 700, color: "#fff", zIndex: 59 }, "9:41");
  const sb = el(screen, { position: "absolute", right: 30, top: 21, display: "flex", alignItems: "flex-end", gap: 3, zIndex: 59 });
  [6, 9, 12, 15].forEach((h) => el(sb, { width: 4, height: h, borderRadius: 1.5, background: "#fff" }));
  el(sb, { width: 32, height: 15, borderRadius: 5, border: "2px solid rgba(255,255,255,.55)", marginLeft: 8, position: "relative" }, '<div style="position:absolute;left:2px;top:2px;width:20px;height:7px;border-radius:2px;background:#fff"></div>');
  el(screen, { position: "absolute", left: (PH.sw - 180) / 2, top: PH.sh - 16, width: 180, height: 6, borderRadius: 3, background: "rgba(255,255,255,.8)", zIndex: 61 });
  return { frame, screen, X, Y, at: (x, y) => [X + PH.bz + x, Y + PH.bz + y] };
};
// interruttore iOS: spento grigio, acceso lime con alone (come il reel 136 di Kallaway)
const iosSwitch = (parent, x, y, o) => {
  o = o || {};
  const w = o.w || 88, h = o.h || 54;
  const tr = el(parent, { position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: "#3a3a3c", boxShadow: "0 0 0px rgba(207,251,80,0), 0 0 0px rgba(207,251,80,0)", zIndex: 5 });
  const kn = el(tr, { position: "absolute", left: 3, top: 3, width: h - 6, height: h - 6, borderRadius: "50%", background: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,.4)" });
  return { tr, kn, w, h, on: (t) => { tl.to(tr, { backgroundColor: "#CFFB50", boxShadow: GLOW_A(0.7), duration: 0.18 }, t); tl.to(kn, { x: w - h, duration: 0.26, ease: "back.out(2)" }, t); } };
};

// ═══ U08 · Impostazioni di Instagram con interruttori veri (dark mode) ═══════════════════════════
// righe: [{ kind (icona: facebook | google | simili | esplora | instagram | youtube), t, d }]
// o: { user (foto profilo vera nella tab bar), titolo, sezione, extra: [[icona, testo], …] righe spente sotto, z }
// .on(i, t) accende la riga i (interruttore + bordo lime) · .sw(i) centro dell'interruttore · .rowRect(i) [x0,y0,x1,y1]
const igSettings = (parent, X, Y, righe, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw, rowH = 128, y0 = 262;
  el(S, { position: "absolute", left: 16, top: 66, width: 40, height: 40 }, svg("chevron-left", 38, "#fff", 2.4));
  el(S, { position: "absolute", left: 0, top: 70, width: W, textAlign: "center", fontFamily: FS, fontSize: 28, fontWeight: 800, color: "#fff" }, o.titolo || "Impostazioni e privacy");
  el(S, { position: "absolute", left: 22, top: 130, width: W - 44, height: 56, borderRadius: 14, background: "#262628", display: "flex", alignItems: "center", gap: 12, padding: "0 18px", fontFamily: FS, fontSize: 24, color: "rgba(255,255,255,.45)" }, svg("search", 26, "rgba(255,255,255,.45)", 2.2) + "Cerca");
  el(S, { position: "absolute", left: 24, top: 216, fontFamily: FS, fontSize: 21, fontWeight: 700, color: "rgba(255,255,255,.5)", whiteSpace: "nowrap" }, o.sezione || "Come ti trovano gli altri");
  const R = righe.map((r, i) => {
    const y = y0 + i * rowH;
    const row = el(S, { position: "absolute", left: 0, top: y, width: W, height: rowH, zIndex: 2 });
    const hl = el(row, { position: "absolute", left: 8, top: 7, width: W - 16, height: rowH - 14, borderRadius: 22, background: "rgba(255,255,255,0)", border: "2px solid rgba(207,251,80,0)" });
    brandIcon(row, 24 + 30, rowH / 2, 60, r.kind, 3);
    el(row, { position: "absolute", left: 104, top: 30, fontFamily: FS, fontSize: 26, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", zIndex: 3 }, r.t);
    el(row, { position: "absolute", left: 104, top: 67, fontFamily: FS, fontSize: 19, fontWeight: 500, color: "rgba(255,255,255,.5)", whiteSpace: "nowrap", zIndex: 3 }, r.d || "");
    const sw = iosSwitch(row, W - 22 - 88, (rowH - 54) / 2);
    if (i < righe.length - 1) el(S, { position: "absolute", left: 104, top: y + rowH - 1, width: W - 104, height: 1, background: "rgba(255,255,255,.08)" });
    return { row, hl, sw, y };
  });
  const extra = o.extra || [["lock", "Account privato"], ["message-circle", "Messaggi e risposte"], ["bell", "Notifiche"], ["shield", "Privacy dell'account"]];
  const yx = y0 + righe.length * rowH + 34;
  el(S, { position: "absolute", left: 0, top: yx - 18, width: W, height: 10, background: "#111" });
  const ex = extra.map(([icn, txt], k) => {
    const e = el(S, { position: "absolute", left: 0, top: yx + k * 96, width: W, height: 96, opacity: 0.4 });
    el(e, { position: "absolute", left: 34, top: 30, width: 36, height: 36 }, svg(icn, 34, "#fff", 2));
    el(e, { position: "absolute", left: 104, top: 30, fontFamily: FS, fontSize: 25, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }, txt);
    el(e, { position: "absolute", right: 26, top: 32, width: 30, height: 30 }, svg("chevron-right", 30, "rgba(255,255,255,.6)", 2.2));
    return e;
  });
  // tab bar di Instagram con la tua foto profilo vera
  const tb = el(S, { position: "absolute", left: 0, top: PH.sh - 112, width: W, height: 112, background: "#000", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", justifyContent: "space-around", alignItems: "flex-start", paddingTop: 24, zIndex: 8 });
  ["house", "search", "square-play", "send"].forEach((n) => el(tb, { width: 40, height: 40 }, svg(n, 36, "#fff", 2)));
  const me = el(tb, { width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: "2.5px solid #fff", position: "relative" });
  if (o.user) imgIn(me, "av-" + o.user, { objectFit: "cover" });
  return Object.assign(P, {
    rows: R, ex,
    sw: (i) => P.at(W - 22 - 44, R[i].y + rowH / 2),
    rowRect: (i) => { const a = P.at(0, R[i].y), b = P.at(W, R[i].y + rowH); return [a[0], a[1], b[0], b[1]]; },
    on: (i, t) => { R[i].sw.on(t); tl.to(R[i].hl, { backgroundColor: "rgba(255,255,255,.05)", borderColor: "rgba(207,251,80,.6)", duration: 0.25 }, t); },
  });
};

// ═══ U09 · notifica di Instagram (DM) con la foto profilo vera ═══════════════════════════════════
// banner di iOS che scende dall'alto (expo.out 0,5 s) e si accende di lime. o: { user, nome, testo, icon, w, h, z }
// o.allegato: titolo della pagina allegata, mostrata come miniatura a destra (la risorsa che arriva davvero nei DM)
const igNotif = (parent, cx, top, o) => {
  o = o || {};
  const w = o.w || 900, h = o.h || 176, ad = h - 56, tw = o.allegato ? Math.round(h * 0.62) : 0;
  const SH0 = "0 30px 80px rgba(0,0,0,.65), 0 0 0px rgba(207,251,80,0), 0 0 0px rgba(207,251,80,0)";
  const n = el(parent, { position: "absolute", left: cx - w / 2, top, width: w, height: h, borderRadius: 46, background: "linear-gradient(180deg, #474749, #2b2b2d)", border: "1.5px solid rgba(255,255,255,.22)", boxShadow: SH0, zIndex: o.z || 40 });
  const av = el(n, { position: "absolute", left: 28, top: 28, width: ad, height: ad, borderRadius: "50%", overflow: "hidden", border: "3px solid #CFFB50" });
  if (o.user) imgIn(av, "av-" + o.user, { objectFit: "cover" });
  appIcon(n, 28 + ad - 8, 28 + ad - 8, 46, "instagram", 3);
  const tx0 = 28 + ad + 28;
  el(n, { position: "absolute", left: tx0, top: 32, fontFamily: FS, fontWeight: 800, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }, o.nome || "");
  el(n, { position: "absolute", right: tw ? tw + 52 : 34, top: 36, fontFamily: FS, fontWeight: 500, fontSize: 24, color: "rgba(255,255,255,.5)" }, o.quando || "ora");
  el(n, { position: "absolute", left: tx0, top: 82, display: "flex", alignItems: "center", gap: 10, fontFamily: FS, fontWeight: 600, fontSize: 28, color: "rgba(255,255,255,.92)", whiteSpace: "nowrap" }, svg(o.icon || "file-text", 32, K.lime, 2.4) + (o.testo || ""));
  let att = null;
  if (o.allegato) att = docPage(n, w - tw - 30, Math.round((h - tw * 1.25) / 2), tw, Math.round(tw * 1.25), o.allegato, 1, { z: 4 });
  // la notifica è un banner che scende sopra ai contenuti: sovrapposizione voluta (per il controllo del layout)
  [n, ...n.querySelectorAll("*")].forEach((e) => { e.setAttribute("data-layout-allow-overlap", ""); e.setAttribute("data-layout-allow-occlusion", ""); });
  gsap.set(n, { opacity: 0 });
  return {
    n, att, rect: [cx - w / 2, top, cx + w / 2, top + h],
    // centro della miniatura allegata (coordinate del parent): ci "atterra" la pagina mandata da docWall.send
    attXY: () => [cx - w / 2 + w - tw / 2 - 30, top + h / 2],
    show: (t) => {
      tl.fromTo(n, { opacity: 0, y: -90, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "expo.out", immediateRender: false }, t);
      tl.to(n, { boxShadow: `0 30px 80px rgba(0,0,0,.65), ${GLOW_A(0.6)}`, duration: 0.3 }, t + 0.15);
      if (att) tl.fromTo(att, { scale: 0.4, opacity: 0, rotation: -10 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: "back.out(2.2)", immediateRender: false }, t + 0.2);
    },
  };
};

// ═══ U10 · Bozze di Instagram + menu ⋯ (vecchio stile del 03/10, rifatto nello stile Kallaway) ═══════════════
// ids: video del pool, una bozza per id (2 colonne, reel grandi e leggibili) · o: { titolo, voci, z }
// .dots(i) centro dei ⋯ della bozza i (mondo) · .menu(t) apre il foglio Modifica / Duplica / Elimina · .row(k) centro della
// riga k · .pick(k, t) la riga si accende · .closeMenu(t) · .duplicate(t, idCopia) la bozza 0 si divide: la copia scivola
// nello slot libero e compaiono i numeri 1 e 2 · .tileRect(i) · .sheetRect() · .rowEl(k)
const igDrafts = (parent, X, Y, ids, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw, H = PH.sh;
  el(S, { position: "absolute", left: 16, top: 66, width: 40, height: 40 }, svg("chevron-left", 38, "#fff", 2.4));
  el(S, { position: "absolute", left: 0, top: 70, width: W, textAlign: "center", fontFamily: FS, fontSize: 30, fontWeight: 800, color: "#fff" }, o.titolo || "Bozze");
  el(S, { position: "absolute", right: 26, top: 75, fontFamily: FS, fontSize: 23, fontWeight: 700, color: "#6d8dff" }, "Seleziona");
  const g = 18, tw = Math.round((W - g * 3) / 2), th = Math.round((tw * 16) / 9), ty0 = 136;
  const slot = (i) => [g + (i % 2) * (tw + g), ty0 + Math.floor(i / 2) * (th + g)];
  const mkTile = (id, i, dur) => {
    const [x, y] = slot(i);
    const t0 = el(S, { position: "absolute", left: x, top: y, width: tw, height: th, borderRadius: 18, overflow: "hidden", background: "#111", border: "1.5px solid rgba(255,255,255,.16)", zIndex: 3 });
    mediaTile(t0, 0, 0, tw, th, id, 1);
    el(t0, { position: "absolute", left: 0, bottom: 0, width: tw, height: 96, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.65))", zIndex: 2 });
    el(t0, { position: "absolute", left: 14, bottom: 13, display: "flex", alignItems: "center", gap: 7, fontFamily: FS, fontWeight: 700, fontSize: 21, color: "#fff", zIndex: 3 }, svg("clapperboard", 22, "#fff", 2.2) + (dur || "0:24"));
    const dt = el(t0, { position: "absolute", right: 12, top: 12, width: 56, height: 56, borderRadius: "50%", background: "rgba(0,0,0,.55)", border: "1.5px solid rgba(255,255,255,.28)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4 }, svg("ellipsis", 32, "#fff", 2.8));
    const num = el(t0, { position: "absolute", left: 12, top: 12, width: 54, height: 54, borderRadius: "50%", background: limeFill(1), color: K.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 30, boxShadow: `0 6px 16px rgba(0,0,0,.45), ${GLOW_A(0.5)}`, zIndex: 5 }, String(i + 1));
    gsap.set(num, { scale: 0, opacity: 0 });
    return { t0, dt, num, x, y };
  };
  const tiles = ids.map((id, i) => mkTile(id, i, ["0:24", "0:31", "0:18", "0:42"][i % 4]));
  const VOCI = o.voci || [["pencil", "Modifica", "#ffffff"], ["copy", "Duplica", "#ffffff"], ["trash-2", "Elimina", "#ff453a"]];
  const shH = 46 + VOCI.length * 112 + 44;
  const dim = el(S, { position: "absolute", left: 0, top: 0, width: W, height: H, background: "rgba(0,0,0,.5)", opacity: 0, zIndex: 19 });
  const sheet = el(S, { position: "absolute", left: 0, top: H - shH, width: W, height: shH, borderRadius: "34px 34px 0 0", background: "linear-gradient(180deg,#2c2c2e,#1f1f21)", boxShadow: "0 -24px 60px rgba(0,0,0,.65), inset 0 1.5px 0 rgba(255,255,255,.08)", zIndex: 20 });
  el(sheet, { position: "absolute", left: W / 2 - 32, top: 14, width: 64, height: 6, borderRadius: 3, background: "rgba(255,255,255,.3)" });
  const rows = VOCI.map(([ic, lab, c], k) => {
    const r = el(sheet, { position: "absolute", left: 16, top: 46 + k * 112, width: W - 32, height: 100, borderRadius: 24, background: "rgba(255,255,255,.04)", border: "2px solid rgba(207,251,80,0)", zIndex: 1 });
    const a = el(r, { position: "absolute", left: 28, top: 0, height: 100, display: "flex", alignItems: "center", gap: 24, fontFamily: FS, fontSize: 33, fontWeight: 800, color: c, whiteSpace: "nowrap" }, svg(ic, 40, c, 2.2) + lab);
    const b = el(r, { position: "absolute", left: 28, top: 0, height: 100, display: "flex", alignItems: "center", gap: 24, fontFamily: FS, fontSize: 33, fontWeight: 800, color: K.lime, textShadow: GLOW_LT, opacity: 0, whiteSpace: "nowrap" }, svg(ic, 40, K.lime, 2.4) + lab);
    return { r, a, b };
  });
  gsap.set(sheet, { y: shH + 40 });
  return Object.assign(P, {
    tiles, sheet, rows,
    dots: (i) => P.at(tiles[i].x + tw - 12 - 28, tiles[i].y + 12 + 28),
    tileXY: (i) => P.at(tiles[i].x + tw / 2, tiles[i].y + th / 2),
    row: (k) => P.at(W / 2, H - shH + 46 + k * 112 + 50),
    rowEl: (k) => rows[k].r,
    // centro della scritta della riga k (per la lente): { x, y } nel mondo + { fx, fy } nella riga
    rowLabel: (k) => { const fx = 28 + 40 + 24 + Math.round(VOCI[k][1].length * 33 * 0.28), fy = 50, p = P.at(16 + fx, H - shH + 46 + k * 112 + fy); return { x: p[0], y: p[1], fx, fy }; },
    tileRect: (i) => { const a = P.at(tiles[i].x, tiles[i].y), b = P.at(tiles[i].x + tw, tiles[i].y + th); return [a[0], a[1], b[0], b[1]]; },
    sheetRect: () => { const a = P.at(0, H - shH), b = P.at(W, H); return [a[0], a[1], b[0], b[1]]; },
    menu: (t) => { tl.to(dim, { opacity: 1, duration: 0.25 }, t); tl.to(sheet, { y: 0, duration: 0.45, ease: "expo.out" }, t); },
    pick: (k, t) => {
      tl.to(rows[k].r, { backgroundColor: "rgba(255,255,255,.1)", borderColor: "rgba(207,251,80,.9)", boxShadow: GLOW_A(0.4), duration: 0.15 }, t);
      tl.to(rows[k].b, { opacity: 1, duration: 0.15 }, t);
      tl.to(rows[k].a, { opacity: 0, duration: 0.15 }, t);
    },
    closeMenu: (t) => { tl.to(sheet, { y: shH + 40, duration: 0.3, ease: "power2.in" }, t); tl.to(dim, { opacity: 0, duration: 0.25 }, t); },
    // la bozza 0 si divide come una cellula: lampo sulla cucitura, la copia (video idCopia) scivola nello slot successivo
    // accanto (in coda, blocco 1 del rifacimento): con altre bozze già in griglia la copia nasce nello slot 1, accanto alla
    // bozza 0, e le altre scivolano di uno slot (come in Instagram); default di prima: la copia va nel primo slot libero
    duplicate: (t, idCopia, accanto) => {
      const k = accanto ? 1 : tiles.length, c = mkTile(idCopia, k, "0:24");
      if (accanto) {
        tiles.slice(1).forEach((x, i) => { const [nx, ny] = slot(i + 2); tl.to(x.t0, { x: nx - x.x, y: ny - x.y, duration: 0.4, ease: "power2.inOut" }, t); });
        tiles.splice(1, 0, c);
      } else tiles.push(c);
      gsap.set(c.t0, { x: -(tw + g), opacity: 0 });
      const seam = el(S, { position: "absolute", left: tiles[0].x + tw - 18, top: tiles[0].y, width: 36, height: th, borderRadius: 18, background: "radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0))", opacity: 0, zIndex: 6 });
      tl.to(tiles[0].t0, { scaleX: 0.92, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" }, t);
      tl.set(seam, { opacity: 1, scaleY: 0.5 }, t + 0.02);
      tl.to(seam, { opacity: 0, scaleY: 1.3, duration: 0.45, ease: "power2.out" }, t + 0.02);
      tl.set(c.t0, { opacity: 1 }, t);
      tl.to(c.t0, { x: 0, duration: 0.5, ease: "back.out(1.4)" }, t);
      [tiles[0], c].forEach((x, i) => tl.to(x.num, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, t + 0.3 + i * 0.08));
      return c;
    },
  });
};

// ═══ U11 · "Nuovo reel": didascalia, opzioni e la riga "Reel di prova" con l'interruttore ═════════════════════════
// id: video del reel · o: { z, prova (titolo), sotto } · .trial(t) accende interruttore e riga · .swXY() centro
// dell'interruttore · .share() centro di "Condividi" · .save() centro di "Salva bozza" · .press("share"|"save", t)
// .trialRect() · .reset(t) torna spento (per la seconda bozza)
const igShare = (parent, X, Y, id, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw, H = PH.sh;
  el(S, { position: "absolute", left: 16, top: 66, width: 40, height: 40 }, svg("chevron-left", 38, "#fff", 2.4));
  el(S, { position: "absolute", left: 0, top: 70, width: W, textAlign: "center", fontFamily: FS, fontSize: 30, fontWeight: 800, color: "#fff" }, "Nuovo reel");
  const th = el(S, { position: "absolute", left: 24, top: 134, width: 184, height: 327, borderRadius: 16, overflow: "hidden", background: "#111", border: "1.5px solid rgba(255,255,255,.16)" });
  mediaTile(th, 0, 0, 184, 327, id, 1);
  el(th, { position: "absolute", left: 0, bottom: 0, width: 184, height: 60, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6))", zIndex: 2 });
  el(th, { position: "absolute", left: 0, bottom: 12, width: 184, textAlign: "center", fontFamily: FS, fontWeight: 700, fontSize: 19, color: "#fff", zIndex: 3 }, "Modifica copertina");
  el(S, { position: "absolute", left: 232, top: 146, width: 278, fontFamily: FS, fontSize: 25, lineHeight: 1.35, color: "rgba(255,255,255,.5)" }, "Scrivi una didascalia e aggiungi hashtag…");
  const chips = el(S, { position: "absolute", left: 232, top: 262, display: "flex", gap: 10 });
  ["# Hashtag", "@ Tag"].forEach((x) => el(chips, { padding: "9px 16px", borderRadius: 12, background: "#2a2a2c", fontFamily: FS, fontWeight: 700, fontSize: 20, color: "#fff", whiteSpace: "nowrap" }, x, "span"));
  el(S, { position: "absolute", left: 24, top: 490, width: W - 48, height: 1.5, background: "rgba(255,255,255,.1)" });
  [["users", "Tagga persone"], ["map-pin", "Aggiungi luogo"], ["eye", "Pubblico", "Tutti"]].forEach(([ic, t1, t2], k) => {
    const y = 506 + k * 92;
    el(S, { position: "absolute", left: 26, top: y + 26, width: 40, height: 40 }, svg(ic, 34, "#fff", 2));
    el(S, { position: "absolute", left: 86, top: y + 30, fontFamily: FS, fontSize: 26, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }, t1);
    el(S, { position: "absolute", right: 26, top: y + 30, display: "flex", alignItems: "center", gap: 6, fontFamily: FS, fontSize: 23, fontWeight: 600, color: "rgba(255,255,255,.5)", whiteSpace: "nowrap" }, (t2 || "") + svg("chevron-right", 26, "rgba(255,255,255,.5)", 2.2));
  });
  // la riga "Reel di prova"
  const ry = 788, rh = 132;
  const row = el(S, { position: "absolute", left: 16, top: ry, width: W - 32, height: rh, borderRadius: 26, background: "rgba(255,255,255,.05)", border: "2px solid rgba(255,255,255,.1)", boxShadow: "0 0 0px rgba(207,251,80,0)" });
  const fl = el(row, { position: "absolute", left: 20, top: (rh - 70) / 2, width: 70, height: 70, borderRadius: "50%", background: "#2c2c2e", display: "flex", alignItems: "center", justifyContent: "center" }, svg("flask-conical", 36, "#fff", 2.2));
  const flOn = el(fl, { position: "absolute", left: 0, top: 0, width: 70, height: 70, borderRadius: "50%", background: limeFill(1), display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, boxShadow: GLOW_A(0.6) }, svg("flask-conical", 36, K.ink, 2.4));
  el(row, { position: "absolute", left: 110, top: 30, fontFamily: FS, fontSize: 30, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }, o.prova || "Reel di prova");
  el(row, { position: "absolute", left: 110, top: 74, fontFamily: FS, fontSize: 21, fontWeight: 500, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap" }, o.sotto || "Solo per chi non ti segue");
  const sw = iosSwitch(row, W - 32 - 22 - 88, (rh - 54) / 2);
  // bottoni
  const by = H - 132;
  const save = el(S, { position: "absolute", left: 24, top: by, width: 230, height: 92, borderRadius: 22, background: "#2c2c2e", border: "2px solid rgba(255,255,255,0)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FS, fontSize: 26, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }, svg("save", 28, "#fff", 2.2) + "Salva bozza");
  const share = el(S, { position: "absolute", left: 270, top: by, width: W - 294, height: 92, borderRadius: 22, background: K.ig, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontSize: 28, fontWeight: 800, color: "#fff", boxShadow: "0 0 0px rgba(74,93,249,0)" }, "Condividi");
  const SWX = 16 + (W - 32 - 22 - 88) + 44, SWY = ry + rh / 2;
  return Object.assign(P, {
    row, sw, thumb: th,
    thumbXY: () => P.at(24 + 92, 134 + 163),
    backXY: () => P.at(36, 86),
    swXY: () => P.at(SWX, SWY),
    share: () => P.at(270 + (W - 294) / 2, by + 46),
    save: () => P.at(24 + 115, by + 46),
    trialRect: () => { const a = P.at(16, ry), b = P.at(W - 16, ry + rh); return [a[0], a[1], b[0], b[1]]; },
    trial: (t) => {
      sw.on(t);
      tl.to(row, { borderColor: "rgba(207,251,80,.85)", backgroundColor: "rgba(255,255,255,.08)", boxShadow: GLOW_A(0.35), duration: 0.25 }, t);
      tl.to(flOn, { opacity: 1, duration: 0.2 }, t);
    },
    reset: (t) => {
      tl.set(sw.kn, { x: 0 }, t);
      tl.set(sw.tr, { backgroundColor: "#3a3a3c", boxShadow: "0 0 0px rgba(207,251,80,0), 0 0 0px rgba(207,251,80,0)" }, t);
      tl.set(row, { borderColor: "rgba(255,255,255,.1)", backgroundColor: "rgba(255,255,255,.05)", boxShadow: "0 0 0px rgba(207,251,80,0)" }, t);
      tl.set(flOn, { opacity: 0 }, t);
    },
    press: (which, t) => {
      const b = which === "save" ? save : share;
      tl.to(b, { scale: 0.95, duration: 0.07, ease: "power2.out" }, t);
      tl.to(b, { scale: 1, duration: 0.25, ease: "back.out(3)" }, t + 0.08);
      if (which === "save") tl.to(save, { borderColor: "rgba(207,251,80,.9)", boxShadow: GLOW_A(0.4), duration: 0.15 }, t);
      else tl.to(share, { boxShadow: "0 0 40px rgba(74,93,249,.85)", duration: 0.15 }, t);
    },
  });
};

// toast di Instagram (pill lime che scende e poi risale) · parent di solito P.screen · .show(t, dur)
const igToast = (parent, cx, y, html, o) => {
  o = o || {};
  const w = o.w || 380, h = o.h || 80;
  const b = el(parent, { position: "absolute", left: cx - w / 2, top: y, width: w, height: h, borderRadius: h / 2, background: limeFill(1), color: K.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: FS, fontSize: 29, fontWeight: 800, boxShadow: `0 14px 40px rgba(0,0,0,.5), ${GLOW_A(0.6)}`, zIndex: o.z || 40, whiteSpace: "nowrap" }, svg(o.icon || "check", 32, K.ink, 3) + html);
  gsap.set(b, { y: -150, opacity: 0 });
  return { b, show: (t, dur) => { tl.to(b, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(2)" }, t); tl.to(b, { y: -150, opacity: 0, duration: 0.3, ease: "power2.in" }, t + (dur || 1.0)); } };
};

// lente d'ingrandimento (vecchio stile): arriva su un elemento e lo mostra davvero ingrandito dentro (una copia dell'elemento)
// x, y = punto del mondo su cui si centra · target = l'elemento (es. drafts.rowEl(1)) · o: { fx, fy (lo stesso punto in
// coordinate dell'elemento, default il centro), r, k (ingrandimento), bg } — per le righe delle bozze: drafts.rowLabel(k)
// .show(t) · .hide(t) · .copy = la copia ingrandita (per animarla insieme all'originale)
const lens = (parent, x, y, target, o) => {
  o = o || {};
  const R = o.r || 150, k = o.k || 1.55;
  const g = layered(el(parent, { position: "absolute", left: x - R, top: y - R, width: R * 2, height: R * 2, zIndex: o.z || 85, pointerEvents: "none" }));
  g.setAttribute("data-layout-allow-occlusion", "");
  el(g, { position: "absolute", left: R * 1.38, top: R * 1.62, width: R * 0.36, height: R * 1.15, borderRadius: R * 0.18, background: "linear-gradient(90deg,#8d9097,#eceef2 45%,#9a9ca3)", transform: "rotate(-40deg)", transformOrigin: "50% 0%", boxShadow: "0 12px 26px rgba(0,0,0,.55)" });
  const glassC = el(g, { position: "absolute", left: 0, top: 0, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", background: o.bg || "#242426", boxShadow: "0 24px 60px rgba(0,0,0,.6)" });
  const copy = target.cloneNode(true);
  const tw = parseFloat(target.style.width) || 400, th = parseFloat(target.style.height) || 100;
  const fx = o.fx == null ? tw / 2 : o.fx, fy = o.fy == null ? th / 2 : o.fy; // punto dell'elemento che va al centro della lente
  Object.assign(copy.style, { left: R - fx + "px", top: R - fy + "px", transform: `scale(${k})`, transformOrigin: `${fx}px ${fy}px` });
  glassC.appendChild(copy);
  // la copia ingrandita sta sopra all'originale apposta: lo dichiariamo al controllo del layout (copia e originale)
  [copy, ...copy.querySelectorAll("*"), target, ...target.querySelectorAll("*")].forEach((n) => n.setAttribute("data-layout-allow-overlap", ""));
  el(g, { position: "absolute", left: 0, top: 0, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 32% 26%, rgba(255,255,255,.32) 0%, rgba(255,255,255,.06) 32%, rgba(255,255,255,0) 52%)" });
  el(g, { position: "absolute", left: -7, top: -7, width: R * 2 + 14, height: R * 2 + 14, borderRadius: "50%", border: `${Math.round(R * 0.1)}px solid #e7e9ee`, boxShadow: "inset 0 0 18px rgba(0,0,0,.35), 0 0 0 2px rgba(0,0,0,.25)" });
  gsap.set(g, { x: 420, y: 160, opacity: 0, rotation: 12 });
  return {
    g, copy,
    show: (t) => { tl.to(g, { opacity: 1, duration: 0.15 }, t); tl.to(g, { x: 0, y: 0, rotation: 0, duration: 0.42, ease: "power3.out" }, t); },
    hide: (t) => tl.to(g, { x: 460, y: 120, opacity: 0, duration: 0.35, ease: "power2.in" }, t),
  };
};

// ═══ U02 · profilo Instagram v2 (reel 3 e 9 di Kallaway) ══════════════════════════════════════════════════════
// Profilo in dark mode con la foto profilo vera, numeri (post · follower · seguiti) che contano e si possono mettere in
// una pill lime, nome e bio, bottoni, griglia di reel veri (3 colonne 3:4).
// o: { user (foto), handle, nome, bio: [righe], post, follower, seguiti, grid: [id video], blurStats, chiaro (il numero che
//      resta leggibile), mio (profilo tuo: lucchetto, + e menu), ring: "ig" | "lime", verificato, z }
// .count(t, campo, da, a, dur, fmt) campo = "post" | "follower" | "seguiti" · .pill(t, campo) · .hl(t, parte) riquadro lime su
// "header" | "bio" | "bottoni" | "griglia" · .follow(t) · .followXY() · .cellXY(i) · .partRect(parte) · .rect
const igProfile = (parent, X, Y, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw;
  if (o.mio) {
    el(S, { position: "absolute", left: 24, top: 66, display: "flex", alignItems: "center", gap: 8, fontFamily: FS, fontSize: 30, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }, svg("lock", 24, "#fff", 2.4) + (o.handle || "") + svg("chevron-down", 24, "#fff", 2.6));
    el(S, { position: "absolute", right: 22, top: 68, display: "flex", gap: 24 }, svg("square-plus", 32, "#fff", 2) + svg("menu", 32, "#fff", 2));
  } else {
    el(S, { position: "absolute", left: 14, top: 64, width: 40, height: 40 }, svg("chevron-left", 38, "#fff", 2.4));
    const hd = el(S, { position: "absolute", left: 0, top: 68, width: W, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontFamily: FS, fontSize: 28, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }, o.handle || "");
    if (o.verificato) el(hd, { display: "inline-flex", width: 24, height: 24, borderRadius: "50%", background: "#3897f0", alignItems: "center", justifyContent: "center" }, svg("check", 16, "#fff", 3.4), "span");
    el(S, { position: "absolute", right: 20, top: 68, display: "flex", gap: 22 }, svg("bell", 30, "#fff", 2) + svg("ellipsis", 30, "#fff", 2.4));
  }
  const AX = 98, AY = 212, AD = 150;
  const ring = el(S, { position: "absolute", left: AX - AD / 2 - 6, top: AY - AD / 2 - 6, width: AD + 12, height: AD + 12, borderRadius: "50%", background: o.ring === "lime" ? `linear-gradient(135deg,#efffb8,${K.lime} 50%,#a6d136)` : "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)", padding: 5 });
  const inner = el(ring, { width: "100%", height: "100%", borderRadius: "50%", background: "#000", padding: 4 });
  const face = el(inner, { width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", position: "relative", background: "#333" });
  if (o.user) imgIn(face, "av-" + o.user, { objectFit: "cover" });
  const KEYS = [["post", o.post || "184", "post"], ["follower", o.follower || "63K", "follower"], ["seguiti", o.seguiti || "2", "seguiti"]];
  const stat = {};
  KEYS.forEach(([key, v, lab], k) => {
    const cx0 = 252 + k * 104;
    const box = el(S, { position: "absolute", left: cx0 - 60, top: 162, width: 120, textAlign: "center", fontFamily: FS, color: "#fff", zIndex: 4 });
    const pill = el(box, { position: "absolute", left: -6, top: -6, width: 132, height: 86, borderRadius: 16, background: limeFill(1), boxShadow: GLOW_A(0.8), opacity: 0, zIndex: 0 });
    const num = el(box, { position: "relative", fontSize: 32, fontWeight: 800, lineHeight: 1.4, filter: o.blurStats && key !== o.chiaro ? "blur(7px)" : "none", zIndex: 1, whiteSpace: "nowrap" }, v);
    const lb = el(box, { position: "relative", fontSize: 20, color: "rgba(255,255,255,.7)", zIndex: 1 }, lab);
    stat[key] = { box, pill, num, lb };
  });
  el(S, { position: "absolute", left: 24, top: 302, fontFamily: FS, fontSize: 25, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }, o.nome || "");
  (o.bio || []).forEach((r, i) => el(S, { position: "absolute", left: 24, top: 338 + i * 30, width: W - 48, fontFamily: FS, fontSize: 22, color: "rgba(255,255,255,.88)", whiteSpace: "nowrap", overflow: "hidden" }, r));
  const BY = 338 + Math.max(1, (o.bio || []).length) * 30 + 18;
  const fol = el(S, { position: "absolute", left: 24, top: BY, width: 214, height: 56, borderRadius: 14, background: K.ig, overflow: "hidden", fontFamily: FS });
  el(fol, { position: "absolute", left: 0, top: 0, width: 214, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23, fontWeight: 800, color: "#fff" }, o.mio ? "Modifica" : "Segui");
  const folOn = el(fol, { position: "absolute", left: 0, top: 0, width: 214, height: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 23, fontWeight: 800, color: K.ink, background: limeFill(1), opacity: 0 }, "Segui già" + svg("check", 22, K.ink, 3.2));
  el(S, { position: "absolute", left: 248, top: BY, width: 214, height: 56, borderRadius: 14, background: "#2c2c2e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FS, fontSize: 23, fontWeight: 800, color: "#fff" }, o.mio ? "Condividi" : "Messaggio");
  el(S, { position: "absolute", left: 472, top: BY, width: 56, height: 56, borderRadius: 14, background: "#2c2c2e", display: "flex", alignItems: "center", justifyContent: "center" }, svg("user-plus", 26, "#fff", 2.2));
  const TY = BY + 76;
  const tabs = el(S, { position: "absolute", left: 0, top: TY, width: W, height: 50, display: "flex" });
  ["grid-3x3", "clapperboard", "square-user"].forEach((n, k) => el(tabs, { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: k === 0 ? "2.5px solid #fff" : "1px solid rgba(255,255,255,.14)" }, svg(n, 27, k === 0 ? "#fff" : "rgba(255,255,255,.45)", 2)));
  const GY = TY + 52, cw = (W - 4) / 3, ch = Math.round((cw * 4) / 3);
  const cells = (o.grid || []).map((id, i) => {
    const x = (i % 3) * (cw + 2), y = GY + Math.floor(i / 3) * (ch + 2);
    const c = el(S, { position: "absolute", left: x, top: y, width: cw, height: ch, overflow: "hidden", background: "#1a1a1a", zIndex: 2 });
    if (id) videoTile(c, 0, 0, cw, ch, id, 1);
    return { c, x, y };
  });
  const parts = { header: [8, 116, W - 8, 296], bio: [12, 296, W - 12, BY - 8], bottoni: [12, BY - 6, W - 12, BY + 62], griglia: [2, GY, W - 2, Math.min(PH.sh - 4, GY + ch * 2 + 6)] };
  const partRect = (k) => { const r = parts[k], a = P.at(r[0], r[1]), b = P.at(r[2], r[3]); return [a[0], a[1], b[0], b[1]]; };
  return Object.assign(P, {
    stat, cells, rect: [X - 10, Y - 10, X + PH.w + 10, Y + PH.h + 10], partRect,
    cellXY: (i) => P.at(cells[i].x + cw / 2, cells[i].y + ch / 2),
    count: (t, key, from, to, dur, fmt, ease) => {
      const n = stat[key].num, V = { v: from }, f = fmt || ((v) => itNum(v));
      tl.to(V, { v: to, duration: dur || 0.9, ease: ease || "power1.out", onUpdate: () => (n.textContent = f(V.v)) }, t);
    },
    pill: (t, key) => {
      const s = stat[key];
      tl.to(s.pill, { opacity: 1, duration: 0.15 }, t);
      tl.fromTo(s.pill, { scale: 0.6 }, { scale: 1, duration: 0.35, ease: "back.out(2.6)", immediateRender: false }, t);
      tl.to([s.num, s.lb], { color: K.ink, duration: 0.15 }, t);
      tl.to(s.num, { filter: "blur(0px)", duration: 0.2 }, t);
    },
    hl: (t, k, o2) => highlight(S, parts[k][0], parts[k][1], parts[k][2] - parts[k][0], parts[k][3] - parts[k][1], t, Object.assign({ r: 14 }, o2 || {})),
    follow: (t) => { tl.to(folOn, { opacity: 1, duration: 0.2 }, t); tl.fromTo(fol, { scale: 0.94 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t); },
    followXY: () => P.at(24 + 107, BY + 28),
  });
};

// ═══ scheda profilo (reel 9 di Kallaway): vetro scuro con foto profilo vera, @handle, numero in una pill lime e tre reel veri ═══
// o: { user, handle, numero ("132K follower"), vids: [3 id], w, z } · .show(t) · .rect
const profileCard = (parent, cx, top, o) => {
  o = o || {};
  const w = o.w || 760, pad = 34, tw = (w - pad * 2 - 2 * 20) / 3, th = Math.round((tw * 16) / 9), h = 480 + th;
  const c = glass(parent, cx - w / 2, top, w, h, { zIndex: o.z || 12, borderRadius: 34 });
  const ad = 190;
  const av = el(c, { position: "absolute", left: w / 2 - ad / 2, top: 40, width: ad, height: ad, borderRadius: "50%", overflow: "hidden", border: `5px solid ${K.lime}`, boxShadow: `${GLOW_A(0.6)}, 0 14px 30px rgba(0,0,0,.5)` });
  if (o.user) imgIn(av, "av-" + o.user, { objectFit: "cover" });
  const hd = el(c, { position: "absolute", left: 0, top: 252, width: w, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: 44, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, o.handle || "");
  const pl = el(c, { position: "absolute", left: w / 2 - 230, top: 322, width: 460, height: 92, borderRadius: 18, background: limeFill(1), boxShadow: GLOW_A(0.8), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 52, color: K.ink, whiteSpace: "nowrap" }, o.numero || "");
  const vids = (o.vids || []).map((id, i) => {
    const v = el(c, { position: "absolute", left: pad + i * (tw + 20), top: 446, width: tw, height: th, borderRadius: 16, overflow: "hidden", background: "#111", border: "1.5px solid rgba(255,255,255,.2)" });
    videoTile(v, 0, 0, tw, th, id, 1);
    return v;
  });
  gsap.set(c, { opacity: 0 });
  return {
    c, pl, rect: [cx - w / 2 - 10, top - 10, cx + w / 2 + 10, top + h + 10],
    show: (t) => {
      blurIn(c, t, { y: 34, blur: 14, dur: 0.45, scale: 0.97 });
      blurIn(av, t + 0.12, { y: 0, blur: 12, scale: 0.7, dur: 0.4, ease: "back.out(2)" });
      blurIn(hd, t + 0.22, { y: 10, blur: 8, dur: 0.3 });
      tl.fromTo(pl, { scaleX: 0.04 }, { scaleX: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, t + 0.32);
      vids.forEach((v, i) => blurIn(v, t + 0.4 + i * 0.07, { y: 24, blur: 12, dur: 0.38 }));
    },
  };
};

// ═══ O25 · lavagna bianca vera (reel 20 di Kallaway) ══════════════════════════════════════════════════════════════════
// Superficie bianca lucida (riflesso diagonale), cornice d'alluminio con gli angoli scuri, staffe in alto e vassoio dei pennarelli;
// entra da destra in corsa (.show); i pannelli neri (uno per voce) compaiono uno alla volta col numero, il nome scritto a macchina e
// un reel vero dentro (.panel(i, t)). .panelRect(i) per far correre la camera pannello per pannello (move/frameRect).
// voci: [{t: "Insegna", media: id video | "th-…"}] · o: { pw (300), ph (520), gap (34), pad (46), z }
const whiteboard = (parent, cx, cy, voci, o) => {
  o = o || {};
  const n = voci.length, pw = o.pw || 300, ph = o.ph || 520, g = o.gap || 34, pad = o.pad || 46, z = o.z || 11;
  const W = n * pw + (n - 1) * g + pad * 2, H = ph + pad * 2, x0 = cx - W / 2, y0 = cy - H / 2;
  const box = layered(el(parent, { position: "absolute", left: x0, top: y0, width: W, height: H, zIndex: z }));
  // cornice d'alluminio + superficie
  el(box, { position: "absolute", left: -16, top: -16, width: W + 32, height: H + 32, borderRadius: 14, background: "linear-gradient(180deg,#e9eaec 0%,#b7b9bd 45%,#8f9196 55%,#d4d6da 100%)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 1.5px 0 rgba(255,255,255,.9)" });
  const surf = el(box, { position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: 6, overflow: "hidden", background: "linear-gradient(160deg,#ffffff 0%,#f4f5f2 55%,#e8e9e5 100%)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)" });
  el(surf, { position: "absolute", left: -W * 0.2, top: -H * 0.5, width: W * 0.35, height: H * 2.2, transform: "rotate(24deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.8), rgba(255,255,255,0))", opacity: 0.6 });
  [[-16, -16], [W - 4, -16], [-16, H - 4], [W - 4, H - 4]].forEach(([x, y]) => el(box, { position: "absolute", left: x, top: y, width: 20, height: 20, borderRadius: 5, background: "linear-gradient(180deg,#5a5c60,#2c2d30)" }));
  [W * 0.12, W * 0.88].forEach((x) => el(box, { position: "absolute", left: x - 12, top: -34, width: 24, height: 22, borderRadius: "6px 6px 2px 2px", background: "linear-gradient(180deg,#c9cbcf,#86888d)" }));
  el(box, { position: "absolute", left: W * 0.3, top: H + 14, width: W * 0.4, height: 16, borderRadius: 6, background: "linear-gradient(180deg,#d9dbdf,#8f9196)", boxShadow: "0 8px 16px rgba(0,0,0,.4)" });
  el(box, { position: "absolute", left: W * 0.34, top: H + 6, width: 90, height: 12, borderRadius: 6, background: "linear-gradient(90deg,#1e1e1e 0 70%, #CFFB50 70% 100%)" });
  const panels = voci.map((v, i) => {
    const px = pad + i * (pw + g), py = pad;
    const p = el(box, { position: "absolute", left: px, top: py, width: pw, height: ph, borderRadius: 18, background: "linear-gradient(180deg,#151515,#0b0b0b)", boxShadow: "0 10px 24px rgba(0,0,0,.35)", overflow: "hidden", zIndex: 2 });
    const num = el(p, { position: "absolute", left: 0, top: 18, width: pw, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: 54, lineHeight: 1, color: K.white, textShadow: GLOW_T }, String(i + 1));
    const nm = el(p, { position: "absolute", left: 0, top: 84, width: pw, textAlign: "center", fontFamily: FS, fontWeight: 800, fontSize: o.fs || 34, color: K.white, whiteSpace: "nowrap" });
    const mw = pw - 44, mh = Math.min(ph - 170, Math.round((mw * 16) / 9));
    const med = el(p, { position: "absolute", left: 22, top: 146, width: mw, height: mh, borderRadius: 14, overflow: "hidden", background: "#222", border: "1.5px solid rgba(255,255,255,.18)" });
    if (v.media) mediaTile(med, 0, 0, mw, mh, v.media, 1);
    gsap.set(p, { opacity: 0, scale: 0.9 });
    gsap.set([num, med], { opacity: 0 });
    return { p, num, nm, med, x: x0 + px, y: y0 + py, t: v.t };
  });
  gsap.set(box, { opacity: 0 });
  return {
    box, panels, W, H, rect: [x0 - 40, y0 - 50, x0 + W + 40, y0 + H + 50],
    panelRect: (i) => [panels[i].x - 30, panels[i].y - 30, panels[i].x + pw + 30, panels[i].y + ph + 30],
    show: (t) => {
      tl.fromTo(box, { opacity: 0, x: 900 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, t);
      panels.forEach((pn, i) => tl.to(pn.p, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, t + 0.45 + i * 0.2));
    },
    // il pannello i si attiva: numero, nome a macchina, reel vero dentro
    panel: (i, t) => {
      const pn = panels[i];
      tl.to(pn.num, { opacity: 1, duration: 0.15 }, t);
      typeIn(pn.nm, pn.t, t + 0.1, 24, { size: o.fs || 34 });
      tl.fromTo(pn.med, { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out", immediateRender: false }, t + 0.25);
      tl.set(pn.med, { filter: "none" }, t + 0.66);
      tl.fromTo(pn.p, { boxShadow: `0 10px 24px rgba(0,0,0,.35), 0 0 0 4px ${K.lime}` }, { boxShadow: "0 10px 24px rgba(0,0,0,.35), 0 0 0 0px rgba(207,251,80,0)", duration: 0.8, immediateRender: false }, t);
    },
  };
};

// ═══ O25 · tablet (reel 74 di Kallaway) ═══════════════════════════════════════════════════════════════════════════════
// Cornice nera sottile con il bordo in luce, schermo 3:4 scuro; ci si mettono dentro griglie, collezioni, UI (P.screen).
// .at(x, y) = punto dello schermo nel parent · o: { w (760), h (1010), z }
const tablet = (parent, X, Y, o) => {
  o = o || {};
  const w = o.w || 760, h = o.h || 1010, bz = 22;
  const frame = el(parent, { position: "absolute", left: X, top: Y, width: w, height: h, borderRadius: 46, background: "linear-gradient(150deg,#3a3a3a 0%,#141414 35%,#0b0b0b 70%,#2a2a2a 100%)", boxShadow: "0 50px 110px rgba(0,0,0,.65), inset 0 0 0 2px rgba(255,255,255,.12)", zIndex: o.z || 12 });
  const screen = el(frame, { position: "absolute", left: bz, top: bz, width: w - 2 * bz, height: h - 2 * bz, borderRadius: 26, background: "#0d0d0d", overflow: "hidden" });
  el(frame, { position: "absolute", left: w / 2 - 6, top: 7, width: 12, height: 12, borderRadius: "50%", background: "#050505", boxShadow: "inset 0 0 0 2px #1d1d1d" });
  return { frame, screen, X, Y, sw: w - 2 * bz, sh: h - 2 * bz, rect: [X - 10, Y - 10, X + w + 10, Y + h + 10], at: (x, y) => [X + bz + x, Y + bz + y] };
};

// ═══ A07 · Approfondimenti sul reel (reel 110 di Kallaway) ════════════════════════════════════════════════════════════
// Telefono con la schermata "Approfondimenti sul reel" di Instagram (dark mode): copertina del reel, visualizzazioni che contano,
// grafico della fidelizzazione con la curva che si disegna (lime, con l'alone), tasso di skip. È già in scena al fotogramma 0 (hook):
// la curva e i numeri partono quando il titolo si scrive. o: { media (id), views: [da, a], skip ("38%"), punti, z }
// → { P (phone2), count(t, dur), curve(t, dur), skipOn(t), rect, chartRect() }
const igInsights = (parent, X, Y, o) => {
  o = o || {};
  const P = phone2(parent, X, Y, o);
  const S = P.screen, W = PH.sw;
  el(S, { position: "absolute", left: 16, top: 66, width: 40, height: 40 }, svg("chevron-left", 38, "#fff", 2.4));
  el(S, { position: "absolute", left: 0, top: 70, width: W, textAlign: "center", fontFamily: FS, fontSize: 27, fontWeight: 800, color: "#fff" }, "Approfondimenti sul reel");
  const th = el(S, { position: "absolute", left: 24, top: 130, width: 120, height: 213, borderRadius: 12, overflow: "hidden", background: "#222", border: "1.5px solid rgba(255,255,255,.16)" });
  if (o.media) mediaTile(th, 0, 0, 120, 213, o.media, 1);
  el(S, { position: "absolute", left: 164, top: 140, width: W - 188, fontFamily: FS, fontSize: 21, lineHeight: 1.35, color: "rgba(255,255,255,.7)" }, o.didascalia || "Il trucco dei reel di prova…");
  el(S, { position: "absolute", left: 164, top: 238, fontFamily: FS, fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,.58)" }, o.data || "3 ott · Durata 0:38");
  el(S, { position: "absolute", left: 24, top: 372, width: W - 48, height: 1.5, background: "rgba(255,255,255,.1)" });
  el(S, { position: "absolute", left: 24, top: 386, fontFamily: FS, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,.6)" }, "Visualizzazioni");
  const vNum = el(S, { position: "absolute", left: 24, top: 436, fontFamily: FD, fontWeight: 700, fontSize: 76, lineHeight: 1, color: K.white, textShadow: GLOW_T, whiteSpace: "nowrap" }, itNum((o.views || [0, 0])[0]));
  const delta = el(S, { position: "absolute", right: 24, top: 438, padding: "8px 16px", borderRadius: 14, background: limeFill(1), boxShadow: GLOW_A(0.6), fontFamily: FS, fontWeight: 800, fontSize: 24, color: K.ink, whiteSpace: "nowrap" }, o.delta || "×2");
  gsap.set(delta, { opacity: 0, scale: 0.6 });
  // grafico della fidelizzazione
  const cx0 = 24, cy0 = 540, cw = W - 48, ch = 300;
  const card = el(S, { position: "absolute", left: cx0, top: cy0, width: cw, height: ch, borderRadius: 18, background: "#161618", border: "1px solid rgba(255,255,255,.08)" });
  el(card, { position: "absolute", left: 20, top: 16, fontFamily: FS, fontSize: 21, fontWeight: 700, color: "rgba(255,255,255,.75)" }, "Fidelizzazione");
  const Sv = svgIn(card, cw, ch);
  const gx0 = 24, gx1 = cw - 24, gy0 = 64, gy1 = ch - 34;
  [0, 0.5, 1].forEach((k) => pathEl(Sv, `M${gx0} ${gy0 + (gy1 - gy0) * k} L${gx1} ${gy0 + (gy1 - gy0) * k}`, { stroke: "rgba(255,255,255,.08)", "stroke-width": 1.5, fill: "none" }));
  const pts = o.punti || [[0, 0.02], [0.06, 0.28], [0.14, 0.42], [0.3, 0.5], [0.5, 0.55], [0.75, 0.6], [1, 0.66]];
  const d = "M" + pts.map(([u, v]) => `${(gx0 + (gx1 - gx0) * u).toFixed(1)} ${(gy0 + (gy1 - gy0) * v).toFixed(1)}`).join(" L");
  // o.colore: colore della curva (lime = buona; "#ffffff" per una curva che crolla, D04)
  const LC = o.colore || K.lime, LG = LC === K.lime ? "rgba(207,251,80,.8)" : "rgba(255,255,255,.75)";
  const glow = pathEl(Sv, d, { fill: "none", stroke: LC, "stroke-width": 16, opacity: 0.3, "stroke-linecap": "round", "stroke-linejoin": "round" });
  glow.style.filter = "blur(8px)";
  const line = pathEl(Sv, d, { fill: "none", stroke: LC, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" });
  line.style.filter = `drop-shadow(0 0 6px ${LG})`;
  drawable(glow); drawable(line);
  const skip = el(S, { position: "absolute", left: 24, top: cy0 + ch + 22, width: W - 48, height: 70, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", background: "#161618", border: "1px solid rgba(255,255,255,.08)", fontFamily: FS, fontSize: 23, fontWeight: 700, color: "rgba(255,255,255,.75)" }, `Tasso di skip<span style="font-family:${FD};font-size:34px;color:#fff">${o.skip || "38%"}</span>`);
  return Object.assign(P, {
    rect: [X - 10, Y - 10, X + PH.w + 10, Y + PH.h + 10],
    chartRect: () => { const a = P.at(cx0, cy0), b = P.at(cx0 + cw, cy0 + ch); return [a[0], a[1], b[0], b[1]]; },
    count: (t, dur, ease) => {
      const [a, b] = o.views || [0, 0], V = { v: a };
      tl.to(V, { v: b, duration: dur || 1, ease: ease || "power1.inOut", onUpdate: () => (vNum.textContent = itNum(V.v)) }, t);
      glowFlash(vNum, t + (dur || 1));
      tl.to(delta, { opacity: 1, duration: 0.1 }, t + (dur || 1) - 0.05);
      tl.to(delta, { scale: 1, duration: 0.4, ease: "back.out(2.6)" }, t + (dur || 1) - 0.05);
    },
    curve: (t, dur) => { drawOn(line, t, dur || 0.9, "power1.inOut"); drawOn(glow, t, dur || 0.9, "power1.inOut"); },
    skipOn: (t) => tl.to(skip, { borderColor: "rgba(207,251,80,.7)", boxShadow: GLOW_A(0.35), duration: 0.25 }, t),
    // D04 · il crollo (reel 18 di Kallaway): nel punto u della curva nasce un disco scuro col bordo bianco (0,2 s) che resta e
    // pulsa piano; sopra, su una linea guida, la pill con la causa (testo). → [x, y] del punto nel mondo
    crash: (t, u, testo) => {
      let k = 1;
      while (k < pts.length - 1 && pts[k][0] < u) k++;
      const [u0, v0] = pts[k - 1], [u1, v1] = pts[k], f = u1 === u0 ? 0 : (u - u0) / (u1 - u0), v = v0 + (v1 - v0) * Math.max(0, Math.min(1, f));
      const px = gx0 + (gx1 - gx0) * u, py = gy0 + (gy1 - gy0) * v;
      const dk = el(card, { position: "absolute", left: px - 36, top: py - 36, width: 72, height: 72, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, rgba(70,70,70,.85), rgba(20,20,20,.9))", border: "4px solid #ffffff", boxShadow: "0 0 18px rgba(255,255,255,.65), 0 0 46px rgba(255,255,255,.25)", opacity: 0, zIndex: 3 });
      // reel 18: nel punto del crollo si gonfia un disco pieno (qui bianco) che si spegne in ~0,5 s, poi resta il disco col bordo
      const bl = el(card, { position: "absolute", left: px - 120, top: py - 120, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,255,255,.5), rgba(255,255,255,.2) 68%, rgba(255,255,255,0))", opacity: 0, zIndex: 2 });
      tl.fromTo(bl, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.22, ease: "expo.out", immediateRender: false }, t);
      tl.to(bl, { opacity: 0, scale: 1.3, duration: 0.45, ease: "power2.in" }, t + 0.28);
      tl.fromTo(dk, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.2, ease: "expo.out", immediateRender: false }, t);
      tl.to(dk, { scale: 1.12, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: 3 }, t + 0.25);
      ripple(card, px, py, t + 0.02, { r: 60, s0: 0.5, s1: 1.9, w: 3, color: "#ffffff", glow: false, dur: 0.55, z: 3 });
      if (testo) {
        const lx = Math.max(20, Math.min(cw - 300, px - 150)), ly = 52;
        const ld = el(card, { position: "absolute", left: px - 1.5, top: ly + 46, width: 3, height: Math.max(0, py - 36 - (ly + 46)), background: "rgba(255,255,255,.8)", transformOrigin: "50% 0%", zIndex: 3 });
        const pl = el(card, { position: "absolute", left: lx, top: ly, width: 300, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#ffffff,#e6e6e6)", fontFamily: FS, fontWeight: 800, fontSize: 22, color: K.ink, whiteSpace: "nowrap", zIndex: 4 }, testo);
        tl.fromTo(ld, { scaleY: 0 }, { scaleY: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, t + 0.15);
        tl.fromTo(pl, { opacity: 0, y: 10, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2.2)", immediateRender: false }, t + 0.25);
      }
      return P.at(cx0 + px, cy0 + py);
    },
  });
};
