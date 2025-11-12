# Scripts de Base de Données

Ce dossier contient les scripts SQL pour créer et gérer la base de données HumanLink.

## Fichiers

- **`schema.sql`** - Script complet pour créer toutes les tables, index, contraintes et vues

## Utilisation

### Option 1: Via Supabase Dashboard (Recommandé)

1. Allez sur votre dashboard Supabase
2. Naviguez vers **SQL Editor**
3. Cliquez sur **New Query**
4. Copiez-collez le contenu de `schema.sql`
5. Cliquez sur **Run** (ou `Ctrl+Enter`)

### Option 2: Via psql (ligne de commande)

```bash
psql -h db.jetadgggujgthdjzlfad.supabase.co \
     -U postgres \
     -d postgres \
     -f database/schema.sql
```

### Option 3: Automatique (via l'application)

Les tables sont créées automatiquement au démarrage de l'application FastAPI grâce à `Base.metadata.create_all()` dans `app/main.py`.

## Structure des Tables

### 1. `users`
Stoque les informations des utilisateurs
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE, INDEXED)
- `hashed_password` (VARCHAR)
- `display_name` (VARCHAR, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

### 2. `mood_events`
Stoque les événements d'humeur des utilisateurs
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `text` (TEXT, nullable)
- `mood_label` (VARCHAR) - ex: joy, calm, energy, fatigue, stress
- `mood_score` (DOUBLE PRECISION, default 0.0)
- `lat`, `lng` (DOUBLE PRECISION, nullable) - coordonnées GPS
- `created_at` (TIMESTAMP)

**Index:**
- `idx_mood_events_user_id` - pour les requêtes par utilisateur
- `idx_mood_events_created_at` - pour le tri chronologique
- `idx_mood_events_location` - pour les recherches géographiques
- `idx_mood_events_mood_label` - pour filtrer par type d'humeur

### 3. `feedbacks`
Stoque les retours/commentaires des utilisateurs
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY → users.id)
- `mood_event_id` (INTEGER, FOREIGN KEY → mood_events.id, nullable)
- `sentiment` (VARCHAR) - positive, neutral, negative
- `note` (TEXT, nullable)
- `created_at` (TIMESTAMP)

**Index:**
- `idx_feedbacks_user_id` - pour les requêtes par utilisateur
- `idx_feedbacks_mood_event_id` - pour lier aux événements
- `idx_feedbacks_created_at` - pour le tri chronologique
- `idx_feedbacks_sentiment` - pour filtrer par sentiment

## Fonctionnalités

### Triggers
- `update_users_updated_at` - Met à jour automatiquement `updated_at` lors de la modification d'un utilisateur

### Vues
- `user_mood_stats` - Vue agrégée avec statistiques des humeurs par utilisateur

## Notes

- Toutes les clés étrangères utilisent `ON DELETE CASCADE` pour `users` et `ON DELETE SET NULL` pour les références optionnelles
- Les index sont optimisés pour les requêtes fréquentes (recherche par utilisateur, tri chronologique, recherche géographique)
- Le script utilise `CREATE TABLE IF NOT EXISTS` pour éviter les erreurs si les tables existent déjà

## Réinitialisation

⚠️ **ATTENTION**: Pour supprimer toutes les tables et les recréer (perte de données):

```sql
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS mood_events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Puis exécutez à nouveau `schema.sql`.

