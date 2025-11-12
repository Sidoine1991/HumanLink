-- =====================================================
-- Migration: Ajouter la colonne bio aux utilisateurs
-- =====================================================
-- À exécuter dans Supabase (SQL Editor) si les tables existent déjà.
-- Cette migration est idempotente : elle vérifie l'existence de la colonne.
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'bio'
    ) THEN
        ALTER TABLE public.users
            ADD COLUMN bio TEXT;
    END IF;
END $$;

-- Mettre à jour updated_at automatiquement lors des modifications (si le trigger n'existe pas déjà)
-- (Le trigger peut déjà exister, on vérifie avant de le créer)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_users_updated_at'
    ) THEN
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON public.users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;


