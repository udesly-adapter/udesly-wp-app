// src/utils/webflow.ts
function getElementByDataNodeType(type, el) {
  if (el) {
    return el.querySelector(`[data-node-type="${type}"]`);
  }
  return document.querySelector(`[data-node-type="${type}"]`);
}
function getElementsByDataNodeType(type, el) {
  if (el) {
    return el.querySelectorAll(`[data-node-type="${type}"]`);
  }
  return document.querySelectorAll(`[data-node-type="${type}"]`);
}
function handleChangeCartStateEvent(e, el) {
  if (e.currentTarget instanceof Element && e instanceof CustomEvent) {
    const t = e.currentTarget, n = e.detail, r = t.hasAttribute("data-cart-open"), o = n && n.open != null ? n.open : !r, i = getElementByDataNodeType("commerce-cart-container-wrapper", el);
    if (i) {
      const c = getElementByDataNodeType("commerce-cart-container", el);
      if (c) {
        const a = i.parentElement;
        if (a) {
          let u = a.getAttribute("data-wf-cart-type"), s = a.getAttribute("data-wf-cart-duration") || 300 + "ms", d = a.getAttribute("data-wf-cart-easing") || "ease-out-quad", l = "opacity " + s + " ease 0ms", M = s !== "0ms", b = void 0, m = void 0;
          switch (u) {
            case "modal":
              b = {
                scale: 0.95
              };
              m = {
                scale: 1
              };
              break;
            case "leftSidebar":
              b = {
                x: -30
              };
              m = {
                x: 0
              };
              break;
            case "rightSidebar":
              b = {
                x: 30
              };
              m = {
                x: 0
              };
              break;
            case "leftDropdown":
            case "rightDropdown":
              b = {
                y: -10
              };
              m = {
                y: 0
              };
          }
          o ? (t.setAttribute("data-cart-open", ""), i.style.removeProperty("display"), M && !r && (window.Webflow.tram(i).add(l).set({
            opacity: 0
          }).start({
            opacity: 1
          }), window.Webflow.tram(c).add("transform " + s + " " + d + " 0ms").set(b).start(m))) : (t.removeAttribute("data-cart-open"), M ? (window.Webflow.tram(i).add(l).start({
            opacity: 0
          }).then(function() {
            i.style.display = "none", window.Webflow.tram(c).stop();
          }), window.Webflow.tram(c).add("transform " + s + " " + d + " 50ms").start(b)) : i.style.display = "none");
        }
      }
    }
  }
}

export {
  getElementByDataNodeType,
  getElementsByDataNodeType,
  handleChangeCartStateEvent
};
//# sourceMappingURL=chunk-6B4SAIWY.js.map
