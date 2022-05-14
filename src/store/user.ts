import { defineStore } from 'pinia'
import { get } from '@/common/apiService'
import API from '@/common/api'
import moment from 'moment'

type UserInfo = {
  // 等级
  level: number
  // 会员类型
  vipType: number
  // 用户名
  name: string
  // 粉丝
  followeds: number
  // 关注
  follows: number
  // 头像
  avatarUrl: string
  // 背景
  backgroundUrl: string

  // 听歌数量
  listenSongs: string
  // 动态数量
  eventCount: string
  // 歌单数量
  playlist: string

  // 基本信息
  baseInfo: {
    // 创建天数
    createDays: number
    // 创建时间
    createTime: number
    // 个性签名
    signature: string
    // 社交帐号
    bindings: any
  }
}

export const useStore = defineStore('user', {
  state: () => {
    return {
      userId: 0,

      // 登陆状态
      auth: !!uni.getStorageSync('cookie')
    }
  },
  getters: {
    // 登录状态
    getIsAuth(): boolean {
      return this.auth
    }
  },
  actions: {
    // 保存用户信息
    setUserInfo(data: any) {
      Object.assign(this, data)
    },

    // 获取账户信息(登录)
    async getUserAccount(): Promise<any> {
      const res = await get(API.USER.GET_ACCOUNT, {}, true)
      if (res.code === 200 && res.profile) {
        this.setUserInfo({
          userId: res.profile.userId
        })
      }
    },

    // 获取用户信息
    async getUserDetail(id: number): Promise<{ data: UserInfo; type: string } | undefined> {
      const resJson = await get(API.USER.GET_USER_DETAIL, { uid: id }, true)

      if (resJson.code !== 200) return undefined

      const data: UserInfo = {
        // 等级
        level: resJson.level,
        // 会员类型
        vipType: resJson.profile.vipType,
        // 用户名
        name: resJson.profile.nickname,
        // 粉丝
        followeds: resJson.profile.followeds,
        // 关注
        follows: resJson.profile.follows,
        // 头像
        avatarUrl: resJson.profile.avatarUrl,
        // 背景
        backgroundUrl: resJson.profile.backgroundUrl,

        // 听歌数量
        listenSongs: resJson.listenSongs,
        // 动态数量
        eventCount: resJson.profile.eventCount,
        // 歌单数量
        playlist: resJson.profile.playlistCount,

        // 基本信息
        baseInfo: {
          // 创建天数
          createDays: resJson.createDays,
          // 创建时间
          createTime: resJson.createTime,
          // 个性签名
          signature: resJson.profile.signature,
          // 社交帐号
          bindings: resJson.bindings
        }
      }

      return {
        data,
        type: 'UserDetail'
      }
    },

    // 获取用户歌单 (可选登录)
    async getUserPlaylist(id: number, limit: number = 30, offset: number = 0): Promise<any> {
      const resJson = await get(API.USER.GET_USER_PLAYLIST, { uid: id, limit, offset }, true)

      const playlist = resJson.playlist.map((v: any) => {
        return {
          specialType: v.specialType,
          // 歌单名字
          title: v.name,
          // 封面
          picUrl: v.coverImgUrl,
          // 创建者
          creator: v.creator,
          // ID
          payload: v.id,
          // 播放数量
          playCount: v.playCount,
          // 歌曲数量
          trackCount: v.trackCount,
          // 是否私密
          privacy: v.privacy
        }
      })

      return {
        data: { playlist },
        more: resJson.more,
        type: 'UserPlaylist'
      }
    },

    // 获取歌手信息
    async getArtistDetail(id: number): Promise<any> {
      const resJson = await get(API.ART.GET_ARTIST_DETAIL, { id })
      const data: any = {
        // 用户名
        name: resJson.data.artist.name,
        // 粉丝
        followeds: undefined,
        // 关注
        follows: undefined,
        // 头像
        avatarUrl: resJson.data.artist.cover,
        // 背景
        backgroundUrl: resJson.data.artist.cover,
        // 标签
        tags: resJson.data.identify?.imageDesc || undefined,
        // 动态数量
        eventCount: resJson.data.eventCount,
        // MV、视频数量
        mvSize: resJson.data.artist.mvSize,
        // 歌曲数量
        musicSize: resJson.data.artist.musicSize,
        // 专辑数量
        albumSize: resJson.data.artist.albumSize
      }

      return {
        data: data,
        type: 'ArtistDetail'
      }
    },

    // 获取歌手单曲
    async getArtistSong(id: number): Promise<any> {
      const resJson = await get(API.ART.GET_ARTIST_SONG, { id })
      const data = resJson.hotSongs.map((v: any) => v.id)
      return {
        data: { trackIds: data },
        type: 'ArtistSong'
      }
    },

    // 获取相似歌手
    async getSimiArtist(id: number): Promise<any> {
      const resJson = await get(API.ART.GET_ARTIST_SIMI, { id })
      const data: any = resJson.artists.map((v: any) => {
        return {
          payload: v.id,
          name: v.name,
          picUrl: v.img1v1Url,
          sub: v.fansCount,
          type: 'artist'
        }
      })
      return {
        data,
        type: 'SimiArtist'
      }
    },

    // 获取歌手专辑
    async getArtistAlbum(id: number): Promise<any> {
      const resJson = await get(API.ART.GET_ARTIST_ALBUM, { id })
      const data: Array<any> = resJson.hotAlbums.map((v: any): any => {
        return {
          // 歌单名字
          title: v.name,
          // 封面
          picUrl: v.picUrl,
          // 创建者
          creator: v.creator,
          // ID
          payload: v.id,
          // 播放数量
          playCount: v.playCount,
          // 歌曲数量
          trackCount: v.trackCount,
          // 发布事件
          publishTime: moment(v?.publishTime).format('YYYY-M-D'),
          // 数量
          size: v?.size
        }
      })
      return {
        data: { playlist: data },
        type: 'ArtistAlbum'
      }
    },

    // 获取歌手粉丝
    async getArtistFans(id: string): Promise<any> {
      const resJson = await get(API.ART.GET_ARTIST_FANS, { id })
      return {
        data: {
          // 粉丝
          followeds: resJson.data.fansCnt,
          // 关注
          follows: resJson.data.followCnt
        },
        type: 'ArtistFans'
      }
    }
  }
})
