import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from './lifecycle'
import { initGolbalAPI } from "./initGlobalAPI/index";
import { stateMixin } from "./state";

//核心
function Vue(options) {
  //进行初始化
  this._init(options)

}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGolbalAPI(Vue)
stateMixin(Vue)


// import { compileToFunction } from "./compiler/index";
// import { createElm, patch } from "./vdom/patch";
// let vm1 = new Vue({
//   data: {
//     name: 'hello'
//   }
// })

// let render = compileToFunction(`<div id="app" a="1">
//   <div style="background:red" key="A">A</div>
//   <div style="background:yellow" key="B">B</div>
//   <div style="background:blue" key="C">C</div>
// </div>`)
// let vnode = render.call(vm1)
// let el = createElm(vnode)
// document.body.appendChild(el)

// // < div style = "background:pink" key = "Q" > Q</div >
// //  <div  style="background:red"  key="A">A</div>
// //  <div style="background:yellow" key="F">F</div>
// //  <div style="background:blue" key="C">C</div>
// //  <div style="background:skyblue" key="N">N</div>

// let vm2 = new Vue({
//   data: {
//     name: 'lxh',
//     age: 25
//   }
// })
// let render2 = compileToFunction(`<div id="aaa" b="2">
//   <div style="background:blue" key="C">C</div>
//   <div style="background:yellow" key="B">B</div>
//   <div style="background:red" key="A">A</div>
// </div>`)
// let newVnode = render2.call(vm2)

// //新旧节点做比对
// setTimeout(() => {
//   patch(vnode, newVnode)
// }, 10000)
export default Vue
