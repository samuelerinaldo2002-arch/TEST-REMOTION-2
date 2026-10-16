# Ripresa in una sessione cloud nuova (giro 2 · copia fedele)

Tutto il lavoro del cloud è sul ramo **`cloud-catalogo`**, nella cartella `LAVORO-CLOUD/` (stessi percorsi del progetto).
Stato: `LAVORO-CLOUD/STATO.md` (passi) e lo `STATO.md` del blocco in corso (`LAVORO-CLOUD/CATALOGO-ANIMAZIONI/copia-NN/STATO.md`).

## Prompt da incollare nella sessione nuova
```
Sei la regia del rifacimento del catalogo Kallaway (giro 2 · copia fedele), in cloud, sul repository
samuelerinaldo2002-arch/TEST-REMOTION-2. Lavora sul ramo cloud-catalogo (git fetch origin cloud-catalogo && git checkout
cloud-catalogo; mai main). Leggi PRIMA, in quest'ordine: LAVORO-CLOUD/RIPRESA.md, LAVORO-CLOUD/STATO.md,
LAVORO-CLOUD/NOTE-DI-RIENTRO.md (§3: ambiente e lezioni), PASSAGGIO-CLOUD.md, e lo STATO.md del blocco in corso in
LAVORO-CLOUD/CATALOGO-ANIMAZIONI/copia-NN/. Poi:
1) bash LAVORO-CLOUD/_tools/prepara_ambiente.sh   (venv, icone Lucide 0.469, Chrome di hyperframes 0.8.138, Parakeet)
2) bash LAVORO-CLOUD/_tools/ripristina.sh          (rimette i file di LAVORO-CLOUD nei percorsi normali)
3) riprendi il blocco in corso con UN sotto-agente, col prompt in LAVORO-CLOUD/_prompt/prompt_blocco_<blocco>.md (sostituisci
   /tmp/claude-0/… con i percorsi del repository e le righe di attribuzione dei commit con quelle della tua sessione), dicendogli
   di ripartire dalla riga di stato del suo STATO.md. Quando finisce, guarda una volta i fogli KALLAWAY | COPIA e manda le
   correzioni in un solo messaggio. Poi i blocchi seguenti della tabella del giro 2 (CATALOGO-ANIMAZIONI/RIFACIMENTO-RITMO.md).
Regole di isolamento (dell'utente): tutto ciò che crei o modifichi va in LAVORO-CLOUD/ allo stesso percorso (elenco in
LAVORO-CLOUD/MANIFESTO.txt, copiato da LAVORO-CLOUD/_tools/salva.sh); i commit contengono SOLO LAVORO-CLOUD/ (mai git add -A);
commit e push dopo ogni scena; voti_kit.json, tabelle e pagina solo come frammenti in NOTE-DI-RIENTRO.md §4. Vai avanti da
sola senza chiedere approvazioni; tieni d'occhio i crediti e fermati salvando tutto (STATO.md, NOTE-DI-RIENTRO.md, push)
prima che finiscano.
```

## Note pratiche
- **Render:** `bash LAVORO-CLOUD/_tools/render_ritmo.sh copia-NN "nota"` (lucchetto Linux; ~6–7 min per un reel di 2 minuti,
  senza GPU). Le bozze intere stanno in `CATALOGO-ANIMAZIONI/_analisi/render/` (fuori da git); in LAVORO-CLOUD solo le `_540`.
- **Trascrizione:** `_tools/venv/bin/python -I LAVORO-CLOUD/_tools/trascrivi.py <mp4> <out.json>` (Parakeet tarato su
  faster-whisper). Quella del reel 1 è già in `copia-07/_lavoro/r01_parole.json`.
- **Fogli:** `_tools/venv/bin/python -I _tools/foglio_kd.py --copia copia-NN [n,…]` (la versione corretta di `foglio_kd.py`
  è in LAVORO-CLOUD: `ripristina.sh` la rimette). Senza render: `_analisi/ritmo/_script_copia02/snap_kd.py`.
- **Prima di chiudere una sessione:** `bash LAVORO-CLOUD/_tools/salva.sh && git add LAVORO-CLOUD && git commit … && git push
  origin cloud-catalogo`. Le copie nei percorsi normali si possono poi rimettere com'erano (`git checkout -- CATALOGO-ANIMAZIONI
  kw-kit _tools` e togliere i file non tracciati fuori da LAVORO-CLOUD): sono già tutte in LAVORO-CLOUD.
- **Rientro nel progetto su Windows:** `LAVORO-CLOUD/NOTE-DI-RIENTRO.md` §2.
