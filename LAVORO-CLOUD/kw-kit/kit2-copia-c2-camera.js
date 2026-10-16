// ═══ KW kit v2 · COPIA FEDELE · camera e transizioni del blocco C2 (reel 5 di Kallaway) — K14 · K01 ══════════════════════════

/* @copia K14 · Una voce della lista diventa l'intestazione (copia del reel 5, 12,9–14,6 s; anche 35,25–36,5 e 81,0–82,1 s)
 * kallaway: reel 5, 12,9 s · finita la frase sulla voce 01, tutta la lista comincia a salire piano; a 13,42 s il titolo si
 *   spegne e le altre voci spariscono, la voce 01 corre su (picco ~790 px/s a 13,63 s) e frena dove stava il titolo: resta lì,
 *   ferma sullo schermo, come intestazione della sezione; sotto arriva la scena nuova (il reel del creator a 13,79 s)
 * misure: alto della voce 01 sullo schermo 552 (12,92) → 543 → 531 → 504 (13,42) → 480 → 441 → 375 → 333 → 309 → 294 → 285 → 276
 *   → 270 (14,17) → 262 (14,6 s); larga 862 px (×1,064 della barra a riposo) e uguale per tutta la corsa; le altre voci salgono
 *   ~48 px con lei fino a 13,42 s e spariscono in 0,1 s (barre.py)
 * quando: ogni volta che si entra in un punto della lista (01 → la spiegazione)
 * scena: lista (r5Lista nel mondo), i, t0 (inizio della salita), t1 (fine della scena: l'intestazione se ne va) · opzioni:
 *   percorso ([[dt, alto]] sullo schermo), via (dt in cui le altre spariscono, 0,53), su (px del mondo che salgono le altre, 48)
 * restituisce: elementi { barra (quella nell'HUD) }
 * colori: come la lista
 * chiamata: COPIA.K14({ lista, i: 0, t0: 12.9, t1: 18.542 });
 */
COPIA.K14 = (scena, o) => {
  o = o || {};
  const li = scena.lista, i = scena.i, t0 = scena.t0;
  const rw = li.rows[i];
  const per = o.percorso || [[0, 552], [0.083, 549], [0.167, 543], [0.25, 537], [0.333, 531], [0.417, 519], [0.5, 504], [0.583, 480], [0.667, 441], [0.75, 375], [0.833, 333], [0.917, 309], [1.0, 294], [1.083, 285], [1.167, 276], [1.25, 270], [1.48, 264], [1.7, 262]];
  // dove sta la voce sullo schermo al via (centro x, alto) e quanto è grande: la barra nell'HUD prende il suo posto
  const bx = parseFloat(li.box.style.left), by = parseFloat(li.box.style.top) + (gsap.getProperty(li.box, "y") || 0);
  const sc = 1.064, wS = li.w * sc, hS = li.h * sc;
  const hb = li.barraHud(i, true);
  gsap.set(hb.r, { left: 540 - li.w / 2, top: 0, scale: sc, transformOrigin: "50% 0%", opacity: 0, zIndex: 48 });
  hb.r.style.zIndex = 48;
  const f = cpCurva(per.map(([dt, y]) => [t0 + dt, y])), st = { v: 0 }, tE = t0 + per[per.length - 1][0];
  tl.set(hb.r, { opacity: 1 }, t0);
  tl.set(rw.r, { opacity: 0 }, t0);
  tl.fromTo(st, { v: 0 }, { v: 1, duration: tE - t0, ease: "none", immediateRender: false, onUpdate: () => gsap.set(hb.r, { y: f(t0 + st.v * (tE - t0)) }) }, t0);
  gsap.set(hb.r, { y: per[0][1] });
  // le altre voci salgono con lei e poi spariscono
  const altre = li.rows.filter((_, j) => j !== i).map((x) => x.r);
  tl.to(altre, { y: -(o.su == null ? 48 : o.su), duration: o.via || 0.53, ease: "power2.in" }, t0);
  tl.to(altre, { opacity: 0, filter: "blur(6px)", duration: 0.1, ease: "power1.in" }, t0 + (o.via || 0.53));
  if (scena.t1) tl.set(hb.r, { opacity: 0 }, scena.t1);
  return { rect: null, pose: null, ancore: { centro: [540, per[per.length - 1][1] + hS / 2] }, elementi: { barra: hb, wS, hS, bx, by } };
};

/* @copia K01 · Faccia a tutto schermo come stacco (copia del reel 5, 3,417–8,917 s; il catalogo indica 7,1–7,9 s)
 * kallaway: reel 5 · dopo il titolo (3,417 s) taglio netto su di lui a tutto schermo, senza grafica, per 5,5 s; la grafica
 *   dopo (8,917 s) riparte da zero, già piena al taglio. Nel reel ci sono 11 stacchi così (3,4–8,9 · 18,5–20,1 · 22,6–24,8 ·
 *   30,8–32,8 · 38,8–44,1 · 54,3–59,5 · 63,3–66,9 · 72,0–76,8 · 85,1–88,7 · 93,4–94,4 · 98,3–105,8 · 110,0–112,7 · 116,0–117,7 s)
 * misure: taglio netto in entrata e in uscita (tagli.py, 1 fotogramma); nel tratto 7,1–7,9 s indicato dal catalogo lui è a tutto
 *   schermo e non c'è nessun movimento di camera (è la facecam stessa)
 * quando: fine di ogni punto, prima di un cambio di sezione, sulle frasi forti dette in camera
 * scena: t0, t1 · da noi la faccia sta sempre sotto (safe zone): lo spazio sopra resta scuro per la stessa durata (cpFacecam)
 * restituisce: la copertura
 * colori: fondo scuro
 * chiamata: COPIA.K01({ t0: 3.417, t1: 8.917 });
 */
COPIA.K01 = (scena) => cpFacecam(scena.t0, scena.t1);
