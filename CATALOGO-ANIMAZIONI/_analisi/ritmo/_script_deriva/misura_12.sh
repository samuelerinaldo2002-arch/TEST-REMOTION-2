#!/bin/bash
# 12 tagli: maschera = elementi fermi del mondo (x,y,w,h a 1080x1920), esclusi = animazioni locali/video/bagliori
cd "/c/Users/rinal/Desktop/REMOTION - TEST 2/TEST KALLAWAYMARKETING"
P="_tools/venv/Scripts/python.exe -I _tools/deriva.py"
$P --k reel:72  --t 9.333  --dur 3    --voce c00_r72  --escludi "200,150,140,930" --titolo 0,58,1080,140
$P --k reel:100 --t 94.40  --dur 3    --voce c01_r100 --maschera "0,180,1080,700" --titolo 0,58,1080,120
$P --k reel:56  --t 11.5   --dur 3    --voce c02_r56  --maschera "140,560,180,250;750,560,190,250" --titolo 0,58,1080,170
$P --k reel:69  --t 10.761 --dur 1.95 --voce c03_r69  --maschera "250,330,580,520" --titolo 0,58,1080,180
$P --k reel:31  --t 74.792 --dur 1.9  --voce c04_r31  --maschera "260,440,560,300" --titolo 0,58,1080,200
$P --k reel:46  --t 35.786 --dur 3    --voce c05_r46  --titolo 0,180,1080,200
$P --k reel:48  --t 25.567 --dur 3    --voce c06_r48  --maschera "250,800,600,300" --titolo 0,180,1080,160
$P --k reel:98  --t 36.62  --dur 3    --voce c07_r98  --maschera "90,480,900,620" --titolo 0,140,1080,160
$P --k reel:65  --t 58.75  --dur 3    --voce c08_r65
$P --k reel:19  --t 36.458 --dur 3    --voce c09_r19  --maschera "0,520,1080,560" --escludi "70,600,940,440" --titolo 0,120,1080,200
$P --k reel:27  --t 34.826 --dur 3    --voce c10_r27  --maschera "180,480,900,620" --titolo 0,80,1080,150
$P --k reel:49  --t 68.569 --dur 3    --voce c11_r49  --maschera "100,380,880,720" --titolo 0,80,1080,240
