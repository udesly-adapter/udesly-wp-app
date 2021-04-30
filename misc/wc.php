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

if (!function_exists('udesly_format_price')) {

	function udesly_format_price($price) {
		$price = (float) $price;
		if($price > 0) {
			return wc_price($price);
		}
		return "";
	}
}

if (!function_exists('udesly_get_price')) {


	function udesly_get_price() {
		global $product, $variant;

		if (!$variant) {
			$variant = $product;
		}

		return udesly_format_price($variant->get_price());
	}

}

if (!function_exists('udesly_get_compare_at_price')) {

	function udesly_get_compare_at_price() {
		global $product, $variant;

		if (!$variant) {
			$variant = $product;
		}

		if ($variant->is_on_sale()) {
			return udesly_format_price($variant->get_regular_price());
		}

		return "";
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

		define('UDESLY_CHECKOUT', true);

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
	$order = false;

	// Get the order.
	$order_id  = apply_filters( 'woocommerce_thankyou_order_id', absint( $order_id ) );
	$order_key = apply_filters( 'woocommerce_thankyou_order_key', empty( $_GET['key'] ) ? '' : wc_clean( wp_unslash( $_GET['key'] ) ) ); // WPCS: input var ok, CSRF ok.

	if ( $order_id > 0 ) {
		$order = wc_get_order( $order_id );
		if ( ! $order || ! hash_equals( $order->get_order_key(), $order_key ) ) {
			$order = false;
		}
	}

	// Empty awaiting payment session.
	unset( WC()->session->order_awaiting_payment );

	// In case order is created from admin, but paid by the actual customer, store the ip address of the payer
	// when they visit the payment confirmation page.
	if ( $order && $order->is_created_via( 'admin' ) ) {
		$order->set_customer_ip_address( WC_Geolocation::get_ip_address() );
		$order->save();
	}

	// Empty current cart.
	wc_empty_cart();

	wc_get_template( 'checkout/thankyou.php', array( 'order' => $order ) );
}

function udesly_wc_get_order_review_extra_items() {

	$extra_items = [];

	foreach (WC()->cart->get_coupons() as $code => $coupon) {
		ob_start();
		wc_cart_totals_coupon_html($coupon);
		$price = ob_get_clean();
		$extra_items[] = (object) [
			'name' => wc_cart_totals_coupon_label($coupon, false),
			'description' => '',
			'price' => $price
		];
	}

	foreach ( WC()->cart->get_fees() as $fee ) {
		ob_start();
		wc_cart_totals_fee_html($fee);
		$price = ob_get_clean();
		$extra_items[] = (object) [
			'name' => $fee->name,
			'description' => '',
			'price' => $price
		];
	}

	if ( wc_tax_enabled() && ! WC()->cart->display_prices_including_tax()) {
		if ( 'itemized' === get_option( 'woocommerce_tax_total_display' )) {
			foreach ( WC()->cart->get_tax_totals() as $code => $tax ) {
				$extra_items[] = (object) [
					'name' => $tax->label,
					'description' => '',
					'price' => $tax->formatted_amount
				];
			}
		} else {
			ob_start();
			wc_cart_totals_taxes_total_html();
			$price = ob_get_clean();
			$extra_items[] = (object) [
				'name' => WC()->countries->tax_or_vat(),
				'description' => '',
				'price' => $price
			];
		}
	}

	return $extra_items;
}

function udesly_wc_show_checkout( ) {
// Show non-cart errors.
	do_action( 'woocommerce_before_checkout_form_cart_notices' );

	remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 );
	remove_action('woocommerce_checkout_order_review', 'woocommerce_checkout_payment', 20);

	// Check cart has contents.
	if ( WC()->cart->is_empty() && ! is_customize_preview() && apply_filters( 'woocommerce_checkout_redirect_empty_cart', true ) ) {
		return;
	}

	// Check cart contents for errors.
	do_action( 'woocommerce_check_cart_items' );

	// Calc totals.
	WC()->cart->calculate_totals();

	// Get checkout object.
	$checkout = WC()->checkout();

	if ( empty( $_POST ) && wc_notice_count( 'error' ) > 0 ) { // WPCS: input var ok, CSRF ok.

		$errors = wc_get_notices('error');

		try {
			$error = $errors[0]['message'];
		} catch (\Exception $e) {
			$error = "";
		}
		if (empty($error)) {
			$error =  __('There are some issues with the items in your cart. Please go back to the cart page and resolve these issues before checking out.', 'woocommerce' );
		}
		wc_get_template( 'checkout/cart-errors.php', array( 'error' => $error  ) );
		wc_clear_notices();

	} else {

		$non_js_checkout = ! empty( $_POST['woocommerce_checkout_update_totals'] ); // WPCS: input var ok, CSRF ok.

		if ( wc_notice_count( 'error' ) === 0 && $non_js_checkout ) {
			wc_add_notice( __( 'The order totals have been updated. Please confirm your order by pressing the "Place order" button at the bottom of the page.', 'woocommerce' ) );
		}

		if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
			$error = esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
			wc_get_template( 'checkout/cart-errors.php', array( 'error' => $error  ) );
			return;
		}

		wc_get_template( 'checkout/form-checkout.php', array( 'checkout' => $checkout ) );
	}
}

