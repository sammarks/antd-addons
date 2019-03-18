const nodeExternals = require('webpack-node-externals')

module.exports = {
  options: {
    output: '.'
  },
  use: [
    '@neutrinojs/standardjs',
    ['@neutrinojs/react-components', {
      minify: {
        babel: false
      }
    }],
    (neutrino) => {
      neutrino.config.externals([nodeExternals(), (context, request, callback) => {
        if (Object.keys(neutrino.options.mains).filter((mainKey) => {
          return request === `./${mainKey}`
        }).length > 0) {
          return callback(null, `commonjs ${request}`)
        }
        callback()
      }])
      neutrino.config.module.rule('compile').use('babel').tap(options => {
        const decoratorsPlugin = require.resolve('babel-plugin-transform-decorators-legacy')
        const classPropertiesPlugin = require.resolve('babel-plugin-transform-class-properties')
        options.plugins.unshift([require.resolve('babel-plugin-import'), {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true
        }])
        options.plugins.unshift(decoratorsPlugin, classPropertiesPlugin)

        return options
      })
    },
    ['@neutrinojs/jest', {
      setupFiles: [
        '<rootDir>/test/jest_setup.js'
      ],
      setupTestFrameworkScriptFile: '<rootDir>/test/jest_framework_setup.js'
    }]
  ]
};
