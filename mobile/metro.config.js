const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuration pour gérer react-native-maps sur web
// Utiliser un resolver personnalisé pour utiliser le mock sur web
const mockPath = path.resolve(__dirname, 'src/mocks/react-native-maps.js');

// Sauvegarder le resolver original
const upstream = config.resolver.resolveRequest;

// Override du resolver pour gérer react-native-maps sur web uniquement
// Pour Android/iOS, utiliser le resolver par défaut sans modification
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Gérer react-native-maps sur web avec un mock
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      type: 'sourceFile',
      filePath: mockPath,
    };
  }

  // Pour Android/iOS et tous les autres modules, utiliser le resolver par défaut
  // IMPORTANT: Ne jamais retourner undefined - toujours appeler upstream
  if (upstream) {
    return upstream(context, moduleName, platform);
  }

  // Si pas de upstream (ne devrait jamais arriver), laisser Metro utiliser son resolver par défaut
  // En retournant undefined, on laisse Metro gérer avec son resolver par défaut
  return undefined;
};

module.exports = config;

