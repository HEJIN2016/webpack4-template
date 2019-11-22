const jsSourceMap = true;
const cssSourceMap = true;

module.exports = {
  // 自动全局注入的插件，无须import便可直接使用
  providePlugin: {
    $: "jquery",
    jquery: "jquery",
    jQuery: "jquery",
    axios: "axios",
    // echarts: "echarts"
  },
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    devServer: {
      // contentBase: path.join(__dirname, "src"),
      clientLogLevel: 'warning',
      hot: true,
      compress: true, // 开启gzip压缩
      host: "0.0.0.0",
      port: 3200,
      open: false,
      overlay: true, // 浏览器全屏覆盖错误
      inline: true,
      // quiet: true, // 关闭webpack输出日志
      proxy: {} // 反向代理table
      // publicPath: config.dev.assetsPublicPath
    },
    postCssLoader: {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        sourceMap: true,
        plugins: (loader) => [
          require('postcss-import')({}),
          require('postcss-url')({}),
          // require('postcss-preset-env')(),
          // require('cssnano')(),
          require('autoprefixer')(),
          // require('postcss-px2vw')(postcssPx2vw)
        ]
      },
    }
  },
  build: {
    assetsPublicPath: '/',
    assetsSubDirectory: 'static',
    polyfill: true,
    jsSourceMap,
    cssSourceMap,

    postCssLoader: {
      loader: 'postcss-loader',
      options: {
        sourceMap: cssSourceMap,
        ident: 'postcss',
        plugins: (loader) => [
          require('postcss-import')({}),
          require('postcss-url')({}),
          // require('postcss-preset-env')(),
          require('cssnano')(),
          require('autoprefixer')(),
          require('postcss-px2vw')()
        ]
      },
    }
  },

  commonRules: [
    {
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: ['img:src', 'video:src', 'video:poster', 'source:src']
        }
      }
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]'
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[hash:7].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      }
    }
  ]
};