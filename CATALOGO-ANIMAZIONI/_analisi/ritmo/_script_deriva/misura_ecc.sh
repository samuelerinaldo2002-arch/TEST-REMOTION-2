#!/bin/bash
cd "/c/Users/rinal/Desktop/REMOTION - TEST 2/TEST KALLAWAYMARKETING"
P="_tools/venv/Scripts/python.exe -I _tools/deriva.py --metodo ecc"
$P --k reel:72  --t 9.333  --dur 3    --voce e00_r72  --escludi "200,150,140,930"
$P --k reel:100 --t 94.40  --dur 3    --voce e01_r100 --maschera "0,180,1080,700"
$P --k reel:56  --t 11.5   --dur 3    --voce e02_r56  --maschera "140,560,180,250;750,560,190,250"
$P --k reel:69  --t 10.761 --dur 1.95 --voce e03_r69  --maschera "250,330,580,520"
$P --k reel:31  --t 74.792 --dur 1.9  --voce e04_r31  --maschera "260,440,560,300"
$P --k reel:48  --t 25.567 --dur 3    --voce e06_r48  --maschera "250,800,600,300"
$P --k reel:98  --t 36.62  --dur 3    --voce e07_r98  --maschera "90,480,900,620"
$P --k reel:65  --t 58.75  --dur 3    --voce e08_r65
$P --k reel:19  --t 36.458 --dur 3    --voce e09_r19  --maschera "0,520,1080,560" --escludi "70,600,940,440"
$P --k reel:49  --t 68.569 --dur 3    --voce e11_r49  --maschera "100,380,880,720"
