// ═══ KW kit v2 · TEMPLATE — scene semilavorate del catalogo, rifatte con le regole del ritmo (RIFACIMENTO-RITMO.md) ══════
// Un template per voce del catalogo: TPL.<ID>(scena, opzioni). Si usa quando una voce è giusta per una frase dello script:
// si prende il template e si adattano testi, numeri, media e tempi, invece di ricostruire la scena da zero.
//   scena   = { t0 (il taglio), t1 (fine), X, Y (centro della scena nel mondo), parole: { …tempi delle parole chiave }, parent }
//   opzioni = il contenuto: titolo, voci, numeri, media (i tuoi reel veri), utente, colori di stato…
//   → { rect, pose, ancore, elementi, tempi } — rect/pose per inquadrare, ancore (punti del mondo) per legare le scene fra
//     loro (arrivo dalla scena prima, match cut), elementi per gli accenti in più, tempi per gli SFX della composizione.
// Le regole del ritmo stanno dentro il template (va usato nelle composizioni col marcatore KW_RITMO):
//   - si monta PRIMA di t0 (montaT) e al taglio parte un solo movimento principale (apertura / spinta), poi la tenuta (R1–R4);
//   - niente back.out (R5, kit2-ritmo.js), riempimenti e conteggi continui (R6);
//   - gli accenti (al massimo 2–3) si agganciano alle parole (scena.parole);
//   - ingresso "nessuno" = la camera la muove la composizione (transizione morbida R8, match cut sulle ancore).
// SCHEDA in testa a ogni template: commento che comincia con "@scheda <ID> · <nome>", righe "chiave: valore" (le righe che
// seguono con più rientro continuano il valore). La legge _tools/genera_catalogo_ritmo.py per la pagina catalogo-ritmo.html.
// Chiavi: quando, frase, durata, scena, opzioni, restituisce, suoni, regole, prima (cosa è cambiato), chiamata (codice).
// Contro la ripetizione: in un reel ogni template compare una volta (al massimo due se è il centro del concetto); il concetto
// del reel resta originale (un mondo e una metafora per reel): i template sono i mattoni, non il reel.
const TPL = {};

// ── R7 (da provare nel blocco 1, ritmo-01): titolo e sfondo fermi mentre il contenuto si muove ──
// Il titolo è già fermo (HUD). Per lo sfondo ogni template del blocco 1 registra la sua finestra [t0 (o o.fermoDa), t1] quando
// KW_RITMO e o.fermo !== false; la composizione chiama tplFermo() UNA volta dopo le scene (sfondoFermo a finestre: i puntini
// stanno fermi durante la tenuta e seguono la camera nelle transizioni morbide). Per togliere R7: non chiamare tplFermo()
// (una riga nella composizione), oppure fermo: false nella singola scena.
const TPL_FERMO = [];
const tplFermo0 = (scena, o) => { if (KW_RITMO && o.fermo !== false) TPL_FERMO.push([o.fermoDa == null ? scena.t0 : o.fermoDa, scena.t1]); };
const tplFermo = () => sfondoFermo(TPL_FERMO);
// montaggio prima del taglio (R2): fa(t, dur) costruisce gli oggetti da t (t0 − 1 s) e restituisce true; per la prima scena
// del reel (t0 < 1 s) chiama pieno() che li mette già pieni con gsap.set
const tplMonta = (t0, fa, pieno) => { const m = montaT(t0); if (m) fa(m.t, m.dur, m); else if (pieno) pieno(); return m; };

// titolo della scena (T01): nell'HUD, fermo; le parole entrano dal taglio a 0,12 s l'una oppure sui tempi della voce
// (scena.parole.titolo = [tempo per parola]); esce 0,45 s prima della fine (regola 16) se o.titoloEsce !== false
const tplTitolo = (scena, o) => {
  if (!o.titolo) return null;
  // blocco 3 (T02, opzione in coda): o.boxCps = il box cresce lettera per lettera (titleW); senza, come prima
  const T = titleW({ lines: o.titolo, size: o.titoloSize || 80, boxCps: o.boxCps });
  const tp = scena.parole && scena.parole.titolo;
  T.inAt(Array.isArray(tp) ? tp : scena.t0 + 0.05);
  if (o.titoloEsce !== false) T.outAt(scena.t1 - 0.45);
  return T;
};

