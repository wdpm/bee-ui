## 在线文档

源码阅读笔记位于：my-notes.md


## npm 安装


``` bash
npm install bee-ui-vue --save
```

## 快速开始

### VUE CLI 3

直接使用 vue cli 快速搭建 vue 开发环境。

``` bash
vue create [app name]

cd [app name]
```

### 全局使用

``` js
// mian.js
import BeeUI from 'bee-ui-vue'

Vue.use(BeeUI)
```

### 按需引入

``` js
// mian.js
import {BeeInput[, ...]} from 'bee-ui-vue'

Vue.use(BeeInput)
```