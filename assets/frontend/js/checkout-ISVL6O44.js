import {
  require_eta
} from "./chunk-WK2D2ARA.js";
import {
  __toModule
} from "./chunk-F543FC74.js";

// src/wc/checkout.ts
var import_eta = __toModule(require_eta());
import_eta.default.config.autoEscape = false;
var Checkout = class {
  constructor(udesly, checkoutWrapper) {
    this.udesly = udesly;
    this.checkoutWrapper = checkoutWrapper;
    this.includeTaxes = window.udesly_frontend_options.wc.show_taxes === "incl";
    this.handleItemsInOrder(this.checkoutWrapper.querySelector(".w-commerce-commercecheckoutblockcontent"));
    this.handleCoupon();
  }
  handleCoupon() {
    const couponForm = this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-discount-form"]');
    if (!couponForm) {
      return;
    }
    const realCouponForm = document.querySelector("form#coupon_form");
    if (!realCouponForm) {
      return;
    }
    if (realCouponForm) {
      realCouponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log("submitted");
      }, true);
    }
  }
  handleItemsInOrder(wrapper) {
    if (!wrapper) {
      return;
    }
    const template = wrapper.querySelector('script[type="text/x-wf-template"]').textContent;
    this.templateFunction = import_eta.default.compile(template);
    this.itemsList = wrapper.querySelector(".w-commerce-commercecheckoutorderitemslist");
    this.udesly.on("woocommerce/cartChanged", () => {
      this.refreshItemsInOrder();
    });
    this.refreshItemsInOrder();
  }
  refreshItemsInOrder() {
    const {count, items, subtotal, total} = this.udesly.getState().woocommerce;
    if (!count) {
      window.location = window.udesly_frontend_options.wc.cart_url;
    }
    this.refreshItems(items);
  }
  refreshItems(items) {
    if (!this.itemsList) {
      return;
    }
    this.itemsList.innerHTML = items.reduce((prev, next) => {
      next.rowTotal = this.includeTaxes ? next.total : next.subtotal;
      return prev += import_eta.default.render(this.templateFunction, next);
    }, "");
  }
};
var checkout_default = Checkout;
export {
  checkout_default as default
};
//# sourceMappingURL=checkout-ISVL6O44.js.map
