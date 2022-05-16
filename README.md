# netease-music-uniapp

#### 介绍

Vue3 + vite + pinia + ts 实现网易云音乐小程序、h5 等多端应用，基于 uni-app

#### 效果图（支持夜间模式）

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/01.jpg)

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/02.jpg)

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/03.jpg)

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/04.jpg)

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/05.jpg)

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/06.jpg)

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/07.jpg)

![效果图](http://cdn.zusheng.club/screenshots/netease-music-uniapp/08.jpg)

- [x] 手机号登录
- [x] 账号密码
- [x] 验证码登录
- [x] 注册账号
- [ ] 邮箱登录
- [x] 歌单广场
- [x] 所有榜单
- [x] 全功能播放器
- [x] 代播列表
- [x] 插播列表（优先于播放队列）
- [x] 歌单详情页
- [x] 用户详情页
- [x] 艺人详情页
- [ ] 动态详情页
- [ ] 日推
- [ ] FM
- [ ] 听歌打卡
- [x] 评论详情页，评论点赞，长按复制
- [x] 收藏/取消收藏歌单
- [ ] 保存图片
- [x] 虚拟滚动列表（真有 10000 首歌的歌单）

#### 安装教程

1. git clone https://gitee.com/imzusheng/netease-music-uniapp.git

2. cd netease-music-uniapp

3. npm i 或 yarn

!注意：运行 `微信小程序` 需要修改 `manifest.json` 文件下 `mp-weixin.appid`，运行 `h5` 要注意 `vite.config.ts` 下的 `base` 路径，`src/common/apiService.ts` 下的 baseURL 是自建服务器，短期内不会失效，觉得慢可以换成自己的

#### h5 预览

建议下载后运行微信小程序版本
[https://demo.zusheng.club/uni_music](https://demo.zusheng.club/uni_music)

欢迎交流
本项目仅限学习交流使用, 不得用于商业用途
