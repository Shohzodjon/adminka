module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "primary-color": "#de2626",
          "link-color": "#de2626",
          "border-radius-base": "2px"
        },
        javascriptEnabled: true
      }
    }
  },

  chainWebpack: (config) => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end()
  },

  publicPath: process.env.VUE_APP_PREFIX || "/",

  devServer: {
    proxy: {
      "^/api": {
        target: process.env.VUE_APP_API_URL,
        ws: true,
        changeOrigin: true
      }
    }
  }
}
