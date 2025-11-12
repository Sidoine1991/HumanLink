# Script PowerShell pour nettoyer complètement et redémarrer Metro
Write-Host "🧹 Nettoyage des caches Metro et Expo..." -ForegroundColor Yellow

# Arrêter tous les processus Metro/Expo
Get-Process | Where-Object { $_.ProcessName -like "*node*" -or $_.ProcessName -like "*expo*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Supprimer les caches
Write-Host "Suppression des caches..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .metro -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\.gradle -ErrorAction SilentlyContinue

# Nettoyer le cache npm
Write-Host "Nettoyage du cache npm..." -ForegroundColor Cyan
npm cache clean --force

Write-Host "✅ Nettoyage terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Démarrage de Metro avec cache nettoyé..." -ForegroundColor Yellow
Write-Host ""

# Redémarrer Metro
npx expo start --clear

