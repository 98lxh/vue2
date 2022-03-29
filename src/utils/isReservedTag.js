export function isReservedTag(tagName) {
  const reservedTag = 'div,p,input,select';
  const has = {};

  reservedTag.split(",").forEach(tag => {
    has[tag] = true
  })

  return has[tagName]
}
