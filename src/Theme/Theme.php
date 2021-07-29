<?php

namespace Udesly\Theme;

use Udesly\FrontendEditor\FrontendEditor;
use Udesly\Utils\DBUtils;
use Udesly\Utils\FSUtils;
use Udesly\Utils\Notices;
use Udesly\Utils\PathUtils;

defined('ABSPATH') || exit;

final class Theme
{

	private $data_path;

	protected static $_instance = null;
	/**
	 * @var false|mixed|string
	 */
	private $hash_path;

	public static function instance()
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	private function __construct()
	{
		// Get template directory always returns the parent theme folder even if child theme is active;
		$this->data_path = PathUtils::join(get_template_directory(), "_data", "data.json");
		$this->hash_path = PathUtils::join(get_template_directory(), "_data", "hash");

		//$this->config_path = PathUtils::join( get_template_directory(), "_data", "config.json" );
	}

	public function is_valid(): bool
	{
		return file_exists($this->data_path);
	}

	private function is_stale_data(): bool
	{
		$mtime = FSUtils::mtime($this->data_path);

		if ($mtime > $this->get_last_import_time()) {
			if ($this->get_last_filesize() !== filesize($this->data_path)) {
				return true;
			}
			if ($this->get_last_file_hash() !== FSUtils::get_content($this->hash_path)) {
				return true;
			}
		}

		return false;
	}

	private function _import_posts(array $posts, string $type)
	{

		switch ($type) {
			case "users":
				foreach ($posts as $post) {
					DBUtils::create_user_if_necessary($post);
				}
				break;
			case "terms":
				foreach ($posts as $post) {
					DBUtils::create_term_if_necessary($post);
				}
				break;
			case "posts":
				foreach ($posts as $post) {
					DBUtils::create_post_if_necessary($post);
				}
				break;
		}
	}

	public function import_data($type, $start_index = 0, $chunks = 5)
	{


		if ($type !== "frontend-editor") {

			$lock_key = "udesly_lock" . $type . $start_index . $chunks;

			if (get_transient($lock_key)) {
				return new \WP_Error('stop');
			}

			set_transient($lock_key, "true");

			$data = FSUtils::get_json_content($this->data_path);


			switch ($type) {
				case "users":
					$posts = $data->users;
					break;
				case "terms":
					$posts = $data->terms;
					break;
				case "posts":
					$posts = $data->posts;
					break;
			}

			$post_chunks = array_chunk($posts, $chunks);

			if (isset($post_chunks[$start_index])) {
				$this->_import_posts($post_chunks[$start_index], $type);
				if (isset($post_chunks[$start_index + 1])) {
					$this->set_background_import_status("pending", $start_index + 1, $type, true);
				} else {
					$this->set_background_import_status("complete", 0, $type, false);
				}
			} else {
				$this->set_background_import_status("complete", 0, $type, false);
			}

			delete_transient($lock_key);
		} else {
			FrontendEditor::import_all_data();
			$this->set_background_import_status("complete", 0, $type, false);
		}
	}

	private function set_bg_message(string $message)
	{
		set_transient('udesly_bg_message', $message);
	}

	private function get_background_import_status()
	{
		$status = get_transient('udesly_bg_import_status');

		return $status ? (object) $status : (object) ['status' => 'idle'];
	}

	private function on_import_end()
	{
		$this->set_last_import_time();
		$this->set_last_filesize();
		$this->set_last_file_hash();
		$homepage = get_page_by_path("index");
		if ($homepage) {
			update_option('page_on_front', $homepage->ID);
			update_option('show_on_front', 'page');
		}
		flush_rewrite_rules(true);
		$this->set_background_import_status("idle");
	}

	private function set_background_import_status(string $status, int $next_index = 0, $import_type = "users", $has_next = true)
	{

		$import_types = ["users", "terms", "posts"];

		if (FrontendEditor::isActive()) {
			$import_types[] = "frontend-editor";
		}

		if ($status == "complete") {
			$key = array_search($import_type, $import_types);

			if (isset($import_types[$key + 1])) {
				set_transient('udesly_bg_import_status', [
					"status"      => "pending",
					"next_index"  => 0,
					"import_type" => $import_types[$key + 1],
					"has_next"    => true,
				]);
				return;
			} else {
				// End of import
				$this->on_import_end();
			}
		}

		set_transient('udesly_bg_import_status', [
			"status"      => $status,
			"next_index"  => $next_index,
			"import_type" => $import_type,
			"has_next"    => $has_next,
		]);
	}

