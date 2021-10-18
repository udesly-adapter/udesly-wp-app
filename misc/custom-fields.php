<?php

defined( 'ABSPATH' ) || exit;

/**
 *  Functions to define custom fields
 */
if ( ! function_exists( 'udesly_register_custom_fields_for_post_type' ) ) {


	function udesly_register_custom_fields_for_post_type( string $post_type, array $fields = [] ) {


		acf_add_local_field_group( [
			"key"      => "udesly_group_$post_type",
			"title"    => __( "Collection Fields" ),
			"fields"   => $fields,
			'location' => [
				[
					[
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => $post_type,
					],
				],
			],
		] );

	}

}

if ( ! function_exists( 'udesly_register_custom_fields_for_taxonomy' ) ) {


	function udesly_register_custom_fields_for_taxonomy( string $taxonomy, array $fields = [] ) {


		acf_add_local_field_group( [
			"key"      => "udesly_group_$taxonomy",
			"title"    => __( "Taxonomy Fields" ),
			"fields"   => $fields,
			"location" => [
				[
					[
						"param"    => "taxonomy",
						"operator" => "==",
						"value"    => $taxonomy
					]
				]
			]
		] );

		/*Container::make('term_meta', __('Collection Fields'))
		         ->where('term_taxonomy', '=', $taxonomy)
		         ->add_fields(
			         $fields
		         );*/
	}

}

if ( ! function_exists( 'udesly_register_custom_fields_for_user' ) ) {


	function udesly_register_custom_fields_for_user( array $fields = [] ) {


		acf_add_local_field_group( [
			"key"      => "udesly_group_users",
			"title"    => __( "User Fields" ),
			"fields"   => $fields,
			"location" => [
				[
					[
						'param'    => 'user_form',
						'operator' => '==',
						'value'    => 'all',
					]
				]
			]
		] );

	}

}

if ( ! function_exists( 'udesly_custom_field_generics' ) ) {

	function udesly_custom_field_generics( array $args, string $type ) {
		return array_merge( $args, [
			"key"  => "field_" . $args['name'],
			"type" => $type
		] );
	}
}

if ( ! function_exists( 'udesly_custom_field_checkbox' ) ) {

	function udesly_custom_field_checkbox( array $args ): array {

		return udesly_custom_field_generics( $args, "true_false" );

	}
}


if ( ! function_exists( 'udesly_custom_field_text' ) ) {

	function udesly_custom_field_text( array $args ): array {

		return udesly_custom_field_generics( $args, $args["type"] ?? "text" );
	}
}

if ( ! function_exists( 'udesly_custom_field_textarea' ) ) {

	function udesly_custom_field_textarea( array $args ) {

		$args = wp_parse_args( $args, [
			"rows" => 5
		] );

		return udesly_custom_field_generics( $args, "textarea" );

	}
}

if ( ! function_exists( 'udesly_custom_field_rich_text' ) ) {

	function udesly_custom_field_rich_text( array $args ): array {

		return udesly_custom_field_generics( $args, "wysiwyg" );

	}
}

if ( ! function_exists( 'udesly_custom_field_color' ) ) {

	function udesly_custom_field_color( array $args ): array {

		return udesly_custom_field_generics( $args, "color_picker" );

	}
}

if ( ! function_exists( 'udesly_custom_field_date' ) ) {

	function udesly_custom_field_date( array $args ): array {

		$args["display_format"] = "Y-m-d H:i:s";
		$args["return_format"]  = "Y-m-d H:i:s";
		$args["first_day"]      = 1;

		return udesly_custom_field_generics( $args, "date_time_picker" );
	}
}

if ( ! function_exists( 'udesly_custom_field_select' ) ) {

	function udesly_custom_field_select( array $args ): array {

		return udesly_custom_field_generics( $args, "select" );

	}
}

if ( ! function_exists( 'udesly_custom_field_image' ) ) {

	function udesly_custom_field_image( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "image" );

	}
}

if ( ! function_exists( 'udesly_custom_field_file' ) ) {

	function udesly_custom_field_file( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "file" );

	}
}

if ( ! function_exists( 'udesly_custom_field_video' ) ) {

	function udesly_custom_field_video( array $args ): array {

		return udesly_custom_field_generics( $args, "oembed" );

	}
}

