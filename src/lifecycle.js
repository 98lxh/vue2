
import Watcher from "./observer/watcher";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    console.log(vnode)
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el //真实的dom元素

  //渲染还是更新都会调用这个方法
  let updateComponent = () => {
    //返回虚拟dom
    vm._update(vm._render())
  }

  //每个组件一定有一个渲染watcher
  //渲染watcher
  //true表示是一个渲染watcher
  new Watcher(vm, updateComponent, () => { }, true)
}
