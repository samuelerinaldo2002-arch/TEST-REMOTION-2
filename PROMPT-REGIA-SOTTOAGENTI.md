Lavoriamo in `C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING`: infografiche in stile Kallaway con HyperFrames 0.8.138 e il kit `kw-kit` (v2).
Obiettivo: i reel 11/10, 12/10 e 13/10, allo stesso livello dei reel 09 e 10 (approvati). Questa chat fa da REGIA e usa i
SOTTO-AGENTI: te lo chiedo esplicitamente. Ogni reel lo costruisce un sotto-agente diverso, con la memoria pulita, così la
qualità non cala da un reel all'altro; tu controlli, chiedi le correzioni e mi mostri il risultato.

PRIMA DI INIZIARE (leggi solo questo, il resto lo leggono i sotto-agenti)
1. `PROSSIMA-SESSIONE.md`: stato vero dei reel (riparti dal primo non consegnato), regole, trappole delle sessioni 4 e 5.
2. `PROMPT-REEL-10-13.md`: è il prompt che passerai ai sotto-agenti (la parte sopra la riga `---`).
3. La memoria del progetto.
Non aprire tu il kit, i sorgenti o le snapshot dei reel in costruzione: la memoria di questa chat serve per la regia.

COME LANCI UN REEL (uno alla volta: 11 → 12 → 13)
- Lancia un sotto-agente (Agent, in background) con questo prompt:
  "Sei un sotto-agente: non puoi parlare con l'utente e non devi chiedergli niente. Leggi
  `TEST KALLAWAYMARKETING/PROMPT-REEL-10-13.md` (la parte sopra la riga `---`) e seguilo per il SOLO reel DD/10, con tutte le
  tappe della procedura dalla 1 alla 7 (anteprima su :30xx). Non fare il 4K. Quando hai finito, fermati e consegna alla regia
  un rapporto con: concept in tre righe; tabella delle scene (tempi, voce, cosa si vede, ID del catalogo); percorsi di
  `reel-DD/PIANO.md`, `reel-DD/densita.txt`, del foglio dei fotogrammi sulle parole chiave, del render di prova e del video affiancato con Kallaway;
  porta dell'anteprima; cosa hai corretto dopo il confronto; dubbi aperti. Prima di ogni render controlla con ListAgents e
  SendMessage che nessun'altra sessione stia renderizzando."
  (porte: 11 → :3025, 12 → :3026, 13 → :3027)
- Mentre lavora, aspetta la notifica: non fare tu il suo lavoro.

COME CONTROLLI (sempre le stesse cose, poche immagini)
1. Il rapporto e `densita.txt` (tutte le scene ≥ 0,23 / 0,54).
2. Un foglio dei fotogrammi sulle parole chiave, preso dal render di prova ai tempi del CSV (uno per frase importante, 20–24 riquadri; niente `_sync.mp4` con l'audio dal 12/10).
3. Un foglio di campioni del video affiancato con Kallaway.
Guardali con occhio critico rispetto al mio standard: mondo continuo con la camera che viaggia, una metafora centrale e i
match cut; oggetti grandi e veri, foto profilo vere (la mia dove si parla di "te"), i miei reel veri in movimento; niente frame
vuoti o statici, niente caselle di testo, niente schede piccole o liste; niente interfaccia sotto il titolo; ogni elemento
spiega la frase che si sta dicendo; "chi ti guarda" è una persona qualunque (`persona()`); oggetti speciali solo sulla
battuta che spiegano; safe zone: sotto y = 1332 niente grafica, solo sfumature verso il nero (`SAFEZONE.jpg`, controllo con
`_tools/safezone.py`); grammatica spaziale diversa dai reel 09 e 10.
- Se qualcosa non va, mandalo allo STESSO sotto-agente con SendMessage (tiene la sua memoria): elenco preciso, con il secondo e
  cosa cambiare. Dopo le correzioni deve rifare render di prova, controllo sulle parole e il confronto, e mandarti un rapporto nuovo.
- Quando è a posto: apri l'anteprima nel browser, aprimi il render di prova e il video affiancato, e mostrami il riepilogo. Aspetta il
  mio ok per il 4K.
- Dopo il mio ok: chiedi al sotto-agente di lanciare `node kw-kit/deliver.cjs reel-DD DD <copertina>` e di verificare il file
  (ffprobe: 2160 × 3840, 30 fps, durata uguale all'mp3, qualche fotogramma). Poi aggiorna tu `PROSSIMA-SESSIONE.md` con lo
  stato vero e le lezioni nuove, e passa al reel successivo con un sotto-agente nuovo.
- Mentre aspetti il mio ok su un reel puoi già lanciare il sotto-agente del reel dopo; i render però uno alla volta.

REGOLE CHE VALGONO SEMPRE
- Nessun render 4K senza il mio ok. reel-01 v4, reel-01 v5 e reel-03 (`KW_FISSO`), reel-09 e reel-10 non si toccano.
- I sotto-agenti mettono le funzioni nuove in `kw-kit/kit2-reelDD.js` e non modificano i file del kit che esistono già.
- Se la chat di regia diventa lunga, fermati e dammi il prompt per continuare (va bene questo stesso).
