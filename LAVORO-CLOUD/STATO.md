# Stato del lavoro in cloud (ramo `cloud-catalogo`)

Aggiornato a ogni scena finita. Chi riprende in una sessione nuova: `git checkout cloud-catalogo`, poi
`bash LAVORO-CLOUD/_tools/ripristina.sh` (rimette i file nei percorsi normali), ambiente come in NOTE-DI-RIENTRO.md §3,
e riparte dalla prima riga «da fare» qui sotto e dallo STATO.md del blocco.

| passo | cosa | stato |
|---|---|---|
| 0 | ambiente Linux (Node 22, ffmpeg 6.1, chrome-headless-shell di hyperframes 0.8.138, venv Python, Parakeet al posto di faster-whisper, lucide-react 0.469 fuori dal repo) | fatto 16/10 |
| a | due ritocchi a C1 (O30 al taglio; CTA: miniatura, «2» grande, chip) | fatto 16/10: opzioni `pieno` (O30) e `ritocco` (r79_cta, con il tuffo ×3,3 misurato), render 6 min 37 s, fogli `copia-01_16_O30.jpg` e `copia-01_25_r79_cta.jpg`, clip O30/K06 |
| b | C2 = reel 5 intero in `CATALOGO-ANIMAZIONI/copia-02/` (stato per scena: `LAVORO-CLOUD/CATALOGO-ANIMAZIONI/copia-02/STATO.md`) | fatto 16/10: 27 scene, 9 voci (L01 L02 K14 O21 F03 T08 K01 O28 X01) + 13 scene `COPIA.r05_*`, 56 transizioni, 3 render (6–7 min l'uno), fogli per scena, misure, affiancato, clip della pagina, RAPPORTO; frammenti dei voti e della tabella in NOTE-DI-RIENTRO §4 |
| b2 | correzioni della regia dopo i fogli (C1 CTA; C2 scene 1 5 7 11 13 19 21 25) | fatto 16/10: elenco in `copia-02/STATO.md` («Correzioni della regia»), render nuovi di copia-02 e copia-01, fogli delle scene corrette, ridotto, affiancato, clip O28 e L01 |
| c | C2b = reel 1 intero (T02 · D02 · X01 · T01 · F02 · A01) in `copia-07/` (:3047); reel 1 = `TUTTI-I-REEL/2026-10-08_DePIvvKub8b.mp4` (119,42 s); trascrizione già pronta in `copia-07/_lavoro/r01_parole.json` | **in corso** (16/10): scene 1–21 fatte; stato per scena in `LAVORO-CLOUD/CATALOGO-ANIMAZIONI/copia-07/STATO.md` |
| d | blocchi seguenti della tabella del giro 2 (C3…) se i crediti reggono | da fare |
| fine sessione 1 | NOTE-DI-RIENTRO.md completo per C1 ritocchi + C2, ultimo commit e push | fatto 16/10 (l'utente ha chiesto di fermarsi dopo C2; si riprende da «c») |
