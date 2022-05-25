<?php

if (!defined('ABSPATH')) {
	exit;
}

udesly_add_ajax_action('login');

/**
 * Ajax Login
 */
function udesly_ajax_login() {

	udesly_check_ajax_security();

	$info                  = array();
	$info['user_login']    = sanitize_text_field($_POST['username']);
	$info['user_password'] = sanitize_text_field($_POST['password']);
	$info['remember']      = $_POST['rememberme'] ? true : false;

	$user_signon = wp_signon( $info, apply_filters('udesly/params/use_secure_cookie', false, $info['user_login']) );
	if ( is_wp_error( $user_signon ) ) {
		wp_send_json_error( apply_filters('udesly/ajax/login/error_message', $user_signon->get_error_message() ), 403 );
	} else {
		wp_send_json_success();
	}
}

udesly_add_ajax_action('register');

/**
 * Ajax Registration
 */
function udesly_ajax_register() {

	udesly_check_ajax_security();

	if (!get_option('users_can_register')) {
		wp_send_json_error(__( 'Sorry, registration is not currently allowed' ), 405);
	}

	if (!isset( $_POST['email'] ) || !is_email( $_POST['email'] ) ) {
		wp_send_json_error(__('Invalid Email!'));
	}

	$username  = sanitize_text_field($_POST['username']);
	$password  = sanitize_text_field($_POST['password']);
	$password_confirm  = sanitize_text_field($_POST['password_repeat']);
	$email     = sanitize_email($_POST['email']);
	$name      = sanitize_text_field($_POST['first_name']);
	$last_name = sanitize_text_field($_POST['last_name']);

	if(!$username) {
		$username = $email;
	}

	$userdata = array(
		'user_login' => $username,
		'user_pass'  => $password,
		'user_email' => $email,
		'first_name' => $name,
		'last_name'  => $last_name,
	);



	if( empty( $password ) || empty( $password_confirm ) ) {
		wp_send_json_error( __( 'Password is a required field' ), 400 );
	}

	// is pass1 and pass2 match?
	if ( isset( $password ) && $password != $password_confirm ) {
		wp_send_json_error( __( 'The passwords do not match.' ), 400 );
	}

	// is pass too short?
	if ( isset( $password ) && $password == $password_confirm && strlen($password) < 6) {
		wp_send_json_error( __( 'The passwords is too short, min. 6 characters.' ), 400 );
	}

	$valid = apply_filters('udesly/ajax/register_password/strength_check', true, $password);

	if(!$valid) {
		wp_send_json_error( apply_filters('udesly/ajax/register_password/strength_check_message', __( 'The password is invalid' ) ), 400 );
	}

	do_action('udesly/ajax/before_insert_user', $userdata );

	$user_id = wp_insert_user( $userdata );

	// Return
	if ( ! is_wp_error( $user_id ) ) {

		if (isset($_POST['meta_fields']) && is_array($_POST['meta_fields'])) {
			foreach ($_POST['meta_fields'] as $meta_key => $value) {
				$meta_key = sanitize_key($meta_key);
				$meta_value = sanitize_textarea_field($value);

				update_user_meta($user_id, $meta_key, $meta_value);
			}
		}

		$info                  = array();
		$info['user_login']    = $username;
		$info['user_password'] = $password;
		$info['remember']      = true;

		wp_signon( $info, apply_filters('udesly/params/use_secure_cookie', false, $info['user_login']) );

		do_action('udesly/ajax/registration_success', $user_id );

		wp_send_json_success();

	} else {
		wp_send_json_error( $user_id->get_error_message() , 400 );
	}
}

udesly_add_ajax_action('logout');

function udesly_ajax_logout() {
	udesly_check_ajax_security();
	wp_logout();
	wp_send_json_success();

}

udesly_add_ajax_action('lost_password');

