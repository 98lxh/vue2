
import { compileToFunction } from "./compiler/index";
import { initState } from "./state";

import { callHook, mountComponent } from "./lifecycle"
import { mergeOptions } from "./utils/index";
import { nextTick } from "./utils/nextTick";

//在原型添加一个init方法
export function initMixin(Vue) {
  //初始化流程
  Vue.prototype._init = function (options) {

    //数据劫持
    const vm = this;
    //将用户传递的和全局的做合并
    vm.$options = mergeOptions(vm.constructor.options, options);

    //这里调用里beforeCreate 这个阶段合并了选项 但是还没有执行initState 所有数据还没有被观察
    callHook(vm, "beforeCreate")
    //初始化状态
    initState(vm);
    //这里调用里created 已经初始化了状态 可以访问响应式数据 以及其它类似computed methods ..的选项也已经完成了初始化
    callHook(vm, "created")

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

  //用户内部调用的nextTick
  Vue.prototype.$nextTick = nextTick
}
