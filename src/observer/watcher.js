import { popTarget, pushTarget } from "./dep";

import { queueWatcher } from "./../schedular";



let id = 0
class Watcher {
  constructor(vm, expOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    //看看是不是用户watcher
    this.user = !!options.user
    //看看是不是懒执行 计算属性watcher
    this.lazy = !!options.lazy
    //标记计算属性watcher的值是不是脏值
    this.dirty = !!options.lazy
    this.options = options
    //watcher 对应的dep id的集合
    this.depsId = new Set()
    //watcher的id 用来去重
    this.id = id++
    //watcher对应的dep依赖
    this.deps = []

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

    //懒执行初始化的时候就不执行
    this.value = this.lazy ? undefined : this.get() //默认初始化要取值
  }
  get() {
    pushTarget(this)//把watcher存起来
    //新的值
    const value = this.getter.call(this.vm)
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
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
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

  //计算的getter执行
  evaluate() {
    //设置dirty标记为非脏值 计算属性的缓存就是这样实现的
    this.dirty = false
    this.value = this.get()
  }


  //这里主要是computed对应的依赖只收集了计算属性watcher 但是这些依赖也应该收集渲染watcher
  depend(){
    let i = this.deps.length;
    while(i--){
      this.deps[i].depend()
    }
  }
}

export default Watcher
