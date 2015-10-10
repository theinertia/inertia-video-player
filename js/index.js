/**
 * @fileoverview Entry point for video player
 */

var config = require('./config');
var videojs = require('video.js');

// Plugins use + modify on globals
require('vast-client/vast-client');
require('videojs-contrib-ads/dist/videojs.ads.global');
require('videojs-vast-plugin/videojs.vast');
require('videojs-vimeo');
require('videojs-youtube');

/**
 * @param {string} elementId
 * @param {Window=} win
 * @return {videojs}
 */
function buildPlayer(elementId, win) {
  var cfg = config.get(win || window);
  var vid = videojs(elementId, cfg.trim(config));

  vid.ready(function () {
    vid.ads();
    vid.vast({
      url: config.preroll
    });
  });

  return vid;
}

module.exports = buildPlayer;
