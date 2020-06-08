# pratice

> 用vue.js写的音乐app

## 技术栈

vue2 + vuex + vue-router + webpack + axios + express + Jsonp + stylus + flex


## 项目运行

#### 注意：node 需要 6.0 以上版本

```
git clone https://github.com/OceanFlooor/pratice.git

cd pratice

npm install

npm run dev

```

## 关于接口数据

此项目的所有接口数据都是在QQ音乐上线上抓取

因为接口各不相同因此没有统一封装axios

其中一些跨域采用Jsonp

对于一些后端有对referer以及host校验的接口这里用express进行了反向代理

因为QQ音乐接口隔三差五一变动，因此接口不稳定 QAQ

# 效果演示

[查看demo请戳这里](http://106.14.31.21/music)（请用chrome手机模式预览）

### 移动端扫描下方二维码

<img src="https://github.com/OceanFlooor/pratice/blob/master/static/1591593698.png" width="250" height="250"/>


# 项目布局
```
├─index.html                                    // 入口html文件
├─prod.server.js                                // node服务器相关
├─static
|   ├─.gitkeep
|   └mock.json                                  // mock数据
├─src
|  ├─App.vue                                    // 页面入口文件
|  ├─main.js                                    // 程序入口文件，加载各种公共组件
|  ├─store                                      // vuex
|  |   ├─actions.js                             // 配置actions
|  |   ├─getter.js                              // 配置getters
|  |   ├─index.js                               // 引用vuex，创建store
|  |   ├─mutation-types.js                      // 存放mutations的名称
|  |   ├─mutations.js                           // 配置mutations
|  |   └state.js                                // 定义数据
|  ├─router                                     // 路由
|  |   └index.js
|  ├─components                                 // 主要页面组件
|  |     ├─topList
|  |     |    └topList.vue                      // 搜索前十标签
|  |     ├─tab
|  |     |  └tab.vue                            // tab切换菜单
|  |     ├─suggest
|  |     |    └suggest.vue                      // 模糊查询提示组件
|  |     ├─singer
|  |     |   ├─singer.vue                       // 歌手页面入口组件
|  |     |   ├─singerDetail
|  |     |   |      └singerDetail.vue           // 歌手详情页
|  |     ├─search
|  |     |   └search.vue                        // 搜索页
|  |     ├─recommend
|  |     |     └recommend.vue                   // 推荐页
|  |     ├─rank
|  |     |  └rank.vue                           // 排名页
|  |     ├─player
|  |     |   └player.vue                        // 播放页组件
|  |     ├─m-header
|  |     |    ├─logo@2x.png
|  |     |    ├─logo@3x.png
|  |     |    └m-header.vue                     // header组件
|  |     ├─disc
|  |     |  └disc.vue                           // 专辑详情页
|  ├─common                                     // 公共相关css,js代码
|  |   ├─stylus                                 // css样式文件夹
|  |   |   ├─base.styl
|  |   |   ├─icon.styl
|  |   |   ├─index.styl
|  |   |   ├─mixin.styl
|  |   |   ├─reset.styl
|  |   |   └variable.styl
|  |   ├─js                                     // js文件夹
|  |   | ├─cache.js                             // 搜索历史存储相关
|  |   | ├─config.js                            // 配置选项
|  |   | ├─dom.js                               // dom相关代码
|  |   | ├─jsonp.js                             // jsonp封装
|  |   | ├─mixin.js                             // vue组件mixin
|  |   | ├─singer.js                            // singer页相关逻辑
|  |   | ├─song.js                              // song页相关逻辑
|  |   | ├─uid.js                               // uid生成方法
|  |   | └util.js                               // 常用处理函数
|  |   ├─image
|  |   |   └default.png                         // 默认图片
|  |   ├─fonts                                  // iconfont相关
|  ├─base                                       // 公共组件文件夹
|  |  ├─songList
|  |  |    ├─songList.vue                       // 歌曲列表
|  |  ├─slider
|  |  |   └slider.vue                           // 轮播组件
|  |  ├─search-box
|  |  |     └search-box.vue                     // 搜索框组件
|  |  ├─scroll
|  |  |   └scroll.vue                           // 滚动组件
|  |  ├─progress-circle
|  |  |        └progressCircle.vue              // 环形进度条组件
|  |  ├─progress-bar
|  |  |      └progressBar.vue                   // 进度条组件
|  |  ├─no-result
|  |  |     ├─no-result.vue                     // 无结果提示组件
|  |  ├─musicList
|  |  |     └musicList.vue                      // 音乐列表组件
|  |  ├─loading
|  |  |    ├─loading.gif
|  |  |    └loading.vue                         // 加载提示组件
|  |  ├─listview
|  |  |    └listView.vue                        // 列表组件
|  |  ├─confirm
|  |  |    └confirm.vue                         // 确认框组件
|  ├─assets
|  |   └logo.png
|  ├─api                                        // 接口相关代码
|  |  ├─config.js                               // 接口配置
|  |  ├─rank.js                                 // 排名相关接口
|  |  ├─recommend.js                            // recommend页接口
|  |  ├─search.js                               // 搜索页接口
|  |  ├─singer.js                               // 歌手相关接口
|  |  └song.js                                  // 歌曲相关接口
├─public
|   ├─favicon.ico
|   └index.html
├─config                                        // webpack配置
├─build                                         // webpack配置
|   ├─build.js
|   ├─check-versions.js
|   ├─logo.png
|   ├─utils.js
|   ├─vue-loader.conf.js
|   ├─webpack.base.conf.js                      // express请求反向代理
|   ├─webpack.dev.conf.js
|   └webpack.prod.conf.js
```