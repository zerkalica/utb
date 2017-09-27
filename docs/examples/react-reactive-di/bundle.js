(function () {
'use strict';

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};













var createClass$2 = function () {
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











var inheritsLoose$2 = function (subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
};

// eslint-disable-line
var ATOM_STATUS_DESTROYED = 0;
var ATOM_STATUS_OBSOLETE = 1;
var ATOM_STATUS_CHECKING = 2;
var ATOM_STATUS_PULLING = 3;
var ATOM_STATUS_ACTUAL = 4;
var catchedId = Symbol('lom_atom_catched');

var _typeof$1 = typeof Symbol === "function" && _typeof$2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof$2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof$2(obj);
};

var createClass$1 = function () {
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

var inheritsLoose$1 = function inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
};

inheritsLoose$1._r = [2];
var throwOnAccess = {
  get: function get$$1(target) {
    throw target.valueOf();
  },
  ownKeys: function ownKeys(target) {
    throw target.valueOf();
  }
};

function createMock(error) {
  return new Proxy(error, throwOnAccess);
}

createMock._r = [2];

function defaultNormalize(next, prev) {
  if (next === prev) return next;

  if (next instanceof Array && prev instanceof Array && next.length === prev.length) {
    for (var i = 0; i < next.length; i++) {
      if (next[i] !== prev[i]) {
        return next;
      }
    }

    return prev;
  }

  return next;
}

defaultNormalize._r = [2];

var AtomWait = function (_Error) {
  inheritsLoose$1(AtomWait, _Error);

  function AtomWait() {
    var _this;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Wait...';
    _this = _Error.call(this, message) || this // $FlowFixMe new.target
    ;
    _this['__proto__'] = new.target.prototype;
    _this[catchedId] = true;
    return _this;
  }

  return AtomWait;
}(Error);

function checkSlave(slave) {
  slave.check();
}

checkSlave._r = [2];

function obsoleteSlave(slave) {
  slave.obsolete();
}

obsoleteSlave._r = [2];

function disleadThis(master) {
  master.dislead(this);
}

disleadThis._r = [2];

function actualizeMaster(master) {
  if (this.status === ATOM_STATUS_CHECKING) {
    master.actualize();
  }
}

actualizeMaster._r = [2];

var Atom = function () {
  function Atom(field, host, context, normalize, key, isComponent) {
    this._masters = null;
    this._slaves = null;
    this.key = key;
    this.field = field;
    this.host = host;
    this.isComponent = isComponent || false;
    this._normalize = normalize || defaultNormalize;
    this._context = context;
    this.value = context.create(host, field, key);
    this.status = this.value === undefined ? ATOM_STATUS_OBSOLETE : ATOM_STATUS_ACTUAL;
  }

  Atom.prototype.toString = function toString() {
    var hc = this.host.constructor;
    var k = this.key;
    return (this.host.displayName || (hc ? String(hc.displayName || hc.name) : '')) + '.' + this.field + (k ? '(' + (typeof k === 'function' ? k.displayName || k.name : String(k)) + ')' : '');
  };

  Atom.prototype.toJSON = function toJSON() {
    return this.value;
  };

  Atom.prototype.destroyed = function destroyed(isDestroyed) {
    if (isDestroyed === undefined) {
      return this.status === ATOM_STATUS_DESTROYED;
    }

    if (isDestroyed) {
      if (this.status !== ATOM_STATUS_DESTROYED) {
        if (this._masters) {
          this._masters.forEach(disleadThis, this);

          this._masters = null;
        }

        this._checkSlaves();

        if (this.host.destroy !== undefined) {
          this.host.destroy(this.value, this.field, this.key);
        }

        this._context.destroyHost(this);

        this.value = undefined;
        this.status = ATOM_STATUS_DESTROYED;
      }

      return true;
    }

    return false;
  };

  Atom.prototype.get = function get$$1(force) {
    var slave = this._context.last;

    if (slave && (!slave.isComponent || !this.isComponent)) {
      var slaves = this._slaves;

      if (!slaves) {
        this._context.unreap(this);

        slaves = this._slaves = new Set();
      }

      slaves.add(slave);
      slave.addMaster(this);
    }

    if (force) {
      this._pullPush(undefined, true);
    } else {
      this.actualize();
    }

    return this.value;
  };

  Atom.prototype.set = function set$$1(v, force) {
    var oldValue = this.value;

    var normalized = this._normalize(v, oldValue);

    if (oldValue === normalized) {
      return normalized;
    }

    if (normalized === undefined) {
      return oldValue;
    }

    if (!force || normalized instanceof Error) {
      this.status = ATOM_STATUS_ACTUAL;
      this.value = normalized instanceof Error ? createMock(normalized) : normalized;

      this._context.newValue(this, oldValue, normalized);

      if (this._slaves) {
        this._slaves.forEach(obsoleteSlave);
      }
    } else {
      this.obsolete();
      this.actualize(normalized);
    }

    return this.value;
  };

  Atom.prototype.actualize = function actualize(proposedValue) {
    if (this.status === ATOM_STATUS_PULLING) {
      throw new Error("Cyclic atom dependency of " + String(this));
    }

    if (this.status === ATOM_STATUS_ACTUAL) {
      return;
    }

    if (this.status === ATOM_STATUS_CHECKING) {
      if (this._masters) {
        this._masters.forEach(actualizeMaster, this);
      }

      if (this.status === ATOM_STATUS_CHECKING) {
        this.status = ATOM_STATUS_ACTUAL;
      }
    }

    if (this.status !== ATOM_STATUS_ACTUAL) {
      this._pullPush(proposedValue);
    }
  };

  Atom.prototype._pullPush = function _pullPush(proposedValue, force) {
    if (this._masters) {
      this._masters.forEach(disleadThis, this);
    }

    var newValue = void 0;
    this.status = ATOM_STATUS_PULLING;
    var context = this._context;
    var slave = context.last;
    context.last = this;
    var value = this.value;

    try {
      newValue = this._normalize(this.key === undefined ? this.host[this.field + '$'](proposedValue, force, value) : this.host[this.field + '$'](this.key, proposedValue, force, value), value);
    } catch (error) {
      if (error[catchedId] === undefined) {
        error[catchedId] = true;
        console.error(error.stack || error);
      }

      newValue = createMock(error);
    }

    context.last = slave;
    this.status = ATOM_STATUS_ACTUAL;

    if (newValue !== undefined && value !== newValue) {
      this.value = newValue;

      this._context.newValue(this, value, newValue, true);

      if (this._slaves) {
        this._slaves.forEach(obsoleteSlave);
      }
    }
  };

  Atom.prototype.dislead = function dislead(slave) {
    var slaves = this._slaves;

    if (slaves) {
      if (slaves.size === 1) {
        this._slaves = null;

        this._context.proposeToReap(this);
      } else {
        slaves.delete(slave);
      }
    }
  };

  Atom.prototype._checkSlaves = function _checkSlaves() {
    if (this._slaves) {
      this._slaves.forEach(checkSlave);
    } else {
      this._context.proposeToPull(this);
    }
  };

  Atom.prototype.check = function check() {
    if (this.status === ATOM_STATUS_ACTUAL) {
      this.status = ATOM_STATUS_CHECKING;

      this._checkSlaves();
    }
  };

  Atom.prototype.obsolete = function obsolete() {
    if (this.status !== ATOM_STATUS_OBSOLETE) {
      this.status = ATOM_STATUS_OBSOLETE;

      this._checkSlaves();
    }
  };

  Atom.prototype.addMaster = function addMaster(master) {
    if (!this._masters) {
      this._masters = new Set();
    }

    this._masters.add(master);
  };

  createClass$1(Atom, [{
    key: "displayName",
    get: function get$$1() {
      return this.toString();
    }
  }]);
  return Atom;
}();

var scheduleNative = typeof requestAnimationFrame == 'function' ? function (handler) {
  return requestAnimationFrame(handler);
} : function (handler) {
  return setTimeout(handler, 16);
};

function reap(atom, key, reaping) {
  reaping.delete(atom);

  if (!atom.slaves) {
    atom.destroyed(true);
  }
}

reap._r = [2];

var BaseLogger = function () {
  function BaseLogger() {}

  BaseLogger.prototype.create = function create(host, field, key, namespace) {};

  BaseLogger.prototype.destroy = function destroy(atom, namespace) {};

  BaseLogger.prototype.status = function status(_status, atom, namespace) {};

  BaseLogger.prototype.error = function error(atom, err, namespace) {};

  BaseLogger.prototype.newValue = function newValue(atom, from, to, isActualize, namespace) {};

  return BaseLogger;
}();

var ConsoleLogger = function (_BaseLogger) {
  inheritsLoose$1(ConsoleLogger, _BaseLogger);

  function ConsoleLogger() {
    return _BaseLogger.apply(this, arguments) || this;
  }

  ConsoleLogger.prototype.status = function status(_status2, atom, namespace) {
    console.log(namespace, _status2, atom.displayName);
  };

  ConsoleLogger.prototype.error = function error(atom, err, namespace) {
    console.log(namespace, 'error', atom.displayName, err);
  };

  ConsoleLogger.prototype.newValue = function newValue(atom, from, to, isActualize, namespace) {
    console.log(namespace, isActualize ? 'actualize' : 'cacheSet', atom.displayName, 'from', from, 'to', to);
  };

  return ConsoleLogger;
}(BaseLogger);

var Context = function () {
  function Context() {
    var _this2 = this;

    this.last = null;
    this._logger = undefined;
    this._updating = [];
    this._reaping = new Set();
    this._scheduled = false;
    this._namespace = '$';

    this.__run = function () {
      if (_this2._scheduled) {
        _this2._scheduled = false;

        _this2._run();
      }
    };

    this._start = 0;
    this._pendCount = 0;
  }

  Context.prototype.create = function create(host, field, key) {
    if (this._logger !== undefined) {
      return this._logger.create(host, field, key, this._namespace);
    }
  };

  Context.prototype.destroyHost = function destroyHost(atom) {
    if (this._logger !== undefined) {
      this._logger.destroy(atom, this._namespace);
    }
  };

  Context.prototype.setLogger = function setLogger(logger) {
    this._logger = logger;
  };

  Context.prototype.newValue = function newValue(atom, from, to, isActualize) {
    if (this._logger !== undefined) {
      if (to instanceof AtomWait) {
        this._logger.status('waiting', atom, this._namespace);
      } else if (to instanceof Error) {
        this._logger.error(atom, to, this._namespace);
      } else {
        this._logger.newValue(atom, from, to, isActualize, this._namespace);
      }
    }
  };

  Context.prototype.proposeToPull = function proposeToPull(atom) {
    if (this._logger !== undefined) {
      this._logger.status('proposeToPull', atom, this._namespace);
    }

    this._updating.push(atom);

    this._schedule();
  };

  Context.prototype.proposeToReap = function proposeToReap(atom) {
    if (this._logger !== undefined) {
      this._logger.status('proposeToReap', atom, this._namespace);
    }

    this._reaping.add(atom);

    this._schedule();
  };

  Context.prototype.unreap = function unreap(atom) {
    this._reaping.delete(atom);
  };

  Context.prototype._schedule = function _schedule() {
    if (!this._scheduled) {
      scheduleNative(this.__run);
      this._scheduled = true;
    }
  };

  Context.prototype._run = function _run() {
    this._schedule();

    var reaping = this._reaping;
    var updating = this._updating;
    var start = this._start;

    do {
      var end = updating.length;

      for (var i = start; i < end; i++) {
        this._start = i; // save progress, atom.actualize or destroyed can throw exception

        var atom = updating[i];

        if (!reaping.has(atom) && !atom.destroyed()) {
          atom.actualize();
        }
      }

      start = end;
    } while (updating.length > start);

    updating.length = 0;
    this._start = 0;

    while (reaping.size > 0) {
      reaping.forEach(reap);
    }

    this._scheduled = false;
    this._pendCount = 0;
  };

  Context.prototype.beginTransaction = function beginTransaction(namespace) {
    var result = this._namespace;
    this._namespace = namespace;
    this._pendCount++;
    return result;
  };

  Context.prototype.endTransaction = function endTransaction(prev) {
    this._namespace = prev;

    if (this._pendCount === 1) {
      this._run();
    } else {
      this._pendCount--;
    }
  };

  return Context;
}();

var defaultContext = new Context();

function memMethod(proto, name, descr, normalize, isComponent) {
  if (descr.value === undefined) {
    throw new TypeError(name + " is not an function (next?: V)");
  }

  proto[name + "$"] = descr.value;
  var hostAtoms = new WeakMap();
  Object.defineProperty(proto, name + "()", {
    get: function get$$1() {
      return hostAtoms.get(this);
    }
  });

  var forcedFn = function forcedFn(next, force) {
    return this[name](next, force === undefined ? true : force);
  };

  forcedFn._r = [2];
  setFunctionName(forcedFn, name + "*");
  proto[name + "*"] = forcedFn;
  return {
    enumerable: descr.enumerable,
    configurable: descr.configurable,
    value: function value(next, force) {
      var atom = hostAtoms.get(this);

      if (atom === undefined) {
        atom = new Atom(name, this, defaultContext, normalize, undefined, isComponent);
        hostAtoms.set(this, atom);
      }

      return next === undefined ? atom.get(force) : atom.set(next, force);
    }
  };
}

memMethod._r = [2];

function createGetSetHandler(get$$1, set$$1) {
  return function getSetHandler(next) {
    if (next === undefined) {
      return get$$1.call(this);
    }

    set$$1.call(this, next);
    return next;
  };
}

createGetSetHandler._r = [2];

function createValueHandler(initializer) {
  return function valueHandler(next) {
    return next === undefined && initializer ? initializer.call(this) : next;
  };
}

createValueHandler._r = [2];
var isForced = false;

function setFunctionName(fn, name) {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false
  });
  fn.displayName = name;
}

setFunctionName._r = [2];

function memProp(proto, name, descr, normalize) {
  var handlerKey = name + "$";

  if (proto[handlerKey] !== undefined) {
    return undefined;
  }

  if (descr.initializer) setFunctionName(descr.initializer, name);
  if (descr.get) setFunctionName(descr.get, "get#" + name);
  if (descr.set) setFunctionName(descr.set, "set#" + name);
  var handler = proto[handlerKey] = descr.get === undefined && descr.set === undefined ? createValueHandler(descr.initializer) : createGetSetHandler(descr.get, descr.set);
  setFunctionName(handler, name + "()");
  var hostAtoms = new WeakMap();
  Object.defineProperty(proto, name + "()", {
    get: function get$$1() {
      return hostAtoms.get(this);
    }
  });
  return {
    enumerable: descr.enumerable,
    configurable: descr.configurable,
    get: function get$$1() {
      var atom = hostAtoms.get(this);

      if (atom === undefined) {
        atom = new Atom(name, this, defaultContext, normalize);
        hostAtoms.set(this, atom);
      }

      if (isForced) {
        isForced = false;
        return atom.get(true);
      }

      return atom.get();
    },
    set: function set$$1(val) {
      var atom = hostAtoms.get(this);

      if (atom === undefined) {
        atom = new Atom(name, this, defaultContext, normalize);
        hostAtoms.set(this, atom);
      }

      if (isForced) {
        isForced = false;
        atom.set(val, true);
        return;
      }

      atom.set(val);
    }
  };
}

memProp._r = [2];

function getKeyFromObj(params) {
  var keys = Object.keys(params).sort();
  var result = '';

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var _value = params[key];
    result += "." + key + ":" + (_typeof$1(_value) === 'object' ? JSON.stringify(_value) : _value);
  }

  return result;
}

getKeyFromObj._r = [2];

function getKey(params) {
  if (!params) return '';
  if (params instanceof Array) return JSON.stringify(params);
  if (_typeof$1(params) === 'object') return getKeyFromObj(params);
  return '' + params;
}

getKey._r = [2];

function memKeyMethod(proto, name, descr, normalize) {
  var handler = descr.value;

  if (handler === undefined) {
    throw new TypeError(name + " is not an function (rawKey: K, next?: V)");
  }

  proto[name + "$"] = handler;
  var hostAtoms = new WeakMap();
  Object.defineProperty(proto, name + "()", {
    get: function get$$1() {
      return hostAtoms.get(this);
    }
  });

  var forcedFn = function forcedFn(rawKey, next, force) {
    return this[name](rawKey, next, force === undefined ? true : force);
  };

  forcedFn._r = [2];
  setFunctionName(forcedFn, name + "*");
  proto[name + "*"] = forcedFn;
  return {
    enumerable: descr.enumerable,
    configurable: descr.configurable,
    value: function value(rawKey, next, force) {
      var atomMap = hostAtoms.get(this);

      if (atomMap === undefined) {
        atomMap = new Map();
        hostAtoms.set(this, atomMap);
      }

      var key = getKey(rawKey);
      var atom = atomMap.get(key);

      if (atom === undefined) {
        atom = new Atom(name, this, defaultContext, normalize, rawKey);
        atomMap.set(key, atom);
      }

      return next === undefined ? atom.get(force) : atom.set(next, force);
    }
  };
}

memKeyMethod._r = [2];

function memkey() {
  if (arguments.length === 3) {
    return memKeyMethod(arguments[0], arguments[1], arguments[2]);
  }

  var normalize = arguments[0];
  return function (proto, name, descr) {
    return memKeyMethod(proto, name, descr, normalize);
  };
}

memkey._r = [2];
function detached(proto, name, descr) {
  return memMethod(proto, name, descr, undefined, true);
}

detached._r = [2];

function createActionMethod(t, hk, context) {
  var name = (t.displayName || t.constructor.displayName || t.constructor.name) + "." + hk;

  function action() {
    var result = void 0;
    var oldNamespace = context.beginTransaction(name);

    try {
      switch (arguments.length) {
        case 0:
          result = t[hk]();
          break;

        case 1:
          result = t[hk](arguments[0]);
          break;

        case 2:
          result = t[hk](arguments[0], arguments[1]);
          break;

        case 3:
          result = t[hk](arguments[0], arguments[1], arguments[2]);
          break;

        case 4:
          result = t[hk](arguments[0], arguments[1], arguments[2], arguments[3]);
          break;

        case 5:
          result = t[hk](arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
          break;

        default:
          result = t[hk].apply(t, arguments);
      }
    } finally {
      context.endTransaction(oldNamespace);
    }

    return result;
  }

  setFunctionName(action, name);
  return action;
}

createActionMethod._r = [2];

function createActionFn(fn, rawName, context) {
  var name = rawName || fn.displayName || fn.name;

  function action() {
    var result = void 0;
    var oldNamespace = context.beginTransaction(name);

    try {
      switch (arguments.length) {
        case 0:
          result = fn();
          break;

        case 1:
          result = fn(arguments[0]);
          break;

        case 2:
          result = fn(arguments[0], arguments[1]);
          break;

        case 3:
          result = fn(arguments[0], arguments[1], arguments[2]);
          break;

        case 4:
          result = fn(arguments[0], arguments[1], arguments[2], arguments[3]);
          break;

        case 5:
          result = fn(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
          break;

        default:
          result = fn.apply(null, arguments);
      }
    } finally {
      context.endTransaction(oldNamespace);
    }

    return result;
  }

  setFunctionName(action, name);
  return action;
}

createActionFn._r = [2];

function actionMethod(proto, field, descr, context) {
  var hk = field + "$";

  if (descr.value === undefined) {
    throw new TypeError(field + " is not an function (next?: V)");
  }

  proto[hk] = descr.value;
  var definingProperty = false;
  return {
    enumerable: descr.enumerable,
    configurable: descr.configurable,
    get: function get$$1() {
      if (definingProperty) {
        return this[hk];
      }

      definingProperty = true;
      var actionFn = createActionMethod(this, hk, context);
      Object.defineProperty(this, field, {
        configurable: true,
        value: actionFn
      });
      definingProperty = false;
      return actionFn;
    }
  };
}

actionMethod._r = [2];

function action() {
  if (arguments.length === 3) {
    return actionMethod(arguments[0], arguments[1], arguments[2], defaultContext);
  }

  return createActionFn(arguments[0], arguments[1], defaultContext);
}

action._r = [2];

function mem() {
  if (arguments.length === 3) {
    return arguments[2].value === undefined ? memProp(arguments[0], arguments[1], arguments[2]) : memMethod(arguments[0], arguments[1], arguments[2]);
  }

  var normalize = arguments[0];
  return function (proto, name, descr) {
    return descr.value === undefined ? memProp(proto, name, descr, normalize) : memMethod(proto, name, descr, normalize);
  };
}

mem._r = [2];

function props(proto, name, descr) {
  proto.constructor.__lom_prop = name;

  if (!descr.value && !descr.set) {
    descr.writable = true;
  }
}

props._r = [2];
mem.Wait = AtomWait;
mem.key = memkey;
mem.detached = detached;

var _typeof = typeof Symbol === "function" && _typeof$2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof$2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof$2(obj);
};

var createClass = function () {
  function defineProperties(target, props$$1) {
    for (var i = 0; i < props$$1.length; i++) {
      var descriptor = props$$1[i];
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

var inheritsLoose = function inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
};

inheritsLoose._r = [2];

var _class2;

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

_applyDecoratedDescriptor$1._r = [2];

var FakeSheet = function () {
  function FakeSheet() {
    this.classes = {};
  }

  FakeSheet.prototype.update = function update(name, props$$1) {
    return this;
  };

  FakeSheet.prototype.attach = function attach() {
    return this;
  };

  FakeSheet.prototype.detach = function detach() {
    return this;
  };

  return FakeSheet;
}();

var defaultSheetProcessor = {
  createStyleSheet: function createStyleSheet(cssProps) {
    return new FakeSheet();
  },
  removeStyleSheet: function removeStyleSheet(sheet) {}
};
var SheetManager = (_class2 = function () {
  function SheetManager(sheetProcessor, injector) {
    this._sheetProcessor = sheetProcessor || defaultSheetProcessor;
    this._injector = injector;
  }

  SheetManager.prototype.sheet = function sheet(key, value, force$$1, oldValue) {
    if (value !== undefined) return value;

    if (oldValue !== undefined) {
      this._sheetProcessor.removeStyleSheet(oldValue); // oldValue.detach()

    }

    var newValue = this._sheetProcessor.createStyleSheet(this._injector.invoke(key));

    newValue.attach();
    return newValue;
  };

  SheetManager.prototype.destroy = function destroy(value) {
    this._sheetProcessor.removeStyleSheet(value); // value.detach()

  };

  return SheetManager;
}(), _applyDecoratedDescriptor$1(_class2.prototype, "sheet", [memkey], Object.getOwnPropertyDescriptor(_class2.prototype, "sheet"), _class2.prototype), _class2);
var depId = 0;

var Alias = function Alias(dest) {
  dest.__rdi_id = '' + ++depId;
  this.dest = dest;
};

Alias._r = [2];

var Injector = function () {
  function Injector(items, sheetProcessor, state, displayName, instance, cache) {
    this._resolved = false;
    this._listeners = undefined;
    this._state = state;
    this._instance = instance || 0;
    this.displayName = displayName || '$';
    this._sheetManager = sheetProcessor instanceof SheetManager ? sheetProcessor : new SheetManager(sheetProcessor, this);
    var map = this._cache = cache || Object.create(null);

    if (items !== undefined) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (item instanceof Array) {
          var src = item[0];

          if (typeof src === 'string') {
            map[src] = item[1];
          } else {
            if (src.__rdi_id === undefined) {
              src.__rdi_id = '' + ++depId;
            }

            var dest = item[1];
            map[src.__rdi_id] = typeof dest === 'function' && !(dest instanceof Alias) ? new Alias(dest) : dest;
          }
        } else {
          var _src = item.constructor;

          if (_src.__rdi_id === undefined) {
            _src.__rdi_id = '' + ++depId;
          }

          map[_src.__rdi_id] = item;
        }
      }
    }
  }

  Injector.prototype.toString = function toString() {
    return this.displayName;
  };

  Injector.prototype.toJSON = function toJSON() {
    return this._cache;
  };

  Injector.prototype.value = function value(key) {
    var id = key.__rdi_id;

    if (key.__rdi_id === undefined) {
      id = key.__rdi_id = '' + ++depId;
    }

    var value = this._cache[id];

    if (value === undefined) {
      value = this._cache[id] = this.invoke(key);
      var depName = (key.displayName || key.name) + (this._instance > 0 ? '[' + this._instance + ']' : '');
      value.displayName = this.displayName + "." + depName;
      var state = this._state === undefined ? undefined : this._state[depName];

      if (state && _typeof(state) === 'object') {
        for (var prop in state) {
          value[prop] = state[prop];
        }
      }
    } else if (value instanceof Alias) {
      value = this._cache[id] = this.value(value.dest);
    }

    return value;
  };

  Injector.prototype.destroy = function destroy() {
    this._cache = undefined;
    this._listeners = undefined;
    this._sheetManager = undefined;
  };

  Injector.prototype.invoke = function invoke(key) {
    var isFn = key.theme;
    var deps = key.deps;

    if (key._r !== undefined) {
      isFn = key._r[0] === 2;
      deps = deps || key._r[1];
    }

    var a = this.resolve(deps);

    if (isFn) {
      switch (a.length) {
        case 0:
          return key();

        case 1:
          return key(a[0]);

        case 2:
          return key(a[0], a[1]);

        case 3:
          return key(a[0], a[1], a[2]);

        case 4:
          return key(a[0], a[1], a[2], a[3]);

        case 5:
          return key(a[0], a[1], a[2], a[3], a[4]);

        case 6:
          return key(a[0], a[1], a[2], a[3], a[4], a[5]);

        default:
          return key.apply(undefined, a);
      }
    }

    switch (a.length) {
      case 0:
        return new key();

      case 1:
        return new key(a[0]);

      case 2:
        return new key(a[0], a[1]);

      case 3:
        return new key(a[0], a[1], a[2]);

      case 4:
        return new key(a[0], a[1], a[2], a[3]);

      case 5:
        return new key(a[0], a[1], a[2], a[3], a[4]);

      case 6:
        return new key(a[0], a[1], a[2], a[3], a[4], a[5]);

      default:
        return new (Function.prototype.bind.apply(key, [null].concat(a)))();
    }
  };

  Injector.prototype.alias = function alias(key, rawId) {
    var id = rawId;

    if (id === undefined) {
      id = key.__rdi_id;

      if (id === undefined) {
        id = key.__rdi_id = '' + ++depId;
      }
    }

    var newKey = this._cache[id];
    if (newKey instanceof Alias) return newKey.dest;
    if (newKey === undefined) return key;
    return newKey;
  };

  Injector.prototype.invokeWithProps = function invokeWithProps(key, props$$1, propsChanged) {
    var deps = key.deps || (key._r === undefined ? undefined : key._r[1]);

    if (deps === undefined) {
      return key(props$$1);
    }

    var a = this.resolve(deps);

    if (propsChanged === true) {
      var listeners = this._listeners;

      if (listeners !== undefined) {
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          listener[listener.constructor.__lom_prop] = props$$1;
        }
      }
    }

    this._resolved = true;

    switch (a.length) {
      case 0:
        return key(props$$1);

      case 1:
        return key(props$$1, a[0]);

      case 2:
        return key(props$$1, a[0], a[1]);

      case 3:
        return key(props$$1, a[0], a[1], a[2]);

      case 4:
        return key(props$$1, a[0], a[1], a[2], a[3]);

      case 5:
        return key(props$$1, a[0], a[1], a[2], a[3], a[4]);

      case 6:
        return key(props$$1, a[0], a[1], a[2], a[3], a[4], a[5]);

      case 7:
        return key(props$$1, a[0], a[1], a[2], a[3], a[4], a[5], a[6]);

      default:
        return key.apply(undefined, [props$$1].concat(a));
    }
  };

  Injector.prototype.copy = function copy(items, displayName, instance) {
    return new Injector(items, this._sheetManager, this._state, this.displayName + '.' + displayName, instance, Object.create(this._cache));
  };

  Injector.prototype.resolve = function resolve(argDeps) {
    var result = [];
    var map = this._cache;

    if (argDeps !== undefined) {
      var sm = this._sheetManager;
      var resolved = this._resolved;

      for (var i = 0, l = argDeps.length; i < l; i++) {
        var argDep = argDeps[i];

        if (_typeof(argDep) === 'object') {
          var obj = {};

          if (!resolved) {
            for (var prop in argDep) {
              // eslint-disable-line
              var key = argDep[prop];

              if (key.theme !== undefined) {
                obj[prop] = sm.sheet(key).classes;
              }
            }
          }

          for (var _prop in argDep) {
            // eslint-disable-line
            var _key = argDep[_prop];
            var dep = _key.theme === undefined ? this.value(_key) : sm.sheet(_key).classes;

            if (resolved === false && _key.__lom_prop !== undefined) {
              if (this._listeners === undefined) {
                this._listeners = [];
              }

              this._listeners.push(dep);
            }

            obj[_prop] = dep;
          }

          result.push(obj);
        } else {
          var _dep = argDep.theme === undefined ? this.value(argDep) : sm.sheet(argDep).classes;

          if (resolved === false && argDep.__lom_prop !== undefined) {
            if (this._listeners === undefined) {
              this._listeners = [];
            }

            this._listeners.push(_dep);
          }

          result.push(_dep);
        }
      }
    }

    return result;
  };

  return Injector;
}();

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

_applyDecoratedDescriptor._r = [2];
var parentContext = undefined;

function createCreateElement(atomize, createElement) {
  return function lomCreateElement() {
    var el = arguments[0];
    var attrs = arguments[1];
    var newEl = void 0;
    var isAtomic = typeof el === 'function' && el.constructor.render === undefined;
    var id = attrs ? attrs.id : undefined;

    if (isAtomic) {
      if (!attrs) {
        attrs = {
          __lom_ctx: parentContext
        };
      } else {
        attrs.__lom_ctx = parentContext;
      }

      if (parentContext !== undefined) {
        newEl = parentContext.alias(el, id);
        if (newEl === null) return null;
        if (newEl !== undefined) el = newEl;
      }

      if (el.__lom === undefined) {
        el.__lom = atomize(el);
      }

      newEl = el.__lom;
    } else {
      if (parentContext !== undefined && id) {
        newEl = parentContext.alias(el, id);
        if (newEl === null) return null;
        if (newEl !== undefined) el = newEl;
      }

      newEl = el;
    }

    switch (arguments.length) {
      case 2:
        return createElement(newEl, attrs);

      case 3:
        return createElement(newEl, attrs, arguments[2]);

      case 4:
        return createElement(newEl, attrs, arguments[2], arguments[3]);

      case 5:
        return createElement(newEl, attrs, arguments[2], arguments[3], arguments[4]);

      case 6:
        return createElement(newEl, attrs, arguments[2], arguments[3], arguments[4], arguments[5]);

      case 7:
        return createElement(newEl, attrs, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);

      case 8:
        return createElement(newEl, attrs, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);

      case 9:
        return createElement(newEl, attrs, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);

      default:
        if (isAtomic === false) {
          return createElement.apply(null, arguments);
        }

        var args = [newEl, attrs];

        for (var i = 2, l = arguments.length; i < l; i++) {
          args.push(arguments[i]);
        }

        return createElement.apply(null, args);
    }
  };
}

createCreateElement._r = [2];

function createReactWrapper(BaseComponent, defaultFromError) {
  var _class;

  var rootInjector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Injector();
  var AtomizedComponent = (_class = function (_BaseComponent) {
    inheritsLoose(AtomizedComponent, _BaseComponent);

    function AtomizedComponent(props$$1, reactContext) {
      var _this;

      _this = _BaseComponent.call(this, props$$1, reactContext) || this;
      _this._propsChanged = true;
      _this._el = undefined;
      _this._keys = props$$1 ? Object.keys(props$$1) : undefined;
      var cns = _this.constructor;
      _this._render = cns.render;
      _this._injector = (props$$1.__lom_ctx || rootInjector).copy(_this._render.aliases, cns.displayName + (cns.instance ? '[' + cns.instance + ']' : ''), cns.instance);
      cns.instance++;
      return _this;
    }

    AtomizedComponent.prototype.toString = function toString() {
      return this._injector.displayName;
    };

    AtomizedComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate(props$$1) {
      var keys = this._keys;
      if (!keys) return false;
      var oldProps = this.props;

      for (var i = 0, l = keys.length; i < l; i++) {
        // eslint-disable-line
        var k = keys[i];

        if (oldProps[k] !== props$$1[k]) {
          this._propsChanged = true;
          return true;
        }
      }

      return false;
    };

    AtomizedComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      this['r()'].destroyed(true);
    };

    AtomizedComponent.prototype.destroy = function destroy() {
      this._el = undefined;
      this._keys = undefined;
      this.props = undefined;

      if (this._render !== undefined) {
        this.constructor.instance--;

        this._injector.destroy();

        this._injector = undefined;
      }
    };

    AtomizedComponent.prototype.r = function r(element, force$$1) {
      var data = void 0;
      var render = this._render;
      var prevContext = parentContext;
      parentContext = this._injector;

      try {
        data = parentContext.invokeWithProps(render, this.props, force$$1);
      } catch (error) {
        data = parentContext.invokeWithProps(render.onError || defaultFromError, {
          error: error
        });
      }

      parentContext = prevContext;

      if (!force$$1) {
        this._el = data;
        this.forceUpdate();
        this._el = undefined;
      }

      this._propsChanged = false;
      return data;
    };

    AtomizedComponent.prototype.render = function render() {
      return this._el === undefined ? this.r(undefined, this._propsChanged) : this._el;
    };

    createClass(AtomizedComponent, [{
      key: "displayName",
      get: function get$$1() {
        return this.toString();
      }
    }]);
    return AtomizedComponent;
  }(BaseComponent), _applyDecoratedDescriptor(_class.prototype, "r", [detached], Object.getOwnPropertyDescriptor(_class.prototype, "r"), _class.prototype), _class);
  return function reactWrapper(render) {
    var displayName = render.displayName || render.name;

    var WrappedComponent = function WrappedComponent(props$$1, context) {
      AtomizedComponent.call(this, props$$1, context);
    };

    WrappedComponent._r = [2];
    WrappedComponent.instance = 0;
    WrappedComponent.render = render;
    WrappedComponent.displayName = render.displayName || render.name;
    WrappedComponent.prototype = Object.create(AtomizedComponent.prototype);
    WrappedComponent.prototype.constructor = WrappedComponent;
    return WrappedComponent;
  };
}

createReactWrapper._r = [2];

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
function nextTick(fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
} // v8 likes predictible objects

nextTick._r = [2];

function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item._r = [2];

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues

var versions = {};
var release = {};
var config = {};

function noop() {}

noop._r = [2];
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error('process.binding is not supported');
}
binding._r = [2];
function cwd() {
  return '/';
}
cwd._r = [2];
function chdir(dir) {
  throw new Error('process.chdir is not supported');
}
chdir._r = [2];

function umask() {
  return 0;
} // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

umask._r = [2];
var performance$1 = global$1.performance || {};

var performanceNow = performance$1.now || performance$1.mozNow || performance$1.msNow || performance$1.oNow || performance$1.webkitNow || function () {
  return new Date().getTime();
}; // generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime


function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance$1) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);

  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];

    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }

  return [seconds, nanoseconds];
}
hrtime._r = [2];
var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}
uptime._r = [2];
var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

toObject._r = [2];

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

shouldUseNative._r = [2];
var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant(code) {
  var argCount = arguments.length - 1;
  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';
  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

reactProdInvariant._r = [2];
var reactProdInvariant_1 = reactProdInvariant;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}
/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */


makeEmptyFunction._r = [2];

var emptyFunction = function emptyFunction() {};

emptyFunction._r = [2];
emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);

emptyFunction.thatReturnsThis = function () {
  return this;
};

emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */


var warning = emptyFunction_1;

var warning_1 = warning;

function warnNoop(publicInstance, callerName) {
  
}
/**
 * This is the abstract API for an update queue.
 */


warnNoop._r = [2];
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function isMounted(publicInstance) {
    return false;
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function enqueueCallback(publicInstance, callback) {},

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function enqueueForceUpdate(publicInstance) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function enqueueSetState(publicInstance, partialState) {
    warnNoop(publicInstance, 'setState');
  }
};
var ReactNoopUpdateQueue_1 = ReactNoopUpdateQueue;

var emptyObject = {};

var emptyObject_1 = emptyObject;

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

validateFormat._r = [2];

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame

    throw error;
  }
}

invariant._r = [2];
var invariant_1 = invariant;

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning$1 = function lowPriorityWarning() {};

lowPriorityWarning$1._r = [2];

/**
 * Base class helpers for the updating state of a component.
 */


function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject_1; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue_1;
}

ReactComponent._r = [2];
ReactComponent.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

ReactComponent.prototype.setState = function (partialState, callback) {
  !(_typeof$2(partialState) === 'object' || typeof partialState === 'function' || partialState == null) ? reactProdInvariant_1('85') : void 0;
  this.updater.enqueueSetState(this, partialState);

  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);

  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


/**
 * Base class helpers for the updating state of a component.
 */


function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject_1; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue_1;
}

ReactPureComponent._r = [2];

function ComponentDummy() {}

ComponentDummy._r = [2];
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent; // Avoid an extra prototype jump for these methods.

objectAssign(ReactPureComponent.prototype, ReactComponent.prototype);

ReactPureComponent.prototype.isPureReactComponent = true;
var ReactBaseClasses = {
  Component: ReactComponent,
  PureComponent: ReactPureComponent
};

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */


var oneArgumentPooler = function oneArgumentPooler(copyFieldsFrom) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

oneArgumentPooler._r = [2];

var twoArgumentPooler$1 = function twoArgumentPooler(a1, a2) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

twoArgumentPooler$1._r = [2];

var threeArgumentPooler = function threeArgumentPooler(a1, a2, a3) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

threeArgumentPooler._r = [2];

var fourArgumentPooler$1 = function fourArgumentPooler(a1, a2, a3, a4) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

fourArgumentPooler$1._r = [2];

var standardReleaser = function standardReleaser(instance) {
  var Klass = this;
  !(instance instanceof Klass) ? reactProdInvariant_1('25') : void 0;
  instance.destructor();

  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

standardReleaser._r = [2];
var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;
/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */

var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;

  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }

  NewKlass.release = standardReleaser;
  return NewKlass;
};

addPoolingTo._r = [2];
var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler$1,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler$1
};
var PooledClass_1 = PooledClass;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */

var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};
var ReactCurrentOwner_1 = ReactCurrentOwner;

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// nor polyfill, then a plain number is used for performance.

var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;
var ReactElementSymbol = REACT_ELEMENT_TYPE;

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
function hasValidRef(config$$1) {
  return config$$1.ref !== undefined;
}

hasValidRef._r = [2];

function hasValidKey(config$$1) {
  return config$$1.key !== undefined;
}

hasValidKey._r = [2];

var ReactElement = function ReactElement(type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: ReactElementSymbol,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  return element;
};
/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
 */


ReactElement._r = [2];

ReactElement.createElement = function (type, config$$1, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config$$1 != null) {
    if (hasValidRef(config$$1)) {
      ref = config$$1.ref;
    }

    if (hasValidKey(config$$1)) {
      key = '' + config$$1.key;
    }

    self = config$$1.__self === undefined ? null : config$$1.__self;
    source = config$$1.__source === undefined ? null : config$$1.__source; // Remaining properties are added to a new props object

    for (propName in config$$1) {
      if (hasOwnProperty$1.call(config$$1, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config$$1[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner_1.current, props);
};
/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */


ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type); // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed

  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
};
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
 */


ReactElement.cloneElement = function (element, config$$1, children) {
  var propName; // Original props are copied

  var props = objectAssign({}, element.props); // Reserved names are extracted


  var key = element.key;
  var ref = element.ref; // Self is preserved since the owner is preserved.

  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.

  var source = element._source; // Owner will be preserved, unless ref is overridden

  var owner = element._owner;

  if (config$$1 != null) {
    if (hasValidRef(config$$1)) {
      // Silently steal the ref from the parent.
      ref = config$$1.ref;
      owner = ReactCurrentOwner_1.current;
    }

    if (hasValidKey(config$$1)) {
      key = '' + config$$1.key;
    } // Remaining properties override existing props


    var defaultProps;

    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }

    for (propName in config$$1) {
      if (hasOwnProperty$1.call(config$$1, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config$$1[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config$$1[propName];
        }
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};
/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */


ReactElement.isValidElement = function (object) {
  return _typeof$2(object) === 'object' && object !== null && object.$$typeof === ReactElementSymbol;
};

var ReactElement_1 = ReactElement;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */

function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);

  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

getIteratorFn._r = [2];
var getIteratorFn_1 = getIteratorFn;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */


escape._r = [2];

function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);
  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

unescape._r = [2];
var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};
var KeyEscapeUtils_1 = KeyEscapeUtils;

var SEPARATOR = '.';
var SUBSEPARATOR = ':';
/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */

function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && _typeof$2(component) === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils_1.escape(component.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}
/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */


getComponentKey._r = [2];

function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = _typeof$2(children);

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' || // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === ReactElementSymbol) {
    callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn_1(children);

    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;

      if (iteratorFn !== children.entries) {
        var ii = 0;

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        while (!(step = iterator.next()).done) {
          var entry = step.value;

          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils_1.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';

      var childrenString = String(children);
      reactProdInvariant_1('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}
/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */


traverseAllChildrenImpl._r = [2];

function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

traverseAllChildren._r = [2];
var traverseAllChildren_1 = traverseAllChildren;

var twoArgumentPooler = PooledClass_1.twoArgumentPooler;
var fourArgumentPooler = PooledClass_1.fourArgumentPooler;
var userProvidedKeyEscapeRegex = /\/+/g;

function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}
/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */


escapeUserProvidedKey._r = [2];

function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}

ForEachBookKeeping._r = [2];

ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};

PooledClass_1.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;
  func.call(context, child, bookKeeping.count++);
}
/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */


forEachSingleChild._r = [2];

function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren_1(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}
/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */


forEachChildren._r = [2];

function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}

MapBookKeeping._r = [2];

MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};

PooledClass_1.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;
  var mappedChild = func.call(context, child, bookKeeping.count++);

  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction_1.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement_1.isValidElement(mappedChild)) {
      mappedChild = ReactElement_1.cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }

    result.push(mappedChild);
  }
}

mapSingleChildIntoContext._r = [2];

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';

  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }

  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren_1(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}
/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */


mapIntoWithKeyPrefixInternal._r = [2];

function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

mapChildren._r = [2];

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */


forEachSingleChildDummy._r = [2];

function countChildren(children, context) {
  return traverseAllChildren_1(children, forEachSingleChildDummy, null);
}
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
 */


countChildren._r = [2];

function toArray$1(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction_1.thatReturnsArgument);
  return result;
}

toArray$1._r = [2];
var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray$1
};
var ReactChildren_1 = ReactChildren;

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var reIsNative = RegExp('^' + funcToString // Take an example native function source for comparison
  .call(hasOwnProperty // Strip regex characters so we can use it for regex
  ).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&' // Remove hasOwnProperty from the template to make it generic
  ).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

isNative._r = [2];
var canUseCollections = // Array.from
typeof Array.from === 'function' && // Map
typeof Map === 'function' && isNative(Map) && // Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) && // Set
typeof Set === 'function' && isNative(Set) && // Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);
var setItem;
var getItem;
var removeItem;
var getItemIDs;
var addRoot;
var removeRoot;
var getRootIDs;

if (canUseCollections) {
  var itemMap = new Map();
  var rootIDSet = new Set();

  setItem = function setItem(id, item) {
    itemMap.set(id, item);
  };

  getItem = function getItem(id) {
    return itemMap.get(id);
  };

  removeItem = function removeItem(id) {
    itemMap['delete'](id);
  };

  getItemIDs = function getItemIDs() {
    return Array.from(itemMap.keys());
  };

  addRoot = function addRoot(id) {
    rootIDSet.add(id);
  };

  removeRoot = function removeRoot(id) {
    rootIDSet['delete'](id);
  };

  getRootIDs = function getRootIDs() {
    return Array.from(rootIDSet.keys());
  };
} else {
  var itemByKey = {};
  var rootByKey = {}; // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232

  var getKeyFromID = function getKeyFromID(id) {
    return '.' + id;
  };

  getKeyFromID._r = [2];

  var getIDFromKey = function getIDFromKey(key) {
    return parseInt(key.substr(1), 10);
  };

  getIDFromKey._r = [2];

  setItem = function setItem(id, item) {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  };

  getItem = function getItem(id) {
    var key = getKeyFromID(id);
    return itemByKey[key];
  };

  removeItem = function removeItem(id) {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  };

  getItemIDs = function getItemIDs() {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = function addRoot(id) {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  };

  removeRoot = function removeRoot(id) {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  };

  getRootIDs = function getRootIDs() {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

var unmountedIDs = [];

function purgeDeep(id) {
  var item = getItem(id);

  if (item) {
    var childIDs = item.childIDs;
    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

purgeDeep._r = [2];

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

describeComponentFrame._r = [2];

function _getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

_getDisplayName._r = [2];

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName;

  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }

  void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

describeID._r = [2];
var ReactComponentTreeHook = {
  onSetChildren: function onSetChildren(id, nextChildIDs) {
    var item = getItem(id);
    !item ? reactProdInvariant_1('144') : void 0;
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = getItem(nextChildID);
      !nextChild ? reactProdInvariant_1('140') : void 0;
      !(nextChild.childIDs != null || _typeof$2(nextChild.element) !== 'object' || nextChild.element == null) ? reactProdInvariant_1('141') : void 0;
      !nextChild.isMounted ? reactProdInvariant_1('71') : void 0;

      if (nextChild.parentID == null) {
        nextChild.parentID = id; // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent id is missing.
      }

      !(nextChild.parentID === id) ? reactProdInvariant_1('142', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function onBeforeMountComponent(id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent: function onBeforeUpdateComponent(id, element) {
    var item = getItem(id);

    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }

    item.element = element;
  },
  onMountComponent: function onMountComponent(id) {
    var item = getItem(id);
    !item ? reactProdInvariant_1('144') : void 0;
    item.isMounted = true;
    var isRoot = item.parentID === 0;

    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function onUpdateComponent(id) {
    var item = getItem(id);

    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }

    item.updateCount++;
  },
  onUnmountComponent: function onUnmountComponent(id) {
    var item = getItem(id);

    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;

      if (isRoot) {
        removeRoot(id);
      }
    }

    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function purgeUnmountedComponents() {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }

    unmountedIDs.length = 0;
  },
  isMounted: function isMounted(id) {
    var item = getItem(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function getCurrentStackAddendum(topElement) {
    var info = '';

    if (topElement) {
      var name = _getDisplayName(topElement);

      var owner = topElement._owner;
      info += describeComponentFrame(name, topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner_1.current;
    var id = currentOwner && currentOwner._debugID;
    info += ReactComponentTreeHook.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function getStackAddendumByID(id) {
    var info = '';

    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }

    return info;
  },
  getChildIDs: function getChildIDs(id) {
    var item = getItem(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function getDisplayName(id) {
    var element = ReactComponentTreeHook.getElement(id);

    if (!element) {
      return null;
    }

    return _getDisplayName(element);
  },
  getElement: function getElement(id) {
    var item = getItem(id);
    return item ? item.element : null;
  },
  getOwnerID: function getOwnerID(id) {
    var element = ReactComponentTreeHook.getElement(id);

    if (!element || !element._owner) {
      return null;
    }

    return element._owner._debugID;
  },
  getParentID: function getParentID(id) {
    var item = getItem(id);
    return item ? item.parentID : null;
  },
  getSource: function getSource(id) {
    var item = getItem(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function getText(id) {
    var element = ReactComponentTreeHook.getElement(id);

    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function getUpdateCount(id) {
    var item = getItem(id);
    return item ? item.updateCount : 0;
  },
  getRootIDs: getRootIDs,
  getRegisteredIDs: getItemIDs,
  pushNonStandardWarningStack: function pushNonStandardWarningStack(isCreatingElement, currentSource) {
    if (typeof console.reactStack !== 'function') {
      return;
    }

    var stack = [];
    var currentOwner = ReactCurrentOwner_1.current;
    var id = currentOwner && currentOwner._debugID;

    try {
      if (isCreatingElement) {
        stack.push({
          name: id ? ReactComponentTreeHook.getDisplayName(id) : null,
          fileName: currentSource ? currentSource.fileName : null,
          lineNumber: currentSource ? currentSource.lineNumber : null
        });
      }

      while (id) {
        var element = ReactComponentTreeHook.getElement(id);
        var parentID = ReactComponentTreeHook.getParentID(id);
        var ownerID = ReactComponentTreeHook.getOwnerID(id);
        var ownerName = ownerID ? ReactComponentTreeHook.getDisplayName(ownerID) : null;
        var source = element && element._source;
        stack.push({
          name: ownerName,
          fileName: source ? source.fileName : null,
          lineNumber: source ? source.lineNumber : null
        });
        id = parentID;
      }
    } catch (err) {// Internal state is messed up.
      // Stop building the stack (it's just a nice to have).
    }

    console.reactStack(stack);
  },
  popNonStandardWarningStack: function popNonStandardWarningStack() {
    if (typeof console.reactStackEnd !== 'function') {
      return;
    }

    console.reactStackEnd();
  }
};
var ReactComponentTreeHook_1 = ReactComponentTreeHook;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var ReactComponentTreeHook$1;

if (typeof process !== 'undefined' && process.env && "production" === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook$1 = ReactComponentTreeHook_1;
}

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */


var createDOMFactory = ReactElement_1.createFactory;

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 *
 * @public
 */


var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),
  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};
var ReactDOMFactories_1 = ReactDOMFactories;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ReactPropTypesSecret$2 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
var ReactPropTypesSecret_1$2 = ReactPropTypesSecret$2;

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */


function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  
}

checkPropTypes._r = [2];
var checkPropTypes_1 = checkPropTypes;

var factoryWithTypeCheckers = function factoryWithTypeCheckers(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */

  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);

    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }
  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */


  var ANONYMOUS = '<<anonymous>>'; // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.

  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),
    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };
  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */

  /*eslint-disable no-self-compare*/

  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */


  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  } // Make `instanceof Error` still work for returned errors.


  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    var manualPropTypeCallCache, manualPropTypeWarningCount;

function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1$2) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant_1(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        } else if ("production" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;

          if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            warning_1(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }

      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }

          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }

        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction_1.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }

      var propValue = props[propName];

      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }

      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1$2);

        if (error instanceof Error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }

      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }

      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1$2);

          if (error instanceof Error) {
            return error;
          }
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];

      if (typeof checker !== 'function') {
        warning_1(false, 'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
        return emptyFunction_1.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];

        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1$2) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }

      for (var key in shapeTypes) {
        var checker = shapeTypes[key];

        if (!checker) {
          continue;
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1$2);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      } // We need to check all keys in case some are required but missing from
      // props.


      var allKeys = objectAssign({}, props[propName], shapeTypes);

      for (var key in allKeys) {
        var checker = shapeTypes[key];

        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1$2);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (_typeof$2(propValue)) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;

      case 'boolean':
        return !propValue;

      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }

        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);

        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;

          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;

              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;

      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    } // Fallback for non-spec compliant Symbols which are polyfilled.


    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  } // Equivalent of `typeof` but with special handling for array and regexp.


  function getPropType(propValue) {
    var propType = _typeof$2(propValue);

    if (Array.isArray(propValue)) {
      return 'array';
    }

    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }

    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }

    return propType;
  } // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.


  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }

    var propType = getPropType(propValue);

    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }

    return propType;
  } // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"


  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);

    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;

      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;

      default:
        return type;
    }
  } // Returns class name of the object, if any.


  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }

    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

factoryWithTypeCheckers._r = [2];

// Therefore we re-export development-only version with all the PropTypes checks here.
// However if one is migrating to the `prop-types` npm library, they will go through the
// `index.js` entry point, and it will branch depending on the environment.


var factory_1 = function factory_1(isValidElement) {
  // It is still allowed in 15.5.
  var throwOnDirectAccess = false;
  return factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
};

factory_1._r = [2];

var isValidElement = ReactElement_1.isValidElement;
var ReactPropTypes = factory_1(isValidElement);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var ReactVersion = '15.6.2';

var MIXINS_KEY = 'mixins'; // Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.

function identity(fn) {
  return fn;
}

identity._r = [2];
{
  
}

function factory$1(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */
  var injectedMixins = [];
  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */

  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',
    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',
    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',
    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };
  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */

  var RESERVED_SPEC_KEYS = {
    displayName: function displayName(Constructor, _displayName) {
      Constructor.displayName = _displayName;
    },
    mixins: function mixins(Constructor, _mixins) {
      if (_mixins) {
        for (var i = 0; i < _mixins.length; i++) {
          mixSpecIntoComponent(Constructor, _mixins[i]);
        }
      }
    },
    childContextTypes: function childContextTypes(Constructor, _childContextTypes) {
      Constructor.childContextTypes = objectAssign({}, Constructor.childContextTypes, _childContextTypes);
    },
    contextTypes: function contextTypes(Constructor, _contextTypes) {
      Constructor.contextTypes = objectAssign({}, Constructor.contextTypes, _contextTypes);
    },

    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function getDefaultProps(Constructor, _getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, _getDefaultProps);
      } else {
        Constructor.getDefaultProps = _getDefaultProps;
      }
    },
    propTypes: function propTypes(Constructor, _propTypes) {
      Constructor.propTypes = objectAssign({}, Constructor.propTypes, _propTypes);
    },
    statics: function statics(Constructor, _statics) {
      mixStaticSpecIntoComponent(Constructor, _statics);
    },
    autobind: function autobind() {}
  };

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null; // Disallow overriding of base class methods unless explicitly allowed.

    if (ReactClassMixin.hasOwnProperty(name)) {
      invariant_1(specPolicy === 'OVERRIDE_BASE', 'ReactClassInterface: You are attempting to override ' + '`%s` from your class specification. Ensure that your method names ' + 'do not overlap with React methods.', name);
    } // Disallow defining methods more than once unless explicitly allowed.


    if (isAlreadyDefined) {
      invariant_1(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED', 'ReactClassInterface: You are attempting to define ' + '`%s` on your component more than once. This conflict may be due ' + 'to a mixin.', name);
    }
  }
  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */


  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      return;
    }

    invariant_1(typeof spec !== 'function', "ReactClass: You're attempting to " + 'use a component class or function as a mixin. Instead, just use a ' + 'regular object.');

    invariant_1(!isValidElement(spec), "ReactClass: You're attempting to " + 'use a component as a mixin. Instead, just use a regular object.');

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs; // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.

    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name]; // These cases should already be caught by validateMethodOverride.

            invariant_1(isReactClassMethod && (specPolicy === 'DEFINE_MANY_MERGED' || specPolicy === 'DEFINE_MANY'), 'ReactClass: Unexpected spec policy %s for key %s ' + 'when mixing in component specs.', specPolicy, name); // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.


            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;

            
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];

      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;

      invariant_1(!isReserved, 'ReactClass: You are attempting to define a reserved ' + 'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' + 'as an instance property instead; it will still be accessible on the ' + 'constructor.', name);

      var isInherited = name in Constructor;

      invariant_1(!isInherited, 'ReactClass: You are attempting to define ' + '`%s` on your component more than once. This conflict may be ' + 'due to a mixin.', name);

      Constructor[name] = property;
    }
  }
  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */


  function mergeIntoWithNoDuplicateKeys(one, two) {
    invariant_1(one && two && _typeof$2(one) === 'object' && _typeof$2(two) === 'object', 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.');

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        invariant_1(one[key] === undefined, 'mergeIntoWithNoDuplicateKeys(): ' + 'Tried to merge two objects with the same key: `%s`. This conflict ' + 'may be due to a mixin; in particular, this may be caused by two ' + 'getInitialState() or getDefaultProps() methods returning objects ' + 'with clashing keys.', key);

        one[key] = two[key];
      }
    }

    return one;
  }
  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */


  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);

      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }

      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }
  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */


  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }
  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */


  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);

    return boundMethod;
  }
  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */


  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;

    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function componentDidMount() {
      this.__isMounted = true;
    }
  };
  var IsMountedPostMixin = {
    componentWillUnmount: function componentWillUnmount() {
      this.__isMounted = false;
    }
  };
  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */

  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function replaceState(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function isMounted() {
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function ReactClassComponent() {};

  ReactClassComponent._r = [2];

  objectAssign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);
  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */


  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function (props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject_1;
      this.updater = updater || ReactNoopUpdateQueue;
      this.state = null; // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;

      invariant_1(_typeof$2(initialState) === 'object' && !Array.isArray(initialState), '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent');

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];
    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));
    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin); // Initialize the defaultProps property after all mixins have been merged.

    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    invariant_1(Constructor.prototype.render, 'createClass(...): Class specification must implement a `render` method.');

    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

factory$1._r = [2];
var factory_1$2 = factory$1;

var Component = ReactBaseClasses.Component;
var isValidElement$1 = ReactElement_1.isValidElement;
var createClass$3 = factory_1$2(Component, isValidElement$1, ReactNoopUpdateQueue_1);

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */


function onlyChild(children) {
  !ReactElement_1.isValidElement(children) ? reactProdInvariant_1('143') : void 0;
  return children;
}

onlyChild._r = [2];
var onlyChild_1 = onlyChild;

var createElement = ReactElement_1.createElement;
var createFactory = ReactElement_1.createFactory;
var cloneElement = ReactElement_1.cloneElement;

var __spread = objectAssign;

var createMixin = function createMixin(mixin) {
  return mixin;
};

createMixin._r = [2];

var React = {
  // Modern
  Children: {
    map: ReactChildren_1.map,
    forEach: ReactChildren_1.forEach,
    count: ReactChildren_1.count,
    toArray: ReactChildren_1.toArray,
    only: onlyChild_1
  },
  Component: ReactBaseClasses.Component,
  PureComponent: ReactBaseClasses.PureComponent,
  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement_1.isValidElement,
  // Classic
  PropTypes: ReactPropTypes,
  createClass: createClass$3,
  createFactory: createFactory,
  createMixin: createMixin,
  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories_1,
  version: ReactVersion,
  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};

var React_1 = React;

var react = React_1;
var react_1 = react.createElement;
var react_2 = react.Component;
var react_3 = react.Children;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant$1(code) {
  var argCount = arguments.length - 1;
  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';
  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

reactProdInvariant$1._r = [2];
var reactProdInvariant_1$2 = reactProdInvariant$1;

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

checkMask._r = [2];
var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_PROPERTY: 0x1,
  HAS_BOOLEAN_VALUE: 0x4,
  HAS_NUMERIC_VALUE: 0x8,
  HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * isCustomAttribute: function that given an attribute name will return true
   * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
   * attributes where it's impossible to enumerate all of the possible
   * attribute names,
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMAttributeNamespaces: object mapping React attribute name to the DOM
   * attribute namespace URL. (Attribute names not specified use no namespace.)
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function injectDOMPropertyConfig(domPropertyConfig) {
    var Injection = DOMPropertyInjection;
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    if (domPropertyConfig.isCustomAttribute) {
      DOMProperty._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute);
    }

    for (var propName in Properties) {
      !!DOMProperty.properties.hasOwnProperty(propName) ? reactProdInvariant_1$2('48', propName) : void 0;
      var lowerCased = propName.toLowerCase();
      var propConfig = Properties[propName];
      var propertyInfo = {
        attributeName: lowerCased,
        attributeNamespace: null,
        propertyName: propName,
        mutationMethod: null,
        mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
        hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
        hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
        hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
        hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE)
      };
      !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? reactProdInvariant_1$2('50', propName) : void 0;

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        var attributeName = DOMAttributeNames[propName];
        propertyInfo.attributeName = attributeName;

        
      }

      if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
        propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
      }

      if (DOMPropertyNames.hasOwnProperty(propName)) {
        propertyInfo.propertyName = DOMPropertyNames[propName];
      }

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        propertyInfo.mutationMethod = DOMMutationMethods[propName];
      }

      DOMProperty.properties[propName] = propertyInfo;
    }
  }
};
/* eslint-disable max-len */

var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
/* eslint-enable max-len */

/**
 * DOMProperty exports lookup objects that can be used like functions:
 *
 *   > DOMProperty.isValid['id']
 *   true
 *   > DOMProperty.isValid['foobar']
 *   undefined
 *
 * Although this may be confusing, it performs better in general.
 *
 * @see http://jsperf.com/key-exists
 * @see http://jsperf.com/key-missing
 */

var DOMProperty = {
  ID_ATTRIBUTE_NAME: 'data-reactid',
  ROOT_ATTRIBUTE_NAME: 'data-reactroot',
  ATTRIBUTE_NAME_START_CHAR: ATTRIBUTE_NAME_START_CHAR,
  ATTRIBUTE_NAME_CHAR: ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040",

  /**
   * Map from property "standard name" to an object with info about how to set
   * the property in the DOM. Each object contains:
   *
   * attributeName:
   *   Used when rendering markup or with `*Attribute()`.
   * attributeNamespace
   * propertyName:
   *   Used on DOM node instances. (This includes properties that mutate due to
   *   external factors.)
   * mutationMethod:
   *   If non-null, used instead of the property or `setAttribute()` after
   *   initial render.
   * mustUseProperty:
   *   Whether the property must be accessed and mutated as an object property.
   * hasBooleanValue:
   *   Whether the property should be removed when set to a falsey value.
   * hasNumericValue:
   *   Whether the property must be numeric or parse as a numeric and should be
   *   removed when set to a falsey value.
   * hasPositiveNumericValue:
   *   Whether the property must be positive numeric or parse as a positive
   *   numeric and should be removed when set to a falsey value.
   * hasOverloadedBooleanValue:
   *   Whether the property can be used as a flag as well as with a value.
   *   Removed when strictly equal to false; present without a value when
   *   strictly equal to true; present with a value otherwise.
   */
  properties: {},

  /**
   * Mapping from lowercase property names to the properly cased version, used
   * to warn in the case of missing properties. Available only in __DEV__.
   *
   * autofocus is predefined, because adding it to the property whitelist
   * causes unintended side effects.
   *
   * @type {Object}
   */
  getPossibleStandardName: null,

  /**
   * All of the isCustomAttribute() functions that have been injected.
   */
  _isCustomAttributeFunctions: [],

  /**
   * Checks whether a property name is a custom attribute.
   * @method
   */
  isCustomAttribute: function isCustomAttribute(attributeName) {
    for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
      var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];

      if (isCustomAttributeFn(attributeName)) {
        return true;
      }
    }

    return false;
  },
  injection: DOMPropertyInjection
};
var DOMProperty_1 = DOMProperty;

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var ReactDOMComponentFlags = {
  hasCachedChildNodes: 1 << 0
};
var ReactDOMComponentFlags_1 = ReactDOMComponentFlags;

var ATTR_NAME = DOMProperty_1.ID_ATTRIBUTE_NAME;
var Flags = ReactDOMComponentFlags_1;
var internalInstanceKey = '__reactInternalInstance$' + Math.random().toString(36).slice(2);
/**
 * Check if a given node should be cached.
 */

function shouldPrecacheNode(node, nodeID) {
  return node.nodeType === 1 && node.getAttribute(ATTR_NAME) === String(nodeID) || node.nodeType === 8 && node.nodeValue === ' react-text: ' + nodeID + ' ' || node.nodeType === 8 && node.nodeValue === ' react-empty: ' + nodeID + ' ';
}
/**
 * Drill down (through composites and empty components) until we get a host or
 * host text component.
 *
 * This is pretty polymorphic but unavoidable with the current structure we have
 * for `_renderedChildren`.
 */


shouldPrecacheNode._r = [2];

function getRenderedHostOrTextFromComponent(component) {
  var rendered;

  while (rendered = component._renderedComponent) {
    component = rendered;
  }

  return component;
}
/**
 * Populate `_hostNode` on the rendered host/text component with the given
 * DOM node. The passed `inst` can be a composite.
 */


getRenderedHostOrTextFromComponent._r = [2];

function precacheNode(inst, node) {
  var hostInst = getRenderedHostOrTextFromComponent(inst);
  hostInst._hostNode = node;
  node[internalInstanceKey] = hostInst;
}

precacheNode._r = [2];

function uncacheNode(inst) {
  var node = inst._hostNode;

  if (node) {
    delete node[internalInstanceKey];
    inst._hostNode = null;
  }
}
/**
 * Populate `_hostNode` on each child of `inst`, assuming that the children
 * match up with the DOM (element) children of `node`.
 *
 * We cache entire levels at once to avoid an n^2 problem where we access the
 * children of a node sequentially and have to walk from the start to our target
 * node every time.
 *
 * Since we update `_renderedChildren` and the actual DOM at (slightly)
 * different times, we could race here and see a newer `_renderedChildren` than
 * the DOM nodes we see. To avoid this, ReactMultiChild calls
 * `prepareToManageChildren` before we change `_renderedChildren`, at which
 * time the container's child nodes are always cached (until it unmounts).
 */


uncacheNode._r = [2];

function precacheChildNodes(inst, node) {
  if (inst._flags & Flags.hasCachedChildNodes) {
    return;
  }

  var children = inst._renderedChildren;
  var childNode = node.firstChild;

  outer: for (var name in children) {
    if (!children.hasOwnProperty(name)) {
      continue;
    }

    var childInst = children[name];

    var childID = getRenderedHostOrTextFromComponent(childInst)._domID;

    if (childID === 0) {
      // We're currently unmounting this child in ReactMultiChild; skip it.
      continue;
    } // We assume the child nodes are in the same order as the child instances.


    for (; childNode !== null; childNode = childNode.nextSibling) {
      if (shouldPrecacheNode(childNode, childID)) {
        precacheNode(childInst, childNode);
        continue outer;
      }
    } // We reached the end of the DOM children without finding an ID match.


    reactProdInvariant_1$2('32', childID);
  }

  inst._flags |= Flags.hasCachedChildNodes;
}
/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */


precacheChildNodes._r = [2];

function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey];
  } // Walk up the tree until we find an ancestor whose instance we have cached.


  var parents = [];

  while (!node[internalInstanceKey]) {
    parents.push(node);

    if (node.parentNode) {
      node = node.parentNode;
    } else {
      // Top of the tree. This node must not be part of a React tree (or is
      // unmounted, potentially).
      return null;
    }
  }

  var closest;
  var inst;

  for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
    closest = inst;

    if (parents.length) {
      precacheChildNodes(inst, node);
    }
  }

  return closest;
}
/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */


getClosestInstanceFromNode._r = [2];

function getInstanceFromNode(node) {
  var inst = getClosestInstanceFromNode(node);

  if (inst != null && inst._hostNode === node) {
    return inst;
  } else {
    return null;
  }
}
/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */


getInstanceFromNode._r = [2];

function getNodeFromInstance(inst) {
  // Without this first invariant, passing a non-DOM-component triggers the next
  // invariant for a missing parent, which is super confusing.
  !(inst._hostNode !== undefined) ? reactProdInvariant_1$2('33') : void 0;

  if (inst._hostNode) {
    return inst._hostNode;
  } // Walk up the tree until we find an ancestor whose DOM node we have cached.


  var parents = [];

  while (!inst._hostNode) {
    parents.push(inst);
    !inst._hostParent ? reactProdInvariant_1$2('34') : void 0;
    inst = inst._hostParent;
  } // Now parents contains each ancestor that does *not* have a cached native
  // node, and `inst` is the deepest ancestor that does.


  for (; parents.length; inst = parents.pop()) {
    precacheChildNodes(inst, inst._hostNode);
  }

  return inst._hostNode;
}

getNodeFromInstance._r = [2];
var ReactDOMComponentTree = {
  getClosestInstanceFromNode: getClosestInstanceFromNode,
  getInstanceFromNode: getInstanceFromNode,
  getNodeFromInstance: getNodeFromInstance,
  precacheChildNodes: precacheChildNodes,
  precacheNode: precacheNode,
  uncacheNode: uncacheNode
};
var ReactDOMComponentTree_1 = ReactDOMComponentTree;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var ARIADOMPropertyConfig = {
  Properties: {
    // Global States and Properties
    'aria-current': 0,
    // state
    'aria-details': 0,
    'aria-disabled': 0,
    // state
    'aria-hidden': 0,
    // state
    'aria-invalid': 0,
    // state
    'aria-keyshortcuts': 0,
    'aria-label': 0,
    'aria-roledescription': 0,
    // Widget Attributes
    'aria-autocomplete': 0,
    'aria-checked': 0,
    'aria-expanded': 0,
    'aria-haspopup': 0,
    'aria-level': 0,
    'aria-modal': 0,
    'aria-multiline': 0,
    'aria-multiselectable': 0,
    'aria-orientation': 0,
    'aria-placeholder': 0,
    'aria-pressed': 0,
    'aria-readonly': 0,
    'aria-required': 0,
    'aria-selected': 0,
    'aria-sort': 0,
    'aria-valuemax': 0,
    'aria-valuemin': 0,
    'aria-valuenow': 0,
    'aria-valuetext': 0,
    // Live Region Attributes
    'aria-atomic': 0,
    'aria-busy': 0,
    'aria-live': 0,
    'aria-relevant': 0,
    // Drag-and-Drop Attributes
    'aria-dropeffect': 0,
    'aria-grabbed': 0,
    // Relationship Attributes
    'aria-activedescendant': 0,
    'aria-colcount': 0,
    'aria-colindex': 0,
    'aria-colspan': 0,
    'aria-controls': 0,
    'aria-describedby': 0,
    'aria-errormessage': 0,
    'aria-flowto': 0,
    'aria-labelledby': 0,
    'aria-owns': 0,
    'aria-posinset': 0,
    'aria-rowcount': 0,
    'aria-rowindex': 0,
    'aria-rowspan': 0,
    'aria-setsize': 0
  },
  DOMAttributeNames: {},
  DOMPropertyNames: {}
};
var ARIADOMPropertyConfig_1 = ARIADOMPropertyConfig;

/**
 * Injectable ordering of event plugins.
 */


var eventPluginOrder = null;
/**
 * Injectable mapping from names to event plugin modules.
 */

var namesToPlugins = {};
/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */

function recomputePluginOrdering() {
  if (!eventPluginOrder) {
    // Wait until an `eventPluginOrder` is injected.
    return;
  }

  for (var pluginName in namesToPlugins) {
    var pluginModule = namesToPlugins[pluginName];
    var pluginIndex = eventPluginOrder.indexOf(pluginName);
    !(pluginIndex > -1) ? reactProdInvariant_1$2('96', pluginName) : void 0;

    if (EventPluginRegistry.plugins[pluginIndex]) {
      continue;
    }

    !pluginModule.extractEvents ? reactProdInvariant_1$2('97', pluginName) : void 0;
    EventPluginRegistry.plugins[pluginIndex] = pluginModule;
    var publishedEvents = pluginModule.eventTypes;

    for (var eventName in publishedEvents) {
      !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName) ? reactProdInvariant_1$2('98', eventName, pluginName) : void 0;
    }
  }
}
/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */


recomputePluginOrdering._r = [2];

function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
  !!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName) ? reactProdInvariant_1$2('99', eventName) : void 0;
  EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;
  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
      }
    }

    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
    return true;
  }

  return false;
}
/**
 * Publishes a registration name that is used to identify dispatched events and
 * can be used with `EventPluginHub.putListener` to register listeners.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */


publishEventForPlugin._r = [2];

function publishRegistrationName(registrationName, pluginModule, eventName) {
  !!EventPluginRegistry.registrationNameModules[registrationName] ? reactProdInvariant_1$2('100', registrationName) : void 0;
  EventPluginRegistry.registrationNameModules[registrationName] = pluginModule;
  EventPluginRegistry.registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;

  
}
/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */


publishRegistrationName._r = [2];
var EventPluginRegistry = {
  /**
   * Ordered list of injected plugins.
   */
  plugins: [],

  /**
   * Mapping from event name to dispatch config
   */
  eventNameDispatchConfigs: {},

  /**
   * Mapping from registration name to plugin module
   */
  registrationNameModules: {},

  /**
   * Mapping from registration name to event name
   */
  registrationNameDependencies: {},

  /**
   * Mapping from lowercase registration names to the properly cased version,
   * used to warn in the case of missing event handlers. Available
   * only in __DEV__.
   * @type {Object}
   */
  possibleRegistrationNames: null,
  // Trust the developer to only use possibleRegistrationNames in __DEV__

  /**
   * Injects an ordering of plugins (by plugin name). This allows the ordering
   * to be decoupled from injection of the actual plugins so that ordering is
   * always deterministic regardless of packaging, on-the-fly injection, etc.
   *
   * @param {array} InjectedEventPluginOrder
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginOrder}
   */
  injectEventPluginOrder: function injectEventPluginOrder(injectedEventPluginOrder) {
    !!eventPluginOrder ? reactProdInvariant_1$2('101') : void 0; // Clone the ordering so it cannot be dynamically mutated.

    eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
    recomputePluginOrdering();
  },

  /**
   * Injects plugins to be used by `EventPluginHub`. The plugin names must be
   * in the ordering injected by `injectEventPluginOrder`.
   *
   * Plugins can be injected as part of page initialization or on-the-fly.
   *
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginsByName}
   */
  injectEventPluginsByName: function injectEventPluginsByName(injectedNamesToPlugins) {
    var isOrderingDirty = false;

    for (var pluginName in injectedNamesToPlugins) {
      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
        continue;
      }

      var pluginModule = injectedNamesToPlugins[pluginName];

      if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
        !!namesToPlugins[pluginName] ? reactProdInvariant_1$2('102', pluginName) : void 0;
        namesToPlugins[pluginName] = pluginModule;
        isOrderingDirty = true;
      }
    }

    if (isOrderingDirty) {
      recomputePluginOrdering();
    }
  },

  /**
   * Looks up the plugin for the supplied event.
   *
   * @param {object} event A synthetic event.
   * @return {?object} The plugin that created the supplied event.
   * @internal
   */
  getPluginModuleForEvent: function getPluginModuleForEvent(event) {
    var dispatchConfig = event.dispatchConfig;

    if (dispatchConfig.registrationName) {
      return EventPluginRegistry.registrationNameModules[dispatchConfig.registrationName] || null;
    }

    if (dispatchConfig.phasedRegistrationNames !== undefined) {
      // pulling phasedRegistrationNames out of dispatchConfig helps Flow see
      // that it is not undefined.
      var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

      for (var phase in phasedRegistrationNames) {
        if (!phasedRegistrationNames.hasOwnProperty(phase)) {
          continue;
        }

        var pluginModule = EventPluginRegistry.registrationNameModules[phasedRegistrationNames[phase]];

        if (pluginModule) {
          return pluginModule;
        }
      }
    }

    return null;
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _resetEventPlugins: function _resetEventPlugins() {
    eventPluginOrder = null;

    for (var pluginName in namesToPlugins) {
      if (namesToPlugins.hasOwnProperty(pluginName)) {
        delete namesToPlugins[pluginName];
      }
    }

    EventPluginRegistry.plugins.length = 0;
    var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;

    for (var eventName in eventNameDispatchConfigs) {
      if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
        delete eventNameDispatchConfigs[eventName];
      }
    }

    var registrationNameModules = EventPluginRegistry.registrationNameModules;

    for (var registrationName in registrationNameModules) {
      if (registrationNameModules.hasOwnProperty(registrationName)) {
        delete registrationNameModules[registrationName];
      }
    }

    
  }
};
var EventPluginRegistry_1 = EventPluginRegistry;

var caughtError = null;
/**
 * Call a function while guarding against errors that happens within it.
 *
 * @param {String} name of the guard to use for logging or debugging
 * @param {Function} func The function to invoke
 * @param {*} a First argument
 * @param {*} b Second argument
 */

function invokeGuardedCallback(name, func, a) {
  try {
    func(a);
  } catch (x) {
    if (caughtError === null) {
      caughtError = x;
    }
  }
}

invokeGuardedCallback._r = [2];
var ReactErrorUtils = {
  invokeGuardedCallback: invokeGuardedCallback,

  /**
   * Invoked by ReactTestUtils.Simulate so that any errors thrown by the event
   * handler are sure to be rethrown by rethrowCaughtError.
   */
  invokeGuardedCallbackWithCatch: invokeGuardedCallback,

  /**
   * During execution of guarded functions we will capture the first error which
   * we will rethrow to be handled by the top level error handler.
   */
  rethrowCaughtError: function rethrowCaughtError() {
    if (caughtError) {
      var error = caughtError;
      caughtError = null;
      throw error;
    }
  }
};

var ReactErrorUtils_1 = ReactErrorUtils;

/**
 * Injected dependencies:
 */

/**
 * - `ComponentTree`: [required] Module that can convert between React instances
 *   and actual node references.
 */


var ComponentTree;
var TreeTraversal;
var injection = {
  injectComponentTree: function injectComponentTree(Injected) {
    ComponentTree = Injected;

    
  },
  injectTreeTraversal: function injectTreeTraversal(Injected) {
    TreeTraversal = Injected;

    
  }
};

function isEndish(topLevelType) {
  return topLevelType === 'topMouseUp' || topLevelType === 'topTouchEnd' || topLevelType === 'topTouchCancel';
}

isEndish._r = [2];

function isMoveish(topLevelType) {
  return topLevelType === 'topMouseMove' || topLevelType === 'topTouchMove';
}

isMoveish._r = [2];

function isStartish(topLevelType) {
  return topLevelType === 'topMouseDown' || topLevelType === 'topTouchStart';
}

isStartish._r = [2];
/**
 * Dispatch the event to the listener.
 * @param {SyntheticEvent} event SyntheticEvent to handle
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @param {function} listener Application-level callback
 * @param {*} inst Internal component instance
 */


function executeDispatch(event, simulated, listener, inst) {
  var type = event.type || 'unknown-event';
  event.currentTarget = EventPluginUtils.getNodeFromInstance(inst);

  if (simulated) {
    ReactErrorUtils_1.invokeGuardedCallbackWithCatch(type, listener, event);
  } else {
    ReactErrorUtils_1.invokeGuardedCallback(type, listener, event);
  }

  event.currentTarget = null;
}
/**
 * Standard/simple iteration through an event's collected dispatches.
 */


executeDispatch._r = [2];

function executeDispatchesInOrder(event, simulated) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      } // Listeners and Instances are two parallel arrays that are always in sync.


      executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
  }

  event._dispatchListeners = null;
  event._dispatchInstances = null;
}
/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return {?string} id of the first dispatch execution who's listener returns
 * true, or null if no listener returned true.
 */


executeDispatchesInOrder._r = [2];

function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      } // Listeners and Instances are two parallel arrays that are always in sync.


      if (dispatchListeners[i](event, dispatchInstances[i])) {
        return dispatchInstances[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchInstances)) {
      return dispatchInstances;
    }
  }

  return null;
}
/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */


executeDispatchesInOrderStopAtTrueImpl._r = [2];

function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchInstances = null;
  event._dispatchListeners = null;
  return ret;
}
/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */


executeDispatchesInOrderStopAtTrue._r = [2];

function executeDirectDispatch(event) {
  var dispatchListener = event._dispatchListeners;
  var dispatchInstance = event._dispatchInstances;
  !!Array.isArray(dispatchListener) ? reactProdInvariant_1$2('103') : void 0;
  event.currentTarget = dispatchListener ? EventPluginUtils.getNodeFromInstance(dispatchInstance) : null;
  var res = dispatchListener ? dispatchListener(event) : null;
  event.currentTarget = null;
  event._dispatchListeners = null;
  event._dispatchInstances = null;
  return res;
}
/**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */


executeDirectDispatch._r = [2];

function hasDispatches(event) {
  return !!event._dispatchListeners;
}
/**
 * General utilities that are useful in creating custom Event Plugins.
 */


hasDispatches._r = [2];
var EventPluginUtils = {
  isEndish: isEndish,
  isMoveish: isMoveish,
  isStartish: isStartish,
  executeDirectDispatch: executeDirectDispatch,
  executeDispatchesInOrder: executeDispatchesInOrder,
  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
  hasDispatches: hasDispatches,
  getInstanceFromNode: function getInstanceFromNode(node) {
    return ComponentTree.getInstanceFromNode(node);
  },
  getNodeFromInstance: function getNodeFromInstance(node) {
    return ComponentTree.getNodeFromInstance(node);
  },
  isAncestor: function isAncestor(a, b) {
    return TreeTraversal.isAncestor(a, b);
  },
  getLowestCommonAncestor: function getLowestCommonAncestor(a, b) {
    return TreeTraversal.getLowestCommonAncestor(a, b);
  },
  getParentInstance: function getParentInstance(inst) {
    return TreeTraversal.getParentInstance(inst);
  },
  traverseTwoPhase: function traverseTwoPhase(target, fn, arg) {
    return TreeTraversal.traverseTwoPhase(target, fn, arg);
  },
  traverseEnterLeave: function traverseEnterLeave(from, to, fn, argFrom, argTo) {
    return TreeTraversal.traverseEnterLeave(from, to, fn, argFrom, argTo);
  },
  injection: injection
};
var EventPluginUtils_1 = EventPluginUtils;

/**
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */


function accumulateInto(current, next) {
  !(next != null) ? reactProdInvariant_1$2('30') : void 0;

  if (current == null) {
    return next;
  } // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).


  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }

    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

accumulateInto._r = [2];
var accumulateInto_1 = accumulateInto;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * @param {array} arr an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 */

function forEachAccumulated(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
}

forEachAccumulated._r = [2];
var forEachAccumulated_1 = forEachAccumulated;

/**
 * Internal store for event listeners
 */


var listenerBank = {};
/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */

var eventQueue = null;
/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @private
 */

var executeDispatchesAndRelease = function executeDispatchesAndRelease(event, simulated) {
  if (event) {
    EventPluginUtils_1.executeDispatchesInOrder(event, simulated);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};

executeDispatchesAndRelease._r = [2];

var executeDispatchesAndReleaseSimulated = function executeDispatchesAndReleaseSimulated(e) {
  return executeDispatchesAndRelease(e, true);
};

executeDispatchesAndReleaseSimulated._r = [2];

var executeDispatchesAndReleaseTopLevel = function executeDispatchesAndReleaseTopLevel(e) {
  return executeDispatchesAndRelease(e, false);
};

executeDispatchesAndReleaseTopLevel._r = [2];

var getDictionaryKey = function getDictionaryKey(inst) {
  // Prevents V8 performance issue:
  // https://github.com/facebook/react/pull/7232
  return '.' + inst._rootNodeID;
};

getDictionaryKey._r = [2];

function isInteractive(tag) {
  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
}

isInteractive._r = [2];

function shouldPreventMouseEvent(name, type, props) {
  switch (name) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
      return !!(props.disabled && isInteractive(type));

    default:
      return false;
  }
}
/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */


shouldPreventMouseEvent._r = [2];
var EventPluginHub = {
  /**
   * Methods for injecting dependencies.
   */
  injection: {
    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder: EventPluginRegistry_1.injectEventPluginOrder,

    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName: EventPluginRegistry_1.injectEventPluginsByName
  },

  /**
   * Stores `listener` at `listenerBank[registrationName][key]`. Is idempotent.
   *
   * @param {object} inst The instance, which is the source of events.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {function} listener The callback to store.
   */
  putListener: function putListener(inst, registrationName, listener) {
    !(typeof listener === 'function') ? reactProdInvariant_1$2('94', registrationName, _typeof$2(listener)) : void 0;
    var key = getDictionaryKey(inst);
    var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[key] = listener;
    var PluginModule = EventPluginRegistry_1.registrationNameModules[registrationName];

    if (PluginModule && PluginModule.didPutListener) {
      PluginModule.didPutListener(inst, registrationName, listener);
    }
  },

  /**
   * @param {object} inst The instance, which is the source of events.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */
  getListener: function getListener(inst, registrationName) {
    // TODO: shouldPreventMouseEvent is DOM-specific and definitely should not
    // live here; needs to be moved to a better place soon
    var bankForRegistrationName = listenerBank[registrationName];

    if (shouldPreventMouseEvent(registrationName, inst._currentElement.type, inst._currentElement.props)) {
      return null;
    }

    var key = getDictionaryKey(inst);
    return bankForRegistrationName && bankForRegistrationName[key];
  },

  /**
   * Deletes a listener from the registration bank.
   *
   * @param {object} inst The instance, which is the source of events.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   */
  deleteListener: function deleteListener(inst, registrationName) {
    var PluginModule = EventPluginRegistry_1.registrationNameModules[registrationName];

    if (PluginModule && PluginModule.willDeleteListener) {
      PluginModule.willDeleteListener(inst, registrationName);
    }

    var bankForRegistrationName = listenerBank[registrationName]; // TODO: This should never be null -- when is it?

    if (bankForRegistrationName) {
      var key = getDictionaryKey(inst);
      delete bankForRegistrationName[key];
    }
  },

  /**
   * Deletes all listeners for the DOM element with the supplied ID.
   *
   * @param {object} inst The instance, which is the source of events.
   */
  deleteAllListeners: function deleteAllListeners(inst) {
    var key = getDictionaryKey(inst);

    for (var registrationName in listenerBank) {
      if (!listenerBank.hasOwnProperty(registrationName)) {
        continue;
      }

      if (!listenerBank[registrationName][key]) {
        continue;
      }

      var PluginModule = EventPluginRegistry_1.registrationNameModules[registrationName];

      if (PluginModule && PluginModule.willDeleteListener) {
        PluginModule.willDeleteListener(inst, registrationName);
      }

      delete listenerBank[registrationName][key];
    }
  },

  /**
   * Allows registered plugins an opportunity to extract events from top-level
   * native browser events.
   *
   * @return {*} An accumulation of synthetic events.
   * @internal
   */
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events;
    var plugins = EventPluginRegistry_1.plugins;

    for (var i = 0; i < plugins.length; i++) {
      // Not every plugin in the ordering may be loaded at runtime.
      var possiblePlugin = plugins[i];

      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);

        if (extractedEvents) {
          events = accumulateInto_1(events, extractedEvents);
        }
      }
    }

    return events;
  },

  /**
   * Enqueues a synthetic event that should be dispatched when
   * `processEventQueue` is invoked.
   *
   * @param {*} events An accumulation of synthetic events.
   * @internal
   */
  enqueueEvents: function enqueueEvents(events) {
    if (events) {
      eventQueue = accumulateInto_1(eventQueue, events);
    }
  },

  /**
   * Dispatches all synthetic events on the event queue.
   *
   * @internal
   */
  processEventQueue: function processEventQueue(simulated) {
    // Set `eventQueue` to null before processing it so that we can tell if more
    // events get enqueued while processing.
    var processingEventQueue = eventQueue;
    eventQueue = null;

    if (simulated) {
      forEachAccumulated_1(processingEventQueue, executeDispatchesAndReleaseSimulated);
    } else {
      forEachAccumulated_1(processingEventQueue, executeDispatchesAndReleaseTopLevel);
    }

    !!eventQueue ? reactProdInvariant_1$2('95') : void 0; // This would be a good time to rethrow if any of the event handlers threw.

    ReactErrorUtils_1.rethrowCaughtError();
  },

  /**
   * These are needed for tests only. Do not use!
   */
  __purge: function __purge() {
    listenerBank = {};
  },
  __getListenerBank: function __getListenerBank() {
    return listenerBank;
  }
};
var EventPluginHub_1 = EventPluginHub;

var getListener = EventPluginHub_1.getListener;
/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */

function listenerAtPhase(inst, event, propagationPhase) {
  var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(inst, registrationName);
}
/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */


listenerAtPhase._r = [2];

function accumulateDirectionalDispatches(inst, phase, event) {
  var listener = listenerAtPhase(inst, event, phase);

  if (listener) {
    event._dispatchListeners = accumulateInto_1(event._dispatchListeners, listener);
    event._dispatchInstances = accumulateInto_1(event._dispatchInstances, inst);
  }
}
/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We cannot perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */


accumulateDirectionalDispatches._r = [2];

function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    EventPluginUtils_1.traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
}
/**
 * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
 */


accumulateTwoPhaseDispatchesSingle._r = [2];

function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    var targetInst = event._targetInst;
    var parentInst = targetInst ? EventPluginUtils_1.getParentInstance(targetInst) : null;
    EventPluginUtils_1.traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
  }
}
/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */


accumulateTwoPhaseDispatchesSingleSkipTarget._r = [2];

function accumulateDispatches(inst, ignoredDirection, event) {
  if (event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(inst, registrationName);

    if (listener) {
      event._dispatchListeners = accumulateInto_1(event._dispatchListeners, listener);
      event._dispatchInstances = accumulateInto_1(event._dispatchInstances, inst);
    }
  }
}
/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */


accumulateDispatches._r = [2];

function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event._targetInst, null, event);
  }
}

accumulateDirectDispatchesSingle._r = [2];

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated_1(events, accumulateTwoPhaseDispatchesSingle);
}

accumulateTwoPhaseDispatches._r = [2];

function accumulateTwoPhaseDispatchesSkipTarget(events) {
  forEachAccumulated_1(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
}

accumulateTwoPhaseDispatchesSkipTarget._r = [2];

function accumulateEnterLeaveDispatches(leave, enter, from, to) {
  EventPluginUtils_1.traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
}

accumulateEnterLeaveDispatches._r = [2];

function accumulateDirectDispatches(events) {
  forEachAccumulated_1(events, accumulateDirectDispatchesSingle);
}
/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing event a
 * single one.
 *
 * @constructor EventPropagators
 */


accumulateDirectDispatches._r = [2];
var EventPropagators = {
  accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
  accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
  accumulateDirectDispatches: accumulateDirectDispatches,
  accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
};
var EventPropagators_1 = EventPropagators;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */

var ExecutionEnvironment$1 = {
  canUseDOM: canUseDOM,
  canUseWorkers: typeof Worker !== 'undefined',
  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
  canUseViewport: canUseDOM && !!window.screen,
  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};
var ExecutionEnvironment_1 = ExecutionEnvironment$1;

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */


var oneArgumentPooler$1 = function oneArgumentPooler(copyFieldsFrom) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

oneArgumentPooler$1._r = [2];

var twoArgumentPooler$2 = function twoArgumentPooler(a1, a2) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

twoArgumentPooler$2._r = [2];

var threeArgumentPooler$1 = function threeArgumentPooler(a1, a2, a3) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

threeArgumentPooler$1._r = [2];

var fourArgumentPooler$2 = function fourArgumentPooler(a1, a2, a3, a4) {
  var Klass = this;

  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

fourArgumentPooler$2._r = [2];

var standardReleaser$1 = function standardReleaser(instance) {
  var Klass = this;
  !(instance instanceof Klass) ? reactProdInvariant_1$2('25') : void 0;
  instance.destructor();

  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

standardReleaser$1._r = [2];
var DEFAULT_POOL_SIZE$1 = 10;
var DEFAULT_POOLER$1 = oneArgumentPooler$1;
/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */

var addPoolingTo$1 = function addPoolingTo(CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER$1;

  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE$1;
  }

  NewKlass.release = standardReleaser$1;
  return NewKlass;
};

addPoolingTo$1._r = [2];
var PooledClass$2 = {
  addPoolingTo: addPoolingTo$1,
  oneArgumentPooler: oneArgumentPooler$1,
  twoArgumentPooler: twoArgumentPooler$2,
  threeArgumentPooler: threeArgumentPooler$1,
  fourArgumentPooler: fourArgumentPooler$2
};
var PooledClass_1$2 = PooledClass$2;

var contentKey = null;
/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */

function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment_1.canUseDOM) {
    // Prefer textContent to innerText because many browsers support both but
    // SVG <text> elements don't support innerText even when <div> does.
    contentKey = 'textContent' in document.documentElement ? 'textContent' : 'innerText';
  }

  return contentKey;
}

getTextContentAccessor._r = [2];
var getTextContentAccessor_1 = getTextContentAccessor;

/**
 * This helper class stores information about text content of a target node,
 * allowing comparison of content before and after a given event.
 *
 * Identify the node where selection currently begins, then observe
 * both its text content and its current position in the DOM. Since the
 * browser may natively replace the target node during composition, we can
 * use its position to find its replacement.
 *
 * @param {DOMEventTarget} root
 */


function FallbackCompositionState(root) {
  this._root = root;
  this._startText = this.getText();
  this._fallbackText = null;
}

FallbackCompositionState._r = [2];

objectAssign(FallbackCompositionState.prototype, {
  destructor: function destructor() {
    this._root = null;
    this._startText = null;
    this._fallbackText = null;
  },

  /**
   * Get current text of input.
   *
   * @return {string}
   */
  getText: function getText() {
    if ('value' in this._root) {
      return this._root.value;
    }

    return this._root[getTextContentAccessor_1()];
  },

  /**
   * Determine the differing substring between the initially stored
   * text content and the current content.
   *
   * @return {string}
   */
  getData: function getData() {
    if (this._fallbackText) {
      return this._fallbackText;
    }

    var start;
    var startValue = this._startText;
    var startLength = startValue.length;
    var end;
    var endValue = this.getText();
    var endLength = endValue.length;

    for (start = 0; start < startLength; start++) {
      if (startValue[start] !== endValue[start]) {
        break;
      }
    }

    var minEnd = startLength - start;

    for (end = 1; end <= minEnd; end++) {
      if (startValue[startLength - end] !== endValue[endLength - end]) {
        break;
      }
    }

    var sliceTail = end > 1 ? 1 - end : undefined;
    this._fallbackText = endValue.slice(start, sliceTail);
    return this._fallbackText;
  }
});

PooledClass_1$2.addPoolingTo(FallbackCompositionState);
var FallbackCompositionState_1 = FallbackCompositionState;

var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];
/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var EventInterface = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction_1.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function timeStamp(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};
/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {*} targetInst Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @param {DOMEventTarget} nativeEventTarget Target node.
 */

function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst;
  this.nativeEvent = nativeEvent;
  var Interface = this.constructor.Interface;

  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }

    var normalize = Interface[propName];

    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      if (propName === 'target') {
        this.target = nativeEventTarget;
      } else {
        this[propName] = nativeEvent[propName];
      }
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;

  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction_1.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction_1.thatReturnsFalse;
  }

  this.isPropagationStopped = emptyFunction_1.thatReturnsFalse;
  return this;
}

SyntheticEvent._r = [2];

objectAssign(SyntheticEvent.prototype, {
  preventDefault: function preventDefault() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;

    if (!event) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault(); // eslint-disable-next-line valid-typeof
    } else if (typeof event.returnValue !== 'unknown') {
      event.returnValue = false;
    }

    this.isDefaultPrevented = emptyFunction_1.thatReturnsTrue;
  },
  stopPropagation: function stopPropagation() {
    var event = this.nativeEvent;

    if (!event) {
      return;
    }

    if (event.stopPropagation) {
      event.stopPropagation(); // eslint-disable-next-line valid-typeof
    } else if (typeof event.cancelBubble !== 'unknown') {
      // The ChangeEventPlugin registers a "propertychange" event for
      // IE. This event does not support bubbling or cancelling, and
      // any references to cancelBubble throw "Member not found".  A
      // typeof check of "unknown" circumvents this issue (and is also
      // IE specific).
      event.cancelBubble = true;
    }

    this.isPropagationStopped = emptyFunction_1.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function persist() {
    this.isPersistent = emptyFunction_1.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction_1.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function destructor() {
    var Interface = this.constructor.Interface;

    for (var propName in Interface) {
      {
        this[propName] = null;
      }
    }

    for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
      this[shouldBeReleasedProperties[i]] = null;
    }

    
  }
});

SyntheticEvent.Interface = EventInterface;
/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */

SyntheticEvent.augmentClass = function (Class, Interface) {
  var Super = this;

  var E = function E() {};

  E._r = [2];
  E.prototype = Super.prototype;
  var prototype = new E();

  objectAssign(prototype, Class.prototype);

  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.Interface = objectAssign({}, Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;
  PooledClass_1$2.addPoolingTo(Class, PooledClass_1$2.fourArgumentPooler);
};
/** Proxying after everything set on SyntheticEvent
  * to resolve Proxy issue on some WebKit browsers
  * in which some Event properties are set to undefined (GH#10010)
  */


PooledClass_1$2.addPoolingTo(SyntheticEvent, PooledClass_1$2.fourArgumentPooler);
var SyntheticEvent_1 = SyntheticEvent;

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */


var CompositionEventInterface = {
  data: null
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticCompositionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticCompositionEvent._r = [2];
SyntheticEvent_1.augmentClass(SyntheticCompositionEvent, CompositionEventInterface);
var SyntheticCompositionEvent_1 = SyntheticCompositionEvent;

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */


var InputEventInterface = {
  data: null
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticInputEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticInputEvent._r = [2];
SyntheticEvent_1.augmentClass(SyntheticInputEvent, InputEventInterface);
var SyntheticInputEvent_1 = SyntheticInputEvent;

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space

var START_KEYCODE = 229;
var canUseCompositionEvent = ExecutionEnvironment_1.canUseDOM && 'CompositionEvent' in window;
var documentMode = null;

if (ExecutionEnvironment_1.canUseDOM && 'documentMode' in document) {
  documentMode = document.documentMode;
} // Webkit offers a very useful `textInput` event that can be used to
// directly represent `beforeInput`. The IE `textinput` event is not as
// useful, so we don't use it.


var canUseTextInputEvent = ExecutionEnvironment_1.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto(); // In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. Japanese ideographic
// spaces, for instance (\u3000) are not recorded correctly.

var useFallbackCompositionData = ExecutionEnvironment_1.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);
/**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */

function isPresto() {
  var opera = window.opera;
  return _typeof$2(opera) === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
}

isPresto._r = [2];
var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE); // Events and their corresponding property names.

var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: 'onBeforeInput',
      captured: 'onBeforeInputCapture'
    },
    dependencies: ['topCompositionEnd', 'topKeyPress', 'topTextInput', 'topPaste']
  },
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionEnd',
      captured: 'onCompositionEndCapture'
    },
    dependencies: ['topBlur', 'topCompositionEnd', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionStart',
      captured: 'onCompositionStartCapture'
    },
    dependencies: ['topBlur', 'topCompositionStart', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionUpdate',
      captured: 'onCompositionUpdateCapture'
    },
    dependencies: ['topBlur', 'topCompositionUpdate', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  }
}; // Track whether we've ever handled a keypress on the space key.

var hasSpaceKeypress = false;
/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */

function isKeypressCommand(nativeEvent) {
  return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
  !(nativeEvent.ctrlKey && nativeEvent.altKey);
}
/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */


isKeypressCommand._r = [2];

function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case 'topCompositionStart':
      return eventTypes.compositionStart;

    case 'topCompositionEnd':
      return eventTypes.compositionEnd;

    case 'topCompositionUpdate':
      return eventTypes.compositionUpdate;
  }
}
/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */


getCompositionEventType._r = [2];

function isFallbackCompositionStart(topLevelType, nativeEvent) {
  return topLevelType === 'topKeyDown' && nativeEvent.keyCode === START_KEYCODE;
}
/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */


isFallbackCompositionStart._r = [2];

function isFallbackCompositionEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case 'topKeyUp':
      // Command keys insert or clear IME input.
      return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;

    case 'topKeyDown':
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return nativeEvent.keyCode !== START_KEYCODE;

    case 'topKeyPress':
    case 'topMouseDown':
    case 'topBlur':
      // Events are not possible without cancelling IME.
      return true;

    default:
      return false;
  }
}
/**
 * Google Input Tools provides composition data via a CustomEvent,
 * with the `data` property populated in the `detail` object. If this
 * is available on the event object, use it. If not, this is a plain
 * composition event and we have nothing special to extract.
 *
 * @param {object} nativeEvent
 * @return {?string}
 */


isFallbackCompositionEnd._r = [2];

function getDataFromCustomEvent(nativeEvent) {
  var detail = nativeEvent.detail;

  if (_typeof$2(detail) === 'object' && 'data' in detail) {
    return detail.data;
  }

  return null;
} // Track the current IME composition fallback object, if any.


getDataFromCustomEvent._r = [2];
var currentComposition = null;
/**
 * @return {?object} A SyntheticCompositionEvent.
 */

function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var eventType;
  var fallbackData;

  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(topLevelType);
  } else if (!currentComposition) {
    if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionStart;
    }
  } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
    eventType = eventTypes.compositionEnd;
  }

  if (!eventType) {
    return null;
  }

  if (useFallbackCompositionData) {
    // The current composition is stored statically and must not be
    // overwritten while composition continues.
    if (!currentComposition && eventType === eventTypes.compositionStart) {
      currentComposition = FallbackCompositionState_1.getPooled(nativeEventTarget);
    } else if (eventType === eventTypes.compositionEnd) {
      if (currentComposition) {
        fallbackData = currentComposition.getData();
      }
    }
  }

  var event = SyntheticCompositionEvent_1.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);

  if (fallbackData) {
    // Inject data generated from fallback path into the synthetic event.
    // This matches the property of native CompositionEventInterface.
    event.data = fallbackData;
  } else {
    var customData = getDataFromCustomEvent(nativeEvent);

    if (customData !== null) {
      event.data = customData;
    }
  }

  EventPropagators_1.accumulateTwoPhaseDispatches(event);
  return event;
}
/**
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The string corresponding to this `beforeInput` event.
 */


extractCompositionEvent._r = [2];

function getNativeBeforeInputChars(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case 'topCompositionEnd':
      return getDataFromCustomEvent(nativeEvent);

    case 'topKeyPress':
      /**
       * If native `textInput` events are available, our goal is to make
       * use of them. However, there is a special case: the spacebar key.
       * In Webkit, preventing default on a spacebar `textInput` event
       * cancels character insertion, but it *also* causes the browser
       * to fall back to its default spacebar behavior of scrolling the
       * page.
       *
       * Tracking at:
       * https://code.google.com/p/chromium/issues/detail?id=355103
       *
       * To avoid this issue, use the keypress event as if no `textInput`
       * event is available.
       */
      var which = nativeEvent.which;

      if (which !== SPACEBAR_CODE) {
        return null;
      }

      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;

    case 'topTextInput':
      // Record the characters to be added to the DOM.
      var chars = nativeEvent.data; // If it's a spacebar character, assume that we have already handled
      // it at the keypress level and bail immediately. Android Chrome
      // doesn't give us keycodes, so we need to blacklist it.

      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }

      return chars;

    default:
      // For other native event types, do nothing.
      return null;
  }
}
/**
 * For browsers that do not provide the `textInput` event, extract the
 * appropriate string to use for SyntheticInputEvent.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The fallback string for this `beforeInput` event.
 */


getNativeBeforeInputChars._r = [2];

function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
  // If we are currently composing (IME) and using a fallback to do so,
  // try to extract the composed characters from the fallback object.
  // If composition event is available, we extract a string only at
  // compositionevent, otherwise extract it at fallback events.
  if (currentComposition) {
    if (topLevelType === 'topCompositionEnd' || !canUseCompositionEvent && isFallbackCompositionEnd(topLevelType, nativeEvent)) {
      var chars = currentComposition.getData();
      FallbackCompositionState_1.release(currentComposition);
      currentComposition = null;
      return chars;
    }

    return null;
  }

  switch (topLevelType) {
    case 'topPaste':
      // If a paste event occurs after a keypress, throw out the input
      // chars. Paste events should not lead to BeforeInput events.
      return null;

    case 'topKeyPress':
      /**
       * As of v27, Firefox may fire keypress events even when no character
       * will be inserted. A few possibilities:
       *
       * - `which` is `0`. Arrow keys, Esc key, etc.
       *
       * - `which` is the pressed key code, but no char is available.
       *   Ex: 'AltGr + d` in Polish. There is no modified character for
       *   this key combination and no character is inserted into the
       *   document, but FF fires the keypress for char code `100` anyway.
       *   No `input` event will occur.
       *
       * - `which` is the pressed key code, but a command combination is
       *   being used. Ex: `Cmd+C`. No character is inserted, and no
       *   `input` event will occur.
       */
      if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
        return String.fromCharCode(nativeEvent.which);
      }

      return null;

    case 'topCompositionEnd':
      return useFallbackCompositionData ? null : nativeEvent.data;

    default:
      return null;
  }
}
/**
 * Extract a SyntheticInputEvent for `beforeInput`, based on either native
 * `textInput` or fallback behavior.
 *
 * @return {?object} A SyntheticInputEvent.
 */


getFallbackBeforeInputChars._r = [2];

function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var chars;

  if (canUseTextInputEvent) {
    chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
  } else {
    chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
  } // If no characters are being inserted, no BeforeInput event should
  // be fired.


  if (!chars) {
    return null;
  }

  var event = SyntheticInputEvent_1.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);
  event.data = chars;
  EventPropagators_1.accumulateTwoPhaseDispatches(event);
  return event;
}
/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 *
 * This plugin is also responsible for emitting `composition` events, thus
 * allowing us to share composition fallback code for both `beforeInput` and
 * `composition` event types.
 */


extractBeforeInputEvent._r = [2];
var BeforeInputEventPlugin = {
  eventTypes: eventTypes,
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    return [extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)];
  }
};
var BeforeInputEventPlugin_1 = BeforeInputEventPlugin;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * A specialized pseudo-event module to help keep track of components waiting to
 * be notified when their DOM representations are available for use.
 *
 * This implements `PooledClass`, so you should never need to instantiate this.
 * Instead, use `CallbackQueue.getPooled()`.
 *
 * @class ReactMountReady
 * @implements PooledClass
 * @internal
 */


_classCallCheck._r = [2];

var CallbackQueue = function () {
  function CallbackQueue(arg) {
    _classCallCheck(this, CallbackQueue);

    this._callbacks = null;
    this._contexts = null;
    this._arg = arg;
  }
  /**
   * Enqueues a callback to be invoked when `notifyAll` is invoked.
   *
   * @param {function} callback Invoked when `notifyAll` is invoked.
   * @param {?object} context Context to call `callback` with.
   * @internal
   */


  CallbackQueue.prototype.enqueue = function enqueue(callback, context) {
    this._callbacks = this._callbacks || [];

    this._callbacks.push(callback);

    this._contexts = this._contexts || [];

    this._contexts.push(context);
  };
  /**
   * Invokes all enqueued callbacks and clears the queue. This is invoked after
   * the DOM representation of a component has been created or updated.
   *
   * @internal
   */


  CallbackQueue.prototype.notifyAll = function notifyAll() {
    var callbacks = this._callbacks;
    var contexts = this._contexts;
    var arg = this._arg;

    if (callbacks && contexts) {
      !(callbacks.length === contexts.length) ? reactProdInvariant_1$2('24') : void 0;
      this._callbacks = null;
      this._contexts = null;

      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(contexts[i], arg);
      }

      callbacks.length = 0;
      contexts.length = 0;
    }
  };

  CallbackQueue.prototype.checkpoint = function checkpoint() {
    return this._callbacks ? this._callbacks.length : 0;
  };

  CallbackQueue.prototype.rollback = function rollback(len) {
    if (this._callbacks && this._contexts) {
      this._callbacks.length = len;
      this._contexts.length = len;
    }
  };
  /**
   * Resets the internal queue.
   *
   * @internal
   */


  CallbackQueue.prototype.reset = function reset() {
    this._callbacks = null;
    this._contexts = null;
  };
  /**
   * `PooledClass` looks for this.
   */


  CallbackQueue.prototype.destructor = function destructor() {
    this.reset();
  };

  return CallbackQueue;
}();

var CallbackQueue_1 = PooledClass_1$2.addPoolingTo(CallbackQueue);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var ReactFeatureFlags = {
  // When true, call console.time() before and .timeEnd() after each top-level
  // render (both initial renders and updates). Useful when looking at prod-mode
  // timeline profiles in Chrome, for example.
  logTopLevelRenders: false
};
var ReactFeatureFlags_1 = ReactFeatureFlags;

/**
 * @param {?object} object
 * @return {boolean} True if `object` is a valid owner.
 * @final
 */


function isValidOwner(object) {
  return !!(object && typeof object.attachRef === 'function' && typeof object.detachRef === 'function');
}
/**
 * ReactOwners are capable of storing references to owned components.
 *
 * All components are capable of //being// referenced by owner components, but
 * only ReactOwner components are capable of //referencing// owned components.
 * The named reference is known as a "ref".
 *
 * Refs are available when mounted and updated during reconciliation.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return (
 *         <div onClick={this.handleClick}>
 *           <CustomComponent ref="custom" />
 *         </div>
 *       );
 *     },
 *     handleClick: function() {
 *       this.refs.custom.handleClick();
 *     },
 *     componentDidMount: function() {
 *       this.refs.custom.initialize();
 *     }
 *   });
 *
 * Refs should rarely be used. When refs are used, they should only be done to
 * control data that is not handled by React's data flow.
 *
 * @class ReactOwner
 */


isValidOwner._r = [2];
var ReactOwner = {
  /**
   * Adds a component by ref to an owner component.
   *
   * @param {ReactComponent} component Component to reference.
   * @param {string} ref Name by which to refer to the component.
   * @param {ReactOwner} owner Component on which to record the ref.
   * @final
   * @internal
   */
  addComponentAsRefTo: function addComponentAsRefTo(component, ref, owner) {
    !isValidOwner(owner) ? reactProdInvariant_1$2('119') : void 0;
    owner.attachRef(ref, component);
  },

  /**
   * Removes a component by ref from an owner component.
   *
   * @param {ReactComponent} component Component to dereference.
   * @param {string} ref Name of the ref to remove.
   * @param {ReactOwner} owner Component on which the ref is recorded.
   * @final
   * @internal
   */
  removeComponentAsRefFrom: function removeComponentAsRefFrom(component, ref, owner) {
    !isValidOwner(owner) ? reactProdInvariant_1$2('120') : void 0;
    var ownerPublicInstance = owner.getPublicInstance(); // Check that `component`'s owner is still alive and that `component` is still the current ref
    // because we do not want to detach the ref if another component stole it.

    if (ownerPublicInstance && ownerPublicInstance.refs[ref] === component.getPublicInstance()) {
      owner.detachRef(ref);
    }
  }
};
var ReactOwner_1 = ReactOwner;

var ReactRef = {};

function attachRef(ref, component, owner) {
  if (typeof ref === 'function') {
    ref(component.getPublicInstance());
  } else {
    // Legacy ref
    ReactOwner_1.addComponentAsRefTo(component, ref, owner);
  }
}

attachRef._r = [2];

function detachRef(ref, component, owner) {
  if (typeof ref === 'function') {
    ref(null);
  } else {
    // Legacy ref
    ReactOwner_1.removeComponentAsRefFrom(component, ref, owner);
  }
}

detachRef._r = [2];

ReactRef.attachRefs = function (instance, element) {
  if (element === null || _typeof$2(element) !== 'object') {
    return;
  }

  var ref = element.ref;

  if (ref != null) {
    attachRef(ref, instance, element._owner);
  }
};

ReactRef.shouldUpdateRefs = function (prevElement, nextElement) {
  // If either the owner or a `ref` has changed, make sure the newest owner
  // has stored a reference to `this`, and the previous owner (if different)
  // has forgotten the reference to `this`. We use the element instead
  // of the public this.props because the post processing cannot determine
  // a ref. The ref conceptually lives on the element.
  // TODO: Should this even be possible? The owner cannot change because
  // it's forbidden by shouldUpdateReactComponent. The ref can change
  // if you swap the keys of but not the refs. Reconsider where this check
  // is made. It probably belongs where the key checking and
  // instantiateReactComponent is done.
  var prevRef = null;
  var prevOwner = null;

  if (prevElement !== null && _typeof$2(prevElement) === 'object') {
    prevRef = prevElement.ref;
    prevOwner = prevElement._owner;
  }

  var nextRef = null;
  var nextOwner = null;

  if (nextElement !== null && _typeof$2(nextElement) === 'object') {
    nextRef = nextElement.ref;
    nextOwner = nextElement._owner;
  }

  return prevRef !== nextRef || // If owner changes but we have an unchanged function ref, don't update refs
  typeof nextRef === 'string' && nextOwner !== prevOwner;
};

ReactRef.detachRefs = function (instance, element) {
  if (element === null || _typeof$2(element) !== 'object') {
    return;
  }

  var ref = element.ref;

  if (ref != null) {
    detachRef(ref, instance, element._owner);
  }
};

var ReactRef_1 = ReactRef;

var ReactInvalidSetStateWarningHook = {
  onBeginProcessingChildContext: function onBeginProcessingChildContext() {
    processingChildContext = true;
  },
  onEndProcessingChildContext: function onEndProcessingChildContext() {
    processingChildContext = false;
  },
  onSetState: function onSetState() {
    warnInvalidSetState();
  }
};
var ReactInvalidSetStateWarningHook_1 = ReactInvalidSetStateWarningHook;

/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var history$1 = [];
var ReactHostOperationHistoryHook = {
  onHostOperation: function onHostOperation(operation) {
    history$1.push(operation);
  },
  clearHistory: function clearHistory() {
    if (ReactHostOperationHistoryHook._preventClearing) {
      // Should only be used for tests.
      return;
    }

    history$1 = [];
  },
  getHistory: function getHistory() {
    return history$1;
  }
};
var ReactHostOperationHistoryHook_1 = ReactHostOperationHistoryHook;

var performance$2;

if (ExecutionEnvironment_1.canUseDOM) {
  performance$2 = window.performance || window.msPerformance || window.webkitPerformance;
}

var performance_1 = performance$2 || {};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */


var performanceNow$1;
/**
 * Detect if we can use `window.performance.now()` and gracefully fallback to
 * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
 * because of Facebook's testing infrastructure.
 */

if (performance_1.now) {
  performanceNow$1 = function performanceNow() {
    return performance_1.now();
  };
} else {
  performanceNow$1 = function performanceNow() {
    return Date.now();
  };
}

var performanceNow_1 = performanceNow$1;

var hooks = [];
var didHookThrowForEvent = {};

function callHook(event, fn, context, arg1, arg2, arg3, arg4, arg5) {
  try {
    fn.call(context, arg1, arg2, arg3, arg4, arg5);
  } catch (e) {
    void 0;
    didHookThrowForEvent[event] = true;
  }
}

callHook._r = [2];

function emitEvent(event, arg1, arg2, arg3, arg4, arg5) {
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    var fn = hook[event];

    if (fn) {
      callHook(event, fn, hook, arg1, arg2, arg3, arg4, arg5);
    }
  }
}

emitEvent._r = [2];
var _isProfiling = false;
var flushHistory = [];
var lifeCycleTimerStack = [];
var currentFlushNesting = 0;
var currentFlushMeasurements = [];
var currentFlushStartTime = 0;
var currentTimerDebugID = null;
var currentTimerStartTime = 0;
var currentTimerNestedFlushDuration = 0;
var currentTimerType = null;
var lifeCycleTimerHasWarned = false;

function clearHistory() {
  ReactComponentTreeHook_1.purgeUnmountedComponents();
  ReactHostOperationHistoryHook_1.clearHistory();
}

clearHistory._r = [2];

function getTreeSnapshot(registeredIDs) {
  return registeredIDs.reduce(function (tree, id) {
    var ownerID = ReactComponentTreeHook_1.getOwnerID(id);
    var parentID = ReactComponentTreeHook_1.getParentID(id);
    tree[id] = {
      displayName: ReactComponentTreeHook_1.getDisplayName(id),
      text: ReactComponentTreeHook_1.getText(id),
      updateCount: ReactComponentTreeHook_1.getUpdateCount(id),
      childIDs: ReactComponentTreeHook_1.getChildIDs(id),
      // Text nodes don't have owners but this is close enough.
      ownerID: ownerID || parentID && ReactComponentTreeHook_1.getOwnerID(parentID) || 0,
      parentID: parentID
    };
    return tree;
  }, {});
}

getTreeSnapshot._r = [2];

function resetMeasurements() {
  var previousStartTime = currentFlushStartTime;
  var previousMeasurements = currentFlushMeasurements;
  var previousOperations = ReactHostOperationHistoryHook_1.getHistory();

  if (currentFlushNesting === 0) {
    currentFlushStartTime = 0;
    currentFlushMeasurements = [];
    clearHistory();
    return;
  }

  if (previousMeasurements.length || previousOperations.length) {
    var registeredIDs = ReactComponentTreeHook_1.getRegisteredIDs();
    flushHistory.push({
      duration: performanceNow_1() - previousStartTime,
      measurements: previousMeasurements || [],
      operations: previousOperations || [],
      treeSnapshot: getTreeSnapshot(registeredIDs)
    });
  }

  clearHistory();
  currentFlushStartTime = performanceNow_1();
  currentFlushMeasurements = [];
}

resetMeasurements._r = [2];

function checkDebugID(debugID) {
  var allowRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (allowRoot && debugID === 0) {
    return;
  }

  if (!debugID) {
    void 0;
  }
}

checkDebugID._r = [2];

function beginLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }

  if (currentTimerType && !lifeCycleTimerHasWarned) {
    void 0;
    lifeCycleTimerHasWarned = true;
  }

  currentTimerStartTime = performanceNow_1();
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
}

beginLifeCycleTimer._r = [2];

function endLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }

  if (currentTimerType !== timerType && !lifeCycleTimerHasWarned) {
    void 0;
    lifeCycleTimerHasWarned = true;
  }

  if (_isProfiling) {
    currentFlushMeasurements.push({
      timerType: timerType,
      instanceID: debugID,
      duration: performanceNow_1() - currentTimerStartTime - currentTimerNestedFlushDuration
    });
  }

  currentTimerStartTime = 0;
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = null;
  currentTimerType = null;
}

endLifeCycleTimer._r = [2];

function pauseCurrentLifeCycleTimer() {
  var currentTimer = {
    startTime: currentTimerStartTime,
    nestedFlushStartTime: performanceNow_1(),
    debugID: currentTimerDebugID,
    timerType: currentTimerType
  };
  lifeCycleTimerStack.push(currentTimer);
  currentTimerStartTime = 0;
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = null;
  currentTimerType = null;
}

pauseCurrentLifeCycleTimer._r = [2];

function resumeCurrentLifeCycleTimer() {
  var _lifeCycleTimerStack$ = lifeCycleTimerStack.pop(),
      startTime = _lifeCycleTimerStack$.startTime,
      nestedFlushStartTime = _lifeCycleTimerStack$.nestedFlushStartTime,
      debugID = _lifeCycleTimerStack$.debugID,
      timerType = _lifeCycleTimerStack$.timerType;

  var nestedFlushDuration = performanceNow_1() - nestedFlushStartTime;
  currentTimerStartTime = startTime;
  currentTimerNestedFlushDuration += nestedFlushDuration;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
}

resumeCurrentLifeCycleTimer._r = [2];
var lastMarkTimeStamp = 0;
var canUsePerformanceMeasure = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

function shouldMark(debugID) {
  if (!_isProfiling || !canUsePerformanceMeasure) {
    return false;
  }

  var element = ReactComponentTreeHook_1.getElement(debugID);

  if (element == null || _typeof$2(element) !== 'object') {
    return false;
  }

  var isHostElement = typeof element.type === 'string';

  if (isHostElement) {
    return false;
  }

  return true;
}

shouldMark._r = [2];

function markBegin(debugID, markType) {
  if (!shouldMark(debugID)) {
    return;
  }

  var markName = debugID + '::' + markType;
  lastMarkTimeStamp = performanceNow_1();
  performance.mark(markName);
}

markBegin._r = [2];

function markEnd(debugID, markType) {
  if (!shouldMark(debugID)) {
    return;
  }

  var markName = debugID + '::' + markType;
  var displayName = ReactComponentTreeHook_1.getDisplayName(debugID) || 'Unknown'; // Chrome has an issue of dropping markers recorded too fast:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=640652
  // To work around this, we will not report very small measurements.
  // I determined the magic number by tweaking it back and forth.
  // 0.05ms was enough to prevent the issue, but I set it to 0.1ms to be safe.
  // When the bug is fixed, we can `measure()` unconditionally if we want to.

  var timeStamp = performanceNow_1();

  if (timeStamp - lastMarkTimeStamp > 0.1) {
    var measurementName = displayName + ' [' + markType + ']';
    performance.measure(measurementName, markName);
  }

  performance.clearMarks(markName);

  if (measurementName) {
    performance.clearMeasures(measurementName);
  }
}

markEnd._r = [2];
var ReactDebugTool$1 = {
  addHook: function addHook(hook) {
    hooks.push(hook);
  },
  removeHook: function removeHook(hook) {
    for (var i = 0; i < hooks.length; i++) {
      if (hooks[i] === hook) {
        hooks.splice(i, 1);
        i--;
      }
    }
  },
  isProfiling: function isProfiling() {
    return _isProfiling;
  },
  beginProfiling: function beginProfiling() {
    if (_isProfiling) {
      return;
    }

    _isProfiling = true;
    flushHistory.length = 0;
    resetMeasurements();
    ReactDebugTool$1.addHook(ReactHostOperationHistoryHook_1);
  },
  endProfiling: function endProfiling() {
    if (!_isProfiling) {
      return;
    }

    _isProfiling = false;
    resetMeasurements();
    ReactDebugTool$1.removeHook(ReactHostOperationHistoryHook_1);
  },
  getFlushHistory: function getFlushHistory() {
    return flushHistory;
  },
  onBeginFlush: function onBeginFlush() {
    currentFlushNesting++;
    resetMeasurements();
    pauseCurrentLifeCycleTimer();
    emitEvent('onBeginFlush');
  },
  onEndFlush: function onEndFlush() {
    resetMeasurements();
    currentFlushNesting--;
    resumeCurrentLifeCycleTimer();
    emitEvent('onEndFlush');
  },
  onBeginLifeCycleTimer: function onBeginLifeCycleTimer(debugID, timerType) {
    checkDebugID(debugID);
    emitEvent('onBeginLifeCycleTimer', debugID, timerType);
    markBegin(debugID, timerType);
    beginLifeCycleTimer(debugID, timerType);
  },
  onEndLifeCycleTimer: function onEndLifeCycleTimer(debugID, timerType) {
    checkDebugID(debugID);
    endLifeCycleTimer(debugID, timerType);
    markEnd(debugID, timerType);
    emitEvent('onEndLifeCycleTimer', debugID, timerType);
  },
  onBeginProcessingChildContext: function onBeginProcessingChildContext() {
    emitEvent('onBeginProcessingChildContext');
  },
  onEndProcessingChildContext: function onEndProcessingChildContext() {
    emitEvent('onEndProcessingChildContext');
  },
  onHostOperation: function onHostOperation(operation) {
    checkDebugID(operation.instanceID);
    emitEvent('onHostOperation', operation);
  },
  onSetState: function onSetState() {
    emitEvent('onSetState');
  },
  onSetChildren: function onSetChildren(debugID, childDebugIDs) {
    checkDebugID(debugID);
    childDebugIDs.forEach(checkDebugID);
    emitEvent('onSetChildren', debugID, childDebugIDs);
  },
  onBeforeMountComponent: function onBeforeMountComponent(debugID, element, parentDebugID) {
    checkDebugID(debugID);
    checkDebugID(parentDebugID, true);
    emitEvent('onBeforeMountComponent', debugID, element, parentDebugID);
    markBegin(debugID, 'mount');
  },
  onMountComponent: function onMountComponent(debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'mount');
    emitEvent('onMountComponent', debugID);
  },
  onBeforeUpdateComponent: function onBeforeUpdateComponent(debugID, element) {
    checkDebugID(debugID);
    emitEvent('onBeforeUpdateComponent', debugID, element);
    markBegin(debugID, 'update');
  },
  onUpdateComponent: function onUpdateComponent(debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'update');
    emitEvent('onUpdateComponent', debugID);
  },
  onBeforeUnmountComponent: function onBeforeUnmountComponent(debugID) {
    checkDebugID(debugID);
    emitEvent('onBeforeUnmountComponent', debugID);
    markBegin(debugID, 'unmount');
  },
  onUnmountComponent: function onUnmountComponent(debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'unmount');
    emitEvent('onUnmountComponent', debugID);
  },
  onTestEvent: function onTestEvent() {
    emitEvent('onTestEvent');
  }
}; // TODO remove these when RN/www gets updated

ReactDebugTool$1.addDevtool = ReactDebugTool$1.addHook;
ReactDebugTool$1.removeDevtool = ReactDebugTool$1.removeHook;
ReactDebugTool$1.addHook(ReactInvalidSetStateWarningHook_1);
ReactDebugTool$1.addHook(ReactComponentTreeHook_1);
var url = ExecutionEnvironment_1.canUseDOM && window.location.href || '';

if (/[?&]react_perf\b/.test(url)) {
  ReactDebugTool$1.beginProfiling();
}

/**
 * Helper to call ReactRef.attachRefs with this composite component, split out
 * to avoid allocations in the transaction mount-ready queue.
 */


function attachRefs() {
  ReactRef_1.attachRefs(this, this._currentElement);
}

attachRefs._r = [2];
var ReactReconciler = {
  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?object} the containing host component instance
   * @param {?object} info about the host container
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function mountComponent(internalInstance, transaction, hostParent, hostContainerInfo, context, parentDebugID) // 0 in production and for roots
  {
    var markup = internalInstance.mountComponent(transaction, hostParent, hostContainerInfo, context, parentDebugID);

    if (internalInstance._currentElement && internalInstance._currentElement.ref != null) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }

    return markup;
  },

  /**
   * Returns a value that can be passed to
   * ReactComponentEnvironment.replaceNodeWithMarkup.
   */
  getHostNode: function getHostNode(internalInstance) {
    return internalInstance.getHostNode();
  },

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function unmountComponent(internalInstance, safely) {
    ReactRef_1.detachRefs(internalInstance, internalInstance._currentElement);
    internalInstance.unmountComponent(safely);

    
  },

  /**
   * Update a component using a new element.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactElement} nextElement
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @internal
   */
  receiveComponent: function receiveComponent(internalInstance, nextElement, transaction, context) {
    var prevElement = internalInstance._currentElement;

    if (nextElement === prevElement && context === internalInstance._context) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for an element created outside a composite to be
      // deeply mutated and reused.
      // TODO: Bailing out early is just a perf optimization right?
      // TODO: Removing the return statement should affect correctness?
      return;
    }

    var refsChanged = ReactRef_1.shouldUpdateRefs(prevElement, nextElement);

    if (refsChanged) {
      ReactRef_1.detachRefs(internalInstance, prevElement);
    }

    internalInstance.receiveComponent(nextElement, transaction, context);

    if (refsChanged && internalInstance._currentElement && internalInstance._currentElement.ref != null) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }

    
  },

  /**
   * Flush any dirty changes in a component.
   *
   * @param {ReactComponent} internalInstance
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function performUpdateIfNecessary(internalInstance, transaction, updateBatchNumber) {
    if (internalInstance._updateBatchNumber !== updateBatchNumber) {
      // The component's enqueued batch number should always be the current
      // batch or the following one.
      void 0;
      return;
    }

    internalInstance.performUpdateIfNecessary(transaction);

    
  }
};
var ReactReconciler_1 = ReactReconciler;

var OBSERVED_ERROR = {};
/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be run while it is already being run. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM updates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */

var TransactionImpl = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function reinitializeTransaction() {
    this.transactionWrappers = this.getTransactionWrappers();

    if (this.wrapperInitData) {
      this.wrapperInitData.length = 0;
    } else {
      this.wrapperInitData = [];
    }

    this._isInTransaction = false;
  },
  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,
  isInTransaction: function isInTransaction() {
    return !!this._isInTransaction;
  },

  /* eslint-disable space-before-function-paren */

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked. The optional arguments helps prevent the need
   * to bind in many cases.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} a Argument to pass to the method.
   * @param {Object?=} b Argument to pass to the method.
   * @param {Object?=} c Argument to pass to the method.
   * @param {Object?=} d Argument to pass to the method.
   * @param {Object?=} e Argument to pass to the method.
   * @param {Object?=} f Argument to pass to the method.
   *
   * @return {*} Return value from `method`.
   */
  perform: function perform(method, scope, a, b, c, d, e, f) {
    /* eslint-enable space-before-function-paren */
    !!this.isInTransaction() ? reactProdInvariant_1$2('27') : void 0;
    var errorThrown;
    var ret;

    try {
      this._isInTransaction = true; // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.

      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {}
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }

    return ret;
  },
  initializeAll: function initializeAll(startIndex) {
    var transactionWrappers = this.transactionWrappers;

    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];

      try {
        // Catching errors makes debugging more difficult, so we start with the
        // OBSERVED_ERROR state before overwriting it with the real return value
        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
        // block, it means wrapper.initialize threw.
        this.wrapperInitData[i] = OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
      } finally {
        if (this.wrapperInitData[i] === OBSERVED_ERROR) {
          // The initializer for wrapper i threw an error; initialize the
          // remaining wrappers but silence any exceptions from them to ensure
          // that the first error is the one to bubble up.
          try {
            this.initializeAll(i + 1);
          } catch (err) {}
        }
      }
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function closeAll(startIndex) {
    !this.isInTransaction() ? reactProdInvariant_1$2('28') : void 0;
    var transactionWrappers = this.transactionWrappers;

    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var initData = this.wrapperInitData[i];
      var errorThrown;

      try {
        // Catching errors makes debugging more difficult, so we start with
        // errorThrown set to true before setting it to false after calling
        // close -- if it's still set to true in the finally block, it means
        // wrapper.close threw.
        errorThrown = true;

        if (initData !== OBSERVED_ERROR && wrapper.close) {
          wrapper.close.call(this, initData);
        }

        errorThrown = false;
      } finally {
        if (errorThrown) {
          // The closer for wrapper i threw an error; close the remaining
          // wrappers but silence any exceptions from them to ensure that the
          // first error is the one to bubble up.
          try {
            this.closeAll(i + 1);
          } catch (e) {}
        }
      }
    }

    this.wrapperInitData.length = 0;
  }
};
var Transaction = TransactionImpl;

var dirtyComponents = [];
var updateBatchNumber = 0;
var asapCallbackQueue = CallbackQueue_1.getPooled();
var asapEnqueued = false;
var batchingStrategy = null;

function ensureInjected() {
  !(ReactUpdates.ReactReconcileTransaction && batchingStrategy) ? reactProdInvariant_1$2('123') : void 0;
}

ensureInjected._r = [2];
var NESTED_UPDATES = {
  initialize: function initialize() {
    this.dirtyComponentsLength = dirtyComponents.length;
  },
  close: function close() {
    if (this.dirtyComponentsLength !== dirtyComponents.length) {
      // Additional updates were enqueued by componentDidUpdate handlers or
      // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
      // these new updates so that if A's componentDidUpdate calls setState on
      // B, B will update before the callback A's updater provided when calling
      // setState.
      dirtyComponents.splice(0, this.dirtyComponentsLength);
      flushBatchedUpdates();
    } else {
      dirtyComponents.length = 0;
    }
  }
};
var UPDATE_QUEUEING = {
  initialize: function initialize() {
    this.callbackQueue.reset();
  },
  close: function close() {
    this.callbackQueue.notifyAll();
  }
};
var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

function ReactUpdatesFlushTransaction() {
  this.reinitializeTransaction();
  this.dirtyComponentsLength = null;
  this.callbackQueue = CallbackQueue_1.getPooled();
  this.reconcileTransaction = ReactUpdates.ReactReconcileTransaction.getPooled(
  /* useCreateElement */
  true);
}

ReactUpdatesFlushTransaction._r = [2];

objectAssign(ReactUpdatesFlushTransaction.prototype, Transaction, {
  getTransactionWrappers: function getTransactionWrappers() {
    return TRANSACTION_WRAPPERS;
  },
  destructor: function destructor() {
    this.dirtyComponentsLength = null;
    CallbackQueue_1.release(this.callbackQueue);
    this.callbackQueue = null;
    ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction);
    this.reconcileTransaction = null;
  },
  perform: function perform(method, scope, a) {
    // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
    // with this transaction's wrappers around it.
    return Transaction.perform.call(this, this.reconcileTransaction.perform, this.reconcileTransaction, method, scope, a);
  }
});

PooledClass_1$2.addPoolingTo(ReactUpdatesFlushTransaction);

function batchedUpdates(callback, a, b, c, d, e) {
  ensureInjected();
  return batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
}
/**
 * Array comparator for ReactComponents by mount ordering.
 *
 * @param {ReactComponent} c1 first component you're comparing
 * @param {ReactComponent} c2 second component you're comparing
 * @return {number} Return value usable by Array.prototype.sort().
 */


batchedUpdates._r = [2];

function mountOrderComparator(c1, c2) {
  return c1._mountOrder - c2._mountOrder;
}

mountOrderComparator._r = [2];

function runBatchedUpdates(transaction) {
  var len = transaction.dirtyComponentsLength;
  !(len === dirtyComponents.length) ? reactProdInvariant_1$2('124', len, dirtyComponents.length) : void 0; // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.

  dirtyComponents.sort(mountOrderComparator); // Any updates enqueued while reconciling must be performed after this entire
  // batch. Otherwise, if dirtyComponents is [A, B] where A has children B and
  // C, B could update twice in a single batch if C's render enqueues an update
  // to B (since B would have already updated, we should skip it, and the only
  // way we can know to do so is by checking the batch counter).

  updateBatchNumber++;

  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, it will still
    // be here, but we assume that it has cleared its _pendingCallbacks and
    // that performUpdateIfNecessary is a noop.
    var component = dirtyComponents[i]; // If performUpdateIfNecessary happens to enqueue any new updates, we
    // shouldn't execute the callbacks until the next render happens, so
    // stash the callbacks first

    var callbacks = component._pendingCallbacks;
    component._pendingCallbacks = null;
    var markerName;

    if (ReactFeatureFlags_1.logTopLevelRenders) {
      var namedComponent = component; // Duck type TopLevelWrapper. This is probably always true.

      if (component._currentElement.type.isReactTopLevelWrapper) {
        namedComponent = component._renderedComponent;
      }

      markerName = 'React update: ' + namedComponent.getName();
      console.time(markerName);
    }

    ReactReconciler_1.performUpdateIfNecessary(component, transaction.reconcileTransaction, updateBatchNumber);

    if (markerName) {
      console.timeEnd(markerName);
    }

    if (callbacks) {
      for (var j = 0; j < callbacks.length; j++) {
        transaction.callbackQueue.enqueue(callbacks[j], component.getPublicInstance());
      }
    }
  }
}

runBatchedUpdates._r = [2];

var flushBatchedUpdates = function flushBatchedUpdates() {
  // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
  // array and perform any updates enqueued by mount-ready handlers (i.e.,
  // componentDidUpdate) but we need to check here too in order to catch
  // updates enqueued by setState callbacks and asap calls.
  while (dirtyComponents.length || asapEnqueued) {
    if (dirtyComponents.length) {
      var transaction = ReactUpdatesFlushTransaction.getPooled();
      transaction.perform(runBatchedUpdates, null, transaction);
      ReactUpdatesFlushTransaction.release(transaction);
    }

    if (asapEnqueued) {
      asapEnqueued = false;
      var queue = asapCallbackQueue;
      asapCallbackQueue = CallbackQueue_1.getPooled();
      queue.notifyAll();
      CallbackQueue_1.release(queue);
    }
  }
};
/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */


flushBatchedUpdates._r = [2];

function enqueueUpdate(component) {
  ensureInjected(); // Various parts of our code (such as ReactCompositeComponent's
  // _renderValidatedComponent) assume that calls to render aren't nested;
  // verify that that's the case. (This is called by each top-level update
  // function, like setState, forceUpdate, etc.; creation and
  // destruction of top-level components is guarded in ReactMount.)

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);

  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
/**
 * Enqueue a callback to be run at the end of the current batching cycle. Throws
 * if no updates are currently being performed.
 */


enqueueUpdate._r = [2];

function asap(callback, context) {
  invariant_1(batchingStrategy.isBatchingUpdates, "ReactUpdates.asap: Can't enqueue an asap callback in a context where" + 'updates are not being batched.');
  asapCallbackQueue.enqueue(callback, context);
  asapEnqueued = true;
}

asap._r = [2];
var ReactUpdatesInjection = {
  injectReconcileTransaction: function injectReconcileTransaction(ReconcileTransaction) {
    !ReconcileTransaction ? reactProdInvariant_1$2('126') : void 0;
    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
  },
  injectBatchingStrategy: function injectBatchingStrategy(_batchingStrategy) {
    !_batchingStrategy ? reactProdInvariant_1$2('127') : void 0;
    !(typeof _batchingStrategy.batchedUpdates === 'function') ? reactProdInvariant_1$2('128') : void 0;
    !(typeof _batchingStrategy.isBatchingUpdates === 'boolean') ? reactProdInvariant_1$2('129') : void 0;
    batchingStrategy = _batchingStrategy;
  }
};
var ReactUpdates = {
  /**
   * React references `ReactReconcileTransaction` using this property in order
   * to allow dependency injection.
   *
   * @internal
   */
  ReactReconcileTransaction: null,
  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection,
  asap: asap
};
var ReactUpdates_1 = ReactUpdates;

function isCheckable(elem) {
  var type = elem.type;
  var nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
}

isCheckable._r = [2];

function getTracker(inst) {
  return inst._wrapperState.valueTracker;
}

getTracker._r = [2];

function attachTracker(inst, tracker) {
  inst._wrapperState.valueTracker = tracker;
}

attachTracker._r = [2];

function detachTracker(inst) {
  inst._wrapperState.valueTracker = null;
}

detachTracker._r = [2];

function getValueFromNode(node) {
  var value;

  if (node) {
    value = isCheckable(node) ? '' + node.checked : node.value;
  }

  return value;
}

getValueFromNode._r = [2];
var inputValueTracking = {
  // exposed for testing
  _getTrackerFromNode: function _getTrackerFromNode(node) {
    return getTracker(ReactDOMComponentTree_1.getInstanceFromNode(node));
  },
  track: function track(inst) {
    if (getTracker(inst)) {
      return;
    }

    var node = ReactDOMComponentTree_1.getNodeFromInstance(inst);
    var valueField = isCheckable(node) ? 'checked' : 'value';
    var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
    var currentValue = '' + node[valueField]; // if someone has already defined a value or Safari, then bail
    // and don't track value will cause over reporting of changes,
    // but it's better then a hard failure
    // (needed for certain tests that spyOn input values and Safari)

    if (node.hasOwnProperty(valueField) || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') {
      return;
    }

    Object.defineProperty(node, valueField, {
      enumerable: descriptor.enumerable,
      configurable: true,
      get: function get() {
        return descriptor.get.call(this);
      },
      set: function set(value) {
        currentValue = '' + value;
        descriptor.set.call(this, value);
      }
    });
    attachTracker(inst, {
      getValue: function getValue() {
        return currentValue;
      },
      setValue: function setValue(value) {
        currentValue = '' + value;
      },
      stopTracking: function stopTracking() {
        detachTracker(inst);
        delete node[valueField];
      }
    });
  },
  updateValueIfChanged: function updateValueIfChanged(inst) {
    if (!inst) {
      return false;
    }

    var tracker = getTracker(inst);

    if (!tracker) {
      inputValueTracking.track(inst);
      return true;
    }

    var lastValue = tracker.getValue();
    var nextValue = getValueFromNode(ReactDOMComponentTree_1.getNodeFromInstance(inst));

    if (nextValue !== lastValue) {
      tracker.setValue(nextValue);
      return true;
    }

    return false;
  },
  stopTracking: function stopTracking(inst) {
    var tracker = getTracker(inst);

    if (tracker) {
      tracker.stopTracking();
    }
  }
};
var inputValueTracking_1 = inputValueTracking;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */

function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window; // Normalize SVG <use> element events #4963

  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  } // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html


  return target.nodeType === 3 ? target.parentNode : target;
}

getEventTarget._r = [2];
var getEventTarget_1 = getEventTarget;

var useHasFeature;

if (ExecutionEnvironment_1.canUseDOM) {
  useHasFeature = document.implementation && document.implementation.hasFeature && // always returns true in newer browsers as per the standard.
  // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
  document.implementation.hasFeature('', '') !== true;
}
/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */


function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment_1.canUseDOM || capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

isEventSupported._r = [2];
var isEventSupported_1 = isEventSupported;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */

var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};

function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

  if (nodeName === 'input') {
    return !!supportedInputTypes[elem.type];
  }

  if (nodeName === 'textarea') {
    return true;
  }

  return false;
}

isTextInputElement._r = [2];
var isTextInputElement_1 = isTextInputElement;

var eventTypes$1 = {
  change: {
    phasedRegistrationNames: {
      bubbled: 'onChange',
      captured: 'onChangeCapture'
    },
    dependencies: ['topBlur', 'topChange', 'topClick', 'topFocus', 'topInput', 'topKeyDown', 'topKeyUp', 'topSelectionChange']
  }
};

function createAndAccumulateChangeEvent(inst, nativeEvent, target) {
  var event = SyntheticEvent_1.getPooled(eventTypes$1.change, inst, nativeEvent, target);
  event.type = 'change';
  EventPropagators_1.accumulateTwoPhaseDispatches(event);
  return event;
}
/**
 * For IE shims
 */


createAndAccumulateChangeEvent._r = [2];
var activeElement = null;
var activeElementInst = null;
/**
 * SECTION: handle `change` event
 */

function shouldUseChangeEvent(elem) {
  var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
}

shouldUseChangeEvent._r = [2];
var doesChangeEventBubble = false;

if (ExecutionEnvironment_1.canUseDOM) {
  // See `handleChange` comment below
  doesChangeEventBubble = isEventSupported_1('change') && (!document.documentMode || document.documentMode > 8);
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = createAndAccumulateChangeEvent(activeElementInst, nativeEvent, getEventTarget_1(nativeEvent)); // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.

  ReactUpdates_1.batchedUpdates(runEventInBatch, event);
}

manualDispatchChangeEvent._r = [2];

function runEventInBatch(event) {
  EventPluginHub_1.enqueueEvents(event);
  EventPluginHub_1.processEventQueue(false);
}

runEventInBatch._r = [2];

function startWatchingForChangeEventIE8(target, targetInst) {
  activeElement = target;
  activeElementInst = targetInst;
  activeElement.attachEvent('onchange', manualDispatchChangeEvent);
}

startWatchingForChangeEventIE8._r = [2];

function stopWatchingForChangeEventIE8() {
  if (!activeElement) {
    return;
  }

  activeElement.detachEvent('onchange', manualDispatchChangeEvent);
  activeElement = null;
  activeElementInst = null;
}

stopWatchingForChangeEventIE8._r = [2];

function getInstIfValueChanged(targetInst, nativeEvent) {
  var updated = inputValueTracking_1.updateValueIfChanged(targetInst);
  var simulated = nativeEvent.simulated === true && ChangeEventPlugin._allowSimulatedPassThrough;

  if (updated || simulated) {
    return targetInst;
  }
}

getInstIfValueChanged._r = [2];

function getTargetInstForChangeEvent(topLevelType, targetInst) {
  if (topLevelType === 'topChange') {
    return targetInst;
  }
}

getTargetInstForChangeEvent._r = [2];

function handleEventsForChangeEventIE8(topLevelType, target, targetInst) {
  if (topLevelType === 'topFocus') {
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForChangeEventIE8();
    startWatchingForChangeEventIE8(target, targetInst);
  } else if (topLevelType === 'topBlur') {
    stopWatchingForChangeEventIE8();
  }
}
/**
 * SECTION: handle `input` event
 */


handleEventsForChangeEventIE8._r = [2];
var isInputEventSupported = false;

if (ExecutionEnvironment_1.canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events.
  isInputEventSupported = isEventSupported_1('input') && (!document.documentMode || document.documentMode > 9);
}
/**
 * (For IE <=9) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */


function startWatchingForValueChange(target, targetInst) {
  activeElement = target;
  activeElementInst = targetInst;
  activeElement.attachEvent('onpropertychange', handlePropertyChange);
}
/**
 * (For IE <=9) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */


startWatchingForValueChange._r = [2];

function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }

  activeElement.detachEvent('onpropertychange', handlePropertyChange);
  activeElement = null;
  activeElementInst = null;
}
/**
 * (For IE <=9) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */


stopWatchingForValueChange._r = [2];

function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }

  if (getInstIfValueChanged(activeElementInst, nativeEvent)) {
    manualDispatchChangeEvent(nativeEvent);
  }
}

handlePropertyChange._r = [2];

function handleEventsForInputEventPolyfill(topLevelType, target, targetInst) {
  if (topLevelType === 'topFocus') {
    // In IE8, we can capture almost all .value changes by adding a
    // propertychange handler and looking for events with propertyName
    // equal to 'value'
    // In IE9, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(target, targetInst);
  } else if (topLevelType === 'topBlur') {
    stopWatchingForValueChange();
  }
} // For IE8 and IE9.


handleEventsForInputEventPolyfill._r = [2];

function getTargetInstForInputEventPolyfill(topLevelType, targetInst, nativeEvent) {
  if (topLevelType === 'topSelectionChange' || topLevelType === 'topKeyUp' || topLevelType === 'topKeyDown') {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    return getInstIfValueChanged(activeElementInst, nativeEvent);
  }
}
/**
 * SECTION: handle `click` event
 */


getTargetInstForInputEventPolyfill._r = [2];

function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  var nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
}

shouldUseClickEvent._r = [2];

function getTargetInstForClickEvent(topLevelType, targetInst, nativeEvent) {
  if (topLevelType === 'topClick') {
    return getInstIfValueChanged(targetInst, nativeEvent);
  }
}

getTargetInstForClickEvent._r = [2];

function getTargetInstForInputOrChangeEvent(topLevelType, targetInst, nativeEvent) {
  if (topLevelType === 'topInput' || topLevelType === 'topChange') {
    return getInstIfValueChanged(targetInst, nativeEvent);
  }
}

getTargetInstForInputOrChangeEvent._r = [2];

function handleControlledInputBlur(inst, node) {
  // TODO: In IE, inst is occasionally null. Why?
  if (inst == null) {
    return;
  } // Fiber and ReactDOM keep wrapper state in separate places


  var state = inst._wrapperState || node._wrapperState;

  if (!state || !state.controlled || node.type !== 'number') {
    return;
  } // If controlled, assign the value attribute to the current value on blur


  var value = '' + node.value;

  if (node.getAttribute('value') !== value) {
    node.setAttribute('value', value);
  }
}
/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */


handleControlledInputBlur._r = [2];
var ChangeEventPlugin = {
  eventTypes: eventTypes$1,
  _allowSimulatedPassThrough: true,
  _isInputEventSupported: isInputEventSupported,
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var targetNode = targetInst ? ReactDOMComponentTree_1.getNodeFromInstance(targetInst) : window;
    var getTargetInstFunc, handleEventFunc;

    if (shouldUseChangeEvent(targetNode)) {
      if (doesChangeEventBubble) {
        getTargetInstFunc = getTargetInstForChangeEvent;
      } else {
        handleEventFunc = handleEventsForChangeEventIE8;
      }
    } else if (isTextInputElement_1(targetNode)) {
      if (isInputEventSupported) {
        getTargetInstFunc = getTargetInstForInputOrChangeEvent;
      } else {
        getTargetInstFunc = getTargetInstForInputEventPolyfill;
        handleEventFunc = handleEventsForInputEventPolyfill;
      }
    } else if (shouldUseClickEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForClickEvent;
    }

    if (getTargetInstFunc) {
      var inst = getTargetInstFunc(topLevelType, targetInst, nativeEvent);

      if (inst) {
        var event = createAndAccumulateChangeEvent(inst, nativeEvent, nativeEventTarget);
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(topLevelType, targetNode, targetInst);
    } // When blurring, set the value attribute for number inputs


    if (topLevelType === 'topBlur') {
      handleControlledInputBlur(targetInst, targetNode);
    }
  }
};
var ChangeEventPlugin_1 = ChangeEventPlugin;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */

var DefaultEventPluginOrder = ['ResponderEventPlugin', 'SimpleEventPlugin', 'TapEventPlugin', 'EnterLeaveEventPlugin', 'ChangeEventPlugin', 'SelectEventPlugin', 'BeforeInputEventPlugin'];
var DefaultEventPluginOrder_1 = DefaultEventPluginOrder;

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */


var UIEventInterface = {
  view: function view(event) {
    if (event.view) {
      return event.view;
    }

    var target = getEventTarget_1(event);

    if (target.window === target) {
      // target is a window object
      return target;
    }

    var doc = target.ownerDocument; // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.

    if (doc) {
      return doc.defaultView || doc.parentWindow;
    } else {
      return window;
    }
  },
  detail: function detail(event) {
    return event.detail || 0;
  }
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */

function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent._r = [2];
SyntheticEvent_1.augmentClass(SyntheticUIEvent, UIEventInterface);
var SyntheticUIEvent_1 = SyntheticUIEvent;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var ViewportMetrics = {
  currentScrollLeft: 0,
  currentScrollTop: 0,
  refreshScrollValues: function refreshScrollValues(scrollPosition) {
    ViewportMetrics.currentScrollLeft = scrollPosition.x;
    ViewportMetrics.currentScrollTop = scrollPosition.y;
  }
};
var ViewportMetrics_1 = ViewportMetrics;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

var modifierKeyToProp = {
  Alt: 'altKey',
  Control: 'ctrlKey',
  Meta: 'metaKey',
  Shift: 'shiftKey'
}; // IE8 does not implement getModifierState so we simply map it to the only
// modifier keys exposed by the event itself, does not support Lock-keys.
// Currently, all major browsers except Chrome seems to support Lock-keys.

function modifierStateGetter(keyArg) {
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;

  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }

  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

modifierStateGetter._r = [2];

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

getEventModifierState._r = [2];
var getEventModifierState_1 = getEventModifierState;

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */


var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: getEventModifierState_1,
  button: function button(event) {
    // Webkit, Firefox, IE9+
    // which:  1 2 3
    // button: 0 1 2 (standard)
    var button = event.button;

    if ('which' in event) {
      return button;
    } // IE<9
    // which:  undefined
    // button: 0 0 0
    // button: 1 4 2 (onmouseup)


    return button === 2 ? 2 : button === 4 ? 1 : 0;
  },
  buttons: null,
  relatedTarget: function relatedTarget(event) {
    return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
  },
  // "Proprietary" Interface.
  pageX: function pageX(event) {
    return 'pageX' in event ? event.pageX : event.clientX + ViewportMetrics_1.currentScrollLeft;
  },
  pageY: function pageY(event) {
    return 'pageY' in event ? event.pageY : event.clientY + ViewportMetrics_1.currentScrollTop;
  }
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticMouseEvent._r = [2];
SyntheticUIEvent_1.augmentClass(SyntheticMouseEvent, MouseEventInterface);
var SyntheticMouseEvent_1 = SyntheticMouseEvent;

var eventTypes$2 = {
  mouseEnter: {
    registrationName: 'onMouseEnter',
    dependencies: ['topMouseOut', 'topMouseOver']
  },
  mouseLeave: {
    registrationName: 'onMouseLeave',
    dependencies: ['topMouseOut', 'topMouseOver']
  }
};
var EnterLeaveEventPlugin = {
  eventTypes: eventTypes$2,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   */
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    if (topLevelType === 'topMouseOver' && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }

    if (topLevelType !== 'topMouseOut' && topLevelType !== 'topMouseOver') {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;

    if (nativeEventTarget.window === nativeEventTarget) {
      // `nativeEventTarget` is probably a window object.
      win = nativeEventTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = nativeEventTarget.ownerDocument;

      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from;
    var to;

    if (topLevelType === 'topMouseOut') {
      from = targetInst;
      var related = nativeEvent.relatedTarget || nativeEvent.toElement;
      to = related ? ReactDOMComponentTree_1.getClosestInstanceFromNode(related) : null;
    } else {
      // Moving to a node from outside the window.
      from = null;
      to = targetInst;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var fromNode = from == null ? win : ReactDOMComponentTree_1.getNodeFromInstance(from);
    var toNode = to == null ? win : ReactDOMComponentTree_1.getNodeFromInstance(to);
    var leave = SyntheticMouseEvent_1.getPooled(eventTypes$2.mouseLeave, from, nativeEvent, nativeEventTarget);
    leave.type = 'mouseleave';
    leave.target = fromNode;
    leave.relatedTarget = toNode;
    var enter = SyntheticMouseEvent_1.getPooled(eventTypes$2.mouseEnter, to, nativeEvent, nativeEventTarget);
    enter.type = 'mouseenter';
    enter.target = toNode;
    enter.relatedTarget = fromNode;
    EventPropagators_1.accumulateEnterLeaveDispatches(leave, enter, from, to);
    return [leave, enter];
  }
};
var EnterLeaveEventPlugin_1 = EnterLeaveEventPlugin;

var MUST_USE_PROPERTY = DOMProperty_1.injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = DOMProperty_1.injection.HAS_BOOLEAN_VALUE;
var HAS_NUMERIC_VALUE = DOMProperty_1.injection.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE = DOMProperty_1.injection.HAS_POSITIVE_NUMERIC_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE = DOMProperty_1.injection.HAS_OVERLOADED_BOOLEAN_VALUE;
var HTMLDOMPropertyConfig = {
  isCustomAttribute: RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + DOMProperty_1.ATTRIBUTE_NAME_CHAR + ']*$')),
  Properties: {
    /**
     * Standard Properties
     */
    accept: 0,
    acceptCharset: 0,
    accessKey: 0,
    action: 0,
    allowFullScreen: HAS_BOOLEAN_VALUE,
    allowTransparency: 0,
    alt: 0,
    // specifies target context for links with `preload` type
    as: 0,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: 0,
    // autoFocus is polyfilled/normalized by AutoFocusUtils
    // autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: HAS_BOOLEAN_VALUE,
    cellPadding: 0,
    cellSpacing: 0,
    charSet: 0,
    challenge: 0,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    cite: 0,
    classID: 0,
    className: 0,
    cols: HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: 0,
    content: 0,
    contentEditable: 0,
    contextMenu: 0,
    controls: HAS_BOOLEAN_VALUE,
    controlsList: 0,
    coords: 0,
    crossOrigin: 0,
    data: 0,
    // For `<object />` acts as `src`.
    dateTime: 0,
    'default': HAS_BOOLEAN_VALUE,
    defer: HAS_BOOLEAN_VALUE,
    dir: 0,
    disabled: HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: 0,
    encType: 0,
    form: 0,
    formAction: 0,
    formEncType: 0,
    formMethod: 0,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: 0,
    frameBorder: 0,
    headers: 0,
    height: 0,
    hidden: HAS_BOOLEAN_VALUE,
    high: 0,
    href: 0,
    hrefLang: 0,
    htmlFor: 0,
    httpEquiv: 0,
    icon: 0,
    id: 0,
    inputMode: 0,
    integrity: 0,
    is: 0,
    keyParams: 0,
    keyType: 0,
    kind: 0,
    label: 0,
    lang: 0,
    list: 0,
    loop: HAS_BOOLEAN_VALUE,
    low: 0,
    manifest: 0,
    marginHeight: 0,
    marginWidth: 0,
    max: 0,
    maxLength: 0,
    media: 0,
    mediaGroup: 0,
    method: 0,
    min: 0,
    minLength: 0,
    // Caution; `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`.
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: 0,
    nonce: 0,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    optimum: 0,
    pattern: 0,
    placeholder: 0,
    playsInline: HAS_BOOLEAN_VALUE,
    poster: 0,
    preload: 0,
    profile: 0,
    radioGroup: 0,
    readOnly: HAS_BOOLEAN_VALUE,
    referrerPolicy: 0,
    rel: 0,
    required: HAS_BOOLEAN_VALUE,
    reversed: HAS_BOOLEAN_VALUE,
    role: 0,
    rows: HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: HAS_NUMERIC_VALUE,
    sandbox: 0,
    scope: 0,
    scoped: HAS_BOOLEAN_VALUE,
    scrolling: 0,
    seamless: HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: 0,
    size: HAS_POSITIVE_NUMERIC_VALUE,
    sizes: 0,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: 0,
    src: 0,
    srcDoc: 0,
    srcLang: 0,
    srcSet: 0,
    start: HAS_NUMERIC_VALUE,
    step: 0,
    style: 0,
    summary: 0,
    tabIndex: 0,
    target: 0,
    title: 0,
    // Setting .type throws on non-<input> tags
    type: 0,
    useMap: 0,
    value: 0,
    width: 0,
    wmode: 0,
    wrap: 0,

    /**
     * RDFa Properties
     */
    about: 0,
    datatype: 0,
    inlist: 0,
    prefix: 0,
    // property is also supported for OpenGraph in meta tags.
    property: 0,
    resource: 0,
    'typeof': 0,
    vocab: 0,

    /**
     * Non-standard Properties
     */
    // autoCapitalize and autoCorrect are supported in Mobile Safari for
    // keyboard hints.
    autoCapitalize: 0,
    autoCorrect: 0,
    // autoSave allows WebKit/Blink to persist values of input fields on page reloads
    autoSave: 0,
    // color is for Safari mask-icon link
    color: 0,
    // itemProp, itemScope, itemType are for
    // Microdata support. See http://schema.org/docs/gs.html
    itemProp: 0,
    itemScope: HAS_BOOLEAN_VALUE,
    itemType: 0,
    // itemID and itemRef are for Microdata support as well but
    // only specified in the WHATWG spec document. See
    // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
    itemID: 0,
    itemRef: 0,
    // results show looking glass icon and recent searches on input
    // search fields in WebKit/Blink
    results: 0,
    // IE-only attribute that specifies security restrictions on an iframe
    // as an alternative to the sandbox attribute on IE<10
    security: 0,
    // IE-only attribute that controls focus behavior
    unselectable: 0
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMPropertyNames: {},
  DOMMutationMethods: {
    value: function value(node, _value) {
      if (_value == null) {
        return node.removeAttribute('value');
      } // Number inputs get special treatment due to some edge cases in
      // Chrome. Let everything else assign the value attribute as normal.
      // https://github.com/facebook/react/issues/7253#issuecomment-236074326


      if (node.type !== 'number' || node.hasAttribute('value') === false) {
        node.setAttribute('value', '' + _value);
      } else if (node.validity && !node.validity.badInput && node.ownerDocument.activeElement !== node) {
        // Don't assign an attribute if validation reports bad
        // input. Chrome will clear the value. Additionally, don't
        // operate on inputs that have focus, otherwise Chrome might
        // strip off trailing decimal places and cause the user's
        // cursor position to jump to the beginning of the input.
        //
        // In ReactDOMInput, we have an onBlur event that will trigger
        // this function again when focus is lost.
        node.setAttribute('value', '' + _value);
      }
    }
  }
};
var HTMLDOMPropertyConfig_1 = HTMLDOMPropertyConfig;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var DOMNamespaces = {
  html: 'http://www.w3.org/1999/xhtml',
  mathml: 'http://www.w3.org/1998/Math/MathML',
  svg: 'http://www.w3.org/2000/svg'
};
var DOMNamespaces_1 = DOMNamespaces;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* globals MSApp */
/**
 * Create a function which has 'unsafe' privileges (required by windows8 apps)
 */

var createMicrosoftUnsafeLocalFunction = function createMicrosoftUnsafeLocalFunction(func) {
  if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
    return function (arg0, arg1, arg2, arg3) {
      MSApp.execUnsafeLocalFunction(function () {
        return func(arg0, arg1, arg2, arg3);
      });
    };
  } else {
    return func;
  }
};

createMicrosoftUnsafeLocalFunction._r = [2];
var createMicrosoftUnsafeLocalFunction_1 = createMicrosoftUnsafeLocalFunction;

var WHITESPACE_TEST = /^[ \r\n\t\f]/;
var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/; // SVG temp container for IE lacking innerHTML

var reusableSVGContainer;
/**
 * Set the innerHTML property of a node, ensuring that whitespace is preserved
 * even in IE8.
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */

var setInnerHTML = createMicrosoftUnsafeLocalFunction_1(function (node, html) {
  // IE does not have innerHTML for SVG nodes, so instead we inject the
  // new markup in a temp node and then move the child nodes across into
  // the target node
  if (node.namespaceURI === DOMNamespaces_1.svg && !('innerHTML' in node)) {
    reusableSVGContainer = reusableSVGContainer || document.createElement('div');
    reusableSVGContainer.innerHTML = '<svg>' + html + '</svg>';
    var svgNode = reusableSVGContainer.firstChild;

    while (svgNode.firstChild) {
      node.appendChild(svgNode.firstChild);
    }
  } else {
    node.innerHTML = html;
  }
});

if (ExecutionEnvironment_1.canUseDOM) {
  // IE8: When updating a just created node with innerHTML only leading
  // whitespace is removed. When updating an existing node with innerHTML
  // whitespace in root TextNodes is also collapsed.
  // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html
  // Feature detection; only IE8 is known to behave improperly like this.
  var testElement = document.createElement('div');
  testElement.innerHTML = ' ';

  if (testElement.innerHTML === '') {
    setInnerHTML = function setInnerHTML(node, html) {
      // Magic theory: IE8 supposedly differentiates between added and updated
      // nodes when processing innerHTML, innerHTML on updated nodes suffers
      // from worse whitespace behavior. Re-adding a node like this triggers
      // the initial and more favorable whitespace behavior.
      // TODO: What to do on a detached node?
      if (node.parentNode) {
        node.parentNode.replaceChild(node, node);
      } // We also implement a workaround for non-visible tags disappearing into
      // thin air on IE8, this only happens if there is no visible text
      // in-front of the non-visible tags. Piggyback on the whitespace fix
      // and simply check if any non-visible tags appear in the source.


      if (WHITESPACE_TEST.test(html) || html[0] === '<' && NONVISIBLE_TEST.test(html)) {
        // Recover leading whitespace by temporarily prepending any character.
        // \uFEFF has the potential advantage of being zero-width/invisible.
        // UglifyJS drops U+FEFF chars when parsing, so use String.fromCharCode
        // in hopes that this is preserved even if "\uFEFF" is transformed to
        // the actual Unicode character (by Babel, for example).
        // https://github.com/mishoo/UglifyJS2/blob/v2.4.20/lib/parse.js#L216
        node.innerHTML = String.fromCharCode(0xfeff) + html; // deleteData leaves an empty `TextNode` which offsets the index of all
        // children. Definitely want to avoid this.

        var textNode = node.firstChild;

        if (textNode.data.length === 1) {
          node.removeChild(textNode);
        } else {
          textNode.deleteData(0, 1);
        }
      } else {
        node.innerHTML = html;
      }
    };
  }

  testElement = null;
}

var setInnerHTML_1 = setInnerHTML;

/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Based on the escape-html library, which is used under the MIT License below:
 *
 * Copyright (c) 2012-2013 TJ Holowaychuk
 * Copyright (c) 2015 Andreas Lubbe
 * Copyright (c) 2015 Tiancheng "Timothy" Gu
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;
/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
        break;

      case 38:
        // &
        escape = '&amp;';
        break;

      case 39:
        // '
        escape = '&#x27;'; // modified from escape-html; used to be '&#39'

        break;

      case 60:
        // <
        escape = '&lt;';
        break;

      case 62:
        // >
        escape = '&gt;';
        break;

      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
} // end code copied and modified from escape-html

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */


escapeHtml._r = [2];

function escapeTextContentForBrowser(text) {
  if (typeof text === 'boolean' || typeof text === 'number') {
    // this shortcircuit helps perf for types that we know will never have
    // special characters, especially given that this function is used often
    // for numeric dom ids.
    return '' + text;
  }

  return escapeHtml(text);
}

escapeTextContentForBrowser._r = [2];
var escapeTextContentForBrowser_1 = escapeTextContentForBrowser;

/**
 * Set the textContent property of a node, ensuring that whitespace is preserved
 * even in IE8. innerText is a poor substitute for textContent and, among many
 * issues, inserts <br> instead of the literal newline chars. innerHTML behaves
 * as it should.
 *
 * @param {DOMElement} node
 * @param {string} text
 * @internal
 */


var setTextContent = function setTextContent(node, text) {
  if (text) {
    var firstChild = node.firstChild;

    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === 3) {
      firstChild.nodeValue = text;
      return;
    }
  }

  node.textContent = text;
};

setTextContent._r = [2];

if (ExecutionEnvironment_1.canUseDOM) {
  if (!('textContent' in document.documentElement)) {
    setTextContent = function setTextContent(node, text) {
      if (node.nodeType === 3) {
        node.nodeValue = text;
        return;
      }

      setInnerHTML_1(node, escapeTextContentForBrowser_1(text));
    };
  }
}

var setTextContent_1 = setTextContent;

var ELEMENT_NODE_TYPE = 1;
var DOCUMENT_FRAGMENT_NODE_TYPE = 11;
/**
 * In IE (8-11) and Edge, appending nodes with no children is dramatically
 * faster than appending a full subtree, so we essentially queue up the
 * .appendChild calls here and apply them so each node is added to its parent
 * before any children are added.
 *
 * In other browsers, doing so is slower or neutral compared to the other order
 * (in Firefox, twice as slow) so we only do this inversion in IE.
 *
 * See https://github.com/spicyj/innerhtml-vs-createelement-vs-clonenode.
 */

var enableLazy = typeof document !== 'undefined' && typeof document.documentMode === 'number' || typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' && /\bEdge\/\d/.test(navigator.userAgent);

function insertTreeChildren(tree) {
  if (!enableLazy) {
    return;
  }

  var node = tree.node;
  var children = tree.children;

  if (children.length) {
    for (var i = 0; i < children.length; i++) {
      insertTreeBefore(node, children[i], null);
    }
  } else if (tree.html != null) {
    setInnerHTML_1(node, tree.html);
  } else if (tree.text != null) {
    setTextContent_1(node, tree.text);
  }
}

insertTreeChildren._r = [2];
var insertTreeBefore = createMicrosoftUnsafeLocalFunction_1(function (parentNode, tree, referenceNode) {
  // DocumentFragments aren't actually part of the DOM after insertion so
  // appending children won't update the DOM. We need to ensure the fragment
  // is properly populated first, breaking out of our lazy approach for just
  // this level. Also, some <object> plugins (like Flash Player) will read
  // <param> nodes immediately upon insertion into the DOM, so <object>
  // must also be populated prior to insertion into the DOM.
  if (tree.node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE || tree.node.nodeType === ELEMENT_NODE_TYPE && tree.node.nodeName.toLowerCase() === 'object' && (tree.node.namespaceURI == null || tree.node.namespaceURI === DOMNamespaces_1.html)) {
    insertTreeChildren(tree);
    parentNode.insertBefore(tree.node, referenceNode);
  } else {
    parentNode.insertBefore(tree.node, referenceNode);
    insertTreeChildren(tree);
  }
});

function replaceChildWithTree(oldNode, newTree) {
  oldNode.parentNode.replaceChild(newTree.node, oldNode);
  insertTreeChildren(newTree);
}

replaceChildWithTree._r = [2];

function queueChild(parentTree, childTree) {
  if (enableLazy) {
    parentTree.children.push(childTree);
  } else {
    parentTree.node.appendChild(childTree.node);
  }
}

queueChild._r = [2];

function queueHTML(tree, html) {
  if (enableLazy) {
    tree.html = html;
  } else {
    setInnerHTML_1(tree.node, html);
  }
}

queueHTML._r = [2];

function queueText(tree, text) {
  if (enableLazy) {
    tree.text = text;
  } else {
    setTextContent_1(tree.node, text);
  }
}

queueText._r = [2];

function toString() {
  return this.node.nodeName;
}

toString._r = [2];

function DOMLazyTree(node) {
  return {
    node: node,
    children: [],
    html: null,
    text: null,
    toString: toString
  };
}

DOMLazyTree._r = [2];
DOMLazyTree.insertTreeBefore = insertTreeBefore;
DOMLazyTree.replaceChildWithTree = replaceChildWithTree;
DOMLazyTree.queueChild = queueChild;
DOMLazyTree.queueHTML = queueHTML;
DOMLazyTree.queueText = queueText;
var DOMLazyTree_1 = DOMLazyTree;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * Convert array-like objects to arrays.
 *
 * This API assumes the caller knows the contents of the data type. For less
 * well defined inputs use createArrayFromMixed.
 *
 * @param {object|function|filelist} obj
 * @return {array}
 */


function toArray$2(obj) {
  var length = obj.length; // Some browsers builtin objects can report typeof 'function' (e.g. NodeList
  // in old versions of Safari).

  !(!Array.isArray(obj) && (_typeof$2(obj) === 'object' || typeof obj === 'function')) ? invariant_1(false) : void 0;
  !(typeof length === 'number') ? invariant_1(false) : void 0;
  !(length === 0 || length - 1 in obj) ? invariant_1(false) : void 0;
  !(typeof obj.callee !== 'function') ? invariant_1(false) : void 0; // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
  // without method will throw during the slice call and skip straight to the
  // fallback.

  if (obj.hasOwnProperty) {
    try {
      return Array.prototype.slice.call(obj);
    } catch (e) {// IE < 9 does not support Array#slice on collections objects
    }
  } // Fall back to copying key by key. This assumes all keys have a value,
  // so will not preserve sparsely populated inputs.


  var ret = Array(length);

  for (var ii = 0; ii < length; ii++) {
    ret[ii] = obj[ii];
  }

  return ret;
}
/**
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * It will return false for other array-like objects like Filelist.
 *
 * @param {*} obj
 * @return {boolean}
 */


toArray$2._r = [2];

function hasArrayNature(obj) {
  return (// not null/false
    !!obj && ( // arrays are objects, NodeLists are functions in Safari
    _typeof$2(obj) == 'object' || typeof obj == 'function') && // quacks like an array
    'length' in obj && // not window
    !('setInterval' in obj) && // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    typeof obj.nodeType != 'number' && ( // a real array
    Array.isArray(obj) || // arguments
    'callee' in obj || // HTMLCollection/NodeList
    'item' in obj)
  );
}
/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFromMixed = require('createArrayFromMixed');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFromMixed(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * If you need to convert an array-like object, like `arguments`, into an array
 * use toArray instead.
 *
 * @param {*} obj
 * @return {array}
 */


hasArrayNature._r = [2];

function createArrayFromMixed(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  } else if (Array.isArray(obj)) {
    return obj.slice();
  } else {
    return toArray$2(obj);
  }
}

createArrayFromMixed._r = [2];
var createArrayFromMixed_1 = createArrayFromMixed;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/*eslint-disable fb-www/unsafe-html */

/**
 * Dummy container used to detect which wraps are necessary.
 */


var dummyNode$1 = ExecutionEnvironment_1.canUseDOM ? document.createElement('div') : null;
/**
 * Some browsers cannot use `innerHTML` to render certain elements standalone,
 * so we wrap them, render the wrapped nodes, then extract the desired node.
 *
 * In IE8, certain elements cannot render alone, so wrap all elements ('*').
 */

var shouldWrap = {};
var selectWrap = [1, '<select multiple="true">', '</select>'];
var tableWrap = [1, '<table>', '</table>'];
var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
var svgWrap = [1, '<svg xmlns="http://www.w3.org/2000/svg">', '</svg>'];
var markupWrap = {
  '*': [1, '?<div>', '</div>'],
  'area': [1, '<map>', '</map>'],
  'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  'legend': [1, '<fieldset>', '</fieldset>'],
  'param': [1, '<object>', '</object>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],
  'optgroup': selectWrap,
  'option': selectWrap,
  'caption': tableWrap,
  'colgroup': tableWrap,
  'tbody': tableWrap,
  'tfoot': tableWrap,
  'thead': tableWrap,
  'td': trWrap,
  'th': trWrap
}; // Initialize the SVG elements since we know they'll always need to be wrapped
// consistently. If they are created inside a <div> they will be initialized in
// the wrong namespace (and will not display).

var svgElements = ['circle', 'clipPath', 'defs', 'ellipse', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'text', 'tspan'];
svgElements.forEach(function (nodeName) {
  markupWrap[nodeName] = svgWrap;
  shouldWrap[nodeName] = true;
});
/**
 * Gets the markup wrap configuration for the supplied `nodeName`.
 *
 * NOTE: This lazily detects which wraps are necessary for the current browser.
 *
 * @param {string} nodeName Lowercase `nodeName`.
 * @return {?array} Markup wrap configuration, if applicable.
 */

function getMarkupWrap(nodeName) {
  !!!dummyNode$1 ? invariant_1(false) : void 0;

  if (!markupWrap.hasOwnProperty(nodeName)) {
    nodeName = '*';
  }

  if (!shouldWrap.hasOwnProperty(nodeName)) {
    if (nodeName === '*') {
      dummyNode$1.innerHTML = '<link />';
    } else {
      dummyNode$1.innerHTML = '<' + nodeName + '></' + nodeName + '>';
    }

    shouldWrap[nodeName] = !dummyNode$1.firstChild;
  }

  return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
}

getMarkupWrap._r = [2];
var getMarkupWrap_1 = getMarkupWrap;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/*eslint-disable fb-www/unsafe-html*/

/**
 * Dummy container used to render all markup.
 */


var dummyNode = ExecutionEnvironment_1.canUseDOM ? document.createElement('div') : null;
/**
 * Pattern used by `getNodeName`.
 */

var nodeNamePattern = /^\s*<(\w+)/;
/**
 * Extracts the `nodeName` of the first element in a string of markup.
 *
 * @param {string} markup String of markup.
 * @return {?string} Node name of the supplied markup.
 */

function getNodeName(markup) {
  var nodeNameMatch = markup.match(nodeNamePattern);
  return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}
/**
 * Creates an array containing the nodes rendered from the supplied markup. The
 * optionally supplied `handleScript` function will be invoked once for each
 * <script> element that is rendered. If no `handleScript` function is supplied,
 * an exception is thrown if any <script> elements are rendered.
 *
 * @param {string} markup A string of valid HTML markup.
 * @param {?function} handleScript Invoked once for each rendered <script>.
 * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
 */


getNodeName._r = [2];

function createNodesFromMarkup(markup, handleScript) {
  var node = dummyNode;
  !!!dummyNode ? invariant_1(false) : void 0;
  var nodeName = getNodeName(markup);
  var wrap = nodeName && getMarkupWrap_1(nodeName);

  if (wrap) {
    node.innerHTML = wrap[1] + markup + wrap[2];
    var wrapDepth = wrap[0];

    while (wrapDepth--) {
      node = node.lastChild;
    }
  } else {
    node.innerHTML = markup;
  }

  var scripts = node.getElementsByTagName('script');

  if (scripts.length) {
    !handleScript ? invariant_1(false) : void 0;
    createArrayFromMixed_1(scripts).forEach(handleScript);
  }

  var nodes = Array.from(node.childNodes);

  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }

  return nodes;
}

createNodesFromMarkup._r = [2];
var createNodesFromMarkup_1 = createNodesFromMarkup;

var Danger = {
  /**
   * Replaces a node with a string of markup at its current position within its
   * parent. The markup must render into a single root node.
   *
   * @param {DOMElement} oldChild Child node to replace.
   * @param {string} markup Markup to render in place of the child node.
   * @internal
   */
  dangerouslyReplaceNodeWithMarkup: function dangerouslyReplaceNodeWithMarkup(oldChild, markup) {
    !ExecutionEnvironment_1.canUseDOM ? reactProdInvariant_1$2('56') : void 0;
    !markup ? reactProdInvariant_1$2('57') : void 0;
    !(oldChild.nodeName !== 'HTML') ? reactProdInvariant_1$2('58') : void 0;

    if (typeof markup === 'string') {
      var newChild = createNodesFromMarkup_1(markup, emptyFunction_1)[0];
      oldChild.parentNode.replaceChild(newChild, oldChild);
    } else {
      DOMLazyTree_1.replaceChildWithTree(oldChild, markup);
    }
  }
};
var Danger_1 = Danger;

function getNodeAfter(parentNode, node) {
  // Special case for text components, which return [open, close] comments
  // from getHostNode.
  if (Array.isArray(node)) {
    node = node[1];
  }

  return node ? node.nextSibling : parentNode.firstChild;
}
/**
 * Inserts `childNode` as a child of `parentNode` at the `index`.
 *
 * @param {DOMElement} parentNode Parent node in which to insert.
 * @param {DOMElement} childNode Child node to insert.
 * @param {number} index Index at which to insert the child.
 * @internal
 */


getNodeAfter._r = [2];
var insertChildAt = createMicrosoftUnsafeLocalFunction_1(function (parentNode, childNode, referenceNode) {
  // We rely exclusively on `insertBefore(node, null)` instead of also using
  // `appendChild(node)`. (Using `undefined` is not allowed by all browsers so
  // we are careful to use `null`.)
  parentNode.insertBefore(childNode, referenceNode);
});

function insertLazyTreeChildAt(parentNode, childTree, referenceNode) {
  DOMLazyTree_1.insertTreeBefore(parentNode, childTree, referenceNode);
}

insertLazyTreeChildAt._r = [2];

function moveChild(parentNode, childNode, referenceNode) {
  if (Array.isArray(childNode)) {
    moveDelimitedText(parentNode, childNode[0], childNode[1], referenceNode);
  } else {
    insertChildAt(parentNode, childNode, referenceNode);
  }
}

moveChild._r = [2];

function removeChild(parentNode, childNode) {
  if (Array.isArray(childNode)) {
    var closingComment = childNode[1];
    childNode = childNode[0];
    removeDelimitedText(parentNode, childNode, closingComment);
    parentNode.removeChild(closingComment);
  }

  parentNode.removeChild(childNode);
}

removeChild._r = [2];

function moveDelimitedText(parentNode, openingComment, closingComment, referenceNode) {
  var node = openingComment;

  while (true) {
    var nextNode = node.nextSibling;
    insertChildAt(parentNode, node, referenceNode);

    if (node === closingComment) {
      break;
    }

    node = nextNode;
  }
}

moveDelimitedText._r = [2];

function removeDelimitedText(parentNode, startNode, closingComment) {
  while (true) {
    var node = startNode.nextSibling;

    if (node === closingComment) {
      // The closing comment is removed by ReactMultiChild.
      break;
    } else {
      parentNode.removeChild(node);
    }
  }
}

removeDelimitedText._r = [2];

function replaceDelimitedText(openingComment, closingComment, stringText) {
  var parentNode = openingComment.parentNode;
  var nodeAfterComment = openingComment.nextSibling;

  if (nodeAfterComment === closingComment) {
    // There are no text nodes between the opening and closing comments; insert
    // a new one if stringText isn't empty.
    if (stringText) {
      insertChildAt(parentNode, document.createTextNode(stringText), nodeAfterComment);
    }
  } else {
    if (stringText) {
      // Set the text content of the first node after the opening comment, and
      // remove all following nodes up until the closing comment.
      setTextContent_1(nodeAfterComment, stringText);
      removeDelimitedText(parentNode, nodeAfterComment, closingComment);
    } else {
      removeDelimitedText(parentNode, openingComment, closingComment);
    }
  }

  
}

replaceDelimitedText._r = [2];
var dangerouslyReplaceNodeWithMarkup = Danger_1.dangerouslyReplaceNodeWithMarkup;

/**
 * Operations for updating with DOM children.
 */


var DOMChildrenOperations = {
  dangerouslyReplaceNodeWithMarkup: dangerouslyReplaceNodeWithMarkup,
  replaceDelimitedText: replaceDelimitedText,

  /**
   * Updates a component's children by processing a series of updates. The
   * update configurations are each expected to have a `parentNode` property.
   *
   * @param {array<object>} updates List of update configurations.
   * @internal
   */
  processUpdates: function processUpdates(parentNode, updates) {
    for (var k = 0; k < updates.length; k++) {
      var update = updates[k];

      switch (update.type) {
        case 'INSERT_MARKUP':
          insertLazyTreeChildAt(parentNode, update.content, getNodeAfter(parentNode, update.afterNode));

          

          break;

        case 'MOVE_EXISTING':
          moveChild(parentNode, update.fromNode, getNodeAfter(parentNode, update.afterNode));

          

          break;

        case 'SET_MARKUP':
          setInnerHTML_1(parentNode, update.content);

          

          break;

        case 'TEXT_CONTENT':
          setTextContent_1(parentNode, update.content);

          

          break;

        case 'REMOVE_NODE':
          removeChild(parentNode, update.fromNode);

          

          break;
      }
    }
  }
};
var DOMChildrenOperations_1 = DOMChildrenOperations;

/**
 * Operations used to process updates to DOM nodes.
 */


var ReactDOMIDOperations = {
  /**
   * Updates a component's children by processing a series of updates.
   *
   * @param {array<object>} updates List of update configurations.
   * @internal
   */
  dangerouslyProcessChildrenUpdates: function dangerouslyProcessChildrenUpdates(parentInst, updates) {
    var node = ReactDOMComponentTree_1.getNodeFromInstance(parentInst);
    DOMChildrenOperations_1.processUpdates(node, updates);
  }
};
var ReactDOMIDOperations_1 = ReactDOMIDOperations;

/**
 * Abstracts away all functionality of the reconciler that requires knowledge of
 * the browser context. TODO: These callers should be refactored to avoid the
 * need for this injection.
 */


var ReactComponentBrowserEnvironment = {
  processChildrenUpdates: ReactDOMIDOperations_1.dangerouslyProcessChildrenUpdates,
  replaceNodeWithMarkup: DOMChildrenOperations_1.dangerouslyReplaceNodeWithMarkup
};
var ReactComponentBrowserEnvironment_1 = ReactComponentBrowserEnvironment;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * @param {DOMElement} node input/textarea to focus
 */

function focusNode(node) {
  // IE8 can throw "Can't move focus to the control because it is invisible,
  // not enabled, or of a type that does not accept the focus." for all kinds of
  // reasons that are too expensive and fragile to test.
  try {
    node.focus();
  } catch (e) {}
}

focusNode._r = [2];
var focusNode_1 = focusNode;

var AutoFocusUtils = {
  focusDOMComponent: function focusDOMComponent() {
    focusNode_1(ReactDOMComponentTree_1.getNodeFromInstance(this));
  }
};
var AutoFocusUtils_1 = AutoFocusUtils;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * CSS properties which accept numbers but are not in units of "px".
 */

var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */

function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}
/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */


prefixKey._r = [2];
var prefixes = ['Webkit', 'ms', 'Moz', 'O']; // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.

Object.keys(isUnitlessNumber).forEach(function (prop) {
  prefixes.forEach(function (prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});
/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */

var shorthandPropertyExpansions = {
  background: {
    backgroundAttachment: true,
    backgroundColor: true,
    backgroundImage: true,
    backgroundPositionX: true,
    backgroundPositionY: true,
    backgroundRepeat: true
  },
  backgroundPosition: {
    backgroundPositionX: true,
    backgroundPositionY: true
  },
  border: {
    borderWidth: true,
    borderStyle: true,
    borderColor: true
  },
  borderBottom: {
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true
  },
  borderLeft: {
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true
  },
  borderRight: {
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true
  },
  borderTop: {
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true
  },
  font: {
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    fontSize: true,
    lineHeight: true,
    fontFamily: true
  },
  outline: {
    outlineWidth: true,
    outlineStyle: true,
    outlineColor: true
  }
};
var CSSProperty = {
  isUnitlessNumber: isUnitlessNumber,
  shorthandPropertyExpansions: shorthandPropertyExpansions
};
var CSSProperty_1 = CSSProperty;

var isUnitlessNumber$1 = CSSProperty_1.isUnitlessNumber;
/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @param {ReactDOMComponent} component
 * @return {string} Normalized style value with dimensions applied.
 */

function dangerousStyleValue(name, value, component, isCustomProperty) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901
  var isEmpty = value == null || typeof value === 'boolean' || value === '';

  if (isEmpty) {
    return '';
  }

  var isNonNumeric = isNaN(value);

  if (isCustomProperty || isNonNumeric || value === 0 || isUnitlessNumber$1.hasOwnProperty(name) && isUnitlessNumber$1[name]) {
    return '' + value; // cast to string
  }

  if (typeof value === 'string') {
    value = value.trim();
  }

  return value + 'px';
}

dangerousStyleValue._r = [2];
var dangerousStyleValue_1 = dangerousStyleValue;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;
/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */

function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

hyphenate._r = [2];
var hyphenate_1 = hyphenate;

var msPattern$1 = /^ms-/;
/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */

function hyphenateStyleName(string) {
  return hyphenate_1(string).replace(msPattern$1, '-ms-');
}

hyphenateStyleName._r = [2];
var hyphenateStyleName_1 = hyphenateStyleName;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @typechecks static-only
 */
/**
 * Memoizes the return value of a function that accepts one string argument.
 */

function memoizeStringOnly(callback) {
  var cache = {};
  return function (string) {
    if (!cache.hasOwnProperty(string)) {
      cache[string] = callback.call(this, string);
    }

    return cache[string];
  };
}

memoizeStringOnly._r = [2];
var memoizeStringOnly_1 = memoizeStringOnly;

var processStyleName = memoizeStringOnly_1(function (styleName) {
  return hyphenateStyleName_1(styleName);
});
var hasShorthandPropertyBug = false;
var styleFloatAccessor = 'cssFloat';

if (ExecutionEnvironment_1.canUseDOM) {
  var tempStyle = document.createElement('div').style;

  try {
    // IE8 throws "Invalid argument." if resetting shorthand style properties.
    tempStyle.font = '';
  } catch (e) {
    hasShorthandPropertyBug = true;
  } // IE8 only supports accessing cssFloat (standard) as styleFloat


  if (document.documentElement.style.cssFloat === undefined) {
    styleFloatAccessor = 'styleFloat';
  }
}

/**
 * Operations for dealing with CSS properties.
 */


var CSSPropertyOperations = {
  /**
   * Serializes a mapping of style properties for use as inline styles:
   *
   *   > createMarkupForStyles({width: '200px', height: 0})
   *   "width:200px;height:0;"
   *
   * Undefined values are ignored so that declarative programming is easier.
   * The result should be HTML-escaped before insertion into the DOM.
   *
   * @param {object} styles
   * @param {ReactDOMComponent} component
   * @return {?string}
   */
  createMarkupForStyles: function createMarkupForStyles(styles, component) {
    var serialized = '';

    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }

      var isCustomProperty = styleName.indexOf('--') === 0;
      var styleValue = styles[styleName];

      if (styleValue != null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue_1(styleName, styleValue, component, isCustomProperty) + ';';
      }
    }

    return serialized || null;
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   * @param {ReactDOMComponent} component
   */
  setValueForStyles: function setValueForStyles(node, styles, component) {
    var style = node.style;

    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }

      var isCustomProperty = styleName.indexOf('--') === 0;

      var styleValue = dangerousStyleValue_1(styleName, styles[styleName], component, isCustomProperty);

      if (styleName === 'float' || styleName === 'cssFloat') {
        styleName = styleFloatAccessor;
      }

      if (isCustomProperty) {
        style.setProperty(styleName, styleValue);
      } else if (styleValue) {
        style[styleName] = styleValue;
      } else {
        var expansion = hasShorthandPropertyBug && CSSProperty_1.shorthandPropertyExpansions[styleName];

        if (expansion) {
          // Shorthand property that IE8 won't like unsetting, so unset each
          // component to placate it
          for (var individualStyleName in expansion) {
            style[individualStyleName] = '';
          }
        } else {
          style[styleName] = '';
        }
      }
    }
  }
};
var CSSPropertyOperations_1 = CSSPropertyOperations;

/**
 * Escapes attribute value to prevent scripting attacks.
 *
 * @param {*} value Value to escape.
 * @return {string} An escaped string.
 */


function quoteAttributeValueForBrowser(value) {
  return '"' + escapeTextContentForBrowser_1(value) + '"';
}

quoteAttributeValueForBrowser._r = [2];
var quoteAttributeValueForBrowser_1 = quoteAttributeValueForBrowser;

var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + DOMProperty_1.ATTRIBUTE_NAME_START_CHAR + '][' + DOMProperty_1.ATTRIBUTE_NAME_CHAR + ']*$');
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};

function isAttributeNameSafe(attributeName) {
  if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
    return true;
  }

  if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
    return false;
  }

  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }

  illegalAttributeNameCache[attributeName] = true;
  void 0;
  return false;
}

isAttributeNameSafe._r = [2];

function shouldIgnoreValue(propertyInfo, value) {
  return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
}
/**
 * Operations for dealing with DOM properties.
 */


shouldIgnoreValue._r = [2];
var DOMPropertyOperations = {
  /**
   * Creates markup for the ID property.
   *
   * @param {string} id Unescaped ID.
   * @return {string} Markup string.
   */
  createMarkupForID: function createMarkupForID(id) {
    return DOMProperty_1.ID_ATTRIBUTE_NAME + '=' + quoteAttributeValueForBrowser_1(id);
  },
  setAttributeForID: function setAttributeForID(node, id) {
    node.setAttribute(DOMProperty_1.ID_ATTRIBUTE_NAME, id);
  },
  createMarkupForRoot: function createMarkupForRoot() {
    return DOMProperty_1.ROOT_ATTRIBUTE_NAME + '=""';
  },
  setAttributeForRoot: function setAttributeForRoot(node) {
    node.setAttribute(DOMProperty_1.ROOT_ATTRIBUTE_NAME, '');
  },

  /**
   * Creates markup for a property.
   *
   * @param {string} name
   * @param {*} value
   * @return {?string} Markup string, or null if the property was invalid.
   */
  createMarkupForProperty: function createMarkupForProperty(name, value) {
    var propertyInfo = DOMProperty_1.properties.hasOwnProperty(name) ? DOMProperty_1.properties[name] : null;

    if (propertyInfo) {
      if (shouldIgnoreValue(propertyInfo, value)) {
        return '';
      }

      var attributeName = propertyInfo.attributeName;

      if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
        return attributeName + '=""';
      }

      return attributeName + '=' + quoteAttributeValueForBrowser_1(value);
    } else if (DOMProperty_1.isCustomAttribute(name)) {
      if (value == null) {
        return '';
      }

      return name + '=' + quoteAttributeValueForBrowser_1(value);
    }

    return null;
  },

  /**
   * Creates markup for a custom property.
   *
   * @param {string} name
   * @param {*} value
   * @return {string} Markup string, or empty string if the property was invalid.
   */
  createMarkupForCustomAttribute: function createMarkupForCustomAttribute(name, value) {
    if (!isAttributeNameSafe(name) || value == null) {
      return '';
    }

    return name + '=' + quoteAttributeValueForBrowser_1(value);
  },

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  setValueForProperty: function setValueForProperty(node, name, value) {
    var propertyInfo = DOMProperty_1.properties.hasOwnProperty(name) ? DOMProperty_1.properties[name] : null;

    if (propertyInfo) {
      var mutationMethod = propertyInfo.mutationMethod;

      if (mutationMethod) {
        mutationMethod(node, value);
      } else if (shouldIgnoreValue(propertyInfo, value)) {
        this.deleteValueForProperty(node, name);
        return;
      } else if (propertyInfo.mustUseProperty) {
        // Contrary to `setAttribute`, object properties are properly
        // `toString`ed by IE8/9.
        node[propertyInfo.propertyName] = value;
      } else {
        var attributeName = propertyInfo.attributeName;
        var namespace = propertyInfo.attributeNamespace; // `setAttribute` with objects becomes only `[object]` in IE8/9,
        // ('' + value) makes it output the correct toString()-value.

        if (namespace) {
          node.setAttributeNS(namespace, attributeName, '' + value);
        } else if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
          node.setAttribute(attributeName, '');
        } else {
          node.setAttribute(attributeName, '' + value);
        }
      }
    } else if (DOMProperty_1.isCustomAttribute(name)) {
      DOMPropertyOperations.setValueForAttribute(node, name, value);
      return;
    }

    
  },
  setValueForAttribute: function setValueForAttribute(node, name, value) {
    if (!isAttributeNameSafe(name)) {
      return;
    }

    if (value == null) {
      node.removeAttribute(name);
    } else {
      node.setAttribute(name, '' + value);
    }

    
  },

  /**
   * Deletes an attributes from a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForAttribute: function deleteValueForAttribute(node, name) {
    node.removeAttribute(name);

    
  },

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForProperty: function deleteValueForProperty(node, name) {
    var propertyInfo = DOMProperty_1.properties.hasOwnProperty(name) ? DOMProperty_1.properties[name] : null;

    if (propertyInfo) {
      var mutationMethod = propertyInfo.mutationMethod;

      if (mutationMethod) {
        mutationMethod(node, undefined);
      } else if (propertyInfo.mustUseProperty) {
        var propName = propertyInfo.propertyName;

        if (propertyInfo.hasBooleanValue) {
          node[propName] = false;
        } else {
          node[propName] = '';
        }
      } else {
        node.removeAttribute(propertyInfo.attributeName);
      }
    } else if (DOMProperty_1.isCustomAttribute(name)) {
      node.removeAttribute(name);
    }

    
  }
};
var DOMPropertyOperations_1 = DOMPropertyOperations;

function runEventQueueInBatch(events) {
  EventPluginHub_1.enqueueEvents(events);
  EventPluginHub_1.processEventQueue(false);
}

runEventQueueInBatch._r = [2];
var ReactEventEmitterMixin = {
  /**
   * Streams a fired top-level event to `EventPluginHub` where plugins have the
   * opportunity to create `ReactEvent`s to be dispatched.
   */
  handleTopLevel: function handleTopLevel(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events = EventPluginHub_1.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
    runEventQueueInBatch(events);
  }
};
var ReactEventEmitterMixin_1 = ReactEventEmitterMixin;

/**
 * Generate a mapping of standard vendor prefixes using the defined style property and event name.
 *
 * @param {string} styleProp
 * @param {string} eventName
 * @returns {object}
 */


function makePrefixMap(styleProp, eventName) {
  var prefixes = {};
  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  prefixes['ms' + styleProp] = 'MS' + eventName;
  prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();
  return prefixes;
}
/**
 * A list of event names to a configurable list of vendor prefixes.
 */


makePrefixMap._r = [2];
var vendorPrefixes = {
  animationend: makePrefixMap('Animation', 'AnimationEnd'),
  animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
  animationstart: makePrefixMap('Animation', 'AnimationStart'),
  transitionend: makePrefixMap('Transition', 'TransitionEnd')
};
/**
 * Event names that have already been detected and prefixed (if applicable).
 */

var prefixedEventNames = {};
/**
 * Element to check for prefixes on.
 */

var style = {};
/**
 * Bootstrap if a DOM exists.
 */

if (ExecutionEnvironment_1.canUseDOM) {
  style = document.createElement('div').style; // On some platforms, in particular some releases of Android 4.x,
  // the un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are usable, and if not remove them from the map.

  if (!('AnimationEvent' in window)) {
    delete vendorPrefixes.animationend.animation;
    delete vendorPrefixes.animationiteration.animation;
    delete vendorPrefixes.animationstart.animation;
  } // Same as above


  if (!('TransitionEvent' in window)) {
    delete vendorPrefixes.transitionend.transition;
  }
}
/**
 * Attempts to determine the correct vendor prefixed event name.
 *
 * @param {string} eventName
 * @returns {string}
 */


function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  } else if (!vendorPrefixes[eventName]) {
    return eventName;
  }

  var prefixMap = vendorPrefixes[eventName];

  for (var styleProp in prefixMap) {
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
      return prefixedEventNames[eventName] = prefixMap[styleProp];
    }
  }

  return '';
}

getVendorPrefixedEventName._r = [2];
var getVendorPrefixedEventName_1 = getVendorPrefixedEventName;

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactEventListener, which is injected and can therefore support pluggable
 *    event sources. This is the only work that occurs in the main thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */


var hasEventPageXY;
var alreadyListeningTo = {};
var isMonitoringScrollValue = false;
var reactTopListenersCounter = 0; // For events like 'submit' which don't consistently bubble (which we trap at a
// lower node than `document`), binding at `document` would cause duplicate
// events so we don't include them here

var topEventMapping = {
  topAbort: 'abort',
  topAnimationEnd: getVendorPrefixedEventName_1('animationend') || 'animationend',
  topAnimationIteration: getVendorPrefixedEventName_1('animationiteration') || 'animationiteration',
  topAnimationStart: getVendorPrefixedEventName_1('animationstart') || 'animationstart',
  topBlur: 'blur',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topChange: 'change',
  topClick: 'click',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topScroll: 'scroll',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topSelectionChange: 'selectionchange',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTextInput: 'textInput',
  topTimeUpdate: 'timeupdate',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topTransitionEnd: getVendorPrefixedEventName_1('transitionend') || 'transitionend',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting',
  topWheel: 'wheel'
};
/**
 * To ensure no conflicts with other potential React instances on the page
 */

var topListenersIDKey = '_reactListenersID' + String(Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
  // directly.
  if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }

  return alreadyListeningTo[mountAt[topListenersIDKey]];
}
/**
 * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
 * example:
 *
 *   EventPluginHub.putListener('myID', 'onClick', myFunction);
 *
 * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
 *
 * @internal
 */


getListeningForDocument._r = [2];

var ReactBrowserEventEmitter = objectAssign({}, ReactEventEmitterMixin_1, {
  /**
   * Injectable event backend
   */
  ReactEventListener: null,
  injection: {
    /**
     * @param {object} ReactEventListener
     */
    injectReactEventListener: function injectReactEventListener(ReactEventListener) {
      ReactEventListener.setHandleTopLevel(ReactBrowserEventEmitter.handleTopLevel);
      ReactBrowserEventEmitter.ReactEventListener = ReactEventListener;
    }
  },

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function setEnabled(enabled) {
    if (ReactBrowserEventEmitter.ReactEventListener) {
      ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled);
    }
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function isEnabled() {
    return !!(ReactBrowserEventEmitter.ReactEventListener && ReactBrowserEventEmitter.ReactEventListener.isEnabled());
  },

  /**
   * We listen for bubbled touch events on the document object.
   *
   * Firefox v8.01 (and possibly others) exhibited strange behavior when
   * mounting `onmousemove` events at some node that was not the document
   * element. The symptoms were that if your mouse is not moving over something
   * contained within that mount point (for example on the background) the
   * top-level listeners for `onmousemove` won't be called. However, if you
   * register the `mousemove` on the document object, then it will of course
   * catch all `mousemove`s. This along with iOS quirks, justifies restricting
   * top-level listeners to the document object only, at least for these
   * movement types of events and possibly all events.
   *
   * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
   *
   * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
   * they bubble to document.
   *
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {object} contentDocumentHandle Document which owns the container
   */
  listenTo: function listenTo(registrationName, contentDocumentHandle) {
    var mountAt = contentDocumentHandle;
    var isListening = getListeningForDocument(mountAt);
    var dependencies = EventPluginRegistry_1.registrationNameDependencies[registrationName];

    for (var i = 0; i < dependencies.length; i++) {
      var dependency = dependencies[i];

      if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
        if (dependency === 'topWheel') {
          if (isEventSupported_1('wheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topWheel', 'wheel', mountAt);
          } else if (isEventSupported_1('mousewheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topWheel', 'mousewheel', mountAt);
          } else {
            // Firefox needs to capture a different mouse scroll event.
            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topWheel', 'DOMMouseScroll', mountAt);
          }
        } else if (dependency === 'topScroll') {
          if (isEventSupported_1('scroll', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent('topScroll', 'scroll', mountAt);
          } else {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topScroll', 'scroll', ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE);
          }
        } else if (dependency === 'topFocus' || dependency === 'topBlur') {
          if (isEventSupported_1('focus', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent('topFocus', 'focus', mountAt);
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent('topBlur', 'blur', mountAt);
          } else if (isEventSupported_1('focusin')) {
            // IE has `focusin` and `focusout` events which bubble.
            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topFocus', 'focusin', mountAt);
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent('topBlur', 'focusout', mountAt);
          } // to make sure blur and focus event listeners are only attached once


          isListening.topBlur = true;
          isListening.topFocus = true;
        } else if (topEventMapping.hasOwnProperty(dependency)) {
          ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(dependency, topEventMapping[dependency], mountAt);
        }

        isListening[dependency] = true;
      }
    }
  },
  trapBubbledEvent: function trapBubbledEvent(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelType, handlerBaseName, handle);
  },
  trapCapturedEvent: function trapCapturedEvent(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelType, handlerBaseName, handle);
  },

  /**
   * Protect against document.createEvent() returning null
   * Some popup blocker extensions appear to do this:
   * https://github.com/facebook/react/issues/6887
   */
  supportsEventPageXY: function supportsEventPageXY() {
    if (!document.createEvent) {
      return false;
    }

    var ev = document.createEvent('MouseEvent');
    return ev != null && 'pageX' in ev;
  },

  /**
   * Listens to window scroll and resize events. We cache scroll values so that
   * application code can access them without triggering reflows.
   *
   * ViewportMetrics is only used by SyntheticMouse/TouchEvent and only when
   * pageX/pageY isn't supported (legacy browsers).
   *
   * NOTE: Scroll events do not bubble.
   *
   * @see http://www.quirksmode.org/dom/events/scroll.html
   */
  ensureScrollValueMonitoring: function ensureScrollValueMonitoring() {
    if (hasEventPageXY === undefined) {
      hasEventPageXY = ReactBrowserEventEmitter.supportsEventPageXY();
    }

    if (!hasEventPageXY && !isMonitoringScrollValue) {
      var refresh = ViewportMetrics_1.refreshScrollValues;
      ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh);
      isMonitoringScrollValue = true;
    }
  }
});

var ReactBrowserEventEmitter_1 = ReactBrowserEventEmitter;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var ReactPropTypesSecret$5 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
var ReactPropTypesSecret_1$4 = ReactPropTypesSecret$5;

var PropTypes = factory_1(React_1.isValidElement);
var hasReadOnlyValue = {
  button: true,
  checkbox: true,
  image: true,
  hidden: true,
  radio: true,
  reset: true,
  submit: true
};

function _assertSingleLink(inputProps) {
  !(inputProps.checkedLink == null || inputProps.valueLink == null) ? reactProdInvariant_1$2('87') : void 0;
}

_assertSingleLink._r = [2];

function _assertValueLink(inputProps) {
  _assertSingleLink(inputProps);

  !(inputProps.value == null && inputProps.onChange == null) ? reactProdInvariant_1$2('88') : void 0;
}

_assertValueLink._r = [2];

function _assertCheckedLink(inputProps) {
  _assertSingleLink(inputProps);

  !(inputProps.checked == null && inputProps.onChange == null) ? reactProdInvariant_1$2('89') : void 0;
}

_assertCheckedLink._r = [2];
var propTypes = {
  value: function value(props, propName, componentName) {
    if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
      return null;
    }

    return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
  },
  checked: function checked(props, propName, componentName) {
    if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
      return null;
    }

    return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
  },
  onChange: PropTypes.func
};
var loggedTypeFailures$2 = {};

function getDeclarationErrorAddendum$2(owner) {
  if (owner) {
    var name = owner.getName();

    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }

  return '';
}
/**
 * Provide a linked `value` attribute for controlled forms. You should not use
 * this outside of the ReactDOM controlled form components.
 */


getDeclarationErrorAddendum$2._r = [2];
var LinkedValueUtils = {
  checkPropTypes: function checkPropTypes(tagName, props, owner) {
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        var error = propTypes[propName](props, propName, tagName, 'prop', null, ReactPropTypesSecret_1$4);
      }

      if (error instanceof Error && !(error.message in loggedTypeFailures$2)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures$2[error.message] = true;
        var addendum = getDeclarationErrorAddendum$2(owner);
        void 0;
      }
    }
  },

  /**
   * @param {object} inputProps Props for form component
   * @return {*} current value of the input either from value prop or link.
   */
  getValue: function getValue(inputProps) {
    if (inputProps.valueLink) {
      _assertValueLink(inputProps);

      return inputProps.valueLink.value;
    }

    return inputProps.value;
  },

  /**
   * @param {object} inputProps Props for form component
   * @return {*} current checked status of the input either from checked prop
   *             or link.
   */
  getChecked: function getChecked(inputProps) {
    if (inputProps.checkedLink) {
      _assertCheckedLink(inputProps);

      return inputProps.checkedLink.value;
    }

    return inputProps.checked;
  },

  /**
   * @param {object} inputProps Props for form component
   * @param {SyntheticEvent} event change event to handle
   */
  executeOnChange: function executeOnChange(inputProps, event) {
    if (inputProps.valueLink) {
      _assertValueLink(inputProps);

      return inputProps.valueLink.requestChange(event.target.value);
    } else if (inputProps.checkedLink) {
      _assertCheckedLink(inputProps);

      return inputProps.checkedLink.requestChange(event.target.checked);
    } else if (inputProps.onChange) {
      return inputProps.onChange.call(undefined, event);
    }
  }
};
var LinkedValueUtils_1 = LinkedValueUtils;

function forceUpdateIfMounted() {
  if (this._rootNodeID) {
    // DOM component is still mounted; update
    ReactDOMInput.updateWrapper(this);
  }
}

forceUpdateIfMounted._r = [2];

function isControlled(props) {
  var usesChecked = props.type === 'checkbox' || props.type === 'radio';
  return usesChecked ? props.checked != null : props.value != null;
}
/**
 * Implements an <input> host component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * @see http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */


isControlled._r = [2];
var ReactDOMInput = {
  getHostProps: function getHostProps(inst, props) {
    var value = LinkedValueUtils_1.getValue(props);
    var checked = LinkedValueUtils_1.getChecked(props);

    var hostProps = objectAssign({
      // Make sure we set .type before any other properties (setting .value
      // before .type means .value is lost in IE11 and below)
      type: undefined,
      // Make sure we set .step before .value (setting .value before .step
      // means .value is rounded on mount, based upon step precision)
      step: undefined,
      // Make sure we set .min & .max before .value (to ensure proper order
      // in corner cases such as min or max deriving from value, e.g. Issue #7170)
      min: undefined,
      max: undefined
    }, props, {
      defaultChecked: undefined,
      defaultValue: undefined,
      value: value != null ? value : inst._wrapperState.initialValue,
      checked: checked != null ? checked : inst._wrapperState.initialChecked,
      onChange: inst._wrapperState.onChange
    });

    return hostProps;
  },
  mountWrapper: function mountWrapper(inst, props) {
    var defaultValue = props.defaultValue;
    inst._wrapperState = {
      initialChecked: props.checked != null ? props.checked : props.defaultChecked,
      initialValue: props.value != null ? props.value : defaultValue,
      listeners: null,
      onChange: _handleChange.bind(inst),
      controlled: isControlled(props)
    };
  },
  updateWrapper: function updateWrapper(inst) {
    var props = inst._currentElement.props;

    var checked = props.checked;

    if (checked != null) {
      DOMPropertyOperations_1.setValueForProperty(ReactDOMComponentTree_1.getNodeFromInstance(inst), 'checked', checked || false);
    }

    var node = ReactDOMComponentTree_1.getNodeFromInstance(inst);
    var value = LinkedValueUtils_1.getValue(props);

    if (value != null) {
      if (value === 0 && node.value === '') {
        node.value = '0'; // Note: IE9 reports a number inputs as 'text', so check props instead.
      } else if (props.type === 'number') {
        // Simulate `input.valueAsNumber`. IE9 does not support it
        var valueAsNumber = parseFloat(node.value, 10) || 0;

        if ( // eslint-disable-next-line
        value != valueAsNumber || // eslint-disable-next-line
        value == valueAsNumber && node.value != value) {
          // Cast `value` to a string to ensure the value is set correctly. While
          // browsers typically do this as necessary, jsdom doesn't.
          node.value = '' + value;
        }
      } else if (node.value !== '' + value) {
        // Cast `value` to a string to ensure the value is set correctly. While
        // browsers typically do this as necessary, jsdom doesn't.
        node.value = '' + value;
      }
    } else {
      if (props.value == null && props.defaultValue != null) {
        // In Chrome, assigning defaultValue to certain input types triggers input validation.
        // For number inputs, the display value loses trailing decimal points. For email inputs,
        // Chrome raises "The specified value <x> is not a valid email address".
        //
        // Here we check to see if the defaultValue has actually changed, avoiding these problems
        // when the user is inputting text
        //
        // https://github.com/facebook/react/issues/7253
        if (node.defaultValue !== '' + props.defaultValue) {
          node.defaultValue = '' + props.defaultValue;
        }
      }

      if (props.checked == null && props.defaultChecked != null) {
        node.defaultChecked = !!props.defaultChecked;
      }
    }
  },
  postMountWrapper: function postMountWrapper(inst) {
    var props = inst._currentElement.props; // This is in postMount because we need access to the DOM node, which is not
    // available until after the component has mounted.

    var node = ReactDOMComponentTree_1.getNodeFromInstance(inst); // Detach value from defaultValue. We won't do anything if we're working on
    // submit or reset inputs as those values & defaultValues are linked. They
    // are not resetable nodes so this operation doesn't matter and actually
    // removes browser-default values (eg "Submit Query") when no value is
    // provided.

    switch (props.type) {
      case 'submit':
      case 'reset':
        break;

      case 'color':
      case 'date':
      case 'datetime':
      case 'datetime-local':
      case 'month':
      case 'time':
      case 'week':
        // This fixes the no-show issue on iOS Safari and Android Chrome:
        // https://github.com/facebook/react/issues/7233
        node.value = '';
        node.value = node.defaultValue;
        break;

      default:
        node.value = node.value;
        break;
    } // Normally, we'd just do `node.checked = node.checked` upon initial mount, less this bug
    // this is needed to work around a chrome bug where setting defaultChecked
    // will sometimes influence the value of checked (even after detachment).
    // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=608416
    // We need to temporarily unset name to avoid disrupting radio button groups.


    var name = node.name;

    if (name !== '') {
      node.name = '';
    }

    node.defaultChecked = !node.defaultChecked;
    node.defaultChecked = !node.defaultChecked;

    if (name !== '') {
      node.name = name;
    }
  }
};

function _handleChange(event) {
  var props = this._currentElement.props;
  var returnValue = LinkedValueUtils_1.executeOnChange(props, event); // Here we use asap to wait until all updates have propagated, which
  // is important when using controlled components within layers:
  // https://github.com/facebook/react/issues/1698

  ReactUpdates_1.asap(forceUpdateIfMounted, this);
  var name = props.name;

  if (props.type === 'radio' && name != null) {
    var rootNode = ReactDOMComponentTree_1.getNodeFromInstance(this);
    var queryRoot = rootNode;

    while (queryRoot.parentNode) {
      queryRoot = queryRoot.parentNode;
    } // If `rootNode.form` was non-null, then we could try `form.elements`,
    // but that sometimes behaves strangely in IE8. We could also try using
    // `form.getElementsByName`, but that will only return direct children
    // and won't include inputs that use the HTML5 `form=` attribute. Since
    // the input might not even be in a form, let's just use the global
    // `querySelectorAll` to ensure we don't miss anything.


    var group = queryRoot.querySelectorAll('input[name=' + JSON.stringify('' + name) + '][type="radio"]');

    for (var i = 0; i < group.length; i++) {
      var otherNode = group[i];

      if (otherNode === rootNode || otherNode.form !== rootNode.form) {
        continue;
      } // This will throw if radio buttons rendered by different copies of React
      // and the same name are rendered into the same form (same as #1939).
      // That's probably okay; we don't support it just as we don't support
      // mixing React radio buttons with non-React ones.


      var otherInstance = ReactDOMComponentTree_1.getInstanceFromNode(otherNode);
      !otherInstance ? reactProdInvariant_1$2('90') : void 0; // If this is a controlled radio button group, forcing the input that
      // was previously checked to update will cause it to be come re-checked
      // as appropriate.

      ReactUpdates_1.asap(forceUpdateIfMounted, otherInstance);
    }
  }

  return returnValue;
}

_handleChange._r = [2];
var ReactDOMInput_1 = ReactDOMInput;

var didWarnValueDefaultValue$1 = false;

function updateOptionsIfPendingUpdateAndMounted() {
  if (this._rootNodeID && this._wrapperState.pendingUpdate) {
    this._wrapperState.pendingUpdate = false;
    var props = this._currentElement.props;
    var value = LinkedValueUtils_1.getValue(props);

    if (value != null) {
      updateOptions(this, Boolean(props.multiple), value);
    }
  }
}

updateOptionsIfPendingUpdateAndMounted._r = [2];

function updateOptions(inst, multiple, propValue) {
  var selectedValue, i;
  var options = ReactDOMComponentTree_1.getNodeFromInstance(inst).options;

  if (multiple) {
    selectedValue = {};

    for (i = 0; i < propValue.length; i++) {
      selectedValue['' + propValue[i]] = true;
    }

    for (i = 0; i < options.length; i++) {
      var selected = selectedValue.hasOwnProperty(options[i].value);

      if (options[i].selected !== selected) {
        options[i].selected = selected;
      }
    }
  } else {
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    selectedValue = '' + propValue;

    for (i = 0; i < options.length; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        return;
      }
    }

    if (options.length) {
      options[0].selected = true;
    }
  }
}
/**
 * Implements a <select> host component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * stringable. If `multiple` is true, the prop must be an array of stringables.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */


updateOptions._r = [2];
var ReactDOMSelect = {
  getHostProps: function getHostProps(inst, props) {
    return objectAssign({}, props, {
      onChange: inst._wrapperState.onChange,
      value: undefined
    });
  },
  mountWrapper: function mountWrapper(inst, props) {
    var value = LinkedValueUtils_1.getValue(props);
    inst._wrapperState = {
      pendingUpdate: false,
      initialValue: value != null ? value : props.defaultValue,
      listeners: null,
      onChange: _handleChange$1.bind(inst),
      wasMultiple: Boolean(props.multiple)
    };

    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue$1) {
      void 0;
      didWarnValueDefaultValue$1 = true;
    }
  },
  getSelectValueContext: function getSelectValueContext(inst) {
    // ReactDOMOption looks at this initial value so the initial generated
    // markup has correct `selected` attributes
    return inst._wrapperState.initialValue;
  },
  postUpdateWrapper: function postUpdateWrapper(inst) {
    var props = inst._currentElement.props; // After the initial mount, we control selected-ness manually so don't pass
    // this value down

    inst._wrapperState.initialValue = undefined;
    var wasMultiple = inst._wrapperState.wasMultiple;
    inst._wrapperState.wasMultiple = Boolean(props.multiple);
    var value = LinkedValueUtils_1.getValue(props);

    if (value != null) {
      inst._wrapperState.pendingUpdate = false;
      updateOptions(inst, Boolean(props.multiple), value);
    } else if (wasMultiple !== Boolean(props.multiple)) {
      // For simplicity, reapply `defaultValue` if `multiple` is toggled.
      if (props.defaultValue != null) {
        updateOptions(inst, Boolean(props.multiple), props.defaultValue);
      } else {
        // Revert the select back to its default unselected state.
        updateOptions(inst, Boolean(props.multiple), props.multiple ? [] : '');
      }
    }
  }
};

function _handleChange$1(event) {
  var props = this._currentElement.props;
  var returnValue = LinkedValueUtils_1.executeOnChange(props, event);

  if (this._rootNodeID) {
    this._wrapperState.pendingUpdate = true;
  }

  ReactUpdates_1.asap(updateOptionsIfPendingUpdateAndMounted, this);
  return returnValue;
}

_handleChange$1._r = [2];
var ReactDOMSelect_1 = ReactDOMSelect;

var didWarnInvalidOptionChildren = false;

function flattenChildren(children) {
  var content = ''; // Flatten children and warn if they aren't strings or numbers;
  // invalid types are ignored.

  React_1.Children.forEach(children, function (child) {
    if (child == null) {
      return;
    }

    if (typeof child === 'string' || typeof child === 'number') {
      content += child;
    } else if (!didWarnInvalidOptionChildren) {
      didWarnInvalidOptionChildren = true;
      void 0;
    }
  });
  return content;
}
/**
 * Implements an <option> host component that warns when `selected` is set.
 */


flattenChildren._r = [2];
var ReactDOMOption = {
  mountWrapper: function mountWrapper(inst, props, hostParent) {
    // TODO (yungsters): Remove support for `selected` in <option>.
    var selectValue = null;

    if (hostParent != null) {
      var selectParent = hostParent;

      if (selectParent._tag === 'optgroup') {
        selectParent = selectParent._hostParent;
      }

      if (selectParent != null && selectParent._tag === 'select') {
        selectValue = ReactDOMSelect_1.getSelectValueContext(selectParent);
      }
    } // If the value is null (e.g., no specified value or after initial mount)
    // or missing (e.g., for <datalist>), we don't change props.selected


    var selected = null;

    if (selectValue != null) {
      var value;

      if (props.value != null) {
        value = props.value + '';
      } else {
        value = flattenChildren(props.children);
      }

      selected = false;

      if (Array.isArray(selectValue)) {
        // multiple
        for (var i = 0; i < selectValue.length; i++) {
          if ('' + selectValue[i] === value) {
            selected = true;
            break;
          }
        }
      } else {
        selected = '' + selectValue === value;
      }
    }

    inst._wrapperState = {
      selected: selected
    };
  },
  postMountWrapper: function postMountWrapper(inst) {
    // value="" should make a value attribute (#6219)
    var props = inst._currentElement.props;

    if (props.value != null) {
      var node = ReactDOMComponentTree_1.getNodeFromInstance(inst);
      node.setAttribute('value', props.value);
    }
  },
  getHostProps: function getHostProps(inst, props) {
    var hostProps = objectAssign({
      selected: undefined,
      children: undefined
    }, props); // Read state only from initial mount because <select> updates value
    // manually; we need the initial state only for server rendering


    if (inst._wrapperState.selected != null) {
      hostProps.selected = inst._wrapperState.selected;
    }

    var content = flattenChildren(props.children);

    if (content) {
      hostProps.children = content;
    }

    return hostProps;
  }
};
var ReactDOMOption_1 = ReactDOMOption;

function forceUpdateIfMounted$1() {
  if (this._rootNodeID) {
    // DOM component is still mounted; update
    ReactDOMTextarea.updateWrapper(this);
  }
}
/**
 * Implements a <textarea> host component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */


forceUpdateIfMounted$1._r = [2];
var ReactDOMTextarea = {
  getHostProps: function getHostProps(inst, props) {
    !(props.dangerouslySetInnerHTML == null) ? reactProdInvariant_1$2('91') : void 0; // Always set children to the same thing. In IE9, the selection range will
    // get reset if `textContent` is mutated.  We could add a check in setTextContent
    // to only set the value if/when the value differs from the node value (which would
    // completely solve this IE9 bug), but Sebastian+Ben seemed to like this solution.
    // The value can be a boolean or object so that's why it's forced to be a string.

    var hostProps = objectAssign({}, props, {
      value: undefined,
      defaultValue: undefined,
      children: '' + inst._wrapperState.initialValue,
      onChange: inst._wrapperState.onChange
    });

    return hostProps;
  },
  mountWrapper: function mountWrapper(inst, props) {
    var value = LinkedValueUtils_1.getValue(props);
    var initialValue = value; // Only bother fetching default value if we're going to use it

    if (value == null) {
      var defaultValue = props.defaultValue; // TODO (yungsters): Remove support for children content in <textarea>.

      var children = props.children;

      if (children != null) {
        !(defaultValue == null) ? reactProdInvariant_1$2('92') : void 0;

        if (Array.isArray(children)) {
          !(children.length <= 1) ? reactProdInvariant_1$2('93') : void 0;
          children = children[0];
        }

        defaultValue = '' + children;
      }

      if (defaultValue == null) {
        defaultValue = '';
      }

      initialValue = defaultValue;
    }

    inst._wrapperState = {
      initialValue: '' + initialValue,
      listeners: null,
      onChange: _handleChange$2.bind(inst)
    };
  },
  updateWrapper: function updateWrapper(inst) {
    var props = inst._currentElement.props;
    var node = ReactDOMComponentTree_1.getNodeFromInstance(inst);
    var value = LinkedValueUtils_1.getValue(props);

    if (value != null) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      var newValue = '' + value; // To avoid side effects (such as losing text selection), only set value if changed

      if (newValue !== node.value) {
        node.value = newValue;
      }

      if (props.defaultValue == null) {
        node.defaultValue = newValue;
      }
    }

    if (props.defaultValue != null) {
      node.defaultValue = props.defaultValue;
    }
  },
  postMountWrapper: function postMountWrapper(inst) {
    // This is in postMount because we need access to the DOM node, which is not
    // available until after the component has mounted.
    var node = ReactDOMComponentTree_1.getNodeFromInstance(inst);
    var textContent = node.textContent; // Only set node.value if textContent is equal to the expected
    // initial value. In IE10/IE11 there is a bug where the placeholder attribute
    // will populate textContent as well.
    // https://developer.microsoft.com/microsoft-edge/platform/issues/101525/

    if (textContent === inst._wrapperState.initialValue) {
      node.value = textContent;
    }
  }
};

function _handleChange$2(event) {
  var props = this._currentElement.props;
  var returnValue = LinkedValueUtils_1.executeOnChange(props, event);
  ReactUpdates_1.asap(forceUpdateIfMounted$1, this);
  return returnValue;
}

_handleChange$2._r = [2];
var ReactDOMTextarea_1 = ReactDOMTextarea;

var injected = false;
var ReactComponentEnvironment = {
  /**
   * Optionally injectable hook for swapping out mount images in the middle of
   * the tree.
   */
  replaceNodeWithMarkup: null,

  /**
   * Optionally injectable hook for processing a queue of child updates. Will
   * later move into MultiChildComponents.
   */
  processChildrenUpdates: null,
  injection: {
    injectEnvironment: function injectEnvironment(environment) {
      !!injected ? reactProdInvariant_1$2('104') : void 0;
      ReactComponentEnvironment.replaceNodeWithMarkup = environment.replaceNodeWithMarkup;
      ReactComponentEnvironment.processChildrenUpdates = environment.processChildrenUpdates;
      injected = true;
    }
  }
};
var ReactComponentEnvironment_1 = ReactComponentEnvironment;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 */
// TODO: Replace this with ES6: var ReactInstanceMap = new Map();

var ReactInstanceMap = {
  /**
   * This API should be called `delete` but we'd have to make sure to always
   * transform these to strings for IE support. When this transform is fully
   * supported we can rename it.
   */
  remove: function remove(key) {
    key._reactInternalInstance = undefined;
  },
  get: function get(key) {
    return key._reactInternalInstance;
  },
  has: function has(key) {
    return key._reactInternalInstance !== undefined;
  },
  set: function set(key, value) {
    key._reactInternalInstance = value;
  }
};
var ReactInstanceMap_1 = ReactInstanceMap;

var ReactNodeTypes = {
  HOST: 0,
  COMPOSITE: 1,
  EMPTY: 2,
  getType: function getType(node) {
    if (node === null || node === false) {
      return ReactNodeTypes.EMPTY;
    } else if (React_1.isValidElement(node)) {
      if (typeof node.type === 'function') {
        return ReactNodeTypes.COMPOSITE;
      } else {
        return ReactNodeTypes.HOST;
      }
    }

    reactProdInvariant_1$2('26', node);
  }
};
var ReactNodeTypes_1 = ReactNodeTypes;

var ReactComponentTreeHook$3;

if (typeof process !== 'undefined' && process.env && "production" === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook$3 = ReactComponentTreeHook_1;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */
var hasOwnProperty$3 = Object.prototype.hasOwnProperty;
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */

function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */


is._r = [2];

function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (_typeof$2(objA) !== 'object' || objA === null || _typeof$2(objB) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  } // Test for A's keys different from B.


  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty$3.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

shallowEqual._r = [2];
var shallowEqual_1 = shallowEqual;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Given a `prevElement` and `nextElement`, determines if the existing
 * instance should be updated as opposed to being destroyed or replaced by a new
 * instance. Both arguments are elements. This ensures that this logic can
 * operate on stateless trees without any backing instance.
 *
 * @param {?object} prevElement
 * @param {?object} nextElement
 * @return {boolean} True if the existing instance should be updated.
 * @protected
 */

function shouldUpdateReactComponent(prevElement, nextElement) {
  var prevEmpty = prevElement === null || prevElement === false;
  var nextEmpty = nextElement === null || nextElement === false;

  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }

  var prevType = _typeof$2(prevElement);
  var nextType = _typeof$2(nextElement);

  if (prevType === 'string' || prevType === 'number') {
    return nextType === 'string' || nextType === 'number';
  } else {
    return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
  }
}

shouldUpdateReactComponent._r = [2];
var shouldUpdateReactComponent_1 = shouldUpdateReactComponent;

var CompositeTypes = {
  ImpureClass: 0,
  PureClass: 1,
  StatelessFunctional: 2
};

function StatelessComponent(Component) {}

StatelessComponent._r = [2];

StatelessComponent.prototype.render = function () {
  var Component = ReactInstanceMap_1.get(this)._currentElement.type;

  var element = Component(this.props, this.context, this.updater);
  warnIfInvalidElement(Component, element);
  return element;
};

function warnIfInvalidElement(Component, element) {
  
}

warnIfInvalidElement._r = [2];

function shouldConstruct(Component) {
  return !!(Component.prototype && Component.prototype.isReactComponent);
}

shouldConstruct._r = [2];

function isPureComponent(Component) {
  return !!(Component.prototype && Component.prototype.isPureReactComponent);
} // Separated into a function to contain deoptimizations caused by try/finally.


isPureComponent._r = [2];

var nextMountID = 1;
/**
 * @lends {ReactCompositeComponent.prototype}
 */

var ReactCompositeComponent = {
  /**
   * Base constructor for all composite component.
   *
   * @param {ReactElement} element
   * @final
   * @internal
   */
  construct: function construct(element) {
    this._currentElement = element;
    this._rootNodeID = 0;
    this._compositeType = null;
    this._instance = null;
    this._hostParent = null;
    this._hostContainerInfo = null; // See ReactUpdateQueue

    this._updateBatchNumber = null;
    this._pendingElement = null;
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;
    this._renderedNodeType = null;
    this._renderedComponent = null;
    this._context = null;
    this._mountOrder = 0;
    this._topLevelWrapper = null; // See ReactUpdates and ReactUpdateQueue.

    this._pendingCallbacks = null; // ComponentWillUnmount shall only be called once

    this._calledComponentWillUnmount = false;

    
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?object} hostParent
   * @param {?object} hostContainerInfo
   * @param {?object} context
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
    var _this = this;

    this._context = context;
    this._mountOrder = nextMountID++;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;
    var publicProps = this._currentElement.props;

    var publicContext = this._processContext(context);

    var Component = this._currentElement.type;
    var updateQueue = transaction.getUpdateQueue(); // Initialize the public class

    var doConstruct = shouldConstruct(Component);

    var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);

    var renderedElement; // Support functional components

    if (!doConstruct && (inst == null || inst.render == null)) {
      renderedElement = inst;
      warnIfInvalidElement(Component, renderedElement);
      !(inst === null || inst === false || React_1.isValidElement(inst)) ? reactProdInvariant_1$2('105', Component.displayName || Component.name || 'Component') : void 0;
      inst = new StatelessComponent(Component);
      this._compositeType = CompositeTypes.StatelessFunctional;
    } else {
      if (isPureComponent(Component)) {
        this._compositeType = CompositeTypes.PureClass;
      } else {
        this._compositeType = CompositeTypes.ImpureClass;
      }
    }

    inst.props = publicProps;
    inst.context = publicContext;
    inst.refs = emptyObject_1;
    inst.updater = updateQueue;
    this._instance = inst; // Store a reference from the instance back to the internal representation

    ReactInstanceMap_1.set(inst, this);

    var initialState = inst.state;

    if (initialState === undefined) {
      inst.state = initialState = null;
    }

    !(_typeof$2(initialState) === 'object' && !Array.isArray(initialState)) ? reactProdInvariant_1$2('106', this.getName() || 'ReactCompositeComponent') : void 0;
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;
    var markup;

    if (inst.unstable_handleError) {
      markup = this.performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context);
    } else {
      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    }

    if (inst.componentDidMount) {
      {
        transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
      }
    }

    return markup;
  },
  _constructComponent: function _constructComponent(doConstruct, publicProps, publicContext, updateQueue) {
    if ("production" !== 'production' && !doConstruct) {
      ReactCurrentOwner_1.current = this;

      try {
        return this._constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue);
      } finally {
        ReactCurrentOwner_1.current = null;
      }
    } else {
      return this._constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue);
    }
  },
  _constructComponentWithoutOwner: function _constructComponentWithoutOwner(doConstruct, publicProps, publicContext, updateQueue) {
    var Component = this._currentElement.type;

    if (doConstruct) {
      {
        return new Component(publicProps, publicContext, updateQueue);
      }
    } // This can still be an instance in case of factory components
    // but we'll count this as time spent rendering as the more common case.


    {
      return Component(publicProps, publicContext, updateQueue);
    }
  },
  performInitialMountWithErrorHandling: function performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context) {
    var markup;
    var checkpoint = transaction.checkpoint();

    try {
      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    } catch (e) {
      // Roll back to checkpoint, handle error (which may add items to the transaction), and take a new checkpoint
      transaction.rollback(checkpoint);

      this._instance.unstable_handleError(e);

      if (this._pendingStateQueue) {
        this._instance.state = this._processPendingState(this._instance.props, this._instance.context);
      }

      checkpoint = transaction.checkpoint();

      this._renderedComponent.unmountComponent(true);

      transaction.rollback(checkpoint); // Try again - we've informed the component about the error, so they can render an error message this time.
      // If this throws again, the error will bubble up (and can be caught by a higher error boundary).

      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    }

    return markup;
  },
  performInitialMount: function performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context) {
    var inst = this._instance;
    var debugID = 0;

    if (inst.componentWillMount) {
      {
        inst.componentWillMount();
      } // When mounting, calls to `setState` by `componentWillMount` will set
      // `this._pendingStateQueue` without triggering a re-render.


      if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
      }
    } // If not a stateless component, we now render


    if (renderedElement === undefined) {
      renderedElement = this._renderValidatedComponent();
    }

    var nodeType = ReactNodeTypes_1.getType(renderedElement);
    this._renderedNodeType = nodeType;

    var child = this._instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes_1.EMPTY
    /* shouldHaveDebugID */
    );

    this._renderedComponent = child;
    var markup = ReactReconciler_1.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), debugID);

    return markup;
  },
  getHostNode: function getHostNode() {
    return ReactReconciler_1.getHostNode(this._renderedComponent);
  },

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function unmountComponent(safely) {
    if (!this._renderedComponent) {
      return;
    }

    var inst = this._instance;

    if (inst.componentWillUnmount && !inst._calledComponentWillUnmount) {
      inst._calledComponentWillUnmount = true;

      if (safely) {
        var name = this.getName() + '.componentWillUnmount()';
        ReactErrorUtils_1.invokeGuardedCallback(name, inst.componentWillUnmount.bind(inst));
      } else {
        {
          inst.componentWillUnmount();
        }
      }
    }

    if (this._renderedComponent) {
      ReactReconciler_1.unmountComponent(this._renderedComponent, safely);
      this._renderedNodeType = null;
      this._renderedComponent = null;
      this._instance = null;
    } // Reset pending fields
    // Even if this component is scheduled for another update in ReactUpdates,
    // it would still be ignored because these fields are reset.


    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;
    this._pendingCallbacks = null;
    this._pendingElement = null; // These fields do not really need to be reset since this object is no
    // longer accessible.

    this._context = null;
    this._rootNodeID = 0;
    this._topLevelWrapper = null; // Delete the reference from the instance to this internal representation
    // which allow the internals to be properly cleaned up even if the user
    // leaks a reference to the public instance.

    ReactInstanceMap_1.remove(inst); // Some existing components rely on inst.props even after they've been
    // destroyed (in event handlers).
    // TODO: inst.props = null;
    // TODO: inst.state = null;
    // TODO: inst.context = null;
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _maskContext: function _maskContext(context) {
    var Component = this._currentElement.type;
    var contextTypes = Component.contextTypes;

    if (!contextTypes) {
      return emptyObject_1;
    }

    var maskedContext = {};

    for (var contextName in contextTypes) {
      maskedContext[contextName] = context[contextName];
    }

    return maskedContext;
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`, and asserts that they are valid.
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _processContext: function _processContext(context) {
    var maskedContext = this._maskContext(context);

    return maskedContext;
  },

  /**
   * @param {object} currentContext
   * @return {object}
   * @private
   */
  _processChildContext: function _processChildContext(currentContext) {
    var Component = this._currentElement.type;
    var inst = this._instance;
    var childContext;

    if (inst.getChildContext) {
      {
        childContext = inst.getChildContext();
      }
    }

    if (childContext) {
      !(_typeof$2(Component.childContextTypes) === 'object') ? reactProdInvariant_1$2('107', this.getName() || 'ReactCompositeComponent') : void 0;

      for (var name in childContext) {
        !(name in Component.childContextTypes) ? reactProdInvariant_1$2('108', this.getName() || 'ReactCompositeComponent', name) : void 0;
      }

      return objectAssign({}, currentContext, childContext);
    }

    return currentContext;
  },

  /**
   * Assert that the context types are valid
   *
   * @param {object} typeSpecs Map of context field to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @private
   */
  _checkContextTypes: function _checkContextTypes(typeSpecs, values, location) {
    
  },
  receiveComponent: function receiveComponent(nextElement, transaction, nextContext) {
    var prevElement = this._currentElement;
    var prevContext = this._context;
    this._pendingElement = null;
    this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext);
  },

  /**
   * If any of `_pendingElement`, `_pendingStateQueue`, or `_pendingForceUpdate`
   * is set, update the component.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function performUpdateIfNecessary(transaction) {
    if (this._pendingElement != null) {
      ReactReconciler_1.receiveComponent(this, this._pendingElement, transaction, this._context);
    } else if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
      this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
    } else {
      this._updateBatchNumber = null;
    }
  },

  /**
   * Perform an update to a mounted component. The componentWillReceiveProps and
   * shouldComponentUpdate methods are called, then (assuming the update isn't
   * skipped) the remaining update lifecycle methods are called and the DOM
   * representation is updated.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevParentElement
   * @param {ReactElement} nextParentElement
   * @internal
   * @overridable
   */
  updateComponent: function updateComponent(transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
    var inst = this._instance;
    !(inst != null) ? reactProdInvariant_1$2('136', this.getName() || 'ReactCompositeComponent') : void 0;
    var willReceive = false;
    var nextContext; // Determine if the context has changed or not

    if (this._context === nextUnmaskedContext) {
      nextContext = inst.context;
    } else {
      nextContext = this._processContext(nextUnmaskedContext);
      willReceive = true;
    }

    var prevProps = prevParentElement.props;
    var nextProps = nextParentElement.props; // Not a simple state update but a props update

    if (prevParentElement !== nextParentElement) {
      willReceive = true;
    } // An update here will schedule an update but immediately set
    // _pendingStateQueue which will ensure that any state updates gets
    // immediately reconciled instead of waiting for the next batch.


    if (willReceive && inst.componentWillReceiveProps) {
      {
        inst.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    var nextState = this._processPendingState(nextProps, nextContext);

    var shouldUpdate = true;

    if (!this._pendingForceUpdate) {
      if (inst.shouldComponentUpdate) {
        {
          shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, nextContext);
        }
      } else {
        if (this._compositeType === CompositeTypes.PureClass) {
          shouldUpdate = !shallowEqual_1(prevProps, nextProps) || !shallowEqual_1(inst.state, nextState);
        }
      }
    }

    this._updateBatchNumber = null;

    if (shouldUpdate) {
      this._pendingForceUpdate = false; // Will set `this.props`, `this.state` and `this.context`.

      this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state but we shortcut the rest of the update.
      this._currentElement = nextParentElement;
      this._context = nextUnmaskedContext;
      inst.props = nextProps;
      inst.state = nextState;
      inst.context = nextContext;
    }
  },
  _processPendingState: function _processPendingState(props, context) {
    var inst = this._instance;
    var queue = this._pendingStateQueue;
    var replace = this._pendingReplaceState;
    this._pendingReplaceState = false;
    this._pendingStateQueue = null;

    if (!queue) {
      return inst.state;
    }

    if (replace && queue.length === 1) {
      return queue[0];
    }

    var nextState = objectAssign({}, replace ? queue[0] : inst.state);

    for (var i = replace ? 1 : 0; i < queue.length; i++) {
      var partial = queue[i];

      objectAssign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
    }

    return nextState;
  },

  /**
   * Merges new props and state, notifies delegate methods of update and
   * performs update.
   *
   * @param {ReactElement} nextElement Next element
   * @param {object} nextProps Next public object to set as properties.
   * @param {?object} nextState Next object to set as state.
   * @param {?object} nextContext Next public object to set as context.
   * @param {ReactReconcileTransaction} transaction
   * @param {?object} unmaskedContext
   * @private
   */
  _performComponentUpdate: function _performComponentUpdate(nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
    var _this2 = this;

    var inst = this._instance;
    var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
    var prevProps;
    var prevState;
    var prevContext;

    if (hasComponentDidUpdate) {
      prevProps = inst.props;
      prevState = inst.state;
      prevContext = inst.context;
    }

    if (inst.componentWillUpdate) {
      {
        inst.componentWillUpdate(nextProps, nextState, nextContext);
      }
    }

    this._currentElement = nextElement;
    this._context = unmaskedContext;
    inst.props = nextProps;
    inst.state = nextState;
    inst.context = nextContext;

    this._updateRenderedComponent(transaction, unmaskedContext);

    if (hasComponentDidUpdate) {
      {
        transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst);
      }
    }
  },

  /**
   * Call the component's `render` method and update the DOM accordingly.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  _updateRenderedComponent: function _updateRenderedComponent(transaction, context) {
    var prevComponentInstance = this._renderedComponent;
    var prevRenderedElement = prevComponentInstance._currentElement;

    var nextRenderedElement = this._renderValidatedComponent();

    var debugID = 0;

    if (shouldUpdateReactComponent_1(prevRenderedElement, nextRenderedElement)) {
      ReactReconciler_1.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
    } else {
      var oldHostNode = ReactReconciler_1.getHostNode(prevComponentInstance);
      ReactReconciler_1.unmountComponent(prevComponentInstance, false);
      var nodeType = ReactNodeTypes_1.getType(nextRenderedElement);
      this._renderedNodeType = nodeType;

      var child = this._instantiateReactComponent(nextRenderedElement, nodeType !== ReactNodeTypes_1.EMPTY
      /* shouldHaveDebugID */
      );

      this._renderedComponent = child;
      var nextMarkup = ReactReconciler_1.mountComponent(child, transaction, this._hostParent, this._hostContainerInfo, this._processChildContext(context), debugID);

      this._replaceNodeWithMarkup(oldHostNode, nextMarkup, prevComponentInstance);
    }
  },

  /**
   * Overridden in shallow rendering.
   *
   * @protected
   */
  _replaceNodeWithMarkup: function _replaceNodeWithMarkup(oldHostNode, nextMarkup, prevInstance) {
    ReactComponentEnvironment_1.replaceNodeWithMarkup(oldHostNode, nextMarkup, prevInstance);
  },

  /**
   * @protected
   */
  _renderValidatedComponentWithoutOwnerOrContext: function _renderValidatedComponentWithoutOwnerOrContext() {
    var inst = this._instance;
    var renderedElement;

    {
      renderedElement = inst.render();
    }

    return renderedElement;
  },

  /**
   * @private
   */
  _renderValidatedComponent: function _renderValidatedComponent() {
    var renderedElement;

    if ("production" !== 'production' || this._compositeType !== CompositeTypes.StatelessFunctional) {
      ReactCurrentOwner_1.current = this;

      try {
        renderedElement = this._renderValidatedComponentWithoutOwnerOrContext();
      } finally {
        ReactCurrentOwner_1.current = null;
      }
    } else {
      renderedElement = this._renderValidatedComponentWithoutOwnerOrContext();
    }

    !( // TODO: An `isValidNode` function would probably be more appropriate
    renderedElement === null || renderedElement === false || React_1.isValidElement(renderedElement)) ? reactProdInvariant_1$2('109', this.getName() || 'ReactCompositeComponent') : void 0;
    return renderedElement;
  },

  /**
   * Lazily allocates the refs object and stores `component` as `ref`.
   *
   * @param {string} ref Reference name.
   * @param {component} component Component to store as `ref`.
   * @final
   * @private
   */
  attachRef: function attachRef(ref, component) {
    var inst = this.getPublicInstance();
    !(inst != null) ? reactProdInvariant_1$2('110') : void 0;
    var publicComponentInstance = component.getPublicInstance();

    var refs = inst.refs === emptyObject_1 ? inst.refs = {} : inst.refs;
    refs[ref] = publicComponentInstance;
  },

  /**
   * Detaches a reference name.
   *
   * @param {string} ref Name to dereference.
   * @final
   * @private
   */
  detachRef: function detachRef(ref) {
    var refs = this.getPublicInstance().refs;
    delete refs[ref];
  },

  /**
   * Get a text description of the component that can be used to identify it
   * in error messages.
   * @return {string} The name or null.
   * @internal
   */
  getName: function getName() {
    var type = this._currentElement.type;
    var constructor = this._instance && this._instance.constructor;
    return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
  },

  /**
   * Get the publicly accessible representation of this component - i.e. what
   * is exposed by refs and returned by render. Can be null for stateless
   * components.
   *
   * @return {ReactComponent} the public component instance.
   * @internal
   */
  getPublicInstance: function getPublicInstance() {
    var inst = this._instance;

    if (this._compositeType === CompositeTypes.StatelessFunctional) {
      return null;
    }

    return inst;
  },
  // Stub
  _instantiateReactComponent: null
};
var ReactCompositeComponent_1 = ReactCompositeComponent;

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var emptyComponentFactory;
var ReactEmptyComponentInjection = {
  injectEmptyComponentFactory: function injectEmptyComponentFactory(factory) {
    emptyComponentFactory = factory;
  }
};
var ReactEmptyComponent = {
  create: function create(instantiate) {
    return emptyComponentFactory(instantiate);
  }
};
ReactEmptyComponent.injection = ReactEmptyComponentInjection;
var ReactEmptyComponent_1 = ReactEmptyComponent;

var genericComponentClass = null;
var textComponentClass = null;
var ReactHostComponentInjection = {
  // This accepts a class that receives the tag string. This is a catch all
  // that can render any kind of tag.
  injectGenericComponentClass: function injectGenericComponentClass(componentClass) {
    genericComponentClass = componentClass;
  },
  // This accepts a text component class that takes the text string to be
  // rendered as props.
  injectTextComponentClass: function injectTextComponentClass(componentClass) {
    textComponentClass = componentClass;
  }
};
/**
 * Get a host internal component class for a specific tag.
 *
 * @param {ReactElement} element The element to create.
 * @return {function} The internal class constructor function.
 */

function createInternalComponent(element) {
  !genericComponentClass ? reactProdInvariant_1$2('111', element.type) : void 0;
  return new genericComponentClass(element);
}
/**
 * @param {ReactText} text
 * @return {ReactComponent}
 */


createInternalComponent._r = [2];

function createInstanceForText(text) {
  return new textComponentClass(text);
}
/**
 * @param {ReactComponent} component
 * @return {boolean}
 */


createInstanceForText._r = [2];

function isTextComponent(component) {
  return component instanceof textComponentClass;
}

isTextComponent._r = [2];
var ReactHostComponent = {
  createInternalComponent: createInternalComponent,
  createInstanceForText: createInstanceForText,
  isTextComponent: isTextComponent,
  injection: ReactHostComponentInjection
};
var ReactHostComponent_1 = ReactHostComponent;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var ReactCompositeComponentWrapper = function ReactCompositeComponentWrapper(element) {
  this.construct(element);
};

ReactCompositeComponentWrapper._r = [2];

function getDeclarationErrorAddendum$4(owner) {
  if (owner) {
    var name = owner.getName();

    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }

  return '';
}
/**
 * Check if the type reference is a known internal type. I.e. not a user
 * provided composite type.
 *
 * @param {function} type
 * @return {boolean} Returns true if this is a valid internal type.
 */


getDeclarationErrorAddendum$4._r = [2];

function isInternalComponentType(type) {
  return typeof type === 'function' && typeof type.prototype !== 'undefined' && typeof type.prototype.mountComponent === 'function' && typeof type.prototype.receiveComponent === 'function';
}
/**
 * Given a ReactNode, create an instance that will actually be mounted.
 *
 * @param {ReactNode} node
 * @param {boolean} shouldHaveDebugID
 * @return {object} A new instance of the element's constructor.
 * @protected
 */


isInternalComponentType._r = [2];

function instantiateReactComponent(node, shouldHaveDebugID) {
  var instance;

  if (node === null || node === false) {
    instance = ReactEmptyComponent_1.create(instantiateReactComponent);
  } else if (_typeof$2(node) === 'object') {
    var element = node;
    var type = element.type;

    if (typeof type !== 'function' && typeof type !== 'string') {
      var info = '';

      info += getDeclarationErrorAddendum$4(element._owner);
      reactProdInvariant_1$2('130', type == null ? type : _typeof$2(type), info);
    } // Special case string values


    if (typeof element.type === 'string') {
      instance = ReactHostComponent_1.createInternalComponent(element);
    } else if (isInternalComponentType(element.type)) {
      // This is temporarily available for custom components that are not string
      // representations. I.e. ART. Once those are updated to use the string
      // representation, we can drop this code path.
      instance = new element.type(element); // We renamed this. Allow the old name for compat. :(

      if (!instance.getHostNode) {
        instance.getHostNode = instance.getNativeNode;
      }
    } else {
      instance = new ReactCompositeComponentWrapper(element);
    }
  } else if (typeof node === 'string' || typeof node === 'number') {
    instance = ReactHostComponent_1.createInstanceForText(node);
  } else {
    reactProdInvariant_1$2('131', _typeof$2(node));
  }

  instance._mountIndex = 0;
  instance._mountImage = null;

  return instance;
}

instantiateReactComponent._r = [2];

objectAssign(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent_1, {
  _instantiateReactComponent: instantiateReactComponent
});

var instantiateReactComponent_1 = instantiateReactComponent;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape$1(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */


escape$1._r = [2];

function unescape$1(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);
  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

unescape$1._r = [2];
var KeyEscapeUtils$2 = {
  escape: escape$1,
  unescape: unescape$1
};
var KeyEscapeUtils_1$2 = KeyEscapeUtils$2;

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// nor polyfill, then a plain number is used for performance.

var REACT_ELEMENT_TYPE$2 = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;
var ReactElementSymbol$2 = REACT_ELEMENT_TYPE$2;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/* global Symbol */

var ITERATOR_SYMBOL$1 = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL$1 = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */

function getIteratorFn$2(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL$1 && maybeIterable[ITERATOR_SYMBOL$1] || maybeIterable[FAUX_ITERATOR_SYMBOL$1]);

  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

getIteratorFn$2._r = [2];
var getIteratorFn_1$2 = getIteratorFn$2;

var SEPARATOR$1 = '.';
var SUBSEPARATOR$1 = ':';
/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */

function getComponentKey$1(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && _typeof$2(component) === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils_1$2.escape(component.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}
/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */


getComponentKey$1._r = [2];

function traverseAllChildrenImpl$1(children, nameSoFar, callback, traverseContext) {
  var type = _typeof$2(children);

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' || // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === ReactElementSymbol$2) {
    callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR$1 + getComponentKey$1(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR$1 : nameSoFar + SUBSEPARATOR$1;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey$1(child, i);
      subtreeCount += traverseAllChildrenImpl$1(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn_1$2(children);

    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;

      if (iteratorFn !== children.entries) {
        var ii = 0;

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey$1(child, ii++);
          subtreeCount += traverseAllChildrenImpl$1(child, nextName, callback, traverseContext);
        }
      } else {
        while (!(step = iterator.next()).done) {
          var entry = step.value;

          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils_1$2.escape(entry[0]) + SUBSEPARATOR$1 + getComponentKey$1(child, 0);
            subtreeCount += traverseAllChildrenImpl$1(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';

      var childrenString = String(children);
      reactProdInvariant_1$2('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}
/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */


traverseAllChildrenImpl$1._r = [2];

function traverseAllChildren$2(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl$1(children, '', callback, traverseContext);
}

traverseAllChildren$2._r = [2];
var traverseAllChildren_1$2 = traverseAllChildren$2;

var ReactComponentTreeHook$2;

if (typeof process !== 'undefined' && process.env && "production" === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook$2 = ReactComponentTreeHook_1;
}

function instantiateChild(childInstances, child, name, selfDebugID) {
  // We found a component instance.
  var keyUnique = childInstances[name] === undefined;

  if (child != null && keyUnique) {
    childInstances[name] = instantiateReactComponent_1(child, true);
  }
}
/**
 * ReactChildReconciler provides helpers for initializing or updating a set of
 * children. Its output is suitable for passing it onto ReactMultiChild which
 * does diffed reordering and insertion.
 */


instantiateChild._r = [2];
var ReactChildReconciler = {
  /**
   * Generates a "mount image" for each of the supplied children. In the case
   * of `ReactDOMComponent`, a mount image is a string of markup.
   *
   * @param {?object} nestedChildNodes Nested child maps.
   * @return {?object} A set of child instances.
   * @internal
   */
  instantiateChildren: function instantiateChildren(nestedChildNodes, transaction, context, selfDebugID) // 0 in production and for roots
  {
    if (nestedChildNodes == null) {
      return null;
    }

    var childInstances = {};

    {
      traverseAllChildren_1$2(nestedChildNodes, instantiateChild, childInstances);
    }

    return childInstances;
  },

  /**
   * Updates the rendered children and returns a new set of children.
   *
   * @param {?object} prevChildren Previously initialized set of children.
   * @param {?object} nextChildren Flat child element maps.
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @return {?object} A new set of child instances.
   * @internal
   */
  updateChildren: function updateChildren(prevChildren, nextChildren, mountImages, removedNodes, transaction, hostParent, hostContainerInfo, context, selfDebugID) // 0 in production and for roots
  {
    // We currently don't have a way to track moves here but if we use iterators
    // instead of for..in we can zip the iterators and check if an item has
    // moved.
    // TODO: If nothing has changed, return the prevChildren object so that we
    // can quickly bailout if nothing has changed.
    if (!nextChildren && !prevChildren) {
      return;
    }

    var name;
    var prevChild;

    for (name in nextChildren) {
      if (!nextChildren.hasOwnProperty(name)) {
        continue;
      }

      prevChild = prevChildren && prevChildren[name];
      var prevElement = prevChild && prevChild._currentElement;
      var nextElement = nextChildren[name];

      if (prevChild != null && shouldUpdateReactComponent_1(prevElement, nextElement)) {
        ReactReconciler_1.receiveComponent(prevChild, nextElement, transaction, context);
        nextChildren[name] = prevChild;
      } else {
        if (prevChild) {
          removedNodes[name] = ReactReconciler_1.getHostNode(prevChild);
          ReactReconciler_1.unmountComponent(prevChild, false);
        } // The child must be instantiated before it's mounted.


        var nextChildInstance = instantiateReactComponent_1(nextElement, true);
        nextChildren[name] = nextChildInstance; // Creating mount image now ensures refs are resolved in right order
        // (see https://github.com/facebook/react/pull/7101 for explanation).

        var nextChildMountImage = ReactReconciler_1.mountComponent(nextChildInstance, transaction, hostParent, hostContainerInfo, context, selfDebugID);
        mountImages.push(nextChildMountImage);
      }
    } // Unmount children that are no longer present.


    for (name in prevChildren) {
      if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
        prevChild = prevChildren[name];
        removedNodes[name] = ReactReconciler_1.getHostNode(prevChild);
        ReactReconciler_1.unmountComponent(prevChild, false);
      }
    }
  },

  /**
   * Unmounts all rendered children. This should be used to clean up children
   * when this component is unmounted.
   *
   * @param {?object} renderedChildren Previously initialized set of children.
   * @internal
   */
  unmountChildren: function unmountChildren(renderedChildren, safely) {
    for (var name in renderedChildren) {
      if (renderedChildren.hasOwnProperty(name)) {
        var renderedChild = renderedChildren[name];
        ReactReconciler_1.unmountComponent(renderedChild, safely);
      }
    }
  }
};
var ReactChildReconciler_1 = ReactChildReconciler;

var ReactComponentTreeHook$4;

if (typeof process !== 'undefined' && process.env && "production" === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook$4 = ReactComponentTreeHook_1;
}
/**
 * @param {function} traverseContext Context passed through traversal.
 * @param {?ReactComponent} child React child component.
 * @param {!string} name String name of key path to child.
 * @param {number=} selfDebugID Optional debugID of the current internal instance.
 */


function flattenSingleChildIntoContext(traverseContext, child, name, selfDebugID) {
  // We found a component instance.
  if (traverseContext && _typeof$2(traverseContext) === 'object') {
    var result = traverseContext;
    var keyUnique = result[name] === undefined;

    if (keyUnique && child != null) {
      result[name] = child;
    }
  }
}
/**
 * Flattens children that are typically specified as `props.children`. Any null
 * children will not be included in the resulting object.
 * @return {!object} flattened children keyed by name.
 */


flattenSingleChildIntoContext._r = [2];

function flattenChildren$1(children, selfDebugID) {
  if (children == null) {
    return children;
  }

  var result = {};

  {
    traverseAllChildren_1$2(children, flattenSingleChildIntoContext, result);
  }

  return result;
}

flattenChildren$1._r = [2];
var flattenChildren_1 = flattenChildren$1;

/**
 * Make an update for markup to be rendered and inserted at a supplied index.
 *
 * @param {string} markup Markup that renders into an element.
 * @param {number} toIndex Destination index.
 * @private
 */


function makeInsertMarkup(markup, afterNode, toIndex) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'INSERT_MARKUP',
    content: markup,
    fromIndex: null,
    fromNode: null,
    toIndex: toIndex,
    afterNode: afterNode
  };
}
/**
 * Make an update for moving an existing element to another index.
 *
 * @param {number} fromIndex Source index of the existing element.
 * @param {number} toIndex Destination index of the element.
 * @private
 */


makeInsertMarkup._r = [2];

function makeMove(child, afterNode, toIndex) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'MOVE_EXISTING',
    content: null,
    fromIndex: child._mountIndex,
    fromNode: ReactReconciler_1.getHostNode(child),
    toIndex: toIndex,
    afterNode: afterNode
  };
}
/**
 * Make an update for removing an element at an index.
 *
 * @param {number} fromIndex Index of the element to remove.
 * @private
 */


makeMove._r = [2];

function makeRemove(child, node) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'REMOVE_NODE',
    content: null,
    fromIndex: child._mountIndex,
    fromNode: node,
    toIndex: null,
    afterNode: null
  };
}
/**
 * Make an update for setting the markup of a node.
 *
 * @param {string} markup Markup that renders into an element.
 * @private
 */


makeRemove._r = [2];

function makeSetMarkup(markup) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'SET_MARKUP',
    content: markup,
    fromIndex: null,
    fromNode: null,
    toIndex: null,
    afterNode: null
  };
}
/**
 * Make an update for setting the text content.
 *
 * @param {string} textContent Text content to set.
 * @private
 */


makeSetMarkup._r = [2];

function makeTextContent(textContent) {
  // NOTE: Null values reduce hidden classes.
  return {
    type: 'TEXT_CONTENT',
    content: textContent,
    fromIndex: null,
    fromNode: null,
    toIndex: null,
    afterNode: null
  };
}
/**
 * Push an update, if any, onto the queue. Creates a new queue if none is
 * passed and always returns the queue. Mutative.
 */


makeTextContent._r = [2];

function enqueue(queue, update) {
  if (update) {
    queue = queue || [];
    queue.push(update);
  }

  return queue;
}
/**
 * Processes any enqueued updates.
 *
 * @private
 */


enqueue._r = [2];

function processQueue(inst, updateQueue) {
  ReactComponentEnvironment_1.processChildrenUpdates(inst, updateQueue);
}

processQueue._r = [2];
/**
 * ReactMultiChild are capable of reconciling multiple children.
 *
 * @class ReactMultiChild
 * @internal
 */


var ReactMultiChild = {
  /**
   * Provides common functionality for components that must reconcile multiple
   * children. This is used by `ReactDOMComponent` to mount, update, and
   * unmount child components.
   *
   * @lends {ReactMultiChild.prototype}
   */
  Mixin: {
    _reconcilerInstantiateChildren: function _reconcilerInstantiateChildren(nestedChildren, transaction, context) {
      return ReactChildReconciler_1.instantiateChildren(nestedChildren, transaction, context);
    },
    _reconcilerUpdateChildren: function _reconcilerUpdateChildren(prevChildren, nextNestedChildrenElements, mountImages, removedNodes, transaction, context) {
      var nextChildren;
      var selfDebugID = 0;

      nextChildren = flattenChildren_1(nextNestedChildrenElements, selfDebugID);
      ReactChildReconciler_1.updateChildren(prevChildren, nextChildren, mountImages, removedNodes, transaction, this, this._hostContainerInfo, context, selfDebugID);
      return nextChildren;
    },

    /**
     * Generates a "mount image" for each of the supplied children. In the case
     * of `ReactDOMComponent`, a mount image is a string of markup.
     *
     * @param {?object} nestedChildren Nested child maps.
     * @return {array} An array of mounted representations.
     * @internal
     */
    mountChildren: function mountChildren(nestedChildren, transaction, context) {
      var children = this._reconcilerInstantiateChildren(nestedChildren, transaction, context);

      this._renderedChildren = children;
      var mountImages = [];
      var index = 0;

      for (var name in children) {
        if (children.hasOwnProperty(name)) {
          var child = children[name];
          var selfDebugID = 0;

          var mountImage = ReactReconciler_1.mountComponent(child, transaction, this, this._hostContainerInfo, context, selfDebugID);
          child._mountIndex = index++;
          mountImages.push(mountImage);
        }
      }

      return mountImages;
    },

    /**
     * Replaces any rendered children with a text content string.
     *
     * @param {string} nextContent String of content.
     * @internal
     */
    updateTextContent: function updateTextContent(nextContent) {
      var prevChildren = this._renderedChildren; // Remove any rendered children.

      ReactChildReconciler_1.unmountChildren(prevChildren, false);

      for (var name in prevChildren) {
        if (prevChildren.hasOwnProperty(name)) {
          reactProdInvariant_1$2('118');
        }
      } // Set new text content.


      var updates = [makeTextContent(nextContent)];
      processQueue(this, updates);
    },

    /**
     * Replaces any rendered children with a markup string.
     *
     * @param {string} nextMarkup String of markup.
     * @internal
     */
    updateMarkup: function updateMarkup(nextMarkup) {
      var prevChildren = this._renderedChildren; // Remove any rendered children.

      ReactChildReconciler_1.unmountChildren(prevChildren, false);

      for (var name in prevChildren) {
        if (prevChildren.hasOwnProperty(name)) {
          reactProdInvariant_1$2('118');
        }
      }

      var updates = [makeSetMarkup(nextMarkup)];
      processQueue(this, updates);
    },

    /**
     * Updates the rendered children with new children.
     *
     * @param {?object} nextNestedChildrenElements Nested child element maps.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    updateChildren: function updateChildren(nextNestedChildrenElements, transaction, context) {
      // Hook used by React ART
      this._updateChildren(nextNestedChildrenElements, transaction, context);
    },

    /**
     * @param {?object} nextNestedChildrenElements Nested child element maps.
     * @param {ReactReconcileTransaction} transaction
     * @final
     * @protected
     */
    _updateChildren: function _updateChildren(nextNestedChildrenElements, transaction, context) {
      var prevChildren = this._renderedChildren;
      var removedNodes = {};
      var mountImages = [];

      var nextChildren = this._reconcilerUpdateChildren(prevChildren, nextNestedChildrenElements, mountImages, removedNodes, transaction, context);

      if (!nextChildren && !prevChildren) {
        return;
      }

      var updates = null;
      var name; // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.

      var nextIndex = 0;
      var lastIndex = 0; // `nextMountIndex` will increment for each newly mounted child.

      var nextMountIndex = 0;
      var lastPlacedNode = null;

      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }

        var prevChild = prevChildren && prevChildren[name];
        var nextChild = nextChildren[name];

        if (prevChild === nextChild) {
          updates = enqueue(updates, this.moveChild(prevChild, lastPlacedNode, nextIndex, lastIndex));
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex); // The `removedNodes` loop below will actually remove the child.
          } // The child must be instantiated before it's mounted.


          updates = enqueue(updates, this._mountChildAtIndex(nextChild, mountImages[nextMountIndex], lastPlacedNode, nextIndex, transaction, context));
          nextMountIndex++;
        }

        nextIndex++;
        lastPlacedNode = ReactReconciler_1.getHostNode(nextChild);
      } // Remove children that are no longer present.


      for (name in removedNodes) {
        if (removedNodes.hasOwnProperty(name)) {
          updates = enqueue(updates, this._unmountChild(prevChildren[name], removedNodes[name]));
        }
      }

      if (updates) {
        processQueue(this, updates);
      }

      this._renderedChildren = nextChildren;

      
    },

    /**
     * Unmounts all rendered children. This should be used to clean up children
     * when this component is unmounted. It does not actually perform any
     * backend operations.
     *
     * @internal
     */
    unmountChildren: function unmountChildren(safely) {
      var renderedChildren = this._renderedChildren;
      ReactChildReconciler_1.unmountChildren(renderedChildren, safely);
      this._renderedChildren = null;
    },

    /**
     * Moves a child component to the supplied index.
     *
     * @param {ReactComponent} child Component to move.
     * @param {number} toIndex Destination index of the element.
     * @param {number} lastIndex Last index visited of the siblings of `child`.
     * @protected
     */
    moveChild: function moveChild(child, afterNode, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        return makeMove(child, afterNode, toIndex);
      }
    },

    /**
     * Creates a child component.
     *
     * @param {ReactComponent} child Component to create.
     * @param {string} mountImage Markup to insert.
     * @protected
     */
    createChild: function createChild(child, afterNode, mountImage) {
      return makeInsertMarkup(mountImage, afterNode, child._mountIndex);
    },

    /**
     * Removes a child component.
     *
     * @param {ReactComponent} child Child to remove.
     * @protected
     */
    removeChild: function removeChild(child, node) {
      return makeRemove(child, node);
    },

    /**
     * Mounts a child with the supplied name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to mount.
     * @param {string} name Name of the child.
     * @param {number} index Index at which to insert the child.
     * @param {ReactReconcileTransaction} transaction
     * @private
     */
    _mountChildAtIndex: function _mountChildAtIndex(child, mountImage, afterNode, index, transaction, context) {
      child._mountIndex = index;
      return this.createChild(child, afterNode, mountImage);
    },

    /**
     * Unmounts a rendered child.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to unmount.
     * @private
     */
    _unmountChild: function _unmountChild(child, node) {
      var update = this.removeChild(child, node);
      child._mountIndex = null;
      return update;
    }
  }
};
var ReactMultiChild_1 = ReactMultiChild;

function enqueueUpdate$1(internalInstance) {
  ReactUpdates_1.enqueueUpdate(internalInstance);
}

enqueueUpdate$1._r = [2];

function formatUnexpectedArgument(arg) {
  var type = _typeof$2(arg);

  if (type !== 'object') {
    return type;
  }

  var displayName = arg.constructor && arg.constructor.name || type;
  var keys = Object.keys(arg);

  if (keys.length > 0 && keys.length < 20) {
    return displayName + ' (keys: ' + keys.join(', ') + ')';
  }

  return displayName;
}

formatUnexpectedArgument._r = [2];

function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
  var internalInstance = ReactInstanceMap_1.get(publicInstance);

  if (!internalInstance) {
    return null;
  }

  return internalInstance;
}
/**
 * ReactUpdateQueue allows for state updates to be scheduled into a later
 * reconciliation step.
 */


getInternalInstanceReadyForUpdate._r = [2];
var ReactUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function isMounted(publicInstance) {
    var internalInstance = ReactInstanceMap_1.get(publicInstance);

    if (internalInstance) {
      // During componentWillMount and render this will still be null but after
      // that will always render to something. At least for now. So we can use
      // this hack.
      return !!internalInstance._renderedComponent;
    } else {
      return false;
    }
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @param {string} callerName Name of the calling function in the public API.
   * @internal
   */
  enqueueCallback: function enqueueCallback(publicInstance, callback, callerName) {
    ReactUpdateQueue.validateCallback(callback, callerName);
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance); // Previously we would throw an error if we didn't have an internal
    // instance. Since we want to make it a no-op instead, we mirror the same
    // behavior we have in other enqueue* methods.
    // We also need to ignore callbacks in componentWillMount. See
    // enqueueUpdates.

    if (!internalInstance) {
      return null;
    }

    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    } // TODO: The callback here is ignored when setState is called from
    // componentWillMount. Either fix it or disallow doing so completely in
    // favor of getInitialState. Alternatively, we can disallow
    // componentWillMount during server-side rendering.


    enqueueUpdate$1(internalInstance);
  },
  enqueueCallbackInternal: function enqueueCallbackInternal(internalInstance, callback) {
    if (internalInstance._pendingCallbacks) {
      internalInstance._pendingCallbacks.push(callback);
    } else {
      internalInstance._pendingCallbacks = [callback];
    }

    enqueueUpdate$1(internalInstance);
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function enqueueForceUpdate(publicInstance) {
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'forceUpdate');

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingForceUpdate = true;
    enqueueUpdate$1(internalInstance);
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState, callback) {
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'replaceState');

    if (!internalInstance) {
      return;
    }

    internalInstance._pendingStateQueue = [completeState];
    internalInstance._pendingReplaceState = true; // Future-proof 15.5

    if (callback !== undefined && callback !== null) {
      ReactUpdateQueue.validateCallback(callback, 'replaceState');

      if (internalInstance._pendingCallbacks) {
        internalInstance._pendingCallbacks.push(callback);
      } else {
        internalInstance._pendingCallbacks = [callback];
      }
    }

    enqueueUpdate$1(internalInstance);
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function enqueueSetState(publicInstance, partialState) {
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

    if (!internalInstance) {
      return;
    }

    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
    queue.push(partialState);
    enqueueUpdate$1(internalInstance);
  },
  enqueueElementInternal: function enqueueElementInternal(internalInstance, nextElement, nextContext) {
    internalInstance._pendingElement = nextElement; // TODO: introduce _pendingContext instead of setting it directly.

    internalInstance._context = nextContext;
    enqueueUpdate$1(internalInstance);
  },
  validateCallback: function validateCallback(callback, callerName) {
    !(!callback || typeof callback === 'function') ? reactProdInvariant_1$2('122', callerName, formatUnexpectedArgument(callback)) : void 0;
  }
};
var ReactUpdateQueue_1 = ReactUpdateQueue;

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

_classCallCheck$1._r = [2];

function warnNoop$1(publicInstance, callerName) {
  
}
/**
 * This is the update queue used for server rendering.
 * It delegates to ReactUpdateQueue while server rendering is in progress and
 * switches to ReactNoopUpdateQueue after the transaction has completed.
 * @class ReactServerUpdateQueue
 * @param {Transaction} transaction
 */


warnNoop$1._r = [2];

var ReactServerUpdateQueue = function () {
  function ReactServerUpdateQueue(transaction) {
    _classCallCheck$1(this, ReactServerUpdateQueue);

    this.transaction = transaction;
  }
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */


  ReactServerUpdateQueue.prototype.isMounted = function isMounted(publicInstance) {
    return false;
  };
  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueCallback = function enqueueCallback(publicInstance, callback, callerName) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue_1.enqueueCallback(publicInstance, callback, callerName);
    }
  };
  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueForceUpdate = function enqueueForceUpdate(publicInstance) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue_1.enqueueForceUpdate(publicInstance);
    } else {
      warnNoop$1(publicInstance, 'forceUpdate');
    }
  };
  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object|function} completeState Next state.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueReplaceState = function enqueueReplaceState(publicInstance, completeState) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue_1.enqueueReplaceState(publicInstance, completeState);
    } else {
      warnNoop$1(publicInstance, 'replaceState');
    }
  };
  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object|function} partialState Next partial state to be merged with state.
   * @internal
   */


  ReactServerUpdateQueue.prototype.enqueueSetState = function enqueueSetState(publicInstance, partialState) {
    if (this.transaction.isInTransaction()) {
      ReactUpdateQueue_1.enqueueSetState(publicInstance, partialState);
    } else {
      warnNoop$1(publicInstance, 'setState');
    }
  };

  return ReactServerUpdateQueue;
}();

var ReactServerUpdateQueue_1 = ReactServerUpdateQueue;

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */


var TRANSACTION_WRAPPERS$1 = [];

var noopCallbackQueue = {
  enqueue: function enqueue() {}
};
/**
 * @class ReactServerRenderingTransaction
 * @param {boolean} renderToStaticMarkup
 */

function ReactServerRenderingTransaction(renderToStaticMarkup) {
  this.reinitializeTransaction();
  this.renderToStaticMarkup = renderToStaticMarkup;
  this.useCreateElement = false;
  this.updateQueue = new ReactServerUpdateQueue_1(this);
}

ReactServerRenderingTransaction._r = [2];
var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array} Empty list of operation wrap procedures.
   */
  getTransactionWrappers: function getTransactionWrappers() {
    return TRANSACTION_WRAPPERS$1;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function getReactMountReady() {
    return noopCallbackQueue;
  },

  /**
   * @return {object} The queue to collect React async events.
   */
  getUpdateQueue: function getUpdateQueue() {
    return this.updateQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be reused.
   */
  destructor: function destructor() {},
  checkpoint: function checkpoint() {},
  rollback: function rollback() {}
};

objectAssign(ReactServerRenderingTransaction.prototype, Transaction, Mixin);

PooledClass_1$2.addPoolingTo(ReactServerRenderingTransaction);
var ReactServerRenderingTransaction_1 = ReactServerRenderingTransaction;

var Flags$1 = ReactDOMComponentFlags_1;
var deleteListener = EventPluginHub_1.deleteListener;
var getNode = ReactDOMComponentTree_1.getNodeFromInstance;
var listenTo = ReactBrowserEventEmitter_1.listenTo;
var registrationNameModules = EventPluginRegistry_1.registrationNameModules; // For quickly matching children type, to test if can be treated as content.

var CONTENT_TYPES = {
  string: true,
  number: true
};
var STYLE = 'style';
var HTML = '__html';
var RESERVED_PROPS$1 = {
  children: null,
  dangerouslySetInnerHTML: null,
  suppressContentEditableWarning: null
}; // Node type for document fragments (Node.DOCUMENT_FRAGMENT_NODE).

var DOC_FRAGMENT_TYPE = 11;

function getDeclarationErrorAddendum$1(internalInstance) {
  if (internalInstance) {
    var owner = internalInstance._currentElement._owner || null;

    if (owner) {
      var name = owner.getName();

      if (name) {
        return ' This DOM node was rendered by `' + name + '`.';
      }
    }
  }

  return '';
}

getDeclarationErrorAddendum$1._r = [2];

function assertValidProps(component, props) {
  if (!props) {
    return;
  } // Note the use of `==` which checks for null or undefined.


  if (voidElementTags[component._tag]) {
    !(props.children == null && props.dangerouslySetInnerHTML == null) ? reactProdInvariant_1$2('137', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : void 0;
  }

  if (props.dangerouslySetInnerHTML != null) {
    !(props.children == null) ? reactProdInvariant_1$2('60') : void 0;
    !(_typeof$2(props.dangerouslySetInnerHTML) === 'object' && HTML in props.dangerouslySetInnerHTML) ? reactProdInvariant_1$2('61') : void 0;
  }

  !(props.style == null || _typeof$2(props.style) === 'object') ? reactProdInvariant_1$2('62', getDeclarationErrorAddendum$1(component)) : void 0;
}

assertValidProps._r = [2];

function enqueuePutListener(inst, registrationName, listener, transaction) {
  if (transaction instanceof ReactServerRenderingTransaction_1) {
    return;
  }

  var containerInfo = inst._hostContainerInfo;
  var isDocumentFragment = containerInfo._node && containerInfo._node.nodeType === DOC_FRAGMENT_TYPE;
  var doc = isDocumentFragment ? containerInfo._node : containerInfo._ownerDocument;
  listenTo(registrationName, doc);
  transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener
  });
}

enqueuePutListener._r = [2];

function putListener() {
  var listenerToPut = this;
  EventPluginHub_1.putListener(listenerToPut.inst, listenerToPut.registrationName, listenerToPut.listener);
}

putListener._r = [2];

function inputPostMount() {
  var inst = this;
  ReactDOMInput_1.postMountWrapper(inst);
}

inputPostMount._r = [2];

function textareaPostMount() {
  var inst = this;
  ReactDOMTextarea_1.postMountWrapper(inst);
}

textareaPostMount._r = [2];

function optionPostMount() {
  var inst = this;
  ReactDOMOption_1.postMountWrapper(inst);
}

optionPostMount._r = [2];
// maintain a list rather than create a `trapBubbledEvent` for each


var mediaEvents = {
  topAbort: 'abort',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTimeUpdate: 'timeupdate',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting'
};

function trackInputValue() {
  inputValueTracking_1.track(this);
}

trackInputValue._r = [2];

function trapBubbledEventsLocal() {
  var inst = this; // If a component renders to null or if another component fatals and causes
  // the state of the tree to be corrupted, `node` here can be null.

  !inst._rootNodeID ? reactProdInvariant_1$2('63') : void 0;
  var node = getNode(inst);
  !node ? reactProdInvariant_1$2('64') : void 0;

  switch (inst._tag) {
    case 'iframe':
    case 'object':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter_1.trapBubbledEvent('topLoad', 'load', node)];
      break;

    case 'video':
    case 'audio':
      inst._wrapperState.listeners = []; // Create listener for each media event

      for (var event in mediaEvents) {
        if (mediaEvents.hasOwnProperty(event)) {
          inst._wrapperState.listeners.push(ReactBrowserEventEmitter_1.trapBubbledEvent(event, mediaEvents[event], node));
        }
      }

      break;

    case 'source':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter_1.trapBubbledEvent('topError', 'error', node)];
      break;

    case 'img':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter_1.trapBubbledEvent('topError', 'error', node), ReactBrowserEventEmitter_1.trapBubbledEvent('topLoad', 'load', node)];
      break;

    case 'form':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter_1.trapBubbledEvent('topReset', 'reset', node), ReactBrowserEventEmitter_1.trapBubbledEvent('topSubmit', 'submit', node)];
      break;

    case 'input':
    case 'select':
    case 'textarea':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter_1.trapBubbledEvent('topInvalid', 'invalid', node)];
      break;
  }
}

trapBubbledEventsLocal._r = [2];

function postUpdateSelectWrapper() {
  ReactDOMSelect_1.postUpdateWrapper(this);
} // For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special-case tags.


postUpdateSelectWrapper._r = [2];
var omittedCloseTags = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true // NOTE: menuitem's close tag should be omitted, but that causes problems.

};
var newlineEatingTags = {
  listing: true,
  pre: true,
  textarea: true
}; // For HTML, certain tags cannot have children. This has the same purpose as
// `omittedCloseTags` except that `menuitem` should still have its closing tag.

var voidElementTags = objectAssign({
  menuitem: true
}, omittedCloseTags); // We accept any tag to be rendered but since this gets injected into arbitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name


var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset

var validatedTagCache = {};
var hasOwnProperty$2 = {}.hasOwnProperty;

function validateDangerousTag(tag) {
  if (!hasOwnProperty$2.call(validatedTagCache, tag)) {
    !VALID_TAG_REGEX.test(tag) ? reactProdInvariant_1$2('65', tag) : void 0;
    validatedTagCache[tag] = true;
  }
}

validateDangerousTag._r = [2];

function isCustomComponent(tagName, props) {
  return tagName.indexOf('-') >= 0 || props.is != null;
}

isCustomComponent._r = [2];
var globalIdCounter = 1;
/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @constructor ReactDOMComponent
 * @extends ReactMultiChild
 */

function ReactDOMComponent(element) {
  var tag = element.type;
  validateDangerousTag(tag);
  this._currentElement = element;
  this._tag = tag.toLowerCase();
  this._namespaceURI = null;
  this._renderedChildren = null;
  this._previousStyle = null;
  this._previousStyleCopy = null;
  this._hostNode = null;
  this._hostParent = null;
  this._rootNodeID = 0;
  this._domID = 0;
  this._hostContainerInfo = null;
  this._wrapperState = null;
  this._topLevelWrapper = null;
  this._flags = 0;

  
}

ReactDOMComponent._r = [2];
ReactDOMComponent.displayName = 'ReactDOMComponent';
ReactDOMComponent.Mixin = {
  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {?ReactDOMComponent} the parent component instance
   * @param {?object} info about the host container
   * @param {object} context
   * @return {string} The computed markup.
   */
  mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
    this._rootNodeID = globalIdCounter++;
    this._domID = hostContainerInfo._idCounter++;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;
    var props = this._currentElement.props;

    switch (this._tag) {
      case 'audio':
      case 'form':
      case 'iframe':
      case 'img':
      case 'link':
      case 'object':
      case 'source':
      case 'video':
        this._wrapperState = {
          listeners: null
        };
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;

      case 'input':
        ReactDOMInput_1.mountWrapper(this, props, hostParent);
        props = ReactDOMInput_1.getHostProps(this, props);
        transaction.getReactMountReady().enqueue(trackInputValue, this);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;

      case 'option':
        ReactDOMOption_1.mountWrapper(this, props, hostParent);
        props = ReactDOMOption_1.getHostProps(this, props);
        break;

      case 'select':
        ReactDOMSelect_1.mountWrapper(this, props, hostParent);
        props = ReactDOMSelect_1.getHostProps(this, props);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;

      case 'textarea':
        ReactDOMTextarea_1.mountWrapper(this, props, hostParent);
        props = ReactDOMTextarea_1.getHostProps(this, props);
        transaction.getReactMountReady().enqueue(trackInputValue, this);
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
    }

    assertValidProps(this, props); // We create tags in the namespace of their parent container, except HTML
    // tags get no namespace.

    var namespaceURI;
    var parentTag;

    if (hostParent != null) {
      namespaceURI = hostParent._namespaceURI;
      parentTag = hostParent._tag;
    } else if (hostContainerInfo._tag) {
      namespaceURI = hostContainerInfo._namespaceURI;
      parentTag = hostContainerInfo._tag;
    }

    if (namespaceURI == null || namespaceURI === DOMNamespaces_1.svg && parentTag === 'foreignobject') {
      namespaceURI = DOMNamespaces_1.html;
    }

    if (namespaceURI === DOMNamespaces_1.html) {
      if (this._tag === 'svg') {
        namespaceURI = DOMNamespaces_1.svg;
      } else if (this._tag === 'math') {
        namespaceURI = DOMNamespaces_1.mathml;
      }
    }

    this._namespaceURI = namespaceURI;

    var mountImage;

    if (transaction.useCreateElement) {
      var ownerDocument = hostContainerInfo._ownerDocument;
      var el;

      if (namespaceURI === DOMNamespaces_1.html) {
        if (this._tag === 'script') {
          // Create the script via .innerHTML so its "parser-inserted" flag is
          // set to true and it does not execute
          var div = ownerDocument.createElement('div');
          var type = this._currentElement.type;
          div.innerHTML = '<' + type + '></' + type + '>';
          el = div.removeChild(div.firstChild);
        } else if (props.is) {
          el = ownerDocument.createElement(this._currentElement.type, props.is);
        } else {
          // Separate else branch instead of using `props.is || undefined` above becuase of a Firefox bug.
          // See discussion in https://github.com/facebook/react/pull/6896
          // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
          el = ownerDocument.createElement(this._currentElement.type);
        }
      } else {
        el = ownerDocument.createElementNS(namespaceURI, this._currentElement.type);
      }

      ReactDOMComponentTree_1.precacheNode(this, el);
      this._flags |= Flags$1.hasCachedChildNodes;

      if (!this._hostParent) {
        DOMPropertyOperations_1.setAttributeForRoot(el);
      }

      this._updateDOMProperties(null, props, transaction);

      var lazyTree = DOMLazyTree_1(el);

      this._createInitialChildren(transaction, props, context, lazyTree);

      mountImage = lazyTree;
    } else {
      var tagOpen = this._createOpenTagMarkupAndPutListeners(transaction, props);

      var tagContent = this._createContentMarkup(transaction, props, context);

      if (!tagContent && omittedCloseTags[this._tag]) {
        mountImage = tagOpen + '/>';
      } else {
        mountImage = tagOpen + '>' + tagContent + '</' + this._currentElement.type + '>';
      }
    }

    switch (this._tag) {
      case 'input':
        transaction.getReactMountReady().enqueue(inputPostMount, this);

        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils_1.focusDOMComponent, this);
        }

        break;

      case 'textarea':
        transaction.getReactMountReady().enqueue(textareaPostMount, this);

        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils_1.focusDOMComponent, this);
        }

        break;

      case 'select':
        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils_1.focusDOMComponent, this);
        }

        break;

      case 'button':
        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils_1.focusDOMComponent, this);
        }

        break;

      case 'option':
        transaction.getReactMountReady().enqueue(optionPostMount, this);
        break;
    }

    return mountImage;
  },

  /**
   * Creates markup for the open tag and all attributes.
   *
   * This method has side effects because events get registered.
   *
   * Iterating over object properties is faster than iterating over arrays.
   * @see http://jsperf.com/obj-vs-arr-iteration
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} props
   * @return {string} Markup of opening tag.
   */
  _createOpenTagMarkupAndPutListeners: function _createOpenTagMarkupAndPutListeners(transaction, props) {
    var ret = '<' + this._currentElement.type;

    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }

      var propValue = props[propKey];

      if (propValue == null) {
        continue;
      }

      if (registrationNameModules.hasOwnProperty(propKey)) {
        if (propValue) {
          enqueuePutListener(this, propKey, propValue, transaction);
        }
      } else {
        if (propKey === STYLE) {
          if (propValue) {
            propValue = this._previousStyleCopy = objectAssign({}, props.style);
          }

          propValue = CSSPropertyOperations_1.createMarkupForStyles(propValue, this);
        }

        var markup = null;

        if (this._tag != null && isCustomComponent(this._tag, props)) {
          if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
            markup = DOMPropertyOperations_1.createMarkupForCustomAttribute(propKey, propValue);
          }
        } else {
          markup = DOMPropertyOperations_1.createMarkupForProperty(propKey, propValue);
        }

        if (markup) {
          ret += ' ' + markup;
        }
      }
    } // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.


    if (transaction.renderToStaticMarkup) {
      return ret;
    }

    if (!this._hostParent) {
      ret += ' ' + DOMPropertyOperations_1.createMarkupForRoot();
    }

    ret += ' ' + DOMPropertyOperations_1.createMarkupForID(this._domID);
    return ret;
  },

  /**
   * Creates markup for the content between the tags.
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} props
   * @param {object} context
   * @return {string} Content markup.
   */
  _createContentMarkup: function _createContentMarkup(transaction, props, context) {
    var ret = ''; // Intentional use of != to avoid catching zero/false.

    var innerHTML = props.dangerouslySetInnerHTML;

    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        ret = innerHTML.__html;
      }
    } else {
      var contentToUse = CONTENT_TYPES[_typeof$2(props.children)] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children;

      if (contentToUse != null) {
        // TODO: Validate that text is allowed as a child of this node
        ret = escapeTextContentForBrowser_1(contentToUse);

        
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(childrenToUse, transaction, context);
        ret = mountImages.join('');
      }
    }

    if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
      // text/html ignores the first character in these tags if it's a newline
      // Prefer to break application/xml over text/html (for now) by adding
      // a newline specifically to get eaten by the parser. (Alternately for
      // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
      // \r is normalized out by HTMLTextAreaElement#value.)
      // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
      // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
      // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
      // See: Parsing of "textarea" "listing" and "pre" elements
      //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
      return '\n' + ret;
    } else {
      return ret;
    }
  },
  _createInitialChildren: function _createInitialChildren(transaction, props, context, lazyTree) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;

    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        DOMLazyTree_1.queueHTML(lazyTree, innerHTML.__html);
      }
    } else {
      var contentToUse = CONTENT_TYPES[_typeof$2(props.children)] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children; // TODO: Validate that text is allowed as a child of this node

      if (contentToUse != null) {
        // Avoid setting textContent when the text is empty. In IE11 setting
        // textContent on a text area will cause the placeholder to not
        // show within the textarea until it has been focused and blurred again.
        // https://github.com/facebook/react/issues/6731#issuecomment-254874553
        if (contentToUse !== '') {
          DOMLazyTree_1.queueText(lazyTree, contentToUse);
        }
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(childrenToUse, transaction, context);

        for (var i = 0; i < mountImages.length; i++) {
          DOMLazyTree_1.queueChild(lazyTree, mountImages[i]);
        }
      }
    }
  },

  /**
   * Receives a next element and updates the component.
   *
   * @internal
   * @param {ReactElement} nextElement
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} context
   */
  receiveComponent: function receiveComponent(nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;
    this.updateComponent(transaction, prevElement, nextElement, context);
  },

  /**
   * Updates a DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @param {ReactElement} nextElement
   * @internal
   * @overridable
   */
  updateComponent: function updateComponent(transaction, prevElement, nextElement, context) {
    var lastProps = prevElement.props;
    var nextProps = this._currentElement.props;

    switch (this._tag) {
      case 'input':
        lastProps = ReactDOMInput_1.getHostProps(this, lastProps);
        nextProps = ReactDOMInput_1.getHostProps(this, nextProps);
        break;

      case 'option':
        lastProps = ReactDOMOption_1.getHostProps(this, lastProps);
        nextProps = ReactDOMOption_1.getHostProps(this, nextProps);
        break;

      case 'select':
        lastProps = ReactDOMSelect_1.getHostProps(this, lastProps);
        nextProps = ReactDOMSelect_1.getHostProps(this, nextProps);
        break;

      case 'textarea':
        lastProps = ReactDOMTextarea_1.getHostProps(this, lastProps);
        nextProps = ReactDOMTextarea_1.getHostProps(this, nextProps);
        break;
    }

    assertValidProps(this, nextProps);

    this._updateDOMProperties(lastProps, nextProps, transaction);

    this._updateDOMChildren(lastProps, nextProps, transaction, context);

    switch (this._tag) {
      case 'input':
        // Update the wrapper around inputs *after* updating props. This has to
        // happen after `_updateDOMProperties`. Otherwise HTML5 input validations
        // raise warnings and prevent the new value from being assigned.
        ReactDOMInput_1.updateWrapper(this); // We also check that we haven't missed a value update, such as a
        // Radio group shifting the checked value to another named radio input.

        inputValueTracking_1.updateValueIfChanged(this);
        break;

      case 'textarea':
        ReactDOMTextarea_1.updateWrapper(this);
        break;

      case 'select':
        // <select> value update needs to occur after <option> children
        // reconciliation
        transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
        break;
    }
  },

  /**
   * Reconciles the properties by detecting differences in property values and
   * updating the DOM as necessary. This function is probably the single most
   * critical path for performance optimization.
   *
   * TODO: Benchmark whether checking for changed values in memory actually
   *       improves performance (especially statically positioned elements).
   * TODO: Benchmark the effects of putting this at the top since 99% of props
   *       do not change for a given reconciliation.
   * TODO: Benchmark areas that can be improved with caching.
   *
   * @private
   * @param {object} lastProps
   * @param {object} nextProps
   * @param {?DOMElement} node
   */
  _updateDOMProperties: function _updateDOMProperties(lastProps, nextProps, transaction) {
    var propKey;
    var styleName;
    var styleUpdates;

    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
        continue;
      }

      if (propKey === STYLE) {
        var lastStyle = this._previousStyleCopy;

        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }

        this._previousStyleCopy = null;
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (lastProps[propKey]) {
          // Only call deleteListener if there was a listener previously or
          // else willDeleteListener gets called when there wasn't actually a
          // listener (e.g., onClick={null})
          deleteListener(this, propKey);
        }
      } else if (isCustomComponent(this._tag, lastProps)) {
        if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
          DOMPropertyOperations_1.deleteValueForAttribute(getNode(this), propKey);
        }
      } else if (DOMProperty_1.properties[propKey] || DOMProperty_1.isCustomAttribute(propKey)) {
        DOMPropertyOperations_1.deleteValueForProperty(getNode(this), propKey);
      }
    }

    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = propKey === STYLE ? this._previousStyleCopy : lastProps != null ? lastProps[propKey] : undefined;

      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
        continue;
      }

      if (propKey === STYLE) {
        if (nextProp) {
          nextProp = this._previousStyleCopy = objectAssign({}, nextProp);
        } else {
          this._previousStyleCopy = null;
        }

        if (lastProp) {
          // Unset styles on `lastProp` but not on `nextProp`.
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          } // Update styles that changed since `lastProp`.


          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Relies on `updateStylesByID` not mutating `styleUpdates`.
          styleUpdates = nextProp;
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (nextProp) {
          enqueuePutListener(this, propKey, nextProp, transaction);
        } else if (lastProp) {
          deleteListener(this, propKey);
        }
      } else if (isCustomComponent(this._tag, nextProps)) {
        if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
          DOMPropertyOperations_1.setValueForAttribute(getNode(this), propKey, nextProp);
        }
      } else if (DOMProperty_1.properties[propKey] || DOMProperty_1.isCustomAttribute(propKey)) {
        var node = getNode(this); // If we're updating to null or undefined, we should remove the property
        // from the DOM node instead of inadvertently setting to a string. This
        // brings us in line with the same behavior we have on initial render.

        if (nextProp != null) {
          DOMPropertyOperations_1.setValueForProperty(node, propKey, nextProp);
        } else {
          DOMPropertyOperations_1.deleteValueForProperty(node, propKey);
        }
      }
    }

    if (styleUpdates) {
      CSSPropertyOperations_1.setValueForStyles(getNode(this), styleUpdates, this);
    }
  },

  /**
   * Reconciles the children with the various properties that affect the
   * children content.
   *
   * @param {object} lastProps
   * @param {object} nextProps
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   */
  _updateDOMChildren: function _updateDOMChildren(lastProps, nextProps, transaction, context) {
    var lastContent = CONTENT_TYPES[_typeof$2(lastProps.children)] ? lastProps.children : null;
    var nextContent = CONTENT_TYPES[_typeof$2(nextProps.children)] ? nextProps.children : null;
    var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html; // Note the use of `!=` which checks for null or undefined.

    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children; // If we're switching from children to content/html or vice versa, remove
    // the old content

    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;

    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction, context);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent('');

      
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent('' + nextContent);

        
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        this.updateMarkup('' + nextHtml);
      }

      
    } else if (nextChildren != null) {
      this.updateChildren(nextChildren, transaction, context);
    }
  },
  getHostNode: function getHostNode() {
    return getNode(this);
  },

  /**
   * Destroys all event registrations for this instance. Does not remove from
   * the DOM. That must be done by the parent.
   *
   * @internal
   */
  unmountComponent: function unmountComponent(safely) {
    switch (this._tag) {
      case 'audio':
      case 'form':
      case 'iframe':
      case 'img':
      case 'link':
      case 'object':
      case 'source':
      case 'video':
        var listeners = this._wrapperState.listeners;

        if (listeners) {
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].remove();
          }
        }

        break;

      case 'input':
      case 'textarea':
        inputValueTracking_1.stopTracking(this);
        break;

      case 'html':
      case 'head':
      case 'body':
        /**
         * Components like <html> <head> and <body> can't be removed or added
         * easily in a cross-browser way, however it's valuable to be able to
         * take advantage of React's reconciliation for styling and <title>
         * management. So we just document it and throw in dangerous cases.
         */
        reactProdInvariant_1$2('66', this._tag);
        break;
    }

    this.unmountChildren(safely);
    ReactDOMComponentTree_1.uncacheNode(this);
    EventPluginHub_1.deleteAllListeners(this);
    this._rootNodeID = 0;
    this._domID = 0;
    this._wrapperState = null;

    
  },
  getPublicInstance: function getPublicInstance() {
    return getNode(this);
  }
};

objectAssign(ReactDOMComponent.prototype, ReactDOMComponent.Mixin, ReactMultiChild_1.Mixin);

var ReactDOMComponent_1 = ReactDOMComponent;

var ReactDOMEmptyComponent = function ReactDOMEmptyComponent(instantiate) {
  // ReactCompositeComponent uses this:
  this._currentElement = null; // ReactDOMComponentTree uses these:

  this._hostNode = null;
  this._hostParent = null;
  this._hostContainerInfo = null;
  this._domID = 0;
};

ReactDOMEmptyComponent._r = [2];

objectAssign(ReactDOMEmptyComponent.prototype, {
  mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
    var domID = hostContainerInfo._idCounter++;
    this._domID = domID;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;
    var nodeValue = ' react-empty: ' + this._domID + ' ';

    if (transaction.useCreateElement) {
      var ownerDocument = hostContainerInfo._ownerDocument;
      var node = ownerDocument.createComment(nodeValue);
      ReactDOMComponentTree_1.precacheNode(this, node);
      return DOMLazyTree_1(node);
    } else {
      if (transaction.renderToStaticMarkup) {
        // Normally we'd insert a comment node, but since this is a situation
        // where React won't take over (static pages), we can simply return
        // nothing.
        return '';
      }

      return '<!--' + nodeValue + '-->';
    }
  },
  receiveComponent: function receiveComponent() {},
  getHostNode: function getHostNode() {
    return ReactDOMComponentTree_1.getNodeFromInstance(this);
  },
  unmountComponent: function unmountComponent() {
    ReactDOMComponentTree_1.uncacheNode(this);
  }
});

var ReactDOMEmptyComponent_1 = ReactDOMEmptyComponent;

/**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */


function getLowestCommonAncestor(instA, instB) {
  !('_hostNode' in instA) ? reactProdInvariant_1$2('33') : void 0;
  !('_hostNode' in instB) ? reactProdInvariant_1$2('33') : void 0;
  var depthA = 0;

  for (var tempA = instA; tempA; tempA = tempA._hostParent) {
    depthA++;
  }

  var depthB = 0;

  for (var tempB = instB; tempB; tempB = tempB._hostParent) {
    depthB++;
  } // If A is deeper, crawl up.


  while (depthA - depthB > 0) {
    instA = instA._hostParent;
    depthA--;
  } // If B is deeper, crawl up.


  while (depthB - depthA > 0) {
    instB = instB._hostParent;
    depthB--;
  } // Walk in lockstep until we find a match.


  var depth = depthA;

  while (depth--) {
    if (instA === instB) {
      return instA;
    }

    instA = instA._hostParent;
    instB = instB._hostParent;
  }

  return null;
}
/**
 * Return if A is an ancestor of B.
 */


getLowestCommonAncestor._r = [2];

function isAncestor(instA, instB) {
  !('_hostNode' in instA) ? reactProdInvariant_1$2('35') : void 0;
  !('_hostNode' in instB) ? reactProdInvariant_1$2('35') : void 0;

  while (instB) {
    if (instB === instA) {
      return true;
    }

    instB = instB._hostParent;
  }

  return false;
}
/**
 * Return the parent instance of the passed-in instance.
 */


isAncestor._r = [2];

function getParentInstance(inst) {
  !('_hostNode' in inst) ? reactProdInvariant_1$2('36') : void 0;
  return inst._hostParent;
}
/**
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */


getParentInstance._r = [2];

function traverseTwoPhase(inst, fn, arg) {
  var path = [];

  while (inst) {
    path.push(inst);
    inst = inst._hostParent;
  }

  var i;

  for (i = path.length; i-- > 0;) {
    fn(path[i], 'captured', arg);
  }

  for (i = 0; i < path.length; i++) {
    fn(path[i], 'bubbled', arg);
  }
}
/**
 * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
 * should would receive a `mouseEnter` or `mouseLeave` event.
 *
 * Does not invoke the callback on the nearest common ancestor because nothing
 * "entered" or "left" that element.
 */


traverseTwoPhase._r = [2];

function traverseEnterLeave(from, to, fn, argFrom, argTo) {
  var common = from && to ? getLowestCommonAncestor(from, to) : null;
  var pathFrom = [];

  while (from && from !== common) {
    pathFrom.push(from);
    from = from._hostParent;
  }

  var pathTo = [];

  while (to && to !== common) {
    pathTo.push(to);
    to = to._hostParent;
  }

  var i;

  for (i = 0; i < pathFrom.length; i++) {
    fn(pathFrom[i], 'bubbled', argFrom);
  }

  for (i = pathTo.length; i-- > 0;) {
    fn(pathTo[i], 'captured', argTo);
  }
}

traverseEnterLeave._r = [2];
var ReactDOMTreeTraversal = {
  isAncestor: isAncestor,
  getLowestCommonAncestor: getLowestCommonAncestor,
  getParentInstance: getParentInstance,
  traverseTwoPhase: traverseTwoPhase,
  traverseEnterLeave: traverseEnterLeave
};

/**
 * Text nodes violate a couple assumptions that React makes about components:
 *
 *  - When mounting text into the DOM, adjacent text nodes are merged.
 *  - Text nodes cannot be assigned a React root ID.
 *
 * This component is used to wrap strings between comment nodes so that they
 * can undergo the same reconciliation that is applied to elements.
 *
 * TODO: Investigate representing React components in the DOM with text nodes.
 *
 * @class ReactDOMTextComponent
 * @extends ReactComponent
 * @internal
 */


var ReactDOMTextComponent = function ReactDOMTextComponent(text) {
  // TODO: This is really a ReactText (ReactNode), not a ReactElement
  this._currentElement = text;
  this._stringText = '' + text; // ReactDOMComponentTree uses these:

  this._hostNode = null;
  this._hostParent = null; // Properties

  this._domID = 0;
  this._mountIndex = 0;
  this._closingComment = null;
  this._commentNodes = null;
};

ReactDOMTextComponent._r = [2];

objectAssign(ReactDOMTextComponent.prototype, {
  /**
   * Creates the markup for this text node. This node is not intended to have
   * any features besides containing text content.
   *
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Markup for this text node.
   * @internal
   */
  mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
    var domID = hostContainerInfo._idCounter++;
    var openingValue = ' react-text: ' + domID + ' ';
    var closingValue = ' /react-text ';
    this._domID = domID;
    this._hostParent = hostParent;

    if (transaction.useCreateElement) {
      var ownerDocument = hostContainerInfo._ownerDocument;
      var openingComment = ownerDocument.createComment(openingValue);
      var closingComment = ownerDocument.createComment(closingValue);
      var lazyTree = DOMLazyTree_1(ownerDocument.createDocumentFragment());
      DOMLazyTree_1.queueChild(lazyTree, DOMLazyTree_1(openingComment));

      if (this._stringText) {
        DOMLazyTree_1.queueChild(lazyTree, DOMLazyTree_1(ownerDocument.createTextNode(this._stringText)));
      }

      DOMLazyTree_1.queueChild(lazyTree, DOMLazyTree_1(closingComment));
      ReactDOMComponentTree_1.precacheNode(this, openingComment);
      this._closingComment = closingComment;
      return lazyTree;
    } else {
      var escapedText = escapeTextContentForBrowser_1(this._stringText);

      if (transaction.renderToStaticMarkup) {
        // Normally we'd wrap this between comment nodes for the reasons stated
        // above, but since this is a situation where React won't take over
        // (static pages), we can simply return the text as it is.
        return escapedText;
      }

      return '<!--' + openingValue + '-->' + escapedText + '<!--' + closingValue + '-->';
    }
  },

  /**
   * Updates this component by updating the text content.
   *
   * @param {ReactText} nextText The next text content
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  receiveComponent: function receiveComponent(nextText, transaction) {
    if (nextText !== this._currentElement) {
      this._currentElement = nextText;
      var nextStringText = '' + nextText;

      if (nextStringText !== this._stringText) {
        // TODO: Save this as pending props and use performUpdateIfNecessary
        // and/or updateComponent to do the actual update for consistency with
        // other component types?
        this._stringText = nextStringText;
        var commentNodes = this.getHostNode();
        DOMChildrenOperations_1.replaceDelimitedText(commentNodes[0], commentNodes[1], nextStringText);
      }
    }
  },
  getHostNode: function getHostNode() {
    var hostNode = this._commentNodes;

    if (hostNode) {
      return hostNode;
    }

    if (!this._closingComment) {
      var openingComment = ReactDOMComponentTree_1.getNodeFromInstance(this);
      var node = openingComment.nextSibling;

      while (true) {
        !(node != null) ? reactProdInvariant_1$2('67', this._domID) : void 0;

        if (node.nodeType === 8 && node.nodeValue === ' /react-text ') {
          this._closingComment = node;
          break;
        }

        node = node.nextSibling;
      }
    }

    hostNode = [this._hostNode, this._closingComment];
    this._commentNodes = hostNode;
    return hostNode;
  },
  unmountComponent: function unmountComponent() {
    this._closingComment = null;
    this._commentNodes = null;
    ReactDOMComponentTree_1.uncacheNode(this);
  }
});

var ReactDOMTextComponent_1 = ReactDOMTextComponent;

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction_1,
  close: function close() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};
var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction_1,
  close: ReactUpdates_1.flushBatchedUpdates.bind(ReactUpdates_1)
};
var TRANSACTION_WRAPPERS$2 = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

ReactDefaultBatchingStrategyTransaction._r = [2];

objectAssign(ReactDefaultBatchingStrategyTransaction.prototype, Transaction, {
  getTransactionWrappers: function getTransactionWrappers() {
    return TRANSACTION_WRAPPERS$2;
  }
});

var transaction = new ReactDefaultBatchingStrategyTransaction();
var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function batchedUpdates(callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
    ReactDefaultBatchingStrategy.isBatchingUpdates = true; // The code is written this way to avoid extra allocations

    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  }
};
var ReactDefaultBatchingStrategy_1 = ReactDefaultBatchingStrategy;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */


var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function capture(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    } else {
      return {
        remove: emptyFunction_1
      };
    }
  },
  registerDefault: function registerDefault() {}
};
var EventListener_1 = EventListener;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */
/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are unbounded, unlike `getScrollPosition`. This means they
 * may be negative or exceed the element boundaries (which is possible using
 * inertial scrolling).
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */

function getUnboundedScrollPosition(scrollable) {
  if (scrollable.Window && scrollable instanceof scrollable.Window) {
    return {
      x: scrollable.pageXOffset || scrollable.document.documentElement.scrollLeft,
      y: scrollable.pageYOffset || scrollable.document.documentElement.scrollTop
    };
  }

  return {
    x: scrollable.scrollLeft,
    y: scrollable.scrollTop
  };
}

getUnboundedScrollPosition._r = [2];
var getUnboundedScrollPosition_1 = getUnboundedScrollPosition;

/**
 * Find the deepest React component completely containing the root of the
 * passed-in instance (for use when entire React trees are nested within each
 * other). If React trees are not nested, returns null.
 */


function findParent(inst) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  while (inst._hostParent) {
    inst = inst._hostParent;
  }

  var rootNode = ReactDOMComponentTree_1.getNodeFromInstance(inst);
  var container = rootNode.parentNode;
  return ReactDOMComponentTree_1.getClosestInstanceFromNode(container);
} // Used to store ancestor hierarchy in top level callback


findParent._r = [2];

function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
  this.topLevelType = topLevelType;
  this.nativeEvent = nativeEvent;
  this.ancestors = [];
}

TopLevelCallbackBookKeeping._r = [2];

objectAssign(TopLevelCallbackBookKeeping.prototype, {
  destructor: function destructor() {
    this.topLevelType = null;
    this.nativeEvent = null;
    this.ancestors.length = 0;
  }
});

PooledClass_1$2.addPoolingTo(TopLevelCallbackBookKeeping, PooledClass_1$2.twoArgumentPooler);

function handleTopLevelImpl(bookKeeping) {
  var nativeEventTarget = getEventTarget_1(bookKeeping.nativeEvent);
  var targetInst = ReactDOMComponentTree_1.getClosestInstanceFromNode(nativeEventTarget); // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.

  var ancestor = targetInst;

  do {
    bookKeeping.ancestors.push(ancestor);
    ancestor = ancestor && findParent(ancestor);
  } while (ancestor);

  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];

    ReactEventListener._handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget_1(bookKeeping.nativeEvent));
  }
}

handleTopLevelImpl._r = [2];

function scrollValueMonitor(cb) {
  var scrollPosition = getUnboundedScrollPosition_1(window);
  cb(scrollPosition);
}

scrollValueMonitor._r = [2];
var ReactEventListener = {
  _enabled: true,
  _handleTopLevel: null,
  WINDOW_HANDLE: ExecutionEnvironment_1.canUseDOM ? window : null,
  setHandleTopLevel: function setHandleTopLevel(handleTopLevel) {
    ReactEventListener._handleTopLevel = handleTopLevel;
  },
  setEnabled: function setEnabled(enabled) {
    ReactEventListener._enabled = !!enabled;
  },
  isEnabled: function isEnabled() {
    return ReactEventListener._enabled;
  },

  /**
   * Traps top-level events by using event bubbling.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} element Element on which to attach listener.
   * @return {?object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapBubbledEvent: function trapBubbledEvent(topLevelType, handlerBaseName, element) {
    if (!element) {
      return null;
    }

    return EventListener_1.listen(element, handlerBaseName, ReactEventListener.dispatchEvent.bind(null, topLevelType));
  },

  /**
   * Traps a top-level event by using event capturing.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} element Element on which to attach listener.
   * @return {?object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapCapturedEvent: function trapCapturedEvent(topLevelType, handlerBaseName, element) {
    if (!element) {
      return null;
    }

    return EventListener_1.capture(element, handlerBaseName, ReactEventListener.dispatchEvent.bind(null, topLevelType));
  },
  monitorScrollValue: function monitorScrollValue(refresh) {
    var callback = scrollValueMonitor.bind(null, refresh);
    EventListener_1.listen(window, 'scroll', callback);
  },
  dispatchEvent: function dispatchEvent(topLevelType, nativeEvent) {
    if (!ReactEventListener._enabled) {
      return;
    }

    var bookKeeping = TopLevelCallbackBookKeeping.getPooled(topLevelType, nativeEvent);

    try {
      // Event queue being processed in the same cycle allows
      // `preventDefault`.
      ReactUpdates_1.batchedUpdates(handleTopLevelImpl, bookKeeping);
    } finally {
      TopLevelCallbackBookKeeping.release(bookKeeping);
    }
  }
};
var ReactEventListener_1 = ReactEventListener;

var ReactInjection = {
  Component: ReactComponentEnvironment_1.injection,
  DOMProperty: DOMProperty_1.injection,
  EmptyComponent: ReactEmptyComponent_1.injection,
  EventPluginHub: EventPluginHub_1.injection,
  EventPluginUtils: EventPluginUtils_1.injection,
  EventEmitter: ReactBrowserEventEmitter_1.injection,
  HostComponent: ReactHostComponent_1.injection,
  Updates: ReactUpdates_1.injection
};
var ReactInjection_1 = ReactInjection;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */

function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }

  return node;
}
/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */


getLeafNode._r = [2];

function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }

    node = node.parentNode;
  }
}
/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */


getSiblingNode._r = [2];

function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType === 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

getNodeForCharacterOffset._r = [2];
var getNodeForCharacterOffset_1 = getNodeForCharacterOffset;

/**
 * While `isCollapsed` is available on the Selection object and `collapsed`
 * is available on the Range object, IE11 sometimes gets them wrong.
 * If the anchor/focus nodes and offsets are the same, the range is collapsed.
 */


function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
  return anchorNode === focusNode && anchorOffset === focusOffset;
}
/**
 * Get the appropriate anchor and focus node/offset pairs for IE.
 *
 * The catch here is that IE's selection API doesn't provide information
 * about whether the selection is forward or backward, so we have to
 * behave as though it's always forward.
 *
 * IE text differs from modern selection in that it behaves as though
 * block elements end with a new line. This means character offsets will
 * differ between the two APIs.
 *
 * @param {DOMElement} node
 * @return {object}
 */


isCollapsed._r = [2];

function getIEOffsets(node) {
  var selection = document.selection;
  var selectedRange = selection.createRange();
  var selectedLength = selectedRange.text.length; // Duplicate selection so we can move range without breaking user selection.

  var fromStart = selectedRange.duplicate();
  fromStart.moveToElementText(node);
  fromStart.setEndPoint('EndToStart', selectedRange);
  var startOffset = fromStart.text.length;
  var endOffset = startOffset + selectedLength;
  return {
    start: startOffset,
    end: endOffset
  };
}
/**
 * @param {DOMElement} node
 * @return {?object}
 */


getIEOffsets._r = [2];

function getModernOffsets(node) {
  var selection = window.getSelection && window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode;
  var anchorOffset = selection.anchorOffset;
  var focusNode = selection.focusNode;
  var focusOffset = selection.focusOffset;
  var currentRange = selection.getRangeAt(0); // In Firefox, range.startContainer and range.endContainer can be "anonymous
  // divs", e.g. the up/down buttons on an <input type="number">. Anonymous
  // divs do not seem to expose properties, triggering a "Permission denied
  // error" if any of its properties are accessed. The only seemingly possible
  // way to avoid erroring is to access a property that typically works for
  // non-anonymous divs and catch any error that may otherwise arise. See
  // https://bugzilla.mozilla.org/show_bug.cgi?id=208427

  try {
    /* eslint-disable no-unused-expressions */
    currentRange.startContainer.nodeType;
    currentRange.endContainer.nodeType;
    /* eslint-enable no-unused-expressions */
  } catch (e) {
    return null;
  } // If the node and offset values are the same, the selection is collapsed.
  // `Selection.isCollapsed` is available natively, but IE sometimes gets
  // this value wrong.


  var isSelectionCollapsed = isCollapsed(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
  var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;
  var tempRange = currentRange.cloneRange();
  tempRange.selectNodeContents(node);
  tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);
  var isTempRangeCollapsed = isCollapsed(tempRange.startContainer, tempRange.startOffset, tempRange.endContainer, tempRange.endOffset);
  var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
  var end = start + rangeLength; // Detect whether the selection is backward.

  var detectionRange = document.createRange();
  detectionRange.setStart(anchorNode, anchorOffset);
  detectionRange.setEnd(focusNode, focusOffset);
  var isBackward = detectionRange.collapsed;
  return {
    start: isBackward ? end : start,
    end: isBackward ? start : end
  };
}
/**
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */


getModernOffsets._r = [2];

function setIEOffsets(node, offsets) {
  var range = document.selection.createRange().duplicate();
  var start, end;

  if (offsets.end === undefined) {
    start = offsets.start;
    end = start;
  } else if (offsets.start > offsets.end) {
    start = offsets.end;
    end = offsets.start;
  } else {
    start = offsets.start;
    end = offsets.end;
  }

  range.moveToElementText(node);
  range.moveStart('character', start);
  range.setEndPoint('EndToStart', range);
  range.moveEnd('character', end - start);
  range.select();
}
/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programmatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */


setIEOffsets._r = [2];

function setModernOffsets(node, offsets) {
  if (!window.getSelection) {
    return;
  }

  var selection = window.getSelection();
  var length = node[getTextContentAccessor_1()].length;
  var start = Math.min(offsets.start, length);
  var end = offsets.end === undefined ? start : Math.min(offsets.end, length); // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.

  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset_1(node, start);
  var endMarker = getNodeForCharacterOffset_1(node, end);

  if (startMarker && endMarker) {
    var range = document.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}

setModernOffsets._r = [2];
var useIEOffsets = ExecutionEnvironment_1.canUseDOM && 'selection' in document && !('getSelection' in window);
var ReactDOMSelection = {
  /**
   * @param {DOMElement} node
   */
  getOffsets: useIEOffsets ? getIEOffsets : getModernOffsets,

  /**
   * @param {DOMElement|DOMTextNode} node
   * @param {object} offsets
   */
  setOffsets: useIEOffsets ? setIEOffsets : setModernOffsets
};
var ReactDOMSelection_1 = ReactDOMSelection;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */

function isNode(object) {
  var doc = object ? object.ownerDocument || object : document;
  var defaultView = doc.defaultView || window;
  return !!(object && (typeof defaultView.Node === 'function' ? object instanceof defaultView.Node : _typeof$2(object) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
}

isNode._r = [2];
var isNode_1 = isNode;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */


function isTextNode(object) {
  return isNode_1(object) && object.nodeType == 3;
}

isTextNode._r = [2];
var isTextNode_1 = isTextNode;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

/*eslint-disable no-bitwise */

/**
 * Checks if a given DOM node contains or is another DOM node.
 */


function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode_1(outerNode)) {
    return false;
  } else if (isTextNode_1(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ('contains' in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

containsNode._r = [2];
var containsNode_1 = containsNode;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/* eslint-disable fb-www/typeof-undefined */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?DOMDocument} doc Defaults to current document.
 * @return {?DOMElement}
 */

function getActiveElement(doc)
/*?DOMElement*/
{
  doc = doc || (typeof document !== 'undefined' ? document : undefined);

  if (typeof doc === 'undefined') {
    return null;
  }

  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}

getActiveElement._r = [2];
var getActiveElement_1 = getActiveElement;

function isInDocument(node) {
  return containsNode_1(document.documentElement, node);
}
/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */


isInDocument._r = [2];
var ReactInputSelection = {
  hasSelectionCapabilities: function hasSelectionCapabilities(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
  },
  getSelectionInformation: function getSelectionInformation() {
    var focusedElem = getActiveElement_1();
    return {
      focusedElem: focusedElem,
      selectionRange: ReactInputSelection.hasSelectionCapabilities(focusedElem) ? ReactInputSelection.getSelection(focusedElem) : null
    };
  },

  /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */
  restoreSelection: function restoreSelection(priorSelectionInformation) {
    var curFocusedElem = getActiveElement_1();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;

    if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
      if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
        ReactInputSelection.setSelection(priorFocusedElem, priorSelectionRange);
      }

      focusNode_1(priorFocusedElem);
    }
  },

  /**
   * @getSelection: Gets the selection bounds of a focused textarea, input or
   * contentEditable node.
   * -@input: Look up selection bounds of this input
   * -@return {start: selectionStart, end: selectionEnd}
   */
  getSelection: function getSelection(input) {
    var selection;

    if ('selectionStart' in input) {
      // Modern browser with input or textarea.
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      // IE8 input.
      var range = document.selection.createRange(); // There can only be one selection per document in IE, so it must
      // be in our element.

      if (range.parentElement() === input) {
        selection = {
          start: -range.moveStart('character', -input.value.length),
          end: -range.moveEnd('character', -input.value.length)
        };
      }
    } else {
      // Content editable or old IE textarea.
      selection = ReactDOMSelection_1.getOffsets(input);
    }

    return selection || {
      start: 0,
      end: 0
    };
  },

  /**
   * @setSelection: Sets the selection bounds of a textarea or input and focuses
   * the input.
   * -@input     Set selection bounds of this input or textarea
   * -@offsets   Object of same form that is returned from get*
   */
  setSelection: function setSelection(input, offsets) {
    var start = offsets.start;
    var end = offsets.end;

    if (end === undefined) {
      end = start;
    }

    if ('selectionStart' in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveStart('character', start);
      range.moveEnd('character', end - start);
      range.select();
    } else {
      ReactDOMSelection_1.setOffsets(input, offsets);
    }
  }
};
var ReactInputSelection_1 = ReactInputSelection;

/**
 * Ensures that, when possible, the selection range (currently selected text
 * input) is not disturbed by performing the transaction.
 */


var SELECTION_RESTORATION = {
  /**
   * @return {Selection} Selection information.
   */
  initialize: ReactInputSelection_1.getSelectionInformation,

  /**
   * @param {Selection} sel Selection information returned from `initialize`.
   */
  close: ReactInputSelection_1.restoreSelection
};
/**
 * Suppresses events (blur/focus) that could be inadvertently dispatched due to
 * high level DOM manipulations (like temporarily removing a text input from the
 * DOM).
 */

var EVENT_SUPPRESSION = {
  /**
   * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
   * the reconciliation.
   */
  initialize: function initialize() {
    var currentlyEnabled = ReactBrowserEventEmitter_1.isEnabled();
    ReactBrowserEventEmitter_1.setEnabled(false);
    return currentlyEnabled;
  },

  /**
   * @param {boolean} previouslyEnabled Enabled status of
   *   `ReactBrowserEventEmitter` before the reconciliation occurred. `close`
   *   restores the previous value.
   */
  close: function close(previouslyEnabled) {
    ReactBrowserEventEmitter_1.setEnabled(previouslyEnabled);
  }
};
/**
 * Provides a queue for collecting `componentDidMount` and
 * `componentDidUpdate` callbacks during the transaction.
 */

var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function initialize() {
    this.reactMountReady.reset();
  },

  /**
   * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
   */
  close: function close() {
    this.reactMountReady.notifyAll();
  }
};
/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */

var TRANSACTION_WRAPPERS$3 = [SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING];

/**
 * Currently:
 * - The order that these are listed in the transaction is critical:
 * - Suppresses events.
 * - Restores selection range.
 *
 * Future:
 * - Restore document/overflow scroll positions that were unintentionally
 *   modified via DOM insertions above the top viewport boundary.
 * - Implement/integrate with customized constraint based layout system and keep
 *   track of which dimensions must be remeasured.
 *
 * @class ReactReconcileTransaction
 */


function ReactReconcileTransaction(useCreateElement) {
  this.reinitializeTransaction(); // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactDOMTextComponent` checks it in `mountComponent`.`

  this.renderToStaticMarkup = false;
  this.reactMountReady = CallbackQueue_1.getPooled(null);
  this.useCreateElement = useCreateElement;
}

ReactReconcileTransaction._r = [2];
var Mixin$1 = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap procedures.
   *   TODO: convert to array<TransactionWrapper>
   */
  getTransactionWrappers: function getTransactionWrappers() {
    return TRANSACTION_WRAPPERS$3;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function getReactMountReady() {
    return this.reactMountReady;
  },

  /**
   * @return {object} The queue to collect React async events.
   */
  getUpdateQueue: function getUpdateQueue() {
    return ReactUpdateQueue_1;
  },

  /**
   * Save current transaction state -- if the return value from this method is
   * passed to `rollback`, the transaction will be reset to that state.
   */
  checkpoint: function checkpoint() {
    // reactMountReady is the our only stateful wrapper
    return this.reactMountReady.checkpoint();
  },
  rollback: function rollback(checkpoint) {
    this.reactMountReady.rollback(checkpoint);
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be reused.
   */
  destructor: function destructor() {
    CallbackQueue_1.release(this.reactMountReady);
    this.reactMountReady = null;
  }
};

objectAssign(ReactReconcileTransaction.prototype, Transaction, Mixin$1);

PooledClass_1$2.addPoolingTo(ReactReconcileTransaction);
var ReactReconcileTransaction_1 = ReactReconcileTransaction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var NS = {
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace'
}; // We use attributes for everything SVG so let's avoid some duplication and run
// code instead.
// The following are all specified in the HTML config already so we exclude here.
// - class (as className)
// - color
// - height
// - id
// - lang
// - max
// - media
// - method
// - min
// - name
// - style
// - target
// - type
// - width

var ATTRS = {
  accentHeight: 'accent-height',
  accumulate: 0,
  additive: 0,
  alignmentBaseline: 'alignment-baseline',
  allowReorder: 'allowReorder',
  alphabetic: 0,
  amplitude: 0,
  arabicForm: 'arabic-form',
  ascent: 0,
  attributeName: 'attributeName',
  attributeType: 'attributeType',
  autoReverse: 'autoReverse',
  azimuth: 0,
  baseFrequency: 'baseFrequency',
  baseProfile: 'baseProfile',
  baselineShift: 'baseline-shift',
  bbox: 0,
  begin: 0,
  bias: 0,
  by: 0,
  calcMode: 'calcMode',
  capHeight: 'cap-height',
  clip: 0,
  clipPath: 'clip-path',
  clipRule: 'clip-rule',
  clipPathUnits: 'clipPathUnits',
  colorInterpolation: 'color-interpolation',
  colorInterpolationFilters: 'color-interpolation-filters',
  colorProfile: 'color-profile',
  colorRendering: 'color-rendering',
  contentScriptType: 'contentScriptType',
  contentStyleType: 'contentStyleType',
  cursor: 0,
  cx: 0,
  cy: 0,
  d: 0,
  decelerate: 0,
  descent: 0,
  diffuseConstant: 'diffuseConstant',
  direction: 0,
  display: 0,
  divisor: 0,
  dominantBaseline: 'dominant-baseline',
  dur: 0,
  dx: 0,
  dy: 0,
  edgeMode: 'edgeMode',
  elevation: 0,
  enableBackground: 'enable-background',
  end: 0,
  exponent: 0,
  externalResourcesRequired: 'externalResourcesRequired',
  fill: 0,
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  filter: 0,
  filterRes: 'filterRes',
  filterUnits: 'filterUnits',
  floodColor: 'flood-color',
  floodOpacity: 'flood-opacity',
  focusable: 0,
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontSizeAdjust: 'font-size-adjust',
  fontStretch: 'font-stretch',
  fontStyle: 'font-style',
  fontVariant: 'font-variant',
  fontWeight: 'font-weight',
  format: 0,
  from: 0,
  fx: 0,
  fy: 0,
  g1: 0,
  g2: 0,
  glyphName: 'glyph-name',
  glyphOrientationHorizontal: 'glyph-orientation-horizontal',
  glyphOrientationVertical: 'glyph-orientation-vertical',
  glyphRef: 'glyphRef',
  gradientTransform: 'gradientTransform',
  gradientUnits: 'gradientUnits',
  hanging: 0,
  horizAdvX: 'horiz-adv-x',
  horizOriginX: 'horiz-origin-x',
  ideographic: 0,
  imageRendering: 'image-rendering',
  'in': 0,
  in2: 0,
  intercept: 0,
  k: 0,
  k1: 0,
  k2: 0,
  k3: 0,
  k4: 0,
  kernelMatrix: 'kernelMatrix',
  kernelUnitLength: 'kernelUnitLength',
  kerning: 0,
  keyPoints: 'keyPoints',
  keySplines: 'keySplines',
  keyTimes: 'keyTimes',
  lengthAdjust: 'lengthAdjust',
  letterSpacing: 'letter-spacing',
  lightingColor: 'lighting-color',
  limitingConeAngle: 'limitingConeAngle',
  local: 0,
  markerEnd: 'marker-end',
  markerMid: 'marker-mid',
  markerStart: 'marker-start',
  markerHeight: 'markerHeight',
  markerUnits: 'markerUnits',
  markerWidth: 'markerWidth',
  mask: 0,
  maskContentUnits: 'maskContentUnits',
  maskUnits: 'maskUnits',
  mathematical: 0,
  mode: 0,
  numOctaves: 'numOctaves',
  offset: 0,
  opacity: 0,
  operator: 0,
  order: 0,
  orient: 0,
  orientation: 0,
  origin: 0,
  overflow: 0,
  overlinePosition: 'overline-position',
  overlineThickness: 'overline-thickness',
  paintOrder: 'paint-order',
  panose1: 'panose-1',
  pathLength: 'pathLength',
  patternContentUnits: 'patternContentUnits',
  patternTransform: 'patternTransform',
  patternUnits: 'patternUnits',
  pointerEvents: 'pointer-events',
  points: 0,
  pointsAtX: 'pointsAtX',
  pointsAtY: 'pointsAtY',
  pointsAtZ: 'pointsAtZ',
  preserveAlpha: 'preserveAlpha',
  preserveAspectRatio: 'preserveAspectRatio',
  primitiveUnits: 'primitiveUnits',
  r: 0,
  radius: 0,
  refX: 'refX',
  refY: 'refY',
  renderingIntent: 'rendering-intent',
  repeatCount: 'repeatCount',
  repeatDur: 'repeatDur',
  requiredExtensions: 'requiredExtensions',
  requiredFeatures: 'requiredFeatures',
  restart: 0,
  result: 0,
  rotate: 0,
  rx: 0,
  ry: 0,
  scale: 0,
  seed: 0,
  shapeRendering: 'shape-rendering',
  slope: 0,
  spacing: 0,
  specularConstant: 'specularConstant',
  specularExponent: 'specularExponent',
  speed: 0,
  spreadMethod: 'spreadMethod',
  startOffset: 'startOffset',
  stdDeviation: 'stdDeviation',
  stemh: 0,
  stemv: 0,
  stitchTiles: 'stitchTiles',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  strikethroughPosition: 'strikethrough-position',
  strikethroughThickness: 'strikethrough-thickness',
  string: 0,
  stroke: 0,
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  surfaceScale: 'surfaceScale',
  systemLanguage: 'systemLanguage',
  tableValues: 'tableValues',
  targetX: 'targetX',
  targetY: 'targetY',
  textAnchor: 'text-anchor',
  textDecoration: 'text-decoration',
  textRendering: 'text-rendering',
  textLength: 'textLength',
  to: 0,
  transform: 0,
  u1: 0,
  u2: 0,
  underlinePosition: 'underline-position',
  underlineThickness: 'underline-thickness',
  unicode: 0,
  unicodeBidi: 'unicode-bidi',
  unicodeRange: 'unicode-range',
  unitsPerEm: 'units-per-em',
  vAlphabetic: 'v-alphabetic',
  vHanging: 'v-hanging',
  vIdeographic: 'v-ideographic',
  vMathematical: 'v-mathematical',
  values: 0,
  vectorEffect: 'vector-effect',
  version: 0,
  vertAdvY: 'vert-adv-y',
  vertOriginX: 'vert-origin-x',
  vertOriginY: 'vert-origin-y',
  viewBox: 'viewBox',
  viewTarget: 'viewTarget',
  visibility: 0,
  widths: 0,
  wordSpacing: 'word-spacing',
  writingMode: 'writing-mode',
  x: 0,
  xHeight: 'x-height',
  x1: 0,
  x2: 0,
  xChannelSelector: 'xChannelSelector',
  xlinkActuate: 'xlink:actuate',
  xlinkArcrole: 'xlink:arcrole',
  xlinkHref: 'xlink:href',
  xlinkRole: 'xlink:role',
  xlinkShow: 'xlink:show',
  xlinkTitle: 'xlink:title',
  xlinkType: 'xlink:type',
  xmlBase: 'xml:base',
  xmlns: 0,
  xmlnsXlink: 'xmlns:xlink',
  xmlLang: 'xml:lang',
  xmlSpace: 'xml:space',
  y: 0,
  y1: 0,
  y2: 0,
  yChannelSelector: 'yChannelSelector',
  z: 0,
  zoomAndPan: 'zoomAndPan'
};
var SVGDOMPropertyConfig = {
  Properties: {},
  DOMAttributeNamespaces: {
    xlinkActuate: NS.xlink,
    xlinkArcrole: NS.xlink,
    xlinkHref: NS.xlink,
    xlinkRole: NS.xlink,
    xlinkShow: NS.xlink,
    xlinkTitle: NS.xlink,
    xlinkType: NS.xlink,
    xmlBase: NS.xml,
    xmlLang: NS.xml,
    xmlSpace: NS.xml
  },
  DOMAttributeNames: {}
};
Object.keys(ATTRS).forEach(function (key) {
  SVGDOMPropertyConfig.Properties[key] = 0;

  if (ATTRS[key]) {
    SVGDOMPropertyConfig.DOMAttributeNames[key] = ATTRS[key];
  }
});
var SVGDOMPropertyConfig_1 = SVGDOMPropertyConfig;

var skipSelectionChangeEvent = ExecutionEnvironment_1.canUseDOM && 'documentMode' in document && document.documentMode <= 11;
var eventTypes$3 = {
  select: {
    phasedRegistrationNames: {
      bubbled: 'onSelect',
      captured: 'onSelectCapture'
    },
    dependencies: ['topBlur', 'topContextMenu', 'topFocus', 'topKeyDown', 'topKeyUp', 'topMouseDown', 'topMouseUp', 'topSelectionChange']
  }
};
var activeElement$1 = null;
var activeElementInst$1 = null;
var lastSelection = null;
var mouseDown = false; // Track whether a listener exists for this plugin. If none exist, we do
// not extract events. See #3639.

var hasListener = false;
/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @return {object}
 */

function getSelection(node) {
  if ('selectionStart' in node && ReactInputSelection_1.hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (window.getSelection) {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  } else if (document.selection) {
    var range = document.selection.createRange();
    return {
      parentElement: range.parentElement(),
      text: range.text,
      top: range.boundingTop,
      left: range.boundingLeft
    };
  }
}
/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */


getSelection._r = [2];

function constructSelectEvent(nativeEvent, nativeEventTarget) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement_1()) {
    return null;
  } // Only fire when selection has actually changed.


  var currentSelection = getSelection(activeElement$1);

  if (!lastSelection || !shallowEqual_1(lastSelection, currentSelection)) {
    lastSelection = currentSelection;
    var syntheticEvent = SyntheticEvent_1.getPooled(eventTypes$3.select, activeElementInst$1, nativeEvent, nativeEventTarget);
    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement$1;
    EventPropagators_1.accumulateTwoPhaseDispatches(syntheticEvent);
    return syntheticEvent;
  }

  return null;
}
/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */


constructSelectEvent._r = [2];
var SelectEventPlugin = {
  eventTypes: eventTypes$3,
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    if (!hasListener) {
      return null;
    }

    var targetNode = targetInst ? ReactDOMComponentTree_1.getNodeFromInstance(targetInst) : window;

    switch (topLevelType) {
      // Track the input node that has focus.
      case 'topFocus':
        if (isTextInputElement_1(targetNode) || targetNode.contentEditable === 'true') {
          activeElement$1 = targetNode;
          activeElementInst$1 = targetInst;
          lastSelection = null;
        }

        break;

      case 'topBlur':
        activeElement$1 = null;
        activeElementInst$1 = null;
        lastSelection = null;
        break;
      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.

      case 'topMouseDown':
        mouseDown = true;
        break;

      case 'topContextMenu':
      case 'topMouseUp':
        mouseDown = false;
        return constructSelectEvent(nativeEvent, nativeEventTarget);
      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't). IE's event fires out of order with respect
      // to key and input events on deletion, so we discard it.
      //
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      // This is also our approach for IE handling, for the reason above.

      case 'topSelectionChange':
        if (skipSelectionChangeEvent) {
          break;
        }

      // falls through

      case 'topKeyDown':
      case 'topKeyUp':
        return constructSelectEvent(nativeEvent, nativeEventTarget);
    }

    return null;
  },
  didPutListener: function didPutListener(inst, registrationName, listener) {
    if (registrationName === 'onSelect') {
      hasListener = true;
    }
  }
};
var SelectEventPlugin_1 = SelectEventPlugin;

/**
 * @interface Event
 * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
 */


var AnimationEventInterface = {
  animationName: null,
  elapsedTime: null,
  pseudoElement: null
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */

function SyntheticAnimationEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticAnimationEvent._r = [2];
SyntheticEvent_1.augmentClass(SyntheticAnimationEvent, AnimationEventInterface);
var SyntheticAnimationEvent_1 = SyntheticAnimationEvent;

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */


var ClipboardEventInterface = {
  clipboardData: function clipboardData(event) {
    return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
  }
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticClipboardEvent._r = [2];
SyntheticEvent_1.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);
var SyntheticClipboardEvent_1 = SyntheticClipboardEvent;

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */


var FocusEventInterface = {
  relatedTarget: null
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticFocusEvent._r = [2];
SyntheticUIEvent_1.augmentClass(SyntheticFocusEvent, FocusEventInterface);
var SyntheticFocusEvent_1 = SyntheticFocusEvent;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {number} Normalized `charCode` property.
 */

function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode; // FF does not set `charCode` for the Enter-key, check against `keyCode`.

    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  } // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.


  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

getEventCharCode._r = [2];
var getEventCharCode_1 = getEventCharCode;

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */


var normalizeKey = {
  Esc: 'Escape',
  Spacebar: ' ',
  Left: 'ArrowLeft',
  Up: 'ArrowUp',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  Del: 'Delete',
  Win: 'OS',
  Menu: 'ContextMenu',
  Apps: 'ContextMenu',
  Scroll: 'ScrollLock',
  MozPrintableKey: 'Unidentified'
};
/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */

var translateToKey = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};
/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */

function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.
    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;

    if (key !== 'Unidentified') {
      return key;
    }
  } // Browser does not implement `key`, polyfill as much of it as we can.


  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode_1(nativeEvent); // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.

    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }

  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }

  return '';
}

getEventKey._r = [2];
var getEventKey_1 = getEventKey;

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */


var KeyboardEventInterface = {
  key: getEventKey_1,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: getEventModifierState_1,
  // Legacy Interface
  charCode: function charCode(event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.
    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === 'keypress') {
      return getEventCharCode_1(event);
    }

    return 0;
  },
  keyCode: function keyCode(event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.
    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }

    return 0;
  },
  which: function which(event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === 'keypress') {
      return getEventCharCode_1(event);
    }

    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }

    return 0;
  }
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticKeyboardEvent._r = [2];
SyntheticUIEvent_1.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);
var SyntheticKeyboardEvent_1 = SyntheticKeyboardEvent;

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */


var DragEventInterface = {
  dataTransfer: null
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticMouseEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticDragEvent._r = [2];
SyntheticMouseEvent_1.augmentClass(SyntheticDragEvent, DragEventInterface);
var SyntheticDragEvent_1 = SyntheticDragEvent;

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */


var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState_1
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */

function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticTouchEvent._r = [2];
SyntheticUIEvent_1.augmentClass(SyntheticTouchEvent, TouchEventInterface);
var SyntheticTouchEvent_1 = SyntheticTouchEvent;

/**
 * @interface Event
 * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
 */


var TransitionEventInterface = {
  propertyName: null,
  elapsedTime: null,
  pseudoElement: null
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */

function SyntheticTransitionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticTransitionEvent._r = [2];
SyntheticEvent_1.augmentClass(SyntheticTransitionEvent, TransitionEventInterface);
var SyntheticTransitionEvent_1 = SyntheticTransitionEvent;

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */


var WheelEventInterface = {
  deltaX: function deltaX(event) {
    return 'deltaX' in event ? event.deltaX : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
    'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
  },
  deltaY: function deltaY(event) {
    return 'deltaY' in event ? event.deltaY : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
    'wheelDeltaY' in event ? -event.wheelDeltaY : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
    'wheelDelta' in event ? -event.wheelDelta : 0;
  },
  deltaZ: null,
  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
};
/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */

function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticMouseEvent_1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticWheelEvent._r = [2];
SyntheticMouseEvent_1.augmentClass(SyntheticWheelEvent, WheelEventInterface);
var SyntheticWheelEvent_1 = SyntheticWheelEvent;

/**
 * Turns
 * ['abort', ...]
 * into
 * eventTypes = {
 *   'abort': {
 *     phasedRegistrationNames: {
 *       bubbled: 'onAbort',
 *       captured: 'onAbortCapture',
 *     },
 *     dependencies: ['topAbort'],
 *   },
 *   ...
 * };
 * topLevelEventsToDispatchConfig = {
 *   'topAbort': { sameConfig }
 * };
 */


var eventTypes$4 = {};
var topLevelEventsToDispatchConfig = {};
['abort', 'animationEnd', 'animationIteration', 'animationStart', 'blur', 'canPlay', 'canPlayThrough', 'click', 'contextMenu', 'copy', 'cut', 'doubleClick', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'focus', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'progress', 'rateChange', 'reset', 'scroll', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'touchCancel', 'touchEnd', 'touchMove', 'touchStart', 'transitionEnd', 'volumeChange', 'waiting', 'wheel'].forEach(function (event) {
  var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
  var onEvent = 'on' + capitalizedEvent;
  var topEvent = 'top' + capitalizedEvent;
  var type = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + 'Capture'
    },
    dependencies: [topEvent]
  };
  eventTypes$4[event] = type;
  topLevelEventsToDispatchConfig[topEvent] = type;
});
var onClickListeners = {};

function getDictionaryKey$1(inst) {
  // Prevents V8 performance issue:
  // https://github.com/facebook/react/pull/7232
  return '.' + inst._rootNodeID;
}

getDictionaryKey$1._r = [2];

function isInteractive$1(tag) {
  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
}

isInteractive$1._r = [2];
var SimpleEventPlugin = {
  eventTypes: eventTypes$4,
  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];

    if (!dispatchConfig) {
      return null;
    }

    var EventConstructor;

    switch (topLevelType) {
      case 'topAbort':
      case 'topCanPlay':
      case 'topCanPlayThrough':
      case 'topDurationChange':
      case 'topEmptied':
      case 'topEncrypted':
      case 'topEnded':
      case 'topError':
      case 'topInput':
      case 'topInvalid':
      case 'topLoad':
      case 'topLoadedData':
      case 'topLoadedMetadata':
      case 'topLoadStart':
      case 'topPause':
      case 'topPlay':
      case 'topPlaying':
      case 'topProgress':
      case 'topRateChange':
      case 'topReset':
      case 'topSeeked':
      case 'topSeeking':
      case 'topStalled':
      case 'topSubmit':
      case 'topSuspend':
      case 'topTimeUpdate':
      case 'topVolumeChange':
      case 'topWaiting':
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent_1;
        break;

      case 'topKeyPress':
        // Firefox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode_1(nativeEvent) === 0) {
          return null;
        }

      /* falls through */

      case 'topKeyDown':
      case 'topKeyUp':
        EventConstructor = SyntheticKeyboardEvent_1;
        break;

      case 'topBlur':
      case 'topFocus':
        EventConstructor = SyntheticFocusEvent_1;
        break;

      case 'topClick':
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }

      /* falls through */

      case 'topDoubleClick':
      case 'topMouseDown':
      case 'topMouseMove':
      case 'topMouseUp': // TODO: Disabled elements should not respond to mouse events

      /* falls through */

      case 'topMouseOut':
      case 'topMouseOver':
      case 'topContextMenu':
        EventConstructor = SyntheticMouseEvent_1;
        break;

      case 'topDrag':
      case 'topDragEnd':
      case 'topDragEnter':
      case 'topDragExit':
      case 'topDragLeave':
      case 'topDragOver':
      case 'topDragStart':
      case 'topDrop':
        EventConstructor = SyntheticDragEvent_1;
        break;

      case 'topTouchCancel':
      case 'topTouchEnd':
      case 'topTouchMove':
      case 'topTouchStart':
        EventConstructor = SyntheticTouchEvent_1;
        break;

      case 'topAnimationEnd':
      case 'topAnimationIteration':
      case 'topAnimationStart':
        EventConstructor = SyntheticAnimationEvent_1;
        break;

      case 'topTransitionEnd':
        EventConstructor = SyntheticTransitionEvent_1;
        break;

      case 'topScroll':
        EventConstructor = SyntheticUIEvent_1;
        break;

      case 'topWheel':
        EventConstructor = SyntheticWheelEvent_1;
        break;

      case 'topCopy':
      case 'topCut':
      case 'topPaste':
        EventConstructor = SyntheticClipboardEvent_1;
        break;
    }

    !EventConstructor ? reactProdInvariant_1$2('86', topLevelType) : void 0;
    var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
    EventPropagators_1.accumulateTwoPhaseDispatches(event);
    return event;
  },
  didPutListener: function didPutListener(inst, registrationName, listener) {
    // Mobile Safari does not fire properly bubble click events on
    // non-interactive elements, which means delegated click listeners do not
    // fire. The workaround for this bug involves attaching an empty click
    // listener on the target node.
    // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
    if (registrationName === 'onClick' && !isInteractive$1(inst._tag)) {
      var key = getDictionaryKey$1(inst);
      var node = ReactDOMComponentTree_1.getNodeFromInstance(inst);

      if (!onClickListeners[key]) {
        onClickListeners[key] = EventListener_1.listen(node, 'click', emptyFunction_1);
      }
    }
  },
  willDeleteListener: function willDeleteListener(inst, registrationName) {
    if (registrationName === 'onClick' && !isInteractive$1(inst._tag)) {
      var key = getDictionaryKey$1(inst);
      onClickListeners[key].remove();
      delete onClickListeners[key];
    }
  }
};
var SimpleEventPlugin_1 = SimpleEventPlugin;

var alreadyInjected = false;

function inject() {
  if (alreadyInjected) {
    // TODO: This is currently true because these injections are shared between
    // the client and the server package. They should be built independently
    // and not share any injection state. Then this problem will be solved.
    return;
  }

  alreadyInjected = true;
  ReactInjection_1.EventEmitter.injectReactEventListener(ReactEventListener_1);
  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */

  ReactInjection_1.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder_1);
  ReactInjection_1.EventPluginUtils.injectComponentTree(ReactDOMComponentTree_1);
  ReactInjection_1.EventPluginUtils.injectTreeTraversal(ReactDOMTreeTraversal);
  /**
   * Some important event plugins included by default (without having to require
   * them).
   */

  ReactInjection_1.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin_1,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin_1,
    ChangeEventPlugin: ChangeEventPlugin_1,
    SelectEventPlugin: SelectEventPlugin_1,
    BeforeInputEventPlugin: BeforeInputEventPlugin_1
  });
  ReactInjection_1.HostComponent.injectGenericComponentClass(ReactDOMComponent_1);
  ReactInjection_1.HostComponent.injectTextComponentClass(ReactDOMTextComponent_1);
  ReactInjection_1.DOMProperty.injectDOMPropertyConfig(ARIADOMPropertyConfig_1);
  ReactInjection_1.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig_1);
  ReactInjection_1.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig_1);
  ReactInjection_1.EmptyComponent.injectEmptyComponentFactory(function (instantiate) {
    return new ReactDOMEmptyComponent_1(instantiate);
  });
  ReactInjection_1.Updates.injectReconcileTransaction(ReactReconcileTransaction_1);
  ReactInjection_1.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy_1);
  ReactInjection_1.Component.injectEnvironment(ReactComponentBrowserEnvironment_1);
}

inject._r = [2];
var ReactDefaultInjection = {
  inject: inject
};

var DOC_NODE_TYPE$1 = 9;

function ReactDOMContainerInfo(topLevelWrapper, node) {
  var info = {
    _topLevelWrapper: topLevelWrapper,
    _idCounter: 1,
    _ownerDocument: node ? node.nodeType === DOC_NODE_TYPE$1 ? node : node.ownerDocument : null,
    _node: node,
    _tag: node ? node.nodeName.toLowerCase() : null,
    _namespaceURI: node ? node.namespaceURI : null
  };

  return info;
}

ReactDOMContainerInfo._r = [2];
var ReactDOMContainerInfo_1 = ReactDOMContainerInfo;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var ReactDOMFeatureFlags = {
  useCreateElement: true,
  useFiber: false
};
var ReactDOMFeatureFlags_1 = ReactDOMFeatureFlags;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var MOD = 65521; // adler32 is not cryptographically strong, and is only used to sanity check that
// markup generated on the server matches the markup generated on the client.
// This implementation (a modified version of the SheetJS version) has been optimized
// for our use case, at the expense of conforming to the adler32 specification
// for non-ascii inputs.

function adler32(data) {
  var a = 1;
  var b = 0;
  var i = 0;
  var l = data.length;
  var m = l & ~0x3;

  while (i < m) {
    var n = Math.min(i + 4096, m);

    for (; i < n; i += 4) {
      b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
    }

    a %= MOD;
    b %= MOD;
  }

  for (; i < l; i++) {
    b += a += data.charCodeAt(i);
  }

  a %= MOD;
  b %= MOD;
  return a | b << 16;
}

adler32._r = [2];
var adler32_1 = adler32;

var TAG_END = /\/?>/;
var COMMENT_START = /^<\!\-\-/;
var ReactMarkupChecksum = {
  CHECKSUM_ATTR_NAME: 'data-react-checksum',

  /**
   * @param {string} markup Markup string
   * @return {string} Markup string with checksum attribute attached
   */
  addChecksumToMarkup: function addChecksumToMarkup(markup) {
    var checksum = adler32_1(markup); // Add checksum (handle both parent tags, comments and self-closing tags)

    if (COMMENT_START.test(markup)) {
      return markup;
    } else {
      return markup.replace(TAG_END, ' ' + ReactMarkupChecksum.CHECKSUM_ATTR_NAME + '="' + checksum + '"$&');
    }
  },

  /**
   * @param {string} markup to use
   * @param {DOMElement} element root React element
   * @returns {boolean} whether or not the markup is the same
   */
  canReuseMarkup: function canReuseMarkup(markup, element) {
    var existingChecksum = element.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
    existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
    var markupChecksum = adler32_1(markup);
    return markupChecksum === existingChecksum;
  }
};
var ReactMarkupChecksum_1 = ReactMarkupChecksum;

var ATTR_NAME$1 = DOMProperty_1.ID_ATTRIBUTE_NAME;
var ROOT_ATTR_NAME = DOMProperty_1.ROOT_ATTRIBUTE_NAME;
var ELEMENT_NODE_TYPE$1 = 1;
var DOC_NODE_TYPE = 9;
var DOCUMENT_FRAGMENT_NODE_TYPE$1 = 11;
var instancesByReactRootID = {};
/**
 * Finds the index of the first character
 * that's not common between the two given strings.
 *
 * @return {number} the index of the character where the strings diverge
 */

function firstDifferenceIndex(string1, string2) {
  var minLen = Math.min(string1.length, string2.length);

  for (var i = 0; i < minLen; i++) {
    if (string1.charAt(i) !== string2.charAt(i)) {
      return i;
    }
  }

  return string1.length === string2.length ? -1 : minLen;
}
/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 * a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */


firstDifferenceIndex._r = [2];

function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

getReactRootElementInContainer._r = [2];

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  return node.getAttribute && node.getAttribute(ATTR_NAME$1) || '';
}
/**
 * Mounts this component and inserts it into the DOM.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {DOMElement} container DOM element to mount into.
 * @param {ReactReconcileTransaction} transaction
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */


internalGetID._r = [2];

function mountComponentIntoNode(wrapperInstance, container, transaction, shouldReuseMarkup, context) {
  var markerName;

  if (ReactFeatureFlags_1.logTopLevelRenders) {
    var wrappedElement = wrapperInstance._currentElement.props.child;
    var type = wrappedElement.type;
    markerName = 'React mount: ' + (typeof type === 'string' ? type : type.displayName || type.name);
    console.time(markerName);
  }

  var markup = ReactReconciler_1.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo_1(wrapperInstance, container), context, 0
  /* parentDebugID */
  );

  if (markerName) {
    console.timeEnd(markerName);
  }

  wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;

  ReactMount._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
}
/**
 * Batched mount.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {DOMElement} container DOM element to mount into.
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */


mountComponentIntoNode._r = [2];

function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
  var transaction = ReactUpdates_1.ReactReconcileTransaction.getPooled(
  /* useCreateElement */
  !shouldReuseMarkup && ReactDOMFeatureFlags_1.useCreateElement);
  transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
  ReactUpdates_1.ReactReconcileTransaction.release(transaction);
}
/**
 * Unmounts a component and removes it from the DOM.
 *
 * @param {ReactComponent} instance React component instance.
 * @param {DOMElement} container DOM element to unmount from.
 * @final
 * @internal
 * @see {ReactMount.unmountComponentAtNode}
 */


batchedMountComponentIntoNode._r = [2];

function unmountComponentFromNode(instance, container, safely) {
  ReactReconciler_1.unmountComponent(instance, safely);

  if (container.nodeType === DOC_NODE_TYPE) {
    container = container.documentElement;
  } // http://jsperf.com/emptying-a-node


  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}
/**
 * True if the supplied DOM node has a direct React-rendered child that is
 * not a React root element. Useful for warning in `render`,
 * `unmountComponentAtNode`, etc.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM element contains a direct child that was
 * rendered by React but is not a root element.
 * @internal
 */


unmountComponentFromNode._r = [2];

function hasNonRootReactChild(container) {
  var rootEl = getReactRootElementInContainer(container);

  if (rootEl) {
    var inst = ReactDOMComponentTree_1.getInstanceFromNode(rootEl);
    return !!(inst && inst._hostParent);
  }
}
/**
 * True if the supplied DOM node is a React DOM element and
 * it has been rendered by another copy of React.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM has been rendered by another copy of React
 * @internal
 */


hasNonRootReactChild._r = [2];

function isValidContainer(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE_TYPE$1 || node.nodeType === DOC_NODE_TYPE || node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE$1));
}
/**
 * True if the supplied DOM node is a valid React node element.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM is a valid React DOM node.
 * @internal
 */


isValidContainer._r = [2];

function getHostRootInstanceInContainer(container) {
  var rootEl = getReactRootElementInContainer(container);
  var prevHostInstance = rootEl && ReactDOMComponentTree_1.getInstanceFromNode(rootEl);
  return prevHostInstance && !prevHostInstance._hostParent ? prevHostInstance : null;
}

getHostRootInstanceInContainer._r = [2];

function getTopLevelWrapperInContainer(container) {
  var root = getHostRootInstanceInContainer(container);
  return root ? root._hostContainerInfo._topLevelWrapper : null;
}
/**
 * Temporary (?) hack so that we can store all top-level pending updates on
 * composites instead of having to worry about different types of components
 * here.
 */


getTopLevelWrapperInContainer._r = [2];
var topLevelRootCounter = 1;

var TopLevelWrapper = function TopLevelWrapper() {
  this.rootID = topLevelRootCounter++;
};

TopLevelWrapper._r = [2];
TopLevelWrapper.prototype.isReactComponent = {};

TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};

TopLevelWrapper.isReactTopLevelWrapper = true;
/**
 * Mounting is the process of initializing a React component by creating its
 * representative DOM elements and inserting them into a supplied `container`.
 * Any prior content inside `container` is destroyed in the process.
 *
 *   ReactMount.render(
 *     component,
 *     document.getElementById('container')
 *   );
 *
 *   <div id="container">                   <-- Supplied `container`.
 *     <div data-reactid=".3">              <-- Rendered reactRoot of React
 *       // ...                                 component.
 *     </div>
 *   </div>
 *
 * Inside of `container`, the first element rendered is the "reactRoot".
 */

var ReactMount = {
  TopLevelWrapper: TopLevelWrapper,

  /**
   * Used by devtools. The keys are not important.
   */
  _instancesByReactRootID: instancesByReactRootID,

  /**
   * This is a hook provided to support rendering React components while
   * ensuring that the apparent scroll position of its `container` does not
   * change.
   *
   * @param {DOMElement} container The `container` being rendered into.
   * @param {function} renderCallback This must be called once to do the render.
   */
  scrollMonitor: function scrollMonitor(container, renderCallback) {
    renderCallback();
  },

  /**
   * Take a component that's already mounted into the DOM and replace its props
   * @param {ReactComponent} prevComponent component instance already in the DOM
   * @param {ReactElement} nextElement component instance to render
   * @param {DOMElement} container container to render into
   * @param {?function} callback function triggered on completion
   */
  _updateRootComponent: function _updateRootComponent(prevComponent, nextElement, nextContext, container, callback) {
    ReactMount.scrollMonitor(container, function () {
      ReactUpdateQueue_1.enqueueElementInternal(prevComponent, nextElement, nextContext);

      if (callback) {
        ReactUpdateQueue_1.enqueueCallbackInternal(prevComponent, callback);
      }
    });
    return prevComponent;
  },

  /**
   * Render a new component into the DOM. Hooked by hooks!
   *
   * @param {ReactElement} nextElement element to render
   * @param {DOMElement} container container to render into
   * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
   * @return {ReactComponent} nextComponent
   */
  _renderNewRootComponent: function _renderNewRootComponent(nextElement, container, shouldReuseMarkup, context) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case.
    void 0;
    !isValidContainer(container) ? reactProdInvariant_1$2('37') : void 0;
    ReactBrowserEventEmitter_1.ensureScrollValueMonitoring();
    var componentInstance = instantiateReactComponent_1(nextElement, false); // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.

    ReactUpdates_1.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);
    var wrapperID = componentInstance._instance.rootID;
    instancesByReactRootID[wrapperID] = componentInstance;
    return componentInstance;
  },

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactComponent} parentComponent The conceptual parent of this render tree.
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  renderSubtreeIntoContainer: function renderSubtreeIntoContainer(parentComponent, nextElement, container, callback) {
    !(parentComponent != null && ReactInstanceMap_1.has(parentComponent)) ? reactProdInvariant_1$2('38') : void 0;
    return ReactMount._renderSubtreeIntoContainer(parentComponent, nextElement, container, callback);
  },
  _renderSubtreeIntoContainer: function _renderSubtreeIntoContainer(parentComponent, nextElement, container, callback) {
    ReactUpdateQueue_1.validateCallback(callback, 'ReactDOM.render');
    !React_1.isValidElement(nextElement) ? reactProdInvariant_1$2('39', typeof nextElement === 'string' ? " Instead of passing a string like 'div', pass " + "React.createElement('div') or <div />." : typeof nextElement === 'function' ? ' Instead of passing a class like Foo, pass ' + 'React.createElement(Foo) or <Foo />.' : nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : void 0;
    void 0;
    var nextWrappedElement = React_1.createElement(TopLevelWrapper, {
      child: nextElement
    });
    var nextContext;

    if (parentComponent) {
      var parentInst = ReactInstanceMap_1.get(parentComponent);
      nextContext = parentInst._processChildContext(parentInst._context);
    } else {
      nextContext = emptyObject_1;
    }

    var prevComponent = getTopLevelWrapperInContainer(container);

    if (prevComponent) {
      var prevWrappedElement = prevComponent._currentElement;
      var prevElement = prevWrappedElement.props.child;

      if (shouldUpdateReactComponent_1(prevElement, nextElement)) {
        var publicInst = prevComponent._renderedComponent.getPublicInstance();

        var updatedCallback = callback && function () {
          callback.call(publicInst);
        };

        ReactMount._updateRootComponent(prevComponent, nextWrappedElement, nextContext, container, updatedCallback);

        return publicInst;
      } else {
        ReactMount.unmountComponentAtNode(container);
      }
    }

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup = reactRootElement && !!internalGetID(reactRootElement);
    var containerHasNonRootReactChild = hasNonRootReactChild(container);

    var shouldReuseMarkup = containerHasReactMarkup && !prevComponent && !containerHasNonRootReactChild;

    var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext)._renderedComponent.getPublicInstance();

    if (callback) {
      callback.call(component);
    }

    return component;
  },

  /**
   * Renders a React component into the DOM in the supplied `container`.
   * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.render
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  render: function render(nextElement, container, callback) {
    return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
  },

  /**
   * Unmounts and destroys the React component rendered in the `container`.
   * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.unmountcomponentatnode
   *
   * @param {DOMElement} container DOM element containing a React component.
   * @return {boolean} True if a component was found in and unmounted from
   *                   `container`
   */
  unmountComponentAtNode: function unmountComponentAtNode(container) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case. (Strictly speaking, unmounting won't cause a
    // render but we still don't expect to be in a render call here.)
    void 0;
    !isValidContainer(container) ? reactProdInvariant_1$2('40') : void 0;

    var prevComponent = getTopLevelWrapperInContainer(container);

    if (!prevComponent) {
      // Check if the node being unmounted was rendered by React, but isn't a
      // root node.
      var containerHasNonRootReactChild = hasNonRootReactChild(container); // Check if the container itself is a React root node.

      var isContainerReactRoot = container.nodeType === 1 && container.hasAttribute(ROOT_ATTR_NAME);

      return false;
    }

    delete instancesByReactRootID[prevComponent._instance.rootID];
    ReactUpdates_1.batchedUpdates(unmountComponentFromNode, prevComponent, container, false);
    return true;
  },
  _mountImageIntoNode: function _mountImageIntoNode(markup, container, instance, shouldReuseMarkup, transaction) {
    !isValidContainer(container) ? reactProdInvariant_1$2('41') : void 0;

    if (shouldReuseMarkup) {
      var rootElement = getReactRootElementInContainer(container);

      if (ReactMarkupChecksum_1.canReuseMarkup(markup, rootElement)) {
        ReactDOMComponentTree_1.precacheNode(instance, rootElement);
        return;
      } else {
        var checksum = rootElement.getAttribute(ReactMarkupChecksum_1.CHECKSUM_ATTR_NAME);
        rootElement.removeAttribute(ReactMarkupChecksum_1.CHECKSUM_ATTR_NAME);
        var rootMarkup = rootElement.outerHTML;
        rootElement.setAttribute(ReactMarkupChecksum_1.CHECKSUM_ATTR_NAME, checksum);
        var normalizedMarkup = markup;

        var diffIndex = firstDifferenceIndex(normalizedMarkup, rootMarkup);
        var difference = ' (client) ' + normalizedMarkup.substring(diffIndex - 20, diffIndex + 20) + '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);
        !(container.nodeType !== DOC_NODE_TYPE) ? reactProdInvariant_1$2('42', difference) : void 0;

        
      }
    }

    !(container.nodeType !== DOC_NODE_TYPE) ? reactProdInvariant_1$2('43') : void 0;

    if (transaction.useCreateElement) {
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }

      DOMLazyTree_1.insertTreeBefore(container, markup, null);
    } else {
      setInnerHTML_1(container, markup);
      ReactDOMComponentTree_1.precacheNode(instance, container.firstChild);
    }

    
  }
};
var ReactMount_1 = ReactMount;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var ReactVersion$3 = '15.6.2';

function getHostComponentFromComposite(inst) {
  var type;

  while ((type = inst._renderedNodeType) === ReactNodeTypes_1.COMPOSITE) {
    inst = inst._renderedComponent;
  }

  if (type === ReactNodeTypes_1.HOST) {
    return inst._renderedComponent;
  } else if (type === ReactNodeTypes_1.EMPTY) {
    return null;
  }
}

getHostComponentFromComposite._r = [2];
var getHostComponentFromComposite_1 = getHostComponentFromComposite;

/**
 * Returns the DOM node rendered by this element.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.finddomnode
 *
 * @param {ReactComponent|DOMElement} componentOrElement
 * @return {?DOMElement} The root node of this element.
 */


function findDOMNode(componentOrElement) {
  if (componentOrElement == null) {
    return null;
  }

  if (componentOrElement.nodeType === 1) {
    return componentOrElement;
  }

  var inst = ReactInstanceMap_1.get(componentOrElement);

  if (inst) {
    inst = getHostComponentFromComposite_1(inst);
    return inst ? ReactDOMComponentTree_1.getNodeFromInstance(inst) : null;
  }

  if (typeof componentOrElement.render === 'function') {
    reactProdInvariant_1$2('44');
  } else {
    reactProdInvariant_1$2('45', Object.keys(componentOrElement));
  }
}

findDOMNode._r = [2];
var findDOMNode_1 = findDOMNode;

var renderSubtreeIntoContainer = ReactMount_1.renderSubtreeIntoContainer;

var warnUnknownProperties = function warnUnknownProperties(debugID, element) {
  var unknownProps = [];

  for (var key in element.props) {
    var isValid = validateProperty(element.type, key, debugID);

    if (!isValid) {
      unknownProps.push(key);
    }
  }

  var unknownPropString = unknownProps.map(function (prop) {
    return '`' + prop + '`';
  }).join(', ');

  if (unknownProps.length === 1) {
    void 0;
  } else if (unknownProps.length > 1) {
    void 0;
  }
};

warnUnknownProperties._r = [2];

ReactDefaultInjection.inject();
var ReactDOM = {
  findDOMNode: findDOMNode_1,
  render: ReactMount_1.render,
  unmountComponentAtNode: ReactMount_1.unmountComponentAtNode,
  version: ReactVersion$3,

  /* eslint-disable camelcase */
  unstable_batchedUpdates: ReactUpdates_1.batchedUpdates,
  unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
  /* eslint-enable camelcase */

}; // Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.

if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    ComponentTree: {
      getClosestInstanceFromNode: ReactDOMComponentTree_1.getClosestInstanceFromNode,
      getNodeFromInstance: function getNodeFromInstance(inst) {
        // inst is an internal instance (but could be a composite)
        if (inst._renderedComponent) {
          inst = getHostComponentFromComposite_1(inst);
        }

        if (inst) {
          return ReactDOMComponentTree_1.getNodeFromInstance(inst);
        } else {
          return null;
        }
      }
    },
    Mount: ReactMount_1,
    Reconciler: ReactReconciler_1
  });
}

var ReactDOM_1 = ReactDOM;

var reactDom$1 = ReactDOM_1;
var reactDom_1 = reactDom$1.render;
var reactDom_2 = reactDom$1.findDOMNode;
var reactDom_3 = reactDom$1.unstable_batchedUpdates;

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

var Atom$1 = function (_super) {
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
      invariant$3(!change || change.type, "Intercept handlers should return nothing or a change object");
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
  var change = objectAssign$2({}, event, {
    spyReportStart: true
  });
  spyReport(change);
}

spyReportStart._r = [2];
var END_EVENT = {
  spyReportEnd: true
};

function spyReportEnd(change) {
  if (change) spyReport(objectAssign$2({}, change, END_EVENT));else spyReport(END_EVENT);
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
  invariant$3(array[IS_ITERATING_MARKER] !== true, "Illegal state: cannot recycle array as iterator");
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
  invariant$3(typeof baseFunc === "function", "Base function not defined on Array prototype: '" + funcName + "'");
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
  invariant$3(typeof fn === "function", getMessage("m026"));
  invariant$3(typeof actionName === "string" && actionName.length > 0, "actions should have valid names, got: '" + actionName + "'");

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
  invariant$3(globalState.trackingDerivation === null, getMessage("m028"));
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

    invariant$3(allowCustomArguments || quacksLikeADecorator(arguments), "This function is a decorator, but it wasn't invoked like a decorator");

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
      if (!hasOwnProperty$4(target, "__mobxLazyInitializers")) {
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
  if (!hasOwnProperty$4(instance, "__mobxInitializedProps")) addHiddenProp(instance, "__mobxInitializedProps", {});
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
  var wrappedAction = action$1(actionName, value);
  addHiddenProp(target, key, wrappedAction);
}, function (key) {
  return this[key];
}, function () {
  invariant$3(false, getMessage("m001"));
}, false, true);
var boundActionDecorator = createClassPropertyDecorator(function (target, key, value) {
  defineBoundAction(target, key, value);
}, function (key) {
  return this[key];
}, function () {
  invariant$3(false, getMessage("m001"));
}, false, false);

var action$1 = function action(arg1, arg2, arg3, arg4) {
  if (arguments.length === 1 && typeof arg1 === "function") return createAction(arg1.name || "<unnamed action>", arg1);
  if (arguments.length === 2 && typeof arg2 === "function") return createAction(arg1, arg2);
  if (arguments.length === 1 && typeof arg1 === "string") return namedActionDecorator(arg1);
  return namedActionDecorator(arg2).apply(null, arguments);
};

action$1._r = [2];

action$1.bound = function boundAction(arg1, arg2, arg3) {
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
  invariant$3(typeof fn === "function", getMessage("m002"));
  invariant$3(fn.length === 0, getMessage("m003"));
  invariant$3(typeof actionName === "string" && actionName.length > 0, "actions should have valid names, got: '" + actionName + "'");
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

  invariant$3(typeof view === "function", getMessage("m004"));
  invariant$3(isAction(view) === false, getMessage("m005"));
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

  invariant$3(isAction(func) === false, getMessage("m006"));
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

  if (_typeof$2(arg3) === "object") {
    opts = arg3;
  } else {
    opts = {};
  }

  opts.name = opts.name || expression.name || effect.name || "Reaction@" + getNextId();
  opts.fireImmediately = arg3 === true || opts.fireImmediately === true;
  opts.delay = opts.delay || 0;
  opts.compareStructural = opts.compareStructural || opts.struct || false; // TODO: creates ugly spy events, use `effect = (r) => runInAction(opts.name, () => effect(r))` instead

  effect = action$1(opts.name, opts.context ? effect.bind(opts.context) : effect);

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
    invariant$3(!this.isComputing, "Cycle detected in computation " + this.name, this.derivation);

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
      invariant$3(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
      this.isRunningSetter = true;

      try {
        this.setter.call(this.scope, value);
      } finally {
        this.isRunningSetter = false;
      }
    } else invariant$3(false, "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
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
    invariant$3(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
    return registerListener(this, callback);
  };

  ObservableObjectAdministration.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  return ObservableObjectAdministration;
}();

function asObservableObject(target, name) {
  if (isObservableObject(target) && target.hasOwnProperty("$mobx")) return target.$mobx;
  invariant$3(Object.isExtensible(target), getMessage("m035"));
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
    invariant$3("value" in descriptor, "The property " + propName + " in " + adm.name + " is already observable, cannot redefine it as computed property");
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
  invariant$3(!!enhancer, ":(");
  return createClassPropertyDecorator(function (target, name, baseValue, _, baseDescriptor) {
    assertPropertyConfigurable(target, name);
    invariant$3(!baseDescriptor || !baseDescriptor.get, getMessage("m022"));
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
  invariant$3(arguments.length >= 2, getMessage("m014"));
  invariant$3(_typeof$2(target) === "object", getMessage("m015"));
  invariant$3(!isObservableMap(target), getMessage("m016"));
  properties.forEach(function (propSet) {
    invariant$3(_typeof$2(propSet) === "object", getMessage("m017"));
    invariant$3(!isObservable(propSet), getMessage("m018"));
  });
  var adm = asObservableObject(target);
  var definedProps = {}; // Note could be optimised if properties.length === 1

  for (var i = properties.length - 1; i >= 0; i--) {
    var propSet = properties[i];

    for (var key in propSet) {
      if (definedProps[key] !== true && hasOwnProperty$4(propSet, key)) {
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
  invariant$3(arguments.length <= 1, getMessage("m021"));
  invariant$3(!isModifierDescriptor(v), getMessage("m020")); // it is an observable already, done

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
  return _typeof$2(thing) === "object" && thing !== null && thing.isMobxModifierDescriptor === true;
}

isModifierDescriptor._r = [2];

function createModifierDescriptor(enhancer, initialValue) {
  invariant$3(!isModifierDescriptor(initialValue), "Modifiers cannot be nested");
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

function transaction$1(action, thisArg) {
  if (thisArg === void 0) {
    thisArg = undefined;
  }

  return runInTransaction.apply(undefined, arguments);
}

transaction$1._r = [2];

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
    invariant$3(fireImmediately !== true, getMessage("m033"));
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
  invariant$3(false, message, thing);
  throw "X"; // unreachable
}

fail._r = [2];

function invariant$3(check, message, thing) {
  if (!check) throw new Error("[mobx] Invariant failed: " + message + (thing ? " in '" + thing + "'" : ""));
}
/**
 * Prints a deprecation message, but only one time.
 * Returns false if the deprecated message was already printed before
 */


invariant$3._r = [2];
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
  return value !== null && _typeof$2(value) === "object";
}

isObject._r = [2];

function isPlainObject(value) {
  if (value === null || _typeof$2(value) !== "object") return false;
  var proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

isPlainObject._r = [2];

function objectAssign$2() {
  var res = arguments[0];

  for (var i = 1, l = arguments.length; i < l; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (hasOwnProperty$4(source, key)) {
        res[key] = source[key];
      }
    }
  }

  return res;
}

objectAssign$2._r = [2];
var prototypeHasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwnProperty$4(object, propName) {
  return prototypeHasOwnProperty.call(object, propName);
}

hasOwnProperty$4._r = [2];

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
  invariant$3(isPropertyConfigurable(object, prop), "Cannot make property '" + prop + "' observable, it is not configurable and writable in the target object");
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
  if (_typeof$2(a) !== "object") return a === b;
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
  } else if (_typeof$2(a) === "object" && _typeof$2(b) === "object") {
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
  return value === null ? null : _typeof$2(value) === "object" ? "" + value : value;
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
  invariant$3(this && this.$mobx && isReaction(this.$mobx), "Invalid `this`");
  invariant$3(!this.$mobx.errorHandler, "Only one onErrorHandler can be registered");
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
    invariant$3(typeof originalDescriptor !== "undefined", getMessage("m009"));
    invariant$3(typeof originalDescriptor.get === "function", getMessage("m010"));
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

  invariant$3(typeof arg1 === "function", getMessage("m011"));
  invariant$3(arguments.length < 3, getMessage("m012"));
  var opts = _typeof$2(arg2) === "object" ? arg2 : {};
  opts.setter = typeof arg2 === "function" ? arg2 : opts.setter;
  var equals = opts.equals ? opts.equals : opts.compareStructural || opts.struct ? comparer.structural : comparer.default;
  return new ComputedValue(arg1, opts.context, equals, opts.name || arg1.name || "", opts.setter);
};

computed._r = [2];
computed.struct = computedStructDecorator;
computed.equals = createComputedDecorator;

function getAtom(thing, property) {
  if (_typeof$2(thing) === "object" && thing !== null) {
    if (isObservableArray(thing)) {
      invariant$3(property === undefined, getMessage("m036"));
      return thing.$mobx.atom;
    }

    if (isObservableMap(thing)) {
      var anyThing = thing;
      if (property === undefined) return getAtom(anyThing._keys);
      var observable = anyThing._data[property] || anyThing._hasMap[property];
      invariant$3(!!observable, "the entry '" + property + "' does not exist in the observable map '" + getDebugName(thing) + "'");
      return observable;
    } // Initializers run lazily when transpiling to babel, so make sure they are run...


    runLazyInitializers(thing);
    if (property && !thing.$mobx) thing[property]; // See #1072 // TODO: remove in 4.0

    if (isObservableObject(thing)) {
      if (!property) return fail("please specify a property");
      var observable = thing.$mobx.values[property];
      invariant$3(!!observable, "no observable property '" + property + "' found on the observable object '" + getDebugName(thing) + "'");
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
  invariant$3(thing, "Expecting some object");
  if (property !== undefined) return getAdministration(getAtom(thing, property));
  if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) return thing;
  if (isObservableMap(thing)) return thing; // Initializers run lazily when transpiling to babel, so make sure they are run...

  runLazyInitializers(thing);
  if (thing.$mobx) return thing.$mobx;
  invariant$3(false, "Cannot obtain administration from " + thing);
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

    if (detectCycles && source !== null && _typeof$2(source) === "object") {
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
  invariant$3(typeof transformer === "function" && transformer.length < 2, "createTransformer expects a function that accepts one argument"); // Memoizes: object id -> reactive view that applies transformer to the object

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
  if (object === null || _typeof$2(object) !== "object") throw new Error("[mobx] transform expected some kind of object or primitive value, got: " + object);
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
  Atom: Atom$1,
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
  transaction: transaction$1,
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
  action: action$1,
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

if ((typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "undefined" ? "undefined" : _typeof$2(__MOBX_DEVTOOLS_GLOBAL_HOOK__)) === "object") {
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: spy,
    extras: extras
  });
}

var unstable_batchedUpdates$1 = undefined;

var _typeof$3 = typeof Symbol === "function" && _typeof$2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof$2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof$2(obj);
};

var classCallCheck$1 = function classCallCheck$$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

classCallCheck$1._r = [2];

var createClass$5 = function () {
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

var inherits$1 = function inherits$$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + _typeof$2(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

inherits$1._r = [2];

var possibleConstructorReturn$1 = function possibleConstructorReturn$$1(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (_typeof$2(call) === "object" || typeof call === "function") ? call : self;
};

possibleConstructorReturn$1._r = [2];

var EventEmitter = function () {
  function EventEmitter() {
    classCallCheck$1(this, EventEmitter);
    this.listeners = [];
  }

  createClass$5(EventEmitter, [{
    key: "on",
    value: function on(cb) {
      var _this = this;

      this.listeners.push(cb);
      return function () {
        var index = _this.listeners.indexOf(cb);

        if (index !== -1) _this.listeners.splice(index, 1);
      };
    }
  }, {
    key: "emit",
    value: function emit(data) {
      this.listeners.forEach(function (fn) {
        return fn(data);
      });
    }
  }]);
  return EventEmitter;
}();
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

var index = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
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
}; // Copied from React.PropTypes


index._r = [2];

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
      rest[_key - 6] = arguments[_key];
    }

    return untracked(function () {
      componentName = componentName || "<<anonymous>>";
      propFullName = propFullName || propName;

      if (props[propName] == null) {
        if (isRequired) {
          var actual = props[propName] === null ? "null" : "undefined";
          return new Error("The " + location + " `" + propFullName + "` is marked as required " + "in `" + componentName + "`, but its value is `" + actual + "`.");
        }

        return null;
      } else {
        return validate.apply(undefined, [props, propName, componentName, location, propFullName].concat(rest));
      }
    });
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);
  return chainedCheckType;
} // Copied from React.PropTypes


createChainableTypeChecker._r = [2];

function isSymbol(propType, propValue) {
  // Native Symbol.
  if (propType === "symbol") {
    return true;
  } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


  if (propValue["@@toStringTag"] === "Symbol") {
    return true;
  } // Fallback for non-spec compliant Symbols which are polyfilled.


  if (typeof Symbol === "function" && propValue instanceof Symbol) {
    return true;
  }

  return false;
} // Copied from React.PropTypes


isSymbol._r = [2];

function getPropType(propValue) {
  var propType = typeof propValue === "undefined" ? "undefined" : _typeof$3(propValue);

  if (Array.isArray(propValue)) {
    return "array";
  }

  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return "object";
  }

  if (isSymbol(propType, propValue)) {
    return "symbol";
  }

  return propType;
} // This handles more types than `getPropType`. Only used for error messages.
// Copied from React.PropTypes


getPropType._r = [2];

function getPreciseType(propValue) {
  var propType = getPropType(propValue);

  if (propType === "object") {
    if (propValue instanceof Date) {
      return "date";
    } else if (propValue instanceof RegExp) {
      return "regexp";
    }
  }

  return propType;
}

getPreciseType._r = [2];

function createObservableTypeCheckerCreator(allowNativeType, mobxType) {
  return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
    return untracked(function () {
      if (allowNativeType) {
        if (getPropType(props[propName]) === mobxType.toLowerCase()) return null;
      }

      var mobxChecker = void 0;

      switch (mobxType) {
        case "Array":
          mobxChecker = isObservableArray;
          break;

        case "Object":
          mobxChecker = isObservableObject;
          break;

        case "Map":
          mobxChecker = isObservableMap;
          break;

        default:
          throw new Error("Unexpected mobxType: " + mobxType);
      }

      var propValue = props[propName];

      if (!mobxChecker(propValue)) {
        var preciseType = getPreciseType(propValue);
        var nativeTypeExpectationMessage = allowNativeType ? " or javascript `" + mobxType.toLowerCase() + "`" : "";
        return new Error("Invalid prop `" + propFullName + "` of type `" + preciseType + "` supplied to" + " `" + componentName + "`, expected `mobx.Observable" + mobxType + "`" + nativeTypeExpectationMessage + ".");
      }

      return null;
    });
  });
}

createObservableTypeCheckerCreator._r = [2];

function createObservableArrayOfTypeChecker(allowNativeType, typeChecker) {
  return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
    for (var _len2 = arguments.length, rest = Array(_len2 > 5 ? _len2 - 5 : 0), _key2 = 5; _key2 < _len2; _key2++) {
      rest[_key2 - 5] = arguments[_key2];
    }

    return untracked(function () {
      if (typeof typeChecker !== "function") {
        return new Error("Property `" + propFullName + "` of component `" + componentName + "` has " + "invalid PropType notation.");
      }

      var error = createObservableTypeCheckerCreator(allowNativeType, "Array")(props, propName, componentName);
      if (error instanceof Error) return error;
      var propValue = props[propName];

      for (var i = 0; i < propValue.length; i++) {
        error = typeChecker.apply(undefined, [propValue, i, componentName, location, propFullName + "[" + i + "]"].concat(rest));
        if (error instanceof Error) return error;
      }

      return null;
    });
  });
}

createObservableArrayOfTypeChecker._r = [2];
var observableArray = createObservableTypeCheckerCreator(false, "Array");
var observableArrayOf = createObservableArrayOfTypeChecker.bind(null, false);
var observableMap = createObservableTypeCheckerCreator(false, "Map");
var observableObject = createObservableTypeCheckerCreator(false, "Object");
var arrayOrObservableArray = createObservableTypeCheckerCreator(true, "Array");
var arrayOrObservableArrayOf = createObservableArrayOfTypeChecker.bind(null, true);
var objectOrObservableObject = createObservableTypeCheckerCreator(true, "Object");
var propTypes$1 = Object.freeze({
  observableArray: observableArray,
  observableArrayOf: observableArrayOf,
  observableMap: observableMap,
  observableObject: observableObject,
  arrayOrObservableArray: arrayOrObservableArray,
  arrayOrObservableArrayOf: arrayOrObservableArrayOf,
  objectOrObservableObject: objectOrObservableObject
});

function isStateless(component) {
  // `function() {}` has prototype, but `() => {}` doesn't
  // `() => {}` via Babel has prototype too.
  return !(component.prototype && component.prototype.render);
}

isStateless._r = [2];
var injectorContextTypes = {
  mobxStores: objectOrObservableObject
};
Object.seal(injectorContextTypes);
var proxiedInjectorProps = {
  contextTypes: {
    get: function get$$1() {
      return injectorContextTypes;
    },
    set: function set$$1(_) {
      console.warn("Mobx Injector: you are trying to attach `contextTypes` on an component decorated with `inject` (or `observer`) HOC. Please specify the contextTypes on the wrapped component instead. It is accessible through the `wrappedComponent`");
    },
    configurable: true,
    enumerable: false
  },
  isMobxInjector: {
    value: true,
    writable: true,
    configurable: true,
    enumerable: true
    /**
     * Store Injection
     */

  }
};

function createStoreInjector(grabStoresFn, component, injectNames) {
  var _class, _temp2;

  var displayName = "inject-" + (component.displayName || component.name || component.constructor && component.constructor.name || "Unknown");
  if (injectNames) displayName += "-with-" + injectNames;
  var Injector = (_temp2 = _class = function (_Component) {
    inherits$1(Injector, _Component);

    function Injector() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck$1(this, Injector);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn$1(this, (_ref = Injector.__proto__ || Object.getPrototypeOf(Injector)).call.apply(_ref, [this].concat(args))), _this), _this.storeRef = function (instance) {
        _this.wrappedInstance = instance;
      }, _temp), possibleConstructorReturn$1(_this, _ret);
    }

    createClass$5(Injector, [{
      key: "render",
      value: function render() {
        // Optimization: it might be more efficient to apply the mapper function *outside* the render method
        // (if the mapper is a function), that could avoid expensive(?) re-rendering of the injector component
        // See this test: 'using a custom injector is not too reactive' in inject.js
        var newProps = {};

        for (var key in this.props) {
          if (this.props.hasOwnProperty(key)) {
            newProps[key] = this.props[key];
          }
        }

        var additionalProps = grabStoresFn(this.context.mobxStores || {}, newProps, this.context) || {};

        for (var _key2 in additionalProps) {
          newProps[_key2] = additionalProps[_key2];
        }

        if (!isStateless(component)) {
          newProps.ref = this.storeRef;
        }

        return react_1(component, newProps);
      }
    }]);
    return Injector;
  }(react_2), _class.displayName = displayName, _temp2); // Static fields from component should be visible on the generated Injector

  index(Injector, component);
  Injector.wrappedComponent = component;
  Object.defineProperties(Injector, proxiedInjectorProps);
  return Injector;
}

createStoreInjector._r = [2];

function grabStoresByName(storeNames) {
  return function (baseStores, nextProps) {
    storeNames.forEach(function (storeName) {
      if (storeName in nextProps // prefer props over stores
      ) return;
      if (!(storeName in baseStores)) throw new Error("MobX injector: Store '" + storeName + "' is not available! Make sure it is provided by some Provider");
      nextProps[storeName] = baseStores[storeName];
    });
    return nextProps;
  };
}
/**
 * higher order component that injects stores to a child.
 * takes either a varargs list of strings, which are stores read from the context,
 * or a function that manually maps the available stores from the context to props:
 * storesToProps(mobxStores, props, context) => newProps
 */


grabStoresByName._r = [2];

function inject$1()
/* fn(stores, nextProps) or ...storeNames */
{
  var grabStoresFn = void 0;

  if (typeof arguments[0] === "function") {
    grabStoresFn = arguments[0];
    return function (componentClass) {
      var injected = createStoreInjector(grabStoresFn, componentClass);
      injected.isMobxInjector = false; // supress warning
      // mark the Injector as observer, to make it react to expressions in `grabStoresFn`,
      // see #111

      injected = observer(injected);
      injected.isMobxInjector = true; // restore warning

      return injected;
    };
  } else {
    var storeNames = [];

    for (var i = 0; i < arguments.length; i++) {
      storeNames[i] = arguments[i];
    }

    grabStoresFn = grabStoresByName(storeNames);
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, componentClass, storeNames.join("-"));
    };
  }
}
/**
 * dev tool support
 */


inject$1._r = [2];
var isDevtoolsEnabled = false;
var isUsingStaticRendering = false;
var warnedAboutObserverInjectDeprecation = false; // WeakMap<Node, Object>;

var componentByNodeRegistery = typeof WeakMap !== "undefined" ? new WeakMap() : undefined;
var renderReporter = new EventEmitter();

function findDOMNode$2(component) {
  if (reactDom_2) {
    try {
      return reactDom_2(component);
    } catch (e) {
      // findDOMNode will throw in react-test-renderer, see:
      // See https://github.com/mobxjs/mobx-react/issues/216
      // Is there a better heuristic?
      return null;
    }
  }

  return null;
}

findDOMNode$2._r = [2];

function reportRendering(component) {
  var node = findDOMNode$2(component);
  if (node && componentByNodeRegistery) componentByNodeRegistery.set(node, component);
  renderReporter.emit({
    event: "render",
    renderTime: component.__$mobRenderEnd - component.__$mobRenderStart,
    totalTime: Date.now() - component.__$mobRenderStart,
    component: component,
    node: node
  });
}

reportRendering._r = [2];

function trackComponents() {
  if (typeof WeakMap === "undefined") throw new Error("[mobx-react] tracking components is not supported in this browser.");
  if (!isDevtoolsEnabled) isDevtoolsEnabled = true;
}

trackComponents._r = [2];

var errorsReporter = new EventEmitter();
/**
 * Utilities
 */

function patch(target, funcName) {
  var runMixinFirst = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var base = target[funcName];
  var mixinFunc = reactiveMixin[funcName];
  var f = !base ? mixinFunc : runMixinFirst === true ? function () {
    mixinFunc.apply(this, arguments);
    base.apply(this, arguments);
  } : function () {
    base.apply(this, arguments);
    mixinFunc.apply(this, arguments);
  }; // MWE: ideally we freeze here to protect against accidental overwrites in component instances, see #195
  // ...but that breaks react-hot-loader, see #231...

  target[funcName] = f;
}

patch._r = [2];

function isObjectShallowModified(prev, next) {
  if (null == prev || null == next || (typeof prev === "undefined" ? "undefined" : _typeof$3(prev)) !== "object" || (typeof next === "undefined" ? "undefined" : _typeof$3(next)) !== "object") {
    return prev !== next;
  }

  var keys = Object.keys(prev);

  if (keys.length !== Object.keys(next).length) {
    return true;
  }

  var key = void 0;

  for (var i = keys.length - 1; i >= 0, key = keys[i]; i--) {
    if (next[key] !== prev[key]) {
      return true;
    }
  }

  return false;
}
/**
 * ReactiveMixin
 */


isObjectShallowModified._r = [2];
var reactiveMixin = {
  componentWillMount: function componentWillMount() {
    var _this = this;

    if (isUsingStaticRendering === true) return; // Generate friendly name for debugging

    var initialName = this.displayName || this.name || this.constructor && (this.constructor.displayName || this.constructor.name) || "<component>";
    var rootNodeID = this._reactInternalInstance && this._reactInternalInstance._rootNodeID;
    /**
     * If props are shallowly modified, react will render anyway,
     * so atom.reportChanged() should not result in yet another re-render
     */

    var skipRender = false;
    /**
     * forceUpdate will re-assign this.props. We don't want that to cause a loop,
     * so detect these changes
     */

    var isForcingUpdate = false;

    function makePropertyObservableReference(propName) {
      var valueHolder = this[propName];
      var atom = new Atom$1("reactive " + propName);
      Object.defineProperty(this, propName, {
        configurable: true,
        enumerable: true,
        get: function get$$1() {
          atom.reportObserved();
          return valueHolder;
        },
        set: function set$$1(v) {
          if (!isForcingUpdate && isObjectShallowModified(valueHolder, v)) {
            valueHolder = v;
            skipRender = true;
            atom.reportChanged();
            skipRender = false;
          } else {
            valueHolder = v;
          }
        }
      });
    } // make this.props an observable reference, see #124


    makePropertyObservableReference.call(this, "props"); // make state an observable reference

    makePropertyObservableReference.call(this, "state"); // wire up reactive render

    var baseRender = this.render.bind(this);
    var reaction$$1 = null;
    var isRenderingPending = false;

    var initialRender = function initialRender() {
      reaction$$1 = new Reaction(initialName + "#" + rootNodeID + ".render()", function () {
        if (!isRenderingPending) {
          // N.B. Getting here *before mounting* means that a component constructor has side effects (see the relevant test in misc.js)
          // This unidiomatic React usage but React will correctly warn about this so we continue as usual
          // See #85 / Pull #44
          isRenderingPending = true;
          if (typeof _this.componentWillReact === "function") _this.componentWillReact(); // TODO: wrap in action?

          if (_this.__$mobxIsUnmounted !== true) {
            // If we are unmounted at this point, componentWillReact() had a side effect causing the component to unmounted
            // TODO: remove this check? Then react will properly warn about the fact that this should not happen? See #73
            // However, people also claim this migth happen during unit tests..
            var hasError = true;

            try {
              isForcingUpdate = true;
              if (!skipRender) react_2.prototype.forceUpdate.call(_this);
              hasError = false;
            } finally {
              isForcingUpdate = false;
              if (hasError) reaction$$1.dispose();
            }
          }
        }
      });
      reaction$$1.reactComponent = _this;
      reactiveRender.$mobx = reaction$$1;
      _this.render = reactiveRender;
      return reactiveRender();
    };

    initialRender._r = [2];

    var reactiveRender = function reactiveRender() {
      isRenderingPending = false;
      var exception = undefined;
      var rendering = undefined;
      reaction$$1.track(function () {
        if (isDevtoolsEnabled) {
          _this.__$mobRenderStart = Date.now();
        }

        try {
          rendering = extras.allowStateChanges(false, baseRender);
        } catch (e) {
          exception = e;
        }

        if (isDevtoolsEnabled) {
          _this.__$mobRenderEnd = Date.now();
        }
      });

      if (exception) {
        errorsReporter.emit(exception);
        throw exception;
      }

      return rendering;
    };

    reactiveRender._r = [2];
    this.render = initialRender;
  },
  componentWillUnmount: function componentWillUnmount() {
    if (isUsingStaticRendering === true) return;
    this.render.$mobx && this.render.$mobx.dispose();
    this.__$mobxIsUnmounted = true;

    if (isDevtoolsEnabled) {
      var node = findDOMNode$2(this);

      if (node && componentByNodeRegistery) {
        componentByNodeRegistery.delete(node);
      }

      renderReporter.emit({
        event: "destroy",
        component: this,
        node: node
      });
    }
  },
  componentDidMount: function componentDidMount() {
    if (isDevtoolsEnabled) {
      reportRendering(this);
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    if (isDevtoolsEnabled) {
      reportRendering(this);
    }
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    if (isUsingStaticRendering) {
      console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.");
    } // update on any state changes (as is the default)


    if (this.state !== nextState) {
      return true;
    } // update if props are shallowly not equal, inspired by PureRenderMixin
    // we could return just 'false' here, and avoid the `skipRender` checks etc
    // however, it is nicer if lifecycle events are triggered like usually,
    // so we return true here if props are shallowly modified.


    return isObjectShallowModified(this.props, nextProps);
  }
  /**
   * Observer function / decorator
   */

};

function observer(arg1, arg2) {
  if (typeof arg1 === "string") {
    throw new Error("Store names should be provided as array");
  }

  if (Array.isArray(arg1)) {
    // component needs stores
    if (!warnedAboutObserverInjectDeprecation) {
      warnedAboutObserverInjectDeprecation = true;
      console.warn('Mobx observer: Using observer to inject stores is deprecated since 4.0. Use `@inject("store1", "store2") @observer ComponentClass` or `inject("store1", "store2")(observer(componentClass))` instead of `@observer(["store1", "store2"]) ComponentClass`');
    }

    if (!arg2) {
      // invoked as decorator
      return function (componentClass) {
        return observer(arg1, componentClass);
      };
    } else {
      return inject$1.apply(null, arg1)(observer(arg2));
    }
  }

  var componentClass = arg1;

  if (componentClass.isMobxInjector === true) {
    console.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'");
  } // Stateless function component:
  // If it is function but doesn't seem to be a react class constructor,
  // wrap it to a react class automatically


  if (typeof componentClass === "function" && (!componentClass.prototype || !componentClass.prototype.render) && !componentClass.isReactClass && !react_2.isPrototypeOf(componentClass)) {
    var _class, _temp;

    return observer((_temp = _class = function (_Component) {
      inherits$1(_class, _Component);

      function _class() {
        classCallCheck$1(this, _class);
        return possibleConstructorReturn$1(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
      }

      createClass$5(_class, [{
        key: "render",
        value: function render() {
          return componentClass.call(this, this.props, this.context);
        }
      }]);
      return _class;
    }(react_2), _class.displayName = componentClass.displayName || componentClass.name, _class.contextTypes = componentClass.contextTypes, _class.propTypes = componentClass.propTypes, _class.defaultProps = componentClass.defaultProps, _temp));
  }

  if (!componentClass) {
    throw new Error("Please pass a valid component to 'observer'");
  }

  var target = componentClass.prototype || componentClass;
  mixinLifecycleEvents(target);
  componentClass.isMobXReactObserver = true;
  return componentClass;
}

observer._r = [2];

function mixinLifecycleEvents(target) {
  patch(target, "componentWillMount", true);
  ["componentDidMount", "componentWillUnmount", "componentDidUpdate"].forEach(function (funcName) {
    patch(target, funcName);
  });

  if (!target.shouldComponentUpdate) {
    target.shouldComponentUpdate = reactiveMixin.shouldComponentUpdate;
  }
} // TODO: support injection somehow as well?


mixinLifecycleEvents._r = [2];
var Observer = observer(function (_ref) {
  var children = _ref.children;
  return children();
});
Observer.propTypes = {
  children: function children(propValue, key, componentName, location, propFullName) {
    if (typeof propValue[key] !== "function") return new Error("Invalid prop `" + propFullName + "` of type `" + _typeof$3(propValue[key]) + "` supplied to" + " `" + componentName + "`, expected `function`.");
  }
};

var _class;

var _temp;

var specialReactKeys = {
  children: true,
  key: true,
  ref: true
};
var Provider = (_temp = _class = function (_Component) {
  inherits$1(Provider, _Component);

  function Provider() {
    classCallCheck$1(this, Provider);
    return possibleConstructorReturn$1(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
  }

  createClass$5(Provider, [{
    key: "render",
    value: function render() {
      return react_3.only(this.props.children);
    }
  }, {
    key: "getChildContext",
    value: function getChildContext() {
      var stores = {}; // inherit stores

      var baseStores = this.context.mobxStores;
      if (baseStores) for (var key in baseStores) {
        stores[key] = baseStores[key];
      } // add own stores

      for (var _key in this.props) {
        if (!specialReactKeys[_key] && _key !== "suppressChangedStoreWarning") stores[_key] = this.props[_key];
      }

      return {
        mobxStores: stores
      };
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      // Maybe this warning is too aggressive?
      if (Object.keys(nextProps).length !== Object.keys(this.props).length) console.warn("MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children");
      if (!nextProps.suppressChangedStoreWarning) for (var key in nextProps) {
        if (!specialReactKeys[key] && this.props[key] !== nextProps[key]) console.warn("MobX Provider: Provided store '" + key + "' has changed. Please avoid replacing stores as the change might not propagate to all children");
      }
    }
  }]);
  return Provider;
}(react_2), _class.contextTypes = {
  mobxStores: objectOrObservableObject
}, _class.childContextTypes = {
  mobxStores: objectOrObservableObject.isRequired
}, _temp);
if (!react_2) throw new Error('mobx-react requires React to be available');
if (!extras) throw new Error('mobx-react requires mobx to be available');
if (typeof reactDom_3 === "function") extras.setReactionScheduler(reactDom_3);else if (typeof unstable_batchedUpdates$1 === "function") extras.setReactionScheduler(unstable_batchedUpdates$1);

var onError = function onError(fn) {
  return errorsReporter.on(fn);
};
/* DevTool support */
// See: https://github.com/andykog/mobx-devtools/blob/d8976c24b8cb727ed59f9a0bc905a009df79e221/src/backend/installGlobalHook.js


onError._r = [2];

if ((typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ? 'undefined' : _typeof$3(__MOBX_DEVTOOLS_GLOBAL_HOOK__)) === 'object') {
  var mobx$1 = {
    spy: spy,
    extras: extras
  };
  var mobxReact = {
    renderReporter: renderReporter,
    componentByNodeRegistery: componentByNodeRegistery,
    trackComponents: trackComponents
  };

  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobxReact(mobxReact, mobx$1);
}

var _class$1;

function _applyDecoratedDescriptor$1$1(target, property, decorators, descriptor, context) {
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

  _proto.location = function location(key, value, force$$1) {
    throw new Error('implement');
  };

  return AbstractLocationStore;
}();
var BrowserLocationStore = (_class$1 =
/*#__PURE__*/
function (_AbstractLocationStor) {
  inheritsLoose$2(BrowserLocationStore, _AbstractLocationStor);

  function BrowserLocationStore(location, history) {
    var _this;

    _this = _AbstractLocationStor.call(this) || this;
    _this._location = void 0;
    _this._history = void 0;
    _this._ns = 'lom_app';
    _this._location = location;
    _this._history = history;
    return _this;
  }

  var _proto2 = BrowserLocationStore.prototype;

  _proto2._params = function _params() {
    return new URLSearchParams(this._location.search);
  };

  _proto2.location = function location(key, value, force$$1) {
    var params = this._params();

    if (value === undefined) return params.get(key);
    params.set(key, value);

    this._history.pushState(null, this._ns, "?" + params.toString());

    return value;
  };

  return BrowserLocationStore;
}(AbstractLocationStore), (_applyDecoratedDescriptor$1$1(_class$1.prototype, "location", [memkey], Object.getOwnPropertyDescriptor(_class$1.prototype, "location"), _class$1.prototype)), _class$1);
BrowserLocationStore._r = [0, [Location, History]];

function ErrorableView({
  error: error
}) {
  return lom_h("div", null, error instanceof mem.Wait ? lom_h("div", null, "Loading...") : lom_h("div", null, lom_h("h3", null, "Fatal error !"), lom_h("div", null, error.message), lom_h("pre", null, error.stack.toString())));
}

ErrorableView._r = [1];
var atomize = createReactWrapper(react_2, ErrorableView, new Injector([[AbstractLocationStore, new BrowserLocationStore(location, history)]]));

var lomCreateElement = createCreateElement(atomize, react_1);
global$1['lom_h'] = lomCreateElement;

var _class2$1;

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

  createClass$2(TodoModel, [{
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
var TodoService = (_class2$1 =
/*#__PURE__*/
function () {
  function TodoService() {}

  var _proto2 = TodoService.prototype;

  _proto2.addTodo = function addTodo(title) {
    var todo = new TodoModel({
      title: title
    }, this);
    var newTodos = this.todos.slice(0);
    newTodos.push(todo);
    this.todos = newTodos;
  };

  _proto2.saveTodo = function saveTodo(todo) {
    var _this2 = this;

    this.todos = this.todos.map(function (t) {
      return t.id === todo.id ? new TodoModel(todo, _this2) : t;
    });
  };

  _proto2.remove = function remove(id) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== id;
    });
  };

  _proto2.toggleAll = function toggleAll() {
    var _this3 = this;

    var completed = this.activeTodoCount > 0;
    this.todos = this.todos.map(function (todo) {
      return new TodoModel({
        title: todo.title,
        id: todo.id,
        completed: completed
      }, _this3);
    });
  };

  _proto2.clearCompleted = function clearCompleted() {
    var newTodos = [];
    var delIds = [];

    for (var i = 0; i < this.todos.length; i++) {
      var _todo = this.todos[i];

      if (_todo.completed) {
        delIds.push(_todo.id);
      } else {
        newTodos.push(_todo);
      }
    }

    this.todos = newTodos;
  };

  createClass$2(TodoService, [{
    key: "todos",
    get: function get$$1() {
      return [];
    },
    set: function set$$1(todos) {}
  }, {
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
}(), (_applyDecoratedDescriptor$2(_class2$1.prototype, "todos", [mem], Object.getOwnPropertyDescriptor(_class2$1.prototype, "todos"), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, "todos", [mem], Object.getOwnPropertyDescriptor(_class2$1.prototype, "todos"), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, "activeTodoCount", [mem], Object.getOwnPropertyDescriptor(_class2$1.prototype, "activeTodoCount"), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, "addTodo", [action], Object.getOwnPropertyDescriptor(_class2$1.prototype, "addTodo"), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, "saveTodo", [action], Object.getOwnPropertyDescriptor(_class2$1.prototype, "saveTodo"), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, "remove", [action], Object.getOwnPropertyDescriptor(_class2$1.prototype, "remove"), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, "toggleAll", [action], Object.getOwnPropertyDescriptor(_class2$1.prototype, "toggleAll"), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, "clearCompleted", [action], Object.getOwnPropertyDescriptor(_class2$1.prototype, "clearCompleted"), _class2$1.prototype)), _class2$1);

var _class$2;
var _class2$2;
var _temp$1;
var _initialiseProps;

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

var TODO_FILTER = {
  ALL: 'all',
  COMPLETE: 'complete',
  ACTIVE: 'active'
};
var TodoFilterService = (_class$2 = (_temp$1 = _class2$2 =
/*#__PURE__*/
function () {
  function TodoFilterService(TodoService$$1, locationStore) {
    _initialiseProps.call(this);

    this._todoService = TodoService$$1;
    this._locationStore = locationStore;
  }

  createClass$2(TodoFilterService, [{
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
}(), _class2$2.deps = [TodoService, AbstractLocationStore], _initialiseProps = function _initialiseProps() {
  this._todoService = void 0;
  this._locationStore = void 0;
}, _temp$1), (_applyDecoratedDescriptor$3(_class$2.prototype, "filteredTodos", [mem], Object.getOwnPropertyDescriptor(_class$2.prototype, "filteredTodos"), _class$2.prototype)), _class$2);
TodoFilterService._r = [0, [TodoService, AbstractLocationStore]];

var _class$3;
var _descriptor;
var _descriptor2;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$4(target, property, decorators, descriptor, context) {
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
var TodoToAdd = (_class$3 =
/*#__PURE__*/
function () {
  function TodoToAdd() {
    var _this = this;

    _initDefineProp(this, "title", _descriptor, this);

    _initDefineProp(this, "_props", _descriptor2, this);

    this.onKeyDown = function (e) {
      if (e.keyCode === ENTER_KEY && _this.title) {
        e.preventDefault();

        var text = _this.title.trim();

        if (text) {
          _this._props.addTodo(text);

          _this.title = '';
        }
      }
    };
  }

  var _proto = TodoToAdd.prototype;

  _proto.onInput = function onInput({
    target: target
  }) {
    this.title = target.value;
  };

  return TodoToAdd;
}(), (_descriptor = _applyDecoratedDescriptor$4(_class$3.prototype, "title", [mem], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor2 = _applyDecoratedDescriptor$4(_class$3.prototype, "_props", [props], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor$4(_class$3.prototype, "onInput", [action], Object.getOwnPropertyDescriptor(_class$3.prototype, "onInput"), _class$3.prototype)), _class$3);
function TodoHeaderView(_, {
  todoToAdd: todoToAdd
}) {
  return lom_h("header", {
    id: "header"
  }, lom_h("h1", null, "todos"), lom_h("input", {
    id: "new-todo",
    placeholder: "What needs to be done?",
    onInput: todoToAdd.onInput,
    value: todoToAdd.title,
    onKeyDown: todoToAdd.onKeyDown,
    autoFocus: true
  }));
}
TodoHeaderView._r = [1, [{
  todoToAdd: TodoToAdd
}]];
TodoHeaderView.deps = [{
  todoToAdd: TodoToAdd
}];

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

var _class$4;
var _descriptor$1;
var _descriptor2$1;
var _descriptor3;

function _initDefineProp$1(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$5(target, property, decorators, descriptor, context) {
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
var TodoItemService = (_class$4 =
/*#__PURE__*/
function () {
  function TodoItemService() {
    var _this = this;

    _initDefineProp$1(this, "editingId", _descriptor$1, this);

    _initDefineProp$1(this, "editText", _descriptor2$1, this);

    _initDefineProp$1(this, "_props", _descriptor3, this);

    this.beginEdit = function () {
      _this.editText = _this._props.todo.title;
      _this.editingId = _this._props.todo.id;
    };

    this.setFocus = function (el) {
      if (el) {
        setTimeout(function () {
          return el.focus();
        }, 0);
      }
    };

    this.cancel = function () {
      // this.editText = ''
      _this.editingId = null;
    };

    this.submit = function () {
      _this._props.todo.title = _this.editText;
      _this.editText = '';
      _this.editingId = null;
    };

    this.onKey = function (e) {
      if (e.which === ESCAPE_KEY) {
        _this.cancel();
      } else if (e.which === ENTER_KEY$1) {
        _this.submit();
      }
    };
  }

  var _proto = TodoItemService.prototype;

  _proto.setEditText = function setEditText(e) {
    this.editText = e.target.value;
  };

  return TodoItemService;
}(), (_descriptor$1 = _applyDecoratedDescriptor$5(_class$4.prototype, "editingId", [mem], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2$1 = _applyDecoratedDescriptor$5(_class$4.prototype, "editText", [mem], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor3 = _applyDecoratedDescriptor$5(_class$4.prototype, "_props", [props], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor$5(_class$4.prototype, "setEditText", [action], Object.getOwnPropertyDescriptor(_class$4.prototype, "setEditText"), _class$4.prototype)), _class$4);
function TodoItemView({
  todo: todo
}, todoItemService) {
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
    onDblClick: todoItemService.beginEdit
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
TodoItemView._r = [1, [TodoItemService]];
TodoItemView.deps = [TodoItemService];

function TodoPerfView(_, {
  todoService: todoService,
  todoFilterService: todoFilterService
}) {
  var todos = todoService.todos;
  return lom_h("div", null, lom_h(TodoHeaderView, {
    addTodo: todoService.addTodo
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
    return lom_h(TodoItemView, {
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

TodoPerfView._r = [1, [{
  todoService: TodoService,
  todoFilterService: TodoFilterService
}]];
TodoPerfView.deps = [{
  todoService: TodoService,
  todoFilterService: TodoFilterService
}];

reactDom_1(lom_h(TodoPerfView, null), document.getElementById('todoapp'));

}());
//# sourceMappingURL=bundle.js.map
