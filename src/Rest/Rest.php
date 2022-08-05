<?php 

namespace Udesly\Rest;

use Udesly\Utils\FSUtils;

final class Rest extends \WP_REST_Controller {

    protected static $_instance = null;

    public const APP_NAME = "udesly-rest";

    public static function instance()
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

    static function can_remote_download() {
        return extension_loaded('curl') || ini_get('allow_url_fopen');
    }

    static function can_write_themes() {
        return is_writable(get_theme_root());
    }

    static function can_run() {
            return self::can_remote_download() && self::can_write_themes();
    }

    public function register_routes() {
        register_rest_route( 'udesly/v1', '/info', array(
            'methods' => \WP_REST_Server::READABLE,
            'callback' => [$this, 'info'],
            "permission_callback" => [$this, "is_rest_authenticated"]
        ));

        register_rest_route( 'udesly/v1', '/themes/(?P<slug>[a-zA-Z0-9-]+)', array(
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => [$this, 'create_theme'],
            "args" => [
                "slug" => [
                    'required' => true,
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param ) && 1 !== preg_match('~[0-9]~', $param[0]);
                    }
                ]
            ],
            "permission_callback" => [$this, "is_rest_authenticated"]
        ));

        register_rest_route( 'udesly/v1', '/themes/(?P<slug>[a-zA-Z0-9-]+)/assets', array(
            'methods' => \WP_REST_Server::READABLE,
            'callback' => [$this, 'list_assets'],
            "args" => [
                "slug" => [
                    'required' => true,
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param ) && 1 !== preg_match('~[0-9]~', $param[0]);
                    }
                ],
                "folder" => [
                    'required' => false,
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ],
            ], 
            "permission_callback" => [$this, "is_rest_authenticated"]
        ));

        register_rest_route( 'udesly/v1', '/themes/(?P<slug>[a-zA-Z0-9-]+)/assets', array(
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => [$this, 'upload_asset'],
            "args" => [
                "slug" => [
                    'required' => true,
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param ) && 1 !== preg_match('~[0-9]~', $param[0]);
                    }
                ],
                "filepath" => [
                    'required' => true,
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param );
                    }
                ],
                "type" => [
                    'required' => true,
                    'validate_callback' => function($param, $request, $key) {
                        return is_string( $param ) && in_array($param, ["url", "string"]);
                    }
                ],
                "value" => [
                    'required' => true,
                    'validate_callback' => function($param, $request, $key) {
                        return isset($param);
                    }
                ]
            ], 
            "permission_callback" => [$this, "is_rest_authenticated"]
        ));
    }

    public function upload_asset(\WP_REST_Request $request) {
        $file_path = $request->get_param('filepath');

        $file_path = FSUtils::get_absolute_path($file_path);
        
        $type = $request->get_param('type');
        $value = $request->get_param('value');

        $slug = sanitize_title($request->get_param('slug'));

        $theme_path = path_join(get_theme_root(), $slug );

        $file_path = path_join($theme_path, $file_path);


        switch($type) {
            case "url":
                return FSUtils::download_file($value, $file_path);
            case "string":
                return FSUtils::write_file($value, $file_path);
        }

    }

    public function list_assets(\WP_REST_Request $request) {
        $slug = sanitize_title($request->get_param('slug'));
        $theme_path = path_join(get_theme_root(), $slug);

        $folder = $request->get_param('folder');
        if (!$folder) {
            $folder = "";
        }
        $folder = FSUtils::get_absolute_path($folder);

        if (!is_dir(path_join(get_theme_root(), $slug))) {
            return [];
        }
        $path = path_join($theme_path, $folder);

    
        return FSUtils::scandir($path);
        
    }

    public function create_theme(\WP_REST_Request $request) {
        $slug = sanitize_title($request->get_param('slug'));
        $theme_path = path_join(get_theme_root(), $slug);
        if (is_dir(path_join(get_theme_root(), $slug))) {
            return [
                "skipped" => true
            ];
        }
        $result = mkdir($theme_path, 0755);

        return [
            "created" => $result
        ];
    }

    public function is_rest_authenticated() {
        return current_user_can(
            'administrator'
        );
    }

    public function info() {
        return [
            "plugins" => [
                "woocommerce" => class_exists( 'woocommerce' )
            ],
            "remote_download" => Rest::can_remote_download(),
            "writable_themes" => Rest::can_write_themes(),
            "version" => UDESLY_VERSION,
            "post_max_size" => ini_get("post_max_size"),
            "upload_max_filesize" => ini_get("upload_max_filesize")
        ];
    }
}