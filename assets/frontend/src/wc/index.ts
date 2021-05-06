import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import {getElementsByDataNodeType} from "../utils/webflow";
import {onJQueryEvent, triggerJQuery} from "../utils/triggers";
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

    onJQueryEvent('checkout_error', (event, errors) => {
        udesly.dispatch('woocommerce/checkoutNotice', errors.toString());
    })

    onJQueryEvent('ajaxComplete', (event, xhr, config) => {
        if (config.url.includes('remove_coupon')) {
               udesly.dispatch('woocommerce/checkoutNotice', xhr.responseText);
        } else if (config.url.includes('update_order_review')) {
            udesly.dispatch('woocommerce/checkoutUpdated');
        }
        if (document.querySelector('.woocommerce-notices-wrapper')) {
            const noticesWrapper = document.querySelector('.woocommerce-notices-wrapper');
            if (noticesWrapper.innerHTML.trim().length > 0) {
                udesly.dispatch('woocommerce/checkoutNotice', noticesWrapper.innerHTML);
                noticesWrapper.innerHTML = "";
            }
        }
    }, document)

    const checkouts = getElementsByDataNodeType("commerce-checkout-form-container");

    if (checkouts) {
        import("./checkout").then(checkoutModule => {
            checkouts.forEach(checkout => new checkoutModule.default(udesly, checkout));
            triggerJQuery('init_checkout');

        })
    } else {
        wc_checkout_params.is_checkout = "1";
        triggerJQuery('init_checkout');
    }




    const thankyous = document.querySelectorAll('[data-node-type="commerce-order-confirmation-wrapper"] .w-commerce-commercecheckoutorderitemswrapper')

    if(thankyous) {
        import('./thankyou').then(module => {
            thankyous.forEach(thankyou => new module.default(thankyou));
        })
    }

    manageAddToCarts(udesly);

    document.body.classList.add('udesly-wc-loaded');
}