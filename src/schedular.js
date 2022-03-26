let queue = [];
let has = {};
import { nextTick } from "./utils/nextTick";

function flushSchedularQueue(){
  queue.forEach(watcher => watcher.run())
  queue = [] //下一次可以继续执行
  has = {}
}

export function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true


    //宏任务和微任务向下兼容
    //Vue.nextTick = promise.then -> mutationObserver -> setImmediate -> setTimeout
    nextTick(flushSchedularQueue)
  }
}
