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
	if (file_exists(get_stylesheet_directory() . '/wp-die.php')) {
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

function udesly_compare_dates($date, $days, $when) {

	try {
		$start_date = date_create($date);
		$compare_date = date_create();
		if ($when == "past") {
			$compare_date->sub(new DateInterval( "P$days"."D"));
		} else {
			$compare_date->add(new DateInterval( "P$days"."D"));
		}
		return $start_date->getTimestamp() - $compare_date->getTimestamp();
	} catch (Exception $e) {
		debug_log($e);
		return 1;
	}
}