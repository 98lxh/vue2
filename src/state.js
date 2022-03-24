
import { observe } from "./observer/index";
import { proxy } from "./utils/index";

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
