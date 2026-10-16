# Stile Kallaway → brand Samuele · guida di motion design

Analisi di **100 reel di @kallawaymarketing** (gen → ott 2026, durata media 90 s, mediana 30,7K views):
fogli di contatto 1 fotogramma ogni 2 s per ogni reel, sequenze fotogramma per fotogramma (8 fps) sulle transizioni,
fotogrammi a piena risoluzione per materiali e luce. I riferimenti visivi sono in `riferimenti/`.

---

## 1. In una frase

**Un'unica lavagna nera infinita, illuminata, su cui una camera che non si ferma mai costruisce lo schema di quello che
lui sta dicendo, parola per parola, mentre la sua faccia resta in una card in basso.** Ogni concetto diventa un oggetto
(una lista, un albero, una piramide, un bersaglio, un telefono vero, una fiche da casinò), ogni oggetto arriva da sfocato
a nitido, e un solo colore d'accento dice "guarda qui".

## 2. Struttura di un reel

| Elemento | Come lo fa Kallaway |
|---|---|
| **Due piani** | ~70% del tempo: grafica sopra (y 0–70%), parola-sottotitolo singola nel mezzo, facecam in card arrotondata sotto. ~30%: facecam a tutto schermo. |
| **Il talking head come "stacco"** | Il passaggio a tutto schermo è il taglio netto tra due sezioni: chiude un'idea, la successiva riparte con una grafica nuova. |
| **Ritmo** | Un taglio netto ogni ~5,9 s in media (9,5 al minuto). Dentro la grafica non ci sono tagli: è tutta camera e trasformazioni. |
| **Titolo persistente** | In alto c'è sempre un titolo di sezione, che cambia quando cambia il capitolo ("The First View Ceiling" → "The Second…"). |
| **Hook (0–3 s)** | Il frame 0 mostra già il risultato: il documento finito, la piramide, il profilo con i numeri, più il titolo. Dopo, lo ricostruisce pezzo per pezzo. |
| **Format ricorrenti** | Listicle numerati ("3 reasons", "6 formats", "5 tricks") con indice che ritorna fra un punto e l'altro, framework con nome ("The Lock-In Zone", "Virality Stack"), case study di un creator ("Nate went from 10K to 500K"), tutorial AI/Claude passo-passo, confronti ("Rich vs Broke viewers"). |
| **CTA** | 99 reel su 100 chiudono con "Comment *X* to get…": titolo con box + anteprima della risorsa (documento, skill, video). |

**I più visti** (sono la direzione da seguire): storytelling "scientificamente impossibile da skippare" (1,2M), "Claude
diventa una social media machine" (828K), hook impossibili da saltare (516K), formato di script (478K), database di
reference (312K). Hanno tutti **oggetti-metafora luminosi** (loop infinito, fiches, carte, strade di luce) o **UI vere** (Claude, telefoni) con **loghi** e **frecce disegnate a mano**.

## 3. Layout e safe zone (adattati al tuo montaggio)

1080×1920:
- **Titolo**: y 150–360 (al massimo 2 righe; con badge-icona sopra quando è di sezione).
- **Area grafica**: y ~380–1385. È l'area utile: elementi grandi, mai "francobolli".
- **Sottotitoli (in post, DaVinci)**: ~y 1400–1490. **Facecam (in post)**: da ~y 1500 in giù.
- Nel render la grafica sfuma a zero tra 1385 e 1450 (maschera `#safe`). Lo sfondo resta pieno fino in fondo, così la facecam ci sta sopra.

## 4. Tipografia: Kallaway → te

| Ruolo | Kallaway | Brand Samuele |
|---|---|---|
| Titoli, numeri grandi | Grotesk bold condensato, Title Case, crenatura stretta, **glow bianco** | **Advercase Bold** (serif condensato, molto editoriale) con lo stesso glow |
| Parola-accento nel titolo | Serif *corsivo* ("*View Ceiling*") | **Patrick Hand** in lime, con glow lime: la "voce a mano" |
| Box evidenziatore | Box rosso pieno dietro le parole chiave, testo bianco | Box **lime #CFFB50** con testo **#1E1E1E**, glow lime |
| UI, etichette nelle card | Grotesk 600–700 piccolo | **Zalando Sans** 600–800, maiuscoletto spaziato per le label |
| Annotazioni | Corsivo serif, frecce curve disegnate | **Patrick Hand** + tratti a mano lime (cerchi, frecce, sottolineature) |

