// ═══ KW kit v2 · COPIA FEDELE · camera (K02, K03, K04, K06, K17) — blocco C1, reel 79 di Kallaway ═══════════════════════════
// Le camere complesse sono prese dal suo video così come sono (camtrack.py → cattura_js.py, levigate su 3 fotogrammi): scala e
// posizione del punto (540, 880) del primo fotogramma del tratto. cpCam.cattura() le rimette sulla camera della copia.
const CP_CATTURE = {
  // 6,673 → 9,551 s: dal ∞ con i numeri la camera si allontana (×0,546 in 1,42 s, curva come KW.move, il centro dello zoom in
  // basso: il contenuto scende di 172 px), poi un secondo allontanamento ×0,78 con un pan a sinistra (8,3–9,0 s)
  r79_albero: [[6.673, 1.0000, 540.0, 880.0], [6.715, 0.9908, 540.0, 883.8], [6.757, 0.9787, 540.0, 888.7], [6.798, 0.9618, 540.0, 895.3], [6.840, 0.9396, 540.0, 903.7], [6.882, 0.9127, 540.0, 913.9], [6.924, 0.8827, 540.0, 925.2], [6.965, 0.8521, 540.0, 936.8], [7.007, 0.8228, 540.0, 947.8], [7.049, 0.7960, 540.0, 957.9], [7.090, 0.7719, 540.0, 966.9], [7.132, 0.7505, 540.0, 975.0], [7.174, 0.7312, 540.0, 982.3], [7.216, 0.7139, 540.0, 988.8], [7.257, 0.6982, 540.0, 994.7], [7.299, 0.6839, 540.0, 1000.0], [7.341, 0.6709, 540.0, 1004.9], [7.382, 0.6589, 540.0, 1009.4], [7.424, 0.6479, 540.0, 1013.5], [7.466, 0.6378, 540.0, 1017.3], [7.508, 0.6284, 540.0, 1020.8], [7.549, 0.6197, 540.0, 1024.1], [7.591, 0.6115, 540.0, 1027.2], [7.633, 0.6039, 540.0, 1030.0], [7.674, 0.5969, 540.0, 1032.7], [7.716, 0.5903, 540.0, 1035.1], [7.758, 0.5842, 540.0, 1037.5], [7.799, 0.5784, 540.0, 1039.6], [7.841, 0.5730, 540.0, 1041.7], [7.883, 0.5680, 539.9, 1043.6], [7.925, 0.5632, 539.8, 1045.4], [7.966, 0.5586, 539.6, 1047.1], [8.008, 0.5543, 539.2, 1048.7], [8.050, 0.5500, 538.5, 1050.2], [8.091, 0.5458, 537.7, 1051.6], [8.133, 0.5419, 536.7, 1052.9], [8.175, 0.5382, 535.4, 1054.2], [8.217, 0.5346, 533.8, 1055.3], [8.258, 0.5309, 531.8, 1056.4], [8.300, 0.5272, 529.3, 1057.4], [8.342, 0.5234, 526.4, 1058.3], [8.383, 0.5195, 522.9, 1059.1], [8.425, 0.5155, 518.7, 1059.9], [8.467, 0.5112, 513.4, 1060.6], [8.509, 0.5065, 506.8, 1061.2], [8.550, 0.5012, 498.3, 1061.8], [8.592, 0.4949, 487.0, 1062.3], [8.634, 0.4869, 471.4, 1062.8], [8.675, 0.4764, 450.4, 1063.1], [8.717, 0.4634, 425.9, 1063.4], [8.759, 0.4499, 402.0, 1063.6], [8.800, 0.4382, 382.4, 1063.8], [8.842, 0.4292, 367.4, 1064.0], [8.884, 0.4223, 355.8, 1064.2], [8.926, 0.4168, 346.5, 1064.4], [8.967, 0.4144, 338.7, 1064.5], [9.009, 0.4145, 332.1, 1064.7], [9.051, 0.4165, 326.5, 1064.9], [9.092, 0.4180, 321.5, 1065.0], [9.134, 0.4191, 317.0, 1065.0], [9.176, 0.4197, 313.0, 1065.1], [9.218, 0.4195, 309.5, 1065.1], [9.259, 0.4186, 306.3, 1065.1], [9.301, 0.4166, 303.4, 1065.0], [9.343, 0.4144, 300.8, 1064.9], [9.384, 0.4120, 298.5, 1064.8], [9.426, 0.4104, 296.3, 1064.7], [9.468, 0.4091, 294.4, 1064.7], [9.510, 0.4090, 292.5, 1064.6], [9.551, 0.4093, 290.7, 1064.4]],
  // 9,551 → 12,221 s: K03, dall'albero alla slot (zoom ×1,55 + pan −407 px in 1,0 s, KW.arrive) e dalla slot alla mappa (pan
  // −970 px in 1,59 s, picco 2154 px/s al 18%, cubic-bezier(0.325, 0.085, 0.05, 0.965))
  r79_k03: [[9.551, 1.0000, 540.0, 880.0], [9.593, 1.0231, 528.7, 874.6], [9.635, 1.0671, 509.5, 864.3], [9.676, 1.1298, 484.1, 849.9], [9.718, 1.1824, 462.5, 837.9], [9.760, 1.2264, 444.0, 827.7], [9.801, 1.2640, 428.1, 818.8], [9.843, 1.2965, 414.4, 811.2], [9.885, 1.3250, 402.3, 804.7], [9.927, 1.3504, 391.6, 799.1], [9.968, 1.3729, 382.1, 794.0], [10.010, 1.3930, 373.6, 789.5], [10.052, 1.4112, 365.9, 785.5], [10.093, 1.4279, 359.1, 781.8], [10.135, 1.4432, 352.9, 778.5], [10.177, 1.4573, 347.2, 775.4], [10.219, 1.4701, 342.2, 772.6], [10.260, 1.4818, 337.7, 770.0], [10.302, 1.4923, 333.6, 767.6], [10.344, 1.5021, 329.7, 765.4], [10.385, 1.5113, 325.8, 763.4], [10.427, 1.5197, 320.9, 761.5], [10.469, 1.5274, 313.9, 759.9], [10.511, 1.5346, 303.7, 758.4], [10.552, 1.5414, 289.1, 757.0], [10.594, 1.5477, 268.7, 755.8], [10.636, 1.5531, 240.2, 754.7], [10.677, 1.5579, 200.4, 753.8], [10.719, 1.5619, 145.4, 752.9], [10.761, 1.5654, 73.9, 752.2], [10.802, 1.5685, -8.6, 751.5], [10.844, 1.5712, -91.8, 750.9], [10.886, 1.5736, -166.6, 750.4], [10.928, 1.5755, -229.6, 750.0], [10.969, 1.5771, -282.2, 749.6], [11.011, 1.5784, -326.4, 749.3], [11.053, 1.5794, -364.1, 749.2], [11.094, 1.5802, -396.7, 749.1], [11.136, 1.5807, -425.0, 749.1], [11.178, 1.5811, -449.9, 749.0], [11.220, 1.5812, -472.1, 749.0], [11.261, 1.5813, -491.8, 748.9], [11.303, 1.5814, -509.5, 748.9], [11.345, 1.5814, -525.3, 748.9], [11.386, 1.5814, -539.6, 748.9], [11.428, 1.5814, -552.5, 748.9], [11.470, 1.5815, -564.1, 748.8], [11.512, 1.5814, -574.6, 748.9], [11.553, 1.5813, -584.1, 748.9], [11.595, 1.5813, -592.7, 748.8], [11.637, 1.5814, -600.5, 748.9], [11.678, 1.5815, -607.4, 748.8], [11.720, 1.5815, -613.7, 748.8], [11.762, 1.5815, -619.3, 748.7], [11.803, 1.5815, -624.2, 748.8], [11.845, 1.5815, -628.6, 748.8], [11.887, 1.5803, -631.1, 747.6], [11.929, 1.5779, -632.1, 745.5], [11.970, 1.5764, -632.9, 742.6], [12.012, 1.5772, -635.1, 740.3], [12.054, 1.5791, -638.2, 739.0], [12.095, 1.5801, -640.6, 737.7], [12.137, 1.5801, -641.7, 736.9], [12.179, 1.5800, -642.2, 736.0], [12.221, 1.5800, -642.2, 736.0]],
  // 34,743 → 36,50 s: K02 + K17, ritorno alla mappa: la scena arriva GIÀ in corsa (4428 px/s al primo fotogramma) e frena lungo il
  // ∞ dalla tappa 1 alla 2 (−677, −802 px in 1,34 s, cubic-bezier(0.03, 0.427, 0.34, 0.85), quasi KW.arrive), scala ferma
  r79_mappa12: [[34.743, 1.0000, 540.0, 880.0], [34.785, 1.0002, 420.4, 737.6], [34.826, 1.0001, 359.7, 665.5], [34.868, 1.0001, 313.2, 610.1], [34.910, 1.0002, 274.5, 564.0], [34.952, 1.0001, 241.2, 524.2], [34.993, 1.0002, 211.6, 489.2], [35.035, 1.0001, 185.2, 457.7], [35.077, 1.0001, 161.3, 429.2], [35.118, 1.0001, 139.4, 403.1], [35.160, 1.0001, 119.2, 379.2], [35.202, 1.0001, 100.6, 357.1], [35.244, 1.0001, 83.3, 336.5], [35.285, 1.0001, 67.3, 317.4], [35.327, 1.0001, 52.3, 299.5], [35.369, 1.0002, 38.2, 282.9], [35.410, 1.0001, 25.2, 267.1], [35.452, 1.0001, 12.9, 252.6], [35.494, 1.0000, 1.4, 239.0], [35.536, 1.0001, -9.4, 225.9], [35.577, 1.0001, -19.6, 213.8], [35.619, 1.0001, -29.2, 202.4], [35.661, 1.0000, -38.2, 191.7], [35.702, 1.0000, -46.7, 181.6], [35.744, 0.9999, -54.6, 172.1], [35.786, 1.0000, -62.2, 163.1], [35.827, 1.0001, -69.2, 154.6], [35.869, 1.0001, -76.0, 146.8], [35.911, 1.0000, -82.1, 139.3], [35.953, 1.0000, -87.9, 132.3], [35.994, 1.0000, -93.4, 125.8], [36.036, 1.0000, -98.5, 119.7], [36.078, 1.0000, -103.4, 114.1], [36.119, 1.0000, -107.9, 108.8], [36.161, 1.0001, -112.0, 103.7], [36.203, 1.0000, -115.8, 99.2], [36.245, 1.0000, -119.4, 95.0], [36.286, 1.0001, -122.7, 90.9], [36.328, 1.0000, -125.7, 87.4], [36.370, 1.0000, -128.5, 84.1], [36.411, 1.0000, -131.1, 81.1], [36.453, 1.0000, -133.4, 78.4], [36.495, 1.0016, -136.7, 77.6]],
  // 50,926 → 52,43 s: K17 tuffo dalla mappa intera alla tappa 3 (zoom ×2,235 in ~1,4 s, già in corsa al primo fotogramma, cubic-bezier(0.03, 0.71, 0.575, 0.9), circ.out il più vicino)
  r79_mappa23: [[50.926, 1.0000, 540.0, 880.0], [50.968, 1.2662, 425.4, 1065.7], [51.009, 1.3971, 369.1, 1157.1], [51.051, 1.4958, 326.6, 1226.0], [51.093, 1.5767, 291.8, 1282.4], [51.134, 1.6453, 262.2, 1330.3], [51.176, 1.7051, 236.4, 1372.1], [51.218, 1.7581, 213.7, 1409.1], [51.260, 1.8055, 193.3, 1442.1], [51.301, 1.8481, 175.0, 1471.9], [51.343, 1.8868, 158.3, 1498.9], [51.385, 1.9220, 143.2, 1523.4], [51.426, 1.9541, 129.4, 1545.7], [51.468, 1.9834, 116.8, 1566.2], [51.510, 2.0104, 105.2, 1585.0], [51.552, 2.0350, 94.6, 1602.2], [51.593, 2.0573, 84.9, 1618.0], [51.635, 2.0781, 75.9, 1632.5], [51.677, 2.0976, 67.6, 1645.8], [51.718, 2.1155, 60.1, 1658.1], [51.760, 2.1315, 53.2, 1669.4], [51.802, 2.1459, 47.0, 1679.5], [51.844, 2.1598, 41.1, 1688.9], [51.885, 2.1721, 35.9, 1697.4], [51.927, 2.1828, 31.2, 1705.0], [51.969, 2.1928, 26.9, 1711.9], [52.010, 2.2012, 23.2, 1718.0], [52.052, 2.2093, 19.7, 1723.5], [52.094, 2.2163, 16.7, 1728.4], [52.135, 2.2223, 14.1, 1732.6], [52.177, 2.2276, 11.8, 1736.3], [52.219, 2.2318, 9.9, 1739.4], [52.261, 2.2353, 8.2, 1741.8], [52.302, 2.2353, 8.2, 1741.8], [52.344, 2.2353, 8.2, 1741.8], [52.386, 2.2353, 8.2, 1741.8], [52.427, 2.2353, 8.2, 1741.8]],
  // 75,284 → 78,40 s: K17 dalla tappa 3 alla 4 lungo il ∞ (già in corsa, 4155 px/s al primo fotogramma, +975 / −921 px, frena a lungo; spinta finale +1,8%)
  r79_mappa34: [[75.284, 1.0000, 540.0, 880.0], [75.325, 1.0002, 664.8, 759.7], [75.367, 1.0001, 730.8, 696.1], [75.409, 1.0003, 782.5, 646.5], [75.450, 1.0005, 825.8, 604.9], [75.492, 1.0007, 864.0, 568.4], [75.534, 1.0012, 898.0, 536.2], [75.576, 1.0013, 928.7, 506.6], [75.617, 1.0015, 957.2, 479.4], [75.659, 1.0018, 983.6, 454.3], [75.701, 1.0020, 1008.2, 430.8], [75.742, 1.0021, 1031.1, 408.8], [75.784, 1.0022, 1052.7, 388.1], [75.826, 1.0024, 1073.2, 368.7], [75.868, 1.0024, 1092.5, 350.2], [75.909, 1.0023, 1110.8, 332.7], [75.951, 1.0023, 1128.2, 316.1], [75.993, 1.0024, 1144.9, 300.1], [76.034, 1.0025, 1160.7, 285.0], [76.076, 1.0025, 1175.7, 270.4], [76.118, 1.0021, 1190.1, 256.5], [76.159, 1.0023, 1204.0, 243.3], [76.201, 1.0022, 1217.2, 230.4], [76.243, 1.0023, 1229.9, 218.3], [76.285, 1.0023, 1242.2, 206.5], [76.326, 1.0023, 1253.9, 195.3], [76.368, 1.0023, 1265.2, 184.4], [76.410, 1.0024, 1276.0, 174.0], [76.451, 1.0024, 1286.5, 163.9], [76.493, 1.0024, 1296.5, 154.3], [76.535, 1.0024, 1306.2, 145.0], [76.577, 1.0024, 1315.5, 136.1], [76.618, 1.0022, 1324.3, 127.4], [76.660, 1.0023, 1333.1, 119.2], [76.702, 1.0023, 1341.4, 111.1], [76.743, 1.0023, 1349.4, 103.3], [76.785, 1.0022, 1357.2, 96.0], [76.827, 1.0024, 1364.6, 88.9], [76.869, 1.0026, 1371.9, 81.7], [76.910, 1.0024, 1378.8, 75.2], [76.952, 1.0024, 1385.5, 68.9], [76.994, 1.0024, 1391.9, 62.7], [77.035, 1.0025, 1398.1, 56.6], [77.077, 1.0024, 1404.1, 50.9], [77.119, 1.0024, 1409.8, 45.4], [77.160, 1.0024, 1415.3, 40.1], [77.202, 1.0024, 1420.7, 35.1], [77.244, 1.0024, 1425.7, 30.0], [77.286, 1.0023, 1430.6, 25.4], [77.327, 1.0025, 1435.5, 20.7], [77.369, 1.0025, 1440.1, 16.2], [77.411, 1.0025, 1444.5, 12.1], [77.452, 1.0025, 1448.6, 7.9], [77.494, 1.0025, 1452.6, 4.1], [77.536, 1.0022, 1456.3, 0.6], [77.578, 1.0024, 1460.0, -3.0], [77.619, 1.0025, 1463.5, -6.4], [77.661, 1.0023, 1466.8, -9.7], [77.703, 1.0023, 1470.0, -12.7], [77.744, 1.0023, 1473.1, -15.7], [77.786, 1.0023, 1476.0, -18.6], [77.828, 1.0024, 1478.9, -21.4], [77.870, 1.0024, 1481.6, -24.0], [77.911, 1.0050, 1486.1, -26.0], [77.953, 1.0072, 1490.7, -27.9], [77.995, 1.0071, 1493.0, -30.1], [78.036, 1.0070, 1495.1, -32.0], [78.078, 1.0095, 1498.7, -34.8], [78.120, 1.0113, 1502.1, -36.2], [78.161, 1.0128, 1505.1, -37.2], [78.203, 1.0143, 1507.8, -38.4], [78.245, 1.0156, 1510.2, -39.7], [78.287, 1.0165, 1512.8, -40.1], [78.328, 1.0176, 1514.9, -41.1], [78.370, 1.0187, 1516.6, -42.3]],
};

