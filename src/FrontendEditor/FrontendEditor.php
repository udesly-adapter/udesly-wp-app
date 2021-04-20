<?php

namespace Udesly\FrontendEditor;


defined( 'ABSPATH' ) || exit;

class FrontendEditor {

	static function isActive(): bool {
		return file_exists(trailingslashit(get_template_directory()) . '_data/frontend-editor/hash');
	}

	static function get_frontend_editor_data($template) {

		//delete_option("_udesly_fe_$template");
		//delete_option("_udesly_fe__global");
		$data = get_option("_udesly_fe_$template");

		if ($data) {
			return $data;
		}

		return FrontendEditor::import_frontend_editor_data($template, true);
	}

	static function delete_all_data() {
		global $wpdb;

// sorry about format I hate scrollbars in answers.
		$fe_options = $wpdb->get_results(
			"SELECT option_name AS name FROM $wpdb->options 
              WHERE option_name LIKE '_udesly_fe_%'"
		);

		foreach ($fe_options as $option) {
			delete_option($option->name);
		}

		delete_transient("_udesly_last_frontend_editor_data_hash");
	}

	static function get_frontend_editor_global_data() {
		return FrontendEditor::get_frontend_editor_data("_global");
	}

	static function import_frontend_editor_data($template, $force = false) {

	  $json = file_get_contents( trailingslashit(get_template_directory()) . '_data/frontend-editor/' . $template . '.json' );

	  if ($force) {
	  	self::update_frontend_editor_data_option($template, $json);
	  } else {
	  	self::upsert_frontend_editor_data($template, $json);
	  }

	  return $json;
	}

	static function import_all_data() {

		$files = glob(trailingslashit(get_template_directory()) . '_data/frontend-editor/*.json');

		foreach ($files as $file) {
			$template = str_replace(".json", "", basename($file));
			self::import_frontend_editor_data($template, false);
		}
		self::set_last_import();
	}

	static function is_stale_data(): bool {
		$hash = file_get_contents( trailingslashit(get_template_directory()) . '_data/frontend-editor/hash' );

		return $hash !== get_transient("_udesly_last_frontend_editor_data_hash");
	}

	static function set_last_import() {
		$hash = file_get_contents( trailingslashit(get_template_directory()) . '_data/frontend-editor/hash' );

		set_transient("_udesly_last_frontend_editor_data_hash", $hash);
	}

	static function upsert_frontend_editor_data($template, $new_data) {
		$old_data = get_option("_udesly_fe_$template");

		if (!$old_data) {
			self::update_frontend_editor_data_option($template, $new_data);
		} else {
			$old_data = is_string($old_data) ? json_decode($old_data) : $old_data;
			$new_data = is_string($new_data) ? json_decode($new_data) : $new_data;
			$update_data = [];
			foreach ($new_data as $key => $value) {
				$update_data[$key] = self::merge_objects($new_data->$key, $old_data->$key);
			}
			self::update_frontend_editor_data_option($template, $update_data);
		}

	}

	private static function merge_objects($obj1, $obj2)
	{
		$arr1 = (array) ($obj1 ? $obj1 : []);
		$arr2 = (array) ($obj2 ? $obj2 : []);
		$merged = array_intersect_key( $arr2, $arr1) + $arr1;
		return (object) $merged;
	}


	static function update_frontend_editor_data_option($template, $data) {
		if (!is_string($data)) {
			$data = json_encode($data);
		}
		update_option("_udesly_fe_$template", $data, false);

		do_action('cache_should_be_cleaned');
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
		add_action('wp_ajax_update_frontend_editor_data', [$this, 'update_frontend_editor_data']);
	}

	public function update_frontend_editor_data() {
		if (!wp_verify_nonce($_POST['security'], "udesly-fe-save") || !current_user_can('customize')) {
			wp_send_json_error("Sorry you are not allowed to save data!");
			die;
		}

		if (!isset($_POST['data']) || !isset($_POST['template'])) {
			wp_send_json_error("Sorry you are not allowed to save data!");
			die;
		}


		$data = json_decode(stripslashes($_POST['data']));

		if (!is_object($data)) {
			wp_send_json_error("Invalid data sent!");
			die;
		}


		$template = sanitize_text_field($_POST['template']);

		if ($template == "global") {
			$template = "_global";
		}

		self::update_frontend_editor_data_option($template, $data);

		wp_send_json_success("Saved!");
	}

	public function public_hooks() {

		include_once __DIR__ . '/functions.php';

		add_action( 'admin_bar_menu', function (\WP_Admin_Bar $admin_bar)  {
			if (is_admin()) {
				return;
			}
			global $wp;
			$path = home_url( $wp->request );

			$admin_bar->add_menu( array(
				'id'    => 'udesly-fe-menu',
				'parent' => null,
				'group'  => null,
				'title' => 'Open Frontend Editor', //you can use img tag with image link. it will show the image icon Instead of the title.
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

		add_action('template_include', function($template) {

			if (isset($_GET['edit']) && 'udesly-frontend-editor' === $_GET['edit']) {

				return __DIR__ . '/template.php';
			}
			return $template;
		});
	}
}