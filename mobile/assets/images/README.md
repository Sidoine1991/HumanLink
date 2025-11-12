# 📸 Images de l'Application HumanLink

Ce dossier contient les images utilisées dans l'application mobile.

## Structure

```
assets/images/
├── home/          # Images pour la page d'accueil
├── chat/          # Images pour la messagerie
├── mood/          # Images pour partager l'humeur
├── profile/       # Images pour le profil
└── common/        # Images communes (logos, icônes, etc.)
```

## Images disponibles

### Page d'Accueil (Home)
- `acceuil.avif` - Image principale de la page d'accueil (format AVIF)
- `acceuil.jpeg` - Image principale de la page d'accueil (format JPEG)

### Messagerie (Chat)
- `Message.jpeg` - Image pour la page de messagerie
- `Message1.jpeg` - Variante 1
- `Message2.jpeg` - Variante 2
- `Message3.jpeg` - Variante 3

## Source

Les images originales sont stockées dans `D:\Dev\HumanLink\media\image\`

## Utilisation

Pour utiliser ces images dans React Native:

```tsx
import { Image } from 'react-native';

// Image locale
<Image source={require('../assets/images/home/acceuil.jpeg')} />

// Ou avec require dynamique
const imageSource = require('../assets/images/chat/Message.jpeg');
```

## Notes

- Les images AVIF sont plus légères mais nécessitent un support navigateur/app
- Les images JPEG sont plus compatibles universellement
- Optimisez les images avant de les ajouter (compression, redimensionnement)

