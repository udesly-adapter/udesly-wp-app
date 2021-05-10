import {Models} from "@rematch/core";
import { woocommerce } from './models/wc'
import {wordpress} from "./models/wordpress";

export interface WooCommerceRootModel extends Models<WooCommerceRootModel> {
    woocommerce: typeof woocommerce,
    wordpress: typeof wordpress
}

export const models: WooCommerceRootModel = { woocommerce, wordpress }
