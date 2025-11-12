const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Configure entry point for web
  config.entry = path.resolve(__dirname, 'index.web.js');
  
  // Configure output
  config.output = config.output || {};
  config.output.path = path.resolve(__dirname, 'dist');
  config.output.filename = 'bundle.js';
  config.output.publicPath = '/';
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native$': 'react-native-web',
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
    'react-native/Libraries': 'react-native-web/dist',
    // Mock react-native-maps for web
    'react-native-maps': path.resolve(__dirname, 'src/mocks/react-native-maps.js'),
  };
  
  // Force replacement of react-native-maps with mock
  config.plugins = config.plugins || [];
  
  // Ignore problematic native imports
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /react-native\/Libraries\/Utilities\/codegenNativeCommands/,
    })
  );
  
  // Replace react-native-maps at the earliest possible stage
  // Use a more specific pattern that matches the actual import
  const mockPath = path.resolve(__dirname, 'src/mocks/react-native-maps.js');
  
  config.plugins.unshift(
    new webpack.NormalModuleReplacementPlugin(
      /^react-native-maps$/,
      mockPath
    )
  );
  
  config.plugins.unshift(
    new webpack.NormalModuleReplacementPlugin(
      /react-native-maps\/lib/,
      mockPath
    )
  );
  
  config.plugins.unshift(
    new webpack.NormalModuleReplacementPlugin(
      /node_modules[\\/]react-native-maps/,
      mockPath
    )
  );
  
  // Configure webpack to handle CommonJS modules properly
  config.output = config.output || {};
  config.output.globalObject = 'this';
  
  // Fix for "exports is not defined" error in CommonJS modules
  // Add a rule to inject exports into @react-navigation modules
  config.module = config.module || {};
  config.module.rules = config.module.rules || [];
  
  config.module.rules.push({
    test: /node_modules\/@react-navigation\/.*\.js$/,
    use: [
      {
        loader: path.resolve(__dirname, 'webpack-exports-loader.js'),
      }
    ],
    enforce: 'pre' // Run before other loaders
  });
  
  // Add HTML plugin for webpack-dev-server
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body',
    })
  );
  
  // Configure dev server
  config.devServer = {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  };
  
  return config;
};