	private function schedule_import_data()
	{
		$import = (object) $this->get_background_import_status();

		switch ($import->status) {
			case "idle":
				if ($this->is_stale_data()) {
					$this->set_background_import_status("pending");
				} else if (FrontendEditor::isActive() && FrontendEditor::is_stale_data()) {
					$this->set_background_import_status("pending", 0, "frontend-editor");
				}
				break;
			case "complete":
				if ($this->is_stale_data()) {
					$this->set_background_import_status("pending");
				} else if (FrontendEditor::isActive() && FrontendEditor::is_stale_data()) {
					$this->set_background_import_status("pending", 0, "frontend-editor");
				} else {
					$this->set_background_import_status("idle", 0, "users", false);
				}
				break;
		}
	}

	public function check_data()
	{

		if (FSUtils::is_available()) {

			$this->schedule_import_data();
			add_action('wp_ajax_udesly_import_data', [$this, 'udesly_import_data']);
		} else {
			Notices::enqueue_notice([
				'message'     => __('Cannot work properly, no access to the filesystem, please check server configuration', 'udesly'),
				'type'        => "error",
				'dismissible' => false
			]);
		}
	}

	public function get_last_import_time(): int
	{
		return (int) get_transient('_udesly_last_data_import');
	}

	public function get_last_filesize(): int
	{
		return (int) get_transient('_udesly_last_data_file_size');
	}

	public function get_last_file_hash(): string
	{
		return (string) get_transient('_udesly_last_file_hash');
	}

	public function delete_last_import_transient()
	{
		$stats = $this->get_background_import_status();
		if ($stats->status === "idle") {
			delete_transient('_udesly_last_data_import');
			delete_transient('_udesly_last_data_file_size');
			delete_transient('_udesly_last_file_hash');
		}
	}

	public function set_last_import_time()
	{
		set_transient('_udesly_last_data_import', time());
	}

	public function set_last_filesize()
	{
		set_transient('_udesly_last_data_file_size', filesize($this->data_path));
	}

	public function set_last_file_hash()
	{
		set_transient('_udesly_last_file_hash', FSUtils::get_content($this->hash_path));
	}

	public function udesly_import_data()
	{
		if (!check_ajax_referer('udesly_import_data', 'nonce', false)) {
			wp_send_json_error("Failed security check");
			die;
		}

		$next_index = intval($_POST['next_index']);


		$type = sanitize_text_field($_POST['import_type']);

		$res = $this->import_data($type, $next_index);

		if (is_wp_error($res)) {
			wp_send_json_error($res);
		}


		wp_send_json_success($this->get_background_import_status());
	}

	function get_current_admin_url($action = null)
	{
		$uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '';
		$uri = preg_replace('|^.*/wp-admin/|i', '', $uri);

		if (!$uri) {
			$uri = "";
		}

		$uri = remove_query_arg(array('action', '_wpnonce', '_wc_notice_nonce', 'wc_db_update', 'wc_db_update_nonce', 'wc-hide-notice'), admin_url($uri));

		return $action ? add_query_arg('action', $action, $uri) : $uri;
	}

	public function public_hooks()
	{


		add_action("wp_enqueue_scripts", function () {
			wp_register_style("udesly-common", UDESLY_PLUGIN_URI . 'assets/frontend/css/common.css', [], UDESLY_PLUGIN_VERSION);

			wp_enqueue_style("udesly-common");
			wp_register_script('udesly_country_select', UDESLY_PLUGIN_URI . 'assets/frontend/utils/country-select.js', [], UDESLY_PLUGIN_VERSION, true);


			if (function_exists('WC') && WC()->countries) {

				wp_localize_script('udesly_country_select', 'udesly_country_select', [
					'countries_states' => wp_json_encode(array_merge(WC()->countries->get_allowed_country_states(), WC()->countries->get_shipping_country_states())),
					'countries_options' => wp_json_encode(WC()->countries->get_allowed_countries()),
					'vat_countries' => wp_json_encode((new \WC_Countries())->get_vat_countries()),
					'billing_country' => udesly_get_user_meta('billing_country'),
					'billing_state' => udesly_get_user_meta('billing_state')
				]);
			}
		});

		add_filter('render_block_core/image', function ($block_content, $block) {
			/*"w-richtext-align-center";
			"w-richtext-align-fullwidth";
			"w-richtext-align-normal";
			"w-richtext-align-floatleft";
			"w-richtext-align-floatright";*/
			if (strpos($block_content, "w-richtext") === false) {
				return str_replace('figure class="', 'figure class="w-richtext-figure-type-image w-richtext-align-fullwidth ', $block_content);
			}
			return $block_content;
		}, 10, 2);
	}

