<?php

namespace Udesly\FrontendEditor;

use Udesly\Utils\FSUtils;

defined( 'ABSPATH' ) || exit;

class FrontendEditor {

	static function isActive(): bool {
		return true;
	}

	static function get_frontend_editor_data($template) {
		delete_option("_udesly_fe_$template");
		delete_option("_udesly_fe__global");
		$data = get_option("_udesly_fe_$template");
		if ($data) {
			return $data;
		}

		return FrontendEditor::import_frontend_editor_data($template);
	}

	static function get_frontend_editor_global_data() {
		return FrontendEditor::get_frontend_editor_data("_global");
	}

	static function import_frontend_editor_data($template) {

	  $json =	file_get_contents( trailingslashit(get_template_directory()) . '_data/frontend-editor/' . $template . '.json' );

	  update_option("_udesly_fe_$template", $json, false);
	  return $json;
	}

	protected static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	public function run() {
		if (is_admin()) {
			$this->admin_hooks();
		}
		$this->public_hooks();
	}

	public function admin_hooks() {

	}

	public function public_hooks() {

		include_once __DIR__ . '/functions.php';

		add_action( 'admin_bar_menu', function (\WP_Admin_Bar $admin_bar)  {

			global $wp;
			$path = home_url( $wp->request );

			$admin_bar->add_menu( array(
				'id'    => 'udesly-menu',
				'parent' => null,
				'group'  => null,
				'title' => 'Frontend Editor', //you can use img tag with image link. it will show the image icon Instead of the title.
				'href' => esc_url( add_query_arg(["edit" => "udesly-frontend-editor"], $path)),
				'icon' => "edit",
				'meta' => [
					'title' => __( 'Udesly', 'textdomain' ), //This title will show on hover
				]
			) );
		}, 500 );

		add_filter('show_admin_bar', function ($show) {
			if(isset($_GET['udesly_action']) && 'frontend-editor' === $_GET['udesly_action']) {

				return false;
			} else {
				return $show;
			}
		}, 100);

		add_action('wp_enqueue_scripts', function () {
			if(isset($_GET['udesly_action']) && 'frontend-editor' === $_GET['udesly_action']) {
				wp_enqueue_script("udesly-iframe-frontend-editor", UDESLY_PLUGIN_URI . 'assets/frontend/js/udesly-iframe-frontend-editor.js', [], UDESLY_PLUGIN_VERSION);
			}
		});

		add_action('template_include', function($template) {

			if (isset($_GET['edit']) && 'udesly-frontend-editor' === $_GET['edit']) {

				return __DIR__ . '/template.php';
			}
			return $template;
		});
	}
}