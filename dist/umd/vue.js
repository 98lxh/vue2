(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
    console.log(vm);
  }

  function initMixin(Vue) {
    //初始化流程
    Vue.prototype._init = function (options) {
      //数据劫持
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm);
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