## 5. Colore e luce

- **Sfondo**: Kallaway usa un nero quasi puro con una **griglia di puntini fitta** e una vignettatura forte. Da te: base **#1E1E1E**, puntini bianchi al 9% ogni 24 px, vignettatura al 62% sui bordi e luci lime sfocate lontane, in parallasse.
- **Un solo accento**: per lui il rosso, per te il **lime**. Si usa per box titoli, blocchi numero, bordi attivi, connettori "giusti", centro del bersaglio, glow. Tutto il resto è bianco/grigi.
- **Negativo / confuso**: lui usa il rosso anche per il negativo. Tu usi **grigio + sfocatura + "?"**: il lime resta sempre "ciò che conta / la soluzione".
- **Glow ovunque** (l'effetto *Glow* di After Effects): testo bianco con alone morbido, linee bianche con bloom, accento con doppio alone (22 px + 70 px).
- **Materiali**: card scure lucide (gradiente verticale, bordo 1,5 px bianco al 16–18%, riflesso interno in alto, ombra profonda), barre con blocco accento pieno a sinistra, "sheen" di luce che attraversa le card importanti.
- **Light mode**: in circa 1 reel su 3 c'è una sezione su sfondo bianco sporco (screenshot, documenti, profili d'esempio). ⚠️ Da te i sottotitoli in post sono bianchi: se usi il light mode, quei tratti richiedono sottotitoli scuri.

## 6. Catalogo dei componenti (quelli che tornano di continuo)

1. **Titolo di sezione** con box evidenziatore e parola-accento.
2. **Barra di sezione numerata** ("01 Identity Labels"): blocco accento + numero + etichetta. Da indice diventa intestazione (vedi §7, *shared element*).
3. **Lista con voci sfocate**: tutte le voci sono già lì, sfocate; ognuna va a fuoco quando la nomina.
4. **Documento "Video Script"**: righe-placeholder grigie che diventano blocchi colorati (Hook, Body, CTA…).
5. **Telefono / profilo IG vero**, con numeri che contano e griglie di miniature **vere** (anche di altri creator: Hormozi, Gaffney…).
5b. **Anello di reel che ruota** (reel 06, 11, 12 — tipico degli hook): 6–7 card 9:16 partono ammucchiate al centro e si aprono in cerchio (0,6–0,85 s `expo.out`) su una sottile linea tratteggiata; il cerchio gira lento in senso orario (~25°/s), le card restano dritte con leggere inclinazioni. Al centro un **punto colorato → disco → etichetta** (il concetto). Poche card: con più di 7 diventa confuso.
6. **Hub & spoke con loghi app** (Instagram, TikTok, YouTube, Claude, ChatGPT, Sandcastles): icone lucide collegate da curve.
7. **Alberi e flowchart**: nodo in alto, linee sottili, box-etichetta; un nodo a cerchio pieno colorato come radice.
8. **Piramide a livelli** (3D finto) con etichette a bandiera e linee guida con pallino.
9. **Bersaglio a cerchi concentrici** con le etichette a destra; si focalizza spegnendo gli anelli esterni.
10. **Folle di persone** (griglia o anello di icone) con contatori ("200 people" → "1.160 people"); colore = stato.
11. **Anelli orbitali** di puntini attorno a un avatar (pubblico, lead vs sale).
12. **Timeline orizzontale** con anni, attraversata dalla camera.
13. **Grafici**: retention (linea che crolla), revenue (linea verde che sale + numero che conta), barre, gauge a semicerchio.
14. **Checklist** con caselle spuntate; **confronti a due colonne** ("Rich viewers | Broke viewers").
15. **Oggetti-metafora 3D luminosi**: fiches e slot del casinò, carte, cervello, loop ∞, clessidra, acqua con onde (pebble effect), strade di luce, secchi (content buckets), triangolo-triade.
16. **Annotazioni a mano**: frecce curve verso screenshot, parole grandi ("Trends", "Insights"), cerchi.
17. **CTA finale**: "Comment *X*" con box e anteprima della risorsa.

