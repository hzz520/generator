## 步骤
* npm i // 安装依赖
* npm start // 开启开发模式编译
* npm run build // 打包线上代码
  
## 介绍
* gulpTasks gulp打包任务队列
* gulpfile.js gulp打包默认入口文件
* src 开发文件地址
    * 按照插件开发文档进行开发 
    * 支持async await异步编程、eslint检测、代码及资源压缩
    * @import url('**/*.wxss') // gulp转化为字符串 @import '**/*.wxss'
    * @import '**/*.scss' 将@import路径下的scss打包进入当前文件
    * 
* dist 打包完的小程序插件目录
