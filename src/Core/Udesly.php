<?php

namespace Udesly\Core;

use Udesly\FrontendEditor\FrontendEditor;
use Udesly\Theme\Theme;
use Udesly\Extensions\WooCommerce\WebflowCommerce;
use Udesly\Rest\Rest;

defined('ABSPATH') || exit;


final class Udesly
{

	protected static $_instance = null;

	private $runned = false;


	public static function instance()
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function __construct()
	{
	}

	public function run()
	{
		if (!$this->runned) {
			$this->init_hooks();
			$this->runned = true;
			$this->include_dependencies();
			define("UDESLY_VERSION", "3.1.0");
		}
	}

	public function __clone()
	{
	}

	public function __wakeup()
	{
	}

	private function include_dependencies()
	{
		include_once UDESLY_PLUGIN_DIR_PATH . "/misc/post.php";
		include_once UDESLY_PLUGIN_DIR_PATH . "/misc/custom-fields.php";
		include_once UDESLY_PLUGIN_DIR_PATH . "/misc/utils.php";

		add_action('plugins_loaded', function () {
			if (class_exists('woocommerce')) {
				WebflowCommerce::instance()->run();
			}
		});
	}

	private function init_hooks()
	{
		if ((Theme::instance())->is_valid()) {
			$this->init();
		}
		$this->init_rest();
	}

	private function init_rest()
	{
		add_action('admin_menu', [$this, 'add_rest_page']);
		if (Rest::can_run()) {
			add_action('rest_api_init', function () {
				(Rest::instance())->register_routes();
			});
		}
	}