function udesly_ajax_lost_password() {
	udesly_check_ajax_security();

	$user_login = sanitize_text_field( $_POST['user_login'] );

	$errors = new \WP_Error();

	if ( empty( $user_login ) ) {
		$errors->add( 'empty_username', __( 'Enter a username or e-mail address.' ) );
	} else if ( strpos( $user_login, '@' ) ) {
		$user_data = get_user_by( 'email', trim( $user_login ) );
		if ( empty( $user_data ) ) {
			$errors->add( 'invalid_email', apply_filters('udesly/ajax/lost_password/invalid_email_message', __( 'There is no user registered with that email address.' )) );
		}
	} else {
		$login     = trim( $user_login );
		$user_data = get_user_by( 'login', $login );
		if ( empty( $user_data ) ) {
			$errors->add( 'invalid_email', apply_filters('udesly/ajax/lost_password/invalid_email_message', __( 'There is no user registered with that email address.' )) );
		}
	}

	do_action( 'lostpassword_post', $errors );

	if ( $errors->get_error_code() ) {
		wp_send_json_error( array( 'error' => true, 'message' => $errors->get_error_message() ), 400 );
		wp_die();
	}

	if ( ! $user_data ) {
		$errors->add( 'invalidcombo', __( 'Invalid username or email.' ) );
		wp_send_json_error(  $errors->get_error_message() , 400 );
	}

	// Redefining user_login ensures we return the right case in the email.
	$user_login = $user_data->user_login;
	$user_email = $user_data->user_email;
	$key        = get_password_reset_key( $user_data );

	if ( is_wp_error( $key ) ) {
		wp_send_json_error( $key->get_error_message(), 400 );
	}

	$message = __( 'Someone requested that the password be reset for the following account:' ) . "\r\n\r\n";
	$message .= network_home_url( '/' ) . "\r\n\r\n";
	$message .= sprintf( __( 'Username: %s' ), $user_login ) . "\r\n\r\n";
	$message .= __( 'If this was a mistake, just ignore this email and nothing will happen.' ) . "\r\n\r\n";
	$message .= __( 'To reset your password, visit the following address:' ) . "\r\n\r\n";

	$message .= esc_url_raw( $_POST['_referrer'] . "?action=rp&key=$key&login=" . urlencode( $user_login ) ) . "\r\n";

	if ( is_multisite() ) {
		$blogname = $GLOBALS['current_site']->site_name;
	} else /*
			 * The blogname option is escaped with esc_html on the way into the database
			 * in sanitize_option we want to reverse this for the plain text arena of emails.
			 */ {
		$blogname = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
	}

	$title = sprintf( __( '%s - Password Reset' ), $blogname );
	$title = apply_filters( 'retrieve_password_title', $title, $user_login, $user_data );

	$message = apply_filters( 'retrieve_password_message', $message, $key, $user_login, $user_data );

	if ( wp_mail( $user_email, wp_specialchars_decode( $title ), $message ) ) {
		wp_send_json_success();

	} else {
		$errors->add( 'could_not_sent', __( 'The e-mail could not be sent.' ), 'message' );
	}


	// display error message
	if ( $errors->get_error_code() ) {
		wp_send_json_error( $errors->get_error_message(), 400 );
	}
}

udesly_add_ajax_action('reset_password');
/**
 * Ajax reset password
 */