/* @copia K03 · Spostamento di camera tra due oggetti (copia del reel 79, 9,55–12,2 s)
 * kallaway: reel 79, 9,59–12,05 s · dall'albero (cervello → ∞ + slot) la camera parte decisa verso la slot e frena a lungo
 *   (zoom ×1,55 + pan −407 px in 1,0 s, curva KW.arrive); la slot gira; poi riparte di lato verso la mappa (il ∞ gigante della
 *   tappa 1) e frena a lungo (pan −970 px in 1,59 s, picco 2154 px/s al 18% della durata)
 * misure: 1° tratto 9,593 → 10,594 s, ×1,551, Δx −407 px, cubic-bezier(0.165, 0.792, 0.605, 0.900) · 2° tratto 10,469 → 12,054 s,
 *   Δx −970 px, cubic-bezier(0.325, 0.085, 0.050, 0.965); la scala resta (×1,034)
 * quando: il discorso passa dall'oggetto A al B dello stesso schema («usa la stessa psicologia dei casinò» → la slot → «step 1»)
 * scena: t0 (9,551), t1 (12,221) · opzioni: cattura (tabella; default quella del reel 79)
 * restituisce: tempi { slot, mappa }
 * chiamata: COPIA.K03({ t0: 9.551, t1: 12.221 });
 */
