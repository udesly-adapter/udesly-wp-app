<?php

namespace Udesly\Extensions\WooCommerce;


defined( 'ABSPATH' ) || exit;


class WebflowCommerce {

	protected static $_instance = null;

	public static function instance()
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	private function include_deps() {
		include_once UDESLY_PLUGIN_DIR_PATH . "/misc/wc.php";
	}

	public function run() {
		if (is_admin()) {
			$this->admin_hooks();
		}
		$this->public_hooks();
	}

	private function admin_hooks() {

	}

	public function include_global_variant(&$post, &$query) {
		if ($post->post_type !== "product") {
			return;
		}
		global $variant;

		$variant = udesly_get_wc_product_default_variant();
	}

	private function public_hooks() {
		$this->include_deps();
		add_action('the_post', [$this, "include_global_variant"], 99, 2);

		add_action('wp_footer', [$this, "include_mini_cart_fragments"]);

		add_filter('woocommerce_add_to_cart_fragments', [$this, "add_wc_fragments"], 10, 1);

		add_filter('udesly_localize_script_params', function ($array) {

		    $wc = [
			    'wc_ajax_url' => \WC_AJAX::get_endpoint( '%%endpoint%%' ),
			    'show_taxes' => get_option("woocommerce_tax_display_cart"),
                'cart_url' => wc_get_cart_url(),
                'checkout_url' => wc_get_checkout_url(),
                'redirect_to_cart' => get_option("woocommerce_cart_redirect_after_add"),
            ];

		    $array['wc'] = $wc;

		    return $array;

        }, 10, 1);
	}

	function add_wc_fragments($fragments) {

	    $fragments['script#udesly-wc-mini-cart-elements'] = '<script id="udesly-wc-mini-cart-elements" type="application/json">' . json_encode($this->get_cart_data()) . '</script>';

	    return $fragments;

    }

	function include_mini_cart_fragments() {
		if ( is_null(WC()->cart)) {
			return;
		}
		?>
<script id="udesly-wc-mini-cart-elements" type="application/json"><?php echo json_encode($this->get_cart_data()); ?></script>
<?php
	}

	function get_cart_item_options($cart_item) {
		$item_data = array();

		// Variation values are shown only if they are not found in the title as of 3.0.
		// This is because variation titles display the attributes.
		if ( $cart_item['data']->is_type( 'variation' ) && is_array( $cart_item['variation'] ) ) {
			foreach ( $cart_item['variation'] as $name => $value ) {
				$taxonomy = wc_attribute_taxonomy_name( str_replace( 'attribute_pa_', '', urldecode( $name ) ) );

				if ( taxonomy_exists( $taxonomy ) ) {
					// If this is a term slug, get the term's nice name.
					$term = get_term_by( 'slug', $value, $taxonomy );
					if ( ! is_wp_error( $term ) && $term && $term->name ) {
						$value = $term->name;
					}
					$label = wc_attribute_label( $taxonomy );
				} else {
					// If this is a custom option slug, get the options name.
					$value = apply_filters( 'woocommerce_variation_option_name', $value, null, $taxonomy, $cart_item['data'] );
					$label = wc_attribute_label( str_replace( 'attribute_', '', $name ), $cart_item['data'] );
				}

				// Check the nicename against the title.
				if ( '' === $value || wc_is_attribute_in_product_name( $value, $cart_item['data']->get_name() ) ) {
					continue;
				}

				$item_data[$label] = $value;
			}
		}

		return $item_data;
	}

	function get_cart_data($expose_product = false) {
		$cart = WC()->cart;

		$cart_items = [];

		foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
			$_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);
			if ($_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters('woocommerce_widget_cart_item_visible', true, $cart_item, $cart_item_key)) {
				$current_product = array();
				$current_product['title'] = apply_filters('woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key);

				$main_image_url = wp_get_attachment_image_url($_product->get_image_id(), 'full');
				$main_image_url = $main_image_url ? $main_image_url : esc_url(wc_placeholder_img_src());
				$current_product['image'] = $main_image_url;

				$product_price = apply_filters('woocommerce_cart_item_price', WC()->cart->get_product_price($_product), $cart_item, $cart_item_key);
				$current_product['permalink'] = apply_filters('woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink($cart_item) : '', $cart_item, $cart_item_key);
				$current_product['remove_url'] = wc_get_cart_remove_url($cart_item_key);
				$current_product['quantity'] = $cart_item['quantity'];
				$current_product['price'] = $product_price;
				$current_product['subtotal'] = wc_price($cart_item['line_total']);
				$current_product['total'] = wc_price($cart_item['line_total'] + $cart_item['line_tax']);
				$current_product['key'] = $cart_item_key;
				$current_product['options'] = $this->get_cart_item_options($cart_item);
				if ($expose_product) {
					$current_product['product'] = $_product;
				}
				$cart_items[] = (object)$current_product;
			}
		}

		return [
			'count' => $cart->get_cart_contents_count(),
			'subtotal' => $cart->get_cart_subtotal(),
			'total' => $cart->get_cart_total(),
			'items' => $cart_items
		];
	}
}