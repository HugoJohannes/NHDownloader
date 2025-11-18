/* globals __dirname */

const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
      background: './src/background/index.js',
      content: './src/content/index.js',
      popup: './src/popup/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              targets: 'defaults',
              presets: [['@babel/preset-env']],
            },
          },
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [autoprefixer],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  silenceDeprecations: [
                    'mixed-decls',
                    'color-functions',
                    'global-builtin',
                    'import',
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './src/manifest.json'),
            to: 'manifest.json',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: 'popup.html',
        template: path.resolve(__dirname, './src/popup/index.html'),
        excludeChunks: ['background', 'content'],
      }),
    ],
    resolve: {
      alias: {
        Background: path.resolve(__dirname, './src/background'),
        Content: path.resolve(__dirname, './src/content'),
        Popup: path.resolve(__dirname, './src/popup'),
        Utilties: path.resolve(__dirname, './src/utils'),
      },
    },
  };
};