if ( ! function_exists( 'udesly_custom_field_post_relation' ) ) {

	function udesly_custom_field_post_relation( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "post_object" );
	}

}

if ( ! function_exists( 'udesly_custom_field_term_relation' ) ) {

	function udesly_custom_field_term_relation( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "taxonomy" );
	}

}

if ( ! function_exists( 'udesly_custom_field_user_relation' ) ) {

	function udesly_custom_field_user_relation( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "user" );
	}

}

if ( ! function_exists( 'udesly_custom_field_set' ) ) {

	function udesly_custom_field_set( array $args ): array {

		$args = wp_parse_args( $args, [
			'instructions' => '',
			'max' => 0,
			'min' => 0,
			'layout' => 'table',
			'sub_fields' => array(
				array(
					'key' => 'field_image',
					'label' => 'Image',
					'name' => 'image',
					'type' => 'image',
					'return_format' => 'id',
					'library' => 'all',
				),
			),
		] );

		return udesly_custom_field_generics( $args, "set" );
	}

}

if (!function_exists( '__udesly_prepare_field')) {

	function __udesly_prepare_field( string $field_type, $field_value )  {
		switch ($field_type) {
			case "image":
			case "ImageRef":
				return udesly_get_image([
					"id" => $field_value
				]);
			case "Set":
				$results = [];
				while(have_rows($field_value['slug'], $field_value['id'])) {
					$result = [];
					the_row();
					$loop = acf_get_loop('active');

					foreach ($loop['field']['sub_fields'] as $sub_field) {
						$result[$sub_field['name']] = __udesly_prepare_field($sub_field['type'], get_sub_field($sub_field['name']));
					}
					$results[] = $result;
				}
				return $results;
            case "RichText":
                $autop = apply_filters('udesly/params/autop', true);
                if ($autop) {
                    return wpautop(do_shortcode($field_value));
                }
                return do_shortcode($field_value);
            case "PlainText":
                $autop = apply_filters('udesly/params/autop_plain', false);
                if ($autop) {
                    return wpautop(do_shortcode($field_value));
                }
                return do_shortcode($field_value);
			default:
				return $field_value;
		}
	}

}

if (!function_exists('udesly_check_cache')) {

	function udesly_check_cache( $key ) {
		return wp_cache_get($key, 'udesly_cache');
	}
}

if (!function_exists('udesly_set_cache')) {

	function udesly_set_cache ($key, $value) {
		return wp_cache_set($key, $value, 'udesly_cache');
	}
}

if (!function_exists('__udesly_get_field')) {

	function __udesly_get_field($id, $slug, $field_type, $object_prefix = "") {

		if ($object_prefix !== "") {
			$id = $object_prefix . $id;
		}

		$key = $id . $slug . $field_type;

		$cache = udesly_check_cache( $key );
		if ($cache){
			return $cache;
		}

		if ($field_type === "Set") {
			$field = [ "slug" => $slug, "id" => $id ];

		} else {
			$field = get_field( $slug, $id, false );
		}

		$value = __udesly_prepare_field( $field_type, $field );

		udesly_set_cache($key, $value);

		return $value;

	}

}

if (!function_exists('udesly_get_custom_author_field')) {

	function udesly_get_custom_author_field($author_id, string $slug, string $field_type) {

		return __udesly_get_field($author_id, $slug, $field_type, "user_");
	}

}

if (!function_exists('udesly_get_custom_post_field')) {

	function udesly_get_custom_post_field($post_id, string $slug, string $field_type) {
		return __udesly_get_field($post_id, $slug, $field_type);
	}
}

if (!function_exists('udesly_get_custom_term_field')) {

	function udesly_get_custom_term_field($term_id, string $slug, string $field_type) {
		return __udesly_get_field($term_id, $slug, $field_type, "term_");
	}

}

add_filter('acf/location/rule_values/post_type', 'udesly_acf_location_rule_values_post');
function udesly_acf_location_rule_values_post( $choices ) {
	$choices['product_variation'] = 'Product Variation';
	return $choices;
}



$GLOBALS['wc_loop_variation_id'] = null;

function is_field_group_for_variation($field_group, $variation_data, $variation_post) {
	return (preg_match( '/Variation/i', $field_group['title'] ) == true);
}

