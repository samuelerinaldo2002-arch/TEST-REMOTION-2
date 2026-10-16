Lavoriamo in `C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING`: infografiche in stile Kallaway con HyperFrames 0.8.138 e il kit `kw-kit` (v2).
Obiettivo: le infografiche dei reel 10/10, 11/10, 12/10 e 13/10, tutte allo stesso livello del reel 09/10 appena approvato ("mi piace molto"). Non ci deve essere degradazione: il 13 va curato esattamente come il 10.

Prima di tutto leggi, in quest'ordine:
1. `PROSSIMA-SESSIONE.md`: regole, stato, comandi, trappole tecniche (anche quelle della sessione 4) e la sezione dell'altra chat sul catalogo.
2. `kw-kit/KIT-V2.md`.
3. `reel-09/PIANO.md` e `reel-09/index.src.html` (e `reel-10/`, consegnato nella sessione 5: storie di Instagram, mondo verticale, contatore delle visualizzazioni): il reel 09 è il modello più recente (concept con metafora, camera, titoli sulla voce, densità, spezzoni dei miei reel, `persona()`, `reelFrame()`). Per le schermate di Instagram il modello è `reel-03/`.
4. La memoria del progetto.

COME LAVORARE SENZA DEGRADARE
- Un reel alla volta, nell'ordine 10 → 11 → 12 → 13. Riparti sempre dal primo non ancora consegnato secondo `PROSSIMA-SESSIONE.md`.
- Ogni reel passa da tutte le tappe della procedura qui sotto, anche se è più corto o sembra più semplice. Nessuna scorciatoia sui reel successivi.
- Quando un reel è consegnato (4K verificato), aggiorna `PROSSIMA-SESSIONE.md` con lo stato vero e le lezioni imparate.
- Se la conversazione è già stata compattata o è diventata lunga, fermati e dammi il prompt per continuare in una chat nuova dal reel successivo (va bene questo stesso prompt). Meglio una chat in più che un reel fatto peggio.

TEMPI: TUTTO A TEMPO CON I TIMESTAMP DELLA VOCE
- Sorgente dei tempi: `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\timestamps_ottobre_p1.csv` (ElevenLabs, parola per parola, in secondi), presi sull'mp3 `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\velocizzati 110%\2026-10-DD.mp3`.
- Testo completo degli script: `piano-editoriale-2026-10-01_2026-10-16-script.csv`, nella stessa cartella.
- Dal CSV si generano i `../my-video-ottobre-p1-test/src/words/dDD.ts` (fotogrammi a 30 fps) con `node scripts/gen-words.cjs DD/10/2026` (in `my-video-ottobre-p1-test`).
- Prima di costruire ogni reel controlla che il `.ts` corrisponda al CSV: stesse parole, tempi entro un fotogramma, durata uguale all'mp3. Se non corrisponde, rigeneralo.
- Indici e tempi delle parole: `python -X utf8 _tools/parole.py ../my-video-ottobre-p1-test/src/words/dDD.ts`. Nel sorgente: `<!--WORDS ../../my-video-ottobre-p1-test/src/words/dDD.ts-->`, poi i tempi con `wt(i)` / `at()`.
- I titoli entrano parola per parola sulle parole dette: solo parole dette, uscita almeno 0,45 s prima del titolo successivo.
- Ogni gesto importante (un oggetto che arriva, un colpo, un cambio di stato, un taglio) cade sulla parola che lo spiega.
- La durata della composizione è quella dell'mp3.
- Prova di sincronia (dal 12/10): niente `_sync.mp4` con l'mp3 montato sotto, perché costa tempo e token. La sincronia viene dai tempi del CSV; dopo il render di prova si controllano i fotogrammi della bozza sulle parole chiave, ai secondi del CSV / `dDD.ts`. Il 4K finale resta senza voce (la aggiungo io in post).

I QUATTRO REEL
- 10/10 "Come funziona l'algoritmo delle storie" (34,1 s). È una funzione di Instagram: storie vere nella UI di Instagram del vecchio stile, poi il meccanismo.
  - Il meccanismo: prima ai follower che interagiscono di più; si misura se la aprono e quanto restano; sepolta oppure spinta in cima; conta solo cosa fanno i primi.
  - Gemello di Kallaway 40 (la "prigione delle 200 views").