function udesly_ajax_reset_password() {
	udesly_check_ajax_security();

	$pass1 	= sanitize_text_field($_POST['password']);
	$pass2 	= sanitize_text_field($_POST['password_repeat']);
	$key 	= sanitize_text_field($_POST['user_key']);
	$login 	= sanitize_text_field($_POST['user_login']);

	$user = check_password_reset_key( $key, $login );

	$errors = new \WP_Error();

	if (!$user || is_wp_error($user)) {
		$errors->add( 'expired_token', __( 'Password reset token is expired' ) );
	}

	// check to see if user added some string
	if( empty( $pass1 ) || empty( $pass2 ) )
		$errors->add( 'password_required', __( 'Password is required field' ) );

	// is pass1 and pass2 match?
	if ( isset( $pass1 ) && $pass1 != $pass2 )
		$errors->add( 'password_reset_mismatch', __( 'The passwords do not match.' ) );

	// is pass too short?
	if ( isset( $pass1 ) && $pass1 == $pass2 && strlen($pass1) < 6) {
		$errors->add( 'password_too_short', __( 'The passwords is too short, min. 6 characters.' ) );
	}

	do_action( 'validate_password_reset', $errors, $user );

	if ( !$errors->get_error_code() ) {
		reset_password($user, $pass1);
		wp_send_json_success();
	} else {
		wp_send_json_error( $errors->get_error_message(), 400 );
	}

}

udesly_add_ajax_action('edit_user');
function udesly_ajax_edit_user() {
	udesly_check_ajax_security();

	if (!is_user_logged_in()) {
		wp_send_json_error("You are not allowed to change this data", 403);
	}

	if (!isset($_POST['user'])) {
		wp_send_json_error("Form is not correctly configured", 400);
	}
	$user_id = get_current_user_id();
	foreach ($_POST['user'] as $key => $value) {
		$key = apply_filters('udesly/ajax/edit_user/key', sanitize_key($key));
		$value = apply_filters('udesly/ajax/edit_user/value', sanitize_textarea_field($value), $key);

		if (is_wp_error($value)) {
			wp_send_json_error(__($value->get_error_message(), 400));
		}
		if ($value) {
			update_user_meta($user_id, $key, $value);
		} else {
			delete_user_meta($user_id, $key);
		}
	}

	wp_send_json_success();
}

udesly_add_ajax_action('passwordless_login');
function udesly_ajax_passwordless_login() {
	udesly_check_ajax_security();

	if (!isset($_POST['email'])) {
		wp_send_json_error(__('Invalid Email!'), 400);
	}
	$email = sanitize_email($_POST['email']);

	if (!is_email($email)) {
		wp_send_json_error(__('Invalid Email!'), 400);
	}

	$uid = email_exists($email);
	if (!$uid) {
		wp_send_json_error(apply_filters('udesly/ajax/passwordless_login/no_user_message', __("No user with this email!")), 400);
	}

	$result = __udesly_send_login_email_for_user($uid, $email);

	if (is_wp_error($result)) {
		wp_send_json_error($result->get_error_message());
	}

	if (false === $result) {
		wp_send_json_error(__("Failed to send email!"));
	}

	wp_send_json_success();
}

udesly_add_ajax_action('passwordless_registration');
function udesly_ajax_passwordless_registration() {
	udesly_check_ajax_security();

	if (!get_option('users_can_register')) {
		wp_send_json_error(__( 'Sorry, registration is not currently allowed' ), 405);
	}

	if (!isset($_POST['email'])) {
		wp_send_json_error(__('Invalid Email!'), 400);
	}
	$email = sanitize_email($_POST['email']);

	if (!is_email($email)) {
		wp_send_json_error(__('Invalid Email!'), 400);
	}

	if (email_exists($email)) {
		wp_send_json_error(apply_filters('udesly/ajax/passwordless_registration/email_already_in_use_message', __('This email is already in use!')), 400);
	}

	$password = wp_generate_password(24, true);

	$uid = wp_create_user($email, $password, $email);
	if (is_wp_error($uid)) {
		wp_send_json_error($uid->get_error_message());
	}
	$result = __udesly_send_login_email_for_user($uid, $email, "Register");

	if (is_wp_error($result)) {
		wp_send_json_error($result->get_error_message());
	}

	if (false === $result) {
		wp_send_json_error(__("Failed to send email!"));
	}

	wp_send_json_success();
}


