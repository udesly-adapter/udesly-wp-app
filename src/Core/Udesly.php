<?php

namespace Udesly\Core;

use Udesly\Theme\Theme;

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
    }

    private function init_hooks()
    {
        add_action('after_setup_theme', function () {
            if ((Theme::instance())->is_valid()) {
                $this->init();
            }
        }, 0);

    }

    private function admin_hooks()
    {
    	add_action('admin_notices','\Udesly\Utils\Notices::show_notices');
        (Theme::instance())->admin_hooks();
    }


    private function public_hooks() {

    }

    private function init()
    {
        if (is_admin()) {
	        $this->admin_hooks();
        }
	    $this->public_hooks();
    }


}