add_action( 'woocommerce_product_after_variable_attributes', function( $loop_index, $variation_data, $variation_post ) {
	$GLOBALS['wc_loop_variation_id'] = $variation_post->ID;

	foreach ( acf_get_field_groups() as $field_group ) {
		if ( is_field_group_for_variation( $field_group, $variation_data, $variation_post ) ) {
			acf_render_fields( $variation_post->ID, acf_get_fields( $field_group ) );
		}
	}

	$GLOBALS['wc_loop_variation_id'] = null;
}, 10, 3 );

add_action( 'woocommerce_save_product_variation', function( $variation_id, $i ) {
	if ( !isset( $_POST['acf_variation'][$variation_id] ) ) {
		return;
	}

	if (is_array( ( $fields = $_POST['acf_variation'][ $variation_id ] ) ) )  {
		foreach ( $fields as $key => $val ) {
			update_field( $key, $val, $variation_id );
		}
	}
}, 10, 2 );

add_filter( 'acf/prepare_field', function ( $field ) {
	if ( !$GLOBALS['wc_loop_variation_id'] ) {
		return $field;
	}

	$field['name'] = preg_replace( '/^acf\[/', 'acf_variation[' . $GLOBALS['wc_loop_variation_id'] . '][', $field['name'] );

	return $field;
}, 10, 1);


add_action("acf/init", function () {
	if ( function_exists( 'acf_add_local_field_group' ) ):

		acf_add_local_field_group( array(
			'key'                   => 'group_607965fe198b0',
			'title'                 => 'Variations',
			'fields'                => array(
				array(
					'key'               => 'field_60796608be0e2',
					'label'             => 'More Images',
					'name'              => 'more-images',
					'type'              => 'set',
					'instructions'      => '',
					'required'          => 0,
					'conditional_logic' => 0,
					'wrapper'           => array(
						'width' => '',
						'class' => '',
						'id'    => '',
					),
					'collapsed'         => '',
					'min'               => 0,
					'max'               => 0,
					'layout'            => 'table',
					'button_label'      => '',
					'sub_fields'        => array(
						array(
							'key'               => 'field_6079661ebe0e3',
							'label'             => 'Image',
							'name'              => 'image',
							'type'              => 'image',
							'instructions'      => '',
							'required'          => 0,
							'conditional_logic' => 0,
							'wrapper'           => array(
								'width' => '',
								'class' => '',
								'id'    => '',
							),
							'return_format'     => 'id',
							'preview_size'      => 'medium',
							'library'           => 'all',
							'min_width'         => '',
							'min_height'        => '',
							'min_size'          => '',
							'max_width'         => '',
							'max_height'        => '',
							'max_size'          => '',
							'mime_types'        => '',
						),
					),
				),
			),
			'location'              => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'product_variation',
					),
				),
			),
			'menu_order'            => 0,
			'position'              => 'normal',
			'style'                 => 'default',
			'label_placement'       => 'top',
			'instruction_placement' => 'label',
			'hide_on_screen'        => '',
			'active'                => true,
			'description'           => '',
		) );

		acf_add_local_field_group(array(
			'key' => 'group_609e5077be3f1',
			'title' => 'Menu items',
			'fields' => array(
				array(
					'key' => 'field_609e507ce7531',
					'label' => 'Subtitle',
					'name' => 'subtitle',
					'type' => 'text',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
				array(
					'key' => 'field_609e5106e7532',
					'label' => 'Image',
					'name' => 'image',
					'type' => 'image',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'return_format' => 'id',
					'preview_size' => 'medium',
					'library' => 'all',
					'min_width' => '',
					'min_height' => '',
					'min_size' => '',
					'max_width' => '',
					'max_height' => '',
					'max_size' => '',
					'mime_types' => '',
				),
			),
			'location' => array(
				array(
					array(
						'param' => 'nav_menu_item',
						'operator' => '==',
						'value' => 'all',
					),
				),
			),
			'menu_order' => 0,
			'position' => 'normal',
			'style' => 'default',
			'label_placement' => 'top',
			'instruction_placement' => 'label',
			'hide_on_screen' => '',
			'active' => true,
			'description' => '',
		));

	endif;

});


