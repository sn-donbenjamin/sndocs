/*! RESOURCE: /scripts/doctype/js_includes_doctype.js */
/*! RESOURCE: /scripts/lib/prototype.min.js */
var Prototype = {
  Version: "1.7.3",
  Browser: (function() {
    var b = navigator.userAgent;
    var a = Object.prototype.toString.call(window.opera) == "[object Opera]";
    return {
      IE: !!window.attachEvent && !a,
      Opera: a,
      WebKit: b.indexOf("AppleWebKit/") > -1,
      Gecko: b.indexOf("Gecko") > -1 && b.indexOf("KHTML") === -1,
      MobileSafari: /Apple.*Mobile/.test(b)
    }
  })(),
  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function() {
      var a = window.Element || window.HTMLElement;
      return !!(a && a.prototype)
    })(),
    SpecificElementExtensions: (function() {
      if (typeof window.HTMLDivElement !== "undefined") {
        return true
      }
      var c = document.createElement("div"),
        b = document.createElement("form"),
        a = false;
      if (c.__proto__ && (c.__proto__ !== b.__proto__)) {
        a = true
      }
      c = b = null;
      return a
    })()
  },
  ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script\\s*>",
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
  emptyFunction: function() {},
  K: function(a) {
    return a
  }
};
if (Prototype.Browser.MobileSafari) {
  Prototype.BrowserFeatures.SpecificElementExtensions = false
}
var Class = (function() {
  var d = (function() {
    for (var e in {
        toString: 1
      }) {
      if (e === "toString") {
        return false
      }
    }
    return true
  })();

  function a() {}

  function b() {
    var h = null,
      g = $A(arguments);
    if (Object.isFunction(g[0])) {
      h = g.shift()
    }

    function e() {
      this.initialize.apply(this, arguments)
    }
    Object.extend(e, Class.Methods);
    e.superclass = h;
    e.subclasses = [];
    if (h) {
      a.prototype = h.prototype;
      e.prototype = new a;
      h.subclasses.push(e)
    }
    for (var f = 0, j = g.length; f < j; f++) {
      e.addMethods(g[f])
    }
    if (!e.prototype.initialize) {
      e.prototype.initialize = Prototype.emptyFunction
    }
    e.prototype.constructor = e;
    return e
  }

  function c(l) {
    var g = this.superclass && this.superclass.prototype,
      f = Object.keys(l);
    if (d) {
      if (l.toString != Object.prototype.toString) {
        f.push("toString")
      }
      if (l.valueOf != Object.prototype.valueOf) {
        f.push("valueOf")
      }
    }
    for (var e = 0, h = f.length; e < h; e++) {
      var k = f[e],
        j = l[k];
      if (g && Object.isFunction(j) && j.argumentNames()[0] == "$super") {
        var m = j;
        j = (function(i) {
          return function() {
            return g[i].apply(this, arguments)
          }
        })(k).wrap(m);
        j.valueOf = (function(i) {
          return function() {
            return i.valueOf.call(i)
          }
        })(m);
        j.toString = (function(i) {
          return function() {
            return i.toString.call(i)
          }
        })(m)
      }
      this.prototype[k] = j
    }
    return this
  }
  return {
    create: b,
    Methods: {
      addMethods: c
    }
  }
})();
(function() {
  var y = Object.prototype.toString,
    k = Object.prototype.hasOwnProperty,
    z = "Null",
    B = "Undefined",
    K = "Boolean",
    w = "Number",
    v = "String",
    I = "Object",
    i = "[object Function]",
    d = "[object Boolean]",
    j = "[object Number]",
    f = "[object String]",
    b = "[object Array]",
    H = "[object Date]",
    e = window.JSON && typeof JSON.stringify === "function" && JSON.stringify(0) === "0" && typeof JSON.stringify(Prototype.K) === "undefined";
  var q = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];
  var a = (function() {
    for (var L in {
        toString: 1
      }) {
      if (L === "toString") {
        return false
      }
    }
    return true
  })();

  function D(M) {
    switch (M) {
      case null:
        return z;
      case (void 0):
        return B
    }
    var L = typeof M;
    switch (L) {
      case "boolean":
        return K;
      case "number":
        return w;
      case "string":
        return v
    }
    return I
  }

  function h(L, N) {
    for (var M in N) {
      L[M] = N[M]
    }
    return L
  }

  function l(L) {
    try {
      if (o(L)) {
        return "undefined"
      }
      if (L === null) {
        return "null"
      }
      return L.inspect ? L.inspect() : String(L)
    } catch (M) {
      if (M instanceof RangeError) {
        return "..."
      }
      throw M
    }
  }

  function A(L) {
    return m("", {
      "": L
    }, [])
  }

  function m(U, R, S) {
    var T = R[U];
    if (D(T) === I && typeof T.toJSON === "function") {
      T = T.toJSON(U)
    }
    var N = y.call(T);
    switch (N) {
      case j:
      case d:
      case f:
        T = T.valueOf()
    }
    switch (T) {
      case null:
        return "null";
      case true:
        return "true";
      case false:
        return "false"
    }
    var Q = typeof T;
    switch (Q) {
      case "string":
        return T.inspect(true);
      case "number":
        return isFinite(T) ? String(T) : "null";
      case "object":
        for (var M = 0, L = S.length; M < L; M++) {
          if (S[M] === T) {
            throw new TypeError("Cyclic reference to '" + T + "' in object")
          }
        }
        S.push(T);
        var P = [];
        if (N === b) {
          for (var M = 0, L = T.length; M < L; M++) {
            var O = m(M, T, S);
            P.push(typeof O === "undefined" ? "null" : O)
          }
          P = "[" + P.join(",") + "]"
        } else {
          var V = Object.keys(T);
          for (var M = 0, L = V.length; M < L; M++) {
            var U = V[M],
              O = m(U, T, S);
            if (typeof O !== "undefined") {
              P.push(U.inspect(true) + ":" + O)
            }
          }
          P = "{" + P.join(",") + "}"
        }
        S.pop();
        return P
    }
  }

  function J(L) {
    return JSON.stringify(L)
  }

  function C(L) {
    return $H(L).toQueryString()
  }

  function p(L) {
    return L && L.toHTML ? L.toHTML() : String.interpret(L)
  }

  function x(L) {
    if (D(L) !== I) {
      throw new TypeError()
    }
    var N = [];
    for (var O in L) {
      if (k.call(L, O)) {
        N.push(O)
      }
    }
    if (a) {
      for (var M = 0; O = q[M]; M++) {
        if (k.call(L, O)) {
          N.push(O)
        }
      }
    }
    return N
  }

  function G(L) {
    var M = [];
    for (var N in L) {
      M.push(L[N])
    }
    return M
  }

  function s(L) {
    return h({}, L)
  }

  function E(L) {
    return !!(L && L.nodeType == 1)
  }

  function u(L) {
    return y.call(L) === b
  }
  var c = (typeof Array.isArray == "function") && Array.isArray([]) && !Array.isArray({});
  if (c) {
    u = Array.isArray
  }

  function r(L) {
    return L instanceof Hash
  }

  function n(L) {
    return y.call(L) === i
  }

  function g(L) {
    return y.call(L) === f
  }

  function F(L) {
    return y.call(L) === j
  }

  function t(L) {
    return y.call(L) === H
  }

  function o(L) {
    return typeof L === "undefined"
  }
  h(Object, {
    extend: h,
    inspect: l,
    toJSON: e ? J : A,
    toQueryString: C,
    toHTML: p,
    keys: Object.keys || x,
    values: G,
    clone: s,
    isElement: E,
    isArray: u,
    isHash: r,
    isFunction: n,
    isString: g,
    isNumber: F,
    isDate: t,
    isUndefined: o
  })
})();
Object.extend(Function.prototype, (function() {
  var l = Array.prototype.slice;

  function d(p, m) {
    var o = p.length,
      n = m.length;
    while (n--) {
      p[o + n] = m[n]
    }
    return p
  }

  function j(n, m) {
    n = l.call(n, 0);
    return d(n, m)
  }

  function g() {
    var m = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
    return m.length == 1 && !m[0] ? [] : m
  }

  function h(o) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) {
      return this
    }
    if (!Object.isFunction(this)) {
      throw new TypeError("The object is not callable.")
    }
    var q = function() {};
    var m = this,
      n = l.call(arguments, 1);
    var p = function() {
      var r = j(n, arguments);
      var s = this instanceof p ? this : o;
      return m.apply(s, r)
    };
    q.prototype = this.prototype;
    p.prototype = new q();
    return p
  }

  function f(o) {
    var m = this,
      n = l.call(arguments, 1);
    return function(q) {
      var p = d([q || window.event], n);
      return m.apply(o, p)
    }
  }

  function k() {
    if (!arguments.length) {
      return this
    }
    var m = this,
      n = l.call(arguments, 0);
    return function() {
      var o = j(n, arguments);
      return m.apply(this, o)
    }
  }

  function e(o) {
    var m = this,
      n = l.call(arguments, 1);
    o = o * 1000;
    return window.setTimeout(function() {
      return m.apply(m, n)
    }, o)
  }

  function a() {
    var m = d([0.01], arguments);
    return this.delay.apply(this, m)
  }

  function c(n) {
    var m = this;
    return function() {
      var o = d([m.bind(this)], arguments);
      return n.apply(this, o)
    }
  }

  function b() {
    if (this._methodized) {
      return this._methodized
    }
    var m = this;
    return this._methodized = function() {
      var n = d([this], arguments);
      return m.apply(null, n)
    }
  }
  var i = {
    argumentNames: g,
    bindAsEventListener: f,
    curry: k,
    delay: e,
    defer: a,
    wrap: c,
    methodize: b
  };
  if (!Function.prototype.bind) {
    i.bind = h
  }
  return i
})());
(function(c) {
  function b() {
    return this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + "Z"
  }

  function a() {
    return this.toISOString()
  }
  if (!c.toISOString) {
    c.toISOString = b
  }
  if (!c.toJSON) {
    c.toJSON = a
  }
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(a) {
  return String(a).replace(/([.*+?^=!:()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
  initialize: function(b, a) {
    this.callback = b;
    this.frequency = a;
    this.currentlyExecuting = false;
    this.registerCallback()
  },
  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
  },
  execute: function() {
    this.callback(this)
  },
  stop: function() {
    if (!this.timer) {
      return
    }
    clearInterval(this.timer);
    this.timer = null
  },
  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false
      } catch (a) {
        this.currentlyExecuting = false;
        throw a
      }
    }
  }
});
Object.extend(String, {
  interpret: function(a) {
    return a == null ? "" : String(a)
  },
  specialChar: {
    "\b": "\\b",
    "\t": "\\t",
    "\n": "\\n",
    "\f": "\\f",
    "\r": "\\r",
    "\\": "\\\\"
  }
});
Object.extend(String.prototype, (function() {
  var NATIVE_JSON_PARSE_SUPPORT = window.JSON && typeof JSON.parse === "function" && JSON.parse('{"test": true}').test;

  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) {
      return replacement
    }
    var template = new Template(replacement);
    return function(match) {
      return template.evaluate(match)
    }
  }

  function isNonEmptyRegExp(regexp) {
    return regexp.source && regexp.source !== "(?:)"
  }

  function gsub(pattern, replacement) {
    var result = "",
      source = this,
      match;
    replacement = prepareReplacement(replacement);
    if (Object.isString(pattern)) {
      pattern = RegExp.escape(pattern)
    }
    if (!(pattern.length || isNonEmptyRegExp(pattern))) {
      replacement = replacement("");
      return replacement + source.split("").join(replacement) + replacement
    }
    while (source.length > 0) {
      match = source.match(pattern);
      if (match && match[0].length > 0) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source = source.slice(match.index + match[0].length)
      } else {
        result += source, source = ""
      }
    }
    return result
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;
    return this.gsub(pattern, function(match) {
      if (--count < 0) {
        return match[0]
      }
      return replacement(match)
    })
  }

  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this)
  }

  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? "..." : truncation;
    return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this)
  }

  function strip() {
    return this.replace(/^\s+/, "").replace(/\s+$/, "")
  }

  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, "")
  }

  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
  }

  function extractScripts() {
    var matchAll = new RegExp(Prototype.ScriptFragment, "img"),
      matchOne = new RegExp(Prototype.ScriptFragment, "im");
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ["", ""])[1]
    })
  }

  function evalScripts() {
    return this.extractScripts().map(function(script) {
      return eval(script)
    })
  }

  function escapeHTML() {
    return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
  }

  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) {
      return {}
    }
    return match[1].split(separator || "&").inject({}, function(hash, pair) {
      if ((pair = pair.split("="))[0]) {
        var key = decodeURIComponent(pair.shift()),
          value = pair.length > 1 ? pair.join("=") : pair[0];
        if (value != undefined) {
          value = value.gsub("+", " ");
          value = decodeURIComponent(value)
        }
        if (key in hash) {
          if (!Object.isArray(hash[key])) {
            hash[key] = [hash[key]]
          }
          hash[key].push(value)
        } else {
          hash[key] = value
        }
      }
      return hash
    })
  }

  function toArray() {
    return this.split("")
  }

  function succ() {
    return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
  }

  function times(count) {
    return count < 1 ? "" : new Array(count + 1).join(this)
  }

  function camelize() {
    return this.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : ""
    })
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
  }

  function underscore() {
    return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
  }

  function dasherize() {
    return this.replace(/_/g, "-")
  }

  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in String.specialChar) {
        return String.specialChar[character]
      }
      return "\\u00" + character.charCodeAt().toPaddedString(2, 16)
    });
    if (useDoubleQuotes) {
      return '"' + escapedString.replace(/"/g, '\\"') + '"'
    }
    return "'" + escapedString.replace(/'/g, "\\'") + "'"
  }

  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, "$1")
  }

  function isJSON() {
    var str = this;
    if (str.blank()) {
      return false
    }
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@");
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
    return (/^[\],:{}\s]*$/).test(str)
  }

  function evalJSON(sanitize) {
    var json = this.unfilterJSON(),
      cx = /[\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff\u0000]/g;
    if (cx.test(json)) {
      json = json.replace(cx, function(a) {
        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
      })
    }
    try {
      if (!sanitize || json.isJSON()) {
        return eval("(" + json + ")")
      }
    } catch (e) {}
    throw new SyntaxError("Badly formed JSON string: " + this.inspect())
  }

  function parseJSON() {
    var json = this.unfilterJSON();
    return JSON.parse(json)
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1
  }

  function startsWith(pattern, position) {
    position = Object.isNumber(position) ? position : 0;
    return this.lastIndexOf(pattern, position) === position
  }

  function endsWith(pattern, position) {
    pattern = String(pattern);
    position = Object.isNumber(position) ? position : this.length;
    if (position < 0) {
      position = 0
    }
    if (position > this.length) {
      position = this.length
    }
    var d = position - pattern.length;
    return d >= 0 && this.indexOf(pattern, d) === d
  }

  function empty() {
    return this == ""
  }

  function blank() {
    return /^\s*$/.test(this)
  }

  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object)
  }
  return {
    gsub: gsub,
    sub: sub,
    scan: scan,
    truncate: truncate,
    strip: String.prototype.trim || strip,
    stripTags: stripTags,
    stripScripts: stripScripts,
    extractScripts: extractScripts,
    evalScripts: evalScripts,
    escapeHTML: escapeHTML,
    unescapeHTML: unescapeHTML,
    toQueryParams: toQueryParams,
    parseQuery: toQueryParams,
    toArray: toArray,
    succ: succ,
    times: times,
    camelize: camelize,
    capitalize: capitalize,
    underscore: underscore,
    dasherize: dasherize,
    inspect: inspect,
    unfilterJSON: unfilterJSON,
    isJSON: isJSON,
    evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
    include: include,
    startsWith: String.prototype.startsWith || startsWith,
    endsWith: String.prototype.endsWith || endsWith,
    empty: empty,
    blank: blank,
    interpolate: interpolate
  }
})());
var Template = Class.create({
  initialize: function(a, b) {
    this.template = a.toString();
    this.pattern = b || Template.Pattern
  },
  evaluate: function(a) {
    if (a && Object.isFunction(a.toTemplateReplacements)) {
      a = a.toTemplateReplacements()
    }
    return this.template.gsub(this.pattern, function(d) {
      if (a == null) {
        return (d[1] + "")
      }
      var f = d[1] || "";
      if (f == "\\") {
        return d[2]
      }
      var b = a,
        g = d[3],
        e = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      d = e.exec(g);
      if (d == null) {
        return f
      }
      while (d != null) {
        var c = d[1].startsWith("[") ? d[2].replace(/\\\\]/g, "]") : d[1];
        b = b[c];
        if (null == b || "" == d[3]) {
          break
        }
        g = g.substring("[" == d[3] ? d[1].length : d[0].length);
        d = e.exec(g)
      }
      return f + String.interpret(b)
    })
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function() {
  function c(x, w) {
    try {
      this._each(x, w)
    } catch (y) {
      if (y != $break) {
        throw y
      }
    }
    return this
  }

  function r(z, y, x) {
    var w = -z,
      A = [],
      B = this.toArray();
    if (z < 1) {
      return B
    }
    while ((w += z) < B.length) {
      A.push(B.slice(w, w + z))
    }
    return A.collect(y, x)
  }

  function b(y, x) {
    y = y || Prototype.K;
    var w = true;
    this.each(function(A, z) {
      w = w && !!y.call(x, A, z, this);
      if (!w) {
        throw $break
      }
    }, this);
    return w
  }

  function i(y, x) {
    y = y || Prototype.K;
    var w = false;
    this.each(function(A, z) {
      if (w = !!y.call(x, A, z, this)) {
        throw $break
      }
    }, this);
    return w
  }

  function j(y, x) {
    y = y || Prototype.K;
    var w = [];
    this.each(function(A, z) {
      w.push(y.call(x, A, z, this))
    }, this);
    return w
  }

  function t(y, x) {
    var w;
    this.each(function(A, z) {
      if (y.call(x, A, z, this)) {
        w = A;
        throw $break
      }
    }, this);
    return w
  }

  function h(y, x) {
    var w = [];
    this.each(function(A, z) {
      if (y.call(x, A, z, this)) {
        w.push(A)
      }
    }, this);
    return w
  }

  function g(z, y, x) {
    y = y || Prototype.K;
    var w = [];
    if (Object.isString(z)) {
      z = new RegExp(RegExp.escape(z))
    }
    this.each(function(B, A) {
      if (z.match(B)) {
        w.push(y.call(x, B, A, this))
      }
    }, this);
    return w
  }

  function a(w) {
    if (Object.isFunction(this.indexOf) && this.indexOf(w) != -1) {
      return true
    }
    var x = false;
    this.each(function(y) {
      if (y == w) {
        x = true;
        throw $break
      }
    });
    return x
  }

  function q(x, w) {
    w = Object.isUndefined(w) ? null : w;
    return this.eachSlice(x, function(y) {
      while (y.length < x) {
        y.push(w)
      }
      return y
    })
  }

  function l(w, y, x) {
    this.each(function(A, z) {
      w = y.call(x, w, A, z, this)
    }, this);
    return w
  }

  function v(x) {
    var w = $A(arguments).slice(1);
    return this.map(function(y) {
      return y[x].apply(y, w)
    })
  }

  function p(y, x) {
    y = y || Prototype.K;
    var w;
    this.each(function(A, z) {
      A = y.call(x, A, z, this);
      if (w == null || A >= w) {
        w = A
      }
    }, this);
    return w
  }

  function n(y, x) {
    y = y || Prototype.K;
    var w;
    this.each(function(A, z) {
      A = y.call(x, A, z, this);
      if (w == null || A < w) {
        w = A
      }
    }, this);
    return w
  }

  function e(z, x) {
    z = z || Prototype.K;
    var y = [],
      w = [];
    this.each(function(B, A) {
      (z.call(x, B, A, this) ? y : w).push(B)
    }, this);
    return [y, w]
  }

  function f(x) {
    var w = [];
    this.each(function(y) {
      w.push(y[x])
    });
    return w
  }

  function d(y, x) {
    var w = [];
    this.each(function(A, z) {
      if (!y.call(x, A, z, this)) {
        w.push(A)
      }
    }, this);
    return w
  }

  function m(x, w) {
    return this.map(function(z, y) {
      return {
        value: z,
        criteria: x.call(w, z, y, this)
      }
    }, this).sort(function(B, A) {
      var z = B.criteria,
        y = A.criteria;
      return z < y ? -1 : z > y ? 1 : 0
    }).pluck("value")
  }

  function o() {
    return this.map()
  }

  function s() {
    var x = Prototype.K,
      w = $A(arguments);
    if (Object.isFunction(w.last())) {
      x = w.pop()
    }
    var y = [this].concat(w).map($A);
    return this.map(function(A, z) {
      return x(y.pluck(z))
    })
  }

  function k() {
    return this.toArray().length
  }

  function u() {
    return "#<Enumerable:" + this.toArray().inspect() + ">"
  }
  return {
    each: c,
    eachSlice: r,
    all: b,
    every: b,
    any: i,
    some: i,
    collect: j,
    map: j,
    detect: t,
    findAll: h,
    select: h,
    filter: h,
    grep: g,
    include: a,
    member: a,
    inGroupsOf: q,
    inject: l,
    invoke: v,
    max: p,
    min: n,
    partition: e,
    pluck: f,
    reject: d,
    sortBy: m,
    toArray: o,
    entries: o,
    zip: s,
    size: k,
    inspect: u,
    find: t
  }
})();

function $A(c) {
  if (!c) {
    return []
  }
  if ("toArray" in Object(c)) {
    return c.toArray()
  }
  var b = c.length || 0,
    a = new Array(b);
  while (b--) {
    a[b] = c[b]
  }
  return a
}

function $w(a) {
  if (!Object.isString(a)) {
    return []
  }
  a = a.strip();
  return a ? a.split(/\s+/) : []
}
Array.from = $A;
(function() {
  var v = Array.prototype,
    o = v.slice,
    q = v.forEach;

  function b(B, A) {
    for (var z = 0, C = this.length >>> 0; z < C; z++) {
      if (z in this) {
        B.call(A, this[z], z, this)
      }
    }
  }
  if (!q) {
    q = b
  }

  function n() {
    this.length = 0;
    return this
  }

  function d() {
    return this[0]
  }

  function g() {
    return this[this.length - 1]
  }

  function k() {
    return this.select(function(z) {
      return z != null
    })
  }

  function y() {
    return this.inject([], function(A, z) {
      if (Object.isArray(z)) {
        return A.concat(z.flatten())
      }
      A.push(z);
      return A
    })
  }

  function j() {
    var z = o.call(arguments, 0);
    return this.select(function(A) {
      return !z.include(A)
    })
  }

  function f(z) {
    return (z === false ? this.toArray() : this)._reverse()
  }

  function m(z) {
    return this.inject([], function(C, B, A) {
      if (0 == A || (z ? C.last() != B : !C.include(B))) {
        C.push(B)
      }
      return C
    })
  }

  function r(z) {
    return this.uniq().findAll(function(A) {
      return z.indexOf(A) !== -1
    })
  }

  function t() {
    return o.call(this, 0)
  }

  function l() {
    return this.length
  }

  function w() {
    return "[" + this.map(Object.inspect).join(", ") + "]"
  }

  function a(C, A) {
    if (this == null) {
      throw new TypeError()
    }
    var D = Object(this),
      B = D.length >>> 0;
    if (B === 0) {
      return -1
    }
    A = Number(A);
    if (isNaN(A)) {
      A = 0
    } else {
      if (A !== 0 && isFinite(A)) {
        A = (A > 0 ? 1 : -1) * Math.floor(Math.abs(A))
      }
    }
    if (A > B) {
      return -1
    }
    var z = A >= 0 ? A : Math.max(B - Math.abs(A), 0);
    for (; z < B; z++) {
      if (z in D && D[z] === C) {
        return z
      }
    }
    return -1
  }

  function p(C, A) {
    if (this == null) {
      throw new TypeError()
    }
    var D = Object(this),
      B = D.length >>> 0;
    if (B === 0) {
      return -1
    }
    if (!Object.isUndefined(A)) {
      A = Number(A);
      if (isNaN(A)) {
        A = 0
      } else {
        if (A !== 0 && isFinite(A)) {
          A = (A > 0 ? 1 : -1) * Math.floor(Math.abs(A))
        }
      }
    } else {
      A = B
    }
    var z = A >= 0 ? Math.min(A, B - 1) : B - Math.abs(A);
    for (; z >= 0; z--) {
      if (z in D && D[z] === C) {
        return z
      }
    }
    return -1
  }

  function c(G) {
    var E = [],
      F = o.call(arguments, 0),
      H, A = 0;
    F.unshift(this);
    for (var D = 0, z = F.length; D < z; D++) {
      H = F[D];
      if (Object.isArray(H) && !("callee" in H)) {
        for (var C = 0, B = H.length; C < B; C++) {
          if (C in H) {
            E[A] = H[C]
          }
          A++
        }
      } else {
        E[A++] = H
      }
    }
    E.length = A;
    return E
  }

  function s(z) {
    return function() {
      if (arguments.length === 0) {
        return z.call(this, Prototype.K)
      } else {
        if (arguments[0] === undefined) {
          var A = o.call(arguments, 1);
          A.unshift(Prototype.K);
          return z.apply(this, A)
        } else {
          return z.apply(this, arguments)
        }
      }
    }
  }

  function u(D) {
    if (this == null) {
      throw new TypeError()
    }
    D = D || Prototype.K;
    var z = Object(this);
    var C = [],
      B = arguments[1],
      F = 0;
    for (var A = 0, E = z.length >>> 0; A < E; A++) {
      if (A in z) {
        C[F] = D.call(B, z[A], A, z)
      }
      F++
    }
    C.length = F;
    return C
  }
  if (v.map) {
    u = s(Array.prototype.map)
  }

  function h(D) {
    if (this == null || !Object.isFunction(D)) {
      throw new TypeError()
    }
    var z = Object(this);
    var C = [],
      B = arguments[1],
      F;
    for (var A = 0, E = z.length >>> 0; A < E; A++) {
      if (A in z) {
        F = z[A];
        if (D.call(B, F, A, z)) {
          C.push(F)
        }
      }
    }
    return C
  }
  if (v.filter) {
    h = Array.prototype.filter
  }

  function i(C) {
    if (this == null) {
      throw new TypeError()
    }
    C = C || Prototype.K;
    var B = arguments[1];
    var z = Object(this);
    for (var A = 0, D = z.length >>> 0; A < D; A++) {
      if (A in z && C.call(B, z[A], A, z)) {
        return true
      }
    }
    return false
  }
  if (v.some) {
    i = s(Array.prototype.some)
  }

  function x(C) {
    if (this == null) {
      throw new TypeError()
    }
    C = C || Prototype.K;
    var B = arguments[1];
    var z = Object(this);
    for (var A = 0, D = z.length >>> 0; A < D; A++) {
      if (A in z && !C.call(B, z[A], A, z)) {
        return false
      }
    }
    return true
  }
  if (v.every) {
    x = s(Array.prototype.every)
  }
  Object.extend(v, Enumerable);
  if (v.entries === Enumerable.entries) {
    delete v.entries
  }
  if (!v._reverse) {
    v._reverse = v.reverse
  }
  Object.extend(v, {
    _each: q,
    map: u,
    collect: u,
    select: h,
    filter: h,
    findAll: h,
    some: i,
    any: i,
    every: x,
    all: x,
    clear: n,
    first: d,
    last: g,
    compact: k,
    flatten: y,
    without: j,
    reverse: f,
    uniq: m,
    intersect: r,
    clone: t,
    toArray: t,
    size: l,
    inspect: w
  });
  var e = (function() {
    return [].concat(arguments)[0][0] !== 1
  })(1, 2);
  if (e) {
    v.concat = c
  }
  if (!v.indexOf) {
    v.indexOf = a
  }
  if (!v.lastIndexOf) {
    v.lastIndexOf = p
  }
})();

function $H(a) {
  return new Hash(a)
}
var Hash = Class.create(Enumerable, (function() {
  function e(p) {
    this._object = Object.isHash(p) ? p.toObject() : Object.clone(p)
  }

  function f(s, r) {
    var q = 0;
    for (var p in this._object) {
      var t = this._object[p],
        u = [p, t];
      u.key = p;
      u.value = t;
      s.call(r, u, q);
      q++
    }
  }

  function j(p, q) {
    return this._object[p] = q
  }

  function c(p) {
    if (this._object[p] !== Object.prototype[p]) {
      return this._object[p]
    }
  }

  function m(p) {
    var q = this._object[p];
    delete this._object[p];
    return q
  }

  function o() {
    return Object.clone(this._object)
  }

  function n() {
    return this.pluck("key")
  }

  function l() {
    return this.pluck("value")
  }

  function g(q) {
    var p = this.detect(function(r) {
      return r.value === q
    });
    return p && p.key
  }

  function i(p) {
    return this.clone().update(p)
  }

  function d(p) {
    return new Hash(p).inject(this, function(q, r) {
      q.set(r.key, r.value);
      return q
    })
  }

  function b(p, q) {
    if (Object.isUndefined(q)) {
      return p
    }
    q = String.interpret(q);
    q = q.gsub(/(\r)?\n/, "\r\n");
    q = encodeURIComponent(q);
    q = q.gsub(/%20/, "+");
    return p + "=" + q
  }

  function a() {
    return this.inject([], function(t, w) {
      var s = encodeURIComponent(w.key),
        q = w.value;
      if (q && typeof q == "object") {
        if (Object.isArray(q)) {
          var v = [];
          for (var r = 0, p = q.length, u; r < p; r++) {
            u = q[r];
            v.push(b(s, u))
          }
          return t.concat(v)
        }
      } else {
        t.push(b(s, q))
      }
      return t
    }).join("&")
  }

  function k() {
    return "#<Hash:{" + this.map(function(p) {
      return p.map(Object.inspect).join(": ")
    }).join(", ") + "}>"
  }

  function h() {
    return new Hash(this)
  }
  return {
    initialize: e,
    _each: f,
    set: j,
    get: c,
    unset: m,
    toObject: o,
    toTemplateReplacements: o,
    keys: n,
    values: l,
    index: g,
    merge: i,
    update: d,
    toQueryString: a,
    inspect: k,
    toJSON: o,
    clone: h
  }
})());
Hash.from = $H;
Object.extend(Number.prototype, (function() {
  function d() {
    return this.toPaddedString(2, 16)
  }

  function b() {
    return this + 1
  }

  function h(j, i) {
    $R(0, this, true).each(j, i);
    return this
  }

  function g(k, j) {
    var i = this.toString(j || 10);
    return "0".times(k - i.length) + i
  }

  function a() {
    return Math.abs(this)
  }

  function c() {
    return Math.round(this)
  }

  function e() {
    return Math.ceil(this)
  }

  function f() {
    return Math.floor(this)
  }
  return {
    toColorPart: d,
    succ: b,
    times: h,
    toPaddedString: g,
    abs: a,
    round: c,
    ceil: e,
    floor: f
  }
})());

function $R(c, a, b) {
  return new ObjectRange(c, a, b)
}
var ObjectRange = Class.create(Enumerable, (function() {
  function b(f, d, e) {
    this.start = f;
    this.end = d;
    this.exclusive = e
  }

  function c(f, e) {
    var g = this.start,
      d;
    for (d = 0; this.include(g); d++) {
      f.call(e, g, d);
      g = g.succ()
    }
  }

  function a(d) {
    if (d < this.start) {
      return false
    }
    if (this.exclusive) {
      return d < this.end
    }
    return d <= this.end
  }
  return {
    initialize: b,
    _each: c,
    include: a
  }
})());
var Abstract = {};
var Try = {
  these: function() {
    var c;
    for (var b = 0, d = arguments.length; b < d; b++) {
      var a = arguments[b];
      try {
        c = a();
        break
      } catch (f) {}
    }
    return c
  }
};
var Ajax = {
  getTransport: function() {
    return Try.these(function() {
      return new XMLHttpRequest()
    }, function() {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }, function() {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }) || false
  },
  activeRequestCount: 0
};
Ajax.Responders = {
  responders: [],
  _each: function(b, a) {
    this.responders._each(b, a)
  },
  register: function(a) {
    if (!this.include(a)) {
      this.responders.push(a)
    }
  },
  unregister: function(a) {
    this.responders = this.responders.without(a)
  },
  dispatch: function(d, b, c, a) {
    this.each(function(f) {
      if (Object.isFunction(f[d])) {
        try {
          f[d].apply(f, [b, c, a])
        } catch (g) {}
      }
    })
  }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
  onCreate: function() {
    Ajax.activeRequestCount++
  },
  onComplete: function() {
    Ajax.activeRequestCount--
  }
});
Ajax.Base = Class.create({
  initialize: function(a) {
    this.options = {
      method: "post",
      asynchronous: true,
      contentType: "application/x-www-form-urlencoded",
      encoding: "UTF-8",
      parameters: "",
      evalJSON: true,
      evalJS: true
    };
    Object.extend(this.options, a || {});
    this.options.method = this.options.method.toLowerCase();
    if (Object.isHash(this.options.parameters)) {
      this.options.parameters = this.options.parameters.toObject()
    }
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,
  initialize: function($super, b, a) {
    $super(a);
    this.transport = Ajax.getTransport();
    this.request(b)
  },
  request: function(b) {
    this.url = b;
    this.method = this.options.method;
    var d = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);
    if (!["get", "post"].include(this.method)) {
      d += (d ? "&" : "") + "_method=" + this.method;
      this.method = "post"
    }
    if (d && this.method === "get") {
      this.url += (this.url.include("?") ? "&" : "?") + d
    }
    this.parameters = d.toQueryParams();
    try {
      var a = new Ajax.Response(this);
      if (this.options.onCreate) {
        this.options.onCreate(a)
      }
      Ajax.Responders.dispatch("onCreate", this, a);
      this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
      if (this.options.asynchronous) {
        this.respondToReadyState.bind(this).defer(1)
      }
      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();
      this.body = this.method == "post" ? (this.options.postBody || d) : null;
      this.transport.send(this.body);
      if (!this.options.asynchronous && this.transport.overrideMimeType) {
        this.onStateChange()
      }
    } catch (c) {
      this.dispatchException(c)
    }
  },
  onStateChange: function() {
    var a = this.transport.readyState;
    if (a > 1 && !((a == 4) && this._complete)) {
      this.respondToReadyState(this.transport.readyState)
    }
  },
  setRequestHeaders: function() {
    var e = {
      "X-Requested-With": "XMLHttpRequest",
      "X-Prototype-Version": Prototype.Version,
      Accept: "text/javascript, text/html, application/xml, text/xml, */*"
    };
    if (this.method == "post") {
      e["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : "");
      if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
        e.Connection = "close"
      }
    }
    if (typeof this.options.requestHeaders == "object") {
      var c = this.options.requestHeaders;
      if (Object.isFunction(c.push)) {
        for (var b = 0, d = c.length; b < d; b += 2) {
          e[c[b]] = c[b + 1]
        }
      } else {
        $H(c).each(function(f) {
          e[f.key] = f.value
        })
      }
    }
    for (var a in e) {
      if (e[a] != null) {
        this.transport.setRequestHeader(a, e[a])
      }
    }
  },
  success: function() {
    var a = this.getStatus();
    return !a || (a >= 200 && a < 300) || a == 304
  },
  getStatus: function() {
    try {
      if (this.transport.status === 1223) {
        return 204
      }
      return this.transport.status || 0
    } catch (a) {
      return 0
    }
  },
  respondToReadyState: function(a) {
    var c = Ajax.Request.Events[a],
      b = new Ajax.Response(this);
    if (c == "Complete") {
      try {
        this._complete = true;
        (this.options["on" + b.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(b, b.headerJSON)
      } catch (d) {
        this.dispatchException(d)
      }
      var f = b.getHeader("Content-type");
      if (this.options.evalJS == "force" || (this.options.evalJS && this.isSameOrigin() && f && f.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
        this.evalResponse()
      }
    }
    try {
      (this.options["on" + c] || Prototype.emptyFunction)(b, b.headerJSON);
      Ajax.Responders.dispatch("on" + c, this, b, b.headerJSON)
    } catch (d) {
      this.dispatchException(d)
    }
    if (c == "Complete") {
      this.transport.onreadystatechange = Prototype.emptyFunction
    }
  },
  isSameOrigin: function() {
    var a = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !a || (a[0] == "#{protocol}//#{domain}#{port}".interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ":" + location.port : ""
    }))
  },
  getHeader: function(a) {
    try {
      return this.transport.getResponseHeader(a) || null
    } catch (b) {
      return null
    }
  },
  evalResponse: function() {
    try {
      return eval((this.transport.responseText || "").unfilterJSON())
    } catch (e) {
      this.dispatchException(e)
    }
  },
  dispatchException: function(a) {
    (this.options.onException || Prototype.emptyFunction)(this, a);
    Ajax.Responders.dispatch("onException", this, a)
  }
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
  initialize: function(c) {
    this.request = c;
    var d = this.transport = c.transport,
      a = this.readyState = d.readyState;
    if ((a > 2 && !Prototype.Browser.IE) || a == 4) {
      this.status = this.getStatus();
      this.statusText = this.getStatusText();
      this.responseText = String.interpret(d.responseText);
      this.headerJSON = this._getHeaderJSON()
    }
    if (a == 4) {
      var b = d.responseXML;
      this.responseXML = Object.isUndefined(b) ? null : b;
      this.responseJSON = this._getResponseJSON()
    }
  },
  status: 0,
  statusText: "",
  getStatus: Ajax.Request.prototype.getStatus,
  getStatusText: function() {
    try {
      return this.transport.statusText || ""
    } catch (a) {
      return ""
    }
  },
  getHeader: Ajax.Request.prototype.getHeader,
  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders()
    } catch (a) {
      return null
    }
  },
  getResponseHeader: function(a) {
    return this.transport.getResponseHeader(a)
  },
  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders()
  },
  _getHeaderJSON: function() {
    var a = this.getHeader("X-JSON");
    if (!a) {
      return null
    }
    try {
      a = decodeURIComponent(escape(a))
    } catch (b) {}
    try {
      return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
    } catch (b) {
      this.request.dispatchException(b)
    }
  },
  _getResponseJSON: function() {
    var a = this.request.options;
    if (!a.evalJSON || (a.evalJSON != "force" && !(this.getHeader("Content-type") || "").include("application/json")) || this.responseText.blank()) {
      return null
    }
    try {
      return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
    } catch (b) {
      this.request.dispatchException(b)
    }
  }
});
Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, a, c, b) {
    this.container = {
      success: (a.success || a),
      failure: (a.failure || (a.success ? null : a))
    };
    b = Object.clone(b);
    var d = b.onComplete;
    b.onComplete = (function(e, f) {
      this.updateContent(e.responseText);
      if (Object.isFunction(d)) {
        d(e, f)
      }
    }).bind(this);
    $super(c, b)
  },
  updateContent: function(d) {
    var c = this.container[this.success() ? "success" : "failure"],
      a = this.options;
    if (!a.evalScripts) {
      d = d.stripScripts()
    }
    if (c = $(c)) {
      if (a.insertion) {
        if (Object.isString(a.insertion)) {
          var b = {};
          b[a.insertion] = d;
          c.insert(b)
        } else {
          a.insertion(c, d)
        }
      } else {
        c.update(d)
      }
    }
  }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, a, c, b) {
    $super(b);
    this.onComplete = this.options.onComplete;
    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);
    this.updater = {};
    this.container = a;
    this.url = c;
    this.start()
  },
  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent()
  },
  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
  },
  updateComplete: function(a) {
    if (this.options.decay) {
      this.decay = (a.responseText == this.lastText ? this.decay * this.options.decay : 1);
      this.lastText = a.responseText
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
  },
  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options)
  }
});
(function(a8) {
  var aE;
  var a1 = Array.prototype.slice;
  var av = document.createElement("div");

  function aZ(bp) {
    if (arguments.length > 1) {
      for (var F = 0, br = [], bq = arguments.length; F < bq; F++) {
        br.push(aZ(arguments[F]))
      }
      return br
    }
    if (Object.isString(bp)) {
      bp = document.getElementById(bp)
    }
    return aF.extend(bp)
  }
  a8.$ = aZ;
  if (!a8.Node) {
    a8.Node = {}
  }
  if (!a8.Node.ELEMENT_NODE) {
    Object.extend(a8.Node, {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11,
      NOTATION_NODE: 12
    })
  }
  var r = {};

  function aQ(F, i) {
    if (F === "select") {
      return false
    }
    if ("type" in i) {
      return false
    }
    return true
  }
  var d = (function() {
    try {
      var i = document.createElement('<input name="x">');
      return i.tagName.toLowerCase() === "input" && i.name === "x"
    } catch (F) {
      return false
    }
  })();
  var aI = a8.Element;

  function aF(F, i) {
    i = i || {};
    F = F.toLowerCase();
    if (d && i.name) {
      F = "<" + F + ' name="' + i.name + '">';
      delete i.name;
      return aF.writeAttribute(document.createElement(F), i)
    }
    if (!r[F]) {
      r[F] = aF.extend(document.createElement(F))
    }
    var bp = aQ(F, i) ? r[F].cloneNode(false) : document.createElement(F);
    return aF.writeAttribute(bp, i)
  }
  a8.Element = aF;
  Object.extend(a8.Element, aI || {});
  if (aI) {
    a8.Element.prototype = aI.prototype
  }
  aF.Methods = {
    ByTag: {},
    Simulated: {}
  };
  var a3 = {};
  var H = {
    id: "id",
    className: "class"
  };

  function ba(F) {
    F = aZ(F);
    var i = "<" + F.tagName.toLowerCase();
    var bp, br;
    for (var bq in H) {
      bp = H[bq];
      br = (F[bq] || "").toString();
      if (br) {
        i += " " + bp + "=" + br.inspect(true)
      }
    }
    return i + ">"
  }
  a3.inspect = ba;

  function v(i) {
    return aZ(i).getStyle("display") !== "none"
  }

  function ax(F, i) {
    F = aZ(F);
    if (typeof i !== "boolean") {
      i = !aF.visible(F)
    }
    aF[i ? "show" : "hide"](F);
    return F
  }

  function aH(i) {
    i = aZ(i);
    i.style.display = "none";
    return i
  }

  function j(i) {
    i = aZ(i);
    i.style.display = "";
    return i
  }
  Object.extend(a3, {
    visible: v,
    toggle: ax,
    hide: aH,
    show: j
  });

  function ad(i) {
    i = aZ(i);
    i.parentNode.removeChild(i);
    return i
  }
  var aT = (function() {
    var i = document.createElement("select"),
      F = true;
    i.innerHTML = '<option value="test">test</option>';
    if (i.options && i.options[0]) {
      F = i.options[0].nodeName.toUpperCase() !== "OPTION"
    }
    i = null;
    return F
  })();
  var I = (function() {
    try {
      var i = document.createElement("table");
      if (i && i.tBodies) {
        i.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
        var bp = typeof i.tBodies[0] == "undefined";
        i = null;
        return bp
      }
    } catch (F) {
      return true
    }
  })();
  var a2 = (function() {
    try {
      var i = document.createElement("div");
      i.innerHTML = "<link />";
      var bp = (i.childNodes.length === 0);
      i = null;
      return bp
    } catch (F) {
      return true
    }
  })();
  var x = aT || I || a2;
  var aq = (function() {
    var i = document.createElement("script"),
      bp = false;
    try {
      i.appendChild(document.createTextNode(""));
      bp = !i.firstChild || i.firstChild && i.firstChild.nodeType !== 3
    } catch (F) {
      bp = true
    }
    i = null;
    return bp
  })();

  function O(br, bt) {
    br = aZ(br);
    var bu = br.getElementsByTagName("*"),
      bq = bu.length;
    while (bq--) {
      Z(bu[bq])
    }
    if (bt && bt.toElement) {
      bt = bt.toElement()
    }
    if (Object.isElement(bt)) {
      return br.update().insert(bt)
    }
    bt = Object.toHTML(bt);
    var bp = br.tagName.toUpperCase();
    if (bp === "SCRIPT" && aq) {
      br.text = bt;
      return br
    }
    if (x) {
      if (bp in L.tags) {
        while (br.firstChild) {
          br.removeChild(br.firstChild)
        }
        var F = t(bp, bt.stripScripts());
        for (var bq = 0, bs; bs = F[bq]; bq++) {
          br.appendChild(bs)
        }
      } else {
        if (a2 && Object.isString(bt) && bt.indexOf("<link") > -1) {
          while (br.firstChild) {
            br.removeChild(br.firstChild)
          }
          var F = t(bp, bt.stripScripts(), true);
          for (var bq = 0, bs; bs = F[bq]; bq++) {
            br.appendChild(bs)
          }
        } else {
          br.innerHTML = bt.stripScripts()
        }
      }
    } else {
      br.innerHTML = bt.stripScripts()
    }
    bt.evalScripts.bind(bt).defer();
    return br
  }

  function ah(F, bp) {
    F = aZ(F);
    if (bp && bp.toElement) {
      bp = bp.toElement()
    } else {
      if (!Object.isElement(bp)) {
        bp = Object.toHTML(bp);
        var i = F.ownerDocument.createRange();
        i.selectNode(F);
        bp.evalScripts.bind(bp).defer();
        bp = i.createContextualFragment(bp.stripScripts())
      }
    }
    F.parentNode.replaceChild(bp, F);
    return F
  }
  var L = {
    before: function(i, F) {
      i.parentNode.insertBefore(F, i)
    },
    top: function(i, F) {
      i.insertBefore(F, i.firstChild)
    },
    bottom: function(i, F) {
      i.appendChild(F)
    },
    after: function(i, F) {
      i.parentNode.insertBefore(F, i.nextSibling)
    },
    tags: {
      TABLE: ["<table>", "</table>", 1],
      TBODY: ["<table><tbody>", "</tbody></table>", 2],
      TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
      TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
      SELECT: ["<select>", "</select>", 1]
    }
  };
  var aJ = L.tags;
  Object.extend(aJ, {
    THEAD: aJ.TBODY,
    TFOOT: aJ.TBODY,
    TH: aJ.TD
  });

  function ao(bp, bs) {
    bp = aZ(bp);
    if (bs && bs.toElement) {
      bs = bs.toElement()
    }
    if (Object.isElement(bs)) {
      bp.parentNode.replaceChild(bs, bp);
      return bp
    }
    bs = Object.toHTML(bs);
    var br = bp.parentNode,
      F = br.tagName.toUpperCase();
    if (F in L.tags) {
      var bt = aF.next(bp);
      var i = t(F, bs.stripScripts());
      br.removeChild(bp);
      var bq;
      if (bt) {
        bq = function(bu) {
          br.insertBefore(bu, bt)
        }
      } else {
        bq = function(bu) {
          br.appendChild(bu)
        }
      }
      i.each(bq)
    } else {
      bp.outerHTML = bs.stripScripts()
    }
    bs.evalScripts.bind(bs).defer();
    return bp
  }
  if ("outerHTML" in document.documentElement) {
    ah = ao
  }

  function a7(i) {
    if (Object.isUndefined(i) || i === null) {
      return false
    }
    if (Object.isString(i) || Object.isNumber(i)) {
      return true
    }
    if (Object.isElement(i)) {
      return true
    }
    if (i.toElement || i.toHTML) {
      return true
    }
    return false
  }

  function bn(br, bt, F) {
    F = F.toLowerCase();
    var bv = L[F];
    if (bt && bt.toElement) {
      bt = bt.toElement()
    }
    if (Object.isElement(bt)) {
      bv(br, bt);
      return br
    }
    bt = Object.toHTML(bt);
    var bq = ((F === "before" || F === "after") ? br.parentNode : br).tagName.toUpperCase();
    var bu = t(bq, bt.stripScripts());
    if (F === "top" || F === "after") {
      bu.reverse()
    }
    for (var bp = 0, bs; bs = bu[bp]; bp++) {
      bv(br, bs)
    }
    bt.evalScripts.bind(bt).defer()
  }

  function Q(F, bp) {
    F = aZ(F);
    if (a7(bp)) {
      bp = {
        bottom: bp
      }
    }
    for (var i in bp) {
      bn(F, bp[i], i)
    }
    return F
  }

  function u(F, bp, i) {
    F = aZ(F);
    if (Object.isElement(bp)) {
      aZ(bp).writeAttribute(i || {})
    } else {
      if (Object.isString(bp)) {
        bp = new aF(bp, i)
      } else {
        bp = new aF("div", bp)
      }
    }
    if (F.parentNode) {
      F.parentNode.replaceChild(bp, F)
    }
    bp.appendChild(F);
    return bp
  }

  function w(F) {
    F = aZ(F);
    var bp = F.firstChild;
    while (bp) {
      var i = bp.nextSibling;
      if (bp.nodeType === Node.TEXT_NODE && !/\S/.test(bp.nodeValue)) {
        F.removeChild(bp)
      }
      bp = i
    }
    return F
  }

  function a4(i) {
    return aZ(i).innerHTML.blank()
  }

  function t(bs, br, bt) {
    var bq = L.tags[bs],
      bu = av;
    var F = !!bq;
    if (!F && bt) {
      F = true;
      bq = ["", "", 0]
    }
    if (F) {
      bu.innerHTML = "&#160;" + bq[0] + br + bq[1];
      bu.removeChild(bu.firstChild);
      for (var bp = bq[2]; bp--;) {
        bu = bu.firstChild
      }
    } else {
      bu.innerHTML = br
    }
    return $A(bu.childNodes)
  }

  function E(bq, F) {
    if (!(bq = aZ(bq))) {
      return
    }
    var bs = bq.cloneNode(F);
    if (!aY) {
      bs._prototypeUID = aE;
      if (F) {
        var br = aF.select(bs, "*"),
          bp = br.length;
        while (bp--) {
          br[bp]._prototypeUID = aE
        }
      }
    }
    return aF.extend(bs)
  }

  function Z(F) {
    var i = M(F);
    if (i) {
      aF.stopObserving(F);
      if (!aY) {
        F._prototypeUID = aE
      }
      delete aF.Storage[i]
    }
  }

  function bl(bp) {
    var F = bp.length;
    while (F--) {
      Z(bp[F])
    }
  }

  function at(br) {
    var bq = br.length,
      bp, F;
    while (bq--) {
      bp = br[bq];
      F = M(bp);
      delete aF.Storage[F];
      delete Event.cache[F]
    }
  }
  if (aY) {
    bl = at
  }

  function m(bp) {
    if (!(bp = aZ(bp))) {
      return
    }
    Z(bp);
    var bq = bp.getElementsByTagName("*"),
      F = bq.length;
    while (F--) {
      Z(bq[F])
    }
    return null
  }
  Object.extend(a3, {
    remove: ad,
    update: O,
    replace: ah,
    insert: Q,
    wrap: u,
    cleanWhitespace: w,
    empty: a4,
    clone: E,
    purge: m
  });

  function am(i, bp, bq) {
    i = aZ(i);
    bq = bq || -1;
    var F = [];
    while (i = i[bp]) {
      if (i.nodeType === Node.ELEMENT_NODE) {
        F.push(aF.extend(i))
      }
      if (F.length === bq) {
        break
      }
    }
    return F
  }

  function aL(i) {
    return am(i, "parentNode")
  }

  function bm(i) {
    return aF.select(i, "*")
  }

  function X(i) {
    i = aZ(i).firstChild;
    while (i && i.nodeType !== Node.ELEMENT_NODE) {
      i = i.nextSibling
    }
    return aZ(i)
  }

  function bi(F) {
    var i = [],
      bp = aZ(F).firstChild;
    while (bp) {
      if (bp.nodeType === Node.ELEMENT_NODE) {
        i.push(aF.extend(bp))
      }
      bp = bp.nextSibling
    }
    return i
  }

  function p(i) {
    return am(i, "previousSibling")
  }

  function bh(i) {
    return am(i, "nextSibling")
  }

  function aV(i) {
    i = aZ(i);
    var bp = p(i),
      F = bh(i);
    return bp.reverse().concat(F)
  }

  function aR(F, i) {
    F = aZ(F);
    if (Object.isString(i)) {
      return Prototype.Selector.match(F, i)
    }
    return i.match(F)
  }

  function aW(F, bp, bq, i) {
    F = aZ(F), bq = bq || 0, i = i || 0;
    if (Object.isNumber(bq)) {
      i = bq, bq = null
    }
    while (F = F[bp]) {
      if (F.nodeType !== 1) {
        continue
      }
      if (bq && !Prototype.Selector.match(F, bq)) {
        continue
      }
      if (--i >= 0) {
        continue
      }
      return aF.extend(F)
    }
  }

  function aa(F, bp, i) {
    F = aZ(F);
    if (arguments.length === 1) {
      return aZ(F.parentNode)
    }
    return aW(F, "parentNode", bp, i)
  }

  function y(F, bq, i) {
    if (arguments.length === 1) {
      return X(F)
    }
    F = aZ(F), bq = bq || 0, i = i || 0;
    if (Object.isNumber(bq)) {
      i = bq, bq = "*"
    }
    var bp = Prototype.Selector.select(bq, F)[i];
    return aF.extend(bp)
  }

  function h(F, bp, i) {
    return aW(F, "previousSibling", bp, i)
  }

  function aB(F, bp, i) {
    return aW(F, "nextSibling", bp, i)
  }

  function bb(i) {
    i = aZ(i);
    var F = a1.call(arguments, 1).join(", ");
    return Prototype.Selector.select(F, i)
  }

  function aD(bq) {
    bq = aZ(bq);
    var bs = a1.call(arguments, 1).join(", ");
    var bt = aF.siblings(bq),
      bp = [];
    for (var F = 0, br; br = bt[F]; F++) {
      if (Prototype.Selector.match(br, bs)) {
        bp.push(br)
      }
    }
    return bp
  }

  function D(F, i) {
    F = aZ(F), i = aZ(i);
    if (!F || !i) {
      return false
    }
    while (F = F.parentNode) {
      if (F === i) {
        return true
      }
    }
    return false
  }

  function B(F, i) {
    F = aZ(F), i = aZ(i);
    if (!F || !i) {
      return false
    }
    if (!i.contains) {
      return D(F, i)
    }
    return i.contains(F) && i !== F
  }

  function J(F, i) {
    F = aZ(F), i = aZ(i);
    if (!F || !i) {
      return false
    }
    return (F.compareDocumentPosition(i) & 8) === 8
  }
  var aM;
  if (av.compareDocumentPosition) {
    aM = J
  } else {
    if (av.contains) {
      aM = B
    } else {
      aM = D
    }
  }
  Object.extend(a3, {
    recursivelyCollect: am,
    ancestors: aL,
    descendants: bm,
    firstDescendant: X,
    immediateDescendants: bi,
    previousSiblings: p,
    nextSiblings: bh,
    siblings: aV,
    match: aR,
    up: aa,
    down: y,
    previous: h,
    next: aB,
    select: bb,
    adjacent: aD,
    descendantOf: aM,
    getElementsBySelector: bb,
    childElements: bi
  });
  var T = 1;

  function aU(i) {
    i = aZ(i);
    var F = aF.readAttribute(i, "id");
    if (F) {
      return F
    }
    do {
      F = "anonymous_element_" + T++
    } while (aZ(F));
    aF.writeAttribute(i, "id", F);
    return F
  }

  function a9(F, i) {
    return aZ(F).getAttribute(i)
  }

  function K(F, i) {
    F = aZ(F);
    var bp = aG.read;
    if (bp.values[i]) {
      return bp.values[i](F, i)
    }
    if (bp.names[i]) {
      i = bp.names[i]
    }
    if (i.include(":")) {
      if (!F.attributes || !F.attributes[i]) {
        return null
      }
      return F.attributes[i].value
    }
    return F.getAttribute(i)
  }

  function e(F, i) {
    if (i === "title") {
      return F.title
    }
    return F.getAttribute(i)
  }
  var U = (function() {
    av.setAttribute("onclick", []);
    var i = av.getAttribute("onclick");
    var F = Object.isArray(i);
    av.removeAttribute("onclick");
    return F
  })();
  if (U) {
    a9 = K
  } else {
    if (Prototype.Browser.Opera) {
      a9 = e
    }
  }

  function a0(bq, bp, bs) {
    bq = aZ(bq);
    var F = {},
      br = aG.write;
    if (typeof bp === "object") {
      F = bp
    } else {
      F[bp] = Object.isUndefined(bs) ? true : bs
    }
    for (var i in F) {
      bp = br.names[i] || i;
      bs = F[i];
      if (br.values[i]) {
        bs = br.values[i](bq, bs);
        if (Object.isUndefined(bs)) {
          continue
        }
      }
      if (bs === false || bs === null) {
        bq.removeAttribute(bp)
      } else {
        if (bs === true) {
          bq.setAttribute(bp, bp)
        } else {
          bq.setAttribute(bp, bs)
        }
      }
    }
    return bq
  }
  var a = (function() {
    if (!d) {
      return false
    }
    var F = document.createElement('<input type="checkbox">');
    F.checked = true;
    var i = F.getAttributeNode("checked");
    return !i || !i.specified
  })();

  function Y(i, bp) {
    bp = aG.has[bp] || bp;
    var F = aZ(i).getAttributeNode(bp);
    return !!(F && F.specified)
  }

  function bg(i, F) {
    if (F === "checked") {
      return i.checked
    }
    return Y(i, F)
  }
  a8.Element.Methods.Simulated.hasAttribute = a ? bg : Y;

  function k(i) {
    return new aF.ClassNames(i)
  }
  var V = {};

  function f(F) {
    if (V[F]) {
      return V[F]
    }
    var i = new RegExp("(^|\\s+)" + F + "(\\s+|$)");
    V[F] = i;
    return i
  }

  function al(i, F) {
    if (!(i = aZ(i))) {
      return
    }
    var bp = i.className;
    if (bp.length === 0) {
      return false
    }
    if (bp === F) {
      return true
    }
    return f(F).test(bp)
  }

  function o(i, F) {
    if (!(i = aZ(i))) {
      return
    }
    if (!al(i, F)) {
      i.className += (i.className ? " " : "") + F
    }
    return i
  }

  function au(i, F) {
    if (!(i = aZ(i))) {
      return
    }
    i.className = i.className.replace(f(F), " ").strip();
    return i
  }

  function ae(F, bp, i) {
    if (!(F = aZ(F))) {
      return
    }
    if (Object.isUndefined(i)) {
      i = !al(F, bp)
    }
    var bq = aF[i ? "addClassName" : "removeClassName"];
    return bq(F, bp)
  }
  var aG = {};
  var aP = "className",
    ar = "for";
  av.setAttribute(aP, "x");
  if (av.className !== "x") {
    av.setAttribute("class", "x");
    if (av.className === "x") {
      aP = "class"
    }
  }
  var aK = document.createElement("label");
  aK.setAttribute(ar, "x");
  if (aK.htmlFor !== "x") {
    aK.setAttribute("htmlFor", "x");
    if (aK.htmlFor === "x") {
      ar = "htmlFor"
    }
  }
  aK = null;

  function ac(i, F) {
    return i.getAttribute(F)
  }

  function g(i, F) {
    return i.getAttribute(F, 2)
  }

  function A(i, bp) {
    var F = i.getAttributeNode(bp);
    return F ? F.value : ""
  }

  function bj(i, F) {
    return aZ(i).hasAttribute(F) ? F : null
  }
  av.onclick = Prototype.emptyFunction;
  var P = av.getAttribute("onclick");
  var aw;
  if (String(P).indexOf("{") > -1) {
    aw = function(i, F) {
      var bp = i.getAttribute(F);
      if (!bp) {
        return null
      }
      bp = bp.toString();
      bp = bp.split("{")[1];
      bp = bp.split("}")[0];
      return bp.strip()
    }
  } else {
    if (P === "") {
      aw = function(i, F) {
        var bp = i.getAttribute(F);
        if (!bp) {
          return null
        }
        return bp.strip()
      }
    }
  }
  aG.read = {
    names: {
      "class": aP,
      className: aP,
      "for": ar,
      htmlFor: ar
    },
    values: {
      style: function(i) {
        return i.style.cssText.toLowerCase()
      },
      title: function(i) {
        return i.title
      }
    }
  };
  aG.write = {
    names: {
      className: "class",
      htmlFor: "for",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing"
    },
    values: {
      checked: function(i, F) {
        F = !!F;
        i.checked = F;
        return F ? "checked" : null
      },
      style: function(i, F) {
        i.style.cssText = F ? F : ""
      }
    }
  };
  aG.has = {
    names: {}
  };
  Object.extend(aG.write.names, aG.read.names);
  var a6 = $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder");
  for (var af = 0, ag; ag = a6[af]; af++) {
    aG.write.names[ag.toLowerCase()] = ag;
    aG.has.names[ag.toLowerCase()] = ag
  }
  Object.extend(aG.read.values, {
    href: g,
    src: g,
    type: ac,
    action: A,
    disabled: bj,
    checked: bj,
    readonly: bj,
    multiple: bj,
    onload: aw,
    onunload: aw,
    onclick: aw,
    ondblclick: aw,
    onmousedown: aw,
    onmouseup: aw,
    onmouseover: aw,
    onmousemove: aw,
    onmouseout: aw,
    onfocus: aw,
    onblur: aw,
    onkeypress: aw,
    onkeydown: aw,
    onkeyup: aw,
    onsubmit: aw,
    onreset: aw,
    onselect: aw,
    onchange: aw
  });
  Object.extend(a3, {
    identify: aU,
    readAttribute: a9,
    writeAttribute: a0,
    classNames: k,
    hasClassName: al,
    addClassName: o,
    removeClassName: au,
    toggleClassName: ae
  });

  function W(i) {
    if (i === "float" || i === "styleFloat") {
      return "cssFloat"
    }
    return i.camelize()
  }

  function bo(i) {
    if (i === "float" || i === "cssFloat") {
      return "styleFloat"
    }
    return i.camelize()
  }

  function C(bp, bq) {
    bp = aZ(bp);
    var bt = bp.style,
      F;
    if (Object.isString(bq)) {
      bt.cssText += ";" + bq;
      if (bq.include("opacity")) {
        var i = bq.match(/opacity:\s*(\d?\.?\d*)/)[1];
        aF.setOpacity(bp, i)
      }
      return bp
    }
    for (var bs in bq) {
      if (bs === "opacity") {
        aF.setOpacity(bp, bq[bs])
      } else {
        var br = bq[bs];
        if (bs === "float" || bs === "cssFloat") {
          bs = Object.isUndefined(bt.styleFloat) ? "cssFloat" : "styleFloat"
        }
        bt[bs] = br
      }
    }
    return bp
  }

  function aO(F, bp) {
    F = aZ(F);
    bp = W(bp);
    var bq = F.style[bp];
    if (!bq || bq === "auto") {
      var i = document.defaultView.getComputedStyle(F, null);
      bq = i ? i[bp] : null
    }
    if (bp === "opacity") {
      return bq ? parseFloat(bq) : 1
    }
    return bq === "auto" ? null : bq
  }

  function s(i, F) {
    switch (F) {
      case "height":
      case "width":
        if (!aF.visible(i)) {
          return null
        }
        var bp = parseInt(aO(i, F), 10);
        if (bp !== i["offset" + F.capitalize()]) {
          return bp + "px"
        }
        return aF.measure(i, F);
      default:
        return aO(i, F)
    }
  }

  function aj(i, F) {
    i = aZ(i);
    F = bo(F);
    var bp = i.style[F];
    if (!bp && i.currentStyle) {
      bp = i.currentStyle[F]
    }
    if (F === "opacity") {
      if (!N) {
        return be(i)
      } else {
        return bp ? parseFloat(bp) : 1
      }
    }
    if (bp === "auto") {
      if ((F === "width" || F === "height") && aF.visible(i)) {
        return aF.measure(i, F) + "px"
      }
      return null
    }
    return bp
  }

  function aA(i) {
    return (i || "").replace(/alpha\([^\)]*\)/gi, "")
  }

  function ab(i) {
    if (!i.currentStyle || !i.currentStyle.hasLayout) {
      i.style.zoom = 1
    }
    return i
  }
  var N = (function() {
    av.style.cssText = "opacity:.55";
    return /^0.55/.test(av.style.opacity)
  })();

  function z(i, F) {
    i = aZ(i);
    if (F == 1 || F === "") {
      F = ""
    } else {
      if (F < 0.00001) {
        F = 0
      }
    }
    i.style.opacity = F;
    return i
  }

  function bf(i, bq) {
    if (N) {
      return z(i, bq)
    }
    i = ab(aZ(i));
    var bp = aF.getStyle(i, "filter"),
      F = i.style;
    if (bq == 1 || bq === "") {
      bp = aA(bp);
      if (bp) {
        F.filter = bp
      } else {
        F.removeAttribute("filter")
      }
      return i
    }
    if (bq < 0.00001) {
      bq = 0
    }
    F.filter = aA(bp) + " alpha(opacity=" + (bq * 100) + ")";
    return i
  }

  function bd(i) {
    return aF.getStyle(i, "opacity")
  }

  function be(F) {
    if (N) {
      return bd(F)
    }
    var bp = aF.getStyle(F, "filter");
    if (bp.length === 0) {
      return 1
    }
    var i = (bp || "").match(/alpha\(opacity=(.*)\)/i);
    if (i && i[1]) {
      return parseFloat(i[1]) / 100
    }
    return 1
  }
  Object.extend(a3, {
    setStyle: C,
    getStyle: aO,
    setOpacity: z,
    getOpacity: bd
  });
  if ("styleFloat" in av.style) {
    a3.getStyle = aj;
    a3.setOpacity = bf;
    a3.getOpacity = be
  }
  var l = 0;
  a8.Element.Storage = {
    UID: 1
  };

  function M(i) {
    if (i === window) {
      return 0
    }
    if (typeof i._prototypeUID === "undefined") {
      i._prototypeUID = aF.Storage.UID++
    }
    return i._prototypeUID
  }

  function c(i) {
    if (i === window) {
      return 0
    }
    if (i == document) {
      return 1
    }
    return i.uniqueID
  }
  var aY = ("uniqueID" in av);
  if (aY) {
    M = c
  }

  function b(F) {
    if (!(F = aZ(F))) {
      return
    }
    var i = M(F);
    if (!aF.Storage[i]) {
      aF.Storage[i] = $H()
    }
    return aF.Storage[i]
  }

  function a5(F, i, bp) {
    if (!(F = aZ(F))) {
      return
    }
    var bq = b(F);
    if (arguments.length === 2) {
      bq.update(i)
    } else {
      bq.set(i, bp)
    }
    return F
  }

  function aN(bp, F, i) {
    if (!(bp = aZ(bp))) {
      return
    }
    var br = b(bp),
      bq = br.get(F);
    if (Object.isUndefined(bq)) {
      br.set(F, i);
      bq = i
    }
    return bq
  }
  Object.extend(a3, {
    getStorage: b,
    store: a5,
    retrieve: aN
  });
  var an = {},
    aX = aF.Methods.ByTag,
    aC = Prototype.BrowserFeatures;
  if (!aC.ElementExtensions && ("__proto__" in av)) {
    a8.HTMLElement = {};
    a8.HTMLElement.prototype = av.__proto__;
    aC.ElementExtensions = true
  }

  function bc(i) {
    if (typeof window.Element === "undefined") {
      return false
    }
    if (!d) {
      return false
    }
    var bp = window.Element.prototype;
    if (bp) {
      var br = "_" + (Math.random() + "").slice(2),
        F = document.createElement(i);
      bp[br] = "x";
      var bq = (F[br] !== "x");
      delete bp[br];
      F = null;
      return bq
    }
    return false
  }
  var ap = bc("object");

  function ak(F, i) {
    for (var bq in i) {
      var bp = i[bq];
      if (Object.isFunction(bp) && !(bq in F)) {
        F[bq] = bp.methodize()
      }
    }
  }
  var bk = {};

  function ay(F) {
    var i = M(F);
    return (i in bk)
  }

  function az(bp) {
    if (!bp || ay(bp)) {
      return bp
    }
    if (bp.nodeType !== Node.ELEMENT_NODE || bp == window) {
      return bp
    }
    var i = Object.clone(an),
      F = bp.tagName.toUpperCase();
    if (aX[F]) {
      Object.extend(i, aX[F])
    }
    ak(bp, i);
    bk[M(bp)] = true;
    return bp
  }

  function aS(F) {
    if (!F || ay(F)) {
      return F
    }
    var i = F.tagName;
    if (i && (/^(?:object|applet|embed)$/i.test(i))) {
      ak(F, aF.Methods);
      ak(F, aF.Methods.Simulated);
      ak(F, aF.Methods.ByTag[i.toUpperCase()])
    }
    return F
  }
  if (aC.SpecificElementExtensions) {
    az = ap ? aS : Prototype.K
  }

  function S(F, i) {
    F = F.toUpperCase();
    if (!aX[F]) {
      aX[F] = {}
    }
    Object.extend(aX[F], i)
  }

  function q(F, bp, i) {
    if (Object.isUndefined(i)) {
      i = false
    }
    for (var br in bp) {
      var bq = bp[br];
      if (!Object.isFunction(bq)) {
        continue
      }
      if (!i || !(br in F)) {
        F[br] = bq.methodize()
      }
    }
  }

  function ai(bq) {
    var i;
    var bp = {
      OPTGROUP: "OptGroup",
      TEXTAREA: "TextArea",
      P: "Paragraph",
      FIELDSET: "FieldSet",
      UL: "UList",
      OL: "OList",
      DL: "DList",
      DIR: "Directory",
      H1: "Heading",
      H2: "Heading",
      H3: "Heading",
      H4: "Heading",
      H5: "Heading",
      H6: "Heading",
      Q: "Quote",
      INS: "Mod",
      DEL: "Mod",
      A: "Anchor",
      IMG: "Image",
      CAPTION: "TableCaption",
      COL: "TableCol",
      COLGROUP: "TableCol",
      THEAD: "TableSection",
      TFOOT: "TableSection",
      TBODY: "TableSection",
      TR: "TableRow",
      TH: "TableCell",
      TD: "TableCell",
      FRAMESET: "FrameSet",
      IFRAME: "IFrame"
    };
    if (bp[bq]) {
      i = "HTML" + bp[bq] + "Element"
    }
    if (window[i]) {
      return window[i]
    }
    i = "HTML" + bq + "Element";
    if (window[i]) {
      return window[i]
    }
    i = "HTML" + bq.capitalize() + "Element";
    if (window[i]) {
      return window[i]
    }
    var F = document.createElement(bq),
      br = F.__proto__ || F.constructor.prototype;
    F = null;
    return br
  }

  function R(br) {
    if (arguments.length === 0) {
      G()
    }
    if (arguments.length === 2) {
      var bt = br;
      br = arguments[1]
    }
    if (!bt) {
      Object.extend(aF.Methods, br || {})
    } else {
      if (Object.isArray(bt)) {
        for (var bs = 0, bq; bq = bt[bs]; bs++) {
          S(bq, br)
        }
      } else {
        S(bt, br)
      }
    }
    var bp = window.HTMLElement ? HTMLElement.prototype : aF.prototype;
    if (aC.ElementExtensions) {
      q(bp, aF.Methods);
      q(bp, aF.Methods.Simulated, true)
    }
    if (aC.SpecificElementExtensions) {
      for (var bq in aF.Methods.ByTag) {
        var F = ai(bq);
        if (Object.isUndefined(F)) {
          continue
        }
        q(F.prototype, aX[bq])
      }
    }
    Object.extend(aF, aF.Methods);
    Object.extend(aF, aF.Methods.Simulated);
    delete aF.ByTag;
    delete aF.Simulated;
    aF.extend.refresh();
    r = {}
  }
  Object.extend(a8.Element, {
    extend: az,
    addMethods: R
  });
  if (az === Prototype.K) {
    a8.Element.extend.refresh = Prototype.emptyFunction
  } else {
    a8.Element.extend.refresh = function() {
      if (Prototype.BrowserFeatures.ElementExtensions) {
        return
      }
      Object.extend(an, aF.Methods);
      Object.extend(an, aF.Methods.Simulated);
      bk = {}
    }
  }

  function G() {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(aF.Methods.ByTag, {
      FORM: Object.clone(Form.Methods),
      INPUT: Object.clone(Form.Element.Methods),
      SELECT: Object.clone(Form.Element.Methods),
      TEXTAREA: Object.clone(Form.Element.Methods),
      BUTTON: Object.clone(Form.Element.Methods)
    })
  }
  aF.addMethods(a3);

  function n() {
    av = null;
    r = null
  }
  if (window.attachEvent) {
    window.attachEvent("onunload", n)
  }
})(this);
(function() {
  function k(G) {
    var F = G.match(/^(\d+)%?$/i);
    if (!F) {
      return null
    }
    return (Number(F[1]) / 100)
  }

  function y(G, H) {
    G = $(G);
    var I = G.style[H];
    if (!I || I === "auto") {
      var F = document.defaultView.getComputedStyle(G, null);
      I = F ? F[H] : null
    }
    if (H === "opacity") {
      return I ? parseFloat(I) : 1
    }
    return I === "auto" ? null : I
  }

  function B(F, G) {
    var H = F.style[G];
    if (!H && F.currentStyle) {
      H = F.currentStyle[G]
    }
    return H
  }

  function r(H, G) {
    var J = H.offsetWidth;
    var L = u(H, "borderLeftWidth", G) || 0;
    var F = u(H, "borderRightWidth", G) || 0;
    var I = u(H, "paddingLeft", G) || 0;
    var K = u(H, "paddingRight", G) || 0;
    return J - L - F - I - K
  }
  if (!Object.isUndefined(document.documentElement.currentStyle) && !Prototype.Browser.Opera) {
    y = B
  }

  function u(P, Q, G) {
    var J = null;
    if (Object.isElement(P)) {
      J = P;
      P = y(J, Q)
    }
    if (P === null || Object.isUndefined(P)) {
      return null
    }
    if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(P)) {
      return window.parseFloat(P)
    }
    var K = P.include("%"),
      H = (G === document.viewport);
    if (/\d/.test(P) && J && J.runtimeStyle && !(K && H)) {
      var F = J.style.left,
        O = J.runtimeStyle.left;
      J.runtimeStyle.left = J.currentStyle.left;
      J.style.left = P || 0;
      P = J.style.pixelLeft;
      J.style.left = F;
      J.runtimeStyle.left = O;
      return P
    }
    if (J && K) {
      G = G || J.parentNode;
      var I = k(P),
        L = null;
      var N = Q.include("left") || Q.include("right") || Q.include("width");
      var M = Q.include("top") || Q.include("bottom") || Q.include("height");
      if (G === document.viewport) {
        if (N) {
          L = document.viewport.getWidth()
        } else {
          if (M) {
            L = document.viewport.getHeight()
          }
        }
      } else {
        if (N) {
          L = $(G).measure("width")
        } else {
          if (M) {
            L = $(G).measure("height")
          }
        }
      }
      return (L === null) ? 0 : L * I
    }
    return 0
  }

  function j(F) {
    if (Object.isString(F) && F.endsWith("px")) {
      return F
    }
    return F + "px"
  }

  function m(F) {
    while (F && F.parentNode) {
      var G = F.getStyle("display");
      if (G === "none") {
        return false
      }
      F = $(F.parentNode)
    }
    return true
  }
  var g = Prototype.K;
  if ("currentStyle" in document.documentElement) {
    g = function(F) {
      if (!F.currentStyle.hasLayout) {
        F.style.zoom = 1
      }
      return F
    }
  }

  function i(F) {
    if (F.include("border")) {
      F = F + "-width"
    }
    return F.camelize()
  }
  Element.Layout = Class.create(Hash, {
    initialize: function($super, G, F) {
      $super();
      this.element = $(G);
      Element.Layout.PROPERTIES.each(function(H) {
        this._set(H, null)
      }, this);
      if (F) {
        this._preComputing = true;
        this._begin();
        Element.Layout.PROPERTIES.each(this._compute, this);
        this._end();
        this._preComputing = false
      }
    },
    _set: function(G, F) {
      return Hash.prototype.set.call(this, G, F)
    },
    set: function(G, F) {
      throw "Properties of Element.Layout are read-only."
    },
    get: function($super, G) {
      var F = $super(G);
      return F === null ? this._compute(G) : F
    },
    _begin: function() {
      if (this._isPrepared()) {
        return
      }
      var J = this.element;
      if (m(J)) {
        this._setPrepared(true);
        return
      }
      var L = {
        position: J.style.position || "",
        width: J.style.width || "",
        visibility: J.style.visibility || "",
        display: J.style.display || ""
      };
      J.store("prototype_original_styles", L);
      var M = y(J, "position"),
        F = J.offsetWidth;
      if (F === 0 || F === null) {
        J.style.display = "block";
        F = J.offsetWidth
      }
      var G = (M === "fixed") ? document.viewport : J.parentNode;
      var N = {
        visibility: "hidden",
        display: "block"
      };
      if (M !== "fixed") {
        N.position = "absolute"
      }
      J.setStyle(N);
      var H = J.offsetWidth,
        I;
      if (F && (H === F)) {
        I = r(J, G)
      } else {
        if (M === "absolute" || M === "fixed") {
          I = r(J, G)
        } else {
          var O = J.parentNode,
            K = $(O).getLayout();
          I = K.get("width") - this.get("margin-left") - this.get("border-left") - this.get("padding-left") - this.get("padding-right") - this.get("border-right") - this.get("margin-right")
        }
      }
      J.setStyle({
        width: I + "px"
      });
      this._setPrepared(true)
    },
    _end: function() {
      var G = this.element;
      var F = G.retrieve("prototype_original_styles");
      G.store("prototype_original_styles", null);
      G.setStyle(F);
      this._setPrepared(false)
    },
    _compute: function(G) {
      var F = Element.Layout.COMPUTATIONS;
      if (!(G in F)) {
        throw "Property not found."
      }
      return this._set(G, F[G].call(this, this.element))
    },
    _isPrepared: function() {
      return this.element.retrieve("prototype_element_layout_prepared", false)
    },
    _setPrepared: function(F) {
      return this.element.store("prototype_element_layout_prepared", F)
    },
    toObject: function() {
      var F = $A(arguments);
      var G = (F.length === 0) ? Element.Layout.PROPERTIES : F.join(" ").split(" ");
      var H = {};
      G.each(function(I) {
        if (!Element.Layout.PROPERTIES.include(I)) {
          return
        }
        var J = this.get(I);
        if (J != null) {
          H[I] = J
        }
      }, this);
      return H
    },
    toHash: function() {
      var F = this.toObject.apply(this, arguments);
      return new Hash(F)
    },
    toCSS: function() {
      var F = $A(arguments);
      var H = (F.length === 0) ? Element.Layout.PROPERTIES : F.join(" ").split(" ");
      var G = {};
      H.each(function(I) {
        if (!Element.Layout.PROPERTIES.include(I)) {
          return
        }
        if (Element.Layout.COMPOSITE_PROPERTIES.include(I)) {
          return
        }
        var J = this.get(I);
        if (J != null) {
          G[i(I)] = J + "px"
        }
      }, this);
      return G
    },
    inspect: function() {
      return "#<Element.Layout>"
    }
  });
  Object.extend(Element.Layout, {
    PROPERTIES: $w("height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height"),
    COMPOSITE_PROPERTIES: $w("padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height"),
    COMPUTATIONS: {
      height: function(H) {
        if (!this._preComputing) {
          this._begin()
        }
        var F = this.get("border-box-height");
        if (F <= 0) {
          if (!this._preComputing) {
            this._end()
          }
          return 0
        }
        var I = this.get("border-top"),
          G = this.get("border-bottom");
        var K = this.get("padding-top"),
          J = this.get("padding-bottom");
        if (!this._preComputing) {
          this._end()
        }
        return F - I - G - K - J
      },
      width: function(H) {
        if (!this._preComputing) {
          this._begin()
        }
        var G = this.get("border-box-width");
        if (G <= 0) {
          if (!this._preComputing) {
            this._end()
          }
          return 0
        }
        var K = this.get("border-left"),
          F = this.get("border-right");
        var I = this.get("padding-left"),
          J = this.get("padding-right");
        if (!this._preComputing) {
          this._end()
        }
        return G - K - F - I - J
      },
      "padding-box-height": function(G) {
        var F = this.get("height"),
          I = this.get("padding-top"),
          H = this.get("padding-bottom");
        return F + I + H
      },
      "padding-box-width": function(F) {
        var G = this.get("width"),
          H = this.get("padding-left"),
          I = this.get("padding-right");
        return G + H + I
      },
      "border-box-height": function(G) {
        if (!this._preComputing) {
          this._begin()
        }
        var F = G.offsetHeight;
        if (!this._preComputing) {
          this._end()
        }
        return F
      },
      "border-box-width": function(F) {
        if (!this._preComputing) {
          this._begin()
        }
        var G = F.offsetWidth;
        if (!this._preComputing) {
          this._end()
        }
        return G
      },
      "margin-box-height": function(G) {
        var F = this.get("border-box-height"),
          H = this.get("margin-top"),
          I = this.get("margin-bottom");
        if (F <= 0) {
          return 0
        }
        return F + H + I
      },
      "margin-box-width": function(H) {
        var G = this.get("border-box-width"),
          I = this.get("margin-left"),
          F = this.get("margin-right");
        if (G <= 0) {
          return 0
        }
        return G + I + F
      },
      top: function(F) {
        var G = F.positionedOffset();
        return G.top
      },
      bottom: function(F) {
        var I = F.positionedOffset(),
          G = F.getOffsetParent(),
          H = G.measure("height");
        var J = this.get("border-box-height");
        return H - J - I.top
      },
      left: function(F) {
        var G = F.positionedOffset();
        return G.left
      },
      right: function(H) {
        var J = H.positionedOffset(),
          I = H.getOffsetParent(),
          F = I.measure("width");
        var G = this.get("border-box-width");
        return F - G - J.left
      },
      "padding-top": function(F) {
        return u(F, "paddingTop")
      },
      "padding-bottom": function(F) {
        return u(F, "paddingBottom")
      },
      "padding-left": function(F) {
        return u(F, "paddingLeft")
      },
      "padding-right": function(F) {
        return u(F, "paddingRight")
      },
      "border-top": function(F) {
        return u(F, "borderTopWidth")
      },
      "border-bottom": function(F) {
        return u(F, "borderBottomWidth")
      },
      "border-left": function(F) {
        return u(F, "borderLeftWidth")
      },
      "border-right": function(F) {
        return u(F, "borderRightWidth")
      },
      "margin-top": function(F) {
        return u(F, "marginTop")
      },
      "margin-bottom": function(F) {
        return u(F, "marginBottom")
      },
      "margin-left": function(F) {
        return u(F, "marginLeft")
      },
      "margin-right": function(F) {
        return u(F, "marginRight")
      }
    }
  });
  if ("getBoundingClientRect" in document.documentElement) {
    Object.extend(Element.Layout.COMPUTATIONS, {
      right: function(G) {
        var H = g(G.getOffsetParent());
        var I = G.getBoundingClientRect(),
          F = H.getBoundingClientRect();
        return (F.right - I.right).round()
      },
      bottom: function(G) {
        var H = g(G.getOffsetParent());
        var I = G.getBoundingClientRect(),
          F = H.getBoundingClientRect();
        return (F.bottom - I.bottom).round()
      }
    })
  }
  Element.Offset = Class.create({
    initialize: function(G, F) {
      this.left = G.round();
      this.top = F.round();
      this[0] = this.left;
      this[1] = this.top
    },
    relativeTo: function(F) {
      return new Element.Offset(this.left - F.left, this.top - F.top)
    },
    inspect: function() {
      return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this)
    },
    toString: function() {
      return "[#{left}, #{top}]".interpolate(this)
    },
    toArray: function() {
      return [this.left, this.top]
    }
  });

  function z(G, F) {
    return new Element.Layout(G, F)
  }

  function d(F, G) {
    return $(F).getLayout().get(G)
  }

  function q(F) {
    return Element.getDimensions(F).height
  }

  function c(F) {
    return Element.getDimensions(F).width
  }

  function s(G) {
    G = $(G);
    var K = Element.getStyle(G, "display");
    if (K && K !== "none") {
      return {
        width: G.offsetWidth,
        height: G.offsetHeight
      }
    }
    var H = G.style;
    var F = {
      visibility: H.visibility,
      position: H.position,
      display: H.display
    };
    var J = {
      visibility: "hidden",
      display: "block"
    };
    if (F.position !== "fixed") {
      J.position = "absolute"
    }
    Element.setStyle(G, J);
    var I = {
      width: G.offsetWidth,
      height: G.offsetHeight
    };
    Element.setStyle(G, F);
    return I
  }

  function p(F) {
    F = $(F);

    function H(I) {
      return n(I) ? $(document.body) : $(I)
    }
    if (h(F) || f(F) || o(F) || n(F)) {
      return $(document.body)
    }
    var G = (Element.getStyle(F, "display") === "inline");
    if (!G && F.offsetParent) {
      return H(F.offsetParent)
    }
    while ((F = F.parentNode) && F !== document.body) {
      if (Element.getStyle(F, "position") !== "static") {
        return H(F)
      }
    }
    return $(document.body)
  }

  function C(G) {
    G = $(G);
    var F = 0,
      H = 0;
    if (G.parentNode) {
      do {
        F += G.offsetTop || 0;
        H += G.offsetLeft || 0;
        G = G.offsetParent
      } while (G)
    }
    return new Element.Offset(H, F)
  }

  function w(G) {
    G = $(G);
    var H = G.getLayout();
    var F = 0,
      J = 0;
    do {
      F += G.offsetTop || 0;
      J += G.offsetLeft || 0;
      G = G.offsetParent;
      if (G) {
        if (o(G)) {
          break
        }
        var I = Element.getStyle(G, "position");
        if (I !== "static") {
          break
        }
      }
    } while (G);
    J -= H.get("margin-left");
    F -= H.get("margin-top");
    return new Element.Offset(J, F)
  }

  function b(G) {
    var F = 0,
      H = 0;
    do {
      if (G === document.body) {
        var I = document.documentElement || document.body.parentNode || document.body;
        F += !Object.isUndefined(window.pageYOffset) ? window.pageYOffset : I.scrollTop || 0;
        H += !Object.isUndefined(window.pageXOffset) ? window.pageXOffset : I.scrollLeft || 0;
        break
      } else {
        F += G.scrollTop || 0;
        H += G.scrollLeft || 0;
        G = G.parentNode
      }
    } while (G);
    return new Element.Offset(H, F)
  }

  function A(J) {
    var F = 0,
      I = 0,
      H = document.body;
    J = $(J);
    var G = J;
    do {
      F += G.offsetTop || 0;
      I += G.offsetLeft || 0;
      if (G.offsetParent == H && Element.getStyle(G, "position") == "absolute") {
        break
      }
    } while (G = G.offsetParent);
    G = J;
    do {
      if (G != H) {
        F -= G.scrollTop || 0;
        I -= G.scrollLeft || 0
      }
    } while (G = G.parentNode);
    return new Element.Offset(I, F)
  }

  function x(F) {
    F = $(F);
    if (Element.getStyle(F, "position") === "absolute") {
      return F
    }
    var J = p(F);
    var I = F.viewportOffset(),
      G = J.viewportOffset();
    var K = I.relativeTo(G);
    var H = F.getLayout();
    F.store("prototype_absolutize_original_styles", {
      position: F.getStyle("position"),
      left: F.getStyle("left"),
      top: F.getStyle("top"),
      width: F.getStyle("width"),
      height: F.getStyle("height")
    });
    F.setStyle({
      position: "absolute",
      top: K.top + "px",
      left: K.left + "px",
      width: H.get("width") + "px",
      height: H.get("height") + "px"
    });
    return F
  }

  function l(G) {
    G = $(G);
    if (Element.getStyle(G, "position") === "relative") {
      return G
    }
    var F = G.retrieve("prototype_absolutize_original_styles");
    if (F) {
      G.setStyle(F)
    }
    return G
  }

  function a(F) {
    F = $(F);
    var G = Element.cumulativeOffset(F);
    window.scrollTo(G.left, G.top);
    return F
  }

  function v(G) {
    G = $(G);
    var F = Element.getStyle(G, "position"),
      H = {};
    if (F === "static" || !F) {
      H.position = "relative";
      if (Prototype.Browser.Opera) {
        H.top = 0;
        H.left = 0
      }
      Element.setStyle(G, H);
      Element.store(G, "prototype_made_positioned", true)
    }
    return G
  }

  function t(F) {
    F = $(F);
    var H = Element.getStorage(F),
      G = H.get("prototype_made_positioned");
    if (G) {
      H.unset("prototype_made_positioned");
      Element.setStyle(F, {
        position: "",
        top: "",
        bottom: "",
        left: "",
        right: ""
      })
    }
    return F
  }

  function e(G) {
    G = $(G);
    var I = Element.getStorage(G),
      F = I.get("prototype_made_clipping");
    if (Object.isUndefined(F)) {
      var H = Element.getStyle(G, "overflow");
      I.set("prototype_made_clipping", H);
      if (H !== "hidden") {
        G.style.overflow = "hidden"
      }
    }
    return G
  }

  function D(F) {
    F = $(F);
    var H = Element.getStorage(F),
      G = H.get("prototype_made_clipping");
    if (!Object.isUndefined(G)) {
      H.unset("prototype_made_clipping");
      F.style.overflow = G || ""
    }
    return F
  }

  function E(I, F, Q) {
    Q = Object.extend({
      setLeft: true,
      setTop: true,
      setWidth: true,
      setHeight: true,
      offsetTop: 0,
      offsetLeft: 0
    }, Q || {});
    var H = document.documentElement;
    F = $(F);
    I = $(I);
    var G, O, K, P = {};
    if (Q.setLeft || Q.setTop) {
      G = Element.viewportOffset(F);
      O = [0, 0];
      if (Element.getStyle(I, "position") === "absolute") {
        var N = Element.getOffsetParent(I);
        if (N !== document.body) {
          O = Element.viewportOffset(N)
        }
      }
    }

    function L() {
      var R = 0,
        S = 0;
      if (Object.isNumber(window.pageXOffset)) {
        R = window.pageXOffset;
        S = window.pageYOffset
      } else {
        if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
          R = document.body.scrollLeft;
          S = document.body.scrollTop
        } else {
          if (H && (H.scrollLeft || H.scrollTop)) {
            R = H.scrollLeft;
            S = H.scrollTop
          }
        }
      }
      return {
        x: R,
        y: S
      }
    }
    var J = L();
    if (Q.setWidth || Q.setHeight) {
      K = Element.getLayout(F)
    }
    if (Q.setLeft) {
      P.left = (G[0] + J.x - O[0] + Q.offsetLeft) + "px"
    }
    if (Q.setTop) {
      P.top = (G[1] + J.y - O[1] + Q.offsetTop) + "px"
    }
    var M = I.getLayout();
    if (Q.setWidth) {
      P.width = K.get("width") + "px"
    }
    if (Q.setHeight) {
      P.height = K.get("height") + "px"
    }
    return Element.setStyle(I, P)
  }
  if (Prototype.Browser.IE) {
    p = p.wrap(function(H, G) {
      G = $(G);
      if (h(G) || f(G) || o(G) || n(G)) {
        return $(document.body)
      }
      var F = G.getStyle("position");
      if (F !== "static") {
        return H(G)
      }
      G.setStyle({
        position: "relative"
      });
      var I = H(G);
      G.setStyle({
        position: F
      });
      return I
    });
    w = w.wrap(function(I, G) {
      G = $(G);
      if (!G.parentNode) {
        return new Element.Offset(0, 0)
      }
      var F = G.getStyle("position");
      if (F !== "static") {
        return I(G)
      }
      var H = G.getOffsetParent();
      if (H && H.getStyle("position") === "fixed") {
        g(H)
      }
      G.setStyle({
        position: "relative"
      });
      var J = I(G);
      G.setStyle({
        position: F
      });
      return J
    })
  } else {
    if (Prototype.Browser.Webkit) {
      C = function(G) {
        G = $(G);
        var F = 0,
          H = 0;
        do {
          F += G.offsetTop || 0;
          H += G.offsetLeft || 0;
          if (G.offsetParent == document.body) {
            if (Element.getStyle(G, "position") == "absolute") {
              break
            }
          }
          G = G.offsetParent
        } while (G);
        return new Element.Offset(H, F)
      }
    }
  }
  Element.addMethods({
    getLayout: z,
    measure: d,
    getWidth: c,
    getHeight: q,
    getDimensions: s,
    getOffsetParent: p,
    cumulativeOffset: C,
    positionedOffset: w,
    cumulativeScrollOffset: b,
    viewportOffset: A,
    absolutize: x,
    relativize: l,
    scrollTo: a,
    makePositioned: v,
    undoPositioned: t,
    makeClipping: e,
    undoClipping: D,
    clonePosition: E
  });

  function o(F) {
    return F.nodeName.toUpperCase() === "BODY"
  }

  function n(F) {
    return F.nodeName.toUpperCase() === "HTML"
  }

  function h(F) {
    return F.nodeType === Node.DOCUMENT_NODE
  }

  function f(F) {
    return F !== document.body && !Element.descendantOf(F, document.body)
  }
  if ("getBoundingClientRect" in document.documentElement) {
    Element.addMethods({
      viewportOffset: function(F) {
        F = $(F);
        if (f(F)) {
          return new Element.Offset(0, 0)
        }
        var G = F.getBoundingClientRect(),
          H = document.documentElement;
        return new Element.Offset(G.left - H.clientLeft, G.top - H.clientTop)
      }
    })
  }
})();
(function() {
  var c = Prototype.Browser.Opera && (window.parseFloat(window.opera.version()) < 9.5);
  var f = null;

  function b() {
    if (f) {
      return f
    }
    f = c ? document.body : document.documentElement;
    return f
  }

  function d() {
    return {
      width: this.getWidth(),
      height: this.getHeight()
    }
  }

  function a() {
    return b().clientWidth
  }

  function g() {
    return b().clientHeight
  }

  function e() {
    var h = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
    var i = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    return new Element.Offset(h, i)
  }
  document.viewport = {
    getDimensions: d,
    getWidth: a,
    getHeight: g,
    getScrollOffsets: e
  }
})();
window.$$ = function() {
  var a = $A(arguments).join(", ");
  return Prototype.Selector.select(a, document)
};
Prototype.Selector = (function() {
  function a() {
    throw new Error('Method "Prototype.Selector.select" must be defined.')
  }

  function c() {
    throw new Error('Method "Prototype.Selector.match" must be defined.')
  }

  function d(l, m, h) {
    h = h || 0;
    var g = Prototype.Selector.match,
      k = l.length,
      f = 0,
      j;
    for (j = 0; j < k; j++) {
      if (g(l[j], m) && h == f++) {
        return Element.extend(l[j])
      }
    }
  }

  function e(h) {
    for (var f = 0, g = h.length; f < g; f++) {
      Element.extend(h[f])
    }
    return h
  }
  var b = Prototype.K;
  return {
    select: a,
    match: c,
    find: d,
    extendElements: (Element.extend === b) ? b : e,
    extendElement: Element.extend
  }
})();
Prototype._original_property = window.Sizzle;
(function() {
  function a(b) {
    Prototype._actual_sizzle = b()
  }
  a.amd = true;
  if (typeof define !== "undefined" && define.amd) {
    Prototype._original_define = define;
    Prototype._actual_sizzle = null;
    window.define = a
  }
})();
/*!
 * Sizzle CSS Selector Engine v1.10.18
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-02-05
 */
(function(av) {
  var D, ay, t, M, P, ab, ax, aC, N, ac, ae, H, u, an, ai, aw, k, K, ap = "sizzle" + -(new Date()),
    O = av.document,
    az = 0,
    aj = 0,
    d = F(),
    ao = F(),
    L = F(),
    J = function(i, e) {
      if (i === e) {
        ac = true
      }
      return 0
    },
    au = typeof undefined,
    V = 1 << 31,
    T = ({}).hasOwnProperty,
    ar = [],
    at = ar.pop,
    R = ar.push,
    b = ar.push,
    s = ar.slice,
    j = ar.indexOf || function(aE) {
      var aD = 0,
        e = this.length;
      for (; aD < e; aD++) {
        if (this[aD] === aE) {
          return aD
        }
      }
      return -1
    },
    c = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
    v = "[\\x20\\t\\r\\n\\f]",
    a = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
    Q = a.replace("w", "w#"),
    al = "\\[" + v + "*(" + a + ")" + v + "*(?:([*^$|!~]?=)" + v + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + Q + ")|)|)" + v + "*\\]",
    q = ":(" + a + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + al.replace(3, 8) + ")*)|.*)\\)|)",
    x = new RegExp("^" + v + "+|((?:^|[^\\\\])(?:\\\\.)*)" + v + "+$", "g"),
    A = new RegExp("^" + v + "*," + v + "*"),
    G = new RegExp("^" + v + "*([>+~]|" + v + ")" + v + "*"),
    z = new RegExp("=" + v + "*([^\\]'\"]*?)" + v + "*\\]", "g"),
    X = new RegExp(q),
    Z = new RegExp("^" + Q + "$"),
    ah = {
      ID: new RegExp("^#(" + a + ")"),
      CLASS: new RegExp("^\\.(" + a + ")"),
      TAG: new RegExp("^(" + a.replace("w", "w*") + ")"),
      ATTR: new RegExp("^" + al),
      PSEUDO: new RegExp("^" + q),
      CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + v + "*(even|odd|(([+-]|)(\\d*)n|)" + v + "*(?:([+-]|)" + v + "*(\\d+)|))" + v + "*\\)|)", "i"),
      bool: new RegExp("^(?:" + c + ")$", "i"),
      needsContext: new RegExp("^" + v + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + v + "*((?:-\\d)?\\d*)" + v + "*\\)|)(?=[^-]|$)", "i")
    },
    h = /^(?:input|select|textarea|button)$/i,
    r = /^h\d$/i,
    U = /^[^{]+\{\s*\[native \w/,
    W = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    ag = /[+~]/,
    S = /'|\\/g,
    y = new RegExp("\\\\([\\da-f]{1,6}" + v + "?|(" + v + ")|.)", "ig"),
    ak = function(e, aE, i) {
      var aD = "0x" + aE - 65536;
      return aD !== aD || i ? aE : aD < 0 ? String.fromCharCode(aD + 65536) : String.fromCharCode(aD >> 10 | 55296, aD & 1023 | 56320)
    };
  try {
    b.apply((ar = s.call(O.childNodes)), O.childNodes);
    ar[O.childNodes.length].nodeType
  } catch (I) {
    b = {
      apply: ar.length ? function(i, e) {
        R.apply(i, s.call(e))
      } : function(aF, aE) {
        var e = aF.length,
          aD = 0;
        while ((aF[e++] = aE[aD++])) {}
        aF.length = e - 1
      }
    }
  }

  function B(aK, aD, aO, aQ) {
    var aP, aH, aI, aM, aN, aG, aF, e, aE, aL;
    if ((aD ? aD.ownerDocument || aD : O) !== H) {
      ae(aD)
    }
    aD = aD || H;
    aO = aO || [];
    if (!aK || typeof aK !== "string") {
      return aO
    }
    if ((aM = aD.nodeType) !== 1 && aM !== 9) {
      return []
    }
    if (an && !aQ) {
      if ((aP = W.exec(aK))) {
        if ((aI = aP[1])) {
          if (aM === 9) {
            aH = aD.getElementById(aI);
            if (aH && aH.parentNode) {
              if (aH.id === aI) {
                aO.push(aH);
                return aO
              }
            } else {
              return aO
            }
          } else {
            if (aD.ownerDocument && (aH = aD.ownerDocument.getElementById(aI)) && K(aD, aH) && aH.id === aI) {
              aO.push(aH);
              return aO
            }
          }
        } else {
          if (aP[2]) {
            b.apply(aO, aD.getElementsByTagName(aK));
            return aO
          } else {
            if ((aI = aP[3]) && ay.getElementsByClassName && aD.getElementsByClassName) {
              b.apply(aO, aD.getElementsByClassName(aI));
              return aO
            }
          }
        }
      }
      if (ay.qsa && (!ai || !ai.test(aK))) {
        e = aF = ap;
        aE = aD;
        aL = aM === 9 && aK;
        if (aM === 1 && aD.nodeName.toLowerCase() !== "object") {
          aG = n(aK);
          if ((aF = aD.getAttribute("id"))) {
            e = aF.replace(S, "\\$&")
          } else {
            aD.setAttribute("id", e)
          }
          e = "[id='" + e + "'] ";
          aN = aG.length;
          while (aN--) {
            aG[aN] = e + o(aG[aN])
          }
          aE = ag.test(aK) && Y(aD.parentNode) || aD;
          aL = aG.join(",")
        }
        if (aL) {
          try {
            b.apply(aO, aE.querySelectorAll(aL));
            return aO
          } catch (aJ) {} finally {
            if (!aF) {
              aD.removeAttribute("id")
            }
          }
        }
      }
    }
    return ax(aK.replace(x, "$1"), aD, aO, aQ)
  }

  function F() {
    var i = [];

    function e(aD, aE) {
      if (i.push(aD + " ") > t.cacheLength) {
        delete e[i.shift()]
      }
      return (e[aD + " "] = aE)
    }
    return e
  }

  function p(e) {
    e[ap] = true;
    return e
  }

  function l(i) {
    var aE = H.createElement("div");
    try {
      return !!i(aE)
    } catch (aD) {
      return false
    } finally {
      if (aE.parentNode) {
        aE.parentNode.removeChild(aE)
      }
      aE = null
    }
  }

  function aA(aD, aF) {
    var e = aD.split("|"),
      aE = aD.length;
    while (aE--) {
      t.attrHandle[e[aE]] = aF
    }
  }

  function f(i, e) {
    var aE = e && i,
      aD = aE && i.nodeType === 1 && e.nodeType === 1 && (~e.sourceIndex || V) - (~i.sourceIndex || V);
    if (aD) {
      return aD
    }
    if (aE) {
      while ((aE = aE.nextSibling)) {
        if (aE === e) {
          return -1
        }
      }
    }
    return i ? 1 : -1
  }

  function C(e) {
    return function(aD) {
      var i = aD.nodeName.toLowerCase();
      return i === "input" && aD.type === e
    }
  }

  function g(e) {
    return function(aD) {
      var i = aD.nodeName.toLowerCase();
      return (i === "input" || i === "button") && aD.type === e
    }
  }

  function am(e) {
    return p(function(i) {
      i = +i;
      return p(function(aD, aH) {
        var aF, aE = e([], aD.length, i),
          aG = aE.length;
        while (aG--) {
          if (aD[(aF = aE[aG])]) {
            aD[aF] = !(aH[aF] = aD[aF])
          }
        }
      })
    })
  }

  function Y(e) {
    return e && typeof e.getElementsByTagName !== au && e
  }
  ay = B.support = {};
  P = B.isXML = function(e) {
    var i = e && (e.ownerDocument || e).documentElement;
    return i ? i.nodeName !== "HTML" : false
  };
  ae = B.setDocument = function(aD) {
    var e, aE = aD ? aD.ownerDocument || aD : O,
      i = aE.defaultView;
    if (aE === H || aE.nodeType !== 9 || !aE.documentElement) {
      return H
    }
    H = aE;
    u = aE.documentElement;
    an = !P(aE);
    if (i && i !== i.top) {
      if (i.addEventListener) {
        i.addEventListener("unload", function() {
          ae()
        }, false)
      } else {
        if (i.attachEvent) {
          i.attachEvent("onunload", function() {
            ae()
          })
        }
      }
    }
    ay.attributes = l(function(aF) {
      aF.className = "i";
      return !aF.getAttribute("className")
    });
    ay.getElementsByTagName = l(function(aF) {
      aF.appendChild(aE.createComment(""));
      return !aF.getElementsByTagName("*").length
    });
    ay.getElementsByClassName = U.test(aE.getElementsByClassName) && l(function(aF) {
      aF.innerHTML = "<div class='a'></div><div class='a i'></div>";
      aF.firstChild.className = "i";
      return aF.getElementsByClassName("i").length === 2
    });
    ay.getById = l(function(aF) {
      u.appendChild(aF).id = ap;
      return !aE.getElementsByName || !aE.getElementsByName(ap).length
    });
    if (ay.getById) {
      t.find.ID = function(aH, aG) {
        if (typeof aG.getElementById !== au && an) {
          var aF = aG.getElementById(aH);
          return aF && aF.parentNode ? [aF] : []
        }
      };
      t.filter.ID = function(aG) {
        var aF = aG.replace(y, ak);
        return function(aH) {
          return aH.getAttribute("id") === aF
        }
      }
    } else {
      delete t.find.ID;
      t.filter.ID = function(aG) {
        var aF = aG.replace(y, ak);
        return function(aI) {
          var aH = typeof aI.getAttributeNode !== au && aI.getAttributeNode("id");
          return aH && aH.value === aF
        }
      }
    }
    t.find.TAG = ay.getElementsByTagName ? function(aF, aG) {
      if (typeof aG.getElementsByTagName !== au) {
        return aG.getElementsByTagName(aF)
      }
    } : function(aF, aJ) {
      var aK, aI = [],
        aH = 0,
        aG = aJ.getElementsByTagName(aF);
      if (aF === "*") {
        while ((aK = aG[aH++])) {
          if (aK.nodeType === 1) {
            aI.push(aK)
          }
        }
        return aI
      }
      return aG
    };
    t.find.CLASS = ay.getElementsByClassName && function(aG, aF) {
      if (typeof aF.getElementsByClassName !== au && an) {
        return aF.getElementsByClassName(aG)
      }
    };
    aw = [];
    ai = [];
    if ((ay.qsa = U.test(aE.querySelectorAll))) {
      l(function(aF) {
        aF.innerHTML = "<select t=''><option selected=''></option></select>";
        if (aF.querySelectorAll("[t^='']").length) {
          ai.push("[*^$]=" + v + "*(?:''|\"\")")
        }
        if (!aF.querySelectorAll("[selected]").length) {
          ai.push("\\[" + v + "*(?:value|" + c + ")")
        }
        if (!aF.querySelectorAll(":checked").length) {
          ai.push(":checked")
        }
      });
      l(function(aG) {
        var aF = aE.createElement("input");
        aF.setAttribute("type", "hidden");
        aG.appendChild(aF).setAttribute("name", "D");
        if (aG.querySelectorAll("[name=d]").length) {
          ai.push("name" + v + "*[*^$|!~]?=")
        }
        if (!aG.querySelectorAll(":enabled").length) {
          ai.push(":enabled", ":disabled")
        }
        aG.querySelectorAll("*,:x");
        ai.push(",.*:")
      })
    }
    if ((ay.matchesSelector = U.test((k = u.webkitMatchesSelector || u.mozMatchesSelector || u.oMatchesSelector || u.msMatchesSelector)))) {
      l(function(aF) {
        ay.disconnectedMatch = k.call(aF, "div");
        k.call(aF, "[s!='']:x");
        aw.push("!=", q)
      })
    }
    ai = ai.length && new RegExp(ai.join("|"));
    aw = aw.length && new RegExp(aw.join("|"));
    e = U.test(u.compareDocumentPosition);
    K = e || U.test(u.contains) ? function(aG, aF) {
      var aI = aG.nodeType === 9 ? aG.documentElement : aG,
        aH = aF && aF.parentNode;
      return aG === aH || !!(aH && aH.nodeType === 1 && (aI.contains ? aI.contains(aH) : aG.compareDocumentPosition && aG.compareDocumentPosition(aH) & 16))
    } : function(aG, aF) {
      if (aF) {
        while ((aF = aF.parentNode)) {
          if (aF === aG) {
            return true
          }
        }
      }
      return false
    };
    J = e ? function(aG, aF) {
      if (aG === aF) {
        ac = true;
        return 0
      }
      var aH = !aG.compareDocumentPosition - !aF.compareDocumentPosition;
      if (aH) {
        return aH
      }
      aH = (aG.ownerDocument || aG) === (aF.ownerDocument || aF) ? aG.compareDocumentPosition(aF) : 1;
      if (aH & 1 || (!ay.sortDetached && aF.compareDocumentPosition(aG) === aH)) {
        if (aG === aE || aG.ownerDocument === O && K(O, aG)) {
          return -1
        }
        if (aF === aE || aF.ownerDocument === O && K(O, aF)) {
          return 1
        }
        return N ? (j.call(N, aG) - j.call(N, aF)) : 0
      }
      return aH & 4 ? -1 : 1
    } : function(aG, aF) {
      if (aG === aF) {
        ac = true;
        return 0
      }
      var aM, aJ = 0,
        aL = aG.parentNode,
        aI = aF.parentNode,
        aH = [aG],
        aK = [aF];
      if (!aL || !aI) {
        return aG === aE ? -1 : aF === aE ? 1 : aL ? -1 : aI ? 1 : N ? (j.call(N, aG) - j.call(N, aF)) : 0
      } else {
        if (aL === aI) {
          return f(aG, aF)
        }
      }
      aM = aG;
      while ((aM = aM.parentNode)) {
        aH.unshift(aM)
      }
      aM = aF;
      while ((aM = aM.parentNode)) {
        aK.unshift(aM)
      }
      while (aH[aJ] === aK[aJ]) {
        aJ++
      }
      return aJ ? f(aH[aJ], aK[aJ]) : aH[aJ] === O ? -1 : aK[aJ] === O ? 1 : 0
    };
    return aE
  };
  B.matches = function(i, e) {
    return B(i, null, null, e)
  };
  B.matchesSelector = function(aD, aF) {
    if ((aD.ownerDocument || aD) !== H) {
      ae(aD)
    }
    aF = aF.replace(z, "='$1']");
    if (ay.matchesSelector && an && (!aw || !aw.test(aF)) && (!ai || !ai.test(aF))) {
      try {
        var i = k.call(aD, aF);
        if (i || ay.disconnectedMatch || aD.document && aD.document.nodeType !== 11) {
          return i
        }
      } catch (aE) {}
    }
    return B(aF, H, null, [aD]).length > 0
  };
  B.contains = function(e, i) {
    if ((e.ownerDocument || e) !== H) {
      ae(e)
    }
    return K(e, i)
  };
  B.attr = function(aD, e) {
    if ((aD.ownerDocument || aD) !== H) {
      ae(aD)
    }
    var i = t.attrHandle[e.toLowerCase()],
      aE = i && T.call(t.attrHandle, e.toLowerCase()) ? i(aD, e, !an) : undefined;
    return aE !== undefined ? aE : ay.attributes || !an ? aD.getAttribute(e) : (aE = aD.getAttributeNode(e)) && aE.specified ? aE.value : null
  };
  B.error = function(e) {
    throw new Error("Syntax error, unrecognized expression: " + e)
  };
  B.uniqueSort = function(aE) {
    var aF, aG = [],
      e = 0,
      aD = 0;
    ac = !ay.detectDuplicates;
    N = !ay.sortStable && aE.slice(0);
    aE.sort(J);
    if (ac) {
      while ((aF = aE[aD++])) {
        if (aF === aE[aD]) {
          e = aG.push(aD)
        }
      }
      while (e--) {
        aE.splice(aG[e], 1)
      }
    }
    N = null;
    return aE
  };
  M = B.getText = function(aG) {
    var aF, aD = "",
      aE = 0,
      e = aG.nodeType;
    if (!e) {
      while ((aF = aG[aE++])) {
        aD += M(aF)
      }
    } else {
      if (e === 1 || e === 9 || e === 11) {
        if (typeof aG.textContent === "string") {
          return aG.textContent
        } else {
          for (aG = aG.firstChild; aG; aG = aG.nextSibling) {
            aD += M(aG)
          }
        }
      } else {
        if (e === 3 || e === 4) {
          return aG.nodeValue
        }
      }
    }
    return aD
  };
  t = B.selectors = {
    cacheLength: 50,
    createPseudo: p,
    match: ah,
    attrHandle: {},
    find: {},
    relative: {
      ">": {
        dir: "parentNode",
        first: true
      },
      " ": {
        dir: "parentNode"
      },
      "+": {
        dir: "previousSibling",
        first: true
      },
      "~": {
        dir: "previousSibling"
      }
    },
    preFilter: {
      ATTR: function(e) {
        e[1] = e[1].replace(y, ak);
        e[3] = (e[4] || e[5] || "").replace(y, ak);
        if (e[2] === "~=") {
          e[3] = " " + e[3] + " "
        }
        return e.slice(0, 4)
      },
      CHILD: function(e) {
        e[1] = e[1].toLowerCase();
        if (e[1].slice(0, 3) === "nth") {
          if (!e[3]) {
            B.error(e[0])
          }
          e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd"));
          e[5] = +((e[7] + e[8]) || e[3] === "odd")
        } else {
          if (e[3]) {
            B.error(e[0])
          }
        }
        return e
      },
      PSEUDO: function(i) {
        var e, aD = !i[5] && i[2];
        if (ah.CHILD.test(i[0])) {
          return null
        }
        if (i[3] && i[4] !== undefined) {
          i[2] = i[4]
        } else {
          if (aD && X.test(aD) && (e = n(aD, true)) && (e = aD.indexOf(")", aD.length - e) - aD.length)) {
            i[0] = i[0].slice(0, e);
            i[2] = aD.slice(0, e)
          }
        }
        return i.slice(0, 3)
      }
    },
    filter: {
      TAG: function(i) {
        var e = i.replace(y, ak).toLowerCase();
        return i === "*" ? function() {
          return true
        } : function(aD) {
          return aD.nodeName && aD.nodeName.toLowerCase() === e
        }
      },
      CLASS: function(e) {
        var i = d[e + " "];
        return i || (i = new RegExp("(^|" + v + ")" + e + "(" + v + "|$)")) && d(e, function(aD) {
          return i.test(typeof aD.className === "string" && aD.className || typeof aD.getAttribute !== au && aD.getAttribute("class") || "")
        })
      },
      ATTR: function(aD, i, e) {
        return function(aF) {
          var aE = B.attr(aF, aD);
          if (aE == null) {
            return i === "!="
          }
          if (!i) {
            return true
          }
          aE += "";
          return i === "=" ? aE === e : i === "!=" ? aE !== e : i === "^=" ? e && aE.indexOf(e) === 0 : i === "*=" ? e && aE.indexOf(e) > -1 : i === "$=" ? e && aE.slice(-e.length) === e : i === "~=" ? (" " + aE + " ").indexOf(e) > -1 : i === "|=" ? aE === e || aE.slice(0, e.length + 1) === e + "-" : false
        }
      },
      CHILD: function(i, aF, aE, aG, aD) {
        var aI = i.slice(0, 3) !== "nth",
          e = i.slice(-4) !== "last",
          aH = aF === "of-type";
        return aG === 1 && aD === 0 ? function(aJ) {
          return !!aJ.parentNode
        } : function(aP, aN, aS) {
          var aJ, aV, aQ, aU, aR, aM, aO = aI !== e ? "nextSibling" : "previousSibling",
            aT = aP.parentNode,
            aL = aH && aP.nodeName.toLowerCase(),
            aK = !aS && !aH;
          if (aT) {
            if (aI) {
              while (aO) {
                aQ = aP;
                while ((aQ = aQ[aO])) {
                  if (aH ? aQ.nodeName.toLowerCase() === aL : aQ.nodeType === 1) {
                    return false
                  }
                }
                aM = aO = i === "only" && !aM && "nextSibling"
              }
              return true
            }
            aM = [e ? aT.firstChild : aT.lastChild];
            if (e && aK) {
              aV = aT[ap] || (aT[ap] = {});
              aJ = aV[i] || [];
              aR = aJ[0] === az && aJ[1];
              aU = aJ[0] === az && aJ[2];
              aQ = aR && aT.childNodes[aR];
              while ((aQ = ++aR && aQ && aQ[aO] || (aU = aR = 0) || aM.pop())) {
                if (aQ.nodeType === 1 && ++aU && aQ === aP) {
                  aV[i] = [az, aR, aU];
                  break
                }
              }
            } else {
              if (aK && (aJ = (aP[ap] || (aP[ap] = {}))[i]) && aJ[0] === az) {
                aU = aJ[1]
              } else {
                while ((aQ = ++aR && aQ && aQ[aO] || (aU = aR = 0) || aM.pop())) {
                  if ((aH ? aQ.nodeName.toLowerCase() === aL : aQ.nodeType === 1) && ++aU) {
                    if (aK) {
                      (aQ[ap] || (aQ[ap] = {}))[i] = [az, aU]
                    }
                    if (aQ === aP) {
                      break
                    }
                  }
                }
              }
            }
            aU -= aD;
            return aU === aG || (aU % aG === 0 && aU / aG >= 0)
          }
        }
      },
      PSEUDO: function(aE, aD) {
        var e, i = t.pseudos[aE] || t.setFilters[aE.toLowerCase()] || B.error("unsupported pseudo: " + aE);
        if (i[ap]) {
          return i(aD)
        }
        if (i.length > 1) {
          e = [aE, aE, "", aD];
          return t.setFilters.hasOwnProperty(aE.toLowerCase()) ? p(function(aH, aJ) {
            var aG, aF = i(aH, aD),
              aI = aF.length;
            while (aI--) {
              aG = j.call(aH, aF[aI]);
              aH[aG] = !(aJ[aG] = aF[aI])
            }
          }) : function(aF) {
            return i(aF, 0, e)
          }
        }
        return i
      }
    },
    pseudos: {
      not: p(function(e) {
        var i = [],
          aD = [],
          aE = ab(e.replace(x, "$1"));
        return aE[ap] ? p(function(aG, aL, aJ, aH) {
          var aK, aF = aE(aG, null, aH, []),
            aI = aG.length;
          while (aI--) {
            if ((aK = aF[aI])) {
              aG[aI] = !(aL[aI] = aK)
            }
          }
        }) : function(aH, aG, aF) {
          i[0] = aH;
          aE(i, null, aF, aD);
          return !aD.pop()
        }
      }),
      has: p(function(e) {
        return function(i) {
          return B(e, i).length > 0
        }
      }),
      contains: p(function(e) {
        return function(i) {
          return (i.textContent || i.innerText || M(i)).indexOf(e) > -1
        }
      }),
      lang: p(function(e) {
        if (!Z.test(e || "")) {
          B.error("unsupported lang: " + e)
        }
        e = e.replace(y, ak).toLowerCase();
        return function(aD) {
          var i;
          do {
            if ((i = an ? aD.lang : aD.getAttribute("xml:lang") || aD.getAttribute("lang"))) {
              i = i.toLowerCase();
              return i === e || i.indexOf(e + "-") === 0
            }
          } while ((aD = aD.parentNode) && aD.nodeType === 1);
          return false
        }
      }),
      target: function(e) {
        var i = av.location && av.location.hash;
        return i && i.slice(1) === e.id
      },
      root: function(e) {
        return e === u
      },
      focus: function(e) {
        return e === H.activeElement && (!H.hasFocus || H.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
      },
      enabled: function(e) {
        return e.disabled === false
      },
      disabled: function(e) {
        return e.disabled === true
      },
      checked: function(e) {
        var i = e.nodeName.toLowerCase();
        return (i === "input" && !!e.checked) || (i === "option" && !!e.selected)
      },
      selected: function(e) {
        if (e.parentNode) {
          e.parentNode.selectedIndex
        }
        return e.selected === true
      },
      empty: function(e) {
        for (e = e.firstChild; e; e = e.nextSibling) {
          if (e.nodeType < 6) {
            return false
          }
        }
        return true
      },
      parent: function(e) {
        return !t.pseudos.empty(e)
      },
      header: function(e) {
        return r.test(e.nodeName)
      },
      input: function(e) {
        return h.test(e.nodeName)
      },
      button: function(i) {
        var e = i.nodeName.toLowerCase();
        return e === "input" && i.type === "button" || e === "button"
      },
      text: function(i) {
        var e;
        return i.nodeName.toLowerCase() === "input" && i.type === "text" && ((e = i.getAttribute("type")) == null || e.toLowerCase() === "text")
      },
      first: am(function() {
        return [0]
      }),
      last: am(function(e, i) {
        return [i - 1]
      }),
      eq: am(function(e, aD, i) {
        return [i < 0 ? i + aD : i]
      }),
      even: am(function(e, aE) {
        var aD = 0;
        for (; aD < aE; aD += 2) {
          e.push(aD)
        }
        return e
      }),
      odd: am(function(e, aE) {
        var aD = 1;
        for (; aD < aE; aD += 2) {
          e.push(aD)
        }
        return e
      }),
      lt: am(function(e, aF, aE) {
        var aD = aE < 0 ? aE + aF : aE;
        for (; --aD >= 0;) {
          e.push(aD)
        }
        return e
      }),
      gt: am(function(e, aF, aE) {
        var aD = aE < 0 ? aE + aF : aE;
        for (; ++aD < aF;) {
          e.push(aD)
        }
        return e
      })
    }
  };
  t.pseudos.nth = t.pseudos.eq;
  for (D in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true
    }) {
    t.pseudos[D] = C(D)
  }
  for (D in {
      submit: true,
      reset: true
    }) {
    t.pseudos[D] = g(D)
  }

  function aa() {}
  aa.prototype = t.filters = t.pseudos;
  t.setFilters = new aa();

  function n(aF, aK) {
    var i, aG, aI, aJ, aH, aD, e, aE = ao[aF + " "];
    if (aE) {
      return aK ? 0 : aE.slice(0)
    }
    aH = aF;
    aD = [];
    e = t.preFilter;
    while (aH) {
      if (!i || (aG = A.exec(aH))) {
        if (aG) {
          aH = aH.slice(aG[0].length) || aH
        }
        aD.push((aI = []))
      }
      i = false;
      if ((aG = G.exec(aH))) {
        i = aG.shift();
        aI.push({
          value: i,
          type: aG[0].replace(x, " ")
        });
        aH = aH.slice(i.length)
      }
      for (aJ in t.filter) {
        if ((aG = ah[aJ].exec(aH)) && (!e[aJ] || (aG = e[aJ](aG)))) {
          i = aG.shift();
          aI.push({
            value: i,
            type: aJ,
            matches: aG
          });
          aH = aH.slice(i.length)
        }
      }
      if (!i) {
        break
      }
    }
    return aK ? aH.length : aH ? B.error(aF) : ao(aF, aD).slice(0)
  }

  function o(aF) {
    var aE = 0,
      aD = aF.length,
      e = "";
    for (; aE < aD; aE++) {
      e += aF[aE].value
    }
    return e
  }

  function w(aF, aD, aE) {
    var e = aD.dir,
      aG = aE && e === "parentNode",
      i = aj++;
    return aD.first ? function(aJ, aI, aH) {
      while ((aJ = aJ[e])) {
        if (aJ.nodeType === 1 || aG) {
          return aF(aJ, aI, aH)
        }
      }
    } : function(aL, aJ, aI) {
      var aM, aK, aH = [az, i];
      if (aI) {
        while ((aL = aL[e])) {
          if (aL.nodeType === 1 || aG) {
            if (aF(aL, aJ, aI)) {
              return true
            }
          }
        }
      } else {
        while ((aL = aL[e])) {
          if (aL.nodeType === 1 || aG) {
            aK = aL[ap] || (aL[ap] = {});
            if ((aM = aK[e]) && aM[0] === az && aM[1] === i) {
              return (aH[2] = aM[2])
            } else {
              aK[e] = aH;
              if ((aH[2] = aF(aL, aJ, aI))) {
                return true
              }
            }
          }
        }
      }
    }
  }

  function aB(e) {
    return e.length > 1 ? function(aG, aF, aD) {
      var aE = e.length;
      while (aE--) {
        if (!e[aE](aG, aF, aD)) {
          return false
        }
      }
      return true
    } : e[0]
  }

  function E(aD, aG, aF) {
    var aE = 0,
      e = aG.length;
    for (; aE < e; aE++) {
      B(aD, aG[aE], aF)
    }
    return aF
  }

  function af(e, aD, aE, aF, aI) {
    var aG, aL = [],
      aH = 0,
      aJ = e.length,
      aK = aD != null;
    for (; aH < aJ; aH++) {
      if ((aG = e[aH])) {
        if (!aE || aE(aG, aF, aI)) {
          aL.push(aG);
          if (aK) {
            aD.push(aH)
          }
        }
      }
    }
    return aL
  }

  function m(aD, i, aF, aE, aG, e) {
    if (aE && !aE[ap]) {
      aE = m(aE)
    }
    if (aG && !aG[ap]) {
      aG = m(aG, e)
    }
    return p(function(aR, aO, aJ, aQ) {
      var aT, aP, aL, aK = [],
        aS = [],
        aI = aO.length,
        aH = aR || E(i || "*", aJ.nodeType ? [aJ] : aJ, []),
        aM = aD && (aR || !i) ? af(aH, aK, aD, aJ, aQ) : aH,
        aN = aF ? aG || (aR ? aD : aI || aE) ? [] : aO : aM;
      if (aF) {
        aF(aM, aN, aJ, aQ)
      }
      if (aE) {
        aT = af(aN, aS);
        aE(aT, [], aJ, aQ);
        aP = aT.length;
        while (aP--) {
          if ((aL = aT[aP])) {
            aN[aS[aP]] = !(aM[aS[aP]] = aL)
          }
        }
      }
      if (aR) {
        if (aG || aD) {
          if (aG) {
            aT = [];
            aP = aN.length;
            while (aP--) {
              if ((aL = aN[aP])) {
                aT.push((aM[aP] = aL))
              }
            }
            aG(null, (aN = []), aT, aQ)
          }
          aP = aN.length;
          while (aP--) {
            if ((aL = aN[aP]) && (aT = aG ? j.call(aR, aL) : aK[aP]) > -1) {
              aR[aT] = !(aO[aT] = aL)
            }
          }
        }
      } else {
        aN = af(aN === aO ? aN.splice(aI, aN.length) : aN);
        if (aG) {
          aG(null, aO, aN, aQ)
        } else {
          b.apply(aO, aN)
        }
      }
    })
  }

  function aq(aI) {
    var aD, aG, aE, aH = aI.length,
      aL = t.relative[aI[0].type],
      aM = aL || t.relative[" "],
      aF = aL ? 1 : 0,
      aJ = w(function(i) {
        return i === aD
      }, aM, true),
      aK = w(function(i) {
        return j.call(aD, i) > -1
      }, aM, true),
      e = [function(aO, aN, i) {
        return (!aL && (i || aN !== aC)) || ((aD = aN).nodeType ? aJ(aO, aN, i) : aK(aO, aN, i))
      }];
    for (; aF < aH; aF++) {
      if ((aG = t.relative[aI[aF].type])) {
        e = [w(aB(e), aG)]
      } else {
        aG = t.filter[aI[aF].type].apply(null, aI[aF].matches);
        if (aG[ap]) {
          aE = ++aF;
          for (; aE < aH; aE++) {
            if (t.relative[aI[aE].type]) {
              break
            }
          }
          return m(aF > 1 && aB(e), aF > 1 && o(aI.slice(0, aF - 1).concat({
            value: aI[aF - 2].type === " " ? "*" : ""
          })).replace(x, "$1"), aG, aF < aE && aq(aI.slice(aF, aE)), aE < aH && aq((aI = aI.slice(aE))), aE < aH && o(aI))
        }
        e.push(aG)
      }
    }
    return aB(e)
  }

  function ad(aE, aD) {
    var e = aD.length > 0,
      aF = aE.length > 0,
      i = function(aP, aJ, aO, aN, aS) {
        var aK, aL, aQ, aU = 0,
          aM = "0",
          aG = aP && [],
          aV = [],
          aT = aC,
          aI = aP || aF && t.find.TAG("*", aS),
          aH = (az += aT == null ? 1 : Math.random() || 0.1),
          aR = aI.length;
        if (aS) {
          aC = aJ !== H && aJ
        }
        for (; aM !== aR && (aK = aI[aM]) != null; aM++) {
          if (aF && aK) {
            aL = 0;
            while ((aQ = aE[aL++])) {
              if (aQ(aK, aJ, aO)) {
                aN.push(aK);
                break
              }
            }
            if (aS) {
              az = aH
            }
          }
          if (e) {
            if ((aK = !aQ && aK)) {
              aU--
            }
            if (aP) {
              aG.push(aK)
            }
          }
        }
        aU += aM;
        if (e && aM !== aU) {
          aL = 0;
          while ((aQ = aD[aL++])) {
            aQ(aG, aV, aJ, aO)
          }
          if (aP) {
            if (aU > 0) {
              while (aM--) {
                if (!(aG[aM] || aV[aM])) {
                  aV[aM] = at.call(aN)
                }
              }
            }
            aV = af(aV)
          }
          b.apply(aN, aV);
          if (aS && !aP && aV.length > 0 && (aU + aD.length) > 1) {
            B.uniqueSort(aN)
          }
        }
        if (aS) {
          az = aH;
          aC = aT
        }
        return aG
      };
    return e ? p(i) : i
  }
  ab = B.compile = function(e, aE) {
    var aF, aD = [],
      aH = [],
      aG = L[e + " "];
    if (!aG) {
      if (!aE) {
        aE = n(e)
      }
      aF = aE.length;
      while (aF--) {
        aG = aq(aE[aF]);
        if (aG[ap]) {
          aD.push(aG)
        } else {
          aH.push(aG)
        }
      }
      aG = L(e, ad(aH, aD));
      aG.selector = e
    }
    return aG
  };
  ax = B.select = function(aE, e, aF, aI) {
    var aG, aL, aD, aM, aJ, aK = typeof aE === "function" && aE,
      aH = !aI && n((aE = aK.selector || aE));
    aF = aF || [];
    if (aH.length === 1) {
      aL = aH[0] = aH[0].slice(0);
      if (aL.length > 2 && (aD = aL[0]).type === "ID" && ay.getById && e.nodeType === 9 && an && t.relative[aL[1].type]) {
        e = (t.find.ID(aD.matches[0].replace(y, ak), e) || [])[0];
        if (!e) {
          return aF
        } else {
          if (aK) {
            e = e.parentNode
          }
        }
        aE = aE.slice(aL.shift().value.length)
      }
      aG = ah.needsContext.test(aE) ? 0 : aL.length;
      while (aG--) {
        aD = aL[aG];
        if (t.relative[(aM = aD.type)]) {
          break
        }
        if ((aJ = t.find[aM])) {
          if ((aI = aJ(aD.matches[0].replace(y, ak), ag.test(aL[0].type) && Y(e.parentNode) || e))) {
            aL.splice(aG, 1);
            aE = aI.length && o(aL);
            if (!aE) {
              b.apply(aF, aI);
              return aF
            }
            break
          }
        }
      }
    }(aK || ab(aE, aH))(aI, e, !an, aF, ag.test(aE) && Y(e.parentNode) || e);
    return aF
  };
  ay.sortStable = ap.split("").sort(J).join("") === ap;
  ay.detectDuplicates = !!ac;
  ae();
  ay.sortDetached = l(function(e) {
    return e.compareDocumentPosition(H.createElement("div")) & 1
  });
  if (!l(function(e) {
      e.innerHTML = "<a href='#'></a>";
      return e.firstChild.getAttribute("href") === "#"
    })) {
    aA("type|href|height|width", function(i, e, aD) {
      if (!aD) {
        return i.getAttribute(e, e.toLowerCase() === "type" ? 1 : 2)
      }
    })
  }
  if (!ay.attributes || !l(function(e) {
      e.innerHTML = "<input/>";
      e.firstChild.setAttribute("value", "");
      return e.firstChild.getAttribute("value") === ""
    })) {
    aA("value", function(i, e, aD) {
      if (!aD && i.nodeName.toLowerCase() === "input") {
        return i.defaultValue
      }
    })
  }
  if (!l(function(e) {
      return e.getAttribute("disabled") == null
    })) {
    aA(c, function(i, e, aE) {
      var aD;
      if (!aE) {
        return i[e] === true ? e.toLowerCase() : (aD = i.getAttributeNode(e)) && aD.specified ? aD.value : null
      }
    })
  }
  if (typeof define === "function" && define.amd) {
    define(function() {
      return B
    })
  } else {
    if (typeof module !== "undefined" && module.exports) {
      module.exports = B
    } else {
      av.Sizzle = B
    }
  }
})(window);
(function() {
  if (typeof Sizzle !== "undefined") {
    return
  }
  if (typeof define !== "undefined" && define.amd) {
    window.Sizzle = Prototype._actual_sizzle;
    window.define = Prototype._original_define;
    delete Prototype._actual_sizzle;
    delete Prototype._original_define
  } else {
    if (typeof module !== "undefined" && module.exports) {
      window.Sizzle = module.exports;
      module.exports = {}
    }
  }
})();
(function(c) {
  var d = Prototype.Selector.extendElements;

  function a(e, f) {
    return d(c(e, f || document))
  }

  function b(f, e) {
    return c.matches(e, [f]).length == 1
  }
  Prototype.Selector.engine = c;
  Prototype.Selector.select = a;
  Prototype.Selector.match = b
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
  reset: function(a) {
    a = $(a);
    a.reset();
    return a
  },
  serializeElements: function(h, d) {
    if (typeof d != "object") {
      d = {
        hash: !!d
      }
    } else {
      if (Object.isUndefined(d.hash)) {
        d.hash = true
      }
    }
    var e, g, a = false,
      f = d.submit,
      b, c;
    if (d.hash) {
      c = {};
      b = function(i, j, k) {
        if (j in i) {
          if (!Object.isArray(i[j])) {
            i[j] = [i[j]]
          }
          i[j] = i[j].concat(k)
        } else {
          i[j] = k
        }
        return i
      }
    } else {
      c = "";
      b = function(i, k, j) {
        if (!Object.isArray(j)) {
          j = [j]
        }
        if (!j.length) {
          return i
        }
        var l = encodeURIComponent(k).gsub(/%20/, "+");
        return i + (i ? "&" : "") + j.map(function(m) {
          m = m.gsub(/(\r)?\n/, "\r\n");
          m = encodeURIComponent(m);
          m = m.gsub(/%20/, "+");
          return l + "=" + m
        }).join("&")
      }
    }
    return h.inject(c, function(i, j) {
      if (!j.disabled && j.name) {
        e = j.name;
        g = $(j).getValue();
        if (g != null && j.type != "file" && (j.type != "submit" || (!a && f !== false && (!f || e == f) && (a = true)))) {
          i = b(i, e, g)
        }
      }
      return i
    })
  }
};
Form.Methods = {
  serialize: function(b, a) {
    return Form.serializeElements(Form.getElements(b), a)
  },
  getElements: function(e) {
    var f = $(e).getElementsByTagName("*");
    var d, c = [],
      b = Form.Element.Serializers;
    for (var a = 0; d = f[a]; a++) {
      if (b[d.tagName.toLowerCase()]) {
        c.push(Element.extend(d))
      }
    }
    return c
  },
  getInputs: function(g, c, d) {
    g = $(g);
    var a = g.getElementsByTagName("input");
    if (!c && !d) {
      return $A(a).map(Element.extend)
    }
    for (var e = 0, h = [], f = a.length; e < f; e++) {
      var b = a[e];
      if ((c && b.type != c) || (d && b.name != d)) {
        continue
      }
      h.push(Element.extend(b))
    }
    return h
  },
  disable: function(a) {
    a = $(a);
    Form.getElements(a).invoke("disable");
    return a
  },
  enable: function(a) {
    a = $(a);
    Form.getElements(a).invoke("enable");
    return a
  },
  findFirstElement: function(b) {
    var c = $(b).getElements().findAll(function(d) {
      return "hidden" != d.type && !d.disabled
    });
    var a = c.findAll(function(d) {
      return d.hasAttribute("tabIndex") && d.tabIndex >= 0
    }).sortBy(function(d) {
      return d.tabIndex
    }).first();
    return a ? a : c.find(function(d) {
      return /^(?:input|select|textarea)$/i.test(d.tagName)
    })
  },
  focusFirstElement: function(b) {
    b = $(b);
    var a = b.findFirstElement();
    if (a) {
      a.activate()
    }
    return b
  },
  request: function(b, a) {
    b = $(b), a = Object.clone(a || {});
    var d = a.parameters,
      c = b.readAttribute("action") || "";
    if (c.blank()) {
      c = window.location.href
    }
    a.parameters = b.serialize(true);
    if (d) {
      if (Object.isString(d)) {
        d = d.toQueryParams()
      }
      Object.extend(a.parameters, d)
    }
    if (b.hasAttribute("method") && !a.method) {
      a.method = b.method
    }
    return new Ajax.Request(c, a)
  }
};
Form.Element = {
  focus: function(a) {
    $(a).focus();
    return a
  },
  select: function(a) {
    $(a).select();
    return a
  }
};
Form.Element.Methods = {
  serialize: function(a) {
    a = $(a);
    if (!a.disabled && a.name) {
      var b = a.getValue();
      if (b != undefined) {
        var c = {};
        c[a.name] = b;
        return Object.toQueryString(c)
      }
    }
    return ""
  },
  getValue: function(a) {
    a = $(a);
    var b = a.tagName.toLowerCase();
    return Form.Element.Serializers[b](a)
  },
  setValue: function(a, b) {
    a = $(a);
    var c = a.tagName.toLowerCase();
    Form.Element.Serializers[c](a, b);
    return a
  },
  clear: function(a) {
    $(a).value = "";
    return a
  },
  present: function(a) {
    return $(a).value != ""
  },
  activate: function(a) {
    a = $(a);
    try {
      a.focus();
      if (a.select && (a.tagName.toLowerCase() != "input" || !(/^(?:button|reset|submit)$/i.test(a.type)))) {
        a.select()
      }
    } catch (b) {}
    return a
  },
  disable: function(a) {
    a = $(a);
    a.disabled = true;
    return a
  },
  enable: function(a) {
    a = $(a);
    a.disabled = false;
    return a
  }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = (function() {
  function b(h, i) {
    switch (h.type.toLowerCase()) {
      case "checkbox":
      case "radio":
        return f(h, i);
      default:
        return e(h, i)
    }
  }

  function f(h, i) {
    if (Object.isUndefined(i)) {
      return h.checked ? h.value : null
    } else {
      h.checked = !!i
    }
  }

  function e(h, i) {
    if (Object.isUndefined(i)) {
      return h.value
    } else {
      h.value = i
    }
  }

  function a(k, n) {
    if (Object.isUndefined(n)) {
      return (k.type === "select-one" ? c : d)(k)
    }
    var j, l, o = !Object.isArray(n);
    for (var h = 0, m = k.length; h < m; h++) {
      j = k.options[h];
      l = this.optionValue(j);
      if (o) {
        if (l == n) {
          j.selected = true;
          return
        }
      } else {
        j.selected = n.include(l)
      }
    }
  }

  function c(i) {
    var h = i.selectedIndex;
    return h >= 0 ? g(i.options[h]) : null
  }

  function d(l) {
    var h, m = l.length;
    if (!m) {
      return null
    }
    for (var k = 0, h = []; k < m; k++) {
      var j = l.options[k];
      if (j.selected) {
        h.push(g(j))
      }
    }
    return h
  }

  function g(h) {
    return Element.hasAttribute(h, "value") ? h.value : h.text
  }
  return {
    input: b,
    inputSelector: f,
    textarea: e,
    select: a,
    selectOne: c,
    selectMany: d,
    optionValue: g,
    button: e
  }
})();
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, a, b, c) {
    $super(c, b);
    this.element = $(a);
    this.lastValue = this.getValue()
  },
  execute: function() {
    var a = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a : String(this.lastValue) != String(a)) {
      this.callback(this.element, a);
      this.lastValue = a
    }
  }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element)
  }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element)
  }
});
Abstract.EventObserver = Class.create({
  initialize: function(a, b) {
    this.element = $(a);
    this.callback = b;
    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == "form") {
      this.registerFormCallbacks()
    } else {
      this.registerCallback(this.element)
    }
  },
  onElementEvent: function() {
    var a = this.getValue();
    if (this.lastValue != a) {
      this.callback(this.element, a);
      this.lastValue = a
    }
  },
  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this)
  },
  registerCallback: function(a) {
    if (a.type) {
      switch (a.type.toLowerCase()) {
        case "checkbox":
        case "radio":
          Event.observe(a, "click", this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(a, "change", this.onElementEvent.bind(this));
          break
      }
    }
  }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element)
  }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element)
  }
});
(function(D) {
  var u = document.createElement("div");
  var d = document.documentElement;
  var k = "onmouseenter" in d && "onmouseleave" in d;
  var L = {
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    KEY_HOME: 36,
    KEY_END: 35,
    KEY_PAGEUP: 33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT: 45
  };
  var A = function(X) {
    return false
  };
  if (window.attachEvent) {
    if (window.addEventListener) {
      A = function(X) {
        return !(X instanceof window.Event)
      }
    } else {
      A = function(X) {
        return true
      }
    }
  }
  var O;

  function M(Y, X) {
    return Y.which ? (Y.which === X + 1) : (Y.button === X)
  }
  var W = {
    0: 1,
    1: 4,
    2: 2
  };

  function S(Y, X) {
    return Y.button === W[X]
  }

  function P(Y, X) {
    switch (X) {
      case 0:
        return Y.which == 1 && !Y.metaKey;
      case 1:
        return Y.which == 2 || (Y.which == 1 && Y.metaKey);
      case 2:
        return Y.which == 3;
      default:
        return false
    }
  }
  if (window.attachEvent) {
    if (!window.addEventListener) {
      O = S
    } else {
      O = function(Y, X) {
        return A(Y) ? S(Y, X) : M(Y, X)
      }
    }
  } else {
    if (Prototype.Browser.WebKit) {
      O = P
    } else {
      O = M
    }
  }

  function B(X) {
    return O(X, 0)
  }

  function i(X) {
    return O(X, 1)
  }

  function e(X) {
    return O(X, 2)
  }

  function o(X) {
    return Element.extend(K(X))
  }

  function K(Z) {
    Z = L.extend(Z);
    var Y = Z.target,
      X = Z.type,
      aa = Z.currentTarget;
    if (aa && aa.tagName) {
      if (X === "load" || X === "error" || (X === "click" && aa.tagName.toLowerCase() === "input" && aa.type === "radio")) {
        Y = aa
      }
    }
    return Y.nodeType == Node.TEXT_NODE ? Y.parentNode : Y
  }

  function j(Z, aa) {
    var Y = K(Z),
      X = Prototype.Selector;
    if (!aa) {
      return Element.extend(Y)
    }
    while (Y) {
      if (Object.isElement(Y) && X.match(Y, aa)) {
        return Element.extend(Y)
      }
      Y = Y.parentNode
    }
  }

  function t(X) {
    return {
      x: U(X),
      y: T(X)
    }
  }

  function U(Z) {
    var Y = document.documentElement,
      X = document.body || {
        scrollLeft: 0
      };
    return Z.pageX || (Z.clientX + (Y.scrollLeft || X.scrollLeft) - (Y.clientLeft || 0))
  }

  function T(Z) {
    var Y = document.documentElement,
      X = document.body || {
        scrollTop: 0
      };
    return Z.pageY || (Z.clientY + (Y.scrollTop || X.scrollTop) - (Y.clientTop || 0))
  }

  function r(X) {
    L.extend(X);
    X.preventDefault();
    X.stopPropagation();
    X.stopped = true
  }
  L.Methods = {
    isLeftClick: B,
    isMiddleClick: i,
    isRightClick: e,
    element: o,
    findElement: j,
    pointer: t,
    pointerX: U,
    pointerY: T,
    stop: r
  };
  var H = Object.keys(L.Methods).inject({}, function(X, Y) {
    X[Y] = L.Methods[Y].methodize();
    return X
  });
  if (window.attachEvent) {
    function V(Y) {
      var X;
      switch (Y.type) {
        case "mouseover":
        case "mouseenter":
          X = Y.fromElement;
          break;
        case "mouseout":
        case "mouseleave":
          X = Y.toElement;
          break;
        default:
          return null
      }
      return Element.extend(X)
    }
    var Q = {
      stopPropagation: function() {
        this.cancelBubble = true
      },
      preventDefault: function() {
        this.returnValue = false
      },
      inspect: function() {
        return "[object Event]"
      }
    };
    L.extend = function(Y, X) {
      if (!Y) {
        return false
      }
      if (!A(Y)) {
        return Y
      }
      if (Y._extendedByPrototype) {
        return Y
      }
      Y._extendedByPrototype = Prototype.emptyFunction;
      var Z = L.pointer(Y);
      Object.extend(Y, {
        target: Y.srcElement || X,
        relatedTarget: V(Y),
        pageX: Z.x,
        pageY: Z.y
      });
      Object.extend(Y, H);
      Object.extend(Y, Q);
      return Y
    }
  } else {
    L.extend = Prototype.K
  }
  if (window.addEventListener) {
    L.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__;
    Object.extend(L.prototype, H)
  }
  var v = {
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  };

  function f(X) {
    return v[X] || X
  }
  if (k) {
    f = Prototype.K
  }

  function R(X) {
    if (X === window) {
      return 0
    }
    if (typeof X._prototypeUID === "undefined") {
      X._prototypeUID = Element.Storage.UID++
    }
    return X._prototypeUID
  }

  function I(X) {
    if (X === window) {
      return 0
    }
    if (X == document) {
      return 1
    }
    return X.uniqueID
  }
  if ("uniqueID" in u) {
    R = I
  }

  function x(X) {
    return X.include(":")
  }
  L._isCustomEvent = x;

  function z(Z, Y) {
    var X = D.Event.cache;
    if (Object.isUndefined(Y)) {
      Y = R(Z)
    }
    if (!X[Y]) {
      X[Y] = {
        element: Z
      }
    }
    return X[Y]
  }

  function E(Y, X) {
    if (Object.isUndefined(X)) {
      X = R(Y)
    }
    delete D.Event.cache[X]
  }

  function h(Z, ac, af) {
    var X = z(Z);
    if (!X[ac]) {
      X[ac] = []
    }
    var ab = X[ac];
    var aa = ab.length;
    while (aa--) {
      if (ab[aa].handler === af) {
        return null
      }
    }
    var ad = R(Z);
    var Y = D.Event._createResponder(ad, ac, af);
    var ae = {
      responder: Y,
      handler: af
    };
    ab.push(ae);
    return ae
  }

  function s(ac, Z, ad) {
    var Y = z(ac);
    var X = Y[Z] || [];
    var ab = X.length,
      ae;
    while (ab--) {
      if (X[ab].handler === ad) {
        ae = X[ab];
        break
      }
    }
    if (ae) {
      var aa = X.indexOf(ae);
      X.splice(aa, 1)
    }
    if (X.length === 0) {
      delete Y[Z];
      if (Object.keys(Y).length === 1 && ("element" in Y)) {
        E(ac)
      }
    }
    return ae
  }

  function c(Z, Y, aa) {
    Z = $(Z);
    var ab = h(Z, Y, aa);
    if (ab === null) {
      return Z
    }
    var X = ab.responder;
    if (x(Y)) {
      p(Z, Y, X)
    } else {
      m(Z, Y, X)
    }
    return Z
  }

  function m(aa, Z, Y) {
    var X = f(Z);
    if (aa.addEventListener) {
      aa.addEventListener(X, Y, false)
    } else {
      aa.attachEvent("on" + X, Y)
    }
  }

  function p(Z, Y, X) {
    if (Z.addEventListener) {
      Z.addEventListener("dataavailable", X, false)
    } else {
      Z.attachEvent("ondataavailable", X);
      Z.attachEvent("onlosecapture", X)
    }
  }

  function J(Y, X, Z) {
    Y = $(Y);
    var ab = !Object.isUndefined(Z),
      ac = !Object.isUndefined(X);
    if (!ac && !ab) {
      y(Y);
      return Y
    }
    if (!ab) {
      G(Y, X);
      return Y
    }
    var aa = s(Y, X, Z);
    if (!aa) {
      return Y
    }
    a(Y, X, aa.responder);
    return Y
  }

  function C(aa, Z, Y) {
    var X = f(Z);
    if (aa.removeEventListener) {
      aa.removeEventListener(X, Y, false)
    } else {
      aa.detachEvent("on" + X, Y)
    }
  }

  function b(Z, Y, X) {
    if (Z.removeEventListener) {
      Z.removeEventListener("dataavailable", X, false)
    } else {
      Z.detachEvent("ondataavailable", X);
      Z.detachEvent("onlosecapture", X)
    }
  }

  function y(ac) {
    var ab = R(ac),
      Z = D.Event.cache[ab];
    if (!Z) {
      return
    }
    E(ac, ab);
    var X, aa;
    for (var Y in Z) {
      if (Y === "element") {
        continue
      }
      X = Z[Y];
      aa = X.length;
      while (aa--) {
        a(ac, Y, X[aa].responder)
      }
    }
  }

  function G(ac, Z) {
    var Y = z(ac);
    var X = Y[Z];
    if (X) {
      delete Y[Z]
    }
    X = X || [];
    var ab = X.length;
    while (ab--) {
      a(ac, Z, X[ab].responder)
    }
    for (var aa in Y) {
      if (aa === "element") {
        continue
      }
      return
    }
    E(ac)
  }

  function a(Y, X, Z) {
    if (x(X)) {
      b(Y, X, Z)
    } else {
      C(Y, X, Z)
    }
  }

  function g(X) {
    if (X !== document) {
      return X
    }
    if (document.createEvent && !X.dispatchEvent) {
      return document.documentElement
    }
    return X
  }

  function w(aa, Z, Y, X) {
    aa = g($(aa));
    if (Object.isUndefined(X)) {
      X = true
    }
    Y = Y || {};
    var ab = N(aa, Z, Y, X);
    return L.extend(ab)
  }

  function l(aa, Z, Y, X) {
    var ab = document.createEvent("HTMLEvents");
    ab.initEvent("dataavailable", X, true);
    ab.eventName = Z;
    ab.memo = Y;
    aa.dispatchEvent(ab);
    return ab
  }

  function n(aa, Z, Y, X) {
    var ab = document.createEventObject();
    ab.eventType = X ? "ondataavailable" : "onlosecapture";
    ab.eventName = Z;
    ab.memo = Y;
    aa.fireEvent(ab.eventType, ab);
    return ab
  }
  var N = document.createEvent ? l : n;
  L.Handler = Class.create({
    initialize: function(Z, Y, X, aa) {
      this.element = $(Z);
      this.eventName = Y;
      this.selector = X;
      this.callback = aa;
      this.handler = this.handleEvent.bind(this)
    },
    start: function() {
      L.observe(this.element, this.eventName, this.handler);
      return this
    },
    stop: function() {
      L.stopObserving(this.element, this.eventName, this.handler);
      return this
    },
    handleEvent: function(Y) {
      var X = L.findElement(Y, this.selector);
      if (X) {
        this.callback.call(this.element, Y, X)
      }
    }
  });

  function F(Z, Y, X, aa) {
    Z = $(Z);
    if (Object.isFunction(X) && Object.isUndefined(aa)) {
      aa = X, X = null
    }
    return new L.Handler(Z, Y, X, aa).start()
  }
  Object.extend(L, L.Methods);
  Object.extend(L, {
    fire: w,
    observe: c,
    stopObserving: J,
    on: F
  });
  Element.addMethods({
    fire: w,
    observe: c,
    stopObserving: J,
    on: F
  });
  Object.extend(document, {
    fire: w.methodize(),
    observe: c.methodize(),
    stopObserving: J.methodize(),
    on: F.methodize(),
    loaded: false
  });
  if (D.Event) {
    Object.extend(window.Event, L)
  } else {
    D.Event = L
  }
  D.Event.cache = {};

  function q() {
    D.Event.cache = null
  }
  if (window.attachEvent) {
    window.attachEvent("onunload", q)
  }
  u = null;
  d = null
})(this);
(function(c) {
  var g = document.documentElement;
  var b = "onmouseenter" in g && "onmouseleave" in g;

  function f(h) {
    return !b && (h === "mouseenter" || h === "mouseleave")
  }

  function d(i, h, j) {
    if (Event._isCustomEvent(h)) {
      return e(i, h, j)
    }
    if (f(h)) {
      return a(i, h, j)
    }
    return function(l) {
      if (!Event.cache) {
        return
      }
      var k = Event.cache[i].element;
      Event.extend(l, k);
      j.call(k, l)
    }
  }

  function e(i, h, j) {
    return function(m) {
      var k = Event.cache[i];
      var l = k && k.element;
      if (Object.isUndefined(m.eventName)) {
        return false
      }
      if (m.eventName !== h) {
        return false
      }
      Event.extend(m, l);
      j.call(l, m)
    }
  }

  function a(i, h, j) {
    return function(m) {
      var k = Event.cache[i].element;
      Event.extend(m, k);
      var l = m.relatedTarget;
      while (l && l !== k) {
        try {
          l = l.parentNode
        } catch (n) {
          l = k
        }
      }
      if (l === k) {
        return
      }
      j.call(k, m)
    }
  }
  c.Event._createResponder = d;
  g = null
})(this);
(function(a) {
  var e;

  function b() {
    if (document.loaded) {
      return
    }
    if (e) {
      window.clearTimeout(e)
    }
    document.loaded = true;
    document.fire("dom:loaded")
  }

  function d() {
    if (document.readyState === "complete") {
      document.detachEvent("onreadystatechange", d);
      b()
    }
  }

  function c() {
    try {
      document.documentElement.doScroll("left")
    } catch (f) {
      e = c.defer();
      return
    }
    b()
  }
  if (document.readyState === "complete") {
    b();
    return
  }
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", b, false)
  } else {
    document.attachEvent("onreadystatechange", d);
    if (window == top) {
      e = c.defer()
    }
  }
  Event.observe(window, "load", b)
})(this);
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
  display: Element.toggle
};
Element.addMethods({
  childOf: Element.Methods.descendantOf
});
var Insertion = {
  Before: function(a, b) {
    return Element.insert(a, {
      before: b
    })
  },
  Top: function(a, b) {
    return Element.insert(a, {
      top: b
    })
  },
  Bottom: function(a, b) {
    return Element.insert(a, {
      bottom: b
    })
  },
  After: function(a, b) {
    return Element.insert(a, {
      after: b
    })
  }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
  includeScrollOffsets: false,
  prepare: function() {
    this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  },
  within: function(b, a, c) {
    if (this.includeScrollOffsets) {
      return this.withinIncludingScrolloffsets(b, a, c)
    }
    this.xcomp = a;
    this.ycomp = c;
    this.offset = Element.cumulativeOffset(b);
    return (c >= this.offset[1] && c < this.offset[1] + b.offsetHeight && a >= this.offset[0] && a < this.offset[0] + b.offsetWidth)
  },
  withinIncludingScrolloffsets: function(b, a, d) {
    var c = Element.cumulativeScrollOffset(b);
    this.xcomp = a + c[0] - this.deltaX;
    this.ycomp = d + c[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(b);
    return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + b.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + b.offsetWidth)
  },
  overlap: function(b, a) {
    if (!b) {
      return 0
    }
    if (b == "vertical") {
      return ((this.offset[1] + a.offsetHeight) - this.ycomp) / a.offsetHeight
    }
    if (b == "horizontal") {
      return ((this.offset[0] + a.offsetWidth) - this.xcomp) / a.offsetWidth
    }
  },
  cumulativeOffset: Element.Methods.cumulativeOffset,
  positionedOffset: Element.Methods.positionedOffset,
  absolutize: function(a) {
    Position.prepare();
    return Element.absolutize(a)
  },
  relativize: function(a) {
    Position.prepare();
    return Element.relativize(a)
  },
  realOffset: Element.Methods.cumulativeScrollOffset,
  offsetParent: Element.Methods.getOffsetParent,
  page: Element.Methods.viewportOffset,
  clone: function(b, c, a) {
    a = a || {};
    return Element.clonePosition(c, b, a)
  }
};
if (!document.getElementsByClassName) {
  document.getElementsByClassName = function(b) {
    function a(c) {
      return c.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + c + " ')]"
    }
    b.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function(c, e) {
      e = e.toString().strip();
      var d = /\s/.test(e) ? $w(e).map(a).join("") : a(e);
      return d ? document._getElementsByXPath(".//*" + d, c) : []
    } : function(e, f) {
      f = f.toString().strip();
      var g = [],
        h = (/\s/.test(f) ? $w(f) : null);
      if (!h && !f) {
        return g
      }
      var c = $(e).getElementsByTagName("*");
      f = " " + f + " ";
      for (var d = 0, k, j; k = c[d]; d++) {
        if (k.className && (j = " " + k.className + " ") && (j.include(f) || (h && h.all(function(i) {
            return !i.toString().blank() && j.include(" " + i + " ")
          })))) {
          g.push(Element.extend(k))
        }
      }
      return g
    };
    return function(d, c) {
      return $(c || document.body).getElementsByClassName(d)
    }
  }(Element.Methods)
}
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(a) {
    this.element = $(a)
  },
  _each: function(b, a) {
    this.element.className.split(/\s+/).select(function(c) {
      return c.length > 0
    })._each(b, a)
  },
  set: function(a) {
    this.element.className = a
  },
  add: function(a) {
    if (this.include(a)) {
      return
    }
    this.set($A(this).concat(a).join(" "))
  },
  remove: function(a) {
    if (!this.include(a)) {
      return
    }
    this.set($A(this).without(a).join(" "))
  },
  toString: function() {
    return $A(this).join(" ")
  }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function() {
  window.Selector = Class.create({
    initialize: function(a) {
      this.expression = a.strip()
    },
    findElements: function(a) {
      return Prototype.Selector.select(this.expression, a)
    },
    match: function(a) {
      return Prototype.Selector.match(a, this.expression)
    },
    toString: function() {
      return this.expression
    },
    inspect: function() {
      return "#<Selector: " + this.expression + ">"
    }
  });
  Object.extend(Selector, {
    matchElements: function(f, g) {
      var a = Prototype.Selector.match,
        d = [];
      for (var c = 0, e = f.length; c < e; c++) {
        var b = f[c];
        if (a(b, g)) {
          d.push(Element.extend(b))
        }
      }
      return d
    },
    findElement: function(f, g, b) {
      b = b || 0;
      var a = 0,
        d;
      for (var c = 0, e = f.length; c < e; c++) {
        d = f[c];
        if (Prototype.Selector.match(d, g) && b === a++) {
          return Element.extend(d)
        }
      }
    },
    findChildElements: function(b, c) {
      var a = c.toArray().join(", ");
      return Prototype.Selector.select(a, b || document)
    }
  })
})();
/*! RESOURCE: /scripts/lib/glide_updates/prototype.js */
Object.extendsObject = function() {
  return Class.create.apply(null, arguments).prototype;
}
Prototype.ScriptFragmentDetailed = '<script(?:[^>]*type=\"([^>]*?)\")?(?:[^>]*src=\"([^>]*?)\")?[^>]*>([\\S\\s]*?)<\/script>';
var g_evalScriptCache = {};
Object.extend(String.prototype, (function() {
  function extractScriptsDetailed() {
    var matchAll = new RegExp(Prototype.ScriptFragmentDetailed, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragmentDetailed, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      var m = scriptTag.match(matchOne) || ['', '', '', ''];
      if (m[1] == 'application/xml')
        return;
      if (m[1] == 'text/html')
        return;
      if (m[1] == 'text/ng-template')
        return;
      return {
        script: m[3],
        src: m[2]
      };
    });
  }

  function evalScripts(evalGlobal) {
    (function _executer(scripts) {
      if (!scripts || scripts.length == 0)
        return;
      var script = scripts.shift();
      if (!script)
        return _executer(scripts);
      if (script.src) {
        if (!g_evalScriptCache[script.src]) {
          g_evalScriptCache[script.src] = {
            state: 'loading',
            scripts: scripts
          };
          ajaxRequest(script.src, null, true, function(r) {
            g_evalScriptCache[script.src].state = 'loaded';
            var toEvalScripts = g_evalScriptCache[script.src].scripts;
            if (r && r.responseText)
              evalScript(r.responseText, evalGlobal);
            return _executer(toEvalScripts);
          });
        } else if (g_evalScriptCache[script.src].state == 'loading') {
          g_evalScriptCache[script.src].scripts = g_evalScriptCache[script.src].scripts.concat(scripts);
          return;
        } else if (g_evalScriptCache[script.src].state == 'loaded')
          return _executer(scripts);
      } else {
        if (script.script)
          evalScript(script.script, evalGlobal);
        return _executer(scripts);
      }
    })(this.extractScriptsDetailed());
  }
  return {
    evalScripts: evalScripts,
    extractScriptsDetailed: extractScriptsDetailed
  };
})());

function evalScript(s, evalGlobal) {
  if (s.length == 0)
    return;
  if (!evalGlobal)
    return eval(s);
  if (window.execScript)
    return window.execScript(s);
  return window.eval ? window.eval(s) : eval(s);
}
if (document.getElementsByClassName && typeof Element.Methods.getElementsByClassName === "function")
  document.getElementsByClassName = function(instanceMethods) {
    function iter(name) {
      return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
    }
    instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function(element, className) {
      className = className.toString().strip();
      var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
      return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
    } : function(element, className) {
      className = className.toString().strip();
      var elements = [],
        classNames = (/\s/.test(className) ? $w(className) : null);
      if (!classNames && !className)
        return elements;
      if (Object.isString(element))
        element = document.getElementById(element);
      Element.extend(element);
      var nodes = element.getElementsByTagName('*');
      className = ' ' + className + ' ';
      for (var i = 0, child, cn; child = nodes[i]; i++) {
        if (child.className && (cn = ' ' + child.className + ' ') &&
          (cn.include(className) || (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
          elements.push(Element.extend(child));
      }
      return elements;
    };
    return function(className, parentElement) {
      return $(parentElement || document.body).getElementsByClassName(className);
    };
  }(Element.Methods);
Object.equals = function(o1, o2) {
  var i1 = 0,
    i2 = 0;
  for (var p in o1) {
    if (!o1 || !o2 || typeof o1[p] !== typeof o2[p] || ((o1[p] === null) !== (o2[p] === null)))
      return false;
    switch (typeof o1[p]) {
      case 'undefined':
        if (typeof o2[p] != 'undefined')
          return false;
        break;
      case 'object':
        if (o1[p] !== null && o2[p] !== null && (o1[p].constructor.toString() !== o2[p].constructor.toString() || !Object.equals(o1[p], o2[p])))
          return false;
        break;
      case 'function':
        if (p != 'equals' && o1[p].toString() != o2[p].toString())
          return false;
        break;
      default:
        if (o1[p] !== o2[p])
          return false;
    }
    i1++;
  }
  for (var p in o2) i2++;
  if (i1 != i2)
    return false;
  return true;
}
document.viewport['getDimensions'] = function() {
  var el = window.document.compatMode === 'CSS1Compat' && (!Prototype.Browser.Opera ||
    window.parseFloat(window.opera.version()) < 9.5) ? window.document.documentElement : window.document.body;
  return {
    width: el.clientWidth,
    height: el.clientHeight
  };
};;
/*! RESOURCE: /scripts/lib/glide_updates/prototype.template.js */
var Template = Class.create({
  initialize: function(template) {
    this.template = template.toString();
    this.pattern = /(^|.|\r|\n)(#\{((JS|HTML):)?(.*?)\})/;
  },
  evaluate: function(object) {
    if (object && Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();
    return this.template.gsub(this.pattern, function(match) {
      if (object === null)
        return (match[1] + '');
      var before = match[1] || '';
      if (before === '\\')
        return match[2];
      var ctx = object,
        expr = match[5],
        escape = match[4],
        pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
      match = pattern.exec(expr);
      if (match === null)
        return before;
      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null === ctx || '' === match[3])
          break;
        expr = expr.substring('[' === match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }
      ctx = ctx || '';
      switch (escape || '') {
        case 'HTML':
          ctx = ctx.replace(/'/g, '&#39;').replace(/"/g, '&#34;').replace(/&(?![#|l|g])/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
          break;
        case 'JS':
          ctx = ctx.replace(/'/g, '&#39;').replace(/"/g, '&#34;');
          break;
      }
      return before + String.interpret(ctx);
    });
  }
});
var XMLTemplate = Class.create(Template, {
  initialize: function($super, id) {
    var s = $(id);
    $super(s && s.innerHTML ? s.innerHTML.replace(/%7B/g, '{').replace(/%7D/g, '}') : '');
  },
  toString: function() {
    'XMLTemplate';
  }
});;
/*! RESOURCE: /scripts/lib/glide_updates/prototype.plugin.js */
var Plugin = (function() {
  function create(name) {
    var args = $A(arguments);
    args.shift();
    var klass = function(argumentArray) {
      this.initialize.apply(this, argumentArray);
    };
    Object.extend(klass, Class.Methods);
    Object.extend(klass.prototype, args[0] || {});
    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;
    klass.prototype.constructor = klass;
    var methods = {};
    methods[name] = function(elem) {
      new klass(arguments);
      return elem;
    }.bind(this);
    Element.addMethods(methods);
  };
  return {
    create: create
  };
})();;
/*! RESOURCE: /scripts/lib/labjs/LAB.min.js */
/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(o) {
  var K = o.$LAB,
    y = "UseLocalXHR",
    z = "AlwaysPreserveOrder",
    u = "AllowDuplicates",
    A = "CacheBust",
    B = "BasePath",
    C = /^[^?#]*\//.exec(location.href)[0],
    D = /^\w+\:\/\/\/?[^\/]+/.exec(C)[0],
    i = document.head || document.getElementsByTagName("head"),
    L = (o.opera && Object.prototype.toString.call(o.opera) == "[object Opera]") || ("MozAppearance" in document.documentElement.style),
    q = document.createElement("script"),
    E = typeof q.preload == "boolean",
    r = E || (q.readyState && q.readyState == "uninitialized"),
    F = !r && q.async === true,
    M = !r && !F && !L;

  function G(a) {
    return Object.prototype.toString.call(a) == "[object Function]"
  }

  function H(a) {
    return Object.prototype.toString.call(a) == "[object Array]"
  }

  function N(a, c) {
    var b = /^\w+\:\/\//;
    if (/^\/\/\/?/.test(a)) {
      a = location.protocol + a
    } else if (!b.test(a) && a.charAt(0) != "/") {
      a = (c || "") + a
    }
    return b.test(a) ? a : ((a.charAt(0) == "/" ? D : C) + a)
  }

  function s(a, c) {
    for (var b in a) {
      if (a.hasOwnProperty(b)) {
        c[b] = a[b]
      }
    }
    return c
  }

  function O(a) {
    var c = false;
    for (var b = 0; b < a.scripts.length; b++) {
      if (a.scripts[b].ready && a.scripts[b].exec_trigger) {
        c = true;
        a.scripts[b].exec_trigger();
        a.scripts[b].exec_trigger = null
      }
    }
    return c
  }

  function t(a, c, b, d) {
    a.onload = a.onreadystatechange = function() {
      if ((a.readyState && a.readyState != "complete" && a.readyState != "loaded") || c[b]) return;
      a.onload = a.onreadystatechange = null;
      d()
    }
  }

  function I(a) {
    a.ready = a.finished = true;
    for (var c = 0; c < a.finished_listeners.length; c++) {
      a.finished_listeners[c]()
    }
    a.ready_listeners = [];
    a.finished_listeners = []
  }

  function P(d, f, e, g, h) {
    setTimeout(function() {
      var a, c = f.real_src,
        b;
      if ("item" in i) {
        if (!i[0]) {
          setTimeout(arguments.callee, 25);
          return
        }
        i = i[0]
      }
      a = document.createElement("script");
      if (f.type) a.type = f.type;
      if (f.charset) a.charset = f.charset;
      if (h) {
        if (r) {
          e.elem = a;
          if (E) {
            a.preload = true;
            a.onpreload = g
          } else {
            a.onreadystatechange = function() {
              if (a.readyState == "loaded") g()
            }
          }
          a.src = c
        } else if (h && c.indexOf(D) == 0 && d[y]) {
          b = new XMLHttpRequest();
          b.onreadystatechange = function() {
            if (b.readyState == 4) {
              b.onreadystatechange = function() {};
              e.text = b.responseText + "\n//@ sourceURL=" + c;
              g()
            }
          };
          b.open("GET", c);
          b.send()
        } else {
          a.type = "text/cache-script";
          t(a, e, "ready", function() {
            i.removeChild(a);
            g()
          });
          a.src = c;
          i.insertBefore(a, i.firstChild)
        }
      } else if (F) {
        a.async = false;
        t(a, e, "finished", g);
        a.src = c;
        i.insertBefore(a, i.firstChild)
      } else {
        t(a, e, "finished", g);
        a.src = c;
        i.insertBefore(a, i.firstChild)
      }
    }, 0)
  }

  function J() {
    var l = {},
      Q = r || M,
      n = [],
      p = {},
      m;
    l[y] = true;
    l[z] = false;
    l[u] = false;
    l[A] = false;
    l[B] = "";

    function R(a, c, b) {
      var d;

      function f() {
        if (d != null) {
          d = null;
          I(b)
        }
      }
      if (p[c.src].finished) return;
      if (!a[u]) p[c.src].finished = true;
      d = b.elem || document.createElement("script");
      if (c.type) d.type = c.type;
      if (c.charset) d.charset = c.charset;
      t(d, b, "finished", f);
      if (b.elem) {
        b.elem = null
      } else if (b.text) {
        d.onload = d.onreadystatechange = null;
        d.text = b.text
      } else {
        d.src = c.real_src
      }
      i.insertBefore(d, i.firstChild);
      if (b.text) {
        f()
      }
    }

    function S(c, b, d, f) {
      var e, g, h = function() {
          b.ready_cb(b, function() {
            R(c, b, e)
          })
        },
        j = function() {
          b.finished_cb(b, d)
        };
      b.src = N(b.src, c[B]);
      b.real_src = b.src + (c[A] ? ((/\?.*$/.test(b.src) ? "&_" : "?_") + ~~(Math.random() * 1E9) + "=") : "");
      if (!p[b.src]) p[b.src] = {
        items: [],
        finished: false
      };
      g = p[b.src].items;
      if (c[u] || g.length == 0) {
        e = g[g.length] = {
          ready: false,
          finished: false,
          ready_listeners: [h],
          finished_listeners: [j]
        };
        P(c, b, e, ((f) ? function() {
          e.ready = true;
          for (var a = 0; a < e.ready_listeners.length; a++) {
            e.ready_listeners[a]()
          }
          e.ready_listeners = []
        } : function() {
          I(e)
        }), f)
      } else {
        e = g[0];
        if (e.finished) {
          j()
        } else {
          e.finished_listeners.push(j)
        }
      }
    }

    function v() {
      var e, g = s(l, {}),
        h = [],
        j = 0,
        w = false,
        k;

      function T(a, c) {
        a.ready = true;
        a.exec_trigger = c;
        x()
      }

      function U(a, c) {
        a.ready = a.finished = true;
        a.exec_trigger = null;
        for (var b = 0; b < c.scripts.length; b++) {
          if (!c.scripts[b].finished) return
        }
        c.finished = true;
        x()
      }

      function x() {
        while (j < h.length) {
          if (G(h[j])) {
            try {
              h[j++]()
            } catch (err) {}
            continue
          } else if (!h[j].finished) {
            if (O(h[j])) continue;
            break
          }
          j++
        }
        if (j == h.length) {
          w = false;
          k = false
        }
      }

      function V() {
        if (!k || !k.scripts) {
          h.push(k = {
            scripts: [],
            finished: true
          })
        }
      }
      e = {
        script: function() {
          for (var f = 0; f < arguments.length; f++) {
            (function(a, c) {
              var b;
              if (!H(a)) {
                c = [a]
              }
              for (var d = 0; d < c.length; d++) {
                V();
                a = c[d];
                if (G(a)) a = a();
                if (!a) continue;
                if (H(a)) {
                  b = [].slice.call(a);
                  b.unshift(d, 1);
                  [].splice.apply(c, b);
                  d--;
                  continue
                }
                if (typeof a == "string") a = {
                  src: a
                };
                a = s(a, {
                  ready: false,
                  ready_cb: T,
                  finished: false,
                  finished_cb: U
                });
                k.finished = false;
                k.scripts.push(a);
                S(g, a, k, (Q && w));
                w = true;
                if (g[z]) e.wait()
              }
            })(arguments[f], arguments[f])
          }
          return e
        },
        wait: function() {
          if (arguments.length > 0) {
            for (var a = 0; a < arguments.length; a++) {
              h.push(arguments[a])
            }
            k = h[h.length - 1]
          } else k = false;
          x();
          return e
        }
      };
      return {
        script: e.script,
        wait: e.wait,
        setOptions: function(a) {
          s(a, g);
          return e
        }
      }
    }
    m = {
      setGlobalDefaults: function(a) {
        s(a, l);
        return m
      },
      setOptions: function() {
        return v().setOptions.apply(null, arguments)
      },
      script: function() {
        return v().script.apply(null, arguments)
      },
      wait: function() {
        return v().wait.apply(null, arguments)
      },
      queueScript: function() {
        n[n.length] = {
          type: "script",
          args: [].slice.call(arguments)
        };
        return m
      },
      queueWait: function() {
        n[n.length] = {
          type: "wait",
          args: [].slice.call(arguments)
        };
        return m
      },
      runQueue: function() {
        var a = m,
          c = n.length,
          b = c,
          d;
        for (; --b >= 0;) {
          d = n.shift();
          a = a[d.type].apply(null, d.args)
        }
        return a
      },
      noConflict: function() {
        o.$LAB = K;
        return m
      },
      sandbox: function() {
        return J()
      }
    };
    return m
  }
  o.$LAB = J();
  (function(a, c, b) {
    if (document.readyState == null && document[a]) {
      document.readyState = "loading";
      document[a](c, b = function() {
        document.removeEventListener(c, b, false);
        document.readyState = "complete"
      }, false)
    }
  })("addEventListener", "DOMContentLoaded")
})(this);
/*! RESOURCE: /scripts/ScriptLoader.js */
var ScriptLoader = {
  getScripts: function(scripts, callback) {
    if (!(scripts instanceof Array))
      scripts = [scripts];
    for (var i = 0; i < scripts.length; i++)
      $LAB.queueScript(scripts[i]);
    $LAB.queueWait(callback);
    $LAB.runQueue();
  }
};;
/*! RESOURCE: /scripts/consts/GlideEvent.js */
var GlideEvent = {
  WINDOW_CLICKED: 'glide:window_clicked',
  WINDOW_BLURRED: 'glide:window_blurred',
  WINDOW_FOCUSED: 'glide:window_focused',
  IMAGE_PICKED: 'glide:image_picked',
  NAV_MANAGER_LOADED: 'glide:nav_manager_loaded',
  NAV_FORM_DIRTY_CANCEL_STAY: 'glide:nav_form_dirty_cancel_stay',
  NAV_SYNC_LIST_WITH_FORM: 'glide:nav_sync_list_with_form',
  NAV_LOAD_FORM_FROM_LIST: 'glide:nav_load_form_from_list',
  NAV_SAVE_PREFERENCES: 'glide:nav_save_preferences',
  NAV_UPDATE_EDGE_BUTTON_STATES: 'glide:nav_update_edge_button_states',
  NAV_OPEN_URL: 'glide:nav_open_url',
  NAV_ADD_BOOKMARK: 'glide:nav_add_bookmark',
  NAV_REMOVE_BOOKMARK: 'glide:nav_remove_bookmark',
  NAV_UPDATE_BOOKMARK: 'glide:nav_update_bookmark',
  NAV_DRAGGING_BOOKMARK_START: 'glide:nav_dragging_bookmark_start',
  NAV_DRAGGING_BOOKMARK_STOP: 'glide:nav_dragging_bookmark_stop',
  NAV_HIDE_ALL_TOOLTIPS: 'glide:nav_hide_all_tooltips',
  NAV_QUEUE_BOOKMARK_OPEN_FLYOUT: 'glide:nav_queue_bookmark_open_flyout',
  NAV_OPEN_BOOKMARK: 'glide:nav_open_bookmark',
  NAV_BOOKMARK_ADDED: 'glide:nav_bookmark_added',
  NAV_BOOKMARK_REMOVED: 'glide:nav_bookmark_removed',
  NAV_EAST_PANE_RESIZED: 'glide:nav_east_pane_resized',
  NAV_ADD_FLYOUT: 'glide:nav_add_flyout',
  NAV_REMOVE_FLYOUT: 'glide:nav_remove_flyout',
  NAV_TOGGLE_FLYOUT: 'glide:nav_toggle_flyout',
  NAV_HIDE_FLYOUTS: 'glide:nav_hide_flyouts',
  NAV_PANE_CLICKED: 'glide:nav_window_clicked'
};;
/*! RESOURCE: /scripts/functions/textutil.js */
function htmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/</g, "&#60;").replace(/>/g, "&#62;");
}

function htmlEscapeQuote(s) {
  return s.replace(/'/g, "&#39;");
}

function htmlEscapeDoubleQuote(s) {
  return s.replace(/"/g, "&quot;");
}

function loadXML(r) {
  var xml = r.responseXML;
  if (typeof xml != 'undefined')
    return xml;
  var dom = null;
  if (window.DOMParser) {
    try {
      dom = (new DOMParser()).parseFromString(r, 'text/xml');
    } catch (e) {
      dom = null;
    }
  } else if (window.ActiveXObject) {
    try {
      dom = new ActiveXObject('Microsoft.XMLDOM');
      dom.async = false;
      if (!dom.loadXML(r))
        jslog('ERROR: ' + dom.parseError.reason + dom.parseError.srcText);
    } catch (e) {
      dom = null;
    }
  } else
    jslog('ERROR: Cannot parse xml string - "' + r + '".');
  return dom;
};
/*! RESOURCE: /scripts/doctype/functions_bootstrap14.js */
var userAgentLowerCase = navigator.userAgent.toLowerCase();
var isMSIE = userAgentLowerCase.indexOf("msie") >= 0;
var ie5 = false;
var isMSIE6 = false
var isMSIE7 = false;
var isMSIE8 = false;
var isMSIE9 = userAgentLowerCase.indexOf("msie 9") >= 0;
var isMSIE10 = userAgentLowerCase.indexOf("msie 10") >= 0;
var isMSIE11 = userAgentLowerCase.indexOf("rv:11.0") > 0;
var isChrome = userAgentLowerCase.indexOf("chrome") >= 0;
var isFirefox = userAgentLowerCase.indexOf("firefox") >= 0;
var isSafari = !isChrome && (userAgentLowerCase.indexOf("safari") >= 0);
var isSafari5 = false;
if (isSafari) {
  try {
    var reSafariVersion = new RegExp("version/([\\d\\.]{3,5}) safari/");
    var results = reSafariVersion.exec(userAgentLowerCase);
    if (results.length > 0) {
      var reMajor = new RegExp("([\\d]).");
      var results = reMajor.exec(results[1]);
      if (results.length > 0) {
        var mv = parseInt(results[1]);
        isSafari5 = mv < 6;
      }
    }
  } catch (e) {}
}
var isMacintosh = userAgentLowerCase.indexOf("macintosh") >= 0;
var isWebKit = navigator.userAgent.indexOf("WebKit") >= 0;
var isTouchDevice = navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1;
var GJSV = 1.0;
(function() {
  var defined = {};
  var waiting = {};

  function listen(id, then) {
    if (typeof id !== 'string')
      listenMany(id, then);
    if (defined[id]) {
      return then(defined[id]);
    }
    if (!waiting[id]) {
      waiting[id] = [];
    }
    waiting[id].push(then);
  }

  function emit(id, data) {
    defined[id] = data;
    var listeners = waiting[id];
    if (!listeners) {
      return;
    }
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i](data);
    }
    waiting[id] = [];
  }

  function listenMany(dependencies, then) {
    if (typeof dependencies.length === 'undefined') {
      return;
    }
    var unDef = {
      isUndefined: true
    };
    var resolved = [];

    function resolve(dep, i) {
      resolved[i] = dep;
      for (var i = 0, l = resolved.length; i < l; i++) {
        if (resolved[i] === unDef)
          return;
      }
      then.apply(undefined, resolved);
    };
    dependencies.forEach(function(depId, idx) {
      resolved[idx] = unDef;
      listen(depId, function(dep) {
        resolve(dep, idx);
      });
    });
  }
  window.CachedEvent = {
    after: listen,
    emit: emit
  };
})();
var g_afterPageLoadedFunctions = [];
window.g_render_functions = window.g_render_functions || [];
window.g_load_functions = window.g_load_functions || [];
window.g_late_load_functions = window.g_late_load_functions || [];

function runBeforeRender() {
  _runInlineScripts();
  jslog("runBeforeRender");
  for (var i = 0; i != g_render_functions.length; i++) {
    var f = g_render_functions[i];
    f.call();
  }
}

function _runInlineScripts() {
  var inlineScripts = $j('script[type="application/javascript-deferred"]');
  jslog("running inline scripts, count: " + inlineScripts.length);
  inlineScripts.each(function(index, item) {
    var script = $j(item).text();
    try {
      $j.globalEval(script);
    } catch (e) {
      jslog("error in script " + script);
    }
  });
}
window.g_hasRunAfterAllLoaded = false;

function runAfterAllLoaded() {
  if (g_hasRunAfterAllLoaded) {
    jslog("Redundant call to runAfterAllLoaded");
    return;
  }
  g_hasRunAfterAllLoaded = true;
  var sw = new StopWatch();
  jslog("runAfterAllLoaded, functions: " + g_load_functions.length);
  for (var i = 0; i != g_load_functions.length; i++) {
    var f = g_load_functions[i];
    var t = new Date().getTime();
    f.call();
    t = new Date().getTime() - t;
    if (t > 5000)
      jslog("Time: " + t + " for: [" + i + "] " + f);
  }
  jslog("late load functions: " + g_late_load_functions.length);
  for (var i = 0; i != g_late_load_functions.length; i++) {
    var f = g_late_load_functions[i];
    f.call();
  }
  window.self.loaded = true;
  sw.jslog("runAfterAllLoaded finished");
}

function addLoadEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_load_functions.push(func);
}

function addLateLoadEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_late_load_functions.push(func);
}

function pageLoaded() {
  CustomEvent.observe("body_clicked", contextMenuHide);
  setMandatoryExplained.defer();
}

function addRenderEvent(func) {
  if (isRenderEventRegistered(func))
    return;
  addRenderEventToArray(func);
}

function addRenderEventToArray(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_render_functions.push(func);
}

function isRenderEventRegistered(func) {
  var s = func.toString();
  for (var i = 0; i < g_render_functions.length; i++)
    if (g_render_functions[i].toString() == s)
      return true;
  return false;
}

function addRenderEventLogged(func, name, funcname) {
  addRenderEventToArray(function() {
    CustomEvent.fire('glide_optics_inspect_put_cs_context', funcname, 'load');
    var sw = new StopWatch();
    var __rtmr = new Date();
    try {
      func();
    } catch (e) {
      jslog('***************************************************');
      jslog('A script has encountered an error in render events');
      jslog(e);
      jslog('Script ends. Continuing happily');
      jslog('***************************************************');
    }
    CustomEvent.fire('page_timing', {
      name: 'CSOL',
      child: {
        description: name.substr(7),
        sys_id: g_event_handler_ids[funcname],
        source_table: 'sys_script_client'
      },
      startTime: __rtmr,
      win: window
    });
    sw.jslog(name);
    CustomEvent.fire('glide_optics_inspect_pop_cs_context', funcname, 'load');
  });
}

function addTopRenderEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_render_functions.unshift(func);
}

function addAfterPageLoadedEvent(func) {
  if (window.self.loaded) {
    setTimeout(func, 0);
    return;
  }
  g_afterPageLoadedFunctions.push(func);
}

function runAfterPageLoadedEvents() {
  jslog("after page loaded starting");
  var sw = new StopWatch();
  for (var i = 0; i != g_afterPageLoadedFunctions.length; i++) {
    var f = g_afterPageLoadedFunctions[i];
    f.call();
  }
  sw.jslog("after page loaded complete, functions called: " + g_afterPageLoadedFunctions.length);
  g_afterPageLoadedFunctions = [];
}
addLateLoadEvent(function() {
  setTimeout(runAfterPageLoadedEvents, 30);
});

function addUnloadEvent(func) {
  Event.observe(window, 'unload', func, false);
}

function addTinymceLoadEvent(id, func) {
  CachedEvent.after('tinyeditor_init.' + id, func);
}

function fireTinymceLoadEvent(id, ed) {
  CachedEvent.emit('tinyeditor_init.' + id, ed);
}

function gel(id) {
  if (typeof id != 'string')
    return id;
  return document.getElementById(id);
}

function cel(name, parent) {
  var e = document.createElement(name);
  if (arguments.length > 1)
    parent.appendChild(e);
  return e;
}

function rel(id) {
  var e = gel(id);
  if (e)
    e.parentNode.removeChild(e);
}

function addChild(element) {
  getFormContentParent().appendChild(element);
}

function inner(id, data) {
  var el = gel(id);
  if (el != null)
    el.innerHTML = data;
}

function clearNodes(t) {
  if (!t)
    return;
  while (t.hasChildNodes())
    t.removeChild(t.childNodes[0]);
}

function getTopWindow() {
  var topWindow = window.self;
  try {
    while (topWindow.GJSV && topWindow != topWindow.parent && topWindow.parent.GJSV) {
      topWindow = topWindow.parent;
    }
  } catch (e) {}
  return topWindow;
}

function inFrame() {
  return getTopWindow() != window.self;
}

function getMainWindow() {
  var topWindow = getTopWindow();
  return topWindow['gsft_main'];
}

function getMainFormWindow() {
  var topWindow = getTopWindow();
  return topWindow['gsft_main_form'];
}

function getNavWindow() {
  var topWindow = getTopWindow();
  return topWindow['gsft_nav'];
}

function reloadWindow(win) {
  var href = win.location.href;
  var len = href.length;
  if (win.frames['iframe_live_feed'] && href.endsWith('#') && len > 2)
    href = href.substring(0, len - 2)
  href = addDomainParameters(href);
  win.location.href = href;
}

function addDomainParameters(href) {
  var url = new GlideURL(href);
  if (url.getParam('sysparm_domain') == 'picker') {
    url.deleteParam('sysparm_domain');
  } else {
    var domainElement = gel('sysparm_domain');
    if (domainElement) {
      if (domainElement.value != 'picker') {
        url.addParam('sysparm_domain', domainElement.value);
        var domainScope = gel('sysparm_domain_scope');
        if (domainScope) {
          url.addParam('sysparm_domain_scope', domainScope.value);
        }
      }
    }
  }
  url.addParam('sysparm_nostack', 'true');
  url.setEncode(false);
  return url.getURL();
}

function addOnSubmitEvent(form, func, funcname) {
  if (!form)
    return;
  var oldonsubmit = form.onsubmit;
  if (typeof form.onsubmit != 'function')
    form.onsubmit = func;
  else {
    form.onsubmit = function() {
      var formFuncCalled = false;
      try {
        if (oldonsubmit() == false)
          return false;
        CustomEvent.fire('glide_optics_inspect_put_cs_context', funcname, 'submit');
        formFuncCalled = true;
        var returnvalue = func();
        formFuncCalled = false;
        CustomEvent.fire('glide_optics_inspect_pop_cs_context', funcname, 'submit');
        if (returnvalue == false)
          return false;
        return true;
      } catch (ex) {
        if (formFuncCalled)
          CustomEvent.fire('glide_optics_inspect_pop_cs_context', funcname, 'load');
        formFuncError("onSubmit", func, ex);
        return false;
      }
    }
  }
  form = null;
}

function formFuncError(type, func, ex) {
  var funcStr = func.toString();
  funcStr = funcStr.replace(/onSubmit[a-fA-F0-9]{32}\(/, "onSubmit(");
  var msg;
  if (g_user.hasRole("client_script_admin"))
    msg = type + " script error: " + ex.toString() + ":<br/>" + funcStr.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
  else
    msg = "Submit canceled due to a script error - please contact your System Administrator";
  g_form.addErrorMessage(msg);
  CustomEvent.fire('glideform:script_error', type + " script error: " + ex.toString() + "\n" + funcStr);
}

function hide(element) {
  var e = typeof element === "string" ? gel(element) : element;
  if (!e)
    return;
  e.style.display = 'none';
  _frameChanged();
}

function show(element) {
  var e = typeof element === "string" ? gel(element) : element;
  if (!e)
    return;
  if (e.tagName == "TR")
    e.style.display = 'table-row';
  else
    e.style.display = 'block';
  _frameChanged();
}

function hideObject(o, visibilityOnly) {
  if (!o)
    return;
  o.style.visibility = "hidden";
  if (!visibilityOnly)
    o.style.display = "none";
  _frameChanged();
}

function showObject(o, visibilityOnly) {
  if (!o)
    return;
  o.style.visibility = "visible";
  if (!visibilityOnly)
    o.style.display = "block";
  _frameChanged();
}

function showObjectInline(o) {
  if (!o)
    return;
  o.style.visibility = "visible";
  o.style.display = "inline";
  _frameChanged();
}

function showObjectInlineBlock(o) {
  if (!o)
    return;
  o.style.visibility = "visible";
  o.style.display = "inline-block";
  _frameChanged();
}

function focusFirstElement(form) {
  try {
    var e = findFirstEditableElement(form);
    if (e) {
      Field.activate(e);
      triggerEvent(e, 'focus', true);
    }
  } catch (ex) {}
}

function findFirstEditableElement(form) {
  var tags = ['input', 'select', 'textarea'];
  var elements = form.getElementsByTagName('*');
  for (var i = 0, n = elements.length; i < n; i++) {
    var element = elements[i];
    if (element.type == 'hidden')
      continue;
    var tagName = element.tagName.toLowerCase();
    if (!tags.include(tagName))
      continue;
    element = $(element);
    var formGroup = element.up('.form-group');
    if (!element.disabled &&
      (window.g_accessibility ? true : !element.readOnly) &&
      element.style.visibility != 'hidden' &&
      element.style.display != 'none' &&
      element.offsetParent != null &&
      formGroup &&
      formGroup.style.display != 'none')
      return element;
  }
  return null;
}

function triggerEvent(element, eventType, canBubble, memo) {
  canBubble = (typeof(canBubble) == undefined) ? true : canBubble;
  if (element && element.disabled && eventType == "change" && element.onchange) {
    element.onchange.call(element);
    return;
  }
  if (element.fireEvent) {
    element.fireEvent('on' + eventType);
  } else {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventType, canBubble, true);
    evt.memo = memo;
    element.dispatchEvent(evt, true);
  }
}
var g_form_dirty_message;

function onWindowClose() {
  if (typeof g_form == 'undefined')
    return;
  if (!g_form.submitted && g_form.modified) {
    g_submitted = false;
    setTimeout(function() {
      CustomEvent.fireTop('glide:nav_form_dirty_cancel_stay', window);
    }, 750);
    return g_form_dirty_message;
  }
  g_form.submitted = false;
}

function jslog(msg, src, dateTime) {
  try {
    if (!src) {
      var path = window.self.location.pathname;
      src = path.substring(path.lastIndexOf('/') + 1);
    }
    if (window.self.opener && window != window.self.opener) {
      if (window.self.opener.jslog) {
        window.self.opener.jslog(msg, src, dateTime);
      }
    } else if (parent && parent.jslog && jslog != parent.jslog) {
      parent.jslog(msg, src, dateTime);
    } else if (parent.parent && parent.parent.jslog && jslog != parent.parent.jslog) {
      parent.parent.jslog(msg, src, dateTime);
    } else {
      if (window.console && window.console.log)
        console.log(msg);
    }
  } catch (e) {}
}

function getXMLIsland(name) {
  var xml = gel(name);
  if (xml == null)
    return null;
  xml = "<xml>" + xml.innerHTML + "</xml>";
  xml = loadXML(xml);
  return xml;
}

function lock(me, ref, edit_id, nonedit_id, current_value_id, update_id) {
  if (me)
    me.style.display = "none";
  var unlock = gel(ref + '_unlock');
  unlock.style.display = "";
  var edit_span = gel(edit_id);
  edit_span.style.display = "none";
  var nonedit_span = gel(nonedit_id);
  nonedit_span.style.display = "inline-block";
  var current_value = gel(current_value_id);
  var the_value = "";
  if (current_value.options) {
    for (var i = 0; i < current_value.options.length; i++) {
      if (i > 0)
        the_value += g_glide_list_separator;
      the_value += current_value.options[i].text;
    }
  } else
    the_value = current_value.value;
  var update_element = gel(update_id);
  if (update_element.href)
    update_element.href = the_value;
  update_element.innerHTML = htmlEscape(the_value);
}

function unlock(me, ref, edit_id, nonedit_id) {
  if (me)
    me.style.display = "none";
  var unlock = gel(ref + '_lock');
  if (unlock)
    showObjectInlineBlock(unlock);
  var edit_span = gel(edit_id);
  edit_span.style.display = "";
  var nonedit_span = gel(nonedit_id);
  nonedit_span.style.display = "none";
  var list_foc = gel("sys_display." + ref);
  if (list_foc) {
    try {
      list_foc.focus();
    } catch (e) {}
  }
}

function setMandatoryExplained(enforce) {
  var showexp = gel('mandatory_explained');
  if (!showexp)
    return;
  if (enforce || foundAMandatoryField())
    showexp.style.display = "inline";
  else
    showexp.style.display = "none";
}

function foundAMandatoryField() {
  var spanTags = document.getElementsByTagName('span');
  if (!spanTags)
    return false;
  for (var c = 0, n = spanTags.length; c != n; ++c) {
    var spanTag = spanTags[c];
    var id = spanTag.id;
    if (!id)
      continue;
    if (id.indexOf('status.') == 0) {
      var mandatory = spanTag.getAttribute("mandatory") + "";
      if (mandatory == 'true')
        return true;
    }
  }
  return false;
}
var _frameChangedTimer = null;

function _frameChanged() {
  if (_frameChangedTimer)
    clearTimeout(_frameChangedTimer);
  _frameChangedTimer = setTimeout(function() {
    _frameChangedTimer = null;
    CustomEvent.fire('frame.resized');
    CustomEvent.fire('refresh.event');
  }, 300);
}

function getFormContentParent() {
  var glideOverlay = $(document.body).select("div.glide_overlay");
  var exposeMask = $('glide_expose_mask');
  if (glideOverlay.length > 0 && exposeMask && exposeMask.visible())
    return glideOverlay[0];
  if (typeof g_section_contents == 'undefined' || !g_section_contents)
    g_section_contents = $(document.body).select(".section_header_content_no_scroll");
  if (g_section_contents.length > 0)
    return g_section_contents[0];
  return document.body;
}

function addClassName(element, name) {
  if (!element)
    return;
  $(element).addClassName(name);
}

function removeClassName(element, name) {
  if (!element)
    return;
  $(element).removeClassName(name);
}

function hasClassName(element, name) {
  if (!element)
    return;
  if (!element.hasClassName)
    return;
  return $(element).hasClassName(name);
}

function getIFrameDocument(iframe) {
  return iframe.contentWindow ? iframe.contentWindow.document : (iframe.contentDocument || null);
}

function writeTitle(element, title) {
  element.title = title;
  if (element.alt)
    element.alt = title;
  if (element.getAttribute('disabled') == 'disabled')
    element.style.pointerEvents = 'auto';
}

function contextMenuHide(e) {
  if (typeof contextHide === 'undefined')
    return;
  if (!isMSIE && e) {
    if (isTouchDevice && !isTouchRightClick(e)) {
      if (e.type == 'touchend' && $(e.target).up('.context_menu'))
        return;
      contextHide();
    } else if (isLeftClick(e)) {
      contextHide();
    }
  } else
    contextHide();
}

function trim(s) {
  return s.replace(/^\s+|\s+$/g, '');
}

function htmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/"/g,
    "&quot;").replace(/</g, "&#60;").replace(/>/g, "&#62;");
}

function htmlEscapeQuote(s) {
  return s.replace(/'/g, "&#39;");
}

function htmlEscapeDoubleQuote(s) {
  return s.replace(/"/g, "&quot;");
}

function loadXML(r) {
  var xml = r.responseXML;
  if (typeof xml != 'undefined')
    return xml;
  var dom = null;
  try {
    dom = new DOMParser().parseFromString(r, 'text/xml');
  } catch (e) {}
  return dom;
}
if (!window.GwtDateTimePicker) {
  window.GwtDateTimePicker = function(name, format, showTime) {
    ScriptLoader.getScripts('scripts/classes/GwtDateTimePicker.js', function() {
      new GwtDateTimePicker(name, format, showTime);
    });
  }
};
/*! RESOURCE: /scripts/functions/xmlhttp.js */
var isMicrosoftXMLHTTP = false;
var XML_HTTP = "xmlhttp.do";

function AJAXEvaluateSynchronously(expression) {
  var ajax = new GlideAjax("AJAXEvaluator");
  ajax.addParam("sysparm_expression", expression);
  ajax.getXMLWait();
  return ajax.getAnswer();
}

function AJAXEvaluate(expression, callbackAndArgs) {
  var ajax = new GlideAjax("AJAXEvaluator");
  ajax.addParam("sysparm_expression", expression);
  ajax.getXML(AJAXEvaluateResponse, "", callbackAndArgs);
}

function AJAXEvaluateResponse(response, callbackAndArgs) {
  var xml = response.responseXML;
  var answer = xml.documentElement.getAttribute("answer");
  if (callbackAndArgs != null) {
    var callback = callbackAndArgs;
    var args = new Array();
    if (typeof callbackAndArgs != "function" && callbackAndArgs.length > 1) {
      callback = callbackAndArgs.splice(0, 1)[0];
      args = callbackAndArgs;
    }
    callback.call(answer, answer, response, args);
  }
}

function AJAXFunction(func, args, callback, callbackArgs) {
  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] == "function")
      continue;
    args[i] = args[i].replace(/"/g, "\\\"");
  }
  var expression = func + '("' + args.join('","') + '");';
  var newArgs = new Array();
  newArgs.push(callback);
  newArgs = newArgs.concat(callbackArgs);
  AJAXEvaluate(expression, newArgs);
}

function serverRequest(url, loadedFunction, args) {
  ajaxRequest(url, null, true, loadedFunction, args);
}

function serverRequestWait(url, postString) {
  var req = ajaxRequest(url, postString, false);
  if (req.status == 200)
    return req;
}

function serverRequestPost(url, postString, loadedFunction, args) {
  ajaxRequest(url, postString, true, loadedFunction, args);
}

function ajaxRequest(url, postString, async, responseFunction, responseFunctionArgs) {
  var req = getRequest();
  showLoading();
  if (req) {
    if (async &&(responseFunction != null))
      req.onreadystatechange = function() {
        processReqChange(req, responseFunction, responseFunctionArgs);
      };
    req.open((postString ? "POST" : "GET"), url, async);
    if (typeof g_ck != 'undefined' && g_ck != "")
      req.setRequestHeader('X-UserToken', g_ck);
    if (postString) {
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      req.send(postString);
    } else {
      if (isMicrosoftXMLHTTP)
        req.send();
      else
        req.send(null);
    }
  }
  if (!async)
    hideLoading();
  return req;
}

function getRequest() {
  var req = null;
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    isMicrosoftXMLHTTP = true;
    req = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return req;
}

function processReqChange(r, docLoadedFunction, docLoadedFunctionArgs) {
  if (r.readyState == 4) {
    hideLoading();
    if (r.status == 200) {
      lastActivity = new Date();
      docLoadedFunction(r, docLoadedFunctionArgs);
    } else {
      try {
        window.status = "There was a problem retrieving the XML data: " + r.statusText;
      } catch (e) {}
    }
  }
}

function showLoading() {
  try {
    CustomEvent.fireAll("ajax.loading.start");
  } catch (e) {}
}

function hideLoading() {
  try {
    CustomEvent.fireAll("ajax.loading.end");
  } catch (e) {}
};
/*! RESOURCE: /scripts/classes/event/GwtObservable.js */
var GwtObservable = Class.create({
  initialize: function() {
    this.events = {};
  },
  on: function(name, func) {
    if (!func || typeof func != 'function')
      return;
    this.events = this.events || {};
    if (!this.events[name])
      this.events[name] = [];
    this.events[name].push(func);
  },
  forward: function(name, element, func) {
    GwtObservable.prototype.on.call(this, name, func);
    Event.observe(element, name, function(e) {
      this.fireEvent(e.type, this, e);
    }.bind(this));
  },
  un: function(name, func) {
    if (!this.events[name])
      return;
    var i = this.events[name].indexOf(func);
    if (i !== -1)
      this.events[name].splice(i, 1);
  },
  unAll: function(name) {
    if (this.events[name])
      delete this.events[name];
  },
  isFiring: function() {
    return this._isFiring;
  },
  fireEvent: function() {
    if (this.suppressEvents === true)
      return true;
    this.events = this.events || {};
    var args = $A(arguments);
    var name = args.shift();
    var eventList = this.events[name];
    if (!eventList)
      return true;
    var event = eventList.slice();
    this._isFiring = true;
    for (var i = 0, l = event.length; i < l; i++) {
      var ev = event[i];
      if (ev == null)
        continue;
      if (ev.apply(this, args) === false) {
        this._isFiring = false;
        return false;
      }
    }
    this._isFiring = false;
    return true;
  },
  toString: function() {
    return 'GwtObservable';
  }
});;
/*! RESOURCE: /scripts/doctype/CustomEventManager.js */
var NOW = NOW || {};
var CustomEventManager = (function(existingCustomEvent) {
  "use strict";
  var events = (existingCustomEvent && existingCustomEvent.events) || {};
  var isFiringFlag = false;
  var trace = false;
  var suppressEvents = false;
  var NOW_MSG = 'NOW.PostMessage';

  function observe(eventName, fn) {
    if (trace)
      jslog("$CustomEventManager observing: " + eventName);
    on(eventName, fn);
  }

  function on(name, func) {
    if (!func || typeof func !== 'function')
      return;
    if (typeof name === 'undefined')
      return;
    if (!events[name])
      events[name] = [];
    events[name].push(func);
  }

  function un(name, func) {
    if (!events[name])
      return;
    var idx = -1;
    for (var i = 0; i < events[name].length; i++) {
      if (events[name][i] === func) {
        idx = i;
        break;
      }
    }
    if (idx >= 0)
      events[name].splice(idx, 1)
  }

  function unAll(name) {
    if (events[name])
      delete events[name];
  }

  function fire(eventName, args) {
    if (trace)
      jslog("$CustomEventManager firing: " + eventName + " args: " + arguments.length);
    return fireEvent.apply(null, arguments);
  }

  function fireUp(eventName, args) {
    var win = window;
    while (win) {
      try {
        if (win.CustomEvent.fireEvent.apply(null, arguments) === false)
          return;
        win = win.parent === win ? null : win.parent;
      } catch (e) {
        return;
      }
    }
  }

  function fireEvent() {
    if (suppressEvents)
      return true;
    var args = Array.prototype.slice.apply(arguments);
    var name = args.shift();
    var eventList = events[name];
    if (!eventList)
      return true;
    var event = eventList.slice();
    isFiringFlag = true;
    for (var i = 0, l = event.length; i < l; i++) {
      var ev = event[i];
      if (!ev)
        continue;
      if (ev.apply(null, args) === false) {
        isFiringFlag = false;
        return false;
      }
    }
    isFiringFlag = false;
    return true;
  }

  function isFiring() {
    return isFiringFlag;
  }

  function forward(name, element, func) {
    on(name, func);
    element.addEventListener(name, function(e) {
      fireEvent(e.type, this, e);
    }.bind(api));
  }

  function registerPostMessageEvent() {
    if (NOW.registeredPostMessageEvent) {
      return;
    }
    if (!window.postMessage) {
      return;
    }
    window.addEventListener('message', function(event) {
      var nowMessageJSON = event.data;
      var nowMessage;
      try {
        nowMessage = JSON.parse(nowMessageJSON.toString());
      } catch (e) {
        return;
      }
      if (!nowMessage.type == NOW_MSG) {
        return;
      }
      fire(nowMessage.eventName, nowMessage.args);
    }, false);
    NOW.registeredPostMessageEvent = true;
  }

  function doPostMessage(win, event, msg, targetOrigin) {
    var nowMessage = {
      type: NOW_MSG,
      eventName: event,
      args: msg
    };
    var nowMessageJSON;
    if (!win || !win.postMessage) {
      return
    }
    nowMessageJSON = JSON.stringify(nowMessage);
    win.postMessage(nowMessageJSON, targetOrigin);
  }

  function fireTop(eventName, args) {
    if (trace)
      jslog("$CustomEventManager firing: " + eventName + " args: " + arguments.length);
    fireEvent.apply(null, arguments);
    var t = getTopWindow();
    if (t !== null && window !== t)
      t.CustomEvent.fire(eventName, args);
  }

  function fireAll(eventName, args) {
    if (trace)
      jslog("$CustomEventManager firing: " + eventName + " args: " + arguments.length);
    var topWindow = getTopWindow();
    notifyAllFrom(topWindow);

    function notifyAllFrom(rootFrame) {
      var childFrame;
      rootFrame.CustomEvent.fireEvent(eventName, args);
      for (var i = 0; i < rootFrame.length; i++) {
        try {
          childFrame = rootFrame[i];
          if (!childFrame)
            continue;
          if (childFrame.CustomEvent && typeof childFrame.CustomEvent.fireEvent === "function") {
            notifyAllFrom(childFrame);
          }
        } catch (e) {}
      }
    }
  }

  function fireToWindow(targetWindow, eventName, args, usePostMessage, targetOrigin) {
    if (trace)
      jslog("$CustomEventManager firing: " + eventName + " args: " + args.length);
    if (usePostMessage) {
      doPostMessage(targetWindow, eventName, args, targetOrigin);
    } else {
      targetWindow.CustomEvent.fireEvent(eventName, args);
    }
  }

  function getTopWindow() {
    var topWindow = window.self;
    try {
      while (topWindow.CustomEvent.fireEvent && topWindow !== topWindow.parent && topWindow.parent.CustomEvent.fireEvent) {
        topWindow = topWindow.parent;
      }
    } catch (e) {}
    return topWindow;
  }

  function isTopWindow() {
    return getTopWindow() == window.self;
  }

  function jslog(msg, src, dateTime) {
    try {
      if (!src) {
        var path = window.self.location.pathname;
        src = path.substring(path.lastIndexOf('/') + 1);
      }
      if (window.self.opener && window != window.self.opener) {
        if (window.self.opener.jslog) {
          window.self.opener.jslog(msg, src, dateTime);
        }
      } else if (parent && parent.jslog && jslog != parent.jslog) {
        parent.jslog(msg, src, dateTime);
      } else {
        if (window.console && window.console.log)
          console.log(msg);
      }
    } catch (e) {}
  }
  var api = {
    set trace(value) {
      trace = !!value;
    },
    get trace() {
      return trace;
    },
    set suppressEvents(value) {
      suppressEvents = !!value;
    },
    get suppressEvents() {
      return suppressEvents;
    },
    get events() {
      return events;
    },
    on: on,
    un: un,
    unAll: unAll,
    forward: forward,
    isFiring: isFiring,
    fireEvent: fireEvent,
    observe: observe,
    fire: fire,
    fireTop: fireTop,
    fireAll: fireAll,
    fireToWindow: fireToWindow,
    isTopWindow: isTopWindow,
    fireUp: fireUp,
    toString: function() {
      return 'CustomEventManager';
    }
  };
  registerPostMessageEvent();
  return api;
})(NOW.CustomEvent);
NOW.CustomEvent = CustomEventManager;
if (typeof CustomEvent !== "undefined") {
  CustomEvent.observe = NOW.CustomEvent.observe.bind(NOW.CustomEvent);
  CustomEvent.fire = NOW.CustomEvent.fire.bind(NOW.CustomEvent);
  CustomEvent.fireUp = NOW.CustomEvent.fireUp.bind(NOW.CustomEvent);
  CustomEvent.fireTop = NOW.CustomEvent.fireTop.bind(NOW.CustomEvent);
  CustomEvent.fireAll = NOW.CustomEvent.fireAll.bind(NOW.CustomEvent);
  CustomEvent.fireToWindow = NOW.CustomEvent.fireToWindow.bind(NOW.CustomEvent);
  CustomEvent.on = NOW.CustomEvent.on.bind(NOW.CustomEvent);
  CustomEvent.un = NOW.CustomEvent.un.bind(NOW.CustomEvent);
  CustomEvent.unAll = NOW.CustomEvent.unAll.bind(NOW.CustomEvent);
  CustomEvent.forward = NOW.CustomEvent.forward.bind(NOW.CustomEvent);
  CustomEvent.isFiring = NOW.CustomEvent.isFiring.bind(NOW.CustomEvent);
  CustomEvent.fireEvent = NOW.CustomEvent.fireEvent.bind(NOW.CustomEvent);
  CustomEvent.events = NOW.CustomEvent.events;
  CustomEvent.isTopWindow = NOW.CustomEvent.isTopWindow.bind(NOW.CustomEvent);
} else {
  window.CustomEvent = NOW.CustomEvent;
};
/*! RESOURCE: /scripts/classes/ui/Point.js */
var Point = Class.create();
Point.prototype = {
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },
  getX: function() {
    return this.x;
  },
  getY: function() {
    return this.y;
  }
};
/*! RESOURCE: /scripts/classes/util/CookieJar.js */
var CookieJar = Class.create({
  appendString: "__CJ_",
  initialize: function(options) {
    this.options = {
      expires: 3600,
      path: '',
      domain: '',
      secure: ''
    };
    Object.extend(this.options, options || {});
    if (this.options.expires != '') {
      var date = new Date();
      date = new Date(date.getTime() + (this.options.expires * 1000));
      this.options.expires = '; expires=' + date.toGMTString();
    }
    if (this.options.path != '') {
      this.options.path = '; path=' + escape(this.options.path);
    }
    if (this.options.domain != '') {
      this.options.domain = '; domain=' + escape(this.options.domain);
    }
    if (this.options.secure == 'secure') {
      this.options.secure = '; secure';
    } else {
      this.options.secure = '';
    }
  },
  put: function(name, value) {
    name = this.appendString + name;
    cookie = this.options;
    var type = typeof value;
    switch (type) {
      case 'undefined':
      case 'function':
      case 'unknown':
        return false;
      case 'boolean':
      case 'string':
      case 'number':
        value = String(value.toString());
    }
    var cookie_str = name + "=" + escape(Object.toJSON(value));
    try {
      document.cookie = cookie_str + cookie.expires + cookie.path + cookie.domain + cookie.secure;
    } catch (e) {
      return false;
    }
    return true;
  },
  get: function(name) {
    name = this.appendString + name;
    var cookies = document.cookie.match(name + '=(.*?)(;|$)');
    if (cookies) {
      return (unescape(cookies[1])).evalJSON();
    } else {
      return null;
    }
  }
});;
/*! RESOURCE: /scripts/list_filter.js */
var runFilterHandlers = {}

function setImage(element, src) {
  element = $(element);
  if (!element)
    return;
  element.src = src;
}

function swapImage(imgId, newSrc) {
  return function() {
    setImage(imgId, newSrc);
  };
}

function setDisplay(element, display) {
  var i = $(element);
  i.style.display = display;
}

function runFilter(name) {
  if (queueFilters[name]) {
    columnsGet(name, runFilterCallBack);
    return;
  }
  runFilter0(name);
}

function runFilterCallBack() {
  queueFilters[mainFilterTable] = null;
  runFilter0(mainFilterTable);
}

function runFilter0(name) {
  var filter = getFilter(name);
  if (name.endsWith('.'))
    name = name.substring(0, name.length - 1);
  if (!runFilterHandlers[name])
    return;
  runFilterHandlers[name](name, filter);
}

function saveFilterRadioChange() {
  var div = gel('savefiltergroupref');
  var grp = getMessage('Group');
  if (getGroupSaveOption() == grp)
    div.style.display = "inline";
  else
    div.style.display = "none";
}

function getFilterVisibility() {
  var vis = getGroupSaveOption();
  var me = getMessage('Me');
  var eone = getMessage('Everyone');
  var grp = getMessage('Group');
  if (vis == me)
    return vis;
  if (vis == eone)
    return "GLOBAL";
  if (vis != grp)
    return me;
  var vis = '';
  var e = gel('save_filter_ref_id').value;
  var e = gel(e);
  if (e)
    vis = e.value;
  if (!vis)
    return me;
  return vis;
}

function getGroupSaveOption() {
  var rb = gel('MeRadio');
  if (rb && rb.checked)
    return rb.value;
  rb = gel('EveryoneRadio');
  if (rb && rb.checked)
    return rb.value;
  rb = gel('GroupRadio');
  if (rb && rb.checked)
    return rb.value;
  return getMessage('Me');
};
/*! RESOURCE: /scripts/doctype/simpleStorage.js */
(function(root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd)
    define(factory);
  else
    root.simpleStorage = factory();
}(this, function() {
  "use strict";
  var VERSION = "0.1.2",
    _storage = false,
    _storage_size = 0,
    _storage_available = false,
    _ttl_timeout = null;

  function _init() {
    window.localStorage.setItem("__simpleStorageInitTest", "tmpval");
    window.localStorage.removeItem("__simpleStorageInitTest");
    _load_storage();
    _handleTTL();
    _setupUpdateObserver();
    if ("addEventListener" in window) {
      window.addEventListener("pageshow", function(event) {
        if (event.persisted) {
          _reloadData();
        }
      }, false);
    }
    _storage_available = true;
  }

  function _setupUpdateObserver() {
    if ("addEventListener" in window)
      window.addEventListener("storage", _reloadData, false);
    else
      document.attachEvent("onstorage", _reloadData);
  }

  function _reloadData() {
    try {
      _load_storage();
    } catch (E) {
      _storage_available = false;
      return;
    }
    _handleTTL();
  }

  function _load_storage() {
    var source = localStorage.getItem("simpleStorage");
    try {
      _storage = JSON.parse(source) || {};
    } catch (E) {
      _storage = {};
    }
    _storage_size = _get_storage_size();
  }

  function _save() {
    try {
      localStorage.setItem("simpleStorage", JSON.stringify(_storage));
      _storage_size = _get_storage_size();
    } catch (E) {
      return E;
    }
    return true;
  }

  function _get_storage_size() {
    var source = localStorage.getItem("simpleStorage");
    return source ? String(source).length : 0;
  }

  function _handleTTL() {
    var curtime, i, len, expire, keys, nextExpire = Infinity,
      expiredKeysCount = 0;
    clearTimeout(_ttl_timeout);
    if (!_storage || !_storage.__simpleStorage_meta || !_storage.__simpleStorage_meta.TTL)
      return;
    curtime = +new Date();
    keys = _storage.__simpleStorage_meta.TTL.keys || [];
    expire = _storage.__simpleStorage_meta.TTL.expire || {};
    for (i = 0, len = keys.length; i < len; i++) {
      if (expire[keys[i]] <= curtime) {
        expiredKeysCount++;
        delete _storage[keys[i]];
        delete expire[keys[i]];
      } else {
        if (expire[keys[i]] < nextExpire) {
          nextExpire = expire[keys[i]];
        }
        break;
      }
    }
    if (nextExpire != Infinity) {
      _ttl_timeout = setTimeout(_handleTTL, Math.min(nextExpire - curtime, 0x7FFFFFFF));
    }
    if (expiredKeysCount) {
      keys.splice(0, expiredKeysCount);
      _cleanMetaObject();
      _save();
    }
  }

  function _setTTL(key, ttl) {
    var curtime = +new Date(),
      i, len, added = false;
    ttl = Number(ttl) || 0;
    if (ttl !== 0) {
      if (_storage.hasOwnProperty(key)) {
        if (!_storage.__simpleStorage_meta)
          _storage.__simpleStorage_meta = {};
        if (!_storage.__simpleStorage_meta.TTL)
          _storage.__simpleStorage_meta.TTL = {
            expire: {},
            keys: []
          };
        _storage.__simpleStorage_meta.TTL.expire[key] = curtime + ttl;
        if (_storage.__simpleStorage_meta.TTL.expire.hasOwnProperty(key)) {
          for (i = 0, len = _storage.__simpleStorage_meta.TTL.keys.length; i < len; i++) {
            if (_storage.__simpleStorage_meta.TTL.keys[i] == key) {
              _storage.__simpleStorage_meta.TTL.keys.splice(i);
            }
          }
        }
        for (i = 0, len = _storage.__simpleStorage_meta.TTL.keys.length; i < len; i++) {
          if (_storage.__simpleStorage_meta.TTL.expire[_storage.__simpleStorage_meta.TTL.keys[i]] > curtime + ttl) {
            _storage.__simpleStorage_meta.TTL.keys.splice(i, 0, key);
          }
        }
        if (!added)
          _storage.__simpleStorage_meta.TTL.keys.push(key);
      } else
        return false;
    } else {
      if (_storage && _storage.__simpleStorage_meta && _storage.__simpleStorage_meta.TTL) {
        if (_storage.__simpleStorage_meta.TTL.expire.hasOwnProperty(key)) {
          delete _storage.__simpleStorage_meta.TTL.expire[key];
          for (i = 0, len = _storage.__simpleStorage_meta.TTL.keys.length; i < len; i++) {
            if (_storage.__simpleStorage_meta.TTL.keys[i] == key) {
              _storage.__simpleStorage_meta.TTL.keys.splice(i, 1);
              break;
            }
          }
        }
        _cleanMetaObject();
      }
    }
    clearTimeout(_ttl_timeout);
    if (_storage && _storage.__simpleStorage_meta && _storage.__simpleStorage_meta.TTL && _storage.__simpleStorage_meta.TTL.keys.length) {
      _ttl_timeout = setTimeout(_handleTTL, Math.min(Math.max(_storage.__simpleStorage_meta.TTL.expire[_storage.__simpleStorage_meta.TTL.keys[0]] - curtime, 0), 0x7FFFFFFF));
    }
    return true;
  }

  function _cleanMetaObject() {
    var updated = false,
      hasProperties = false,
      i;
    if (!_storage || !_storage.__simpleStorage_meta)
      return updated;
    if (_storage.__simpleStorage_meta.TTL && !_storage.__simpleStorage_meta.TTL.keys.length) {
      delete _storage.__simpleStorage_meta.TTL;
      updated = true;
    }
    for (i in _storage.__simpleStorage_meta) {
      if (_storage.__simpleStorage_meta.hasOwnProperty(i)) {
        hasProperties = true;
        break;
      }
    }
    if (!hasProperties) {
      delete _storage.__simpleStorage_meta;
      updated = true;
    }
    return updated;
  }
  try {
    _init();
  } catch (E) {}
  return {
    version: VERSION,
    canUse: function() {
      return !!_storage_available;
    },
    set: function(key, value, options) {
      if (key == "__simpleStorage_meta")
        return false;
      if (!_storage)
        return false;
      if (typeof value == "undefined")
        return this.deleteKey(key);
      options = options || {};
      try {
        value = JSON.parse(JSON.stringify(value));
      } catch (E) {
        return E;
      }
      _storage[key] = value;
      _setTTL(key, options.TTL || 0);
      return _save();
    },
    get: function(key) {
      if (!_storage)
        return false;
      if (_storage.hasOwnProperty(key) &&
        key != "__simpleStorage_meta") {
        if (this.getTTL(key)) {
          return _storage[key];
        }
      }
    },
    deleteKey: function(key) {
      if (!_storage)
        return false;
      if (key in _storage) {
        delete _storage[key];
        _setTTL(key, 0);
        return _save();
      }
      return false;
    },
    setTTL: function(key, ttl) {
      if (!_storage)
        return false;
      _setTTL(key, ttl);
      return _save();
    },
    getTTL: function(key) {
      if (!_storage)
        return false;
      if (_storage.hasOwnProperty(key)) {
        if (_storage.__simpleStorage_meta &&
          _storage.__simpleStorage_meta.TTL &&
          _storage.__simpleStorage_meta.TTL.expire &&
          _storage.__simpleStorage_meta.TTL.expire
          .hasOwnProperty(key)) {
          var ttl = Math.max(_storage.__simpleStorage_meta.TTL.expire[key] - (+new Date()) || 0, 0);
          return ttl || false;
        } else {
          return Infinity;
        }
      }
      return false;
    },
    flush: function() {
      if (!_storage)
        return false;
      _storage = {};
      _storage_size = 0;
      try {
        localStorage.removeItem("simpleStorage");
        return true;
      } catch (E) {
        return E;
      }
    },
    index: function() {
      if (!_storage)
        return false;
      var index = [],
        i;
      for (i in _storage) {
        if (_storage.hasOwnProperty(i) &&
          i != "__simpleStorage_meta") {
          index.push(i);
        }
      }
      return index;
    },
    storageSize: function() {
      return _storage_size;
    },
    getStorage: function() {
      return _storage;
    }
  };
}));;
/*! RESOURCE: /scripts/doctype/GwtMessage14.js */
var GwtMessage = Class.create({
  DEFAULT_LANGUAGE: "en",
  PREFETCH_ENTRY_KEY: "PREFETCH_ENTRY_KEY",
  initialize: function() {},
  set: function(n, v) {
    if (!v)
      GwtMessage._messages[n] = true;
    else
      GwtMessage._messages[n] = v;
  },
  format: function(msg) {
    if (!msg)
      return "";
    var str = msg;
    for (var i = 1; i < arguments.length; i++) {
      var paramIndex = i - 1;
      var rx = new RegExp("\{[" + paramIndex + "]\}", "g");
      str = str.replace(rx, arguments[i]);
    }
    return str;
  },
  getMessage: function(strVal) {
    var valList = [];
    valList.push(strVal);
    var messages = this.getMessages(valList);
    var msg = messages[strVal];
    if (arguments.length > 1) {
      var realArray = [].slice.call(arguments, 0);
      realArray[0] = msg;
      msg = this.format.apply(this, realArray);
    }
    return msg;
  },
  getMessages: function(resolveList) {
    var pageMsgs = {};
    var dataRequiringAjaxCall = [];
    var results = {};
    for (var i = 0; i < resolveList.length; i++) {
      var v = GwtMessage._messages[resolveList[i]];
      if (v === true)
        pageMsgs[resolveList[i]] = resolveList[i];
      else if (v)
        pageMsgs[resolveList[i]] = v;
      else
        dataRequiringAjaxCall.push(resolveList[i]);
    }
    if (dataRequiringAjaxCall.length > 0) {
      this._loadNewMessages(dataRequiringAjaxCall);
      results = this._buildListFromCache(dataRequiringAjaxCall);
    }
    for (var key in pageMsgs)
      results[key] = pageMsgs[key];
    return results;
  },
  _loadNewMessages: function(resolveList) {
    var cachedMessages = this._findCachedKeys(resolveList);
    var keysToResolve = this._removeCachedEntries(resolveList, cachedMessages);
    if (keysToResolve.length == 0)
      return;
    var ajax = new GlideAjax("SysMessageAjax");
    ajax.addParam("sysparm_keys", keysToResolve.length);
    ajax.addParam("sysparm_prefetch", this._shouldPrefetch() ? "true" : "false");
    for (var i = 0; i < keysToResolve.length; i++) {
      var keyVal = "key" + i;
      ajax.addParam(keyVal, keysToResolve[i]);
    }
    var rxml = ajax.getXMLWait();
    this._processResponse(rxml);
  },
  _removeCachedEntries: function(resolveList) {
    var messagesToResolve = new Array();
    for (var i = 0; i < resolveList.length; i++) {
      var key = resolveList[i];
      if (this._getCache().get(key))
        continue;
      messagesToResolve.push(key);
    }
    return messagesToResolve;
  },
  _processResponse: function(rxml) {
    this._processItems(rxml, "preitem");
    this._processItems(rxml, "item");
  },
  _shouldPrefetch: function() {
    var pf = this._getCache().get(this._PREFETCH_ENTRY_KEY);
    var now = new Date().getTime();
    if (typeof pf == 'undefined' || (pf + 60000) < now) {
      this._getCache().put(this._PREFETCH_ENTRY_KEY, now);
      return true;
    }
    return false;
  },
  _processItems: function(xml, name) {
    var items = xml.getElementsByTagName(name);
    for (var i = 0; i < items.length; i++) {
      var key = items[i].getAttribute("key");
      var value = items[i].getAttribute("value");
      this.setMessage(key, value);
    }
  },
  setMessage: function(key, msg) {
    this._getCache().put(key, msg);
  },
  isDefaultLanguage: function() {
    return this.getLanguage() == this.getDefaultLanguage();
  },
  getLanguage: function() {
    return g_lang;
  },
  getDefaultLanguage: function() {
    return this.DEFAULT_LANGUAGE;
  },
  _findCachedKeys: function(resolveList) {
    var answer = new Array();
    var cache = this._getCache();
    for (var i = 0; i < resolveList.length; i++) {
      var key = resolveList[i];
      var value = cache.get(key);
      if (value)
        answer.push(key);
    }
    return answer;
  },
  _buildListFromCache: function(resolveList) {
    var answer = {};
    var cache = this._getCache();
    for (var i = 0; i < resolveList.length; i++) {
      var key = resolveList[i];
      var value = cache.get(key);
      answer[key] = value;
    }
    return answer;
  },
  _getCache: function() {
    if (NOW.useSimpleStorage && simpleStorage.canUse()) {
      var synch = simpleStorage.get("simpleStorageSynch");
      if (NOW.simpleStorageSynch != synch) {
        jslog("*** simpleStorageSynch, size: " + simpleStorage.storageSize());
        simpleStorage.flush();
        simpleStorage.set("simpleStorageSynch", NOW.simpleStorageSynch);
      }
      return {
        put: function(key, value) {
          return simpleStorage.set("MSG_" + NOW.language + "_" + key, value);
        },
        get: function(key) {
          return simpleStorage.get("MSG_" + NOW.language + "_" + key);
        }
      }
    }
    try {
      if (getTopWindow().g_cache_message)
        return getTopWindow().g_cache_message;
    } catch (e) {}
    if (typeof(g_cache_message) != "undefined")
      return g_cache_message;
    g_cache_message = new GlideClientCache(500);
    return g_cache_message;
  },
  fetch: function(resolveList, callback) {
    var cachedMessages = this._findCachedKeys(resolveList);
    var keysToResolve = this._removeCachedEntries(resolveList, cachedMessages);
    if (keysToResolve.length == 0) {
      var answer = this.getMessages(resolveList);
      callback(answer);
      return;
    }
    var ajax = new GlideAjax("SysMessageAjax");
    ajax.addParam("sysparm_keys", keysToResolve.length);
    ajax.addParam("sysparm_prefetch", this._shouldPrefetch() ? "true" : "false");
    for (var i = 0; i < keysToResolve.length; i++) {
      var keyVal = "key" + i;
      ajax.addParam(keyVal, keysToResolve[i]);
    }
    ajax.getXML(this.fetched.bind(this), null, {
      fn: callback,
      list: resolveList
    });
  },
  fetched: function(response, parms) {
    this._processResponse(response.responseXML);
    var answer = this.getMessages(parms.list);
    parms.fn(answer);
  }
});
GwtMessage._messages = {};

function getMessage(msg, callback) {
  if (typeof callback == "function") {
    if (typeof msg == "object")
      new GwtMessage().fetch(msg, callback);
    else
      new GwtMessage().fetch([msg], function(o) {
        callback(o[msg]);
      });
  } else {
    if (typeof msg == "object")
      return new GwtMessage().getMessages(msg);
    return new GwtMessage().getMessage(msg);
  }
}

function getMessages(msgs) {
  return new GwtMessage().getMessages(msgs);
};
/*! RESOURCE: /scripts/classes/GlideFilterDescription.js */
var GlideFilterDescription = Class.create({
  initialize: function() {},
  choices: null,
  setParsedQuery: function(strVal) {
    this.parsedQuery = strVal;
  },
  getParsedQuery: function() {
    return this.parsedQuery;
  },
  setBaseLine: function(value) {
    this.baseLine = value;
  },
  getBaseLine: function() {
    return this.baseLine;
  },
  setMetaData: function(value) {
    this.metaData = value;
  },
  getMetaData: function() {
    return this.metaData;
  },
  setPreferenceParam: function(value) {
    this.preference = value;
  },
  getPreferenceParam: function() {
    return this.preference;
  },
  setExpanded: function(value) {
    this.expanded = value;
  },
  getExpanded: function() {
    return this.expanded;
  },
  setName: function(value) {
    this.name = value;
  },
  getName: function() {
    return this.name;
  },
  setFilter: function(value) {
    this.filter = value;
  },
  getFilter: function() {
    return this.filter;
  },
  setTableName: function(value) {
    this.tableName = value;
  },
  getTableName: function() {
    return this.tableName;
  },
  setPinned: function(value) {
    this.pinned = value;
  },
  getPinned: function() {
    return this.pinned;
  },
  setMainFilterTable: function(filterTable) {
    this.mainFilterTable = filterTable;
  },
  getMainFilterTable: function() {
    return this.mainFilterTable;
  },
  setPinnable: function(value) {
    this.pinnable = value;
  },
  getPinnable: function() {
    return this.pinnable;
  },
  setShowRelated: function(value) {
    this.showRelated = value;
  },
  getShowRelated: function() {
    return this.showRelated;
  },
  setChoiceListMap: function(value) {
    this.choiceList = value;
  },
  getChoiceList: function(table) {
    if (typeof this.choiceList == 'undefined')
      return null;
    return this.choiceList[table];
  }
});;
/*! RESOURCE: /scripts/classes/GlideFilterHandlers.js */
var GlideFilterHandler = Class.create({
  MAP_OPEN: "$" + "{",
  filterClass: "",
  initialize: function(tableName, item, mappingId) {
    this.maxValues = 0;
    this.tableName = tableName;
    this.item = item;
    this.isRightOperandShowingRelatedFields = false;
    this.lastOperator = null;
    this.mappingId = mappingId;
  },
  destroy: function() {
    if (this.tr) {
      if (this.tr.operSel)
        this.tr.operSel.onchange = null;
      this.tr = null;
    }
    for (i = 0; i < this.inputCnt; i++) {
      this.inputs[i].onkeypress = null;
      this.inputs[i].onchange = null;
      this.inputs[i] = null;
    }
    this.destroyMappingSupport();
  },
  create: function(tr, values, filterClass) {
    this.tr = tr;
    if (values && values.indexOf(this.MAP_OPEN) != -1) {
      console.log("implement GlideFilterHandler#create mapping support");
    }
    this._setup(values);
    this._init(values);
    this._build(filterClass);
    if (this.listenForOperChange)
      this.tr.operSel.onchange = this._operOnChange.bind(this);
    this.isRightOperandShowingRelatedFields = false;
    this.lastOperator = this._getOperator();
  },
  _setup: function(values) {},
  getTableName: function() {
    return this.tableName;
  },
  getFilterText: function(oper) {
    return '';
  },
  _init: function(values) {
    this._initValues(values);
    this._initialMappingValue = values;
    this._initInputs();
  },
  _initValues: function(values) {
    var op = this._getOperator();
    if (!values)
      this.values = [];
    else if (this.tr && this.tr.varType === "variables" && !this.userDateFormat) {
      this.values = [values];
    } else
      this.values = values.split("@");
    for (var i = this.values.length; i < this.maxValues; i++)
      this.values[i] = "";
  },
  _initInputs: function() {
    this.inputCnt = 0;
    this.inputs = [];
    for (var i = 0; i < this.maxValues; i++)
      this.inputs[i] = null;
  },
  _clearValues: function() {
    this.values = [];
    for (var i = 0; i < this.maxValues; i++)
      this.values[i] = "";
  },
  _isEmptyOper: function() {
    var op = this._getOperator();
    if (op == 'ISEMPTY' || op == 'ISNOTEMPTY' || op == 'ANYTHING' || op == 'EMPTYSTRING' || op == 'VALCHANGES') {
      this._clearValues();
      return true;
    }
    return false;
  },
  _getOperator: function() {
    return getSelectedOption(this.tr.operSel).value;
  },
  _getInputValue: function(el) {
    var value = "";
    if (el == null)
      return value;
    if (el.tagName.toUpperCase() == "TEXTAREA")
      return el.value;
    if (el.tagName.toUpperCase() == "INPUT")
      return this._escapeIfRequired(el.value);
    var options = el.options;
    if (el.multiple) {
      var vals = [];
      for (var i = 0; i < options.length; i++) {
        if (options[i].selected)
          vals.push(options[i].value);
      }
      return vals.join(",");
    }
    return options[el.selectedIndex].value;
  },
  _escapeIfRequired: function(value) {
    if (this._getOperator() == "BETWEEN") {
      if (value == null) {
        for (var i = 0; i < this.values; i++)
          this.values[i] = this._escape(this.values[i]);
        return this.values;
      }
      return this._escape(value);
    }
    return value;
  },
  _escape: function(value) {
    if (value == null)
      return;
    value = value.replace(/\\/g, "\\\\")
    value = value.replace(/@/g, "\\@")
    return value;
  },
  _unescapeIfRequired: function() {
    if (this._getOperator() == "BETWEEN")
      for (var i = 0; i < this.values.length; i++)
        this.values[i] = this._unescape(this.values[i]);
  },
  _unescape: function(value) {
    return this._parseValues(value, '@')[0];
  },
  _addTextInput: function(type, td) {
    if (!td)
      td = this.tr.tdValue;
    if (!this._isEmptyOper()) {
      if (this.tr.tdMapping)
        this.tr.tdMapping.show();
    }
    var input = addTextInput(td, this.values[this.inputCnt], type);
    this.inputs[this.inputCnt] = input;
    this.inputCnt++;
    return input;
  },
  _addInvisibleTextInput: function(type, td) {
    var input = $(this._addTextInput(type, td));
    input.addClassName('sr-only');
    input.setAttribute('readonly', 'readonly');
    this.inputCnt--;
    this.inputs.pop();
    getMessage('No value needed', function(msg) {
      input.value = msg;
    });
  },
  _addBetweenTextInput: function(type, td) {
    if (!td)
      td = this.tr.tdValue;
    var input = addTextInput(td, this.values[this.inputCnt], type);
    this.inputs[this.inputCnt] = input;
    this.inputCnt++;
    return input;
  },
  _addTextArea: function() {
    if (!this._isEmptyOper()) {
      if (this.tr.tdMapping)
        this.tr.tdMapping.show();
    }
    var input = addTextArea(this.tr.tdValue, this.values[this.inputCnt]);
    this.inputs[this.inputCnt] = input;
    this.inputCnt++;
    return input;
  },
  _addSelect: function(width, multi, size) {
    var s = _createFilterSelect(width, multi, size);
    this.tr.tdValue.appendChild(s);
    this.inputs[this.inputCnt] = s;
    this.inputCnt++;
    return s;
  },
  _operOnChange: function() {
    var lastOp = this.lastOperator;
    this.lastOperator = this._getOperator();
    if ((fieldComparisonOperators.indexOf(lastOp) >= 0) != (fieldComparisonOperators.indexOf(this.lastOperator) >= 0) || lastOp == "DYNAMIC") {
      this.inputCnt = 0;
      this.input = [];
    }
    this.getValues();
    this._unescapeIfRequired();
    this._build();
  },
  _isTemplate: function() {
    var t = this.tr;
    while (t) {
      t = findParentByTag(t, 'table');
      if (t) {
        var id = t.id + '';
        if (id.indexOf('filters_table') != -1)
          break;
      }
    }
    if (!t)
      return false;
    return t.getAttribute('gsft_template') == 'true';
  },
  _renderDynamicOperandInput: function(op) {
    if (typeof g_dynamic_filter_options == "undefined")
      return false;
    if (op != "DYNAMIC")
      return false;
    var addedReferenceInput = false;
    var arr = g_dynamic_filter_options.split("##");
    for (var i = 0; i < arr.length; i++) {
      var aItem = arr[i];
      if (aItem.length == 0)
        continue;
      var aItemArr = aItem.split("::");
      if (aItemArr.length < 3)
        continue;
      var isExclusiveDynamic = typeof gtf_exclusive_dynamics != 'undefined' && gtf_exclusive_dynamics == "true";
      if (!isExclusiveDynamic && this.item && this.item.getReference() == aItemArr[2] || this.originalTableName == aItemArr[3]) {
        if (!addedReferenceInput)
          var input = this._addSelect(180, false, 1);
        var arrInput = [];
        arrInput.push(aItemArr[1]);
        var translated = getMessages(arrInput);
        addOption(input, aItemArr[0], translated[aItemArr[1]], this.rightOperand == aItemArr[0]);
        addedReferenceInput = true;
      }
    }
    return addedReferenceInput;
  },
  setOriginalTable: function(tableNameFull) {
    if (tableNameFull.indexOf(".") == -1)
      this.originalTableName = tableNameFull;
    else
      this.originalTableName = tableNameFull.split(".")[1];
  },
  getValues: function() {
    this._clearValues();
    if (this.inputCnt == 0)
      return "";
    for (var i = 0; i < this.maxValues; i++)
      this.values[i] = this._getInputValue(this.inputs[i]);
    if (this._isMappingEnabled)
      return this.getMappingValue();
    if (this.inputCnt == 1)
      return this.values[0];
    else
      return this.values.join("@");
  },
  _populateRightOperandChoices: function() {
    var field = this.item.name;
    var table = "";
    if (typeof mainFilterTable == "undefined")
      table = firstTable;
    else
      table = mainFilterTable;
    var selection = this.values[0];
    if (null != table && "" != table && null != field && "" != field) {
      var s = this._addSelect(this.width, false, 1);
      s.onchange = this.rightOperandfieldOnChange.bind(s, table, this);
      var completeSelection = "";
      if (selection)
        completeSelection = table + '.' + selection;
      else
        completeSelection = table;
      var showRelatedFields = "no";
      if (this.isRightOperandShowingRelatedFields || (selection && selection.indexOf(".") >= 0))
        showRelatedFields = "yes";
      this.addChoices(s, completeSelection, "",
        this._filterRightOperand, selection, null,
        showRelatedFields, this.item);
      if (null != selection)
        this.selectRightOperand(s, selection);
    }
  },
  selectRightOperand: function(select, selection) {
    var o = getSelectedOption(select);
    var options = select.options;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (null != option && option.value == selection) {
        option.innerHTML = getFullLabel(option);
        option.style.color = 'green';
        option.wasSelected = 'true';
        select.style.width = "240px";
        option.selected = true;
        select.selectedIndex = i;
        break;
      }
    }
  },
  _getReportTable: function() {
    return firstTable;
  },
  rightOperandfieldOnChange: function(table, t) {
    var fieldName = this.value;
    var idx = fieldName.indexOf("...");
    var f = fieldName.substring(0, idx);
    if (f != table)
      f = table + "." + f;
    f = f + ".";
    if (idx != -1) {
      if (fieldName == '...Show Related Fields...') {
        t.isRightOperandShowingRelatedFields = true;
        t.addChoices(this, f, "", t._filterRightOperand,
          fieldName, null, "yes", t.item);
      } else if (fieldName == '...Remove Related Fields...') {
        t.isRightOperandShowingRelatedFields = false;
        t.addChoices(this, f, "", t._filterRightOperand,
          fieldName, null, "no", t.item);
      } else {
        t.isRightOperandShowingRelatedFields = true;
        t.addChoices(this, f, "", t._filterRightOperand,
          fieldName, null, "yes", t.item);
      }
      return;
    }
    var o = getSelectedOption(this);
    var fieldName = o.value;
    var name = currentTable = getTableFromOption(o);
    var options = this.options;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (optionWasSelected(option)) {
        option.innerHTML = getNormalLabel(option);
        option.style.color = 'black';
        option.wasSelected = 'false';
        break;
      }
    }
    if (setup(name) == false)
      return;
    var tr = this.parentNode.parentNode;
    o.normalLabel = o.innerHTML;
    o.innerHTML = getFullLabel(o);
    o.style.color = 'green';
    o.wasSelected = 'true';
    this.style.width = "240px";
  },
  addChoices: function(s, target, fValue, filterMethod, fieldName, filter, showRelated, leftOperandElement) {
    var forFilter;
    var onlyRestrictedFields;
    if (filter) {
      forFilter = filter.getOpsWanted();
      onlyRestrictedFields = filter.onlyRestrictedFields;
    }
    var messages = getMessages(MESSAGES_CONDITION_RELATED_FILES);
    while (s.length > 0)
      s.remove(0);
    var placeholder = false;
    var selindex = 0;
    var indentLabel = false;
    var savedItems = new Object();
    var savedLabels = new Array();
    var labelPrefix = '';
    var headersAdded = false;
    var parts = target.split(".");
    var tableName = parts[0];
    var tableDef = getTableReference(tableName);
    var extension = '';
    var prefix = '';
    if (parts.length > 1 && parts[1] != null && parts[1] != '') {
      var o = null;
      if (filterExpanded && parts.length > 2) {
        var tableLabel = tableDef.getLabel();
        if (tableLabel == null)
          tableLabel = "Parent";
        o = addOption(s, tableDef.getName() + "...", tableLabel +
          " " + messages['lowercase_fields'], false);
        o.tableName = tableDef.getName();
        o.style.color = 'blue';
      }
      if (parts[1] == PLACEHOLDERFIELD) {
        o = addOption(s, PLACEHOLDER,
          messages['-- choose field --'], true);
        o.style.color = 'blue';
        o.tableName = tableDef.getName();
        o.fullLabel = messages['-- choose field --'];
        placeholder = true;
      }
      var sPeriod = "";
      var cname = '';
      for (var i = 1; i < parts.length - 1; i++) {
        var f = parts[i];
        if (f == null || f == '')
          break;
        var elementDef = tableDef.getElement(parts[i]);
        if (elementDef == null)
          break;
        var childTable = tableName;
        if (elementDef.isReference()) {
          childTable = elementDef.getReference();
          if (elementDef.isExtensionElement())
            extension = childTable;
          else
            extension = '';
        } else {
          if (fieldName != null && fieldName.indexOf("...") > -1) {
            childTable = parts[0];
          } else {
            break;
          }
        }
        var parentTable = (extension != '') ? extension : elementDef.getTable().getName();
        var tableDef = getTableReference(childTable, parentTable);
        if (cname.length)
          cname = cname + ".";
        cname += elementDef.getName();
        sPeriod = "." + sPeriod;
        var clabel = sPeriod + elementDef.getLabel() + "-->" +
          elementDef.getRefLabel() + " " +
          messages['lowercase_fields'];
        o = addOption(s, cname + "...", clabel, false);
        o.tablename = tableDef.getName();
        o.style.color = 'blue';
        selindex++;
        indentLabel = true;
        headersAdded = true;
        if (labelPrefix.length)
          labelPrefix += ".";
        labelPrefix += elementDef.getLabel();
        if (prefix.length)
          prefix += ".";
        prefix += elementDef.getName();
      }
    }
    columns = tableDef.getColumns();
    queueColumns[tableDef.getName()] = columns;
    var textIndex = false;
    if (!noOps && !indentLabel) {
      var root = columns.getElementsByTagName("xml");
      if (root != null && root.length == 1) {
        root = root[0];
        textIndex = root.getAttribute("textIndex");
      }
    }
    var items = (extension != '') ? tableDef.getTableElements(extension) : tableDef.getElements();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var t = item.getName();
      if (filterMethod != null && t != fValue) {
        if (filterMethod(leftOperandElement, item,
            this.isRightOperandShowingRelatedFields) == true) {
          continue;
        }
      }
      var t = item.getName();
      if (prefix != '')
        t = prefix + '.' + t;
      if (!noOps && item.getAttribute("filterable") == "no" && !allowConditionsForJournal(item.getAttribute("type"), filter))
        continue;
      if (!item.canRead()) {
        if (t != fValue) {
          continue;
        } else {
          item.setCanRead('yes');
        }
      }
      if (!item.isActive()) {
        if (t != fValue) {
          continue;
        } else {
          item.setActive('yes');
        }
      }
      var label = item.getLabel();
      if ((!elementDef || elementDef.getType() != "glide_var") &&
        !item.isReference()) {
        savedItems[label] = t;
        savedLabels[savedLabels.length] = label;
      }
      if (item.isReference() && leftOperandElement.isReference()) {
        if (item.getReference() == leftOperandElement.getReference()) {
          savedItems[label] = t;
          savedLabels[savedLabels.length] = label;
        }
      }
      if (item.isReference() && !item.isRefRotated() &&
        item.getType() != 'glide_list' && filterExpanded &&
        showRelated == 'yes') {
        label += "-->" + item.getRefLabel();
        label += " " + messages['lowercase_fields'];
        t += "...";
        savedItems[label] = t;
        savedLabels[savedLabels.length] = label;
      }
    }
    items = tableDef.getExtensions();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var label = item.getLabel() + " (+)";
      t = item.getExtName() + "...";
      if (prefix != '')
        t = prefix + '.' + t;
      savedItems[label] = t;
      savedLabels[savedLabels.length] = label;
    }
    if (!onlyRestrictedFields &&
      ((fValue == TEXTQUERY || textIndex) &&
        filterMethod == null || forFilter)) {
      o = addOption(s, TEXTQUERY, messages['Keywords'], (fValue == TEXTQUERY));
      o.fullLabel = messages['Keywords'];
    }
    for (var i = 0; i < savedLabels.length; i++) {
      var sname = savedLabels[i];
      var o = addOption(s, savedItems[sname], sname, savedItems[sname] == fValue);
      o.tableName = tableDef.getName();
      if (labelPrefix != '')
        o.fullLabel = labelPrefix + "." + sname;
      else
        o.fullLabel = sname;
      if (indentLabel) {
        var yyy = o.innerHTML;
        o.innerHTML = "&nbsp;&nbsp;&nbsp;" + yyy;
      }
      var v = o.value;
      if (v.indexOf("...") != -1)
        if (o.fullLabel.indexOf("(+)") == -1)
          o.style.color = 'blue';
        else
          o.style.color = 'darkred';
    }
    if (filterExpanded && !onlyRestrictedFields) {
      if (showRelated != 'yes') {
        var o = addOption(s, "...Show Related Fields...", messages['Show Related Fields'], false);
        o.style.color = 'blue';
      } else {
        var o = addOption(s, "...Remove Related Fields...", messages['Remove Related Fields'], false);
        o.style.color = 'blue';
      }
    }
    if (!placeholder && (s.selectedIndex == 0 && ((textIndex && fValue != TEXTQUERY) || headersAdded)))
      s.selectedIndex = selindex;
    if (s.selectedIndex >= 0) {
      fValue = getSelectedOption(s).value;
    }
    return s;
  },
  _filterRightOperand: function(leftOperandElement, rightOperandElement, isRightOperandShowingRelatedFields) {
    var filterOut = true;
    if (null != leftOperandElement && null != rightOperandElement) {
      var leftType = leftOperandElement.getType();
      var rightType = rightOperandElement.getType();
      if ('reference' != leftType) {
        if ('reference' == rightType && isRightOperandShowingRelatedFields)
          filterOut = false;
        if (leftType == rightType)
          filterOut = false;
      } else {
        if ('reference' == rightType)
          filterOut = false;
      }
    }
    return filterOut;
  },
  _renderRightOperandAsFieldList: function(operation) {
    if ("SAMEAS" == operation || "NSAMEAS" == operation ||
      "GT_FIELD" == operation || "LT_FIELD" == operation ||
      "GT_OR_EQUALS_FIELD" == operation ||
      "LT_OR_EQUALS_FIELD" == operation)
      return true;
    return false;
  },
  _addSameAsLabels: function(t, op) {
    if (op == 'SAMEAS' || op == 'NSAMEAS') {
      var ASMSG = getMessage('as');
      var FROMMSG = getMessage('from');
      var span = cel("span", t.tr.tdValue);
      span.style.marginLeft = "3px";
      span.style.marginRight = "5px";
      if (op == 'SAMEAS')
        span.innerHTML = ASMSG;
      else
        span.innerHTML = FROMMSG;
    }
  },
  _parseValues: function(value, delimiter) {
    var sb = "";
    var parts = [];
    if (value == null)
      value = ""
    var escapeChar = '\\';
    var escaped = false;
    for (var i = 0; i < value.length; i++) {
      var checkChar = value.substr(i, 1);
      if (!escaped) {
        if (checkChar == escapeChar) {
          escaped = true;
          continue;
        }
        if (checkChar == delimiter) {
          parts.push(sb);
          sb = "";
          continue;
        }
      } else
        escaped = false;
      sb += checkChar;
    }
    parts.push(sb);
    return parts;
  },
  setFilterClass: function(filterClass) {
    this.filterClass = filterClass;
  },
  getFilterClass: function() {
    return this.filterClass;
  },
  initMappingSupport: function(shouldEnable, type, mappingMgr) {
    var that = this;
    var td = this.tr.tdMapping;
    this._parentMappingMgr = mappingMgr;
    if (!td || !mappingMgr)
      return;
    this.mappingType = type;
    if (shouldEnable) {
      td.innerHTML = '<input type="hidden" class="mapping_condition_input" >';
    } else {
      td.innerHTML = "";
    }
    this.mappingInput = td.querySelector(".mapping_condition_input");
    var value = this._initialMappingValue || "";
    this._initMappingValue(value);
    this._initialMappingValue = null;
    this._parentMappingMgr.initElement(this);
  },
  _initMappingValue: function(value) {
    if (value.indexOf("{{") !== -1) {
      this.setMappingValue(value);
      this.activateMapping();
    } else {
      this.deactivateMapping();
    }
  },
  destroyMappingSupport: function() {
    if (this._parentMappingMgr && typeof this._parentMappingMgr.destroyElement === "function")
      this._parentMappingMgr.destroyElement(this);
  },
  activateMapping: function() {
    this._isMappingEnabled = true;
    if (!this.tr)
      return;
    this.tr.tdValue.style.display = "none";
    addClassName(this.tr.tdMapping, "active");
    if (this._parentMappingMgr && typeof this._parentMappingMgr.notifyStateChange === "function")
      this._parentMappingMgr.notifyStateChange(this);
  },
  deactivateMapping: function() {
    this._isMappingEnabled = false;
    if (!this.tr)
      return;
    this.tr.tdValue.style.display = "";
    removeClassName(this.tr.tdMapping, "active");
    if (this._parentMappingMgr && typeof this._parentMappingMgr.notifyStateChange === "function")
      this._parentMappingMgr.notifyStateChange(this);
  },
  _getMappingInput: function() {
    return this.tr.tdMapping.querySelector(".mapping_condition_input");
  },
  getMappingValue: function() {
    return this._getMappingInput().value;
  },
  setMappingValue: function(value) {
    this._getMappingInput().value = value;
  }
});
var GlideFilterString = Class.create(GlideFilterHandler, {
  _setup: function(values) {
    this.maxValues = 2;
    this.listenForOperChange = true;
    this.rightOperand = values;
  },
  _build: function() {
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      if (this.tr.tdMapping)
        this.tr.tdMapping.hide();
      return;
    }
    var op = this._getOperator();
    if (this._renderDynamicOperandInput(op))
      return;
    if (this._renderRightOperandAsFieldList(op)) {
      this._addSameAsLabels(this, op);
      this._populateRightOperandChoices();
    } else if (op == 'IN') {
      var saveMe = useTextareas;
      useTextareas = true;
      var inp = this._addTextArea();
      inp.style.width = '20em';
      var v = this.values[this.inputCnt - 1];
      if (this._isTemplate()) {
        inp.value = v;
      } else {
        if (v) {
          if (isMSIE)
            v = v.replace(/,/g, '\n\r');
          else
            v = v.replace(/,/g, '\n');
          inp.value = v;
        }
      }
      useTextareas = saveMe;
    } else
      this._addTextInput();
    if (op == "BETWEEN") {
      var txt = document.createTextNode(" " + getMessage('and') + " ");
      this.tr.tdValue.appendChild(txt);
      this._addTextInput();
    }
  },
  _getInputValue: function(el) {
    if (el == null)
      return '';
    if (!(el.tagName.toUpperCase() == "TEXTAREA"))
      return GlideFilterHandler.prototype._getInputValue.call(this, el);
    var value = el.value + '';
    if (!this._isTemplate()) {
      value = value.replace(/[\n\t]/g, ',');
      value = value.replace(/\r/g, '');
    }
    return this._escapeIfRequired(value);
  },
  _initMappingValue: function(value) {
    this.setMappingValue(value);
    this.activateMapping();
  },
  getValues: function() {
    this._clearValues();
    if (this.inputCnt == 0)
      return "";
    for (var i = 0; i < this.maxValues; i++)
      this.values[i] = this._getInputValue(this.inputs[i]);
    if (this._isMappingEnabled)
      return this.getMappingValue();
    if (this.inputCnt == 1)
      return this.values[0];
    else {
      this._escapeIfRequired();
      return this.values.join("@");
    }
  },
  _initInputs: function() {
    if (this._getOperator() == "DYNAMIC") {
      this.inputCnt = 1;
      this.maxValues = 1;
    } else
      this.inputCnt = 0;
    this.inputs = [];
    for (var i = 0; i < this.maxValues; i++)
      this.inputs[i] = null;
  },
  _initValues: function(values) {
    var op = this._getOperator();
    if (op == "BETWEEN") {
      if (!values)
        this.values = [];
      else
        this.values = this._parseValues(values, "@");
      for (var i = this.values.length; i < this.maxValues; i++)
        this.values[i] = "";
    } else {
      this.values = [];
      this.values[0] = values;
    }
  }
});
var GlideFilterNumber = Class.create(GlideFilterString, {
  _initValues: function(values) {
    var op = this._getOperator();
    if (op == "BETWEEN") {
      if (!values)
        this.values = [];
      else
        this.values = values.split("@");
      for (var i = this.values.length; i < this.maxValues; i++)
        this.values[i] = "";
    } else {
      this.values = [];
      this.values[0] = values;
    }
  }
});
var GlideFilterDuration = Class.create(GlideFilterHandler, {
  _setup: function(values) {
    this.maxValues = 2;
    var valueArray = this._parseValues(values, "@");
    this.duration = new GlideDuration(valueArray[0], this.item);
    if (this._getOperator() == "BETWEEN") {
      this.maxValues = 2;
      if (valueArray.length > 1)
        this.durationTo = new GlideDuration(valueArray[1], this.item);
      else
        this.durationTo = new GlideDuration(valueArray[0], this.item);
    }
    this.listenForOperChange = true;
  },
  destroy: function() {
    if (this.tr)
      this.tr.tdValue.innerHTML = "";
    this.inputCnt = 0;
    GlideFilterHandler.prototype.destroy.call(this);
  },
  _initValues: function(values) {
    this.values = new Array();
    this.values[0] = this.duration.getDays();
    this.values[1] = this.duration.getHours();
    this.values[2] = this.duration.getMinutes();
    this.values[3] = this.duration.getSeconds();
    this.inputCnt = 4;
    if (this._getOperator() == "BETWEEN") {
      this.values[4] = this.duration.getDays();
      this.values[5] = this.duration.getHours();
      this.values[6] = this.duration.getMinutes();
      this.values[7] = this.duration.getSeconds();
      this.inputCnt = 8;
    }
  },
  getValues: function() {
    this._clearValues();
    if (this.inputCnt == 0)
      return "";
    var answer = this.duration.getValue();
    this.values[0] = this.duration.getDays();
    this.values[1] = this.duration.getHours();
    this.values[2] = this.duration.getMinutes();
    this.values[3] = this.duration.getSeconds();
    if (this._isMappingEnabled)
      return this.getMappingValue();
    if (this._getOperator() == "BETWEEN") {
      if (this.durationTo) {
        var answer1 = this.durationTo.getValue();
        this.values[4] = this.durationTo.getDays();
        this.values[5] = this.durationTo.getHours();
        this.values[6] = this.durationTo.getMinutes();
        this.values[7] = this.durationTo.getSeconds();
        return "javascript:gs.getDurationDate('" + answer + "')@javascript:gs.getDurationDate('" + answer1 + "')";
      }
    }
    return "javascript:gs.getDurationDate('" + answer + "')";
  },
  _build: function() {
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    if (this._renderRightOperandAsFieldList(this._getOperator())) {
      this._addSameAsLabels(this, this._getOperator());
      this._populateRightOperandChoices();
    } else {
      this.inputCnt = 1;
      this.duration.buildHTML(this.tr.tdValue);
      if (this._getOperator() == "BETWEEN" && this.maxValues == 2) {
        var txt = document.createTextNode(" " + getMessage('and') + " ");
        this.tr.tdValue.appendChild(txt);
        if (!this.durationTo)
          this.durationTo = new GlideDuration();
        this.durationTo.buildHTML(this.tr.tdValue);
      }
    }
  }
});
var GlideFilterStringMulti = Class.create(GlideFilterString, {
  _setup: function(values) {
    this.maxValues = 1;
    this.listenForOperChange = true;
  },
  _build: function() {
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    if (this._renderDynamicOperandInput(this._getOperator()))
      return;
    if (this._renderRightOperandAsFieldList(this._getOperator())) {
      this._addSameAsLabels(this, this._getOperator());
      this._populateRightOperandChoices();
    } else
      this._addTextArea();
  }
});
var GlideFilterChoice = Class.create(GlideFilterHandler, {
  _setup: function(values) {
    this.maxValues = 2;
    this.listenForOperChange = true;
  },
  setChoices: function(choices) {
    this.choices = choices;
  },
  setWidth: function(width) {
    this.width = width;
  },
  setMulti: function(multi) {
    this.multi = multi;
  },
  setSize: function(size) {
    this.size = size;
  },
  _build: function() {
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    if (this._renderRightOperandAsFieldList(this._getOperator())) {
      this._addSameAsLabels(this, this._getOperator());
      this._populateRightOperandChoices();
    } else {
      var s = this._addSelect(this.width, this.multi, this.size);
      this._fillSelect();
    }
  },
  _fillSelect: function(inputIndex) {
    if (inputIndex == null)
      inputIndex = 0;
    var vars = {};
    if (this.values[inputIndex]) {
      var valSplit = this.values[inputIndex].split(',');
      for (var i = 0; i < valSplit.length; i++) {
        vars[valSplit[i]] = true;
      }
    }
    var removeNone = false;
    var oper = this._getOperator();
    if ((oper == 'IN') || (oper == 'NOT IN'))
      removeNone = true;
    if (isMSIE && this.inputs[0].multiple) {
      var isIE6 = /MSIE 6/.test(navigator.userAgent);
      if (isIE6)
        this.inputs[0].focus();
    }
    for (var i = 0; i < this.choices.length; i++) {
      var option = this.choices[i];
      if (option[0] == '' && removeNone)
        continue;
      var selected = (vars[option[0]] != null || this.values[inputIndex] == option[0]);
      addOption(this.inputs[inputIndex], option[0], option[1], selected);
    }
  }
});
var GlideFilterChoiceDynamic = Class.create(GlideFilterChoice, {
  _setup: function(values) {
    this.size = 4;
    this.maxValues = 2;
    this.listenForOperChange = true;
  },
  setChoices: function(choices) {
    this.choices = choices;
  },
  _initMappingValue: function(value) {
    this.mappingType = 'choice';
    if (value.indexOf("{{") !== -1) {
      this.setMappingValue(value);
      this.activateMapping();
    } else {
      this.deactivateMapping();
    }
  },
  _build: function() {
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    var oper = this._getOperator();
    if (this._renderRightOperandAsFieldList(oper)) {
      this._addSameAsLabels(this, oper);
      this._populateRightOperandChoices();
    } else if ((oper == 'LIKE') || (oper == 'STARTSWITH') || (oper == 'ENDSWITH') || (oper == 'NOT LIKE')) {
      if (this.prevOper && (this.prevOper != 'LIKE') && (this.prevOper != 'STARTSWITH') && (this.prevOper != 'ENDSWITH'))
        this._clearValues();
      this._addTextInput();
    } else if ((oper == 'IN') || (oper == 'NOT IN')) {
      this.multi = true;
      var s = this._addSelect(this.width, this.multi, this.size);
      if (!this.hasChoices) {
        s.disabled = true;
        this._getChoices();
      } else
        this._fillSelect();
    } else if (oper == 'BETWEEN') {
      this.multi = false;
      var s = this._addSelect(this.width, this.multi, 1);
      if (!this.hasChoices) {
        s.disabled = true;
        this._getChoices();
      } else
        this._fillSelect();
      var txt = document.createTextNode(" " + getMessage('and') + " ");
      this.tr.tdValue.appendChild(txt);
      this.multi = false;
      var s = this._addSelect(this.width, this.multi, 1);
      if (!this.hasChoices) {
        s.disabled = true;
        this._getChoices();
      } else
        this._fillSelect(1);
    } else {
      this.multi = false;
      var s = this._addSelect(this.width, this.multi, 1);
      if (!this.hasChoices) {
        s.disabled = true;
        this._getChoices();
      } else
        this._fillSelect();
    }
    this.prevOper = oper;
  },
  _getChoices: function() {
    if (typeof g_filter_description != 'undefined' && g_filter_description.getChoiceList(this.tr.tableField) != null) {
      var response = loadXML(g_filter_description.getChoiceList(this.tr.tableField));
      this._addChoices(response);
    } else {
      var ajax = new GlideAjax('PickList');
      ajax.addParam('sysparm_chars', '*');
      ajax.addParam('sysparm_nomax', 'true');
      ajax.addParam('sysparm_name', this.tr.tableField);
      var response = ajax.getXMLWait();
      this._addChoices(response);
    }
  },
  _addChoices: function(xml) {
    if (!xml)
      return;
    var msg = new GwtMessage();
    var select = this.inputs[0];
    select.disabled = false;
    select.options.length = 0;
    this.choices = [];
    this.hasChoices = true;
    var root = xml.documentElement;
    var dep = root.getAttribute("dependent");
    var items = xml.getElementsByTagName("item");
    var addNone = true;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.getAttribute("value") == '')
        addNone = false;
    }
    if (addNone)
      this.choices[0] = ['', msg.getMessage('-- None --')];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var v = item.getAttribute("value");
      var l = item.getAttribute("label");
      var option = [v, l];
      this.choices.push(option);
    }
    if (dep != null) {
      this.choices = this.choices
        .sort(function(a, b) {
          if ((a[1].toLowerCase() + "") < (b[1]
              .toLowerCase() + "")) {
            return -1;
          }
          if ((a[1].toLowerCase() + "") > (b[1]
              .toLowerCase() + "")) {
            return 1;
          }
          return 0;
        });
      for (var i = 0; i < this.choices.length - 1; i++) {
        if (this.choices[i][1] == this.choices[i + 1][1])
          i = this.amendLabel(i);
      }
    }
    this._fillSelect();
  },
  amendLabel: function(i) {
    var dupe = this.choices[i][1];
    while (i < this.choices.length && this.choices[i][1] == dupe) {
      var c = this.choices[i];
      c[1] = c[1] + " - " + c[0];
      i++;
    }
    return i - 1;
  }
});
var GlideFilterCurrency = Class.create(GlideFilterString, {
  initialize: function(tableName, item) {
    GlideFilterHandler.prototype.initialize.call(this, tableName, item);
  },
  _operOnChange: function() {
    var lastOp = this.lastOperator;
    this.lastOperator = this._getOperator();
    if ((fieldComparisonOperators.indexOf(lastOp) >= 0) != (fieldComparisonOperators.indexOf(this.lastOperator) >= 0)) {
      this.inputCnt = 0;
      this.input = [];
    }
    this.getValues();
    if (lastOp != 'BETWEEN' && this._getOperator() == 'BETWEEN') {
      this.values[2] = this.values[1];
      this.values[1] = '';
    }
    this._unescapeIfRequired();
    this._build();
  },
  _setup: function(values) {
    this.maxValues = 2;
    this.id = this.tr.tableField + "." + guid();
    this.listenForOperChange = true;
  },
  _build: function() {
    GlideFilterString.prototype._build.call(this);
    var s = this._addSelect(60, false, 1);
    this._getCurrencies(s);
  },
  _getCurrencies: function(s) {
    var currencies = new Array();
    if (currencies.length != 0)
      return currencies;
    var ajax = new GlideAjax("CurrencyConverter");
    ajax.addParam("sysparm_name", "getCurrencies");
    ajax.getXMLAnswer(this._getCurrenciesResponse.bind(this), null, s);
  },
  _getCurrenciesResponse: function(answer, s) {
    var values = answer;
    var currencies = values.split(",");
    var cache = this._getCache();
    cache.put("currencies", values);
    for (var i = 0; i < currencies.length; i++)
      addOption(s, currencies[i], currencies[i]);
    this.currency_widget = s;
    this._parseValue();
  },
  _resolveFromCache: function() {
    var cache = this._getCache();
    var value = cache.get("currencies");
    if (value)
      return value.split(",");
    return [];
  },
  _getCache: function() {
    if (typeof(g_cache_currency) != "undefined")
      return g_cache_currency;
    g_cache_currency = new GlideClientCache(1);
    return g_cache_currency;
  },
  _parseValue: function() {
    if (this.inputs.length == 0)
      return;
    var processSelect = false;
    for (var i = 0; i < this.inputs.length; i++) {
      var v = this.inputs[i].value;
      if (!v)
        continue;
      if (v.indexOf('javascript') < 0)
        continue;
      processSelect = true;
      var sa = v.split(';');
      var first = sa[0].split('\'');
      var currency = first[first.length - 1];
      var price = sa[sa.length - 1];
      var priceIndex = price.indexOf('\'');
      price = price.substring(0, priceIndex);
      this.inputs[i].value = price;
    }
    if (!processSelect)
      return;
    var sel = new Select(this.currency_widget);
    sel.selectValue(currency);
  },
  getValues: function() {
    if (this._isMappingEnabled)
      return this.getMappingValue();
    if (!this.currency_widget)
      return '';
    var v = GlideFilterString.prototype.getValues.call(this);
    var tn = this.item.table.tableName;
    var fn = this.item.name;
    var valList = v.split('@');
    var fromVal = 'javascript:global.getCurrencyFilter(\'' + tn + '\',\'' + fn + '\', \'' + this.currency_widget.value + ';' + valList[0] + '\')'
    if ((valList.length > 1 && this._getOperator() == 'BETWEEN') || (valList.length > 2))
      return fromVal + '@javascript:global.getCurrencyFilter(\'' + tn + '\',\'' + fn + '\', \'' + this.currency_widget.value + ';' + valList[1] + '\')'
    return fromVal;
  },
  destroy: function() {
    GlideFilterString.prototype.destroy.call(this);
    this.currency_widget = null;
  },
  z: null
});;
/*! RESOURCE: /scripts/classes/GlideDuration.js */
var GlideDuration = Class.create({
  MAX_UNIT_DAYS: 4,
  MAX_UNIT_HOURS: 3,
  MAX_UNIT_MINUTES: 2,
  MAX_UNIT_SECONDS: 1,
  initialize: function(value, item) {
    this.values = new Array();
    var gMessage = new GwtMessage();
    var values = ["Days", "Hours", "Minutes", "Seconds"];
    var answer = gMessage.getMessages(values);
    this.daysMessage = answer["Days"];
    this.hourMessage = answer["Hours"];
    this.minutesMessage = answer["Minutes"];
    this.secondsMessage = answer["Seconds"];
    this.maxLevel = this.MAX_UNIT_DAYS;
    if (item) {
      this.item = item;
      this.maxLevel = this._parseMaxUnit(this.item.getNamedAttribute('max_unit'));
    }
    if (value)
      this.values = GlideDuration.parseDurationToParts(value);
    for (var i = this.values.length; i < 4; i++)
      this.values[i] = "0";
  },
  buildHTML: function(parent) {
    this.parent = parent;
    this.days = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    if (this.maxLevel == this.MAX_UNIT_DAYS) {
      this._addSpan(this.daysMessage);
      this.days = this._addInput("dur_day", this.getDays());
      this.days.maxLength = "5";
      this.days.style.marginRight = "5px";
    } else
      this.hour = (this.getDays() * 24);
    if (this.maxLevel >= this.MAX_UNIT_HOURS) {
      this._addSpan(this.hourMessage);
      this.hour = this._addInput("dur_hour", this.hour + parseInt(this.getHours(), 10));
      if (this.maxLevel == this.MAX_UNIT_HOURS)
        this.hour.maxLength = "7";
      this._addSpan(":");
    } else
      this.minute = ((this.hour + parseInt(this.getHours(), 10)) * 60);
    if (this.maxLevel == this.MAX_UNIT_MINUTES)
      this._addSpan(this.minutesMessage);
    if (this.maxLevel >= this.MAX_UNIT_MINUTES) {
      this.minute = this._addInput("dur_min", this.minute + parseInt(this.getMinutes(), 10));
      if (this.maxLevel == this.MAX_UNIT_MINUTES)
        this.minute.maxLength = "9";
      this._addSpan(":");
    } else
      this.second = ((this.minute + parseInt(this.getMinutes(), 10)) * 60);
    if (this.maxLevel == this.MAX_UNIT_SECONDS)
      this._addSpan(this.secondsMessage);
    this.second = this._addInput("dur_sec", this.second + parseInt(this.getSeconds(), 10));
    if (this.maxLevel == this.MAX_UNIT_SECONDS)
      this.second.maxLength = "10";
  },
  _addInput: function(id, value) {
    var ic = cel("input", this.parent);
    ic.className = 'filerTableInput form-control';
    ic.id = id;
    ic.size = "2";
    ic.maxLength = "2";
    ic.value = value;
    return ic;
  },
  _addSpan: function(text) {
    var sp = cel("label", this.parent);
    sp.className = 'condition';
    sp.innerHTML = text;
  },
  getDays: function() {
    return this.values[0];
  },
  getHours: function() {
    return this.values[1];
  },
  getMinutes: function() {
    return this.values[2];
  },
  getSeconds: function() {
    return this.values[3];
  },
  getValue: function() {
    var day = 0;
    var hour = 0;
    var min = 0;
    var sec = 0;
    if (this.maxLevel == this.MAX_UNIT_DAYS)
      day = parseInt(this.days.value, 10);
    if (this.maxLevel >= this.MAX_UNIT_HOURS)
      hour = parseInt(this.hour.value, 10);
    if (this.maxLevel >= this.MAX_UNIT_MINUTES)
      min = parseInt(this.minute.value, 10);
    if (this.maxLevel >= this.MAX_UNIT_SECONDS)
      sec = parseInt(this.second.value, 10);
    if (sec >= 60) {
      min += Math.floor(sec / 60);
      sec = sec % 60;
    }
    if (min >= 60) {
      hour += Math.floor(min / 60);
      min = min % 60;
    }
    if (hour >= 24) {
      day += Math.floor(hour / 24);
      hour = hour % 24;
    }
    if (!day || day == null)
      day = 0;
    if (!hour || hour == null)
      hour = 0;
    if (!min || min == null)
      min = 0;
    if (!sec || sec == null)
      sec = 0;
    this.values[0] = day + '';
    this.values[1] = hour + '';
    this.values[2] = min + '';
    this.values[3] = sec + '';
    return day + " " + hour + ":" + min + ":" + sec;
  },
  _parseMaxUnit: function(max_unit) {
    switch (max_unit) {
      case 'hours':
        maxLevel = this.MAX_UNIT_HOURS;
        break;
      case 'minutes':
        maxLevel = this.MAX_UNIT_MINUTES;
        break;
      case 'seconds':
        maxLevel = this.MAX_UNIT_SECONDS;
        break;
      default:
        maxLevel = this.MAX_UNIT_DAYS;
    }
    return maxLevel;
  }
});
GlideDuration.parseDurationToParts = function(value) {
  var MS_IN_DAY = 86400000;
  if (value.indexOf("javascript:") == 0) {
    var s = value.split("'");
    value = s[1];
  }
  var parts = value.split(" ");
  if (parts.length == 2) {
    var times = parts[1].split(":");
    for (var i = 0; i < times.length; i++)
      parts[1 + i] = times[i];
    var dateParts = parts[0].split("-");
    if (dateParts.length == 3)
      parts[0] = parseInt(Date.parse(dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0] + ' 00:00:00 UTC')) / MS_IN_DAY;
  }
  return parts;
};
/*! RESOURCE: /scripts/classes/GlideFilterReference.js */
var GlideFilterReference = Class.create(GlideFilterHandler, {
  _setup: function(values) {
    this.maxValues = 1;
    this.tableField = this.tr.tableField;
    this.id = this.tableField + "." + guid();
    this.listenForOperChange = true;
    this.rightOperand = values;
  },
  _initValues: function(values) {
    this.values = [];
    if (values)
      this.values[0] = values;
  },
  _build: function() {
    clearNodes(this.tr.tdValue);
    var inDoctypeMode = (document.documentElement.getAttribute('data-doctype') == 'true');
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    var op = this._getOperator();
    var input = this._addTextInput("hidden");
    input.id = this.id;
    if (this._renderRightOperandAsFieldList(op)) {
      this._addSameAsLabels(this, op);
      this._populateRightOperandChoices();
      return;
    }
    if (this._renderDynamicOperandInput(op))
      return;
    input = this._addTextInput();
    input.id = "sys_display." + this.id;
    input.onfocus = this._onFocus.bind(this);
    input.onkeydown = this._onKeyDown.bindAsEventListener(this);
    input.onkeypress = this._onKeyPress.bindAsEventListener(this);
    input.onkeyup = this._onKeyUp.bindAsEventListener(this);
    input.autocomplete = "off";
    input.ac_columns = "";
    input.ac_order_by = "";
    if (inDoctypeMode) {
      input.setAttribute("class", "pull-left form-control filter-reference-input");
    }
    setAttributeValue(input, 'autocomplete', 'off');
    var displayValue = gel('fancy.' + this.values[0]);
    if (displayValue && displayValue.value != '')
      this.inputs[1].value = displayValue.value;
    else if (this.values) {
      this.inputs[1].value = this.values;
      this._resolveReference();
    }
    var view = $$("[name='sysparm_view']")[0];
    if (view && (view.value == "sys_ref_list"))
      return;
    if (inDoctypeMode) {
      var btn = cel("button");
      btn.setAttribute("class", "icon-search btn btn-default filerTableAction");
      btn.setAttribute("style", "margin-left: 2px");
      btn.onclick = this._refListOpen.bindAsEventListener(this);
      this.tr.tdValue.style.minWidth = "200px";
      this.tr.tdValue.appendChild(btn);
    } else {
      var image = createImage("images/reference_list.gifx", "Lookup using list", this, this._refListOpen);
      image.setAttribute("class", "filerTableAction");
      this.tr.tdValue.appendChild(image);
    }
  },
  _refListOpen: function() {
    var target = this.id;
    if (target.indexOf("IO:") > -1)
      target = target.substring(target.indexOf("IO:"), target.length);
    reflistOpen(target, this.item.getName(), this.item.getReference());
    return false;
  },
  getValues: function() {
    this._clearValues();
    if (this._isMappingEnabled)
      return this.getMappingValue();
    if (this._isEmptyOper())
      return '';
    var oper = this._getOperator();
    var input = this.inputs[0];
    if (this.inputCnt == 2) {
      var userInput = this.inputs[1];
      var userInputVal = userInput.value;
      if (userInputVal != null && (userInputVal.indexOf("javascript:") > -1))
        input = userInput;
      else if (this._useDisplayValue(oper))
        input = userInput;
      else if (this.item.getType() == 'glide_list' && oper == "DYNAMIC")
        input = userInput;
    }
    if (input) {
      return input.value;
    } else
      return '';
  },
  _useDisplayValue: function(oper) {
    return this.item.getType() != 'glide_list' && oper != '=' && oper != '!=' && oper != "CHANGESFROM" && oper != "CHANGESTO";
  },
  _resolveReference: function() {
    if (this.values[0]) {
      var ajax = new GlideAjax("ResolveRef");
      ajax.addParam("sysparm_name", this.tableField);
      ajax.addParam("sysparm_value", this.values[0]);
      ajax.getXML(this._resolveReferenceResponse.bind(this));
    }
  },
  _resolveReferenceResponse: function(request) {
    if (!request)
      return;
    var xml = request.responseXML;
    if (!xml)
      return;
    if (xml) {
      var items = xml.getElementsByTagName("item");
      if (items && items.length > 0 && items[0] && this.inputs[1])
        this.inputs[1].value = items[0].getAttribute("label");
    }
  },
  _onFocus: function(evt) {
    if (!this.inputs[1].ac) {
      var partialSearchFilterTypes = ',STARTSWITH,ENDSWITH,LIKE,NOT LIKE,';
      var tdOper = this.inputs[1].up(1).tdOper;
      var currentFilterType = (tdOper.firstElementChild || tdOper.children[0] || {}).value;
      if (partialSearchFilterTypes.indexOf(',' + currentFilterType + ',') > -1)
        this.inputs[1].setAttribute('is_filter_using_contains', 'true');
      this.inputs[1].ac = new AJAXReferenceCompleter(this.inputs[1], this.id, '');
      this.inputs[1].ac.elementName = this.tableField;
      this.inputs[1].ac.clearDerivedFields = true;
      this.inputs[1].ac.setIgnoreRefQual(true);
    }
  },
  _onKeyDown: function(evt) {
    return acReferenceKeyDown(this.inputs[1], evt);
  },
  _onKeyPress: function(evt) {
    return acReferenceKeyPress(this.inputs[1], evt);
  },
  _onKeyUp: function(evt) {
    return acReferenceKeyUp(this.inputs[1], evt);
  },
  z: null
});;
/*! RESOURCE: /scripts/classes/GlideFilterVariables.js */
var GlideFilterVariables = Class.create(GlideFilterHandler, {
  _setup: function(values) {
    this.maxValues = 1;
    this.id = this.tr.tableField + "." + guid();
    this.catID = "item_option_new.cat_item." + guid();
    this.listenForOperChange = true;
    this.rightOperand = values;
  },
  _initValues: function(values) {
    this.values = [];
    this.varValue = '';
    if (values) {
      this.values[0] = values.substring(0, 32);
      this.refQuery = values.substring(32);
      var query = new GlideEncodedQuery(this.tableName, "IO:" + this.values[0] + this.refQuery, null);
      query.parse();
      var terms = query.getTerms();
      var term = terms[0];
      this.varOp = term.getOperator();
      this.varValue = term.getValue();
    }
  },
  _build: function() {
    this.queryID = this.tr.tdValue.queryID;
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    this._hideOperators();
    var input = this._addTextInput("hidden");
    input.id = this.id;
    input = this._addTextInput();
    input.id = "sys_display." + this.id;
    input.onfocus = this._onFocus.bind(this);
    input.onRefPick = this._onFocus.bind(this);
    input.onkeydown = this._onKeyDown.bindAsEventListener(this);
    input.onkeypress = this._onKeyPress.bindAsEventListener(this);
    input.onkeyup = this._onKeyUp.bindAsEventListener(this);
    input.autocomplete = "off";
    input.data_completer = "AJAXTableCompleter";
    input.ac_columns = "cat_item;category";
    input.ac_order_by = "";
    input.placeholder = getMessage("Select Variable");
    setAttributeValue(input, 'autocomplete', 'off');
    var displayValue = gel('fancy.' + this.values[0]);
    if (displayValue && displayValue.value != '')
      this.inputs[1].value = displayValue.value;
    else if (this.values) {
      this.inputs[1].value = this.values;
      this._resolveReference();
    }
    if (document.documentElement.getAttribute('data-doctype') == 'true') {
      var btn = cel("button");
      btn.setAttribute("class", "icon-search btn btn-default filerTableAction");
      btn.onclick = this._refListOpen.bindAsEventListener(this);
      this.tr.tdValue.appendChild(btn);
    } else {
      var image = createImage("images/reference_list.gifx", "Lookup using list", this, this._refListOpen);
      image.setAttribute("class", "filerTableAction")
      this.tr.tdValue.appendChild(image);
    }
    this._buildCatItemReference();
    this._makeCatItemFirst();
    if (!this.values[0])
      return;
    this._getVariableType(this.values[0]);
  },
  _buildCatItemReference: function() {
    var queryID = this.queryID;
    td = this.tr.conditionRow.addTD(this.tr, queryID);
    td.nowrap = true;
    this.tr.catTD = td;
    var input = this._addTextInput("hidden", td);
    input.id = this.catID;
    input = this._addTextInput("", td);
    input.id = "sys_display." + this.catID;
    input.onfocus = this._onFocusCat.bind(this);
    input.onRefPick = this._onFocusCat.bind(this);
    input.onkeydown = this._onKeyDownCat.bindAsEventListener(this);
    input.onkeypress = this._onKeyPressCat.bindAsEventListener(this);
    input.onkeyup = this._onKeyUpCat.bindAsEventListener(this);
    input.autocomplete = "off";
    input.data_completer = "AJAXTableCompleter";
    input.ac_columns = "cat_item;category";
    input.ac_order_by = "";
    input.placeholder = getMessage("Select Item");
    setAttributeValue(input, 'autocomplete', 'off');
    if (document.documentElement.getAttribute('data-doctype') == 'true') {
      var btn = cel("button");
      btn.setAttribute("class", "icon-search btn btn-default filerTableAction");
      btn.onclick = this._refListOpenCat.bindAsEventListener(this);
      td.addClassName("form-inline");
      td.appendChild(btn);
    } else {
      var image = createImage("images/reference_list.gifx", "Lookup using list", this, this._refListOpenCat);
      image.setAttribute("class", "filerTableAction");
      td.appendChild(image);
    }
  },
  destroy: function() {
    this.inputCnt = 0;
    if (this.tr) {
      this.tr.tdValue.innerHTML = "";
      if (this.tr.variableID) {
        this.tr.removeChild(this.tr.variableID);
        this.tr.variableID = null;
      }
      if (this.tr.catTD) {
        this.tr.removeChild(this.tr.catTD);
        this.tr.catTD = null;
      }
      var td = this.tr.tdOper;
      if (td)
        td.style.display = "inline";
    }
    GlideFilterHandler.prototype.destroy.call(this);
  },
  setOriginalTable: function(tableName) {
    this.originalTableName = tableName;
  },
  _hideOperators: function() {
    if (this.tr.tdOper)
      this.tr.tdOper.style.display = "none";
  },
  _refListOpen: function() {
    if (this.values[2])
      reflistOpen(this.id, this.item.getName(), this.item.getReference(), "", false, "", "cat_item=" + this.variableRefQual);
    else
      reflistOpen(this.id, this.item.getName(), this.item.getReference());
    return false;
  },
  _refListOpenCat: function() {
    reflistOpen(this.catID, "cat_item", "sc_cat_item");
    return false;
  },
  getValues: function() {
    this._clearValues();
    if (this._isMappingEnabled)
      return this.getMappingValue();
    var oper = this._getOperator();
    var input = this.inputs[0];
    if (input) {
      return input.value;
    } else
      return '';
  },
  getFilterText: function(oper) {
    if (!this.variableFilter)
      return '';
    return "variables." + this.getValues() + oper + this.variableFilter.getValues();
  },
  _useDisplayValue: function(oper) {
    return this.item.getType() != 'glide_list' && oper != '=' && oper != '!=' && oper != "CHANGESFROM" && oper != "CHANGESTO";
  },
  _resolveReference: function() {
    if (this.values[0]) {
      var ajax = new GlideAjax("ResolveRef");
      ajax.addParam("sysparm_name", this.tr.tableField);
      ajax.addParam("sysparm_value", this.values[0]);
      ajax.getXML(this._resolveReferenceResponse.bind(this));
    }
  },
  _resolveReferenceResponse: function(request) {
    if (!request)
      return;
    var xml = request.responseXML;
    if (!xml)
      return;
    if (xml) {
      var items = xml.getElementsByTagName("item");
      if (items && items.length > 0 && items[0] && this.inputs[1])
        this.inputs[1].value = items[0].getAttribute("label");
    }
  },
  _resolveReferenceCat: function() {
    if (this.values[2]) {
      var ajax = new GlideAjax("ResolveRef");
      ajax.addParam("sysparm_name", "item_option_new.cat_item");
      ajax.addParam("sysparm_value", this.values[2]);
      ajax.getXML(this._resolveReferenceResponseCat.bind(this));
    }
  },
  _resolveReferenceResponseCat: function(request) {
    if (!request)
      return;
    var xml = request.responseXML;
    if (!xml)
      return;
    if (xml) {
      var items = xml.getElementsByTagName("item");
      if (items && items.length > 0 && items[0]) {
        this.inputs[3].value = items[0].getAttribute("label");
        this.values[3] = this.inputs[3].value;
      }
    }
  },
  _onFocus: function(evt) {
    if (!this.inputs[1].ac) {
      this.inputs[1].ac = new AJAXTableCompleter(this.inputs[1], this.id, '');
      this.inputs[1].ac.setFilterCallBack(this._refValueChange.bind(this));
      this.inputs[1].ac.elementName = this.tr.tableField;
      this.inputs[1].ac.setAdditionalValue("ac_columns", "cat_item;category");
      if (this.values[2])
        this.inputs[1].ac.setAdditionalValue("sysparm_ref_qual", "cat_item=" + this.variableRefQual);
      else
        this.inputs[1].ac.setAdditionalValue("sysparm_ref_qual", "");
      this.inputs[1].ac.clearDerivedFields = true;
    }
  },
  _refValueChange: function() {
    var ref = this.inputs[1].ac;
    var e = ref.getKeyElement();
    var id = e.value;
    this._clearQuery();
    this.values[0] = id;
    if (id)
      this._getVariableType(id);
  },
  _catValueSet: function(catValue) {
    if (this.values[2] == catValue)
      return;
    this.values[2] = catValue;
    this.variableRefQual = catValue;
    this.values[3] = catValue;
    this._resolveReferenceCat();
    this._setQualifier(this.inputs[1].ac, this.values[2]);
  },
  _refValueChangeCat: function() {
    var ref = this.inputs[3].ac;
    var e = ref.getKeyElement();
    var id = e.value;
    this.values[2] = id;
    this.variableRefQual = id;
    this._clearVariable();
    this._hideOperators();
    this._clearHandler();
    this._filterVariableReference();
  },
  _clearVariable: function() {
    var e = gel(this.id);
    if (e)
      e.value = '';
    e = gel("sys_display." + this.id);
    if (e)
      e.value = '';
  },
  _clearHandler: function() {
    if (!this.vType)
      return;
    this.variableFilter = this._getHandler();
    var conditionRow = this.tr.conditionRow;
    var td = this.tr.tdOper;
    if (td)
      this.tr.removeChild(td);
    this.tr.tdOper = null;
    if (this.tr.tdValue && this.tr.variableID) {
      this.tr.removeChild(this.tr.tdValue);
      this.tr.tdValue = null;
    }
  },
  _filterVariableReference: function() {
    this._onFocus();
    if (this.values[2])
      this._setQualifier(this.inputs[1].ac, this.values[2]);
    else
      this.inputs[1].ac.setAdditionalValue("sysparm_ref_qual", "");
    this._clearQuery();
  },
  _setQualifier: function(ac, catItem) {
    if (ac)
      ac.setAdditionalValue("sysparm_ref_qual", "cat_item=" + catItem);
    this._addVariableSets(ac, catItem);
  },
  _addVariableSets: function(ac, catItem) {
    var sets = new GlideRecord('io_set_item');
    var callback = this._getSetResponse.bind(this, ac, catItem, sets)
    var fn = function(gr) {
      callback(ac, catItem, sets);
    };
    sets.query('sc_cat_item', catItem, fn);
  },
  _getSetResponse: function(ac, catItem, sets) {
    if (!sets.hasNext())
      return;
    var setList = new Array();
    while (sets.next())
      setList.push(sets.variable_set + '');
    this.variableRefQual = catItem + "^OR" + "variable_setIN" + setList.join(",");
    if (ac)
      ac.setAdditionalValue("sysparm_ref_qual", "cat_item=" + this.variableRefQual);
  },
  _clearQuery: function() {
    this.values[0] = "";
    this.refQuery = ""
    this.varOp = ""
    this.varValue = ""
  },
  _getVariableType: function(id) {
    this.grVariable = new GlideRecord('item_option_new');
    var callback = this._getVariableResponse.bind(this)
    var fn = function(gr) {
      callback();
    };
    this.grVariable.query('sys_id', id, fn);
  },
  _getVariableResponse: function() {
    if (!this.grVariable.next()) {
      this.grVariable = null;
      this._buildStringType();
    } else
      this._buildType(this.grVariable);
    this._setFilterBasedOnType();
    if (this.grVariable && this.grVariable.cat_item)
      this._catValueSet(this.grVariable.cat_item);
  },
  _buildStringType: function() {
    this.vItem = new TableElement("string", "String");
    this.vItem.setType("string");
  },
  _setFilterBasedOnType: function() {
    this.variableFilter = this._getHandler();
    var conditionRow = this.tr.conditionRow;
    var td = this.tr.tdOper;
    if (td)
      this.tr.removeChild(td);
    td = conditionRow.addTD(this.tr, this.queryID);
    conditionRow.tdOper = td;
    td.id = "oper";
    this.tr.tdOper = td;
    td.style.width = "99px";
    if (!this.tr.variableID) {
      this.tr.tdValue.id = "variableid";
      this.tr.variableID = this.tr.tdValue;
      this.tr.tdValue = null;
    }
    if (this.tr.tdValue)
      this.tr.removeChild(this.tr.tdValue);
    td = conditionRow.addTD(this.tr, this.queryID);
    conditionRow.tdValue = td;
    td.id = "value";
    td.noWrap = true;
    this.tr.tdValue = td;
    this._moveButtons();
    var operSel = addOperators(this.tr.tdOper, this.vType, this.varOp, this.isChoice, false, false);
    this.tr.operSel = operSel;
    var tid = this.tr.tableField;
    this.tr.tableField = "IO:" + this.values[0];
    this.variableFilter.create(this.tr, this.varValue);
    this.tr.tableField = tid;
  },
  _makeCatItemFirst: function() {
    var td = this.tr.tdValue;
    this.tr.removeChild(td);
    this.tr.appendChild(td);
    this._moveButtons();
  },
  _moveButtons: function() {
    var td = this.tr.tdOrButton;
    this.tr.removeChild(td);
    this.tr.appendChild(td);
    td = this.tr.tdRemoveButton;
    this.tr.removeChild(td);
    this.tr.appendChild(td);
  },
  _buildType: function(gr) {
    this.vItem = new TableElement(gr.type, gr.type);
    if (gr.type == "1")
      this.vItem.setType("boolean");
    else if (gr.type == "8") {
      this.vItem.setType("reference");
      this.vItem.setReference(gr.reference);
    } else if (gr.type == "10") {
      this.vItem.setType("calendar");
    } else if (gr.type == "7") {
      this.vItem.setType("checkbox");
    } else if (gr.type == "18" || gr.type == "22" || gr.type == "3") {
      this.vItem.setType("multiple_choice");
    } else if (gr.type == "5") {
      this.vItem.setType("select");
    } else if (gr.type == "4") {
      this.vItem.setType("numeric_scale");
    } else if (gr.type == "9") {
      this.vItem.setType("calendar");
    } else
      this._buildStringType();
  },
  _getHandler: function() {
    if (this.vItem.type == "boolean") {
      this.vType = "boolean";
      var handler = new GlideFilterChoice(this.tableName, this.item);
      handler.setChoices(sysvalues["catalog_boolean"]);
      return handler;
    }
    if (this.vItem.type == "checkbox") {
      this.vType = "boolean";
      var handler = new GlideFilterChoice(this.tableName, this.item);
      handler.setChoices(sysvalues["boolean"]);
      return handler;
    }
    if (this.vItem.type == "multiple_choice") {
      this.vType = "referencechoice";
      var handler = new GlideFilterVariablesChoiceDynamic("var.IO:" + this.values[0], this.item);
      return handler;
    }
    if (this.vItem.type == "select") {
      this.vType = "referencechoice";
      var handler = new GlideFilterVariablesChoiceDynamic("var.IO:" + this.values[0], this.item);
      return handler;
    }
    if (this.vItem.type == "numeric_scale") {
      this.vType = "integer";
      this.isChoice = true;
      var handler = new GlideFilterVariablesChoiceDynamic("var.IO:" + this.values[0], this.item);
      return handler;
    }
    if (this.vItem.type == "reference") {
      this.vType = "referencevariable";
      var handler = new GlideFilterReference("var.IO:" + this.values[0], this.vItem);
      return handler;
    }
    if (this.vItem.type == "calendar") {
      this.vType = "calendar";
      var handler = new GlideFilterDate(this.tableName, this.vItem);
      return handler;
    }
    this.vType = "string";
    return new GlideFilterString(this.tableName, this.item);
  },
  _onKeyDown: function(evt) {
    return acReferenceKeyDown(this.inputs[1], evt);
  },
  _onKeyPress: function(evt) {
    return acReferenceKeyPress(this.inputs[1], evt);
  },
  _onKeyUp: function(evt) {
    return acReferenceKeyUp(this.inputs[1], evt);
  },
  _onKeyDownCat: function(evt) {
    return acReferenceKeyDown(this.inputs[3], evt);
  },
  _onKeyPressCat: function(evt) {
    return acReferenceKeyPress(this.inputs[3], evt);
  },
  _onKeyUpCat: function(evt) {
    return acReferenceKeyUp(this.inputs[3], evt);
  },
  _onFocusCat: function(evt) {
    if (!this.inputs[3].ac) {
      this.inputs[3].ac = new AJAXTableCompleter(this.inputs[3], this.catID, '');
      this.inputs[3].ac.setFilterCallBack(this._refValueChangeCat.bind(this));
      this.inputs[3].ac.elementName = "item_option_new.cat_item";
      this.inputs[3].ac.setAdditionalValue("ac_columns", "short_description;category");
      this.inputs[3].ac.setAdditionalValue("sysparm_ref_qual", "active=true");
      this.inputs[3].ac.clearDerivedFields = true;
    }
  },
  z: null
});
var GlideFilterVariablesChoiceDynamic = Class.create(GlideFilterChoiceDynamic, {
  _getChoices: function() {
    var ajax = new GlideAjax('PickList');
    ajax.addParam('sysparm_chars', '*');
    ajax.addParam('sysparm_nomax', 'true');
    ajax.addParam('sysparm_name', this.tableName);
    var response = ajax.getXMLWait();
    this._addChoices(response);
  }
});;
/*! RESOURCE: /scripts/classes/GlideFilterQuestions.js */
var GlideFilterQuestions = Class.create(GlideFilterVariables, {
  getFilterText: function(oper) {
    if (!this.variableFilter)
      return '';
    return "variablesHASQUESTION:" + this.getValues() + oper + this.variableFilter.getValues();
  },
  _refListOpenCat: function() {
    reflistOpen(this.catID, "cat_item", "sc_cat_item_producer");
    return false;
  },
  _onFocusCat: function(evt) {
    if (!this.inputs[3].ac) {
      this.inputs[3].ac = new AJAXTableCompleter(this.inputs[3], this.catID, '');
      this.inputs[3].ac.setFilterCallBack(this._refValueChangeCat.bind(this));
      this.inputs[3].ac.elementName = "item_option_new.cat_item";
      this.inputs[3].ac.setAdditionalValue("ac_columns", "short_description;category");
      this.inputs[3].ac.setAdditionalValue("sysparm_ref_qual", "active=true^sys_class_name=sc_cat_item_producer");
      this.inputs[3].ac.clearDerivedFields = true;
    }
  },
  z: null
});;
/*! RESOURCE: /scripts/classes/GlideFilterItemVariables.js */
var GlideFilterItemVariables = Class.create(GlideFilterVariables, {
  getFilterText: function(oper) {
    if (!this.variableFilter)
      return '';
    return "variablesHASITEMVARIABLE:" + this.getValues() + oper + this.variableFilter.getValues();
  },
  z: null
});;
/*! RESOURCE: /scripts/classes/GlideFilterVariableMap.js */
var GlideFilterVariableMap = Class.create(GlideFilterHandler, {
  _setup: function(values) {
    this.maxValues = 1;
    this.id = this.tr.tableField + "." + guid();
    this.selectedOption = values;
    this.usedFields = {};
    this.varTypes = {
      1: ['string']
    };
  },
  _build: function() {
    this.queryID = this.tr.tdValue.queryID;
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    this._hideOperators();
    this.select = this._addSelect(380, false, 1);
    this.select.onchange = this._updateFields.bind(this);
    var displayValue = gel('fancy.' + this.values[0]);
    if (displayValue && displayValue.value != '')
      this.select.value = displayValue.value;
    else if (this.values) {
      this.select.value = this.values;
    }
    this._buildVariableSelect();
    $(this.select).addClassName('filter_type');
    var $select = $j(this.select);
    if (!$select.data('select2'))
      $select.select2();
  },
  _buildVariableSelect: function() {
    if (this.values.length == 0 || this.values == '-- value --')
      addOption(this.select, this.values, getMessage("-- Select Variable --"), true);
    if (this.item == null)
      return;
    var arr = g_dynamic_filter_variable_options.split("##");
    for (var i = 0; i < arr.length; i++) {
      var aItem = arr[i];
      if (aItem.length == 0)
        continue;
      var aItemArr = aItem.split("::");
      if (aItemArr.length < 3)
        continue;
      var arrInput = [];
      arrInput.push(aItemArr[1]);
      var translated = getMessages(arrInput);
      addOption(this.select, aItemArr[0], translated[aItemArr[1]], this.selectedOption == aItemArr[0]);
    }
  },
  _hideOperators: function() {
    if (this.tr.tdOper)
      this.tr.tdOper.style.display = "none";
  },
  getValues: function() {
    this._clearValues();
    if (this._isMappingEnabled)
      return this.getMappingValue();
    var oper = this._getOperator();
    var input = this.inputs[0];
    if (input) {
      return input.value;
    } else
      return '';
  },
  _updateFields: function() {},
  _clearFieldUsed: function(name, condition) {
    this.usedFields[name] = false;
  },
  _buildType: function(gr) {
    this.vItem = new TableElement(gr.type, gr.type);
    if (gr.type == "1")
      this.vItem.setType("boolean");
    else if (gr.type == "8") {
      this.vItem.setType("reference");
      this.vItem.setReference(gr.reference);
    } else if (gr.type == "10") {
      this.vItem.setType("calendar");
    } else if (gr.type == "7") {
      this.vItem.setType("checkbox");
    } else if (gr.type == "18" || gr.type == "22" || gr.type == "3") {
      this.vItem.setType("multiple_choice");
    } else if (gr.type == "5") {
      this.vItem.setType("select");
    } else if (gr.type == "4") {
      this.vItem.setType("numeric_scale");
    } else if (gr.type == "9") {
      this.vItem.setType("calendar");
    }
  },
  z: null
});;
/*! RESOURCE: /scripts/classes/GlideFilterLabels.js */
var GlideFilterLabels = Class.create(GlideFilterHandler, {
  _setup: function(values) {
    this.maxValues = 1;
    this.id = this.tr.tableField + "." + guid();
    this.labID = "label_entry.label." + guid();
    this.listenForOperChange = true;
    this.rightOperand = values;
  },
  _initValues: function(values) {
    this.values = [];
    this.varValue = '';
    if (values) {
      this.values[0] = values.substring(0, 32);
      this.refQuery = values.substring(32);
      this.varValue = this.refQuery;
    }
  },
  _build: function() {
    this.queryID = this.tr.tdValue.queryID;
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    this._hideOperators();
    var inDoctypeMode = (document.documentElement.getAttribute('data-doctype') == 'true');
    var input = this._addTextInput("hidden");
    input.id = this.labID;
    input = this._addTextInput();
    input.id = "sys_display." + this.labID;
    input.onfocus = this._onFocus.bind(this);
    input.onRefPick = this._onFocus.bind(this);
    input.onkeydown = this._onKeyDown.bindAsEventListener(this);
    input.onkeypress = this._onKeyPress.bindAsEventListener(this);
    input.onkeyup = this._onKeyUp.bindAsEventListener(this);
    input.autocomplete = "off";
    input.data_completer = "AJAXTableCompleter";
    input.ac_columns = "short_description";
    input.ac_order_by = "";
    input.placeholder = getMessage("Select Label");
    setAttributeValue(input, 'autocomplete', 'off');
    var displayValue = gel('fancy.' + this.values[0]);
    if (displayValue && displayValue.value != '')
      this.inputs[1].value = displayValue.value;
    else if (this.values) {
      this.inputs[1].value = this.values;
      this._resolveReference();
    }
    if (inDoctypeMode) {
      var btn = cel("button");
      btn.setAttribute("class", "icon-search btn btn-default filerTableAction");
      btn.setAttribute("style", "margin-left: 2px");
      btn.onclick = this._refListOpen.bindAsEventListener(this);
      this.tr.tdValue.appendChild(btn);
    } else {
      var image = createImage("images/reference_list.gifx", "Lookup using list", this, this._refListOpen);
      image.setAttribute("class", "filerTableAction")
      this.tr.tdValue.appendChild(image);
    }
    if (!this.varValue)
      return;
    this._getVariableType(this.values[0]);
  },
  destroy: function() {
    this.inputCnt = 0;
    if (this.tr) {
      this.tr.tdValue.innerHTML = "";
      if (this.tr.variableID) {
        this.tr.removeChild(this.tr.variableID);
        this.tr.variableID = null;
      }
      var td = this.tr.tdOper;
      if (td)
        td.style.display = "block";
    }
    GlideFilterHandler.prototype.destroy.call(this);
  },
  setOriginalTable: function(tableName) {
    this.originalTableName = tableName;
  },
  _hideOperators: function() {
    if (this.tr.tdOper)
      this.tr.tdOper.style.display = "none";
  },
  _refListOpen: function() {
    reflistOpen(this.labID, this.item.getName(), "label");
    return false;
  },
  getValues: function() {
    this._clearValues();
    if (this._isMappingEnabled)
      return this.getMappingValue();
    if (this._isEmptyOper())
      return '';
    var oper = this._getOperator();
    var input = this.inputs[0];
    if (input) {
      return input.value;
    } else
      return '';
  },
  getFilterText: function(oper) {
    return "sys_tags." + this.getValues() + '=' + this.getValues();
  },
  _useDisplayValue: function(oper) {
    return this.item.getType() != 'glide_list' && oper != '=' && oper != '!=' && oper != "CHANGESFROM" && oper != "CHANGESTO";
  },
  _resolveReference: function() {
    if (this.values[0]) {
      var ajax = new GlideAjax("ResolveRef");
      ajax.addParam("sysparm_name", "label_entry.label");
      ajax.addParam("sysparm_value", this.values[0]);
      ajax.getXML(this._resolveReferenceResponse.bind(this));
    }
  },
  _resolveReferenceResponse: function(request) {
    if (!request)
      return;
    var xml = request.responseXML;
    if (!xml)
      return;
    if (xml) {
      var items = xml.getElementsByTagName("item");
      if (items && items.length > 0 && items[0] && this.inputs[1])
        this.inputs[1].value = items[0].getAttribute("label");
    }
  },
  _onFocus: function(evt) {
    if (!this.inputs[1].ac) {
      this.inputs[1].ac = new AJAXTableCompleter(this.inputs[1], this.labID, '');
      this.inputs[1].ac.setFilterCallBack(this._refValueChange.bind(this));
      this.inputs[1].ac.elementName = "label_entry.label";
      this.inputs[1].ac.setAdditionalValue("ac_columns", "short_description");
      this.inputs[1].ac.clearDerivedFields = true;
    }
  },
  _refValueChange: function() {
    var ref = this.inputs[1].ac;
    var e = ref.getKeyElement();
    var id = e.value;
    this.values[0] = id;
  },
  _moveButtons: function() {
    var td = this.tr.tdOrButton;
    this.tr.removeChild(td);
    this.tr.appendChild(td);
    td = this.tr.tdRemoveButton;
    this.tr.removeChild(td);
    this.tr.appendChild(td);
  },
  _onKeyDown: function(evt) {
    return acReferenceKeyDown(this.inputs[1], evt);
  },
  _onKeyPress: function(evt) {
    return acReferenceKeyPress(this.inputs[1], evt);
  },
  _onKeyUp: function(evt) {
    return acReferenceKeyUp(this.inputs[1], evt);
  },
  _onKeyDownCat: function(evt) {
    return acReferenceKeyDown(this.inputs[3], evt);
  },
  z: null
});;
/*! RESOURCE: /scripts/classes/GlideFilterReferenceMulti.js */
var GlideFilterReferenceMulti = Class.create(GlideFilterReference, {
  _setup: function(values) {
    this.maxValues = 20;
    this.id = this.tr.tableField + "." + guid();
    this.listenForOperChange = true;
  },
  _initAutoCompleter: function() {
    if (!this.inputs[1].ac) {
      if (this.item.getReference("reference") == "sys_user") {
        $(this.inputs[1]).setAttribute('allow_invalid', true)
        $(this.inputs[1]).setAttribute('reference', "sys_user");
      }
      this.inputs[1].ac = new AJAXReferenceCompleterMulti(this.inputs[1], this.id, '');
      this.inputs[1].ac.elementName = this.tr.tableField;
      this.inputs[1].ac.clearDerivedFields = true;
    }
  },
  _onFocus: function(evt) {
    this._initAutoCompleter();
  },
  _resolveReference: function() {
    if (this.values) {
      var ajax = new GlideAjax("ResolveRefMulti");
      ajax.addParam("sysparm_name", this.tr.tableField);
      ajax.addParam("sysparm_value", this.values);
      ajax.getXML(this._resolveReferenceResponse.bind(this));
    }
  },
  _resolveReferenceResponse: function(request) {
    if (!request)
      return;
    var xml = request.responseXML;
    if (!xml)
      return;
    if (xml) {
      var items = xml.getElementsByTagName("item");
      if (items && items.length > 0) {
        this._initAutoCompleter();
        this.inputs[1].ac._hash = new Hash();
        for (var i = 0; i < items.length; i++) {
          this.inputs[1].ac._hash.set(items[i].getAttribute("label"), items[i].getAttribute("name"));
        }
        this.inputs[1].ac._setFormValues();
      }
    }
  },
  getValues: function() {
    this._initAutoCompleter();
    return this.inputs[1].ac.getKeyValue();
  },
  _initValues: function(values) {
    if (!values)
      this.values = [];
    else
      this.values = values;
  }
});;
/*! RESOURCE: /scripts/classes/GlideFilterDate.js */
var GlideFilterDate = Class.create(GlideFilterHandler, {
  SYS_DATE_FORMAT: "yyyy-MM-dd",
  SYS_TIME_FORMAT: "HH:mm:ss",
  SYS_DATE_TIME_FORMAT: "yyyy-MM-dd HH:mm:ss",
  _setup: function(values) {
    this.maxValues = 4;
    this.listenForOperChange = true;
    this.userDateFormat = g_user_date_format;
    this.userTimeFormat = g_user_date_time_format.substring(g_user_date_format.length + 1);
    this.userDateTimeFormat = g_user_date_time_format;
    this.id = "GwtGFD_" + guid();
    this.allowTime = this.item.isDateTime();
  },
  _build: function() {
    this.ANDMSG = getMessage('and');
    this.FROMMSG = getMessage('from');
    this.ASMSG = getMessage('as');
    clearNodes(this.tr.tdValue);
    this.inputCnt = 0;
    if (this._isEmptyOper()) {
      this._addInvisibleTextInput();
      return;
    }
    var oper = this._getOperator();
    if (this.prevOper && (this.prevOper != oper))
      this._clearValues();
    switch (oper) {
      case 'SAMEAS':
      case 'NSAMEAS':
        if (this.getFilterClass() != "GlideTemplateFilter") {
          this._addDateSelect(this.id, sysvalues['calendar']['TRENDVALUES_WITH_FIELDS'], this.values[1], [1]);
          var span = cel("span", this.tr.tdValue);
          span.style.marginLeft = "3px";
          span.style.marginRight = "5px";
          if (oper == 'SAMEAS')
            span.innerHTML = this.ASMSG;
          else
            span.innerHTML = this.FROMMSG;
        }
        this._populateRightOperandChoices();
        break;
      case '=':
        var input = this._addCalendar(this.id);
        this.inputs = [input];
        input.type = "text";
        input.value = (this.values[0].indexOf("{{") !== -1 ? "" : this.values[0]);
        input.id = this.id + "_input_1";
        input.allowTime = this.allowTime
        this.inputCnt = 1;
        break;
      case '!=':
      case 'ON':
      case 'NOTON':
        var val = this.values[0];
        if (val)
          val += "@" + this.values[1] + "@" + this.values[2];
        this._addDateChoices(this.id, val, [0, 1, 2], false);
        break;
      case '<':
      case '>=':
        var pos = 1;
        this._addDateChoices(this.id, this.values[0], [pos], this.allowTime, 'start');
        break;
      case '>':
      case '<=':
        var pos = 3;
        this._addDateChoices(this.id, this.values[0], [pos], this.allowTime, 'end');
        break;
      case 'BETWEEN':
        this._addDateChoices(this.id, this.values[0], [1], this.allowTime, 'start');
        var span = cel("span", this.tr.tdValue);
        span.style.marginLeft = "3px";
        span.style.marginRight = "5px";
        span.className = "filter-inline-label";
        span.innerHTML = this.ANDMSG;
        this._addDateChoices(this.id + "_2", this.values[1], [3], this.allowTime, 'end');
        this.initBetweenMapping(this.values[0], this.values[1]);
        break;
      case 'DATEPART':
        var trendOper = "EE";
        if (this.values[1]) {
          var parts = this.values[1].split(",");
          if (parts.length == 3)
            trendOper = parts[2].substring(1, 3);
        }
        this._addDateSelect(this.id, sysvalues['calendar']['RELATIVE'], trendOper, [1]);
        this._addDateSelect(this.id + "_2", sysvalues['calendar']['DATEPART'], this.values[0], [0]);
        break;
      case 'RELATIVE':
        this._addDateSelect("1", sysvalues['calendar']['RELATIVE'], this.values[0], [1]);
        var input = this._addTextInput();
        input.value = this.values[3];
        input.style.width = "30px";
        input.maxLength = 5;
        this._addDateSelect(this.id + "_2", sysvalues['calendar']['TRENDVALUES'], this.values[1], [1]);
        this._addDateSelect(this.id + "_3", sysvalues['calendar']['WHEN'], this.values[2], [1]);
        break;
      case 'MORETHAN':
      case 'LESSTHAN':
        var input = this._addTextInput();
        if (null == this.values[3] || "" == this.values[3])
          this.values[3] = 0;
        if (isMSIE)
          input.style.marginTop = "-1px";
        input.value = this.values[3];
        input.style.width = "30px";
        input.style.marginRight = "2px";
        input.maxLength = 2;
        this._addDateSelect(this.id + "_2", sysvalues['calendar']['TRENDVALUES_WITH_FIELDS_PLURAL'], this.values[1], [1]);
        this._addDateSelect(this.id + "_3", sysvalues['calendar']['WHEN_WITH_FIELDS'], this.values[2], [1]);
        this._populateRightOperandChoices();
        break;
      case 'SINCE':
        var s = this._addSelect(this.width, this.multi, this.size);
        s.style.marginRight = "3px";
        s.id = this.id + "_select_1";
        var base = new GlideRecord('cmdb_baseline');
        base.addOrderBy('name');
        base.query();
        while (base.next()) {
          var selected = false;
          var value = "javascript:getBaseFilter('" + base.name + "')";
          if (value == this.values[0])
            selected = true;
          var o = addOption(s, value, base.name, selected);
        }
        break;
      case 'ANYTHING':
        break;
    }
    this.prevOper = oper;
    if (notOneOf('BETWEEN ANYTHING RELATIVE SINCE MORETHAN LESSTHAN SAMEAS NSAMEAS DATEPART')) {
      this.initAlphaMapping(this.values[0]);
    }

    function notOneOf(str) {
      return str.split(' ').indexOf(oper) == -1;
    }
  },
  getValues: function() {
    if (this.inputCnt == 0)
      return "";
    for (var i = 0; i < this.maxValues; i++)
      this.values[i] = this._getInputValue(this.inputs[i]);
    if (this.supportsMapping) {
      if (this._getOperator() == 'BETWEEN') {
        var $td = $j(this.tr.tdValue);
        var $in1 = $td.find('#em_input_1');
        var $in2 = $td.find('#em_input_2');
        if ($in1.val() || $in2.val()) {
          return (
            ($in1.val() || this._getDateGenerate(this._convertDate(this.values[0]), 'start')) +
            "@" +
            ($in2.val() || this._getDateGenerate(this._convertDate(this.values[1]), 'end'))
          );
        }
      } else {
        var gemVal = $j(this.tr.tdValue).find('#em_input_1').val();
        if (gemVal) {
          return gemVal;
        }
      }
    }
    switch (this._getOperator()) {
      case 'ON':
      case 'NOTON':
        if (this.values[0].indexOf('@') != -1)
          return this.values[0];
        var value = this._convertDate(this.values[0]);
        return value + "@" + this._getDateGenerate(value, 'start') + "@" + this._getDateGenerate(value, 'end');
      case '<':
      case '<=':
        var value = this._convertDate(this.values[0]);
        return this._getDateGenerate(value, 'start');
      case '>':
      case '>=':
        var value = this._convertDate(this.values[0]);
        return this._getDateGenerate(value, 'end');
      case 'BETWEEN':
        var start = this._convertDate(this.values[0]);
        start = this._getDateGenerate(start, 'start');
        var end = this._convertDate(this.values[1]);
        end = this._getDateGenerate(end, 'end');
        return start + "@" + end;
      case 'DATEPART':
        var trendOper = this.values[0];
        var datePart = this.values[1];
        var values = sysvalues['calendar']['DATEPART'];
        for (var i = 0; i < values.length; i++) {
          if (datePart == values[i][0]) {
            datePart = values[i][1];
            break;
          }
        }
        datePart = datePart.split(")")[0] + ",'" + trendOper + "')";
        return this.values[1] + "@" + datePart;
        break;
      case '=':
      case '!=':
        return this.values[0];
        break;
      case 'RELATIVE':
        return this.values[0] + "@" + this.values[2] + "@" + this.values[3] + "@" + this.values[1];
        break;
      case 'SAMEAS':
      case 'NSAMEAS':
        if (this.values[1] == "")
          return this.values[0];
        return this.values[1] + "@" + this.values[0];
        break;
      case 'MORETHAN':
      case 'LESSTHAN':
        if (isNaN(this.values[0]))
          this.values[0] = 0;
        return this.values[3] + "@" + this.values[1] + "@" + this.values[2] + "@" + this.values[0];
        break;
      case 'SINCE':
        return this.values[0];
        break;
      case 'ANYTHING':
        return "";
        break;
      default:
        if (this.inputCnt == 1)
          return this.values[0];
        else
          return this.values.join("@");
    }
  },
  _addDateSelect: function(id, values, matchValue, positions, dynamicOptions) {
    var s = this._addSelect(this.width, this.multi, this.size);
    s.style.marginRight = "3px";
    s.id = this.id + "_select_" + id;
    this._addDateSelectOptions(s, values, matchValue, positions);
    if (dynamicOptions)
      this._addDateSelectOptions(s, dynamicOptions, matchValue, positions);
    return s;
  },
  _addDateSelectOptions: function(select, values, matchValue, positions) {
    if (!values)
      return;
    var map = getMessages(buildMap(values, 0));
    var previousValue = null;
    for (var i = 0; i < values.length; i++) {
      var option = values[i];
      var value = "";
      for (var pos = 0; pos < positions.length; pos++) {
        if (pos > 0)
          value += "@";
        value += option[positions[pos]];
      }
      if (previousValue == null || previousValue != value)
        addOption(select, value, map[option[0]], value == matchValue);
      previousValue = value;
    }
  },
  _addDateChoices: function(id, matchValue, positions, allowTime, defaultTime) {
    var dynamicOptions = this._getDynamicCalendarOption();
    var select = this._addDateSelect(id, sysvalues['calendar'], matchValue, positions, dynamicOptions);
    this._addDatePicker(id, select, matchValue, allowTime, defaultTime);
  },
  _getDynamicCalendarOption: function() {
    if (typeof g_dynamic_filter_options_calendar == 'undefined' || g_dynamic_filter_options_calendar == '')
      return [];
    var dynamicOptions = [];
    var items = g_dynamic_filter_options_calendar.split('##');
    for (var i = 0; i < items.length; i++) {
      if (items[i].length <= 0)
        continue;
      var option = items[i].split('::');
      dynamicOptions.push(option);
    }
    return dynamicOptions;
  },
  _addDatePicker: function(id, select, value, allowTime, defaultTime) {
    var found = (select.selectedIndex != -1);
    if ((select.selectedIndex == 0) && (value) && (value != select.options[0].value))
      found = false;
    if (!found) {
      value = this._getDateFromValue(value);
      addOption(select, value, value, true);
    }
    select.allowTime = allowTime;
    select.defaultTime = defaultTime;
    this._addCalendar(id);
  },
  _addCalendar: function(id) {
    var chooseDate = getMessage('Choose date...');
    if (document.documentElement.getAttribute('data-doctype') == 'true') {
      var input = addTextInput(this.tr.tdValue, "", "hidden");
      var cal = cel("button", this.tr.tdValue);
      cal.id = "cal_" + id;
      cal.name = cal.id;
      cal.setAttribute('type', 'button');
      cal.setAttribute('aria-label', chooseDate);
      cal.title = chooseDate;
      cal.onclick = this._calendarPopup.bind(this, id, cal);
      cal.style.marginRight = "1px";
      cal.style.verticalAlign = "top";
      cal.className = "btn btn-default icon-calendar";
      input.id = this.id + "_input_" + id;
      input.onchange = this._dateTimeComplete.bind(this, id);
    } else {
      var cal = cel("img", this.tr.tdValue);
      cal.id = "cal_" + id;
      cal.name = cal.id;
      cal.src = "images/small_calendar.gifx";
      cal.alt = chooseDate;
      cal.title = chooseDate;
      cal.onclick = this._calendarPopup.bind(this, id);
      cal.style.marginLeft = "2px";
      cal.className = "button";
      var input = addTextInput(this.tr.tdValue, "", "hidden");
      input.id = this.id + "_input_" + id;
      input.onchange = this._dateTimeComplete.bind(this, id);
    }
    return input;
  },
  _getDateFromValue: function(value) {
    var value = value.split("@")[0];
    var prefixString = "javascript:gs.dateGenerate(";
    if (value.indexOf(prefixString) == 0) {
      var parts = value.split("'");
      if (parts.length == 5) {
        value = parts[1];
        if (isDate(parts[3], this.SYS_TIME_FORMAT)) {
          var dt = getDateFromFormat(parts[3], this.SYS_TIME_FORMAT);
          value += " " + formatDate(new Date(dt), this.SYS_TIME_FORMAT);
        }
      }
    }
    if (isDate(value, this.SYS_DATE_TIME_FORMAT)) {
      var dt = getDateFromFormat(value, this.SYS_DATE_TIME_FORMAT);
      value = formatDate(new Date(dt), this.userDateTimeFormat);
    } else if (isDate(value, this.SYS_DATE_FORMAT)) {
      var dt = getDateFromFormat(value, this.SYS_DATE_FORMAT);
      value = formatDate(new Date(dt), this.userDateFormat);
    }
    return value;
  },
  _getDateGenerate: function(value, tag) {
    if (value.indexOf("javascript:") != -1)
      return value;
    if (isDate(value, this.SYS_DATE_TIME_FORMAT)) {
      var dt = getDateFromFormat(value, this.SYS_DATE_TIME_FORMAT);
      value = formatDate(new Date(dt), this.SYS_DATE_FORMAT);
      tag = formatDate(new Date(dt), this.SYS_TIME_FORMAT);
    }
    return "javascript:gs.dateGenerate('" + value + "','" + tag + "')";
  },
  _convertDate: function(value) {
    if (value.indexOf("javascript:") != -1)
      return value;
    if (isDate(value, this.userDateTimeFormat)) {
      var dt = getDateFromFormat(value, this.userDateTimeFormat);
      value = formatDate(new Date(dt), this.SYS_DATE_TIME_FORMAT);
    } else if (isDate(value, this.userDateFormat)) {
      var dt = getDateFromFormat(value, this.userDateFormat);
      value = formatDate(new Date(dt), this.SYS_DATE_FORMAT);
    }
    return value;
  },
  _calendarPopup: function(id, btn) {
    var select = gel(this.id + "_select_" + id);
    var currentDate = '';
    var defaultTime = "start";
    var allowTime = this.allowTime;
    if (select) {
      if (select && select.value.indexOf('javascript') == -1)
        currentDate = select.value;
      defaultTime = select.defaultTime
      allowTime = select.allowTime;
    }
    var format;
    if (allowTime) {
      format = this.userDateTimeFormat;
      if (!isDate(currentDate, format)) {
        var dt = new Date();
        if (isDate(currentDate, this.userDateFormat))
          dt = new Date(getDateFromFormat(currentDate, this.userDateFormat));
        if (defaultTime == 'end')
          dt.setHours(23, 59, 59);
        else
          dt.setHours(0, 0, 0);
        currentDate = formatDate(dt, this.userDateTimeFormat);
      }
    } else {
      format = this.userDateFormat;
    }
    var input = gel(this.id + "_input_" + id);
    if (!input)
      input = gel(this.id + '_input_1');
    input.value = currentDate;
    ScriptLoader.getScripts('scripts/classes/GwtDateTimePicker.js', function() {
      new GwtDateTimePicker(input.id, format, allowTime, select || input);
    })
    return false;
  },
  _dateTimeComplete: function(id) {
    var select = gel(this.id + "_select_" + id);
    var input = gel(this.id + "_input_" + id);
    if (!select)
      return;
    var option = select.options[select.selectedIndex];
    var value = option.value;
    if (isDate(value, this.userDateFormat) || isDate(value, this.userDateTimeFormat)) {
      option.value = input.value;
      option.text = input.value;
    } else
      addOption(select, input.value, input.value, true);
  },
  initBetweenMapping: function(value1, value2) {
    var $td = $j(this.tr.tdValue);
    var $btn1 = this.emTemplate.makeBtn();
    var $field1 = this.emTemplate.makeField();
    var $input1 = this.emTemplate.makeInput('em_input_1', value1);
    var $nativeInput1 = $j(this.inputs[0]);
    var $dateBtn = $td.find('#cal_1');
    $dateBtn.after($btn1);
    $dateBtn.after($field1);
    $dateBtn.after($input1);
    var id = this.id;
    this._initMappingComponent($field1, $btn1, id, {
      glideType: 'calendar',
      isMultiText: false,
      originalMapping: value1.indexOf("{{") !== -1 ? value1 : "",
      parent: {
        show: function() {
          $td.find('#cal_1, select[id*="_select_1"]').show();
        },
        hide: function() {
          $td.find('#cal_1, select[id*="_select_1"]').hide();
        },
        onValue: function(msg) {
          var value = msg.wrappedValue;
          $input1.val(value);
          if (value.indexOf("{{") == -1) {
            $nativeInput1.val($nativeInput1.find("option:first").val());
          }
        }
      }
    });
    var $btn2 = this.emTemplate.makeBtn();
    var $field2 = this.emTemplate.makeField();
    var $input2 = this.emTemplate.makeInput('em_input_2', value2);
    var $nativeInput2 = $j(this.inputs[1]);
    $btn2.css({
      "margin-right": "90px"
    })
    $td.append($input2);
    $td.append($field2);
    $td.append($btn2);
    this._initMappingComponent($field2, $btn2, id, {
      glideType: 'calendar',
      isMultiText: false,
      originalMapping: value2.indexOf("{{") !== -1 ? value2 : "",
      parent: {
        show: function() {
          $td.find('#cal_2, select[id*="' + id + '_select_' + id + '_2"]').show();
          $td.find('button[id*="cal_' + id + '_2"]').show();
        },
        hide: function() {
          $td.find('#cal_2, select[id*="' + id + '_select_' + id + '_2"]').hide();
          $td.find('button[id*="cal_' + id + '_2"]').hide();
        },
        onValue: function(msg) {
          var value = msg.wrappedValue;
          $input2.val(value);
          if (value.indexOf("{{") == -1) {
            $nativeInput2.val($nativeInput2.find("option:first").val());
          }
        }
      }
    });
    $j(this.tr.tdValue)[this.supportsMapping ? 'removeClass' : 'addClass']("gem-unsupported");
    this._removePlaceholderBtn();
  },
  initAlphaMapping: function(value) {
    value = value.indexOf("{{") !== -1 ? value : "";
    var $td = $j(this.tr.tdValue);
    var $btn = this.emTemplate.makeBtn();
    var $field = this.emTemplate.makeField();
    var $input = this.emTemplate.makeInput('em_input_1', value);
    $td.append($field).append($btn).append($input);
    var $nativeInput = $j(this.inputs[0]);
    var id = this.id;
    this._initMappingComponent($field, $btn, id, {
      glideType: 'calendar',
      isMultiText: false,
      originalMapping: value.indexOf("{{") !== -1 ? value : "",
      parent: {
        show: function() {
          $td.find('#cal_1, select[id*="' + id + '_select_' + id + '"]').show();
          $td.find('input[id*="_input_1"]').show();
          $td.find('button[id*="cal_"]').show();
        },
        hide: function() {
          $td.find('#cal_1, select[id*="' + id + '_select_' + id + '"]').hide();
          $td.find('input[id*="_input_1"]').hide();
          $td.find('button[id*="cal_"]').hide();
        },
        onValue: function(msg) {
          var value = msg.wrappedValue;
          $input.val(value);
          if (value.indexOf("{{") == -1) {
            $nativeInput.val($nativeInput.find("option:first").val());
          }
        }
      }
    });
    $j(this.tr.tdValue)[this.supportsMapping ? 'removeClass' : 'addClass']("gem-unsupported");
    this._removePlaceholderBtn();
  },
  _removePlaceholderBtn: function() {
    $j(this.tr.tdMapping).html("");
    $j(this.tr.tdValue).css("display", "");
  },
  emTemplate: {
    makeBtn: function() {
      return $j(
        '<button role="button" class="btn btn-default em-field-toggle em-alt-btn em-icon-em gem-unsupported-target" ' +
        'title="Set date from a contextual value"' +
        'style="vertical-align: top;">' +
        '</button>'
      );
    },
    makeField: function() {
      return $j(
        '<em-alt-input class="hidden gem-unsupported-target"></em-alt-input>'
      );
    },
    makeInput: function(id, value) {
      var x = $j('<input type="hidden" id="' + id + '">');
      x.val(value || "");
      return x;
    }
  },
  _initMappingComponent: function($field, $btn, id, opts) {
    if (window.g_elementMappingMgr) {
      g_elementMappingMgr.initSubField($field, $btn, this.mappingId, opts)
    }
  },
  initMappingSupport: function(shouldEnable, type, mappingMgr) {
    var td = this.tr.tdMapping;
    if (!td || !mappingMgr)
      return;
    this.mappingType = type;
    this.supportsMapping = !!shouldEnable;
    $j(this.tr.tdValue)[this.supportsMapping ? 'removeClass' : 'addClass']("gem-unsupported");
  },
  destroyMappingSupport: function() {},
  activateMapping: function() {},
  deactivateMapping: function() {},
  _initMappingValue: function(value) {},
  type: 'GlideFilterDate'
});;
/*! RESOURCE: /scripts/classes/GlideEventHandler.js */
var GlideEventHandler = Class.create({
  initialize: function(handlerName, handler, fieldName) {
    this.handlerName = handlerName;
    this.handler = handler;
    this.fieldName = fieldName;
  }
});;
/*! RESOURCE: /scripts/classes/GlideUIElement.js */
var GlideUIElement = Class.create({
  CACHE_ELEMENTS: true,
  ENABLE_CHILD_WALKING: false,
  initialize: function(tableName, fieldName, type, mandatory, reference, attributes, scope) {
    this.tableName = tableName;
    this.fieldName = fieldName;
    this.type = type;
    this.mandatory = mandatory;
    this.reference = reference;
    this.attributes = attributes;
    this.elementFetched = false;
    this.elementParentNode;
    this.fetchedNodes = {};
    this.scope = scope || "global";
  },
  getType: function() {
    return this.type;
  },
  getID: function() {
    return this.tableName + '.' + this.fieldName;
  },
  getElementParentNode: function() {
    if (!this.elementFetched) {
      this.elementParentNode = gel('element.' + this.getID());
      this.elementFetched = true;
    }
    return this.elementParentNode;
  },
  getElement: function() {
    return this.getChildElementById(this.getID());
  },
  getLabelElement: function() {
    var parentElementNode = this.getElementParentNode();
    if (!parentElementNode)
      parentElementNode = document;
    var labels = parentElementNode.getElementsByTagName('label');
    for (var i = 0;
      (label = labels[i]); i++) {
      if (label.htmlFor == this.getID())
        return label;
    }
    return this.getStatusElement();
  },
  getStatusElement: function() {
    return this.getChildElementById('status.' + this.getID());
  },
  getChildElementById: function(id) {
    if (this.fetchedNodes[id])
      return this.fetchedNodes[id];
    var element = this.getChildElementById0(id);
    if (element)
      this.fetchedNodes[id] = element;
    return element;
  },
  getChildElementById0: function(id) {
    var element;
    if (this.ENABLE_CHILD_WALKING) {
      element = this._findSubChild(this.getElementParentNode(), id);
      if (element)
        return element;
    }
    return gel(id);
  },
  isMandatory: function() {
    return this.mandatory;
  },
  isDerived: function() {
    if (!this.fieldName)
      return false;
    return this.fieldName.indexOf('.') > -1;
  },
  setMandatory: function(mandatory) {
    this.mandatory = mandatory;
  },
  getScope: function() {
    return this.scope;
  },
  _findSubChild: function(startNode, id) {
    if (!startNode || (startNode.id && startNode.id == id))
      return startNode;
    var childNodes = startNode.children || startNode.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      var foundNode = this._findSubChild(childNodes[i], id);
      if (foundNode)
        return foundNode;
    }
    return;
  },
  type: "GlideUIElement"
});;
/*! RESOURCE: /scripts/classes/GlideUser.js */
var GlideUser = Class.create({
  initialize: function(userName, firstName, lastName, nonDefaultRoles, userID, departmentID) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.setFullName(this.firstName + " " + this.lastName);
    this.setRoles(nonDefaultRoles);
    this.userID = userID;
    this.departmentID = departmentID;
    this.preferences = new Object();
    this.clientData = new Object();
  },
  hasRoleExactly: function(role, includeDefaults) {
    if (!role || typeof role != 'string')
      return false;
    var rolesToCheck = this.roles;
    if (includeDefaults)
      rolesToCheck = this.allRoles;
    for (var x = 0, l = rolesToCheck.length; x < l; x++) {
      if (rolesToCheck[x].toLowerCase() == role.toLowerCase())
        return true;
    }
    return false;
  },
  hasRoles: function(includeDefaults) {
    if (includeDefaults)
      return (this.allRoles.length > 0);
    else
      return (this.roles.length > 0);
  },
  hasRole: function(role, includeDefaults) {
    if (this.hasRoleExactly('maint', includeDefaults))
      return true;
    if (this.hasRoleExactly(role, includeDefaults))
      return true;
    if (role == 'maint')
      return false;
    if (this.hasRoleExactly('admin', includeDefaults))
      return true;
    return false;
  },
  hasRoleFromList: function(roles, includeDefaults) {
    var rolesToMatch = new Array();
    if (roles)
      rolesToMatch = roles.split(/\s*,\s*/);
    if (rolesToMatch.length == 0)
      return true;
    for (var i = 0; i < rolesToMatch.length; i++) {
      var r = rolesToMatch[i];
      if (r && this.hasRole(r, includeDefaults))
        return true;
    }
    return false;
  },
  getFullName: function() {
    return this.fullName;
  },
  getUserName: function() {
    return this.userName;
  },
  getUserID: function() {
    return this.userID;
  },
  getDepartmentID: function() {
    return this.departmentID;
  },
  setFullName: function(fn) {
    this.fullName = fn;
  },
  getRoles: function(includeDefaults) {
    if (includeDefaults)
      return this.allRoles;
    return this.roles;
  },
  getAvailableElevatedRoles: function() {
    return this.elevatedRoles;
  },
  setRoles: function(r, includeDefaults) {
    if (includeDefaults) {
      if (r)
        this.allRoles = r.split(/\s*,\s*/);
      else
        this.allRoles = new Array();
    } else {
      if (r)
        this.roles = r.split(/\s*,\s*/);
      else
        this.roles = new Array();
    }
  },
  setElevatedRoles: function(r) {
    if (r)
      this.elevatedRoles = r.split(/\s*,\s*/);
    else
      this.elevatedRoles = new Array();
  },
  setActiveElevatedRoles: function(r) {
    if (r)
      this.activeElevatedRoles = r.split(/\s*,\s*/);
    else
      this.activeElevatedRoles = new Array();
  },
  getActiveElevatedRoles: function() {
    return this.activeElevatedRoles;
  },
  setDomain: function(d) {
    this.domain = d;
  },
  getPreference: function(n) {
    return this.preferences[n];
  },
  setPreference: function(n, v) {
    this.preferences[n] = v;
  },
  deletePreference: function(n) {
    delete this.preferences[n];
  },
  getClientData: function(n) {
    return this.clientData[n];
  },
  setClientData: function(n, v) {
    this.clientData[n] = v;
  },
  setBannerImage: function(s) {
    this.bannerImage = s;
  },
  getBannerImage: function() {
    return this.bannerImage;
  },
  setBannerText: function(s) {
    this.bannerText = s;
  },
  getBannerText: function() {
    return this.bannerText;
  },
  setHomePages: function(s) {
    this.homePages = s;
  },
  getHomePages: function() {
    return this.homePages;
  },
  type: "GlideUser"
});;
/*! RESOURCE: /scripts/doctype/GlideForm14.js */
function default_on_submit() {
  if (!g_form)
    return true;
  return g_form.onSubmit();
}
var GlideForm = Class.create({
  INFO_CLASS: "fieldmsg notification notification-info",
  ERROR_CLASS: "fieldmsg notification notification-error",
  WARNING_CLASS: "fieldmsg notification notification-warning",
  MSG_ROW: "_message_row",
  initialize: function(tableName, mandatory, checkMandatory, checkNumeric, checkInteger, isSearch) {
    this.tableName = tableName;
    this.modified = false;
    this.modifiedFields = {};
    this.mandatoryOnlyIfModified = false;
    this.elements = [];
    this.mandatory = mandatory;
    this.checkMandatory = checkMandatory;
    this.checkNumeric = checkNumeric;
    this.checkInteger = checkInteger;
    this.nameMap = [];
    this.attributes = [];
    this.validators = [];
    this.disabledFields = [];
    this.securityReadOnlyFields = [];
    this.elementHandlers = {};
    this.prefixHandlers = {};
    this.derivedWaiting = [];
    this.newRecord = gel('sys_row') && gel('sys_row').value == "-1";
    this.personalizeHiddenFields = null;
    this.personalizePrefKey = "personalize_" + this.tableName + "_" + this.getViewName();
    this._isLiveUpdating = false;
    this.submitAttemptsCount = 0;
    if (!isSearch && this.classname !== 'ServiceCatalogForm' && this.classname !== 'ServiceCatalogForm17')
      CachedEvent.emit('glideform.initialized', this);
    else {
      var gf = this;
      setTimeout(function() {
        CachedEvent.emit('glideform.initialized', gf)
      }, 0);
    }
  },
  fieldChanged: function(elementName, changeFlag) {
    if (!this._internalChange) {
      if (changeFlag) {
        this.modified = true;
        this.modifiedFields[elementName] = true;
      } else if (this.modifiedFields[elementName]) {
        this.modifiedFields[elementName] = false;
        this._checkModified();
      }
    }
    var uniqueValue = this.getUniqueValue();
    CustomEvent.fireAll('form.isModified', {
      uniqueValue: uniqueValue,
      isModified: this.modified
    });
  },
  _checkModified: function() {
    for (var n in this.modifiedFields) {
      if (this.modifiedFields[n]) {
        this.modified = true;
        return;
      }
    }
    this.modified = false;
  },
  setMandatoryOnlyIfModified: function() {
    this.mandatoryOnlyIfModified = true;
  },
  addNameMapEntry: function(entry) {
    this.nameMap.push(entry);
  },
  addGlideUIElement: function(ed) {
    this.elements.push(ed);
  },
  registerHandler: function(id, handler) {
    this.elementHandlers[id] = handler;
  },
  registerPrefixHandler: function(prefix, handlerObject) {
    var handler = new GlideFormPrefixHandler(handlerObject);
    this.prefixHandlers[prefix] = handler;
  },
  getPrefixHandler: function(id) {
    if (!id)
      return;
    if (id.indexOf('.') < 0)
      id = 'variables.' + id;
    var idSplit = id.split(".");
    var handler = this.prefixHandlers[idSplit[0]];
    if (typeof handler == "undefined")
      return;
    handler.setFieldName(id);
    return handler;
  },
  getElement: function(id) {
    if (this.elementHandlers[id] && (typeof this.elementHandlers[id].getElement == "function"))
      return this.elementHandlers[id].getElement();
    else
      return this.getControl(id);
  },
  getParameter: function(parm) {
    if (!(parm.substr(0, 8) == 'sysparm_'))
      parm = 'sysparm_' + parm;
    var pcel = gel(parm);
    if (pcel)
      return pcel.value;
    else
      return '';
  },
  hasAttribute: function(s) {
    if (this.attributes[s])
      return true;
    return false;
  },
  addAttribute: function(s) {
    this.attributes[s] = s;
  },
  addValidator: function(fieldType, validator) {
    this.validators[fieldType] = validator;
  },
  _getPersonalizeHiddenFields: function() {
    if (this.personalizeHiddenFields == null) {
      var prefVal = NOW[this.personalizePrefKey] || getPreference(this.personalizePrefKey);
      if ('false' == prefVal)
        this.personalizeHiddenFields = [];
      else if (prefVal.length)
        this.personalizeHiddenFields = prefVal.split(",");
      else
        this.personalizeHiddenFields = [];
    }
    return this.personalizeHiddenFields;
  },
  resetPersonalizeHiddenFields: function() {
    this.personalizeHiddenFields = [];
    this._savePersonalizeHiddenFields(function() {
      window.reloadWindow(window);
    });
  },
  _savePersonalizeHiddenFields: function(callback) {
    setPreference(this.personalizePrefKey, this.personalizeHiddenFields.join(","), callback);
  },
  isUserPersonalizedField: function(fieldName) {
    fieldName = this.removeCurrentPrefix(fieldName);
    return this.personalizeHiddenFields === null ? false : this.personalizeHiddenFields.indexOf(fieldName) != -1;
  },
  setUserDisplay: function(fieldName, display) {
    fieldName = this.removeCurrentPrefix(fieldName);
    this._getPersonalizeHiddenFields();
    for (var i = this.personalizeHiddenFields.length - 1; i >= 0; i--) {
      if (this.personalizeHiddenFields[i] === fieldName) {
        this.personalizeHiddenFields.splice(i, 1);
      }
    }
    this.setDisplay(fieldName, display);
    if ((display === false || display === 'false') && !this.isMandatory(fieldName))
      this.personalizeHiddenFields.push(fieldName);
    this._savePersonalizeHiddenFields();
  },
  setDisplay: function(fieldName, display) {
    fieldName = this.removeCurrentPrefix(fieldName);
    this._setDisplay(fieldName, display, this.isMandatory(fieldName), this.getValue(fieldName));
  },
  _setDisplay: function(fieldName, display, isMandatory, fieldValue) {
    var s = this.tableName + '.' + fieldName;
    var control = this.getControl(fieldName);
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        handler.getObject().setDisplay(handler.getFieldName(), display);
      return;
    }
    var displayValue = 'none';
    if (display == 'true' || display == true) {
      display = true;
      displayValue = '';
    }
    if ((display != true) && isMandatory && fieldValue == '')
      return;
    var theElement = control;
    if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].getElement == "function"))
      theElement = this.elementHandlers[control.id].getElement();
    if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setDisplay == "function")) {
      this.elementHandlers[control.id].setDisplay(display ? '' : 'none');
    } else {
      this.changeElementStyle(fieldName, 'display', displayValue);
    }
    this.setSensitiveDisplayValue(s + ".ui_policy_sensitive", displayValue);
    var glideElement = this.getGlideUIElement(fieldName);
    if (glideElement)
      if (glideElement.type == 'script' || glideElement.type == 'script_plain' || glideElement.type == 'xml')
        CustomEvent.fire('element_script_display_' + display, {
          'element': glideElement
        });
    _frameChanged();
  },
  setSensitiveDisplayValue: function(name, displayValue) {
    var elements = document.getElementsByName(name);
    for (i = 0; i < elements.length; i++) {
      elements[i].style.display = displayValue;
    }
  },
  setValidation: function(fieldName, validate) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (!control)
      return;
    if (validate == 'false')
      validate = false;
    if (validate != false) {
      control.removeAttribute('validate');
      return;
    }
    control.setAttribute('validate', 'false');
  },
  getViewName: function() {
    var sysparmView = gel('sysparm_view');
    var view = "default";
    if (sysparmView && sysparmView.value)
      view = sysparmView.value;
    return view;
  },
  setVisible: function(fieldName, visibility) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        handler.getObject().setVisible(handler.getFieldName(),
          visibility);
    }
    var v = 'hidden';
    if (visibility == 'true')
      visibility = true;
    if (visibility)
      v = 'visible';
    if ((visibility != true) && this.isMandatory(fieldName) && (this.getValue(fieldName) == ''))
      return;
    this.changeElementStyle(fieldName, 'visibility', v);
  },
  changeElementStyle: function(fieldName, name, value) {
    var ge = this.getGlideUIElement(fieldName);
    if (!ge)
      return;
    if (this.changeElementParent(ge, name, value))
      return;
    var labelElement = ge.getLabelElement();
    if (labelElement)
      labelElement.parentNode.parentNode.style[name] = value;
    var parentTR = findParentByTag(ge.getElement(), "tr");
    if (parentTR && parentTR != labelElement)
      parentTR.style[name] = value;
  },
  changeElementParent: function(ge, name, value) {
    var element = ge.getElementParentNode();
    if (element) {
      element.style[name] = value;
      var decoration = $(element).select(".reference_decoration, .btn-ref");
      var isEmptyRef = ge.type == 'reference' && this.getValue(ge.fieldName) == '';
      if (decoration && decoration.length > 0) {
        for (var i = 0; i < decoration.length; i++) {
          if (isEmptyRef && (decoration[i].getAttribute('data-type') == 'reference_popup'))
            decoration[i].style[name] = 'none';
          else
            decoration[i].style[name] = value;
        }
      }
      return true;
    }
    return false;
  },
  getLabel: function(id) {
    id = this.removeCurrentPrefix(id);
    var label;
    var labels = document.getElementsByTagName('label');
    for (var i = 0;
      (label = labels[i]); i++) {
      if (label.htmlFor.endsWith(id)) {
        return label;
      }
    }
    return false;
  },
  isNewRecord: function() {
    return this.newRecord;
  },
  isMandatory: function(fieldName) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var thisElement = this.getGlideUIElement(fieldName);
    if (!thisElement) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        return handler.getObject().isMandatory(handler.getFieldName());
      else
        return false;
    }
    return thisElement.isMandatory();
  },
  addSecurityReadOnlyFields: function(fields) {
    this.securityReadOnlyFields = fields.split(',');
  },
  setRequiredChecked: function(fieldName, required) {
    if (!fieldName || !fieldName.startsWith('ni.VE') || !fieldName.startsWith("ni.QS")) {
      jslog("Invalid variable id");
      return;
    }
    var handler = this.getPrefixHandler(this.resolvePrettyNameMap(fieldName));
    if (!handler) {
      jslog("Invalid variable id");
      return;
    }
    handler.getObject().setRequiredChecked(fieldName, required);
  },
  _setAriaRequired: function(fieldName, value) {
    if (!fieldName) {
      return;
    }
    value = value || false;
    var visibleControls = this._getVisibleControls(fieldName);
    visibleControls.forEach(function(visibleControl) {
      visibleControl.setAttribute('aria-required', value);
    });
  },
  setMandatory: function(fieldName, mandatory) {
    var thisElement = this.getGlideUIElement(fieldName);
    if (!thisElement) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        handler.getObject().setMandatory(handler.getFieldName(), mandatory);
      return;
    }
    if (this.securityReadOnlyFields.indexOf(this.tableName + "." + fieldName) >= 0)
      return;
    thisElement.setMandatory(mandatory);
    var e = thisElement.getElement();
    if (e) {
      e.setAttribute("mandatory", mandatory);
      onChangeLabelProcessByEl(e, thisElement.getStatusElement());
      this._setAriaRequired(fieldName, mandatory);
    }
    var control = this.getControl(fieldName);
    if (control && control.id && this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setMandatory == "function"))
      this.elementHandlers[control.id].setMandatory(mandatory);
    if (mandatory) {
      setMandatoryExplained(true);
      var value = this.getValue(fieldName);
      if (value == '') {
        this._setDisplay(fieldName, true, true, '');
        this._setReadonly(fieldName, false, true, '');
      }
    }
    opticsLog(this.getTableName(), fieldName, "Mandatory set to " + mandatory);
  },
  setDisabled: function(fieldName, disabled) {
    this.setReadonly(fieldName, disabled);
  },
  setReadOnly: function(fieldName, disabled) {
    this.setReadonly(fieldName, disabled);
  },
  setReadonly: function(fieldName, disabled) {
    fieldName = this.removeCurrentPrefix(fieldName);
    this._setReadonly(fieldName, disabled, this.isMandatory(fieldName), this.getValue(fieldName));
  },
  _setReadonly: function(fieldName, disabled, isMandatory, fieldValue) {
    var s = this.tableName + '.' + fieldName;
    var control = this.getControl(fieldName);
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        handler.getObject()._setReadonly(
          handler.getFieldName(), disabled, isMandatory,
          fieldValue);
      return;
    }
    var ge = this.getGlideUIElement(fieldName);
    if (!ge) {
      opticsLog(this.getTableName(), fieldName, "Unable to set invalid field's ReadOnly to " + disabled);
      return;
    }
    this._setReadonly0(ge, control, s, fieldName, disabled, isMandatory, fieldValue);
  },
  _setReadonly0: function(ge, control, s, fieldName, disabled, isMandatory, fieldValue) {
    if (disabled && isMandatory && fieldValue == '') {
      opticsLog(this.getTableName(), fieldName, "Unable to set blank mandatory field's ReadOnly to " + disabled);
      return;
    }
    if (control.getAttribute('gsftlocked') == 'true') {
      opticsLog(this.getTableName(), fieldName, "Unable to set locked field's ReadOnly to " + disabled);
      return;
    }
    if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setReadOnly == "function")) {
      if (this.elementHandlers[control.id].setReadOnly(disabled) == true)
        return;
    } else
      this.setDisabledControl(control, disabled);
    this._setDisabledField(control, disabled);
    onChangeLabelProcessByEl(control, ge.getStatusElement());
    this._setFieldReadOnly(ge, "sys_display." + s, disabled);
    this._setFieldReadOnly(ge, "sys_select." + s, disabled);
    var $inputGroup = $j(ge.getElementParentNode()).find(".input-group");
    if ($inputGroup.length) {
      if (disabled)
        $inputGroup.addClass('input-group-disabled');
      else
        $inputGroup.removeClass('input-group-disabled');
    }
    this.setSensitiveDisplayValue(s + ".ui_policy_sensitive", disabled ? 'none' : '');
    this._setFieldReadOnly(ge, "ni." + this.tableName + "." + fieldName, disabled);
    if (this.tableName == "ni")
      this._setFieldReadOnly(ge, "ni." + ge.fieldName, disabled);
    var suggestionExists = gel('ni.dependent_reverse.' + this.tableName + '.' + fieldName);
    if (suggestionExists) {
      this._setFieldReadOnly(ge, "lookup." + this.tableName + "." + fieldName, disabled, true);
    }
    opticsLog(this.getTableName(), fieldName, "ReadOnly set to " + disabled);
  },
  _setFieldReadOnly: function(ge, s, disabled, skipProcessLabelChange) {
    var control = ge.getChildElementById(s);
    if (control) {
      this.setDisabledControl(control, disabled);
      this._setDisabledField(control, disabled);
      if (!skipProcessLabelChange)
        onChangeLabelProcessByEl(control, ge.getStatusElement());
    }
  },
  setDisabledControl: function(control, disabled) {
    if (disabled) {
      control.setAttribute("readonly", "readonly");
      addClassName(control, 'disabled');
    } else {
      control.removeAttribute("readonly");
      removeClassName(control, 'disabled');
    }
    if (control.tagName == "SELECT") {
      var $control = $j(control);
      $control
        .attr('aria-readonly', disabled)
        .find('option').prop('disabled', disabled);
      if ($control.data('select2'))
        $control.select2('container').addClass('select2-container-disabled');
    } else if (control.getAttribute('type') == 'checkbox')
      control.setAttribute('aria-readonly', disabled);
  },
  _setDisabledField: function(control, disabled) {
    if (disabled) {
      addClassName(control, 'disabled');
      addClassName(control, 'readonly');
      this._addDisabledField(control);
    } else {
      removeClassName(control, 'disabled');
      removeClassName(control, 'readonly');
      this._removeDisabledField(control);
    }
  },
  _addDisabledField: function(control) {
    var n = this.disabledFields.length;
    this.disabledFields[n] = control;
  },
  _removeDisabledField: function(control) {
    var n = this.disabledFields.length;
    for (i = 0; i < n; i++) {
      if (this.disabledFields[i] == control) {
        this.disabledFields.splice(i, 1);
        break;
      }
    }
  },
  onSubmit: function() {
    this.getFormElement().addClassName('form-submitted');
    this.submitAttemptsCount++;
    CustomEvent.fire('glideform.submit_attempted');
    var action = this.getActionName();
    if (action && !action.startsWith("sysverb_no_update"))
      this.submitted = true;
    if (action == 'sysverb_back' || action == 'sysverb_cancel' || action == 'sysverb_delete' || action == 'sysverb_query')
      return true;
    var rc = this.mandatoryCheck();
    if (rc && typeof g_sc_form != "undefined")
      rc = g_sc_form.mandatoryCheck() && g_sc_form.catalogOnSubmit();
    rc = rc && this.validate();
    return rc;
  },
  enableUIPolicyFields: function() {
    for (var i = 0; i < this.disabledFields.length; i++) {
      var field = this.disabledFields[i];
      var disabledID = field.id;
      if (!field.parentNode)
        continue;
      if (this._isDerivedWaiting(disabledID)) {
        jslog("Did not re-enable " + disabledID + " as it is derived waiting for AJAX lookup");
        continue;
      }
      var existingElement = document.querySelector('input[name="' + field.name + '"]');
      if (existingElement) {
        if (existingElement.uiPolicyField == field)
          existingElement.value = field.value;
        continue;
      }
      var hiddenInput = document.createElement('input');
      hiddenInput.name = field.name;
      hiddenInput.type = "hidden";
      hiddenInput.value = field.value;
      hiddenInput.uiPolicyField = field;
      field.parentNode.appendChild(hiddenInput);
    }
  },
  mandatoryCheck: function() {
    if (!this.checkMandatory || (!this.modified && this.mandatoryOnlyIfModified))
      return true;
    var rc = true;
    var invalidFields = new Array();
    var labels = new Array();
    var missing = this.getMissingFields();
    var focusDetermined = false;
    var invalidWidgets = [];
    for (var i = 0; i < missing.length; i++) {
      rc = false;
      var field = missing[i];
      var widget = this.getControl(field);
      var widgetVisibleControls = this._getVisibleControls(field);
      if (widgetVisibleControls.length > 0) {
        invalidWidgets.push(widgetVisibleControls);
      }
      if (!focusDetermined) {
        var tryLabel = !$j(widget).is(':visible');
        if (!tryLabel) {
          try {
            widget.focus();
            focusDetermined = true;
          } catch (e) {
            tryLabel = true;
          }
        }
        if (tryLabel) {
          var displayWidget = this.getDisplayBox(field);
          if (displayWidget && displayWidget.getAttribute("type") == "hidden") {
            var streamDisplayWidget = gel("activity-stream-" + field + "-textarea");
            if (streamDisplayWidget) {
              try {
                streamDisplayWidget.focus();
                focusDetermined = true;
              } catch (exception) {}
            }
          } else if (displayWidget) {
            try {
              displayWidget.focus();
              focusDetermined = true;
            } catch (exception) {}
          }
        }
      }
      labels.push(this.tableName + '.' + field);
      var widgetLabel = this.getLabelOf(field);
      var shortLabel = trim(widgetLabel + '');
      invalidFields.push(shortLabel);
    }
    if (!rc) {
      var theText = invalidFields.join(', ');
      theText = getMessage('The following mandatory fields are not filled in') + ': ' + theText;
      try {
        this.addErrorMessage(theText);
        CustomEvent.fireAll('glideform.mandatorycheck.failed', theText);
        this.submitted = false;
      } catch (e) {}
    }
    for (var i = 0; i < labels.length; i++) {
      this.flash(labels[i], "#FFFACD", 0);
    }
    for (var i = 0; i < invalidWidgets.length; i++) {
      for (var j = 0; j < invalidWidgets[i].length; j++) {
        invalidWidgets[i][j].setAttribute('aria-invalid', 'true');
      }
    }
    return rc;
  },
  setVariablesReadOnly: function(readOnly) {
    for (var x = 0; x < g_form.elements.length; x++) {
      for (var i = 0; i < this.nameMap.length; i++) {
        var entry = this.nameMap[i];
        var element = g_form.elements[x];
        if (entry.realName == element.fieldName && element.tableName == "variable") {
          if (typeof g_sc_form == "undefined" || !g_sc_form)
            this.setReadOnly(entry.prettyName, readOnly);
          else
            g_sc_form.setReadOnly(entry.prettyName, readOnly);
        }
      }
    }
  },
  getHelpTextControl: function(variableName) {
    var handler = this.getPrefixHandler(variableName);
    var ele;
    if (handler) {
      var handlerObject = handler.getObject();
      ele = handlerObject.getHelpTextControl(handlerObject.removeCurrentPrefix(variableName));
    }
    if (!ele) {
      jslog("getHelpTextControl is supported for only Service Catalog Variables");
      return;
    }
    return ele;
  },
  getEditableFields: function() {
    var fa = this.elements;
    var answer = [];
    for (var i = 0; i < fa.length; i++) {
      var ed = fa[i];
      var widget = this.getControl(ed.fieldName);
      if (!widget)
        continue;
      if (this.isEditableField(ed, widget))
        answer.push(ed.fieldName);
    }
    return answer;
  },
  isEditableField: function(ge, control) {
    var isEditableFieldFn = this._getHandlerFn(control, 'isEditableField');
    if (isEditableFieldFn)
      return isEditableFieldFn(ge, control);
    if (!this.isTemplateCompatible(ge, control))
      return false;
    if (!this.isVisible(ge, control))
      return false;
    if (this.isReadOnly(ge, control))
      return false;
    if (this.isDisplayNone(ge, control))
      return false;
    return true;
  },
  isTemplateCompatible: function(ge, control) {
    var isTemplatableFn = this._getHandlerFn(control, 'isTemplatable');
    return !isTemplatableFn || isTemplatableFn(ge, control);
  },
  _getHandlerFn: function(control, fn) {
    if (!control)
      return;
    var handler = this.elementHandlers[control.id];
    if (!handler)
      return;
    var handlerFn = handler[fn];
    if (!handlerFn || typeof handlerFn !== "function")
      return;
    return handlerFn;
  },
  isVisible: function(ge, control) {
    if (this.isDisplayNone(ge, control))
      return false;
    if (control && this.elementHandlers[control.id])
      if (typeof this.elementHandlers[control.id].isVisible == "function")
        return this.elementHandlers[control.id].isVisible();
    if (control && ge.getType() != "glide_duration" && ge.getType != "glide_time") {
      var xx = control.style['visibility'];
      if (xx == 'hidden') {
        var readOnlyField = gel("sys_readonly." + control.id);
        if ((readOnlyField && readOnlyField.style['visibility'] == 'hidden') || !readOnlyField)
          return false;
      }
    }
    xx = this._getElementStyle(ge, 'visibility');
    if (xx == 'hidden')
      return false;
    return true;
  },
  isDisabled: function(fieldName) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (!control)
      return true;
    if (this.elementHandlers[control.id])
      if (typeof this.elementHandlers[control.id].isDisabled == "function")
        return this.elementHandlers[control.id].isDisabled();
    return this.isReadOnly("", control);
  },
  isReadOnly: function(ge, control) {
    if (!control)
      return true;
    if (this.elementHandlers[control.id])
      if (typeof this.elementHandlers[control.id].isReadOnly == "function")
        return this.elementHandlers[control.id].isReadOnly();
    return control.disabled ||
      control.readOnly ||
      ((typeof control.hasClassName === "function") && control.hasClassName("readonly")) ||
      ((typeof control.getAttribute === "function") && control.getAttribute("writeaccess") == "false");
  },
  isDisplayNone: function(ge, control) {
    var parentNode = ge.getElementParentNode();
    if (parentNode && parentNode.style.display == 'none')
      return true;
    if (ge.getType() == 'html' || ge.getType() == 'translated_html' || ge.getType() == 'composite_name' || ge.getType() == 'url')
      return false;
    if (!control)
      return;
    else {
      var xx = control.style['display'];
      if (xx == 'none') {
        var readOnlyField = gel("sys_readonly." + control.id);
        if ((readOnlyField && readOnlyField.style['display'] == 'none') || !readOnlyField)
          return true;
      }
    }
    var xx = this._getElementStyle(ge, 'display');
    if (xx == 'none')
      return true;
    return false;
  },
  _getElementStyle: function(ge, style) {
    var element = ge.getElementParentNode();
    if (element)
      return element.style[style];
    var labelElement = ge.getLabelElement();
    if (labelElement)
      return labelElement.parentNode.parentNode.style[style];
    var parentTR = findParentByTag(ge.getElement(), "tr");
    if (parentTR && parentTR != labelElement)
      return parentTR.style[name];
    return "";
  },
  getMissingFields: function() {
    var fa = this.elements;
    var answer = [];
    for (var i = 0; i < fa.length; i++) {
      var ed = fa[i];
      if (!ed.mandatory)
        continue;
      var widget = this.getControl(ed.fieldName);
      if (!widget)
        continue;
      if (this._isMandatoryFieldEmpty(ed))
        answer.push(ed.fieldName);
    }
    if (typeof g_sc_form != "undefined" && g_sc_form)
      g_sc_form.getMissingFields(answer);
    return answer;
  },
  _isMandatoryFieldEmpty: function(ed) {
    var widgetValue = this.getValue(ed.fieldName);
    if (widgetValue != null && widgetValue != '')
      return false;
    if (ed.supportsMapping) {
      var id = "sys_mapping." + ed.tableName + "." + ed.fieldName;
      var mappingValue = this.getValue(id);
      if (mappingValue.trim())
        return false;
      var nonMappedFieldValue = this.getValue(ed.tableName + "." + ed.fieldName);
      if (nonMappedFieldValue.trim())
        return false;
      return true;
    }
    var displayBox = this.getDisplayBox(ed.fieldName);
    if (displayBox != null) {
      var displayValue = displayBox.value;
      if (displayValue != null && displayValue != '' && displayBox.getAttribute('data-ref-dynamic') == 'true') {
        return false;
      }
    }
    if ((this.isNewRecord() || this.mandatory) && !ed.isDerived())
      return true;
    widgetName = "sys_original." + this.tableName + '.' + ed.fieldName;
    widget = gel(widgetName);
    if (widget) {
      widgetValue = widget.value;
      if ((widgetValue == null || widgetValue == '') && ed.type != "journal_input")
        return false;
    }
    return true;
  },
  resolveNameMap: function(prettyName) {
    var rc = prettyName;
    for (var i = 0; i < this.nameMap.length; i++) {
      var entry = this.nameMap[i];
      if (entry.prettyName == prettyName) {
        rc = entry.realName;
      }
    }
    return rc;
  },
  resolveLabelNameMap: function(name) {
    var pname = name;
    for (var i = 0; i < this.nameMap.length; i++) {
      var el = this.nameMap[i];
      if (el.realName === pname || el.prettyName === pname) {
        pname = el.label;
        break;
      }
    }
    return pname;
  },
  resolvePrettyNameMap: function(realName) {
    var pname = realName;
    for (var i = 0; i < this.nameMap.length; i++)
      if ('ni.VE' + this.nameMap[i].realName == realName ||
        'ni.QS' + this.nameMap[i].realName.substring(3) == realName ||
        this.nameMap[i].realName == realName) {
        pname = this.nameMap[i].prettyName;
        break;
      }
    return pname;
  },
  getFormElement: function() {
    return gel(this.tableName + '.do');
  },
  getControl: function(fieldName) {
    var ge = this.getGlideUIElement(fieldName);
    if (ge) {
      var widget = ge.getElement();
      if (widget) {
        return widget;
      }
    }
    return this.getControlByForm(fieldName);
  },
  getControlByForm: function(fieldName) {
    var form = this.getFormElement();
    if (!form)
      return;
    widget = form[this.tableName + '.' + fieldName];
    if (!widget)
      widget = form[fieldName];
    if (widget && typeof widget != 'string' && widget.length && widget.tagName != "SELECT") {
      for (var i = 0; i < widget.length; i++) {
        if (widget[i].checked)
          return widget[i];
        else if (widget[i].id == fieldName && widget[i].tagName == "INPUT" && widget[i].type != 'radio')
          return widget[i];
      }
      var wt = widget[0].type;
      if (typeof wt != 'undefined' && wt == 'radio')
        return widget[0];
    }
    return widget;
  },
  _tryLabelRow: function(fieldName) {
    var element = this._tryLabelRowElement(fieldName);
    if (element)
      return element.innerText || element.textContent;
    return null;
  },
  _tryLabelRowElement: function(fieldName) {
    var id = "label_" + fieldName;
    var row = gel(id);
    if (row) {
      var child = row.firstChild;
      if (child) {
        return child;
      }
    }
    return null;
  },
  getLabelOf: function(fieldName) {
    var fieldid = this.tableName + '.' + fieldName;
    var widgetLabel = this.getLabel(fieldid);
    var labelContent = "";
    if (widgetLabel) {
      labelContent = $j(widgetLabel).find('.label-text').text() ||
        widgetLabel.innerText ||
        widgetLabel.textContent;
      if (labelContent.indexOf('*') == 0 &&
        document.documentElement.getAttribute('data-doctype') == 'true')
        labelContent = labelContent.toString().substring(1);
      if ((labelContent.lastIndexOf(":") + 1) == labelContent.length)
        labelContent = labelContent.toString().substring(0, (labelContent.length - 1));
    }
    if (labelContent == null || labelContent == '')
      labelContent = this._tryLabelRow(fieldName);
    if (labelContent == null || labelContent == '') {
      var handler = this.getPrefixHandler(this.resolvePrettyNameMap(fieldName));
      if (handler)
        labelContent = handler.getObject().getLabelOf(fieldName);
      else
        labelContent = fieldName;
    }
    return labelContent.trim();
  },
  setLabelOf: function(fieldName, value) {
    var control = g_form.getControl(fieldName);
    var setLabelOfSomething = false;
    if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setLabelOf == "function"))
      setLabelOfSomething = this.elementHandlers[control.id].setLabelOf(value);
    var labelEl = this._getLabelEl(fieldName);
    if (labelEl) {
      $j(labelEl).find('.label-text').text(value);
      setLabelOfSomething = true;
    }
    return setLabelOfSomething;
  },
  _getLabelEl: function(fieldName) {
    var fieldID = this.tableName + '.' + fieldName;
    var labelEl = this.getLabel(fieldID);
    if (labelEl)
      return labelEl;
    labelEl = this._tryLabelRowElement(fieldName);
    if (labelEl)
      return labelEl;
    return false;
  },
  _getDecorationsEl: function(field) {
    var label = (field instanceof jQuery) ? field : $j(this._getLabelEl(field));
    if (!label.length)
      return null;
    var decorations = label.find('.field_decorations');
    if (!decorations.length) {
      $j('<span class="field_decorations" data-label-decorations="[]" />').prependTo(label);
      decorations = label.find('.field_decorations');
    }
    return decorations;
  },
  _getDecorations: function(fieldName) {
    var attrName = 'data-label-decorations';
    var decorations = this._getDecorationsEl(fieldName);
    if (decorations && decorations.length) {
      var raw = decorations.attr(attrName);
      var json = JSON.parse(raw);
      if (json)
        return json;
    }
    return [];
  },
  _setDecorations: function(fieldName, decorations) {
    var isArr = Array.isArray || function(obj) {
      return $j.type(obj) === "array";
    };
    if (!isArr(decorations))
      return false;
    var attrName = 'data-label-decorations';
    var labelEl = this._getLabelEl(fieldName);
    if (labelEl) {
      var raw = JSON.stringify(decorations);
      var decorEl = this._getDecorationsEl($j(labelEl));
      decorEl.empty();
      decorEl.attr(attrName, raw);
      for (var i = 0; i < decorations.length; i++) {
        var dec = decorations[i];
        var $dec = $j('<span class="field_decoration ' + dec.icon + ' ' + dec.color + '" ' +
          'title="' + dec.text + '" ' +
          'data-placement="right" data-container=".touch_scroll"></span>')
        decorEl.append($dec);
        $dec.tooltip().hideFix();
      }
      return true;
    }
    return false;
  },
  addDecoration: function(field, icon, text, color) {
    text = text || '';
    color = color || '';
    var decorations = this._getDecorations(field);
    var deco = {
      icon: icon,
      text: text,
      color: color
    };
    var isDuplicate = false;
    var maxi = decorations.length;
    for (var i = 0; i < maxi; i++) {
      var dec = decorations[i];
      if (dec.icon == icon &&
        dec.text == text &&
        dec.color == color) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate)
      decorations.push(deco);
    this._setDecorations(field, decorations);
  },
  removeDecoration: function(field, icon, text, color) {
    text = text || '';
    color = color || '';
    var decorations = this._getDecorations(field);
    var out = [];
    var maxi = decorations.length;
    for (var i = 0; i < maxi; i++) {
      var dec = decorations[i];
      if (!(dec.icon == icon &&
          dec.text == text &&
          dec.color == color)) {
        out.push(dec);
      }
    }
    this._setDecorations(field, out);
  },
  removeAllDecorations: function() {
    $j('.field_decorations').remove();
  },
  getSectionNames: function() {
    return g_tabs2Sections.tabNames;
  },
  setSectionDisplay: function(name, display) {
    var index = g_tabs2Sections.findTabIndexByName(name);
    if (index === -1)
      return false;
    if (display)
      g_tabs2Sections.showTab(index);
    else
      g_tabs2Sections.hideTab(index);
    return true;
  },
  isSectionVisible: function(name) {
    var index = g_tabs2Sections.findTabIndexByName(name);
    if (index !== -1)
      return g_tabs2Sections.isVisible(index);
    return false;
  },
  activateTab: function(name) {
    var index = g_tabs2Sections.findTabIndexByName(name);
    if (index !== -1)
      return g_tabs2Sections.setActive(index);
    return false;
  },
  getTabNameForField: function(fieldName) {
    if (!g_form.hasField(fieldName))
      return null;
    var control = g_form.getControl(fieldName);
    return this._getTabNameForElement(control);
  },
  _getTabNameForElement: function(element) {
    var sectionId = $j(element).closest('[data-section-id]').attr('id');
    if (sectionId) {
      var tabIndex = g_tabs2Sections.findTabIndexByID(sectionId);
      return g_tabs2Sections.tabNames[tabIndex];
    }
    return null;
  },
  _getVisibleControls: function(field) {
    if (!field) {
      return [];
    }
    var visibleControls = [];
    var widgets = this.getControl(field) || [];
    if (widgets.length && widgets.constructor !== Array) {
      widgets = Array.prototype.slice.call(widgets);
    }
    widgets = [].concat(widgets);
    widgets.forEach(function(widget) {
      var widgetType = widget.getAttribute('type');
      if (!widgetType && widget.tagName === 'INPUT') {
        widgetType = 'text';
      }
      if (widget.tagName === 'TEXTAREA' && widgetType !== 'hidden') {
        visibleControls.push(widget);
      } else if (typeof widgetType === 'string' && widgetType.toLowerCase() !== 'hidden') {
        visibleControls.push(widget);
      } else {
        var widgetDisplayBox = this.getDisplayBox(field);
        if (widgetDisplayBox) {
          visibleControls.push(widgetDisplayBox);
        }
      }
    }.bind(this));
    return visibleControls;
  },
  validate: function() {
    var fa = this.elements;
    var rc = true;
    var labels = [];
    var invalidWidgets = [];
    for (var i = 0; i < fa.length; i++) {
      var ed = fa[i];
      var widgetName = this.tableName + '.' + ed.fieldName;
      var widget = this.getControl(ed.fieldName);
      if (!widget)
        continue;
      if (!this.isEditableField(ed, widget))
        continue;
      if (widget.getAttribute("validate") == "false")
        continue;
      var widgetValue = widget.value;
      var widgetType = ed.type;
      var specialType = widget.getAttribute("specialtype");
      if (specialType)
        widgetType = specialType;
      var validator = this.validators[widgetType];
      if (!validator)
        continue;
      this.hideFieldMsg(widget);
      var isValid = validator.call(this, widgetValue);
      if (isValid != null && isValid != true) {
        var widgetLabel = this.getLabelOf(ed.fieldName);
        labels.push(widgetName);
        rc = false;
        if (isValid == false || isValid == "false")
          isValid = getMessage("Invalid text");
        this.showFieldMsg(widget, isValid, 'error');
        var widgetVisibleControls = this._getVisibleControls(ed.fieldName);
        if (widgetVisibleControls.length > 0) {
          invalidWidgets.push(widgetVisibleControls);
        }
      }
    }
    for (var i = 0; i < labels.length; i++)
      this.flash(labels[i], "#FFFACD", 0);
    for (var i = 0; i < invalidWidgets.length; i++) {
      for (var j = 0; j < invalidWidgets[i].length; j++) {
        invalidWidgets[i][j].setAttribute('aria-invalid', 'true');
      }
    }
    return rc;
  },
  removeCurrentPrefix: function(id) {
    if (id) {
      if (id.indexOf('current.') == 0) {
        id = id.substring(8);
      }
      return id;
    }
  },
  isNumeric: function(internaltype) {
    if (internaltype == 'decimal')
      return true;
    if (internaltype == 'float')
      return true;
    if (internaltype == 'integer')
      return true;
    if (internaltype == 'numeric')
      return true;
    return false;
  },
  isInteger: function(internaltype) {
    if (internaltype == 'integer')
      return true;
    return false;
  },
  setTemplateValue: function(fieldName, value, displayValue) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (control)
      control.templateValue = 'true';
    var text = "Field modified by template";
    this.setValue(fieldName, value, displayValue);
    this.addDecoration(fieldName, 'icon-success', text);
  },
  setValue: function(fieldName, value, displayValue) {
    var oldValue = this.getValue(fieldName);
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        handler.getObject().setValue(handler.getFieldName(),
          value, displayValue);
      return;
    } else {
      if (control.options && control.options.length) {
        for (var i = 0; i < control.options.length; i++) {
          control.options[i].removeAttribute('selected');
        }
      }
    }
    var previousInternalChangeValue = this._internalChange;
    this._internalChange = true;
    this._setValue(fieldName, value, displayValue, true);
    this._internalChange = previousInternalChangeValue;
    if (this._isLiveUpdating)
      this._setOriginalValue(fieldName, value);
    this._opticsInspectorLog(fieldName, oldValue);
  },
  getNiBox: function(fieldName) {
    var niName = 'ni.' + this.tableName + '.' + fieldName;
    return gel(niName);
  },
  getDisplayBox: function(fieldName) {
    var dName, field;
    dName = 'sys_display.' + this.tableName + '.' + fieldName;
    field = gel(dName);
    if (field)
      return field;
    dName = 'sys_display.' + fieldName;
    field = gel(dName);
    if (field)
      return field;
    var handler = this.getPrefixHandler(fieldName);
    if (handler) {
      var handlerObject = handler.getObject();
      return handlerObject.getDisplayBox(handlerObject.removeCurrentPrefix(fieldName));
    }
    return;
  },
  clearValue: function(fieldName) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        control = handler.getObject().clearValue(handler.getFieldName());
      return;
    }
    if (!control.options) {
      this._setValue(fieldName, '');
      return;
    }
    var selindex = control.selectedIndex;
    if (selindex != -1) {
      var option = control.options[selindex];
      option.selected = false;
    }
    var options = control.options;
    for (i = 0; i < options.length; i++) {
      var option = options[i];
      var optval = option.value;
      if (optval == '') {
        option.selected = true;
        break;
      }
    }
  },
  _sanitizeFieldName: function(fieldName) {
    if (fieldName) {
      fieldName = this.removeCurrentPrefix(fieldName);
      fieldName = this._removeTableName(fieldName);
    }
    return fieldName;
  },
  _removeTableName: function(fieldName) {
    if (fieldName.indexOf(this.tableName + ".") === 0) {
      var length = this.tableName.length + 1;
      fieldName = fieldName.substring(length);
    }
    return fieldName;
  },
  _setValue: function(fieldName, value, displayValue, updateRelated) {
    fieldName = this._sanitizeFieldName(fieldName);
    var control = this.getControl(fieldName);
    if (typeof control === 'undefined')
      return;
    var readOnlyField = gel('sys_readonly.' + control.id);
    if (readOnlyField) {
      if (readOnlyField.tagName == "SPAN") {
        var fieldType = readOnlyField.getAttribute('gsft_fieldtype');
        if (fieldType && fieldType.indexOf("html") > -1)
          readOnlyField.innerHTML = value;
        else
          readOnlyField.innerHTML = htmlEscape(value);
      } else
      if (displayValue && readOnlyField.tagName != "SELECT")
        readOnlyField.value = displayValue;
      else {
        readOnlyField.value = value;
        if (readOnlyField.tagName == "SELECT")
          $j(readOnlyField).trigger('change');
      }
    } else {
      readOnlyField = gel(control.id + "_label");
      if (readOnlyField) {
        displayValue = this._ensureDisplayValue(fieldName, value, displayValue);
        if (readOnlyField.tagName == 'SPAN')
          readOnlyField.innerHTML = displayValue;
        else
          readOnlyField.value = displayValue;
      }
    }
    if (control && control.id && this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].setValue == "function")) {
      this.elementHandlers[control.id].setValue(value, displayValue);
    } else if ('select2' in $j(control).data()) {
      $j(control).select2('val', value);
      onChange(this.tableName + "." + fieldName);
    } else if (control.options) {
      var i = this._getSelectedIndex(control, value, displayValue);
      control.selectedIndex = i;
      onChange(this.tableName + "." + fieldName);
    } else if (control.type == 'hidden') {
      var nibox = this.getNiBox(fieldName);
      if (nibox && nibox.type == 'checkbox') {
        if (value && value == '0')
          value = 'false';
        if (value && value == '1')
          value = 'true';
        control.value = value;
        onChange(this.tableName + "." + fieldName);
        if (value && value == 'false')
          nibox.checked = null;
        else if (value || value == 'true')
          nibox.checked = 'true';
        else
          nibox.checked = null;
        setCheckBox(nibox);
        return;
      }
      var displaybox = this.getDisplayBox(fieldName);
      if (displaybox) {
        var sel = gel("sys_select." + this.tableName + "." + fieldName);
        if (typeof(displayValue) == 'undefined' && value)
          displayValue = this._ensureDisplayValue(fieldName, value, displayValue);
        if (typeof(displayValue) != 'undefined') {
          control.value = value;
          displaybox.value = displayValue;
          onChange(this.tableName + "." + fieldName);
          removeClassName(displaybox, 'ref_invalid');
          removeClassName(displaybox, 'ref_dynamic');
          displaybox.title = "";
          this._setReferenceSelect(control, sel, value, displayValue);
          refFlipImage(displaybox, control.id);
          if (updateRelated) {
            updateRelatedGivenNameAndValue(this.tableName + '.' + fieldName, value);
          }
          return;
        }
        control.value = value;
        onChange(this.tableName + "." + fieldName);
        if (value == null || value == '') {
          displaybox.value = '';
          this._setReferenceSelect(control, sel, value, '');
          refFlipImage(displaybox, control.id);
          return;
        }
        displaybox.value = displayValue;
        this._setReferenceSelect(control, sel, value, displayValue);
        refFlipImage(displaybox, control.id);
        updateRelatedGivenNameAndValue(this.tableName + '.' + fieldName, value);
      } else if ($(control).hasClassName('glide_destroy_filter') || $(control).hasClassName('glideform-set-value')) {
        $j(control).val(value);
        onChange(this.tableName + "." + fieldName);
      } else {
        control.value = value;
        onChange(this.tableName + "." + fieldName);
      }
    } else {
      control.value = value;
      onChange(this.tableName + "." + fieldName);
    }
  },
  _setOriginalValue: function(fieldName, value) {
    var widgetName = "sys_original." + this.tableName + '.' + fieldName;
    var widget = gel(widgetName);
    if (widget)
      widget.value = value;
  },
  _setReferenceSelect: function(control, sel, value, displayValue) {
    if (control && !control.options && sel) {
      var i = this._getSelectedIndex(sel, value, displayValue);
      sel.selectedIndex = i;
    }
  },
  _getSelectedIndex: function(control, value, displayValue) {
    var options = control.options;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option.value == value) {
        return i;
      }
    }
    var dv = value;
    if (typeof(displayValue) != 'undefined')
      dv = displayValue;
    var newOption = new Option(dv, value);
    control.options[control.options.length] = newOption;
    return control.options.length - 1;
  },
  _ensureDisplayValue: function(fieldName, value, displayValue) {
    if (displayValue)
      return displayValue;
    var ed = this.getGlideUIElement(fieldName);
    if (!ed)
      return displayValue;
    if (ed.type != 'reference' && ed.type != 'domain_id')
      return displayValue;
    var ga = new GlideAjax('AjaxClientHelper');
    ga.addParam('sysparm_name', 'getDisplay');
    ga.addParam('sysparm_table', ed.reference);
    ga.addParam('sysparm_value', value);
    ga.getXMLWait();
    return ga.getAnswer();
  },
  getUniqueValue: function() {
    return this.getValue('sys_uniqueValue');
  },
  isDatabaseView: function() {
    var id = this.getUniqueValue();
    return id && id.indexOf('__ENC__') == 0;
  },
  getTitle: function() {
    return this.getValue('sys_titleValue');
  },
  getValue: function(fieldName) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        return handler.getObject().getValue(
          handler.getFieldName());
      return '';
    }
    return this._getValueFromControl(control);
  },
  getDisplayValue: function() {
    return this.getValue('sys_displayValue');
  },
  _getValueFromControl: function(control) {
    var value;
    if (this.elementHandlers[control.id] && (typeof this.elementHandlers[control.id].getValue == "function")) {
      value = this.elementHandlers[control.id].getValue();
    } else {
      value = control.value;
    }
    return (typeof value !== 'undefined') ? value.toString() : '';
  },
  getIntValue: function(fieldName) {
    var val = this.getValue(fieldName);
    if (!val || val.length == 0)
      return 0;
    return parseInt(formatClean(val));
  },
  getDecimalValue: function(fieldName) {
    var val = this.getValue(fieldName);
    if (!val || val.length == 0)
      return 0;
    var fc = formatClean(val);
    fc = fc.replace(/,/g, '.');
    return parseFloat(fc);
  },
  getBooleanValue: function(fieldName) {
    var val = this.getValue(fieldName);
    val = val ? val + '' : val;
    if (!val || val.length == 0 || val == "false")
      return false;
    return true;
  },
  addOption: function(fieldName, choiceValue, choiceLabel, choiceIndex) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        handler.getObject().addOption(handler.getFieldName(), choiceValue, choiceLabel, choiceIndex);
      return;
    }
    if (!control.options)
      return;
    var len = control.options.length;
    for (i = 0; i < len; i++) {
      if (control.options[i].text == choiceLabel) {
        return;
      }
    }
    if (choiceIndex == undefined)
      choiceIndex = len;
    if (choiceIndex < 0 || choiceIndex > len)
      choiceIndex = len;
    var newOption = new Option(choiceLabel, choiceValue);
    var value = choiceValue;
    if (len > 0) {
      value = this.getValue(fieldName);
      control.options[len] = new Option('', '');
      for (var i = len; i > choiceIndex; i--) {
        control.options[i].text = control.options[i - 1].text;
        control.options[i].value = control.options[i - 1].value;
      }
    }
    if (control.readAttribute("readonly") === "readonly")
      newOption.disabled = true;
    control.options[choiceIndex] = newOption;
    this.setValue(fieldName, value);
  },
  enableOption: function(control, choiceValue, choiceLabel) {
    var len = control.options.length;
    for (var i = len - 1; i >= 0; i--) {
      if (control.options[i].text == choiceLabel && control.options[i].value == choiceValue) {
        control.options[i].disabled = false;
        return true;
      }
    }
    return false;
  },
  clearOptions: function(fieldName) {
    fieldName = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(fieldName);
    if (control && !control.options) {
      var name = "sys_select." + this.tableName + "." + fieldName;
      control = gel(name);
    }
    if (!control) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        handler.getObject().clearOptions(handler.getFieldName());
      return;
    }
    if (!control.options)
      return;
    control.innerHTML = '';
  },
  getOptionControl: function(fieldName, choiceValue) {
    var noPrefix = this.removeCurrentPrefix(fieldName);
    var control = this.getControl(noPrefix);
    if (control && !control.options) {
      var name = "sys_select." + this.tableName + "." + noPrefix;
      control = gel(name);
    }
    return control;
  },
  removeOption: function(fieldName, choiceValue) {
    var control = this.getOptionControl(fieldName, choiceValue);
    if (!control)
      return;
    if (!control.options)
      return;
    var options = control.options;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option.value == choiceValue) {
        control.options[i] = null;
        break;
      }
    }
  },
  getOption: function(fieldName, choiceValue) {
    var control = this.getOptionControl(fieldName, choiceValue);
    if (!control)
      return null;
    if (!control.options)
      return null;
    var options = control.options;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option.value == choiceValue)
        return option;
    }
    return null;
  },
  removeContextItem: function(itemID) {
    for (av in contextMenus) {
      if (contextMenus[av]) {
        var menu = contextMenus[av];
        var c = menu.context;
        if (c)
          this.removeItem(menu, itemID);
      }
    }
  },
  removeItem: function(menu, itemID) {
    var items = menu.childNodes;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.innerHTML == itemID) {
        menu.removeChild(item);
        clearNodes(item);
        break;
      }
    }
    return;
  },
  getGlideUIElement: function(fieldName) {
    fieldName = this.removeCurrentPrefix(fieldName);
    for (var i = 0; i < this.elements.length; i++) {
      var thisElement = this.elements[i];
      if (thisElement.fieldName == fieldName)
        return thisElement;
    }
  },
  getDerivedFields: function(fieldName) {
    var parts = fieldName.split(".");
    parts.shift();
    fieldName = parts.join(".") + ".";
    var list = new Array();
    for (var i = 0; i < this.elements.length; i++) {
      var thisElement = this.elements[i];
      if (thisElement.fieldName.indexOf(fieldName) == 0) {
        var target = thisElement.fieldName.substring(fieldName.length);
        list.push(target);
      }
    }
    if (list.length == 0)
      return null;
    return list;
  },
  _addDerivedWaiting: function(fieldName) {
    this.derivedWaiting.push(fieldName);
  },
  _isDerivedWaiting: function(fieldName) {
    var tablePrefix = this.tableName + ".";
    if (fieldName.startsWith(tablePrefix))
      fieldName = fieldName.substring(tablePrefix.length);
    var index = this.derivedWaiting.indexOf(fieldName);
    return (index != -1);
  },
  _removeDerivedWaiting: function(fieldName) {
    var index = this.derivedWaiting.indexOf(fieldName);
    if (index > -1)
      this.derivedWaiting.splice(index, 1);
  },
  getReference: function(fieldName, callback) {
    var opticsContext = null;
    if (window['g_optics_inspect_handler'] && g_optics_inspect_handler.opticsContextStack.length > 0)
      opticsContext = g_optics_inspect_handler.opticsContextStack[g_optics_inspect_handler.opticsContextStack.length - 1];
    fieldName = this.removeCurrentPrefix(fieldName);
    var ed = this.getGlideUIElement(fieldName);
    if (!ed) {
      var handler = this.getPrefixHandler(fieldName);
      if (handler)
        return handler.getObject().getReference(handler.getFieldName(), callback);
      return;
    }
    if (ed.type != 'reference' && ed.type != 'domain_id')
      return;
    var value = this.getValue(fieldName);
    var gr = new GlideRecord(ed.reference);
    if (value == "") {
      if (callback)
        callback(gr);
      return gr;
    }
    if (window.g_event_handlers_localCache && !callback) {
      var cachedObj = window.g_event_handlers_localCache[fieldName];
      if (typeof cachedObj !== 'undefined' && cachedObj.sys_id === value) {
        jslog("GlideForm: getReference cache hit on " + this.getTableName() + "." + fieldName + ":" + value + ", skipped synchronous ajax call");
        return cachedObj;
      }
    }
    gr.addQuery('sys_id', value);
    if (callback) {
      var fn = function(gr) {
        gr.next();
        if (opticsContext)
          CustomEvent.fire('glide_optics_inspect_put_context', opticsContext["category"], opticsContext["name"], opticsContext["sys_id"]);
        callback(gr);
        if (opticsContext)
          CustomEvent.fire('glide_optics_inspect_pop_context');
      };
      gr.query(fn);
      return;
    } else {
      var sw = new StopWatch();
      sw.jslog("*** WARNING *** GlideForm: synchronous getReference call on " + this.getTableName() + " for " + fieldName);
      if (g_event_handlers_queryTracking) {
        gr.addAdditionalParam("sysparm_reference_query_table", this.getTableName());
        gr.addAdditionalParam("sysparm_reference_query_field", fieldName);
      }
    }
    gr.query();
    gr.next();
    return gr;
  },
  submit: function(actionName) {
    actionName = actionName || 'sysverb_update';
    var action = gel(actionName);
    if (!action)
      action = this._getLinkActionByAttribute(actionName);
    if (action)
      return gsftSubmit(action);
  },
  _getLinkActionByAttribute: function(actionName, attribute) {
    var attr = attribute || 'gsft_action_name';
    var selector = 'a[' + attr + '="' + actionName + '"]';
    var el = $j(selector);
    if (el.length === 0)
      return;
    return el[0];
  },
  save: function() {
    return this.submit('sysverb_update_and_stay');
  },
  getActionName: function() {
    var form = this.getFormElement();
    if (form) {
      var theButton = form.sys_action;
      if (theButton)
        return theButton.value;
    }
    return this.action;
  },
  getTableName: function() {
    return this.tableName;
  },
  getSections: function() {
    return $$('form span.tabs2_section span[data-header-only="false"]');
  },
  serialize: function(filterFunc) {
    var formName = this.tableName + '.do';
    if (!filterFunc)
      return Form.serialize(gel(formName)) + this._serializeDisabled();
    var elements = Form.getElements(gel(formName));
    var queryComponents = new Array();
    for (var i = 0; i < elements.length; i++) {
      if (filterFunc(elements[i])) {
        var queryComponent;
        if (elements[i].disabled)
          queryComponent = elements[i].id + '=' + encodeURIComponent(elements[i].value);
        else
          queryComponent = Form.Element.serialize(elements[i]);
        if (queryComponent)
          queryComponents.push(queryComponent);
      }
    }
    return queryComponents.join('&');
  },
  _serializeDisabled: function() {
    var n = this.disabledFields.length;
    var dfa = [];
    for (var i = 0; i < n; i++) {
      var e = this.disabledFields[i];
      if (!e.value || !e.id)
        continue;
      dfa.push(e.id + '=' + encodeURIComponent(e.value));
    }
    if (dfa.length)
      return '&' + dfa.join('&');
    return '';
  },
  serializeChanged: function() {
    var s = this.serializeTargetFields();
    var f = this.serialize(this.changedFieldsFilter.bind(this));
    if (f)
      f = "&" + f;
    return s + f;
  },
  serializeChangedAll: function() {
    var s = this.serializeTargetFields();
    var f = this.serialize(this.allChangedFieldsFilter.bind(this));
    if (f)
      f = "&" + f;
    return s + f;
  },
  serializeTargetFields: function() {
    var s = this._serializeElement("sys_target");
    s += this._serializeElement("sys_uniqueValue");
    s += this._serializeElement("sys_row");
    s += this._serializeElement("sysparm_encoded_record");
    return s;
  },
  _serializeElement: function(id) {
    var e = gel(id);
    if (e) {
      var queryComponent = Form.Element.serialize(e);
      if (queryComponent)
        return "&" + queryComponent;
    }
    return "";
  },
  changedFieldsFilter: function(element) {
    if (element.changed &&
      element.id.startsWith(this.getTableName() + ".") &&
      (element.tagName.toUpperCase() != "TEXTAREA"))
      return true;
    if (element.id.startsWith("ni.VE") || element.id.startsWith("ni.QS")) {
      if (element.id.endsWith("read_only"))
        return false;
      return true;
    }
    if (element.name.startsWith("ni.WATERMARK"))
      return true;
    return false;
  },
  allChangedFieldsFilter: function(element) {
    if (element.changed && element.id.startsWith(this.getTableName() + "."))
      return true;
    return false;
  },
  flash: function(widgetName, color, count) {
    var row = null;
    var labels = new Array();
    var realLabel = this.getLabel(widgetName);
    if (realLabel)
      row = $(realLabel.parentNode.parentNode);
    else {
      jslog("flash() called for '" + widgetName + "' but there is no label for it")
      return;
    }
    var temp = row.select('.label_left');
    for (var i = 0; i < temp.length; i++)
      labels.push(temp[i]);
    temp = row.select('.label_right');
    for (var i = 0; i < temp.length; i++)
      labels.push(temp[i]);
    temp = row.select('.label');
    for (var i = 0; i < temp.length; i++)
      labels.push(temp[i]);
    temp = row.select('.control-label');
    for (var i = 0; i < temp.length; i++)
      labels.push(temp[i]);
    count = count + 1;
    for (var i = 0; i < labels.length; i++) {
      var widget = labels[i];
      if (widget) {
        var originalColor = widget.style.backgroundColor;
        widget.style.backgroundColor = color;
      }
    }
    if (count < 4)
      setTimeout('g_form.flash("' + widgetName + '", "' + originalColor + '", ' + count + ')', 500);
  },
  enable: function() {
    var form = this.getFormElement();
    if (form)
      for (var i = 0; i < form.elements.length; i++)
        form.elements[i].disabled = false;
  },
  disable: function() {
    var form = this.getFormElement();
    if (form)
      for (var i = 0; i < form.elements.length; i++)
        form.elements[i].disabled = true;
  },
  showRelatedList: function(listTableName) {
    CustomEvent.fire('related_lists.show', listTableName);
  },
  hideRelatedList: function(listTableName) {
    CustomEvent.fire('related_lists.hide', listTableName);
  },
  getRelatedListNames: function() {
    if (window.NOW.g_relatedLists)
      return window.NOW.g_relatedLists.lists;
    if (window.g_tabs2List) {
      var relatedListNames = [];
      var trimmedNames = g_tabs2List.tabIDs;
      for (var i = 0; i < trimmedNames.length; i++)
        relatedListNames.push(trimmedNames[i].split('.').slice(1).join('.'));
      return relatedListNames;
    }
    var listWrapper = gel("related_lists_wrapper");
    if (!listWrapper)
      return [];
    var forthcomingTabs = listWrapper.getAttribute('data-lists');
    if (!forthcomingTabs)
      return [];
    return forthcomingTabs.split(',');
  },
  _getRelatedListID: function(listTableName) {
    var relatedList = this.findV2RelatedListName(listTableName);
    var relatedListId;
    if (relatedList)
      relatedListId = relatedList.getAttribute("id");
    if (!relatedListId)
      relatedListId = this.getTableName() + "." + listTableName;
    return relatedListId;
  },
  findV2RelatedListName: function(listTableName) {
    var tableName = this.getTableName();
    var compareId = tableName + "." + listTableName;
    var rlw = gel("related_lists_wrapper");
    if (!rlw)
      return "";
    for (var i = 0; i < rlw.childNodes.length; i++) {
      var node = rlw.childNodes[i];
      if (node.nodeName != "DIV")
        continue;
      var idName = node.getAttribute("id");
      if (idName.length == 0)
        continue;
      if (idName.indexOf(compareId) > -1)
        return node;
    }
    if (typeof GlideLists2 == "undefined")
      return;
    for (var id in GlideLists2) {
      var list = GlideLists2[id];
      if (list.getTableName() == listTableName && list.getParentTable() == tableName)
        return list.getContainer();
    }
    return "";
  },
  showRelatedLists: function() {
    var listNames = g_form.getRelatedListNames();
    for (var i = 0; i < listNames.length; i++) {
      this.showRelatedList(listNames[i]);
    }
  },
  hideRelatedLists: function() {
    var listNames = g_form.getRelatedListNames();
    for (var i = 0; i < listNames.length; i++) {
      this.hideRelatedList(listNames[i]);
    }
  },
  addInfoMessage: function(msg, id) {
    this._addFormMessage(msg, "info", id);
  },
  addWarningMessage: function(msg, id) {
    this._addFormMessage(msg, "warning", id);
  },
  addErrorMessage: function(msg, id) {
    this._addFormMessage(msg, "error", id);
  },
  _addFormMessage: function(msg, type, id) {
    GlideUI.get().addOutputMessage({
      msg: msg,
      type: type,
      id: id
    });
    var scrollDiv = getFormContentParent();
    scrollDiv.scrollTop = 0;
  },
  clearMessages: function() {
    GlideUI.get().clearOutputMessages();
  },
  showFieldMsg: function(input, message, type, scrollForm, key) {
    var msgClass;
    var msgImage;
    var msgImageAlt;
    var msgRowType;
    switch (type) {
      case "info":
        msgClass = this.INFO_CLASS;
        msgRowType = 'info' + this.MSG_ROW;
        break;
      case "error":
        msgClass = this.ERROR_CLASS;
        msgRowType = 'error' + this.MSG_ROW;
        break;
      case "warning":
        msgClass = this.WARNING_CLASS;
        msgRowType = 'warning' + this.MSG_ROW;
        break;
      default:
        type = 'info';
        msgClass = this.INFO_CLASS;
        msgRowType = 'info' + this.MSG_ROW;
        break;
    }
    var inputElement = input;
    if (typeof(inputElement) == "string")
      inputElement = this.getControl(inputElement);
    if (!inputElement) {
      var handler = this.getPrefixHandler(input);
      if (handler) {
        var handlerObject = handler.getObject();
        var fieldName = handler.getFieldName();
        var actualName = handlerObject.getActualName(fieldName);
        inputElement = handlerObject.getControl(actualName);
      }
    }
    if (!inputElement || !message) {
      jslog("ERROR: invalid field or missing message passed to g_form.showFieldMsg('" + input + "','" + message + "')");
      return;
    }
    if (inputElement.id && this.elementHandlers[inputElement.id] && (typeof this.elementHandlers[inputElement.id].showFieldMsg == "function"))
      this.elementHandlers[inputElement.id].showFieldMsg(input, message, type);
    var positionedCursor = this._positionCursorAtError(inputElement, message);
    var fieldRowId = "element." + inputElement.id;
    var fieldRow = document.getElementById(fieldRowId);
    var doc;
    var isVariable = false;
    var variableMsgRow = null;
    if (!fieldRow) {
      var parent = inputElement.parentNode;
      while (parent != null) {
        if (parent.nodeName.toUpperCase() == 'TR') {
          fieldRow = parent;
          isVariable = true;
          break;
        }
        parent = parent.parentNode;
      }
    }
    if (!fieldRow) {
      jslog("Error adding field message. Couldn't find the row to add the field message to.");
      return;
    }
    doc = fieldRow.ownerDocument;
    var inputContainer = inputElement.up('.form-field');
    if (!inputContainer)
      inputContainer = inputElement.up();
    var fieldMsgContainer = inputContainer.down('.fieldmsg-container');
    if (!fieldMsgContainer) {
      fieldMsgContainer = doc.createElement('div');
      fieldMsgContainer.className = 'fieldmsg-container';
      if (isVariable)
        fieldMsgContainer.className = 'variable-field-msg';
      fieldMsgContainer.id = inputElement.id + '_fieldmsg';
      fieldMsgContainer.setAttribute('aria-live', 'polite');
      inputContainer.insert(fieldMsgContainer);
      inputElement.setAttribute('aria-describedby', fieldMsgContainer.id);
      if (inputElement.getAttribute('data-type') === 'glide_element_date_time') {
        var buttonGroupSiblings = inputElement.siblings('.input-group-btn');
        if (buttonGroupSiblings.length > 0) {
          var buttonGroup = buttonGroupSiblings[0];
          var button = buttonGroup.querySelector('.date_time_trigger');
          if (button) {
            button.setAttribute('aria-describedby', fieldMsgContainer.id);
          }
        }
      }
    }
    var fieldMsgRow = doc.createElement('DIV');
    fieldMsgRow.className = msgClass;
    fieldMsgRow.hasFieldmsg = true;
    if (key)
      fieldMsgRow.setAttribute('data-fieldmsg-key', inputElement.id + '_fieldmsg_' + key);
    var fieldmsgMsg = doc.createTextNode(message);
    fieldMsgRow.appendChild(fieldmsgMsg);
    fieldMsgContainer.insert(fieldMsgRow);
    if (!positionedCursor)
      this._scrollToElementTR(fieldRow, fieldMsgRow, scrollForm);
    _frameChanged();
  },
  _scrollToElementTR: function(labelTR, msgTR, scrollForm) {
    var scroll = scrollForm;
    if (typeof scroll == "undefined") {
      var scrollToMsg = gel("ni.scroll_to_messsage_field");
      if (scrollToMsg == null)
        scroll = true;
      else {
        if (scrollToMsg.value != "false")
          scroll = true;
        else
          scroll = false;
      }
    }
    if (!scroll)
      return;
    var scrollDiv = getFormContentParent();
    var refControl = gel("sys_target");
    var ref;
    var titleDiv;
    if (refControl != null) {
      ref = refControl.value;
      titleDiv = gel(ref + ".form_header");
    } else {
      titleDiv = gel("form_header");
    }
    var headerHeight = 0;
    if (titleDiv && titleDiv.clientHeight)
      headerHeight = titleDiv.clientHeight;
    var topOfLabel = grabOffsetTop(labelTR);
    var needToScroll = false;
    if (topOfLabel > scrollDiv.scrollTop + scrollDiv.clientHeight)
      needToScroll = true;
    else if (topOfLabel < scrollDiv.scrollTop + headerHeight)
      needToScroll = true;
    else {
      var topOfMsg = grabOffsetTop(msgTR);
      if (topOfMsg > scrollDiv.scrollTop + scrollDiv.clientHeight)
        needToScroll = true;
    }
    if (!needToScroll)
      return;
    var scrollTopSetting = topOfLabel - headerHeight;
    if (scrollDiv.id)
      setTimeout("$('" + scrollDiv.id + "').scrollTop = " + scrollTopSetting, 100);
    else
      scrollDiv.scrollTop = scrollTopSetting;
  },
  showErrorBox: function(input, message, scrollForm) {
    this.showFieldMsg(input, message, "error", scrollForm);
  },
  hideFieldMsg: function(input, clearAll, key) {
    var inputElement = input;
    if (typeof(inputElement) == "string")
      inputElement = this.getControl(inputElement);
    if (!inputElement) {
      var handler = this.getPrefixHandler(input);
      if (handler) {
        var handlerObject = handler.getObject();
        var fieldName = handler.getFieldName();
        var actualName = handlerObject.getActualName(fieldName);
        inputElement = handlerObject.getControl(actualName);
      }
    }
    if (!inputElement) {
      jslog("ERROR: invalid field ('" + input + "') passed to g_form.hideFieldMsg");
      return;
    }
    if (inputElement.id && this.elementHandlers[inputElement.id] && (typeof this.elementHandlers[inputElement.id].hideFieldMsg == "function"))
      this.elementHandlers[inputElement.id].hideFieldMsg(input, clearAll);
    var fieldTrId = "element." + inputElement.id;
    var tr = document.getElementById(fieldTrId);
    if (!tr) {
      var parent = inputElement.up("div.form-field.input_controls");
      if (!parent)
        parent = inputElement.up("td");
      if (parent) {
        var msgs = $(parent).select(".variable-field-msg");
        if (msgs)
          for (var i = 0; i < msgs.length; i++) {
            try {
              parent.removeChild(msgs[i]);
            } catch (err) {
              msgs[i].parentNode.removeChild(msgs[i]);
            }
            if (!clearAll)
              return;
          }
      }
    }
    if (tr == null)
      return;
    var msgContainer = tr.down('.fieldmsg-container');
    if (!msgContainer)
      return;
    if (clearAll)
      msgContainer.update('');
    else {
      var selector;
      if (key)
        selector = '[data-fieldmsg-key="' + inputElement.id + '_fieldmsg_' + key + '"]';
      else
        selector = '.fieldmsg';
      var messages = msgContainer.select(selector);
      if (messages[0])
        messages[0].remove();
    }
  },
  hasFieldMsgs: function(type) {
    var formHasFieldMsgs = false;
    if (type) {
      var msgTRs = $(document.body).select('.fieldmsg.notification-' + type);
      formHasFieldMsgs = msgTRs.length > 0;
    } else {
      var msgTRs = $(document.body).select('.fieldmsg');
      formHasFieldMsgs = msgTRs.length > 0;
    }
    return formHasFieldMsgs;
  },
  hideAllFieldMsgs: function(type) {
    if (type) {
      var msgTRs = $(document.body).select('.fieldmsg.notification-' + type);
      for (var i = 0; i < msgTRs.length; i++) {
        msgTRs[i].parentNode.removeChild(msgTRs[i]);
      }
    } else {
      var msgTRs = $(document.body).select('.fieldmsg');
      for (var i = 0; i < msgTRs.length; i++) {
        msgTRs[i].parentNode.removeChild(msgTRs[i]);
      }
    }
    CustomEvent.fire('sn.form.hide_all_field_msg', type);
  },
  hideErrorBox: function(input) {
    this.hideFieldMsg(input);
  },
  setStreamJournalFieldsDisplay: function(show) {
    CustomEvent.fire('sn.stream.change_input_display', this.getTableName(), show);
    CustomEvent.fire('sn.form.change_input_display', !show);
  },
  _positionCursorAtError: function(elem, message) {
    if (typeof elem == "undefined" || elem.disabled)
      return false;
    var index = message.indexOf("line (");
    if (index > -1) {
      var parenIndex = message.indexOf(")", index + 6);
      if (parenIndex > -1) {
        var lineNo = message.substring(index + 6, parenIndex);
        lineNo = parseInt(lineNo, 10);
        index = message.indexOf("(", parenIndex);
        if (index > -1) {
          parenIndex = message.indexOf(")", index);
          if (parenIndex > -1) {
            var columnNo = message.substring(index + 1, parenIndex);
            columnNo = parseInt(columnNo, 10);
            return this._setCaretPositionLineColumn(elem, lineNo, columnNo);
          }
        } else
          return this._setCaretPositionLineColumn(elem, lineNo, 1);
      }
    }
    return false;
  },
  _setCaretPositionLineColumn: function(elem, lineNo, columnNo) {
    var pl = 1;
    var data = elem.value;
    var len = data.length;
    var position = 0;
    while (pl < lineNo && position > -1) {
      position = data.indexOf('\n', position);
      if (position > -1)
        position++;
      pl++;
    }
    if (position == -1) {
      jslog("Failed to find editor caret position for error");
      return false;
    }
    position += columnNo - 1;
    if (elem.createTextRange)
      position -= lineNo - 1;
    try {
      this._setCaretPosition(elem, position);
    } catch (err) {
      jslog("Failed to position cursor at the error");
      return false;
    }
    return true;
  },
  _setCaretPosition: function(elem, caretPos) {
    if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.move('character', caretPos);
      range.select();
    } else {
      if (elem.setSelectionRange) {
        if (caretPos == 0)
          caretPos = 1;
        elem.setSelectionRange(caretPos, caretPos + 1);
        if (isSafari || isChrome)
          elem.focus();
        else {
          var ev = document.createEvent("KeyEvents");
          ev.initKeyEvent("keypress", true, true, window, false, false, false, false, 0, elem.value.charCodeAt(caretPos - 1));
          elem.dispatchEvent(ev);
          elem.focus();
        }
      } else
        elem.focus();
    }
  },
  disableAttachments: function() {
    var icon = gel("header_add_attachment");
    if (icon)
      icon.style.display = 'none';
    AttachmentUploader.disableAttachments();
  },
  enableAttachments: function() {
    var icon = gel("header_add_attachment");
    if (icon)
      icon.style.display = '';
    AttachmentUploader.enableAttachments();
  },
  hasField: function(fieldName) {
    return !!this.getControl(fieldName);
  },
  setAction: function(action) {
    this.action = action;
  },
  getAction: function() {
    return this.action;
  },
  setScope: function(scope) {
    this.scope = scope;
  },
  getScope: function() {
    return this.scope;
  },
  setLiveUpdating: function(isLiveUpdating) {
    this._isLiveUpdating = isLiveUpdating;
  },
  isLiveUpdating: function() {
    return this._isLiveUpdating;
  },
  _opticsInspectorLog: function(fieldName, oldValue) {
    var value = this.getValue(fieldName);
    opticsLog(this.getTableName(), fieldName, "Value changed from " +
      (oldValue ? oldValue : "(empty)") + " to " +
      (value ? value : "(empty)"), oldValue, value);
  },
  type: "GlideForm"
});
var GlideFormPrefixHandler = Class.create({
  initialize: function(handlerObject) {
    this.handlerObject = handlerObject;
    this.fieldName = "";
  },
  getObject: function() {
    return this.handlerObject;
  },
  getFieldName: function() {
    return this.fieldName;
  },
  setFieldName: function(id) {
    this.fieldName = id;
  },
  type: "GlideFormPrefixHandler"
});;
/*! RESOURCE: /scripts/doctype/GwtContextMenu.js */
var gActiveContext;
var contextMenus = new Object();
var shortcuts = new Object();
var GwtContextMenu = Class.create({
  SUBMENU_INDICATOR: "<i class='icon-chevron-right context_submenu_indicator'/>",
  initialize: function(id, useBodyAsParent) {
    this.timeout = null;
    this.properties = new Object();
    this.setID(id);
    this.getMenu();
    this.onshow = null;
    this.onhide = null;
    this.beforehide = null;
    this.docRoot = this._getDocRoot();
    this.hasItems = false;
    this.hideOnlySelf = false;
    this.trackSelected = false;
    if (typeof useBodyAsParent == "undefined")
      useBodyAsParent = false;
    this._getParentElement(useBodyAsParent);
  },
  isEmpty: function() {
    return !this.hasItems;
  },
  _getParentElement: function(useBodyAsParent) {
    if (useBodyAsParent) {
      this.parentElement = document.body;
      return;
    }
    this.parentElement = getFormContentParent();
  },
  _getDocRoot: function() {
    var docRoot = window.location.protocol + "//" + window.location.host;
    if (window.location.pathname.indexOf("/") > -1) {
      var fp = window.location.pathname;
      fp = fp.substring(0, fp.lastIndexOf("/"));
      if (fp.substring(0, 1).indexOf("/") != -1)
        docRoot = docRoot + fp;
      else
        docRoot = docRoot + "/" + fp;
    }
    docRoot += "/";
    return docRoot;
  },
  add: function(label, id, keys) {
    this.hasItems = true;
    var m = this.getMenu();
    var d = document.createElement("div");
    d.setAttribute("item_id", id);
    d.className = "context_item";
    d.isMenuItem = true;
    d.setAttribute('role', 'menuitem');
    d.setAttribute('tabindex', '-1');
    var l = !keys ? label : (label + ' (' + keys + ')');
    d.innerHTML = l;
    if (keys)
      d.setAttribute("data-label", label);
    m.appendChild(d);
    return d;
  },
  addHref: function(label, href, img, title, id, keys) {
    keys = this.addKeyShortcut(keys, href);
    var d = this.add(label, id, keys);
    d.setAttribute("href", href);
    if (title && title != null) {
      d.setAttribute("title", title);
      d.addClassName("accessibility_no_tooltip");
    }
    this.setImage(d, img);
    return d;
  },
  addFunc: function(label, func, id) {
    var d = this.add(label, id);
    d.setAttribute("func_set", "true");
    d.func = func;
    return d;
  },
  addURL: function(label, url, target, id) {
    var d = this.add(label, id);
    url = this._updateURL(d, label, url);
    d.setAttribute("url", url);
    if (target)
      d.setAttribute("target", target);
    return d;
  },
  addHrefNoSort: function(label, href, id) {
    var item = this.addHref(label, href, null, null, id);
    item.setAttribute("not_sortable", "true");
    return item;
  },
  addHrefNoFilter: function(label, href, id) {
    var item = this.addHref(label, href, null, null, id);
    item.setAttribute("not_filterable", "true");
    return item;
  },
  addMenu: function(label, menu, id) {
    var item = this.add(label + this.SUBMENU_INDICATOR, id);
    item.setAttribute("aria-haspopup", "true");
    item.setAttribute("aria-controls", menu.id);
    item.setAttribute("label", "true");
    menu.setParent(this);
    item.subMenu = menu;
    return item;
  },
  addAction: function(label, action, id) {
    return this.addHref(label, "contextAction('" + this.getTableName() + "', '" + action + "')", null, null, id);
  },
  addConfirmedAction: function(label, action, id) {
    return this.addHref(label, "contextConfirm('" + this.getTableName() + "', '" + action + "')", null, null, id);
  },
  addLine: function() {
    this.hasItems = true;
    var m = this.getMenu();
    var d = document.createElement("div");
    d.className = "context_item_hr";
    d.isMenuItem = true;
    d.disabled = "disabled";
    m.appendChild(d);
    return d;
  },
  addLabel: function(label, id) {
    var m = this.getMenu();
    var d = document.createElement("div");
    d.setAttribute("item_id", id);
    d.className = "context_item";
    d.isMenuItem = true;
    d.innerHTML = label;
    d.disabled = "disabled";
    m.appendChild(d);
    return d;
  },
  addKeyShortcut: function(keys, href) {
    var topWindow = getTopWindow();
    var keyboardEnabled = topWindow.com && topWindow.com.glide && topWindow.com.glide.ui && topWindow.com.glide.ui.keyboard;
    if (!keyboardEnabled)
      return null;
    if (!keys)
      return keys;
    if (shortcuts[keys])
      return keys;
    shortcuts[keys] = {};
    var callback = function(e) {
      var start = e.data.href.indexOf('javascript:') == 0 ? 11 : 0;
      var startParen = e.data.href.indexOf('(');
      var functionName = startParen > start ? e.data.href.substring(start, startParen) : {};
      var func = eval(functionName);
      if (typeof func == 'function')
        eval(e.data.href);
      else
        document.location.href = e.data.href;
    };
    addLoadEvent(function() {
      var keyboard = getTopWindow().com.glide.ui.keyboard;
      var isMainFrame = window.frameElement.id == keyboard.mainFrame;
      var isFormFrame = window.frameElement.id == keyboard.formFrame;
      if (isMainFrame)
        shortcuts[keys] = keyboard.bind(keys, callback, {
          href: href
        }).global(keyboard.formFrame);
      else if (isFormFrame)
        shortcuts[keys] = keyboard.bind(keys, callback, {
          href: href
        }).formFrame();
      else
        shortcuts[keys] = null;
    });
    return keys;
  },
  getItem: function(itemId) {
    var items = this.getMenu().getElementsByTagName("div");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.getAttribute("item_id") == itemId)
        return item;
    }
    return null;
  },
  setImage: function(item, img) {
    if (item && img) {
      item.style.backgroundImage = "url(" + this.docRoot + img + ")";
      item.style.backgroundRepeat = "no-repeat";
    }
  },
  setChecked: function(item) {
    if (item)
      this.setImage(item, "images/checked.pngx");
  },
  clearImage: function(item) {
    if (item) {
      item.style.backgroundImage = "";
      item.style.backgroundRepeat = "";
    }
  },
  setDisabled: function(item) {
    if (!item)
      return;
    this._dullItem(item);
  },
  setEnabled: function(item) {
    if (!item)
      return;
    this._undullItem(item);
  },
  setHidden: function(item) {
    if (!item)
      return;
    this._hideItem(item);
  },
  setVisible: function(item) {
    if (!item)
      return;
    this._showItem(item);
  },
  setLabel: function(item, label) {
    if (item)
      item.innerHTML = label;
  },
  setHideOnlySelf: function(hideSelf) {
    this.hideOnlySelf = hideSelf;
  },
  clearSelected: function() {
    var items = this.getMenu().getElementsByTagName("div");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.isMenuItem)
        this.clearImage(item);
    }
  },
  clear: function() {
    var m = this.getMenu();
    clearNodes(m);
    this._setMinWidth();
    this.hasItems = false;
  },
  destroy: function() {
    this.parentElement = null;
    this.menu.context = null;
    this.menu.onmouseover = null;
    this.menu.onmouseout = null;
    this.menu.onclick = null;
    if (isMSIE)
      this.menu.outerHTML = null;
    this.parentMenu = null;
    this.onshow = null;
    this.onhide = null;
    this.properties = null;
    this.timeout = null;
    this.menu = null;
  },
  display: function(e) {
    if (!this.getParent())
      CustomEvent.fireAll('body_clicked', null);
    menuSort = true;
    this._dullMenu();
    this._toggleMenuItems("not_sortable", this.getProperty('sortable'));
    this._toggleMenuItems("not_filterable", this.getProperty('filterable'));
    this.setFiringObject(this._getElement(e));
    e = this._getRealEvent(e);
    var menu = this.getMenu();
    if (this._isEmpty(menu))
      return;
    menu.style.left = "0";
    menu.style.top = "0";
    this.parentElement.appendChild(menu);
    if (this.getProperty("top") > 0 && ((this.getProperty("left") > 0) || (this.getProperty("right") > 0))) {
      menu.style.visibility = 'hidden';
      menu.style.display = 'block';
      this.moveMenuToXY(e, this.getProperty("left"), this.getProperty("top"), this.getProperty("right"));
    } else if (this.getParent()) {
      var x = this._getElement(e);
      menu.style.visibility = 'hidden';
      menu.style.display = 'block';
      this.moveMenuToParent(e, x);
    } else {
      var x = this._getElement(e);
      menu.style.visibility = 'hidden';
      menu.style.display = 'block';
      this.moveMenuToCursor(e);
    }
    gActiveContext = this;
    showObject(menu);
    this._focusFirstItem(menu);
  },
  hide: function() {
    gActiveContext = "";
    hideObject(this.getMenu());
    if (this.getMenu().parentNode)
      this.getMenu().parentNode.removeChild(this.getMenu());
    if (this.onhide)
      this.onhide();
    if (this.getFiringObject())
      this.getFiringObject().focus();
    CustomEvent.fire('refresh.event');
  },
  hideAll: function() {
    var m = this;
    while (m) {
      m.hide();
      m = m.getParent();
    }
  },
  execute: function(e) {
    var x = this._getElement(e);
    if (x.isMenuItem && !x.disabled) {
      if (x.getAttribute("label") == "true") {
        this._getRealEvent(e).cancelBubble = true;
        return;
      }
      if (x.getAttribute("target")) {
        window.open(x.getAttribute("url"), x.getAttribute("target"));
      } else if (x.getAttribute("href")) {
        var expression = x.getAttribute("href");
        gActiveContext = this;
        eval(expression);
      } else if (x.getAttribute("func_set") == "true") {
        x.func();
      } else {
        window.location = x.getAttribute("url");
      }
      if (this.trackSelected) {
        this.clearSelected();
        this.setChecked(x);
      }
    }
    if (x.subMenu)
      x.subMenu.hideAll();
    else
      this.hideAll();
    return false;
  },
  menuLowLight: function(e) {
    var x = this._getElement(e);
    this._handleTimeout(false, x);
    if (!x.isMenuItem)
      return;
    if (!x.subMenu || x.subMenu.getMenu().style.display == 'none')
      this._disableItem(x);
    window.status = '';
    CustomEvent.fire('refresh.event');
  },
  menuHighLight: function(e) {
    var x = this._getElement(e);
    this._handleTimeout(true, x);
    if (!x.isMenuItem)
      return;
    this._hideAllSubs(x.parentNode);
    this._enableItem(x);
    if (x.subMenu)
      this._expandSubMenu(x, e);
  },
  _expandSubMenu: function(menu, evt) {
    menu.subMenu.setParent(this);
    menu.subMenu.display(evt);
  },
  menuKeyDown: function(e) {
    var x = this._getElement(e);
    var handled = false;
    switch (e.keyCode) {
      case 9:
      case 27:
        this.hide();
        handled = true;
        break;
      case 13:
        if (x.subMenu)
          this._expandSubMenu(x, e);
        else
          this.execute(e)
        handled = true;
        break;
      case 40:
        this._dullMenu();
        this._focusNext(x);
        handled = true;
        break;
      case 38:
        this._dullMenu();
        this._focusPrevious(x);
        handled = true;
        break;
      case 39:
        if (x.subMenu)
          this._expandSubMenu(x, e);
        handled = true;
        break;
      case 37:
        var parentMenu = this.getParent();
        if (parentMenu && parentMenu.menu) {
          var parent = parentMenu.menu.select('[aria-controls="' + this.id + '"]');
          parent[0].focus();
          this._hideAllSubs(parentMenu.menu);
        }
        handled = true;
        break;
    }
    if (handled) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  _focusNext: function(item) {
    var nextSibling = item.nextSibling;
    while (nextSibling && (nextSibling.classList.contains('context_item_hr') || nextSibling.style.display == 'none'))
      nextSibling = nextSibling.nextSibling;
    if (nextSibling)
      nextSibling.focus();
  },
  _focusPrevious: function(item) {
    var previousSibling = item.previousSibling;
    while (previousSibling &&
      (previousSibling.classList.contains('context_item_hr') ||
        previousSibling.classList.contains('context-menu-minwidth') ||
        previousSibling.style.display == 'none')) {
      previousSibling = previousSibling.previousSibling;
    }
    if (previousSibling)
      previousSibling.focus();
  },
  moveMenuToXY: function(e, left, top, right) {
    var menu = this.getMenu();
    if (right)
      left = right - menu.offsetWidth;
    var offsetTop = window.pageYOffset + top;
    var offsetLeft = window.pageXOffset + left;
    this.moveMenu(top, left, 0, 0, offsetTop, offsetLeft);
  },
  moveMenuToCursor: function(e) {
    var offsetTop = 0;
    var offsetLeft = 0;
    var clientY = e.clientY;
    var clientX = e.clientX;
    if (isTouchDevice) {
      offsetTop = e.pageY;
      offsetLeft = e.pageX;
    } else if (!e.clientX && e.target) {
      var $target = $j(e.target);
      var rect = e.target.getBoundingClientRect();
      offsetTop = clientY = rect.top + $target.height();
      offsetLeft = clientX = rect.left + $target.width();
    } else {
      offsetTop = e.clientY;
      offsetLeft = e.clientX;
    }
    this.moveMenu(clientY, clientX, 0, 0, offsetTop, offsetLeft);
  },
  moveMenuToParent: function(e, firingObject) {
    var parent = this.getParent().getMenu();
    var offsetTop = grabOffsetTop(firingObject) - parent.scrollTop;
    var borderLeftWidth = parseInt($j(this.getParent().getMenu()).css('border-right-width'), 10);
    var offsetLeft = grabOffsetLeft(parent) - borderLeftWidth;
    this.moveMenu(offsetTop, offsetLeft, firingObject.offsetHeight, parent.offsetWidth, offsetTop, offsetLeft);
  },
  moveMenu: function(top, left, height, width, offsetTop, offsetLeft) {
    var menu = this.getMenu();
    menu.style.overflowY = "visible";
    menu.setAttribute('gsft_has_scroll', false);
    if (menu.getAttribute('gsft_width'))
      menu.style.width = menu.getAttribute('gsft_width') + "px";
    if (menu.getAttribute('gsft_height'))
      menu.style.height = menu.getAttribute('gsft_height') + "px";
    var leftPos;
    var viewport = new WindowSize();
    if ((left + width + menu.offsetWidth) > viewport.width)
      leftPos = offsetLeft - menu.offsetWidth;
    else
      leftPos = offsetLeft + width;
    menu.style.left = leftPos + "px";
    var scrollOffsets = this._getScrollOffsets(this.parentElement);
    var scrollTop = scrollOffsets.top;
    var direction = 'down';
    var clip = 0;
    if ((top + menu.offsetHeight) > viewport.height) {
      var bottomClip = menu.offsetHeight - (viewport.height - top);
      var topClip = menu.offsetHeight - top + height;
      if (topClip < bottomClip) {
        direction = 'up';
        clip = topClip;
      } else
        clip = bottomClip;
    }
    var topPos;
    if (direction == 'up') {
      var mHeight = menu.offsetHeight;
      var bottomEdge = offsetTop + height;
      topPos = (bottomEdge > mHeight) ? (bottomEdge - mHeight) : 0;
    } else
      topPos = offsetTop;
    if ((topPos - scrollTop + menu.offsetHeight) > viewport.height)
      clip = (topPos - scrollTop + menu.offsetHeight) - viewport.height;
    menu.style.top = topPos + "px";
    if (clip > 0) {
      if (!menu.getAttribute('gsft_width')) {
        menu.setAttribute('gsft_width', menu.offsetWidth);
        menu.setAttribute('gsft_height', menu.offsetHeight);
      }
      menu.setAttribute('gsft_has_scroll', true);
      menu.style.overflowY = "auto";
      var w = menu.offsetWidth + 18;
      menu.style.width = w + "px";
      var h = menu.offsetHeight - clip - 4;
      menu.style.height = h + "px";
    }
  },
  _getScrollOffsets: function(e) {
    var offsets = {};
    if (e.nodeName.toUpperCase() == "BODY") {
      offsets.top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      offsets.left = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
    } else {
      offsets.top = e.scrollTop;
      offsets.left = e.scrollLeft;
    }
    return offsets;
  },
  getFiringObject: function() {
    return this.eventObject;
  },
  getID: function() {
    return this.id;
  },
  getMenu: function() {
    if (!this.menu) {
      this.menu = contextMenus[this.getID()];
      if (!this.menu)
        this._createMenu();
      this._setMenuAttrs();
      this._setMinWidth();
    }
    return this.menu;
  },
  getParent: function() {
    return this.parentMenu;
  },
  getProperty: function(c) {
    if (this.properties)
      return this.properties[c];
    else
      return "";
  },
  getTableName: function() {
    return this.tableName;
  },
  setFiringObject: function(e) {
    this.eventObject = e;
  },
  setID: function(id) {
    this.id = id;
  },
  setOnShow: function(onshow) {
    this.onshow = onshow;
  },
  setOnHide: function(oh) {
    this.onhide = oh;
  },
  setBeforeHide: function(beforeHide) {
    this.beforehide = beforeHide;
  },
  setParent: function(m) {
    this.parentMenu = m;
    this.parentElement = m.parentElement;
  },
  setProperty: function(c, v) {
    this.properties[c] = v;
  },
  setTableName: function(name) {
    this.tableName = name;
  },
  setTimeout: function(t) {
    this.timeout = t;
  },
  setTrackSelected: function(flag) {
    this.trackSelected = flag;
  },
  _createMenu: function() {
    this.menu = document.createElement("div");
    this.menu.name = this.menu.id = this.getID();
    contextMenus[this.getID()] = this.menu;
  },
  _disableItem: function(item) {
    if (item && !item.disabled) {
      removeClassName(item, "context_menu_hover");
    }
  },
  _dullMenu: function() {
    var items = this.getMenu().childNodes;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      this._disableItem(item);
    }
  },
  _enableItem: function(item) {
    if (item && !item.disabled) {
      addClassName(item, "context_menu_hover");
      item.focus();
    }
  },
  _getElement: function(e) {
    var x = e.target;
    try {
      if (!x.isMenuItem && x.parentNode.isMenuItem)
        x = x.parentNode;
    } catch (err) {}
    return x;
  },
  _getRealEvent: function(e) {
    return e;
  },
  _handleTimeout: function(lght, firingObject) {
    if (this.getProperty("timeout") > 0) {
      if (lght) {
        clearTimeout(this.timeout);
      } else {
        if (!firingObject.subMenu || firingObject.subMenu != gActiveContext)
          this.timeout = setTimeout('contextHide()', this.getProperty("timeout"));
      }
    }
  },
  _hideAllSubs: function(el) {
    var list = el.getElementsByTagName("div");
    for (var i = 0; i < list.length; i++) {
      var element = list[i];
      if (element.subMenu) {
        var subMenu = element.subMenu.getMenu();
        this._hideAllSubs(element.subMenu.getMenu());
        hideObject(subMenu);
        this._disableItem(element);
      }
    }
  },
  _setMenuAttrs: function() {
    this.menu.context = this;
    this.menu.className = "context_menu";
    this.menu.style.display = "none";
    this.menu.style.zIndex = (this.getParent() ? GwtContextMenu.zIndex + 1 : GwtContextMenu.zIndex);
    this.menu.setAttribute('role', 'menu');
    this.menu.onmouseover = this.menuHighLight.bind(this);
    this.menu.onmouseout = this.menuLowLight.bind(this);
    this.menu.onkeydown = this.menuKeyDown.bind(this);
    if ("ontouchstart" in window && (typeof FastButton != 'undefined'))
      new FastButton(this.menu, this.execute.bind(this));
    else
      this.menu.onclick = this.execute.bind(this);
  },
  _setMinWidth: function() {
    var widther = document.createElement("div");
    widther.style.width = "120px";
    widther.style.height = "1px";
    widther.style.overflow = "hidden";
    widther.className = 'context-menu-minwidth';
    this.menu.appendChild(widther);
  },
  _toggleMenuItems: function(attr, enabled) {
    var items = this.getMenu().childNodes;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.getAttribute(attr) == "true") {
        if (enabled) {
          this._undullItem(item);
        } else {
          this._dullItem(item);
        }
      }
    }
  },
  _dullItem: function(item) {
    item.disabled = "disabled";
    item.style.color = "#cccccc";
    removeClassName(item, "context_menu_hover");
  },
  _undullItem: function(item) {
    item.disabled = "";
    item.style.color = "";
  },
  _hideItem: function(item) {
    item.style.display = 'none';
  },
  _showItem: function(item) {
    item.style.display = '';
  },
  _isEmpty: function(menu) {
    if (!menu)
      return true;
    if (!menu.firstChild)
      return true;
    return false;
  },
  _updateURL: function(d, label, url) {
    if (typeof GlideTransactionScope != 'undefined') {
      GlideTransactionScope.appendTransactionScope(function(name, value) {
        url += "&" + name + "=" + value;
      });
      return url;
    }
    if (typeof g_form != 'undefined') {
      this.dmap = this.dmap || {};
      this.dmap[label] = d;
      $(g_form.getFormElement()).observe('glidescope:initialized', function(e) {
        e.memo.gts.appendTransactionScope(function(name, value) {
          var _d = this.dmap[label];
          var _url = _d.getAttribute("url");
          _url += "&" + name + "=" + value;
          _d.setAttribute("url", _url);
        }.bind(this));
      }.bind(this));
    }
    return url;
  },
  _focusFirstItem: function(menu) {
    var contextItems = $(menu).select('.context_item');
    var firstItem = contextItems.shift();
    while (firstItem.style.display == 'none' && contextItems.length > 0)
      firstItem = contextItems.shift();
    if (firstItem)
      firstItem.focus();
  },
  z: function() {}
});
GwtContextMenu.zIndex = 1100;

function displayContextMenu(e, name, filterable) {
  if (!getMenuByName(name))
    return;
  var contextMenu = getMenuByName(name).context;
  contextMenu.setProperty('sortable', true);
  contextMenu.setProperty('filterable', filterable);
  contextMenu.display(e);
}

function contextShow(e, tableName, timeoutValue, ttop, lleft, rright) {
  var frameWindow = null;
  try {
    frameWindow = window.frameElement;
    if (frameWindow