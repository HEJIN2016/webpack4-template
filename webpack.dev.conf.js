const merge = require('webpack-merge');
const config = require('./config');
const { port, host } = config.dev.devServer;
const os = require('os');
const webpack = require("webpack");

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const copyWebpackPlugin = require("copy-webpack-plugin");

const LessFunc = require('less-plugin-functions');

const path = require('path');
const portfinder = require("portfinder");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const baseWebpackConfig = require('./webpack.base.conf');

function getIPAddress() {
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
function resolve (dir) {
  return path.join(__dirname, '', dir)
}

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热模块更新
    new MiniCssExtractPlugin({
      filename: ('css/[name].[hash].css'),
      chunkFilename: '[id].[hash].css',
      allChunks: false,
      // ignoreOrder: false, // Enable to remove warnings about conflicting order
      // allChunks: true,
    }),
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false
      },
      sourceMap: true,
      parallel: true
    })
  ],
  watchOptions: {
    ignored: /node_modules/ // 不监听node_modules下的文件
  },
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'js/[name].js',
    publicPath: config.dev.assetsPublicPath
  },
  devtool: "#cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader,{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },config.postCssLoader, {
          loader: 'less-loader',
          options: {
            sourceMap: true,
            plugins: [ new LessFunc() ]     // 实例化
          }
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        },"style-loader",{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, config.postCssLoader
        ]
      }
    ]
  },
  devServer: config.dev.devServer
});
// module.exports = devWebpackConfig;

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = port;
  portfinder.getPort((err, cport) => {
    if (err) reject(err);
    else {
      devWebpackConfig.devServer.port = cport;

      let messages;
      let host = devWebpackConfig.devServer.host;
      if (host === "0.0.0.0") {
        messages = [`Your application is running here: http://${getIPAddress()}:${cport} or http://localhost:${cport}`]
      } else {
        messages = [`Your application is running here: http://${host}:${cport}`]
      }
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages,
        }
      }));
      resolve(devWebpackConfig);
    }
  })
});