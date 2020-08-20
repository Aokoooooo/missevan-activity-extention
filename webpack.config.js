const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

// eslint-disable-next-line
function configFunc(env, argv) {
  const isDevMode = env.NODE_ENV === 'development'
  const config = {
    devtool: isDevMode ? 'eval-source-map' : false,
    context: path.resolve(__dirname, './src'),
    entry: {
      background: './background/index.js',
      devtools: './devtools/index.js',
      devPannel: './devPannel/index.js',
      contentScripts: './contentScripts/index.js',
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: './',
      filename: '[name].js',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          exclude: /contentScripts/,
          sourceMap: true,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.sass$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              // eslint-disable-next-line
              options: { implementation: require('sass') },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
            esModule: false,
          },
        },
      ],
    },
    resolve: {
      alias: {},
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'assets', to: 'assets' },
          { from: 'manifest.json', to: 'manifest.json', flatten: true },
        ],
      }),
      new HtmlWebpackPlugin({
        title: 'Devtools',
        template: './index.html',
        filename: 'devtools.html',
        chunks: ['devtools'],
      }),
      new HtmlWebpackPlugin({
        title: 'devPannel',
        template: './index.html',
        filename: 'devPannel.html',
        chunks: ['devPannel'],
      }),
    ],
  }

  /**
   * Adjust rendererConfig for production settings
   */
  if (isDevMode) {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new ExtensionReloader({
        contentScript: 'contentScripts',
        background: 'background',
        extensionPage: 'devtools',
      })
    )
  } else {
    config.plugins.push(
      new ScriptExtHtmlWebpackPlugin({
        async: [/runtime/],
        defaultAttribute: 'defer',
      })
    )
  }
  return config
}

module.exports = configFunc
