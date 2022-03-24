
import { observe } from "./observer/index";

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

//_data的值代理到实例上
function proxy(vm,source,key){
  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key]
    },
    set(newValue){
      vm[source][key] = newValue
    }
  })
}

function initProps(vm) { }
function initMethods(vm) { }
function initData(vm) {
  //数据初始化
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  //对象劫持
  //MVVM 数据驱动视图

  for(let key in data){
    proxy(vm,"_data",key)
  }

  observe(data);
}
function initComputed(vm) { }
function initWatch(vm) { }
