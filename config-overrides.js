const {override,addWebpackAlias} = require('customize-cra')
const path = require("path")

module.exports = override(
    // override重写模块， 传入重写配制。
    // 向webpack中添加别名->  将当前路径结合path模块，重新设置路径名称。
    addWebpackAlias({
        '@':path.resolve(__dirname,'src'),
        'Page':path.resolve(__dirname,'src/Page'),
        'Router':path.resolve(__dirname,'src/Router'),
        'Services':path.resolve(__dirname,'src/Services'),
        'Components':path.resolve(__dirname,'src/Components'),
        'Common':path.resolve(__dirname,'src/Common'),
        'Assets':path.resolve(__dirname,'src/Assets'),
        'Utils':path.resolve(__dirname,'src/Utils')
    })
)