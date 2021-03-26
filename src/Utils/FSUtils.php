<?php

namespace Udesly\Utils;

final class FSUtils
{

    static function is_available()
    {
        if (!did_action('admin_init')) {
            _doing_it_wrong('\\Udesly\\Utils\\FSUtils::is_available', 'Cannot access FS before admin_init function', '3.0.0');
            return false;
        }
        $access_type = get_filesystem_method();
        if ($access_type === 'direct') {
            /* you can safely run request_filesystem_credentials() without any issues and don't need to worry about passing in a URL */
            $creds = request_filesystem_credentials(site_url() . '/wp-admin/', '', false, false, array());

            /* initialize the API */
            if (!WP_Filesystem($creds)) {
                /* any problems and we exit */
                return false;
            }

            return true;
        } else {
            /* don't have direct write access. Prompt user with our notice */
            return false;
        }
    }

    static function get_content(string $path) : string {
        global $wp_filesystem;
        return $wp_filesystem->get_contents($path);
    }

    static function get_json_content(string $path) : \stdClass {
        return json_decode(self::get_content($path));
    }

    static function mtime(string $path) {
        global $wp_filesystem;
        return $wp_filesystem->mtime($path);
    }
}