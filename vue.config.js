const markdownRender = require('markdown-it')()

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/bee-ui/latest' : '/',
  parallel: process.env.NODE_ENV !== 'production',
  chainWebpack: config => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
        use: [
          [require('markdown-it-container'), 'demo', {
            validate: function (params) {
              return params.trim().match(/^demo\s*(.*)$/)
            },

            render: function (tokens, idx) {
              if (tokens[idx].nesting === 1) {
                // 1. 获取第一行的内容使用 markdown 渲染 html 作为组件的描述
                let demoInfo = tokens[idx].info.trim().match(/^demo\s+(.*)$/)
                let description = (demoInfo && demoInfo.length > 1) ? demoInfo[1] : ''
                let descriptionHTML = description ? markdownRender.render(description) : ''
                // 2. 获取代码块内的 html 和 js 代码
                let content = tokens[idx + 1].content

                // 3. 使用自定义开发组件【DemoBlock】来包裹内容并且渲染成案例和代码示例
                return `<demo-block>
                <div class="source" slot="source">${content}</div>
                 ${descriptionHTML}
                 <div class="highlight" slot="highlight">`
              } else {
                return '</div></demo-block>\n'
              }
            }
          }]
        ]
      })
  }
}
