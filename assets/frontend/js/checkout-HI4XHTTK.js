import{a as m}from"./chunk-O76OGNBI.js";import{b as s}from"./chunk-WX2YIHWY.js";import{c as u}from"./chunk-U3UMSI2M.js";var r=u(m());r.default.config.autoEscape=!1;var c=class{constructor(e,t){this.udesly=e;this.checkoutWrapper=t;wc_checkout_params.wc_ajax_url+="&udesly_checkout=true",wc_checkout_params.checkout_url+="&udesly_checkout=true",wc_checkout_params.is_checkout="1",jQuery.scroll_to_notices=()=>{let o=this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-error-state"]');o&&o.scrollIntoView({block:"center",behavior:"smooth"})},this.includeTaxes=window.udesly_frontend_options.wc.show_taxes==="incl",this.handleItemsInOrder(this.checkoutWrapper.querySelector(".w-commerce-commercecheckoutorderitemswrapper")),this.handleCoupon(),this.initDOMEvents(),this.initStoreEvents()}initDOMEvents(){this.checkoutWrapper.querySelectorAll('[data-node-type="commerce-checkout-place-order-button"]').forEach(e=>{e.tagName=="A"&&e.addEventListener("click",t=>{this.checkoutWrapper.dispatchEvent(new Event("submit",{bubbles:!0}))})}),this.checkoutWrapper.addEventListener("change",()=>{this.hideErrorState()})}initStoreEvents(){s("update_checkout",()=>{this.udesly.dispatch("woocommerce/updateCheckout")}),this.udesly.on("woocommerce/checkoutNotice",e=>{this.checkoutWrapper.querySelectorAll(".woocommerce-NoticeGroup-checkout").forEach(o=>o.remove());let t=this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-error-state"]');t&&(t.outerHTML=e,requestAnimationFrame(()=>{this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-error-state"]').scrollIntoView({block:"center",behavior:"smooth"})}))})}hideErrorState(){let e=this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-error-state"]');e&&(e.style.display="none")}handleCoupon(){if(!this.checkoutWrapper.querySelector('[data-node-type="commerce-checkout-discount-form"]'))return;let t=document.querySelector("form#coupon_form");!t||t&&t.addEventListener("submit",o=>{this.hideErrorState(),o.preventDefault(),o.stopPropagation(),o.stopImmediatePropagation(),this.udesly.dispatch("woocommerce/applyCoupon",{coupon_code:this.checkoutWrapper.querySelector("input[name=coupon_code]").value})},!0)}handleItemsInOrder(e){if(!e)return;let t=e.querySelector('script[type="text/x-wf-template"]').textContent;this.templateFunction=r.default.compile(t),this.itemsList=e.querySelector(".w-commerce-commercecheckoutorderitemslist"),this.udesly.on("woocommerce/cartChanged",()=>{this.refreshItemsInOrder()}),this.refreshItemsInOrder()}refreshItemsInOrder(){let{count:e,items:t,subtotal:o,total:a}=this.udesly.getState().woocommerce;e||(window.location=window.udesly_frontend_options.wc.cart_url),this.refreshItems(t)}refreshItems(e){!this.itemsList||(this.itemsList.innerHTML=e.reduce((t,o)=>(o.rowTotal=this.includeTaxes?o.total:o.subtotal,t+=r.default.render(this.templateFunction,o)),""))}},p=c;export{p as default};
