import {
  getElementByDataNodeType,
  getElementsByDataNodeType,
  handleChangeCartStateEvent
} from "./chunk-6B4SAIWY.js";
import {
  __commonJS,
  __toModule
} from "./chunk-F543FC74.js";

// src/utils/eta.js
var require_eta = __commonJS((exports, module) => {
  !function(e, n) {
    typeof exports == "object" && typeof module != "undefined" ? n(exports) : typeof define == "function" && define.amd ? define(["exports"], n) : n((e = typeof globalThis != "undefined" ? globalThis : e || self).Eta = {});
  }(exports, function(e) {
    "use strict";
    function n(e2) {
      var t2, r2, i2 = new Error(e2);
      return t2 = i2, r2 = n.prototype, Object.setPrototypeOf ? Object.setPrototypeOf(t2, r2) : t2.__proto__ = r2, i2;
    }
    function t(e2, t2, r2) {
      var i2 = t2.slice(0, r2).split(/\n/), a2 = i2.length, o2 = i2[a2 - 1].length + 1;
      throw n(e2 += " at line " + a2 + " col " + o2 + ":\n\n  " + t2.split(/\n/)[a2 - 1] + "\n  " + Array(o2).join(" ") + "^");
    }
    n.prototype = Object.create(Error.prototype, {name: {value: "Eta Error", enumerable: false}});
    var r = new Function("return this")().Promise;
    function i(e2, n2) {
      for (var t2 in n2)
        r2 = n2, i2 = t2, Object.prototype.hasOwnProperty.call(r2, i2) && (e2[t2] = n2[t2]);
      var r2, i2;
      return e2;
    }
    function a(e2, n2, t2, r2) {
      var i2, a2;
      return Array.isArray(n2.autoTrim) ? (i2 = n2.autoTrim[1], a2 = n2.autoTrim[0]) : i2 = a2 = n2.autoTrim, (t2 || t2 === false) && (i2 = t2), (r2 || r2 === false) && (a2 = r2), a2 || i2 ? i2 === "slurp" && a2 === "slurp" ? e2.trim() : (i2 === "_" || i2 === "slurp" ? e2 = function(e3) {
        return String.prototype.trimLeft ? e3.trimLeft() : e3.replace(/^\s+/, "");
      }(e2) : i2 !== "-" && i2 !== "nl" || (e2 = e2.replace(/^(?:\r\n|\n|\r)/, "")), a2 === "_" || a2 === "slurp" ? e2 = function(e3) {
        return String.prototype.trimRight ? e3.trimRight() : e3.replace(/\s+$/, "");
      }(e2) : a2 !== "-" && a2 !== "nl" || (e2 = e2.replace(/(?:\r\n|\n|\r)$/, "")), e2) : e2;
    }
    var o = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"};
    function c(e2) {
      return o[e2];
    }
    var s = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g, l = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g, u = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
    function p(e2) {
      return e2.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
    }
    function f(e2, n2) {
      var r2 = [], i2 = false, o2 = 0, c2 = n2.parse;
      if (n2.plugins)
        for (var f2 = 0; f2 < n2.plugins.length; f2++) {
          (T = n2.plugins[f2]).processTemplate && (e2 = T.processTemplate(e2, n2));
        }
      function d2(e3, t2) {
        e3 && (e3 = a(e3, n2, i2, t2)) && (e3 = e3.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n"), r2.push(e3));
      }
      n2.rmWhitespace && (e2 = e2.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "")), s.lastIndex = 0, l.lastIndex = 0, u.lastIndex = 0;
      for (var g2, h2 = [c2.exec, c2.interpolate, c2.raw].reduce(function(e3, n3) {
        return e3 && n3 ? e3 + "|" + p(n3) : n3 ? p(n3) : e3;
      }, ""), m2 = new RegExp("([^]*?)" + p(n2.tags[0]) + "(-|_)?\\s*(" + h2 + ")?\\s*", "g"), v2 = new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?" + p(n2.tags[1]) + ")", "g"); g2 = m2.exec(e2); ) {
        o2 = g2[0].length + g2.index;
        var y2 = g2[1], x2 = g2[2], _ = g2[3] || "";
        d2(y2, x2), v2.lastIndex = o2;
        for (var w = void 0, b = false; w = v2.exec(e2); ) {
          if (w[1]) {
            var E = e2.slice(o2, w.index);
            m2.lastIndex = o2 = v2.lastIndex, i2 = w[2], b = {t: _ === c2.exec ? "e" : _ === c2.raw ? "r" : _ === c2.interpolate ? "i" : "", val: E};
            break;
          }
          var I = w[0];
          if (I === "/*") {
            var R = e2.indexOf("*/", v2.lastIndex);
            R === -1 && t("unclosed comment", e2, w.index), v2.lastIndex = R;
          } else if (I === "'") {
            l.lastIndex = w.index, l.exec(e2) ? v2.lastIndex = l.lastIndex : t("unclosed string", e2, w.index);
          } else if (I === '"') {
            u.lastIndex = w.index, u.exec(e2) ? v2.lastIndex = u.lastIndex : t("unclosed string", e2, w.index);
          } else if (I === "`") {
            s.lastIndex = w.index, s.exec(e2) ? v2.lastIndex = s.lastIndex : t("unclosed string", e2, w.index);
          }
        }
        b ? r2.push(b) : t("unclosed tag", e2, g2.index + y2.length);
      }
      if (d2(e2.slice(o2, e2.length), false), n2.plugins)
        for (f2 = 0; f2 < n2.plugins.length; f2++) {
          var T;
          (T = n2.plugins[f2]).processAST && (r2 = T.processAST(r2, n2));
        }
      return r2;
    }
    function d(e2, n2) {
      var t2 = f(e2, n2), r2 = "var tR='',__l,__lP" + (n2.include ? ",include=E.include.bind(E)" : "") + (n2.includeFile ? ",includeFile=E.includeFile.bind(E)" : "") + "\nfunction layout(p,d){__l=p;__lP=d}\n" + (n2.useWith ? "with(" + n2.varName + "||{}){" : "") + function(e3, n3) {
        var t3 = 0, r3 = e3.length, i3 = "";
        for (; t3 < r3; t3++) {
          var a3 = e3[t3];
          if (typeof a3 == "string") {
            i3 += "tR+='" + a3 + "'\n";
          } else {
            var o2 = a3.t, c2 = a3.val || "";
            o2 === "r" ? (n3.filter && (c2 = "E.filter(" + c2 + ")"), i3 += "tR+=" + c2 + "\n") : o2 === "i" ? (n3.filter && (c2 = "E.filter(" + c2 + ")"), n3.autoEscape && (c2 = "E.e(" + c2 + ")"), i3 += "tR+=" + c2 + "\n") : o2 === "e" && (i3 += c2 + "\n");
          }
        }
        return i3;
      }(t2, n2) + (n2.includeFile ? "if(__l)tR=" + (n2.async ? "await " : "") + "includeFile(__l,Object.assign(" + n2.varName + ",{body:tR},__lP))\n" : n2.include ? "if(__l)tR=" + (n2.async ? "await " : "") + "include(__l,Object.assign(" + n2.varName + ",{body:tR},__lP))\n" : "") + "if(cb){cb(null,tR)} return tR" + (n2.useWith ? "}" : "");
      if (n2.plugins)
        for (var i2 = 0; i2 < n2.plugins.length; i2++) {
          var a2 = n2.plugins[i2];
          a2.processFnString && (r2 = a2.processFnString(r2, n2));
        }
      return r2;
    }
    var g = new (function() {
      function e2(e3) {
        this.cache = e3;
      }
      return e2.prototype.define = function(e3, n2) {
        this.cache[e3] = n2;
      }, e2.prototype.get = function(e3) {
        return this.cache[e3];
      }, e2.prototype.remove = function(e3) {
        delete this.cache[e3];
      }, e2.prototype.reset = function() {
        this.cache = {};
      }, e2.prototype.load = function(e3) {
        i(this.cache, e3);
      }, e2;
    }())({});
    var h = {async: false, autoEscape: true, autoTrim: [false, "nl"], cache: false, e: function(e2) {
      var n2 = String(e2);
      return /[&<>"']/.test(n2) ? n2.replace(/[&<>"']/g, c) : n2;
    }, include: function(e2, t2) {
      var r2 = this.templates.get(e2);
      if (!r2)
        throw n('Could not fetch template "' + e2 + '"');
      return r2(t2, this);
    }, parse: {exec: "", interpolate: "=", raw: "~"}, plugins: [], rmWhitespace: false, tags: ["<%", "%>"], templates: g, useWith: false, varName: "it"};
    function m(e2, n2) {
      var t2 = {};
      return i(t2, h), n2 && i(t2, n2), e2 && i(t2, e2), t2;
    }
    function v(e2, t2) {
      var r2 = m(t2 || {}), i2 = r2.async ? function() {
        try {
          return new Function("return (async function(){}).constructor")();
        } catch (e3) {
          throw e3 instanceof SyntaxError ? n("This environment doesn't support async/await") : e3;
        }
      }() : Function;
      try {
        return new i2(r2.varName, "E", "cb", d(e2, r2));
      } catch (t3) {
        throw t3 instanceof SyntaxError ? n("Bad template syntax\n\n" + t3.message + "\n" + Array(t3.message.length + 1).join("=") + "\n" + d(e2, r2) + "\n") : t3;
      }
    }
    function y(e2, n2) {
      if (n2.cache && n2.name && n2.templates.get(n2.name))
        return n2.templates.get(n2.name);
      var t2 = typeof e2 == "function" ? e2 : v(e2, n2);
      return n2.cache && n2.name && n2.templates.define(n2.name, t2), t2;
    }
    function x(e2, t2, i2, a2) {
      var o2 = m(i2 || {});
      if (!o2.async)
        return y(e2, o2)(t2, o2);
      if (!a2) {
        if (typeof r == "function")
          return new r(function(n2, r2) {
            try {
              n2(y(e2, o2)(t2, o2));
            } catch (e3) {
              r2(e3);
            }
          });
        throw n("Please provide a callback function, this env doesn't support Promises");
      }
      try {
        y(e2, o2)(t2, o2, a2);
      } catch (e3) {
        return a2(e3);
      }
    }
    e.compile = v, e.compileToString = d, e.config = h, e.configure = function(e2) {
      return i(h, e2);
    }, e.defaultConfig = h, e.getConfig = m, e.parse = f, e.render = x, e.renderAsync = function(e2, n2, t2, r2) {
      return x(e2, n2, Object.assign({}, t2, {async: true}), r2);
    }, e.templates = g, Object.defineProperty(e, "__esModule", {value: true});
  });
});

