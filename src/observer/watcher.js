import { popTarget, pushTarget } from "./dep";

import { queueWatcher } from "./../schedular";

let id = 0
class Watcher {
  constructor(vm, expOrFn, fn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.fn = fn;
    this.options = options;
    this.depsId = new Set()
    this.id = id++
    //传入的回调函数放到getter属性上
    this.getter = expOrFn;
    this.deps = []
    this.get()
  }
  get() {
    pushTarget(this)//把watcher存起来
    this.getter()
    popTarget() //移除watcher
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
    this.get()
  }
}

export default Watcher
