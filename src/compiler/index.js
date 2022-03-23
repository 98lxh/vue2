function parserHTML(html) {
  function start(tagName, attribute) {
    console.log(tagName,'start')
  }

  function end(tagName) {
    console.log(tagName,'end')
  }

  function chars(text) {
    console.log(text,'chars')
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
    if(html.indexOf('</') === 0) return false
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
    const tagName = html.slice(tagStart + 1,tagEnd);
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
        start(startTagMatch.tagName,start.attrs)
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
    if(textEnd > 0){
      text = html.slice(0,textEnd);
    }

    if(text){
      chars(text)
      advance(text.length)
    }
  }
}
export function compileToFunction(template) {

  parserHTML(template)
}
