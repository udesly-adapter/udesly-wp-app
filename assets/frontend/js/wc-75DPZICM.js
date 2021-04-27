import {
  onJQueryEvent
} from "./chunk-4XNJ22UE.js";
import {
  getElementsByDataNodeType
} from "./chunk-6B4SAIWY.js";
import "./chunk-F543FC74.js";

// src/wc/add-to-cart.ts
function initAddToCarts(udesly) {
  getElementsByDataNodeType("commerce-add-to-cart-form").forEach((addToCartForm) => {
    const addToCart = addToCartForm.parentElement;
    const productType = addToCart.getAttribute("data-product-type");
    if (addToCartForm.__udy_inited) {
      return;
    }
    if (productType == "simple" || productType == "variable") {
      addToCartForm.__udy_inited = true;
      addToCartForm.querySelectorAll('[data-node-type="commerce-buy-now-button"]').forEach((buyNow) => {
        buyNow.addEventListener("click", (e) => {
          e.preventDefault();
          udesly.dispatch("woocommerce/addToCart", {...addToCartForm._udeslyGetData(), type: productType, buyNow: true, el: addToCartForm, submitter: buyNow});
        });
      });
      addToCartForm.addEventListener("submit", (e) => {
        e.preventDefault();
        udesly.dispatch("woocommerce/addToCart", {...addToCartForm._udeslyGetData(), type: productType, buyNow: false, el: addToCartForm, submitter: addToCartForm.querySelector('[type="submit"]')});
      });
    }
    switch (productType) {
      case "simple":
        addToCartForm._udeslyGetData = function() {
          const product_id = this.dataset.skuId;
          const quantity = this.querySelector('[name="quantity"]').value;
          return {product_id, quantity};
        };
        break;
      case "variable":
        addToCartForm._udeslyGetData = function() {
          return Object.fromEntries(new FormData(this).entries());
        };
        break;
    }
  });
}
function manageAddToCarts(udesly) {
  initAddToCarts(udesly);
  udesly.on("wordpress/ajaxPagination", () => {
    initAddToCarts(udesly);
  });
}

// src/wc/index.ts
async function wc(udesly) {
  const miniCartsWrappers = getElementsByDataNodeType("commerce-cart-wrapper");
  if (miniCartsWrappers) {
    import("./mini-cart-KY2IWC7V.js").then((miniCartModule) => {
      miniCartsWrappers.forEach((wrapper) => new miniCartModule.default(udesly, wrapper));
    });
  }
  onJQueryEvent("wc_fragments_refreshed wc_fragments_loaded", () => {
    udesly.dispatch("woocommerce/cartChanged");
  });
  manageAddToCarts(udesly);
}
export {
  wc as default
};
//# sourceMappingURL=wc-75DPZICM.js.map
