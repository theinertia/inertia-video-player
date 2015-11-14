/**
 * @fileoverview Configuration parsing options
 */

var forEach = require('mout/array/forEach');
var getParam = require('mout/querystring/getParam');

/**
 * @param {Window} win
 */
function getConfig(win) {
  var cfg = getParam(win.location.href, 'config');

  if (!cfg) {
    throw new Error('Cannot find `config` param in url');
  }

  try {
    cfg = JSON.parse(cfg);
  } catch (e) {
    throw new Error('Cannot parse `config` from url');
  }

  return cfg;
}

function trimConfig(rawCfg) {
  var cfg = {};

  if (!('src' in rawCfg)) {
    throw new Error('Must have src in config');
  }

  var techOrders = ['vimeo', 'youtube'];

  if (typeof rawCfg.src === 'string') {
    forEach(techOrders, function (order) {
      if (new RegExp(order).test(rawCfg.src)) {
        cfg.techOrder = [order];
        cfg.sources = [{type: 'video/' + order, src: rawCfg.src}];
      }
    });
  }

  cfg.techOrder.push('html5');
  cfg.autoplay = rawCfg.autoplay || false;
  cfg.ytcontrols = 2;

  if (!cfg.sources) {
    cfg.src = rawCfg.src;
  }

  cfg.preroll = rawCfg.preroll || 'https://pubads.g.doubleclick.net/gampad/ads?sz=400x300|640x480&iu=/5127455/pre_roll_vidroll_unit&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=' + document.location.href + '&description_url=[description_url]&correlator=' + Date.now();
  return cfg;
}

module.exports = {
  trim: trimConfig,
  get: getConfig
};
