import {
  createModel
} from "./chunk-IPQTGU6P.js";
import {
  triggerJQuery
} from "./chunk-4XNJ22UE.js";
import "./chunk-F543FC74.js";

// src/store/models/wc.ts
var domDataEl = document.getElementById("udesly-wc-mini-cart-elements");
var domState = JSON.parse(domDataEl.textContent);
var timeout;
var woocommerce = createModel()({
  state: {
    count: domState.count || 0,
    subtotal: domState.subtotal || "",
    total: domState.total || "",
    items: domState.items || [],
    notices: domState.notices || [],
    cartOpen: false
  },
  reducers: {
    toggleCart(state) {
      return {...state, cartOpen: !state.cartOpen};
    },
    cartChanged(state) {
      const domDataEl2 = document.getElementById("udesly-wc-mini-cart-elements");
      const domState2 = JSON.parse(domDataEl2.textContent);
      return {...state, ...domState2};
    },
    removedFromCart(state, payload) {
      triggerJQuery("removed_from_cart", [payload.fragments, payload.cart_hash]);
      return state;
    },
    ajaxError(state, payload) {
      console.error(payload);
      return state;
    },
    addedToCart(state, payload) {
      triggerJQuery("added_to_cart", [payload.fragments, payload.cart_hash]);
      return state;
    },
    updatedCartQuantity(state, payload) {
      triggerJQuery("added_to_cart", [payload.fragments, payload.cart_hash]);
      return state;
    }
  },
  effects: (dispatch) => ({
    async removeFromCart(payload, state) {
      const data = new FormData();
      data.set("cart_item_key", payload);
      const response = await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%", "remove_from_cart"), {
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
    async updateCartQuantity(payload, state) {
      const data = new FormData();
      data.set("key", payload.key);
      data.set("quantity", payload.quantity);
      const response = await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%", "udesly_change_cart_quantity"), {
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
      let {type, variation_id, product_id, quantity, el, submitter, buyNow} = payload;
      if (timeout) {
        clearTimeout(timeout);
      }
      el.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach((e) => e.style.display = "none");
      el.parentElement.classList.add("adding-to-cart");
      if (submitter.disabled) {
        return;
      }
      if (submitter.tagName == "BUTTON") {
        if (!submitter.dataset["default"]) {
          submitter.dataset["default"] = submitter.textContent;
        }
        submitter.textContent = submitter.dataset["loadingText"];
        submitter.disabled = true;
      }
      if (type == "variable") {
        if (variation_id !== "0") {
          product_id = variation_id;
        }
      }
      const data = new FormData();
      data.set("quantity", quantity);
      data.set("product_id", product_id);
      const response = await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%", "udesly_add_to_cart"), {
        method: "POST",
        body: data
      });
      if (response.ok) {
        const respData = await response.json();
        if (respData.error && respData.error === true) {
          dispatch.woocommerce.ajaxError(respData.error_message || respData);
          el.parentElement.querySelectorAll('[data-node-type="commerce-add-to-cart-error"]').forEach((e) => e.innerHTML = respData.error_message);
          el.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach((e) => e.style.display = "");
          timeout = setTimeout(() => {
            el.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach((e) => e.style.display = "none");
          }, 1e4);
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
      el.parentElement.classList.remove("adding-to-cart");
      if (submitter.tagName == "BUTTON") {
        submitter.textContent = submitter.dataset["default"];
        submitter.disabled = false;
      }
    }
  })
});

// src/store/wc-models.ts
var models = {woocommerce};
export {
  models
};
//# sourceMappingURL=wc-models-RBECXARC.js.map
