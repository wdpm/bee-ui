# 笔记



[Yuumi UI](https://dwyw.github.io/yuumi-ui-vue/latest/t) 是 bee-ui 的后继者，使用Vue 3.x，组件实现有所差异。

| 组件                  | bee-ui | Yuumi UI    |
| --------------------- | ------ | ----------- |
| icon 图标             | √      | √           |
| button 按钮           | √      | √           |
| input 输入框          | √      | √           |
| NumberInput 计数器    |        | √           |
| select 选框           | √      | √           |
| radio 单选            | √      | √           |
| checkbox 多选         | √      | √           |
| switch 开关           | √      | √           |
| picker 选择框         | √      |             |
| TimePicker 时间选择器 |        | √           |
| DatePicker 时间选择器 |        | √           |
| table 表格            | √      | √           |
| Warning 警告框        |        | √           |
| Slider 滑块           |        | √           |
| step 步骤条           | √      | √           |
| tab 选项卡            | √      | √           |
| dialog 窗口           | √      | √           |
| alert 对话            | √      | √           |
| message 消息          | √      | √           |
| notification 通知     | √      | √           |
| tooltip 文字提示      | √      | √           |
| drawer 抽屉           | √      | √           |
| RatioRect等比矩形     |        | √           |
| RatioImage等比图片    |        | √           |
| alias 别名            | √      |             |
| cascader 级联选择     | √      |             |
| pagination 分页       | √      | √           |
| divider 分割线        |        | √           |
| breadcrumb 面包屑     | √      |             |
| loading 加载          | √      | √           |
| empty 空内容          | √      | √           |
| scrollbar 滚动区域    | √      |             |
| tree 树形组件         | √      | √           |
| Navs侧边栏菜单组件    |        | √（很一般） |



## 注意

在 Vue 2 中:

- 父组件通过 props 将数据传递给子组件。子组件可以将 props 视为本地数据来使用，但是如果父组件的数据发生变化，不会自动更新传递给子组件的
  props。

在 Vue 3 中，props 默认是响应式的：

- 当父组件的 prop 发生变化时，子组件会自动响应这些变化并更新视图。

## 组件阅读TODO

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
- [ ] scrollbar
- [ ] tree

## 增强实现

- [ ] loading
  - [ATOM Loading Effect Example](https://www.cssscript.com/demo/atom-loading-effect/)
- [ ] skeleton 
  - https://github.com/amsrafid/js-skeleton-loader based on js
  - https://dgknca.github.io/css-skeletons/ based on css
  - https://github.com/nullilac/skeleton-screen-css based on css

  
## 只运行某个组件的测试

See [scripts/single-test.js](scripts/single-test.js)