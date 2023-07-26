import type Udesly from "../utils/udesly";
import type {WooCommerceRootModel} from "../store/wc-models";
import get from 'lodash.get'

export default class Variations {
    private variationInput: HTMLInputElement;

    private variationsData: any;
    private _currentVariation: any;
    private variationElements: NodeListOf<HTMLElement>;
    private hasVariationSwatches: boolean;
    private selectedClassName = "w--ecommerce-pill-selected";
    private product_id: string;

    constructor(private addToCartForm: HTMLFormElement, private udesly: Udesly<WooCommerceRootModel>) {
        this.variationsData = JSON.parse(addToCartForm.dataset['product_variations']);
        this.variationInput = addToCartForm.querySelector('[name="variation_id"]');
        this.product_id = addToCartForm.dataset.product_id;
        addToCartForm._udeslyAddToCart = this;

        this.hasVariationSwatches = !!this.addToCartForm.querySelectorAll('[data-node-type="add-to-cart-option-pill-group"]').length;

        this.addToCartForm.addEventListener('change', e => {
            if ((e.target as HTMLElement).tagName !== "SELECT") {
                return;
            }
            this.changeVariation((e.target as HTMLSelectElement).name, (e.target as HTMLSelectElement).value);
        });

        if (this.hasVariationSwatches) {
            this.handleVariationSwatchesEvents();
        }

        this.udesly.on("woocommerce/changeVariation", data => {
            if (data.productId == this.product_id)
            this.onChangeVariation(data.variation);
        });

        if (this.addToCartForm.closest('.w-dyn-item')) {
            this.variationElements = this.addToCartForm.closest('.w-dyn-item').querySelectorAll<HTMLElement>('[data-variation-prop]');
        } else {
            this.variationElements = document.querySelectorAll<HTMLElement>('[data-variation-prop]:not(.w-dyn-item [data-variation-prop])');
        }

        this.variationElements.forEach( el => {
            if (el.dataset.variationPropType == "Set") {
                const item = el.querySelector('[data-repeater-prop="item"], .w-dyn-item');
                if (item) {
                    el.__item = item.cloneNode(true);
                    el.__item.classList.remove('udesly-hidden');
                    item.remove();
                }
                console.log(item);
            }
        })
    }

    handleVariationSwatchesEvents() {
        this.addToCartForm.querySelectorAll<HTMLElement>('[data-node-type="add-to-cart-option-pill"]').forEach( pill => {
            const pillOptionName = pill.dataset.optionName;
            const attributeName = pill.closest('[data-node-type="add-to-cart-option-pill-group"]').getAttribute('aria-label');

            pill.addEventListener('click', e => {
              const select = this.addToCartForm.querySelector<HTMLSelectElement>(`[id="${attributeName}"]`);
              if (select) {
                  select.value = pillOptionName;
                  select.dispatchEvent(new Event('change', {bubbles: true}));
              }
            });
        });
    }

