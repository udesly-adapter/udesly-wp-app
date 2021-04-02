<?php

namespace Udesly\Extensions\ACF;

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;


class CustomFields {

	protected static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	public function public_hooks() {
		add_action('acf/include_field_types',					array($this, 'include_field_types'), 5);
		add_action('acf/input/admin_enqueue_scripts',			array($this, 'input_admin_enqueue_scripts'));
	}

	function include_field_types() {

		acf_register_field_type( '\Udesly\Extensions\ACF\SetField' );
	}

	function input_admin_enqueue_scripts() {
		wp_register_script( 'udesly-custom-fields', UDESLY_PLUGIN_URI . 'assets/admin/js/custom-fields.js', array('acf-input'), UDESLY_PLUGIN_VERSION );
		wp_register_style( 'udesly-custom-fields', UDESLY_PLUGIN_URI . 'assets/admin/css/custom-fields.css', array('acf-input'), UDESLY_PLUGIN_VERSION );

		wp_enqueue_script('udesly-custom-fields');
		wp_enqueue_style('udesly-custom-fields');

	}

}