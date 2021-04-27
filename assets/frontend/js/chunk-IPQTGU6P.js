import {
  __export
} from "./chunk-F543FC74.js";

// node_modules/redux/es/redux.js
var redux_exports = {};
__export(redux_exports, {
  __DO_NOT_USE__ActionTypes: () => ActionTypes,
  applyMiddleware: () => applyMiddleware,
  bindActionCreators: () => bindActionCreators,
  combineReducers: () => combineReducers,
  compose: () => compose,
  createStore: () => createStore
});

// node_modules/symbol-observable/es/ponyfill.js
function symbolObservablePonyfill(root2) {
  var result2;
  var Symbol = root2.Symbol;
  if (typeof Symbol === "function") {
    if (Symbol.observable) {
      result2 = Symbol.observable;
    } else {
      result2 = Symbol("observable");
      Symbol.observable = result2;
    }
  } else {
    result2 = "@@observable";
  }
  return result2;
}

// node_modules/symbol-observable/es/index.js
var root;
if (typeof self !== "undefined") {
  root = self;
} else if (typeof window !== "undefined") {
  root = window;
} else if (typeof global !== "undefined") {
  root = global;
} else if (typeof module !== "undefined") {
  root = module;
} else {
  root = Function("return this")();
}
var result = symbolObservablePonyfill(root);
var es_default = result;

