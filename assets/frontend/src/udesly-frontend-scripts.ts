import {initStore} from "./store";
import initUdesly from "./utils/init-udesly";
import wp from "./wp";
import type {RootModel} from "./store/models";
import type {RematchStore} from "@rematch/core";
import type {WooCommerceRootModel} from "./store/wc-models";
import type Udesly from "./utils/udesly";


(async() => {
    const woocommerce = window.udesly_frontend_options.plugins.woocommerce;
    const store = await initStore(woocommerce)

    const udesly = woocommerce ?
        initUdesly<WooCommerceRootModel>(store as RematchStore<WooCommerceRootModel>)
       : initUdesly<RootModel>(store as RematchStore<RootModel>);


    wp(udesly as Udesly<RootModel>);

    if (woocommerce) {
        const module = await import('./wc/index');
        await module.default(udesly as Udesly<WooCommerceRootModel>)
    }

})();
