<?php

namespace Udesly\Utils;

final class FSUtils
{

    static function download_file($file_url, $filepath)
    {
        if (!function_exists('download_url')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }
        $tmp_file = download_url($file_url);

        // Copies the file to the final destination and deletes temporary file.
        if (!file_exists(dirname($filepath))) {
            mkdir(dirname($filepath), 0755);
        }
        $res = copy($tmp_file, $filepath);
        @unlink($tmp_file);

        return $res;
    }

    static function scandir($dir)
    {
        $dir = untrailingslashit($dir);
        $files = [];
        $len = strlen($dir);
        $allFiles = (new \RecursiveTreeIterator(new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS)));
        foreach ($allFiles as $file) {
           
            $filename = trim(str_replace(['|', ' ', '~', '\\'], '', $file), '-');
            if (!is_dir($filename)) {
               
                $files[] = [
                    "name" => substr($filename, $len),
                    "mtime" => filemtime($filename),
                    "size" => filesize($filename),
                ];
                
            }
            
            
        }

        return $files;
    }

    static function rsearch($folder, $pattern)
    {
        $dir = new \RecursiveDirectoryIterator($folder);
        $ite = new \RecursiveIteratorIterator($dir);
        $files = new \RegexIterator($ite, $pattern, \RegexIterator::MATCH);


        foreach ($files as $file) {
            yield $file->getPathName();
        }
    }

    static function write_file($content, $filepath)
    {
        if (!file_exists(dirname($filepath))) {
            mkdir(dirname($filepath), 0755);
        }

        $file = fopen($filepath, "w");

        fwrite($file, $content);

        return fclose($file);
    }

    static function get_absolute_path($path)
    {
        $path = str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $path);
        $parts = array_filter(explode(DIRECTORY_SEPARATOR, $path), 'strlen');
        $absolutes = array();
        foreach ($parts as $part) {
            if ('.' == $part) continue;
            if ('..' == $part) {
                array_pop($absolutes);
            } else {
                $absolutes[] = $part;
            }
        }
        return implode(DIRECTORY_SEPARATOR, $absolutes);
    }

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

    static function get_content(string $path): string
    {
        global $wp_filesystem;
        return $wp_filesystem->get_contents($path);
    }

    static function get_json_content(string $path): \stdClass
    {
        return json_decode(self::get_content($path));
    }

    static function mtime(string $path)
    {
        global $wp_filesystem;
        return $wp_filesystem->mtime($path);
    }
}
