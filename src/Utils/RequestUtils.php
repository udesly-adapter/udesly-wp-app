<?php

namespace Udesly\Utils;

defined( 'ABSPATH' ) || exit;

final class RequestUtils {
	/**
	 * What type of request is this?
	 *
	 * @param string $type admin, ajax, cron or frontend.
	 *
	 * @return bool
	 */
	static function is( string $type ): bool {
		switch ( $type ) {
			case 'ajax':
				return defined( 'DOING_AJAX' );
			case 'cron':
				return defined( 'DOING_CRON' );
			case 'admin':
				return is_admin();
			case 'frontend':
				return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' ) && ! self::is_rest_api_request();
		}

		return false;
	}

	static function get_type(): string {
		if ( defined( 'DOING_AJAX' ) ) {
			return is_admin() ? "ajax-admin":"ajax";
		}
		if ( defined( 'DOING_CRON' ) ) {
			return 'cron';
		}
		if ( is_admin() ) {
			return 'admin';
		}
		if ( ! self::is_rest_api_request() ) {
			return 'frontend';
		}

		return 'rest';
	}

	static function is_rest_api_request() {
		if ( empty( $_SERVER['REQUEST_URI'] ) ) {
			return false;
		}

		$rest_prefix = trailingslashit( rest_get_url_prefix() );

		return ( false !== strpos( $_SERVER['REQUEST_URI'], $rest_prefix ) );

	}
}