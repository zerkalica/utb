(function () {
'use strict';

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





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

/** Virtual DOM Node */
function VNode() {}
/** Global options
 *	@public
 *	@namespace options {Object}
 */


VNode._r = [2];
var options = {
  /** If `true`, `prop` changes trigger synchronous component updates.
   *	@name syncComponentUpdates
   *	@type Boolean
   *	@default true
   */
  //syncComponentUpdates: true,

  /** Processes all created VNodes.
   *	@param {VNode} vnode	A newly-created VNode to normalize/process
   */
  //vnode(vnode) { }

  /** Hook invoked after a component is mounted. */
  // afterMount(component) { }

  /** Hook invoked after the DOM is updated with a component's latest render. */
  // afterUpdate(component) { }

  /** Hook invoked immediately before a component is unmounted. */
  // beforeUnmount(component) { }
};
var stack = [];
var EMPTY_CHILDREN = [];
/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */

function h(nodeName, attributes) {
  var children = EMPTY_CHILDREN,
      lastSimple,
      child,
      simple,
      i;

  for (i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  if (attributes && attributes.children != null) {
    if (!stack.length) stack.push(attributes.children);
    delete attributes.children;
  }

  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--;) {
        stack.push(child[i]);
      }
    } else {
      if (typeof child === 'boolean') child = null;

      if (simple = typeof nodeName !== 'function') {
        if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
      }

      if (simple && lastSimple) {
        children[children.length - 1] += child;
      } else if (children === EMPTY_CHILDREN) {
        children = [child];
      } else {
        children.push(child);
      }

      lastSimple = simple;
    }
  }

  var p = new VNode();
  p.nodeName = nodeName;
  p.children = children;
  p.attributes = attributes == null ? undefined : attributes;
  p.key = attributes == null ? undefined : attributes.key; // if a "vnode hook" is defined, pass every created VNode to it

  if (options.vnode !== undefined) options.vnode(p);
  return p;
}
/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */


h._r = [2];

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }

  return obj;
}
/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */


extend._r = [2];
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
  return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
} // DOM properties that should NOT have "px" added when numeric


cloneElement._r = [2];
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
  if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    (options.debounceRendering || defer)(rerender);
  }
}

enqueueRender._r = [2];

function rerender() {
  var p,
      list = items;
  items = [];

  while (p = list.pop()) {
    if (p._dirty) renderComponent(p);
  }
}
/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */


rerender._r = [2];

function isSameNodeType(node, vnode, hydrating) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.splitText !== undefined;
  }

  if (typeof vnode.nodeName === 'string') {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  }

  return hydrating || node._componentConstructor === vnode.nodeName;
}
/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
 */


isSameNodeType._r = [2];

function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}
/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */


isNamedNode._r = [2];

function getNodeProps(vnode) {
  var props = extend({}, vnode.attributes);
  props.children = vnode.children;
  var defaultProps = vnode.nodeName.defaultProps;

  if (defaultProps !== undefined) {
    for (var i in defaultProps) {
      if (props[i] === undefined) {
        props[i] = defaultProps[i];
      }
    }
  }

  return props;
}
/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */


getNodeProps._r = [2];

function createNode(nodeName, isSvg) {
  var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
  node.normalizedNodeName = nodeName;
  return node;
}
/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */


createNode._r = [2];

function removeNode(node) {
  var parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}
/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */


removeNode._r = [2];

