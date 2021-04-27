declare module window {
    const udesly_frontend_options: {
        plugins: {
            woocommerce: boolean
        },
        wp: {
            ajax_url: string,
        },
        wc: {
            wc_ajax_url: string,
            show_taxes: "incl" | "excl",
            cart_url: string,
            checkout_url: string,
            redirect_to_cart: "no" | "yes"
        }
    }
    const Webflow: any;

    let Udesly: undefined | Function[] ;
}