COPIA.K03 = (scena, o) => {
  o = o || {};
  cpCam.cattura(o.cattura || CP_CATTURE.r79_k03);
  return { rect: null, pose: null, ancore: {}, elementi: {}, tempi: { slot: 10.594, mappa: 12.054 } };
};

/* @copia K17 · Mappa a loop: la camera viaggia lungo il simbolo da una tappa all'altra (copia del reel 79: 10,75–12,3 · 34,74–36,9
 *   · 50,93–52,47 · 75,28–78,4 s)
 * kallaway: reel 79 · il ∞ gigante (lo stesso tubo con le molecole, ~4,3 volte quello della scena 3) è la mappa del reel: le tappe
 *   hanno un numero enorme e il nome accanto (1 in alto a sinistra, 2 in basso a destra, 3 in alto a destra, 4 in basso a sinistra);
 *   la camera ci arriva di lato dalla slot (10,6–12,05 s), poi a ogni capitolo riparte dalla tappa di prima e viaggia lungo il tubo
 * misure: tappa 1 a 12,2 s: bordo sinistro del lobo x 172, bordo alto y 729 (schermo), «1» alto 188 px (x 330–428, base 706),
 *   «Stakes» 447–810, base 706; tubo 113 px sullo schermo; il numero arriva grigio (10,875) e diventa bianco (11,0), il nome sulla
 *   parola (grigio 11,5 → bianco 11,75)
 * quando: un reel a capitoli che ritornano sullo stesso schema (i 4 passi di un ciclo): la mappa si rivede a ogni capitolo
 * scena: X, Y (centro del ∞ nel mondo), parent · opzioni: a (865), b (506), w (138), nomi (4 nomi, "\n" = a capo), fsNum (333),
 *   fsNome (128)
 * restituisce: ancore { tappa(i), centro }, elementi { np, labs }, e .tappa(i, tNum, tempiNome) che accende numero e nome
 */
