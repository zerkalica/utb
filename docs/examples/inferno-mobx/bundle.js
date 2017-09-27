(function () {
'use strict';

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

defaultSetTimout._r = [2];

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

defaultClearTimeout._r = [2];
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;

if (typeof global$1.setTimeout === 'function') {
  cachedSetTimeout = setTimeout;
}

if (typeof global$1.clearTimeout === 'function') {
  cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

runTimeout._r = [2];

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

runClearTimeout._r = [2];
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

cleanUpNextTick._r = [2];

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

drainQueue._r = [2];
 // v8 likes predictible objects






 // empty string to avoid regexp issues
















 // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

var performance = global$1.performance || {};

var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
  return new Date().getTime();
}; // generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};













var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();











var inheritsLoose = function (subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
};

var dist$1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  /**
   * @module Inferno-Shared
   */

  /** TypeDoc Comment */

  var NO_OP = "$NO_OP";
  var ERROR_MSG = "a runtime error occured! Use Inferno in development environment to find the error."; // This should be boolean and not reference to window.document

  var isBrowser = !!(typeof window !== "undefined" && window.document); // this is MUCH faster than .constructor === Array and instanceof Array
  // in Node 7 and the later versions of V8, slower in older versions though

  var isArray = Array.isArray;

  function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
  }

  function isStringOrNumber(o) {
    var type = _typeof(o);
    return type === "string" || type === "number";
  }

  function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
  }

  function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
  }

  function isFunction(o) {
    return typeof o === "function";
  }

  function isString(o) {
    return typeof o === "string";
  }

  function isNumber(o) {
    return typeof o === "number";
  }

  function isNull(o) {
    return o === null;
  }

  function isTrue(o) {
    return o === true;
  }

  function isUndefined(o) {
    return o === void 0;
  }

  function isObject(o) {
    return _typeof(o) === "object";
  }

  function throwError(message) {
    if (!message) {
      message = ERROR_MSG;
    }

    throw new Error("Inferno Error: " + message);
  }

  function combineFrom(first, second) {
    var out = {};

    if (first) {
      for (var key in first) {
        out[key] = first[key];
      }
    }

    if (second) {
      for (var key$1 in second) {
        out[key$1] = second[key$1];
      }
    }

    return out;
  }

  function Lifecycle() {
    this.listeners = [];
  }

  Lifecycle.prototype.addListener = function addListener$$1(callback) {
    this.listeners.push(callback);
  };

  Lifecycle.prototype.trigger = function trigger() {
    var listeners = this.listeners;
    var listener; // We need to remove current listener from array when calling it, because more listeners might be added

    while (listener = listeners.shift()) {
      listener();
    }
  };
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  var options = {
    afterMount: null,
    afterRender: null,
    afterUpdate: null,
    beforeRender: null,
    beforeUnmount: null,
    createVNode: null,
    findDOMNodeEnabled: false,
    recyclingEnabled: false,
    roots: []
  };
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */

  var xlinkNS = "http://www.w3.org/1999/xlink";
  var xmlNS = "http://www.w3.org/XML/1998/namespace";
  var svgNS = "http://www.w3.org/2000/svg";
  var strictProps = new Set();
  strictProps.add("volume");
  strictProps.add("defaultChecked");
  var booleanProps = new Set();
  booleanProps.add("muted");
  booleanProps.add("scoped");
  booleanProps.add("loop");
  booleanProps.add("open");
  booleanProps.add("checked");
  booleanProps.add("default");
  booleanProps.add("capture");
  booleanProps.add("disabled");
  booleanProps.add("readOnly");
  booleanProps.add("required");
  booleanProps.add("autoplay");
  booleanProps.add("controls");
  booleanProps.add("seamless");
  booleanProps.add("reversed");
  booleanProps.add("allowfullscreen");
  booleanProps.add("novalidate");
  booleanProps.add("hidden");
  booleanProps.add("autoFocus");
  booleanProps.add("selected");
  booleanProps.add("indeterminate");
  var namespaces = new Map();
  namespaces.set("xlink:href", xlinkNS);
  namespaces.set("xlink:arcrole", xlinkNS);
  namespaces.set("xlink:actuate", xlinkNS);
  namespaces.set("xlink:show", xlinkNS);
  namespaces.set("xlink:role", xlinkNS);
  namespaces.set("xlink:title", xlinkNS);
  namespaces.set("xlink:type", xlinkNS);
  namespaces.set("xml:base", xmlNS);
  namespaces.set("xml:lang", xmlNS);
  namespaces.set("xml:space", xmlNS);
  var isUnitlessNumber = new Set();
  isUnitlessNumber.add("animationIterationCount");
  isUnitlessNumber.add("borderImageOutset");
  isUnitlessNumber.add("borderImageSlice");
  isUnitlessNumber.add("borderImageWidth");
  isUnitlessNumber.add("boxFlex");
  isUnitlessNumber.add("boxFlexGroup");
  isUnitlessNumber.add("boxOrdinalGroup");
  isUnitlessNumber.add("columnCount");
  isUnitlessNumber.add("flex");
  isUnitlessNumber.add("flexGrow");
  isUnitlessNumber.add("flexPositive");
  isUnitlessNumber.add("flexShrink");
  isUnitlessNumber.add("flexNegative");
  isUnitlessNumber.add("flexOrder");
  isUnitlessNumber.add("gridRow");
  isUnitlessNumber.add("gridColumn");
  isUnitlessNumber.add("fontWeight");
  isUnitlessNumber.add("lineClamp");
  isUnitlessNumber.add("lineHeight");
  isUnitlessNumber.add("opacity");
  isUnitlessNumber.add("order");
  isUnitlessNumber.add("orphans");
  isUnitlessNumber.add("tabSize");
  isUnitlessNumber.add("widows");
  isUnitlessNumber.add("zIndex");
  isUnitlessNumber.add("zoom");
  isUnitlessNumber.add("fillOpacity");
  isUnitlessNumber.add("floodOpacity");
  isUnitlessNumber.add("stopOpacity");
  isUnitlessNumber.add("strokeDasharray");
  isUnitlessNumber.add("strokeDashoffset");
  isUnitlessNumber.add("strokeMiterlimit");
  isUnitlessNumber.add("strokeOpacity");
  isUnitlessNumber.add("strokeWidth");
  var skipProps = new Set();
  skipProps.add("children");
  skipProps.add("childrenType");
  skipProps.add("defaultValue");
  skipProps.add("ref");
  skipProps.add("key");
  skipProps.add("checked");
  skipProps.add("multiple");
  var delegatedEvents = new Set();
  delegatedEvents.add("onClick");
  delegatedEvents.add("onMouseDown");
  delegatedEvents.add("onMouseUp");
  delegatedEvents.add("onMouseMove");
  delegatedEvents.add("onSubmit");
  delegatedEvents.add("onDblClick");
  delegatedEvents.add("onKeyDown");
  delegatedEvents.add("onKeyUp");
  delegatedEvents.add("onKeyPress");
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */

  var isiOS = isBrowser && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  var delegatedEvents$1 = new Map();

  function handleEvent(name, lastEvent, nextEvent, dom) {
    var delegatedRoots = delegatedEvents$1.get(name);

    if (nextEvent) {
      if (!delegatedRoots) {
        delegatedRoots = {
          items: new Map(),
          docEvent: null
        };
        delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots);
        delegatedEvents$1.set(name, delegatedRoots);
      }

      if (!lastEvent) {
        if (isiOS && name === "onClick") {
          trapClickOnNonInteractiveElement(dom);
        }
      }

      delegatedRoots.items.set(dom, nextEvent);
    } else if (delegatedRoots) {
      var items = delegatedRoots.items;

      if (items.delete(dom)) {
        // If any items were deleted, check if listener need to be removed
        if (items.size === 0) {
          document.removeEventListener(normalizeEventName(name), delegatedRoots.docEvent);
          delegatedEvents$1.delete(name);
        }
      }
    }
  }

  function dispatchEvents(event, target, items, count, isClick, eventData) {
    var dom = target;

    while (count > 0) {
      var eventsToTrigger = items.get(dom);

      if (eventsToTrigger) {
        count--; // linkEvent object

        eventData.dom = dom;

        if (eventsToTrigger.event) {
          eventsToTrigger.event(eventsToTrigger.data, event);
        } else {
          eventsToTrigger(event);
        }

        if (event.cancelBubble) {
          return;
        }
      }

      dom = dom.parentNode; // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
      // because the event listener is on document.body
      // Don't process clicks on disabled elements

      if (dom === null || isClick && dom.disabled) {
        return;
      }
    }
  }

  function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
  }

  function stopPropagation() {
    this.cancelBubble = true;
    this.stopImmediatePropagation();
  }

  function attachEventToDocument(name, delegatedRoots) {
    var docEvent = function docEvent(event) {
      var count = delegatedRoots.items.size;

      if (count > 0) {
        event.stopPropagation = stopPropagation; // Event data needs to be object to save reference to currentTarget getter

        var eventData = {
          dom: document
        };

        try {
          Object.defineProperty(event, "currentTarget", {
            configurable: true,
            get: function get$$1() {
              return eventData.dom;
            }
          });
        } catch (e) {
          /* safari7 and phantomJS will crash */
        }

        dispatchEvents(event, event.target, delegatedRoots.items, count, event.type === "click", eventData);
      }
    };

    docEvent._r = [2];
    document.addEventListener(normalizeEventName(name), docEvent);
    return docEvent;
  } // tslint:disable-next-line:no-empty


  function emptyFn() {}

  function trapClickOnNonInteractiveElement(dom) {
    // Mobile Safari does not fire properly bubble click events on
    // non-interactive elements, which means delegated click listeners do not
    // fire. The workaround for this bug involves attaching an empty click
    // listener on the target node.
    // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
    // Just set it using the onclick property so that we don't have to manage any
    // bookkeeping for it. Not sure if we need to clear it when the listener is
    // removed.
    // TODO: Only do this for the relevant Safaris maybe?
    dom.onclick = emptyFn;
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function isCheckedType(type) {
    return type === "checkbox" || type === "radio";
  }

  function onTextInputChange(e) {
    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    var previousValue = props.value;

    if (props.onInput) {
      var event = props.onInput;

      if (event.event) {
        event.event(event.data, e);
      } else {
        event(e);
      }
    } else if (props.oninput) {
      props.oninput(e);
    } // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again


    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ; // If render is going async there is no value change yet, it will come back to process input soon

    if (previousValue !== newProps.value) {
      // When this happens we need to store current cursor position and restore it, to avoid jumping
      applyValue(newProps, dom);
    }
  }

  function wrappedOnChange(e) {
    var props = this.vNode.props || EMPTY_OBJ;
    var event = props.onChange;

    if (event.event) {
      event.event(event.data, e);
    } else {
      event(e);
    }
  }

  function onCheckboxChange(e) {
    e.stopPropagation(); // This click should not propagate its for internal use

    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;

    if (props.onClick) {
      var event = props.onClick;

      if (event.event) {
        event.event(event.data, e);
      } else {
        event(e);
      }
    } else if (props.onclick) {
      props.onclick(e);
    } // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again


    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ; // If render is going async there is no value change yet, it will come back to process input soon

    applyValue(newProps, dom);
  }

  function processInput(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue(nextPropsOrEmpty, dom);

    if (isControlled) {
      dom.vNode = vNode; // TODO: Remove this when implementing Fiber's

      if (mounting) {
        if (isCheckedType(nextPropsOrEmpty.type)) {
          dom.onclick = onCheckboxChange;
          dom.onclick.wrapped = true;
        } else {
          dom.oninput = onTextInputChange;
          dom.oninput.wrapped = true;
        }

        if (nextPropsOrEmpty.onChange) {
          dom.onchange = wrappedOnChange;
          dom.onchange.wrapped = true;
        }
      }
    }
  }

  function applyValue(nextPropsOrEmpty, dom) {
    var type = nextPropsOrEmpty.type;
    var value = nextPropsOrEmpty.value;
    var checked = nextPropsOrEmpty.checked;
    var multiple = nextPropsOrEmpty.multiple;
    var defaultValue = nextPropsOrEmpty.defaultValue;
    var hasValue = !isNullOrUndef(value);

    if (type && type !== dom.type) {
      dom.setAttribute("type", type);
    }

    if (multiple && multiple !== dom.multiple) {
      dom.multiple = multiple;
    }

    if (!isNullOrUndef(defaultValue) && !hasValue) {
      dom.defaultValue = defaultValue + "";
    }

    if (isCheckedType(type)) {
      if (hasValue) {
        dom.value = value;
      }

      if (!isNullOrUndef(checked)) {
        dom.checked = checked;
      }
    } else {
      if (hasValue && dom.value !== value) {
        dom.defaultValue = value;
        dom.value = value;
      } else if (!isNullOrUndef(checked)) {
        dom.checked = checked;
      }
    }
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function updateChildOptionGroup(vNode, value) {
    var type = vNode.type;

    if (type === "optgroup") {
      var children = vNode.children;

      if (isArray(children)) {
        for (var i = 0, len = children.length; i < len; i++) {
          updateChildOption(children[i], value);
        }
      } else if (isVNode(children)) {
        updateChildOption(children, value);
      }
    } else {
      updateChildOption(vNode, value);
    }
  }

  function updateChildOption(vNode, value) {
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom; // we do this as multiple may have changed

    dom.value = props.value;

    if (isArray(value) && value.indexOf(props.value) !== -1 || props.value === value) {
      dom.selected = true;
    } else if (!isNullOrUndef(value) || !isNullOrUndef(props.selected)) {
      dom.selected = props.selected || false;
    }
  }

  function onSelectChange(e) {
    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    var previousValue = props.value;

    if (props.onChange) {
      var event = props.onChange;

      if (event.event) {
        event.event(event.data, e);
      } else {
        event(e);
      }
    } else if (props.onchange) {
      props.onchange(e);
    } // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again


    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ; // If render is going async there is no value change yet, it will come back to process input soon

    if (previousValue !== newProps.value) {
      // When this happens we need to store current cursor position and restore it, to avoid jumping
      applyValue$1(newVNode, dom, newProps, false);
    }
  }

  function processSelect(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue$1(vNode, dom, nextPropsOrEmpty, mounting);

    if (isControlled) {
      dom.vNode = vNode; // TODO: Remove this when implementing Fiber's

      if (mounting) {
        dom.onchange = onSelectChange;
        dom.onchange.wrapped = true;
      }
    }
  }

  function applyValue$1(vNode, dom, nextPropsOrEmpty, mounting) {
    if (nextPropsOrEmpty.multiple !== dom.multiple) {
      dom.multiple = nextPropsOrEmpty.multiple;
    }

    var children = vNode.children;

    if (!isInvalid(children)) {
      var value = nextPropsOrEmpty.value;

      if (mounting && isNullOrUndef(value)) {
        value = nextPropsOrEmpty.defaultValue;
      }

      if (isArray(children)) {
        for (var i = 0, len = children.length; i < len; i++) {
          updateChildOptionGroup(children[i], value);
        }
      } else if (isVNode(children)) {
        updateChildOptionGroup(children, value);
      }
    }
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function wrappedOnChange$1(e) {
    var props = this.vNode.props || EMPTY_OBJ;
    var event = props.onChange;

    if (event.event) {
      event.event(event.data, e);
    } else {
      event(e);
    }
  }

  function onTextareaInputChange(e) {
    var vNode = this.vNode;
    var props = vNode.props || EMPTY_OBJ;
    var previousValue = props.value;

    if (props.onInput) {
      var event = props.onInput;

      if (event.event) {
        event.event(event.data, e);
      } else {
        event(e);
      }
    } else if (props.oninput) {
      props.oninput(e);
    } // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again


    var newVNode = this.vNode;
    var newProps = newVNode.props || EMPTY_OBJ; // If render is going async there is no value change yet, it will come back to process input soon

    if (previousValue !== newProps.value) {
      // When this happens we need to store current cursor position and restore it, to avoid jumping
      applyValue$2(newVNode, vNode.dom, false);
    }
  }

  function processTextarea(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue$2(nextPropsOrEmpty, dom, mounting);

    if (isControlled) {
      dom.vNode = vNode; // TODO: Remove this when implementing Fiber's

      if (mounting) {
        dom.oninput = onTextareaInputChange;
        dom.oninput.wrapped = true;

        if (nextPropsOrEmpty.onChange) {
          dom.onchange = wrappedOnChange$1;
          dom.onchange.wrapped = true;
        }
      }
    }
  }

  function applyValue$2(nextPropsOrEmpty, dom, mounting) {
    var value = nextPropsOrEmpty.value;
    var domValue = dom.value;

    if (isNullOrUndef(value)) {
      if (mounting) {
        var defaultValue = nextPropsOrEmpty.defaultValue;

        if (!isNullOrUndef(defaultValue)) {
          if (defaultValue !== domValue) {
            dom.defaultValue = defaultValue;
            dom.value = defaultValue;
          }
        } else if (domValue !== "") {
          dom.defaultValue = "";
          dom.value = "";
        }
      }
    } else {
      /* There is value so keep it controlled */
      if (domValue !== value) {
        dom.defaultValue = value;
        dom.value = value;
      }
    }
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */

  /**
   * There is currently no support for switching same input between controlled and nonControlled
   * If that ever becomes a real issue, then re design controlled elements
   * Currently user must choose either controlled or non-controlled and stick with that
   */


  function processElement(flags, vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    if (flags & 512
    /* InputElement */
    ) {
        processInput(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
      }

    if (flags & 2048
    /* SelectElement */
    ) {
        processSelect(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
      }

    if (flags & 1024
    /* TextareaElement */
    ) {
        processTextarea(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
      }
  }

  function isControlledFormElement(nextPropsOrEmpty) {
    return nextPropsOrEmpty.type && isCheckedType(nextPropsOrEmpty.type) ? !isNullOrUndef(nextPropsOrEmpty.checked) : !isNullOrUndef(nextPropsOrEmpty.value);
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function normalizeChildNodes(parentDom) {
    var dom = parentDom.firstChild;

    while (dom) {
      if (dom.nodeType === 8) {
        if (dom.data === "!") {
          var placeholder = document.createTextNode("");
          parentDom.replaceChild(placeholder, dom);
          dom = dom.nextSibling;
        } else {
          var lastDom = dom.previousSibling;
          parentDom.removeChild(dom);
          dom = lastDom || parentDom.firstChild;
        }
      } else {
        dom = dom.nextSibling;
      }
    }
  }

  function hydrateComponent(vNode, dom, lifecycle, context, isSVG, isClass) {
    var type = vNode.type;
    var ref = vNode.ref;
    var props = vNode.props || EMPTY_OBJ;

    if (isClass) {
      var _isSVG = dom.namespaceURI === svgNS;

      var instance = createClassComponentInstance(vNode, type, props, context, _isSVG, lifecycle);
      var input = instance._lastInput;
      instance._vNode = vNode;
      hydrate(input, dom, lifecycle, instance._childContext, _isSVG);
      vNode.dom = input.dom;
      mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
      instance._updating = false; // Mount finished allow going sync

      if (options.findDOMNodeEnabled) {
        componentToDOMNodeMap.set(instance, dom);
      }
    } else {
      var input$1 = createFunctionalComponentInput(vNode, type, props, context);
      hydrate(input$1, dom, lifecycle, context, isSVG);
      vNode.children = input$1;
      vNode.dom = input$1.dom;
      mountFunctionalComponentCallbacks(props, ref, dom, lifecycle);
    }

    return dom;
  }

  function hydrateElement(vNode, dom, lifecycle, context, isSVG) {
    var children = vNode.children;
    var props = vNode.props;
    var className = vNode.className;
    var flags = vNode.flags;
    var ref = vNode.ref;
    isSVG = isSVG || (flags & 128
    /* SvgElement */
    ) > 0;

    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type) {
      var newDom = mountElement(vNode, null, lifecycle, context, isSVG);
      vNode.dom = newDom;
      replaceChild(dom.parentNode, newDom, dom);
      return newDom;
    }

    vNode.dom = dom;

    if (!isInvalid(children)) {
      hydrateChildren(children, dom, lifecycle, context, isSVG);
    } else if (dom.firstChild !== null && !isSamePropsInnerHTML(dom, props)) {
      dom.textContent = ""; // dom has content, but VNode has no children remove everything from DOM
    }

    if (props) {
      var hasControlledValue = false;
      var isFormElement = (flags & 3584
      /* FormElement */
      ) > 0;

      if (isFormElement) {
        hasControlledValue = isControlledFormElement(props);
      }

      for (var prop in props) {
        // do not add a hasOwnProperty check here, it affects performance
        patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
      }

      if (isFormElement) {
        processElement(flags, vNode, dom, props, true, hasControlledValue);
      }
    }

    if (!isNullOrUndef(className)) {
      if (isSVG) {
        dom.setAttribute("class", className);
      } else {
        dom.className = className;
      }
    } else {
      if (dom.className !== "") {
        dom.removeAttribute("class");
      }
    }

    if (ref) {
      mountRef(dom, ref, lifecycle);
    }

    return dom;
  }

  function hydrateChildren(children, parentDom, lifecycle, context, isSVG) {
    normalizeChildNodes(parentDom);
    var dom = parentDom.firstChild;

    if (isStringOrNumber(children)) {
      if (!isNull(dom) && dom.nodeType === 3) {
        if (dom.nodeValue !== children) {
          dom.nodeValue = children;
        }
      } else if (children === "") {
        parentDom.appendChild(document.createTextNode(""));
      } else {
        parentDom.textContent = children;
      }

      if (!isNull(dom)) {
        dom = dom.nextSibling;
      }
    } else if (isArray(children)) {
      for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];

        if (!isNull(child) && isObject(child)) {
          if (!isNull(dom)) {
            var nextSibling = dom.nextSibling;
            hydrate(child, dom, lifecycle, context, isSVG);
            dom = nextSibling;
          } else {
            mount(child, parentDom, lifecycle, context, isSVG);
          }
        }
      }
    } else {
      // It's VNode
      if (!isNull(dom)) {
        hydrate(children, dom, lifecycle, context, isSVG);
        dom = dom.nextSibling;
      } else {
        mount(children, parentDom, lifecycle, context, isSVG);
      }
    } // clear any other DOM nodes, there should be only a single entry for the root


    while (dom) {
      var nextSibling$1 = dom.nextSibling;
      parentDom.removeChild(dom);
      dom = nextSibling$1;
    }
  }

  function hydrateText(vNode, dom) {
    if (dom.nodeType !== 3) {
      var newDom = mountText(vNode, null);
      vNode.dom = newDom;
      replaceChild(dom.parentNode, newDom, dom);
      return newDom;
    }

    var text = vNode.children;

    if (dom.nodeValue !== text) {
      dom.nodeValue = text;
    }

    vNode.dom = dom;
    return dom;
  }

  function hydrateVoid(vNode, dom) {
    vNode.dom = dom;
    return dom;
  }

  function hydrate(vNode, dom, lifecycle, context, isSVG) {
    var flags = vNode.flags;

    if (flags & 28
    /* Component */
    ) {
        hydrateComponent(vNode, dom, lifecycle, context, isSVG, (flags & 4
        /* ComponentClass */
        ) > 0);
      } else if (flags & 3970
    /* Element */
    ) {
        hydrateElement(vNode, dom, lifecycle, context, isSVG);
      } else if (flags & 1
    /* Text */
    ) {
        hydrateText(vNode, dom);
      } else if (flags & 4096
    /* Void */
    ) {
        hydrateVoid(vNode, dom);
      } else {
      throwError();
    }
  }

  function hydrateRoot(input, parentDom, lifecycle) {
    if (!isNull(parentDom)) {
      var dom = parentDom.firstChild;

      if (!isNull(dom)) {
        hydrate(input, dom, lifecycle, EMPTY_OBJ, false);
        dom = parentDom.firstChild; // clear any other DOM nodes, there should be only a single entry for the root

        while (dom = dom.nextSibling) {
          parentDom.removeChild(dom);
        }

        return true;
      }
    }

    return false;
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  var componentPools = new Map();
  var elementPools = new Map();

  function recycleElement(vNode, lifecycle, context, isSVG) {
    var tag = vNode.type;
    var pools = elementPools.get(tag);

    if (!isUndefined(pools)) {
      var key = vNode.key;
      var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);

      if (!isUndefined(pool)) {
        var recycledVNode = pool.pop();

        if (!isUndefined(recycledVNode)) {
          patchElement(recycledVNode, vNode, null, lifecycle, context, isSVG, true);
          return vNode.dom;
        }
      }
    }

    return null;
  }

  function poolElement(vNode) {
    var tag = vNode.type;
    var key = vNode.key;
    var pools = elementPools.get(tag);

    if (isUndefined(pools)) {
      pools = {
        keyed: new Map(),
        nonKeyed: []
      };
      elementPools.set(tag, pools);
    }

    if (isNull(key)) {
      pools.nonKeyed.push(vNode);
    } else {
      var pool = pools.keyed.get(key);

      if (isUndefined(pool)) {
        pool = [];
        pools.keyed.set(key, pool);
      }

      pool.push(vNode);
    }
  }

  function recycleComponent(vNode, lifecycle, context, isSVG) {
    var type = vNode.type;
    var pools = componentPools.get(type);

    if (!isUndefined(pools)) {
      var key = vNode.key;
      var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);

      if (!isUndefined(pool)) {
        var recycledVNode = pool.pop();

        if (!isUndefined(recycledVNode)) {
          var flags = vNode.flags;
          var failed = patchComponent(recycledVNode, vNode, null, lifecycle, context, isSVG, (flags & 4
          /* ComponentClass */
          ) > 0, true);

          if (!failed) {
            return vNode.dom;
          }
        }
      }
    }

    return null;
  }

  function poolComponent(vNode) {
    var hooks = vNode.ref;
    var nonRecycleHooks = hooks && (hooks.onComponentWillMount || hooks.onComponentWillUnmount || hooks.onComponentDidMount || hooks.onComponentWillUpdate || hooks.onComponentDidUpdate);

    if (nonRecycleHooks) {
      return;
    }

    var type = vNode.type;
    var key = vNode.key;
    var pools = componentPools.get(type);

    if (isUndefined(pools)) {
      pools = {
        keyed: new Map(),
        nonKeyed: []
      };
      componentPools.set(type, pools);
    }

    if (isNull(key)) {
      pools.nonKeyed.push(vNode);
    } else {
      var pool = pools.keyed.get(key);

      if (isUndefined(pool)) {
        pool = [];
        pools.keyed.set(key, pool);
      }

      pool.push(vNode);
    }
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function unmount(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    var flags = vNode.flags;
    var dom = vNode.dom;

    if (flags & 28
    /* Component */
    ) {
        var instance = vNode.children;
        var isStatefulComponent$$1 = (flags & 4
        /* ComponentClass */
        ) > 0;
        var props = vNode.props || EMPTY_OBJ;
        var ref = vNode.ref;

        if (!isRecycling) {
          if (isStatefulComponent$$1) {
            if (!instance._unmounted) {
              if (!isNull(options.beforeUnmount)) {
                options.beforeUnmount(vNode);
              }

              if (!isUndefined(instance.componentWillUnmount)) {
                instance.componentWillUnmount();
              }

              if (ref && !isRecycling) {
                ref(null);
              }

              instance._unmounted = true;

              if (options.findDOMNodeEnabled) {
                componentToDOMNodeMap.delete(instance);
              }

              unmount(instance._lastInput, null, instance._lifecycle, false, isRecycling);
            }
          } else {
            if (!isNullOrUndef(ref)) {
              if (!isNullOrUndef(ref.onComponentWillUnmount)) {
                ref.onComponentWillUnmount(dom, props);
              }
            }

            unmount(instance, null, lifecycle, false, isRecycling);
          }
        }

        if (options.recyclingEnabled && !isStatefulComponent$$1 && (parentDom || canRecycle)) {
          poolComponent(vNode);
        }
      } else if (flags & 3970
    /* Element */
    ) {
        var ref$1 = vNode.ref;
        var props$1 = vNode.props;

        if (!isRecycling && isFunction(ref$1)) {
          ref$1(null);
        }

        var children = vNode.children;

        if (!isNullOrUndef(children)) {
          if (isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
              var child = children[i];

              if (!isInvalid(child) && isObject(child)) {
                unmount(child, null, lifecycle, false, isRecycling);
              }
            }
          } else if (isObject(children)) {
            unmount(children, null, lifecycle, false, isRecycling);
          }
        }

        if (!isNull(props$1)) {
          for (var name in props$1) {
            // do not add a hasOwnProperty check here, it affects performance
            if (props$1[name] !== null && isAttrAnEvent(name)) {
              patchEvent(name, props$1[name], null, dom); // We need to set this null, because same props otherwise come back if SCU returns false and we are recyling

              props$1[name] = null;
            }
          }
        }

        if (options.recyclingEnabled && (parentDom || canRecycle)) {
          poolElement(vNode);
        }
      }

    if (!isNull(parentDom)) {
      removeChild(parentDom, dom);
    }
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */
  // rather than use a Map, like we did before, we can use an array here
  // given there shouldn't be THAT many roots on the page, the difference
  // in performance is huge: https://esbench.com/bench/5802a691330ab09900a1a2da


  var componentToDOMNodeMap = new Map();
  var roots = options.roots;
  /**
   * When inferno.options.findDOMNOdeEnabled is true, this function will return DOM Node by component instance
   * @param ref Component instance
   * @returns {*|null} returns dom node
   */

  function findDOMNode(ref) {
    if (!options.findDOMNodeEnabled) {
      throwError();
    }

    var dom = ref && ref.nodeType ? ref : null;
    return componentToDOMNodeMap.get(ref) || dom;
  }

  function getRoot(dom) {
    for (var i = 0, len = roots.length; i < len; i++) {
      var root = roots[i];

      if (root.dom === dom) {
        return root;
      }
    }

    return null;
  }

  function setRoot(dom, input, lifecycle) {
    var root = {
      dom: dom,
      input: input,
      lifecycle: lifecycle
    };
    roots.push(root);
    return root;
  }

  function removeRoot(root) {
    for (var i = 0, len = roots.length; i < len; i++) {
      if (roots[i] === root) {
        roots.splice(i, 1);
        return;
      }
    }
  }

  var documentBody = isBrowser ? document.body : null;
  /**
   * Renders virtual node tree into parent node.
   * @param {VNode | null | string | number} input vNode to be rendered
   * @param parentDom DOM node which content will be replaced by virtual node
   * @returns {InfernoChildren} rendered virtual node
   */

  function render(input, parentDom) {
    if (documentBody === parentDom) {
      throwError();
    }

    if (input === NO_OP) {
      return;
    }

    var root = getRoot(parentDom);

    if (isNull(root)) {
      var lifecycle = new Lifecycle();

      if (!isInvalid(input)) {
        if (input.dom) {
          input = directClone(input);
        }

        if (!hydrateRoot(input, parentDom, lifecycle)) {
          mount(input, parentDom, lifecycle, EMPTY_OBJ, false);
        }

        root = setRoot(parentDom, input, lifecycle);
        lifecycle.trigger();
      }
    } else {
      var lifecycle$1 = root.lifecycle;
      lifecycle$1.listeners = [];

      if (isNullOrUndef(input)) {
        unmount(root.input, parentDom, lifecycle$1, false, false);
        removeRoot(root);
      } else {
        if (input.dom) {
          input = directClone(input);
        }

        patch(root.input, input, parentDom, lifecycle$1, EMPTY_OBJ, false, false);
      }

      root.input = input;
      lifecycle$1.trigger();
    }

    if (root) {
      var rootInput = root.input;

      if (rootInput && rootInput.flags & 28
      /* Component */
      ) {
          return rootInput.children;
        }
    }
  }

  function createRenderer(parentDom) {
    return function renderer(lastInput, nextInput) {
      if (!parentDom) {
        parentDom = lastInput;
      }

      render(nextInput, parentDom);
    };
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function patch(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    if (lastVNode !== nextVNode) {
      var lastFlags = lastVNode.flags;
      var nextFlags = nextVNode.flags;

      if (nextFlags & 28
      /* Component */
      ) {
          var isClass = (nextFlags & 4
          /* ComponentClass */
          ) > 0;

          if (lastFlags & 28
          /* Component */
          ) {
              patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling);
            } else {
            replaceVNode(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, isClass), lastVNode, lifecycle, isRecycling);
          }
        } else if (nextFlags & 3970
      /* Element */
      ) {
          if (lastFlags & 3970
          /* Element */
          ) {
              patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
            } else {
            replaceVNode(parentDom, mountElement(nextVNode, null, lifecycle, context, isSVG), lastVNode, lifecycle, isRecycling);
          }
        } else if (nextFlags & 1
      /* Text */
      ) {
          if (lastFlags & 1
          /* Text */
          ) {
              patchText(lastVNode, nextVNode);
            } else {
            replaceVNode(parentDom, mountText(nextVNode, null), lastVNode, lifecycle, isRecycling);
          }
        } else if (nextFlags & 4096
      /* Void */
      ) {
          if (lastFlags & 4096
          /* Void */
          ) {
              patchVoid(lastVNode, nextVNode);
            } else {
            replaceVNode(parentDom, mountVoid(nextVNode, null), lastVNode, lifecycle, isRecycling);
          }
        } else {
        // Error case: mount new one replacing old one
        replaceLastChildAndUnmount(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
      }
    }
  }

  function unmountChildren(children, dom, lifecycle, isRecycling) {
    if (isVNode(children)) {
      unmount(children, dom, lifecycle, true, isRecycling);
    } else if (isArray(children)) {
      removeAllChildren(dom, children, lifecycle, isRecycling);
    } else {
      dom.textContent = "";
    }
  }

  function patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    var nextTag = nextVNode.type;
    var lastTag = lastVNode.type;

    if (lastTag !== nextTag) {
      replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
    } else {
      var dom = lastVNode.dom;
      var lastProps = lastVNode.props;
      var nextProps = nextVNode.props;
      var lastChildren = lastVNode.children;
      var nextChildren = nextVNode.children;
      var lastFlags = lastVNode.flags;
      var nextFlags = nextVNode.flags;
      var nextRef = nextVNode.ref;
      var lastClassName = lastVNode.className;
      var nextClassName = nextVNode.className;
      nextVNode.dom = dom;
      isSVG = isSVG || (nextFlags & 128
      /* SvgElement */
      ) > 0;

      if (lastChildren !== nextChildren) {
        var childrenIsSVG = isSVG === true && nextVNode.type !== "foreignObject";
        patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, childrenIsSVG, isRecycling);
      } // inlined patchProps  -- starts --


      if (lastProps !== nextProps) {
        var lastPropsOrEmpty = lastProps || EMPTY_OBJ;
        var nextPropsOrEmpty = nextProps || EMPTY_OBJ;
        var hasControlledValue = false;

        if (nextPropsOrEmpty !== EMPTY_OBJ) {
          var isFormElement = (nextFlags & 3584
          /* FormElement */
          ) > 0;

          if (isFormElement) {
            hasControlledValue = isControlledFormElement(nextPropsOrEmpty);
          }

          for (var prop in nextPropsOrEmpty) {
            // do not add a hasOwnProperty check here, it affects performance
            var nextValue = nextPropsOrEmpty[prop];
            var lastValue = lastPropsOrEmpty[prop];
            patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue);
          }

          if (isFormElement) {
            // When inferno is recycling form element, we need to process it like it would be mounting
            processElement(nextFlags, nextVNode, dom, nextPropsOrEmpty, isRecycling, hasControlledValue);
          }
        }

        if (lastPropsOrEmpty !== EMPTY_OBJ) {
          for (var prop$1 in lastPropsOrEmpty) {
            // do not add a hasOwnProperty check here, it affects performance
            if (isNullOrUndef(nextPropsOrEmpty[prop$1]) && !isNullOrUndef(lastPropsOrEmpty[prop$1])) {
              removeProp(prop$1, lastPropsOrEmpty[prop$1], dom, nextFlags);
            }
          }
        }
      } // inlined patchProps  -- ends --


      if (lastClassName !== nextClassName) {
        if (isNullOrUndef(nextClassName)) {
          dom.removeAttribute("class");
        } else {
          if (isSVG) {
            dom.setAttribute("class", nextClassName);
          } else {
            dom.className = nextClassName;
          }
        }
      }

      if (nextRef) {
        if (lastVNode.ref !== nextRef || isRecycling) {
          mountRef(dom, nextRef, lifecycle);
        }
      }
    }
  }

  function patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    var patchArray = false;
    var patchKeyed = false;

    if (nextFlags & 64
    /* HasNonKeyedChildren */
    ) {
        patchArray = true;
      } else if ((lastFlags & 32
    /* HasKeyedChildren */
    ) > 0 && (nextFlags & 32
    /* HasKeyedChildren */
    ) > 0) {
      patchKeyed = true;
      patchArray = true;
    } else if (isInvalid(nextChildren)) {
      unmountChildren(lastChildren, dom, lifecycle, isRecycling);
    } else if (isInvalid(lastChildren)) {
      if (isStringOrNumber(nextChildren)) {
        setTextContent(dom, nextChildren);
      } else {
        if (isArray(nextChildren)) {
          mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
        } else {
          mount(nextChildren, dom, lifecycle, context, isSVG);
        }
      }
    } else if (isStringOrNumber(nextChildren)) {
      if (isStringOrNumber(lastChildren)) {
        updateTextContent(dom, nextChildren);
      } else {
        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
        setTextContent(dom, nextChildren);
      }
    } else if (isArray(nextChildren)) {
      if (isArray(lastChildren)) {
        patchArray = true;

        if (isKeyed(lastChildren, nextChildren)) {
          patchKeyed = true;
        }
      } else {
        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
        mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
      }
    } else if (isArray(lastChildren)) {
      removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
      mount(nextChildren, dom, lifecycle, context, isSVG);
    } else if (isVNode(nextChildren)) {
      if (isVNode(lastChildren)) {
        patch(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
      } else {
        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
        mount(nextChildren, dom, lifecycle, context, isSVG);
      }
    }

    if (patchArray) {
      var lastLength = lastChildren.length;
      var nextLength = nextChildren.length; // Fast path's for both algorithms

      if (lastLength === 0) {
        if (nextLength > 0) {
          mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
        }
      } else if (nextLength === 0) {
        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
      } else if (patchKeyed) {
        patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling, lastLength, nextLength);
      } else {
        patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling, lastLength, nextLength);
      }
    }
  }

  function patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling) {
    var lastType = lastVNode.type;
    var nextType = nextVNode.type;
    var lastKey = lastVNode.key;
    var nextKey = nextVNode.key;

    if (lastType !== nextType || lastKey !== nextKey) {
      replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
      return false;
    } else {
      var nextProps = nextVNode.props || EMPTY_OBJ;

      if (isClass) {
        var instance = lastVNode.children;
        instance._updating = true;

        if (instance._unmounted) {
          if (isNull(parentDom)) {
            return true;
          }

          replaceChild(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, (nextVNode.flags & 4
          /* ComponentClass */
          ) > 0), lastVNode.dom);
        } else {
          var hasComponentDidUpdate = !isUndefined(instance.componentDidUpdate);
          var nextState = instance.state; // When component has componentDidUpdate hook, we need to clone lastState or will be modified by reference during update

          var lastState = hasComponentDidUpdate ? combineFrom(nextState, null) : nextState;
          var lastProps = instance.props;
          nextVNode.children = instance;
          instance._isSVG = isSVG;
          var lastInput = instance._lastInput;

          var nextInput = instance._updateComponent(lastState, nextState, lastProps, nextProps, context, false, false); // If this component was destroyed by its parent do nothing, this is no-op
          // It can happen by using external callback etc during render / update


          if (instance._unmounted) {
            return false;
          }

          var didUpdate = true; // Update component before getting child context

          var childContext;

          if (!isNullOrUndef(instance.getChildContext)) {
            childContext = instance.getChildContext();
          }

          if (isNullOrUndef(childContext)) {
            childContext = context;
          } else {
            childContext = combineFrom(context, childContext);
          }

          instance._childContext = childContext;

          if (isInvalid(nextInput)) {
            nextInput = createVoidVNode();
          } else if (nextInput === NO_OP) {
            nextInput = lastInput;
            didUpdate = false;
          } else if (isStringOrNumber(nextInput)) {
            nextInput = createTextVNode(nextInput, null);
          } else if (isArray(nextInput)) {
            throwError();
          } else if (isObject(nextInput)) {
            if (!isNull(nextInput.dom)) {
              nextInput = directClone(nextInput);
            }
          }

          if (nextInput.flags & 28
          /* Component */
          ) {
              nextInput.parentVNode = nextVNode;
            } else if (lastInput.flags & 28
          /* Component */
          ) {
              lastInput.parentVNode = nextVNode;
            }

          instance._lastInput = nextInput;
          instance._vNode = nextVNode;

          if (didUpdate) {
            patch(lastInput, nextInput, parentDom, lifecycle, childContext, isSVG, isRecycling);

            if (hasComponentDidUpdate && instance.componentDidUpdate) {
              instance.componentDidUpdate(lastProps, lastState);
            }

            if (!isNull(options.afterUpdate)) {
              options.afterUpdate(nextVNode);
            }

            if (options.findDOMNodeEnabled) {
              componentToDOMNodeMap.set(instance, nextInput.dom);
            }
          }

          nextVNode.dom = nextInput.dom;
        }

        instance._updating = false;
      } else {
        var shouldUpdate = true;
        var lastProps$1 = lastVNode.props;
        var nextHooks = nextVNode.ref;
        var nextHooksDefined = !isNullOrUndef(nextHooks);
        var lastInput$1 = lastVNode.children;
        var nextInput$1 = lastInput$1;
        nextVNode.dom = lastVNode.dom;
        nextVNode.children = lastInput$1;

        if (lastKey !== nextKey) {
          shouldUpdate = true;
        } else {
          if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentShouldUpdate)) {
            shouldUpdate = nextHooks.onComponentShouldUpdate(lastProps$1, nextProps);
          }
        }

        if (shouldUpdate !== false) {
          if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentWillUpdate)) {
            nextHooks.onComponentWillUpdate(lastProps$1, nextProps);
          }

          nextInput$1 = nextType(nextProps, context);

          if (isInvalid(nextInput$1)) {
            nextInput$1 = createVoidVNode();
          } else if (isStringOrNumber(nextInput$1) && nextInput$1 !== NO_OP) {
            nextInput$1 = createTextVNode(nextInput$1, null);
          } else if (isArray(nextInput$1)) {
            throwError();
          } else if (isObject(nextInput$1)) {
            if (!isNull(nextInput$1.dom)) {
              nextInput$1 = directClone(nextInput$1);
            }
          }

          if (nextInput$1 !== NO_OP) {
            patch(lastInput$1, nextInput$1, parentDom, lifecycle, context, isSVG, isRecycling);
            nextVNode.children = nextInput$1;

            if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentDidUpdate)) {
              nextHooks.onComponentDidUpdate(lastProps$1, nextProps);
            }

            nextVNode.dom = nextInput$1.dom;
          }
        }

        if (nextInput$1.flags & 28
        /* Component */
        ) {
            nextInput$1.parentVNode = nextVNode;
          } else if (lastInput$1.flags & 28
        /* Component */
        ) {
            lastInput$1.parentVNode = nextVNode;
          }
      }
    }

    return false;
  }

  function patchText(lastVNode, nextVNode) {
    var nextText = nextVNode.children;
    var dom = lastVNode.dom;
    nextVNode.dom = dom;

    if (lastVNode.children !== nextText) {
      dom.nodeValue = nextText;
    }
  }

  function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
  }

  function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling, lastChildrenLength, nextChildrenLength) {
    var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
    var i = 0;

    for (; i < commonLength; i++) {
      var nextChild = nextChildren[i];

      if (nextChild.dom) {
        nextChild = nextChildren[i] = directClone(nextChild);
      }

      patch(lastChildren[i], nextChild, dom, lifecycle, context, isSVG, isRecycling);
    }

    if (lastChildrenLength < nextChildrenLength) {
      for (i = commonLength; i < nextChildrenLength; i++) {
        var nextChild$1 = nextChildren[i];

        if (nextChild$1.dom) {
          nextChild$1 = nextChildren[i] = directClone(nextChild$1);
        }

        appendChild(dom, mount(nextChild$1, null, lifecycle, context, isSVG));
      }
    } else if (lastChildrenLength > nextChildrenLength) {
      for (i = commonLength; i < lastChildrenLength; i++) {
        unmount(lastChildren[i], dom, lifecycle, false, isRecycling);
      }
    }
  }

  function patchKeyedChildren(a, b, dom, lifecycle, context, isSVG, isRecycling, aLength, bLength) {
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var aStart = 0;
    var bStart = 0;
    var i;
    var j;
    var aNode;
    var bNode;
    var nextNode;
    var nextPos;
    var node;
    var aStartNode = a[aStart];
    var bStartNode = b[bStart];
    var aEndNode = a[aEnd];
    var bEndNode = b[bEnd];

    if (bStartNode.dom) {
      b[bStart] = bStartNode = directClone(bStartNode);
    }

    if (bEndNode.dom) {
      b[bEnd] = bEndNode = directClone(bEndNode);
    } // Step 1
    // tslint:disable-next-line


    outer: {
      // Sync nodes with the same key at the beginning.
      while (aStartNode.key === bStartNode.key) {
        patch(aStartNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
        aStart++;
        bStart++;

        if (aStart > aEnd || bStart > bEnd) {
          break outer;
        }

        aStartNode = a[aStart];
        bStartNode = b[bStart];

        if (bStartNode.dom) {
          b[bStart] = bStartNode = directClone(bStartNode);
        }
      } // Sync nodes with the same key at the end.


      while (aEndNode.key === bEndNode.key) {
        patch(aEndNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
        aEnd--;
        bEnd--;

        if (aStart > aEnd || bStart > bEnd) {
          break outer;
        }

        aEndNode = a[aEnd];
        bEndNode = b[bEnd];

        if (bEndNode.dom) {
          b[bEnd] = bEndNode = directClone(bEndNode);
        }
      }
    }

    if (aStart > aEnd) {
      if (bStart <= bEnd) {
        nextPos = bEnd + 1;
        nextNode = nextPos < bLength ? b[nextPos].dom : null;

        while (bStart <= bEnd) {
          node = b[bStart];

          if (node.dom) {
            b[bStart] = node = directClone(node);
          }

          bStart++;
          insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);
        }
      }
    } else if (bStart > bEnd) {
      while (aStart <= aEnd) {
        unmount(a[aStart++], dom, lifecycle, false, isRecycling);
      }
    } else {
      var aLeft = aEnd - aStart + 1;
      var bLeft = bEnd - bStart + 1;
      var sources = new Array(bLeft); // Mark all nodes as inserted.

      for (i = 0; i < bLeft; i++) {
        sources[i] = -1;
      }

      var moved = false;
      var pos = 0;
      var patched = 0; // When sizes are small, just loop them through

      if (bLeft <= 4 || aLeft * bLeft <= 16) {
        for (i = aStart; i <= aEnd; i++) {
          aNode = a[i];

          if (patched < bLeft) {
            for (j = bStart; j <= bEnd; j++) {
              bNode = b[j];

              if (aNode.key === bNode.key) {
                sources[j - bStart] = i;

                if (pos > j) {
                  moved = true;
                } else {
                  pos = j;
                }

                if (bNode.dom) {
                  b[j] = bNode = directClone(bNode);
                }

                patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                patched++;
                a[i] = null;
                break;
              }
            }
          }
        }
      } else {
        var keyIndex = new Map(); // Map keys by their index in array

        for (i = bStart; i <= bEnd; i++) {
          keyIndex.set(b[i].key, i);
        } // Try to patch same keys


        for (i = aStart; i <= aEnd; i++) {
          aNode = a[i];

          if (patched < bLeft) {
            j = keyIndex.get(aNode.key);

            if (!isUndefined(j)) {
              bNode = b[j];
              sources[j - bStart] = i;

              if (pos > j) {
                moved = true;
              } else {
                pos = j;
              }

              if (bNode.dom) {
                b[j] = bNode = directClone(bNode);
              }

              patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
              patched++;
              a[i] = null;
            }
          }
        }
      } // fast-path: if nothing patched remove all old and add all new


      if (aLeft === aLength && patched === 0) {
        removeAllChildren(dom, a, lifecycle, isRecycling);

        while (bStart < bLeft) {
          node = b[bStart];

          if (node.dom) {
            b[bStart] = node = directClone(node);
          }

          bStart++;
          insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), null);
        }
      } else {
        i = aLeft - patched;

        while (i > 0) {
          aNode = a[aStart++];

          if (!isNull(aNode)) {
            unmount(aNode, dom, lifecycle, true, isRecycling);
            i--;
          }
        }

        if (moved) {
          var seq = lis_algorithm(sources);
          j = seq.length - 1;

          for (i = bLeft - 1; i >= 0; i--) {
            if (sources[i] === -1) {
              pos = i + bStart;
              node = b[pos];

              if (node.dom) {
                b[pos] = node = directClone(node);
              }

              nextPos = pos + 1;
              insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextPos < bLength ? b[nextPos].dom : null);
            } else {
              if (j < 0 || i !== seq[j]) {
                pos = i + bStart;
                node = b[pos];
                nextPos = pos + 1;
                insertOrAppend(dom, node.dom, nextPos < bLength ? b[nextPos].dom : null);
              } else {
                j--;
              }
            }
          }
        } else if (patched !== bLeft) {
          // when patched count doesn't match b length we need to insert those new ones
          // loop backwards so we can use insertBefore
          for (i = bLeft - 1; i >= 0; i--) {
            if (sources[i] === -1) {
              pos = i + bStart;
              node = b[pos];

              if (node.dom) {
                b[pos] = node = directClone(node);
              }

              nextPos = pos + 1;
              insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextPos < bLength ? b[nextPos].dom : null);
            }
          }
        }
      }
    }
  } // // https://en.wikipedia.org/wiki/Longest_increasing_subsequence


  function lis_algorithm(arr) {
    var p = arr.slice(0);
    var result = [0];
    var i;
    var j;
    var u;
    var v;
    var c;
    var len = arr.length;

    for (i = 0; i < len; i++) {
      var arrI = arr[i];

      if (arrI !== -1) {
        j = result[result.length - 1];

        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }

        u = 0;
        v = result.length - 1;

        while (u < v) {
          c = (u + v) / 2 | 0;

          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }

        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }

          result[u] = i;
        }
      }
    }

    u = result.length;
    v = result[u - 1];

    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }

    return result;
  }

  function isAttrAnEvent(attr) {
    return attr[0] === "o" && attr[1] === "n";
  }

  function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue) {
    if (lastValue !== nextValue) {
      if (skipProps.has(prop) || hasControlledValue && prop === "value") {
        return;
      } else if (booleanProps.has(prop)) {
        prop = prop === "autoFocus" ? prop.toLowerCase() : prop;
        dom[prop] = !!nextValue;
      } else if (strictProps.has(prop)) {
        var value = isNullOrUndef(nextValue) ? "" : nextValue;

        if (dom[prop] !== value) {
          dom[prop] = value;
        }
      } else if (isAttrAnEvent(prop)) {
        patchEvent(prop, lastValue, nextValue, dom);
      } else if (isNullOrUndef(nextValue)) {
        dom.removeAttribute(prop);
      } else if (prop === "style") {
        patchStyle(lastValue, nextValue, dom);
      } else if (prop === "dangerouslySetInnerHTML") {
        var lastHtml = lastValue && lastValue.__html;
        var nextHtml = nextValue && nextValue.__html;

        if (lastHtml !== nextHtml) {
          if (!isNullOrUndef(nextHtml) && !isSameInnerHTML(dom, nextHtml)) {
            dom.innerHTML = nextHtml;
          }
        }
      } else {
        // We optimize for NS being boolean. Its 99.9% time false
        if (isSVG && namespaces.has(prop)) {
          // If we end up in this path we can read property again
          dom.setAttributeNS(namespaces.get(prop), prop, nextValue);
        } else {
          dom.setAttribute(prop, nextValue);
        }
      }
    }
  }

  function patchEvent(name, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
      if (delegatedEvents.has(name)) {
        handleEvent(name, lastValue, nextValue, dom);
      } else {
        var nameLowerCase = name.toLowerCase();
        var domEvent = dom[nameLowerCase]; // if the function is wrapped, that means it's been controlled by a wrapper

        if (domEvent && domEvent.wrapped) {
          return;
        }

        if (!isFunction(nextValue) && !isNullOrUndef(nextValue)) {
          var linkEvent = nextValue.event;

          if (linkEvent && isFunction(linkEvent)) {
            dom[nameLowerCase] = function (e) {
              linkEvent(nextValue.data, e);
            };
          } else {
            throwError();
          }
        } else {
          dom[nameLowerCase] = nextValue;
        }
      }
    }
  } // We are assuming here that we come from patchProp routine
  // -nextAttrValue cannot be null or undefined


  function patchStyle(lastAttrValue, nextAttrValue, dom) {
    var domStyle = dom.style;
    var style;
    var value;

    if (isString(nextAttrValue)) {
      domStyle.cssText = nextAttrValue;
      return;
    }

    if (!isNullOrUndef(lastAttrValue) && !isString(lastAttrValue)) {
      for (style in nextAttrValue) {
        // do not add a hasOwnProperty check here, it affects performance
        value = nextAttrValue[style];

        if (value !== lastAttrValue[style]) {
          domStyle[style] = !isNumber(value) || isUnitlessNumber.has(style) ? value : value + "px";
        }
      }

      for (style in lastAttrValue) {
        if (isNullOrUndef(nextAttrValue[style])) {
          domStyle[style] = "";
        }
      }
    } else {
      for (style in nextAttrValue) {
        value = nextAttrValue[style];
        domStyle[style] = !isNumber(value) || isUnitlessNumber.has(style) ? value : value + "px";
      }
    }
  }

  function removeProp(prop, lastValue, dom, nextFlags) {
    if (prop === "value") {
      // When removing value of select element, it needs to be set to null instead empty string, because empty string is valid value for option which makes that option selected
      // MS IE/Edge don't follow html spec for textArea and input elements and we need to set empty string to value in those cases to avoid "null" and "undefined" texts
      dom.value = nextFlags & 2048
      /* SelectElement */
      ? null : "";
    } else if (prop === "style") {
      dom.removeAttribute("style");
    } else if (isAttrAnEvent(prop)) {
      handleEvent(prop, lastValue, null, dom);
    } else {
      dom.removeAttribute(prop);
    }
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function mount(vNode, parentDom, lifecycle, context, isSVG) {
    var flags = vNode.flags;

    if (flags & 3970
    /* Element */
    ) {
        return mountElement(vNode, parentDom, lifecycle, context, isSVG);
      } else if (flags & 28
    /* Component */
    ) {
        return mountComponent(vNode, parentDom, lifecycle, context, isSVG, (flags & 4
        /* ComponentClass */
        ) > 0);
      } else if (flags & 4096
    /* Void */
    ) {
        return mountVoid(vNode, parentDom);
      } else if (flags & 1
    /* Text */
    ) {
        return mountText(vNode, parentDom);
      } else {
      throwError();
    }
  }

  function mountText(vNode, parentDom) {
    var dom = document.createTextNode(vNode.children);
    vNode.dom = dom;

    if (!isNull(parentDom)) {
      appendChild(parentDom, dom);
    }

    return dom;
  }

  function mountVoid(vNode, parentDom) {
    var dom = document.createTextNode("");
    vNode.dom = dom;

    if (!isNull(parentDom)) {
      appendChild(parentDom, dom);
    }

    return dom;
  }

  function mountElement(vNode, parentDom, lifecycle, context, isSVG) {
    var dom;

    if (options.recyclingEnabled) {
      dom = recycleElement(vNode, lifecycle, context, isSVG);

      if (!isNull(dom)) {
        if (!isNull(parentDom)) {
          appendChild(parentDom, dom);
        }

        return dom;
      }
    }

    var flags = vNode.flags;
    isSVG = isSVG || (flags & 128
    /* SvgElement */
    ) > 0;
    dom = documentCreateElement(vNode.type, isSVG);
    var children = vNode.children;
    var props = vNode.props;
    var className = vNode.className;
    var ref = vNode.ref;
    vNode.dom = dom;

    if (!isInvalid(children)) {
      if (isStringOrNumber(children)) {
        setTextContent(dom, children);
      } else {
        var childrenIsSVG = isSVG === true && vNode.type !== "foreignObject";

        if (isArray(children)) {
          mountArrayChildren(children, dom, lifecycle, context, childrenIsSVG);
        } else if (isVNode(children)) {
          mount(children, dom, lifecycle, context, childrenIsSVG);
        }
      }
    }

    if (!isNull(props)) {
      var hasControlledValue = false;
      var isFormElement = (flags & 3584
      /* FormElement */
      ) > 0;

      if (isFormElement) {
        hasControlledValue = isControlledFormElement(props);
      }

      for (var prop in props) {
        // do not add a hasOwnProperty check here, it affects performance
        patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
      }

      if (isFormElement) {
        processElement(flags, vNode, dom, props, true, hasControlledValue);
      }
    }

    if (className !== null) {
      if (isSVG) {
        dom.setAttribute("class", className);
      } else {
        dom.className = className;
      }
    }

    if (!isNull(ref)) {
      mountRef(dom, ref, lifecycle);
    }

    if (!isNull(parentDom)) {
      appendChild(parentDom, dom);
    }

    return dom;
  }

  function mountArrayChildren(children, dom, lifecycle, context, isSVG) {
    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i]; // Verify can string/number be here. might cause de-opt. - Normalization takes care of it.

      if (!isInvalid(child)) {
        if (child.dom) {
          children[i] = child = directClone(child);
        }

        mount(children[i], dom, lifecycle, context, isSVG);
      }
    }
  }

  function mountComponent(vNode, parentDom, lifecycle, context, isSVG, isClass) {
    var dom;

    if (options.recyclingEnabled) {
      dom = recycleComponent(vNode, lifecycle, context, isSVG);

      if (!isNull(dom)) {
        if (!isNull(parentDom)) {
          appendChild(parentDom, dom);
        }

        return dom;
      }
    }

    var type = vNode.type;
    var props = vNode.props || EMPTY_OBJ;
    var ref = vNode.ref;

    if (isClass) {
      var instance = createClassComponentInstance(vNode, type, props, context, isSVG, lifecycle);
      var input = instance._lastInput;
      instance._vNode = vNode;
      vNode.dom = dom = mount(input, null, lifecycle, instance._childContext, isSVG);

      if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
      }

      mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
      instance._updating = false;

      if (options.findDOMNodeEnabled) {
        componentToDOMNodeMap.set(instance, dom);
      }
    } else {
      var input$1 = createFunctionalComponentInput(vNode, type, props, context);
      vNode.dom = dom = mount(input$1, null, lifecycle, context, isSVG);
      vNode.children = input$1;
      mountFunctionalComponentCallbacks(props, ref, dom, lifecycle);

      if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
      }
    }

    return dom;
  }

  function mountClassComponentCallbacks(vNode, ref, instance, lifecycle) {
    if (ref) {
      if (isFunction(ref)) {
        ref(instance);
      } else {
        throwError();
      }
    }

    var hasDidMount = !isUndefined(instance.componentDidMount);
    var afterMount = options.afterMount;

    if (hasDidMount || !isNull(afterMount)) {
      lifecycle.addListener(function () {
        instance._updating = true;

        if (afterMount) {
          afterMount(vNode);
        }

        if (hasDidMount) {
          instance.componentDidMount();
        }

        instance._updating = false;
      });
    }
  }

  function mountFunctionalComponentCallbacks(props, ref, dom, lifecycle) {
    if (ref) {
      if (!isNullOrUndef(ref.onComponentWillMount)) {
        ref.onComponentWillMount(props);
      }

      if (!isNullOrUndef(ref.onComponentDidMount)) {
        lifecycle.addListener(function () {
          return ref.onComponentDidMount(dom, props);
        });
      }
    }
  }

  function mountRef(dom, value, lifecycle) {
    if (isFunction(value)) {
      lifecycle.addListener(function () {
        return value(dom);
      });
    } else {
      if (isInvalid(value)) {
        return;
      }

      throwError();
    }
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */
  // We need EMPTY_OBJ defined in one place.
  // Its used for comparison so we cant inline it into shared


  var EMPTY_OBJ = {};

  function createClassComponentInstance(vNode, Component, props, context, isSVG, lifecycle) {
    if (isUndefined(context)) {
      context = EMPTY_OBJ; // Context should not be mutable
    }

    var instance = new Component(props, context);
    vNode.children = instance;
    instance._blockSetState = false;
    instance.context = context;

    if (instance.props === EMPTY_OBJ) {
      instance.props = props;
    } // setState callbacks must fire after render is done when called from componentWillReceiveProps or componentWillMount


    instance._lifecycle = lifecycle;
    instance._unmounted = false;
    instance._isSVG = isSVG;

    if (!isNullOrUndef(instance.componentWillMount)) {
      instance._blockRender = true;
      instance.componentWillMount();

      if (instance._pendingSetState) {
        var state = instance.state;
        var pending = instance._pendingState;

        if (state === null) {
          instance.state = pending;
        } else {
          for (var key in pending) {
            state[key] = pending[key];
          }
        }

        instance._pendingSetState = false;
        instance._pendingState = null;
      }

      instance._blockRender = false;
    }

    var childContext;

    if (!isNullOrUndef(instance.getChildContext)) {
      childContext = instance.getChildContext();
    }

    if (isNullOrUndef(childContext)) {
      instance._childContext = context;
    } else {
      instance._childContext = combineFrom(context, childContext);
    }

    if (!isNull(options.beforeRender)) {
      options.beforeRender(instance);
    }

    var input = instance.render(props, instance.state, context);

    if (!isNull(options.afterRender)) {
      options.afterRender(instance);
    }

    if (isArray(input)) {
      throwError();
    } else if (isInvalid(input)) {
      input = createVoidVNode();
    } else if (isStringOrNumber(input)) {
      input = createTextVNode(input, null);
    } else {
      if (input.dom) {
        input = directClone(input);
      }

      if (input.flags & 28
      /* Component */
      ) {
          // if we have an input that is also a component, we run into a tricky situation
          // where the root vNode needs to always have the correct DOM entry
          // so we break monomorphism on our input and supply it our vNode as parentVNode
          // we can optimise this in the future, but this gets us out of a lot of issues
          input.parentVNode = vNode;
        }
    }

    instance._lastInput = input;
    return instance;
  }

  function replaceLastChildAndUnmount(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling) {
    replaceVNode(parentDom, mount(nextInput, null, lifecycle, context, isSVG), lastInput, lifecycle, isRecycling);
  }

  function replaceVNode(parentDom, dom, vNode, lifecycle, isRecycling) {
    unmount(vNode, null, lifecycle, false, isRecycling);
    replaceChild(parentDom, dom, vNode.dom);
  }

  function createFunctionalComponentInput(vNode, component, props, context) {
    var input = component(props, context);

    if (isArray(input)) {
      throwError();
    } else if (isInvalid(input)) {
      input = createVoidVNode();
    } else if (isStringOrNumber(input)) {
      input = createTextVNode(input, null);
    } else {
      if (input.dom) {
        input = directClone(input);
      }

      if (input.flags & 28
      /* Component */
      ) {
          // if we have an input that is also a component, we run into a tricky situation
          // where the root vNode needs to always have the correct DOM entry
          // so we break monomorphism on our input and supply it our vNode as parentVNode
          // we can optimise this in the future, but this gets us out of a lot of issues
          input.parentVNode = vNode;
        }
    }

    return input;
  }

  function setTextContent(dom, text) {
    if (text !== "") {
      dom.textContent = text;
    } else {
      dom.appendChild(document.createTextNode(""));
    }
  }

  function updateTextContent(dom, text) {
    dom.firstChild.nodeValue = text;
  }

  function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
  }

  function insertOrAppend(parentDom, newNode, nextNode) {
    if (isNullOrUndef(nextNode)) {
      appendChild(parentDom, newNode);
    } else {
      parentDom.insertBefore(newNode, nextNode);
    }
  }

  function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
      return document.createElementNS(svgNS, tag);
    } else {
      return document.createElement(tag);
    }
  }

  function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    unmount(lastNode, null, lifecycle, false, isRecycling);
    var dom = mount(nextNode, null, lifecycle, context, isSVG);
    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
  }

  function replaceChild(parentDom, newDom, lastDom) {
    if (!parentDom) {
      parentDom = lastDom.parentNode;
    }

    parentDom.replaceChild(newDom, lastDom);
  }

  function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
  }

  function removeAllChildren(dom, children, lifecycle, isRecycling) {
    if (!options.recyclingEnabled || options.recyclingEnabled && !isRecycling) {
      removeChildren(null, children, lifecycle, isRecycling);
    }

    dom.textContent = "";
  }

  function removeChildren(dom, children, lifecycle, isRecycling) {
    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];

      if (!isInvalid(child)) {
        unmount(child, dom, lifecycle, true, isRecycling);
      }
    }
  }

  function isKeyed(lastChildren, nextChildren) {
    return nextChildren.length > 0 && !isNullOrUndef(nextChildren[0]) && !isNullOrUndef(nextChildren[0].key) && lastChildren.length > 0 && !isNullOrUndef(lastChildren[0]) && !isNullOrUndef(lastChildren[0].key);
  }

  function isSameInnerHTML(dom, innerHTML) {
    var tempdom = document.createElement("i");
    tempdom.innerHTML = innerHTML;
    return tempdom.innerHTML === dom.innerHTML;
  }

  function isSamePropsInnerHTML(dom, props) {
    return Boolean(props && props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html && isSameInnerHTML(dom, props.dangerouslySetInnerHTML.__html));
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */

  /**
   * Creates virtual node
   * @param {number} flags
   * @param {string|Function|null} type
   * @param {string|null=} className
   * @param {object=} children
   * @param {object=} props
   * @param {*=} key
   * @param {object|Function=} ref
   * @param {boolean=} noNormalise
   * @returns {VNode} returns new virtual node
   */


  function createVNode(flags, type, className, children, props, key, ref, noNormalise) {
    if (flags & 16
    /* ComponentUnknown */
    ) {
        flags = isStatefulComponent(type) ? 4
        /* ComponentClass */
        : 8
        /* ComponentFunction */
        ;
      }

    var vNode = {
      children: children === void 0 ? null : children,
      className: className === void 0 ? null : className,
      dom: null,
      flags: flags,
      key: key === void 0 ? null : key,
      props: props === void 0 ? null : props,
      ref: ref === void 0 ? null : ref,
      type: type
    };

    if (noNormalise !== true) {
      normalize(vNode);
    }

    if (options.createVNode !== null) {
      options.createVNode(vNode);
    }

    return vNode;
  }

  function directClone(vNodeToClone) {
    var newVNode;
    var flags = vNodeToClone.flags;

    if (flags & 28
    /* Component */
    ) {
        var props;
        var propsToClone = vNodeToClone.props;

        if (isNull(propsToClone)) {
          props = EMPTY_OBJ;
        } else {
          props = {};

          for (var key in propsToClone) {
            props[key] = propsToClone[key];
          }
        }

        newVNode = createVNode(flags, vNodeToClone.type, null, null, props, vNodeToClone.key, vNodeToClone.ref, true);
        var newProps = newVNode.props;
        var newChildren = newProps.children; // we need to also clone component children that are in props
        // as the children may also have been hoisted

        if (newChildren) {
          if (isArray(newChildren)) {
            var len = newChildren.length;

            if (len > 0) {
              var tmpArray = [];

              for (var i = 0; i < len; i++) {
                var child = newChildren[i];

                if (isStringOrNumber(child)) {
                  tmpArray.push(child);
                } else if (!isInvalid(child) && isVNode(child)) {
                  tmpArray.push(directClone(child));
                }
              }

              newProps.children = tmpArray;
            }
          } else if (isVNode(newChildren)) {
            newProps.children = directClone(newChildren);
          }
        }

        newVNode.children = null;
      } else if (flags & 3970
    /* Element */
    ) {
        var children = vNodeToClone.children;
        var props$1;
        var propsToClone$1 = vNodeToClone.props;

        if (propsToClone$1 === null) {
          props$1 = EMPTY_OBJ;
        } else {
          props$1 = {};

          for (var key$1 in propsToClone$1) {
            props$1[key$1] = propsToClone$1[key$1];
          }
        }

        newVNode = createVNode(flags, vNodeToClone.type, vNodeToClone.className, children, props$1, vNodeToClone.key, vNodeToClone.ref, !children);
      } else if (flags & 1
    /* Text */
    ) {
        newVNode = createTextVNode(vNodeToClone.children, vNodeToClone.key);
      }

    return newVNode;
  }
  /*
   directClone is preferred over cloneVNode and used internally also.
   This function makes Inferno backwards compatible.
   And can be tree-shaked by modern bundlers
  
   Would be nice to combine this with directClone but could not do it without breaking change
   */

  /**
   * Clones given virtual node by creating new instance of it
   * @param {VNode} vNodeToClone virtual node to be cloned
   * @param {Props=} props additional props for new virtual node
   * @param {...*} _children new children for new virtual node
   * @returns {VNode} new virtual node
   */


  function cloneVNode(vNodeToClone, props) {
    var _children = [],
        len$2 = arguments.length - 2;

    while (len$2-- > 0) {
      _children[len$2] = arguments[len$2 + 2];
    }

    var children = _children;
    var childrenLen = _children.length;

    if (childrenLen > 0 && !isUndefined(_children[0])) {
      if (!props) {
        props = {};
      }

      if (childrenLen === 1) {
        children = _children[0];
      }

      if (!isUndefined(children)) {
        props.children = children;
      }
    }

    var newVNode;

    if (isArray(vNodeToClone)) {
      var tmpArray = [];

      for (var i = 0, len = vNodeToClone.length; i < len; i++) {
        tmpArray.push(directClone(vNodeToClone[i]));
      }

      newVNode = tmpArray;
    } else {
      var flags = vNodeToClone.flags;
      var className = vNodeToClone.className;
      var key = vNodeToClone.key;
      var ref = vNodeToClone.ref;

      if (props) {
        if (props.hasOwnProperty("className")) {
          className = props.className;
        }

        if (props.hasOwnProperty("ref")) {
          ref = props.ref;
        }

        if (props.hasOwnProperty("key")) {
          key = props.key;
        }
      }

      if (flags & 28
      /* Component */
      ) {
          newVNode = createVNode(flags, vNodeToClone.type, className, null, !vNodeToClone.props && !props ? EMPTY_OBJ : combineFrom(vNodeToClone.props, props), key, ref, true);
          var newProps = newVNode.props;

          if (newProps) {
            var newChildren = newProps.children; // we need to also clone component children that are in props
            // as the children may also have been hoisted

            if (newChildren) {
              if (isArray(newChildren)) {
                var len$1 = newChildren.length;

                if (len$1 > 0) {
                  var tmpArray$1 = [];

                  for (var i$1 = 0; i$1 < len$1; i$1++) {
                    var child = newChildren[i$1];

                    if (isStringOrNumber(child)) {
                      tmpArray$1.push(child);
                    } else if (!isInvalid(child) && isVNode(child)) {
                      tmpArray$1.push(directClone(child));
                    }
                  }

                  newProps.children = tmpArray$1;
                }
              } else if (isVNode(newChildren)) {
                newProps.children = directClone(newChildren);
              }
            }
          }

          newVNode.children = null;
        } else if (flags & 3970
      /* Element */
      ) {
          children = props && !isUndefined(props.children) ? props.children : vNodeToClone.children;
          newVNode = createVNode(flags, vNodeToClone.type, className, children, !vNodeToClone.props && !props ? EMPTY_OBJ : combineFrom(vNodeToClone.props, props), key, ref, false);
        } else if (flags & 1
      /* Text */
      ) {
          newVNode = createTextVNode(vNodeToClone.children, key);
        }
    }

    return newVNode;
  }

  function createVoidVNode() {
    return createVNode(4096
    /* Void */
    , null);
  }

  function createTextVNode(text, key) {
    return createVNode(1
    /* Text */
    , null, null, text, null, key);
  }

  function isVNode(o) {
    return !!o.flags;
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */


  function applyKey(key, vNode) {
    vNode.key = key;
    return vNode;
  }

  function applyKeyIfMissing(key, vNode) {
    if (isNumber(key)) {
      key = "." + key;
    }

    if (isNull(vNode.key) || vNode.key[0] === ".") {
      return applyKey(key, vNode);
    }

    return vNode;
  }

  function applyKeyPrefix(key, vNode) {
    vNode.key = key + vNode.key;
    return vNode;
  }

  function _normalizeVNodes(nodes, result, index, currentKey) {
    for (var len = nodes.length; index < len; index++) {
      var n = nodes[index];
      var key = currentKey + "." + index;

      if (!isInvalid(n)) {
        if (isArray(n)) {
          _normalizeVNodes(n, result, 0, key);
        } else {
          if (isStringOrNumber(n)) {
            n = createTextVNode(n, null);
          } else if (isVNode(n) && n.dom || n.key && n.key[0] === ".") {
            n = directClone(n);
          }

          if (isNull(n.key) || n.key[0] === ".") {
            n = applyKey(key, n);
          } else {
            n = applyKeyPrefix(currentKey, n);
          }

          result.push(n);
        }
      }
    }
  }

  function normalizeVNodes(nodes) {
    var newNodes; // we assign $ which basically means we've flagged this array for future note
    // if it comes back again, we need to clone it, as people are using it
    // in an immutable way
    // tslint:disable

    if (nodes["$"] === true) {
      nodes = nodes.slice();
    } else {
      nodes["$"] = true;
    } // tslint:enable


    for (var i = 0, len = nodes.length; i < len; i++) {
      var n = nodes[i];

      if (isInvalid(n) || isArray(n)) {
        var result = (newNodes || nodes).slice(0, i);

        _normalizeVNodes(nodes, result, i, "");

        return result;
      } else if (isStringOrNumber(n)) {
        if (!newNodes) {
          newNodes = nodes.slice(0, i);
        }

        newNodes.push(applyKeyIfMissing(i, createTextVNode(n, null)));
      } else if (isVNode(n) && n.dom !== null || isNull(n.key) && (n.flags & 64
      /* HasNonKeyedChildren */
      ) === 0) {
        if (!newNodes) {
          newNodes = nodes.slice(0, i);
        }

        newNodes.push(applyKeyIfMissing(i, directClone(n)));
      } else if (newNodes) {
        newNodes.push(applyKeyIfMissing(i, directClone(n)));
      }
    }

    return newNodes || nodes;
  }

  function normalizeChildren(children) {
    if (isArray(children)) {
      return normalizeVNodes(children);
    } else if (isVNode(children) && children.dom !== null) {
      return directClone(children);
    }

    return children;
  }

  function normalizeProps(vNode, props, children) {
    if (vNode.flags & 3970
    /* Element */
    ) {
        if (isNullOrUndef(children) && props.hasOwnProperty("children")) {
          vNode.children = props.children;
        }

        if (props.hasOwnProperty("className")) {
          vNode.className = props.className || null;
          delete props.className;
        }
      }

    if (props.hasOwnProperty("ref")) {
      vNode.ref = props.ref;
      delete props.ref;
    }

    if (props.hasOwnProperty("key")) {
      vNode.key = props.key;
      delete props.key;
    }
  }

  function getFlagsForElementVnode(type) {
    if (type === "svg") {
      return 128
      /* SvgElement */
      ;
    } else if (type === "input") {
      return 512
      /* InputElement */
      ;
    } else if (type === "select") {
      return 2048
      /* SelectElement */
      ;
    } else if (type === "textarea") {
      return 1024
      /* TextareaElement */
      ;
    } else if (type === "media") {
      return 256
      /* MediaElement */
      ;
    }

    return 2
    /* HtmlElement */
    ;
  }

  function normalize(vNode) {
    var props = vNode.props;
    var children = vNode.children; // convert a wrongly created type back to element
    // Primitive node doesn't have defaultProps, only Component

    if (vNode.flags & 28
    /* Component */
    ) {
        // set default props
        var type = vNode.type;
        var defaultProps = type.defaultProps;

        if (!isNullOrUndef(defaultProps)) {
          if (!props) {
            props = vNode.props = defaultProps; // Create new object if only defaultProps given
          } else {
            for (var prop in defaultProps) {
              if (isUndefined(props[prop])) {
                props[prop] = defaultProps[prop];
              }
            }
          }
        }

        if (isString(type)) {
          vNode.flags = getFlagsForElementVnode(type);

          if (props && props.children) {
            vNode.children = props.children;
            children = props.children;
          }
        }
      }

    if (props) {
      normalizeProps(vNode, props, children);

      if (!isInvalid(props.children)) {
        props.children = normalizeChildren(props.children);
      }
    }

    if (!isInvalid(children)) {
      vNode.children = normalizeChildren(children);
    }

    
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */

  /**
   * Links given data to event as first parameter
   * @param {*} data data to be linked, it will be available in function as first parameter
   * @param {Function} event Function to be called when event occurs
   * @returns {{data: *, event: Function}}
   */


  function linkEvent(data, event) {
    if (isFunction(event)) {
      return {
        data: data,
        event: event
      };
    }

    return null; // Return null when event is invalid, to avoid creating unnecessary event handlers
  }
  /**
   * @module Inferno
   */

  /** TypeDoc Comment */

  /* tslint:disable:object-literal-sort-keys */


  var version$$1 = "3.9.0"; // we duplicate it so it plays nicely with different module loading systems

  var index = {
    EMPTY_OBJ: EMPTY_OBJ,
    NO_OP: NO_OP,
    cloneVNode: cloneVNode,
    createRenderer: createRenderer,
    createVNode: createVNode,
    findDOMNode: findDOMNode,
    getFlagsForElementVnode: getFlagsForElementVnode,
    internal_DOMNodeMap: componentToDOMNodeMap,
    internal_isUnitlessNumber: isUnitlessNumber,
    internal_normalize: normalize,
    internal_patch: patch,
    linkEvent: linkEvent,
    options: options,
    render: render,
    version: version$$1
  };
  exports['default'] = index;
  exports.EMPTY_OBJ = EMPTY_OBJ;
  exports.NO_OP = NO_OP;
  exports.cloneVNode = cloneVNode;
  exports.createRenderer = createRenderer;
  exports.createVNode = createVNode;
  exports.findDOMNode = findDOMNode;
  exports.getFlagsForElementVnode = getFlagsForElementVnode;
  exports.internal_DOMNodeMap = componentToDOMNodeMap;
  exports.internal_isUnitlessNumber = isUnitlessNumber;
  exports.internal_normalize = normalize;
  exports.internal_patch = patch;
  exports.linkEvent = linkEvent;
  exports.options = options;
  exports.render = render;
  exports.version = version$$1;
});

var inferno = createCommonjsModule(function (module) {
  module.exports = dist$1.default;
  module.exports.default = module.exports;
});

var dist$2 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  /**
   * @module Inferno-Shared
   */

  /** TypeDoc Comment */

  var NO_OP = "$NO_OP";
  var ERROR_MSG = "a runtime error occured! Use Inferno in development environment to find the error."; // this is MUCH faster than .constructor === Array and instanceof Array
  // in Node 7 and the later versions of V8, slower in older versions though

  var isArray = Array.isArray;

  function isStringOrNumber(o) {
    var type = _typeof(o);
    return type === "string" || type === "number";
  }

  function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
  }

  function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
  }

  function isFunction(o) {
    return typeof o === "function";
  }

  function isNull(o) {
    return o === null;
  }

  function isTrue(o) {
    return o === true;
  }

  function isUndefined(o) {
    return o === void 0;
  }

  function throwError(message) {
    if (!message) {
      message = ERROR_MSG;
    }

    throw new Error("Inferno Error: " + message);
  }

  function combineFrom(first, second) {
    var out = {};

    if (first) {
      for (var key in first) {
        out[key] = first[key];
      }
    }

    if (second) {
      for (var key$1 in second) {
        out[key$1] = second[key$1];
      }
    }

    return out;
  }
  /**
   * @module Inferno-Component
   */

  /** TypeDoc Comment */
  // Make sure u use EMPTY_OBJ from 'inferno', otherwise it'll be a different reference


  var noOp = ERROR_MSG;

  var componentCallbackQueue = new Map(); // when a components root VNode is also a component, we can run into issues
  // this will recursively look for vNode.parentNode if the VNode is a component

  function updateParentComponentVNodes(vNode, dom) {
    if (vNode.flags & 28
    /* Component */
    ) {
        var parentVNode = vNode.parentVNode;

        if (parentVNode) {
          parentVNode.dom = dom;
          updateParentComponentVNodes(parentVNode, dom);
        }
      }
  }

  var resolvedPromise = Promise.resolve();

  function addToQueue(component, force, callback) {
    var queue = componentCallbackQueue.get(component);

    if (queue === void 0) {
      queue = [];
      componentCallbackQueue.set(component, queue);
      resolvedPromise.then(function () {
        componentCallbackQueue.delete(component);
        component._updating = true;
        applyState(component, force, function () {
          for (var i = 0, len = queue.length; i < len; i++) {
            queue[i].call(component);
          }
        });
        component._updating = false;
      });
    }

    if (!isNullOrUndef(callback)) {
      queue.push(callback);
    }
  }

  function queueStateChanges(component, newState, callback) {
    if (isFunction(newState)) {
      newState = newState(component.state, component.props, component.context);
    }

    var pending = component._pendingState;

    if (isNullOrUndef(pending)) {
      component._pendingState = newState;
    } else {
      for (var stateKey in newState) {
        pending[stateKey] = newState[stateKey];
      }
    }

    if (!component._pendingSetState && !component._blockRender) {
      if (!component._updating) {
        component._pendingSetState = true;
        component._updating = true;
        applyState(component, false, callback);
        component._updating = false;
      } else {
        addToQueue(component, false, callback);
      }
    } else {
      component._pendingSetState = true;

      if (!isNullOrUndef(callback) && component._blockRender) {
        component._lifecycle.addListener(callback.bind(component));
      }
    }
  }

  function applyState(component, force, callback) {
    if (component._unmounted) {
      return;
    }

    if (force || !component._blockRender) {
      component._pendingSetState = false;
      var pendingState = component._pendingState;
      var prevState = component.state;
      var nextState = combineFrom(prevState, pendingState);
      var props = component.props;
      var context = component.context;
      component._pendingState = null;
      var nextInput;

      var renderOutput = component._updateComponent(prevState, nextState, props, props, context, force, true);

      var didUpdate = true;

      if (isInvalid(renderOutput)) {
        nextInput = inferno.createVNode(4096
        /* Void */
        , null);
      } else if (renderOutput === NO_OP) {
        nextInput = component._lastInput;
        didUpdate = false;
      } else if (isStringOrNumber(renderOutput)) {
        nextInput = inferno.createVNode(1
        /* Text */
        , null, null, renderOutput);
      } else if (isArray(renderOutput)) {
        return throwError();
      } else {
        nextInput = renderOutput;
      }

      var lastInput = component._lastInput;
      var vNode = component._vNode;
      var parentDom = lastInput.dom && lastInput.dom.parentNode || (lastInput.dom = vNode.dom);

      if (nextInput.flags & 28
      /* Component */
      ) {
          nextInput.parentVNode = vNode;
        }

      component._lastInput = nextInput;

      if (didUpdate) {
        var childContext;

        if (!isNullOrUndef(component.getChildContext)) {
          childContext = component.getChildContext();
        }

        if (isNullOrUndef(childContext)) {
          childContext = component._childContext;
        } else {
          childContext = combineFrom(context, childContext);
        }

        var lifeCycle = component._lifecycle;
        inferno.internal_patch(lastInput, nextInput, parentDom, lifeCycle, childContext, component._isSVG, false); // If this component was unmounted by its parent, do nothing. This is no-op

        if (component._unmounted) {
          return;
        }

        lifeCycle.trigger();

        if (!isNullOrUndef(component.componentDidUpdate)) {
          component.componentDidUpdate(props, prevState, context);
        }

        if (!isNull(inferno.options.afterUpdate)) {
          inferno.options.afterUpdate(vNode);
        }
      }

      var dom = vNode.dom = nextInput.dom;

      if (inferno.options.findDOMNodeEnabled) {
        inferno.internal_DOMNodeMap.set(component, nextInput.dom);
      }

      updateParentComponentVNodes(vNode, dom);
    } else {
      component.state = component._pendingState;
      component._pendingState = null;
    }

    if (!isNullOrUndef(callback)) {
      callback.call(component);
    }
  }

  var Component = function Component(props, context) {
    this.state = null;
    this._blockRender = false;
    this._blockSetState = true;
    this._pendingSetState = false;
    this._pendingState = null;
    this._lastInput = null;
    this._vNode = null;
    this._unmounted = false;
    this._lifecycle = null;
    this._childContext = null;
    this._isSVG = false;
    this._updating = true;
    /** @type {object} */

    this.props = props || inferno.EMPTY_OBJ;
    /** @type {object} */

    this.context = context || inferno.EMPTY_OBJ; // context should not be mutable
  };

  Component._r = [2];

  Component.prototype.forceUpdate = function forceUpdate(callback) {
    if (this._unmounted) {
      return;
    }

    applyState(this, true, callback);
  };

  Component.prototype.setState = function setState(newState, callback) {
    if (this._unmounted) {
      return;
    }

    if (!this._blockSetState) {
      queueStateChanges(this, newState, callback);
    } else {
      throwError();
    }
  };

  Component.prototype._updateComponent = function _updateComponent(prevState, nextState, prevProps, nextProps, context, force, fromSetState) {
    if (this._unmounted === true) {
      throwError();
    }

    if (prevProps !== nextProps || nextProps === inferno.EMPTY_OBJ || prevState !== nextState || force) {
      if (prevProps !== nextProps || nextProps === inferno.EMPTY_OBJ) {
        if (!isNullOrUndef(this.componentWillReceiveProps) && !fromSetState) {
          this._blockRender = true;
          this.componentWillReceiveProps(nextProps, context); // If this component was removed during its own update do nothing...

          if (this._unmounted) {
            return NO_OP;
          }

          this._blockRender = false;
        }

        if (this._pendingSetState) {
          nextState = combineFrom(nextState, this._pendingState);
          this._pendingSetState = false;
          this._pendingState = null;
        }
      }
      /* Update if scu is not defined, or it returns truthy value or force */


      if (force || isNullOrUndef(this.shouldComponentUpdate) || this.shouldComponentUpdate && this.shouldComponentUpdate(nextProps, nextState, context)) {
        if (!isNullOrUndef(this.componentWillUpdate)) {
          this._blockSetState = true;
          this.componentWillUpdate(nextProps, nextState, context);
          this._blockSetState = false;
        }

        this.props = nextProps;
        this.state = nextState;
        this.context = context;

        if (inferno.options.beforeRender) {
          inferno.options.beforeRender(this);
        }

        var render = this.render(nextProps, nextState, context);

        if (inferno.options.afterRender) {
          inferno.options.afterRender(this);
        }

        return render;
      } else {
        this.props = nextProps;
        this.state = nextState;
        this.context = context;
      }
    }

    return NO_OP;
  }; // tslint:disable-next-line:no-empty


  Component.prototype.render = function render(nextProps, nextState, nextContext) {};

  exports['default'] = Component;
});

