import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import {getElementsByDataNodeType} from "../utils/webflow";
import {onJQueryEvent} from "../utils/triggers";
import {manageAddToCarts} from "./add-to-cart";

export default async function wc(udesly: Udesly<WooCommerceRootModel>) {

    const miniCartsWrappers = getElementsByDataNodeType("commerce-cart-wrapper");

    if (miniCartsWrappers) {
        import('./mini-cart').then( miniCartModule => {
            miniCartsWrappers.forEach(wrapper => new miniCartModule.default(udesly, wrapper));
        })
    }

    onJQueryEvent('wc_fragments_refreshed wc_fragments_loaded', () => {
        udesly.dispatch('woocommerce/cartChanged');
    })

    const checkouts = getElementsByDataNodeType("commerce-checkout-form-container");

    if (checkouts) {
        import("./checkout").then(checkoutModule => {
            checkouts.forEach(checkout => new checkoutModule.default(udesly, checkout));
        })
    }


    manageAddToCarts(udesly);

    document.body.classList.add('udesly-wc-loaded');
}