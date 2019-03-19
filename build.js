const fs = require('fs')
const path = require('path')

const babelPluginImportConfig = {
  libraryName: 'react-antd-addons',
  libraryDirectory: '',
  camel2DashComponentName: false,
  style: (name) => {
    const stylePath = path.resolve('node_modules', `${name}.css`)
    console.log(stylePath)
    if (fs.existsSync(stylePath)) {
      return `${name}.css`
    } else return false
  }
}

module.exports = { babelPluginImportConfig }
