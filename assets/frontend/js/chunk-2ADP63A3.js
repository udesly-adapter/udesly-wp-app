// src/utils/triggers.ts
function triggerJQuery(event, data = null) {
  setTimeout(() => {
    jQuery(document.body).trigger(event, data);
  }, 1);
}
function onJQueryEvent(event, callback, target = document.body) {
  jQuery(target).on(event, callback);
}
function triggerWebflowInteractions() {
  const Webflow = window.Webflow;
  if (Webflow && Webflow.require("ix2")) {
    Webflow.require("ix2").init();
    document.dispatchEvent(new Event("scroll"));
  }
}

export {
  triggerJQuery,
  onJQueryEvent,
  triggerWebflowInteractions
};
//# sourceMappingURL=chunk-2ADP63A3.js.map