// src/wc/mini-cart.ts
var import_eta = __toModule(require_eta());
import_eta.default.config.autoEscape = false;
var MiniCart = class {
  constructor(udesly, wrapper) {
    this.udesly = udesly;
    this.wrapper = wrapper;
    this.templateFunction = Function;
    const template = wrapper.querySelector('script[type="text/x-wf-template"]').textContent;
    this.templateFunction = import_eta.default.compile(template);
    this.openOnProductAdded = this.wrapper.hasAttribute("data-open-product");
    this.openOnHover = this.wrapper.hasAttribute("data-open-on-hover");
    this.emptyState = this.wrapper.querySelector(".w-commerce-commercecartemptystate");
    this.itemsState = this.wrapper.querySelector(".w-commerce-commercecartform");
    this.itemsList = this.wrapper.querySelector(".w-commerce-commercecartlist");
    this.initDomEvents();
    this.includeTaxes = window.udesly_frontend_options.wc.show_taxes === "incl";
    this.initStoreEvents();
  }
  initStoreEvents() {
    this.udesly.on("woocommerce/toggleCart", () => {
      if (window.getComputedStyle(this.wrapper).display == "none") {
        return;
      }
      this.wrapper.dispatchEvent(new CustomEvent("wf-change-cart-state", {
        detail: {
          open: this.udesly.getState().woocommerce.cartOpen
        }
      }));
    });
    this.udesly.on("woocommerce/cartChanged", () => {
      this.refreshCart();
    });
    if (this.openOnProductAdded) {
      this.udesly.on("woocommerce/addedToCart", () => {
        this.udesly.dispatch("woocommerce/toggleCart");
      });
    }
    this.refreshCart();
  }
  updateCartCount(itemsCount) {
    this.wrapper.querySelectorAll(".w-commerce-commercecartopenlinkcount").forEach((cartCount) => {
      cartCount.textContent = itemsCount;
    });
    this.wrapper.querySelectorAll("[data-count-hide-rule]").forEach((cartCount) => {
      if (cartCount.getAttribute("data-count-hide-rule") === "empty") {
        if (itemsCount === 0) {
          cartCount.style.display = "none";
        } else {
          cartCount.style.display = "block";
        }
      }
    });
  }
  refreshCart() {
    this.wrapper.querySelectorAll(".udy-loading").forEach((el) => el.classList.remove("udy-loading"));
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
  refreshItems(items) {
    this.itemsList.innerHTML = items.reduce((prev, next) => {
      next.rowTotal = this.includeTaxes ? next.total : next.subtotal;
      return prev += import_eta.default.render(this.templateFunction, next);
    }, "");
  }
  refreshTotal(total) {
    this.wrapper.querySelectorAll(".w-commerce-commercecartordervalue").forEach((order) => {
      order.innerHTML = total;
    });
  }
  initDomEvents() {
    this.wrapper.addEventListener("wf-change-cart-state", (e) => handleChangeCartStateEvent(e, this.wrapper));
    getElementsByDataNodeType("commerce-cart-open-link", this.wrapper).forEach((openLink) => {
      openLink.addEventListener("click", () => {
        this.udesly.dispatch("woocommerce/toggleCart");
      }, true);
      if (this.openOnHover) {
        openLink.addEventListener("mouseenter", () => {
          this.udesly.dispatch("woocommerce/toggleCart");
        }, true);
        const container = getElementByDataNodeType("commerce-cart-container", this.wrapper);
        if (container) {
          container.addEventListener("mouseleave", () => {
            this.udesly.dispatch("woocommerce/toggleCart");
          });
        }
      }
    });
    this.wrapper.addEventListener("change", (e) => {
      if (e.target.matches(".w-commerce-commercecartquantity")) {
        const target = e.target;
        e.target.closest(".w-commerce-commercecartitem")?.classList.add("udy-loading");
        this.wrapper.querySelector(".w-commerce-commercecartordervalue")?.classList.add("udy-loading");
        this.udesly.dispatch("woocommerce/updateCartQuantity", {
          key: target.name,
          quantity: target.value
        });
        e.preventDefault();
      }
    });
    getElementsByDataNodeType("commerce-cart-close-link", this.wrapper).forEach((closeLink) => {
      closeLink.addEventListener("click", () => {
        this.udesly.dispatch("woocommerce/toggleCart");
      }, true);
    });
    getElementsByDataNodeType("commerce-cart-container-wrapper", this.wrapper).forEach((w) => {
      w.addEventListener("click", (e) => {
        if (!e.target.matches(`[data-node-type="commerce-cart-container"], [data-node-type="commerce-cart-container"] *`)) {
          this.udesly.dispatch("woocommerce/toggleCart");
        }
        if (e.target.matches(`[data-node-type="cart-remove-link"]`)) {
          e.target.closest(".w-commerce-commercecartitem")?.classList.add("udy-loading");
          this.wrapper.querySelector(".w-commerce-commercecartordervalue")?.classList.add("udy-loading");
          this.udesly.dispatch("woocommerce/removeFromCart", e.target.getAttribute("key"));
          e.preventDefault();
        }
      }, true);
    });
  }
};
var mini_cart_default = MiniCart;
export {
  mini_cart_default as default
};
//# sourceMappingURL=mini-cart-JZ45XCWH.js.map
