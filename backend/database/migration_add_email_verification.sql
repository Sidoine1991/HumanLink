-- =====================================================
-- Migration: Ajout de la vérification email
-- HumanLink Database
-- =====================================================
-- 
-- Ce script ajoute les colonnes nécessaires pour la vérification email
-- à la table users existante.
-- 
-- Exécutez ce script si vous avez déjà une table users sans ces colonnes.
-- =====================================================

-- Ajouter les colonnes si elles n'existent pas déjà
DO $$ 
BEGIN
    -- Ajouter email_verified
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email_verified'
    ) THEN
        ALTER TABLE users ADD COLUMN email_verified VARCHAR(10) DEFAULT 'false' NOT NULL;
        RAISE NOTICE 'Column email_verified added';
    ELSE
        RAISE NOTICE 'Column email_verified already exists';
    END IF;

    -- Ajouter verification_code
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'verification_code'
    ) THEN
        ALTER TABLE users ADD COLUMN verification_code VARCHAR(10);
        RAISE NOTICE 'Column verification_code added';
    ELSE
        RAISE NOTICE 'Column verification_code already exists';
    END IF;

    -- Ajouter verification_code_expires
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'verification_code_expires'
    ) THEN
        ALTER TABLE users ADD COLUMN verification_code_expires TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Column verification_code_expires added';
    ELSE
        RAISE NOTICE 'Column verification_code_expires already exists';
    END IF;
END $$;

-- Mettre à jour les utilisateurs existants pour qu'ils soient vérifiés
-- (optionnel - décommentez si vous voulez que les comptes existants soient automatiquement vérifiés)
-- UPDATE users SET email_verified = 'true' WHERE email_verified IS NULL OR email_verified = '';

-- Ajouter les commentaires
COMMENT ON COLUMN users.email_verified IS 'Statut de vérification email (true/false)';
COMMENT ON COLUMN users.verification_code IS 'Code de vérification à 6 chiffres';
COMMENT ON COLUMN users.verification_code_expires IS 'Date d''expiration du code de vérification';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'All users table columns for email verification have been added.';
END $$;

