import { mergeOptions } from "../utils/merge";

export function initExtend(Vue) {

  //子类和父类 对应子组件和父组件
  //创建子类继承于父类扩展展的时候都扩展到自己的属性上
  let cid = 0;
  Vue.extend = function (opts) { // 产生一个基于vue的子类
    // 并且身上应该有父类的所有功能 
    const Super = this
    const Sub = function VueComponent(options) {
      this._init(options);
    }
    
    // 原型继承
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(Super.options, opts);
    Sub.cid = cid++
    return Sub;
  }
}
