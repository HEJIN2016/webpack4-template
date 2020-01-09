const merge = require('webpack-merge');
const config = require('./config');
const baseWebpackConfig = require('./webpack.base.conf');
const path = require('path');

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const LessFunc = require('less-plugin-functions');

function resolve (dir) {
  return path.join(__dirname, '', dir)
}

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: ('js/[name].[chunkhash].js'),
    chunkFilename: ('js/[id].[chunkhash].js'),
    publicPath: config.build.assetsPublicPath
  },
  devtool: config.build.jsSourceMap?"#source-map":false,
  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: ('css/[name].[hash].css'),
      chunkFilename: '[id].[hash].css',
      // ignoreOrder: false, // Enable to remove warnings about conflicting order
      // allChunks: true,
    }),
    // copy custom static assets
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        compress: {
          // drop_console: true // 删除console语句
        },
        output: {
          // comments: false,
          beautify: false
        }
      },
      sourceMap: config.build.jsSourceMap,
      parallel: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
        // include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader,{
          loader: 'css-loader',
          options: {
            sourceMap: config.build.cssSourceMap
          }
        },config.postCssLoader, {
          loader: 'less-loader',
          options: {
            sourceMap: config.build.cssSourceMap,
            plugins: [ new LessFunc() ]     // 实例化
          }
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        },{
          loader: 'css-loader',
          options: {
            sourceMap: config.build.cssSourceMap
          }
        }, config.postCssLoader
        ]
      }
    ]
  }
});