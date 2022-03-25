export function createElement(tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key
  }
  return vnode(tag, data, key, children, undefined)
}

export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}


//生成虚拟节点  虚拟节点 -> 用js描述dom元素

// 将template转换成ast -> 生成render方法 -> 生成虚拟dom -> 生成真实dom

//页面更新重新生成虚拟dom -> 更新dom

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
