// ═══ KW kit v2 · RITMO — regole R1–R6 misurate su Kallaway (CATALOGO-ANIMAZIONI/_analisi/ritmo/RITMO.md) ══════════════
// Il cambio di comportamento (niente back.out) vale SOLO nelle composizioni che hanno il marcatore "KW_RITMO" nel sorgente
// (build.cjs → const KW_RITMO = true), come KW_FISSO al contrario. Senza il marcatore questo file aggiunge solo funzioni
// nuove e non cambia niente: verificato il 13/10 con le snapshot di demo-8 (differenza 0). I template (kit2-template.js)
// usano queste funzioni.

// ── safe zone dell'11/10 (SAFEZONE.jpg): da y = 1332 in giù c'è la faccia → con KW_RITMO fitPose / apertura / i template
// inquadrano sopra y = 1290 (nella shell la maschera di #safe sfuma tra 1288 e 1330, come nei reel 11–13) ──
if (KW_RITMO) BAND.y1 = 1290;

// ── R5 · niente rimbalzi ──
// Con KW_RITMO ogni ease "back.*" con parametro > 1,2 (senza parametro GSAP usa 1,7), scritta nel kit o nella composizione,
// diventa la curva morbida corrispondente (back.out → power2.out, back.in → power2.in, back.inOut → power2.inOut) con la
// stessa durata: i pop di scala del kit (back.out(2–3)) crescono senza passare oltre la misura. Resta solo il colpo voluto
// (timbro F12): back.out(≤ 1,2) oppure una funzione di ease. Kallaway: 67% dei movimenti di camera senza overshoot, 8 entrate
// di elementi su 8 senza rimbalzo visibile.
const senzaRimbalzo = (e) => {
  const m = /^back\.(out|inOut|in)(?:\(\s*([\d.]+)\s*\))?$/.exec(e);
  if (!m || (m[2] != null && +m[2] <= 1.2)) return e;
  return m[1] === "in" ? "power2.in" : m[1] === "inOut" ? "power2.inOut" : "power2.out";
};
if (KW_RITMO) [["to", 1], ["from", 1], ["fromTo", 2]].forEach(([m, k]) => {
  const f = tl[m].bind(tl);
  tl[m] = (...a) => {
    const v = a[k];
    if (v && typeof v.ease === "string") a[k] = Object.assign({}, v, { ease: senzaRimbalzo(v.ease) });
    return f(...a);
  };
});

// ── R5 · pop morbido (al posto dei pop con back.out) ──
// Opacità + scala da → 1 in 0,1–0,2 s con power2.out, senza rimbalzo. Misurati: badge views 0,66 → 1 in 0,13 s (reel 1),
// loghi in dissolvenza a scala piena in 0,13 s (reel 6). o: { da (scala iniziale, 0.8), dur (0.15), y (px di salita), stagger }
const popK = (target, t, o) => {
  o = o || {};
  const a = { opacity: 0, scale: o.da == null ? 0.8 : o.da }, b = { opacity: 1, scale: 1 };
  if (o.y) { a.y = o.y; b.y = 0; }
  gsap.set(target, a);
  tl.to(target, Object.assign(b, { duration: o.dur || 0.15, ease: "power2.out", stagger: o.stagger || 0 }), t);
};

// ── R4 · spinta: la deriva lunga, solo per un oggetto solo che si legge (termometro, documento) ──
// Reel 72: +9,6% in 2,4 s con power2.out, il contenuto scivola un po' verso il punto che conta (+78/+23 px), poi quasi fermo.
// o: { ds (0.09), dur (2.4), dx, dy (px schermo di cui si sposta la camera: negativi = il contenuto scivola a destra / in
//      basso), coda (s di coda quasi ferma dopo la spinta, 0 = nessuna), dsCoda (0.01), dxCoda, dyCoda }
const spinta = (t, o) => {
  o = o || {};
  const dur = o.dur || 2.4, s0 = CAM.s;
  camK(t, dur, CAM.fx + (o.dx || 0) / s0, CAM.fy + (o.dy || 0) / s0, s0 * (1 + (o.ds == null ? 0.09 : o.ds)), "power2.out");
  if (o.coda > 0.05) camK(t + dur, o.coda, CAM.fx + (o.dxCoda || 0) / CAM.s, CAM.fy + (o.dyCoda || 0) / CAM.s, CAM.s * (1 + (o.dsCoda == null ? 0.01 : o.dsCoda)), "sine.out");
};

