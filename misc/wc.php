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