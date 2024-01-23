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

	public function enqueue_styles() {
		if ( ! wp_script_is( 'wc-cart-fragments', 'enqueued' ) && wp_script_is( 'wc-cart-fragments', 'registered' ) ) {
			// Enqueue the 'wc-cart-fragments' script
			wp_enqueue_script( 'wc-cart-fragments' );
		}
	}

	private function public_hooks() {
		$this->include_deps();
		add_action('the_post', [$this, "include_global_variant"], 99, 2);

		add_action('wp_enqueue_scripts', [$this, "enqueue_styles"], 99);


		add_action('wp_footer', [$this, "include_mini_cart_fragments"]);

		add_action('wp_footer', [$this, "include_checkout_scripts"], 99);

		add_filter('woocommerce_add_to_cart_fragments', [$this, "add_wc_fragments"], 10, 1);

		add_filter('template_include', function($template) {
		   if (is_order_received_page() && file_exists(STYLESHEETPATH . '/thank-you.php')) {
		      return STYLESHEETPATH . '/thank-you.php';
           }
		   return $template;
        });

		add_filter('wc_get_template', [$this, "filter_templates"], 1, 5);

		add_filter('woocommerce_checkout_fields', function ($fields) {
		    if (defined('UDESLY_CHECKOUT') || isset($_GET['udesly_checkout'])) {
			   $fields['customer'] = [];
			   $billing_email = $fields['billing']['billing_email'];
			   unset($fields['billing']['billing_email']);
			    if (is_user_logged_in()) {
			        if (!isset($billing_email['custom_attributes'])) {
			            $billing_email['custom_attributes'] = [];
                    }
                    $billing_email['custom_attributes']['readonly'] = true;
			    }
			   $fields['customer']['billing_email'] = $billing_email;

            }
			return $fields;
        }, 10);

		add_filter('woocommerce_update_order_review_fragments', [$this, 'add_update_order_fragments'], 10, 1);

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

		add_action('wc_ajax_udesly_add_to_cart', [self::class, 'udesly_add_to_cart']);
		add_action('wc_ajax_udesly_change_cart_quantity', [self::class, 'udesly_change_cart_quantity']);

		add_filter('woocommerce_available_variation', [$this, 'add_variation_html_data'], 10, 3);

		add_filter('woocommerce_get_script_data', function($params, $handle) {

		    if ($handle == "wc-checkout") {
		        $params['is_checkout'] = "0";
            }

		    return $params;
        }, 10, 2);

		add_action('wp_enqueue_scripts', function () {
			wp_dequeue_style( 'selectWoo' );
			wp_deregister_style( 'selectWoo' );

			wp_dequeue_script( 'selectWoo');
			wp_deregister_script('selectWoo');
        }, 10);
	}

	function include_checkout_scripts() {
		if (is_checkout()) : ?>
<script>		
(function () {
  if (!window.wc_country_select_params) {
    return;
  }

  const states_json = wc_country_select_params.countries.replace(
    /&quot;/g,
    '"'
  );
  const states = JSON.parse(states_json);

  const checkoutForm = document.querySelector('form[name="checkout"]');

  if (!checkoutForm) {
    return;
  }

  checkoutForm.addEventListener("change", (e) => {
    if (e.target && e.target.tagName == "SELECT") {
      if (["billing_country", "shipping_country"].includes(e.target.name)) {
        jQuery("body").trigger("country_to_state_changed", [
          e.target.value,
          $(e.target).closest("fieldset"),
        ]);
      }
    }
  });

  jQuery("body").on("country_to_state_changed", (event, country, $wrapper) => {
    const countries = states[country];
    const input = $wrapper.find('[name*="_state"]');

    let input_name = input.attr("name");
    let input_id = input.attr("id");
    let input_classes = input.attr("data-input-classes");
    let value = input.val();
    let placeholder =
      input.attr("placeholder") || input.attr("data-placeholder") || "";
    let $newstate;
    if (countries) {
       $newstate = jQuery( '<select></select>' )
						.prop( 'id', input_id )
						.prop( 'name', input_name )
						.data( 'placeholder', placeholder )
						.attr( 'data-input-classes', input_classes )
						.addClass( 'state_select ' + input_classes );

        const $defaultOption = jQuery( '<option value=""></option>' ).text( wc_country_select_params.i18n_select_state_text );
    
        $newstate.append($defaultOption);

        jQuery.each( countries, function( index ) {
            var $option = $( '<option></option>' )
                .prop( 'value', index )
                .text( countries[ index ] );
            $newstate.append( $option );
        } );
        document.querySelectorAll('label[for="' + input_id + '"]').forEach(label => {
            label.style.display = "";
        })
    } else {
        $newstate = jQuery('<input type="hidden" />')
        .prop("id", input_id)
        .prop("name", input_name)
        .prop("placeholder", placeholder)
        .attr("data-input-classes", input_classes)
        .addClass("hidden " + input_classes);
        document.querySelectorAll('label[for="' + input_id + '"]').forEach(label => {
            label.style.display = "none";
        })
    }
    input.replaceWith($newstate);
    input.val(value);
    $newstate.trigger('change');
  });
})();
</script>
		<?php endif;
	}

	function add_update_order_fragments( $fragments ) {

	    ob_start();
		wc_cart_totals_shipping_html();
		$fragment = ob_get_clean();

	    $fragments['[data-node-type="commerce-checkout-shipping-methods-wrapper"] fieldset'] = $fragment;

	    return $fragments;
    }

	function filter_templates($template, $template_name, $args, $template_path, $default_path) {


	    if(defined('UDESLY_CHECKOUT') || isset($_GET['udesly_checkout']) && $_GET['udesly_checkout'] == "true" ) {

	        if (file_exists(STYLESHEETPATH . '/template-parts/woocommerce/' . $template_name) ) {
	            return STYLESHEETPATH . '/template-parts/woocommerce/' . $template_name;
            }


	        if ("notices/error.php" === $template_name) {
	            return STYLESHEETPATH . '/template-parts/woocommerce/checkout/checkout-errors.php';
            }
		    if ("notices/success.php" === $template_name) {
			    return STYLESHEETPATH . '/template-parts/woocommerce/checkout/checkout-success.php';
		    }
        }

	    return $template;
    }

	static function udesly_change_cart_quantity() {
		ob_start();

		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if ( ! isset( $_POST['key'] ) || ! isset($_POST['quantity']) ) {
			return;
		}

		WC()->cart->set_quantity(sanitize_text_field($_POST['key']), intval($_POST['quantity']));

		\WC_AJAX::get_refreshed_fragments();
    }

	function add_variation_html_data($args, $t, $variation) {
	    $args['length_html'] = udesly_wc_format_dimension($args['dimensions']['length']);
		$args['width_html'] = udesly_wc_format_dimension($args['dimensions']['width']);
		$args['height_html'] = udesly_wc_format_dimension($args['dimensions']['height']);

		$args['display_price_html'] = udesly_format_price($args['display_price']);

		$args['display_regular_price_html'] = $args['display_regular_price'] > $args['display_price'] ? udesly_format_price($args['display_regular_price']) : "";

	    return $args;
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


	public static function udesly_add_to_cart() {
		ob_start();

		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if ( ! isset( $_POST['product_id'] ) ) {
			return;
		}

		$product_id        = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $_POST['product_id'] ) );
		$product           = wc_get_product( $product_id );
		$quantity          = empty( $_POST['quantity'] ) ? 1 : wc_stock_amount( wp_unslash( $_POST['quantity'] ) );
		$passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );
		$product_status    = get_post_status( $product_id );
		$variation_id      = 0;
		$variation         = array();

		if ( $product && 'variation' === $product->get_type() ) {
			$variation_id = $product_id;
			$product_id   = $product->get_parent_id();
			$variation    = $product->get_variation_attributes();
		}

		if ( $passed_validation && false !== WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation ) && 'publish' === $product_status ) {

			do_action( 'woocommerce_ajax_added_to_cart', $product_id );

			if ( 'yes' === get_option( 'woocommerce_cart_redirect_after_add' ) ) {
				wc_add_to_cart_message( array( $product_id => $quantity ), true );
			}

			\WC_AJAX::get_refreshed_fragments();

		} else {

		    $notices = wc_get_notices('error');
		    wc_clear_notices();
			// If there was an error adding to the cart, redirect to the product page to show any errors.
			$data = array(
				'error'       => true,
				'product_url' => apply_filters( 'woocommerce_cart_redirect_after_error', get_permalink( $product_id ), $product_id ),
                'error_message' => $notices[0]['notice'] ?? __("Failed adding to cart", "woocommerce")
			);

			wp_send_json( $data );
		}
		// phpcs:enable
	}

	function get_cart_data($expose_product = false) {
		$cart = WC()->cart;

		$cart_items = [];

		foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
			$_product = apply_filters('woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key);
			if ($_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters('woocommerce_widget_cart_item_visible', true, $cart_item, $cart_item_key)) {
				$current_product = array();
				if ($_product->is_type('variation')) {
					$current_product['title'] = apply_filters('woocommerce_cart_item_name', $_product->get_parent_data()['title'], $cart_item, $cart_item_key);
				} else {
					$current_product['title'] = apply_filters('woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key);
				}


				$main_image_url = wp_get_attachment_image_url($_product->get_image_id(), 'full');
				$main_image_url = $main_image_url ? $main_image_url : esc_url(wc_placeholder_img_src());
				$current_product['image'] = $main_image_url;

				$product_price = apply_filters('woocommerce_cart_item_price', WC()->cart->get_product_price($_product), $cart_item, $cart_item_key);
				$current_product['permalink'] = apply_filters('woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink($cart_item) : '', $cart_item, $cart_item_key);
				$current_product['remove_url'] = wc_get_cart_remove_url($cart_item_key);
				$current_product['quantity'] = $cart_item['quantity'];
				$current_product['price'] = $product_price;
				$current_product['stock_quantity'] = $_product->get_stock_quantity();
				$current_product['manage_stock'] = wc_string_to_bool($_product->get_manage_stock());
				$current_product['regular_price'] = $_product->is_on_sale() ? wc_price($_product->get_regular_price()) : "";
				$current_product['subtotal'] = wc_price($cart_item['line_total']);
				$current_product['total'] = wc_price($cart_item['line_total'] + $cart_item['line_tax']);
				$current_product['key'] = $cart_item_key;
				$current_product['options'] = udesly_wc_get_cart_item_options($cart_item);
				if ($expose_product) {
					$current_product['product'] = $_product;
				}
				$cart_items[] = (object) $current_product;

			}
		}

		$notices = wc_get_notices();

		wc_clear_notices();

		$taxes = wc_tax_enabled() && $cart->display_prices_including_tax();

		$total = wc_price( $taxes ? $cart->get_cart_contents_total() + $cart->get_cart_contents_tax() : $cart->get_cart_contents_total() );

		return [
			'count' => $cart->get_cart_contents_count(),
			'subtotal' => $cart->get_cart_subtotal(),
			'total' => $total,
			'items' => $cart_items,
            'notices' => $notices
		];
	}
}