COPIA.K17 = (scena, o) => {
  o = o || {};
  const L = scena.parent || layer(9);
  const X = scena.X, Y = scena.Y, a = o.a || 865, b = o.b || 506, w = o.w || 138;
  const np = cpNeonK(neonPath(L, cpInfD(X, Y, a, b), { w, z: o.z || 8, drawn: true, molecole: true }));
  const fsN = o.fsNum || 333, fsT = o.fsNome || 128;
  const nomi = o.nomi || ["Posta\nin gioco", "Grande\ndomanda", "Finta", "Riaggancio"];
  // posizione delle tappe (mondo): 1 sopra il lobo sinistro, 2 sotto il destro, 3 sopra il destro, 4 sotto il sinistro
  const ox = -a - w / 2 + 201, top = Y - 0.75 * b - w / 2, bot = Y + 0.75 * b + w / 2;
  // o.tappe: [[x, y, "su" | "giu"], …] nel mondo (x = bordo sinistro del numero, y = base del numero per "su", cima per "giu"),
  // misurate sul suo video; senza, le posizioni di default attorno ai lobi
  const ancore = o.tappe || [[X + ox, top - 29, "su"], [X + a * 0.18, bot + 29, "giu"], [X + a * 0.18, top - 29, "su"], [X + ox, bot + 29, "giu"]];
  const labs = nomi.map((nm, i) => {
    const [lx, ly, dir] = ancore[i];
    const box = layered(el(L, Object.assign({ position: "absolute", left: lx, width: 2000, display: "flex", alignItems: "flex-end", gap: Math.round(fsN * 0.06), whiteSpace: "nowrap", zIndex: (o.z || 8) + 6 }, dir === "su" ? { top: ly, transform: "translateY(-100%)" } : { top: ly })));
    const num = el(box, { fontFamily: FD, fontWeight: 700, fontSize: fsN, lineHeight: 0.74, color: GREY, textShadow: CP_GLOW_T, letterSpacing: "-0.03em" }, String(i + 1), "span");
    const righe = nm.split("\n");
    const fsR = righe.length > 1 ? Math.round(fsT * 0.78) : fsT;
    const nb = el(box, { display: "flex", flexDirection: "column", fontFamily: FD, fontWeight: 700, fontSize: fsR, lineHeight: 0.95, letterSpacing: "-0.02em", paddingBottom: Math.round(fsN * 0.0) }, null, "span");
    const parole = [];
    righe.forEach((r) => { const rr = el(nb, { display: "block", whiteSpace: "nowrap" }, null, "span"); r.split(" ").forEach((p, k, A) => parole.push(el(rr, { display: "inline-block", whiteSpace: "pre", color: GREY, textShadow: CP_GLOW_T }, p + (k < A.length - 1 ? " " : ""), "span"))); });
    gsap.set(num, { opacity: 0, filter: "blur(10px)" });
    gsap.set(parole, { opacity: 0, filter: "blur(9px)", y: 6 });
    return { box, num, parole, xy: [lx, ly] };
  });
  // tappa i: il numero arriva grigio e sfocato e diventa bianco; il nome parola per parola (grigio → bianco)
  const tappa = (i, tNum, tempiNome, o2) => {
    o2 = o2 || {};
    const lb = labs[i];
    // o2.pos = [x, y, "su" | "giu"]: la posizione misurata sul suo video (mondo), data quando la camera di quel tratto è nota
    if (o2.pos) {
      const [x, y, dir] = o2.pos;
      Object.assign(lb.box.style, { left: `${x}px`, top: `${y}px`, transform: dir === "su" ? "translateY(-100%)" : "none" });
    }
    tl.to(lb.num, { opacity: 1, filter: "blur(0px)", duration: 0.12, ease: "power2.out" }, tNum);
    tl.to(lb.num, { color: K.white, duration: 0.12, ease: "power1.out" }, tNum + (o2.bianco == null ? 0.12 : o2.bianco));
    tl.set(lb.num, { filter: "none" }, tNum + 0.13);
    if (tempiNome) lb.parole.forEach((p, k) => {
      const t = Array.isArray(tempiNome) ? tempiNome[Math.min(k, tempiNome.length - 1)] : tempiNome + k * 0.1;
      tl.to(p, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.16, ease: "power2.out" }, t);
      tl.to(p, { color: K.white, duration: 0.18, ease: "power1.out" }, t + (o2.biancoNome == null ? 0.2 : o2.biancoNome));
      tl.set(p, { filter: "none" }, t + 0.17);
    });
  };
  return {
    rect: [X - a - w, top, X + a + w, bot], pose: null,
    ancore: { centro: [X, Y], tappa: (i) => ancore[i].slice(0, 2) },
    elementi: { np, labs, L }, tappa,
  };
};

