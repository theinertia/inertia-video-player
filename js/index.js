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
  return videojs(el.id, cfg);
}

/**
 * @param {Element} el
 * @param {Object} cfg
 * @return {videojs}
 */
function setupDesktopPlayer(el, cfg) {
  var player = videojs(el.id);
  var adRun = false;

  if (cfg.preroll) {
    player.ima({
      id: el.id,
      adTagUrl: cfg.preroll
    });
  }

  var onClick = function () {
    if (cfg.preroll && !adRun) {
      adRun = true;
      player.ima.initializeAdDisplayContainer();
      player.ima.requestAds();
      player.play();
    }
  };

  var onPlay = function () {
    if (cfg.preroll && !adRun) {
      adRun = true;
      player.pause();
      player.ima.initializeAdDisplayContainer();
      player.ima.requestAds();
      player.play();
    }
  };

  var container = document.getElementById('player');

  var onContainerClick = function (event) {
    event.preventDefault();
    onClick();
    container.removeEventListener('click', onContainerClick);
  };

  player.one('click', onClick);
  player.on('play', onPlay);
  container.addEventListener('click', onContainerClick, true);
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
