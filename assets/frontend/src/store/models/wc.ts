import {createModel} from "@rematch/core";
import type {WooCommerceRootModel} from "../wc-models";
import {triggerJQuery} from "../../utils/triggers";

const domDataEl = document.getElementById('udesly-wc-mini-cart-elements');
const domState = JSON.parse(domDataEl.textContent);

let timeout;

export const woocommerce = createModel<WooCommerceRootModel>()({
    state: {
        count: domState.count || 0,
        subtotal: domState.subtotal || "",
        total: domState.total || "",
        items: domState.items || [],
        notices: domState.notices || [],
        cartOpen: false,
        checkout: domState.checkout || {}
    },
    reducers: {
        toggleCart(state) {
            return {...state, cartOpen: !state.cartOpen};
        },
        setCartOpen(state, payload) {
            return {...state, cartOpen: payload};
        },
        cartChanged(state) {
            const domDataEl = document.getElementById('udesly-wc-mini-cart-elements');
            const domState = JSON.parse(domDataEl.textContent);
            return {...state, ...domState};
        },
        removedFromCart(state, payload) {
            triggerJQuery('removed_from_cart', [ payload.fragments, payload.cart_hash ]);
            triggerJQuery('update_checkout');
            triggerJQuery('wc_fragments_refresh');


            return state;
        },
        ajaxError(state, payload) {
            console.error(payload);
            return state;
        },
        addedToCart(state, payload) {
            triggerJQuery('added_to_cart', [ payload.fragments, payload.cart_hash ]);
            triggerJQuery('update_checkout');
            
            triggerJQuery('wc_fragments_refresh');
            return state;
        },
        appliedCoupon(state, payload) {
            triggerJQuery( 'applied_coupon_in_checkout', [ payload.coupon_code ] );
            triggerJQuery( 'update_checkout', { update_shipping_method: false } );
            if (!state.checkout.coupons) {
                state.checkout.coupons = [];
            }
            state.checkout.coupons.push(payload)
            if (state.checkout.coupons.length > 0) {
                const reviewTable = document.querySelector('.w-commerce-commercecheckoutordersummarywrapper');
                if (reviewTable) {
                    reviewTable.scrollIntoView({behavior: "smooth", block: "center"})
                }
            }
            return {...state};
        },
        updateCheckout(state) {
            document.body.classList.add('updating-checkout');
            return state;
        },
        checkoutUpdated(state) {
            document.body.classList.remove('updating-checkout');
            return state;
        },
        updatedCartQuantity(state, payload) {
            triggerJQuery('added_to_cart', [ payload.fragments, payload.cart_hash ]);
            triggerJQuery('update_checkout');
            return state;
        },
        checkoutNotice(state, payload) {

            return state;
        },
        invalidCoupon(state, payload) {
            console.log(payload);

            state.checkout.coupons = [];

            return {...state};
        }
    },
    effects: dispatch => ({
      async removeFromCart(payload, state) {
          const data = new FormData();
          data.set('cart_item_key', payload);
          const response = await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace( '%%endpoint%%', 'remove_from_cart' ), {
              method: "POST",
              body: data
          });
          if (response.ok) {
              const respData = await response.json();
              if (respData.success && respData.success === false) {
                  dispatch.woocommerce.ajaxError(response.status);
              } else {
                  dispatch.woocommerce.removedFromCart(respData);
              }
          } else {
              dispatch.woocommerce.ajaxError(response.status);
          }
      },
        async applyCoupon(payload, state) {
            jQuery && jQuery( '.woocommerce-error, .woocommerce-message' ).remove();
            const data = new FormData();
            data.set('security', wc_checkout_params.apply_coupon_nonce);
            data.set('coupon_code', payload.coupon_code);
            const response = await fetch(wc_checkout_params.wc_ajax_url.replace( '%%endpoint%%', 'apply_coupon' ), {
                method: "POST",
                body: data
            });
            if (response.ok) {
                const respData = await response.text();
                dispatch.woocommerce.checkoutNotice(respData);
                triggerJQuery( 'update_checkout', { update_shipping_method: false } );
                dispatch.woocommerce.appliedCoupon({coupon_code: payload.coupon_code, resp: respData});
            } else {
                dispatch.woocommerce.ajaxError(response.status);
            }
        },
        async updateCartQuantity(payload, state) {
            const data = new FormData();
            data.set('key', payload.key);
            data.set('quantity', payload.quantity);
            const response = await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace( '%%endpoint%%', 'udesly_change_cart_quantity' ), {
                method: "POST",
                body: data
            });
            if (response.ok) {
                const respData = await response.json();
                if (respData.success && respData.success === false) {
                    dispatch.woocommerce.ajaxError(response.status);
                } else {
                    dispatch.woocommerce.removedFromCart(respData);
                }
            } else {
                dispatch.woocommerce.ajaxError(response.status);
            }
        },
      async addToCart(payload, state) {
          let {type, variation_id, product_id, quantity, el, submitter, buyNow, ...additional} = payload;
          if(timeout) {
              clearTimeout(timeout);
          }
          el.parentElement.querySelectorAll('.w-commerce-commerceaddtocarterror').forEach(e => e.style.display = "none");
          el.parentElement.classList.add('adding-to-cart');

          if (submitter.disabled) {
              return;
          }

          if (submitter.tagName == "BUTTON") {
              if (!submitter.dataset['default']) {
                  submitter.dataset['default'] = submitter.textContent;
              }
              submitter.textContent = submitter.dataset['loadingText'];
              submitter.disabled = true;
          }

          if (type == "variable") {
              if (variation_id !== "0") {
                  product_id = variation_id;
              }
          }

          const data = new FormData();
          if (!quantity) {
              quantity == 1;
          }
          data.set('quantity', quantity);
          data.set('product_id', product_id);

          if (additional && Object.keys(additional).length) {
               for (let key in additional) {
                   data.set(key, additional[key]);
               }
          }

          const response = await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace( '%%endpoint%%', 'udesly_add_to_cart' ), {
              method: "POST",
              body: data
          });
          if (response.ok) {
              const respData = await response.json();
              if (respData.error && respData.error === true) {
                  dispatch.woocommerce.ajaxError(respData.error_message || respData);
                  el.parentElement.querySelectorAll('[data-node-type="commerce-add-to-cart-error"]').forEach(e => e.innerHTML = respData.error_message);
                  el.parentElement.querySelectorAll('.w-commerce-commerceaddtocarterror').forEach(e => e.style.display = "");
                  timeout = setTimeout(() => {
                      el.parentElement.querySelectorAll('.w-commerce-commerceaddtocarterror').forEach(e => e.style.display = "none");
                  }, 10000)
              } else {
                  if (buyNow) {
                      window.location = window.udesly_frontend_options.wc.checkout_url;
                  } else {
                      dispatch.woocommerce.addedToCart(respData);
                  }
              }
          } else {
              dispatch.woocommerce.ajaxError(response.status);
          }
          el.parentElement.classList.remove('adding-to-cart');
          if (submitter.tagName == "BUTTON") {
              submitter.textContent = submitter.dataset['default'];
              submitter.disabled = false;
          }
      }
    })
})