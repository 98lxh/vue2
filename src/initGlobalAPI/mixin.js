export function mixin(mixin){
  this.options = mergeOptions(this.options,mixin)
}
