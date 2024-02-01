<?php


if (!defined('ABSPATH')) {
	exit;
}

udesly_add_ajax_action('sample');
function udesly_ajax_sample() {
	wp_send_json_error(__('Contact Forms are not available in Free mode'));
}

udesly_add_ajax_action('contact');

function udesly_ajax_contact() {
	udesly_check_ajax_security();

	if (!isset($_POST['contact'])) {
		wp_send_json_error("Form is not correctly configured", 400);
    }

	
	$form_data = [];

	$message = __( 'Someone sent a message from ' )  . get_bloginfo( 'name' ) .  __( ':' ) . "\r\n\r\n";

	foreach ($_POST['contact'] as $key => $value) {
	    $key = sanitize_key($key);
		if(is_array($value)) {
			$value = array_filter($value);
            $value = sanitize_textarea_field(join($value, ","));
		} else {
			$value = sanitize_textarea_field($value);
		}
	    
	    $form_data[$key] = $value;

	    $message .= ucfirst($key) . ": " . $value . "\r\n";
    }

	$referrer = isset($_POST['_referrer']) ? sanitize_text_field($_POST['_referrer']) : "/";
	$form_data['_referrer'] = $referrer;

	$contact_options = apply_filters('udesly/params/contact_form_options', udesly_get_contact_forms_options(), $form_data);

	do_action('udesly/ajax/contact/before_form_sent', $form_data);

	switch($contact_options['on_send_form']) {
        case "only_save":
            __udesly_save_form_data($form_data);
            break;
        case "only_send":
	        __udesly_send_form_data($message, $form_data, $contact_options);
	        break;
        default:
		    __udesly_save_form_data($form_data);
	        __udesly_send_form_data($message, $form_data, $contact_options, true);
    }

	do_action('udesly/ajax/contact/after_form_sent', $form_data);

	wp_send_json_success();
}

function __udesly_save_form_data($form_data) {

    $post_content = maybe_serialize($form_data);
    switch (true) {
        case isset($form_data['email']):
            $post_title = __("New request from") . " " . $form_data['email'];
            break;
	    case isset($form_data['name']):
		    $post_title = __("New request from") . " " . $form_data['name'];
	        break;
        default:
            $first = reset($form_data);
            $post_title = $first ? __("New request from") . " " . $first : "New Message";
    }

    $post_data = [
       'post_title' => $post_title,
       'post_type' =>  'udesly_contact_forms',
       'post_content' => $post_content,
       'post_status' => 'publish'
    ];

    $res = wp_insert_post($post_data, true, false);
    if (is_wp_error($res)) {
        wp_send_json_error($res->get_error_message());
    }
}

function __udesly_send_form_data($message, $form_data, $settings, $silent_fail = false) {
	$to = apply_filters('udesly/ajax/contact/mail_to', $settings["email_to"], $form_data);

	$ccs = apply_filters('udesly/ajax/contact/mail_ccs', array(), $form_data);

	$subject = apply_filters('udesly/ajax/contact/mail_subject', $settings["email_subject"], $form_data);

	$message = apply_filters('udesly/ajax/contact/mail_message', $message, $form_data);

	$headers = array();

	if(count($ccs) > 0 ){
		$headers[] = 'From: ' . get_bloginfo( "admin_email" );

		foreach ($ccs as $email_cc) {
			$email_cc = trim($email_cc);
			$headers[] = 'Cc: ' . $email_cc;
		}
	}

	if (isset($form_data['email'])) {
	    $email = $form_data['email'];
        $name = isset($form_data['name']) ? $form_data['name'] : $email;

        $headers[] = "Reply-To: $name <$email>";
    }

	$headers = apply_filters('udesly/ajax/contact/headers', $headers, $form_data);

	if ( !wp_mail( $to, $subject, $message, $headers ) ) {
		if(!$silent_fail) {
		    wp_send_json_error( __("Server couldn't send email") , 500 );
		}
    }

}

add_action('init', 'udesly_contact_forms_init');

