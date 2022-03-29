import { initAssetsRegister } from './assets'
import { ASSETS_TYPE } from './const'
import { initExtend } from './initExtend'
import { initMixin } from './mixin'
export function initGolbalAPI(Vue){
  //整合了全局相关的内容
  Vue.options = {}
  initMixin(Vue)

  //初始化全局过滤器指令都放在options上
  ASSETS_TYPE.forEach(type => {
    Vue.options[type + 's'] = {}
  })

  //_base是Vue的构造函数
  Vue.options._base = Vue
  //注册extend方法
  initAssetsRegister(Vue)
  initExtend(Vue)
}
