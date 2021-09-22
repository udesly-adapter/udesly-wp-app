import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import {getElementsByDataNodeType} from "../utils/webflow";
import Variations from "./variations";
import UknownCart from "./unknown-cart";



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

        if (productType == "variable") {
            new Variations(addToCartForm as HTMLFormElement, udesly);
        } else {
            if (addToCart.dataset.instock != "1") {
                addToCartForm.style.display = "none";
                const outOfStock = addToCart.querySelector('.w-commerce-commerceaddtocartoutofstock')
                if (outOfStock) {
                    outOfStock.style.display = "";
                }
            }
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
    const allCarts = Array.from(document.querySelectorAll<HTMLElement>('[data-product-type]')).filter( cart => {
       return !["simple", "variable", "external"].includes(cart.dataset.productType);
    });
    allCarts.forEach( groupedForm => {
        new UknownCart(groupedForm);
    });

    // Prevents Form resubmit
    if (allCarts.length && document.body.classList.contains('single-product')) {
        if ( window.history.replaceState ) {
            window.history.replaceState( null, null, window.location.href );
        }
    }
}

export function manageAddToCarts(udesly: Udesly<WooCommerceRootModel>) {

    initAddToCarts(udesly);

    udesly.on("wordpress/postsLoaded", () => {
        initAddToCarts(udesly);
    });

}