/**
 * @fileoverview Entry point for video player
 */

var config = require('./config');
var isMobile = require('ismobilejs').any;
//var WebVTT = window.WebVTT = require('vtt.js').WebVTT;
var videojs = window.videojs = require('video.js');

// Plugins use + modify on globals
require('vast-client/vast-client');
require('videojs-vast-plugin/lib/videojs-contrib-ads/videojs.ads');
require('videojs-vast-plugin/videojs.vast.js');
require('videojs-vimeo');
require('videojs-youtube');

/**
 * @param {Element} el
 * @param {Object} cfg
 * @return {videojs}
 */
function setupMobilePlayer(el, cfg) {
  var player = videojs(el.id);

  // If non-yt / vimeo video, then mobile preroll should work
  if (cfg.preroll && cfg.src) {
    player.ads({
      prerollTimeout: 1000,
      debug: true
    });

    player.vast({
      url: cfg.preroll,
      skip: -1
    });
  }

  ['adtimeout', 'adserror'].forEach(function (e) {
    player.on(e, function () {
      this.play();
    });
  });

  return player;
}

/**
 * @param {Element} el
 * @param {Object} cfg
 * @return {videojs}
 */
function setupDesktopPlayer(el, cfg) {
  var player = videojs(el.id);

  if (cfg.preroll) {
    player.ads({
      prerollTimeout: 1000,
      debug: true
    });

    player.vast({
      url: cfg.preroll,
      skip: -1
    });
  }

  ['adtimeout', 'adserror'].forEach(function (e) {
    player.on(e, function () {
      this.play();
    });
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
    vid.setAttribute('data-setup', JSON.stringify(cfg));

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