function __udesly_send_login_email_for_user( $uid, $email, $title = "Login" ) {
	$time = time();

	$last_attempt = (int) get_user_meta($uid, '_udesly_temp_token_last_attempt', true);

	$token_expiration_interval = apply_filters('udesly/params/token_expiration', 300);

	if ( $last_attempt > ($time - $token_expiration_interval)) {
		return new WP_Error("too_many_attempts", apply_filters("udesly/ajax/login/too_many_attempts",__("Try again later! Limit on email requests reached, try again in few minutes")));
	}

	// Salt
	$key = wp_generate_password(20, false);

	$token = wp_hash($time * rand(1, 10) . $key . $time, "secure_auth");

	$expiration = $time + $token_expiration_interval;

	$saved_token = wp_hash_password($token . $expiration);

	update_user_meta($uid, '_udesly_temp_token', $saved_token);
	update_user_meta($uid, '_udesly_temp_token_expiration', $expiration);
	update_user_meta($uid, '_udesly_temp_token_last_attempt', $time);

	$nonce = wp_create_nonce('udesly_passwordless_login');

	$args = [
		'uid' => $uid,
		'token' => $token,
		'nonce' => $nonce,
		'a' => "__u_p"
	];

	$login_url = add_query_arg($args, site_url());

	$site_name = get_bloginfo('name');

	$action = strtolower($title);

	$subject = apply_filters("udesly/ajax/$action/email_subject", "$title to [$site_name]");

	$message = apply_filters("udesly/ajax/$action/email_message", sprintf("Hello! $title at $site_name by visiting this url: <a href=\"%s\" target=\"_blank noreferrer noopener\">$title</a>", $login_url), $login_url);

	$headers = apply_filters("udesly/ajax/$action/email_headers", array('Content-Type: text/html; charset=UTF-8'));

	return wp_mail($email, $subject, $message, $headers);
}

add_action('wp', '__udesly_passwordless_check_auth_url');

function __udesly_passwordless_check_auth_url() {
	if (!isset($_GET['a']) || "__u_p" !== $_GET['a'] ) {
		return;
	}

	$uid = sanitize_key($_GET['uid']);
	$token = sanitize_key($_GET['token']);
	$nonce = sanitize_key($_GET['nonce']);

	$errors = new \WP_Error();

	if (!wp_verify_nonce($nonce, "udesly_passwordless_login")) {
		$errors->add("failed_nonce", "Failed nonce check");
	}

	if (!$uid || !$token) {
		$errors->add("missing_parameters", "Parameters missing");
	}

	$saved_token = get_user_meta($uid, '_udesly_temp_token', true);
	$expiration = get_user_meta($uid, '_udesly_temp_token_expiration', true);

	$time = time();

	if (!wp_check_password($token.$expiration, $saved_token)) {
		$errors->add("invalid_token", "Token is invalid or expired");
	}
	if ($time > $expiration) {
		$errors->remove("invalid_token");
		$errors->add("invalid_token", "Token is invalid or expired");
	}

	$error_codes = $errors->get_error_codes();

	if (!empty($error_codes)) {
		wp_die($errors);
	}

	wp_set_auth_cookie($uid, true, is_ssl());
	delete_user_meta($uid, "_udesly_temp_token");
	delete_user_meta($uid, "_udesly_temp_token_expiration");
	delete_user_meta($uid, "_udesly_temp_token_last_attempt");

	wp_redirect(site_url());
	exit;
}


udesly_add_ajax_action('edit_email');

function udesly_ajax_edit_email() {
	udesly_check_ajax_security();

	if (!isset($_POST['email']) || !is_email($_POST['email'])) {
		wp_send_json_error("Invalid Email");
	}
	if (!is_user_logged_in()) {
		wp_send_json_error("You can't change email");
	}

	$user = wp_get_current_user();

	$email = sanitize_email($_POST['email']);

	if ($user->user_email == $email) {
		wp_send_json_error("You can't use the same email");
	}

	if (email_exists($email)) {
		wp_send_json_error("Email already in use");
	}

	$res = __udesly_send_change_email_for_user($user->ID, $email);

	if (!$res) {
		wp_send_json_error("Failed to send email");
	} else {
		wp_send_json_success();
	}
}

