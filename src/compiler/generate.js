function gen(node) {
  if (node.type === 1) {
    //元素节点
    return generate(node)
  } else {
    //文本
    let text = node.text;
    const tokens = [];
    while (text.trim()) {
      //文本的结束位置
      const textEndIndex = text.indexOf("{{")

      if (textEndIndex === -1) {
        return `_v("${text}")`
      }

      if (textEndIndex === 0) {
        //表达式的结束位置
        const execEndIndex = text.indexOf("}}")
        tokens.push(`_s(${text.slice(textEndIndex + 2, execEndIndex)})`)
        text = text.slice(execEndIndex + 2)
      } else {
        tokens.push(JSON.stringify(text.slice(0, textEndIndex)))
        text = text.slice(textEndIndex)
      }
    }
    return `_v(${tokens.join("+")})`
  }
}



function genChildren(el) {
  const children = el.children;
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false
  }
}



export function generate(el) {
  const children = genChildren(el);
  const directiveStr = JSON.stringify(el.directive)
  const directive = directiveStr.slice(1, directiveStr.length - 1)
  let attrs = el.attrs.slice(0, el.attrs.length - 1)
  if (attrs.length === 1) {
    attrs = attrs + directive + "}"
  } else {
    attrs = attrs + ',' + directive + "}"
  }
  let code = `_c("${el.tag}",${attrs}${children ? `,${children}` : ''})`
  return code
}
