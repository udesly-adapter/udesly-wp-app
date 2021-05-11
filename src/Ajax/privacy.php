<?php

if (!defined('ABSPATH')) {
	exit;
}

udesly_add_ajax_action('export_data');

function udesly_ajax_export_data() {
	udesly_check_ajax_security();

	if (!isset($_POST['email']) || !is_email($_POST['email'])) {
		wp_send_json_error(__('Invalid Email!'));
	}

	$user = get_user_by( 'email', $_POST['email'] );

	if (!$user instanceof WP_User) {
		wp_send_json_error(__('Unable to process the request, please check your email address!'));
	}

	$request_id = wp_create_user_request( $_POST['email'], "export_personal_data", array() );

	if (is_wp_error($request_id)) {
		wp_send_json_error($request_id->get_error_message());
	}

	wp_send_json_success();
}

udesly_add_ajax_action('remove_data');

function udesly_ajax_remove_data() {

	udesly_check_ajax_security();

	if (!isset($_POST['email']) || !is_email($_POST['email'])) {
		wp_send_json_error(__('Invalid Email!'));
	}

	$user = get_user_by( 'email', $_POST['email'] );

	if (!$user instanceof WP_User) {
		wp_send_json_error(__('Unable to process the request, please check your email address!'));
	}

	$request_id = wp_create_user_request( $_POST['email'], "remove_personal_data", array() );

	if (is_wp_error($request_id)) {
		wp_send_json_error($request_id->get_error_message());
	}

	wp_send_json_success();
}