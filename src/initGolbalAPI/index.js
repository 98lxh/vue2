import { mergeOptions } from "./../utils/index"
export function initGolbalAPI(Vue){
  //整合了全局相关的内容
  Vue.options = {}

  //生命周期的合并策略
  Vue.mixin = function(mixin){
    this.options = mergeOptions(this.options,mixin)
  }

  Vue.mixin({
    a:1,
    beforeCreate(){

    }
  })

  Vue.mixin({
    b:2,
    beforeCreate(){
    }
  })

  console.log(Vue.options)
}
