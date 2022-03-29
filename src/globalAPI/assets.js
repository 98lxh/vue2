import { ASSETS_TYPE } from "./const";

export function initAssetsRegister(Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function (id, definition) {
      switch (type) {
        case 'component':
          //使用extned方法 将对象变成构造函数
          //子类(子组件也有可能有component方法)
          definition = this.options._base.extend(definition)
          break;
        case 'filter':
          break
        case 'mixin':
          break
        case 'directive':
          break
      }

      this.options[type + 's'][id] = definition

    }
  })
}