function udesly_wc_order_pay( $order_id ) {

	do_action( 'before_woocommerce_pay' );

	$order_id = absint( $order_id );

	// Pay for existing order.
	if ( isset( $_GET['pay_for_order'], $_GET['key'] ) && $order_id ) { // WPCS: input var ok, CSRF ok.
		try {
			$order_key = isset( $_GET['key'] ) ? wc_clean( wp_unslash( $_GET['key'] ) ) : ''; // WPCS: input var ok, CSRF ok.
			$order     = wc_get_order( $order_id );

			// Order or payment link is invalid.
			if ( ! $order || $order->get_id() !== $order_id || ! hash_equals( $order->get_order_key(), $order_key ) ) {
				throw new Exception( __( 'Sorry, this order is invalid and cannot be paid for.', 'woocommerce' ) );
			}

			// Logged out customer does not have permission to pay for this order.
			if ( ! current_user_can( 'pay_for_order', $order_id ) && ! is_user_logged_in() ) {
				echo '<div class="woocommerce-info">' . esc_html__( 'Please log in to your account below to continue to the payment form.', 'woocommerce' ) . '</div>';
				woocommerce_login_form(
					array(
						'redirect' => $order->get_checkout_payment_url(),
					)
				);
				return;
			}

			// Add notice if logged in customer is trying to pay for guest order.
			if ( ! $order->get_user_id() && is_user_logged_in() ) {
				// If order has does not have same billing email then current logged in user then show warning.
				if ( $order->get_billing_email() !== wp_get_current_user()->user_email ) {
					wc_print_notice( __( 'You are paying for a guest order. Please continue with payment only if you recognize this order.', 'woocommerce' ), 'error' );
				}
			}

			// Logged in customer trying to pay for someone else's order.
			if ( ! current_user_can( 'pay_for_order', $order_id ) ) {
				throw new Exception( __( 'This order cannot be paid for. Please contact us if you need assistance.', 'woocommerce' ) );
			}

			// Does not need payment.
			if ( ! $order->needs_payment() ) {
				/* translators: %s: order status */
				throw new Exception( sprintf( __( 'This order&rsquo;s status is &ldquo;%s&rdquo;&mdash;it cannot be paid for. Please contact us if you need assistance.', 'woocommerce' ), wc_get_order_status_name( $order->get_status() ) ) );
			}

			// Ensure order items are still stocked if paying for a failed order. Pending orders do not need this check because stock is held.
			if ( ! $order->has_status( wc_get_is_pending_statuses() ) ) {
				$quantities = array();

				foreach ( $order->get_items() as $item_key => $item ) {
					if ( $item && is_callable( array( $item, 'get_product' ) ) ) {
						$product = $item->get_product();

						if ( ! $product ) {
							continue;
						}

						$quantities[ $product->get_stock_managed_by_id() ] = isset( $quantities[ $product->get_stock_managed_by_id() ] ) ? $quantities[ $product->get_stock_managed_by_id() ] + $item->get_quantity() : $item->get_quantity();
					}
				}

				foreach ( $order->get_items() as $item_key => $item ) {
					if ( $item && is_callable( array( $item, 'get_product' ) ) ) {
						$product = $item->get_product();

						if ( ! $product ) {
							continue;
						}

						if ( ! apply_filters( 'woocommerce_pay_order_product_in_stock', $product->is_in_stock(), $product, $order ) ) {
							/* translators: %s: product name */
							throw new Exception( sprintf( __( 'Sorry, "%s" is no longer in stock so this order cannot be paid for. We apologize for any inconvenience caused.', 'woocommerce' ), $product->get_name() ) );
						}

						// We only need to check products managing stock, with a limited stock qty.
						if ( ! $product->managing_stock() || $product->backorders_allowed() ) {
							continue;
						}

						// Check stock based on all items in the cart and consider any held stock within pending orders.
						$held_stock     = wc_get_held_stock_quantity( $product, $order->get_id() );
						$required_stock = $quantities[ $product->get_stock_managed_by_id() ];

						if ( ! apply_filters( 'woocommerce_pay_order_product_has_enough_stock', ( $product->get_stock_quantity() >= ( $held_stock + $required_stock ) ), $product, $order ) ) {
							/* translators: 1: product name 2: quantity in stock */
							throw new Exception( sprintf( __( 'Sorry, we do not have enough "%1$s" in stock to fulfill your order (%2$s available). We apologize for any inconvenience caused.', 'woocommerce' ), $product->get_name(), wc_format_stock_quantity_for_display( $product->get_stock_quantity() - $held_stock, $product ) ) );
						}
					}
				}
			}

			WC()->customer->set_props(
				array(
					'billing_country'  => $order->get_billing_country() ? $order->get_billing_country() : null,
					'billing_state'    => $order->get_billing_state() ? $order->get_billing_state() : null,
					'billing_postcode' => $order->get_billing_postcode() ? $order->get_billing_postcode() : null,
				)
			);
			WC()->customer->save();

			$available_gateways = WC()->payment_gateways->get_available_payment_gateways();

			if ( count( $available_gateways ) ) {
				current( $available_gateways )->set_current();
			}

			wc_get_template(
				'checkout/form-pay.php',
				array(
					'order'              => $order,
					'available_gateways' => $available_gateways,
					'order_button_text'  => apply_filters( 'woocommerce_pay_order_button_text', __( 'Pay for order', 'woocommerce' ) ),
				)
			);

		} catch ( Exception $e ) {
			wc_print_notice( $e->getMessage(), 'error' );
		}
	} elseif ( $order_id ) {

		// Pay for order after checkout step.
		$order_key = isset( $_GET['key'] ) ? wc_clean( wp_unslash( $_GET['key'] ) ) : ''; // WPCS: input var ok, CSRF ok.
		$order     = wc_get_order( $order_id );

		if ( $order && $order->get_id() === $order_id && hash_equals( $order->get_order_key(), $order_key ) ) {

			if ( $order->needs_payment() ) {

				wc_get_template( 'checkout/order-receipt.php', array( 'order' => $order ) );

			} else {
				/* translators: %s: order status */
				wc_print_notice( sprintf( __( 'This order&rsquo;s status is &ldquo;%s&rdquo;&mdash;it cannot be paid for. Please contact us if you need assistance.', 'woocommerce' ), wc_get_order_status_name( $order->get_status() ) ), 'error' );
			}
		} else {
			wc_print_notice( __( 'Sorry, this order is invalid and cannot be paid for.', 'woocommerce' ), 'error' );
		}
	} else {
		wc_print_notice( __( 'Invalid order.', 'woocommerce' ), 'error' );
	}

	do_action( 'after_woocommerce_pay' );

}


function udesly_render_wc_add_to_cart() {
	if (is_singular('product')) {
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

function udesly_wc_format_dimension( $dimension ) {

	if ( ! empty( $dimension ) ) {
		$dimension = wc_format_localized_decimal( $dimension ) . ' ' . get_option( 'woocommerce_dimension_unit' );
	} else {
		$dimension = __( 'N/A', 'woocommerce' );
	}

	return $dimension;
}

function udesly_wc_get_variable_product_data() {
	global $product;

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

	if ( empty( $options ) && ! empty( $product ) && ! empty( $attribute ) ) {
		$attributes = $product->get_variation_attributes();
		$options    = $attributes[ $attribute ];
	}

	$hidden = $args['hidden'] ? 'style="display: none;"' : "";

	$html  = '<select id="' . esc_attr( $id ) . '" class="' . esc_attr( $class ) . '" '. $hidden . ' name="' . esc_attr( $name ) . '" data-attribute_name="attribute_' . esc_attr( sanitize_title( $attribute ) ) . '">';

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