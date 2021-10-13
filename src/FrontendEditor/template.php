<?php

if ( ! current_user_can( 'customize' ) ) {
	wp_die(
		'<h1>' . __( 'You need a higher level of permission.' ) . '</h1>' .
		'<p>' . __( 'Sorry, you are not allowed to customize this site.' ) . '</p>',
		403
	);
}

global $wp;


$path = add_query_arg(["udesly_action" => "frontend-editor"],home_url( $wp->request ));

?>
<!doctype html>
<html>
    <head>
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Jost&display=swap" rel="stylesheet">
        <?php if (is_ssl()) : ?><meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"><?php endif; ?>
        <style>
            body:not(.loaded) iframe, body:not(.loaded) #udesly-frontend-editor {
                display: none;
            }

            body.loaded .loader {
                display: none;
            }

            :root {
                --tina-font-family: 'Jost', sans-serif;
            }

            body {
                font-family: 'Jost', sans-serif;
            }

            .loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .lds-ellipsis {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
            }
            .lds-ellipsis div {
                position: absolute;
                top: 33px;
                width: 13px;
                height: 13px;
                border-radius: 50%;
                background: #2296fe;
                animation-timing-function: cubic-bezier(0, 1, 1, 0);
            }
            .lds-ellipsis div:nth-child(1) {
                left: 8px;
                animation: lds-ellipsis1 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(2) {
                left: 8px;
                animation: lds-ellipsis2 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(3) {
                left: 32px;
                animation: lds-ellipsis2 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(4) {
                left: 56px;
                animation: lds-ellipsis3 0.6s infinite;
            }
            @keyframes lds-ellipsis1 {
                0% {
                    transform: scale(0);
                }
                100% {
                    transform: scale(1);
                }
            }
            @keyframes lds-ellipsis3 {
                0% {
                    transform: scale(1);
                }
                100% {
                    transform: scale(0);
                }
            }
            @keyframes lds-ellipsis2 {
                0% {
                    transform: translate(0, 0);
                }
                100% {
                    transform: translate(24px, 0);
                }
            }

        </style>

<?php

$files = glob(UDESLY_PLUGIN_DIR_PATH . '/assets/frontend-editor/build/static/css/*.css');

?>

<?php foreach ($files as $file) : ?>
    <link rel="stylesheet" href="<?php echo str_replace(UDESLY_PLUGIN_DIR_PATH . "/", UDESLY_PLUGIN_URI, $file); ?>" />
<?php endforeach; ?>
    </head>
<body>
<div class="loader"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>

<iframe src="<?php echo $path; ?>" id="frontend-editor-frame"></iframe>
<div id="udesly-frontend-editor"></div>
<?php

$files = glob(UDESLY_PLUGIN_DIR_PATH . '/assets/frontend-editor/build/static/js/*.js');

$runtime = $files[count($files) - 1];

unset($files[count($files)-1]);

?>
<script>
    window.options = {
        ajax_url: "<?php echo admin_url( 'admin-ajax.php' ); ?>",
        async_upload: "<?php echo admin_url('async-upload.php'); ?>",
        accept: "",
        nonce: "<?php echo wp_create_nonce('media-form'); ?>",
        save_nonce: "<?php echo wp_create_nonce('udesly-fe-save'); ?>"
    }
</script>
<script src="<?php echo str_replace(UDESLY_PLUGIN_DIR_PATH . "/", UDESLY_PLUGIN_URI, $runtime); ?>"></script>
<?php
foreach ($files as $file) : ?>
    <script src="<?php echo str_replace(UDESLY_PLUGIN_DIR_PATH . "/", UDESLY_PLUGIN_URI, $file); ?>"></script>
<?php endforeach; ?>

</body>
</html>

