# Oggetti da Adobe Stock: fonti e licenze

Tutte le immagini vengono dalla **collezione gratuita** di Adobe Stock (filtro `pricing: "free"`). Sono state licenziate il
**09/10/2026** con il connettore *Adobe for creativity* sull'account di Samuele. La licenza è quella standard Adobe Stock e
non ha avuto costi: nessun preventivo, nessuna conferma richiesta.

Lo scontorno è di Photoshop (`image_remove_background`, modalità select-subject), che tiene anche le trasparenze.
Poi l'elaborazione è locale:
- `_tools/oggetto_da_stock.py` per il cervello, versione bianca e lime;
- `_tools/oggetti_adobe.py` per slot, fotocamera e faro.

Le ricette ripartono dai file di questa cartella: originali con licenza (`AdobeStock_<id>.jpg`) e scontorni (`*_cut.png`).

| Asset del kit (`kw-kit/assets/obj/`) | Adobe Stock | Originale | Cosa è stato fatto |
|---|---|---|---|
| `cervello.png`, `cervello_lime.png` | 318556173 | cervello a raggi X (wireframe blu) | scontorno; bianco neutro e lime pieno, la trasparenza resta (vetro) |
| `slot.png` | 730774093 | "Slot machine on a dark background". Nell'EXIF risulta **generata con IA** | testi finti ripuliti (inpainting, pannelli rifatti); rosso e azzurro portati a grafite e lacca nera; finestre dei rulli svuotate; leva tolta, perché rulli, leva e luci li disegna il kit |
| `fotocamera.png` | 285265822 | "Mirrorless digital photo camera" (Fujifilm X-T10 argento) | colori veri, saturazione −45%, contrasto +6% |
| `faro.png`, `faro_on.png` | 329591900 | "Photography studio flash isolated on white background" | metallo neutro; lo stativo, tagliato dalla foto, sfuma; nella versione accesa la parabola è incandescente |

- **Licenziato ma non usato:** 730774075, una seconda slot rossa più pulita ma tagliata sopra e sotto dalla foto.
- **Visti e scartati senza licenza:**
  - slot: 1212499726 (rulli 3D da cartone), 1516906711 (cabinato moderno), 716617621 (primo piano GenTech);
  - clessidra: 107989661, 347505484, 396949917 e altre. Resta la clessidra vettoriale del reel-01 (sabbia lime + match cut);
  - fotocamera: 536591586, 300039621, 353116060, 192913252;
  - luce: 346244477, 431012052, 822393785, 726756279 (fascio nel fumo: il fascio del kit è più pulito).

## Regole per i prossimi oggetti
1. Si usa solo la collezione gratuita. Se il connettore risponde con un preventivo o con `confirmationRequired`, ci si ferma e si chiede a Samuele.
2. Prima di licenziare si fa un foglio di miniature (`asset_search` → renditionURL). Si preferiscono materiali neutri (metallo, vetro, nero) e oggetti interi, non tagliati dal bordo della foto.
3. Le immagini generate con IA vanno controllate a piena risoluzione: i **testi finti** vanno sempre tolti.
4. Il colore resta nel brand: grafite, argento, bianco. Il lime lo accende il kit, con luci, rulli e pomo, oppure è la versione `_lime`. Mai lime trasparente.
5. Dopo ogni nuovo asset: geometria (frazioni stampate dalla ricetta) nelle costanti del kit, prova in un lab, riga in questa tabella.

## Altre fonti gratuite (09/10 sera: il connettore Adobe non era collegato)
Su indicazione di Samuele ("se non riesci con Adobe Stock, prova Pexels o altro"). Solo licenze che non chiedono attribuzione
né pagamento: **Pexels License** (uso libero, anche commerciale, senza attribuzione) e **CC0** (pubblico dominio, cercato con
Openverse filtrando `license=cc0,pdm`). Pexels e Pixabay bloccano le richieste automatiche sulle pagine (403): le foto Pexels si
trovano con la ricerca web e si scaricano dal CDN `images.pexels.com`.

Scontorno senza Photoshop: `_tools/scontorno.py` con il modello IS-Net `_tools/modelli/isnet-general-use.onnx` (quello di rembg,
eseguito in locale con cv2.dnn). Elaborazione: `_tools/oggetti_liberi.py`.

| Asset del kit (`kw-kit/assets/obj/`) | Fonte · licenza | Originale | Cosa è stato fatto |
|---|---|---|---|
| `razzo.png` | Flickr 42741462332 ("Vintage orange rocket", utente 51686021@N07) · **CC0** | render di un razzo retrò arancione su nero | scontorno; arancione → cromo argento; scaletta di servizio tolta (inpainting) |
| `amo.png` | Pexels 6478096 · **Pexels License** | ancoretta doppia di un'esca su fondo bianco | scontorno (l'esca resta fuori); bronzo → acciaio; raddrizzato con l'occhiello in alto |
| `persona.png`, `persona_colori.png` | Pexels 9558694 · **Pexels License** | ragazzo che guarda il telefono, fondo grigio chiaro | scontorno; versione "argilla bianca" (figura 3D di Kallaway, O26) e versione ai colori veri (−18% saturazione) |

- **Visti e scartati:** razzi Pexels 7355365 (giocattolo di legno), 3697824 e 3697826 (illustrazioni), 15520638 (navetta di gomma);
  ami Pexels 6478103 (con l'esca colorata attaccata), 35625612 (fondale d'acqua difficile da scontornare); persona Pexels 32526692 (di spalle).
- **Ritirati il 10/10:** `persona.png` e `persona_colori.png` (in `assets/obj_archivio/`). La figura d'argilla col volto e i capelli
  non è quella di Kallaway: l'utente l'ha bocciata. Al suo posto c'è il manichino qui sotto.

## Sessione 4 (10/10): connettore Adobe di nuovo collegato
| Asset del kit (`kw-kit/assets/obj/`) | Adobe Stock | Originale | Cosa è stato fatto |
|---|---|---|---|
| `manichino.png` | 140421534 · licenza standard, collezione gratuita (nessun costo, nessuna conferma) | "Incorrect posture concept": uomo di profilo, chino sul telefono, fondo bianco | scontorno di Photoshop (`figura_cut.png`); `_tools/manichino.py` lo rende come la figura O26 di Kallaway (reel 18, 52, 62): manichino bianco opaco, liscio come gesso (via il colore dei materiali, volume dalla sagoma, testa levigata: niente volto, capelli o barba), telefono grafite, busto che sfuma, alone bianco cotto nel PNG |

- **Visti e scartati** (miniature): 674248082 (manichino in piedi senza telefono), 176708273 e 708655465 (di fronte),
  551790525 (figura intera piccola), 270799617, 635793752, 588566500 (posa meno china), 444830336 (fondo con le righe).

