import {
  getElementsByDataNodeType
} from "./chunk-6B4SAIWY.js";
import {
  onJQueryEvent,
  triggerJQuery
} from "./chunk-2ADP63A3.js";
import {
  __commonJS,
  __toModule
} from "./chunk-F543FC74.js";

// node_modules/lodash.get/index.js
var require_lodash = __commonJS((exports, module) => {
  var FUNC_ERROR_TEXT = "Expected a function";
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var INFINITY = 1 / 0;
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var symbolTag = "[object Symbol]";
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  var reLeadingDot = /^\./;
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reEscapeChar = /\\(\\)?/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  var arrayProto = Array.prototype;
  var funcProto = Function.prototype;
  var objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectToString = objectProto.toString;
  var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  var Symbol = root.Symbol;
  var splice = arrayProto.splice;
  var Map = getNative(root, "Map");
  var nativeCreate = getNative(Object, "create");
  var symbolProto = Symbol ? Symbol.prototype : void 0;
  var symbolToString = symbolProto ? symbolProto.toString : void 0;
  function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.__data__ = {
      hash: new Hash(),
      map: new (Map || ListCache)(),
      string: new Hash()
    };
  }
  function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var stringToPath = memoize(function(string) {
    string = toString(string);
    var result = [];
    if (reLeadingDot.test(string)) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, string2) {
      result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var isArray = Array.isArray;
  function isFunction(value) {
    var tag = isObject(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
  }
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function get2(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  module.exports = get2;
});

// src/wc/variations.ts
var import_lodash = __toModule(require_lodash());
var Variations = class {
  constructor(addToCartForm, udesly) {
    this.addToCartForm = addToCartForm;
    this.udesly = udesly;
    this.selectedClassName = "w--ecommerce-pill-selected";
    this.variationsData = JSON.parse(addToCartForm.dataset["product_variations"]);
    this.variationInput = addToCartForm.querySelector('[name="variation_id"]');
    this.hasVariationSwatches = !!this.addToCartForm.querySelectorAll('[data-node-type="add-to-cart-option-pill-group"]').length;
    this.addToCartForm.addEventListener("change", (e) => {
      if (e.target.tagName !== "SELECT") {
        return;
      }
      this.changeVariation();
    });
    if (this.hasVariationSwatches) {
      this.handleVariationSwatchesEvents();
    }
    this.udesly.on("woocommerce/changeVariation", (variation) => {
      this.onChangeVariation(variation);
    });
    if (this.addToCartForm.closest(".w-dyn-item")) {
      this.variationElements = this.addToCartForm.closest(".w-dyn-item").querySelectorAll("[data-variation-prop]");
    } else {
      this.variationElements = document.querySelectorAll("[data-variation-prop]:not(.w-dyn-item [data-variation-prop])");
    }
  }
  handleVariationSwatchesEvents() {
    this.addToCartForm.querySelectorAll('[data-node-type="add-to-cart-option-pill"]').forEach((pill) => {
      const pillOptionName = pill.dataset.optionName;
      const attributeName = pill.closest('[data-node-type="add-to-cart-option-pill-group"]').getAttribute("aria-label");
      pill.addEventListener("click", (e) => {
        const select = this.addToCartForm.querySelector(`#${attributeName}`);
        if (select) {
          select.value = pillOptionName;
          select.dispatchEvent(new Event("change", {bubbles: true}));
        }
      });
    });
  }
  onChangeVariation(variation) {
    if (this.hasVariationSwatches) {
      this.addToCartForm.querySelectorAll(`.${this.selectedClassName}`).forEach((el) => el.classList.remove(this.selectedClassName));
      for (let attributeKey in variation.attributes) {
        const ariaLabel = attributeKey.replace("attribute_", "");
        this.addToCartForm.querySelectorAll(`[aria-label="${ariaLabel}"] [data-option-name="${variation.attributes[attributeKey]}"]`).forEach((el) => el.classList.add(this.selectedClassName));
      }
    }
    this.variationElements.forEach((el) => {
      const prop = el.dataset.variationProp;
      const propType = el.dataset.variationPropType;
      const value = (0, import_lodash.default)(variation, prop, null);
      if (value) {
        switch (propType) {
          case "ImageRef":
            if (el.tagName == "IMG") {
              el.removeAttribute("srcset");
              el.removeAttribute("sizes");
              el.setAttribute("src", value);
            } else {
              el.style.backgroundImage = `url("${value}")`;
            }
            break;
          default:
            el.innerHTML = value;
        }
      }
    });
  }
  changeVariation() {
    const attributes = this.getAttributes();
    const variation = this.variationsData.find((variant) => {
      return Object.keys(variant.attributes).every((attributeKey) => {
        return attributes[attributeKey] == variant.attributes[attributeKey];
      });
    });
    if (variation) {
      this.currentVariation = variation;
    }
  }
  getAttributes() {
    const value = {};
    this.addToCartForm.querySelectorAll("select").forEach((select) => {
      value[select.name] = select.value;
    });
    return value;
  }
  get variantId() {
    return this.variationInput.value;
  }
  set variantId(id) {
    this.variationInput.value = id;
  }
  get currentVariation() {
    if (!this._currentVariation) {
      this._currentVariation = this.variationsData.find((variation) => variation.variation_id == this.variantId);
    }
    return this._currentVariation;
  }
  set currentVariation(variation) {
    this._currentVariation = variation;
    this.variantId = variation.variation_id;
    this.udesly.dispatch("woocommerce/changeVariation", variation);
  }
};
var variations_default = Variations;

// src/wc/unknown-cart.ts
var UknownCart = class {
  constructor(addToCartForm) {
    this.addToCartForm = addToCartForm;
    this.addToCartForm.querySelectorAll(".button, .qty").forEach((el) => el.classList.remove("button", "qty"));
    if (this.addToCartForm.dataset.productType === "grouped") {
      if (this.addToCartForm.closest(".w-dyn-item")) {
        this.variationElements = this.addToCartForm.closest(".w-dyn-item").querySelectorAll("[data-variation-prop]");
      } else {
        this.variationElements = document.querySelectorAll("[data-variation-prop]:not(.w-dyn-item [data-variation-prop])");
      }
      this.variationElements.forEach((el) => {
        const type = el.dataset.variationProp;
        if (type.startsWith("display_")) {
          el.textContent = "";
        } else if (type.endsWith("_html")) {
          el.textContent = "N/A";
        }
      });
    }
    const classes = JSON.parse(this.addToCartForm.dataset.formClasses || "{}");
    for (let selector in classes) {
      this.addToCartForm.querySelectorAll(selector).forEach((el) => {
        el.className += " " + classes[selector];
      });
    }
  }
};
var unknown_cart_default = UknownCart;

// src/wc/add-to-cart.ts
function initAddToCarts(udesly) {
  getElementsByDataNodeType("commerce-add-to-cart-form").forEach((addToCartForm) => {
    const addToCart = addToCartForm.parentElement;
    const productType = addToCart.getAttribute("data-product-type");
    if (addToCartForm.__udy_inited) {
      return;
    }
    if (productType == "simple" || productType == "variable") {
      addToCartForm.__udy_inited = true;
      addToCartForm.querySelectorAll('[data-node-type="commerce-buy-now-button"]').forEach((buyNow) => {
        buyNow.addEventListener("click", (e) => {
          e.preventDefault();
          udesly.dispatch("woocommerce/addToCart", {...addToCartForm._udeslyGetData(), type: productType, buyNow: true, el: addToCartForm, submitter: buyNow});
        });
      });
      addToCartForm.addEventListener("submit", (e) => {
        e.preventDefault();
        udesly.dispatch("woocommerce/addToCart", {...addToCartForm._udeslyGetData(), type: productType, buyNow: false, el: addToCartForm, submitter: addToCartForm.querySelector('[type="submit"]')});
      });
    }
    if (productType == "variable") {
      new variations_default(addToCartForm, udesly);
    }
    switch (productType) {
      case "simple":
        addToCartForm._udeslyGetData = function() {
          const product_id = this.dataset.skuId;
          const quantity = this.querySelector('[name="quantity"]').value;
          return {product_id, quantity};
        };
        break;
      case "variable":
        addToCartForm._udeslyGetData = function() {
          return Object.fromEntries(new FormData(this).entries());
        };
        break;
    }
  });
  const allCarts = Array.from(document.querySelectorAll("[data-product-type]")).filter((cart) => {
    return !["simple", "variable", "external"].includes(cart.dataset.productType);
  });
  allCarts.forEach((groupedForm) => {
    new unknown_cart_default(groupedForm);
  });
  if (allCarts.length && document.body.classList.contains("single-product")) {
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.href);
    }
  }
}
function manageAddToCarts(udesly) {
  initAddToCarts(udesly);
  udesly.on("wordpress/postsLoaded", () => {
    initAddToCarts(udesly);
  });
}

// src/wc/index.ts
async function wc(udesly) {
  const miniCartsWrappers = getElementsByDataNodeType("commerce-cart-wrapper");
  if (miniCartsWrappers) {
    import("./mini-cart-AQCDXLD4.js").then((miniCartModule) => {
      miniCartsWrappers.forEach((wrapper) => new miniCartModule.default(udesly, wrapper));
    });
  }
  onJQueryEvent("wc_fragments_refreshed wc_fragments_loaded", () => {
    udesly.dispatch("woocommerce/cartChanged");
  });
  onJQueryEvent("checkout_error", (event, errors) => {
    udesly.dispatch("woocommerce/checkoutNotice", errors.toString());
  });
  onJQueryEvent("ajaxComplete", (event, xhr, config) => {
    if (config.url.includes("remove_coupon")) {
      udesly.dispatch("woocommerce/checkoutNotice", xhr.responseText);
    } else if (config.url.includes("update_order_review")) {
      udesly.dispatch("woocommerce/checkoutUpdated");
    }
    if (document.querySelector(".woocommerce-notices-wrapper")) {
      const noticesWrapper = document.querySelector(".woocommerce-notices-wrapper");
      if (noticesWrapper.innerHTML.trim().length > 0) {
        udesly.dispatch("woocommerce/checkoutNotice", noticesWrapper.innerHTML);
        noticesWrapper.innerHTML = "";
      }
    }
  }, document);
  const checkouts = getElementsByDataNodeType("commerce-checkout-form-container");
  if (checkouts) {
    import("./checkout-WOH5RCJY.js").then((checkoutModule) => {
      checkouts.forEach((checkout) => new checkoutModule.default(udesly, checkout));
      triggerJQuery("init_checkout");
    });
  } else {
    wc_checkout_params.is_checkout = "1";
    triggerJQuery("init_checkout");
  }
  const thankyous = document.querySelectorAll('[data-node-type="commerce-order-confirmation-wrapper"] .w-commerce-commercecheckoutorderitemswrapper');
  if (thankyous) {
    import("./thankyou-II57NWZI.js").then((module) => {
      thankyous.forEach((thankyou) => new module.default(thankyou));
    });
  }
  manageAddToCarts(udesly);
  document.body.classList.add("udesly-wc-loaded");
}
export {
  wc as default
};
//# sourceMappingURL=wc-X7VCFK2P.js.map
