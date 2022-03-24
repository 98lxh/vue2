//将解析后的结果组合成ast树 -> stack
function createAstElement(tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs
  }
}


let root = null;
const stack = [];
function parserHTML(html) {

  function start(tagName, attributes) {
    const parent = stack[stack.length - 1]
    const element = createAstElement(tagName, attributes)
    //设置根节点
    if (!root) {
      root = element
    }
    //放入栈中时 记录自己的父节点
    element.parent = parent
    //为这个父节点添加子节点为当前节点
    if (parent) {
      parent.children.push(element)
    }
    stack.push(element)
  }

  function end(tagName) {
    let last = stack.pop();
    if (last.tag !== tagName) {
      //闭合标签有误
      throw new Error('标签有误')
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, " ");
    let parent = stack[stack.length - 1]
    if (text.trim()) {
      parent.children.push({
        type: 3,
        text
      })
    }
  }

  function advance(len) {
    html = html.slice(len)
  }

  //解析节点属性生成节点属性的字符串
  function parserAttrs(attrs) {
    let attrStr = "";
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      let [attrName,attrValue] = attr.split('=')
      attrValue = attrValue.replace(/"/g,'')
      if(attrName === 'style'){
        let obj = {};
        attrValue.split(';').forEach(item => {
          let [key,value] = item.split(':')
          if(key) obj[key] = value.replace(/\s+/g, "");
        })
        attrValue = obj
      }
      attrStr += `${attrName}:${JSON.stringify(attrValue)},`
    }

    return `{${attrStr.slice(0,-1)}}`
  }

  function parserStartTag(html) {
    //不是开始标签
    if (html.indexOf('</') === 0) return false
    const end = html.indexOf('>');
    //拿到标签内容
    const content = html.slice(1, end)
    advance(end + 1)
    //拿到第一个空格的位置
    const firstSpaceIdx = content.indexOf(' ')
    let tagName = '', attrStr = ''
    if (firstSpaceIdx === -1) {
      //没有找到空格，则将content作为标签
      tagName = content
    } else {
      //找到了空格则到第一个空格之前的是标签名
      tagName = content.slice(0, firstSpaceIdx)
      attrStr = content.slice(firstSpaceIdx + 1)
    }

    //处理style
    const styleIdx = attrStr.indexOf('style')
    let styleStr;
    if(styleIdx !== -1){
      styleStr = attrStr.slice(styleIdx,attrStr.length - 1)
      attrStr = attrStr.slice(0,styleIdx)
    }

    const attrArr = attrStr ? attrStr.trim().split(' ') : [];
    
    //解析成一个属性字符串
    const attrs = attrArr.length || styleStr ? parserAttrs([...attrArr,styleStr]) : 'undefined'
    return {
      tagName,
      attrs
    }
  }

  function parserEndTag(html) {
    const end = html.indexOf('>')
    const tagStart = html.indexOf('/');
    const tagEnd = html.indexOf('>');
    const tagName = html.slice(tagStart + 1, tagEnd);
    advance(end + 1)
    return {
      tagName
    }
  }

  //解析的内容如果存在一直解析
  while (html) {
    let textEnd = html.indexOf('<');
    //解析到开头
    if (textEnd === 0) {
      //解析开始标签
      const startTagMatch = parserStartTag(html);
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      const endTagMatch = parserEndTag(html);
      if (endTagMatch) {
        end(endTagMatch.tagName);
        continue;
      }
    }

    //文本的处理
    let text;
    if (textEnd > 0) {
      text = html.slice(0, textEnd);
    }

    if (text) {
      chars(text)
      advance(text.length)
    }
  }

  return root
}

function gen(node){
  if(node.type === 1){
    //元素节点
    return generate(node)
  }else{
    //文本
    let text = node.text;
    const tokens = [];
    while(text.trim()){
      //文本的结束位置
      const textEndIndex = text.indexOf("{{")
      if(textEndIndex === 0){
        //表达式的结束位置
        const execEndIndex = text.indexOf("}}")
        tokens.push(`_s(${text.slice(textEndIndex + 2,execEndIndex)})`)
        text = text.slice(execEndIndex + 2)
      }else{
        tokens.push(JSON.stringify(text.slice(0,textEndIndex)))
        text = text.slice(textEndIndex)
      }
    }
    return `_v(${tokens.join("+")})`
  }
}

function genChildren(el){
  const children = el.children;
  if(children && children.length > 0){
    return `${children.map(c =>gen(c)).join(',')}`
  }else{
    return false
  }
}

function generate(el) {
  const children = genChildren(el);
  let code = `_c("${el.tag}",${el.attrs})${
    children ? `,${children}` : ''
  }`

  return code
}


export function compileToFunction(template) {
  const root = parserHTML(template);
  let code = generate(root);
  console.log(code)
}