/* @copia K04 · Drift continuo (la camera non è mai ferma) (copia del reel 79, 18,4–19,8 s e 20,8–22,6 s)
 * kallaway: reel 79, 20,8–22,6 s · mentre la lista delle fiches si riempie, la camera sale piano: il contenuto fermo (la fiche 3
 *   ancora in basso) scivola su di 86 px in ~1,7 s, con l'inizio e la fine morbidi (picco ~130 px/s a 21,6 s); all'ingresso della
 *   scena (18,4–19,8 s) un piccolo arrivo: il contenuto sale di 24 px e va a destra di 8 frenando
 * misure: fiche 3 (ferma nel mondo) 20,81: 1096 · 21,19: 1089 · 21,44: 1073 · 21,69: 1044 · 21,94: 1025 · 22,19: 1015 ·
 *   22,44: 1011 · 22,56: 1010 (bbox.py fotogramma per fotogramma)
 * quando: sempre, quando nessun altro movimento è in corso da più di ~1 s (qui: fra una voce della lista e l'altra)
 * scena: t0 (20,81) · opzioni: pista ([[t, dx, dy]] px schermo del contenuto, default quella misurata), arrivo (t: aggiunge il
 *   piccolo arrivo d'ingresso da t a t + 1,4)
 * chiamata: COPIA.K04({ t0: 20.81 }, { arrivo: 18.4 });
 */
