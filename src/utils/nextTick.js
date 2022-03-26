let callbacks = []

let waiting = false;
function flushCallback() {
  callbacks.forEach(cb => cb())
  waiting = false
  callbacks = []
}

// 多次调用nextTick 如果没有刷新的时候就先放到数组中
// 刷新后更改waiting
export function nextTick(cb) {
  callbacks.push(cb)
  if (waiting === false) {
    setTimeout(flushCallback, 0)
    waiting = true
  }
}