function udesly_contact_forms_init() {
	udesly_define_post_type('udesly_contact_forms',  [
		'labels' => [
			'name' => __('Contact Forms'),
			'singular_name' => __('Contact Form'),
		],
		'public' => true,
		'exclude_from_search' => true,
		'has_archive' => false,
		'show_in_rest' => false,
		'supports' => ['title'],
		'show_in_admin_bar'   => true,
		'show_in_nav_menus'   => false,
		'publicly_queryable'  => false,
		'query_var'           => false,
		'menu_icon' => 'dashicons-email',
		'capability_type' => 'post',
		'capabilities' => array(
			'create_posts' => false, // Removes support for the "Add New" function ( use 'do_not_allow' instead of false for multisite set ups )
		),
		'map_meta_cap' => true,
        'register_meta_box_cb' => function() {
	        add_meta_box(
		        'udesly_contact_forms_metabox',
		        'Form data',
		        function () {
		            global $post;
					
					if (is_serialized($post->post_content)) {
						$data = maybe_unserialize($post->post_content);
					} else {
						$data = json_decode($post->post_content);
					}
					
			        

			        echo "<ul>";
			        foreach ($data as $key => $value) {
			            echo "<li><strong>$key</strong>: $value</li>";
                    }
			        echo "</ul>";

			        if (isset($data->email)) {

			            echo "<a href='mailto:". $data->email . "'>" . __('Reply') . '</a>';
                    }
		        },
		        'udesly_contact_forms',
		        'normal',
		        'default'
	        );
        }
	]);
}


function udesly_get_contact_forms_options() {
	return wp_parse_args(get_option('udesly_contact_forms_settings'), [
		'on_send_form' => 'both',
		'email_to' => get_bloginfo('admin_email'),
		'email_subject' => __( "New message from " ) . get_bloginfo( 'name' )
	]);
}

if (is_admin()) {

	function __udesly_contact_forms_options() {
		echo '<div class="wrap">';

		printf( '<h1>%s</h1>', __('Forms Options', 'rushhour' ) );

		echo '<form method="post" action="options.php">';

		settings_fields( 'udesly_contact_forms_settings' );

		do_settings_sections( 'udesly_contact_forms_settings_page' );

		submit_button();

		echo '</form></div>';
	}

	add_action('admin_menu', function() {
		add_submenu_page(
			'edit.php?post_type=udesly_contact_forms',
			__('Settings'),
			__('Settings'),
			'manage_options',
			'udesly_contact_forms_archive',
			'__udesly_contact_forms_options'
		);
	});

	add_action('admin_init', function() {

		$options = udesly_get_contact_forms_options();

		register_setting('udesly_contact_forms_settings', "udesly_contact_forms_settings");

		add_settings_section(
			'udesly_contact_forms_section', // ID
			__('Settings'), // Title
			function() {
				_e("Contact form settings");
			}, // Callback
			'udesly_contact_forms_settings_page' // Page
		);

		add_settings_field(
			'on_send_form', // ID
			__('On form sent action'), // Title
			function() use ($options) {
				$selected = $options['on_send_form'];
				?>
				<select id="on_send_form" name="udesly_contact_forms_settings[on_send_form]" />
					<option value="both" <?php echo $selected == "both" ? "selected" : ""; ?>><?php _e('Save form and send email'); ?></option>
					<option value="only_save" <?php echo $selected == "only_save" ? "selected" : ""; ?>><?php _e('Save form data'); ?></option>
					<option value="only_send" <?php echo $selected == "only_send" ? "selected" : ""; ?>><?php _e('Send email'); ?></option>
				</select>
				<?php
			},
			 // Callback
			'udesly_contact_forms_settings_page', // Page
			'udesly_contact_forms_section' // Section
		);

		add_settings_field(
			'email_to', // ID
			__('Email to'), // Title
			function() use ($options) {

				$value = $options['email_to'];
				?>
				<input type="email" name="udesly_contact_forms_settings[email_to]" value="<?php echo $value; ?>">
				<?php
			},
			// Callback
			'udesly_contact_forms_settings_page', // Page
			'udesly_contact_forms_section' // Section
		);

		add_settings_field(
			'email_subject', // ID
			__('Email subject'), // Title
			function() use ($options) {
				$value = $options['email_subject'];
				?>
				<input type="text" name="udesly_contact_forms_settings[email_subject]" value="<?php echo $value; ?>">
				<?php
			},
			// Callback
			'udesly_contact_forms_settings_page', // Page
			'udesly_contact_forms_section' // Section
		);

	});
}