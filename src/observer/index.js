
import { def, isObject } from "../utils/index";
import { arrayMetods } from "./array"
import {Dep} from './dep'


//将数组中每一部分都取出来数据变化也去更新视图
function dependArray(value){
  for(let i = 0;i<value.length;i++){
    const current = value[i];
    current.__ob__ && current.__ob__.dep.depend()

    if(Array.isArray(current)){
      dependArray(current)
    }
  }
}

function defineReactive(target, key, value) {
  let dep = new Dep()

  //这里返回的是一个observer的实例当前这value对应的observer
  const childOb = observe(value);
  return Object.defineProperty(target, key, {
    get() {
      //每个属性都对应着自己的watcher
      if(Dep.target){
        //如果当前有watcher
        dep.depend()
        if(childOb){
          //收集了数组的相关依赖
          childOb.dep.depend()

          //如果数组中还有数组也去收集依赖
          if(Array.isArray(value)){
            dependArray(value)
          }
        }
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
    //数组的依赖
    this.dep = new Dep()
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
    return
  }

  //观测数据
 return new Observer(data)
}
