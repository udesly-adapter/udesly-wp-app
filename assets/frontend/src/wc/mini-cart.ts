import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import {getElementsByDataNodeType, handleChangeCartStateEvent} from "../utils/webflow";

export default class MiniCart {


    constructor(private udesly: Udesly<WooCommerceRootModel>, private wrapper: HTMLElement) {

       wrapper.addEventListener('wf-change-cart-state', (e : CustomEvent) => handleChangeCartStateEvent(e, wrapper));

       udesly.on("woocommerce/toggleCart", () => {
           if (window.getComputedStyle(wrapper).display == "none") {
               return;
           }
           wrapper.dispatchEvent(new CustomEvent("wf-change-cart-state", {
               detail: {
                   open: udesly.getState().woocommerce.cartOpen
               }
           }))
       })

        getElementsByDataNodeType("commerce-cart-open-link", wrapper).forEach(openLink => {
            openLink.addEventListener("click", () => {
                udesly.dispatch("woocommerce/toggleCart")
            }, true)
        });

       getElementsByDataNodeType("commerce-cart-close-link", wrapper).forEach(closeLink => {
           closeLink.addEventListener("click", () => {
               udesly.dispatch("woocommerce/toggleCart")
           }, true)
       });

       getElementsByDataNodeType("commerce-cart-container-wrapper", wrapper).forEach(w => {
           w.addEventListener("click", e => {
               if (!e.target.matches(`[data-node-type="commerce-cart-container"], [data-node-type="commerce-cart-container"] *`)) {
                   udesly.dispatch("woocommerce/toggleCart")
               }
           }, true)
       })
    }
}
