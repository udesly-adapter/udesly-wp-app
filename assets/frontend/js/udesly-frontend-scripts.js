import {
  init
} from "./chunk-IPQTGU6P.js";
import "./chunk-F543FC74.js";

// src/store/index.ts
async function initStore(woocommerce = false) {
  const module = woocommerce ? await import("./wc-models-4J5FPKBB.js") : await import("./models-UHLHQ5FZ.js");
  return init({
    models: module.models,
    name: woocommerce ? "WP/WC Store" : "WP Store",
    redux: {
      devtoolOptions: {
        disabled: false
      }
    },
    plugins: [plugin()]
  });
}
var plugin = () => ({
  createMiddleware: (rematchBag) => (store) => (next) => (action) => {
    const {type: actionType, payload} = action;
    window.Udesly.emit(actionType, payload);
    return next(action);
  }
});

// src/utils/udesly.ts
var Udesly = class {
  constructor(description = "", store) {
    this.store = store;
    this.eventTarget = document.appendChild(document.createComment(description));
  }
  on(type, listener) {
    this._listen(type, listener);
  }
  getState() {
    return this.store.getState();
  }
  dispatch(type, payload) {
    return this.store.dispatch({type, payload});
  }
  _listen(type, listener, options) {
    this.eventTarget.addEventListener(type, (evt) => {
      listener(evt.detail);
    }, options);
  }
  once(type, listener) {
    this._listen(type, listener, {once: true});
  }
  off(type, listener) {
    this.eventTarget.removeEventListener(type, listener);
  }
  emit(type, payload) {
    setTimeout(() => {
      this.eventTarget.dispatchEvent(new CustomEvent(type, {detail: payload}));
    }, 1);
  }
};
var udesly_default = Udesly;

// src/utils/init-udesly.ts
function initUdesly(store) {
  const funcs = Array.isArray(window.Udesly) ? window.Udesly : [];
  const u = new udesly_default("udesly", store);
  window.Udesly = u;
  funcs.forEach((fn) => fn());
  return u;
}

// src/wp/index.ts
var CURRENT_CLASSNAME = "w--current";
var addCurrentClassToLinks = () => {
  const currentPath = window.location.toString();
  document.querySelectorAll(`a[href="${currentPath.slice(0, -1)}"],a[href="${currentPath}"]`).forEach((a) => {
    a.classList.add(CURRENT_CLASSNAME);
  });
};
function wp(udesly) {
  addCurrentClassToLinks();
}

// src/udesly-frontend-scripts.ts
if (window.safari) {
  lastBtn = null;
  document.addEventListener("click", function(e) {
    if (!e.target.closest)
      return;
    lastBtn = e.target.closest("button, input[type=submit]");
  }, true);
  document.addEventListener("submit", function(e) {
    if (e.submitter)
      return;
    var canditates = [document.activeElement, lastBtn];
    for (var i = 0; i < canditates.length; i++) {
      var candidate = canditates[i];
      if (!candidate)
        continue;
      if (!candidate.form)
        continue;
      if (!candidate.matches("button, input[type=button], input[type=image]"))
        continue;
      e.submitter = candidate;
      return;
    }
    e.submitter = e.target.querySelector("button, input[type=button], input[type=image]");
  }, true);
}
var lastBtn;
(async () => {
  const woocommerce = window.udesly_frontend_options.plugins.woocommerce;
  const store = await initStore(woocommerce);
  const udesly = woocommerce ? initUdesly(store) : initUdesly(store);
  wp(udesly);
  if (woocommerce) {
    const module = await import("./wc-75DPZICM.js");
    await module.default(udesly);
  }
})();
//# sourceMappingURL=udesly-frontend-scripts.js.map
