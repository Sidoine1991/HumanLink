# Script PowerShell pour corriger les dépendances Expo SDK 54
Write-Host "🧹 Nettoyage des caches et modules..." -ForegroundColor Cyan

# Supprimer les caches
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ node_modules supprimé" -ForegroundColor Green
}

if (Test-Path ".expo") {
    Remove-Item -Recurse -Force ".expo"
    Write-Host "✅ .expo supprimé" -ForegroundColor Green
}

if (Test-Path ".expo-shared") {
    Remove-Item -Recurse -Force ".expo-shared"
    Write-Host "✅ .expo-shared supprimé" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ package-lock.json supprimé" -ForegroundColor Green
}

Write-Host "`n📦 Installation des dépendances avec Expo..." -ForegroundColor Cyan
npm install

Write-Host "`n🔧 Installation des versions compatibles Expo SDK 54..." -ForegroundColor Cyan
npx expo install --fix

Write-Host "`n✅ Terminé ! Vous pouvez maintenant lancer: npx expo start -c" -ForegroundColor Green

