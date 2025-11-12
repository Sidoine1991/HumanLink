-- =====================================================
-- Données d'Exemple
-- HumanLink Database
-- =====================================================
-- 
-- Ce script insère des données d'exemple pour tester l'application
-- ⚠️ Les mots de passe sont hashés avec bcrypt (coût 12)
-- Mot de passe de test pour tous les utilisateurs: "password123"
-- =====================================================

-- Nettoyer les données existantes (optionnel)
-- TRUNCATE TABLE feedbacks, mood_events, users RESTART IDENTITY CASCADE;

-- =====================================================
-- Utilisateurs de test
-- =====================================================
-- Note: Les mots de passe hashés correspondent à "password123"
-- Pour générer un nouveau hash: python -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('password123'))"

INSERT INTO users (email, hashed_password, display_name, bio) VALUES
    ('alice@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqZ5Z5Zq', 'Alice', 'Enthousiaste des balades solidaires à Paris.'),
    ('bob@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqZ5Z5Zq', 'Bob', 'Toujours partant pour un café et une bonne discussion.'),
    ('charlie@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJqZ5Z5Zq', 'Charlie', 'Passionné de bien-être et de soutien aux autres.')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- Événements d'humeur de test
-- =====================================================
-- Note: Les coordonnées sont pour Paris, France (48.8566, 2.3522)

INSERT INTO mood_events (user_id, text, mood_label, mood_score, lat, lng, created_at) VALUES
    -- Alice
    (1, 'Super journée au parc!', 'joy', 0.9, 48.8566, 2.3522, NOW() - INTERVAL '2 hours'),
    (1, 'Un peu fatigué après le travail', 'fatigue', 0.3, 48.8606, 2.3376, NOW() - INTERVAL '1 day'),
    (1, 'Calme et détendu ce matin', 'calm', 0.8, 48.8526, 2.3442, NOW() - INTERVAL '2 days'),
    
    -- Bob
    (2, 'Beaucoup d''énergie aujourd''hui!', 'energy', 0.95, 48.8566, 2.3522, NOW() - INTERVAL '30 minutes'),
    (2, 'Stressé par la deadline', 'stress', 0.2, 48.8646, 2.3276, NOW() - INTERVAL '3 hours'),
    (2, 'Content de voir mes amis', 'joy', 0.85, 48.8486, 2.3562, NOW() - INTERVAL '1 day'),
    
    -- Charlie
    (3, 'Journée productive', 'energy', 0.7, 48.8566, 2.3522, NOW() - INTERVAL '1 hour'),
    (3, 'Besoin de repos', 'fatigue', 0.4, 48.8606, 2.3376, NOW() - INTERVAL '4 hours')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Feedbacks de test
-- =====================================================

INSERT INTO feedbacks (user_id, mood_event_id, sentiment, note, created_at) VALUES
    (1, 1, 'positive', 'Le parc était vraiment agréable!', NOW() - INTERVAL '1 hour'),
    (1, 2, 'neutral', 'Besoin de mieux dormir', NOW() - INTERVAL '23 hours'),
    (2, 4, 'positive', 'Super journée!', NOW() - INTERVAL '20 minutes'),
    (2, 5, 'negative', 'Trop de pression au travail', NOW() - INTERVAL '2 hours'),
    (3, 7, 'positive', 'Bien organisé aujourd''hui', NOW() - INTERVAL '45 minutes')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Vérification des données insérées
-- =====================================================

SELECT 
    'Users' AS table_name, 
    COUNT(*) AS row_count 
FROM users
UNION ALL
SELECT 
    'Mood Events', 
    COUNT(*) 
FROM mood_events
UNION ALL
SELECT 
    'Feedbacks', 
    COUNT(*) 
FROM feedbacks;

-- Afficher un résumé
SELECT 
    u.display_name,
    COUNT(me.id) AS mood_count,
    AVG(me.mood_score) AS avg_score
FROM users u
LEFT JOIN mood_events me ON u.id = me.user_id
GROUP BY u.id, u.display_name
ORDER BY u.display_name;

