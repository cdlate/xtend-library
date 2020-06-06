const path = require('path')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
require('./build/css.js')
require('./build/js.js')

module.exports = {
  mode: 'production',
  performance: { hints: false },
  context: path.resolve(__dirname, ''),
  entry: {
    'dist/xtend-core': ['./dist/xtend-core.js', './dist/xtend-core.css'],
    'dist/xtend-core-extensions': ['./dist/xtend-core-extensions.js', './dist/xtend-core-extensions.css'],
    'dist/xtend-core-extensions-addons': ['./dist/xtend-core-extensions-addons.js', './dist/xtend-core-extensions-addons.css'],
  },
  output: {
    filename: '[name].min.js',
    path: __dirname,
  },
  resolve: {
    alias: {
      // resolve xtend-library
      'xtend-library': path.resolve(__dirname, './'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 2,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
    ],
  },
  devtool: 'source-map',
}
