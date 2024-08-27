<?php
/**
 * Plugin Name: Udesly App
 * Plugin URI: https://udesly.com
 * Description: A companion app for the Udesly App
 * Version: 3.0.0@beta50
 * Author: Udesly
 * Author URI: https://udesly.com
 * Text Domain: udesly
 * Domain Path: /i18n/languages/
 * Requires PHP: 7.1
 *
 * @package Udesly
 */


defined( 'ABSPATH' ) || exit;

require __DIR__ . '/vendor/autoload.php';

include_once __DIR__ . '/misc/index.php';


define( 'UDESLY_PLUGIN_DIR_PATH', __DIR__ );

define( 'UDESLY_PLUGIN_VERSION', "3.0.0@beta50" );

define( 'UDESLY_PLUGIN_URI', plugin_dir_url( __FILE__ ) );

/**
 * Fires on plugin activation
 */

function activate_udesly_plugin() {
	\Udesly\Core\Activator::activate_plugin();
}

function deactivate_udesly_plugin() {
	\Udesly\Core\Deactivator::deactivate_plugin();
}


// register_activation_hook(__FILE__, 'activate_udesly_plugin');

// register_deactivation_hook(__FILE__, 'deactivate_udesly_plugin');


function udesly() {
	return \Udesly\Core\Udesly::instance();

}

udesly()->run();


add_action('plugins_loaded', function () {
	if( ! class_exists( 'ACF' ) ) {
		// Define path and URL to the ACF plugin.
		define( 'MY_ACF_PATH', UDESLY_PLUGIN_DIR_PATH . '/vendor/advanced-custom-fields/' );
		define( 'MY_ACF_URL', UDESLY_PLUGIN_URI . '/vendor/advanced-custom-fields/' );
		// Include the ACF plugin.
		include_once( MY_ACF_PATH . 'acf.php' );
		// Customize the url setting to fix incorrect asset URLs.
		add_filter( 'acf/settings/url', function( $url ) {
			return MY_ACF_URL;
		} );
		// (Optional) Hide the ACF admin menu item.
		add_filter( 'acf/settings/show_admin', function( $show_admin ) {
			//return false;
			return $show_admin;
		}, 10);
	}

}, 20);


if (is_admin()) {
	require 'plugin-update-checker/plugin-update-checker.php';
	$update_checker = Puc_v4_Factory::buildUpdateChecker(
		'https://github.com/udesly-adapter/udesly-wp-app',
		__FILE__,
		'udesly-wp-app'
	);
}


add_action('wp_footer', function() {
	?>
<script>
	document.querySelectorAll('form[data-ajax-action="contact"] select[multiple]').forEach( select => {
		select.name = select.name + "[]";
	})
</script>
	<?php
});