// node_modules/redux/es/redux.js
var randomString = function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error("Expected the enhancer to be a function.");
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  if (typeof reducer !== "function") {
    throw new Error("Expected the reducer to be a function.");
  }
  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("Expected the listener to be a function.");
    }
    if (isDispatching) {
      throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribelistener for more details.");
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error("Actions must be plain objects. Use custom middleware for async actions.");
    }
    if (typeof action.type === "undefined") {
      throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
    }
    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error("Expected the nextReducer to be a function.");
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      subscribe: function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new TypeError("Expected the observer to be an object.");
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }
    }, _ref[es_default] = function() {
      return this;
    }, _ref;
  }
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }, _ref2[es_default] = observable, _ref2;
}
function warning(message) {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message);
  }
  try {
    throw new Error(message);
  } catch (e) {
  }
}
function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && 'action "' + String(actionType) + '"' || "an action";
  return "Given " + actionDescription + ', reducer "' + key + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.';
}
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (reducerKeys.length === 0) {
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  }
  if (!isPlainObject(inputState)) {
    return "The " + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }
  var unexpectedKeys = Object.keys(inputState).filter(function(key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function(key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE)
    return;
  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? "keys" : "key") + " " + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function(key) {
    var reducer = reducers[key];
    var initialState = reducer(void 0, {
      type: ActionTypes.INIT
    });
    if (typeof initialState === "undefined") {
      throw new Error('Reducer "' + key + `" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
    }
    if (typeof reducer(void 0, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ("Don't try to handle " + ActionTypes.INIT + ' or other actions in "redux/*" ') + "namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.");
    }
  });
}
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (true) {
      if (typeof reducers[key] === "undefined") {
        warning('No reducer provided for key "' + key + '"');
      }
    }
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);
  var unexpectedKeyCache;
  if (true) {
    unexpectedKeyCache = {};
  }
  var shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    if (true) {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }
    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? "null" : typeof actionCreators) + '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }
  var boundActionCreators = {};
  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }
  if (enumerableOnly)
    keys = keys.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(function(a, b) {
    return function() {
      return a(b.apply(void 0, arguments));
    };
  });
}
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  return function(createStore2) {
    return function() {
      var store = createStore2.apply(void 0, arguments);
      var _dispatch = function dispatch() {
        throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
      };
      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function(middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
function isCrushed() {
}
if (typeof isCrushed.name === "string" && isCrushed.name !== "isCrushed") {
  warning('You are currently using minified code outside of NODE_ENV === "production". This means that you are running a slower development build of Redux. You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) to ensure you have the correct code for your production build.');
}

// node_modules/@rematch/core/dist/core.esm.js
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function createReduxStore(bag) {
  bag.models.forEach(function(model) {
    return createModelReducer(bag, model);
  });
  var rootReducer = createRootReducer(bag);
  var middlewares = applyMiddleware.apply(redux_exports, bag.reduxConfig.middlewares);
  var enhancers = composeEnhancersWithDevtools(bag.reduxConfig.devtoolOptions).apply(void 0, bag.reduxConfig.enhancers.concat([middlewares]));
  var createStore$1 = bag.reduxConfig.createStore || createStore;
  var bagInitialState = bag.reduxConfig.initialState;
  var initialState = bagInitialState === void 0 ? {} : bagInitialState;
  return createStore$1(rootReducer, initialState, enhancers);
}
function createModelReducer(bag, model) {
  var modelReducers = {};
  var modelReducerKeys = Object.keys(model.reducers);
  modelReducerKeys.forEach(function(reducerKey) {
    var actionName = isAlreadyActionName(reducerKey) ? reducerKey : model.name + "/" + reducerKey;
    modelReducers[actionName] = model.reducers[reducerKey];
  });
  var combinedReducer = function combinedReducer2(state, action) {
    if (state === void 0) {
      state = model.state;
    }
    if (action.type in modelReducers) {
      return modelReducers[action.type](state, action.payload, action.meta);
    }
    return state;
  };
  var modelBaseReducer = model.baseReducer;
  var reducer = !modelBaseReducer ? combinedReducer : function(state, action) {
    if (state === void 0) {
      state = model.state;
    }
    return combinedReducer(modelBaseReducer(state, action), action);
  };
  bag.forEachPlugin("onReducer", function(onReducer) {
    reducer = onReducer(reducer, model.name, bag) || reducer;
  });
  bag.reduxConfig.reducers[model.name] = reducer;
}
function createRootReducer(bag) {
  var rootReducers = bag.reduxConfig.rootReducers;
  var mergedReducers = mergeReducers(bag.reduxConfig);
  var rootReducer = mergedReducers;
  if (rootReducers && Object.keys(rootReducers).length) {
    rootReducer = function rootReducer2(state, action) {
      var actionRootReducer = rootReducers[action.type];
      if (actionRootReducer) {
        return mergedReducers(actionRootReducer(state, action), action);
      }
      return mergedReducers(state, action);
    };
  }
  bag.forEachPlugin("onRootReducer", function(onRootReducer) {
    rootReducer = onRootReducer(rootReducer, bag) || rootReducer;
  });
  return rootReducer;
}
function mergeReducers(reduxConfig) {
  var combineReducers$1 = reduxConfig.combineReducers || combineReducers;
  if (!Object.keys(reduxConfig.reducers).length) {
    return function(state) {
      return state;
    };
  }
  return combineReducers$1(reduxConfig.reducers);
}
function composeEnhancersWithDevtools(devtoolOptions) {
  if (devtoolOptions === void 0) {
    devtoolOptions = {};
  }
  return !devtoolOptions.disabled && typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions) : compose;
}
function isAlreadyActionName(reducerKey) {
  return reducerKey.indexOf("/") > -1;
}
var isObject = function isObject2(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};
var ifDefinedIsFunction = function ifDefinedIsFunction2(func) {
  return !func || typeof func === "function";
};
var validate = function validate2(runValidations) {
  if (true) {
    var validations = runValidations();
    var errors = [];
    validations.forEach(function(validation) {
      var isInvalid = validation[0];
      var errorMessage = validation[1];
      if (isInvalid) {
        errors.push(errorMessage);
      }
    });
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }
};
var validateConfig = function validateConfig2(config) {
  validate(function() {
    return [[!Array.isArray(config.plugins), "init config.plugins must be an array"], [!isObject(config.models), "init config.models must be an object"], [!isObject(config.redux.reducers), "init config.redux.reducers must be an object"], [!Array.isArray(config.redux.middlewares), "init config.redux.middlewares must be an array"], [!Array.isArray(config.redux.enhancers), "init config.redux.enhancers must be an array of functions"], [!ifDefinedIsFunction(config.redux.combineReducers), "init config.redux.combineReducers must be a function"], [!ifDefinedIsFunction(config.redux.createStore), "init config.redux.createStore must be a function"]];
  });
};
var validateModel = function validateModel2(model) {
  validate(function() {
    return [[!model, "model config is required"], [typeof model.name !== "string", 'model "name" [string] is required'], [model.state === void 0 && model.baseReducer === void 0, 'model "state" is required'], [!ifDefinedIsFunction(model.baseReducer), 'model "baseReducer" must be a function']];
  });
};
var validatePlugin = function validatePlugin2(plugin) {
  validate(function() {
    return [[!ifDefinedIsFunction(plugin.onStoreCreated), "Plugin onStoreCreated must be a function"], [!ifDefinedIsFunction(plugin.onModel), "Plugin onModel must be a function"], [!ifDefinedIsFunction(plugin.onReducer), "Plugin onReducer must be a function"], [!ifDefinedIsFunction(plugin.onRootReducer), "Plugin onRootReducer must be a function"], [!ifDefinedIsFunction(plugin.createMiddleware), "Plugin createMiddleware must be a function"]];
  });
};
var validateModelReducer = function validateModelReducer2(modelName, reducers, reducerName) {
  validate(function() {
    return [[!!reducerName.match(/\/.+\//), "Invalid reducer name (" + modelName + "/" + reducerName + ")"], [typeof reducers[reducerName] !== "function", "Invalid reducer (" + modelName + "/" + reducerName + "). Must be a function"]];
  });
};
var validateModelEffect = function validateModelEffect2(modelName, effects, effectName) {
  validate(function() {
    return [[!!effectName.match(/\//), "Invalid effect name (" + modelName + "/" + effectName + ")"], [typeof effects[effectName] !== "function", "Invalid effect (" + modelName + "/" + effectName + "). Must be a function"]];
  });
};
var createActionDispatcher = function createActionDispatcher2(rematch, modelName, actionName, isEffect) {
  return Object.assign(function(payload, meta) {
    var action = {
      type: modelName + "/" + actionName
    };
    if (typeof payload !== "undefined") {
      action.payload = payload;
    }
    if (typeof meta !== "undefined") {
      action.meta = meta;
    }
    return rematch.dispatch(action);
  }, {
    isEffect
  });
};
var createDispatcher = function createDispatcher2(rematch, bag, model) {
  var modelDispatcher = rematch.dispatch[model.name];
  var modelReducersKeys = Object.keys(model.reducers);
  modelReducersKeys.forEach(function(reducerName) {
    validateModelReducer(model.name, model.reducers, reducerName);
    modelDispatcher[reducerName] = createActionDispatcher(rematch, model.name, reducerName, false);
  });
  var effects = {};
  if (model.effects) {
    effects = typeof model.effects === "function" ? model.effects(rematch.dispatch) : model.effects;
  }
  var effectKeys = Object.keys(effects);
  effectKeys.forEach(function(effectName) {
    validateModelEffect(model.name, effects, effectName);
    bag.effects[model.name + "/" + effectName] = effects[effectName].bind(modelDispatcher);
    modelDispatcher[effectName] = createActionDispatcher(rematch, model.name, effectName, true);
  });
};
function createRematchBag(config) {
  return {
    models: createNamedModels(config.models),
    reduxConfig: config.redux,
    forEachPlugin: function forEachPlugin(method, fn) {
      config.plugins.forEach(function(plugin) {
        if (plugin[method]) {
          fn(plugin[method]);
        }
      });
    },
    effects: {}
  };
}
function createNamedModels(models) {
  return Object.keys(models).map(function(modelName) {
    var model = createNamedModel(modelName, models[modelName]);
    validateModel(model);
    return model;
  });
}
function createNamedModel(name, model) {
  return _extends({
    name,
    reducers: {}
  }, model);
}
function createRematchStore(config) {
  var bag = createRematchBag(config);
  bag.reduxConfig.middlewares.push(createEffectsMiddleware(bag));
  bag.forEachPlugin("createMiddleware", function(createMiddleware) {
    bag.reduxConfig.middlewares.push(createMiddleware(bag));
  });
  var reduxStore = createReduxStore(bag);
  var rematchStore = _extends({}, reduxStore, {
    name: config.name,
    addModel: function addModel(model) {
      validateModel(model);
      createModelReducer(bag, model);
      prepareModel(this, bag, model);
      this.replaceReducer(createRootReducer(bag));
      reduxStore.dispatch({
        type: "@@redux/REPLACE"
      });
    }
  });
  addExposed(rematchStore, config.plugins);
  rematchStore.addModel.bind(rematchStore);
  bag.models.forEach(function(model) {
    return prepareModel(rematchStore, bag, model);
  });
  bag.forEachPlugin("onStoreCreated", function(onStoreCreated) {
    rematchStore = onStoreCreated(rematchStore, bag) || rematchStore;
  });
  return rematchStore;
}
function createEffectsMiddleware(bag) {
  return function(store) {
    return function(next) {
      return function(action) {
        if (action.type in bag.effects) {
          next(action);
          return bag.effects[action.type](action.payload, store.getState(), action.meta);
        }
        return next(action);
      };
    };
  };
}
function prepareModel(rematchStore, bag, model) {
  var modelDispatcher = {};
  rematchStore.dispatch["" + model.name] = modelDispatcher;
  createDispatcher(rematchStore, bag, model);
  bag.forEachPlugin("onModel", function(onModel) {
    onModel(model, rematchStore);
  });
}
function addExposed(store, plugins) {
  plugins.forEach(function(plugin) {
    if (!plugin.exposed)
      return;
    var pluginKeys = Object.keys(plugin.exposed);
    pluginKeys.forEach(function(key) {
      if (!plugin.exposed)
        return;
      var exposedItem = plugin.exposed[key];
      var isExposedFunction = typeof exposedItem === "function";
      store[key] = isExposedFunction ? function() {
        for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }
        return exposedItem.apply(void 0, [store].concat(params));
      } : Object.create(plugin.exposed[key]);
    });
  });
}
var count = 0;
function createConfig(initConfig) {
  var _initConfig$name, _initConfig$redux$dev, _initConfig$redux;
  var storeName = (_initConfig$name = initConfig.name) != null ? _initConfig$name : "Rematch Store " + count;
  count += 1;
  var config = {
    name: storeName,
    models: initConfig.models || {},
    plugins: initConfig.plugins || [],
    redux: _extends({
      reducers: {},
      rootReducers: {},
      enhancers: [],
      middlewares: []
    }, initConfig.redux, {
      devtoolOptions: _extends({
        name: storeName
      }, (_initConfig$redux$dev = (_initConfig$redux = initConfig.redux) == null ? void 0 : _initConfig$redux.devtoolOptions) != null ? _initConfig$redux$dev : {})
    })
  };
  validateConfig(config);
  config.plugins.forEach(function(plugin) {
    if (plugin.config) {
      config.models = merge(config.models, plugin.config.models);
      if (plugin.config.redux) {
        config.redux.initialState = merge(config.redux.initialState, plugin.config.redux.initialState);
        config.redux.reducers = merge(config.redux.reducers, plugin.config.redux.reducers);
        config.redux.rootReducers = merge(config.redux.rootReducers, plugin.config.redux.reducers);
        config.redux.enhancers = [].concat(config.redux.enhancers, plugin.config.redux.enhancers || []);
        config.redux.middlewares = [].concat(config.redux.middlewares, plugin.config.redux.middlewares || []);
        config.redux.combineReducers = config.redux.combineReducers || plugin.config.redux.combineReducers;
        config.redux.createStore = config.redux.createStore || plugin.config.redux.createStore;
      }
    }
    validatePlugin(plugin);
  });
  return config;
}
function merge(original, extra) {
  return extra ? _extends({}, extra, original) : original;
}
var init = function init2(initConfig) {
  var config = createConfig(initConfig || {});
  return createRematchStore(config);
};
var createModel = function createModel2() {
  return function(mo) {
    var _mo$reducers = mo.reducers, reducers = _mo$reducers === void 0 ? {} : _mo$reducers, _mo$effects = mo.effects, effects = _mo$effects === void 0 ? {} : _mo$effects;
    return _extends({}, mo, {
      reducers,
      effects
    });
  };
};

export {
  init,
  createModel
};
//# sourceMappingURL=chunk-IPQTGU6P.js.map
