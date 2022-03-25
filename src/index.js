import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from './lifecycle'
//核心
function Vue(options) {
  //进行初始化
  this._init(options)

}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

export default Vue
