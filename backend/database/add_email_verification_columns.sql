-- =====================================================
-- Ajout des colonnes de vérification email
-- Exécutez ce script dans Supabase SQL Editor
-- =====================================================

-- Ajouter la colonne email_verified
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified VARCHAR(10) DEFAULT 'false' NOT NULL;

-- Ajouter la colonne verification_code
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10);

-- Ajouter la colonne verification_code_expires
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_code_expires TIMESTAMP WITH TIME ZONE;

-- Mettre à jour les utilisateurs existants (optionnel - décommentez si nécessaire)
-- UPDATE users SET email_verified = 'true' WHERE email_verified IS NULL;

-- Ajouter les commentaires
COMMENT ON COLUMN users.email_verified IS 'Statut de vérification email (true/false)';
COMMENT ON COLUMN users.verification_code IS 'Code de vérification à 6 chiffres';
COMMENT ON COLUMN users.verification_code_expires IS 'Date d''expiration du code de vérification';

-- Vérification
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('email_verified', 'verification_code', 'verification_code_expires')
ORDER BY column_name;

