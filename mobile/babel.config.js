module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated/plugin est ajouté automatiquement par babel-preset-expo
      // maintenant que react-native-worklets est installé, cela devrait fonctionner correctement
    ],
  };
};


