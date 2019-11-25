# webpack4-template

> webpack4多页应用模板开发框架

## 技术栈

webpack4 + Es6 + less + Babel7

## 运行

```
#安装依赖
npm install

#本地开发
npm run dev

#生产环境
npm run build

#运行地址
http://localhost:3200
```

## 目录结构
```
/webpack4-template/

├── dist                               打包后的文件
├── src                                存放源码
│   ├── assets                         资源目录 assets 用于组织未编译的静态资源如 LESS、SASS 或 JavaScript
│   ├── pages                          多页面html目录，每个html会自动引入对应的同目录他那个前缀名js
│   ├── style                          存放样式文件
│   ├── main.js                      公共js文件，每个页面都会调用此js    
│   ├── js                           存放js文件    
├── static                              静态文件目录,此类文件不会被Webpack 进行构建编译处理
                                          服务器启动的时候，该目录下的文件会映射至应用的根路径 /static 下
│   ├── ....
├── .babellrc                          babel配置文件
├── node_modules                        Node依赖
├── .browserslistrc                      postcss可支持的浏览器配置
├── config.js                            webpack配置文件
├── README.md                           README
├── webpack.base.conf.js                   build时的webpack配置
├── webpack.dev.conf.js               dev时的webpack配置
```
