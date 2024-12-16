const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  publicPath: import.meta.env.NODE_ENV === 'production'
    ? '/web-app/'
    : '/'
}