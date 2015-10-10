'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');

var debug = process.env.NODE_ENV !== 'production';

module.exports = {
  resolve: {},
  entry: {
    'video-player': './js/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: 'inertiaVideoPlayer'
  },
  alias: {},
  debug: debug,
  plugins: [
    new webpack.ProvidePlugin({
      'DMVAST': 'vast-client/vast-client',
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(debug ? 'development' : 'production')
      }
    }),
    new HtmlWebpackPlugin({
      template: 'html/player.html',
      minify: {
        collapseWhitespace: true,
        minifyJS: true
      },
      inject: false,
      filename: 'player.html'
    })
  ]
};