// ── R8 (da provare nel blocco 1, ritmo-01): transizione morbida «zoom-through» (K07) fra due scene che si toccano ──
// La camera corre DENTRO un punto della scena prima (verso = [x, y] del mondo: un'ancora, es. il tuo video su una tappa) e
// dall'altra parte la scena dopo si assesta sulla sua posa. Corta (0,16 s + 0,45 s): niente corsa nel vuoto. La scena dopo va
// chiamata con ingresso: "nessuno" e fermoDa = il valore restituito (R7: lo sfondo si ferma ad assestamento finito).
// o: { pre (0.16), zoom (1.5: quanto si entra), settle (0.45), blur (12), da (0.86: scala d'arrivo rispetto alla posa) }
const tplZoomThrough = (t, verso, pose, o) => {
  o = o || {};
  const pre = o.pre || 0.16, st = o.settle || 0.45, bl = o.blur || 12;
  camK(t - pre, pre, verso[0], verso[1], CAM.s * (o.zoom || 1.5), "power2.in");
  tl.fromTo(mbwrap, { filter: "blur(0px)" }, { filter: `blur(${bl}px)`, duration: pre, ease: "power2.in", immediateRender: false }, t - pre);
  cutTo(t, pose.fx, pose.fy, pose.s * (o.da || 0.86));
  camK(t, st, pose.fx, pose.fy, pose.s, "power3.out");
  tl.to(mbwrap, { filter: "blur(0px)", duration: 0.2, ease: "power2.out" }, t);
  tl.set(mbwrap, { filter: "none" }, t + 0.21);
  return t + st;
};
// R8 «spinta di lato» (la card che entra di lato, reel 9 di Kallaway: ~740 px in ~0,75 s, sine.out, picco ~2000 px/s): la
// camera scorre dalla scena prima alla dopo, che sta vicina (circa una schermata), con un filo di scia → restituisce la fine
const tplPan = (t, pose, o) => {
  o = o || {};
  const dur = o.dur || 0.7;
  const dx = Math.abs(pose.fx - CAM.fx), dy = Math.abs(pose.fy - CAM.fy);
  camK(t, dur, pose.fx, pose.fy, pose.s, o.ease || "sine.out");
  if (o.blur !== 0) mblur(t, 0.3, o.blur || 8, dy > dx ? "y" : "x");
  return t + dur;
};
// tenuta dopo una transizione fatta dalla composizione (R3): deriva dell'1,2% che si spegne fino a t1
const tplTenuta = (t, t1, ds) => { if (t1 - t > 0.3) camK(t, t1 - t, CAM.fx, CAM.fy, CAM.s * (1 + (ds == null ? 0.012 : ds)), "sine.out"); };

// blocco 1: come tplTitolo, ma l'uscita finisce PRIMA del taglio anche coi titoli lunghi (tplTitolo esce a t1 − 0,45 s e con
// 6+ parole l'ultima sfuma 0,05–0,1 s dopo il taglio: si vedeva nel primo fotogramma della scena dopo). D13 resta com'è.
const tplTitoloK = (scena, o) => {
  if (!o.titolo) return null;
  const T = tplTitolo(scena, Object.assign({}, o, { titoloEsce: false }));
  if (o.titoloEsce !== false) T.outAt(scena.t1 - 0.47 - T.n * 0.012);
  return T;
};