	public function get_transient_keys_with_prefix( $prefix ) {
		global $wpdb;
	
		$prefix = $wpdb->esc_like( '_transient_' . $prefix );
		$sql    = "SELECT `option_name` FROM $wpdb->options WHERE `option_name` LIKE '%s'";
		$keys   = $wpdb->get_results( $wpdb->prepare( $sql, $prefix . '%' ), ARRAY_A );
	
		if ( is_wp_error( $keys ) ) {
			return [];
		}
	
		return array_map( function( $key ) {
			// Remove '_transient_' from the option name.
			return ltrim( $key['option_name'], '_transient_' );
		}, $keys );
	}


	public function admin_hooks()
	{

		add_action('admin_init', [$this, 'check_data']);

		$background_status = $this->get_background_import_status();

		add_filter('heartbeat_received', function (array $response, array $data) {
			if (empty($data['udesly_check_data'])) {
				return $response;
			}

			$this->check_data();

			$response['udesly_import_data'] = $this->get_background_import_status();

			return $response;
		}, 10, 2);

		add_action('admin_enqueue_scripts', function () use ($background_status) {

			wp_register_script('udesly-theme-admin', UDESLY_PLUGIN_URI . 'assets/admin/js/theme.js', [], UDESLY_PLUGIN_VERSION, true);
			wp_localize_script('udesly-theme-admin', 'udesly_theme_admin', [
				'import_data' => $background_status,
				'nonce' => wp_create_nonce('udesly_import_data'),
				'action' => 'udesly_import_data'
			]);


			wp_enqueue_script('udesly-theme-admin');
			wp_register_style('udesly-theme-admin', UDESLY_PLUGIN_URI . 'assets/admin/css/theme.css', [], UDESLY_PLUGIN_VERSION);
			wp_enqueue_style('udesly-theme-admin');
		});

		add_action("admin_init", function () {
			if (isset($_GET['action']) && $_GET['action'] === "udesly_delete_last_import") {
				if (wp_verify_nonce($_GET['_wpnonce'], "udesly_delete_last_import")) {
					$this->delete_last_import_transient();
				}
				wp_redirect($this->get_current_admin_url());
				die;
			}
			if (isset($_GET['action']) && $_GET['action'] === "udesly_delete_frontend_editor_data") {
				if (wp_verify_nonce($_GET['_wpnonce'], "udesly_delete_frontend_editor_data")) {
					FrontendEditor::delete_all_data();
					$this->set_background_import_status("pending", 0, "frontend-editor");
				}
				wp_redirect($this->get_current_admin_url());
				die;
			}

			if (isset($_GET['action']) && $_GET['action'] === "udesly_delete_block_transients_data") {
				if (wp_verify_nonce($_GET['_wpnonce'], "udesly_delete_block_transients_data")) {
					foreach ( $this->get_transient_keys_with_prefix( "udesly_lock" ) as $key ) {
						delete_transient( $key );
					}
				}
				wp_redirect($this->get_current_admin_url());
				die;
			}
		});

		add_action('wp_ajax_udesly_import_data', [$this, 'udesly_import_data']);

		add_action('admin_bar_menu', function (\WP_Admin_Bar $admin_bar) use ($background_status) {


			$admin_bar->add_menu(array(
				'id'    => 'udesly-menu',
				'parent' => null,
				'group'  => null,
				'title' => 'Udesly', //you can use img tag with image link. it will show the image icon Instead of the title.
				//'href' => wp_nonce_url($this->get_current_admin_url("udesly_delete_last_import"), "udesly_delete_last_import"),
				'meta' => [
					'title' => __('Udesly', 'textdomain'), //This title will show on hover
				]
			));

			if ($background_status->status == "idle") {

				$admin_bar->add_menu(array(
					'parent' => 'udesly-menu',
					'id' => 'udesly-import-data',
					'title' => "Force import data from Webflow",
					'href' => wp_nonce_url($this->get_current_admin_url("udesly_delete_last_import"), "udesly_delete_last_import"),
				));

				if (FrontendEditor::isActive()) {
					$admin_bar->add_menu(array(
						'parent' => 'udesly-menu',
						'id' => 'udesly-delete-fe-data',
						'title' => "Delete all frontend editor data",
						'href' => wp_nonce_url($this->get_current_admin_url("udesly_delete_frontend_editor_data"), "udesly_delete_frontend_editor_data"),
					));
				}
			} else {
				$admin_bar->add_menu(array(
					'parent' => 'udesly-menu',
					'id' => 'udesly-delete-block-transients-data',
					'title' => "Import Locked? Press Here",
					'href' => wp_nonce_url($this->get_current_admin_url("udesly_delete_block_transients_data"), "udesly_delete_block_transients_data"),
				));
			}
		}, 500);
	}
}