- 11/10 "Non è la fotocamera, è la luce" (35,7 s). La scala a 4 gradini: 99%, primo 50, primo 30, primo 10%. Oggetti già approvati: `fotocamera` e `faro`. Kallaway 109 e 4.
- 12/10 "I contenuti non sono pubblicità" (41,0 s). Le due cose che succedono insieme (il contenuto peggiora; il ritorno non arriva e smetti) e la regola: 8 contenuti su 10 danno, 2 chiedono. Kallaway 136 e 103.
- 13/10 "Le storie in evidenza" (45,3 s). Funzione di Instagram: il profilo vero con le storie in evidenza e il dito che preme. Kallaway 3.
  - In ordine: presentazione, risultati, domande frequenti; poi dietro le quinte, offerte, testimonianze.
- Ogni reel ha un'idea sua e una grammatica spaziale diversa dagli altri. Non rifare la console del 09.

SCELTA DELLE ANIMAZIONI (in base al tipo di script)
- Prima di progettare, classifica lo script con i pattern P01–P14 di `CATALOGO-ANIMAZIONI/SCRIPT-CATEGORIZZATI.md`:
  lista, scala, procedura, confronto A/B, framework, formula, meccanismo/algoritmo, mito → verità, UI di Instagram, calendario, dato, psicologia, CTA…
- La sezione del reel (10/10–13/10) propone già le animazioni battuta per battuta: è un punto di partenza, non un obbligo.
- Per ogni battuta:
  - scegli dal catalogo (`CATALOGO-ANIMAZIONI/catalogo.html`, dati in `catalogo.json`) il dispositivo di Kallaway che spiega meglio quella frase;
  - guarda la sua clip e il reel di riferimento;
  - usa l'implementazione del kit (`kw-kit/KIT-V2.md`) con i tempi e le curve misurati.
- Se una battuta non ha un dispositivo adatto nel catalogo o nel kit, creane uno nuovo nello stile di Kallaway:
  - stesso linguaggio visivo: mondo scuro a puntini, oggetti veri e lucidi in grafite/argento/bianco, il lime solo come accento pieno, glow, foto e reel veri;
  - movimenti misurati: cerca nei 150 reel il gesto più vicino e prendi tempi e curve da lì (camera solo con il gestore kit2);
  - confrontalo affiancato con Kallaway come gli altri (`confronto_moto.py`, `confronto_video.py`);
  - se è riutilizzabile, mettilo nel kit in un file `kit2-*.js` a parte, senza cambiare il comportamento delle funzioni usate dai reel approvati;
  - poi documentalo in `KIT-V2.md` e aggiungilo al catalogo (`_tools/catalogo_dati.py` + IMPL in `_tools/genera_catalogo.py`, poi `python -I _tools/genera_catalogo.py`).
- In `PIANO.md`, per ogni scena, scrivi gli ID del catalogo usati (es. "O21 + C03") oppure "nuova, nello stile di …", così si vede da dove viene ogni animazione.

IL MIO STANDARD (per ogni reel)
- Un mondo continuo con la camera che viaggia, una metafora centrale e i match cut (un oggetto diventa il successivo).
- Oggetti grandi e veri:
  - render;
  - foto profilo vere: la mia con `avatar(…, "tu")` dove si parla di "te" o del "tuo profilo";
  - i miei reel veri in movimento, cioè spezzoni dei reel finiti in `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\DA PUBBLICARE`. Mai screenshot statici.
