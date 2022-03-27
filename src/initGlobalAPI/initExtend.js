import { mergeOptions } from "../utils/merge";

export function initExtend(Vue){

  //子类和父类 对应子组件和父组件
  //创建子类继承于父类宽展的时候都扩展到自己的属性上
  Vue.extend = function (extendOptions){
    
    const Sub = function VueComponent(options){
      this._init(options)
    }

    //继承父类
    Sub.prototype = Object.create(this.prototype)
    //这种方式继承会改变子类构造函数 需要手动指回
    Sub.constructor = Sub;

    //子类属性和父类属性做合并
    Sub.options = mergeOptions(this.options,extendOptions)
    Sub.mixin = this.mixin
    Sub.component = this.component
    return Sub
  }
}
