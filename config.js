const jsSourceMap = true;
const cssSourceMap = true;

module.exports = {
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