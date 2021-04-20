<?php

namespace Udesly\Core;

use Udesly\Extensions\ACF\CustomFields;
use Udesly\FrontendEditor\FrontendEditor;
use Udesly\Theme\Theme;
use Udesly\Extensions\WooCommerce\WebflowCommerce;

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

    public function run() {
    	if (!$this->runned) {
		    $this->init_hooks();
		    $this->runned = true;
		    $this->include_dependencies();
		    define("UDESLY_VERSION", "3.0.0");
	    }
    }

    public function __clone()
    {
    }

    public function __wakeup()
    {
    }

    private function include_dependencies() {
    	include_once UDESLY_PLUGIN_DIR_PATH . "/misc/post.php";
	    include_once UDESLY_PLUGIN_DIR_PATH . "/misc/custom-fields.php";

	    add_action('plugins_loaded', function() {
		    if ( class_exists( 'woocommerce' ) ) {
			   WebflowCommerce::instance()->run();
		    }
	    });
    }

    private function init_hooks()
    {
	    if ((Theme::instance())->is_valid()) {
		    $this->init();
	    }


    }

    private function admin_hooks()
    {
    	add_action('admin_notices','\Udesly\Utils\Notices::show_notices');
        (Theme::instance())->admin_hooks();
    }


    private function public_hooks() {
	    (Theme::instance())->public_hooks();
	    (CustomFields::instance())->public_hooks();
	    add_action('wp_enqueue_scripts', function () {
	    	wp_register_script('udesly-frontend', UDESLY_PLUGIN_URI . 'assets/frontend/js/udesly-frontend-scripts.js', [], UDESLY_PLUGIN_VERSION, true);
			wp_localize_script('udesly-frontend', 'udesly_frontend_options', [
				'plugins' => [
					'woocommerce' => class_exists( 'woocommerce' ),
				]
			]);
	    	wp_enqueue_script("udesly-frontend");
	    });

	    add_filter('script_loader_tag', function($tag, $handle, $src) {
		    if ( 'udesly-frontend' !== $handle ) {
			    return $tag;
		    }
		    // change the script tag by adding type="module" and return it.
		    $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
		    return $tag;
	    }, 10, 3);
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
    }


}