var infernoComponent = createCommonjsModule(function (module) {
  module.exports = dist$2.default;
  module.exports.default = module.exports;
});

var dist = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopDefault(ex) {
    return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  var Component = _interopDefault(infernoComponent);
  /**
   * @module Inferno-Shared
   */

  /** TypeDoc Comment */


  var ERROR_MSG = "a runtime error occured! Use Inferno in development environment to find the error.";

  function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
  }

  function isFunction(o) {
    return typeof o === "function";
  }

  function isNull(o) {
    return o === null;
  }

  function isUndefined(o) {
    return o === void 0;
  }

  function isObject(o) {
    return _typeof(o) === "object";
  }

  function throwError(message) {
    if (!message) {
      message = ERROR_MSG;
    }

    throw new Error("Inferno Error: " + message);
  }
  /**
   * @module Inferno-Create-Class
   */

  /** TypeDoc Comment */
  // don't autobind these methods since they already have guaranteed context.


  var AUTOBIND_BLACKLIST = new Set();
  AUTOBIND_BLACKLIST.add("constructor");
  AUTOBIND_BLACKLIST.add("render");
  AUTOBIND_BLACKLIST.add("shouldComponentUpdate");
  AUTOBIND_BLACKLIST.add("componentWillReceiveProps");
  AUTOBIND_BLACKLIST.add("componentWillUpdate");
  AUTOBIND_BLACKLIST.add("componentDidUpdate");
  AUTOBIND_BLACKLIST.add("componentWillMount");
  AUTOBIND_BLACKLIST.add("componentDidMount");
  AUTOBIND_BLACKLIST.add("componentWillUnmount");
  AUTOBIND_BLACKLIST.add("componentDidUnmount");

  function extend(base, props) {
    for (var key in props) {
      if (!isNullOrUndef(props[key])) {
        base[key] = props[key];
      }
    }

    return base;
  }

  function bindAll(ctx) {
    for (var i in ctx) {
      var v = ctx[i];

      if (typeof v === "function" && !v.__bound && !AUTOBIND_BLACKLIST.has(i)) {
        (ctx[i] = v.bind(ctx)).__bound = true;
      }
    }
  }

  function collateMixins(mixins, keyed) {
    if (keyed === void 0) {
      keyed = {};
    }

    for (var i = 0, len = mixins.length; i < len; i++) {
      var mixin = mixins[i]; // Surprise: Mixins can have mixins

      if (mixin.mixins) {
        // Recursively collate sub-mixins
        collateMixins(mixin.mixins, keyed);
      }

      for (var key in mixin) {
        if (mixin.hasOwnProperty(key) && typeof mixin[key] === "function") {
          (keyed[key] || (keyed[key] = [])).push(mixin[key]);
        }
      }
    }

    return keyed;
  }

  function multihook(hooks, mergeFn) {
    return function () {
      var arguments$1 = arguments;
      var this$1 = this;
      var ret;

      for (var i = 0, len = hooks.length; i < len; i++) {
        var hook = hooks[i];
        var r = hook.apply(this$1, arguments$1);

        if (mergeFn) {
          ret = mergeFn(ret, r);
        } else if (!isUndefined(r)) {
          ret = r;
        }
      }

      return ret;
    };
  }

  function mergeNoDupes(previous, current) {
    if (!isUndefined(current)) {
      if (!isObject(current)) {
        throwError("Expected Mixin to return value to be an object or null.");
      }

      if (!previous) {
        previous = {};
      }

      for (var key in current) {
        if (current.hasOwnProperty(key)) {
          if (previous.hasOwnProperty(key)) {
            throwError("Mixins return duplicate key " + key + " in their return values");
          }

          previous[key] = current[key];
        }
      }
    }

    return previous;
  }

  function applyMixin(key, inst, mixin) {
    var hooks = isUndefined(inst[key]) ? mixin : mixin.concat(inst[key]);

    if (key === "getDefaultProps" || key === "getInitialState" || key === "getChildContext") {
      inst[key] = multihook(hooks, mergeNoDupes);
    } else {
      inst[key] = multihook(hooks);
    }
  }

  function applyMixins(Cl, mixins) {
    for (var key in mixins) {
      if (mixins.hasOwnProperty(key)) {
        var mixin = mixins[key];
        var inst = void 0;

        if (key === "getDefaultProps") {
          inst = Cl;
        } else {
          inst = Cl.prototype;
        }

        if (isFunction(mixin[0])) {
          applyMixin(key, inst, mixin);
        } else {
          inst[key] = mixin;
        }
      }
    }
  }

  function createClass$$1(obj) {
    var Cl = function (Component$$1) {
      function Cl(props, context) {
        Component$$1.call(this, props, context);
        bindAll(this);

        if (this.getInitialState) {
          this.state = this.getInitialState();
        }
      }

      if (Component$$1) {
        Cl.__proto__ = Component$$1;
      }

      Cl.prototype = Object.create(Component$$1 && Component$$1.prototype);
      Cl.prototype.constructor = Cl;

      Cl.prototype.replaceState = function replaceState(nextState, callback) {
        this.setState(nextState, callback);
      };

      Cl.prototype.isMounted = function isMounted() {
        return !this._unmounted;
      };

      return Cl;
    }(Component);

    Cl.displayName = obj.displayName || "Component";
    Cl.propTypes = obj.propTypes;
    Cl.mixins = obj.mixins && collateMixins(obj.mixins);
    Cl.getDefaultProps = obj.getDefaultProps;
    extend(Cl.prototype, obj);

    if (obj.statics) {
      extend(Cl, obj.statics);
    }

    if (obj.mixins) {
      applyMixins(Cl, collateMixins(obj.mixins));
    }

    Cl.defaultProps = isUndefined(Cl.getDefaultProps) ? undefined : Cl.getDefaultProps();
    return Cl;
  }
  /**
   * @module Inferno-Shared
   */

  /** TypeDoc Comment */


  function isNullOrUndef$1(o) {
    return isUndefined$1(o) || isNull$1(o);
  }

  function isInvalid(o) {
    return isNull$1(o) || o === false || isTrue(o) || isUndefined$1(o);
  }

  function isString(o) {
    return typeof o === "string";
  }

  function isNull$1(o) {
    return o === null;
  }

  function isTrue(o) {
    return o === true;
  }

  function isUndefined$1(o) {
    return o === void 0;
  }

  function isObject$1(o) {
    return _typeof(o) === "object";
  }
  /**
   * @module Inferno-Create-Element
   */

  /** TypeDoc Comment */


  var componentHooks = new Set();
  componentHooks.add("onComponentWillMount");
  componentHooks.add("onComponentDidMount");
  componentHooks.add("onComponentWillUnmount");
  componentHooks.add("onComponentShouldUpdate");
  componentHooks.add("onComponentWillUpdate");
  componentHooks.add("onComponentDidUpdate");
  /**
   * Creates virtual node
   * @param {string|Function|Component<any, any>} type Type of node
   * @param {object=} props Optional props for virtual node
   * @param {...{object}=} _children Optional children for virtual node
   * @returns {VNode} new virtual ndoe
   */

  function createElement$1(type, props) {
    var arguments$1 = arguments;
    var _children = [],
        len = arguments.length - 2;

    while (len-- > 0) {
      _children[len] = arguments$1[len + 2];
    }

    if (isInvalid(type) || isObject$1(type)) {
      throw new Error("Inferno Error: createElement() name parameter cannot be undefined, null, false or true, It must be a string, class or function.");
    }

    var children = _children;
    var ref = null;
    var key = null;
    var className = null;
    var flags = 0;
    var newProps;

    if (_children) {
      if (_children.length === 1) {
        children = _children[0];
      } else if (_children.length === 0) {
        children = void 0;
      }
    }

    if (isString(type)) {
      flags = inferno.getFlagsForElementVnode(type);

      if (!isNullOrUndef$1(props)) {
        newProps = {};

        for (var prop in props) {
          if (prop === "className" || prop === "class") {
            className = props[prop];
          } else if (prop === "key") {
            key = props.key;
          } else if (prop === "children" && isUndefined$1(children)) {
            children = props.children; // always favour children args, default to props
          } else if (prop === "ref") {
            ref = props.ref;
          } else {
            newProps[prop] = props[prop];
          }
        }
      }
    } else {
      flags = 16
      /* ComponentUnknown */
      ;

      if (!isUndefined$1(children)) {
        if (!props) {
          props = {};
        }

        props.children = children;
        children = null;
      }

      if (!isNullOrUndef$1(props)) {
        newProps = {};

        for (var prop$1 in props) {
          if (componentHooks.has(prop$1)) {
            if (!ref) {
              ref = {};
            }

            ref[prop$1] = props[prop$1];
          } else if (prop$1 === "key") {
            key = props.key;
          } else {
            newProps[prop$1] = props[prop$1];
          }
        }
      }
    }

    return inferno.createVNode(flags, type, className, children, newProps, key, ref);
  }
  /**
   * @module Inferno-Shared
   */

  /** TypeDoc Comment */


  var NO_OP = "$NO_OP"; // This should be boolean and not reference to window.document

  var isBrowser = !!(typeof window !== "undefined" && window.document); // this is MUCH faster than .constructor === Array and instanceof Array
  // in Node 7 and the later versions of V8, slower in older versions though

  var isArray = Array.isArray;

  function isNullOrUndef$2(o) {
    return isUndefined$2(o) || isNull$2(o);
  }

  function isFunction$1(o) {
    return typeof o === "function";
  }

  function isString$1(o) {
    return typeof o === "string";
  }

  function isNull$2(o) {
    return o === null;
  }

  function isUndefined$2(o) {
    return o === void 0;
  }

  function isObject$2(o) {
    return _typeof(o) === "object";
  }
  /**
   * @module Inferno-Compat
   */

  /** TypeDoc Comment */


  function isValidElement(obj) {
    var isNotANullObject = isObject$2(obj) && isNull$2(obj) === false;

    if (isNotANullObject === false) {
      return false;
    }

    var flags = obj.flags;
    return (flags & (28
    /* Component */
    | 3970
    /* Element */
    )) > 0;
  }
  /**
   * @module Inferno-Compat
   */

  /**
   * Inlined PropTypes, there is propType checking ATM.
   */
  // tslint:disable-next-line:no-empty


  function proptype() {}

  proptype.isRequired = proptype;

  var getProptype = function getProptype() {
    return proptype;
  };

  getProptype._r = [2];
  var PropTypes = {
    any: getProptype,
    array: proptype,
    arrayOf: getProptype,
    bool: proptype,
    checkPropTypes: function checkPropTypes() {
      return null;
    },
    element: getProptype,
    func: proptype,
    instanceOf: getProptype,
    node: getProptype,
    number: proptype,
    object: proptype,
    objectOf: getProptype,
    oneOf: getProptype,
    oneOfType: getProptype,
    shape: getProptype,
    string: proptype,
    symbol: proptype
  };
  /**
   * @module Inferno-Compat
   */

  /** TypeDoc Comment */

  /**
   * borrowed React SVGDOMPropertyConfig
   * @link https://github.com/facebook/react/blob/c78464f8ea9a5b00ec80252d20a71a1482210e57/src/renderers/dom/shared/SVGDOMPropertyConfig.js
   */

  var SVGDOMPropertyConfig = {
    accentHeight: "accent-height",
    accumulate: 0,
    additive: 0,
    alignmentBaseline: "alignment-baseline",
    allowReorder: "allowReorder",
    alphabetic: 0,
    amplitude: 0,
    arabicForm: "arabic-form",
    ascent: 0,
    attributeName: "attributeName",
    attributeType: "attributeType",
    autoReverse: "autoReverse",
    azimuth: 0,
    baseFrequency: "baseFrequency",
    baseProfile: "baseProfile",
    baselineShift: "baseline-shift",
    bbox: 0,
    begin: 0,
    bias: 0,
    by: 0,
    calcMode: "calcMode",
    capHeight: "cap-height",
    clip: 0,
    clipPath: "clip-path",
    clipPathUnits: "clipPathUnits",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    contentScriptType: "contentScriptType",
    contentStyleType: "contentStyleType",
    cursor: 0,
    cx: 0,
    cy: 0,
    d: 0,
    decelerate: 0,
    descent: 0,
    diffuseConstant: "diffuseConstant",
    direction: 0,
    display: 0,
    divisor: 0,
    dominantBaseline: "dominant-baseline",
    dur: 0,
    dx: 0,
    dy: 0,
    edgeMode: "edgeMode",
    elevation: 0,
    enableBackground: "enable-background",
    end: 0,
    exponent: 0,
    externalResourcesRequired: "externalResourcesRequired",
    fill: 0,
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    filter: 0,
    filterRes: "filterRes",
    filterUnits: "filterUnits",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    focusable: 0,
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    format: 0,
    from: 0,
    fx: 0,
    fy: 0,
    g1: 0,
    g2: 0,
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    glyphRef: "glyphRef",
    gradientTransform: "gradientTransform",
    gradientUnits: "gradientUnits",
    hanging: 0,
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    ideographic: 0,
    imageRendering: "image-rendering",
    in: 0,
    in2: 0,
    intercept: 0,
    k: 0,
    k1: 0,
    k2: 0,
    k3: 0,
    k4: 0,
    kernelMatrix: "kernelMatrix",
    kernelUnitLength: "kernelUnitLength",
    kerning: 0,
    keyPoints: "keyPoints",
    keySplines: "keySplines",
    keyTimes: "keyTimes",
    lengthAdjust: "lengthAdjust",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    limitingConeAngle: "limitingConeAngle",
    local: 0,
    markerEnd: "marker-end",
    markerHeight: "markerHeight",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    markerUnits: "markerUnits",
    markerWidth: "markerWidth",
    mask: 0,
    maskContentUnits: "maskContentUnits",
    maskUnits: "maskUnits",
    mathematical: 0,
    mode: 0,
    numOctaves: "numOctaves",
    offset: 0,
    opacity: 0,
    operator: 0,
    order: 0,
    orient: 0,
    orientation: 0,
    origin: 0,
    overflow: 0,
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pathLength: "pathLength",
    patternContentUnits: "patternContentUnits",
    patternTransform: "patternTransform",
    patternUnits: "patternUnits",
    pointerEvents: "pointer-events",
    points: 0,
    pointsAtX: "pointsAtX",
    pointsAtY: "pointsAtY",
    pointsAtZ: "pointsAtZ",
    preserveAlpha: "preserveAlpha",
    preserveAspectRatio: "preserveAspectRatio",
    primitiveUnits: "primitiveUnits",
    r: 0,
    radius: 0,
    refX: "refX",
    refY: "refY",
    renderingIntent: "rendering-intent",
    repeatCount: "repeatCount",
    repeatDur: "repeatDur",
    requiredExtensions: "requiredExtensions",
    requiredFeatures: "requiredFeatures",
    restart: 0,
    result: 0,
    rotate: 0,
    rx: 0,
    ry: 0,
    scale: 0,
    seed: 0,
    shapeRendering: "shape-rendering",
    slope: 0,
    spacing: 0,
    specularConstant: "specularConstant",
    specularExponent: "specularExponent",
    speed: 0,
    spreadMethod: "spreadMethod",
    startOffset: "startOffset",
    stdDeviation: "stdDeviation",
    stemh: 0,
    stemv: 0,
    stitchTiles: "stitchTiles",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    string: 0,
    stroke: 0,
    strokeDasharray: "stroke-dasharray",
    strokeDashoffset: "stroke-dashoffset",
    strokeLinecap: "stroke-linecap",
    strokeLinejoin: "stroke-linejoin",
    strokeMiterlimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    surfaceScale: "surfaceScale",
    systemLanguage: "systemLanguage",
    tableValues: "tableValues",
    targetX: "targetX",
    targetY: "targetY",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textLength: "textLength",
    textRendering: "text-rendering",
    to: 0,
    transform: 0,
    u1: 0,
    u2: 0,
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicode: 0,
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    values: 0,
    vectorEffect: "vector-effect",
    version: 0,
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    viewBox: "viewBox",
    viewTarget: "viewTarget",
    visibility: 0,
    widths: 0,
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    x: 0,
    x1: 0,
    x2: 0,
    xChannelSelector: "xChannelSelector",
    xHeight: "x-height",
    xlinkActuate: "xlink:actuate",
    xlinkArcrole: "xlink:arcrole",
    xlinkHref: "xlink:href",
    xlinkRole: "xlink:role",
    xlinkShow: "xlink:show",
    xlinkTitle: "xlink:title",
    xlinkType: "xlink:type",
    xmlBase: "xml:base",
    // xmlns: 0,
    xmlLang: "xml:lang",
    xmlSpace: "xml:space",
    xmlnsXlink: "xmlns:xlink",
    y: 0,
    y1: 0,
    y2: 0,
    yChannelSelector: "yChannelSelector",
    z: 0,
    zoomAndPan: "zoomAndPan"
  };
  /**
   * @module Inferno-Compat
   */

  /** TypeDoc Comment */

  inferno.options.findDOMNodeEnabled = true;

  function unmountComponentAtNode(container) {
    inferno.render(null, container);
    return true;
  }

  var ARR = [];
  var Children = {
    map: function map(children, fn, ctx) {
      if (isNullOrUndef$2(children)) {
        return children;
      }

      children = Children.toArray(children);

      if (ctx && ctx !== children) {
        fn = fn.bind(ctx);
      }

      return children.map(fn);
    },
    forEach: function forEach(children, fn, ctx) {
      if (isNullOrUndef$2(children)) {
        return;
      }

      children = Children.toArray(children);

      if (ctx && ctx !== children) {
        fn = fn.bind(ctx);
      }

      for (var i = 0, len = children.length; i < len; i++) {
        fn(children[i], i, children);
      }
    },
    count: function count(children) {
      children = Children.toArray(children);
      return children.length;
    },
    only: function only(children) {
      children = Children.toArray(children);

      if (children.length !== 1) {
        throw new Error("Children.only() expects only one child.");
      }

      return children[0];
    },
    toArray: function toArray$$1(children) {
      if (isNullOrUndef$2(children)) {
        return [];
      }

      return isArray(children) ? children : ARR.concat(children);
    }
  };
  Component.prototype.isReactComponent = {};
  var currentComponent = null;

  inferno.options.beforeRender = function (component) {
    currentComponent = component;
  };

  inferno.options.afterRender = function () {
    currentComponent = null;
  };

  var version = "15.4.2";

  function normalizeProps(name, props) {
    if ((name === "input" || name === "textarea") && props.type !== "radio" && props.onChange) {
      var type = props.type;
      var eventName;

      if (type === "checkbox") {
        eventName = "onclick";
      } else if (type === "file") {
        eventName = "onchange";
      } else {
        eventName = "oninput";
      }

      if (!props[eventName]) {
        props[eventName] = props.onChange;
        delete props.onChange;
      }
    }

    for (var prop in props) {
      if (prop === "onDoubleClick") {
        props.onDblClick = props[prop];
        delete props[prop];
      }

      if (prop === "htmlFor") {
        props.for = props[prop];
        delete props[prop];
      }

      var mappedProp = SVGDOMPropertyConfig[prop];

      if (mappedProp && mappedProp !== prop) {
        props[mappedProp] = props[prop];
        delete props[prop];
      }
    }
  } // we need to add persist() to Event (as React has it for synthetic events)
  // this is a hack and we really shouldn't be modifying a global object this way,
  // but there isn't a performant way of doing this apart from trying to proxy
  // every prop event that starts with "on", i.e. onClick or onKeyPress
  // but in reality devs use onSomething for many things, not only for
  // input events


  if (typeof Event !== "undefined" && !Event.prototype.persist) {
    // tslint:disable-next-line:no-empty
    Event.prototype.persist = function () {};
  }

  function iterableToArray(iterable) {
    var iterStep;
    var tmpArr = [];

    do {
      iterStep = iterable.next();

      if (iterStep.value) {
        tmpArr.push(iterStep.value);
      }
    } while (!iterStep.done);

    return tmpArr;
  }

  var hasSymbolSupport = typeof Symbol !== "undefined";

  var injectStringRefs = function injectStringRefs(originalFunction) {
    return function (name, _props) {
      var children = [],
          len$1 = arguments.length - 2;

      while (len$1-- > 0) {
        children[len$1] = arguments[len$1 + 2];
      }

      var props = _props || {};
      var ref = props.ref;

      if (typeof ref === "string" && !isNull$2(currentComponent)) {
        currentComponent.refs = currentComponent.refs || {};

        props.ref = function (val) {
          this.refs[ref] = val;
        }.bind(currentComponent);
      }

      if (typeof name === "string") {
        normalizeProps(name, props);
      } // React supports iterable children, in addition to Array-like


      if (hasSymbolSupport) {
        for (var i = 0, len = children.length; i < len; i++) {
          var child = children[i];

          if (child && !isArray(child) && !isString$1(child) && isFunction$1(child[Symbol.iterator])) {
            children[i] = iterableToArray(child[Symbol.iterator]());
          }
        }
      }

      var vnode = originalFunction.apply(void 0, [name, props].concat(children));

      if (vnode.className) {
        vnode.props = vnode.props || {};
        vnode.props.className = vnode.className;
      }

      return vnode;
    };
  };

  injectStringRefs._r = [2];
  var createElement = injectStringRefs(createElement$1);
  var cloneElement = injectStringRefs(inferno.cloneVNode);
  var oldCreateVNode = inferno.options.createVNode;

  inferno.options.createVNode = function (vNode) {
    var children = vNode.children;
    var props = vNode.props;

    if (isNullOrUndef$2(props)) {
      props = vNode.props = {};
    }

    if (!isNullOrUndef$2(children) && isNullOrUndef$2(props.children)) {
      props.children = children;
    }

    if (oldCreateVNode) {
      oldCreateVNode(vNode);
    }
  }; // Credit: preact-compat - https://github.com/developit/preact-compat :)


  function shallowDiffers(a, b) {
    for (var i in a) {
      if (!(i in b)) {
        return true;
      }
    }

    for (var i$1 in b) {
      if (a[i$1] !== b[i$1]) {
        return true;
      }
    }

    return false;
  }

  function PureComponent(props, context) {
    Component.call(this, props, context);
  }

  PureComponent.prototype = new Component({}, {});

  PureComponent.prototype.shouldComponentUpdate = function (props, state) {
    return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
  };

  var WrapperComponent = function (Component$$1) {
    function WrapperComponent() {
      Component$$1.apply(this, arguments);
    }

    if (Component$$1) WrapperComponent.__proto__ = Component$$1;
    WrapperComponent.prototype = Object.create(Component$$1 && Component$$1.prototype);
    WrapperComponent.prototype.constructor = WrapperComponent;

    WrapperComponent.prototype.getChildContext = function getChildContext() {
      // tslint:disable-next-line
      return this.props["context"];
    };

    WrapperComponent.prototype.render = function render$$1(props) {
      return props.children;
    };

    return WrapperComponent;
  }(Component);

  function unstable_renderSubtreeIntoContainer(parentComponent, vNode, container, callback) {
    var wrapperVNode = inferno.createVNode(4, WrapperComponent, null, null, {
      children: vNode,
      context: parentComponent.context
    });
    var component = inferno.render(wrapperVNode, container);

    if (callback) {
      // callback gets the component as context, no other argument.
      callback.call(component);
    }

    return component;
  } // Credit: preact-compat - https://github.com/developit/preact-compat


  var ELEMENTS = "a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan".split(" ");

  function createFactory(type) {
    return createElement.bind(null, type);
  }

  var DOM = {};

  for (var i = ELEMENTS.length; i--;) {
    DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
  } // Mask React global in browser enviornments when React is not used.


  if (isBrowser && typeof window.React === "undefined") {
    var exports$1 = {
      Children: Children,
      Component: Component,
      DOM: DOM,
      EMPTY_OBJ: inferno.EMPTY_OBJ,
      NO_OP: NO_OP,
      PropTypes: PropTypes,
      PureComponent: PureComponent,
      cloneElement: cloneElement,
      cloneVNode: inferno.cloneVNode,
      createClass: createClass$$1,
      createElement: createElement,
      createFactory: createFactory,
      createVNode: inferno.createVNode,
      findDOMNode: inferno.findDOMNode,
      isValidElement: isValidElement,
      render: inferno.render,
      unmountComponentAtNode: unmountComponentAtNode,
      unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
      version: version
    };
    window.React = exports$1;
    window.ReactDOM = exports$1;
  }

  var index = {
    Children: Children,
    Component: Component,
    DOM: DOM,
    EMPTY_OBJ: inferno.EMPTY_OBJ,
    NO_OP: NO_OP,
    PropTypes: PropTypes,
    PureComponent: PureComponent,
    cloneElement: cloneElement,
    cloneVNode: inferno.cloneVNode,
    createClass: createClass$$1,
    createElement: createElement,
    createFactory: createFactory,
    createVNode: inferno.createVNode,
    findDOMNode: inferno.findDOMNode,
    isValidElement: isValidElement,
    render: inferno.render,
    unmountComponentAtNode: unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
    version: version
  };
  exports.Children = Children;
  exports.Component = Component;
  exports.DOM = DOM;
  exports.EMPTY_OBJ = inferno.EMPTY_OBJ;
  exports.NO_OP = NO_OP;
  exports.PropTypes = PropTypes;
  exports.PureComponent = PureComponent;
  exports.cloneElement = cloneElement;
  exports.cloneVNode = inferno.cloneVNode;
  exports.createClass = createClass$$1;
  exports.createElement = createElement;
  exports.createFactory = createFactory;
  exports.createVNode = inferno.createVNode;
  exports.findDOMNode = inferno.findDOMNode;
  exports.isValidElement = isValidElement;
  exports.render = inferno.render;
  exports.unmountComponentAtNode = unmountComponentAtNode;
  exports.unstable_renderSubtreeIntoContainer = unstable_renderSubtreeIntoContainer;
  exports.version = version;
  exports['default'] = index;
});

