export type Playlist = {
  payload: number
  // 作者信息
  creator: {
    // 作者封面
    picUrl: string
    // 作者名
    name: string
    // 作者id
    id: string
  }
  // 歌曲数量
  trackCount: string
  // 订阅数量
  subscribedCount: string | number
  // 播放数量
  playCount: string | number
  // 评论数量
  commentCount: string | number
  // 分享数量
  shareCount: string | number
  // 发布日期
  createTime: string
  // 歌曲id集合
  trackIds: Array<number>
  // 歌名
  title: string
  // 歌曲描述
  desc: string
  // 歌曲封面
  picUrl: string
  // 是否订阅了歌单
  subscribed: boolean
}

export type Song = {
  // 是否为插播歌曲（手动添加）
  preference?: boolean
  // 序号
  idx?: number
  // 最高音质
  maxQ: string
  // id
  payload: number
  // MV
  mv: null | number
  // 作者名
  artist: string
  // 作者名(raw)
  ar: string
  // 创作者(多人)
  creator: string
  // 歌曲封面
  picUrl: string
  // 歌曲名
  title: string
  // 来自专辑
  album: string
  // 发布时间 年
  publishTime: string
  // 歌曲时长，单位分钟
  duration: number
  // 是否需要会员
  fee: number
  // 链接
  url?: string
}
