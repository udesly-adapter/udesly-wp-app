<?php 

namespace Udesly\Rest;


final class Rest {

    protected static $_instance = null;

    public static function instance()
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

    static function can_run() {
        return extension_loaded('curl') || ini_get('allow_url_fopen');
    }


    public function register_routes() {
        register_rest_route( 'udesly/v1', 'info', array(
            'methods' => 'GET',
            'callback' => [$this, 'info'],
        ));
    }

    public function info() {
        return [
            "hello" => "world"
        ];
    }
}