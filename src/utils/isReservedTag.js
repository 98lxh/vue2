export function isReservedTag(tagName) {
  const reservedTag = 'div,p,input,select,button,option,br,li,span,ul';
  const has = {};

  reservedTag.split(",").forEach(tag => {
    has[tag] = true
  })

  return has[tagName]
}