COPIA.K04 = (scena, o) => {
  o = o || {};
  if (o.arrivo != null) {
    const a = o.arrivo;
    cpCam.percorso([[a, 0, 0], [a + 0.41, 1, -5], [a + 0.54, 3, -10], [a + 0.66, 4.5, -14], [a + 0.79, 5.5, -17], [a + 0.91, 6.5, -19], [a + 1.04, 7, -21], [a + 1.16, 7.5, -22.5], [a + 1.29, 8, -23], [a + 1.41, 8, -24]]);
  }
  const t0 = scena.t0;
  const pista = o.pista || [[0, 0, 0], [0.13, 0, -1.5], [0.25, 0, -4.5], [0.38, 0, -7.5], [0.5, 0, -13.5], [0.63, 0, -23.5], [0.75, 0, -36.5], [0.88, 0, -52.5], [1.0, 0, -63.5], [1.13, 0, -71.5], [1.25, 0, -77.5], [1.38, 0, -81.5], [1.5, 0, -83.5], [1.63, 0, -85.5], [1.75, 0, -86.5]];
  cpCam.percorso(pista.map(([t, x, y]) => [t0 + t, x, y]));
  return { rect: null, pose: null, ancore: {}, elementi: {}, tempi: { fine: t0 + pista[pista.length - 1][0] } };
};

