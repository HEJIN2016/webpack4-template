const path = require('path');
const babelPolyfill = require('babel-polyfill');
const glob = require('glob');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const LessFunc = require('less-plugin-functions');

const config = require('./config');

// 根据html文件名生成chunk名
function getHtmlChunk(globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -5).replace('/', '_');
}

// 根据js文件名生成chunk名
function getJsChunk (globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -3).replace('/', '_');
}

function resolve (dir) {
  return path.join(__dirname, '', dir)
}

let htmlFiles = glob.sync("src/pages/**/*.html") || [];
let jsFiles = glob.sync("src/pages/**/*.js") || [];

// polyfill和common.js对应的entry
let entry = {
  polyfill: ['babel-polyfill'],
  vendor: path.join(__dirname, 'src', 'main.js')
};

let htmlPlugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jquery: "jquery",
    jQuery: "jquery",
    axios: "axios"
  }),

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
  ])
];

jsFiles.forEach((item, index)=>{
  entry[getJsChunk(item)] = path.resolve(__dirname, item);
});

htmlFiles.forEach((item, index)=>{
  let chunks = [];
  if (entry[getHtmlChunk(item)]) {
    if (config.build.polyfill) {
      chunks = ["polyfill", "vendor", getHtmlChunk(item)];
    } else {
      chunks = ["vendor", getHtmlChunk(item)];
    }

  } else {
    if (config.build.polyfill) {
      chunks = ["polyfill", "vendor"];
    } else {
      chunks = ["vendor"];
    }
  }
  htmlPlugins.push(new htmlWebpackPlugin({
    template: item,
    filename: item.match(/src\/pages\/(.+)/)[1],
    favicon:'./src/assets/favicon.ico',
    inject: true,
    chunks,
    chunksSortMode: 'manual',
    minify: {
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      truecollapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true
    }
  }))
});
htmlPlugins.push(
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
);

module.exports = {
  entry,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: ('js/[name].[chunkhash].js'),
    chunkFilename: ('js/[id].[chunkhash].js'),
    publicPath: config.build.assetsPublicPath
  },
  devtool: "#source-map",
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.join(__dirname, '', 'src'),
    }
  },
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
        },config.build.postCssLoader, {
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
          },"style-loader",{
            loader: 'css-loader',
            options: {
              sourceMap: config.build.cssSourceMap
            }
          }, config.build.postCssLoader
        ]
      }
    ].concat(config.commonRules)
  },
  plugins: htmlPlugins
};
