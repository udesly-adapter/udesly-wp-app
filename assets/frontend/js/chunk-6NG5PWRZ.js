import{a as be}from"./chunk-CDMELAGU.js";var I={};be(I,{__DO_NOT_USE__ActionTypes:()=>m,applyMiddleware:()=>D,bindActionCreators:()=>F,combineReducers:()=>C,compose:()=>S,createStore:()=>R});function M(r){var e,t=r.Symbol;return typeof t=="function"?t.observable?e=t.observable:(e=t("observable"),t.observable=e):e="@@observable",e}var b;typeof self!="undefined"?b=self:typeof window!="undefined"?b=window:typeof global!="undefined"?b=global:typeof module!="undefined"?b=module:b=Function("return this")();var Y=M(b),A=Y;var N=function(){return Math.random().toString(36).substring(7).split("").join(".")},m={INIT:"@@redux/INIT"+N(),REPLACE:"@@redux/REPLACE"+N(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+N()}};function X(r){if(typeof r!="object"||r===null)return!1;for(var e=r;Object.getPrototypeOf(e)!==null;)e=Object.getPrototypeOf(e);return Object.getPrototypeOf(r)===e}function R(r,e,t){var n;if(typeof e=="function"&&typeof t=="function"||typeof t=="function"&&typeof arguments[3]=="function")throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function.");if(typeof e=="function"&&typeof t=="undefined"&&(t=e,e=void 0),typeof t!="undefined"){if(typeof t!="function")throw new Error("Expected the enhancer to be a function.");return t(R)(r,e)}if(typeof r!="function")throw new Error("Expected the reducer to be a function.");var i=r,o=e,u=[],a=u,c=!1;function d(){a===u&&(a=u.slice())}function g(){if(c)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return o}function P(s){if(typeof s!="function")throw new Error("Expected the listener to be a function.");if(c)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribelistener for more details.");var p=!0;return d(),a.push(s),function(){if(!!p){if(c)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribelistener for more details.");p=!1,d();var f=a.indexOf(s);a.splice(f,1),u=null}}}function l(s){if(!X(s))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(typeof s.type=="undefined")throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(c)throw new Error("Reducers may not dispatch actions.");try{c=!0,o=i(o,s)}finally{c=!1}for(var p=u=a,v=0;v<p.length;v++){var f=p[v];f()}return s}function E(s){if(typeof s!="function")throw new Error("Expected the nextReducer to be a function.");i=s,l({type:m.REPLACE})}function w(){var s,p=P;return s={subscribe:function(f){if(typeof f!="object"||f===null)throw new TypeError("Expected the observer to be an object.");function O(){f.next&&f.next(g())}O();var B=p(O);return{unsubscribe:B}}},s[A]=function(){return this},s}return l({type:m.INIT}),n={dispatch:l,subscribe:P,getState:g,replaceReducer:E},n[A]=w,n}function q(r,e){var t=e&&e.type,n=t&&'action "'+String(t)+'"'||"an action";return"Given "+n+', reducer "'+r+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function z(r){Object.keys(r).forEach(function(e){var t=r[e],n=t(void 0,{type:m.INIT});if(typeof n=="undefined")throw new Error('Reducer "'+e+`" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);if(typeof t(void 0,{type:m.PROBE_UNKNOWN_ACTION()})=="undefined")throw new Error('Reducer "'+e+'" returned undefined when probed with a random type. '+("Don't try to handle "+m.INIT+' or other actions in "redux/*" ')+"namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.")})}function C(r){for(var e=Object.keys(r),t={},n=0;n<e.length;n++){var i=e[n];typeof r[i]=="function"&&(t[i]=r[i])}var o=Object.keys(t),u,a;try{z(t)}catch(c){a=c}return function(d,g){if(d===void 0&&(d={}),a)throw a;if(!1)var P;for(var l=!1,E={},w=0;w<o.length;w++){var s=o[w],p=t[s],v=d[s],f=p(v,g);if(typeof f=="undefined"){var O=q(s,g);throw new Error(O)}E[s]=f,l=l||f!==v}return l=l||o.length!==Object.keys(d).length,l?E:d}}function _(r,e){return function(){return e(r.apply(this,arguments))}}function F(r,e){if(typeof r=="function")return _(r,e);if(typeof r!="object"||r===null)throw new Error("bindActionCreators expected an object or a function, instead received "+(r===null?"null":typeof r)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');var t={};for(var n in r){var i=r[n];typeof i=="function"&&(t[n]=_(i,e))}return t}function G(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}function T(r,e){var t=Object.keys(r);return Object.getOwnPropertySymbols&&t.push.apply(t,Object.getOwnPropertySymbols(r)),e&&(t=t.filter(function(n){return Object.getOwnPropertyDescriptor(r,n).enumerable})),t}function H(r){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?T(t,!0).forEach(function(n){G(r,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):T(t).forEach(function(n){Object.defineProperty(r,n,Object.getOwnPropertyDescriptor(t,n))})}return r}function S(){for(var r=arguments.length,e=new Array(r),t=0;t<r;t++)e[t]=arguments[t];return e.length===0?function(n){return n}:e.length===1?e[0]:e.reduce(function(n,i){return function(){return n(i.apply(void 0,arguments))}})}function D(){for(var r=arguments.length,e=new Array(r),t=0;t<r;t++)e[t]=arguments[t];return function(n){return function(){var i=n.apply(void 0,arguments),o=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},u={getState:i.getState,dispatch:function(){return o.apply(void 0,arguments)}},a=e.map(function(c){return c(u)});return o=S.apply(void 0,a)(i.dispatch),H({},i,{dispatch:o})}}}function h(){return h=Object.assign||function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},h.apply(this,arguments)}function J(r){r.models.forEach(function(a){return U(r,a)});var e=L(r),t=D.apply(I,r.reduxConfig.middlewares),n=Z(r.reduxConfig.devtoolOptions).apply(void 0,r.reduxConfig.enhancers.concat([t])),i=r.reduxConfig.createStore||R,o=r.reduxConfig.initialState,u=o===void 0?{}:o;return i(e,u,n)}function U(r,e){var t={},n=Object.keys(e.reducers);n.forEach(function(a){var c=Q(a)?a:e.name+"/"+a;t[c]=e.reducers[a]});var i=function(c,d){return c===void 0&&(c=e.state),d.type in t?t[d.type](c,d.payload,d.meta):c},o=e.baseReducer,u=o?function(a,c){return a===void 0&&(a=e.state),i(o(a,c),c)}:i;r.forEachPlugin("onReducer",function(a){u=a(u,e.name,r)||u}),r.reduxConfig.reducers[e.name]=u}function L(r){var e=r.reduxConfig.rootReducers,t=ee(r.reduxConfig),n=t;return e&&Object.keys(e).length&&(n=function(o,u){var a=e[u.type];return t(a?a(o,u):o,u)}),r.forEachPlugin("onRootReducer",function(i){n=i(n,r)||n}),n}function ee(r){var e=r.combineReducers||C;return Object.keys(r.reducers).length?e(r.reducers):function(t){return t}}function Z(r){return r===void 0&&(r={}),!r.disabled&&typeof window=="object"&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(r):S}function Q(r){return r.indexOf("/")>-1}var V=function(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)},y=function(e){return!e||typeof e=="function"},x=function(e){if(!1)var t,n},re=function(e){x(function(){return[[!Array.isArray(e.plugins),"init config.plugins must be an array"],[!V(e.models),"init config.models must be an object"],[!V(e.redux.reducers),"init config.redux.reducers must be an object"],[!Array.isArray(e.redux.middlewares),"init config.redux.middlewares must be an array"],[!Array.isArray(e.redux.enhancers),"init config.redux.enhancers must be an array of functions"],[!y(e.redux.combineReducers),"init config.redux.combineReducers must be a function"],[!y(e.redux.createStore),"init config.redux.createStore must be a function"]]})},$=function(e){x(function(){return[[!e,"model config is required"],[typeof e.name!="string",'model "name" [string] is required'],[e.state===void 0&&e.baseReducer===void 0,'model "state" is required'],[!y(e.baseReducer),'model "baseReducer" must be a function']]})},te=function(e){x(function(){return[[!y(e.onStoreCreated),"Plugin onStoreCreated must be a function"],[!y(e.onModel),"Plugin onModel must be a function"],[!y(e.onReducer),"Plugin onReducer must be a function"],[!y(e.onRootReducer),"Plugin onRootReducer must be a function"],[!y(e.createMiddleware),"Plugin createMiddleware must be a function"]]})},ne=function(e,t,n){x(function(){return[[!!n.match(/\/.+\//),"Invalid reducer name ("+e+"/"+n+")"],[typeof t[n]!="function","Invalid reducer ("+e+"/"+n+"). Must be a function"]]})},oe=function(e,t,n){x(function(){return[[!!n.match(/\//),"Invalid effect name ("+e+"/"+n+")"],[typeof t[n]!="function","Invalid effect ("+e+"/"+n+"). Must be a function"]]})},K=function(e,t,n,i){return Object.assign(function(o,u){var a={type:t+"/"+n};return typeof o!="undefined"&&(a.payload=o),typeof u!="undefined"&&(a.meta=u),e.dispatch(a)},{isEffect:i})},ie=function(e,t,n){var i=e.dispatch[n.name],o=Object.keys(n.reducers);o.forEach(function(c){ne(n.name,n.reducers,c),i[c]=K(e,n.name,c,!1)});var u={};n.effects&&(u=typeof n.effects=="function"?n.effects(e.dispatch):n.effects);var a=Object.keys(u);a.forEach(function(c){oe(n.name,u,c),t.effects[n.name+"/"+c]=u[c].bind(i),i[c]=K(e,n.name,c,!0)})};function ae(r){return{models:ue(r.models),reduxConfig:r.redux,forEachPlugin:function(t,n){r.plugins.forEach(function(i){i[t]&&n(i[t])})},effects:{}}}function ue(r){return Object.keys(r).map(function(e){var t=ce(e,r[e]);return $(t),t})}function ce(r,e){return h({name:r,reducers:{}},e)}function fe(r){var e=ae(r);e.reduxConfig.middlewares.push(se(e)),e.forEachPlugin("createMiddleware",function(i){e.reduxConfig.middlewares.push(i(e))});var t=J(e),n=h({},t,{name:r.name,addModel:function(o){$(o),U(e,o),k(this,e,o),this.replaceReducer(L(e)),t.dispatch({type:"@@redux/REPLACE"})}});return de(n,r.plugins),n.addModel.bind(n),e.models.forEach(function(i){return k(n,e,i)}),e.forEachPlugin("onStoreCreated",function(i){n=i(n,e)||n}),n}function se(r){return function(e){return function(t){return function(n){return n.type in r.effects?(t(n),r.effects[n.type](n.payload,e.getState(),n.meta)):t(n)}}}}function k(r,e,t){var n={};r.dispatch[""+t.name]=n,ie(r,e,t),e.forEachPlugin("onModel",function(i){i(t,r)})}function de(r,e){e.forEach(function(t){if(!!t.exposed){var n=Object.keys(t.exposed);n.forEach(function(i){if(!!t.exposed){var o=t.exposed[i],u=typeof o=="function";r[i]=u?function(){for(var a=arguments.length,c=new Array(a),d=0;d<a;d++)c[d]=arguments[d];return o.apply(void 0,[r].concat(c))}:Object.create(t.exposed[i])}})}})}var W=0;function le(r){var e,t,n,i=(e=r.name)!=null?e:"Rematch Store "+W;W+=1;var o={name:i,models:r.models||{},plugins:r.plugins||[],redux:h({reducers:{},rootReducers:{},enhancers:[],middlewares:[]},r.redux,{devtoolOptions:h({name:i},(t=(n=r.redux)==null?void 0:n.devtoolOptions)!=null?t:{})})};return re(o),o.plugins.forEach(function(u){u.config&&(o.models=j(o.models,u.config.models),u.config.redux&&(o.redux.initialState=j(o.redux.initialState,u.config.redux.initialState),o.redux.reducers=j(o.redux.reducers,u.config.redux.reducers),o.redux.rootReducers=j(o.redux.rootReducers,u.config.redux.reducers),o.redux.enhancers=[].concat(o.redux.enhancers,u.config.redux.enhancers||[]),o.redux.middlewares=[].concat(o.redux.middlewares,u.config.redux.middlewares||[]),o.redux.combineReducers=o.redux.combineReducers||u.config.redux.combineReducers,o.redux.createStore=o.redux.createStore||u.config.redux.createStore)),te(u)}),o}function j(r,e){return e?h({},e,r):r}var we=function(e){var t=le(e||{});return fe(t)},xe=function(){return function(e){var t=e.reducers,n=t===void 0?{}:t,i=e.effects,o=i===void 0?{}:i;return h({},e,{reducers:n,effects:o})}};export{we as a,xe as b};