    onChangeVariation(variation) {

        if(variation.is_in_stock) {
            this.addToCartForm.parentElement.querySelectorAll<HTMLElement>('.w-commerce-commerceaddtocartoutofstock').forEach(e => {
                e.style.display = "none"
            })
            this.addToCartForm.parentElement.classList.remove('out-of-stock');
            this.addToCartForm.parentElement.classList.add('in-stock');
        } else {
            this.addToCartForm.parentElement.classList.remove('in-stock');
            this.addToCartForm.parentElement.classList.add('out-of-stock');
            this.addToCartForm.parentElement.querySelectorAll<HTMLElement>('.w-commerce-commerceaddtocartoutofstock').forEach(e => {
                e.style.display = ""
            })
        }

        if (this.hasVariationSwatches) {
            this.addToCartForm.querySelectorAll(`.${this.selectedClassName}`).forEach(el => el.classList.remove(this.selectedClassName));
            for (let attributeKey in variation.attributes) {
                const ariaLabel = attributeKey.replace('attribute_', '');
                this.addToCartForm.querySelectorAll(`[aria-label="${ariaLabel}"] [data-option-name="${variation.attributes[attributeKey]}"]`).forEach(
                    el => el.classList.add(this.selectedClassName)
                )
            }
        }

        this.variationElements.forEach( el => {
            const prop = el.dataset.variationProp;
            const propType = el.dataset.variationPropType;
            const value = get(variation, prop, null);
            if (value || prop === "display_regular_price_html" || propType == "Bool") {
                switch (propType) {
                    case "Bool":
                        if (!!value) {
                            el.classList.remove('udesly-hidden');
                        } else {
                            el.classList.add('udesly-hidden');
                        }
                        break;
                    case "ImageRef":
                        if (el.tagName == "IMG") {
                            el.removeAttribute('srcset');
                            el.removeAttribute('sizes');
                            el.setAttribute('src', value);
                        } else {
                            el.style.backgroundImage = `url("${value}")`;
                        }
                        if (el.classList.contains('w-lightbox')) {
                            const script = el.querySelector('script.w-json');
                            if (script) {
                                const oldItems = JSON.parse(script.textContent!);
                                oldItems.items = [
                                    {
                                        "type": "image",
                                        "url": value,
                                        "caption": ""
                                    }
                                ];
                                script.textContent = JSON.stringify(oldItems);
                            }
                        }
                        break;
                    case "Set":
                        console.log(el);
                        if(!el.__item) {
                            return;
                        }
                        const items = el.querySelector('.w-dyn-items');
                        items.innerHTML = "";
                        if (!value.length) {
                            el.querySelector('.w-dyn-empty')?.classList.remove('udesly-hidden');
                        } else {
                            el.querySelector('.w-dyn-empty')?.classList.add('udesly-hidden');

                            for (let image of value) {
                                const item = el.__item.cloneNode(true);
                                item.querySelectorAll('[data-repeater-prop]').forEach(e => {
                                    if (e.classList.contains('w-lightbox')) {
                                        const script = e.querySelector('script.w-json');
                                        if (script) {
                                            const oldItems = JSON.parse(script.textContent);
                                            oldItems.items = [
                                                {
                                                    "type": "image",
                                                    "url": image.image.src,
                                                    "caption": image.image.caption
                                                }
                                            ];
                                            script.textContent = JSON.stringify(oldItems);
                                        }
                                    } else if (e.tagName == "IMG") {
                                        e.setAttribute('src', image.image.src);
                                        e.removeAttribute('srcset');
                                        e.setAttribute('alt', image.image.alt);
                                    } else {
                                        e.style.backgroundImage = `url("${image.image.src}")`;
                                    }
                                });
                                items.append(item);
                            }
                            //@ts-ignore
                            Webflow.require('lightbox') && Webflow.require('lightbox').ready()

                        }

                        break;
                    default:
                        el.innerHTML = value;
                }
            }
        });
    }

    changeVariation(name, value) {
        const attributes = this.getAttributes();
        const variation = this.variationsData.find( variant => {
            return Object.keys(variant.attributes).every( attributeKey => {
                return attributes[attributeKey] == variant.attributes[attributeKey];
            });
        })
        if (variation) {
            this.currentVariation = variation;
        } else {
            const firstVariation = this.variationsData.find(variant => variant.attributes[name] == value);
            if (firstVariation) {
                this.currentVariation = firstVariation
                Object.keys(firstVariation.attributes).forEach( attributeKey => {
                    const select = this.addToCartForm.querySelector<HTMLSelectElement>(`[id="${attributeKey.replace('attribute_', '')}"]`);
                    if (select) {
                        select.value = firstVariation.attributes[attributeKey];
                    }
                });
            }
        }
    }

    getAttributes() {
        const value = {};
        this.addToCartForm.querySelectorAll('select').forEach( select => {
            value[select.name] = select.value;
        });
        return value;
    }

    get variantId() {
        return this.variationInput.value;
    }

    set variantId(id: string) {
        this.variationInput.value = id;
    }

    get currentVariation() {
        if (!this._currentVariation) {
            this._currentVariation = this.variationsData.find(variation => variation.variation_id == this.variantId);
        }
        return this._currentVariation;
    }

    set currentVariation(variation) {
        this._currentVariation = variation;
        this.variantId = variation.variation_id;
        this.udesly.dispatch("woocommerce/changeVariation", {variation, productId: this.product_id});
    }
}