function setAccessor(node, name, old, value, isSvg) {
  if (name === 'className') name = 'class';

  if (name === 'key') {// ignore
  } else if (name === 'ref') {
    if (old) old(null);
    if (value) value(node);
  } else if (name === 'class' && !isSvg) {
    node.className = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old === 'string') {
      node.style.cssText = value || '';
    }

    if (value && _typeof(value) === 'object') {
      if (typeof old !== 'string') {
        for (var i in old) {
          if (!(i in value)) node.style[i] = '';
        }
      }

      for (var i in value) {
        node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
      }
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (value) node.innerHTML = value.__html || '';
  } else if (name[0] == 'o' && name[1] == 'n') {
    var useCapture = name !== (name = name.replace(/Capture$/, ''));
    name = name.toLowerCase().substring(2);

    if (value) {
      if (!old) node.addEventListener(name, eventProxy, useCapture);
    } else {
      node.removeEventListener(name, eventProxy, useCapture);
    }

    (node._listeners || (node._listeners = {}))[name] = value;
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    setProperty(node, name, value == null ? '' : value);
    if (value == null || value === false) node.removeAttribute(name);
  } else {
    var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));

    if (value == null || value === false) {
      if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    } else if (typeof value !== 'function') {
      if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    }
  }
}
/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */


setAccessor._r = [2];

function setProperty(node, name, value) {
  try {
    node[name] = value;
  } catch (e) {}
}
/** Proxy an event to hooked event handlers
 *	@private
 */


setProperty._r = [2];

function eventProxy(e) {
  return this._listeners[e.type](options.event && options.event(e) || e);
}
/** Queue of components that have been mounted and are awaiting componentDidMount */


eventProxy._r = [2];
var mounts = [];
/** Diff recursion count, used to track the end of the diff cycle. */

var diffLevel = 0;
/** Global flag indicating if the diff is currently within an SVG */

var isSvgMode = false;
/** Global flag indicating if the diff is performing hydration */

var hydrating = false;
/** Invoke queued componentDidMount lifecycle methods */

function flushMounts() {
  var c;

  while (c = mounts.pop()) {
    if (options.afterMount) options.afterMount(c);
    if (c.componentDidMount) c.componentDidMount();
  }
}
/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */


flushMounts._r = [2];

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
  // diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
  if (!diffLevel++) {
    // when first starting the diff, check if we're diffing an SVG or within an SVG
    isSvgMode = parent != null && parent.ownerSVGElement !== undefined; // hydration is indicated by the existing element to be diffed not having a prop cache

    hydrating = dom != null && !('__preactattr_' in dom);
  }

  var ret = idiff(dom, vnode, context, mountAll, componentRoot); // append the element if its a new parent

  if (parent && ret.parentNode !== parent) parent.appendChild(ret); // diffLevel being reduced to 0 means we're exiting the diff

  if (! --diffLevel) {
    hydrating = false; // invoke queued componentDidMount lifecycle methods

    if (!componentRoot) flushMounts();
  }

  return ret;
}
/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */


diff._r = [2];

function idiff(dom, vnode, context, mountAll, componentRoot) {
  var out = dom,
      prevSvgMode = isSvgMode; // empty values (null, undefined, booleans) render as empty Text nodes

  if (vnode == null || typeof vnode === 'boolean') vnode = ''; // Fast case: Strings & Numbers create/update Text nodes.

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    // update if it's already a Text node:
    if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
      /* istanbul ignore if */

      /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
      if (dom.nodeValue != vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      // it wasn't a Text node: replace it with one and recycle the old Element
      out = document.createTextNode(vnode);

      if (dom) {
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
        recollectNodeTree(dom, true);
      }
    }

    out['__preactattr_'] = true;
    return out;
  } // If the VNode represents a Component, perform a component diff:


  var vnodeName = vnode.nodeName;

  if (typeof vnodeName === 'function') {
    return buildComponentFromVNode(dom, vnode, context, mountAll);
  } // Tracks entering and exiting SVG namespace when descending through the tree.


  isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode; // If there's no existing element or it's the wrong type, create a new one:

  vnodeName = String(vnodeName);

  if (!dom || !isNamedNode(dom, vnodeName)) {
    out = createNode(vnodeName, isSvgMode);

    if (dom) {
      // move children into the replacement node
      while (dom.firstChild) {
        out.appendChild(dom.firstChild);
      } // if the previous Element was mounted into the DOM, replace it inline


      if (dom.parentNode) dom.parentNode.replaceChild(out, dom); // recycle the old element (skips non-Element node types)

      recollectNodeTree(dom, true);
    }
  }

  var fc = out.firstChild,
      props = out['__preactattr_'],
      vchildren = vnode.children;

  if (props == null) {
    props = out['__preactattr_'] = {};

    for (var a = out.attributes, i = a.length; i--;) {
      props[a[i].name] = a[i].value;
    }
  } // Optimization: fast-path for elements containing a single TextNode:


  if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    if (fc.nodeValue != vchildren[0]) {
      fc.nodeValue = vchildren[0];
    }
  } // otherwise, if there are existing or new children, diff them:
  else if (vchildren && vchildren.length || fc != null) {
      innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
    } // Apply attributes/props from VNode to the DOM Element:


  diffAttributes(out, vnode.attributes, props); // restore previous SVG mode: (in case we're exiting an SVG namespace)

  isSvgMode = prevSvgMode;
  return out;
}
/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */


