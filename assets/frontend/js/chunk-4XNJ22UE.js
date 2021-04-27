// src/utils/triggers.ts
function triggerJQuery(event, data = null) {
  setTimeout(() => {
    jQuery(document.body).trigger(event, data);
  }, 1);
}
function onJQueryEvent(event, callback, target = document.body) {
  jQuery(target).on(event, callback);
}

export {
  triggerJQuery,
  onJQueryEvent
};
//# sourceMappingURL=chunk-4XNJ22UE.js.map
