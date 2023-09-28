import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import Eta from '../utils/eta';
import {onJQueryEvent, triggerJQuery} from "../utils/triggers";

Eta.config.autoEscape = false;


export default class Checkout {
    private templateFunction: any;
    private itemsList?: Element;
    private includeTaxes: boolean;

    constructor(private udesly: Udesly<WooCommerceRootModel>, private checkoutWrapper: HTMLElement) {

        wc_checkout_params.wc_ajax_url+="&udesly_checkout=true"
        wc_checkout_params.checkout_url+="&udesly_checkout=true"
        wc_checkout_params.is_checkout = "1";

        jQuery.scroll_to_notices =  () => {
            const errorState = this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-error-state"]');
            if (errorState) {
                errorState.scrollIntoView({block: "center", behavior: "smooth"})
            }
        }
        this.includeTaxes = window.udesly_frontend_options.wc.show_taxes === "incl";
        this.handleItemsInOrder(this.checkoutWrapper.querySelector(".w-commerce-commercecheckoutorderitemswrapper"));

        this.handleCoupon();

        this.initDOMEvents();

        this.initStoreEvents();
    }

    initDOMEvents() {
        this.checkoutWrapper.querySelectorAll('[data-node-type="commerce-checkout-place-order-button"]').forEach(el => {
            if (el.tagName == "A") {
                el.addEventListener('click', e => {
                    this.checkoutWrapper.dispatchEvent(new Event('submit', {bubbles: true}))
                })
            }
        })
        this.checkoutWrapper.addEventListener('change', () => {
            this.hideErrorState();
        })
    }

    initStoreEvents() {

        onJQueryEvent('update_checkout', () => {
            this.udesly.dispatch('woocommerce/updateCheckout');
        })

        this.udesly.on('woocommerce/checkoutNotice', (errors) => {
            this.checkoutWrapper.querySelectorAll('.woocommerce-NoticeGroup-checkout').forEach(el => el.remove());
            const errorState = this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-error-state"]');

            if (errorState) {
                errorState.outerHTML = errors;
                requestAnimationFrame(() => {
                    this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-error-state"]').scrollIntoView({block: "center", behavior: "smooth"})
                })

            }
        })
    }

    hideErrorState() {
        const errorState = this.checkoutWrapper.querySelector<HTMLElement>('[data-node-type="commerce-checkout-error-state"]');

        if (errorState) {
            errorState.style.display = "none";
        }
    }

    handleCoupon() {
        const couponForm = this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-discount-form"]');
        if (!couponForm) {
            return;
        }
        const realCouponForm = document.querySelector('form#coupon_form');
        if (!realCouponForm) {
            return;
        }

        if (realCouponForm) {
           realCouponForm.addEventListener('submit', e => {
               this.hideErrorState();
               e.preventDefault();
               e.stopPropagation();
               e.stopImmediatePropagation();
               this.udesly.dispatch("woocommerce/applyCoupon", {
                   coupon_code: this.checkoutWrapper.querySelector('input[name=coupon_code]').value
               });
           }, true);
        }
    }

    handleItemsInOrder(wrapper: HTMLElement) {
        if(!wrapper) {
            return;
        }
        try {
            let template = wrapper.querySelector('script[type="text/x-wf-template"]').textContent!;
            template = template.replace(/product\.fullSlug/gm, 'url');
    
            this.templateFunction = Eta.compile(template);
            
            this.itemsList = wrapper.querySelector('.w-commerce-commercecheckoutorderitemslist');
    
            this.udesly.on("woocommerce/cartChanged", () => {
                this.refreshItemsInOrder()
            });
            this.refreshItemsInOrder();
        } catch(e) {
            console.error(e);
        }
        
    }

    refreshItemsInOrder() {
        const {count, items, subtotal, total} = this.udesly.getState().woocommerce;
        if (!count) {
            window.location = window.udesly_frontend_options.wc.cart_url;
        }
        this.refreshItems(items);
    }

    refreshItems(items: any[]) {
        if (!this.itemsList) {
            return;
        }
        this.itemsList.innerHTML = items.reduce((prev, next) => {
            next.rowTotal = this.includeTaxes ? next.total : next.subtotal;
            return prev+= Eta.render(this.templateFunction, next);
        }, "");
    }
}