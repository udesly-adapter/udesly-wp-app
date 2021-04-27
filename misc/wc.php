<?php

// Misc functions for WooCoomerce

if (!function_exists('udesly_get_wc_image')) {


	function udesly_get_wc_image() {
		$image = udesly_get_image();

		if (!$image->id) {
			return (object) [
				"id" => "",
				"sizes" => "",
				"src" => wc_placeholder_img_src(),
				"srcset" => "",
				"alt" => "product image placeholder"
			];
		}

		return $image;
	}

}

if (!function_exists('udesly_get_price')) {


	function udesly_get_price() {
		global $product, $variant;

		if (!$variant) {
			$variant = $product;
		}

		return wc_price($variant->get_price());
	}

}

if (!function_exists('udesly_get_compare_at_price')) {

	function udesly_get_compare_at_price() {
		global $product, $variant;

		if (!$variant) {
			$variant = $product;
		}

		if ($variant->is_on_sale()) {
			return wc_price($variant->get_regular_price());
		}
	}
}

if (!function_exists('udesly_get_wc_product_default_variant')) {

	function udesly_get_wc_product_default_variant() {
		global $product;

		if( $product->is_type('variable') ){
			$default_attributes = $product->get_default_attributes();
			foreach($product->get_available_variations() as $variation_values ){
				foreach($variation_values['attributes'] as $key => $attribute_value ){
					$attribute_name = str_replace( 'attribute_', '', $key );
					$default_value = $product->get_variation_default_attribute($attribute_name);
					if( $default_value == $attribute_value ){
						$is_default_variation = true;
					} else {
						$is_default_variation = false;
						break; // Stop this loop to start next main lopp
					}
				}
				if( $is_default_variation ){
					$variation_id = $variation_values['variation_id'];
					break; // Stop the main loop
				}
			}

			// Now we get the default variation data
			if( $is_default_variation ){
				// Raw output of available "default" variation details data

				return wc_get_product($variation_id);

			}
		}
		return $product;
	}
}

if (!function_exists('udesly_wc_checkout')) {

	function udesly_wc_checkout() {
		global $wp;

		// Check cart class is loaded or abort.
		if ( is_null( WC()->cart ) ) {
			return;
		}

		// Backwards compatibility with old pay and thanks link arguments.
		if ( isset( $_GET['order'] ) && isset( $_GET['key'] ) ) { // WPCS: input var ok, CSRF ok.
			wc_deprecated_argument( __CLASS__ . '->' . __FUNCTION__, '2.1', '"order" is no longer used to pass an order ID. Use the order-pay or order-received endpoint instead.' );

			// Get the order to work out what we are showing.
			$order_id = absint( $_GET['order'] ); // WPCS: input var ok.
			$order    = wc_get_order( $order_id );

			if ( $order && $order->has_status( 'pending' ) ) {
				$wp->query_vars['order-pay'] = absint( $_GET['order'] ); // WPCS: input var ok.
			} else {
				$wp->query_vars['order-received'] = absint( $_GET['order'] ); // WPCS: input var ok.
			}
		}

		// Handle checkout actions.
		if ( ! empty( $wp->query_vars['order-pay'] ) ) {

			udesly_wc_order_pay( $wp->query_vars['order-pay'] );

		} elseif ( isset( $wp->query_vars['order-received'] ) ) {

			udesly_wc_order_received( $wp->query_vars['order-received'] );

		} else {

			udesly_wc_show_checkout();

		}
	}
}


function udesly_wc_order_received( $order_id ) {
	global $wp;


}


function udesly_wc_show_checkout( ) {

}

function udesly_wc_order_pay( $order_id ) {

}


function udesly_render_wc_add_to_cart() {
	if (is_single('product')) {
		woocommerce_template_single_add_to_cart();
	} else {
		woocommerce_template_loop_add_to_cart();
	}
}

function udesly_wc_get_quantity_input_min( $product ) {
	return sprintf('min="%d"', apply_filters( 'woocommerce_quantity_input_min', $product->get_min_purchase_quantity(), $product ));
}

function udesly_wc_get_quantity_input_max( $product ) {
	$max = apply_filters( 'woocommerce_quantity_input_max', $product->get_max_purchase_quantity(), $product );
	if ($max > 0) {
		return sprintf('max="%d"', $max);
	}
	return "";
}

function udesly_wc_get_quantity_input_value( $product ) {
	return isset( $_POST['quantity'] ) ? wc_stock_amount( wp_unslash( $_POST['quantity'] ) ) : $product->get_min_purchase_quantity();
}