idiff._r = [2];

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
  var originalChildren = dom.childNodes,
      children = [],
      keyed = {},
      keyedLen = 0,
      min = 0,
      len = originalChildren.length,
      childrenLen = 0,
      vlen = vchildren ? vchildren.length : 0,
      j,
      c,
      f,
      vchild,
      child; // Build up a map of keyed children and an Array of unkeyed children:

  if (len !== 0) {
    for (var i = 0; i < len; i++) {
      var _child = originalChildren[i],
          props = _child['__preactattr_'],
          key = vlen && props ? _child._component ? _child._component.__key : props.key : null;

      if (key != null) {
        keyedLen++;
        keyed[key] = _child;
      } else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
        children[childrenLen++] = _child;
      }
    }
  }

  if (vlen !== 0) {
    for (var i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null; // attempt to find a node based on key matching

      var key = vchild.key;

      if (key != null) {
        if (keyedLen && keyed[key] !== undefined) {
          child = keyed[key];
          keyed[key] = undefined;
          keyedLen--;
        }
      } // attempt to pluck a node of the same type from the existing children
      else if (!child && min < childrenLen) {
          for (j = min; j < childrenLen; j++) {
            if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
              child = c;
              children[j] = undefined;
              if (j === childrenLen - 1) childrenLen--;
              if (j === min) min++;
              break;
            }
          }
        } // morph the matched/found/created DOM child to match vchild (deep)


      child = idiff(child, vchild, context, mountAll);
      f = originalChildren[i];

      if (child && child !== dom && child !== f) {
        if (f == null) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  } // remove unused keyed children:


  if (keyedLen) {
    for (var i in keyed) {
      if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    }
  } // remove orphaned unkeyed children:


  while (min <= childrenLen) {
    if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
  }
}
/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */


innerDiffNode._r = [2];

function recollectNodeTree(node, unmountOnly) {
  var component = node._component;

  if (component) {
    // if node is owned by a Component, unmount that component (ends up recursing back here)
    unmountComponent(component);
  } else {
    // If the node's VNode had a ref function, invoke it with null here.
    // (this is part of the React spec, and smart for unsetting references)
    if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

    if (unmountOnly === false || node['__preactattr_'] == null) {
      removeNode(node);
    }

    removeChildren(node);
  }
}
/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */


recollectNodeTree._r = [2];

function removeChildren(node) {
  node = node.lastChild;

  while (node) {
    var next = node.previousSibling;
    recollectNodeTree(node, true);
    node = next;
  }
}
/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */


removeChildren._r = [2];

function diffAttributes(dom, attrs, old) {
  var name; // remove attributes no longer present on the vnode by setting them to undefined

  for (name in old) {
    if (!(attrs && attrs[name] != null) && old[name] != null) {
      setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    }
  } // add new & update changed attributes


  for (name in attrs) {
    if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
      setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
  }
}
/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */


diffAttributes._r = [2];
var components = {};
/** Reclaim a component for later re-use by the recycler. */

function collectComponent(component) {
  var name = component.constructor.name;
  (components[name] || (components[name] = [])).push(component);
}
/** Create a component. Normalizes differences between PFC's and classful Components. */


