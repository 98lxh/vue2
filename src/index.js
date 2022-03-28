import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from './lifecycle'
import { initGolbalAPI } from "./initGlobalAPI/index";
import { compileToFunction } from "./compiler/index";
import { createElm, patch } from "./vdom/patch";
//核心
function Vue(options) {
  //进行初始化
  this._init(options)

}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

initGolbalAPI(Vue)

let vm1 = new Vue({
  data: {
    name: 'hello'
  }
})

let render = compileToFunction(`<div id="app" a="1">
  <div key="1" style="background:red">1</div>
  <div style="background:yellow" key="2">2</div>
  <div style="background:blue" key="3">3</div>
  <div style="background:pink" key="4">4<div>
</div>`)
let vnode = render.call(vm1)
let el = createElm(vnode)
document.body.appendChild(el)

let vm2 = new Vue({
  data: {
    name: 'lxh',
    age: 25
  }
})
let render2 = compileToFunction(`<div id="aaa" b="2">
   <div style="background:pink" key="4">4</div>
   <div  key="3" style="background:red">3</div>
   <div style="background:yellow" key="2">2</div>
   <div style="background:blue" key="1">1</div>
</div>`)
let newVnode = render2.call(vm2)

//新旧节点做比对
setTimeout(() => {
  patch(vnode, newVnode)
}, 1000)
export default Vue
