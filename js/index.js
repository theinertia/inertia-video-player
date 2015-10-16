/**
 * @fileoverview Entry point for video player
 */

var config = require('./config');
var isMobile = require('ismobilejs').any;
var videojs = window.videojs = require('video.js');

// Plugins use + modify on globals
require('videojs-vimeo');
require('videojs-youtube');
require('vast-client/vast-client');
require('imports?define=>false!videojs-contrib-ads/src/videojs.ads');
require('videojs-ima');

/**
 * @param {Element} el
 * @param {Object} cfg
 * @return {videojs}
 */
function setupMobilePlayer(el, cfg) {
  var player = videojs(el.id, cfg);

  if (cfg.preroll && cfg.techOrder[0] === 'html5') {
    player.ima({
      debug: true,
      id: el.id,
      adTagUrl: cfg.preroll,
      nativeControlsForTouch: false
    });
    player.ima.initializeAdDisplayContainer();
    player.ima.requestAds();
  }
  return player;
}

/**
 * @param {Element} el
 * @param {Object} cfg
 * @return {videojs}
 */
function setupDesktopPlayer(el, cfg) {
  var player = videojs(el.id, cfg);

  if (cfg.preroll) {
    player.ima({
      id: el.id,
      adTagUrl: cfg.preroll
    });
  }

  var onClick = function () {
    if (cfg.preroll) {
      player.ima.initializeAdDisplayContainer();
      player.ima.requestAds();
    }
  };

  player.ready(function () {
    player.one('click', onClick);
  });

  return player;
}


/**
 * @param {string} elementId
 * @param {Window=} win
 */
function buildPlayer(elementId, win) {
  var container = document.getElementById(elementId);

  var cfg = config.get(win || window);
  cfg = config.trim(cfg);

  var setUp = function () {
    var vid = document.createElement('video');
    vid.id = 'player';
    vid.setAttribute('preload', 'auto');
    vid.setAttribute('controls', true);
    vid.className = 'video-js vjs-default-skin';
    vid.setAttribute('width', '100%');
    vid.setAttribute('height', '100%');
    document.body.appendChild(vid);
    document.body.removeChild(container);

    if (isMobile) {
      setupMobilePlayer(vid, cfg);
    } else {
      setupDesktopPlayer(vid, cfg);
    }
  }

  if (isMobile) {
    container.className = container.className + ' video-js-mobile';
  }

  setUp();
}

module.exports = buildPlayer;
