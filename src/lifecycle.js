
import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el //真实的dom元素

  callHook(vm, "beforeMount")
  //渲染还是更新都会调用这个方法
  let updateComponent = () => {
    //返回虚拟dom
    vm._update(vm._render())
  }

  //每个组件一定有一个渲染watcher
  //渲染watcher
  //true表示是一个渲染watcher
  new Watcher(vm, updateComponent, () => { }, true)
  callHook(vm, "mounted")
}


export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  //找到对应的钩子调用
  if (handlers.length) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }else{
    handlers.call(vm)
  }
}
