import Udesly from "./udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import type {RootModel} from "../store/models";
import type {RematchStore} from "@rematch/core";

export default function initUdesly<T = WooCommerceRootModel | RootModel>(store: RematchStore<T>) {
    const funcs = Array.isArray(window.Udesly) ? window.Udesly : [];

    const u = new Udesly<T>("udesly", store);

    window.Udesly = u;
    funcs.forEach(fn => fn());

    return u;
}