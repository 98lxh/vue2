class Watcher {
  constructor(vm, expOrFn, fn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.fn = fn;
    this.options = options;

    //传入的回调函数放到getter属性上
    this.getter = expOrFn;

    this.get()
  }
  get() {
    this.getter()
  }
}

export default Watcher
