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
    if (text) {
      parent.children.push({
        type: 3,
        text
      })
    }
  }

  function advance(len) {
    html = html.slice(len)
  }

  //解析节点的属性
  function parserAttrs(attrs) {
    const attrMap = {};
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      const [attrName, attrValue] = attr.split('=')
      attrMap[attrName] = attrValue
    }
    return attrMap
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

    //得到一个属性的数组
    const attrArr = attrStr ? attrStr.split(' ') : [];
    //解析成一个属性对象
    const attrs = parserAttrs(attrArr);
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
        start(startTagMatch.tagName, start.attrs)
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

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name === 'style') {
      //属性是style转换成对象
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${attr.value},`
  }
  return `{${str.slice(0, str.length - 2)}}`
}

function generate(el) {
  let code = `_c("${el.tag}",${el.attrs && el.attrs.length ? genProps(el.attrs) : 'undefind'})`

  return code
}


export function compileToFunction(template) {

  const root = parserHTML(template);

  let code = generate(root);
  console.log(code)
}
