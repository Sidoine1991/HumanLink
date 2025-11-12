-- =====================================================
-- Script de Suppression des Tables
-- HumanLink Database
-- =====================================================
-- 
-- ⚠️ ATTENTION: Ce script supprime TOUTES les tables et données!
-- Utilisez uniquement pour réinitialiser complètement la base de données
-- =====================================================

-- Supprimer les vues d'abord
DROP VIEW IF EXISTS user_mood_stats CASCADE;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Supprimer les tables (dans l'ordre pour respecter les dépendances)
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS mood_events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Toutes les tables ont été supprimées avec succès.';
    RAISE NOTICE 'Exécutez schema.sql pour recréer les tables.';
END $$;