/* @scheda D13 · Termometro accanto alla scala (si riempie fino al gradino)
 * quando: un valore che cresce per livelli; "dalla base all'ultimo gradino"; fiducia, qualità o risultato che sale passo
 *   per passo; "uno step alla volta"
 * frase: «Non serve rifare il profilo da zero, serve salire di uno step alla volta.» (06/10, 29,1–34,2 s)
 * durata: 3–6 s (consigliata 4–5)
 * scena: t0 (taglio), t1 (fine), X, Y (centro nel mondo), parole: { sale (parte il riempimento, default t0 + 0,05),
 *   arriva (la barra è in cima, default sale + 2,25 come Kallaway: è la scelta dell'utente del 14/10; arriva su una parola
 *   più lontana allunga il riempimento fino a 4,5 s), titolo ([tempo per parola], facoltativo) }
 * opzioni: titolo (righe di titleW), gradini (nomi dal basso, 3–8), etichette ([basso, alto] del tubo), fino (indice del
 *   gradino d'arrivo, default l'ultimo), tu (la tua foto sale con la barra), ingresso ("spinta" default | "nessuno")
 * restituisce: rect, pose, ancore { bulbo, cima, punta(f), gradino(i) }, elementi { scala, termo, tu, titolo, L },
 *   tempi { taglio, sale, arriva }
 * suoni: whoosh .14 al taglio · rise .06 su «sale» · ding .1 su «arriva»
 * regole: R2 scena piena al taglio (scala, tubo e nomi già lì) · R4 spinta +9% in 2,4 s power2.out, poi coda +1% · R6 un
 *   riempimento solo, lineare; i gradini si accendono quando la barra li raggiunge · R3 un accento all'arrivo (disco dietro
 *   la tua foto, bagliore sul gradino) · R5 niente rimbalzi
 * prima: la scala si costruiva dopo il taglio (0,6 s) e il termometro sfumava; il riempimento andava a 5 scatti da 0,5 s
 *   (power2.inOut) con le pause, fino a 3,6 s; i nomi si scrivevano a ogni scatto; la camera faceva float +2% in 5,4 s
 * chiamata:
 *   TPL.D13({ t0: at("Non", 87), t1: at("volta.") + 1, X: 600, Y: 900 }, {
 *     titolo: [[{ t: "Uno step " }, { t: "alla volta", box: true }]],
 *     gradini: ["Foto profilo", "Nome + cosa fai", "Chi aiuti", "Perché fidarti", "Parola nei DM"],
 *     etichette: ["Base", "Ultimo gradino"], tu: true });
 */
