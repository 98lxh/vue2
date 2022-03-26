let id = 0
export class Dep {
  constructor(){
    this.id = id ++
    this.subs = []
  }
  //依赖收集
  depend(){
    //观察者模式
  
    //让watcher记住当前dep
    Dep.target.addDep(this)
    this.subs.push(Dep.target)
  }

  addSub(watcher){
    this.subs.push(watcher)
  }

  //依赖更新
  notify(){
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

//静态属性
Dep.target

let stack = [];
//将watcher保留 和移除
export function pushTarget(watcher){
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget(){
  stack.pop();
  Dep.target = stack[stack.length - 1]
}
