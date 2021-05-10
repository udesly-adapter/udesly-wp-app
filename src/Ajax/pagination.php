<?php

if (!defined('ABSPATH')) {
	exit;
}

udesly_add_ajax_action("query_pagination");

/**
 * Displays next page of a pagination
 */
function udesly_ajax_query_pagination() {

	udesly_check_ajax_security();

	$query_name = sanitize_text_field($_POST['query_name']);

	$paged = sanitize_text_field($_POST['paged']);

	if(!$query_name || !$paged) {
		wp_send_json_error(new WP_Error('Missing pagination data'), 400);
		wp_die();
	}

	ob_start();
	get_template_part('template-parts/query/' . $query_name, null, [
		'paged' => $paged
	]);
	$template = ob_get_clean();
	wp_send_json_success($template);
	wp_die();
}

