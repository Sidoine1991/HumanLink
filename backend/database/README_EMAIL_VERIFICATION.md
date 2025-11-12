# Vérification Email - Documentation

## Vue d'ensemble

Le système de vérification email a été ajouté à l'application HumanLink. Lors de l'inscription, un code à 6 chiffres est généré et envoyé par email. L'utilisateur doit vérifier son email avant de pouvoir se connecter.

## Nouveaux champs dans la table `users`

- `email_verified` (VARCHAR) - Statut de vérification ("true" ou "false")
- `verification_code` (VARCHAR) - Code à 6 chiffres pour la vérification
- `verification_code_expires` (TIMESTAMP) - Date d'expiration du code (15 minutes par défaut)

## Migration de la base de données

Si vous avez déjà une table `users` existante, exécutez le script de migration :

```sql
-- Via Supabase Dashboard: SQL Editor
-- Copiez-collez le contenu de migration_add_email_verification.sql
```

Ou via psql :
```bash
psql -h db.xxx.supabase.co -U postgres -d postgres -f database/migration_add_email_verification.sql
```

## Configuration Email

Les variables d'environnement suivantes doivent être configurées dans `.env` :

```env
EMAIL_USER=syebadokpo@gmail.com
EMAIL_PASS=sxzqsehuzpwveqzf
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
VERIFICATION_CODE_EXPIRE_MINUTES=15
```

### Configuration Gmail

Pour utiliser Gmail SMTP, vous devez :
1. Activer l'authentification à deux facteurs sur votre compte Gmail
2. Générer un "Mot de passe d'application" :
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et votre appareil
   - Copiez le mot de passe généré dans `EMAIL_PASS`

## Endpoints API

### 1. Inscription (modifié)
```
POST /auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "display_name": "John Doe"
}
```
- Crée un compte utilisateur
- Génère un code de vérification à 6 chiffres
- Envoie un email avec le code
- Retourne les informations de l'utilisateur (avec `email_verified: false`)

### 2. Vérification de l'email
```
POST /auth/verify-email
Body: {
  "email": "user@example.com",
  "code": "123456"
}
```
- Vérifie le code de vérification
- Marque l'email comme vérifié
- Retourne un message de succès

### 3. Renvoyer le code de vérification
```
POST /auth/resend-verification
Body: {
  "email": "user@example.com"
}
```
- Génère un nouveau code de vérification
- Envoie un nouvel email avec le code
- Utile si le code a expiré ou n'a pas été reçu

### 4. Connexion (modifié)
```
POST /auth/token
Body (form-data):
  username: user@example.com
  password: password123
```
- Vérifie que l'email est vérifié avant de permettre la connexion
- Retourne une erreur 403 si l'email n'est pas vérifié

## Flux utilisateur

1. **Inscription** : L'utilisateur crée un compte → reçoit un email avec un code
2. **Vérification** : L'utilisateur entre le code reçu → compte vérifié
3. **Connexion** : L'utilisateur peut maintenant se connecter

Si le code expire ou n'est pas reçu :
- L'utilisateur peut utiliser `/auth/resend-verification` pour recevoir un nouveau code

## Sécurité

- Le code expire après 15 minutes (configurable via `VERIFICATION_CODE_EXPIRE_MINUTES`)
- Le code est supprimé après vérification réussie
- Un utilisateur non vérifié ne peut pas se connecter
- Les codes sont générés de manière aléatoire (100000-999999)

## Tests

Pour tester l'envoi d'email en développement, vous pouvez :
1. Vérifier les logs du serveur pour voir si l'email a été envoyé
2. Utiliser un service comme Mailtrap pour capturer les emails en développement
3. Vérifier votre boîte de réception Gmail (et les spams)

## Dépannage

### L'email n'est pas envoyé
- Vérifiez que `EMAIL_USER` et `EMAIL_PASS` sont correctement configurés
- Vérifiez que le mot de passe d'application Gmail est correct
- Vérifiez les logs du serveur pour les erreurs SMTP

### Le code expire trop vite
- Augmentez `VERIFICATION_CODE_EXPIRE_MINUTES` dans `.env`

### Erreur "Email not verified" lors de la connexion
- L'utilisateur doit d'abord vérifier son email via `/auth/verify-email`
- Ou utiliser `/auth/resend-verification` pour recevoir un nouveau code

