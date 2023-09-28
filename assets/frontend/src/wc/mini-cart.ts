import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import {getElementByDataNodeType, getElementsByDataNodeType, handleChangeCartStateEvent} from "../utils/webflow";
import Eta from '../utils/eta';

Eta.config.autoEscape = false;

export default class MiniCart {

    templateFunction = Function;
    private readonly openOnProductAdded: boolean;
    private readonly openOnHover: boolean;
    private emptyState: HTMLElement;
    private itemsState: HTMLElement;
    private includeTaxes: boolean;
    private itemsList: Element;

    constructor(private udesly: Udesly<WooCommerceRootModel>, private wrapper: HTMLElement) {

       let template = wrapper.querySelector('script[type="text/x-wf-template"]').textContent!;

       template = template.replace(/product\.fullSlug/gm, 'url')

       this.templateFunction = Eta.compile(template);

        this.openOnProductAdded = this.wrapper.hasAttribute('data-open-product');

        this.openOnHover = this.wrapper.hasAttribute('data-open-on-hover');

        this.emptyState = this.wrapper.querySelector('.w-commerce-commercecartemptystate');
        this.itemsState = this.wrapper.querySelector('.w-commerce-commercecartform');
        this.itemsList = this.wrapper.querySelector('.w-commerce-commercecartlist');

        this.initDomEvents();

        this.includeTaxes = window.udesly_frontend_options.wc.show_taxes === "incl";

        this.initStoreEvents();

    }

    initStoreEvents() {
        this.udesly.on("woocommerce/toggleCart", () => {
            const rect = this.wrapper.getBoundingClientRect();
            if (rect.width == 0 || rect.height == 0) {
                return;
            }
            setTimeout(() => {
                const cartOpen = this.udesly.getState().woocommerce.cartOpen
                this.wrapper.dispatchEvent(new CustomEvent("wf-change-cart-state", {
                    detail: {
                        open: cartOpen
                    }
                }))
            }, 1)

        })

        this.udesly.on("woocommerce/cartChanged", () => {
            this.refreshCart()
        });

        if (this.openOnProductAdded) {
            this.udesly.on("woocommerce/addedToCart", () => {
                this.wrapper.dispatchEvent(new CustomEvent("wf-change-cart-state", {
                    detail: {
                        open: true
                    }
                }))
                this.udesly.dispatch("woocommerce/setCartOpen", true);
            });
        }

        this.refreshCart();
    }

    updateCartCount(itemsCount) {

       this.wrapper.querySelectorAll('.w-commerce-commercecartopenlinkcount').forEach(cartCount => {
            cartCount.textContent = itemsCount;
        })

        this.wrapper.querySelectorAll('[data-count-hide-rule]').forEach(cartCount => {
            if (cartCount.getAttribute('data-count-hide-rule') === "empty") {
                if (itemsCount === 0) {
                    cartCount.style.display = "none"
                } else {
                    cartCount.style.display = "block";
                }
            }
        })
    }

    refreshCart() {
        this.wrapper.querySelectorAll('.udy-loading').forEach(el => el.classList.remove('udy-loading'));
        const {count, items, subtotal, total} = this.udesly.getState().woocommerce;

        this.updateCartCount(count);

        this.refreshTotal(this.includeTaxes ? total : subtotal);

        if (items.length) {
            this.refreshItems(items);
            this.emptyState.style.display = "none";
            this.itemsState.style.display = "";
        } else {
            this.emptyState.style.display = "";
            this.itemsState.style.display = "none";
        }
    }

    refreshItems(items: any[]) {
        this.itemsList.innerHTML = items.reduce((prev, next) => {
            next.rowTotal = this.includeTaxes ? next.total : next.subtotal;
            return prev+= Eta.render(this.templateFunction, next);
        }, "");
    }

    refreshTotal(total) {
        this.wrapper.querySelectorAll('.w-commerce-commercecartordervalue').forEach( order => {
            order.innerHTML = total;
        })
    }

    initDomEvents() {

        this.wrapper.addEventListener('wf-change-cart-state', (e : CustomEvent) => {
            handleChangeCartStateEvent(e, this.wrapper);
        });
        getElementsByDataNodeType("commerce-cart-open-link", this.wrapper).forEach(openLink => {
            openLink.addEventListener("click", () => {
                this.udesly.dispatch("woocommerce/toggleCart")
            }, true)
            if (this.openOnHover) {
                openLink.addEventListener("mouseenter", () => {
                    this.udesly.dispatch("woocommerce/toggleCart")
                }, true)
                const container = getElementByDataNodeType('commerce-cart-container', this.wrapper);
                if (container) {
                    container.addEventListener("mouseleave", () => {
                        this.udesly.dispatch("woocommerce/toggleCart")
                    })
                }
            }
        });

        this.wrapper.addEventListener('submit', e => {
            e.preventDefault();
        })

        this.wrapper.addEventListener('change', e => {
            if (e.target.matches('.w-commerce-commercecartquantity')) {
                const target = e.target;
                e.target.closest('.w-commerce-commercecartitem')?.classList.add('udy-loading');
                this.wrapper.querySelector('.w-commerce-commercecartordervalue')?.classList.add('udy-loading');
                this.udesly.dispatch("woocommerce/updateCartQuantity", {
                    key: target.name,
                    quantity: target.value,
                })
                e.preventDefault();
            }
        })

        getElementsByDataNodeType("commerce-cart-close-link", this.wrapper).forEach(closeLink => {
            closeLink.addEventListener("click", () => {
                this.udesly.dispatch("woocommerce/toggleCart")
            }, true)
        });

        getElementsByDataNodeType("commerce-cart-container-wrapper", this.wrapper).forEach(w => {
            w.addEventListener("click", e => {
                if (!e.target.matches(`[data-node-type="commerce-cart-container"], [data-node-type="commerce-cart-container"] *`)) {
                    this.udesly.dispatch("woocommerce/toggleCart")
                }
                if (e.target.matches(`[data-node-type="cart-remove-link"]`)) {
                    e.target.closest('.w-commerce-commercecartitem')?.classList.add('udy-loading');
                    this.wrapper.querySelector('.w-commerce-commercecartordervalue')?.classList.add('udy-loading');
                    this.udesly.dispatch("woocommerce/removeFromCart", e.target.getAttribute('key'))
                    e.preventDefault();
                }
            }, true)
        });

    }
}
