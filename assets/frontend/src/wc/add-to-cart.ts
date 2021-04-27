import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import {getElementsByDataNodeType} from "../utils/webflow";


function initAddToCarts(udesly: Udesly<WooCommerceRootModel>) {
    getElementsByDataNodeType('commerce-add-to-cart-form').forEach( addToCartForm => {
        const addToCart = addToCartForm.parentElement;

        const productType = addToCart.getAttribute('data-product-type');

        if (addToCartForm.__udy_inited) {
            return;
        }

        if (productType == "simple" || productType == "variable") {
            addToCartForm.__udy_inited = true;
            addToCartForm.querySelectorAll('[data-node-type="commerce-buy-now-button"]').forEach( buyNow => {
                buyNow.addEventListener('click', (e) => {
                    e.preventDefault();
                    udesly.dispatch('woocommerce/addToCart', {...addToCartForm._udeslyGetData(), type: productType, buyNow: true, el: addToCartForm, submitter: buyNow})
                })
            })
            addToCartForm.addEventListener('submit', (e) => {
                e.preventDefault();
                udesly.dispatch('woocommerce/addToCart', {...addToCartForm._udeslyGetData(), type: productType, buyNow: false, el: addToCartForm, submitter: addToCartForm.querySelector('[type="submit"]')})
            })
        }

        switch (productType) {
            case "simple":
                addToCartForm._udeslyGetData = function() {
                    const product_id = this.dataset.skuId;
                    const quantity = this.querySelector('[name="quantity"]').value;
                    return {product_id, quantity};
                }
                break;
            case "variable":
                addToCartForm._udeslyGetData = function() {
                    return Object.fromEntries(new FormData(this).entries());
                }
                break;
        }

    });
}

export function manageAddToCarts(udesly: Udesly<WooCommerceRootModel>) {

    initAddToCarts(udesly);

    udesly.on("wordpress/ajaxPagination", () => {
        initAddToCarts(udesly);
    });

}