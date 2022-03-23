(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  //将解析后的结果组合成ast树 -> stack
  function createAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      parent: null,
      attrs: attrs
    };
  }

  var root = null;
  var stack = [];

  function parserHTML(html) {
    function start(tagName, attributes) {
      var parent = stack[stack.length - 1];
      var element = createAstElement(tagName, attributes); //设置根节点

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

      if (text) {
        parent.children.push({
          type: 3,
          text: text
        });
      }
    }

    function advance(len) {
      html = html.slice(len);
    } //解析节点的属性


    function parserAttrs(attrs) {
      var attrMap = {};

      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        var _attr$split = attr.split('='),
            _attr$split2 = _slicedToArray(_attr$split, 2),
            attrName = _attr$split2[0],
            attrValue = _attr$split2[1];

        attrMap[attrName] = attrValue;
      }

      return attrMap;
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
      } //得到一个属性的数组


      var attrArr = attrStr ? attrStr.split(' ') : []; //解析成一个属性对象

      var attrs = parserAttrs(attrArr);
      return {
        tagName: tagName,
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
          start(startTagMatch.tagName, start.attrs);
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
  }

  function compileToFunction(template) {
    parserHTML(template);
    console.log(root);
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
      }

      return result;
    };
  });

  function defineReactive(target, key, value) {
    observe(value);
    return Object.defineProperty(target, key, {
      get: function get() {
        /**
         * todo:依赖收集
        */
        return value;
      },
      set: function set(newValue) {
        if (value === newValue) return;
        console.log('更新数据');
        observe(newValue);
        /**
         * todo:依赖更新
        */

        value = newValue;
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      //缺点:vue2中如果层次过多，那么需要递归的解析对象属性
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
      return data;
    } //观测数据


    new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    //数据初始化
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //对象劫持
    //MVVM 数据驱动视图

    observe(data);
  }

  function initMixin(Vue) {
    //初始化流程
    Vue.prototype._init = function (options) {
      //数据劫持
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm);

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
          var render = compileToFunction(template);
          options.render = render;
        }
      }
    };
  }

  function Vue(options) {
    //进行初始化
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