var infernoCompat$1 = createCommonjsModule(function (module) {
  module.exports = dist.default;
  module.exports.default = module.exports;
});
var infernoCompat_1 = infernoCompat$1.render;
var infernoCompat_2 = infernoCompat$1.createElement;

var dist$4 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopDefault(ex) {
    return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  var Component = _interopDefault(infernoComponent);
  /**
   * @module Inferno-Shared
   */

  /** TypeDoc Comment */


  var ERROR_MSG = "a runtime error occured! Use Inferno in development environment to find the error.";

  function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
  }

  function isFunction(o) {
    return typeof o === "function";
  }

  function isNull(o) {
    return o === null;
  }

  function isUndefined(o) {
    return o === void 0;
  }

  function isObject(o) {
    return _typeof(o) === "object";
  }

  function throwError(message) {
    if (!message) {
      message = ERROR_MSG;
    }

    throw new Error("Inferno Error: " + message);
  }
  /**
   * @module Inferno-Create-Class
   */

  /** TypeDoc Comment */
  // don't autobind these methods since they already have guaranteed context.


  var AUTOBIND_BLACKLIST = new Set();
  AUTOBIND_BLACKLIST.add("constructor");
  AUTOBIND_BLACKLIST.add("render");
  AUTOBIND_BLACKLIST.add("shouldComponentUpdate");
  AUTOBIND_BLACKLIST.add("componentWillReceiveProps");
  AUTOBIND_BLACKLIST.add("componentWillUpdate");
  AUTOBIND_BLACKLIST.add("componentDidUpdate");
  AUTOBIND_BLACKLIST.add("componentWillMount");
  AUTOBIND_BLACKLIST.add("componentDidMount");
  AUTOBIND_BLACKLIST.add("componentWillUnmount");
  AUTOBIND_BLACKLIST.add("componentDidUnmount");

  function extend(base, props) {
    for (var key in props) {
      if (!isNullOrUndef(props[key])) {
        base[key] = props[key];
      }
    }

    return base;
  }

  function bindAll(ctx) {
    for (var i in ctx) {
      var v = ctx[i];

      if (typeof v === "function" && !v.__bound && !AUTOBIND_BLACKLIST.has(i)) {
        (ctx[i] = v.bind(ctx)).__bound = true;
      }
    }
  }

  function collateMixins(mixins, keyed) {
    if (keyed === void 0) keyed = {};

    for (var i = 0, len = mixins.length; i < len; i++) {
      var mixin = mixins[i]; // Surprise: Mixins can have mixins

      if (mixin.mixins) {
        // Recursively collate sub-mixins
        collateMixins(mixin.mixins, keyed);
      }

      for (var key in mixin) {
        if (mixin.hasOwnProperty(key) && typeof mixin[key] === "function") {
          (keyed[key] || (keyed[key] = [])).push(mixin[key]);
        }
      }
    }

    return keyed;
  }

  function multihook(hooks, mergeFn) {
    return function () {
      var arguments$1 = arguments;
      var this$1 = this;
      var ret;

      for (var i = 0, len = hooks.length; i < len; i++) {
        var hook = hooks[i];
        var r = hook.apply(this$1, arguments$1);

        if (mergeFn) {
          ret = mergeFn(ret, r);
        } else if (!isUndefined(r)) {
          ret = r;
        }
      }

      return ret;
    };
  }

  function mergeNoDupes(previous, current) {
    if (!isUndefined(current)) {
      if (!isObject(current)) {
        throwError("Expected Mixin to return value to be an object or null.");
      }

      if (!previous) {
        previous = {};
      }

      for (var key in current) {
        if (current.hasOwnProperty(key)) {
          if (previous.hasOwnProperty(key)) {
            throwError("Mixins return duplicate key " + key + " in their return values");
          }

          previous[key] = current[key];
        }
      }
    }

    return previous;
  }

  function applyMixin(key, inst, mixin) {
    var hooks = isUndefined(inst[key]) ? mixin : mixin.concat(inst[key]);

    if (key === "getDefaultProps" || key === "getInitialState" || key === "getChildContext") {
      inst[key] = multihook(hooks, mergeNoDupes);
    } else {
      inst[key] = multihook(hooks);
    }
  }

  function applyMixins(Cl, mixins) {
    for (var key in mixins) {
      if (mixins.hasOwnProperty(key)) {
        var mixin = mixins[key];
        var inst = void 0;

        if (key === "getDefaultProps") {
          inst = Cl;
        } else {
          inst = Cl.prototype;
        }

        if (isFunction(mixin[0])) {
          applyMixin(key, inst, mixin);
        } else {
          inst[key] = mixin;
        }
      }
    }
  }

  function createClass$$1(obj) {
    var Cl = function (Component$$1) {
      function Cl(props, context) {
        Component$$1.call(this, props, context);
        bindAll(this);

        if (this.getInitialState) {
          this.state = this.getInitialState();
        }
      }

      if (Component$$1) Cl.__proto__ = Component$$1;
      Cl.prototype = Object.create(Component$$1 && Component$$1.prototype);
      Cl.prototype.constructor = Cl;

      Cl.prototype.replaceState = function replaceState(nextState, callback) {
        this.setState(nextState, callback);
      };

      Cl.prototype.isMounted = function isMounted() {
        return !this._unmounted;
      };

      return Cl;
    }(Component);

    Cl.displayName = obj.displayName || "Component";
    Cl.propTypes = obj.propTypes;
    Cl.mixins = obj.mixins && collateMixins(obj.mixins);
    Cl.getDefaultProps = obj.getDefaultProps;
    extend(Cl.prototype, obj);

    if (obj.statics) {
      extend(Cl, obj.statics);
    }

    if (obj.mixins) {
      applyMixins(Cl, collateMixins(obj.mixins));
    }

    Cl.defaultProps = isUndefined(Cl.getDefaultProps) ? undefined : Cl.getDefaultProps();
    return Cl;
  }

  exports['default'] = createClass$$1;
});

