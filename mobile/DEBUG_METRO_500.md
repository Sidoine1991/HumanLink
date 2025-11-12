# 🔍 Debug de l'Erreur Metro 500

## ⚠️ Problème Persistant

L'erreur 500 persiste même avec la configuration minimale. L'URL contient `transform.routerRoot=app` ce qui suggère qu'Expo essaie d'utiliser expo-router.

## 🔍 Diagnostic

### 1. Vérifier les Logs Metro

**IMPORTANT** : Regardez le terminal où Metro tourne et copiez le message d'erreur complet. L'erreur 500 devrait afficher un message détaillé comme :

```
Error: ...
at ...
```

### 2. Vérifier si expo-router est installé

```bash
npm list expo-router
```

Si expo-router n'est pas installé mais que l'URL contient `routerRoot=app`, c'est probablement un problème de cache.

### 3. Nettoyage Complet

Exécutez le script de nettoyage :

```powershell
.\clean-and-restart.ps1
```

Ou manuellement :

```powershell
# Arrêter Metro (Ctrl+C)

# Supprimer tous les caches
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .metro -ErrorAction SilentlyContinue

# Nettoyer npm
npm cache clean --force

# Redémarrer
npx expo start --clear
```

### 4. Si le Problème Persiste

Essayez de réinstaller complètement :

```powershell
# Arrêter Metro

# Supprimer node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Réinstaller
npm install

# Redémarrer
npx expo start --clear
```

## 📝 Informations à Fournir

Si le problème persiste, fournissez :

1. **Le message d'erreur complet** du terminal Metro (pas juste l'erreur du navigateur)
2. **La version d'Expo** : `npx expo --version`
3. **La version de Node** : `node --version`
4. **Les logs complets** du démarrage Metro

## 💡 Solution Alternative : Utiliser Expo Go

Si le problème persiste avec le web, essayez sur un appareil physique :

```bash
npx expo start
```

Puis scannez le QR code avec Expo Go sur votre téléphone.

## 🔧 Configuration Actuelle

- `metro.config.js` : Configuration minimale (défaut Expo)
- `app.json` : `experiments.typedRoutes: false` ajouté
- Pas de dossier `app/` (pas d'expo-router)

