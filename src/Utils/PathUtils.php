<?php

namespace Udesly\Utils;

defined( 'ABSPATH' ) || exit;

final class PathUtils {

    static function join() {
        $path = func_get_arg(0);

        $num = func_num_args();

        for($i = 1; $i<$num; $i++) {
            $path = path_join($path, func_get_arg($i));
        }

        return $path;
    }
}
