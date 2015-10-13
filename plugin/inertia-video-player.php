<?php
/**
 * Plugin Name: The Inertia Video Player
 * Plugin URI: http://www.github.com/theinertia/video-player
 * Description: Basic shortcode handling for the inertia video player
 * Author: Ross Pfahler
 * Version: 1.0.0
 * Author URI: www.theinertia.com
 */

define('INERTIA_VIDEO_PLAYER_VERSION', '1.0.0');

class InertiaVideoPlayer {
  var $player_location = '//d1mtg7ztp3oax8.cloudfront.net/libs/video-player/player.html';

  function __construct() {
    $this->register_shortcodes();
  }

  function register_shortcodes() {
    add_shortcode( 'videoplayer', array(&$this, 'render_video_player') );
  }

  function render_video_player( $atts ) {
    extract(shortcode_atts(array(
      'src' => '',
      'preroll' => null
    ), $atts ));

    $config = urlencode(json_encode(array( 'src' => $src, 'preroll' => $preroll )));
    $src = sprintf( '%s?config=%s', $this->player_location, $config );
    $player = '<iframe allowfullscreen frameborder="0" src="%s" width="640" height="360"></iframe>';
    return sprintf( $player, $src );
  }
}

$inertiaVideoPlayer = new InertiaVideoPlayer();
