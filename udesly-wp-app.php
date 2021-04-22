<?php
/**
 * Plugin Name: Udesly Adapter
 * Plugin URI: https://udesly.com
 * Description: A companion app for the Udesly Adapter
 * Version: 3.0.0
 * Author: Udesly
 * Author URI: https://udesly.com
 * Text Domain: udesly
 * Domain Path: /i18n/languages/
 * Requires PHP: 7.0
 *
 * @package Udesly
 */

defined( 'ABSPATH' ) || exit;

require __DIR__ . '/vendor/autoload.php';

include_once __DIR__ . '/misc/index.php';




define( 'UDESLY_PLUGIN_DIR_PATH', __DIR__ );

define( 'UDESLY_PLUGIN_VERSION', "3.0.0" );

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
			return false;
			//return $show_admin;
		}, 10);
	}

}, 10);


add_action('init', function() {

	//update_post_meta(2204, 'attribute_pa_size', "m");
	//$variation = new WC_Product_Variation(2222);
	//wp_set_object_terms(2200, 'xxl', "pa_size", true);

	//dd($variation);
	//dd($res);
	//wp_set_object_terms( 2142, 'xl', 'pa_size', true );

	//delete_post_meta(2176, 'attribute_pa_size');
	//update_post_meta(2176, 'attribute_pa_size', ["m"]);

	//$attributes[0]["value"] = "m|l|xl";

	//update_post_meta(2142, "_product_attributes", $attributes);
	//$p = \Udesly\Utils\DBUtils::create_post_if_necessary($variant);
	//dd(get_post_meta(2107));
	//wp_insert_term()
	//$id = wc_attribute_taxonomy_id_by_name("size11");
	//dd($id);
	//$product = wc_get_product(2086);

	//dd($product->get_attributes());
	//dd(get_post_meta(2086));

	//dd(get_post(2104));
});


function udy_wc_create_attributes($attributes) {

}