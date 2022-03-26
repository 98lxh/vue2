import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from './lifecycle'
import { initGolbalAPI } from "./initGolbalAPI/index";
//核心
function Vue(options) {
  //进行初始化
  this._init(options)

}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

initGolbalAPI(Vue)
export default Vue
