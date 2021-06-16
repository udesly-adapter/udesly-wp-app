<?php

defined( 'ABSPATH' ) || exit;

/**
 * Generic functions
 */

if ( ! function_exists( 'dd' ) ) {

	function dd( $obj ) {
		echo "<pre>";
		var_dump( $obj );
		echo "</pre>";
		die;
	}
}

if ( ! function_exists( 'bench' ) ) {

	function bench( $fn ) {
		$start_time = microtime(true);

		$fn();

		$end_time = microtime(true);

		dd($end_time - $start_time);
	}
}

if ( ! function_exists( 'debug_log' ) ) {

	function debug_log( $val ) {
		if (defined('WP_DEBUG') && true == WP_DEBUG && defined('WP_DEBUG_LOG') && true == WP_DEBUG_LOG)
		error_log( var_export( $val, true ) );
	}

}

add_filter( 'wp_die_handler', function( $handler ) {
	if (is_admin()) {
		return $handler;
	}
	if (defined('STYLESHEETPATH') && file_exists(get_stylesheet_directory() . '/wp-die.php')) {
		return "udesly_custom_die_handler";
	}
	return $handler;
}, 10 );

function udesly_custom_die_handler( $message, $title = "", $args = array()) {
	global $errors;
	$errors = is_wp_error($message) ? $message->get_error_messages() : [$message];

	require_once get_stylesheet_directory() . '/wp-die.php';
	die;
}

function udesly_get_content_template($content) {

	$template_name = 'template-parts/content/' . $content . ".php";

	$located = '';
	if ( file_exists( STYLESHEETPATH . '/' . $template_name ) ) {
		$located = STYLESHEETPATH . '/' . $template_name;

	} elseif ( file_exists( TEMPLATEPATH . '/' . $template_name ) ) {
		$located = TEMPLATEPATH . '/' . $template_name;

	} elseif ( file_exists( ABSPATH . WPINC . '/theme-compat/' . $template_name ) ) {
		$located = ABSPATH . WPINC . '/theme-compat/' . $template_name;

	}

	if ($located) {
		global $posts, $post, $wp_did_header, $wp_query, $wp_rewrite, $wpdb, $wp_version, $wp, $id, $comment, $user_ID;

		$args = apply_filters('udesly_get_content_template_args', []);

		extract($args);

		require_once $located;
	}

}

/**
 * return current page number
 *
 * @return int|mixed
 */
function udesly_get_current_page_number() {
	$paged = (get_query_var("paged")) ? get_query_var("paged") : 1;
	return $paged;
}

/**
*
* return max pages number
*
* @return int
*/
function udesly_get_max_pages_number(){
	global $wp_query;
	return $wp_query->max_num_pages;
}

/**
*
* return post number
*
* @return int
*/
function udesly_get_posts_number() {
	global $wp_query;
	return $wp_query->found_posts;
}