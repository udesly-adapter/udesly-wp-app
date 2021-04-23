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


function udesly_render_wc_add_to_cart_data() {

	global $product;

	if ($product->is_type('simple')) {

	} else {

	}

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
	$variations_attr = function_exists( 'wc_esc_json' ) ? wc_esc_json( $variations_json ) : _wp_specialchars( $variations_json, ENT_QUOTES, 'UTF-8', true );
}