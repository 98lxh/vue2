
/**
 * 老节点和新节点做比对diff
*/
export function patch(oldVnode, vnode) {
  //判断更新还是渲染
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    console.log('当前旧节点是真实节点,进入首次渲染')
    //初次渲染
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode // body
    let el = createElm(vnode)
    //挂载
    parentElm.insertBefore(el, oldElm.nextSibling)
    //删除旧的节点
    parentElm.removeChild(oldElm)
  }

  //递归创建真实节点，替换掉老的节点
}

//更新属性
function updatePropertys(vnode) {
  const newProps = vnode.data || {};
  const el = vnode.el;
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.class = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}


//根据虚拟节点创建真实的节点
function createElm(vnode) {
  const { tag, children, key, data, text } = vnode
  //区分标签和文本
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updatePropertys(vnode)
    children.forEach(child => {
      //递归创建儿子节点，将儿子节点放入父节点中
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    //虚拟dom上映射着真实dom方便获取更新操作
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}