function udesly_wc_get_variable_product_data() {
	global $product;

	$variation_data = [];

	$get_variations = count( $product->get_children() ) <= apply_filters( 'woocommerce_ajax_variation_threshold', 30, $product );

	$variation_data = [
		'available_variations' => $get_variations ? $product->get_available_variations() : false,
		'attributes'           => $product->get_variation_attributes(),
		'selected_attributes'  => $product->get_default_attributes(),
	];

	$variation_data['attribute_keys'] = array_keys($variation_data['attributes']);

	$variations_json = wp_json_encode( $variation_data['available_variations'] );
	$variation_data['variations_attr'] = function_exists( 'wc_esc_json' ) ? wc_esc_json( $variations_json ) : _wp_specialchars( $variations_json, ENT_QUOTES, 'UTF-8', true );


	return $variation_data;
}

function udesly_wc_attribute_variations_select( $args = array() ) {
	$args = wp_parse_args(
		apply_filters( 'woocommerce_dropdown_variation_attribute_options_args', $args ),
		array(
			'options'          => false,
			'attribute'        => false,
			'product'          => false,
			'selected'         => false,
			'name'             => '',
			'id'               => '',
			'class'            => '',
			'hidden'           => false,
			'show_option_none' => __( 'Choose an option', 'woocommerce' ),
		)
	);

	// Get selected value.
	if ( false === $args['selected'] && $args['attribute'] && $args['product'] instanceof WC_Product ) {
		$selected_key = 'attribute_' . sanitize_title( $args['attribute'] );
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		$args['selected'] = isset( $_REQUEST[ $selected_key ] ) ? wc_clean( wp_unslash( $_REQUEST[ $selected_key ] ) ) : $args['product']->get_variation_default_attribute( $args['attribute'] );
		// phpcs:enable WordPress.Security.NonceVerification.Recommended
	}

	$options               = $args['options'];
	$product               = $args['product'];
	$attribute             = $args['attribute'];
	$name                  = $args['name'] ? $args['name'] : 'attribute_' . sanitize_title( $attribute );
	$id                    = $args['id'] ? $args['id'] : sanitize_title( $attribute );
	$class                 = $args['class'];
	$show_option_none      = (bool) $args['show_option_none'];
	$show_option_none_text = $args['show_option_none'] ? $args['show_option_none'] : __( 'Choose an option', 'woocommerce' ); // We'll do our best to hide the placeholder, but we'll need to show something when resetting options.

	if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
		$attributes = $product->get_variation_attributes();
		$options    = $attributes[ $attribute ];
	}

	$hidden = $args['hidden'] ? 'style="display: none;"' : "";

	$html  = '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" '. $hidden . ' name="' . esc_attr( $name ) . '" data-attribute_name="attribute_' . esc_attr( sanitize_title( $attribute ) ) . '" data-show_option_none="' . ( $show_option_none ? 'yes' : 'no' ) . '">';
	$html .= '<option value="">' . esc_html( $show_option_none_text ) . '</option>';

	$return = [];

	if ( ! empty( $options ) ) {
		if ( $product && taxonomy_exists( $attribute ) ) {
			// Get terms if this is a taxonomy - ordered. We need the names too.
			$terms = wc_get_product_terms(
				$product->get_id(),
				$attribute,
				array(
					'fields' => 'all',
				)
			);

			foreach ( $terms as $term ) {
				if ( in_array( $term->slug, $options, true ) ) {
					$return[] = (object) [
						'slug' => $term->slug,
						'name' => esc_html( apply_filters( 'woocommerce_variation_option_name', $term->name, $term, $attribute, $product ) ) ,
						'selected' => selected( sanitize_title( $args['selected'] ), $term->slug, false )
					];
					$html .= '<option value="' . esc_attr( $term->slug ) . '" ' . selected( sanitize_title( $args['selected'] ), $term->slug, false ) . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $term->name, $term, $attribute, $product ) ) . '</option>';
				}
			}
		} else {
			foreach ( $options as $option ) {
				$return[] = (object) [
					'slug' => esc_attr( $option ),
					'name' => esc_html( apply_filters( 'woocommerce_variation_option_name', $option, null, $attribute, $product ) ),
					'selected' => sanitize_title( $args['selected'] ) === $args['selected'] ? selected( $args['selected'], sanitize_title( $option ), false ) : selected( $args['selected'], $option, false ),
				];
				// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
				$selected = sanitize_title( $args['selected'] ) === $args['selected'] ? selected( $args['selected'], sanitize_title( $option ), false ) : selected( $args['selected'], $option, false );
				$html    .= '<option value="' . esc_attr( $option ) . '" ' . $selected . '>' . esc_html( apply_filters( 'woocommerce_variation_option_name', $option, null, $attribute, $product ) ) . '</option>';
			}
		}
	}

	$html .= '</select>';

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo apply_filters( 'woocommerce_dropdown_variation_attribute_options_html', $html, $args );

	return $return;
}