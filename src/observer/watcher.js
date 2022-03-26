import { popTarget, pushTarget } from "./dep";

let id = 0
class Watcher {
  constructor(vm, expOrFn, fn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.fn = fn;
    this.options = options;
    this.depsId = new Set()
    this.id = id ++
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
  update(){
    this.get()
  }
  addDep(dep){
    //watcher里不能放重复的dep
    //dep也不能放重复的watcher
    let id = dep.id
    if(!this.depsId.has(id)){
      this.depsId.add(id)
      this.deps.push(dep)

      dep.addSub(this)
    }
  }
}

export default Watcher
