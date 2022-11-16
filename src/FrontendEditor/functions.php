<?php

if (!function_exists('udesly_sanitize_url')) {

    function udesly_sanitize_url(string $url)
    {

        if (\Udesly\Utils\StringUtils::starts_with($url, 'documents/')) {
            return udesly_sanitize_asset_url(strtolower($url));
        }

        if (\Udesly\Utils\StringUtils::starts_with($url, '/') || \Udesly\Utils\StringUtils::starts_with($url, '#')) {
            return esc_url($url);
        }

        if (\Udesly\Utils\StringUtils::contains($url, ':')) {
            return esc_url($url);
        }
        if ("index" === $url || "/" === $url) {
            return home_url();
        }

        return home_url($url);
    }
}

function udesly_sanitize_asset_url(string $url)
{

    if (\Udesly\Utils\StringUtils::contains($url, ':')) {
        return esc_url($url);
    }

    return trailingslashit(get_stylesheet_directory_uri()) . 'assets/'  . $url;
}

if (!function_exists('_u')) {

    function _u($hash, $type, $section = "page")
    {
        global $udesly_fe_data;


        $folder = $udesly_fe_data[$section]->$type;
        if (property_exists($folder, $hash)) {
            $data = $folder->$hash;
        } else {
            $data = "Import Data";
        }



        switch ($type) {
            case "link":

                $data = udesly_sanitize_url($data);
                break;
            case "iframe":
                $data = udesly_sanitize_asset_url($data);
                break;
            default:
        }

        return $data;
    }
}

if (!function_exists('udesly_set_frontend_editor_data')) {

    function udesly_set_frontend_editor_data($template)
    {
        global $udesly_fe_data;
        $udesly_fe_data = [];
        $udesly_fe_data['page'] = json_decode(\Udesly\FrontendEditor\FrontendEditor::get_frontend_editor_data($template));
        $udesly_fe_data['global'] = json_decode(\Udesly\FrontendEditor\FrontendEditor::get_frontend_editor_global_data());
    }
}

if (!function_exists('udesly_get_tina_img')) {

    function udesly_get_tina_img($image)
    {
        $img = udesly_get_image($image);

        return (object) [
            "id" => $img->id,
            "previewSrc" => $img->src,
            "type" => "file",
            "directory" => "",
            "filename" => basename($img->src),
            "_original" => $image
        ];
    }
}

if (!function_exists('udesly_output_frontend_editor_data')) {
    function udesly_output_frontend_editor_data($template)
    {

        if (isset($_GET['udesly_action']) && 'frontend-editor' === $_GET['udesly_action']) {

            global $udesly_fe_data;

            $tina_data = $udesly_fe_data;

            foreach ($tina_data['page']->img as $key => $image) {
                $tina_data['page']->img->$key = udesly_get_tina_img($image);
            }

            foreach ($tina_data['global']->img as $key => $image) {
                $tina_data['global']->img->$key = udesly_get_tina_img($image);
            }

            $tina_data['template'] = $template;

?>
            <script id="udesly-fe-data" type="application/json">
                <?php echo json_encode($tina_data); ?>
            </script>
            <style>
                .fe-focused {
                    box-shadow: 0 0 0 2px #2296fe;
                    border-radius: 5px;
                }

                ::-webkit-scrollbar {
                    width: 6px
                }

                ::-webkit-scrollbar-track {
                    background: transparent;
                    border-style: solid;
                    border-width: 0
                }

                ::-webkit-scrollbar-thumb {
                    border-radius: 100px;
                    background: #2296fe
                }
            </style>
            <script>
                document.addEventListener('click', e => {
                    e.preventDefault();

                    e.stopPropagation();

                    const target = e.target.matches('[data-link],a') ? e.target : e.target.closest('[data-link]') || e.target.closest('a');

                    if (target && !target.dataset.wTab) {


                        const href = target.getAttribute('href');
                        if (!href.includes("/")) {
                            parent.document.dispatchEvent(new CustomEvent('udesly-fe.notice', {
                                detail: {
                                    type: 'info',
                                    message: `This link will go to a page with slug: "${href}"`
                                }
                            }))
                        } else {
                            parent.document.dispatchEvent(new CustomEvent('udesly-fe.notice', {
                                detail: {
                                    type: 'info',
                                    message: `This link will go to: "${href}"`
                                }
                            }))
                        }


                    }
                })
            </script>
<?php
        }
    }
}