- Metafore fisiche; niente frame vuoti o statici; niente caselle di testo; niente schede piccole e liste.
- Ogni elemento spiega la frase che si sta dicendo.
- "Chi ti guarda", quando torna più volte, è una persona qualunque (`persona()` del reel-09), mai il volto di uno sconosciuto ripetuto. I volti veri dell'atlante vanno bene solo per folle ed esempi una tantum.
- Gli oggetti speciali (faro, slot, fotocamera…) solo sulla battuta che spiegano, senza abusarne.
- Se c'è il cervello, pulsa entro ~1 s con `brain().accendi / .disco / .strobo` (misurati su Kallaway).
- Safe zone (dall'11/10, `SAFEZONE.jpg`): sotto y = 1332 niente grafica, perché lì ci sono la mia faccia e i sottotitoli che
  aggiungo in post. Possono scendere sotto solo le sfumature verso il nero dello sfondo. Controllo sulla bozza e sul 4K con
  `_tools/venv/Scripts/python.exe -I _tools/safezone.py <video>`.
- Densità ≥ 0,23 e copertura ≥ 0,54 al 60% di ogni scena (`_tools/densita.py`), con la tabella in `reel-DD/densita.txt`. Se una scena è sotto, aggiungi qualcosa che spiega la frase o stringi l'inquadratura, mai riempitivi.

PROCEDURA PER OGNI REEL
1. Concept e scene in `reel-DD/PIANO.md`: per ogni battuta i tempi delle parole e l'animazione scelta (ID del catalogo o "nuova").
2. Spezzoni dei miei reel (30 fps, un fotogramma chiave al secondo, senza audio) in `reel-DD/assets/clips/`, controllati su un foglio di contatto: niente schermate di interfaccia o flash all'inizio.
3. Build a blocchi di circa 5 scene.
   - Dopo ogni blocco: `check` con 0 errori (anche sul contrasto) e snapshot sulle parole chiave.
   - Guarda le snapshot con occhio critico: frame vuoti nelle transizioni, oggetti tagliati dai bordi o finiti dietro al titolo, elementi della scena prima rimasti visibili, testo troppo piccolo.
   - Correggi prima di passare al blocco dopo.
4. Densità su tutte le scene.
5. Render di prova a 1080p (`render -q draft`) e controllo dei fotogrammi sulle parole chiave ai tempi del CSV (niente mp3).
6. Confronto con Kallaway sui momenti chiave, poi correzioni:
   - video affiancato con `_tools/confronto_video.py --lento`, coppie in `CATALOGO-ANIMAZIONI/_analisi/confronti-video/reelDD.json`;
   - `_tools/confronto_moto.py` sui gesti principali.
7. Anteprima aperta nel browser: reel 10 → :3024, 11 → :3025, 12 → :3026, 13 → :3027.
8. Mostrami l'anteprima e aspetta il mio ok prima del 4K: `node kw-kit/deliver.cjs reel-DD DD <secondo della copertina>`. Dopo l'export controlla il file con ffprobe (4K, 30 fps, durata uguale all'mp3) e qualche fotogramma.

REGOLE CHE VALGONO SEMPRE
- reel-01 v4 non si tocca. reel-01 v5 e reel-03 hanno il marcatore `KW_FISSO`: se una correzione del kit li cambia a vista, mostramelo prima. Il reel-09 approvato non va cambiato.
- Nessun render 4K senza il mio ok.
- 30 fps. Il lime non è mai trasparente.
- Oggetti nuovi solo se sono migliori e nel mio stile. Da Adobe Stock solo gratis: se compare un pagamento, chiedimi prima. In alternativa Pexels o Openverse CC0, con lo scontorno locale (`_tools/scontorno.py`).
- Lavora in autonomia, senza fermarti a chiedermi conferme (tranne per il 4K).
- Se un'altra chat lavora in parallelo sul progetto, dividetevi i file e avvisatevi prima dei render pesanti.

---
VARIANTE "UNA CHAT PER REEL, IN PARALLELO" (da incollare SOTTO il prompt qui sopra, una chat per reel, cambiando DD)
Il reel 10/10 è consegnato in 4K (vedi PROSSIMA-SESSIONE.md e reel-10/: è il modello più recente insieme al 09; per le storie di Instagram usa kw-kit/kit2-storie.js).
In questa chat lavora SOLO sul reel DD/10, anche se 11, 12 o 13 non sono ancora consegnati: le altre chat fanno gli altri.
Regole per non pestarvi i piedi:
- File tuoi: `reel-DD/`, `CATALOGO-ANIMAZIONI/_analisi/confronti-video/reelDD.json`, i render `_analisi/render/reel-DD_*`.
  Funzioni nuove per il kit: solo in un file nuovo `kw-kit/kit2-reelDD.js` (nomi con un suffisso tuo, prima `grep` su tutto
  `kw-kit/`). Non modificare i file del kit che esistono già (kit2-core, -oggetti, -ui, -blocco5, -storie): se serve una
  modifica, scrivila come funzione nuova nel tuo file.
- PROSSIMA-SESSIONE.md, KIT-V2.md, `_tools/catalogo_dati.py`, `_tools/genera_catalogo.py`: rileggili subito prima di ogni
  modifica e cambia solo la riga o la sezione del tuo reel (aggiungi, non riscrivere).
- Render (prova o 4K): prima `ListAgents`, poi avvisa le altre chat con `SendMessage` ("render reel DD in corso") e aspetta se
  un'altra sta già renderizzando; avvisa anche alla fine. Un render pesante alla volta.
- Anteprima solo sulla tua porta: 11 → :3025, 12 → :3026, 13 → :3027.

CONSEGNA (richiesta dell'utente, 11/10): dopo la verifica del 4K, sposta il video con la copertina e la copia "senza copertina" in
`D:\CONTENUTI\OTTOBRE 2026\PARTE 1\INFOGRAFICA REMOTION\STILE KALLAWAY`.
