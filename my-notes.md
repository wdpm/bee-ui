# 笔记

## 注意

在 Vue 2 中:

- 父组件通过 props 将数据传递给子组件。子组件可以将 props 视为本地数据来使用，但是如果父组件的数据发生变化，不会自动更新传递给子组件的
  props。

在 Vue 3 中，props 默认是响应式的：

- 当父组件的 prop 发生变化时，子组件会自动响应这些变化并更新视图。

## 组件阅读记录

基础组件

- [x] select-options
    - [ ] popper
    - [ ] scroll-bar
- [ ] picker 
- [ ] table

弹出层
- [x] alert 这个组件和dialog非常类似，本质不同之处在于，这个是提供一种全局的指令实现，从函数角度出发，而不是从界面template角度考虑。
- [ ] message 缺失 test
- [x] alias 这个UI元素不是很常见
- [ ] `lib/loading/_src/main-loading.vue` 探索SVG动画编辑器与动画设计

## 只运行某个组件的测试

See [scripts/single-test.js](scripts/single-test.js)