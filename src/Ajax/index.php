<?php

if (!defined('ABSPATH')) {
	exit;
}

function udesly_add_ajax_action($action) {
	$action = "udesly_ajax_$action";
	add_action("wp_ajax_$action", $action);
	add_action("wp_ajax_nopriv_$action", $action);
}


udesly_add_ajax_action("generate_nonce");
function udesly_ajax_generate_nonce() {
	echo wp_create_nonce('udesly_ajax_nonce');
	wp_die();
}


function udesly_check_ajax_security() {

	$disable = apply_filters('udesly/params/ajax_security', false);

	if ($disable) {
		return true;
	}

	if (!empty($_REQUEST['contact_me_by_fax_only']) && (bool) $_REQUEST['contact_me_by_fax_only'] == TRUE) {
		wp_send_json_error("Spam Bot", 403);
	}

	if (!check_ajax_referer('udesly_ajax_nonce', 'security', false)) {
		wp_send_json_error("Failed security check", 403);
	}
}

include_once __DIR__ . '/pagination.php';
include_once __DIR__ . '/user.php';
include_once __DIR__ . '/forms.php';
include_once __DIR__ . '/privacy.php';