TPL.D13 = (scena, o) => {
  o = o || {};
  const { t0, t1, X, Y } = scena, P = scena.parole || {};
  const L = scena.parent || layer(10);
  const nomi = o.gradini || ["Livello 1", "Livello 2", "Livello 3", "Livello 4", "Livello 5"];
  const n = nomi.length;
  // misure: quelle del lab (5 gradini da 180 px); con più gradini il passo si stringe e il testo rimpicciolisce
  const gap = o.gap || Math.max(110, Math.min(200, 720 / (n - 1)));
  const fsN = o.fs || Math.round(Math.min(32, gap * 0.19));
  const B = Y + (gap * (n - 1)) / 2 + 140; // piede della scala
  const xT = X - 300, yBot = B - 30, yTop = B - (n - 1) * gap - 80;
  const ld = ladder(L, X + 130, B, nomi, { gap, w: 480, fs: fsN });
  const th = thermo(L, xT, yTop, yBot, { w: 48, etichette: o.etichette === false ? [] : o.etichette || ["Base", "Cima"] });
  const rungY = (i) => B - i * gap;
  const rungF = (i) => Math.max(0, Math.min(1, (yBot - rungY(i)) / (yBot - yTop)));
  const k = o.fino == null ? n - 1 : o.fino;
  const fFin = k >= n - 1 ? 1 : Math.min(1, rungF(k) + 0.04);
  // la tua foto: a sinistra del tubo, all'altezza della punta del lime (sale con la barra)
  let tu = null;
  if (o.tu) {
    const d = 96;
    tu = layered(el(L, { position: "absolute", left: xT - 48 - d, top: th.tipY(0) - d / 2, width: d + 24, height: d, zIndex: 15 }));
    avatar(tu, d / 2, d / 2, d, o.tu === true ? "tu" : o.tu, { z: 2 });
    el(tu, { position: "absolute", left: d - 2, top: d / 2 - 2, width: 26, height: 4, borderRadius: 2, background: K.lime, boxShadow: GLOW_A(0.6) });
    if (th.lab[1]) th.lab[1].style.top = `${yTop - 124}px`; // l'etichetta in cima si alza: la foto e il disco arrivano lì
  }
  // 1) prima del taglio: scala e termometro già costruiti, i nomi dei gradini già scritti e attenuati (reel 72: si leggono
  //    da subito e si accendono quando la barra li raggiunge)
  ld.tags.forEach((g) => { g.nm.textContent = g.tx.toUpperCase(); gsap.set(g.nm, { opacity: 0 }); });
  const m = montaT(t0);
  if (m) {
    ld.build(m.t, m.dur);
    th.show(m.t);
    tl.to(ld.tags.map((g) => g.nm), { opacity: 0.42, duration: 0.2 }, m.t + 0.2);
    if (tu) { gsap.set(tu, { opacity: 0 }); tl.to(tu, { opacity: 1, duration: 0.2 }, m.t + 0.2); }
  } else {
    // prima scena del reel: tutto pieno al fotogramma 0
    Array.from(ld.S.getElementsByTagName("path")).forEach((p) => p.setAttribute("stroke-dashoffset", 0));
    gsap.set([th.tube, th.bulb, ...th.lab], { opacity: 1 });
    gsap.set(ld.tags.map((g) => g.nm), { opacity: 0.42 });
  }
  // 2) il riempimento: uno solo, lineare (R6), dal primo fotogramma o da «sale»; ogni gradino si accende quando la barra
  //    raggiunge la sua quota sul tubo
  const ts = P.sale == null ? t0 + 0.05 : P.sale;
  const ta = P.arriva == null ? ts + 2.25 : P.arriva;
  const FILL = Math.max(1.2, Math.min(4.5, ta - ts));
  th.to(ts, fFin, FILL, "none");
  if (tu) tl.to(tu, { y: th.tipY(fFin) - th.tipY(0), duration: FILL, ease: "none" }, ts);
  for (let i = 0; i <= k; i++) {
    const t = ts + FILL * (rungF(i) / fFin);
    const [g, b, c] = ld.rungs[i];
    tl.to([g], { attr: { opacity: 0.4 }, duration: 0.2 }, t);
    tl.to([b], { attr: { opacity: 1 }, duration: 0.2 }, t);
    tl.to([c], { attr: { opacity: 0.9 }, duration: 0.2 }, t);
    tl.to([ld.tags[i].lvl, ld.tags[i].nm], { opacity: 1, duration: 0.2 }, t);
  }
  // 3) l'accento all'arrivo (R3): il gradino d'arrivo s'illumina, un disco lime dietro la tua foto
  glowFlash(ld.tags[k].nm, ts + FILL);
  if (tu) pulse(L, xT - 48 - 48, th.tipY(fFin), ts + FILL, { r: 72, z: 14 });
  // 4) la camera: R4 spinta (+9% in 2,4 s power2.out, il contenuto scivola un po' verso la cima del tubo), poi la coda
  const rect = [X - 470, yTop - (tu ? 170 : 140), X + 450, B + 120];
  let pose = fitPose(rect[0], rect[1], rect[2], rect[3], { top: 380 });
  if (o.ingresso !== "nessuno") pose = apertura(t0, t1, rect, { modo: "spinta", top: 380, spinta: { dx: -60, dy: -18, ds: 0.09, dur: 2.4, dxCoda: -8, dyCoda: -4, dsCoda: 0.01 } });
  const T = tplTitolo(scena, o);
  return {
    rect, pose,
    ancore: { bulbo: [xT, yBot], cima: [xT, yTop], punta: (f) => [xT, th.tipY(f)], gradino: (i) => [X + 130, rungY(i)] },
    elementi: { scala: ld, termo: th, tu, titolo: T, L },
    tempi: { taglio: t0, sale: ts, arriva: ts + FILL },
  };
};