var infernoCreateClass = createCommonjsModule(function (module) {
  module.exports = dist$4.default;
  module.exports.default = module.exports;
});

var hoistNonInfernoStatics = createCommonjsModule(function (module) {
  'use strict';

  var INFERNO_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    propTypes: true,
    type: true
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
  };
  var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

  function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
    if (typeof sourceComponent !== 'string') {
      // don't hoist over string (html) components
      var keys = Object.getOwnPropertyNames(sourceComponent);
      /* istanbul ignore else */

      if (isGetOwnPropertySymbolsAvailable) {
        keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
      }

      for (var i = 0; i < keys.length; ++i) {
        if (!INFERNO_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
          try {
            targetComponent[keys[i]] = sourceComponent[keys[i]];
          } catch (error) {}
        }
      }
    }

    return targetComponent;
  }

  
  module.exports = hoistNonReactStatics;
  module.exports.default = module.exports;
});

/** MobX - (c) Michel Weststrate 2015, 2016 - MIT Licensed */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = Object.setPrototypeOf || {
  __proto__: []
} instanceof Array && function (d, b) {
  d.__proto__ = b;
} || function (d, b) {
  for (var p in b) {
    if (b.hasOwnProperty(p)) d[p] = b[p];
  }
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
 * Anything that can be used to _store_ state is an Atom in mobx. Atoms have two important jobs
 *
 * 1) detect when they are being _used_ and report this (using reportObserved). This allows mobx to make the connection between running functions and the data they used
 * 2) they should notify mobx whenever they have _changed_. This way mobx can re-run any functions (derivations) that are using this atom.
 */


__extends._r = [2];

var BaseAtom = function () {
  /**
   * Create a new atom. For debugging purposes it is recommended to give it a name.
   * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
   */
  function BaseAtom(name) {
    if (name === void 0) {
      name = "Atom@" + getNextId();
    }

    this.name = name;
    this.isPendingUnobservation = true; // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed

    this.observers = [];
    this.observersIndexes = {};
    this.diffValue = 0;
    this.lastAccessedBy = 0;
    this.lowestObserverState = IDerivationState.NOT_TRACKING;
  }

  BaseAtom.prototype.onBecomeUnobserved = function () {// noop
  };
  /**
   * Invoke this method to notify mobx that your atom has been used somehow.
   */


  BaseAtom.prototype.reportObserved = function () {
    reportObserved(this);
  };
  /**
   * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
   */


  BaseAtom.prototype.reportChanged = function () {
    startBatch();
    propagateChanged(this);
    endBatch();
  };

  BaseAtom.prototype.toString = function () {
    return this.name;
  };

  return BaseAtom;
}();

var Atom = function (_super) {
  __extends(Atom, _super);
  /**
   * Create a new atom. For debugging purposes it is recommended to give it a name.
   * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
   */


  function Atom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
    if (name === void 0) {
      name = "Atom@" + getNextId();
    }

    if (onBecomeObservedHandler === void 0) {
      onBecomeObservedHandler = noop$1;
    }

    if (onBecomeUnobservedHandler === void 0) {
      onBecomeUnobservedHandler = noop$1;
    }

    var _this = _super.call(this, name) || this;

    _this.name = name;
    _this.onBecomeObservedHandler = onBecomeObservedHandler;
    _this.onBecomeUnobservedHandler = onBecomeUnobservedHandler;
    _this.isPendingUnobservation = false; // for effective unobserving.

    _this.isBeingTracked = false;
    return _this;
  }

  Atom.prototype.reportObserved = function () {
    startBatch();

    _super.prototype.reportObserved.call(this);

    if (!this.isBeingTracked) {
      this.isBeingTracked = true;
      this.onBecomeObservedHandler();
    }

    endBatch();
    return !!globalState.trackingDerivation; // return doesn't really give useful info, because it can be as well calling computed which calls atom (no reactions)
    // also it could not trigger when calculating reaction dependent on Atom because Atom's value was cached by computed called by given reaction.
  };

  Atom.prototype.onBecomeUnobserved = function () {
    this.isBeingTracked = false;
    this.onBecomeUnobservedHandler();
  };

  return Atom;
}(BaseAtom);

var isAtom = createInstanceofPredicate("Atom", BaseAtom);

function hasInterceptors(interceptable) {
  return interceptable.interceptors && interceptable.interceptors.length > 0;
}

hasInterceptors._r = [2];

function registerInterceptor(interceptable, handler) {
  var interceptors = interceptable.interceptors || (interceptable.interceptors = []);
  interceptors.push(handler);
  return once$1(function () {
    var idx = interceptors.indexOf(handler);
    if (idx !== -1) interceptors.splice(idx, 1);
  });
}

registerInterceptor._r = [2];

function interceptChange(interceptable, change) {
  var prevU = untrackedStart();

  try {
    var interceptors = interceptable.interceptors;
    if (interceptors) for (var i = 0, l = interceptors.length; i < l; i++) {
      change = interceptors[i](change);
      invariant(!change || change.type, "Intercept handlers should return nothing or a change object");
      if (!change) break;
    }
    return change;
  } finally {
    untrackedEnd(prevU);
  }
}

interceptChange._r = [2];

function hasListeners(listenable) {
  return listenable.changeListeners && listenable.changeListeners.length > 0;
}

hasListeners._r = [2];

function registerListener(listenable, handler) {
  var listeners = listenable.changeListeners || (listenable.changeListeners = []);
  listeners.push(handler);
  return once$1(function () {
    var idx = listeners.indexOf(handler);
    if (idx !== -1) listeners.splice(idx, 1);
  });
}

registerListener._r = [2];

function notifyListeners(listenable, change) {
  var prevU = untrackedStart();
  var listeners = listenable.changeListeners;
  if (!listeners) return;
  listeners = listeners.slice();

  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](change);
  }

  untrackedEnd(prevU);
}

notifyListeners._r = [2];

function isSpyEnabled() {
  return !!globalState.spyListeners.length;
}

isSpyEnabled._r = [2];

function spyReport(event) {
  if (!globalState.spyListeners.length) return;
  var listeners = globalState.spyListeners;

  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](event);
  }
}

spyReport._r = [2];

function spyReportStart(event) {
  var change = objectAssign({}, event, {
    spyReportStart: true
  });
  spyReport(change);
}

spyReportStart._r = [2];
var END_EVENT = {
  spyReportEnd: true
};

function spyReportEnd(change) {
  if (change) spyReport(objectAssign({}, change, END_EVENT));else spyReport(END_EVENT);
}

spyReportEnd._r = [2];

function spy(listener) {
  globalState.spyListeners.push(listener);
  return once$1(function () {
    var idx = globalState.spyListeners.indexOf(listener);
    if (idx !== -1) globalState.spyListeners.splice(idx, 1);
  });
}

spy._r = [2];

function iteratorSymbol() {
  return typeof Symbol === "function" && Symbol.iterator || "@@iterator";
}

iteratorSymbol._r = [2];
var IS_ITERATING_MARKER = "__$$iterating";

function arrayAsIterator(array) {
  // returning an array for entries(), values() etc for maps was a mis-interpretation of the specs..,
  // yet it is quite convenient to be able to use the response both as array directly and as iterator
  // it is suboptimal, but alas...
  invariant(array[IS_ITERATING_MARKER] !== true, "Illegal state: cannot recycle array as iterator");
  addHiddenFinalProp(array, IS_ITERATING_MARKER, true);
  var idx = -1;
  addHiddenFinalProp(array, "next", function next() {
    idx++;
    return {
      done: idx >= this.length,
      value: idx < this.length ? this[idx] : undefined
    };
  });
  return array;
}

arrayAsIterator._r = [2];

function declareIterator(prototType, iteratorFactory) {
  addHiddenFinalProp(prototType, iteratorSymbol(), iteratorFactory);
}

declareIterator._r = [2];
var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859
// Detects bug in safari 9.1.1 (or iOS 9 safari mobile). See #364

var safariPrototypeSetterInheritanceBug = function () {
  var v = false;
  var p = {};
  Object.defineProperty(p, "0", {
    set: function set$$1() {
      v = true;
    }
  });
  Object.create(p)["0"] = 1;
  return v === false;
}();
/**
 * This array buffer contains two lists of properties, so that all arrays
 * can recycle their property definitions, which significantly improves performance of creating
 * properties on the fly.
 */


var OBSERVABLE_ARRAY_BUFFER_SIZE = 0; // Typescript workaround to make sure ObservableArray extends Array

var StubArray = function () {
  function StubArray() {}

  return StubArray;
}();

function inherit(ctor, proto) {
  if (typeof Object["setPrototypeOf"] !== "undefined") {
    Object["setPrototypeOf"](ctor.prototype, proto);
  } else if (typeof ctor.prototype.__proto__ !== "undefined") {
    ctor.prototype.__proto__ = proto;
  } else {
    ctor["prototype"] = proto;
  }
}

inherit._r = [2];
inherit(StubArray, Array.prototype); // Weex freeze Array.prototype
// Make them writeable and configurable in prototype chain
// https://github.com/alibaba/weex/pull/1529

if (Object.isFrozen(Array)) {
  ["constructor", "push", "shift", "concat", "pop", "unshift", "replace", "find", "findIndex", "splice", "reverse", "sort"].forEach(function (key) {
    Object.defineProperty(StubArray.prototype, key, {
      configurable: true,
      writable: true,
      value: Array.prototype[key]
    });
  });
}

var ObservableArrayAdministration = function () {
  function ObservableArrayAdministration(name, enhancer, array, owned) {
    this.array = array;
    this.owned = owned;
    this.values = [];
    this.lastKnownLength = 0;
    this.interceptors = null;
    this.changeListeners = null;
    this.atom = new BaseAtom(name || "ObservableArray@" + getNextId());

    this.enhancer = function (newV, oldV) {
      return enhancer(newV, oldV, name + "[..]");
    };
  }

  ObservableArrayAdministration.prototype.dehanceValue = function (value) {
    if (this.dehancer !== undefined) return this.dehancer(value);
    return value;
  };

  ObservableArrayAdministration.prototype.dehanceValues = function (values) {
    if (this.dehancer !== undefined) return values.map(this.dehancer);
    return values;
  };

  ObservableArrayAdministration.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  ObservableArrayAdministration.prototype.observe = function (listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }

    if (fireImmediately) {
      listener({
        object: this.array,
        type: "splice",
        index: 0,
        added: this.values.slice(),
        addedCount: this.values.length,
        removed: [],
        removedCount: 0
      });
    }

    return registerListener(this, listener);
  };

  ObservableArrayAdministration.prototype.getArrayLength = function () {
    this.atom.reportObserved();
    return this.values.length;
  };

  ObservableArrayAdministration.prototype.setArrayLength = function (newLength) {
    if (typeof newLength !== "number" || newLength < 0) throw new Error("[mobx.array] Out of range: " + newLength);
    var currentLength = this.values.length;
    if (newLength === currentLength) return;else if (newLength > currentLength) {
      var newItems = new Array(newLength - currentLength);

      for (var i = 0; i < newLength - currentLength; i++) {
        newItems[i] = undefined;
      } // No Array.fill everywhere...


      this.spliceWithArray(currentLength, 0, newItems);
    } else this.spliceWithArray(newLength, currentLength - newLength);
  }; // adds / removes the necessary numeric properties to this object


  ObservableArrayAdministration.prototype.updateArrayLength = function (oldLength, delta) {
    if (oldLength !== this.lastKnownLength) throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed. Did you use peek() to change it?");
    this.lastKnownLength += delta;
    if (delta > 0 && oldLength + delta + 1 > OBSERVABLE_ARRAY_BUFFER_SIZE) reserveArrayBuffer(oldLength + delta + 1);
  };

  ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
    var _this = this;

    checkIfStateModificationsAreAllowed(this.atom);
    var length = this.values.length;
    if (index === undefined) index = 0;else if (index > length) index = length;else if (index < 0) index = Math.max(0, length + index);
    if (arguments.length === 1) deleteCount = length - index;else if (deleteCount === undefined || deleteCount === null) deleteCount = 0;else deleteCount = Math.max(0, Math.min(deleteCount, length - index));
    if (newItems === undefined) newItems = [];

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.array,
        type: "splice",
        index: index,
        removedCount: deleteCount,
        added: newItems
      });
      if (!change) return EMPTY_ARRAY;
      deleteCount = change.removedCount;
      newItems = change.added;
    }

    newItems = newItems.map(function (v) {
      return _this.enhancer(v, undefined);
    });
    var lengthDelta = newItems.length - deleteCount;
    this.updateArrayLength(length, lengthDelta); // create or remove new entries

    var res = this.spliceItemsIntoValues(index, deleteCount, newItems);
    if (deleteCount !== 0 || newItems.length !== 0) this.notifyArraySplice(index, newItems, res);
    return this.dehanceValues(res);
  };

  ObservableArrayAdministration.prototype.spliceItemsIntoValues = function (index, deleteCount, newItems) {
    if (newItems.length < MAX_SPLICE_SIZE) {
      return (_a = this.values).splice.apply(_a, [index, deleteCount].concat(newItems));
    } else {
      var res = this.values.slice(index, index + deleteCount);
      this.values = this.values.slice(0, index).concat(newItems, this.values.slice(index + deleteCount));
      return res;
    }

    var _a;
  };

  ObservableArrayAdministration.prototype.notifyArrayChildUpdate = function (index, newValue, oldValue) {
    var notifySpy = !this.owned && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      object: this.array,
      type: "update",
      index: index,
      newValue: newValue,
      oldValue: oldValue
    } : null;
    if (notifySpy) spyReportStart(change);
    this.atom.reportChanged();
    if (notify) notifyListeners(this, change);
    if (notifySpy) spyReportEnd();
  };

  ObservableArrayAdministration.prototype.notifyArraySplice = function (index, added, removed) {
    var notifySpy = !this.owned && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      object: this.array,
      type: "splice",
      index: index,
      removed: removed,
      added: added,
      removedCount: removed.length,
      addedCount: added.length
    } : null;
    if (notifySpy) spyReportStart(change);
    this.atom.reportChanged(); // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe

    if (notify) notifyListeners(this, change);
    if (notifySpy) spyReportEnd();
  };

  return ObservableArrayAdministration;
}();