function __udesly_send_change_email_for_user( $uid, $email ) {
	$time = time();

	$last_attempt = (int) get_user_meta($uid, '_udesly_temp_token_change_last_attempt', true);

	$token_expiration_interval = apply_filters('udesly/params/token_expiration', 300);

	if ( $last_attempt > ($time - $token_expiration_interval)) {
		return new WP_Error("too_many_attempts", apply_filters("udesly/ajax/login/too_many_attempts",__("Try again later! Limit on email requests reached, try again in few minutes")));
	}

	// Salt
	$key = wp_generate_password(20, false);

	$token = wp_hash($time * rand(1, 10) . $key . $time, "secure_auth");

	$expiration = $time + $token_expiration_interval;

	$saved_token = wp_hash_password($token . $expiration);

	update_user_meta($uid, '_udesly_temp_change_token', $saved_token);
	update_user_meta($uid, '_udesly_temp_change_token_expiration', $expiration);
	update_user_meta($uid, '_udesly_temp_change_token_last_attempt', $time);
	update_user_meta($uid, '_udesly_temp_change_token_email', $email);

	$nonce = wp_create_nonce('udesly_edit_email');

	$args = [
		'uid' => $uid,
		'token' => $token,
		'nonce' => $nonce,
		'a' => "__u_em"
	];

	$change_email_url = add_query_arg($args, site_url());

	$site_name = get_bloginfo('name');

	$subject = apply_filters("udesly/ajax/edit_email/email_subject", "Email change confirmation [$site_name]");

	$message = apply_filters("udesly/ajax/edit_email/email_message", sprintf("Hello! Confirm your email change at $site_name by visiting this url: <a href=\"%s\" target=\"_blank noreferrer noopener\">Confirm</a>", $change_email_url), $change_email_url);

	$headers = apply_filters("udesly/ajax/edit_email/email_headers", array('Content-Type: text/html; charset=UTF-8'));

	return wp_mail($email, $subject, $message, $headers);

}

add_action('wp', '__udesly_edit_email_check_auth_url');

function __udesly_edit_email_check_auth_url() {
	if (!isset($_GET['a']) || "__u_em" !== $_GET['a'] ) {
		return;
	}

	$uid = sanitize_key($_GET['uid']);
	$token = sanitize_key($_GET['token']);
	$nonce = sanitize_key($_GET['nonce']);

	$errors = new \WP_Error();

	if (!wp_verify_nonce($nonce, "udesly_edit_email")) {
		$errors->add("failed_nonce", "Failed nonce check");
	}

	if (!$uid || !$token) {
		$errors->add("missing_parameters", "Parameters missing");
	}

	$saved_token = get_user_meta($uid, '_udesly_temp_change_token', true);
	$expiration = get_user_meta($uid, '_udesly_temp_change_token_expiration', true);

	$time = time();

	if (!wp_check_password($token.$expiration, $saved_token)) {
		$errors->add("invalid_token", "Token is invalid or expired");
	}
	if ($time > $expiration) {
		$errors->remove("invalid_token");
		$errors->add("invalid_token", "Token is invalid or expired");
	}

	$error_codes = $errors->get_error_codes();

	if (!empty($error_codes)) {
		wp_die($errors);
	}

	$email = get_user_meta($uid, '_udesly_temp_change_token_email', true);

	wp_update_user([
		'ID' => $uid,
		'user_email' => $email
	]);

	delete_user_meta($uid, "_udesly_temp_change_token");
	delete_user_meta($uid, "_udesly_temp_change_token_expiration");
	delete_user_meta($uid, "_udesly_temp_change_token_last_attempt");
	delete_user_meta($uid, '_udesly_temp_change_token_email');

	wp_redirect(site_url());
	exit;
}