collectComponent._r = [2];

function createComponent(Ctor, props, context) {
  var list = components[Ctor.name],
      inst;

  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props, context);
    Component.call(inst, props, context);
  } else {
    inst = new Component(props, context);
    inst.constructor = Ctor;
    inst.render = doRender;
  }

  if (list) {
    for (var i = list.length; i--;) {
      if (list[i].constructor === Ctor) {
        inst.nextBase = list[i].nextBase;
        list.splice(i, 1);
        break;
      }
    }
  }

  return inst;
}
/** The `.render()` method for a PFC backing instance. */


createComponent._r = [2];

function doRender(props, state, context) {
  return this.constructor(props, context);
}
/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */


doRender._r = [2];

function setComponentProps(component, props, opts, context, mountAll) {
  if (component._disable) return;
  component._disable = true;
  if (component.__ref = props.ref) delete props.ref;
  if (component.__key = props.key) delete props.key;

  if (!component.base || mountAll) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props, context);
  }

  if (context && context !== component.context) {
    if (!component.prevContext) component.prevContext = component.context;
    component.context = context;
  }

  if (!component.prevProps) component.prevProps = component.props;
  component.props = props;
  component._disable = false;

  if (opts !== 0) {
    if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
      renderComponent(component, 1, mountAll);
    } else {
      enqueueRender(component);
    }
  }

  if (component.__ref) component.__ref(component);
}
/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */


setComponentProps._r = [2];

function renderComponent(component, opts, mountAll, isChild) {
  if (component._disable) return;
  var props = component.props,
      state = component.state,
      context = component.context,
      previousProps = component.prevProps || props,
      previousState = component.prevState || state,
      previousContext = component.prevContext || context,
      isUpdate = component.base,
      nextBase = component.nextBase,
      initialBase = isUpdate || nextBase,
      initialChildComponent = component._component,
      skip = false,
      rendered,
      inst,
      cbase; // if updating

  if (isUpdate) {
    component.props = previousProps;
    component.state = previousState;
    component.context = previousContext;

    if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
      skip = true;
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state, context);
    }

    component.props = props;
    component.state = state;
    component.context = context;
  }

  component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
  component._dirty = false;

  if (!skip) {
    rendered = component.render(props, state, context); // context to pass to the child, can be updated via (grand-)parent component

    if (component.getChildContext) {
      context = extend(extend({}, context), component.getChildContext());
    }

    var childComponent = rendered && rendered.nodeName,
        toUnmount,
        base;

    if (typeof childComponent === 'function') {
      // set up high order component link
      var childProps = getNodeProps(rendered);
      inst = initialChildComponent;

      if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
        setComponentProps(inst, childProps, 1, context, false);
      } else {
        toUnmount = inst;
        component._component = inst = createComponent(childComponent, childProps, context);
        inst.nextBase = inst.nextBase || nextBase;
        inst._parentComponent = component;
        setComponentProps(inst, childProps, 0, context, false);
        renderComponent(inst, 1, mountAll, true);
      }

      base = inst.base;
    } else {
      cbase = initialBase; // destroy high order component link

      toUnmount = initialChildComponent;

      if (toUnmount) {
        cbase = component._component = null;
      }

      if (initialBase || opts === 1) {
        if (cbase) cbase._component = null;
        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
      }
    }

    if (initialBase && base !== initialBase && inst !== initialChildComponent) {
      var baseParent = initialBase.parentNode;

      if (baseParent && base !== baseParent) {
        baseParent.replaceChild(base, initialBase);

        if (!toUnmount) {
          initialBase._component = null;
          recollectNodeTree(initialBase, false);
        }
      }
    }

    if (toUnmount) {
      unmountComponent(toUnmount);
    }

    component.base = base;

    if (base && !isChild) {
      var componentRef = component,
          t = component;

      while (t = t._parentComponent) {
        (componentRef = t).base = base;
      }

      base._component = componentRef;
      base._componentConstructor = componentRef.constructor;
    }
  }

  if (!isUpdate || mountAll) {
    mounts.unshift(component);
  } else if (!skip) {
    // Ensure that pending componentDidMount() hooks of child components
    // are called before the componentDidUpdate() hook in the parent.
    // Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
    // flushMounts();
    if (component.componentDidUpdate) {
      component.componentDidUpdate(previousProps, previousState, previousContext);
    }

    if (options.afterUpdate) options.afterUpdate(component);
  }

  if (component._renderCallbacks != null) {
    while (component._renderCallbacks.length) {
      component._renderCallbacks.pop().call(component);
    }
  }

  if (!diffLevel && !isChild) flushMounts();
}
/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */


