
import { isUnaryTag } from "../utils/isUnaryTag";


//<input v-model:xx="xxx" type="xx" />
function parserVModel(modelExp, typeExp, tag) {
  const type = typeExp?.split("=")[1].replace(/"/g, "") || 'text'
  let [_, modelValue] = modelExp.split("=")
  modelValue = modelValue.replace(/"/g, "")
  let vModel = {}
  if (tag === 'input') {
    //input输入框 或者checkbox
    if (type === 'text') {
      //文本输入框
      vModel = { tag, type: 'text', value: modelValue }
    } else if (type === 'checkbox') {
      //checkbox
      vModel = { tag, type: 'checkbox', value: modelValue }
    }
  } else if (tag === 'textarea') {
    vModel = { tag, value: modelValue }

  } else if (tag === 'select') {
    vModel = { tag, value: modelValue }
  }

  return vModel
}


//v-bind:xx="xxx"
function parserVBind(bindingExp) {
  bindingExp = bindingExp.split(":")[1];
  const [bindingKey, bindingValue] = bindingExp.split("=");

  return {
    [bindingKey]: bindingValue.replace(/"/g, "")
  }

}

//v-on:click="xx"
function parserVOn(onExp) {
  onExp = onExp.split(":")[1];
  const [event, callback] = onExp.split("=");

  return {
    [event]: callback.replace(/"/g, "")
  }
}

export function parserHTML(html) {

  let root = null;
  const stack = [];

  //将解析后的结果组合成ast树 -> stack
  function createAstElement(tagName, attrs, directive) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      parent: null,
      attrs,
      directive
    }
  }


  function start(tagName, attributes, directive) {
    const parent = stack[stack.length - 1]
    const element = createAstElement(tagName, attributes, directive)
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
    attrs = attrs.filter(a => a)
    let attrStr = "";
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      let [attrName, attrValue] = attr.split('=')
      attrValue = attrValue.replace(/"/g, '')
      if (attrName === 'style') {
        let obj = {};
        attrValue.split(';').forEach(item => {
          let [key, value] = item.split(':')
          if (key) obj[key] = value.replace(/\s+/g, "");
        })
        attrValue = obj
      }
      attrStr += `${attrName}:${JSON.stringify(attrValue)},`
    }

    return `{${attrStr.slice(0, -1)}}`
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
    const styleStartIdx = attrStr.indexOf('style')
    let styleStr;
    if (styleStartIdx !== -1) {
      //style开始到结尾的字符串
      styleStr = attrStr.slice(styleStartIdx, attrStr.length)
      const styleEndIndex = styleStr.lastIndexOf('"')
      if (styleEndIndex !== -1) {
        styleStr = styleStr.slice(0, styleEndIndex)
        attrStr = attrStr.split(styleStr + '"').join("")
      }
    }

    const attrArr = attrStr ? attrStr.trim().split(' ') : [];
    const directive = {}
    //处理v-model指令
    let vModel = attrArr.findIndex(attr => attr.indexOf('v-model') !== -1)
    if (vModel !== -1) {
      //找下这个节点的type
      const type = attrArr.findIndex(attr => attr.indexOf('type') !== -1)
      directive.vModel = parserVModel(attrArr[vModel], attrArr[type], tagName)
      attrArr.splice(vModel, 1)
    }
    //处理v-on指令
    let vOn = attrArr.findIndex(attr => attr.indexOf('v-on') !== -1)
    if (vOn !== -1) {
      directive.vOn = parserVOn(attrArr[vOn])
      attrArr.splice(vOn, 1)
    }

    //处理v-bind指令
    let vBind = attrArr.findIndex(attr => attr.indexOf('v-bind') !== -1)
    if (vBind !== -1) {
      directive.vBind = parserVBind(attrArr[vBind])
      attrArr.splice(vBind, 1)
    }


    //解析成一个属性字符串
    const attrs = parserAttrs([...attrArr, styleStr])
    return {
      tagName,
      directive,
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

    //解析注释节点
    let nodesStart = html.indexOf('<!--');
    if (nodesStart === 0) {
      let nodesEnd = html.indexOf('-->');
      advance(nodesEnd + 3)
      continue
    }


    let textEnd = html.indexOf('<');
    //解析到开头
    if (textEnd === 0) {
      //解析开始标签
      const startTagMatch = parserStartTag(html);
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs, startTagMatch.directive)

        if (isUnaryTag(startTagMatch.tagName)) {
          //自闭合标签 直接出栈
          end(startTagMatch.tagName)
        }
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
