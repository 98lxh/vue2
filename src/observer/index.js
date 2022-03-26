
import { def, isObject } from "../utils/index";
import { arrayMetods } from "./array"
import {Dep} from './dep'

function defineReactive(target, key, value) {
  let dep = new Dep()
  observe(value);
  return Object.defineProperty(target, key, {
    get() {
      //每个属性都对应着自己的watcher
      if(Dep.target){
        //如果当前有watcher
        dep.depend()
      }
      return value
    },
    set(newValue) {
      if (value === newValue) return
      observe(newValue)
      value = newValue

      dep.notify();//通知依赖的watcher进行更新操作
    }
  })
}

class Observer {
  constructor(value) {
    //缺点:vue2中如果层次过多，那么需要递归的解析对象属性
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      //如果数组下放对象则劫持
      value.__proto__ = arrayMetods
      this.observerArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      const value = data[key]
      defineReactive(data, key, value)
    })
  }

  observerArray(value) {
    value.forEach(v => {
      observe(v)
    })
  }
}

export function observe(data) {
  if (!isObject(data)) {
    return data
  }

  //观测数据
  new Observer(data)
}
