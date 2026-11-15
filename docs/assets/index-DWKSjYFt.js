(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value2) => objectToString.call(value2);
const toRawType = (value2) => {
  return toTypeString(value2).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return ((str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  });
};
const camelizeRE = /-\w/g;
const camelize = /* @__PURE__ */ cacheStringFunction((str) => {
  return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = /* @__PURE__ */ cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = /* @__PURE__ */ cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = /* @__PURE__ */ cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value2, oldValue) => !Object.is(value2, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value2, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value: value2
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value2) {
  if (isArray(value2)) {
    const res = {};
    for (let i = 0; i < value2.length; i++) {
      const item = value2[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value2) || isObject(value2)) {
    return value2;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, (match) => match.startsWith("/*") ? "" : match).split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value2) {
  let res = "";
  if (isString(value2)) {
    res = value2;
  } else if (isArray(value2)) {
    for (let i = 0; i < value2.length; i++) {
      const normalized = normalizeClass(value2[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value2)) {
    for (const name in value2) {
      if (value2[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value2) {
  return !!value2 || value2 === "";
}
function looseCompareArrays(a, b, seen) {
  if (a.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i], seen);
  }
  return equal;
}
function looseCompareCollections(a, b, seen) {
  if (a.size !== b.size) return false;
  const candidates = Array.from(b);
  const matched = new Uint8Array(candidates.length);
  for (const item of a) {
    let index = -1;
    for (let i = 0; i < candidates.length; i++) {
      if (!matched[i] && looseEqual(item, candidates[i], seen)) {
        index = i;
        break;
      }
    }
    if (index < 0) return false;
    matched[index] = 1;
  }
  return true;
}
function looseCompareObjects(a, b, seen) {
  let aValidType = isMap(a);
  let bValidType = isMap(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareCollections(a, b, seen) : false;
  }
  aValidType = isSet(a);
  bValidType = isSet(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareCollections(a, b, seen) : false;
  }
  const aKeysCount = Object.keys(a).length;
  const bKeysCount = Object.keys(b).length;
  if (aKeysCount !== bKeysCount) {
    return false;
  }
  for (const key in a) {
    const aHasKey = a.hasOwnProperty(key);
    const bHasKey = b.hasOwnProperty(key);
    if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key], seen)) {
      return false;
    }
  }
  return String(a) === String(b);
}
function looseCompareNested(a, b, seen, compare) {
  if (!seen) {
    seen = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
  }
  const [seenA, seenB] = seen;
  if (seenA.has(a) || seenB.has(b)) {
    return seenA.get(a) === b && seenB.get(b) === a;
  }
  seenA.set(a, b);
  seenB.set(b, a);
  const equal = compare(a, b, seen);
  seenA.delete(a);
  seenB.delete(b);
  return equal;
}
function looseEqual(a, b, seen) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareNested(a, b, seen, looseCompareArrays) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    return looseCompareNested(a, b, seen, looseCompareObjects);
  }
  return String(a) === String(b);
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
let activeEffectScope;
class EffectScope {
  // TODO isolatedDeclarations "__v_skip"
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this._on = 0;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this._warnOnRun = true;
    this.__v_skip = true;
    if (!detached && activeEffectScope) {
      if (activeEffectScope.active) {
        this.parent = activeEffectScope;
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      } else {
        this._active = false;
        this._warnOnRun = false;
      }
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        const scopes = this.scopes.slice();
        for (i = 0, l = scopes.length; i < l; i++) {
          scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          const scopes = this.scopes.slice();
          for (i = 0, l = scopes.length; i < l; i++) {
            scopes[i].resume();
          }
        }
        const effects = this.effects.slice();
        for (i = 0, l = effects.length; i < l; i++) {
          effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    if (++this._on === 1) {
      this.prevScope = activeEffectScope;
      activeEffectScope = this;
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (activeEffectScope === this) {
        activeEffectScope = this.prevScope;
      } else {
        let current = activeEffectScope;
        while (current) {
          if (current.prevScope === this) {
            current.prevScope = this.prevScope;
            break;
          }
          current = current.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        const scopes = this.scopes.slice();
        for (i = 0, l = scopes.length; i < l; i++) {
          scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope) {
      if (activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      } else {
        this.flags &= -2;
      }
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed = false) {
  sub.flags |= 8;
  if (isComputed) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail) tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
    return;
  }
  computed2.flags |= 2;
  const dep = computed2.dep;
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value2 = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value2, computed2._value)) {
      computed2.flags |= 128;
      computed2._value = value2;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  // TODO isolatedDeclarations "__v_skip"
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
    this.__v_skip = true;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function reactiveReadArray(array) {
  const raw = /* @__PURE__ */ toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  if (/* @__PURE__ */ isShallow(array)) return raw;
  if (!/* @__PURE__ */ isReadonly(array)) return raw.map(toReactive);
  return /* @__PURE__ */ isReactive(array) ? raw.map((item) => toReadonly(toReactive(item))) : raw.map(toReadonly);
}
function shallowReadArray(arr) {
  track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
function toWrapped(target, item) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
  }
  return toReactive(item);
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value2) => {
      value2[1] = toWrapped(this, value2[1]);
      return value2;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(
      this,
      "filter",
      fn,
      thisArg,
      (v) => v.map((item) => toWrapped(this, item)),
      arguments
    );
  },
  find(fn, thisArg) {
    return apply(
      this,
      "find",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(
      this,
      "findLast",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", (item) => toWrapped(this, item));
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const methodFn = arr[method];
  const iter = methodFn.call(arr);
  if (arr !== self2 && !/* @__PURE__ */ isShallow(self2)) {
    if (iter[Symbol.toStringTag] === "Array Iterator") {
      const wrapped = Object.create(Object.getPrototypeOf(iter));
      wrapped.next = () => wrapResult(iter.next(), wrapValue);
      if (methodFn !== arrayProto[method]) {
        Object.defineProperties(wrapped, {
          return: {
            get() {
              const fn = iter.return;
              return typeof fn === "function" ? fn.bind(iter) : fn;
            }
          },
          throw: {
            get() {
              const fn = iter.throw;
              return typeof fn === "function" ? fn.bind(iter) : fn;
            }
          }
        });
      }
      return wrapped;
    }
    iter._next = iter.next;
    iter.next = () => wrapResult(iter._next(), wrapValue);
  }
  return iter;
}
function wrapResult(result, wrapValue) {
  if (!result.done) {
    result.value = wrapValue(result.value);
  }
  return result;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  let wrappedFn = fn;
  let wrapInitialAccumulator = false;
  if (arr !== self2) {
    if (needsWrap) {
      wrapInitialAccumulator = args.length === 0;
      wrappedFn = function(acc, item, index) {
        if (wrapInitialAccumulator) {
          wrapInitialAccumulator = false;
          acc = toWrapped(self2, acc);
        }
        return fn.call(this, acc, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  const result = arr[method](wrappedFn, ...args);
  return wrapInitialAccumulator ? toWrapped(self2, result) : result;
}
function searchProxy(self2, method, args) {
  const arr = /* @__PURE__ */ toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
    args[0] = /* @__PURE__ */ toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = (/* @__PURE__ */ toRaw(self2))[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = /* @__PURE__ */ new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = /* @__PURE__ */ toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (/* @__PURE__ */ isRef(res)) {
      const value2 = targetIsArray && isIntegerKey(key) ? res : res.value;
      return isReadonly2 && isObject(value2) ? /* @__PURE__ */ readonly(value2) : value2;
    }
    if (isObject(res)) {
      return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value2, receiver) {
    let oldValue = target[key];
    const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
    if (!this._isShallow) {
      const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
      if (!/* @__PURE__ */ isShallow(value2) && !/* @__PURE__ */ isReadonly(value2)) {
        oldValue = /* @__PURE__ */ toRaw(oldValue);
        value2 = /* @__PURE__ */ toRaw(value2);
      }
      if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value2)) {
        if (isOldValueReadonly) {
          return true;
        } else {
          oldValue.value = value2;
          return true;
        }
      }
    }
    const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value2,
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (target === /* @__PURE__ */ toRaw(receiver) && result) {
      if (!hadKey) {
        trigger(target, "add", key, value2);
      } else if (hasChanged(value2, oldValue)) {
        trigger(target, "set", key, value2);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value2) => value2;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = /* @__PURE__ */ toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return extend(
      // inheriting all iterator properties
      Object.create(innerIterator),
      {
        // iterator protocol
        next() {
          const { value: value2, done } = innerIterator.next();
          return done ? { value: value2, done } : {
            value: isPair ? [wrap(value2[0]), wrap(value2[1])] : wrap(value2),
            done
          };
        }
      }
    );
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
      return target.size;
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value2, key) => {
        return callback.call(thisArg, wrap(value2), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value2) {
        const target = /* @__PURE__ */ toRaw(this);
        const proto = getProto(target);
        const rawValue = /* @__PURE__ */ toRaw(value2);
        const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value2) && !/* @__PURE__ */ isReadonly(value2) ? rawValue : value2;
        const hadKey = proto.has.call(target, valueToAdd) || hasChanged(value2, valueToAdd) && proto.has.call(target, value2) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue);
        if (!hadKey) {
          target.add(valueToAdd);
          trigger(target, "add", valueToAdd, valueToAdd);
        }
        return this;
      },
      set(key, value2) {
        if (!shallow && !/* @__PURE__ */ isShallow(value2) && !/* @__PURE__ */ isReadonly(value2)) {
          value2 = /* @__PURE__ */ toRaw(value2);
        }
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value2);
        if (!hadKey) {
          trigger(target, "add", key, value2);
        } else if (hasChanged(value2, oldValue)) {
          trigger(target, "set", key, value2);
        }
        return this;
      },
      delete(key) {
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = /* @__PURE__ */ toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  if (target["__v_skip"] || !Object.isExtensible(target)) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = targetTypeMap(toRawType(target));
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value2) {
  if (/* @__PURE__ */ isReadonly(value2)) {
    return /* @__PURE__ */ isReactive(value2["__v_raw"]);
  }
  return !!(value2 && value2["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value2) {
  return !!(value2 && value2["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value2) {
  return !!(value2 && value2["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value2) {
  return value2 ? !!value2["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value2) {
  if (!hasOwn(value2, "__v_skip") && Object.isExtensible(value2)) {
    def(value2, "__v_skip", true);
  }
  return value2;
}
const toReactive = (value2) => isObject(value2) ? /* @__PURE__ */ reactive(value2) : value2;
const toReadonly = (value2) => isObject(value2) ? /* @__PURE__ */ readonly(value2) : value2;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value2) {
  return createRef(value2, false);
}
function createRef(rawValue, shallow) {
  if (/* @__PURE__ */ isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value2, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value2 : /* @__PURE__ */ toRaw(value2);
    this._value = isShallow2 ? value2 : toReactive(value2);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
    newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value2, receiver) => {
    const oldValue = target[key];
    if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value2)) {
      oldValue.value = value2;
      return true;
    } else {
      return Reflect.set(target, key, value2, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (/* @__PURE__ */ isRef(source)) {
    getter = () => source.value;
    forceTrigger = /* @__PURE__ */ isShallow(source);
  } else if (/* @__PURE__ */ isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
    getter = () => source.map((s) => {
      if (/* @__PURE__ */ isRef(s)) {
        return s.value;
      } else if (/* @__PURE__ */ isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      try {
        return _cb(...args);
      } finally {
        watchHandle();
      }
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (immediateFirstRun || deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        const currentWatcher = activeWatcher;
        pauseTracking();
        try {
          if (cleanup) {
            cleanup();
          }
          activeWatcher = effect2;
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          oldValue = newValue;
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
        } finally {
          activeWatcher = currentWatcher;
          resetTracking();
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value2, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value2) || value2["__v_skip"]) {
    return value2;
  }
  seen = seen || /* @__PURE__ */ new Map();
  if ((seen.get(value2) || 0) >= depth) {
    return value2;
  }
  seen.set(value2, depth);
  depth--;
  if (/* @__PURE__ */ isRef(value2)) {
    traverse(value2.value, depth, seen);
  } else if (isArray(value2)) {
    for (let i = 0; i < value2.length; i++) {
      traverse(value2[i], depth, seen);
    }
  } else if (isSet(value2) || isMap(value2)) {
    value2.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value2)) {
    for (const key in value2) {
      traverse(value2[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value2)) {
      if (Object.prototype.propertyIsEnumerable.call(value2, key)) {
        traverse(value2[key], depth, seen);
      }
    }
  }
  return value2;
}
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value2, raw) {
  if (isString(value2)) {
    value2 = JSON.stringify(value2);
    return raw ? value2 : [`${key}=${value2}`];
  } else if (typeof value2 === "number" || typeof value2 === "boolean" || value2 == null) {
    return raw ? value2 : [`${key}=${value2}`];
  } else if (/* @__PURE__ */ isRef(value2)) {
    value2 = formatProp(key, /* @__PURE__ */ toRaw(value2.value), true);
    return raw ? value2 : [`${key}=Ref<`, value2, `>`];
  } else if (isFunction(value2)) {
    return [`${key}=fn${value2.name ? `<${value2.name}>` : ``}`];
  } else {
    value2 = /* @__PURE__ */ toRaw(value2);
    return raw ? value2 : [`${key}=`, value2];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type, void 0, true);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true, isAsyncError = false) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks && !cur.isUnmounted && // Async failures may outlive stopped scopes whose unmount effects
      // are deferred or discarded by Suspense.
      (!isAsyncError || cur.scope.active)) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    for (let i = 0; i < cb.length; i++) {
      pendingPostFlushCbs.push(cb[i]);
    }
  }
  queueFlush();
}
function flushPreFlushCbs(instance, minUid, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid || minUid !== void 0 && !(cb.id >= minUid)) {
        continue;
      }
      queue.splice(i, 1);
      i = instance ? i - 1 : flushIndex;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen, skip, minUid = 0) {
  if (pendingPostFlushCbs.length) {
    let cbs = pendingPostFlushCbs;
    let kept = 0;
    if (skip) {
      cbs = [];
      for (let i = 0; i < pendingPostFlushCbs.length; i++) {
        const cb = pendingPostFlushCbs[i];
        if (cb.i !== void 0 ? !cb.i || cb.i.uid < minUid : skip.has(cb)) {
          pendingPostFlushCbs[kept++] = cb;
        } else {
          cbs.push(cb);
        }
      }
    }
    const deduped = [...new Set(cbs)].sort((a, b) => getId(a) - getId(b));
    pendingPostFlushCbs.length = kept;
    if (activePostFlushCbs) {
      for (let i = 0; i < deduped.length; i++) {
        activePostFlushCbs.push(deduped[i]);
      }
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
let isFlushing = false;
function flushOnAppMount(fn, minUid) {
  if (isFlushing) {
    fn();
    return;
  }
  const queued = minUid === void 0 ? void 0 : new Set(pendingPostFlushCbs);
  fn();
  isFlushing = true;
  try {
    flushPreFlushCbs(void 0, minUid);
    flushPostFlushCbs(void 0, queued, minUid);
  } finally {
    isFlushing = false;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const prevStackSize = blockStack.length;
    let res;
    try {
      res = fn(...args);
    } finally {
      for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  let hookVNode = vnode;
  if (name === "beforeMount") {
    vnode._mount = vnode;
  } else if (name === "beforeUpdate") {
    const mount = prevVNode && prevVNode._mount;
    if (mount) {
      mount._latest = vnode;
      vnode._mount = mount;
    }
  } else if (name === "mounted") {
    const latest = vnode._latest;
    vnode._mount = vnode._latest = void 0;
    if (latest) {
      hookVNode = latest;
      latest._mount = void 0;
    }
  }
  const bindings = hookVNode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    let binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    } else if (name === "mounted" && binding.oldValue !== void 0) {
      binding = extend({}, binding, { oldValue: void 0 });
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        hookVNode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function provide(key, value2) {
  if (currentInstance) {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value2;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = getCurrentInstance();
  if (instance || currentApp) {
    let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
const ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      job.i = instance;
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value2, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value2)) {
    cb = value2;
  } else {
    cb = value2.handler;
    options = value2;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
const TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function findNonCommentChild(children) {
  let child = children[0];
  if (children.length > 1) {
    for (const c of children) {
      if (c.type !== Comment) {
        child = c;
        break;
      }
    }
  }
  return child;
}
function getInnerChild$1(vnode) {
  if (!isKeepAlive(vnode)) {
    if (isTeleport(vnode.type) && vnode.children) {
      return findNonCommentChild(vnode.children);
    }
    return vnode;
  }
  if (vnode.component) {
    return vnode.component.subTree;
  }
  const { shapeFlag, children } = vnode;
  if (children) {
    if (shapeFlag & 16) {
      return children[0];
    }
    if (shapeFlag & 32 && isFunction(children.default)) {
      return children.default();
    }
  }
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    const subTree = vnode.component.subTree;
    setTransitionHooks(
      isTeleport(subTree.type) ? getInnerChild$1(subTree) || subTree : subTree,
      hooks
    );
  } else if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    if (suspense) {
      const branch = suspense.isHydrating ? suspense.pendingBranch : suspense.activeBranch;
      if (branch) {
        setTransitionHooks(branch, hooks.clone(branch));
      }
    } else {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    }
  } else {
    vnode.transition = hooks;
    if (vnode.type === Fragment && isArray(vnode.children)) {
      const child = filterSingleRoot(vnode.children, false);
      if (child) {
        setTransitionHooks(child, hooks);
      }
    }
  }
}
function getTransitionRoot(vnode) {
  if (vnode.component) {
    return getTransitionRoot(vnode.component.subTree);
  }
  if (vnode.type === Fragment) {
    const child = isArray(vnode.children) && filterSingleRoot(vnode.children, false);
    return child ? getTransitionRoot(child) : void 0;
  }
  if (vnode.type !== Comment) {
    return vnode;
  }
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function isTemplateRefKey(refs, key) {
  let desc;
  return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value2 = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = /* @__PURE__ */ toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
    if (isTemplateRefKey(refs, key)) {
      return false;
    }
    return hasOwn(rawSetupState, key);
  };
  const canSetRef = (ref22, key) => {
    if (key && isTemplateRefKey(refs, key)) {
      return false;
    }
    return true;
  };
  if (oldRef != null && oldRef !== ref3) {
    invalidatePendingSetRef(oldRawRef);
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (/* @__PURE__ */ isRef(oldRef)) {
      const oldRawRefAtom = oldRawRef;
      if (canSetRef(oldRef, oldRawRefAtom.k)) {
        oldRef.value = null;
      }
      if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value2, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = /* @__PURE__ */ isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : canSetRef() || !rawRef.k ? ref3.value : refs[rawRef.k];
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                const newVal = [refValue];
                if (canSetRef(ref3, rawRef.k)) {
                  ref3.value = newVal;
                }
                if (rawRef.k) refs[rawRef.k] = newVal;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value2;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value2;
          }
        } else if (_isRef) {
          if (canSetRef(ref3, rawRef.k)) {
            ref3.value = value2;
          }
          if (rawRef.k) refs[rawRef.k] = value2;
        } else ;
      };
      if (value2) {
        const job = () => {
          doSet();
          pendingSetRefMap.delete(rawRef);
        };
        job.id = -1;
        pendingSetRefMap.set(rawRef, job);
        queuePostRenderEffect(job, parentSuspense);
      } else {
        invalidatePendingSetRef(rawRef);
        doSet();
      }
    }
  }
}
function invalidatePendingSetRef(rawRef) {
  const pendingSetRef = pendingSetRefMap.get(rawRef);
  if (pendingSetRef) {
    pendingSetRef.flags |= 8;
    pendingSetRefMap.delete(rawRef);
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  const removal = injectHook(
    "um",
    () => remove(keepAliveRoot[type], injected),
    target
  );
  removal.flags = 16;
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
    let needsWrap = false;
    let isReadonlySource = false;
    if (sourceIsReactiveArray) {
      needsWrap = !/* @__PURE__ */ isShallow(source);
      isReadonlySource = /* @__PURE__ */ isReadonly(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
        i,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source) || source < 0) {
      ret = [];
    } else {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (hasOwn(props, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value2) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value2;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value2;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value2;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, props, type }
  }, key) {
    let cssModules;
    return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = /* @__PURE__ */ reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val,
          enumerable: true
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (/* @__PURE__ */ isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app._instance,
            16
          );
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value2) {
        context.provides[key] = value2;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = args.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2);
  key = key === "Once" ? key : key.replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return /* @__PURE__ */ shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    const child = isTeleport(root.type) ? getInnerChild$1(root) || root : root;
    setTransitionHooks(child, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
function filterSingleRoot(children, recurse = true) {
  let singleRoot;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isVNode(child)) {
      if (child.type !== Comment || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (!hasOwn(prevProps, key) || hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
  const nextProp = nextProps[key];
  const prevProp = prevProps[key];
  if (key === "style" && isObject(nextProp) && isObject(prevProp)) {
    return !looseEqual(nextProp, prevProp);
  }
  return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.suspense.vnode.el = root.el = el;
      vnode = root;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
  if (suspense && suspense.activeBranch === vnode) {
    suspense.vnode.el = el;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = /* @__PURE__ */ toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value2 = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value2 !== attrs[key]) {
              attrs[key] = value2;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value2,
              instance,
              false
            );
          }
        } else {
          if (value2 !== attrs[key]) {
            attrs[key] = value2;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value2 = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value2;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value2;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value2 !== attrs[key]) {
          attrs[key] = value2;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = /* @__PURE__ */ toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value2, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value2 === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value2 = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value2 = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value2 = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value2);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value2 = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value2 === "" || value2 === hyphenate(key))) {
        value2 = true;
      }
    }
  }
  return value2;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
const normalizeSlotValue = (value2) => isArray(value2) ? value2.map(normalizeVNode) : [normalizeVNode(value2)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value2 = rawSlots[key];
    if (isFunction(value2)) {
      slots[key] = normalizeSlot(key, value2, ctx);
    } else if (value2 != null) {
      const normalized = normalizeSlotValue(value2);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || !isInternalKey(key)) {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    if (n2.dynamicChildren && n1 && n1.dynamicChildren && n1.dynamicChildren.hasOnce) {
      if (n2.dynamicChildren === EMPTY_ARR) {
        n2.dynamicChildren = [];
      }
      n2.dynamicChildren.hasOnce = true;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    } else if (ref3 == null && n1 && n1.ref != null) {
      setRef(n1.ref, null, parentSuspense, n1, true);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
      try {
        if (customElement) {
          customElement._beginPatch();
        }
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } finally {
        if (customElement) {
          customElement._endPatch();
        }
      }
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    } else if (transition && !transition.persisted) {
      el[deferredEnterKey] = true;
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        try {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        } finally {
        }
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (
      // #6385 the old vnode may be a user-wrapped non-isomorphic block
      // Force full diff when block metadata is unstable.
      dynamicChildren && (!n1.dynamicChildren || n1.dynamicChildren.length !== dynamicChildren.length)
    ) {
      patchFlag = 0;
      optimized = false;
      dynamicChildren = null;
    }
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const oldEl = oldVNode.el || resolveAsyncComponentPlaceholder(oldVNode);
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldEl && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldEl) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(
        instance,
        setupRenderEffect,
        optimized,
        namespace
      );
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
        initialVNode.placeholder = placeholder.el;
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        n2.el = n1.el;
        n2.placeholder = n1.placeholder;
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      n2.placeholder = n1.placeholder;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce && root.ce._hasShadowRoot()) {
            root.ce._injectChildStyle(
              type,
              instance.parent ? instance.parent.type : void 0
            );
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const unresolvedAsyncRoot = locateUnresolvedAsyncRoot(instance);
          if (unresolvedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            unresolvedAsyncRoot.asyncDep.then(() => {
              const retry = () => {
                if (instance.job.flags & 8) return;
                if (parentSuspense && parentSuspense.pendingBranch) {
                  queuePostRenderEffect(retry, parentSuspense);
                } else {
                  update();
                }
              };
              retry.flags = 16 | 32;
              queuePostRenderEffect(retry, parentSuspense);
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport. a root that is a
          // pending async component only has its placeholder comment
          hostParentNode(
            prevTree.el || resolveAsyncComponentPlaceholder(prevTree)
          ),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchorVNode = c2[nextIndex + 1];
        const anchor = nextIndex + 1 < l2 ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
        ) : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        if (transition.persisted && !el[leaveCbKey]) {
          hostInsert(el, container, anchor);
        } else {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        }
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => {
          if (vnode.ctx.isUnmounted) {
            hostRemove(el);
          } else {
            hostInsert(el, container, anchor);
          }
        };
        const performLeave = () => {
          const wasLeaving = el._isLeaving || !!el[leaveCbKey];
          if (el._isLeaving) {
            el[leaveCbKey](
              true
              /* cancelled */
            );
          }
          if (transition.persisted && !wasLeaving) {
            remove22();
          } else {
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          }
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex,
      memo
    } = vnode;
    if (patchFlag === -2 || dynamicChildren && dynamicChildren.hasOnce) {
      optimized = false;
    }
    if (ref3 != null) {
      pauseTracking();
      setRef(ref3, null, parentSuspense, vnode, true);
      resetTracking();
    }
    if (cacheIndex != null && (!vnode.ctx || vnode.ctx === parentComponent)) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256 && parentComponent.ctx.deactivate(vnode)) {
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    const shouldInvalidateMemo = memo != null && cacheIndex == null;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        if (shouldInvalidateMemo) {
          vnode.el = null;
        }
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    const isFragment = type === Fragment;
    if (isFragment && !transition) {
      removeFragment(el, anchor);
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
      return;
    }
    const leavingNode = isFragment ? getTransitionRoot(vnode) : vnode;
    const performRemove = () => {
      if (isFragment) {
        if (hostParentNode(el)) {
          removeFragment(el, anchor);
        }
      } else {
        hostRemove(el);
      }
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (leavingNode && leavingNode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const leavingEl = leavingNode.el;
      const performLeave = () => leave(leavingEl, performRemove);
      if (delayLeave) {
        delayLeave(leavingEl, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    } else if (subTree) {
      subTree.transition = instance.vnode.transition;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    const markUnmounted = () => {
      instance.isUnmounted = true;
    };
    markUnmounted.flags = 16;
    queuePostRenderEffect(markUnmounted, parentSuspense);
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  const render = (vnode, container, namespace) => {
    const minUid = vnode && container._vnode ? void 0 : vnode && vnode.component ? vnode.component.uid : getNextUid();
    flushOnAppMount(() => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      container._vnode = vnode;
    }, minUid);
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        if (c2.patchFlag === -1) {
          c2 = ch2[i] = cloneIfMounted(c2);
        }
        c2.el = c1.el;
      }
      if (c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateUnresolvedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateUnresolvedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
  if (anchorVnode.placeholder) {
    return anchorVnode.placeholder;
  }
  const instance = anchorVnode.component;
  if (instance) {
    return resolveAsyncComponentPlaceholder(instance.subTree);
  }
  const suspense = anchorVnode.suspense;
  if (suspense && suspense.activeBranch) {
    return resolveAsyncComponentPlaceholder(suspense.activeBranch);
  }
  return null;
}
const isSuspense = (type) => type.__isSuspense;
const deferredEnterKey = /* @__PURE__ */ Symbol("_deferredEnter");
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
const Text = /* @__PURE__ */ Symbol.for("v-txt");
const Comment = /* @__PURE__ */ Symbol.for("v-cmt");
const Static = /* @__PURE__ */ Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value2, inVOnce = false) {
  isBlockTreeEnabled += value2;
  if (value2 < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value2) {
  return value2 ? value2.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || /* @__PURE__ */ isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (/* @__PURE__ */ isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  if (/* @__PURE__ */ isProxy(props)) return extend({}, props);
  return isInternalObject(props) ? extend({}, props[rawAttrsKey] || props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    placeholder: vnode.placeholder,
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce,
    cacheIndex: vnode.cacheIndex
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    if (shapeFlag & (1 | 64)) {
      normalizeChildren(vnode, { default: children });
      return;
    }
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        } else if (incoming == null && existing == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !isModelListener(key)) {
          ret[key] = incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = /* @__PURE__ */ createAppContext();
let uid = 0;
function getNextUid() {
  return uid;
}
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized || isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          setInSSRSetupState(true);
          try {
            handleSetupResult(instance, resolvedResult, isSSR);
          } finally {
            setInSSRSetupState(false);
          }
        }).catch((e) => {
          handleError(e, instance, 0, void 0, true);
          instance.ssrRender = (_, push) => push("<!---->");
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const rawAttrsKey = /* @__PURE__ */ Symbol();
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return key === rawAttrsKey ? target : target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])\w/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
      instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value2) {
  return isFunction(value2) && "__vccOpts" in value2;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
const version = "3.5.45";
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = /* @__PURE__ */ Symbol("_vtc");
function patchClass(el, value2, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value2 = (value2 ? [value2, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value2 == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value2);
  } else {
    el.className = value2;
  }
}
const vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
const vShowHidden = /* @__PURE__ */ Symbol("_vsh");
const CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
const displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      const value2 = next[key];
      if (value2 != null) {
        if (!shouldPreserveTextareaResizeStyle(
          el,
          key,
          !isString(prev) && prev ? prev[key] : void 0,
          value2
        )) {
          setStyle(style, key, value2);
        }
      } else {
        setStyle(style, key, "");
      }
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    if (!isCssString || prev !== next) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    }
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      if (importantRE.test(val)) {
        style.setProperty(name, val.replace(importantRE, ""), "important");
      } else {
        style.setProperty(name, val);
      }
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
  return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value2, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value2 == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value2);
    }
  } else {
    if (value2 == null || isBoolean && !includeBooleanAttr(value2)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value2) ? String(value2) : value2
      );
    }
  }
}
function patchDOMProp(el, key, value2, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value2 != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value2) : value2;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value2 == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value2);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value2 == null) {
      el.removeAttribute(key);
    }
    el._value = value2;
    return;
  }
  let needRemove = false;
  if (value2 === "" || value2 == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value2 = includeBooleanAttr(value2);
    } else if (value2 == null && type === "string") {
      value2 = "";
      needRemove = true;
    } else if (type === "number") {
      value2 = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value2;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(Once|Passive|Capture)$/;
const optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  let m;
  while ((m = name.match(optionsModifierRE)) && !optionsModifierEventRE.test(name)) {
    if (!options) options = {};
    name = name.slice(0, name.length - m[1].length);
    options[m[1].toLowerCase()] = true;
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    const value2 = invoker.value;
    if (isArray(value2)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      const handlers = value2.slice();
      const args = [e];
      for (let i = 0; i < handlers.length; i++) {
        if (e._stopped) {
          break;
        }
        const handler = handlers[i];
        if (handler) {
          callWithAsyncErrorHandling(
            handler,
            instance,
            5,
            args
          );
        }
      }
    } else {
      callWithAsyncErrorHandling(
        value2,
        instance,
        5,
        [e]
      );
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && // #12408 check if it's declared prop or it's async custom element
    (shouldSetAsPropForVueCE(el, key) || // @ts-expect-error _def is private
    el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value2, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value2)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
    return false;
  }
  if (key === "sandbox" && el.tagName === "IFRAME") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value2)) {
    return false;
  }
  return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
  const props = (
    // @ts-expect-error _def is private
    el._def.props
  );
  if (!props) {
    return false;
  }
  const camelKey = camelize(key);
  return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  if (!fn) return fn;
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
    }
    return fn(event, ...args);
  }));
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
});
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const _hoisted_1$2 = { class: "mb-3" };
const _hoisted_2$2 = { class: "form-label fw-bold" };
const _hoisted_3$2 = { class: "d-flex flex-wrap gap-2" };
const _hoisted_4$2 = { class: "form-check-label" };
const _hoisted_5$1 = ["value", "checked"];
const _hoisted_6$1 = { class: "p-2" };
const _sfc_main$2 = {
  __name: "DNDFilter",
  props: {
    name: String,
    options: Array,
    filters: Array
  },
  setup(__props) {
    const props = __props;
    function onChangeCheckbox(event) {
      const input = event.target;
      if (input.checked) {
        if (!props.filters.includes(input.value))
          props.filters.push(input.value);
        props.filters.sort();
      } else {
        const i = props.filters.indexOf(input.value);
        props.filters.splice(i, 1);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("label", _hoisted_2$2, toDisplayString(props.name), 1),
        _cache[1] || (_cache[1] = createBaseVNode("br", null, null, -1)),
        createBaseVNode("div", _hoisted_3$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(props.options, (item) => {
            return openBlock(), createElementBlock("label", _hoisted_4$2, [
              createBaseVNode("input", {
                type: "checkbox",
                class: "form-check-input",
                value: item,
                checked: __props.filters.includes(item),
                onChange: _cache[0] || (_cache[0] = ($event) => onChangeCheckbox($event))
              }, null, 40, _hoisted_5$1),
              createBaseVNode("span", _hoisted_6$1, toDisplayString(item), 1)
            ]);
          }), 256))
        ])
      ]);
    };
  }
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$1 = { class: "table table-bordered table-hover align-middle text-center" };
const _hoisted_2$1 = { class: "table-secondary" };
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = ["checked", "onClick"];
const _sfc_main$1 = {
  __name: "DNDTable",
  props: {
    spells: Array
  },
  setup(__props) {
    const props = __props;
    const sortName = /* @__PURE__ */ ref(0);
    const sortType = /* @__PURE__ */ ref(0);
    const sortLevel = /* @__PURE__ */ ref(0);
    const sortClasses = /* @__PURE__ */ ref(0);
    function sort(key, dir) {
      if (key == "classes") {
        if (dir & 1) {
          props.spells.sort((a, b) => b.classes.length - a.classes.length);
        } else {
          props.spells.sort((a, b) => a.classes.length - b.classes.length);
        }
      } else {
        if (dir & 1) {
          props.spells.sort((a, b) => b[key].localeCompare(a[key]));
        } else {
          props.spells.sort((a, b) => a[key].localeCompare(b[key]));
        }
      }
    }
    function toggle(spell) {
      spell.printOut = !spell.printOut;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("table", _hoisted_1$1, [
        createBaseVNode("thead", _hoisted_2$1, [
          createBaseVNode("tr", null, [
            _cache[4] || (_cache[4] = createBaseVNode("th", null, "#", -1)),
            createBaseVNode("th", {
              onClick: _cache[0] || (_cache[0] = ($event) => sort("name", sortName.value++))
            }, "Nome"),
            createBaseVNode("th", {
              onClick: _cache[1] || (_cache[1] = ($event) => sort("level", sortLevel.value++))
            }, "Level"),
            createBaseVNode("th", {
              onClick: _cache[2] || (_cache[2] = ($event) => sort("type", sortType.value++))
            }, "Type"),
            createBaseVNode("th", {
              onClick: _cache[3] || (_cache[3] = ($event) => sort("classes", sortClasses.value++))
            }, "Class")
          ])
        ]),
        createBaseVNode("tbody", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(props.spells, (spell) => {
            return openBlock(), createElementBlock("tr", {
              class: normalizeClass(spell.printOut ? "" : "tr-disabled"),
              onClick: ($event) => toggle(spell)
            }, [
              createBaseVNode("td", null, [
                createBaseVNode("input", {
                  type: "checkbox",
                  checked: spell.printOut,
                  onClick: withModifiers(($event) => toggle(spell), ["stop"])
                }, null, 8, _hoisted_4$1)
              ]),
              createBaseVNode("td", null, toDisplayString(spell.name), 1),
              createBaseVNode("td", null, toDisplayString(spell.level), 1),
              createBaseVNode("td", null, toDisplayString(spell.type), 1),
              createBaseVNode("td", null, toDisplayString(spell.classes.join(" ")), 1)
            ], 10, _hoisted_3$1);
          }), 256))
        ])
      ]);
    };
  }
};
const DNDTable = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-13ff2b33"]]);
class Rect extends Int16Array {
  constructor(x, y, w, h) {
    super([x, y, w, h]);
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get width() {
    return this[2];
  }
  get height() {
    return this[3];
  }
  set x(n) {
    this[0] = n;
  }
  set y(n) {
    this[1] = n;
  }
  set width(n) {
    this[2] = n;
  }
  set height(n) {
    this[3] = n;
  }
  toJSON() {
    return Array.from(this);
  }
}
class RendererOptions {
  constructor(data) {
    this.width = data.width || 63;
    this.height = data.height || 85;
    this.space = 0.75;
    this.fontSize = data.fontSize || 2;
    this.bound = new Rect(5, 7.5, 63 - 10, 73 - 7);
  }
}
class RendererContext {
  constructor() {
    this.streams = [];
    this.currentStream = null;
  }
  append(stream) {
    this.streams.push(stream);
    this.currentStream = stream;
  }
}
const measureText = (function() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  return function(text, font) {
    if (font) context.font = font;
    return context.measureText(text);
  };
}).call();
class Word {
  static NORMAL = "NORMAL";
  static BOLD = "BOLD";
  static ITALIC = "ITALIC";
  static BOLD_ITALIC = "BOLD_ITALIC";
  constructor(x, y, content, type = Word.NORMAL, fontSize = 2, fontFamily = "Arial") {
    this.x = x;
    this.y = y;
    this.content = String(content);
    this.type = type;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    let fontStyle = "";
    switch (type) {
      case Word.BOLD:
        fontStyle = "bold ";
        break;
      case Word.ITALIC:
        fontStyle = "italic ";
        break;
      case Word.BOLD_ITALIC:
        fontStyle = "italic bold ";
        break;
    }
    const font = `${fontStyle}${parseInt(fontSize * 10)}px ${fontFamily}`;
    this.width = measureText(this.content, font).width / 10;
  }
}
const SPLITTER = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|\*[\s\S]+?\*)/g;
class Paragraph extends Array {
  static Create(px, py, text, maxWidth, space = 0.75, fontSize = 2, fontFamily = "Arial") {
    const paragraph = new Paragraph();
    const segments = String(text).split(SPLITTER);
    let x = 0;
    let y = 0;
    for (const segment of segments) {
      if (!segment) continue;
      let type = Word.NORMAL;
      let content = segment;
      if (segment.startsWith("***") && segment.endsWith("***")) {
        type = Word.BOLD_ITALIC;
        content = segment.slice(3, -3);
      } else if (segment.startsWith("**") && segment.endsWith("**")) {
        type = Word.BOLD;
        content = segment.slice(2, -2);
      } else if (segment.startsWith("*") && segment.endsWith("*")) {
        type = Word.ITALIC;
        content = segment.slice(1, -1);
      }
      for (const token of content.trim().split(/\s+/)) {
        if (!token) continue;
        const word = new Word(0, 0, token, type, fontSize, fontFamily);
        if (x > 0 && x + word.width > maxWidth) {
          x = 0;
          y -= fontSize + 0.15;
        }
        word.x = px + x;
        word.y = py + y;
        paragraph.push(word);
        x += word.width + space;
      }
    }
    return paragraph;
  }
  countLines() {
    if (this.length === 0)
      return 0;
    let count = 1;
    let y = this[0].y;
    for (let i = 1; i < this.length; i++) {
      if (this[i].y !== y) {
        y = this[i].y;
        count++;
      }
    }
    return count;
  }
  translate(tx, ty) {
    for (const word of this) {
      word.x += tx;
      word.y += ty;
    }
  }
}
const VOID = "";
const LF = String.fromCharCode(10);
const CR = String.fromCharCode(13);
const SP = String.fromCharCode(32);
const CRLF = CR + LF;
let UID_COUNT = 0;
function getUID(type) {
  return type.slice(3, 5) + (UID_COUNT++).toString(16).toUpperCase();
}
function toPostScript(input) {
  if (input === void 0) return VOID;
  if (input === null) return "null";
  if (/^PDF/.test(input.constructor.name)) {
    return input.getObjectR();
  } else if (input instanceof Array) {
    return arrayToPostScript(input);
  } else if (typeof input == "object") {
    return objectToPostScript(input);
  } else {
    switch (typeof input) {
      case "number":
        return input.toString();
      case "boolean":
        return input === true ? "true" : "false";
      case "string":
        let e = input.charAt(0);
        if (e != "<" && e != "(")
          return input === "" ? "" : "/" + input;
        return input;
    }
  }
  return VOID;
}
function arrayToPostScript(input) {
  let output = [];
  for (let value2 of input) {
    if (value2 === void 0) continue;
    output.push(toPostScript(value2));
  }
  return "[" + output.join(SP) + "]";
}
function objectToPostScript(object) {
  let output = [];
  for (let key in object) {
    let value2 = object[key];
    if (value2 === void 0) continue;
    output.push("/" + key + SP + toPostScript(value2));
  }
  return "<<" + output.join(SP) + ">>";
}
function PDFObject(primitive) {
  return class PDFObject extends primitive {
    #name = null;
    #objectNumber = 0;
    #generationNumber = 0;
    constructor() {
      super(...arguments);
      this.#name = getUID(this.constructor.name);
    }
    getObjectHeader() {
      return this.#objectNumber + SP + this.#generationNumber + SP + "obj";
    }
    getObjectName() {
      return this.#name;
    }
    getObjectR() {
      return this.#objectNumber + SP + this.#generationNumber + SP + "R";
    }
    setObjectR(objectNumber, generationNumber = 0) {
      this.#objectNumber = objectNumber;
      this.#generationNumber = generationNumber;
    }
  };
}
class PDFDictionary extends PDFObject(Object) {
  constructor(object) {
    super();
    if (typeof object == "object")
      Object.assign(this, object);
  }
  toString() {
    return this.getObjectHeader() + CRLF + objectToPostScript(this) + CRLF + "endobj";
  }
}
class PDFArray extends PDFObject(Array) {
  toString() {
    return this.getObjectHeader() + CRLF + arrayToPostScript(this) + CRLF + "endobj";
  }
}
const decoder = new TextDecoder();
class PDFStream extends PDFDictionary {
  #data = "";
  constructor(data = "", object) {
    super(object);
    this.#data = data;
    if (!("Length" in this))
      this.Length = 0;
  }
  get stream() {
    return this.#data;
  }
  set stream(values) {
    this.#data = values;
  }
  toString() {
    let stream = this.#data;
    if (stream instanceof Uint8Array)
      stream = decoder.decode(stream);
    this.Length = stream.length;
    return this.getObjectHeader() + CRLF + objectToPostScript(this) + CRLF + "stream" + CRLF + stream + CRLF + "endstream" + CRLF + "endobj";
  }
}
class PDFString extends PDFObject(String) {
  toString() {
    return this.getObjectHeader() + CRLF + "/" + this.valueOf() + CRLF + "endobj";
  }
  static HexadecimalEncode(input, fill = "00") {
    var output = "", length = fill.length;
    if (!(typeof input == "string"))
      input = input.toString();
    for (var e of input) output += (fill + e.charCodeAt().toString(16)).slice(-length);
    return output;
  }
  static HexadecimalDecode(input) {
    if (!(typeof input == "string"))
      input = input.toString();
    input = input.replace(/[<>]/g, "");
    var output = "";
    for (var i = 0; i < input.length; i += 2) {
      var code = input.charAt(i) + input.charAt(i + 1);
      output += String.fromCharCode(parseInt(code, 16));
    }
    return output;
  }
}
class PDFCatalog extends PDFDictionary {
  constructor() {
    super();
    this.Type = "Catalog";
    this.Pages = void 0;
  }
}
class PDFFont extends PDFDictionary {
  /** constructor
   *	
   *	@param {String} base
   *	@param {String} subtype
   *	@param {String} encode
   */
  constructor(base = "Helvetica", subtype = "Type1", encode = "WinAnsiEncoding") {
    super();
    this.Type = "Font";
    this.Subtype = subtype;
    this.BaseFont = base;
    if (typeof encode == "string")
      this.Encoding = encode;
  }
}
var imageCanvas = document.createElement("canvas");
imageCanvas.getContext("2d");
class PDFResources extends PDFDictionary {
  /**	add
   *
   *	@param (PDFColorSpace) arguments
   *		or (PDFImage) arguments
   *		or (PDFState) arguments
   *		or (PDFFont) arguments
   */
  add() {
    for (var object of arguments) {
      var name = object.getObjectName();
      switch (object.constructor.name) {
        case "PDFColorSpace":
          if (!("ColorSpace" in this))
            this.ColorSpace = new Object();
          this.ColorSpace[name] = object;
          break;
        case "PDFImage":
          if (!("XObject" in this))
            this.XObject = new Object();
          this.XObject[name] = object;
          break;
        case "PDFExtGState":
          if (!("ExtGState" in this))
            this.ExtGState = new Object();
          this.ExtGState[name] = object;
          break;
        case "PDFFont":
          if (!("Font" in this))
            this.Font = new Object();
          this.Font[name] = object;
          break;
        default:
          console.log(object);
          throw "PDFResources.add: @param can't add to resources";
      }
    }
  }
}
class PDFPage extends PDFDictionary {
  constructor(w = 210, h = 297, x = 0, y = 0) {
    super();
    this.Type = "Page";
    this.Parent = void 0;
    this.Contents = new Array();
    this.Annots = new Array();
    var viewport = [x, y, w, h];
    this.MediaBox = viewport;
    this.CropBox = viewport;
    this.TrimBox = viewport;
  }
  /**	append
   *
   *	@param (PDFStream) arguments
   *		or (PDFAnnotation) arguments
   */
  append() {
    for (var object of arguments) {
      switch (object.constructor.name) {
        case "PDFStream":
          this.Contents.push(object);
          if (object.using) this.use(...Object.values(object.using));
          break;
        case "PDFAnnot":
          this.Annots.push(object);
          break;
        default:
          console.warn("PDFPage.append: @param is't PDFStream or PDFAnnot", object);
          break;
      }
    }
  }
  /**	use
   *
   *	@param (PDFColorSpace) arguments
   *		or (PDFImage) arguments
   *		or (PDFState) arguments
   *		or (PDFFont) arguments
   */
  use() {
    if (!("Resources" in this)) this.Resources = new PDFResources();
    this.Resources.add(...arguments);
  }
  /** setViewport
   *	
   */
  setViewport(w, h, x = 0, y = 0) {
    var viewport = [x, y, w, h];
    this.MediaBox = viewport;
    this.CropBox = viewport;
    this.TrimBox = viewport;
  }
}
class PDFPages extends PDFDictionary {
  constructor() {
    super();
    this.Type = "Pages";
    this.Kids = new Array();
    this.Count = 0;
  }
  /**	append
   *
   *	@param {PDFPage} 
   */
  append() {
    for (var object of arguments) {
      if (object instanceof PDFPage) {
        this.Count = this.Kids.push(object);
        object.Parent = this;
      } else {
        console.warn("PDFPages.append: @param is't a PDFPage", object);
      }
    }
  }
}
class PDFTrailer {
  constructor(data) {
    this.Root = void 0;
    this.Size = 1;
    for (let key in data)
      this[key] = data[key];
  }
  toString() {
    return "trailer" + CRLF + objectToPostScript(this) + CRLF;
  }
}
class PDFDocument {
  #name = "pdf-document";
  #version = "1.6";
  #blob = null;
  #url = null;
  #cache = null;
  constructor(name = "pdf-document", version2 = "1.6") {
    this.#name = name;
    this.#version = version2;
    this.trailer = new PDFTrailer();
  }
  get Pages() {
    if (this.trailer)
      return this.trailer.Root.Pages;
    return null;
  }
  get blob() {
    return this.#blob || this.createBlob();
  }
  get URL() {
    if (this.#url == null)
      this.createBlob();
    return this.#url;
  }
  updateXRef() {
    let i = 1;
    for (let key in this) {
      if (key != "trailer")
        this[key].setObjectR(i++, 0);
    }
  }
  /**	attach
   *
   *	@param {PDFDictionary} arguments
   */
  attach() {
    for (let object of arguments) {
      if (object instanceof PDFDictionary || object instanceof PDFArray) {
        let name = object.getObjectName();
        if (object instanceof PDFPage) this.Pages.append(object);
        if (this[name] === void 0)
          this[name] = object;
        attach_object(this, object);
      } else {
        console.warn("PDFDocument.attach: @param is't a PDFDictionary", object);
      }
    }
  }
  /**	open
   *
   *	@param {Number} width
   *	@param {Number} height
   *	@return {Window}
   */
  open(width = 420, height = 594) {
    var x = (innerWidth - width) / 2, y = (innerHeight - height) / 2;
    return window.open(this.URL, "_blank", "width=" + width + ",height=" + height + ",top=" + y + ",left=" + x);
  }
  /**	open
   *
   *	@param {HTMLElement} parentNode
   *	@param {Number} width
   *	@param {Number} height
   *	@param {Object} data				Optional
   *	@return {HTMLElementIframe}
   */
  preview(parentNode, w, h, data) {
    let string = "";
    if (data) {
      string += "#";
      for (let key in data)
        string += (string == "" ? "" : "&") + key + "=" + data[key];
    }
    let iframe = document.createElement("iframe");
    iframe.src = this.URL + string;
    iframe.width = w || parentNode.clientWidth;
    iframe.height = h || parentNode.clientHeight;
    iframe.style.border = "none";
    if (parentNode instanceof HTMLElement)
      parentNode.appendChild(iframe);
    return iframe;
  }
  /**	open
   *
   *	@param {String} filename		Optional
   */
  download(filename = this.name) {
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.download = filename + ".pdf";
    link.href = this.URL;
    link.click();
    link.remove();
  }
  /** createBlob
   *
   * 	@ref https://stackoverflow.com/questions/32510273/javascript-blob-encoding-as-utf-8-instead-of-ansi
   *
   *	@return {Blob}
   */
  createBlob() {
    if (this.#url != null)
      URL.revokeObjectURL(this.#url);
    let blob = new Blob([this.toBuffer()], { type: "application/pdf" });
    this.#blob = blob;
    this.#url = URL.createObjectURL(blob);
    return blob;
  }
  toDataURL() {
    return "data:application/pdf;base64," + btoa(this.toString());
  }
  /** toBuffer
   *	
   *	@return {Uint8Array}
   */
  toBuffer() {
    let source = this.toString(), length = source.length, buffer = new Uint8Array(length);
    for (let i = 0; i < length; i++)
      buffer[i] = source.charCodeAt(i);
    return buffer;
  }
  /** toString
   *
   *	@return {String}
   */
  toString(force = false) {
    if (force || this.#cache != null) return this.#cache;
    let output = "%PDF-" + this.#version + CRLF;
    this.updateXRef();
    this.trailer.Size = Object.keys(this).length + 1;
    for (let key in this) {
      if (key != "trailer")
        output += this[key].toString() + CRLF;
    }
    output += "xref" + CRLF + "0" + SP + this.trailer.Size + CRLF + "0000000000 65535 f" + CRLF;
    for (let key in this) {
      if (key == "trailer") continue;
      let offset = output.indexOf(this[key].getObjectHeader());
      output += ("0000000000" + offset).slice(-10) + " 00000 n" + CRLF;
    }
    output += this.trailer.toString();
    return output + "startxref" + CRLF + output.indexOf("xref") + CRLF + "%%EOF";
  }
}
function attach_array(target, array) {
  for (let item of array) {
    if (item instanceof PDFDictionary || item instanceof PDFArray) {
      if (target[item.getObjectName()] === void 0) {
        target.attach(item);
      }
    } else if (typeof value == "object") {
      attach_object(target, value);
    }
  }
}
function attach_object(target, object) {
  for (let key in object) {
    if (object.hasOwnProperty(key) === false) continue;
    let value2 = object[key];
    if (value2 instanceof PDFDictionary || value2 instanceof PDFArray) {
      if (target[value2.getObjectName()] === void 0) {
        target.attach(value2);
      }
    } else if (Array.isArray(value2)) {
      attach_array(target, value2);
    } else if (typeof value2 == "object") {
      attach_object(target, value2);
    }
  }
}
class CMap {
  /** 
   *	
   *	beginbfchar, endbfchar, 
   *	begincidchar, endcidchar
   *	
   *	
   */
  constructor(input) {
    this.range = getRanges(input);
    this.unicodes = getTables(input);
  }
  decode(input) {
    let output = [];
    for (let code of input) {
      output.push(this.unicodes.get(code));
    }
    return output;
  }
  encode(input) {
    throw new Error("CMap.encode: not impletede yet");
  }
}
function getRanges(input) {
  let output = /* @__PURE__ */ new Map();
  let i = 0;
  while (i < input.length) {
    let a = input.indexOf("begincodespacerange", i);
    if (a == -1) break;
    let b = input.indexOf("endcodespacerange", a);
    if (b == -1) break;
    let lines = input.substring(a, b).split("\n");
    for (let line of lines) {
      let [code, value2] = line.split(/\s/).map(function(e) {
        return parseInt(e.replace(/[\<\>]/, ""), 16);
      });
      output.set(code, value2);
    }
    i = b + 18;
  }
  return output;
}
function getTables(input) {
  let output = /* @__PURE__ */ new Map();
  let i = 0;
  while (i < input.length) {
    let a = input.indexOf("beginbfchar", i);
    if (a == -1) break;
    let b = input.indexOf("endbfchar", a);
    if (b == -1) break;
    let lines = input.substring(a, b).split("\n");
    for (let line of lines) {
      let [code, value2] = line.split(/\s/).map(function(e) {
        return parseInt(e.replace(/[\<\>]/, ""), 16);
      });
      output.set(code, value2);
    }
    i = b + 18;
  }
  i = 0;
  while (i < input.length) {
    let a = input.indexOf("begincidchar", i);
    if (a == -1) break;
    let b = input.indexOf("endcidchar", a);
    if (b == -1) break;
    let lines = input.substring(a, b).split("\n");
    for (let line of lines) {
      let [code, value2, id] = line.split(/\s/).map(function(e) {
        if (e.charAt(0) == "<") {
          return parseInt(e.replace(/[\<\>]/, ""), 16);
        } else {
          return parseInt(e);
        }
      });
      output.set(code, value2);
    }
    i = b + 18;
  }
  return output;
}
let FLOAT_PRECISION$1 = 4;
function precision$1(n) {
  return n.toFixed(FLOAT_PRECISION$1);
}
function parser(n, max = 255) {
  if (Number.isInteger(n) && n > 1) n /= max;
  return precision$1(Math.max(0, Math.min(n, 1)));
}
class Color extends Float32Array {
  /** constructor
   *
   *	@param {Number} bytes	0xrrggbb
   *	or
   *	@param {Number} r
   *	@param {Number} g
   *	@param {Number} b
   */
  constructor(r, g, b) {
    if (arguments.length < 3) {
      let n = arguments[0] || 0;
      r = n >> 16 & 255;
      g = n >> 8 & 255;
      b = n & 255;
    }
    r = parser(r);
    g = parser(g);
    b = parser(b);
    super([r, g, b]);
  }
  get r() {
    return this[0];
  }
  get g() {
    return this[1];
  }
  get b() {
    return this[2];
  }
  set r(v) {
    this[0] = parser(v);
  }
  set g(v) {
    this[1] = parser(v);
  }
  set b(v) {
    this[2] = parser(v);
  }
  get hex() {
    let [r, g, b] = this;
    r = Math.floor(r * 256);
    g = Math.floor(g * 256);
    b = Math.floor(b * 256);
    return b | g << 8 | r << 16;
  }
  get cmyk() {
    let [r, g, b] = this;
    let c = 0, m = 0, y = 0, k = 1 - Math.max(r, g, b);
    if (k != 1) {
      c = (1 - r - k) / (1 - k);
      m = (1 - g - k) / (1 - k);
      y = (1 - b - k) / (1 - k);
    }
    return [c, m, y, k].map(precision$1);
  }
  toString() {
    return "#" + ("000000" + this.hex).slice(-6).toUpperCase();
  }
}
const DEG_TO_RAD = Math.PI / 180;
let FLOAT_PRECISION = 4;
function precision(n) {
  return n.toFixed(FLOAT_PRECISION);
}
class Path2D extends Array {
  static set PRECISION(v) {
    PRECISION = v;
  }
  constructor() {
    super();
    this.using = new Object();
  }
  ///
  /** save
   *
   *	@return {Path2D} this
   */
  save() {
    this.push("q");
    return this;
  }
  /** restore
   *
   *	@return {Path2D} this
   */
  restore() {
    this.push("Q");
    return this;
  }
  do(object) {
    var name = object.getObjectName();
    this.push("/" + name + SP + "Do");
  }
  /// Matrix Transform
  transform(data, x, y) {
    let d = "";
    for (let n of data)
      d += precision(parseFloat(n)) + SP;
    this.push(d + SP + precision(x) + SP + precision(y) + SP + "cm");
    return this;
  }
  /** translate
   *	
   *	@param {Number} x, y
   *	@return {Path2D} this
   */
  translate(x, y = x) {
    return this.transform([1, 0, 0, 1], x, y);
  }
  /** rotate
   *	
   *	@param {Number} angle
   *	@return {Path2D} this
   */
  rotate(angle = 0) {
    let c = Math.cos(angle), s = Math.sin(angle);
    return this.transform([c, -s, s, c], 0, 0);
  }
  /** scale
   *	
   *	@param {Number} sx, sy
   *	@return {Path2D} this
   */
  scale(sx, sy = sx) {
    return this.transform([sx, 0, 0, sy], 0, 0);
  }
  /** skew
   *	
   *	@param {Number} ax, ay
   *	@return {Path2D} this
   */
  skew(ax, ay) {
    this.push(path2d_transform([1, ax, ay, 1], 0, 0));
    return this;
  }
  /// colors
  /** strokeColor
   *
   *	@param {PDFColorSpace | TypedArray} color
   *	@return {Path2D} this
   */
  strokeColor(color) {
    if (color.constructor.name == "PDFColorSpace") {
      let name = color.getObjectName();
      this.push("/" + name + SP + "CS 1.0000 SCN");
      if (!(name in this.using)) this.using[name] = color;
    } else {
      switch (color.length) {
        case 3:
          this.push(color.join(SP) + SP + "RG");
          break;
        case 4:
          this.push(color.join(SP) + SP + "K");
          break;
        default:
          console.warn("PDFStream.strokeColor: @param 'color' is incompatible", color);
          break;
      }
    }
    return this;
  }
  /** fillColor
   *
   *	@param {PDFColorSpace | Array} color
   *	@return {Path2D} this
   */
  fillColor(color) {
    if (color.constructor.name == "PDFColorSpace") {
      var name = color.getObjectName();
      this.push("/" + name + SP + "cs 1.0000 scn");
      if (!(name in this.using)) this.using[name] = color;
    } else {
      switch (color.length) {
        case 3:
          this.push(color.join(SP) + SP + "rg");
          break;
        case 4:
          this.push(color.join(SP) + SP + "k");
          break;
        default:
          console.warn("PDFStream.fillColor: @param 'color' is incompatible", color);
          break;
      }
    }
    return this;
  }
  /** lineWidth
   *	
   *	@param {Number} w
   *	@return {Path2D} this
   */
  lineWidth(w) {
    this.push(precision(w) + SP + "w");
    return this;
  }
  /** miter
   *	
   *	@param {Number} w
   *	@return {Path2D} this
   */
  miter(w) {
    this.push(w + SP + "M");
    return this;
  }
  /** lineDashPattern
   *	
   *	@param {Array} array
   *	@param {Number} phase
   *	@return {Path2D} this
   */
  lineDashPattern(data, phase = 0) {
    let d = "";
    for (let n of data)
      d += precision(n) + SP;
    this.push("[" + d + "]" + SP + precision(phase) + SP + "d");
    return this;
  }
  ///
  /** stroke
   *	
   *	S false
   *	s true
   *	
   *	@param {Boolean} closed
   *	@return {Path2D} this
   */
  stroke(closed = false) {
    this.push(closed == true ? "s" : "S");
    return this;
  }
  /** fill
   *
   *	@param {Boolean} rule
   *	@return {Path2D} this
   */
  fill(rule = false) {
    this.push("f" + (rule == true ? "*" : ""));
    return this;
  }
  /** both
   *
   *	@param {Boolean} closed, rule
   *	@return {Path2D} this
   */
  both(closed = false, rule = false) {
    this.push((closed == true ? "b" : "B") + (rule == true ? "*" : ""));
    return this;
  }
  /** 
   *	
   */
  clip(rule = false) {
    this.push(rule ? "W*" : "W");
    return this;
  }
  ///
  /** moveTo
   *
   *	@param {Number} x, y
   *	@return {Path2D} this
   */
  moveTo(x, y) {
    this.push(precision(x) + SP + precision(y) + SP + "m");
    return this;
  }
  /** lineTo
   *
   *	@param {Number} x, y
   *	@return {Path2D} this
   */
  lineTo(x, y) {
    this.push(precision(x) + SP + precision(y) + SP + "l");
    return this;
  }
  /** close
   *
   *	@param {Number} x, y
   *	@return {Path2D} this
   */
  close(x, y) {
    this.push("h");
    return this;
  }
  /** rect
   *
   *	@param {Number} x, y, w, h, rh, rv, points
   *	@return {Path2D} this
   */
  rect(x, y, w, h) {
    this.push(
      precision(x) + SP + precision(y) + SP + precision(w) + SP + precision(h) + SP + "re"
    );
    return this;
  }
  /** curve
   *
   *	@param {Number} ax, ay, bx, by, cx, cy
   *	@return {Path2D} this
   */
  curve(ax, ay, bx, by, cx, cy) {
    this.push(precision(ax) + SP + precision(ay) + SP + precision(bx) + SP + precision(by) + SP + precision(cx) + SP + precision(cy) + SP + "c");
    return this;
  }
  /** circle
   *
   *	@param {Number} x, y, radius, points
   *	@return {Path2D} this
   */
  circle(px, py, radius, points = 36) {
    this.ellipse(px, py, radius, radius, points);
    return this;
  }
  /** ellipse
   *	
   *	@param {Number} x, y, rv, rh, points
   *	@return {Path2D} this
   */
  ellipse(px, py, rh, rv = rh, points = 36) {
    let step = Math.floor(360 / points);
    this.moveTo(px + rh * Math.cos(0), py + rv * Math.sin(0));
    for (let i = step; i < 360; i += step) {
      let n = i * DEG_TO_RAD;
      this.lineTo(px + rh * Math.cos(n), py + rv * Math.sin(n));
    }
    return this;
  }
  /** polygon
   *
   *	@param {Array} nodes [[x, y], [x, y], [ax,ay,bx,by,cx,cy],... ]
   *	@return {Path2D} this
   */
  polygon(input) {
    this.moveTo(...input[0]);
    for (let i = 1; i < input.length; i++) {
      let e = input[i];
      if (e.length == 2) {
        this.lineTo(...e);
      } else if (e.length == 6) {
        this.curve(...e);
      } else {
        console.warn("Path2D.polygon: bad data", input);
      }
    }
    return this;
  }
  ///
  /** fillText
   *
   *	@param {String} content
   *	@param {Number} x
   *	@param {Number} y
   *	@param {Number} size
   *	@param {PDFFont} font
   *	@param {Object} options
   *	@return {Path2D} this
   */
  fillText(content, x, y, size, font, options = null) {
    let name = font.getObjectName();
    if (!(name in this.using))
      this.using[name] = font;
    let output = "BT" + CRLF;
    output += "/" + font.getObjectName() + SP + precision(size) + SP + "Tf" + CRLF;
    output += precision(x) + SP + precision(y) + SP + "Td" + CRLF;
    for (let key in options)
      output += options[key] + SP + key + CRLF;
    if (typeof content == "string") {
      content = "(" + content + ")";
    } else {
      content = "<" + Array.from(content).map((e) => e.toString(16).padStart(2, "0")).join("") + ">";
    }
    this.push(output + content + SP + "Tj" + CRLF + "ET");
    return this;
  }
  /** strokeText
   *
   *	@param {String} content
   *	@param {Number} x
   *	@param {Number} y
   *	@param {Number} size
   *	@param {PDFFont} font
   *	@param {Object} options
   *	@return {Path2D} this
   */
  strokeText(content, x, y, size, font, options = null) {
    let name = font.getObjectName();
    if (!(name in this.using))
      this.using[name] = font;
    if (!options.hasOwnProperty("Tr"))
      options.Tr = 1;
    let output = "BT" + CRLF;
    output += "/" + font.getObjectName() + SP + precision(size) + SP + "Tf" + CRLF;
    output += precision(x) + SP + precision(y) + SP + "Td" + CRLF;
    for (let key in options)
      output += options[key] + SP + key + CRLF;
    if (typeof content == "string") {
      content = "(" + content + ")";
    } else {
      content = "<" + Array.from(content).map((e) => e.toString(16).padStart(2, "0")).join("") + ">";
    }
    this.push(output + content + SP + "Tj" + CRLF + "ET");
    return this;
  }
  ///
  /** drawImage
   *
   *  @param {PDFImage} object
   *  @param {Number} x, y, w, h, r
   *	@return {Path2D} this
   */
  drawImage(object, x, y, w, h, r = 0) {
    this.push("q");
    this.translate(x, y);
    if (r != 0)
      this.rotate(r);
    this.scale(w, h);
    let name = object.getObjectName();
    if (!(name in this.using))
      this.using[name] = object;
    this.push("/" + name + SP + "Do");
    this.push("Q");
    return this;
  }
  toString() {
    let output = "";
    for (let line of this)
      output += line + CRLF;
    return output;
  }
}
class PDFNumber extends PDFObject(Number) {
  toString() {
    return this.getObjectHeader() + CRLF + this.valueOf() + CRLF + "endobj";
  }
}
function isNumeric(input) {
  if (typeof input != "string") return false;
  return !isNaN(input) && !isNaN(parseFloat(input));
}
function parseDictionary(input) {
  input = input.replace(/\\\r/gm, " ");
  input = input.replace(/\\\r\n/gm, " ");
  input = input.replace(/\r\n|\n/gm, " ");
  input = input.replace(/^\d+\s\d+\sobj/g, "");
  input = input.replace(/endobj$/g, "");
  input = input.replace(/\//g, " /");
  input = input.replace(/\<\>/g, "< >");
  input = input.replace(/\>\</g, "> <");
  input = input.replace(/\<\<\<\</g, " << <<");
  input = input.replace(/\>\>\>\>/g, ">> >> ");
  input = input.replace(/\<\<\</g, " << <");
  input = input.replace(/\>\>\>/g, "> >> ");
  input = input.replace(/\<\</g, " << ");
  input = input.replace(/\>\>/g, " >> ");
  input = input.replace(/\[/g, " [ ");
  input = input.replace(/\]/g, " ] ");
  input = input.replace(/\s+/gm, " ");
  input = input.replace(/\d+\s\d+\sR/gm, function(e) {
    return e.replace(/\s/gm, "_");
  });
  return input.trim();
}
function splitDictionary(input) {
  let output = [];
  let current = "";
  let i = 0;
  while (i < input.length) {
    let c0 = input.charAt(i);
    if (c0 == " ") {
      output.push(current);
      current = "";
    } else if (c0 == "(") {
      output.push(current);
      current = c0;
      let j = i + 1;
      while (true) {
        let c1 = input.charAt(j);
        current += c1;
        if (c1 == ")" && input.charAt(j - 1) != "\\") break;
        j++;
      }
      i = j + 1;
      current = current.replace(/\s+\//gm, "/");
      output.push(current);
      current = "";
    } else {
      current += c0;
    }
    i++;
  }
  if (current != "")
    output.push(current);
  return output;
}
function readUntil(input, charEnd) {
  let output = [];
  while (input.length > 0) {
    let target = input.shift();
    if (target == charEnd) {
      return output;
    } else {
      if (target == "[") {
        output.push(readUntil(input, "]"));
      } else if (target == "<<") {
        let data = readUntil(input, ">>");
        let object = new Object();
        for (let i = 0; i < data.length; i += 2)
          object[data[i]] = data[i + 1];
        output.push(object);
      } else {
        if (target.charAt(0) == "/") {
          target = target.replace(/^\//, "");
        } else if (isNumeric(target)) {
          target = parseFloat(target);
        } else if (target == "null") {
          target = null;
        }
        output.push(target);
      }
    }
  }
  return output[0];
}
function read(input) {
  let data = splitDictionary(input);
  if (data[0] == "<<") {
    return readUntil(data, ">>");
  } else if (data[0] == "[") {
    return readUntil(data, "]");
  } else {
    return input;
  }
}
function replaceId(index, object) {
  for (let key in object) {
    let value2 = object[key];
    if (typeof value2 == "object") {
      replaceId(index, value2);
    } else {
      if (/^\d+\_\d+\_R$/.test(value2)) {
        let id = value2.replace(/\_/g, " ").replace(/R$/, "obj");
        object[key] = index[id];
      }
    }
  }
}
new TextDecoder();
function ReadObjects(text, buffer) {
  let objects = new Object();
  text.match(/^\d+\s\d+\sobj/gm).forEach(function(e) {
    let i = text.indexOf("\r\n" + e);
    let CRLF_SIZE = 2;
    if (i == -1) {
      CRLF_SIZE = 1;
      i = text.indexOf("\n" + e) + 1;
    } else {
      i += 2;
    }
    let j = text.indexOf("endobj", i);
    let content = text.slice(i, j + 6);
    let n = content.indexOf("stream");
    if (n != -1) {
      let m = content.indexOf("endstream", n);
      let data = parseDictionary(content.slice(0, n));
      data = read(data);
      let stream = buffer.slice(i + (n + 6 + CRLF_SIZE), i + (m - CRLF_SIZE));
      objects[e] = new PDFStream(stream, data);
    } else {
      content = parseDictionary(content);
      content = read(content);
      if (Array.isArray(content)) {
        objects[e] = new PDFArray(content);
      } else if (typeof content == "object") {
        objects[e] = new PDFDictionary(content);
      } else {
        if (/\d+/.test(content)) {
          objects[e] = new PDFNumber(content);
        } else {
          objects[e] = new PDFString(content);
        }
      }
    }
  });
  let trailer_i = text.indexOf("trailer") + 7;
  let startxref_i = text.indexOf("startxref");
  let trailer = parseDictionary(text.slice(trailer_i, startxref_i));
  trailer = new PDFTrailer(read(trailer));
  replaceId(objects, trailer);
  for (let key in objects) {
    let [on, gn, s] = key.split(" ");
    let obj = objects[key];
    obj.setObjectR(on, gn);
    replaceId(objects, obj);
  }
  return { objects, trailer };
}
class PDF {
  static Fonts = {
    HELVETICA: new PDFFont("Helvetica"),
    TIMES: new PDFFont("Times-Roman"),
    COURIER: new PDFFont("Courier")
  };
  static CMap = CMap;
  static Color = Color;
  static Path2D = Path2D;
  static Create() {
    let doc2 = new PDFDocument();
    doc2.trailer.Root = new PDFCatalog();
    doc2.trailer.Root.Pages = new PDFPages();
    doc2.attach(doc2.trailer.Root);
    return doc2;
  }
  /** 
   *	
   */
  static Load(input) {
    if (!(input instanceof ArrayBuffer))
      throw "PDF.Load: @param 'input' isn't a {ArrayBuffer}";
    let buffer = new Uint8Array(input);
    let text = "";
    for (let i = 0; i < buffer.length; i++)
      text += String.fromCharCode(buffer[i]);
    let { objects, trailer } = ReadObjects(text, buffer);
    let doc2 = new PDFDocument();
    doc2.trailer = trailer;
    doc2.attach(doc2.trailer.Root);
    for (let key in objects)
      doc2.attach(objects[key]);
    return doc2;
  }
}
const fonts = {
  NORMAL: new PDFFont("Helvetica"),
  BOLD: new PDFFont("Helvetica-Bold"),
  ITALIC: new PDFFont("Helvetica-Oblique"),
  BOLD_ITALIC: new PDFFont("Helvetica-BoldOblique")
};
function getBuffer(input) {
  let output = new Array();
  if (!(typeof input == "string"))
    input = input.toString();
  for (let e of input)
    output.push(e.charCodeAt());
  return output;
}
const STATBLOCK_FEATURES = ["Traits", "Actions", "Bonus Actions", "Reaction"];
class PdfRenderer {
  constructor(options) {
    this.options = new RendererOptions(options);
    this.context = new RendererContext();
    this.cursorY = 0;
  }
  clearContext() {
    this.context = new RendererContext();
  }
  getRemaingSpace() {
    return this.cursorY / this.options.bound.height;
  }
  /**
   *
   * @param {SpellCard} card
   * @return {PDF.Path2D[]}
   */
  render(card) {
    this.startNewCard(card);
    this.renderDetails(card);
    this.renderContent(card);
    this.renderReferences(card);
    this.renderStatblock(card);
    this.renderPageNumerator();
    return this.context.streams;
  }
  resetCardContext() {
    this.context.append(new PDF.Path2D());
    const bound = this.options.bound;
    this.cursorY = bound.height + bound.y - 3;
  }
  startNewCard(card) {
    this.resetCardContext();
    this.renderLayout();
    this.renderTitle(card.name);
    this.renderSubtitle(card.level + " - " + card.type);
    if (this.context.streams.length == 1)
      this.renderFooter(card.classes.join(" | "));
  }
  renderBreakLine(value2 = 1) {
    this.cursorY -= value2;
  }
  renderLayout() {
    const stream = this.context.currentStream;
    const bound = this.options.bound;
    let w = this.options.width, h = this.options.height;
    let p2 = 2.5;
    let q = 1.5;
    let t = 6;
    stream.moveTo(0, 0);
    stream.lineTo(w, 0);
    stream.lineTo(w, h);
    stream.lineTo(0, h);
    stream.stroke(true);
    stream.moveTo(p2, p2);
    stream.lineTo(w - p2, p2);
    stream.lineTo(w - p2, h - p2);
    stream.lineTo(p2, h - p2);
    stream.stroke(true);
    stream.moveTo(t, q);
    stream.lineTo(w - t, q);
    stream.lineTo(w - q, t);
    stream.lineTo(w - q, h - t);
    stream.lineTo(w - t, h - q);
    stream.lineTo(t, h - q);
    stream.lineTo(q, h - t);
    stream.lineTo(q, t);
    stream.stroke(true);
    stream.moveTo(bound.x + 3, bound.y + bound.height);
    stream.lineTo(bound.x + bound.width - 3, bound.y + bound.height);
    stream.stroke();
    stream.moveTo(bound.x, bound.y);
    stream.lineTo(bound.x + bound.width, bound.y);
    stream.stroke();
  }
  renderTitle(text) {
    const stream = this.context.currentStream;
    const bound = this.options.bound;
    let tw = measureText(text, "30px Arial").width / 10;
    let fontSize = tw >= bound.width - 4 ? 2.5 : 3;
    stream.fillText(getBuffer(text), 6, 78.5, fontSize, fonts.BOLD);
  }
  renderSubtitle(text) {
    const stream = this.context.currentStream;
    const bound = this.options.bound;
    let tw = measureText(text, "20px Arial").width / 10;
    let fontSize = tw >= bound.width - 8 ? 2 : 2.5;
    stream.fillText(getBuffer(text), 6, 75, fontSize, fonts.ITALIC);
  }
  renderFooter(text) {
    const stream = this.context.currentStream;
    const bound = this.options.bound;
    let tw = measureText(text, "20px Arial").width / 10;
    let fontSize = tw >= bound.width - 8 ? 1.5 : 2;
    stream.fillText(getBuffer(text), 6, 4, fontSize, fonts.NORMAL);
  }
  renderPageNumerator() {
    const bound = this.options.bound;
    const streams = this.context.streams;
    for (let i = 0; i < streams.length; i++) {
      const stream = this.context.streams[i];
      const text = i + 1 + "/" + streams.length;
      stream.fillText(getBuffer(text), bound.width + 3, 4, 2, fonts.BOLD);
    }
  }
  renderLine(full = false) {
    const stream = this.context.currentStream;
    const bound = this.options.bound;
    if (full) {
      stream.moveTo(bound.x, this.cursorY);
      stream.lineTo(bound.x + bound.width, this.cursorY);
      stream.stroke();
    } else {
      stream.moveTo(bound.x + 3, this.cursorY);
      stream.lineTo(bound.x + bound.width - 3, this.cursorY);
      stream.stroke();
    }
    this.cursorY -= 2.5;
  }
  /**
   * @param {Paragraph} paragraph
   */
  renderParagraph(paragraph) {
    const stream = this.context.currentStream;
    const bound = this.options.bound;
    while (paragraph.length > 0) {
      if (paragraph[0].y <= bound.y + 1)
        return paragraph;
      const word = paragraph.shift();
      stream.fillText(getBuffer(word.content), word.x, word.y, word.fontSize, fonts[word.type]);
      if (paragraph.length == 0)
        this.cursorY = word.y - word.fontSize * 1.75;
    }
    return null;
  }
  renderTable(data, sizes, fontSize = 2, space = 0.75) {
    const bound = this.options.bound;
    let x = bound.x;
    this.cursorY;
    let output = [];
    let dx = [0];
    for (let x2 of sizes)
      dx.push(dx.at(-1) + x2);
    for (let line of data) {
      let y = this.cursorY;
      for (let i = 0; i < line.length; i++) {
        line[i];
        let columnWidth = bound.width * sizes[i];
        let p2 = Paragraph.Create(x + bound.width * dx[i], y, line[i], columnWidth, space, fontSize);
        if (p2.length == 0) continue;
        let y0 = p2[0].y;
        for (let w of p2) {
          if (w.y != y0) {
            break;
          }
        }
        this.renderParagraph(p2);
      }
    }
    this.cursorY += 1;
    return output;
  }
  /* ... */
  renderDetails(card) {
    this.renderTable([
      ["**Casting Time**", card.casting],
      ["**Range**", card.range],
      ["**Components**", card.components],
      ["**Duration**", card.duration]
    ], [0.35, 0.65]);
    this.renderLine(true);
  }
  renderContent(spell) {
    const { bound, fontSize, space } = this.options;
    for (const text of spell.content) {
      const paragraph = Paragraph.Create(bound.x, this.cursorY, text, bound.width, space, fontSize);
      const remeaing = this.renderParagraph(paragraph);
      if (remeaing) {
        this.startNewCard(spell);
        this.renderBreakLine(2);
        remeaing.translate(0, bound.height - 4);
        this.renderParagraph(remeaing);
      }
    }
  }
  renderReferences(spell) {
    if (!Array.isArray(spell.tables))
      return;
    const { bound, fontSize, space } = this.options;
    for (const tb of spell.tables) {
      if (this.getRemaingSpace() < 0.5)
        this.startNewCard(spell);
      this.renderBreakLine(1);
      if (tb.title) {
        const paragraph = Paragraph.Create(bound.x, this.cursorY, "**" + tb.title + "**", bound.width, space, fontSize + 0.5);
        this.renderParagraph(paragraph);
        this.renderBreakLine(-2.5);
        this.renderLine(true);
      }
      this.renderTable(tb.header.map((e) => e.map((t) => "**" + t + "**")), tb.sizes);
      this.renderBreakLine(-1);
      this.renderLine(true);
      this.renderTable(tb.body, tb.sizes);
      this.renderBreakLine(2);
    }
  }
  /* ... */
  renderStatblock(card) {
    const statblock = card.statblock;
    if (!card.statblock) return;
    this.startNewStatblockCard(card, statblock);
    this.renderStatblockDetails(statblock);
    this.renderAddons(statblock);
    this.renderFeatures(card, statblock);
  }
  startNewStatblockCard(card, statblock) {
    this.resetCardContext();
    this.renderLayout();
    this.renderTitle(statblock.title);
    this.renderSubtitle(statblock.subtitle);
    this.renderFooter(card.name + " | " + card.level + " - " + card.type);
  }
  renderStatblockDetails(statblock) {
    this.renderTable([
      ["**AC**", statblock.AC],
      ["**HP**", statblock.HP],
      ["**Speed**", statblock.Speed]
    ], [0.25, 0.75], 2, 0.75);
    this.renderLine(true);
    let { STR, DEX, CON, INT, WIS, CHA } = statblock.attributes;
    this.renderTable([
      ["", "", "MOD", "SAVE", "", "", "MOD", "SAVE"],
      ["**STR**", ...STR, "**DEX**", ...DEX],
      ["**CON**", ...CON, "**INT**", ...INT],
      ["**WIS**", ...WIS, "**CHA**", ...CHA]
    ], new Float32Array(8).fill(0.125), 1.75, 0);
    this.renderLine(true);
  }
  renderAddons(statblock) {
    const tbaddons = [];
    for (let k in statblock.addons)
      tbaddons.push(["**" + k + "**", statblock.addons[k]]);
    this.renderTable(tbaddons, [0.28, 0.72], 2);
  }
  renderFeatures(card, statblock) {
    const { bound, fontSize, space } = this.options;
    for (const key of STATBLOCK_FEATURES) {
      if (!(key in statblock))
        continue;
      if (this.getRemaingSpace() < 0.35) {
        this.startNewStatblockCard(card, statblock);
      } else {
        this.renderLine(true);
      }
      this.renderBreakLine(1);
      const paragraph = Paragraph.Create(bound.x, this.cursorY, "**" + key + "**", bound.width, space, fontSize + 0.5);
      this.renderParagraph(paragraph);
      let content = statblock[key];
      for (const text of content) {
        const paragraph2 = Paragraph.Create(bound.x, this.cursorY, text, bound.width, space, fontSize);
        const remeaing = this.renderParagraph(paragraph2);
        if (remeaing) {
          this.startNewStatblockCard(card, statblock);
          remeaing.translate(0, bound.height - 3);
          this.renderParagraph(remeaing);
        }
      }
    }
  }
}
const MM = 2.8346;
class SpellCardsRenderer {
  constructor(options) {
    this.options = new RendererOptions(options);
    this.pdfRenderer = new PdfRenderer(this.options);
  }
  /**
   *
   * @param {SpellCard[]} spells
   */
  generatePdf(spells2, parentNode) {
    const options = this.options;
    const doc2 = PDF.Create();
    let stream;
    let index = 0;
    for (const spell of spells2) {
      this.pdfRenderer.clearContext();
      let cards = this.pdfRenderer.render(spell);
      for (const card of cards) {
        if (index % 9 == 0) {
          const page = new PDFPage(MM * 210, MM * 297);
          page.use(...Object.values(fonts));
          stream = new PDF.Path2D();
          stream.scale(MM, MM);
          stream.lineWidth(0.01);
          page.append(new PDFStream(stream));
          doc2.attach(page);
          index = 0;
        }
        const x = index % 3;
        const y = Math.floor(index / 3) + 1;
        stream.save();
        stream.translate(
          8 + x + x * options.width,
          297 - 8 - y - y * options.height
        );
        stream.push(...card);
        stream.restore();
        index++;
      }
    }
    if (parentNode)
      doc2.preview(parentNode, 210, 297);
    return doc2;
  }
}
const spells = /* @__PURE__ */ JSON.parse(`[{"name":"Acid Splash","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Sorcerer","Wizard"],"content":["You create an acidic bubble at a point within range, where it explodes in a 5-foot-radius Sphere. Each creature in that Sphere must succeed on a Dexterity saving throw or take 1d6 Acid damage.","***Cantrip Upgrade.*** The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6)."]},{"name":"Aid","type":"Abjuration","casting":"Action","range":"30 feet","components":"V, S, M (a strip of white cloth)","duration":"8 hours","level":"Level 2","classes":["Bard","Cleric","Druid","Paladin","Ranger"],"content":["Choose up to three creatures within range. Each target's Hit Point maximum and current Hit Points increase by 5 for the duration.","***Using a Higher-Level Spell Slot.*** Each target's Hit Points increase by 5 for each spell slot level above 2."]},{"name":"Alarm","type":"Abjuration","casting":"1 minute or Ritual","range":"30 feet","components":"V, S, M (a bell and silver wire)","duration":"8 hours","level":"Level 1","classes":["Ranger","Wizard"],"content":["You set an alarm against intrusion. Choose a door, a window or an area within range that is no larger than a 20-foot Cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is audible or mental:","***Audible Alarm.*** The alarm produces the sound of a handbell for 10 seconds within 60 feet of the warded area.","***Mental Alarm.*** You are alerted by a mental ping if you are within 1 mile of the warded area. This ping awakens you if you're asleep."]},{"name":"Alter Self","type":"Transmutation","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Sorcerer","Wizard"],"content":["You alter your physical form. Choose one of the following options. Its effects last for the duration, during which you can take a Magic action to replace the option you chose with a different one.","***Aquatic Adaptation.*** You sprout gills and grow webs between your fingers. You can breathe underwater and gain a Swim Speed equal to your Speed.","***Change Appearance.*** You alter your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and other distinguishing characteristics. You can make yourself appear as a member of another species, though none of your statistics change. You can't appear as a creature of a different size, and your basic shape stays the same; if you're bipedal, you can't use this spell to become quadrupedal, for instance. For the duration, you can take a Magic action to change your appearance in this way again.","***Natural Weapons.*** You grow claws (Slashing), fangs (Piercing), horns (Piercing), or hooves (Bludgeoning). When you use your Unarmed Strike to deal damage with that new growth, it deals 1d6 damage of the type in parentheses instead of dealing the normal damage for your Unarmed Strike, and you use your spellcasting ability modifier for the attack and damage rolls rather than using Strength."]},{"name":"Animal Friendship","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S, M (a morsel of food)","duration":"24 hours","level":"Level 1","classes":["Bard","Druid","Ranger"],"content":["Target a Beast that you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. If you or one of your allies deals damage to the target, the spells ends.","***Using a Higher-Level Spell Slot.*** You can target one additional Beast for each spell slot level above 1."]},{"name":"Animal Messenger","type":"Enchantment","casting":"Action or Ritual","range":"30 feet","components":"V, S, M (a morsel of food)","duration":"24 hours","level":"Level 2","classes":["Bard","Druid","Ranger"],"content":["A Tiny Beast of your choice that you can see within range must succeed on a Charisma saving throw, or it attempts to deliver a message for you (if the target's Challenge Rating isn't 0, it automatically succeeds). You specify a location you have visited and a recipient who matches a general description, such as \\"a person dressed in the uniform of the town guard\\" or \\"a red-haired dwarf wearing a pointed hat\\". You also communicate a message of up to twenty-five words. The Beast travels for the duration toward the specified location, covering about 25 miles per 24 hours or 50 miles if the Beast can fly.","When the Beast arrives, it delivers your message to the creature that you described, mimicking your communication. If the Beast doesn't reach its destination before the spell ends, the message is lost, and the Beast returns to where you cast the spell.","***Using a Higher-Level Spell Slot.*** The spell's duration increases by 48 hours for each spell slot level above 2."]},{"name":"Animal Shapes","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S","duration":"24 hours","level":"Level 8","classes":["Druid"],"content":["Choose any number of willing creatures that you can see within range. Each target shape-shifts into a Large or smaller Beast of your choice that has a Challenge Rating of 4 or lower. You can choose a different form for each target. On later turns, you can take a Magic action to transform the targets again.","A target's game statistics are replaced by the chosen Beast's statistics, but the target retains its creature type; Hit Points; Hit Point Dice; alignment; ability to communicate; and Intelligence, Wisdom, and Charisma scores. The target's actions are limited by the Beast form's anatomy, and it can't cast spells. The target's equipment melds into the new form, and the target can't use any of that equipment while in that form.","The target gains a number of Temporary Hit Points equal to the Beast form's Hit Points. The transformation lasts for the duration for each target, until the target has no Temporary Hit Points, or until the target leaves the form as a Bonus Action."]},{"name":"Animate Dead","type":"Necromancy","casting":"1 minute","range":"10 feet","components":"V, S, M (a drop of blood, a piece of flesh, and a pinch of bone dust)","duration":"Instantaneous","level":"Level 3","classes":["Cleric","Wizard"],"content":["Choose a pile of bones or a corpse of a Medium or Small Humanoid within range. The target becomes an Undead creature: a ***Skeleton*** if you chose bones or a ***Zombie*** if you chose a corpse (see appendix B for the stat blocks).","On each ofyour turns, you can take a Bonus Action to mentally command any creature you made with this spell if the creature is within 60 feet of you (if you control multiple creatures, you can command any of them at the same time, issuing the same command to each one). You decide what action the creature will take and where it will move on its next turn, or you can issue a general command, such as to guard a chamber or corridor. If you issue no commands, the creature takes the Dodge action and moves only to avoid harm. Once given an order, the creature continues to follow it until its task is complete.","The creature is under your control for 24 hours, after which it stops obeying any command you've given it. To maintain control of the creature for another 24 hours, you must cast this spell on the creature again before the current 24-hour period ends. This use of the spell reasserts your control over up to four creatures you have animated with this spell rather than animating a new creature.","***Using a Higher-Level Spell Slot.*** You animate or reassert control over two additional Undead creatures for each spell slot level above 3. Each of the creatures must come from a different corpse or pile of bones."]},{"name":"Animate Objects","type":"Transmutation","casting":"Action","range":"120 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Bard","Sorcerer","Wizard"],"content":["Objects animate at your command. Choose a number of nonmagical objects within range that aren't being worn or carried, aren't fixed to a surface, and aren't Gargantuan. The maximum number of objects is equal to your spellcasting ability modifier; for this number, a Medium or smaller target counts as one object, a Large target counts as two, and a Huge target counts as three.","Each target animates, sprouts legs, and becomes a Construct that uses the ***Animated Object*** stat block; this creature is under your control until the spell ends or until it is reduced to 0 Hit Points. Each creature you make with this spell is an ally to you and your allies. In combat, it shares your Initiative count and takes its turn immediately after yours.","Until the spell ends, you can take a Bonus Action to mentally command any creature you made with this spell if the creature is within 500 feet of you (if you control multiple creatures, you can command any of them at the same time, issuing the same command to each one). If you issue no commands, the creature takes the Dodge action and moves only to avoid harm. When the creature drops to 0 Hit Points, it reverts to its object form, and any remaining damage carries over to that form.","***Using a Higher-Level Spell Slot.*** The creature's Slam damage increases by 1d4 (Medium or smaller), 1d6 (Large), or 1d12 (Huge) for each spell slot level above 5."],"statblock":{"title":"Animated Object","subtitle":"Huge or Smaller Construct, Unaligned","AC":"15","HP":"10 (Medium or smaller), 20 (Large), 40 (Huge)","Speed":"30 ft","attributes":{"STR":["16","+3","+3"],"DEX":["10","+0","+0"],"CON":["10","+0","+0"],"INT":["3","-4","-4"],"WIS":["3","-4","-4"],"CHA":["1","-5","-5"]},"addons":{"Immunities":"Poison, Psychic, Charmed, Exhaustion, Frightened, Paralyzed, Poisoned","Senses":"Blindsight 30 ft., Passive Perception 6","Languages":"Understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Actions":["***Slam.*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* Force damage equal to 1d4 + 3 (Medium or smaller), 2d6 + 3 + your spellcasting ability modifier (Large), or 2d12 + 3 + your spellcasting ability modifier (Huge)."]}},{"name":"Antilife Shell","type":"Abjuration","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 1 hour","level":"Level 5","classes":["Druid"],"content":["An aura extends from you in a 10-foot Emanation for the duration. The aura prevents creatures other than Constructs and Undead from passing or reaching through it. An affected creature can cast spells or make attacks with Ranged or Reach weapons through the barrier.","If you move so that an affected creature is forced to pass through the barrier, the spell ends."]},{"name":"Antimagic Field","type":"Abjuration","casting":"Action","range":"Self","components":"V, S, M (iron filings)","duration":"Concentration, up to 1 hour","level":"Level 8","classes":["Cleric","Wizard"],"content":["An aura of antimagic surrounds you in 10-foot Emanation. No one can cast spells, take Magic actions, or create other magical effects inside the aura, and those things can't target or otherwise affect anything inside it. Magical properties of magic items don't work inside the aura or on anything inside it.","Areas of effect created by spells or other magic can't extend into the aura, and no one can teleport into or out ofit or use planar travel there. Portals close temporarily while in the aura.","Ongoing spells, except those cast by an Artifact or a deity, are suppressed in the area. While an effect is suppressed, it doesn't function, but the time it spends suppressed counts against its duration.","*Dispel Magic* has no effect on the aura, and the auras created by different *Antimagic Field* spells don't nullify each other."]},{"name":"Antipathy/Sympathy","type":"Enchantment","casting":"1 hour","range":"60 feet","components":"V, S, M (a mix of vinegar and honey)","duration":"10 days","level":"Level 8","classes":["Bard","Druid","Wizard"],"content":["As you cast the spell, choose whether it creates antipathy or sympathy, and target one creature or object that is Huge or smaller. Then specify a kind of creature, such as red dragons, goblins, or vampires. A creature of the chosen kind makes a Wisdom saving throw when it comes within 120 feet of the target. Your choice of antipathy or sympathy determines what happens to a creature when it fails that save:","***Antipathy.*** The creature has the Frightened condition. The Frightened creature must use its movement on its turns to get as far away as possible from the target, moving by the safest route.","***Sympathy.*** The creature has the Charmed condition. The Charmed creature must use its movement on its turns to get as close as possible to the target, moving by the safest route. If the creature is within 5 feet of the target, the creature can't willingly move away. If the target damages the Charmed creature, that creature can make a Wisdom saving throw to end the effect, as described below.","***Ending the Effect.*** If the Frightened or Charmed creature ends its turn more than 120 feet away from the target, the creature makes a Wisdom saving throw. On a successful save, the creature is no longer affected by the target. A creature that successfully saves against this effect is immune to it for 1 minute, after which it can be affected again."]},{"name":"Arcane Eye","type":"Divination","casting":"Action","range":"30 feet","components":"V, S, M (a bit of bat fur)","duration":"Concentration, up to 1 hour","level":"Level 4","classes":["Wizard"],"content":["You create an Invisible, invulnerable eye within range that hovers for the duration. You mentally receive visual information from the eye, which can see in every direction. It also has Darkvision with a range of 30 feet.","As a Bonus Action, you can move the eye up to 30 feet in any direction. A solid barrier blocks the eye's movement, but the eye can pass through an opening as small as 1 inch in diameter."]},{"name":"Arcane Gate","type":"Conjuration","casting":"Action","range":"500 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 6","classes":["Sorcerer","Warlock","Wizard"],"content":["You create linked teleportation portals. Choose two Large, unoccupied spaces on the ground that you can see, one space within range and the other one within 10 feet of you. A circular portal opens in each of those spaces and remains for the duration.","The portals are two-dimensional glowing rings filled with mist that blocks sight. They hover inches from the ground and are perpendicular to it.","A portal is open on only one side (you choose which). Anything entering the open side of a portal exits from the open side of the other portal as if the two were adjacent to each other. As a Bonus Action, you can change the facing of the open sides."]},{"name":"Arcane Lock","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S, M (gold dust worth 25+ GP, which the spell consumes)","duration":"Until dispelled","level":"Level 2","classes":["Wizard"],"content":["You touch a closed door, window, gate, container, or hatch and magically lock it for the duration. This lock can't be unlocked by any nonmagical means. You and any creatures you designate when you cast the spell can open and close the object despite the lock. You can also set a password that, when spoken within 5 feet of the object, unlocks it for 1 minute."]},{"name":"Arcane Vigor","type":"Abjuration","casting":"Bonus Action","range":"Self","components":"V, S","duration":"Instantaneous","level":"Level 2","classes":["Sorcerer","Wizard"],"content":["You tap into your life force to heal yourself. Roll one or two of your unexpended Hit Point Dice, and regain a number of Hit Points equal to the roll's total plus your spellcasting ability modifier. Those dice are then expended.","***Using a Higher-Level Spell Slot.*** The number of unexpended Hit Dice you can roll increases by one for each spell slot level above 2."]},{"name":"Armor of Agathys","type":"Abjuration","casting":"Bonus Action","range":"Self","components":"V, S, M (a shard of blue glass)","duration":"1 hour","level":"Level 1","classes":["Warlock"],"content":["Protective magical frost surrounds you. You gain 5 Temporary Hit Points. If a creature hits you with a melee attack roll before the spell ends, the creature takes 5 Cold damage. The spell ends early if you have no Temporary Hit Points.","***Using a Higher-Level Spell Slot.*** The Temporary Hit Points and the Cold damage both increase by 5 for each spell slot level above 1."]},{"name":"Arms of Hadar","type":"Conjuration","casting":"Action","range":"Self","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Warlock"],"content":["Invoking Hadar, you cause tendrils to erupt from yourself. Each creature in a 10-foot Emanation originating from you makes a Strength saving throw. On a failed save, a target takes 2d6 Necrotic damage and can't take Reactions until the start of its next turn. On a successful save, a target takes half as much damage only.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 1."]},{"name":"Astral Projection","type":"Necromancy","casting":"1 hour","range":"10 feet","components":"V, S, M (for each of the spell's targets, one jacinth worth 1,000+ GP and one silver bar worth 100+ GP, all of which the spell consumes)","duration":"Until dispelled","level":"Level 9","classes":["Cleric","Warlock","Wizard"],"content":["You and up to eight willing creatures within range project your astral bodies into the Astral Plane (the spell ends instantly if you are already on that plane). Each target's body is left behind in a state of suspended animation; it has the Unconscious condition, doesn't need food or air, and doesn't age.","A target's astral form resembles its body in almost every way, replicating its game statistics and possessions. The principal difference is the addition of a silvery cord that trails from between the shoulder blades of the astral form. The cord fades from view after 1 foot. If the cord is cut-which happens only when an effect states that it does so-the target's body and astral form both die.","A target's astral form can travel through the Astral Plane. The moment an astral form leaves that plane, the target's body and possessions travel along the silver cord, causing the target to re-enter its body on the new plane.","Any damage or other effects that apply to an astral form have no effect on the target's body and vice versa. If a target's body or astral form drops to 0 Hit Points, the spell ends for that target. The spell ends for all the targets if you take a Magic action to dismiss it.","When the spell ends for a target who isn't dead, the target reappears in its body and exits the state of suspended animation."]},{"name":"Augury","type":"Divination","casting":"1 minute or Ritual","range":"Self","components":"V, S, M (specially marked sticks, bones, cards, or other divinatory tokens worth 25+ GP)","duration":"Instantaneous","level":"Level 2","classes":["Cleric","Druid","Wizard"],"content":["You receive an omen from an otherworldly entity about the results of a course of action that you plan to take within the next 30 minutes. The DM chooses the omen from the Omens table.","The spell doesn't account for circumstances, such as other spells, that might change the results.","If you cast the spell more than once before finishing a Long Rest, there is a cumulative 25 percent chance for each casting after the first that you get no answer."],"tables":[{"title":"Omens","sizes":[0.4,0.6],"header":[["Omen","For Results That Will Be ..."]],"body":[["Weal","Good"],["Woe","Bad"],["Weal and woe","Good and bad"],["Indifference","Neither good nor bad"]]}]},{"name":"Aura of Life","type":"Abjuration","casting":"Action","range":"Self","components":"V","duration":"Concentration, up to 10 minutes","level":"Level 4","classes":["Cleric","Paladin"],"content":["An aura radiates from you in a 30-foot Emanation for the duration. While in the aura, you and your allies have Resistance to Necrotic damage, and your Hit Point maximums can't be reduced. If an ally with 0 Hit Points starts its turn in the aura, that ally regains 1 Hit Point."]},{"name":"Aura of Purity","type":"Abjuration","casting":"Action","range":"Self","components":"V","duration":"Concentration, up to 10 minutes","level":"Level 4","classes":["Cleric","Paladin"],"content":["An aura radiates from you in a 30-foot Emanation for the duration. While in the aura, you and your allies have Resistance to Poison damage and Advantage on saving throws to avoid or end effects that include the Blinded, Charmed, Deafened, Frightened, Paralyzed, Poisoned, or Stunned condition."]},{"name":"Aura of Vitality","type":"Abjuration","casting":"Action","range":"Self","components":"V","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Cleric","Druid","Paladin"],"content":["An aura radiates from you in a 30-foot Emanation for the duration. When you create the aura and at the start of each of your turns while it persists, you can restore 2d6 Hit Points to one creature in it."]},{"name":"Awaken","type":"Transmutation","casting":"8 hours","range":"Touch","components":"V, S, M (an agate worth 1,000+ GP which the spell consumes)","duration":"Instantaneous","level":"Level 5","classes":["Bard","Druid"],"content":["You spend the casting time tracing magical pathways within a precious gemstone, and then touch the target. The target must be either a Beast or Plant creature with an Intelligence of 3 or less or a natural plant that isn't a creature. The target gains an Intelligence of 10 and the ability to speak one language you know. If the target is a natural plant, it becomes a Plant creature and gains the ability to move its limbs, roots, vines, creepers, and so forth, and it gains senses similar to a human's. The DM chooses statistics appropriate for the awakened Plant, such as the statistics for the ***Awakened Shrub*** or ***Awakened Tree*** in the *Monster Manual*.","The awakened target has the Charmed condition for 30 days or until you or your allies deal damage to it. When that condition ends, the awakened creature chooses its attitude toward you."]},{"name":"Bane","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S, M (a drop of blood)","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Bard","Cleric","Warlock"],"content":["Up to three creatures of your choice that you can see within range must each make a Charisma saving throw. Whenever a target that fails this save makes an attack roll or a saving throw before the spell ends, the target must subtract 1d4 from the attack roll or save.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 1."]},{"name":"Banishing Smite","type":"Conjuration","casting":"Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Paladin"],"content":["The target hit by the attack roll takes an extra 5d10 Force damage from the attack. If the attack reduces the target to 50 Hit Points or fewer, the target must succeed on a Charisma saving throw or be transported to a harmless demiplane for the duration. While there, the target has the Incapacitated condition. When the spell ends, the target reappears in the space it left or in the nearest unoccupied space if that space is occupied."]},{"name":"Banishment","type":"Abjuration","casting":"Action","range":"30 feet","components":"V, S, M (a pentacle)","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Cleric","Paladin","Sorcerer","Warlock","Wizard"],"content":["One creature that you can see within range must succeed on a Charisma saving throw or be transported to a harmless demiplane for the duration. While there, the target has the Incapacitated condition. When the spell ends, the target reappears in the space it left or in the nearest unoccupied space if that space is occupied.","If the target is an Aberration, a Celestial, an Elemental, a Fey, or a Fiend, the target doesn't return if the spell lasts for 1 minute. The target is instead transported to a random location on a plane (DM's choice) associated with its creature type.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 4."]},{"name":"Barkskin","type":"Transmutation","casting":"Bonus Action","range":"Touch","components":"V, S, M (a handful of bark)","duration":"1 hour","level":"Level 2","classes":["Druid","Ranger"],"content":["You touch a willing creature. Until the spell ends, the target's skin assumes a bark-like appearance, and the target has an Armor Class of 17 if its AC is lower than that."]},{"name":"Beacon of Hope","type":"Abjuration","casting":"Action","range":"30 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Cleric"],"content":["Choose any number of creatures within range. For the duration, each target has Advantage on Wisdom saving throws and Death Saving Throws and regains the maximum number of Hit Points possible from any healing."]},{"name":"Beast Sense","type":"Divination","casting":"Action or Ritual","range":"Touch","components":"S","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Druid","Ranger"],"content":["You touch a willing Beast. For the duration, you can perceive through the Beast's senses as well as your own. When perceiving through the Beast's senses, you benefit from any special senses it has."]},{"name":"Befuddlement","type":"Enchantment","casting":"Action","range":"150 feet","components":"V, S, M (a key ring with no keys)","duration":"Instantaneous","level":"Level 8","classes":["Bard","Druid","Warlock","Wizard"],"content":["You blast the mind of a creature that you can see within range. The target makes an Intelligence saving throw.","On a failed save, the target takes 10d12 Psychic damage and can't cast spells or take the Magic action. At the end of every 30 days, the target repeats the save, ending the effect on a success. The effect can also be ended by the *Greater Restoration*, *Heal*, or *Wish* spell.","On a successful save, the target takes half as much damage only."]},{"name":"Bestow Curse","type":"Necromancy","casting":"Action","range":"Touch","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Bard","Cleric","Wizard"],"content":["You touch a creature, which must succeed on a Wisdom saving throw or become cursed for the duration. Until the curse ends, the target suffers one of the following effects of your choice:"," Choose one ability. The target has Disadvantage on ability checks and saving throws made with that ability."," The target has Disadvantage on attack rolls against you."," In combat, the target must succeed on a Wisdom saving throw at the start of each of its turns or be forced to take the Dodge action on that turn."," If you deal damage to the target with an attack roll or a spell, the target takes an extra 1d8 Necrotic damage.","***Using a Higher-Level Spell Slot.*** If you cast this spell using a level 4 spell slot, you can maintain Concentration on it for up to 10 minutes. If you use a level 5+ spell slot, the spell doesn't require Concentration, and the duration becomes 8 hours (level 5-6 slot) or 24 hours (level 7-8 slot). If you use a level 9 spell slot, the spell lasts until dispelled."]},{"name":"Bigby's Hand","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S, M (an eggshell and a glove)","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Sorcerer","Wizard"],"content":["You create a Large hand of shimmering magical energy in an unoccupied space that you can see within range. The hand lasts for the duration, and it moves at your command, mimicking the movements of your own hand.","The hand is an object that has AC 20 and Hit Points equal to your Hit Point maximum. If it drops to 0 Hit Points, the spell ends. The hand doesn't occupy its space.","When you cast the spell and as a Bonus Action on your later turns, you can move the hand up to 60 feet and then cause one of the following effects:","***Clenched Fist.*** The hand strikes a target within 5 feet of it. Make a melee spell attack. On a hit, the target takes 5d8 Force damage.","***Forceful Hand.*** The hand attempts to push a Huge or smaller creature within 5 feet of it. The target must succeed on a Strength saving throw, or the hand pushes the target up to 5 feet plus a number of feet equal to five times your spellcasting ability modifier. The hand moves with the target, remaining within 5 feet of it.","***Grasping Hand.*** The hand attempts to grapple a Huge or smaller creature within 5 feet of it. The target must succeed on a Dexterity saving throw or the target has the Grappled condition, with an escape DC equal to your spell save DC. While the hand grapples the target, you can take a Bonus Action to cause the hand to crush it, dealing Bludgeoning damage to the target equal to 4d6 plus your spellcasting ability modifier.","***Interposing Hand.*** The hand grants you Half Cover against attacks and other effects that originate from its space or that pass through it. In addition, its space counts as Difficult Terrain for your enemies.","***Using a Higher-Level Spell Slot.*** The damage of the Clenched Fist increases by 2d8 and the damage of the Grasping Hand increases by 2d6 for each spell slot level above 5."]},{"name":"Blade Barrier","type":"Evocation","casting":"Action","range":"90 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 6","classes":["Cleric"],"content":["You create a wall of whirling blades made of magical energy. The wall appears within range and lasts for the duration. You make a straight wall up to 100 feet long, 20 feet high, and 5 feet thick, or a ringed wall up to 60 feet in diameter, 20 feet high, and 5 feet thick. The wall provides Three-Quarters Cover, and its space is Difficult Terrain.","Any creature in the wall's space makes a Dexterity saving throw, taking 6d10 Force damage on a failed save or half as much damage on a successful one. A creature also makes that save if it enters the wall's space or ends it turn there. A creature makes that save only once per turn."]},{"name":"Blade Ward","type":"Abjuration","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 1 minute","level":"Cantrip","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["Whenever a creature makes an attack roll against you before the spell ends, the attacker subtracts 1d4 from the attack roll."]},{"name":"Bless","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S, M (a Holy Symbol worth 5+ GP)","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Cleric","Paladin"],"content":["You bless up to three creatures within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target adds 1d4 to the attack roll or save.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 1."]},{"name":"Blight","type":"Necromancy","casting":"Action","range":"30 feet","components":"V, S","duration":"Instantaneous","level":"Level 4","classes":["Druid","Sorcerer","Warlock","Wizard"],"content":["A creature that you can see within range makes a Constitution saving throw, taking 8d8 Necrotic damage on a failed save or half as much damage on a successful one. A Plant creature automatically fails the save.","Alternatively, target a nonmagical plant that isn't a creature, such as a tree or shrub. It doesn't make a save; it simply withers and dies.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 4."]},{"name":"Blinding Smite","type":"Evocation","casting":"Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"1 minute","level":"Level 3","classes":["Paladin"],"content":["The target hit by the strike takes an extra 3d8 Radiant damage from the attack, and the target has the Blinded condition until the spell ends. At the end of each of its turns, the Blinded target makes a Constitution saving throw ending the spell on itself on a success.","***Using a Higher-Level Spell Slot.*** The extra damage increases by 1d8 for each spell slot level above 3."]},{"name":"Blindness/Deafness","type":"Transmutation","casting":"Action","range":"120 feet","components":"V","duration":"1 minute","level":"Level 2","classes":["Bard","Cleric","Sorcerer","Wizard"],"content":["One creature that you can see within range must succeed on a Constitution saving throw or it has the Blinded or Deafened condition (your choice) for the duration. At the end of each of its turns, the target repeats the save, ending the spell on itself on a success.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 2."]},{"name":"Blink","type":"Transmutation","casting":"Action","range":"Self","components":"V, S","duration":"1 minute","level":"Level 3","classes":["Sorcerer","Wizard"],"content":["Roll 1d6 at the end of each of your turns for the duration. On a roll of 4-6, you vanish from your current plane of existence and appear in the Ethereal Plane (the spell ends instantly ifyou are already on that plane). While on the Ethereal Plane, you can perceive the plane you left, which is cast in shades of gray, but you can't see anything there more than 60 feet away. You can affect and be affected only by other creatures on the Ethereal Plane, and creatures on the other plane can't perceive you unless they have a special ability that lets them perceive things on the Ethereal Plane.","You return to the other plane at the start of your next turn and when the spell ends if you are on the Ethereal Plane. You return to an unoccupied space of your choice that you can see within 10 feet of the space you left. If no unoccupied space is available within that range, you appear in the nearest unoccupied space."]},{"name":"Blur","type":"Illusion","casting":"Action","range":"Self","components":"V","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Sorcerer","Wizard"],"content":["Your body becomes blurred. For the duration, any creature has Disadvantage on attack rolls against you. An attacker is immune to this effect if it perceives you with Blindsight or Truesight."]},{"name":"Burning Hands","type":"Evocation","casting":"Action","range":"Self","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["A thin sheet of flames shoots forth from you. Each creature in a 15-foot Cone makes a Dexterity saving throw, taking 3d6 Fire damage on a failed save or half as much damage on a successful one.","Flammable objects in the Cone that aren't being worn or carried start burning.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 1."]},{"name":"Call Lightning","type":"Conjuration","casting":"Action","range":"120 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 3","classes":["Druid"],"content":["A storm cloud appears at a point within range that you can see above yourself. It takes the shape of a Cylinder that is 10 feet tall with a 60-foot radius.","When you cast the spell, choose a point you can see under the cloud. A lightning bolt shoots from the cloud to that point. Each creature within 5 feet of that point makes a Dexterity saving throw, taking 3d10 Lightning damage on a failed save or half as much damage on a successful one.","Until the spell ends, you can take a Magic action to call down lightning in that way again, targeting the same point or a different one.","If you're outdoors in a storm when you cast this spell, the spell gives you control over that storm instead of creating a new one. Under such conditions, the spell's damage increases by 1d10.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 3."]},{"name":"Calm Emotions","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Cleric"],"content":["Each Humanoid in a 20-foot-radius Sphere centered on a point you choose within range must succeed on a Charisma saving throw or be affected by one of the following effects (choose for each creature):"," The creature has Immunity to the Charmed and Frightened conditions until the spell ends. If the creature was already Charmed or Frightened, those conditions are suppressed for the duration."," The creature becomes Indifferent about creatures of your choice that it's Hostile toward. This indifference ends if the target takes damage or witnesses its allies taking damage. When the spell ends, the creature's attitude returns to normal."]},{"name":"Chain Lightning","type":"Evocation","casting":"Action","range":"150 feet","components":"V, S, M (three silver pins)","duration":"Instantaneous","level":"Level 6","classes":["Sorcerer","Wizard"],"content":["You launch a lightning bolt toward a target you can see within range. Three bolts then leap from that target to as many as three other targets of your choice, each of which must be within 30 feet of the first target. A target can be a creature or an object and can be targeted by only one of the bolts.","Each target makes a Dexterity saving throw, taking 10d8 Lightning damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** One additional bolt leaps from the first target to another target for each spell slot level above 6."]},{"name":"Charm Monster","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S","duration":"1 hour","level":"Level 4","classes":["Bard","Druid","Sorcerer","Warlock","Wizard"],"content":["One creature you can see within range makes a Wisdom saving throw. It does so with Advantage if you or your allies are fighting it. On a failed save, the target has the Charmed condition until the spell ends or until you or your allies damage it. The Charmed creature is Friendly to you. When the spell ends, the target knows it was Charmed by you.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 4."]},{"name":"Charm Person","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S","duration":"1 hour","level":"Level 1","classes":["Bard","Druid","Sorcerer","Warlock","Wizard"],"content":["One Humanoid you can see within range makes a Wisdom saving throw. It does so with Advantage if you or your allies are fighting it. On a failed save, the target has the Charmed condition until the spell ends or until you or your allies damage it. The Charmed creature is Friendly to you. When the spell ends, the target knows it was Charmed by you.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 1."]},{"name":"Chill Touch","type":"Necromancy","casting":"Action","range":"Touch","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Sorcerer","Warlock","Wizard"],"content":["Channeling the chill of the grave, make a melee spell attack against a target within reach. On a hit, the target takes 1d10 Necrotic damage, and it can't regain Hit Points until the end of your next turn.","***Cantrip Upgrade.*** The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10)."]},{"name":"Chromatic Orb","type":"Evocation","casting":"Action","range":"90 feet","components":"V, S, M (a diamond worth 50+ GP)","duration":"Instantaneous","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["You hurl an orb of energy at a target within range. Choose Acid, Cold, Fire, Lightning, Poison, or Thunder for the type of orb you create, and then make a ranged spell attack against the target. On a hit, the target takes 3d8 damage of the chosen type.","If you roll the same number on two or more of the d8s, the orb leaps to a different target of your choice within 30 feet of the target. Make an attack roll against the new target, and make a new damage roll. The orb can't leap again unless you cast the spell with a level 2+ spell slot.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 1. The orb can leap a maximum number of times equal to the level of the slot expended, and a creature can be targeted only once by each casting of this spell."]},{"name":"Circle of Death","type":"Necromancy","casting":"Action","range":"150 feet","components":"V, S, M (the powder of a crushed black pearl worth 500+ GP)","duration":"Instantaneous","level":"Level 6","classes":["Sorcerer","Warlock","Wizard"],"content":["Negative energy ripples out in a 60-foot-radius Sphere from a point you choose within range. Each creature in that area makes a Constitution saving throw, taking 8d8 Necrotic damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage increases by 2d8 for each spell slot level above 6."]},{"name":"Circle of Power","type":"Abjuration","casting":"Action","range":"Self","components":"V","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Cleric","Paladin","Wizard"],"content":["An aura radiates from you in a 30-foot Emanation for the duration. While in the aura, you and your allies have Advantage on saving throws against spells and other magical effects. When an affected creature makes a saving throw against a spell or magical effect that allows a save to take only half damage, it takes no damage if it succeeds on the save."]},{"name":"Clairvoyance","type":"Divination","casting":"10 minutes","range":"1 mile","components":"V, S, M (a focus worth 100+ GP, either a jeweled horn for hearing or a glass eye for seeing)","duration":"Concentration, uP to 10 minutes","level":"Level 3","classes":["Bard","Cleric","Sorcerer","Wizard"],"content":["You create an Invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The intangible, invulnerable sensor remains in place for the duration.","When you cast the spell, choose seeing or hearing. You can use the chosen sense through the sensor as if you were in its space. As a Bonus Action, you can switch between seeing and hearing.","A creature that sees the sensor (such as a creature benefiting from *See Inyisibility* or *Truesight*) sees a luminous orb about the size of your fist."]},{"name":"Clone","type":"Necromancy","casting":"1 hour","range":"Touch","components":"V, S, M (a diamond worth 1,000+ GP, which the spell consumes, and a sealable vessel worth 2,000+ GP that is large enough to hold the creature being cloned)","duration":"Instantaneous","level":"Level 8","classes":["Wizard"],"content":["You touch a creature or at least 1 cubic inch of its flesh. An inert duplicate of that creature forms inside the vessel used in the spell's casting and finishes growing after 120 days; you choose whether the finished clone is the same age as the creature or younger. The clone remains inert and endures indefinitely while its vessel remains undisturbed.","If the original creature dies after the clone finishes forming, the creature's soul transfers to the clone if the soul is free and willing to return. The clone is physically identical to the original and has the same personality, memories, and abilities, but none of the original's equipment. The creature's original remains, if any, become inert and can't be revived, since the creature's soul is elsewhere."]},{"name":"Cloudkill","type":"Conjuration","casting":"Action","range":"120 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Sorcerer","Wizard"],"content":["You create a 20-foot-radius Sphere of yellow-green fog centered on a point within range. The fog lasts for the duration or until strong wind (such as the one created by *Gust of Wind*) disperses it, ending the spell. Its area is Heavily Obscured.","Each creature in the Sphere makes a Constitution saving throw, taking 5d8 Poison damage on a failed save or half as much damage on a successful one. A creature must also make this save when the Sphere moves into its space and when it enters the Sphere or ends its turn there. A creature makes this save only once per turn.","The Sphere moves 10 feet away from you at the start of each of your turns.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 5."]},{"name":"Cloud of Daggers","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S, M (a sliver of glass)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You conjure spinning daggers in a 5-foot Cube centered on a point within range. Each creature in that area takes 4d4 Slashing damage. A creature also takes this damage if it enters the Cube or ends its turn there or if the Cube moves into its space. A creature takes this damage only once per turn.","On your later turns, you can take a Magic action to teleport the Cube up to 30 feet.","***Using a Higher-Level Spell Slot.*** The damage increases by 2d4 for each spell slot level above 2."]},{"name":"Color Spray","type":"Illusion","casting":"Action","range":"Self","components":"V, S, M (a pinch of colorful sand)","duration":"Instantaneous","level":"Level 1","classes":["Bard","Sorcerer","Wizard"],"content":["You launch adazzling array of flashing, colorful light. Each creature in a 15-foot Cone originating from you must succeed on a Constitution saving throw or have the Blinded condition until the end of your next turn."]},{"name":"Command","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 1","classes":["Bard","Cleric","Paladin"],"content":["You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. Choose the command from these options:","**Approach.** The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.","**Drop.** The target drops whatever it is holding and then ends its turn.","**Flee.** The target spends its turn moving away from you by the fastest available means.","**Grovel.** The target has the Prone condition and then ends its turn.","**Halt.** On its turn, the target doesn't move and takes no action or Bonus Action.","***Using a Higher-Level Spell Slot.*** You can affect one additional creature for each spell slot level above 1."]},{"name":"Commune","type":"Divination","casting":"1 minute or Ritual","range":"Self","components":"V, S, M (incense)","duration":"1 minute","level":"Level 5","classes":["Cleric"],"content":["You contact a deity or a divine proxy and ask up to three questions that can be answered with yes or no. You must ask your questions before the spell ends. You receive a correct answer for each question.","Divine beings aren't necessarily omniscient, so you might receive \\"unclear\\" as an answer if a question pertains to information that lies beyond the deity's knowledge. In a case where a one-word answer could be misleading or contrary to the deity's interests, the DM might offer a short phrase as an answer instead.","If you cast the spell more than once before finishing a Long Rest, there is a cumulative 25 percent chance for each casting after the first that you get no answer."]},{"name":"Commune with Nature","type":"Divination","casting":"1 minute or Ritual","range":"Self","components":"V, S","duration":"Instantaneous","level":"Level 5","classes":["Druid","Ranger"],"content":["You commune with nature spirits and gain knowledge of the surrounding area. In the outdoors, the spell gives you knowledge of the area within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn't function where nature has been replaced by construction, such as in castles and settlements.","Choose three of the following facts; you learn those facts as they pertain to the spell's area:"," Locations of settlements"," Locations of portals to other planes of existence"," Location of one Challenge Rating 10+ creature (DM's choice) that is a Celestial, an Elemental, a Fey, a Fiend, or an Undead"," The most prevalent kind of plant, mineral, or Beast (you choose which to learn)"," Locations of bodies of water","For example, you could determine the location of a powerful monster in the area, the locations of bodies of water, and the locations of any towns."]},{"name":"Compelled Duel","type":"Enchantment","casting":"Bonus Action","range":"30 feet","components":"V","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Paladin"],"content":["You try to compel a creature into a duel. One creature that you can see within range makes a Wisdom saving throw. On a failed save, the target has Disadvantage on attack rolls against creatures other than you, and it can't willingly move to a space that is more than 30 feet away from you.","The spell ends if you make an attack roll against a creature other than the target, ifyou cast a spell on an enemy other than the target, if an ally ofyours damages the target, or if you end your turn more than 30 feet away from the target."]},{"name":"Comprehend Languages","type":"Divination","casting":"Action or Ritual","range":"Self","components":"V, S, M (a pinch of soot and salt)","duration":"1 hour","level":"Level 1","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["For the duration, you understand the literal meaning of any language that you hear or see signed. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text. This spell doesn't decode symbols or secret messages."]},{"name":"Compulsion","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Bard"],"content":["Each creature of your choice that you can see within range must succeed on a Wisdom saving throw or have the Charmed condition until the spell ends.","For the duration, you can take a Bonus Action to designate a direction that is horizontal to you. Each Charmed target must use as much of its movement as possible to move in that direction on its next turn, taking the safest route. After moving in this way, a target repeats the save, ending the spell on itself on a success."]},{"name":"Cone of Cold","type":"Evocation","casting":"Action","range":"Self","components":"V, S, M (a small crystal or glass cone)","duration":"Instantaneous","level":"Level 5","classes":["Druid","Sorcerer","Wizard"],"content":["You unleash a blast of cold air. Each creature in a 60-foot Cone originating from you makes a Constitution saving throw, taking 8d8 Cold damage on a failed save or half as much damage on a successful one. A creature killed by this spell becomes a frozen statue until it thaws.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 5."]},{"name":"Confusion","type":"Enchantment","casting":"Action","range":"90 feet","components":"V, S, M (three nut shells)","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Bard","Druid","Sorcerer","Wizard"],"content":["Each creature in a 10-foot-radius Sphere centered on a point you choose within range must succeed on a Wisdom saving throw or that target can't take Bonus Actions or Reactions and must roll 1d10 at the start of each of its turns to determine its behavior for that turn, consulting the table below.","At the end of each of its turns, an affected target repeats the save, ending the spell on itself on a success.","***Using a Higher-Level Spell Slot.*** The Sphere's radius increases by 5 feet for each spell slot level above 4."],"tables":[{"sizes":[0.15,0.85],"header":[["1d10","Behavior for the Turn"]],"body":[["1","The target doesn't take an action, and it uses all its movement to move. Roll 1d4 for the direction: 1, north; 2, east; 3, south; or 4, west."],["2-6","The target doesn't move or take actions."],["7-8","The target doesn't move, and it takes the Attack action to make one melee attack against a random creature within reach. If none are within reach, the target takes no action."],["9-10","The target chooses its behavior."]]}]},{"name":"Conjure Animals","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 3","classes":["Druid","Ranger"],"content":["You conjure nature spirits that appear as a Large pack of spectral, intangible animals in an unoccupied space you can see within range. The pack lasts for the duration, and you choose the spirits' animal form, such as wolves, serpents, or birds.","You have Advantage on Strength saving throws while you're within 5 feet of the pack, and when you move on your turn, you can also move the pack up to 30 feet to an unoccupied space you can see.","Whenever the pack moves within 10 feet of a creature you can see and whenever a creature you can see enters a space within 10 feet of the pack or ends its turn there, you can force that creature to make a Dexterity saving throw. On a failed save, the creature takes 3d10 Slashing damage. A creature makes this save only once per turn.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 3."]},{"name":"Conjure Barrage","type":"Conjuration","casting":"Action","range":"Self","components":"V, S, M (a Melee or Ranged weapon worth at least 1 CP)","duration":"Instantaneous","level":"Level 3","classes":["Ranger"],"content":["You brandish the weapon used to cast the spell and conjure similar spectral weapons (or ammunition appropriate to the weapon) that launch forward and then disappear. Each creature ofyour choice that you can see in a 60-foot Cone makes a Dexterity saving throw, taking 5d8 Force damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 3."]},{"name":"Conjure Celestial","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 7","classes":["Cleric"],"content":["You conjure a spirit from the Upper Planes, which manifests as a pillar of light in a 10-foot-radius, 40-foot-high Cylinder centered on a point within range. For each creature you can see in the Cylinder, choose which of these lights shines on it:","**Healing Light.** The target regains Hit Points equal to 4d12 plus your spellcasting ability modifier.","**Searing Light.** The target makes a Dexterity saving throw taking 6d12 Radiant damage on a failed save or half as much damage on a successful one.","Until the spell ends, Bright Light fills the Cylinder, and when you move on your turn, you can also move the Cylinder up to 30 feet.","Whenever the Cylinder moves into the space of a creature you can see and whenever a creature you can see enters the Cylinder or ends its turn there, you can bathe it in one of the lights. A creature can be affected by this spell only once per turn.","***Using a Higher-Level Spell Slot.*** The healing and damage increase by 1d12 for each spell slot level above 7."]},{"name":"Conjure Elemental","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Druid","Wizard"],"content":["You conjure a Large, intangible spirit from the Elemental Planes that appears in an unoccupied space within range. Choose the spirit's element, which determines its damage type: air (Lightning), earth (Thunder), fire (Fire), or water (Cold). The spirit lasts for the duration.","Whenever a creature you can see enters the spirit's space or starts its turn within 5 feet of the spirit, you can force that creature to make a Dexterity saving throw if the spirit has no creature Restrained. On failed save, the target takes 8d8 damage of the spirit's type, and the target has the Restrained condition until the spell ends. At the start of each of its turns, the Restrained target repeats the save. On a failed save, the target takes 4d8 damage of the spirit's type. On a successful save, the target isn't Restrained by the spirit.","***Using a Higher-Level Spell Slot.*** The damage increases by 2d8 for each spell slot level above 5."]},{"name":"Conjure Fey","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 6","classes":["Druid"],"content":["You conjure a Medium spirit from the Feywild in an unoccupied space you can see within range. The spirit lasts for the duration, and it looks like a Fey creature of your choice. When the spirit appears, you can make one melee spell attack against a creature within 5 feet of it. On a hit, the target takes Psychic damage equal to 3d12 plus your spellcasting ability modifier, and the target has the Frightened condition until the start of your next turn, with both you and the spirit as the source of the fear.","As a Bonus Action on your later turns, you can teleport the spirit to an unoccupied space you can see within 30 feet of the space it left and make the attack against a creature within 5 feet of it.","***Using a Higher-Level Spell Slot.*** The damage increases by 2d12 for each spell slot level above 6."]},{"name":"Conjure Minor Elementals","type":"Conjuration","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 4","classes":["Druid","Wizard"],"content":["You conjure spirits from the Elemental Planes that flit around you in a 15-foot Emanation for the duration. Until the spell ends, any attack you make deals an extra 2d8 damage when you hit a creature in the Emanation. This damage is Acid, Cold, Fire, or Lightning (your choice when you make the attack).","In addition, the ground in the Emanation is Difficult Terrain for your enemies.","***Using a Higher-Level Spell Slot.*** The damage increases by 2d8 for each spell slot level above 4."]},{"name":"Conjure Volley","type":"Conjuration","casting":"Action","range":"150 feet","components":"V, S, M (a Melee or Ranged weapon worth at least 1 CP)","duration":"Instantaneous","level":"Level 5","classes":["Ranger"],"content":["You brandish the weapon used to cast the spell and choose a point within range. Hundreds of similar spectral weapons (or ammunition appropriate to the weapon) fall in a volley and then disappear. Each creature of your choice that you can see in a 40-foot-radius, 20-foot-high Cylinder centered on that point makes a Dexterity saving throw. A creature takes 8d8 Force damage on a failed save or half as much damage on a successful one."]},{"name":"Conjure Woodland Beings","type":"Conjuration","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to '10 minutes","level":"Level 4","classes":["Druid","Ranger"],"content":["You conjure nature spirits that flit around you in a 10-foot Emanation for the duration. Whenever the Emanation enters the space of a creature you can see and whenever a creature you can see enters the Emanation or ends its turn there, you can force that creature to make a Wisdom saving throw. The creature takes 5d8 Force damage on a failed save or half as much damage on a successful one. A creature makes this save only once per turn.","In addition, you can take the Disengage action as a Bonus Action for the spell's duration.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 5."]},{"name":"Contact Other Plane","type":"Divination","casting":"1 minute or Ritual","range":"Self","components":"V","duration":"1 minute","level":"Level 5","classes":["Warlock","Wizard"],"content":["You mentally contact a demigod, the spirit of a long-dead sage, or some other knowledgeable entity from another plane. Contacting this otherworldly intelligence can break your mind. When you cast this spell, make a DC 15 Intelligence saving throw. On a successful save, you can ask the entity up to five questions. You must ask your questions before the spell ends. The DM answers each question with one word, such as \\"yes\\", \\"no,t'\\"maybe\\", \\"never\\", \\"irrelevant\\", or \\"unclear\\" (if the entity doesn't know the answer to the question). If a one-word answer would be misleading, the DM might instead offer a short phrase as an answer.","On a failed save, you take 6d6 Psychic damage and have the Incapacitated condition until you finish a Long Rest. A *Greater Restorotion* spell cast on you ends this effect."]},{"name":"Contagion","type":"Necromancy","casting":"Action","range":"Touch","components":"V, S","duration":"7 days","level":"Level 5","classes":["Cleric","Druid"],"content":["Your touch inflicts a magical contagion. The target must succeed on a Constitution saving throw or take 11d8 Necrotic damage and have the Poisoned condition. Also, choose one ability when you cast the spell. While Poisoned, the target has Disadvantage on saving throws made with the chosen ability.","The target must repeat the saving throw at the end of each of its turns until it gets three successes or failures. If the target succeeds on three of these saves, the spell ends on the target. If the target fails three of the saves, the spell lasts for 7 days on it.","Whenever the Poisoned target receives an effect that would end the Poisoned condition, the target must succeed on a Constitution saving throw or the Poisoned condition doesn't end on it."]},{"name":"Contingency","type":"Abjuration","casting":"10 minutes","range":"Self","components":"V, S, M (a gem-encrusted statuette of yourself worth 1,500+ GP)","duration":"10 days","level":"Level 6","classes":["Wizard"],"content":["Choose a spell of level 5 or lower that you can cast, that has a casting time of an action, and that can target you. You cast that spell-called the contingent spell-as part of casting *Contingency*, expending spell slots for both, but the contingent spell doesn't come into effect. Instead, it takes effect when a certain trigger occurs. You describe that trigger when you cast the two spells. For example, a *Contingency* cast with Water Breathing might stipulate that *Water Breathing* comes into effect when you are engulfed in water or a similar liquid.","The contingent spell takes effect immediately after the trigger occurs for the first time, whether or not you want it to, and then *Contingency* ends.","The contingent spell takes effect only on you, even if it can normally target others. You can use only one *Contingency* spell at a time. If you cast this spell again, the effect ofanother *Contingency* spell onyou ends. Also, *Contingency* ends on you if its material component is ever not on your person."]},{"name":"Continual Flame","type":"Evocation","casting":"Action","range":"Touch","components":"V, S, M (ruby dust worth 50+ GP, which the spell consumes)","duration":"Until dispelled","level":"Level 2","classes":["Cleric","Druid","Wizard"],"content":["A flame springs from an object that you touch. The effect casts Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. It looks like a regular flame, but it creates no heat and consumes no fuel. The flame can be covered or hidden but not smothered or quenched."]},{"name":"Control Water","type":"Transmutation","casting":"Action","range":"300 feet","components":"V, S, M (a mixture of water and dust)","duration":"Concentration, up to 10 minutes","level":"Level 4","classes":["Cleric","Druid","Wizard"],"content":["Until the spell ends, you control any water inside an area you choose that is a Cube up to 100 feet on a side, using one of the following effects. As a Magic action on your later turns, you can repeat the same effect or choose a different one.","***Flood.*** You cause the water level of all standing water in the area to rise by as much as 20 feet. If you choose an area in a large body of water, you instead create a 20-foot tall wave that travels from one side of the area to the other and then crashes. Any Huge or smaller vehicles in the wave's path are carried with it to the other side. Any Huge or smaller vehicles struck by the wave have a 25 percent chance of capsizing.","The water level remains elevated until the spell ends or you choose a different effect. If this effect produced a wave, the wave repeats on the start of your next turn while the flood effect lasts.","***Part Water.*** You part water in the area and create a trench. The trench extends across the spell's area, and the separated water forms a wall to either side. The trench remains until the spell ends or you choose a different effect. The water then slowly fills in the trench over the course of the next round until the normal water level is restored.","***Redirect Flow.*** You cause flowing water in the area to move in a direction you choose, even if the water has to flow over obstacles, up walls, or in other unlikely directions. The water in the area moves as you direct it, but once it moves beyond the spell's area, it resumes its flow based on the terrain. The water continues to move in the direction you chose until the spell ends or you choose a different effect.","***Whirlpool.*** You cause a whirlpool to form in the center of the area, which must be at least 50 feet square and 25 feet deep. The whirlpool lasts until you choose a different effect or the spell ends. The whirlpool is 5 feet wide at the base, up to 50 feet wide at the top, and 25 feet tall. Any creature in the water and within 25 feet of the whirlpool is pulled 10 feet toward it. When a creature enters the whirlpool for the first time on a turn or ends its turn there, it makes a Strength saving throw. On a failed save, the creature takes 2d8 Bludgeoning damage. On a successful save, the creature takes half as much damage. A creature can swim away from the whirlpool only if it first takes an action to pull away and succeeds on a Strength (Athletics) check against your spell save DC."]},{"name":"Control Weather","type":"Transmutation","casting":"10 minutes","range":"Self","components":"V, S, M (burning incense)","duration":"Concentration, up to 8 hours","level":"Level 8","classes":["Cleric","Druid","Wizard"],"content":["You take control of the weather within 5 miles of you for the duration. You must be outdoors to cast this spell, and it ends early if you go indoors.","When you cast the spell, you change the current weather conditions, which are determined bv the DM. You can change precipitation, temperature, and wind. It takes 1d4 x 10 minutes for the new conditions to take effect. Once they do so, you can change the conditions again. When the spell ends, the weather gradually returns to normal.","When you change the weather conditions, find a current condition on the following tables and change its stage by one, up or down. When changing the wind, you can change its direction."],"tables":[{"title":"Preciptation","sizes":[0.15,0.85],"header":[["Stage","Condition"]],"body":[["1","Clear"],["2","Light clouds"],["3","Overcast or ground fog"],["4","Rain, hail, or snow"],["5","Torrential rain, driving hail, or blizzard"]]},{"title":"Temperature","sizes":[0.15,0.85],"header":[["Stage","Condition"]],"body":[["1","Heat wave"],["2","Hot"],["3","Warm"],["4","Cool"],["5","Cold"],["6","Freezing"]]},{"title":"Wind","sizes":[0.15,0.85],"header":[["Stage","Condition"]],"body":[["1","Calm"],["2","Moderate wind"],["3","Strong wind"],["4","Gale"],["5","Storm"]]}]},{"name":"Cordon of Arrows","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (an ornamental braid)","duration":"8 hours","level":"Level 2","classes":["Ranger"],"content":["You touch up to four nonmagical Arrows or Bolts and plant them in the ground in your space. Until the spell ends, the ammunition can't be physically uprooted, and whenever a creature other than you enters a space within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 2d4 Piercing damage. The piece of ammunition is then destroyed. The spell ends when none of the ammunition remains planted in the ground.","When you cast this spell, you can designate any creatures you choose, and the spell ignores them.","***Using a Higher-Level Spell Slot.*** The amount of ammunition that can be affected increases by two for each spell slot level above 2."]},{"name":"Counterspell","type":"Abjuration","casting":"Reaction, which you take when you see a creature within 60 feet of yourself casting a spell with Verbal, Somatic, or Material components","range":"60 feet","components":"S","duration":"Instantaneous","level":"Level 3","classes":["Sorcerer","Warlock","Wizard"],"content":["You attempt to interrupt a creature in the process of casting a spell. The creature makes a Constitution saving throw. On a failed save, the spell dissipates with no effect, and the action, Bonus Action, or Reaction used to cast it is wasted. If that spell was cast with a spell slot, the slot isn't expended."]},{"name":"Create Food and Water","type":"Conjuration","casting":"Action","range":"30 feet","components":"V, S","duration":"Instantaneous","level":"Level 3","classes":["Cleric","Paladin"],"content":["You create 45 pounds of food and 30 gallons of fresh water on the ground or in containers within range-both useful in fending off the hazards of malnutrition and dehydration. The food is bland but nourishing and looks like a food of your choice, and the water is clean. The food spoils after 24 hours if uneaten."]},{"name":"Create or Destroy Water","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S, M (a mix of water and sand)","duration":"Instantaneous","level":"Level 1","classes":["Cleric","Druid"],"content":["You do one of the following:","**Create Water.** You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot Cube within range, extinguishing exposed flames there.","**Destroy Water.** You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot Cube within range.","***Using a Higher-Level Spell Slot.*** You create or destroy 10 additional gallons of water, or the size of the Cube increases by 5 feet, for each spell slot level above 1."]},{"name":"Create Undead","type":"Necromancy","casting":"1 minute","range":"10 feet","components":"V, S, M (one 150+ GP black onyx stone for each corpse)","duration":"Instantaneous","level":"Level 6","classes":["Cleric","Warlock","Wizard"],"content":["You can cast this spell only at night. Choose up to three corpses of Medium or Small Humanoids within range. Each one becomes a **Ghoul** under your control (see the *Monster Manual* for its stat block).","As a Bonus Action on each of your turns, you can mentally command any creature you animated with this spell if the creature is within 120 feet of you (if you control multiple creatures, you can command any of them at the same time, issuing the same command to them). You decide what action the creature will take and where it will move on its next turn, or you can issue a general command, such as to guard a particular place. If you issue no commands, the creature takes the Dodge action and moves only to avoid harm. Once given an order, the creature continues to follow the order until its task is complete.","The creature is under your control for 24 hours, after which it stops obeying any command you've given it. To maintain control of the creature for another 24 hours, you must cast this spell on the creature before the current 24-hour period ends. This use of the spell reasserts your control over up to three creatures you have animated with this spell rather than animating new ones.","***Using a Higher-Level Spell Slot.*** If you use a level 7 spell slot, you can animate or reassert control over four **Ghouls**. If you use a level 8 spell slot, you can animate or reassert control over five **Ghouls** or two **Ghasts** or **Wights**. If you use a level 9 spell slot, you can animate or reassert control over six **Ghouls**, three **Ghasts** or **Wights**, or two **Mummies**. See the *Monster Manual* for these stat blocks."]},{"name":"Creation","type":"Illusion","casting":"1 minute","range":"30 feet","components":"V, S, M (a paintbrush)","duration":"Special","level":"Level 5","classes":["Sorcerer","Wizard"],"content":["You pull wisps of shadow material from the Shadowfell to create an object within range. It is either an object of vegetable matter (soft goods, rope, wood, and the like) or mineral matter (stone, crystal, metal, and the like). The object must be no larger than a 5-foot Cube, and the object must be of a form and material that you have seen.","The spell's duration depends on the object's material, as shown in the Materials table. If the object is composed of multiple materials, use the shortest duration. Using any object created by this spell as another spell's Material component causes the other spell to fail.","***Using a Higher-Level Spell Slot.*** The Cube increases by 5 feet for each spell slot level above 5."],"tables":[{"title":"Materials","sizes":[0.6,0.4],"header":[["Material","Duration"]],"body":[["Vegetable matter","24 hours"],["Stone or crystal","12 hours"],["Precious metals","1 hour"],["Gems","10 minutes"],["Adamantine or mithral","1 minute"]]}]},{"name":"Crown of Madness","type":"Enchantment","casting":"Action","range":"120 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["One creature that you can see within range must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The creature succeeds automatically if it isn't Humanoid.","A spectral crown appears on the Charmed target's head, and it must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose. The target can act normally on its turn if you choose no creature or if no creature is within its reach. The target repeats the save at the end of each of its turns, ending the spell on itself on a success.","On your later turns, you must take the Magic action to maintain control of the target, or the spell ends."]},{"name":"Crusader's Mantle","type":"Evocation","casting":"Action","range":"Self","components":"V","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Paladin"],"content":["You radiate a magical aura in a 30-foot Emanation While in the aura, you and your allies each deal an extra 1d4 Radiant damage when hitting with a weapon or an Unarmed Strike."]},{"name":"Cure Wounds","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Bard","Cleric","Druid","Paladin","Ranger"],"content":["A creature you touch regains a number of Hit Points equal to 2d8 plus your spellcasting ability modifier.","***Using a Higher-Level Spell Slot.*** The healing increases by 2d8 for each spell slot level above 1."]},{"name":"Dancing Lights","type":"Illusion","casting":"Action","range":"120 feet","components":"V, S, M (a bit of phosphorus)","duration":"Concentration, up to 1 minute","level":"Cantrip","classes":["Bard","Sorcerer","Wizard"],"content":["You create up to four torch-size lights within range, making them appear as torches, lanterns, or glowing orbs that hover for the duration. Alternatively, you combine the four lights into one glowing Medium form that is vaguely humanlike. Whichever form you choose, each light sheds Dim Light in a 10-foot radius.","As a Bonus Action, you can move the lights up to 60 feet to a space within range. A light must be within 20 feet of another light created by this spell, and a light vanishes if it exceeds the spell's range."]},{"name":"Darkness","type":"Evocation","casting":"Action","range":"60 feet","components":"V, M (bat fur and a piece of coal)","duration":"Concentration, up to 10 minutes","level":"Level 2","classes":["Sorcerer","Warlock","Wizard"],"content":["For the duration, magical Darkness spreads from a point within range and fills a 15-foot-radius Sphere. Darkvision can't see through it, and nonmagical light can't illuminate it.","Alternatively, you cast the spell on an object that isn't being worn or carried, causing the Darkness to fill a 15-foot Emanation originating from that object. Covering that object with something opaque, such as a bowl or helm, blocks the Darkness.","If any of this spell's area overlaps with an area of Bright Light or Dim Light created by a spell of level 2 or lower, that other spell is dispelled."]},{"name":"Darkvision","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (a dried carrot)","duration":"8 hours","level":"Level 2","classes":["Druid","Ranger","Sorcerer","Wizard"],"content":["For the duration, a willing creature you touch has Darkvision with a range of 150 feet."]},{"name":"Daylight","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S","duration":"1 hour","level":"Level 3","classes":["Cleric","Druid","Paladin","Ranger","Sorcerer"],"content":["For the duration, sunlight spreads from a point within range and fills a 60-foot-radius Sphere. The sunlight's area is Bright Light and sheds Dim Light for an additional 60 feet.","Alternatively, you cast the spell on an object that isn't being worn or carried, causing the sunlight to fill a 60-foot Emanation originating from that object. Covering that object with something opaque, such as a bowl or helm, blocks the sunlight.","If any of this spell's area overlaps with an area of Darkness created by a spell of level 3 or lower, that other spell is dispelled."]},{"name":"Death Ward","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S","duration":"8 hours","level":"Level 4","classes":["Cleric","Paladin"],"content":["You touch a creature and grant it a measure of protection from death. The first time the target would drop to 0 Hit Points before the spell ends, the target instead drops to 1 Hit Point, and the spell ends.","If the spell is still in effect when the target is subjected to an effect that would kill it instantly without dealing damage, that effect is negated against the target, and the spell ends."]},{"fontSize":1.9,"name":"Delayed Blast Fireball","type":"Evocation","casting":"Action","range":"150 feet","components":"V, S, M (a ball of bat guano and sulfur)","duration":"Concentration, up to 1 minute","level":"Level 7","classes":["Sorcerer","Wizard"],"content":["A beam of yellow light flashes from you, then condenses at a chosen point within range as a glowing bead for the duration. When the spell ends, the bead explodes, and each creature in a 20-foot-radius Sphere centered on that point makes a Dexterity saving throw. A creature takes Fire damage equal to the total accumulated damage on a failed save or half as much damage on a successful one.","The spell's base damage is 12d6, and the damage increases by 1d6 whenever your turn ends and the spell hasn't ended.","If a creature touches the glowing bead before the spell ends, that creature makes a Dexterity saving throw. On a failed save, the spell ends, causing the bead to explode. On a successful save, the creature can throw the bead up to 40 feet. If the thrown bead enters a creature's space or collides with a solid object, the spell ends, and the bead explodes.","When the bead explodes, flammable objects in the explosion that aren't being worn or carried start burning.","***Using a Higher-Level Spell Slot.*** The base damage increases by 1d6 for each spell slot level above 7."]},{"name":"Demiplane","type":"Conjuration","casting":"Action","range":"60 feet","components":"S","duration":"1 hour","level":"Level 8","classes":["Sorcerer","Warlock","Wizard"],"content":["You create a shadowy Medium door on a flat solid surface that you can see within range. This door can be opened and closed, and it leads to a demiplane that is an empty room 30 feet in each dimension, made of wood or stone (your choice).","When the spell ends, the door vanishes, and any objects inside the demiplane remain there. Any creatures inside also remain unless they opt to be shunted through the door as it vanishes, landing with the Prone condition in the unoccupied spaces closest to the door's former space.","Each time you cast this spell, you can create a new demiplane or connect the shadowy door to a demiplane you created with a previous casting of this spell. Additionally, if you know the nature and contents of a demiplane created by a casting of this spell by another creature, you can connect the shadowy door to that demiplane instead."]},{"name":"Destructive Wave","type":"Evocation","casting":"Action","range":"Self","components":"V","duration":"Instantaneous","level":"Level 5","classes":["Paladin"],"content":["Destructive energy ripples outward from you in a 30-foot Emanation. Each creature you choose in the Emanation makes a Constitution saving throw. On a failed save, a target takes 5d6 Thunder damage and 5d6 Radiant or Necrotic damage (your choice) and has the Prone condition. On a successful save, a target takes half as much damage only."]},{"name":"Detect Evil and Good","type":"Divination","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 1","classes":["Cleric","Paladin"],"content":["For the duration, you sense the location of any Aberration, Celestial, Elemental, Fey, Fiend, or Undead within 30 feet of yourself. You also sense whether the *Hallow* spell is active there and, if so, where.","The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead."]},{"name":"Detect Magic","type":"Divination","casting":"Action or Ritual","range":"Self","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 1","classes":["Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"],"content":["For the duration, you sense the presence of magical effects within 30 feet of yourself. If you sense such effects, you can take the Magic action to see a faint aura around any visible creature or object in the area that bears the magic, and if an effect was created by a spell, you learn the spell's school of magic.","The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead."]},{"name":"Detect Poison and Disease","type":"Divination","casting":"Action or Ritual","range":"Self","components":"V, S, M (a yew leaf)","duration":"Concentration, up to 10 minutes","level":"Level 1","classes":["Cleric","Druid","Paladin","Ranger"],"content":["For the duration, you sense the location of poisons, poisonous or venomous creatures, and magical contagions within 30 feet of yourself. You sense the kind of poison, creature, or contagion in each case.","The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead."]},{"name":"Detect Thoughts","type":"Divination","casting":"Action","range":"Self","components":"V, S, M (1 Copper Piece)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Sorcerer","Wizard"],"content":["You activate one of the effects below. Until the spell ends, you can activate either effect as a Magic action on your later turns.","***Sense Thoughts.*** You sense the presence of thoughts within 30 feet of yourself that belong to creatures that know languages or are telepathic. You don't read the thoughts, but you know that a thinking creature is present.","The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.","***Read Thoughts.*** Target one creature you can see within 30 feet of yourself or one creature within 30 feet of yourself that you detected with the Sense Thoughts option. You learn what is most on the target's mind right now. If the target doesn't know any languages and isn't telepathic, you learn nothing.","As a Magic action on your next turn, you can try to probe deeper into the target's mind. If you probe deeper, the target makes a Wisdom saving throw. On a failed save, you discern the target's reasoning, emotions, and something that looms large in its mind (such as a worry, love, or hate). On a successful save, the spell ends. Either way, the target knows that you are probing into its mind, and until you shift your attention away from the target's mind, the target can take an action on its turn to make an Intelligence (Arcana) check against your spell save DC, ending the spell on a success."]},{"name":"Dimension Door","type":"Conjuration","casting":"Action","range":"500 feet","components":"V","duration":"Instantaneous","level":"Level 4","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You teleport to a location within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction, such as \\"200 feet straight downward\\" or \\"300 feet upward to the northwest at a 45-degree angle\\".","You can also teleport one willing creature. The creature must be within 5 feet of you when you teleport, and it teleports to a space within 5 feet of your destination space.","If you, the other creature, or both would arrive in a space occupied by a creature or completely filled by one or more objects, you and any creature traveling with you each take 4d6 Force damage, and the teleportation fails."]},{"name":"Disguise Self","type":"Illusion","casting":"Action","range":"Self","components":"V, S","duration":"1 hour","level":"Level 1","classes":["Bard","Sorcerer","Wizard"],"content":["You make yourself-including your clothing, armor, weapons, and other belongings on your person-look different until the spell ends. You can seem 1 foot shorter or taller and can appear heavier or lighter. You must adopt a form that has the same basic arrangement of limbs as you have. Otherwise, the extent of the illusion is up to you.","The changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to your outfit, objects pass through the hat, and anyone who touches it would feel nothing.","To discern that you are disguised, a creature must take the Study action to inspect your appearance and succeed on an Intelligence (Investigation) check against your spell save DC."]},{"name":"Disintegrate","type":"Transmutation","casting":"Action","range":"60 feet","components":"V, S, M (a lodestone and dust)","duration":"Instantaneous","level":"Level 6","classes":["Sorcerer","Wizard"],"content":["You launch a green ray at a target you can see within range. The target can be a creature, a nonmagical object, or a creation of magical force, such as the wall created by *Wall of Force*.","A creature targeted by this spell makes a Dexterity saving throw. On a failed save, the target takes 10d6 + 40 Force damage. If this damage reduces it to 0 Hit Points, it and everything nonmagical it is wearing and carrying are disintegrated into gray dust. The target can be revived only by a *True Resurrection* or a *Wish* spell.","This spell automatically disintegrates a Large or smaller nonmagical object or a creation of magical force. If such a target is Huge or larger, this spell disintegrates a 10-foot-Cube portion of it.","***Using a Higher-Level Spell Slot.*** The damage increases by 3d6 for each spell slot level above 6."]},{"name":"Dispel Evil and Good","type":"Abjuration","casting":"Action","range":"Self","components":"V, S, M (powdered silver and iron)","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Cleric","Paladin"],"content":["For the duration, Celestials, Elementals, Fey, Fiends, and Undead have Disadvantage on attack rolls against you. You can end the spell early by using either of the following special functions.","***Break Enchantment.*** As a Magic action, you touch a creature that is possessed by or has the Charmed or Frightened condition from one or more creatures of the types above. The target is no longer possessed, Charmed, or Frightened by such creatures.","***Dismissal.*** As a Magic action, you target one creature you can see within 5 feet of you that has one of the creature types above. The target must succeed on a Charisma saving throw or be sent back to its home plane if it isn't there already. If they aren't on their home plane, Undead are sent to the Shadowfell, and Fey are sent to the Feywild."]},{"name":"Dispel Magic","type":"Abjuration","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Level 3","classes":["Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"],"content":["Choose one creature, object, or magical effect within range. Any ongoing spell of level 3 or lower on the target ends. For each ongoing spell of level 4 or higher on the target, make an ability check using your spellcasting ability (DC 10 plus that spell's level). On a successful check, the spell ends.","***Using a Higher-Level Spell Slot.*** You automatically end a spell on the target if the spell's level is equal to or less than the level of the spell slot you use."]},{"name":"Dissonant Whispers","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 1","classes":["Bard"],"content":["One creature of your choice that you can see within range hears a discordant melody in its mind. The target makes a Wisdom saving throw. On a failed save, it takes 3d6 Psychic damage and must immediately use its Reaction, if available, to move as far away from you as it can, using the safest route. On a successful save, the target takes half as much damage only.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 1."]},{"name":"Divination","type":"Divination","casting":"Action or Ritual","range":"Self","components":"V, S, M (incense worth 25+ GP which the spell consumes)","duration":"Instantaneous","level":"Level 4","classes":["Cleric","Druid","Wizard"],"content":["This spell puts you in contact with a god or a god's servants. You ask one question about a specific goal, event, or activity to occur within 7 days. The DM offers a truthful reply, which might be a short phrase or cryptic rhyme. The spell doesn't account for circumstances that might change the answer, such as the casting of other spells.","If you cast the spell more than once before finishing a Long Rest, there is a cumulative 25 percent chance for each casting after the first that you get no answer."]},{"name":"Divine Favor","type":"Transmutation","casting":"Bonus Action","range":"Self","components":"V, S","duration":"1 minute","level":"Level 1","classes":["Paladin"],"content":["Until the spell ends, your attacks with weapons deal an extra 1d4 Radiant damage on a hit."]},{"name":"Divine Smite","type":"Evocation","casting":"Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"Instantaneous","level":"Level 1","classes":["Paladin"],"content":["The target takes an extra 2d8 Radiant damage from the attack. The damage increases by 1d8 if the target is a Fiend or an Undead.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 1."]},{"name":"Divine Word","type":"Evocation","casting":"Bonus Action","range":"30 feet","components":"V","duration":"Instantaneous","level":"Level 7","classes":["Cleric"],"content":["You utter a word imbued with power from the Upper Planes. Each creature ofyour choice in range makes a Charisma saving throw. On a failed save, a target that has 50 Hit Points or fewer suffers an effect based on its current Hit Points, as shown in the Divine Word Effects table. Regardless of its Hit Points, a Celestial, an Elemental, a Fey, or a Fiend target that fails its save is forced back to its plane of origin (if it isn't there already) and can't return to the current plane for 24 hours by any means short of a *Wish* spell."],"tables":[{"title":"Divine Word Effects","sizes":[0.25,0.75],"header":[["Hit Points","Effect"]],"body":[["0-20","The target dies."],["21-30","The target has the Blinded, Deafened, and Stunned conditions for 1 hour."],["31-40","The target has the Blinded and Deafened conditions for 10 minutes."],["41-50","The target has the Deafened condition for 1 minute."]]}]},{"name":"Dominate Beast","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Druid","Ranger","Sorcerer"],"content":["One Beast you can see within range must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target has Advantage on the save if you or your allies are fighting it. Whenever the target takes damage, it repeats the save, ending the spell on itself on a success.","You have a telepathic link with the Charmed target while the two of you are on the same plane of existence. On your turn, you can use this link to issue commands to the target (no action required), such as \\"Attack that creature\\", \\"Move over there\\" or \\"Fetch that object\\". The target does its best to obey on its turn. If it completes an order and doesn't receive further direction from you, it acts and moves as it likes, focusing on protecting itself.","You can command the target to take a Reaction but must take your own Reaction to do so.","***Using a Higher-Level Spell Slot.*** Your Concentration can last longer with a spell slot of level 5 (up to 10 minutes), 6 (up to 1 hour), or 7+ (up to 8 hours)."]},{"name":"Dominate Monster","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 hour","level":"Level 8","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["One creature you can see within range must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target has Advantage on the save if you or your allies are fighting it. Whenever the target takes damage, it repeats the save, ending the spell on itself on a success.","You have a telepathic link with the Charmed target while the two of you are on the same plane of existence. On your turn, you can use this link to issue commands to the target (no action required), such as \\"Attack that creature\\", \\"Move over there\\", or \\"Fetch that object\\". The target does its best to obey on its turn. If it completes an order and doesn't receive further direction from you, it acts and moves as it likes, focusing on protecting itself.","You can command the target to take a Reaction but must take your own Reaction to do so.","Using a Higher-Level Spell Slot Your Concentration can last longer with a level 9 spell slot (up to 8 hours)."]},{"name":"Dominate Person","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Bard","Sorcerer","Wizard"],"content":["One Humanoid you can see within range must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target has Advantage on the save if you or your allies are fighting it. Whenever the target takes damage, it repeats the save, ending the spell on itself on a success.","You have a telepathic link with the Charmed target while the two of you are on the same plane of existence. On your turn, you can use this link to issue commands to the target (no action required), such as \\"Attack that creature\\", \\"Move over there\\", or \\"Fetch that object\\". The target does its best to obey on its turn. If it completes an order and doesn't receive further direction from you, it acts and moves as it likes, focusing on protecting itself.","You can command the target to take a Reaction but must take your own Reaction to do so.","***Using a Higher-Level Spell Slot.*** Your Concentration can last longer with a spell slot of level 6 (up to 10 minutes), 7 (up to 1 hour), or 8+ (up to 8 hours)."]},{"name":"Dragon's Breath","type":"Transmutation","casting":"Bonus Action","range":"Touch","components":"V, S, M (a hot pepper)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Sorcerer","Wizard"],"content":["You touch one willing creature, and choose Acid, Cold, Fire, Lightning, or Poison. Until the spell ends, the target can take a Magic action to exhale a 15-foot Cone. Each creature in that area makes a Dexterity saving throw taking 3d6 damage of the chosen type on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 2."]},{"name":"Drawmij's Instant Summons","type":"Conjuration","casting":"1 minute or Ritual","range":"Touch","components":"V, S, M (a sapphire worth 1,000+ GP)","duration":"Until dispelled","level":"Level 6","classes":["Wizard"],"content":["You touch the sapphire used in the casting and an object weighing 10 pounds or less whose longest dimension is 6 feet or less. The spell leaves an Invisible mark on that object and invisibly inscribes the object's name on the sapphire. Each time you cast this spell, you must use a different sapphire.","Thereafter, you can take a Magic action to speak the object's name and crush the sapphire. The object instantly appears in your hand regardless of physical or planar distances, and the spell ends.","If another creature is holding or carrying the object, crushing the sapphire doesn't transport it, but instead you learn who that creature is and where that creature is currently located."]},{"fontSize":1.9,"name":"Dream","type":"Illusion","casting":"1 minute","range":"Special","components":"V, S, M (a handful of sand)","duration":"8 hours","level":"Level 5","classes":["Bard","Warlock","Wizard"],"content":["You target a creature you know on the same plane of existence. You or a willing creature you touch enters a trance state to act as a dream messenger. While in the trance, the messenger is Incapacitated and has a Speed of 0.","If the target is asleep, the messenger appears in the target's dreams and can converse with the target as long as it remains asleep, through the spell's duration. The messenger can also shape the dream's environment, creating landscapes, objects, and other images. The messenger can emerge from the trance at any time, ending the spell. The target recalls the dream perfectly upon waking.","If the target is awake when you cast the spell, the messenger knows it and can either end the trance (and the spell) or wait for the target to sleep, at which point the messenger enters its dreams.","You can make the messenger terrifying to the target. If you do so, the messenger can deliver a message of no more than ten words, and then the target makes a Wisdom saving throw. On a failed save, the target gains no benefit from its rest, and it takes 3d6 Psychic damage when it wakes up."]},{"name":"Druidcraft","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Druid"],"content":["Whispering to the spirits of nature, you create one of the following effects within range.","***Weather Sensor.*** You create a Tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. The effect might manifest as a golden orb for clear skies, a cloud for rain, falling snowflakes for snow, and so on. This effect persists for 1 round.","***Bloom.*** You instantly make a flower blossom, a seed pod open, or a leaf bud bloom.","***Sensory Effect.*** You create a harmless sensory effect, such as falling leaves, spectral dancing fairies, a gentle breeze, the sound of an animal, or the faint odor of skunk. The effect must fit in a 5-foot Cube.","***Fire Play.*** You light or snuff out a candle, a torch, or a campfire."]},{"name":"Earthquake","type":"Transmutation","casting":"Action","range":"500 feet","components":"V, S, M (a fractured rock)","duration":"Concentration, up to 1 minute","level":"Level 8","classes":["Cleric","Druid","Sorcerer"],"content":["Choose a point on the ground that you can see within range. For the duration, an intense tremor rips through the ground in a 100-foot-radius circle centered on that point. The ground there is Difficult Terrain.","When you cast this spell and at the end of each of your turns for the duration, each creature on the ground in the area makes a Dexterity saving throw. On a failed save, a creature has the Prone condition, and its Concentration is broken.","You can also cause the effects below","***Fissures.*** A total of 1d6 fissures open in the spell's area at the end of the turn you cast it. You choose the fissures'locations, which can't be under structures. Each fissure is 1d10 x 10 feet deep and 10 feet wide, and it extends from one edge of the spell's area to another edge. A creature in the same space as a fissure must succeed on a Dexterity saving throw or fall in. A creature that successfully saves moves with the fissure's edge as it opens.","***Structures.*** The tremor deals 50 Bludgeoning damage to any structure in contact with the ground in the area when you cast the spell and at the end of each ofyour turns until the spell ends. If a structure drops to 0 Hit Points, it collapses.","A creature within a distance from a collapsing structure equal to half the structure's height makes a Dexterity saving throw. On a failed save, the creature takes 12d6 Bludgeoning damage, has the Prone condition, and is buried in the rubble, requiring a DC 20 Strength (Athletics) check as an action to escape. On a successful save, the creature takes half as much damage only."]},{"name":"Eldritch Blast","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Warlock"],"content":["You hurl a beam of crackling energy. Make a ranged spell attack against one creature or object in range. On a hit, the target takes 1d10 Force damage.","***Cantrip Upgrade.*** The spell creates two beams at level 5, three beams at level 11, and four beams at level 17. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam."]},{"name":"Elementalism","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Druid","Sorcerer","Wizard"],"content":["You exert control over the elements, creating one of the following effects within range.","***Beckon Air.*** You create a breeze strong enough to ripple cloth, stir dust, rustle leaves, and close open doors and shutters, all in a 5-foot Cube. Doors and shutters being held open by someone or something aren't affected.","***Beckon Earth.*** You create a thin shroud of dust or sand that covers surfaces in a 5-foot-square area, or you cause a single word to appear in your handwriting in a patch of dirt or sand.","***Beckon Fire.*** You create a thin cloud of harmless embers and colored, scented smoke in a 5-foot Cube. You choose the color and scent, and the embers can light candles, torches, or lamps in that area. The smoke's scent lingers for 1 minute.","***Beckon Water.*** You create a spray of cool mist that lightly dampens creatures and objects in a 5-foot Cube. Alternatively, you create 1 cup of clean water either in an open container or on a surface, and the water evaporates in 1 minute.","***Sculpt Element.*** You cause dirt, sand, fire, smoke, mist, or water that can fit in a 1-foot Cube to assume a crude shape (such as that ofa creature) for 1 hour."]},{"name":"Elemental Weapon","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S","duration":"Concentration, up to 1 hour","level":"Level 3","classes":["Druid","Paladin","Ranger"],"content":["A nonmagical weapon you touch becomes a magic weapon. Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. For the duration, the weapon has a +1 bonus to attack rolls and deals an extra 1d4 damage of the chosen type when it hits.","***Using a Higher-Level Spell Slot.*** If you use a level 5-6 spell slot, the bonus to attack rolls increases to +2, and the extra damage increases to 2d4. If you use a level 7+ spell slot, the bonus increases to +3, and the extra damage increases to 3d4."]},{"name":"Enhance Ability","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (fur or a feather)","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Bard","Cleric","Druid","Ranger","Sorcerer","Wizard"],"content":["You touch a creature and choose Strength, Dexterity, Intelligence, Wisdom, or Charisma. For the duration, the target has Advantage on ability checks using the chosen ability.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 2. You can choose a different ability for each target."]},{"fontSize":1.9,"name":"Enlarge/Reduce","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S, M (a pinch of powdered iron)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Druid","Sorcerer","Wizard"],"content":["For the duration, the spell enlarges or reduces a creature or an object you can see within range (see the chosen effect below). A targeted object must be neither worn nor carried. If the target is an unwilling creature, it can make a Constitution saving throw. On a successful save, the spell has no effect.","Everything that a targeted creature is wearing and carrying changes size with it. Any item it drops returns to normal size at once. A thrown weapon or piece of ammunition returns to normal size immediately after it hits or misses a target.","***Enlarge.*** The target's size increases by one category-from Medium to Large, for example. The target also has Advantage on Strength checks and Strength saving throws. The target's attacks with its enlarged weapons or Unarmed Strikes deal an extra 1d4 damage on a hit.","***Reduce.*** The target's size decreases by one category-from Medium to Small, for example. The target also has Disadvantage on Strength checks and Strength saving throws. The target's attacks with its reduced weapons or Unarmed Strikes deal 1d4 less damage on a hit (this can't reduce the damage below 1)."]},{"name":"Ensnaring Strike","type":"Conjuration","casting":"Bonus Action, which you take immediately after hitting a creature with a weapon","range":"Self","components":"V","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Ranger"],"content":["As you hit the target, grasping vines appear on it, and it makes a Strength saving throw. A Large or larger creature has Advantage on this save. On a failed save, the target has the Restrained condition until the spell ends. On a successful save, the vines shrivel away, and the spell ends.","While Restrained, the target takes 1d6 Piercing damage at the start of each of its turns. The target or a creature within reach of it can take an action to make a Strength (Athletics) check against your spell save DC. On a success, the spell ends.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 1."]},{"name":"Entangle","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Druid","Ranger"],"content":["Grasping plants sprout from the ground in a 20-foot square within range. For the duration, these plants turn the ground in the area into Difficult Terrain. They disappear when the spell ends.","Each creature (other than you) in the area when you cast the spell must succeed on a Strength saving throw or have the Restrained condition until the spell ends. A Restrained creature can take an action to make a Strength (Athletics) check against your spell save DC. On a success, it frees itself from the grasping plants and is no longer Restrained by them."]},{"name":"Enthrall","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Warlock"],"content":["You weave a distracting string of words, causing creatures of your choice that you can see within range to make a Wisdom saving throw. Any creature you or your companions are fighting automatically succeeds on this save. On a failed save, a target has a -10 penalty to Wisdom (Perception) checks and Passive Perception until the spell ends."]},{"name":"Etherealness","type":"Conjuration","casting":"Action","range":"Self","components":"V, S","duration":"Up to 8 hours","level":"Level 7","classes":["Bard","Cleric","Sorcerer","Warlock","Wizard"],"content":["You step into the border regions of the Ethereal Plane, where it overlaps with your current plane. You remain in the Border Ethereal for the duration. During this time, you can move in any direction. If you move up or down, every foot of movement costs an extra foot. You can perceive the plane you left, which looks gray, and you can't see anything there more than 60 feet away.","While on the Ethereal Plane, you can affect and be affected only by creatures, objects, and effects on that plane. Creatures that aren't on the Ethereal Plane can't perceive or interact with you unless a feature gives them the ability to do so.","When the spell ends, you return to the plane you left in the spot that corresponds to your space in the Border Ethereal. If you appear in an occupied space, you are shunted to the nearest unoccupied space and take Force damage equal to twice the number of feet you are moved.","This spell ends instantly if you cast it while you are on the Ethereal Plane or a plane that doesn't border it, such as one of the Outer Planes.","***Using a Higher-Level Spell Slot.*** You can target up to three willing creatures (including yourself) for each spell slot level above 7. The creatures must be within 10 feet of you when you cast the spell."]},{"name":"Evard's Black Tentacles","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (a tentacle)","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Wizard"],"content":["Squirming, ebony tentacles fill a 20-foot square on ground that you can see within range. For the duration, these tentacles turn the ground in that area into Difficult Terrain.","Each creature in that area makes a Strength saving throw. On a failed save, it takes 3d6 Bludgeoning damage, and it has the Restrained condition until the spell ends. A creature also makes that save if it enters the area or ends it turn there. A creature makes that save only once per turn.","A Restrained creature can take an action to make a Strength (Athletics) check against your spell save DC, ending the condition on itself on a success."]},{"name":"Expeditious Retreat","type":"Transmutation","casting":"Bonus Action","range":"Self","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 1","classes":["Sorcerer","Warlock","Wizard"],"content":["You take the Dash action, and until the spell ends, you can take that action again as a Bonus Action."]},{"name":"Eyebite","type":"Necromancy","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 6","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["For the duration, your eyes become an inky void. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects of your choice for the duration.","On each of your turns until the spell ends, you can take a Magic action to target another creature but can't target a creature again if it has succeeded on a save against this casting of the spell.","***Asleep.*** The target has the Unconscious condition. It wakes up if it takes any damage or if another creature takes an action to shake it awake.","***Panicked.*** The target has the Frightened condition. On each of its turns, the Frightened target must take the Dash action and move away from you by the safest and shortest route available. If the target moves to a space at least 60 feet away from you where it can't see you, this effect ends.","***Sickened.*** The target has the Poisoned condition."]},{"name":"Fabricate","type":"Transmutation","casting":"10 minutes","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Level 4","classes":["Wizard"],"content":["You convert raw materials into products of the same material. For example, you can fabricate a wooden bridge from a clump of trees, a rope from a patch of hemp, or clothes from flax or wool.","Choose raw materials that you can see within range. You can fabricate a Large or smaller object (contained within a 10-foot Cube or eight connected 5-foot Cubes) given a sufficient quantity of material. If you're working with metal, stone, or another mineral substance, however, the fabricated object can be no larger than Medium (contained within a 5-foot Cube). The quality of any fabricated objects is based on the quality of the raw materials.","Creatures and magic items can't be created by this spell. You also can't use it to create items that require a high degree of skill-such as weapons and armor-unless you have proficiency with the type of Artisan's Tools used to craft such objects."]},{"name":"Faerie Fire","type":"Evocation","casting":"Action","range":"60 feet","components":"V","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Bard","Druid"],"content":["Objects in a 20-foot Cube within range are outlined in blue, green, or violet light (your choice).","Each creature in the Cube is also outlined if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed Dim Light in a 10-foot radius and can't benefit from the Invisible condition.","Attack rolls against an affected creature or object have Advantage if the attacker can see it."]},{"name":"False Life","type":"Necromancy","casting":"Action","range":"Self","components":"V, S, M (a drop of alcohol)","duration":"Instantaneous","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["You gain 2d4 + 4 Temporary Hit Points.","***Using a Higher-Level Spell Slot.*** You gain 5 additional Temporary Hit Points for each spell slot level above 1."]},{"name":"Fear","type":"Illusion","casting":"Action","range":"Self","components":"V, S, M (a white feather)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["Each creature in a 30-foot Cone must succeed on a Wisdom saving throw or drop whatever it is holding and have the Frightened condition for the duration.","A Frightened creature takes the Dash action and moves away from you by the safest route on each of its turns unless there is nowhere to move. If the creature ends its turn in a space where it doesn't have line of sight to you, the creature makes a Wisdom saving throw. On a successful save, the spell ends on that creature."]},{"name":"Feather Fall","type":"Transmutation","casting":"Reaction, which you take when you or a creature you can see within 60 feet of you falls","range":"60 feet","components":"V, M (a small feather or piece of down)","duration":"1 minute","level":"Level 1","classes":["Bard","Sorcerer","Wizard"],"content":["Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If a creature lands before the spell ends, the creature takes no damage from the fall, and the spell ends for that creature."]},{"name":"Feign Death","type":"Necromancy","casting":"Action or Ritual","range":"Touch","components":"V, S, M (a pinch of graveyard dirt)","duration":"1 hour","level":"Level 3","classes":["Bard","Cleric","Druid","Wizard"],"content":["You touch a willing creature and put it into a cataleptic state that is indistinguishable from death.","For the duration, the target appears dead to outward inspection and to spells used to determine the target's status. The target has the Blinded and Incapacitated conditions, and its Speed is 0.","The target also has Resistance to all damage except Psychic damage, and it has Immunity to the Poisoned condition."]},{"name":"Find Familiar","type":"Conjuration","casting":"1 hour or Ritual","range":"10 feet","components":"V, S, M (burning incense worth 10+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 1","classes":["Wizard"],"content":["You gain the service of a familiar, a spirit that takes an animal form you choose: **Bat, Cat, Frog, Hawk, Lizatd, Octopus, Owl, Rat, Raven, Spider, Weasel**, or another Beast that has a Challenge Rating of 0. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form (see appendix B), though it is a Celestial, Fey, or Fiend (your choice) instead of a Beast. Your familiar acts independently of you, but it obeys your commands.","***Telepathic Connection.*** While your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as a Bonus Action, you can see through the familiar's eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses it has.","Finally, when you cast a spell with a range of touch, your familiar can deliver the touch. Your familiar must be within 100 feet of you, and it must take a Reaction to deliver the touch when you cast the spell.","***Combat.*** The familiar is an ally to you and your allies. It rolls its own Initiative and acts on its own turn. A familiar can't attack, but it can take other actions as normal.","***Disappearance of the Familiar.*** When the familiar drops to 0 Hit Points, it disappears. It reappears after you cast this spell again. As a Magic action, you can temporarily dismiss the familiar to a pocket dimension. Alternatively, you can dismiss it forever. As a Magic action while it is temporarily dismissed, you can cause it to reappear in an unoccupied space within 30 feet of you. Whenever the familiar drops to 0 Hit Points or disappears into the pocket dimension, it leaves behind in its space anything it was wearing or carrying.","***One Familiar Only.*** You can't have more than one familiar at a time. If you cast this spell while you have a familiar, you instead cause it to adopt a new eligible form."]},{"name":"Find Steed","type":"Conjuration","casting":"Action","range":"30 feet","components":"V, S","duration":"Instantaneous","level":"Level 2","classes":["Paladin"],"content":["You summon an otherworldly being that appears as a loyal steed in an unoccupied space of your choice within range. This creature uses the ***Otherworldly Steed*** stat block. If you already have a steed from this spell, the steed is replaced by the new one.","The steed resembles a Large, rideable animal of your choice, such as a horse, a camel, a dire wolf, or an elk. Whenever you cast the spell, choose the steed's creature type-Celestial, Fey, or Fiend-which determines certain traits in the stat block.","***Combat.*** The steed is an ally to you and your allies. In combat, it shares your Initiative count, and it functions as a controlled mount while you ride it (as defined in the rules on mounted combat). If you have the Incapacitated condition, the steed takes its turn immediately after yours and acts independently, focusing on protecting you.","***Disappearance of the Steed.*** The steed disappears if it drops to 0 Hit Points or if you die. When it disappears, it leaves behind anything it was wearing or carrying. If you cast this spell again, you decide whether you summon the steed that disappeared or a different one.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Otherworldly Steed","subtitle":"Large Celestial, Fey, or Fiend (Your Choice), Neutral","AC":"10 + 1 per spell level","HP":"5 + 10 per spell level (the steed has a number of Hit Dice [d10s] equal to the spell's level)","Speed":"60 ft., Fly 60 ft. (requires level 4+ spell)","attributes":{"STR":["18","+4","+4"],"DEX":["12","+1","+1"],"CON":["14","+2","+2"],"INT":["6","-2","-2"],"WIS":["12","+1","+1"],"CHA":["8","-1","-1"]},"addons":{"Senses":"Passive Perception 11","Languages":"Telepathy 1 mile (works only with you)","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Life Bond.*** When you regain Hit Points from a level 1+ spell, the steed regains the same number of Hit Points if you're within 5 feet of it."],"Actions":["***Otherworldly Slam.*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d8 plus the spell's level of Radiant (Celestial), Psychic (Fey), or Necrotic (Fiend) damage."],"Bonus Actions":["***Fell Glare (Fiend Only; Recharges after a Long Rest).*** *Wisdom Saving Throw:* DC equals your spell save DC, one creature within 60 feet the steed can see. *Failure:* The target has the Frightened condition until the end of your next turn.","***Fey Step (Fey Only; Recharges after a Long Rest).*** The steed teleports, along with its rider, to an unoccupied space of your choice up to 60 feet away from itself.","***Healing Touch (Celestial Only; Recharges after a Long Rest).*** One creature within 5 feet of the steed regains a number of Hit Points equal to 2d8 plus the spell's level."]}},{"name":"Find the Path","type":"Divination","casting":"1 minute","range":"Self","components":"V, S, M (a set of divination tools-such as cards or runes-worth 100+ GP)","duration":"Concentration, up to 1 day","level":"Level 6","classes":["Bard","Cleric","Druid"],"content":["You magically sense the most direct physical route to a location you name. You must be familiar with the location, and the spell fails if you name a destination on another plane of existence, a moving destination (such as a mobile fortress), or an unspecific destination (such as \\"a green dragon's lair\\").","For the duration, as long as you are on the same plane of existence as the destination, you know how far it is and in what direction it lies. Whenever you face a choice of paths along the way there, you know which path is the most direct."]},{"name":"Find Traps","type":"Divination","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Level 2","classes":["Cleric","Druid","Ranger"],"content":["You sense any trap within range that is within line of sight. A trap, for the purpose of this spell, includes any object or mechanism that was created to cause damage or other danger. Thus, the spell would sense the *Alarm* or *Glyph of Warding* spell or a mechanical pit trap, but it wouldn't reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole.","This spell reveals that a trap is present but not its location. You do learn the general nature of the danger posed by a trap you sense."]},{"name":"Finger of Death","type":"Necromancy","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 7","classes":["Sorcerer","Warlock","Wizard"],"content":["You unleash negative energy toward a creature you can see within range. The target makes a Constitution saving throw, taking 7d8 + 30 Necrotic damage on a failed save or half as much damage on a successful one.","A Humanoid killed by this spell rises at the start of your next turn as a **Zombie** (see appendix B) that follows your verbal orders."]},{"name":"Fireball","type":"Evocation","casting":"Action","range":"150 feet","components":"V, S, M (a ball of bat guano and sulfur)","duration":"Instantaneous","level":"Level 3","classes":["Sorcerer","Wizard"],"content":["A bright streak flashes from you to a point you choose within range and then blossoms with a low roar into a fiery explosion. Each creature in a 20-foot-radius Sphere centered on that point makes a Dexterity saving throw taking 8d6 Fire damage on a failed save or half as much damage on a successful one.","Flammable objects in the area that aren't being worn or carried start burning.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 3."]},{"name":"Fire Bolt","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Sorcerer","Wizard"],"content":["You hurl a mote of fire at a creature or an object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 Fire damage. A flammable object hit by this spell starts burning if it isn't being worn or carried.","***Cantrip Upgrade.*** The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10)."]},{"name":"Fire Shield","type":"Evocation","casting":"Action","range":"Self","components":"V, S, M (a bit of phosphorus or a firefly)","duration":"10 minutes","level":"Level 4","classes":["Druid","Sorcerer","Wizard"],"content":["Wispy flames wreathe your body for the duration, shedding Bright Light in a 10-foot radius and Dim Light for an additional 10 feet.","The flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you Resistance to Cold damage, and the chill shield grants you Resistance to Fire damage.","In addition, whenever a creature within 5 feet of you hits you with a melee attack roll, the shield erupts with flame. The attacker takes 2d8 Fire damage from a warm shield or 2d8 Cold damage from a chill shield."]},{"name":"Fire Storm","type":"Evocation","casting":"Action","range":"150 feet","components":"V, S","duration":"Instantaneous","level":"Level 7","classes":["Cleric","Druid","Sorcerer"],"content":["A storm of fire appears within range. The area of the storm consists of up to ten 10-foot Cubes, which you arrange as you like. Each Cube must be contiguous with at least one other Cube. Each creature in the area makes a Dexterity saving throw taking 7d10 Fire damage on a failed save or half as much damage on a successful one.","Flammable objects in the area that aren't being worn or carried start burning."]},{"name":"Flame Blade","type":"Evocation","casting":"Bonus Action","range":"Self","components":"V, S, M (a sumac leaf)","duration":"Concentration, up to 10 minutes","level":"Level 2","classes":["Druid","Sorcerer"],"content":["You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke it again as a Bonus Action.","As a Magic action, you can make a melee spell attack with the fiery blade. On a hit, the target takes Fire damage equal to 3d6 plus your spellcasting ability modifier.","The flaming blade sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 2."]},{"name":"Flame Strike","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S, M (a pinch of sulfur)","duration":"Instantaneous","level":"Level 5","classes":["Cleric"],"content":["A vertical column of brilliant fire roars down from above. Each creature in a 10-foot-radius, 40-foothigh Cylinder centered on a point within range makes a Dexterity saving throw, taking 5d6 Fire damage and 5d6 Radiant damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The Fire damage and the Radiant damage increase by 1d6 for each spell slot level above 5."]},{"name":"Flaming Sphere","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S, M (a ball of wax)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Druid","Sorcerer","Wizard"],"content":["You create a 5-foot-diameter sphere of fire in an unoccupied space on the ground within range. It lasts for the duration. Any creature that ends its turn within 5 feet of the sphere makes a Dexterity saving throw, taking 2d6 Fire damage on a failed save or half as much damage on a successful one.","As a Bonus Action, you can move the sphere up to 30 feet, rolling it along the ground. If you move the sphere into a creature's space, that creature makes the save against the sphere, and the sphere stops moving for the turn.","When you move the sphere, you can direct it over barriers up to 5 feet tall and jump it across pits up to 10 feet wide. Flammable objects that aren't being worn or carried start burning if touched by the sphere, and it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 2."]},{"name":"Flesh to Stone","type":"Transmutation","casting":"Action","range":"60 feet","components":"V, S, M (a cockatrice feather)","duration":"Concentration, up to 1 minute","level":"Level 6","classes":["Druid","Sorcerer","Wizard"],"content":["You attempt to turn one creature that you can see within range into stone. The target makes a Constitution saving throw. On a failed save, it has the Restrained condition for the duration. On a successful save, its Speed is 0 until the start of your next turn. Constructs automatically succeed on the save.","A Restrained target makes another Constitution saving throw at the end of each of its turns. If it successfully saves against this spell three times, the spell ends. If it fails its saves three times, it is turned to stone and has the Petrified condition for the duration. The successes and failures needn't be consecutive; keep track of both until the target collects three of a kind.","If you maintain your Concentration on this spell for the entire possible duration, the target is Petrified until the condition is ended by *Greater Restoration* or similar magic."]},{"name":"Fly","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (a feather)","duration":"Concentration, up to 10 minutes","level":"Level 3","classes":["Sorcerer","Warlock","Wizard"],"content":["You touch a willing creature. For the duration, the target gains a Fly Speed of 60 feet and can hover. When the spell ends, the target falls if it is still aloft unless it can stop the fall.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 3."]},{"name":"Fog Cloud","type":"Conjuration","casting":"Action","range":"120 feet","components":"V, S","duration":"Concentration, up to 1 hour","level":"Level 1","classes":["Druid","Ranger","Sorcerer","Wizard"],"content":["You create a 20-foot-radius Sphere of fog centered on a point within range. The Sphere is Heavily Obscured. It lasts for the duration or until a strong wind (such as one created by *Gust of Wind*) disperses it.","***Using a Higher-Level Spell Slot.*** The fog's radius increases by 20 feet for each spell slot level above 1."]},{"name":"Forbiddance","type":"Abjuration","casting":"10 minutes or Ritual","range":"Touch","components":"V, S, M (ruby dust worth 1,000+ GP)","duration":"1 day","level":"Level 6","classes":["Cleric"],"content":["You create a ward against magical travel that protects up to 40,000 square feet of floor space to a height of 30 feet above the floor. For the duration, creatures can't teleport into the area or use portals, such as those created by the *Gate* spell, to enter the area. The spell proofs the area against planar travel, and therefore prevents creatures from accessing the area by way of the Astral Plane, the Ethereal Plane, the Feywild, the Shadowfell, or the *Plane Shift* spell.","In addition, the spell damages types of creatures that you choose when you cast it. Choose one or more of the following: Aberrations, Celestials, Elementals, Fey, Fiends, and Undead. When a creature of a chosen type enters the spell's area for the first time on a turn or ends its turn there, the creature takes 5d10 Radiant or Necrotic damage (your choice when you cast this spell).","You can designate a password when you cast the spell. A creature that speaks the password as it enters the area takes no damage from the spell.","The spell's area can't overlap with the area of another *Forbiddance* spell. If you cast *Forbiddance* every day for 30 days in the same location, the spell lasts until it is dispelled, and the Material components are consumed on the last casting."]},{"name":"Forcecage","type":"Evocation","casting":"Action","range":"100 feet","components":"V, S, M (ruby dust worth 1,500+ GP, which the spell consumes)","duration":"Concentration, up to 1 hour","level":"Level 7","classes":["Bard","Warlock","Wizard"],"content":["An immobile, Invisible, Cube-shaped prison composed of magical force springs into existence around an area you choose within range. The prison can be a cage or a solid box, as you choose.","A prison in the shape of a cage can be up to 20 feet on a side and is made from 1/2-inch diameter bars spaced 1/2 inch apart. A prison in the shape of a box can be up to 10 feet on a side, creating a solid barrier that prevents any matter from passing through it and blocking any spells cast into or out from the area.","When you cast the spell, any creature that is completely inside the cage's area is trapped. Creatures only partially within the area, or those too large to fit inside it, are pushed away from the center of the area until they are completely outside it.","A creature inside the cage can't leave it by nonmagical means. If the creature tries to use teleportation or interplanar travel to leave, it must first make a Charisma saving throw. On a successful save, the creature can use that magic to exit the cage. On a failed save, the creature doesn't exit the cage and wastes the spell or effect. The cage also extends into the Ethereal Plane, blocking ethereal travel.","This spell can't be dispelled by *Dispel Magic*."]},{"name":"Foresight","type":"Divination","casting":"1 minute","range":"Touch","components":"V, S, M (a hummingbird feather)","duration":"8 hours","level":"Level 9","classes":["Bard","Druid","Warlock","Wizard"],"content":["You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target has Advantage on D20 Tests, and other creatures have Disadvantage on attack rolls against it. The spell ends early if you cast it again."]},{"name":"Fount of Moonlight","type":"Evocation","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 4","classes":["Bard","Druid"],"content":["A cool light wreathes your body for the duration, emitting Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.","Until the spell ends, you have Resistance to Radiant damage, and your melee attacks deal an extra 2d6 Radiant damage on a hit.","In addition, immediately after you take damage from a creature you can see within 60 feet of yourself, you can take a Reaction to force the creature to make a Constitution saving throw. On a failed save, the creature has the Blinded condition until the end of your next turn."]},{"name":"Freedom of Movement","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S, M (a leather strap)","duration":"1 hour","level":"Level 4","classes":["Bard","Cleric","Druid","Ranger"],"content":["You touch a willing creature. For the duration, the target's movement is unaffected by Difficult Terrain, and spells and other magical effects can neither reduce the target's Speed nor cause the target to have the Paralyzed or Restrained conditions. The target also has a Swim Speed equal to its Speed.","In addition, the target can spend 5 feet of movement to automatically escape from nonmagical restraints, such as manacles or a creature imposing the Grappled condition on it.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 4."]},{"name":"Friends","type":"Enchantment","casting":"Action","range":"10 feet","components":"S, M (some makeup)","duration":"Concentration, up to 1 minute","level":"Cantrip","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You magically emanate a sense of friendship toward one creature you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target succeeds automatically if it isn't a Humanoid, if you're fighting it, or if you have cast this spell on it within the past 24 hours.","The spell ends early if the target takes damage or if you make an attack roll, deal damage, or force anyone to make a saving throw. When the spell ends, the target knows it was Charmed by you."]},{"name":"Gaseous Form","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (a bit of gauze)","duration":"Concentration, up to 1 hour","level":"Level 3","classes":["Sorcerer","Warlock","Wizard"],"content":["A willing creature you touch shape-shifts, along with everything it's wearing and carrying, into a misty cloud for the duration. The spell ends on the target if it drops to 0 Hit Points or if it takes a Magic action to end the spell on itself.","While in this form, the target's only method of movement is a Fly Speed of 10 feet, and it can hover. The target can enter and occupy the space ofanother creature. The target has Resistance to Bludgeoning, Piercing, and Slashing damage; it has Immunity to the Prone condition; and it has Advantage on Strength, Dexterity, and Constitution saving throws. The target can pass through narrow openings, but it treats liquids as though they were solid surfaces.","The target can't talk or manipulate objects, and any objects it was carrying or holding can't be dropped, used, or otherwise interacted with. Finally, the target can't attack or cast spells.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 3."]},{"name":"Gate","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S, M (a diamond worth 5,000+ GP)","duration":"Concentration, up to 1 minute","level":"Level 9","classes":["Cleric","Sorcerer","Warlock","Wizard"],"content":["You conjure a portal linking an unoccupied space you can see within range to a precise location on a different plane of existence. The portal is a circular opening, which you can make 5 to 20 feet in diameter. You can orient the portal in any direction you choose. The portal lasts for the duration, and the portal's destination is visible through it.","The portal has a front and a back on each plane where it appears. Travel through the portal is possible only by moving through its front. Anything that does so is instantly transported to the other plane, appearing in the unoccupied space nearest to the portal.","Deities and other planar rulers can prevent portals created by this spell from opening in their presence or anywhere within their domains.","When you cast this spell, you can speak the name of a specific creature (a pseudonym, title, or nickname doesn't work). If that creature is on a plane other than the one you are on, the portal opens next to the named creature and transports it to the nearest unoccupied space on your side of the portal, You gain no special power over the creature, and it is free to act as the DM deems appropriate. It might leave, attack you, or help you."]},{"name":"Geas","type":"Enchantment","casting":"1 minute","range":"60 feet","components":"V","duration":"30 days","level":"Level 5","classes":["Bard","Cleric","Druid","Paladin","Wizard"],"content":["You give a verbal command to a creature that you can see within range, ordering it to carry out some service or refrain from an action or a course ofactivity as you decide. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target automatically succeeds if it can't understand your command.","While Charmed, the creature takes 5d10 Psychic damage if it acts in a manner directly counter to your command. It takes this damage no more than once each day.","You can issue any command you choose, short of an activity that would result in certain death. Should you issue a suicidal command, the spell ends.","A *Remove Curse, Greater Restoration*, or *Wish* spell ends this spell.","***Using a Higher-Level Spell Slot.*** If you use a level 7 or 8 spell slot, the duration is 365 days. If you use a level 9 spell slot, the spell lasts until it is ended by one of the spells mentioned above."]},{"name":"Gentle Repose","type":"Necromancy","casting":"Action or Ritual","range":"Touch","components":"V, S, M (2 Copper Pieces, which the spell consumes)","duration":"10 days","level":"Level 2","classes":["Cleric","Paladin","Wizard"],"content":["You touch a corpse or other remains. For the duration, the target is protected from decay and can't become Undead.","The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as *Raise Dead*."]},{"name":"Giant Insect","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 4","classes":["Druid"],"content":["You summon a giant centipede, spider, or wasp (chosen when you cast the spell). It manifests in an unoccupied space you can see within range and uses the **Giant Insect** stat block. The form you choose determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Giant Insect","subtitle":"Large Beast, Unaligned","AC":"11 + the spell's level","HP":"30 + 10 for each spell level","Speed":"40 ft., Climb 40 ft., fly 40 ft. (Wasp only)","attributes":{"STR":["17","+3","+3"],"DEX":["13","+1","+1"],"CON":["15","+2","+2"],"INT":["4","-3","-3"],"WIS":["14","+2","+2"],"CHA":["3","-4","-4"]},"addons":{"Senses":"Darkvision 60 ft., Passive Perception 12","Languages":"Understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Spider Climb.*** The insect can climb difficult surfaces, including along ceilings, without needing to make an ability check."],"Actions":["***Multiattack.*** The insect makes a number of attacks equal to half this spell's level (round down).","***Poison Jab.*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 10 ft. *Hit:*  1d6 + 3 plus the spell's level Piercing damage plus 1d4 Poison damage.","***Web Bolt (Spider Only).*** *Ranged Attack Roll:* Bonus equals your spell attack modifier, range 60 ft. Hir: 1d10 + 3 plus the spell's level Bludgeoning damage, and the target's Speed is reduced to 0 until the start of the insect's next turn."],"Bonus Actions":["***Venomous Spew (Centipede Only).*** *Constitution Saving Throw:* Your spell save DC, one creature the insect can see within 10 feet. *Failure:* The target has the Poisoned condition until the start of the insect's next turn."]}},{"name":"Glibness","type":"Enchantment","casting":"Action","range":"Self","components":"V","duration":"1 hour","level":"Level 8","classes":["Bard","Warlock"],"content":["Until the spell ends, when you make a Charisma check, you can replace the number you roll with a 15. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates that you are being truthful."]},{"name":"Globe of Invulnerability","type":"Abjuration","casting":"Action","range":"Self","components":"V, S, M (a glass bead)","duration":"Concentration, up to 1 minute","level":"Level 6","classes":["Sorcerer","Wizard"],"content":["An immobile, shimmering barrier appears in a 10 foot Emanation around you and remains for the duration.","Any spell of level 5 or lower cast from outside the barrier can't affect anything within it. Such a spell can target creatures and objects within the barrier, but the spell has no effect on them. Similarly, the area within the barrier is excluded from areas of effect created by such spells.","***Using a Higher-Level Spell Slot.*** The barrier blocks spells of 1 level higher for each spell slot level above 6."]},{"name":"Glyph of Warding","type":"Abjuration","casting":"1 hour","range":"Touch","components":"V, S, M (powdered diamond worth 200+ GP which the spell consumes)","duration":"Until dispelled or triggered","level":"Level 3","classes":["Bard","Cleric","Wizard"],"content":["You inscribe a glyph that later unleashes a magical effect. You inscribe it either on a surface (such as a table or a section of floor) or within an object that can be closed (such as a book or chest) to conceal the glyph. The glyph can cover an area no larger than 10 feet in diameter. If the surface or object is moved more than 10 feet from where you cast this spell, the glyph is broken, and the spell ends without being triggered.","The glyph is nearly imperceptible and requires a successful Wisdom (Perception) check against your spell save DC to notice.","When you inscribe the glyph, you set its trigger and choose whether it's an explosive rune or a spell glyph, as explained below.","***Set the Trigger.*** You decide what triggers the glyph when you cast the spell. For glyphs inscribed on a surface, common triggers include touching or stepping on the glyph, removing another object covering it, or approaching within a certain distance of it. For glyphs inscribed within an object, common triggers include opening that object or seeing the glyph. Once a glyph is triggered, this spell ends.","You can refine the trigger so that only creatures of certain types activate it (for example, the glyph could be set to affect Aberrations). You can also set conditions for creatures that don't trigger the glyph, such as those who say a certain password.","***Explosive Rune.*** When triggered, the glyph erupts with magical energy in a 20-foot-radius Sphere centered on the glyph.Each creature in the area makes a Dexterity saving throw. A creature takes 5d8 Acid, Cold, Fire, Lightning, or Thunder damage (your choice when you create the glyph) on a failed save or half as much damage on a successful one.","***Spell Glyph.*** You can store a prepared spell of level 3 or lower in the glyph by casting it as part of creating the glyph. The spell must target a single creature or an area. The spell being stored has no immediate effect when cast in this way.","When the glyph is triggered, the stored spell takes effect. If the spell has a target, it targets the creature that triggered the glyph. If the spell affects an area, the area is centered on that creature. If the spell summons Hostile creatures or creates harmful objects or traps, they appear as close as possible to the intruder and attack it. If the spell requires Concentration, it lasts until the end of its full duration.","***Using a Higher-Level Spell Slot.*** The damage of an explosive rune increases by 1d8 for each spell slot level above 3. If you create a spell glyph, you can store any spell of up to the same level as the spell slot you use for the *Glyph of Warding*."]},{"name":"Goodberry","type":"Conjuration","casting":"Action","range":"Self","components":"V, S, M (a sprig of mistletoe)","duration":"24 hours","level":"Level 1","classes":["Druid","Ranger"],"content":["Ten berries appear in your hand and are infused with magic for the duration. A creature can take a Bonus Action to eat one berry. Eating a berry restores 1 Hit Point, and the berry provides enough nourishment to sustain a creature for one day.","Uneaten berries disappear when the spell ends."]},{"name":"Grasping Vine","type":"Conjuration","casting":"Bonus Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Druid","Ranger"],"content":["You conjure a vine that sprouts from a surface in an unoccupied space that you can see within range. The vine lasts for the duration.","Make a melee spell attack against a creature within 30 feet of the vine. On a hit, the target takes 4d8 Bludgeoning damage and is pulled up to 30 feet toward the vine; if the target is Huge or smaller, it has the Grappled condition (escape DC equal to your spell save DC). The vine can grapple only one creature at a time, and you can cause the vine to release a Grappled creature (no action required).","As a Bonus Action on your later turns, you can repeat the attack against a creature within 30 feet of the vine.","***Using a Higher-Level Spell Slot.*** The number of creatures the vine can grapple increases by one for each spell slot level above 4."]},{"name":"Grease","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S, M (a bit of pork rind or butter)","duration":"1 minute","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["Nonflammable grease covers the ground in a 10-foot square centered on a point within range and turns it into Difficult Terrain for the duration.","When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or have the Prone condition. A creature that enters the area or ends its turn there must also succeed on that save or fall Prone."]},{"name":"Greater Invisibility","type":"Illusion","casting":"Action","range":"Touch","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Bard","Sorcerer","Wizard"],"content":["A creature you touch has the Invisible condition until the spell ends."]},{"name":"Greater Restoration","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S, M (diamond dust worth 100+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 5","classes":["Bard","Cleric","Druid","Paladin","Ranger"],"content":["You touch a creature and magically remove one of the following effects from it:"," 1 Exhaustion level"," The Charmed or Petrified condition"," A curse, including the target's Attunement to a cursed magic item"," Any reduction to one of the target's ability scores"," Any reduction to the target's Hit Point maximum"]},{"name":"Guardian of Faith","type":"Conjuration","casting":"Action","range":"30 feet","components":"V","duration":"8 hours","level":"Level 4","classes":["Cleric"],"content":["A Large spectral guardian appears and hovers for the duration in an unoccupied space that you can see within range. The guardian occupies that space and is invulnerable, and it appears in a form appropriate for your deity or pantheon.","Any enemy that moves to a space within 10 feet of the guardian for the first time on a turn or starts its turn there makes a Dexterity saving throw, taking 20 Radiant damage on a failed save or half as much damage on a successful one. The guardian vanishes when it has dealt a total of 60 damage."]},{"name":"Guards and Wards","type":"Abjuration","casting":"1 hour","range":"Touch","components":"V, S, M (a silver rod worth 10+ GP)","duration":"24 hours","level":"Level 6","classes":["Bard","Wizard"],"content":["You create a ward that protects up to 2,500 square feet of floor space. The warded area can be up to 20 feet tall, and you shape it as one 50-foot square, one hundred 5-foot squares that are contiguous, or twenty-five 10-foot squares that are contiguous.","When you cast this spell, you can specify individuals that are unaffected by the spell's effects. You can also specify a password that, when spoken aloud within 5 feet of the warded area, makes the speaker immune to its effects.","The spell creates the effects below within the warded area. Dispel Magic has no effect on *Guards and Wards* itself, but each of the following effects can be dispelled. If all four are dispelled, *Guards and Wards* ends. If you cast the spell every day for 365 days on the same area, the spell thereafter lasts until all its effects are dispelled.","***Corridors.*** Fog fills all the warded corridors, making them Heavily Obscured. In addition, at each intersection or branching passage offering a choice of direction, there is a 50 percent chance that a creature other than you believes it is going in the opposite direction from the one it chooses.","***Doors.*** All doors in the warded area are magically locked, as if sealed by the *Arcane Lock* spell. In addition, you can cover up to ten doors with an illusion to make them appear as plain sections of wall.","***Stairs.*** Webs fill all stairs in the warded area from top to bottom, as in the *Web* spell. These strands regrow in 10 minutes if they are destroyed while *Guards and Wards* lasts.","***Other Spell Effect.*** Place one of the following magical effects within the warded area:"," *Dancing Lights* in four corridors, with a simple program that the lights repeat as long as Guards and Wards lasts"," *Magic Mouth* in two locations"," *Stinking Cloud* in two locations (the vapors return within 10 minutes if dispersed while *Guards and Wards* lasts)"," *Gust of Wind* in one corridor or room (the wind blows continuously while the spell lasts)"," *Suggestion* in one 5-foot square; any creature that enters that square receives the suggestion mentally"]},{"name":"Guidance","type":"Divination","casting":"Action","range":"Touch","components":"V, S","duration":"Concentration, up to 1 minute","level":"Cantrip","classes":["Cleric","Druid"],"content":["You touch a willing creature and choose a skill. Until the spell ends, the creature adds 1d4 to any ability check using the chosen skill."]},{"name":"Guiding Bolt","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S","duration":"1 round","level":"Level 1","classes":["Cleric"],"content":["You hurl a bolt of light toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 4d6 Radiant damage, and the next attack roll made against it before the end of your next turn has Advantage.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 1."]},{"name":"Gust of Wind","type":"Evocation","casting":"Action","range":"Self","components":"V S, M (a legume seed)","duration":"Concentration, up to 'l minute","level":"Level 2","classes":["Druid","Ranger","Sorcerer","Wizard"],"content":["A Line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the duration. Each creature in the Line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the Line. A creature that ends its turn in the Line must make the same save.","Any creature in the Line must spend 2 feet of movement for every 1 foot it moves when moving closer to you.","The gust disperses gas or vapor, and it extinguishes candles and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.","As a Bonus Action on your later turns, you can change the direction in which the Line blasts from you."]},{"name":"Hail of Thorns","type":"Conjuration","casting":"Bonus Action, which you take immediately after hitting a creature with a Ranged weapon","range":"Self","components":"V","duration":"Instantaneous","level":"Level 1","classes":["Ranger"],"content":["As you hit the creature, this spell creates a rain of thorns that sprouts from your Ranged weapon or ammunition. The target of the attack and each creature within 5 feet of it make a Dexterity saving throw, taking 1d10 Piercing damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 1."]},{"name":"Hallow","type":"Abjuration","casting":"24 hours","range":"Touch","components":"V, S, M (incense worth 1,000+ GP which the spell consumes)","duration":"Until dispelled","level":"Level 5","classes":["Cleric"],"content":["You touch a point and infuse an area around it with holy or unholy power. The area can have a radius up to 6O feet, and the spell fails if the radius includes an area already under the effect of *Hallow*. The affected area has the following effects.","***Hallowed Ward.*** Choose any of these creature types: Aberration, Celestial, Elemental, Fey, Fiend, or Undead. Creatures of the chosen types can't willingly enter the area, and any creature that is possessed by or that has the Charmed or Frightened condition from such creatures isn't possessed, Charmed, or Frightened by them while in the area.","***Extra Effect.*** You bind an extra effect to the area from the list below:","***Courage.*** Creatures of any types you choose can't gain the Frightened condition while in the area.","***Darkness.*** Darkness fills the area. Normal light, as well as magical light created by spells of a level lower than this spell, can't illuminate the area.","***Daylight.*** Bright light fills the area. Magical Darkness created by spells of a level lower than this spell can't extinguish the light.","***Peaceful Rest.*** Dead bodies interred in the area can't be turned into Undead.","***Extradimensional Interference.*** Creatures of any types you choose can't enter or exit the area using teleportation or interplanar travel.","***Fear.*** Creatures of any types you choose have the Frightened condition while in the area.","***Resistance.*** Creatures of any types you choose have Resistance to one damage type of your choice while in the area.","***Silence.*** No sound can emanate from within the area, and no sound can reach into it.","***Tongues.*** Creatures of any types you choose can communicate with any other creature in the area even if they don't share a common language.","***Vulnerability.*** Creatures of any types you choose have Vulnerability to one damage type of your choice while in the area."]},{"name":"Hallucinatory Terrain","type":"Illusion","casting":"10 minutes","range":"300 feet","components":"V, S, M (a mushroom)","duration":"24 hours","level":"Level 4","classes":["Bard","Druid","Warlock","Wizard"],"content":["You make natural terrain in a 150-foot Cube in range look, sound, and smell like another sort of natural terrain. Thus, open fields or a road can be made to resemble a swamp, hill, crevasse, or some other difficult or impassable terrain. A pond can be made to seem like a grassy meadow, a precipice like a gentle slope, or a rock-strewn gully like a wide and smooth road. Manufactured structures, equipment, and creatures within the area aren't changed.","The tactile characteristics of the terrain are unchanged, so creatures entering the area are likely to notice the illusion. If the difference isn't obvious by touch, a creature examining the illusion can take the Study action to make an Intelligence (Investigation) check against your spell save DC to disbelieve it. If a creature discerns that the terrain is illusory, the creature sees a vague image superimposed on the real terrain."]},{"name":"Harm","type":"Necromancy","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 6","classes":["Cleric"],"content":["You unleash virulent magic on a creature you can see within range. The target makes a Constitution saving throw. On a failed save, it takes 14d6 Necrotic damage, and its Hit Point maximum is reduced by an amount equal to the Necrotic damage it took. On a successful save, it takes half as much damage only. This spell can't reduce a target's Hit Point maximum below 1."]},{"name":"Haste","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S, M (a shaving of licorice root)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Sorcerer","Wizard"],"content":["Choose a willing creature that you can see within range. Until the spell ends, the target's Speed is doubled, it gains a +2 bonus to Armor Class, it has Advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used to take only the Attack (one attack only), Dash, Disengage, Hide, or Utilize action.","When the spell ends, the target is Incapacitated and has a Speed of 0 until the end of its next turn, as a wave of lethargy washes over it."]},{"name":"Heal","type":"Abjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 6","classes":["Cleric","Druid"],"content":["Choose a creature that you can see within range. Positive energy washes through the target, restoring 70 Hit Points. This spell also ends the Blinded, Deafened, and Poisoned conditions on the target.","***Using a Higher-Level Spell Slot.*** The healing increases by 10 for each spell slot level above 6."]},{"name":"Healing Word","type":"Abjuration","casting":"Bonus Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 1","classes":["Bard","Cleric","Druid"],"content":["A creature of your choice that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier.","***Using a Higher-Level Spell Slot.*** The healing increases by 2d4 for each spell slot level above 1."]},{"name":"Heat Metal","type":"Transmutation","casting":"Action","range":"60 feet","components":"V, S, M (a piece of iron and a flame)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Druid"],"content":["Choose a manufactured metal object, such as a metal weapon or a suit of Heavy or Medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 Fire damage when you cast the spell. Until the spell ends, you can take a Bonus Action on each of your later turns to deal this damage again if the object is within range.","If a creature is holding or wearing the object and takes the damage from it, the creature must succeed on a Constitution saving throw or drop the object if it can. If it doesn't drop the object, it has Disadvantage on attack rolls and ability checks until the start of your next turn.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 2."]},{"name":"Hellish Rebuke","type":"Evocation","casting":"Reaction, which you take in response to taking damage from a creature that you can see within 60 feet of yourself","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Warlock"],"content":["The creature that damaged you is momentarily surrounded by green flames. It makes a Dexterity saving throw, taking 2d10 Fire damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 1."]},{"name":"Heroes' Feast","type":"Conjuration","casting":"10 minutes","range":"Self","components":"V, S, M (a gem-encrusted bowl worth 1,000+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 6","classes":["Bard","Cleric","Druid"],"content":["You conjure a feast that appears on a surface in an unoccupied 10-foot Cube next to you. The feast takes 1 hour to consume and disappears at the end of that time, and the beneficial effects don't set in until this hour is over. Up to twelve creatures can partake of the feast.","A creature that partakes gains several benefits, which last for 24 hours. The creature has Resistance to Poison damage, and it has Immunity to the Frightened and Poisoned conditions. Its Hit Point maximum also increases by 2d10, and it gains the same number of Hit Points."]},{"name":"Heroism","type":"Enchantment","casting":"Action","range":"Touch","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Bard","Paladin"],"content":["A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to the Frightened condition and gains Temporary Hit Points equal to your spellcasting ability modifier at the start of each of its turns.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 1."]},{"name":"Hex","type":"Enchantment","casting":"Bonus Action","range":"90 feet","components":"V, S, M (the petrified eye of a newt)","duration":"Concentration, up to 1 hour","level":"Level 1","classes":["Warlock"],"content":["You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 Necrotic damage to the target whenever you hit it with an attack roll. Also, choose one ability when you cast the spell. The target has Disadvantage on ability checks made with the chosen ability.","If the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action on a later turn to curse a new creature.","***Using a Higher-Level Spell Slot.*** Your Concentration can last longer with a spell slot of level 2 (up to 4 hours), 3-4 (up to 8 hours), or 5+ (24 hours)."]},{"name":"Hold Monster","type":"Enchantment","casting":"Action","range":"90 feet","components":"V, S, M (a straight piece of iron)","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["Choose a creature that you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration. At the end ofeach of its turns, the target repeats the save, ending the spell on itself on a success.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 5."]},{"name":"Hold Person","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S, M (a straight piece of iron)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Cleric","Druid","Sorcerer","Warlock","Wizard"],"content":["Choose a Humanoid that you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration. At the end of each of its turns, the target repeats the save, ending the spell on itself on a success.","***Using a Higher-Level Spell Slot.*** You can target one additional Humanoid for each spell slot level above 2."]},{"name":"Holy Aura","type":"Abjuration","casting":"Action","range":"Self","components":"V, S, M (a reliquary worth 1,000+ GP)","duration":"Concentration, up to 1 minute","level":"Level 8","classes":["Cleric"],"content":["For the duration, you emit an aura in a 30-foot Emanation. While in the aura, creatures of your choice have Advantage on all saving throws, and other creatures have Disadvantage on attack rolls against them. In addition, when a Fiend or an Undead hits an affected creature with a melee attack roll, the attacker must succeed on a Constitution saving throw or have the Blinded condition until the end of its next turn."]},{"name":"Hunger of Hadar","type":"Conjuration","casting":"Action","range":"150 feet","components":"V, S, M (a pickled tentacle)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Warlock"],"content":["You open a gateway to the Far Realm, a region infested with unspeakable horrors. A 20-foot-radius Sphere of Darkness appears, centered on a point with range and lasting for the duration. The Sphere is Difficult Terrain, and it is filled with strange whispers and slurping noises, which can be heard up to 30 feet away. No light, magical or otherwise, can illuminate the area, and creatures fully within it have the Blinded condition.","Any creature that starts its turn in the area takes 2d6 Cold damage. Any creature that ends its turn there must succeed on a Dexterity saving throw or take 2d6 Acid damage from otherworldly tentacles.","***Using a Higher-Level Spell Slot.*** The Cold or Acid damage (your choice) increases by 1d6 for each spell slot level above 3."]},{"name":"Hunter's Mark","type":"Divination","casting":"Bonus Action","range":"90 feet","components":"V","duration":"Concentration, up to 1 hour","level":"Level 1","classes":["Ranger"],"content":["You magically mark one creature you can see within range as your quarry. Until the spell ends, you deal an extra 1d6 Force damage to the target whenever you hit it with an attack roll. You also have Advantage on any Wisdom (Perception or Survival) check you make to find it.","If the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action to move the mark to a new creature you can see within range.","***Using a Higher-Level Spell Slot.*** Your Concentration can last longer with a spell slot of level 3-4 (up to 8 hours) or 5+ (up to 24 hours)."]},{"name":"Hypnotic Pattern","type":"Illusion","casting":"Action","range":"120 feet","components":"S, M (a pinch of confetti)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You create a twisting pattern of colors in a 30-foot Cube within range. The pattern appears for a moment and vanishes. Each creature in the area who can see the pattern must succeed on a Wisdom saving throw or have the Charmed condition for the duration. While Charmed, the creature has the Incapacitated condition and a Speed of 0.","The spell ends for an affected creature if it takes any damage or if someone else uses an action to shake the creature out of its stupor."]},{"name":"Ice Knife","type":"Conjuration","casting":"Action","range":"60 feet","components":"S, M (a drop of water or a piece of ice)","duration":"Instantaneous","level":"Level 1","classes":["Druid","Sorcerer","Wizard"],"content":["You create a shard ofice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 Piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 Cold damage.","***Using a Higher-Level Spell Slot.*** The Cold damage increases by 1d6 for each spell slot level above 1."]},{"name":"Ice Storm","type":"Evocation","casting":"Action","range":"300 feet","components":"V, S, M (a mitten)","duration":"Instantaneous","level":"Level 4","classes":["Druid","Sorcerer","Wizard"],"content":["Hail falls in a 20-foot-radius, 40-foot-high Cylinder centered on a point within range. Each creature in the Cylinder makes a Dexterity saving throw. A creature takes 2d10 Bludgeoning damage and 4d6 Cold damage on a failed save or half as much damage on a successful one.","Hailstones turn ground in the Cylinder into Difficult Terrain until the end of your next turn.","***Using a Higher-Level Spell Slot.*** The Bludgeoning damage increases by 1d10 for each spell slot level above 4."]},{"name":"Identify","type":"Divination","casting":"1 minute or Ritual","range":"Touch","components":"V, S, M (a pearl worth 100+ GP)","duration":"Instantaneous","level":"Level 1","classes":["Bard","Wizard"],"content":["You touch an object throughout the spell's casting. If the object is a magic item or some other magical object, you learn its properties and how to use them, whether it requires Attunement, and how many charges it has, if any. You learn whether any ongoing spells are affecting the item and what they are. If the item was created by a spell, you learn that spell's name.","If you instead touch a creature throughout the casting, you learn which ongoing spells, if any, are currently affecting it."]},{"name":"Illusory Script","type":"Illusion","casting":"1 minute or Ritual","range":"Touch","components":"S, M (ink worth 10+ GP, which the spell consumes)","duration":"10 days","level":"Level 1","classes":["Bard","Warlock","Wizard"],"content":["You write on parchment, paper, or another suitable material and imbue it with an illusion that lasts for the duration. To you and any creatures you designate when you cast the spell, the writing appears normal, seems to be written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible. Alternatively, the illusion can alter the meaning, handwriting, and language of the text, though the language must be one you know.","If the spell is dispelled, the original script and the illusion both disappear.","A creature that has Truesight can read the hidden message."]},{"name":"Imprisonment","type":"Abjuration","casting":"1 minute","range":"30 feet","components":"V, S, M (a statuette of the target worth 5,000+ GP)","duration":"Until dispelled","level":"Level 9","classes":["Warlock","Wizard"],"content":["You create a magical restraint to hold a creature that you can see within range. The target must make a Wisdom saving throw. On a successful save, the target is unaffected, and it is immune to this spell for the next 24 hours. On a failed save, the target is imprisoned. While imprisoned, the target doesn't need to breathe, eat, or drink, and it doesn't age. Divination spells can't locate or perceive the imprisoned target, and the target can't teleport.","Until the spell ends, the target is also affected by one of the following effects of your choice:","***Burial.*** The target is entombed beneath the earth in a hollow globe of magical force that is just large enough to contain the target. Nothing can pass into or out of the globe.","***Chaining.*** Chains firmly rooted in the ground hold the target in place. The target has the Restrained condition and can't be moved by any means.","***Hedged Prison.*** The target is trapped in a demiplane that is warded against teleportation and planar travel. The demiplane is your choice of a labyrinth, a cage, a tower, or the like.","***Minimus Containment.*** The target becomes 1 inch tall and is trapped inside an indestructible gemstone or a similar object. Light can pass through the gemstone (allowing the target to see out and other creatures to see in), but nothing else can pass through by any means.","***Slumber.*** The target has the Unconscious condition and can't be awoken.","***Ending the Spell.*** When you cast the spell, specify a trigger that will end it. The trigger can be as simple or as elaborate as you choose, but the DM must agree that it has a high likelihood of happening within the next decade. The trigger must be an observable action, such as someone making a particular offering at the temple of your god, saving your true love, or defeating a specific monster.","A *Dispel Magic* spell can end the spell only if it is cast with a level 9 spell slot, targeting either the prison or the component used to create it."]},{"name":"Incendiary Cloud","type":"Conjuration","casting":"Action","range":"150 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 8","classes":["Druid","Sorcerer","Wizard"],"content":["A swirling cloud of embers and smoke fills a 20-foot-radius Sphere centered on a point within range. The cloud's area is Heavily Obscured. It lasts for the duration or until a strong wind (like that created by *Gust of Wind*) disperses it.","When the cloud appears, each creature in it makes a Dexterity saving throw, taking 10d8 Fire damage on a failed save or half as much damage on a successful one. A creature must also make this save when the Sphere moves into its space and when it enters the Sphere or ends its turn there. A creature makes this save only once per turn.","The cloud moves 10 feet away from you in a direction you choose at the start of each of your turns."]},{"name":"Inflict Wounds","type":"Necromancy","casting":"Action","range":"Touch","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Cleric"],"content":["A creature you touch makes a Constitution saving throw, taking 2d10 Necrotic damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 1."]},{"name":"Insect Plague","type":"Conjuration","casting":"Action","range":"300 feet","components":"V, S, M (a locust)","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Cleric","Druid","Sorcerer"],"content":["Swarming locusts fill a 20-foot-radius Sphere centered on a point you choose within range. The Sphere remains for the duration, and its area is Lightly Obscured and Difficult Terrain.","When the swarm appears, each creature in it makes a Constitution saving throw, taking 4d10 Piercing damage on a failed save or half as much damage on a successful one. A creature also makes this save when it enters the spell's area for the first time on a turn or ends its turn there. A creature makes this save only once per turn.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 5."]},{"name":"Invisibility","type":"Illusion","casting":"Action","range":"Touch","components":"V, S, M (an eyelash in gum arabic)","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["A creature you touch has the Invisible condition until the spell ends. The spell ends early immediately after the target makes an attack roll, deals damage, or casts a spell.","***Using a Higher-Level Spell Slot***. You can target one additional creature for each spell slot level above 2."]},{"name":"Jallarzi's Storm of Radiance","type":"Evocation","casting":"Action","range":"120 feet","components":"V S, M (a pinch of phosphorus)","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Warlock","Wizard"],"content":["You unleash a storm ofvflashing light and raging thunder in a 10-foot-radius, 40-foot-high Cylinder centered on a point you can see within range. While in this area, creatures have the Blinded and Deafened conditions, and they can't cast spells with a Verbal component.","When the storm appears, each creature in it makes a Constitution saving throw taking 2d10 Radiant damage and 2d10 Thunder damage on a failed save or half as much damage on a successful one. A creature also makes this save when it enters the spell's area for the first time on a turn or ends its turn there. A creature makes this save only once per turn.","***Using a Higher-Level Spell Slot.*** The Radiant and Thunder damage increase by 1d10 for each spell slot level above 5."]},{"name":"Jump","type":"Transmutation","casting":"Bonus Action","range":"Touch","components":"V, S, M (a grasshopper's hind leg)","duration":"1 minute","level":"Level 1","classes":["Druid","Ranger","Sorcerer","Wizard"],"content":["You touch a willing creature. Once on each of its turns until the spell ends, that creature can jump up to 30 feet by spending 10 feet of movement.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 1."]},{"name":"Knock","type":"Transmutation","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 2","classes":["Bard","Sorcerer","Wizard"],"content":["Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access.","A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked.","If the target is held shut by Arcone Lock, that spell is suppressed for 10 minutes, during which time the target can be opened and closed.","When you cast the spell, a loud knock, audible up to 300 feet away, emanates from the target."]},{"name":"Legend Lore","type":"Divination","casting":"10 minutes","range":"Self","components":"V, S, M (incense worth 250+ GP, which the spell consumes, and four ivory strips worth 50+ GP each)","duration":"Instantaneous","level":"Level 5","classes":["Bard","Cleric","Wizard"],"content":["Name or describe a famous person, place, or object. The spell brings to your mind a brief summary of the significant lore about that famous thing, as described by the DM.","The lore might consist of important details, amusing revelations, or even secret lore that has never been widely known. The more information you already know about the thing, the more precise and detailed the information you receive is. That information is accurate but might be couched in figurative language or poetry, as determined by the DM.","If the famous thing you chose isn't actually famous, you hear sad musical notes played on a trombone, and the spell fails."]},{"name":"Leomund's Secret Chest","type":"Conjuration","casting":"Action","range":"Touch","components":"V, S, M (a chest, 3 feet by 2 feet by 2 feet, constructed from rare materials worth 5,000+ GP, and a Tiny replica of the chest made from the same materials worth 50+ GP)","duration":"Until dispelled","level":"Level 4","classes":["Wizard"],"content":["You hide a chest and all its contents on the Ethereal Plane. You must touch the chest and the miniature replica that serve as Material components for the spell. The chest can contain up to 12 cubic feet of nonliving material (3 feet by 2 feet by 2 feet).","While the chest remains on the Ethereal Plane, you can take a Magic action and touch the replica to recall the chest. It appears in an unoccupied space on the ground within 5 feet of you. You can send the chest back to the Ethereal Plane by taking a Magic action to touch the chest and the replica.","After 60 days, there is a cumulative 5 percent chance at the end of each day that the spell ends. The spell also ends if you cast this spell again or if the Tiny replica chest is destroyed. If the spell ends and the larger chest is on the Ethereal Plane, the chest remains there for you or someone else to find."]},{"name":"Leomund's Tiny Hut","type":"Evocation","casting":"1 minute or Ritual","range":"Self","components":"V, S, M (a crystal bead)","duration":"8 hours","level":"Level 3","classes":["Bard","Wizard"],"content":["A 10-foot Emanation springs into existence around you and remains stationary for the duration. The spell fails when you cast it if the Emanation isn't big enough to fully encapsulate all creatures in its area.","Creatures and objects within the Emanation when you cast the spell can move through it freely. All other creatures and objects are barred from passing through it. Spells of level 3 or lower can't be cast through it, and the effects of such spells can't extend into it.","The atmosphere inside the Emanation is comfortable and dry, regardless of the weather outside. Until the spell ends, you can command the interior to have Dim Light or Darkness (no action required). The Emanation is opaque from the outside and of any color you choose, but it's transparent from the inside.","The spell ends early if you leave the Emanation or if you cast it again."]},{"name":"Lesser Restoration","type":"Abjuration","casting":"Bonus Action","range":"Touch","components":"V, S","duration":"Instantaneous","level":"Level 2","classes":["Bard","Cleric","Druid","Paladin","Ranger"],"content":["You touch a creature and end one condition on it: Blinded, Deafened, Paralyzed, or Poisoned."]},{"name":"Levitate","type":"Transmutation","casting":"Action","range":"60 feet","components":"V, S, M (a metal spring)","duration":"Concentration, up to 10 minutes","level":"Level 2","classes":["Sorcerer","Wizard"],"content":["One creature or loose object ofyour choice that you can see within range rises vertically up to 20 feet and remains suspended there for the duration. The spell can levitate an object that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.","The target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can take a Magic action to move the target, which must remain within the spell's range.","When the spell ends, the target floats gently to the ground if it is still aloft."]},{"name":"Light","type":"Evocation","casting":"Action","range":"Touch","components":"V, M (a firefly or phosphorescent moss)","duration":"1 hour","level":"Cantrip","classes":["Bard","Cleric","Sorcerer","Wizard"],"content":["You touch one Large or smaller object that isn't being worn or carried by someone else. Until the spell ends, the object sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The light can be colored as you like.","Covering the object with something opaque blocks the light. The spell ends if you cast it again."]},{"name":"Lightning Arrow","type":"Transmutation","casting":"Bonus Action, which you take immediately after hitting or missing a target with a ranged attack using a weapon","range":"Self","components":"V, S","duration":"Instantaneous","level":"Level 3","classes":["Ranger"],"content":["As your attack hits or misses the target, the weapon or ammunition you're using transforms into a lightning bolt. Instead of taking any damage or other effects from the attack, the target takes 4d8 Lightning damage on a hit or half as much damage on a miss. Each creature within 10 feet of the target then makes a Dexterity saving throw taking 2d8 Lightning damage on a failed save or half as much damage on a successful one.","The weapon or ammunition then returns to its normal form.","***Using a Higher-Level Spell Slot.*** The damage for both effects of the spell increases by 1d8 for each spell slot level above 3."]},{"name":"Lightning Bolt","type":"Evocation","casting":"Action","range":"Self","components":"V, S, M (a bit of fur and a crystal rod)","duration":"Instantaneous","level":"Level 3","classes":["Sorcerer","Wizard"],"content":["A stroke of lightning forming a 100-foot-long, 5-foot-wide Line blasts out from you in a direction you choose. Each creature in the Line makes a Dexterity saving throw, taking 8d6 Lightning damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 3."]},{"name":"Locate Animals or Plants","type":"Divination","casting":"Action or Ritual","range":"Self","components":"V, S, M (fur from a bloodhound)","duration":"Instantaneous","level":"Level 2","classes":["Bard","Druid","Ranger"],"content":["Describe or name a specific kind of Beast, Plant creature, or nonmagical plant. You learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present."]},{"name":"Locate Creature","type":"Divination","casting":"Action","range":"Self","components":"V, S, M (fur from a bloodhound)","duration":"Concentration, up to 1 hour","level":"Level 4","classes":["Bard","Cleric","Druid","Paladin","Ranger","Wizard"],"content":["Describe or name a creature that is familiar to you. You sense the direction to the creature's location if that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement.","The spell can locate a specific creature known to you or the nearest creature of a specific kind (such as a human or a unicorn) if you have seen such a creature up close-within 30 feet-at least once. If the creature you described or named is in a different form, such as under the effects of a *Flesh to Stone* or *Polymorph* spell, this spell doesn't locate the creature.","This spell can't locate a creature if any thickness of lead blocks a direct path between you and the creature."]},{"name":"Locate Object","type":"Divination","casting":"Action","range":"Self","components":"V, S, M (a forked twig)","duration":"Concentration, up to 10 minutes","level":"Level 2","classes":["Bard","Cleric","Druid","Paladin","Ranger","Wizard"],"content":["Describe or name an object that is familiar to you. You sense the direction to the object's location if that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.","The spell can locate a specific object known to you if you have seen it up close-within 30 feet-at least once. Alternatively, the spell can locate the nearest object of a particular kind, such as a certain kind of apparel, jewelry, furniture, tool, or weapon.","This spell can't locate an object if any thickness of lead blocks a direct path between you and the object."]},{"name":"Longstrider","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (a pinch of dirt)","duration":"1 hour","level":"Level 1","classes":["Bard","Druid","Ranger","Wizard"],"content":["You touch a creature. The target's Speed increases by 10 feet until the spell ends.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level above 1."]},{"name":"Mage Armor","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S, M (a piece of cured leather)","duration":"8 hours","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["You touch a willing creature who isn't wearing armor. Until the spell ends, the target's base AC becomes 13 plus its Dexterity modifier. The spell ends early if the target dons armor."]},{"name":"Mage Hand","type":"Conjuration","casting":"Action","range":"30 feet","components":"V, S","duration":"1 minute","level":"Cantrip","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.","When you cast the spell, you can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial.","As a Magic action on your later turns, you can control the hand thus again. As part ofthat action, you can move the hand up to 30 feet.","The hand can't attack, activate magic items, or carry more than 10 pounds."]},{"name":"Magic Circle","type":"Abjuration","casting":"1 minute","range":"10 feet","components":"V, S, M (salt and powdered silver worth 100+ GP, which the spell consumes)","duration":"1 hour","level":"Level 3","classes":["Cleric","Paladin","Warlock","Wizard"],"content":["You create a 10-foot-radius, 20-foot-tall Cylinder of magical energy centered on a point on the ground that you can see within range. Glowing runes appear wherever the Cylinder intersects with the floor or other surface.","Choose one or more of the following types of creatures: Celestials, Elementals, Fey, Fiends, or Undead. The circle affects a creature of the chosen type in the following ways:"," The creature can't willingly enter the Cylinder by nonmagical means. If the creature tries to use teleportation or interplanar travel to do so, it must first succeed on a Charisma saving throw"," The creature has Disadvantage on attack rolls against targets within the Cylinder."," Targets within the Cylinder can't be possessed by or gain the Charmed or Frightened condition from the creature.","Each time you cast this spell, you can cause its magic to operate in the reverse direction, preventing a creature of the specified type from leaving the Cylinder and protecting targets outside it.","***Using a Higher-Level Spell Slot.*** The duration increases by 1 hour for each spell slot level above 3."]},{"name":"Magic Jar","type":"Necromancy","casting":"1 minute","range":"Self","components":"V S, M (a gem, crystal, or reliquary worth 500+ GP)","duration":"Until dispelled","level":"Level 6","classes":["Wizard"],"content":["Your body falls into a catatonic state as your soul leaves it and enters the container you used for the spell's Material component. While your soul inhabits the container, you are aware of your surroundings as if you were in the container's space. You can't move or take Reactions. The only action you can take is to project your soul up to 100 feet out of the container, either returning to your living body (and ending the spell) or attempting to possess a Humanoid's body.","You can attempt to possess any Humanoid within 100 feet of you that you can see (creatures warded by a *Protection from Evil and Good* or *Magic Circle* spell can't be possessed). The target makes a Charisma saving throw. On a failed save, your soul enters the target's body, and the target's soul becomes trapped in the container. On a successful save, the target resists your efforts to possess it, and you can't attempt to possess it again for 24 hours.","Once you possess a creature's body, you control it. Your Hit Points, Hit Point Dice, Strength, Dexterity, Constitution, Speed, and senses are replaced by the creature's. You otherwise keep your game statistics.","Meanwhile, the possessed creature's soul can perceive from the container using its own senses, but it can't move and it is Incapacitated.","While possessing a body, you can take a Magic action to return from the host body to the container if it is within 100 feet of you, returning the host creature's soul to its body. If the host body dies while you're in it, the creature dies, and you make a Charisma saving throw against your own spellcasting DC. On a success, you return to the container if it is within 100 feet of you. Otherwise, you die.","If the container is destroyed or the spell ends, your soul returns to your body. If your body is more than 100 feet away from you or if your body is dead, you die. If another creature's soul is in the container when it is destroyed, the creature's soul returns to its body if the body is alive and within 100 feet. Otherwise, that creature dies.","When the spell ends, the container is destroyed."]},{"name":"Magic Missile","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["You create three glowing darts of magical force. Each dart strikes a creature of your choice that you can see within range. A dart deals 1d4 + 1 Force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.","***Using a Higher-Level Spell Slot.*** The spell creates one more dart for each spell slot level above 1."]},{"name":"Magic Mouth","type":"Illusion","casting":"1 minute or Ritual","range":"30 feet","components":"V, S, M (jade dust worth 10+ GP, which the spell consumes)","duration":"Until dispelled","level":"Level 2","classes":["Bard","Wizard"],"content":["You implant a message within an object in range-a message that is uttered when a trigger condition is met. Choose an object that you can see and that isn't being worn or carried by another creature. Then speak the message, which must be 25 words or fewer, though it can be delivered over as long as 10 minutes. Finally, determine the circumstance that will trigger the spell to deliver your message.","When that trigger occurs, a magical mouth appears on the object and recites the message in your voice and at the same volume you spoke. If the object you chose has a mouth or something that looks like a mouth (for example, the mouth of a statue), the magical mouth appears there, so the words appear to come from the object's mouth. When you cast this spell, you can have the spell end after it delivers its message, or it can remain and repeat its message whenever the trigger occurs.","The trigger can be as general or as detailed as you like, though it must be based on visual or audible conditions that occur within 30 feet of the object. For example, you could instruct the mouth to speak when any creature moves within 30 feet of the object or when a silver bell rings within 30 feet of it."]},{"name":"Magic Weapon","type":"Transmutation","casting":"Bonus Action","range":"Touch","components":"V, S","duration":"1 hour","level":"Level 2","classes":["Paladin","Ranger","Sorcerer","Wizard"],"content":["You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls. The spell ends early if you cast it again.","***Using a Higher-Level Spell Slot.*** The bonus increases to +2 with a level 3-5 spell slot. The bonus increases to +3 with a level 6+ spell slot."]},{"name":"Major Image","type":"Illusion","casting":"Action","range":"120 feet","components":"V, S, M (a bit of fleece)","duration":"Concentration, up to 10 minutes","level":"Level 3","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot Cube. The image appears at a spot that you can see within range and lasts for the duration. It seems real, including sounds, smells, and temperature appropriate to the thing depicted, but it can't deal damage or cause conditions.","If you are within range of the illusion, you can take a Magic action to cause the image to move to any other spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking. Similarly, you can cause the illusion to make different sounds at different times, even making it carry on a conversation, for example.","Physical interaction with the image reveals it to be an illusion, for things can pass through it. A creature that takes a Study action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and its other sensory qualities become faint to the creature.","***Using a Higher-Level Spell Slot.*** The spell lasts until dispelled, without requiring Concentration, if cast with a level 4+ spell slot."]},{"name":"Mass Cure Wounds","type":"Abjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 5","classes":["Bard","Cleric","Druid"],"content":["A wave of healing energy washes out from a point you can see within range. Choose up to six creatures in a 30-foot-radius Sphere centered on that point. Each target regains Hit Points equal to 5d8 plus your spellcasting ability modifier.","***Using a Higher-Level Spell Slot.*** The healing increases by 1d8 for each spell slot level above 5."]},{"name":"Mass Heal","type":"Abjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 9","classes":["Cleric"],"content":["A flood of healing energy flows from you into creatures around you. You restore up to 700 Hit Points, divided as you choose among any number of creatures that you can see within range. Creatures healed by this spell also have the Blinded, Deafened, and Poisoned conditions removed from them."]},{"name":"Mass Healing Word","type":"Abjuration","casting":"Bonus Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 3","classes":["Bard","Cleric"],"content":["Up to six creatures of your choice that you can see within range regain Hit Points equal to 2d4 plus your spellcasting ability modifier.","***Using a Higher-Level Spell Slot.*** The healing increases by 1d4 for each spell slot level above 3."]},{"name":"Mass Suggestion","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, M (a snake's tongue)","duration":"24 hours","level":"Level 6","classes":["Bard","Sorcerer","Wizard"],"content":["You suggest a course of activity-described in no more than 25 words-to twelve or fewer creatures you can see within range that can hear and understand you. The suggestion must sound achievable and not involve anything that would obviously deal damage to any of the targets or their allies. For example, you could say, \\"Walk to the village down that road, and help the villagers there harvest crops until sunset\\". Or you could say, \\"Now is not the time for violence. Drop your weapons, and dance! Stop in an hour\\".","Each target must succeed on a Wisdom saving throw or have the Charmed condition for the duration or until you or your allies deal damage to the target. Each Charmed target pursues the suggestion to the best of its ability. The suggested activity can continue for the entire duration, but if the suggested activity can be completed in a shorter time, the spell ends for a target upon completing it.","***Using a Higher-Level Spell Slot.*** The duration is longer with a spell slot of level 7 (10 days), 8 (30 days), or 9 (366 days)."]},{"name":"Maze","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 8","classes":["Wizard"],"content":["You banish a creature that you can see within range into a labyrinthine demiplane. The target remains there for the duration or until it escapes the maze.","The target can take a Study action to try to escape. When it does so, it makes a DC 20 Intelligence (Investigation) check. If it succeeds, it escapes, and the spell ends.","When the spell ends, the target reappears in the space it left or, ifthat space is occupied, in the nearest unoccupied space."]},{"fontSize":1.95,"name":"Meld Into Stone","type":"Transmutation","casting":"Action or Ritual","range":"Touch","components":"V, S","duration":"8 hours","level":"Level 3","classes":["Cleric","Druid","Ranger"],"content":["You step into a stone object or surface large enough to fully contain your body, merging yourself and your equipment with the stone for the duration. You must touch the stone to do so. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.","While merged with the stone, you can't see what occurs outside it, and any Wisdom (Perception) checks you make to hear sounds outside it are made with Disadvantage. You remain aware of the passage of time and can cast spells on yourself while merged in the stone. You can use 5 feet of movement to leave the stone where you entered it, which ends the spell. You otherwise can't move.","Minor physical damage to the stone doesn't harm you, but its partial destruction or a change in its shape (to the extent that you no longer fit within it) expels you and deals 6d6 Force damage to you. The stone's complete destruction (or transmutation into a different substance) expels you and deals 50 Force damage to you. If expelled, you move into an unoccupied space closest to where you first entered and have the Prone condition."]},{"name":"Melf's Acid Arrow","type":"Evocation","casting":"Action","range":"90 feet","components":"V, S, M (powdered rhubarb leaf)","duration":"Instantaneous","level":"Level 2","classes":["Wizard"],"content":["A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 Acid damage and 2d4 Acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage only.","***Using a Higher-Level Spell Slot.*** The damage (both initial and later) increases by 1d4 for each spell slot level above 2."]},{"name":"Mending","type":"Transmutation","casting":"1 minute","range":"Touch","components":"V, S, M (two lodestones)","duration":"Instantaneous","level":"Cantrip","classes":["Bard","Cleric","Druid","Sorcerer","Wizard"],"content":["This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.","This spell can physically repair a magic item, but it can't restore magic to such an object."]},{"name":"Message","type":"Transmutation","casting":"Action","range":"120 feet","components":"S, M (a copper wire)","duration":"1 round","level":"Cantrip","classes":["Bard","Druid","Sorcerer","Wizard"],"content":["You point toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.","You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence; 1 foot of stone, metal, or wood; or a thin sheet of lead blocks the spell."]},{"name":"Meteor Swarm","type":"Evocation","casting":"Action","range":"1 mile","components":"V, S","duration":"Instantaneous","level":"Level 9","classes":["Sorcerer","Wizard"],"content":["Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius Sphere centered on each of those points makes a Dexterity saving throw. A creature takes 20d6 Fire damage and 20d6 Bludgeoning damage on a failed save or half as much damage on a successful one. A creature in the area of more than one fiery Sphere is affected only once.","A nonmagical object that isn't being worn or carried also takes the damage if it's in the spell's area, and the object starts burning if it's flammable."]},{"name":"Mind Blank","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S","duration":"24 hours","level":"Level 8","classes":["Bard","Wizard"],"content":["Until the spell ends, one willing creature you touch has Immunity to Psychic damage and the Charmed condition. The target is also unaffected by anything that would sense its emotions or alignment, read its thoughts, or magically detect its location, and no spell-not even *Wish* -can gather information about the target, observe it remotely, or control its mind."]},{"name":"Mind Sliver","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"1 round","level":"Cantrip","classes":["Sorcerer","Warlock","Wizard"],"content":["You try to temporarily sliver the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 Psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.","***Cantrip Upgrade.*** The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6)."]},{"name":"Mind Spike","type":"Divination","casting":"Action","range":"120 feet","components":"S","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Sorcerer","Warlock","Wizard"],"content":["You drive a spike of psionic energy into the mind of one creature you can see within range. The target makes a Wisdom saving throw taking 3d8 Psychic damage on a failed save or half as much damage on a successful one. On a failed save, you also always know the target's location until the spell ends, but only while the two of you are on the same plane of existence. While you have this knowledge, the target can't become hidden from you, and if it has the Invisible condition, it gains no benefit from that condition against you.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 2."]},{"name":"Minor Illusion","type":"Illusion","casting":"Action","range":"30 feet","components":"S, M (a bit of fleece)","duration":"1 minute","level":"Cantrip","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You create a sound or an image of an object within range that lasts for the duration. See the descriptions below for the effects of each. The illusion ends if you cast this spell again.","If a creature takes a Study action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.","***Sound.*** If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.","***Image.*** If you create an image of an object-such as a chair, muddy footprints, or a small chest-it must be no larger than a 5-foot Cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, since things can pass through it."]},{"name":"Mirage Arcane","type":"Illusion","casting":"10 minutes","range":"Sight","components":"V, S","duration":"10 days","level":"Level 7","classes":["Bard","Druid","Wizard"],"content":["You make terrain in an area up to 1 mile square look, sound, smell, and even feel like some other sort of terrain. Open fields or a road could be made to resemble a swamp, hill, crevasse, or some other rough or impassable terrain. A pond can be made to seem like a grassy meadow a precipice like a gentle slope, or a rock-strewn gully like a wide and smooth road.","Similarly, you can alter the appearance of structures or add them where none are present. The spell doesn't disguise, conceal, or add creatures.","The illusion includes audible, visual, tactile, and olfactory elements, so it can turn clear ground into Difficult Terrain (or vice versa) or otherwise impede movement through the area. Any piece of the illusory terrain (such as a rock or stick) that is removed from the spell's area disappears immediately.","Creatures with Truesight can see through the illusion to the terrain's true form; however, all other elements of the illusion remain, so while the creature is aware of the illusion's presence, the creature can still physically interact with the illusion."]},{"name":"Mirror Image","type":"Illusion","casting":"Action","range":"Self","components":"V, S","duration":"1 minute","level":"Level 2","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real.","Each time a creature hits you with an attack roll during the spell's duration, roll a d6 for each of your remaining duplicates. If any of the d6s rolls a 3 or higher, one of the duplicates is hit instead of you, and the duplicate is destroyed. The duplicates otherwise ignore all other damage and effects. The spell ends when all three duplicates are destroyed.","A creature is unaffected by this spell if it has the Blinded condition, Blindsight, or Truesight."]},{"name":"Mislead","type":"Illusion","casting":"Action","range":"Self","components":"S","duration":"Concentration, up to 1 hour","level":"Level 5","classes":["Bard","Warlock","Wizard"],"content":["You gain the Invisible condition at the same time that an illusory double of you appears where you are standing. The double lasts for the duration, but the invisibility ends immediately after you make an attack roll, deal damage, or cast a spell.","As a Magic action, you can move the illusory double up to twice your Speed and make it gesture, speak, and behave in whatever way you choose. It is intangible and invulnerable.","You can see through its eyes and hear through its ears as if you were located where it is."]},{"name":"Misty Step","type":"Conjuration","casting":"Bonus Action","range":"Self","components":"V","duration":"Instantaneous","level":"Level 2","classes":["Sorcerer","Warlock","Wizard"],"content":["Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space you can see."]},{"name":"Modify Memory","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Bard","Wizard"],"content":["You attempt to reshape another creature's memories. One creature that you can see within range makes a Wisdom saving throw. If you are fighting the creature, it has Advantage on the save. On a failed save, the target has the Charmed condition for the duration. While Charmed in this way, the target also has the Incapacitated condition and is unaware of its surroundings, though it can hear you. If it takes any damage or is targeted by another spell, this spell ends, and no memories are modified.","While this charm lasts, you can affect the target's memory of an event that it experienced within the last 24 hours and that lasted no more than 10 minutes. You can permanently eliminate all memory of the event, allow the target to recall the event with perfect clarity, change its memory of the event's details, or create a memory of some other event.","You must speak to the target to describe how its memories are affected, and it must be able to understand your language for the modified memories to take root. Its mind fills in any gaps in the details of your description. If the spell ends before you finish describing the modified memories, the creature's memory isn't altered. Otherwise, the modified memories take hold when the spell ends.","A modified memory doesn't necessarily affect how a creature behaves, particularly if the memory contradicts the creature's natural inclinations, alignment, or beliefs. An illogical modified memory, such as a false memory of how much the creature enjoyed swimming in acid, is dismissed as a bad dream. The DM might deem a modified memory too nonsensical to affect a creature.","A *Remove Curse* or *Greater Restoration* spell cast on the target restores the creature's true memory.","***Using a Higher-Level Spell Slot.*** You can alter the target's memories of an event that took place up to 7 days ago (level 6 spell slot), 30 days ago (level 7 spell slot), 365 days ago (level 8 spell slot), or any time in the creature's past (level 9 spell slot)."]},{"name":"Moonbeam","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S, M (a moonseed leaf)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Druid"],"content":["A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high Cylinder centered on a point within range. Until the spell ends, Dim Light fills the Cylindea and you can take a Magic action on later turns to move the Cylinder up to 60 feet.","When the Cylinder appears, each creature in it makes a Constitution saving throw. On a failed save, a creature takes 2d10 Radiant damage, and if the creature is shape-shifted (as a result of the *Polymorph* spell, for example), it reverts to its true form and can't shape-shift until it leaves the Cylinder. On a successful save, a creature takes half as much damage only. A creature also makes this save when the spell's area moves into its space and when it enters the spell's area or ends its turn there. A creature makes this save only once per turn.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 2."]},{"name":"Mordenkainen's Faithful Hound","type":"Conjuration","casting":"Action","range":"30 feet","components":"V, S, M (a silver whistle)","duration":"8 hours","level":"Level 4","classes":["Wizard"],"content":["You conjure a phantom watchdog in an unoccupied space that you can see within range. The hound remains for the duration or until the two of you are more than 300 feet apart from each other.","No one but you can see the hound, and it is intangible and invulnerable. When a Small or larger creature comes within 30 feet of it without first speaking the password that you specify when you cast this spell, the hound starts barking loudly. The hound has Truesight with a range of 3O feet.","At the start of each of your turns, the hound attempts to bite one enemy within 5 feet of it. That enemy must succeed on a Dexterity saving throw or take 4d8 Force damage.","On your later turns, you can take a Magic action to move the hound up to 30 feet."]},{"name":"Mordenkainen's Magnificent Mansion","type":"Conjuration","casting":"1 minute","range":"300 feet","components":"V, S, M (a miniature door worth 15+ GP)","duration":"24 hours","level":"Level 7","classes":["Bard","Wizard"],"content":["You conjure a shimmering door in range that lasts for the duration. The door leads to an extradimensional dwelling and is 5 feet wide and 10 feet tall. You and any creature you designate when you cast the spell can enter the extradimensional dwelling as long as the door remains open. You can open or close it (no action required) if you are within 3O feet of it. While closed, the door is imperceptible.","Beyond the door is a magnificent foyer with numerous chambers beyond. The dwelling's atmosphere is clean, fresh, and warm.","You can create any floor plan you like for the dwelling, but it can't exceed 50 contiguous 10-foot Cubes. The place is furnished and decorated as you choose. It contains sufficient food to serve a ninecourse banquet for up to 100 people. Furnishings and other objects created by this spell dissipate into smoke if removed from it.","A staff of 100 near-transparent servants attends all who enter. You determine the appearance of these servants and their attire. They are invulnerable and obey your commands. Each servant can perform tasks that a human could perform, but they can't attack or take any action that would directly harm another creature. Thus the servants can fetch things, clean, mend, fold clothes, light fires, serve food, pour wine, and so on. The servants can't leave the dwelling.","When the spell ends, any creatures or objects left inside the extradimensional space are expelled into the unoccupied spaces nearest to the entrance."]},{"name":"Mordenkainen's Private Sanctum","type":"Abjuration","casting":"10 minutes","range":"120 feet","components":"V, S, M (a thin sheet of lead)","duration":"24 hours","level":"Level 4","classes":["Wizard"],"content":["You make an area within range magically secure. The area is a Cube that can be as small as 5 feet to as large as 100 feet on each side. The spell lasts for the duration.","When you cast the spell, you decide what sort of security the spell provides, choosing any of the following properties:"," Sound can't pass through the barrier at the edge of the warded area."," The barrier of the warded area appears dark and foggy, preventing vision (including Darkvision) through it."," Sensors created by Divination spells can't appear inside the protected area or pass through the barrier at its perimeter."," Creatures in the area can't be targeted by Divination spells."," Nothing can teleport into or out of the warded area."," Planar travel is blocked within the warded area.","Casting this spell on the same spot every day for 365 days makes the spell last until dispelled.","***Using a Higher-Level Spell Slot.*** You can increase the size of the Cube by 100 feet for each spell slot level above 4."]},{"name":"Mordenkainen's Sword","type":"Evocation","casting":"Action","range":"90 feet","components":"V, S, M (a miniature sword worth 250+ GP)","duration":"Concentration, up to 1 minute","level":"Level 7","classes":["Bard","Wizard"],"content":["You create a spectral sword that hovers within range. It lasts for the duration.","When the sword appears, you make a melee spell attack against a target within 5 feet of the sword. On a hit, the target takes Force damage equal to 4d12 plus your spellcasting ability modifier.","On your later turns, you can take a Bonus Action to move the sword up to 30 feet to a spot you can see and repeat the attack against the same target or a different one."]},{"fontSize":1.9,"name":"Move Earth","type":"Transmutation","casting":"Action","range":"120 feet","components":"V, S, M (a miniature shovel)","duration":"Concentration, up to 2 hours","level":"Level 6","classes":["Druid","Sorcerer","Wizard"],"content":["Choose an area of terrain no larger than 40 feet on a side within range. You can reshape dirt, sand, or clay in the area in any manner you choose for the duration. You can raise or lower the area's elevation, create or fill in a trench, erect or flatten a wall, or form a pillar. The extent of any such changes can't exceed half the area's largest dimension. For example, if you affect a 40-foot square, you can create a pillar up to 20 feet high, raise or lower the square's elevation by up to 20 feet, dig a trench up to 20 feet deep, and so on. It takes 10 minutes for these changes to complete. Because the terrain's transformation occurs slowly, creatures in the area can't usually be trapped or injured by the ground's movement.","At the end of every 10 minutes you spend concentrating on the spell, you can choose a new area of terrain to affect within range.","This spell can't manipulate natural stone or stone construction. Rocks and structures shift to accommodate the new terrain. If the way you shape the terrain would make a structure unstable, it might collapse.","Similarly, this spell doesn't directly affect plant growth. The moved earth carries any plants along with it."]},{"name":"Nondetection","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S, M (a pinch of diamond dust worth 25+ GP, which the spell consumes)","duration":"8 hours","level":"Level 3","classes":["Bard","Ranger","Wizard"],"content":["For the duration, you hide a target that you touch from Divination spells. The target can be a willing creature, or it can be a place or an object no larger than 1O feet in any dimension. The target can't be targeted by any Divination spell or perceived through magical scrying sensors."]},{"name":"Nystul's Magic Aura","type":"Illusion","casting":"Action","range":"Touch","components":"V, S, M (a small square of silk)","duration":"24 hours","level":"Level 2","classes":["Wizard"],"content":["With a touch, you place an illusion on a willing creature or an object that isn't being worn or carried. A creature gains the Mask effect below, and an object gains the False Aura effect below. The effect lasts for the duration. If you cast the spell on the same target every day for 3O days, the illusion lasts until dispelled.","***Mask (Creature).*** Choose a creature type other than the target's actual type. Spells and other magical effects treat the target as ifit were a creature of the chosen type.","***False Aura (Object).*** You change the way the target appears to spells and magical effects that detect magical auras, such as *Detect Magic*. You can make a nonmagical object appear magical, make a magic item appear nonmagical, or change the object's aura so that it appears to belong to a school of magic you choose."]},{"name":"Otiluke's Freezing Sphere","type":"Evocation","casting":"Action","range":"300 feet","components":"V, S, M (a miniature crystal sphere)","duration":"Instantaneous","level":"Level 6","classes":["Sorcerer","Wizard"],"content":["A frigid globe streaks from you to a point of your choice within range, where it explodes in a 60-foot-radius Sphere. Each creature in that area makes a Constitution saving throw taking 10d6 Cold damage on failed save or half as much damage on a successful one.","If the globe strikes a body of water, it freezes the water to a depth of 6 inches over an area 30 feet square. This ice lasts for 1 minute. Creatures that were swimming on the surface of frozen water are trapped in the ice and have the Restrained condition. A trapped creature can take an action to make a Strength (Athletics) check against your spell save DC to break free.","You can refrain from firing the globe after completing the spell's casting. If you do so, a globe about the size of a sling bullet, cool to the touch, appears in your hand. At any time, you or a creature you give the globe to can throw the globe (to a range of 40 feet) or hurl it with a sling (to the sling's normal range). It shatters on impact, with the same effect as a normal casting of the spell. You can also set the globe down without shattering it. After 1 minute, if the globe hasn't already shattered, it explodes.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 6."]},{"name":"Otiluke's Resilient Sphere","type":"Abjuration","casting":"Action","range":"30 feet","components":"V, S, M (a glass sphere)","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Wizard"],"content":["A shimmering sphere encloses a Large or smaller creature or object within range. An unwilling creature must succeed on a Dexterity saving throw or be enclosed for the duration.","Nothing-not physical objects, energy, or other spell effects-can pass through the barrier, in or out, though a creature in the sphere can breathe there. The sphere is immune to all damage, and a creature or object inside can't be damaged by attacks or effects originating from outside, nor can a creature inside the sphere damage anything outside it.","The sphere is weightless and just large enough to contain the creature or object inside. An enclosed creature can take an action to push against the sphere's walls and thus roll the sphere at up to half the creature's Speed. Similarly, the globe can be picked up and moved by other creatures.","A *Disintegrate* spell targeting the globe destroys it without harming anything inside."]},{"name":"Otto's Irresistible Dance","type":"Enchantment","casting":"Action","range":"30 feet","components":"V","duration":"Concentration, up to 1 minute","level":"Level 6","classes":["Bard","Wizard"],"content":["One creature that you can see within range must make a Wisdom saving throw. On a successful save, the target dances comically until the end of its next turn, during which it must spend all its movement to dance in place.","On a failed save, the target has the Charmed condition for the duration. While Charmed, the target dances comically, must use all its movement to dance in place, and has Disadvantage on Dexterity saving throws and attack rolls, and other creatures have Advantage on attack rolls against it. On each of its turns, the target can take an action to collect itself and repeat the save, ending the spell on itself on a success."]},{"name":"Passwall","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S, M (a pinch of sesame seeds)","duration":"1 hour","level":"Level 5","classes":["Wizard"],"content":["A passage appears at a point that you can see on a wooden, plaster, or stone surface (such as a wall, ceiling, or floor) within range and lasts for the duration. You choose the opening's dimensions: up to 5 feet wide, 8 feet tall, and 20 feet deep. The passage creates no instability in a structure surrounding it.","When the opening disappears, any creatures or objects still in the passage created by the spell are safely ejected to an unoccupied space nearest to the surface on which you cast the spell."]},{"name":"Pass without Trace","type":"Abjuration","casting":"Action","range":"Self","components":"V, S, M (ashes from burned mistletoe)","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Druid","Ranger"],"content":["You radiate a concealing aura in a 30-foot Emanation for the duration. While in the aura, you and each creature you choose have a +10 bonus to Dexterity (Stealth) checks and leave no tracks."]},{"name":"Phantasmal Force","type":"Illusion","casting":"Action","range":"60 feet","components":"V, S, M (a bit of fleece)","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Bard","Sorcerer","Wizard"],"content":["You attempt to craft an illusion in the mind of a creature you can see within range. The target makes an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other phenomenon that is no larger than a 10-foot Cube and that is perceivable only to the target for the duration. The phantasm includes sound, temperature, and other stimuli.","The target can take a Study action to examine the phantasm with an Intelligence (Investigation) check against your spell save DC. If the check succeeds, the target realizes that the phantasm is an illusion, and the spell ends.","While affected by the spell, the target treats the phantasm as if it were real and rationalizes any illogical outcomes from interacting with it. For example, if the target steps through a phantasmal bridge and survives the fall, it believes the bridge exists and something else caused it to fall.","An affected target can even take damage from the illusion if the phantasm represents a dangerous creature or hazard. On each ofyour turns, such a phantasm can deal 2d8 Psychic damage to the target if it is in the phantasm's area or within 5 feet of the phantasm. The target perceives the damage as a type appropriate to the illusion."]},{"name":"Phantasmal Killer","type":"Illusion","casting":"Action","range":"120 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Bard","Wizard"],"content":["You tap into the nightmares of a creature you can see within range and create an illusion of its deepest fears, visible only to that creature. The target makes a Wisdom saving throw. On a failed save, the target takes 4d10 Psychic damage and has Disadvantage on ability checks and attack rolls for the duration. On a successful save, the target takes half as much damage, and the spell ends.","For the duration, the target makes a Wisdom saving throw at the end of each of its turns. On a failed save, it takes the Psychic damage again. On a successful save, the spell ends.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d10 for each spell slot level above 4."]},{"name":"Phantom Steed","type":"Illusion","casting":"1 minute or Ritual","range":"30 feet","components":"V, S","duration":"1 hour","level":"Level 3","classes":["Wizard"],"content":["A Large, quasi-real, horselike creature appears on the ground in an unoccupied space of your choice within range. You decide the creature's appearance, and it is equipped with a saddle, bit, and bridle. Any of the equipment created by the spell vanishes in a puff of smoke if it is carried more than 10 feet away from the steed.","For the duration, you or a creature you choose can ride the steed. The steed uses the ***Riding Horse*** stat block (see appendix B), except it has a Speed of 100 feet and can travel 13 miles in an hour. When the spell ends, the steed gradually fades, giving the rider 1 minute to dismount. The spell ends early if the steed takes any damage."]},{"name":"Planar Ally","type":"Conjuration","casting":"10 minutes","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 6","classes":["Cleric"],"content":["You beseech an otherworldly entity for aid. The being must be known to you: a god, a demon prince, or some other being of cosmic power. That entity sends a Celestial, an Elemental, or a Fiend loyal to it to aid you, making the creature appear in an unoccupied space within range. If you know a specific creature's name, you can speak that name when you cast this spell to request that creature, though you might get a different creature anyway (DM's choice).","When the creature appears, it is under no compulsion to behave a particular way. You can ask it to perform a service in exchange for payment, but it isn't obliged to do so. The requested task could range from simple (fly us across the chasm, or help us fight a battle) to complex (spy on our enemies, or protect us during our foray into the dungeon). You must be able to communicate with the creature to bargain for its services.","Payment can take a variety of forms. A Celestial might require a sizable donation of gold or magic items to an allied temple, while a Fiend might demand a living sacrifice or a gift of treasure. Some creatures might exchange their service for a quest undertaken by you.","A task that can be measured in minutes requires a payment worth 100 GP per minute. A task measured in hours requires 1,000 GP per hour. And a task measured in days (up to 10 days) requires 10,000 GP per day. The DM can adjust these payments based on the circumstances under which you cast the spell. If the task is aligned with the creature's ethos, the payment might be halved or even waived. Nonhazardous tasks typically require only half the suggested payment, while especially dangerous tasks might require a greater gift. Creatures rarely accept tasks that seem suicidal.","After the creature completes the task, or when the agreed-upon duration of service expires, the creature returns to its home plane after reporting back to you if possible. If you are unable to agree on a price for the creature's service, the creature immediately returns to its home plane."]},{"name":"Planar Binding","type":"Abjuration","casting":"1 hour","range":"60 feet","components":"V, S, M (a jewel worth 1,000+ GP which the spell consumes)","duration":"24 hours","level":"Level 5","classes":["Bard","Cleric","Druid","Warlock","Wizard"],"content":["You attempt to bind a Celestial, an Elemental, a Fey, or a Fiend to your service. The creature must be within range for the entire casting of the spell. (Typically, the creature is first summoned into the center of the inverted version of the *Magic Circle* spell to trap it while this spell is cast). At the completion of the casting, the target must succeed on a Charisma saving throw or be bound to serve you for the duration. If the creature was summoned or created by another spell, that spell's duration is extended to match the duration of this spell.","A bound creature must follow your commands to the best of its ability. You might command the creature to accompany you on an adventure, to guard a location, or to deliver a message. If the creature is Hostile, it strives to twist your commands to achieve its own objectives. If the creature carries out your commands completely before the spell ends, it travels to you to report this fact if you are on the same plane of existence. If you are on a different plane, it returns to the place where you bound it and remains there until the spell ends.","***Using a Higher-Level Spell Slot.*** The duration increases with a spell slot of level 6 (10 days), 7 (30 days), 8 (180 days) and 9 (366 days)."]},{"name":"Plane Shift","type":"Conjuration","casting":"Action","range":"Touch","components":"V, S, M (a forked, metal rod worth 250+ GP and attuned to a plane of existence)","duration":"Instantaneous","level":"Level 7","classes":["Cleric","Druid","Sorcerer","Warlock","Wizard"],"content":["You and up to eight willing creatures who link hands in a circle are transported to a different plane of existence. You can specify a target destination in general terms, such as the City of Brass on the Elemental Plane of Fire or the palace of Dispater on the second level of the Nine Hells, and you appear in or near that destination, as determined by the DM.","Alternatively, if you know the sigil sequence of a teleportation circle on another plane of existence, this spell can take you to that circle. If the teleportation circle is too small to hold all the creatures you transported, they appear in the closest unoccupied spaces next to the circle."]},{"name":"Plant Growth","type":"Transmutation","casting":"Action (Overgrowth) or 8 hours (Enrichment)","range":"150 feet","components":"V, S","duration":"Instantaneous","level":"Level 3","classes":["Bard","Druid","Ranger"],"content":["This spell channels vitality into plants. The casting time you use determines whether the spell has the Overgrowth or the Enrichment effect below.","***Overgrowth.*** Choose a point within range. All normal plants in a 100-foot-radius Sphere centered on that point become thick and overgrown. A creature moving through that area must spend 4 feet of movement for every 1 foot it moves. You can exclude one or more areas of any size within the spell's area from being affected.","***Enrichment.*** All plants in a half-mile radius centered on a point within range become enriched for 365 days. The plants yield twice the normal amount of food when harvested. They can benefit from only one *Plant Growth* per year."]},{"name":"Poison Spray","type":"Necromancy","casting":"Action","range":"30 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Druid","Sorcerer","Warlock","Wizard"],"content":["You spray toxic mist at a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d12 Poison damage.","***Cantrip Upgrade.*** The damage increases by 1d12 when you reach levels 5 (2d12), 11 (3d12), and 17 (4d12)."]},{"name":"Polymorph","type":"Transmutation","casting":"Action","range":"60 feet","components":"V, S, M (a caterpillar cocoon)","duration":"Concentration, up to 1 hour","level":"Level 4","classes":["Bard","Druid","Sorcerer","Wizard"],"content":["You attempt to transform a creature that you can see within range into a Beast. The target must succeed on a Wisdom saving throw or shape-shift into a Beast form for the duration. That form can be any Beast you choose that has a Challenge Rating equal to or less than the target's (or the target's level if it doesn't have a Challenge Rating). The target's game statistics are replaced by the stat block of the chosen Beast, but the target retains its alignment, personality, creature type, Hit Points, and Hit Point Dice. See appendix B for a sample of Beast stat blocks.","The target gains a number of Temporary Hit Points equal to the Hit Points of the Beast form. The spell ends early on the target if it has no Temporary Hit Points left.","The target is limited in the actions it can perform by the anatomy of its new form, and it cant speak or cast spells.","The target's gear melds into the new form. The creature can't use or otherwise benefit from any of that equipment."]},{"name":"Power Word Fortify","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 7","classes":["Bard","Cleric"],"content":["You fortify up to six creatures you can see within range. The spell bestows 120 Temporary Hit Points, which you divide among the spell's recipients."]},{"name":"Power Word Heal","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 9","classes":["Bard","Cleric"],"content":["A wave of healing energy washes over one creature you can see within range. The target regains all its Hit Points. If the creature has the Charmed, Frightened, Paralyzed, Poisoned, or Stunned condition, the condition ends. If the creature has the Prone condition, it can use its Reaction to stand up."]},{"name":"Power Word Kill","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 9","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You compel one creature you can see within range to die. If the target has 100 Hit Points or fewer, it dies. Otherwise, it takes 12d12 Psychic damage."]},{"name":"Power Word Stun","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Level 8","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You overwhelm the mind of one creature you can see within range. If the target has 150 Hit Points or fewer, it has the Stunned condition. Otherwise, its Speed is 0 until the start of your next turn.","The Stunned target makes a Constitution saving throw at the end of each of its turns, ending the condition on itself on a success."]},{"name":"Prayer of Healing","type":"Abjuration","casting":"10 minutes","range":"30 feet","components":"V","duration":"Instantaneous","level":"Level 2","classes":["Cleric","Paladin"],"content":["Up to five creatures of your choice who remain within range for the spell's entire casting gain the benefits of a Short Rest and also regain 2d8 Hit Points. A creature can't be affected by this spell again until that creature finishes a Long Rest.","***Using a Higher-Level Spell Slot.*** The healing increases by 1d8 for each spell slot level above 2."]},{"name":"Prestidigitation","type":"Transmutation","casting":"Action","range":"10 feet","components":"V, S","duration":"Up to t hour","level":"Cantrip","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You create a magical effect within range. Choose the effect from the options below. If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time.","***Sensory Effect.*** You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.","***Fire Play.*** You instantaneously light or snuff out a candle, a torch, or a small campfire.","***Clean or Soil.*** You instantaneously clean or soil an object no larger than 1 cubic foot.","***Minor Sensation.*** You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.","***Magic Mark.*** You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.","***Minor Creation.*** You create a nonmagical trinket or an illusory image that can fit in your hand. It lasts until the end of your next turn. A trinket can deal no damage and has no monetary worth."]},{"name":"Prismatic Spray","type":"Evocation","casting":"Action","range":"Self","components":"V, S","duration":"Instantaneous","level":"Level 7","classes":["Bard","Sorcerer","Wizard"],"content":["Eight rays of light flash from you in a 60-foot Cone. Each creature in the Cone makes a Dexterity saving throw. For each target, roll 1d8 to determine which color ray affects it, consulting the Prismatic Rays table."],"tables":[{"title":"Prismatic Rays","sizes":[0.15,0.85],"header":[["1d8","Ray"]],"body":[["1","**Red**. *Failed Save:* 12d6 Fire damage. *Successful Save:* Half as much damage."],["2","**Orange**. *Failed Save:* 12d6 Acid damage. *Successful Save:* Half as much damage."],["3","**Yellow**. *Failed Save:* 12d6 Lightning damage. *Successful Save:* Half as much damage."],["4","**Green**. *Failed Save:* 12d6 Poison damage. *Successful Save:* Half as much damage."]]},{"title":"Prismatic Rays","page":1,"sizes":[0.15,0.85],"header":[["1d8","Ray"]],"body":[["5","**Blue**. *Failed Save:* 12d6 Cold damage. *Successful Save:* Half as much damage."],["6","**Indigo**. *Failed Save:* The target has the Restrained condition and makes a Constitution saving throw at the end of each of its turns. If it successfully saves three times, the condition ends. If it fails three times, it has the Petrified condition until it is freed by an effect like the *Greater Restoration* spell. The successes and failures needn't be consecutive; keep track of both until the target collects three of a kind."],["7","**Violet**. *Failed Save:* The target has the Blinded condition and makes a Wisdom saving throw at the start of your next turn. On a successful save, the condition ends. On a failed save, the condition ends, and the creature teleports to another plane of existence (DM's choice)."],["8","**Special**. The target is struck by two rays. Roll twice, rerolling any 8."]]}]},{"name":"Prismatic Wall","type":"Abjuration","casting":"Action","range":"60 feet","components":"V, S","duration":"10 minutes","level":"Level 9","classes":["Bard","Wizard"],"content":["A shimmering, multicolored plane of light forms a vertical opaque wall-up to 90 feet long, 30 feet high, and 1 inch thick-centered on a point within range. Alternatively, you shape the wall into a globe up to 30 feet in diameter centered on a point within range. The wall lasts for the duration. If you position the wall in a space occupied by a creature, the spell ends instantly without effect.","The wall sheds Bright Light within 100 feet and Dim Light for an additional 100 feet. You and creatures you designate when you cast the spell can pass through and be near the wall without harm. If another creature that can see the wall moves within 20 feet of it or starts its turn there, the creature must succeed on a Constitution saving throw or have the Blinded condition for 1 minute.","The wall consists of seven layers, each with a different color. When a creature reaches into or passes through the wall, it does so one layer at a time through all the layers. Each layer forces the creature to make a Dexterity saving throw or be affected by that layer's properties as described in the Prismatic Layers table.","The wall, which has AC 10, can be destroyed one layer at a time, in order from red to violet, by means specific to each layer. If a layer is destroyed, it is gone for the duration. *Antimagic Field* has no effect on the wall, and *Dispel Magic* can affect only the violet layer."],"tables":[{"title":"Prismatic Layers","sizes":[0.15,0.85],"header":[["Order","Effects"]],"body":[["1","**Red**. *Failed Save:* 12d6 Fire damage. *Successful Save:* Half as much damage. *Additional Efects:* Nonmagical ranged attacks can't pass through this layer, which is destroyed if it takes at least 25 Cold damage."],["2","**Orange**. *Failed Save:* 12d6 Acid damage. *Successful Save:* Half as much damage. *Additional Efects:* Magical ranged attacks can't pass through this layer, which is destroyed by a strong wind (such as the one created by *Gust of Wind*)."]]},{"title":"Prismatic Layers","sizes":[0.15,0.85],"header":[["Order","Effects"]],"body":[["3","**Yellow**. *Failed Save:* 12d6 Lightning damage. *Successful Save:* Half as much damage. *Additional Effects:* The layer is destroyed if it takes at least 60 Force damage."],["4","**Green**. *Failed Save:* 12d6 Poison damage. *Successful Save:* Half as much damage. *Additional Effects:* A *Passwall spell*, or another spell of equal or greater level that can open a portal on a solid surface, destroys this layer."],["5","**Blue**. *Failed Save:* 12d6 Cold damage. *Successful Save:* Half as much damage. *Additional Efects:* The layer is destroyed if it takes at least 25 Fire damage."]]},{"title":"Prismatic Layers","sizes":[0.15,0.85],"header":[["Order","Effects"]],"body":[["6","**Indigo**. *Failed Save:* The target has the Restrained condition and makes a Constitution saving throw at the end of each of its turns. If it successfully saves three times, the condition ends. If it fails three times, it has the Petrified condition until it is freed by an effect like the Creater Restoration spell. The successes and failures needn't be consecutive; keep track of both until the target collects three of a kind. *Additional Efects:* Spells can't be cast through this layer, which is destroyed by Bright Light shed by the *Daylight* spell."],["7","**Violet**. *Failed Save:* The target has the Blinded condition and makes a Wisdom saving throw at the start of your next turn. On a successful save, the condition ends. On a failed save, the condition ends, and the creature teleports to another plane of existence (DM's choice). *Additional Efects:* This layer is destroyed by *Dispel Magic*."]]}]},{"name":"Produce Flame","type":"Conjuration","casting":"Bonus Action","range":"Self","components":"V, S","duration":"10 minutes","level":"Cantrip","classes":["Druid"],"content":["A flickering flame appears in your hand and remains there for the duration. While there, the flame emits no heat and ignites nothing, and it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The spell ends if you cast it again.","Until the spell ends, you can take a Magic action to hurl fire at a creature or an object within 60 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 Fire damage.","***Cantrip Upgrade.*** The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8)."]},{"name":"Programmed Illusion","type":"Illusion","casting":"Action","range":"120 feet","components":"V, S, M (jade dust worth 25+ GP)","duration":"Until dispelled","level":"Level 6","classes":["Bard","Wizard"],"content":["You create an illusion of an object, a creature, or some other visible phenomenon within range that activates when a specific trigger occurs. The illusion is imperceptible until then. It must be no larger than a 30-foot Cube, and you decide when you cast the spell how the illusion behaves and what sounds it makes. This scripted performance can last up to 5 minutes.","When the trigger you specify occurs, the illusion springs into existence and performs in the manner you described. Once the illusion finishes performing, it disappears and remains dormant for 10 minutes, after which the illusion can be activated again.","The trigger can be as general or as detailed as you like, though it must be based on visual or audible phenomena that occur within 30 feet of the area. For example, you could create an illusion of yourself to appear and warn off others who attempt to open a trapped door.","Physical interaction with the image reveals it to be illusory, since things can pass through it. A creature that takes the Study action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and any noise it makes sounds hollow to the creature."]},{"name":"Project Image","type":"Illusion","casting":"Action","range":"500 miles","components":"V, S, M (a statuette of yourself worth 5+ GP)","duration":"Concentration, up to 1 day","level":"Level 7","classes":["Bard","Wizard"],"content":["You create an illusory copy of yourself that lasts for the duration. The copy can appear at any location within range that you have seen before, regardless of intervening obstacles. The illusion looks and sounds like you, but it is intangible. If the illusion takes any damage, it disappears, and the spell ends.","You can see through the illusion's eyes and hear through its ears as if you were in its space. As a Magic action, you can move it up to 60 feet and make it gesture, speak, and behave in whatever way you choose. It mimics your mannerisms perfectly.","Physical interaction with the image reveals it to be illusory, since things can pass through it. A creature that takes the Study action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and any noise it makes sounds hollow to the creature."]},{"name":"Protection from Energy","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S","duration":"Concentration, up to 1 hour","level":"Level 3","classes":["Cleric","Druid","Ranger","Sorcerer","Wizard"],"content":["For the duration, the willing creature you touch has Resistance to one damage type of your choice: Acid, Cold, Fire, Lightning, or Thunder."]},{"name":"Protection from Evil and Good","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S, M (a flask of Holy Water worth 25+ GP, which the spell consumes)","duration":"Concentration up to 10 minutes","level":"Level 1","classes":["Cleric","Druid","Paladin","Warlock","Wizard"],"content":["Until the spell ends, one willing creature you touch is protected against creatures that are Aberrations, Celestials, Elementals, Fey, Fiends, or Undead. The protection grants several benefits. Creatures of those types have Disadvantage on attack rolls against the target. The target also can't be possessed by or gain the Charmed or Frightened conditions from them. If the target is already possessed, Charmed, or Frightened by such a creature, the target has Advantage on any new saving throw against the relevant effect."]},{"name":"Protection from Poison","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S","duration":"1 hour","level":"Level 2","classes":["Cleric","Druid","Paladin","Ranger"],"content":["You touch a creature and end the Poisoned condition on it. For the duration, the target has Advantage on saving throws to avoid or end the Poisoned condition, and it has Resistance to Poison damage."]},{"name":"Purify Food and Drink","type":"Transmutation","casting":"Action or Ritual","range":"10 feet","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Cleric","Druid","Paladin"],"content":["You remove poison and rot from nonmagical food and drink in a 5-foot-radius Sphere centered on a point within range."]},{"name":"Raise Dead","type":"Necromancy","casting":"1 hour","range":"Touch","components":"V, S, M (a diamond worth 500+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 5","classes":["Bard","Cleric","Paladin"],"content":["With a touch, you revive a dead creature if it has been dead no longer than 10 days and it wasn't Undead when it died.","The creature returns to life with 1 Hit Point. This spell also neutralizes any poisons that affected the creature at the time of death.","This spell closes all mortal wounds, but it doesn't restore missing body parts. If the creature is lacking body parts or organs integral for its survival-its head, for instance-the spell automatically fails.","Coming back from the dead is an ordeal. The target takes a -4 penalty to D2O Tests. Every time the target finishes a Long Rest, the penalty is reduced by 1 until it becomes 0."]},{"name":"Rary's Telepathic Bond","type":"Divination","casting":"Action or Ritual","range":"30 feet","components":"V, S, M (two eggs)","duration":"1 hour","level":"Level 5","classes":["Bard","Wizard"],"content":["You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures that can't communicate in any languages aren't affected by this spell.","Until the spell ends, the targets can communicate telepathically through the bond whether or not they share a language. The communication is possible over any distance, though it can't extend to other planes of existence."]},{"name":"Ray of Enfeeblement","type":"Necromancy","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Warlock","Wizard"],"content":["A beam of enervating energy shoots from you toward a creature within range. The target must make a Constitution saving throw. On a successful save, the target has Disadvantage on the next attack roll it makes until the start of your next turn.","On a failed save, the target has Disadvantage on Strength-based D20 Tests for the duration. During that time, it also subtracts 1d8 from all its damage rolls. The target repeats the save at the end of each of its turns, ending the spell on a success."]},{"name":"Ray of Frost","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Sorcerer","Wizard"],"content":["A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 Cold damage, and its Speed is reduced by 10 feet until the start of your next turn.","***Cantrip Upgrade.*** The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8)."]},{"name":"Ray of Sickness","type":"Necromancy","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["You shoot a greenish ray at a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 Poison damage and has the Poisoned condition until the end of your next turn.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 1."]},{"name":"Regenerate","type":"Transmutation","casting":"1 minute","range":"Touch","components":"V, S, M (a prayer wheel)","duration":"1 hour","level":"Level 7","classes":["Bard","Cleric","Druid"],"content":["A creature you touch regains 4d8 + 15 Hit Points. For the duration, the target regains 1 Hit Point at the start of each of its turns, and any severed body parts regrow after 2 minutes."]},{"name":"Reincarnate","type":"Necromancy","casting":"1 hour","range":"Touch","components":"V, S, M (rare oils worth 1,000+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 5","classes":["Druid"],"content":["You touch a dead Humanoid or a piece of one. If the creature has been dead no longer than 10 days, the spell forms a new body for it and calls the soul to enter that body. Roll 1d10 and consult the table below to determine the body's species, or the DM chooses another playable species.","The reincarnated creature makes any choices that a species' description offers, and the creature recalls its former life. It retains the capabilities it had in its original form, except it loses the traits of its previous species and gains the traits of its new one."],"tables":[{"sizes":[0.15,0.85],"header":[["1d10","Species"]],"body":[["1","Aasimar"],["2","Dragonborn"],["3","Dwarf"],["4","Elf"],["5","Gnome"],["6","Goliath"],["7","Halfling"],["8","Human"],["9","Orc"],["10","Tiefling"]]}]},{"name":"Remove Curse","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S","duration":"Instantaneous","level":"Level 3","classes":["Cleric","Paladin","Warlock","Wizard"],"content":["At your touch, all curses affecting one creature or object end. If the object is a cursed magic item, its curse remains, but the spell breaks its owner's Attunement to the object so it can be removed or discarded."]},{"name":"Resistance","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S","duration":"Concentration, up to 1 minute","level":"Cantrip","classes":["Cleric","Druid"],"content":["You touch a willing creature and choose a damage type: Acid, Bludgeoning, Cold, Fire, Lightning, Necrotic, Piercing, Poison, Radiant, Slashing, or Thunder. When the creature takes damage of the chosen type before the spell ends, the creature reduces the total damage taken by 1d4. A creature can benefit from this spell only once per turn."]},{"name":"Resurrection","type":"Necromancy","casting":"1 hour","range":"Touch","components":"V, S, M (a diamond worth 1,000+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 7","classes":["Bard","Cleric"],"content":["With a touch, you revive a dead creature that has been dead for no more than a century, didn't die of old age, and wasn't Undead when it died.","The creature returns to life with all its Hit Points. This spell also neutralizes any poisons that affected the creature at the time of death. This spell closes all mortal wounds and restores any missing body parts.","Coming back from the dead is an ordeal. The target takes a -4 penalty to D2O Tests. Every time the target finishes a Long Rest, the penalty is reduced by 1 until it becomes 0.","Casting this spell to revive a creature that has been dead for 365 days or longer taxes you. Until you finish a Long Rest, you can't cast spells again, and you have Disadvantage on D20 Tests."]},{"name":"Reverse Gravity","type":"Transmutation","casting":"Action","range":"100 feet","components":"V, S, M (a lodestone and iron filings)","duration":"Concentration, up to 1 minute","level":"Level 7","classes":["Druid","Sorcerer","Wizard"],"content":["This spell reverses gravity in a 50-foot-radius, 100-foot high Cylinder centered on a point within range. All creatures and objects in that area that aren't anchored to the ground fall upward and reach the top of the Cylinder. A creature can make a Dexterity saving throw to grab a fixed object it can reach, thus avoiding the fall upward.","If a ceiling or an anchored object is encountered in this upward fall, creatures and objects strike it just as they would during a downward fall. If an affected creature or object reaches the Cylinder's top without striking anything, it hovers there for the duration. When the spell ends, affected objects and creatures fall downward."]},{"name":"Revivify","type":"Necromancy","casting":"Action","range":"Touch","components":"V, S, M (a diamond worth 300+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 3","classes":["Cleric","Druid","Paladin","Ranger"],"content":["You touch a creature that has died within the last minute. That creature revives with 1 Hit Point. This spell can't revive a creature that has died of old age, nor does it restore any missing body parts."]},{"name":"Rope Trick","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (a segment of rope)","duration":"1 hour","level":"Level 2","classes":["Wizard"],"content":["You touch a rope. One end of it hovers upward until the rope hangs perpendicular to the ground or the rope reaches a ceiling. At the rope's upper end, an Invisible 3-foot-by-5-foot portal opens to an extradimensional space that lasts until the spell ends. That space can be reached by climbing the rope, which can be pulled into or dropped out of it.","The space can hold up to eight Medium or smaller creatures. Attacks, spells, and other effects can't pass into or out of the space, but creatures inside it can see through the portal. Anything inside the space drops out when the spell ends."]},{"name":"Sacred Flame","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Cleric"],"content":["Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 Radiant damage. The target gains no benefit from Half Cover or Three-Quarters Cover for this save.","***Cantrip Upgrade.*** The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8)."]},{"name":"Sanctuary","type":"Abjuration","casting":"Bonus Action","range":"30 feet","components":"V S, M (a shard of glass from a mirror)","duration":"1 minute","level":"Level 1","classes":["Cleric"],"content":["You ward a creature within range. Until the spell ends, any creature who targets the warded creature with an attack roll or a damaging spell must succeed on a Wisdom saving throw or either choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from areas of effect. The spell ends if the warded creature makes an attack roll, casts a spell, or deals damage."]},{"name":"Scorching Ray","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Level 2","classes":["Sorcerer","Wizard"],"content":["You hurl three fiery rays. You can hurl them at one target within range or at several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 Fire damage.","***Using a Higher-Level Spell Slot.*** You create one additional ray for each spell slot level above 2."]},{"name":"Scrying","type":"Divination","casting":"10 minutes","range":"Self","components":"V, S, M (a focus worth 1,000+ GP, such as a crystal ball, mirror, or water-filled font)","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Bard","Cleric","Druid","Warlock","Wizard"],"content":["You can see and hear a creature you choose that is on the same plane of existence as you. The target makes a Wisdom saving throw, which is modified (see the tables below) by how well you know the target and the sort of physical connection you have to it. The target doesn't know what it is making the save against, only that it feels uneasy.","On a successful save, the target isn't affected, and you can't use this spell on it again for 24 hours.","On a failed save, the spell creates an Invisible, intangible sensor within 10 feet of the target. You can see and hear through the sensor as if you were there. The sensor moves with the target, remaining within 10 feet of it for the duration. If something can see the sensor, it appears as a luminous orb about the size of your fist.","Instead of targeting a creature, you can target a location you have seen. When you do so, the sensor appears at that location and doesn't move."],"tables":[{"sizes":[0.7,0.3],"header":[["Your Knowledge of the Target is ...","Save Modifier"]],"body":[["Secondhand (heard of the target)","+5"],["Firsthand (met the target)","+0"],["Extensive (know the target well)","-5"]]},{"sizes":[0.7,0.3],"header":[["Your Have the Target's ...","Save Modifier"]],"body":[["Picture or other likeness","-2"],["Garment or other possession","-4"],["Body part, lock of hair, or bit of nail","-10"]]}]},{"name":"Seeming","type":"Illusion","casting":"Action","range":"30 feet","components":"V, S","duration":"8 hours","level":"Level 5","classes":["Bard","Sorcerer","Wizard"],"content":["You give an illusory appearance to each creature of your choice that you can see within range. An unwilling target can make a Charisma saving throw and if it succeeds, it is unaffected by this spell.","You can give the same appearance or different ones to the targets. The spell can change the appearance of the targets' bodies and equipment. You can make each creature seem 1 foot shorter or taller and appear heavier or lighter. A target's new appearance must have the same basic arrangement of limbs as the target, but the extent of the illusion is otherwise up to you. The spell lasts for the duration.","The changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to a creature's outfit, objects pass through the hat.","A creature that takes the Study action to examine a target can make an Intelligence (Investigation) check against your spell save DC. If it succeeds, it becomes aware that the target is disguised."]},{"name":"Sending","type":"Divination","casting":"Action","range":"Unlimited","components":"V, S, M (a copper wire)","duration":"Instantaneous","level":"Level 3","classes":["Bard","Cleric","Wizard"],"content":["You send a short message of 25 words or fewer to a creature you have met or a creature described to you by someone who has met it. The target hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables targets to understand the meaning of your message.","You can send the message across any distance and even to other planes of existence, but if the target is on a different plane than you, there is a 5 percent chance that the message doesn't arrive. You know if the delivery fails.","Upon receiving your message, a creature can block your ability to reach it again with this spell for 8 hours. If you try to send another message during that time, you learn that you are blocked, and the spell fails."]},{"name":"Searing Smite","type":"Evocation","casting":"Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"1 minute","level":"Level 1","classes":["Paladin"],"content":["As you hit the target, it takes an extra 1d6 Fire damage from the attack. At the start of each of its turns until the spell ends, the target takes 1d6 Fire damage and then makes a Constitution saving throw. On a failed save, the spell continues. On a successful save, the spell ends.","***Using a Higher-Level Spell Slot.*** All the damage increases by 1d6 for each spell slot level above 1."]},{"name":"See Invisibility","type":"Divination","casting":"Action","range":"Self","components":"V, S, M (a pinch of talc)","duration":"1 hour","level":"Level 2","classes":["Bard","Sorcerer","Wizard"],"content":["For the duration, you see creatures and objects that have the Invisible condition as if they were visible, and you can see into the Ethereal Plane. Creatures and objects there appear ghostly."]},{"name":"Sequester","type":"Transmutation","casting":"Action","range":"Touch","components":"V S, M (gem dust worth 5,000+ GP which the spell consumes)","duration":"Until dispelled","level":"Level 7","classes":["Wizard"],"content":["With a touch, you magically sequester an object or a willing creature. For the duration, the target has the Invisible condition and can't be targeted by Divination spells, detected by magic, or viewed remotely with magic.","If the target is a creature, it enters a state of suspended animation; it has the Unconscious condition, doesn't age, and doesn't need food, water, or air.","You can set a condition for the spell to end early. The condition can be anything you choose, but it must occur or be visible within 1 mile of the target. Examples include \\"after 1,000 years\\" or \\"when the tarrasque awakens\\". This spell also ends if the target takes any damage."]},{"name":"Shapechange","type":"Transmutation","casting":"Action","range":"Self","components":"V, S, M (a jade circlet worth 1,500+ GP)","duration":"Concentration, up to 1 hour","level":"Level 9","classes":["Druid","Wizard"],"content":["You shape-shift into another creature for the duration or until you take a Magic action to shape-shift into a different eligible form. The new form must be of a creature that has a Challenge Rating no higher than your level or Challenge Rating. You must have seen the sort of creature before, and it can't be a Construct or an Undead.","When you shape-shift, you gain a number of Temporary Hit Points equal to the Hit Points of the form. The spell ends early if you have no Temporary Hit Points left.","Your game statistics are replaced by the stat block of the chosen form, but you retain your creature type; alignment; personality; Intelligence, Wisdom, and Charisma scores; Hit Points; Hit Point Dice; proficiencies; and ability to communicate. If you have the Spellcasting feature, you retain it too.","Upon shape-shifting, you determine whether your equipment drops to the ground or changes in size and shape to fit the new form while you're in it."]},{"name":"Shatter","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S, M (a chip of mica)","duration":"Instantaneous","level":"Level 2","classes":["Bard","Sorcerer","Wizard"],"content":["A loud noise erupts from a point of your choice within range. Each creature in a 10-foot-radius Sphere centered there makes a Constitution saving throw taking 3d8 Thunder damage on a failed save or half as much damage on a successful one. A Construct has Disadvantage on the save.","A nonmagical object that isn't being worn or carried also takes the damage if it's in the spell's area.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 2."]},{"name":"Shield","type":"Abjuration","casting":"Reaction, which you take when you are hit by an attack roll or targeted by the *Magic Missile* spell","range":"Self","components":"V, S","duration":"1 round","level":"Level 1","classes":["Sorcerer","Wizard"],"content":["An imperceptible barrier of magical force protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from *Magic Missile*."]},{"name":"Shield of Faith","type":"Abjuration","casting":"Bonus Action","range":"60 feet","components":"V, S, M (a prayer scroll)","duration":"Concentration, up to 10 minutes","level":"Level 1","classes":["Cleric","Paladin"],"content":["A shimmering field surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration."]},{"name":"Shillelagh","type":"Transmutation","casting":"Bonus Action","range":"Self","components":"V, S, M (mistletoe)","duration":"1 minute","level":"Cantrip","classes":["Druid"],"content":["A Club or Quarterstaffyou are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. If the attack deals damage, it can be Force damage or the weapon's normal damage type (your choice).","The spell ends early if you cast it again or if you let go of the weapon.","***Cantrip Upgrade.*** The damage die changes when you reach levels 5 (d10), 11 (d12), and 17 (2d6)."]},{"name":"Shining Smite","type":"Transmutation","casting":"Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Paladin"],"content":["The target hit by the strike takes an extra 2d6 Radiant damage from the attack. Until the spell ends, the target sheds Bright Light in a 5-foot radius, attack rolls against it have Advantage, and it can't benefit from the Invisible condition.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 2."]},{"name":"Shocking Grasp","type":"Evocation","casting":"Action","range":"Touch","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Sorcerer","Wizard"],"content":["Lightning springs from you to a creature that you try to touch. Make a melee spell attack against the target. On a hit, the target takes 1d8 Lightning damage, and it can't make Opportunity Attacks until the start of its next turn.","***Cantrip Upgrade.*** The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8)."]},{"name":"Silence","type":"Illusion","casting":"Action or Ritual","range":"120 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 2","classes":["Bard","Cleric","Ranger"],"content":["For the duration, no sound can be created within or pass through a 20-foot-radius Sphere centered on a point you choose within range. Any creature or object entirely inside the Sphere has Immunity to Thunder damage, and creatures have the Deafened condition while entirely inside it. Casting a spell that includes a Verbal component is impossible there."]},{"name":"Silent Image","type":"Illusion","casting":"Action","range":"60 feet","components":"V, S, M (a bit of fleece)","duration":"Concentration, up to 10 minutes","level":"Level 1","classes":["Bard","Sorcerer","Wizard"],"content":["You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot Cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn't accompanied by sound, smell, or other sensory effects.","As a Magic action, you can cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking.","Physical interaction with the image reveals it to be an illusion, since things can pass through it. A creature that takes a Study action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image."]},{"fontSize":1.88,"name":"Simulacrum","type":"Illusion","casting":"12 hours","range":"Touch","components":"V, S, M (powdered ruby worth 1,500+ GP, which the spell consumes)","duration":"Until dispelled","level":"Level 7","classes":["Wizard"],"content":["You create a simulacrum of one Beast or Humanoid that is within 10 feet of you for the entire casting of the spell. You finish the casting by touching both the creature and a pile of ice or snow that is the same size as that creature, and the pile turns into the simulacrum, which is a creature. It uses the game statistics of the original creature at the time of casting, except it is a Construct, its Hit Point maximum is half as much, and it can't cast this spell.","The simulacrum is Friendly to you and creatures you designate. It obeys your commands and acts on your turn in combat. The simulacrum can't gain levels, and it can't take Short or Long Rests.","If the simulacrum takes damage, the only way to restore its Hit Points is to repair it as you take a Long Rest, during which you expend components worth 100 GP per Hit Point restored. The simulacrum must stay within 5 feet of you for the repair.","The simulacrum lasts until it drops to 0 Hit Points, at which point it reverts to snow and melts away. If you cast this spell again, any simulacrum you created with this spell is instantly destroyed."]},{"name":"Sleep","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S, M (a pinch of sand or rose petals)","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Bard","Sorcerer","Wizard"],"content":["Each creature ofyour choice in a 5-foot-radius Sphere centered on a point within range must succeed on a Wisdom saving throw or have the Incapacitated condition until the end of its next turn, at which point it must repeat the save. If the target fails the second save, the target has the Unconscious condition for the duration. The spell ends on a target if it takes damage or someone within 5 feet of it takes an action to shake it out of the spell's effect.","Creatures that don't sleep, such as elves, or that have Immunity to the Exhaustion condition automatically succeed on saves against this spell."]},{"name":"Sleet Storm","type":"Conjuration","casting":"Action","range":"150 feet","components":"V, S, M (a miniature umbrella)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Druid","Sorcerer","Wizard"],"content":["Until the spell ends, sleet falls in a 40-foot-tall, 20-foot-radius Cylinder centered on a point you choose within range. The area is Heavily Obscured, and exposed flames in the area are doused.","Ground in the Cylinder is Difficult Terrain. When a creature enters the Cylinder for the first time on a turn or starts its turn there, it must succeed on a Dexterity saving throw or have the Prone condition and lose Concentration."]},{"name":"Slow","type":"Transmutation","casting":"Action","range":"120 feet","components":"V, S, M (a drop of molasses)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Bard","Sorcerer","Wizard"],"content":["You alter time around up to six creatures of your choice in a 40-foot Cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration.","An affected target's Speed is halved, it takes a -2 penalty to AC and Dexterity saving throws, and it can't take Reactions. On its turns, it can take either an action or a Bonus Action, not both, and it can make only one attack if it takes the Attack action. If it casts a spell with a Somatic component, there is a 25 percent chance the spell fails as a result of the target making the spell's gestures too slowly.","An affected target repeats the save at the end of each of its turns, ending the spell on itself on a success,"]},{"name":"Sorcerous Burst","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Sorcerer"],"content":["You cast sorcerous energy at one creature or object within range. Make a ranged attack roll against the target. On a hit, the target takes 1d8 damage of a type you choose: Acid, Cold, Fire, Lightning, Poison, Psychic, or Thunder.","If you roll an 8 on a d8 for this spell, you can roll another d8, and add it to the damage. When you cast this spell, the maximum number of these d8s you can add to the spell's damage equals your spellcasting ability modifier.","***Cantrip Upgrade.*** The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8)."]},{"name":"Spare the Dying","type":"Necromancy","casting":"Action","range":"'15 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Cleric","Druid"],"content":["Choose a creature within range that has 0 Hit Points and isn't dead. The creature becomes Stable.","***Cantrip Upgrade.*** The range doubles when you reach levels 5 (30 feet), 11 (60 feet), and 17 (120 feet)"]},{"name":"Speak with Animals","type":"Divination","casting":"Action or Ritual","range":"Self","components":"V, S","duration":"10 minutes","level":"Level 1","classes":["Bard","Druid","Ranger","Warlock"],"content":["For the duration, you can comprehend and verbally communicate with Beasts, and you can use any of the Influence action's skill options with them.","Most Beasts have little to say about topics that don't pertain to survival or companionship, but at minimum, a Beast can give you information about nearby locations and monsters, including whatever it has perceived within the past day."]},{"name":"Speak with Dead","type":"Necromancy","casting":"Action","range":"10 feet","components":"V, S, M (burning incense)","duration":"10 minutes","level":"Level 3","classes":["Bard","Cleric","Wizard"],"content":["You grant the semblance of life to a corpse of your choice within range, allowing it to answer questions you pose. The corpse must have a mouth, and this spell fails if the deceased creature was Undead when it died. The spell also fails if the corpse was the target of this spell within the past 10 days.","Until the spell ends, you can ask the corpse up to five questions. The corpse knows only what it knew in life, including the languages it knew. Answers are usually brief, cryptic, or repetitive, and the corpse is under no compulsion to offer a truthful answer if you are antagonistic toward it or it recognizes you as an enemy. This spell doesn't return the creature's soul to its body, only its animating spirit. Thus, the corpse can't learn new information, doesn't comprehend anything that has happened since it died, and can't speculate about future events."]},{"name":"Speak with Plants","type":"Transmutation","casting":"Action","range":"Self","components":"V, S","duration":"10 minutes","level":"Level 3","classes":["Bard","Druid","Ranger"],"content":["You imbue plants in an immobile 30-foot Emanation with limited sentience and animation, giving them the ability to communicate with you and follow your simple commands. You can question plants about events in the spell's area within the past day, gaining information about creatures that have passed, weather, and other circumstances.","You can also turn Difficult Terrain caused by plant growth (such as thickets and undergrowth) into ordinary terrain that lasts for the duration. Or you can turn ordinary terrain where plants are present into Difficult Terrain that lasts for the duration.","The spell doesn't enable plants to uproot themselves and move about, but they can move their branches, tendrils, and stalks for you.","If a Plant creature is in the area, you can communicate with it as if you shared a common language."]},{"name":"Spider Climb","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (a drop of bitumen and a spider)","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Sorcerer","Warlock","Wizard"],"content":["Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and along ceilings, while leaving its hands free. The target also gains a Climb Speed equal to its Speed.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level about 2."]},{"name":"Spike Growth","type":"Transmutation","casting":"Action","range":"150 feet","components":"V, S, M (seven thorns)","duration":"Concentration, up to 10 minutes","level":"Level 2","classes":["Druid","Ranger"],"content":["The ground in a 20-foot-radius Sphere centered on a point within range sprouts hard spikes and thorns. The area becomes Difficult Terrain for the duration. When a creature moves into or within the area, it takes 2d4 Piercing damage for every 5 feet it travels.","The transformation of the ground is camouflaged to look natural. Any creature that can't see the area when the spell is cast must take a Search action and succeed on a Wisdom (Perception or Survival) check against your spell save DC to recognize the terrain as hazardous before entering it."]},{"name":"Spirit Guardians","type":"Conjuration","casting":"Action","range":"Self","components":"V, S, M (a prayer scroll)","duration":"Concentration, up to 10 minutes","level":"Level 3","classes":["Cleric"],"content":["Protective spirits flit around you in a 15-foot Emanation for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish.","When you cast this spell, you can designate creatures to be unaffected by it. Any other creature's Speed is halved in the Emanation, and whenever the Emanation enters a creature's space and whenever a creature enters the Emanation or ends its turn there, the creature must make a Wisdom saving throw. On a failed save, the creature takes 3d8 Radiant damage (if you are good or neutral) or 3d8 Necrotic damage (if you are evil). On a successful save, the creature takes half as much damage. A creature makes this save only once per turn.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 3."]},{"name":"Spiritual Weapon","type":"Evocation","casting":"Bonus Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 2","classes":["Cleric"],"content":["You create a floating, spectral force that resembles a weapon of your choice and lasts for the duration. The force appears within range in a space of your choice, and you can immediately make one melee spell attack against one creature within 5 feet of the force. On a hit, the target takes Force damage equal to 1d8 plus your spellcasting ability modifier.","As a Bonus Action on your later turns, you can move the force up to 20 feet and repeat the attack against a creature within 5 feet of it.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for every slot level above 2."]},{"name":"Staggering Smite","type":"Enchantment","casting":"Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"Instantaneous","level":"Level 4","classes":["Paladin"],"content":["The target takes an extra 4d6 Psychic damage from the attack, and the target must succeed on a Wisdom saving throw or have the Stunned condition until the end of your next turn.","***Using a Higher-Level Spell Slot.*** The extra damage increases by 1d6 for each spell slot level above 4."]},{"name":"Starry Wisp","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Bard","Druid"],"content":["You launch a mote of light at one creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d8 Radiant damage, and until the end of your next turn, it emits Dim Light in a 10-foot radius and can't benefit from the Invisible condition.","***Cantrip Upgrade.*** The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8)."]},{"name":"Steel Wind Strike","type":"Conjuration","casting":"Action","range":"30 feet","components":"S, M (a Melee weapon worth 1+ SP)","duration":"Instantaneous","level":"Level 5","classes":["Ranger","Wizard"],"content":["You flourish the weapon used in the casting and then vanish to strike like the wind. Choose up to five creatures you can see within range. Make a melee spell attack against each target. On a hit, a target takes 6d10 Force damage.","You then teleport to an unoccupied space you can see within 5 feet of one of the targets."]},{"name":"Stinking Cloud","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (a rotten egg)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Bard","Sorcerer","Wizard"],"content":["You create a 20-foot-radius Sphere of yellow, nauseating gas centered on a point within range. The cloud is Heavily Obscured. The cloud lingers in the air for the duration or until a strong wind (such as the one created by *Gust of Wind*) disperses it.","Each creature that starts its turn in the Sphere must succeed on a Constitution saving throw or have the Poisoned condition until the end of the current turn. While Poisoned in this way, the creature can't take an action or a Bonus Action."]},{"name":"Stone Shape","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (soft clay)","duration":"Instantaneous","level":"Level 4","classes":["Cleric","Druid","Wizard"],"content":["You touch a stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension and form it into any shape you like. For example, you could shape a large rock into a weapon, statue, or coffer, or you could make a small passage through a wall that is 5 feet thick. You could also shape a stone door or its frame to seal the door shut. The object you create can have up to two hinges and a latch, but finer mechanical detail isn't possible."]},{"name":"Stoneskin","type":"Transmutation","casting":"Action","range":"Touch","components":"V, S, M (diamond dust worth 100+ GP, which the spell consumes)","duration":"Concentration, up to 1 hour","level":"Level 4","classes":["Druid","Ranger","Sorcerer","Wizard"],"content":["Until the spell ends, one willing creature you touch has Resistance to Bludgeoning, Piercing, and Slashing damage."]},{"fontSize":1.9,"name":"Storm of Vengeance","type":"Conjuration","casting":"Action","range":"1 mile","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 9","classes":["Druid"],"content":["A churning storm cloud forms for the duration, centered on a point within range and spreading to a radius of 300 feet. Each creature under the cloud when it appears must succeed on a Constitution saving throw or take 2d6 Thunder damage and have the Deafened condition for the duration.","At the start of each of your later turns, the storm produces different effects, as detailed below.","***Turn 2.*** Acidic rain falls. Each creature and object under the cloud takes 4d6 Acid damage.","***Turn 3.*** You call six bolts of lightning from the cloud to strike six different creatures or objects beneath it. Each target makes a Dexterity saving throw, taking 10d6 Lightning damage on a failed save or half as much damage on a successful one.","***Turn 4.*** Hailstones rain down. Each creature under the cloud takes 2d6 Bludgeoning damage.","***Turns 5-1O.*** Gusts and freezing rain assail the area under the cloud. Each creature there takes 1d6 Cold damage. Until the spell ends, the area is Difficult Terrain and Heavily Obscured, ranged attacks with weapons are impossible there, and strong wind blows through the area."]},{"name":"Suggestion","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, M (a drop of honey)","duration":"Concentration, up to 8 hours","level":"Level 2","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You suggest a course of activity-described in no more than 25 words-to one creature you can see within range that can hear and understand you. The suggestion must sound achievable and not involve anything that would obviously deal damage to the target or it allies. For example, you could say, \\"Fetch the key to the cult's treasure vault, and give the key to me\\". Or you could say, \\"Stop fighting, leave this library peacefully, and don't return\\".","The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration or until you or your allies deal damage to the target. The Charmed target pursues the suggestion to the best of its ability. The suggested activity can continue for the entire duration, but if the suggested activity can be completed in a shorter time, the spell ends for the target upon completing it."]},{"name":"Summon Aberration","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (a pickled tentacle and an eyeball in a platinum-inlaid vialworth 400+ GP)","duration":"Concentration, up to 1 hour","level":"Level 4","classes":["Warlock","Wizard"],"content":["You call forth an aberrant spirit. It manifests in an unoccupied space that you can see within range and uses the ***Aberrant Spirit*** stat block. When you cast the spell, choose Beholderkin, Mind Flayer, or Slaad. The creature resembles an Aberration of that kind, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, it shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Aberrant Spirit","subtitle":"Medium Aberration, Neutral","AC":"11 + the spell's level","HP":"40 + 10 for each spell level above 4","Speed":"30 ft.; Fly 30 ft. (hover; Beholderkin only)","attributes":{"STR":["16","+3","+3"],"DEX":["10","+0","+0"],"CON":["15","+2","+2"],"INT":["16","+3","+3"],"WIS":["10","+0","+0"],"CHA":["6 ","-2","-2"]},"addons":{"Immunities":"Psychic","Senses":"Darkvision 60 ft., Passive Perception 10","Languages":"Deep Speech, understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Regeneration (Slaad Only).*** The spirit regains 5 Hit Points at the start of its turn if it has at least 1 Hit Point.","***Whispering Aura (Mind Flayer Only).*** At the start of each of the spirit's turns, the spirit emits psionic energy if it doesn't have the Incapacitated condition. Wisdom *Saving Throw:* DC equals your spell save DC, each creature (other than you) within 5 feet of the spirit. *Failure:* 2d6 Psychic damage."],"Actions":["***Multiattack.*** The spirit makes a number of attacks equal to half this spell's level (round down).","***Claw (Slaad Only).*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* '1d10 + 3 + the spell's level Slashing damage, and the target can't regain Hit Points until the start of the spirit's next turn.","***Eye Ray (Beholderkin Only).*** *Ranged Attack Roll:* Bonus equals your spell attack modifier, range 150 ft. Hit; 1d8 + 3 + the spell's level Psychic damage.","***Psychic Slam (Mind Flayer Only).*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d8 + 3 + the spell's level Psychic damage."]}},{"name":"Summon Beast","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (a feather, tuft of fur, and fish tail inside a gilded acorn worth 200+ GP)","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Druid","Ranger"],"content":["You call forth a bestial spirit. It manifests in an unoccupied space that you can see within range and uses the ***Bestial Spirit*** stat block. When you cast the spell, choose an environment: Air, Land, or Water. The creature resembles an animal of your choice that is native to the chosen environment, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Bestial Spirit","subtitle":"Small Beast, Neutral","AC":"11 + the spell's level","HP":"20 (Air only) or 30 (Land and Water only) + 5 for each spell level above 2","Speed":"30 ft.; Climb 30 ft. (Land only); Fly 60 ft. (Air only); Swim 30 ft. (Water only)","attributes":{"STR":["18","+4","+4"],"DEX":["11","+0","+0"],"CON":["16","+3","+3"],"INT":["4","-3","-3"],"WIS":["14","+2","+2"],"CHA":["5","-3","-3"]},"addons":{"Senses":"Darkvision 60 ft., Passive Perception 12","Languages":"understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Flyby (Air Only).*** The spirit doesn't provoke Opportunity Attacks when it flies out of an enemy's reach.","***Pack Tactics (Land and Water Only).*** The spirit has Advantage on an attack roll against a creature if at least one of the spirit's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition.","***Water Breathing (Water Only).*** The spirit can breathe only underwater."],"Actions":["***Multiattack.*** The spirit makes a number of Rend attacks equal to half this spell's level (round down).","***Rend.*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d8 + 4 + the spell's level Piercing damage."]}},{"name":"Summon Celestial","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (a reliquary worth 500+ GP)","duration":"Concentration, up to 1 hour","level":"Level 5","classes":["Cleric","Paladin"],"content":["You call forth a Celestial spirit. It manifests in an angelic form in an unoccupied space that you can see within range and uses the ***Celestial Spirit*** stat block. When you cast the spell, choose Avenger or Defender. Your choice determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Celestial Spirit","subtitle":"Large Celestial, Neutral","AC":"11 + the spell's level + 2 (Defender only)","HP":"40 + 10 for each spell level above 5","Speed":"30 ft., Fly 40 ft.","attributes":{"STR":["16","+3","+3"],"DEX":["14","+2","+2"],"CON":["16","+3","+3"],"INT":["10","+0","+0"],"WIS":["14","+2","+2"],"CHA":["16","+3","+3"]},"addons":{"Resistances":"Radiant","Immunities":"Charmed, Frightened","Senses":"Darkvision 60 ft., Passive Perception 12","Languages":"Celestial, understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Actions":["***Multiattack.*** The spirit makes a number of attacks equal to half this spell's level (round down).","***Radiant Bow (Avenger Only).*** *Ranged Attack Roll:* Bonus equals your spell attack modifier, range 600 ft. *Hit:* 2d6 + 2 + the spell's level Radiant damage.","***Radiant Mace (Defender Only).*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d10 + 3 + the spell's level Radiant damage, and the spirit can choose itself or another creature it can see within 10 feet of the target. The chosen creature gains 1d10 Temporary Hit Points.","***Healing Touch (1/Day).*** The spirit touches another creature. The target regains Hit Points equal to 2d8 + the spell's level."]}},{"name":"Summon Construct","type":"Conjuration","casting":"Action","range":"90 feet","components":"V S, M (a lockbox worth 400+ GP)","duration":"Concentration, up to 1 hour","level":"Level 4","classes":["Wizard"],"content":["You call forth the spirit of a Construct. It manifests in an unoccupied space that you can see within range and uses the ***Construct Spirit*** stat block. When you cast the spell, choose a material: Clay, Metal, or Stone. The creature resembles an animate statue (you determine the appearance) made of the chosen material, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Construct Spirit","subtitle":"Medium Construct, Neutral","AC":"13 + the spell's level","HP":"40 + 15 for each spell level above 4","Speed":"30 ft.","attributes":{"STR":["18","+4","+4"],"DEX":["10","+0","+0"],"CON":["18","+4","+4"],"INT":["14","+2","+2"],"WIS":["11","+0","+0"],"CHA":[" 5","-3","-3"]},"addons":{"Resistances":"Poison","Immunities":"Charmed, Exhaustion, Frightened, Paralyzed, Poisoned","Senses":"Darkvision 60 ft., Passive Perception 10","Languages":"Understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Heated Body (Metal Only).*** A creature that hits the spirit with a melee attack or that starts its turn in a grapple with the spirit takes 1d10 Fire damage.","***Stony Lethargy (Stone Only).*** When a creature starts its turn within 10 feet of the spirit, the spirit can target it with magical energy if the spirit can see it. *Wisdom Saving Throw:* DC equals your spell save DC, the target. *Failure:* Until the start of its next turn, the target can't make Opportunity Attacks, and its Speed is halved."],"Actions":["***Multiattack.*** The spirit makes a number of Slam attacks equal to half this spell's level (round down).","***Slam.*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d8 + 4 + the spell's level Bludgeoning damage."],"Reaction":["***Berserk Lashing (Clay Only).*** *Trigger:* The spirit takes damage from a creature. *Response:* The spirit makes a Slam attack against that creature if possible, or the spirit moves up to half its Speed toward that creature without provokin g Opportunity Attacks."]}},{"name":"Summon Dragon","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S, M (an object with the image of a dragon engraved on it worth 500+ GP)","duration":"Concentration, up to 1 hour","level":"Level 5","classes":["Wizard"],"content":["You call forth a Dragon spirit. It manifests in an unoccupied space that you can see within range and uses the ***Draconic Spirit*** stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Draconic Spirit","subtitle":"Large Dragon, Neutral","AC":"14 + the spell's level","HP":"50 + 10 for each spell level above 5","Speed":"30 ft., Fly 60 ft., Swim 30 ft.","attributes":{"STR":["19","+4","+4"],"DEX":["14","+2","+2"],"CON":["17","+3","+3"],"INT":["10","+0","+0"],"WIS":["14","+2","+2"],"CHA":["14","+2","+2"]},"addons":{"Resistances":"Acid, Cold, Fire, Lightning, Poison","Immunities":"Charmed, Frightened, Poisoned","Senses":"Blindsight 30 ft., Darkvision 60 ft., Passive Perception 12","Languages":"Draconic, understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Shared Resistances.*** When you summon the spirit, choose one of its Resistances. You have Resistance to the chosen damage type until the spell ends."],"Actions":["***Multiattack.*** The spirit makes a number of Rend attacks equal to half the spell's level (round down), and it uses Breath Weapon.","***Rend.*** *Melee Attack:* Bonus equals your spell attack modifier, reach 10 feet. *Hit:* 1d6 + 4 + the spell's level Piercing damage.","***Breath Weapon.*** *Dexterity Saving Throw:* DC equals your spell save DC, each creature in a 30-foot Cone. *Failure:* 2d6 damage of a type this spirit has Resistance to (your choice when you cast the spell). *Success:* Half damage."]}},{"name":"Summon Elemental","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (air, a pebble, ash, and water inside a gold-inlaid vial worth 400+ GP)","duration":"Concentration, up to 1 hour","level":"Level 4","classes":["Druid","Ranger","Wizard"],"content":["You call forth an Elemental spirit. It manifests in an unoccupied space that you can see within range and uses the ***Elemental Spirit*** stat block. When you cast the spell, choose an element: Air, Earth, Fire, or Water. The creature resembles a bipedal form wreathed in the chosen element, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Elemental Spirit","subtitle":"Medium Elemental, Neutral","AC":"11 + the spell's level","HP":"50 + 10 for each spell level above 4","Speed":"40 ft.; Burrow 40 ft. (Earth only); Fly 40 ft. (hover; Air only); Swim 40 ft. (Water only)","attributes":{"STR":["18","+4","+4"],"DEX":["15","+2","+2"],"CON":["17","+3","+3"],"INT":["4","-3","-3"],"WIS":["10","+0","+0"],"CHA":["16","+3","+3"]},"addons":{"Resistances":"Acid (Water only), Lightning and Thunder (Air only), Piercing and Slashing (Earth only)","Immunities":"Fire (Fire only), Poison; Exhaustion, Paralyzed, Petrified, Poisoned","Senses":"Darkvision 60 ft., Passive Perception 10","Languages":"Primordial, understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Amorphous Form (Air, Fire, ond Water Only).*** The spirit can move through a space as narrow as 1 inch wide without it counting as Difficult Terrain."],"Actions":["***Multiattack.*** The spirit makes a number of Slam attacks equal to half this spell's level (round down).","***Slam.*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d10 + 4 + the spell's level Bludgeoning (Earth only), Cold (Water only), Lightning (Air only), or Fire (Fire only) damage."]}},{"name":"Summon Fey","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (a gilded flower worth 300+ GP)","duration":"Concentration, up to 1 hour","level":"Level 3","classes":["Druid","Ranger","Warlock","Wizard"],"content":["You call forth a Fey spirit. It manifests in an unoccupied space that you can see within range and uses the ***Fey Spirit*** stat block. When you cast the spell, choose a mood: Fuming, Mirthful, or Tricksy. The creature resembles a Fey creature of your choice marked by the chosen mood, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Fey Spirit","subtitle":"Small Fey, Neutral","AC":"12 + the spell's level","HP":"30 + 10 for each spell level above 3","Speed":"30 ft., Fly 30 ft.","attributes":{"STR":["13","+1","+1"],"DEX":["16","+3","+3"],"CON":["14","+2","+2"],"INT":["14","+2","+2"],"WIS":["11","+0","+0"],"CHA":["16","+3","+3"]},"addons":{"Immunities":"Charmed","Senses":"Darkvision 60 ft., Passive Perception 10","Languages":"Sylvan, understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Actions":["***Multiattack.*** The spirit makes a number of Fey Blade attacks equal to half this spell's level (round down)","***Fey Blade.*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 2d6 + 3 + the spell's level Force damage."],"Bonus Actions":["***Fey Step.*** The spirit magically teleports up to 30 feet to an unoccupied space it can see. Then one of the following effects occurs, based on the spirit's chosen mood:","***Fuming.*** The spirit has Advantage on the next attack roll it makes before the end of this turn.","***Mirthful.*** *Wisdom Saving Throw:* DC equals your spell save DC, one creature the spirit can see within 10 feet of itself. *Failure:* The target is Charmed by you and the spirit for 1 minute or until the target takes any damage.","***Tricksy.*** The spirit fills a 10-foot Cube within 5 feet of it with magical Darkness, which lasts until the end of its next turn."]}},{"fontSize":1.89,"name":"Summon Fiend","type":"Conjuration","casting":"Action","range":"90 feet","components":"V, S, M (a bloody vial worth 600+ GP)","duration":"Concentration, up to 1 hour","level":"Level 6","classes":["Warlock","Wizard"],"content":["You call forth a fiendish spirit. It manifests in an unoccupied space that you can see within range and uses the ***Fiendish Spirit*** stat block. When you cast the spell, choose Demon, Devil, or Yugoloth. The creature resembles a Fiend of the chosen type, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Fiendish Spirit","subtitle":"Large Fiend, Neutral","AC":"12 + the spell's level","HP":"50 (Demon only) or 40 (Devil only) or 60 (Yugoloth only) + 15 for each spell level above 6","Speed":"40 ft.; Climb 40 ft. (Demon only); Fly 60 ft. (Devil only)","attributes":{"STR":["13","+1","+1"],"DEX":["16","+3","+3"],"CON":["15","+2","+2"],"INT":["10","+0","+0"],"WIS":["l0","+0","+0"],"CHA":["16","+3","+3"]},"addons":{"Resistances":"Fire","Immunities":"Poison; Poisoned","Senses":"Darkvision 60 ft., Passive Perception 10","Languages":"Abyssal, Infernal, Telepathy 60 ft.","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Death Throes (Demon Only).*** When the spirit drops to 0 Hit Points or the spell ends, the spirit explodes. *Dexterity Saving Throw:* DC equals your spell save DC, each creature in a 10-foot Emanation originating from the spirit. *Failure:* 2d10 plus this spell's level Fire damage. *Success:* Half damage.","***Devil's Sight (Devil Only).*** Magical Darkness doesn't impede the spirit's Darkvision.","***Magic Resistance.*** The spirit has Advantage on saving throws against spells and other magical effects."],"Actions":["***Multiattack.*** The spirit makes a number of attacks equal to half this spell's level (round down).","***Bite (Demon Only).*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d12 + 3 + the spell's level Necrotic damage.","***Claws (Yugoloth Only).*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d8 + 3 + the spell's level Slashing damage. Immediately after the attack hits or misses, the spirit can teleport up to 30 feet to an unoccupied space it can see.","***Fiery Strike (Devil Only).*** *Melee or Ranged Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. or range 150 ft. *Hit:* 2d6 + 3 + the spell's level Fire damage."]}},{"name":"Summon Undead","type":"Necromancy","casting":"Action","range":"90 feet","components":"V, S, M (a gilded skull worth 300+ GP)","duration":"Concentration, up to 1 hour","level":"Level 3","classes":["Warlock","Wizard"],"content":["You call forth an Undead spirit. It manifests in an unoccupied space that you can see within range and uses the ***Undead Spirit*** stat block. When you cast the spell, choose the creature's form: Ghostly, Putrid, or Skeletal. The spirit resembles an Undead creature with the chosen form, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends.","The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger.","***Using a Higher-Level Spell Slot.*** Use the spell slot's level for the spell's level in the stat block."],"statblock":{"title":"Undead Spirit","subtitle":"Medium Undead, Neutral","AC":"11 + the spell's level","HP":"30 (Ghostly and Putrid only) or 20 (Skeletal only) + 10 for each spell level above 3","Speed":"30 ft.; Fly 40 ft. (hover; Ghostly only)","attributes":{"STR":["12","+1","+1"],"DEX":["16","+3","+3"],"CON":["15","+2","+2"],"INT":["4","-3","-3"],"WIS":["10","+0","+0"],"CHA":["9","-1","-1"]},"addons":{"Immunities":"Necrotic, Poison; Exhaustion, Frightened, Paralyzed, Poisoned","Senses":"Darkvision 60 ft., Passive Perception 10","Languages":"Understands the languages you know","CR":"None (XP 0; PB equals your Proficiency Bonus)"},"Traits":["***Festering Aura (Putrid Only).*** *Constitution Saving Throw:* DC equals your spell save DC, any creature (other than you) that starts its turn within a 5-foot Emanation originating from the spirit. *Failure:* The creature has the Poisoned condition until the start of its next turn.","***Incorporeal Passage (Ghostly Only).*** The spirit can move through other creatures and objects as if they were Difficult Terrain. If it ends its turn inside an object, it is shunted to the nearest unoccupied space and takes 1d10 Force damage for every 5 feet traveled."],"Actions":["***Multiattack.*** The spirit makes a number of attacks equal to half this spell's level (round down).","***Deathly Touch (Ghostly Only).*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d8 + 3 + the spell's level Necrotic damage, and the target has the Frightened condition until the end of its next turn.","***Grave Bolt (Skeletal Only).*** *Ranged Attack Roll:* Bonus equals your spell attack modifier, range 150 ft. *Hit:* 2d4 + 3 + the spell's level Necrotic damage.","***Rotting Claw (Putrid Only).*** *Melee Attack Roll:* Bonus equals your spell attack modifier, reach 5 ft. *Hit:* 1d6 + 3 + the spell's level Slashing damage. If the target has the Poisoned condition, it has the Paralyzed condition until the end ofits next turn."]}},{"name":"Sunbeam","type":"Evocation","casting":"Action","range":"Self","components":"V, S, M (a magnifying glass)","duration":"Concentration, up to 1 minute","level":"Level 6","classes":["Cleric","Druid","Sorcerer","Wizard"],"content":["You launch a sunbeam in a 5-foot-wide, 60-foot-long Line. Each creature in the Line makes a Constitution saving throw. On a failed save, a creature takes 6d8 Radiant damage and has the Blinded condition until the start of your next turn. On a successful save, it takes half as much damage only.","Until the spell ends, you can take a Magic action to create a new Line of radiance.","For the duration, a mote of brilliant radiance shines above you. It sheds Bright Light in a 30-foot radius and Dim Light for an additional 3O feet. This light is sunlight."]},{"name":"Sunburst","type":"Evocation","casting":"Action","range":"'150 feet","components":"V, S, M (a piece of sunstone)","duration":"Instantaneous","level":"Level 8","classes":["Cleric","Druid","Sorcerer","Wizard"],"content":["Brilliant sunlight flashes in a 60-foot-radius Sphere centered on a point you choose within range. Each creature in the Sphere makes a Constitution saving throw. On a failed save, a creature takes 12d6 Radiant damage and has the Blinded condition for 1 minute. On a successful save, it takes half as much damage only.","A creature Blinded by this spell makes another Constitution saving throw at the end of each of its turns, ending the effect on itself on a success.","This spell dispels Darkness in its area that was created by any spell."]},{"name":"Swift Quiver","type":"Transmutation","casting":"Bonus Action","range":"Self","components":"V, S, M (a Quiver worth 1+ GP)","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Ranger"],"content":["When you cast the spell and as a Bonus Action until it ends, you can make two attacks with a weapon that fires Arrows or Bolts, such as a Longbow or a Light Crossbow. The spell magically creates the ammunition needed for each attack. Each Arrow or Bolt created by the spell deals damage like a nonmagical piece of ammunition of its kind and disintegrates immediately after it hits or misses."]},{"name":"Symbol","type":"Abjuration","casting":"1 minute","range":"Touch","components":"V, S, M (powdered diamond worth 1,000+ GP, which the spell consumes)","duration":"Until dispelled or triggered","level":"Level 7","classes":["Bard","Cleric","Druid","Wizard"],"content":["You inscribe a harmful glyph either on a surface (such as a section of floor or wall) or within an object that can be closed (such as a book or chest). The glyph can cover an area no larger than 10 feet in diameter. If you choose an object, it must remain in place; if it is moved more than 10 feet from where you cast this spell, the glyph is broken, and the spell ends without being triggered.","The glyph is nearly imperceptible and requires a successful Wisdom (Perception) check against your spell save DC to notice.","When you inscribe the glyph, you set its trigger and choose which effect the symbol bears: Death, Discord, Fear, Pain, Sleep, or Stunning. Each one is explained below.","***Set the Trigger.*** You decide what triggers the glyph when you cast the spell. For glyphs inscribed on a surface, common triggers include touching or stepping on the glyph, removing another object covering it, or approaching within a certain distance of it. For glyphs inscribed within an object, common triggers include opening that object or seeing the glyph.","You can refine the trigger so that only creatures of certain types activate it (for example, the glyph could be set to affect Aberrations). You can also set conditions for creatures that don't trigger the glyph, such as those who say a certain password.","Once triggered, the glyph glows, filling a 60-foot-radius Sphere with Dim Light for 10 minutes, after which time the spell ends. Each creature in the Sphere when the glyph activates is targeted by its effect, as is a creature that enters the Sphere for the first time on a turn or ends its turn there. A creature is targeted only once per turn.","***Death.*** Each target makes a Constitution saving throw, taking 10d10 Necrotic damage on a failed save or half as much damage on a successful save.","***Discord.*** Each target makes a Wisdom saving throw. On a failed save, a target argues with other creatures for 1 minute. During this time, it is incapable of meaningful communication and has Disadvantage on attack rolls and ability checks.","***Fear.*** Each target must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute. While Frightened, the target must move at least 30 feet away from the glyph on each of its turns, if able.","***Pain.*** Each target must succeed on a Constitution saving throw or have the Incapacitated condition for 1 minute.","***Sleep.*** Each target must succeed on a Wisdom saving throw or have the Unconscious condition for 10 minutes. A creature awakens if it takes damage or if someone takes an action to shake it awake.","***Stunning.*** Each target must succeed on a Wisdom saving throw or have the Stunned condition for 1 minute."]},{"name":"Synaptic Static","type":"Enchantment","casting":"Action","range":"120 feet","components":"V, S","duration":"Instantaneous","level":"Level 5","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["You cause psychic energy to erupt at a point within range. Each creature in a 20-foot-radius Sphere centered on that point makes an Intelligence saving throw, taking 8d6 Psychic damage on a failed save or half as much damage on a successful one.","On a failed save, a target also has muddled thoughts for 1 minute. During that time, it subtracts 1d6 from all its attack rolls and ability checks, as well as any Constitution saving throws to maintain Concentration. The target makes an Intelligence saving throw at the end of each of its turns, ending the effect on itself on a success."]},{"name":"Tasha's Bubbling Cauldron","type":"Conjuration","casting":"Action","range":"5 feet","components":"V, S, M (a gilded ladle worth 500+ GP)","duration":"10 minutes","level":"Level 6","classes":["Warlock","Wizard"],"content":["You conjure a claw-footed cauldron filled with bubbling liquid. The cauldron appears in an unoccupied space on the ground within 5 feet of you and lasts for the duration. The cauldron can't be moved and disappears when the spell ends, along with the bubbling liquid inside it.","The liquid in the cauldron duplicates the properties of a Common or an Uncommon potion of your choice (such as a *Potion of Healing)*. As a Bonus Action, you or an ally can reach into the cauldron and withdraw one potion of that kind. The potion is contained in a vial that disappears when the potion is consumed. The cauldron can produce a number of these potions equal to your spellcasting ability modifier (minimum 1). When the last of these potions is withdrawn from the cauldron, the cauldron disappears, and the spell ends.","Potions obtained from the cauldron that aren't consumed disappear when you cast this spell again."]},{"name":"Tasha's Hideous Laughter","type":"Enchantment","casting":"Action","range":"30 feet","components":"V, S, M (a tart and a feather)","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Bard","Warlock","Wizard"],"content":["One creature of your choice that you can see within range makes a Wisdom saving throw. On a failed save, it has the Prone and Incapacitated conditions for the duration. During that time, it laughs uncontrollably if it's capable of laughter, and it can't end the Prone condition on itself.","At the end of each of its turns and each time it takes damage, it makes another Wisdom saving throw. The target has Advantage on the save if the save is triggered by damage. On a successful save, the spell ends.","***Using a Higher-Level Spell Slot.*** You can target one additional creature for each spell slot level about 1."]},{"name":"Telekinesis","type":"Transmutation","casting":"Action","range":"60 feet","components":"V, S","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Sorcerer","Wizard"],"content":["You gain the ability to move or manipulate creatures or objects by thought. When you cast the spell and as a Magic action on your later turns before the spell ends, you can exert your will on one creature or object that you can see within range, causing the appropriate effect below. You can affect the same target round after round or choose a new one at any time. If you switch targets, the prior target is no longer affected by the spell.","***Creature.*** You can try to move a Huge or smaller creature. The target must succeed on a Strength saving throw, or you move it up to 30 feet in any direction within the spell's range. Until the end of your next turn, the creature has the Restrained condition, and if you lift it into the air, it is suspended there. It falls at the end of your next turn unless you use this option on it again and it fails the save.","***Object.*** You can try to move a Huge or smaller object. If the object isn't being worn or carried, you automatically move it up to 30 feet in any direction within the spell's range.","If the object is worn or carried by a creature, that creature must succeed on a Strength saving throw, or you pull the object away and move it up to 30 feet in any direction within the spell's range.","You can exert fine control on objects with your telekinetic grip, such as manipulating a simple tool, opening a door or a container, stowing or retrieving an item from an open container, or pouring the contents from a vial."]},{"name":"Telepathy","type":"Divination","casting":"Action","range":"Unlimited","components":"V, S, M (a pair of linked silver rings)","duration":"24 hours","level":"Level 8","classes":["Wizard"],"content":["You create a telepathic link between yourself and a willing creature with which you are familiar. The creature can be anywhere on the same plane of existence as you. The spell ends if you or the target are no longer on the same plane.","Until the spell ends, you and the target can instantly share words, images, sounds, and other sensory messages with each other through the link, and the target recognizes you as the creature it is communicating with. The spell enables a creature to understand the meaning of your words and any sensory messages you send to it."]},{"name":"Teleport","type":"Conjuration","casting":"Action","range":"10 feet","components":"V","duration":"Instantaneous","level":"Level 7","classes":["Bard","Sorcerer","Wizard"],"content":["This spell instantly transports you and up to eight willing creatures that you can see within range, or a single object that you can see within range, to a destination you select. If you target an object, it must be Large or smaller, and it can't be held or carried by an unwilling creature.","The destination you choose must be known to you, and it must be on the same plane of existence as you. Your familiarity with the destination determines whether you arrive there successfully. The DM rolls 1d100 and consults the Teleportation Outcome table and the explanations after it.","***Fatniliarity.*** Here are the meanings of the terms in the table's Familiarity column:"," \\"Permanent circle\\" means a permanent teleportation circle whose sigil sequence you know."," \\"Linked object\\" means you possess an object taken from the desired destination within the last six months, such as a book from a wizard's library."," \\"Very familiar\\" is a place you have visited often, a place you have carefully studied, or a place you can see when you cast the spell."," \\"Seen casually\\" is a place you have seen more than once but with which you aren't very familiar."," \\"Viewed once or described\\" is a place you have seen once, possibly using magic, or a place you know through someone else's description, perhaps from a map."," \\"False destination\\" is a place that doesn't exist. Perhaps you tried to scry an enemy's sanctum but instead viewed an illusion, or you are attempting to teleport to a location that no longer exists.","***Mishap.*** The spell's unpredictable magic results in a difficult journey. Each teleporting creature (or the target object) takes 3d10 Force damage, and the DM rerolls on the table to see where you wind up (multiple mishaps can occur, dealing damage each time).","***Similar Area.*** You and your group (or the target object) appear in a different area that's visually or thematically similar to the target area. You appear in the closest similar place. If you are heading for your home laboratory, for example, you might appear in another person's laboratory in the same city.","***Off Target.*** You and your group (or the target object) appear 2d12 miles away from the destination in a random direction. Roll 1d8 for the direction: 1, east; 2, southeast; 3, south; 4, southwest; 5, west; 6, northwest; 7, north; or 8, northeast.","***On Target.*** You and your group (or the target object) appear where you intended."],"tables":[{"title":"Teleportation Outcome","sizesOlder":[0.4,0.15,0.15,0.15,0.15],"sizes":[0.35,0.175,0.175,0.15,0.15],"header":[["Familiarity","Mishap","Similar Area","Off Target","On Target"]],"body":[["Permanent circle","-","-","-","01-00"],["Linked object","-","-","-","01-00"],["Very familiar","01-05","06-13","14-24","25-00"],["Seen casually","01-33","34-43","44-53","54-00"],["Viewed once or described","01-43","44-53","54-73","74-00"],["."," "," "," "," "],["False destination","01-50","51-00","-","-"]]}]},{"fontSize":1.9,"name":"Teleportation Circle","type":"Conjuration","casting":"1 minute","range":"10 feet","components":"V, M (rare inks worth 50+ GP, which the spell consumes)","duration":"1 round","level":"Level 5","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["As you cast the spell, you draw a 5-foot-radius circle on the ground inscribed with sigils that link your location to a permanent teleportation circle of your choice whose sigil sequence you know and that is on the same plane of existence as you. A shimmering portal opens within the circle you drew and remains open until the end of your next turn. Any creature that enters the portal instantly appears within 5 feet of the destination circle or in the nearest unoccupied space ifthat space is occupied.","Many major temples, guildhalls, and other important places have permanent teleportation circles. Each circle includes a unique sigil sequence-a string of runes arranged in a particular pattern.","When you first gain the ability to cast this spell, you learn the sigil sequences for two destinations on the Material Plane, determined by the DM. You might learn additional sigil sequences during your adventures. You can commit a new sigil sequence to memory after studying it for 1 minute.","You can create a permanent teleportation circle by casting this spell in the same location every day for 365 days."]},{"name":"Tenser's Floating Disk","type":"Conjuration","casting":"Action or Ritual","range":"30 feet","components":"V, S, M (a drop of mercury)","duration":"1 hour","level":"Level 1","classes":["Wizard"],"content":["This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk remains for the duration and can hold up to 500 pounds. If more weight is placed on it, the spell ends, and everything on the disk falls to the ground.","The disk is immobile while you are within 20 feet of it. If you move more than 20 feet away from it, the disk follows you so that it remains within 20 feet of you. It can move across uneven terrain, up or down stairs, slopes and the like, but it can't cross an elevation change of 10 feet or more. For example, the disk can't move across a 10-foot-deep pit, nor could it leave such a pit if it was created at the bottom.","If you move more than 100 feet from the disk (typically because it can't move around an obstacle to follow you), the spell ends."]},{"name":"Thaumaturgy","type":"Transmutation","casting":"Action","range":"30 feet","components":"V","duration":"Up to 1 minute","level":"Cantrip","classes":["Cleric"],"content":["You manifest a minor wonder within range. You create one of the effects below within range. If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time.","***Altered Eyes.*** You alter the appearance ofyour eyes for 1 minute.","***Boorning Voice.*** Your voice booms up to three times as loud as normal for 1 minute. For the duration, you have Advantage on Charisma (Intimidation) checks.","***Fire Play.*** You cause flames to flicker, brighten, dim, or change color for 1 minute.","***Invisible Hand.*** You instantaneously cause an unlocked door or window to fly open or slam shut.","***Phantom Sound.*** You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.","***Tremors.*** You cause harmless tremors in the ground for 1 minute."]},{"name":"Thorn Whip","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S, M (the stem of a thorny plant)","duration":"Instantaneous","level":"Cantrip","classes":["Druid"],"content":["You create a vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. On a hit, the target takes 1d6 Piercing damage, and if it is Large or smaller, you can pull it up to 10 feet closer to you.","***Cantrip Upgrade.*** The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6)."]},{"name":"Thunderclap","type":"Evocation","casting":"Action","range":"Self","components":"S","duration":"Instantaneous","level":"Cantrip","classes":["Bard","Druid","Sorcerer","Warlock","Wizard"],"content":["Each creature in a 5-foot Emanation originating from you must succeed on a Constitution saving throw or take 1d6 Thunder damage. The spell's thunderous sound can be heard up to 100 feet away.","***Cantrip Upgrade.*** The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6)."]},{"name":"Thunderous Smite","type":"Evocation","casting":"Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"Instantaneous","level":"Level 1","classes":["Paladin"],"content":["Your strike rings with thunder that is audible within 300 feet of you, and the target takes an extra 2d6 Thunder damage from the attack. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and have the Prone condition.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 1."]},{"name":"Thunderwave","type":"Evocation","casting":"Action","range":"Self","components":"V, S","duration":"Instantaneous","level":"Level 1","classes":["Bard","Druid","Sorcerer","Wizard"],"content":["You unleash a wave of thunderous energy. Each creature in a 15-foot Cube originating from you makes a Constitution saving throw. On a failed save, a creature takes 2d8 Thunder damage and is pushed 10 feet away from you. On a successful save, a creature takes half as much damage only.","In addition, unsecured objects that are entirely within the Cube are pushed 10 feet away from you, and a thunderous boom is audible within 300 feet.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 1."]},{"name":"Time Stop","type":"Transmutation","casting":"Action","range":"Self","components":"V","duration":"Instantaneous","level":"Level 9","classes":["Sorcerer","Wizard"],"content":["You briefly stop the flow of time for everyone but yourself. No time passes for other creatures, while you take 1d4 + 1 turns in a row, during which you can use actions and move as normal.","This spell ends if one of the actions you use during this period, or any effects that you create during it, affects a creature other than you or an object being worn or carried by someone other than you. In addition, the spell ends if you move to a place more than 1,000 feet from the location where you cast it."]},{"name":"Toll the Dead","type":"Necromancy","casting":"Action","range":"60 feet","components":"V, S","duration":"Instantaneous","level":"Cantrip","classes":["Cleric","Warlock","Wizard"],"content":["You point at one creature you can see within range, and the single chime of a dolorous bell is audible within 10 feet of the target. The target must succeed on a Wisdom saving throw or take 1d8 Necrotic damage. If the target is missing any of its Hit Points, it instead takes 1d12 Necrotic damage.","***Cantrip Upgrade.*** The damage increases by one die when you reach levels 5 (2d8 or 2d12), 11 (3d8 or 3d12), and 17 (4d8 or 4d12)."]},{"name":"Tongues","type":"Divination","casting":"Action","range":"Touch","components":"V, M (a miniature ziggurat)","duration":"1 hour","level":"Level 3","classes":["Bard","Cleric","Sorcerer","Warlock","Wizard"],"content":["This spell grants the creature you touch the ability to understand any spoken or signed language that it hears or sees. Moreover, when the target communicates by speaking or signing, any creature that knows at least one language can understand it if that creature can hear the speech or see the signing."]},{"name":"Transport via Plants","type":"Conjuration","casting":"Action","range":"10 feet","components":"V, S","duration":"1 minute","level":"Level 6","classes":["Druid"],"content":["This spell creates a magical link between a Large or larger inanimate plant within range and another plant, at any distance, on the same plane of existence. You must have seen or touched the destination plant at least once before. For the duration, any creature can step into the target plant and exit from the destination plant by using 5 feet of movement."]},{"name":"Tree Stride","type":"Conjuration","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Druid","Ranger"],"content":["You gain the ability to enter a tree and move from inside it to inside another tree of the same kind within 500 feet. Both trees must be living and at least the same size as you. You must use 5 feet of movement to enter a tree. You instantly know the location of all other trees of the same kind within 500 feet and, as part of the move used to enter the tree, can either pass into one of those trees or step out of the tree you're in. You appear in a spot of your choice within 5 feet of the destination tree, using another 5 feet of movement. If you have no movement left, you appear within 5 feet of the tree you entered.","You can use this transportation ability only once on each of your turns. You must end each turn outside a tree."]},{"name":"True Polymorph","type":"Transmutation","casting":"Action","range":"30 feet","components":"V, S, M (a drop of mercury, a dollop of gum arabic, and a wisp of smoke)","duration":"Concentration, up to 1 hour","level":"Level 9","classes":["Bard","Warlock","Wizard"],"content":["Choose one creature or nonmagical object that you can see within range. The creature shape-shifts into a different creature or a nonmagical object, or the object shape-shifts into a creature (the object must be neither worn nor carried). The transformation lasts for the duration or until the target dies or is destroyed, but if you maintain Concentration on this spell for the full duration, the spell lasts until dispelled.","An unwilling creature can make a Wisdom saving throw, and if it succeeds, it isn't affected by this spell.","***Creature into Creature.*** If you turn a creature into another kind of creature, the new form can be any kind you choose that has a Challenge Rating equal to or less than the target's Challenge Rating or level. The target's game statistics are replaced by the stat block of the new form, but it retains its Hit Points, Hit Point Dice, alignment, and personality.","The target gains a number of Temporary Hit Points equal to the Hit Points of the new form. The spell ends early on the target if it has no Temporary Hit Points left.","The target is limited in the actions it can perform by the anatomy of its new form, and it can't speak or cast spells.","The target's gear melds into the new form. The creature can't use or otherwise benefit from any of that equipment.","***Object into Creature.*** You can turn an object into any kind of creature, as long as the creature's size is no larger than the object's size and the creature has a Challenge Rating of 9 or lower. The creature is Friendly to you and your allies. In combat, it takes its turns immediately after yours, and it obeys your commands.","If the spell lasts more than an hour, you no longer control the creature. It might remain Friendly to you, depending on how you have treated it.","***Creature into Object.*** If you turn a creature into an object, it transforms along with whatever it is wearing and carrying into that form, as long as the object's size is no larger than the creature's size. The creature's statistics become those of the object, and the creature has no memory of time spent in this form after the spell ends and it returns to normal."]},{"name":"True Resurrection","type":"Necromancy","casting":"1 hour","range":"Touch","components":"V, S, M (diamonds worth 25,000+ GP, which the spell consumes)","duration":"Instantaneous","level":"Level 9","classes":["Cleric","Druid"],"content":["You touch a creature that has been dead for no longer than 200 years and that died for any reason except old age. The creature is revived with all its Hit Points.","This spell closes all wounds, neutralizes any poison, cures all magical contagions, and lifts any curses affecting the creature when it died. The spell replaces damaged or missing organs and limbs. If the creature was Undead, it is restored to its non-Undead form.","The spell can provide a new body if the original no longer exists, in which case you must speak the creature's name. The creature then appears in an unoccupied space you choose within 10 feet of you."]},{"name":"True Seeing","type":"Divination","casting":"Action","range":"Touch","components":"V, S, M (mushroom powder worth 25+ GP, which the spell consumes)","duration":"1 hour","level":"Level 6","classes":["Bard","Cleric","Sorcerer","Warlock","Wizard"],"content":["For the duration, the willing creature you touch has Truesight with a range of 120 feet."]},{"name":"True Strike","type":"Divination","casting":"Action","range":"Self","components":"S, M (a weapon with which you have proficiency and that is worth 1+ CP)","duration":"Instantaneous","level":"Cantrip","classes":["Bard","Sorcerer","Warlock","Wizard"],"content":["Guided by a flash of magical insight, you make one attack with the weapon used in the spell's casting. The attack uses your spellcasting ability for the attack and damage rolls instead of using Strength or Dexterity. If the attack deals damage, it can be Radiant damage or the weapon's normal damage type (your choice).","***Cantrip Upgrade.*** Whether you deal Radiant damage or the weapon's normal damage type, the attack deals extra Radiant damage when you reach levels 5 (1d6), 11 (2d6), and 17 (3d6)."]},{"fontSize":1.9,"name":"Tsunami","type":"Conjuration","casting":"1 minute","range":"1 mile","components":"V, S","duration":"Concentration, up to 6 rounds","level":"Level 8","classes":["Druid"],"content":["A wall of water springs into existence at a point you choose within range. You can make the wall up to 300 feet long, 300 feet high, and 50 feet thick. The wall lasts for the duration.","When the wall appears, each creature in its area makes a Strength saving throw taking 6d10 Bludgeoning damage on a failed save or half as much damage on a successful one.","At the start of each of your turns after the wall appears, the wall, along with any creatures in it, moves 50 feet away from you. Any Huge or smaller creature inside the wall or whose space the wall enters when it moves must succeed on a Strength saving throw or take 5d10 Bludgeoning damage. A creature can take this damage only once per round. At the end of the turn, the wall's height is reduced by 50 feet, and the damage the wall deals on later rounds is reduced by 1d10. When the wall reaches 0 feet in height, the spell ends.","A creature caught in the wall can move by swimming. Because of the wave's force, though, the creature must succeed on a Strength (Athletics) check against your spell save DC to move at all. If it fails the check, it can't move. A creature that moves out of the wall falls to the ground."]},{"name":"Unseen Servant","type":"Conjuration","casting":"Action or Ritual","range":"60 feet","components":"V, S, M (a bit of string and of wood)","duration":"1 hour","level":"Level 1","classes":["Bard","Warlock","Wizard"],"content":["This spell creates an Invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 Hit Point, and a Strength of 2, and it can't attack. If it drops to 0 Hit Points, the spell ends.","Once on each of your turns as a Bonus Action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring drinks. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command.","If you command the servant to perform a task that would move it more than 60 feet away from you, the spell ends."]},{"name":"Vampiric Touch","type":"Necromancy","casting":"Action","range":"Self","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Sorcerer","Warlock","Wizard"],"content":["The touch of your shadow-wreathed hand can siphon life force from others to heal your wounds. Make a melee spell attack against one creature within reach. On a hit, the target takes 3d6 Necrotic damage, and you regain Hit Points equal to half the amount of Necrotic damage dealt.","Until the spell ends, you can make the attack again on each of your turns as a Magic action, targeting the same creature or a different one.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d6 for each spell slot level above 3."]},{"name":"Vicious Mockery","type":"Enchantment","casting":"Action","range":"60 feet","components":"V","duration":"Instantaneous","level":"Cantrip","classes":["Bard"],"content":["You unleash a string of insults laced with subtle enchantments at one creature you can see or hear within range. The target must succeed on a Wisdom saving throw or take 1d6 Psychic damage and have Disadvantage on the next attack roll it makes before the end of its next turn.","***Cantrip Upgrade.*** The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6)."]},{"name":"Vitriolic Sphere","type":"Evocation","casting":"Action","range":"150 feet","components":"V, S, M (a drop of bile)","duration":"Instantaneous","level":"Level 4","classes":["Sorcerer","Wizard"],"content":["You point at a location within range, and a glowing, 1-foot-diameter ball of acid streaks there and explodes in a 20-foot-radius Sphere. Each creature in that area makes a Dexterity saving throw. On a failed save, a creature takes 10d4 Acid damage and another 5d4 Acid damage at the end of its next turn. On a successful save, a creature takes half the initial damage only.","***Using a Higher-Level Spell Slot.*** The initial damage increases by 2d4 for each spell slot level above 4."]},{"name":"Wall of Fire","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S, M (a piece of charcoal)","duration":"Concentration, up to 1 minute","level":"Level 4","classes":["Druid","Sorcerer","Wizard"],"content":["You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.","When the wall appears, each creature in its area makes a Dexterity saving throw, taking 5d8 Fire damage on a failed save or half as much damage on a successful one.","One side of the wall, selected by you when you cast this spell, deals 5d8 Fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.","***Using a Higher-Level Spell Slot.*** The damage increases by 1d8 for each spell slot level above 4."]},{"name":"Wall of Force","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S, M (a shard of glass)","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Wizard"],"content":["An Invisible wall of force springs into existence at a point you choose within range. The wall appears in any orientation you choose, as a horizontal or vertical barrier or at an angle. It can be free floating or resting on a solid surface. You can form it into a hemispherical dome or a globe with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-foot-by-10-foot panels. Each panel must be contiguous with another panel. In any form, the wall is 1/4 inch thick and lasts for the duration. If the wall cuts through a creature's space when it appears, the creature is pushed to one side of the wall (you choose which side).","Nothing can physically pass through the wall. It is immune to all damage and can't be dispelled by *Dispel Magic*. A *Disintegrate* spell destroys the wall instantly, however. The wall also extends into the Ethereal Plane and blocks ethereal travel through the wall."]},{"name":"Wall of Ice","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S, M (a piece of quartz)","duration":"Concentration, up to 10 minutes","level":"Level 6","classes":["Wizard"],"content":["You create a wall of ice on a solid surface within range. You can form it into a hemispherical dome or a globe with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-foot-square panels. Each panel must be contiguous with another panel. In any form, the wall is 1 foot thick and lasts for the duration.","If the wall cuts through a creature's space when it appears, the creature is pushed to one side of the wall (you choose which side) and makes a Dexterity saving throw, taking 10d6 Cold damage on a failed save or half as much damage on a successful one.","The wall is an object that can be damaged and thus breached. It has AC 12 and 30 Hit Points per 10-foot section, and it has Immunity to Cold, Poison, and Psychic damage and Vulnerability to Fire damage. Reducing a 10-foot section of wall to 0 Hit Points destroys it and leaves behind a sheet of frigid air in the space the wall occupied.","A creature moving through the sheet of frigid air for the first time on a turn makes a Constitution saving throw, taking 5d6 Cold damage on a failed save or half as much damage on a successful one.","***Using a Higher-Level Spell Slot.*** The damage the wall deals when it appears increases by 2d6 and the damage from passing through the sheet of frigid air increases by 1d6 for each spell slot level above 6."]},{"name":"Wall of Stone","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S, M (a cube of granite)","duration":"Concentration, up to 10 minutes","level":"Level 5","classes":["Druid","Sorcerer","Wizard"],"content":["A nonmagical wall of solid stone springs into existence at a point you choose within range. The wall is 6 inches thick and is composed of ten 10-foot-by-10-foot panels. Each panel must be contiguous with another panel. Alternatively, you can create 10-foot-by-20-foot panels that are only 3 inches thick.","If the wall cuts through a creature's space when it appears, the creature is pushed to one side of the wall (you choose which side). If a creature would be surrounded on all sides by the wall (or the wall and another solid surface), that creature can make a Dexterity saving throw. On a success, it can use its Reaction to move up to its Speed so that it is no longer enclosed by the wall.","The wall can have any shape you desire, though it can't occupy the same space as a creature or object. The wall doesn't need to be vertical or rest on a firm foundation. It must, however, merge with and be solidly supported by existing stone. Thus, you can use this spell to bridge a chasm or create a ramp.","If you create a span greater than 20 feet in length, you must halve the size of each panel to create supports. You can crudely shape the wall to create battlements and the like.","The wall is an object made of stone that can be damaged and thus breached. Each panel has AC 15 and 30 Hit Points per inch of thickness, and it has Immunity to Poison and Psychic damage. Reducing a panel to 0 Hit Points destroys it and might cause connected panels to collapse at the DM's discretion.","If you maintain your Concentration on this spell for its full duration, the wall becomes permanent and can't be dispelled. Otherwise, the wall disappears when the spell ends."]},{"name":"Wall of Thorns","type":"Conjuration","casting":"Action","range":"120 feet","components":"V, S, M (a handful of thorns)","duration":"Concentration, up to 10 minutes","level":"Level 6","classes":["Druid"],"content":["You create a wall of tangled brush bristling with needle-sharp thorns. The wall appears within range on a solid surface and lasts for the duration. You choose to make the wall up to 60 feet long, 10 feet high, and 5 feet thick or a circle that has a 20-foot diameter and is up to 20 feet high and 5 feet thick. The wall blocks line of sight.","When the wall appears, each creature in its area makes a Dexterity saving throw, taking 7d8 Piercing damage on a failed save or half as much damage on a successful one.","A creature can move through the wall, albeit slowly and painfully. For every 1 foot a creature moves through the wall, it must spend 4 feet of movement. Furthermore, the first time a creature enters a space in the wall on a turn or ends its turn there, the creature makes a Dexterity saving throw, taking 7d8 Slashing damage on a failed save or half as much damage on a successful one. A creature makes this save only once per turn.","***Using a Higher-Level Spell Slot.*** Both types of damage increase by 1d8 for each spell slot level above 6."]},{"name":"Warding Bond","type":"Abjuration","casting":"Action","range":"Touch","components":"V, S, M (a pair of platinum rings worth 50+ GP each, which you and the target must wear for the duration)","duration":"1 hour","level":"Level 2","classes":["Cleric","Paladin"],"content":["You touch another creature that is willing and create a mystic connection between you and the target until the spell ends. While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has Resistance to all damage. Also, each time it takes damage, you take the same amount of damage.","The spell ends if you drop to 0 Hit Points or if you and the target become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures."]},{"name":"Water Breathing","type":"Transmutation","casting":"Action or Ritual","range":"30 feet","components":"V, S, M (a short reed)","duration":"24 hours","level":"Level 3","classes":["Druid","Ranger","Sorcerer","Wizard"],"content":["This spell grants up to ten willing creatures of your choice within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration."]},{"name":"Water Walk","type":"Transmutation","casting":"Action or Ritual","range":"30 feet","components":"V, S, M (a piece of cork)","duration":"1 hour","level":"Level 3","classes":["Cleric","Druid","Ranger","Sorcerer"],"content":["This spell grants the ability to move across any liquid surface-such as water, acid, mud, snow quicksand, or lava-as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures of your choice within range gain this ability for the duration.","An affected target must take a Bonus Action to pass from the liquid's surface into the liquid itself and vice versa, but if the target falls into the liquid, the target passes through the surface into the liquid below."]},{"name":"Web","type":"Conjuration","casting":"Action","range":"60 feet","components":"V, S, M (a bit of spiderweb)","duration":"Concentration, up to 1 hour","level":"Level 2","classes":["Sorcerer","Wizard"],"content":["You conjure a mass of sticky webbing at a point within range. The webs fill a 20-foot Cube there for the duration. The webs are Difficult Terrain, and the area within them is Lightly Obscured.","If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.","The first time a creature enters the webs on a turn or starts its turn there, it must succeed on a Dexterity saving throw or have the Restrained condition while in the webs or until it breaks free.","A creature Restrained by the webs can take an action to make a Strength (Athletics) check against your spell save DC. If it succeeds, it is no longer Restrained.","The webs are flammable. Any 5-foot Cube of webs exposed to fire burns away in 1 round, dealing 2d4 Fire damage to any creature that starts its turn in the fire."]},{"name":"Weird","type":"Illusion","casting":"Action","range":"120 feet","components":"V, S","duration":"Concentration, up to 1 minute","level":"Level 9","classes":["Warlock","Wizard"],"content":["You try to create illusory terrors in others' minds. Each creature ofyour choice in a 30-foot-radius Sphere centered on a point within range makes a Wisdom saving throw. On a failed save, a target takes 10d10 Psychic damage and has the Frightened condition for the duration. On a successful save, a target takes half as much damage only.","A Frightened target makes a Wisdom saving throw at the end of each of its turns. On a failed save, it takes 5d10 Psychic damage. On a successful save, the spell ends on that target."]},{"name":"Wind Walk","type":"Transmutation","casting":"1 minute","range":"30 feet","components":"V, S, M (a candle)","duration":"8 hours","level":"Level 6","classes":["Druid"],"content":["You and up to ten willing creatures of your choice within range assume gaseous forms for the duration, appearing as wisps of cloud. While in this cloud form, a target has a Fly Speed of 300 feet and can hover; it has Immunity to the Prone condition; and it has Resistance to Bludgeoning, Piercing, and Slashing damage. The only actions a target can take in this form are the Dash action or a Magic action to begin reverting to its normal form. Reverting takes 1 minute, during which the target has the Stunned condition. Until the spell ends, the target can revert to cloud form, which also requires a Magic action followed by a 1-minute transformation.","If a target is in cloud form and flying when the effect ends, the target descends 60 feet per round for 1 minute until it lands, which it does safely. If it can't land after 1 minute, it falls the remaining distance."]},{"name":"Wind Wall","type":"Evocation","casting":"Action","range":"120 feet","components":"V, S, M (a fan and a feather)","duration":"Concentration, up to 1 minute","level":"Level 3","classes":["Druid","Ranger"],"content":["A wall of strong wind rises from the ground at a point you choose within range. You can make the wall up to 50 feet long, 15 feet high, and 1 foot thick. You can shape the wall in any way you choose so long as it makes one continuous path along the ground. The wall lasts for the duration.","When the wall appears, each creature in its area makes a Strength saving throw taking 4d8 Bludgeoning damage on a failed save or half as much damage on a successful one.","The strong wind keeps fog, smoke, and other gases at bay. Small or smaller flying creatures or objects can't pass through the wall. Loose, lightweight materials brought into the wall fly upward. Arrows, bolts, and other ordinary projectiles launched at targets behind the wall are deflected upward and miss automatically. Boulders hurled by Giants or siege engines, and similar projectiles, are unaffected. Creatures in gaseous form can't pass through it."]},{"name":"Wish","type":"Conjuration","casting":"Action","range":"Self","components":"V","duration":"Instantaneous","level":"Level 9","classes":["Sorcerer","Wizard"],"content":["*Wish* is the mightiest spell a mortal can cast. By simply speaking aloud, you can alter reality itself.","The basic use of this spell is to duplicate any other spell of level 8 or lower. If you use it this way, you don't need to meet any requirements to cast that spell, including costly components. The spell simply takes effect.","Alternatively, you can create one of the following effects of your choice:","***Object Creation.*** You create one object of up to 25,000 GP in value that isn't a magic item. The object can be no more than 300 feet in any dimension, and it appears in an unoccupied space that you can see on the ground.","***Instant Health.*** You allow yourself and up to twenty creatures that you can see to regain all Hit Points, and you end all effects on them listed in the *Greater Restoration* spell.","***Resistance.*** You grant up to ten creatures that you can see Resistance to one damage type that you choose. This Resistance is permanent.","***Spell Immunity.*** You grant up to ten creatures you can see immunity to a single spell or other magical effect for 8 hours.","***Sudden Learning.*** You replace one of your feats with another feat for which you are eligible. You lose all the benefits of the old feat and gain the benefits of the new one. You can't replace a feat that is a prerequisite for any of your other feats or features.","***Roll Redo.*** You undo a single recent event by forcing a reroll of any die roll made within the last round (including your last turn). Reality reshapes itself to accommodate the new result. For example, a *Wish* spell could undo an ally's failed saving throw or a foe's Critical Hit. You can force the reroll to be made with Advantage or Disadvantage, and you choose whether to use the reroll or the original roll.","***Reshape Reality.*** You may wish for something not included in any of the other effects. To do so, state your wish to the DM as precisely as possible. The DM has great latitude in ruling what occurs in such an instance; the greater the wish, the greater the likelihood that something goes wrong. This spell might simply fail, the effect you desire might be achieved only in part, or you might suffer an unforeseen consequence as a result of how you worded the wish. For example, wishing that a villain were dead might propel you forward in time to a period when that villain is no longer alive, effectively removing you from the game. Similarly, wishing for a Legendary magic item or an Artifact might instantly transport you to the presence of the item's current owner. If your wish is granted and its effects have consequences for a whole community, region, or world, you are likely to attract powerful foes. If your wish would affect a god, the god's divine servants might instantly intervene to prevent it or to encourage you to craft the wish in a particular way. If your wish would undo the multiverse itself, threaten the City of Sigil, or affect the Lady of Pain in any way, you see an image of her in your mind for a moment; she shakes her head, and your wish fails.","The stress of casting *Wish* to produce any effect other than duplicating another spell weakens you. After enduring that stress, each time you cast a spell until you finish a Long Rest, you take 1d10 Necrotic damage per level of that spell. This damage can't be reduced or prevented in any way. In addition, your Strength score becomes 3 for 2d4 days. For each of those days that you spend resting and doing nothing more than light activity, your remaining recovery time decreases by 2 days. Finally, there is a 33 percent chance that you are unable to cast *Wish* ever again if you suffer this stress."]},{"name":"Witch Bolt","type":"Evocation","casting":"Action","range":"60 feet","components":"V, S, M (a twig struck by lightning)","duration":"Concentration, up to 1 minute","level":"Level 1","classes":["Sorcerer","Warlock","Wizard"],"content":["A beam of crackling energy lances toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against it. On a hit, the target takes 2d12Lightning damage.","On each of your subsequent turns, you can take a Bonus Action to deal 1d12 Lightning damage to the target automatically, even if the first attack missed.","The spell ends if the target is ever outside the spell's range or if it has Total Cover from you.","***Using a Higher-Level Spell Slot.*** The initial damage increases by 1d12 for each spell slot level above 1."]},{"name":"Word of Radiance","type":"Evocation","casting":"Action","range":"Self","components":"V, M (a sunburst token)","duration":"Instantaneous","level":"Cantrip","classes":["Cleric"],"content":["Burning radiance erupts from you in a 5-foot Emanation. Each creature of your choice that you can see in it must succeed on a Constitution saving throw or take 1d6 Radiant damage.","***Cantrip Upgrade.*** The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6)"]},{"name":"Word of Recall","type":"Conjuration","casting":"Action","range":"5 feet","components":"V","duration":"Instantaneous","level":"Level 6","classes":["Cleric"],"content":["You and up to five willing creatures within 5 feet of you instantly teleport to a previously designated sanctuary. You and any creatures that teleport with you appear in the nearest unoccupied space to the spot you designated when you prepared your sanctuary (see below). If you cast this spell without first preparing a sanctuary, the spell has no effect.","You must designate a location, such as a temple, as a sanctuary by casting this spell there."]},{"name":"Wrathful Smite","type":"Necromancy","casting":"Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike","range":"Self","components":"V","duration":"1 minute","level":"Level 1","classes":["Paladin"],"content":["The target takes an extra 1d6 Necrotic damage from the attack, and it must succeed on a Wisdom saving throw or have the Frightened condition until the spell ends. At the end of each of its turns, the Frightened target repeats the save, ending the spell on itself on a success.","***Using a Higher-Level Spell Slot.*** The damage increases by ld6 for each spell slot level above 1."]},{"name":"Yolande's Regal Presence","type":"Enchantment","casting":"Action","range":"Self","components":"V, S, M (a miniature tiara)","duration":"Concentration, up to 1 minute","level":"Level 5","classes":["Bard","Wizard"],"content":["You surround yourself with unearthly majesty in a 10-foot Emanation. Whenever the Emanation enters the space of a creature you can see and whenever a creature you can see enters the Emanation or ends its turn there, you can force that creature to make a Wisdom saving throw. On a failed save, the target takes 4d6 Psychic damage and has the Prone condition, and you can push it up to 10 feet away. On a successful save, the target takes half as much damage only. A creature makes this save only once per turn."]},{"name":"Zone of Truth","type":"Enchantment","casting":"Action","range":"60 feet","components":"V, S","duration":"10 minutes","level":"Level 2","classes":["Bard","Cleric","Paladin"],"content":["You create a magical zone that guards against deception in a 15-foot-radius Sphere centered on a point within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there makes a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. You know whether a creature succeeds or fails on this save.","An affected creature is aware of the spell and can avoid answering questions to which it would normally respond with a lie. Such a creature can be evasive yet must be truthful."]}]`);
const _hoisted_1 = { class: "container" };
const _hoisted_2 = { class: "m-1" };
const _hoisted_3 = {
  key: 0,
  class: "card shadow-sm",
  style: { "height": "85vh" }
};
const _hoisted_4 = {
  class: "card-body",
  style: { "overflow-y": "auto" }
};
const _hoisted_5 = ["disabled"];
const _hoisted_6 = { class: "p-2" };
const _hoisted_7 = {
  key: 1,
  class: "card shadow-sm",
  style: { "height": "85vh" }
};
const _hoisted_8 = { class: "card-header bg-dark text-light d-flex align-items-center" };
const _hoisted_9 = {
  class: "card-body",
  style: { "overflow-y": "auto" }
};
const _hoisted_10 = { class: "table-responsive" };
const _hoisted_11 = ["disabled"];
const _hoisted_12 = { class: "p-2" };
const _hoisted_13 = {
  key: 2,
  class: "card shadow-sm",
  style: { "height": "85vh" }
};
const _hoisted_14 = { class: "card-header bg-dark text-light d-flex align-items-center" };
const _hoisted_15 = {
  class: "card-body",
  style: { "overflow-y": "auto" }
};
const _hoisted_16 = { class: "table-responsive" };
const _hoisted_17 = { class: "list-unstyled" };
const _hoisted_18 = ["onDragstart", "onDrop"];
const _hoisted_19 = { class: "text-truncate w-50" };
const _hoisted_20 = { class: "d-flex align-items-center justify-content-between w-50" };
const _hoisted_21 = { class: "text-truncate w-auto" };
const _hoisted_22 = { class: "text-truncate w-auto" };
const _hoisted_23 = {
  class: "text-truncate w-50 d-none d-lg-block",
  style: { "max-width": "7em" }
};
const _hoisted_24 = ["disabled"];
const _hoisted_25 = { class: "p-2" };
const _hoisted_26 = {
  key: 3,
  class: "card shadow-sm",
  style: { "height": "85vh" }
};
const _hoisted_27 = { class: "card-header bg-dark text-light d-flex justify-content-between" };
const _hoisted_28 = { class: "d-flex" };
const _hoisted_29 = { class: "mb-0" };
const _hoisted_30 = {
  class: "card-body",
  style: { "overflow-y": "hidden", "padding": "0" }
};
const _hoisted_31 = {
  id: "divWarnMessage",
  class: "p-3"
};
const FILTER = "FILTER";
const SELECTION = "SELECTION";
const CONFIRM = "CONFIRM";
const PRINT = "PRINT";
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const dndRenderer = new SpellCardsRenderer({});
    const classOptions = [];
    const levelOptions = [];
    const typeOptions = [];
    for (let spell of spells) {
      spell.printOut = false;
      for (let nclass of spell.classes)
        if (!classOptions.includes(nclass)) classOptions.push(nclass);
      if (!levelOptions.includes(spell.level)) levelOptions.push(spell.level);
      if (!typeOptions.includes(spell.type)) typeOptions.push(spell.type);
    }
    classOptions.sort();
    levelOptions.sort();
    typeOptions.sort();
    const step = /* @__PURE__ */ ref(FILTER);
    const outputSpells = /* @__PURE__ */ ref(spells);
    function onOptionsChange() {
      outputSpells.value = [];
      for (let spell of spells) {
        let addFlag = false;
        for (let nclass of spell.classes) {
          if (classesFilters.value.includes(nclass)) {
            addFlag = true;
            break;
          }
        }
        if (!addFlag) continue;
        addFlag = levelFilters.value.includes(spell.level);
        if (!addFlag) continue;
        addFlag = typeFilters.value.includes(spell.type);
        if (addFlag) {
          spell.printOut = true;
          outputSpells.value.push(spell);
        }
      }
    }
    const classesFilters = /* @__PURE__ */ ref([]);
    const levelFilters = /* @__PURE__ */ ref(levelOptions.slice());
    const typeFilters = /* @__PURE__ */ ref(typeOptions.slice());
    watch([classesFilters, levelFilters, typeFilters], onOptionsChange, { deep: true });
    let doc2 = null;
    watch(step, async function() {
      if (step.value == FILTER) {
        for (let spell of spells)
          spell.printOut = true;
      }
      if (step.value == PRINT) {
        await nextTick();
        let target = document.getElementById("divOutput");
        while (target.firstChild) target.firstChild.remove();
        let onlyPrintOut = outputSpells.value.filter((e) => e.printOut);
        doc2 = dndRenderer.generatePdf(onlyPrintOut, target);
        let iframe = target.querySelector("iframe");
        iframe.style.height = "100%";
        iframe.onload = function() {
          document.getElementById("divWarnMessage")?.remove();
        };
      }
    });
    function openPdf() {
      if (doc2) {
        doc2.open();
      } else {
        alert("ops ... parece que não foi possivel gerar o pdf");
      }
    }
    function downloadPdf() {
      if (doc2) {
        doc2.download("dnd-spell-cards-" + Date.now().toString(16).toUpperCase());
      } else {
        alert("ops ... parece que não foi possivel gerar o pdf");
      }
    }
    function countPrintOut(target) {
      let out = 0;
      for (let e of target)
        if (e.printOut) out++;
      return out;
    }
    let dragIndex = null;
    function onDragStart(index) {
      dragIndex = index;
    }
    function onDrop(dropIndex) {
      const movedItem = outputSpells.value.splice(dragIndex, 1)[0];
      outputSpells.value.splice(dropIndex, 0, movedItem);
      dragIndex = null;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[22] || (_cache[22] = createBaseVNode("div", { class: "m-1 d-flex justify-content-between align-items-center" }, [
          createBaseVNode("h1", { class: "fs-2" }, "D&D Spell Cards"),
          createBaseVNode("a", {
            class: "btn btn-primary",
            href: "https://github.com/devConcordia/DNDSpellCards",
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            createBaseVNode("i", { class: "bi bi-github" }),
            createTextVNode(" Open Source")
          ])
        ], -1)),
        createBaseVNode("div", _hoisted_2, [
          step.value == FILTER ? (openBlock(), createElementBlock("div", _hoisted_3, [
            _cache[10] || (_cache[10] = createBaseVNode("div", { class: "card-header bg-dark text-light" }, [
              createBaseVNode("h5", { class: "mb-0" }, "Filters")
            ], -1)),
            createBaseVNode("div", _hoisted_4, [
              createVNode(_sfc_main$2, {
                name: "Class",
                options: classOptions,
                filters: classesFilters.value
              }, null, 8, ["filters"]),
              createVNode(_sfc_main$2, {
                name: "Level",
                options: levelOptions,
                filters: levelFilters.value
              }, null, 8, ["filters"]),
              createVNode(_sfc_main$2, {
                name: "Type",
                options: typeOptions,
                filters: typeFilters.value
              }, null, 8, ["filters"])
            ]),
            createBaseVNode("button", {
              class: "btn btn-primary",
              onClick: _cache[0] || (_cache[0] = ($event) => step.value = SELECTION),
              disabled: countPrintOut(outputSpells.value) == 0
            }, [
              createBaseVNode("span", _hoisted_6, "Next (" + toDisplayString(countPrintOut(outputSpells.value)) + ")", 1),
              _cache[9] || (_cache[9] = createBaseVNode("span", { class: "bi bi-chevron-right" }, null, -1))
            ], 8, _hoisted_5)
          ])) : step.value == SELECTION ? (openBlock(), createElementBlock("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("button", {
                class: "btn btn-transparent text-light",
                style: { "padding": "0 .25em" },
                onClick: _cache[1] || (_cache[1] = ($event) => step.value = FILTER)
              }, [..._cache[11] || (_cache[11] = [
                createBaseVNode("span", { class: "bi bi-chevron-left" }, null, -1)
              ])]),
              _cache[12] || (_cache[12] = createBaseVNode("h5", { class: "mb-0" }, "Spells", -1))
            ]),
            createBaseVNode("div", _hoisted_9, [
              createBaseVNode("div", _hoisted_10, [
                createVNode(DNDTable, { spells: outputSpells.value }, null, 8, ["spells"])
              ])
            ]),
            createBaseVNode("button", {
              class: "btn btn-primary",
              onClick: _cache[2] || (_cache[2] = ($event) => step.value = CONFIRM),
              disabled: countPrintOut(outputSpells.value) == 0
            }, [
              createBaseVNode("span", _hoisted_12, "Next (" + toDisplayString(countPrintOut(outputSpells.value)) + ")", 1),
              _cache[13] || (_cache[13] = createBaseVNode("span", { class: "bi bi-chevron-right" }, null, -1))
            ], 8, _hoisted_11)
          ])) : step.value == CONFIRM ? (openBlock(), createElementBlock("div", _hoisted_13, [
            createBaseVNode("div", _hoisted_14, [
              createBaseVNode("button", {
                class: "btn btn-transparent text-light",
                style: { "padding": "0 .25em" },
                onClick: _cache[3] || (_cache[3] = ($event) => step.value = SELECTION)
              }, [..._cache[14] || (_cache[14] = [
                createBaseVNode("span", { class: "bi bi-chevron-left" }, null, -1)
              ])]),
              _cache[15] || (_cache[15] = createBaseVNode("h5", { class: "mb-0" }, "Spells", -1))
            ]),
            createBaseVNode("div", _hoisted_15, [
              createBaseVNode("div", _hoisted_16, [
                createBaseVNode("ul", _hoisted_17, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(outputSpells.value, (spell, index) => {
                    return openBlock(), createElementBlock(Fragment, null, [
                      spell.printOut ? (openBlock(), createElementBlock("li", {
                        key: 0,
                        class: "d-flex flex-nowarp align-items-center justify-content-between",
                        draggable: "true",
                        onDragstart: ($event) => onDragStart(index),
                        onDragover: _cache[4] || (_cache[4] = withModifiers(() => {
                        }, ["prevent"])),
                        onDrop: ($event) => onDrop(index)
                      }, [
                        createBaseVNode("span", _hoisted_19, [
                          _cache[16] || (_cache[16] = createBaseVNode("span", { class: "mx-1 bi bi-grip-vertical" }, null, -1)),
                          createTextVNode(" " + toDisplayString(spell.name), 1)
                        ]),
                        createBaseVNode("div", _hoisted_20, [
                          createBaseVNode("span", _hoisted_21, toDisplayString(spell.level), 1),
                          createBaseVNode("span", _hoisted_22, toDisplayString(spell.type), 1),
                          createBaseVNode("span", _hoisted_23, toDisplayString(spell.classes.join(", ")), 1)
                        ])
                      ], 40, _hoisted_18)) : createCommentVNode("", true)
                    ], 64);
                  }), 256))
                ])
              ])
            ]),
            createBaseVNode("button", {
              class: "btn btn-primary",
              onClick: _cache[5] || (_cache[5] = ($event) => step.value = PRINT),
              disabled: outputSpells.value.length == 0
            }, [
              createBaseVNode("span", _hoisted_25, "Next (" + toDisplayString(countPrintOut(outputSpells.value)) + ")", 1),
              _cache[17] || (_cache[17] = createBaseVNode("span", { class: "bi bi-chevron-right" }, null, -1))
            ], 8, _hoisted_24)
          ])) : step.value == PRINT ? (openBlock(), createElementBlock("div", _hoisted_26, [
            createBaseVNode("div", _hoisted_27, [
              createBaseVNode("div", _hoisted_28, [
                createBaseVNode("button", {
                  class: "btn btn-transparent text-light",
                  style: { "padding": "0 .25em" },
                  onClick: _cache[6] || (_cache[6] = ($event) => step.value = SELECTION)
                }, [..._cache[18] || (_cache[18] = [
                  createBaseVNode("span", { class: "bi bi-chevron-left" }, null, -1)
                ])]),
                createBaseVNode("h5", _hoisted_29, toDisplayString(countPrintOut(outputSpells.value)) + " Spell Cards", 1)
              ]),
              createBaseVNode("button", {
                class: "btn btn-transparent text-light",
                style: { "padding": "0 .25em" },
                onClick: _cache[7] || (_cache[7] = ($event) => downloadPdf())
              }, [..._cache[19] || (_cache[19] = [
                createBaseVNode("span", { class: "bi bi-download" }, null, -1)
              ])])
            ]),
            createBaseVNode("div", _hoisted_30, [
              createBaseVNode("div", _hoisted_31, [
                _cache[20] || (_cache[20] = createBaseVNode("p", null, "Se você não estiver vizualizando o PDF pode tentar abrir em outra janela.", -1)),
                createBaseVNode("button", {
                  class: "btn btn-primary rounded-pill",
                  onClick: _cache[8] || (_cache[8] = ($event) => openPdf())
                }, "Abrir em outra janela")
              ]),
              _cache[21] || (_cache[21] = createBaseVNode("div", {
                id: "divOutput",
                style: { "padding": "0", "height": "100%" }
              }, null, -1))
            ])
          ])) : createCommentVNode("", true)
        ]),
        _cache[23] || (_cache[23] = createBaseVNode("div", { class: "container mt-3 text-center" }, [
          createBaseVNode("p", null, [
            createTextVNode("Powered by "),
            createBaseVNode("a", {
              href: "https://github.com/devConcordia",
              target: "_blank",
              rel: "noopener noreferrer"
            }, [
              createBaseVNode("i", { class: "bi bi-github" }),
              createTextVNode(" devConcordia")
            ])
          ])
        ], -1))
      ]);
    };
  }
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-530c9bc9"]]);
createApp(App).mount("#app");
