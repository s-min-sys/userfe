const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  devServer: {
    proxy: {
      "/grpcservicer": {
        target: "http://127.0.0.1:13333",
        changeOrigin: true,
        pathRewrite: {
          "^/grpcservicer": ""
        },
        "secure": false
      },
      "/oauth": {
        target: "http://127.0.0.1:13334",
        changeOrigin: true,
        "secure": false
      },
    }
  }
})
