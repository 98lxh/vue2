
/**
 * 老节点和新节点做比对diff
*/
export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    //组件的挂载
    console.log('组件的首次挂载')
    return createElm(vnode)
  } else {
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

      return el
    } else {
      //比对两个虚拟节点 进行diff
      if (oldVnode.tag !== vnode.tag) {
        //标签不一致 直接替换
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
      }

      if (!oldVnode.tag) {
        //文本节点
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text
        }
      }

      //走到这里说明标签一致并且不是文本节点(比对属性是否一致)
      let el = vnode.el = oldVnode.el;
      updatePropertys(vnode, oldVnode.data)

      //比对子节点
      let oldChildren = oldVnode.children || [];
      let newChildren = vnode.children || []

      if (oldChildren.length > 0 && newChildren.length > 0) {
        //新旧节点都有子节点
        //比对他们的子节点
        updateChildren(el, oldChildren, newChildren)
      } else if (newChildren.length > 0) {
        //新节点有子节点 旧节点没有
        //直接将子节点转换成真实节点插入
        for (let i = 0; i < newChildren.length; i++) {
          let child = newChildren[i]
          el.appendChild(createElm(child))
        }
      } else if (oldChildren.length > 0) {
        //旧节点有子节点 新节点没有子节点 
        //删除节点
        for (let i = 0; i < oldChildren.length; i++) {
          el.innerHTML = ""
        }
      }
    }
  }
}

//比较两个节点 只比较tag和key 都一致就认为他们是同一个节点
function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

function updateChildren(parent, oldChildren, newChildren) {
  //双指针
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[oldStartIndex]
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0;
  let newStartVnode = newChildren[newStartIndex]
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex]

  //在比对的过程中 新旧虚拟节点有一方指针重合就结束
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      //命中一:新前新后一致
      //是同一个节点就比对这两个属性
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex;i++) {
      //将新增的元素直接插入
      parent.appendChild(createElm(newChildren[i]))
     }
  }
}

//更新属性
function updatePropertys(vnode, oldProps) {
  const newProps = vnode.data || {};

  //对比style
  let newStyle = newProps.style || {};
  let oldStyle = oldProps && oldProps.style || {};
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      newStyle[key] = ''
    }
  }
  //比对新旧节点的属性
  for (let key in oldProps) {
    if (!newProps[key]) {
      //旧节点有新节点没有 在真实节点中将这个属性删除
      vnode.el.removeAttribute(key)
    }
  }


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


//创建组件的真实节点
function createComponent(vnode) { //初始化组件
  //创建组件的实例
  let i = vnode.data
  if ((i = i.hooks) && (i = i.init)) {
    i(vnode)
  }

  if (vnode.componentInstance) {
    return true
  }
}


//根据虚拟节点创建真实的节点
export function createElm(vnode) {
  const { tag, children, key, data, text } = vnode
  //区分标签和文本
  if (typeof tag === 'string') {

    //tag为字符串的情况也有可能是组件标签

    //实例化组件
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }

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