	public function add_rest_page()
	{


		add_submenu_page('options-general.php', __('Udesly APIs'), __('Udesly APIs'), 'administrator', 'udesly_rest_apis', function () {
			$can_run = Rest::can_run();
?>
			<div class="wrap">
				<h1><?php _e('Udesly APIs'); ?></h1>
				<?php if ($can_run) : ?>
					<h2>Great!</h2>
					<p><?php echo get_rest_url(null, "/udesly/v1"); ?></p>
					<?php
					$user = wp_get_current_user();
					$app_passwords = \WP_Application_Passwords::get_user_application_passwords($user->ID);
					if ($app_passwords) {
						foreach($app_passwords as $pass) {
							if ($pass["app_id"] == Rest::APP_NAME) {
								$app_password = $pass["password"];
							}
						}
					}
					if ($app_password) {
						$token = get_user_meta($user->ID, "__udesly_rest_token", true);
					} else {
						$app_passwords = \WP_Application_Passwords::create_new_application_password(
							$user->ID,
							[
								"name" => Rest::APP_NAME,
								"app_id" => Rest::APP_NAME
							]
						);
						$app_password = $app_passwords[0];
					
						if (is_wp_error($app_passwords)) {
							wp_die($app_passwords);
						}
						$token = base64_encode($user->user_login . ":" . $app_password);
						update_user_meta($user->ID, "__udesly_rest_token", $token);
					 } ?>
					<p>Token: <?php echo $token; ?></p>
				<?php else : ?>
					<h2>Your server is not able to run the Udesly plugin :(</h2>
				<?php endif; ?>
			</div>

		<?php
		});
	}

	private function admin_hooks()
	{
		add_action('admin_notices', '\Udesly\Utils\Notices::show_notices');
		(Theme::instance())->admin_hooks();
		add_action('admin_init', [$this, 'init_options']);
		add_action('admin_menu', [$this, 'add_options_page']);
	}

	public function enable_temporary_mode()
	{
		$option = get_option('udesly_site_mode');

		if (!$option || $option == "normal") {
			return;
		}
		global $pagenow;

		$should_show_maintenance = $pagenow !== 'wp-login.php' && strpos($_SERVER['REQUEST_URI'], 'wp-admin') === false && !current_user_can('administrator');

		$should_show_maintenance = apply_filters('udesly/show-maintenance', $should_show_maintenance);

		if ($should_show_maintenance) {
			if (file_exists(get_stylesheet_directory() . '/maintenance.php')) {

				if ($option == 'maintenance') {
					header('HTTP/1.1 503 Service Temporarily Unavailable');
					header('Content-Type: text/html; charset=utf-8');
				} else {
					//coming soon
					header('HTTP/1.1 307 Temporarily Redirect');
					header('Content-Type: text/html; charset=utf-8');
				}
				require_once(get_stylesheet_directory() . '/maintenance.php');
			} else {
				header('HTTP/1.1 503 Service Temporarily Unavailable');
				header('Content-Type: text/html; charset=utf-8');

				if (file_exists(get_stylesheet_directory() . '/404.php'))

					require_once(get_stylesheet_directory() . '/404.php');
			}
			die();
		}
	}

	public function add_options_page()
	{

		add_submenu_page('options-general.php', __('Theme Settings'), __('Theme'), 'administrator', 'udesly_theme_settings', function () {
		?>
			<div class="wrap">
				<h1><?php _e('Theme Settings'); ?></h1>
				<form method="post" action="options.php">
					<?php
					settings_fields('udesly_setting_group');
					do_settings_sections('udesly_setting_group');

					$site_mode = get_option('udesly_site_mode');

					?>
					<table class="form-table">
						<tr valign="top">
							<th scope="row"><?php _e('Site mode'); ?></th>
							<td><select name="udesly_site_mode">
									<option value="normal" <?php selected($site_mode, "normal", true); ?>>Default</option>
									<option value="maintenance" <?php selected($site_mode, "maintenance", true); ?>>Maintenance</option>
									<option value="coming-soon" <?php selected($site_mode, "coming-soon", true); ?>>Coming Soon</option>
								</select></td>
						</tr>
					</table>
					<?php
					submit_button();
					?>
				</form>
			</div>

<?php
		});
	}

	public function init_options()
	{
		register_setting('udesly_setting_group', 'udesly_site_mode');
	}


	private function public_hooks()
	{
		add_action('wp_loaded', [$this, "enable_temporary_mode"]);

		(Theme::instance())->public_hooks();
		add_action('wp_enqueue_scripts', function () {
			wp_register_script('udesly-frontend', UDESLY_PLUGIN_URI . 'assets/frontend/js/udesly-frontend-scripts.js', [], UDESLY_PLUGIN_VERSION, true);
			wp_localize_script('udesly-frontend', 'udesly_frontend_options', apply_filters('udesly_localize_script_params', [
				'plugins' => [
					'woocommerce' => class_exists('woocommerce'),
				],
				'wp' => [
					'ajax_url' => admin_url('admin-ajax.php'),
					'lifespan' => apply_filters('nonce_life', DAY_IN_SECONDS)
				]
			]));
			wp_enqueue_script("udesly-frontend");
		});

		add_filter('script_loader_tag', function ($tag, $handle, $src) {
			if ('udesly-frontend' !== $handle) {
				return $tag;
			}
			// change the script tag by adding type="module" and return it.
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
			return $tag;
		}, 10, 3);


		add_filter('template_include', function ($template) {

			if (post_password_required() && !is_post_type_archive()) {
				$path = trailingslashit(get_template_directory()) . '401.php';
				if (file_exists($path)) {
					return $path;
				}
			}

			if (!is_search()) {
				return $template;
			}

			$post_type = get_query_var('post_type');
			if (file_exists(get_template_directory() . '/search-' . $post_type . '.php')) {

				$new_template = locate_template(array('search-' . $post_type . '.php'));
				if (!empty($new_template)) {
					$template = $new_template;
				}
			}

			return $template;
		}, 999, 1);
	}

	private function init()
	{

		if (FrontendEditor::isActive()) {
			(FrontendEditor::instance())->run();
		}

		if (is_admin()) {

			$this->admin_hooks();
		}
		$this->public_hooks();

		include_once UDESLY_PLUGIN_DIR_PATH . '/src/Ajax/index.php';
	}
}
