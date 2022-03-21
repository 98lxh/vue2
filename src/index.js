import { initMixin } from "./init";
//核心
function Vue(options) {
  //进行初始化
  this._init(options)

}

initMixin(Vue)

export default Vue
