
import { compileToFunction } from "./compiler/index";
import { initState } from "./state";

import { mountComponent } from "./lifecycle"
import { mergeOptions } from "./utils/index";

//在原型添加一个init方法
export function initMixin(Vue) {
  //初始化流程
  Vue.prototype._init = function (options) {

    //数据劫持
    const vm = this;
    //将用户传递的和全局的做合并
    vm.$options = mergeOptions(vm.constructor.options,options);

    //初始化状态
    initState(vm);

    if (vm.$options.el) {
      //数据挂载到模板 
      vm.$mount(vm.$options.el);
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    //模板转换成渲染函数
    if (!options.render) {
      //没有render找template
      let template = options.template;
      if (!template && el) {
        //没有template 取el的内容作为模板
        template = el.outerHTML
        let render = compileToFunction(template);
        options.render = render
      }
    }

    mountComponent(vm, el);
  }
}
