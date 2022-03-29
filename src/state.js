
import { observe } from "./observer/index";
import Watcher from "./observer/watcher";
import { proxy } from "./utils/index";

export function stateMixin(Vue) {
  //这里会初始化用户watcher options就是immediate deep这些配置项
  Vue.prototype.$watch = function (key, handler, options = {}) {
    options.user = true //告诉watcher是用户watcher 和渲染watcher区分开
    new Watcher(this, key, handler, options)
  }
}

export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}


function initProps(vm) { }
function initMethods(vm) {
  const { methods } = vm.$options;
  vm._methods = methods

  for (let key in methods) {
    proxy(vm, "_methods", key)
  }
}
function initData(vm) {
  //数据初始化
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  //对象劫持
  //MVVM 数据驱动视图

  for (let key in data) {
    proxy(vm, "_data", key)
  }

  observe(data);
}
function initComputed(vm) { }
function initWatch(vm) {
  const { watch } = vm.$options
  for (let key in watch) {
    const handler = watch[key]

    if (Array.isArray(handler)) {
      //数组的情况
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler)
}
