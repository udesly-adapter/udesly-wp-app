import {
  require_eta
} from "./chunk-WK2D2ARA.js";
import {
  __toModule
} from "./chunk-F543FC74.js";

// src/wc/thankyou.ts
var import_eta = __toModule(require_eta());
import_eta.default.config.autoEscape = false;
var Thankyou = class {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.itemsList = this.wrapper.querySelector(".w-commerce-commercecheckoutorderitemslist");
    if (!this.itemsList) {
      return;
    }
    const template = wrapper.querySelector('script[type="text/x-wf-template"]').textContent;
    this.templateFunction = import_eta.default.compile(template);
    const items = JSON.parse(wrapper.querySelector('script[type="application/json"]').textContent).map((item) => {
      const options = {};
      item.product = {
        name: item.title
      };
      item.rowTotal = item.total;
      item.options.split(",").forEach((line) => {
        const [label, value] = line.split(":").map((e) => e.trim());
        options[label + ": "] = value;
      });
      item.options = options;
      return item;
    });
    this.itemsList.innerHTML = items.reduce((prev, next) => prev += import_eta.default.render(this.templateFunction, next), "");
  }
};
var thankyou_default = Thankyou;
export {
  thankyou_default as default
};
//# sourceMappingURL=thankyou-II57NWZI.js.map
