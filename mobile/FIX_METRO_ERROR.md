# 🔧 Correction de l'Erreur Metro

## ⚠️ Erreur Identifiée

```
Metro has encountered an error: Cannot read properties of undefined (reading 'type')
ModuleResolution.js (208:24)
```

Cette erreur indique un problème avec la résolution de modules dans Metro bundler.

## ✅ Solutions (à essayer dans l'ordre)

### Solution 1 : Nettoyer le Cache Metro

```bash
cd mobile
npx expo start --clear
```

Ou manuellement :

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npx expo start --clear
```

### Solution 2 : Nettoyer node_modules et Réinstaller

```bash
cd mobile
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npx expo start --clear
```

### Solution 3 : Nettoyer le Cache Watchman (si installé)

```bash
watchman watch-del-all
```

### Solution 4 : Vérifier la Configuration Metro

Assurez-vous que `metro.config.js` est correct. Si nécessaire, réinitialisez-le :

```bash
npx expo install --fix
```

### Solution 5 : Redémarrer avec Reset Cache

```bash
# Arrêter le serveur Metro (Ctrl+C)
# Puis :
npx expo start -c
```

Le flag `-c` ou `--clear` nettoie le cache.

## 🚀 Solution Rapide (Recommandée)

Exécutez ces commandes dans l'ordre :

```powershell
cd mobile

# 1. Arrêter le serveur Metro si il tourne (Ctrl+C)

# 2. Nettoyer le cache
npx expo start --clear

# Si ça ne fonctionne pas :
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npm cache clean --force
npx expo start --clear
```

## 📝 Si le Problème Persiste

1. **Vérifiez les versions** :
   ```bash
   npm list expo metro
   ```

2. **Mettez à jour Expo** :
   ```bash
   npx expo install --fix
   ```

3. **Réinstallez les dépendances** :
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

4. **Redémarrez complètement** :
   - Fermez tous les terminaux
   - Redémarrez votre éditeur
   - Relancez `npx expo start --clear`

## 💡 Note

Cette erreur est souvent causée par un cache Metro corrompu. Le nettoyage du cache résout généralement le problème.

