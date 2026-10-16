# Reel 14, 15 e 16 dai template del catalogo (versione snella)

Scritto il 15/10. L'utente ha fretta di avere i reel 14/10, 15/10 e 16/10 e vuole consumare meno token e sessioni possibile.
Il grosso dei token se ne andava nelle verifiche, non nella creazione: i template del catalogo sono già misurati contro
Kallaway, quindi nei reel non si rimisurano. La verifica vera la fa l'utente guardando l'anteprima.

Parte A = prompt della chat di regia (da incollare). Parte B = istruzioni del sotto-agente di un reel (la regia gli dice di
leggerle).

## Parte A · prompt della regia (incollare in una chat nuova)
```
Sei la regia dei reel 14/10, 15/10 e 16/10 in TEST KALLAWAYMARKETING (C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST
KALLAWAYMARKETING). Leggi solo PROMPT-REEL-14-16.md e la memoria del progetto. Non aprire tu kit, sorgenti, snapshot o render:
in questa chat non si fanno verifiche con le immagini, la verifica è la mia, sull'anteprima.
Lancia UN sotto-agente per reel, in ordine 14 → 15 → 16, mai due insieme. Prompt del sotto-agente: "Sei un sotto-agente: non
parli con l'utente. Leggi TEST KALLAWAYMARKETING/PROMPT-REEL-14-16.md, Parte B, e falla per il SOLO reel DD/10. Non fare il 4K
finché la regia non te lo dice."
Quando arriva il rapporto di un reel:
- aprimi nel browser l'anteprima (porta della Parte B) e il render di prova;
- scrivimi in 3–4 righe il concept e cosa c'è;
- lancia subito il sotto-agente del reel dopo, senza aspettare il mio giudizio (i render vanno uno alla volta, col lucchetto).
Le mie correzioni le passi allo STESSO sotto-agente con SendMessage. Quando dico ok a un reel, digli di fare la consegna 4K
(Parte B, «Consegna»). Se un sotto-agente si ferma per il limite, lo riprendi con SendMessage dalla riga di stato del suo
reel-DD/PIANO.md. Dopo ogni consegna aggiorna PROSSIMA-SESSIONE.md (2–3 righe: stato e lezioni). Il catalogo è in pausa
(blocco 3 fermo a 2 voci su 12, ritmo-03/STATO.md): non lanciarlo.
```

## Parte B · un reel (sotto-agente)
Progetto: `C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING`, HyperFrames 0.8.138, kit `kw-kit` v2, 30 fps,
1080×1920.

**Da leggere (solo questo):**
- `kw-kit/KIT-V2.md`, sezione «Ritmo e template»;
- `CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md`: «Regole del ritmo da applicare», tabella delle decisioni e righe della tabella con
  «serve a» = il tuo reel;
- le scene di `CATALOGO-ANIMAZIONI/ritmo-01/` e `ritmo-02/` (`index.src.html`, `scene.json`) costruite sulle frasi del tuo
  script: sono già pronte, si copiano le chiamate `TPL.<ID>(…)`;
- come modello di reel completo (parole, titoli, safe zone, consegna): `reel-13/` (`PIANO.md`, `index.src.html`).

**Template.** Ogni voce del catalogo rifatta è `TPL.<ID>(scena, opzioni)` in `kw-kit/kit2-tpl-*.js`. In testa a ogni template
c'è la scheda: quando usarlo, parametri, durata, esempio. Il codice da copiare è anche nella pagina
`CATALOGO-ANIMAZIONI/catalogo-ritmo.html`. Ritmo e proporzioni sono già misurati contro Kallaway: **non rimisurarli**.
- **Reel 14** (14/10): T05, F02, K11, F04, O13, O10.
- **Reel 15** (15/10): O24, D06, U15, O23, L09, L12, K16.
  - Mancano X01 («Commenta X» + anteprima della risorsa) e U01 (chat AI ricreata come UI vera, col prompt che si digita).
  - Falli tu come template, secondo lo standard (scheda in testa, `kw-kit/kit2-tpl-<categoria>.js`).
  - Segnali «fatto (reel 15), demo e misure nel blocco 3» nella tabella di RIFACIMENTO-RITMO.md e in `ritmo-03/STATO.md`.
- **Reel 16** (16/10): L11, U10, U11, U07, O21, D01, U03; per il profilo anche U02, C01, F08, O01.
- Per tutti: in più ogni template della pagina che spiega una frase meglio di questi.
- Per una frase senza template adatto: il template più vicino con opzioni nuove (in coda, col default di prima) oppure una
  funzione piccola in `kw-kit/kit2-reelDD.js`. Niente campagne di misura.

