import { popTarget, pushTarget } from "./dep";

let id = 0
class Watcher {
  constructor(vm, expOrFn, fn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.fn = fn;
    this.options = options;
    this.id = id ++
    //传入的回调函数放到getter属性上
    this.getter = expOrFn;

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
}

export default Watcher
