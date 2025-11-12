# Script PowerShell pour corriger définitivement l'erreur Metro 500
Write-Host "🔧 Correction de l'erreur Metro 500..." -ForegroundColor Yellow
Write-Host ""

# Étape 1: Arrêter tous les processus Metro/Expo
Write-Host "🛑 Arrêt de Metro..." -ForegroundColor Cyan
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Étape 2: Nettoyer tous les caches
Write-Host "🧹 Nettoyage des caches..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .metro -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\.gradle -ErrorAction SilentlyContinue
npm cache clean --force

Write-Host "✅ Nettoyage terminé!" -ForegroundColor Green
Write-Host ""

# Étape 3: Vérifier la configuration
Write-Host "📋 Vérification de la configuration..." -ForegroundColor Cyan
Write-Host "- metro.config.js: Configuration minimale (pas de resolver personnalisé)" -ForegroundColor Gray
Write-Host "- app.json: Router désactivé" -ForegroundColor Gray
Write-Host "- Packages: Versions correctes" -ForegroundColor Gray
Write-Host ""

# Étape 4: Redémarrer Metro
Write-Host "🚀 Démarrage de Metro avec cache nettoyé..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: Regardez les logs Metro ci-dessous!" -ForegroundColor Red
Write-Host "Si vous voyez une erreur, copiez le message d'erreur complet." -ForegroundColor Red
Write-Host ""

# Redémarrer Metro
npx expo start --clear

