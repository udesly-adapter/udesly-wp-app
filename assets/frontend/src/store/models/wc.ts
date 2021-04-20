import {createModel} from "@rematch/core";
import type {WooCommerceRootModel} from "../wc-models";


export const woocommerce = createModel<WooCommerceRootModel>()({
    state: {
        products: [],
        cartOpen: false
    },
    reducers: {
        toggleCart(state) {
            return {...state, cartOpen: !state.cartOpen};
        }
    }
})