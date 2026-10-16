# Render di prova di una composizione ritmo-NN sotto il lucchetto comune dei render (CATALOGO-ANIMAZIONI/_analisi/render/.lock-render):
# se il lucchetto c'e' si aspetta (max 40 min), poi mkdir + chi.txt, build, render draft; il lucchetto si toglie sempre.
# Uso: powershell -File render_ritmo.ps1 -comp ritmo-02 -voce F02
# (solo ASCII: PowerShell 5.1 legge i .ps1 senza BOM come ANSI)
param([string]$comp = "ritmo-02", [string]$voce = "")
$R = "C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
$lock = "$R\CATALOGO-ANIMAZIONI\_analisi\render\.lock-render"
$out = "$R\CATALOGO-ANIMAZIONI\_analisi\render\$comp" + "_bozza.mp4"
$t = 0
while (Test-Path $lock) {
  if ($t -eq 0) { Write-Output ("lucchetto preso da: " + (Get-Content "$lock\chi.txt" -ErrorAction SilentlyContinue) + " - aspetto") }
  Start-Sleep -Seconds 20; $t += 20
  if ($t -gt 2400) { Write-Output "lucchetto ancora preso dopo 40 min: esco"; exit 2 }
}
New-Item -ItemType Directory $lock | Out-Null
Set-Content "$lock\chi.txt" ("blocco 2 del rifacimento (sotto-agente) - $comp render di prova " + $voce + " - " + (Get-Date -Format 'dd/MM HH:mm'))
try {
  node "$R\kw-kit\build.cjs" "$R\CATALOGO-ANIMAZIONI\$comp"
  Set-Location "$R\CATALOGO-ANIMAZIONI\$comp\composition"
  $tmp = "$R\CATALOGO-ANIMAZIONI\_analisi\render\$comp" + "_bozza.tmp.mp4"
  npx --yes hyperframes@0.8.138 render --quality draft --output $tmp 2>&1 | Select-Object -Last 4
  if (Test-Path $tmp) { Move-Item -Force $tmp $out; Write-Output "ok $out" } else { Write-Output "render non riuscito" }
} finally {
  Remove-Item -Recurse -Force $lock
}
