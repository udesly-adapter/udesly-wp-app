import {
  createModel
} from "./chunk-IPQTGU6P.js";
import "./chunk-F543FC74.js";

// src/store/models/count.ts
var count = createModel()({
  state: 0,
  reducers: {
    increment(state, payload) {
      return state + payload;
    }
  },
  effects: (dispatch) => ({
    incrementAsync(payload, state) {
      dispatch.count.increment(payload);
    }
  })
});

// src/store/models.ts
var models = {count};
export {
  models
};
//# sourceMappingURL=models-UHLHQ5FZ.js.map
