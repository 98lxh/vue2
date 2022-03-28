
import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    //虚拟节点对应的内容
    //第一次不需要diff
    const prevVNode = vm._vnode
    vm._vnode = vnode
    if (!prevVNode) {
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVNode, vnode)
    }
  }
}

export function mountComponent(vm, el) {
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
  if (!handlers) return
  //找到对应的钩子调用
  for (let i = 0; i < handlers.length; i++) {
    handlers[i].call(vm)
  }
}
