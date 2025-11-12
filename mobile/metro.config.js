const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
  isReactRefreshEnabled: true,
});

module.exports = config;

