<?php

namespace Udesly\Extensions\WooCommerce;


defined( 'ABSPATH' ) || exit;


class WebflowCommerce {

	protected static $_instance = null;

	public static function instance()
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	private function include_deps() {
		include_once UDESLY_PLUGIN_DIR_PATH . "/misc/wc.php";
	}

	public function run() {
		if (is_admin()) {
			$this->admin_hooks();
		}
		$this->public_hooks();
	}

	private function admin_hooks() {

	}

	public function include_global_variant(&$post, &$query) {
		if ($post->post_type !== "product") {
			return;
		}
		global $variant;

		$variant = udesly_get_wc_product_default_variant();
	}

	private function public_hooks() {
		$this->include_deps();
		add_action('the_post', [$this, "include_global_variant"], 99, 2);
	}
}