## 7. Grammatica del movimento (i valori che usa il kit)

| Mossa | Dettaglio |
|---|---|
| **Entrata blur→nitido** | opacità 0→1, blur 18→0 px, y +28→0, scala 0,96→1 · 0,5–0,7 s `power3.out`. È la firma. |
| **Uscita** | blur 0→14, opacità →0 · 0,25–0,35 s `power2.in`. |
| **Titolo per carattere** | ogni carattere: blur 10→0, x −8→0 · 0,3 s, sfalsato di 22 ms; il box lime si allarga da sinistra (`expo.out` 0,42 s). L'uscita va al contrario (box che si ritira verso destra). |
| **Segnaposto sfocati** | le cose non ancora dette sono già in scena (opacità 0,4, blur 9) e vanno a fuoco sulla parola. |
| **Camera continua** | tra un battito e l'altro: lento push/drift (+3%) `sine.inOut`; tra stazioni `power3.inOut` 0,8 s; mai ferma. |
| **Whip pan** | 0,5–0,6 s `power3.inOut` con **motion blur direzionale** (feGaussianBlur "X 0", picco 14–22 a metà corsa). |
| **Shared element / match cut** | l'oggetto della scena A diventa quello della scena B (la voce della lista sale e diventa l'intestazione; il punto diventa l'avatar). |
| **Punch-in** | sulle parole chiave, zoom rapido del 5–20% `power4.out`. |
| **Focus by dimming** | quando parla di un elemento, quelli attorno scendono al 20–50% di opacità. |
| **Disegno linee** | connettori che si disegnano (0,3–0,5 s), tratteggi che "marciano", pallini che viaggiano sulle linee. |
| **Contatori** | numeri che contano in sync con un grafico che si disegna. |
| **Impatto** | scossa 7–12 px, onde d'urto, scintille: solo sui 2–3 colpi veri del reel. |
| **Sheen** | una banda di luce attraversa una card appena arrivata (0,7–0,9 s). |

## 8. Cosa NON fare (per restare "Kallaway" e nel tuo standard)

- Niente scene ferme: se la camera è immobile per più di ~1 s, aggiungi un drift.
- Niente francobolli: l'oggetto protagonista occupa almeno metà della larghezza.
- Niente paragrafi: titoli brevi, etichette, numeri.
- Niente arcobaleni: un accento solo (lime). I colori veri arrivano dalle clip e dai loghi.
- Non riempire tutto: tanto nero attorno a un oggetto luminoso è il look.

## 9. Come si usa (kit `kw-kit/`)

```
node kw-kit/build.cjs reel-01                       # kit + icone + SFX + <!--VIDEOS--> → composition/
cd reel-01/composition
npx --yes hyperframes@0.8.138 check                 # 0 errori
npx --yes hyperframes@0.8.138 preview --background  # anteprima Studio
node ../../kw-kit/deliver.cjs ..  01 2.4            # render 4K + copertina + copia senza copertina
```
Primitive principali in `kw-kit/kit.js`: `title()` · `blurIn/blurOut/unblur` · `cam/drift/whip` · `card/sectionBar/row/nodePill/appIcon/person`
· `connector/traveller` · `handCircle/handArrow/handStroke/handNote` · `arcFly/ripple/sparks/sheen` · `igPhone` (griglie con topic, immagini o **clip video vere**) · `bokeh`.

Le clip esterne (Hormozi, Tony Robbins, GaryVee, Devin Jatho, Leila Hormozi, Codie Sanchez, Dan Koe, Steven Bartlett) sono in
`_clip-esterni/`; per usarne una, si taglia un segmento 3:4 di ~5 s in `reel-XX/assets/clips/` e la si dichiara nel blocco
`<!--VIDEOS-->` del sorgente. ⚠️ Pubblicare spezzoni di altri creator può generare reclami di copyright: tienili brevi, piccoli e in chiave di commento, come fa Kallaway.
