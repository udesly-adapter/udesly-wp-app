import {createModel} from "@rematch/core";
import type {WooCommerceRootModel} from "../wc-models";
import {triggerJQuery} from "../../utils/triggers";

const domDataEl = document.getElementById('udesly-wc-mini-cart-elements');
const domState = JSON.parse(domDataEl.textContent);

export const woocommerce = createModel<WooCommerceRootModel>()({
    state: {
        count: domState.count || 0,
        subtotal: domState.subtotal || "",
        total: domState.total || "",
        items: domState.items || [],
        cartOpen: false
    },
    reducers: {
        toggleCart(state) {
            return {...state, cartOpen: !state.cartOpen};
        },
        cartChanged(state) {
            const domDataEl = document.getElementById('udesly-wc-mini-cart-elements');
            const domState = JSON.parse(domDataEl.textContent);
            return {...state, ...domState};
        },
        removedFromCart(state, payload) {
            triggerJQuery('removed_from_cart', [ payload.fragments, payload.cart_hash ]);
            return state;
        },
        ajaxError(state, payload) {
            console.error(payload);
            return state;
        },
        addedToCart(state, payload) {
            triggerJQuery('added_to_cart', [ payload.fragments, payload.cart_hash ]);
            return state;
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
      async addToCart(payload, state) {
          let {type, variation_id, product_id, quantity, el, submitter} = payload;
          el.classList.add('adding-to-cart');

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
          data.set('quantity', quantity);
          data.set('product_id', product_id);

          const response = await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace( '%%endpoint%%', 'add_to_cart' ), {
              method: "POST",
              body: data
          });
          if (response.ok) {
              const respData = await response.json();
              if (respData.success && respData.success === false) {
                  dispatch.woocommerce.ajaxError(response.status);
              } else {
                  dispatch.woocommerce.addedToCart(respData);
              }
          } else {
              dispatch.woocommerce.ajaxError(response.status);
          }

          if (submitter.tagName == "BUTTON") {
              submitter.textContent = submitter.dataset['default'];
              submitter.disabled = false;
          }
      }
    })
})