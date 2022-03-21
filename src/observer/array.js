const oldArrayMethods = Array.prototype;
export const arrayMetods = Object.create(oldArrayMethods);


const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'splice',
  'reverse'
]

methods.forEach(method => {
  arrayMetods[method] = function (...args) {
    //调用原生的数组方法
    const result = oldArrayMethods[method].apply(this, args)
    let inserted;
    let ob = this.__ob__;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }

    if (inserted) {
      ob.observerArray(inserted)
    }

    return result
  }
})
