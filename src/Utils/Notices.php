<?php

namespace Udesly\Utils;

final class Notices {

	static function get_notice_html($args) {

		$args = wp_parse_args($args, [
			'type' => 'info',
			'message' => '',
			'dismissible' => true
		]);

		$class = "udesly-notice notice notice-". $args['type'];
		if ($args['dismissible']) {
			$class.= " is-dismissible";
		}

		return sprintf( '<div class="%1$s"><p><strong>Udesly </strong>%2$s</p></div>', esc_attr( $class ), esc_html( $args['message'] ) );
	}

	static function enqueue_notice(array $args, string $id = null) {

		$new_notices = self::get_pending_notices();
		if ($id) {
			$new_notices[$id] = $args;
		} else {
			array_push($new_notices, $args);
		}

		set_transient('_udesly_pending_notices', $new_notices);
	}


	static function get_pending_notices() {
		$notices = get_transient('_udesly_pending_notices');
		if (!$notices) {
			return [];
		}
		return $notices;
	}

	static function clear_notices() {
		if (get_transient('_udesly_pending_notices')) {
			delete_transient('_udesly_pending_notices');
		}
	}

	static function show_notices() {
		$notices = self::get_pending_notices();

		foreach ($notices as $key => $notice) {
			echo self::get_notice_html($notice);
		}
		self::clear_notices();
	}

}