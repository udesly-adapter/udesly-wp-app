import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import Eta from '../utils/eta';
import {triggerJQuery} from "../utils/triggers";

Eta.config.autoEscape = false;


export default class Checkout {
    private templateFunction: any;
    private itemsList?: Element;
    private includeTaxes: boolean;

    constructor(private udesly: Udesly<WooCommerceRootModel>, private checkoutWrapper: HTMLElement) {

        wc_checkout_params.wc_ajax_url+="&udesly_checkout=true"
        wc_checkout_params.is_checkout = "1";
        this.includeTaxes = window.udesly_frontend_options.wc.show_taxes === "incl";
        this.handleItemsInOrder(this.checkoutWrapper.querySelector(".w-commerce-commercecheckoutblockcontent"));

        this.handleCoupon();

        this.initDOMEvents();
    }

    initDOMEvents() {
        this.checkoutWrapper.querySelectorAll('[data-node-type="commerce-checkout-place-order-button"]').forEach(el => {
            el.addEventListener('click', e => {
                console.log(this.checkoutWrapper);
                this.checkoutWrapper.dispatchEvent(new Event('submit', {bubbles: true}))
            })
        })
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
               e.preventDefault();
               e.stopPropagation();
               e.stopImmediatePropagation();
               this.udesly.dispatch("woocommerce/applyCoupon", {
                   coupon_code: couponForm.querySelector('input[name=coupon_code]').value
               });
           }, true);
        }
    }

    handleItemsInOrder(wrapper: HTMLElement) {
        if(!wrapper) {
            return;
        }
        const template = wrapper.querySelector('script[type="text/x-wf-template"]').textContent;

        this.templateFunction = Eta.compile(template);
        
        this.itemsList = wrapper.querySelector('.w-commerce-commercecheckoutorderitemslist');

        this.udesly.on("woocommerce/cartChanged", () => {
            this.refreshItemsInOrder()
        });
        this.refreshItemsInOrder();
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