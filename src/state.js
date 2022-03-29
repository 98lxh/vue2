
import { Dep } from "./observer/dep";
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

/**
 * todo 
*/
// function initProps(vm) { }

function initMethods(vm) {
  const { methods } = vm.$options;
  vm._methods = methods

  for (let key in methods) {
    proxy(vm, "_methods", key)
  }
}

//初始化data
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

//初始化计算属性
function initComputed(vm) {
  const watchers = vm._computedWatchers =  {};
  const { computed } = vm.$options;
  for (let key in computed) {
    const userDef = computed[key];
    let getter = typeof userDef === 'function' ? userDef : userDef.get

    //每个计算属性 本质就是watcher
    //lazy:true 表示懒执行

    //将watcher和属性做映射
    watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true })

    vm._computedWatcher = watchers
    //将key定义在vm上
    defineComputed(vm, key, userDef)
  }
}

//初始化watch
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

//创建用户watcher
function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler)
}


function createComputedGetter(key){
  //取计算属性的watcher走这个get
  return function computedGetter(){
    //拿出这个key对应的watcher 这个watcher中包含get
    let watcher = this._computedWatchers[key]

    //根据dirty属性判断这个计算属性需不需要重新执行
    if(watcher.dirty){
      watcher.evaluate()
    }

    //如果当前取完值后Dep.target还有值 需要向上收集 这个watcher就是渲染watcher
    if(Dep.target){
      //watcher对应的dep -> firstName lastName 收集他们的渲染watcher(对应computed.html的示例)
      watcher.depend() // watcher对应多个dep
    }
    return watcher.value
  }
}

function defineComputed(vm, key, userDef) {
  let sharedProperty = {}
  if (typeof userDef === 'function') {
    sharedProperty.get = createComputedGetter(key)
  } else {
    sharedProperty.get = createComputedGetter(key)
    sharedProperty.set = userDef.set
  }
  Object.defineProperty(vm, key, sharedProperty)
}
