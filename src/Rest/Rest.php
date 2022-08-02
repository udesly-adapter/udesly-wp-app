<?php 

namespace Udesly\Rest;


final class Rest {

    static function can_run() {
        return extension_loaded('curl') || ini_get('allow_url_fopen');
    }

}