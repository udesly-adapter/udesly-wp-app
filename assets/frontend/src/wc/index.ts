import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import {getElementsByDataNodeType} from "../utils/webflow";

export default async function wc(udesly: Udesly<WooCommerceRootModel>) {

    const miniCartsWrappers = getElementsByDataNodeType("commerce-cart-wrapper");

    if (miniCartsWrappers) {
        import('./mini-cart').then( miniCartModule => {
            miniCartsWrappers.forEach(wrapper => new miniCartModule.default(udesly, wrapper));
        })
    }
}