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

		error_log( var_export( $val, true ) );
	}

}