export function isUnaryTag(tagName) {
  const unaryTag = ['input', 'br'];
  return unaryTag.includes(tagName)
}
