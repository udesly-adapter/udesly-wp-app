import { init } from '@rematch/core'

export async function initStore(woocommerce = false) {

    const module = woocommerce ? await import('./wc-models') : await import('./models');

    return init({models: module.models,
        name: woocommerce? "WP/WC Store" : "WP Store",
        redux: {
        devtoolOptions: {
            disabled: !DEV
        }
    },
    plugins: [plugin()]});
}

const plugin = () => ({
    createMiddleware: rematchBag => (store) => (next) => (action) => {
            const { type: actionType, payload } = action;
            window.Udesly.emit(actionType, payload);
            return next(action);
        },
})