// ── R2 + R3 · apertura di una scena sul suo rettangolo del mondo ──
// Al taglio (t0) la scena è già piena; parte subito UN movimento principale che frena forte, poi la camera tiene quasi ferma
// (deriva dell'1–2% che si spegne) fino a t1. Misure (RITMO.md §2): arrivo −112 px expo.out (reel 31), −160 px in 0,75 s
// (reel 98), −137 px expo.out (reel 65); zoom +16% in 0,35 s (reel 69), +15% in 0,4 s (reel 49); spinta +9,6% in 2,4 s (72).
// modo: "arrivo" (default) — la scena entra dal basso o di lato (dx, dy px schermo; default dy 140) in dur 0,7 s, expo.out
//       "zoom"   — si avvicina del ds (0.15) in dur 0,4 s, power2.out
//       "spinta" — R4, un oggetto solo che si legge; o.spinta = opzioni di spinta() (la coda arriva fino a t1)
//       "fermo"  — la camera sta ferma: il movimento principale è dell'oggetto (riempimento o conteggio dal primo fotogramma)
// o: { modo, top, bottom, fill (come fitPose), dx, dy, ds, dur, tenuta (zoom della tenuta, 0.012), blur (scia all'arrivo, 0),
//      posa (in coda, correzioni del blocco 1: una posa { fx, fy, s } già calcolata al posto di fitPose(rect), es. il telefono
//      nella proporzione di Kallaway; senza posa = come prima) }
// → la posa inquadrata { fx, fy, s }
const apertura = (t0, t1, rect, o) => {
  o = o || {};
  const p = o.posa || fitPose(rect[0], rect[1], rect[2], rect[3], o);
  const modo = o.modo || "arrivo";
  let fine = t0;
  if (modo === "arrivo") {
    const dx = o.dx || 0, dy = o.dy == null ? (o.dx ? 0 : 140) : o.dy, dur = o.dur || 0.7;
    cutTo(t0, p.fx - dx / p.s, p.fy - dy / p.s, p.s);
    camK(t0, dur, p.fx, p.fy, p.s, "expo.out");
    if (o.blur) mblur(t0, 0.25, o.blur, Math.abs(dx) > Math.abs(dy) ? "x" : "y", "decay");
    fine = t0 + dur;
  } else if (modo === "zoom") {
    const ds = o.ds == null ? 0.15 : o.ds, dur = o.dur || 0.4;
    cutTo(t0, p.fx, p.fy, p.s / (1 + ds));
    camK(t0, dur, p.fx, p.fy, p.s, "power2.out");
    fine = t0 + dur;
  } else if (modo === "spinta") {
    cutTo(t0, p.fx, p.fy, p.s);
    const sp = o.spinta || {};
    spinta(t0, Object.assign({ coda: Math.max(0, t1 - t0 - (sp.dur || 2.4)) }, sp));
    return p;
  } else cutTo(t0, p.fx, p.fy, p.s);
  // R3 · tenuta: la camera quasi ferma, deriva dell'1–2% che si spegne
  if (t1 - fine > 0.3) camK(fine, t1 - fine, CAM.fx, CAM.fy, CAM.s * (1 + (o.tenuta == null ? 0.012 : o.tenuta)), "sine.out");
  return p;
};

// ── R2 · scena piena al taglio: gli oggetti si montano PRIMA di t0 ──
// Si costruiscono mentre si vede ancora la scena prima (sono altrove nel mondo, fuori campo). montaT(t0) = { t, dur, fine }:
// i build del kit partono a t con durata dur e devono essere finiti entro fine (0,1 s prima del taglio; i build con le
// cascate, come ladder.build, durano più di dur: controllare la snapshot al taglio). Per la prima scena (t0 < 1 s)
// restituisce null: il template mette gli oggetti già pieni con gsap.set (fotogramma 0 pieno, regola 24).
const montaT = (t0) => (t0 >= 1 ? { t: t0 - 1, dur: 0.35, fine: t0 - 0.1 } : null);

// ── R7 (da provare nel blocco 1, poi ok dell'utente): sfondo fermo ──
// Nel reel 72 la griglia di fondo e il titolo restano fermi mentre il contenuto deriva. sfondoFermo() stacca i puntini dalla
// camera: restano fermi nello sfondo, il titolo è già fermo (HUD). Si chiama una volta, prima delle scene.
// Blocco 1 (opzione in coda, senza argomento non cambia niente): sfondoFermo([[t0, t1], …]) tiene fermi i puntini SOLO dentro le
// finestre (la tenuta delle scene) e li lascia seguire la camera fuori (transizioni morbide R8, whip): una copia ferma dei
// puntini nello sfondo si accende nelle finestre e quelli della camera si spengono. Le finestre che si toccano (scene col
// taglio netto) si uniscono. I template registrano la loro finestra con o.fermo (kit2-template.js, tplFermo()).
const sfondoFermo = (finestre) => {
  const d = document.getElementById("dots"), g = document.getElementById("gcam"), bg = document.getElementById("bg");
  if (!d || !g || !bg) return;
  if (!finestre) { if (d.parentNode !== bg) bg.insertBefore(d, g); return; }
  if (!finestre.length) return;
  const f = d.cloneNode(false);
  f.id = "dotsFermi";
  f.setAttribute("data-layout-allow-overflow", "");
  bg.insertBefore(f, g);
  gsap.set(f, { opacity: 0 });
  const W = finestre.slice().sort((a, b) => a[0] - b[0]).reduce((acc, w) => {
    const l = acc[acc.length - 1];
    if (l && w[0] <= l[1] + 0.05) l[1] = Math.max(l[1], w[1]); else acc.push([w[0], w[1]]);
    return acc;
  }, []);
  W.forEach(([a, b]) => { tl.set(f, { opacity: 1 }, a); tl.set(g, { opacity: 0 }, a); tl.set(f, { opacity: 0 }, b); tl.set(g, { opacity: 1 }, b); });
};
