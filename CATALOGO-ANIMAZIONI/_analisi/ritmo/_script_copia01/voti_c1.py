# -*- coding: utf-8 -*-
"""Voti del blocco C1 (copia del reel 79) in _analisi/voti_kit.json: giro «copia 15/10 (blocco C1)» in cima, il giro di prima in
«storia». Misure da copia-01/_lavoro/misure.json, misure_c1.py, pop.py, deriva.py (fatte una volta, copia → valore · K → valore).
    python -I voti_c1.py"""
import io, json, os

QUI = os.path.dirname(os.path.abspath(__file__))
F = os.path.abspath(os.path.join(QUI, "..", "..", "voti_kit.json"))
GIRO = "copia 15/10 (blocco C1)"
SC = "CATALOGO-ANIMAZIONI/copia-01 (reel 79 di Kallaway copiato intero, 1:1 sul suo tempo)"
CF = "_analisi/ritmo/fogli_regia/copia-01_NN_*.jpg (KALLAWAY | COPIA per scena) · _analisi/confronti-video/r79_copia_affiancato.mp4"
V = {
 "T01": dict(voti=dict(movimento=5, materiali=5, frame=5, brand=5), copia="COPIA.T01 (kit2-copia-testo.js) · scena 1, 0–4,17 s",
   misure={"parole sugli istanti misurati": "copia → 0,04 · 0,125 · 0,25 · 0,33 · 0,50 · 0,71 s, grigio 52% + blur 9 px + 5 px → bianco in 0,2 s · Kallaway → stessi istanti, 4–5 fotogrammi",
           "linea d'accento sotto il corsivo": "copia → curva presa per punti 0,85 → 2,6 s (5% a 0,9 · 63% a 1,3 · 92% a 1,8) · Kallaway → uguale (misurata sui fotogrammi)",
           "ingombro del titolo (ingombro.py, y 120–320)": "copia → 0,78 della larghezza, 168 px · Kallaway → 0,68, 161 px",
           "uscita": "copia → 4,17 s in 2 fotogrammi · Kallaway → 4,17 s"},
   manca="il corsivo italiano «Storytelling da dipendenza» è più lungo di «Storytelling addictive»: la riga è più larga (0,78 contro 0,68)"),
 "A05": dict(voti=dict(movimento=5, materiali=4, frame=5, brand=5), copia="COPIA.A05 (kit2-copia-aperture.js) · scena 1, 0–1,88 s",
   misure={"card al fotogramma 0 (ingombro.py 0,4 s)": "copia → 0,737 della larghezza, y 604–1055 · Kallaway → 0,738, y 587–1051",
           "cambi di clip": "copia → 0,167 · 0,334 · 0,48 s · Kallaway → 0,167 · 0,334 · 0,48 s",
           "arrivo (K02)": "copia → −125 px a 0,53 s, picco al primo fotogramma (camtrack) · Kallaway → −75 px a 0,125 s, −146 px a 0,5 s (bbox; camtrack non regge: i cambi di clip)",
           "rimbalzo": "0"},
   manca="i 4 storyteller sono creator veri del progetto (Dan Koe, Leila Hormozi, Gary Vee, Tony Robbins), non i suoi; la card di Kallaway ha i colori caldi dei suoi video"),
 "C01": dict(voti=dict(movimento=5, materiali=5, frame=5, brand=5), copia="COPIA.C01 (kit2-copia-connettori.js) · scena 1, 0,63–1,42 s",
   misure={"pan che segue la linea (camtrack + fitmove)": "copia → 0,63–1,37 s (0,73 s), picco 2943 px/s al 46% · Kallaway → 0,63–1,38 s (0,75 s), picco 2948 px/s al 44%, cubic-bezier(0.65, 0.057, 0.337, 0.913)",
           "linea": "copia → 0,70 → 0,95 s fuori campo a destra, lampo dove tocca il cervello · Kallaway → uguale",
           "rimbalzo": "0"},
   manca="lo spostamento misurato sulla copia (−722 px) è sporcato dal cervello che cresce; la camera della copia fa −870 px come Kallaway"),
 "F01": dict(voti=dict(movimento=5, materiali=4, frame=5, brand=5), copia="COPIA.F01 + CP_GLOW_T, cpNeonK (kit2-copia-0base.js, kit2-copia-luce.js)",
   misure={"glow del titolo (misura_glow.py 1,6 s)": "copia → alone medio σ 4 px a 0,22 · largo σ 20 px a 0,005 · Kallaway → medio σ 7 px a 0,10 · largo σ 20 px a 0,007",
           "glow del neon (5,6 s, prima di cpNeonK)": "copia → vicino σ 6 px a 0,66 · largo σ 20 px a 0,30 · Kallaway → vicino σ 7 px a 1,37 · largo σ 26 px a 0,04 (corretto con cpNeonK: largo 0,06, vicino più forte)"},
   manca="il bagliore del neon è stato corretto dopo la misura (cpNeonK) e non è stato rimisurato"),
 "O13": dict(voti=dict(movimento=5, materiali=5, frame=5, brand=5), copia="COPIA.O13 (kit2-copia-oggetti.js) · scene 1, 4, 6",
   misure={"cervello in fondo alla linea (bbox 1,17–1,55 s)": "copia → 282 px · Kallaway → 276–286 px",
           "cresce e se ne va": "copia → ×1,13 in 0,4 s, sfuma 1,70–1,96 s salendo · Kallaway → uguale",
           "sopra il telefono (scena 6)": "copia → sale da dietro (60 → 17 px in 0,07 s) e poi −52 px fino al taglio · Kallaway → uguale"},
   manca="il cervello a raggi X del kit è più dettagliato del suo, la stessa forma"),
 "F02": dict(voti=dict(movimento=5, materiali=4, frame=5, brand=5), copia="COPIA.F02 (kit2-copia-luce.js) · scene 1 e 6",
   misure={"disco (1,21 s)": "copia → Ø 632 → 770 px in 1 fotogramma, poi ~935 sfumando in 0,46 s · Kallaway → uguale (misurato)",
           "ingombro a 1,3 s": "copia → 0,91 della larghezza, y 312–1174 · Kallaway → 0,87, y 347–1161",
           "rimbalzo": "0"},
   manca="il suo disco è pieno di rosso scuro; il nostro è grafite con l'anello lime (niente lime trasparente sul nero): si legge meno pieno"),
 "O18": dict(voti=dict(movimento=5, materiali=5, frame=5, brand=5), copia="COPIA.O18 (kit2-copia-oggetti.js) · scena 3, 4,25–6,67 s",
   misure={"ingombro del ∞ (5,35 s)": "copia → 0,428 × 241 px, corretto ×0,93 (≈0,40 × 224) · Kallaway → 0,395 × 210 px",
           "tracciatura": "copia → 0,95 s lineare, dal centro verso l'alto a sinistra · Kallaway → 4,25–5,2 s lineare, stesso verso",
           "pan verticale sotto (TRANS.panVerticale)": "copia → +628 px in 1,68 s, picco al 23% · Kallaway → uguale (tabella misurata)"},
   manca="la dimensione corretta (×0,93) non è stata rimisurata; le molecole nel tubo sono più semplici delle sue"),
 "O14": dict(voti=dict(movimento=5, materiali=4, frame=4, brand=5), copia="COPIA.O14 (kit2-copia-oggetti.js) · scena 4–5, 8,6–10,9 s",
   misure={"ingombro (10,2 s)": "copia → 0,239 × 345 px (prima della correzione ×1,15) · Kallaway → 0,291 × 419 px (con l'insegna luminosa)",
           "cresce da sola": "copia → ×1,7 fra 9,35 e 9,62 s attorno al piede · Kallaway → ×1,7 fra 9,35 e 9,62 s",
           "rulli": "copia → 9,95–10,65 s, si fermano sui 7 · Kallaway → ~0,7 s, 7-7-7"},
   manca="la sua slot cromata ha l'insegna luminosa in alto: la nostra grafite è più scura e si stacca meno dal fondo"),
 "K03": dict(voti=dict(movimento=5, materiali=5, frame=5, brand=5), copia="COPIA.K03 (kit2-copia-camera.js, camera presa dal suo video) · scena 4–5",
   misure={"verso la slot (camtrack + fitmove)": "copia → ×1,567, Δx −300 px · Kallaway → ×1,556, Δx −298 px, KW.arrive",
           "verso la mappa": "copia → picco al 17% · Kallaway → −949 px in 1,42 s, picco 2124 px/s al 21%",
           "rimbalzo": "0"},
   manca="sulla copia la misura del secondo tratto è sporcata dalla slot che sfuma (picco 6113 px/s di un fotogramma)"),
 "K04": dict(voti=dict(movimento=5, materiali=5, frame=5, brand=5), copia="COPIA.K04 (kit2-copia-camera.js) · scena 8, 18,4–19,8 e 20,8–22,6 s",
   misure={"deriva (deriva.py sulla fiche 3 ferma, 20,81 s)": "copia → −86 px in 1,77 s, angoli 27 → 75 px/s, power1.inOut · Kallaway → −92 px in 1,75 s, angoli 28 → 76 px/s, power1.inOut",
           "scala": "copia → +0,04% · Kallaway → −0,07%"}, manca=""),
 "K02": dict(voti=dict(movimento=5, materiali=5, frame=5, brand=5), copia="COPIA.K02 (kit2-copia-camera.js) · scena 11, 34,74–36,5 s",
   misure={"arrivo in corsa sulla mappa (camtrack + fitmove)": "copia → (−606, −719) px in 1,50 s, KW.arrive (errore 0,018) · Kallaway → (−677, −802) px in 1,34 s dal taglio, 4428 px/s al primo fotogramma, KW.arrive (0,009)",
           "scala": "copia → ×1,001 · Kallaway → ×1,002"},
   manca="la misura sulla copia parte da 34,77 s (un fotogramma dopo): il primo tratto, il più veloce, manca nel numero"),
 "K17": dict(voti=dict(movimento=5, materiali=5, frame=4, brand=5), copia="COPIA.K17 (kit2-copia-camera.js) + CP_CATTURE r79_mappa12 / r79_mappa23 / r79_mappa34 · scene 5, 11, 14, 19",
   misure={"tuffo sulla tappa 3 (50,93 s)": "copia → camera presa dal suo video (×2,235 in ~1,4 s, cubic-bezier(0.03, 0.71, 0.575, 0.9)) · Kallaway → ×1,77 da 50,97 s, KW.arrive",
           "viaggi lungo il simbolo": "copia → 1→2: 1,34 s · 3→4: 2,7 s, già in corsa al primo fotogramma · Kallaway → uguale (catture)",
           "numero e nome": "copia → numero grigio → bianco +0,12–0,55 s, nome sulla parola · Kallaway → uguale"},
   manca="sulla copia camtrack non regge il tuffo (lo sfondo è uniforme: il tubo lime riempie lo schermo); i nomi italiani su due righe («Posta / in gioco», «Grande / domanda») sono più stretti dei suoi"),
 "K06": dict(voti=dict(movimento=4, materiali=5, frame=5, brand=5), copia="COPIA.K06 (kit2-copia-camera.js) · scena 25, 102,17–105,6 s",
   misure={"tuffo nella riga del canale": "copia → ×4,5 in 0,33 s power3.inOut con la scia, misurato fino a ×1,37 a 102,30 s · Kallaway → 102,19–102,52 s, 3 fotogrammi mossi (la misura non regge), poi fermo grande",
           "uscita": "copia → ×1/4,5 in 0,25 s a 105,35 · Kallaway → 105,35–105,6 s",
           "rimbalzo": "0"},
   manca="nel tratto 12,6–13,6 s indicato dal catalogo Kallaway non muove la camera (telefono fermo, 333 px): il punch-in vero del reel è questo"),
 "O30": dict(voti=dict(movimento=5, materiali=4, frame=5, brand=5), copia="COPIA.O30 (kit2-copia-oggetti.js) · scena 16, 53,85–67,86 s",
   misure={"ingombro (63,5 s)": "copia → 0,61 della larghezza, y 303–1174 · Kallaway → 0,51, y 302–1177",
           "strade": "copia → si disegnano in 0,3 s dal basso, la finta si accende a 54,7 s, vista larga ×0,85 a 57,55 s · Kallaway → uguale",
           "pallina coi fari": "copia → i fari puntano A (59,0) e girano su B in 0,4 s (60,9) · Kallaway → uguale",
           "pop «A» (pop.py)": "copia → aggancio dubbio (il fascio di luce), rimbalzo 0% · Kallaway → già in campo, 0%"},
   manca="la finta lime è più larga della sua (ingombro 0,61 contro 0,51) per il bagliore; pop.py non regge sulle lettere vicine al fascio"),
}
d = json.load(io.open(F, encoding="utf-8"))
for vid, x in V.items():
    nuovo = dict(giro=GIRO, voti=x["voti"], copia=x["copia"], scena=SC, confronto=CF, misure=x["misure"], manca=x.get("manca", ""),
                 sotto_4=any(v < 4 for v in x["voti"].values()))
    if vid in d:
        vecchio = d[vid]
        storia = vecchio.pop("storia", [])
        if vecchio.get("giro") != GIRO:
            storia = [vecchio] + storia
        nuovo["storia"] = storia
    else:
        nuovo["storia"] = []
    d[vid] = nuovo
json.dump(d, io.open(F, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok", len(V))
