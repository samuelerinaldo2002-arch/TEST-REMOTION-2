# Rifacimento del catalogo: confronto con Kallaway e catalogo di template

## GIRO 2 · COPIA FEDELE (decisione dell'utente del 15/10 sera; vale al posto del giro «ritmo» qui sotto)
**Perché.** Nel giro «ritmo» ogni template era già una nostra interpretazione: tempi misurati su Kallaway, ma oggetti,
composizione e transizioni reinventati (fotocamera, sagoma del ragazzo, cambi che sembrano dissolvenze). L'utente: «ricreiamo le
animazioni il più identiche possibile a Kallaway, e poi da quella base che sappiamo funzionare (in 4 mesi milioni di views e
140K follower con questo format) le adattiamo ai nostri script».
**Tre fasi:**
1. **Copia fedele di tutto il catalogo** (146 voci, blocchi `C1`, `C2`, … qui sotto). Identici a Kallaway: camera, impaginazione,
   proporzioni, tempi, durate, tipo di oggetti, stile. **Colori e font del brand dell'utente** (lime #CFFB50, scuro #1E1E1E,
   bianco; Advercase / Patrick Hand / Zalando Sans negli stessi ruoli dei suoi). I testi sono la sua scritta tradotta in italiano,
   della stessa lunghezza; i media sono lo stesso tipo di cosa che mostra lui (creator veri → reel veri di creator, lui → la foto e
   i reel dell'utente, loghi di piattaforme → gli stessi loghi). Le sue clip e i suoi testi in inglese non si usano.
2. **Catalogo delle transizioni**, dopo il catalogo: ogni voce è «scena A → movimento → scena B», ricostruita da un suo cambio vero
   con due copie. I dati si raccolgono già nella fase 1 (`copia-NN/transizioni.json`, vedi sotto), così non si riaprono i reel.
3. **Adattamento ai suoi script**: dalla copia si ricavano i template (`TPL.<ID>` ritoccati o rifatti; quelli dei blocchi 1–3 si
   confrontano con la copia e si tengono, si correggono o si rifanno). Solo dopo, reel nuovi.
**Ordine:** altissima e alta (45 voci, C1–C4), raggruppate per reel di Kallaway; poi media (45) e rara (56), raggruppate allo
stesso modo dalla regia. Il giro «ritmo» resta com'è (blocchi 1–2 fatti, blocco 3 in pausa: confluisce qui).
**Revisione dell'utente:** dopo C1 la regia gli mostra la pagina (KALLAWAY | COPIA) prima di andare avanti; poi 2–3 blocchi per
sessione di regia, senza approvazioni.

### Come si fa un blocco di copia `copia-NN` (porta :3040 + NN)
- **Codice:** `kw-kit/kit2-copia-<categoria>.js`, funzioni `COPIA.<ID>(scena, opzioni)` con lo stesso standard dei TPL (scheda in
  testa, `scena = {t0, t1, X, Y, parole}`, restituisce `{rect, pose, ancore, elementi}`). **Non si toccano `TPL.*`** (sono nei
  reel 14–16), le funzioni del kit solo con opzioni in coda col default di prima. Marcatore `KW_RITMO` nella composizione.
- **Si copia un tratto intero del suo reel quando contiene più voci** (es. r79 0–2,2 s: T01, C01, F01, O13, F02): le scene si
  legano con le sue transizioni vere, che sono già una prima prova del catalogo delle transizioni. Le voci isolate stanno in un
  punto diverso del mondo, con un taglio netto.
- **Kallaway vince sulle regole:** dove un suo valore misurato è diverso da R1–R8 (un ritorno, un `back.out`, una deriva), si copia
  lui e lo si annota. Durate e istanti degli accenti = i suoi, in secondi dal suo taglio (non ci sono parole dell'utente).
- **Safe zone dell'utente, non quella di Kallaway** (ribadito dall'utente il 15/10): niente grafica sotto y = 1332
  (SAFEZONE.jpg), sotto solo sfumature verso il nero; 30 fps, niente audio. La divisione di Kallaway (grafica sopra, facecam
  sotto) non si copia: si riportano le sue proporzioni nell'area utile y 0–1332, come nel giro ritmo.
- **Confronto:** foglio KALLAWAY / COPIA agli stessi istanti dal taglio (`_tools/foglio_kd.py`, con un'opzione per la copia) è il
  criterio principale: nel movimento e nell'impaginazione non si devono vedere differenze, a parte testi e colori. Misure UNA
  volta, coi valori di Kallaway accanto: `deriva.py`, `pop.py`, `ingombro.py`, `safezone.py`, check, fotogramma del taglio. Se un
  valore di Kallaway per quella voce non c'è ancora, si misura una volta lui con lo stesso strumento.
- **Transizioni:** per ogni voce si annota in `copia-NN/transizioni.json` come Kallaway ci entra e come ne esce:
  `{id, reel, entrata: {tipo, durata, easing, da}, uscita: {tipo, durata, easing, verso}, fotogrammi: [prima, dopo]}`;
  tipi: pan, zoom-through, match cut, linea che continua, oggetto che resta, taglio, altro (descritto).
- **Pagina:** `catalogo-ritmo.html` ha la colonna COPIA accanto a KALLAWAY (clip in `ritmo-clip/<ID>_copia.mp4`); DOPO (template
  ritmo) resta, PRIMA si può nascondere. Si rigenera dopo ogni voce finita.
- **Voto** in `_analisi/voti_kit.json`, giro `"copia 15/10 (blocco CN)"`, con `misure` (copia → valore · Kallaway → valore) e
  `manca`. Riga della tabella qui sotto, `copia-NN/STATO.md`, rapporto in `copia-NN/RAPPORTO.md`.

### Prompt di un blocco di copia (NN = numero del blocco, CN la sua riga)
```
Lavori nel progetto TEST KALLAWAYMARKETING (C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING). Fai il blocco di
copia CN: leggi CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md (sezione «GIRO 2 · COPIA FEDELE», «Come si fa un blocco di copia», le
voci del blocco CN nella tabella del giro 2), CATALOGO-ANIMAZIONI/_analisi/ritmo/RITMO.md (§8 come misurare senza sbagliare) e
kw-kit/KIT-V2.md (sezione «Ritmo e template»; lo standard da seguire è quello di TPL.D13 in kw-kit/kit2-template.js). Per ogni
voce: i reel di Kallaway del campo rif del catalogo (catalogo.json), il suo taglio esatto e il foglio dei suoi fotogrammi; la
COPIA.<ID> con la scheda, identica a lui in camera, impaginazione, proporzioni, tempi, oggetti e stile, coi colori e i font del
brand dell'utente, testi suoi tradotti in italiano e media dello stesso tipo dei suoi; la scena nella composizione
CATALOGO-ANIMAZIONI/copia-NN/ (KW_RITMO, safe zone y = 1332, 30 fps; i tratti di reel con più voci si copiano interi con le sue
transizioni); la riga in copia-NN/scene.json ({id, t0, t1, cosa, kallaway: {reel, t0, t1}}) e in copia-NN/transizioni.json;
build, check, fotogramma del taglio guardato; render di prova (pochi, più voci insieme) sotto il lucchetto
CATALOGO-ANIMAZIONI/_analisi/render/.lock-render (mkdir + chi.txt, toglierlo alla fine; se esiste aspetta); foglio KALLAWAY /
COPIA agli stessi istanti dal taglio, guardato: se si vede una differenza nel movimento o nell'impaginazione la correggi; misure
UNA volta (deriva.py, pop.py, ingombro.py, safezone.py) coi valori di Kallaway accanto, e rimisuri solo ciò che correggi; voto
in voti_kit.json; riga della tabella; pagina rigenerata con _tools/genera_catalogo_ritmo.py --solo <ID> DOPO OGNI VOCE.
Non toccare TPL.*, reel-12…16, i reel consegnati, i KW_FISSO, ritmo-01/02/03/09 e il comportamento del kit senza KW_RITMO; opzioni
nuove nelle funzioni del kit solo in coda col default di prima. Anteprima: avvia solo il server sulla porta :3040 + NN. Non
lanciare altri sotto-agenti. Se ti fermi per il limite, scrivi la riga di stato in copia-NN/STATO.md e riparti da lì. Rapporto
finale alla regia (al massimo 40 righe): voci fatte, numeri copia contro Kallaway, transizioni annotate, cosa non torna, percorsi.
```

### Tabella del giro 2
| blocco | voci (reel di Kallaway da copiare) | porta | stato |
|---|---|---|---|
| C1 | **REEL 79 INTERO** (107,6 s, ~17 tagli; idea dell'utente: «copiare un intero reel così inizi già a vedere le transizioni»). Contiene T01 · C01 · F01 · O13 · F02 · K03 · K04 · K02 e anche A05 · O18 · O14 · K06 · K17 · O30 (K01 e T12 escluse dal catalogo, ma il tratto si copia lo stesso). È il gemello di Kallaway dello script 23/09 dell'utente | :3041 | **fatto (16/10, da rivedere con l'utente)**: 25 scene 0–107,6 s 1:1 sul suo tempo (`copia-01/scene.json`), 33 transizioni (`copia-01/transizioni.json`), 14 voci `COPIA.*` + 9 `COPIA.r79_*` + `TRANS.panVerticale` in `kw-kit/kit2-copia-*.js`; camera presa dal suo video dove è complessa (`CP_CATTURE`); misure K/copia e voti in `voti_kit.json` (giro «copia 15/10 (blocco C1)»); affiancato `_analisi/confronti-video/r79_copia_affiancato.mp4`; rapporto `copia-01/RAPPORTO.md` |
| C2 | **REEL 5 INTERO** (L01 · L02 · O21 · F03 · T08 · K14 · X01 e tutto il resto del reel). Lancio 16/10 | :3042 | in corso |
| C2b | **REEL 1 INTERO** (T02 · D02 · X01 · T01 · F02 · A01 con r25/r84/r96 se servono) | :3047 | da fare |
| C3 | D01 · U05 · U02 (r9 0–14) · L09 (r3, r23, r68) · F08 (r88, r13) · U01 (r6, r66) · O01 · K09 · K13 · T07 · L11 (r13, r14) | :3043 | da fare |
| C4 | K16 · L12 · A03 (r35, r26) · L10 (r26, r31) · O03 (r6, r41) · O05 (r4, r23) · C04 (r91, r4) · O25 (r74, r20) | :3044 | da fare |
| C5 | D04 · F04 · F06 · F11 · H02 · H03 · A02 · L14 | :3045 | da fare |
| C6… | media e rara non già coperte dai reel interi, raggruppate per reel dalla regia | :3046… | da fare |

**Reel interi (C1 e quelli che la regia sceglie dopo).** Si copia tutto il reel, dal primo all'ultimo fotogramma, nella sua
durata: ogni scena e ogni transizione al suo istante (la copia sta 1:1 sul tempo del reel). Dove Kallaway è a tutto schermo in
camera, senza grafica, la copia tiene lo spazio scuro per la stessa durata (segnato «facecam piena» in scene.json), così tempi e
transizioni restano veri. I titoli parola per parola seguono le sue parole: la trascrizione del reel
(`npx hyperframes@0.8.138 transcribe <mp4> -m small.en -l en`) dà i tempi, la traduzione italiana si distribuisce su quei tempi.
In più: video affiancato KALLAWAY | COPIA di tutto il reel, senza audio (`_analisi/confronti-video/r79_copia_affiancato.mp4`),
e tutte le transizioni del reel in `copia-01/transizioni.json`. Le clip COPIA della pagina si tagliano dal render del reel agli
istanti delle voci.

---
# Giro 1 · ritmo (13–15/10, sostituito dal giro 2)

Richiesta dell'utente (13/10) per **tutte** le animazioni del catalogo, due scopi:
1. **Vedere Kallaway accanto alla nostra versione rifatta con le regole del ritmo**, in una pagina sola:
   `CATALOGO-ANIMAZIONI/catalogo-ritmo.html`.
2. **Farne un catalogo di template semilavorati.** Quando si fa un reel, se una voce è giusta per una frase dello script, si prende
   il template e si adatta (testi, numeri, media, tempi) invece di ricostruire la scena da zero.

Si lavora a blocchi da 12 voci e si riparte sempre dal primo blocco non finito della tabella in fondo.

## Come si divide il lavoro
- **Passo 0, in una chat normale, senza sotto-agenti.** Comprende il marcatore `KW_RITMO`, lo standard dei template e il generatore
  della pagina. Tocca file condivisi del kit e decide lo standard per tutte le 146 voci: va fatto da una testa sola, con cura.
- **Blocchi: una chat di regia con UN sotto-agente alla volta, mai in parallelo.**
  - Ogni sotto-agente fa un blocco intero con il contesto pulito, così la qualità resta quella dell'inizio di una sessione.
  - La regia resta leggera: legge il rapporto breve, controlla a vista la pagina e le strisce, chiede le correzioni allo stesso
    sotto-agente, aggiorna la tabella e lancia il blocco dopo.
  - Perché non in parallelo:
    - i sotto-agenti consumano lo stesso limite di sessione dell'utente (il 12/10 due agenti in parallelo si sono fermati due
      volte sul limite);
    - scriverebbero negli stessi file del kit (`kit2-template.js`);
    - si metterebbero in fila sul lucchetto dei render.
- **Revisione dell'utente:** il blocco 1 si ferma per farsi confermare R7 e R8 e lo standard dei template. Dopo si può andare avanti
  di 2–3 blocchi per sessione di regia, finché la regia non diventa lunga (allora prompt di passaggio).
- **Il prompt del sotto-agente** sta qui sotto («Prompt di un blocco»).

## Regole del ritmo da applicare
Le regole sono in `CATALOGO-ANIMAZIONI/_analisi/ritmo/RITMO.md` §4 e §8, misurate su Kallaway.
- **R1–R6 approvate.** In sintesi:
  - una scena per idea, di circa 4 s (normale fra 2,5 e 6 s);
  - scena piena al taglio e un solo movimento principale entro 0,1 s, che dura 0,3–0,8 s e frena forte;
  - poi la camera quasi ferma e solo 2–3 piccoli accenti sulle cose dette;
  - la deriva lunga (+8–10% in 2,4 s, power2.out) solo per un oggetto singolo;
  - niente `back.out`: pop con opacità + scala 0,8 → 1 in 0,1–0,2 s, power2.out;
  - riempimenti e conteggi continui, non a scatti.
- **R7 (titolo e sfondo fermi mentre il contenuto deriva) e R8 (transizioni): provate nel blocco 1, approvate dall'utente il
  14/10.** Valgono in tutti i blocchi.
  - R8: di base taglio netto + arrivo che frena; una transizione morbida circa una volta ogni tre cambi, dove le idee si toccano;
    niente corse lunghe nel vuoto.
- **Scena piena al taglio:** gli oggetti si montano prima del taglio e al taglio parte solo il movimento principale.
- Esempio già fatto: il termometro D13 (`_analisi/confronti-video/D13_prima_dopo.mp4`, lab `_analisi/ritmo/lab-d13/`).
- **Prima di misurare** leggere RITMO.md §8 «Come misurare senza sbagliare»:
  - `confronto_moto.py` va usato su un solo segmento grafico senza tagli;
  - `deriva.py` vuole maschere scelte a vista sugli elementi fermi, e i pannelli di verifica vanno controllati;
  - le strisce di `pop.py` vanno guardate.

## Lo standard dei template (da fissare nel passo 0, poi uguale per tutte le voci)
- **Dove:** `kw-kit/kit2-template.js`, oppure più file `kw-kit/kit2-tpl-<categoria>.js` se diventa grande (il build concatena tutti
  i `kit2-*.js`). Un template per voce: `TPL.<ID>(scena, opzioni)`.
  - `scena` = `{ t0, t1, X, Y, parole }`: dove sta nel mondo, quando inizia e finisce, i tempi delle parole chiave.
  - `opzioni` = il contenuto: titolo, voci, numeri, media (i tuoi reel veri), utente, colori di stato…
  - Restituisce `{ rect, pose, ancore, elementi }`, così il reel può legare le scene fra loro (arrivo dalla scena prima, match cut
    su un'ancora).
- **Le regole del ritmo stanno dentro il template:**
  - si monta prima di t0, con un solo movimento principale al taglio e la tenuta;
  - camera ed easing seguono R1–R6;
  - gli accenti si agganciano alle parole (`parole`);
  - la durata consigliata è fra un minimo e un massimo.
  - Vale con il marcatore `KW_RITMO`.
- **Scheda in testa a ogni template** (commento letto dal generatore della pagina):
  - ID e nome;
  - **quando usarlo**, cioè il tipo di frase («un dato che cresce», «una lista di passi», «prima/dopo»…);
  - parametri, durata minima e massima;
  - frase d'esempio dai tuoi script ed esempio di chiamata.
- **Le scene dei blocchi (`ritmo-NN`) si costruiscono solo chiamando i template:** la demo è anche il test del template.
- **Nella pagina** ogni voce mostra, oltre ai tre video, la scheda e il codice da copiare.
- **Contro la ripetizione** (l'utente ha già bocciato elementi ripetuti, come il ragazzo d'argilla):
  - in un reel ogni template compare una volta, al massimo due se è il centro del concetto;
  - la pagina tiene la colonna «usato nei reel», per non ripetere lo stesso template in reel vicini;
  - **il concetto del reel resta originale**: un mondo e una metafora per reel, con le transizioni pensate per quello script. I
    template sono i mattoni, non il reel.
- **Dopo 2–3 blocchi** si può aggiungere `_tools/suggerisci_template.py dDD`: per ogni frase di uno script propone i template
  adatti (usa le schede, `SCRIPT-CATEGORIZZATI.md` e il campo `negli_script` del catalogo).

## Passo 0 — FATTO il 13/10 (in attesa che l'utente guardi D13 e la pagina)
- **`KW_RITMO`**: `build.cjs` + `kw-kit/kit2-ritmo.js` (`apertura`, `spinta`, `popK`, `montaT`, `sfondoFermo` per R7; con il
  marcatore niente `back.*` > 1,2 e `BAND.y1 = 1290`); opzione `ease` in coda a `thermo.to`, `statCard.count`, `crowd.count`,
  `igProfile.count`, `igInsights.count`. Dettagli in `kw-kit/KIT-V2.md`, sezione «Ritmo e template».
  **Verifica:** demo-8 ricostruita col kit di prima e con quello nuovo, 5 snapshot (1,2 · 6,4 · 13,7 · 22,1 · 31,5 s) identiche,
  differenza 0; due giri «prima» identici fra loro, quindi la misura è deterministica.
- **Standard dei template**: `kw-kit/kit2-template.js` (in testa lo standard, poi `tplTitolo` e `TPL.D13`). Primo template:
  **D13** dal lab, scena di prova in `CATALOGO-ANIMAZIONI/ritmo-09/` (il blocco 9 aggiungerà lì le sue altre 11 voci).
- **Pagina**: `_tools/genera_catalogo_ritmo.py` → `CATALOGO-ANIMAZIONI/catalogo-ritmo.html` (146 voci, 144 PRIMA già tagliate;
  K04 e F01 non hanno un tempo nel catalogo: vanno messi in `PRIMA_MANUALE`). `?q=D13` (una voce) o `?b=1` (un blocco) nell'indirizzo aprono la pagina filtrata.

**Come si fa una composizione di blocco `ritmo-NN`** (deciso nel passo 0, uguale per tutti i blocchi):
- si copia la shell di `ritmo-09/index.src.html` (marcatore `KW_RITMO`, safe zone 1288–1330, copertina scura nel primo secondo
  che fa da «scena prima»); una scena per voce, una dopo l'altra, ognuna in un punto diverso del mondo (X distanti ~3000 px),
  **costruita solo chiamando il suo template**; i tempi delle parole si scrivono a mano dalla frase vera (`_tools/parole.py
  dDD.ts`) e si spostano sull'istante della scena;
- `ritmo-NN/scene.json`: `[{id, t0, t1, frase, script, kallaway: {reel, t0, t1}}]`. `kallaway` è il segmento grafico di
  Kallaway **dal suo taglio** (trovato con `ffmpeg … select='gt(scene,0.2)',showinfo` sui tempi rif del catalogo, controllato a
  vista): la pagina ne fa la clip KALLAWAY allineata, così i tre video partono dallo stesso istante;
- render di prova `_analisi/render/ritmo-NN_bozza.mp4` (`render --quality draft`), sotto il lucchetto;
- misure del DOPO: `deriva.py --n …ritmo-NN_bozza.mp4 --t <t0> --maschera <elementi fermi> --voce <ID>_ritmoNN` (guardare il
  pannello di verifica: giallo sugli elementi fermi) e `pop.py` per gli elementi che entrano;
- voto in `_analisi/voti_kit.json`: nuovo giro `"ritmo 13/10 (blocco NN)"` in cima, il giro di prima va in `storia`; campi
  `voti`, `template`, `scena`, `confronto`, **`misure`** (coppie «cosa → valore», con il valore di Kallaway accanto) e `manca`
  (cosa non torna). Esempio: la voce D13;
- `_tools/genera_catalogo_ritmo.py --solo ID1,ID2…` taglia le clip nuove e rigenera la pagina. **Va lanciato dopo ogni voce
  finita**: la pagina aperta nel browser dell'utente controlla `ritmo-clip/_versione.js` ogni 10 s e si ricarica da sola,
  tenendo filtri, velocità e posizione.

Il piano del passo 0 com'era:
1. **Marcatore `KW_RITMO`** (comportamento nuovo solo nelle composizioni che lo dichiarano, come `KW_FISSO` al contrario).
   - `build.cjs` definisce `const KW_RITMO = true` quando il sorgente contiene il marcatore.
   - Funzioni nuove in `kw-kit/kit2-ritmo.js`:
     - `spinta()` (R4);
     - `popK()` (R5);
     - un'opzione `ease` per i riempimenti (`thermo.to`, `progressBar`, contatori…);
     - con `KW_RITMO`, i pop di scala del kit senza `back.out`.
   - **Senza il marcatore non cambia nulla.** Per verificarlo: ricostruire demo-8 e confrontare 3 snapshot prima e dopo, con
     differenza 0.
   - Non vanno toccati `reel-12`, `reel-13`, i reel consegnati e i `KW_FISSO`.
2. **Standard dei template** (sezione sopra), con il primo template di prova: D13 dal lab `_analisi/ritmo/lab-d13/`. Va mostrato
   all'utente prima di andare avanti.
3. **Generatore della pagina** `_tools/genera_catalogo_ritmo.py` → `CATALOGO-ANIMAZIONI/catalogo-ritmo.html` (file locale, video
   relativi). Per ogni voce:
   - **tre video affiancati che partono insieme:**
     - KALLAWAY: `clip/<ID>_1.mp4`, già esistenti;
     - PRIMA: la versione attuale, tagliata dal render di prova più recente (`_analisi/render/*_bozza.mp4`) ai tempi del
       dizionario `IMPL` di `_tools/genera_catalogo.py`; se il render è più vecchio del sorgente va scritto;
     - DOPO: il template nuovo.
   - un pulsante 0,5× e il ciclo continuo;
   - la scheda del template, il codice da copiare e cosa è cambiato rispetto a prima (con la regola);
   - i numeri misurati (inizio e durata del movimento principale, rimbalzo, durata della scena), il voto e «usato nei reel»;
   - filtri per categoria, frequenza, stato e «quando usarlo».
   - Clip PRIMA e DOPO in `CATALOGO-ANIMAZIONI/ritmo-clip/`, altezza 640 px e crf 24.
   - Le voci non ancora rifatte mostrano Kallaway e PRIMA.
4. Prompt per la chat di regia dei blocchi in `PROSSIMA-SESSIONE.md`.

## Prompt di un blocco (lo usa la regia per il sotto-agente; NN = numero del blocco)
```
Lavori nel progetto TEST KALLAWAYMARKETING (C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING). Fai il blocco
NN del rifacimento del catalogo: leggi CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md (scopi, regole, standard dei template, «Come si
fa una composizione di blocco», tabella: le voci del blocco NN), CATALOGO-ANIMAZIONI/_analisi/ritmo/RITMO.md (§4 regole, §8 come
misurare senza sbagliare) e kw-kit/KIT-V2.md (sezione «Ritmo e template»); il modello da copiare è TPL.D13 in
kw-kit/kit2-template.js con la sua scena in CATALOGO-ANIMAZIONI/ritmo-09/. Per ogni voce del blocco: foglio dei fotogrammi del
reel originale di Kallaway ai tempi rif del catalogo e il suo taglio esatto; template TPL.<ID> con la scheda, secondo lo standard
e le regole R1–R8 (vedi la tabella delle decisioni qui sotto); la sua scena nella
composizione CATALOGO-ANIMAZIONI/ritmo-NN/ (KW_RITMO, una scena per voce costruita solo chiamando il template, su una frase vera
degli script dell'utente, coi suoi reel veri in movimento dove servono, safe zone y = 1332, niente caselle di testo) e la riga in
ritmo-NN/scene.json; build, check, snapshot guardate (soprattutto il fotogramma del taglio: la scena dev'essere già piena);
render di prova sotto il lucchetto CATALOGO-ANIMAZIONI/_analisi/render/.lock-render (mkdir + chi.txt, toglierlo alla fine; se
esiste aspetta); controllo con deriva.py e pop.py su OGNI voce, 1–2 elementi che entrano, strisce guardate (e confronto_moto.py solo
su un segmento senza tagli) e correzioni; proporzioni come Kallaway: misura sul suo foglio quanto occupa l'oggetto (telefono,
schermo, grafica) e riempi l'area utile allo stesso modo, niente grafica piccola al centro con il vuoto attorno (ingombro.py);
niente riquadri vuoti in attesa del testo; filtri animati sempre con fromTo e un filtro di partenza esplicito (da «none» fa un
fotogramma nero); la clip KALLAWAY di scene.json deve mostrare proprio il dispositivo della voce, controllata a vista; voto con le
misure in voti_kit.json (giro "ritmo"); riga della tabella; pagina rigenerata con _tools/genera_catalogo_ritmo.py --solo <ID>
DOPO OGNI VOCE FINITA, non solo a fine blocco (l'utente tiene la pagina aperta e si aggiorna da sola).
Se un template ha bisogno di un'opzione nuova in una funzione del kit, aggiungila in coda col default di prima. Anteprima: avvia
solo il server, sulla porta del blocco (:3031 + NN). Non toccare reel-12, reel-13, i reel consegnati, i KW_FISSO e il
comportamento del kit senza KW_RITMO; non lanciare altri sotto-agenti. Se ti fermi per il limite, scrivi la riga di stato in
ritmo-NN/STATO.md (voce per voce: fatto / da fare) e riparti da lì. Rapporto finale alla regia (al massimo 40 righe): voci fatte,
numeri misurati contro Kallaway, cosa non torna, percorsi delle strisce e dei video.
```

**Decisioni dell'utente** (la regia le aggiorna e le passa ai sotto-agenti):
| regola | stato |
|---|---|
| R1–R6 | approvate (13/10) |
| R7 titolo e sfondo fermi (`tplFermo()` / `sfondoFermo()`) | **approvata (14/10)** dopo il blocco 1: in tutte le scene, i puntini seguono la camera solo nelle transizioni morbide |
| R8 transizioni (taglio netto + arrivo; morbida circa 1 volta su 3) | **approvata (14/10)**: nel blocco 1 3 morbide su 11 cambi (O01→C01 linea dall'anello, L11→U10 `tplZoomThrough`, O21→D01 `tplPan`), solo dove le idee si toccano. **Da rivedere a catalogo finito (15/10):** dopo i reel 14–16 l'utente vede le transizioni di Kallaway molto più fluide (pan, zoom-through, match cut), le nostre come dissolvenze. Intanto nei blocchi la maggior parte dei cambi è un movimento di camera continuo, il taglio netto solo per enfasi; lo studio delle transizioni di Kallaway si fa dopo il catalogo |
| standard dei template (D13, + `tplTitoloK` del blocco 1) | **ok (14/10)**, uguale per tutte le voci |
| D13: riempimento | **2,25 s come Kallaway (14/10)**, poi tiene; `parole.arriva` resta un'opzione, non il default della demo |
| sagome e oggetti stock generici | **15/10, dall'anteprima del blocco 3:** «se c'è di meglio usa altro rispetto alla fotocamera e alla silhouette del ragazzo, guarda quello che fa Kallaway». Prima si guarda la soluzione di Kallaway nella voce di riferimento: T01 r79 linea dal riquadro al cervello luminoso; F01 r23 il bagliore accende l'elemento giusto dell'infografica, nessun oggetto in più; gli altri sono persone vere. La sagoma di profilo solo per «chi ti guarda» e solo se non c'è di meglio |

## Regole di lavoro
- **Anteprime:** :3030 lab D13, :3031 `ritmo-09` (D13 del passo 0); il blocco NN usa :3031 + NN (blocco 1 → :3032; il blocco 9
  riusa :3031 dove c'è già D13). Nelle chat dell'utente si aprono appena passa il `check`; i sotto-agenti avviano solo il server.
- **Render:** uno alla volta, con il lucchetto.
- **Reel 14–16:** si possono fare quando ci sono i template dei blocchi 1–3, che contengono le loro voci (vedi la colonna «serve
  a»).

## Eventuali (non adesso)
- **Parole per scena di Kallaway.** Trascrivere i suoi reel (`npx hyperframes@0.8.138 transcribe <mp4> -m small.en -l en`) e
  contare parole e frasi per scena, per affinare R1.

## Tabella di avanzamento
Ci sono 146 voci nel kit; K01, T11, T12 e D08 sono escluse (post-produzione o «da evitare»).

Ordine:
1. le 6 del «Blocco 3 ter»;
2. le voci che servono ai reel 16, 14 e 15;
3. le altre, per frequenza (altissima → alta → media → rara) e categoria.

| blocco | ID | nome | frequenza | serve a | stato | template · tempi | numeri misurati | voto |
|---|---|---|---|---|---|---|---|---|
| 1 | U02 | Profilo Instagram con numeri che salgono | altissima | Blocco 3 ter | **fatto** (blocco 1) | TPL.U02 · ritmo-01 13,75–19,15 s (05/10 «…un profilo perfettamente ottimizzato… ti porterà più follower.») | telefono 0,555 → 0,66 della larghezza col colpo (K r3 0,555 → 0,65; prima 0,376) · arrivo 175 px expo.out 148 → 0,6 px/s (K −175 px 241 → 35) · colpo +19,1% (K +19,3%) · conteggio lineare 0,94 s (K ~1,2 s) · riquadro e pill senza rimbalzo (pop.py) | 5·5·5·5 |
| 1 | O21 | Anelli orbitali di persone | alta | Blocco 3 ter · reel 16 | **fatto** (blocco 1) | TPL.O21 · ritmo-01 50,15–55,0 s (03/10 «…il reel di prova verrà mostrato solo a persone nuove che non ti seguono ancora.») | zoom d'arrivo +10% expo.out 109 → 2,8 px/s · onda 0,40 s (K 0,25–0,33 s) · anelli pieni al taglio · rimbalzo 0 (pop.py, strisce guardate) | 5·5·4·5 |
| 1 | O01 | Anello di reel che ruota | alta | Blocco 3 ter | **fatto** (blocco 1) | TPL.O01 · ritmo-01 1,0–5,6 s (01/10 «L'errore numero uno… Pubblicare di tutto.») | apertura 90% a 0,63 s quasi lineare (K 0,67 s power1.out; prima 0,17 s) · camera ferma +1,2% · 24°/s · rimbalzo 0 (pop.py, strisce guardate) | 5·4·4·5 |
| 1 | L11 | Catena di passi / percorso a tappe | alta | Blocco 3 ter · reel 16 | **fatto** (blocco 1) | TPL.L11 · ritmo-01 31,45–38,0 s (16/10 «…salvalo come bozza. Poi, duplicalo.») | tracciato da bordo a bordo, 10→90% in 0,43 s dal taglio (K r124 0,50 s) · area x 90–980, y 410–1245 (prima x 150–840, y 430–1160), scala 0,915 (prima 0,805) · camera ferma (+0,35%) · video che arriva 0,9 → 1 in 0,13 s senza rimbalzo (pop.py) | 5·5·5·5 |
| 1 | C01 | Linea che si allunga mentre la camera viaggia | altissima | Blocco 3 ter | **fatto** (blocco 1) | TPL.C01 · ritmo-01 5,6–8,75 s (01/10 «Lunedì parlo di fitness, martedì di viaggi, venerdì di motivazione.»), R8 morbida da O01 | viaggio 1113 px, 90% a 0,47 s, picco 3000 px/s, power1.out (K 712–808 px, 0,42–0,71 s, 2360–2970 px/s; prima 7490 px/s) · rimbalzo 0 (pop.py, strisce guardate) | 5·4·4·5 |
| 1 | F08 | Cambio di colore = cambio di stato | altissima | Blocco 3 ter | **fatto** (blocco 1) | TPL.F08 · ritmo-01 8,75–13,75 s (01/10 «…l'algoritmo non capisce… e nemmeno chi ti guarda.») | onda 0,40 s (K r13 0,33 s) · pill secca 1–3 fotogrammi (K r88 1) · arrivo 139 → 1,6 px/s expo.out (K 175 → 11) · rimbalzo 0 (pop.py, strisce guardate) | 5·4·4·5 |
| 1 | U03 | Cursore che clicca | media | reel 16 | **fatto** (blocco 1) | TPL.U03 · ritmo-01 19,15–26,95 s (05/10 «…vai sul sito pfpmaker.com, carica una foto… seleziona il tuo sfondo colorato.») | camera ferma +0,8% (K 0–9 px) · cursore al taglio, metà strada 0,12 s (K ~0,125 s) · seconda inquadratura +11,7% · rimbalzo 0 (pop.py, strisce guardate) | 5·5·4·5 |
| 1 | D01 | Contatore + grafico che si disegna + bagliore finale | altissima | reel 16 | **fatto** (blocco 1) | TPL.D01 · ritmo-01 55,0–59,4 s (03/10 «Stesso identico video ma raddoppi le visualizzazioni, gratis.»), R8 morbida da O21 (scorre di lato) | ingresso 973 px, 90% a 0,53 s, picco 2008 px/s sine.out (K r9 736 px, 0,58 s, 1972 px/s; prima 9374 px/s) · conteggio lineare 1,5 s (K 0,7–1 s) · rimbalzo 0 (pop.py, strisce guardate) | 5·5·4·5 |
| 1 | U10 | Bozze di Instagram: tre puntini → Duplica (con la lente) | rara | reel 16 | **fatto** (blocco 1) | TPL.U10 · ritmo-01 38,0–42,35 s (03/10 «Apri le bozze, tocca i tre puntini… e duplicalo.»), R8 morbida da L11 (zoom-through) | telefono 0,435 della larghezza (K r65 schermo 0,415; prima 0,376) · zoom-through 0,16 + 0,45 s, assestamento +8,4% 84 → 3 px/s · camera poi ferma (K r65 ferma) · foglio expo.out senza rimbalzo · 3 accenti sulle parole | 5·5·4·5 |
| 1 | U11 | Nuovo reel: interruttore "Reel di prova" e Condividi | rara | reel 16 | **fatto** (blocco 1) | TPL.U11 · ritmo-01 42,35–46,15 s (03/10 «Ora prendi la prima bozza e pubblicala come reel di prova.») | telefono 0,435 della larghezza (K r65 schermo 0,415; prima 0,376) · arrivo 175 px expo.out 148 → 0,7 px/s · reel che esce e PROVA senza rimbalzo (pop.py) · camera poi ferma (K r65 ferma) | 5·5·4·5 |
| 1 | U07 | Dito che preme un bottone (UI Instagram) | rara | reel 16 | **fatto** (blocco 1) | TPL.U07 · ritmo-01 46,15–50,15 s (03/10 «Poi torna indietro e pubblica la seconda bozza come reel normale.») | telefono 0,435 della larghezza (K r65 schermo 0,415; prima 0,376) · arrivo 175 px expo.out 148 → 0,7 px/s · reel che esce e NORMALE senza rimbalzo (pop.py) · camera poi ferma (K r65 ferma) | 5·5·4·5 |
| 1 | T05 | Testo che si decodifica (glitch) | rara | reel 14 | **fatto** (blocco 1) | TPL.T05 · ritmo-01 26,95–31,45 s (14/10 «L'algoritmo ci mostra soprattutto i contenuti con tantissima interazione.») | decodifica 7 fotogrammi da 0,05 s dopo il taglio (K 4–5 fotogrammi) · arrivo 136 → 2,9 px/s expo.out · numeri lineari 0,6 s · rimbalzo 0 (pop.py, strisce guardate) | 5·4·4·5 |
| 2 | F02 | Pulse a disco pieno | altissima | reel 14 | **fatto** (blocco 2) | TPL.F02 · ritmo-02 1,0–6,1 s (14/10 «Se non diventi virale… E se si sbagliassero?») | disco pieno in 0,07 s, diametro 0,50 → 0,62 della larghezza, via in 0,43 s (K r14 0,17 s, ~0,5 s; r7 0,47 → 0,57 in 0,32 s) · etichetta 0,90 → 1 in 0,15 s senza rimbalzo (pop.py; K r14 +10% e torna) · griglia 0,69 della larghezza (K r14 0,68) · arrivo 140 px expo.out 162 px/s a 0,25 s | 5·5·5·5 |
| 2 | K11 | Scroll 'slot machine' di un muro di miniature | media | reel 14 | **fatto** (blocco 2) | TPL.K11 · ritmo-02 9,75–13,6 s (14/10 «Non lo è. È l'eccezione mostrata in continuazione.») | apertura 0,35 s con la scia 0,27 s (K r61 0,42 s, scia 0,375 s) · scorrimento 0,6 s (K r61 0,54 s) · eccezione accesa in 0,25 s a scala fissa (pop.py, K ~0,25 s) · muro a tutto schermo 0,97 della larghezza (K 0,98) | 5·5·5·4 |
| 2 | F04 | Riflettore + oscuramento del resto | alta | reel 14 | **fatto** (blocco 2) | TPL.F04 · ritmo-02 13,6–17,3 s (14/10 «…ogni video sotto quella soglia sembra un fallimento.»), R8 morbida da K11 (zoom-through) | riflettore: il resto dal 100 al 67% in 0,27 s, grigio (K r61 al 72% in 0,37 s; r54 ~0,2 s) · scelto senza crescere né rimbalzo (pop.py; prima 1,05) · zoom-through 0,16 s + assestamento 0,86 → 1 in 0,4 s power3.out senza overshoot · grafico 0,78 della larghezza (K r54 card 0,65) | 5·5·4·5 |
| 2 | O13 | Cervello luminoso | alta | reel 14 | **fatto** (blocco 2) | TPL.O13 · ritmo-02 6,1–9,75 s (14/10 «E il cervello si convince che quello sia il livello normale.») | battito acceso/spento a ogni fotogramma per 5 fotogrammi, disco 0,15 s prima (K r48 stesso schema, 1,72 → 1,88 s) · zoom d'arrivo +15% in 0,4 s expo.out, poi ferma · riquadro dell'etichetta che entra con la scritta, 0,93 → 1 senza rimbalzo, scritta in 0,6 s (K r34 insieme, ~0,6 s; prima vuoto dal taglio) · cervello 0,43 della larghezza, card 0,65 (K r34 0,50; r48 0,43) | 5·5·4·5 |
| 2 | O10 | Bersaglio costruito dal centro | media | reel 14 | **fatto** (blocco 2) | TPL.O10 · ritmo-02 17,3–22,75 s (14/10 «L'obiettivo non è un milione di visualizzazioni. È arrivare alle persone giuste…») | costruzione dal centro 0,77 s quasi lineare senza overshoot (K r42 0,85 s lineare, −6% di ritorno; prima 0,32 s a anello) · bersaglio 0,81 della larghezza (K r42 0,63; prima stesura 0,58) · camera ferma · etichetta del centro senza crescere (pop.py) · freccetta senza scossa | 5·4·5·5 |
| 2 | O24 | Calendario che si riempie | media | reel 15 | **fatto** (blocco 2) | TPL.O24 · ritmo-02 27,2–31,15 s (15/10 «Scegli un volume. Uno al giorno vuol dire 30 video al mese.») | 30 reel veri dell'utente in 1,2 s, 0,04 s a giorno, lineare (K r67 31 giorni in ~1,1 s) · ogni reel 0,96 → 1 in 0,13 s senza rimbalzo (pop.py; prima back.out da 0,5) · arrivo 140 px expo.out 161 → 2 px/s · calendario 0,78 della larghezza (K r67 ~0,7) | 5·5·5·5 |
| 2 | D06 | Barra di avanzamento / timeline del video | media | reel 15 | **fatto** (blocco 2) | TPL.D06 · ritmo-02 51,2–55,75 s (15/10 «Ecco come pianifici 30 giorni di contenuti in meno di 30 secondi.»), R8 morbida da K16 (scorre di lato) | testina lineare dal primo fotogramma, 2,7 s, contatore 0:00 → 0:28 (K r24 tempo che corre, segmenti in ordine) · scorrimento 1146 px, 90% in 0,53 s, picco 2337 px/s sine.out (K r9 736 px, 0,58 s, 1972 px/s) · capitoli senza rimbalzo (pop.py) · 0,82 della larghezza (K r24 0,74) | 5·5·5·5 |
| 2 | U15 | Timer, conto alla rovescia | rara | reel 15 | **fatto** (blocco 2) | TPL.U15 · ritmo-02 22,75–27,2 s (15/10 «30 giorni di contenuti pianificati in meno di 30 secondi.») | cronometro in tempo reale, lineare (K r146 e r13 in tempo reale) · anello dei 30 giorni pieno in 1,57 s dal primo fotogramma, quasi lineare (K r13 scansione del calendario ~0,85 s) · segmenti accesi interi, senza rimbalzo (pop.py) · anello 0,78 della larghezza | 5·5·5·5 |
| 2 | O23 | Griglia di 100 puntini | rara | reel 15 | **fatto** (blocco 2) | TPL.O23 · ritmo-02 31,15–36,65 s (15/10 «Io uso 70% valore, 20% fiducia, 10% conversione.») | 70 puntini lime in 0,7 s (10 → 90%) su «valore», 20 bianchi in 0,2 s, 10 anelli: un gruppo per parola, lineare (K r88 accensioni a caso in ~2 s, colore in 1 fotogramma) · arrivo 140 px expo.out 136 → 1,7 px/s · griglia 0,72 della larghezza (K r88 0,49; prima 0,56) · legenda senza crescere (pop.py) | 5·4·5·5 |
| 2 | L09 | Albero / flowchart che cresce | altissima | reel 15 | **fatto** (blocco 2) | TPL.L09 · ritmo-02 36,65–39,5 s (15/10 «Scegli i tuoi filoni tematici dentro la tua nicchia.») | filoni sfocati già al taglio, rami 0,35 s sfalsati di 0,06 s, a fuoco in ~0,75 s (K r3 un livello in ~0,5 s) · reel sotto i rami senza rimbalzo (pop.py) · albero 0,79 della larghezza (K r3 0,64) · camera ferma | 5·5·4·5 |
| 2 | L12 | Documento "Video Script" che si costruisce | alta | reel 15 | **fatto** (blocco 2) | TPL.L12 · ritmo-02 39,5–45,6 s (15/10 «Scrivi gli script con un metodo fisso. Io uso hook, spiega, mostra, insegna.»), R8 morbida da L09 (zoom-through) | documento pieno al taglio (K r26 pieno al taglio) · una sezione per parola: 3 righe in 0,23 s (0,3 s a riga), la prima diventa bianca · zoom-through + assestamento 0,97 → 1 in 0,2 s senza overshoot · etichette senza crescere (pop.py) · documento 0,64 della larghezza (K r26 0,57) | 5·4·4·5 |
| 2 | K16 | Push-in lento su un oggetto che si costruisce | alta | reel 15 | **fatto** (blocco 2) | TPL.K16 · ritmo-02 45,6–51,2 s (15/10 «…organizza tutto in un calendario, alternando i filoni durante la settimana…») | spinta +15% in 2 s power2/3.out, 115 → 37 → 0 px/s (K r35 +15,8% in ~2 s, il documento +10,8% e rallenta) · tre accenti sulle parole, pill senza rimbalzo (pop.py) · scheda 0,50 → 0,56 della larghezza (K r35 0,48 → 0,53) | 5·4·4·5 |
| 3 | X01 | "Commenta X" + anteprima della risorsa | altissima | reel 15 | **fatto (reel 15), demo e misure nel blocco 3** | TPL.X01 (`kit2-tpl-chiusura.js`) · reel-15 39,33–41,73 s (15/10 «Commenta sistema e ti mando il comando…») | | |
| 3 | U01 | Chat AI ricreata + prompt che si digita | alta | reel 15 | **fatto (reel 15), demo e misure nel blocco 3** | TPL.U01 (`kit2-tpl-ui.js`) · reel-15 41,73–45,83 s (15/10 «…il comando che uso per scrivere i copioni con questo metodo.»), R8 morbida da X01 (zoom-through); nel reel `h: 1060` (con la risposta a 4 sezioni la finestra da 900 sovrapponeva il campo) | | |
| 3 | A01 | Muro o griglia di reel veri con badge views | altissima |  | **fatto** (blocco 3) | TPL.A01 · ritmo-03 1,0–5,95 s (02/10 «Non ti mancano le idee. Stai guardando i contenuti degli altri invece di fare i tuoi.») | zoom d'arrivo +9,4% in 0,3 s expo.out, poi ferma (K: griglia costruita in 0,3 s, camera ferma) · badge 0,66 → 1 in 0,13 s, uno ogni 0,08 s, rimbalzo 0 (pop.py; K r1 0,66 → 1 in 0,13 s, 0,07–0,13 s) · muro 0,66 della larghezza (K r1 0,68) · visualizzazioni vere | 5·5·4·5 |
| 3 | D02 | Badge views che poppano in sequenza | altissima |  | da fare | | | |
| 3 | F01 | Glow (bloom) su testi e oggetti | altissima |  | da fare | | | |
| 3 | F03 | Sheen (banda di luce) | altissima |  | da fare | | | |
| 3 | K03 | Spostamento di camera tra due oggetti | altissima |  | da fare | | | |
| 3 | K04 | Drift continuo (la camera non è mai ferma) | altissima |  | da fare | | | |
| 3 | L01 | Lista con voci-segnaposto sfocate | altissima |  | da fare | | | |
| 3 | L02 | Una voce si risolve con uno sheen | altissima |  | da fare | | | |
| 3 | T01 | Titolo parola per parola, sincronizzato alla voce | altissima |  | **fatto** (blocco 3) | TPL.T01 · ritmo-03 5,95–11,0 s (07/10 «Ci sono solo tre emozioni che tengono qualcuno davanti a un video fino alla fine.») | parole sulla voce, 9 px → nitide in 0,2 s (K r79 0,17–0,21 s) · 3 cambi di clip secchi sulle parole (K r79 3 cambi in 0,5 s) · arrivo 120 px, 90% in 0,25 s expo.out, poi fermo · sagoma senza rimbalzo (pop.py) · barra lineare 1,9 s · reel 0,45 della larghezza (K r79 card orizzontale 0,68) | 5·5·4·5 |
| 3 | T02 | Box evidenziatore che cresce insieme alle parole | altissima |  | da fare | | | |
| 4 | U05 | Card dati in vetro | altissima |  | da fare | | | |
| 4 | A02 | Logo o oggetto protagonista già in scena | alta |  | da fare | | | |
| 4 | A03 | Documento/copione che si compila | alta |  | da fare | | | |
| 4 | C04 | Linea guida con etichetta che si scrive sopra | alta |  | da fare | | | |
| 4 | D04 | Retention che crolla | alta |  | da fare | | | |
| 4 | F06 | Onde d'urto | alta |  | da fare | | | |
| 4 | F11 | Tinta rossa/verde sulle miniature | alta |  | da fare | | | |
| 4 | H02 | Cerchio / freccia a mano su uno screenshot | alta |  | da fare | | | |
| 4 | H03 | Tag inclinati attorno a un reel | alta |  | da fare | | | |
| 4 | K02 | Arrivo in movimento dopo il taglio | alta |  | da fare | | | |
| 4 | K09 | Uscita seguendo una linea (il titolo resta nel mondo) | alta |  | da fare | | | |
| 4 | K13 | Match cut: un punto diventa l'oggetto | alta |  | da fare | | | |
| 5 | K14 | Una voce della lista diventa l'intestazione | alta |  | da fare | | | |
| 5 | L10 | Parentesi che raggruppa | alta |  | da fare | | | |
| 5 | L14 | Griglia di esempi con etichette | alta |  | da fare | | | |
| 5 | O03 | Hub con loghi collegati | alta |  | da fare | | | |
| 5 | O05 | Piramide a livelli con bandiere | alta |  | da fare | | | |
| 5 | O25 | Telefono / tablet / lavagna come schermo | alta |  | da fare | | | |
| 5 | T07 | Sottolineatura d'accento che cresce | alta |  | da fare | | | |
| 5 | T08 | Uscita del titolo: diventa grigio e se ne va | alta |  | da fare | | | |
| 5 | A04 | Anello o orbita che si apre | media |  | da fare | | | |
| 5 | A05 | Clip vera che diventa infografica | media |  | da fare | | | |
| 5 | A06 | Tipografia gigante che diventa oggetto | media |  | da fare | | | |
| 5 | A07 | Profilo o UI con numeri che salgono | media |  | da fare | | | |
| 6 | C02 | Linea che diventa flusso di puntini | media |  | da fare | | | |
| 6 | C06 | Pill dell'algoritmo in stile codice che riceve i segnali | media |  | da fare | | | |
| 6 | D03 | Curva che si disegna con etichette e camera che la segue | media |  | da fare | | | |
| 6 | D05 | Barre con avatar in cima | media |  | da fare | | | |
| 6 | F07 | Raggi vivi dietro un logo | media |  | da fare | | | |
| 6 | H01 | Annotazioni con freccia a ricciolo | media |  | da fare | | | |
| 6 | H04 | Angoli di selezione (mirino) che si chiudono su un elemento | media |  | da fare | | | |
| 6 | K05 | Whip pan con motion blur | media |  | da fare | | | |
| 6 | K07 | Zoom-through (si passa 'attraverso' la scena) | media |  | da fare | | | |
| 6 | K10 | Messa a fuoco d'apertura (rack focus) | media |  | da fare | | | |
| 6 | K12 | Nastro trasportatore | media |  | da fare | | | |
| 6 | L03 | La lista si accende a cascata | media |  | da fare | | | |
| 7 | L04 | Checklist con spunte | media |  | da fare | | | |
| 7 | L05 | Lista con lucchetti che si sbloccano | media |  | da fare | | | |
| 7 | L08 | Tabella che si compila | media |  | da fare | | | |
| 7 | L13 | Confronto a due colonne | media |  | da fare | | | |
| 7 | L15 | Pila di card: le già viste si impilano | media |  | da fare | | | |
| 7 | O02 | Anello di loghi che esplode e poi implode | media |  | da fare | | | |
| 7 | O04 | Loghi in orbita attorno al protagonista | media |  | da fare | | | |
| 7 | O06 | Imbuto a strati | media |  | da fare | | | |
| 7 | O07 | Scala al neon | media |  | da fare | | | |
| 7 | O08 | Triade che ruota e porta in alto la voce detta | media |  | da fare | | | |
| 7 | O11 | Due cerchi che diventano un Venn | media |  | da fare | | | |
| 7 | O12 | Lenti / sfere di vetro | media |  | da fare | | | |
| 8 | O14 | Slot machine / casinò | media |  | da fare | | | |
| 8 | O18 | Tubo al neon che si disegna + riflesso che corre | media |  | da fare | | | |
| 8 | O20 | Radar | media |  | da fare | | | |
| 8 | O22 | Folla in un riquadro con contatore | media |  | da fare | | | |
| 8 | O26 | Figura umana 3D (una persona col telefono) | media |  | da fare | | | |
| 8 | O28 | Blocchi che si impilano in una torre (i pezzi) | media |  | da fare | | | |
| 8 | T03 | Box già disegnato + testo a macchina da scrivere | media |  | da fare | | | |
| 8 | T04 | Lettere che compaiono in ordine casuale | media |  | da fare | | | |
| 8 | T06 | Etichetta a macchina da scrivere | media |  | da fare | | | |
| 8 | T09 | Una parola del titolo viene sostituita | media |  | da fare | | | |
| 8 | T10 | Il titolo si riorganizza (compatto) | media |  | da fare | | | |
| 8 | T13 | Testo che si corregge: parole barrate e tolte | media |  | da fare | | | |
| 9 | A08 | Risposta sfocata indicata da una freccia | rara |  | da fare | | | |
| 9 | C03 | Segnale con segno che viaggia | rara |  | da fare | | | |
| 9 | C05 | Circuito ad angoli retti | rara |  | da fare | | | |
| 9 | D07 | Formula che si compone | rara |  | da fare | | | |
| 9 | D09 | Percentuale al centro di un anello di persone | rara |  | da fare | | | |
| 9 | D10 | Anello di progresso che si riempie | rara |  | da fare | | | |
| 9 | D11 | Corsa: curve o barre che salgono a velocità diverse | rara |  | da fare | | | |
| 9 | D12 | Scala a gradiente con il cursore | rara |  | da fare | | | |
| 9 | D13 | Termometro verticale che si riempie | rara |  | **fatto (passo 0)** | TPL.D13 · ritmo-09 1,0–6,1 s (06/10 «…uno step alla volta») | riempimento lineare 2,25 s (K 2,25 s), poi tiene (14/10, senza parole.arriva; prima 4,05 s) · spinta +9,0% in 3 s (K +9,6% in 2,4 s) · angoli 79/35/2 px/s (K 86/41/8) · rimbalzo 0 | 5·4·4·5 |
| 9 | D14 | Forma d'onda audio | rara |  | da fare | | | |
| 9 | D15 | Cartellino del prezzo che oscilla e conta | rara |  | da fare | | | |
| 9 | D16 | Il righello della proporzione che diventa l'anello attorno a te | rara |  | da fare | | | |
| 10 | F05 | Lampeggio di attivazione | rara |  | da fare | | | |
| 10 | F09 | Mosaico / pixel | rara |  | da fare | | | |
| 10 | F10 | Disintegrazione in particelle | rara |  | da fare | | | |
| 10 | F12 | Timbro che cala | rara |  | da fare | | | |
| 10 | F13 | La luce cambia sul soggetto (dal buio al controluce) | rara |  | da fare | | | |
| 10 | F14 | Prima e dopo con la tendina | rara |  | da fare | | | |
| 10 | K06 | Punch-in sulla parola chiave | rara |  | da fare | | | |
| 10 | K08 | La camera segue un oggetto che cade/vola | rara |  | da fare | | | |
| 10 | K15 | Light leak / flash (era podcast) | rara |  | da fare | | | |
| 10 | K17 | Mappa a loop: la camera viaggia lungo il simbolo da una tappa all'altra | rara |  | da fare | | | |
| 10 | K18 | L'oblò: la camera entra in un cerchio e ne esce | rara |  | da fare | | | |
| 10 | L06 | Indice fisso in un angolo | rara |  | da fare | | | |
| 11 | L07 | Tier list | rara |  | da fare | | | |
| 11 | L16 | Elementi che si riordinano (la griglia si rimescola) | rara |  | da fare | | | |
| 11 | O09 | Morph di forma | rara |  | da fare | | | |
| 11 | O15 | Clessidra | rara |  | da fare | | | |
| 11 | O16 | Acqua: sasso e onde | rara |  | da fare | | | |
| 11 | O17 | Onda che inghiotte | rara |  | da fare | | | |
| 11 | O19 | Costellazione di punti | rara |  | da fare | | | |
| 11 | O27 | Amo da pesca che aggancia (il hook) | rara |  | da fare | | | |
| 11 | O29 | Testa di profilo con il cervello dentro | rara |  | da fare | | | |
| 11 | O30 | Bivio: la strada si divide in due rami luminosi | rara |  | da fare | | | |
| 11 | O31 | Razzo che decolla | rara |  | da fare | | | |
| 11 | O32 | Cartella che si apre a ventaglio | rara |  | da fare | | | |
| 12 | O33 | Scala a gradini con la folla sulle alzate (la scala della luce) | rara |  | da fare | | | |
| 12 | O34 | Stanza in prospettiva con la lampadina nuda | rara |  | da fare | | | |
| 12 | O35 | Il contenuto diventa un cartellone pubblicitario | rara |  | da fare | | | |
| 12 | O36 | La gente che passa e il posto del cliente che resta vuoto | rara |  | da fare | | | |
| 12 | U04 | Interruttori che si accendono | rara |  | da fare | | | |
| 12 | U06 | Lower third con barra d'accento | rara |  | da fare | | | |
| 12 | U08 | Impostazioni di Instagram con interruttori veri | rara |  | da fare | | | |
| 12 | U09 | Notifica DM con la foto profilo vera | rara |  | da fare | | | |
| 12 | U12 | Azioni del reel che si accendono (like, commenti, condividi, salva) | rara |  | da fare | | | |
| 12 | U13 | Commenti o notifiche che si moltiplicano | rara |  | da fare | | | |
| 12 | U14 | Mirino della fotocamera (angoli, REC, batteria) | rara |  | da fare | | | |
| 12 | U16 | Storie di Instagram: fila, editor, storia aperta (UI del vecchio stile) | rara |  | da fare | | | |
| 13 | U17 | Orologio: le lancette corrono (l'ora) | rara |  | da fare | | | |
| 13 | U18 | Profilo con le storie in evidenza in ordine | rara |  | da fare | | | |
