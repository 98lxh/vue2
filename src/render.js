
import { createElement, createTextNode } from "./vdom/createElement"

export function renderMixin(Vue) {
  // _c是创建元素的虚拟节点
  // _v创建文本的虚拟节点
  // _sJSON.stringify()
  Vue.prototype._c = function () {
    // tag data children
    console.log(...arguments)
    return createElement(...arguments)
  }

  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }

  Vue.prototype._s = function (value) {
    return value === null ? '' : (typeof value === 'object' ? JSON.stringify(value) : value)
  }

  Vue.prototype._render = function () {
    const vm = this;
    const { render } = vm.$options
    //实例上取值
    const vnode = render.call(vm)

    return vnode
  }
}