**Tempi.**
- Parole: `../my-video-ottobre-p1-test/src/words/dDD.ts` (esiste già); indici e tempi con
  `python -X utf8 _tools/parole.py ../my-video-ottobre-p1-test/src/words/dDD.ts`.
- Un solo controllo: numero di parole e durata uguali al CSV `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\timestamps_ottobre_p1.csv` e
  all'mp3 `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\velocizzati 110%\2026-10-DD.mp3`.
- La durata della composizione è quella dell'mp3. Titoli parola per parola sulle parole dette. Ogni gesto principale cade
  sulla parola che lo spiega (il parametro `parole` dei template).

**Come si costruisce.**
1. `reel-DD/PIANO.md`, breve:
   - concept: un mondo e una metafora per il reel, diversi dagli altri due;
   - tabella delle scene: tempo, frase, `TPL.<ID>`, transizione;
   - una riga di stato in testa (fatto / da fare), così se ti fermi per il limite si riparte da lì.
2. Composizione `reel-DD/` con il marcatore `KW_RITMO`.
   - Le scene sono i template messi in punti diversi del mondo (X, Y).
   - Una scena per idea, circa 4 s (fra 2,5 e 7).
   - Ogni template una volta sola (due solo se è il centro del concept), e se possibile non lo stesso nei tre reel.
   - R7: `tplFermo()` in fondo alla composizione.
   - R8: taglio netto + arrivo che frena; una transizione morbida circa una volta su tre, dove le idee si toccano
     (`tplZoomThrough`, `tplPan`, linea che parte dalla scena prima).
3. Materiali:
   - i reel veri dell'utente in movimento, riusando gli spezzoni già tagliati in `ritmo-01/assets` e `ritmo-02/assets`, oppure
     da `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\DA PUBBLICARE` (30 fps, senza audio);
   - la sua foto `kw-kit/avatars/tu.jpg` dove c'è «tu».

**Verifiche: SOLO queste, una volta.**
1. `check`: 0 errori.
2. Un render di prova `render --quality draft` in `CATALOGO-ANIMAZIONI/_analisi/render/reel-DD_bozza.mp4`, sotto il lucchetto
   `CATALOGO-ANIMAZIONI/_analisi/render/.lock-render` (mkdir + chi.txt, toglierlo alla fine; se esiste aspetta).
3. `_tools/venv/Scripts/python.exe -I _tools/safezone.py` sulla bozza: 0 campioni sotto 1332.
4. UN foglio di fotogrammi dalla bozza, uno per scena sulla parola chiave (12–16 riquadri), guardato una volta. Controlla solo:
   - la scena è piena;
   - niente è tagliato o finisce sotto il titolo;
   - ogni elemento spiega la frase.

Correggi solo quello che il foglio mostra e rifai la bozza una volta.
**Non** usare deriva.py, pop.py, confronto_moto, confronto_video, densita.py e snapshot a blocchi: i template li hanno già
passati.

**Fine.**
- Avvia il server di anteprima (14 → :3054, 15 → :3055, 16 → :3056:
  `cd reel-DD/composition && npx --yes hyperframes@0.8.138 preview --background --port 30xx`).
- Rapporto alla regia, al massimo 15 righe: concept, scene con i `TPL` usati, template nuovi, percorsi di bozza e foglio,
  porta.

**Consegna** (solo quando la regia te lo dice, dopo l'ok dell'utente):
- `node kw-kit/deliver.cjs reel-DD DD`, senza copertina;
- ffprobe: 2160×3840, 30 fps, durata uguale all'mp3;
- `safezone.py` sul 4K;
- copia di `2026-10-DD - INFOGRAFICA KALLAWAY STYLE (4K, senza copertina).mp4` in
  `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\INFOGRAFICA REMOTION\STILE KALLAWAY`.

**Preferenze fisse dell'utente:**
- niente caselle di testo: ogni scena è un'infografica + titolo, e ogni elemento spiega quello che si dice;
- oggetti, foto e reel veri;
- per «chi ti guarda» la silhouette nera di profilo su disco bianco;
- le schermate vere di Instagram col dito che preme nelle parti su Instagram;
- niente ragazzo d'argilla col telefono; il cervello pulsa come in Kallaway;
- safe zone a 1332;
- niente audio sotto le bozze; il 4K esce senza voce, la mette lui in post.

**Regole:**
- non modificare il comportamento delle funzioni del kit né dei template: opzioni in coda col default di prima, funzioni nuove
  in `kw-kit/kit2-reelDD.js`;
- non toccare `ritmo-NN/`, i reel 01–13 e i `KW_FISSO`;
- render uno alla volta col lucchetto;
- non lanciare altri sotto-agenti.
