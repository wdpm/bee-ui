export default function (vNode) {
  // vNode.componentOptions.propsData 存储的是实际传递给组件的属性值
  let _component = new vNode.componentOptions.Ctor(vNode.componentOptions.propsData)

  //  refer https://vuejs.org/api/component-instance.html#options
  // 这个 $options 对象暴露了当前组件的已解析选项，并且会是以下几种可能来源的合并结果：
  // 1. 全局 mixin
  // 2. 组件 extends 的基组件
  // 3. 组件级 mixin
  // 它通常用于支持自定义组件选项。
  return _component.$options._propKeys.reduce((acc, key) => {
    // 值不为空就merge进acc
    if (_component.$options[key] !== undefined) {
      acc[key] = _component.$options[key]
    }

    return acc
  }, _component._props)
}