var ObservableArray = function (_super) {
  __extends(ObservableArray, _super);

  function ObservableArray(initialValues, enhancer, name, owned) {
    if (name === void 0) {
      name = "ObservableArray@" + getNextId();
    }

    if (owned === void 0) {
      owned = false;
    }

    var _this = _super.call(this) || this;

    var adm = new ObservableArrayAdministration(name, enhancer, _this, owned);
    addHiddenFinalProp(_this, "$mobx", adm);

    if (initialValues && initialValues.length) {
      _this.spliceWithArray(0, 0, initialValues);
    }

    if (safariPrototypeSetterInheritanceBug) {
      // Seems that Safari won't use numeric prototype setter untill any * numeric property is
      // defined on the instance. After that it works fine, even if this property is deleted.
      Object.defineProperty(adm.array, "0", ENTRY_0);
    }

    return _this;
  }

  ObservableArray.prototype.intercept = function (handler) {
    return this.$mobx.intercept(handler);
  };

  ObservableArray.prototype.observe = function (listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }

    return this.$mobx.observe(listener, fireImmediately);
  };

  ObservableArray.prototype.clear = function () {
    return this.splice(0);
  };

  ObservableArray.prototype.concat = function () {
    var arrays = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      arrays[_i] = arguments[_i];
    }

    this.$mobx.atom.reportObserved();
    return Array.prototype.concat.apply(this.peek(), arrays.map(function (a) {
      return isObservableArray(a) ? a.peek() : a;
    }));
  };

  ObservableArray.prototype.replace = function (newItems) {
    return this.$mobx.spliceWithArray(0, this.$mobx.values.length, newItems);
  };
  /**
   * Converts this array back to a (shallow) javascript structure.
   * For a deep clone use mobx.toJS
   */


  ObservableArray.prototype.toJS = function () {
    return this.slice();
  };

  ObservableArray.prototype.toJSON = function () {
    // Used by JSON.stringify
    return this.toJS();
  };

  ObservableArray.prototype.peek = function () {
    this.$mobx.atom.reportObserved();
    return this.$mobx.dehanceValues(this.$mobx.values);
  }; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find


  ObservableArray.prototype.find = function (predicate, thisArg, fromIndex) {
    if (fromIndex === void 0) {
      fromIndex = 0;
    }

    var idx = this.findIndex.apply(this, arguments);
    return idx === -1 ? undefined : this.get(idx);
  }; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex


  ObservableArray.prototype.findIndex = function (predicate, thisArg, fromIndex) {
    if (fromIndex === void 0) {
      fromIndex = 0;
    }

    var items = this.peek(),
        l = items.length;

    for (var i = fromIndex; i < l; i++) {
      if (predicate.call(thisArg, items[i], i, this)) return i;
    }

    return -1;
  };
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */


  ObservableArray.prototype.splice = function (index, deleteCount) {
    var newItems = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      newItems[_i - 2] = arguments[_i];
    }

    switch (arguments.length) {
      case 0:
        return [];

      case 1:
        return this.$mobx.spliceWithArray(index);

      case 2:
        return this.$mobx.spliceWithArray(index, deleteCount);
    }

    return this.$mobx.spliceWithArray(index, deleteCount, newItems);
  };

  ObservableArray.prototype.spliceWithArray = function (index, deleteCount, newItems) {
    return this.$mobx.spliceWithArray(index, deleteCount, newItems);
  };

  ObservableArray.prototype.push = function () {
    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    var adm = this.$mobx;
    adm.spliceWithArray(adm.values.length, 0, items);
    return adm.values.length;
  };

  ObservableArray.prototype.pop = function () {
    return this.splice(Math.max(this.$mobx.values.length - 1, 0), 1)[0];
  };

  ObservableArray.prototype.shift = function () {
    return this.splice(0, 1)[0];
  };

  ObservableArray.prototype.unshift = function () {
    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    var adm = this.$mobx;
    adm.spliceWithArray(0, 0, items);
    return adm.values.length;
  };

  ObservableArray.prototype.reverse = function () {
    // reverse by default mutates in place before returning the result
    // which makes it both a 'derivation' and a 'mutation'.
    // so we deviate from the default and just make it an dervitation
    var clone = this.slice();
    return clone.reverse.apply(clone, arguments);
  };

  ObservableArray.prototype.sort = function (compareFn) {
    // sort by default mutates in place before returning the result
    // which goes against all good practices. Let's not change the array in place!
    var clone = this.slice();
    return clone.sort.apply(clone, arguments);
  };

  ObservableArray.prototype.remove = function (value) {
    var idx = this.$mobx.dehanceValues(this.$mobx.values).indexOf(value);

    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }

    return false;
  };

  ObservableArray.prototype.move = function (fromIndex, toIndex) {
    function checkIndex(index) {
      if (index < 0) {
        throw new Error("[mobx.array] Index out of bounds: " + index + " is negative");
      }

      var length = this.$mobx.values.length;

      if (index >= length) {
        throw new Error("[mobx.array] Index out of bounds: " + index + " is not smaller than " + length);
      }
    }

    checkIndex.call(this, fromIndex);
    checkIndex.call(this, toIndex);

    if (fromIndex === toIndex) {
      return;
    }

    var oldItems = this.$mobx.values;
    var newItems;

    if (fromIndex < toIndex) {
      newItems = oldItems.slice(0, fromIndex).concat(oldItems.slice(fromIndex + 1, toIndex + 1), [oldItems[fromIndex]], oldItems.slice(toIndex + 1));
    } else {
      // toIndex < fromIndex
      newItems = oldItems.slice(0, toIndex).concat([oldItems[fromIndex]], oldItems.slice(toIndex, fromIndex), oldItems.slice(fromIndex + 1));
    }

    this.replace(newItems);
  }; // See #734, in case property accessors are unreliable...


  ObservableArray.prototype.get = function (index) {
    var impl = this.$mobx;

    if (impl) {
      if (index < impl.values.length) {
        impl.atom.reportObserved();
        return impl.dehanceValue(impl.values[index]);
      }

      console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + impl.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
    }

    return undefined;
  }; // See #734, in case property accessors are unreliable...


  ObservableArray.prototype.set = function (index, newValue) {
    var adm = this.$mobx;
    var values = adm.values;

    if (index < values.length) {
      // update at index in range
      checkIfStateModificationsAreAllowed(adm.atom);
      var oldValue = values[index];

      if (hasInterceptors(adm)) {
        var change = interceptChange(adm, {
          type: "update",
          object: this,
          index: index,
          newValue: newValue
        });
        if (!change) return;
        newValue = change.newValue;
      }

      newValue = adm.enhancer(newValue, oldValue);
      var changed = newValue !== oldValue;

      if (changed) {
        values[index] = newValue;
        adm.notifyArrayChildUpdate(index, newValue, oldValue);
      }
    } else if (index === values.length) {
      // add a new item
      adm.spliceWithArray(index, 0, [newValue]);
    } else {
      // out of bounds
      throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values.length);
    }
  };

  return ObservableArray;
}(StubArray);

declareIterator(ObservableArray.prototype, function () {
  return arrayAsIterator(this.slice());
});
Object.defineProperty(ObservableArray.prototype, "length", {
  enumerable: false,
  configurable: true,
  get: function get$$1() {
    return this.$mobx.getArrayLength();
  },
  set: function set$$1(newLength) {
    this.$mobx.setArrayLength(newLength);
  }
});
["every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "reduce", "reduceRight", "slice", "some", "toString", "toLocaleString"].forEach(function (funcName) {
  var baseFunc = Array.prototype[funcName];
  invariant(typeof baseFunc === "function", "Base function not defined on Array prototype: '" + funcName + "'");
  addHiddenProp(ObservableArray.prototype, funcName, function () {
    return baseFunc.apply(this.peek(), arguments);
  });
});
/**
 * We don't want those to show up in `for (const key in ar)` ...
 */

makeNonEnumerable(ObservableArray.prototype, ["constructor", "intercept", "observe", "clear", "concat", "get", "replace", "toJS", "toJSON", "peek", "find", "findIndex", "splice", "spliceWithArray", "push", "pop", "set", "shift", "unshift", "reverse", "sort", "remove", "move", "toString", "toLocaleString"]); // See #364

var ENTRY_0 = createArrayEntryDescriptor(0);

function createArrayEntryDescriptor(index) {
  return {
    enumerable: false,
    configurable: false,
    get: function get$$1() {
      // TODO: Check `this`?, see #752?
      return this.get(index);
    },
    set: function set$$1(value) {
      this.set(index, value);
    }
  };
}

createArrayEntryDescriptor._r = [2];

function createArrayBufferItem(index) {
  Object.defineProperty(ObservableArray.prototype, "" + index, createArrayEntryDescriptor(index));
}

createArrayBufferItem._r = [2];

function reserveArrayBuffer(max) {
  for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max; index++) {
    createArrayBufferItem(index);
  }

  OBSERVABLE_ARRAY_BUFFER_SIZE = max;
}

reserveArrayBuffer._r = [2];
reserveArrayBuffer(1000);
var isObservableArrayAdministration = createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);

function isObservableArray(thing) {
  return isObject(thing) && isObservableArrayAdministration(thing.$mobx);
}

isObservableArray._r = [2];
var UNCHANGED = {};

var ObservableValue = function (_super) {
  __extends(ObservableValue, _super);

  function ObservableValue(value, enhancer, name, notifySpy) {
    if (name === void 0) {
      name = "ObservableValue@" + getNextId();
    }

    if (notifySpy === void 0) {
      notifySpy = true;
    }

    var _this = _super.call(this, name) || this;

    _this.enhancer = enhancer;
    _this.hasUnreportedChange = false;
    _this.dehancer = undefined;
    _this.value = enhancer(value, undefined, name);

    if (notifySpy && isSpyEnabled()) {
      // only notify spy if this is a stand-alone observable
      spyReport({
        type: "create",
        object: _this,
        newValue: _this.value
      });
    }

    return _this;
  }

  ObservableValue.prototype.dehanceValue = function (value) {
    if (this.dehancer !== undefined) return this.dehancer(value);
    return value;
  };

  ObservableValue.prototype.set = function (newValue) {
    var oldValue = this.value;
    newValue = this.prepareNewValue(newValue);

    if (newValue !== UNCHANGED) {
      var notifySpy = isSpyEnabled();

      if (notifySpy) {
        spyReportStart({
          type: "update",
          object: this,
          newValue: newValue,
          oldValue: oldValue
        });
      }

      this.setNewValue(newValue);
      if (notifySpy) spyReportEnd();
    }
  };

  ObservableValue.prototype.prepareNewValue = function (newValue) {
    checkIfStateModificationsAreAllowed(this);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this,
        type: "update",
        newValue: newValue
      });
      if (!change) return UNCHANGED;
      newValue = change.newValue;
    } // apply modifier


    newValue = this.enhancer(newValue, this.value, this.name);
    return this.value !== newValue ? newValue : UNCHANGED;
  };

  ObservableValue.prototype.setNewValue = function (newValue) {
    var oldValue = this.value;
    this.value = newValue;
    this.reportChanged();

    if (hasListeners(this)) {
      notifyListeners(this, {
        type: "update",
        object: this,
        newValue: newValue,
        oldValue: oldValue
      });
    }
  };

  ObservableValue.prototype.get = function () {
    this.reportObserved();
    return this.dehanceValue(this.value);
  };

  ObservableValue.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  ObservableValue.prototype.observe = function (listener, fireImmediately) {
    if (fireImmediately) listener({
      object: this,
      type: "update",
      newValue: this.value,
      oldValue: undefined
    });
    return registerListener(this, listener);
  };

  ObservableValue.prototype.toJSON = function () {
    return this.get();
  };

  ObservableValue.prototype.toString = function () {
    return this.name + "[" + this.value + "]";
  };

  ObservableValue.prototype.valueOf = function () {
    return toPrimitive(this.get());
  };

  return ObservableValue;
}(BaseAtom);

ObservableValue.prototype[primitiveSymbol()] = ObservableValue.prototype.valueOf;
var isObservableValue = createInstanceofPredicate("ObservableValue", ObservableValue);
var messages = {
  m001: "It is not allowed to assign new values to @action fields",
  m002: "`runInAction` expects a function",
  m003: "`runInAction` expects a function without arguments",
  m004: "autorun expects a function",
  m005: "Warning: attempted to pass an action to autorun. Actions are untracked and will not trigger on state changes. Use `reaction` or wrap only your state modification code in an action.",
  m006: "Warning: attempted to pass an action to autorunAsync. Actions are untracked and will not trigger on state changes. Use `reaction` or wrap only your state modification code in an action.",
  m007: "reaction only accepts 2 or 3 arguments. If migrating from MobX 2, please provide an options object",
  m008: "wrapping reaction expression in `asReference` is no longer supported, use options object instead",
  m009: "@computed can only be used on getter functions, like: '@computed get myProps() { return ...; }'. It looks like it was used on a property.",
  m010: "@computed can only be used on getter functions, like: '@computed get myProps() { return ...; }'",
  m011: "First argument to `computed` should be an expression. If using computed as decorator, don't pass it arguments",
  m012: "computed takes one or two arguments if used as function",
  m013: "[mobx.expr] 'expr' should only be used inside other reactive functions.",
  m014: "extendObservable expected 2 or more arguments",
  m015: "extendObservable expects an object as first argument",
  m016: "extendObservable should not be used on maps, use map.merge instead",
  m017: "all arguments of extendObservable should be objects",
  m018: "extending an object with another observable (object) is not supported. Please construct an explicit propertymap, using `toJS` if need. See issue #540",
  m019: "[mobx.isObservable] isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.",
  m020: "modifiers can only be used for individual object properties",
  m021: "observable expects zero or one arguments",
  m022: "@observable can not be used on getters, use @computed instead",
  m024: "whyRun() can only be used if a derivation is active, or by passing an computed value / reaction explicitly. If you invoked whyRun from inside a computation; the computation is currently suspended but re-evaluating because somebody requested its value.",
  m025: "whyRun can only be used on reactions and computed values",
  m026: "`action` can only be invoked on functions",
  m028: "It is not allowed to set `useStrict` when a derivation is running",
  m029: "INTERNAL ERROR only onBecomeUnobserved shouldn't be called twice in a row",
  m030a: "Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: ",
  m030b: "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, the render function of a React component? Tried to modify: ",
  m031: "Computed values are not allowed to cause side effects by changing observables that are already being observed. Tried to modify: ",
  m032: "* This computation is suspended (not in use by any reaction) and won't run automatically.\n	Didn't expect this computation to be suspended at this point?\n	  1. Make sure this computation is used by a reaction (reaction, autorun, observer).\n	  2. Check whether you are using this computation synchronously (in the same stack as they reaction that needs it).",
  m033: "`observe` doesn't support the fire immediately property for observable maps.",
  m034: "`mobx.map` is deprecated, use `new ObservableMap` or `mobx.observable.map` instead",
  m035: "Cannot make the designated object observable; it is not extensible",
  m036: "It is not possible to get index atoms from arrays",
  m037: "Hi there! I'm sorry you have just run into an exception.\nIf your debugger ends up here, know that some reaction (like the render() of an observer component, autorun or reaction)\nthrew an exception and that mobx caught it, to avoid that it brings the rest of your application down.\nThe original cause of the exception (the code that caused this reaction to run (again)), is still in the stack.\n\nHowever, more interesting is the actual stack trace of the error itself.\nHopefully the error is an instanceof Error, because in that case you can inspect the original stack of the error from where it was thrown.\nSee `error.stack` property, or press the very subtle \"(...)\" link you see near the console.error message that probably brought you here.\nThat stack is more interesting than the stack of this console.error itself.\n\nIf the exception you see is an exception you created yourself, make sure to use `throw new Error(\"Oops\")` instead of `throw \"Oops\"`,\nbecause the javascript environment will only preserve the original stack trace in the first form.\n\nYou can also make sure the debugger pauses the next time this very same exception is thrown by enabling \"Pause on caught exception\".\n(Note that it might pause on many other, unrelated exception as well).\n\nIf that all doesn't help you out, feel free to open an issue https://github.com/mobxjs/mobx/issues!\n",
  m038: "Missing items in this list?\n    1. Check whether all used values are properly marked as observable (use isObservable to verify)\n    2. Make sure you didn't dereference values too early. MobX observes props, not primitives. E.g: use 'person.name' instead of 'name' in your computation.\n"
};

function getMessage(id) {
  return messages[id];
}

getMessage._r = [2];

function createAction(actionName, fn) {
  invariant(typeof fn === "function", getMessage("m026"));
  invariant(typeof actionName === "string" && actionName.length > 0, "actions should have valid names, got: '" + actionName + "'");

  var res = function res() {
    return executeAction(actionName, fn, this, arguments);
  };

  res._r = [2];
  res.originalFn = fn;
  res.isMobxAction = true;
  return res;
}

createAction._r = [2];

function executeAction(actionName, fn, scope, args) {
  var runInfo = startAction(actionName, fn, scope, args);

  try {
    return fn.apply(scope, args);
  } finally {
    endAction(runInfo);
  }
}

executeAction._r = [2];

function startAction(actionName, fn, scope, args) {
  var notifySpy = isSpyEnabled() && !!actionName;
  var startTime = 0;

  if (notifySpy) {
    startTime = Date.now();
    var l = args && args.length || 0;
    var flattendArgs = new Array(l);
    if (l > 0) for (var i = 0; i < l; i++) {
      flattendArgs[i] = args[i];
    }
    spyReportStart({
      type: "action",
      name: actionName,
      fn: fn,
      object: scope,
      arguments: flattendArgs
    });
  }

  var prevDerivation = untrackedStart();
  startBatch();
  var prevAllowStateChanges = allowStateChangesStart(true);
  return {
    prevDerivation: prevDerivation,
    prevAllowStateChanges: prevAllowStateChanges,
    notifySpy: notifySpy,
    startTime: startTime
  };
}

startAction._r = [2];

function endAction(runInfo) {
  allowStateChangesEnd(runInfo.prevAllowStateChanges);
  endBatch();
  untrackedEnd(runInfo.prevDerivation);
  if (runInfo.notifySpy) spyReportEnd({
    time: Date.now() - runInfo.startTime
  });
}

endAction._r = [2];

function useStrict(strict) {
  invariant(globalState.trackingDerivation === null, getMessage("m028"));
  globalState.strictMode = strict;
  globalState.allowStateChanges = !strict;
}

useStrict._r = [2];

function isStrictModeEnabled() {
  return globalState.strictMode;
}

isStrictModeEnabled._r = [2];

function allowStateChanges(allowStateChanges, func) {
  // TODO: deprecate / refactor this function in next major
  // Currently only used by `@observer`
  // Proposed change: remove first param, rename to `forbidStateChanges`,
  // require error callback instead of the hardcoded error message now used
  // Use `inAction` instead of allowStateChanges in derivation.ts to check strictMode
  var prev = allowStateChangesStart(allowStateChanges);
  var res;

  try {
    res = func();
  } finally {
    allowStateChangesEnd(prev);
  }

  return res;
}

allowStateChanges._r = [2];

function allowStateChangesStart(allowStateChanges) {
  var prev = globalState.allowStateChanges;
  globalState.allowStateChanges = allowStateChanges;
  return prev;
}

allowStateChangesStart._r = [2];

function allowStateChangesEnd(prev) {
  globalState.allowStateChanges = prev;
}
/**
 * Constructs a decorator, that normalizes the differences between
 * TypeScript and Babel. Mainly caused by the fact that legacy-decorator cannot assign
 * values during instance creation to properties that have a getter setter.
 *
 * - Sigh -
 *
 * Also takes care of the difference between @decorator field and @decorator(args) field, and different forms of values.
 * For performance (cpu and mem) reasons the properties are always defined on the prototype (at least initially).
 * This means that these properties despite being enumerable might not show up in Object.keys() (but they will show up in for...in loops).
 */


allowStateChangesEnd._r = [2];

function createClassPropertyDecorator(
/**
 * This function is invoked once, when the property is added to a new instance.
 * When this happens is not strictly determined due to differences in TS and Babel:
 * Typescript: Usually when constructing the new instance
 * Babel, sometimes Typescript: during the first get / set
 * Both: when calling `runLazyInitializers(instance)`
 */
onInitialize, _get, _set, enumerable,
/**
 * Can this decorator invoked with arguments? e.g. @decorator(args)
 */
allowCustomArguments) {
  function classPropertyDecorator(target, key, descriptor, customArgs, argLen) {
    if (argLen === void 0) {
      argLen = 0;
    }

    invariant(allowCustomArguments || quacksLikeADecorator(arguments), "This function is a decorator, but it wasn't invoked like a decorator");

    if (!descriptor) {
      // typescript (except for getter / setters)
      var newDescriptor = {
        enumerable: enumerable,
        configurable: true,
        get: function get$$1() {
          if (!this.__mobxInitializedProps || this.__mobxInitializedProps[key] !== true) typescriptInitializeProperty(this, key, undefined, onInitialize, customArgs, descriptor);
          return _get.call(this, key);
        },
        set: function set$$1(v) {
          if (!this.__mobxInitializedProps || this.__mobxInitializedProps[key] !== true) {
            typescriptInitializeProperty(this, key, v, onInitialize, customArgs, descriptor);
          } else {
            _set.call(this, key, v);
          }
        }
      };

      if (arguments.length < 3 || arguments.length === 5 && argLen < 3) {
        // Typescript target is ES3, so it won't define property for us
        // or using Reflect.decorate polyfill, which will return no descriptor
        // (see https://github.com/mobxjs/mobx/issues/333)
        Object.defineProperty(target, key, newDescriptor);
      }

      return newDescriptor;
    } else {
      // babel and typescript getter / setter props
      if (!hasOwnProperty(target, "__mobxLazyInitializers")) {
        addHiddenProp(target, "__mobxLazyInitializers", target.__mobxLazyInitializers && target.__mobxLazyInitializers.slice() || [] // support inheritance
        );
      }

      var value_1 = descriptor.value,
          initializer_1 = descriptor.initializer;

      target.__mobxLazyInitializers.push(function (instance) {
        onInitialize(instance, key, initializer_1 ? initializer_1.call(instance) : value_1, customArgs, descriptor);
      });

      return {
        enumerable: enumerable,
        configurable: true,
        get: function get$$1() {
          if (this.__mobxDidRunLazyInitializers !== true) runLazyInitializers(this);
          return _get.call(this, key);
        },
        set: function set$$1(v) {
          if (this.__mobxDidRunLazyInitializers !== true) runLazyInitializers(this);

          _set.call(this, key, v);
        }
      };
    }
  }

  if (allowCustomArguments) {
    /** If custom arguments are allowed, we should return a function that returns a decorator */
    return function () {
      /** Direct invocation: @decorator bla */
      if (quacksLikeADecorator(arguments)) return classPropertyDecorator.apply(null, arguments);
      /** Indirect invocation: @decorator(args) bla */

      var outerArgs = arguments;
      var argLen = arguments.length;
      return function (target, key, descriptor) {
        return classPropertyDecorator(target, key, descriptor, outerArgs, argLen);
      };
    };
  }

  return classPropertyDecorator;
}

createClassPropertyDecorator._r = [2];

function typescriptInitializeProperty(instance, key, v, onInitialize, customArgs, baseDescriptor) {
  if (!hasOwnProperty(instance, "__mobxInitializedProps")) addHiddenProp(instance, "__mobxInitializedProps", {});
  instance.__mobxInitializedProps[key] = true;
  onInitialize(instance, key, v, customArgs, baseDescriptor);
}

typescriptInitializeProperty._r = [2];

function runLazyInitializers(instance) {
  if (instance.__mobxDidRunLazyInitializers === true) return;

  if (instance.__mobxLazyInitializers) {
    addHiddenProp(instance, "__mobxDidRunLazyInitializers", true);
    instance.__mobxDidRunLazyInitializers && instance.__mobxLazyInitializers.forEach(function (initializer) {
      return initializer(instance);
    });
  }
}

runLazyInitializers._r = [2];

function quacksLikeADecorator(args) {
  return (args.length === 2 || args.length === 3) && typeof args[1] === "string";
}

quacksLikeADecorator._r = [2];
var actionFieldDecorator = createClassPropertyDecorator(function (target, key, value, args, originalDescriptor) {
  var actionName = args && args.length === 1 ? args[0] : value.name || key || "<unnamed action>";
  var wrappedAction = action(actionName, value);
  addHiddenProp(target, key, wrappedAction);
}, function (key) {
  return this[key];
}, function () {
  invariant(false, getMessage("m001"));
}, false, true);
var boundActionDecorator = createClassPropertyDecorator(function (target, key, value) {
  defineBoundAction(target, key, value);
}, function (key) {
  return this[key];
}, function () {
  invariant(false, getMessage("m001"));
}, false, false);

var action = function action(arg1, arg2, arg3, arg4) {
  if (arguments.length === 1 && typeof arg1 === "function") return createAction(arg1.name || "<unnamed action>", arg1);
  if (arguments.length === 2 && typeof arg2 === "function") return createAction(arg1, arg2);
  if (arguments.length === 1 && typeof arg1 === "string") return namedActionDecorator(arg1);
  return namedActionDecorator(arg2).apply(null, arguments);
};

action._r = [2];

action.bound = function boundAction(arg1, arg2, arg3) {
  if (typeof arg1 === "function") {
    var action_1 = createAction("<not yet bound action>", arg1);
    action_1.autoBind = true;
    return action_1;
  }

  return boundActionDecorator.apply(null, arguments);
};

function namedActionDecorator(name) {
  return function (target, prop, descriptor) {
    if (descriptor && typeof descriptor.value === "function") {
      // TypeScript @action method() { }. Defined on proto before being decorated
      // Don't use the field decorator if we are just decorating a method
      descriptor.value = createAction(name, descriptor.value);
      descriptor.enumerable = false;
      descriptor.configurable = true;
      return descriptor;
    }

    if (descriptor !== undefined && descriptor.get !== undefined) {
      throw new Error("[mobx] action is not expected to be used with getters");
    } // bound instance methods


    return actionFieldDecorator(name).apply(this, arguments);
  };
}

namedActionDecorator._r = [2];

function runInAction(arg1, arg2, arg3) {
  var actionName = typeof arg1 === "string" ? arg1 : arg1.name || "<unnamed action>";
  var fn = typeof arg1 === "function" ? arg1 : arg2;
  var scope = typeof arg1 === "function" ? arg2 : arg3;
  invariant(typeof fn === "function", getMessage("m002"));
  invariant(fn.length === 0, getMessage("m003"));
  invariant(typeof actionName === "string" && actionName.length > 0, "actions should have valid names, got: '" + actionName + "'");
  return executeAction(actionName, fn, scope, undefined);
}

runInAction._r = [2];

function isAction(thing) {
  return typeof thing === "function" && thing.isMobxAction === true;
}

isAction._r = [2];

function defineBoundAction(target, propertyName, fn) {
  var res = function res() {
    return executeAction(propertyName, fn, target, arguments);
  };

  res._r = [2];
  res.isMobxAction = true;
  addHiddenProp(target, propertyName, res);
}

defineBoundAction._r = [2];

function identityComparer(a, b) {
  return a === b;
}

identityComparer._r = [2];

function structuralComparer(a, b) {
  if (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)) {
    return true;
  }

  return deepEqual(a, b);
}

structuralComparer._r = [2];

function defaultComparer(a, b) {
  if (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)) {
    return true;
  }

  return identityComparer(a, b);
}

defaultComparer._r = [2];
var comparer = {
  identity: identityComparer,
  structural: structuralComparer,
  default: defaultComparer
};

function autorun(arg1, arg2, arg3) {
  var name, view, scope;

  if (typeof arg1 === "string") {
    name = arg1;
    view = arg2;
    scope = arg3;
  } else {
    name = arg1.name || "Autorun@" + getNextId();
    view = arg1;
    scope = arg2;
  }

  invariant(typeof view === "function", getMessage("m004"));
  invariant(isAction(view) === false, getMessage("m005"));
  if (scope) view = view.bind(scope);
  var reaction = new Reaction(name, function () {
    this.track(reactionRunner);
  });

  function reactionRunner() {
    view(reaction);
  }

  reaction.schedule();
  return reaction.getDisposer();
}

autorun._r = [2];

function when(arg1, arg2, arg3, arg4) {
  var name, predicate, effect, scope;

  if (typeof arg1 === "string") {
    name = arg1;
    predicate = arg2;
    effect = arg3;
    scope = arg4;
  } else {
    name = "When@" + getNextId();
    predicate = arg1;
    effect = arg2;
    scope = arg3;
  }

  var disposer = autorun(name, function (r) {
    if (predicate.call(scope)) {
      r.dispose();
      var prevUntracked = untrackedStart();
      effect.call(scope);
      untrackedEnd(prevUntracked);
    }
  });
  return disposer;
}

when._r = [2];

function autorunAsync(arg1, arg2, arg3, arg4) {
  var name, func, delay, scope;

  if (typeof arg1 === "string") {
    name = arg1;
    func = arg2;
    delay = arg3;
    scope = arg4;
  } else {
    name = arg1.name || "AutorunAsync@" + getNextId();
    func = arg1;
    delay = arg2;
    scope = arg3;
  }

  invariant(isAction(func) === false, getMessage("m006"));
  if (delay === void 0) delay = 1;
  if (scope) func = func.bind(scope);
  var isScheduled = false;
  var r = new Reaction(name, function () {
    if (!isScheduled) {
      isScheduled = true;
      setTimeout(function () {
        isScheduled = false;
        if (!r.isDisposed) r.track(reactionRunner);
      }, delay);
    }
  });

  function reactionRunner() {
    func(r);
  }

  r.schedule();
  return r.getDisposer();
}

autorunAsync._r = [2];

function reaction(expression, effect, arg3) {
  if (arguments.length > 3) {
    fail(getMessage("m007"));
  }

  if (isModifierDescriptor(expression)) {
    fail(getMessage("m008"));
  }

  var opts;

  if (_typeof(arg3) === "object") {
    opts = arg3;
  } else {
    opts = {};
  }

  opts.name = opts.name || expression.name || effect.name || "Reaction@" + getNextId();
  opts.fireImmediately = arg3 === true || opts.fireImmediately === true;
  opts.delay = opts.delay || 0;
  opts.compareStructural = opts.compareStructural || opts.struct || false; // TODO: creates ugly spy events, use `effect = (r) => runInAction(opts.name, () => effect(r))` instead

  effect = action(opts.name, opts.context ? effect.bind(opts.context) : effect);

  if (opts.context) {
    expression = expression.bind(opts.context);
  }

  var firstTime = true;
  var isScheduled = false;
  var value;
  var equals = opts.equals ? opts.equals : opts.compareStructural || opts.struct ? comparer.structural : comparer.default;
  var r = new Reaction(opts.name, function () {
    if (firstTime || opts.delay < 1) {
      reactionRunner();
    } else if (!isScheduled) {
      isScheduled = true;
      setTimeout(function () {
        isScheduled = false;
        reactionRunner();
      }, opts.delay);
    }
  });

  function reactionRunner() {
    if (r.isDisposed) return;
    var changed = false;
    r.track(function () {
      var nextValue = expression(r);
      changed = firstTime || !equals(value, nextValue);
      value = nextValue;
    });
    if (firstTime && opts.fireImmediately) effect(value, r);
    if (!firstTime && changed === true) effect(value, r);
    if (firstTime) firstTime = false;
  }

  r.schedule();
  return r.getDisposer();
}
/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */


reaction._r = [2];

var ComputedValue = function () {
  /**
   * Create a new computed value based on a function expression.
   *
   * The `name` property is for debug purposes only.
   *
   * The `equals` property specifies the comparer function to use to determine if a newly produced
   * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
   * compares based on identity comparison (===), and `structualComparer` deeply compares the structure.
   * Structural comparison can be convenient if you always produce an new aggregated object and
   * don't want to notify observers if it is structurally the same.
   * This is useful for working with vectors, mouse coordinates etc.
   */
  function ComputedValue(derivation, scope, equals, name, setter) {
    this.derivation = derivation;
    this.scope = scope;
    this.equals = equals;
    this.dependenciesState = IDerivationState.NOT_TRACKING;
    this.observing = []; // nodes we are looking at. Our value depends on these nodes

    this.newObserving = null; // during tracking it's an array with new observed observers

    this.isPendingUnobservation = false;
    this.observers = [];
    this.observersIndexes = {};
    this.diffValue = 0;
    this.runId = 0;
    this.lastAccessedBy = 0;
    this.lowestObserverState = IDerivationState.UP_TO_DATE;
    this.unboundDepsCount = 0;
    this.__mapid = "#" + getNextId();
    this.value = new CaughtException(null);
    this.isComputing = false; // to check for cycles

    this.isRunningSetter = false;
    this.name = name || "ComputedValue@" + getNextId();
    if (setter) this.setter = createAction(name + "-setter", setter);
  }

  ComputedValue.prototype.onBecomeStale = function () {
    propagateMaybeChanged(this);
  };

  ComputedValue.prototype.onBecomeUnobserved = function () {
    clearObserving(this);
    this.value = undefined;
  };
  /**
   * Returns the current value of this computed value.
   * Will evaluate its computation first if needed.
   */


  ComputedValue.prototype.get = function () {
    invariant(!this.isComputing, "Cycle detected in computation " + this.name, this.derivation);

    if (globalState.inBatch === 0) {
      // This is an minor optimization which could be omitted to simplify the code
      // The computedValue is accessed outside of any mobx stuff. Batch observing should be enough and don't need
      // tracking as it will never be called again inside this batch.
      startBatch();
      if (shouldCompute(this)) this.value = this.computeValue(false);
      endBatch();
    } else {
      reportObserved(this);
      if (shouldCompute(this)) if (this.trackAndCompute()) propagateChangeConfirmed(this);
    }

    var result = this.value;
    if (isCaughtException(result)) throw result.cause;
    return result;
  };

  ComputedValue.prototype.peek = function () {
    var res = this.computeValue(false);
    if (isCaughtException(res)) throw res.cause;
    return res;
  };

  ComputedValue.prototype.set = function (value) {
    if (this.setter) {
      invariant(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
      this.isRunningSetter = true;

      try {
        this.setter.call(this.scope, value);
      } finally {
        this.isRunningSetter = false;
      }
    } else invariant(false, "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
  };

  ComputedValue.prototype.trackAndCompute = function () {
    if (isSpyEnabled()) {
      spyReport({
        object: this.scope,
        type: "compute",
        fn: this.derivation
      });
    }

    var oldValue = this.value;
    var newValue = this.value = this.computeValue(true);
    return isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals(oldValue, newValue);
  };

  ComputedValue.prototype.computeValue = function (track) {
    this.isComputing = true;
    globalState.computationDepth++;
    var res;

    if (track) {
      res = trackDerivedFunction(this, this.derivation, this.scope);
    } else {
      try {
        res = this.derivation.call(this.scope);
      } catch (e) {
        res = new CaughtException(e);
      }
    }

    globalState.computationDepth--;
    this.isComputing = false;
    return res;
  };

  ComputedValue.prototype.observe = function (listener, fireImmediately) {
    var _this = this;

    var firstTime = true;
    var prevValue = undefined;
    return autorun(function () {
      var newValue = _this.get();

      if (!firstTime || fireImmediately) {
        var prevU = untrackedStart();
        listener({
          type: "update",
          object: _this,
          newValue: newValue,
          oldValue: prevValue
        });
        untrackedEnd(prevU);
      }

      firstTime = false;
      prevValue = newValue;
    });
  };

  ComputedValue.prototype.toJSON = function () {
    return this.get();
  };

  ComputedValue.prototype.toString = function () {
    return this.name + "[" + this.derivation.toString() + "]";
  };

  ComputedValue.prototype.valueOf = function () {
    return toPrimitive(this.get());
  };

  ComputedValue.prototype.whyRun = function () {
    var isTracking = Boolean(globalState.trackingDerivation);
    var observing = unique(this.isComputing ? this.newObserving : this.observing).map(function (dep) {
      return dep.name;
    });
    var observers = unique(getObservers(this).map(function (dep) {
      return dep.name;
    }));
    return "\nWhyRun? computation '" + this.name + "':\n * Running because: " + (isTracking ? "[active] the value of this computation is needed by a reaction" : this.isComputing ? "[get] The value of this computed was requested outside a reaction" : "[idle] not running at the moment") + "\n" + (this.dependenciesState === IDerivationState.NOT_TRACKING ? getMessage("m032") : " * This computation will re-run if any of the following observables changes:\n    " + joinStrings(observing) + "\n    " + (this.isComputing && isTracking ? " (... or any observable accessed during the remainder of the current run)" : "") + "\n\t" + getMessage("m038") + "\n\n  * If the outcome of this computation changes, the following observers will be re-run:\n    " + joinStrings(observers) + "\n");
  };

  return ComputedValue;
}();

ComputedValue.prototype[primitiveSymbol()] = ComputedValue.prototype.valueOf;
var isComputedValue = createInstanceofPredicate("ComputedValue", ComputedValue);

var ObservableObjectAdministration = function () {
  function ObservableObjectAdministration(target, name) {
    this.target = target;
    this.name = name;
    this.values = {};
    this.changeListeners = null;
    this.interceptors = null;
  }
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */


  ObservableObjectAdministration.prototype.observe = function (callback, fireImmediately) {
    invariant(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
    return registerListener(this, callback);
  };

  ObservableObjectAdministration.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  return ObservableObjectAdministration;
}();

function asObservableObject(target, name) {
  if (isObservableObject(target) && target.hasOwnProperty("$mobx")) return target.$mobx;
  invariant(Object.isExtensible(target), getMessage("m035"));
  if (!isPlainObject(target)) name = (target.constructor.name || "ObservableObject") + "@" + getNextId();
  if (!name) name = "ObservableObject@" + getNextId();
  var adm = new ObservableObjectAdministration(target, name);
  addHiddenFinalProp(target, "$mobx", adm);
  return adm;
}

asObservableObject._r = [2];

function defineObservablePropertyFromDescriptor(adm, propName, descriptor, defaultEnhancer) {
  if (adm.values[propName] && !isComputedValue(adm.values[propName])) {
    // already observable property
    invariant("value" in descriptor, "The property " + propName + " in " + adm.name + " is already observable, cannot redefine it as computed property");
    adm.target[propName] = descriptor.value; // the property setter will make 'value' reactive if needed.

    return;
  } // not yet observable property


  if ("value" in descriptor) {
    // not a computed value
    if (isModifierDescriptor(descriptor.value)) {
      // x : ref(someValue)
      var modifierDescriptor = descriptor.value;
      defineObservableProperty(adm, propName, modifierDescriptor.initialValue, modifierDescriptor.enhancer);
    } else if (isAction(descriptor.value) && descriptor.value.autoBind === true) {
      defineBoundAction(adm.target, propName, descriptor.value.originalFn);
    } else if (isComputedValue(descriptor.value)) {
      // x: computed(someExpr)
      defineComputedPropertyFromComputedValue(adm, propName, descriptor.value);
    } else {
      // x: someValue
      defineObservableProperty(adm, propName, descriptor.value, defaultEnhancer);
    }
  } else {
    // get x() { return 3 } set x(v) { }
    defineComputedProperty(adm, propName, descriptor.get, descriptor.set, comparer.default, true);
  }
}

defineObservablePropertyFromDescriptor._r = [2];

function defineObservableProperty(adm, propName, newValue, enhancer) {
  assertPropertyConfigurable(adm.target, propName);

  if (hasInterceptors(adm)) {
    var change = interceptChange(adm, {
      object: adm.target,
      name: propName,
      type: "add",
      newValue: newValue
    });
    if (!change) return;
    newValue = change.newValue;
  }

  var observable = adm.values[propName] = new ObservableValue(newValue, enhancer, adm.name + "." + propName, false);
  newValue = observable.value; // observableValue might have changed it

  Object.defineProperty(adm.target, propName, generateObservablePropConfig(propName));
  notifyPropertyAddition(adm, adm.target, propName, newValue);
}

defineObservableProperty._r = [2];

function defineComputedProperty(adm, propName, getter, setter, equals, asInstanceProperty) {
  if (asInstanceProperty) assertPropertyConfigurable(adm.target, propName);
  adm.values[propName] = new ComputedValue(getter, adm.target, equals, adm.name + "." + propName, setter);

  if (asInstanceProperty) {
    Object.defineProperty(adm.target, propName, generateComputedPropConfig(propName));
  }
}

defineComputedProperty._r = [2];

function defineComputedPropertyFromComputedValue(adm, propName, computedValue) {
  var name = adm.name + "." + propName;
  computedValue.name = name;
  if (!computedValue.scope) computedValue.scope = adm.target;
  adm.values[propName] = computedValue;
  Object.defineProperty(adm.target, propName, generateComputedPropConfig(propName));
}

defineComputedPropertyFromComputedValue._r = [2];
var observablePropertyConfigs = {};
var computedPropertyConfigs = {};

function generateObservablePropConfig(propName) {
  return observablePropertyConfigs[propName] || (observablePropertyConfigs[propName] = {
    configurable: true,
    enumerable: true,
    get: function get$$1() {
      return this.$mobx.values[propName].get();
    },
    set: function set$$1(v) {
      setPropertyValue(this, propName, v);
    }
  });
}

generateObservablePropConfig._r = [2];

function generateComputedPropConfig(propName) {
  return computedPropertyConfigs[propName] || (computedPropertyConfigs[propName] = {
    configurable: true,
    enumerable: false,
    get: function get$$1() {
      return this.$mobx.values[propName].get();
    },
    set: function set$$1(v) {
      return this.$mobx.values[propName].set(v);
    }
  });
}

generateComputedPropConfig._r = [2];

function setPropertyValue(instance, name, newValue) {
  var adm = instance.$mobx;
  var observable = adm.values[name]; // intercept

  if (hasInterceptors(adm)) {
    var change = interceptChange(adm, {
      type: "update",
      object: instance,
      name: name,
      newValue: newValue
    });
    if (!change) return;
    newValue = change.newValue;
  }

  newValue = observable.prepareNewValue(newValue); // notify spy & observers

  if (newValue !== UNCHANGED) {
    var notify = hasListeners(adm);
    var notifySpy = isSpyEnabled();
    var change = notify || notifySpy ? {
      type: "update",
      object: instance,
      oldValue: observable.value,
      name: name,
      newValue: newValue
    } : null;
    if (notifySpy) spyReportStart(change);
    observable.setNewValue(newValue);
    if (notify) notifyListeners(adm, change);
    if (notifySpy) spyReportEnd();
  }
}

setPropertyValue._r = [2];

function notifyPropertyAddition(adm, object, name, newValue) {
  var notify = hasListeners(adm);
  var notifySpy = isSpyEnabled();
  var change = notify || notifySpy ? {
    type: "add",
    object: object,
    name: name,
    newValue: newValue
  } : null;
  if (notifySpy) spyReportStart(change);
  if (notify) notifyListeners(adm, change);
  if (notifySpy) spyReportEnd();
}

notifyPropertyAddition._r = [2];
var isObservableObjectAdministration = createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);

function isObservableObject(thing) {
  if (isObject(thing)) {
    // Initializers run lazily when transpiling to babel, so make sure they are run...
    runLazyInitializers(thing);
    return isObservableObjectAdministration(thing.$mobx);
  }

  return false;
}
/**
 * Returns true if the provided value is reactive.
 * @param value object, function or array
 * @param property if property is specified, checks whether value.property is reactive.
 */


isObservableObject._r = [2];

function isObservable(value, property) {
  if (value === null || value === undefined) return false;

  if (property !== undefined) {
    if (isObservableArray(value) || isObservableMap(value)) throw new Error(getMessage("m019"));else if (isObservableObject(value)) {
      var o = value.$mobx;
      return o.values && !!o.values[property];
    }
    return false;
  } // For first check, see #701


  return isObservableObject(value) || !!value.$mobx || isAtom(value) || isReaction(value) || isComputedValue(value);
}

isObservable._r = [2];

function createDecoratorForEnhancer(enhancer) {
  invariant(!!enhancer, ":(");
  return createClassPropertyDecorator(function (target, name, baseValue, _, baseDescriptor) {
    assertPropertyConfigurable(target, name);
    invariant(!baseDescriptor || !baseDescriptor.get, getMessage("m022"));
    var adm = asObservableObject(target, undefined);
    defineObservableProperty(adm, name, baseValue, enhancer);
  }, function (name) {
    var observable = this.$mobx.values[name];
    if (observable === undefined // See #505
    ) return undefined;
    return observable.get();
  }, function (name, value) {
    setPropertyValue(this, name, value);
  }, true, false);
}

createDecoratorForEnhancer._r = [2];

function extendObservable(target) {
  var properties = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    properties[_i - 1] = arguments[_i];
  }

  return extendObservableHelper(target, deepEnhancer, properties);
}

extendObservable._r = [2];

function extendShallowObservable(target) {
  var properties = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    properties[_i - 1] = arguments[_i];
  }

  return extendObservableHelper(target, referenceEnhancer, properties);
}

extendShallowObservable._r = [2];

function extendObservableHelper(target, defaultEnhancer, properties) {
  invariant(arguments.length >= 2, getMessage("m014"));
  invariant(_typeof(target) === "object", getMessage("m015"));
  invariant(!isObservableMap(target), getMessage("m016"));
  properties.forEach(function (propSet) {
    invariant(_typeof(propSet) === "object", getMessage("m017"));
    invariant(!isObservable(propSet), getMessage("m018"));
  });
  var adm = asObservableObject(target);
  var definedProps = {}; // Note could be optimised if properties.length === 1

  for (var i = properties.length - 1; i >= 0; i--) {
    var propSet = properties[i];

    for (var key in propSet) {
      if (definedProps[key] !== true && hasOwnProperty(propSet, key)) {
        definedProps[key] = true;
        if (target === propSet && !isPropertyConfigurable(target, key)) continue; // see #111, skip non-configurable or non-writable props for `observable(object)`.

        var descriptor = Object.getOwnPropertyDescriptor(propSet, key);
        defineObservablePropertyFromDescriptor(adm, key, descriptor, defaultEnhancer);
      }
    }
  }

  return target;
}

extendObservableHelper._r = [2];
var deepDecorator = createDecoratorForEnhancer(deepEnhancer);
var shallowDecorator = createDecoratorForEnhancer(shallowEnhancer);
var refDecorator = createDecoratorForEnhancer(referenceEnhancer);
var deepStructDecorator = createDecoratorForEnhancer(deepStructEnhancer);
var refStructDecorator = createDecoratorForEnhancer(refStructEnhancer);
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */

function createObservable(v) {
  if (v === void 0) {
    v = undefined;
  } // @observable someProp;


  if (typeof arguments[1] === "string") return deepDecorator.apply(null, arguments);
  invariant(arguments.length <= 1, getMessage("m021"));
  invariant(!isModifierDescriptor(v), getMessage("m020")); // it is an observable already, done

  if (isObservable(v)) return v; // something that can be converted and mutated?

  var res = deepEnhancer(v, undefined, undefined); // this value could be converted to a new observable data structure, return it

  if (res !== v) return res; // otherwise, just box it

  return observable.box(v);
}

createObservable._r = [2];

var IObservableFactories = function () {
  function IObservableFactories() {}

  IObservableFactories.prototype.box = function (value, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("box");
    return new ObservableValue(value, deepEnhancer, name);
  };

  IObservableFactories.prototype.shallowBox = function (value, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("shallowBox");
    return new ObservableValue(value, referenceEnhancer, name);
  };

  IObservableFactories.prototype.array = function (initialValues, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("array");
    return new ObservableArray(initialValues, deepEnhancer, name);
  };

  IObservableFactories.prototype.shallowArray = function (initialValues, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("shallowArray");
    return new ObservableArray(initialValues, referenceEnhancer, name);
  };

  IObservableFactories.prototype.map = function (initialValues, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("map");
    return new ObservableMap(initialValues, deepEnhancer, name);
  };

  IObservableFactories.prototype.shallowMap = function (initialValues, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("shallowMap");
    return new ObservableMap(initialValues, referenceEnhancer, name);
  };

  IObservableFactories.prototype.object = function (props, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("object");
    var res = {}; // convert to observable object

    asObservableObject(res, name); // add properties

    extendObservable(res, props);
    return res;
  };

  IObservableFactories.prototype.shallowObject = function (props, name) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("shallowObject");
    var res = {};
    asObservableObject(res, name);
    extendShallowObservable(res, props);
    return res;
  };

  IObservableFactories.prototype.ref = function () {
    if (arguments.length < 2) {
      // although ref creates actually a modifier descriptor, the type of the resultig properties
      // of the object is `T` in the end, when the descriptors are interpreted
      return createModifierDescriptor(referenceEnhancer, arguments[0]);
    } else {
      return refDecorator.apply(null, arguments);
    }
  };

  IObservableFactories.prototype.shallow = function () {
    if (arguments.length < 2) {
      // although ref creates actually a modifier descriptor, the type of the resultig properties
      // of the object is `T` in the end, when the descriptors are interpreted
      return createModifierDescriptor(shallowEnhancer, arguments[0]);
    } else {
      return shallowDecorator.apply(null, arguments);
    }
  };

  IObservableFactories.prototype.deep = function () {
    if (arguments.length < 2) {
      // although ref creates actually a modifier descriptor, the type of the resultig properties
      // of the object is `T` in the end, when the descriptors are interpreted
      return createModifierDescriptor(deepEnhancer, arguments[0]);
    } else {
      return deepDecorator.apply(null, arguments);
    }
  };

  IObservableFactories.prototype.struct = function () {
    if (arguments.length < 2) {
      // although ref creates actually a modifier descriptor, the type of the resultig properties
      // of the object is `T` in the end, when the descriptors are interpreted
      return createModifierDescriptor(deepStructEnhancer, arguments[0]);
    } else {
      return deepStructDecorator.apply(null, arguments);
    }
  };

  return IObservableFactories;
}();

var observable = createObservable; // weird trick to keep our typings nicely with our funcs, and still extend the observable function
// ES6 class methods aren't enumerable, can't use Object.keys

Object.getOwnPropertyNames(IObservableFactories.prototype).filter(function (name) {
  return name !== "constructor";
}).forEach(function (name) {
  return observable[name] = IObservableFactories.prototype[name];
});
observable.deep.struct = observable.struct;

observable.ref.struct = function () {
  if (arguments.length < 2) {
    return createModifierDescriptor(refStructEnhancer, arguments[0]);
  } else {
    return refStructDecorator.apply(null, arguments);
  }
};

function incorrectlyUsedAsDecorator(methodName) {
  fail("Expected one or two arguments to observable." + methodName + ". Did you accidentally try to use observable." + methodName + " as decorator?");
}

incorrectlyUsedAsDecorator._r = [2];

function isModifierDescriptor(thing) {
  return _typeof(thing) === "object" && thing !== null && thing.isMobxModifierDescriptor === true;
}

isModifierDescriptor._r = [2];

function createModifierDescriptor(enhancer, initialValue) {
  invariant(!isModifierDescriptor(initialValue), "Modifiers cannot be nested");
  return {
    isMobxModifierDescriptor: true,
    initialValue: initialValue,
    enhancer: enhancer
  };
}

createModifierDescriptor._r = [2];

function deepEnhancer(v, _, name) {
  if (isModifierDescriptor(v)) fail("You tried to assign a modifier wrapped value to a collection, please define modifiers when creating the collection, not when modifying it"); // it is an observable already, done

  if (isObservable(v)) return v; // something that can be converted and mutated?

  if (Array.isArray(v)) return observable.array(v, name);
  if (isPlainObject(v)) return observable.object(v, name);
  if (isES6Map(v)) return observable.map(v, name);
  return v;
}

deepEnhancer._r = [2];

function shallowEnhancer(v, _, name) {
  if (isModifierDescriptor(v)) fail("You tried to assign a modifier wrapped value to a collection, please define modifiers when creating the collection, not when modifying it");
  if (v === undefined || v === null) return v;
  if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v)) return v;
  if (Array.isArray(v)) return observable.shallowArray(v, name);
  if (isPlainObject(v)) return observable.shallowObject(v, name);
  if (isES6Map(v)) return observable.shallowMap(v, name);
  return fail("The shallow modifier / decorator can only used in combination with arrays, objects and maps");
}

shallowEnhancer._r = [2];

function referenceEnhancer(newValue) {
  // never turn into an observable
  return newValue;
}

referenceEnhancer._r = [2];

function deepStructEnhancer(v, oldValue, name) {
  // don't confuse structurally compare enhancer with ref enhancer! The latter is probably
  // more suited for immutable objects
  if (deepEqual(v, oldValue)) return oldValue; // it is an observable already, done

  if (isObservable(v)) return v; // something that can be converted and mutated?

  if (Array.isArray(v)) return new ObservableArray(v, deepStructEnhancer, name);
  if (isES6Map(v)) return new ObservableMap(v, deepStructEnhancer, name);

  if (isPlainObject(v)) {
    var res = {};
    asObservableObject(res, name);
    extendObservableHelper(res, deepStructEnhancer, [v]);
    return res;
  }

  return v;
}

deepStructEnhancer._r = [2];

function refStructEnhancer(v, oldValue, name) {
  if (deepEqual(v, oldValue)) return oldValue;
  return v;
}
/**
 * @deprecated
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * Deprecated to simplify api; transactions offer no real benefit above actions.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */


refStructEnhancer._r = [2];

function transaction(action, thisArg) {
  if (thisArg === void 0) {
    thisArg = undefined;
  }

  return runInTransaction.apply(undefined, arguments);
}

transaction._r = [2];

function runInTransaction(action, thisArg) {
  if (thisArg === void 0) {
    thisArg = undefined;
  }

  return executeAction("", action);
}

runInTransaction._r = [2];
var ObservableMapMarker = {};

var ObservableMap = function () {
  function ObservableMap(initialData, enhancer, name) {
    if (enhancer === void 0) {
      enhancer = deepEnhancer;
    }

    if (name === void 0) {
      name = "ObservableMap@" + getNextId();
    }

    this.enhancer = enhancer;
    this.name = name;
    this.$mobx = ObservableMapMarker;
    this._data = Object.create(null);
    this._hasMap = Object.create(null); // hasMap, not hashMap >-).

    this._keys = new ObservableArray(undefined, referenceEnhancer, this.name + ".keys()", true);
    this.interceptors = null;
    this.changeListeners = null;
    this.dehancer = undefined;
    this.merge(initialData);
  }

  ObservableMap.prototype._has = function (key) {
    return typeof this._data[key] !== "undefined";
  };

  ObservableMap.prototype.has = function (key) {
    if (!this.isValidKey(key)) return false;
    key = "" + key;
    if (this._hasMap[key]) return this._hasMap[key].get();
    return this._updateHasMapEntry(key, false).get();
  };

  ObservableMap.prototype.set = function (key, value) {
    this.assertValidKey(key);
    key = "" + key;

    var hasKey = this._has(key);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: hasKey ? "update" : "add",
        object: this,
        newValue: value,
        name: key
      });
      if (!change) return this;
      value = change.newValue;
    }

    if (hasKey) {
      this._updateValue(key, value);
    } else {
      this._addValue(key, value);
    }

    return this;
  };

  ObservableMap.prototype.delete = function (key) {
    var _this = this;

    this.assertValidKey(key);
    key = "" + key;

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: "delete",
        object: this,
        name: key
      });
      if (!change) return false;
    }

    if (this._has(key)) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        type: "delete",
        object: this,
        oldValue: this._data[key].value,
        name: key
      } : null;
      if (notifySpy) spyReportStart(change);
      runInTransaction(function () {
        _this._keys.remove(key);

        _this._updateHasMapEntry(key, false);

        var observable$$1 = _this._data[key];
        observable$$1.setNewValue(undefined);
        _this._data[key] = undefined;
      });
      if (notify) notifyListeners(this, change);
      if (notifySpy) spyReportEnd();
      return true;
    }

    return false;
  };

  ObservableMap.prototype._updateHasMapEntry = function (key, value) {
    // optimization; don't fill the hasMap if we are not observing, or remove entry if there are no observers anymore
    var entry = this._hasMap[key];

    if (entry) {
      entry.setNewValue(value);
    } else {
      entry = this._hasMap[key] = new ObservableValue(value, referenceEnhancer, this.name + "." + key + "?", false);
    }

    return entry;
  };

  ObservableMap.prototype._updateValue = function (name, newValue) {
    var observable$$1 = this._data[name];
    newValue = observable$$1.prepareNewValue(newValue);

    if (newValue !== UNCHANGED) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        type: "update",
        object: this,
        oldValue: observable$$1.value,
        name: name,
        newValue: newValue
      } : null;
      if (notifySpy) spyReportStart(change);
      observable$$1.setNewValue(newValue);
      if (notify) notifyListeners(this, change);
      if (notifySpy) spyReportEnd();
    }
  };

  ObservableMap.prototype._addValue = function (name, newValue) {
    var _this = this;

    runInTransaction(function () {
      var observable$$1 = _this._data[name] = new ObservableValue(newValue, _this.enhancer, _this.name + "." + name, false);
      newValue = observable$$1.value; // value might have been changed

      _this._updateHasMapEntry(name, true);

      _this._keys.push(name);
    });
    var notifySpy = isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      type: "add",
      object: this,
      name: name,
      newValue: newValue
    } : null;
    if (notifySpy) spyReportStart(change);
    if (notify) notifyListeners(this, change);
    if (notifySpy) spyReportEnd();
  };

  ObservableMap.prototype.get = function (key) {
    key = "" + key;
    if (this.has(key)) return this.dehanceValue(this._data[key].get());
    return this.dehanceValue(undefined);
  };

  ObservableMap.prototype.dehanceValue = function (value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  ObservableMap.prototype.keys = function () {
    return arrayAsIterator(this._keys.slice());
  };

  ObservableMap.prototype.values = function () {
    return arrayAsIterator(this._keys.map(this.get, this));
  };

  ObservableMap.prototype.entries = function () {
    var _this = this;

    return arrayAsIterator(this._keys.map(function (key) {
      return [key, _this.get(key)];
    }));
  };

  ObservableMap.prototype.forEach = function (callback, thisArg) {
    var _this = this;

    this.keys().forEach(function (key) {
      return callback.call(thisArg, _this.get(key), key, _this);
    });
  };
  /** Merge another object into this object, returns this. */


  ObservableMap.prototype.merge = function (other) {
    var _this = this;

    if (isObservableMap(other)) {
      other = other.toJS();
    }

    runInTransaction(function () {
      if (isPlainObject(other)) Object.keys(other).forEach(function (key) {
        return _this.set(key, other[key]);
      });else if (Array.isArray(other)) other.forEach(function (_a) {
        var key = _a[0],
            value = _a[1];
        return _this.set(key, value);
      });else if (isES6Map(other)) other.forEach(function (value, key) {
        return _this.set(key, value);
      });else if (other !== null && other !== undefined) fail("Cannot initialize map from " + other);
    });
    return this;
  };

  ObservableMap.prototype.clear = function () {
    var _this = this;

    runInTransaction(function () {
      untracked(function () {
        _this.keys().forEach(_this.delete, _this);
      });
    });
  };

  ObservableMap.prototype.replace = function (values) {
    var _this = this;

    runInTransaction(function () {
      _this.clear();

      _this.merge(values);
    });
    return this;
  };

  Object.defineProperty(ObservableMap.prototype, "size", {
    get: function get$$1() {
      return this._keys.length;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Returns a shallow non observable object clone of this map.
   * Note that the values might still be observable. For a deep clone use mobx.toJS.
   */

  ObservableMap.prototype.toJS = function () {
    var _this = this;

    var res = {};
    this.keys().forEach(function (key) {
      return res[key] = _this.get(key);
    });
    return res;
  };

  ObservableMap.prototype.toJSON = function () {
    // Used by JSON.stringify
    return this.toJS();
  };

  ObservableMap.prototype.isValidKey = function (key) {
    if (key === null || key === undefined) return false;
    if (typeof key === "string" || typeof key === "number" || typeof key === "boolean") return true;
    return false;
  };

  ObservableMap.prototype.assertValidKey = function (key) {
    if (!this.isValidKey(key)) throw new Error("[mobx.map] Invalid key: '" + key + "', only strings, numbers and booleans are accepted as key in observable maps.");
  };

  ObservableMap.prototype.toString = function () {
    var _this = this;

    return this.name + "[{ " + this.keys().map(function (key) {
      return key + ": " + ("" + _this.get(key));
    }).join(", ") + " }]";
  };
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */


  ObservableMap.prototype.observe = function (listener, fireImmediately) {
    invariant(fireImmediately !== true, getMessage("m033"));
    return registerListener(this, listener);
  };

  ObservableMap.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  return ObservableMap;
}();

declareIterator(ObservableMap.prototype, function () {
  return this.entries();
});

function map(initialValues) {
  deprecated("`mobx.map` is deprecated, use `new ObservableMap` or `mobx.observable.map` instead");
  return observable.map(initialValues);
}
/* 'var' fixes small-build issue */


map._r = [2];
var isObservableMap = createInstanceofPredicate("ObservableMap", ObservableMap);
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);

function getGlobal() {
  return typeof window !== "undefined" ? window : global$1;
}

getGlobal._r = [2];

function getNextId() {
  return ++globalState.mobxGuid;
}

getNextId._r = [2];

function fail(message, thing) {
  invariant(false, message, thing);
  throw "X"; // unreachable
}

fail._r = [2];

function invariant(check, message, thing) {
  if (!check) throw new Error("[mobx] Invariant failed: " + message + (thing ? " in '" + thing + "'" : ""));
}
/**
 * Prints a deprecation message, but only one time.
 * Returns false if the deprecated message was already printed before
 */


invariant._r = [2];
var deprecatedMessages = [];

function deprecated(msg) {
  if (deprecatedMessages.indexOf(msg) !== -1) return false;
  deprecatedMessages.push(msg);
  console.error("[mobx] Deprecated: " + msg);
  return true;
}
/**
 * Makes sure that the provided function is invoked at most once.
 */


deprecated._r = [2];

function once$1(func) {
  var invoked = false;
  return function () {
    if (invoked) return;
    invoked = true;
    return func.apply(this, arguments);
  };
}

once$1._r = [2];

var noop$1 = function noop() {};

noop$1._r = [2];

function unique(list) {
  var res = [];
  list.forEach(function (item) {
    if (res.indexOf(item) === -1) res.push(item);
  });
  return res;
}

unique._r = [2];

function joinStrings(things, limit, separator) {
  if (limit === void 0) {
    limit = 100;
  }

  if (separator === void 0) {
    separator = " - ";
  }

  if (!things) return "";
  var sliced = things.slice(0, limit);
  return "" + sliced.join(separator) + (things.length > limit ? " (... and " + (things.length - limit) + "more)" : "");
}

joinStrings._r = [2];

function isObject(value) {
  return value !== null && _typeof(value) === "object";
}

isObject._r = [2];

function isPlainObject(value) {
  if (value === null || _typeof(value) !== "object") return false;
  var proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

isPlainObject._r = [2];

function objectAssign() {
  var res = arguments[0];

  for (var i = 1, l = arguments.length; i < l; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (hasOwnProperty(source, key)) {
        res[key] = source[key];
      }
    }
  }

  return res;
}

objectAssign._r = [2];
var prototypeHasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwnProperty(object, propName) {
  return prototypeHasOwnProperty.call(object, propName);
}

hasOwnProperty._r = [2];

function makeNonEnumerable(object, propNames) {
  for (var i = 0; i < propNames.length; i++) {
    addHiddenProp(object, propNames[i], object[propNames[i]]);
  }
}

makeNonEnumerable._r = [2];

function addHiddenProp(object, propName, value) {
  Object.defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value
  });
}

addHiddenProp._r = [2];

function addHiddenFinalProp(object, propName, value) {
  Object.defineProperty(object, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: value
  });
}

addHiddenFinalProp._r = [2];

function isPropertyConfigurable(object, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(object, prop);
  return !descriptor || descriptor.configurable !== false && descriptor.writable !== false;
}

isPropertyConfigurable._r = [2];

