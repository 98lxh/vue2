
import { parserHTML } from "./parserHTML";

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

function generate(el) {
  const children = genChildren(el);
  let code = `_c("${el.tag}",${el.attrs}${children ? `,${children}` : ''})`

  return code
}


export function compileToFunction(template) {
  //解析字符串 将html转换成ast语法树
  const root = parserHTML(template);
  //将ats语法树转换成js语法
  //<div id="app"></div> -> _c("div",{id:app},"")
  let code = generate(root);
  //所有的模板引擎实现都需要new Function + with
  let renderFn = new Function(`with(this){return ${code}}`)

  return renderFn
}
