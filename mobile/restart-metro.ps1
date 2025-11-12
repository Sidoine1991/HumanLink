# Script PowerShell pour redémarrer Metro avec cache nettoyé
Write-Host "🛑 Arrêt de Metro..." -ForegroundColor Yellow

# Arrêter tous les processus Metro/Expo
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Where-Object { 
    $_.Path -like "*HumanLink*" -or $_.CommandLine -like "*expo*" -or $_.CommandLine -like "*metro*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "🧹 Nettoyage des caches..." -ForegroundColor Cyan

# Supprimer les caches
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .metro -ErrorAction SilentlyContinue

Write-Host "✅ Nettoyage terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Démarrage de Metro avec cache nettoyé..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: Regardez les logs Metro ci-dessous pour voir l'erreur exacte!" -ForegroundColor Red
Write-Host ""

# Redémarrer Metro (on est déjà dans le dossier mobile)
npx expo start --clear

