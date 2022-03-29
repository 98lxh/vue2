
import { generate } from "./generate";
import { parserHTML } from "./parserHTML";

export function compileToFunction(template) {
  console.log(template)
  //解析字符串 将html转换成ast语法树
  const root = parserHTML(template);
  //将ats语法树转换成js语法
  //<div id="app"></div> -> _c("div",{id:app},"")
  let code = generate(root);
  //所有的模板引擎实现都需要new Function + with
  let renderFn = new Function(`with(this){return ${code}}`)

  return renderFn
}
