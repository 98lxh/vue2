(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function gen(node) {
    if (node.type === 1) {
      //元素节点
      return generate(node);
    } else {
      //文本
      var text = node.text;
      var tokens = [];

      while (text.trim()) {
        //文本的结束位置
        var textEndIndex = text.indexOf("{{");

        if (textEndIndex === -1) {
          return "_v(\"".concat(text, "\")");
        }

        if (textEndIndex === 0) {
          //表达式的结束位置
          var execEndIndex = text.indexOf("}}");
          tokens.push("_s(".concat(text.slice(textEndIndex + 2, execEndIndex), ")"));
          text = text.slice(execEndIndex + 2);
        } else {
          tokens.push(JSON.stringify(text.slice(0, textEndIndex)));
          text = text.slice(textEndIndex);
        }
      }

      return "_v(".concat(tokens.join("+"), ")");
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var directiveStr = JSON.stringify(el.directive);
    var directive = directiveStr.slice(1, directiveStr.length - 1);
    var attrs = el.attrs.slice(0, el.attrs.length - 1);

    if (attrs.length === 1) {
      attrs = attrs + directive + "}";
    } else {
      attrs = attrs + ',' + directive + "}";
    }

    var code = "_c(\"".concat(el.tag, "\",").concat(attrs).concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isUnaryTag(tagName) {
    var unaryTag = ['input', 'br'];
    return unaryTag.includes(tagName);
  }

  function parserVModel(modelExp, typeExp, tag) {
    var type = (typeExp === null || typeExp === void 0 ? void 0 : typeExp.split("=")[1].replace(/"/g, "")) || 'text';

    var _modelExp$split = modelExp.split("="),
        _modelExp$split2 = _slicedToArray(_modelExp$split, 2);
        _modelExp$split2[0];
        var modelValue = _modelExp$split2[1];

    modelValue = modelValue.replace(/"/g, "");
    var vModel = {};

    if (tag === 'input') {
      //input输入框 或者checkbox
      if (type === 'text') {
        //文本输入框
        vModel = {
          tag: tag,
          type: 'text',
          value: modelValue
        };
      } else if (type === 'checkbox') {
        //checkbox
        vModel = {
          tag: tag,
          type: 'checkbox',
          value: modelValue
        };
      }
    } else if (tag === 'textarea') {
      vModel = {
        tag: tag,
        value: modelValue
      };
    } else if (tag === 'select') {
      vModel = {
        tag: tag,
        value: modelValue
      };
    }

    return vModel;
  } //v-bind:xx="xxx"


  function parserVBind(bindingExp) {
    bindingExp = bindingExp.split(":")[1];

    var _bindingExp$split = bindingExp.split("="),
        _bindingExp$split2 = _slicedToArray(_bindingExp$split, 2),
        bindingKey = _bindingExp$split2[0],
        bindingValue = _bindingExp$split2[1];

    return _defineProperty({}, bindingKey, bindingValue.replace(/"/g, ""));
  } //v-on:click="xx"


  function parserVOn(onExp) {
    onExp = onExp.split(":")[1];

    var _onExp$split = onExp.split("="),
        _onExp$split2 = _slicedToArray(_onExp$split, 2),
        event = _onExp$split2[0],
        callback = _onExp$split2[1];

    return _defineProperty({}, event, callback.replace(/"/g, ""));
  }

  function parserHTML(html) {
    var root = null;
    var stack = []; //将解析后的结果组合成ast树 -> stack

    function createAstElement(tagName, attrs, directive) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs: attrs,
        directive: directive
      };
    }

    function start(tagName, attributes, directive) {
      var parent = stack[stack.length - 1];
      var element = createAstElement(tagName, attributes, directive); //设置根节点

      if (!root) {
        root = element;
      } //放入栈中时 记录自己的父节点


      element.parent = parent; //为这个父节点添加子节点为当前节点

      if (parent) {
        parent.children.push(element);
      }

      stack.push(element);
    }

    function end(tagName) {
      var last = stack.pop();

      if (last.tag !== tagName) {
        //闭合标签有误
        throw new Error('标签有误');
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, " ");
      var parent = stack[stack.length - 1];

      if (text.trim()) {
        parent.children.push({
          type: 3,
          text: text
        });
      }
    }

    function advance(len) {
      html = html.slice(len);
    } //解析节点属性生成节点属性的字符串


    function parserAttrs(attrs) {
      attrs = attrs.filter(function (a) {
        return a;
      });
      console.log(attrs);
      var attrStr = "";

      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        var _attr$split = attr.split('='),
            _attr$split2 = _slicedToArray(_attr$split, 2),
            attrName = _attr$split2[0],
            attrValue = _attr$split2[1];

        attrValue = attrValue.replace(/"/g, '');

        if (attrName === 'style') {
          (function () {
            var obj = {};
            attrValue.split(';').forEach(function (item) {
              var _item$split = item.split(':'),
                  _item$split2 = _slicedToArray(_item$split, 2),
                  key = _item$split2[0],
                  value = _item$split2[1];

              if (key) obj[key] = value.replace(/\s+/g, "");
            });
            attrValue = obj;
          })();
        }

        attrStr += "".concat(attrName, ":").concat(JSON.stringify(attrValue), ",");
      }

      return "{".concat(attrStr.slice(0, -1), "}");
    }

    function parserStartTag(html) {
      //不是开始标签
      if (html.indexOf('</') === 0) return false;
      var end = html.indexOf('>'); //拿到标签内容

      var content = html.slice(1, end);
      advance(end + 1); //拿到第一个空格的位置

      var firstSpaceIdx = content.indexOf(' ');
      var tagName = '',
          attrStr = '';

      if (firstSpaceIdx === -1) {
        //没有找到空格，则将content作为标签
        tagName = content;
      } else {
        //找到了空格则到第一个空格之前的是标签名
        tagName = content.slice(0, firstSpaceIdx);
        attrStr = content.slice(firstSpaceIdx + 1);
      } //处理style


      var styleStartIdx = attrStr.indexOf('style');
      var styleStr;

      if (styleStartIdx !== -1) {
        //style开始到结尾的字符串
        styleStr = attrStr.slice(styleStartIdx, attrStr.length - 1);
        var styleEndIndex = styleStr.indexOf(" ");

        if (styleEndIndex !== -1) {
          styleStr = styleStr.slice(0, styleEndIndex);
          console.log(styleStr);
          attrStr = attrStr.split(styleStr).join("");
        }
      }

      var attrArr = attrStr ? attrStr.trim().split(' ') : [];
      var directive = {}; //处理v-model指令

      var vModel = attrArr.findIndex(function (attr) {
        return attr.indexOf('v-model') !== -1;
      });

      if (vModel !== -1) {
        //找下这个节点的type
        var type = attrArr.findIndex(function (attr) {
          return attr.indexOf('type') !== -1;
        });
        directive.vModel = parserVModel(attrArr[vModel], attrArr[type], tagName);
        attrArr.splice(vModel, 1);
      } //处理v-on指令


      var vOn = attrArr.findIndex(function (attr) {
        return attr.indexOf('v-on') !== -1;
      });

      if (vOn !== -1) {
        directive.vOn = parserVOn(attrArr[vOn]);
        attrArr.splice(vOn, 1);
      } //处理v-bind指令


      var vBind = attrArr.findIndex(function (attr) {
        return attr.indexOf('v-bind') !== -1;
      });

      if (vBind !== -1) {
        directive.vBind = parserVBind(attrArr[vBind]);
        attrArr.splice(vBind, 1);
      } //解析成一个属性字符串


      var attrs = parserAttrs([].concat(_toConsumableArray(attrArr), [styleStr]));
      return {
        tagName: tagName,
        directive: directive,
        attrs: attrs
      };
    }

    function parserEndTag(html) {
      var end = html.indexOf('>');
      var tagStart = html.indexOf('/');
      var tagEnd = html.indexOf('>');
      var tagName = html.slice(tagStart + 1, tagEnd);
      advance(end + 1);
      return {
        tagName: tagName
      };
    } //解析的内容如果存在一直解析


    while (html) {
      var textEnd = html.indexOf('<'); //解析到开头

      if (textEnd === 0) {
        //解析开始标签
        var startTagMatch = parserStartTag(html);

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs, startTagMatch.directive);

          if (isUnaryTag(startTagMatch.tagName)) {
            //自闭合标签 直接出栈
            end(startTagMatch.tagName);
          }

          continue;
        }

        var endTagMatch = parserEndTag(html);

        if (endTagMatch) {
          end(endTagMatch.tagName);
          continue;
        }
      } //文本的处理


      var text = void 0;

      if (textEnd > 0) {
        text = html.slice(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    return root;
  }

  function compileToFunction(template) {
    //解析字符串 将html转换成ast语法树
    var root = parserHTML(template); //将ats语法树转换成js语法
    //<div id="app"></div> -> _c("div",{id:app},"")

    var code = generate(root); //所有的模板引擎实现都需要new Function + with

    var renderFn = new Function("with(this){return ".concat(code, "}"));
    return renderFn;
  }

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = [];
    } //依赖收集


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        //观察者模式
        //让watcher记住当前dep
        Dep.target.addDep(this);
        this.subs.push(Dep.target);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      } //依赖更新

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }(); //静态属性
  var stack = []; //将watcher保留 和移除

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  //判断是否为一个对象
  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  } //_data的值代理到实例上

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  var oldArrayMethods = Array.prototype;
  var arrayMetods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMetods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //调用原生的数组方法
      var result = oldArrayMethods[method].apply(this, args);
      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        ob.observerArray(inserted);
      } //数组的依赖更新


      ob.dep.notify();
      return result;
    };
  });

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(target, key, value) {
    var dep = new Dep(); //这里返回的是一个observer的实例当前这value对应的observer

    var childOb = observe(value);
    return Object.defineProperty(target, key, {
      get: function get() {
        //每个属性都对应着自己的watcher
        if (Dep.target) {
          //如果当前有watcher
          dep.depend();

          if (childOb) {
            //收集了数组的相关依赖
            childOb.dep.depend(); //如果数组中还有数组也去收集依赖

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (value === newValue) return;
        observe(newValue);
        value = newValue;
        dep.notify(); //通知依赖的watcher进行更新操作
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      //数组的依赖
      this.dep = new Dep(); //缺点:vue2中如果层次过多，那么需要递归的解析对象属性

      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        //如果数组下放对象则劫持
        value.__proto__ = arrayMetods;
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          var value = data[key];
          defineReactive(data, key, value);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(value) {
        value.forEach(function (v) {
          observe(v);
        });
      }
    }]);

    return Observer;
  }();

  function observe(data) {
    if (!isObject(data)) {
      return;
    } //观测数据


    return new Observer(data);
  }

  var callbacks = [];
  var waiting = false;

  function flushCallback() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
    callbacks = [];
  } // 多次调用nextTick 如果没有刷新的时候就先放到数组中
  // 刷新后更改waiting


  function nextTick(cb) {
    callbacks.push(cb);

    if (waiting === false) {
      setTimeout(flushCallback, 0);
      waiting = true;
    }
  }

  var queue = [];
  var has = {};

  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = []; //下一次可以继续执行

    has = {};
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true; //宏任务和微任务向下兼容
      //Vue.nextTick = promise.then -> mutationObserver -> setImmediate -> setTimeout

      nextTick(flushSchedularQueue);
    }
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback; //看看是不是用户watcher

      this.user = !!options.user; //看看是不是懒执行 计算属性watcher

      this.lazy = !!options.lazy; //标记计算属性watcher的值是不是脏值

      this.dirty = !!options.lazy;
      this.options = options; //watcher 对应的dep id的集合

      this.depsId = new Set(); //watcher的id 用来去重

      this.id = id++; //watcher对应的dep依赖

      this.deps = []; //传入的回调函数放到getter属性上(expOrFn有可能是字符串:用户watcher)

      if (typeof expOrFn === 'string') {
        //将表达式转换成函数 数据取值时进行依赖收集
        this.getter = function () {
          var path = expOrFn.split('.');
          var obj = vm; //有可能是是xx.xx这种多层嵌套的

          return path.reduce(function (prev, next) {
            return prev[next];
          }, obj);
        };
      } else {
        this.getter = expOrFn;
      } //懒执行初始化的时候就不执行


      this.value = this.lazy ? undefined : this.get(); //默认初始化要取值
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this); //把watcher存起来
        //新的值

        var value = this.getter.call(this.vm);
        popTarget(); //移除watcher

        return value;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        //watcher里不能放重复的dep
        //dep也不能放重复的watcher
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        //等待一起更新 因为每次调用update的时候都放入了watcher
        // this.get()
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var newValue = this.get();
        var oldValue = this.value; //保证上一次的新值是下一次的旧值

        this.value = newValue;

        if (this.user) {
          this.callback.call(this.vm, newValue, oldValue);
        }
      } //计算的getter执行

    }, {
      key: "evaluate",
      value: function evaluate() {
        //设置dirty标记为非脏值 计算属性的缓存就是这样实现的
        this.dirty = false;
        this.value = this.get();
      } //这里主要是computed对应的依赖只收集了计算属性watcher 但是这些依赖也应该收集渲染watcher

    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);

    return Watcher;
  }();

  function stateMixin(Vue) {
    //这里会初始化用户watcher options就是immediate deep这些配置项
    Vue.prototype.$watch = function (key, handler) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options.user = true; //告诉watcher是用户watcher 和渲染watcher区分开

      new Watcher(this, key, handler, options);
    };
  }
  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) {
      initProps(vm);
    }

    if (opts.methods) {
      initMethods(vm);
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }
  /**
   * todo 
  */
  // function initProps(vm) { }

  function initMethods(vm) {
    var methods = vm.$options.methods;
    vm._methods = methods;

    for (var key in methods) {
      proxy(vm, "_methods", key);
    }
  } //初始化data


  function initData(vm) {
    //数据初始化
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //对象劫持
    //MVVM 数据驱动视图

    for (var key in data) {
      proxy(vm, "_data", key);
    }

    observe(data);
  } //初始化计算属性


  function initComputed(vm) {
    var watchers = vm._computedWatchers = {};
    var computed = vm.$options.computed;

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get; //每个计算属性 本质就是watcher
      //lazy:true 表示懒执行
      //将watcher和属性做映射

      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      });
      vm._computedWatcher = watchers; //将key定义在vm上

      defineComputed(vm, key, userDef);
    }
  } //初始化watch


  function initWatch(vm) {
    var watch = vm.$options.watch;

    for (var key in watch) {
      var handler = watch[key];

      if (Array.isArray(handler)) {
        //数组的情况
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  } //创建用户watcher


  function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler);
  }

  function createComputedGetter(key) {
    //取计算属性的watcher走这个get
    return function computedGetter() {
      //拿出这个key对应的watcher 这个watcher中包含get
      var watcher = this._computedWatchers[key]; //根据dirty属性判断这个计算属性需不需要重新执行

      if (watcher.dirty) {
        watcher.evaluate();
      } //如果当前取完值后Dep.target还有值 需要向上收集 这个watcher就是渲染watcher


      if (Dep.target) {
        //watcher对应的dep -> firstName lastName 收集他们的渲染watcher(对应computed.html的示例)
        watcher.depend(); // watcher对应多个dep
      }

      return watcher.value;
    };
  }

  function defineComputed(vm, key, userDef) {
    var sharedProperty = {};

    if (typeof userDef === 'function') {
      sharedProperty.get = createComputedGetter(key);
    } else {
      sharedProperty.get = createComputedGetter(key);
      sharedProperty.set = userDef.set;
    }

    Object.defineProperty(vm, key, sharedProperty);
  }

  /**
   * 老节点和新节点做比对diff
  */
  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      //组件的挂载
      console.log('组件的首次挂载');
      return createElm(vnode);
    } else {
      //判断更新还是渲染
      var isRealElement = oldVnode.nodeType;

      if (isRealElement) {
        console.log('当前旧节点是真实节点,进入首次渲染'); //初次渲染

        var oldElm = oldVnode;
        var parentElm = oldElm.parentNode; // body

        var el = createElm(vnode); //挂载

        parentElm.insertBefore(el, oldElm.nextSibling); //删除旧的节点

        parentElm.removeChild(oldElm);
        return el;
      } else {
        //比对两个虚拟节点 进行diff
        if (oldVnode.tag !== vnode.tag) {
          //标签不一致 直接替换
          oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
        }

        if (!oldVnode.tag) {
          //文本节点
          if (oldVnode.text !== vnode.text) {
            oldVnode.el.textContent = vnode.text;
          }
        } //走到这里说明标签一致并且不是文本节点(比对属性是否一致)


        var _el = vnode.el = oldVnode.el;

        updatePropertys(vnode, oldVnode.data); //比对子节点

        var oldChildren = oldVnode.children || [];
        var newChildren = vnode.children || [];

        if (oldChildren.length > 0 && newChildren.length > 0) {
          //新旧节点都有子节点
          //比对他们的子节点
          updateChildren(_el, oldChildren, newChildren);
        } else if (newChildren.length > 0) {
          //新节点有子节点 旧节点没有
          //直接将子节点转换成真实节点插入
          for (var i = 0; i < newChildren.length; i++) {
            var child = newChildren[i];

            _el.appendChild(createElm(child));
          }
        } else if (oldChildren.length > 0) {
          //旧节点有子节点 新节点没有子节点 
          //删除节点
          for (var _i = 0; _i < oldChildren.length; _i++) {
            _el.innerHTML = "";
          }
        }
      }
    }
  } //比较两个节点 只比较tag和key 都一致就认为他们是同一个节点

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  }

  function updateChildren(parent, oldChildren, newChildren) {
    //双指针
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[oldStartIndex];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0;
    var newStartVnode = newChildren[newStartIndex];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];

    var makeIndexByKey = function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        if (item.key) {
          //根据key创建一个映射表
          map[item.key] = index;
        }
      });
      return map;
    };

    var map = makeIndexByKey(oldChildren); //在比对的过程中 新旧虚拟节点有一方指针重合就结束

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        //旧指针移动过程中可能碰到undefined 遇到就直接跳过
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        //命中一:新前新后一致 优化向后插入的情况
        //是同一个节点就比对这两个属性
        patch(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        //命中二:新后与旧后一直，优化向前插入的情况
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        //命中三:新后与旧前 优化头部移动到尾部 倒序变正序
        patch(oldStartVnode, newEndVnode);
        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        //命中四:新前与旧后 优化尾部移动到头部 正序变倒序
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        //以上情况都没有命中 乱序
        //先根据老节点的key做一个映射表 拿新的虚拟节点去映射表中查找 则进行移动操作，
        //如果找不到则直接将元素插入
        var moveIndex = map[newStartIndex.key];

        if (!moveIndex) {
          //没有找到不需要复用
          //创建节点插入
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          //如果在映射表中找到了 需要把这个元素移走 并且当前位置置空
          var moveVnode = oldChildren[moveIndex];
          oldChildren[moveIndex] = undefined;
          parent.insertBefore(moveVnode.el, oldStartVnode.el);
          patch(moveVnode, oldStartVnode);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    }

    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        //将新增的元素直接插入(可能是向后插入 也有可能从头插入)

        /**
         * 如果是向后添加了元素 那么newEndIndex + 1 一定是null
         * 如果是向前添加了元素 那么newEndIndex - 1 可以作为flag插入到他的前边即可
        */
        var flag = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createElm(newChildren[i]), flag);
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      for (var _i2 = oldStartIndex; _i2 <= oldEndIndex; _i2++) {
        parent.removeChild(oldChildren[_i2].el);
      }
    }
  } //更新属性


  function updatePropertys(vnode, oldProps) {
    var newProps = vnode.data || {}; //对比style

    var newStyle = newProps.style || {};
    var oldStyle = oldProps && oldProps.style || {};

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        newStyle[key] = '';
      }
    } //比对新旧节点的属性


    for (var _key in oldProps) {
      if (!newProps[_key]) {
        //旧节点有新节点没有 在真实节点中将这个属性删除
        vnode.el.removeAttribute(_key);
      }
    }

    var el = vnode.el;

    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else if (_key2 === 'vModel') {
        setVModel(el.tagName.toLowerCase(), newProps['vModel'].value, vnode);
      } else if (_key2 === 'vOn') {
        setVOn(vnode);
      } else if (_key2 === 'vBind') {
        setVBind(vnode);
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  } //创建组件的真实节点


  function createComponent$1(vnode) {
    //初始化组件
    //创建组件的实例
    var i = vnode.data;

    if ((i = i.hooks) && (i = i.init)) {
      i(vnode);
    }

    if (vnode.componentInstance) {
      return true;
    }
  } //根据虚拟节点创建真实的节点


  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        text = vnode.text; //区分标签和文本

    if (typeof tag === 'string') {
      //tag为字符串的情况也有可能是组件标签
      //实例化组件
      if (createComponent$1(vnode)) {
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag);
      updatePropertys(vnode);
      children.forEach(function (child) {
        //递归创建儿子节点，将儿子节点放入父节点中
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      //虚拟dom上映射着真实dom方便获取更新操作
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } //设置双向绑定属性v-model

  function setVModel(tag, value, vnode) {
    var context = vnode.context,
        el = vnode.el;

    if (tag === 'select') {
      //初始化异步处理一下  需要等待option选项
      context.$nextTick(function () {
        el.value = context[value];
      });
      el.addEventListener('change', function () {
        context[value] = el.value;
      });
    } else if (tag === 'input' && el.type === 'text') {
      //文本输入框
      el.value = context[value];
      el.addEventListener('input', function () {
        context[value] = el.value;
      });
    } else if (tag === 'input' && el.type === 'checkbox') {
      el.checked = context[value];
      el.addEventListener('change', function () {
        context[value] = el.checked;
      });
    }
  } //设置v-bind指令


  function setVBind(vnode) {
    var data = vnode.data,
        context = vnode.context,
        el = vnode.el;

    for (var key in data.vBind) {
      el.setAttribute(key, context[data.vBind[key]]);
    }
  } //设置v-on


  function setVOn(vnode) {
    var data = vnode.data,
        el = vnode.el,
        context = vnode.context;

    var _loop = function _loop(eventName) {
      el['on' + eventName] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key3 = 0; _key3 < _len; _key3++) {
          args[_key3] = arguments[_key3];
        }

        context[data.vOn[eventName]].apply(context, args);
      };
    };

    for (var eventName in data.vOn) {
      _loop(eventName);
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; //虚拟节点对应的内容
      //第一次不需要diff

      var prevVNode = vm._vnode;
      vm._vnode = vnode;

      if (!prevVNode) {
        vm.$el = patch(vm.$el, vnode);
      } else {
        vm.$el = patch(prevVNode, vnode);
      }
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el; //真实的dom元素

    callHook(vm, "beforeMount"); //渲染还是更新都会调用这个方法

    var updateComponent = function updateComponent() {
      //返回虚拟dom
      vm._update(vm._render());
    }; //每个组件一定有一个渲染watcher
    //渲染watcher
    //true表示是一个渲染watcher


    new Watcher(vm, updateComponent, function () {}, true);
    callHook(vm, "mounted");
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (!handlers) return; //找到对应的钩子调用

    for (var i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }

  var strats = {}; //生命周期的合并策略

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDistory', 'distoryed'];
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        //父子选项都存在
        //返回一个数组 子选项在前:先执行子选项
        return parentVal.concat(childVal);
      } else {
        //父选项不存在 返回子选项
        return [childVal];
      }
    } else {
      //如果子选项不存在 直接返回父选项
      return parentVal;
    }
  } //组件的合并策略


  strats.components = mergeAssets;

  function mergeAssets(parentVal, childVal) {
    //基于父类创建出一个原型 res.__proto__
    //这样合并完成后子组件就会先找自己的components在去沿着原型链找父类
    var res = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  }

  function mergeOptions$1(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      //如果已经合并过的就没有必要在合并了
      if (!options.hasOwnProperty[_key]) {
        mergeField(_key);
      }
    } //默认的合并策略 但是有些属性合并有特殊的方式比如:生命周期


    function mergeField(key) {
      if (strats[key]) {
        //当前有符合合并策略的选项
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        //父子选项都是object
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        //子选项为null 以父选项为准   
        options[key] = parent[key];
      } else {
        //父子都有该选项 且父子选项都不是object类型 以子选项为准
        options[key] = child[key];
      }
    } // if(options._isComponent){
    //   console.log(options,child,parent)
    // }


    return options;
  }

  function initMixin$1(Vue) {
    //初始化流程
    Vue.prototype._init = function (options) {
      //数据劫持
      var vm = this; //将用户传递的和全局的做合并

      vm.$options = mergeOptions$1(vm.constructor.options, options); //这里调用里beforeCreate 这个阶段合并了选项 但是还没有执行initState 所有数据还没有被观察

      callHook(vm, "beforeCreate"); //初始化状态

      initState(vm); //这里调用里created 已经初始化了状态 可以访问响应式数据 以及其它类似computed methods ..的选项也已经完成了初始化

      callHook(vm, "created");

      if (vm.$options.el) {
        //数据挂载到模板 
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); //模板转换成渲染函数

      if (!options.render) {
        //没有render找template
        var template = options.template;

        if (!template && el) {
          //没有template 取el的内容作为模板
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render;
      }

      mountComponent(vm, el);
    }; //用户内部调用的nextTick


    Vue.prototype.$nextTick = nextTick;
  }

  function isReservedTag(tagName) {
    var reservedTag = 'div,p,input,select,button,option,br,li';
    var has = {};
    reservedTag.split(",").forEach(function (tag) {
      has[tag] = true;
    });
    return has[tagName];
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      //html的原生标签
      return vnode(tag, data, key, children, undefined, undefined, vm);
    } else {
      //找到组件的定义 -> 子组件的构造函数
      var Ctor = vm.$options.components[tag];
      return createComponent(vm, tag, data, key, children, Ctor);
    }
  } //创建组件的虚拟节点

  function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    } //组件钩子


    data.hooks = {
      init: function init(vnode) {
        var child = vnode.componentInstance = new Ctor({
          _isComponent: true
        });
        console.log(child);
        child.$mount();
      }
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  function createTextNode(vm, text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } //生成虚拟节点  虚拟节点 -> 用js描述dom元素
  // 将template转换成ast -> 生成render方法 -> 生成虚拟dom -> 生成真实dom
  //页面更新重新生成虚拟dom -> 更新dom

  function vnode(tag, data, key, children, text, componentOptions, context) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions,
      context: context
    };
  }

  function renderMixin(Vue) {
    // _c是创建元素的虚拟节点
    // _v创建文本的虚拟节点
    // _sJSON.stringify()
    Vue.prototype._c = function () {
      // tag data children
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextNode(this, text);
    };

    Vue.prototype._s = function (value) {
      return value === null ? '' : _typeof(value) === 'object' ? JSON.stringify(value) : value;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; //实例上取值

      var vnode = render.call(vm);
      return vnode;
    };
  }

  var ASSETS_TYPE = ['component', 'filter', 'directive', 'mixin'];

  function initAssetsRegister(Vue) {
    ASSETS_TYPE.forEach(function (type) {
      Vue[type] = function (id, definition) {
        switch (type) {
          case 'component':
            //使用extned方法 将对象变成构造函数
            //子类(子组件也有可能有component方法)
            definition = this.options._base.extend(definition);
            break;
        }

        this.options[type + 's'][id] = definition;
      };
    });
  }

  function initExtend(Vue) {
    //子类和父类 对应子组件和父组件
    //创建子类继承于父类扩展展的时候都扩展到自己的属性上
    var cid = 0;

    Vue.extend = function (opts) {
      // 产生一个基于vue的子类
      // 并且身上应该有父类的所有功能 
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      }; // 原型继承


      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions$1(Super.options, opts);
      Sub.cid = cid++;
      return Sub;
    };
  }

  function initMixin(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  }

  function initGolbalAPI(Vue) {
    //整合了全局相关的内容
    Vue.options = {};
    initMixin(Vue); //初始化全局过滤器指令都放在options上

    ASSETS_TYPE.forEach(function (type) {
      Vue.options[type + 's'] = {};
    }); //_base是Vue的构造函数

    Vue.options._base = Vue; //注册extend方法

    initAssetsRegister(Vue);
    initExtend(Vue);
  }

  function Vue(options) {
    //进行初始化
    this._init(options);
  }

  initMixin$1(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);
  initGolbalAPI(Vue);
  stateMixin(Vue); // import { compileToFunction } from "./compiler/index";

  return Vue;

}));
//# sourceMappingURL=vue.js.map
