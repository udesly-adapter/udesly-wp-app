import type EventBus from "./utils/event-bus";

declare module window {
    const udesly_frontend_options: {
        plugins: {
            woocommerce: boolean
        }
    }
    const Webflow: any;

    let Udesly: undefined | Function[] | EventBus;
}