import{a as h}from"./chunk-UOJKSOAD.js";import"./chunk-U3UMSI2M.js";async function f(o=!1){let t=o?await import("./wc-models-WSDFKG5K.js"):await import("./models-Y63W2FL2.js");return h({models:t.models,name:o?"WP/WC Store":"WP Store",redux:{devtoolOptions:{disabled:!0}},plugins:[g()]})}var g=()=>({createMiddleware:o=>t=>e=>r=>{let{type:n,payload:i}=r;return window.Udesly.emit(n,i),e(r)}});var m=class{constructor(t="",e){this.store=e;this.eventTarget=document.appendChild(document.createComment(t))}on(t,e){this._listen(t,e)}getState(){return this.store.getState()}dispatch(t,e){return this.store.dispatch({type:t,payload:e})}_listen(t,e,r){this.eventTarget.addEventListener(t,n=>{e(n.detail)},r)}once(t,e){this._listen(t,e,{once:!0})}off(t,e){this.eventTarget.removeEventListener(t,e)}emit(t,e){setTimeout(()=>{this.eventTarget.dispatchEvent(new CustomEvent(t,{detail:e}))},1)}},y=m;function c(o){let t=Array.isArray(window.Udesly)?window.Udesly:[],e=new y("udesly",o);return window.Udesly=e,t.forEach(r=>r()),e}var v="w--current",E=()=>{let o=window.location.toString();document.querySelectorAll(`a[href="${o.slice(0,-1)}"],a[href="${o}"]`).forEach(t=>{t.classList.add(v)}),document.querySelectorAll("[data-tab]").forEach(t=>{let e=t.dataset.tab;e&&t.addEventListener("click",r=>{r.preventDefault(),document.querySelectorAll(`[data-w-tab="${e}"]`).forEach(n=>n.click())})})};function u(o){E(),w(o),o.on("wordpress/postsLoaded",()=>{w(o)}),document.querySelectorAll("form[data-ajax-action]").forEach(t=>{let e=t.parentElement,r=e.querySelector(".w-form-done"),n=e.querySelector(".w-form-fail"),i=n.lastElementChild||n,d=t.getAttribute("data-redirect"),a=t.querySelector("input[type=submit]");a&&(a.dataset.value=a.value),e.onFormError=function(s){i.innerHTML=(s||"Failed to send form").toString(),n.style.display="inherit",a&&(a.value=a.dataset.value)},e.onFormRedirect=function(){d?window.location=d:window.location.href="/"},e.onFormSuccess=function(){t.style.display="none",r.style.display="inherit",a&&(a.value=a.dataset.value),d&&(window.location=d)},t.addEventListener("submit",s=>{r.style.display="none",n.style.display="none",a&&(a.value=a.dataset.wait),s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation();let l=new FormData(t);l.set("action","udesly_ajax_"+t.dataset.ajaxAction),l.set("_referrer",window.location.toString()),o.dispatch("wordpress/sendForm",{parent:t.parentElement,data:l})})})}function w(o){document.querySelectorAll(".w-pagination-wrapper").forEach(t=>{if(t.dataset.paginationInit)return;t.dataset.paginationInit="true";let e=t.dataset.query,r=Number(t.dataset.paged),n=t.closest(".w-dyn-list");t.querySelectorAll(".w-pagination-previous").forEach(i=>{i.addEventListener("click",()=>{o.dispatch("wordpress/loadPosts",{queryName:e,paged:r-1,list:n})},!0)}),t.querySelectorAll(".w-pagination-next").forEach(i=>{i.addEventListener("click",()=>{o.dispatch("wordpress/loadPosts",{queryName:e,paged:r+1,list:n})},!0)})})}window.safari&&(p=null,document.addEventListener("click",function(o){!o.target.closest||(p=o.target.closest("button, input[type=submit]"))},!0),document.addEventListener("submit",function(o){if(!o.submitter){for(var t=[document.activeElement,p],e=0;e<t.length;e++){var r=t[e];if(!!r&&!!r.form&&!!r.matches("button, input[type=button], input[type=image]")){o.submitter=r;return}}o.submitter=o.target.querySelector("button, input[type=button], input[type=image]")}},!0));var p;(async()=>{let o=window.udesly_frontend_options.plugins.woocommerce,t=await f(o),e=o?c(t):c(t);u(e),o&&await(await import("./wc-EEQKNCKZ.js")).default(e)})();
