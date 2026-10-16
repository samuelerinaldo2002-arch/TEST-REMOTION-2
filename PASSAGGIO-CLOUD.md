# PASSAGGIO IN CLOUD · leggere per primo (16/10 notte)

L'utente (Samuele) continua questo lavoro in una sessione cloud, con la cartella copiata in un repository GitHub privato.
Questa pagina dice dove si era arrivati e come ripartire. Dettagli: `PROSSIMA-SESSIONE.md` (in testa) e, per il catalogo,
`CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md` (sezione in testa «GIRO 2 · COPIA FEDELE»).

## Cosa stiamo facendo
**Giro 2 · copia fedele del catalogo Kallaway** (decisione dell'utente del 15/10): ricreare tutte le animazioni il più identiche
possibile a Kallaway (@kallawaymarketing: in 4 mesi milioni di views e 140K follower con questo format), **coi colori e i font
dell'utente** (lime #CFFB50, scuro #1E1E1E, bianco; Advercase / Patrick Hand / Zalando Sans negli stessi ruoli dei suoi), testi
suoi tradotti in italiano, media dello stesso tipo. Poi: (2) catalogo delle transizioni (scena A → movimento → scena B), ricavato
dai 33+ cambi già annotati in `copia-NN/transizioni.json`; (3) adattamento ai suoi script. Si copiano **reel interi** (idea
dell'utente: così si vedono subito le transizioni vere), uno per blocco.

## Stato al passaggio
| blocco | cosa | stato |
|---|---|---|
| C1 | reel 79 intero (107,6 s, 25 scene, 14 voci, 33 transizioni) in `CATALOGO-ANIMAZIONI/copia-01/` | **FATTO e approvato dall'utente** («molto bene, potrebbe anche essere lasciato così»). Rapporto: `copia-01/RAPPORTO.md`; video affiancato `_analisi/confronti-video/r79_copia_affiancato.mp4` |
| C1, due ritocchi | O30 (bivio «La finta», 53,85 s): primo fotogramma vuoto, in Kallaway strade e pallina sono già al taglio · CTA finale (100,06 s): miniatura del video quasi invisibile nei primi 0,5 s, nello zoom sulla strada manca il «2» grande e i chip sono piccoli | **da fare** (piccoli; opzione in coda, default di prima; passo 0 di C2) |
| C2 | **reel 5 intero** (`03_2026-10-04_DeFA_f1uwLt.mp4`, nella radice del progetto, 720×1280, 24 fps, 122 s: contiene L01 · L02 · K14 · O21 · F03 · T08 · K01 · O28; X01 a 118–125 s va verificato: oltre la fine del file) | **non iniziato** (fermato subito su richiesta; solo documentazione letta). Stato: `CATALOGO-ANIMAZIONI/copia-02/STATO.md`; anteprima prevista :3042 |
| C2b | reel 1 intero (T02 · D02 · X01 · T01 · F02, A01 da r25/r84/r96 se servono) | da fare (:3047) |
| C3, C4, C5… | vedi tabella del giro 2 in `RIFACIMENTO-RITMO.md` | da fare |
Il vecchio giro «ritmo» (blocchi 1–2 fatti, blocco 3 in pausa in `ritmo-03/`) resta com'è e confluisce nel giro 2. Non toccare
`TPL.*` (usati nei reel 14–16), reel-12…16, i reel consegnati, i KW_FISSO, `ritmo-01/02/03/09`, e il comportamento del kit
senza il marcatore `KW_RITMO`.

## Regole e preferenze fisse dell'utente
- **Safe zone dell'utente, NON quella di Kallaway:** niente grafica sotto y = 1332 su 1080×1920 (`SAFEZONE.jpg`, linea rossa),
  sotto solo sfumature verso il nero; controllo con `_tools/safezone.py`. La divisione di Kallaway (grafica sopra, facecam sotto)
  non si copia: le sue proporzioni si riportano nell'area utile y 0–1332. 30 fps (anche se il reel di Kallaway è a 24), niente
  audio sotto le bozze.
- **Kallaway vince sulle regole R1–R8** dove i suoi valori misurati sono diversi (un ritorno, un back.out, una deriva): si copia
  lui e si annota. **Scena piena al taglio**: oggetti già montati al primo fotogramma.
- Niente caselle di testo: ogni scena è un'infografica + titolo; ogni elemento spiega quello che si dice.
- Oggetti, foto e reel veri; la sua foto (`kw-kit/avatars/tu.jpg`) dove c'è «tu»/lui. **Niente sagome generiche o oggetti stock
  (fotocamera, sagoma del ragazzo) se Kallaway mostra altro: si copia quello che mostra lui** (cervello luminoso, persone vere,
  bagliore sull'elemento giusto).
- Safe: misure UNA volta per voce coi valori di Kallaway accanto (`deriva.py`, `pop.py`, `ingombro.py`, `safezone.py`, check,
  fotogramma del taglio); foglio KALLAWAY | COPIA (`_tools/foglio_kd.py --copia`); niente secondi giri su ciò che è a posto.
- La pagina `CATALOGO-ANIMAZIONI/catalogo-ritmo.html` (colonna COPIA accanto a KALLAWAY) si rigenera dopo OGNI voce finita:
  `_tools/genera_catalogo_ritmo.py --solo <ID>`. L'utente la tiene aperta.
- Un sotto-agente alla volta, mai in parallelo (limite di sessione condiviso, file del kit condivisi, lucchetto dei render
  `CATALOGO-ANIMAZIONI/_analisi/render/.lock-render`: mkdir + chi.txt, da togliere a fine render).
- I sotto-agenti si fermano spesso per il limite di sessione: la riga di stato in `copia-NN/STATO.md` va aggiornata a ogni
  scena finita, e chi riprende riparte da lì.

## Come ripartire (prompt da incollare nella sessione cloud)
```
Leggi PASSAGGIO-CLOUD.md nella radice del repository, poi PROSSIMA-SESSIONE.md (in testa) e la sezione «GIRO 2 · COPIA FEDELE»
di CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md (con «Come si fa un blocco di copia» e il «Prompt di un blocco di copia»), e il
RAPPORTO.md di copia-01 come modello. Sei la regia: lancia UN sotto-agente per il blocco C2 (reel 5 intero) col «Prompt di un
blocco di copia», con per prima cosa le due correzioni di C1 (O30 e CTA), e riparti da copia-02/STATO.md. Poi guardi una volta i
fogli KALLAWAY | COPIA e mandi le correzioni in un solo messaggio. Vai avanti da sola senza chiedere approvazioni (l'utente ha
detto «continua senza chiedermi approvazioni»), un blocco alla volta, e a fine blocco aggiorna RIFACIMENTO-RITMO.md e
PROSSIMA-SESSIONE.md.
```

## Cose da verificare in cloud (non sono scontate)
- **Percorsi di Windows:** i reel veri dell'utente erano in `D:\CONTENUTI\OTTOBRE 2026\PARTE 1\DA PUBBLICARE` (non nel repository,
  salvo copia) e gli script/PowerShell (`render_ritmo.ps1`, lucchetti, `Start-Process`) sono per Windows. Va riadattato per Linux.
- **Strumenti da installare:** ffmpeg/ffprobe, Chrome/chrome-headless-shell, Node (HyperFrames 0.8.138: `npx hyperframes@0.8.138`),
  Python con l'ambiente di `_tools/venv` (Windows: da ricreare), faster-whisper small.en per le trascrizioni (il whisper-cpp di
  hyperframes non c'è).
- **Reel di Kallaway:** servono per ogni confronto (sono nella radice, in `TUTTI-I-REEL/` e le clip in `CATALOGO-ANIMAZIONI/clip/`).
  Sono di un altro creator: tenere il repository PRIVATO, riferimento interno, mai pubblicare.
- **Limiti di GitHub:** niente file sopra 100 MB (reel interi, `raw-4k.mp4`, render 4K), repository consigliato sotto qualche GB.
  Il progetto pesa 6,9 GB: va ridotto (render, `.thumbnails`, `node_modules`, 4K) o caricato con Git LFS.
- **Anteprime:** i server :30xx girerebbero nel cloud, non nel browser dell'utente: servono i video/le pagine scaricabili.
- **Crediti:** non è verificato se la sessione cloud usi i 100 $ di crediti dell'utente.

## Repository (16/10 notte)
Caricato in `github.com/samuelerinaldo2002-arch/TEST-REMOTION-2` (**privato**, branch `main`, 8.407 file, la radice del repository è
la cartella `TEST KALLAWAYMARKETING`). **Non sono nel repository** (vanno rigenerati in cloud se servono): `node_modules`,
`.thumbnails`, `_tools/venv`, `raw-4k.mp4` e i 4K finali, `CATALOGO-ANIMAZIONI/_analisi/render/` (bozze), `_analisi/confronti-video/`.
Il modello `_tools/modelli/isnet-general-use.onnx` (178 MB) è in Git LFS. Il progetto a pezzi sotto i 100 MB per file.
Se un nuovo push grosso dà errore 500, va fatto a pezzi da ~350 MB (commit + push uno alla volta).
