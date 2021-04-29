export default class UknownCart {
    private variationElements: NodeListOf<Element>;

    constructor(private addToCartForm: HTMLElement) {

        this.addToCartForm.querySelectorAll('.button, .qty').forEach(el => el.classList.remove('button', 'qty'))

        if (this.addToCartForm.dataset.productType === "grouped") {
            if (this.addToCartForm.closest('.w-dyn-item')) {
                this.variationElements = this.addToCartForm.closest('.w-dyn-item').querySelectorAll('[data-variation-prop]');
            } else {
                this.variationElements = document.querySelectorAll('[data-variation-prop]:not(.w-dyn-item [data-variation-prop])');
            }
            this.variationElements.forEach( el => {
                const type = el.dataset.variationProp;
                if (type.startsWith('display_')) {
                    el.textContent = "";
                } else if (type.endsWith('_html')) {
                    el.textContent = "N/A"
                }
            })
        }

        const classes = JSON.parse(this.addToCartForm.dataset.formClasses || "{}");

        for (let selector in classes) {
            this.addToCartForm.querySelectorAll(selector).forEach( el => {
                el.className+=" " +classes[selector];
            })
        }

    }
}