renderComponent._r = [2];

function buildComponentFromVNode(dom, vnode, context, mountAll) {
  var c = dom && dom._component,
      originalComponent = c,
      oldDom = dom,
      isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
      isOwner = isDirectOwner,
      props = getNodeProps(vnode);

  while (c && !isOwner && (c = c._parentComponent)) {
    isOwner = c.constructor === vnode.nodeName;
  }

  if (c && isOwner && (!mountAll || c._component)) {
    setComponentProps(c, props, 3, context, mountAll);
    dom = c.base;
  } else {
    if (originalComponent && !isDirectOwner) {
      unmountComponent(originalComponent);
      dom = oldDom = null;
    }

    c = createComponent(vnode.nodeName, props, context);

    if (dom && !c.nextBase) {
      c.nextBase = dom; // passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:

      oldDom = null;
    }

    setComponentProps(c, props, 1, context, mountAll);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      recollectNodeTree(oldDom, false);
    }
  }

  return dom;
}
/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */


buildComponentFromVNode._r = [2];

function unmountComponent(component) {
  if (options.beforeUnmount) options.beforeUnmount(component);
  var base = component.base;
  component._disable = true;
  if (component.componentWillUnmount) component.componentWillUnmount();
  component.base = null; // recursively tear down & recollect high-order component children:

  var inner = component._component;

  if (inner) {
    unmountComponent(inner);
  } else if (base) {
    if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);
    component.nextBase = base;
    removeNode(base);
    collectComponent(component);
    removeChildren(base);
  }

  if (component.__ref) component.__ref(null);
}
/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */


unmountComponent._r = [2];

function Component(props, context) {
  this._dirty = true;
  /** @public
   *	@type {object}
   */

  this.context = context;
  /** @public
   *	@type {object}
   */

  this.props = props;
  /** @public
   *	@type {object}
   */

  this.state = this.state || {};
}

Component._r = [2];
extend(Component.prototype, {
  /** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
   *	@param {object} nextProps
   *	@param {object} nextState
   *	@param {object} nextContext
   *	@returns {Boolean} should the component re-render
   *	@name shouldComponentUpdate
   *	@function
   */

  /** Update component state by copying properties from `state` to `this.state`.
   *	@param {object} state		A hash of state properties to update with new values
   *	@param {function} callback	A function to be called once component state is updated
   */
  setState: function setState(state, callback) {
    var s = this.state;
    if (!this.prevState) this.prevState = extend({}, s);
    extend(s, typeof state === 'function' ? state(s, this.props) : state);
    if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
    enqueueRender(this);
  },

  /** Immediately perform a synchronous re-render of the component.
   *	@param {function} callback		A function to be called after component is re-rendered.
   *	@private
   */
  forceUpdate: function forceUpdate(callback) {
    if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
    renderComponent(this, 2);
  },

  /** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
   *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
   *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
   *	@param {object} state		The component's current state
   *	@param {object} context		Context object (if a parent component has provided context)
   *	@returns VNode
   */
  render: function render() {}
});
/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

render._r = [2];
var preact = {
  h: h,
  createElement: h,
  cloneElement: cloneElement,
  Component: Component,
  render: render,
  rerender: rerender,
  options: options
};


var preact_esm = Object.freeze({
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options,
	default: preact
});