/* @copia K02 · Arrivo in movimento dopo il taglio (copia del reel 79, 34,74–36,5 s e 50,93–52,4 s)
 * kallaway: reel 79, 34,743 s · dopo la faccia, taglio sulla mappa (il ∞ gigante con «1 Stakes» in basso): al primo fotogramma la
 *   scena corre già a 4428 px/s in diagonale (su e a sinistra) e frena a lungo fino alla tappa 2 («2 Big Question»), ferma a ~36,1 s
 * misure: −677 / −802 px (1050 px) in 1,34 s, picco al primo fotogramma, cubic-bezier(0.030, 0.427, 0.340, 0.850) (KW.arrive il
 *   più vicino, errore 0,029), scala ferma (×1,002); il numero della tappa arriva grigio a +0,25 s, il nome a +0,7 s
 * quando: all'inizio di una scena grafica che segue la faccia: la grafica non parte ferma, sembra che la camera stesse viaggiando
 * scena: t0 (il taglio), posa (la posa al taglio) · opzioni: cattura (tabella; default quella del reel 79 a 34,743 s)
 * chiamata: COPIA.K02({ t0: 34.743, posa }, {});
 */
COPIA.K02 = (scena, o) => {
  o = o || {};
  cpCam.taglio(scena.t0, scena.posa);
  const c = o.cattura || CP_CATTURE.r79_mappa12;
  const d = scena.t0 - c[0][0];
  cpCam.cattura(c.map(([t, k, x, y]) => [t + d, k, x, y]));
  return { rect: null, pose: scena.posa, ancore: {}, elementi: {}, tempi: { fine: c[c.length - 1][0] + d } };
};

