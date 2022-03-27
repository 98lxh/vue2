const strats = {}

//生命周期的合并策略
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDistory',
  'distoryed'
]


LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

function mergeHook(parentVal,childVal){
  if(childVal){
    if(parentVal){
      //父子选项都存在
      //返回一个数组 子选项在前:先执行子选项
      return parentVal.concat(childVal)
    }else{
      //父选项不存在 返回子选项
      return [childVal]
    }
  }else{
    //如果子选项不存在 直接返回父选项
    return parentVal
  }
}


//组件的合并策略
strats.components = mergeAssets
function mergeAssets(parentVal,childVal){
  //基于父类创建出一个原型 res.__proto__
  //这样合并完成后子组件就会先找自己的components在去沿着原型链找父类
  const res = Object.create(parentVal);
  if(childVal){
    for(let key in childVal){
      res[key] = childVal
    }
  }
  return res
}

export function mergeOptions(parent,child){
  const options = {};

  for(let key in parent){
    mergeField(key)
  }

  for(let key in child){
    //如果已经合并过的就没有必要在合并了
    if(!options.hasOwnProperty[key]){
      mergeField(key)
    }
  }

  //默认的合并策略 但是有些属性合并有特殊的方式比如:生命周期
  function mergeField(key){
    if(strats[key]){
      //当前有符合合并策略的选项
      return options[key] = strats[key](parent[key],child[key])
    }
    if(typeof parent[key]  === 'object' && typeof child[key] === 'object'){
      //父子选项都是object
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    }else if(child[key] == null){
      //子选项为null 以父选项为准   
      options[key] = parent[key]
    }else{
      //父子都有该选项 且父子选项都不是object类型 以子选项为准
      options[key] = child[key]
    }
  }

  return options
}
