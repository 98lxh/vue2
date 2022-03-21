//判断是否为一个对象
export function isObject(value) {
  return typeof value === 'object' && value !== null
}


export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value
  })
}