function warning(condition, message) {
  if (!condition) {
    console.error(message);
  }
}

warning._r = [2];
var warning_1 = warning;

function throwError(message) {
  throw new Error("MobX-Preact Error: " + message);
}

throwError._r = [2];
var throwError_1 = throwError;
var shared = {
  warning: warning_1,
  throwError: throwError_1
};

var preact_1 = ( preact_esm && preact ) || preact_esm;

var Provider_1 = createCommonjsModule(function (module, exports) {
  "use strict";

  var __extends = commonjsGlobal && commonjsGlobal.__extends || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };

  var specialKeys = {
    children: true,
    key: true,
    ref: true
  };

  function childOnly(children) {
    if (children.length > 1) {
      throw new Error('Provider can only have one direct child');
    }

    return children.length ? children[0] : children;
  }

  var Provider = function (_super) {
    __extends(Provider, _super);

    function Provider(props, context) {
      var _this = _super.call(this, props, context) || this;

      _this.contextTypes = {
        mobxStores: function mobxStores() {}
      };
      _this.childContextTypes = {
        mobxStores: function mobxStores() {}
      };
      _this.store = props.store;
      return _this;
    }

    Provider.prototype.render = function () {
      return childOnly(this.props.children);
    };

    Provider.prototype.getChildContext = function () {
      var stores = {}; // inherit stores

      var baseStores = this.context.mobxStores;

      if (baseStores) {
        for (var key in baseStores) {
          stores[key] = baseStores[key];
        }
      } // add own stores


      for (var key in this.props) {
        if (!specialKeys[key]) {
          stores[key] = this.props[key];
        }
      }

      return {
        mobxStores: stores
      };
    };

    return Provider;
  }(preact_1.Component);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Provider;

  
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

var EventEmitter_1 = createCommonjsModule(function (module, exports) {
  "use strict";

  var EventEmitter = function () {
    function EventEmitter() {
      this.listeners = [];
    }

    EventEmitter.prototype.on = function (cb) {
      var _this = this;

      this.listeners.push(cb);
      return function () {
        var index = _this.listeners.indexOf(cb);

        if (index !== -1) {
          _this.listeners.splice(index, 1);
        }
      };
    };

    EventEmitter.prototype.emit = function (data) {
      this.listeners.forEach(function (fn) {
        return fn(data);
      });
    };

    

    EventEmitter.prototype.getTotalListeners = function () {
      return this.listeners.length;
    };

    EventEmitter.prototype.clearListeners = function () {
      this.listeners = [];
    };

    return EventEmitter;
  }();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = EventEmitter;
});

var mobx_1 = ( mobx_module && everything ) || mobx_module;

var makeReactive_1 = createCommonjsModule(function (module, exports) {
  "use strict";
  /**
   * Dev tools support
   */

  var isDevtoolsEnabled = false;
  exports.componentByNodeRegistery = new WeakMap();
  exports.renderReporter = new EventEmitter_1.default();

  function reportRendering(component) {
    var node = component._vNode.dom;

    if (node && exports.componentByNodeRegistery) {
      exports.componentByNodeRegistery.set(node, component);
    }

    exports.renderReporter.emit({
      event: 'render',
      renderTime: component.__$mobRenderEnd - component.__$mobRenderStart,
      totalTime: Date.now() - component.__$mobRenderStart,
      component: component,
      node: node
    });
  }

  function trackComponents() {
    if (typeof WeakMap === 'undefined') {
      shared.throwError('[inferno-mobx] tracking components is not supported in this browser.');
    }

    if (!isDevtoolsEnabled) {
      isDevtoolsEnabled = true;
    }
  }

  exports.trackComponents = trackComponents;

  function makeReactive(componentClass) {
    var target = componentClass.prototype || componentClass;
    var baseDidMount = target.componentDidMount;
    var baseWillMount = target.componentWillMount;
    var baseUnmount = target.componentWillUnmount;

    target.componentWillMount = function () {
      var _this = this; // Call original


      baseWillMount && baseWillMount.call(this);
      var reaction;
      var isRenderingPending = false;
      var initialName = this.displayName || this.name || this.constructor && (this.constructor.displayName || this.constructor.name) || '<component>';
      var baseRender = this.render.bind(this);

      var initialRender = function initialRender(nextProps, nextContext) {
        reaction = new mobx_1.Reaction(initialName + ".render()", function () {
          if (!isRenderingPending) {
            isRenderingPending = true;

            if (_this.__$mobxIsUnmounted !== true) {
              var hasError = true;

              try {
                preact_1.Component.prototype.forceUpdate.call(_this);
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
        _this.render = reactiveRender;
        return reactiveRender(nextProps, nextContext);
      };

      initialRender._r = [2];

      var reactiveRender = function reactiveRender(nextProps, nextContext) {
        isRenderingPending = false;
        var rendering = undefined;
        reaction.track(function () {
          if (isDevtoolsEnabled) {
            _this.__$mobRenderStart = Date.now();
          }

          rendering = mobx_1.extras.allowStateChanges(false, baseRender.bind(_this, nextProps, nextContext));

          if (isDevtoolsEnabled) {
            _this.__$mobRenderEnd = Date.now();
          }
        });
        return rendering;
      };

      reactiveRender._r = [2];
      this.render = initialRender;
    };

    target.componentDidMount = function () {
      isDevtoolsEnabled && reportRendering(this); // Call original

      baseDidMount && baseDidMount.call(this);
    };

    target.componentWillUnmount = function () {
      // Call original
      baseUnmount && baseUnmount.call(this); // Dispose observables

      this.render.$mobx && this.render.$mobx.dispose();
      this.__$mobxIsUnmounted = true;

      if (isDevtoolsEnabled) {
        var node = this._vNode.dom;

        if (node && exports.componentByNodeRegistery) {
          exports.componentByNodeRegistery.delete(node);
        }

        exports.renderReporter.emit({
          event: 'destroy',
          component: this,
          node: node
        });
      }
    };

    target.shouldComponentUpdate = function (nextProps, nextState) {
      // Update on any state changes (as is the default)
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

        if (newValue !== this.props[key]) {
          return true;
        } else if (newValue && _typeof(newValue) === 'object' && !mobx_1.isObservable(newValue)) {
          // If the newValue is still the same object, but that object is not observable,
          // fallback to the default behavior: update, because the object *might* have changed.
          return true;
        }
      }

      return true;
    };

    return componentClass;
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = makeReactive;
});

var dist = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
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

  exports.default = function (obj) {
    function preactComponent() {
      preact_1.Component.apply(this, arguments); // auto-bind methods to the component


      for (var i in obj) {
        if (i !== 'render' && typeof obj[i] === 'function') {
          this[i] = obj[i].bind(this);
        }
      }

      if (obj.init) {
        obj.init.call(this);
      }
    }

    preactComponent.prototype = _extends(Object.create(preact_1.Component.prototype), obj);
    preactComponent.prototype.constructor = preactComponent;
    return preactComponent;
  };
});

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  mixins: true,
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

var hoistNonReactStatics = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    var keys = Object.getOwnPropertyNames(sourceComponent);
    /* istanbul ignore else */

    if (isGetOwnPropertySymbolsAvailable) {
      keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
    }

    for (var i = 0; i < keys.length; ++i) {
      if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
        try {
          targetComponent[keys[i]] = sourceComponent[keys[i]];
        } catch (error) {}
      }
    }
  }

  return targetComponent;
};

hoistNonReactStatics._r = [2];

var inject_1 = createCommonjsModule(function (module, exports) {
  "use strict";
  /**
   * Store Injection
   */

  function createStoreInjector(grabStoresFn, component) {
    var Injector = dist.default({
      displayName: component.name,
      render: function render() {
        var _this = this;

        var newProps = {};

        for (var key in this.props) {
          if (this.props.hasOwnProperty(key)) {
            newProps[key] = this.props[key];
          }
        }

        var additionalProps = grabStoresFn(this.context.mobxStores || {}, newProps, this.context) || {};

        for (var key in additionalProps) {
          newProps[key] = additionalProps[key];
        }

        newProps.ref = function (instance) {
          _this.wrappedInstance = instance;
        };

        return preact_1.h(component, newProps, this.props.children);
      }
    });
    Injector.contextTypes = {
      mobxStores: function mobxStores() {}
    };
    Injector.wrappedComponent = component;
    hoistNonReactStatics(Injector, component);
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
          throw new Error("MobX observer: Store \"" + storeName + "\" is not available! " + "Make sure it is provided by some Provider");
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
    if (typeof grabStoresFn !== 'function') {
      var storesNames = [];

      for (var i = 0; i < arguments.length; i++) {
        storesNames[i] = arguments[i];
      }

      grabStoresFn = grabStoresByName(storesNames);
    }

    return function (componentClass) {
      return createStoreInjector(grabStoresFn, componentClass);
    };
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = inject;
});

var connect_1 = createCommonjsModule(function (module, exports) {
  "use strict";
  /**
   * Wraps a component and provides stores as props
   */

  function connect(arg1, arg2) {
    if (arg2 === void 0) {
      arg2 = null;
    }

    if (typeof arg1 === 'string') {
      shared.throwError('Store names should be provided as array');
    }

    if (Array.isArray(arg1)) {
      // component needs stores
      if (!arg2) {
        // invoked as decorator
        return function (componentClass) {
          return connect(arg1, componentClass);
        };
      } else {
        // TODO: deprecate this invocation style
        return inject_1.default.apply(null, arg1)(connect(arg2));
      }
    }

    var componentClass = arg1; // Stateless function component:
    // If it is function but doesn't seem to be a Inferno class constructor,
    // wrap it to a Inferno class automatically

    if (typeof componentClass === 'function' && (!componentClass.prototype || !componentClass.prototype.render) && !componentClass.isReactClass && !preact_1.Component.isPrototypeOf(componentClass)) {
      var newClass = dist.default({
        displayName: componentClass.displayName || componentClass.name,
        propTypes: componentClass.propTypes,
        contextTypes: componentClass.contextTypes,
        getDefaultProps: function getDefaultProps() {
          return componentClass.defaultProps;
        },
        render: function render() {
          return componentClass.call(this, this.props, this.context);
        }
      });
      return connect(newClass);
    }

    if (!componentClass) {
      shared.throwError('Please pass a valid component to "observer"');
    }

    componentClass.isMobXReactObserver = true;
    return makeReactive_1.default(componentClass);
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = connect;
});

var lib$1 = createCommonjsModule(function (module, exports) {
  "use strict";

  exports.Provider = Provider_1.default;
  exports.renderReporter = makeReactive_1.renderReporter;
  exports.componentByNodeRegistery = makeReactive_1.componentByNodeRegistery;
  exports.connect = connect_1.default;
  exports.observer = connect_1.default;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    Provider: Provider_1.default,
    connect: connect_1.default,
    observer: connect_1.default,
    renderReporter: makeReactive_1.renderReporter,
    componentByNodeRegistery: makeReactive_1.componentByNodeRegistery
  };
});
var lib_5 = lib$1.observer;

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
var TodoHeaderView$1 = lib_5(TodoHeaderView);

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
var TodoItemView$1 = lib_5(TodoItemView);

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
var TodoPerfView$1 = lib_5(TodoPerfView);

var todoService = new TodoService();
var browserLocationStore = new BrowserLocationStore(location, history);
var todoFilterService = new TodoFilterService(todoService, browserLocationStore);
var todoHeaderService = new TodoHeaderService(todoService);
global$1['lom_h'] = h;
render(lom_h(TodoPerfView$1, {
  todoHeaderService: todoHeaderService,
  todoService: todoService,
  todoFilterService: todoFilterService
}), document.getElementById('todoapp'));

}());
//# sourceMappingURL=bundle.js.map
