import {Models} from "@rematch/core";
import { woocommerce } from './models/wc'

export interface WooCommerceRootModel extends Models<WooCommerceRootModel> {
    woocommerce: typeof woocommerce
}

export const models: WooCommerceRootModel = { woocommerce }
