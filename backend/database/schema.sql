-- =====================================================
-- HumanLink Database Schema
-- PostgreSQL / Supabase
-- =====================================================
-- 
-- Ce script crée toutes les tables nécessaires pour l'application HumanLink
-- 
-- Usage:
--   1. Via Supabase Dashboard: SQL Editor > New Query > Coller ce script > Run
--   2. Via psql: psql -h db.xxx.supabase.co -U postgres -d postgres -f schema.sql
--   3. Via l'application: Les tables sont créées automatiquement au démarrage
-- =====================================================

-- Supprimer les tables si elles existent (pour réinitialisation)
-- ATTENTION: Cela supprime toutes les données!
-- DROP TABLE IF EXISTS feedbacks CASCADE;
-- DROP TABLE IF EXISTS mood_events CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- Table: users
-- Description: Stocke les informations des utilisateurs
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    bio TEXT,
    email_verified VARCHAR(10) DEFAULT 'false' NOT NULL,
    verification_code VARCHAR(10),
    verification_code_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances de recherche par email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Commentaires pour la documentation
COMMENT ON TABLE users IS 'Table des utilisateurs de l''application HumanLink';
COMMENT ON COLUMN users.id IS 'Identifiant unique de l''utilisateur';
COMMENT ON COLUMN users.email IS 'Adresse email unique de l''utilisateur (utilisée pour la connexion)';
COMMENT ON COLUMN users.hashed_password IS 'Mot de passe hashé (bcrypt)';
COMMENT ON COLUMN users.display_name IS 'Nom d''affichage optionnel de l''utilisateur';
COMMENT ON COLUMN users.bio IS 'Biographie courte affichée dans le profil';
COMMENT ON COLUMN users.email_verified IS 'Statut de vérification email (true/false)';
COMMENT ON COLUMN users.verification_code IS 'Code de vérification à 6 chiffres';
COMMENT ON COLUMN users.verification_code_expires IS 'Date d''expiration du code de vérification';
COMMENT ON COLUMN users.created_at IS 'Date de création du compte';
COMMENT ON COLUMN users.updated_at IS 'Date de dernière modification';

-- =====================================================
-- Table: mood_events
-- Description: Stocke les événements d'humeur des utilisateurs
-- =====================================================
CREATE TABLE IF NOT EXISTS mood_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    text TEXT,
    mood_label VARCHAR(50) NOT NULL,
    mood_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Contrainte de clé étrangère
    CONSTRAINT fk_mood_events_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_mood_events_user_id ON mood_events(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_events_created_at ON mood_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_events_location ON mood_events(lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mood_events_mood_label ON mood_events(mood_label);

-- Commentaires pour la documentation
COMMENT ON TABLE mood_events IS 'Table des événements d''humeur enregistrés par les utilisateurs';
COMMENT ON COLUMN mood_events.id IS 'Identifiant unique de l''événement d''humeur';
COMMENT ON COLUMN mood_events.user_id IS 'Référence à l''utilisateur qui a créé cet événement';
COMMENT ON COLUMN mood_events.text IS 'Texte optionnel décrivant l''humeur ou la situation';
COMMENT ON COLUMN mood_events.mood_label IS 'Label de l''humeur (ex: joy, calm, energy, fatigue, stress)';
COMMENT ON COLUMN mood_events.mood_score IS 'Score numérique de l''humeur (0.0 à 1.0 généralement)';
COMMENT ON COLUMN mood_events.lat IS 'Latitude de la position géographique (optionnel)';
COMMENT ON COLUMN mood_events.lng IS 'Longitude de la position géographique (optionnel)';
COMMENT ON COLUMN mood_events.created_at IS 'Date et heure de création de l''événement';

-- =====================================================
-- Table: feedbacks
-- Description: Stocke les retours/commentaires des utilisateurs
-- =====================================================
CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    mood_event_id INTEGER,
    sentiment VARCHAR(20) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Contraintes de clés étrangères
    CONSTRAINT fk_feedbacks_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_feedbacks_mood_event 
        FOREIGN KEY (mood_event_id) 
        REFERENCES mood_events(id) 
        ON DELETE SET NULL,
    
    -- Contrainte de validation du sentiment
    CONSTRAINT chk_feedbacks_sentiment 
        CHECK (sentiment IN ('positive', 'neutral', 'negative'))
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_mood_event_id ON feedbacks(mood_event_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_sentiment ON feedbacks(sentiment);

-- Commentaires pour la documentation
COMMENT ON TABLE feedbacks IS 'Table des retours et commentaires des utilisateurs';
COMMENT ON COLUMN feedbacks.id IS 'Identifiant unique du feedback';
COMMENT ON COLUMN feedbacks.user_id IS 'Référence à l''utilisateur qui a créé ce feedback';
COMMENT ON COLUMN feedbacks.mood_event_id IS 'Référence optionnelle à un événement d''humeur associé';
COMMENT ON COLUMN feedbacks.sentiment IS 'Sentiment du feedback (positive, neutral, negative)';
COMMENT ON COLUMN feedbacks.note IS 'Note ou commentaire textuel optionnel';
COMMENT ON COLUMN feedbacks.created_at IS 'Date et heure de création du feedback';

-- =====================================================
-- Fonction pour mettre à jour automatiquement updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at sur users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Vues utiles (optionnel)
-- =====================================================

-- Vue pour les statistiques des humeurs par utilisateur
CREATE OR REPLACE VIEW user_mood_stats AS
SELECT 
    u.id AS user_id,
    u.email,
    u.display_name,
    COUNT(me.id) AS total_mood_events,
    AVG(me.mood_score) AS avg_mood_score,
    MAX(me.created_at) AS last_mood_event,
    COUNT(DISTINCT DATE(me.created_at)) AS active_days
FROM users u
LEFT JOIN mood_events me ON u.id = me.user_id
GROUP BY u.id, u.email, u.display_name;

COMMENT ON VIEW user_mood_stats IS 'Statistiques des humeurs par utilisateur';

-- =====================================================
-- Table: conversations
-- Description: Paires d'utilisateurs discutant ensemble
-- =====================================================
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_one_id INTEGER NOT NULL,
    user_two_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_conversations_user_one
        FOREIGN KEY (user_one_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_conversations_user_two
        FOREIGN KEY (user_two_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_conversations_distinct_users
        CHECK (user_one_id <> user_two_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_one ON conversations(user_one_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_two ON conversations(user_two_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

COMMENT ON TABLE conversations IS 'Conversations entre deux utilisateurs';

-- =====================================================
-- Table: messages
-- Description: Messages envoyés entre utilisateurs (rattachés à une conversation)
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_messages_recipient
        FOREIGN KEY (recipient_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);

COMMENT ON TABLE messages IS 'Messages échangés entre utilisateurs';

-- =====================================================
-- Table: notifications
-- Description: Notifications par utilisateur
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    icon VARCHAR(10),

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

COMMENT ON TABLE notifications IS 'Notifications liées aux activités de l''application';

-- =====================================================
-- Table: design_tokens
-- Description: Tokens de design (couleurs, typos, espacements, icônes)
-- =====================================================
CREATE TABLE IF NOT EXISTS design_tokens (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_design_tokens_updated_at ON design_tokens(updated_at DESC);

COMMENT ON TABLE design_tokens IS 'Tokens de design synchronisés depuis Figma';

-- =====================================================
-- Fin du script
-- =====================================================

