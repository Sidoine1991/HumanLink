# HumanLink - Guide de Design

## 🎨 Vision du Design

HumanLink utilise un design **chaleureux, solidaire et accessible** qui reflète sa mission : connecter les personnes et lutter contre la solitude.

## 🎯 Style Visuel

### Caractéristiques
- **Minimaliste & Clair** : Interface épurée, facile à comprendre
- **Coloré & Chaleureux** : Couleurs vives mais apaisantes
- **Moderne** : Design contemporain avec ombres et élévations
- **Accessible** : Contrastes élevés, textes lisibles

### Logo
- **Emoji** : 🤝 (Deux mains qui se serrent)
- **Couleur** : Bleu primaire (#4A90E2)
- **Signification** : Connexion, solidarité, entraide

## 📱 Toutes les Pages

### Pages d'Authentification
1. **LoginScreen** - Connexion avec logo et formulaire élégant
2. **RegisterScreen** - Inscription avec validation
3. **VerifyEmailScreen** - Vérification avec code à 6 chiffres

### Pages Principales (avec Bottom Tab Navigator)
4. **HomeScreen** - Page d'accueil avec statistiques et actions rapides
5. **FeedScreen** - Actualités et publications de la communauté
6. **ChatScreen** - Messagerie avec liste de conversations
7. **NotificationsScreen** - Toutes les notifications
8. **ProfileScreen** - Profil utilisateur et paramètres

### Pages Fonctionnelles
9. **MoodScreen** - Partage d'humeur
10. **SuggestionsScreen** - Personnes compatibles avec carte
11. **PlaceScreen** - Lieux recommandés
12. **FeedbackScreen** - Retour sur les rencontres

## 🎨 Éléments de Design

### Couleurs Principales
- **Bleu** (#4A90E2) : Confiance, connexion
- **Vert** (#50C878) : Espoir, croissance
- **Rouge** (#FF6B6B) : Attention, care

### Composants
- **Cards** : Élévation avec ombres douces
- **Buttons** : Arrondis, avec états de chargement
- **Inputs** : Bordures claires, validation visuelle
- **Icons** : Emojis pour un aspect chaleureux

### Navigation
- **Bottom Tab Navigator** : 5 onglets principaux
- **Stack Navigation** : Navigation entre écrans fonctionnels
- **Indicateurs visuels** : Badges, points non lus

## 🚀 Utilisation

Tous les composants et styles sont centralisés dans :
- `src/ui/theme.ts` - Design system complet
- `src/components/` - Composants réutilisables
- `src/screens/` - Toutes les pages de l'application

Le design est cohérent, moderne et prêt pour la production !

