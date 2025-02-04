(function (window, undefined) {
  var document = window.document,
    navigator = window.navigator,
    location = window.location;
  var jQuery = (function () {
    var jQuery = function (selector, context) {
        return new jQuery.fn.init(selector, context, rootjQuery);
      },
      _jQuery = window.jQuery,
      _$ = window.$,
      rootjQuery,
      quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
      rnotwhite = /\S/,
      trimLeft = /^\s+/,
      trimRight = /\s+$/,
      rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
      rvalidchars = /^[\],:{}\s]*$/,
      rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
      rvalidtokens =
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
      rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
      rwebkit = /(webkit)[ \/]([\w.]+)/,
      ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
      rmsie = /(msie) ([\w.]+)/,
      rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
      rdashAlpha = /-([a-z]|[0-9])/gi,
      rmsPrefix = /^-ms-/,
      fcamelCase = function (all, letter) {
        return (letter + '').toUpperCase();
      },
      userAgent = navigator.userAgent,
      browserMatch,
      readyList,
      DOMContentLoaded,
      toString = Object.prototype.toString,
      hasOwn = Object.prototype.hasOwnProperty,
      push = Array.prototype.push,
      slice = Array.prototype.slice,
      trim = String.prototype.trim,
      indexOf = Array.prototype.indexOf,
      class2type = {};
    jQuery.fn = jQuery.prototype = {
      constructor: jQuery,
      init: function (selector, context, rootjQuery) {
        var match, elem, ret, doc;
        if (!selector) {
          return this;
        }
        if (selector.nodeType) {
          this.context = this[0] = selector;
          this.length = 1;
          return this;
        }
        if (selector === 'body' && !context && document.body) {
          this.context = document;
          this[0] = document.body;
          this.selector = selector;
          this.length = 1;
          return this;
        }
        if (typeof selector === 'string') {
          if (
            selector.charAt(0) === '<' &&
            selector.charAt(selector.length - 1) === '>' &&
            selector.length >= 3
          ) {
            match = [null, selector, null];
          } else {
            match = quickExpr.exec(selector);
          }
          if (match && (match[1] || !context)) {
            if (match[1]) {
              context = context instanceof jQuery ? context[0] : context;
              doc = context ? context.ownerDocument || context : document;
              ret = rsingleTag.exec(selector);
              if (ret) {
                if (jQuery.isPlainObject(context)) {
                  selector = [document.createElement(ret[1])];
                  jQuery.fn.attr.call(selector, context, true);
                } else {
                  selector = [doc.createElement(ret[1])];
                }
              } else {
                ret = jQuery.buildFragment([match[1]], [doc]);
                selector = (
                  ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment
                ).childNodes;
              }
              return jQuery.merge(this, selector);
            } else {
              elem = document.getElementById(match[2]);
              if (elem && elem.parentNode) {
                if (elem.id !== match[2]) {
                  return rootjQuery.find(selector);
                }
                this.length = 1;
                this[0] = elem;
              }
              this.context = document;
              this.selector = selector;
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || rootjQuery).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (jQuery.isFunction(selector)) {
          return rootjQuery.ready(selector);
        }
        if (selector.selector !== undefined) {
          this.selector = selector.selector;
          this.context = selector.context;
        }
        return jQuery.makeArray(selector, this);
      },
      selector: '',
      jquery: '1.7.1',
      length: 0,
      size: function () {
        return this.length;
      },
      toArray: function () {
        return slice.call(this, 0);
      },
      get: function (num) {
        return num == null
          ? this.toArray()
          : num < 0
          ? this[this.length + num]
          : this[num];
      },
      pushStack: function (elems, name, selector) {
        var ret = this.constructor();
        if (jQuery.isArray(elems)) {
          push.apply(ret, elems);
        } else {
          jQuery.merge(ret, elems);
        }
        ret.prevObject = this;
        ret.context = this.context;
        if (name === 'find') {
          ret.selector = this.selector + (this.selector ? ' ' : '') + selector;
        } else if (name) {
          ret.selector = this.selector + '.' + name + '(' + selector + ')';
        }
        return ret;
      },
      each: function (callback, args) {
        return jQuery.each(this, callback, args);
      },
      ready: function (fn) {
        jQuery.bindReady();
        readyList.add(fn);
        return this;
      },
      eq: function (i) {
        i = +i;
        return i === -1 ? this.slice(i) : this.slice(i, i + 1);
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      slice: function () {
        return this.pushStack(
          slice.apply(this, arguments),
          'slice',
          slice.call(arguments).join(',')
        );
      },
      map: function (callback) {
        return this.pushStack(
          jQuery.map(this, function (elem, i) {
            return callback.call(elem, i, elem);
          })
        );
      },
      end: function () {
        return this.prevObject || this.constructor(null);
      },
      push: push,
      sort: [].sort,
      splice: [].splice,
    };
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.extend = jQuery.fn.extend = function () {
      var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== 'object' && !jQuery.isFunction(target)) {
        target = {};
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue;
            }
            if (
              deep &&
              copy &&
              (jQuery.isPlainObject(copy) ||
                (copyIsArray = jQuery.isArray(copy)))
            ) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              target[name] = jQuery.extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    };
    jQuery.extend({
      noConflict: function (deep) {
        if (window.$ === jQuery) {
          window.$ = _$;
        }
        if (deep && window.jQuery === jQuery) {
          window.jQuery = _jQuery;
        }
        return jQuery;
      },
      isReady: false,
      readyWait: 1,
      holdReady: function (hold) {
        if (hold) {
          jQuery.readyWait++;
        } else {
          jQuery.ready(true);
        }
      },
      ready: function (wait) {
        if (
          (wait === true && !--jQuery.readyWait) ||
          (wait !== true && !jQuery.isReady)
        ) {
          if (!document.body) {
            return setTimeout(jQuery.ready, 1);
          }
          jQuery.isReady = true;
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }
          readyList.fireWith(document, [jQuery]);
          if (jQuery.fn.trigger) {
            jQuery(document).trigger('ready').off('ready');
          }
        }
      },
      bindReady: function () {
        if (readyList) {
          return;
        }
        readyList = jQuery.Callbacks('once memory');
        if (document.readyState === 'complete') {
          return setTimeout(jQuery.ready, 1);
        }
        if (document.addEventListener) {
          document.addEventListener(
            'DOMContentLoaded',
            DOMContentLoaded,
            false
          );
          window.addEventListener('load', jQuery.ready, false);
        } else if (document.attachEvent) {
          document.attachEvent('onreadystatechange', DOMContentLoaded);
          window.attachEvent('onload', jQuery.ready);
          var toplevel = false;
          try {
            toplevel = window.frameElement == null;
          } catch (e) {}
          if (document.documentElement.doScroll && toplevel) {
            doScrollCheck();
          }
        }
      },
      isFunction: function (obj) {
        return jQuery.type(obj) === 'function';
      },
      isArray:
        Array.isArray ||
        function (obj) {
          return jQuery.type(obj) === 'array';
        },
      isWindow: function (obj) {
        return obj && typeof obj === 'object' && 'setInterval' in obj;
      },
      isNumeric: function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
      },
      type: function (obj) {
        return obj == null
          ? String(obj)
          : class2type[toString.call(obj)] || 'object';
      },
      isPlainObject: function (obj) {
        if (
          !obj ||
          jQuery.type(obj) !== 'object' ||
          obj.nodeType ||
          jQuery.isWindow(obj)
        ) {
          return false;
        }
        try {
          if (
            obj.constructor &&
            !hasOwn.call(obj, 'constructor') &&
            !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
          ) {
            return false;
          }
        } catch (e) {
          return false;
        }
        var key;
        for (key in obj) {
        }
        return key === undefined || hasOwn.call(obj, key);
      },
      isEmptyObject: function (obj) {
        for (var name in obj) {
          return false;
        }
        return true;
      },
      error: function (msg) {
        throw new Error(msg);
      },
      parseJSON: function (data) {
        if (typeof data !== 'string' || !data) {
          return null;
        }
        data = jQuery.trim(data);
        if (window.JSON && window.JSON.parse) {
          return window.JSON.parse(data);
        }
        if (
          rvalidchars.test(
            data
              .replace(rvalidescape, '@')
              .replace(rvalidtokens, ']')
              .replace(rvalidbraces, '')
          )
        ) {
          return new Function('return ' + data)();
        }
        jQuery.error('Invalid JSON: ' + data);
      },
      parseXML: function (data) {
        var xml, tmp;
        try {
          if (window.DOMParser) {
            tmp = new DOMParser();
            xml = tmp.parseFromString(data, 'text/xml');
          } else {
            xml = new ActiveXObject('Microsoft.XMLDOM');
            xml.async = 'false';
            xml.loadXML(data);
          }
        } catch (e) {
          xml = undefined;
        }
        if (
          !xml ||
          !xml.documentElement ||
          xml.getElementsByTagName('parsererror').length
        ) {
          jQuery.error('Invalid XML: ' + data);
        }
        return xml;
      },
      noop: function () {},
      globalEval: function (data) {
        if (data && rnotwhite.test(data)) {
          (
            window.execScript ||
            function (data) {
              window['eval'].call(window, data);
            }
          )(data);
        }
      },
      camelCase: function (string) {
        return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
      },
      nodeName: function (elem, name) {
        return (
          elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase()
        );
      },
      each: function (object, callback, args) {
        var name,
          i = 0,
          length = object.length,
          isObj = length === undefined || jQuery.isFunction(object);
        if (args) {
          if (isObj) {
            for (name in object) {
              if (callback.apply(object[name], args) === false) {
                break;
              }
            }
          } else {
            for (; i < length; ) {
              if (callback.apply(object[i++], args) === false) {
                break;
              }
            }
          }
        } else {
          if (isObj) {
            for (name in object) {
              if (callback.call(object[name], name, object[name]) === false) {
                break;
              }
            }
          } else {
            for (; i < length; ) {
              if (callback.call(object[i], i, object[i++]) === false) {
                break;
              }
            }
          }
        }
        return object;
      },
      trim: trim
        ? function (text) {
            return text == null ? '' : trim.call(text);
          }
        : function (text) {
            return text == null
              ? ''
              : text.toString().replace(trimLeft, '').replace(trimRight, '');
          },
      makeArray: function (array, results) {
        var ret = results || [];
        if (array != null) {
          var type = jQuery.type(array);
          if (
            array.length == null ||
            type === 'string' ||
            type === 'function' ||
            type === 'regexp' ||
            jQuery.isWindow(array)
          ) {
            push.call(ret, array);
          } else {
            jQuery.merge(ret, array);
          }
        }
        return ret;
      },
      inArray: function (elem, array, i) {
        var len;
        if (array) {
          if (indexOf) {
            return indexOf.call(array, elem, i);
          }
          len = array.length;
          i = i ? (i < 0 ? Math.max(0, len + i) : i) : 0;
          for (; i < len; i++) {
            if (i in array && array[i] === elem) {
              return i;
            }
          }
        }
        return -1;
      },
      merge: function (first, second) {
        var i = first.length,
          j = 0;
        if (typeof second.length === 'number') {
          for (var l = second.length; j < l; j++) {
            first[i++] = second[j];
          }
        } else {
          while (second[j] !== undefined) {
            first[i++] = second[j++];
          }
        }
        first.length = i;
        return first;
      },
      grep: function (elems, callback, inv) {
        var ret = [],
          retVal;
        inv = !!inv;
        for (var i = 0, length = elems.length; i < length; i++) {
          retVal = !!callback(elems[i], i);
          if (inv !== retVal) {
            ret.push(elems[i]);
          }
        }
        return ret;
      },
      map: function (elems, callback, arg) {
        var value,
          key,
          ret = [],
          i = 0,
          length = elems.length,
          isArray =
            elems instanceof jQuery ||
            (length !== undefined &&
              typeof length === 'number' &&
              ((length > 0 && elems[0] && elems[length - 1]) ||
                length === 0 ||
                jQuery.isArray(elems)));
        if (isArray) {
          for (; i < length; i++) {
            value = callback(elems[i], i, arg);
            if (value != null) {
              ret[ret.length] = value;
            }
          }
        } else {
          for (key in elems) {
            value = callback(elems[key], key, arg);
            if (value != null) {
              ret[ret.length] = value;
            }
          }
        }
        return ret.concat.apply([], ret);
      },
      guid: 1,
      proxy: function (fn, context) {
        if (typeof context === 'string') {
          var tmp = fn[context];
          context = fn;
          fn = tmp;
        }
        if (!jQuery.isFunction(fn)) {
          return undefined;
        }
        var args = slice.call(arguments, 2),
          proxy = function () {
            return fn.apply(context, args.concat(slice.call(arguments)));
          };
        proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
        return proxy;
      },
      access: function (elems, key, value, exec, fn, pass) {
        var length = elems.length;
        if (typeof key === 'object') {
          for (var k in key) {
            jQuery.access(elems, k, key[k], exec, fn, value);
          }
          return elems;
        }
        if (value !== undefined) {
          exec = !pass && exec && jQuery.isFunction(value);
          for (var i = 0; i < length; i++) {
            fn(
              elems[i],
              key,
              exec ? value.call(elems[i], i, fn(elems[i], key)) : value,
              pass
            );
          }
          return elems;
        }
        return length ? fn(elems[0], key) : undefined;
      },
      now: function () {
        return new Date().getTime();
      },
      uaMatch: function (ua) {
        ua = ua.toLowerCase();
        var match =
          rwebkit.exec(ua) ||
          ropera.exec(ua) ||
          rmsie.exec(ua) ||
          (ua.indexOf('compatible') < 0 && rmozilla.exec(ua)) ||
          [];
        return { browser: match[1] || '', version: match[2] || '0' };
      },
      sub: function () {
        function jQuerySub(selector, context) {
          return new jQuerySub.fn.init(selector, context);
        }
        jQuery.extend(true, jQuerySub, this);
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init(selector, context) {
          if (
            context &&
            context instanceof jQuery &&
            !(context instanceof jQuerySub)
          ) {
            context = jQuerySub(context);
          }
          return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
      },
      browser: {},
    });
    jQuery.each(
      'Boolean Number String Function Array Date RegExp Object'.split(' '),
      function (i, name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
      }
    );
    browserMatch = jQuery.uaMatch(userAgent);
    if (browserMatch.browser) {
      jQuery.browser[browserMatch.browser] = true;
      jQuery.browser.version = browserMatch.version;
    }
    if (jQuery.browser.webkit) {
      jQuery.browser.safari = true;
    }
    if (rnotwhite.test('\xA0')) {
      trimLeft = /^[\s\xA0]+/;
      trimRight = /[\s\xA0]+$/;
    }
    rootjQuery = jQuery(document);
    if (document.addEventListener) {
      DOMContentLoaded = function () {
        document.removeEventListener(
          'DOMContentLoaded',
          DOMContentLoaded,
          false
        );
        jQuery.ready();
      };
    } else if (document.attachEvent) {
      DOMContentLoaded = function () {
        if (document.readyState === 'complete') {
          document.detachEvent('onreadystatechange', DOMContentLoaded);
          jQuery.ready();
        }
      };
    }
    function doScrollCheck() {
      if (jQuery.isReady) {
        return;
      }
      try {
        document.documentElement.doScroll('left');
      } catch (e) {
        setTimeout(doScrollCheck, 1);
        return;
      }
      jQuery.ready();
    }
    return jQuery;
  })();
  var flagsCache = {};
  function createFlags(flags) {
    var object = (flagsCache[flags] = {}),
      i,
      length;
    flags = flags.split(/\s+/);
    for (i = 0, length = flags.length; i < length; i++) {
      object[flags[i]] = true;
    }
    return object;
  }
  jQuery.Callbacks = function (flags) {
    flags = flags ? flagsCache[flags] || createFlags(flags) : {};
    var list = [],
      stack = [],
      memory,
      firing,
      firingStart,
      firingLength,
      firingIndex,
      add = function (args) {
        var i, length, elem, type, actual;
        for (i = 0, length = args.length; i < length; i++) {
          elem = args[i];
          type = jQuery.type(elem);
          if (type === 'array') {
            add(elem);
          } else if (type === 'function') {
            if (!flags.unique || !self.has(elem)) {
              list.push(elem);
            }
          }
        }
      },
      fire = function (context, args) {
        args = args || [];
        memory = !flags.memory || [context, args];
        firing = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        for (; list && firingIndex < firingLength; firingIndex++) {
          if (
            list[firingIndex].apply(context, args) === false &&
            flags.stopOnFalse
          ) {
            memory = true;
            break;
          }
        }
        firing = false;
        if (list) {
          if (!flags.once) {
            if (stack && stack.length) {
              memory = stack.shift();
              self.fireWith(memory[0], memory[1]);
            }
          } else if (memory === true) {
            self.disable();
          } else {
            list = [];
          }
        }
      },
      self = {
        add: function () {
          if (list) {
            var length = list.length;
            add(arguments);
            if (firing) {
              firingLength = list.length;
            } else if (memory && memory !== true) {
              firingStart = length;
              fire(memory[0], memory[1]);
            }
          }
          return this;
        },
        remove: function () {
          if (list) {
            var args = arguments,
              argIndex = 0,
              argLength = args.length;
            for (; argIndex < argLength; argIndex++) {
              for (var i = 0; i < list.length; i++) {
                if (args[argIndex] === list[i]) {
                  if (firing) {
                    if (i <= firingLength) {
                      firingLength--;
                      if (i <= firingIndex) {
                        firingIndex--;
                      }
                    }
                  }
                  list.splice(i--, 1);
                  if (flags.unique) {
                    break;
                  }
                }
              }
            }
          }
          return this;
        },
        has: function (fn) {
          if (list) {
            var i = 0,
              length = list.length;
            for (; i < length; i++) {
              if (fn === list[i]) {
                return true;
              }
            }
          }
          return false;
        },
        empty: function () {
          list = [];
          return this;
        },
        disable: function () {
          list = stack = memory = undefined;
          return this;
        },
        disabled: function () {
          return !list;
        },
        lock: function () {
          stack = undefined;
          if (!memory || memory === true) {
            self.disable();
          }
          return this;
        },
        locked: function () {
          return !stack;
        },
        fireWith: function (context, args) {
          if (stack) {
            if (firing) {
              if (!flags.once) {
                stack.push([context, args]);
              }
            } else if (!(flags.once && memory)) {
              fire(context, args);
            }
          }
          return this;
        },
        fire: function () {
          self.fireWith(this, arguments);
          return this;
        },
        fired: function () {
          return !!memory;
        },
      };
    return self;
  };
  var sliceDeferred = [].slice;
  jQuery.extend({
    Deferred: function (func) {
      var doneList = jQuery.Callbacks('once memory'),
        failList = jQuery.Callbacks('once memory'),
        progressList = jQuery.Callbacks('memory'),
        state = 'pending',
        lists = { resolve: doneList, reject: failList, notify: progressList },
        promise = {
          done: doneList.add,
          fail: failList.add,
          progress: progressList.add,
          state: function () {
            return state;
          },
          isResolved: doneList.fired,
          isRejected: failList.fired,
          then: function (doneCallbacks, failCallbacks, progressCallbacks) {
            deferred
              .done(doneCallbacks)
              .fail(failCallbacks)
              .progress(progressCallbacks);
            return this;
          },
          always: function () {
            deferred.done
              .apply(deferred, arguments)
              .fail.apply(deferred, arguments);
            return this;
          },
          pipe: function (fnDone, fnFail, fnProgress) {
            return jQuery
              .Deferred(function (newDefer) {
                jQuery.each(
                  {
                    done: [fnDone, 'resolve'],
                    fail: [fnFail, 'reject'],
                    progress: [fnProgress, 'notify'],
                  },
                  function (handler, data) {
                    var fn = data[0],
                      action = data[1],
                      returned;
                    if (jQuery.isFunction(fn)) {
                      deferred[handler](function () {
                        returned = fn.apply(this, arguments);
                        if (returned && jQuery.isFunction(returned.promise)) {
                          returned
                            .promise()
                            .then(
                              newDefer.resolve,
                              newDefer.reject,
                              newDefer.notify
                            );
                        } else {
                          newDefer[action + 'With'](
                            this === deferred ? newDefer : this,
                            [returned]
                          );
                        }
                      });
                    } else {
                      deferred[handler](newDefer[action]);
                    }
                  }
                );
              })
              .promise();
          },
          promise: function (obj) {
            if (obj == null) {
              obj = promise;
            } else {
              for (var key in promise) {
                obj[key] = promise[key];
              }
            }
            return obj;
          },
        },
        deferred = promise.promise({}),
        key;
      for (key in lists) {
        deferred[key] = lists[key].fire;
        deferred[key + 'With'] = lists[key].fireWith;
      }
      deferred
        .done(
          function () {
            state = 'resolved';
          },
          failList.disable,
          progressList.lock
        )
        .fail(
          function () {
            state = 'rejected';
          },
          doneList.disable,
          progressList.lock
        );
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    when: function (firstParam) {
      var args = sliceDeferred.call(arguments, 0),
        i = 0,
        length = args.length,
        pValues = new Array(length),
        count = length,
        pCount = length,
        deferred =
          length <= 1 && firstParam && jQuery.isFunction(firstParam.promise)
            ? firstParam
            : jQuery.Deferred(),
        promise = deferred.promise();
      function resolveFunc(i) {
        return function (value) {
          args[i] =
            arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
          if (!--count) {
            deferred.resolveWith(deferred, args);
          }
        };
      }
      function progressFunc(i) {
        return function (value) {
          pValues[i] =
            arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
          deferred.notifyWith(promise, pValues);
        };
      }
      if (length > 1) {
        for (; i < length; i++) {
          if (
            args[i] &&
            args[i].promise &&
            jQuery.isFunction(args[i].promise)
          ) {
            args[i]
              .promise()
              .then(resolveFunc(i), deferred.reject, progressFunc(i));
          } else {
            --count;
          }
        }
        if (!count) {
          deferred.resolveWith(deferred, args);
        }
      } else if (deferred !== firstParam) {
        deferred.resolveWith(deferred, length ? [firstParam] : []);
      }
      return promise;
    },
  });
  jQuery.support = (function () {
    var support,
      all,
      a,
      select,
      opt,
      input,
      marginDiv,
      fragment,
      tds,
      events,
      eventName,
      i,
      isSupported,
      div = document.createElement('div'),
      documentElement = document.documentElement;
    div.setAttribute('className', 't');
    div.innerHTML =
      "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
    all = div.getElementsByTagName('*');
    a = div.getElementsByTagName('a')[0];
    if (!all || !all.length || !a) {
      return {};
    }
    select = document.createElement('select');
    opt = select.appendChild(document.createElement('option'));
    input = div.getElementsByTagName('input')[0];
    support = {
      leadingWhitespace: div.firstChild.nodeType === 3,
      tbody: !div.getElementsByTagName('tbody').length,
      htmlSerialize: !!div.getElementsByTagName('link').length,
      style: /top/.test(a.getAttribute('style')),
      hrefNormalized: a.getAttribute('href') === '/a',
      opacity: /^0.55/.test(a.style.opacity),
      cssFloat: !!a.style.cssFloat,
      checkOn: input.value === 'on',
      optSelected: opt.selected,
      getSetAttribute: div.className !== 't',
      enctype: !!document.createElement('form').enctype,
      html5Clone:
        document.createElement('nav').cloneNode(true).outerHTML !==
        '<:nav></:nav>',
      submitBubbles: true,
      changeBubbles: true,
      focusinBubbles: false,
      deleteExpando: true,
      noCloneEvent: true,
      inlineBlockNeedsLayout: false,
      shrinkWrapBlocks: false,
      reliableMarginRight: true,
    };
    input.checked = true;
    support.noCloneChecked = input.cloneNode(true).checked;
    select.disabled = true;
    support.optDisabled = !opt.disabled;
    try {
      delete div.test;
    } catch (e) {
      support.deleteExpando = false;
    }
    if (!div.addEventListener && div.attachEvent && div.fireEvent) {
      div.attachEvent('onclick', function () {
        support.noCloneEvent = false;
      });
      div.cloneNode(true).fireEvent('onclick');
    }
    input = document.createElement('input');
    input.value = 't';
    input.setAttribute('type', 'radio');
    support.radioValue = input.value === 't';
    input.setAttribute('checked', 'checked');
    div.appendChild(input);
    fragment = document.createDocumentFragment();
    fragment.appendChild(div.lastChild);
    support.checkClone = fragment
      .cloneNode(true)
      .cloneNode(true).lastChild.checked;
    support.appendChecked = input.checked;
    fragment.removeChild(input);
    fragment.appendChild(div);
    div.innerHTML = '';
    if (window.getComputedStyle) {
      marginDiv = document.createElement('div');
      marginDiv.style.width = '0';
      marginDiv.style.marginRight = '0';
      div.style.width = '2px';
      div.appendChild(marginDiv);
      support.reliableMarginRight =
        (parseInt(
          (window.getComputedStyle(marginDiv, null) || { marginRight: 0 })
            .marginRight,
          10
        ) || 0) === 0;
    }
    if (div.attachEvent) {
      for (i in { submit: 1, change: 1, focusin: 1 }) {
        eventName = 'on' + i;
        isSupported = eventName in div;
        if (!isSupported) {
          div.setAttribute(eventName, 'return;');
          isSupported = typeof div[eventName] === 'function';
        }
        support[i + 'Bubbles'] = isSupported;
      }
    }
    fragment.removeChild(div);
    fragment = select = opt = marginDiv = div = input = null;
    jQuery(function () {
      var container,
        outer,
        inner,
        table,
        td,
        offsetSupport,
        conMarginTop,
        ptlm,
        vb,
        style,
        html,
        body = document.getElementsByTagName('body')[0];
      if (!body) {
        return;
      }
      conMarginTop = 1;
      ptlm = 'position:absolute;top:0;left:0;width:1px;height:1px;margin:0;';
      vb = 'visibility:hidden;border:0;';
      style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
      html =
        '<div ' +
        style +
        '><div></div></div>' +
        '<table ' +
        style +
        " cellpadding='0' cellspacing='0'>" +
        '<tr><td></td></tr></table>';
      container = document.createElement('div');
      container.style.cssText =
        vb +
        'width:0;height:0;position:static;top:0;margin-top:' +
        conMarginTop +
        'px';
      body.insertBefore(container, body.firstChild);
      div = document.createElement('div');
      container.appendChild(div);
      div.innerHTML =
        "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
      tds = div.getElementsByTagName('td');
      isSupported = tds[0].offsetHeight === 0;
      tds[0].style.display = '';
      tds[1].style.display = 'none';
      support.reliableHiddenOffsets = isSupported && tds[0].offsetHeight === 0;
      div.innerHTML = '';
      div.style.width = div.style.paddingLeft = '1px';
      jQuery.boxModel = support.boxModel = div.offsetWidth === 2;
      if (typeof div.style.zoom !== 'undefined') {
        div.style.display = 'inline';
        div.style.zoom = 1;
        support.inlineBlockNeedsLayout = div.offsetWidth === 2;
        div.style.display = '';
        div.innerHTML = "<div style='width:4px;'></div>";
        support.shrinkWrapBlocks = div.offsetWidth !== 2;
      }
      div.style.cssText = ptlm + vb;
      div.innerHTML = html;
      outer = div.firstChild;
      inner = outer.firstChild;
      td = outer.nextSibling.firstChild.firstChild;
      offsetSupport = {
        doesNotAddBorder: inner.offsetTop !== 5,
        doesAddBorderForTableAndCells: td.offsetTop === 5,
      };
      inner.style.position = 'fixed';
      inner.style.top = '20px';
      offsetSupport.fixedPosition =
        inner.offsetTop === 20 || inner.offsetTop === 15;
      inner.style.position = inner.style.top = '';
      outer.style.overflow = 'hidden';
      outer.style.position = 'relative';
      offsetSupport.subtractsBorderForOverflowNotVisible =
        inner.offsetTop === -5;
      offsetSupport.doesNotIncludeMarginInBodyOffset =
        body.offsetTop !== conMarginTop;
      body.removeChild(container);
      div = container = null;
      jQuery.extend(support, offsetSupport);
    });
    return support;
  })();
  var rbrace = /^(?:\{.*\}|\[.*\])$/,
    rmultiDash = /([A-Z])/g;
  jQuery.extend({
    cache: {},
    uuid: 0,
    expando: 'jQuery' + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ''),
    noData: {
      embed: true,
      object: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
      applet: true,
    },
    hasData: function (elem) {
      elem = elem.nodeType
        ? jQuery.cache[elem[jQuery.expando]]
        : elem[jQuery.expando];
      return !!elem && !isEmptyDataObject(elem);
    },
    data: function (elem, name, data, pvt) {
      if (!jQuery.acceptData(elem)) {
        return;
      }
      var privateCache,
        thisCache,
        ret,
        internalKey = jQuery.expando,
        getByName = typeof name === 'string',
        isNode = elem.nodeType,
        cache = isNode ? jQuery.cache : elem,
        id = isNode ? elem[internalKey] : elem[internalKey] && internalKey,
        isEvents = name === 'events';
      if (
        (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) &&
        getByName &&
        data === undefined
      ) {
        return;
      }
      if (!id) {
        if (isNode) {
          elem[internalKey] = id = ++jQuery.uuid;
        } else {
          id = internalKey;
        }
      }
      if (!cache[id]) {
        cache[id] = {};
        if (!isNode) {
          cache[id].toJSON = jQuery.noop;
        }
      }
      if (typeof name === 'object' || typeof name === 'function') {
        if (pvt) {
          cache[id] = jQuery.extend(cache[id], name);
        } else {
          cache[id].data = jQuery.extend(cache[id].data, name);
        }
      }
      privateCache = thisCache = cache[id];
      if (!pvt) {
        if (!thisCache.data) {
          thisCache.data = {};
        }
        thisCache = thisCache.data;
      }
      if (data !== undefined) {
        thisCache[jQuery.camelCase(name)] = data;
      }
      if (isEvents && !thisCache[name]) {
        return privateCache.events;
      }
      if (getByName) {
        ret = thisCache[name];
        if (ret == null) {
          ret = thisCache[jQuery.camelCase(name)];
        }
      } else {
        ret = thisCache;
      }
      return ret;
    },
    removeData: function (elem, name, pvt) {
      if (!jQuery.acceptData(elem)) {
        return;
      }
      var thisCache,
        i,
        l,
        internalKey = jQuery.expando,
        isNode = elem.nodeType,
        cache = isNode ? jQuery.cache : elem,
        id = isNode ? elem[internalKey] : internalKey;
      if (!cache[id]) {
        return;
      }
      if (name) {
        thisCache = pvt ? cache[id] : cache[id].data;
        if (thisCache) {
          if (!jQuery.isArray(name)) {
            if (name in thisCache) {
              name = [name];
            } else {
              name = jQuery.camelCase(name);
              if (name in thisCache) {
                name = [name];
              } else {
                name = name.split(' ');
              }
            }
          }
          for (i = 0, l = name.length; i < l; i++) {
            delete thisCache[name[i]];
          }
          if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
            return;
          }
        }
      }
      if (!pvt) {
        delete cache[id].data;
        if (!isEmptyDataObject(cache[id])) {
          return;
        }
      }
      if (jQuery.support.deleteExpando || !cache.setInterval) {
        delete cache[id];
      } else {
        cache[id] = null;
      }
      if (isNode) {
        if (jQuery.support.deleteExpando) {
          delete elem[internalKey];
        } else if (elem.removeAttribute) {
          elem.removeAttribute(internalKey);
        } else {
          elem[internalKey] = null;
        }
      }
    },
    _data: function (elem, name, data) {
      return jQuery.data(elem, name, data, true);
    },
    acceptData: function (elem) {
      if (elem.nodeName) {
        var match = jQuery.noData[elem.nodeName.toLowerCase()];
        if (match) {
          return !(match === true || elem.getAttribute('classid') !== match);
        }
      }
      return true;
    },
  });
  jQuery.fn.extend({
    data: function (key, value) {
      var parts,
        attr,
        name,
        data = null;
      if (typeof key === 'undefined') {
        if (this.length) {
          data = jQuery.data(this[0]);
          if (this[0].nodeType === 1 && !jQuery._data(this[0], 'parsedAttrs')) {
            attr = this[0].attributes;
            for (var i = 0, l = attr.length; i < l; i++) {
              name = attr[i].name;
              if (name.indexOf('data-') === 0) {
                name = jQuery.camelCase(name.substring(5));
                dataAttr(this[0], name, data[name]);
              }
            }
            jQuery._data(this[0], 'parsedAttrs', true);
          }
        }
        return data;
      } else if (typeof key === 'object') {
        return this.each(function () {
          jQuery.data(this, key);
        });
      }
      parts = key.split('.');
      parts[1] = parts[1] ? '.' + parts[1] : '';
      if (value === undefined) {
        data = this.triggerHandler('getData' + parts[1] + '!', [parts[0]]);
        if (data === undefined && this.length) {
          data = jQuery.data(this[0], key);
          data = dataAttr(this[0], key, data);
        }
        return data === undefined && parts[1] ? this.data(parts[0]) : data;
      } else {
        return this.each(function () {
          var self = jQuery(this),
            args = [parts[0], value];
          self.triggerHandler('setData' + parts[1] + '!', args);
          jQuery.data(this, key, value);
          self.triggerHandler('changeData' + parts[1] + '!', args);
        });
      }
    },
    removeData: function (key) {
      return this.each(function () {
        jQuery.removeData(this, key);
      });
    },
  });
  function dataAttr(elem, key, data) {
    if (data === undefined && elem.nodeType === 1) {
      var name = 'data-' + key.replace(rmultiDash, '-$1').toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data === 'string') {
        try {
          data =
            data === 'true'
              ? true
              : data === 'false'
              ? false
              : data === 'null'
              ? null
              : jQuery.isNumeric(data)
              ? parseFloat(data)
              : rbrace.test(data)
              ? jQuery.parseJSON(data)
              : data;
        } catch (e) {}
        jQuery.data(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }
  function isEmptyDataObject(obj) {
    for (var name in obj) {
      if (name === 'data' && jQuery.isEmptyObject(obj[name])) {
        continue;
      }
      if (name !== 'toJSON') {
        return false;
      }
    }
    return true;
  }
  function handleQueueMarkDefer(elem, type, src) {
    var deferDataKey = type + 'defer',
      queueDataKey = type + 'queue',
      markDataKey = type + 'mark',
      defer = jQuery._data(elem, deferDataKey);
    if (
      defer &&
      (src === 'queue' || !jQuery._data(elem, queueDataKey)) &&
      (src === 'mark' || !jQuery._data(elem, markDataKey))
    ) {
      setTimeout(function () {
        if (
          !jQuery._data(elem, queueDataKey) &&
          !jQuery._data(elem, markDataKey)
        ) {
          jQuery.removeData(elem, deferDataKey, true);
          defer.fire();
        }
      }, 0);
    }
  }
  jQuery.extend({
    _mark: function (elem, type) {
      if (elem) {
        type = (type || 'fx') + 'mark';
        jQuery._data(elem, type, (jQuery._data(elem, type) || 0) + 1);
      }
    },
    _unmark: function (force, elem, type) {
      if (force !== true) {
        type = elem;
        elem = force;
        force = false;
      }
      if (elem) {
        type = type || 'fx';
        var key = type + 'mark',
          count = force ? 0 : (jQuery._data(elem, key) || 1) - 1;
        if (count) {
          jQuery._data(elem, key, count);
        } else {
          jQuery.removeData(elem, key, true);
          handleQueueMarkDefer(elem, type, 'mark');
        }
      }
    },
    queue: function (elem, type, data) {
      var q;
      if (elem) {
        type = (type || 'fx') + 'queue';
        q = jQuery._data(elem, type);
        if (data) {
          if (!q || jQuery.isArray(data)) {
            q = jQuery._data(elem, type, jQuery.makeArray(data));
          } else {
            q.push(data);
          }
        }
        return q || [];
      }
    },
    dequeue: function (elem, type) {
      type = type || 'fx';
      var queue = jQuery.queue(elem, type),
        fn = queue.shift(),
        hooks = {};
      if (fn === 'inprogress') {
        fn = queue.shift();
      }
      if (fn) {
        if (type === 'fx') {
          queue.unshift('inprogress');
        }
        jQuery._data(elem, type + '.run', hooks);
        fn.call(
          elem,
          function () {
            jQuery.dequeue(elem, type);
          },
          hooks
        );
      }
      if (!queue.length) {
        jQuery.removeData(elem, type + 'queue ' + type + '.run', true);
        handleQueueMarkDefer(elem, type, 'queue');
      }
    },
  });
  jQuery.fn.extend({
    queue: function (type, data) {
      if (typeof type !== 'string') {
        data = type;
        type = 'fx';
      }
      if (data === undefined) {
        return jQuery.queue(this[0], type);
      }
      return this.each(function () {
        var queue = jQuery.queue(this, type, data);
        if (type === 'fx' && queue[0] !== 'inprogress') {
          jQuery.dequeue(this, type);
        }
      });
    },
    dequeue: function (type) {
      return this.each(function () {
        jQuery.dequeue(this, type);
      });
    },
    delay: function (time, type) {
      time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
      type = type || 'fx';
      return this.queue(type, function (next, hooks) {
        var timeout = setTimeout(next, time);
        hooks.stop = function () {
          clearTimeout(timeout);
        };
      });
    },
    clearQueue: function (type) {
      return this.queue(type || 'fx', []);
    },
    promise: function (type, object) {
      if (typeof type !== 'string') {
        object = type;
        type = undefined;
      }
      type = type || 'fx';
      var defer = jQuery.Deferred(),
        elements = this,
        i = elements.length,
        count = 1,
        deferDataKey = type + 'defer',
        queueDataKey = type + 'queue',
        markDataKey = type + 'mark',
        tmp;
      function resolve() {
        if (!--count) {
          defer.resolveWith(elements, [elements]);
        }
      }
      while (i--) {
        if (
          (tmp =
            jQuery.data(elements[i], deferDataKey, undefined, true) ||
            ((jQuery.data(elements[i], queueDataKey, undefined, true) ||
              jQuery.data(elements[i], markDataKey, undefined, true)) &&
              jQuery.data(
                elements[i],
                deferDataKey,
                jQuery.Callbacks('once memory'),
                true
              )))
        ) {
          count++;
          tmp.add(resolve);
        }
      }
      resolve();
      return defer.promise();
    },
  });
  var rclass = /[\n\t\r]/g,
    rspace = /\s+/,
    rreturn = /\r/g,
    rtype = /^(?:button|input)$/i,
    rfocusable = /^(?:button|input|object|select|textarea)$/i,
    rclickable = /^a(?:rea)?$/i,
    rboolean =
      /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    getSetAttribute = jQuery.support.getSetAttribute,
    nodeHook,
    boolHook,
    fixSpecified;
  jQuery.fn.extend({
    attr: function (name, value) {
      return jQuery.access(this, name, value, true, jQuery.attr);
    },
    removeAttr: function (name) {
      return this.each(function () {
        jQuery.removeAttr(this, name);
      });
    },
    prop: function (name, value) {
      return jQuery.access(this, name, value, true, jQuery.prop);
    },
    removeProp: function (name) {
      name = jQuery.propFix[name] || name;
      return this.each(function () {
        try {
          this[name] = undefined;
          delete this[name];
        } catch (e) {}
      });
    },
    addClass: function (value) {
      var classNames, i, l, elem, setClass, c, cl;
      if (jQuery.isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).addClass(value.call(this, j, this.className));
        });
      }
      if (value && typeof value === 'string') {
        classNames = value.split(rspace);
        for (i = 0, l = this.length; i < l; i++) {
          elem = this[i];
          if (elem.nodeType === 1) {
            if (!elem.className && classNames.length === 1) {
              elem.className = value;
            } else {
              setClass = ' ' + elem.className + ' ';
              for (c = 0, cl = classNames.length; c < cl; c++) {
                if (!~setClass.indexOf(' ' + classNames[c] + ' ')) {
                  setClass += classNames[c] + ' ';
                }
              }
              elem.className = jQuery.trim(setClass);
            }
          }
        }
      }
      return this;
    },
    removeClass: function (value) {
      var classNames, i, l, elem, className, c, cl;
      if (jQuery.isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).removeClass(value.call(this, j, this.className));
        });
      }
      if ((value && typeof value === 'string') || value === undefined) {
        classNames = (value || '').split(rspace);
        for (i = 0, l = this.length; i < l; i++) {
          elem = this[i];
          if (elem.nodeType === 1 && elem.className) {
            if (value) {
              className = (' ' + elem.className + ' ').replace(rclass, ' ');
              for (c = 0, cl = classNames.length; c < cl; c++) {
                className = className.replace(' ' + classNames[c] + ' ', ' ');
              }
              elem.className = jQuery.trim(className);
            } else {
              elem.className = '';
            }
          }
        }
      }
      return this;
    },
    toggleClass: function (value, stateVal) {
      var type = typeof value,
        isBool = typeof stateVal === 'boolean';
      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          jQuery(this).toggleClass(
            value.call(this, i, this.className, stateVal),
            stateVal
          );
        });
      }
      return this.each(function () {
        if (type === 'string') {
          var className,
            i = 0,
            self = jQuery(this),
            state = stateVal,
            classNames = value.split(rspace);
          while ((className = classNames[i++])) {
            state = isBool ? state : !self.hasClass(className);
            self[state ? 'addClass' : 'removeClass'](className);
          }
        } else if (type === 'undefined' || type === 'boolean') {
          if (this.className) {
            jQuery._data(this, '__className__', this.className);
          }
          this.className =
            this.className || value === false
              ? ''
              : jQuery._data(this, '__className__') || '';
        }
      });
    },
    hasClass: function (selector) {
      var className = ' ' + selector + ' ',
        i = 0,
        l = this.length;
      for (; i < l; i++) {
        if (
          this[i].nodeType === 1 &&
          (' ' + this[i].className + ' ')
            .replace(rclass, ' ')
            .indexOf(className) > -1
        ) {
          return true;
        }
      }
      return false;
    },
    val: function (value) {
      var hooks,
        ret,
        isFunction,
        elem = this[0];
      if (!arguments.length) {
        if (elem) {
          hooks =
            jQuery.valHooks[elem.nodeName.toLowerCase()] ||
            jQuery.valHooks[elem.type];
          if (
            hooks &&
            'get' in hooks &&
            (ret = hooks.get(elem, 'value')) !== undefined
          ) {
            return ret;
          }
          ret = elem.value;
          return typeof ret === 'string'
            ? ret.replace(rreturn, '')
            : ret == null
            ? ''
            : ret;
        }
        return;
      }
      isFunction = jQuery.isFunction(value);
      return this.each(function (i) {
        var self = jQuery(this),
          val;
        if (this.nodeType !== 1) {
          return;
        }
        if (isFunction) {
          val = value.call(this, i, self.val());
        } else {
          val = value;
        }
        if (val == null) {
          val = '';
        } else if (typeof val === 'number') {
          val += '';
        } else if (jQuery.isArray(val)) {
          val = jQuery.map(val, function (value) {
            return value == null ? '' : value + '';
          });
        }
        hooks =
          jQuery.valHooks[this.nodeName.toLowerCase()] ||
          jQuery.valHooks[this.type];
        if (
          !hooks ||
          !('set' in hooks) ||
          hooks.set(this, val, 'value') === undefined
        ) {
          this.value = val;
        }
      });
    },
  });
  jQuery.extend({
    valHooks: {
      option: {
        get: function (elem) {
          var val = elem.attributes.value;
          return !val || val.specified ? elem.value : elem.text;
        },
      },
      select: {
        get: function (elem) {
          var value,
            i,
            max,
            option,
            index = elem.selectedIndex,
            values = [],
            options = elem.options,
            one = elem.type === 'select-one';
          if (index < 0) {
            return null;
          }
          i = one ? index : 0;
          max = one ? index + 1 : options.length;
          for (; i < max; i++) {
            option = options[i];
            if (
              option.selected &&
              (jQuery.support.optDisabled
                ? !option.disabled
                : option.getAttribute('disabled') === null) &&
              (!option.parentNode.disabled ||
                !jQuery.nodeName(option.parentNode, 'optgroup'))
            ) {
              value = jQuery(option).val();
              if (one) {
                return value;
              }
              values.push(value);
            }
          }
          if (one && !values.length && options.length) {
            return jQuery(options[index]).val();
          }
          return values;
        },
        set: function (elem, value) {
          var values = jQuery.makeArray(value);
          jQuery(elem)
            .find('option')
            .each(function () {
              this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
            });
          if (!values.length) {
            elem.selectedIndex = -1;
          }
          return values;
        },
      },
    },
    attrFn: {
      val: true,
      css: true,
      html: true,
      text: true,
      data: true,
      width: true,
      height: true,
      offset: true,
    },
    attr: function (elem, name, value, pass) {
      var ret,
        hooks,
        notxml,
        nType = elem.nodeType;
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (pass && name in jQuery.attrFn) {
        return jQuery(elem)[name](value);
      }
      if (typeof elem.getAttribute === 'undefined') {
        return jQuery.prop(elem, name, value);
      }
      notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
      if (notxml) {
        name = name.toLowerCase();
        hooks =
          jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
      }
      if (value !== undefined) {
        if (value === null) {
          jQuery.removeAttr(elem, name);
          return;
        } else if (
          hooks &&
          'set' in hooks &&
          notxml &&
          (ret = hooks.set(elem, value, name)) !== undefined
        ) {
          return ret;
        } else {
          elem.setAttribute(name, '' + value);
          return value;
        }
      } else if (
        hooks &&
        'get' in hooks &&
        notxml &&
        (ret = hooks.get(elem, name)) !== null
      ) {
        return ret;
      } else {
        ret = elem.getAttribute(name);
        return ret === null ? undefined : ret;
      }
    },
    removeAttr: function (elem, value) {
      var propName,
        attrNames,
        name,
        l,
        i = 0;
      if (value && elem.nodeType === 1) {
        attrNames = value.toLowerCase().split(rspace);
        l = attrNames.length;
        for (; i < l; i++) {
          name = attrNames[i];
          if (name) {
            propName = jQuery.propFix[name] || name;
            jQuery.attr(elem, name, '');
            elem.removeAttribute(getSetAttribute ? name : propName);
            if (rboolean.test(name) && propName in elem) {
              elem[propName] = false;
            }
          }
        }
      }
    },
    attrHooks: {
      type: {
        set: function (elem, value) {
          if (rtype.test(elem.nodeName) && elem.parentNode) {
            jQuery.error("type property can't be changed");
          } else if (
            !jQuery.support.radioValue &&
            value === 'radio' &&
            jQuery.nodeName(elem, 'input')
          ) {
            var val = elem.value;
            elem.setAttribute('type', value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        },
      },
      value: {
        get: function (elem, name) {
          if (nodeHook && jQuery.nodeName(elem, 'button')) {
            return nodeHook.get(elem, name);
          }
          return name in elem ? elem.value : null;
        },
        set: function (elem, value, name) {
          if (nodeHook && jQuery.nodeName(elem, 'button')) {
            return nodeHook.set(elem, value, name);
          }
          elem.value = value;
        },
      },
    },
    propFix: {
      tabindex: 'tabIndex',
      readonly: 'readOnly',
      for: 'htmlFor',
      class: 'className',
      maxlength: 'maxLength',
      cellspacing: 'cellSpacing',
      cellpadding: 'cellPadding',
      rowspan: 'rowSpan',
      colspan: 'colSpan',
      usemap: 'useMap',
      frameborder: 'frameBorder',
      contenteditable: 'contentEditable',
    },
    prop: function (elem, name, value) {
      var ret,
        hooks,
        notxml,
        nType = elem.nodeType;
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
      if (notxml) {
        name = jQuery.propFix[name] || name;
        hooks = jQuery.propHooks[name];
      }
      if (value !== undefined) {
        if (
          hooks &&
          'set' in hooks &&
          (ret = hooks.set(elem, value, name)) !== undefined
        ) {
          return ret;
        } else {
          return (elem[name] = value);
        }
      } else {
        if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
          return ret;
        } else {
          return elem[name];
        }
      }
    },
    propHooks: {
      tabIndex: {
        get: function (elem) {
          var attributeNode = elem.getAttributeNode('tabindex');
          return attributeNode && attributeNode.specified
            ? parseInt(attributeNode.value, 10)
            : rfocusable.test(elem.nodeName) ||
              (rclickable.test(elem.nodeName) && elem.href)
            ? 0
            : undefined;
        },
      },
    },
  });
  jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;
  boolHook = {
    get: function (elem, name) {
      var attrNode,
        property = jQuery.prop(elem, name);
      return property === true ||
        (typeof property !== 'boolean' &&
          (attrNode = elem.getAttributeNode(name)) &&
          attrNode.nodeValue !== false)
        ? name.toLowerCase()
        : undefined;
    },
    set: function (elem, value, name) {
      var propName;
      if (value === false) {
        jQuery.removeAttr(elem, name);
      } else {
        propName = jQuery.propFix[name] || name;
        if (propName in elem) {
          elem[propName] = true;
        }
        elem.setAttribute(name, name.toLowerCase());
      }
      return name;
    },
  };
  if (!getSetAttribute) {
    fixSpecified = { name: true, id: true };
    nodeHook = jQuery.valHooks.button = {
      get: function (elem, name) {
        var ret;
        ret = elem.getAttributeNode(name);
        return ret &&
          (fixSpecified[name] ? ret.nodeValue !== '' : ret.specified)
          ? ret.nodeValue
          : undefined;
      },
      set: function (elem, value, name) {
        var ret = elem.getAttributeNode(name);
        if (!ret) {
          ret = document.createAttribute(name);
          elem.setAttributeNode(ret);
        }
        return (ret.nodeValue = value + '');
      },
    };
    jQuery.attrHooks.tabindex.set = nodeHook.set;
    jQuery.each(['width', 'height'], function (i, name) {
      jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
        set: function (elem, value) {
          if (value === '') {
            elem.setAttribute(name, 'auto');
            return value;
          }
        },
      });
    });
    jQuery.attrHooks.contenteditable = {
      get: nodeHook.get,
      set: function (elem, value, name) {
        if (value === '') {
          value = 'false';
        }
        nodeHook.set(elem, value, name);
      },
    };
  }
  if (!jQuery.support.hrefNormalized) {
    jQuery.each(['href', 'src', 'width', 'height'], function (i, name) {
      jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
        get: function (elem) {
          var ret = elem.getAttribute(name, 2);
          return ret === null ? undefined : ret;
        },
      });
    });
  }
  if (!jQuery.support.style) {
    jQuery.attrHooks.style = {
      get: function (elem) {
        return elem.style.cssText.toLowerCase() || undefined;
      },
      set: function (elem, value) {
        return (elem.style.cssText = '' + value);
      },
    };
  }
  if (!jQuery.support.optSelected) {
    jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
      get: function (elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
        return null;
      },
    });
  }
  if (!jQuery.support.enctype) {
    jQuery.propFix.enctype = 'encoding';
  }
  if (!jQuery.support.checkOn) {
    jQuery.each(['radio', 'checkbox'], function () {
      jQuery.valHooks[this] = {
        get: function (elem) {
          return elem.getAttribute('value') === null ? 'on' : elem.value;
        },
      };
    });
  }
  jQuery.each(['radio', 'checkbox'], function () {
    jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
      set: function (elem, value) {
        if (jQuery.isArray(value)) {
          return (elem.checked =
            jQuery.inArray(jQuery(elem).val(), value) >= 0);
        }
      },
    });
  });
  var rformElems = /^(?:textarea|input|select)$/i,
    rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
    rhoverHack = /\bhover(\.\S+)?\b/,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
    quickParse = function (selector) {
      var quick = rquickIs.exec(selector);
      if (quick) {
        quick[1] = (quick[1] || '').toLowerCase();
        quick[3] = quick[3] && new RegExp('(?:^|\\s)' + quick[3] + '(?:\\s|$)');
      }
      return quick;
    },
    quickIs = function (elem, m) {
      var attrs = elem.attributes || {};
      return (
        (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
        (!m[2] || (attrs.id || {}).value === m[2]) &&
        (!m[3] || m[3].test((attrs['class'] || {}).value))
      );
    },
    hoverHack = function (events) {
      return jQuery.event.special.hover
        ? events
        : events.replace(rhoverHack, 'mouseenter$1 mouseleave$1');
    };
  jQuery.event = {
    add: function (elem, types, handler, data, selector) {
      var elemData,
        eventHandle,
        events,
        t,
        tns,
        type,
        namespaces,
        handleObj,
        handleObjIn,
        quick,
        handlers,
        special;
      if (
        elem.nodeType === 3 ||
        elem.nodeType === 8 ||
        !types ||
        !handler ||
        !(elemData = jQuery._data(elem))
      ) {
        return;
      }
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
      }
      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      }
      events = elemData.events;
      if (!events) {
        elemData.events = events = {};
      }
      eventHandle = elemData.handle;
      if (!eventHandle) {
        elemData.handle = eventHandle = function (e) {
          return typeof jQuery !== 'undefined' &&
            (!e || jQuery.event.triggered !== e.type)
            ? jQuery.event.dispatch.apply(eventHandle.elem, arguments)
            : undefined;
        };
        eventHandle.elem = elem;
      }
      types = jQuery.trim(hoverHack(types)).split(' ');
      for (t = 0; t < types.length; t++) {
        tns = rtypenamespace.exec(types[t]) || [];
        type = tns[1];
        namespaces = (tns[2] || '').split('.').sort();
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        special = jQuery.event.special[type] || {};
        handleObj = jQuery.extend(
          {
            type: type,
            origType: tns[1],
            data: data,
            handler: handler,
            guid: handler.guid,
            selector: selector,
            quick: quickParse(selector),
            namespace: namespaces.join('.'),
          },
          handleObjIn
        );
        handlers = events[type];
        if (!handlers) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          if (
            !special.setup ||
            special.setup.call(elem, data, namespaces, eventHandle) === false
          ) {
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle, false);
            } else if (elem.attachEvent) {
              elem.attachEvent('on' + type, eventHandle);
            }
          }
        }
        if (special.add) {
          special.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
        jQuery.event.global[type] = true;
      }
      elem = null;
    },
    global: {},
    remove: function (elem, types, handler, selector, mappedTypes) {
      var elemData = jQuery.hasData(elem) && jQuery._data(elem),
        t,
        tns,
        type,
        origType,
        namespaces,
        origCount,
        j,
        events,
        special,
        handle,
        eventType,
        handleObj;
      if (!elemData || !(events = elemData.events)) {
        return;
      }
      types = jQuery.trim(hoverHack(types || '')).split(' ');
      for (t = 0; t < types.length; t++) {
        tns = rtypenamespace.exec(types[t]) || [];
        type = origType = tns[1];
        namespaces = tns[2];
        if (!type) {
          for (type in events) {
            jQuery.event.remove(elem, type + types[t], handler, selector, true);
          }
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        eventType = events[type] || [];
        origCount = eventType.length;
        namespaces = namespaces
          ? new RegExp(
              '(^|\\.)' +
                namespaces.split('.').sort().join('\\.(?:.*\\.)?') +
                '(\\.|$)'
            )
          : null;
        for (j = 0; j < eventType.length; j++) {
          handleObj = eventType[j];
          if (
            (mappedTypes || origType === handleObj.origType) &&
            (!handler || handler.guid === handleObj.guid) &&
            (!namespaces || namespaces.test(handleObj.namespace)) &&
            (!selector ||
              selector === handleObj.selector ||
              (selector === '**' && handleObj.selector))
          ) {
            eventType.splice(j--, 1);
            if (handleObj.selector) {
              eventType.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }
        if (eventType.length === 0 && origCount !== eventType.length) {
          if (
            !special.teardown ||
            special.teardown.call(elem, namespaces) === false
          ) {
            jQuery.removeEvent(elem, type, elemData.handle);
          }
          delete events[type];
        }
      }
      if (jQuery.isEmptyObject(events)) {
        handle = elemData.handle;
        if (handle) {
          handle.elem = null;
        }
        jQuery.removeData(elem, ['events', 'handle'], true);
      }
    },
    customEvent: { getData: true, setData: true, changeData: true },
    trigger: function (event, data, elem, onlyHandlers) {
      if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
        return;
      }
      var type = event.type || event,
        namespaces = [],
        cache,
        exclusive,
        i,
        cur,
        old,
        ontype,
        special,
        handle,
        eventPath,
        bubbleType;
      if (rfocusMorph.test(type + jQuery.event.triggered)) {
        return;
      }
      if (type.indexOf('!') >= 0) {
        type = type.slice(0, -1);
        exclusive = true;
      }
      if (type.indexOf('.') >= 0) {
        namespaces = type.split('.');
        type = namespaces.shift();
        namespaces.sort();
      }
      if (
        (!elem || jQuery.event.customEvent[type]) &&
        !jQuery.event.global[type]
      ) {
        return;
      }
      event =
        typeof event === 'object'
          ? event[jQuery.expando]
            ? event
            : new jQuery.Event(type, event)
          : new jQuery.Event(type);
      event.type = type;
      event.isTrigger = true;
      event.exclusive = exclusive;
      event.namespace = namespaces.join('.');
      event.namespace_re = event.namespace
        ? new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.)?') + '(\\.|$)')
        : null;
      ontype = type.indexOf(':') < 0 ? 'on' + type : '';
      if (!elem) {
        cache = jQuery.cache;
        for (i in cache) {
          if (cache[i].events && cache[i].events[type]) {
            jQuery.event.trigger(event, data, cache[i].handle.elem, true);
          }
        }
        return;
      }
      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }
      data = data != null ? jQuery.makeArray(data) : [];
      data.unshift(event);
      special = jQuery.event.special[type] || {};
      if (special.trigger && special.trigger.apply(elem, data) === false) {
        return;
      }
      eventPath = [[elem, special.bindType || type]];
      if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
        bubbleType = special.delegateType || type;
        cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
        old = null;
        for (; cur; cur = cur.parentNode) {
          eventPath.push([cur, bubbleType]);
          old = cur;
        }
        if (old && old === elem.ownerDocument) {
          eventPath.push([
            old.defaultView || old.parentWindow || window,
            bubbleType,
          ]);
        }
      }
      for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {
        cur = eventPath[i][0];
        event.type = eventPath[i][1];
        handle =
          (jQuery._data(cur, 'events') || {})[event.type] &&
          jQuery._data(cur, 'handle');
        if (handle) {
          handle.apply(cur, data);
        }
        handle = ontype && cur[ontype];
        if (
          handle &&
          jQuery.acceptData(cur) &&
          handle.apply(cur, data) === false
        ) {
          event.preventDefault();
        }
      }
      event.type = type;
      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if (
          (!special._default ||
            special._default.apply(elem.ownerDocument, data) === false) &&
          !(type === 'click' && jQuery.nodeName(elem, 'a')) &&
          jQuery.acceptData(elem)
        ) {
          if (
            ontype &&
            elem[type] &&
            ((type !== 'focus' && type !== 'blur') ||
              event.target.offsetWidth !== 0) &&
            !jQuery.isWindow(elem)
          ) {
            old = elem[ontype];
            if (old) {
              elem[ontype] = null;
            }
            jQuery.event.triggered = type;
            elem[type]();
            jQuery.event.triggered = undefined;
            if (old) {
              elem[ontype] = old;
            }
          }
        }
      }
      return event.result;
    },
    dispatch: function (event) {
      event = jQuery.event.fix(event || window.event);
      var handlers = (jQuery._data(this, 'events') || {})[event.type] || [],
        delegateCount = handlers.delegateCount,
        args = [].slice.call(arguments, 0),
        run_all = !event.exclusive && !event.namespace,
        handlerQueue = [],
        i,
        j,
        cur,
        jqcur,
        ret,
        selMatch,
        matched,
        matches,
        handleObj,
        sel,
        related;
      args[0] = event;
      event.delegateTarget = this;
      if (
        delegateCount &&
        !event.target.disabled &&
        !(event.button && event.type === 'click')
      ) {
        jqcur = jQuery(this);
        jqcur.context = this.ownerDocument || this;
        for (cur = event.target; cur != this; cur = cur.parentNode || this) {
          selMatch = {};
          matches = [];
          jqcur[0] = cur;
          for (i = 0; i < delegateCount; i++) {
            handleObj = handlers[i];
            sel = handleObj.selector;
            if (selMatch[sel] === undefined) {
              selMatch[sel] = handleObj.quick
                ? quickIs(cur, handleObj.quick)
                : jqcur.is(sel);
            }
            if (selMatch[sel]) {
              matches.push(handleObj);
            }
          }
          if (matches.length) {
            handlerQueue.push({ elem: cur, matches: matches });
          }
        }
      }
      if (handlers.length > delegateCount) {
        handlerQueue.push({
          elem: this,
          matches: handlers.slice(delegateCount),
        });
      }
      for (
        i = 0;
        i < handlerQueue.length && !event.isPropagationStopped();
        i++
      ) {
        matched = handlerQueue[i];
        event.currentTarget = matched.elem;
        for (
          j = 0;
          j < matched.matches.length && !event.isImmediatePropagationStopped();
          j++
        ) {
          handleObj = matched.matches[j];
          if (
            run_all ||
            (!event.namespace && !handleObj.namespace) ||
            (event.namespace_re && event.namespace_re.test(handleObj.namespace))
          ) {
            event.data = handleObj.data;
            event.handleObj = handleObj;
            ret = (
              (jQuery.event.special[handleObj.origType] || {}).handle ||
              handleObj.handler
            ).apply(matched.elem, args);
            if (ret !== undefined) {
              event.result = ret;
              if (ret === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      return event.result;
    },
    props:
      'attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(
        ' '
      ),
    fixHooks: {},
    keyHooks: {
      props: 'char charCode key keyCode'.split(' '),
      filter: function (event, original) {
        if (event.which == null) {
          event.which =
            original.charCode != null ? original.charCode : original.keyCode;
        }
        return event;
      },
    },
    mouseHooks: {
      props:
        'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(
          ' '
        ),
      filter: function (event, original) {
        var eventDoc,
          doc,
          body,
          button = original.button,
          fromElement = original.fromElement;
        if (event.pageX == null && original.clientX != null) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX =
            original.clientX +
            ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
            ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
          event.pageY =
            original.clientY +
            ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
            ((doc && doc.clientTop) || (body && body.clientTop) || 0);
        }
        if (!event.relatedTarget && fromElement) {
          event.relatedTarget =
            fromElement === event.target ? original.toElement : fromElement;
        }
        if (!event.which && button !== undefined) {
          event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
        }
        return event;
      },
    },
    fix: function (event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var i,
        prop,
        originalEvent = event,
        fixHook = jQuery.event.fixHooks[event.type] || {},
        copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = jQuery.Event(originalEvent);
      for (i = copy.length; i; ) {
        prop = copy[--i];
        event[prop] = originalEvent[prop];
      }
      if (!event.target) {
        event.target = originalEvent.srcElement || document;
      }
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }
      if (event.metaKey === undefined) {
        event.metaKey = event.ctrlKey;
      }
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    special: {
      ready: { setup: jQuery.bindReady },
      load: { noBubble: true },
      focus: { delegateType: 'focusin' },
      blur: { delegateType: 'focusout' },
      beforeunload: {
        setup: function (data, namespaces, eventHandle) {
          if (jQuery.isWindow(this)) {
            this.onbeforeunload = eventHandle;
          }
        },
        teardown: function (namespaces, eventHandle) {
          if (this.onbeforeunload === eventHandle) {
            this.onbeforeunload = null;
          }
        },
      },
    },
    simulate: function (type, elem, event, bubble) {
      var e = jQuery.extend(new jQuery.Event(), event, {
        type: type,
        isSimulated: true,
        originalEvent: {},
      });
      if (bubble) {
        jQuery.event.trigger(e, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, e);
      }
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    },
  };
  jQuery.event.handle = jQuery.event.dispatch;
  jQuery.removeEvent = document.removeEventListener
    ? function (elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle, false);
        }
      }
    : function (elem, type, handle) {
        if (elem.detachEvent) {
          elem.detachEvent('on' + type, handle);
        }
      };
  jQuery.Event = function (src, props) {
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    }
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      this.isDefaultPrevented =
        src.defaultPrevented ||
        src.returnValue === false ||
        (src.getPreventDefault && src.getPreventDefault())
          ? returnTrue
          : returnFalse;
    } else {
      this.type = src;
    }
    if (props) {
      jQuery.extend(this, props);
    }
    this.timeStamp = (src && src.timeStamp) || jQuery.now();
    this[jQuery.expando] = true;
  };
  function returnFalse() {
    return false;
  }
  function returnTrue() {
    return true;
  }
  jQuery.Event.prototype = {
    preventDefault: function () {
      this.isDefaultPrevented = returnTrue;
      var e = this.originalEvent;
      if (!e) {
        return;
      }
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    },
    stopPropagation: function () {
      this.isPropagationStopped = returnTrue;
      var e = this.originalEvent;
      if (!e) {
        return;
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.cancelBubble = true;
    },
    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
  };
  jQuery.each(
    { mouseenter: 'mouseover', mouseleave: 'mouseout' },
    function (orig, fix) {
      jQuery.event.special[orig] = {
        delegateType: fix,
        bindType: fix,
        handle: function (event) {
          var target = this,
            related = event.relatedTarget,
            handleObj = event.handleObj,
            selector = handleObj.selector,
            ret;
          if (
            !related ||
            (related !== target && !jQuery.contains(target, related))
          ) {
            event.type = handleObj.origType;
            ret = handleObj.handler.apply(this, arguments);
            event.type = fix;
          }
          return ret;
        },
      };
    }
  );
  if (!jQuery.support.submitBubbles) {
    jQuery.event.special.submit = {
      setup: function () {
        if (jQuery.nodeName(this, 'form')) {
          return false;
        }
        jQuery.event.add(this, 'click._submit keypress._submit', function (e) {
          var elem = e.target,
            form =
              jQuery.nodeName(elem, 'input') || jQuery.nodeName(elem, 'button')
                ? elem.form
                : undefined;
          if (form && !form._submit_attached) {
            jQuery.event.add(form, 'submit._submit', function (event) {
              if (this.parentNode && !event.isTrigger) {
                jQuery.event.simulate('submit', this.parentNode, event, true);
              }
            });
            form._submit_attached = true;
          }
        });
      },
      teardown: function () {
        if (jQuery.nodeName(this, 'form')) {
          return false;
        }
        jQuery.event.remove(this, '._submit');
      },
    };
  }
  if (!jQuery.support.changeBubbles) {
    jQuery.event.special.change = {
      setup: function () {
        if (rformElems.test(this.nodeName)) {
          if (this.type === 'checkbox' || this.type === 'radio') {
            jQuery.event.add(this, 'propertychange._change', function (event) {
              if (event.originalEvent.propertyName === 'checked') {
                this._just_changed = true;
              }
            });
            jQuery.event.add(this, 'click._change', function (event) {
              if (this._just_changed && !event.isTrigger) {
                this._just_changed = false;
                jQuery.event.simulate('change', this, event, true);
              }
            });
          }
          return false;
        }
        jQuery.event.add(this, 'beforeactivate._change', function (e) {
          var elem = e.target;
          if (rformElems.test(elem.nodeName) && !elem._change_attached) {
            jQuery.event.add(elem, 'change._change', function (event) {
              if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                jQuery.event.simulate('change', this.parentNode, event, true);
              }
            });
            elem._change_attached = true;
          }
        });
      },
      handle: function (event) {
        var elem = event.target;
        if (
          this !== elem ||
          event.isSimulated ||
          event.isTrigger ||
          (elem.type !== 'radio' && elem.type !== 'checkbox')
        ) {
          return event.handleObj.handler.apply(this, arguments);
        }
      },
      teardown: function () {
        jQuery.event.remove(this, '._change');
        return rformElems.test(this.nodeName);
      },
    };
  }
  if (!jQuery.support.focusinBubbles) {
    jQuery.each({ focus: 'focusin', blur: 'focusout' }, function (orig, fix) {
      var attaches = 0,
        handler = function (event) {
          jQuery.event.simulate(
            fix,
            event.target,
            jQuery.event.fix(event),
            true
          );
        };
      jQuery.event.special[fix] = {
        setup: function () {
          if (attaches++ === 0) {
            document.addEventListener(orig, handler, true);
          }
        },
        teardown: function () {
          if (--attaches === 0) {
            document.removeEventListener(orig, handler, true);
          }
        },
      };
    });
  }
  jQuery.fn.extend({
    on: function (types, selector, data, fn, one) {
      var origFn, type;
      if (typeof types === 'object') {
        if (typeof selector !== 'string') {
          data = selector;
          selector = undefined;
        }
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }
      if (data == null && fn == null) {
        fn = selector;
        data = selector = undefined;
      } else if (fn == null) {
        if (typeof selector === 'string') {
          fn = data;
          data = undefined;
        } else {
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if (fn === false) {
        fn = returnFalse;
      } else if (!fn) {
        return this;
      }
      if (one === 1) {
        origFn = fn;
        fn = function (event) {
          jQuery().off(event);
          return origFn.apply(this, arguments);
        };
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
      }
      return this.each(function () {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    one: function (types, selector, data, fn) {
      return this.on.call(this, types, selector, data, fn, 1);
    },
    off: function (types, selector, fn) {
      if (types && types.preventDefault && types.handleObj) {
        var handleObj = types.handleObj;
        jQuery(types.delegateTarget).off(
          handleObj.namespace
            ? handleObj.type + '.' + handleObj.namespace
            : handleObj.type,
          handleObj.selector,
          handleObj.handler
        );
        return this;
      }
      if (typeof types === 'object') {
        for (var type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === 'function') {
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function () {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    bind: function (types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function (types, fn) {
      return this.off(types, null, fn);
    },
    live: function (types, data, fn) {
      jQuery(this.context).on(types, this.selector, data, fn);
      return this;
    },
    die: function (types, fn) {
      jQuery(this.context).off(types, this.selector || '**', fn);
      return this;
    },
    delegate: function (selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function (selector, types, fn) {
      return arguments.length == 1
        ? this.off(selector, '**')
        : this.off(types, selector, fn);
    },
    trigger: function (type, data) {
      return this.each(function () {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function (type, data) {
      if (this[0]) {
        return jQuery.event.trigger(type, data, this[0], true);
      }
    },
    toggle: function (fn) {
      var args = arguments,
        guid = fn.guid || jQuery.guid++,
        i = 0,
        toggler = function (event) {
          var lastToggle =
            (jQuery._data(this, 'lastToggle' + fn.guid) || 0) % i;
          jQuery._data(this, 'lastToggle' + fn.guid, lastToggle + 1);
          event.preventDefault();
          return args[lastToggle].apply(this, arguments) || false;
        };
      toggler.guid = guid;
      while (i < args.length) {
        args[i++].guid = guid;
      }
      return this.click(toggler);
    },
    hover: function (fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
  });
  jQuery.each(
    (
      'blur focus focusin focusout load resize scroll unload click dblclick ' +
      'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
      'change select submit keydown keypress keyup error contextmenu'
    ).split(' '),
    function (i, name) {
      jQuery.fn[name] = function (data, fn) {
        if (fn == null) {
          fn = data;
          data = null;
        }
        return arguments.length > 0
          ? this.on(name, null, data, fn)
          : this.trigger(name);
      };
      if (jQuery.attrFn) {
        jQuery.attrFn[name] = true;
      }
      if (rkeyEvent.test(name)) {
        jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
      }
      if (rmouseEvent.test(name)) {
        jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
      }
    }
  );
  (function () {
    var chunker =
        /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
      expando = 'sizcache' + (Math.random() + '').replace('.', ''),
      done = 0,
      toString = Object.prototype.toString,
      hasDuplicate = false,
      baseHasDuplicate = true,
      rBackslash = /\\/g,
      rReturn = /\r\n/g,
      rNonWord = /\W/;
    [0, 0].sort(function () {
      baseHasDuplicate = false;
      return 0;
    });
    var Sizzle = function (selector, context, results, seed) {
      results = results || [];
      context = context || document;
      var origContext = context;
      if (context.nodeType !== 1 && context.nodeType !== 9) {
        return [];
      }
      if (!selector || typeof selector !== 'string') {
        return results;
      }
      var m,
        set,
        checkSet,
        extra,
        ret,
        cur,
        pop,
        i,
        prune = true,
        contextXML = Sizzle.isXML(context),
        parts = [],
        soFar = selector;
      do {
        chunker.exec('');
        m = chunker.exec(soFar);
        if (m) {
          soFar = m[3];
          parts.push(m[1]);
          if (m[2]) {
            extra = m[3];
            break;
          }
        }
      } while (m);
      if (parts.length > 1 && origPOS.exec(selector)) {
        if (parts.length === 2 && Expr.relative[parts[0]]) {
          set = posProcess(parts[0] + parts[1], context, seed);
        } else {
          set = Expr.relative[parts[0]]
            ? [context]
            : Sizzle(parts.shift(), context);
          while (parts.length) {
            selector = parts.shift();
            if (Expr.relative[selector]) {
              selector += parts.shift();
            }
            set = posProcess(selector, set, seed);
          }
        }
      } else {
        if (
          !seed &&
          parts.length > 1 &&
          context.nodeType === 9 &&
          !contextXML &&
          Expr.match.ID.test(parts[0]) &&
          !Expr.match.ID.test(parts[parts.length - 1])
        ) {
          ret = Sizzle.find(parts.shift(), context, contextXML);
          context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
        }
        if (context) {
          ret = seed
            ? { expr: parts.pop(), set: makeArray(seed) }
            : Sizzle.find(
                parts.pop(),
                parts.length === 1 &&
                  (parts[0] === '~' || parts[0] === '+') &&
                  context.parentNode
                  ? context.parentNode
                  : context,
                contextXML
              );
          set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
          if (parts.length > 0) {
            checkSet = makeArray(set);
          } else {
            prune = false;
          }
          while (parts.length) {
            cur = parts.pop();
            pop = cur;
            if (!Expr.relative[cur]) {
              cur = '';
            } else {
              pop = parts.pop();
            }
            if (pop == null) {
              pop = context;
            }
            Expr.relative[cur](checkSet, pop, contextXML);
          }
        } else {
          checkSet = parts = [];
        }
      }
      if (!checkSet) {
        checkSet = set;
      }
      if (!checkSet) {
        Sizzle.error(cur || selector);
      }
      if (toString.call(checkSet) === '[object Array]') {
        if (!prune) {
          results.push.apply(results, checkSet);
        } else if (context && context.nodeType === 1) {
          for (i = 0; checkSet[i] != null; i++) {
            if (
              checkSet[i] &&
              (checkSet[i] === true ||
                (checkSet[i].nodeType === 1 &&
                  Sizzle.contains(context, checkSet[i])))
            ) {
              results.push(set[i]);
            }
          }
        } else {
          for (i = 0; checkSet[i] != null; i++) {
            if (checkSet[i] && checkSet[i].nodeType === 1) {
              results.push(set[i]);
            }
          }
        }
      } else {
        makeArray(checkSet, results);
      }
      if (extra) {
        Sizzle(extra, origContext, results, seed);
        Sizzle.uniqueSort(results);
      }
      return results;
    };
    Sizzle.uniqueSort = function (results) {
      if (sortOrder) {
        hasDuplicate = baseHasDuplicate;
        results.sort(sortOrder);
        if (hasDuplicate) {
          for (var i = 1; i < results.length; i++) {
            if (results[i] === results[i - 1]) {
              results.splice(i--, 1);
            }
          }
        }
      }
      return results;
    };
    Sizzle.matches = function (expr, set) {
      return Sizzle(expr, null, null, set);
    };
    Sizzle.matchesSelector = function (node, expr) {
      return Sizzle(expr, null, null, [node]).length > 0;
    };
    Sizzle.find = function (expr, context, isXML) {
      var set, i, len, match, type, left;
      if (!expr) {
        return [];
      }
      for (i = 0, len = Expr.order.length; i < len; i++) {
        type = Expr.order[i];
        if ((match = Expr.leftMatch[type].exec(expr))) {
          left = match[1];
          match.splice(1, 1);
          if (left.substr(left.length - 1) !== '\\') {
            match[1] = (match[1] || '').replace(rBackslash, '');
            set = Expr.find[type](match, context, isXML);
            if (set != null) {
              expr = expr.replace(Expr.match[type], '');
              break;
            }
          }
        }
      }
      if (!set) {
        set =
          typeof context.getElementsByTagName !== 'undefined'
            ? context.getElementsByTagName('*')
            : [];
      }
      return { set: set, expr: expr };
    };
    Sizzle.filter = function (expr, set, inplace, not) {
      var match,
        anyFound,
        type,
        found,
        item,
        filter,
        left,
        i,
        pass,
        old = expr,
        result = [],
        curLoop = set,
        isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
      while (expr && set.length) {
        for (type in Expr.filter) {
          if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
            filter = Expr.filter[type];
            left = match[1];
            anyFound = false;
            match.splice(1, 1);
            if (left.substr(left.length - 1) === '\\') {
              continue;
            }
            if (curLoop === result) {
              result = [];
            }
            if (Expr.preFilter[type]) {
              match = Expr.preFilter[type](
                match,
                curLoop,
                inplace,
                result,
                not,
                isXMLFilter
              );
              if (!match) {
                anyFound = found = true;
              } else if (match === true) {
                continue;
              }
            }
            if (match) {
              for (i = 0; (item = curLoop[i]) != null; i++) {
                if (item) {
                  found = filter(item, match, i, curLoop);
                  pass = not ^ found;
                  if (inplace && found != null) {
                    if (pass) {
                      anyFound = true;
                    } else {
                      curLoop[i] = false;
                    }
                  } else if (pass) {
                    result.push(item);
                    anyFound = true;
                  }
                }
              }
            }
            if (found !== undefined) {
              if (!inplace) {
                curLoop = result;
              }
              expr = expr.replace(Expr.match[type], '');
              if (!anyFound) {
                return [];
              }
              break;
            }
          }
        }
        if (expr === old) {
          if (anyFound == null) {
            Sizzle.error(expr);
          } else {
            break;
          }
        }
        old = expr;
      }
      return curLoop;
    };
    Sizzle.error = function (msg) {
      throw new Error('Syntax error, unrecognized expression: ' + msg);
    };
    var getText = (Sizzle.getText = function (elem) {
      var i,
        node,
        nodeType = elem.nodeType,
        ret = '';
      if (nodeType) {
        if (nodeType === 1 || nodeType === 9) {
          if (typeof elem.textContent === 'string') {
            return elem.textContent;
          } else if (typeof elem.innerText === 'string') {
            return elem.innerText.replace(rReturn, '');
          } else {
            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
              ret += getText(elem);
            }
          }
        } else if (nodeType === 3 || nodeType === 4) {
          return elem.nodeValue;
        }
      } else {
        for (i = 0; (node = elem[i]); i++) {
          if (node.nodeType !== 8) {
            ret += getText(node);
          }
        }
      }
      return ret;
    });
    var Expr = (Sizzle.selectors = {
      order: ['ID', 'NAME', 'TAG'],
      match: {
        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
        CHILD:
          /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
        PSEUDO:
          /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/,
      },
      leftMatch: {},
      attrMap: { class: 'className', for: 'htmlFor' },
      attrHandle: {
        href: function (elem) {
          return elem.getAttribute('href');
        },
        type: function (elem) {
          return elem.getAttribute('type');
        },
      },
      relative: {
        '+': function (checkSet, part) {
          var isPartStr = typeof part === 'string',
            isTag = isPartStr && !rNonWord.test(part),
            isPartStrNotTag = isPartStr && !isTag;
          if (isTag) {
            part = part.toLowerCase();
          }
          for (var i = 0, l = checkSet.length, elem; i < l; i++) {
            if ((elem = checkSet[i])) {
              while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
              checkSet[i] =
                isPartStrNotTag ||
                (elem && elem.nodeName.toLowerCase() === part)
                  ? elem || false
                  : elem === part;
            }
          }
          if (isPartStrNotTag) {
            Sizzle.filter(part, checkSet, true);
          }
        },
        '>': function (checkSet, part) {
          var elem,
            isPartStr = typeof part === 'string',
            i = 0,
            l = checkSet.length;
          if (isPartStr && !rNonWord.test(part)) {
            part = part.toLowerCase();
            for (; i < l; i++) {
              elem = checkSet[i];
              if (elem) {
                var parent = elem.parentNode;
                checkSet[i] =
                  parent.nodeName.toLowerCase() === part ? parent : false;
              }
            }
          } else {
            for (; i < l; i++) {
              elem = checkSet[i];
              if (elem) {
                checkSet[i] = isPartStr
                  ? elem.parentNode
                  : elem.parentNode === part;
              }
            }
            if (isPartStr) {
              Sizzle.filter(part, checkSet, true);
            }
          }
        },
        '': function (checkSet, part, isXML) {
          var nodeCheck,
            doneName = done++,
            checkFn = dirCheck;
          if (typeof part === 'string' && !rNonWord.test(part)) {
            part = part.toLowerCase();
            nodeCheck = part;
            checkFn = dirNodeCheck;
          }
          checkFn('parentNode', part, doneName, checkSet, nodeCheck, isXML);
        },
        '~': function (checkSet, part, isXML) {
          var nodeCheck,
            doneName = done++,
            checkFn = dirCheck;
          if (typeof part === 'string' && !rNonWord.test(part)) {
            part = part.toLowerCase();
            nodeCheck = part;
            checkFn = dirNodeCheck;
          }
          checkFn(
            'previousSibling',
            part,
            doneName,
            checkSet,
            nodeCheck,
            isXML
          );
        },
      },
      find: {
        ID: function (match, context, isXML) {
          if (typeof context.getElementById !== 'undefined' && !isXML) {
            var m = context.getElementById(match[1]);
            return m && m.parentNode ? [m] : [];
          }
        },
        NAME: function (match, context) {
          if (typeof context.getElementsByName !== 'undefined') {
            var ret = [],
              results = context.getElementsByName(match[1]);
            for (var i = 0, l = results.length; i < l; i++) {
              if (results[i].getAttribute('name') === match[1]) {
                ret.push(results[i]);
              }
            }
            return ret.length === 0 ? null : ret;
          }
        },
        TAG: function (match, context) {
          if (typeof context.getElementsByTagName !== 'undefined') {
            return context.getElementsByTagName(match[1]);
          }
        },
      },
      preFilter: {
        CLASS: function (match, curLoop, inplace, result, not, isXML) {
          match = ' ' + match[1].replace(rBackslash, '') + ' ';
          if (isXML) {
            return match;
          }
          for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
            if (elem) {
              if (
                not ^
                (elem.className &&
                  (' ' + elem.className + ' ')
                    .replace(/[\t\n\r]/g, ' ')
                    .indexOf(match) >= 0)
              ) {
                if (!inplace) {
                  result.push(elem);
                }
              } else if (inplace) {
                curLoop[i] = false;
              }
            }
          }
          return false;
        },
        ID: function (match) {
          return match[1].replace(rBackslash, '');
        },
        TAG: function (match, curLoop) {
          return match[1].replace(rBackslash, '').toLowerCase();
        },
        CHILD: function (match) {
          if (match[1] === 'nth') {
            if (!match[2]) {
              Sizzle.error(match[0]);
            }
            match[2] = match[2].replace(/^\+|\s*/g, '');
            var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
              (match[2] === 'even' && '2n') ||
                (match[2] === 'odd' && '2n+1') ||
                (!/\D/.test(match[2]) && '0n+' + match[2]) ||
                match[2]
            );
            match[2] = test[1] + (test[2] || 1) - 0;
            match[3] = test[3] - 0;
          } else if (match[2]) {
            Sizzle.error(match[0]);
          }
          match[0] = done++;
          return match;
        },
        ATTR: function (match, curLoop, inplace, result, not, isXML) {
          var name = (match[1] = match[1].replace(rBackslash, ''));
          if (!isXML && Expr.attrMap[name]) {
            match[1] = Expr.attrMap[name];
          }
          match[4] = (match[4] || match[5] || '').replace(rBackslash, '');
          if (match[2] === '~=') {
            match[4] = ' ' + match[4] + ' ';
          }
          return match;
        },
        PSEUDO: function (match, curLoop, inplace, result, not) {
          if (match[1] === 'not') {
            if (
              (chunker.exec(match[3]) || '').length > 1 ||
              /^\w/.test(match[3])
            ) {
              match[3] = Sizzle(match[3], null, null, curLoop);
            } else {
              var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
              if (!inplace) {
                result.push.apply(result, ret);
              }
              return false;
            }
          } else if (
            Expr.match.POS.test(match[0]) ||
            Expr.match.CHILD.test(match[0])
          ) {
            return true;
          }
          return match;
        },
        POS: function (match) {
          match.unshift(true);
          return match;
        },
      },
      filters: {
        enabled: function (elem) {
          return elem.disabled === false && elem.type !== 'hidden';
        },
        disabled: function (elem) {
          return elem.disabled === true;
        },
        checked: function (elem) {
          return elem.checked === true;
        },
        selected: function (elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return elem.selected === true;
        },
        parent: function (elem) {
          return !!elem.firstChild;
        },
        empty: function (elem) {
          return !elem.firstChild;
        },
        has: function (elem, i, match) {
          return !!Sizzle(match[3], elem).length;
        },
        header: function (elem) {
          return /h\d/i.test(elem.nodeName);
        },
        text: function (elem) {
          var attr = elem.getAttribute('type'),
            type = elem.type;
          return (
            elem.nodeName.toLowerCase() === 'input' &&
            'text' === type &&
            (attr === type || attr === null)
          );
        },
        radio: function (elem) {
          return (
            elem.nodeName.toLowerCase() === 'input' && 'radio' === elem.type
          );
        },
        checkbox: function (elem) {
          return (
            elem.nodeName.toLowerCase() === 'input' && 'checkbox' === elem.type
          );
        },
        file: function (elem) {
          return (
            elem.nodeName.toLowerCase() === 'input' && 'file' === elem.type
          );
        },
        password: function (elem) {
          return (
            elem.nodeName.toLowerCase() === 'input' && 'password' === elem.type
          );
        },
        submit: function (elem) {
          var name = elem.nodeName.toLowerCase();
          return (
            (name === 'input' || name === 'button') && 'submit' === elem.type
          );
        },
        image: function (elem) {
          return (
            elem.nodeName.toLowerCase() === 'input' && 'image' === elem.type
          );
        },
        reset: function (elem) {
          var name = elem.nodeName.toLowerCase();
          return (
            (name === 'input' || name === 'button') && 'reset' === elem.type
          );
        },
        button: function (elem) {
          var name = elem.nodeName.toLowerCase();
          return (
            (name === 'input' && 'button' === elem.type) || name === 'button'
          );
        },
        input: function (elem) {
          return /input|select|textarea|button/i.test(elem.nodeName);
        },
        focus: function (elem) {
          return elem === elem.ownerDocument.activeElement;
        },
      },
      setFilters: {
        first: function (elem, i) {
          return i === 0;
        },
        last: function (elem, i, match, array) {
          return i === array.length - 1;
        },
        even: function (elem, i) {
          return i % 2 === 0;
        },
        odd: function (elem, i) {
          return i % 2 === 1;
        },
        lt: function (elem, i, match) {
          return i < match[3] - 0;
        },
        gt: function (elem, i, match) {
          return i > match[3] - 0;
        },
        nth: function (elem, i, match) {
          return match[3] - 0 === i;
        },
        eq: function (elem, i, match) {
          return match[3] - 0 === i;
        },
      },
      filter: {
        PSEUDO: function (elem, match, i, array) {
          var name = match[1],
            filter = Expr.filters[name];
          if (filter) {
            return filter(elem, i, match, array);
          } else if (name === 'contains') {
            return (
              (
                elem.textContent ||
                elem.innerText ||
                getText([elem]) ||
                ''
              ).indexOf(match[3]) >= 0
            );
          } else if (name === 'not') {
            var not = match[3];
            for (var j = 0, l = not.length; j < l; j++) {
              if (not[j] === elem) {
                return false;
              }
            }
            return true;
          } else {
            Sizzle.error(name);
          }
        },
        CHILD: function (elem, match) {
          var first,
            last,
            doneName,
            parent,
            cache,
            count,
            diff,
            type = match[1],
            node = elem;
          switch (type) {
            case 'only':
            case 'first':
              while ((node = node.previousSibling)) {
                if (node.nodeType === 1) {
                  return false;
                }
              }
              if (type === 'first') {
                return true;
              }
              node = elem;
            case 'last':
              while ((node = node.nextSibling)) {
                if (node.nodeType === 1) {
                  return false;
                }
              }
              return true;
            case 'nth':
              first = match[2];
              last = match[3];
              if (first === 1 && last === 0) {
                return true;
              }
              doneName = match[0];
              parent = elem.parentNode;
              if (parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
                count = 0;
                for (node = parent.firstChild; node; node = node.nextSibling) {
                  if (node.nodeType === 1) {
                    node.nodeIndex = ++count;
                  }
                }
                parent[expando] = doneName;
              }
              diff = elem.nodeIndex - last;
              if (first === 0) {
                return diff === 0;
              } else {
                return diff % first === 0 && diff / first >= 0;
              }
          }
        },
        ID: function (elem, match) {
          return elem.nodeType === 1 && elem.getAttribute('id') === match;
        },
        TAG: function (elem, match) {
          return (
            (match === '*' && elem.nodeType === 1) ||
            (!!elem.nodeName && elem.nodeName.toLowerCase() === match)
          );
        },
        CLASS: function (elem, match) {
          return (
            (
              ' ' +
              (elem.className || elem.getAttribute('class')) +
              ' '
            ).indexOf(match) > -1
          );
        },
        ATTR: function (elem, match) {
          var name = match[1],
            result = Sizzle.attr
              ? Sizzle.attr(elem, name)
              : Expr.attrHandle[name]
              ? Expr.attrHandle[name](elem)
              : elem[name] != null
              ? elem[name]
              : elem.getAttribute(name),
            value = result + '',
            type = match[2],
            check = match[4];
          return result == null
            ? type === '!='
            : !type && Sizzle.attr
            ? result != null
            : type === '='
            ? value === check
            : type === '*='
            ? value.indexOf(check) >= 0
            : type === '~='
            ? (' ' + value + ' ').indexOf(check) >= 0
            : !check
            ? value && result !== false
            : type === '!='
            ? value !== check
            : type === '^='
            ? value.indexOf(check) === 0
            : type === '$='
            ? value.substr(value.length - check.length) === check
            : type === '|='
            ? value === check ||
              value.substr(0, check.length + 1) === check + '-'
            : false;
        },
        POS: function (elem, match, i, array) {
          var name = match[2],
            filter = Expr.setFilters[name];
          if (filter) {
            return filter(elem, i, match, array);
          }
        },
      },
    });
    var origPOS = Expr.match.POS,
      fescape = function (all, num) {
        return '\\' + (num - 0 + 1);
      };
    for (var type in Expr.match) {
      Expr.match[type] = new RegExp(
        Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source
      );
      Expr.leftMatch[type] = new RegExp(
        /(^(?:.|\r|\n)*?)/.source +
          Expr.match[type].source.replace(/\\(\d+)/g, fescape)
      );
    }
    var makeArray = function (array, results) {
      array = Array.prototype.slice.call(array, 0);
      if (results) {
        results.push.apply(results, array);
        return results;
      }
      return array;
    };
    try {
      Array.prototype.slice.call(document.documentElement.childNodes, 0)[0]
        .nodeType;
    } catch (e) {
      makeArray = function (array, results) {
        var i = 0,
          ret = results || [];
        if (toString.call(array) === '[object Array]') {
          Array.prototype.push.apply(ret, array);
        } else {
          if (typeof array.length === 'number') {
            for (var l = array.length; i < l; i++) {
              ret.push(array[i]);
            }
          } else {
            for (; array[i]; i++) {
              ret.push(array[i]);
            }
          }
        }
        return ret;
      };
    }
    var sortOrder, siblingCheck;
    if (document.documentElement.compareDocumentPosition) {
      sortOrder = function (a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
          return a.compareDocumentPosition ? -1 : 1;
        }
        return a.compareDocumentPosition(b) & 4 ? -1 : 1;
      };
    } else {
      sortOrder = function (a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        } else if (a.sourceIndex && b.sourceIndex) {
          return a.sourceIndex - b.sourceIndex;
        }
        var al,
          bl,
          ap = [],
          bp = [],
          aup = a.parentNode,
          bup = b.parentNode,
          cur = aup;
        if (aup === bup) {
          return siblingCheck(a, b);
        } else if (!aup) {
          return -1;
        } else if (!bup) {
          return 1;
        }
        while (cur) {
          ap.unshift(cur);
          cur = cur.parentNode;
        }
        cur = bup;
        while (cur) {
          bp.unshift(cur);
          cur = cur.parentNode;
        }
        al = ap.length;
        bl = bp.length;
        for (var i = 0; i < al && i < bl; i++) {
          if (ap[i] !== bp[i]) {
            return siblingCheck(ap[i], bp[i]);
          }
        }
        return i === al
          ? siblingCheck(a, bp[i], -1)
          : siblingCheck(ap[i], b, 1);
      };
      siblingCheck = function (a, b, ret) {
        if (a === b) {
          return ret;
        }
        var cur = a.nextSibling;
        while (cur) {
          if (cur === b) {
            return -1;
          }
          cur = cur.nextSibling;
        }
        return 1;
      };
    }
    (function () {
      var form = document.createElement('div'),
        id = 'script' + new Date().getTime(),
        root = document.documentElement;
      form.innerHTML = "<a name='" + id + "'/>";
      root.insertBefore(form, root.firstChild);
      if (document.getElementById(id)) {
        Expr.find.ID = function (match, context, isXML) {
          if (typeof context.getElementById !== 'undefined' && !isXML) {
            var m = context.getElementById(match[1]);
            return m
              ? m.id === match[1] ||
                (typeof m.getAttributeNode !== 'undefined' &&
                  m.getAttributeNode('id').nodeValue === match[1])
                ? [m]
                : undefined
              : [];
          }
        };
        Expr.filter.ID = function (elem, match) {
          var node =
            typeof elem.getAttributeNode !== 'undefined' &&
            elem.getAttributeNode('id');
          return elem.nodeType === 1 && node && node.nodeValue === match;
        };
      }
      root.removeChild(form);
      root = form = null;
    })();
    (function () {
      var div = document.createElement('div');
      div.appendChild(document.createComment(''));
      if (div.getElementsByTagName('*').length > 0) {
        Expr.find.TAG = function (match, context) {
          var results = context.getElementsByTagName(match[1]);
          if (match[1] === '*') {
            var tmp = [];
            for (var i = 0; results[i]; i++) {
              if (results[i].nodeType === 1) {
                tmp.push(results[i]);
              }
            }
            results = tmp;
          }
          return results;
        };
      }
      div.innerHTML = "<a href='#'></a>";
      if (
        div.firstChild &&
        typeof div.firstChild.getAttribute !== 'undefined' &&
        div.firstChild.getAttribute('href') !== '#'
      ) {
        Expr.attrHandle.href = function (elem) {
          return elem.getAttribute('href', 2);
        };
      }
      div = null;
    })();
    if (document.querySelectorAll) {
      (function () {
        var oldSizzle = Sizzle,
          div = document.createElement('div'),
          id = '__sizzle__';
        div.innerHTML = "<p class='TEST'></p>";
        if (
          div.querySelectorAll &&
          div.querySelectorAll('.TEST').length === 0
        ) {
          return;
        }
        Sizzle = function (query, context, extra, seed) {
          context = context || document;
          if (!seed && !Sizzle.isXML(context)) {
            var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);
            if (match && (context.nodeType === 1 || context.nodeType === 9)) {
              if (match[1]) {
                return makeArray(context.getElementsByTagName(query), extra);
              } else if (
                match[2] &&
                Expr.find.CLASS &&
                context.getElementsByClassName
              ) {
                return makeArray(
                  context.getElementsByClassName(match[2]),
                  extra
                );
              }
            }
            if (context.nodeType === 9) {
              if (query === 'body' && context.body) {
                return makeArray([context.body], extra);
              } else if (match && match[3]) {
                var elem = context.getElementById(match[3]);
                if (elem && elem.parentNode) {
                  if (elem.id === match[3]) {
                    return makeArray([elem], extra);
                  }
                } else {
                  return makeArray([], extra);
                }
              }
              try {
                return makeArray(context.querySelectorAll(query), extra);
              } catch (qsaError) {}
            } else if (
              context.nodeType === 1 &&
              context.nodeName.toLowerCase() !== 'object'
            ) {
              var oldContext = context,
                old = context.getAttribute('id'),
                nid = old || id,
                hasParent = context.parentNode,
                relativeHierarchySelector = /^\s*[+~]/.test(query);
              if (!old) {
                context.setAttribute('id', nid);
              } else {
                nid = nid.replace(/'/g, '\\$&');
              }
              if (relativeHierarchySelector && hasParent) {
                context = context.parentNode;
              }
              try {
                if (!relativeHierarchySelector || hasParent) {
                  return makeArray(
                    context.querySelectorAll("[id='" + nid + "'] " + query),
                    extra
                  );
                }
              } catch (pseudoError) {
              } finally {
                if (!old) {
                  oldContext.removeAttribute('id');
                }
              }
            }
          }
          return oldSizzle(query, context, extra, seed);
        };
        for (var prop in oldSizzle) {
          Sizzle[prop] = oldSizzle[prop];
        }
        div = null;
      })();
    }
    (function () {
      var html = document.documentElement,
        matches =
          html.matchesSelector ||
          html.mozMatchesSelector ||
          html.webkitMatchesSelector ||
          html.msMatchesSelector;
      if (matches) {
        var disconnectedMatch = !matches.call(
            document.createElement('div'),
            'div'
          ),
          pseudoWorks = false;
        try {
          matches.call(document.documentElement, "[test!='']:sizzle");
        } catch (pseudoError) {
          pseudoWorks = true;
        }
        Sizzle.matchesSelector = function (node, expr) {
          expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
          if (!Sizzle.isXML(node)) {
            try {
              if (
                pseudoWorks ||
                (!Expr.match.PSEUDO.test(expr) && !/!=/.test(expr))
              ) {
                var ret = matches.call(node, expr);
                if (
                  ret ||
                  !disconnectedMatch ||
                  (node.document && node.document.nodeType !== 11)
                ) {
                  return ret;
                }
              }
            } catch (e) {}
          }
          return Sizzle(expr, null, null, [node]).length > 0;
        };
      }
    })();
    (function () {
      var div = document.createElement('div');
      div.innerHTML = "<div class='test e'></div><div class='test'></div>";
      if (
        !div.getElementsByClassName ||
        div.getElementsByClassName('e').length === 0
      ) {
        return;
      }
      div.lastChild.className = 'e';
      if (div.getElementsByClassName('e').length === 1) {
        return;
      }
      Expr.order.splice(1, 0, 'CLASS');
      Expr.find.CLASS = function (match, context, isXML) {
        if (typeof context.getElementsByClassName !== 'undefined' && !isXML) {
          return context.getElementsByClassName(match[1]);
        }
      };
      div = null;
    })();
    function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
      for (var i = 0, l = checkSet.length; i < l; i++) {
        var elem = checkSet[i];
        if (elem) {
          var match = false;
          elem = elem[dir];
          while (elem) {
            if (elem[expando] === doneName) {
              match = checkSet[elem.sizset];
              break;
            }
            if (elem.nodeType === 1 && !isXML) {
              elem[expando] = doneName;
              elem.sizset = i;
            }
            if (elem.nodeName.toLowerCase() === cur) {
              match = elem;
              break;
            }
            elem = elem[dir];
          }
          checkSet[i] = match;
        }
      }
    }
    function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
      for (var i = 0, l = checkSet.length; i < l; i++) {
        var elem = checkSet[i];
        if (elem) {
          var match = false;
          elem = elem[dir];
          while (elem) {
            if (elem[expando] === doneName) {
              match = checkSet[elem.sizset];
              break;
            }
            if (elem.nodeType === 1) {
              if (!isXML) {
                elem[expando] = doneName;
                elem.sizset = i;
              }
              if (typeof cur !== 'string') {
                if (elem === cur) {
                  match = true;
                  break;
                }
              } else if (Sizzle.filter(cur, [elem]).length > 0) {
                match = elem;
                break;
              }
            }
            elem = elem[dir];
          }
          checkSet[i] = match;
        }
      }
    }
    if (document.documentElement.contains) {
      Sizzle.contains = function (a, b) {
        return a !== b && (a.contains ? a.contains(b) : true);
      };
    } else if (document.documentElement.compareDocumentPosition) {
      Sizzle.contains = function (a, b) {
        return !!(a.compareDocumentPosition(b) & 16);
      };
    } else {
      Sizzle.contains = function () {
        return false;
      };
    }
    Sizzle.isXML = function (elem) {
      var documentElement = (elem ? elem.ownerDocument || elem : 0)
        .documentElement;
      return documentElement ? documentElement.nodeName !== 'HTML' : false;
    };
    var posProcess = function (selector, context, seed) {
      var match,
        tmpSet = [],
        later = '',
        root = context.nodeType ? [context] : context;
      while ((match = Expr.match.PSEUDO.exec(selector))) {
        later += match[0];
        selector = selector.replace(Expr.match.PSEUDO, '');
      }
      selector = Expr.relative[selector] ? selector + '*' : selector;
      for (var i = 0, l = root.length; i < l; i++) {
        Sizzle(selector, root[i], tmpSet, seed);
      }
      return Sizzle.filter(later, tmpSet);
    };
    Sizzle.attr = jQuery.attr;
    Sizzle.selectors.attrMap = {};
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[':'] = jQuery.expr.filters;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
  })();
  var runtil = /Until$/,
    rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    rmultiselector = /,/,
    isSimple = /^.[^:#\[\.,]*$/,
    slice = Array.prototype.slice,
    POS = jQuery.expr.match.POS,
    guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true,
    };
  jQuery.fn.extend({
    find: function (selector) {
      var self = this,
        i,
        l;
      if (typeof selector !== 'string') {
        return jQuery(selector).filter(function () {
          for (i = 0, l = self.length; i < l; i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        });
      }
      var ret = this.pushStack('', 'find', selector),
        length,
        n,
        r;
      for (i = 0, l = this.length; i < l; i++) {
        length = ret.length;
        jQuery.find(selector, this[i], ret);
        if (i > 0) {
          for (n = length; n < ret.length; n++) {
            for (r = 0; r < length; r++) {
              if (ret[r] === ret[n]) {
                ret.splice(n--, 1);
                break;
              }
            }
          }
        }
      }
      return ret;
    },
    has: function (target) {
      var targets = jQuery(target);
      return this.filter(function () {
        for (var i = 0, l = targets.length; i < l; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    not: function (selector) {
      return this.pushStack(winnow(this, selector, false), 'not', selector);
    },
    filter: function (selector) {
      return this.pushStack(winnow(this, selector, true), 'filter', selector);
    },
    is: function (selector) {
      return (
        !!selector &&
        (typeof selector === 'string'
          ? POS.test(selector)
            ? jQuery(selector, this.context).index(this[0]) >= 0
            : jQuery.filter(selector, this).length > 0
          : this.filter(selector).length > 0)
      );
    },
    closest: function (selectors, context) {
      var ret = [],
        i,
        l,
        cur = this[0];
      if (jQuery.isArray(selectors)) {
        var level = 1;
        while (cur && cur.ownerDocument && cur !== context) {
          for (i = 0; i < selectors.length; i++) {
            if (jQuery(cur).is(selectors[i])) {
              ret.push({ selector: selectors[i], elem: cur, level: level });
            }
          }
          cur = cur.parentNode;
          level++;
        }
        return ret;
      }
      var pos =
        POS.test(selectors) || typeof selectors !== 'string'
          ? jQuery(selectors, context || this.context)
          : 0;
      for (i = 0, l = this.length; i < l; i++) {
        cur = this[i];
        while (cur) {
          if (
            pos
              ? pos.index(cur) > -1
              : jQuery.find.matchesSelector(cur, selectors)
          ) {
            ret.push(cur);
            break;
          } else {
            cur = cur.parentNode;
            if (
              !cur ||
              !cur.ownerDocument ||
              cur === context ||
              cur.nodeType === 11
            ) {
              break;
            }
          }
        }
      }
      ret = ret.length > 1 ? jQuery.unique(ret) : ret;
      return this.pushStack(ret, 'closest', selectors);
    },
    index: function (elem) {
      if (!elem) {
        return this[0] && this[0].parentNode ? this.prevAll().length : -1;
      }
      if (typeof elem === 'string') {
        return jQuery.inArray(this[0], jQuery(elem));
      }
      return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
    },
    add: function (selector, context) {
      var set =
          typeof selector === 'string'
            ? jQuery(selector, context)
            : jQuery.makeArray(
                selector && selector.nodeType ? [selector] : selector
              ),
        all = jQuery.merge(this.get(), set);
      return this.pushStack(
        isDisconnected(set[0]) || isDisconnected(all[0])
          ? all
          : jQuery.unique(all)
      );
    },
    andSelf: function () {
      return this.add(this.prevObject);
    },
  });
  function isDisconnected(node) {
    return !node || !node.parentNode || node.parentNode.nodeType === 11;
  }
  jQuery.each(
    {
      parent: function (elem) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
      },
      parents: function (elem) {
        return jQuery.dir(elem, 'parentNode');
      },
      parentsUntil: function (elem, i, until) {
        return jQuery.dir(elem, 'parentNode', until);
      },
      next: function (elem) {
        return jQuery.nth(elem, 2, 'nextSibling');
      },
      prev: function (elem) {
        return jQuery.nth(elem, 2, 'previousSibling');
      },
      nextAll: function (elem) {
        return jQuery.dir(elem, 'nextSibling');
      },
      prevAll: function (elem) {
        return jQuery.dir(elem, 'previousSibling');
      },
      nextUntil: function (elem, i, until) {
        return jQuery.dir(elem, 'nextSibling', until);
      },
      prevUntil: function (elem, i, until) {
        return jQuery.dir(elem, 'previousSibling', until);
      },
      siblings: function (elem) {
        return jQuery.sibling(elem.parentNode.firstChild, elem);
      },
      children: function (elem) {
        return jQuery.sibling(elem.firstChild);
      },
      contents: function (elem) {
        return jQuery.nodeName(elem, 'iframe')
          ? elem.contentDocument || elem.contentWindow.document
          : jQuery.makeArray(elem.childNodes);
      },
    },
    function (name, fn) {
      jQuery.fn[name] = function (until, selector) {
        var ret = jQuery.map(this, fn, until);
        if (!runtil.test(name)) {
          selector = until;
        }
        if (selector && typeof selector === 'string') {
          ret = jQuery.filter(selector, ret);
        }
        ret =
          this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;
        if (
          (this.length > 1 || rmultiselector.test(selector)) &&
          rparentsprev.test(name)
        ) {
          ret = ret.reverse();
        }
        return this.pushStack(ret, name, slice.call(arguments).join(','));
      };
    }
  );
  jQuery.extend({
    filter: function (expr, elems, not) {
      if (not) {
        expr = ':not(' + expr + ')';
      }
      return elems.length === 1
        ? jQuery.find.matchesSelector(elems[0], expr)
          ? [elems[0]]
          : []
        : jQuery.find.matches(expr, elems);
    },
    dir: function (elem, dir, until) {
      var matched = [],
        cur = elem[dir];
      while (
        cur &&
        cur.nodeType !== 9 &&
        (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))
      ) {
        if (cur.nodeType === 1) {
          matched.push(cur);
        }
        cur = cur[dir];
      }
      return matched;
    },
    nth: function (cur, result, dir, elem) {
      result = result || 1;
      var num = 0;
      for (; cur; cur = cur[dir]) {
        if (cur.nodeType === 1 && ++num === result) {
          break;
        }
      }
      return cur;
    },
    sibling: function (n, elem) {
      var r = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          r.push(n);
        }
      }
      return r;
    },
  });
  function winnow(elements, qualifier, keep) {
    qualifier = qualifier || 0;
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function (elem, i) {
        var retVal = !!qualifier.call(elem, i, elem);
        return retVal === keep;
      });
    } else if (qualifier.nodeType) {
      return jQuery.grep(elements, function (elem, i) {
        return (elem === qualifier) === keep;
      });
    } else if (typeof qualifier === 'string') {
      var filtered = jQuery.grep(elements, function (elem) {
        return elem.nodeType === 1;
      });
      if (isSimple.test(qualifier)) {
        return jQuery.filter(qualifier, filtered, !keep);
      } else {
        qualifier = jQuery.filter(qualifier, filtered);
      }
    }
    return jQuery.grep(elements, function (elem, i) {
      return jQuery.inArray(elem, qualifier) >= 0 === keep;
    });
  }
  function createSafeFragment(document) {
    var list = nodeNames.split('|'),
      safeFrag = document.createDocumentFragment();
    if (safeFrag.createElement) {
      while (list.length) {
        safeFrag.createElement(list.pop());
      }
    }
    return safeFrag;
  }
  var nodeNames =
      'abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|' +
      'header|hgroup|mark|meter|nav|output|progress|section|summary|time|video',
    rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
    rleadingWhitespace = /^\s+/,
    rxhtmlTag =
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style)/i,
    rnocache = /<(?:script|object|embed|option|style)/i,
    rnoshimcache = new RegExp('<(?:' + nodeNames + ')', 'i'),
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /\/(java|ecma)script/i,
    rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
    wrapMap = {
      option: [1, "<select multiple='multiple'>", '</select>'],
      legend: [1, '<fieldset>', '</fieldset>'],
      thead: [1, '<table>', '</table>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      area: [1, '<map>', '</map>'],
      _default: [0, '', ''],
    },
    safeFragment = createSafeFragment(document);
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody =
    wrapMap.tfoot =
    wrapMap.colgroup =
    wrapMap.caption =
      wrapMap.thead;
  wrapMap.th = wrapMap.td;
  if (!jQuery.support.htmlSerialize) {
    wrapMap._default = [1, 'div<div>', '</div>'];
  }
  jQuery.fn.extend({
    text: function (text) {
      if (jQuery.isFunction(text)) {
        return this.each(function (i) {
          var self = jQuery(this);
          self.text(text.call(this, i, self.text()));
        });
      }
      if (typeof text !== 'object' && text !== undefined) {
        return this.empty().append(
          ((this[0] && this[0].ownerDocument) || document).createTextNode(text)
        );
      }
      return jQuery.text(this);
    },
    wrapAll: function (html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapAll(html.call(this, i));
        });
      }
      if (this[0]) {
        var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap
          .map(function () {
            var elem = this;
            while (elem.firstChild && elem.firstChild.nodeType === 1) {
              elem = elem.firstChild;
            }
            return elem;
          })
          .append(this);
      }
      return this;
    },
    wrapInner: function (html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapInner(html.call(this, i));
        });
      }
      return this.each(function () {
        var self = jQuery(this),
          contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function (html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function (i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function () {
      return this.parent()
        .each(function () {
          if (!jQuery.nodeName(this, 'body')) {
            jQuery(this).replaceWith(this.childNodes);
          }
        })
        .end();
    },
    append: function () {
      return this.domManip(arguments, true, function (elem) {
        if (this.nodeType === 1) {
          this.appendChild(elem);
        }
      });
    },
    prepend: function () {
      return this.domManip(arguments, true, function (elem) {
        if (this.nodeType === 1) {
          this.insertBefore(elem, this.firstChild);
        }
      });
    },
    before: function () {
      if (this[0] && this[0].parentNode) {
        return this.domManip(arguments, false, function (elem) {
          this.parentNode.insertBefore(elem, this);
        });
      } else if (arguments.length) {
        var set = jQuery.clean(arguments);
        set.push.apply(set, this.toArray());
        return this.pushStack(set, 'before', arguments);
      }
    },
    after: function () {
      if (this[0] && this[0].parentNode) {
        return this.domManip(arguments, false, function (elem) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        });
      } else if (arguments.length) {
        var set = this.pushStack(this, 'after', arguments);
        set.push.apply(set, jQuery.clean(arguments));
        return set;
      }
    },
    remove: function (selector, keepData) {
      for (var i = 0, elem; (elem = this[i]) != null; i++) {
        if (!selector || jQuery.filter(selector, [elem]).length) {
          if (!keepData && elem.nodeType === 1) {
            jQuery.cleanData(elem.getElementsByTagName('*'));
            jQuery.cleanData([elem]);
          }
          if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
          }
        }
      }
      return this;
    },
    empty: function () {
      for (var i = 0, elem; (elem = this[i]) != null; i++) {
        if (elem.nodeType === 1) {
          jQuery.cleanData(elem.getElementsByTagName('*'));
        }
        while (elem.firstChild) {
          elem.removeChild(elem.firstChild);
        }
      }
      return this;
    },
    clone: function (dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents =
        deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function () {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function (value) {
      if (value === undefined) {
        return this[0] && this[0].nodeType === 1
          ? this[0].innerHTML.replace(rinlinejQuery, '')
          : null;
      } else if (
        typeof value === 'string' &&
        !rnoInnerhtml.test(value) &&
        (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
        !wrapMap[(rtagName.exec(value) || ['', ''])[1].toLowerCase()]
      ) {
        value = value.replace(rxhtmlTag, '<$1></$2>');
        try {
          for (var i = 0, l = this.length; i < l; i++) {
            if (this[i].nodeType === 1) {
              jQuery.cleanData(this[i].getElementsByTagName('*'));
              this[i].innerHTML = value;
            }
          }
        } catch (e) {
          this.empty().append(value);
        }
      } else if (jQuery.isFunction(value)) {
        this.each(function (i) {
          var self = jQuery(this);
          self.html(value.call(this, i, self.html()));
        });
      } else {
        this.empty().append(value);
      }
      return this;
    },
    replaceWith: function (value) {
      if (this[0] && this[0].parentNode) {
        if (jQuery.isFunction(value)) {
          return this.each(function (i) {
            var self = jQuery(this),
              old = self.html();
            self.replaceWith(value.call(this, i, old));
          });
        }
        if (typeof value !== 'string') {
          value = jQuery(value).detach();
        }
        return this.each(function () {
          var next = this.nextSibling,
            parent = this.parentNode;
          jQuery(this).remove();
          if (next) {
            jQuery(next).before(value);
          } else {
            jQuery(parent).append(value);
          }
        });
      } else {
        return this.length
          ? this.pushStack(
              jQuery(jQuery.isFunction(value) ? value() : value),
              'replaceWith',
              value
            )
          : this;
      }
    },
    detach: function (selector) {
      return this.remove(selector, true);
    },
    domManip: function (args, table, callback) {
      var results,
        first,
        fragment,
        parent,
        value = args[0],
        scripts = [];
      if (
        !jQuery.support.checkClone &&
        arguments.length === 3 &&
        typeof value === 'string' &&
        rchecked.test(value)
      ) {
        return this.each(function () {
          jQuery(this).domManip(args, table, callback, true);
        });
      }
      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          var self = jQuery(this);
          args[0] = value.call(this, i, table ? self.html() : undefined);
          self.domManip(args, table, callback);
        });
      }
      if (this[0]) {
        parent = value && value.parentNode;
        if (
          jQuery.support.parentNode &&
          parent &&
          parent.nodeType === 11 &&
          parent.childNodes.length === this.length
        ) {
          results = { fragment: parent };
        } else {
          results = jQuery.buildFragment(args, this, scripts);
        }
        fragment = results.fragment;
        if (fragment.childNodes.length === 1) {
          first = fragment = fragment.firstChild;
        } else {
          first = fragment.firstChild;
        }
        if (first) {
          table = table && jQuery.nodeName(first, 'tr');
          for (var i = 0, l = this.length, lastIndex = l - 1; i < l; i++) {
            callback.call(
              table ? root(this[i], first) : this[i],
              results.cacheable || (l > 1 && i < lastIndex)
                ? jQuery.clone(fragment, true, true)
                : fragment
            );
          }
        }
        if (scripts.length) {
          jQuery.each(scripts, evalScript);
        }
      }
      return this;
    },
  });
  function root(elem, cur) {
    return jQuery.nodeName(elem, 'table')
      ? elem.getElementsByTagName('tbody')[0] ||
          elem.appendChild(elem.ownerDocument.createElement('tbody'))
      : elem;
  }
  function cloneCopyEvent(src, dest) {
    if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
      return;
    }
    var type,
      i,
      l,
      oldData = jQuery._data(src),
      curData = jQuery._data(dest, oldData),
      events = oldData.events;
    if (events) {
      delete curData.handle;
      curData.events = {};
      for (type in events) {
        for (i = 0, l = events[type].length; i < l; i++) {
          jQuery.event.add(
            dest,
            type +
              (events[type][i].namespace ? '.' : '') +
              events[type][i].namespace,
            events[type][i],
            events[type][i].data
          );
        }
      }
    }
    if (curData.data) {
      curData.data = jQuery.extend({}, curData.data);
    }
  }
  function cloneFixAttributes(src, dest) {
    var nodeName;
    if (dest.nodeType !== 1) {
      return;
    }
    if (dest.clearAttributes) {
      dest.clearAttributes();
    }
    if (dest.mergeAttributes) {
      dest.mergeAttributes(src);
    }
    nodeName = dest.nodeName.toLowerCase();
    if (nodeName === 'object') {
      dest.outerHTML = src.outerHTML;
    } else if (
      nodeName === 'input' &&
      (src.type === 'checkbox' || src.type === 'radio')
    ) {
      if (src.checked) {
        dest.defaultChecked = dest.checked = src.checked;
      }
      if (dest.value !== src.value) {
        dest.value = src.value;
      }
    } else if (nodeName === 'option') {
      dest.selected = src.defaultSelected;
    } else if (nodeName === 'input' || nodeName === 'textarea') {
      dest.defaultValue = src.defaultValue;
    }
    dest.removeAttribute(jQuery.expando);
  }
  jQuery.buildFragment = function (args, nodes, scripts) {
    var fragment,
      cacheable,
      cacheresults,
      doc,
      first = args[0];
    if (nodes && nodes[0]) {
      doc = nodes[0].ownerDocument || nodes[0];
    }
    if (!doc.createDocumentFragment) {
      doc = document;
    }
    if (
      args.length === 1 &&
      typeof first === 'string' &&
      first.length < 512 &&
      doc === document &&
      first.charAt(0) === '<' &&
      !rnocache.test(first) &&
      (jQuery.support.checkClone || !rchecked.test(first)) &&
      (jQuery.support.html5Clone || !rnoshimcache.test(first))
    ) {
      cacheable = true;
      cacheresults = jQuery.fragments[first];
      if (cacheresults && cacheresults !== 1) {
        fragment = cacheresults;
      }
    }
    if (!fragment) {
      fragment = doc.createDocumentFragment();
      jQuery.clean(args, doc, fragment, scripts);
    }
    if (cacheable) {
      jQuery.fragments[first] = cacheresults ? fragment : 1;
    }
    return { fragment: fragment, cacheable: cacheable };
  };
  jQuery.fragments = {};
  jQuery.each(
    {
      appendTo: 'append',
      prependTo: 'prepend',
      insertBefore: 'before',
      insertAfter: 'after',
      replaceAll: 'replaceWith',
    },
    function (name, original) {
      jQuery.fn[name] = function (selector) {
        var ret = [],
          insert = jQuery(selector),
          parent = this.length === 1 && this[0].parentNode;
        if (
          parent &&
          parent.nodeType === 11 &&
          parent.childNodes.length === 1 &&
          insert.length === 1
        ) {
          insert[original](this[0]);
          return this;
        } else {
          for (var i = 0, l = insert.length; i < l; i++) {
            var elems = (i > 0 ? this.clone(true) : this).get();
            jQuery(insert[i])[original](elems);
            ret = ret.concat(elems);
          }
          return this.pushStack(ret, name, insert.selector);
        }
      };
    }
  );
  function getAll(elem) {
    if (typeof elem.getElementsByTagName !== 'undefined') {
      return elem.getElementsByTagName('*');
    } else if (typeof elem.querySelectorAll !== 'undefined') {
      return elem.querySelectorAll('*');
    } else {
      return [];
    }
  }
  function fixDefaultChecked(elem) {
    if (elem.type === 'checkbox' || elem.type === 'radio') {
      elem.defaultChecked = elem.checked;
    }
  }
  function findInputs(elem) {
    var nodeName = (elem.nodeName || '').toLowerCase();
    if (nodeName === 'input') {
      fixDefaultChecked(elem);
    } else if (
      nodeName !== 'script' &&
      typeof elem.getElementsByTagName !== 'undefined'
    ) {
      jQuery.grep(elem.getElementsByTagName('input'), fixDefaultChecked);
    }
  }
  function shimCloneNode(elem) {
    var div = document.createElement('div');
    safeFragment.appendChild(div);
    div.innerHTML = elem.outerHTML;
    return div.firstChild;
  }
  jQuery.extend({
    clone: function (elem, dataAndEvents, deepDataAndEvents) {
      var srcElements,
        destElements,
        i,
        clone =
          jQuery.support.html5Clone || !rnoshimcache.test('<' + elem.nodeName)
            ? elem.cloneNode(true)
            : shimCloneNode(elem);
      if (
        (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) &&
        !jQuery.isXMLDoc(elem)
      ) {
        cloneFixAttributes(elem, clone);
        srcElements = getAll(elem);
        destElements = getAll(clone);
        for (i = 0; srcElements[i]; ++i) {
          if (destElements[i]) {
            cloneFixAttributes(srcElements[i], destElements[i]);
          }
        }
      }
      if (dataAndEvents) {
        cloneCopyEvent(elem, clone);
        if (deepDataAndEvents) {
          srcElements = getAll(elem);
          destElements = getAll(clone);
          for (i = 0; srcElements[i]; ++i) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        }
      }
      srcElements = destElements = null;
      return clone;
    },
    clean: function (elems, context, fragment, scripts) {
      var checkScriptType;
      context = context || document;
      if (typeof context.createElement === 'undefined') {
        context =
          context.ownerDocument ||
          (context[0] && context[0].ownerDocument) ||
          document;
      }
      var ret = [],
        j;
      for (var i = 0, elem; (elem = elems[i]) != null; i++) {
        if (typeof elem === 'number') {
          elem += '';
        }
        if (!elem) {
          continue;
        }
        if (typeof elem === 'string') {
          if (!rhtml.test(elem)) {
            elem = context.createTextNode(elem);
          } else {
            elem = elem.replace(rxhtmlTag, '<$1></$2>');
            var tag = (rtagName.exec(elem) || ['', ''])[1].toLowerCase(),
              wrap = wrapMap[tag] || wrapMap._default,
              depth = wrap[0],
              div = context.createElement('div');
            if (context === document) {
              safeFragment.appendChild(div);
            } else {
              createSafeFragment(context).appendChild(div);
            }
            div.innerHTML = wrap[1] + elem + wrap[2];
            while (depth--) {
              div = div.lastChild;
            }
            if (!jQuery.support.tbody) {
              var hasBody = rtbody.test(elem),
                tbody =
                  tag === 'table' && !hasBody
                    ? div.firstChild && div.firstChild.childNodes
                    : wrap[1] === '<table>' && !hasBody
                    ? div.childNodes
                    : [];
              for (j = tbody.length - 1; j >= 0; --j) {
                if (
                  jQuery.nodeName(tbody[j], 'tbody') &&
                  !tbody[j].childNodes.length
                ) {
                  tbody[j].parentNode.removeChild(tbody[j]);
                }
              }
            }
            if (
              !jQuery.support.leadingWhitespace &&
              rleadingWhitespace.test(elem)
            ) {
              div.insertBefore(
                context.createTextNode(rleadingWhitespace.exec(elem)[0]),
                div.firstChild
              );
            }
            elem = div.childNodes;
          }
        }
        var len;
        if (!jQuery.support.appendChecked) {
          if (elem[0] && typeof (len = elem.length) === 'number') {
            for (j = 0; j < len; j++) {
              findInputs(elem[j]);
            }
          } else {
            findInputs(elem);
          }
        }
        if (elem.nodeType) {
          ret.push(elem);
        } else {
          ret = jQuery.merge(ret, elem);
        }
      }
      if (fragment) {
        checkScriptType = function (elem) {
          return !elem.type || rscriptType.test(elem.type);
        };
        for (i = 0; ret[i]; i++) {
          if (
            scripts &&
            jQuery.nodeName(ret[i], 'script') &&
            (!ret[i].type || ret[i].type.toLowerCase() === 'text/javascript')
          ) {
            scripts.push(
              ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]
            );
          } else {
            if (ret[i].nodeType === 1) {
              var jsTags = jQuery.grep(
                ret[i].getElementsByTagName('script'),
                checkScriptType
              );
              ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
            }
            fragment.appendChild(ret[i]);
          }
        }
      }
      return ret;
    },
    cleanData: function (elems) {
      var data,
        id,
        cache = jQuery.cache,
        special = jQuery.event.special,
        deleteExpando = jQuery.support.deleteExpando;
      for (var i = 0, elem; (elem = elems[i]) != null; i++) {
        if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
          continue;
        }
        id = elem[jQuery.expando];
        if (id) {
          data = cache[id];
          if (data && data.events) {
            for (var type in data.events) {
              if (special[type]) {
                jQuery.event.remove(elem, type);
              } else {
                jQuery.removeEvent(elem, type, data.handle);
              }
            }
            if (data.handle) {
              data.handle.elem = null;
            }
          }
          if (deleteExpando) {
            delete elem[jQuery.expando];
          } else if (elem.removeAttribute) {
            elem.removeAttribute(jQuery.expando);
          }
          delete cache[id];
        }
      }
    },
  });
  function evalScript(i, elem) {
    if (elem.src) {
      jQuery.ajax({ url: elem.src, async: false, dataType: 'script' });
    } else {
      jQuery.globalEval(
        (elem.text || elem.textContent || elem.innerHTML || '').replace(
          rcleanScript,
          '/*$0*/'
        )
      );
    }
    if (elem.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  }
  var ralpha = /alpha\([^)]*\)/i,
    ropacity = /opacity=([^)]*)/,
    rupper = /([A-Z]|^ms)/g,
    rnumpx = /^-?\d+(?:px)?$/i,
    rnum = /^-?\d/,
    rrelNum = /^([\-+])=([\-+.\de]+)/,
    cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' },
    cssWidth = ['Left', 'Right'],
    cssHeight = ['Top', 'Bottom'],
    curCSS,
    getComputedStyle,
    currentStyle;
  jQuery.fn.css = function (name, value) {
    if (arguments.length === 2 && value === undefined) {
      return this;
    }
    return jQuery.access(this, name, value, true, function (elem, name, value) {
      return value !== undefined
        ? jQuery.style(elem, name, value)
        : jQuery.css(elem, name);
    });
  };
  jQuery.extend({
    cssHooks: {
      opacity: {
        get: function (elem, computed) {
          if (computed) {
            var ret = curCSS(elem, 'opacity', 'opacity');
            return ret === '' ? '1' : ret;
          } else {
            return elem.style.opacity;
          }
        },
      },
    },
    cssNumber: {
      fillOpacity: true,
      fontWeight: true,
      lineHeight: true,
      opacity: true,
      orphans: true,
      widows: true,
      zIndex: true,
      zoom: true,
    },
    cssProps: { float: jQuery.support.cssFloat ? 'cssFloat' : 'styleFloat' },
    style: function (elem, name, value, extra) {
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      var ret,
        type,
        origName = jQuery.camelCase(name),
        style = elem.style,
        hooks = jQuery.cssHooks[origName];
      name = jQuery.cssProps[origName] || origName;
      if (value !== undefined) {
        type = typeof value;
        if (type === 'string' && (ret = rrelNum.exec(value))) {
          value = +(ret[1] + 1) * +ret[2] + parseFloat(jQuery.css(elem, name));
          type = 'number';
        }
        if (value == null || (type === 'number' && isNaN(value))) {
          return;
        }
        if (type === 'number' && !jQuery.cssNumber[origName]) {
          value += 'px';
        }
        if (
          !hooks ||
          !('set' in hooks) ||
          (value = hooks.set(elem, value)) !== undefined
        ) {
          try {
            style[name] = value;
          } catch (e) {}
        }
      } else {
        if (
          hooks &&
          'get' in hooks &&
          (ret = hooks.get(elem, false, extra)) !== undefined
        ) {
          return ret;
        }
        return style[name];
      }
    },
    css: function (elem, name, extra) {
      var ret, hooks;
      name = jQuery.camelCase(name);
      hooks = jQuery.cssHooks[name];
      name = jQuery.cssProps[name] || name;
      if (name === 'cssFloat') {
        name = 'float';
      }
      if (
        hooks &&
        'get' in hooks &&
        (ret = hooks.get(elem, true, extra)) !== undefined
      ) {
        return ret;
      } else if (curCSS) {
        return curCSS(elem, name);
      }
    },
    swap: function (elem, options, callback) {
      var old = {};
      for (var name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      }
      callback.call(elem);
      for (name in options) {
        elem.style[name] = old[name];
      }
    },
  });
  jQuery.curCSS = jQuery.css;
  jQuery.each(['height', 'width'], function (i, name) {
    jQuery.cssHooks[name] = {
      get: function (elem, computed, extra) {
        var val;
        if (computed) {
          if (elem.offsetWidth !== 0) {
            return getWH(elem, name, extra);
          } else {
            jQuery.swap(elem, cssShow, function () {
              val = getWH(elem, name, extra);
            });
          }
          return val;
        }
      },
      set: function (elem, value) {
        if (rnumpx.test(value)) {
          value = parseFloat(value);
          if (value >= 0) {
            return value + 'px';
          }
        } else {
          return value;
        }
      },
    };
  });
  if (!jQuery.support.opacity) {
    jQuery.cssHooks.opacity = {
      get: function (elem, computed) {
        return ropacity.test(
          (computed && elem.currentStyle
            ? elem.currentStyle.filter
            : elem.style.filter) || ''
        )
          ? parseFloat(RegExp.$1) / 100 + ''
          : computed
          ? '1'
          : '';
      },
      set: function (elem, value) {
        var style = elem.style,
          currentStyle = elem.currentStyle,
          opacity = jQuery.isNumeric(value)
            ? 'alpha(opacity=' + value * 100 + ')'
            : '',
          filter = (currentStyle && currentStyle.filter) || style.filter || '';
        style.zoom = 1;
        if (value >= 1 && jQuery.trim(filter.replace(ralpha, '')) === '') {
          style.removeAttribute('filter');
          if (currentStyle && !currentStyle.filter) {
            return;
          }
        }
        style.filter = ralpha.test(filter)
          ? filter.replace(ralpha, opacity)
          : filter + ' ' + opacity;
      },
    };
  }
  jQuery(function () {
    if (!jQuery.support.reliableMarginRight) {
      jQuery.cssHooks.marginRight = {
        get: function (elem, computed) {
          var ret;
          jQuery.swap(elem, { display: 'inline-block' }, function () {
            if (computed) {
              ret = curCSS(elem, 'margin-right', 'marginRight');
            } else {
              ret = elem.style.marginRight;
            }
          });
          return ret;
        },
      };
    }
  });
  if (document.defaultView && document.defaultView.getComputedStyle) {
    getComputedStyle = function (elem, name) {
      var ret, defaultView, computedStyle;
      name = name.replace(rupper, '-$1').toLowerCase();
      if (
        (defaultView = elem.ownerDocument.defaultView) &&
        (computedStyle = defaultView.getComputedStyle(elem, null))
      ) {
        ret = computedStyle.getPropertyValue(name);
        if (
          ret === '' &&
          !jQuery.contains(elem.ownerDocument.documentElement, elem)
        ) {
          ret = jQuery.style(elem, name);
        }
      }
      return ret;
    };
  }
  if (document.documentElement.currentStyle) {
    currentStyle = function (elem, name) {
      var left,
        rsLeft,
        uncomputed,
        ret = elem.currentStyle && elem.currentStyle[name],
        style = elem.style;
      if (ret === null && style && (uncomputed = style[name])) {
        ret = uncomputed;
      }
      if (!rnumpx.test(ret) && rnum.test(ret)) {
        left = style.left;
        rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;
        if (rsLeft) {
          elem.runtimeStyle.left = elem.currentStyle.left;
        }
        style.left = name === 'fontSize' ? '1em' : ret || 0;
        ret = style.pixelLeft + 'px';
        style.left = left;
        if (rsLeft) {
          elem.runtimeStyle.left = rsLeft;
        }
      }
      return ret === '' ? 'auto' : ret;
    };
  }
  curCSS = getComputedStyle || currentStyle;
  function getWH(elem, name, extra) {
    var val = name === 'width' ? elem.offsetWidth : elem.offsetHeight,
      which = name === 'width' ? cssWidth : cssHeight,
      i = 0,
      len = which.length;
    if (val > 0) {
      if (extra !== 'border') {
        for (; i < len; i++) {
          if (!extra) {
            val -= parseFloat(jQuery.css(elem, 'padding' + which[i])) || 0;
          }
          if (extra === 'margin') {
            val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
          } else {
            val -=
              parseFloat(jQuery.css(elem, 'border' + which[i] + 'Width')) || 0;
          }
        }
      }
      return val + 'px';
    }
    val = curCSS(elem, name, name);
    if (val < 0 || val == null) {
      val = elem.style[name] || 0;
    }
    val = parseFloat(val) || 0;
    if (extra) {
      for (; i < len; i++) {
        val += parseFloat(jQuery.css(elem, 'padding' + which[i])) || 0;
        if (extra !== 'padding') {
          val +=
            parseFloat(jQuery.css(elem, 'border' + which[i] + 'Width')) || 0;
        }
        if (extra === 'margin') {
          val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
        }
      }
    }
    return val + 'px';
  }
  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.hidden = function (elem) {
      var width = elem.offsetWidth,
        height = elem.offsetHeight;
      return (
        (width === 0 && height === 0) ||
        (!jQuery.support.reliableHiddenOffsets &&
          ((elem.style && elem.style.display) ||
            jQuery.css(elem, 'display')) === 'none')
      );
    };
    jQuery.expr.filters.visible = function (elem) {
      return !jQuery.expr.filters.hidden(elem);
    };
  }
  var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rhash = /#.*$/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    rinput =
      /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    rlocalProtocol =
      /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rquery = /\?/,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    rselectTextarea = /^(?:select|textarea)/i,
    rspacesAjax = /\s+/,
    rts = /([?&])_=[^&]*/,
    rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
    _load = jQuery.fn.load,
    prefilters = {},
    transports = {},
    ajaxLocation,
    ajaxLocParts,
    allTypes = ['*/'] + ['*'];
  try {
    ajaxLocation = location.href;
  } catch (e) {
    ajaxLocation = document.createElement('a');
    ajaxLocation.href = '';
    ajaxLocation = ajaxLocation.href;
  }
  ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
  function addToPrefiltersOrTransports(structure) {
    return function (dataTypeExpression, func) {
      if (typeof dataTypeExpression !== 'string') {
        func = dataTypeExpression;
        dataTypeExpression = '*';
      }
      if (jQuery.isFunction(func)) {
        var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax),
          i = 0,
          length = dataTypes.length,
          dataType,
          list,
          placeBefore;
        for (; i < length; i++) {
          dataType = dataTypes[i];
          placeBefore = /^\+/.test(dataType);
          if (placeBefore) {
            dataType = dataType.substr(1) || '*';
          }
          list = structure[dataType] = structure[dataType] || [];
          list[placeBefore ? 'unshift' : 'push'](func);
        }
      }
    };
  }
  function inspectPrefiltersOrTransports(
    structure,
    options,
    originalOptions,
    jqXHR,
    dataType,
    inspected
  ) {
    dataType = dataType || options.dataTypes[0];
    inspected = inspected || {};
    inspected[dataType] = true;
    var list = structure[dataType],
      i = 0,
      length = list ? list.length : 0,
      executeOnly = structure === prefilters,
      selection;
    for (; i < length && (executeOnly || !selection); i++) {
      selection = list[i](options, originalOptions, jqXHR);
      if (typeof selection === 'string') {
        if (!executeOnly || inspected[selection]) {
          selection = undefined;
        } else {
          options.dataTypes.unshift(selection);
          selection = inspectPrefiltersOrTransports(
            structure,
            options,
            originalOptions,
            jqXHR,
            selection,
            inspected
          );
        }
      }
    }
    if ((executeOnly || !selection) && !inspected['*']) {
      selection = inspectPrefiltersOrTransports(
        structure,
        options,
        originalOptions,
        jqXHR,
        '*',
        inspected
      );
    }
    return selection;
  }
  function ajaxExtend(target, src) {
    var key,
      deep,
      flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }
  }
  jQuery.fn.extend({
    load: function (url, params, callback) {
      if (typeof url !== 'string' && _load) {
        return _load.apply(this, arguments);
      } else if (!this.length) {
        return this;
      }
      var off = url.indexOf(' ');
      if (off >= 0) {
        var selector = url.slice(off, url.length);
        url = url.slice(0, off);
      }
      var type = 'GET';
      if (params) {
        if (jQuery.isFunction(params)) {
          callback = params;
          params = undefined;
        } else if (typeof params === 'object') {
          params = jQuery.param(params, jQuery.ajaxSettings.traditional);
          type = 'POST';
        }
      }
      var self = this;
      jQuery.ajax({
        url: url,
        type: type,
        dataType: 'html',
        data: params,
        complete: function (jqXHR, status, responseText) {
          responseText = jqXHR.responseText;
          if (jqXHR.isResolved()) {
            jqXHR.done(function (r) {
              responseText = r;
            });
            self.html(
              selector
                ? jQuery('<div>')
                    .append(responseText.replace(rscript, ''))
                    .find(selector)
                : responseText
            );
          }
          if (callback) {
            self.each(callback, [responseText, status, jqXHR]);
          }
        },
      });
      return this;
    },
    serialize: function () {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        return this.elements ? jQuery.makeArray(this.elements) : this;
      })
        .filter(function () {
          return (
            this.name &&
            !this.disabled &&
            (this.checked ||
              rselectTextarea.test(this.nodeName) ||
              rinput.test(this.type))
          );
        })
        .map(function (i, elem) {
          var val = jQuery(this).val();
          return val == null
            ? null
            : jQuery.isArray(val)
            ? jQuery.map(val, function (val, i) {
                return { name: elem.name, value: val.replace(rCRLF, '\r\n') };
              })
            : { name: elem.name, value: val.replace(rCRLF, '\r\n') };
        })
        .get();
    },
  });
  jQuery.each(
    'ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend'.split(' '),
    function (i, o) {
      jQuery.fn[o] = function (f) {
        return this.on(o, f);
      };
    }
  );
  jQuery.each(['get', 'post'], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }
      return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type,
      });
    };
  });
  jQuery.extend({
    getScript: function (url, callback) {
      return jQuery.get(url, undefined, callback, 'script');
    },
    getJSON: function (url, data, callback) {
      return jQuery.get(url, data, callback, 'json');
    },
    ajaxSetup: function (target, settings) {
      if (settings) {
        ajaxExtend(target, jQuery.ajaxSettings);
      } else {
        settings = target;
        target = jQuery.ajaxSettings;
      }
      ajaxExtend(target, settings);
      return target;
    },
    ajaxSettings: {
      url: ajaxLocation,
      isLocal: rlocalProtocol.test(ajaxLocParts[1]),
      global: true,
      type: 'GET',
      contentType: 'application/x-www-form-urlencoded',
      processData: true,
      async: true,
      accepts: {
        xml: 'application/xml, text/xml',
        html: 'text/html',
        text: 'text/plain',
        json: 'application/json, text/javascript',
        '*': allTypes,
      },
      contents: { xml: /xml/, html: /html/, json: /json/ },
      responseFields: { xml: 'responseXML', text: 'responseText' },
      converters: {
        '* text': window.String,
        'text html': true,
        'text json': jQuery.parseJSON,
        'text xml': jQuery.parseXML,
      },
      flatOptions: { context: true, url: true },
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function (url, options) {
      if (typeof url === 'object') {
        options = url;
        url = undefined;
      }
      options = options || {};
      var s = jQuery.ajaxSetup({}, options),
        callbackContext = s.context || s,
        globalEventContext =
          callbackContext !== s &&
          (callbackContext.nodeType || callbackContext instanceof jQuery)
            ? jQuery(callbackContext)
            : jQuery.event,
        deferred = jQuery.Deferred(),
        completeDeferred = jQuery.Callbacks('once memory'),
        statusCode = s.statusCode || {},
        ifModifiedKey,
        requestHeaders = {},
        requestHeadersNames = {},
        responseHeadersString,
        responseHeaders,
        transport,
        timeoutTimer,
        parts,
        state = 0,
        fireGlobals,
        i,
        jqXHR = {
          readyState: 0,
          setRequestHeader: function (name, value) {
            if (!state) {
              var lname = name.toLowerCase();
              name = requestHeadersNames[lname] =
                requestHeadersNames[lname] || name;
              requestHeaders[name] = value;
            }
            return this;
          },
          getAllResponseHeaders: function () {
            return state === 2 ? responseHeadersString : null;
          },
          getResponseHeader: function (key) {
            var match;
            if (state === 2) {
              if (!responseHeaders) {
                responseHeaders = {};
                while ((match = rheaders.exec(responseHeadersString))) {
                  responseHeaders[match[1].toLowerCase()] = match[2];
                }
              }
              match = responseHeaders[key.toLowerCase()];
            }
            return match === undefined ? null : match;
          },
          overrideMimeType: function (type) {
            if (!state) {
              s.mimeType = type;
            }
            return this;
          },
          abort: function (statusText) {
            statusText = statusText || 'abort';
            if (transport) {
              transport.abort(statusText);
            }
            done(0, statusText);
            return this;
          },
        };
      function done(status, nativeStatusText, responses, headers) {
        if (state === 2) {
          return;
        }
        state = 2;
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }
        transport = undefined;
        responseHeadersString = headers || '';
        jqXHR.readyState = status > 0 ? 4 : 0;
        var isSuccess,
          success,
          error,
          statusText = nativeStatusText,
          response = responses
            ? ajaxHandleResponses(s, jqXHR, responses)
            : undefined,
          lastModified,
          etag;
        if ((status >= 200 && status < 300) || status === 304) {
          if (s.ifModified) {
            if ((lastModified = jqXHR.getResponseHeader('Last-Modified'))) {
              jQuery.lastModified[ifModifiedKey] = lastModified;
            }
            if ((etag = jqXHR.getResponseHeader('Etag'))) {
              jQuery.etag[ifModifiedKey] = etag;
            }
          }
          if (status === 304) {
            statusText = 'notmodified';
            isSuccess = true;
          } else {
            try {
              success = ajaxConvert(s, response);
              statusText = 'success';
              isSuccess = true;
            } catch (e) {
              statusText = 'parsererror';
              error = e;
            }
          }
        } else {
          error = statusText;
          if (!statusText || status) {
            statusText = 'error';
            if (status < 0) {
              status = 0;
            }
          }
        }
        jqXHR.status = status;
        jqXHR.statusText = '' + (nativeStatusText || statusText);
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
        } else {
          deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
        }
        jqXHR.statusCode(statusCode);
        statusCode = undefined;
        if (fireGlobals) {
          globalEventContext.trigger(
            'ajax' + (isSuccess ? 'Success' : 'Error'),
            [jqXHR, s, isSuccess ? success : error]
          );
        }
        completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
        if (fireGlobals) {
          globalEventContext.trigger('ajaxComplete', [jqXHR, s]);
          if (!--jQuery.active) {
            jQuery.event.trigger('ajaxStop');
          }
        }
      }
      deferred.promise(jqXHR);
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;
      jqXHR.complete = completeDeferred.add;
      jqXHR.statusCode = function (map) {
        if (map) {
          var tmp;
          if (state < 2) {
            for (tmp in map) {
              statusCode[tmp] = [statusCode[tmp], map[tmp]];
            }
          } else {
            tmp = map[jqXHR.status];
            jqXHR.then(tmp, tmp);
          }
        }
        return this;
      };
      s.url = ((url || s.url) + '')
        .replace(rhash, '')
        .replace(rprotocol, ajaxLocParts[1] + '//');
      s.dataTypes = jQuery
        .trim(s.dataType || '*')
        .toLowerCase()
        .split(rspacesAjax);
      if (s.crossDomain == null) {
        parts = rurl.exec(s.url.toLowerCase());
        s.crossDomain = !!(
          parts &&
          (parts[1] != ajaxLocParts[1] ||
            parts[2] != ajaxLocParts[2] ||
            (parts[3] || (parts[1] === 'http:' ? 80 : 443)) !=
              (ajaxLocParts[3] || (ajaxLocParts[1] === 'http:' ? 80 : 443)))
        );
      }
      if (s.data && s.processData && typeof s.data !== 'string') {
        s.data = jQuery.param(s.data, s.traditional);
      }
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
      if (state === 2) {
        return false;
      }
      fireGlobals = s.global;
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      if (fireGlobals && jQuery.active++ === 0) {
        jQuery.event.trigger('ajaxStart');
      }
      if (!s.hasContent) {
        if (s.data) {
          s.url += (rquery.test(s.url) ? '&' : '?') + s.data;
          delete s.data;
        }
        ifModifiedKey = s.url;
        if (s.cache === false) {
          var ts = jQuery.now(),
            ret = s.url.replace(rts, '$1_=' + ts);
          s.url =
            ret +
            (ret === s.url ? (rquery.test(s.url) ? '&' : '?') + '_=' + ts : '');
        }
      }
      if (
        (s.data && s.hasContent && s.contentType !== false) ||
        options.contentType
      ) {
        jqXHR.setRequestHeader('Content-Type', s.contentType);
      }
      if (s.ifModified) {
        ifModifiedKey = ifModifiedKey || s.url;
        if (jQuery.lastModified[ifModifiedKey]) {
          jqXHR.setRequestHeader(
            'If-Modified-Since',
            jQuery.lastModified[ifModifiedKey]
          );
        }
        if (jQuery.etag[ifModifiedKey]) {
          jqXHR.setRequestHeader('If-None-Match', jQuery.etag[ifModifiedKey]);
        }
      }
      jqXHR.setRequestHeader(
        'Accept',
        s.dataTypes[0] && s.accepts[s.dataTypes[0]]
          ? s.accepts[s.dataTypes[0]] +
              (s.dataTypes[0] !== '*' ? ', ' + allTypes + '; q=0.01' : '')
          : s.accepts['*']
      );
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (
        s.beforeSend &&
        (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)
      ) {
        jqXHR.abort();
        return false;
      }
      for (i in { success: 1, error: 1, complete: 1 }) {
        jqXHR[i](s[i]);
      }
      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
      if (!transport) {
        done(-1, 'No Transport');
      } else {
        jqXHR.readyState = 1;
        if (fireGlobals) {
          globalEventContext.trigger('ajaxSend', [jqXHR, s]);
        }
        if (s.async && s.timeout > 0) {
          timeoutTimer = setTimeout(function () {
            jqXHR.abort('timeout');
          }, s.timeout);
        }
        try {
          state = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (state < 2) {
            done(-1, e);
          } else {
            throw e;
          }
        }
      }
      return jqXHR;
    },
    param: function (a, traditional) {
      var s = [],
        add = function (key, value) {
          value = jQuery.isFunction(value) ? value() : value;
          s[s.length] =
            encodeURIComponent(key) + '=' + encodeURIComponent(value);
        };
      if (traditional === undefined) {
        traditional = jQuery.ajaxSettings.traditional;
      }
      if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
        jQuery.each(a, function () {
          add(this.name, this.value);
        });
      } else {
        for (var prefix in a) {
          buildParams(prefix, a[prefix], traditional, add);
        }
      }
      return s.join('&').replace(r20, '+');
    },
  });
  function buildParams(prefix, obj, traditional, add) {
    if (jQuery.isArray(obj)) {
      jQuery.each(obj, function (i, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(
            prefix +
              '[' +
              (typeof v === 'object' || jQuery.isArray(v) ? i : '') +
              ']',
            v,
            traditional,
            add
          );
        }
      });
    } else if (!traditional && obj != null && typeof obj === 'object') {
      for (var name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  jQuery.extend({ active: 0, lastModified: {}, etag: {} });
  function ajaxHandleResponses(s, jqXHR, responses) {
    var contents = s.contents,
      dataTypes = s.dataTypes,
      responseFields = s.responseFields,
      ct,
      type,
      finalDataType,
      firstDataType;
    for (type in responseFields) {
      if (type in responses) {
        jqXHR[responseFields[type]] = responses[type];
      }
    }
    while (dataTypes[0] === '*') {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader('content-type');
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + ' ' + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      finalDataType = finalDataType || firstDataType;
    }
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }
  function ajaxConvert(s, response) {
    if (s.dataFilter) {
      response = s.dataFilter(response, s.dataType);
    }
    var dataTypes = s.dataTypes,
      converters = {},
      i,
      key,
      length = dataTypes.length,
      tmp,
      current = dataTypes[0],
      prev,
      conversion,
      conv,
      conv1,
      conv2;
    for (i = 1; i < length; i++) {
      if (i === 1) {
        for (key in s.converters) {
          if (typeof key === 'string') {
            converters[key.toLowerCase()] = s.converters[key];
          }
        }
      }
      prev = current;
      current = dataTypes[i];
      if (current === '*') {
        current = prev;
      } else if (prev !== '*' && prev !== current) {
        conversion = prev + ' ' + current;
        conv = converters[conversion] || converters['* ' + current];
        if (!conv) {
          conv2 = undefined;
          for (conv1 in converters) {
            tmp = conv1.split(' ');
            if (tmp[0] === prev || tmp[0] === '*') {
              conv2 = converters[tmp[1] + ' ' + current];
              if (conv2) {
                conv1 = converters[conv1];
                if (conv1 === true) {
                  conv = conv2;
                } else if (conv2 === true) {
                  conv = conv1;
                }
                break;
              }
            }
          }
        }
        if (!(conv || conv2)) {
          jQuery.error('No conversion from ' + conversion.replace(' ', ' to '));
        }
        if (conv !== true) {
          response = conv ? conv(response) : conv2(conv1(response));
        }
      }
    }
    return response;
  }
  var jsc = jQuery.now(),
    jsre = /(\=)\?(&|$)|\?\?/i;
  jQuery.ajaxSetup({
    jsonp: 'callback',
    jsonpCallback: function () {
      return jQuery.expando + '_' + jsc++;
    },
  });
  jQuery.ajaxPrefilter('json jsonp', function (s, originalSettings, jqXHR) {
    var inspectData =
      s.contentType === 'application/x-www-form-urlencoded' &&
      typeof s.data === 'string';
    if (
      s.dataTypes[0] === 'jsonp' ||
      (s.jsonp !== false &&
        (jsre.test(s.url) || (inspectData && jsre.test(s.data))))
    ) {
      var responseContainer,
        jsonpCallback = (s.jsonpCallback = jQuery.isFunction(s.jsonpCallback)
          ? s.jsonpCallback()
          : s.jsonpCallback),
        previous = window[jsonpCallback],
        url = s.url,
        data = s.data,
        replace = '$1' + jsonpCallback + '$2';
      if (s.jsonp !== false) {
        url = url.replace(jsre, replace);
        if (s.url === url) {
          if (inspectData) {
            data = data.replace(jsre, replace);
          }
          if (s.data === data) {
            url += (/\?/.test(url) ? '&' : '?') + s.jsonp + '=' + jsonpCallback;
          }
        }
      }
      s.url = url;
      s.data = data;
      window[jsonpCallback] = function (response) {
        responseContainer = [response];
      };
      jqXHR.always(function () {
        window[jsonpCallback] = previous;
        if (responseContainer && jQuery.isFunction(previous)) {
          window[jsonpCallback](responseContainer[0]);
        }
      });
      s.converters['script json'] = function () {
        if (!responseContainer) {
          jQuery.error(jsonpCallback + ' was not called');
        }
        return responseContainer[0];
      };
      s.dataTypes[0] = 'json';
      return 'script';
    }
  });
  jQuery.ajaxSetup({
    accepts: {
      script:
        'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
    },
    contents: { script: /javascript|ecmascript/ },
    converters: {
      'text script': function (text) {
        jQuery.globalEval(text);
        return text;
      },
    },
  });
  jQuery.ajaxPrefilter('script', function (s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = 'GET';
      s.global = false;
    }
  });
  jQuery.ajaxTransport('script', function (s) {
    if (s.crossDomain) {
      var script,
        head =
          document.head ||
          document.getElementsByTagName('head')[0] ||
          document.documentElement;
      return {
        send: function (_, callback) {
          script = document.createElement('script');
          script.async = 'async';
          if (s.scriptCharset) {
            script.charset = s.scriptCharset;
          }
          script.src = s.url;
          script.onload = script.onreadystatechange = function (_, isAbort) {
            if (
              isAbort ||
              !script.readyState ||
              /loaded|complete/.test(script.readyState)
            ) {
              script.onload = script.onreadystatechange = null;
              if (head && script.parentNode) {
                head.removeChild(script);
              }
              script = undefined;
              if (!isAbort) {
                callback(200, 'success');
              }
            }
          };
          head.insertBefore(script, head.firstChild);
        },
        abort: function () {
          if (script) {
            script.onload(0, 1);
          }
        },
      };
    }
  });
  var xhrOnUnloadAbort = window.ActiveXObject
      ? function () {
          for (var key in xhrCallbacks) {
            xhrCallbacks[key](0, 1);
          }
        }
      : false,
    xhrId = 0,
    xhrCallbacks;
  function createStandardXHR() {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {}
  }
  function createActiveXHR() {
    try {
      return new window.ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
  }
  jQuery.ajaxSettings.xhr = window.ActiveXObject
    ? function () {
        return (!this.isLocal && createStandardXHR()) || createActiveXHR();
      }
    : createStandardXHR;
  (function (xhr) {
    jQuery.extend(jQuery.support, {
      ajax: !!xhr,
      cors: !!xhr && 'withCredentials' in xhr,
    });
  })(jQuery.ajaxSettings.xhr());
  if (jQuery.support.ajax) {
    jQuery.ajaxTransport(function (s) {
      if (!s.crossDomain || jQuery.support.cors) {
        var callback;
        return {
          send: function (headers, complete) {
            var xhr = s.xhr(),
              handle,
              i;
            if (s.username) {
              xhr.open(s.type, s.url, s.async, s.username, s.password);
            } else {
              xhr.open(s.type, s.url, s.async);
            }
            if (s.xhrFields) {
              for (i in s.xhrFields) {
                xhr[i] = s.xhrFields[i];
              }
            }
            if (s.mimeType && xhr.overrideMimeType) {
              xhr.overrideMimeType(s.mimeType);
            }
            if (!s.crossDomain && !headers['X-Requested-With']) {
              headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            try {
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
            } catch (_) {}
            xhr.send((s.hasContent && s.data) || null);
            callback = function (_, isAbort) {
              var status, statusText, responseHeaders, responses, xml;
              try {
                if (callback && (isAbort || xhr.readyState === 4)) {
                  callback = undefined;
                  if (handle) {
                    xhr.onreadystatechange = jQuery.noop;
                    if (xhrOnUnloadAbort) {
                      delete xhrCallbacks[handle];
                    }
                  }
                  if (isAbort) {
                    if (xhr.readyState !== 4) {
                      xhr.abort();
                    }
                  } else {
                    status = xhr.status;
                    responseHeaders = xhr.getAllResponseHeaders();
                    responses = {};
                    xml = xhr.responseXML;
                    if (xml && xml.documentElement) {
                      responses.xml = xml;
                    }
                    responses.text = xhr.responseText;
                    try {
                      statusText = xhr.statusText;
                    } catch (e) {
                      statusText = '';
                    }
                    if (!status && s.isLocal && !s.crossDomain) {
                      status = responses.text ? 200 : 404;
                    } else if (status === 1223) {
                      status = 204;
                    }
                  }
                }
              } catch (firefoxAccessException) {
                if (!isAbort) {
                  complete(-1, firefoxAccessException);
                }
              }
              if (responses) {
                complete(status, statusText, responses, responseHeaders);
              }
            };
            if (!s.async || xhr.readyState === 4) {
              callback();
            } else {
              handle = ++xhrId;
              if (xhrOnUnloadAbort) {
                if (!xhrCallbacks) {
                  xhrCallbacks = {};
                  jQuery(window).unload(xhrOnUnloadAbort);
                }
                xhrCallbacks[handle] = callback;
              }
              xhr.onreadystatechange = callback;
            }
          },
          abort: function () {
            if (callback) {
              callback(0, 1);
            }
          },
        };
      }
    });
  }
  var elemdisplay = {},
    iframe,
    iframeDoc,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
    timerId,
    fxAttrs = [
      ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'],
      ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'],
      ['opacity'],
    ],
    fxNow;
  jQuery.fn.extend({
    show: function (speed, easing, callback) {
      var elem, display;
      if (speed || speed === 0) {
        return this.animate(genFx('show', 3), speed, easing, callback);
      } else {
        for (var i = 0, j = this.length; i < j; i++) {
          elem = this[i];
          if (elem.style) {
            display = elem.style.display;
            if (!jQuery._data(elem, 'olddisplay') && display === 'none') {
              display = elem.style.display = '';
            }
            if (display === '' && jQuery.css(elem, 'display') === 'none') {
              jQuery._data(elem, 'olddisplay', defaultDisplay(elem.nodeName));
            }
          }
        }
        for (i = 0; i < j; i++) {
          elem = this[i];
          if (elem.style) {
            display = elem.style.display;
            if (display === '' || display === 'none') {
              elem.style.display = jQuery._data(elem, 'olddisplay') || '';
            }
          }
        }
        return this;
      }
    },
    hide: function (speed, easing, callback) {
      if (speed || speed === 0) {
        return this.animate(genFx('hide', 3), speed, easing, callback);
      } else {
        var elem,
          display,
          i = 0,
          j = this.length;
        for (; i < j; i++) {
          elem = this[i];
          if (elem.style) {
            display = jQuery.css(elem, 'display');
            if (display !== 'none' && !jQuery._data(elem, 'olddisplay')) {
              jQuery._data(elem, 'olddisplay', display);
            }
          }
        }
        for (i = 0; i < j; i++) {
          if (this[i].style) {
            this[i].style.display = 'none';
          }
        }
        return this;
      }
    },
    _toggle: jQuery.fn.toggle,
    toggle: function (fn, fn2, callback) {
      var bool = typeof fn === 'boolean';
      if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
        this._toggle.apply(this, arguments);
      } else if (fn == null || bool) {
        this.each(function () {
          var state = bool ? fn : jQuery(this).is(':hidden');
          jQuery(this)[state ? 'show' : 'hide']();
        });
      } else {
        this.animate(genFx('toggle', 3), fn, fn2, callback);
      }
      return this;
    },
    fadeTo: function (speed, to, easing, callback) {
      return this.filter(':hidden')
        .css('opacity', 0)
        .show()
        .end()
        .animate({ opacity: to }, speed, easing, callback);
    },
    animate: function (prop, speed, easing, callback) {
      var optall = jQuery.speed(speed, easing, callback);
      if (jQuery.isEmptyObject(prop)) {
        return this.each(optall.complete, [false]);
      }
      prop = jQuery.extend({}, prop);
      function doAnimation() {
        if (optall.queue === false) {
          jQuery._mark(this);
        }
        var opt = jQuery.extend({}, optall),
          isElement = this.nodeType === 1,
          hidden = isElement && jQuery(this).is(':hidden'),
          name,
          val,
          p,
          e,
          parts,
          start,
          end,
          unit,
          method;
        opt.animatedProperties = {};
        for (p in prop) {
          name = jQuery.camelCase(p);
          if (p !== name) {
            prop[name] = prop[p];
            delete prop[p];
          }
          val = prop[name];
          if (jQuery.isArray(val)) {
            opt.animatedProperties[name] = val[1];
            val = prop[name] = val[0];
          } else {
            opt.animatedProperties[name] =
              (opt.specialEasing && opt.specialEasing[name]) ||
              opt.easing ||
              'swing';
          }
          if ((val === 'hide' && hidden) || (val === 'show' && !hidden)) {
            return opt.complete.call(this);
          }
          if (isElement && (name === 'height' || name === 'width')) {
            opt.overflow = [
              this.style.overflow,
              this.style.overflowX,
              this.style.overflowY,
            ];
            if (
              jQuery.css(this, 'display') === 'inline' &&
              jQuery.css(this, 'float') === 'none'
            ) {
              if (
                !jQuery.support.inlineBlockNeedsLayout ||
                defaultDisplay(this.nodeName) === 'inline'
              ) {
                this.style.display = 'inline-block';
              } else {
                this.style.zoom = 1;
              }
            }
          }
        }
        if (opt.overflow != null) {
          this.style.overflow = 'hidden';
        }
        for (p in prop) {
          e = new jQuery.fx(this, opt, p);
          val = prop[p];
          if (rfxtypes.test(val)) {
            method =
              jQuery._data(this, 'toggle' + p) ||
              (val === 'toggle' ? (hidden ? 'show' : 'hide') : 0);
            if (method) {
              jQuery._data(
                this,
                'toggle' + p,
                method === 'show' ? 'hide' : 'show'
              );
              e[method]();
            } else {
              e[val]();
            }
          } else {
            parts = rfxnum.exec(val);
            start = e.cur();
            if (parts) {
              end = parseFloat(parts[2]);
              unit = parts[3] || (jQuery.cssNumber[p] ? '' : 'px');
              if (unit !== 'px') {
                jQuery.style(this, p, (end || 1) + unit);
                start = ((end || 1) / e.cur()) * start;
                jQuery.style(this, p, start + unit);
              }
              if (parts[1]) {
                end = (parts[1] === '-=' ? -1 : 1) * end + start;
              }
              e.custom(start, end, unit);
            } else {
              e.custom(start, val, '');
            }
          }
        }
        return true;
      }
      return optall.queue === false
        ? this.each(doAnimation)
        : this.queue(optall.queue, doAnimation);
    },
    stop: function (type, clearQueue, gotoEnd) {
      if (typeof type !== 'string') {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if (clearQueue && type !== false) {
        this.queue(type || 'fx', []);
      }
      return this.each(function () {
        var index,
          hadTimers = false,
          timers = jQuery.timers,
          data = jQuery._data(this);
        if (!gotoEnd) {
          jQuery._unmark(true, this);
        }
        function stopQueue(elem, data, index) {
          var hooks = data[index];
          jQuery.removeData(elem, index, true);
          hooks.stop(gotoEnd);
        }
        if (type == null) {
          for (index in data) {
            if (
              data[index] &&
              data[index].stop &&
              index.indexOf('.run') === index.length - 4
            ) {
              stopQueue(this, data, index);
            }
          }
        } else if (data[(index = type + '.run')] && data[index].stop) {
          stopQueue(this, data, index);
        }
        for (index = timers.length; index--; ) {
          if (
            timers[index].elem === this &&
            (type == null || timers[index].queue === type)
          ) {
            if (gotoEnd) {
              timers[index](true);
            } else {
              timers[index].saveState();
            }
            hadTimers = true;
            timers.splice(index, 1);
          }
        }
        if (!(gotoEnd && hadTimers)) {
          jQuery.dequeue(this, type);
        }
      });
    },
  });
  function createFxNow() {
    setTimeout(clearFxNow, 0);
    return (fxNow = jQuery.now());
  }
  function clearFxNow() {
    fxNow = undefined;
  }
  function genFx(type, num) {
    var obj = {};
    jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function () {
      obj[this] = type;
    });
    return obj;
  }
  jQuery.each(
    {
      slideDown: genFx('show', 1),
      slideUp: genFx('hide', 1),
      slideToggle: genFx('toggle', 1),
      fadeIn: { opacity: 'show' },
      fadeOut: { opacity: 'hide' },
      fadeToggle: { opacity: 'toggle' },
    },
    function (name, props) {
      jQuery.fn[name] = function (speed, easing, callback) {
        return this.animate(props, speed, easing, callback);
      };
    }
  );
  jQuery.extend({
    speed: function (speed, easing, fn) {
      var opt =
        speed && typeof speed === 'object'
          ? jQuery.extend({}, speed)
          : {
              complete:
                fn || (!fn && easing) || (jQuery.isFunction(speed) && speed),
              duration: speed,
              easing:
                (fn && easing) ||
                (easing && !jQuery.isFunction(easing) && easing),
            };
      opt.duration = jQuery.fx.off
        ? 0
        : typeof opt.duration === 'number'
        ? opt.duration
        : opt.duration in jQuery.fx.speeds
        ? jQuery.fx.speeds[opt.duration]
        : jQuery.fx.speeds._default;
      if (opt.queue == null || opt.queue === true) {
        opt.queue = 'fx';
      }
      opt.old = opt.complete;
      opt.complete = function (noUnmark) {
        if (jQuery.isFunction(opt.old)) {
          opt.old.call(this);
        }
        if (opt.queue) {
          jQuery.dequeue(this, opt.queue);
        } else if (noUnmark !== false) {
          jQuery._unmark(this);
        }
      };
      return opt;
    },
    easing: {
      linear: function (p, n, firstNum, diff) {
        return firstNum + diff * p;
      },
      swing: function (p, n, firstNum, diff) {
        return (-Math.cos(p * Math.PI) / 2 + 0.5) * diff + firstNum;
      },
    },
    timers: [],
    fx: function (elem, options, prop) {
      this.options = options;
      this.elem = elem;
      this.prop = prop;
      options.orig = options.orig || {};
    },
  });
  jQuery.fx.prototype = {
    update: function () {
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
    },
    cur: function () {
      if (
        this.elem[this.prop] != null &&
        (!this.elem.style || this.elem.style[this.prop] == null)
      ) {
        return this.elem[this.prop];
      }
      var parsed,
        r = jQuery.css(this.elem, this.prop);
      return isNaN((parsed = parseFloat(r)))
        ? !r || r === 'auto'
          ? 0
          : r
        : parsed;
    },
    custom: function (from, to, unit) {
      var self = this,
        fx = jQuery.fx;
      this.startTime = fxNow || createFxNow();
      this.end = to;
      this.now = this.start = from;
      this.pos = this.state = 0;
      this.unit =
        unit || this.unit || (jQuery.cssNumber[this.prop] ? '' : 'px');
      function t(gotoEnd) {
        return self.step(gotoEnd);
      }
      t.queue = this.options.queue;
      t.elem = this.elem;
      t.saveState = function () {
        if (
          self.options.hide &&
          jQuery._data(self.elem, 'fxshow' + self.prop) === undefined
        ) {
          jQuery._data(self.elem, 'fxshow' + self.prop, self.start);
        }
      };
      if (t() && jQuery.timers.push(t) && !timerId) {
        timerId = setInterval(fx.tick, fx.interval);
      }
    },
    show: function () {
      var dataShow = jQuery._data(this.elem, 'fxshow' + this.prop);
      this.options.orig[this.prop] =
        dataShow || jQuery.style(this.elem, this.prop);
      this.options.show = true;
      if (dataShow !== undefined) {
        this.custom(this.cur(), dataShow);
      } else {
        this.custom(
          this.prop === 'width' || this.prop === 'height' ? 1 : 0,
          this.cur()
        );
      }
      jQuery(this.elem).show();
    },
    hide: function () {
      this.options.orig[this.prop] =
        jQuery._data(this.elem, 'fxshow' + this.prop) ||
        jQuery.style(this.elem, this.prop);
      this.options.hide = true;
      this.custom(this.cur(), 0);
    },
    step: function (gotoEnd) {
      var p,
        n,
        complete,
        t = fxNow || createFxNow(),
        done = true,
        elem = this.elem,
        options = this.options;
      if (gotoEnd || t >= options.duration + this.startTime) {
        this.now = this.end;
        this.pos = this.state = 1;
        this.update();
        options.animatedProperties[this.prop] = true;
        for (p in options.animatedProperties) {
          if (options.animatedProperties[p] !== true) {
            done = false;
          }
        }
        if (done) {
          if (options.overflow != null && !jQuery.support.shrinkWrapBlocks) {
            jQuery.each(['', 'X', 'Y'], function (index, value) {
              elem.style['overflow' + value] = options.overflow[index];
            });
          }
          if (options.hide) {
            jQuery(elem).hide();
          }
          if (options.hide || options.show) {
            for (p in options.animatedProperties) {
              jQuery.style(elem, p, options.orig[p]);
              jQuery.removeData(elem, 'fxshow' + p, true);
              jQuery.removeData(elem, 'toggle' + p, true);
            }
          }
          complete = options.complete;
          if (complete) {
            options.complete = false;
            complete.call(elem);
          }
        }
        return false;
      } else {
        if (options.duration == Infinity) {
          this.now = t;
        } else {
          n = t - this.startTime;
          this.state = n / options.duration;
          this.pos = jQuery.easing[options.animatedProperties[this.prop]](
            this.state,
            n,
            0,
            1,
            options.duration
          );
          this.now = this.start + (this.end - this.start) * this.pos;
        }
        this.update();
      }
      return true;
    },
  };
  jQuery.extend(jQuery.fx, {
    tick: function () {
      var timer,
        timers = jQuery.timers,
        i = 0;
      for (; i < timers.length; i++) {
        timer = timers[i];
        if (!timer() && timers[i] === timer) {
          timers.splice(i--, 1);
        }
      }
      if (!timers.length) {
        jQuery.fx.stop();
      }
    },
    interval: 13,
    stop: function () {
      clearInterval(timerId);
      timerId = null;
    },
    speeds: { slow: 600, fast: 200, _default: 400 },
    step: {
      opacity: function (fx) {
        jQuery.style(fx.elem, 'opacity', fx.now);
      },
      _default: function (fx) {
        if (fx.elem.style && fx.elem.style[fx.prop] != null) {
          fx.elem.style[fx.prop] = fx.now + fx.unit;
        } else {
          fx.elem[fx.prop] = fx.now;
        }
      },
    },
  });
  jQuery.each(['width', 'height'], function (i, prop) {
    jQuery.fx.step[prop] = function (fx) {
      jQuery.style(fx.elem, prop, Math.max(0, fx.now) + fx.unit);
    };
  });
  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.animated = function (elem) {
      return jQuery.grep(jQuery.timers, function (fn) {
        return elem === fn.elem;
      }).length;
    };
  }
  function defaultDisplay(nodeName) {
    if (!elemdisplay[nodeName]) {
      var body = document.body,
        elem = jQuery('<' + nodeName + '>').appendTo(body),
        display = elem.css('display');
      elem.remove();
      if (display === 'none' || display === '') {
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.frameBorder = iframe.width = iframe.height = 0;
        }
        body.appendChild(iframe);
        if (!iframeDoc || !iframe.createElement) {
          iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
          iframeDoc.write(
            (document.compatMode === 'CSS1Compat' ? '<!doctype html>' : '') +
              '<html><body>'
          );
          iframeDoc.close();
        }
        elem = iframeDoc.createElement(nodeName);
        iframeDoc.body.appendChild(elem);
        display = jQuery.css(elem, 'display');
        body.removeChild(iframe);
      }
      elemdisplay[nodeName] = display;
    }
    return elemdisplay[nodeName];
  }
  var rtable = /^t(?:able|d|h)$/i,
    rroot = /^(?:body|html)$/i;
  if ('getBoundingClientRect' in document.documentElement) {
    jQuery.fn.offset = function (options) {
      var elem = this[0],
        box;
      if (options) {
        return this.each(function (i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }
      if (!elem || !elem.ownerDocument) {
        return null;
      }
      if (elem === elem.ownerDocument.body) {
        return jQuery.offset.bodyOffset(elem);
      }
      try {
        box = elem.getBoundingClientRect();
      } catch (e) {}
      var doc = elem.ownerDocument,
        docElem = doc.documentElement;
      if (!box || !jQuery.contains(docElem, elem)) {
        return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
      }
      var body = doc.body,
        win = getWindow(doc),
        clientTop = docElem.clientTop || body.clientTop || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        scrollTop =
          win.pageYOffset ||
          (jQuery.support.boxModel && docElem.scrollTop) ||
          body.scrollTop,
        scrollLeft =
          win.pageXOffset ||
          (jQuery.support.boxModel && docElem.scrollLeft) ||
          body.scrollLeft,
        top = box.top + scrollTop - clientTop,
        left = box.left + scrollLeft - clientLeft;
      return { top: top, left: left };
    };
  } else {
    jQuery.fn.offset = function (options) {
      var elem = this[0];
      if (options) {
        return this.each(function (i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }
      if (!elem || !elem.ownerDocument) {
        return null;
      }
      if (elem === elem.ownerDocument.body) {
        return jQuery.offset.bodyOffset(elem);
      }
      var computedStyle,
        offsetParent = elem.offsetParent,
        prevOffsetParent = elem,
        doc = elem.ownerDocument,
        docElem = doc.documentElement,
        body = doc.body,
        defaultView = doc.defaultView,
        prevComputedStyle = defaultView
          ? defaultView.getComputedStyle(elem, null)
          : elem.currentStyle,
        top = elem.offsetTop,
        left = elem.offsetLeft;
      while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
        if (
          jQuery.support.fixedPosition &&
          prevComputedStyle.position === 'fixed'
        ) {
          break;
        }
        computedStyle = defaultView
          ? defaultView.getComputedStyle(elem, null)
          : elem.currentStyle;
        top -= elem.scrollTop;
        left -= elem.scrollLeft;
        if (elem === offsetParent) {
          top += elem.offsetTop;
          left += elem.offsetLeft;
          if (
            jQuery.support.doesNotAddBorder &&
            !(
              jQuery.support.doesAddBorderForTableAndCells &&
              rtable.test(elem.nodeName)
            )
          ) {
            top += parseFloat(computedStyle.borderTopWidth) || 0;
            left += parseFloat(computedStyle.borderLeftWidth) || 0;
          }
          prevOffsetParent = offsetParent;
          offsetParent = elem.offsetParent;
        }
        if (
          jQuery.support.subtractsBorderForOverflowNotVisible &&
          computedStyle.overflow !== 'visible'
        ) {
          top += parseFloat(computedStyle.borderTopWidth) || 0;
          left += parseFloat(computedStyle.borderLeftWidth) || 0;
        }
        prevComputedStyle = computedStyle;
      }
      if (
        prevComputedStyle.position === 'relative' ||
        prevComputedStyle.position === 'static'
      ) {
        top += body.offsetTop;
        left += body.offsetLeft;
      }
      if (
        jQuery.support.fixedPosition &&
        prevComputedStyle.position === 'fixed'
      ) {
        top += Math.max(docElem.scrollTop, body.scrollTop);
        left += Math.max(docElem.scrollLeft, body.scrollLeft);
      }
      return { top: top, left: left };
    };
  }
  jQuery.offset = {
    bodyOffset: function (body) {
      var top = body.offsetTop,
        left = body.offsetLeft;
      if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
        top += parseFloat(jQuery.css(body, 'marginTop')) || 0;
        left += parseFloat(jQuery.css(body, 'marginLeft')) || 0;
      }
      return { top: top, left: left };
    },
    setOffset: function (elem, options, i) {
      var position = jQuery.css(elem, 'position');
      if (position === 'static') {
        elem.style.position = 'relative';
      }
      var curElem = jQuery(elem),
        curOffset = curElem.offset(),
        curCSSTop = jQuery.css(elem, 'top'),
        curCSSLeft = jQuery.css(elem, 'left'),
        calculatePosition =
          (position === 'absolute' || position === 'fixed') &&
          jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1,
        props = {},
        curPosition = {},
        curTop,
        curLeft;
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }
      if (options.top != null) {
        props.top = options.top - curOffset.top + curTop;
      }
      if (options.left != null) {
        props.left = options.left - curOffset.left + curLeft;
      }
      if ('using' in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    },
  };
  jQuery.fn.extend({
    position: function () {
      if (!this[0]) {
        return null;
      }
      var elem = this[0],
        offsetParent = this.offsetParent(),
        offset = this.offset(),
        parentOffset = rroot.test(offsetParent[0].nodeName)
          ? { top: 0, left: 0 }
          : offsetParent.offset();
      offset.top -= parseFloat(jQuery.css(elem, 'marginTop')) || 0;
      offset.left -= parseFloat(jQuery.css(elem, 'marginLeft')) || 0;
      parentOffset.top +=
        parseFloat(jQuery.css(offsetParent[0], 'borderTopWidth')) || 0;
      parentOffset.left +=
        parseFloat(jQuery.css(offsetParent[0], 'borderLeftWidth')) || 0;
      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left,
      };
    },
    offsetParent: function () {
      return this.map(function () {
        var offsetParent = this.offsetParent || document.body;
        while (
          offsetParent &&
          !rroot.test(offsetParent.nodeName) &&
          jQuery.css(offsetParent, 'position') === 'static'
        ) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent;
      });
    },
  });
  jQuery.each(['Left', 'Top'], function (i, name) {
    var method = 'scroll' + name;
    jQuery.fn[method] = function (val) {
      var elem, win;
      if (val === undefined) {
        elem = this[0];
        if (!elem) {
          return null;
        }
        win = getWindow(elem);
        return win
          ? 'pageXOffset' in win
            ? win[i ? 'pageYOffset' : 'pageXOffset']
            : (jQuery.support.boxModel &&
                win.document.documentElement[method]) ||
              win.document.body[method]
          : elem[method];
      }
      return this.each(function () {
        win = getWindow(this);
        if (win) {
          win.scrollTo(
            !i ? val : jQuery(win).scrollLeft(),
            i ? val : jQuery(win).scrollTop()
          );
        } else {
          this[method] = val;
        }
      });
    };
  });
  function getWindow(elem) {
    return jQuery.isWindow(elem)
      ? elem
      : elem.nodeType === 9
      ? elem.defaultView || elem.parentWindow
      : false;
  }
  jQuery.each(['Height', 'Width'], function (i, name) {
    var type = name.toLowerCase();
    jQuery.fn['inner' + name] = function () {
      var elem = this[0];
      return elem
        ? elem.style
          ? parseFloat(jQuery.css(elem, type, 'padding'))
          : this[type]()
        : null;
    };
    jQuery.fn['outer' + name] = function (margin) {
      var elem = this[0];
      return elem
        ? elem.style
          ? parseFloat(jQuery.css(elem, type, margin ? 'margin' : 'border'))
          : this[type]()
        : null;
    };
    jQuery.fn[type] = function (size) {
      var elem = this[0];
      if (!elem) {
        return size == null ? null : this;
      }
      if (jQuery.isFunction(size)) {
        return this.each(function (i) {
          var self = jQuery(this);
          self[type](size.call(this, i, self[type]()));
        });
      }
      if (jQuery.isWindow(elem)) {
        var docElemProp = elem.document.documentElement['client' + name],
          body = elem.document.body;
        return (
          (elem.document.compatMode === 'CSS1Compat' && docElemProp) ||
          (body && body['client' + name]) ||
          docElemProp
        );
      } else if (elem.nodeType === 9) {
        return Math.max(
          elem.documentElement['client' + name],
          elem.body['scroll' + name],
          elem.documentElement['scroll' + name],
          elem.body['offset' + name],
          elem.documentElement['offset' + name]
        );
      } else if (size === undefined) {
        var orig = jQuery.css(elem, type),
          ret = parseFloat(orig);
        return jQuery.isNumeric(ret) ? ret : orig;
      } else {
        return this.css(type, typeof size === 'string' ? size : size + 'px');
      }
    };
  });
  window.jQuery = window.$ = jQuery;
  if (typeof define === 'function' && define.amd && define.amd.jQuery) {
    define('jquery', [], function () {
      return jQuery;
    });
  }
})(window);
!(function ($) {
  'use strict';
  var dismiss = '[data-dismiss="alert"]',
    Alert = function (el) {
      $(el).on('click', dismiss, this.close);
    };
  Alert.prototype = {
    constructor: Alert,
    close: function (e) {
      var $this = $(this),
        selector = $this.attr('data-target'),
        $parent;
      if (!selector) {
        selector = $this.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
      }
      $parent = $(selector);
      $parent.trigger('close');
      e && e.preventDefault();
      $parent.length ||
        ($parent = $this.hasClass('alert') ? $this : $this.parent());
      $parent.trigger('close').removeClass('in');
      function removeElement() {
        $parent.trigger('closed').remove();
      }
      $.support.transition && $parent.hasClass('fade')
        ? $parent.on($.support.transition.end, removeElement)
        : removeElement();
    },
  };
  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('alert');
      if (!data) $this.data('alert', (data = new Alert(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  };
  $.fn.alert.Constructor = Alert;
  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close);
  });
})(window.jQuery);
!(function ($) {
  'use strict';
  var Button = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.button.defaults, options);
  };
  Button.prototype = {
    constructor: Button,
    setState: function (state) {
      var d = 'disabled',
        $el = this.$element,
        data = $el.data(),
        val = $el.is('input') ? 'val' : 'html';
      state = state + 'Text';
      data.resetText || $el.data('resetText', $el[val]());
      $el[val](data[state] || this.options[state]);
      setTimeout(function () {
        state == 'loadingText'
          ? $el.addClass(d).attr(d, d)
          : $el.removeClass(d).removeAttr(d);
      }, 0);
    },
    toggle: function () {
      var $parent = this.$element.parent('[data-toggle="buttons-radio"]');
      $parent && $parent.find('.active').removeClass('active');
      this.$element.toggleClass('active');
    },
  };
  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('button'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('button', (data = new Button(this, options)));
      if (option == 'toggle') data.toggle();
      else if (option) data.setState(option);
    });
  };
  $.fn.button.defaults = { loadingText: 'loading...' };
  $.fn.button.Constructor = Button;
  $(function () {
    $('body').on(
      'click.button.data-api',
      '[data-toggle^=button]',
      function (e) {
        var $btn = $(e.target);
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
        $btn.button('toggle');
      }
    );
  });
})(window.jQuery);
!(function ($) {
  'use strict';
  var toggle = '[data-toggle="dropdown"]',
    Dropdown = function (element) {
      var $el = $(element).on('click.dropdown.data-api', this.toggle);
      $('html').on('click.dropdown.data-api', function () {
        $el.parent().removeClass('open');
      });
    };
  Dropdown.prototype = {
    constructor: Dropdown,
    toggle: function (e) {
      var $this = $(this),
        selector = $this.attr('data-target'),
        $parent,
        isActive;
      if (!selector) {
        selector = $this.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
      }
      $parent = $(selector);
      $parent.length || ($parent = $this.parent());
      isActive = $parent.hasClass('open');
      clearMenus();
      !isActive && $parent.toggleClass('open');
      return false;
    },
  };
  function clearMenus() {
    $(toggle).parent().removeClass('open');
  }
  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('dropdown');
      if (!data) $this.data('dropdown', (data = new Dropdown(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  };
  $.fn.dropdown.Constructor = Dropdown;
  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus);
    $('body').on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle);
  });
})(window.jQuery);
!(function ($) {
  'use strict';
  var Modal = function (content, options) {
    this.options = options;
    this.$element = $(content).delegate(
      '[data-dismiss="modal"]',
      'click.dismiss.modal',
      $.proxy(this.hide, this)
    );
  };
  Modal.prototype = {
    constructor: Modal,
    toggle: function () {
      return this[!this.isShown ? 'show' : 'hide']();
    },
    show: function () {
      var that = this;
      if (this.isShown) return;
      $('body').addClass('modal-open');
      this.isShown = true;
      this.$element.trigger('show');
      escape.call(this);
      backdrop.call(this, function () {
        var transition = $.support.transition && that.$element.hasClass('fade');
        !that.$element.parent().length && that.$element.appendTo(document.body);
        that.$element.show();
        if (transition) {
          that.$element[0].offsetWidth;
        }
        that.$element.addClass('in');
        transition
          ? that.$element.one($.support.transition.end, function () {
              that.$element.trigger('shown');
            })
          : that.$element.trigger('shown');
      });
    },
    hide: function (e) {
      e && e.preventDefault();
      if (!this.isShown) return;
      var that = this;
      this.isShown = false;
      $('body').removeClass('modal-open');
      escape.call(this);
      this.$element.trigger('hide').removeClass('in');
      $.support.transition && this.$element.hasClass('fade')
        ? hideWithTransition.call(this)
        : hideModal.call(this);
    },
  };
  function hideWithTransition() {
    var that = this,
      timeout = setTimeout(function () {
        that.$element.off($.support.transition.end);
        hideModal.call(that);
      }, 500);
    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout);
      hideModal.call(that);
    });
  }
  function hideModal(that) {
    this.$element.hide().trigger('hidden');
    backdrop.call(this);
  }
  function backdrop(callback) {
    var that = this,
      animate = this.$element.hasClass('fade') ? 'fade' : '';
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;
      this.$backdrop = $(
        '<div class="modal-backdrop ' + animate + '" />'
      ).appendTo(document.body);
      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this));
      }
      if (doAnimate) this.$backdrop[0].offsetWidth;
      this.$backdrop.addClass('in');
      doAnimate
        ? this.$backdrop.one($.support.transition.end, callback)
        : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');
      $.support.transition && this.$element.hasClass('fade')
        ? this.$backdrop.one(
            $.support.transition.end,
            $.proxy(removeBackdrop, this)
          )
        : removeBackdrop.call(this);
    } else if (callback) {
      callback();
    }
  }
  function removeBackdrop() {
    this.$backdrop.remove();
    this.$backdrop = null;
  }
  function escape() {
    var that = this;
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function (e) {
        e.which == 27 && that.hide();
      });
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal');
    }
  }
  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('modal'),
        options = $.extend(
          {},
          $.fn.modal.defaults,
          $this.data(),
          typeof option == 'object' && option
        );
      if (!data) $this.data('modal', (data = new Modal(this, options)));
      if (typeof option == 'string') data[option]();
      else if (options.show) data.show();
    });
  };
  $.fn.modal.defaults = { backdrop: true, keyboard: true, show: true };
  $.fn.modal.Constructor = Modal;
  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this = $(this),
        href,
        $target = $(
          $this.attr('data-target') ||
            ((href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''))
        ),
        option = $target.data('modal')
          ? 'toggle'
          : $.extend({}, $target.data(), $this.data());
      e.preventDefault();
      $target.modal(option);
    });
  });
})(window.jQuery);
!(function ($) {
  'use strict';
  var Tooltip = function (element, options) {
    this.init('tooltip', element, options);
  };
  Tooltip.prototype = {
    constructor: Tooltip,
    init: function (type, element, options) {
      var eventIn, eventOut;
      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      this.enabled = true;
      if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus';
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur';
        this.$element.on(
          eventIn,
          this.options.selector,
          $.proxy(this.enter, this)
        );
        this.$element.on(
          eventOut,
          this.options.selector,
          $.proxy(this.leave, this)
        );
      }
      this.options.selector
        ? (this._options = $.extend({}, this.options, {
            trigger: 'manual',
            selector: '',
          }))
        : this.fixTitle();
    },
    getOptions: function (options) {
      options = $.extend(
        {},
        $.fn[this.type].defaults,
        options,
        this.$element.data()
      );
      if (options.delay && typeof options.delay == 'number') {
        options.delay = { show: options.delay, hide: options.delay };
      }
      return options;
    },
    enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type);
      if (!self.options.delay || !self.options.delay.show) {
        self.show();
      } else {
        self.hoverState = 'in';
        setTimeout(function () {
          if (self.hoverState == 'in') {
            self.show();
          }
        }, self.options.delay.show);
      }
    },
    leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type);
      if (!self.options.delay || !self.options.delay.hide) {
        self.hide();
      } else {
        self.hoverState = 'out';
        setTimeout(function () {
          if (self.hoverState == 'out') {
            self.hide();
          }
        }, self.options.delay.hide);
      }
    },
    show: function () {
      var $tip, inside, pos, actualWidth, actualHeight, placement, tp;
      if (this.hasContent() && this.enabled) {
        $tip = this.tip();
        this.setContent();
        if (this.options.animation) {
          $tip.addClass('fade');
        }
        placement =
          typeof this.options.placement == 'function'
            ? this.options.placement.call(this, $tip[0], this.$element[0])
            : this.options.placement;
        inside = /in/.test(placement);
        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body);
        pos = this.getPosition(inside);
        actualWidth = $tip[0].offsetWidth;
        actualHeight = $tip[0].offsetHeight;
        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {
              top: pos.top + pos.height,
              left: pos.left + pos.width / 2 - actualWidth / 2,
            };
            break;
          case 'top':
            tp = {
              top: pos.top - actualHeight,
              left: pos.left + pos.width / 2 - actualWidth / 2,
            };
            break;
          case 'left':
            tp = {
              top: pos.top + pos.height / 2 - actualHeight / 2,
              left: pos.left - actualWidth,
            };
            break;
          case 'right':
            tp = {
              top: pos.top + pos.height / 2 - actualHeight / 2,
              left: pos.left + pos.width,
            };
            break;
        }
        $tip.css(tp).addClass(placement).addClass('in');
      }
    },
    setContent: function () {
      var $tip = this.tip();
      $tip.find('.tooltip-inner').html(this.getTitle());
      $tip.removeClass('fade in top bottom left right');
    },
    hide: function () {
      var that = this,
        $tip = this.tip();
      $tip.removeClass('in');
      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove();
        }, 500);
        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout);
          $tip.remove();
        });
      }
      $.support.transition && this.$tip.hasClass('fade')
        ? removeWithAnimation()
        : $tip.remove();
    },
    fixTitle: function () {
      var $e = this.$element;
      if (
        $e.attr('title') ||
        typeof $e.attr('data-original-title') != 'string'
      ) {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr(
          'title'
        );
      }
    },
    hasContent: function () {
      return this.getTitle();
    },
    getPosition: function (inside) {
      return $.extend(
        {},
        inside ? { top: 0, left: 0 } : this.$element.offset(),
        {
          width: this.$element[0].offsetWidth,
          height: this.$element[0].offsetHeight,
        }
      );
    },
    getTitle: function () {
      var title,
        $e = this.$element,
        o = this.options;
      title =
        $e.attr('data-original-title') ||
        (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);
      title = title.toString().replace(/(^\s*|\s*$)/, '');
      return title;
    },
    tip: function () {
      return (this.$tip = this.$tip || $(this.options.template));
    },
    validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide();
        this.$element = null;
        this.options = null;
      }
    },
    enable: function () {
      this.enabled = true;
    },
    disable: function () {
      this.enabled = false;
    },
    toggleEnabled: function () {
      this.enabled = !this.enabled;
    },
    toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']();
    },
  };
  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('tooltip'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };
  $.fn.tooltip.Constructor = Tooltip;
  $.fn.tooltip.defaults = {
    animation: true,
    delay: 0,
    selector: false,
    placement: 'top',
    trigger: 'hover',
    title: '',
    template:
      '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  };
})(window.jQuery);
!(function ($) {
  'use strict';
  var Tab = function (element) {
    this.element = $(element);
  };
  Tab.prototype = {
    constructor: Tab,
    show: function () {
      var $this = this.element,
        $ul = $this.closest('ul:not(.dropdown-menu)'),
        selector = $this.attr('data-target'),
        previous,
        $target;
      if (!selector) {
        selector = $this.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
      }
      if ($this.parent('li').hasClass('active')) return;
      previous = $ul.find('.active a').last()[0];
      $this.trigger({ type: 'show', relatedTarget: previous });
      $target = $(selector);
      this.activate($this.parent('li'), $ul);
      this.activate($target, $target.parent(), function () {
        $this.trigger({ type: 'shown', relatedTarget: previous });
      });
    },
    activate: function (element, container, callback) {
      var $active = container.find('> .active'),
        transition =
          callback && $.support.transition && $active.hasClass('fade');
      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active');
        element.addClass('active');
        if (transition) {
          element[0].offsetWidth;
          element.addClass('in');
        } else {
          element.removeClass('fade');
        }
        if (element.parent('.dropdown-menu')) {
          element.closest('li.dropdown').addClass('active');
        }
        callback && callback();
      }
      transition ? $active.one($.support.transition.end, next) : next();
      $active.removeClass('in');
    },
  };
  $.fn.tab = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('tab');
      if (!data) $this.data('tab', (data = new Tab(this)));
      if (typeof option == 'string') data[option]();
    });
  };
  $.fn.tab.Constructor = Tab;
  $(function () {
    $('body').on(
      'click.tab.data-api',
      '[data-toggle="tab"], [data-toggle="pill"]',
      function (e) {
        e.preventDefault();
        $(this).tab('show');
      }
    );
  });
})(window.jQuery);
!(function ($) {
  $(function () {
    'use strict';
    $.support.transition = (function () {
      var thisBody = document.body || document.documentElement,
        thisStyle = thisBody.style,
        support =
          thisStyle.transition !== undefined ||
          thisStyle.WebkitTransition !== undefined ||
          thisStyle.MozTransition !== undefined ||
          thisStyle.MsTransition !== undefined ||
          thisStyle.OTransition !== undefined;
      return (
        support && {
          end: (function () {
            var transitionEnd = 'TransitionEnd';
            if ($.browser.webkit) {
              transitionEnd = 'webkitTransitionEnd';
            } else if ($.browser.mozilla) {
              transitionEnd = 'transitionend';
            } else if ($.browser.opera) {
              transitionEnd = 'oTransitionEnd';
            }
            return transitionEnd;
          })(),
        }
      );
    })();
  });
})(window.jQuery);
(function ($) {
  $.fn.ajaxSubmit = function (options) {
    if (!this.length) {
      log('ajaxSubmit: skipping submit process - no element selected');
      return this;
    }
    var method,
      action,
      url,
      $form = this;
    if (typeof options == 'function') {
      options = { success: options };
    }
    method = this.attr('method');
    action = this.attr('action');
    url = typeof action === 'string' ? $.trim(action) : '';
    url = url || window.location.href || '';
    if (url) {
      url = (url.match(/^([^#]+)/) || [])[1];
    }
    options = $.extend(
      true,
      {
        url: url,
        success: $.ajaxSettings.success,
        type: method || 'GET',
        iframeSrc: /^https/i.test(window.location.href || '')
          ? 'javascript:false'
          : 'about:blank',
      },
      options
    );
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
      log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
      return this;
    }
    if (
      options.beforeSerialize &&
      options.beforeSerialize(this, options) === false
    ) {
      log('ajaxSubmit: submit aborted via beforeSerialize callback');
      return this;
    }
    var traditional = options.traditional;
    if (traditional === undefined) {
      traditional = $.ajaxSettings.traditional;
    }
    var qx,
      n,
      v,
      a = this.formToArray(options.semantic);
    if (options.data) {
      options.extraData = options.data;
      qx = $.param(options.data, traditional);
    }
    if (
      options.beforeSubmit &&
      options.beforeSubmit(a, this, options) === false
    ) {
      log('ajaxSubmit: submit aborted via beforeSubmit callback');
      return this;
    }
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
      log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
      return this;
    }
    var q = $.param(a, traditional);
    if (qx) {
      q = q ? q + '&' + qx : qx;
    }
    if (options.type.toUpperCase() == 'GET') {
      options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
      options.data = null;
    } else {
      options.data = q;
    }
    var callbacks = [];
    if (options.resetForm) {
      callbacks.push(function () {
        $form.resetForm();
      });
    }
    if (options.clearForm) {
      callbacks.push(function () {
        $form.clearForm(options.includeHidden);
      });
    }
    if (!options.dataType && options.target) {
      var oldSuccess = options.success || function () {};
      callbacks.push(function (data) {
        var fn = options.replaceTarget ? 'replaceWith' : 'html';
        $(options.target)[fn](data).each(oldSuccess, arguments);
      });
    } else if (options.success) {
      callbacks.push(options.success);
    }
    options.success = function (data, status, xhr) {
      var context = options.context || options;
      for (var i = 0, max = callbacks.length; i < max; i++) {
        callbacks[i].apply(context, [data, status, xhr || $form, $form]);
      }
    };
    var fileInputs = $('input:file:enabled[value]', this);
    var hasFileInputs = fileInputs.length > 0;
    var mp = 'multipart/form-data';
    var multipart = $form.attr('enctype') == mp || $form.attr('encoding') == mp;
    var fileAPI = !!(
      hasFileInputs &&
      fileInputs.get(0).files &&
      window.FormData
    );
    log('fileAPI :' + fileAPI);
    var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;
    if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
      if (options.closeKeepAlive) {
        $.get(options.closeKeepAlive, function () {
          fileUploadIframe(a);
        });
      } else {
        fileUploadIframe(a);
      }
    } else if ((hasFileInputs || multipart) && fileAPI) {
      options.progress = options.progress || $.noop;
      fileUploadXhr(a);
    } else {
      $.ajax(options);
    }
    this.trigger('form-submit-notify', [this, options]);
    return this;
    function fileUploadXhr(a) {
      var formdata = new FormData();
      for (var i = 0; i < a.length; i++) {
        if (a[i].type == 'file') continue;
        formdata.append(a[i].name, a[i].value);
      }
      $form.find('input:file:enabled').each(function () {
        var name = $(this).attr('name'),
          files = this.files;
        if (name) {
          for (var i = 0; i < files.length; i++)
            formdata.append(name, files[i]);
        }
      });
      if (options.extraData) {
        for (var k in options.extraData)
          formdata.append(k, options.extraData[k]);
      }
      options.data = null;
      var s = $.extend(true, {}, $.ajaxSettings, options, {
        contentType: false,
        processData: false,
        cache: false,
        type: 'POST',
      });
      s.data = null;
      var beforeSend = s.beforeSend;
      s.beforeSend = function (xhr, o) {
        o.data = formdata;
        if (xhr.upload) {
          xhr.upload.onprogress = function (event) {
            o.progress(event.position, event.total);
          };
        }
        if (beforeSend) beforeSend.call(o, xhr, options);
      };
      $.ajax(s);
    }
    function fileUploadIframe(a) {
      var form = $form[0],
        el,
        i,
        s,
        g,
        id,
        $io,
        io,
        xhr,
        sub,
        n,
        timedOut,
        timeoutHandle;
      var useProp = !!$.fn.prop;
      if (a) {
        if (useProp) {
          for (i = 0; i < a.length; i++) {
            el = $(form[a[i].name]);
            el.prop('disabled', false);
          }
        } else {
          for (i = 0; i < a.length; i++) {
            el = $(form[a[i].name]);
            el.removeAttr('disabled');
          }
        }
      }
      if ($(':input[name=submit],:input[id=submit]', form).length) {
        alert('Error: Form elements must not have name or id of "submit".');
        return;
      }
      s = $.extend(true, {}, $.ajaxSettings, options);
      s.context = s.context || s;
      id = 'jqFormIO' + new Date().getTime();
      if (s.iframeTarget) {
        $io = $(s.iframeTarget);
        n = $io.attr('name');
        if (n == null) $io.attr('name', id);
        else id = n;
      } else {
        $io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />');
        $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
      }
      io = $io[0];
      xhr = {
        aborted: 0,
        responseText: null,
        responseXML: null,
        status: 0,
        statusText: 'n/a',
        getAllResponseHeaders: function () {},
        getResponseHeader: function () {},
        setRequestHeader: function () {},
        abort: function (status) {
          var e = status === 'timeout' ? 'timeout' : 'aborted';
          log('aborting upload... ' + e);
          this.aborted = 1;
          $io.attr('src', s.iframeSrc);
          xhr.error = e;
          s.error && s.error.call(s.context, xhr, e, status);
          g && $.event.trigger('ajaxError', [xhr, s, e]);
          s.complete && s.complete.call(s.context, xhr, e);
        },
      };
      g = s.global;
      if (g && !$.active++) {
        $.event.trigger('ajaxStart');
      }
      if (g) {
        $.event.trigger('ajaxSend', [xhr, s]);
      }
      if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
        if (s.global) {
          $.active--;
        }
        return;
      }
      if (xhr.aborted) {
        return;
      }
      sub = form.clk;
      if (sub) {
        n = sub.name;
        if (n && !sub.disabled) {
          s.extraData = s.extraData || {};
          s.extraData[n] = sub.value;
          if (sub.type == 'image') {
            s.extraData[n + '.x'] = form.clk_x;
            s.extraData[n + '.y'] = form.clk_y;
          }
        }
      }
      var CLIENT_TIMEOUT_ABORT = 1;
      var SERVER_ABORT = 2;
      function getDoc(frame) {
        var doc = frame.contentWindow
          ? frame.contentWindow.document
          : frame.contentDocument
          ? frame.contentDocument
          : frame.document;
        return doc;
      }
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      if (csrf_param && csrf_token) {
        s.extraData = s.extraData || {};
        s.extraData[csrf_param] = csrf_token;
      }
      function doSubmit() {
        var t = $form.attr('target'),
          a = $form.attr('action');
        form.setAttribute('target', id);
        if (!method) {
          form.setAttribute('method', 'POST');
        }
        if (a != s.url) {
          form.setAttribute('action', s.url);
        }
        if (!s.skipEncodingOverride && (!method || /post/i.test(method))) {
          $form.attr({
            encoding: 'multipart/form-data',
            enctype: 'multipart/form-data',
          });
        }
        if (s.timeout) {
          timeoutHandle = setTimeout(function () {
            timedOut = true;
            cb(CLIENT_TIMEOUT_ABORT);
          }, s.timeout);
        }
        function checkState() {
          try {
            var state = getDoc(io).readyState;
            log('state = ' + state);
            if (state.toLowerCase() == 'uninitialized')
              setTimeout(checkState, 50);
          } catch (e) {
            log('Server abort: ', e, ' (', e.name, ')');
            cb(SERVER_ABORT);
            timeoutHandle && clearTimeout(timeoutHandle);
            timeoutHandle = undefined;
          }
        }
        var extraInputs = [];
        try {
          if (s.extraData) {
            for (var n in s.extraData) {
              extraInputs.push(
                $('<input type="hidden" name="' + n + '">')
                  .attr('value', s.extraData[n])
                  .appendTo(form)[0]
              );
            }
          }
          if (!s.iframeTarget) {
            $io.appendTo('body');
            io.attachEvent
              ? io.attachEvent('onload', cb)
              : io.addEventListener('load', cb, false);
          }
          setTimeout(checkState, 15);
          form.submit();
        } finally {
          form.setAttribute('action', a);
          if (t) {
            form.setAttribute('target', t);
          } else {
            $form.removeAttr('target');
          }
          $(extraInputs).remove();
        }
      }
      if (s.forceSync) {
        doSubmit();
      } else {
        setTimeout(doSubmit, 10);
      }
      var data,
        doc,
        domCheckCount = 50,
        callbackProcessed;
      function cb(e) {
        if (xhr.aborted || callbackProcessed) {
          return;
        }
        try {
          doc = getDoc(io);
        } catch (ex) {
          log('cannot access response document: ', ex);
          e = SERVER_ABORT;
        }
        if (e === CLIENT_TIMEOUT_ABORT && xhr) {
          xhr.abort('timeout');
          return;
        } else if (e == SERVER_ABORT && xhr) {
          xhr.abort('server abort');
          return;
        }
        if (!doc || doc.location.href == s.iframeSrc) {
          if (!timedOut) return;
        }
        io.detachEvent
          ? io.detachEvent('onload', cb)
          : io.removeEventListener('load', cb, false);
        var status = 'success',
          errMsg;
        try {
          if (timedOut) {
            throw 'timeout';
          }
          var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
          log('isXml=' + isXml);
          if (
            !isXml &&
            window.opera &&
            (doc.body == null || doc.body.innerHTML == '')
          ) {
            if (--domCheckCount) {
              log('requeing onLoad callback, DOM not available');
              setTimeout(cb, 250);
              return;
            }
          }
          var docRoot = doc.body ? doc.body : doc.documentElement;
          xhr.responseText = docRoot ? docRoot.innerHTML : null;
          xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
          if (isXml) s.dataType = 'xml';
          xhr.getResponseHeader = function (header) {
            var headers = { 'content-type': s.dataType };
            return headers[header];
          };
          if (docRoot) {
            xhr.status = Number(docRoot.getAttribute('status')) || xhr.status;
            xhr.statusText =
              docRoot.getAttribute('statusText') || xhr.statusText;
          }
          var dt = (s.dataType || '').toLowerCase();
          var scr = /(json|script|text)/.test(dt);
          if (scr || s.textarea) {
            var ta = doc.getElementsByTagName('textarea')[0];
            if (ta) {
              xhr.responseText = ta.value;
              xhr.status = Number(ta.getAttribute('status')) || xhr.status;
              xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
            } else if (scr) {
              var pre = doc.getElementsByTagName('pre')[0];
              var b = doc.getElementsByTagName('body')[0];
              if (pre) {
                xhr.responseText = pre.textContent
                  ? pre.textContent
                  : pre.innerText;
              } else if (b) {
                xhr.responseText = b.textContent ? b.textContent : b.innerText;
              }
            }
          } else if (
            dt == 'xml' &&
            !xhr.responseXML &&
            xhr.responseText != null
          ) {
            xhr.responseXML = toXml(xhr.responseText);
          }
          try {
            data = httpData(xhr, dt, s);
          } catch (e) {
            status = 'parsererror';
            xhr.error = errMsg = e || status;
          }
        } catch (e) {
          log('error caught: ', e);
          status = 'error';
          xhr.error = errMsg = e || status;
        }
        if (xhr.aborted) {
          log('upload aborted');
          status = null;
        }
        if (xhr.status) {
          status =
            (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304
              ? 'success'
              : 'error';
        }
        if (status === 'success') {
          s.success && s.success.call(s.context, data, 'success', xhr);
          g && $.event.trigger('ajaxSuccess', [xhr, s]);
        } else if (status) {
          if (errMsg == undefined) errMsg = xhr.statusText;
          s.error && s.error.call(s.context, xhr, status, errMsg);
          g && $.event.trigger('ajaxError', [xhr, s, errMsg]);
        }
        g && $.event.trigger('ajaxComplete', [xhr, s]);
        if (g && !--$.active) {
          $.event.trigger('ajaxStop');
        }
        s.complete && s.complete.call(s.context, xhr, status);
        callbackProcessed = true;
        if (s.timeout) clearTimeout(timeoutHandle);
        setTimeout(function () {
          if (!s.iframeTarget) $io.remove();
          xhr.responseXML = null;
        }, 100);
      }
      var toXml =
        $.parseXML ||
        function (s, doc) {
          if (window.ActiveXObject) {
            doc = new ActiveXObject('Microsoft.XMLDOM');
            doc.async = 'false';
            doc.loadXML(s);
          } else {
            doc = new DOMParser().parseFromString(s, 'text/xml');
          }
          return doc &&
            doc.documentElement &&
            doc.documentElement.nodeName != 'parsererror'
            ? doc
            : null;
        };
      var parseJSON =
        $.parseJSON ||
        function (s) {
          return window['eval']('(' + s + ')');
        };
      var httpData = function (xhr, type, s) {
        var ct = xhr.getResponseHeader('content-type') || '',
          xml = type === 'xml' || (!type && ct.indexOf('xml') >= 0),
          data = xml ? xhr.responseXML : xhr.responseText;
        if (xml && data.documentElement.nodeName === 'parsererror') {
          $.error && $.error('parsererror');
        }
        if (s && s.dataFilter) {
          data = s.dataFilter(data, type);
        }
        if (typeof data === 'string') {
          if (type === 'json' || (!type && ct.indexOf('json') >= 0)) {
            data = parseJSON(data);
          } else if (
            type === 'script' ||
            (!type && ct.indexOf('javascript') >= 0)
          ) {
            $.globalEval(data);
          }
        }
        return data;
      };
    }
  };
  $.fn.ajaxForm = function (options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);
    if (!options.delegation && this.length === 0) {
      var o = { s: this.selector, c: this.context };
      if (!$.isReady && o.s) {
        log('DOM not ready, queuing ajaxForm');
        $(function () {
          $(o.s, o.c).ajaxForm(options);
        });
        return this;
      }
      log(
        'terminating; zero elements found by selector' +
          ($.isReady ? '' : ' (DOM not ready)')
      );
      return this;
    }
    if (options.delegation) {
      $(document)
        .off('submit.form-plugin', this.selector, doAjaxSubmit)
        .off('click.form-plugin', this.selector, captureSubmittingElement)
        .on('submit.form-plugin', this.selector, options, doAjaxSubmit)
        .on(
          'click.form-plugin',
          this.selector,
          options,
          captureSubmittingElement
        );
      return this;
    }
    return this.ajaxFormUnbind()
      .bind('submit.form-plugin', options, doAjaxSubmit)
      .bind('click.form-plugin', options, captureSubmittingElement);
  };
  function doAjaxSubmit(e) {
    var options = e.data;
    if (!e.isDefaultPrevented()) {
      e.preventDefault();
      $(this).ajaxSubmit(options);
    }
  }
  function captureSubmittingElement(e) {
    var target = e.target;
    var $el = $(target);
    if (!$el.is(':submit,input:image')) {
      var t = $el.closest(':submit');
      if (t.length == 0) {
        return;
      }
      target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type == 'image') {
      if (e.offsetX != undefined) {
        form.clk_x = e.offsetX;
        form.clk_y = e.offsetY;
      } else if (typeof $.fn.offset == 'function') {
        var offset = $el.offset();
        form.clk_x = e.pageX - offset.left;
        form.clk_y = e.pageY - offset.top;
      } else {
        form.clk_x = e.pageX - target.offsetLeft;
        form.clk_y = e.pageY - target.offsetTop;
      }
    }
    setTimeout(function () {
      form.clk = form.clk_x = form.clk_y = null;
    }, 100);
  }
  $.fn.ajaxFormUnbind = function () {
    return this.unbind('submit.form-plugin click.form-plugin');
  };
  $.fn.formToArray = function (semantic) {
    var a = [];
    if (this.length === 0) {
      return a;
    }
    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) {
      return a;
    }
    var i, j, n, v, el, max, jmax;
    for (i = 0, max = els.length; i < max; i++) {
      el = els[i];
      n = el.name;
      if (!n) {
        continue;
      }
      if (semantic && form.clk && el.type == 'image') {
        if (!el.disabled && form.clk == el) {
          a.push({ name: n, value: $(el).val(), type: el.type });
          a.push(
            { name: n + '.x', value: form.clk_x },
            { name: n + '.y', value: form.clk_y }
          );
        }
        continue;
      }
      v = $.fieldValue(el, true);
      if (v && v.constructor == Array) {
        for (j = 0, jmax = v.length; j < jmax; j++) {
          a.push({ name: n, value: v[j] });
        }
      } else if (v !== null && typeof v != 'undefined') {
        a.push({ name: n, value: v, type: el.type });
      }
    }
    if (!semantic && form.clk) {
      var $input = $(form.clk),
        input = $input[0];
      n = input.name;
      if (n && !input.disabled && input.type == 'image') {
        a.push({ name: n, value: $input.val() });
        a.push(
          { name: n + '.x', value: form.clk_x },
          { name: n + '.y', value: form.clk_y }
        );
      }
    }
    return a;
  };
  $.fn.formSerialize = function (semantic) {
    return $.param(this.formToArray(semantic));
  };
  $.fn.fieldSerialize = function (successful) {
    var a = [];
    this.each(function () {
      var n = this.name;
      if (!n) {
        return;
      }
      var v = $.fieldValue(this, successful);
      if (v && v.constructor == Array) {
        for (var i = 0, max = v.length; i < max; i++) {
          a.push({ name: n, value: v[i] });
        }
      } else if (v !== null && typeof v != 'undefined') {
        a.push({ name: this.name, value: v });
      }
    });
    return $.param(a);
  };
  $.fn.fieldValue = function (successful) {
    for (var val = [], i = 0, max = this.length; i < max; i++) {
      var el = this[i];
      var v = $.fieldValue(el, successful);
      if (
        v === null ||
        typeof v == 'undefined' ||
        (v.constructor == Array && !v.length)
      ) {
        continue;
      }
      v.constructor == Array ? $.merge(val, v) : val.push(v);
    }
    return val;
  };
  $.fieldValue = function (el, successful) {
    var n = el.name,
      t = el.type,
      tag = el.tagName.toLowerCase();
    if (successful === undefined) {
      successful = true;
    }
    if (
      successful &&
      (!n ||
        el.disabled ||
        t == 'reset' ||
        t == 'button' ||
        ((t == 'checkbox' || t == 'radio') && !el.checked) ||
        ((t == 'submit' || t == 'image') && el.form && el.form.clk != el) ||
        (tag == 'select' && el.selectedIndex == -1))
    ) {
      return null;
    }
    if (tag == 'select') {
      var index = el.selectedIndex;
      if (index < 0) {
        return null;
      }
      var a = [],
        ops = el.options;
      var one = t == 'select-one';
      var max = one ? index + 1 : ops.length;
      for (var i = one ? index : 0; i < max; i++) {
        var op = ops[i];
        if (op.selected) {
          var v = op.value;
          if (!v) {
            v =
              op.attributes &&
              op.attributes['value'] &&
              !op.attributes['value'].specified
                ? op.text
                : op.value;
          }
          if (one) {
            return v;
          }
          a.push(v);
        }
      }
      return a;
    }
    return $(el).val();
  };
  $.fn.clearForm = function (includeHidden) {
    return this.each(function () {
      $('input,select,textarea', this).clearFields(includeHidden);
    });
  };
  $.fn.clearFields = $.fn.clearInputs = function (includeHidden) {
    var re =
      /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
    return this.each(function () {
      var t = this.type,
        tag = this.tagName.toLowerCase();
      if (
        re.test(t) ||
        tag == 'textarea' ||
        (includeHidden && /hidden/.test(t))
      ) {
        this.value = '';
      } else if (t == 'checkbox' || t == 'radio') {
        this.checked = false;
      } else if (tag == 'select') {
        this.selectedIndex = -1;
      }
    });
  };
  $.fn.resetForm = function () {
    return this.each(function () {
      if (
        typeof this.reset == 'function' ||
        (typeof this.reset == 'object' && !this.reset.nodeType)
      ) {
        this.reset();
      }
    });
  };
  $.fn.enable = function (b) {
    if (b === undefined) {
      b = true;
    }
    return this.each(function () {
      this.disabled = !b;
    });
  };
  $.fn.selected = function (select) {
    if (select === undefined) {
      select = true;
    }
    return this.each(function () {
      var t = this.type;
      if (t == 'checkbox' || t == 'radio') {
        this.checked = select;
      } else if (this.tagName.toLowerCase() == 'option') {
        var $sel = $(this).parent('select');
        if (select && $sel[0] && $sel[0].type == 'select-one') {
          $sel.find('option').selected(false);
        }
        this.selected = select;
      }
    });
  };
  $.fn.ajaxSubmit.debug = false;
  function log() {
    if (!$.fn.ajaxSubmit.debug) return;
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
    if (window.console && window.console.log) {
      window.console.log(msg);
    } else if (window.opera && window.opera.postError) {
      window.opera.postError(msg);
    }
  }
})(jQuery);
(function (b) {
  var e,
    d,
    a = [],
    c = window;
  b.fn.tinymce = function (j) {
    var p = this,
      g,
      k,
      h,
      m,
      i,
      l = '',
      n = '';
    if (!p.length) {
      return p;
    }
    if (!j) {
      return tinyMCE.get(p[0].id);
    }
    p.css('visibility', 'hidden');
    function o() {
      var r = [],
        q = 0;
      if (f) {
        f();
        f = null;
      }
      p.each(function (t, u) {
        var s,
          w = u.id,
          v = j.oninit;
        if (!w) {
          u.id = w = tinymce.DOM.uniqueId();
        }
        s = new tinymce.Editor(w, j);
        r.push(s);
        s.onInit.add(function () {
          var x,
            y = v;
          p.css('visibility', '');
          if (v) {
            if (++q == r.length) {
              if (tinymce.is(y, 'string')) {
                x =
                  y.indexOf('.') === -1
                    ? null
                    : tinymce.resolve(y.replace(/\.\w+$/, ''));
                y = tinymce.resolve(y);
              }
              y.apply(x || tinymce, r);
            }
          }
        });
      });
      b.each(r, function (t, s) {
        s.render();
      });
    }
    if (!c.tinymce && !d && (g = j.script_url)) {
      d = 1;
      h = g.substring(0, g.lastIndexOf('/'));
      if (/_(src|dev)\.js/g.test(g)) {
        n = '_src';
      }
      m = g.lastIndexOf('?');
      if (m != -1) {
        l = g.substring(m + 1);
      }
      c.tinyMCEPreInit = c.tinyMCEPreInit || { base: h, suffix: n, query: l };
      if (g.indexOf('gzip') != -1) {
        i = j.language || 'en';
        g =
          g +
          (/\?/.test(g) ? '&' : '?') +
          'js=true&core=true&suffix=' +
          escape(n) +
          '&themes=' +
          escape(j.theme) +
          '&plugins=' +
          escape(j.plugins) +
          '&languages=' +
          i;
        if (!c.tinyMCE_GZ) {
          tinyMCE_GZ = {
            start: function () {
              tinymce.suffix = n;
              function q(r) {
                tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(r));
              }
              q('langs/' + i + '.js');
              q('themes/' + j.theme + '/editor_template' + n + '.js');
              q('themes/' + j.theme + '/langs/' + i + '.js');
              b.each(j.plugins.split(','), function (s, r) {
                if (r) {
                  q('plugins/' + r + '/editor_plugin' + n + '.js');
                  q('plugins/' + r + '/langs/' + i + '.js');
                }
              });
            },
            end: function () {},
          };
        }
      }
      b.ajax({
        type: 'GET',
        url: g,
        dataType: 'script',
        cache: true,
        success: function () {
          tinymce.dom.Event.domLoaded = 1;
          d = 2;
          if (j.script_loaded) {
            j.script_loaded();
          }
          o();
          b.each(a, function (q, r) {
            r();
          });
        },
      });
    } else {
      if (d === 1) {
        a.push(o);
      } else {
        o();
      }
    }
    return p;
  };
  b.extend(b.expr[':'], {
    tinymce: function (g) {
      return !!(g.id && tinyMCE.get(g.id));
    },
  });
  function f() {
    function i(l) {
      if (l === 'remove') {
        this.each(function (n, o) {
          var m = h(o);
          if (m) {
            m.remove();
          }
        });
      }
      this.find('span.mceEditor,div.mceEditor').each(function (n, o) {
        var m = tinyMCE.get(o.id.replace(/_parent$/, ''));
        if (m) {
          m.remove();
        }
      });
    }
    function k(n) {
      var m = this,
        l;
      if (n !== e) {
        i.call(m);
        m.each(function (p, q) {
          var o;
          if ((o = tinyMCE.get(q.id))) {
            o.setContent(n);
          }
        });
      } else {
        if (m.length > 0) {
          if ((l = tinyMCE.get(m[0].id))) {
            return l.getContent();
          }
        }
      }
    }
    function h(m) {
      var l = null;
      m && m.id && c.tinymce && (l = tinyMCE.get(m.id));
      return l;
    }
    function g(l) {
      return !!(l && l.length && c.tinymce && l.is(':tinymce'));
    }
    var j = {};
    b.each(['text', 'html', 'val'], function (n, l) {
      var o = (j[l] = b.fn[l]),
        m = l === 'text';
      b.fn[l] = function (s) {
        var p = this;
        if (!g(p)) {
          return o.apply(p, arguments);
        }
        if (s !== e) {
          k.call(p.filter(':tinymce'), s);
          o.apply(p.not(':tinymce'), arguments);
          return p;
        } else {
          var r = '';
          var q = arguments;
          (m ? p : p.eq(0)).each(function (u, v) {
            var t = h(v);
            r += t
              ? m
                ? t.getContent().replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g, '')
                : t.getContent()
              : o.apply(b(v), q);
          });
          return r;
        }
      };
    });
    b.each(['append', 'prepend'], function (n, m) {
      var o = (j[m] = b.fn[m]),
        l = m === 'prepend';
      b.fn[m] = function (q) {
        var p = this;
        if (!g(p)) {
          return o.apply(p, arguments);
        }
        if (q !== e) {
          p.filter(':tinymce').each(function (s, t) {
            var r = h(t);
            r && r.setContent(l ? q + r.getContent() : r.getContent() + q);
          });
          o.apply(p.not(':tinymce'), arguments);
          return p;
        }
      };
    });
    b.each(['remove', 'replaceWith', 'replaceAll', 'empty'], function (m, l) {
      var n = (j[l] = b.fn[l]);
      b.fn[l] = function () {
        i.call(this, l);
        return n.apply(this, arguments);
      };
    });
    j.attr = b.fn.attr;
    b.fn.attr = function (n, q, o) {
      var m = this;
      if (!n || n !== 'value' || !g(m)) {
        return j.attr.call(m, n, q, o);
      }
      if (q !== e) {
        k.call(m.filter(':tinymce'), q);
        j.attr.call(m.not(':tinymce'), n, q, o);
        return m;
      } else {
        var p = m[0],
          l = h(p);
        return l ? l.getContent() : j.attr.call(b(p), n, q, o);
      }
    };
  }
})(jQuery);
!(function ($) {
  var selector = '[data-datepicker]',
    all = [];
  function clearDatePickers(except) {
    var ii;
    for (ii = 0; ii < all.length; ii++) {
      if (all[ii] != except) {
        all[ii].hide();
      }
    }
  }
  function DatePicker(element, options) {
    this.$el = $(element);
    this.proxy('show')
      .proxy('ahead')
      .proxy('hide')
      .proxy('keyHandler')
      .proxy('selectDate');
    var options = $.extend({}, $.fn.datepicker.defaults, options);
    if (!!options.parse || !!options.format || !this.detectNative()) {
      $.extend(this, options);
      this.$el.data('datepicker', this);
      all.push(this);
      this.init();
    }
  }
  DatePicker.prototype = {
    detectNative: function (el) {
      if (
        navigator.userAgent.match(/(iPod|iPad|iPhone); CPU(\ iPhone)? OS 5_\d/i)
      ) {
        var $marker = $('<span>').insertBefore(this.$el);
        this.$el.detach().attr('type', 'date').insertAfter($marker);
        $marker.remove();
        return true;
      }
      return false;
    },
    init: function () {
      var $months = this.nav('months', 1);
      var $years = this.nav('years', 12);
      var $nav = $('<div>').addClass('nav').append($months, $years);
      this.$month = $('.name', $months);
      this.$year = $('.name', $years);
      $calendar = $('<div>').addClass('calendar');
      for (var i = 0; i < this.shortDayNames.length; i++) {
        $calendar.append(
          '<div class="dow">' +
            this.shortDayNames[(i + this.startOfWeek) % 7] +
            '</div>'
        );
      }
      this.$days = $('<div>').addClass('days');
      $calendar.append(this.$days);
      this.$picker = $('<div>')
        .click(function (e) {
          e.stopPropagation();
        })
        .mousedown(function (e) {
          e.preventDefault();
        })
        .addClass('datepicker')
        .append($nav, $calendar)
        .insertAfter(this.$el);
      this.$el
        .focus(this.show)
        .click(this.show)
        .change(
          $.proxy(function () {
            this.selectDate();
          }, this)
        );
      this.selectDate();
      this.hide();
    },
    nav: function (c, months) {
      var $subnav = $(
        '<div>' +
          '<span class="prev button">&larr;</span>' +
          '<span class="name"></span>' +
          '<span class="next button">&rarr;</span>' +
          '</div>'
      ).addClass(c);
      $('.prev', $subnav).click(
        $.proxy(function () {
          this.ahead(-months, 0);
        }, this)
      );
      $('.next', $subnav).click(
        $.proxy(function () {
          this.ahead(months, 0);
        }, this)
      );
      return $subnav;
    },
    updateName: function ($area, s) {
      var cur = $area.find('.fg').text(),
        $fg = $('<div>').addClass('fg').append(s);
      $area.empty();
      if (cur != s) {
        var $bg = $('<div>').addClass('bg');
        $area.append($bg, $fg);
        $bg.fadeOut('slow', function () {
          $(this).remove();
        });
      } else {
        $area.append($fg);
      }
    },
    selectMonth: function (date) {
      var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      if (
        !this.curMonth ||
        !(
          this.curMonth.getFullYear() == newMonth.getFullYear() &&
          this.curMonth.getMonth() == newMonth.getMonth()
        )
      ) {
        this.curMonth = newMonth;
        var rangeStart = this.rangeStart(date),
          rangeEnd = this.rangeEnd(date);
        var num_days = this.daysBetween(rangeStart, rangeEnd);
        this.$days.empty();
        for (var ii = 0; ii <= num_days; ii++) {
          var thisDay = new Date(
            rangeStart.getFullYear(),
            rangeStart.getMonth(),
            rangeStart.getDate() + ii,
            12,
            00
          );
          var $day = $('<div>').attr('date', this.format(thisDay));
          $day.text(thisDay.getDate());
          if (thisDay.getMonth() != date.getMonth()) {
            $day.addClass('overlap');
          }
          this.$days.append($day);
        }
        this.updateName(this.$month, this.monthNames[date.getMonth()]);
        this.updateName(this.$year, this.curMonth.getFullYear());
        $('div', this.$days).click(
          $.proxy(function (e) {
            var $targ = $(e.target);
            this.update($targ.attr('date'));
            if (!$targ.hasClass('overlap')) {
              this.hide();
            }
          }, this)
        );
        $("[date='" + this.format(new Date()) + "']", this.$days).addClass(
          'today'
        );
      }
      $('.selected', this.$days).removeClass('selected');
      $('[date="' + this.selectedDateStr + '"]', this.$days).addClass(
        'selected'
      );
    },
    selectDate: function (date) {
      if (typeof date == 'undefined') {
        date = this.parse(this.$el.val());
      }
      if (!date) date = new Date();
      this.selectedDate = date;
      this.selectedDateStr = this.format(this.selectedDate);
      this.selectMonth(this.selectedDate);
    },
    update: function (s) {
      this.$el.val(s).change();
    },
    show: function (e) {
      e && e.stopPropagation();
      clearDatePickers(this);
      var offset = this.$el.offset();
      this.$picker
        .css({
          top: offset.top + this.$el.outerHeight() + 2,
          left: offset.left,
        })
        .show();
      $('html').on('keydown', this.keyHandler);
    },
    hide: function () {
      this.$picker.hide();
      $('html').off('keydown', this.keyHandler);
    },
    keyHandler: function (e) {
      switch (e.keyCode) {
        case 9:
        case 27:
          this.hide();
          return;
        case 13:
          this.update(this.selectedDateStr);
          this.hide();
          break;
        case 38:
          this.ahead(0, -7);
          break;
        case 40:
          this.ahead(0, 7);
          break;
        case 37:
          this.ahead(0, -1);
          break;
        case 39:
          this.ahead(0, 1);
          break;
        default:
          return;
      }
      e.preventDefault();
    },
    parse: function (s) {
      var m;
      if ((m = s.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/))) {
        return new Date(m[1], m[2] - 1, m[3]);
      } else {
        return null;
      }
    },
    format: function (date) {
      var month = (date.getMonth() + 1).toString(),
        dom = date.getDate().toString();
      if (month.length === 1) {
        month = '0' + month;
      }
      if (dom.length === 1) {
        dom = '0' + dom;
      }
      return date.getFullYear() + '-' + month + '-' + dom;
    },
    ahead: function (months, days) {
      this.selectDate(
        new Date(
          this.selectedDate.getFullYear(),
          this.selectedDate.getMonth() + months,
          this.selectedDate.getDate() + days
        )
      );
    },
    proxy: function (meth) {
      this[meth] = $.proxy(this[meth], this);
      return this;
    },
    daysBetween: function (start, end) {
      var start = Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      var end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
      return (end - start) / 86400000;
    },
    findClosest: function (dow, date, direction) {
      var difference =
        direction * (Math.abs(date.getDay() - dow - direction * 7) % 7);
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + difference
      );
    },
    rangeStart: function (date) {
      return this.findClosest(
        this.startOfWeek,
        new Date(date.getFullYear(), date.getMonth()),
        -1
      );
    },
    rangeEnd: function (date) {
      return this.findClosest(
        (this.startOfWeek - 1) % 7,
        new Date(date.getFullYear(), date.getMonth() + 1, 0),
        1
      );
    },
  };
  $.fn.datepicker = function (options) {
    return this.each(function () {
      new DatePicker(this, options);
    });
  };
  $(function () {
    $(selector).datepicker();
    $('html').click(clearDatePickers);
  });
  $.fn.datepicker.DatePicker = DatePicker;
  $.fn.datepicker.defaults = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    shortDayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    startOfWeek: 1,
  };
})(window.jQuery || window.ender);
(function ($) {
  var _baseDate = new Date();
  _baseDate.setHours(0);
  _baseDate.setMinutes(0);
  var _ONE_DAY = 86400;
  var _defaults = {
    className: null,
    minTime: null,
    maxTime: null,
    durationTime: null,
    step: 30,
    showDuration: false,
    timeFormat: 'g:ia',
    scrollDefaultNow: false,
    scrollDefaultTime: false,
    onSelect: function () {},
  };
  var methods = {
    init: function (options) {
      return this.each(function () {
        var self = $(this);
        if (self[0].tagName == 'SELECT') {
          var input = $('<input />');
          var attrs = { type: 'text', value: self.val() };
          var raw_attrs = self[0].attributes;
          for (var i = 0; i < raw_attrs.length; i++) {
            attrs[raw_attrs[i].nodeName] = raw_attrs[i].nodeValue;
          }
          input.attr(attrs);
          self.replaceWith(input);
          self = input;
        }
        var settings = $.extend({}, _defaults);
        if (options) {
          settings = $.extend(settings, options);
        }
        if (settings.minTime) {
          settings.minTime = _time2int(settings.minTime);
        }
        if (settings.maxTime) {
          settings.maxTime = _time2int(settings.maxTime);
        }
        if (settings.durationTime) {
          settings.durationTime = _time2int(settings.durationTime);
        }
        self.data('settings', settings);
        self.attr('autocomplete', 'off');
        self.click(methods.show).focus(methods.show).keydown(_keyhandler);
        self.addClass('ui-timepicker-input');
        if (self.val()) {
          var prettyTime = _int2time(
            _time2int(self.val()),
            settings.timeFormat
          );
          self.val(prettyTime);
        }
        var container = $('<span class="ui-timepicker-container" />');
        self.wrap(container);
        $('body')
          .attr('tabindex', -1)
          .focusin(function (e) {
            if ($(e.target).closest('.ui-timepicker-container').length == 0) {
              methods.hide();
            }
          });
      });
    },
    show: function (e) {
      var self = $(this);
      var list = self.siblings('.ui-timepicker-list');
      if (self.hasClass('ui-timepicker-hideme')) {
        self.removeClass('ui-timepicker-hideme');
        list.hide();
        return;
      }
      if (list.is(':visible')) {
        return;
      }
      methods.hide();
      if (list.length == 0) {
        _render(self);
        list = self.siblings('.ui-timepicker-list');
      }
      if (
        self.offset().top + self.outerHeight(true) + list.outerHeight() >
        $(window).height() + $(window).scrollTop()
      ) {
        list.css({ top: self.position().top - list.outerHeight() });
      } else {
        list.css({ top: self.position().top + self.outerHeight() });
      }
      list.show();
      var settings = self.data('settings');
      var selected = list.find('.ui-timepicker-selected');
      if (!selected.length) {
        if (self.val()) {
          selected = _findRow(self, list, _time2int(self.val()));
        } else if (settings.minTime === null && settings.scrollDefaultNow) {
          selected = _findRow(self, list, _time2int(new Date()));
        } else if (settings.scrollDefaultTime !== false) {
          selected = _findRow(
            self,
            list,
            _time2int(settings.scrollDefaultTime)
          );
        }
      }
      if (selected && selected.length) {
        var topOffset =
          list.scrollTop() + selected.position().top - selected.outerHeight();
        list.scrollTop(topOffset);
      } else {
        list.scrollTop(0);
      }
    },
    hide: function (e) {
      $('.ui-timepicker-list:visible').each(function () {
        var list = $(this);
        var self = list.siblings('.ui-timepicker-input');
        _selectValue(self);
        list.hide();
      });
    },
    option: function (key, value) {
      var self = $(this);
      var settings = self.data('settings');
      var list = self.siblings('.ui-timepicker-list');
      if (typeof key == 'object') {
        settings = $.extend(settings, key);
      } else if (typeof key == 'string' && typeof value != 'undefined') {
        settings[key] = value;
      } else if (typeof key == 'string') {
        return settings[key];
      }
      if (settings.minTime) {
        settings.minTime = _time2int(settings.minTime);
      }
      if (settings.maxTime) {
        settings.maxTime = _time2int(settings.maxTime);
      }
      if (settings.durationTime) {
        settings.durationTime = _time2int(settings.durationTime);
      }
      self.data('settings', settings);
      list.remove();
    },
    getSecondsFromMidnight: function () {
      return _time2int($(this).val());
    },
    setTime: function (value) {
      var self = $(this);
      var prettyTime = _int2time(
        _time2int(value),
        self.data('settings').timeFormat
      );
      self.val(prettyTime);
    },
  };
  function _render(self) {
    var settings = self.data('settings');
    var list = self.siblings('.ui-timepicker-list');
    if (list && list.length) {
      list.remove();
    }
    list = $('<ul />');
    list.attr('tabindex', -1);
    list.addClass('ui-timepicker-list');
    if (settings.className) {
      list.addClass(settings.className);
    }
    var zIndex = self.css('zIndex');
    zIndex = zIndex + 0 == zIndex ? zIndex + 2 : 2;
    list.css({
      display: 'none',
      position: 'absolute',
      left: self.position().left,
      zIndex: zIndex,
    });
    if (settings.minTime !== null && settings.showDuration) {
      list.addClass('ui-timepicker-with-duration');
    }
    var durStart =
      settings.durationTime !== null ? settings.durationTime : settings.minTime;
    var start = settings.minTime !== null ? settings.minTime : 0;
    var end =
      settings.maxTime !== null ? settings.maxTime : start + _ONE_DAY - 1;
    if (end <= start) {
      end += _ONE_DAY;
    }
    for (var i = start; i <= end; i += settings.step * 60) {
      var timeInt = i % _ONE_DAY;
      var row = $('<li />');
      row.data('time', timeInt);
      row.text(_int2time(timeInt, settings.timeFormat));
      if (settings.minTime !== null && settings.showDuration) {
        var duration = $('<span />');
        duration.addClass('ui-timepicker-duration');
        duration.text(' (' + _int2duration(i - durStart) + ')');
        row.append(duration);
      }
      list.append(row);
    }
    self.after(list);
    _setSelected(self, list);
    list.delegate('li', 'click', { timepicker: self }, function (e) {
      self.addClass('ui-timepicker-hideme');
      self[0].focus();
      list.find('li').removeClass('ui-timepicker-selected');
      $(this).addClass('ui-timepicker-selected');
      _selectValue(self);
      list.hide();
    });
  }
  function _findRow(self, list, value) {
    if (!value && value !== 0) {
      return false;
    }
    var settings = self.data('settings');
    var out = false;
    list.find('li').each(function (i, obj) {
      var jObj = $(obj);
      if (Math.abs(jObj.data('time') - value) <= settings.step * 30) {
        out = jObj;
        return false;
      }
    });
    return out;
  }
  function _setSelected(self, list) {
    var timeValue = _time2int(self.val());
    var selected = _findRow(self, list, timeValue);
    if (selected && selected.data('time') == timeValue)
      selected.addClass('ui-timepicker-selected');
  }
  function _keyhandler(e) {
    var self = $(this);
    var list = self.siblings('.ui-timepicker-list');
    if (!list.is(':visible')) {
      if (e.keyCode == 40) {
        self.focus();
      } else {
        return true;
      }
    }
    switch (e.keyCode) {
      case 13:
        _selectValue(self);
        methods.hide.apply(this);
        e.preventDefault();
        return false;
        break;
      case 38:
        var selected = list.find('.ui-timepicker-selected');
        if (!selected.length) {
          var selected;
          list.children().each(function (i, obj) {
            if ($(obj).position().top > 0) {
              selected = $(obj);
              return false;
            }
          });
          selected.addClass('ui-timepicker-selected');
        } else if (!selected.is(':first-child')) {
          selected.removeClass('ui-timepicker-selected');
          selected.prev().addClass('ui-timepicker-selected');
          if (selected.prev().position().top < selected.outerHeight()) {
            list.scrollTop(list.scrollTop() - selected.outerHeight());
          }
        }
        break;
      case 40:
        var selected = list.find('.ui-timepicker-selected');
        if (selected.length == 0) {
          var selected;
          list.children().each(function (i, obj) {
            if ($(obj).position().top > 0) {
              selected = $(obj);
              return false;
            }
          });
          selected.addClass('ui-timepicker-selected');
        } else if (!selected.is(':last-child')) {
          selected.removeClass('ui-timepicker-selected');
          selected.next().addClass('ui-timepicker-selected');
          if (
            selected.next().position().top + 2 * selected.outerHeight() >
            list.outerHeight()
          ) {
            list.scrollTop(list.scrollTop() + selected.outerHeight());
          }
        }
        break;
      case 27:
        list.find('li').removeClass('ui-timepicker-selected');
        list.hide();
        break;
      case 9:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
      case 39:
      case 45:
        return;
      default:
        list.find('li').removeClass('ui-timepicker-selected');
        return;
    }
  }
  function _selectValue(self) {
    var settings = self.data('settings');
    var list = self.siblings('.ui-timepicker-list');
    var timeValue = null;
    var cursor = list.find('.ui-timepicker-selected');
    if (cursor.length) {
      var timeValue = cursor.data('time');
    } else if (self.val()) {
      var timeValue = _time2int(self.val());
      _setSelected(self, list);
    }
    if (timeValue !== null) {
      var timeString = _int2time(timeValue, settings.timeFormat);
      self.attr('value', timeString);
    }
    settings.onSelect.call(self);
    self.trigger('change');
  }
  function _int2duration(seconds) {
    var minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return minutes + ' mins';
    } else if (minutes == 60) {
      return '1 hr';
    } else {
      var hours = minutes / 60;
      return hours.toFixed(1) + ' hrs';
    }
  }
  function _int2time(seconds, format) {
    var time = new Date(_baseDate.valueOf() + seconds * 1000);
    var output = '';
    for (var i = 0; i < format.length; i++) {
      var code = format.charAt(i);
      switch (code) {
        case 'a':
          output += time.getHours() > 11 ? ' pm' : ' am';
          break;
        case 'A':
          output += time.getHours() > 11 ? ' PM' : ' AM';
          break;
        case 'g':
          var hour = time.getHours() % 12;
          output += hour == 0 ? '12' : hour;
          break;
        case 'G':
          output += time.getHours();
          break;
        case 'h':
          var hour = time.getHours() % 12;
          if (hour != 0 && hour < 10) {
            hour = '0' + hour;
          }
          output += hour == 0 ? '12' : hour;
          break;
        case 'H':
          var hour = time.getHours();
          output += hour > 9 ? hour : '0' + hour;
          break;
        case 'i':
          var minutes = time.getMinutes();
          output += minutes > 9 ? minutes : '0' + minutes;
          break;
        case 's':
          var seconds = time.getSeconds();
          output += seconds > 9 ? seconds : '0' + seconds;
          break;
        default:
          output += code;
      }
    }
    return output;
  }
  function _time2int(timeString) {
    if (timeString == '') return null;
    if (timeString + 0 == timeString) return timeString;
    if (typeof timeString == 'object') {
      timeString = timeString.getHours() + ':' + timeString.getMinutes();
    }
    var d = new Date(0);
    var time = timeString.toLowerCase().match(/(\d+)(?::(\d\d))?\s*([pa]?)/);
    if (!time) {
      return null;
    }
    var hour = parseInt(time[1] * 1);
    if (time[3]) {
      if (hour == 12) {
        var hours = time[3] == 'p' ? 12 : 0;
      } else {
        var hours = hour + (time[3] == 'p' ? 12 : 0);
      }
    } else {
      var hours = hour;
    }
    var minutes = time[2] * 1 || 0;
    return hours * 3600 + minutes * 60;
  }
  $.fn.timepicker = function (method) {
    if (methods[method]) {
      return methods[method].apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.timepicker');
    }
  };
})(jQuery);
$('input[type="time"]').timepicker({ scrollDefaultNow: true });
(function () {
  var SelectParser;
  SelectParser = (function () {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }
    SelectParser.prototype.add_node = function (child) {
      if (child.nodeName === 'OPTGROUP') {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };
    SelectParser.prototype.add_group = function (group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled,
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };
    SelectParser.prototype.add_option = function (
      option,
      group_position,
      group_disabled
    ) {
      if (option.nodeName === 'OPTION') {
        if (option.text !== '') {
          if (group_position != null) this.parsed[group_position].children += 1;
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled:
              group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText,
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true,
          });
        }
        return (this.options_index += 1);
      }
    };
    return SelectParser;
  })();
  SelectParser.select_to_array = function (select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };
  this.SelectParser = SelectParser;
}).call(this);
(function () {
  var AbstractChosen, root;
  root = this;
  AbstractChosen = (function () {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      this.set_default_values();
      this.is_multiple = this.form_field.multiple;
      this.default_text_default = this.is_multiple
        ? 'Select Some Options'
        : 'Select an Option';
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.finish_setup();
    }
    AbstractChosen.prototype.set_default_values = function () {
      var _this = this;
      this.click_test_action = function (evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function (evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect =
        this.options.allow_single_deselect != null &&
        this.form_field.options[0] != null &&
        this.form_field.options[0].text === ''
          ? this.options.allow_single_deselect
          : false;
      this.disable_search_threshold =
        this.options.disable_search_threshold || 0;
      this.choices = 0;
      return (this.results_none_found =
        this.options.no_results_text || 'No results match');
    };
    AbstractChosen.prototype.mouse_enter = function () {
      return (this.mouse_on_container = true);
    };
    AbstractChosen.prototype.mouse_leave = function () {
      return (this.mouse_on_container = false);
    };
    AbstractChosen.prototype.input_focus = function (evt) {
      var _this = this;
      if (!this.active_field) {
        return setTimeout(function () {
          return _this.container_mousedown();
        }, 50);
      }
    };
    AbstractChosen.prototype.input_blur = function (evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(function () {
          return _this.blur_test();
        }, 100);
      }
    };
    AbstractChosen.prototype.result_add_option = function (option) {
      var classes, style;
      if (!option.disabled) {
        option.dom_id = this.container_id + '_o_' + option.array_index;
        classes = option.selected && this.is_multiple ? [] : ['active-result'];
        if (option.selected) classes.push('result-selected');
        if (option.group_array_index != null) classes.push('group-option');
        if (option.classes !== '') classes.push(option.classes);
        style =
          option.style.cssText !== '' ? ' style="' + option.style + '"' : '';
        return (
          '<li id="' +
          option.dom_id +
          '" class="' +
          classes.join(' ') +
          '"' +
          style +
          '>' +
          option.html +
          '</li>'
        );
      } else {
        return '';
      }
    };
    AbstractChosen.prototype.results_update_field = function () {
      this.result_clear_highlight();
      this.result_single_selected = null;
      return this.results_build();
    };
    AbstractChosen.prototype.results_toggle = function () {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.results_search = function (evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.keyup_checker = function (evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (
            this.is_multiple &&
            this.backstroke_length < 1 &&
            this.choices > 0
          ) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) return this.result_select(evt);
          break;
        case 27:
          if (this.results_showing) this.results_hide();
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };
    AbstractChosen.prototype.generate_field_id = function () {
      var new_id;
      new_id = this.generate_random_id();
      this.form_field.id = new_id;
      return new_id;
    };
    AbstractChosen.prototype.generate_random_char = function () {
      var chars, newchar, rand;
      chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
      rand = Math.floor(Math.random() * chars.length);
      return (newchar = chars.substring(rand, rand + 1));
    };
    return AbstractChosen;
  })();
  root.AbstractChosen = AbstractChosen;
}).call(this);
(function () {
  var $,
    Chosen,
    get_side_border_padding,
    root,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function (child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };
  root = this;
  $ = jQuery;
  $.fn.extend({
    chosen: function (options) {
      if (
        $.browser.msie &&
        ($.browser.version === '6.0' || $.browser.version === '7.0')
      ) {
        return this;
      }
      return $(this).each(function (input_field) {
        if (!$(this).hasClass('chzn-done')) return new Chosen(this, options);
      });
    },
  });
  Chosen = (function (_super) {
    __extends(Chosen, _super);
    function Chosen() {
      Chosen.__super__.constructor.apply(this, arguments);
    }
    Chosen.prototype.setup = function () {
      this.form_field_jq = $(this.form_field);
      return (this.is_rtl = this.form_field_jq.hasClass('chzn-rtl'));
    };
    Chosen.prototype.finish_setup = function () {
      return this.form_field_jq.addClass('chzn-done');
    };
    Chosen.prototype.set_up_html = function () {
      var container_div, dd_top, dd_width, sf_width;
      this.container_id = this.form_field.id.length
        ? this.form_field.id.replace(/(:|\.)/g, '_')
        : this.generate_field_id();
      this.container_id += '_chzn';
      this.f_width = this.form_field_jq.outerWidth();
      this.default_text = this.form_field_jq.data('placeholder')
        ? this.form_field_jq.data('placeholder')
        : this.default_text_default;
      container_div = $('<div />', {
        id: this.container_id,
        class: 'chzn-container' + (this.is_rtl ? ' chzn-rtl' : ''),
        style: 'width: ' + this.f_width + 'px;',
      });
      if (this.is_multiple) {
        container_div.html(
          '<ul class="chzn-choices"><li class="search-field"><input type="text" value="' +
            this.default_text +
            '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>'
        );
      } else {
        container_div.html(
          '<a href="javascript:void(0)" class="chzn-single"><span>' +
            this.default_text +
            '</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>'
        );
      }
      this.form_field_jq.hide().after(container_div);
      this.container = $('#' + this.container_id);
      this.container.addClass(
        'chzn-container-' + (this.is_multiple ? 'multi' : 'single')
      );
      this.dropdown = this.container.find('div.chzn-drop').first();
      dd_top = this.container.height();
      dd_width = this.f_width - get_side_border_padding(this.dropdown);
      this.dropdown.css({ width: dd_width + 'px', top: dd_top + 'px' });
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chzn-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chzn-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chzn-search').first();
        this.selected_item = this.container.find('.chzn-single').first();
        sf_width =
          dd_width -
          get_side_border_padding(this.search_container) -
          get_side_border_padding(this.search_field);
        this.search_field.css({ width: sf_width + 'px' });
      }
      this.results_build();
      this.set_tab_index();
      return this.form_field_jq.trigger('liszt:ready', { chosen: this });
    };
    Chosen.prototype.register_observers = function () {
      var _this = this;
      this.container.mousedown(function (evt) {
        return _this.container_mousedown(evt);
      });
      this.container.mouseup(function (evt) {
        return _this.container_mouseup(evt);
      });
      this.container.mouseenter(function (evt) {
        return _this.mouse_enter(evt);
      });
      this.container.mouseleave(function (evt) {
        return _this.mouse_leave(evt);
      });
      this.search_results.mouseup(function (evt) {
        return _this.search_results_mouseup(evt);
      });
      this.search_results.mouseover(function (evt) {
        return _this.search_results_mouseover(evt);
      });
      this.search_results.mouseout(function (evt) {
        return _this.search_results_mouseout(evt);
      });
      this.form_field_jq.bind('liszt:updated', function (evt) {
        return _this.results_update_field(evt);
      });
      this.search_field.blur(function (evt) {
        return _this.input_blur(evt);
      });
      this.search_field.keyup(function (evt) {
        return _this.keyup_checker(evt);
      });
      this.search_field.keydown(function (evt) {
        return _this.keydown_checker(evt);
      });
      if (this.is_multiple) {
        this.search_choices.click(function (evt) {
          return _this.choices_click(evt);
        });
        return this.search_field.focus(function (evt) {
          return _this.input_focus(evt);
        });
      } else {
        return this.container.click(function (evt) {
          return evt.preventDefault();
        });
      }
    };
    Chosen.prototype.search_field_disabled = function () {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chzn-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind('focus', this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chzn-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind('focus', this.activate_action);
        }
      }
    };
    Chosen.prototype.container_mousedown = function (evt) {
      var target_closelink;
      if (!this.is_disabled) {
        target_closelink =
          evt != null ? $(evt.target).hasClass('search-choice-close') : false;
        if (evt && evt.type === 'mousedown') evt.stopPropagation();
        if (!this.pending_destroy_click && !target_closelink) {
          if (!this.active_field) {
            if (this.is_multiple) this.search_field.val('');
            $(document).click(this.click_test_action);
            this.results_show();
          } else if (
            !this.is_multiple &&
            evt &&
            ($(evt.target)[0] === this.selected_item[0] ||
              $(evt.target).parents('a.chzn-single').length)
          ) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        } else {
          return (this.pending_destroy_click = false);
        }
      }
    };
    Chosen.prototype.container_mouseup = function (evt) {
      if (evt.target.nodeName === 'ABBR') return this.results_reset(evt);
    };
    Chosen.prototype.blur_test = function (evt) {
      if (
        !this.active_field &&
        this.container.hasClass('chzn-container-active')
      ) {
        return this.close_field();
      }
    };
    Chosen.prototype.close_field = function () {
      $(document).unbind('click', this.click_test_action);
      if (!this.is_multiple) {
        this.selected_item.attr('tabindex', this.search_field.attr('tabindex'));
        this.search_field.attr('tabindex', -1);
      }
      this.active_field = false;
      this.results_hide();
      this.container.removeClass('chzn-container-active');
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };
    Chosen.prototype.activate_field = function () {
      if (!this.is_multiple && !this.active_field) {
        this.search_field.attr('tabindex', this.selected_item.attr('tabindex'));
        this.selected_item.attr('tabindex', -1);
      }
      this.container.addClass('chzn-container-active');
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };
    Chosen.prototype.test_active_click = function (evt) {
      if ($(evt.target).parents('#' + this.container_id).length) {
        return (this.active_field = true);
      } else {
        return this.close_field();
      }
    };
    Chosen.prototype.results_build = function () {
      var content, data, _i, _len, _ref;
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.find('li.search-choice').remove();
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.find('span').text(this.default_text);
        if (this.form_field.options.length <= this.disable_search_threshold) {
          this.container.addClass('chzn-container-single-nosearch');
        } else {
          this.container.removeClass('chzn-container-single-nosearch');
        }
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.find('span').text(data.text);
            if (this.allow_single_deselect)
              this.single_deselect_control_build();
          }
        }
      }
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.html(content);
      return (this.parsing = false);
    };
    Chosen.prototype.result_add_group = function (group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + '_g_' + group.array_index;
        return (
          '<li id="' +
          group.dom_id +
          '" class="group-result">' +
          $('<div />').text(group.label).html() +
          '</li>'
        );
      } else {
        return '';
      }
    };
    Chosen.prototype.result_do_highlight = function (el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass('highlighted');
        maxHeight = parseInt(this.search_results.css('maxHeight'), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top =
          this.result_highlight.position().top +
          this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop(
            high_bottom - maxHeight > 0 ? high_bottom - maxHeight : 0
          );
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };
    Chosen.prototype.result_clear_highlight = function () {
      if (this.result_highlight)
        this.result_highlight.removeClass('highlighted');
      return (this.result_highlight = null);
    };
    Chosen.prototype.results_show = function () {
      var dd_top;
      if (!this.is_multiple) {
        this.selected_item.addClass('chzn-single-with-drop');
        if (this.result_single_selected) {
          this.result_do_highlight(this.result_single_selected);
        }
      }
      dd_top = this.is_multiple
        ? this.container.height()
        : this.container.height() - 1;
      this.dropdown.css({ top: dd_top + 'px', left: 0 });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };
    Chosen.prototype.results_hide = function () {
      if (!this.is_multiple) {
        this.selected_item.removeClass('chzn-single-with-drop');
      }
      this.result_clear_highlight();
      this.dropdown.css({ left: '-9000px' });
      return (this.results_showing = false);
    };
    Chosen.prototype.set_tab_index = function (el) {
      var ti;
      if (this.form_field_jq.attr('tabindex')) {
        ti = this.form_field_jq.attr('tabindex');
        this.form_field_jq.attr('tabindex', -1);
        if (this.is_multiple) {
          return this.search_field.attr('tabindex', ti);
        } else {
          this.selected_item.attr('tabindex', ti);
          return this.search_field.attr('tabindex', -1);
        }
      }
    };
    Chosen.prototype.show_search_field_default = function () {
      if (this.is_multiple && this.choices < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass('default');
      } else {
        this.search_field.val('');
        return this.search_field.removeClass('default');
      }
    };
    Chosen.prototype.search_results_mouseup = function (evt) {
      var target;
      target = $(evt.target).hasClass('active-result')
        ? $(evt.target)
        : $(evt.target).parents('.active-result').first();
      if (target.length) {
        this.result_highlight = target;
        return this.result_select(evt);
      }
    };
    Chosen.prototype.search_results_mouseover = function (evt) {
      var target;
      target = $(evt.target).hasClass('active-result')
        ? $(evt.target)
        : $(evt.target).parents('.active-result').first();
      if (target) return this.result_do_highlight(target);
    };
    Chosen.prototype.search_results_mouseout = function (evt) {
      if (
        $(evt.target).hasClass(
          'active-result' || $(evt.target).parents('.active-result').first()
        )
      ) {
        return this.result_clear_highlight();
      }
    };
    Chosen.prototype.choices_click = function (evt) {
      evt.preventDefault();
      if (
        this.active_field &&
        !$(evt.target).hasClass(
          'search-choice' || $(evt.target).parents('.search-choice').first
        ) &&
        !this.results_showing
      ) {
        return this.results_show();
      }
    };
    Chosen.prototype.choice_build = function (item) {
      var choice_id,
        link,
        _this = this;
      choice_id = this.container_id + '_c_' + item.array_index;
      this.choices += 1;
      this.search_container.before(
        '<li class="search-choice" id="' +
          choice_id +
          '"><span>' +
          item.html +
          '</span><a href="javascript:void(0)" class="search-choice-close" rel="' +
          item.array_index +
          '"></a></li>'
      );
      link = $('#' + choice_id)
        .find('a')
        .first();
      return link.click(function (evt) {
        return _this.choice_destroy_link_click(evt);
      });
    };
    Chosen.prototype.choice_destroy_link_click = function (evt) {
      evt.preventDefault();
      if (!this.is_disabled) {
        this.pending_destroy_click = true;
        return this.choice_destroy($(evt.target));
      } else {
        return evt.stopPropagation;
      }
    };
    Chosen.prototype.choice_destroy = function (link) {
      this.choices -= 1;
      this.show_search_field_default();
      if (
        this.is_multiple &&
        this.choices > 0 &&
        this.search_field.val().length < 1
      ) {
        this.results_hide();
      }
      this.result_deselect(link.attr('rel'));
      return link.parents('li').first().remove();
    };
    Chosen.prototype.results_reset = function (evt) {
      this.form_field.options[0].selected = true;
      this.selected_item.find('span').text(this.default_text);
      this.show_search_field_default();
      $(evt.target).remove();
      this.form_field_jq.trigger('change');
      if (this.active_field) return this.results_hide();
    };
    Chosen.prototype.result_select = function (evt) {
      var high, high_id, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        high_id = high.attr('id');
        this.result_clear_highlight();
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.search_results
            .find('.result-selected')
            .removeClass('result-selected');
          this.result_single_selected = high;
        }
        high.addClass('result-selected');
        position = high_id.substr(high_id.lastIndexOf('_') + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.find('span').first().text(item.text);
          if (this.allow_single_deselect) this.single_deselect_control_build();
        }
        if (!(evt.metaKey && this.is_multiple)) this.results_hide();
        this.search_field.val('');
        this.form_field_jq.trigger('change');
        return this.search_field_scale();
      }
    };
    Chosen.prototype.result_activate = function (el) {
      return el.addClass('active-result');
    };
    Chosen.prototype.result_deactivate = function (el) {
      return el.removeClass('active-result');
    };
    Chosen.prototype.result_deselect = function (pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      result_data.selected = false;
      this.form_field.options[result_data.options_index].selected = false;
      result = $('#' + this.container_id + '_o_' + pos);
      result.removeClass('result-selected').addClass('active-result').show();
      this.result_clear_highlight();
      this.winnow_results();
      this.form_field_jq.trigger('change');
      return this.search_field_scale();
    };
    Chosen.prototype.single_deselect_control_build = function () {
      if (
        this.allow_single_deselect &&
        this.selected_item.find('abbr').length < 1
      ) {
        return this.selected_item
          .find('span')
          .first()
          .after('<abbr class="search-choice-close"></abbr>');
      }
    };
    Chosen.prototype.winnow_results = function () {
      var found,
        option,
        part,
        parts,
        regex,
        result,
        result_id,
        results,
        searchText,
        startpos,
        text,
        zregex,
        _i,
        _j,
        _len,
        _len2,
        _ref;
      this.no_results_clear();
      results = 0;
      searchText =
        this.search_field.val() === this.default_text
          ? ''
          : $('<div/>').text($.trim(this.search_field.val())).html();
      regex = new RegExp(
        '^' + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        'i'
      );
      zregex = new RegExp(
        searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        'i'
      );
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $('#' + option.dom_id).css('display', 'none');
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            result = $('#' + result_id);
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (
              option.html.indexOf(' ') >= 0 ||
              option.html.indexOf('[') === 0
            ) {
              parts = option.html.replace(/\[|\]/g, '').split(' ');
              if (parts.length) {
                for (_j = 0, _len2 = parts.length; _j < _len2; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text =
                  option.html.substr(0, startpos + searchText.length) +
                  '</em>' +
                  option.html.substr(startpos + searchText.length);
                text =
                  text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              result.html(text);
              this.result_activate(result);
              if (option.group_array_index != null) {
                $('#' + this.results_data[option.group_array_index].dom_id).css(
                  'display',
                  'list-item'
                );
              }
            } else {
              if (
                this.result_highlight &&
                result_id === this.result_highlight.attr('id')
              ) {
                this.result_clear_highlight();
              }
              this.result_deactivate(result);
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };
    Chosen.prototype.winnow_results_clear = function () {
      var li, lis, _i, _len, _results;
      this.search_field.val('');
      lis = this.search_results.find('li');
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        li = $(li);
        if (li.hasClass('group-result')) {
          _results.push(li.css('display', 'auto'));
        } else if (!this.is_multiple || !li.hasClass('result-selected')) {
          _results.push(this.result_activate(li));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    Chosen.prototype.winnow_results_set_highlight = function () {
      var do_high, selected_results;
      if (!this.result_highlight) {
        selected_results = !this.is_multiple
          ? this.search_results.find('.result-selected.active-result')
          : [];
        do_high = selected_results.length
          ? selected_results.first()
          : this.search_results.find('.active-result').first();
        if (do_high != null) return this.result_do_highlight(do_high);
      }
    };
    Chosen.prototype.no_results = function (terms) {
      var no_results_html;
      no_results_html = $(
        '<li class="no-results">' +
          this.results_none_found +
          ' "<span></span>"</li>'
      );
      no_results_html.find('span').first().html(terms);
      return this.search_results.append(no_results_html);
    };
    Chosen.prototype.no_results_clear = function () {
      return this.search_results.find('.no-results').remove();
    };
    Chosen.prototype.keydown_arrow = function () {
      var first_active, next_sib;
      if (!this.result_highlight) {
        first_active = this.search_results.find('li.active-result').first();
        if (first_active) this.result_do_highlight($(first_active));
      } else if (this.results_showing) {
        next_sib = this.result_highlight.nextAll('li.active-result').first();
        if (next_sib) this.result_do_highlight(next_sib);
      }
      if (!this.results_showing) return this.results_show();
    };
    Chosen.prototype.keyup_arrow = function () {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll('li.active-result');
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices > 0) this.results_hide();
          return this.result_clear_highlight();
        }
      }
    };
    Chosen.prototype.keydown_backstroke = function () {
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find('a').first());
        return this.clear_backstroke();
      } else {
        this.pending_backstroke = this.search_container
          .siblings('li.search-choice')
          .last();
        return this.pending_backstroke.addClass('search-choice-focus');
      }
    };
    Chosen.prototype.clear_backstroke = function () {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass('search-choice-focus');
      }
      return (this.pending_backstroke = null);
    };
    Chosen.prototype.keydown_checker = function (evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) this.clear_backstroke();
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple)
            this.result_select(evt);
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          this.keydown_arrow();
          break;
      }
    };
    Chosen.prototype.search_field_scale = function () {
      var dd_top, div, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block =
          'position:absolute; left: -1000px; top: -1000px; display:none;';
        styles = [
          'font-size',
          'font-style',
          'font-weight',
          'font-family',
          'line-height',
          'text-transform',
          'letter-spacing',
        ];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ':' + this.search_field.css(style) + ';';
        }
        div = $('<div />', { style: style_block });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        if (w > this.f_width - 10) w = this.f_width - 10;
        this.search_field.css({ width: w + 'px' });
        dd_top = this.container.height();
        return this.dropdown.css({ top: dd_top + 'px' });
      }
    };
    Chosen.prototype.generate_random_id = function () {
      var string;
      string =
        'sel' +
        this.generate_random_char() +
        this.generate_random_char() +
        this.generate_random_char();
      while ($('#' + string).length > 0) {
        string += this.generate_random_char();
      }
      return string;
    };
    return Chosen;
  })(AbstractChosen);
  get_side_border_padding = function (elmt) {
    var side_border_padding;
    return (side_border_padding = elmt.outerWidth() - elmt.width());
  };
  root.get_side_border_padding = get_side_border_padding;
}).call(this);
$(function () {
  $('a.hg-submenu').click(function () {
    return false;
  });
});
function activate_chosen(selector) {
  if (!navigator.userAgent.match(/(iPod|iPad|iPhone|Android)/)) {
    $(selector).chosen({ allow_single_deselect: true });
  }
}
$(function () {
  activate_chosen('select');
  var matchtab = function () {
    var url = document.location.toString();
    if (url.match('#/')) {
      $('.nav-tabs.nav-tabs-auto a[href=#' + url.split('#/')[1] + ']').tab(
        'show'
      );
    } else if (url.match('#')) {
      $('.nav-tabs.nav-tabs-auto a[href=#' + url.split('#')[1] + ']').tab(
        'show'
      );
    }
  };
  $(window).bind('hashchange', matchtab);
  matchtab();
  $('.nav-tabs.nav-tabs-auto a').on('shown', function (e) {
    window.location.hash = '#/' + e.target.hash.slice(1);
  });
  var url = document.location.toString();
  if (!url.match('#')) {
    $('.nav-tabs.nav-tabs-auto a').filter(':first').tab('show');
  }
});
