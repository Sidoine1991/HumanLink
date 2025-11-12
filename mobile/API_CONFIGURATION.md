# 🔧 Configuration de l'API - HumanLink Mobile

## ⚠️ Problème : Aucune page ne s'affiche après création de compte

Si après avoir cliqué sur "Créer un compte", rien ne se passe, vérifiez :

### 1. 📱 Où testez-vous l'application ?

#### A. Sur le Web (navigateur)
- ✅ `http://localhost:8000` fonctionne
- Aucun changement nécessaire

#### B. Sur Expo Go (téléphone physique)
- ❌ `http://localhost:8000` **NE FONCTIONNE PAS**
- ✅ Vous devez utiliser votre **IP locale**

### 2. 🔍 Trouver votre IP locale

#### Windows (PowerShell)
```powershell
ipconfig
```
Cherchez **"IPv4 Address"** sous votre connexion Wi-Fi ou Ethernet.
Exemple : `192.168.1.100`

#### Mac/Linux
```bash
ifconfig
# ou
ip addr
```

### 3. 🔧 Mettre à jour la configuration

Ouvrez `mobile/src/api.tsx` et modifiez la ligne 17 :

```typescript
// Pour le web (navigateur)
const baseURL = 'http://localhost:8000';

// Pour Expo Go sur téléphone (remplacez par VOTRE IP)
const baseURL = 'http://192.168.1.100:8000';
```

### 4. ✅ Vérifier les logs

Après avoir modifié, rechargez l'application et regardez la console :

1. **Dans le terminal Expo** : Vous verrez les logs avec des emojis
2. **Dans la console du navigateur** (F12) : Si vous testez sur web
3. **Dans Expo Go** : Appuyez sur `j` dans le terminal Expo pour ouvrir le debugger

### 5. 📊 Logs attendus

Quand vous créez un compte, vous devriez voir :

```
🔄 Début de la création du compte...
📧 Email: votre@email.com
👤 Nom: Votre Nom
🔗 Configuration API avec baseURL: http://...
📤 POST /auth/register
✅ POST /auth/register - Status: 200
✅ Compte créé avec succès: {...}
🧭 Navigation vers VerifyEmail...
✅ Navigation réussie vers VerifyEmail
```

### 6. 🐛 Si vous voyez des erreurs

#### Erreur : `ERR_NETWORK` ou `ECONNREFUSED`
- ❌ Le backend n'est pas démarré
- ✅ Solution : Démarrez le backend avec `python run.py` dans le dossier `backend`

#### Erreur : `Network request failed`
- ❌ Mauvaise URL (localhost sur téléphone)
- ✅ Solution : Utilisez votre IP locale

#### Erreur : `404 Not Found`
- ❌ Le backend n'est pas sur le bon port
- ✅ Vérifiez que le backend écoute sur le port 8000

### 7. 🔄 Test rapide

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:8000/health` (ou `http://VOTRE_IP:8000/health`)
3. Vous devriez voir : `{"status":"ok"}`
4. Si ça fonctionne, l'URL est correcte

### 8. 💡 Astuce : Configuration automatique

Pour éviter de changer manuellement, vous pouvez détecter automatiquement :

```typescript
import { Platform } from 'react-native';

// Détection automatique de l'environnement
const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }
  // Pour mobile, utilisez votre IP locale
  // TODO: Remplacer par votre IP
  return 'http://192.168.1.100:8000';
};

const baseURL = getBaseURL();
```

## 📝 Résumé

1. ✅ Vérifiez que le backend est démarré
2. ✅ Trouvez votre IP locale avec `ipconfig`
3. ✅ Modifiez `baseURL` dans `mobile/src/api.tsx`
4. ✅ Rechargez l'application
5. ✅ Regardez les logs dans la console

