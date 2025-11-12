# HumanLink - Design System & UI Documentation

## 🎨 Design System

### Logo HumanLink
- **Emoji** : 🤝 (Deux mains qui se serrent)
- **Signification** : Connexion humaine, solidarité, entraide
- **Couleurs** : Bleu primaire (#4A90E2)

### Palette de Couleurs

#### Couleurs Principales
- **Primary** : `#4A90E2` (Bleu confiance)
- **Secondary** : `#50C878` (Vert espoir)
- **Accent** : `#FF6B6B` (Rouge attention/care)

#### Couleurs de Fond
- **Background** : `#FAFBFC` (Gris très clair)
- **Card** : `#FFFFFF` (Blanc)
- **Border** : `#E5E7EB` (Gris clair)

#### Couleurs d'Émotions
- **Joy** : `#FFD93D` (Jaune)
- **Calm** : `#6BCB77` (Vert clair)
- **Energy** : `#FF6B6B` (Rouge)
- **Fatigue** : `#95A5A6` (Gris)
- **Stress** : `#E74C3C` (Rouge foncé)

### Typographie

- **H1** : 32px, Bold, Line-height 40px
- **H2** : 24px, Bold, Line-height 32px
- **H3** : 20px, Semi-bold, Line-height 28px
- **Body** : 16px, Regular, Line-height 24px
- **Caption** : 14px, Regular, Line-height 20px
- **Small** : 12px, Regular, Line-height 16px

### Espacements

- **xs** : 4px
- **sm** : 8px
- **md** : 16px
- **lg** : 24px
- **xl** : 32px
- **xxl** : 48px

### Rayons de Bordure

- **xs** : 4px
- **sm** : 8px
- **md** : 12px
- **lg** : 16px
- **xl** : 24px
- **pill** : 999px (boutons arrondis)

## 📱 Pages de l'Application

### 1. **LoginScreen** (Connexion)
- Logo HumanLink avec emoji 🤝
- Formulaire de connexion élégant
- Lien vers l'inscription
- Design moderne avec cartes élevées

### 2. **RegisterScreen** (Inscription)
- Formulaire d'inscription complet
- Validation en temps réel
- Redirection automatique vers vérification email
- Design cohérent avec LoginScreen

### 3. **VerifyEmailScreen** (Vérification Email)
- 6 inputs pour le code de vérification
- Auto-focus et navigation entre inputs
- Bouton "Renvoyer le code"
- Connexion automatique après vérification

### 4. **HomeScreen** (Page d'Accueil)
- Header personnalisé avec nom utilisateur
- Statistiques rapides (Connexions, Humeurs, Messages)
- Grille d'actions rapides (6 cartes)
- Section "À propos de HumanLink"
- Barre de navigation en bas

### 5. **MoodScreen** (Partage d'Humeur)
- Grande zone de texte pour décrire l'humeur
- Exemples d'humeurs avec emojis
- Compteur de caractères
- Design chaleureux et accueillant

### 6. **SuggestionsScreen** (Personnes Compatibles)
- Carte interactive avec marqueurs
- Liste des personnes compatibles
- Filtres (mode anonyme, rayon)
- Historique des contacts récents

### 7. **PlaceScreen** (Lieux Recommandés)
- Carte avec lieux suggérés
- Liste des lieux publics
- Bouton "Itinéraire" (ouvre l'app de navigation)
- Design géographique

### 8. **FeedbackScreen** (Retour sur Rencontre)
- Sélection de sentiment (Positive/Neutre/Négative)
- Zone de commentaire
- Design intuitif avec boutons visuels

### 9. **ProfileScreen** (Profil Utilisateur)
- Photo de profil avec avatar
- Informations personnelles éditables
- Paramètres (Notifications, Confidentialité, Langue)
- Aide et support

### 10. **ChatScreen** (Messagerie)
- Liste des conversations
- Badge de messages non lus
- Vue de conversation avec bulles de messages
- Input de message en bas

### 11. **FeedScreen** (Actualités)
- Fil d'actualités avec publications
- Interactions (J'aime, Commenter, Partager)
- Badge d'humeur sur les posts
- Pull-to-refresh

### 12. **NotificationsScreen** (Notifications)
- Liste des notifications
- Badge de notifications non lues
- Différents types (Message, Like, Comment, Match, Mission)
- Marquer comme lu au clic

## 🧩 Composants Réutilisables

### Button
- Variantes : primary, secondary, outline, ghost
- Tailles : small, medium, large
- États : loading, disabled
- Support d'icônes

### Input
- Label et helper text
- Icônes gauche/droite
- Gestion d'erreurs
- Validation visuelle

### Card
- Élévation optionnelle
- Padding configurable
- Bordure et ombre

### Logo
- Tailles : small, medium, large
- Option pour afficher/masquer l'emoji

### BottomTabNavigator
- Navigation entre les 5 pages principales
- Indicateur de page active
- Icônes emoji pour chaque onglet

## 🎯 Principes de Design

1. **Accessibilité** : Contrastes élevés, tailles de texte lisibles
2. **Cohérence** : Même design system partout
3. **Chaleur** : Couleurs chaleureuses, emojis appropriés
4. **Simplicité** : Interface claire et intuitive
5. **Solidarité** : Design qui reflète les valeurs de l'app

## 📐 Guidelines

- Utiliser les composants réutilisables (Button, Input, Card)
- Respecter les espacements du design system
- Utiliser les couleurs définies dans `theme.ts`
- Maintenir la cohérence visuelle entre les pages
- Tester sur différentes tailles d'écran

