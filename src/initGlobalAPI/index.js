import { mergeOptions } from "../utils/merge"
import { mixin } from "./mixin"
export function initGolbalAPI(Vue){
  //整合了全局相关的内容
  Vue.options = {}

  Vue.mixin = mixin
}
