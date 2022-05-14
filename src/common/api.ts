/*
 * @Author: zusheng
 * @Date: 2022-04-10 23:39:53
 * @LastEditTime: 2022-05-14 19:50:39
 * @Description: api文件
 * @FilePath: \uni-preset-vue-vite-ts\src\common\api.ts
 */

// 'https://netease-cloud-music-f4u1p2cjb-imzusheng.vercel.app'

export default {
  // 未分类

  // 获取APP首页数据
  GET_HOME_PAGE: '/homepage/block/page',
  // 获取首页入口按钮数据
  GET_HOME_BALL: '/homepage/dragon/ball',

  // 所有榜单详情
  GET_TOPLIST_DETAIL: '/toplist/detail',

  // 获取banner图片
  GET_BANNER: '/banner?type=0',
  // dj banner
  GET_DJ_BANNER: '/dj/banner',

  // 评论相关
  COMMENT: {
    // 新版评论接口
    GET_COMMENT_NEW: '/comment/new',
    // 点赞
    GET_COMMENT_LIKE: '/comment/like',
    // 楼层评论
    GET_COMMENT_FLOOR: '/comment/floor'
  },

  // 登录页
  LOGIN: {
    // 发送验证码
    GET_SEND_CODE: '/captcha/sent',
    // 校验验证码
    GET_VERIFY_CODE: '/captcha/verify',
    // 登录
    GET_LOGIN: '/login/cellphone',
    // 注册
    GET_REGISTER: '/register/cellphone'
  },

  // 用户相关
  USER: {
    // 用户信息
    GET_USER_DETAIL: '/user/detail',

    // 获取用户歌单
    GET_USER_PLAYLIST: '/user/playlist',

    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    GET_USER_SUB_COUNT: '/user/subcount',

    // 获取账号信息
    GET_ACCOUNT: '/user/account'
  },

  // 搜索相关
  SEARCH: {
    // type: 搜索类型；默认为 1 即单曲
    MATCH_TYPE: {
      单曲: 1,
      专辑: 10,
      歌手: 100,
      歌单: 1000,
      用户: 1002,
      MV: 1004,
      歌词: 1006,
      电台: 1009,
      视频: 1014,
      综合: 1018,
      声音: 2000
    },
    // 搜索
    GET_SEARCH: '/search',
    // 搜索建议
    GET_SEARCH_SUGGEST: '/search/suggest',
    // 最佳结果
    GET_SEARCH_MATCH: '/search/multimatch'
  },

  // 电台/播客相关
  DJ: {
    // 电台详情 rid
    GET_DJ_DETAIL: '/dj/detail',

    // 播放清单 rid 似乎电台和电台节目都可以通用
    GET_DJP: '/dj/program',

    // 电台节目-详情-单条(传电台节目内单曲ID) id
    GET_DJP_DETAIL: '/dj/program/detail',

    // 电台节目-个性推荐
    GET_HOT_DJP: '/personalized/djprogram',

    // 电台节目-推荐
    GET_RECOMMENDS_DJP: '/program/recommend',

    // 电台-个性推荐
    GET_RECOMMENDS_DJ: '/dj/personalize/recommend',

    // 独家精选推荐（不知道是什么分类）
    GET_RECOMMENDS_PRIVATE: '/personalized/privatecontent/list'
  },

  // 单曲
  SONG: {
    // 新歌速递
    GET_NEW_SONGS: '/top/song',
    // 新歌-个性推荐
    GET_PERSON_NEWSONG: '/personalized/newsong',
    // 单曲详情
    GET_SONG_DETAIL: '/song/detail',
    // 单曲url
    GET_SONG_URL: '/song/url'
  },

  // 专辑相关
  ALBUM: {
    // 获取专辑信息
    GET_ALBUM_DETAIL: '/album',

    // 最新专辑
    GET_NEW_ALBUM: '/album/newest',

    // 获取专辑所有歌曲
    GET_ALBUM_All: '/album/track/all'
  },

  // 歌手、艺人相关
  ART: {
    // 热门歌手
    GET_HOT_ARTISTS: '/top/artists',
    // 歌手MV
    GET_ARTIST_MV: '/artist/mv',
    // 歌手视频
    GET_ARTIST_VIDEO: '/artist/video',
    // 歌手信息
    GET_ARTIST_DETAIL: '/artist/detail',
    // 歌手粉丝
    GET_ARTIST_FANS: '/artist/follow/count',
    // 歌手专辑
    GET_ARTIST_ALBUM: '/artist/album',
    // 相似歌手
    GET_ARTIST_SIMI: '/simi/artist',
    // 歌手热门单曲
    GET_ARTIST_SONG: '/artists',

    // 歌手排行榜 type : 地区 1: 华语 2: 欧美 3: 韩国 4: 日本
    GET_TOPLIST_ARTIST: '/toplist/artist'
  },

  // 歌单相关
  PLAYLIST: {
    // 收藏歌单
    GET_PLAYLIST_SUBSCRIBE: '/playlist/subscribe',
    // 获取歌单所有分类
    GET_PLAYLIST_CATLIST: '/playlist/catlist',
    // 推荐歌单
    GET_RECOMMENDS: '/personalized',
    // 歌单分类
    GET_PLAYLIST_TOP: '/top/playlist',
    // 歌单详情
    GET_PLAYLIST_DETAIL: '/playlist/detail',
    // 获取热门歌单分类
    GET_PLAYLIST_HOT: '/playlist/hot',
    // 获取精品歌单
    GET_PLAYLIST_HQ: '/top/playlist/highquality'
  },

  // MV相关
  MV: {
    // MV排行
    GET_TOP_MV: '/top/mv',
    // 最新MV
    GET_NEW_MV: '/mv/first',
    // 推荐MV
    GET_RECOMMENDS_MV: '/personalized/mv',
    // MV详情
    GET_MV_DETAIL: '/mv/detail',
    // MV详情
    GET_MV_URL: '/mv/url',
    // MV 点赞评论数量
    GET_MV_INFO: '/mv/detail/info',
    // MV 评论列表
    GET_MV_COMMENT: '/comment/mv',
    // MV 相似推荐
    GET_MV_SIMI: '/simi/mv'
  },

  // 视频相关
  VIDEO: {
    // 推荐视频
    GET_RECOMMENDS_VIDEO: 'video/timeline/recommend',
    // 视频详情
    GET_VIDEO_DETAIL: '/video/detail'
  },

  // 需要登录
  AUTH: {
    GET_RECORDS: '/user/record?type=1'
  }
}