function assertPropertyConfigurable(object, prop) {
  invariant(isPropertyConfigurable(object, prop), "Cannot make property '" + prop + "' observable, it is not configurable and writable in the target object");
}

assertPropertyConfigurable._r = [2];

function getEnumerableKeys(obj) {
  var res = [];

  for (var key in obj) {
    res.push(key);
  }

  return res;
}
/**
 * Naive deepEqual. Doesn't check for prototype, non-enumerable or out-of-range properties on arrays.
 * If you have such a case, you probably should use this function but something fancier :).
 */


getEnumerableKeys._r = [2];

function deepEqual(a, b) {
  if (a === null && b === null) return true;
  if (a === undefined && b === undefined) return true;
  if (_typeof(a) !== "object") return a === b;
  var aIsArray = isArrayLike(a);
  var aIsMap = isMapLike(a);

  if (aIsArray !== isArrayLike(b)) {
    return false;
  } else if (aIsMap !== isMapLike(b)) {
    return false;
  } else if (aIsArray) {
    if (a.length !== b.length) return false;

    for (var i = a.length - 1; i >= 0; i--) {
      if (!deepEqual(a[i], b[i])) return false;
    }

    return true;
  } else if (aIsMap) {
    if (a.size !== b.size) return false;
    var equals_1 = true;
    a.forEach(function (value, key) {
      equals_1 = equals_1 && deepEqual(b.get(key), value);
    });
    return equals_1;
  } else if (_typeof(a) === "object" && _typeof(b) === "object") {
    if (a === null || b === null) return false;

    if (isMapLike(a) && isMapLike(b)) {
      if (a.size !== b.size) return false; // Freaking inefficient.... Create PR if you run into this :) Much appreciated!

      return deepEqual(observable.shallowMap(a).entries(), observable.shallowMap(b).entries());
    }

    if (getEnumerableKeys(a).length !== getEnumerableKeys(b).length) return false;

    for (var prop in a) {
      if (!(prop in b)) return false;
      if (!deepEqual(a[prop], b[prop])) return false;
    }

    return true;
  }

  return false;
}

deepEqual._r = [2];

function createInstanceofPredicate(name, clazz) {
  var propName = "isMobX" + name;
  clazz.prototype[propName] = true;
  return function (x) {
    return isObject(x) && x[propName] === true;
  };
}
/**
 * Returns whether the argument is an array, disregarding observability.
 */


createInstanceofPredicate._r = [2];

function isArrayLike(x) {
  return Array.isArray(x) || isObservableArray(x);
}

isArrayLike._r = [2];

function isMapLike(x) {
  return isES6Map(x) || isObservableMap(x);
}

isMapLike._r = [2];

function isES6Map(thing) {
  if (getGlobal().Map !== undefined && thing instanceof getGlobal().Map) return true;
  return false;
}

isES6Map._r = [2];

function primitiveSymbol() {
  return typeof Symbol === "function" && Symbol.toPrimitive || "@@toPrimitive";
}

primitiveSymbol._r = [2];

function toPrimitive(value) {
  return value === null ? null : _typeof(value) === "object" ? "" + value : value;
}
/**
 * These values will persist if global state is reset
 */


toPrimitive._r = [2];
var persistentKeys = ["mobxGuid", "resetId", "spyListeners", "strictMode", "runId"];

var MobXGlobals = function () {
  function MobXGlobals() {
    /**
     * MobXGlobals version.
     * MobX compatiblity with other versions loaded in memory as long as this version matches.
     * It indicates that the global state still stores similar information
     */
    this.version = 5;
    /**
     * Currently running derivation
     */

    this.trackingDerivation = null;
    /**
     * Are we running a computation currently? (not a reaction)
     */

    this.computationDepth = 0;
    /**
     * Each time a derivation is tracked, it is assigned a unique run-id
     */

    this.runId = 0;
    /**
     * 'guid' for general purpose. Will be persisted amongst resets.
     */

    this.mobxGuid = 0;
    /**
     * Are we in a batch block? (and how many of them)
     */

    this.inBatch = 0;
    /**
     * Observables that don't have observers anymore, and are about to be
     * suspended, unless somebody else accesses it in the same batch
     *
     * @type {IObservable[]}
     */

    this.pendingUnobservations = [];
    /**
     * List of scheduled, not yet executed, reactions.
     */

    this.pendingReactions = [];
    /**
     * Are we currently processing reactions?
     */

    this.isRunningReactions = false;
    /**
     * Is it allowed to change observables at this point?
     * In general, MobX doesn't allow that when running computations and React.render.
     * To ensure that those functions stay pure.
     */

    this.allowStateChanges = true;
    /**
     * If strict mode is enabled, state changes are by default not allowed
     */

    this.strictMode = false;
    /**
     * Used by createTransformer to detect that the global state has been reset.
     */

    this.resetId = 0;
    /**
     * Spy callbacks
     */

    this.spyListeners = [];
    /**
     * Globally attached error handlers that react specifically to errors in reactions
     */

    this.globalReactionErrorHandlers = [];
  }

  return MobXGlobals;
}();

var globalState = new MobXGlobals();
var shareGlobalStateCalled = false;
var runInIsolationCalled = false;
var warnedAboutMultipleInstances = false;
{
  var global_1 = getGlobal();

  if (!global_1.__mobxInstanceCount) {
    global_1.__mobxInstanceCount = 1;
  } else {
    global_1.__mobxInstanceCount++;
    setTimeout(function () {
      if (!shareGlobalStateCalled && !runInIsolationCalled && !warnedAboutMultipleInstances) {
        warnedAboutMultipleInstances = true;
        console.warn("[mobx] Warning: there are multiple mobx instances active. This might lead to unexpected results. See https://github.com/mobxjs/mobx/issues/1082 for details.");
      }
    });
  }
}

function isolateGlobalState() {
  runInIsolationCalled = true;
  getGlobal().__mobxInstanceCount--;
}

isolateGlobalState._r = [2];

function shareGlobalState() {
  // TODO: remove in 4.0; just use peer dependencies instead.
  deprecated("Using `shareGlobalState` is not recommended, use peer dependencies instead. See https://github.com/mobxjs/mobx/issues/1082 for details.");
  shareGlobalStateCalled = true;
  var global = getGlobal();
  var ownState = globalState;
  /**
   * Backward compatibility check
   */

  if (global.__mobservableTrackingStack || global.__mobservableViewStack) throw new Error("[mobx] An incompatible version of mobservable is already loaded.");
  if (global.__mobxGlobal && global.__mobxGlobal.version !== ownState.version) throw new Error("[mobx] An incompatible version of mobx is already loaded.");
  if (global.__mobxGlobal) globalState = global.__mobxGlobal;else global.__mobxGlobal = ownState;
}

shareGlobalState._r = [2];

function getGlobalState() {
  return globalState;
}
/**
 * For testing purposes only; this will break the internal state of existing observables,
 * but can be used to get back at a stable state after throwing errors
 */


getGlobalState._r = [2];

function resetGlobalState() {
  globalState.resetId++;
  var defaultGlobals = new MobXGlobals();

  for (var key in defaultGlobals) {
    if (persistentKeys.indexOf(key) === -1) globalState[key] = defaultGlobals[key];
  }

  globalState.allowStateChanges = !globalState.strictMode;
}

resetGlobalState._r = [2];

function hasObservers(observable) {
  return observable.observers && observable.observers.length > 0;
}

hasObservers._r = [2];

function getObservers(observable) {
  return observable.observers;
}

getObservers._r = [2];

function addObserver(observable, node) {
  // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
  // invariantObservers(observable);
  var l = observable.observers.length;

  if (l) {
    // because object assignment is relatively expensive, let's not store data about index 0.
    observable.observersIndexes[node.__mapid] = l;
  }

  observable.observers[l] = node;
  if (observable.lowestObserverState > node.dependenciesState) observable.lowestObserverState = node.dependenciesState; // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");
}

addObserver._r = [2];

function removeObserver(observable, node) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
  // invariantObservers(observable);
  if (observable.observers.length === 1) {
    // deleting last observer
    observable.observers.length = 0;
    queueForUnobservation(observable);
  } else {
    // deleting from _observersIndexes is straight forward, to delete from _observers, let's swap `node` with last element
    var list = observable.observers;
    var map = observable.observersIndexes;
    var filler = list.pop(); // get last element, which should fill the place of `node`, so the array doesn't have holes

    if (filler !== node) {
      // otherwise node was the last element, which already got removed from array
      var index = map[node.__mapid] || 0; // getting index of `node`. this is the only place we actually use map.

      if (index) {
        // map store all indexes but 0, see comment in `addObserver`
        map[filler.__mapid] = index;
      } else {
        delete map[filler.__mapid];
      }

      list[index] = filler;
    }

    delete map[node.__mapid];
  } // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");

}

removeObserver._r = [2];

function queueForUnobservation(observable) {
  if (!observable.isPendingUnobservation) {
    // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
    // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
    observable.isPendingUnobservation = true;
    globalState.pendingUnobservations.push(observable);
  }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */


queueForUnobservation._r = [2];

function startBatch() {
  globalState.inBatch++;
}

startBatch._r = [2];

function endBatch() {
  if (--globalState.inBatch === 0) {
    runReactions(); // the batch is actually about to finish, all unobserving should happen here.

    var list = globalState.pendingUnobservations;

    for (var i = 0; i < list.length; i++) {
      var observable = list[i];
      observable.isPendingUnobservation = false;

      if (observable.observers.length === 0) {
        observable.onBecomeUnobserved(); // NOTE: onBecomeUnobserved might push to `pendingUnobservations`
      }
    }

    globalState.pendingUnobservations = [];
  }
}

endBatch._r = [2];

function reportObserved(observable) {
  var derivation = globalState.trackingDerivation;

  if (derivation !== null) {
    /**
     * Simple optimization, give each derivation run an unique id (runId)
     * Check if last time this observable was accessed the same runId is used
     * if this is the case, the relation is already known
     */
    if (derivation.runId !== observable.lastAccessedBy) {
      observable.lastAccessedBy = derivation.runId;
      derivation.newObserving[derivation.unboundDepsCount++] = observable;
    }
  } else if (observable.observers.length === 0) {
    queueForUnobservation(observable);
  }
}
/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes


reportObserved._r = [2];

function propagateChanged(observable) {
  // invariantLOS(observable, "changed start");
  if (observable.lowestObserverState === IDerivationState.STALE) return;
  observable.lowestObserverState = IDerivationState.STALE;
  var observers = observable.observers;
  var i = observers.length;

  while (i--) {
    var d = observers[i];
    if (d.dependenciesState === IDerivationState.UP_TO_DATE) d.onBecomeStale();
    d.dependenciesState = IDerivationState.STALE;
  } // invariantLOS(observable, "changed end");

} // Called by ComputedValue when it recalculate and its value changed


propagateChanged._r = [2];

function propagateChangeConfirmed(observable) {
  // invariantLOS(observable, "confirmed start");
  if (observable.lowestObserverState === IDerivationState.STALE) return;
  observable.lowestObserverState = IDerivationState.STALE;
  var observers = observable.observers;
  var i = observers.length;

  while (i--) {
    var d = observers[i];
    if (d.dependenciesState === IDerivationState.POSSIBLY_STALE) d.dependenciesState = IDerivationState.STALE;else if (d.dependenciesState === IDerivationState.UP_TO_DATE // this happens during computing of `d`, just keep lowestObserverState up to date.
    ) observable.lowestObserverState = IDerivationState.UP_TO_DATE;
  } // invariantLOS(observable, "confirmed end");

} // Used by computed when its dependency changed, but we don't wan't to immediately recompute.


propagateChangeConfirmed._r = [2];

function propagateMaybeChanged(observable) {
  // invariantLOS(observable, "maybe start");
  if (observable.lowestObserverState !== IDerivationState.UP_TO_DATE) return;
  observable.lowestObserverState = IDerivationState.POSSIBLY_STALE;
  var observers = observable.observers;
  var i = observers.length;

  while (i--) {
    var d = observers[i];

    if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
      d.dependenciesState = IDerivationState.POSSIBLY_STALE;
      d.onBecomeStale();
    }
  } // invariantLOS(observable, "maybe end");

}

propagateMaybeChanged._r = [2];
var IDerivationState;

(function (IDerivationState) {
  // before being run or (outside batch and not being observed)
  // at this point derivation is not holding any data about dependency tree
  IDerivationState[IDerivationState["NOT_TRACKING"] = -1] = "NOT_TRACKING"; // no shallow dependency changed since last computation
  // won't recalculate derivation
  // this is what makes mobx fast

  IDerivationState[IDerivationState["UP_TO_DATE"] = 0] = "UP_TO_DATE"; // some deep dependency changed, but don't know if shallow dependency changed
  // will require to check first if UP_TO_DATE or POSSIBLY_STALE
  // currently only ComputedValue will propagate POSSIBLY_STALE
  //
  // having this state is second big optimization:
  // don't have to recompute on every dependency change, but only when it's needed

  IDerivationState[IDerivationState["POSSIBLY_STALE"] = 1] = "POSSIBLY_STALE"; // A shallow dependency has changed since last computation and the derivation
  // will need to recompute when it's needed next.

  IDerivationState[IDerivationState["STALE"] = 2] = "STALE";
})(IDerivationState || (IDerivationState = {}));

var CaughtException = function () {
  function CaughtException(cause) {
    this.cause = cause; // Empty
  }

  return CaughtException;
}();

function isCaughtException(e) {
  return e instanceof CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */


isCaughtException._r = [2];

function shouldCompute(derivation) {
  switch (derivation.dependenciesState) {
    case IDerivationState.UP_TO_DATE:
      return false;

    case IDerivationState.NOT_TRACKING:
    case IDerivationState.STALE:
      return true;

    case IDerivationState.POSSIBLY_STALE:
      {
        var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.

        var obs = derivation.observing,
            l = obs.length;

        for (var i = 0; i < l; i++) {
          var obj = obs[i];

          if (isComputedValue(obj)) {
            try {
              obj.get();
            } catch (e) {
              // we are not interested in the value *or* exception at this moment, but if there is one, notify all
              untrackedEnd(prevUntracked);
              return true;
            } // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
            // and `derivation` is an observer of `obj`


            if (derivation.dependenciesState === IDerivationState.STALE) {
              untrackedEnd(prevUntracked);
              return true;
            }
          }
        }

        changeDependenciesStateTo0(derivation);
        untrackedEnd(prevUntracked);
        return false;
      }
  }
}

shouldCompute._r = [2];

function isComputingDerivation() {
  return globalState.trackingDerivation !== null; // filter out actions inside computations
}

isComputingDerivation._r = [2];

function checkIfStateModificationsAreAllowed(atom) {
  var hasObservers$$1 = atom.observers.length > 0; // Should never be possible to change an observed observable from inside computed, see #798

  if (globalState.computationDepth > 0 && hasObservers$$1) fail(getMessage("m031") + atom.name); // Should not be possible to change observed state outside strict mode, except during initialization, see #563

  if (!globalState.allowStateChanges && hasObservers$$1) fail(getMessage(globalState.strictMode ? "m030a" : "m030b") + atom.name);
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */


checkIfStateModificationsAreAllowed._r = [2];

function trackDerivedFunction(derivation, f, context) {
  // pre allocate array allocation + room for variation in deps
  // array will be trimmed by bindDependencies
  changeDependenciesStateTo0(derivation);
  derivation.newObserving = new Array(derivation.observing.length + 100);
  derivation.unboundDepsCount = 0;
  derivation.runId = ++globalState.runId;
  var prevTracking = globalState.trackingDerivation;
  globalState.trackingDerivation = derivation;
  var result;

  try {
    result = f.call(context);
  } catch (e) {
    result = new CaughtException(e);
  }

  globalState.trackingDerivation = prevTracking;
  bindDependencies(derivation);
  return result;
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */


trackDerivedFunction._r = [2];

function bindDependencies(derivation) {
  // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
  var prevObserving = derivation.observing;
  var observing = derivation.observing = derivation.newObserving;
  var lowestNewObservingDerivationState = IDerivationState.UP_TO_DATE; // Go through all new observables and check diffValue: (this list can contain duplicates):
  //   0: first occurrence, change to 1 and keep it
  //   1: extra occurrence, drop it

  var i0 = 0,
      l = derivation.unboundDepsCount;

  for (var i = 0; i < l; i++) {
    var dep = observing[i];

    if (dep.diffValue === 0) {
      dep.diffValue = 1;
      if (i0 !== i) observing[i0] = dep;
      i0++;
    } // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
    // not hitting the condition


    if (dep.dependenciesState > lowestNewObservingDerivationState) {
      lowestNewObservingDerivationState = dep.dependenciesState;
    }
  }

  observing.length = i0;
  derivation.newObserving = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
  // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
  //   0: it's not in new observables, unobserve it
  //   1: it keeps being observed, don't want to notify it. change to 0

  l = prevObserving.length;

  while (l--) {
    var dep = prevObserving[l];

    if (dep.diffValue === 0) {
      removeObserver(dep, derivation);
    }

    dep.diffValue = 0;
  } // Go through all new observables and check diffValue: (now it should be unique)
  //   0: it was set to 0 in last loop. don't need to do anything.
  //   1: it wasn't observed, let's observe it. set back to 0


  while (i0--) {
    var dep = observing[i0];

    if (dep.diffValue === 1) {
      dep.diffValue = 0;
      addObserver(dep, derivation);
    }
  } // Some new observed derivations may become stale during this derivation computation
  // so they have had no chance to propagate staleness (#916)


  if (lowestNewObservingDerivationState !== IDerivationState.UP_TO_DATE) {
    derivation.dependenciesState = lowestNewObservingDerivationState;
    derivation.onBecomeStale();
  }
}

bindDependencies._r = [2];

function clearObserving(derivation) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
  var obs = derivation.observing;
  derivation.observing = [];
  var i = obs.length;

  while (i--) {
    removeObserver(obs[i], derivation);
  }

  derivation.dependenciesState = IDerivationState.NOT_TRACKING;
}

clearObserving._r = [2];

function untracked(action) {
  var prev = untrackedStart();
  var res = action();
  untrackedEnd(prev);
  return res;
}

untracked._r = [2];

function untrackedStart() {
  var prev = globalState.trackingDerivation;
  globalState.trackingDerivation = null;
  return prev;
}

untrackedStart._r = [2];

function untrackedEnd(prev) {
  globalState.trackingDerivation = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */


untrackedEnd._r = [2];

function changeDependenciesStateTo0(derivation) {
  if (derivation.dependenciesState === IDerivationState.UP_TO_DATE) return;
  derivation.dependenciesState = IDerivationState.UP_TO_DATE;
  var obs = derivation.observing;
  var i = obs.length;

  while (i--) {
    obs[i].lowestObserverState = IDerivationState.UP_TO_DATE;
  }
}

changeDependenciesStateTo0._r = [2];

var Reaction = function () {
  function Reaction(name, onInvalidate) {
    if (name === void 0) {
      name = "Reaction@" + getNextId();
    }

    this.name = name;
    this.onInvalidate = onInvalidate;
    this.observing = []; // nodes we are looking at. Our value depends on these nodes

    this.newObserving = [];
    this.dependenciesState = IDerivationState.NOT_TRACKING;
    this.diffValue = 0;
    this.runId = 0;
    this.unboundDepsCount = 0;
    this.__mapid = "#" + getNextId();
    this.isDisposed = false;
    this._isScheduled = false;
    this._isTrackPending = false;
    this._isRunning = false;
  }

  Reaction.prototype.onBecomeStale = function () {
    this.schedule();
  };

  Reaction.prototype.schedule = function () {
    if (!this._isScheduled) {
      this._isScheduled = true;
      globalState.pendingReactions.push(this);
      runReactions();
    }
  };

  Reaction.prototype.isScheduled = function () {
    return this._isScheduled;
  };
  /**
   * internal, use schedule() if you intend to kick off a reaction
   */


  Reaction.prototype.runReaction = function () {
    if (!this.isDisposed) {
      startBatch();
      this._isScheduled = false;

      if (shouldCompute(this)) {
        this._isTrackPending = true;
        this.onInvalidate();

        if (this._isTrackPending && isSpyEnabled()) {
          // onInvalidate didn't trigger track right away..
          spyReport({
            object: this,
            type: "scheduled-reaction"
          });
        }
      }

      endBatch();
    }
  };

  Reaction.prototype.track = function (fn) {
    startBatch();
    var notify = isSpyEnabled();
    var startTime;

    if (notify) {
      startTime = Date.now();
      spyReportStart({
        object: this,
        type: "reaction",
        fn: fn
      });
    }

    this._isRunning = true;
    var result = trackDerivedFunction(this, fn, undefined);
    this._isRunning = false;
    this._isTrackPending = false;

    if (this.isDisposed) {
      // disposed during last run. Clean up everything that was bound after the dispose call.
      clearObserving(this);
    }

    if (isCaughtException(result)) this.reportExceptionInDerivation(result.cause);

    if (notify) {
      spyReportEnd({
        time: Date.now() - startTime
      });
    }

    endBatch();
  };

  Reaction.prototype.reportExceptionInDerivation = function (error) {
    var _this = this;

    if (this.errorHandler) {
      this.errorHandler(error, this);
      return;
    }

    var message = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this;
    var messageToUser = getMessage("m037");
    console.error(message || messageToUser
    /* latter will not be true, make sure uglify doesn't remove */
    , error);
    /** If debugging brought you here, please, read the above message :-). Tnx! */

    if (isSpyEnabled()) {
      spyReport({
        type: "error",
        message: message,
        error: error,
        object: this
      });
    }

    globalState.globalReactionErrorHandlers.forEach(function (f) {
      return f(error, _this);
    });
  };

  Reaction.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;

      if (!this._isRunning) {
        // if disposed while running, clean up later. Maybe not optimal, but rare case
        startBatch();
        clearObserving(this);
        endBatch();
      }
    }
  };

  Reaction.prototype.getDisposer = function () {
    var r = this.dispose.bind(this);
    r.$mobx = this;
    r.onError = registerErrorHandler;
    return r;
  };

  Reaction.prototype.toString = function () {
    return "Reaction[" + this.name + "]";
  };

  Reaction.prototype.whyRun = function () {
    var observing = unique(this._isRunning ? this.newObserving : this.observing).map(function (dep) {
      return dep.name;
    });
    return "\nWhyRun? reaction '" + this.name + "':\n * Status: [" + (this.isDisposed ? "stopped" : this._isRunning ? "running" : this.isScheduled() ? "scheduled" : "idle") + "]\n * This reaction will re-run if any of the following observables changes:\n    " + joinStrings(observing) + "\n    " + (this._isRunning ? " (... or any observable accessed during the remainder of the current run)" : "") + "\n\t" + getMessage("m038") + "\n";
  };

  return Reaction;
}();

function registerErrorHandler(handler) {
  invariant(this && this.$mobx && isReaction(this.$mobx), "Invalid `this`");
  invariant(!this.$mobx.errorHandler, "Only one onErrorHandler can be registered");
  this.$mobx.errorHandler = handler;
}

registerErrorHandler._r = [2];

function onReactionError(handler) {
  globalState.globalReactionErrorHandlers.push(handler);
  return function () {
    var idx = globalState.globalReactionErrorHandlers.indexOf(handler);
    if (idx >= 0) globalState.globalReactionErrorHandlers.splice(idx, 1);
  };
}
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */


onReactionError._r = [2];
var MAX_REACTION_ITERATIONS = 100;

var reactionScheduler = function reactionScheduler(f) {
  return f();
};

reactionScheduler._r = [2];

function runReactions() {
  // Trampolining, if runReactions are already running, new reactions will be picked up
  if (globalState.inBatch > 0 || globalState.isRunningReactions) return;
  reactionScheduler(runReactionsHelper);
}

runReactions._r = [2];

function runReactionsHelper() {
  globalState.isRunningReactions = true;
  var allReactions = globalState.pendingReactions;
  var iterations = 0; // While running reactions, new reactions might be triggered.
  // Hence we work with two variables and check whether
  // we converge to no remaining reactions after a while.

  while (allReactions.length > 0) {
    if (++iterations === MAX_REACTION_ITERATIONS) {
      console.error("Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." + (" Probably there is a cycle in the reactive function: " + allReactions[0]));
      allReactions.splice(0); // clear reactions
    }

    var remainingReactions = allReactions.splice(0);

    for (var i = 0, l = remainingReactions.length; i < l; i++) {
      remainingReactions[i].runReaction();
    }
  }

  globalState.isRunningReactions = false;
}

runReactionsHelper._r = [2];
var isReaction = createInstanceofPredicate("Reaction", Reaction);

function setReactionScheduler(fn) {
  var baseScheduler = reactionScheduler;

  reactionScheduler = function reactionScheduler(f) {
    return fn(function () {
      return baseScheduler(f);
    });
  };
}

setReactionScheduler._r = [2];

function asReference(value) {
  deprecated("asReference is deprecated, use observable.ref instead");
  return observable.ref(value);
}

asReference._r = [2];

function asStructure(value) {
  deprecated("asStructure is deprecated. Use observable.struct, computed.struct or reaction options instead.");
  return observable.struct(value);
}

asStructure._r = [2];

function asFlat(value) {
  deprecated("asFlat is deprecated, use observable.shallow instead");
  return observable.shallow(value);
}

asFlat._r = [2];

function asMap(data) {
  deprecated("asMap is deprecated, use observable.map or observable.shallowMap instead");
  return observable.map(data || {});
}

asMap._r = [2];

function createComputedDecorator(equals) {
  return createClassPropertyDecorator(function (target, name, _, __, originalDescriptor) {
    invariant(typeof originalDescriptor !== "undefined", getMessage("m009"));
    invariant(typeof originalDescriptor.get === "function", getMessage("m010"));
    var adm = asObservableObject(target, "");
    defineComputedProperty(adm, name, originalDescriptor.get, originalDescriptor.set, equals, false);
  }, function (name) {
    var observable = this.$mobx.values[name];
    if (observable === undefined // See #505
    ) return undefined;
    return observable.get();
  }, function (name, value) {
    this.$mobx.values[name].set(value);
  }, false, false);
}

createComputedDecorator._r = [2];
var computedDecorator = createComputedDecorator(comparer.default);
var computedStructDecorator = createComputedDecorator(comparer.structural);
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */

var computed = function computed(arg1, arg2, arg3) {
  if (typeof arg2 === "string") {
    return computedDecorator.apply(null, arguments);
  }

  invariant(typeof arg1 === "function", getMessage("m011"));
  invariant(arguments.length < 3, getMessage("m012"));
  var opts = _typeof(arg2) === "object" ? arg2 : {};
  opts.setter = typeof arg2 === "function" ? arg2 : opts.setter;
  var equals = opts.equals ? opts.equals : opts.compareStructural || opts.struct ? comparer.structural : comparer.default;
  return new ComputedValue(arg1, opts.context, equals, opts.name || arg1.name || "", opts.setter);
};

computed._r = [2];
computed.struct = computedStructDecorator;
computed.equals = createComputedDecorator;

function getAtom(thing, property) {
  if (_typeof(thing) === "object" && thing !== null) {
    if (isObservableArray(thing)) {
      invariant(property === undefined, getMessage("m036"));
      return thing.$mobx.atom;
    }

    if (isObservableMap(thing)) {
      var anyThing = thing;
      if (property === undefined) return getAtom(anyThing._keys);
      var observable = anyThing._data[property] || anyThing._hasMap[property];
      invariant(!!observable, "the entry '" + property + "' does not exist in the observable map '" + getDebugName(thing) + "'");
      return observable;
    } // Initializers run lazily when transpiling to babel, so make sure they are run...


    runLazyInitializers(thing);
    if (property && !thing.$mobx) thing[property]; // See #1072 // TODO: remove in 4.0

    if (isObservableObject(thing)) {
      if (!property) return fail("please specify a property");
      var observable = thing.$mobx.values[property];
      invariant(!!observable, "no observable property '" + property + "' found on the observable object '" + getDebugName(thing) + "'");
      return observable;
    }

    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
      return thing;
    }
  } else if (typeof thing === "function") {
    if (isReaction(thing.$mobx)) {
      // disposer function
      return thing.$mobx;
    }
  }

  return fail("Cannot obtain atom from " + thing);
}

getAtom._r = [2];

function getAdministration(thing, property) {
  invariant(thing, "Expecting some object");
  if (property !== undefined) return getAdministration(getAtom(thing, property));
  if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) return thing;
  if (isObservableMap(thing)) return thing; // Initializers run lazily when transpiling to babel, so make sure they are run...

  runLazyInitializers(thing);
  if (thing.$mobx) return thing.$mobx;
  invariant(false, "Cannot obtain administration from " + thing);
}

getAdministration._r = [2];

function getDebugName(thing, property) {
  var named;
  if (property !== undefined) named = getAtom(thing, property);else if (isObservableObject(thing) || isObservableMap(thing)) named = getAdministration(thing);else named = getAtom(thing); // valid for arrays as well

  return named.name;
}

getDebugName._r = [2];

function isComputed(value, property) {
  if (value === null || value === undefined) return false;

  if (property !== undefined) {
    if (isObservableObject(value) === false) return false;
    var atom = getAtom(value, property);
    return isComputedValue(atom);
  }

  return isComputedValue(value);
}

isComputed._r = [2];

function observe(thing, propOrCb, cbOrFire, fireImmediately) {
  if (typeof cbOrFire === "function") return observeObservableProperty(thing, propOrCb, cbOrFire, fireImmediately);else return observeObservable(thing, propOrCb, cbOrFire);
}

observe._r = [2];

function observeObservable(thing, listener, fireImmediately) {
  return getAdministration(thing).observe(listener, fireImmediately);
}

observeObservable._r = [2];

function observeObservableProperty(thing, property, listener, fireImmediately) {
  return getAdministration(thing, property).observe(listener, fireImmediately);
}

observeObservableProperty._r = [2];

function intercept(thing, propOrHandler, handler) {
  if (typeof handler === "function") return interceptProperty(thing, propOrHandler, handler);else return interceptInterceptable(thing, propOrHandler);
}

intercept._r = [2];

function interceptInterceptable(thing, handler) {
  return getAdministration(thing).intercept(handler);
}

interceptInterceptable._r = [2];

function interceptProperty(thing, property, handler) {
  return getAdministration(thing, property).intercept(handler);
}
/**
 * expr can be used to create temporarily views inside views.
 * This can be improved to improve performance if a value changes often, but usually doesn't affect the outcome of an expression.
 *
 * In the following example the expression prevents that a component is rerender _each time_ the selection changes;
 * instead it will only rerenders when the current todo is (de)selected.
 *
 * reactiveComponent((props) => {
 *     const todo = props.todo;
 *     const isSelected = mobx.expr(() => props.viewState.selection === todo);
 *     return <div className={isSelected ? "todo todo-selected" : "todo"}>{todo.title}</div>
 * });
 *
 */


interceptProperty._r = [2];

function expr(expr, scope) {
  if (!isComputingDerivation()) console.warn(getMessage("m013")); // optimization: would be more efficient if the expr itself wouldn't be evaluated first on the next change, but just a 'changed' signal would be fired

  return computed(expr, {
    context: scope
  }).get();
}

expr._r = [2];

function toJS(source, detectCycles, __alreadySeen) {
  if (detectCycles === void 0) {
    detectCycles = true;
  }

  if (__alreadySeen === void 0) {
    __alreadySeen = [];
  } // optimization: using ES6 map would be more efficient!
  // optimization: lift this function outside toJS, this makes recursion expensive


  function cache(value) {
    if (detectCycles) __alreadySeen.push([source, value]);
    return value;
  }

  if (isObservable(source)) {
    if (detectCycles && __alreadySeen === null) __alreadySeen = [];

    if (detectCycles && source !== null && _typeof(source) === "object") {
      for (var i = 0, l = __alreadySeen.length; i < l; i++) {
        if (__alreadySeen[i][0] === source) return __alreadySeen[i][1];
      }
    }

    if (isObservableArray(source)) {
      var res = cache([]);
      var toAdd = source.map(function (value) {
        return toJS(value, detectCycles, __alreadySeen);
      });
      res.length = toAdd.length;

      for (var i = 0, l = toAdd.length; i < l; i++) {
        res[i] = toAdd[i];
      }

      return res;
    }

    if (isObservableObject(source)) {
      var res = cache({});

      for (var key in source) {
        res[key] = toJS(source[key], detectCycles, __alreadySeen);
      }

      return res;
    }

    if (isObservableMap(source)) {
      var res_1 = cache({});
      source.forEach(function (value, key) {
        return res_1[key] = toJS(value, detectCycles, __alreadySeen);
      });
      return res_1;
    }

    if (isObservableValue(source)) return toJS(source.get(), detectCycles, __alreadySeen);
  }

  return source;
}

toJS._r = [2];

