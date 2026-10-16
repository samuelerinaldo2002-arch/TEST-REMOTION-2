# Render di prova di ritmo-01 sotto il lucchetto comune dei render (CATALOGO-ANIMAZIONI/_analisi/render/.lock-render):
# se il lucchetto c'e' si aspetta (max 40 min), poi mkdir + chi.txt, build, render draft; il lucchetto si toglie sempre.
# (solo ASCII: PowerShell 5.1 legge i .ps1 senza BOM come ANSI)
param([string]$voce = "")
$R = "C:\Users\rinal\Desktop\REMOTION - TEST 2\TEST KALLAWAYMARKETING"
$lock = "$R\CATALOGO-ANIMAZIONI\_analisi\render\.lock-render"
$out = "$R\CATALOGO-ANIMAZIONI\_analisi\render\ritmo-01_bozza.mp4"
$t = 0
while (Test-Path $lock) {
  if ($t -eq 0) { Write-Output ("lucchetto preso da: " + (Get-Content "$lock\chi.txt" -ErrorAction SilentlyContinue) + " - aspetto") }
  Start-Sleep -Seconds 20; $t += 20
  if ($t -gt 2400) { Write-Output "lucchetto ancora preso dopo 40 min: esco"; exit 2 }
}
New-Item -ItemType Directory $lock | Out-Null
Set-Content "$lock\chi.txt" ("blocco 1 del rifacimento (sotto-agente) - ritmo-01 render di prova " + $voce + " - " + (Get-Date -Format 'dd/MM HH:mm'))
try {
  node "$R\kw-kit\build.cjs" "$R\CATALOGO-ANIMAZIONI\ritmo-01"
  Set-Location "$R\CATALOGO-ANIMAZIONI\ritmo-01\composition"
  $tmp = "$R\CATALOGO-ANIMAZIONI\_analisi\render\ritmo-01_bozza.tmp.mp4"
  npx --yes hyperframes@0.8.138 render --quality draft --output $tmp 2>&1 | Select-Object -Last 4
  if (Test-Path $tmp) { Move-Item -Force $tmp $out; Write-Output "ok $out" } else { Write-Output "render non riuscito" }
} finally {
  Remove-Item -Recurse -Force $lock
}