/* @copia K06 · Punch-in sulla parola chiave (copia del reel 79, 102,17–105,6 s: il tuffo sul numero del canale)
 * kallaway: reel 79, 102,17 s · su «Over 100,000 people…» la camera si tuffa di colpo nella riga del canale sotto la card del video
 *   (nome, iscritti, visualizzazioni: il numero che conta) e la tiene grande; su «YouTube» (105,35 s) torna fuori di colpo.
 *   Nel tratto 12,6–13,6 s indicato dal catalogo la camera non si muove (il telefono resta largo 333 px, bbox.py fotogramma per
 *   fotogramma): l'accento lì è il cervello che si accende col disco; il colpo di camera vero del reel è questo
 * misure: ×4,5 in 0,33 s (power3.inOut, con la scia verticale), centro dello zoom (109, 1172): la riga del canale passa da ~12 px
 *   a ~55 px di testo; uscita ×1/4,5 in 0,25 s; il titolo nell'HUD sparisce mentre si è dentro
 * quando: il numero o la parola che è la prova (visualizzazioni, iscritti, il risultato): ci si butta dentro e lo si legge
 * scena: t0 (inizio del colpo), t1 · opzioni: k (4,5), Q (punto dello schermo che resta fermo), dur (0,33), esce ([t, dur]: ritorno)
 * chiamata: COPIA.K06({ t0: 102.17, t1: 105.6 }, { k: 4.5, Q: [109, 1172], esce: [105.35, 0.25] });
 */
COPIA.K06 = (scena, o) => {
  o = o || {};
  const k = o.k || 1.12, Q = o.Q || [ANCHOR.x, ANCHOR.y], dur = o.dur || 0.3;
  cpCam.zoom(scena.t0, dur, k, Q, o.ease || "power3.inOut");
  if (k > 1.5) mblur(scena.t0, dur, o.scia || 10, "y");
  if (o.esce) { cpCam.zoom(o.esce[0], o.esce[1], 1 / k, Q, o.ease || "power3.inOut"); if (k > 1.5) mblur(o.esce[0], o.esce[1], o.scia || 10, "y"); }
  return { rect: null, pose: null, ancore: {}, elementi: {}, tempi: { colpo: scena.t0 + dur } };
};
