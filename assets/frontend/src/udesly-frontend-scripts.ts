import {initStore} from "./store";
import initUdesly from "./utils/init-udesly";
import wp from "./wp";

import type {RootModel} from "./store/models";
import type {RematchStore} from "@rematch/core";
import type {WooCommerceRootModel} from "./store/wc-models";
import type Udesly from "./utils/udesly";

if (window.safari) {
    var lastBtn = null
    document.addEventListener('click',function(e){
        if (!e.target.closest) return;
        lastBtn = e.target.closest('button, input[type=submit]');
    }, true);
    document.addEventListener('submit',function(e){
        if (e.submitter) return;
        var canditates = [document.activeElement, lastBtn];
        for (var i=0; i < canditates.length; i++) {
            var candidate = canditates[i];
            if (!candidate) continue;
            if (!candidate.form) continue;
            if (!candidate.matches('button, input[type=button], input[type=image]')) continue;
            e.submitter = candidate;
            return;
        }
        e.submitter = e.target.querySelector('button, input[type=button], input[type=image]')
    }, true);
}

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
