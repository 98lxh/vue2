import { isObject } from "../utils/index";
import { isReservedTag } from "../utils/isReservedTag";

export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key
  }

  if (isReservedTag(tag)) { //html的原生标签
    return vnode(tag, data, key, children, undefined)
  } else {
    //找到组件的定义 -> 子组件的构造函数
    const Ctor = vm.$options.components[tag]

    return createComponent(vm, tag, data, key, children, Ctor)
  }

}

//创建组件的虚拟节点
function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }

  //组件钩子
  data.hooks = {
    init(vnode) {
      let child = vnode.componentInstance = new Ctor({ _isComponent: true })
      console.log(child)
      child.$mount()
    }
  }

  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, {
    Ctor,
    children
  })
}

export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}


//生成虚拟节点  虚拟节点 -> 用js描述dom元素

// 将template转换成ast -> 生成render方法 -> 生成虚拟dom -> 生成真实dom

//页面更新重新生成虚拟dom -> 更新dom

function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}
