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

// 根据js文件名生成Entry名
function getJsEntry (globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -3).replace('/', '_');
}

function resolve (dir) {
  return path.join(__dirname, '', dir)
}

let htmlFiles = glob.sync("src/pages/**/*.html") || [];
let jsFiles = glob.sync("src/pages/**/*.js") || [];

// polyfill和common.js对应的entry
let entry = {
  common: path.join(__dirname, 'src', 'main.js')
};

if (config.polyfill) {
  entry.polyfill = ['babel-polyfill'];
}

let htmlPlugins = [
  new webpack.ProvidePlugin(config.providePlugin),
];

jsFiles.forEach((item, index)=>{
  entry[getJsEntry(item)] = path.resolve(__dirname, item);
});

htmlFiles.forEach((item, index)=>{
  let chunks = [];
  if (entry[getHtmlChunk(item)]) {
    if (config.polyfill) {
      chunks = ["polyfill", "common", getHtmlChunk(item)];
    } else {
      chunks = ["common", getHtmlChunk(item)];
    }

  } else {
    if (config.polyfill) {
      chunks = ["polyfill", "common"];
    } else {
      chunks = ["common"];
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

module.exports = {
  entry,
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.join(__dirname, '', 'src'),
    }
  },
  module: {
    rules: config.commonRules
  },
  plugins: htmlPlugins
};
