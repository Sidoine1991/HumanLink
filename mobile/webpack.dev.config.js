const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'index.web.js'),
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    globalObject: 'this',
  },
  
  resolve: {
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
      'react-native/Libraries': 'react-native-web/dist',
      // Mock react-native-maps for web
      'react-native-maps': path.resolve(__dirname, 'src/mocks/react-native-maps.js'),
      // Mock react-native-reanimated for web to avoid worklets warnings
      'react-native-reanimated': path.resolve(__dirname, 'src/mocks/react-native-reanimated.js'),
    },
    // Fix for ESM modules that don't specify file extensions
    fullySpecified: false,
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!(@react-navigation|react-native|@react-native|expo|@react-native-async-storage))/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            // Use the existing babel.config.js
            configFile: path.resolve(__dirname, 'babel.config.js'),
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /node_modules\/@react-navigation\/.*\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, 'webpack-exports-loader.js'),
          }
        ],
        enforce: 'pre',
        resolve: {
          fullySpecified: false,
        },
      },
      // Handle @react-native-async-storage ESM modules
      {
        test: /node_modules\/@react-native-async-storage\/.*\.js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(true),
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /react-native\/Libraries\/Utilities\/codegenNativeCommands/,
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^react-native-maps$/,
      path.resolve(__dirname, 'src/mocks/react-native-maps.js')
    ),
    // Fix for @react-native-async-storage relative imports without extensions
    {
      apply: (compiler) => {
        compiler.hooks.normalModuleFactory.tap('AsyncStorageFixPlugin', (nmf) => {
          nmf.hooks.beforeResolve.tap('AsyncStorageFixPlugin', (data) => {
            if (data && 
                data.request && 
                (data.request === './AsyncStorage' || data.request === './hooks') &&
                data.context &&
                data.context.includes('@react-native-async-storage/async-storage/lib/module')) {
              data.request = data.request + '.js';
            }
          });
        });
      },
    },
  ],
  
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  
  devtool: 'eval-source-map',
  
  // Ignore known warnings from dependencies
  ignoreWarnings: [
    // Ignore warning from react-native-worklets (used by react-native-reanimated)
    // This is a known issue with dynamic requires in worklets
    {
      module: /react-native-worklets/,
      message: /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
    },
  ],
};