function createTransformer(transformer, onCleanup) {
  invariant(typeof transformer === "function" && transformer.length < 2, "createTransformer expects a function that accepts one argument"); // Memoizes: object id -> reactive view that applies transformer to the object

  var objectCache = {}; // If the resetId changes, we will clear the object cache, see #163
  // This construction is used to avoid leaking refs to the objectCache directly

  var resetId = globalState.resetId; // Local transformer class specifically for this transformer

  var Transformer = function (_super) {
    __extends(Transformer, _super);

    function Transformer(sourceIdentifier, sourceObject) {
      var _this = _super.call(this, function () {
        return transformer(sourceObject);
      }, undefined, comparer.default, "Transformer-" + transformer.name + "-" + sourceIdentifier, undefined) || this;

      _this.sourceIdentifier = sourceIdentifier;
      _this.sourceObject = sourceObject;
      return _this;
    }

    Transformer.prototype.onBecomeUnobserved = function () {
      var lastValue = this.value;

      _super.prototype.onBecomeUnobserved.call(this);

      delete objectCache[this.sourceIdentifier];
      if (onCleanup) onCleanup(lastValue, this.sourceObject);
    };

    return Transformer;
  }(ComputedValue);

  return function (object) {
    if (resetId !== globalState.resetId) {
      objectCache = {};
      resetId = globalState.resetId;
    }

    var identifier = getMemoizationId(object);
    var reactiveTransformer = objectCache[identifier];
    if (reactiveTransformer) return reactiveTransformer.get(); // Not in cache; create a reactive view

    reactiveTransformer = objectCache[identifier] = new Transformer(identifier, object);
    return reactiveTransformer.get();
  };
}

createTransformer._r = [2];

function getMemoizationId(object) {
  if (typeof object === "string" || typeof object === "number") return object;
  if (object === null || _typeof(object) !== "object") throw new Error("[mobx] transform expected some kind of object or primitive value, got: " + object);
  var tid = object.$transformId;

  if (tid === undefined) {
    tid = getNextId();
    addHiddenProp(object, "$transformId", tid);
  }

  return tid;
}

getMemoizationId._r = [2];

function log(msg) {
  console.log(msg);
  return msg;
}

log._r = [2];

function whyRun(thing, prop) {
  switch (arguments.length) {
    case 0:
      thing = globalState.trackingDerivation;
      if (!thing) return log(getMessage("m024"));
      break;

    case 2:
      thing = getAtom(thing, prop);
      break;
  }

  thing = getAtom(thing);
  if (isComputedValue(thing)) return log(thing.whyRun());else if (isReaction(thing)) return log(thing.whyRun());
  return fail(getMessage("m025"));
}

whyRun._r = [2];

function getDependencyTree(thing, property) {
  return nodeToDependencyTree(getAtom(thing, property));
}

getDependencyTree._r = [2];

function nodeToDependencyTree(node) {
  var result = {
    name: node.name
  };
  if (node.observing && node.observing.length > 0) result.dependencies = unique(node.observing).map(nodeToDependencyTree);
  return result;
}

nodeToDependencyTree._r = [2];

function getObserverTree(thing, property) {
  return nodeToObserverTree(getAtom(thing, property));
}

getObserverTree._r = [2];

function nodeToObserverTree(node) {
  var result = {
    name: node.name
  };
  if (hasObservers(node)) result.observers = getObservers(node).map(nodeToObserverTree);
  return result;
}

nodeToObserverTree._r = [2];

function interceptReads(thing, propOrHandler, handler) {
  var target;

  if (isObservableMap(thing) || isObservableArray(thing) || isObservableValue(thing)) {
    target = getAdministration(thing);
  } else if (isObservableObject(thing)) {
    if (typeof propOrHandler !== "string") return fail("InterceptReads can only be used with a specific property, not with an object in general");
    target = getAdministration(thing, propOrHandler);
  } else {
    return fail("Expected observable map, object or array as first array");
  }

  if (target.dehancer !== undefined) return fail("An intercept reader was already established");
  target.dehancer = typeof propOrHandler === "function" ? propOrHandler : handler;
  return function () {
    target.dehancer = undefined;
  };
}
/**
 * (c) Michel Weststrate 2015 - 2016
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get an global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */


interceptReads._r = [2];
var extras = {
  allowStateChanges: allowStateChanges,
  deepEqual: deepEqual,
  getAtom: getAtom,
  getDebugName: getDebugName,
  getDependencyTree: getDependencyTree,
  getAdministration: getAdministration,
  getGlobalState: getGlobalState,
  getObserverTree: getObserverTree,
  interceptReads: interceptReads,
  isComputingDerivation: isComputingDerivation,
  isSpyEnabled: isSpyEnabled,
  onReactionError: onReactionError,
  reserveArrayBuffer: reserveArrayBuffer,
  resetGlobalState: resetGlobalState,
  isolateGlobalState: isolateGlobalState,
  shareGlobalState: shareGlobalState,
  spyReport: spyReport,
  spyReportEnd: spyReportEnd,
  spyReportStart: spyReportStart,
  setReactionScheduler: setReactionScheduler
};
var everything = {
  Reaction: Reaction,
  untracked: untracked,
  Atom: Atom,
  BaseAtom: BaseAtom,
  useStrict: useStrict,
  isStrictModeEnabled: isStrictModeEnabled,
  spy: spy,
  comparer: comparer,
  asReference: asReference,
  asFlat: asFlat,
  asStructure: asStructure,
  asMap: asMap,
  isModifierDescriptor: isModifierDescriptor,
  isObservableObject: isObservableObject,
  isBoxedObservable: isObservableValue,
  isObservableArray: isObservableArray,
  ObservableMap: ObservableMap,
  isObservableMap: isObservableMap,
  map: map,
  transaction: transaction,
  observable: observable,
  computed: computed,
  isObservable: isObservable,
  isComputed: isComputed,
  extendObservable: extendObservable,
  extendShallowObservable: extendShallowObservable,
  observe: observe,
  intercept: intercept,
  autorun: autorun,
  autorunAsync: autorunAsync,
  when: when,
  reaction: reaction,
  action: action,
  isAction: isAction,
  runInAction: runInAction,
  expr: expr,
  toJS: toJS,
  createTransformer: createTransformer,
  whyRun: whyRun,
  isArrayLike: isArrayLike,
  extras: extras
};
var warnedAboutDefaultExport = false;

var _loop_1 = function _loop_1(p) {
  var val = everything[p];
  Object.defineProperty(everything, p, {
    get: function get$$1() {
      if (!warnedAboutDefaultExport) {
        warnedAboutDefaultExport = true;
        console.warn("Using default export (`import mobx from 'mobx'`) is deprecated " + "and won’t work in mobx@4.0.0\n" + "Use `import * as mobx from 'mobx'` instead");
      }

      return val;
    }
  });
};

_loop_1._r = [2];

for (var p in everything) {
  _loop_1(p);
}

if ((typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "undefined" ? "undefined" : _typeof(__MOBX_DEVTOOLS_GLOBAL_HOOK__)) === "object") {
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: spy,
    extras: extras
  });
}



var mobx_module = Object.freeze({
	extras: extras,
	Reaction: Reaction,
	untracked: untracked,
	get IDerivationState () { return IDerivationState; },
	Atom: Atom,
	BaseAtom: BaseAtom,
	useStrict: useStrict,
	isStrictModeEnabled: isStrictModeEnabled,
	spy: spy,
	comparer: comparer,
	asReference: asReference,
	asFlat: asFlat,
	asStructure: asStructure,
	asMap: asMap,
	isModifierDescriptor: isModifierDescriptor,
	isObservableObject: isObservableObject,
	isBoxedObservable: isObservableValue,
	isObservableArray: isObservableArray,
	ObservableMap: ObservableMap,
	isObservableMap: isObservableMap,
	map: map,
	transaction: transaction,
	observable: observable,
	IObservableFactories: IObservableFactories,
	computed: computed,
	isObservable: isObservable,
	isComputed: isComputed,
	extendObservable: extendObservable,
	extendShallowObservable: extendShallowObservable,
	observe: observe,
	intercept: intercept,
	autorun: autorun,
	autorunAsync: autorunAsync,
	when: when,
	reaction: reaction,
	action: action,
	isAction: isAction,
	runInAction: runInAction,
	expr: expr,
	toJS: toJS,
	createTransformer: createTransformer,
	whyRun: whyRun,
	isArrayLike: isArrayLike,
	default: everything
});

var mobx = ( mobx_module && everything ) || mobx_module;

var dist$3 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopDefault(ex) {
    return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  var Component = _interopDefault(infernoComponent);

  var createClass$$1 = _interopDefault(infernoCreateClass);

  var hoistStatics = _interopDefault(hoistNonInfernoStatics);
  /**
   * @module Inferno-Shared
   */

  /** TypeDoc Comment */


  var ERROR_MSG = "a runtime error occured! Use Inferno in development environment to find the error.";

  function throwError(message) {
    if (!message) {
      message = ERROR_MSG;
    }

    throw new Error("Inferno Error: " + message);
  }

  function warning(message) {
    // tslint:disable-next-line:no-console
    console.warn(message);
  }
  /**
   * @module Inferno-Mobx
   */

  /** TypeDoc Comment */

  /**
   * Store Injection
   */


  function createStoreInjector(grabStoresFn, component, injectNames) {
    var displayName = "inject-" + (component.displayName || component.name || component.constructor && component.constructor.name || "Unknown");

    if (injectNames) {
      displayName += "-with-" + injectNames;
    }

    var Injector = createClass$$1({
      displayName: displayName,
      render: function render() {
        var this$1 = this;
        var newProps = {};

        for (var key in this$1.props) {
          if (this$1.props.hasOwnProperty(key)) {
            newProps[key] = this$1.props[key];
          }
        }

        var additionalProps = grabStoresFn(this.context.mobxStores || {}, newProps, this.context) || {};

        for (var key$1 in additionalProps) {
          newProps[key$1] = additionalProps[key$1];
        }

        newProps.ref = function (instance) {
          this$1.wrappedComponent = instance;
        };

        return inferno.createVNode(16
        /* ComponentUnknown */
        , component, null, null, newProps);
      }
    });
    Injector.contextTypes = {
      // tslint:disable-next-line:no-empty
      mobxStores: function mobxStores() {}
    };
    hoistStatics(Injector, component);
    return Injector;
  }

  var grabStoresByName = function grabStoresByName(storeNames) {
    return function (baseStores, nextProps) {
      storeNames.forEach(function (storeName) {
        // Prefer props over stores
        if (storeName in nextProps) {
          return;
        }

        if (!(storeName in baseStores)) {
          throw new Error("MobX observer: Store '" + storeName + "' is not available! " + "Make sure it is provided by some Provider");
        }

        nextProps[storeName] = baseStores[storeName];
      });
      return nextProps;
    };
  };
  /**
   * Higher order component that injects stores to a child.
   * takes either a varargs list of strings, which are stores read from the context,
   * or a function that manually maps the available stores from the context to props:
   * storesToProps(mobxStores, props, context) => newProps
   */


  grabStoresByName._r = [2];

  function inject(grabStoresFn) {
    var arguments$1 = arguments;

    if (typeof grabStoresFn !== "function") {
      var storesNames = [];

      for (var i = 0, len = arguments.length; i < len; i++) {
        storesNames[i] = arguments$1[i];
      }

      grabStoresFn = grabStoresByName(storesNames);
    }

    return function (componentClass) {
      return createStoreInjector(grabStoresFn, componentClass);
    };
  }
  /**
   * @module Inferno-Mobx
   */

  /** TypeDoc Comment */


  var EventEmitter = function EventEmitter() {
    this.listeners = [];
  };

  EventEmitter._r = [2];

  EventEmitter.prototype.on = function on$$1(cb) {
    var this$1 = this;
    this.listeners.push(cb);
    return function () {
      var index = this$1.listeners.indexOf(cb);

      if (index !== -1) {
        this$1.listeners.splice(index, 1);
      }
    };
  };

  EventEmitter.prototype.emit = function emit$$1(data) {
    var listeners = this.listeners;

    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i](data);
    }
  };

  EventEmitter.prototype.getTotalListeners = function getTotalListeners() {
    return this.listeners.length;
  };

  EventEmitter.prototype.clearListeners = function clearListeners() {
    this.listeners = [];
  };
  /**
   * @module Inferno-Mobx
   */

  /** TypeDoc Comment */

  /**
   * Dev tools support
   */


  var isDevtoolsEnabled = false;
  var isUsingStaticRendering = false;
  var componentByNodeRegistery = new WeakMap();
  var renderReporter = new EventEmitter();

  function reportRendering(component) {
    var node = component._vNode.dom;

    if (node && componentByNodeRegistery) {
      componentByNodeRegistery.set(node, component);
    }

    renderReporter.emit({
      component: component,
      event: "render",
      node: node,
      renderTime: component.__$mobRenderEnd - component.__$mobRenderStart,
      totalTime: Date.now() - component.__$mobRenderStart
    });
  }

  function trackComponents() {
    if (typeof WeakMap === "undefined") {
      throwError("[inferno-mobx] tracking components is not supported in this browser.");
    }

    if (!isDevtoolsEnabled) {
      isDevtoolsEnabled = true;
    }
  }

  function useStaticRendering(boolean) {
    isUsingStaticRendering = boolean;
  }

  function scuMobx(nextProps, nextState) {
    var this$1 = this;

    if (isUsingStaticRendering) {
      warning("[inferno-mobx] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.");
    } // Update on any state changes (as is the default)


    if (this.state !== nextState) {
      return true;
    } // Update if props are shallowly not equal, inspired by PureRenderMixin


    var keys = Object.keys(this.props);

    if (keys.length !== Object.keys(nextProps).length) {
      return true;
    }

    for (var i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      var newValue = nextProps[key];

      if (newValue !== this$1.props[key]) {
        return true;
      } else if (newValue && _typeof(newValue) === "object" && !mobx.isObservable(newValue)) {
        // If the newValue is still the same object, but that object is not observable,
        // fallback to the default behavior: update, because the object *might* have changed.
        return true;
      }
    }

    return false;
  }

  function makeReactive(componentClass) {
    var target = componentClass.prototype || componentClass;
    var baseDidMount = target.componentDidMount;
    var baseWillMount = target.componentWillMount;
    var baseUnmount = target.componentWillUnmount;

    target.componentWillMount = function () {
      var this$1 = this;

      if (isUsingStaticRendering === true) {
        return;
      } // Call original


      if (baseWillMount) {
        baseWillMount.call(this);
      }

      var reaction;
      var isRenderingPending = false;
      var initialName = this.displayName || this.name || this.constructor && (this.constructor.displayName || this.constructor.name) || "<component>";
      var baseRender = this.render.bind(this);

      var initialRender = function initialRender(nextProps, nextContext) {
        reaction = new mobx.Reaction(initialName + ".render()", function () {
          if (!isRenderingPending) {
            isRenderingPending = true;

            if (this$1.__$mobxIsUnmounted !== true) {
              var hasError = true;

              try {
                Component.prototype.forceUpdate.call(this$1);
                hasError = false;
              } finally {
                if (hasError) {
                  reaction.dispose();
                }
              }
            }
          }
        });
        reactiveRender.$mobx = reaction;
        this$1.render = reactiveRender;
        return reactiveRender(nextProps, nextContext);
      };

      initialRender._r = [2];

      var reactiveRender = function reactiveRender(nextProps, nextContext) {
        isRenderingPending = false;
        var rendering;
        reaction.track(function () {
          if (isDevtoolsEnabled) {
            this$1.__$mobRenderStart = Date.now();
          }

          rendering = mobx.extras.allowStateChanges(false, baseRender.bind(this$1, nextProps, nextContext));

          if (isDevtoolsEnabled) {
            this$1.__$mobRenderEnd = Date.now();
          }
        });
        return rendering;
      };

      reactiveRender._r = [2];
      this.render = initialRender;
    };

    target.componentDidMount = function () {
      if (isDevtoolsEnabled) {
        reportRendering(this);
      } // Call original


      if (baseDidMount) {
        baseDidMount.call(this);
      }
    };

    target.componentWillUnmount = function () {
      if (isUsingStaticRendering === true) {
        return;
      } // Call original


      if (baseUnmount) {
        baseUnmount.call(this);
      } // Dispose observables


      if (this.render.$mobx) {
        this.render.$mobx.dispose();
      }

      this.__$mobxIsUnmounted = true;

      if (isDevtoolsEnabled) {
        var node = this._vNode.dom;

        if (node && componentByNodeRegistery) {
          componentByNodeRegistery.delete(node);
        }

        renderReporter.emit({
          component: this,
          event: "destroy",
          node: node
        });
      }
    };

    if (!target.shouldComponentUpdate) {
      target.shouldComponentUpdate = scuMobx;
    }

    return componentClass;
  }
  /**
   * @module Inferno-Mobx
   */

  /** TypeDoc Comment */

  /**
   * Wraps a component and provides stores as props
   */


  function connect(arg1, arg2) {
    if (typeof arg1 === "string") {
      throwError("Store names should be provided as array");
    }

    if (Array.isArray(arg1)) {
      // component needs stores
      if (!arg2) {
        // invoked as decorator
        return function (_componentClass) {
          return connect(arg1, _componentClass);
        };
      } else {
        // TODO: deprecate this invocation style
        return inject.apply(null, arg1)(connect(arg2));
      }
    }

    var componentClass = arg1; // Stateless function component:
    // If it is function but doesn't seem to be a Inferno class constructor,
    // wrap it to a Inferno class automatically

    if (typeof componentClass === "function" && (!componentClass.prototype || !componentClass.prototype.render) && !componentClass.isReactClass && !Component.isPrototypeOf(componentClass)) {
      var newClass = createClass$$1({
        contextTypes: componentClass.contextTypes,
        displayName: componentClass.displayName || componentClass.name,
        getDefaultProps: function getDefaultProps() {
          return componentClass.defaultProps;
        },
        propTypes: componentClass.propTypes,
        render: function render() {
          return componentClass.call(this, this.props, this.context);
        }
      });
      return connect(newClass);
    }

    if (!componentClass) {
      throwError('Please pass a valid component to "connect"');
    }

    componentClass.isMobXReactObserver = true;
    return makeReactive(componentClass);
  }
  /**
   * @module Inferno-Mobx
   */

  /** TypeDoc Comment */


  var specialKeys = {
    children: true,
    key: true,
    ref: true
  };

  var Provider = function (Component$$1) {
    function Provider(props, context) {
      Component$$1.call(this, props, context);
      this.contextTypes = {
        // tslint:disable-next-line:no-empty
        mobxStores: function mobxStores() {}
      };
      this.childContextTypes = {
        // tslint:disable-next-line:no-empty
        mobxStores: function mobxStores() {}
      };
      this.store = props.store;
    }

    if (Component$$1) Provider.__proto__ = Component$$1;
    Provider.prototype = Object.create(Component$$1 && Component$$1.prototype);
    Provider.prototype.constructor = Provider;

    Provider.prototype.render = function render() {
      return this.props.children;
    };

    Provider.prototype.getChildContext = function getChildContext() {
      var this$1 = this;
      var stores = {}; // inherit stores

      var baseStores = this.context.mobxStores;

      if (baseStores) {
        for (var key in baseStores) {
          stores[key] = baseStores[key];
        }
      } // add own stores


      for (var key$1 in this$1.props) {
        if (!specialKeys[key$1] && key$1 !== "suppressChangedStoreWarning") {
          stores[key$1] = this$1.props[key$1];
        }
      }

      return {
        mobxStores: stores
      };
    };

    return Provider;
  }(Component);

  var index = {
    EventEmitter: EventEmitter,
    Provider: Provider,
    componentByNodeRegistery: componentByNodeRegistery,
    connect: connect,
    inject: inject,
    observer: connect,
    renderReporter: renderReporter,
    trackComponents: trackComponents,
    useStaticRendering: useStaticRendering
  };
  exports['default'] = index;
  exports.EventEmitter = EventEmitter;
  exports.Provider = Provider;
  exports.componentByNodeRegistery = componentByNodeRegistery;
  exports.observer = connect;
  exports.connect = connect;
  exports.inject = inject;
  exports.renderReporter = renderReporter;
  exports.trackComponents = trackComponents;
  exports.useStaticRendering = useStaticRendering;
});

var infernoMobx$1 = createCommonjsModule(function (module) {
  module.exports = dist$3.default;
  module.exports.default = module.exports;
});
var infernoMobx_1 = infernoMobx$1.observer;

function uuid() {
  var uuid = '';

  for (var i = 0; i < 32; i++) {
    var random = Math.random() * 16 | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }

    uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
  }

  return uuid;
}
uuid._r = [2];
function pluralize(count, word) {
  return count === 1 ? word : word + 's';
}
pluralize._r = [2, [Number, String]];
var AbstractLocationStore =
/*#__PURE__*/
function () {
  function AbstractLocationStore() {}

  var _proto = AbstractLocationStore.prototype;

  _proto.location = function location(key, value, force) {
    throw new Error('implement');
  };

  return AbstractLocationStore;
}();
var BrowserLocationStore =
/*#__PURE__*/
function (_AbstractLocationStor) {
  inheritsLoose(BrowserLocationStore, _AbstractLocationStor);

  function BrowserLocationStore(location, history) {
    var _this;

    _this = _AbstractLocationStor.call(this) || this;
    _this._location = void 0;
    _this._history = void 0;
    _this._ns = 'mobx_app';
    _this._location = location;
    _this._history = history;
    return _this;
  }

  var _proto2 = BrowserLocationStore.prototype;

  _proto2._params = function _params() {
    return new URLSearchParams(this._location.search);
  };

  _proto2.location = function location(key, value, force) {
    var params = this._params();

    if (value === undefined) return params.get(key);
    params.set(key, value);

    this._history.pushState(null, this._ns, "?" + params.toString());

    return value;
  };

  return BrowserLocationStore;
}(AbstractLocationStore);
BrowserLocationStore._r = [0, [Location, History]];

var _class2;
var _descriptor;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var TodoModel =
/*#__PURE__*/
function () {
  function TodoModel(todo, store) {
    var _this = this;

    if (todo === void 0) {
      todo = {};
    }

    this.completed = void 0;
    this._title = void 0;
    this.id = void 0;
    this._store = void 0;

    this.destroy = function () {
      _this._store.remove(_this.id);
    };

    this.toggle = function () {
      _this.completed = !_this.completed;

      _this._store.saveTodo(_this.toJSON());
    };

    this._title = todo.title || '';
    this.id = todo.id || uuid();
    this.completed = todo.completed || false;
    this._store = store;
  }

  var _proto = TodoModel.prototype;

  _proto.toJSON = function toJSON() {
    return {
      completed: this.completed,
      title: this._title,
      id: this.id
    };
  };

  createClass(TodoModel, [{
    key: "title",
    get: function get$$1() {
      return this._title;
    },
    set: function set$$1(t) {
      this._title = t;

      this._store.saveTodo(this.toJSON());
    }
  }]);
  return TodoModel;
}();

TodoModel._r = [0, [TodoService]];
var TodoService = (_class2 =
/*#__PURE__*/
function () {
  function TodoService() {
    var _this2 = this;

    _initDefineProp(this, "todos", _descriptor, this);

    this.addTodo = action(function (title) {
      var todo = new TodoModel({
        title: title
      }, _this2);

      var newTodos = _this2.todos.slice(0);

      newTodos.push(todo);
      _this2.todos = newTodos;
    });
    this.saveTodo = action(function (todo) {
      _this2.todos = _this2.todos.map(function (t, i) {
        return t.id === todo.id ? new TodoModel(todo, _this2) : t;
      });
    });
    this.remove = action(function (id) {
      _this2.todos = _this2.todos.filter(function (todo) {
        return todo.id !== id;
      });
    });
    this.toggleAll = action(function () {
      var completed = _this2.activeTodoCount > 0;
      _this2.todos = _this2.todos.map(function (todo, i) {
        return new TodoModel({
          title: todo.title,
          id: todo.id,
          completed: completed
        }, _this2);
      });
    });
    this.clearCompleted = action(function () {
      var newTodos = [];
      var delIds = [];

      for (var i = 0; i < _this2.todos.length; i++) {
        var _todo = _this2.todos[i];

        if (_todo.completed) {
          delIds.push(_todo.id);
        } else {
          newTodos.push(_todo);
        }
      }

      _this2.todos = newTodos;
    });
  }

  createClass(TodoService, [{
    key: "activeTodoCount",
    get: function get$$1() {
      return this.todos.reduce(function (sum, todo) {
        return sum + (todo.completed ? 0 : 1);
      }, 0);
    }
  }, {
    key: "completedCount",
    get: function get$$1() {
      return this.todos.length - this.activeTodoCount;
    }
  }]);
  return TodoService;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "todos", [observable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class2.prototype, "activeTodoCount", [computed], Object.getOwnPropertyDescriptor(_class2.prototype, "activeTodoCount"), _class2.prototype)), _class2);

var _class;

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var TODO_FILTER = {
  ALL: 'all',
  COMPLETE: 'complete',
  ACTIVE: 'active'
};
var TodoFilterService = (_class =
/*#__PURE__*/
function () {
  function TodoFilterService(todoService, locationStore) {
    this._todoService = void 0;
    this._locationStore = void 0;
    this._todoService = todoService;
    this._locationStore = locationStore;
  }

  createClass(TodoFilterService, [{
    key: "filter",
    get: function get$$1() {
      return this._locationStore.location('todo_filter') || TODO_FILTER.ALL;
    },
    set: function set$$1(filter) {
      return this._locationStore.location('todo_filter', filter);
    }
  }, {
    key: "filteredTodos",
    get: function get$$1() {
      var todos = this._todoService.todos;

      switch (this.filter) {
        case TODO_FILTER.ALL:
          return todos;
        // .filter((todo: ITodo) => !todo.deleted)

        case TODO_FILTER.COMPLETE:
          return todos.filter(function (todo) {
            return !!todo.completed;
          });

        case TODO_FILTER.ACTIVE:
          return todos.filter(function (todo) {
            return !todo.completed;
          });

        default:
          throw new Error("Unknown filter value: " + this.filter);
      }
    }
  }]);
  return TodoFilterService;
}(), (_applyDecoratedDescriptor$1(_class.prototype, "filteredTodos", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "filteredTodos"), _class.prototype)), _class);
TodoFilterService._r = [0, [TodoService, AbstractLocationStore]];

var _class2$1;
var _descriptor$1;

function _initDefineProp$1(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var ENTER_KEY = 13;
var TodoHeaderService = (_class2$1 = function TodoHeaderService(todoService) {
  var _this = this;

  _initDefineProp$1(this, "title", _descriptor$1, this);

  this._todoService = void 0;

  this.onInput = function ({
    target: target
  }) {
    _this.title = target.value;
  };

  this.onKeyDown = function (e) {
    if (e.keyCode === ENTER_KEY && _this.title) {
      e.preventDefault();

      var text = _this.title.trim();

      if (text) {
        _this._todoService.addTodo(text);

        _this.title = '';
      }
    }
  };

  this._todoService = todoService;
}, (_descriptor$1 = _applyDecoratedDescriptor$2(_class2$1.prototype, "title", [observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
})), _class2$1);
TodoHeaderService._r = [0, [TodoService]];

function TodoHeaderView({
  todoHeaderService: todoHeaderService
}) {
  return lom_h("header", {
    id: "header"
  }, lom_h("h1", null, "todos"), lom_h("input", {
    id: "new-todo",
    placeholder: "What needs to be done?",
    onInput: todoHeaderService.onInput,
    value: todoHeaderService.title,
    onKeyDown: todoHeaderService.onKeyDown,
    autoFocus: true
  }));
}

TodoHeaderView._r = [1];
var TodoHeaderView$1 = infernoMobx_1(TodoHeaderView);

var ALL_TODOS = 'all';
var ACTIVE_TODOS = 'active';
var COMPLETED_TODOS = 'completed';
function TodoFooterView({
  nowShowing: nowShowing,
  count: count,
  completedCount: completedCount,
  onClearCompleted: onClearCompleted
}) {
  return lom_h("footer", {
    id: "footer"
  }, lom_h("span", {
    id: "todo-count"
  }, lom_h("strong", null, count), " ", pluralize(count, 'item'), " left"), lom_h("ul", {
    id: "filters"
  }, lom_h("li", null, lom_h("a", {
    href: "./?todo_filter=all",
    className: {
      selected: nowShowing === ALL_TODOS
    }
  }, "All")), "\xA0", lom_h("li", null, lom_h("a", {
    href: "./?todo_filter=active",
    className: {
      selected: nowShowing === ACTIVE_TODOS
    }
  }, "Active")), "\xA0", lom_h("li", null, lom_h("a", {
    href: "./?todo_filter=completed",
    className: {
      selected: nowShowing === COMPLETED_TODOS
    }
  }, "Completed"))), completedCount > 0 ? lom_h("button", {
    id: "clear-completed",
    onClick: onClearCompleted
  }, "Clear completed") : null);
}
TodoFooterView._r = [1];

var _class$1;
var _descriptor$2;
var _descriptor2;

function _initDefineProp$2(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$3(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var ESCAPE_KEY = 27;
var ENTER_KEY$1 = 13;
var TodoItemService = (_class$1 = function TodoItemService() {
  var _this = this;

  _initDefineProp$2(this, "editingId", _descriptor$2, this);

  _initDefineProp$2(this, "editText", _descriptor2, this);

  this._todo = void 0;

  this.beginEdit = function (todo) {
    _this._todo = todo;
    _this.editText = todo.title;
    _this.editingId = todo.id;
  };

  this.setFocus = function (el) {
    if (el) {
      setTimeout(function () {
        return el.focus();
      }, 0);
    }
  };

  this.setEditText = action(function (e) {
    _this.editText = e.target.value;
  });
  this.cancel = action(function () {
    _this.editText = '';
    _this.editingId = null;
  });
  this.submit = action(function () {
    _this._todo.title = _this.editText;
    _this.editText = '';
    _this.editingId = null;
  });
  this.onKey = action(function (e) {
    if (e.which === ESCAPE_KEY) {
      _this.cancel();
    } else if (e.which === ENTER_KEY$1) {
      _this.submit();
    }
  });
}, (_descriptor$2 = _applyDecoratedDescriptor$3(_class$1.prototype, "editingId", [observable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor$3(_class$1.prototype, "editText", [observable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
})), _class$1);
var todoItemService = new TodoItemService();

function TodoItemView({
  todo: todo
}) {
  var editing = todoItemService.editingId === todo.id;
  return lom_h("li", {
    className: "" + (todo.completed ? 'completed ' : ' ') + (editing ? 'editing' : '')
  }, lom_h("div", {
    className: "view"
  }, lom_h("input", {
    className: "toggle",
    type: "checkbox",
    checked: todo.completed || 0,
    onClick: todo.toggle
  }), lom_h("label", {
    onDblClick: function onDblClick() {
      return todoItemService.beginEdit(todo);
    }
  }, todo.title), lom_h("button", {
    className: "destroy",
    onClick: todo.destroy
  })), editing ? lom_h("input", {
    ref: todoItemService.setFocus,
    className: "edit",
    value: todoItemService.editingId && todoItemService.editText || todo.title,
    onBlur: todoItemService.submit,
    onInput: todoItemService.setEditText,
    onKeyDown: todoItemService.onKey
  }) : null);
}

TodoItemView._r = [1];
var TodoItemView$1 = infernoMobx_1(TodoItemView);

function TodoPerfView({
  todoService: todoService,
  todoFilterService: todoFilterService,
  todoHeaderService: todoHeaderService
}) {
  var todos = todoService.todos;
  return lom_h("div", null, lom_h(TodoHeaderView$1, {
    todoHeaderService: todoHeaderService
  }), todos.length ? lom_h("section", {
    id: "main"
  }, lom_h("input", {
    id: "toggle-all",
    type: "checkbox",
    onChange: todoService.toggleAll,
    checked: todoService.activeTodoCount === 0
  }), lom_h("ul", {
    id: "todo-list"
  }, todoFilterService.filteredTodos.map(function (todo) {
    return lom_h(TodoItemView$1, {
      key: todo.id,
      todo: todo
    });
  }))) : null, todoService.activeTodoCount || todoService.completedCount ? lom_h(TodoFooterView, {
    count: todoService.activeTodoCount,
    completedCount: todoService.completedCount,
    nowShowing: todoFilterService.filter,
    onClearCompleted: todoService.clearCompleted
  }) : null);
}

TodoPerfView._r = [1];
var TodoPerfView$1 = infernoMobx_1(TodoPerfView);

var todoService = new TodoService();
var browserLocationStore = new BrowserLocationStore(location, history);
var todoFilterService = new TodoFilterService(todoService, browserLocationStore);
var todoHeaderService = new TodoHeaderService(todoService);
global$1['lom_h'] = infernoCompat_2;
infernoCompat_1(lom_h(TodoPerfView$1, {
  todoHeaderService: todoHeaderService,
  todoService: todoService,
  todoFilterService: todoFilterService
}), document.getElementById('todoapp'));

}());
//# sourceMappingURL=bundle.js.map
