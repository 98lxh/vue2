import { popTarget, pushTarget } from "./dep";

import { queueWatcher } from "./../schedular";



let id = 0
class Watcher {
  constructor(vm, expOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    //看看是不是用户watcher
    this.user = !!options.user

    this.options = options;
    this.depsId = new Set()
    this.id = id++

    //传入的回调函数放到getter属性上(expOrFn有可能是字符串:用户watcher)
    if (typeof expOrFn === 'string') {
      //将表达式转换成函数 数据取值时进行依赖收集
      this.getter = function () {
        let path = expOrFn.split('.')
        let obj = vm;
        //有可能是是xx.xx这种多层嵌套的
        return path.reduce((prev, next) => prev[next], obj)
      }
    } else {
      this.getter = expOrFn;
    }

    this.deps = []

    this.value = this.get() //默认初始化要取值
  }
  get() {
    pushTarget(this)//把watcher存起来
    //新的值
    const value = this.getter()
    popTarget() //移除watcher
    return value
  }
  addDep(dep) {
    //watcher里不能放重复的dep
    //dep也不能放重复的watcher
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)

      dep.addSub(this)
    }
  }
  update() {
    //等待一起更新 因为每次调用update的时候都放入了watcher
    // this.get()
    queueWatcher(this)
  }

  run() {
    let newValue = this.get()
    let oldValue = this.value
    //保证上一次的新值是下一次的旧值
    this.value = newValue
    if (this.user) {
      this.callback.call(this.vm, newValue, oldValue)
    }
  }
}

export default Watcher
