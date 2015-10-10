/**
 * @fileoverview Dev server
 */

var express = require('express');
var lessMiddleware = require('less-middleware');
var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackMiddleware = require('webpack-dev-middleware');

var server = express();

server.use(lessMiddleware('/less', {
  pathRoot: __dirname,
  dest: '/dist',
  force: true,
  render: {
    paths: [__dirname]
  }
}));

server.use(webpackMiddleware(webpack(webpackConfig), {
  stats: {
    colors: true
  },
  publicPath: '/dist'
}));

server.use('/dist/font', express.static(path.join(__dirname, 'node_modules', 'video.js', 'dist', 'video-js', 'font')));
server.use('/', express.static(path.join(__dirname)));
server.listen(6007);
